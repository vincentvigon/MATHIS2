/**
 * Created by vigon on 08/11/2016.
 */
var mathis;
(function (mathis) {
    var differentialSystem;
    (function (differentialSystem) {
        var TwoDim = (function () {
            function TwoDim(vectorField, mathisFrame) {
                this.originMath = new mathis.XYZ(0, 0, 0);
                this.endMath = new mathis.XYZ(1, 1, 0);
                this.originView = new mathis.XYZ(-1, -1, 0);
                this.endView = new mathis.XYZ(1, 1, 0);
                this.nbI = 20;
                this.nbJ = 20;
                this.departure = new mathis.XYZ(0, 0, 0);
                this.deltaT = 0.1;
                this.vectorsAreArrowsVersusCone = true;
                this.scaleVectorsAccordingToTheirNorm = false;
                this.makeLightAndCamera = true;
                this.generator = new mathis.reseau.BasisForRegularReseau();
                this.stochasticVariation = new mathis.XYZ(0, 0, 0);
                this.dW = new mathis.XYZ(0, 0, 0);
                this.scaler = null;
                this.functionToSortvertex = function (v1, v2) { return v1.customerObject.squareLengthOfTangent - v2.customerObject.squareLengthOfTangent; };
                this.vectorField = vectorField;
                this.mathisFrame = mathisFrame;
            }
            TwoDim.prototype.go = function () {
                if (this.randomExitation == null)
                    this.randomExitation = function () { return new mathis.XYZ(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5); };
                this.generator.nbI = this.nbI;
                this.generator.nbJ = this.nbJ;
                this.generator.origin = this.originView;
                this.generator.end = this.endView;
                this.makePlanForClick();
                if (this.makeLightAndCamera)
                    this.lightAndCamera();
                this.arrowModel = this.createArrowModel();
                this.scaler = mathis.geo.affineTransformGenerator(this.originView, this.endView, this.originMath, this.endMath);
                /**can be fired at any moment when we want to change vector fields*/
                this.loadVectorFields();
                this.mameshAndPositioning();
                if (this.scaleVectorsAccordingToTheirNorm)
                    this.prepareRescaling();
                this.start();
            };
            // restartWithNewVectorField(vectorField:(t:number, p:XYZ,res:XYZ)=>void){
            //     this.vectorField=vectorField
            //     this.mameshAndPositioning()
            //     this.start()
            // }
            TwoDim.prototype.makePlanForClick = function () {
                this.planForClick = BABYLON.Mesh.CreatePlane('', 1, this.mathisFrame.scene);
                var amplitude = mathis.XYZ.newFrom(this.generator.end).substract(this.generator.origin);
                var middle = mathis.XYZ.newFrom(this.generator.origin).add(this.generator.end).scale(0.5);
                this.planForClick.scaling = new mathis.XYZ(amplitude.x, amplitude.y, 0);
                /**doit être derriere le grabber, sinon il masque ce dernier
                 * doit être devant les fléches*/
                this.planForClick.position = new mathis.XYZ(middle.x, middle.y, 0.06);
                this.planForClick.bakeCurrentTransformIntoVertices();
                this.planForClick.visibility = 0;
            };
            TwoDim.prototype.lightAndCamera = function () {
                var amplitude = mathis.XYZ.newFrom(this.generator.end).substract(this.generator.origin);
                var grabber = new mathis.macamera.PlanarGrabber(this.mathisFrame.scene, new mathis.XYZ(amplitude.x, amplitude.y, 0.061));
                grabber.mesh.visibility = 0;
                var macam = new mathis.macamera.GrabberCamera(this.mathisFrame, grabber);
                macam.checkCollisions = false;
                macam.useFreeModeWhenCursorOutOfGrabber = false;
                macam.changePosition(new mathis.XYZ(0, 0, -2), false);
                macam.attachControl(this.mathisFrame.canvas);
                //let bacam=new BABYLON.FreeCamera("",new BABYLON.Vector3(0,0,-2),this.mathisFrame.scene)
                //bacam.attachControl(this.mathisFrame.canvas)
                var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(-1, 1, -1), this.mathisFrame.scene);
                light0.diffuse = new BABYLON.Color3(0.5, 0.5, 0.5);
                light0.specular = new BABYLON.Color3(0.7, 0.7, 0.7);
                light0.groundColor = new BABYLON.Color3(1, 1, 1);
            };
            TwoDim.prototype.computeNewPathPoint = function (previousPoint, t, res) {
                this.vectorFieldScaled(t, previousPoint, res);
                res.scale(this.deltaT);
                if (this.vectorFieldForNoiseScaled != null) {
                    this.vectorFieldForNoiseScaled(t, previousPoint, this.stochasticVariation);
                    //this.dW.copyFromFloats(gaussian.goChanging(),gaussian.goChanging(),gaussian.goChanging())
                    this.stochasticVariation.multiply(this.randomExitation()).scale(Math.sqrt(this.deltaT));
                    res.add(this.stochasticVariation);
                }
                res.add(previousPoint);
            };
            TwoDim.prototype.mameshAndPositioning = function () {
                var regCrea = new mathis.reseau.Regular(this.generator);
                regCrea.squareVersusTriangleMaille = false;
                this.mamesh = regCrea.go();
                var posiComp = new mathis.mameshAroundComputations.PositioningComputerForMameshVertices(this.mamesh);
                /**tangents are given by the vector field*/
                posiComp.computeTangent = false;
                posiComp.sizesProp = new mathis.XYZ(0.15, 0.15, 0.15);
                this.positionings = posiComp.go();
                this.vectorReferencesize = this.positionings.getValue(this.mamesh.vertices[0]).scaling.x;
            };
            TwoDim.prototype.createArrowModel = function () {
                var arrowModel;
                var qua = new mathis.XYZW(0, 0, 0, 0);
                mathis.geo.axisAngleToQuaternion(new mathis.XYZ(0, 0, 1), -Math.PI / 2, qua);
                if (this.vectorsAreArrowsVersusCone) {
                    var arrowCreator = new mathis.creation3D.ArrowCreator(this.mathisFrame.scene);
                    arrowCreator.quaternion = qua;
                    arrowCreator.arrowFootAtOrigin = false;
                    arrowCreator.totalHeight = 3;
                    arrowCreator.bodyDiameterProp = 0.2;
                    arrowCreator.headDiameterProp = 0.4;
                    arrowModel = arrowCreator.go();
                }
                else {
                    arrowModel = BABYLON.Mesh.CreateCylinder('', 2, 0, 1, 6, null, this.mathisFrame.scene);
                    arrowModel.rotationQuaternion = qua;
                    arrowModel.bakeCurrentTransformIntoVertices();
                }
                var mat = new BABYLON.StandardMaterial('', this.mathisFrame.scene);
                mat.diffuseColor = new BABYLON.Color3(0, 0, 1);
                arrowModel.material = mat;
                return arrowModel;
            };
            TwoDim.prototype.loadVectorFields = function () {
                var _this = this;
                var pScaled = new mathis.XYZ(0, 0, 0);
                /**  p is a point of the view rectangle, we have to scale it into the math rectangle before the find the corresponding vector */
                this.vectorFieldScaled = function (t, p, res) {
                    _this.scaler(p, pScaled);
                    _this.vectorField(t, pScaled, res);
                };
                if (this.vectorFieldForNoise != null) {
                    var p2Scaled_1 = new mathis.XYZ(0, 0, 0);
                    this.vectorFieldForNoiseScaled = function (t, p, res) {
                        _this.scaler(p, p2Scaled_1);
                        _this.vectorFieldForNoise(t, p2Scaled_1, res);
                    };
                }
            };
            TwoDim.prototype.start = function () {
                var _this = this;
                var snake = new mathis.creation3D.Snake(this.mathisFrame);
                snake.initialPosition = this.departure;
                snake.serpentRadius = 0.01;
                snake.go();
                /**field init*/
                this.mamesh.vertices.forEach(function (v) {
                    _this.vectorFieldScaled(0, v.position, _this.positionings.getValue(v).frontDir);
                });
                var vertexVisu = new mathis.visu3d.VerticesViewer(this.mamesh, this.mathisFrame.scene, this.positionings);
                vertexVisu.meshModel = this.arrowModel;
                vertexVisu.go();
                var curentTime = 0;
                var mainAction = new mathis.PeriodicAction(function () {
                    curentTime += _this.deltaT;
                    var point = new mathis.XYZ(0, 0, 0);
                    _this.computeNewPathPoint(snake.getHeadPosition(), curentTime, point);
                    snake.elongateTo(point);
                    _this.mamesh.vertices.forEach(function (v) {
                        var pos = _this.positionings.getValue(v);
                        _this.vectorFieldScaled(curentTime, v.position, pos.frontDir);
                    });
                    if (_this.scaleVectorsAccordingToTheirNorm)
                        _this.rescaleVectors(_this.vectorReferencesize);
                    vertexVisu.updatePositionings();
                });
                mainAction.id = "main action";
                mainAction.frameInterval = 1;
                this.mathisFrame.pushPeriodicAction(mainAction);
                /**onClick, we restart the snake*/
                this.planForClick.onClick = function (dep) {
                    var action = new mathis.PeriodicAction(function () {
                        snake.contractInOnePoint(dep);
                    });
                    action.frameInterval = 1;
                    action.nbTimesThisActionMustBeFired = 1;
                    action.id = "click action";
                    action.passageOrderIndex = 2;
                    _this.mathisFrame.pushPeriodicAction(action);
                };
            };
            TwoDim.prototype.prepareRescaling = function () {
                var _this = this;
                this.verticeSorted = [];
                this.mamesh.vertices.forEach(function (v) { return _this.verticeSorted.push(v); });
            };
            TwoDim.prototype.rescaleVectors = function (vertexRefSize) {
                var _this = this;
                this.mamesh.vertices.forEach(function (v) {
                    v.customerObject.squareLengthOfTangent = _this.positionings.getValue(v).frontDir.lengthSquared();
                });
                this.verticeSorted.sort(this.functionToSortvertex);
                for (var i = 0; i < this.verticeSorted.length; i++)
                    this.verticeSorted[i].customerObject.scaleFromOrder = (i / this.verticeSorted.length);
                this.mamesh.vertices.forEach(function (v) {
                    var pos = _this.positionings.getValue(v);
                    pos.scaling.x = 2 * vertexRefSize * (v.customerObject.scaleFromOrder + 1 / 4);
                    var epaisseur = vertexRefSize * Math.max(1, v.customerObject.scaleFromOrder + 1 / 2);
                    pos.scaling.y = epaisseur;
                    pos.scaling.z = epaisseur;
                });
            };
            return TwoDim;
        }());
        differentialSystem.TwoDim = TwoDim;
    })(differentialSystem = mathis.differentialSystem || (mathis.differentialSystem = {}));
})(mathis || (mathis = {}));
