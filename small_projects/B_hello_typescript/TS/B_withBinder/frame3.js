/**
 * Created by vigon on 10/05/2017.
 */
var mathis;
(function (mathis) {
    var totoModule;
    (function (totoModule) {
        var TorusWithTurningLine = (function () {
            function TorusWithTurningLine(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.NAME = "TorusPartLines";
                this.TITLE = "";
                this.nbVerticalDecays = 2;
                this.$$$nbVerticalDecays = [0, 1, 2, 3, 4];
                this.nbHorizontalDecays = 1;
                this.$$$nbHorizontalDecays = [0, 1, 2, 3, 4];
                this.nbI = 5;
                this.$$$nbI = new mathis.appli.Choices([4, 5, 6, 7, 8], { containerName: 'NW' });
                this.nbJ = 20;
                this.$$$nbJ = new mathis.appli.Choices([15, 16, 20, 30], { containerName: 'NW' });
                this.interpolationStyle = mathis.geometry.InterpolationStyle.hermite;
                this.$$$interpolationStyle = new mathis.appli.Choices([mathis.geometry.InterpolationStyle.none, mathis.geometry.InterpolationStyle.octavioStyle, mathis.geometry.InterpolationStyle.hermite], { visualValues: ['none', 'octavioStyle', 'hermite'],
                    containerName: 'S' });
            }
            TorusWithTurningLine.prototype.goForTheFirstTime = function () {
                this.go();
            };
            TorusWithTurningLine.prototype.go = function () {
                this.mathisFrame.clearScene(false, false);
                //$$$begin
                var generator = new mathis.reseau.BasisForRegularReseau();
                generator.nbI = this.nbI;
                generator.nbJ = this.nbJ;
                generator.origin = new mathis.XYZ(0, 0, 0);
                generator.end = new mathis.XYZ(2 * Math.PI, 2 * Math.PI, 0).scale(0.1);
                generator.nbVerticalDecays = this.nbVerticalDecays;
                generator.nbHorizontalDecays = this.nbHorizontalDecays;
                var creator = new mathis.reseau.Regular(generator);
                var mamesh = creator.go();
                //n
                var r = 0.3;
                var a = 0.75;
                mamesh.vertices.forEach(function (vertex) {
                    var u = vertex.position.x * 10;
                    var v = vertex.position.y * 10;
                    vertex.position.x = (r * Math.cos(u) + a) * Math.cos((v));
                    vertex.position.y = (r * Math.cos(u) + a) * Math.sin((v));
                    vertex.position.z = r * Math.sin(u);
                });
                var merger = new mathis.grateAndGlue.Merger(mamesh, null, null);
                merger.mergeLink = true;
                merger.goChanging();
                var oppositeAssocier = new mathis.linkModule.OppositeLinkAssocierByAngles(mamesh.vertices);
                oppositeAssocier.maxAngleToAssociateLinks = Math.PI;
                oppositeAssocier.goChanging();
                var lineViewer = new mathis.visu3d.LinesViewer(mamesh, this.mathisFrame.scene);
                lineViewer.interpolationOption.interpolationStyle = this.interpolationStyle;
                lineViewer.go();
            };
            return TorusWithTurningLine;
        }());
        totoModule.TorusWithTurningLine = TorusWithTurningLine;
    })(totoModule = mathis.totoModule || (mathis.totoModule = {}));
})(mathis || (mathis = {}));
