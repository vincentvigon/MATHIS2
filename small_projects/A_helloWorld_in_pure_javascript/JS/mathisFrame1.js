/**
 * Created by vigon on 02/01/2017.
 */


var mathisFrame=new mathis.MathisFrame("placeForMathis")
var mamesh=new mathis.polyhedron.Polyhedron("dodecahedron").go()
new mathis.visu3d.LinksViewer(mamesh,mathisFrame.scene).go()
new mathis.visu3d.VerticesViewer(mamesh,mathisFrame.scene).go()