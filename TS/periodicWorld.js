var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var mathis;
(function (mathis) {
    var periodicWorld;
    (function (periodicWorld) {
        var Vector3 = BABYLON.Vector3;
        var StandardMaterial = BABYLON.StandardMaterial;
        var FundamentalDomain = (function () {
            function FundamentalDomain(vecA, vecB, vecC) {
                this.vecA = vecA;
                this.vecB = vecB;
                this.vecC = vecC;
                this.matWebCoordinateToPoint = new mathis.MM();
                this.matPointToWebCoordinate = new mathis.MM();
                this.isCartesian = false;
                this.pointWC = new mathis.XYZ(0, 0, 0);
                this.domainCenter = new mathis.XYZ(0, 0, 0);
                this.domainAroundCenter = new mathis.XYZ(0, 0, 0);
                // le nombre de domaine pour courvir la distMax.
                // private  bounding:XYZ;
                // private formerDistMax:number;
                // private tempV = new XYZ(0, 0, 0)
                //
                //
                // public getBounding(distMax:number):XYZ {
                //     if (this.bounding != undefined && this.formerDistMax == distMax) return this.bounding;
                //     if (this.isCartesian) {
                //         this.formerDistMax = distMax;
                //         this.tempV.x = 1;
                //         this.tempV.y = 1;
                //         this.tempV.z = 1;
                //         this.webCoordinateToPoint(this.tempV, this.tempV)
                //         //this.webCoordinateToPointToRef(this.tempV, this.tempV);
                //         this.bounding = new XYZ((Math.abs(this.tempV.x)), ( Math.abs(this.tempV.y)), (Math.abs(this.tempV.z)));
                //         this.bounding.scaleInPlace(distMax);
                //         return this.bounding;
                //     }
                //     throw "for non paralleoid, must be rewrited"
                //
                // }
                this._positionWC = new WebCoordinate(0, 0, 0);
                this._domainPosition = new Domain(0, 0, 0);
                this._domainPositioncenter = new mathis.XYZ(0, 0, 0);
                this._zero = new mathis.XYZ(0, 0, 0);
                mathis.geo.matrixFromLines(vecA, vecB, vecC, this.matWebCoordinateToPoint);
                mathis.geo.inverse(this.matWebCoordinateToPoint, this.matPointToWebCoordinate);
            }
            FundamentalDomain.prototype.contains = function (point) {
                throw "must be override";
            };
            FundamentalDomain.prototype.webCoordinateToPoint = function (webCoordinate, result) {
                return mathis.geo.multiplicationMatrixVector(this.matWebCoordinateToPoint, webCoordinate, result); //XYZ.TransformCoordinates(webCoordinate, this.matWebCoordinateToPoint);
            };
            FundamentalDomain.prototype.pointToWebCoordinate = function (point, result) {
                mathis.geo.multiplicationMatrixVector(this.matPointToWebCoordinate, point, result);
            };
            FundamentalDomain.prototype.getDomainContaining = function (point) {
                this.pointToWebCoordinate(point, this.pointWC);
                //var pointWC = this.pointToWebCoordinate(point);
                if (this.isCartesian)
                    return new Domain(this.pointWC.x, this.pointWC.y, this.pointWC.z);
                else {
                    for (var i = -1; i <= 1; i++) {
                        for (var j = -1; j <= 1; j++) {
                            for (var k = -1; k <= 1; k++) {
                                var domainAround = new Domain(this.pointWC.x + i, this.pointWC.y + j, this.pointWC.z + k);
                                if (domainAround.contains(point, this))
                                    return domainAround;
                            }
                        }
                    }
                }
            };
            FundamentalDomain.prototype.getDomainsAround = function (nbRepetitions, distMax, exludeCentralDomain) {
                if (exludeCentralDomain === void 0) { exludeCentralDomain = true; }
                // domain.getCenter(this, this.domainCenter);
                var result = [];
                // var bounding = this.getBounding(distMax);
                // bounding.x = Math.ceil(bounding.x);
                // bounding.y = Math.ceil(bounding.y);
                // bounding.z = Math.ceil(bounding.z);
                var intRep = Math.floor(nbRepetitions /= 2);
                var bounding = new mathis.XYZ(intRep, intRep, intRep);
                for (var i = -bounding.x; i <= bounding.x; i++) {
                    for (var j = -bounding.y; j <= bounding.y; j++) {
                        for (var k = -bounding.z; k <= bounding.z; k++) {
                            var domainAround = new Domain(i, j, k);
                            if (!(exludeCentralDomain && i == 0 && j == 0 && k == 0)) {
                                domainAround.getCenter(this, this.domainAroundCenter);
                                if (mathis.XYZ.DistanceSquared(this.domainAroundCenter, this.domainCenter) < distMax * distMax)
                                    result.push(domainAround);
                            }
                        }
                    }
                }
                return result;
            };
            FundamentalDomain.prototype.modulo = function (position, positionInsideFD) {
                this.pointToWebCoordinate(position, this._positionWC);
                this._domainPosition.whichContains(this._positionWC);
                this._domainPosition.getCenter(this, this._domainPositioncenter);
                positionInsideFD.copyFrom(position).substract(this._domainPositioncenter);
                //if (!geo.xyzAlmostEquality(this._domainPositioncenter,this._zero) )  positionInsideFD
            };
            return FundamentalDomain;
        }());
        periodicWorld.FundamentalDomain = FundamentalDomain;
        var CartesianFundamentalDomain = (function (_super) {
            __extends(CartesianFundamentalDomain, _super);
            function CartesianFundamentalDomain(vecA, vecB, vecC) {
                _super.call(this, vecA, vecB, vecC);
                this.pointWC2 = new mathis.XYZ(0, 0, 0);
                this.isCartesian = true;
            }
            CartesianFundamentalDomain.prototype.contains = function (point) {
                _super.prototype.pointToWebCoordinate.call(this, point, this.pointWC2);
                //var pointWC = this.pointToWebCoordinate(point);
                if (Math.abs(this.pointWC2.x) > 1 / 2)
                    return false;
                if (Math.abs(this.pointWC2.y) > 1 / 2)
                    return false;
                if (Math.abs(this.pointWC2.z) > 1 / 2)
                    return false;
                return true;
            };
            CartesianFundamentalDomain.prototype.drawMe = function (scene) {
                var box = BABYLON.Mesh.CreateBox('', 1, scene);
                box.scaling = new Vector3(this.vecA.length(), this.vecB.length(), this.vecC.length());
                box.material = new StandardMaterial('', scene);
                box.material.alpha = 0.2;
                // let corner=this.getCorner()
                // box.position=corner
            };
            CartesianFundamentalDomain.prototype.getCorner = function () {
                var corner = new mathis.XYZ(0, 0, 0);
                corner.add(this.vecA).add(this.vecB).add(this.vecC);
                corner.scaleInPlace(-0.5);
                return corner;
            };
            CartesianFundamentalDomain.prototype.getArretes = function (scene) {
                var corner = this.getCorner();
                var result = new Array();
                var radius = 1;
                var originalMesh = BABYLON.Mesh.CreateCylinder('', 1, radius, radius, 12, null, scene);
                var originalMesh1 = BABYLON.Mesh.CreateCylinder('', 1, radius, radius, 12, null, scene);
                var originalMesh2 = BABYLON.Mesh.CreateCylinder('', 1, radius, radius, 12, null, scene);
                new mathis.visu3d.ElongateAMeshFromBeginToEnd(corner, mathis.XYZ.newFrom(corner).add(this.vecA), originalMesh).goChanging();
                new mathis.visu3d.ElongateAMeshFromBeginToEnd(corner, mathis.XYZ.newFrom(corner).add(this.vecB), originalMesh1).goChanging();
                new mathis.visu3d.ElongateAMeshFromBeginToEnd(corner, mathis.XYZ.newFrom(corner).add(this.vecC), originalMesh2).goChanging();
                result.push(originalMesh);
                result.push(originalMesh1);
                result.push(originalMesh2);
                return result;
            };
            return CartesianFundamentalDomain;
        }(FundamentalDomain));
        periodicWorld.CartesianFundamentalDomain = CartesianFundamentalDomain;
        var WebCoordinate = (function (_super) {
            __extends(WebCoordinate, _super);
            function WebCoordinate() {
                _super.apply(this, arguments);
            }
            return WebCoordinate;
        }(mathis.XYZ));
        periodicWorld.WebCoordinate = WebCoordinate;
        //TODO maitre FD en champs
        var Domain = (function (_super) {
            __extends(Domain, _super);
            function Domain(i, j, k) {
                _super.call(this, Math.round(i), Math.round(j), Math.round(k));
                this._point = new mathis.XYZ(0, 0, 0);
                this._domainCenter = new mathis.XYZ(0, 0, 0);
            }
            Domain.prototype.whichContains = function (webCo) {
                this.x = Math.round(webCo.x);
                this.y = Math.round(webCo.y);
                this.z = Math.round(webCo.z);
                return this;
            };
            Domain.prototype.equals = function (otherDomain) {
                if (otherDomain.x != this.x)
                    return false;
                if (otherDomain.y != this.y)
                    return false;
                if (otherDomain.z != this.z)
                    return false;
                return true;
            };
            Domain.prototype.getCenter = function (fundamentalDomain, result) {
                fundamentalDomain.webCoordinateToPoint(this, result);
            };
            Domain.prototype.contains = function (point, fundamentalDomain) {
                this._point.copyFrom(point);
                this.getCenter(fundamentalDomain, this._domainCenter);
                this._point.substract(this._domainCenter);
                return fundamentalDomain.contains(this._point);
            };
            return Domain;
        }(WebCoordinate));
        periodicWorld.Domain = Domain;
        var Multiply = (function () {
            function Multiply(fd, maxDistance, nbRepetitions) {
                this.fd = fd;
                this.maxDistance = maxDistance;
                this.nbRepetitions = nbRepetitions;
            }
            Multiply.prototype.addMesh = function (mesh) {
                //mesh.isVisible = false;
                //mesh.visibility=0
                var _this = this;
                var visibleDomains = this.fd.getDomainsAround(this.nbRepetitions, this.maxDistance);
                visibleDomains.forEach(function (domain) {
                    var domainCenter = new mathis.XYZ(0, 0, 0);
                    var clone = mesh.createInstance('');
                    domain.getCenter(_this.fd, domainCenter);
                    clone.position.addInPlace(domainCenter);
                    clone.visibility = 1;
                    clone.isVisible = true;
                });
            };
            Multiply.prototype.addInstancedMesh = function (mesh) {
                var _this = this;
                var visibleDomains = this.fd.getDomainsAround(this.nbRepetitions, this.maxDistance);
                visibleDomains.forEach(function (domain) {
                    var domainCenter = new mathis.XYZ(0, 0, 0);
                    var clone = mesh.sourceMesh.createInstance('');
                    clone.scaling.copyFrom(mesh.scaling);
                    clone.position.copyFrom(mesh.position);
                    clone.rotationQuaternion = new BABYLON.Quaternion(0, 0, 0, 0);
                    clone.rotationQuaternion.copyFrom(mesh.rotationQuaternion);
                    domain.getCenter(_this.fd, domainCenter);
                    clone.position.addInPlace(domainCenter);
                    clone.visibility = 1;
                    clone.isVisible = true;
                });
            };
            Multiply.prototype.addAbstractMesh = function (abMesh) {
                if (abMesh instanceof BABYLON.Mesh)
                    this.addMesh(abMesh);
                else if (abMesh instanceof BABYLON.InstancedMesh)
                    this.addInstancedMesh(abMesh);
            };
            return Multiply;
        }());
        periodicWorld.Multiply = Multiply;
    })(periodicWorld = mathis.periodicWorld || (mathis.periodicWorld = {}));
})(mathis || (mathis = {}));
