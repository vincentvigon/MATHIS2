/**
 * Created by vigon on 23/12/2016.
 */

module mathis{

    export module documentation{


        export class MathisFrameDocu implements OnePage{

            pageIdAndTitle="Positioning objects"
            severalParts:SeveralParts
            

            constructor(private mathisFrame:MathisFrame){
                let severalParts=new SeveralParts()
                severalParts.addPart(new AxisAndSomeMesh(this.mathisFrame))
                this.severalParts=severalParts
            }
            
            
            go(){
                return this.severalParts.go()
            }
        }


        class AxisAndSomeMesh implements PieceOfCode{

            NO_TEST=true

            $$$name="AxisAndSomeMesh"
            $$$title="We position some mesh on space"

            order=0
            $$$order=[0,1,2]

            move=true
            $$$move=[true,false]

            upTranslation=true
            $$$upTranslation=[true,false]

            
            constructor(private mathisFrame:MathisFrame){}

            goForTheFirstTime(){
                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()

                this.go()
            }

            go(){

                this.mathisFrame.clearScene(false,false)

                //$$$begin
                /**BabylonJS use a left-hand axis system*/
                let axisCreator=new creation3D.TwoOrTreeAxis(this.mathisFrame.scene)
                axisCreator.addLabelsXYZ=true
                axisCreator.go()
                //n
                /**we put a small cube*/
                let cube=BABYLON.Mesh.CreateBox('',0.1,this.mathisFrame.scene)
                cube.position=new XYZ(0.5,0.5,0.5)
                //n

                /** we add a second axis-system   */
                let axisToMove=new creation3D.TwoOrTreeAxis(this.mathisFrame.scene).go()
                /** we add a cone*/
                let coneToMove=BABYLON.Mesh.CreateCylinder("",0.5,0,0.5,20,3,this.mathisFrame.scene)
                axisToMove.push(coneToMove)

                if (this.upTranslation) {
                    /**a translation that we bake (if not, this translation will be forget when we will move again the cone)*/
                    coneToMove.position.y = 0.5
                    coneToMove.bakeCurrentTransformIntoVertices()
                }


                if (this.move) {
                    let positioning = new Positioning()
                    /**we indicate where must goChanging the x-axis and where must goChanging the y-axis*/
                    positioning.setOrientation(new XYZ(-1, 1, 0), new XYZ(1, 1, 0))
                    positioning.scaling = new XYZ(0.2, 0.2, 0.2)
                    positioning.position = new XYZ(-0.5, 0.5, 0)
                    positioning.applyToMeshes(axisToMove)
                }



                /**NB : transformation are always applied in the following order:
                 * 1/  scaling, 2/  rotating 3/ translating */




                //$$$end


                // threeArrows.scaling = new XYZ(0.2, 0.2, 0.2)
                // threeArrows.rotationQuaternion = new XYZW(0, 0, 0, 0)
                // geo.axisAngleToQuaternion(new XYZ(1, 0, 0), Math.PI / 4, threeArrows.rotationQuaternion)
                // threeArrows.position = new XYZ(-0.5, 0, 0)
                // let order=this.order
                // if (order==0) {
                //     threeArrows.scaling = new XYZ(0.2, 0.2, 0.2)
                //     threeArrows.rotationQuaternion = new XYZW(0, 0, 0, 0)
                //     geo.axisAngleToQuaternion(new XYZ(1, 0, 0), Math.PI / 4, threeArrows.rotationQuaternion)
                //     threeArrows.position = new XYZ(-0.5, 0, 0)
                // }
                // else if (order==1){
                //     /**to start with the translation, we have to force the transformation*/
                //     threeArrows.position = new XYZ(-0.5, 0, 0)
                //     threeArrows.bakeCurrentTransformIntoVertices()
                //     //n
                //     threeArrows.scaling = new XYZ(0.2, 0.2, 0.2)
                //     threeArrows.rotationQuaternion = new XYZW(0, 0, 0, 0)
                //     geo.axisAngleToQuaternion(new XYZ(1, 0, 0), Math.PI / 4, threeArrows.rotationQuaternion)
                // }
                // else if (order==2){
                //     threeArrows.position = new XYZ(-0.5, 0, 0)
                //     threeArrows.bakeCurrentTransformIntoVertices()
                //
                //     //n
                //     threeArrows.scaling = new XYZ(0.2, 0.2, 0.2)
                //     threeArrows.bakeCurrentTransformIntoVertices()
                //
                //     //n
                //     threeArrows.rotationQuaternion = new XYZW(0, 0, 0, 0)
                //     geo.axisAngleToQuaternion(new XYZ(1, 0, 0), Math.PI / 4, threeArrows.rotationQuaternion)
                // }







                //new visu3d.VerticesViewer(mamesh, this.mathisFrame.scene).goChanging()



            }



        }

















    }



}