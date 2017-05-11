/**
 * Created by vigon on 06/05/2016.
 */
var mathis;
(function (mathis) {
    var usualFunction;
    (function (usualFunction) {
        usualFunction.sinh = function (x) { return (Math.exp(x) - Math.exp(-x)) / 2; };
        usualFunction.tanh = function (x) { return (Math.exp(x) - Math.exp(-x)) / (Math.exp(x) + Math.exp(-x)); };
        usualFunction.sech = function (x) { return 2 / (Math.exp(x) + Math.exp(-x)); };
        usualFunction.sechP = function (x) { return -usualFunction.tanh(x) * usualFunction.sech(x); };
        usualFunction.sechPP = function (x) { return -usualFunction.tanhP(x) * usualFunction.sech(x) - usualFunction.tanh(x) * usualFunction.sechP(x); };
        usualFunction.tanhP = function (x) {
            var ta = usualFunction.tanh(x);
            return 1 - ta * ta;
        };
        usualFunction.tanhPP = function (x) { return -2 * usualFunction.tanh(x) * usualFunction.tanhP(x); };
        usualFunction.tractrice = function (x) { return new mathis.XYZ(usualFunction.sech(x), x - usualFunction.tanh(x), 0); };
        usualFunction.tractriceP = function (x) { return new mathis.XYZ(usualFunction.sechP(x), 1 - usualFunction.tanhP(x), 0); };
        usualFunction.tractricePP = function (x) { return new mathis.XYZ(usualFunction.sechPP(x), -usualFunction.tanhPP(x), 0); };
        usualFunction.rotationYAxis = function (theta) {
            var res = new mathis.MM();
            var cos = Math.cos(theta);
            var sin = Math.sin(theta);
            mathis.geo.numbersToMM(cos, 0, sin, 0, 0, 1, 0, 0, -sin, 0, cos, 0, 0, 0, 0, 1, res);
            return res;
        };
        usualFunction.rotationYAxisP = function (theta) {
            var res = new mathis.MM();
            var cos = Math.cos(theta);
            var sin = Math.sin(theta);
            mathis.geo.numbersToMM(-sin, 0, cos, 0, 0, 0, 0, 0, -cos, 0, -sin, 0, 0, 0, 0, 1, res);
            return res;
        };
        usualFunction.rotationYAxisPP = function (theta) {
            var res = new mathis.MM();
            var cos = Math.cos(theta);
            var sin = Math.sin(theta);
            mathis.geo.numbersToMM(-cos, 0, -sin, 0, 0, 0, 0, 0, sin, 0, -cos, 0, 0, 0, 0, 1, res);
            return res;
        };
    })(usualFunction = mathis.usualFunction || (mathis.usualFunction = {}));
    var riemann;
    (function (riemann) {
        var Carte = (function () {
            function Carte() {
                /** -1 to inverse orientation*/
                this.orientationCoef = +1;
                this.unit = 1;
                this.point = new mathis.XYZ(0, 0, 0);
                this._meanLinkLengthAtArrival = null;
            }
            Carte.prototype.xyzToUV = function (xyz, recomputeStandartDevialtion) {
                if (recomputeStandartDevialtion === void 0) { recomputeStandartDevialtion = false; }
                if (this.maillage == null)
                    throw 'you must give a maillage to use xyzToUV ';
                var uv = new mathis.UV(0, 0);
                var shortestDist = Number.MAX_VALUE;
                var minDistToBorder = Number.MAX_VALUE;
                var vertex = null;
                for (var _i = 0, _a = this.maillage.vertices; _i < _a.length; _i++) {
                    vertex = _a[_i];
                    var u = vertex.position.x;
                    var v = vertex.position.y;
                    this.point.copyFrom(this.X(u, v));
                    var dist = mathis.geo.distance(this.point, xyz);
                    if (dist < shortestDist) {
                        shortestDist = dist;
                        uv.u = u;
                        uv.v = v;
                    }
                    /**the distance to border is computed from the clicked xyz (and not from the choosen point) but that is without importance
                     * this distance can be used to chose the right cart among several*/
                    if (vertex.hasMark(mathis.Vertex.Markers.border)) {
                        var distToBorder = mathis.geo.distance(xyz, this.point);
                        if (distToBorder < minDistToBorder)
                            minDistToBorder = distToBorder;
                    }
                }
                if (recomputeStandartDevialtion || this._meanLinkLengthAtArrival == null)
                    this._meanLinkLengthAtArrival = this.meanLinkLengthAtArrival();
                if (shortestDist < 1.1 * this._meanLinkLengthAtArrival)
                    return { uv: uv, distToBorder: minDistToBorder, distToNearestArrivalMesh: shortestDist };
                else {
                    //cc('in xyzTouV',this.name,xyz,shortestDist,this._meanLinkLengthAtArrival)
                    return null;
                }
            };
            Carte.prototype.e = function (u, v) {
                return mathis.geo.dot(this.newN(u, v), this.Xuu(u, v));
            };
            Carte.prototype.f = function (u, v) {
                return mathis.geo.dot(this.newN(u, v), this.Xuv(u, v));
            };
            Carte.prototype.g = function (u, v) {
                return mathis.geo.dot(this.newN(u, v), this.Xvv(u, v));
            };
            Carte.prototype.E = function (u, v) {
                return mathis.geo.dot(this.Xu(u, v), this.Xu(u, v));
            };
            Carte.prototype.F = function (u, v) {
                return mathis.geo.dot(this.Xu(u, v), this.Xv(u, v));
            };
            Carte.prototype.G = function (u, v) {
                return mathis.geo.dot(this.Xv(u, v), this.Xv(u, v));
            };
            Carte.prototype.createArrivalMeshFromMaillage = function () {
                var _this = this;
                var mameshDeepCopier = new mathis.mameshModification.MameshDeepCopier(this.maillage);
                mameshDeepCopier.copyCutSegmentsDico = false;
                this.arrivalOpenMesh = mameshDeepCopier.go();
                this.arrivalOpenMesh.vertices.forEach(function (vertex) {
                    var u = vertex.position.x;
                    var v = vertex.position.y;
                    vertex.position = _this.X(u, v);
                });
            };
            Carte.prototype.dNinTangentBasis = function (u, v) {
                var res = new mathis.M22();
                var e = this.e(u, v);
                var f = this.f(u, v);
                var g = this.g(u, v);
                var E = this.E(u, v);
                var F = this.F(u, v);
                var G = this.G(u, v);
                var det = E * G - F * F;
                res.m11 = (f * F - e * G) / det;
                res.m12 = (g * F - f * G) / det;
                res.m21 = (e * F - f * E) / det;
                res.m22 = (f * F - g * E) / det;
                return res;
            };
            Carte.prototype.dNaction = function (u, v, vect) {
                var a = this.dNinTangentBasis(u, v);
                var vectUV = this.canonicalToTangentBasis(u, v, vect);
                var trans = a.multiplyUV(vectUV);
                return this.tagentToCanonicalBasis(u, v, trans);
            };
            Carte.prototype.canonicalToTangentBasis = function (u, v, vect) {
                var Xu = this.Xu(u, v);
                var Xv = this.Xv(u, v);
                var mat = new mathis.M22();
                mat.m11 = Xu.x;
                mat.m21 = Xu.y;
                mat.m21 = Xv.x;
                mat.m22 = Xv.y;
                var inv = mat.inverse();
                cc(inv.determinant());
                var vect2 = new mathis.UV(vect.x, vect.y);
                return inv.multiplyUV(vect2);
            };
            Carte.prototype.tagentToCanonicalBasis = function (u, v, vect) {
                var Xu = this.Xu(u, v);
                var Xv = this.Xv(u, v);
                Xu.scale(vect.u);
                Xv.scale(vect.v);
                return Xu.add(Xv);
            };
            Carte.prototype.newN = function (u, v) {
                var res = new mathis.XYZ(0, 0, 0);
                mathis.geo.cross(this.Xu(u, v), this.Xv(u, v), res);
                res.normalize().scale(this.unit * this.orientationCoef);
                return res;
            };
            Carte.prototype.meanLinkLengthAtArrival = function () {
                var _this = this;
                var res = 0;
                var nb = 0;
                this.maillage.vertices.forEach(function (v) {
                    v.links.forEach(function (l) {
                        nb++;
                        res += mathis.geo.distance(_this.X(v.position.x, v.position.y), _this.X(l.to.position.x, l.to.position.y));
                    });
                });
                return res / nb;
            };
            return Carte;
        }());
        riemann.Carte = Carte;
        var Surface = (function () {
            function Surface() {
                this.cartes = [];
            }
            Surface.prototype.drawTheWholeSurface = function (scene) {
                this.drawOneMesh(this.wholeSurfaceMesh, scene);
            };
            Surface.prototype.drawOneCarte = function (carteIndex, scene) {
                this.drawOneMesh(this.cartes[carteIndex].arrivalOpenMesh, scene);
            };
            Surface.prototype.drawOneMesh = function (mesh, scene) {
                function lineIsChosen(line, space) {
                    var vertOk = true;
                    for (var _i = 0, line_1 = line; _i < line_1.length; _i++) {
                        var vert = line_1[_i];
                        if (vert.param.x % space != 0) {
                            vertOk = false;
                            break;
                        }
                    }
                    var horOk = true;
                    for (var _a = 0, line_2 = line; _a < line_2.length; _a++) {
                        var vert = line_2[_a];
                        if (vert.param.y % space != 0) {
                            horOk = false;
                            break;
                        }
                    }
                    return vertOk || horOk;
                }
                var lin = new mathis.visu3d.LinesViewer(mesh, scene);
                lin.constantRadius = 0.01;
                var linesOnSurf = lin.go();
                linesOnSurf.forEach(function (mesh) { return mesh.isPickable = false; });
                var surf = new mathis.visu3d.SurfaceViewer(mesh, scene);
                surf.alpha = 0.5;
                //surf.normalDuplication=visu3d.SurfaceVisuStatic.NormalDuplication.none
                //surf.sideOrientation=BABYLON.Mesh.BACKSIDE
                var meshSurf = surf.go();
                // let mat=new BABYLON.StandardMaterial('',this.surfaceMathisFrame.scene)
                // mat.diffuseColor=new Color3(0,1,1)
                // mat.backFaceCulling=true
                // mat.sideOrientation=BABYLON.Mesh.BACKSIDE
                // this.meshSurf.material=mat
            };
            Surface.prototype.findBestCarte = function (xyz) {
                var maxDistToBorder = -1;
                var chosenCarte = null;
                var chosenUV = null;
                this.cartes.forEach(function (carte) {
                    //cc('in find',carte.name)
                    var uvAndDist = carte.xyzToUV(xyz);
                    //cc('in find',uvAndDist,uvAndDist.distToBorder,'maxDistToBorder',maxDistToBorder)
                    /** we chose the carte for which the point is the most central (the further from the border)*/
                    if (uvAndDist != null && uvAndDist.distToBorder > maxDistToBorder) {
                        maxDistToBorder = uvAndDist.distToBorder;
                        chosenCarte = carte;
                        chosenUV = uvAndDist.uv;
                    }
                });
                /**do not change at all the following error  message, it is tested in riemann-test*/
                if (chosenUV == null) {
                    cc('the point which is not in any cart arrival is:', xyz.toString());
                    throw 'strange, the xyz do not belong to any carte-arrival';
                }
                return { uv: chosenUV, carte: chosenCarte };
            };
            return Surface;
        }());
        riemann.Surface = Surface;
        (function (SurfaceName) {
            SurfaceName[SurfaceName["selle"] = 0] = "selle";
            SurfaceName[SurfaceName["cylinder"] = 1] = "cylinder";
            SurfaceName[SurfaceName["torus"] = 2] = "torus";
            SurfaceName[SurfaceName["pseudoSphere"] = 3] = "pseudoSphere";
        })(riemann.SurfaceName || (riemann.SurfaceName = {}));
        var SurfaceName = riemann.SurfaceName; //ellipsoide
        var SurfaceMaker = (function () {
            function SurfaceMaker(surfaceName) {
                this.vertexToCarte = new mathis.HashMap();
                this.carteIndexToMinimalArrivalMesh = [];
                this.surfaceName = surfaceName;
            }
            SurfaceMaker.prototype.go = function () {
                this.surface = new Surface();
                this.surface.cartes = [];
                if (this.surfaceName == SurfaceName.torus) {
                    var oneCarte = function (origin, end) {
                        var gene = new mathis.reseau.BasisForRegularReseau();
                        gene.origin = origin;
                        gene.end = end;
                        gene.nbI = 32;
                        gene.nbJ = 64;
                        var departureMesh = new mathis.reseau.Regular(gene).go();
                        var arrivalMesh = new mathis.reseau.Regular(gene).go();
                        var r = 0.3;
                        var a = 0.7;
                        var carte0 = new Carte();
                        carte0.maillage = departureMesh;
                        carte0.arrivalOpenMesh = arrivalMesh;
                        carte0.X = function (u, v) { return new mathis.XYZ((r * Math.cos(u) + a) * Math.cos(v), (r * Math.cos(u) + a) * Math.sin(v), r * Math.sin(u)); };
                        carte0.Xu = function (u, v) { return new mathis.XYZ(-r * Math.sin(u) * Math.cos(v), -r * Math.sin(u) * Math.sin(v), r * Math.cos(u)); };
                        carte0.Xv = function (u, v) { return new mathis.XYZ(-(r * Math.cos(u) + a) * Math.sin(v), (r * Math.cos(u) + a) * Math.cos(v), 0); };
                        carte0.Xuu = function (u, v) { return new mathis.XYZ(-r * Math.cos(u) * Math.cos(v), -r * Math.cos(u) * Math.sin(v), -r * Math.sin(u)); };
                        carte0.Xuv = function (u, v) { return new mathis.XYZ(r * Math.sin(u) * Math.sin(v), -r * Math.sin(u) * Math.cos(v), 0); };
                        carte0.Xvv = function (u, v) { return new mathis.XYZ(-(r * Math.cos(u) + a) * Math.cos(v), -(r * Math.cos(u) + a) * Math.sin(v), 0); };
                        arrivalMesh.vertices.forEach(function (vert) {
                            var u = vert.position.x;
                            var v = vert.position.y;
                            vert.position = carte0.X(u, v);
                        });
                        return carte0;
                    };
                    var delta = 0.1;
                    this.surface.cartes.push(oneCarte(new mathis.XYZ(delta, delta, 0), new mathis.XYZ(2 * Math.PI - delta, 2 * Math.PI - delta, 0)));
                    this.surface.cartes.push(oneCarte(new mathis.XYZ(-Math.PI + delta, -Math.PI + delta, 0), new mathis.XYZ(Math.PI - delta, Math.PI - delta, 0)));
                    this.surface.wholeSurfaceMesh = oneCarte(new mathis.XYZ(0, 0, 0), new mathis.XYZ(2 * Math.PI, 2 * Math.PI, 0)).arrivalOpenMesh;
                }
                else if (this.surfaceName == SurfaceName.cylinder) {
                    var nb_1 = 40;
                    var oneCarte = function (origin, end) {
                        var gene = new mathis.reseau.BasisForRegularReseau();
                        gene.origin = origin;
                        gene.end = end;
                        gene.nbI = nb_1 + 1;
                        gene.nbJ = nb_1 + 1;
                        var departureMesh = new mathis.reseau.Regular(gene).go();
                        var arrivalMesh = new mathis.reseau.Regular(gene).go();
                        var rad = 0.5;
                        var carte0 = new Carte();
                        carte0.maillage = departureMesh;
                        carte0.arrivalOpenMesh = arrivalMesh;
                        carte0.X = function (u, v) { return new mathis.XYZ(rad * Math.cos(u), v, rad * Math.sin(u)); };
                        carte0.Xu = function (u, v) { return new mathis.XYZ(-rad * Math.sin(u), 0, rad * Math.cos(u)); };
                        carte0.Xv = function (u, v) { return new mathis.XYZ(0, 1, 0); };
                        carte0.Xuu = function (u, v) { return new mathis.XYZ(-rad * Math.cos(u), 0, -rad * Math.sin(u)); };
                        carte0.Xuv = function (u, v) { return new mathis.XYZ(0, 0, 0); };
                        carte0.Xvv = function (u, v) { return new mathis.XYZ(0, 0, 0); };
                        arrivalMesh.vertices.forEach(function (vert) {
                            var u = vert.position.x;
                            var v = vert.position.y;
                            vert.position = carte0.X(u, v);
                        });
                        return carte0;
                    };
                    var delta = 0.3;
                    this.surface.cartes.push(oneCarte(new mathis.XYZ(delta, -1 / 2, 0), new mathis.XYZ(2 * Math.PI - delta, 1 / 2, 0)));
                    this.surface.cartes.push(oneCarte(new mathis.XYZ(delta - Math.PI, -1 / 2, 0), new mathis.XYZ(Math.PI - delta, 1 / 2, 0)));
                    // delta=0.8
                    // let ma1=oneCarte(new XYZ(delta,-1/2, 0),new XYZ(2*Math.PI -delta, 1/2 , 0)).arrivalOpenMesh
                    // let ma2=oneCarte(new XYZ(delta-Math.PI,-1/2, 0),new XYZ(Math.PI-delta , 1/2 , 0)).arrivalOpenMesh
                    // let concurenter=new mameshModification.ConcurrentMameshesGraterAndSticker([ma1,ma2])
                    // concurenter.duringGratingSeedAreComputedFromBarycentersVersusFromAllPossibleCells=false
                    // concurenter.toleranceToBeOneOfTheClosest=0
                    this.surface.wholeSurfaceMesh = oneCarte(new mathis.XYZ(0, -1 / 2, 0), new mathis.XYZ(2 * Math.PI, 1 / 2, 0)).arrivalOpenMesh;
                }
                else if (this.surfaceName == SurfaceName.pseudoSphere) {
                    var oneCarte = function (origin, end) {
                        var gene = new mathis.reseau.BasisForRegularReseau();
                        gene.origin = origin;
                        gene.end = end;
                        gene.nbI = 32 + 1;
                        gene.nbJ = 20 + 1;
                        var departureMesh = new mathis.reseau.Regular(gene).go();
                        var arrivalMesh = new mathis.reseau.Regular(gene).go();
                        var rotationCarteMaker = new riemann.RotationCarteMaker(usualFunction.tractrice);
                        rotationCarteMaker.translation = new mathis.XYZ(0, -1, 0);
                        var sc = 1;
                        rotationCarteMaker.scaling = new mathis.XYZ(sc, sc, sc);
                        rotationCarteMaker.curveP = usualFunction.tractriceP;
                        rotationCarteMaker.curvePP = usualFunction.tractricePP;
                        var carte0 = rotationCarteMaker.go();
                        carte0.maillage = departureMesh;
                        carte0.arrivalOpenMesh = arrivalMesh;
                        arrivalMesh.vertices.forEach(function (vert) {
                            var u = vert.position.x;
                            var v = vert.position.y;
                            vert.position = carte0.X(u, v);
                        });
                        return carte0;
                    };
                    var delta = 0.3;
                    this.surface.cartes.push(oneCarte(new mathis.XYZ(delta, 0.1, 0), new mathis.XYZ(2 * Math.PI - delta, 3.5, 0)));
                    this.surface.cartes.push(oneCarte(new mathis.XYZ(-Math.PI + delta, 0.1, 0), new mathis.XYZ(Math.PI - delta, 3.5, 0)));
                    this.surface.wholeSurfaceMesh = oneCarte(new mathis.XYZ(0, 0.1, 0), new mathis.XYZ(2 * Math.PI, 3.5, 0)).arrivalOpenMesh;
                }
                else if (this.surfaceName == SurfaceName.selle) {
                    var oneCarte = function (origin, end) {
                        var gene = new mathis.reseau.BasisForRegularReseau();
                        gene.origin = origin;
                        gene.end = end;
                        gene.nbI = 40 + 1;
                        gene.nbJ = 40 + 1;
                        var departureMesh = new mathis.reseau.Regular(gene).go();
                        var arrivalMesh = new mathis.reseau.Regular(gene).go();
                        var carte0 = new Carte();
                        carte0.maillage = departureMesh;
                        carte0.arrivalOpenMesh = arrivalMesh;
                        carte0.X = function (u, v) { return new mathis.XYZ(u, v, v * v - u * u); };
                        carte0.Xu = function (u, v) { return new mathis.XYZ(1, 0, -2 * u); };
                        carte0.Xv = function (u, v) { return new mathis.XYZ(0, 1, 2 * v); };
                        carte0.Xuu = function (u, v) { return new mathis.XYZ(0, 0, -2); };
                        carte0.Xuv = function (u, v) { return new mathis.XYZ(0, 0, 0); };
                        carte0.Xvv = function (u, v) { return new mathis.XYZ(0, 0, 2); };
                        //     carte0.X = (u, v)=>new XYZ(u, v, v * v - u * u)
                        //     carte0.Xu = (u, v)=>new XYZ(1, 0, -2 * u)
                        //     carte0.Xv = (u, v)=>new XYZ(0, 1, 2 * v)
                        //
                        //     carte0.Xuu = (u, v)=>new XYZ(0, 0, -2)
                        //     carte0.Xuv = (u, v)=>new XYZ(0, 0, 0)
                        //     carte0.Xvv = (u, v)=>new XYZ(0, 0, 2)
                        arrivalMesh.vertices.forEach(function (vert) {
                            var u = vert.position.x;
                            var v = vert.position.y;
                            vert.position = carte0.X(u, v);
                        });
                        return carte0;
                    };
                    //let delta=0.1
                    //this.surface.cartes.push(oneCarte(new XYZ(delta,-1/2, 0),new XYZ(2*Math.PI -delta, 1/2 , 0)))
                    //this.surface.cartes.push(oneCarte(new XYZ(delta-Math.PI,-1/2, 0),new XYZ(Math.PI-delta , 1/2 , 0)))
                    var coef = 0.7;
                    this.surface.cartes.push(oneCarte(new mathis.XYZ(-coef, -coef, 0), new mathis.XYZ(coef, coef, 0)));
                    this.surface.wholeSurfaceMesh = oneCarte(new mathis.XYZ(-coef, -coef, 0), new mathis.XYZ(coef, coef, 0)).arrivalOpenMesh;
                }
                else
                    throw 'not yet';
                this.makeMinimalMeshesForEachCarte();
                return this.surface;
            };
            SurfaceMaker.prototype.makeMinimalMeshesForEachCarte = function () {
                //let selectedVertices:Vertex[]=[]
                var _this = this;
                var _loop_1 = function(carteIndex) {
                    var carte = this_1.surface.cartes[carteIndex];
                    var selectedVerticesForOneCart = [];
                    carte.arrivalOpenMesh.vertices.forEach(function (vert) {
                        var uvAndCarte = _this.surface.findBestCarte(vert.position);
                        if (uvAndCarte.carte == carte) {
                            //selectedVertices.push(vert)
                            _this.vertexToCarte.putValue(vert, carte);
                            selectedVerticesForOneCart.push(vert);
                        }
                    });
                    //cc('carte:',carte.name, carte.arrivalOpenMesh.vertices.length,'restricte',selectedVerticesForOneCart.length)
                    var subMamesh = new mathis.grateAndGlue.SubMameshExtractor(carte.arrivalOpenMesh, selectedVerticesForOneCart).go();
                    this_1.carteIndexToMinimalArrivalMesh[carteIndex] = subMamesh;
                };
                var this_1 = this;
                for (var carteIndex = 0; carteIndex < this.surface.cartes.length; carteIndex++) {
                    _loop_1(carteIndex);
                }
            };
            return SurfaceMaker;
        }());
        riemann.SurfaceMaker = SurfaceMaker;
        var RotationCarteMaker = (function () {
            function RotationCarteMaker(curve) {
                this.translation = new mathis.XYZ(0, 0, 0);
                this.scaling = new mathis.XYZ(1, 1, 1);
                this.curve = curve;
            }
            RotationCarteMaker.prototype.go = function () {
                var _this = this;
                var res = new Carte();
                res.X = function (u, v) {
                    var r = new mathis.XYZ(0, 0, 0);
                    mathis.geo.multiplicationMatrixVector(usualFunction.rotationYAxis(u), _this.curve(v), r);
                    r.resizes(_this.scaling).add(_this.translation);
                    return r;
                };
                res.Xu = function (u, v) {
                    var r = new mathis.XYZ(0, 0, 0);
                    mathis.geo.multiplicationMatrixVector(usualFunction.rotationYAxisP(u), _this.curve(v), r);
                    r.resizes(_this.scaling);
                    return r;
                };
                res.Xuu = function (u, v) {
                    var r = new mathis.XYZ(0, 0, 0);
                    mathis.geo.multiplicationMatrixVector(usualFunction.rotationYAxisPP(u), _this.curve(v), r);
                    r.resizes(_this.scaling);
                    return r;
                };
                res.Xv = function (u, v) {
                    var r = new mathis.XYZ(0, 0, 0);
                    mathis.geo.multiplicationMatrixVector(usualFunction.rotationYAxis(u), _this.curveP(v), r);
                    r.resizes(_this.scaling);
                    return r;
                };
                res.Xvv = function (u, v) {
                    var r = new mathis.XYZ(0, 0, 0);
                    mathis.geo.multiplicationMatrixVector(usualFunction.rotationYAxis(u), _this.curvePP(v), r);
                    r.resizes(_this.scaling);
                    return r;
                };
                res.Xuv = function (u, v) {
                    var r = new mathis.XYZ(0, 0, 0);
                    mathis.geo.multiplicationMatrixVector(usualFunction.rotationYAxisP(u), _this.curveP(v), r);
                    r.resizes(_this.scaling);
                    return r;
                };
                return res;
            };
            return RotationCarteMaker;
        }());
        riemann.RotationCarteMaker = RotationCarteMaker;
    })(riemann = mathis.riemann || (mathis.riemann = {}));
})(mathis || (mathis = {}));
