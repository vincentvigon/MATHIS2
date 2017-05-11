/**
 * Created by vigon on 08/11/2016.
 */
var mathis;
(function (mathis) {
    var mecaStat;
    (function (mecaStat) {
        var IsingOnMesh = (function () {
            function IsingOnMesh(mathisFrame) {
                this.q = 1.1;
                this.beta = 0.5;
                this.sphereRadius = 1;
                this.frameInterval = 5;
                this.nbActionsPerIteration = 100;
                this.defineLightAndCamera = true;
                this.nbDicho = 4;
                this.mathisFrame = mathisFrame;
            }
            IsingOnMesh.prototype.go = function () {
                if (this.defineLightAndCamera)
                    this.lightAndCam();
                this.meshAndIsing();
            };
            IsingOnMesh.prototype.lightAndCam = function () {
                var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(-1, 1, -1), this.mathisFrame.scene);
                light0.diffuse = new BABYLON.Color3(1, 1, 1);
                light0.specular = new BABYLON.Color3(1, 1, 1);
                light0.groundColor = new BABYLON.Color3(0.5, 0.5, 0.5);
                var center = new mathis.XYZ(0, 0, 0);
                //BABYLON.Mesh.CreateSphere('',20,2,scene)
                var grabber = new mathis.macamera.SphericalGrabber(this.mathisFrame.scene, new mathis.XYZ(this.sphereRadius, this.sphereRadius, this.sphereRadius), center);
                grabber.mesh.material.alpha = 0.6;
                grabber.showGrabberOnlyWhenGrabbing = false;
                grabber.endOfZone1 = 0;
                grabber.endOfZone2 = 0;
                var macam = new mathis.macamera.GrabberCamera(this.mathisFrame, grabber);
                macam.useFreeModeWhenCursorOutOfGrabber = false;
                macam.changePosition(new mathis.XYZ(0, 0, -4 * this.sphereRadius), false);
                //macam.camera.viewport=new BABYLON.Viewport(index/nbCam,0,1/nbCam,1)
                macam.attachControl(this.mathisFrame.canvas);
                //mathisFrame.scene.activeCameras.push(macam.camera)
            };
            IsingOnMesh.prototype.meshAndIsing = function () {
                var _this = this;
                var sphereMaker = new mathis.polyhedron.Polyhedron("dodecahedron");
                var mamesh = sphereMaker.go();
                for (var i = 0; i < this.nbDicho; i++) {
                    var dicho = new mathis.mameshModification.TriangleDichotomer(mamesh);
                    dicho.makeLinks = true;
                    dicho.go();
                }
                mamesh.vertices.forEach(function (v) {
                    v.position.normalize().scale(_this.sphereRadius);
                });
                var ising = new mathis.metropolis.IsingModel(mamesh.vertices);
                ising.beta = this.beta;
                ising.q = this.q;
                ising.nbActionsPerIteration = this.nbActionsPerIteration;
                ising.go();
                var model1 = this.sphereModel(new BABYLON.Color3(1, 0, 0));
                var model2 = this.sphereModel(new BABYLON.Color3(0, 0, 1));
                var positionner = new mathis.mameshAroundComputations.PositioningComputerForMameshVertices(mamesh);
                positionner.sizesProp = new mathis.XYZ(1, 1, 1);
                var positioning = positionner.go();
                var positioning1 = new mathis.HashMap();
                mamesh.vertices.forEach(function (v) {
                    var po = new mathis.Positioning();
                    po.copyFrom(positioning.getValue(v));
                    po.scaling.copyFromFloats(0, 0, 0);
                    positioning1.putValue(v, po);
                });
                var positioning2 = new mathis.HashMap();
                mamesh.vertices.forEach(function (v) {
                    var po = new mathis.Positioning();
                    po.copyFrom(positioning.getValue(v));
                    po.scaling.copyFromFloats(0, 0, 0);
                    positioning2.putValue(v, po);
                });
                var vertVisu1 = new mathis.visu3d.VerticesViewer(mamesh, this.mathisFrame.scene);
                vertVisu1.positionings = positioning1;
                vertVisu1.meshModel = model1;
                vertVisu1.go();
                var vertVisu2 = new mathis.visu3d.VerticesViewer(mamesh, this.mathisFrame.scene);
                vertVisu2.positionings = positioning2;
                vertVisu2.meshModel = model2;
                vertVisu2.go();
                var commonSizes = positioning.getValue(mamesh.vertices[0]).scaling;
                var action = new mathis.PeriodicAction(function () {
                    var changed = ising.iterateAndGetChangedVertices();
                    changed.allKeys().forEach(function (v) {
                        if (v.customerObject.value == 0) {
                            positioning1.getValue(v).scaling.copyFromFloats(0, 0, 0); //.getValue(v).scaling.copyFrom(0,0,0)
                            positioning2.getValue(v).scaling.copyFromFloats(0, 0, 0);
                        }
                        else if (v.customerObject.value == 1) {
                            positioning1.getValue(v).scaling.copyFrom(commonSizes);
                            positioning2.getValue(v).scaling.copyFromFloats(0, 0, 0);
                        }
                        else if (v.customerObject.value == -1) {
                            positioning2.getValue(v).scaling.copyFrom(commonSizes);
                            positioning1.getValue(v).scaling.copyFromFloats(0, 0, 0);
                        }
                    });
                    vertVisu1.updatePositionings();
                    vertVisu2.updatePositionings();
                });
                action.frameInterval = this.frameInterval;
                this.mathisFrame.pushPeriodicAction(action);
            };
            IsingOnMesh.prototype.sphereModel = function (color) {
                var model = BABYLON.Mesh.CreateSphere('', 6, 1, this.mathisFrame.scene);
                var mat1 = new BABYLON.StandardMaterial('', this.mathisFrame.scene);
                mat1.diffuseColor = color;
                model.material = mat1;
                var qua = new mathis.XYZW(0, 0, 0, 0);
                mathis.geo.axisAngleToQuaternion(new mathis.XYZ(1, 0, 0), Math.PI / 2, qua);
                model.rotationQuaternion = qua;
                return model;
            };
            return IsingOnMesh;
        }());
        mecaStat.IsingOnMesh = IsingOnMesh;
    })(mecaStat = mathis.mecaStat || (mathis.mecaStat = {}));
})(mathis || (mathis = {}));
