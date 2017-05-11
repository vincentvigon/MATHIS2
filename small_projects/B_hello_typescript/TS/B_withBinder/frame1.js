/**
 * Created by vigon on 09/05/2017.
 */
var mathis;
(function (mathis) {
    var totoModule;
    (function (totoModule) {
        var VariableReseau = (function () {
            function VariableReseau(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.NAME = "VariableReseau";
                this.TITLE = "";
                this.nbI = 3;
                this.$$$nbI = [3, 5, 7];
                this.squareMaille = true;
                this.$$$squareMaille = [true, false];
                this.Vj = new mathis.XYZ(0, 0.2, 0);
                this.$$$Vj = [new mathis.XYZ(0, 0.2, 0), new mathis.XYZ(0.05, 0.2, 0)];
            }
            VariableReseau.prototype.goForTheFirstTime = function () {
                this.mathisFrame.clearScene();
                this.mathisFrame.addDefaultCamera();
                this.mathisFrame.addDefaultLight();
                this.go();
            };
            VariableReseau.prototype.go = function () {
                this.mathisFrame.clearScene(false, false);
                var creator = new mathis.reseau.Regular();
                creator.nbI = this.nbI;
                creator.nbJ = 4;
                creator.Vi = new mathis.XYZ(0.2, 0, 0);
                creator.Vj = this.Vj;
                creator.origine = new mathis.XYZ(-0.7, -0.7, 0);
                creator.squareVersusTriangleMaille = this.squareMaille;
                var mamesh = creator.go();
                new mathis.visu3d.VerticesViewer(mamesh, this.mathisFrame.scene).go();
                new mathis.visu3d.LinksViewer(mamesh, this.mathisFrame.scene).go();
                new mathis.visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene).go();
            };
            return VariableReseau;
        }());
        totoModule.VariableReseau = VariableReseau;
    })(totoModule = mathis.totoModule || (mathis.totoModule = {}));
})(mathis || (mathis = {}));
