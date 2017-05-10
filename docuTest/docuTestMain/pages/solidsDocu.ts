/**
 * Created by vigon on 03/05/2017.
 */


/**
 * Created by vigon on 19/11/2016.
 */

module mathis{

    export module appli{


        export class SolidsDocu implements OnePage{

            pageIdAndTitle="Famous solids"
            severalParts:SeveralParts

            constructor(private mathisFrame:MathisFrame){
                let several=new SeveralParts()
                several.addPart(new SimplestSolids(this.mathisFrame))
                this.severalParts=several
            }

            go(){
                return this.severalParts.go()
            }


        }



        class SimplestSolids implements PieceOfCode{

            NAME="SimplestSolids"
            TITLE="Platonic, Archimedian, and other simple solids"

            polyhedronType=creation3D.PolyhedronType.TruncatedIcosidodecahedron
            $$$polyhedronType=new Choices(allIntegerValueOfEnume(creation3D.PolyhedronType),{visualValues:allStringValueOfEnume(creation3D.PolyhedronType)})

            constructor(private mathisFrame:MathisFrame){
                this.mathisFrame=mathisFrame

            }

            goForTheFirstTime(){
                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()
                let camera=<macamera.GrabberCamera>this.mathisFrame.scene.activeCamera
                camera.changePosition(new XYZ(0,0,-5))
                this.go()
            }

            go(){


                this.mathisFrame.clearScene(false,false)

                //$$$begin
                let polyArch = new creation3D.Polyhedron(this.polyhedronType);
                let mamesh = polyArch.go();
                //$$$end


                //$$$bh visualization

                let vertices=[]
                for (var i=0;i<mamesh.vertices.length;i++){
                    var vertex=mamesh.vertices[i]
                    if (!vertex.hasMark(Vertex.Markers.polygonCenter)) vertices.push(vertex)
                }
                let verticesViewer = new mathis.visu3d.VerticesViewer(vertices, this.mathisFrame.scene);
                verticesViewer.go();

                let linksViewer = new mathis.visu3d.LinksViewer(mamesh, this.mathisFrame.scene);
                linksViewer.segmentOrientationFunction=function(v0,v1){
                    if (v0.hasMark(Vertex.Markers.polygonCenter)||v1.hasMark(Vertex.Markers.polygonCenter)) return 0
                    return 1
                }
                linksViewer.go();

                let surfaceViewer = new mathis.visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene);
                surfaceViewer.go();
                //$$$eh

            }
        }












    }


}



