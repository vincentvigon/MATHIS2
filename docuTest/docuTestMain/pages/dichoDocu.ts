 /**
 * Created by vigon on 05/12/2016.
 */




module mathis {

    export module documentation {


        export class DichoDocu implements OnePage{

            pageIdAndTitle="Dichotomy"
            severalParts:SeveralParts
            

            constructor(private mathisFrame:MathisFrame) {
                let several = new SeveralParts()
                several.addPart(new ReseauDicho(this.mathisFrame))
                several.addPart(new SolideDicho(this.mathisFrame))
                this.severalParts=several
            }

            go() {
                return this.severalParts.go()
            }
            
        }


        class ReseauDicho implements PieceOfCode {

            $$$name = "ReseauDicho"
            $$$title = "we do dichotomy on some square or triangle net"

            nbTrianglesCut=2
            $$$nbTrianglesCut=[1,2,3,4,5,10,16,32,50]

            squareVersusTriangle=true
            $$$squareVersusTriangle=[true,false]


            nbInitialDicho=1
            $$$nbInitialDicho=[0,1,2,3,4]


            constructor(private mathisFrame:MathisFrame) {
                this.mathisFrame = mathisFrame

            }

            goForTheFirstTime() {
                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()
                this.go()
            }

            go() {

                this.mathisFrame.clearScene(false, false)

                //$$$begin
                let squareVersusTriangle=this.squareVersusTriangle

                let creator=new reseau.Regular()
                creator.nbI=3
                creator.nbJ=3
                creator.origine=new XYZ(-1,-1,0)
                creator.squareVersusTriangleMaille=squareVersusTriangle
                let mamesh=creator.go()

                //n

                /**we do triangle-dichotomies several times*/
                let nbInitialDicho=this.nbInitialDicho
                for (let i=0;i<nbInitialDicho;i++){
                    let dichotomer
                    if (squareVersusTriangle) dichotomer=new mameshModification.SquareDichotomer(mamesh)
                    else dichotomer=new mameshModification.TriangleDichotomer(mamesh)
                    dichotomer.go()
                }

                /**again a dichotomy, but not for all triangles: we choose the first triangle in the list*/
                let nbPolygonsToCutAgain=this.nbTrianglesCut
                let partialDichotomer
                if (squareVersusTriangle) {
                    partialDichotomer=new mameshModification.SquareDichotomer(mamesh)
                    partialDichotomer.squareToCut=mamesh.smallestSquares.slice(0,4*nbPolygonsToCutAgain)
                }
                else {
                    partialDichotomer=new mameshModification.TriangleDichotomer(mamesh)
                    partialDichotomer.trianglesToCut=mamesh.smallestTriangles.slice(0,3*nbPolygonsToCutAgain)
                }

                partialDichotomer.go()


                //$$$end



                //$$$bh visualization
                /**we collect vertices according to their dichotomy level*/
                let verticesByDichoLevel:Vertex[][]=[]
                for (let i=0;i<mamesh.vertices.length;i++){
                    let vertex=mamesh.vertices[i]
                    let level=vertex.dichoLevel
                    if (verticesByDichoLevel[level]==null) verticesByDichoLevel[level]=[]
                    verticesByDichoLevel[level].push(vertex)
                }
                /**we create the visualisation, changing color according according to dichotomy level*/
                let nbLevel=verticesByDichoLevel.length
                let colorList=[Color.names.black,Color.names.whitesmoke,Color.names.blue,Color.names.red,Color.names.orange,Color.names.violet,Color.names.beige]
                for (let level=0;level<nbLevel;level++){
                    let viewer=new visu3d.VerticesViewer(mamesh,this.mathisFrame.scene)
                    viewer.color=new Color(colorList[level])//new Color(new HSV_01((level+1)/nbLevel,1,1))
                    viewer.selectedVertices=verticesByDichoLevel[level]
                    viewer.go()
                }



                new visu3d.LinksViewer(mamesh,this.mathisFrame.scene).go()
                new visu3d.SurfaceViewer(mamesh,this.mathisFrame.scene).go()
                //$$$eh



            }
        }

        class SolideDicho implements PieceOfCode {

            $$$name = "SolideDicho"
            $$$title = "we do dichotomy on some solid"

            polyhedronType=creation3D.PolyhedronType.Dodecahedron
            $$$polyhedronType=new Choices(allIntegerValueOfEnume(creation3D.PolyhedronType),{visualValues:allStringValueOfEnume(creation3D.PolyhedronType)})





            nbInitialDicho=1
            $$$nbInitialDicho=[0,1,2,3,4]


            constructor(private mathisFrame:MathisFrame) {
                this.mathisFrame = mathisFrame

            }

            goForTheFirstTime() {
                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()
                this.go()
            }

            go() {

                this.mathisFrame.clearScene(false, false)

                //$$$begin
                let creator=new creation3D.Polyhedron(this.polyhedronType)
                let mamesh =creator.go()

                //n

                let nbInitialDicho=this.nbInitialDicho
                /**we do triangle-dichotomies several times*/
                for (let i=0;i<nbInitialDicho;i++){
                    if(mamesh.smallestTriangles.length>0) new mameshModification.TriangleDichotomer(mamesh).go()
                }

                //$$$end


                //$$$bh visualization
                /**we collect vertices according to their dichotomy level*/
                let verticesByDichoLevel:Vertex[][]=[]
                for (let i=0;i<mamesh.vertices.length;i++){
                    let vertex=mamesh.vertices[i]
                    let level=vertex.dichoLevel
                    if (verticesByDichoLevel[level]==null) verticesByDichoLevel[level]=[]
                    verticesByDichoLevel[level].push(vertex)
                }
                /**we create the visualisation, changing color according according to dichotomy level*/
                let nbLevel=verticesByDichoLevel.length
                let colorList=[Color.names.black,Color.names.whitesmoke,Color.names.blue,Color.names.red,Color.names.orange,Color.names.violet,Color.names.beige]
                for (let level=0;level<nbLevel;level++){
                    let viewer=new visu3d.VerticesViewer(mamesh,this.mathisFrame.scene)
                    viewer.color=new Color(colorList[level])
                    viewer.selectedVertices=verticesByDichoLevel[level]
                    viewer.go()
                }

                new visu3d.LinksViewer(mamesh,this.mathisFrame.scene).go()
                new visu3d.SurfaceViewer(mamesh,this.mathisFrame.scene).go()
                //$$$eh



            }
        }





    }
}