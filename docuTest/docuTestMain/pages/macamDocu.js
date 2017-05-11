/**
 * Created by vigon on 28/12/2016.
 */
/**
 * Created by vigon on 05/12/2016.
 */
var mathis;
(function (mathis) {
    var appli;
    (function (appli) {
        var MacamDocu = (function () {
            function MacamDocu(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.pageIdAndTitle = "Camera";
                var several = new appli.SeveralParts();
                several.addComment($("<div>The default mathis-camera is called the GrabberCamera. For real 3d viewing of single object the ideal grabber is a sphere " +
                    "(it is the white sphere which appear then you grab with your mouse). With the first piece of code, observe that :  <br>" +
                    "- outside the grabber when you grab, the grabber seems to turn on itself ; but actually, it is the camera (so yourself) that turning around.  <br>" +
                    "- inside the grabber  your are in a 'free mode rotation'<br> " +
                    " - close to the surface of the grabber, the movement is an interpolation between the two previous movement ; which give the impression to roll on the grabber surface.<br> " +
                    "Observe also that, by default, when it go back, the camera recenter on the grabber center. All these behaviour can be parametrized (see further pieces of code) </div>"), "The default mathis-camera is called the GrabberCamera");
                several.addPart(new SphericalGrabberCameraDocu(this.mathisFrame));
                several.addPart(new PlanarGrabberCameraDocu(this.mathisFrame));
                several.addPart(new TwoGrabberCameraDocu(this.mathisFrame));
                this.severalParts = several;
            }
            MacamDocu.prototype.go = function () {
                return this.severalParts.go();
            };
            return MacamDocu;
        }());
        appli.MacamDocu = MacamDocu;
        var TwoGrabberCameraDocu = (function () {
            function TwoGrabberCameraDocu(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.NO_TEST = true;
                this.NAME = "TwoGrabberCameraDocu";
                this.TITLE = "Several grabbers. Usually used  for several for several meshes of interest. Here, two better show the process, we add only on mesh of" +
                    "interest in the middle of two grabbers that we never hide.";
                // cameraOptionChoice=0
                // $$$cameraOptionChoice=[0,1,2]
                this.toIncludeAtTheBeginOfTheFirstHiddenPiece = ["var mathisFrame=new MathisFrame(false) // false so no default light and camera"];
                this.useFreeModeWhenCursorOutOfGrabber = false;
                this.$$$useFreeModeWhenCursorOutOfGrabber = [true, false];
                this.useOnlyFreeMode = false;
                this.$$$useOnlyFreeMode = [true, false];
                this.mathisFrame = mathisFrame;
            }
            TwoGrabberCameraDocu.prototype.goForTheFirstTime = function () {
                this.go();
            };
            TwoGrabberCameraDocu.prototype.go = function () {
                this.mathisFrame.clearScene();
                //$$$begin
                this.mathisFrame.addDefaultLight();
                var grabber0 = new mathis.macamera.SphericalGrabber(this.mathisFrame.scene);
                grabber0.mesh.position = new mathis.XYZ(2, 0, 0);
                grabber0.referenceCenter = new mathis.XYZ(2, 0, 0);
                grabber0.material.diffuseColor = new BABYLON.Color3(1, 0, 0);
                grabber0.showGrabberOnlyWhenGrabbing = false;
                grabber0.focusOnMyCenterWhenCameraGoDownWard = false;
                //n
                var grabber1 = new mathis.macamera.SphericalGrabber(this.mathisFrame.scene);
                grabber1.mesh.position = new mathis.XYZ(-2, 0, 0);
                grabber1.referenceCenter = new mathis.XYZ(-2, 0, 0);
                grabber1.material.diffuseColor = new BABYLON.Color3(0, 1, 0);
                grabber1.showGrabberOnlyWhenGrabbing = false;
                grabber1.focusOnMyCenterWhenCameraGoDownWard = false;
                //n
                var grabberCamera = new mathis.macamera.GrabberCamera(this.mathisFrame, grabber0);
                grabberCamera.grabbers = [grabber0, grabber1];
                grabberCamera.useFreeModeWhenCursorOutOfGrabber = this.useFreeModeWhenCursorOutOfGrabber;
                grabberCamera.useOnlyFreeMode = this.useOnlyFreeMode;
                grabberCamera.attachControl(this.mathisFrame.canvas);
                grabberCamera.changePosition(new mathis.XYZ(0, 0, -10));
                //n
                var creator = new mathis.polyhedron.Polyhedron("cube");
                var mamesh = creator.go();
                new mathis.visu3d.LinksViewer(mamesh, this.mathisFrame.scene).go();
                //$$$end
            };
            return TwoGrabberCameraDocu;
        }());
        var SphericalGrabberCameraDocu = (function () {
            function SphericalGrabberCameraDocu(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.NO_TEST = true;
                this.NAME = "SphericalGrabberCameraDocu";
                this.TITLE = "Mathis camera with spherical grabber";
                this.cameraOptionChoice = 0;
                this.$$$cameraOptionChoice = [0, 1];
                this.toIncludeAtTheBeginOfTheFirstHiddenPiece = ["var mathisFrame=new MathisFrame(false) // false so no default light and camera"];
                this.useFreeModeWhenCursorOutOfGrabber = false;
                this.$$$useFreeModeWhenCursorOutOfGrabber = [true, false];
                this.useOnlyFreeMode = false;
                this.$$$useOnlyFreeMode = [true, false];
                this.mathisFrame = mathisFrame;
            }
            SphericalGrabberCameraDocu.prototype.goForTheFirstTime = function () {
                this.go();
            };
            SphericalGrabberCameraDocu.prototype.go = function () {
                this.mathisFrame.clearScene();
                //$$$begin
                this.mathisFrame.addDefaultLight();
                var grabberChoice = this.cameraOptionChoice;
                var grabber;
                if (grabberChoice == 0) {
                    /**default camera*/
                    grabber = new mathis.macamera.SphericalGrabber(this.mathisFrame.scene);
                }
                else if (grabberChoice == 1) {
                    /**We deform the grabber. */
                    grabber = new mathis.macamera.SphericalGrabber(this.mathisFrame.scene);
                    grabber.mesh.scaling.x = 1.5;
                    /**see later on to understand the usage of this radius*/
                    grabber.radius = 1.5;
                }
                var grabberCamera = new mathis.macamera.GrabberCamera(this.mathisFrame, grabber);
                grabberCamera.useFreeModeWhenCursorOutOfGrabber = this.useFreeModeWhenCursorOutOfGrabber;
                grabberCamera.useOnlyFreeMode = this.useOnlyFreeMode;
                grabberCamera.attachControl(this.mathisFrame.canvas);
                //n
                var creator = new mathis.polyhedron.Polyhedron("cube");
                var mamesh = creator.go();
                new mathis.visu3d.LinksViewer(mamesh, this.mathisFrame.scene).go();
                //$$$end
            };
            return SphericalGrabberCameraDocu;
        }());
        var PlanarGrabberCameraDocu = (function () {
            function PlanarGrabberCameraDocu(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.NO_TEST = true;
                this.NAME = "PlanarGrabberCameraDocu";
                this.TITLE = "Mathis camera with planar grabber";
                this.cameraOptionChoice = 0;
                this.$$$cameraOptionChoice = [0, 1];
                this.toIncludeAtTheBeginOfTheFirstHiddenPiece = ["var mathisFrame=new MathisFrame(false) // false so no default light and camera"];
                this.useFreeModeWhenCursorOutOfGrabber = false;
                this.$$$useFreeModeWhenCursorOutOfGrabber = [true, false];
                this.useOnlyFreeMode = false;
                this.$$$useOnlyFreeMode = [true, false];
                this.changeMaterial = true;
                this.$$$changeMaterial = [true, false];
                this.mathisFrame = mathisFrame;
            }
            PlanarGrabberCameraDocu.prototype.goForTheFirstTime = function () {
                this.go();
            };
            PlanarGrabberCameraDocu.prototype.go = function () {
                this.mathisFrame.clearScene();
                //$$$begin
                this.mathisFrame.addDefaultLight();
                var grabberChoice = this.cameraOptionChoice;
                var grabber = new mathis.macamera.PlanarGrabber(this.mathisFrame.scene);
                if (grabberChoice == 0) {
                    grabber.mesh.scaling.x = 2;
                }
                else if (grabberChoice == 1) {
                    /**we change the default mesh,keeping the default material*/
                    grabber.mesh.dispose();
                    grabber.mesh = BABYLON.Mesh.CreateDisc('', 1, 20, this.mathisFrame.scene);
                    grabber.mesh.material = grabber.material;
                }
                /**perhaps change some material properties*/
                if (this.changeMaterial) {
                    grabber.material.diffuseColor = new BABYLON.Color3(1, 0, 0);
                    grabber.material.alpha = 0.5;
                }
                var grabberCamera = new mathis.macamera.GrabberCamera(this.mathisFrame, grabber);
                grabberCamera.useFreeModeWhenCursorOutOfGrabber = this.useFreeModeWhenCursorOutOfGrabber;
                grabberCamera.useOnlyFreeMode = this.useOnlyFreeMode;
                grabberCamera.attachControl(this.mathisFrame.canvas);
                console.log(this.mathisFrame.scene.activeCamera);
                console.log(this.mathisFrame.scene.activeCameras);
                //n
                var creator = new mathis.polyhedron.Polyhedron("cube");
                var mamesh = creator.go();
                new mathis.visu3d.LinksViewer(mamesh, this.mathisFrame.scene).go();
                //$$$end
            };
            return PlanarGrabberCameraDocu;
        }());
        var SeveralGrabber = (function () {
            function SeveralGrabber(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.NO_TEST = true;
                this.NAME = "SeveralGrabber";
                this.TITLE = " ";
                this.mathisFrame = mathisFrame;
            }
            SeveralGrabber.prototype.goForTheFirstTime = function () {
                this.mathisFrame.clearScene();
                this.mathisFrame.addDefaultCamera();
                this.mathisFrame.addDefaultLight();
                this.go();
            };
            SeveralGrabber.prototype.go = function () {
                this.mathisFrame.clearScene(false, false);
                //$$$begin
                var creator = new mathis.polyhedron.Polyhedron("rhombicosidodecahedron");
                var mamesh = creator.go();
                //$$$end
            };
            return SeveralGrabber;
        }());
    })(appli = mathis.appli || (mathis.appli = {}));
})(mathis || (mathis = {}));
