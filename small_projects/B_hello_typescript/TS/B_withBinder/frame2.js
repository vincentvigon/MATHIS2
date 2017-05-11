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
