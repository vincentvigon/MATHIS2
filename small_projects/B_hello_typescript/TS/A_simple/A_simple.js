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
