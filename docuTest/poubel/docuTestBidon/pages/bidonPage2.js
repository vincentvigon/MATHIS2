/**
 * Created by Utilisateur on 09/03/2017.
 */
var mathis;
(function (mathis) {
    var appli;
    (function (appli) {
        var BidonPage2 = (function () {
            function BidonPage2(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.pageIdAndTitle = "BidonPage2";
                var several = new appli.SeveralParts();
                several.addPart(new BidonPartC(this.mathisFrame));
                this.severalParts = several;
            }
            BidonPage2.prototype.go = function () {
                return this.severalParts.go();
            };
            return BidonPage2;
        }());
        appli.BidonPage2 = BidonPage2;
        var BidonPartC = (function () {
            function BidonPartC(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.NAME = "BidonPartCbis";
                this.TITLE = "BidonPartC";
                this.configC1 = 5;
                this.$$$configC1 = [5, 6, 7];
                this.configC2 = 5;
                this.$$$configC2 = [5, 6, 7];
                this._savedC1 = 5;
                this._savedC2 = 7;
                this._savedC3 = 12;
                this.mathisFrame = mathisFrame;
            }
            BidonPartC.prototype.goForTheFirstTime = function () {
                this.mathisFrame.clearScene();
                this.mathisFrame.addDefaultCamera();
                this.mathisFrame.addDefaultLight();
                var camera = this.mathisFrame.getGrabberCamera();
                this.go();
            };
            BidonPartC.prototype.go = function () {
                //$$$begin
                var configC1 = this.configC1;
                //$$$end
            };
            return BidonPartC;
        }());
    })(appli = mathis.appli || (mathis.appli = {}));
})(mathis || (mathis = {}));
