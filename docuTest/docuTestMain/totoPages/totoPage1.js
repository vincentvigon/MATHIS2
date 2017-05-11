/**
 * Created by vigon on 02/04/2017.
 */
var mathis;
(function (mathis) {
    var appli;
    (function (appli) {
        var TotoPage1 = (function () {
            function TotoPage1(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.pageIdAndTitle = "The first page made by Toto ";
                var several = new appli.SeveralParts();
                several.addPart(new TotoTryReseau(this.mathisFrame));
                this.severalParts = several;
            }
            TotoPage1.prototype.go = function () {
                return this.severalParts.go();
            };
            return TotoPage1;
        }());
        appli.TotoPage1 = TotoPage1;
        var TotoTryReseau = (function () {
            function TotoTryReseau(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.NAME = "TotoTryReseau";
                this.TITLE = "In this first part, we try to make a simple reseau";
                this.nbI = 3;
                this.$$$nbI = [3, 5, 7];
                this.squareMaille = true;
                this.$$$squareMaille = [true, false];
            }
            /**This method is fired when we enter  in this piece of code (eg. when play button is pushed)*/
            TotoTryReseau.prototype.goForTheFirstTime = function () {
                this.mathisFrame.clearScene();
                this.mathisFrame.addDefaultCamera();
                this.mathisFrame.addDefaultLight();
                this.go();
            };
            /**This method is fired each time one of the configuration parameters change */
            TotoTryReseau.prototype.go = function () {
                this.mathisFrame.clearScene(false, false);
                //$$$begin
                var creator = new mathis.reseau.Regular();
                creator.nbI = this.nbI;
                creator.nbJ = 4;
                creator.Vi = new mathis.XYZ(0.2, 0, 0);
                creator.Vj = new mathis.XYZ(0, 0.2, 0);
                creator.origine = new mathis.XYZ(-0.7, -0.7, 0);
                //n
                creator.squareVersusTriangleMaille = this.squareMaille;
                //n
                var mamesh = creator.go();
                //$$$end
                //$$$bh visualization
                new mathis.visu3d.VerticesViewer(mamesh, this.mathisFrame.scene).go();
                new mathis.visu3d.LinksViewer(mamesh, this.mathisFrame.scene).go();
                new mathis.visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene).go();
                //$$$eh
                //$$$bt
                this._nbVertices = mamesh.vertices.length;
                //$$$et
            };
            return TotoTryReseau;
        }());
    })(appli = mathis.appli || (mathis.appli = {}));
})(mathis || (mathis = {}));
