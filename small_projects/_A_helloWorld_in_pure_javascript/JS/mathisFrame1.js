/**
 * Created by vigon on 06/06/2017.
 */



function frame1go() {

    var mathisFrame = new mathis.MathisFrame("placeForMathis")
    var mamesh = new mathis.polyhedron.Polyhedron("dodecahedron").go()
    new mathis.visu3d.LinksViewer(mamesh, mathisFrame.scene).go()
    new mathis.visu3d.VerticesViewer(mamesh, mathisFrame.scene).go()
}
