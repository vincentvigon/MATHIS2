/**
 * Created by vigon on 24/03/2016.
 */
var mathis;
(function (mathis) {
    var reseau;
    (function (reseau) {
        (function (Maille) {
            Maille[Maille["square"] = 0] = "square";
            Maille[Maille["triangle"] = 1] = "triangle";
            Maille[Maille["diamond"] = 2] = "diamond";
            Maille[Maille["hexagonal"] = 3] = "hexagonal";
            Maille[Maille["slash"] = 4] = "slash";
            Maille[Maille["croisillon"] = 5] = "croisillon";
        })(reseau.Maille || (reseau.Maille = {}));
        var Maille = reseau.Maille;
        var SingleTriangle = (function () {
            function SingleTriangle(mamesh) {
                this.makeLinks = true;
                this.markCorners = true;
                this.addALoopLineAround = false;
                this.mamesh = mamesh;
            }
            SingleTriangle.prototype.go = function () {
                var vert0 = this.mamesh.newVertex(new mathis.XYZ(0, 0, 0));
                var vert1 = this.mamesh.newVertex(new mathis.XYZ(0, 1, 0));
                var vert2 = this.mamesh.newVertex(new mathis.XYZ(1, 0, 0));
                //let triangulatedRect=new Polygone([vert1,vert2,vert3])
                //mesh.polygones.push(triangulatedRect)
                this.mamesh.addATriangle(vert0, vert1, vert2);
                if (this.markCorners) {
                    vert0.markers.push(mathis.Vertex.Markers.corner);
                    vert1.markers.push(mathis.Vertex.Markers.corner);
                    vert2.markers.push(mathis.Vertex.Markers.corner);
                }
                if (this.makeLinks) {
                    if (!this.addALoopLineAround) {
                        vert0.setOneLink(vert1);
                        vert0.setOneLink(vert2);
                        vert1.setOneLink(vert0);
                        vert1.setOneLink(vert2);
                        vert2.setOneLink(vert0);
                        vert2.setOneLink(vert1);
                    }
                    else {
                        vert0.setTwoOppositeLinks(vert1, vert2);
                        vert1.setTwoOppositeLinks(vert2, vert0);
                        vert2.setTwoOppositeLinks(vert0, vert1);
                    }
                }
                //else this.mamesh.linksOK=false
            };
            return SingleTriangle;
        }());
        reseau.SingleTriangle = SingleTriangle;
        var TriangulatedTriangle = (function () {
            function TriangulatedTriangle() {
                this.markCorner = true;
                this.markBorder = true;
                this.origin = new mathis.XYZ(-1, -1, 0);
                this.end = new mathis.XYZ(1, 1, 0);
                this.nbSubdivisionInSide = 6;
                this.setAllDichoLevelTo0 = true;
                this.mamesh = new mathis.Mamesh();
            }
            TriangulatedTriangle.prototype.go = function () {
                //this.mamesh.linksOK=true
                for (var i = 0; i < 3; i++) {
                    var param = new mathis.XYZ(Math.cos(2 * Math.PI * i / 3 - Math.PI / 2), Math.sin(2 * Math.PI * i / 3 - Math.PI / 2), 0);
                    var position = mathis.XYZ.newFrom(param);
                    var v = this.mamesh.newVertex(position, 0, param);
                    v.markers.push(mathis.Vertex.Markers.corner);
                }
                this.mamesh.addATriangle(this.mamesh.vertices[0], this.mamesh.vertices[1], this.mamesh.vertices[2]);
                var nbDic = Math.floor(Math.log(this.nbSubdivisionInSide) / Math.log(2));
                for (var dic = 0; dic < nbDic; dic++) {
                    var dicotomer = new mathis.mameshModification.TriangleDichotomer(this.mamesh);
                    dicotomer.makeLinks = false;
                    dicotomer.go();
                }
                if (Math.pow(2, nbDic) != this.nbSubdivisionInSide) {
                    var dicotomer = new mathis.mameshModification.TriangleDichotomer(this.mamesh);
                    dicotomer.makeLinks = false;
                    dicotomer.go();
                }
                /** to detect border we use the triangles*/
                var linkMaker = new mathis.linkModule.LinkCreaterSorterAndBorderDetecterByPolygons(this.mamesh);
                linkMaker.markIsolateVertexAsCorner = false;
                linkMaker.goChanging();
                /**for each strate suppressed, the side decrease of 3 segments*/
                if (Math.pow(2, nbDic) != this.nbSubdivisionInSide) {
                    var supress = new mathis.grateAndGlue.ExtractCentralPart(this.mamesh, Math.floor((Math.pow(2, nbDic + 1) - this.nbSubdivisionInSide) / 3));
                    supress.markBorder = this.markBorder;
                    this.mamesh = supress.go();
                    this.mamesh.isolateMameshVerticesFromExteriorVertices();
                }
                if (this.markCorner) {
                    for (var _i = 0, _a = this.mamesh.vertices; _i < _a.length; _i++) {
                        var v = _a[_i];
                        if (v.links.length == 2)
                            v.markers.push(mathis.Vertex.Markers.corner);
                    }
                }
                if (this.setAllDichoLevelTo0)
                    for (var _b = 0, _c = this.mamesh.vertices; _b < _c.length; _b++) {
                        var vertex = _c[_b];
                        vertex.dichoLevel = 0;
                    }
                mathis.spacialTransformations.adjustInASquare(this.mamesh, this.origin, this.end);
                return this.mamesh;
            };
            return TriangulatedTriangle;
        }());
        reseau.TriangulatedTriangle = TriangulatedTriangle;
        var TriangulatedPolygone = (function () {
            function TriangulatedPolygone(nbSides) {
                this.markCorner = true;
                this.markBorder = true;
                this.origin = new mathis.XYZ(-1, -1, 0);
                this.end = new mathis.XYZ(1, 1, 0);
                this.nbSubdivisionInARadius = 1;
                this.setAllDichoLevelTo0 = true;
                this.mamesh = new mathis.Mamesh();
                this.nbSides = nbSides;
            }
            TriangulatedPolygone.prototype.go = function () {
                //this.mamesh.linksOK=true
                var vert0 = this.mamesh.newVertex(new mathis.XYZ(0, 0, 0), 0, new mathis.XYZ(0, 0, 0));
                vert0.markers.push(mathis.Vertex.Markers.center);
                for (var i = 0; i < this.nbSides; i++) {
                    var param = new mathis.XYZ(Math.cos(2 * Math.PI * i / this.nbSides - Math.PI / 2), Math.sin(2 * Math.PI * i / this.nbSides - Math.PI / 2), 0);
                    var position = mathis.XYZ.newFrom(param);
                    var v = this.mamesh.newVertex(position, 0, param);
                    //if(this.markCorner) v.markers.push(Vertex.Markers.corner)
                    if (this.markBorder)
                        v.markers.push(mathis.Vertex.Markers.border);
                }
                for (var i = 1; i < this.nbSides + 1; i++) {
                    this.mamesh.addATriangle(this.mamesh.vertices[0], this.mamesh.vertices[i], this.mamesh.vertices[i % this.nbSides + 1]);
                }
                if (this.nbSides % 2 == 0) {
                    for (var i = 1; i <= this.nbSides / 2; i++) {
                        vert0.setTwoOppositeLinks(this.mamesh.vertices[i], this.mamesh.vertices[i + this.nbSides / 2]);
                    }
                }
                else {
                    for (var i = 1; i <= this.nbSides; i++)
                        vert0.setOneLink(this.mamesh.vertices[i]);
                }
                for (var i = 1; i <= this.nbSides; i++) {
                    var verti = this.mamesh.vertices[i];
                    var vertNext = (i == this.nbSides) ? this.mamesh.vertices[1] : this.mamesh.vertices[i + 1];
                    var vertPrev = (i == 1) ? this.mamesh.vertices[this.nbSides] : this.mamesh.vertices[i - 1];
                    verti.setOneLink(vert0);
                    // if (this.aLoopLineAround) verti.setTwoOppositeLinks(vertPrev,vertNext)
                    // else{
                    verti.setOneLink(vertNext);
                    verti.setOneLink(vertPrev);
                }
                var nbDic = Math.log(this.nbSubdivisionInARadius) / Math.log(2);
                for (var dic = 0; dic < nbDic; dic++) {
                    var dicotomer = new mathis.mameshModification.TriangleDichotomer(this.mamesh);
                    dicotomer.makeLinks = true;
                    dicotomer.go();
                }
                if (nbDic != Math.floor(nbDic)) {
                    /**one more dichotomy to add too much strates, and suppress some*/
                    var dicotomer = new mathis.mameshModification.TriangleDichotomer(this.mamesh);
                    dicotomer.makeLinks = true;
                    dicotomer.go();
                    var supress = new mathis.grateAndGlue.ExtractCentralPart(this.mamesh, -this.nbSubdivisionInARadius);
                    supress.markBorder = this.markBorder;
                    this.mamesh = supress.go();
                    this.mamesh.isolateMameshVerticesFromExteriorVertices();
                }
                if (this.markCorner) {
                    for (var _i = 0, _a = this.mamesh.vertices; _i < _a.length; _i++) {
                        var v = _a[_i];
                        if (v.links.length == 3)
                            v.markers.push(mathis.Vertex.Markers.corner);
                    }
                }
                mathis.spacialTransformations.adjustInASquare(this.mamesh, this.origin, this.end);
                if (this.setAllDichoLevelTo0)
                    for (var _b = 0, _c = this.mamesh.vertices; _b < _c.length; _b++) {
                        var vertex = _c[_b];
                        vertex.dichoLevel = 0;
                    }
                //this.mamesh.symmetries=symmetries.getAllPolygonalRotations(this.nbSides)
                return this.mamesh;
            };
            return TriangulatedPolygone;
        }());
        reseau.TriangulatedPolygone = TriangulatedPolygone;
        var BasisForRegularReseau = (function () {
            function BasisForRegularReseau() {
                this.nbI = 3;
                this.set_nbJ_toHaveRegularReseau = false;
                this.nbJ = 3;
                this.origin = new mathis.XYZ(0, 0, 0);
                this.end = new mathis.XYZ(1, 1, 0);
                this.kComponentTranslation = 0;
                this.nbVerticalDecays = 0;
                this.nbHorizontalDecays = 0;
                /**only usefull when we use set_nbJ_toHaveRegularReseau=true*/
                this.squareMailleInsteadOfTriangle = true;
            }
            BasisForRegularReseau.prototype.go = function () {
                this.checkArgs();
                var deltaX = (this.end.x - this.origin.x) / (this.nbI - 1);
                var deltaY;
                if (this.set_nbJ_toHaveRegularReseau) {
                    if (this.squareMailleInsteadOfTriangle)
                        deltaY = deltaX;
                    else
                        deltaY = deltaX * Math.sqrt(3) / 2;
                    this.nbJ = Math.floor(((this.end.y - this.origin.y) / deltaY + 1));
                }
                else {
                    deltaY = (this.end.y - this.origin.y) / (this.nbJ - 1);
                }
                var A = (this.end.x - this.origin.x);
                var B = (this.end.y - this.origin.y);
                var VX = this.computeDecayVector(deltaX, A, deltaY, B, this.nbVerticalDecays, this.nbHorizontalDecays);
                var preVY = this.computeDecayVector(deltaY, B, deltaX, A, this.nbHorizontalDecays, this.nbVerticalDecays);
                var VY = new mathis.XYZ(preVY.y, preVY.x, 0);
                VX.z += this.kComponentTranslation;
                VY.z += this.kComponentTranslation;
                return { Vi: VX, Vj: VY, nbI: this.nbI, nbJ: this.nbJ };
            };
            BasisForRegularReseau.prototype.checkArgs = function () {
                var A = (this.end.x - this.origin.x);
                var B = (this.end.y - this.origin.y);
                if (Math.abs(A) < mathis.geo.epsilon || Math.abs(B) < mathis.geo.epsilon)
                    throw 'origin and end are almost in the same line';
                if (this.nbI < 2)
                    throw 'this.nbI must be >=2';
                if (this.nbJ < 2)
                    throw 'this.nbJ must be >=2';
            };
            BasisForRegularReseau.prototype.computeDecayVector = function (a, A, b, B, dV, dH) {
                var res = new mathis.XYZ(0, 0, 0);
                res.x = a * A * B / (A * B - a * b * dH * dV);
                res.y = b * dV / A * res.x;
                return res;
            };
            return BasisForRegularReseau;
        }());
        reseau.BasisForRegularReseau = BasisForRegularReseau;
        var aParam = new mathis.XYZ(0, 0, 0);
        function makeLinksFromDeltaParam(cell, dir1, dir2, paramToVertex) {
            {
                aParam.copyFromFloats(cell.param.x, cell.param.y, cell.param.z).add(dir1);
                var c = paramToVertex.getValue(aParam);
                aParam.copyFromFloats(cell.param.x, cell.param.y, cell.param.z).add(dir2);
                var cc_1 = paramToVertex.getValue(aParam);
                if (c != null && cc_1 != null)
                    cell.setTwoOppositeLinks(c, cc_1);
                else if (c == null && cc_1 != null)
                    cell.setOneLink(cc_1);
                else if (c != null && cc_1 == null)
                    cell.setOneLink(c);
            }
        }
        var tempPapa = new mathis.XYZ(0, 0, 0);
        function makeSquareFromDeltaParam(cell, mamesh, dir1, dir2, paramToVertex) {
            var v1 = cell;
            if (v1 == null)
                return;
            var v2 = paramToVertex.getValue(tempPapa.copyFrom(cell.param).add(dir1)); //this.getVertex(i+1,j)
            if (v2 == null)
                return;
            var v3 = paramToVertex.getValue(tempPapa.copyFrom(cell.param).add(dir1).add(dir2)); //this.getVertex(i+1,j+1)
            if (v3 == null)
                return;
            var v4 = paramToVertex.getValue(tempPapa.copyFrom(cell.param).add(dir2));
            if (v4 == null)
                return;
            mamesh.addASquare(v1, v2, v3, v4);
        }
        var Regular = (function () {
            function Regular(generator) {
                this.nbI = 3;
                this.nbJ = 3;
                this.fixedK = 0;
                this.Vi = new mathis.XYZ(1, 0, 0);
                this.Vj = new mathis.XYZ(0, 1, 0);
                this.Vk = new mathis.XYZ(0, 0, 0);
                this.origine = new mathis.XYZ(0, 0, 0);
                /**these 3 fields are reported on Regular3d*/
                this.makeLinks = true;
                this.makeTriangleOrSquare = true;
                this.squareVersusTriangleMaille = true;
                this.oneMoreVertexForOddLine = false;
                this.holeParameters = new mathis.HashMap();
                this.markCorner = true;
                this.markBorder = true;
                this.markCenter = true;
                this.putAVertexOnlyAtXYZCheckingThisCondition = null;
                this._xyz = new mathis.XYZ(0, 0, 0);
                this._iDirection = new mathis.XYZ(0, 0, 0);
                this._jDirection = new mathis.XYZ(0, 0, 0);
                this._kDirection = new mathis.XYZ(0, 0, 0);
                this.paramToVertex = new mathis.HashMap(true);
                this.mamesh = new mathis.Mamesh();
                if (generator != null) {
                    var VV = generator.go();
                    this.Vi.copyFrom(VV.Vi);
                    this.Vj.copyFrom(VV.Vj);
                    this.nbI = VV.nbI;
                    this.nbJ = VV.nbJ;
                    this.origine.copyFrom(generator.origin);
                    this.squareVersusTriangleMaille = generator.squareMailleInsteadOfTriangle;
                }
            }
            Regular.prototype.checkArgs = function () {
                if (!this.makeTriangleOrSquare && !this.makeLinks)
                    mathis.logger.c('few interest if you do not add neither square nor links');
                var cros = new mathis.XYZ(0, 0, 0);
                mathis.geo.cross(this.Vi, this.Vj, cros);
                if (cros.x == Number.NaN || cros.y == Number.NaN || cros.z == Number.NaN)
                    throw 'a problem with Vi of Vj';
                if (cros.length() < mathis.geo.epsilon)
                    throw 'origin and end are almost in the same line';
            };
            Regular.prototype.getVertex = function (i, j) {
                this._xyz.x = i;
                this._xyz.y = j;
                this._xyz.z = this.fixedK;
                return this.paramToVertex.getValue(this._xyz); //this.paramToVertex[i+','+j]
            };
            Regular.prototype.go = function () {
                this.checkArgs();
                for (var i = 0; i < this.nbI; i++) {
                    for (var j = 0; j < this.nbJ; j++) {
                        var param = new mathis.XYZ(i, j, this.fixedK);
                        if (this.holeParameters == null || !this.holeParameters.getValue(param)) {
                            var decay = (!this.squareVersusTriangleMaille && j % 2 == 0) ? 0.5 : 0;
                            this._iDirection.copyFrom(this.Vi).scale(i + decay);
                            this._jDirection.copyFrom(this.Vj).scale(j);
                            this._kDirection.copyFrom(this.Vk).scale(this.fixedK);
                            var position = new mathis.XYZ(0, 0, 0).add(this._iDirection).add(this._jDirection).add(this._kDirection).add(this.origine);
                            if (this.putAVertexOnlyAtXYZCheckingThisCondition == null || this.putAVertexOnlyAtXYZCheckingThisCondition(position)) {
                                var vertex = this.mamesh.newVertex(position, 0, param);
                                this.paramToVertex.putValue(param, vertex);
                            }
                        }
                    }
                }
                /**to get a vertical symmetry when vertex are in quinconce*/
                if (this.oneMoreVertexForOddLine) {
                    var i = this.nbI;
                    for (var j = 0; j < this.nbJ; j++) {
                        if (j % 2 == 1) {
                            var param = new mathis.XYZ(i, j, this.fixedK);
                            if (this.holeParameters == null || !this.holeParameters.getValue(param)) {
                                var decay = (!this.squareVersusTriangleMaille && j % 2 == 0) ? 0.5 : 0;
                                this._iDirection.copyFrom(this.Vi).scale(i + decay);
                                this._jDirection.copyFrom(this.Vj).scale(j);
                                this._kDirection.copyFrom(this.Vk).scale(this.fixedK);
                                var position = new mathis.XYZ(0, 0, 0).add(this._iDirection).add(this._jDirection).add(this._kDirection).add(this.origine);
                                if (this.putAVertexOnlyAtXYZCheckingThisCondition == null || this.putAVertexOnlyAtXYZCheckingThisCondition(position)) {
                                    var vertex = this.mamesh.newVertex(position, 0, param);
                                    this.paramToVertex.putValue(param, vertex);
                                }
                            }
                        }
                    }
                }
                if (this.mamesh.vertices.length == 0)
                    console.log('you have created a IN_mamesh with no vertex. Perhaps because of {@link Regular.putAVertexOnlyAtXYZCheckingThisCondition }');
                if (this.makeLinks) {
                    //this.mamesh.linksOK=true
                    if (!this.squareVersusTriangleMaille)
                        this.linksCreationForTriangle();
                    else
                        this.linksCreationForSquare();
                }
                if (this.makeTriangleOrSquare) {
                    if (!this.squareVersusTriangleMaille)
                        this.triangleCreation();
                    else
                        this.squareCreation();
                }
                if (this.markBorder) {
                    if (this.squareVersusTriangleMaille) {
                        for (var _i = 0, _a = this.mamesh.vertices; _i < _a.length; _i++) {
                            var v = _a[_i];
                            if (v.links.length != 4)
                                v.markers.push(mathis.Vertex.Markers.border);
                        }
                    }
                    else {
                        for (var _b = 0, _c = this.mamesh.vertices; _b < _c.length; _b++) {
                            var v = _c[_b];
                            if (v.links.length != 6)
                                v.markers.push(mathis.Vertex.Markers.border);
                        }
                    }
                }
                if (this.markCorner) {
                    var oneMore = (this.oneMoreVertexForOddLine && this.nbJ % 2 == 0) ? 1 : 0;
                    var vertex = void 0;
                    vertex = this.getVertex(0, 0);
                    if (vertex != null)
                        vertex.markers.push(mathis.Vertex.Markers.corner);
                    vertex = this.getVertex(this.nbI - 1 + oneMore, this.nbJ - 1);
                    if (vertex != null)
                        vertex.markers.push(mathis.Vertex.Markers.corner);
                    vertex = this.getVertex(0, this.nbJ - 1);
                    if (vertex != null)
                        vertex.markers.push(mathis.Vertex.Markers.corner);
                    vertex = this.getVertex(this.nbI - 1, 0);
                    if (vertex != null)
                        vertex.markers.push(mathis.Vertex.Markers.corner);
                }
                if (this.markCenter) {
                    var iCenter = this.nbI / 2;
                    var iCenters = [];
                    if (Math.floor(iCenter) != iCenter) {
                        iCenters.push(Math.floor(iCenter));
                    }
                    else
                        iCenters.push(Math.floor(iCenter), Math.floor(iCenter) - 1);
                    var jCenter = this.nbJ / 2;
                    var jCenters = [];
                    if (Math.floor(jCenter) != jCenter) {
                        jCenters.push(Math.floor(jCenter));
                    }
                    else
                        jCenters.push(Math.floor(jCenter), Math.floor(jCenter) - 1);
                    for (var _d = 0, iCenters_1 = iCenters; _d < iCenters_1.length; _d++) {
                        var i = iCenters_1[_d];
                        for (var _e = 0, jCenters_1 = jCenters; _e < jCenters_1.length; _e++) {
                            var j = jCenters_1[_e];
                            var vertex = this.getVertex(i, j);
                            if (vertex != null)
                                vertex.markers.push(mathis.Vertex.Markers.center);
                        }
                    }
                }
                //this.mamesh.symmetries=symmetries.cartesianAsArray(this.nbI,this.nbJ,this.oneMoreVertexForOddLine)
                return this.mamesh;
            };
            Regular.prototype.linksCreationForSquare = function () {
                var _this = this;
                this.mamesh.vertices.forEach(function (cell) {
                    makeLinksFromDeltaParam(cell, mathis.XYZ.temp0(1, 0, 0), mathis.XYZ.temp1(-1, 0, 0), _this.paramToVertex);
                    makeLinksFromDeltaParam(cell, mathis.XYZ.temp0(0, 1, 0), mathis.XYZ.temp1(0, -1, 0), _this.paramToVertex);
                    // {
                    //     let c:Vertex = this.getVertex(cell.param.x + 1, cell.param.y)
                    //     let cc:Vertex = this.getVertex(cell.param.x - 1, cell.param.y)
                    //
                    //     if (c != null && cc != null) cell.setTwoOppositeLinks(c,cc,false)
                    //     else if (c == null && cc != null) cell.setOneLink(cc,true)
                    //     else if (c != null && cc == null) cell.setOneLink(c,true)
                    //
                    // }
                    //
                    // {
                    //
                    //     let c:Vertex = this.getVertex(cell.param.x  , cell.param.y+1);
                    //     let cc:Vertex = this.getVertex(cell.param.x  , cell.param.y-1);
                    //     if (c != null && cc != null) cell.setTwoOppositeLinks(c,cc,false)
                    //     else if (c == null && cc != null) cell.setOneLink(cc,true)
                    //     else if (c != null && cc == null) cell.setOneLink(c,true)
                    //
                    // }
                });
            };
            Regular.prototype.squareCreation = function () {
                var dir1 = new mathis.XYZ(1, 0, 0);
                var dir2 = new mathis.XYZ(0, 1, 0);
                for (var _i = 0, _a = this.mamesh.vertices; _i < _a.length; _i++) {
                    var vertex = _a[_i];
                    makeSquareFromDeltaParam(vertex, this.mamesh, dir1, dir2, this.paramToVertex);
                }
                // for (let i = 0; i<this.nbI-1; i++){
                //     for (let j=0; j<this.nbJ-1; j++){
                //
                //         let v1=this.getVertex(i,j)
                //         if (v1==null)  continue;
                //
                //         let v2=this.getVertex(i+1,j)
                //         if (v2==null) continue;
                //
                //         let v3=this.getVertex(i+1,j+1)
                //         if (v3==null) continue;
                //
                //         let v4=this.getVertex(i,j+1)
                //         if (v4==null)  continue;
                //
                //         this.IN_mamesh.addASquare(v1,v2,v3,v4)
                //     }
                // }
            };
            Regular.prototype.linksCreationForTriangle = function () {
                var _this = this;
                this.mamesh.vertices.forEach(function (cell) {
                    makeLinksFromDeltaParam(cell, mathis.XYZ.temp0(1, 0, 0), mathis.XYZ.temp1(-1, 0, 0), _this.paramToVertex);
                    /**even lines */
                    if (cell.param.y % 2 == 0) {
                        /** sud est - nord ouest*/
                        makeLinksFromDeltaParam(cell, mathis.XYZ.temp0(1, 1, 0), mathis.XYZ.temp1(0, -1, 0), _this.paramToVertex);
                        /** sud ouest - nord est*/
                        makeLinksFromDeltaParam(cell, mathis.XYZ.temp0(0, 1, 0), mathis.XYZ.temp1(1, -1, 0), _this.paramToVertex);
                    }
                    else {
                        /**sud est - nord ouest*/
                        makeLinksFromDeltaParam(cell, mathis.XYZ.temp0(0, 1, 0), mathis.XYZ.temp1(-1, -1, 0), _this.paramToVertex);
                        /**sud ouest - nord est*/
                        makeLinksFromDeltaParam(cell, mathis.XYZ.temp0(-1, 1, 0), mathis.XYZ.temp1(0, -1, 0), _this.paramToVertex);
                    }
                });
            };
            Regular.prototype.triangleCreation = function () {
                for (var _i = 0, _a = this.mamesh.vertices; _i < _a.length; _i++) {
                    var vertex = _a[_i];
                    var i = vertex.param.x;
                    var j = vertex.param.y;
                    if (j % 2 == 0) {
                        var v1 = vertex;
                        var v2 = this.getVertex(i + 1, j + 1);
                        if (v2 == null)
                            continue;
                        var v3 = this.getVertex(i, j + 1);
                        if (v3 != null)
                            this.mamesh.addATriangle(v1, v2, v3);
                        var v4 = this.getVertex(i + 1, j);
                        if (v4 != null)
                            this.mamesh.addATriangle(v1, v4, v2);
                    }
                    else {
                        var v1 = vertex;
                        var v2 = this.getVertex(i, j + 1);
                        if (v2 == null)
                            continue;
                        var v3 = this.getVertex(i + 1, j);
                        if (v3 != null)
                            this.mamesh.addATriangle(v1, v3, v2);
                        var v4 = this.getVertex(i + 1, j + 1);
                        if (v4 != null)
                            this.mamesh.addATriangle(v2, v3, v4);
                    }
                }
            };
            return Regular;
        }());
        reseau.Regular = Regular;
        var Regular1D = (function () {
            function Regular1D(size) {
                if (size === void 0) { size = 5; }
                this.size = size;
                this.origin = new mathis.XYZ(0, 0, 0);
                this.end = new mathis.XYZ(1, 0, 0);
            }
            Regular1D.prototype.go = function () {
                var res = new mathis.Mamesh();
                for (var i = 0; i < this.size; i++) {
                    var vertex = new mathis.Vertex();
                    vertex.position = this.iToXYX(i);
                    res.vertices.push(vertex);
                }
                for (var i = 1; i < this.size - 1; i++) {
                    res.vertices[i].setTwoOppositeLinks(res.vertices[i - 1], res.vertices[i + 1]);
                }
                res.vertices[0].setOneLink(res.vertices[1]);
                res.vertices[this.size - 1].setOneLink(res.vertices[this.size - 2]);
                return res;
            };
            Regular1D.prototype.iToXYX = function (i) {
                var delta = i / (this.size - 1);
                return mathis.XYZ.newFrom(this.end).substract(this.origin).scale(delta).add(this.origin);
            };
            return Regular1D;
        }());
        reseau.Regular1D = Regular1D;
        var Regular3D = (function () {
            function Regular3D() {
                this.nbI = 3;
                this.nbJ = 3;
                this.nbK = 3;
                this.Vi = new mathis.XYZ(1, 0, 0);
                this.Vj = new mathis.XYZ(0, 1, 0);
                this.Vk = new mathis.XYZ(0, 0, 1);
                this.origine = new mathis.XYZ(0, 0, 0);
                this.decayOddStrates = false;
                /**these 3 fields are reported on Regular3d*/
                this.makeLinks = true;
                this.makeTriangleOrSquare = true;
                this.strateHaveSquareMailleVersusTriangleMaille = true;
                this.oneMoreVertexForOddLine = false;
                this.interStrateMailleAreSquareVersusTriangle = true;
                this.createJKSquares = true;
                this.createIKSquaresOrTriangles = true;
                this.putAVertexOnlyAtXYZCheckingThisCondition = null;
                this.paramToVertex = new mathis.HashMap();
            }
            Regular3D.prototype.go = function () {
                var _this = this;
                this.mamesh = new mathis.Mamesh();
                //this.mamesh.linksOK=true
                var xDecay = new mathis.XYZ(0, 0, 0);
                if (this.decayOddStrates)
                    xDecay.add(this.Vi).scale(0.5);
                for (var k = 0; k < this.nbK; k++) {
                    var twoD = new Regular();
                    twoD.makeTriangleOrSquare = this.makeTriangleOrSquare;
                    twoD.makeLinks = true;
                    twoD.oneMoreVertexForOddLine = this.oneMoreVertexForOddLine;
                    twoD.squareVersusTriangleMaille = this.strateHaveSquareMailleVersusTriangleMaille;
                    twoD.nbI = this.nbI;
                    twoD.nbJ = this.nbJ;
                    twoD.fixedK = k;
                    twoD.Vi = this.Vi;
                    twoD.Vj = this.Vj;
                    twoD.Vk.copyFrom(this.Vk);
                    twoD.origine = mathis.XYZ.newFrom(this.origine);
                    if (k % 2 == 1)
                        twoD.origine.substract(xDecay);
                    twoD.putAVertexOnlyAtXYZCheckingThisCondition = this.putAVertexOnlyAtXYZCheckingThisCondition;
                    /** chaque strate est un mamesh. On ne les mémorise plus comme avant*/
                    var twoDimMamesh = twoD.go();
                    for (var _i = 0, _a = twoD.paramToVertex.allEntries(); _i < _a.length; _i++) {
                        var entry = _a[_i];
                        this.mamesh.vertices.push(entry.value);
                        this.paramToVertex.putValue(entry.key, entry.value);
                    }
                    for (var _b = 0, _c = twoDimMamesh.smallestSquares; _b < _c.length; _b++) {
                        var vertex = _c[_b];
                        this.mamesh.smallestSquares.push(vertex);
                    }
                    for (var _d = 0, _e = twoDimMamesh.smallestTriangles; _d < _e.length; _d++) {
                        var vertex = _e[_d];
                        this.mamesh.smallestTriangles.push(vertex);
                    }
                }
                if (this.interStrateMailleAreSquareVersusTriangle) {
                    this.linksCreationForSquareMaille();
                    if (this.createJKSquares) {
                        var dir1_1 = new mathis.XYZ(0, 1, 0);
                        var dir2_1 = new mathis.XYZ(0, 0, 1);
                        this.mamesh.vertices.forEach(function (v) {
                            makeSquareFromDeltaParam(v, _this.mamesh, dir1_1, dir2_1, _this.paramToVertex);
                        });
                    }
                    if (this.createIKSquaresOrTriangles) {
                        var dir1_2 = new mathis.XYZ(1, 0, 0);
                        var dir2_2 = new mathis.XYZ(0, 0, 1);
                        this.mamesh.vertices.forEach(function (v) {
                            makeSquareFromDeltaParam(v, _this.mamesh, dir1_2, dir2_2, _this.paramToVertex);
                        });
                    }
                }
                else {
                    this.linksCreationForTriangleMaille();
                    if (this.createJKSquares) {
                        var dir1_3 = new mathis.XYZ(0, 1, 0);
                        var dir2_3 = new mathis.XYZ(0, 0, 1);
                        this.mamesh.vertices.forEach(function (v) {
                            makeSquareFromDeltaParam(v, _this.mamesh, dir1_3, dir2_3, _this.paramToVertex);
                        });
                    }
                    if (this.createIKSquaresOrTriangles) {
                        this.triangleCreation();
                    }
                }
                //
                //
                // if (this.createIMameshes) {
                //     for (let i = 0; i < this.nbI; i++) {
                //
                //         let mamesh = new Mamesh()
                //         this.mamesh3D.iMameshes.push(mamesh)
                //
                //         for (let j = 0; j < this.nbJ; j++) {
                //             for (let k = 0; k < this.nbK; k++) {
                //                 let genericParam=new XYZ(i, j, k)
                //                 let vertex = this.mamesh3D.iMameshes[k].findVertexFromParam(genericParam)
                //                 if (vertex != null) {
                //                     mamesh.vertices.push(vertex)
                //                     this.paramToVertex.putValue(genericParam,vertex)
                //
                //                 }
                //
                //             }
                //         }
                //
                //
                //
                //         mamesh.vertices.forEach(cell=> {
                //             makeLinksFromDeltaParam(cell, mamesh, XYZ.temp0(0, 1, 0), XYZ.temp1(0, -1, 0),this.paramToVertex)
                //             makeLinksFromDeltaParam(cell, mamesh, XYZ.temp0(0, 0, 1), XYZ.temp1(0, 0, -1),this.paramToVertex)
                //         })
                //         mamesh.linksOK = true
                //
                //
                //
                //         if (this.makeSquares) {
                //             let dir1=new XYZ(0,1,0)
                //             let dir2=new XYZ(0,0,1)
                //             mamesh.vertices.forEach(v=> {
                //                 makeSquareFromDeltaParam(v, mamesh, dir1, dir2,this.paramToVertex)
                //             })
                //         }
                //
                //     }
                //
                // }
                //
                // if (this.createJMameshes) {
                //     for (let j = 0; j < this.nbJ; j++) {
                //
                //         let mamesh = new Mamesh()
                //         this.mamesh3D.jMameshes.push(mamesh)
                //
                //         for (let i = 0; i < this.nbI; i++) {
                //             for (let k = 0; k < this.nbK; k++) {
                //                 let genericParam=new XYZ(i, j, k)
                //                 let vertex = this.mamesh3D.kMameshes[k].findVertexFromParam(genericParam)
                //                 if (vertex != null) {
                //                     mamesh.vertices.push(vertex)
                //                     this.paramToVertex.putValue(genericParam, vertex)
                //                 }
                //
                //             }
                //         }
                //
                //         mamesh.vertices.forEach(cell=> {
                //             makeLinksFromDeltaParam(cell, mamesh, XYZ.temp0(1, 0, 0), XYZ.temp1(-1, 0, 0),this.paramToVertex)
                //             makeLinksFromDeltaParam(cell, mamesh, XYZ.temp0(0, 0, 1), XYZ.temp1(0, 0, -1),this.paramToVertex)
                //         })
                //         mamesh.linksOK = true
                //
                //         if (this.makeSquares) {
                //             let dir1 = new XYZ(1, 0, 0)
                //             let dir2 = new XYZ(0, 0, 1)
                //             mamesh.vertices.forEach(v=> {
                //                 makeSquareFromDeltaParam(v, mamesh, dir1, dir2,this.paramToVertex)
                //             })
                //         }
                //
                //     }
                // }
                return this.mamesh;
            };
            Regular3D.prototype.linksCreationForSquareMaille = function () {
                var _this = this;
                var vec001 = new mathis.XYZ(0, 0, 1);
                var vec_001 = new mathis.XYZ(0, 0, -1);
                this.mamesh.vertices.forEach(function (v) {
                    makeLinksFromDeltaParam(v, vec001, vec_001, _this.paramToVertex);
                });
            };
            Regular3D.prototype.linksCreationForTriangleMaille = function () {
                var _this = this;
                this.mamesh.vertices.forEach(function (cell) {
                    /**even lines */
                    if (cell.param.z % 2 == 0) {
                        /** sud est - nord ouest*/
                        makeLinksFromDeltaParam(cell, mathis.XYZ.temp0(1, 0, 1), mathis.XYZ.temp1(0, 0, -1), _this.paramToVertex);
                        /** sud ouest - nord est*/
                        makeLinksFromDeltaParam(cell, mathis.XYZ.temp0(0, 0, 1), mathis.XYZ.temp1(1, 0, -1), _this.paramToVertex);
                    }
                    else {
                        /**sud est - nord ouest*/
                        makeLinksFromDeltaParam(cell, mathis.XYZ.temp0(0, 0, 1), mathis.XYZ.temp1(-1, 0, -1), _this.paramToVertex);
                        /**sud ouest - nord est*/
                        makeLinksFromDeltaParam(cell, mathis.XYZ.temp0(-1, 0, 1), mathis.XYZ.temp1(0, 0, -1), _this.paramToVertex);
                    }
                });
            };
            Regular3D.prototype.getVertex = function (i, j, givenK) {
                return this.paramToVertex.getValue(new mathis.XYZ(i, givenK, j));
            };
            Regular3D.prototype.triangleCreation = function () {
                for (var _i = 0, _a = this.mamesh.vertices; _i < _a.length; _i++) {
                    var vertex = _a[_i];
                    var i = vertex.param.x;
                    var j = vertex.param.z;
                    var k = vertex.param.y;
                    if (j % 2 == 0) {
                        var v1 = vertex;
                        var v2 = this.getVertex(i + 1, j + 1, k);
                        if (v2 == null)
                            continue;
                        var v3 = this.getVertex(i, j + 1, k);
                        if (v3 != null)
                            this.mamesh.addATriangle(v1, v2, v3);
                        var v4 = this.getVertex(i + 1, j, k);
                        if (v4 != null)
                            this.mamesh.addATriangle(v1, v4, v2);
                    }
                    else {
                        var v1 = vertex;
                        var v2 = this.getVertex(i, j + 1, k);
                        if (v2 == null)
                            continue;
                        var v3 = this.getVertex(i + 1, j, k);
                        if (v3 != null)
                            this.mamesh.addATriangle(v1, v3, v2);
                        var v4 = this.getVertex(i + 1, j + 1, k);
                        if (v4 != null)
                            this.mamesh.addATriangle(v2, v3, v4);
                    }
                }
            };
            return Regular3D;
        }());
        reseau.Regular3D = Regular3D;
    })(reseau = mathis.reseau || (mathis.reseau = {}));
})(mathis || (mathis = {}));
