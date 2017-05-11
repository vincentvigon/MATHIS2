/**
 * Created by vigon on 02/01/2017.
 */


var mathisFrame2=new mathis.MathisFrame("placeForMathis2")
var creator=new mathis.reseau.TriangulatedPolygone(5)
creator.nbSubdivisionInARadius=3
var mamesh2=creator.go()
new mathis.visu3d.LinksViewer(mamesh2,mathisFrame2.scene).go()
new mathis.visu3d.VerticesViewer(mamesh2,mathisFrame2.scene).go()
