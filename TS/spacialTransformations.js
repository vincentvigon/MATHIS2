/**
 * Created by vigon on 04/07/2016.
 */
var mathis;
(function (mathis) {
    var spacialTransformations;
    (function (spacialTransformations) {
        var RoundSomeStrates = (function () {
            function RoundSomeStrates(mamesh) {
                this.propBeginToRound = 0;
                this.propEndToRound = 1;
                /**if it stays null, this interval is computed from propIntervalToRound*/
                this.integerBeginToRound = null;
                this.integerEndToRound = null;
                this.exponentOfRoundingFunction = 1;
                this.referenceRadiusIsMinVersusMaxVersusMean = 2;
                this.preventStratesCrossings = true;
                this.mamesh = mamesh;
            }
            RoundSomeStrates.prototype.goChanging = function () {
                if (isNaN(this.exponentOfRoundingFunction))
                    throw 'must be a number';
                if (this.propBeginToRound < 0 || this.propBeginToRound > 1)
                    throw 'must be in [0,1]';
                if (this.propEndToRound < 0 || this.propEndToRound > 1)
                    throw 'must be in [0,1]';
                if (this.propBeginToRound >= this.propEndToRound)
                    return;
                var border = [];
                for (var _i = 0, _a = this.mamesh.vertices; _i < _a.length; _i++) {
                    var ver = _a[_i];
                    if (ver.hasMark(mathis.Vertex.Markers.border))
                        border.push(ver);
                }
                var rings = mathis.graph.ringify(border);
                if (this.integerBeginToRound == null)
                    this.integerBeginToRound = Math.floor(rings.length * this.propBeginToRound);
                if (this.integerEndToRound == null)
                    this.integerEndToRound = Math.ceil(rings.length * this.propEndToRound);
                if (this.integerEndToRound < 0)
                    this.integerEndToRound = rings.length + this.integerEndToRound;
                if (this.integerBeginToRound > rings.length || this.integerBeginToRound < 0)
                    throw 'problem';
                if (this.integerEndToRound > rings.length || this.integerEndToRound < 0)
                    throw 'problem';
                if (this.integerEndToRound <= this.integerBeginToRound)
                    return;
                var barycenter = new mathis.XYZ(0, 0, 0);
                for (var _b = 0, _c = this.mamesh.vertices; _b < _c.length; _b++) {
                    var vertex = _c[_b];
                    barycenter.add(vertex.position);
                }
                barycenter.scale(1 / this.mamesh.vertices.length);
                var temp = new mathis.XYZ(0, 0, 0);
                var lastReferenceRadius = null;
                //let i:number
                for (var i = this.integerBeginToRound; i < this.integerEndToRound; i++) {
                    var maxRadius = -1;
                    var minRadius = Number.POSITIVE_INFINITY;
                    var meanRadois = 0;
                    for (var _d = 0, _e = rings[i]; _d < _e.length; _d++) {
                        var v = _e[_d];
                        var radius = mathis.geo.distance(v.position, barycenter);
                        if (radius > maxRadius)
                            maxRadius = radius;
                        if (radius < minRadius)
                            minRadius = radius;
                        meanRadois += radius;
                    }
                    meanRadois /= rings[i].length;
                    /** when the last strate is made of a vertex which position is the barycenter, maxRadius si zero */
                    if (maxRadius > mathis.geo.epsilon) {
                        var referenceRadius = void 0;
                        if (this.referenceRadiusIsMinVersusMaxVersusMean == 0)
                            referenceRadius = minRadius;
                        else if (this.referenceRadiusIsMinVersusMaxVersusMean == 1)
                            referenceRadius = maxRadius;
                        else if (this.referenceRadiusIsMinVersusMaxVersusMean == 2)
                            referenceRadius = meanRadois;
                        lastReferenceRadius = referenceRadius;
                        for (var _f = 0, _g = rings[i]; _f < _g.length; _f++) {
                            var v = _g[_f];
                            var newPosition = temp.copyFrom(v.position).substract(barycenter);
                            var length_1 = newPosition.length();
                            var ratio = Math.pow(referenceRadius / length_1, this.exponentOfRoundingFunction);
                            newPosition.scale(ratio);
                            v.position.copyFrom(newPosition.add(barycenter));
                        }
                    }
                }
                if (this.preventStratesCrossings) {
                    if (this.integerBeginToRound > 0) {
                        var maxRadiusOfRound = -1;
                        for (var _h = 0, _j = rings[this.integerBeginToRound]; _h < _j.length; _h++) {
                            var v = _j[_h];
                            var radius = mathis.geo.distance(v.position, barycenter);
                            if (radius > maxRadiusOfRound)
                                maxRadiusOfRound = radius;
                        }
                        var minRadiusOfNonExterior = Number.POSITIVE_INFINITY;
                        for (var _k = 0, _l = rings[this.integerBeginToRound - 1]; _k < _l.length; _k++) {
                            var v = _l[_k];
                            var radius = mathis.geo.distance(v.position, barycenter);
                            if (radius < minRadiusOfNonExterior)
                                minRadiusOfNonExterior = radius;
                        }
                        var factor = null;
                        if (1.1 * maxRadiusOfRound > minRadiusOfNonExterior)
                            factor = (1.1 * maxRadiusOfRound) / minRadiusOfNonExterior;
                        if (factor != null) {
                            for (var j = 0; j < this.integerBeginToRound; j++) {
                                for (var _m = 0, _o = rings[j]; _m < _o.length; _m++) {
                                    var v = _o[_m];
                                    v.position.copyFrom(temp.copyFrom(v.position).substract(barycenter).scale(factor).add(barycenter));
                                }
                            }
                        }
                    }
                    if (this.integerEndToRound < rings.length) {
                        var minRadiusOfRound = Number.POSITIVE_INFINITY;
                        for (var _p = 0, _q = rings[this.integerEndToRound - 1]; _p < _q.length; _p++) {
                            var v = _q[_p];
                            var radius = mathis.geo.distance(v.position, barycenter);
                            if (radius < minRadiusOfRound)
                                minRadiusOfRound = radius;
                        }
                        var maxRadiusOfInterior = -1;
                        for (var _r = 0, _s = rings[this.integerEndToRound]; _r < _s.length; _r++) {
                            var v = _s[_r];
                            var radius = mathis.geo.distance(v.position, barycenter);
                            if (radius > maxRadiusOfInterior)
                                maxRadiusOfInterior = radius;
                        }
                        var factor = null;
                        if (1.1 * maxRadiusOfInterior > minRadiusOfRound)
                            factor = minRadiusOfRound / (1.1 * maxRadiusOfInterior);
                        if (factor != null) {
                            for (var j = this.integerEndToRound; j < rings.length; j++) {
                                for (var _t = 0, _u = rings[j]; _t < _u.length; _t++) {
                                    var v = _u[_t];
                                    v.position.copyFrom(temp.copyFrom(v.position).substract(barycenter).scale(factor).add(barycenter));
                                }
                            }
                        }
                    }
                }
            };
            return RoundSomeStrates;
        }());
        spacialTransformations.RoundSomeStrates = RoundSomeStrates;
        var Similitude = (function () {
            function Similitude(vertices, angle, vectorForTranslation, sizesForResize) {
                if (vectorForTranslation === void 0) { vectorForTranslation = new mathis.XYZ(0, 0, 0); }
                if (sizesForResize === void 0) { sizesForResize = new mathis.XYZ(1, 1, 1); }
                this.axisForRotation = new mathis.XYZ(0, 0, 1);
                /**if null, it is the barycenter*/
                this.centerForSimilitude = null;
                this.vertices = vertices;
                this.angle = angle;
                this.vectorForTranslation = vectorForTranslation;
                this.sizesForResize = sizesForResize;
            }
            Similitude.prototype.goChanging = function () {
                var _this = this;
                if (this.centerForSimilitude == null) {
                    this.centerForSimilitude = new mathis.XYZ(0, 0, 0);
                    var w_1 = 1 / this.vertices.length;
                    var ws_1 = [];
                    var positions_1 = [];
                    this.vertices.forEach(function (v) {
                        positions_1.push(v.position);
                        ws_1.push(w_1);
                    });
                    mathis.geo.baryCenter(positions_1, ws_1, this.centerForSimilitude);
                }
                var mat = new mathis.MM();
                mathis.geo.axisAngleToMatrix(this.axisForRotation, this.angle, mat);
                this.vertices.forEach(function (v) {
                    v.position.substract(_this.centerForSimilitude);
                    v.position.resizes(_this.sizesForResize);
                    mathis.geo.multiplicationMatrixVector(mat, v.position, v.position);
                    v.position.add(_this.centerForSimilitude).add(_this.vectorForTranslation);
                });
            };
            return Similitude;
        }());
        spacialTransformations.Similitude = Similitude;
        function adjustInASquare(mamesh, origine, end) {
            var actualEnd = mathis.XYZ.newFrom(mamesh.vertices[0].position);
            var actualOrigin = mathis.XYZ.newFrom(mamesh.vertices[0].position);
            for (var _i = 0, _a = mamesh.vertices; _i < _a.length; _i++) {
                var vert = _a[_i];
                if (vert.position.x > actualEnd.x)
                    actualEnd.x = vert.position.x;
                if (vert.position.y > actualEnd.y)
                    actualEnd.y = vert.position.y;
                if (vert.position.x < actualOrigin.x)
                    actualOrigin.x = vert.position.x;
                if (vert.position.y < actualOrigin.y)
                    actualOrigin.y = vert.position.y;
            }
            var actualAmplitude = mathis.XYZ.newFrom(actualEnd).substract(actualOrigin);
            var ampli = mathis.XYZ.newFrom(end).substract(origine);
            var factor = new mathis.XYZ(ampli.x / actualAmplitude.x, ampli.y / actualAmplitude.y, 0);
            for (var _b = 0, _c = mamesh.vertices; _b < _c.length; _b++) {
                var vert = _c[_b];
                vert.position.substract(actualOrigin).resizes(factor).add(origine);
            }
        }
        spacialTransformations.adjustInASquare = adjustInASquare;
    })(spacialTransformations = mathis.spacialTransformations || (mathis.spacialTransformations = {}));
})(mathis || (mathis = {}));
