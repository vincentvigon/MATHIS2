/**
 * Created by vigon on 05/06/2017.
 */



module mathis {
    export module appli {

        export class GeoPageTest implements OnePage {

            pageIdAndTitle = "Geometric computations "
            severalParts: SeveralParts

            constructor(private mathisFrame: MathisFrame) {
                let several = new SeveralParts()
                several.addPart(new AngleDocuTest(this.mathisFrame))

                this.severalParts = several
            }
            go() {
                return this.severalParts.go()
            }
        }

        class AngleDocuTest implements PieceOfCode{
            NAME="AngleDocuTest"
            TITLE="compute angle between vectors"

            vec1=new XYZ(1,0,0)
            $$$vec1=new Choices([new XYZ(1,0,0),new XYZ(0,1,0),new XYZ(1,1,0),new XYZ(-1,0,0),new XYZ(0,-1,0),new XYZ(-1,1,0),new XYZ(-1,-1,0)],{before:'new mathis.XYZ'})

            vec2=new XYZ(1,0,0)
            $$$vec2=new Choices([new XYZ(1,0,0),new XYZ(0,1,0),new XYZ(1,1,0),new XYZ(-1,0,0),new XYZ(0,-1,0),new XYZ(-1,1,0),new XYZ(-1,-1,0)],{before:'new mathis.XYZ'})


            normal=new XYZ(0,0,1)
            $$$normal=new Choices([new XYZ(0,0,1),new XYZ(0,0,-1)],{before:'new mathis.XYZ'})

            _angleModuloPI

            constructor(private mathisFrame:MathisFrame) {}

            /**This method is fired when we enter  in this piece of code (eg. when play button is pushed)*/
            goForTheFirstTime(){
                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()

                this.go()
            }
            /**This method is fired each time one of the configuration parameters change */
            go() {

                this.mathisFrame.clearScene(false,false)
                let mathisFrame=this.mathisFrame

                //$$$begin

                let vector1=this.vec1
                let vector2=this.vec2
                let normal=this.normal

                let angleModuloPI=geo.angleBetweenTwoVectorsBetween0andPi(vector1,vector2)
                let angle_0_2PI=geo.angleBetweenTwoVectorsBetween0And2Pi(vector1,vector2,normal)
                let angle_minusPI_PI=geo.angleBetweenTwoVectorsBetweenMinusPiAndPi(vector1,vector2,normal)



                //$$$end
                this._angleModuloPI=angleModuloPI
                //$$$bt

                //$$$et

                this.mathisFrame.messageDiv.append("angleModuloPI:"+angleModuloPI)
                this.mathisFrame.messageDiv.append("angle_0_2PI:"+angle_0_2PI)
                this.mathisFrame.messageDiv.append("angle_minusPI_PI:"+angle_minusPI_PI)
                this.mathisFrame.messageDiv.append("----------------------------------------------")

                //$$$bh visualization

                // let vertex0=new Vertex()
                // vertex0.position=new XYZ(0,0,0)
                //
                // let vertex1=new Vertex()
                // vertex1.position=vector1
                //
                // let vertex2=new Vertex()
                // vertex2.position=vector2
                //
                // vertex0.setOneLink(vertex1)
                // vertex0.setOneLink(vertex2)
                // vertex1.setOneLink(vertex0)
                // vertex2.setOneLink(vertex0)//TODO ajouter throw quand vertex0->vertex1
                //
                // let mamesh=new Mamesh()
                // mamesh.vertices=[vertex0,vertex1,vertex2]

                function drawOneVector(vec:XYZ,color:Color){
                    let arrowCreator=new creation3D.ArrowCreator(mathisFrame.scene)
                    arrowCreator.arrowFootAtOrigin=false
                    let material=new BABYLON.StandardMaterial("",mathisFrame.scene)
                    material.diffuseColor=color.toBABYLON_Color3()
                    let babylonMesh=arrowCreator.go()
                    babylonMesh.material=material
                    let elongator=new visu3d.ElongateAMeshFromBeginToEnd(new XYZ(0,0,0),vec,babylonMesh)
                    elongator.goChanging()
                }

                drawOneVector(vector1,new Color(Color.names.red))
                drawOneVector(vector2,new Color(Color.names.green))




                //$$$eh
            }
        }
    }
}
