/**
 * Created by vigon on 09/05/2017.
 */
var mathis;
(function (mathis) {
    var totoModule;
    (function (totoModule) {
        function start_A_simple() {
            var mathisFrame1 = new mathis.MathisFrame('mathisFrame1');
            var mamesh1 = new mathis.polyhedron.Polyhedron("truncated dodecahedron").go();
            new mathis.visu3d.SurfaceViewer(mamesh1, mathisFrame1.scene).go();
            new mathis.visu3d.LinksViewer(mamesh1, mathisFrame1.scene).go();
            var mathisFrame2 = new mathis.MathisFrame('mathisFrame2');
            var mamesh2 = new mathis.polyhedron.Polyhedron("cube").go();
            new mathis.visu3d.SurfaceViewer(mamesh2, mathisFrame2.scene).go();
            new mathis.visu3d.VerticesViewer(mamesh2, mathisFrame2.scene).go();
        }
        totoModule.start_A_simple = start_A_simple;
    })(totoModule = mathis.totoModule || (mathis.totoModule = {}));
})(mathis || (mathis = {}));
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
/**
 * Created by vigon on 09/05/2017.
 */
var mathis;
(function (mathis) {
    var totoModule;
    (function (totoModule) {
        var CurvedSurface = (function () {
            function CurvedSurface(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.NAME = "CurvedSurface";
                this.TITLE = "";
                this.alpha = 0.5;
                this.$$$alpha = [0.1, 0.3, 0.5, 0.8, 1];
                this.color = mathis.Color.names.rebeccapurple;
                this.$$$color = new mathis.appli.Choices([mathis.Color.names.rebeccapurple, mathis.Color.names.rosybrown, mathis.Color.names.darkorange], { label: 'color: ', visualValues: ['rebeccapurple', 'rosybrown', 'darkorange'] });
                this.sideOrientation = BABYLON.Mesh.FRONTSIDE;
                this.$$$sideOrientation = new mathis.appli.Choices([BABYLON.Mesh.DOUBLESIDE, BABYLON.Mesh.BACKSIDE, BABYLON.Mesh.FRONTSIDE], { label: '', visualValues: ['DOUBLESIDE', 'BACKSIDE', 'FRONTSIDE'] });
            }
            CurvedSurface.prototype.goForTheFirstTime = function () {
                this.mathisFrame.getGrabberCamera().changePosition(new mathis.XYZ(0, 0, -6));
                this.go();
            };
            CurvedSurface.prototype.go = function () {
                this.mathisFrame.clearScene(false, false);
                var creator = new mathis.reseau.TriangulatedPolygone(10);
                creator.nbSubdivisionInARadius = 5;
                creator.origin = new mathis.XYZ(-Math.PI * 0.8, -1, 0);
                creator.end = new mathis.XYZ(+Math.PI * 0.8, 1, 0);
                var mamesh = creator.go();
                for (var _i = 0, _a = mamesh.vertices; _i < _a.length; _i++) {
                    var vertex = _a[_i];
                    var u = vertex.position.x;
                    var v = vertex.position.y;
                    vertex.position.x = Math.cos(u);
                    vertex.position.y = Math.sin(u);
                    vertex.position.z = v;
                }
                var positioning = new mathis.Positioning();
                positioning.frontDir.copyFromFloats(1, 0, 1);
                positioning.applyToVertices(mamesh.vertices);
                new mathis.visu3d.LinksViewer(mamesh, this.mathisFrame.scene).go();
                var surfaceViewer = new mathis.visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene);
                surfaceViewer.alpha = this.alpha;
                surfaceViewer.color = new mathis.Color(this.color);
                surfaceViewer.sideOrientation = this.sideOrientation;
                surfaceViewer.go();
            };
            return CurvedSurface;
        }());
        totoModule.CurvedSurface = CurvedSurface;
    })(totoModule = mathis.totoModule || (mathis.totoModule = {}));
})(mathis || (mathis = {}));
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
/**
 * Created by vigon on 09/05/2017.
 */
var mathis;
(function (mathis) {
    var totoModule;
    (function (totoModule) {
        function start_B_withBinder() {
            {
                var mathisFrame = new mathis.MathisFrame("mathisFrame1");
                var aPieceOfCode = new totoModule.VariableReseau(mathisFrame);
                var binder = new mathis.appli.Binder(aPieceOfCode, null, mathisFrame);
                binder.go();
                aPieceOfCode.goForTheFirstTime();
            }
            {
                var mathisFrame = new mathis.MathisFrame("mathisFrame2");
                var aPieceOfCode = new totoModule.CurvedSurface(mathisFrame);
                var binder = new mathis.appli.Binder(aPieceOfCode, null, mathisFrame);
                binder.go();
                aPieceOfCode.goForTheFirstTime();
            }
            {
                var mathisFrame = new mathis.MathisFrame("mathisFrame3");
                var aPieceOfCode = new totoModule.TorusWithTurningLine(mathisFrame);
                var binder = new mathis.appli.Binder(aPieceOfCode, $('#frame3Commands'), mathisFrame);
                binder.go();
                aPieceOfCode.goForTheFirstTime();
            }
        }
        totoModule.start_B_withBinder = start_B_withBinder;
    })(totoModule = mathis.totoModule || (mathis.totoModule = {}));
})(mathis || (mathis = {}));
//# sourceMappingURL=smallProject.js.map