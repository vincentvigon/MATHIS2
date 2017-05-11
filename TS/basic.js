var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var mathis;
(function (mathis) {
    //
    // export enum Direction{vertical,horizontal,slash,antislash}
    mathis.myFavoriteColors = {
        green: new BABYLON.Color3(124 / 255, 252 / 255, 0)
    };
    var UV = (function () {
        function UV(u, v) {
            this.u = u;
            this.v = v;
        }
        return UV;
    }());
    mathis.UV = UV;
    var M22 = (function () {
        function M22() {
            this.m11 = 0;
            this.m12 = 0;
            this.m21 = 0;
            this.m22 = 0;
        }
        M22.prototype.determinant = function () {
            return this.m11 * this.m22 - this.m21 * this.m12;
        };
        M22.prototype.inverse = function () {
            var res = new M22();
            var det = this.determinant();
            res.m11 = this.m22 / det;
            res.m22 = this.m11 / det;
            res.m12 = -this.m12 / det;
            res.m21 = -this.m21 / det;
            return res;
        };
        M22.prototype.multiplyUV = function (uv) {
            return new UV(this.m11 * uv.u + this.m12 * uv.v, this.m21 * uv.u + this.m22 * uv.v);
        };
        return M22;
    }());
    mathis.M22 = M22;
    var XYZ = (function (_super) {
        __extends(XYZ, _super);
        function XYZ(x, y, z) {
            _super.call(this, x, y, z);
        }
        XYZ.resetDefaultNbDecimalForHash = function () { XYZ.nbDecimalForHash = 5; };
        Object.defineProperty(XYZ.prototype, "hashString", {
            get: function () { return mathis.roundWithGivenPrecision(this.x, XYZ.nbDecimalForHash) + ',' + mathis.roundWithGivenPrecision(this.y, XYZ.nbDecimalForHash) + ',' + mathis.roundWithGivenPrecision(this.z, XYZ.nbDecimalForHash); },
            enumerable: true,
            configurable: true
        });
        XYZ.newZero = function () {
            return new XYZ(0, 0, 0);
        };
        XYZ.newFrom = function (vect) {
            if (vect == null)
                return null;
            return new XYZ(vect.x, vect.y, vect.z);
        };
        XYZ.newOnes = function () {
            return new XYZ(1, 1, 1);
        };
        XYZ.newRandom = function () {
            return new XYZ(Math.random(), Math.random(), Math.random());
        };
        XYZ.temp0 = function (x, y, z) {
            tempXYZ0.copyFromFloats(x, y, z);
            return tempXYZ0;
        };
        XYZ.temp1 = function (x, y, z) {
            tempXYZ1.copyFromFloats(x, y, z);
            return tempXYZ1;
        };
        // static temp2(x,y,z):XYZ{
        //     tempXYZ2.copyFromFloats(x,y,z)
        //     return tempXYZ2
        // }
        // static temp3(x,y,z):XYZ{
        //     tempXYZ3.copyFromFloats(x,y,z)
        //     return tempXYZ3
        // }
        // static temp4(x,y,z):XYZ{
        //     tempXYZ4.copyFromFloats(x,y,z)
        //     return tempXYZ4
        // }
        // static temp5(x,y,z):XYZ{
        //     tempXYZ5.copyFromFloats(x,y,z)
        //     return tempXYZ5
        // }
        // newCopy():XYZ{
        //    return new XYZ(this.x,this.y,this.z)
        //}
        XYZ.prototype.add = function (vec) {
            mathis.geo.add(this, vec, this);
            return this;
        };
        XYZ.prototype.resizes = function (vec) {
            this.x *= vec.x;
            this.y *= vec.y;
            this.z *= vec.z;
            return this;
        };
        XYZ.prototype.multiply = function (vec) {
            this.x *= vec.x;
            this.y *= vec.y;
            this.z *= vec.z;
            return this;
        };
        XYZ.prototype.substract = function (vec) {
            mathis.geo.substract(this, vec, this);
            return this;
        };
        XYZ.prototype.scale = function (factor) {
            mathis.geo.scale(this, factor, this);
            return this;
        };
        XYZ.prototype.copyFrom = function (vect) {
            this.x = vect.x;
            this.y = vect.y;
            this.z = vect.z;
            return this;
        };
        XYZ.prototype.copyFromFloats = function (x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
            return this;
        };
        XYZ.prototype.changeBy = function (x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
            return this;
        };
        XYZ.prototype.normalize = function () {
            var norm = mathis.geo.norme(this);
            if (norm < mathis.geo.epsilon)
                throw 'be careful, you have normalized a very small vector';
            return this.scale(1 / norm);
        };
        XYZ.prototype.almostEqual = function (vect) {
            return mathis.geo.xyzAlmostEquality(this, vect);
        };
        XYZ.prototype.toString = function (deci) {
            if (deci === void 0) { deci = 2; }
            return '(' + this.x.toFixed(deci) + ',' + this.y.toFixed(deci) + ',' + this.z.toFixed(deci) + ')';
        };
        //private xyz:XYZ
        //get x(){return this.xyz.x}
        //get y(){return this.xyz.y}
        //get z(){return this.xyz.z}
        //set x(x:number){this.xyz.x=x}
        //set y(y:number){this.xyz.y=y}
        //set z(z:number){this.xyz.z=z}
        XYZ.lexicalOrder = function (a, b) {
            if (a.x != b.x)
                return a.x - b.x;
            else if (a.y != b.y)
                return a.y - b.y;
            else if (a.z != b.z)
                return a.z - b.z;
            else
                return 0;
        };
        XYZ.lexicalOrderInverse = function (a, b) {
            return -XYZ.lexicalOrder(a, b);
        };
        /**it is important to rount the number for hash. Because we want that two almost equal vectors have the same hash*/
        XYZ.nbDecimalForHash = 5;
        return XYZ;
    }(BABYLON.Vector3));
    mathis.XYZ = XYZ;
    var tempXYZ0 = new XYZ(0, 0, 0);
    var tempXYZ1 = new XYZ(0, 0, 0);
    //TODO rewrite the not-in-place methods
    var XYZW = (function (_super) {
        __extends(XYZW, _super);
        function XYZW(x, y, z, w) {
            _super.call(this, x, y, z, w);
        }
        XYZW.prototype.multiply = function (quat) {
            mathis.geo.quaternionMultiplication(quat, this, this);
            return this;
        };
        return XYZW;
    }(BABYLON.Quaternion));
    mathis.XYZW = XYZW;
    var Hash = (function () {
        function Hash() {
        }
        Hash.segment = function (a, b) {
            return Segment.segmentId(a.hashNumber, b.hashNumber);
        };
        Hash.segmentOrd = function (a, b) {
            if (a.hashNumber > b.hashNumber)
                _a = [b, a], a = _a[0], b = _a[1];
            return [a, b];
            var _a;
        };
        Hash.quad = function (a, b, c, d) {
            _a = Hash.quadOrd(a, b, c, d), a = _a[0], b = _a[1], c = _a[2], d = _a[3];
            return a.hashNumber + "," + b.hashNumber + "," + c.hashNumber + "," + d.hashNumber;
            var _a;
        };
        Hash.quadOrd = function (a, b, c, d) {
            while (a.hashNumber > b.hashNumber || a.hashNumber > c.hashNumber || a.hashNumber > d.hashNumber)
                _a = [b, c, d, a], a = _a[0], b = _a[1], c = _a[2], d = _a[3];
            if (b.hashNumber < d.hashNumber)
                _b = [d, b], b = _b[0], d = _b[1];
            return [a, b, c, d];
            var _a, _b;
        };
        return Hash;
    }());
    mathis.Hash = Hash;
    var Positioning = (function () {
        function Positioning() {
            this.position = new XYZ(0, 0, 0);
            this.frontDir = new XYZ(1, 0, 0);
            this.upVector = new XYZ(0, 1, 0);
            this.scaling = new XYZ(1, 1, 1);
            this.defaultUpDirIfTooSmall = new XYZ(1, 1, 0);
            this.defaultFrontDirIfTooSmall = new XYZ(0, 0, 1);
        }
        Positioning.prototype.copyFrom = function (positionning) {
            this.position = XYZ.newFrom(positionning.position);
            this.upVector = XYZ.newFrom(positionning.upVector);
            this.frontDir = XYZ.newFrom(positionning.frontDir);
            this.scaling = XYZ.newFrom(positionning.scaling);
        };
        Positioning.prototype.changeFrontDir = function (vector) {
            mathis.geo.orthonormalizeKeepingFirstDirection(vector, this.upVector, this.frontDir, this.upVector);
        };
        Positioning.prototype.changeUpVector = function (vector) {
            mathis.geo.orthonormalizeKeepingFirstDirection(this.upVector, vector, this.upVector, this.frontDir);
        };
        Positioning.prototype.setOrientation = function (frontDir, upVector) {
            this.upVector = new XYZ(0, 0, 0);
            this.frontDir = new XYZ(0, 0, 0);
            mathis.geo.orthonormalizeKeepingFirstDirection(frontDir, upVector, this.frontDir, this.upVector);
        };
        Positioning.prototype.quaternion = function (preserveUpVectorInPriority) {
            if (preserveUpVectorInPriority === void 0) { preserveUpVectorInPriority = true; }
            if (this.frontDir == null && this.upVector == null)
                throw 'you must precise a frontDir or a upVector or both of them';
            else if (this.frontDir == null) {
                this.frontDir = new XYZ(0, 0, 0);
                mathis.geo.getOneOrthonormal(this.upVector, this.frontDir);
            }
            else if (this.upVector == null) {
                this.upVector = new XYZ(0, 0, 0);
                mathis.geo.getOneOrthonormal(this.frontDir, this.upVector);
            }
            if (this.frontDir.length() < mathis.geo.epsilon) {
                this.frontDir = this.defaultFrontDirIfTooSmall;
                mathis.logger.c('a tangent was too small, and so replaced by a default one');
            }
            if (this.upVector.length() < mathis.geo.epsilon) {
                this.upVector = this.defaultUpDirIfTooSmall;
                mathis.logger.c('a normal was too small, and so replaced by a default one');
            }
            var quaternion = new XYZW(0, 0, 0, 1);
            mathis.geo.twoVectorsToQuaternion(this.frontDir, this.upVector, !preserveUpVectorInPriority, quaternion);
            return quaternion;
        };
        Positioning.prototype.applyToMeshes = function (meshes) {
            var quaternion = null;
            if (this.frontDir != null || this.upVector != null)
                quaternion = this.quaternion();
            for (var _i = 0, meshes_1 = meshes; _i < meshes_1.length; _i++) {
                var mesh = meshes_1[_i];
                if (this.scaling != null)
                    mesh.scaling = this.scaling;
                if (quaternion != null)
                    mesh.rotationQuaternion = quaternion;
                if (this.position != null)
                    mesh.position = this.position;
            }
        };
        Positioning.prototype.applyToVertices = function (vertices) {
            var quaternion = this.quaternion();
            var matrix = new MM();
            mathis.geo.quaternionToMatrix(quaternion, matrix);
            for (var _i = 0, vertices_1 = vertices; _i < vertices_1.length; _i++) {
                var vertex = vertices_1[_i];
                vertex.position.multiply(this.scaling);
                mathis.geo.multiplicationMatrixVector(matrix, vertex.position, vertex.position);
                vertex.position.add(this.position);
            }
        };
        return Positioning;
    }());
    mathis.Positioning = Positioning;
    var MM = (function (_super) {
        __extends(MM, _super);
        //private mm:MM
        //get m(){return this.mm.m}
        //public m=new Float32Array(16)
        function MM() {
            _super.call(this);
        }
        MM.newIdentity = function () {
            var res = new MM();
            res.m[0] = 1;
            res.m[5] = 1;
            res.m[10] = 1;
            res.m[15] = 1;
            return res;
        };
        MM.newFrom = function (matr) {
            var res = new MM();
            for (var i = 0; i < 16; i++)
                res.m[i] = matr.m[i];
            return res;
        };
        MM.newRandomMat = function () {
            var res = new MM();
            for (var i = 0; i < 16; i++)
                res.m[i] = Math.random();
            return res;
        };
        MM.newZero = function () {
            return new MM();
        };
        MM.prototype.equal = function (matr) {
            return mathis.geo.matEquality(this, matr);
        };
        MM.prototype.almostEqual = function (matr) {
            return mathis.geo.matAlmostEquality(this, matr);
        };
        MM.prototype.leftMultiply = function (matr) {
            mathis.geo.multiplyMatMat(matr, this, this);
            return this;
        };
        MM.prototype.rightMultiply = function (matr) {
            mathis.geo.multiplyMatMat(this, matr, this);
            return this;
        };
        MM.prototype.inverse = function () {
            mathis.geo.inverse(this, this);
            return this;
        };
        MM.prototype.copyFrom = function (matr) {
            mathis.geo.copyMat(matr, this);
            return this;
        };
        MM.prototype.transpose = function () {
            mathis.geo.transpose(this, this);
            return this;
        };
        MM.prototype.toString = function () {
            return "\n" +
                this.m[0] + this.m[1] + this.m[2] + this.m[3] + "\n" +
                this.m[4] + this.m[5] + this.m[6] + this.m[7] + "\n" +
                this.m[8] + this.m[9] + this.m[10] + this.m[11] + "\n" +
                this.m[12] + this.m[13] + this.m[14] + this.m[15] + "\n";
        };
        return MM;
    }(BABYLON.Matrix));
    mathis.MM = MM;
    var Link = (function () {
        function Link(to) {
            this.customerOb = null;
            if (to == null)
                throw 'a links is construct with a null vertex';
            this.to = to;
        }
        return Link;
    }());
    mathis.Link = Link;
    /** An element of a graph */
    var Vertex = (function () {
        function Vertex() {
            /**link lead to an other vertex*/
            this.links = [];
            this.isInvisible = false;
            this.dichoLevel = 0;
            this.markers = [];
            this.customerObject = {};
            this._hashCode = Vertex.hashCount++;
        }
        Object.defineProperty(Vertex.prototype, "hashNumber", {
            get: function () { return this._hashCode; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vertex.prototype, "hashString", {
            get: function () { return this._hashCode + ''; },
            enumerable: true,
            configurable: true
        });
        Vertex.prototype.setPosition = function (x, y, z, useAlsoTheseValuesForParam) {
            if (useAlsoTheseValuesForParam === void 0) { useAlsoTheseValuesForParam = true; }
            this.position = new XYZ(x, y, z);
            if (useAlsoTheseValuesForParam)
                this.param = new XYZ(x, y, z);
            return this;
        };
        Vertex.prototype.hasMark = function (mark) {
            return (this.markers.indexOf(mark) != -1);
        };
        Vertex.prototype.getOpposites = function (vert1) {
            var fle = this.findLink(vert1);
            if (fle == null)
                throw "the vertex is not a neighbor. Probably your neighborhood relation is not symetric. " +
                    "Please, perform the graph analysis, with the help of the function linkModule.checkTheRegularityOfAGRaph";
            if (fle.opposites == null)
                return null;
            var res = [];
            for (var _i = 0, _a = fle.opposites; _i < _a.length; _i++) {
                var li = _a[_i];
                res.push(li.to);
            }
            return res;
        };
        Vertex.prototype.hasBifurcations = function () {
            for (var _i = 0, _a = this.links; _i < _a.length; _i++) {
                var link = _a[_i];
                if (link.opposites != null && link.opposites.length > 1)
                    return true;
            }
            return false;
        };
        Vertex.prototype.hasVoisin = function (vertex) {
            for (var _i = 0, _a = this.links; _i < _a.length; _i++) {
                var link = _a[_i];
                if (link.to == vertex)
                    return true;
            }
            return false;
        };
        Vertex.prototype.isBorder = function () { return this.hasMark(Vertex.Markers.border); };
        Vertex.prototype.findLink = function (vertex) {
            for (var _i = 0, _a = this.links; _i < _a.length; _i++) {
                var fle = _a[_i];
                if (fle.to == vertex)
                    return fle;
            }
            return null;
        };
        /** set two links in opposition.
         * If one of them exists (eg as a link with no opposition) the opposition is created */
        Vertex.prototype.setTwoOppositeLinks = function (cell1, cell2) {
            var link1 = this.findLink(cell1);
            var link2 = this.findLink(cell2);
            if (link1 == null) {
                link1 = new Link(cell1);
                this.links.push(link1);
            }
            if (link2 == null) {
                link2 = new Link(cell2);
                this.links.push(link2);
            }
            if (link1.opposites == null)
                link1.opposites = [];
            if (link2.opposites == null)
                link2.opposites = [];
            link1.opposites.push(link2);
            link2.opposites.push(link1);
            return this;
        };
        /**set a simple link between this and vertex.
         *  if such a link already existe (even with somme oppositions, it is suppressed)*/
        Vertex.prototype.setOneLink = function (vertex) {
            if (vertex == this)
                throw "it is forbidden to link to itself";
            this.suppressOneLink(vertex);
            this.links.push(new Link(vertex));
            return this;
        };
        Vertex.separateTwoVoisins = function (v1, v2) {
            v1.suppressOneLink(v2);
            v2.suppressOneLink(v1);
        };
        /**to completely separate to vertex, you have to apply this procedure on both the two vertices*/
        Vertex.prototype.suppressOneLink = function (voisin) {
            var link = this.findLink(voisin);
            if (link == null)
                return;
            mathis.tab.removeFromArray(this.links, link);
            if (link.opposites != null) {
                for (var _i = 0, _a = link.opposites; _i < _a.length; _i++) {
                    var li = _a[_i];
                    if (li.opposites.length >= 2)
                        mathis.tab.removeFromArray(li.opposites, link);
                    else
                        li.opposites = null;
                }
            }
        };
        Vertex.prototype.changeToLinkWithoutOpposite = function (voisin) {
            var link = this.findLink(voisin);
            if (link == null)
                return;
            if (link.opposites != null) {
                for (var _i = 0, _a = link.opposites; _i < _a.length; _i++) {
                    var li = _a[_i];
                    if (li.opposites.length >= 2)
                        mathis.tab.removeFromArray(li.opposites, link);
                    else
                        li.opposites = null;
                }
            }
            link.opposites = null;
        };
        Vertex.prototype.toString = function (toSubstract) {
            var res = (this.hashNumber - toSubstract) + "";
            return res;
        };
        Vertex.prototype.toStringComplete = function (toSubstract) {
            var res = this.hashNumber - toSubstract + "|links:";
            for (var _i = 0, _a = this.links; _i < _a.length; _i++) {
                var fle = _a[_i];
                var bif = "";
                if (fle.opposites != null) {
                    bif += ",";
                    for (var _b = 0, _c = fle.opposites; _b < _c.length; _b++) {
                        var li = _c[_b];
                        bif += (li.to.hashNumber - toSubstract) + ",";
                    }
                }
                res += "(" + (fle.to.hashNumber - toSubstract) + bif + ")";
            }
            if (this.position != null)
                res += "|pos:" + this.position.toString(1) + ',';
            res += "|mark:";
            for (var _d = 0, _e = this.markers; _d < _e.length; _d++) {
                var mark = _e[_d];
                res += Vertex.Markers[mark] + ',';
            }
            return res;
        };
        Vertex.hashCount = 0;
        return Vertex;
    }());
    mathis.Vertex = Vertex;
    var Vertex;
    (function (Vertex) {
        (function (Markers) {
            Markers[Markers["honeyComb"] = 0] = "honeyComb";
            Markers[Markers["corner"] = 1] = "corner";
            Markers[Markers["center"] = 2] = "center";
            Markers[Markers["border"] = 3] = "border";
            Markers[Markers["polygonCenter"] = 4] = "polygonCenter";
            Markers[Markers["selectedForLineDrawing"] = 5] = "selectedForLineDrawing";
        })(Vertex.Markers || (Vertex.Markers = {}));
        var Markers = Vertex.Markers;
    })(Vertex = mathis.Vertex || (mathis.Vertex = {}));
    /**A graph but not only : it contains vertices but also lines passing through vertices.
     * Most of time a Mamesh is a graph on a surface, so it contains square/triangle between vertices.
     * It can contain also many other informations e.g. {@link vertexToPositioning} or {@link lineToColor} which are useful
     * to represent a Mamesh */
    var Mamesh = (function () {
        function Mamesh() {
            /**'points' of a graph*/
            this.vertices = [];
            /**surface element between vertices*/
            this.smallestTriangles = [];
            this.smallestSquares = [];
            /** Hexahedron configuration
             *   4   7
             *  /|   |
             * 3-+-2 |
             *   | | |
             *   5-+-6
             *     |
             * 0---1
             *
             * Coplanar faces ; order (for vectorial product) important.
             * */
            this.hexahedrons = [];
            /**to perform dichotomy*/
            this.cutSegmentsDico = {};
        }
        Object.defineProperty(Mamesh.prototype, "polygons", {
            //symmetries:((a:XYZ)=>XYZ)[]
            get: function () {
                var res = [];
                for (var i = 0; i < this.smallestSquares.length; i += 4)
                    res.push([this.smallestSquares[i], this.smallestSquares[i + 1], this.smallestSquares[i + 2], this.smallestSquares[i + 3]]);
                for (var i = 0; i < this.smallestTriangles.length; i += 3)
                    res.push([this.smallestTriangles[i], this.smallestTriangles[i + 1], this.smallestTriangles[i + 2]]);
                return res;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Mamesh.prototype, "linesWasMade", {
            //linksOK=false
            get: function () {
                return this.lines != null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Mamesh.prototype, "segments", {
            get: function () {
                var res = [];
                for (var _i = 0, _a = this.vertices; _i < _a.length; _i++) {
                    var vertex = _a[_i];
                    for (var _b = 0, _c = vertex.links; _b < _c.length; _b++) {
                        var link = _c[_b];
                        if (vertex.hashNumber < link.to.hashNumber)
                            res.push([vertex, link.to]);
                    }
                }
                return res;
            },
            enumerable: true,
            configurable: true
        });
        Mamesh.prototype.addATriangle = function (a, b, c) {
            this.smallestTriangles.push(a, b, c);
            return this;
        };
        Mamesh.prototype.addASquare = function (a, b, c, d) {
            this.smallestSquares.push(a, b, c, d);
            return this;
        };
        Mamesh.prototype.addHexahedron = function (pos) {
            this.hexahedrons.concat(pos);
            return this;
        };
        Mamesh.prototype.getVertex = function (pos) {
            var v = this.findVertexFromParam(pos);
            if (v == null)
                v = this.newVertex(pos);
            return v;
        };
        Mamesh.prototype.newVertex = function (position, dichoLevel, param) {
            if (dichoLevel === void 0) { dichoLevel = 0; }
            var vertex = new Vertex();
            vertex.position = position;
            vertex.param = (param) ? param : position;
            vertex.dichoLevel = dichoLevel;
            this.addVertex(vertex);
            return vertex;
        };
        Mamesh.prototype.findVertexFromParam = function (param) {
            for (var _i = 0, _a = this.vertices; _i < _a.length; _i++) {
                var v = _a[_i];
                if (v.param.hashString == param.hashString)
                    return v;
            }
            return null;
        };
        Mamesh.prototype.addVertex = function (vertex) {
            this.vertices.push(vertex);
        };
        // suppressVertex(vertex:Vertex,exceptionIfNotInside=true):void{
        //     if (!this.hasVertex(vertex)) {
        //         if (exceptionIfNotInside) throw 'this vertex is not in this IN_mamesh'
        //     }
        //     else{
        //         removeFromArray(this.vertices,vertex)
        //         this.paramToVertex.removeKey(vertex.param)
        //     }
        // }
        //
        Mamesh.prototype.hasVertex = function (vertex) {
            for (var _i = 0, _a = this.vertices; _i < _a.length; _i++) {
                var ver = _a[_i];
                if (ver.hashNumber == vertex.hashNumber)
                    return true;
            }
            return false;
        };
        Mamesh.prototype.getStraightLines = function () {
            var res = [];
            for (var _i = 0, _a = this.lines; _i < _a.length; _i++) {
                var line = _a[_i];
                if (!line.isLoop)
                    res.push(line);
            }
            return res;
        };
        Mamesh.prototype.getLoopLines = function () {
            var res = [];
            for (var _i = 0, _a = this.lines; _i < _a.length; _i++) {
                var line = _a[_i];
                if (line.isLoop)
                    res.push(line);
            }
            return res;
        };
        Mamesh.prototype.getStraightLinesAsVertices = function () {
            var res = [];
            for (var _i = 0, _a = this.lines; _i < _a.length; _i++) {
                var line = _a[_i];
                if (!line.isLoop)
                    res.push(line.vertices);
            }
            return res;
        };
        Mamesh.prototype.getLoopLinesAsVertices = function () {
            var res = [];
            for (var _i = 0, _a = this.lines; _i < _a.length; _i++) {
                var line = _a[_i];
                if (line.isLoop)
                    res.push(line.vertices);
            }
            return res;
        };
        Mamesh.prototype.toString = function (substractHashCode) {
            if (substractHashCode === void 0) { substractHashCode = true; }
            var toSubstract = 0;
            if (substractHashCode) {
                toSubstract = Number.MAX_VALUE;
                for (var _i = 0, _a = this.vertices; _i < _a.length; _i++) {
                    var vert = _a[_i];
                    if (vert.hashNumber < toSubstract)
                        toSubstract = vert.hashNumber;
                }
            }
            var res = "\n";
            if (this.name != null)
                res += this.name + "\n";
            for (var _b = 0, _c = this.vertices; _b < _c.length; _b++) {
                var vert = _c[_b];
                res += vert.toStringComplete(toSubstract) + "\n";
            }
            res += "tri:";
            for (var j = 0; j < this.smallestTriangles.length; j += 3) {
                res += "[" + (this.smallestTriangles[j].hashNumber - toSubstract) + "," + (this.smallestTriangles[j + 1].hashNumber - toSubstract) + "," + (this.smallestTriangles[j + 2].hashNumber - toSubstract) + "]";
            }
            res += "\nsqua:";
            for (var j = 0; j < this.smallestSquares.length; j += 4) {
                res += "[" + (this.smallestSquares[j].hashNumber - toSubstract) + "," + (this.smallestSquares[j + 1].hashNumber - toSubstract) + "," + (this.smallestSquares[j + 2].hashNumber - toSubstract) + "," + (this.smallestSquares[j + 3].hashNumber - toSubstract) + "]";
            }
            if (this.linesWasMade) {
                res += "\nstrai:";
                for (var _d = 0, _e = this.getStraightLines(); _d < _e.length; _d++) {
                    var line = _e[_d];
                    res += "[";
                    for (var _f = 0, _g = line.vertices; _f < _g.length; _f++) {
                        var ver = _g[_f];
                        res += (ver.hashNumber - toSubstract) + ",";
                    }
                    res += "]";
                }
                res += "\nloop:";
                for (var _h = 0, _j = this.getLoopLines(); _h < _j.length; _h++) {
                    var line = _j[_h];
                    res += "[";
                    for (var _k = 0, _l = line.vertices; _k < _l.length; _k++) {
                        var ver = _l[_k];
                        res += (ver.hashNumber - toSubstract) + ",";
                    }
                    res += "]";
                }
            }
            res += "\ncutSegments";
            for (var key in this.cutSegmentsDico) {
                var segment = this.cutSegmentsDico[key];
                res += '{' + (segment.a.hashNumber - toSubstract) + ',' + (segment.middle.hashNumber - toSubstract) + ',' + (segment.b.hashNumber - toSubstract) + '}';
            }
            // res+="\nparamToVertex"
            // //let key:XYZ
            // for (let key of this.paramToVertex.allKeys()){
            //     res+=key.hashString+':'+(this.paramToVertex.getValue(key).hashNumber-toSubstract)+'|'
            // }
            return res;
        };
        Mamesh.prototype.fillLineCatalogue = function (startingVertices) {
            if (startingVertices === void 0) { startingVertices = this.vertices; }
            this.lines = mathis.lineModule.makeLineCatalogue2(startingVertices, true);
        };
        Mamesh.prototype.addSimpleLinksAroundPolygons = function () {
            new mathis.linkModule.SimpleLinkFromPolygonCreator(this).goChanging();
        };
        Mamesh.prototype.addOppositeLinksAroundPolygons = function () {
            new mathis.linkModule.SimpleLinkFromPolygonCreator(this).goChanging();
            new mathis.linkModule.OppositeLinkAssocierByAngles(this.vertices).goChanging();
            //new linkModule.LinkCreaterSorterAndBorderDetecterByPolygons(this).goChanging()
        };
        /** A IN_mamesh can be include in a larger graph. This method cut all the link going outside.
         * This method is often use after a submamesh extraction */
        Mamesh.prototype.isolateMameshVerticesFromExteriorVertices = function () {
            var verticesAndLinkToSepare = [];
            for (var _i = 0, _a = this.vertices; _i < _a.length; _i++) {
                var vertex = _a[_i];
                for (var _b = 0, _c = vertex.links; _b < _c.length; _b++) {
                    var link = _c[_b];
                    if (!this.hasVertex(link.to))
                        verticesAndLinkToSepare.push({ vertex: vertex, link: link });
                }
            }
            for (var _d = 0, verticesAndLinkToSepare_1 = verticesAndLinkToSepare; _d < verticesAndLinkToSepare_1.length; _d++) {
                var vl = verticesAndLinkToSepare_1[_d];
                Vertex.separateTwoVoisins(vl.link.to, vl.vertex);
            }
        };
        Mamesh.prototype.getOrCreateSegment = function (v1, v2, segments) {
            var res = this.cutSegmentsDico[Segment.segmentId(v1.hashNumber, v2.hashNumber)];
            if (res == null) {
                res = new Segment(v1, v2);
                this.cutSegmentsDico[Segment.segmentId(v1.hashNumber, v2.hashNumber)] = res;
            }
            segments[Segment.segmentId(v1.hashNumber, v2.hashNumber)] = res;
        };
        Mamesh.prototype.maxLinkLength = function () {
            var res = -1;
            this.vertices.forEach(function (vert) {
                vert.links.forEach(function (li) {
                    var dist = mathis.geo.distance(vert.position, li.to.position);
                    if (dist > res)
                        res = dist;
                });
            });
            if (res == -1)
                throw 'your IN_mamesh seems empty';
            return res;
        };
        // standartDeviationOfLinks():number{
        //     let res=0
        //     let nb=0
        //
        //     this.vertices.forEach(v=>{
        //         v.links.forEach(l=>{
        //             nb++
        //             res+=geo.squaredDistance(v.position,l.to.position)
        //         })
        //
        //     })
        //    
        //     return Math.sqrt(res)/nb
        //
        // }
        Mamesh.prototype.clearLinksAndLines = function () {
            this.vertices.forEach(function (v) {
                mathis.tab.clearArray(v.links);
            });
            this.lines = null;
        };
        Mamesh.prototype.clearOppositeInLinks = function () {
            this.vertices.forEach(function (v) {
                v.links.forEach(function (li) {
                    li.opposites = null;
                });
            });
            //this.loopLines=null
            //this.straightLines=null
        };
        Mamesh.prototype.allLinesAsASortedString = function (substractHashCode) {
            if (substractHashCode === void 0) { substractHashCode = true; }
            var res = "";
            var stringTab;
            var toSubstract;
            if (substractHashCode) {
                toSubstract = Number.MAX_VALUE;
                for (var _i = 0, _a = this.vertices; _i < _a.length; _i++) {
                    var vert = _a[_i];
                    if (vert.hashNumber < toSubstract)
                        toSubstract = vert.hashNumber;
                }
            }
            if (this.linesWasMade) {
                var straigth = this.getStraightLines();
                var loop = this.getLoopLines();
                if (this.linesWasMade && straigth.length > 0) {
                    stringTab = [];
                    straigth.forEach(function (li) {
                        var line = li.vertices;
                        var hashTab = [];
                        line.forEach(function (v) {
                            hashTab.push(v.hashNumber - toSubstract);
                        });
                        stringTab.push(JSON.stringify(hashTab));
                    });
                    stringTab.sort();
                    res = "straightLines:" + JSON.stringify(stringTab);
                }
                if (loop.length > 0) {
                    stringTab = [];
                    loop.forEach(function (li) {
                        var line = li.vertices;
                        var hashTab = [];
                        line.forEach(function (v) {
                            hashTab.push(v.hashNumber - toSubstract);
                        });
                        var minIndex = mathis.tab.minIndexOfNumericList(hashTab);
                        var permutedHashTab = [];
                        for (var i = 0; i < hashTab.length; i++) {
                            permutedHashTab[i] = hashTab[(i + minIndex) % hashTab.length];
                        }
                        stringTab.push(JSON.stringify(permutedHashTab));
                    });
                    stringTab.sort();
                    res += "|loopLines:" + JSON.stringify(stringTab);
                }
            }
            return res;
        };
        Mamesh.prototype.allSquareAndTrianglesAsSortedString = function (subtractHashCode) {
            if (subtractHashCode === void 0) { subtractHashCode = true; }
            var toSubtract = 0;
            if (subtractHashCode) {
                toSubtract = Number.MAX_VALUE;
                for (var _i = 0, _a = this.vertices; _i < _a.length; _i++) {
                    var vert = _a[_i];
                    if (vert.hashNumber < toSubtract)
                        toSubtract = vert.hashNumber;
                }
            }
            var resSquare = "square:" + this.allSquaresOrTrianglesAsASortedString(this.smallestSquares, 4, toSubtract);
            var resTri = "triangle:" + this.allSquaresOrTrianglesAsASortedString(this.smallestTriangles, 3, toSubtract);
            return resSquare + resTri;
        };
        Mamesh.prototype.allSquaresOrTrianglesAsASortedString = function (squareOrTriangles, blockSize, toSubtract) {
            var res = "";
            var stringTab;
            var listOfPoly = [];
            for (var i = 0; i < squareOrTriangles.length; i += blockSize) {
                var block = [];
                for (var j = 0; j < blockSize; j++)
                    block.push(squareOrTriangles[i + j]);
                listOfPoly.push(block);
            }
            stringTab = [];
            listOfPoly.forEach(function (line) {
                var hashTab = [];
                line.forEach(function (v) {
                    hashTab.push(v.hashNumber - toSubtract);
                });
                var minIndex = mathis.tab.minIndexOfNumericList(hashTab);
                var permutedHashTab = [];
                for (var i = 0; i < hashTab.length; i++) {
                    permutedHashTab[i] = hashTab[(i + minIndex) % hashTab.length];
                }
                stringTab.push(JSON.stringify(permutedHashTab));
            });
            stringTab.sort();
            res += JSON.stringify(stringTab);
            return res;
        };
        return Mamesh;
    }());
    mathis.Mamesh = Mamesh;
    var Line = (function () {
        function Line(vertices, isLoop) {
            this.vertices = vertices;
            this.isLoop = isLoop;
        }
        Line.prototype.getVertex = function (index, loopIfLoop) {
            if (loopIfLoop === void 0) { loopIfLoop = true; }
            if (this.isLoop && loopIfLoop)
                return this.vertices[index % this.vertices.length];
            else
                return this.vertices[index];
        };
        Line.prototype.hashForDirected = function () {
            var decayList = [];
            if (!this.isLoop) {
                for (var _i = 0, _a = this.vertices; _i < _a.length; _i++) {
                    var v = _a[_i];
                    decayList.push(v.hashNumber);
                }
            }
            else {
                var minIndex = mathis.tab.minIndexOb(this.vertices, function (v1, v2) { return v1.hashNumber - v2.hashNumber; });
                for (var i = 0; i < this.vertices.length; i++)
                    decayList.push(this.vertices[(i + minIndex) % this.vertices.length].hashNumber);
            }
            return JSON.stringify(decayList);
        };
        Line.prototype.inverted = function () {
            var invertedVert = [];
            for (var i = 0; i < this.vertices.length; i++)
                invertedVert.push(this.vertices[this.vertices.length - 1 - i]);
            return new Line(invertedVert, this.isLoop);
        };
        Line.prototype.positionList = function () {
            var res = [];
            for (var _i = 0, _a = this.vertices; _i < _a.length; _i++) {
                var v = _a[_i];
                res.push(v.position);
            }
            return res;
        };
        Object.defineProperty(Line.prototype, "hashString", {
            get: function () {
                var hash1 = this.hashForDirected();
                var hash2 = this.inverted().hashForDirected();
                return (hash1 < hash2) ? hash1 : hash2;
            },
            enumerable: true,
            configurable: true
        });
        Line.prototype.positionnalHashForDirected = function (precision) {
            if (precision === void 0) { precision = 1; }
            var listOfHash = [];
            XYZ.nbDecimalForHash = precision;
            if (!this.isLoop) {
                for (var _i = 0, _a = this.vertices; _i < _a.length; _i++) {
                    var v = _a[_i];
                    listOfHash.push(v.position.hashString);
                }
            }
            else {
                var positionList = this.positionList();
                var minIndex = mathis.tab.minIndexOb(positionList, XYZ.lexicalOrder);
                for (var i = 0; i < positionList.length; i++)
                    listOfHash.push(positionList[(i + minIndex) % positionList.length].hashString);
            }
            XYZ.resetDefaultNbDecimalForHash();
            return JSON.stringify(listOfHash);
        };
        Line.prototype.positionnalHash = function (precision) {
            if (precision === void 0) { precision = 1; }
            var hash1 = this.positionnalHashForDirected(precision);
            var hash2 = this.inverted().positionnalHashForDirected(precision);
            return (hash1 < hash2) ? hash1 : hash2;
        };
        //
        // hashStringUpToSymmetries(symmetries:((xyz:XYZ)=>XYZ)[],precision=1):string{
        //    
        //     let symmetriesAndIdentity=symmetries.concat((xyz:XYZ)=>xyz)
        //    
        //     let firstPosSymmetrised:XYZ[]=[]
        //     for (let sym of symmetriesAndIdentity) firstPosSymmetrised.push(sym(this.vertices[0].position))
        //     let lesserFirst=tab.minValueOb<XYZ>(firstPosSymmetrised,XYZ.lexicalOrder)
        //
        //     let lastPosSymmetrized:XYZ[]=[]
        //     for (let sym of symmetriesAndIdentity) lastPosSymmetrized.push(sym(this.vertices[this.vertices.length-1].position))
        //     let lesserLast=tab.minValueOb<XYZ>(lastPosSymmetrized,XYZ.lexicalOrder)
        //    
        //     let chosenSym:(xyz:XYZ)=>XYZ
        //     let chosenOrder:Vertex[]
        //
        //     if (XYZ.lexicalOrder(lesserFirst,lesserLast)  <0){
        //         let chosenSymInd=firstPosSymmetrised.indexOf(lesserFirst)
        //         chosenSym=symmetriesAndIdentity[chosenSymInd]
        //         chosenOrder=this.vertices
        //     }
        //     else{
        //         let chosenSymInd=lastPosSymmetrized.indexOf(lesserLast)
        //         chosenSym=symmetriesAndIdentity[chosenSymInd]
        //         chosenOrder=[]
        //         for (let i=0;i<this.vertices.length;i++) chosenOrder.push(this.vertices[this.vertices.length-1-i])
        //     }
        //
        //     let res:string[]=[]
        //     XYZ.nbDecimalForHash=precision
        //     for (let a of chosenOrder) res.push(chosenSym(a.position).hashString)
        //     XYZ.resetDefaultNbDecimalForHash()
        //    
        //    
        //     return JSON.stringify(res)
        //    
        // }
        //
        Line.prototype.hashStringUpToSymmetries = function (symmetries, positionVersusParam) {
            var linesHash = [this.positionnalHash()];
            for (var _i = 0, symmetries_1 = symmetries; _i < symmetries_1.length; _i++) {
                var sym = symmetries_1[_i];
                var symV = [];
                for (var _a = 0, _b = this.vertices; _a < _b.length; _a++) {
                    var v = _b[_a];
                    var vert = new Vertex();
                    if (positionVersusParam)
                        vert.position = sym(v.position);
                    else
                        vert.position = sym(v.param);
                    symV.push(vert);
                }
                var line = new Line(symV, this.isLoop);
                linesHash.push(line.positionnalHash());
            }
            return mathis.tab.minValueString(linesHash);
        };
        Line.prototype.allSegments = function () {
            var res = [];
            var oneMore = (this.isLoop) ? 1 : 0;
            for (var i = 0; i < this.vertices.length - 1 + oneMore; i++) {
                res.push(new Segment(this.vertices[i], this.vertices[(i + 1) % this.vertices.length]));
            }
            return res;
        };
        return Line;
    }());
    mathis.Line = Line;
    var Segment = (function () {
        function Segment(c, d) {
            this.a = (c.hashNumber < d.hashNumber) ? c : d;
            this.b = (c.hashNumber < d.hashNumber) ? d : c;
        }
        Segment.segmentId = function (a, b) {
            if (a < b)
                return a + ',' + b;
            else
                return b + ',' + a;
        };
        Object.defineProperty(Segment.prototype, "hashString", {
            get: function () { return Segment.segmentId(this.a.hashNumber, this.b.hashNumber); },
            enumerable: true,
            configurable: true
        });
        Segment.prototype.equals = function (ab) {
            return this.a == ab.a && this.b == ab.b;
        };
        Segment.prototype.getOther = function (c) {
            if (c == this.a)
                return this.b;
            else
                return this.a;
        };
        Segment.prototype.getFirst = function () {
            return this.a;
        };
        Segment.prototype.getSecond = function () {
            return this.b;
        };
        Segment.prototype.has = function (c) {
            return c == this.a || c == this.b;
        };
        return Segment;
    }());
    mathis.Segment = Segment;
})(mathis || (mathis = {}));
