/**
 * Created by vigon on 19/11/2016.
 */

module mathis{

    export module appli{

        //TODO http://mathcurve.com/surfaces/boy/boy.shtml  de la surface romaine à boy


        export class AnimationPage implements OnePage{
            
            pageIdAndTitle="Animations"
            severalParts:SeveralParts

            constructor(private mathisFrame:MathisFrame){
                let several=new SeveralParts()
                several.addPart(new SimpleAnimation(this.mathisFrame))

                this.severalParts=several
            }

            go(){
                return this.severalParts.go()
            }


        }



        class SimpleAnimation implements PieceOfCode{

            NAME="SimpleAnimation"
            TITLE="You can change anything"

            frameInterval=null
            $$$frameInterval=[null,5,10,30,60]

            timeInterval=1000
            $$$timeInterval=[null,100,1000,2000]

            nbTimesThisActionMustBeFired=Number.POSITIVE_INFINITY
            $$$nbTimesThisActionMustBeFired=[Number.POSITIVE_INFINITY,30,10,5]



            constructor(private mathisFrame:MathisFrame){
                this.mathisFrame=mathisFrame

            }


            goForTheFirstTime(){
                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()
                // let camera=this.mathisFrame.getGrabberCamera()
                // camera.changePosition(new XYZ(0,0,-5))
                this.go()
            }

            go(){

                this.mathisFrame.clearScene(false,false)
                //$$$begin

                /**creation of a box (simple BABYLON.Mesh)*/
                let cube=BABYLON.Mesh.CreateBox('',0.1,this.mathisFrame.scene)
                let material=new BABYLON.StandardMaterial("",this.mathisFrame.scene)
                material.diffuseColor=new BABYLON.Color3(1,0,0)
                cube.material=material
                cube.position=new XYZ(1,0,0)
                /**creation of an arrow (from Mathis)*/
                let arrowCreator=new creation3D.ArrowCreator(this.mathisFrame.scene)
                let arrowMesh=arrowCreator.go()


                let positioningForArrow = new Positioning()
                let t=0
                let action=new PeriodicAction(function(){
                    t+=0.1
                    cube.position=new XYZ(Math.cos(t),Math.sin(t),0)

                    positioningForArrow.setOrientation(new XYZ(Math.cos(t),Math.sin(t),0), new XYZ(-Math.sin(t), Math.cos(t), 0))
                    positioningForArrow.applyToMesh(arrowMesh)

                })
                /**by default, this field is infinity*/
                action.nbTimesThisActionMustBeFired=this.nbTimesThisActionMustBeFired

                /** You can indicate the time-interval or the frame-interval
                 * If both are null, the action is fired every frame.  */
                action.frameInterval=this.frameInterval
                /** if time-interval is given, the previous affectation is ignored. The time unity is milli-second  */
                action.timeIntervalMilli=this.timeInterval


                this.mathisFrame.pushPeriodicAction(action)


                /**Following control can be useful*/
                //this.mathisFrame.pauseAllPeriodicActions()
                //this.mathisFrame.unpauseAllPeriodicActions()
                //this.mathisFrame.cleanAllPeriodicActions()



                //$$$end
            }
        }








    }


}



