/**
 * Created by vigon on 22/12/2016.
 */
/**
 * Created by vigon on 21/11/2016.
 */
var mathis;
(function (mathis) {
    var appli;
    (function (appli) {
        var SurfaceDocu = (function () {
            function SurfaceDocu(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.pageIdAndTitle = "Surfaces from reseaux";
                var severalParts = new appli.SeveralParts();
                severalParts.addPart(new HelicoidDocu(this.mathisFrame));
                severalParts.addPart(new DeformedReseau(this.mathisFrame));
                this.severalParts = severalParts;
            }
            SurfaceDocu.prototype.go = function () {
                return this.severalParts.go();
            };
            return SurfaceDocu;
        }());
        appli.SurfaceDocu = SurfaceDocu;
        var DeformedReseau = (function () {
            // func=(v)=>new XYZ(v.x,v.x*v.y,v.y)
            // $$$func=new Choices([
            //     (v)=>new XYZ(v.x,v.x*v.y,v.y),
            //     (v)=>new XYZ(v.x,0.5*Math.sin(5*v.x),v.y)
            // ])
            function DeformedReseau(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.NO_TEST = true;
                this.NAME = "DeformedReseau";
                this.TITLE = "Pushing up a reseau to make a surface";
                this.linesVersusLinks = true;
                this.$$$linesVersusLinks = [true, false];
                this.functionChoice = 0;
                this.$$$functionChoice = [0, 1, 2];
                this._toto = 3;
            }
            DeformedReseau.prototype.goForTheFirstTime = function () {
                this.mathisFrame.clearScene();
                this.mathisFrame.addDefaultCamera();
                this.mathisFrame.addDefaultLight();
                this.go();
            };
            DeformedReseau.prototype.go = function () {
                this.mathisFrame.clearScene(false, false);
                //$$$begin
                var creator = new mathis.reseau.TriangulatedPolygone(10);
                creator.nbSubdivisionInARadius = 5;
                creator.origin = new mathis.XYZ(-1, -1, 0);
                creator.end = new mathis.XYZ(1, 1, 0);
                var mamesh = creator.go();
                var functionChoice = this.functionChoice;
                if (functionChoice == 0)
                    var func = function (vec) { return new mathis.XYZ(vec.x, vec.x * vec.y, vec.y); };
                else if (functionChoice == 1)
                    var func = function (vec) { return new mathis.XYZ(vec.x, 0.5 * Math.sin(5 * vec.x), vec.y); };
                else if (functionChoice == 2)
                    var func = function (vec) { return new mathis.XYZ(Math.cos(vec.x) - 1, 0.5 * Math.sin(5 * vec.x), vec.y); };
                for (var i = 0; i < mamesh.vertices.length; i++) {
                    var vertex = mamesh.vertices[i];
                    vertex.position = func(vertex.position);
                }
                var lineVersusLinks = this.linesVersusLinks;
                if (lineVersusLinks) {
                    /**coloring can be improve (e.g. using symmetries, and better hue variations. see further)*/
                    new mathis.visu3d.LinesViewer(mamesh, this.mathisFrame.scene).go();
                }
                else {
                    new mathis.visu3d.LinksViewer(mamesh, this.mathisFrame.scene).go();
                }
                new mathis.visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene).go();
                //$$$end
            };
            return DeformedReseau;
        }());
        var HelicoidDocu = (function () {
            function HelicoidDocu(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.NO_TEST = true;
                this.NAME = "HelicoidDocu";
                this.TITLE = "We create an hellicoid. Best representation can de done with more vertices, but in this case, " +
                    "to be esthetic, do not draw all the lines (see section in line visualization for line selection)";
                this.a = 0.2;
                this.$$$a = [0.1, 0.2, 1];
                this.nbI = 10;
                this.$$$nbI = [5, 10, 20];
                this.nbJ = 20;
                this.$$$nbJ = [10, 20, 40];
            }
            HelicoidDocu.prototype.goForTheFirstTime = function () {
                this.mathisFrame.clearScene();
                this.mathisFrame.addDefaultCamera();
                this.mathisFrame.addDefaultLight();
                this.go();
            };
            HelicoidDocu.prototype.go = function () {
                this.mathisFrame.clearScene(false, false);
                //$$$begin
                var basis = new mathis.reseau.BasisForRegularReseau();
                basis.nbI = this.nbI;
                basis.nbJ = this.nbJ;
                basis.origin = new mathis.XYZ(-Math.PI, -1, 0);
                basis.end = new mathis.XYZ(Math.PI, 1, 0);
                var creator = new mathis.reseau.Regular(basis);
                var mamesh = creator.go();
                var a = this.a;
                for (var i = 0; i < mamesh.vertices.length; i++) {
                    var vertex = mamesh.vertices[i];
                    var u = vertex.position.x;
                    var v = vertex.position.y;
                    vertex.position.x = v * Math.cos(u);
                    vertex.position.y = a * u;
                    vertex.position.z = v * Math.sin(u);
                }
                new mathis.visu3d.LinesViewer(mamesh, this.mathisFrame.scene).go();
                new mathis.visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene).go();
                //$$$end
            };
            return HelicoidDocu;
        }());
    })(appli = mathis.appli || (mathis.appli = {}));
})(mathis || (mathis = {}));
