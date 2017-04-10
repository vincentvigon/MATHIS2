/**
 * Created by vigon on 28/12/2016.
 */


/**
 * Created by vigon on 05/12/2016.
 */


module mathis {

    export module documentation {


        import StandardMaterial = BABYLON.StandardMaterial;
        import PlanarGrabber = mathis.macamera.PlanarGrabber;
        export class MacamDocu implements OnePage{
            
            pageIdAndTitle="Camera"
            severalParts:SeveralParts


            constructor(private mathisFrame:MathisFrame) {
                let several = new SeveralParts()
                several.addComment(
                    $("<div>The default mathis-camera is called the GrabberCamera. For real 3d viewing of single object the ideal grabber is a sphere " +
                        "(it is the white sphere which appear then you grab with your mouse). With the first piece of code, observe that :  <br>" +
                        "- outside the grabber when you grab, the grabber seems to turn on itself ; but actually, it is the camera (so yourself) that turning around.  <br>" +
                        "- inside the grabber  your are in a 'free mode rotation'<br> " +
                        " - close to the surface of the grabber, the movement is an interpolation between the two previous movement ; which give the impression to roll on the grabber surface.<br> " +
                        "Observe also that, by default, when it go back, the camera recenter on the grabber center. All these behaviour can be parametrized (see further pieces of code) </div>"
                    ),"The default mathis-camera is called the GrabberCamera"
                )

                several.addPart(new SphericalGrabberCameraDocu(this.mathisFrame))
                several.addPart(new PlanarGrabberCameraDocu(this.mathisFrame))

                several.addPart(new TwoGrabberCameraDocu(this.mathisFrame))

                this.severalParts=several
            }

            go() {
                return this.severalParts.go()
            }

        }



        class TwoGrabberCameraDocu implements PieceOfCode {


            NO_TEST=true


            $$$name = "TwoGrabberCameraDocu"
            $$$title = "Several grabbers. Usually used  for several for several meshes of interest. Here, two better show the process, we add only on mesh of" +
                "interest in the middle of two grabbers that we never hide."

            cameraOptionChoice=0
            $$$cameraOptionChoice=[0,1,2]

            toIncludeAtTheBeginOfTheFirstHiddenPiece=["var mathisFrame=new MathisFrame(false) // false so no default light and camera"]


            useFreeModeWhenCursorOutOfGrabber=false
            $$$useFreeModeWhenCursorOutOfGrabber=[true,false]

            useOnlyFreeMode=false
            $$$useOnlyFreeMode=[true,false]


            constructor(private mathisFrame:MathisFrame) {
                this.mathisFrame = mathisFrame

            }

            goForTheFirstTime() {

                this.go()
            }

            go(){

                this.mathisFrame.clearScene()

                //$$$begin

                this.mathisFrame.addDefaultLight()


                let grabber0 = new macamera.SphericalGrabber(this.mathisFrame.scene)
                grabber0.mesh.position=new XYZ(2,0,0)
                grabber0.referenceCenter=new XYZ(2,0,0)
                grabber0.material.diffuseColor=new BABYLON.Color3(1,0,0)
                grabber0.showGrabberOnlyWhenGrabbing=false
                grabber0.focusOnMyCenterWhenCameraGoDownWard=false

                //n
                let grabber1 = new macamera.SphericalGrabber(this.mathisFrame.scene)
                grabber1.mesh.position=new XYZ(-2,0,0)
                grabber1.referenceCenter=new XYZ(-2,0,0)
                grabber1.material.diffuseColor=new BABYLON.Color3(0,1,0)
                grabber1.showGrabberOnlyWhenGrabbing=false
                grabber1.focusOnMyCenterWhenCameraGoDownWard=false

                //n

                
                let grabberCamera = new macamera.GrabberCamera(this.mathisFrame, grabber0)
                grabberCamera.grabbers=[grabber0,grabber1]
                grabberCamera.useFreeModeWhenCursorOutOfGrabber=this.useFreeModeWhenCursorOutOfGrabber
                grabberCamera.useOnlyFreeMode=this.useOnlyFreeMode
                grabberCamera.attachControl(this.mathisFrame.canvas)
                grabberCamera.changePosition(new XYZ(0,0,-10))


                //n
                let creator=new creation3D.Polyhedron(creation3D.PolyhedronType.Cube)
                let mamesh=creator.go()

                new visu3d.LinksViewer(mamesh,this.mathisFrame.scene).go()





                //$$$end




            }
        }


        class SphericalGrabberCameraDocu implements PieceOfCode {

            NO_TEST=true


            $$$name = "SphericalGrabberCameraDocu"
            $$$title = "Mathis camera with spherical grabber"

            cameraOptionChoice=0
            $$$cameraOptionChoice=[0,1]

            toIncludeAtTheBeginOfTheFirstHiddenPiece=["var mathisFrame=new MathisFrame(false) // false so no default light and camera"]


            useFreeModeWhenCursorOutOfGrabber=false
            $$$useFreeModeWhenCursorOutOfGrabber=[true,false]

            useOnlyFreeMode=false
            $$$useOnlyFreeMode=[true,false]


            constructor(private mathisFrame:MathisFrame) {
                this.mathisFrame = mathisFrame

            }

            goForTheFirstTime() {
                
                this.go()
            }

            go(){

                this.mathisFrame.clearScene()

                //$$$begin

                this.mathisFrame.addDefaultLight()

                let grabberChoice=this.cameraOptionChoice
                let grabber
                if (grabberChoice==0) {
                    /**default camera*/
                    grabber = new macamera.SphericalGrabber(this.mathisFrame.scene)

                }
                else if (grabberChoice==1){
                    /**We deform the grabber. */
                    grabber = new macamera.SphericalGrabber(this.mathisFrame.scene)
                    grabber.mesh.scaling.x=1.5
                    /**see later on to understand the usage of this radius*/
                    grabber.radius=1.5
                }



                let grabberCamera = new macamera.GrabberCamera(this.mathisFrame, grabber)
                grabberCamera.useFreeModeWhenCursorOutOfGrabber=this.useFreeModeWhenCursorOutOfGrabber
                grabberCamera.useOnlyFreeMode=this.useOnlyFreeMode
                grabberCamera.attachControl(this.mathisFrame.canvas)



                //n
                let creator=new creation3D.Polyhedron(creation3D.PolyhedronType.Cube)
                let mamesh=creator.go()
                
                new visu3d.LinksViewer(mamesh,this.mathisFrame.scene).go()
                
                



                //$$$end




            }
        }



        class PlanarGrabberCameraDocu implements PieceOfCode {

            NO_TEST=true


            $$$name = "PlanarGrabberCameraDocu"
            $$$title = "Mathis camera with planar grabber"

            cameraOptionChoice=0
            $$$cameraOptionChoice=[0,1]

            toIncludeAtTheBeginOfTheFirstHiddenPiece=["var mathisFrame=new MathisFrame(false) // false so no default light and camera"]


            useFreeModeWhenCursorOutOfGrabber=false
            $$$useFreeModeWhenCursorOutOfGrabber=[true,false]

            useOnlyFreeMode=false
            $$$useOnlyFreeMode=[true,false]

            changeMaterial=true
            $$$changeMaterial=[true,false]


            constructor(private mathisFrame:MathisFrame) {
                this.mathisFrame = mathisFrame

            }

            goForTheFirstTime() {

                this.go()
            }

            go(){

                this.mathisFrame.clearScene()

                //$$$begin

                this.mathisFrame.addDefaultLight()

                let grabberChoice=this.cameraOptionChoice


                let grabber = new macamera.PlanarGrabber(this.mathisFrame.scene)

                if (grabberChoice==0){
                    grabber.mesh.scaling.x=2
                }
                else if (grabberChoice==1){
                    /**we change the default mesh,keeping the default material*/
                    grabber.mesh.dispose()
                    grabber.mesh=BABYLON.Mesh.CreateDisc('',1,20,this.mathisFrame.scene)
                    grabber.mesh.material=grabber.material
                }

                /**perhaps change some material properties*/
                if (this.changeMaterial){
                    grabber.material.diffuseColor=new BABYLON.Color3(1,0,0)
                    grabber.material.alpha=0.5
                }




                let grabberCamera = new macamera.GrabberCamera(this.mathisFrame, grabber)
                grabberCamera.useFreeModeWhenCursorOutOfGrabber=this.useFreeModeWhenCursorOutOfGrabber
                grabberCamera.useOnlyFreeMode=this.useOnlyFreeMode
                grabberCamera.attachControl(this.mathisFrame.canvas)


                console.log(this.mathisFrame.scene.activeCamera)
                console.log(this.mathisFrame.scene.activeCameras)


                //n
                let creator=new creation3D.Polyhedron(creation3D.PolyhedronType.Cube)
                let mamesh=creator.go()

                new visu3d.LinksViewer(mamesh,this.mathisFrame.scene).go()





                //$$$end




            }
        }


        class SeveralGrabber implements PieceOfCode {

            NO_TEST=true

            $$$name = "SeveralGrabber"
            $$$title = " "

            
            

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

                //$$$begin
                
                let creator=new creation3D.Polyhedron(creation3D.PolyhedronType.Rhombicuboctahedron)
                let mamesh=creator.go()


                
                //$$$end



                
            }
        }


    }
}