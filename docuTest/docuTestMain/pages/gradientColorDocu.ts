/**
 * Created by vigon on 31/05/2017.
 */


/**
 * Created by vigon on 15/12/2016.
 */



module mathis{

    export module appli{


        export class GradientColorDocu implements OnePage{
            pageIdAndTitle="Varying colors"
            severalParts:SeveralParts


            constructor(private mathisFrame:MathisFrame){
                let several=new SeveralParts()
                several.addPart(new ColoringSquare(this.mathisFrame))
                several.addPart(new ColoringSurface(this.mathisFrame))


                this.severalParts=several
            }

            go(){
                return this.severalParts.go()
            }

        }


        class ColoringSquare implements PieceOfCode{

            NAME="ColoringSquare"
            TITLE="A function can vary the colors"+
                "This Function can use variable of double type, x, y, z, cos and sin."+
                " One can use the different symbols : + - * /   Integer value are not allowed, so 2 must be written 2."

            funcChoice="y"
            $$$funcChoice = ["x","y","z","1. -x","1. -y","(x*y)","cos(10.*x)","sin(100.*y)"]

            palette=0
            $$$palette=[0,1,2]


            _nbLinks

            constructor(private mathisFrame:MathisFrame){
                this.mathisFrame=mathisFrame

            }

            goForTheFirstTime(){
                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()
                this.go()
            }

            go(){

                this.mathisFrame.clearScene(false,false)


                //$$$begin
                let creator=new reseau.Regular2dPlus()
                creator.origin=new XYZ(-0.1,-0.1,0)
                creator.end=new XYZ(1.1,1.1,0)
                creator.nbI=10
                creator.nbJ=10
                let mamesh=creator.go()


                let b=Math.max(3,4)


                /**By default, the function must range in [0,1]. Outside, the color is black. See later on to change the range*/
                let func = this.funcChoice


                let material = new mathis.materials.FuncMapperShader(func,this.mathisFrame.scene);
                switch (this.palette) {
                    case 0:
                        material.gradient = new mathis.materials.GradientColor(
                            [new mathis.Color("#FF0000"),
                                new mathis.Color("#FFFF00"),
                                new mathis.Color("#0000FF")]
                        );
                        break
                    case 1:
                        material.gradient = new mathis.materials.GradientColor(
                            [new mathis.Color("#000000"),
                                new mathis.Color("#FFFFFF")]
                        );
                        break
                    case 2:
                        material.gradient = new mathis.materials.GradientColor(
                            [new mathis.Color("#FF0000"),
                                new mathis.Color("#FFFF00"),
                                new mathis.Color("#00FF00"),
                                new mathis.Color("#00FFFF"),
                                new mathis.Color("#0000FF"),
                                new mathis.Color("#FF00FF")]
                        );
                        break

                }
                let surfaceViewer=new visu3d.SurfaceViewer(mamesh,this.mathisFrame.scene)

                surfaceViewer.material = material.go();
                surfaceViewer.sideOrientation = BABYLON.Mesh.DOUBLESIDE;
                surfaceViewer.go()


                //$$$end

            }
        }



        class ColoringSurface implements PieceOfCode{

            NAME="ColoringSurface"
            TITLE="We color a surface according to the y-level. We adapt the range of the color map."


            constructor(private mathisFrame:MathisFrame){
                this.mathisFrame=mathisFrame

            }

            goForTheFirstTime(){
                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()
                this.go()
            }

            go(){

                this.mathisFrame.clearScene(false,false)


                //$$$begin
                let creator=new reseau.Regular2dPlus()
                creator.origin=new XYZ(-0.5,-0.5,0)
                creator.end=new XYZ(0.5,0.5,0)
                creator.nbI=50
                creator.nbJ=50
                let mamesh=creator.go()


                let maxY=Number.NEGATIVE_INFINITY
                let minY=Number.POSITIVE_INFINITY
                for (let i=0;i<mamesh.vertices.length;i++){
                    let pos=mamesh.vertices[i].position
                    let u=pos.x
                    let v=pos.y
                    pos.y=2*u**2+2*v**2+u*v-1
                    pos.x=u
                    pos.z=v
                    if (pos.y>maxY) maxY=pos.y
                    if (pos.y<minY) minY=pos.y
                }

                let material = new mathis.materials.FuncMapperShader("y",this.mathisFrame.scene);

                material.gradient = new mathis.materials.GradientColor(
                    [new mathis.Color("#FF0000"),new mathis.Color("#FFFF00"),new mathis.Color("#00FF00"),new mathis.Color("#00FFFF"),new mathis.Color("#0000FF"),new mathis.Color("#FF00FF")],
                    minY,maxY
                );


                let surfaceViewer=new visu3d.SurfaceViewer(mamesh,this.mathisFrame.scene)

                surfaceViewer.material = material.go();
                surfaceViewer.sideOrientation = BABYLON.Mesh.DOUBLESIDE;
                surfaceViewer.go()


                //$$$end

            }
        }




        class ColoringEverythings implements PieceOfCode{

            NAME="ColoringEverythings"
            TITLE="Any object can use any material"


            constructor(private mathisFrame:MathisFrame){
                this.mathisFrame=mathisFrame

            }

            goForTheFirstTime(){
                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()
                this.go()
            }

            go(){

                this.mathisFrame.clearScene(false,false)


                //$$$begin
                let creator=new reseau.Regular2dPlus()
                creator.origin=new XYZ(-0.5,-0.5,0)
                creator.end=new XYZ(0.5,0.5,0)
                creator.nbI=50
                creator.nbJ=50
                let mamesh=creator.go()


                let maxY=Number.NEGATIVE_INFINITY
                let minY=Number.POSITIVE_INFINITY
                for (let i=0;i<mamesh.vertices.length;i++){
                    let pos=mamesh.vertices[i].position
                    let u=pos.x
                    let v=pos.y
                    pos.y=2*u**2+2*v**2+u*v-1
                    pos.x=u
                    pos.z=v
                    if (pos.y>maxY) maxY=pos.y
                    if (pos.y<minY) minY=pos.y
                }

                let material = new mathis.materials.FuncMapperShader("y",this.mathisFrame.scene);

                material.gradient = new mathis.materials.GradientColor(
                    [new mathis.Color("#FF0000"),new mathis.Color("#FFFF00"),new mathis.Color("#00FF00"),new mathis.Color("#00FFFF"),new mathis.Color("#0000FF"),new mathis.Color("#FF00FF")],
                    minY,maxY
                );


                let surfaceViewer=new visu3d.SurfaceViewer(mamesh,this.mathisFrame.scene)

                surfaceViewer.material = material.go();
                surfaceViewer.sideOrientation = BABYLON.Mesh.DOUBLESIDE;
                surfaceViewer.go()

                let vertexViewer=new visu3d.VerticesViewer(mamesh,this.mathisFrame.scene)

                vertexViewer
                vertexViewer.go()


                //$$$end

            }
        }





    }


}

