var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var mathis;
(function (mathis) {
    var general_algo;
    (function (general_algo) {
        var UnionFind = (function () {
            function UnionFind() {
                this.parents = new mathis.HashMap(true);
                this.ranks = new mathis.HashMap();
            }
            UnionFind.prototype.find = function (x) {
                this.addElement(x);
                return this.findRec(x);
            };
            UnionFind.prototype.findRec = function (x) {
                while (this.parents.getValue(x) != this.parents.getValue(this.parents.getValue(x))) {
                    this.parents.putValue(x, this.findRec(this.parents.getValue(x)));
                }
                return this.parents.getValue(x);
            };
            UnionFind.prototype.union = function (x, y) {
                var xParent = this.find(x);
                var yParent = this.find(y);
                if (xParent.hashString == yParent.hashString)
                    return false;
                if (this.ranks.getValue(xParent) < this.ranks.getValue(yParent)) {
                    this.parents.putValue(xParent, yParent);
                }
                else if (this.ranks.getValue(xParent) > this.ranks.getValue(yParent)) {
                    this.parents.putValue(yParent, xParent);
                }
                else {
                    this.parents.putValue(xParent, yParent);
                    var y_oldRank = this.ranks.getValue(yParent);
                    this.ranks.putValue(yParent, y_oldRank + this.ranks.getValue(xParent) + 1);
                }
                return true;
            };
            UnionFind.prototype.addElement = function (x) {
                if (this.parents.getValue(x) == null) {
                    this.parents.putValue(x, x);
                    this.ranks.putValue(x, 0);
                }
            };
            UnionFind.prototype.get_components = function (addRep) {
                if (addRep === void 0) { addRep = true; }
                var res = new mathis.HashMap(true);
                var all = this.parents.allKeys();
                for (var _i = 0, all_1 = all; _i < all_1.length; _i++) {
                    var v = all_1[_i];
                    if (this.find(v).hashString == v.hashString) {
                        if (addRep)
                            res.putValue(v, [v]);
                        else
                            res.putValue(v, []);
                    }
                }
                for (var _a = 0, all_2 = all; _a < all_2.length; _a++) {
                    var v = all_2[_a];
                    var rep = this.find(v);
                    if (rep.hashString != v.hashString) {
                        res.getValue(rep).push(v);
                    }
                }
                return res;
            };
            return UnionFind;
        }());
        general_algo.UnionFind = UnionFind;
    })(general_algo = mathis.general_algo || (mathis.general_algo = {}));
})(mathis || (mathis = {}));
var BABYLON;
(function (BABYLON) {
    var Vector3 = (function () {
        function Vector3(x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
        }
        return Vector3;
    }());
    BABYLON.Vector3 = Vector3;
    var Matrix = (function () {
        function Matrix() {
            this.m = [];
        }
        return Matrix;
    }());
    BABYLON.Matrix = Matrix;
    var Quaternion = (function () {
        function Quaternion(x, y, z, w) {
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
        }
        return Quaternion;
    }());
    BABYLON.Quaternion = Quaternion;
    var Mesh = (function () {
        function Mesh() {
        }
        return Mesh;
    }());
    BABYLON.Mesh = Mesh;
})(BABYLON || (BABYLON = {}));
var mathis;
(function (mathis) {
    mathis.PI = Math.PI;
    mathis.cos = Math.cos;
    mathis.sin = Math.sin;
    mathis.exp = Math.exp;
    mathis.sqrt = Math.sqrt;
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
            return _super.call(this, x, y, z) || this;
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
        XYZ.prototype.length = function () {
            return mathis.geo.norme(this);
        };
        XYZ.prototype.lengthSquared = function () {
            return mathis.geo.squareNorme(this);
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
        XYZ.nbDecimalForHash = 5;
        return XYZ;
    }(BABYLON.Vector3));
    mathis.XYZ = XYZ;
    var tempXYZ0 = new XYZ(0, 0, 0);
    var tempXYZ1 = new XYZ(0, 0, 0);
    var XYZW = (function (_super) {
        __extends(XYZW, _super);
        function XYZW(x, y, z, w) {
            return _super.call(this, x, y, z, w) || this;
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
        Hash.orientedSegmentTuple = function (link) {
            return link[0].hashNumber + ',' + link[1].hashNumber;
        };
        Hash.orientedSegment = function (a, b) {
            return a.hashNumber + ',' + b.hashNumber;
        };
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
                if (this.scaling != null) {
                    if (mesh.scaling == null)
                        mesh.scaling = new XYZ(1, 1, 1);
                    mesh.scaling.x = this.scaling.x;
                    mesh.scaling.y = this.scaling.y;
                    mesh.scaling.z = this.scaling.z;
                }
                if (quaternion != null) {
                    if (mesh.rotationQuaternion == null)
                        mesh.rotationQuaternion = new XYZW(0, 0, 0, 1);
                    mesh.rotationQuaternion.x = quaternion.x;
                    mesh.rotationQuaternion.y = quaternion.y;
                    mesh.rotationQuaternion.z = quaternion.z;
                    mesh.rotationQuaternion.w = quaternion.w;
                }
                if (this.position != null) {
                    if (mesh.position == null)
                        mesh.position = new XYZ(0, 0, 0);
                    mesh.position.x = this.position.x;
                    mesh.position.y = this.position.y;
                    mesh.position.z = this.position.z;
                }
            }
        };
        Positioning.prototype.applyToMesh = function (mesh) {
            this.applyToMeshes([mesh]);
        };
        Positioning.prototype.applyToVertices = function (vertices) {
            var quaternion = this.quaternion();
            var matrix = new MM();
            mathis.geo.quaternionToMatrix(quaternion, matrix);
            for (var _i = 0, vertices_1 = vertices; _i < vertices_1.length; _i++) {
                var vertex = vertices_1[_i];
                vertex.position.multiply(this.scaling);
                mathis.geo.multiplicationVectorMatrix(matrix, vertex.position, vertex.position);
                vertex.position.add(this.position);
            }
        };
        return Positioning;
    }());
    mathis.Positioning = Positioning;
    var MM = (function (_super) {
        __extends(MM, _super);
        function MM() {
            return _super.call(this) || this;
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
    var Vertex = (function () {
        function Vertex() {
            this.links = [];
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
    (function (Vertex) {
        var Markers;
        (function (Markers) {
            Markers[Markers["honeyComb"] = 0] = "honeyComb";
            Markers[Markers["corner"] = 1] = "corner";
            Markers[Markers["center"] = 2] = "center";
            Markers[Markers["border"] = 3] = "border";
            Markers[Markers["polygonCenter"] = 4] = "polygonCenter";
            Markers[Markers["selectedForLineDrawing"] = 5] = "selectedForLineDrawing";
        })(Markers = Vertex.Markers || (Vertex.Markers = {}));
    })(Vertex = mathis.Vertex || (mathis.Vertex = {}));
    var Mamesh = (function () {
        function Mamesh() {
            this.vertices = [];
            this.smallestTriangles = [];
            this.smallestSquares = [];
            this.hexahedrons = [];
            this.cutSegmentsDico = {};
        }
        Object.defineProperty(Mamesh.prototype, "polygons", {
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
        Mamesh.prototype.addATriangle = function (a, b, c, exceptionIfAVertexIsNull) {
            if (exceptionIfAVertexIsNull === void 0) { exceptionIfAVertexIsNull = false; }
            if (a != null && b != null && c != null)
                this.smallestTriangles.push(a, b, c);
            else if (exceptionIfAVertexIsNull)
                throw "you try to add a null vertex in a triangle";
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
        };
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
        Mamesh.prototype.checkPolygonAsLinkedSides = function (poly) {
            for (var i = 0; i < poly.length; i++) {
                if (!poly[i].hasVoisin(poly[(i + 1) % poly.length]))
                    return false;
            }
            return true;
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
    var ClickEvent = (function () {
        function ClickEvent() {
        }
        return ClickEvent;
    }());
    mathis.ClickEvent = ClickEvent;
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    var geo;
    (function (geo) {
        function copyXYZ(original, result) {
            result.x = original.x;
            result.y = original.y;
            result.z = original.z;
            return result;
        }
        geo.copyXYZ = copyXYZ;
        function copyXyzFromFloat(x, y, z, result) {
            result.x = x;
            result.y = y;
            result.z = z;
            return result;
        }
        geo.copyXyzFromFloat = copyXyzFromFloat;
        function copyMat(original, result) {
            for (var i = 0; i < 16; i++)
                result.m[i] = original.m[i];
            return result;
        }
        geo.copyMat = copyMat;
        function matEquality(mat1, mat2) {
            for (var i = 0; i < 16; i++) {
                if (mat1.m[i] != mat2.m[i])
                    return false;
            }
            return true;
        }
        geo.matEquality = matEquality;
        function matAlmostEquality(mat1, mat2) {
            for (var i = 0; i < 16; i++) {
                if (!almostEquality(mat1.m[i], mat2.m[i]))
                    return false;
            }
            return true;
        }
        geo.matAlmostEquality = matAlmostEquality;
        function xyzEquality(vec1, vec2) {
            return vec1.x == vec2.x && vec1.y == vec2.y && vec1.z == vec2.z;
        }
        geo.xyzEquality = xyzEquality;
        geo.epsilon = 0.00000001;
        geo.epsilonSquare = geo.epsilon * geo.epsilon;
        geo.epsitlonForAlmostEquality = 0.000001;
        function xyzAlmostEquality(vec1, vec2) {
            return Math.abs(vec1.x - vec2.x) < geo.epsitlonForAlmostEquality && Math.abs(vec1.y - vec2.y) < geo.epsitlonForAlmostEquality && Math.abs(vec1.z - vec2.z) < geo.epsitlonForAlmostEquality;
        }
        geo.xyzAlmostEquality = xyzAlmostEquality;
        function xyzwAlmostEquality(vec1, vec2) {
            return Math.abs(vec1.x - vec2.x) < geo.epsitlonForAlmostEquality && Math.abs(vec1.y - vec2.y) < geo.epsitlonForAlmostEquality && Math.abs(vec1.z - vec2.z) < geo.epsitlonForAlmostEquality && Math.abs(vec1.w - vec2.w) < geo.epsitlonForAlmostEquality;
        }
        geo.xyzwAlmostEquality = xyzwAlmostEquality;
        function almostLogicalEqual(quat1, quat2) {
            return xyzwAlmostEquality(quat1, quat2) ||
                (almostEquality(quat1.x, -quat2.x) && almostEquality(quat1.y, -quat2.y) && almostEquality(quat1.z, -quat2.z) && almostEquality(quat1.w, -quat2.w));
        }
        geo.almostLogicalEqual = almostLogicalEqual;
        function xyzAlmostZero(vec) {
            return Math.abs(vec.x) < geo.epsilon && Math.abs(vec.y) < geo.epsilon && Math.abs(vec.z) < geo.epsilon;
        }
        geo.xyzAlmostZero = xyzAlmostZero;
        function almostEquality(a, b) {
            return Math.abs(b - a) < geo.epsitlonForAlmostEquality;
        }
        geo.almostEquality = almostEquality;
        function determinant(mat) {
            var temp1 = (mat.m[10] * mat.m[15]) - (mat.m[11] * mat.m[14]);
            var temp2 = (mat.m[9] * mat.m[15]) - (mat.m[11] * mat.m[13]);
            var temp3 = (mat.m[9] * mat.m[14]) - (mat.m[10] * mat.m[13]);
            var temp4 = (mat.m[8] * mat.m[15]) - (mat.m[11] * mat.m[12]);
            var temp5 = (mat.m[8] * mat.m[14]) - (mat.m[10] * mat.m[12]);
            var temp6 = (mat.m[8] * mat.m[13]) - (mat.m[9] * mat.m[12]);
            return ((((mat.m[0] * (((mat.m[5] * temp1) - (mat.m[6] * temp2)) + (mat.m[7] * temp3))) - (mat.m[1] * (((mat.m[4] * temp1) -
                (mat.m[6] * temp4)) + (mat.m[7] * temp5)))) + (mat.m[2] * (((mat.m[4] * temp2) - (mat.m[5] * temp4)) + (mat.m[7] * temp6)))) -
                (mat.m[3] * (((mat.m[4] * temp3) - (mat.m[5] * temp5)) + (mat.m[6] * temp6))));
        }
        geo.determinant = determinant;
        function inverse(m1, result) {
            if (Math.abs(determinant(m1)) < geo.epsilon)
                throw " you try to inverse a singular matrix";
            var l1 = m1.m[0];
            var l2 = m1.m[1];
            var l3 = m1.m[2];
            var l4 = m1.m[3];
            var l5 = m1.m[4];
            var l6 = m1.m[5];
            var l7 = m1.m[6];
            var l8 = m1.m[7];
            var l9 = m1.m[8];
            var l10 = m1.m[9];
            var l11 = m1.m[10];
            var l12 = m1.m[11];
            var l13 = m1.m[12];
            var l14 = m1.m[13];
            var l15 = m1.m[14];
            var l16 = m1.m[15];
            var l17 = (l11 * l16) - (l12 * l15);
            var l18 = (l10 * l16) - (l12 * l14);
            var l19 = (l10 * l15) - (l11 * l14);
            var l20 = (l9 * l16) - (l12 * l13);
            var l21 = (l9 * l15) - (l11 * l13);
            var l22 = (l9 * l14) - (l10 * l13);
            var l23 = ((l6 * l17) - (l7 * l18)) + (l8 * l19);
            var l24 = -(((l5 * l17) - (l7 * l20)) + (l8 * l21));
            var l25 = ((l5 * l18) - (l6 * l20)) + (l8 * l22);
            var l26 = -(((l5 * l19) - (l6 * l21)) + (l7 * l22));
            var l27 = 1.0 / ((((l1 * l23) + (l2 * l24)) + (l3 * l25)) + (l4 * l26));
            var l28 = (l7 * l16) - (l8 * l15);
            var l29 = (l6 * l16) - (l8 * l14);
            var l30 = (l6 * l15) - (l7 * l14);
            var l31 = (l5 * l16) - (l8 * l13);
            var l32 = (l5 * l15) - (l7 * l13);
            var l33 = (l5 * l14) - (l6 * l13);
            var l34 = (l7 * l12) - (l8 * l11);
            var l35 = (l6 * l12) - (l8 * l10);
            var l36 = (l6 * l11) - (l7 * l10);
            var l37 = (l5 * l12) - (l8 * l9);
            var l38 = (l5 * l11) - (l7 * l9);
            var l39 = (l5 * l10) - (l6 * l9);
            result.m[0] = l23 * l27;
            result.m[4] = l24 * l27;
            result.m[8] = l25 * l27;
            result.m[12] = l26 * l27;
            result.m[1] = -(((l2 * l17) - (l3 * l18)) + (l4 * l19)) * l27;
            result.m[5] = (((l1 * l17) - (l3 * l20)) + (l4 * l21)) * l27;
            result.m[9] = -(((l1 * l18) - (l2 * l20)) + (l4 * l22)) * l27;
            result.m[13] = (((l1 * l19) - (l2 * l21)) + (l3 * l22)) * l27;
            result.m[2] = (((l2 * l28) - (l3 * l29)) + (l4 * l30)) * l27;
            result.m[6] = -(((l1 * l28) - (l3 * l31)) + (l4 * l32)) * l27;
            result.m[10] = (((l1 * l29) - (l2 * l31)) + (l4 * l33)) * l27;
            result.m[14] = -(((l1 * l30) - (l2 * l32)) + (l3 * l33)) * l27;
            result.m[3] = -(((l2 * l34) - (l3 * l35)) + (l4 * l36)) * l27;
            result.m[7] = (((l1 * l34) - (l3 * l37)) + (l4 * l38)) * l27;
            result.m[11] = -(((l1 * l35) - (l2 * l37)) + (l4 * l39)) * l27;
            result.m[15] = (((l1 * l36) - (l2 * l38)) + (l3 * l39)) * l27;
        }
        geo.inverse = inverse;
        var _resultTransp = new mathis.MM();
        function transpose(matrix, result) {
            _resultTransp.m[0] = matrix.m[0];
            _resultTransp.m[1] = matrix.m[4];
            _resultTransp.m[2] = matrix.m[8];
            _resultTransp.m[3] = matrix.m[12];
            _resultTransp.m[4] = matrix.m[1];
            _resultTransp.m[5] = matrix.m[5];
            _resultTransp.m[6] = matrix.m[9];
            _resultTransp.m[7] = matrix.m[13];
            _resultTransp.m[8] = matrix.m[2];
            _resultTransp.m[9] = matrix.m[6];
            _resultTransp.m[10] = matrix.m[10];
            _resultTransp.m[11] = matrix.m[14];
            _resultTransp.m[12] = matrix.m[3];
            _resultTransp.m[13] = matrix.m[7];
            _resultTransp.m[14] = matrix.m[11];
            _resultTransp.m[15] = matrix.m[15];
            copyMat(_resultTransp, result);
        }
        geo.transpose = transpose;
        function multiplyMatMat(m1, other, result) {
            var tm0 = m1.m[0];
            var tm1 = m1.m[1];
            var tm2 = m1.m[2];
            var tm3 = m1.m[3];
            var tm4 = m1.m[4];
            var tm5 = m1.m[5];
            var tm6 = m1.m[6];
            var tm7 = m1.m[7];
            var tm8 = m1.m[8];
            var tm9 = m1.m[9];
            var tm10 = m1.m[10];
            var tm11 = m1.m[11];
            var tm12 = m1.m[12];
            var tm13 = m1.m[13];
            var tm14 = m1.m[14];
            var tm15 = m1.m[15];
            var om0 = other.m[0];
            var om1 = other.m[1];
            var om2 = other.m[2];
            var om3 = other.m[3];
            var om4 = other.m[4];
            var om5 = other.m[5];
            var om6 = other.m[6];
            var om7 = other.m[7];
            var om8 = other.m[8];
            var om9 = other.m[9];
            var om10 = other.m[10];
            var om11 = other.m[11];
            var om12 = other.m[12];
            var om13 = other.m[13];
            var om14 = other.m[14];
            var om15 = other.m[15];
            result.m[0] = tm0 * om0 + tm1 * om4 + tm2 * om8 + tm3 * om12;
            result.m[1] = tm0 * om1 + tm1 * om5 + tm2 * om9 + tm3 * om13;
            result.m[2] = tm0 * om2 + tm1 * om6 + tm2 * om10 + tm3 * om14;
            result.m[3] = tm0 * om3 + tm1 * om7 + tm2 * om11 + tm3 * om15;
            result.m[4] = tm4 * om0 + tm5 * om4 + tm6 * om8 + tm7 * om12;
            result.m[5] = tm4 * om1 + tm5 * om5 + tm6 * om9 + tm7 * om13;
            result.m[6] = tm4 * om2 + tm5 * om6 + tm6 * om10 + tm7 * om14;
            result.m[7] = tm4 * om3 + tm5 * om7 + tm6 * om11 + tm7 * om15;
            result.m[8] = tm8 * om0 + tm9 * om4 + tm10 * om8 + tm11 * om12;
            result.m[9] = tm8 * om1 + tm9 * om5 + tm10 * om9 + tm11 * om13;
            result.m[10] = tm8 * om2 + tm9 * om6 + tm10 * om10 + tm11 * om14;
            result.m[11] = tm8 * om3 + tm9 * om7 + tm10 * om11 + tm11 * om15;
            result.m[12] = tm12 * om0 + tm13 * om4 + tm14 * om8 + tm15 * om12;
            result.m[13] = tm12 * om1 + tm13 * om5 + tm14 * om9 + tm15 * om13;
            result.m[14] = tm12 * om2 + tm13 * om6 + tm14 * om10 + tm15 * om14;
            result.m[15] = tm12 * om3 + tm13 * om7 + tm14 * om11 + tm15 * om15;
        }
        geo.multiplyMatMat = multiplyMatMat;
        var baryResult = new mathis.XYZ(0, 0, 0);
        var _scaled = new mathis.XYZ(0, 0, 0);
        function baryCenter(xyzs, weights, result) {
            baryResult.x = 0;
            baryResult.y = 0;
            baryResult.z = 0;
            if (weights == null) {
                weights = [];
                for (var i_1 = 0; i_1 < xyzs.length; i_1++)
                    weights.push(1 / xyzs.length);
            }
            for (var i = 0; i < xyzs.length; i++) {
                copyXYZ(xyzs[i], _scaled);
                scale(_scaled, weights[i], _scaled);
                add(baryResult, _scaled, baryResult);
            }
            copyXYZ(baryResult, result);
        }
        geo.baryCenter = baryCenter;
        function between(v1, v2, alpha, res) {
            res.x = v1.x * (1 - alpha) + v2.x * alpha;
            res.y = v1.y * (1 - alpha) + v2.y * alpha;
            res.z = v1.z * (1 - alpha) + v2.z * alpha;
        }
        geo.between = between;
        function betweenUV(v1, v2, alpha, res) {
            res.u = v1.u * (1 - alpha) + v2.u * alpha;
            res.v = v1.v * (1 - alpha) + v2.v * alpha;
        }
        geo.betweenUV = betweenUV;
        var _matUn = new mathis.MM();
        var _source = new mathis.XYZ(0, 0, 0);
        function unproject(source, viewportWidth, viewportHeight, world, view, projection, result) {
            copyXYZ(source, _source);
            if (world != null) {
                multiplyMatMat(world, view, _matUn);
                multiplyMatMat(_matUn, projection, _matUn);
            }
            else {
                multiplyMatMat(view, projection, _matUn);
            }
            inverse(_matUn, _matUn);
            _source.x = _source.x / viewportWidth * 2 - 1;
            _source.y = -(_source.y / viewportHeight * 2 - 1);
            multiplicationVectorMatrix(_matUn, _source, result);
            var num = source.x * _matUn.m[3] + source.y * _matUn.m[7] + source.z * _matUn.m[11] + _matUn.m[15];
            if (withinEpsilon(num, 1.0)) {
                scale(result, 1.0 / num, result);
            }
        }
        geo.unproject = unproject;
        function withinEpsilon(a, b) {
            var num = a - b;
            return -1.401298E-45 <= num && num <= 1.401298E-45;
        }
        var _axis = new mathis.XYZ(0, 0, 0);
        function axisAngleToMatrix(axis, angle, result) {
            var s = Math.sin(-angle);
            var c = Math.cos(-angle);
            var c1 = 1 - c;
            copyXYZ(axis, _axis);
            normalize(_axis, _axis);
            result.m[0] = (_axis.x * _axis.x) * c1 + c;
            result.m[1] = (_axis.x * _axis.y) * c1 - (_axis.z * s);
            result.m[2] = (_axis.x * _axis.z) * c1 + (_axis.y * s);
            result.m[3] = 0.0;
            result.m[4] = (_axis.y * _axis.x) * c1 + (_axis.z * s);
            result.m[5] = (_axis.y * _axis.y) * c1 + c;
            result.m[6] = (_axis.y * _axis.z) * c1 - (_axis.x * s);
            result.m[7] = 0.0;
            result.m[8] = (_axis.z * _axis.x) * c1 - (_axis.y * s);
            result.m[9] = (_axis.z * _axis.y) * c1 + (_axis.x * s);
            result.m[10] = (_axis.z * _axis.z) * c1 + c;
            result.m[11] = 0.0;
            result.m[12] = 0.0;
            result.m[13] = 0.0;
            result.m[14] = 0.0;
            result.m[15] = 1.0;
        }
        geo.axisAngleToMatrix = axisAngleToMatrix;
        function multiplicationVectorMatrix(transformation, vector, result) {
            var x = (vector.x * transformation.m[0]) + (vector.y * transformation.m[4]) + (vector.z * transformation.m[8]) + transformation.m[12];
            var y = (vector.x * transformation.m[1]) + (vector.y * transformation.m[5]) + (vector.z * transformation.m[9]) + transformation.m[13];
            var z = (vector.x * transformation.m[2]) + (vector.y * transformation.m[6]) + (vector.z * transformation.m[10]) + transformation.m[14];
            var w = (vector.x * transformation.m[3]) + (vector.y * transformation.m[7]) + (vector.z * transformation.m[11]) + transformation.m[15];
            result.x = x / w;
            result.y = y / w;
            result.z = z / w;
        }
        geo.multiplicationVectorMatrix = multiplicationVectorMatrix;
        function axisAngleToQuaternion(axis, angle, result) {
            var sin = Math.sin(angle / 2);
            result.w = Math.cos(angle / 2);
            result.x = axis.x * sin;
            result.y = axis.y * sin;
            result.z = axis.z * sin;
        }
        geo.axisAngleToQuaternion = axisAngleToQuaternion;
        function matrixToQuaternion(m, result) {
            var m00, m01, m02, m10, m11, m12, m20, m21, m22;
            m00 = m.m[0];
            m10 = m.m[1];
            m20 = m.m[2];
            m01 = m.m[4];
            m11 = m.m[5];
            m21 = m.m[6];
            m02 = m.m[8];
            m12 = m.m[9];
            m22 = m.m[10];
            var qx, qy, qz, qw;
            var tr = m00 + m11 + m22;
            if (tr > 0) {
                var S = Math.sqrt(tr + 1.0) * 2;
                qw = 0.25 * S;
                qx = (m21 - m12) / S;
                qy = (m02 - m20) / S;
                qz = (m10 - m01) / S;
            }
            else if ((m00 > m11) && (m00 > m22)) {
                var S = Math.sqrt(1.0 + m00 - m11 - m22) * 2;
                qw = (m21 - m12) / S;
                qx = 0.25 * S;
                qy = (m01 + m10) / S;
                qz = (m02 + m20) / S;
            }
            else if (m11 > m22) {
                var S = Math.sqrt(1.0 + m11 - m00 - m22) * 2;
                qw = (m02 - m20) / S;
                qx = (m01 + m10) / S;
                qy = 0.25 * S;
                qz = (m12 + m21) / S;
            }
            else {
                var S = Math.sqrt(1.0 + m22 - m00 - m11) * 2;
                qw = (m10 - m01) / S;
                qx = (m02 + m20) / S;
                qy = (m12 + m21) / S;
                qz = 0.25 * S;
            }
            result.x = qx;
            result.y = qy;
            result.z = qz;
            result.w = qw;
        }
        geo.matrixToQuaternion = matrixToQuaternion;
        var _ortBasisV1 = new mathis.XYZ(0, 0, 0);
        var _ortBasisV2 = new mathis.XYZ(0, 0, 0);
        var _ortBasisV3 = new mathis.XYZ(0, 0, 0);
        var _ortBasisAll = new mathis.MM();
        function twoVectorsToQuaternion(v1, v2, firstIsPreserved, result) {
            if (firstIsPreserved) {
                orthonormalizeKeepingFirstDirection(v1, v2, _ortBasisV1, _ortBasisV2);
            }
            else {
                orthonormalizeKeepingFirstDirection(v2, v1, _ortBasisV2, _ortBasisV1);
            }
            cross(_ortBasisV1, _ortBasisV2, _ortBasisV3);
            matrixFromLines(_ortBasisV1, _ortBasisV2, _ortBasisV3, _ortBasisAll);
            matrixToQuaternion(_ortBasisAll, result);
        }
        geo.twoVectorsToQuaternion = twoVectorsToQuaternion;
        var _basisOrtho0 = new mathis.XYZ(0, 0, 0);
        var _basisOrtho1 = new mathis.XYZ(0, 0, 0);
        var _basisOrtho2 = new mathis.XYZ(0, 0, 0);
        var _basisMatrix = new mathis.MM();
        var _transposedBasisMatrix = new mathis.MM();
        var _diagoMatrix = new mathis.MM();
        function orthogonalProjectionOnLine(direction, result) {
            normalize(direction, _basisOrtho0);
            getOneOrthonormal(direction, _basisOrtho1);
            cross(_basisOrtho0, _basisOrtho1, _basisOrtho2);
            matrixFromLines(_basisOrtho0, _basisOrtho1, _basisOrtho2, _basisMatrix);
            transpose(_basisMatrix, _transposedBasisMatrix);
            _diagoMatrix.m[0] = 1;
            _diagoMatrix.m[15] = 1;
            multiplyMatMat(_transposedBasisMatrix, _diagoMatrix, result);
            multiplyMatMat(result, _basisMatrix, result);
        }
        geo.orthogonalProjectionOnLine = orthogonalProjectionOnLine;
        function orthogonalProjectionOnPlane(direction, otherDirection, result) {
            orthonormalizeKeepingFirstDirection(direction, otherDirection, _basisOrtho0, _basisOrtho1);
            cross(_basisOrtho0, _basisOrtho1, _basisOrtho2);
            matrixFromLines(_basisOrtho0, _basisOrtho1, _basisOrtho2, _basisMatrix);
            transpose(_basisMatrix, _transposedBasisMatrix);
            _diagoMatrix.m[0] = 1;
            _diagoMatrix.m[5] = 1;
            _diagoMatrix.m[15] = 1;
            multiplyMatMat(_transposedBasisMatrix, _diagoMatrix, result);
            multiplyMatMat(result, _basisMatrix, result);
        }
        geo.orthogonalProjectionOnPlane = orthogonalProjectionOnPlane;
        function quaternionToMatrix(quaternion, result) {
            var xx = quaternion.x * quaternion.x;
            var yy = quaternion.y * quaternion.y;
            var zz = quaternion.z * quaternion.z;
            var xy = quaternion.x * quaternion.y;
            var zw = quaternion.z * quaternion.w;
            var zx = quaternion.z * quaternion.x;
            var yw = quaternion.y * quaternion.w;
            var yz = quaternion.y * quaternion.z;
            var xw = quaternion.x * quaternion.w;
            result.m[0] = 1.0 - (2.0 * (yy + zz));
            result.m[1] = 2.0 * (xy + zw);
            result.m[2] = 2.0 * (zx - yw);
            result.m[3] = 0;
            result.m[4] = 2.0 * (xy - zw);
            result.m[5] = 1.0 - (2.0 * (zz + xx));
            result.m[6] = 2.0 * (yz + xw);
            result.m[7] = 0;
            result.m[8] = 2.0 * (zx + yw);
            result.m[9] = 2.0 * (yz - xw);
            result.m[10] = 1.0 - (2.0 * (yy + xx));
            result.m[11] = 0;
            result.m[12] = 0;
            result.m[13] = 0;
            result.m[14] = 0;
            result.m[15] = 1.0;
        }
        geo.quaternionToMatrix = quaternionToMatrix;
        function quaternionMultiplication(q0, q1, result) {
            var x = q0.x * q1.w + q0.y * q1.z - q0.z * q1.y + q0.w * q1.x;
            var y = -q0.x * q1.z + q0.y * q1.w + q0.z * q1.x + q0.w * q1.y;
            var z = q0.x * q1.y - q0.y * q1.x + q0.z * q1.w + q0.w * q1.z;
            var w = -q0.x * q1.x - q0.y * q1.y - q0.z * q1.z + q0.w * q1.w;
            result.x = x;
            result.y = y;
            result.z = z;
            result.w = w;
        }
        geo.quaternionMultiplication = quaternionMultiplication;
        var matt1 = new mathis.MM();
        var matt2 = new mathis.MM();
        var oor1 = new mathis.XYZ(0, 0, 0);
        var oor2 = new mathis.XYZ(0, 0, 0);
        var copA = new mathis.XYZ(0, 0, 0);
        var copB = new mathis.XYZ(0, 0, 0);
        var copC = new mathis.XYZ(0, 0, 0);
        var copD = new mathis.XYZ(0, 0, 0);
        function anOrthogonalMatrixMovingABtoCD(a, b, c, d, result, argsAreOrthonormal) {
            if (argsAreOrthonormal === void 0) { argsAreOrthonormal = false; }
            if (argsAreOrthonormal) {
                copA.copyFrom(a);
                copB.copyFrom(b);
                copC.copyFrom(c);
                copD.copyFrom(d);
            }
            else {
                orthonormalizeKeepingFirstDirection(a, b, copA, copB);
                orthonormalizeKeepingFirstDirection(c, d, copC, copD);
            }
            cross(copA, copB, oor1);
            matrixFromLines(copA, copB, oor1, matt1);
            cross(copC, copD, oor2);
            matrixFromLines(copC, copD, oor2, matt2);
            transpose(matt1, matt1);
            multiplyMatMat(matt1, matt2, result);
        }
        geo.anOrthogonalMatrixMovingABtoCD = anOrthogonalMatrixMovingABtoCD;
        function linearTransformation_3vec(v0, v1, v2, w0, w1, w2, result) {
            var V = new mathis.MM();
            var W = new mathis.MM();
            matrixFromLines(v0, v1, v2, V);
            matrixFromLines(w0, w1, w2, W);
            inverse(V, V);
            multiplyMatMat(V, W, result);
        }
        geo.linearTransformation_3vec = linearTransformation_3vec;
        function affineTransformation_4vec(v0, v1, v2, v3, w0, w1, w2, w3, result) {
            var vv1 = mathis.XYZ.newFrom(v1).substract(v0);
            var vv2 = mathis.XYZ.newFrom(v2).substract(v0);
            var vv3 = mathis.XYZ.newFrom(v3).substract(v0);
            var ww1 = mathis.XYZ.newFrom(w1).substract(w0);
            var ww2 = mathis.XYZ.newFrom(w2).substract(w0);
            var ww3 = mathis.XYZ.newFrom(w3).substract(w0);
            linearTransformation_3vec(vv1, vv2, vv3, ww1, ww2, ww3, result);
            var translation = new mathis.XYZ(0, 0, 0);
            multiplicationVectorMatrix(result, v0, translation);
            translation.scale(-1).add(w0);
            result.m[12] = translation.x;
            result.m[13] = translation.y;
            result.m[14] = translation.z;
        }
        geo.affineTransformation_4vec = affineTransformation_4vec;
        function affineTransformation_3vec(v0, v1, v2, w0, w1, w2, result) {
            var v3 = new mathis.XYZ(0, 0, 0);
            var w3 = new mathis.XYZ(0, 0, 0);
            cross(v1, v2, v3);
            cross(w1, w2, w3);
            v3.add(v0);
            w3.add(w0);
            affineTransformation_4vec(v0, v1, v2, v3, w0, w1, w2, w3, result);
        }
        geo.affineTransformation_3vec = affineTransformation_3vec;
        var matBefore = new mathis.MM();
        function aQuaternionMovingABtoCD(a, b, c, d, result, argsAreOrthonormal) {
            if (argsAreOrthonormal === void 0) { argsAreOrthonormal = false; }
            anOrthogonalMatrixMovingABtoCD(a, b, c, d, matBefore, argsAreOrthonormal);
            matrixToQuaternion(matBefore, result);
        }
        geo.aQuaternionMovingABtoCD = aQuaternionMovingABtoCD;
        function slerp(left, right, amount, result) {
            var num2;
            var num3;
            var num = amount;
            var num4 = (((left.x * right.x) + (left.y * right.y)) + (left.z * right.z)) + (left.w * right.w);
            var flag = false;
            if (num4 < 0) {
                flag = true;
                num4 = -num4;
            }
            if (num4 > 0.999999) {
                num3 = 1 - num;
                num2 = flag ? -num : num;
            }
            else {
                var num5 = Math.acos(num4);
                var num6 = (1.0 / Math.sin(num5));
                num3 = (Math.sin((1.0 - num) * num5)) * num6;
                num2 = flag ? ((-Math.sin(num * num5)) * num6) : ((Math.sin(num * num5)) * num6);
            }
            result.x = (num3 * left.x) + (num2 * right.x);
            result.y = (num3 * left.y) + (num2 * right.y);
            result.z = (num3 * left.z) + (num2 * right.z);
            result.w = (num3 * left.w) + (num2 * right.w);
        }
        geo.slerp = slerp;
        function matrixFromLines(line1, line2, line3, result) {
            result.m[0] = line1.x;
            result.m[1] = line1.y;
            result.m[2] = line1.z;
            result.m[3] = 0;
            result.m[4] = line2.x;
            result.m[5] = line2.y;
            result.m[6] = line2.z;
            result.m[7] = 0;
            result.m[8] = line3.x;
            result.m[9] = line3.y;
            result.m[10] = line3.z;
            result.m[11] = 0;
            result.m[12] = 0;
            result.m[13] = 0;
            result.m[14] = 0;
            result.m[15] = 1.0;
        }
        geo.matrixFromLines = matrixFromLines;
        var v1nor = new mathis.XYZ(0, 0, 0);
        var v2nor = new mathis.XYZ(0, 0, 0);
        function angleBetweenTwoVectorsBetween0andPi(v1, v2) {
            if (xyzAlmostZero(v1) || xyzAlmostZero(v2)) {
                throw 'be aware: you compute angle between two vectors, one of them being almost zero';
            }
            normalize(v1, v1nor);
            normalize(v2, v2nor);
            var dotProduct = dot(v1nor, v2nor);
            if (dotProduct > 1)
                return 0;
            if (dotProduct < -1)
                return Math.PI;
            else
                return Math.acos(dotProduct);
        }
        geo.angleBetweenTwoVectorsBetween0andPi = angleBetweenTwoVectorsBetween0andPi;
        function almostParallel(v1, v2, oppositeAreParallel, toleranceAngle) {
            if (oppositeAreParallel === void 0) { oppositeAreParallel = true; }
            if (toleranceAngle === void 0) { toleranceAngle = 0.001; }
            var angle = angleBetweenTwoVectorsBetween0andPi(v1, v2);
            if (angle < toleranceAngle)
                return true;
            if (oppositeAreParallel && Math.PI - angle < toleranceAngle)
                return true;
            return false;
        }
        geo.almostParallel = almostParallel;
        var _aCros = new mathis.XYZ(0, 0, 0);
        function angleBetweenTwoVectorsBetweenMinusPiAndPi(v1, v2, upDirection) {
            var angle = angleBetweenTwoVectorsBetween0andPi(v1, v2);
            cross(v1, v2, _aCros);
            var sign = (dot(upDirection, _aCros) < 0) ? -1 : 1;
            return sign * angle;
        }
        geo.angleBetweenTwoVectorsBetweenMinusPiAndPi = angleBetweenTwoVectorsBetweenMinusPiAndPi;
        function angleBetweenTwoVectorsBetween0And2Pi(v1, v2, upDirection) {
            var angle = angleBetweenTwoVectorsBetweenMinusPiAndPi(v1, v2, upDirection);
            if (angle >= 0)
                return angle;
            return 2 * Math.PI + angle;
        }
        geo.angleBetweenTwoVectorsBetween0And2Pi = angleBetweenTwoVectorsBetween0And2Pi;
        function segmentsIntersection(c0x, c0y, c1x, c1y, c2x, c2y, c3x, c3y) {
            var d1x = c1x - c0x;
            var d1y = c1y - c0y;
            var d2x = c2x - c3x;
            var d2y = c2y - c3y;
            var sx = c3x - c0x;
            var sy = c3y - c0y;
            var det = -d1x * d2y + d1y * d2x;
            if (Math.abs(det) < 0.0001)
                return null;
            var alpha = (-sx * d2y + sy * d2x) / det;
            var beta = (-sx * d1y + sy * d1x) / det;
            return { x: alpha * d1x + c0x, y: alpha * d1y + c0y };
        }
        geo.segmentsIntersection = segmentsIntersection;
        var _quat0 = new mathis.XYZW(0, 0, 0, 0);
        var _quat1 = new mathis.XYZW(0, 0, 0, 0);
        var _quatAlpha = new mathis.XYZW(0, 0, 0, 0);
        var _mat0 = new mathis.MM();
        var _mat1 = new mathis.MM();
        var _matAlpha = new mathis.MM();
        var _c0 = new mathis.XYZ(0, 0, 0);
        var _c1 = new mathis.XYZ(0, 0, 0);
        function slerpTwoOrthogonalVectors(a0, b0, a1, b1, alpha, aAlpha, bAlpha) {
            cross(a0, b0, _c0);
            cross(a1, b1, _c1);
            matrixFromLines(a0, b0, _c0, _mat0);
            matrixFromLines(a1, b1, _c1, _mat1);
            matrixToQuaternion(_mat0, _quat0);
            matrixToQuaternion(_mat1, _quat1);
            slerp(_quat0, _quat1, alpha, _quatAlpha);
            quaternionToMatrix(_quatAlpha, _matAlpha);
            copyXyzFromFloat(_matAlpha.m[0], _matAlpha.m[1], _matAlpha.m[2], aAlpha);
            copyXyzFromFloat(_matAlpha.m[4], _matAlpha.m[5], _matAlpha.m[7], bAlpha);
        }
        geo.slerpTwoOrthogonalVectors = slerpTwoOrthogonalVectors;
        function interpolateTwoVectors(a0, a1, alpha, aAlpha) {
            aAlpha.x = a0.x * (1 - alpha) + a1.x * alpha;
            aAlpha.y = a0.y * (1 - alpha) + a1.y * alpha;
            aAlpha.z = a0.z * (1 - alpha) + a1.z * alpha;
        }
        geo.interpolateTwoVectors = interpolateTwoVectors;
        function scale(vec, scalar, result) {
            result.x = vec.x * scalar;
            result.y = vec.y * scalar;
            result.z = vec.z * scalar;
        }
        geo.scale = scale;
        function add(v1, v2, result) {
            result.x = v1.x + v2.x;
            result.y = v1.y + v2.y;
            result.z = v1.z + v2.z;
        }
        geo.add = add;
        function substract(v1, v2, result) {
            result.x = v1.x - v2.x;
            result.y = v1.y - v2.y;
            result.z = v1.z - v2.z;
        }
        geo.substract = substract;
        function dot(left, right) {
            return (left.x * right.x + left.y * right.y + left.z * right.z);
        }
        geo.dot = dot;
        function norme(vec) {
            return Math.sqrt(vec.x * vec.x + vec.y * vec.y + vec.z * vec.z);
        }
        geo.norme = norme;
        function squareNorme(vec) {
            return vec.x * vec.x + vec.y * vec.y + vec.z * vec.z;
        }
        geo.squareNorme = squareNorme;
        var _crossResult = new mathis.XYZ(0, 0, 0);
        function cross(left, right, result) {
            _crossResult.x = left.y * right.z - left.z * right.y;
            _crossResult.y = left.z * right.x - left.x * right.z;
            _crossResult.z = left.x * right.y - left.y * right.x;
            copyXYZ(_crossResult, result);
        }
        geo.cross = cross;
        var v1forSubstraction = new mathis.XYZ(0, 0, 0);
        var randV2 = new mathis.XYZ(0, 0, 0);
        var _result1 = new mathis.XYZ(0, 0, 0);
        var _result2 = new mathis.XYZ(0, 0, 0);
        function orthonormalizeKeepingFirstDirection(v1, v2, result1, result2) {
            normalize(v1, _result1);
            copyXYZ(v1, v1forSubstraction);
            scale(v1forSubstraction, dot(v1, v2), v1forSubstraction);
            substract(v2, v1forSubstraction, _result2);
            if (squareNorme(_result2) < geo.epsilon * geo.epsilon) {
                copyXyzFromFloat(Math.random(), Math.random(), Math.random(), randV2);
                mathis.logger.c("beware: you try to orthonormalize two co-linear vectors");
                return orthonormalizeKeepingFirstDirection(v1, randV2, result1, result2);
            }
            normalize(_result2, _result2);
            copyXYZ(_result1, result1);
            copyXYZ(_result2, result2);
        }
        geo.orthonormalizeKeepingFirstDirection = orthonormalizeKeepingFirstDirection;
        function getOneOrthonormal(vec, result) {
            if (Math.abs(vec.x) + Math.abs(vec.y) > 0.0001)
                result.copyFromFloats(-vec.y, vec.x, 0);
            else
                result.copyFromFloats(0, -vec.z, vec.y);
            normalize(result, result);
        }
        geo.getOneOrthonormal = getOneOrthonormal;
        function normalize(vec, result) {
            var norme = geo.norme(vec);
            if (norme < geo.epsilon)
                throw "one can not normalize a the almost zero vector:" + vec;
            scale(vec, 1 / norme, result);
        }
        geo.normalize = normalize;
        var spheCentToRayOri = new mathis.XYZ(0, 0, 0);
        var _resultInters = new mathis.XYZ(0, 0, 0);
        function intersectionBetweenRayAndSphereFromRef(rayOrigine, rayDirection, aRadius, sphereCenter, result1, result2) {
            copyXYZ(rayOrigine, spheCentToRayOri);
            substract(spheCentToRayOri, sphereCenter, spheCentToRayOri);
            var a = squareNorme(rayDirection);
            var b = 2 * dot(rayDirection, spheCentToRayOri);
            var c = squareNorme(spheCentToRayOri) - aRadius * aRadius;
            var discriminant = b * b - 4 * a * c;
            if (discriminant < 0) {
                return false;
            }
            else {
                var t1 = (-b + Math.sqrt(discriminant)) / 2 / a;
                var t2 = (-b - Math.sqrt(discriminant)) / 2 / a;
                copyXYZ(rayDirection, _resultInters);
                scale(_resultInters, t1, _resultInters);
                add(_resultInters, rayOrigine, _resultInters);
                copyXYZ(_resultInters, result1);
                copyXYZ(rayDirection, _resultInters);
                scale(_resultInters, t2, _resultInters);
                add(_resultInters, rayOrigine, _resultInters);
                copyXYZ(_resultInters, result2);
                return true;
            }
        }
        geo.intersectionBetweenRayAndSphereFromRef = intersectionBetweenRayAndSphereFromRef;
        var difference = new mathis.XYZ(0, 0, 0);
        function distance(vect1, vect2) {
            copyXYZ(vect1, difference);
            substract(difference, vect2, difference);
            return norme(difference);
        }
        geo.distance = distance;
        function squaredDistance(vect1, vect2) {
            copyXYZ(vect1, difference);
            substract(difference, vect2, difference);
            return squareNorme(difference);
        }
        geo.squaredDistance = squaredDistance;
        function closerOf(candidat1, canditat2, reference, result) {
            var l1 = distance(candidat1, reference);
            var l2 = distance(canditat2, reference);
            if (l1 < l2)
                copyXYZ(candidat1, result);
            else
                copyXYZ(canditat2, result);
            return (l1 < l2) ? l1 : l2;
        }
        geo.closerOf = closerOf;
        var _xAxis = mathis.XYZ.newZero();
        var _yAxis = mathis.XYZ.newZero();
        var _zAxis = mathis.XYZ.newZero();
        function LookAtLH(eye, target, up, result) {
            substract(target, eye, _zAxis);
            normalize(_zAxis, _zAxis);
            cross(up, _zAxis, _xAxis);
            if (xyzAlmostZero(_xAxis)) {
                _xAxis.x = 1.0;
            }
            else {
                _xAxis.normalize();
            }
            cross(_zAxis, _xAxis, _yAxis);
            _yAxis.normalize();
            var ex = -dot(_xAxis, eye);
            var ey = -dot(_yAxis, eye);
            var ez = -dot(_zAxis, eye);
            numbersToMM(_xAxis.x, _yAxis.x, _zAxis.x, 0, _xAxis.y, _yAxis.y, _zAxis.y, 0, _xAxis.z, _yAxis.z, _zAxis.z, 0, ex, ey, ez, 1, result);
        }
        geo.LookAtLH = LookAtLH;
        function OrthoOffCenterLH(left, right, bottom, top, znear, zfar, result) {
            result.m[0] = 2.0 / (right - left);
            result.m[1] = result.m[2] = result.m[3] = 0;
            result.m[5] = 2.0 / (top - bottom);
            result.m[4] = result.m[6] = result.m[7] = 0;
            result.m[10] = -1.0 / (znear - zfar);
            result.m[8] = result.m[9] = result.m[11] = 0;
            result.m[12] = (left + right) / (left - right);
            result.m[13] = (top + bottom) / (bottom - top);
            result.m[14] = znear / (znear - zfar);
            result.m[15] = 1.0;
        }
        geo.OrthoOffCenterLH = OrthoOffCenterLH;
        function PerspectiveFovLH(fov, aspect, znear, zfar, result) {
            var tan = 1.0 / (Math.tan(fov * 0.5));
            var v_fixed = true;
            if (v_fixed) {
                result.m[0] = tan / aspect;
            }
            else {
                result.m[0] = tan;
            }
            result.m[1] = result.m[2] = result.m[3] = 0.0;
            if (v_fixed) {
                result.m[5] = tan;
            }
            else {
                result.m[5] = tan * aspect;
            }
            result.m[4] = result.m[6] = result.m[7] = 0.0;
            result.m[8] = result.m[9] = 0.0;
            result.m[10] = -zfar / (znear - zfar);
            result.m[11] = 1.0;
            result.m[12] = result.m[13] = result.m[15] = 0.0;
            result.m[14] = (znear * zfar) / (znear - zfar);
        }
        geo.PerspectiveFovLH = PerspectiveFovLH;
        function numbersToMM(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, res) {
            res.m[0] = a0;
            res.m[1] = a1;
            res.m[2] = a2;
            res.m[3] = a3;
            res.m[4] = a4;
            res.m[5] = a5;
            res.m[6] = a6;
            res.m[7] = a7;
            res.m[8] = a8;
            res.m[9] = a9;
            res.m[10] = a10;
            res.m[11] = a11;
            res.m[12] = a12;
            res.m[13] = a13;
            res.m[14] = a14;
            res.m[15] = a15;
        }
        geo.numbersToMM = numbersToMM;
        function newHermite(value1, tangent1, value2, tangent2, amount) {
            var squared = amount * amount;
            var cubed = amount * squared;
            var part1 = ((2.0 * cubed) - (3.0 * squared)) + 1.0;
            var part2 = (-2.0 * cubed) + (3.0 * squared);
            var part3 = (cubed - (2.0 * squared)) + amount;
            var part4 = cubed - squared;
            var x = (((value1.x * part1) + (value2.x * part2)) + (tangent1.x * part3)) + (tangent2.x * part4);
            var y = (((value1.y * part1) + (value2.y * part2)) + (tangent1.y * part3)) + (tangent2.y * part4);
            var z = (((value1.z * part1) + (value2.z * part2)) + (tangent1.z * part3)) + (tangent2.z * part4);
            return new mathis.XYZ(x, y, z);
        }
        function hermiteSpline(p1, t1, p2, t2, nbPoints, result) {
            mathis.tab.clearArray(result);
            var step = 1 / nbPoints;
            for (var i = 0; i < nbPoints; i++) {
                result.push(newHermite(p1, t1, p2, t2, i * step));
            }
        }
        geo.hermiteSpline = hermiteSpline;
        function quadraticBezier(v0, v1, v2, nbPoints, result) {
            mathis.tab.clearArray(result);
            nbPoints = nbPoints > 2 ? nbPoints : 3;
            var equation = function (t, val0, val1, val2) {
                var res = (1 - t) * (1 - t) * val0 + 2 * t * (1 - t) * val1 + t * t * val2;
                return res;
            };
            for (var i = 0; i < nbPoints; i++) {
                result.push(new mathis.XYZ(equation(i / nbPoints, v0.x, v1.x, v2.x), equation(i / nbPoints, v0.y, v1.y, v2.y), equation(i / nbPoints, v0.z, v1.z, v2.z)));
            }
        }
        geo.quadraticBezier = quadraticBezier;
        function cubicBezier(v0, v1, v2, v3, nbPoints, result) {
            mathis.tab.clearArray(result);
            nbPoints = nbPoints > 3 ? nbPoints : 4;
            var equation = function (t, val0, val1, val2, val3) {
                var res = (1 - t) * (1 - t) * (1 - t) * val0 + 3 * t * (1 - t) * (1 - t) * val1 + 3 * t * t * (1 - t) * val2 + t * t * t * val3;
                return res;
            };
            for (var i = 0; i < nbPoints; i++) {
                result.push(new mathis.XYZ(equation(i / nbPoints, v0.x, v1.x, v2.x, v3.x), equation(i / nbPoints, v0.y, v1.y, v2.y, v3.y), equation(i / nbPoints, v0.z, v1.z, v2.z, v3.z)));
            }
        }
        geo.cubicBezier = cubicBezier;
        function affineTransformGenerator(originIN, endIN, originOUT, endOUT) {
            var amplitudeIN = mathis.XYZ.newFrom(endIN).substract(originIN);
            var amplitudeOUT = mathis.XYZ.newFrom(endOUT).substract(originOUT);
            if (amplitudeIN.x == 0 && amplitudeOUT.x != 0)
                throw "impossible affine transform from a rectangle to a pavé";
            if (amplitudeIN.y == 0 && amplitudeOUT.y != 0)
                throw "impossible affine transform from a rectangle to a pavé";
            if (amplitudeIN.z == 0 && amplitudeOUT.z != 0)
                throw "impossible affine transform from a rectangle to a pavé";
            var nb0 = 0;
            if (amplitudeIN.x == 0)
                nb0++;
            if (amplitudeIN.y == 0)
                nb0++;
            if (amplitudeIN.z == 0)
                nb0++;
            if (nb0 >= 2)
                throw "intrance pavé is too degenerated";
            var amplitudeINinv = new mathis.XYZ((amplitudeIN.x == 0) ? 1 : 1 / amplitudeIN.x, (amplitudeIN.y == 0) ? 1 : 1 / amplitudeIN.y, (amplitudeIN.z == 0) ? 1 : 1 / amplitudeIN.z);
            var res = function (vecIn, vecOut) {
                vecOut.copyFrom(vecIn).substract(originIN).multiply(amplitudeINinv).multiply(amplitudeOUT).add(originOUT);
            };
            return res;
        }
        geo.affineTransformGenerator = affineTransformGenerator;
    })(geo = mathis.geo || (mathis.geo = {}));
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    var geometry;
    (function (geometry) {
        var CloseXYZfinder = (function () {
            function CloseXYZfinder(recepteurList, sourceList, nbDistinctPoint) {
                this.nbDistinctPoint = 1000;
                this.maxDistToBeClose = null;
                this.deformationFunction = function (point) { return point; };
                this.mins = new mathis.XYZ(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
                this.maxs = new mathis.XYZ(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
                this.nbDistinctPoint = nbDistinctPoint;
                this.recepteurList = recepteurList;
                if (sourceList == null || recepteurList == sourceList) {
                    this.sourceList = recepteurList;
                    this.sourceEqualRecepter = true;
                }
                else {
                    this.sourceList = sourceList;
                    this.sourceEqualRecepter = false;
                }
            }
            CloseXYZfinder.prototype.go = function () {
                this.buildScaler();
                var amplitude = new mathis.XYZ(Math.max(1, this.maxs.x - this.mins.x), Math.max(1, this.maxs.y - this.mins.y), Math.max(1, this.maxs.z - this.mins.z));
                var recepteurBalises = {};
                for (var i = 0; i < this.recepteurList.length; i++) {
                    var val = this.deformationFunction(this.recepteurList[i]);
                    var resx = Math.round((val.x - this.mins.x) / amplitude.x * this.nbDistinctPoint);
                    var resy = Math.round((val.y - this.mins.y) / amplitude.y * this.nbDistinctPoint);
                    var resz = Math.round((val.z - this.mins.z) / amplitude.z * this.nbDistinctPoint);
                    var key = resx + ',' + resy + ',' + resz;
                    if (recepteurBalises[key] == null)
                        recepteurBalises[key] = i;
                    else if (!this.sourceEqualRecepter)
                        mathis.logger.c('strange: the recepterList has several XYZ very close. This is, in general, only possible, when recepter equal source');
                }
                var res = {};
                for (var i = 0; i < this.sourceList.length; i++) {
                    var val = this.deformationFunction(this.sourceList[i]);
                    var resx = Math.round((val.x - this.mins.x) / amplitude.x * this.nbDistinctPoint);
                    var resy = Math.round((val.y - this.mins.y) / amplitude.y * this.nbDistinctPoint);
                    var resz = Math.round((val.z - this.mins.z) / amplitude.z * this.nbDistinctPoint);
                    var baliseIndex = recepteurBalises[resx + ',' + resy + ',' + resz];
                    if (baliseIndex != null) {
                        if (this.sourceEqualRecepter) {
                            if (baliseIndex != i)
                                res[i] = baliseIndex;
                        }
                        else
                            res[i] = baliseIndex;
                    }
                }
                return res;
            };
            CloseXYZfinder.prototype.buildScaler = function () {
                var _this = this;
                this.recepteurList.forEach(function (vv) {
                    var v = _this.deformationFunction(vv);
                    if (v.x < _this.mins.x)
                        _this.mins.x = v.x;
                    if (v.y < _this.mins.y)
                        _this.mins.y = v.y;
                    if (v.z < _this.mins.z)
                        _this.mins.z = v.z;
                    if (v.x > _this.maxs.x)
                        _this.maxs.x = v.x;
                    if (v.y > _this.maxs.y)
                        _this.maxs.y = v.y;
                    if (v.z > _this.maxs.z)
                        _this.maxs.z = v.z;
                });
                if (!this.sourceEqualRecepter) {
                    this.sourceList.forEach(function (vv) {
                        var v = _this.deformationFunction(vv);
                        if (v.x < _this.mins.x)
                            _this.mins.x = v.x;
                        if (v.y < _this.mins.y)
                            _this.mins.y = v.y;
                        if (v.z < _this.mins.z)
                            _this.mins.z = v.z;
                        if (v.x > _this.maxs.x)
                            _this.maxs.x = v.x;
                        if (v.y > _this.maxs.y)
                            _this.maxs.y = v.y;
                        if (v.z > _this.maxs.z)
                            _this.maxs.z = v.z;
                    });
                }
                if (this.maxDistToBeClose != null) {
                    this.nbDistinctPoint = mathis.geo.distance(this.maxs, this.mins) / this.maxDistToBeClose;
                }
            };
            return CloseXYZfinder;
        }());
        geometry.CloseXYZfinder = CloseXYZfinder;
        var LineInterpoler = (function () {
            function LineInterpoler(points) {
                this.options = new InterpolationOption();
                this.hermite = new Array();
                this.points = points;
            }
            LineInterpoler.prototype.checkArgs = function () {
                if (this.points == null || this.points.length < 2)
                    throw 'too few points';
            };
            LineInterpoler.prototype.go = function () {
                var _this = this;
                var smoothLine = new Array();
                if (this.points.length == 2) {
                    smoothLine = [];
                    for (var i = 0; i < this.options.nbSubdivisions + 1; i++) {
                        var intermediatePoint = new mathis.XYZ(0, 0, 0);
                        mathis.geo.between(this.points[0], this.points[1], i / this.options.nbSubdivisions, intermediatePoint);
                        smoothLine.push(intermediatePoint);
                    }
                    if (this.options.loopLine)
                        smoothLine.push(mathis.XYZ.newFrom(this.points[0]));
                }
                else if (this.options.interpolationStyle == InterpolationStyle.none) {
                    smoothLine = [];
                    this.points.forEach(function (p) { return smoothLine.push(mathis.XYZ.newFrom(p)); });
                    if (this.options.loopLine)
                        smoothLine.push(mathis.XYZ.newFrom(this.points[0]));
                }
                else if (this.options.interpolationStyle == InterpolationStyle.hermite) {
                    var tani_1 = mathis.XYZ.newZero();
                    var tanii_1 = mathis.XYZ.newZero();
                    var oneStep = function (point0, point1, point2, point3) {
                        mathis.geo.substract(point1, point0, tani_1);
                        mathis.geo.substract(point3, point2, tanii_1);
                        tani_1.scale(_this.options.ratioTan);
                        tanii_1.scale(_this.options.ratioTan);
                        mathis.geo.hermiteSpline(point1, tani_1, point2, tanii_1, _this.options.nbSubdivisions, _this.hermite);
                        _this.hermite.forEach(function (v) { smoothLine.push(v); });
                    };
                    var last = this.points.length - 1;
                    if (!this.options.loopLine)
                        oneStep(this.points[0], this.points[0], this.points[1], this.points[2]);
                    else {
                        oneStep(this.points[last], this.points[0], this.points[1], this.points[2]);
                    }
                    for (var i = 1; i < this.points.length - 2; i++) {
                        oneStep(this.points[i - 1], this.points[i], this.points[i + 1], this.points[i + 2]);
                    }
                    if (!this.options.loopLine) {
                        oneStep(this.points[last - 2], this.points[last - 1], this.points[last], this.points[last]);
                        smoothLine.push(this.points[last]);
                    }
                    else {
                        oneStep(this.points[last - 2], this.points[last - 1], this.points[last], this.points[0]);
                        oneStep(this.points[last - 1], this.points[last], this.points[0], this.points[1]);
                        smoothLine.push(this.points[0]);
                    }
                }
                else if (this.options.interpolationStyle == InterpolationStyle.octavioStyle) {
                    if (this.points.length == 2)
                        return [mathis.XYZ.newFrom(this.points[0]), mathis.XYZ.newFrom(this.points[1])];
                    var last = this.points.length - 1;
                    var middle0_1 = mathis.XYZ.newZero();
                    var middle1_1 = mathis.XYZ.newZero();
                    var oneStep = function (point0, point1, point2) {
                        mathis.geo.between(point0, point1, 0.5, middle0_1);
                        mathis.geo.between(point1, point2, 0.5, middle1_1);
                        mathis.geo.quadraticBezier(middle0_1, point1, middle1_1, _this.options.nbSubdivisions, _this.hermite);
                        _this.hermite.forEach(function (v) { smoothLine.push(v); });
                    };
                    if (!this.options.loopLine) {
                        var begin = mathis.XYZ.newFrom(this.points[0]);
                        smoothLine.push(begin);
                    }
                    else {
                        oneStep(this.points[last], this.points[0], this.points[1]);
                    }
                    for (var i = 1; i < this.points.length - 1; i++) {
                        oneStep(this.points[i - 1], this.points[i], this.points[i + 1]);
                    }
                    if (!this.options.loopLine) {
                        var end = mathis.XYZ.newFrom(this.points[last]);
                        smoothLine.push(end);
                    }
                    else {
                        oneStep(this.points[last - 1], this.points[last], this.points[0]);
                        var latest = mathis.XYZ.newZero();
                        mathis.geo.between(this.points[last], this.points[0], 0.5, latest);
                        smoothLine.push(latest);
                    }
                }
                else
                    throw 'line interporler style unknown';
                return smoothLine;
            };
            return LineInterpoler;
        }());
        geometry.LineInterpoler = LineInterpoler;
        var InterpolationStyle;
        (function (InterpolationStyle) {
            InterpolationStyle[InterpolationStyle["hermite"] = 0] = "hermite";
            InterpolationStyle[InterpolationStyle["octavioStyle"] = 1] = "octavioStyle";
            InterpolationStyle[InterpolationStyle["none"] = 2] = "none";
        })(InterpolationStyle = geometry.InterpolationStyle || (geometry.InterpolationStyle = {}));
        var InterpolationOption = (function () {
            function InterpolationOption() {
                this.loopLine = false;
                this.interpolationStyle = InterpolationStyle.octavioStyle;
                this.nbSubdivisions = 10;
                this.ratioTan = 0.5;
            }
            return InterpolationOption;
        }());
        geometry.InterpolationOption = InterpolationOption;
    })(geometry = mathis.geometry || (mathis.geometry = {}));
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    var TwoInt = (function () {
        function TwoInt(c, d) {
            this.a = (c < d) ? c : d;
            this.b = (c < d) ? d : c;
        }
        return TwoInt;
    }());
    var graph;
    (function (graph) {
        function getGroup(startingGroup, admissibleForGroup) {
            var group = [];
            var newEdge = [];
            var newEdgeSelected = startingGroup;
            var alreadySeen = new mathis.HashMap();
            for (var _i = 0, startingGroup_1 = startingGroup; _i < startingGroup_1.length; _i++) {
                var vertex = startingGroup_1[_i];
                group.push(vertex);
                alreadySeen.putValue(vertex, true);
            }
            while (newEdgeSelected.length > 0) {
                newEdge = getEdge(newEdgeSelected);
                newEdgeSelected = [];
                for (var _a = 0, newEdge_1 = newEdge; _a < newEdge_1.length; _a++) {
                    var vertex = newEdge_1[_a];
                    if (!alreadySeen.getValue(vertex)) {
                        if (admissibleForGroup == null || admissibleForGroup.getValue(vertex)) {
                            newEdgeSelected.push(vertex);
                            group.push(vertex);
                        }
                        alreadySeen.putValue(vertex, true);
                    }
                }
            }
            return group;
        }
        graph.getGroup = getGroup;
        var DistancesFromAGroup = (function () {
            function DistancesFromAGroup(centralCells) {
                this.OUT_distances_dico = new mathis.HashMap();
                this.centralCells = centralCells;
            }
            DistancesFromAGroup.prototype.OUT_distance = function (vertex) {
                return this.OUT_distances_dico.getValue(vertex);
            };
            DistancesFromAGroup.prototype.OUT_allGeodesics = function (vertex, onlyOne) {
                if (onlyOne === void 0) { onlyOne = false; }
                var res = [];
                var edge = [vertex];
                var nonAdmissible = new mathis.HashMap();
                var d = this.OUT_distances_dico.getValue(vertex);
                while (edge.length > 0) {
                    res.push(edge);
                    d--;
                    edge = getEdge(edge, nonAdmissible);
                    var selectedEdge = [];
                    for (var _i = 0, edge_1 = edge; _i < edge_1.length; _i++) {
                        var v = edge_1[_i];
                        if (this.OUT_distances_dico.getValue(v) == d) {
                            selectedEdge.push(v);
                            if (onlyOne)
                                break;
                        }
                    }
                    edge = selectedEdge;
                }
                return res;
            };
            DistancesFromAGroup.prototype.go = function () {
                var nonAdmissible = new mathis.HashMap();
                if (this.centralCells == null || this.centralCells.length == 0)
                    throw 'problème d argument';
                this.OUT_stratesAround = [];
                this.OUT_stratesAround.push(this.centralCells);
                var edge = getEdge(this.centralCells, nonAdmissible);
                while (edge.length > 0) {
                    this.OUT_stratesAround.push(edge);
                    edge = getEdge(edge, nonAdmissible);
                }
                for (var i = 0; i < this.OUT_stratesAround.length; i++) {
                    for (var _i = 0, _a = this.OUT_stratesAround[i]; _i < _a.length; _i++) {
                        var v = _a[_i];
                        this.OUT_distances_dico.putValue(v, i);
                    }
                }
            };
            return DistancesFromAGroup;
        }());
        graph.DistancesFromAGroup = DistancesFromAGroup;
        var HeuristicDiameter = (function () {
            function HeuristicDiameter(vertices) {
                this.vertices = vertices;
                this.nbTimeOfNonEvolutionToStop = 2;
                this.lookNonEvolutionWithDistanceVersusWithGroups = true;
                this.consecutiveExtremetDistances = [];
                this.OUT_nbIteration = 0;
                this.OUT_twoChosenExtremeVertices = [];
            }
            HeuristicDiameter.prototype.go = function () {
                var extremeGroup = [this.vertices[0]];
                var d = 0;
                var extremeVertices = [];
                var distanceAround;
                while (this.evolution()) {
                    this.OUT_nbIteration++;
                    distanceAround = new DistancesFromAGroup(extremeGroup);
                    distanceAround.go();
                    d = distanceAround.OUT_stratesAround.length;
                    var oneExtreme = distanceAround.OUT_stratesAround[d - 1][0];
                    extremeGroup = [oneExtreme];
                    this.consecutiveExtremetDistances.push(d);
                    extremeVertices.push(oneExtreme);
                }
                this.OUT_twoChosenExtremeVertices = [extremeVertices[this.OUT_nbIteration - 1], extremeVertices[this.OUT_nbIteration - 2]];
                this.OUT_geodesicsBetweenChosenExtremeVertices = distanceAround.OUT_allGeodesics(extremeVertices[this.OUT_nbIteration - 1]);
                this.OUT_oneGeodesicBetweenChosenExtremeVertices = distanceAround.OUT_allGeodesics(extremeVertices[this.OUT_nbIteration - 1], true);
                return d - 1;
            };
            HeuristicDiameter.prototype.evolution = function () {
                if (this.lookNonEvolutionWithDistanceVersusWithGroups) {
                    var len = this.consecutiveExtremetDistances.length;
                    if (len < this.nbTimeOfNonEvolutionToStop)
                        return true;
                    var lastD = this.consecutiveExtremetDistances[len - 1];
                    for (var i = 1; i < this.nbTimeOfNonEvolutionToStop; i++) {
                        if (this.consecutiveExtremetDistances[len - 1 - i] != lastD)
                            return true;
                    }
                    return false;
                }
                else
                    throw "TODO";
            };
            return HeuristicDiameter;
        }());
        graph.HeuristicDiameter = HeuristicDiameter;
        var DistancesBetweenAllVertices = (function () {
            function DistancesBetweenAllVertices(allVertices) {
                this.OUT_allExtremeVertex = [];
                this.allCounters = new mathis.HashMap();
                this.allToTransmit = new mathis.HashMap();
                this.OUT_diameter = null;
                this.allVertices = allVertices;
            }
            DistancesBetweenAllVertices.prototype.OUT_distance = function (vertex0, vertex1) {
                return this.allCounters.getValue(vertex0).getValue(vertex1);
            };
            DistancesBetweenAllVertices.prototype.OUT_allGeodesics = function (vertex0, vertex1, onlyOne) {
                if (onlyOne === void 0) { onlyOne = false; }
                var res = [];
                var edge = [vertex0];
                var nonAdmissible = new mathis.HashMap();
                var d = this.allCounters.getValue(vertex0).getValue(vertex1);
                while (edge.length > 0) {
                    res.push(edge);
                    d--;
                    edge = getEdge(edge, nonAdmissible);
                    var selectedEdge = [];
                    for (var _i = 0, edge_2 = edge; _i < edge_2.length; _i++) {
                        var vertex = edge_2[_i];
                        if (this.allCounters.getValue(vertex).getValue(vertex1) == d) {
                            selectedEdge.push(vertex);
                            if (onlyOne)
                                break;
                        }
                    }
                    edge = selectedEdge;
                }
                return res;
            };
            DistancesBetweenAllVertices.prototype.go = function () {
                for (var _i = 0, _a = this.allVertices; _i < _a.length; _i++) {
                    var vertex = _a[_i];
                    var myCounters = new mathis.HashMap(true);
                    myCounters.putValue(vertex, 0);
                    this.allCounters.putValue(vertex, myCounters);
                    var toTransmit = new mathis.HashMap(true);
                    toTransmit.putValue(vertex, 0);
                    this.allToTransmit.putValue(vertex, toTransmit);
                }
                var stillOneToTransmit = true;
                while (stillOneToTransmit) {
                    stillOneToTransmit = false;
                    this.allFreshlyReceived = new mathis.HashMap();
                    for (var _b = 0, _c = this.allVertices; _b < _c.length; _b++) {
                        var vertex = _c[_b];
                        this.allFreshlyReceived.putValue(vertex, new mathis.HashMap(true));
                    }
                    for (var _d = 0, _e = this.allVertices; _d < _e.length; _d++) {
                        var vertex = _e[_d];
                        var toTransmit = this.allToTransmit.getValue(vertex);
                        for (var _f = 0, _g = vertex.links; _f < _g.length; _f++) {
                            var link = _g[_f];
                            var voiCounter = this.allCounters.getValue(link.to);
                            for (var _h = 0, _j = toTransmit.allKeys(); _h < _j.length; _h++) {
                                var v = _j[_h];
                                if (voiCounter.getValue(v) == null) {
                                    stillOneToTransmit = true;
                                    voiCounter.putValue(v, toTransmit.getValue(v) + 1);
                                    this.allFreshlyReceived.getValue(link.to).putValue(v, toTransmit.getValue(v) + 1);
                                }
                            }
                        }
                    }
                    this.allToTransmit = this.allFreshlyReceived;
                    this.OUT_diameter = 0;
                    for (var _k = 0, _l = this.allVertices; _k < _l.length; _k++) {
                        var vertex = _l[_k];
                        for (var _m = 0, _o = this.allCounters.getValue(vertex).allEntries(); _m < _o.length; _m++) {
                            var entry = _o[_m];
                            if (entry.value > this.OUT_diameter) {
                                this.OUT_diameter = entry.value;
                                this.OUT_aMaxCouple = [vertex, entry.key];
                                this.OUT_allExtremeVertex = [vertex];
                            }
                            if (entry.value == this.OUT_diameter)
                                this.OUT_allExtremeVertex.push(vertex);
                        }
                    }
                }
            };
            return DistancesBetweenAllVertices;
        }());
        graph.DistancesBetweenAllVertices = DistancesBetweenAllVertices;
        function getEdge(aGroup, CHANGING_nonAdmissibleForEdge) {
            if (CHANGING_nonAdmissibleForEdge == null)
                CHANGING_nonAdmissibleForEdge = new mathis.HashMap();
            var edge = [];
            for (var _i = 0, aGroup_1 = aGroup; _i < aGroup_1.length; _i++) {
                var vertex = aGroup_1[_i];
                CHANGING_nonAdmissibleForEdge.putValue(vertex, true);
            }
            for (var _a = 0, aGroup_2 = aGroup; _a < aGroup_2.length; _a++) {
                var vertex = aGroup_2[_a];
                for (var _b = 0, _c = vertex.links; _b < _c.length; _b++) {
                    var link = _c[_b];
                    if (!CHANGING_nonAdmissibleForEdge.getValue(link.to)) {
                        edge.push(link.to);
                    }
                    CHANGING_nonAdmissibleForEdge.putValue(link.to, true);
                }
            }
            return edge;
        }
        graph.getEdge = getEdge;
        function getEdgeConsideringAlsoDiagonalVoisin(aGroup, CHANGING_nonAdmissibleForEdge, exactltyTwo) {
            if (exactltyTwo === void 0) { exactltyTwo = false; }
            if (CHANGING_nonAdmissibleForEdge == null)
                CHANGING_nonAdmissibleForEdge = new mathis.HashMap();
            var edge = getEdge(aGroup, CHANGING_nonAdmissibleForEdge);
            var dicoEdge = new mathis.HashMap();
            for (var _i = 0, edge_3 = edge; _i < edge_3.length; _i++) {
                var c = edge_3[_i];
                dicoEdge.putValue(c, true);
            }
            var edgeAndGroup = edge.concat(aGroup);
            var edge2 = getEdge(edgeAndGroup);
            for (var _a = 0, edge2_1 = edge2; _a < edge2_1.length; _a++) {
                var c = edge2_1[_a];
                if (c.links.length <= 4) {
                    var nbLinkInEdge = 0;
                    for (var _b = 0, _c = c.links; _b < _c.length; _b++) {
                        var v = _c[_b];
                        if (dicoEdge.getValue(v.to) != null)
                            nbLinkInEdge++;
                    }
                    if (exactltyTwo && nbLinkInEdge == 2) {
                        edge.push(c);
                        CHANGING_nonAdmissibleForEdge.putValue(c, true);
                    }
                    else if (nbLinkInEdge >= 2) {
                        edge.push(c);
                        CHANGING_nonAdmissibleForEdge.putValue(c, true);
                    }
                }
            }
            return edge;
        }
        graph.getEdgeConsideringAlsoDiagonalVoisin = getEdgeConsideringAlsoDiagonalVoisin;
        function ringify(centralCells) {
            var nonAdmissible = new mathis.HashMap();
            if (centralCells == null || centralCells.length == 0)
                throw 'problème d argument';
            var res = [];
            res.push(centralCells);
            var edge = getEdge(centralCells, nonAdmissible);
            while (edge.length > 0) {
                res.push(edge);
                edge = getEdge(edge, nonAdmissible);
            }
            return res;
        }
        graph.ringify = ringify;
        function ringifyConsideringAlsoDiagonalVoisin(centralCells) {
            if (centralCells == null || centralCells.length == 0)
                throw 'problème d argument';
            var res = [];
            res.push(centralCells);
            var interior = centralCells;
            var edge = getEdgeConsideringAlsoDiagonalVoisin(interior);
            while (edge.length > 0) {
                res.push(edge);
                interior = interior.concat(edge);
                edge = getEdgeConsideringAlsoDiagonalVoisin(interior);
            }
            return res;
        }
        graph.ringifyConsideringAlsoDiagonalVoisin = ringifyConsideringAlsoDiagonalVoisin;
    })(graph = mathis.graph || (mathis.graph = {}));
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    var grateAndGlue;
    (function (grateAndGlue) {
        var GraphGrater = (function () {
            function GraphGrater() {
                this.IN_graphFamily = [];
                this.seedsList = null;
                this.seedComputedFromBarycentersVersusFromAllPossibleCells = true;
                this.barycenterDecay = new mathis.XYZ(0.0000000234, 0.000000000677, 0.000000000987);
                this.proximityCoefToGrate = [0.7];
                this.proportionOfSeeds = [0.1];
                this.asymmetriesForSeeds = null;
            }
            GraphGrater.prototype.checkArgs = function () {
                if (this.IN_graphFamily == null || this.IN_graphFamily.length < 2)
                    throw 'SUB_grater works from 2 graphs';
            };
            GraphGrater.prototype.suppressTooCloseVertex = function (family) {
                var res = [];
                for (var i = 0; i < family.length; i++) {
                    var neighborhoodCoef = this.proximityCoefToGrate[i % this.proximityCoefToGrate.length];
                    res[i] = [];
                    for (var _i = 0, _a = family[i]; _i < _a.length; _i++) {
                        var verI = _a[_i];
                        var ok = true;
                        for (var j = 0; j < family.length; j++) {
                            if (i != j) {
                                ok = !this.proximityMeasurer.isCloseToMe(verI, family[j], neighborhoodCoef);
                                if (!ok)
                                    break;
                            }
                        }
                        if (ok)
                            res[i].push(verI);
                    }
                }
                return res;
            };
            GraphGrater.prototype.findSeeds = function () {
                var res = [];
                if (!this.seedComputedFromBarycentersVersusFromAllPossibleCells) {
                    res = this.suppressTooCloseVertex(this.IN_graphFamily);
                }
                else {
                    for (var i = 0; i < this.IN_graphFamily.length; i++) {
                        res[i] = [];
                    }
                    var barycenters = [];
                    for (var i = 0; i < this.IN_graphFamily.length; i++) {
                        barycenters[i] = new mathis.XYZ(0, 0, 0);
                        for (var _i = 0, _a = this.IN_graphFamily[i]; _i < _a.length; _i++) {
                            var v = _a[_i];
                            barycenters[i].add(v.position);
                        }
                        barycenters[i].scale(1 / this.IN_graphFamily[i].length);
                        barycenters[i].add(this.barycenterDecay);
                    }
                    var toSort = function (a, b) { return b.distance - a.distance; };
                    for (var emp = 0; emp < this.IN_graphFamily.length; emp++) {
                        var baryOfOther = new mathis.XYZ(0, 0, 0);
                        for (var k = 0; k < this.IN_graphFamily.length; k++)
                            if (k != emp)
                                baryOfOther.add(barycenters[k]);
                        baryOfOther.scale(1 / (this.IN_graphFamily.length - 1));
                        var vertexAndDist = [];
                        var bary2Pos = new mathis.XYZ(0, 0, 0);
                        for (var _b = 0, _c = this.IN_graphFamily[emp]; _b < _c.length; _b++) {
                            var v = _c[_b];
                            bary2Pos.copyFrom(v.position).substract(baryOfOther);
                            var dd = mathis.geo.distance(v.position, baryOfOther);
                            if (this.asymmetriesForSeeds != null && this.asymmetriesForSeeds[emp % this.asymmetriesForSeeds.length] != null) {
                                var asy = this.asymmetriesForSeeds[emp % this.asymmetriesForSeeds.length];
                                var angle = mathis.geo.angleBetweenTwoVectorsBetween0andPi(bary2Pos, asy.direction);
                                var modu = Math.PI;
                                if (asy.modulo != null) {
                                    modu = asy.modulo;
                                    if (isNaN(modu) || modu < 0 || modu > Math.PI)
                                        throw 'modulo must be a number between 0 and PI, but is:' + modu;
                                    angle = mathis.modulo(angle, modu);
                                }
                                var coef = 1 - angle / modu;
                                dd = dd * (1 - asy.influence) + coef * asy.influence;
                            }
                            vertexAndDist.push({ vertex: v, distance: dd });
                        }
                        vertexAndDist.sort(toSort);
                        res[emp] = [];
                        var borne = void 0;
                        if (this.proportionOfSeeds[emp % this.proportionOfSeeds.length] > 0)
                            borne = vertexAndDist[0].distance * (1 - this.proportionOfSeeds[emp % this.proportionOfSeeds.length]);
                        else
                            borne = vertexAndDist[0].distance * 0.99;
                        var dist = Number.MAX_VALUE;
                        var i = 0;
                        while (dist >= borne && i < vertexAndDist.length - 1) {
                            res[emp].push(vertexAndDist[i].vertex);
                            i++;
                            dist = vertexAndDist[i].distance;
                        }
                    }
                }
                res = this.suppressTooCloseVertex(res);
                for (var i = 0; i < this.IN_graphFamily.length; i++)
                    if (res[i].length == 0)
                        throw 'an empty seeds, possible cause: 1/  two graphes are identical 2/ one of your graph is nearly includes into an other and you do not use the barycenter technique';
                return res;
            };
            GraphGrater.prototype.go = function () {
                this.checkArgs();
                if (this.proximityMeasurer == null)
                    this.proximityMeasurer = new ProximityMeasurer();
                if (this.seedsList == null) {
                    this.seedsList = this.findSeeds();
                    this.OUT_allSeeds = this.seedsList;
                }
                var alreadySomeVertex = true;
                var interior = [];
                for (var i = 0; i < this.IN_graphFamily.length; i++) {
                    interior[i] = [].concat(this.seedsList[i]);
                }
                var nonAdmissibleForEdge = new mathis.HashMap();
                while (alreadySomeVertex) {
                    alreadySomeVertex = false;
                    for (var i = 0; i < this.IN_graphFamily.length; i++) {
                        var neighborhoodCoef = this.proximityCoefToGrate[i % this.proximityCoefToGrate.length];
                        var edge = mathis.graph.getEdge(interior[i], nonAdmissibleForEdge);
                        for (var _i = 0, edge_4 = edge; _i < edge_4.length; _i++) {
                            var ve = edge_4[_i];
                            var isClose = false;
                            for (var j = 0; j < this.IN_graphFamily.length; j++) {
                                if (i != j && this.proximityMeasurer.isCloseToMe(ve, interior[j], neighborhoodCoef)) {
                                    isClose = true;
                                    break;
                                }
                            }
                            if (!isClose) {
                                interior[i].push(ve);
                                alreadySomeVertex = true;
                            }
                        }
                    }
                }
                return interior;
            };
            return GraphGrater;
        }());
        grateAndGlue.GraphGrater = GraphGrater;
        var ProximityMeasurer = (function () {
            function ProximityMeasurer() {
                this.vertexToLinkLength = new mathis.HashMap();
            }
            ProximityMeasurer.prototype.meanLinksDist = function (vertex) {
                var res = this.vertexToLinkLength.getValue(vertex);
                if (res != null)
                    return res;
                var dist = 0;
                for (var _i = 0, _a = vertex.links; _i < _a.length; _i++) {
                    var link = _a[_i];
                    dist += mathis.geo.distance(vertex.position, link.to.position);
                }
                dist /= vertex.links.length;
                this.vertexToLinkLength.putValue(vertex, dist);
                return dist;
            };
            ProximityMeasurer.prototype.isCloseToMe = function (vertex, family, coef) {
                for (var _i = 0, family_1 = family; _i < family_1.length; _i++) {
                    var v = family_1[_i];
                    if (this.areClose(vertex, v, coef))
                        return true;
                }
                return false;
            };
            ProximityMeasurer.prototype.areClose = function (vertex0, vertex1, coef) {
                return (mathis.geo.distance(vertex0.position, vertex1.position) < (this.meanLinksDist(vertex0) + this.meanLinksDist(vertex1)) / 2 * coef);
            };
            ProximityMeasurer.prototype.areFar = function (vertex0, vertex1, coef) {
                return (mathis.geo.distance(vertex0.position, vertex1.position) > (this.meanLinksDist(vertex0) + this.meanLinksDist(vertex1)) / 2 * coef);
            };
            return ProximityMeasurer;
        }());
        grateAndGlue.ProximityMeasurer = ProximityMeasurer;
        var SubMameshExtractor = (function () {
            function SubMameshExtractor(mamesh, verticesToKeep) {
                this.verticesToKeepMustBeInMamesh = true;
                this.constructCutSegment = true;
                this.takeCareOfPolygons = true;
                this.addBorderPolygonInsteadOfSuppress = false;
                this.OUT_BorderPolygon = [];
                this.OUT_BorderVerticesInside = [];
                this.OUTBorderVerticesOutside = [];
                this.mamesh = mamesh;
                this.verticesToKeep = verticesToKeep;
            }
            SubMameshExtractor.prototype.go = function () {
                var _this = this;
                var res = new mathis.Mamesh();
                this.verticesToKeep.forEach(function (vertex) {
                    if (_this.mamesh.hasVertex(vertex)) {
                        res.addVertex(vertex);
                    }
                    else if (_this.verticesToKeepMustBeInMamesh)
                        throw 'a vertex in the list to keep is not in the original mesh. If you want to allow this, please turn the boolean "verticesToKeepMustBeInMamesh" to false';
                });
                for (var i = 0; i < this.mamesh.smallestSquares.length; i += 4) {
                    var sumOfPresentVertex = 0;
                    if (res.hasVertex(this.mamesh.smallestSquares[i]))
                        sumOfPresentVertex++;
                    if (res.hasVertex(this.mamesh.smallestSquares[i + 1]))
                        sumOfPresentVertex++;
                    if (res.hasVertex(this.mamesh.smallestSquares[i + 2]))
                        sumOfPresentVertex++;
                    if (res.hasVertex(this.mamesh.smallestSquares[i + 3]))
                        sumOfPresentVertex++;
                    if (sumOfPresentVertex > 0 && sumOfPresentVertex < 4)
                        this.OUT_BorderPolygon.push([this.mamesh.smallestSquares[i], this.mamesh.smallestSquares[i + 1], this.mamesh.smallestSquares[i + 2], this.mamesh.smallestSquares[i + 3]]);
                    else if (sumOfPresentVertex == 4)
                        res.smallestSquares.push(this.mamesh.smallestSquares[i], this.mamesh.smallestSquares[i + 1], this.mamesh.smallestSquares[i + 2], this.mamesh.smallestSquares[i + 3]);
                }
                for (var i = 0; i < this.mamesh.smallestTriangles.length; i += 3) {
                    var sumOfPresentVertex = 0;
                    if (res.hasVertex(this.mamesh.smallestTriangles[i]))
                        sumOfPresentVertex++;
                    if (res.hasVertex(this.mamesh.smallestTriangles[i + 1]))
                        sumOfPresentVertex++;
                    if (res.hasVertex(this.mamesh.smallestTriangles[i + 2]))
                        sumOfPresentVertex++;
                    if (sumOfPresentVertex > 0 && sumOfPresentVertex < 3)
                        this.OUT_BorderPolygon.push([this.mamesh.smallestTriangles[i], this.mamesh.smallestTriangles[i + 1], this.mamesh.smallestTriangles[i + 2]]);
                    else if (sumOfPresentVertex == 3)
                        res.smallestTriangles.push(this.mamesh.smallestTriangles[i], this.mamesh.smallestTriangles[i + 1], this.mamesh.smallestTriangles[i + 2]);
                }
                for (var _i = 0, _a = this.OUT_BorderPolygon; _i < _a.length; _i++) {
                    var poly = _a[_i];
                    for (var _b = 0, poly_1 = poly; _b < poly_1.length; _b++) {
                        var v = poly_1[_b];
                        if (res.hasVertex(v)) {
                            if (this.OUT_BorderVerticesInside.indexOf(v) == -1)
                                this.OUT_BorderVerticesInside.push(v);
                        }
                        else {
                            if (this.OUTBorderVerticesOutside.indexOf(v) == -1)
                                this.OUTBorderVerticesOutside.push(v);
                        }
                    }
                }
                if (this.takeCareOfPolygons) {
                    if (this.addBorderPolygonInsteadOfSuppress) {
                        for (var _c = 0, _d = this.OUT_BorderPolygon; _c < _d.length; _c++) {
                            var poly = _d[_c];
                            if (poly.length == 3)
                                res.smallestTriangles.push(poly[0], poly[1], poly[2]);
                            else if (poly.length == 4)
                                res.smallestSquares.push(poly[0], poly[1], poly[2], poly[3]);
                        }
                        for (var _e = 0, _f = this.OUTBorderVerticesOutside; _e < _f.length; _e++) {
                            var vert = _f[_e];
                            res.addVertex(vert);
                        }
                    }
                    else {
                        var suppressedIndexOfBorderInside = [];
                        var suppressedIndexOfRes = [];
                        for (var i = 0; i < this.OUT_BorderVerticesInside.length; i++) {
                            var vert = this.OUT_BorderVerticesInside[i];
                            var isInAPoly = false;
                            for (var _g = 0, _h = res.smallestSquares; _g < _h.length; _g++) {
                                var v = _h[_g];
                                if (v.hashNumber == vert.hashNumber) {
                                    isInAPoly = true;
                                    break;
                                }
                            }
                            if (!isInAPoly) {
                                for (var _j = 0, _k = res.smallestTriangles; _j < _k.length; _j++) {
                                    var v = _k[_j];
                                    if (v.hashNumber == vert.hashNumber) {
                                        isInAPoly = true;
                                        break;
                                    }
                                }
                            }
                            if (!isInAPoly) {
                                suppressedIndexOfRes.push(res.vertices.indexOf(vert));
                                suppressedIndexOfBorderInside.push(i);
                            }
                        }
                        this.OUT_BorderVerticesInside = mathis.tab.arrayMinusSomeIndices(this.OUT_BorderVerticesInside, suppressedIndexOfBorderInside);
                        res.vertices = mathis.tab.arrayMinusSomeIndices(res.vertices, suppressedIndexOfRes);
                    }
                }
                if (this.constructCutSegment) {
                    for (var key in this.mamesh.cutSegmentsDico) {
                        var segment = this.mamesh.cutSegmentsDico[key];
                        if (!res.hasVertex(segment.a))
                            continue;
                        if (!res.hasVertex(segment.b))
                            continue;
                        if (!res.hasVertex(segment.middle))
                            continue;
                        res.cutSegmentsDico[key] = segment;
                    }
                }
                return res;
            };
            return SubMameshExtractor;
        }());
        grateAndGlue.SubMameshExtractor = SubMameshExtractor;
        var ExtractCentralPart = (function () {
            function ExtractCentralPart(mamesh, nb) {
                this.markBorder = true;
                this.suppressFromBorderVersusCorner = true;
                this.mamesh = mamesh;
                this.nb = nb;
            }
            ExtractCentralPart.prototype.go = function () {
                var border = [];
                if (this.suppressFromBorderVersusCorner) {
                    for (var _i = 0, _a = this.mamesh.vertices; _i < _a.length; _i++) {
                        var ver = _a[_i];
                        if (ver.hasMark(mathis.Vertex.Markers.border))
                            border.push(ver);
                    }
                }
                else {
                    for (var _b = 0, _c = this.mamesh.vertices; _b < _c.length; _b++) {
                        var ver = _c[_b];
                        if (ver.hasMark(mathis.Vertex.Markers.corner))
                            border.push(ver);
                    }
                }
                var rings = mathis.graph.ringify(border);
                var toSuppress = new mathis.HashMap();
                if (this.nb < 0)
                    this.nb = rings.length + this.nb - 1;
                if (this.nb >= rings.length - 1)
                    throw 'you want to suppress too much strates';
                for (var i = 0; i < this.nb; i++) {
                    for (var _d = 0, _e = rings[i]; _d < _e.length; _d++) {
                        var v = _e[_d];
                        toSuppress.putValue(v, true);
                    }
                }
                var toKeep = [];
                for (var _f = 0, _g = this.mamesh.vertices; _f < _g.length; _f++) {
                    var v = _g[_f];
                    if (toSuppress.getValue(v) == null) {
                        toKeep.push(v);
                    }
                }
                if (this.markBorder)
                    for (var _h = 0, _j = rings[this.nb]; _h < _j.length; _h++) {
                        var v = _j[_h];
                        v.markers.push(mathis.Vertex.Markers.border);
                    }
                var suber = new grateAndGlue.SubMameshExtractor(this.mamesh, toKeep);
                var res = suber.go();
                return res;
            };
            return ExtractCentralPart;
        }());
        grateAndGlue.ExtractCentralPart = ExtractCentralPart;
        var FindStickingMapFromSquare = (function () {
            function FindStickingMapFromSquare(receiver, source) {
                this.receiver = receiver;
                this.source = source;
            }
            FindStickingMapFromSquare.prototype.checkArgs = function () {
                if (this.receiver.length % 4 != 0)
                    throw 'receiver is not a list representing squares';
                if (this.source.length % 4 != 0)
                    throw 'source is not a list representing squares';
            };
            FindStickingMapFromSquare.prototype.go = function () {
                this.checkArgs();
                var res = new mathis.HashMap(true);
                var sourceBaryCenter = this.squareToBaryCenter(this.source);
                var receiverBaryCenter = this.squareToBaryCenter(this.receiver);
                for (var i = 0; i < sourceBaryCenter.length; i++) {
                    var minDist = Number.MAX_VALUE;
                    var bestReceiverIndex = -1;
                    for (var j = 0; j < receiverBaryCenter.length; j++) {
                        var dist = mathis.geo.distance(sourceBaryCenter[i], receiverBaryCenter[j]);
                        if (dist < minDist) {
                            minDist = dist;
                            bestReceiverIndex = j;
                        }
                    }
                    var receiverPaquet = [this.receiver[4 * bestReceiverIndex], this.receiver[4 * bestReceiverIndex + 1], this.receiver[4 * bestReceiverIndex + 2], this.receiver[4 * bestReceiverIndex + 3]];
                    var sourcePaquet = [this.source[4 * i], this.source[4 * i + 1], this.source[4 * i + 2], this.source[4 * i + 3]];
                    var permutedReceiverPaquet = this.getBestPermutationOfReceiver(receiverPaquet, sourcePaquet);
                    for (var k = 0; k < 4; k++) {
                        res.putValue(sourcePaquet[k], permutedReceiverPaquet[k]);
                    }
                }
                return res;
            };
            FindStickingMapFromSquare.prototype.getBestPermutationOfReceiver = function (receiverPaquet, sourcePaquet) {
                var minDist = Number.MAX_VALUE;
                var bestDecal = -1;
                for (var k_1 = 0; k_1 < 4; k_1++) {
                    var decalReceiver = [receiverPaquet[k_1], receiverPaquet[(k_1 + 1) % 4], receiverPaquet[(k_1 + 2) % 4], receiverPaquet[(k_1 + 3) % 4]];
                    var dist = 0;
                    for (var l = 0; l < 4; l++)
                        dist += mathis.geo.distance(sourcePaquet[l].position, decalReceiver[l].position);
                    if (dist < minDist) {
                        minDist = dist;
                        bestDecal = k_1;
                    }
                }
                var k = bestDecal;
                return [receiverPaquet[k], receiverPaquet[(k + 1) % 4], receiverPaquet[(k + 2) % 4], receiverPaquet[(k + 3) % 4]];
            };
            FindStickingMapFromSquare.prototype.squareToBaryCenter = function (vertices) {
                var res = [];
                for (var i = 0; i < vertices.length; i += 4) {
                    var paquet = [vertices[i].position, vertices[i + 1].position, vertices[i + 2].position, vertices[i + 3].position];
                    var bary = new mathis.XYZ(0, 0, 0);
                    mathis.geo.baryCenter(paquet, [1 / 4, 1 / 4, 1 / 4, 1 / 4], bary);
                    res.push(bary);
                }
                return res;
            };
            return FindStickingMapFromSquare;
        }());
        var FindSickingMapFromVertices = (function () {
            function FindSickingMapFromVertices(receiver, source) {
                this.toleranceToBeOneOfTheClosest = 0.5;
                this.proximityCoef = 0.7;
                this.acceptOnlyDisjointReceiverAndSource = true;
                this.receiver = receiver;
                this.source = source;
            }
            FindSickingMapFromVertices.prototype.checkArgs = function () {
                if (this.acceptOnlyDisjointReceiverAndSource) {
                    var dico = new mathis.HashMap();
                    for (var _i = 0, _a = this.source; _i < _a.length; _i++) {
                        var v = _a[_i];
                        dico.putValue(v, true);
                    }
                    for (var _b = 0, _c = this.receiver; _b < _c.length; _b++) {
                        var v = _c[_b];
                        if (dico.getValue(v) != null)
                            throw 'source and receiver must be disjoint';
                    }
                }
            };
            FindSickingMapFromVertices.prototype.go = function () {
                this.checkArgs();
                if (this.proximityMeasurer == null)
                    this.proximityMeasurer = new ProximityMeasurer();
                this.checkArgs();
                var res = new mathis.HashMap(true);
                for (var _i = 0, _a = this.source; _i < _a.length; _i++) {
                    var vSource = _a[_i];
                    var minDist = Number.POSITIVE_INFINITY;
                    var receiverToDist = new mathis.HashMap(true);
                    var veryBestReceiver = null;
                    for (var _b = 0, _c = this.receiver; _b < _c.length; _b++) {
                        var vReceiver = _c[_b];
                        var dist = mathis.geo.distance(vSource.position, vReceiver.position);
                        if (this.proximityMeasurer.areClose(vSource, vReceiver, this.proximityCoef)) {
                            receiverToDist.putValue(vReceiver, dist);
                            if (dist < minDist) {
                                minDist = dist;
                                veryBestReceiver = vReceiver;
                            }
                        }
                    }
                    if (veryBestReceiver != null) {
                        var bestReceivers = [];
                        bestReceivers.push(veryBestReceiver);
                        for (var _d = 0, _e = receiverToDist.allKeys(); _d < _e.length; _d++) {
                            var vReceiver = _e[_d];
                            if (vReceiver != veryBestReceiver && receiverToDist.getValue(vReceiver) <= minDist * (1 + this.toleranceToBeOneOfTheClosest)) {
                                bestReceivers.push(vReceiver);
                            }
                        }
                        res.putValue(vSource, bestReceivers);
                    }
                }
                return res;
            };
            return FindSickingMapFromVertices;
        }());
        grateAndGlue.FindSickingMapFromVertices = FindSickingMapFromVertices;
        var ConcurrentMameshesGraterAndSticker = (function () {
            function ConcurrentMameshesGraterAndSticker() {
                this.IN_mameshes = [];
                this.SUB_grater = new GraphGrater();
                this.justGrateDoNotStick = false;
                this.addMissingPolygons = true;
                this.proximityCoefToStick = [2];
                this.toleranceToBeOneOfTheClosest = 0.5;
                this.OUTBorderVerticesToStick = [];
                this.OUTGratedMameshes = [];
                this.takeCareOfPolygons = true;
                this.suppressLinksAngularlyTooClose = true;
                this.SUB_linkCleanerByAngle = new mathis.linkModule.LinksSorterAndCleanerByAngles(null, null);
                this.SUB_PolygonCreatorFromLinks = new mathis.polygonFinder.PolygonFinderFromLinks(null);
                this.OUT_stickingMap = new mathis.HashMap(true);
                this.SUB_linkCleanerByAngle.suppressLinksAngularParam = 2 * Math.PI * 0.1;
            }
            ConcurrentMameshesGraterAndSticker.prototype.checkArgs = function () {
            };
            ConcurrentMameshesGraterAndSticker.prototype.goChanging = function () {
                this.checkArgs();
                for (var _i = 0, _a = this.IN_mameshes; _i < _a.length; _i++) {
                    var mam = _a[_i];
                    for (var _b = 0, _c = mam.vertices; _b < _c.length; _b++) {
                        var ve = _c[_b];
                        for (var _d = 0, _e = ve.links; _d < _e.length; _d++) {
                            var li = _e[_d];
                            li.opposites = null;
                        }
                    }
                }
                var graphs = [];
                this.IN_mameshes.forEach(function (m) { return graphs.push(m.vertices); });
                this.SUB_grater.IN_graphFamily = graphs;
                var gratedGraph = this.SUB_grater.go();
                for (var i = 0; i < this.IN_mameshes.length; i++) {
                    var extractor = new grateAndGlue.SubMameshExtractor(this.IN_mameshes[i], gratedGraph[i]);
                    extractor.takeCareOfPolygons = this.takeCareOfPolygons;
                    extractor.addBorderPolygonInsteadOfSuppress = false;
                    this.OUTGratedMameshes[i] = extractor.go();
                    this.OUTBorderVerticesToStick[i] = [];
                    for (var _f = 0, _g = extractor.OUT_BorderVerticesInside; _f < _g.length; _f++) {
                        var vertex = _g[_f];
                        for (var _h = 0, _j = vertex.links; _h < _j.length; _h++) {
                            var link = _j[_h];
                            if (this.IN_mameshes[i].hasVertex(link.to) && !this.OUTGratedMameshes[i].hasVertex(link.to)) {
                                this.OUTBorderVerticesToStick[i].push(vertex);
                                break;
                            }
                        }
                    }
                    this.OUTGratedMameshes[i].isolateMameshVerticesFromExteriorVertices();
                    for (var _k = 0, _l = this.OUTGratedMameshes[i].vertices; _k < _l.length; _k++) {
                        var v = _l[_k];
                        if (v.hasMark(mathis.Vertex.Markers.border) && this.OUTBorderVerticesToStick[i].indexOf(v) == -1)
                            this.OUTBorderVerticesToStick[i].push(v);
                    }
                }
                var res = this.OUTGratedMameshes[0];
                for (var indexMamesh = 1; indexMamesh < this.IN_mameshes.length; indexMamesh++) {
                    var mapFinder = new FindSickingMapFromVertices(res.vertices, this.OUTBorderVerticesToStick[indexMamesh]);
                    mapFinder.toleranceToBeOneOfTheClosest = this.toleranceToBeOneOfTheClosest;
                    mapFinder.proximityCoef = this.proximityCoefToStick[indexMamesh % this.proximityCoefToStick.length];
                    var map = mapFinder.go();
                    this.OUT_stickingMap.extend(map);
                    var sticker = new Sticker(res, this.OUTGratedMameshes[indexMamesh], map);
                    sticker.zIndex1 = indexMamesh;
                    sticker.cleanOppositeLinksAtBegin = false;
                    sticker.createNewLinks = !this.justGrateDoNotStick;
                    sticker.goChanging();
                }
                res.isolateMameshVerticesFromExteriorVertices();
                for (var _m = 0, _o = res.vertices; _m < _o.length; _m++) {
                    var ve = _o[_m];
                    if (ve.links.length == 0)
                        throw ' grating process produce a vertex with no links';
                }
                if (this.suppressLinksAngularlyTooClose) {
                    this.SUB_linkCleanerByAngle.mamesh = res;
                    this.SUB_linkCleanerByAngle.goChanging();
                }
                if (this.addMissingPolygons && !this.justGrateDoNotStick) {
                    this.SUB_PolygonCreatorFromLinks.mamesh = res;
                    this.SUB_PolygonCreatorFromLinks.go();
                }
                return res;
            };
            return ConcurrentMameshesGraterAndSticker;
        }());
        grateAndGlue.ConcurrentMameshesGraterAndSticker = ConcurrentMameshesGraterAndSticker;
        var VeryCloseVerticesFinder = (function () {
            function VeryCloseVerticesFinder(vertices) {
                this.vertices = vertices;
                this.nbBoxes = new mathis.XYZ(20, 20, 20);
                this.doubleCheck = true;
                this.addRepresentativeInRes = true;
            }
            VeryCloseVerticesFinder.prototype.go = function () {
                var boxMaker = new DisjointPackMaker(this.vertices);
                boxMaker.nbBoxes = this.nbBoxes;
                var boxes0 = boxMaker.go(new mathis.XYZ(-0.1, -0.1, -0.1));
                this.OUT_boxSize = boxMaker.OUT_boxSize;
                var unionFind = new mathis.general_algo.UnionFind();
                for (var _i = 0, boxes0_1 = boxes0; _i < boxes0_1.length; _i++) {
                    var box = boxes0_1[_i];
                    for (var i = 1; i < box.length; i++)
                        unionFind.union(box[0], box[i]);
                }
                if (this.doubleCheck) {
                    var boxes1 = boxMaker.go(new mathis.XYZ(0.5, 0.5, 0.5));
                    for (var _a = 0, boxes1_1 = boxes1; _a < boxes1_1.length; _a++) {
                        var box = boxes1_1[_a];
                        for (var i = 1; i < box.length; i++)
                            unionFind.union(box[0], box[i]);
                    }
                }
                return unionFind.get_components(this.addRepresentativeInRes);
            };
            return VeryCloseVerticesFinder;
        }());
        grateAndGlue.VeryCloseVerticesFinder = VeryCloseVerticesFinder;
        var DisjointPackMaker = (function () {
            function DisjointPackMaker(vertices) {
                this.vertices = vertices;
                this.nbBoxes = new mathis.XYZ(20, 20, 20);
                this.preGoDone = false;
                this.mins = new mathis.XYZ(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
                this.maxs = new mathis.XYZ(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
            }
            DisjointPackMaker.prototype.preGo = function () {
                this.preGoDone = true;
                this.buildScaler();
                var amplitude = new mathis.XYZ(Math.max(1, this.maxs.x - this.mins.x), Math.max(1, this.maxs.y - this.mins.y), Math.max(1, this.maxs.z - this.mins.z));
                this.OUT_boxSize = mathis.XYZ.newFrom(amplitude);
                this.OUT_boxSize.x /= this.nbBoxes.x;
                this.OUT_boxSize.y /= this.nbBoxes.y;
                this.OUT_boxSize.z /= this.nbBoxes.z;
            };
            DisjointPackMaker.prototype.go = function (relativeDecay) {
                if (relativeDecay === void 0) { relativeDecay = new mathis.XYZ(0, 0, 0); }
                if (!this.preGoDone)
                    this.preGo();
                var decay = mathis.XYZ.newFrom(relativeDecay).multiply(this.OUT_boxSize);
                var dico = new mathis.HashMap(true);
                for (var _i = 0, _a = this.vertices; _i < _a.length; _i++) {
                    var vertex = _a[_i];
                    var val = vertex.position;
                    var key = new mathis.XYZ(0, 0, 0);
                    key.x = this.floatToIndex(val.x + decay.x, this.mins.x, this.maxs.x, this.nbBoxes.x);
                    key.y = this.floatToIndex(val.y + decay.y, this.mins.y, this.maxs.y, this.nbBoxes.y);
                    key.z = this.floatToIndex(val.z + decay.z, this.mins.z, this.maxs.x, this.nbBoxes.z);
                    if (dico.getValue(key) == null)
                        dico.putValue(key, [vertex]);
                    else
                        dico.getValue(key).push(vertex);
                }
                return dico.allValues();
            };
            DisjointPackMaker.prototype.floatToIndex = function (d, gauche, droite, nbBaton) {
                if (d >= droite)
                    return nbBaton - 1;
                if (d <= gauche)
                    return 0;
                if ((droite - gauche) == 0)
                    return 0;
                return Math.floor((d - gauche) / (droite - gauche) * nbBaton);
            };
            DisjointPackMaker.prototype.buildScaler = function () {
                for (var _i = 0, _a = this.vertices; _i < _a.length; _i++) {
                    var vert = _a[_i];
                    var v = vert.position;
                    if (v.x < this.mins.x)
                        this.mins.x = v.x;
                    if (v.y < this.mins.y)
                        this.mins.y = v.y;
                    if (v.z < this.mins.z)
                        this.mins.z = v.z;
                    if (v.x > this.maxs.x)
                        this.maxs.x = v.x;
                    if (v.y > this.maxs.y)
                        this.maxs.y = v.y;
                    if (v.z > this.maxs.z)
                        this.maxs.z = v.z;
                }
            };
            return DisjointPackMaker;
        }());
        grateAndGlue.DisjointPackMaker = DisjointPackMaker;
        var BoxesMaker = (function () {
            function BoxesMaker(vertices) {
                this.vertices = vertices;
                this.nbBoxes = new mathis.XYZ(20, 20, 20);
                this.maxDistToBeClose = null;
                this.mins = new mathis.XYZ(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
                this.maxs = new mathis.XYZ(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
            }
            BoxesMaker.prototype.floatToIndex = function (d, gauche, droite, nbBaton) {
                if (d >= droite)
                    return nbBaton - 1;
                if ((droite - gauche) == 0)
                    return 0;
                return Math.floor((d - gauche) / (droite - gauche) * nbBaton);
            };
            BoxesMaker.prototype.go = function () {
                this.buildScaler();
                var amplitude = new mathis.XYZ(Math.max(1, this.maxs.x - this.mins.x), Math.max(1, this.maxs.y - this.mins.y), Math.max(1, this.maxs.z - this.mins.z));
                var dico = new mathis.HashMap(true);
                this.OUT_boxSize = mathis.XYZ.newFrom(amplitude);
                this.OUT_boxSize.x /= this.nbBoxes.x;
                this.OUT_boxSize.y /= this.nbBoxes.y;
                this.OUT_boxSize.z /= this.nbBoxes.z;
                for (var _i = 0, _a = this.vertices; _i < _a.length; _i++) {
                    var vertex = _a[_i];
                    var val = vertex.position;
                    var key = new mathis.XYZ(0, 0, 0);
                    key.x = this.floatToIndex(val.x, this.mins.x, this.maxs.x, this.nbBoxes.x);
                    key.y = this.floatToIndex(val.y, this.mins.y, this.maxs.y, this.nbBoxes.y);
                    key.z = this.floatToIndex(val.z, this.mins.z, this.maxs.x, this.nbBoxes.z);
                    if (dico.getValue(key) == null)
                        dico.putValue(key, [vertex]);
                    else
                        dico.getValue(key).push(vertex);
                }
                var res = [];
                for (var _b = 0, _c = dico.allEntries(); _b < _c.length; _b++) {
                    var entry = _c[_b];
                    if (entry.value.length > 1) {
                        var pack = [];
                        var key = entry.key;
                        for (var _d = 0, _e = [-1, 0, 1]; _d < _e.length; _d++) {
                            var i = _e[_d];
                            for (var _f = 0, _g = [-1, 0, 1]; _f < _g.length; _f++) {
                                var j = _g[_f];
                                for (var _h = 0, _j = [-1, 0, 1]; _h < _j.length; _h++) {
                                    var k = _j[_h];
                                    var keyDec = mathis.XYZ.newFrom(key).add(new mathis.XYZ(i, j, k));
                                    if (dico.getValue(keyDec) != null) {
                                        pack = pack.concat(dico.getValue(keyDec));
                                    }
                                }
                            }
                        }
                        res.push(pack);
                    }
                }
                return res;
            };
            BoxesMaker.prototype.buildScaler = function () {
                for (var _i = 0, _a = this.vertices; _i < _a.length; _i++) {
                    var vert = _a[_i];
                    var v = vert.position;
                    if (v.x < this.mins.x)
                        this.mins.x = v.x;
                    if (v.y < this.mins.y)
                        this.mins.y = v.y;
                    if (v.z < this.mins.z)
                        this.mins.z = v.z;
                    if (v.x > this.maxs.x)
                        this.maxs.x = v.x;
                    if (v.y > this.maxs.y)
                        this.maxs.y = v.y;
                    if (v.z > this.maxs.z)
                        this.maxs.z = v.z;
                }
            };
            return BoxesMaker;
        }());
        grateAndGlue.BoxesMaker = BoxesMaker;
        var FindCloseVerticesFast = (function () {
            function FindCloseVerticesFast(receivers, sources) {
                this.nbDistinctPoint = 1000;
                this.maxDistToBeClose = null;
                this.throwExceptionIfReceiverHaveCloseVertices = false;
                this.receiverAndSourceMustBeDisjoint = false;
                this.deformationFunction = function (point) { return point; };
                this.mins = new mathis.XYZ(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
                this.maxs = new mathis.XYZ(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
                this.receivers = receivers;
                this.sources = sources;
            }
            FindCloseVerticesFast.prototype.go = function () {
                this.buildScaler();
                var amplitude = new mathis.XYZ(Math.max(1, this.maxs.x - this.mins.x), Math.max(1, this.maxs.y - this.mins.y), Math.max(1, this.maxs.z - this.mins.z));
                var roundPositionToReceiver = new mathis.StringMap();
                for (var _i = 0, _a = this.receivers; _i < _a.length; _i++) {
                    var receiver = _a[_i];
                    var val = this.deformationFunction(receiver.position);
                    var resx = Math.round((val.x - this.mins.x) / amplitude.x * this.nbDistinctPoint);
                    var resy = Math.round((val.y - this.mins.y) / amplitude.y * this.nbDistinctPoint);
                    var resz = Math.round((val.z - this.mins.z) / amplitude.z * this.nbDistinctPoint);
                    var key = resx + ',' + resy + ',' + resz;
                    if (roundPositionToReceiver.getValue(key) == null)
                        roundPositionToReceiver.putValue(key, receiver);
                    else if (this.throwExceptionIfReceiverHaveCloseVertices)
                        throw 'the receiver list has several XYZ very close, and you have forbidden that';
                }
                var res = new mathis.HashMap(true);
                for (var _b = 0, _c = this.sources; _b < _c.length; _b++) {
                    var source = _c[_b];
                    var val = this.deformationFunction(source.position);
                    var resx = Math.round((val.x - this.mins.x) / amplitude.x * this.nbDistinctPoint);
                    var resy = Math.round((val.y - this.mins.y) / amplitude.y * this.nbDistinctPoint);
                    var resz = Math.round((val.z - this.mins.z) / amplitude.z * this.nbDistinctPoint);
                    var receiverFounded = roundPositionToReceiver.getValue(resx + ',' + resy + ',' + resz);
                    if (receiverFounded != null) {
                        if (receiverFounded != source) {
                            var perhapsAList = res.getValue(receiverFounded);
                            if (perhapsAList == null)
                                res.putValue(source, [receiverFounded]);
                            else {
                                if (mathis.geo.distance(receiverFounded.position, source.position) < mathis.geo.distance(receiverFounded.position, perhapsAList[0].position)) {
                                    res.putValue(source, [receiverFounded].concat(perhapsAList));
                                }
                                else
                                    perhapsAList.push(receiverFounded);
                            }
                        }
                        else if (this.receiverAndSourceMustBeDisjoint)
                            throw "receiver-list and source-list are not disjoint, and you have forbidden that";
                    }
                }
                return res;
            };
            FindCloseVerticesFast.prototype.buildScaler = function () {
                var _this = this;
                this.receivers.forEach(function (vv) {
                    var v = _this.deformationFunction(vv.position);
                    if (v.x < _this.mins.x)
                        _this.mins.x = v.x;
                    if (v.y < _this.mins.y)
                        _this.mins.y = v.y;
                    if (v.z < _this.mins.z)
                        _this.mins.z = v.z;
                    if (v.x > _this.maxs.x)
                        _this.maxs.x = v.x;
                    if (v.y > _this.maxs.y)
                        _this.maxs.y = v.y;
                    if (v.z > _this.maxs.z)
                        _this.maxs.z = v.z;
                });
                this.sources.forEach(function (vv) {
                    var v = _this.deformationFunction(vv.position);
                    if (v.x < _this.mins.x)
                        _this.mins.x = v.x;
                    if (v.y < _this.mins.y)
                        _this.mins.y = v.y;
                    if (v.z < _this.mins.z)
                        _this.mins.z = v.z;
                    if (v.x > _this.maxs.x)
                        _this.maxs.x = v.x;
                    if (v.y > _this.maxs.y)
                        _this.maxs.y = v.y;
                    if (v.z > _this.maxs.z)
                        _this.maxs.z = v.z;
                });
                if (this.maxDistToBeClose != null) {
                    this.nbDistinctPoint = mathis.geo.distance(this.maxs, this.mins) / this.maxDistToBeClose;
                }
            };
            return FindCloseVerticesFast;
        }());
        grateAndGlue.FindCloseVerticesFast = FindCloseVerticesFast;
        var MergerNew = (function () {
            function MergerNew(mameshes) {
                this.mameshes = mameshes;
                this.cleanDoubleSquareAndTriangles = true;
                this.cleanLinksCrossingSegmentMiddle = true;
                this.suppressSomeTriangleAndSquareSuperposition = false;
                this.mergeLink = true;
                this.mergeTrianglesAndSquares = true;
                this.mergeSegmentsMiddle = true;
                this.OUT_mergedVertices = [];
            }
            MergerNew.prototype.goChanging = function () {
                var allVertices = [];
                for (var _i = 0, _a = this.mameshes; _i < _a.length; _i++) {
                    var mamesh = _a[_i];
                    allVertices = allVertices.concat(mamesh.vertices);
                }
                this.mapFromReceiver = new VeryCloseVerticesFinder(allVertices).go();
                this.mapFromSource = new mathis.HashMap();
                for (var _b = 0, _c = this.mapFromReceiver.allEntries(); _b < _c.length; _b++) {
                    var entry = _c[_b];
                    for (var _d = 0, _e = entry.value; _d < _e.length; _d++) {
                        var v = _e[_d];
                        this.mapFromSource.putValue(v, entry.key);
                    }
                }
                var res = new mathis.Mamesh();
                for (var _f = 0, allVertices_1 = allVertices; _f < allVertices_1.length; _f++) {
                    var v = allVertices_1[_f];
                    if (this.mapFromSource.getValue(v) == null)
                        res.vertices.push(v);
                }
                if (this.mergeLink)
                    this.letsMergeLinks(res, allVertices);
                return res;
            };
            MergerNew.prototype.letsMergeLinks = function (mamesh, allVertices) {
                var verticesConcerning = new mathis.HashMap(true);
                for (var _i = 0, _a = this.mapFromReceiver.allKeys(); _i < _a.length; _i++) {
                    var receiver = _a[_i];
                    verticesConcerning.putValue(receiver, true);
                }
                for (var _b = 0, allVertices_2 = allVertices; _b < allVertices_2.length; _b++) {
                    var vertex = allVertices_2[_b];
                    for (var _c = 0, _d = vertex.links; _c < _d.length; _c++) {
                        var link = _d[_c];
                        var perhapsAReceiver = this.mapFromSource.getValue(link.to);
                        if (perhapsAReceiver != null) {
                            link.to = perhapsAReceiver;
                            verticesConcerning.putValue(vertex, true);
                        }
                    }
                }
                for (var _e = 0, _f = this.mapFromSource.allKeys(); _e < _f.length; _e++) {
                    var source = _f[_e];
                    for (var _g = 0, _h = source.links; _g < _h.length; _g++) {
                        var link = _h[_g];
                        this.mapFromSource.getValue(source).links.push(link);
                    }
                }
                for (var _j = 0, _k = verticesConcerning.allKeys(); _j < _k.length; _j++) {
                    var vertex = _k[_j];
                    var dico = new mathis.HashMap();
                    var newLinks = [];
                    for (var _l = 0, _m = vertex.links; _l < _m.length; _l++) {
                        var link = _m[_l];
                        if (dico.getValue(link.to) == null) {
                            dico.putValue(link.to, true);
                            newLinks.push(link);
                        }
                    }
                    vertex.links = newLinks;
                }
            };
            MergerNew.prototype.letsMergeTriangleQuadFaces = function () {
            };
            MergerNew.prototype.changeOneSquare = function (square) {
                if (square[0] == square[2] || square[1] == square[3])
                    return null;
                var indexOfCollabsed = null;
                var nbOfCollapsed = 0;
                for (var i = 0; i < 4; i++) {
                    if (square[i] == square[(i + 1) % 4]) {
                        nbOfCollapsed++;
                        indexOfCollabsed = i;
                    }
                }
                if (nbOfCollapsed == 0)
                    return square;
                if (nbOfCollapsed > 1)
                    return null;
                if (indexOfCollabsed == 0)
                    return [square[1], square[2], square[3]];
                if (indexOfCollabsed == 1)
                    return [square[2], square[3], square[0]];
                if (indexOfCollabsed == 2)
                    return [square[3], square[0], square[1]];
                if (indexOfCollabsed == 3)
                    return [square[0], square[1], square[2]];
            };
            return MergerNew;
        }());
        grateAndGlue.MergerNew = MergerNew;
        var Merger = (function () {
            function Merger(receiverMamesh, sourceMamesh, map) {
                this.sourceEqualRecepter = false;
                this.cleanDoubleSquareAndTriangles = true;
                this.cleanLinksCrossingSegmentMiddle = true;
                this.suppressSomeTriangleAndSquareSuperposition = false;
                this.mergeLink = true;
                this.mergeTrianglesAndSquares = true;
                this.mergeSegmentsMiddle = true;
                this.destroySource = true;
                this.OUT_mergedVertices = [];
                this.receiverMamesh = receiverMamesh;
                if (sourceMamesh == null || receiverMamesh == sourceMamesh) {
                    this.sourceMamesh = receiverMamesh;
                    this.sourceEqualRecepter = true;
                }
                else {
                    this.sourceMamesh = sourceMamesh;
                    this.sourceEqualRecepter = false;
                }
                if (map == null)
                    map = new FindCloseVerticesFast(this.receiverMamesh.vertices, this.sourceMamesh.vertices).go();
                this.merginMap = new mathis.HashMap(true);
                for (var _i = 0, _a = map.allEntries(); _i < _a.length; _i++) {
                    var entry = _a[_i];
                    this.merginMap.putValue(entry.key, entry.value[0]);
                }
            }
            Merger.prototype.checkArgs = function () {
                var _this = this;
                if (!this.merginMap.memorizeKeys)
                    throw 'the merging map must memorize the keys';
                this.merginMap.allValues().forEach(function (v) {
                    if (_this.merginMap.getValue(v) != null)
                        throw 'a vertex cannot be the destination and the source of a merging';
                });
            };
            Merger.prototype.goChanging = function () {
                this.checkArgs();
                if (this.mergeLink)
                    this.mergeVerticesAndLinks();
                else
                    this.mergeOnlyVertices();
                if (this.mergeTrianglesAndSquares)
                    this.letsMergeTrianglesAndSquares();
                if (this.mergeSegmentsMiddle)
                    this.mergeCutSegment();
                this.receiverMamesh.lines = null;
                if (this.destroySource && !this.sourceEqualRecepter)
                    this.sourceMamesh.vertices = null;
            };
            Merger.prototype.mergeOnlyVertices = function () {
                var _this = this;
                if (!this.sourceEqualRecepter)
                    this.receiverMamesh.vertices = this.receiverMamesh.vertices.concat(this.sourceMamesh.vertices);
                this.receiverMamesh.clearLinksAndLines();
                this.merginMap.allKeys().forEach(function (v) {
                    mathis.tab.removeFromArray(_this.receiverMamesh.vertices, v);
                });
            };
            Merger.prototype.mergeVerticesAndLinks = function () {
                var _this = this;
                if (!this.sourceEqualRecepter)
                    this.receiverMamesh.vertices = this.receiverMamesh.vertices.concat(this.sourceMamesh.vertices);
                this.receiverMamesh.clearOppositeInLinks();
                this.OUT_mergedVertices = this.merginMap.allKeys();
                this.OUT_mergedVertices.forEach(function (vSource) {
                    var vReceiver = _this.merginMap.getValue(vSource);
                    var linksThatWeKeep = [];
                    vSource.links.forEach(function (link) {
                        if (_this.merginMap.getValue(link.to) == null) {
                            if (_this.merginMap.getValue(vSource) != link.to)
                                linksThatWeKeep.push(link);
                        }
                    });
                    vReceiver.links = vReceiver.links.concat(linksThatWeKeep);
                    if (vReceiver.param.x == 0)
                        vSource.param.x = 0;
                    if (vSource.param.y == 0)
                        vReceiver.param.y = 0;
                });
                var newVertices = [];
                this.receiverMamesh.vertices.forEach(function (v) {
                    if (_this.merginMap.allKeys().indexOf(v) == -1)
                        newVertices.push(v);
                });
                this.receiverMamesh.vertices = newVertices;
                this.receiverMamesh.vertices.forEach(function (v1) {
                    var perhapsLinkToSuppress = null;
                    v1.links.forEach(function (link) {
                        if (_this.merginMap.getValue(link.to) != null) {
                            if (_this.merginMap.getValue(link.to) != v1)
                                link.to = _this.merginMap.getValue(link.to);
                            else {
                                if (perhapsLinkToSuppress == null)
                                    perhapsLinkToSuppress = [];
                                perhapsLinkToSuppress.push(link);
                            }
                        }
                    });
                    if (perhapsLinkToSuppress != null) {
                        perhapsLinkToSuppress.forEach(function (li) {
                            mathis.tab.removeFromArray(v1.links, li);
                        });
                    }
                });
            };
            Merger.prototype.mergeCutSegment = function () {
                var _this = this;
                if (!this.sourceEqualRecepter) {
                    for (var key in this.sourceMamesh.cutSegmentsDico)
                        this.receiverMamesh.cutSegmentsDico[key] = this.sourceMamesh.cutSegmentsDico[key];
                }
                for (var key in this.receiverMamesh.cutSegmentsDico) {
                    var segment = this.receiverMamesh.cutSegmentsDico[key];
                    if (segment.a.hashNumber == segment.middle.hashNumber || segment.b.hashNumber == segment.middle.hashNumber || segment.a.hashNumber == segment.b.hashNumber) {
                        delete this.receiverMamesh.cutSegmentsDico[key];
                        continue;
                    }
                    var segmentIsModified = false;
                    if (this.merginMap.getValue(segment.a) != null) {
                        segment.a = this.merginMap.getValue(segment.a);
                        segmentIsModified = true;
                    }
                    if (this.merginMap.getValue(segment.b) != null) {
                        segment.b = this.merginMap.getValue(segment.b);
                        segmentIsModified = true;
                    }
                    if (this.merginMap.getValue(segment.middle) != null) {
                        segment.middle = this.merginMap.getValue(segment.middle);
                        segmentIsModified = true;
                    }
                    if (segmentIsModified) {
                        delete this.receiverMamesh.cutSegmentsDico[key];
                        this.receiverMamesh.cutSegmentsDico[mathis.Segment.segmentId(segment.a.hashNumber, segment.b.hashNumber)] = segment;
                    }
                }
                if (this.cleanLinksCrossingSegmentMiddle) {
                    this.receiverMamesh.vertices.forEach(function (v) {
                        var linkToDelete = [];
                        for (var i = 0; i < v.links.length; i++) {
                            var link = v.links[i];
                            if (_this.receiverMamesh.cutSegmentsDico[mathis.Segment.segmentId(v.hashNumber, link.to.hashNumber)] != null)
                                linkToDelete.push(i);
                        }
                        v.links = mathis.tab.arrayMinusBlocksIndices(v.links, linkToDelete, 1);
                    });
                }
            };
            Merger.prototype.letsMergeTrianglesAndSquares = function () {
                if (!this.sourceEqualRecepter) {
                    this.receiverMamesh.smallestSquares = this.receiverMamesh.smallestSquares.concat(this.sourceMamesh.smallestSquares);
                    this.receiverMamesh.smallestTriangles = this.receiverMamesh.smallestTriangles.concat(this.sourceMamesh.smallestTriangles);
                }
                for (var i = 0; i < this.receiverMamesh.smallestTriangles.length; i++) {
                    var vert = this.receiverMamesh.smallestTriangles[i];
                    if (this.merginMap.getValue(vert) != null)
                        this.receiverMamesh.smallestTriangles[i] = this.merginMap.getValue(vert);
                }
                var triangleToSuppress = [];
                for (var i = 0; i < this.receiverMamesh.smallestTriangles.length; i += 3) {
                    if (this.receiverMamesh.smallestTriangles[i] == this.receiverMamesh.smallestTriangles[i + 1] || this.receiverMamesh.smallestTriangles[i + 1] == this.receiverMamesh.smallestTriangles[i + 2] || this.receiverMamesh.smallestTriangles[i + 2] == this.receiverMamesh.smallestTriangles[i]) {
                        triangleToSuppress.push(i);
                    }
                }
                this.receiverMamesh.smallestTriangles = mathis.tab.arrayMinusBlocksIndices(this.receiverMamesh.smallestTriangles, triangleToSuppress, 3);
                this.receiverMamesh.smallestTriangles = new mathis.tab.ArrayMinusBlocksElements(this.receiverMamesh.smallestTriangles, 3).go();
                for (var i = 0; i < this.receiverMamesh.smallestSquares.length; i++) {
                    var vert = this.receiverMamesh.smallestSquares[i];
                    if (this.merginMap.getValue(vert) != null)
                        this.receiverMamesh.smallestSquares[i] = this.merginMap.getValue(vert);
                }
                var squareToSuppress = [];
                for (var i = 0; i < this.receiverMamesh.smallestSquares.length; i += 4) {
                    var changedSquare = this.changeOneSquare([this.receiverMamesh.smallestSquares[i], this.receiverMamesh.smallestSquares[i + 1], this.receiverMamesh.smallestSquares[i + 2], this.receiverMamesh.smallestSquares[i + 3]]);
                    if (changedSquare == null) {
                        squareToSuppress.push(i);
                    }
                    else if (changedSquare.length == 3) {
                        this.receiverMamesh.smallestTriangles.push(changedSquare[0], changedSquare[1], changedSquare[2]);
                        squareToSuppress.push(i);
                    }
                }
                this.receiverMamesh.smallestSquares = mathis.tab.arrayMinusBlocksIndices(this.receiverMamesh.smallestSquares, squareToSuppress, 4);
                if (this.cleanDoubleSquareAndTriangles)
                    this.receiverMamesh.smallestSquares = new mathis.tab.ArrayMinusBlocksElements(this.receiverMamesh.smallestSquares, 4).go();
                if (this.suppressSomeTriangleAndSquareSuperposition) {
                    var triInSquare = new mathis.StringMap();
                    for (var i = 0; i < this.receiverMamesh.smallestSquares.length; i += 4) {
                        triInSquare.putValue(mathis.tab.indicesUpPermutationToString([this.receiverMamesh.smallestSquares[i].hashNumber, this.receiverMamesh.smallestSquares[i + 1].hashNumber, this.receiverMamesh.smallestSquares[i + 2].hashNumber]), true);
                        triInSquare.putValue(mathis.tab.indicesUpPermutationToString([this.receiverMamesh.smallestSquares[i + 2].hashNumber, this.receiverMamesh.smallestSquares[i + 3].hashNumber, this.receiverMamesh.smallestSquares[i].hashNumber]), true);
                        triInSquare.putValue(mathis.tab.indicesUpPermutationToString([this.receiverMamesh.smallestSquares[i].hashNumber, this.receiverMamesh.smallestSquares[i + 1].hashNumber, this.receiverMamesh.smallestSquares[i + 3].hashNumber]), true);
                        triInSquare.putValue(mathis.tab.indicesUpPermutationToString([this.receiverMamesh.smallestSquares[i + 1].hashNumber, this.receiverMamesh.smallestSquares[i + 2].hashNumber, this.receiverMamesh.smallestSquares[i + 3].hashNumber]), true);
                    }
                    var triToSupp = [];
                    for (var i = 0; i < this.receiverMamesh.smallestTriangles.length; i += 3) {
                        var key = mathis.tab.indicesUpPermutationToString([this.receiverMamesh.smallestTriangles[i].hashNumber, this.receiverMamesh.smallestTriangles[i + 1].hashNumber, this.receiverMamesh.smallestTriangles[i + 2].hashNumber]);
                        if (triInSquare.getValue(key)) {
                            triToSupp.push(i, i + 1, i + 2);
                        }
                    }
                    this.receiverMamesh.smallestTriangles = mathis.tab.arrayMinusBlocksIndices(this.receiverMamesh.smallestTriangles, triToSupp, 3);
                    var diago = new mathis.StringMap();
                    for (var i = 0; i < this.receiverMamesh.smallestSquares.length; i += 4) {
                        diago.putValue(mathis.tab.indicesUpPermutationToString([this.receiverMamesh.smallestSquares[i].hashNumber, this.receiverMamesh.smallestSquares[i + 2].hashNumber]), true);
                        diago.putValue(mathis.tab.indicesUpPermutationToString([this.receiverMamesh.smallestSquares[i + 1].hashNumber, this.receiverMamesh.smallestSquares[i + 3].hashNumber]), true);
                    }
                    var squareToRemove = [];
                    var triToAdd = [];
                    for (var i = 0; i < this.receiverMamesh.smallestSquares.length; i += 4) {
                        for (var k = 0; k < 4; k++) {
                            var edge0 = [this.receiverMamesh.smallestSquares[i + k].hashNumber, this.receiverMamesh.smallestSquares[i + (k + 1) % 4].hashNumber];
                            var edge1 = [this.receiverMamesh.smallestSquares[i + (k + 1) % 4].hashNumber, this.receiverMamesh.smallestSquares[i + (k + 2) % 4].hashNumber];
                            if (diago.getValue(mathis.tab.indicesUpPermutationToString(edge0)) && diago.getValue(mathis.tab.indicesUpPermutationToString(edge1))) {
                                squareToRemove.push(i, i + 1, i + 2, i + 3);
                                triToAdd.push(this.receiverMamesh.smallestSquares[i + (k + 2) % 4], this.receiverMamesh.smallestSquares[i + (k + 3) % 4], this.receiverMamesh.smallestSquares[i + k % 4]);
                            }
                        }
                    }
                    if (triToAdd.length > 0) {
                        this.receiverMamesh.smallestSquares = mathis.tab.arrayMinusBlocksIndices(this.receiverMamesh.smallestSquares, squareToRemove, 4);
                        this.receiverMamesh.smallestTriangles = this.receiverMamesh.smallestTriangles.concat(triToAdd);
                    }
                }
            };
            Merger.prototype.changeOneSquare = function (square) {
                if (square[0] == square[2] || square[1] == square[3])
                    return null;
                var indexOfCollabsed = null;
                var nbOfCollapsed = 0;
                for (var i = 0; i < 4; i++) {
                    if (square[i] == square[(i + 1) % 4]) {
                        nbOfCollapsed++;
                        indexOfCollabsed = i;
                    }
                }
                if (nbOfCollapsed == 0)
                    return square;
                if (nbOfCollapsed > 1)
                    return null;
                if (indexOfCollabsed == 0)
                    return [square[1], square[2], square[3]];
                if (indexOfCollabsed == 1)
                    return [square[2], square[3], square[0]];
                if (indexOfCollabsed == 2)
                    return [square[3], square[0], square[1]];
                if (indexOfCollabsed == 3)
                    return [square[0], square[1], square[2]];
            };
            return Merger;
        }());
        grateAndGlue.Merger = Merger;
        var Sticker = (function () {
            function Sticker(mamesh0, mamesh1, stickingMap) {
                this.createNewLinks = true;
                this.cleanOppositeLinksAtBegin = true;
                this.twoMameshes = true;
                this.zIndex1 = Math.random();
                this.SUB_polygonFinder = new mathis.polygonFinder.PolygonFinderFromLinks(null);
                if (mamesh0 == mamesh1 || mamesh1 == null)
                    this.twoMameshes = false;
                this.mamesh0 = mamesh0;
                if (this.twoMameshes)
                    this.mamesh1 = mamesh1;
                else
                    this.mamesh1 = null;
                this.stickingMap = stickingMap;
            }
            Sticker.prototype.checkArgs = function () {
                if (!this.stickingMap.memorizeKeys)
                    throw 'the sticking map must memorize the keys';
                for (var _i = 0, _a = this.stickingMap.allValues(); _i < _a.length; _i++) {
                    var vs = _a[_i];
                    for (var _b = 0, vs_1 = vs; _b < vs_1.length; _b++) {
                        var v = vs_1[_b];
                        if (this.stickingMap.getValue(v) != null)
                            throw 'a vertex cannot be the destination and the source of a sticking';
                    }
                }
            };
            Sticker.prototype.goChanging = function () {
                if (this.stickingMap.allKeys().length == 0)
                    return;
                this.checkArgs();
                if (this.cleanOppositeLinksAtBegin) {
                    this.mamesh0.clearOppositeInLinks();
                    if (this.twoMameshes)
                        this.mamesh1.clearOppositeInLinks();
                }
                if (this.twoMameshes) {
                    for (var _i = 0, _a = this.mamesh1.vertices; _i < _a.length; _i++) {
                        var ve = _a[_i];
                        ve.param.z = this.zIndex1;
                        this.mamesh0.addVertex(ve);
                    }
                    this.mamesh0.smallestSquares = this.mamesh0.smallestSquares.concat(this.mamesh1.smallestSquares);
                    this.mamesh0.smallestTriangles = this.mamesh0.smallestTriangles.concat(this.mamesh1.smallestTriangles);
                }
                this.mamesh0.cutSegmentsDico = {};
                this.mamesh0.vertexToPositioning = null;
                this.mamesh0.lines = null;
                if (this.createNewLinks) {
                    for (var _b = 0, _c = this.stickingMap.allKeys(); _b < _c.length; _b++) {
                        var vSource = _c[_b];
                        for (var _d = 0, _e = this.stickingMap.getValue(vSource); _d < _e.length; _d++) {
                            var vReceiver = _e[_d];
                            vSource.setOneLink(vReceiver);
                            vReceiver.setOneLink(vSource);
                        }
                    }
                }
            };
            return Sticker;
        }());
        grateAndGlue.Sticker = Sticker;
    })(grateAndGlue = mathis.grateAndGlue || (mathis.grateAndGlue = {}));
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    function allIntegerValueOfEnume(MyEnum) {
        var res = [];
        for (var prop in MyEnum) {
            if (MyEnum.hasOwnProperty(prop)) {
                var i = parseInt(prop);
                if (!isNaN(i))
                    res.push(i);
            }
        }
        return res;
    }
    mathis.allIntegerValueOfEnume = allIntegerValueOfEnume;
    function allStringValueOfEnume(MyEnum) {
        var res = [];
        for (var prop in MyEnum) {
            if (MyEnum.hasOwnProperty(prop) &&
                (isNaN(parseInt(prop)))) {
                res.push(prop);
            }
        }
        return res;
    }
    mathis.allStringValueOfEnume = allStringValueOfEnume;
    var logger;
    (function (logger) {
        logger.showTrace = false;
        var alreadyWroteWarning = [];
        function c(message, maxTimesFired) {
            if (maxTimesFired === void 0) { maxTimesFired = 1; }
            if (alreadyWroteWarning[message] != null)
                alreadyWroteWarning[message]++;
            else
                alreadyWroteWarning[message] = 1;
            if (alreadyWroteWarning[message] <= maxTimesFired) {
                if (logger.showTrace) {
                    var err = new Error();
                    console.log("WARNING", message, '...........................................', err);
                }
                else {
                    console.log("WARNING", message);
                }
            }
        }
        logger.c = c;
    })(logger = mathis.logger || (mathis.logger = {}));
    function roundWithGivenPrecision(value, nbDecimal) {
        value *= Math.pow(10, nbDecimal);
        value = Math.round(value);
        value /= Math.pow(10, nbDecimal);
        return value;
    }
    mathis.roundWithGivenPrecision = roundWithGivenPrecision;
    function applyMixins(derivedCtor, baseCtors) {
        baseCtors.forEach(function (baseCtor) {
            Object.getOwnPropertyNames(baseCtor.prototype).forEach(function (name) {
                if (name !== 'constructor') {
                    derivedCtor.prototype[name] = baseCtor.prototype[name];
                }
            });
        });
    }
    mathis.applyMixins = applyMixins;
    function setCursorByID(id, cursorStyle) {
        var elem;
        if (document.getElementById &&
            (elem = document.getElementById(id))) {
            if (elem.style)
                elem.style.cursor = cursorStyle;
        }
    }
    mathis.setCursorByID = setCursorByID;
    var Bilan = (function () {
        function Bilan() {
            this.millisDuration = 0;
            this.nbTested = 0;
            this.nbOK = 0;
            this.millisDep = performance.now();
        }
        Bilan.prototype.computeTime = function () {
            this.millisDuration = performance.now() - this.millisDep;
        };
        Bilan.prototype.add = function (bilan) {
            bilan.computeTime();
            this.nbTested += bilan.nbTested;
            this.nbOK += bilan.nbOK;
            this.millisDuration += bilan.millisDuration;
        };
        Bilan.prototype.assertTrue = function (ok) {
            this.nbTested++;
            if (ok)
                this.nbOK++;
            else {
                var e = new Error();
                console.log(e.stack);
            }
        };
        Bilan.prototype.toString = function () {
            return 'nbTest:' + this.nbTested + ', nbOK:' + this.nbOK + ', millisDuration:' + this.millisDuration.toFixed(2);
        };
        return Bilan;
    }());
    mathis.Bilan = Bilan;
    function modulo(i, n, centered) {
        if (centered === void 0) { centered = false; }
        if (n < 0)
            throw 'second arg must be positif';
        var res = 0;
        if (i >= 0)
            res = i % n;
        else
            res = n - (-i) % n;
        if (centered && res > n / 2)
            res = res - n;
        if (Math.abs(res - n) < Number.MIN_VALUE * 10)
            res = 0;
        return res;
    }
    mathis.modulo = modulo;
    function shuffle(array) {
        var counter = array.length, temp, index;
        while (counter > 0) {
            index = Math.floor(Math.random() * counter);
            counter--;
            temp = array[counter];
            array[counter] = array[index];
            array[index] = temp;
        }
        return array;
    }
    mathis.shuffle = shuffle;
    var Entry = (function () {
        function Entry(key, value) {
            this.key = key;
            this.value = value;
        }
        return Entry;
    }());
    mathis.Entry = Entry;
    var HashMap = (function () {
        function HashMap(memorizeKeys) {
            if (memorizeKeys === void 0) { memorizeKeys = false; }
            this.values = {};
            this.keys = {};
            this.memorizeKeys = memorizeKeys;
        }
        HashMap.prototype.putValue = function (key, value, nullKeyForbidden) {
            if (nullKeyForbidden === void 0) { nullKeyForbidden = true; }
            if (key == null) {
                if (nullKeyForbidden)
                    throw 'key must be non null';
                else
                    return null;
            }
            this.values[key.hashString] = value;
            if (this.memorizeKeys)
                this.keys[key.hashString] = key;
        };
        HashMap.prototype.removeKey = function (key) {
            delete this.values[key.hashString];
            if (this.memorizeKeys)
                delete this.keys[key.hashString];
        };
        HashMap.prototype.getValue = function (key, nullKeyForbidden) {
            if (nullKeyForbidden === void 0) { nullKeyForbidden = true; }
            if (key == null) {
                if (nullKeyForbidden)
                    throw 'key must be non null';
                else
                    return null;
            }
            return this.values[key.hashString];
        };
        HashMap.prototype.allValues = function () {
            var res = new Array();
            for (var index in this.values)
                res.push(this.values[index]);
            return res;
        };
        HashMap.prototype.oneValue = function () {
            for (var index in this.values) {
                return this.values[index];
            }
            return null;
        };
        HashMap.prototype.allKeys = function () {
            if (!this.memorizeKeys)
                throw 'this hashMap has not memorized keys. Please, put args=true in the constructor';
            var res = new Array();
            for (var index in this.keys)
                res.push(this.keys[index]);
            return res;
        };
        HashMap.prototype.allEntries = function () {
            if (!this.memorizeKeys)
                throw 'this hashMap has not memorized keys. Please, put args=true in the constructor';
            var res = [];
            for (var index in this.keys)
                res.push(new Entry(this.keys[index], this.values[index]));
            return res;
        };
        HashMap.prototype.aRandomValue = function () {
            var keys = Object.keys(this.values);
            return this.values[keys[Math.floor(keys.length * Math.random())]];
        };
        HashMap.prototype.extend = function (otherHashMap) {
            if (!otherHashMap.memorizeKeys)
                throw "cannot extend this  with a HashMap which do not memorize keys";
            for (var _i = 0, _a = otherHashMap.allEntries(); _i < _a.length; _i++) {
                var entry = _a[_i];
                this.putValue(entry.key, entry.value);
            }
        };
        HashMap.prototype.size = function () {
            var res = 0;
            for (var key in this.values)
                res++;
            return res;
        };
        HashMap.prototype.printMe = function (toStringFuncForValues) {
            var res = "[";
            for (var key in this.values) {
                res += key + ">" + toStringFuncForValues(this.values[key]) + ",";
            }
            res += "]";
            return res;
        };
        return HashMap;
    }());
    mathis.HashMap = HashMap;
    var StringMap = (function () {
        function StringMap() {
            this.values = {};
        }
        StringMap.prototype.putValue = function (key, value, nullKeyForbidden) {
            if (nullKeyForbidden === void 0) { nullKeyForbidden = true; }
            if (key == null) {
                if (nullKeyForbidden)
                    throw 'key must be non null';
                else
                    return null;
            }
            this.values[key] = value;
        };
        StringMap.prototype.removeKey = function (key) {
            delete this.values[key];
        };
        StringMap.prototype.getValue = function (key, nullKeyForbidden) {
            if (nullKeyForbidden === void 0) { nullKeyForbidden = true; }
            if (key == null) {
                if (nullKeyForbidden)
                    throw 'key must be non null';
                else
                    return null;
            }
            return this.values[key];
        };
        StringMap.prototype.allValues = function () {
            var res = new Array();
            for (var index in this.values)
                res.push(this.values[index]);
            return res;
        };
        StringMap.prototype.oneValue = function () {
            for (var index in this.values) {
                return this.values[index];
            }
            return null;
        };
        StringMap.prototype.allKeys = function () {
            return Object.keys(this.values);
        };
        StringMap.prototype.aRandomValue = function () {
            var keys = Object.keys(this.values);
            return this.values[keys[Math.floor(keys.length * Math.random())]];
        };
        StringMap.prototype.size = function () {
            var res = 0;
            for (var key in this.values)
                res++;
            return res;
        };
        StringMap.prototype.__serialize = function () { return this.values; };
        StringMap.prototype.__load = function (values) { this.values = values; };
        return StringMap;
    }());
    mathis.StringMap = StringMap;
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    var lineModule;
    (function (lineModule) {
        var LineComputer = (function () {
            function LineComputer(mamesh) {
                this.startingVertices = null;
                this.startingSegments = null;
                this.restrictLinesToTheseVertices = null;
                this.lookAtBifurcation = true;
                this.mamesh = mamesh;
            }
            LineComputer.prototype.go = function () {
                if (this.mamesh == null)
                    throw ' a null mamesh';
                if (this.mamesh.vertices == null || this.mamesh.vertices.length == 0)
                    throw 'no vertices in this mamesh';
                if (this.mamesh.linesWasMade)
                    mathis.logger.c('lines already exist for this mamesh');
                var preres = makeLineCatalogue2(this.mamesh.vertices, this.lookAtBifurcation);
                var res = [];
                if (this.startingVertices != null) {
                    var dicoStarting = new mathis.HashMap();
                    for (var _i = 0, _a = this.startingVertices; _i < _a.length; _i++) {
                        var v = _a[_i];
                        dicoStarting.putValue(v, true);
                    }
                    for (var _b = 0, preres_1 = preres; _b < preres_1.length; _b++) {
                        var line = preres_1[_b];
                        for (var _c = 0, _d = line.vertices; _c < _d.length; _c++) {
                            var vv = _d[_c];
                            if (dicoStarting.getValue(vv) != null) {
                                res.push(line);
                                break;
                            }
                        }
                    }
                }
                if (this.startingSegments != null) {
                    var hashDico = new mathis.StringMap();
                    for (var _e = 0, _f = this.startingSegments; _e < _f.length; _e++) {
                        var _g = _f[_e], v0 = _g[0], v1 = _g[1];
                        hashDico.putValue(mathis.Hash.segment(v0, v1), true);
                    }
                    for (var _h = 0, preres_2 = preres; _h < preres_2.length; _h++) {
                        var line = preres_2[_h];
                        var addOne = 0;
                        if (line.isLoop)
                            addOne = 1;
                        for (var i = 0; i < line.vertices.length + addOne; i++) {
                            if (hashDico.getValue(mathis.Hash.segment(line.vertices[i], line.vertices[(i + 1) % line.vertices.length])) == true) {
                                res.push(line);
                                break;
                            }
                        }
                    }
                }
                if (this.startingVertices == null && this.startingSegments == null)
                    res = preres;
                if (this.restrictLinesToTheseVertices != null) {
                    var cutter = new LinesCuter(res, this.restrictLinesToTheseVertices);
                    res = cutter.go();
                }
                return res;
            };
            return LineComputer;
        }());
        lineModule.LineComputer = LineComputer;
        var LinesCuter = (function () {
            function LinesCuter(lines, vertices) {
                this.lines = lines;
                this.vertices = vertices;
            }
            LinesCuter.prototype.go = function () {
                var _this = this;
                this.allPresentVertices = new mathis.HashMap();
                for (var _i = 0, _a = this.vertices; _i < _a.length; _i++) {
                    var v = _a[_i];
                    this.allPresentVertices.putValue(v, true);
                }
                var res = [];
                this.lines.forEach(function (line) {
                    if (!line.isLoop) {
                        var linesAsVertex = _this.cutOneLine(line.vertices);
                        for (var _i = 0, linesAsVertex_1 = linesAsVertex; _i < linesAsVertex_1.length; _i++) {
                            var l = linesAsVertex_1[_i];
                            res.push(new mathis.Line(l, false));
                        }
                    }
                });
                this.lines.forEach(function (li) {
                    if (li.isLoop) {
                        var line = li.vertices;
                        var firstIndexWithHole = -1;
                        for (var i = 0; i < line.length; i++) {
                            if (_this.allPresentVertices.getValue(line[i]) == null) {
                                firstIndexWithHole = i;
                                break;
                            }
                        }
                        if (firstIndexWithHole == -1)
                            res.push(li);
                        else {
                            var shiftedLine = [];
                            for (var j = 0; j < line.length; j++) {
                                shiftedLine.push(line[(j + firstIndexWithHole) % line.length]);
                            }
                            var linesAsVertex = _this.cutOneLine(shiftedLine);
                            for (var _i = 0, linesAsVertex_2 = linesAsVertex; _i < linesAsVertex_2.length; _i++) {
                                var l = linesAsVertex_2[_i];
                                res.push(new mathis.Line(l, false));
                            }
                        }
                    }
                });
                return res;
            };
            LinesCuter.prototype.cutOneLine = function (path) {
                var allLittlePath = [];
                allLittlePath[0] = [];
                var currentPathIndex = -1;
                var previousWasZero = true;
                for (var i = 0; i < path.length; i++) {
                    if (this.allPresentVertices.getValue(path[i]) == true) {
                        if (!previousWasZero)
                            allLittlePath[currentPathIndex].push(path[i]);
                        else {
                            currentPathIndex++;
                            allLittlePath[currentPathIndex] = [];
                            allLittlePath[currentPathIndex].push(path[i]);
                            previousWasZero = false;
                        }
                    }
                    else {
                        previousWasZero = true;
                    }
                }
                var allLittlePathCleaned = [];
                allLittlePath.forEach(function (li) {
                    if (li.length >= 2)
                        allLittlePathCleaned.push(li);
                });
                return allLittlePathCleaned;
            };
            return LinesCuter;
        }());
        lineModule.LinesCuter = LinesCuter;
        function makeLineCatalogue2(graph, lookAtBifurcations) {
            var segmentsAlreadySeen = new mathis.HashMap();
            var lines = [];
            function addOneSegment(isLoop, lineInConstruction, segmentsAlreadySeenInTheBuildLine, hasBifurcate) {
                var last = lineInConstruction[lineInConstruction.length - 1];
                var beforeLast = lineInConstruction[lineInConstruction.length - 2];
                segmentsAlreadySeen.putValue(new mathis.Segment(beforeLast, last), true);
                var opposites = last.getOpposites(beforeLast);
                if (opposites == null) {
                    if (isLoop)
                        mathis.logger.c('strange : probably, the function makeLineCatalogue2 have as args a non complete graph (call getGroup before)');
                    lines.push(new mathis.Line(lineInConstruction, false));
                }
                else if (opposites.length == 0)
                    throw 'convention: is no opposite, the array opposite must be null, and not empty';
                else if (segmentsAlreadySeenInTheBuildLine.getValue(new mathis.Segment(beforeLast, last)) == true) {
                    lines.push(new mathis.Line(lineInConstruction, false));
                }
                else {
                    segmentsAlreadySeenInTheBuildLine.putValue(new mathis.Segment(beforeLast, last), true);
                    var nbOp = opposites.length;
                    if (!lookAtBifurcations)
                        nbOp = 1;
                    for (var i = 0; i < nbOp; i++) {
                        var opposite = opposites[i];
                        if (opposite == lineInConstruction[0]) {
                            lines.push(new mathis.Line(lineInConstruction, true));
                            segmentsAlreadySeen.putValue(new mathis.Segment(last, lineInConstruction[0]), true);
                        }
                        else {
                            if (i < nbOp - 1) {
                                var copySegmentsAlreadySeenIn = new mathis.HashMap();
                                for (var i_2 = 0; i_2 < lineInConstruction.length - 1; i_2++)
                                    copySegmentsAlreadySeenIn.putValue(new mathis.Segment(lineInConstruction[i_2], lineInConstruction[i_2 + 1]), true);
                                var copyLineInConstruction = lineInConstruction.concat([opposite]);
                                addOneSegment(isLoop, copyLineInConstruction, copySegmentsAlreadySeenIn, true);
                            }
                            else {
                                lineInConstruction.push(opposite);
                                addOneSegment(isLoop, lineInConstruction, segmentsAlreadySeenInTheBuildLine, hasBifurcate);
                            }
                        }
                    }
                }
            }
            graph.forEach(function (vertex) {
                vertex.links.forEach(function (link) {
                    if (link.opposites == null) {
                        if (lookAtBifurcations || segmentsAlreadySeen.getValue(new mathis.Segment(vertex, link.to)) == null) {
                            var lineInConstruction = [vertex, link.to];
                            var segmentAlreadySeenInThisBuildLine = new mathis.HashMap();
                            addOneSegment(false, lineInConstruction, segmentAlreadySeenInThisBuildLine, false);
                        }
                    }
                });
            });
            if (lookAtBifurcations) {
                var lineDico = new mathis.HashMap();
                var straightWithoutRepetitions = [];
                for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
                    var line = lines_1[_i];
                    if (lineDico.getValue(line) == null)
                        straightWithoutRepetitions.push(line);
                    lineDico.putValue(line, true);
                }
                lines = straightWithoutRepetitions;
            }
            graph.forEach(function (cell) {
                cell.links.forEach(function (nei) {
                    if (segmentsAlreadySeen.getValue(new mathis.Segment(cell, nei.to)) == null) {
                        var lineInConstruction = [cell, nei.to];
                        var segmentAlreadySeenInThisBuildLine = new mathis.HashMap();
                        addOneSegment(true, lineInConstruction, segmentAlreadySeenInThisBuildLine, false);
                    }
                });
            });
            return lines;
        }
        lineModule.makeLineCatalogue2 = makeLineCatalogue2;
        var PackSegment = (function (_super) {
            __extends(PackSegment, _super);
            function PackSegment() {
                return _super.call(this, true) || this;
            }
            return PackSegment;
        }(mathis.HashMap));
        var CreateAColorIndexRespectingBifurcationsAndSymmetries = (function () {
            function CreateAColorIndexRespectingBifurcationsAndSymmetries(mamesh) {
                this.packSymmetricLines = true;
                this.forSymmetriesUsePositionVersusParam = true;
                this.useConsecutiveIntegerForPackNumber = true;
                this.symmetries = null;
                this.OUT_nbFoundSymmetricLines = 0;
                this.OUT_lineIndexToColorIndex = [];
                this.mamesh = mamesh;
            }
            CreateAColorIndexRespectingBifurcationsAndSymmetries.prototype.go = function () {
                if (!this.mamesh.linesWasMade)
                    throw 'no line for this IN_mamesh';
                var res = [];
                var packIndex = 0;
                var segmentToPack = new mathis.HashMap();
                for (var _i = 0, _a = this.mamesh.lines; _i < _a.length; _i++) {
                    var line = _a[_i];
                    var segmentAlreadyCatalogued = [];
                    var segmentNeverCatalogued = [];
                    for (var _b = 0, _c = line.allSegments(); _b < _c.length; _b++) {
                        var segment = _c[_b];
                        if (segmentToPack.getValue(segment) != null)
                            segmentAlreadyCatalogued.push(segment);
                        else
                            segmentNeverCatalogued.push(segment);
                    }
                    if (segmentAlreadyCatalogued.length == 0) {
                        var newPack = new PackSegment();
                        newPack.index = packIndex++;
                        for (var _d = 0, _e = line.allSegments(); _d < _e.length; _d++) {
                            var segment = _e[_d];
                            newPack.putValue(segment, true);
                            segmentToPack.putValue(segment, newPack);
                        }
                    }
                    else {
                        var firstPack = segmentToPack.getValue(segmentAlreadyCatalogued[0]);
                        for (var i = 1; i < segmentAlreadyCatalogued.length; i++)
                            this.segmentAndHisPackJoinNewPack(segmentAlreadyCatalogued[i], firstPack, segmentToPack);
                        for (var _f = 0, segmentNeverCatalogued_1 = segmentNeverCatalogued; _f < segmentNeverCatalogued_1.length; _f++) {
                            var seg = segmentNeverCatalogued_1[_f];
                            firstPack.putValue(seg, true);
                            segmentToPack.putValue(seg, firstPack);
                        }
                    }
                }
                if (this.symmetries != null) {
                    mathis.XYZ.nbDecimalForHash = 1;
                    var symCheck = new mathis.StringMap();
                    for (var i = 0; i < this.mamesh.lines.length; i++) {
                        var line = this.mamesh.lines[i];
                        var hash = line.hashStringUpToSymmetries(this.symmetries, this.forSymmetriesUsePositionVersusParam);
                        var packSegment = symCheck.getValue(hash);
                        if (packSegment == null)
                            symCheck.putValue(hash, segmentToPack.getValue(new mathis.Segment(line.vertices[0], line.vertices[1])));
                        else {
                            this.OUT_nbFoundSymmetricLines++;
                            var otherPackSegment = segmentToPack.getValue(new mathis.Segment(line.vertices[0], line.vertices[1]));
                            if (otherPackSegment.size() == packSegment.size())
                                otherPackSegment.index = packSegment.index;
                        }
                    }
                    mathis.XYZ.nbDecimalForHash = 5;
                }
                for (var i = 0; i < this.mamesh.lines.length; i++) {
                    var line = this.mamesh.lines[i];
                    res[i] = segmentToPack.getValue(new mathis.Segment(line.vertices[0], line.vertices[1])).index;
                }
                if (this.useConsecutiveIntegerForPackNumber && this.packSymmetricLines) {
                    var newRes = [];
                    var maxIndex = mathis.tab.maxIndexOfNumericList(res);
                    var max = res[maxIndex];
                    var decay = 0;
                    for (var a = 0; a <= max; a++) {
                        var aIsFound = false;
                        for (var j = 0; j < res.length; j++) {
                            if (res[j] == a) {
                                newRes[j] = a - decay;
                                aIsFound = true;
                            }
                        }
                        if (!aIsFound)
                            decay++;
                    }
                    res = newRes;
                }
                var res2 = new mathis.HashMap();
                for (var i = 0; i < this.mamesh.lines.length; i++) {
                    res2.putValue(this.mamesh.lines[i], res[i]);
                    this.OUT_lineIndexToColorIndex[i] = res[i];
                }
                return res2;
            };
            CreateAColorIndexRespectingBifurcationsAndSymmetries.prototype.segmentAndHisPackJoinNewPack = function (segment, pack, segmentToPack) {
                var oldPack = segmentToPack.getValue(segment);
                for (var _i = 0, _a = oldPack.allKeys(); _i < _a.length; _i++) {
                    var seg = _a[_i];
                    pack.putValue(seg, true);
                    segmentToPack.putValue(seg, pack);
                }
                segmentToPack.putValue(segment, pack);
            };
            return CreateAColorIndexRespectingBifurcationsAndSymmetries;
        }());
        lineModule.CreateAColorIndexRespectingBifurcationsAndSymmetries = CreateAColorIndexRespectingBifurcationsAndSymmetries;
    })(lineModule = mathis.lineModule || (mathis.lineModule = {}));
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    var linkModule;
    (function (linkModule) {
        var SimpleLinkFromPolygonCreator = (function () {
            function SimpleLinkFromPolygonCreator(mamesh) {
                this.clearPOldLinkBefore = true;
                this.mamesh = mamesh;
            }
            SimpleLinkFromPolygonCreator.prototype.goChanging = function () {
                if (this.clearPOldLinkBefore)
                    this.mamesh.clearLinksAndLines();
                var alreadyCreatedLinks = new mathis.StringMap();
                for (var _i = 0, _a = this.mamesh.polygons; _i < _a.length; _i++) {
                    var poly = _a[_i];
                    for (var i = 0; i < poly.length; i++) {
                        var segmentId = mathis.Segment.segmentId(poly[i].hashNumber, poly[(i + 1) % poly.length].hashNumber);
                        if (alreadyCreatedLinks.getValue(segmentId) == null) {
                            alreadyCreatedLinks.putValue(segmentId, true);
                            poly[i].setOneLink(poly[(i + 1) % poly.length]);
                            poly[(i + 1) % poly.length].setOneLink(poly[i]);
                        }
                    }
                }
            };
            return SimpleLinkFromPolygonCreator;
        }());
        linkModule.SimpleLinkFromPolygonCreator = SimpleLinkFromPolygonCreator;
        var LinksSorterAndCleanerByAngles = (function () {
            function LinksSorterAndCleanerByAngles(mamesh, normals) {
                this.normals = normals;
                this.suppressLinksAngularlyTooCloseVersusNot = true;
                this.suppressLinksAngularParam = 2 * Math.PI * 0.1;
                this.keepShorterLinksVersusGiveSomePriorityToLinksWithOpposite = true;
                this.suppressTriAndQuadWhoseSideIsSuppressed = true;
                this.mamesh = mamesh;
            }
            LinksSorterAndCleanerByAngles.prototype.goChanging = function () {
                var _this = this;
                if (this.mamesh == null)
                    throw 'mamesh is null';
                if (this.normals == null)
                    this.vertexToPositioning = new mathis.mameshAroundComputations.PositioningComputerForMameshVertices(this.mamesh).go();
                else if (this.normals instanceof mathis.HashMap)
                    this.vertexToPositioning = this.normals;
                else if (this.normals instanceof mathis.XYZ) {
                    this.vertexToPositioning = new mathis.HashMap();
                    var positioning = new mathis.Positioning();
                    positioning.upVector = this.normals;
                    for (var _i = 0, _a = this.mamesh.vertices; _i < _a.length; _i++) {
                        var vertex = _a[_i];
                        this.vertexToPositioning.putValue(vertex, positioning);
                    }
                }
                this.mamesh.vertices.forEach(function (center) {
                    var vectorLinks = [];
                    for (var i = 0; i < center.links.length; i++) {
                        vectorLinks[i] = new mathis.XYZ(0, 0, 0).copyFrom(center.links[i].to.position).substract(center.position);
                        if (vectorLinks[i].length() < mathis.geo.epsilon)
                            throw 'a IN_mamesh with two voisins at the same position';
                    }
                    var angles = [];
                    angles.push({
                        angle: 0,
                        i: 0
                    });
                    var normal = _this.vertexToPositioning.getValue(center).upVector;
                    for (var i = 1; i < center.links.length; i++) {
                        angles.push({
                            angle: mathis.geo.angleBetweenTwoVectorsBetweenMinusPiAndPi(vectorLinks[0], vectorLinks[i], normal),
                            i: i
                        });
                    }
                    angles.sort(function (a, b) { return a.angle - b.angle; });
                    var newLinks = [];
                    for (var k = 0; k < angles.length; k++) {
                        newLinks.push(center.links[angles[k].i]);
                    }
                    center.links = newLinks;
                });
                if (this.suppressLinksAngularlyTooCloseVersusNot)
                    this.letsSuppressLinks();
            };
            LinksSorterAndCleanerByAngles.prototype.letsSuppressLinks = function () {
                var suppressedSegment = new mathis.StringMap();
                for (var _i = 0, _a = this.mamesh.vertices; _i < _a.length; _i++) {
                    var center = _a[_i];
                    var currentIndex = 0;
                    var oneMoreTime = true;
                    while (oneMoreTime && center.links.length >= 2) {
                        oneMoreTime = false;
                        for (var k = currentIndex; k < currentIndex + center.links.length; k++) {
                            var i = k % center.links.length;
                            var ii = (k + 1) % center.links.length;
                            var vecti = mathis.XYZ.newFrom(center.links[i].to.position).substract(center.position);
                            var vectii = mathis.XYZ.newFrom(center.links[ii].to.position).substract(center.position);
                            var angle = mathis.geo.angleBetweenTwoVectorsBetween0andPi(vecti, vectii);
                            if (angle < this.suppressLinksAngularParam) {
                                var disti = mathis.geo.distance(center.position, center.links[i].to.position);
                                var distii = mathis.geo.distance(center.position, center.links[ii].to.position);
                                var linkToSuppress = void 0;
                                if (this.keepShorterLinksVersusGiveSomePriorityToLinksWithOpposite) {
                                    if (disti < distii)
                                        linkToSuppress = center.links[ii];
                                    else
                                        linkToSuppress = center.links[i];
                                }
                                else {
                                    var ratio = disti / (disti + distii);
                                    if (ratio < 0.6 && ratio > 0.4) {
                                        if (center.links[ii].opposites == null && center.links[i].opposites != null)
                                            linkToSuppress = center.links[ii];
                                        else
                                            linkToSuppress = center.links[i];
                                    }
                                    else {
                                        if (disti < distii)
                                            linkToSuppress = center.links[ii];
                                        else
                                            linkToSuppress = center.links[i];
                                    }
                                }
                                suppressedSegment.putValue(mathis.Hash.segment(center, linkToSuppress.to), true);
                                mathis.Vertex.separateTwoVoisins(center, linkToSuppress.to);
                                oneMoreTime = true;
                                currentIndex = (ii + 1);
                                break;
                            }
                        }
                    }
                }
                if (this.suppressTriAndQuadWhoseSideIsSuppressed) {
                    var newTriList = [];
                    var newQuadList = [];
                    for (var i = 0; i < this.mamesh.smallestTriangles.length; i += 3) {
                        var hash0 = mathis.Hash.segment(this.mamesh.smallestTriangles[i], this.mamesh.smallestTriangles[i + 1]);
                        var hash1 = mathis.Hash.segment(this.mamesh.smallestTriangles[i + 1], this.mamesh.smallestTriangles[i + 2]);
                        var hash2 = mathis.Hash.segment(this.mamesh.smallestTriangles[i + 2], this.mamesh.smallestTriangles[i]);
                        if (suppressedSegment.getValue(hash0) == null && suppressedSegment.getValue(hash1) == null && suppressedSegment.getValue(hash2) == null) {
                            newTriList.push(this.mamesh.smallestTriangles[i], this.mamesh.smallestTriangles[i + 1], this.mamesh.smallestTriangles[i + 2]);
                        }
                    }
                    for (var i = 0; i < this.mamesh.smallestSquares.length; i += 4) {
                        var hash0 = mathis.Hash.segment(this.mamesh.smallestSquares[i], this.mamesh.smallestSquares[i + 1]);
                        var hash1 = mathis.Hash.segment(this.mamesh.smallestSquares[i + 1], this.mamesh.smallestSquares[i + 2]);
                        var hash2 = mathis.Hash.segment(this.mamesh.smallestSquares[i + 2], this.mamesh.smallestSquares[i + 3]);
                        var hash3 = mathis.Hash.segment(this.mamesh.smallestSquares[i + 3], this.mamesh.smallestSquares[i]);
                        if (suppressedSegment.getValue(hash0) == null && suppressedSegment.getValue(hash1) == null && suppressedSegment.getValue(hash2) == null && suppressedSegment.getValue(hash3) == null) {
                            newQuadList.push(this.mamesh.smallestSquares[i], this.mamesh.smallestSquares[i + 1], this.mamesh.smallestSquares[i + 2], this.mamesh.smallestSquares[i + 3]);
                        }
                    }
                    this.mamesh.smallestTriangles = newTriList;
                    this.mamesh.smallestSquares = newQuadList;
                }
            };
            return LinksSorterAndCleanerByAngles;
        }());
        linkModule.LinksSorterAndCleanerByAngles = LinksSorterAndCleanerByAngles;
        var OppositeLinkAssocierByAngles = (function () {
            function OppositeLinkAssocierByAngles(vertices) {
                this.maxAngleToAssociateLinks = Math.PI * 0.3;
                this.clearAllExistingOppositeBefore = true;
                this.canCreateBifurcations = true;
                this.doNotBranchOnBorder = false;
                this.OUT_nbBranching = 0;
                this.vertices = vertices;
            }
            OppositeLinkAssocierByAngles.prototype.associateOppositeLinks = function () {
                var _this = this;
                var verticeCoupleToSeparateAtTheEnd = [];
                this.vertices.forEach(function (center) {
                    var valence = 0;
                    for (var _i = 0, _a = center.links; _i < _a.length; _i++) {
                        var li = _a[_i];
                        if (li.opposites == null)
                            valence++;
                    }
                    var vectorLinks = [];
                    for (var i = 0; i < center.links.length; i++) {
                        vectorLinks[i] = new mathis.XYZ(0, 0, 0).copyFrom(center.links[i].to.position).substract(center.position);
                        if (vectorLinks[i].lengthSquared() < mathis.geo.epsilonSquare)
                            throw 'the IN_mamesh has two voisins at the same position';
                    }
                    var allAngleBetweenLinks = [];
                    var bestAngle = [];
                    for (var i = 0; i < center.links.length; i++) {
                        bestAngle[i] = Number.POSITIVE_INFINITY;
                        for (var j = i + 1; j < center.links.length; j++) {
                            var angle = Math.abs(mathis.modulo(mathis.geo.angleBetweenTwoVectorsBetween0andPi(vectorLinks[i], vectorLinks[j]) - Math.PI, Math.PI * 2, true));
                            if (angle < _this.maxAngleToAssociateLinks && (center.links[i].opposites == null && center.links[j].opposites == null)) {
                                if (angle < bestAngle[i])
                                    bestAngle[i] = angle;
                                allAngleBetweenLinks.push({
                                    angle: angle,
                                    i: i,
                                    j: j
                                });
                            }
                        }
                    }
                    allAngleBetweenLinks.sort(function (a, b) { return b.angle - a.angle; });
                    if (!_this.canCreateBifurcations || (_this.doNotBranchOnBorder && center.hasMark(mathis.Vertex.Markers.border))) {
                        while (allAngleBetweenLinks.length > 0) {
                            var elem = allAngleBetweenLinks.pop();
                            var link0 = center.links[elem.i];
                            var link1 = center.links[elem.j];
                            link0.opposites = [link1];
                            link1.opposites = [link0];
                            allAngleBetweenLinks = mathis.tab.arrayMinusElements(allAngleBetweenLinks, function (el) {
                                return el.i == elem.i || el.j == elem.i || el.i == elem.j || el.j == elem.j;
                            });
                        }
                    }
                    else {
                        while (allAngleBetweenLinks.length > 0) {
                            var elem = allAngleBetweenLinks.pop();
                            var nextElem = allAngleBetweenLinks[allAngleBetweenLinks.length - 1];
                            var link0 = void 0;
                            var link1 = void 0;
                            var link2 = void 0;
                            if (valence == 3 && nextElem != null) {
                                if (elem.i == nextElem.i) {
                                    link0 = center.links[elem.i];
                                    link1 = center.links[elem.j];
                                    link2 = center.links[nextElem.j];
                                }
                                else if (elem.i == nextElem.j) {
                                    link0 = center.links[elem.i];
                                    link1 = center.links[elem.j];
                                    link2 = center.links[nextElem.i];
                                }
                                else if (elem.j == nextElem.i) {
                                    link0 = center.links[elem.j];
                                    link1 = center.links[elem.i];
                                    link2 = center.links[nextElem.j];
                                }
                                else if (elem.j == nextElem.j) {
                                    link0 = center.links[elem.j];
                                    link1 = center.links[elem.i];
                                    link2 = center.links[nextElem.i];
                                }
                                else {
                                    link0 = center.links[elem.i];
                                    link1 = center.links[elem.j];
                                }
                            }
                            else {
                                link0 = center.links[elem.i];
                                link1 = center.links[elem.j];
                            }
                            if (link2 == null) {
                                link0.opposites = [link1];
                                link1.opposites = [link0];
                                allAngleBetweenLinks = mathis.tab.arrayMinusElements(allAngleBetweenLinks, function (el) {
                                    return el.i == elem.i || el.j == elem.i || el.i == elem.j || el.j == elem.j;
                                });
                                valence -= 2;
                            }
                            else {
                                _this.OUT_nbBranching++;
                                allAngleBetweenLinks.pop();
                                link0.opposites = [link1, link2];
                                link1.opposites = [link0];
                                link2.opposites = [link0];
                                valence -= 1;
                                allAngleBetweenLinks = mathis.tab.arrayMinusElements(allAngleBetweenLinks, function (el) {
                                    return el.i == elem.i || el.j == elem.i || el.i == elem.j || el.j == elem.j || el.i == nextElem.i || el.j == nextElem.i || el.i == nextElem.j || el.j == nextElem.j;
                                });
                            }
                        }
                    }
                });
            };
            OppositeLinkAssocierByAngles.prototype.goChanging = function () {
                if (this.clearAllExistingOppositeBefore) {
                    this.vertices.forEach(function (v) {
                        v.links.forEach(function (li) {
                            li.opposites = null;
                        });
                    });
                }
                if (this.maxAngleToAssociateLinks != null)
                    this.associateOppositeLinks();
            };
            return OppositeLinkAssocierByAngles;
        }());
        linkModule.OppositeLinkAssocierByAngles = OppositeLinkAssocierByAngles;
        var LinkCreatorSorterAndBorderDetectorByPolygons = (function () {
            function LinkCreatorSorterAndBorderDetectorByPolygons(mamesh) {
                this.interiorTJonction = new mathis.HashMap();
                this.borderTJonction = new mathis.HashMap();
                this.forcedOpposite = new mathis.HashMap();
                this.polygonesAroundEachVertex = new mathis.HashMap();
                this.polygones = [];
                this.markIsolateVertexAsCorner = true;
                this.markBorder = true;
                this.forceOppositeLinksAtCorners = false;
                this.mamesh = mamesh;
            }
            LinkCreatorSorterAndBorderDetectorByPolygons.prototype.goChanging = function () {
                this.checkArgs();
                this.createPolygonesFromSmallestTrianglesAnSquares();
                this.detectBorder();
                this.createLinksTurningAround();
                this.makeLinksFinaly();
            };
            LinkCreatorSorterAndBorderDetectorByPolygons.prototype.checkArgs = function () {
                if ((this.mamesh.smallestSquares == null || this.mamesh.smallestSquares.length == 0) && (this.mamesh.smallestTriangles == null || this.mamesh.smallestTriangles.length == 0))
                    throw 'no triangles nor squares given';
                this.mamesh.clearLinksAndLines();
            };
            LinkCreatorSorterAndBorderDetectorByPolygons.prototype.createPolygonesFromSmallestTrianglesAnSquares = function () {
                var _this = this;
                for (var i = 0; i < this.mamesh.smallestTriangles.length; i += 3) {
                    this.polygones.push(new Polygone([
                        this.mamesh.smallestTriangles[i],
                        this.mamesh.smallestTriangles[i + 1],
                        this.mamesh.smallestTriangles[i + 2],
                    ]));
                }
                for (var i = 0; i < this.mamesh.smallestSquares.length; i += 4) {
                    this.polygones.push(new Polygone([
                        this.mamesh.smallestSquares[i],
                        this.mamesh.smallestSquares[i + 1],
                        this.mamesh.smallestSquares[i + 2],
                        this.mamesh.smallestSquares[i + 3],
                    ]));
                }
                for (var _i = 0, _a = this.polygones; _i < _a.length; _i++) {
                    var polygone = _a[_i];
                    var length_1 = polygone.points.length;
                    for (var i = 0; i < length_1; i++) {
                        var vert1 = polygone.points[i % length_1];
                        var vert2 = polygone.points[(i + 1) % length_1];
                        this.subdivideSegment(polygone, vert1, vert2, this.mamesh.cutSegmentsDico);
                    }
                }
                this.mamesh.vertices.forEach(function (v) {
                    _this.polygonesAroundEachVertex.putValue(v, new Array());
                });
                this.polygones.forEach(function (poly) {
                    poly.points.forEach(function (vert) {
                        _this.polygonesAroundEachVertex.getValue(vert).push(poly);
                    });
                });
                if (this.markIsolateVertexAsCorner) {
                    this.mamesh.vertices.forEach(function (v) {
                        if (_this.polygonesAroundEachVertex.getValue(v).length == 1) {
                            v.markers.push(mathis.Vertex.Markers.corner);
                            mathis.logger.c('new corners was added when we automatically create then links from the triangulatedRect/square');
                        }
                    });
                }
            };
            LinkCreatorSorterAndBorderDetectorByPolygons.prototype.detectBorder = function () {
                var _this = this;
                for (var ind = 0; ind < this.mamesh.vertices.length; ind++) {
                    var center = this.mamesh.vertices[ind];
                    var polygonesAround = this.polygonesAroundEachVertex.getValue(center);
                    var segmentMultiplicity = new mathis.HashMap(true);
                    for (var _i = 0, polygonesAround_1 = polygonesAround; _i < polygonesAround_1.length; _i++) {
                        var polygone = polygonesAround_1[_i];
                        var twoAngles = polygone.theTwoAnglesAdjacentFrom(center);
                        var side0id = twoAngles[0];
                        var side1id = twoAngles[1];
                        if (segmentMultiplicity.getValue(side0id) == null)
                            segmentMultiplicity.putValue(side0id, 1);
                        else
                            segmentMultiplicity.putValue(side0id, segmentMultiplicity.getValue(side0id) + 1);
                        if (segmentMultiplicity.getValue(side1id) == null)
                            segmentMultiplicity.putValue(side1id, 1);
                        else
                            segmentMultiplicity.putValue(side1id, segmentMultiplicity.getValue(side1id) + 1);
                    }
                    var count = 0;
                    segmentMultiplicity.allKeys().forEach(function (key) {
                        if (segmentMultiplicity.getValue(key) == 1) {
                            count++;
                            if (_this.borderTJonction.getValue(center) == null) {
                                _this.borderTJonction.putValue(center, new Array());
                                if (_this.markBorder)
                                    center.markers.push(mathis.Vertex.Markers.border);
                            }
                            _this.borderTJonction.getValue(center).push(key);
                        }
                        else if (segmentMultiplicity.getValue(key) > 2)
                            throw " non conform mesh: a link appear strictly more than 2 times as side of polygones turning around a vertex   ";
                    });
                    if (!(count == 0 || count == 2))
                        throw "strange mesh (perhaps too holy): the vertex: " + center.toString(0) + " has:" + count + " link with multiplicity 1";
                }
            };
            LinkCreatorSorterAndBorderDetectorByPolygons.prototype.createLinksTurningAround = function () {
                var _this = this;
                var doIi = function (v, vv) {
                    var cutSegment = _this.mamesh.cutSegmentsDico[mathis.Segment.segmentId(v.hashNumber, vv.hashNumber)];
                    if (cutSegment != null) {
                        if (_this.interiorTJonction.getValue(cutSegment.middle) != null) {
                            console.log('attention, une double interiorTjonction');
                        }
                        else
                            _this.interiorTJonction.putValue(cutSegment.middle, true);
                        _this.forcedOpposite.putValue(cutSegment.middle, [v, vv]);
                    }
                };
                for (var _i = 0, _a = this.polygones; _i < _a.length; _i++) {
                    var polygone = _a[_i];
                    var length_2 = polygone.points.length;
                    if (length_2 > 3) {
                        if (length_2 == 4) {
                            doIi(polygone.points[0], polygone.points[2]);
                            doIi(polygone.points[1], polygone.points[3]);
                        }
                        else {
                            for (var i = 0; i < length_2; i++) {
                                var v = polygone.points[i];
                                var vv = polygone.points[(i + 2) % length_2];
                                doIi(v, vv);
                            }
                        }
                    }
                }
                this.mamesh.vertices.forEach(function (central) {
                    var polygonesAround = _this.polygonesAroundEachVertex.getValue(central);
                    if (_this.borderTJonction.getValue(central) != null && _this.interiorTJonction.getValue(central) != null)
                        throw 'a vertex cannot be a interior and border T-jonction';
                    if (_this.borderTJonction.getValue(central) == null) {
                        var poly0 = polygonesAround[0];
                        if (poly0 == null)
                            mathis.logger.c('some vertex was not around a square/triangulatedRect');
                        else
                            _this.createLinksTurningFromOnePolygone(central, poly0, polygonesAround, false);
                    }
                    else {
                        var poly = _this.findAPolygoneWithOrientedEdge(central, _this.borderTJonction.getValue(central)[0], polygonesAround);
                        if (poly == null)
                            poly = _this.findAPolygoneWithOrientedEdge(central, _this.borderTJonction.getValue(central)[1], polygonesAround);
                        _this.createLinksTurningFromOnePolygone(central, poly, polygonesAround, true);
                    }
                });
            };
            LinkCreatorSorterAndBorderDetectorByPolygons.prototype.makeLinksFinaly = function () {
                var _this = this;
                this.mamesh.vertices.forEach(function (vertex) {
                    if (_this.forceOppositeLinksAtCorners || !vertex.hasMark(mathis.Vertex.Markers.corner)) {
                        var length_3 = vertex.links.length;
                        if (_this.borderTJonction.getValue(vertex) != null) {
                            var nei1 = vertex.links[0];
                            var nei2 = vertex.links[length_3 - 1];
                            nei1.opposites = [nei2];
                            nei2.opposites = [nei1];
                        }
                        else {
                            if (length_3 % 2 == 0) {
                                for (var i = 0; i < length_3; i++) {
                                    var nei1 = vertex.links[i];
                                    var nei2 = vertex.links[(i + length_3 / 2) % length_3];
                                    nei1.opposites = [nei2];
                                    nei2.opposites = [nei1];
                                }
                            }
                            if (_this.forcedOpposite.getValue(vertex) != null) {
                                var voi0 = _this.forcedOpposite.getValue(vertex)[0];
                                var voi1 = _this.forcedOpposite.getValue(vertex)[1];
                                vertex.changeToLinkWithoutOpposite(voi0);
                                vertex.changeToLinkWithoutOpposite(voi1);
                                vertex.setTwoOppositeLinks(voi0, voi1);
                            }
                        }
                    }
                });
            };
            LinkCreatorSorterAndBorderDetectorByPolygons.prototype.findAPolygoneWithOrientedEdge = function (vertDeb, vertFin, aList) {
                for (var _i = 0, aList_1 = aList; _i < aList_1.length; _i++) {
                    var polygone = aList_1[_i];
                    var length_4 = polygone.points.length;
                    for (var i = 0; i < length_4; i++) {
                        if (polygone.points[i % length_4].hashNumber == vertDeb.hashNumber && polygone.points[(i + 1) % length_4].hashNumber == vertFin.hashNumber)
                            return polygone;
                    }
                }
                return null;
            };
            LinkCreatorSorterAndBorderDetectorByPolygons.prototype.findAPolygoneWithThisEdge = function (vert1, vert2, aList) {
                for (var _i = 0, aList_2 = aList; _i < aList_2.length; _i++) {
                    var polygone = aList_2[_i];
                    var length_5 = polygone.points.length;
                    for (var i = 0; i < length_5; i++) {
                        var id = mathis.Segment.segmentId(polygone.points[i % length_5].hashNumber, polygone.points[(i + 1) % length_5].hashNumber);
                        var idBis = mathis.Segment.segmentId(vert1.hashNumber, vert2.hashNumber);
                        if (id == idBis)
                            return polygone;
                    }
                }
                return null;
            };
            LinkCreatorSorterAndBorderDetectorByPolygons.prototype.createLinksTurningFromOnePolygone = function (central, poly0, polygonesAround, isBorder) {
                var currentAngle = poly0.theOutgoingAnglesAdjacentFrom(central);
                var currentPolygone = poly0;
                var allIsWellOriented = true;
                while (polygonesAround.length > 0) {
                    central.links.push(new mathis.Link(currentAngle));
                    if (allIsWellOriented)
                        currentAngle = currentPolygone.theIngoingAnglesAdjacentFrom(central);
                    else {
                        var angles = currentPolygone.theTwoAnglesAdjacentFrom(central);
                        if (angles[0].hashNumber == currentAngle.hashNumber)
                            currentAngle = angles[1];
                        else
                            currentAngle = angles[0];
                    }
                    mathis.tab.removeFromArray(polygonesAround, currentPolygone);
                    currentPolygone = this.findAPolygoneWithOrientedEdge(central, currentAngle, polygonesAround);
                    if (currentPolygone == null) {
                        currentPolygone = this.findAPolygoneWithOrientedEdge(currentAngle, central, polygonesAround);
                        allIsWellOriented = false;
                    }
                }
                if (isBorder) {
                    central.links.push(new mathis.Link(currentAngle));
                }
            };
            LinkCreatorSorterAndBorderDetectorByPolygons.prototype.subdivideSegment = function (polygone, vertex1, vertex2, cutSegmentDico) {
                var segment = cutSegmentDico[mathis.Segment.segmentId(vertex1.hashNumber, vertex2.hashNumber)];
                if (segment != null) {
                    var index1 = polygone.points.indexOf(vertex1);
                    var index2 = polygone.points.indexOf(vertex2);
                    var minIndex = Math.min(index1, index2);
                    var maxIndex = Math.max(index1, index2);
                    if (maxIndex == polygone.points.length - 1 && minIndex == 0)
                        polygone.points.splice(length, 0, segment.middle);
                    else
                        polygone.points.splice(minIndex + 1, 0, segment.middle);
                    this.subdivideSegment(polygone, vertex1, segment.middle, cutSegmentDico);
                    this.subdivideSegment(polygone, vertex2, segment.middle, cutSegmentDico);
                }
            };
            return LinkCreatorSorterAndBorderDetectorByPolygons;
        }());
        linkModule.LinkCreatorSorterAndBorderDetectorByPolygons = LinkCreatorSorterAndBorderDetectorByPolygons;
        var Polygone = (function () {
            function Polygone(points) {
                this.points = points;
            }
            Polygone.prototype.hasAngle = function (point) {
                for (var _i = 0, _a = this.points; _i < _a.length; _i++) {
                    var vert = _a[_i];
                    if (vert.hashNumber == point.hashNumber)
                        return true;
                }
                return false;
            };
            Polygone.prototype.theOutgoingAnglesAdjacentFrom = function (point) {
                var length = this.points.length;
                for (var i = 0; i < length; i++) {
                    if (this.points[i] == point) {
                        return this.points[(i + 1) % length];
                    }
                }
                throw 'we do not find the point in this polygone';
            };
            Polygone.prototype.theIngoingAnglesAdjacentFrom = function (point) {
                var length = this.points.length;
                for (var i = 0; i < length; i++) {
                    if (this.points[i] == point) {
                        return this.points[(i - 1 + length) % length];
                    }
                }
                throw 'we do not find the point in this polygone';
            };
            Polygone.prototype.theTwoAnglesAdjacentFrom = function (point) {
                var length = this.points.length;
                for (var i = 0; i < length; i++) {
                    if (this.points[i] == point) {
                        return [this.points[(i - 1 + length) % length], this.points[(i + 1) % length]];
                    }
                }
                throw 'we do not find the point in this polygone';
            };
            Polygone.prototype.toString = function () {
                var res = "[";
                for (var _i = 0, _a = this.points; _i < _a.length; _i++) {
                    var vertex = _a[_i];
                    res += vertex.hashNumber + ',';
                }
                return res + "]";
            };
            return Polygone;
        }());
        linkModule.Polygone = Polygone;
    })(linkModule = mathis.linkModule || (mathis.linkModule = {}));
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    var mameshAroundComputations;
    (function (mameshAroundComputations) {
        var PositioningComputerForMameshVertices = (function () {
            function PositioningComputerForMameshVertices(mamesh) {
                this.attractionOfTangent = new mathis.XYZ(1, 0.0123456721, 0.00078654343);
                this.computeTangent = true;
                this.computeNormal = true;
                this.computeSizes = true;
                this.sizesProp = new mathis.XYZ(0.3, 0.3, 0.3);
                this.allVerticesHaveSameSizes = false;
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
                        if (-smallerDotProduct > 2 * greaterDotProduct)
                            res.getValue(vertex).frontDir.copyFrom(worstDirection.scale(-1));
                        else
                            res.getValue(vertex).frontDir.copyFrom(bestDirection);
                    });
                }
                if (this.computeNormal) {
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
                            mean.add(res.getValue(v).upVector);
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
var mathis;
(function (mathis) {
    var mameshModification;
    (function (mameshModification) {
        function completSegment(newParamForMiddle, mamesh, segment, orthogonalVertex) {
            if (segment.middle == null) {
                var position = new mathis.XYZ(0, 0, 0);
                mathis.geo.between(segment.a.position, segment.b.position, 0.5, position);
                segment.middle = mamesh.newVertex(position, Math.max(segment.a.dichoLevel, segment.b.dichoLevel) + 1, newParamForMiddle(segment.a.param, segment.b.param));
                if (segment.a.hasMark(mathis.Vertex.Markers.border) && segment.b.hasMark(mathis.Vertex.Markers.border))
                    segment.middle.markers.push(mathis.Vertex.Markers.border);
                if (orthogonalVertex != null)
                    segment.orth1 = orthogonalVertex;
            }
            else if (orthogonalVertex != null)
                segment.orth2 = orthogonalVertex;
        }
        var TriangleDichotomer = (function () {
            function TriangleDichotomer(mamesh) {
                this.makeLinks = true;
                this.trianglesToCut = null;
                this.nbDicho = 1;
                this.newParamForMiddle = function (p1, p2) {
                    var res = new mathis.XYZ(0, 0, 0);
                    mathis.geo.between(p1, p2, 1 / 2, res);
                    return res;
                };
                this.mamesh = mamesh;
            }
            TriangleDichotomer.prototype.checkArgs = function () {
                if (this.mamesh.smallestTriangles.length == 0)
                    mathis.logger.c('no triangulatedRect for triangulatedRect dichotomy');
            };
            TriangleDichotomer.prototype.go = function () {
                this.checkArgs();
                if (!this.makeLinks)
                    this.mamesh.clearLinksAndLines();
                var newTriangles;
                if (this.trianglesToCut == null) {
                    this.trianglesToCut = this.mamesh.smallestTriangles;
                    newTriangles = new Array();
                }
                else {
                    newTriangles = new mathis.tab.ArrayMinusBlocksElements(this.mamesh.smallestTriangles, 3, this.trianglesToCut).go();
                }
                var segments = this.createAndAddSegmentsFromTriangles(this.trianglesToCut);
                for (var f = 0; f < this.trianglesToCut.length; f += 3) {
                    var v1 = this.trianglesToCut[f];
                    var v2 = this.trianglesToCut[f + 1];
                    var v3 = this.trianglesToCut[f + 2];
                    var segment3 = segments[mathis.Segment.segmentId(v1.hashNumber, v2.hashNumber)];
                    var segment1 = segments[mathis.Segment.segmentId(v2.hashNumber, v3.hashNumber)];
                    var segment2 = segments[mathis.Segment.segmentId(v3.hashNumber, v1.hashNumber)];
                    if (this.makeLinks) {
                        completSegment(this.newParamForMiddle, this.mamesh, segment3, v3);
                        completSegment(this.newParamForMiddle, this.mamesh, segment1, v1);
                        completSegment(this.newParamForMiddle, this.mamesh, segment2, v2);
                    }
                    else {
                        completSegment(this.newParamForMiddle, this.mamesh, segment3);
                        completSegment(this.newParamForMiddle, this.mamesh, segment1);
                        completSegment(this.newParamForMiddle, this.mamesh, segment2);
                    }
                    var f3 = segment3.middle;
                    var f1 = segment1.middle;
                    var f2 = segment2.middle;
                    newTriangles.push(v1, f3, f2);
                    newTriangles.push(v2, f1, f3);
                    newTriangles.push(v3, f2, f1);
                    newTriangles.push(f3, f1, f2);
                }
                if (this.makeLinks) {
                    for (var segId in segments) {
                        var segment = segments[segId];
                        var segA1 = segments[mathis.Segment.segmentId(segment.a.hashNumber, segment.orth1.hashNumber)];
                        var segB1 = segments[mathis.Segment.segmentId(segment.b.hashNumber, segment.orth1.hashNumber)];
                        if (segment.orth2 != null) {
                            var segA2 = segments[mathis.Segment.segmentId(segment.a.hashNumber, segment.orth2.hashNumber)];
                            var segB2 = segments[mathis.Segment.segmentId(segment.b.hashNumber, segment.orth2.hashNumber)];
                            segment.middle.setTwoOppositeLinks(segA1.middle, segB2.middle);
                            segment.middle.setTwoOppositeLinks(segA2.middle, segB1.middle);
                        }
                        else {
                            segment.middle.setOneLink(segA1.middle);
                            segment.middle.setOneLink(segB1.middle);
                        }
                        try {
                            var changeFleArrival = function (v, old, newVoi) {
                                var fle = v.findLink(old);
                                fle.to = newVoi;
                            };
                            changeFleArrival(segment.a, segment.b, segment.middle);
                            changeFleArrival(segment.b, segment.a, segment.middle);
                            segment.middle.setTwoOppositeLinks(segment.a, segment.b);
                        }
                        catch (e) {
                            throw 'a bad segment, probably your triangles are not corrects (e.g. one missing, or one more)';
                        }
                    }
                }
                this.mamesh.smallestTriangles = newTriangles;
            };
            TriangleDichotomer.prototype.createAndAddSegmentsFromTriangles = function (triangles) {
                var segments = {};
                for (var f = 0; f < triangles.length; f += 3) {
                    var v1 = triangles[f];
                    var v2 = triangles[f + 1];
                    var v3 = triangles[f + 2];
                    this.mamesh.getOrCreateSegment(v1, v2, segments);
                    this.mamesh.getOrCreateSegment(v2, v3, segments);
                    this.mamesh.getOrCreateSegment(v3, v1, segments);
                }
                return segments;
            };
            return TriangleDichotomer;
        }());
        mameshModification.TriangleDichotomer = TriangleDichotomer;
        var SquareDichotomer = (function () {
            function SquareDichotomer(mamesh) {
                this.makeLinks = true;
                this.squareToCut = null;
                this.dichoStyle = SquareDichotomer.DichoStyle.fourSquares;
                this.newParamForMiddle = function (p1, p2) {
                    var res = new mathis.XYZ(0, 0, 0);
                    mathis.geo.between(p1, p2, 1 / 2, res);
                    return res;
                };
                this.newParamForCenter = function (p1, p2, p3, p4) {
                    var res = new mathis.XYZ(0, 0, 0);
                    mathis.geo.baryCenter([p1, p2, p3, p4], [1 / 4, 1 / 4, 1 / 4, 1 / 4], res);
                    return res;
                };
                this.mamesh = mamesh;
            }
            SquareDichotomer.prototype.checkArgs = function () {
                if (this.mamesh.smallestSquares.length == 0)
                    throw 'no square for square dichotomy';
                this.mamesh.clearLinksAndLines();
            };
            SquareDichotomer.prototype.go = function () {
                this.checkArgs();
                var newSquares;
                if (this.squareToCut == null) {
                    this.squareToCut = this.mamesh.smallestSquares;
                    newSquares = new Array();
                }
                else {
                    newSquares = new mathis.tab.ArrayMinusBlocksElements(this.mamesh.smallestSquares, 4, this.squareToCut).go();
                }
                var segments = this.createAndAddSegmentsFromSquare(this.squareToCut);
                for (var f = 0; f < this.squareToCut.length; f += 4) {
                    var v1 = this.squareToCut[f];
                    var v2 = this.squareToCut[f + 1];
                    var v3 = this.squareToCut[f + 2];
                    var v4 = this.squareToCut[f + 3];
                    var segment1 = segments[mathis.Segment.segmentId(v1.hashNumber, v2.hashNumber)];
                    var segment2 = segments[mathis.Segment.segmentId(v2.hashNumber, v3.hashNumber)];
                    var segment3 = segments[mathis.Segment.segmentId(v3.hashNumber, v4.hashNumber)];
                    var segment4 = segments[mathis.Segment.segmentId(v4.hashNumber, v1.hashNumber)];
                    completSegment(this.newParamForMiddle, this.mamesh, segment1);
                    completSegment(this.newParamForMiddle, this.mamesh, segment2);
                    completSegment(this.newParamForMiddle, this.mamesh, segment3);
                    completSegment(this.newParamForMiddle, this.mamesh, segment4);
                    var f1 = segment1.middle;
                    var f2 = segment2.middle;
                    var f3 = segment3.middle;
                    var f4 = segment4.middle;
                    if (this.dichoStyle == SquareDichotomer.DichoStyle.fourSquares) {
                        var position = new mathis.XYZ(0, 0, 0);
                        mathis.geo.baryCenter([segment1.a.position, segment1.b.position, segment3.a.position, segment3.b.position], [1 / 4, 1 / 4, 1 / 4, 1 / 4], position);
                        var dichoLevel = Math.max(segment1.a.dichoLevel, segment1.b.dichoLevel, segment3.a.dichoLevel, segment3.b.dichoLevel) + 1;
                        var center = this.mamesh.newVertex(position, dichoLevel, this.newParamForCenter(segment1.a.param, segment1.b.param, segment3.a.param, segment3.b.param));
                        var aNewCetSegment = new mathis.Segment(f1, f3);
                        aNewCetSegment.middle = center;
                        this.mamesh.cutSegmentsDico[mathis.Segment.segmentId(f1.hashNumber, f3.hashNumber)] = aNewCetSegment;
                        newSquares.push(v1, f1, center, f4);
                        newSquares.push(v2, f2, center, f1);
                        newSquares.push(v3, f3, center, f2);
                        newSquares.push(v4, f4, center, f3);
                    }
                    else if (this.dichoStyle == SquareDichotomer.DichoStyle.fourTriangles) {
                        newSquares.push(f1, f2, f3, f4);
                        this.mamesh.smallestTriangles.push(v1, f1, f4);
                        this.mamesh.smallestTriangles.push(v2, f2, f1);
                        this.mamesh.smallestTriangles.push(v3, f3, f2);
                        this.mamesh.smallestTriangles.push(v4, f4, f3);
                    }
                    else
                        throw 'ho ho';
                }
                this.mamesh.smallestSquares = newSquares;
                if (this.makeLinks) {
                    var linker = new mathis.linkModule.LinkCreatorSorterAndBorderDetectorByPolygons(this.mamesh);
                    linker.goChanging();
                }
            };
            SquareDichotomer.prototype.createAndAddSegmentsFromSquare = function (squares) {
                var segments = {};
                for (var f = 0; f < squares.length; f += 4) {
                    var v1 = squares[f];
                    var v2 = squares[f + 1];
                    var v3 = squares[f + 2];
                    var v4 = squares[f + 3];
                    this.mamesh.getOrCreateSegment(v1, v2, segments);
                    this.mamesh.getOrCreateSegment(v2, v3, segments);
                    this.mamesh.getOrCreateSegment(v3, v4, segments);
                    this.mamesh.getOrCreateSegment(v4, v1, segments);
                }
                return segments;
            };
            return SquareDichotomer;
        }());
        mameshModification.SquareDichotomer = SquareDichotomer;
        var SimplestSquareDichotomer = (function () {
            function SimplestSquareDichotomer(mamesh) {
                this.makeLinks = true;
                this.squareToCut = null;
                this.dichoStyle = SquareDichotomer.DichoStyle.fourSquares;
                this.newParamForMiddle = function (p1, p2) {
                    var res = new mathis.XYZ(0, 0, 0);
                    mathis.geo.between(p1, p2, 1 / 2, res);
                    return res;
                };
                this.newParamForCenter = function (p1, p2, p3, p4) {
                    var res = new mathis.XYZ(0, 0, 0);
                    mathis.geo.baryCenter([p1, p2, p3, p4], [1 / 4, 1 / 4, 1 / 4, 1 / 4], res);
                    return res;
                };
                this.mamesh = mamesh;
            }
            SimplestSquareDichotomer.prototype.checkArgs = function () {
                if (this.mamesh.smallestSquares.length == 0)
                    throw 'no square for square dichotomy';
                this.mamesh.clearLinksAndLines();
            };
            SimplestSquareDichotomer.prototype.go = function () {
                this.checkArgs();
                var newSquares;
                if (this.squareToCut == null) {
                    this.squareToCut = this.mamesh.smallestSquares;
                    newSquares = new Array();
                }
                else {
                    newSquares = new mathis.tab.ArrayMinusBlocksElements(this.mamesh.smallestSquares, 4, this.squareToCut).go();
                }
                var segments = this.createAndAddSegmentsFromSquare(this.squareToCut);
                for (var f = 0; f < this.squareToCut.length; f += 4) {
                    var v1 = this.squareToCut[f];
                    var v2 = this.squareToCut[f + 1];
                    var v3 = this.squareToCut[f + 2];
                    var v4 = this.squareToCut[f + 3];
                    var segment1 = segments[mathis.Segment.segmentId(v1.hashNumber, v2.hashNumber)];
                    var segment2 = segments[mathis.Segment.segmentId(v2.hashNumber, v3.hashNumber)];
                    var segment3 = segments[mathis.Segment.segmentId(v3.hashNumber, v4.hashNumber)];
                    var segment4 = segments[mathis.Segment.segmentId(v4.hashNumber, v1.hashNumber)];
                    completSegment(this.newParamForMiddle, this.mamesh, segment1);
                    completSegment(this.newParamForMiddle, this.mamesh, segment2);
                    completSegment(this.newParamForMiddle, this.mamesh, segment3);
                    completSegment(this.newParamForMiddle, this.mamesh, segment4);
                    var f1 = segment1.middle;
                    var f2 = segment2.middle;
                    var f3 = segment3.middle;
                    var f4 = segment4.middle;
                    if (this.dichoStyle == SquareDichotomer.DichoStyle.fourSquares) {
                        var position = new mathis.XYZ(0, 0, 0);
                        mathis.geo.baryCenter([segment1.a.position, segment1.b.position, segment3.a.position, segment3.b.position], [1 / 4, 1 / 4, 1 / 4, 1 / 4], position);
                        var dichoLevel = Math.max(segment1.a.dichoLevel, segment1.b.dichoLevel, segment3.a.dichoLevel, segment3.b.dichoLevel) + 1;
                        var center = this.mamesh.newVertex(position, dichoLevel, this.newParamForCenter(segment1.a.param, segment1.b.param, segment3.a.param, segment3.b.param));
                        var aNewCetSegment = new mathis.Segment(f1, f3);
                        aNewCetSegment.middle = center;
                        this.mamesh.cutSegmentsDico[mathis.Segment.segmentId(f1.hashNumber, f3.hashNumber)] = aNewCetSegment;
                        newSquares.push(v1, f1, center, f4);
                        newSquares.push(v2, f2, center, f1);
                        newSquares.push(v3, f3, center, f2);
                        newSquares.push(v4, f4, center, f3);
                    }
                    else if (this.dichoStyle == SquareDichotomer.DichoStyle.fourTriangles) {
                        newSquares.push(f1, f2, f3, f4);
                        this.mamesh.smallestTriangles.push(v1, f1, f4);
                        this.mamesh.smallestTriangles.push(v2, f2, f1);
                        this.mamesh.smallestTriangles.push(v3, f3, f2);
                        this.mamesh.smallestTriangles.push(v4, f4, f3);
                    }
                    else
                        throw 'ho ho';
                }
                this.mamesh.smallestSquares = newSquares;
                if (this.makeLinks) {
                    var linker = new mathis.linkModule.LinkCreatorSorterAndBorderDetectorByPolygons(this.mamesh);
                    linker.goChanging();
                }
            };
            SimplestSquareDichotomer.prototype.createAndAddSegmentsFromSquare = function (squares) {
                var segments = {};
                for (var f = 0; f < squares.length; f += 4) {
                    var v1 = squares[f];
                    var v2 = squares[f + 1];
                    var v3 = squares[f + 2];
                    var v4 = squares[f + 3];
                    this.mamesh.getOrCreateSegment(v1, v2, segments);
                    this.mamesh.getOrCreateSegment(v2, v3, segments);
                    this.mamesh.getOrCreateSegment(v3, v4, segments);
                    this.mamesh.getOrCreateSegment(v4, v1, segments);
                }
                return segments;
            };
            return SimplestSquareDichotomer;
        }());
        mameshModification.SimplestSquareDichotomer = SimplestSquareDichotomer;
        (function (SquareDichotomer) {
            var DichoStyle;
            (function (DichoStyle) {
                DichoStyle[DichoStyle["fourSquares"] = 0] = "fourSquares";
                DichoStyle[DichoStyle["fourTriangles"] = 1] = "fourTriangles";
            })(DichoStyle = SquareDichotomer.DichoStyle || (SquareDichotomer.DichoStyle = {}));
        })(SquareDichotomer = mameshModification.SquareDichotomer || (mameshModification.SquareDichotomer = {}));
        var HexahedronSubdivider = (function () {
            function HexahedronSubdivider(mamesh) {
                this.subdivider = 3;
                this.hexahedronsToCut = null;
                this.suppressVolumes = null;
                this.createdPointsPerSegment = {};
                this.createdPointsPerSurface = {};
                this.newHexahedrons = null;
                this.points = null;
                this.mamesh = mamesh;
            }
            HexahedronSubdivider.prototype.checkArgs = function () {
                if ((this.hexahedronsToCut == null && this.mamesh.hexahedrons.length == 0) ||
                    (this.hexahedronsToCut != null && this.hexahedronsToCut.length == 0))
                    mathis.logger.c("HexahedronSubdivider : No input");
            };
            HexahedronSubdivider.prototype.go = function () {
                this.checkArgs();
                if (this.hexahedronsToCut == null)
                    this.hexahedronsToCut = this.mamesh.hexahedrons;
                this.points = new Array(this.subdivider + 1);
                for (var i = 0; i <= this.subdivider; i++) {
                    this.points[i] = new Array(this.subdivider + 1);
                    for (var j = 0; j <= this.subdivider; j++)
                        this.points[i][j] = new Array(this.subdivider + 1);
                }
                this.subdivideHexahedrons();
            };
            HexahedronSubdivider.prototype.subdivideHexahedronInVertices = function (h) {
                var _this = this;
                var n = this.subdivider;
                var coordsList = [[0, 0, 0], [n, 0, 0], [n, 0, n], [0, 0, n], [0, n, n], [0, n, 0], [n, n, 0], [n, n, n]];
                coordsList.forEach(function (_a, l) {
                    var i = _a[0], j = _a[1], k = _a[2];
                    _this.points[i][j][k] = _this.hexahedronsToCut[h + l];
                });
                var segmentList = [[0, 1], [1, 2], [2, 3], [3, 0],
                    [0, 5], [1, 6], [2, 7], [3, 4],
                    [4, 5], [5, 6], [6, 7], [7, 4]];
                for (var _i = 0, segmentList_1 = segmentList; _i < segmentList_1.length; _i++) {
                    var _a = segmentList_1[_i], na = _a[0], nb = _a[1];
                    var el = mathis.Hash.segment(this.hexahedronsToCut[h + na], this.hexahedronsToCut[h + nb]);
                    if (this.hexahedronsToCut[h + na].hashNumber > this.hexahedronsToCut[h + nb].hashNumber)
                        _b = [nb, na], na = _b[0], nb = _b[1];
                    var _c = coordsList[na], i1 = _c[0], j1 = _c[1], k1 = _c[2];
                    var _d = coordsList[nb], i2 = _d[0], j2 = _d[1], k2 = _d[2];
                    for (var l = 1; l < n; l++)
                        this.points[i1 + (i2 - i1) / n * l][j1 + (j2 - j1) / n * l][k1 + (k2 - k1) / n * l] = this.createdPointsPerSegment[el][l];
                }
                var surfacesList = [[0, 1, 2, 3], [4, 7, 6, 5],
                    [0, 3, 4, 5], [1, 6, 7, 2],
                    [2, 7, 4, 3], [0, 5, 6, 1]];
                for (var _e = 0, surfacesList_1 = surfacesList; _e < surfacesList_1.length; _e++) {
                    var _f = surfacesList_1[_e], na = _f[0], nb = _f[1], nc = _f[2], nd = _f[3];
                    var el = mathis.Hash.quad(this.hexahedronsToCut[h + na], this.hexahedronsToCut[h + nb], this.hexahedronsToCut[h + nc], this.hexahedronsToCut[h + nd]);
                    while (this.hexahedronsToCut[h + na].hashNumber > this.hexahedronsToCut[h + nb].hashNumber ||
                        this.hexahedronsToCut[h + na].hashNumber > this.hexahedronsToCut[h + nc].hashNumber ||
                        this.hexahedronsToCut[h + na].hashNumber > this.hexahedronsToCut[h + nd].hashNumber)
                        _g = [nb, nc, nd, na], na = _g[0], nb = _g[1], nc = _g[2], nd = _g[3];
                    if (this.hexahedronsToCut[h + nb].hashNumber > this.hexahedronsToCut[h + nd].hashNumber)
                        _h = [nd, nb], nb = _h[0], nd = _h[1];
                    var _j = coordsList[na], i1 = _j[0], j1 = _j[1], k1 = _j[2];
                    var _k = coordsList[nb], i2 = _k[0], j2 = _k[1], k2 = _k[2];
                    var _l = coordsList[nc], i3 = _l[0], j3 = _l[1], k3 = _l[2];
                    for (var l = 1; l < n; l++)
                        for (var m = 1; m < n; m++)
                            this.points[i1 + (i2 - i1) / n * l + (i3 - i2) / n * m][j1 + (j2 - j1) / n * l + (j3 - j2) / n * m][k1 + (k2 - k1) / n * l + (k3 - k2) / n * m] = this.createdPointsPerSurface[el][l][m];
                }
                for (var i = 1; i < n; i++) {
                    for (var j = 1; j < n; j++) {
                        for (var k = 1; k < n; k++) {
                            var pos = new mathis.XYZ(0, 0, 0);
                            var x = i / n;
                            var y = j / n;
                            var z = k / n;
                            mathis.geo.baryCenter([this.hexahedronsToCut[h].position, this.hexahedronsToCut[h + 1].position,
                                this.hexahedronsToCut[h + 2].position, this.hexahedronsToCut[h + 3].position,
                                this.hexahedronsToCut[h + 4].position, this.hexahedronsToCut[h + 5].position,
                                this.hexahedronsToCut[h + 6].position, this.hexahedronsToCut[h + 7].position], [(1 - x) * (1 - y) * (1 - z), x * (1 - y) * (1 - z),
                                x * (1 - y) * z, (1 - x) * (1 - y) * z,
                                (1 - x) * y * z, (1 - x) * y * (1 - z),
                                x * y * (1 - z), x * y * z], pos);
                            this.points[i][j][k] = this.mamesh.newVertex(pos);
                        }
                    }
                }
                var _b, _g, _h;
            };
            HexahedronSubdivider.prototype.makeNewHexahedronsFromPoints = function () {
                if (this.suppressVolumes == null)
                    this.suppressVolumes = [];
                var n = this.subdivider;
                var _loop_1 = function (i) {
                    var _loop_2 = function (j) {
                        var _loop_3 = function (k) {
                            if (this_1.suppressVolumes.some(function (value) {
                                return value[0] == i && value[1] == j && value[2] == k;
                            }))
                                return "continue";
                            this_1.newHexahedrons.push.apply(this_1.newHexahedrons, [this_1.points[i][j][k], this_1.points[i + 1][j][k],
                                this_1.points[i + 1][j][k + 1], this_1.points[i][j][k + 1],
                                this_1.points[i][j + 1][k + 1], this_1.points[i][j + 1][k],
                                this_1.points[i + 1][j + 1][k], this_1.points[i + 1][j + 1][k + 1]]);
                        };
                        for (var k = 0; k < n; k++) {
                            _loop_3(k);
                        }
                    };
                    for (var j = 0; j < n; j++) {
                        _loop_2(j);
                    }
                };
                var this_1 = this;
                for (var i = 0; i < n; i++) {
                    _loop_1(i);
                }
            };
            HexahedronSubdivider.prototype.makeSurfacesVertices = function () {
                var list = [[0, 1, 2, 3], [4, 7, 6, 5],
                    [0, 3, 4, 5], [1, 6, 7, 2],
                    [2, 7, 4, 3], [0, 5, 6, 1]];
                for (var h = 0; h < this.hexahedronsToCut.length; h += 8) {
                    for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
                        var _a = list_1[_i], i = _a[0], j = _a[1], k = _a[2], l = _a[3];
                        if (this.createdPointsPerSurface[mathis.Hash.quad(this.hexahedronsToCut[h + i], this.hexahedronsToCut[h + j], this.hexahedronsToCut[h + k], this.hexahedronsToCut[h + l])] == null)
                            this.createdPointsPerSurface[mathis.Hash.quad(this.hexahedronsToCut[h + i], this.hexahedronsToCut[h + j], this.hexahedronsToCut[h + k], this.hexahedronsToCut[h + l])] =
                                this.subdivideSurface(this.hexahedronsToCut[h + i], this.hexahedronsToCut[h + j], this.hexahedronsToCut[h + k], this.hexahedronsToCut[h + l]);
                    }
                }
            };
            HexahedronSubdivider.prototype.makeSegmentsVertices = function () {
                var list = [[0, 1], [1, 2], [2, 3], [3, 0],
                    [0, 5], [1, 6], [2, 7], [3, 4],
                    [4, 5], [5, 6], [6, 7], [7, 4]];
                for (var k = 0; k < this.hexahedronsToCut.length; k += 8) {
                    for (var _i = 0, list_2 = list; _i < list_2.length; _i++) {
                        var _a = list_2[_i], i = _a[0], j = _a[1];
                        if (this.createdPointsPerSegment[mathis.Hash.segment(this.hexahedronsToCut[k + i], this.hexahedronsToCut[k + j])] == null)
                            this.createdPointsPerSegment[mathis.Hash.segment(this.hexahedronsToCut[k + i], this.hexahedronsToCut[k + j])] =
                                this.subdivideSegment(this.hexahedronsToCut[k + i], this.hexahedronsToCut[k + j]);
                    }
                }
            };
            HexahedronSubdivider.prototype.subdivideSegment = function (a, b) {
                _a = mathis.Hash.segmentOrd(a, b), a = _a[0], b = _a[1];
                var vertices = [];
                var n = this.subdivider;
                for (var i = 1; i < n; i++) {
                    var pos = new mathis.XYZ(0, 0, 0);
                    var x = i / n;
                    mathis.geo.baryCenter([a.position, b.position], [1 - x, x], pos);
                    vertices[i] = this.mamesh.newVertex(pos);
                }
                return vertices;
                var _a;
            };
            HexahedronSubdivider.prototype.subdivideSurface = function (a, b, c, d) {
                _a = mathis.Hash.quadOrd(a, b, c, d), a = _a[0], b = _a[1], c = _a[2], d = _a[3];
                var vertices = [];
                var n = this.subdivider;
                for (var i = 1; i < n; i++) {
                    vertices[i] = [];
                    for (var j = 1; j < n; j++) {
                        var pos = new mathis.XYZ(0, 0, 0);
                        var _b = [j / n, i / n], x = _b[0], y = _b[1];
                        mathis.geo.baryCenter([a.position, b.position, c.position, d.position], [(1 - x) * (1 - y), x * (1 - y), x * y, (1 - x) * y], pos);
                        vertices[i][j] = this.mamesh.newVertex(pos);
                    }
                }
                return vertices;
                var _a;
            };
            HexahedronSubdivider.prototype.subdivideHexahedrons = function () {
                this.makeSegmentsVertices();
                this.makeSurfacesVertices();
                var s = this.hexahedronsToCut.length / 8;
                this.newHexahedrons = [];
                for (var i = 0; i < s; i++) {
                    this.subdivideHexahedronInVertices(i * 8);
                    this.makeNewHexahedronsFromPoints();
                }
            };
            return HexahedronSubdivider;
        }());
        mameshModification.HexahedronSubdivider = HexahedronSubdivider;
        var SurfacesFromHexahedrons = (function () {
            function SurfacesFromHexahedrons(mamesh) {
                this.hexahedronsToDraw = null;
                this.newSurfaces = null;
                this.surfacesSet = {};
                this.mamesh = mamesh;
            }
            SurfacesFromHexahedrons.prototype.checkArgs = function () {
                if ((this.hexahedronsToDraw == null && (this.mamesh.hexahedrons == null || this.mamesh.hexahedrons.length == 0))
                    || (this.hexahedronsToDraw != null && this.hexahedronsToDraw.length == 0))
                    mathis.logger.c("SurfacesFromHexahedrons : No input");
            };
            SurfacesFromHexahedrons.prototype.go = function () {
                this.checkArgs();
                if (this.hexahedronsToDraw == null)
                    this.hexahedronsToDraw = this.mamesh.hexahedrons;
                var surfacesList = [[0, 3, 2, 1], [4, 5, 6, 7],
                    [0, 5, 4, 3], [1, 2, 7, 6],
                    [2, 3, 4, 7], [0, 1, 6, 5]];
                this.newSurfaces = [];
                for (var h = 0; h < this.hexahedronsToDraw.length; h += 8) {
                    for (var _i = 0, surfacesList_2 = surfacesList; _i < surfacesList_2.length; _i++) {
                        var _a = surfacesList_2[_i], i = _a[0], j = _a[1], k = _a[2], l = _a[3];
                        var hash = mathis.Hash.quad(this.hexahedronsToDraw[h + i], this.hexahedronsToDraw[h + j], this.hexahedronsToDraw[h + k], this.hexahedronsToDraw[h + l]);
                        if (this.surfacesSet[hash] == null)
                            this.surfacesSet[hash] = [this.hexahedronsToDraw[h + i], this.hexahedronsToDraw[h + j],
                                this.hexahedronsToDraw[h + k], this.hexahedronsToDraw[h + l]];
                        else
                            delete this.surfacesSet[hash];
                    }
                }
                for (var el in this.surfacesSet)
                    this.newSurfaces.push.apply(this.newSurfaces, this.surfacesSet[el]);
                var len = this.newSurfaces.length;
                for (var i = 0; i < len; i += 5000)
                    this.mamesh.smallestSquares.push.apply(this.mamesh.smallestSquares, this.newSurfaces.slice(i, i + 5000));
            };
            return SurfacesFromHexahedrons;
        }());
        mameshModification.SurfacesFromHexahedrons = SurfacesFromHexahedrons;
        var MameshDeepCopier = (function () {
            function MameshDeepCopier(oldMamesh) {
                this.copyCutSegmentsDico = true;
                this.copyLines = true;
                this.oldMamesh = oldMamesh;
            }
            MameshDeepCopier.prototype.go = function () {
                var o2n = new mathis.HashMap();
                var newMamesh = new mathis.Mamesh();
                this.oldMamesh.vertices.forEach(function (oldV) {
                    var param = mathis.XYZ.newFrom(oldV.param);
                    var newVertex = newMamesh.newVertex(oldV.position, oldV.dichoLevel, param);
                    o2n.putValue(oldV, newVertex);
                    newVertex.importantMarker = oldV.importantMarker;
                    oldV.markers.forEach(function (enu) { return newVertex.markers.push(enu); });
                });
                this.oldMamesh.vertices.forEach(function (oldV) {
                    var newV = o2n.getValue(oldV);
                    for (var i = 0; i < oldV.links.length; i++) {
                        newV.links[i] = new mathis.Link(o2n.getValue(oldV.links[i].to));
                    }
                    for (var i = 0; i < oldV.links.length; i++) {
                        var oldLink = oldV.links[i];
                        var newLink = newV.links[i];
                        if (oldLink.opposites != null) {
                            newLink.opposites = [];
                            for (var _i = 0, _a = oldLink.opposites; _i < _a.length; _i++) {
                                var li = _a[_i];
                                var liIndex = oldV.links.indexOf(li);
                                newLink.opposites.push(newV.links[liIndex]);
                            }
                        }
                    }
                });
                this.oldMamesh.smallestTriangles.forEach(function (v) {
                    newMamesh.smallestTriangles.push(o2n.getValue(v));
                });
                this.oldMamesh.smallestSquares.forEach(function (v) {
                    newMamesh.smallestSquares.push(o2n.getValue(v));
                });
                if (this.copyLines) {
                    if (this.oldMamesh.linesWasMade) {
                        var oldStraight = this.oldMamesh.getStraightLinesAsVertices();
                        var oldLoop = this.oldMamesh.getLoopLinesAsVertices();
                        newMamesh.lines = [];
                        oldStraight.forEach(function (line) {
                            var newLine = [];
                            line.forEach(function (v) {
                                newLine.push(o2n.getValue(v));
                            });
                            newMamesh.lines.push(new mathis.Line(newLine, false));
                        });
                        oldLoop.forEach(function (line) {
                            var newLine = [];
                            line.forEach(function (v) {
                                newLine.push(o2n.getValue(v));
                            });
                            newMamesh.lines.push(new mathis.Line(newLine, true));
                        });
                    }
                }
                if (this.copyCutSegmentsDico) {
                    for (var key in this.oldMamesh.cutSegmentsDico) {
                        var oldSegment = this.oldMamesh.cutSegmentsDico[key];
                        var newA = o2n.getValue(oldSegment.a);
                        var newB = o2n.getValue(oldSegment.b);
                        var newSegment = new mathis.Segment(newA, newB);
                        newSegment.middle = o2n.getValue(oldSegment.middle);
                        if (oldSegment.orth1 != null)
                            newSegment.orth1 = o2n.getValue(oldSegment.orth1);
                        if (oldSegment.orth2 != null)
                            newSegment.orth2 = o2n.getValue(oldSegment.orth2);
                        newMamesh.cutSegmentsDico[mathis.Segment.segmentId(newA.hashNumber, newB.hashNumber)] = newSegment;
                    }
                }
                else
                    this.copyCutSegmentsDico = null;
                return newMamesh;
            };
            return MameshDeepCopier;
        }());
        mameshModification.MameshDeepCopier = MameshDeepCopier;
        var PercolationOnLinks = (function () {
            function PercolationOnLinks(mameshOrVertices) {
                var _this = this;
                this.percolationProba = 0.5;
                this.probaToPercolateFunction = function (vertex) {
                    if (vertex.links.length == 3)
                        return 0;
                    if (vertex.links.length == 4)
                        return 0.3 * _this.percolationProba;
                    if (vertex.links.length == 5)
                        return 0.6 * _this.percolationProba;
                    if (vertex.links.length >= 6)
                        return _this.percolationProba;
                };
                this.SUB_random = new mathis.proba.Random();
                this.doNotPercolateOnBorder = true;
                this.maxPercolationForAVertexAlreadyPercolate = 0;
                if (mameshOrVertices instanceof mathis.Mamesh) {
                    this.IN_vertices = mameshOrVertices.vertices;
                }
                else {
                    this.IN_vertices = mameshOrVertices;
                }
            }
            PercolationOnLinks.prototype.goChanging = function () {
                if (this.IN_vertices == null)
                    throw 'vertices must be specifiate';
                var vertexToNbLink = new mathis.HashMap();
                for (var _i = 0, _a = this.IN_vertices; _i < _a.length; _i++) {
                    var v = _a[_i];
                    vertexToNbLink.putValue(v, v.links.length);
                }
                for (var _b = 0, _c = this.IN_vertices; _b < _c.length; _b++) {
                    var v = _c[_b];
                    if (!(this.doNotPercolateOnBorder && v.hasMark(mathis.Vertex.Markers.border))) {
                        if (this.SUB_random.pseudoRand() < this.probaToPercolateFunction(v)) {
                            var randInd = this.SUB_random.pseudoRandInt(v.links.length);
                            var randVoi = v.links[randInd].to;
                            if (randVoi.links.length >= vertexToNbLink.getValue(randVoi) - this.maxPercolationForAVertexAlreadyPercolate)
                                mathis.Vertex.separateTwoVoisins(v, randVoi);
                        }
                    }
                }
            };
            return PercolationOnLinks;
        }());
        mameshModification.PercolationOnLinks = PercolationOnLinks;
    })(mameshModification = mathis.mameshModification || (mathis.mameshModification = {}));
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    var MameshSmoother = (function () {
        function MameshSmoother(mamesh, doNotMoveMe) {
            if (doNotMoveMe === void 0) { doNotMoveMe = []; }
            this.mamesh = mamesh;
            this.doNotMoveMe = doNotMoveMe;
            this.nbIteration = 10;
        }
        MameshSmoother.prototype.goChanging = function () {
            var doNotMoveMeDico = new mathis.HashMap();
            for (var _i = 0, _a = this.doNotMoveMe; _i < _a.length; _i++) {
                var v = _a[_i];
                doNotMoveMeDico.putValue(v, true);
            }
            for (var i = 0; i < this.nbIteration; i++) {
                for (var _b = 0, _c = this.mamesh.vertices; _b < _c.length; _b++) {
                    var v = _c[_b];
                    if (doNotMoveMeDico.getValue(v) == null) {
                        var voiPos = [];
                        for (var _d = 0, _e = v.links; _d < _e.length; _d++) {
                            var l = _e[_d];
                            voiPos.push(l.to.position);
                        }
                        mathis.geo.baryCenter(voiPos, null, v.position);
                    }
                }
            }
        };
        return MameshSmoother;
    }());
    mathis.MameshSmoother = MameshSmoother;
    var polygonFinder;
    (function (polygonFinder) {
        var PolygonTurner = (function () {
            function PolygonTurner(mamesh, vertexToNormal) {
                this.mamesh = mamesh;
                this.vertexToNormal = vertexToNormal;
            }
            PolygonTurner.prototype.goChanging = function () {
                this.goForQuad();
                this.goForTriangle();
            };
            PolygonTurner.prototype.goForQuad = function () {
                var newList = [];
                for (var i = 0; i < this.mamesh.smallestSquares.length; i = i + 4) {
                    var v0 = this.mamesh.smallestSquares[i];
                    var v1 = this.mamesh.smallestSquares[i + 1];
                    var v2 = this.mamesh.smallestSquares[i + 2];
                    var v3 = this.mamesh.smallestSquares[i + 3];
                    var normale = this.vertexToNormal.getValue(v0);
                    var side01 = mathis.XYZ.newFrom(v1.position).substract(v0.position);
                    var side30 = mathis.XYZ.newFrom(v0.position).substract(v3.position);
                    var angle = mathis.geo.angleBetweenTwoVectorsBetweenMinusPiAndPi(side30, side01, normale);
                    if (angle < 0)
                        newList.push(v3, v2, v1, v0);
                    else
                        newList.push(v0, v1, v2, v3);
                }
                this.mamesh.smallestSquares = newList;
            };
            PolygonTurner.prototype.goForTriangle = function () {
                var newList = [];
                for (var i = 0; i < this.mamesh.smallestTriangles.length; i = i + 3) {
                    var v0 = this.mamesh.smallestTriangles[i];
                    var v1 = this.mamesh.smallestTriangles[i + 1];
                    var v2 = this.mamesh.smallestTriangles[i + 2];
                    var normale = this.vertexToNormal.getValue(v0);
                    var side01 = mathis.XYZ.newFrom(v1.position).substract(v0.position);
                    var side20 = mathis.XYZ.newFrom(v0.position).substract(v2.position);
                    var angle = mathis.geo.angleBetweenTwoVectorsBetweenMinusPiAndPi(side20, side01, normale);
                    if (angle < 0)
                        newList.push(v2, v1, v0);
                    else
                        newList.push(v0, v1, v2);
                }
                this.mamesh.smallestTriangles = newList;
            };
            return PolygonTurner;
        }());
        polygonFinder.PolygonTurner = PolygonTurner;
        var NormalComputerFromLinks = (function () {
            function NormalComputerFromLinks(mamesh) {
                this.mamesh = mamesh;
                this.normalizeNormals = true;
                this.neighborhoodSize_forSmoothing = 0;
                this.OUT_vertexWithoutNaturalNormal = [];
                this.temp0 = new mathis.XYZ(0, 0, 0);
                this.temp1 = new mathis.XYZ(0, 0, 0);
                this.OUT_vertexToStrate = new mathis.HashMap(true);
            }
            NormalComputerFromLinks.prototype.go = function () {
                if (this.mamesh == null)
                    throw "the mamesh is null";
                var isolatedVertices = new mathis.HashMap(true);
                for (var _i = 0, _a = this.mamesh.vertices; _i < _a.length; _i++) {
                    var v = _a[_i];
                    if (v.links.length == 0)
                        isolatedVertices.putValue(v, true);
                }
                if (isolatedVertices.allKeys().length > 0) {
                    mathis.logger.c("there are:" + isolatedVertices.allKeys().length + " isolated vertices. They are removed from your mamesh");
                    this.mamesh.vertices = mathis.tab.arrayMinusElements(this.mamesh.vertices, function (v) { return isolatedVertices.getValue(v); });
                }
                var preRes = new mathis.HashMap(true);
                for (var _b = 0, _c = this.mamesh.vertices; _b < _c.length; _b++) {
                    var v = _c[_b];
                    var normal = this.oneNormalComputation(v);
                    if (normal != null)
                        preRes.putValue(v, normal);
                    else
                        this.OUT_vertexWithoutNaturalNormal.push(v);
                }
                if (this.OUT_vertexWithoutNaturalNormal.length > 0)
                    mathis.logger.c("there is :" + this.OUT_vertexWithoutNaturalNormal.length +
                        " vertices without a natural normal. We will associate to them the normal of one of their neighbor");
                var remainingVertices = new mathis.HashMap();
                for (var _d = 0, _e = this.mamesh.vertices; _d < _e.length; _d++) {
                    var v = _e[_d];
                    if (preRes.getValue(v) != null)
                        remainingVertices.putValue(v, v);
                }
                var count = 0;
                var maxCount = 1000;
                var startingVertex = remainingVertices.oneValue();
                while (startingVertex != null && count < maxCount) {
                    this.aligningNormals(preRes, startingVertex, remainingVertices);
                    startingVertex = remainingVertices.oneValue();
                    count++;
                }
                if (count == maxCount)
                    throw "more than " + maxCount + " connected component in this mamesh. Strange";
                var res;
                if (this.neighborhoodSize_forSmoothing > 0) {
                    res = new mathis.HashMap(true);
                    for (var _f = 0, _g = this.mamesh.vertices; _f < _g.length; _f++) {
                        var vertex = _g[_f];
                        res.putValue(vertex, this.smoothingByNeighbors(vertex, preRes));
                    }
                }
                else
                    res = preRes;
                var strange = [];
                for (var _h = 0, _j = res.allKeys(); _h < _j.length; _h++) {
                    var v = _j[_h];
                    if (res.getValue(v) == null)
                        strange.push(v);
                }
                if (strange.length > 0) {
                    mathis.logger.c("strange: there is:" + strange.length + " vertex with null normal associated");
                    for (var _k = 0, strange_1 = strange; _k < strange_1.length; _k++) {
                        var v = strange_1[_k];
                        res.removeKey(v);
                    }
                }
                return res;
            };
            NormalComputerFromLinks.prototype.smoothingByNeighbors = function (vertex, res) {
                var alreadySeen = new mathis.HashMap();
                var curentEdge = [vertex];
                var voi = [];
                for (var i = 0; i < this.neighborhoodSize_forSmoothing; i++) {
                    curentEdge = mathis.graph.getEdge(curentEdge, alreadySeen);
                    voi = voi.concat(curentEdge);
                }
                var voiNormal = [];
                for (var _i = 0, voi_1 = voi; _i < voi_1.length; _i++) {
                    var vertex_2 = voi_1[_i];
                    voiNormal.push(res.getValue(vertex_2));
                }
                var newNormal = new mathis.XYZ(0, 0, 0);
                mathis.geo.baryCenter(voiNormal, null, newNormal);
                return newNormal;
            };
            NormalComputerFromLinks.prototype.oneNormalComputation = function (v) {
                if (v.links.length < 2) {
                    mathis.logger.c("cannot compute normal for vertex with nbLinks<2");
                    return null;
                }
                var normal = new mathis.XYZ(0, 0, 0);
                var bestNormal = new mathis.XYZ(0, 0, 0);
                var bestLen = 0;
                var nb = v.links.length;
                for (var l0 = 0; l0 < nb; l0++) {
                    for (var k1 = (l0 + 1); k1 < nb; k1++) {
                        var edge0 = this.temp0.copyFrom(v.links[l0].to.position).substract(v.position);
                        var edge1 = this.temp1.copyFrom(v.links[k1].to.position).substract(v.position);
                        mathis.geo.cross(edge0.normalize(), edge1.normalize(), normal);
                        var len = normal.length();
                        if (len > bestLen) {
                            bestLen = len;
                            bestNormal.copyFrom(normal);
                        }
                    }
                }
                if (bestLen < 100 * mathis.geo.epsilon) {
                    if (bestLen < mathis.geo.epsilon) {
                        mathis.logger.c("Cannot compute normal : all in the links are on the same line");
                        return null;
                    }
                }
                if (this.normalizeNormals)
                    bestNormal.scale(1 / bestLen);
                return bestNormal;
            };
            NormalComputerFromLinks.prototype.oneFastComputation = function (v) {
                if (v.links.length < 2) {
                    mathis.logger.c("cannot compute normal for vertex with nbLinks<2");
                    return null;
                }
                var normal = new mathis.XYZ(0, 0, 0);
                var edge0 = this.temp0.copyFrom(v.links[0].to.position).substract(v.position);
                var edge1 = this.temp1.copyFrom(v.links[1].to.position).substract(v.position);
                mathis.geo.cross(edge0.normalize(), edge1.normalize(), normal);
                var len = normal.length();
                if (len < 0.2 && v.links.length >= 3) {
                    edge1 = this.temp1.copyFrom(v.links[2].to.position).substract(v.position);
                    mathis.geo.cross(edge0.normalize(), edge1.normalize(), normal);
                    len = normal.length();
                }
                if (len < mathis.geo.epsilon) {
                    mathis.logger.c("Cannot compute at least one normal  with the fast technik : try the slow method");
                    return null;
                }
                if (this.normalizeNormals)
                    normal.scale(1 / len);
                return normal;
            };
            NormalComputerFromLinks.prototype.aligningNormals = function (vertexToNormal, startvertex, remainingVertices) {
                remainingVertices.removeKey(startvertex);
                var strates = [];
                var alreadySeen = new mathis.HashMap();
                var curentEdge = [startvertex];
                var count = 0;
                var maxCount = 10000;
                while (curentEdge.length > 0 && count < maxCount) {
                    count++;
                    strates.push(curentEdge);
                    curentEdge = mathis.graph.getEdge(curentEdge, alreadySeen);
                }
                if (count == maxCount)
                    throw "too many strates";
                this.OUT_vertexToStrate.putValue(startvertex, 0);
                for (var i = 1; i < strates.length; i++) {
                    for (var _i = 0, _a = strates[i]; _i < _a.length; _i++) {
                        var v = _a[_i];
                        this.OUT_vertexToStrate.putValue(v, i);
                        remainingVertices.removeKey(v);
                        for (var _b = 0, _c = v.links; _b < _c.length; _b++) {
                            var l = _c[_b];
                            if (this.OUT_vertexToStrate.getValue(l.to) == i - 1) {
                                var previousNormal = vertexToNormal.getValue(l.to);
                                var currentNormal = vertexToNormal.getValue(v);
                                if (currentNormal == null) {
                                    if (previousNormal == null)
                                        throw "previousNormal is null";
                                    vertexToNormal.putValue(v, mathis.XYZ.newFrom(previousNormal));
                                }
                                else {
                                    var dot = mathis.geo.dot(previousNormal, currentNormal);
                                    if (Math.abs(dot) < mathis.geo.epsilon)
                                        throw "two neighbor vertices have orthogonal vertex. Your mamesh is too irregular";
                                    if (dot < 0)
                                        currentNormal.scale(-1);
                                }
                                break;
                            }
                        }
                    }
                }
            };
            return NormalComputerFromLinks;
        }());
        polygonFinder.NormalComputerFromLinks = NormalComputerFromLinks;
        var PolygonFinderFromLinks = (function () {
            function PolygonFinderFromLinks(mamesh) {
                this.nbBiggerFacesDeleted = 1;
                this.areaVsPerimeter_toDetectBiggerFaces = false;
                this.useBarycenterToCutPolygons = true;
                this.mamesh = mamesh;
            }
            PolygonFinderFromLinks.prototype.polygonsDetection = function (vertexToNormal) {
                var orienter = new PolygonTurner(this.mamesh, vertexToNormal);
                orienter.goChanging();
                var alreadyTravel = new mathis.StringMap();
                for (var i = 0; i < this.mamesh.smallestSquares.length; i += 4) {
                    var v0 = this.mamesh.smallestSquares[i];
                    var v1 = this.mamesh.smallestSquares[i + 1];
                    var v2 = this.mamesh.smallestSquares[i + 2];
                    var v3 = this.mamesh.smallestSquares[i + 3];
                    alreadyTravel.putValue(mathis.Hash.orientedSegment(v0, v1), true);
                    alreadyTravel.putValue(mathis.Hash.orientedSegment(v1, v2), true);
                    alreadyTravel.putValue(mathis.Hash.orientedSegment(v2, v3), true);
                    alreadyTravel.putValue(mathis.Hash.orientedSegment(v3, v0), true);
                }
                for (var i = 0; i < this.mamesh.smallestTriangles.length; i += 3) {
                    var v0 = this.mamesh.smallestTriangles[i];
                    var v1 = this.mamesh.smallestTriangles[i + 1];
                    var v2 = this.mamesh.smallestTriangles[i + 2];
                    alreadyTravel.putValue(mathis.Hash.orientedSegment(v0, v1), true);
                    alreadyTravel.putValue(mathis.Hash.orientedSegment(v1, v2), true);
                    alreadyTravel.putValue(mathis.Hash.orientedSegment(v2, v0), true);
                }
                var toSort = function (a, b) { return a.angle - b.angle; };
                function buildOnPolygonRecursively(recCount, poly, linksAlreadySeenInCurrentPoly, allRemainingLinks) {
                    recCount++;
                    if (recCount > 1000)
                        throw "too many recursion when we build a polygon";
                    var linkAndAngle = [];
                    var lastV = poly[poly.length - 1];
                    var previousV = poly[poly.length - 2];
                    for (var _i = 0, _a = lastV.links; _i < _a.length; _i++) {
                        var l = _a[_i];
                        if (l.to != previousV) {
                            var nextV = l.to;
                            var hash = mathis.Hash.orientedSegment(lastV, nextV);
                            var vecA = mathis.XYZ.newFrom(previousV.position).substract(lastV.position);
                            var vecB = mathis.XYZ.newFrom(l.to.position).substract(lastV.position);
                            var angle = mathis.geo.angleBetweenTwoVectorsBetween0And2Pi(vecB, vecA, vertexToNormal.getValue(lastV)) + Math.PI;
                            linkAndAngle.push({ vertex: nextV, angle: angle });
                        }
                    }
                    if (linkAndAngle.length > 0) {
                        linkAndAngle.sort(toSort);
                        var best = linkAndAngle[0].vertex;
                        var hashOfBest = mathis.Hash.orientedSegment(lastV, best);
                        if (linksAlreadySeenInCurrentPoly.getValue(hashOfBest) != null) {
                            poly.pop();
                            return poly;
                        }
                        else if (allRemainingLinks.getValue(hashOfBest) == null) {
                            mathis.Vertex.separateTwoVoisins(previousV, lastV);
                            allRemainingLinks.removeKey(mathis.Hash.orientedSegment(previousV, lastV));
                            poly.pop();
                            if (poly.length > 1)
                                return buildOnPolygonRecursively(recCount, poly, linksAlreadySeenInCurrentPoly, allRemainingLinks);
                            else
                                return null;
                        }
                        else {
                            poly.push(best);
                            linksAlreadySeenInCurrentPoly.putValue(mathis.Hash.orientedSegment(lastV, best), true);
                            return buildOnPolygonRecursively(recCount, poly, linksAlreadySeenInCurrentPoly, allRemainingLinks);
                        }
                    }
                    else {
                        mathis.Vertex.separateTwoVoisins(previousV, lastV);
                        allRemainingLinks.removeKey(mathis.Hash.orientedSegment(previousV, lastV));
                        poly.pop();
                        if (poly.length > 1)
                            return buildOnPolygonRecursively(recCount, poly, linksAlreadySeenInCurrentPoly, allRemainingLinks);
                        else
                            return null;
                    }
                }
                var allRemainingLinks = new mathis.StringMap();
                for (var _i = 0, _a = this.mamesh.vertices; _i < _a.length; _i++) {
                    var v = _a[_i];
                    for (var _b = 0, _c = v.links; _b < _c.length; _b++) {
                        var l = _c[_b];
                        var hash = mathis.Hash.orientedSegment(v, l.to);
                        if (alreadyTravel.getValue(hash) == null) {
                            allRemainingLinks.putValue(hash, [v, l.to]);
                        }
                    }
                }
                var polygons = [];
                var aRemainingLink = allRemainingLinks.oneValue();
                var outsideCount = 0;
                var max = 10000;
                while (aRemainingLink != null && outsideCount < max) {
                    outsideCount++;
                    var poly = [aRemainingLink[0], aRemainingLink[1]];
                    var linksAlreadySeenInCurrentPoly = new mathis.StringMap();
                    linksAlreadySeenInCurrentPoly.putValue(mathis.Hash.orientedSegment(aRemainingLink[0], aRemainingLink[1]), true);
                    var recCount = 0;
                    poly = buildOnPolygonRecursively(recCount, poly, linksAlreadySeenInCurrentPoly, allRemainingLinks);
                    if (poly != null) {
                        polygons.push(poly);
                        for (var _d = 0, _e = linksAlreadySeenInCurrentPoly.allKeys(); _d < _e.length; _d++) {
                            var key = _e[_d];
                            allRemainingLinks.removeKey(key);
                        }
                    }
                    aRemainingLink = allRemainingLinks.oneValue();
                }
                if (outsideCount == max)
                    throw "we turn too mush on the mamesh";
                return polygons;
            };
            PolygonFinderFromLinks.prototype.suppressionOfLinksAppearingTwiceInOnePolygon = function (createdPolygons) {
                var indexesOfPolygonsToModify = [];
                var tablinkdelete = [];
                for (var j = 0; j < createdPolygons.length; j++) {
                    var poly = createdPolygons[j];
                    var linksToNumberOccurence = new mathis.StringMap();
                    var alreadyAdd = false;
                    for (var i = 0; i < poly.length; i++) {
                        var hash = mathis.Hash.segment(poly[i], poly[(i + 1) % poly.length]);
                        var nbOcc = linksToNumberOccurence.getValue(hash);
                        if (nbOcc == null)
                            linksToNumberOccurence.putValue(hash, 1);
                        else if (nbOcc == 1) {
                            linksToNumberOccurence.putValue(hash, 2);
                            if (!alreadyAdd)
                                indexesOfPolygonsToModify.push(j);
                            alreadyAdd = true;
                            tablinkdelete.push([poly[i], poly[(i + 1) % poly.length]]);
                        }
                        else
                            throw "a segment appears more than two times in the same polygon";
                    }
                }
                this.floatedLinksSuppression(tablinkdelete, indexesOfPolygonsToModify, createdPolygons);
                this.reorderFloatingPolygon(indexesOfPolygonsToModify, createdPolygons);
            };
            PolygonFinderFromLinks.prototype.floatedLinksSuppression = function (tablinkdelete, indexesOfPolygonsToModify, createdPolygons) {
                for (var _i = 0, tablinkdelete_1 = tablinkdelete; _i < tablinkdelete_1.length; _i++) {
                    var l = tablinkdelete_1[_i];
                    mathis.Vertex.separateTwoVoisins(l[0], l[1]);
                    if (l[0].links.length < 1) {
                        for (var _a = 0, indexesOfPolygonsToModify_1 = indexesOfPolygonsToModify; _a < indexesOfPolygonsToModify_1.length; _a++) {
                            var i = indexesOfPolygonsToModify_1[_a];
                            var poly = createdPolygons[i];
                            for (var _b = 0, poly_2 = poly; _b < poly_2.length; _b++) {
                                var v = poly_2[_b];
                                if (v == l[0]) {
                                    mathis.tab.removeFromArray(poly, l[0]);
                                    break;
                                }
                            }
                        }
                        mathis.tab.removeFromArray(this.mamesh.vertices, l[0]);
                    }
                    if (l[1].links.length < 1) {
                        for (var _c = 0, indexesOfPolygonsToModify_2 = indexesOfPolygonsToModify; _c < indexesOfPolygonsToModify_2.length; _c++) {
                            var i = indexesOfPolygonsToModify_2[_c];
                            var poly = createdPolygons[i];
                            for (var _d = 0, poly_3 = poly; _d < poly_3.length; _d++) {
                                var v = poly_3[_d];
                                if (v == l[1]) {
                                    mathis.tab.removeFromArray(poly, l[1]);
                                    break;
                                }
                            }
                        }
                        mathis.tab.removeFromArray(this.mamesh.vertices, l[1]);
                    }
                }
            };
            PolygonFinderFromLinks.prototype.reorderFloatingPolygon = function (indexPolygonsToReorder, allPolygons) {
                for (var _i = 0, indexPolygonsToReorder_1 = indexPolygonsToReorder; _i < indexPolygonsToReorder_1.length; _i++) {
                    var i = indexPolygonsToReorder_1[_i];
                    var poly = allPolygons[i];
                    var new_poly = [];
                    var first_first_vertex = poly[0];
                    var first_vertex = poly[0];
                    var second_vertex = void 0;
                    var vImpasse = true;
                    for (var _a = 0, _b = first_vertex.links; _a < _b.length; _a++) {
                        var l = _b[_a];
                        if (poly.indexOf(l.to) != -1) {
                            second_vertex = l.to;
                            break;
                        }
                    }
                    new_poly.push(first_vertex);
                    var vloop = true;
                    while (vloop) {
                        if (second_vertex != first_first_vertex) {
                            for (var _c = 0, _d = second_vertex.links; _c < _d.length; _c++) {
                                var l = _d[_c];
                                if (l.to != first_vertex && poly.indexOf(l.to) != -1) {
                                    new_poly.push(second_vertex);
                                    first_vertex = second_vertex;
                                    second_vertex = l.to;
                                    vImpasse = false;
                                    break;
                                }
                            }
                        }
                        else {
                            vloop = false;
                        }
                        if (vImpasse) {
                            vloop = false;
                        }
                    }
                    allPolygons[i] = new_poly;
                }
            };
            PolygonFinderFromLinks.prototype.areaAndPerimeterComputation = function (tab_polys) {
                var tabSurface = [];
                var PolygoIndexToVertexCenter = [];
                var oneOverLength = 0;
                var polyIndex = -1;
                for (var _i = 0, tab_polys_1 = tab_polys; _i < tab_polys_1.length; _i++) {
                    var p = tab_polys_1[_i];
                    polyIndex++;
                    if (p.length == 3) {
                        var distA = mathis.geo.distance(p[0].position, p[1].position);
                        var distB = mathis.geo.distance(p[0].position, p[2].position);
                        var distC = mathis.geo.distance(p[1].position, p[2].position);
                        if (this.areaVsPerimeter_toDetectBiggerFaces) {
                            var heronP = (distA + distB + distC) / 2;
                            var surface = Math.sqrt(heronP * (heronP - distA) * (heronP - distB) * (heronP - distC));
                            tabSurface.push(surface);
                        }
                        else {
                            var perimetre = distA + distB + distC;
                            tabSurface.push(perimetre);
                        }
                    }
                    else if (p.length == 4) {
                        var distA = mathis.geo.distance(p[0].position, p[1].position);
                        var distB = mathis.geo.distance(p[1].position, p[2].position);
                        var distC = mathis.geo.distance(p[2].position, p[3].position);
                        var distD = mathis.geo.distance(p[3].position, p[0].position);
                        var distE = mathis.geo.distance(p[0].position, p[2].position);
                        if (this.areaVsPerimeter_toDetectBiggerFaces) {
                            var heronP1 = (distA + distB + distE) / 2;
                            var surface1 = Math.sqrt(heronP1 * (heronP1 - distA) * (heronP1 - distB) * (heronP1 - distE));
                            var heronP2 = (distC + distD + distE) / 2;
                            var surface2 = Math.sqrt(heronP2 * (heronP2 - distC) * (heronP2 - distD) * (heronP2 - distE));
                            tabSurface.push(surface1 + surface2);
                        }
                        else {
                            var perimetre = distA + distB + distC + distD;
                            tabSurface.push(perimetre);
                        }
                    }
                    else if (p.length >= 5) {
                        var centerVertex = new mathis.Vertex().setPosition(0, 0, 0);
                        oneOverLength = 1 / (p.length);
                        var tab1 = [];
                        var tab2 = [];
                        for (var _a = 0, p_1 = p; _a < p_1.length; _a++) {
                            var v = p_1[_a];
                            tab1.push(v.position);
                            tab2.push(oneOverLength);
                        }
                        mathis.geo.baryCenter(tab1, tab2, centerVertex.param);
                        var centerVertex2 = new mathis.Vertex().setPosition(centerVertex.param.x, centerVertex.param.y, centerVertex.param.z);
                        var surface3 = 0;
                        if (this.areaVsPerimeter_toDetectBiggerFaces) {
                            for (var i = 0; i < p.length; i++) {
                                var distA = mathis.geo.distance(p[i].position, p[(i + 1) % (p.length)].position);
                                var distB = mathis.geo.distance(p[(i + 1) % (p.length)].position, centerVertex2.position);
                                var distC = mathis.geo.distance(centerVertex2.position, p[i].position);
                                var heronP3 = (distA + distB + distC) / 2;
                                surface3 = surface3 + Math.sqrt(heronP3 * (heronP3 - distA) * (heronP3 - distB) * (heronP3 - distC));
                            }
                        }
                        else {
                            for (var i = 0; i < p.length; i++) {
                                var distA = mathis.geo.distance(p[i].position, p[(i + 1) % (p.length)].position);
                                surface3 = surface3 + distA;
                            }
                        }
                        tabSurface.push(surface3);
                        PolygoIndexToVertexCenter[polyIndex] = centerVertex2;
                    }
                }
                for (var n = 0; n < this.nbBiggerFacesDeleted; n++) {
                    var maxSurf = -1;
                    var numSurf = -1;
                    for (var i = 0; i < tabSurface.length; i++) {
                        if (tabSurface[i] > maxSurf) {
                            maxSurf = tabSurface[i];
                            numSurf = i;
                        }
                    }
                    tabSurface[numSurf] = -1;
                    tab_polys[numSurf] = [];
                }
                return PolygoIndexToVertexCenter;
            };
            PolygonFinderFromLinks.prototype.fillConvexSurface = function (polygon, centerVertex) {
                centerVertex.markers.push(mathis.Vertex.Markers.polygonCenter);
                this.mamesh.vertices.push(centerVertex);
                for (var i = 0; i < polygon.length; i++) {
                    this.mamesh.addATriangle(polygon[i], polygon[(i + 1) % (polygon.length)], centerVertex);
                    polygon[i].setOneLink(centerVertex);
                    centerVertex.setOneLink(polygon[i]);
                }
            };
            PolygonFinderFromLinks.prototype.fillNoConvexSurface = function (polygon, vertexToNormal) {
                while (polygon.length >= 3) {
                    var isAcuteAngle = new mathis.HashMap();
                    var ifObtuseAngleExist = false;
                    for (var i = 0; i < polygon.length; i = i + 1) {
                        var vPrev = void 0;
                        var vNext = void 0;
                        var vCurr = polygon[i];
                        if (i == 0) {
                            vPrev = polygon[polygon.length - 1];
                        }
                        else {
                            vPrev = polygon[i - 1];
                        }
                        if (i == polygon.length - 1) {
                            vNext = polygon[0];
                        }
                        else {
                            vNext = polygon[i + 1];
                        }
                        var vector_l_previous = new mathis.XYZ(vPrev.position.x - vCurr.position.x, vPrev.position.y - vCurr.position.y, vPrev.position.z - vCurr.position.z);
                        var vector_l_next = new mathis.XYZ(vNext.position.x - vCurr.position.x, vNext.position.y - vCurr.position.y, vNext.position.z - vCurr.position.z);
                        var newangle = mathis.geo.angleBetweenTwoVectorsBetweenMinusPiAndPi(vector_l_previous, vector_l_next, vertexToNormal.getValue(polygon[i]));
                        if (newangle < 0) {
                            isAcuteAngle.putValue(vCurr, false);
                            ifObtuseAngleExist = true;
                        }
                        else {
                            isAcuteAngle.putValue(vCurr, true);
                        }
                    }
                    var vbreak = true;
                    for (var i = 0; i < polygon.length && vbreak; i++) {
                        var vPrev = void 0;
                        var vNext = void 0;
                        var vNextNext = void 0;
                        var vCurr = polygon[i];
                        if (i == 0) {
                            vPrev = polygon[polygon.length - 1];
                        }
                        else {
                            vPrev = polygon[i - 1];
                        }
                        if (i == polygon.length - 1) {
                            vNext = polygon[0];
                        }
                        else {
                            vNext = polygon[i + 1];
                        }
                        if (i == polygon.length - 2) {
                            vNextNext = polygon[0];
                        }
                        else {
                            if (i == polygon.length - 1) {
                                vNextNext = polygon[1];
                            }
                            else {
                                vNextNext = polygon[i + 2];
                            }
                        }
                        if (ifObtuseAngleExist) {
                            if (!isAcuteAngle.getValue(vCurr)) {
                                vCurr.setOneLink(vNextNext);
                                vNextNext.setOneLink(vCurr);
                                this.mamesh.addATriangle(vCurr, vNext, vNextNext);
                                mathis.tab.removeFromArray(polygon, vNext);
                                vbreak = false;
                            }
                        }
                        else {
                            vPrev.setOneLink(vNext);
                            vNext.setOneLink(vPrev);
                            this.mamesh.addATriangle(vPrev, vCurr, vNext);
                            mathis.tab.removeFromArray(polygon, vCurr);
                            vbreak = false;
                        }
                    }
                }
            };
            PolygonFinderFromLinks.prototype.go = function () {
                if (this.mamesh == null)
                    throw "the mamesh is null";
                this.SUB_NormalComputer = new NormalComputerFromLinks(this.mamesh);
                this.mamesh.vertices = mathis.tab.arrayMinusElements(this.mamesh.vertices, function (v) { return v.links.length == 0; });
                cc("this.OUT_vertexToNormal", this.OUT_vertexToNormal);
                this.OUT_vertexToNormal = this.SUB_NormalComputer.go();
                var detectedPolygons = this.polygonsDetection(this.OUT_vertexToNormal);
                this.suppressionOfLinksAppearingTwiceInOnePolygon(detectedPolygons);
                var PolygoIndexToVertexCenter = this.areaAndPerimeterComputation(detectedPolygons);
                var indexSurface = -1;
                for (var _i = 0, detectedPolygons_1 = detectedPolygons; _i < detectedPolygons_1.length; _i++) {
                    var p = detectedPolygons_1[_i];
                    indexSurface++;
                    if (p.length == 3) {
                        this.mamesh.addATriangle(p[0], p[1], p[2]);
                    }
                    else if (p.length == 4) {
                        this.mamesh.addASquare(p[0], p[1], p[2], p[3]);
                    }
                    else if (p.length >= 5) {
                        if (this.useBarycenterToCutPolygons) {
                            var centerVertex2 = PolygoIndexToVertexCenter[indexSurface];
                            this.fillConvexSurface(p, centerVertex2);
                        }
                        else {
                            this.fillNoConvexSurface(p, this.OUT_vertexToNormal);
                        }
                    }
                }
            };
            return PolygonFinderFromLinks;
        }());
        polygonFinder.PolygonFinderFromLinks = PolygonFinderFromLinks;
    })(polygonFinder = mathis.polygonFinder || (mathis.polygonFinder = {}));
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    var reseau;
    (function (reseau) {
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
            };
            return SingleTriangle;
        }());
        reseau.SingleTriangle = SingleTriangle;
        var TriangulatedTriangle = (function () {
            function TriangulatedTriangle() {
                this.markCorner = true;
                this.markBorder = true;
                this.origin = new mathis.XYZ(0, 0, 0);
                this.end = new mathis.XYZ(2, 1, 0);
                this.nbU = 6;
            }
            TriangulatedTriangle.prototype.go = function () {
                var creator = new Regular2dPlus();
                creator.nbU = this.nbU + 1;
                creator.nbV = this.nbU + 1;
                creator.origin = new mathis.XYZ(0, 0, 0);
                creator.end = new mathis.XYZ(2, 1, 0);
                creator.putAVertexOnlyAtXYZCheckingThisCondition = function (xyz) {
                    return (xyz.y <= xyz.x + 0.0001) && (xyz.y < 2 - xyz.x + 0.0001);
                };
                creator.maille = Maille.triangleH;
                var mamesh = creator.go();
                if (!(this.origin.almostEqual(new mathis.XYZ(0, 0, 0)) && this.end.almostEqual(new mathis.XYZ(2, 1, 0)))) {
                    mathis.spacialTransformations.adjustInASquare(mamesh, this.origin, this.end);
                }
                if (this.markCorner) {
                    for (var _i = 0, _a = mamesh.vertices; _i < _a.length; _i++) {
                        var v = _a[_i];
                        if (v.links.length == 2)
                            v.markers.push(mathis.Vertex.Markers.corner);
                    }
                }
                if (this.markBorder) {
                    for (var _b = 0, _c = mamesh.vertices; _b < _c.length; _b++) {
                        var v = _c[_b];
                        if (v.links.length <= 4)
                            v.markers.push(mathis.Vertex.Markers.border);
                    }
                }
                return mamesh;
            };
            return TriangulatedTriangle;
        }());
        reseau.TriangulatedTriangle = TriangulatedTriangle;
        var TriangulatedTriangleOld = (function () {
            function TriangulatedTriangleOld() {
                this.markCorner = true;
                this.markBorder = true;
                this.origin = new mathis.XYZ(-1, -1, 0);
                this.end = new mathis.XYZ(1, 1, 0);
                this.nbSubdivisionInSide = 6;
                this.setAllDichoLevelTo0 = true;
                this.mamesh = new mathis.Mamesh();
            }
            TriangulatedTriangleOld.prototype.go = function () {
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
                var linkMaker = new mathis.linkModule.LinkCreatorSorterAndBorderDetectorByPolygons(this.mamesh);
                linkMaker.markIsolateVertexAsCorner = false;
                linkMaker.goChanging();
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
            return TriangulatedTriangleOld;
        }());
        reseau.TriangulatedTriangleOld = TriangulatedTriangleOld;
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
                var vert0 = this.mamesh.newVertex(new mathis.XYZ(0, 0, 0), 0, new mathis.XYZ(0, 0, 0));
                vert0.markers.push(mathis.Vertex.Markers.center);
                for (var i = 0; i < this.nbSides; i++) {
                    var param = new mathis.XYZ(Math.cos(2 * Math.PI * i / this.nbSides - Math.PI / 2), Math.sin(2 * Math.PI * i / this.nbSides - Math.PI / 2), 0);
                    var position = mathis.XYZ.newFrom(param);
                    var v = this.mamesh.newVertex(position, 0, param);
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
                return this.mamesh;
            };
            return TriangulatedPolygone;
        }());
        reseau.TriangulatedPolygone = TriangulatedPolygone;
        var BasisForRegularReseau = (function () {
            function BasisForRegularReseau() {
                this.nbU = 3;
                this.set_nbV_toHaveRegularReseau = false;
                this.set_nbU_toHaveRegularReseau = false;
                this.nbV = 3;
                this.origin = new mathis.XYZ(0, 0, 0);
                this.end = new mathis.XYZ(1, 1, 0);
                this.kComponentTranslation = 0;
                this.nbVerticalDecays = 0;
                this.nbHorizontalDecays = 0;
                this.squareMailleInsteadOfTriangle = true;
            }
            BasisForRegularReseau.prototype.go = function () {
                this.checkArgs();
                if (this.set_nbV_toHaveRegularReseau && this.set_nbU_toHaveRegularReseau)
                    throw "you must chose only one of the two options";
                var deltaX;
                var deltaY;
                if (this.set_nbV_toHaveRegularReseau) {
                    deltaX = (this.end.x - this.origin.x) / (this.nbU - 1);
                    if (this.squareMailleInsteadOfTriangle)
                        deltaY = deltaX;
                    else
                        deltaY = deltaX * Math.sqrt(3) / 2;
                    this.nbV = Math.floor(((this.end.y - this.origin.y) / deltaY + 1));
                }
                else if (this.set_nbU_toHaveRegularReseau) {
                    deltaY = (this.end.y - this.origin.y) / (this.nbV - 1);
                    if (this.squareMailleInsteadOfTriangle)
                        deltaX = deltaY;
                    else
                        deltaX = deltaY / Math.sqrt(3) * 2;
                    this.nbU = Math.floor(((this.end.x - this.origin.x) / deltaX + 1));
                }
                else {
                    deltaX = (this.end.x - this.origin.x) / (this.nbU - 1);
                    deltaY = (this.end.y - this.origin.y) / (this.nbV - 1);
                }
                var A = (this.end.x - this.origin.x);
                var B = (this.end.y - this.origin.y);
                var VX = this.computeDecayVector(deltaX, A, deltaY, B, this.nbVerticalDecays, this.nbHorizontalDecays);
                var preVY = this.computeDecayVector(deltaY, B, deltaX, A, this.nbHorizontalDecays, this.nbVerticalDecays);
                var VY = new mathis.XYZ(preVY.y, preVY.x, 0);
                VX.z += this.kComponentTranslation;
                VY.z += this.kComponentTranslation;
                return { dirU: VX, dirV: VY, nbU: this.nbU, nbV: this.nbV };
            };
            BasisForRegularReseau.prototype.checkArgs = function () {
                var A = (this.end.x - this.origin.x);
                var B = (this.end.y - this.origin.y);
                if (Math.abs(A) < mathis.geo.epsilon || Math.abs(B) < mathis.geo.epsilon)
                    throw 'origin and end are almost in the same line';
                if (this.nbU < 2)
                    throw 'this.nbI must be >=2';
                if (this.nbV < 2)
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
                var vert = paramToVertex.getValue(aParam);
                aParam.copyFromFloats(cell.param.x, cell.param.y, cell.param.z).add(dir2);
                var vertex = paramToVertex.getValue(aParam);
                if (vert != null && vertex != null)
                    cell.setTwoOppositeLinks(vert, vertex);
                else if (vert == null && vertex != null)
                    cell.setOneLink(vertex);
                else if (vert != null && vertex == null)
                    cell.setOneLink(vert);
            }
        }
        var tempPapa = new mathis.XYZ(0, 0, 0);
        function makeSquareFromDeltaParam(cell, mamesh, dir1, dir2, paramToVertex) {
            var v1 = cell;
            if (v1 == null)
                return;
            var v2 = paramToVertex.getValue(tempPapa.copyFrom(cell.param).add(dir1));
            if (v2 == null)
                return;
            var v3 = paramToVertex.getValue(tempPapa.copyFrom(cell.param).add(dir1).add(dir2));
            if (v3 == null)
                return;
            var v4 = paramToVertex.getValue(tempPapa.copyFrom(cell.param).add(dir2));
            if (v4 == null)
                return;
            mamesh.addASquare(v1, v2, v3, v4);
        }
        var Regular2d = (function () {
            function Regular2d(generator) {
                this.nbU = 3;
                this.nbV = 3;
                this.fixedW = 0;
                this.dirU = new mathis.XYZ(1, 0, 0);
                this.dirV = new mathis.XYZ(0, 1, 0);
                this.dirW = new mathis.XYZ(0, 0, 0);
                this.origine = new mathis.XYZ(0, 0, 0);
                this.makeLinks = true;
                this.makeTriangleOrSquare = true;
                this.squareVersusTriangleMaille = true;
                this.oneMoreVertexForOddLine = false;
                this.markCorner = true;
                this.markBorder = true;
                this.markCenter = true;
                this.putAVertexOnlyAtXYZCheckingThisCondition = null;
                this.OUT_paramToVertex = new mathis.HashMap(true);
                this._xyz = new mathis.XYZ(0, 0, 0);
                this._iDirection = new mathis.XYZ(0, 0, 0);
                this._jDirection = new mathis.XYZ(0, 0, 0);
                this._kDirection = new mathis.XYZ(0, 0, 0);
                this.mamesh = new mathis.Mamesh();
                this.generator = generator;
            }
            Regular2d.prototype.checkArgs = function () {
                if (!this.makeTriangleOrSquare && !this.makeLinks)
                    mathis.logger.c('few interest if you do not add neither square nor links');
                var cros = new mathis.XYZ(0, 0, 0);
                mathis.geo.cross(this.dirU, this.dirV, cros);
                if (cros.x == Number.NaN || cros.y == Number.NaN || cros.z == Number.NaN)
                    throw 'a problem with Vi of Vj';
                if (cros.length() < mathis.geo.epsilon)
                    throw 'origin and end are almost in the same line';
            };
            Regular2d.prototype.getVertex = function (i, j) {
                this._xyz.x = i;
                this._xyz.y = j;
                this._xyz.z = this.fixedW;
                return this.OUT_paramToVertex.getValue(this._xyz);
            };
            Regular2d.prototype.go = function () {
                if (this.generator != null) {
                    var VV = this.generator.go();
                    this.dirU.copyFrom(VV.dirU);
                    this.dirV.copyFrom(VV.dirV);
                    this.nbU = VV.nbU;
                    this.nbV = VV.nbV;
                    this.origine.copyFrom(this.generator.origin);
                    this.squareVersusTriangleMaille = this.generator.squareMailleInsteadOfTriangle;
                }
                this.checkArgs();
                for (var i = 0; i < this.nbU; i++) {
                    for (var j = 0; j < this.nbV; j++) {
                        var param = new mathis.XYZ(i, j, this.fixedW);
                        if (this.holeParameters == null || !this.holeParameters(param)) {
                            var decay = (!this.squareVersusTriangleMaille && j % 2 == 0) ? 0.5 : 0;
                            this._iDirection.copyFrom(this.dirU).scale(i + decay);
                            this._jDirection.copyFrom(this.dirV).scale(j);
                            this._kDirection.copyFrom(this.dirW).scale(this.fixedW);
                            var position = new mathis.XYZ(0, 0, 0).add(this._iDirection).add(this._jDirection).add(this._kDirection).add(this.origine);
                            if (this.putAVertexOnlyAtXYZCheckingThisCondition == null || this.putAVertexOnlyAtXYZCheckingThisCondition(position)) {
                                var vertex = this.mamesh.newVertex(position, 0, param);
                                this.OUT_paramToVertex.putValue(param, vertex);
                            }
                        }
                    }
                }
                if (this.oneMoreVertexForOddLine) {
                    var i = this.nbU;
                    for (var j = 0; j < this.nbV; j++) {
                        if (j % 2 == 1) {
                            var param = new mathis.XYZ(i, j, this.fixedW);
                            if (this.holeParameters == null || !this.holeParameters(param)) {
                                var decay = (!this.squareVersusTriangleMaille && j % 2 == 0) ? 0.5 : 0;
                                this._iDirection.copyFrom(this.dirU).scale(i + decay);
                                this._jDirection.copyFrom(this.dirV).scale(j);
                                this._kDirection.copyFrom(this.dirW).scale(this.fixedW);
                                var position = new mathis.XYZ(0, 0, 0).add(this._iDirection).add(this._jDirection).add(this._kDirection).add(this.origine);
                                if (this.putAVertexOnlyAtXYZCheckingThisCondition == null || this.putAVertexOnlyAtXYZCheckingThisCondition(position)) {
                                    var vertex = this.mamesh.newVertex(position, 0, param);
                                    this.OUT_paramToVertex.putValue(param, vertex);
                                }
                            }
                        }
                    }
                }
                if (this.mamesh.vertices.length == 0)
                    console.log('you have created a IN_mamesh with no vertex. Perhaps because of {@link Regular.putAVertexOnlyAtXYZCheckingThisCondition }');
                if (this.makeLinks) {
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
                    for (var _i = 0, _a = this.mamesh.vertices; _i < _a.length; _i++) {
                        var v = _a[_i];
                        if (v.param.x == 0 || v.param.y == 0 || v.param.x == this.nbU - 1 || v.param.y == this.nbV - 1)
                            v.markers.push(mathis.Vertex.Markers.border);
                    }
                }
                if (this.markCorner) {
                    var oneMore = (this.oneMoreVertexForOddLine && this.nbV % 2 == 0) ? 1 : 0;
                    var vertex = void 0;
                    vertex = this.getVertex(0, 0);
                    if (vertex != null)
                        vertex.markers.push(mathis.Vertex.Markers.corner);
                    vertex = this.getVertex(this.nbU - 1 + oneMore, this.nbV - 1);
                    if (vertex != null)
                        vertex.markers.push(mathis.Vertex.Markers.corner);
                    vertex = this.getVertex(0, this.nbV - 1);
                    if (vertex != null)
                        vertex.markers.push(mathis.Vertex.Markers.corner);
                    vertex = this.getVertex(this.nbU - 1, 0);
                    if (vertex != null)
                        vertex.markers.push(mathis.Vertex.Markers.corner);
                }
                if (this.markCenter) {
                    var iCenter = this.nbU / 2;
                    var iCenters = [];
                    if (Math.floor(iCenter) != iCenter) {
                        iCenters.push(Math.floor(iCenter));
                    }
                    else
                        iCenters.push(Math.floor(iCenter), Math.floor(iCenter) - 1);
                    var jCenter = this.nbV / 2;
                    var jCenters = [];
                    if (Math.floor(jCenter) != jCenter) {
                        jCenters.push(Math.floor(jCenter));
                    }
                    else
                        jCenters.push(Math.floor(jCenter), Math.floor(jCenter) - 1);
                    for (var _b = 0, iCenters_1 = iCenters; _b < iCenters_1.length; _b++) {
                        var i = iCenters_1[_b];
                        for (var _c = 0, jCenters_1 = jCenters; _c < jCenters_1.length; _c++) {
                            var j = jCenters_1[_c];
                            var vertex = this.getVertex(i, j);
                            if (vertex != null)
                                vertex.markers.push(mathis.Vertex.Markers.center);
                        }
                    }
                }
                return this.mamesh;
            };
            Regular2d.prototype.linksCreationForSquare = function () {
                var _this = this;
                this.mamesh.vertices.forEach(function (cell) {
                    makeLinksFromDeltaParam(cell, mathis.XYZ.temp0(1, 0, 0), mathis.XYZ.temp1(-1, 0, 0), _this.OUT_paramToVertex);
                    makeLinksFromDeltaParam(cell, mathis.XYZ.temp0(0, 1, 0), mathis.XYZ.temp1(0, -1, 0), _this.OUT_paramToVertex);
                });
            };
            Regular2d.prototype.squareCreation = function () {
                var dir1 = new mathis.XYZ(1, 0, 0);
                var dir2 = new mathis.XYZ(0, 1, 0);
                for (var _i = 0, _a = this.mamesh.vertices; _i < _a.length; _i++) {
                    var vertex = _a[_i];
                    makeSquareFromDeltaParam(vertex, this.mamesh, dir1, dir2, this.OUT_paramToVertex);
                }
            };
            Regular2d.prototype.linksCreationForTriangle = function () {
                var _this = this;
                this.mamesh.vertices.forEach(function (cell) {
                    makeLinksFromDeltaParam(cell, mathis.XYZ.temp0(1, 0, 0), mathis.XYZ.temp1(-1, 0, 0), _this.OUT_paramToVertex);
                    if (cell.param.y % 2 == 0) {
                        makeLinksFromDeltaParam(cell, mathis.XYZ.temp0(1, 1, 0), mathis.XYZ.temp1(0, -1, 0), _this.OUT_paramToVertex);
                        makeLinksFromDeltaParam(cell, mathis.XYZ.temp0(0, 1, 0), mathis.XYZ.temp1(1, -1, 0), _this.OUT_paramToVertex);
                    }
                    else {
                        makeLinksFromDeltaParam(cell, mathis.XYZ.temp0(0, 1, 0), mathis.XYZ.temp1(-1, -1, 0), _this.OUT_paramToVertex);
                        makeLinksFromDeltaParam(cell, mathis.XYZ.temp0(-1, 1, 0), mathis.XYZ.temp1(0, -1, 0), _this.OUT_paramToVertex);
                    }
                });
            };
            Regular2d.prototype.triangleCreation = function () {
                for (var i = 0; i < this.nbU; i++) {
                    for (var j = 0; j < this.nbV; j++) {
                        if (j % 2 == 0) {
                            var v1 = this.getVertex(i, j);
                            var v2 = this.getVertex(i + 1, j + 1);
                            var v3 = this.getVertex(i, j + 1);
                            var v4 = this.getVertex(i + 1, j);
                            this.mamesh.addATriangle(v1, v2, v3);
                            this.mamesh.addATriangle(v1, v4, v2);
                        }
                        else {
                            var v1 = this.getVertex(i, j);
                            var v2 = this.getVertex(i, j + 1);
                            var v3 = this.getVertex(i + 1, j);
                            var v4 = this.getVertex(i + 1, j + 1);
                            this.mamesh.addATriangle(v1, v3, v2);
                            this.mamesh.addATriangle(v2, v3, v4);
                        }
                    }
                }
            };
            return Regular2d;
        }());
        reseau.Regular2d = Regular2d;
        var Topology;
        (function (Topology) {
            Topology[Topology["flat"] = 0] = "flat";
            Topology[Topology["cylinder"] = 1] = "cylinder";
            Topology[Topology["moebius"] = 2] = "moebius";
            Topology[Topology["torus"] = 3] = "torus";
            Topology[Topology["klein"] = 4] = "klein";
        })(Topology = reseau.Topology || (reseau.Topology = {}));
        var Maille;
        (function (Maille) {
            Maille[Maille["quad"] = 0] = "quad";
            Maille[Maille["triangleH"] = 1] = "triangleH";
            Maille[Maille["triangleV"] = 2] = "triangleV";
        })(Maille = reseau.Maille || (reseau.Maille = {}));
        var Regular2dPlus = (function () {
            function Regular2dPlus() {
                this.nbU = 3;
                this.adaptVForRegularReseau = false;
                this.nbV = 3;
                this.nbSubInterval_U = 1;
                this.nbSubInterval_V = 1;
                this.origin = new mathis.XYZ(-0.7, -0.7, 0);
                this.end = new mathis.XYZ(0.7, 0.7, 0);
                this.lateral1 = null;
                this.lateral2 = null;
                this.nbVerticalDecays = 0;
                this.nbHorizontalDecays = 0;
                this.makeLinks = true;
                this.makeTriangleOrSquare = true;
                this.makeLine = true;
                this.oneMoreVertexForOddLine = false;
                this.markCorner = true;
                this.markBorder = true;
                this.markCenter = true;
                this.putAVertexOnlyAtXYZCheckingThisCondition = null;
                this.maille = Maille.quad;
                this.topology = Topology.flat;
                this.flatVersusNaturalShape = true;
                this.OUT_paramToVertex = new mathis.HashMap();
            }
            Regular2dPlus.prototype.inverseXY = function (xyz) {
                var x = xyz.x;
                xyz.x = xyz.y;
                xyz.y = x;
            };
            Regular2dPlus.prototype.go = function () {
                var inversed = (this.maille == Maille.triangleV);
                var origin = new mathis.XYZ(this.origin.x, this.origin.y, 0);
                var end = new mathis.XYZ(this.end.x, this.end.y, 0);
                var nbI = this.nbU;
                var nbJ = this.nbV;
                var nbSubInterval_I = this.nbSubInterval_U;
                var nbSubInterval_J = this.nbSubInterval_V;
                var nbVerticalDecays = this.nbVerticalDecays;
                var nbHorizontalDecays = this.nbHorizontalDecays;
                if (inversed) {
                    this.inverseXY(origin);
                    this.inverseXY(end);
                    nbI = this.nbV;
                    nbJ = this.nbU;
                    nbSubInterval_I = this.nbSubInterval_V;
                    nbSubInterval_J = this.nbSubInterval_U;
                    nbVerticalDecays = this.nbHorizontalDecays;
                    nbHorizontalDecays = this.nbVerticalDecays;
                }
                var basisCrea = new BasisForRegularReseau();
                basisCrea.nbU = (nbI - 1) * nbSubInterval_I + 1;
                if (this.adaptVForRegularReseau) {
                    if (inversed)
                        basisCrea.set_nbU_toHaveRegularReseau = true;
                    else
                        basisCrea.set_nbV_toHaveRegularReseau = true;
                }
                basisCrea.nbV = (nbJ - 1) * nbSubInterval_J + 1;
                basisCrea.origin = origin;
                basisCrea.end = end;
                basisCrea.nbVerticalDecays = nbVerticalDecays;
                basisCrea.nbHorizontalDecays = nbHorizontalDecays;
                basisCrea.squareMailleInsteadOfTriangle = !this.triangle;
                var VV = basisCrea.go();
                var creator = new Regular2d();
                creator.dirU.copyFrom(VV.dirU);
                creator.dirV.copyFrom(VV.dirV);
                creator.nbU = VV.nbU;
                creator.nbV = VV.nbV;
                creator.origine.copyFrom(basisCrea.origin);
                creator.squareVersusTriangleMaille = !this.triangle;
                this.OUT_paramToVertex = creator.OUT_paramToVertex;
                creator.makeLinks = this.makeLinks;
                creator.makeTriangleOrSquare = this.makeTriangleOrSquare;
                creator.oneMoreVertexForOddLine = this.oneMoreVertexForOddLine;
                creator.holeParameters = this.holeParameters;
                creator.markCorner = this.markCorner;
                creator.markBorder = this.markBorder;
                creator.markCenter = this.markCenter;
                creator.putAVertexOnlyAtXYZCheckingThisCondition = this.putAVertexOnlyAtXYZCheckingThisCondition;
                var mamesh = creator.go();
                if (inversed) {
                    for (var _i = 0, _a = mamesh.vertices; _i < _a.length; _i++) {
                        var vert = _a[_i];
                        this.inverseXY(vert.position);
                    }
                }
                this.subdivisionsAndLines(mamesh, nbSubInterval_I, nbSubInterval_J);
                return mamesh;
            };
            Object.defineProperty(Regular2dPlus.prototype, "triangle", {
                get: function () {
                    return (this.maille == Maille.triangleV || this.maille == Maille.triangleH);
                },
                enumerable: true,
                configurable: true
            });
            Regular2dPlus.prototype.subdivisionsAndLines = function (mamesh, nbSubInterval_I, nbSubInterval_J) {
                var startingVertices = [];
                if (!this.triangle) {
                    for (var _i = 0, _a = mamesh.vertices; _i < _a.length; _i++) {
                        var vert = _a[_i];
                        if (vert.param.x % nbSubInterval_I == 0 && vert.param.y % nbSubInterval_J == 0) {
                            vert.dichoLevel = 0;
                            startingVertices.push(vert);
                        }
                        else
                            vert.dichoLevel = 1;
                    }
                }
                else {
                    var space = this.nbSubInterval_U;
                    for (var _b = 0, _c = mamesh.vertices; _b < _c.length; _b++) {
                        var vertex = _c[_b];
                        if (vertex.param.x % space == 0 && vertex.param.y % (2 * space) == 0) {
                            vertex.dichoLevel = 0;
                            startingVertices.push(vertex);
                        }
                        else if (vertex.param.x % space == Math.ceil(space / 2) && vertex.param.y % (2 * space) == space) {
                            vertex.dichoLevel = 0;
                            startingVertices.push(vertex);
                        }
                        else
                            vertex.dichoLevel = 1;
                    }
                }
                if (this.makeLine) {
                    var lineBuilder = new mathis.lineModule.LineComputer(mamesh);
                    lineBuilder.startingVertices = startingVertices;
                    mamesh.lines = lineBuilder.go();
                }
            };
            return Regular2dPlus;
        }());
        reseau.Regular2dPlus = Regular2dPlus;
        var Regular1D = (function () {
            function Regular1D(size) {
                if (size === void 0) { size = 5; }
                this.size = size;
                this.origin = new mathis.XYZ(0, 0, 0);
                this.end = new mathis.XYZ(1, 0, 0);
            }
            Regular1D.prototype.go = function () {
                if (this.size == null || this.size <= 0)
                    throw 'non valide size:' + this.size;
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
                this.nbU = 3;
                this.nbV = 3;
                this.nbW = 3;
                this.dirU = new mathis.XYZ(1, 0, 0);
                this.dirV = new mathis.XYZ(0, 1, 0);
                this.dirW = new mathis.XYZ(0, 0, 1);
                this.origine = new mathis.XYZ(0, 0, 0);
                this.decayOddStrates = false;
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
                var xDecay = new mathis.XYZ(0, 0, 0);
                if (this.decayOddStrates)
                    xDecay.add(this.dirU).scale(0.5);
                for (var k = 0; k < this.nbW; k++) {
                    var twoD = new Regular2d();
                    twoD.makeTriangleOrSquare = this.makeTriangleOrSquare;
                    twoD.makeLinks = true;
                    twoD.oneMoreVertexForOddLine = this.oneMoreVertexForOddLine;
                    twoD.squareVersusTriangleMaille = this.strateHaveSquareMailleVersusTriangleMaille;
                    twoD.nbU = this.nbU;
                    twoD.nbV = this.nbV;
                    twoD.fixedW = k;
                    twoD.dirU = this.dirU;
                    twoD.dirV = this.dirV;
                    twoD.dirW.copyFrom(this.dirW);
                    twoD.origine = mathis.XYZ.newFrom(this.origine);
                    if (k % 2 == 1)
                        twoD.origine.substract(xDecay);
                    twoD.putAVertexOnlyAtXYZCheckingThisCondition = this.putAVertexOnlyAtXYZCheckingThisCondition;
                    var twoDimMamesh = twoD.go();
                    for (var _i = 0, _a = twoD.OUT_paramToVertex.allEntries(); _i < _a.length; _i++) {
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
                    if (cell.param.z % 2 == 0) {
                        makeLinksFromDeltaParam(cell, mathis.XYZ.temp0(1, 0, 1), mathis.XYZ.temp1(0, 0, -1), _this.paramToVertex);
                        makeLinksFromDeltaParam(cell, mathis.XYZ.temp0(0, 0, 1), mathis.XYZ.temp1(1, 0, -1), _this.paramToVertex);
                    }
                    else {
                        makeLinksFromDeltaParam(cell, mathis.XYZ.temp0(0, 0, 1), mathis.XYZ.temp1(-1, 0, -1), _this.paramToVertex);
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
var mathis;
(function (mathis) {
    var spacialTransformations;
    (function (spacialTransformations) {
        var RoundSomeStrates = (function () {
            function RoundSomeStrates(mamesh) {
                this.propBeginToRound = 0;
                this.propEndToRound = 1;
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
                            var length_6 = newPosition.length();
                            var ratio = Math.pow(referenceRadius / length_6, this.exponentOfRoundingFunction);
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
                    mathis.geo.multiplicationVectorMatrix(mat, v.position, v.position);
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
        function toPositionsList(verticesOrPositions) {
            var positions;
            if (verticesOrPositions[0] instanceof mathis.XYZ)
                positions = verticesOrPositions;
            else {
                positions = [];
                for (var _i = 0, _a = verticesOrPositions; _i < _a.length; _i++) {
                    var v = _a[_i];
                    positions.push(v.position);
                }
            }
            return positions;
        }
        function affineTransformation_4vec(verticesOrPositions, v0, v1, v2, v3, w0, w1, w2, w3) {
            var positions = toPositionsList(verticesOrPositions);
            var mat = new mathis.MM();
            mathis.geo.affineTransformation_4vec(v0, v1, v2, v3, w0, w1, w2, w3, mat);
            for (var _i = 0, positions_2 = positions; _i < positions_2.length; _i++) {
                var v = positions_2[_i];
                mathis.geo.multiplicationVectorMatrix(mat, v, v);
            }
        }
        spacialTransformations.affineTransformation_4vec = affineTransformation_4vec;
        function affineTransformation_3vec(verticesOrPositions, v0, v1, v2, w0, w1, w2) {
            var positions = toPositionsList(verticesOrPositions);
            var mat = new mathis.MM();
            mathis.geo.affineTransformation_3vec(v0, v1, v2, w0, w1, w2, mat);
            for (var _i = 0, positions_3 = positions; _i < positions_3.length; _i++) {
                var v = positions_3[_i];
                mathis.geo.multiplicationVectorMatrix(mat, v, v);
            }
        }
        spacialTransformations.affineTransformation_3vec = affineTransformation_3vec;
        function quadTransformation_4vec(verticesOrPositions, v0, v1, v2, v3, w0, w1, w2, w3) {
            var positions = toPositionsList(verticesOrPositions);
            var positions1 = [];
            for (var _i = 0, positions_4 = positions; _i < positions_4.length; _i++) {
                var v = positions_4[_i];
                positions1.push(mathis.XYZ.newFrom(v));
            }
            var positions2 = [];
            for (var _a = 0, positions_5 = positions; _a < positions_5.length; _a++) {
                var v = positions_5[_a];
                positions2.push(mathis.XYZ.newFrom(v));
            }
            affineTransformation_3vec(positions1, v0, v1, v2, w0, w1, w2);
            affineTransformation_3vec(positions2, v0, v2, v3, w0, w2, w3);
            for (var i = 0; i < positions.length; i++) {
                var a = mathis.geo.distance(positions[i], v1);
                var b = mathis.geo.distance(positions[i], v3);
                var ab = a + b;
                mathis.geo.baryCenter([positions1[i], positions2[i]], [b / ab, a / ab], positions[i]);
            }
        }
        spacialTransformations.quadTransformation_4vec = quadTransformation_4vec;
    })(spacialTransformations = mathis.spacialTransformations || (mathis.spacialTransformations = {}));
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    var symmetries;
    (function (symmetries_2) {
        symmetries_2.squareMainSymmetries = [function (a) { return new mathis.XYZ(1 - a.x, a.y, a.z); }, function (a) { return new mathis.XYZ(a.x, 1 - a.y, a.z); }, function (a) { return new mathis.XYZ(1 - a.x, 1 - a.y, a.z); }];
        var keyWords;
        (function (keyWords) {
            keyWords.verticalAxis = 'symI';
            keyWords.horizontalAxis = 'symJ';
            keyWords.slashAxis = 'symIJ';
            keyWords.rotation = 'rotation';
        })(keyWords = symmetries_2.keyWords || (symmetries_2.keyWords = {}));
        function cartesian(nbI, nbJ, oneMoreVertexForOddLine) {
            if (oneMoreVertexForOddLine === void 0) { oneMoreVertexForOddLine = false; }
            var symmetries = new mathis.StringMap();
            symmetries.putValue(keyWords.verticalAxis, function (v) {
                var hereNbI = nbI;
                if (v.y % 2 == 1 && oneMoreVertexForOddLine)
                    hereNbI++;
                return new mathis.XYZ(hereNbI - 1 - v.x, v.y, v.z);
            });
            symmetries.putValue(keyWords.horizontalAxis, function (v) {
                return new mathis.XYZ(v.x, nbJ - 1 - v.y, v.z);
            });
            symmetries.putValue(keyWords.slashAxis, function (v) {
                var hereNbI = nbI;
                if (v.y % 2 == 1 && oneMoreVertexForOddLine)
                    hereNbI++;
                return new mathis.XYZ(hereNbI - 1 - v.x, nbJ - 1 - v.y, v.z);
            });
            return symmetries;
        }
        symmetries_2.cartesian = cartesian;
        function cartesianAsArray(nbI, nbJ, oneMoreVertexForOddLine) {
            if (oneMoreVertexForOddLine === void 0) { oneMoreVertexForOddLine = false; }
            var symDic = cartesian(nbI, nbJ, oneMoreVertexForOddLine);
            var res = [];
            for (var _i = 0, _a = symDic.allValues(); _i < _a.length; _i++) {
                var sym = _a[_i];
                res.push(sym);
            }
            return res;
        }
        symmetries_2.cartesianAsArray = cartesianAsArray;
        function polygonRotations(nbSides) {
            var symmetries = new mathis.StringMap();
            var _loop_4 = function (t) {
                var angle = Math.PI * 2 / nbSides * t;
                symmetries.putValue(keyWords.rotation + t, function (param) {
                    var res = new mathis.XYZ(0, 0, 0);
                    res.x = param.x * Math.cos(angle) - param.y * Math.sin(angle);
                    res.y = param.x * Math.sin(angle) + param.y * Math.cos(angle);
                    res.z = param.z;
                    return res;
                });
            };
            for (var t = 1; t < nbSides; t++) {
                _loop_4(t);
            }
            return symmetries;
        }
        symmetries_2.polygonRotations = polygonRotations;
        function getAllPolygonalRotations(nbSides) {
            var symMap = polygonRotations(nbSides);
            var res = [];
            for (var _i = 0, _a = symMap.allValues(); _i < _a.length; _i++) {
                var sym = _a[_i];
                res.push(sym);
            }
            return res;
        }
        symmetries_2.getAllPolygonalRotations = getAllPolygonalRotations;
    })(symmetries = mathis.symmetries || (mathis.symmetries = {}));
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    var tab;
    (function (tab) {
        function maxIndex(list) {
            if (list == null || list.length == 0)
                throw 'empty list';
            var maxValue = list[0];
            var maxIndex = 0;
            for (var i = 1; i < list.length; i++) {
                if (list[i] > maxValue) {
                    maxValue = list[i];
                    maxIndex = i;
                }
            }
            return maxIndex;
        }
        tab.maxIndex = maxIndex;
        function maxValue(list) {
            return list[maxIndex(list)];
        }
        tab.maxValue = maxValue;
        function maxValueString(list) {
            return list[maxIndex(list)];
        }
        tab.maxValueString = maxValueString;
        function minIndex(list) {
            if (list == null || list.length == 0)
                throw 'empty list';
            var maxValue = list[0];
            var maxIndex = 0;
            for (var i = 1; i < list.length; i++) {
                if (list[i] < maxValue) {
                    maxValue = list[i];
                    maxIndex = i;
                }
            }
            return maxIndex;
        }
        tab.minIndex = minIndex;
        function minValue(list) {
            return list[minIndex(list)];
        }
        tab.minValue = minValue;
        function minValueString(list) {
            return list[minIndex(list)];
        }
        tab.minValueString = minValueString;
        function minIndexOb(list, comparisonFunction) {
            if (list == null || list.length == 0)
                throw 'empty list';
            var minValue = list[0];
            var minIndex = 0;
            for (var i = 1; i < list.length; i++) {
                if (comparisonFunction(list[i], minValue) < 0) {
                    minValue = list[i];
                    minIndex = i;
                }
            }
            return minIndex;
        }
        tab.minIndexOb = minIndexOb;
        function minValueOb(list, comparisonFunction) {
            return list[minIndexOb(list, comparisonFunction)];
        }
        tab.minValueOb = minValueOb;
        function clearArray(array) {
            while (array.length > 0)
                array.pop();
        }
        tab.clearArray = clearArray;
        function removeFromArray(array, object) {
            var index = array.indexOf(object);
            if (index != -1)
                array.splice(index, 1);
            else {
                cc("l'objet n'est pas dans le tableau", object);
                throw "l'objet précédent n'est pas dans le tableau:";
            }
        }
        tab.removeFromArray = removeFromArray;
        function arrayMinusElements(array, criteriumToSuppress) {
            var res = [];
            for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
                var elem = array_1[_i];
                if (!criteriumToSuppress(elem))
                    res.push(elem);
            }
            return res;
        }
        tab.arrayMinusElements = arrayMinusElements;
        function arrayKeepingSomeIndices(array, indicesToKeep) {
            var res = [];
            for (var i = 0; i < array.length; i++) {
                if (indicesToKeep.indexOf(i) != -1)
                    res.push(array[i]);
            }
            return res;
        }
        tab.arrayKeepingSomeIndices = arrayKeepingSomeIndices;
        function arrayMinusSomeIndices(array, indicesSuppress) {
            var res = [];
            for (var i = 0; i < array.length; i++) {
                if (indicesSuppress.indexOf(i) == -1)
                    res.push(array[i]);
            }
            return res;
        }
        tab.arrayMinusSomeIndices = arrayMinusSomeIndices;
        function arrayMinusBlocksIndices(list, indicesOfBlocksToRemove, blockSize) {
            var res = [];
            for (var i = 0; i < list.length; i += blockSize) {
                if (indicesOfBlocksToRemove.indexOf(i) == -1) {
                    for (var j = 0; j < blockSize; j++) {
                        res.push(list[i + j]);
                    }
                }
            }
            return res;
        }
        tab.arrayMinusBlocksIndices = arrayMinusBlocksIndices;
        function minIndexOfNumericList(list) {
            var minValue = Number.MAX_VALUE;
            var minIndex = -1;
            for (var i = 0; i < list.length; i++) {
                if (list[i] < minValue) {
                    minValue = list[i];
                    minIndex = i;
                }
            }
            if (minIndex == -1)
                mathis.logger.c('an empty line has no minimum');
            return minIndex;
        }
        tab.minIndexOfNumericList = minIndexOfNumericList;
        function maxIndexOfNumericList(list) {
            var maxValue = Number.NEGATIVE_INFINITY;
            var maxIndex = -1;
            for (var i = 0; i < list.length; i++) {
                if (list[i] > maxValue) {
                    maxValue = list[i];
                    maxIndex = i;
                }
            }
            return maxIndex;
        }
        tab.maxIndexOfNumericList = maxIndexOfNumericList;
        function minIndexOfStringList(list) {
            if (list.length == 0) {
                mathis.logger.c('an empty line has no minimum');
                return -1;
            }
            var minValue = list[0];
            var minIndex = 0;
            for (var i = 0; i < list.length; i++) {
                if (list[i] < minValue) {
                    minValue = list[i];
                    minIndex = i;
                }
            }
            return minIndex;
        }
        tab.minIndexOfStringList = minIndexOfStringList;
        function indicesUpPermutationToString(indices) {
            var minIndex = minIndexOfNumericList(indices);
            var permuted = [];
            for (var i = 0; i < indices.length; i++) {
                permuted[i] = indices[(i + minIndex) % indices.length];
            }
            return JSON.stringify(permuted);
        }
        tab.indicesUpPermutationToString = indicesUpPermutationToString;
        var ArrayMinusBlocksElements = (function () {
            function ArrayMinusBlocksElements(longList, blockSize, listToRemove) {
                this.dicoOfExistingBlocks = {};
                this.removeAlsoCircularPermutation = true;
                this.longList = longList;
                this.blockSize = blockSize;
                if (listToRemove == null) {
                    this.listToRemove = longList;
                    this.removeOnlyDoublon = true;
                }
                else {
                    this.listToRemove = listToRemove;
                    this.removeOnlyDoublon = false;
                }
            }
            ArrayMinusBlocksElements.prototype.go = function () {
                for (var i = 0; i < this.listToRemove.length; i += this.blockSize) {
                    try {
                        var block = [];
                        for (var j = 0; j < this.blockSize; j++)
                            block.push(this.listToRemove[i + j].hashString);
                        this.dicoOfExistingBlocks[this.key(block)] = 1;
                    }
                    catch (e) {
                        throw "a block is not in your list";
                    }
                }
                var newLongList = [];
                for (var i = 0; i < this.longList.length; i += this.blockSize) {
                    var block = [];
                    for (var j = 0; j < this.blockSize; j++)
                        block.push(this.longList[i + j].hashString);
                    if (!this.removeOnlyDoublon) {
                        if (this.dicoOfExistingBlocks[this.key(block)] == null) {
                            for (var j = 0; j < this.blockSize; j++)
                                newLongList.push(this.longList[i + j]);
                        }
                    }
                    else {
                        if (this.dicoOfExistingBlocks[this.key(block)] == 1) {
                            for (var j = 0; j < this.blockSize; j++)
                                newLongList.push(this.longList[i + j]);
                            this.dicoOfExistingBlocks[this.key(block)]++;
                        }
                    }
                }
                return newLongList;
            };
            ArrayMinusBlocksElements.prototype.key = function (list) {
                var rearangedList = [];
                if (!this.removeAlsoCircularPermutation)
                    rearangedList = list;
                else {
                    rearangedList = [];
                    var minIndex_1 = minIndexOfStringList(list);
                    for (var i = 0; i < list.length; i++)
                        rearangedList[i] = list[(i + minIndex_1) % list.length];
                }
                var key = "";
                rearangedList.forEach(function (nu) {
                    key += nu + ',';
                });
                return key;
            };
            return ArrayMinusBlocksElements;
        }());
        tab.ArrayMinusBlocksElements = ArrayMinusBlocksElements;
    })(tab = mathis.tab || (mathis.tab = {}));
})(mathis || (mathis = {}));
var cc;
var showDevMessages = true;
if (showDevMessages) {
    cc = console.log.bind(window.console);
}
else
    cc = function () { };
var mathis;
(function (mathis) {
    mathis.deconnectViewerForTest = false;
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    var proba;
    (function (proba) {
        var Random = (function () {
            function Random(seed) {
                if (seed === void 0) { seed = 1234567; }
                this.seed = seed;
            }
            Random.prototype.pseudoRand = function () {
                var max = Math.pow(2, 32);
                this.seed += (this.seed * this.seed) | 5;
                return (this.seed >>> 32) / max;
            };
            Random.prototype.pseudoRandInt = function (size) {
                var res = Math.floor(size * this.pseudoRand());
                if (res == size)
                    res--;
                return res;
            };
            return Random;
        }());
        proba.Random = Random;
        var Gaussian = (function () {
            function Gaussian() {
                this.mean = 0;
                this.stdev = 1;
                this.knuthVersusBowMuller = true;
                this.use_last = false;
            }
            Gaussian.prototype.go = function () {
                if (this.knuthVersusBowMuller)
                    return this.knuth();
                else
                    return this.bowMuller();
            };
            Gaussian.prototype.bowMuller = function () {
                var u = 1 - Math.random();
                var v = 1 - Math.random();
                return this.mean + this.stdev * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
            };
            Gaussian.prototype.knuth = function () {
                var y1;
                if (this.use_last) {
                    y1 = this.y2;
                    this.use_last = false;
                }
                else {
                    var x1, x2, w;
                    do {
                        x1 = 2.0 * Math.random() - 1.0;
                        x2 = 2.0 * Math.random() - 1.0;
                        w = x1 * x1 + x2 * x2;
                    } while (w >= 1.0);
                    w = Math.sqrt((-2.0 * Math.log(w)) / w);
                    y1 = x1 * w;
                    this.y2 = x2 * w;
                    this.use_last = true;
                }
                var retval = this.mean + this.stdev * y1;
                if (retval > 0)
                    return retval;
                return -retval;
            };
            return Gaussian;
        }());
        proba.Gaussian = Gaussian;
        function gaussian(mean, stdev) {
            var y2;
            var use_last = false;
            return function () {
                var y1;
                if (use_last) {
                    y1 = y2;
                    use_last = false;
                }
                else {
                    var x1, x2, w;
                    do {
                        x1 = 2.0 * Math.random() - 1.0;
                        x2 = 2.0 * Math.random() - 1.0;
                        w = x1 * x1 + x2 * x2;
                    } while (w >= 1.0);
                    w = Math.sqrt((-2.0 * Math.log(w)) / w);
                    y1 = x1 * w;
                    y2 = x2 * w;
                    use_last = true;
                }
                var retval = mean + stdev * y1;
                if (retval > 0)
                    return retval;
                return -retval;
            };
        }
        proba.gaussian = gaussian;
        var StableLaw = (function () {
            function StableLaw() {
                this.nbSimu = 1;
                this.alpha = 1.5;
                this.beta = 0;
                this.sigma = 1;
                this.mu = 0;
                this.basicGenerator = Math.random;
            }
            StableLaw.prototype.checkArgs = function () {
                if (this.alpha > 2 || this.alpha <= 0)
                    throw 'alpha must be in (0,2]';
                if (this.beta < -1 || this.beta > 1)
                    throw 'beta must be in [-1,1]';
            };
            StableLaw.prototype.go = function () {
                this.checkArgs();
                var X = [];
                for (var i = 0; i < this.nbSimu; i++) {
                    var V = this.basicGenerator() * Math.PI - Math.PI / 2;
                    var W = -Math.log(this.basicGenerator());
                    if (this.alpha != 1) {
                        var ta = Math.tan(Math.PI * this.alpha / 2);
                        var B = Math.atan(this.beta * ta) / this.alpha;
                        var S = (1 + this.beta ^ 2 * ta ^ 2) ^ (1 / 2 / this.alpha);
                        X[i] = S * Math.sin(this.alpha * (V + B)) / (Math.pow((Math.cos(V)), (1 / this.alpha)))
                            * Math.pow((Math.cos(V - this.alpha * (V + B)) / W), ((1 - this.alpha) / this.alpha));
                        X[i] = this.sigma * X[i] + this.mu;
                    }
                    else if (this.alpha == 1) {
                        X[i] = 2 / Math.PI * ((Math.PI / 2 + this.beta * V) * Math.tan(V) - this.beta * Math.log(W * Math.cos(V) / (Math.PI / 2 + this.beta * V)));
                        X[i] = this.sigma * X[i] + 2 / Math.PI * this.beta * this.sigma * Math.log(this.sigma) + this.mu;
                    }
                }
                return X;
            };
            return StableLaw;
        }());
        proba.StableLaw = StableLaw;
    })(proba = mathis.proba || (mathis.proba = {}));
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    var octavioBoard;
    (function (octavioBoard) {
        var PartShape;
        (function (PartShape) {
            PartShape[PartShape["triangulatedTriangle"] = 0] = "triangulatedTriangle";
            PartShape[PartShape["triangulatedRect"] = 1] = "triangulatedRect";
            PartShape[PartShape["square"] = 2] = "square";
            PartShape[PartShape["polygon3"] = 3] = "polygon3";
            PartShape[PartShape["polygon4"] = 4] = "polygon4";
            PartShape[PartShape["polygon5"] = 5] = "polygon5";
            PartShape[PartShape["polygon6"] = 6] = "polygon6";
            PartShape[PartShape["polygon7"] = 7] = "polygon7";
            PartShape[PartShape["polygon8"] = 8] = "polygon8";
            PartShape[PartShape["polygon9"] = 9] = "polygon9";
            PartShape[PartShape["polygon10"] = 10] = "polygon10";
            PartShape[PartShape["polygon11"] = 11] = "polygon11";
            PartShape[PartShape["polygon12"] = 12] = "polygon12";
        })(PartShape = octavioBoard.PartShape || (octavioBoard.PartShape = {}));
        var PrimaryType;
        (function (PrimaryType) {
            PrimaryType[PrimaryType["concentric"] = 0] = "concentric";
            PrimaryType[PrimaryType["patchwork"] = 1] = "patchwork";
            PrimaryType[PrimaryType["polyhedron"] = 2] = "polyhedron";
        })(PrimaryType = octavioBoard.PrimaryType || (octavioBoard.PrimaryType = {}));
        var SuppressLinkWithoutOpposite;
        (function (SuppressLinkWithoutOpposite) {
            SuppressLinkWithoutOpposite[SuppressLinkWithoutOpposite["forNonBorder"] = 0] = "forNonBorder";
            SuppressLinkWithoutOpposite[SuppressLinkWithoutOpposite["forVertexWithAtLeast5links"] = 1] = "forVertexWithAtLeast5links";
            SuppressLinkWithoutOpposite[SuppressLinkWithoutOpposite["none"] = 2] = "none";
        })(SuppressLinkWithoutOpposite = octavioBoard.SuppressLinkWithoutOpposite || (octavioBoard.SuppressLinkWithoutOpposite = {}));
        var ConcentricDescription = (function () {
            function ConcentricDescription() {
                this.primaryType = PrimaryType.concentric;
                this.shapes = [PartShape.square];
                this.proportions = [new mathis.UV(1, 1)];
                this.exponentOfRoundingFunction = [1];
                this.nbPatches = 2;
                this.individualScales = [new mathis.UV(1, 1)];
                this.individualRotations = [0];
                this.individualTranslation = [new mathis.XYZ(0, 0, 0)];
                this.nbI = 8;
                this.nbJ = null;
                this.percolationProba = [0];
                this.scalingBeforeOppositeLinkAssociations = null;
                this.proportionOfSeeds = [0.1];
                this.stratesToSuppressFromCorners = [0];
                this.asymetriesForSeeds = null;
                this.suppressLinksWithoutOpposite = SuppressLinkWithoutOpposite.forVertexWithAtLeast5links;
                this.doLineBifurcations = true;
            }
            return ConcentricDescription;
        }());
        octavioBoard.ConcentricDescription = ConcentricDescription;
        var PatchworkDescription = (function (_super) {
            __extends(PatchworkDescription, _super);
            function PatchworkDescription() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.primaryType = PrimaryType.patchwork;
                _this.nbPatchesI = 2;
                _this.nbPatchesJ = 2;
                _this.patchesInQuinconce = false;
                _this.oddPatchLinesAreTheSameVersusLongerVersusShorter = 0;
                _this.alternateShapeAccordingIPlusJVersusCounter = true;
                return _this;
            }
            return PatchworkDescription;
        }(ConcentricDescription));
        octavioBoard.PatchworkDescription = PatchworkDescription;
        var Concentric = (function () {
            function Concentric() {
                this.desc = new ConcentricDescription();
                this.SUB_gratAndStick = new mathis.grateAndGlue.ConcurrentMameshesGraterAndSticker();
                this.SUB_oppositeLinkAssocierByAngles = new mathis.linkModule.OppositeLinkAssocierByAngles(null);
                this.SUB_mameshCleaner = new MameshCleaner(null);
                this.origine = new mathis.XYZ(0, 0, 0);
                this.end = new mathis.XYZ(1, 1, 0);
                this.toleranceToBeOneOfTheClosest = 0.55;
                this.forceToGrate = [0.1];
                this.finalize = true;
                this.OUT_corner = [];
            }
            Concentric.prototype.go = function () {
                this.SUB_gratAndStick.SUB_grater.proportionOfSeeds =
                    this.desc.proportionOfSeeds;
                this.SUB_gratAndStick.SUB_grater.asymmetriesForSeeds = this.desc.asymetriesForSeeds;
                this.SUB_oppositeLinkAssocierByAngles.canCreateBifurcations = this.desc.doLineBifurcations;
                if (this.desc.nbJ == null)
                    this.desc.nbJ = this.desc.nbI;
                var subMa = [];
                var _loop_5 = function (j) {
                    var indexModulo = (j) % this_2.desc.shapes.length;
                    var partShape = this_2.desc.shapes[indexModulo];
                    var name_1 = PartShape[partShape];
                    var nI = Math.round(this_2.desc.nbI * this_2.desc.proportions[j % this_2.desc.proportions.length].u);
                    var nJ = Math.round(this_2.desc.nbJ * this_2.desc.proportions[j % this_2.desc.proportions.length].v);
                    var radiusI = 0.5 * this_2.desc.individualScales[j % this_2.desc.individualScales.length].u * this_2.desc.proportions[j % this_2.desc.proportions.length].u;
                    var radiusJ = 0.5 * this_2.desc.individualScales[j % this_2.desc.individualScales.length].v * this_2.desc.proportions[j % this_2.desc.proportions.length].v;
                    var mamesh = void 0;
                    if (name_1.indexOf('polygon') != -1) {
                        var nbSides = parseInt(name_1.slice(7, name_1.length));
                        var crea = new mathis.reseau.TriangulatedPolygone(nbSides);
                        crea.origin = new mathis.XYZ(-radiusI, -radiusJ, 0);
                        crea.end = new mathis.XYZ(radiusI, radiusJ, 0);
                        crea.nbSubdivisionInARadius = Math.floor((nI + nJ) / 4);
                        mamesh = crea.go();
                    }
                    else if (partShape == PartShape.square || partShape == PartShape.triangulatedRect) {
                        var gene = new mathis.reseau.BasisForRegularReseau();
                        gene.origin = new mathis.XYZ(-radiusI, -radiusJ, 0);
                        gene.end = new mathis.XYZ(radiusI, radiusJ, 0);
                        gene.nbU = nI;
                        gene.nbV = nJ;
                        if (partShape == PartShape.triangulatedRect)
                            gene.squareMailleInsteadOfTriangle = false;
                        gene.go();
                        var regular = new mathis.reseau.Regular2d(gene);
                        if (partShape == PartShape.triangulatedRect)
                            regular.oneMoreVertexForOddLine = true;
                        mamesh = regular.go();
                    }
                    else if (partShape == PartShape.triangulatedTriangle) {
                        var creator = new mathis.reseau.TriangulatedTriangle();
                        creator.origin = new mathis.XYZ(-radiusI, -radiusJ, 0);
                        creator.end = new mathis.XYZ(radiusI, radiusJ, 0);
                        creator.nbU = (nI + nJ) / 2;
                        mamesh = creator.go();
                    }
                    else
                        throw "partShape non reconnue";
                    if (j == 0) {
                        for (var _i = 0, _a = mamesh.vertices; _i < _a.length; _i++) {
                            var v = _a[_i];
                            if (v.hasMark(mathis.Vertex.Markers.corner)) {
                                this_2.OUT_corner.push(v);
                            }
                        }
                    }
                    if (this_2.desc.propBeginToRound || this_2.desc.propEndToRound || this_2.desc.integerBeginToRound || this_2.desc.integerEndToRound) {
                        var rounder = new mathis.spacialTransformations.RoundSomeStrates(mamesh);
                        if (this_2.desc.propBeginToRound == null)
                            rounder.propBeginToRound = 0;
                        else
                            rounder.propBeginToRound = this_2.desc.propBeginToRound[j % this_2.desc.propBeginToRound.length];
                        if (this_2.desc.propEndToRound == null)
                            rounder.propEndToRound = 1;
                        else
                            rounder.propEndToRound = this_2.desc.propEndToRound[j % this_2.desc.propEndToRound.length];
                        if (this_2.desc.integerBeginToRound != null)
                            rounder.integerBeginToRound = this_2.desc.integerBeginToRound[j % this_2.desc.integerBeginToRound.length];
                        if (this_2.desc.integerEndToRound != null)
                            rounder.integerEndToRound = this_2.desc.integerEndToRound[j % this_2.desc.integerEndToRound.length];
                        rounder.exponentOfRoundingFunction = this_2.desc.exponentOfRoundingFunction[j % this_2.desc.exponentOfRoundingFunction.length];
                        rounder.referenceRadiusIsMinVersusMaxVersusMean = 2;
                        rounder.preventStratesCrossings = true;
                        rounder.goChanging();
                    }
                    var percolation = this_2.desc.percolationProba[j * this_2.desc.percolationProba.length];
                    if (percolation > 0) {
                        var percolator = new mathis.mameshModification.PercolationOnLinks(mamesh);
                        percolator.percolationProba = percolation;
                        percolator.goChanging();
                    }
                    if (this_2.desc.stratesToSuppressFromCorners[j % this_2.desc.stratesToSuppressFromCorners.length] > 0) {
                        var supp = new mathis.grateAndGlue.ExtractCentralPart(mamesh, this_2.desc.stratesToSuppressFromCorners[j % this_2.desc.stratesToSuppressFromCorners.length]);
                        supp.suppressFromBorderVersusCorner = false;
                        mamesh = supp.go();
                        mamesh.isolateMameshVerticesFromExteriorVertices();
                    }
                    subMa.push(mamesh);
                    var decay = this_2.desc.individualTranslation[j % this_2.desc.individualTranslation.length];
                    var angle = this_2.desc.individualRotations[j % this_2.desc.individualRotations.length];
                    var mat = new mathis.MM();
                    mathis.geo.axisAngleToMatrix(new mathis.XYZ(0, 0, -1), angle, mat);
                    mamesh.vertices.forEach(function (v) {
                        mathis.geo.multiplicationVectorMatrix(mat, v.position, v.position);
                        v.position.add(decay);
                    });
                };
                var this_2 = this;
                for (var j = 0; j < this.desc.nbPatches; j++) {
                    _loop_5(j);
                }
                var res;
                if (this.desc.nbPatches > 1) {
                    this.SUB_gratAndStick.IN_mameshes = subMa;
                    this.SUB_gratAndStick.toleranceToBeOneOfTheClosest = this.toleranceToBeOneOfTheClosest;
                    this.SUB_gratAndStick.SUB_grater.proportionOfSeeds = this.forceToGrate;
                    res = this.SUB_gratAndStick.goChanging();
                }
                else {
                    res = subMa[0];
                    mathis.spacialTransformations.adjustInASquare(res, new mathis.XYZ(0, 0, 0), new mathis.XYZ(1, 1, 0));
                    res.clearOppositeInLinks();
                }
                if (this.desc.scalingBeforeOppositeLinkAssociations != null)
                    mathis.spacialTransformations.adjustInASquare(res, new mathis.XYZ(0, 0, 0), new mathis.XYZ(this.desc.scalingBeforeOppositeLinkAssociations.x, this.desc.scalingBeforeOppositeLinkAssociations.y, 0));
                if (this.finalize) {
                    this.SUB_oppositeLinkAssocierByAngles.vertices = res.vertices;
                    this.SUB_oppositeLinkAssocierByAngles.goChanging();
                    this.SUB_mameshCleaner.suppressLinksWithoutOpposite = this.desc.suppressLinksWithoutOpposite;
                    this.SUB_mameshCleaner.IN_mamesh = res;
                    this.SUB_mameshCleaner.goChanging();
                }
                mathis.spacialTransformations.adjustInASquare(res, this.origine, this.end);
                return res;
            };
            return Concentric;
        }());
        octavioBoard.Concentric = Concentric;
        var Patchwork = (function (_super) {
            __extends(Patchwork, _super);
            function Patchwork() {
                var _this = _super.call(this) || this;
                _this.desc = new PatchworkDescription();
                _this.desc.nbPatches = 0;
                _this.desc.individualTranslation = [];
                return _this;
            }
            Patchwork.prototype.go = function () {
                this.desc.individualTranslation = [];
                this.desc.nbPatches = 0;
                var shapes = [];
                var count = 0;
                for (var j = 0; j < this.desc.nbPatchesJ; j++) {
                    var someMoreOrLessOfOdd = 0;
                    if (j % 2 == 1) {
                        if (this.desc.oddPatchLinesAreTheSameVersusLongerVersusShorter == 0)
                            someMoreOrLessOfOdd = 0;
                        else if (this.desc.oddPatchLinesAreTheSameVersusLongerVersusShorter == 1)
                            someMoreOrLessOfOdd = 1;
                        else if (this.desc.oddPatchLinesAreTheSameVersusLongerVersusShorter == 2)
                            someMoreOrLessOfOdd = -1;
                        else
                            throw 'must be 0 or 1 or 2';
                    }
                    for (var i = 0; i < this.desc.nbPatchesI + someMoreOrLessOfOdd; i++) {
                        this.desc.nbPatches++;
                        var dec = 0;
                        if (this.desc.patchesInQuinconce && j % 2 == 1) {
                            if (this.desc.oddPatchLinesAreTheSameVersusLongerVersusShorter == 0)
                                dec = -0.5;
                            if (this.desc.oddPatchLinesAreTheSameVersusLongerVersusShorter == 1)
                                dec = -0.5;
                            if (this.desc.oddPatchLinesAreTheSameVersusLongerVersusShorter == 2)
                                dec = 0.5;
                        }
                        this.desc.individualTranslation.push(new mathis.XYZ(i + dec, j, 0));
                        count++;
                        var ind = (this.desc.alternateShapeAccordingIPlusJVersusCounter) ? (i + someMoreOrLessOfOdd + j) : count;
                        shapes.push(this.desc.shapes[ind % this.desc.shapes.length]);
                    }
                }
                this.desc.shapes = shapes;
                return _super.prototype.go.call(this);
            };
            return Patchwork;
        }(Concentric));
        octavioBoard.Patchwork = Patchwork;
        var PolyhedronBoardDescription = (function () {
            function PolyhedronBoardDescription() {
                this.primaryType = PrimaryType.polyhedron;
                this.facesDescription = [];
                this.suppressLinksWithoutOpposite = SuppressLinkWithoutOpposite.forVertexWithAtLeast5links;
                this.nbU = 4;
                this.canCreateBifurcations = true;
            }
            return PolyhedronBoardDescription;
        }());
        octavioBoard.PolyhedronBoardDescription = PolyhedronBoardDescription;
        var PolyhedronBoard = (function () {
            function PolyhedronBoard(desc) {
                this.desc = desc;
                this.SUB_oppositeLinkAssocierByAngles = new mathis.linkModule.OppositeLinkAssocierByAngles(null);
                this.SUB_mameshCleaner = new MameshCleaner(null);
                this.finalize = true;
            }
            PolyhedronBoard.prototype.go = function () {
                for (var _i = 0, _a = this.desc.facesDescription; _i < _a.length; _i++) {
                    var desc = _a[_i];
                    desc.nbI = this.desc.nbU;
                    desc.nbJ = this.desc.nbU;
                }
                var crea = new mathis.polyhedron.Polyhedron(this.desc.polyhedronName);
                var mameshStructure = crea.go();
                var totalMamesh = null;
                if (mameshStructure.faces == null)
                    throw "no faces in this mamesh";
                cc("mameshStructure.faces.length", mameshStructure.faces.length);
                var firstOne = true;
                for (var _b = 0, _c = mameshStructure.faces; _b < _c.length; _b++) {
                    var face = _c[_b];
                    if (face.length == 3) {
                        var v0 = face[0];
                        var v1 = face[1];
                        var v2 = face[2];
                        var creator = new Concentric();
                        creator.finalize = false;
                        if (this.desc.facesDescription[3] != null)
                            creator.desc = this.desc.facesDescription[3];
                        else {
                            creator.desc = new ConcentricDescription();
                            creator.desc.nbPatches = 1;
                            creator.desc.nbI = this.desc.nbU;
                            creator.desc.shapes = [PartShape.triangulatedTriangle];
                        }
                        var subMamesh = creator.go();
                        mathis.spacialTransformations.affineTransformation_3vec(subMamesh.vertices, creator.OUT_corner[0].position, creator.OUT_corner[1].position, creator.OUT_corner[2].position, v0.position, v1.position, v2.position);
                        if (firstOne) {
                            firstOne = false;
                            totalMamesh = subMamesh;
                        }
                        else {
                            var merger = new mathis.grateAndGlue.Merger(totalMamesh, subMamesh);
                            merger.goChanging();
                        }
                    }
                    else if (face.length == 4) {
                        var v0 = face[0];
                        var v1 = face[1];
                        var v2 = face[2];
                        var creator = new Concentric();
                        creator.finalize = false;
                        if (this.desc.facesDescription[4] != null)
                            creator.desc = this.desc.facesDescription[4];
                        else {
                            creator.desc = new ConcentricDescription();
                            creator.desc.nbPatches = 1;
                            creator.desc.nbI = this.desc.nbU;
                            creator.desc.shapes = [PartShape.square];
                        }
                        var subMamesh = creator.go();
                        mathis.spacialTransformations.affineTransformation_3vec(subMamesh.vertices, new mathis.XYZ(0, 0, 0), new mathis.XYZ(1, 0, 0), new mathis.XYZ(1, 1, 0), v0.position, v1.position, v2.position);
                        if (firstOne) {
                            firstOne = false;
                            totalMamesh = subMamesh;
                        }
                        else {
                            var merger = new mathis.grateAndGlue.Merger(totalMamesh, subMamesh);
                            merger.goChanging();
                        }
                    }
                    else if (face.length == 5) {
                        var v0 = face[0];
                        var v1 = face[2];
                        var v2 = face[3];
                        var creator = new Concentric();
                        creator.finalize = false;
                        if (this.desc.facesDescription[5] != null)
                            creator.desc = this.desc.facesDescription[5];
                        else {
                            creator.desc = new ConcentricDescription();
                            creator.desc.nbPatches = 1;
                            creator.desc.nbI = (this.desc.nbU - 1) * 2;
                            creator.desc.shapes = [PartShape.polygon5];
                        }
                        var subMamesh = creator.go();
                        mathis.spacialTransformations.affineTransformation_3vec(subMamesh.vertices, creator.OUT_corner[0].position, creator.OUT_corner[2].position, creator.OUT_corner[3].position, v0.position, v1.position, v2.position);
                        if (firstOne) {
                            firstOne = false;
                            totalMamesh = subMamesh;
                        }
                        else {
                            var merger = new mathis.grateAndGlue.Merger(totalMamesh, subMamesh);
                            merger.goChanging();
                        }
                    }
                    else if (face.length == 6) {
                        var v0 = face[0];
                        var v1 = face[2];
                        var v2 = face[4];
                        var creator = new Concentric();
                        creator.finalize = false;
                        if (this.desc.facesDescription[6] != null)
                            creator.desc = this.desc.facesDescription[6];
                        else {
                            creator.desc = new ConcentricDescription();
                            creator.desc.nbPatches = 1;
                            creator.desc.nbI = (this.desc.nbU - 1) * 2;
                            creator.desc.shapes = [PartShape.polygon6];
                        }
                        var subMamesh = creator.go();
                        mathis.spacialTransformations.affineTransformation_3vec(subMamesh.vertices, creator.OUT_corner[0].position, creator.OUT_corner[2].position, creator.OUT_corner[4].position, v0.position, v1.position, v2.position);
                        if (firstOne) {
                            firstOne = false;
                            totalMamesh = subMamesh;
                        }
                        else {
                            var merger = new mathis.grateAndGlue.Merger(totalMamesh, subMamesh);
                            merger.goChanging();
                        }
                    }
                    else if (face.length == 7) {
                        var v0 = face[0];
                        var v1 = face[2];
                        var v2 = face[4];
                        var creator = new Concentric();
                        creator.finalize = false;
                        if (this.desc.facesDescription[7] != null)
                            creator.desc = this.desc.facesDescription[7];
                        else {
                            creator.desc = new ConcentricDescription();
                            creator.desc.nbPatches = 1;
                            creator.desc.nbI = (this.desc.nbU - 1) * 2;
                            creator.desc.shapes = [PartShape.polygon7];
                        }
                        var subMamesh = creator.go();
                        mathis.spacialTransformations.affineTransformation_3vec(subMamesh.vertices, creator.OUT_corner[0].position, creator.OUT_corner[2].position, creator.OUT_corner[4].position, v0.position, v1.position, v2.position);
                        if (firstOne) {
                            firstOne = false;
                            totalMamesh = subMamesh;
                        }
                        else {
                            var merger = new mathis.grateAndGlue.Merger(totalMamesh, subMamesh);
                            merger.goChanging();
                        }
                    }
                    else if (face.length == 8) {
                        var v0 = face[0];
                        var v1 = face[3];
                        var v2 = face[6];
                        var creator = new Concentric();
                        creator.finalize = false;
                        if (this.desc.facesDescription[8] != null)
                            creator.desc = this.desc.facesDescription[8];
                        else {
                            creator.desc = new ConcentricDescription();
                            creator.desc.nbPatches = 1;
                            creator.desc.nbI = (this.desc.nbU - 1) * 2;
                            creator.desc.shapes = [PartShape.polygon8];
                        }
                        var subMamesh = creator.go();
                        mathis.spacialTransformations.affineTransformation_3vec(subMamesh.vertices, creator.OUT_corner[0].position, creator.OUT_corner[3].position, creator.OUT_corner[6].position, v0.position, v1.position, v2.position);
                        if (firstOne) {
                            firstOne = false;
                            totalMamesh = subMamesh;
                        }
                        else {
                            var merger = new mathis.grateAndGlue.Merger(totalMamesh, subMamesh);
                            merger.goChanging();
                        }
                    }
                }
                if (this.finalize) {
                    this.SUB_oppositeLinkAssocierByAngles.vertices = totalMamesh.vertices;
                    this.SUB_oppositeLinkAssocierByAngles.canCreateBifurcations = this.desc.canCreateBifurcations;
                    this.SUB_oppositeLinkAssocierByAngles.goChanging();
                    this.SUB_mameshCleaner.suppressLinksWithoutOpposite = this.desc.suppressLinksWithoutOpposite;
                    this.SUB_mameshCleaner.IN_mamesh = totalMamesh;
                }
                return totalMamesh;
            };
            return PolyhedronBoard;
        }());
        octavioBoard.PolyhedronBoard = PolyhedronBoard;
        var MameshCleaner = (function () {
            function MameshCleaner(mamesh) {
                this.OUT_nbLinkSuppressed = 0;
                this.OUT_nbVerticesSuppressed = 0;
                this.suppressCellWithNoVoisin = true;
                this.suppressLinksWithoutOpposite = SuppressLinkWithoutOpposite.none;
                this.suppressLinkWithoutOppositeFunction = function (v) { return (v.links.length >= 5); };
                this.IN_mamesh = mamesh;
            }
            MameshCleaner.prototype.goChanging = function () {
                if (this.suppressLinksWithoutOpposite == SuppressLinkWithoutOpposite.forVertexWithAtLeast5links)
                    this.suppressLinkWithoutOppositeFunction = function (v) { return (v.links.length >= 5); };
                else if (this.suppressLinksWithoutOpposite == SuppressLinkWithoutOpposite.forNonBorder)
                    this.suppressLinkWithoutOppositeFunction = function (v) { return (!v.isBorder()); };
                else
                    this.suppressLinkWithoutOppositeFunction = null;
                if (this.IN_mamesh == null)
                    throw 'a Mamesh is require as IN_arg';
                if (this.suppressLinkWithoutOppositeFunction != null)
                    this.suppressLinkWithoutOpposite();
            };
            MameshCleaner.prototype.suppressLinkWithoutOpposite = function () {
                var goOn = true;
                while (goOn) {
                    goOn = false;
                    for (var _i = 0, _a = this.IN_mamesh.vertices; _i < _a.length; _i++) {
                        var v = _a[_i];
                        if (this.suppressLinkWithoutOppositeFunction(v)) {
                            for (var i = 0; i < v.links.length; i++) {
                                var li = v.links[i];
                                if (li.opposites == null) {
                                    goOn = true;
                                    mathis.Vertex.separateTwoVoisins(v, li.to);
                                    this.OUT_nbLinkSuppressed++;
                                    break;
                                }
                            }
                        }
                    }
                }
                if (this.suppressCellWithNoVoisin) {
                    var indexToSuppress = [];
                    for (var i = 0; i < this.IN_mamesh.vertices.length; i++) {
                        if (this.IN_mamesh.vertices[i].links.length == 0) {
                            indexToSuppress.push(i);
                            this.OUT_nbVerticesSuppressed++;
                        }
                    }
                    this.IN_mamesh.vertices = mathis.tab.arrayMinusSomeIndices(this.IN_mamesh.vertices, indexToSuppress);
                }
            };
            return MameshCleaner;
        }());
        octavioBoard.MameshCleaner = MameshCleaner;
    })(octavioBoard = mathis.octavioBoard || (mathis.octavioBoard = {}));
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    var polyhedron;
    (function (polyhedron_1) {
        polyhedron_1.platonic = [
            "tetrahedron",
            "cube",
            "octahedron",
            "dodecahedron",
            "icosahedron"
        ];
        polyhedron_1.archimedean = [
            "truncated tetrahedron",
            "cuboctahedron",
            "truncated cube",
            "truncated octahedron",
            "rhombicuboctahedron",
            "truncated cuboctahedron",
            "snub cube",
            "icosidodecahedron",
            "truncated dodecahedron",
            "truncated icosahedron",
            "rhombicosidodecahedron",
            "truncated icosidodecahedron",
            "snub dodecahedron"
        ];
        polyhedron_1.antiprisms = [
            "square antiprism",
            "pentagonal antiprism",
            "hexagonal antiprism",
            "octagonal antiprism",
            "decagonal antiprism"
        ];
        polyhedron_1.johnson = [
            "square pyramid",
            "pentagonal pyramid",
            "triangular cupola",
            "square cupola",
            "pentagonal cupola",
            "pentagonal rotunda",
            "elongated triangular pyramid",
            "elongated square pyramid",
            "elongated pentagonal pyramid",
            "gyroelongated square pyramid",
            "gyroelongated pentagonal pyramid",
            "triangular bipyramid",
            "pentagonal bipyramid",
            "elongated triangular bipyramid",
            "elongated square bipyramid",
            "elongated pentagonal bipyramid",
            "gyroelongated square bipyramid",
            "elongated triangular cupola",
            "elongated square cupola",
            "elongated pentagonal cupola",
            "elongated pentagonal rotunda",
            "gyroelongated triangular cupola",
            "gyroelongated square cupola",
            "gyroelongated pentagonal cupola",
            "gyroelongated pentagonal rotunda",
            "gyrobifastigium",
            "triangular orthobicupola",
            "square orthobicupola",
            "square gyrobicupola",
            "pentagonal orthobicupola",
            "pentagonal gyrobicupola",
            "pentagonal orthocupolarotunda",
            "pentagonal gyrocupolarotunda",
            "pentagonal orthobirotunda",
            "elongated triangular orthobicupola",
            "elongated triangular gyrobicupola",
            "elongated square gyrobicupola",
            "elongated pentagonal orthobicupola",
            "elongated pentagonal gyrobicupola",
            "elongated pentagonal orthocupolarotunda",
            "elongated pentagonal gyrocupolarotunda",
            "elongated pentagonal orthobirotunda",
            "elongated pentagonal gyrobirotunda",
            "gyroelongated triangular bicupola",
            "gyroelongated square bicupola",
            "gyroelongated pentagonal bicupola",
            "gyroelongated pentagonal cupolarotunda",
            "gyroelongated pentagonal birotunda",
            "augmented triangular prism",
            "biaugmented triangular prism",
            "triaugmented triangular prism",
            "augmented pentagonal prism",
            "biaugmented pentagonal prism",
            "augmented hexagonal prism",
            "parabiaugmented hexagonal prism",
            "metabiaugmented hexagonal prism",
            "triaugmented hexagonal prism",
            "augmented dodecahedron",
            "parabiaugmented dodecahedron",
            "metabiaugmented dodecahedron",
            "triaugmented dodecahedron",
            "metabidiminished icosahedron",
            "tridiminished icosahedron",
            "augmented tridiminished icosahedron",
            "augmented truncated tetrahedron",
            "augmented truncated cube",
            "biaugmented truncated cube",
            "augmented truncated dodecahedron",
            "parabiaugmented truncated dodecahedron",
            "metabiaugmented truncated dodecahedron",
            "triaugmented truncated dodecahedron",
            "gyrate rhombicosidodecahedron",
            "parabigyrate rhombicosidodecahedron",
            "metabigyrate rhombicosidodecahedron",
            "trigyrate rhombicosidodecahedron",
            "diminished rhombicosidodecahedron",
            "paragyrate diminished rhombicosidodecahedron",
            "metagyrate diminished rhombicosidodecahedron",
            "bigyrate diminished rhombicosidodecahedron",
            "parabidiminished rhombicosidodecahedron",
            "metabidiminished rhombicosidodecahedron",
            "gyrate bidiminished rhombicosidodecahedron",
            "tridiminished rhombicosidodecahedron",
            "snub disphenoid",
            "snub square antiprism",
            "sphenocorona",
            "augmented sphenocorona",
            "sphenomegacorona",
            "hebesphenomegacorona",
            "disphenocingulum",
            "bilunabirotunda",
            "triangular hebesphenorotunda"
        ];
        polyhedron_1.prisms = [
            "triangular prism",
            "pentagonal prism",
            "hexagonal prism",
            "octagonal prism",
            "decagonal prism"
        ];
        var Polyhedron = (function () {
            function Polyhedron(type) {
                this.makeLinks = true;
                this.type = type.toLowerCase();
            }
            Polyhedron.prototype.dataToMamesh = function (data) {
                var mamesh = new mathis.Mamesh();
                for (var _i = 0, _a = data.vertices; _i < _a.length; _i++) {
                    var ve = _a[_i];
                    mamesh.newVertex(new mathis.XYZ(ve[0], ve[1], ve[2]));
                }
                var maxNorm = Number.MIN_VALUE;
                for (var _b = 0, _c = mamesh.vertices; _b < _c.length; _b++) {
                    var vertex = _c[_b];
                    var norm = vertex.position.length();
                    if (norm > maxNorm)
                        maxNorm = norm;
                }
                for (var _d = 0, _e = mamesh.vertices; _d < _e.length; _d++) {
                    var vertex = _e[_d];
                    vertex.position.scale(1 / maxNorm);
                }
                var oneOverLength = 0;
                mamesh.faces = [];
                for (var _f = 0, _g = data.faces; _f < _g.length; _f++) {
                    var face = _g[_f];
                    if (face.length == 3) {
                        mamesh.addATriangle(mamesh.vertices[face[0]], mamesh.vertices[face[1]], mamesh.vertices[face[2]]);
                        mamesh.faces.push([mamesh.vertices[face[0]], mamesh.vertices[face[1]], mamesh.vertices[face[2]]]);
                    }
                    else if (face.length == 4) {
                        mamesh.addASquare(mamesh.vertices[face[0]], mamesh.vertices[face[1]], mamesh.vertices[face[2]], mamesh.vertices[face[3]]);
                        mamesh.faces.push([mamesh.vertices[face[0]], mamesh.vertices[face[1]], mamesh.vertices[face[2]], mamesh.vertices[face[3]]]);
                    }
                    else if (face.length >= 5) {
                        var centerVertex = mamesh.newVertex(new mathis.XYZ(0, 0, 0));
                        centerVertex.markers.push(mathis.Vertex.Markers.polygonCenter);
                        oneOverLength = 1 / (face.length);
                        var v = [mamesh.vertices[face[0]]];
                        var tab1 = [v[0].position];
                        var tab2 = [oneOverLength];
                        var faceVertex = [mamesh.vertices[face[0]]];
                        for (var i = 1; i < face.length; i++) {
                            v.push(mamesh.vertices[face[i]]);
                            tab1.push(v[i].position);
                            tab2.push(oneOverLength);
                            faceVertex.push(mamesh.vertices[face[i]]);
                        }
                        mamesh.faces.push(faceVertex);
                        mathis.geo.baryCenter(tab1, tab2, centerVertex.position);
                        for (var i = 0; i < face.length; i++)
                            mamesh.addATriangle(v[i], v[(i + 1) % (face.length)], centerVertex);
                    }
                }
                if (this.makeLinks) {
                    new mathis.linkModule.LinkCreatorSorterAndBorderDetectorByPolygons(mamesh).goChanging();
                }
                return mamesh;
            };
            Polyhedron.prototype.go = function (callback) {
                if (callback === void 0) { callback = null; }
                var archimedea = [];
                archimedea["tetrahedron"] = {
                    vertices: [[0, 0, 1.732051], [1.632993, 0, -0.5773503], [-0.8164966, 1.414214, -0.5773503], [-0.8164966, -1.414214, -0.5773503]],
                    faces: [[0, 1, 2], [0, 2, 3], [0, 3, 1], [1, 3, 2]]
                };
                archimedea["cube"] = {
                    vertices: [[-0.86602540378, -0.86602540378, -0.86602540378], [+0.86602540378, -0.86602540378, -0.86602540378], [-0.86602540378, +0.86602540378, -0.86602540378], [-0.86602540378, -0.86602540378, +0.86602540378], [+0.86602540378, +0.86602540378, -0.86602540378], [+0.86602540378, -0.86602540378, +0.86602540378], [-0.86602540378, +0.86602540378, +0.86602540378], [+0.86602540378, +0.86602540378, +0.86602540378]],
                    faces: [[0, 1, 4, 2], [0, 2, 6, 3], [0, 3, 5, 1], [1, 5, 7, 4], [2, 4, 7, 6], [3, 6, 7, 5]]
                };
                archimedea["octahedron"] = {
                    vertices: [[0, 0, 1.414214], [1.414214, 0, 0], [0, 1.414214, 0], [-1.414214, 0, 0], [0, -1.414214, 0], [0, 0, -1.414214]],
                    faces: [[0, 1, 2], [0, 2, 3], [0, 3, 4], [0, 4, 1], [1, 4, 5], [1, 5, 2], [2, 5, 3], [3, 5, 4]]
                };
                archimedea["dodecahedron"] = {
                    vertices: [[0, 0, 1.070466], [0.7136442, 0, 0.7978784], [-0.3568221, 0.618034, 0.7978784], [-0.3568221, -0.618034, 0.7978784], [0.7978784, 0.618034, 0.3568221], [0.7978784, -0.618034, 0.3568221], [-0.9341724, 0.381966, 0.3568221], [0.1362939, 1, 0.3568221], [0.1362939, -1, 0.3568221], [-0.9341724, -0.381966, 0.3568221], [0.9341724, 0.381966, -0.3568221], [0.9341724, -0.381966, -0.3568221], [-0.7978784, 0.618034, -0.3568221], [-0.1362939, 1, -0.3568221], [-0.1362939, -1, -0.3568221], [-0.7978784, -0.618034, -0.3568221], [0.3568221, 0.618034, -0.7978784], [0.3568221, -0.618034, -0.7978784], [-0.7136442, 0, -0.7978784], [0, 0, -1.070466]],
                    faces: [[0, 1, 4, 7, 2], [0, 2, 6, 9, 3], [0, 3, 8, 5, 1], [1, 5, 11, 10, 4], [2, 7, 13, 12, 6], [3, 9, 15, 14, 8], [4, 10, 16, 13, 7], [5, 8, 14, 17, 11], [6, 12, 18, 15, 9], [10, 11, 17, 19, 16], [12, 13, 16, 19, 18], [14, 15, 18, 19, 17]]
                };
                archimedea["icosahedron"] = {
                    vertices: [[0, 0, 1.175571], [1.051462, 0, 0.5257311], [0.3249197, 1, 0.5257311], [-0.8506508, 0.618034, 0.5257311], [-0.8506508, -0.618034, 0.5257311], [0.3249197, -1, 0.5257311], [0.8506508, 0.618034, -0.5257311], [0.8506508, -0.618034, -0.5257311], [-0.3249197, 1, -0.5257311], [-1.051462, 0, -0.5257311], [-0.3249197, -1, -0.5257311], [0, 0, -1.175571]],
                    faces: [[0, 1, 2], [0, 2, 3], [0, 3, 4], [0, 4, 5], [0, 5, 1], [1, 5, 7], [1, 7, 6], [1, 6, 2], [2, 6, 8], [2, 8, 3], [3, 8, 9], [3, 9, 4], [4, 9, 10], [4, 10, 5], [5, 10, 7], [6, 7, 11], [6, 11, 8], [7, 10, 11], [8, 11, 9], [9, 11, 10]]
                };
                archimedea["truncated tetrahedron"] = {
                    vertices: [[0, 0, 1.105542], [0.8528029, 0, 0.7035265], [-0.7106691, 0.4714045, 0.7035265], [0.3316456, -0.7856742, 0.7035265], [0.9949367, 0.4714045, -0.1005038], [-1.089693, 0.1571348, -0.1005038], [-0.5685352, 0.942809, -0.1005038], [-0.04737794, -1.099944, -0.1005038], [0.6159132, 0.1571348, -0.904534], [0.2842676, 0.942809, -0.5025189], [-0.758047, -0.6285394, -0.5025189], [0.09475587, -0.6285394, -0.904534]],
                    faces: [[0, 3, 1], [2, 6, 5], [4, 8, 9], [7, 10, 11], [0, 1, 4, 9, 6, 2], [0, 2, 5, 10, 7, 3], [1, 3, 7, 11, 8, 4], [5, 6, 9, 8, 11, 10]]
                };
                archimedea["truncated cube"] = {
                    vertices: [[0, 0, 1.042011], [0.5621693, 0, 0.8773552], [-0.4798415, 0.2928932, 0.8773552], [0.2569714, -0.5, 0.8773552], [0.8773552, 0.2928932, 0.4798415], [-0.9014684, 0.2071068, 0.4798415], [-0.5962706, 0.7071068, 0.4798415], [0.1405423, -0.9142136, 0.4798415], [1.017898, 0.2071068, -0.08232778], [0.7609261, 0.7071068, 0.08232778], [-1.017898, -0.2071068, 0.08232778], [-0.2810846, 1, 0.08232778], [-0.2810846, -1, 0.08232778], [0.2810846, -1, -0.08232778], [0.9014684, -0.2071068, -0.4798415], [0.2810846, 1, -0.08232778], [-0.7609261, -0.7071068, -0.08232778], [-0.8773552, -0.2928932, -0.4798415], [-0.1405423, 0.9142136, -0.4798415], [0.5962706, -0.7071068, -0.4798415], [0.4798415, -0.2928932, -0.8773552], [-0.5621693, 0, -0.8773552], [-0.2569714, 0.5, -0.8773552], [0, 0, -1.042011]],
                    faces: [[0, 3, 1], [2, 6, 5], [4, 8, 9], [7, 12, 13], [10, 17, 16], [11, 15, 18], [14, 19, 20], [21, 22, 23], [0, 1, 4, 9, 15, 11, 6, 2], [0, 2, 5, 10, 16, 12, 7, 3], [1, 3, 7, 13, 19, 14, 8, 4], [5, 6, 11, 18, 22, 21, 17, 10], [8, 14, 20, 23, 22, 18, 15, 9], [12, 16, 17, 21, 23, 20, 19, 13]]
                };
                archimedea["truncated octahedron"] = {
                    vertices: [[0, 0, 1.054093], [0.6324555, 0, 0.843274], [-0.421637, 0.4714045, 0.843274], [-0.07027284, -0.6285394, 0.843274], [0.843274, 0.4714045, 0.421637], [0.5621827, -0.6285394, 0.6324555], [-0.9135469, 0.3142697, 0.421637], [-0.2108185, 0.942809, 0.421637], [-0.5621827, -0.7856742, 0.421637], [0.9838197, 0.3142697, -0.2108185], [0.421637, 0.942809, 0.2108185], [0.7027284, -0.7856742, 0], [-0.7027284, 0.7856742, 0], [-0.9838197, -0.3142697, 0.2108185], [-0.421637, -0.942809, -0.2108185], [0.5621827, 0.7856742, -0.421637], [0.9135469, -0.3142697, -0.421637], [0.2108185, -0.942809, -0.421637], [-0.5621827, 0.6285394, -0.6324555], [-0.843274, -0.4714045, -0.421637], [0.07027284, 0.6285394, -0.843274], [0.421637, -0.4714045, -0.843274], [-0.6324555, 0, -0.843274], [0, 0, -1.054093]],
                    faces: [[0, 3, 5, 1], [2, 7, 12, 6], [4, 9, 15, 10], [8, 13, 19, 14], [11, 17, 21, 16], [18, 20, 23, 22], [0, 1, 4, 10, 7, 2], [0, 2, 6, 13, 8, 3], [1, 5, 11, 16, 9, 4], [3, 8, 14, 17, 11, 5], [6, 12, 18, 22, 19, 13], [7, 10, 15, 20, 18, 12], [9, 16, 21, 23, 20, 15], [14, 19, 22, 23, 21, 17]]
                };
                archimedea["truncated dodecahedron"] = {
                    vertices: [[0, 0, 1.014485], [0.3367628, 0, 0.9569589], [-0.2902233, 0.1708204, 0.9569589], [0.1634681, -0.2944272, 0.9569589], [0.5914332, 0.1708204, 0.806354], [-0.5963465, 0.1527864, 0.806354], [-0.4230517, 0.4472136, 0.806354], [0.1377417, -0.6, 0.806354], [0.8302037, 0.1527864, 0.5626702], [0.6667356, 0.4472136, 0.6201961], [-0.8014407, -0.0472136, 0.6201961], [-0.3477493, 0.7236068, 0.6201961], [-0.06735256, -0.8, 0.6201961], [0.2694102, -0.8, 0.5626702], [0.9618722, -0.0472136, 0.3189863], [0.5339072, 0.7236068, 0.4695912], [-0.8271671, -0.3527864, 0.4695912], [-0.9599955, -0.0763932, 0.3189863], [-0.3992021, 0.8763932, 0.3189863], [-0.09307895, 0.8944272, 0.4695912], [-0.3734757, -0.818034, 0.4695912], [0.5081808, -0.818034, 0.3189863], [0.9361459, -0.3527864, 0.1683814], [1.011448, -0.0763932, -0.0177765], [0.4824544, 0.8763932, 0.1683814], [0.2436839, 0.8944272, 0.4120653], [-0.663699, -0.6472136, 0.4120653], [-1.011448, 0.0763932, 0.0177765], [-0.5577569, 0.8472136, 0.0177765], [-0.5320305, -0.8472136, 0.1683814], [0.5577569, -0.8472136, -0.0177765], [0.7628511, -0.6472136, 0.1683814], [0.9599955, 0.0763932, -0.3189863], [0.5320305, 0.8472136, -0.1683814], [-0.9618722, 0.0472136, -0.3189863], [-0.9361459, 0.3527864, -0.1683814], [-0.7628511, 0.6472136, -0.1683814], [-0.5081808, 0.818034, -0.3189863], [-0.4824544, -0.8763932, -0.1683814], [0.3992021, -0.8763932, -0.3189863], [0.8014407, 0.0472136, -0.6201961], [0.8271671, 0.3527864, -0.4695912], [0.663699, 0.6472136, -0.4120653], [0.3734757, 0.818034, -0.4695912], [-0.8302037, -0.1527864, -0.5626702], [-0.2694102, 0.8, -0.5626702], [-0.5339072, -0.7236068, -0.4695912], [-0.2436839, -0.8944272, -0.4120653], [0.09307895, -0.8944272, -0.4695912], [0.3477493, -0.7236068, -0.6201961], [0.5963465, -0.1527864, -0.806354], [0.06735256, 0.8, -0.6201961], [-0.6667356, -0.4472136, -0.6201961], [-0.5914332, -0.1708204, -0.806354], [-0.1377417, 0.6, -0.806354], [0.4230517, -0.4472136, -0.806354], [0.2902233, -0.1708204, -0.9569589], [-0.3367628, 0, -0.9569589], [-0.1634681, 0.2944272, -0.9569589], [0, 0, -1.014485]],
                    faces: [[0, 3, 1], [2, 6, 5], [4, 8, 9], [7, 12, 13], [10, 17, 16], [11, 19, 18], [14, 22, 23], [15, 24, 25], [20, 26, 29], [21, 30, 31], [27, 35, 34], [28, 37, 36], [32, 40, 41], [33, 42, 43], [38, 46, 47], [39, 48, 49], [44, 53, 52], [45, 51, 54], [50, 55, 56], [57, 58, 59], [0, 1, 4, 9, 15, 25, 19, 11, 6, 2], [0, 2, 5, 10, 16, 26, 20, 12, 7, 3], [1, 3, 7, 13, 21, 31, 22, 14, 8, 4], [5, 6, 11, 18, 28, 36, 35, 27, 17, 10], [8, 14, 23, 32, 41, 42, 33, 24, 15, 9], [12, 20, 29, 38, 47, 48, 39, 30, 21, 13], [16, 17, 27, 34, 44, 52, 46, 38, 29, 26], [18, 19, 25, 24, 33, 43, 51, 45, 37, 28], [22, 31, 30, 39, 49, 55, 50, 40, 32, 23], [34, 35, 36, 37, 45, 54, 58, 57, 53, 44], [40, 50, 56, 59, 58, 54, 51, 43, 42, 41], [46, 52, 53, 57, 59, 56, 55, 49, 48, 47]]
                };
                archimedea["truncated icosahedron"] = {
                    vertices: [[0, 0, 1.021], [0.4035482, 0, 0.9378643], [-0.2274644, 0.3333333, 0.9378643], [-0.1471226, -0.375774, 0.9378643], [0.579632, 0.3333333, 0.7715933], [0.5058321, -0.375774, 0.8033483], [-0.6020514, 0.2908927, 0.7715933], [-0.05138057, 0.6666667, 0.7715933], [0.1654988, -0.6080151, 0.8033483], [-0.5217096, -0.4182147, 0.7715933], [0.8579998, 0.2908927, 0.4708062], [0.3521676, 0.6666667, 0.6884578], [0.7841999, -0.4182147, 0.5025612], [-0.657475, 0.5979962, 0.5025612], [-0.749174, -0.08488134, 0.6884578], [-0.3171418, 0.8302373, 0.5025612], [0.1035333, -0.8826969, 0.5025612], [-0.5836751, -0.6928964, 0.4708062], [0.8025761, 0.5979962, 0.2017741], [0.9602837, -0.08488134, 0.3362902], [0.4899547, 0.8302373, 0.3362902], [0.7222343, -0.6928964, 0.2017741], [-0.8600213, 0.5293258, 0.1503935], [-0.9517203, -0.1535518, 0.3362902], [-0.1793548, 0.993808, 0.1503935], [0.381901, -0.9251375, 0.2017741], [-0.2710537, -0.9251375, 0.3362902], [-0.8494363, -0.5293258, 0.2017741], [0.8494363, 0.5293258, -0.2017741], [1.007144, -0.1535518, -0.06725804], [0.2241935, 0.993808, 0.06725804], [0.8600213, -0.5293258, -0.1503935], [-0.7222343, 0.6928964, -0.2017741], [-1.007144, 0.1535518, 0.06725804], [-0.381901, 0.9251375, -0.2017741], [0.1793548, -0.993808, -0.1503935], [-0.2241935, -0.993808, -0.06725804], [-0.8025761, -0.5979962, -0.2017741], [0.5836751, 0.6928964, -0.4708062], [0.9517203, 0.1535518, -0.3362902], [0.2710537, 0.9251375, -0.3362902], [0.657475, -0.5979962, -0.5025612], [-0.7841999, 0.4182147, -0.5025612], [-0.9602837, 0.08488134, -0.3362902], [-0.1035333, 0.8826969, -0.5025612], [0.3171418, -0.8302373, -0.5025612], [-0.4899547, -0.8302373, -0.3362902], [-0.8579998, -0.2908927, -0.4708062], [0.5217096, 0.4182147, -0.7715933], [0.749174, 0.08488134, -0.6884578], [0.6020514, -0.2908927, -0.7715933], [-0.5058321, 0.375774, -0.8033483], [-0.1654988, 0.6080151, -0.8033483], [0.05138057, -0.6666667, -0.7715933], [-0.3521676, -0.6666667, -0.6884578], [-0.579632, -0.3333333, -0.7715933], [0.1471226, 0.375774, -0.9378643], [0.2274644, -0.3333333, -0.9378643], [-0.4035482, 0, -0.9378643], [0, 0, -1.021]],
                    faces: [[0, 3, 8, 5, 1], [2, 7, 15, 13, 6], [4, 10, 18, 20, 11], [9, 14, 23, 27, 17], [12, 21, 31, 29, 19], [16, 26, 36, 35, 25], [22, 32, 42, 43, 33], [24, 30, 40, 44, 34], [28, 39, 49, 48, 38], [37, 47, 55, 54, 46], [41, 45, 53, 57, 50], [51, 52, 56, 59, 58], [0, 1, 4, 11, 7, 2], [0, 2, 6, 14, 9, 3], [1, 5, 12, 19, 10, 4], [3, 9, 17, 26, 16, 8], [5, 8, 16, 25, 21, 12], [6, 13, 22, 33, 23, 14], [7, 11, 20, 30, 24, 15], [10, 19, 29, 39, 28, 18], [13, 15, 24, 34, 32, 22], [17, 27, 37, 46, 36, 26], [18, 28, 38, 40, 30, 20], [21, 25, 35, 45, 41, 31], [23, 33, 43, 47, 37, 27], [29, 31, 41, 50, 49, 39], [32, 34, 44, 52, 51, 42], [35, 36, 46, 54, 53, 45], [38, 48, 56, 52, 44, 40], [42, 51, 58, 55, 47, 43], [48, 49, 50, 57, 59, 56], [53, 54, 55, 58, 59, 57]]
                };
                archimedea["cuboctahedron"] = {
                    vertices: [[0, 0, 1.154701], [1, 0, 0.5773503], [0.3333333, 0.942809, 0.5773503], [-1, 0, 0.5773503], [-0.3333333, -0.942809, 0.5773503], [1, 0, -0.5773503], [0.6666667, -0.942809, 0], [-0.6666667, 0.942809, 0], [0.3333333, 0.942809, -0.5773503], [-1, 0, -0.5773503], [-0.3333333, -0.942809, -0.5773503], [0, 0, -1.154701]],
                    faces: [[0, 1, 2], [0, 3, 4], [1, 6, 5], [2, 8, 7], [3, 7, 9], [4, 10, 6], [5, 11, 8], [9, 11, 10], [0, 2, 7, 3], [0, 4, 6, 1], [1, 5, 8, 2], [3, 9, 10, 4], [5, 6, 10, 11], [7, 8, 11, 9]]
                };
                archimedea["truncated cuboctahedron"] = {
                    vertices: [[0, 0, 1.024117], [0.4314788, 0, 0.928785], [-0.02106287, 0.4309644, 0.928785], [-0.3410582, -0.2642977, 0.928785], [0.4104159, 0.4309644, 0.833453], [0.7006238, -0.2642977, 0.6986333], [-0.3831839, 0.5976311, 0.7381211], [-0.3919084, -0.6380712, 0.6986333], [-0.7031792, -0.09763107, 0.7381211], [0.6584981, 0.5976311, 0.5079694], [0.6497736, -0.6380712, 0.4684816], [0.948706, -0.09763107, 0.3731496], [-0.4638216, 0.8333333, 0.3731496], [-0.7242421, 0.3333333, 0.6427891], [-0.7540295, -0.4714045, 0.5079694], [-0.1227634, -0.9023689, 0.4684816], [0.5778604, 0.8333333, 0.1429979], [0.9276431, 0.3333333, 0.2778177], [0.8978557, -0.4714045, 0.1429979], [0.3087154, -0.9023689, 0.3731496], [-0.8048797, 0.5690356, 0.2778177], [-0.2157394, 1, 0.04766598], [-0.8470055, -0.5690356, 0.08715377], [-0.2157394, -1, 0.04766598], [0.8470055, 0.5690356, -0.08715377], [0.2157394, 1, -0.04766598], [0.8048797, -0.5690356, -0.2778177], [0.2157394, -1, -0.04766598], [-0.8978557, 0.4714045, -0.1429979], [-0.3087154, 0.9023689, -0.3731496], [-0.9276431, -0.3333333, -0.2778177], [-0.5778604, -0.8333333, -0.1429979], [0.7540295, 0.4714045, -0.5079694], [0.1227634, 0.9023689, -0.4684816], [0.7242421, -0.3333333, -0.6427891], [0.4638216, -0.8333333, -0.3731496], [-0.948706, 0.09763107, -0.3731496], [-0.6497736, 0.6380712, -0.4684816], [-0.6584981, -0.5976311, -0.5079694], [0.7031792, 0.09763107, -0.7381211], [0.3919084, 0.6380712, -0.6986333], [0.3831839, -0.5976311, -0.7381211], [-0.7006238, 0.2642977, -0.6986333], [-0.4104159, -0.4309644, -0.833453], [0.3410582, 0.2642977, -0.928785], [0.02106287, -0.4309644, -0.928785], [-0.4314788, 0, -0.928785], [0, 0, -1.024117]],
                    faces: [[0, 1, 4, 2], [3, 8, 14, 7], [5, 10, 18, 11], [6, 12, 20, 13], [9, 17, 24, 16], [15, 23, 27, 19], [21, 25, 33, 29], [22, 30, 38, 31], [26, 35, 41, 34], [28, 37, 42, 36], [32, 39, 44, 40], [43, 46, 47, 45], [0, 2, 6, 13, 8, 3], [1, 5, 11, 17, 9, 4], [7, 14, 22, 31, 23, 15], [10, 19, 27, 35, 26, 18], [12, 21, 29, 37, 28, 20], [16, 24, 32, 40, 33, 25], [30, 36, 42, 46, 43, 38], [34, 41, 45, 47, 44, 39], [0, 3, 7, 15, 19, 10, 5, 1], [2, 4, 9, 16, 25, 21, 12, 6], [8, 13, 20, 28, 36, 30, 22, 14], [11, 18, 26, 34, 39, 32, 24, 17], [23, 31, 38, 43, 45, 41, 35, 27], [29, 33, 40, 44, 47, 46, 42, 37]]
                };
                archimedea["rhombicuboctahedron"] = {
                    vertices: [[0, 0, 1.070722], [0.7148135, 0, 0.7971752], [-0.104682, 0.7071068, 0.7971752], [-0.6841528, 0.2071068, 0.7971752], [-0.104682, -0.7071068, 0.7971752], [0.6101315, 0.7071068, 0.5236279], [1.04156, 0.2071068, 0.1367736], [0.6101315, -0.7071068, 0.5236279], [-0.3574067, 1, 0.1367736], [-0.7888348, -0.5, 0.5236279], [-0.9368776, 0.5, 0.1367736], [-0.3574067, -1, 0.1367736], [0.3574067, 1, -0.1367736], [0.9368776, -0.5, -0.1367736], [0.7888348, 0.5, -0.5236279], [0.3574067, -1, -0.1367736], [-0.6101315, 0.7071068, -0.5236279], [-1.04156, -0.2071068, -0.1367736], [-0.6101315, -0.7071068, -0.5236279], [0.104682, 0.7071068, -0.7971752], [0.6841528, -0.2071068, -0.7971752], [0.104682, -0.7071068, -0.7971752], [-0.7148135, 0, -0.7971752], [0, 0, -1.070722]],
                    faces: [[0, 2, 3], [1, 6, 5], [4, 9, 11], [7, 15, 13], [8, 16, 10], [12, 14, 19], [17, 22, 18], [20, 21, 23], [0, 1, 5, 2], [0, 3, 9, 4], [0, 4, 7, 1], [1, 7, 13, 6], [2, 5, 12, 8], [2, 8, 10, 3], [3, 10, 17, 9], [4, 11, 15, 7], [5, 6, 14, 12], [6, 13, 20, 14], [8, 12, 19, 16], [9, 17, 18, 11], [10, 16, 22, 17], [11, 18, 21, 15], [13, 15, 21, 20], [14, 20, 23, 19], [16, 19, 23, 22], [18, 22, 23, 21]]
                };
                archimedea["snub cube"] = {
                    vertices: [[0, 0, 1.077364], [0.7442063, 0, 0.7790187], [0.3123013, 0.6755079, 0.7790187], [-0.482096, 0.5669449, 0.7790187], [-0.7169181, -0.1996786, 0.7790187], [-0.1196038, -0.7345325, 0.7790187], [0.6246025, -0.7345325, 0.4806734], [1.056508, -0.1996786, 0.06806912], [0.8867128, 0.5669449, 0.2302762], [0.2621103, 1.042774, 0.06806912], [-0.532287, 0.9342111, 0.06806912], [-1.006317, 0.3082417, 0.2302762], [-0.7020817, -0.784071, 0.2302762], [0.02728827, -1.074865, 0.06806912], [0.6667271, -0.784071, -0.3184664], [0.8216855, -0.09111555, -0.6908285], [0.6518908, 0.6755079, -0.5286215], [-0.1196038, 0.8751866, -0.6168117], [-0.8092336, 0.4758293, -0.5286215], [-0.9914803, -0.2761507, -0.3184664], [-0.4467414, -0.825648, -0.5286215], [0.1926974, -0.5348539, -0.915157], [0.1846311, 0.2587032, -1.029416], [-0.5049987, -0.1406541, -0.9412258]],
                    faces: [[0, 1, 2], [0, 2, 3], [0, 3, 4], [0, 4, 5], [1, 6, 7], [1, 7, 8], [1, 8, 2], [2, 8, 9], [3, 10, 11], [3, 11, 4], [4, 12, 5], [5, 12, 13], [5, 13, 6], [6, 13, 14], [6, 14, 7], [7, 14, 15], [8, 16, 9], [9, 16, 17], [9, 17, 10], [10, 17, 18], [10, 18, 11], [11, 18, 19], [12, 19, 20], [12, 20, 13], [14, 21, 15], [15, 21, 22], [15, 22, 16], [16, 22, 17], [18, 23, 19], [19, 23, 20], [20, 23, 21], [21, 23, 22], [0, 5, 6, 1], [2, 9, 10, 3], [4, 11, 19, 12], [7, 15, 16, 8], [13, 20, 21, 14], [17, 22, 23, 18]]
                };
                archimedea["icosidodecahedron"] = {
                    vertices: [[0, 0, 1.051462], [0.618034, 0, 0.8506508], [0.2763932, 0.5527864, 0.8506508], [-0.618034, 0, 0.8506508], [-0.2763932, -0.5527864, 0.8506508], [1, 0, 0.3249197], [0.7236068, -0.5527864, 0.5257311], [-0.1708204, 0.8944272, 0.5257311], [0.4472136, 0.8944272, 0.3249197], [-1, 0, 0.3249197], [-0.7236068, 0.5527864, 0.5257311], [0.1708204, -0.8944272, 0.5257311], [-0.4472136, -0.8944272, 0.3249197], [1, 0, -0.3249197], [0.8944272, 0.5527864, 0], [0.5527864, -0.8944272, 0], [-0.5527864, 0.8944272, 0], [0.4472136, 0.8944272, -0.3249197], [-1, 0, -0.3249197], [-0.8944272, -0.5527864, 0], [-0.4472136, -0.8944272, -0.3249197], [0.618034, 0, -0.8506508], [0.7236068, -0.5527864, -0.5257311], [0.1708204, -0.8944272, -0.5257311], [-0.7236068, 0.5527864, -0.5257311], [-0.1708204, 0.8944272, -0.5257311], [0.2763932, 0.5527864, -0.8506508], [-0.618034, 0, -0.8506508], [-0.2763932, -0.5527864, -0.8506508], [0, 0, -1.051462]],
                    faces: [[0, 1, 2], [0, 3, 4], [1, 6, 5], [2, 8, 7], [3, 10, 9], [4, 12, 11], [5, 13, 14], [6, 11, 15], [7, 16, 10], [8, 14, 17], [9, 18, 19], [12, 19, 20], [13, 22, 21], [15, 23, 22], [16, 25, 24], [17, 26, 25], [18, 24, 27], [20, 28, 23], [21, 29, 26], [27, 29, 28], [0, 2, 7, 10, 3], [0, 4, 11, 6, 1], [1, 5, 14, 8, 2], [3, 9, 19, 12, 4], [5, 6, 15, 22, 13], [7, 8, 17, 25, 16], [9, 10, 16, 24, 18], [11, 12, 20, 23, 15], [13, 21, 26, 17, 14], [18, 27, 28, 20, 19], [21, 22, 23, 28, 29], [24, 25, 26, 29, 27]]
                };
                archimedea["truncated icosidodecahedron"] = {
                    vertices: [[0, 0, 1.008759], [0.2629922, 0, 0.973874], [-0.00462747, 0.2629515, 0.973874], [-0.2211363, -0.1423503, 0.973874], [0.2583647, 0.2629515, 0.9389886], [0.4673861, -0.1423503, 0.8825429], [-0.2303913, 0.3835526, 0.9041033], [-0.3159502, -0.372678, 0.8825429], [-0.4469001, -0.02174919, 0.9041033], [0.4581312, 0.3835526, 0.8127722], [0.5351104, -0.372678, 0.7696515], [0.6671526, -0.02174919, 0.7563265], [-0.3326926, 0.5786893, 0.7563265], [-0.4515276, 0.2412023, 0.8692179], [-0.541714, -0.2520769, 0.8127722], [-0.248226, -0.6030057, 0.7696515], [0.518368, 0.5786893, 0.6434351], [0.6625252, 0.2412023, 0.7214412], [0.7348768, -0.2520769, 0.6434351], [0.4402965, -0.6030057, 0.6783205], [-0.5538289, 0.436339, 0.7214412], [-0.2724557, 0.7738261, 0.5869894], [-0.6997536, -0.3618034, 0.6301101], [-0.04383203, -0.745356, 0.6783205], [-0.4062656, -0.7127322, 0.5869894], [0.722762, 0.436339, 0.552104], [0.4160667, 0.7738261, 0.4956583], [0.8398294, -0.3618034, 0.4258876], [0.2191601, -0.745356, 0.6434351], [0.5452491, -0.7127322, 0.460773], [-0.7147284, 0.4891254, 0.5172187], [-0.07268925, 0.8944272, 0.460773], [-0.4333553, 0.8266125, 0.3827669], [-0.8606531, -0.309017, 0.4258876], [-0.6320294, -0.5921311, 0.5172187], [-0.2018716, -0.8550825, 0.4956583], [0.8248546, 0.4891254, 0.3129962], [0.1903029, 0.8944272, 0.4258876], [0.5181594, 0.8266125, 0.2565505], [0.9419221, -0.309017, 0.1867798], [0.7450156, -0.5921311, 0.3345566], [0.3241127, -0.8550825, 0.4258876], [-0.8727679, 0.3793989, 0.3345566], [-0.6544916, 0.6842621, 0.3478816], [-0.2335888, 0.9472136, 0.2565505], [-0.7929289, -0.5393447, 0.3129962], [-0.9629544, -0.1138803, 0.2781109], [-0.096919, -0.9648091, 0.2781109], [0.9298072, 0.3793989, 0.09544872], [0.7225533, 0.6842621, 0.1652194], [0.2923956, 0.9472136, 0.1867798], [0.8471082, -0.5393447, 0.09544872], [1.002159, -0.1138803, 0.01744268], [0.1660732, -0.9648091, 0.2432255], [-0.8125311, 0.5745356, 0.1652194], [-0.9675818, 0.1490712, 0.2432255], [-0.1314961, 1, 0.01744268], [-0.8275059, -0.5745356, 0.05232804], [-0.9975315, -0.1490712, 0.01744268], [-0.1314961, -1, 0.01744268], [0.8275059, 0.5745356, -0.05232804], [0.9975315, 0.1490712, -0.01744268], [0.1314961, 1, -0.01744268], [0.8125311, -0.5745356, -0.1652194], [0.9675818, -0.1490712, -0.2432255], [0.1314961, -1, -0.01744268], [-0.8471082, 0.5393447, -0.09544872], [-1.002159, 0.1138803, -0.01744268], [-0.1660732, 0.9648091, -0.2432255], [-0.7225533, -0.6842621, -0.1652194], [-0.9298072, -0.3793989, -0.09544872], [-0.2923956, -0.9472136, -0.1867798], [0.7929289, 0.5393447, -0.3129962], [0.9629544, 0.1138803, -0.2781109], [0.096919, 0.9648091, -0.2781109], [0.6544916, -0.6842621, -0.3478816], [0.8727679, -0.3793989, -0.3345566], [0.2335888, -0.9472136, -0.2565505], [-0.7450156, 0.5921311, -0.3345566], [-0.9419221, 0.309017, -0.1867798], [-0.3241127, 0.8550825, -0.4258876], [-0.8248546, -0.4891254, -0.3129962], [-0.5181594, -0.8266125, -0.2565505], [-0.1903029, -0.8944272, -0.4258876], [0.6320294, 0.5921311, -0.5172187], [0.8606531, 0.309017, -0.4258876], [0.2018716, 0.8550825, -0.4956583], [0.7147284, -0.4891254, -0.5172187], [0.4333553, -0.8266125, -0.3827669], [0.07268925, -0.8944272, -0.460773], [-0.8398294, 0.3618034, -0.4258876], [-0.5452491, 0.7127322, -0.460773], [-0.2191601, 0.745356, -0.6434351], [-0.722762, -0.436339, -0.552104], [-0.4160667, -0.7738261, -0.4956583], [0.6997536, 0.3618034, -0.6301101], [0.4062656, 0.7127322, -0.5869894], [0.04383203, 0.745356, -0.6783205], [0.5538289, -0.436339, -0.7214412], [0.2724557, -0.7738261, -0.5869894], [-0.7348768, 0.2520769, -0.6434351], [-0.4402965, 0.6030057, -0.6783205], [-0.6625252, -0.2412023, -0.7214412], [-0.518368, -0.5786893, -0.6434351], [0.541714, 0.2520769, -0.8127722], [0.248226, 0.6030057, -0.7696515], [0.4515276, -0.2412023, -0.8692179], [0.3326926, -0.5786893, -0.7563265], [-0.6671526, 0.02174919, -0.7563265], [-0.5351104, 0.372678, -0.7696515], [-0.4581312, -0.3835526, -0.8127722], [0.4469001, 0.02174919, -0.9041033], [0.3159502, 0.372678, -0.8825429], [0.2303913, -0.3835526, -0.9041033], [-0.4673861, 0.1423503, -0.8825429], [-0.2583647, -0.2629515, -0.9389886], [0.2211363, 0.1423503, -0.973874], [0.00462747, -0.2629515, -0.973874], [-0.2629922, 0, -0.973874], [0, 0, -1.008759]],
                    faces: [[0, 1, 4, 2], [3, 8, 14, 7], [5, 10, 18, 11], [6, 12, 20, 13], [9, 17, 25, 16], [15, 24, 35, 23], [19, 28, 41, 29], [21, 31, 44, 32], [22, 33, 45, 34], [26, 38, 50, 37], [27, 40, 51, 39], [30, 43, 54, 42], [36, 48, 60, 49], [46, 55, 67, 58], [47, 59, 65, 53], [52, 64, 73, 61], [56, 62, 74, 68], [57, 70, 81, 69], [63, 75, 87, 76], [66, 78, 90, 79], [71, 82, 94, 83], [72, 85, 95, 84], [77, 89, 99, 88], [80, 92, 101, 91], [86, 96, 105, 97], [93, 102, 110, 103], [98, 107, 113, 106], [100, 109, 114, 108], [104, 111, 116, 112], [115, 118, 119, 117], [0, 2, 6, 13, 8, 3], [1, 5, 11, 17, 9, 4], [7, 14, 22, 34, 24, 15], [10, 19, 29, 40, 27, 18], [12, 21, 32, 43, 30, 20], [16, 25, 36, 49, 38, 26], [23, 35, 47, 53, 41, 28], [31, 37, 50, 62, 56, 44], [33, 46, 58, 70, 57, 45], [39, 51, 63, 76, 64, 52], [42, 54, 66, 79, 67, 55], [48, 61, 73, 85, 72, 60], [59, 71, 83, 89, 77, 65], [68, 74, 86, 97, 92, 80], [69, 81, 93, 103, 94, 82], [75, 88, 99, 107, 98, 87], [78, 91, 101, 109, 100, 90], [84, 95, 104, 112, 105, 96], [102, 108, 114, 118, 115, 110], [106, 113, 117, 119, 116, 111], [0, 3, 7, 15, 23, 28, 19, 10, 5, 1], [2, 4, 9, 16, 26, 37, 31, 21, 12, 6], [8, 13, 20, 30, 42, 55, 46, 33, 22, 14], [11, 18, 27, 39, 52, 61, 48, 36, 25, 17], [24, 34, 45, 57, 69, 82, 71, 59, 47, 35], [29, 41, 53, 65, 77, 88, 75, 63, 51, 40], [32, 44, 56, 68, 80, 91, 78, 66, 54, 43], [38, 49, 60, 72, 84, 96, 86, 74, 62, 50], [58, 67, 79, 90, 100, 108, 102, 93, 81, 70], [64, 76, 87, 98, 106, 111, 104, 95, 85, 73], [83, 94, 103, 110, 115, 117, 113, 107, 99, 89], [92, 97, 105, 112, 116, 119, 118, 114, 109, 101]]
                };
                archimedea["rhombicosidodecahedron"] = {
                    vertices: [[0, 0, 1.026054], [0.447838, 0, 0.9231617], [-0.02363976, 0.4472136, 0.9231617], [-0.4050732, 0.190983, 0.9231617], [-0.1693344, -0.4145898, 0.9231617], [0.4241982, 0.4472136, 0.8202696], [0.7673818, 0.190983, 0.6537868], [0.5552827, -0.4145898, 0.7566788], [-0.2312241, 0.7562306, 0.6537868], [-0.5744076, -0.2236068, 0.8202696], [-0.6126576, 0.5, 0.6537868], [0.1738492, -0.6708204, 0.7566788], [-0.4669629, -0.6381966, 0.6537868], [0.493393, 0.7562306, 0.4873039], [0.8748265, -0.2236068, 0.4873039], [0.8365765, 0.5, 0.320821], [0.7054921, -0.6381966, 0.3844118], [0.08831973, 0.9472136, 0.3844118], [-0.5434628, 0.809017, 0.320821], [-0.8866463, -0.1708204, 0.4873039], [-0.9102861, 0.2763932, 0.3844118], [-0.1237794, -0.8944272, 0.4873039], [0.3240586, -0.8944272, 0.3844118], [-0.7792016, -0.5854102, 0.320821], [0.6289922, 0.809017, 0.05144604], [1.010426, -0.1708204, 0.05144604], [0.9867859, 0.2763932, -0.05144604], [0.8410913, -0.5854102, -0.05144604], [-0.223919, 1, 0.05144604], [0.223919, 1, -0.05144604], [-0.8410913, 0.5854102, 0.05144604], [-0.9867859, -0.2763932, 0.05144604], [-1.010426, 0.1708204, -0.05144604], [-0.223919, -1, 0.05144604], [0.223919, -1, -0.05144604], [-0.6289922, -0.809017, -0.05144604], [0.7792016, 0.5854102, -0.320821], [0.9102861, -0.2763932, -0.3844118], [0.8866463, 0.1708204, -0.4873039], [0.5434628, -0.809017, -0.320821], [-0.3240586, 0.8944272, -0.3844118], [0.1237794, 0.8944272, -0.4873039], [-0.7054921, 0.6381966, -0.3844118], [-0.8365765, -0.5, -0.320821], [-0.8748265, 0.2236068, -0.4873039], [-0.08831973, -0.9472136, -0.3844118], [-0.493393, -0.7562306, -0.4873039], [0.4669629, 0.6381966, -0.6537868], [0.6126576, -0.5, -0.6537868], [0.5744076, 0.2236068, -0.8202696], [0.2312241, -0.7562306, -0.6537868], [-0.1738492, 0.6708204, -0.7566788], [-0.5552827, 0.4145898, -0.7566788], [-0.7673818, -0.190983, -0.6537868], [-0.4241982, -0.4472136, -0.8202696], [0.1693344, 0.4145898, -0.9231617], [0.4050732, -0.190983, -0.9231617], [0.02363976, -0.4472136, -0.9231617], [-0.447838, 0, -0.9231617], [0, 0, -1.026054]],
                    faces: [[0, 2, 3], [1, 6, 5], [4, 9, 12], [7, 16, 14], [8, 18, 10], [11, 21, 22], [13, 15, 24], [17, 29, 28], [19, 31, 23], [20, 30, 32], [25, 27, 37], [26, 38, 36], [33, 45, 34], [35, 43, 46], [39, 50, 48], [40, 41, 51], [42, 52, 44], [47, 49, 55], [53, 58, 54], [56, 57, 59], [0, 1, 5, 2], [0, 3, 9, 4], [1, 7, 14, 6], [2, 8, 10, 3], [4, 12, 21, 11], [5, 6, 15, 13], [7, 11, 22, 16], [8, 17, 28, 18], [9, 19, 23, 12], [10, 18, 30, 20], [13, 24, 29, 17], [14, 16, 27, 25], [15, 26, 36, 24], [19, 20, 32, 31], [21, 33, 34, 22], [23, 31, 43, 35], [25, 37, 38, 26], [27, 39, 48, 37], [28, 29, 41, 40], [30, 42, 44, 32], [33, 35, 46, 45], [34, 45, 50, 39], [36, 38, 49, 47], [40, 51, 52, 42], [41, 47, 55, 51], [43, 53, 54, 46], [44, 52, 58, 53], [48, 50, 57, 56], [49, 56, 59, 55], [54, 58, 59, 57], [0, 4, 11, 7, 1], [2, 5, 13, 17, 8], [3, 10, 20, 19, 9], [6, 14, 25, 26, 15], [12, 23, 35, 33, 21], [16, 22, 34, 39, 27], [18, 28, 40, 42, 30], [24, 36, 47, 41, 29], [31, 32, 44, 53, 43], [37, 48, 56, 49, 38], [45, 46, 54, 57, 50], [51, 55, 59, 58, 52]]
                };
                archimedea["snub dodecahedron"] = {
                    vertices: [[0, 0, 1.028031], [0.4638569, 0, 0.9174342], [0.2187436, 0.4090409, 0.9174342], [-0.2575486, 0.3857874, 0.9174342], [-0.4616509, -0.04518499, 0.9174342], [-0.177858, -0.4284037, 0.9174342], [0.5726782, -0.4284037, 0.7384841], [0.8259401, -0.04518499, 0.6104342], [0.6437955, 0.3857874, 0.702527], [0.349648, 0.7496433, 0.6104342], [-0.421009, 0.7120184, 0.6104342], [-0.6783139, 0.3212396, 0.702527], [-0.6031536, -0.4466658, 0.702527], [-0.2749612, -0.7801379, 0.6104342], [0.1760766, -0.6931717, 0.7384841], [0.5208138, -0.7801379, 0.4206978], [0.8552518, -0.4466658, 0.3547998], [1.01294, -0.03548596, 0.1718776], [0.7182239, 0.661842, 0.3208868], [0.3633691, 0.9454568, 0.1758496], [-0.04574087, 0.9368937, 0.4206978], [-0.4537394, 0.905564, 0.1758496], [-0.7792791, 0.5887312, 0.3208868], [-0.9537217, 0.1462217, 0.3547998], [-0.9072701, -0.3283699, 0.3547998], [-0.6503371, -0.7286577, 0.3208868], [0.08459482, -0.9611501, 0.3547998], [0.3949153, -0.9491262, -0.007072558], [0.9360473, -0.409557, -0.1136978], [0.9829382, 0.02692292, -0.2999274], [0.9463677, 0.4014808, -0.007072558], [0.6704578, 0.7662826, -0.1419366], [-0.05007646, 1.025698, -0.04779978], [-0.4294337, 0.8845784, -0.2999274], [-0.9561681, 0.3719321, -0.06525234], [-1.022036, -0.1000338, -0.04779978], [-0.8659056, -0.5502712, -0.06525234], [-0.5227761, -0.8778535, -0.1136978], [-0.06856319, -1.021542, -0.09273844], [0.2232046, -0.8974878, -0.4489366], [0.6515438, -0.7200947, -0.3373472], [0.7969535, -0.3253959, -0.5619888], [0.8066872, 0.4395354, -0.461425], [0.4468035, 0.735788, -0.5619888], [0.001488801, 0.8961155, -0.503809], [-0.3535403, 0.6537658, -0.7102452], [-0.7399517, 0.5547758, -0.4489366], [-0.9120238, 0.1102196, -0.461425], [-0.6593998, -0.6182798, -0.4896639], [-0.2490651, -0.8608088, -0.503809], [0.4301047, -0.5764987, -0.734512], [0.5057577, -0.1305283, -0.8854492], [0.5117735, 0.3422252, -0.8232973], [0.09739587, 0.5771941, -0.8451093], [-0.6018946, 0.2552591, -0.7933564], [-0.6879024, -0.2100741, -0.734512], [-0.3340437, -0.5171509, -0.8232973], [0.08570633, -0.3414376, -0.9658797], [0.1277354, 0.1313635, -1.011571], [-0.3044499, -0.06760332, -0.979586]],
                    faces: [[0, 1, 2], [0, 2, 3], [0, 3, 4], [0, 4, 5], [1, 6, 7], [1, 7, 8], [1, 8, 2], [2, 8, 9], [3, 10, 11], [3, 11, 4], [4, 12, 5], [5, 12, 13], [5, 13, 14], [6, 14, 15], [6, 15, 16], [6, 16, 7], [7, 16, 17], [8, 18, 9], [9, 18, 19], [9, 19, 20], [10, 20, 21], [10, 21, 22], [10, 22, 11], [11, 22, 23], [12, 24, 25], [12, 25, 13], [13, 26, 14], [14, 26, 15], [15, 26, 27], [16, 28, 17], [17, 28, 29], [17, 29, 30], [18, 30, 31], [18, 31, 19], [19, 32, 20], [20, 32, 21], [21, 32, 33], [22, 34, 23], [23, 34, 35], [23, 35, 24], [24, 35, 36], [24, 36, 25], [25, 36, 37], [26, 38, 27], [27, 38, 39], [27, 39, 40], [28, 40, 41], [28, 41, 29], [29, 42, 30], [30, 42, 31], [31, 42, 43], [32, 44, 33], [33, 44, 45], [33, 45, 46], [34, 46, 47], [34, 47, 35], [36, 48, 37], [37, 48, 49], [37, 49, 38], [38, 49, 39], [39, 50, 40], [40, 50, 41], [41, 50, 51], [42, 52, 43], [43, 52, 53], [43, 53, 44], [44, 53, 45], [45, 54, 46], [46, 54, 47], [47, 54, 55], [48, 55, 56], [48, 56, 49], [50, 57, 51], [51, 57, 58], [51, 58, 52], [52, 58, 53], [54, 59, 55], [55, 59, 56], [56, 59, 57], [57, 59, 58], [0, 5, 14, 6, 1], [2, 9, 20, 10, 3], [4, 11, 23, 24, 12], [7, 17, 30, 18, 8], [13, 25, 37, 38, 26], [15, 27, 40, 28, 16], [19, 31, 43, 44, 32], [21, 33, 46, 34, 22], [29, 41, 51, 52, 42], [35, 47, 55, 48, 36], [39, 49, 56, 57, 50], [45, 53, 58, 59, 54]]
                };
                archimedea["triangular prism"] = {
                    vertices: [[0, 0, 1.322876], [1.309307, 0, 0.1889822], [-0.9819805, 0.8660254, 0.1889822], [0.1636634, -1.299038, 0.1889822], [0.3273268, 0.8660254, -0.9449112], [-0.8183171, -0.4330127, -0.9449112]],
                    faces: [[0, 3, 1], [2, 4, 5], [0, 1, 4, 2], [0, 2, 5, 3], [1, 3, 5, 4]]
                };
                archimedea["pentagonal prism"] = {
                    vertices: [[0, 0, 1.159953], [1.013464, 0, 0.5642542], [-0.3501431, 0.9510565, 0.5642542], [-0.7715208, -0.6571639, 0.5642542], [0.6633206, 0.9510565, -0.03144481], [0.8682979, -0.6571639, -0.3996071], [-1.121664, 0.2938926, -0.03144481], [-0.2348831, -1.063314, -0.3996071], [0.5181548, 0.2938926, -0.9953061], [-0.5850262, -0.112257, -0.9953061]],
                    faces: [[0, 1, 4, 2], [0, 2, 6, 3], [1, 5, 8, 4], [3, 6, 9, 7], [5, 7, 9, 8], [0, 3, 7, 5, 1], [2, 4, 8, 9, 6]]
                };
                archimedea["hexagonal prism"] = {
                    vertices: [[0, 0, 1.118034], [0.8944272, 0, 0.6708204], [-0.2236068, 0.8660254, 0.6708204], [-0.7826238, -0.4330127, 0.6708204], [0.6708204, 0.8660254, 0.2236068], [1.006231, -0.4330127, -0.2236068], [-1.006231, 0.4330127, 0.2236068], [-0.6708204, -0.8660254, -0.2236068], [0.7826238, 0.4330127, -0.6708204], [0.2236068, -0.8660254, -0.6708204], [-0.8944272, 0, -0.6708204], [0, 0, -1.118034]],
                    faces: [[0, 1, 4, 2], [0, 2, 6, 3], [1, 5, 8, 4], [3, 6, 10, 7], [5, 9, 11, 8], [7, 10, 11, 9], [0, 3, 7, 9, 5, 1], [2, 4, 8, 11, 10, 6]]
                };
                archimedea["square pyramid"] = {
                    vertices: [[-0.729665, 0.670121, 0.319155], [-0.655235, -0.29213, -0.754096], [-0.093922, -0.607123, 0.537818], [0.702196, 0.595691, 0.485187], [0.776626, -0.36656, -0.588064]],
                    faces: [[1, 4, 2], [0, 1, 2], [3, 0, 2], [4, 3, 2], [4, 1, 0, 3]]
                };
                archimedea["pentagonal pyramid"] = {
                    vertices: [[-0.868849, -0.100041, 0.61257], [-0.329458, 0.976099, 0.28078], [-0.26629, -0.013796, -0.477654], [-0.13392, -1.034115, 0.229829], [0.738834, 0.707117, -0.307018], [0.859683, -0.535264, -0.338508]],
                    faces: [[3, 0, 2], [5, 3, 2], [4, 5, 2], [1, 4, 2], [0, 1, 2], [0, 3, 5, 4, 1]]
                };
                archimedea["triangular bipyramid"] = {
                    vertices: [[-0.610389, 0.243975, 0.531213], [-0.187812, -0.48795, -0.664016], [-0.187812, 0.9759, -0.664016], [0.187812, -0.9759, 0.664016], [0.798201, 0.243975, 0.132803]],
                    faces: [[1, 3, 0], [3, 4, 0], [3, 1, 4], [0, 2, 1], [0, 4, 2], [2, 4, 1]]
                };
                archimedea["pentagonal bipyramid"] = {
                    vertices: [[-1.028778, 0.392027, -0.048786], [-0.640503, -0.646161, 0.621837], [-0.125162, -0.395663, -0.540059], [0.004683, 0.888447, -0.651988], [0.125161, 0.395663, 0.540059], [0.632925, -0.791376, 0.433102], [1.031672, 0.157063, -0.354165]],
                    faces: [[3, 2, 0], [2, 1, 0], [2, 5, 1], [0, 4, 3], [0, 1, 4], [4, 1, 5], [2, 3, 6], [3, 4, 6], [5, 2, 6], [4, 5, 6]]
                };
                var data = archimedea[this.type];
                if (data != null) {
                    var mamesh = this.dataToMamesh(data);
                    if (callback != null)
                        callback(mamesh);
                    return mamesh;
                }
                else {
                    if (callback == null)
                        throw "the data for the polyhedron:" + this.type + "are not localy stored. They are downloaded, so you must give a callback method in the go-method";
                    var xhttp = new XMLHttpRequest();
                    var thus_1 = this;
                    xhttp.onreadystatechange = function () {
                        if (this.readyState == 4 && this.status == 200) {
                            var mamesh = thus_1.dataToMamesh(JSON.parse(this.responseText));
                            callback(mamesh);
                        }
                    };
                    var str = thus_1.type.replace(/\s+/g, '-').toLowerCase();
                    xhttp.open("GET", "TS/polyhedron/polyhedra/" + str + ".json", true);
                    xhttp.send();
                }
            };
            return Polyhedron;
        }());
        polyhedron_1.Polyhedron = Polyhedron;
    })(polyhedron = mathis.polyhedron || (mathis.polyhedron = {}));
})(mathis || (mathis = {}));
//# sourceMappingURL=MATHIS_2d.js.map