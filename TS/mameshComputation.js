/**
 * Created by vigon on 06/06/2016.
 */
var mathis;
(function (mathis) {
    var mameshAroundComputations;
    (function (mameshAroundComputations) {
        /**TODO code duplication with surfaceVisuMaker*/
        var PositioningComputerForMameshVertices = (function () {
            function PositioningComputerForMameshVertices(mamesh) {
                /**default value : the x-axis, but for orthogonals : the y-axis, but for orthogonals: the z-axis*/
                this.attractionOfTangent = new mathis.XYZ(1, 0.0123456721, 0.00078654343);
                this.computeTangent = true;
                this.computeNormal = true;
                this.computeSizes = true;
                this.sizesProp = new mathis.XYZ(0.3, 0.3, 0.3);
                this.allVerticesHaveSameSizes = true;
                this.temp = new mathis.XYZ(0, 0, 0);
                this._side1 = new mathis.XYZ(0, 0, 0);
                this._side2 = new mathis.XYZ(0, 0, 0);
                this.mamesh = mamesh;
            }
            PositioningComputerForMameshVertices.prototype.checkArgs = function () {
                if (this.mamesh.smallestSquares.length == 0 && this.mamesh.smallestTriangles.length == 0)
                    throw "no triangles nor Square. The normals cannot be computed";
            };
            PositioningComputerForMameshVertices.prototype.go = function () {
                var _this = this;
                var res = new mathis.HashMap();
                if (this.mamesh.vertices.length == 0) {
                    mathis.logger.c('you try to compute normal, tangent, diameter for an empty mamesh');
                    return;
                }
                this.mamesh.vertices.forEach(function (v) {
                    var positioning = new mathis.Positioning();
                    positioning.position = v.position;
                    positioning.upVector = new mathis.XYZ(0, 0, 0);
                    positioning.frontDir = new mathis.XYZ(0, 0, 0);
                    res.putValue(v, positioning);
                });
                /**tangent*/
                if (this.computeTangent) {
                    this.mamesh.vertices.forEach(function (vertex) {
                        var greaterDotProduct = Number.NEGATIVE_INFINITY;
                        var smallerDotProduct = Number.POSITIVE_INFINITY;
                        var bestDirection = new mathis.XYZ(0, 0, 0);
                        var worstDirection = new mathis.XYZ(0, 0, 0);
                        if (vertex.links.length == 0)
                            throw 'a vertex with no links. Impossible to compute a tangent';
                        var attractionOfTangentLenght = _this.attractionOfTangent.length();
                        for (var i = 0; i < vertex.links.length; i++) {
                            _this.temp.copyFrom(vertex.links[i].to.position).substract(vertex.position);
                            if (_this.temp.length() < mathis.geo.epsilon) {
                                mathis.logger.c('a mamesh has two vertices at almost the same position');
                            }
                            else {
                                var sca = mathis.geo.dot(_this.temp, _this.attractionOfTangent) / _this.temp.length() / attractionOfTangentLenght;
                                if (sca > greaterDotProduct) {
                                    greaterDotProduct = sca;
                                    bestDirection.copyFrom(_this.temp);
                                }
                                if (sca < smallerDotProduct) {
                                    smallerDotProduct = sca;
                                    worstDirection.copyFrom(_this.temp);
                                }
                            }
                        }
                        /**sometimes we prefer the opposite direction of the worst*/
                        if (-smallerDotProduct > 2 * greaterDotProduct)
                            res.getValue(vertex).frontDir.copyFrom(worstDirection.scale(-1));
                        else
                            res.getValue(vertex).frontDir.copyFrom(bestDirection);
                    });
                }
                /**normals*/
                if (this.computeNormal) {
                    /**triangulatedRect and square normals must be computed first*/
                    var triangleNormal = [];
                    for (var i = 0; i < this.mamesh.smallestTriangles.length / 3; i++) {
                        this._side1.copyFrom(this.mamesh.smallestTriangles[3 * i + 1].position).substract(this.mamesh.smallestTriangles[3 * i].position);
                        this._side2.copyFrom(this.mamesh.smallestTriangles[3 * i + 2].position).substract(this.mamesh.smallestTriangles[3 * i].position);
                        triangleNormal[i] = new mathis.XYZ(0, 0, 0);
                        mathis.geo.cross(this._side1, this._side2, triangleNormal[i]);
                        triangleNormal[i].normalize();
                    }
                    var squareNormal = [];
                    for (var i = 0; i < this.mamesh.smallestSquares.length / 4; i++) {
                        this._side1.copyFrom(this.mamesh.smallestSquares[4 * i + 1].position).substract(this.mamesh.smallestSquares[4 * i].position);
                        this._side2.copyFrom(this.mamesh.smallestSquares[4 * i + 3].position).substract(this.mamesh.smallestSquares[4 * i].position);
                        squareNormal[i] = new mathis.XYZ(0, 0, 0);
                        mathis.geo.cross(this._side1, this._side2, squareNormal[i]);
                        try {
                            squareNormal[i].normalize();
                        }
                        catch (e) {
                            throw 'the square' + this.mamesh.smallestSquares[4 * i].hashNumber + ',' + this.mamesh.smallestSquares[4 * i + 1].hashNumber + ',' + this.mamesh.smallestSquares[4 * i + 2].hashNumber + ',' + this.mamesh.smallestSquares[4 * i + 3].hashNumber + ' is degenerated';
                        }
                    }
                    /** now vertices normal are computed*/
                    for (var i = 0; i < triangleNormal.length; i++) {
                        var v0 = this.mamesh.smallestTriangles[3 * i];
                        var v1 = this.mamesh.smallestTriangles[3 * i + 1];
                        var v2 = this.mamesh.smallestTriangles[3 * i + 2];
                        res.getValue(v0).upVector.add(triangleNormal[i]);
                        res.getValue(v1).upVector.add(triangleNormal[i]);
                        res.getValue(v2).upVector.add(triangleNormal[i]);
                    }
                    for (var i = 0; i < squareNormal.length; i++) {
                        var v0 = this.mamesh.smallestSquares[4 * i];
                        var v1 = this.mamesh.smallestSquares[4 * i + 1];
                        var v2 = this.mamesh.smallestSquares[4 * i + 2];
                        var v3 = this.mamesh.smallestSquares[4 * i + 3];
                        res.getValue(v0).upVector.add(squareNormal[i]);
                        res.getValue(v1).upVector.add(squareNormal[i]);
                        res.getValue(v2).upVector.add(squareNormal[i]);
                        res.getValue(v3).upVector.add(squareNormal[i]);
                    }
                    var vertexWithoutNormal_1 = [];
                    this.mamesh.vertices.forEach(function (v) {
                        try {
                            res.getValue(v).upVector.normalize();
                        }
                        catch (e) {
                            mathis.logger.c('a too small upVector for a vertex, probably a vertex which is not in any polygone. The upVector will be the mean of other upVector');
                            vertexWithoutNormal_1.push(v);
                        }
                    });
                    if (vertexWithoutNormal_1.length > 0) {
                        var mean = new mathis.XYZ(0, 0, 0);
                        for (var _i = 0, _a = this.mamesh.vertices; _i < _a.length; _i++) {
                            var v = _a[_i];
                            mean.add(res.getValue(v).upVector); //perhaps zero
                        }
                        try {
                            mean.normalize();
                        }
                        catch (e) {
                            throw 'canot manage to compute upVector for any vertex';
                        }
                        for (var _b = 0, vertexWithoutNormal_2 = vertexWithoutNormal_1; _b < vertexWithoutNormal_2.length; _b++) {
                            var poorVertex = vertexWithoutNormal_2[_b];
                            res.getValue(poorVertex).upVector.copyFrom(mean);
                        }
                    }
                }
                /**sizes*/
                if (this.computeSizes) {
                    if (!this.allVerticesHaveSameSizes) {
                        this.mamesh.vertices.forEach(function (vertex) {
                            var sum = 0;
                            vertex.links.forEach(function (li) {
                                sum += mathis.geo.distance(vertex.position, li.to.position);
                            });
                            res.getValue(vertex).scaling.copyFrom(_this.sizesProp).scale(sum / vertex.links.length);
                        });
                    }
                    else {
                        var diam_1 = 0;
                        var vertex_1 = this.mamesh.vertices[0];
                        var sum_1 = 0;
                        vertex_1.links.forEach(function (li) {
                            sum_1 += mathis.geo.distance(vertex_1.position, li.to.position);
                        });
                        diam_1 = sum_1 / vertex_1.links.length;
                        this.mamesh.vertices.forEach(function (v) { return res.getValue(v).scaling.copyFrom(_this.sizesProp).scale(diam_1); });
                    }
                }
                return res;
            };
            return PositioningComputerForMameshVertices;
        }());
        mameshAroundComputations.PositioningComputerForMameshVertices = PositioningComputerForMameshVertices;
    })(mameshAroundComputations = mathis.mameshAroundComputations || (mathis.mameshAroundComputations = {}));
})(mathis || (mathis = {}));
