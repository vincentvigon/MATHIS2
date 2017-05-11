/**
 * Created by vigon on 05/12/2016.
 */


module mathis {

    export module appli{


        export class BidonPage1 implements OnePage{


            pageIdAndTitle="bidon page 1"
            severalParts:SeveralParts
            
            
            constructor(private mathisFrame:MathisFrame) {

                let several = new SeveralParts()


                several.addPart(new BidonPartA(this.mathisFrame))
                several.addPart(new BidonPartB(this.mathisFrame))


                this.severalParts=several
            }

            go() {
                return this.severalParts.go()
            }

        }


        
        class BidonPartA implements PieceOfCode {

            NAME = "BidonPartA"
            TITLE = "BidonPartA"
            CREATOR="vincent"

            nbSides=7
            $$$nbSides=[4,7,9]

            configA1=7
            $$$configA1=[5,6,7]


            configA2="toto_default"
            $$$configA2=['toto_default','tre',null]

            configA3=true
            $$$configA3=[true,false]


            _savedA1=5
            _saved_A2=7
            _saved_A3="bou"



            constructor(private mathisFrame:MathisFrame) {
                this.mathisFrame = mathisFrame

            }

            goForTheFirstTime() {

                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()
                this.go()
            }

            go(){


                this.mathisFrame.clearScene(false, false)
                let mathisFrame=this.mathisFrame

                //$$$begin

                let configA2=this.configA2


                let  creator = new reseau.TriangulatedPolygone(this.nbSides)
                creator.origin = new XYZ(-1, -1, 0)
                creator.end = new XYZ(1, 1, 0)
                creator.nbSubdivisionInARadius = 4

                //$$$end

                //$$$bt
                /**somme calculation for test*/
                let a=this.configA1**3
                this._saved_A2=a
                //$$$et


                //$$$begin
                let mamesh = creator.go()

                let kk=this.configA3


                let distances=new graph.DistancesBetweenAllVertices(mamesh.vertices)
                distances.go()

                let random=new proba.Random()

                let vertex0=mamesh.vertices[random.pseudoRandInt(mamesh.vertices.length)]
                let vertex1=mamesh.vertices[random.pseudoRandInt(mamesh.vertices.length)]

                mathisFrame.messageDiv.append("distance between vertex0 and vertex1:"+distances.OUT_distance(vertex0,vertex1))
                mathisFrame.messageDiv.append("graph diameter:"+distances.OUT_diameter)




                //n

                //$$$end



                //$$$bh visualization


                new visu3d.LinksViewer(mamesh, this.mathisFrame.scene).go()
                //$$$eh
            }
        }



        class BidonPartB implements PieceOfCode {

            NAME = "BidonPartB"
            TITLE = "BidonPartB"
            CREATOR="vincent"


            configB1=5
            $$$configB1=[5,6,7]




            _savedB1=5
            _savedB2=7



            constructor(private mathisFrame:MathisFrame) {
                this.mathisFrame = mathisFrame

            }

            goForTheFirstTime() {

                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()
                this.go()
            }

            go(){


                this.mathisFrame.clearScene(false, false)
                let mathisFrame=this.mathisFrame

                //$$$begin




                let  creator = new reseau.TriangulatedPolygone(5)
                creator.origin = new XYZ(-1, -1, 0)
                creator.end = new XYZ(1, 1, 0)
                creator.nbSubdivisionInARadius = 4

                //$$$end

                //$$$bt
                /**somme calculation for test*/
                let configA1=this.configB1
                //$$$et


                //$$$begin
                let mamesh = creator.go()


                let distances=new graph.DistancesBetweenAllVertices(mamesh.vertices)
                distances.go()

                let random=new proba.Random()

                let vertex0=mamesh.vertices[random.pseudoRandInt(mamesh.vertices.length)]
                let vertex1=mamesh.vertices[random.pseudoRandInt(mamesh.vertices.length)]

                mathisFrame.messageDiv.append("distance between vertex0 and vertex1:"+distances.OUT_distance(vertex0,vertex1))
                mathisFrame.messageDiv.append("graph diameter:"+distances.OUT_diameter)




                //n

                //$$$end



                //$$$bh visualization


                new visu3d.LinksViewer(mamesh, this.mathisFrame.scene).go()
                //$$$eh
            }
        }





    }
}