/**
 * Created by vigon on 30/11/2016.
 */
var mathis;
(function (mathis) {
    var appli;
    (function (appli) {
        var InfiniteWordOnIndex = (function () {
            function InfiniteWordOnIndex(mathisFrame) {
                var _this = this;
                this.mathisFrame = mathisFrame;
                this.NAME = "InfiniteWordOnIndex";
                this.nameOfResau3d = mathis.infiniteWorlds.NameOfReseau3D.cube;
                this.$$$nameOfResau3d = new appli.Choices(mathis.allIntegerValueOfEnume(mathis.infiniteWorlds.NameOfReseau3D), { 'visualValues': mathis.allStringValueOfEnume(mathis.infiniteWorlds.NameOfReseau3D) });
                this.seeFromInside = true;
                this.$$$seeFromInside = new appli.Choices([true, false], { 'before': 'view from:', 'visualValues': ['inside', 'outside'], 'onchange': function () { _this.go2(); } });
            }
            InfiniteWordOnIndex.prototype.goForTheFirstTime = function () {
                this.mathisFrame.clearScene();
                this.infinite = new mathis.infiniteWorlds.InfiniteCartesian(this.mathisFrame);
                this.infinite.buildLightCameraSkyboxAndFog = true;
                this.common();
            };
            InfiniteWordOnIndex.prototype.go = function () {
                this.mathisFrame.clearScene(false, false, false);
                //this.infinite=new infiniteWorlds.InfiniteCartesian(this.mathisFrame)
                this.infinite.buildLightCameraSkyboxAndFog = false;
                this.common();
            };
            InfiniteWordOnIndex.prototype.common = function () {
                this.infinite.nameOfResau3d = this.nameOfResau3d;
                this.infinite.go();
            };
            //private weAreInside=true
            InfiniteWordOnIndex.prototype.go2 = function () {
                if (this.seeFromInside)
                    this.infinite.seeWorldFromInside();
                else
                    this.infinite.seeWorldFromOutside();
            };
            return InfiniteWordOnIndex;
        }());
        appli.InfiniteWordOnIndex = InfiniteWordOnIndex;
        var IsingOnIndex = (function () {
            function IsingOnIndex(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.NAME = "IsingOnIndex";
                this.beta = 0.5;
                this.$$$beta = new appli.Choices([0, 0.5, 1, 3], { 'before': "repulsion force:" });
                this.q = 1;
                this.$$$q = new appli.Choices([0.1, 0.5, 1, 3], { 'before': "density:" });
                this.nbDicho = 4;
                this.$$$nbDicho = new appli.Choices([2, 3, 4], { 'before': "nb particles:" });
            }
            IsingOnIndex.prototype.goForTheFirstTime = function () {
                this.mathisFrame.clearScene();
                var ising = new mathis.mecaStat.IsingOnMesh(this.mathisFrame);
                ising.defineLightAndCamera = true;
                this.common(ising);
            };
            IsingOnIndex.prototype.go = function () {
                this.mathisFrame.clearScene(false, false);
                var ising = new mathis.mecaStat.IsingOnMesh(this.mathisFrame);
                ising.defineLightAndCamera = false;
                this.common(ising);
            };
            IsingOnIndex.prototype.common = function (ising) {
                ising.beta = this.beta;
                ising.q = this.q;
                ising.nbDicho = this.nbDicho;
                ising.go();
            };
            return IsingOnIndex;
        }());
        appli.IsingOnIndex = IsingOnIndex;
        var DifferentialOnIndex = (function () {
            function DifferentialOnIndex(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.NAME = "DifferentialOnIndex";
                this.vectorField = 2; //Math.floor(Math.random()*3)
                this.$$$vectorField = new appli.Choices([0, 1, 2], { label: 'vector field:' });
                this.noiseIntensity = 0;
                this.$$$noiseIntensity = new appli.Choices([0, 0.01, 0.02, 0.05, 0.1], { 'onchange': this.changeNoise, label: 'noise' });
            }
            DifferentialOnIndex.prototype.goForTheFirstTime = function () {
                this.mathisFrame.clearScene();
                this.common(true);
            };
            DifferentialOnIndex.prototype.go = function () {
                this.mathisFrame.clearScene(false, false);
                this.common(false);
            };
            DifferentialOnIndex.prototype.changeNoise = function () {
                var _this = this;
                if (this.diffsyst != null) {
                    this.diffsyst.vectorFieldForNoise = function (t, p, res) { res.copyFromFloats(_this.noiseIntensity, _this.noiseIntensity, 0); };
                    this.diffsyst.loadVectorFields();
                }
            };
            DifferentialOnIndex.prototype.common = function (makeCam) {
                var _this = this;
                /**vecter field périodique*/
                var vectorField0;
                {
                    //let scaled = new XYZ(0, 0, 0)
                    var A1_1 = function (t) { return 0.4 * Math.sin(0.5 * t); };
                    var A2_1 = function (t) { return 0.2 * Math.sin(0.5 * t); };
                    var a11_1 = function (t) { return 0; };
                    var a12_1 = function (t) { return 0; };
                    var a21_1 = function (t) { return 0; };
                    var a22_1 = function (t) { return 0; };
                    vectorField0 = function (t, p, res) {
                        //to01(p, scaled)
                        /**potential part*/
                        var raX = (p.x - 0.5) * 2;
                        var raY = (p.y - 0.5) * 4;
                        res.x = -raX * raY * raY;
                        res.y = -raX * raX * raY;
                        /**excitation part*/
                        res.x += p.x * (A1_1(t) + a11_1(t) * p.x + a12_1(t) * p.y);
                        res.y += p.y * (A2_1(t) + a21_1(t) * p.x + a22_1(t) * p.y);
                    };
                }
                var vectorField1;
                {
                    var A1_2 = function (t) { return 0.4 * Math.sin(t); };
                    var A2_2 = function (t) { return 0.2 * Math.sin(0.5 * t); };
                    var a11_2 = function (t) { return 0.1 * Math.sin(t); };
                    var a12_2 = function (t) { return -0.1 * Math.sin(t); };
                    var a21_2 = function (t) { return -0.1 * Math.sin(t); };
                    var a22_2 = function (t) { return 0.1 * Math.sin(t); };
                    vectorField1 = function (t, p, res) {
                        /**potential part*/
                        var raX = (p.x - 0.5) * 2;
                        var raY = (p.y - 0.5) * 4;
                        res.x = -raX * raY * raY;
                        res.y = -raX * raX * raY;
                        /**exitation part*/
                        res.x += p.x * (A1_2(t) + a11_2(t) * p.x + a12_2(t) * p.y);
                        res.y += p.y * (A2_2(t) + a21_2(t) * p.x + a22_2(t) * p.y);
                    };
                }
                var vectorField2;
                {
                    var A1_3 = function (t) { return 0.4 * Math.sin(0.5 * t); };
                    var A2_3 = function (t) { return 0.2 * Math.sin(0.3 * t); };
                    var a11_3 = function (t) { return 0; };
                    var a12_3 = function (t) { return 0; };
                    var a21_3 = function (t) { return 0; };
                    var a22_3 = function (t) { return 0.1 * Math.sin(t); };
                    vectorField2 = function (t, p, res) {
                        /**potential part*/
                        var raX = (p.x - 0.5) * 2;
                        var raY = (p.y - 0.5) * 4;
                        res.x = -raX * raY * raY;
                        res.y = -raX * raX * raY;
                        /**exitation part*/
                        res.x += p.x * (A1_3(t) + a11_3(t) * p.x + a12_3(t) * p.y);
                        res.y += p.y * (A2_3(t) + a21_3(t) * p.x + a22_3(t) * p.y);
                    };
                }
                var vectorField;
                if (this.vectorField == 0)
                    vectorField = vectorField0;
                else if (this.vectorField == 1)
                    vectorField = vectorField1;
                else if (this.vectorField == 2)
                    vectorField = vectorField2;
                var vectorFieldForNoise = function (t, p, res) { res.copyFromFloats(_this.noiseIntensity, _this.noiseIntensity, 0); };
                this.diffsyst = new mathis.differentialSystem.TwoDim(vectorField, this.mathisFrame);
                this.diffsyst.originView = new mathis.XYZ(-1, -1, 0);
                this.diffsyst.endView = new mathis.XYZ(1, 1, 0);
                this.diffsyst.vectorFieldForNoise = vectorFieldForNoise;
                this.diffsyst.makeLightAndCamera = makeCam;
                this.diffsyst.go();
            };
            return DifferentialOnIndex;
        }());
        appli.DifferentialOnIndex = DifferentialOnIndex;
        var FractalOnIndex = (function () {
            function FractalOnIndex(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.NAME = "FractalOnIndex";
                this.alpha = 1.2;
                this.$$$alpha = new appli.Choices([0.8, 1, 1.2, 1.5, 1.7, 1.9], { label: 'alpha' });
                this.beta = 0.;
                this.$$$beta = new appli.Choices([-1, -0.7, -0.5, -0.2, 0, 0.2, 0.5, 0.7, 1], { label: 'beta' });
                this.nbDicho = 4;
                this.$$$nbDicho = new appli.Choices([2, 3, 4, 5], { label: 'nb dichotomy' });
                this.showLine = false;
                this.$$$showLine = new appli.Choices([true, false], { label: "showLines:" });
                this.shape = 'plan';
                this.$$$shape = new appli.Choices(['sphere', 'plan'], { label: 'shape:' });
            }
            FractalOnIndex.prototype.goForTheFirstTime = function () {
                this.mathisFrame.clearScene();
                this.mathisFrame.addDefaultCamera();
                this.mathisFrame.addDefaultLight();
                this.mathisFrame.getGrabberCamera().changePosition(new mathis.XYZ(0, 0, -7));
                this.go();
            };
            FractalOnIndex.prototype.go = function () {
                this.mathisFrame.clearScene(false, false);
                var mamesh;
                if (this.shape == 'sphere') {
                    var creator = new mathis.polyhedron.Polyhedron("dodecahedron");
                    mamesh = creator.go();
                }
                else {
                    var basis = new mathis.reseau.BasisForRegularReseau();
                    basis.squareMailleInsteadOfTriangle = false;
                    basis.origin = new mathis.XYZ(-1, -1, 0);
                    basis.end = new mathis.XYZ(1, 1, 0);
                    basis.nbI = 4;
                    basis.nbJ = 4;
                    var creator = new mathis.reseau.Regular(basis);
                    mamesh = creator.go();
                }
                for (var i = 0; i < this.nbDicho; i++)
                    new mathis.mameshModification.TriangleDichotomer(mamesh).go();
                if (this.shape == 'sphere')
                    for (var _i = 0, _a = mamesh.vertices; _i < _a.length; _i++) {
                        var vertex = _a[_i];
                        vertex.position.normalize();
                    }
                var fractalModifier = new mathis.fractal.StableRandomFractal(mamesh);
                fractalModifier.referenceDistanceBetweenVertexWithZeroDichoLevel = 0.005;
                fractalModifier.alpha = this.alpha;
                fractalModifier.beta = this.beta;
                fractalModifier.deformationFromCenterVersusFromDirection = (this.shape == 'sphere');
                fractalModifier.go();
                if (this.shape == 'plan') {
                    var positioning = new mathis.Positioning();
                    positioning.upVector = new mathis.XYZ(0, 0, 1);
                    positioning.applyToVertices(mamesh.vertices);
                }
                var surfaceViewer = new mathis.visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene);
                surfaceViewer.alpha = 1;
                //surfaceViewer.normalDuplication=visu3d.NormalDuplication.none
                surfaceViewer.sideOrientation = BABYLON.Mesh.DOUBLESIDE;
                surfaceViewer.go();
                if (this.showLine) {
                    var lineViewer = new mathis.visu3d.LinesViewer(mamesh, this.mathisFrame.scene);
                    lineViewer.interpolationOption.interpolationStyle = mathis.geometry.InterpolationStyle.none;
                    lineViewer.isThin = true;
                    lineViewer.color = mathis.color.thema.defaultLinkColor;
                    lineViewer.go();
                }
            };
            return FractalOnIndex;
        }());
        appli.FractalOnIndex = FractalOnIndex;
        var PolyhedronOnIndex = (function () {
            function PolyhedronOnIndex(mathisFrame) {
                var _this = this;
                this.mathisFrame = mathisFrame;
                this.NAME = "PolyhedronOnIndex";
                this.chosenType = "dodecahedron";
                this.name = "platonic";
                this.$$$name = new appli.Choices(["platonic", "archimedean", "prisms", "antiprisms", "johnson"], { label: '' });
                this.platonicType = "dodecahedron";
                this.$$$platonicType = new appli.Choices(mathis.polyhedron.platonic);
                this.archimedeanType = "rhombicuboctahedron";
                this.$$$archimedeanType = new appli.Choices(mathis.polyhedron.archimedean);
                this.prismsType = "octagonal prism";
                this.$$$prismsType = new appli.Choices(mathis.polyhedron.prisms);
                this.antiprismsType = "pentagonal antiprism";
                this.$$$antiprismsType = new appli.Choices(mathis.polyhedron.antiprisms);
                this.johnsonType = "elongated triangular bipyramid";
                this.$$$johnsonType = new appli.Choices(mathis.polyhedron.johnson);
                this.$$$name.options.onchange = function () {
                    _this.showAndHide();
                };
                this.$$$platonicType.options.onchange = function () {
                    //if(this.platonicType!="") {
                    _this.chosenType = _this.platonicType;
                    _this.go();
                    //}
                };
                this.$$$archimedeanType.options.onchange = function () {
                    _this.chosenType = _this.archimedeanType;
                    _this.go();
                };
                this.$$$prismsType.options.onchange = function () {
                    _this.chosenType = _this.prismsType;
                    _this.go();
                };
                this.$$$antiprismsType.options.onchange = function () {
                    _this.chosenType = _this.antiprismsType;
                    _this.go();
                };
                this.$$$johnsonType.options.onchange = function () {
                    _this.chosenType = _this.johnsonType;
                    _this.go();
                };
            }
            PolyhedronOnIndex.prototype.showAndHide = function () {
                this.$$$platonicType.hide();
                this.$$$archimedeanType.hide();
                this.$$$johnsonType.hide();
                this.$$$prismsType.hide();
                this.$$$antiprismsType.hide();
                if (this.name == "platonic") {
                    this.$$$platonicType.show();
                }
                else if (this.name == "archimedean") {
                    this.$$$archimedeanType.show();
                }
                else if (this.name == "prisms") {
                    this.$$$prismsType.show();
                }
                else if (this.name == "antiprisms") {
                    this.$$$antiprismsType.show();
                }
                else if (this.name == "johnson") {
                    this.$$$johnsonType.show();
                }
            };
            PolyhedronOnIndex.prototype.goForTheFirstTime = function () {
                this.mathisFrame.clearScene();
                this.mathisFrame.addDefaultCamera();
                this.mathisFrame.addDefaultLight();
                this.mathisFrame.getGrabberCamera().changePosition(new mathis.XYZ(0, 0, -7));
                this.showAndHide();
                this.go();
            };
            PolyhedronOnIndex.prototype.go = function () {
                var _this = this;
                this.mathisFrame.clearScene(false, false);
                this.mathisFrame.clearScene(false, false);
                mathis.polyhedron.getPolyhedronAsync(this.chosenType, function (mamesh) {
                    var vertices = [];
                    for (var i = 0; i < mamesh.vertices.length; i++) {
                        var vertex = mamesh.vertices[i];
                        if (!vertex.hasMark(mathis.Vertex.Markers.polygonCenter))
                            vertices.push(vertex);
                    }
                    var verticesViewer = new mathis.visu3d.VerticesViewer(vertices, _this.mathisFrame.scene);
                    verticesViewer.go();
                    var linksViewer = new mathis.visu3d.LinksViewer(mamesh, _this.mathisFrame.scene);
                    linksViewer.segmentOrientationFunction = function (v0, v1) {
                        if (v0.hasMark(mathis.Vertex.Markers.polygonCenter) || v1.hasMark(mathis.Vertex.Markers.polygonCenter))
                            return 0;
                        return 1;
                    };
                    linksViewer.go();
                    var surfaceViewer = new mathis.visu3d.SurfaceViewer(mamesh, _this.mathisFrame.scene);
                    surfaceViewer.go();
                });
            };
            return PolyhedronOnIndex;
        }());
        appli.PolyhedronOnIndex = PolyhedronOnIndex;
        var SeveralDemo = (function () {
            function SeveralDemo(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.NAME = "SeveralDemo";
                this.demoChoice = 5; //Math.floor(Math.random()*6)
                this.$$$demoChoice = new appli.Choices([0, 1, 2, 3, 4, 5], { 'visualValues': ["infinite world", "ising model", '2d differential', 'alpha fractal', 'random graph', "polyhedrons"] });
            }
            SeveralDemo.prototype.goForTheFirstTime = function () {
                this.go();
            };
            SeveralDemo.prototype.go = function () {
                var pieceOfCode;
                if (this.demoChoice == 0)
                    pieceOfCode = new InfiniteWordOnIndex(this.mathisFrame);
                else if (this.demoChoice == 1)
                    pieceOfCode = new IsingOnIndex(this.mathisFrame);
                else if (this.demoChoice == 2)
                    pieceOfCode = new DifferentialOnIndex(this.mathisFrame);
                else if (this.demoChoice == 3)
                    pieceOfCode = new FractalOnIndex(this.mathisFrame);
                else if (this.demoChoice == 4)
                    pieceOfCode = new mathis.smallProject.RandomSpacialGraph(this.mathisFrame);
                else if (this.demoChoice == 5)
                    pieceOfCode = new PolyhedronOnIndex(this.mathisFrame);
                else
                    throw "boum";
                appli.indexPage.eventManager.fireEvent(new appli.Event('changeDemo', pieceOfCode.NAME));
                //let attributeChoices=buildChoicesFromPieceOfCode(pieceOfCode)
                //let $divForDemoSelect=$('#divForDemoSelects').empty()
                var binder = new appli.Binder(pieceOfCode, this.mathisFrame.subWindow_NW.$visual, this.mathisFrame);
                binder.pushState = false; //TODO
                binder.selectAndAroundClassName = "spanForDemoSelects";
                binder.go();
                pieceOfCode.goForTheFirstTime();
            };
            return SeveralDemo;
        }());
        appli.SeveralDemo = SeveralDemo;
        function startDemo(mathisFrame) {
            var pieceOfCode = new SeveralDemo(mathisFrame);
            //let attributeChoices=buildChoicesFromPieceOfCode(pieceOfCode)
            var binder = new appli.Binder(pieceOfCode, $('#demoChoice'), this.mathisFrame);
            binder.pushState = false;
            binder.go();
            pieceOfCode.goForTheFirstTime();
        }
        appli.startDemo = startDemo;
    })(appli = mathis.appli || (mathis.appli = {}));
})(mathis || (mathis = {}));
