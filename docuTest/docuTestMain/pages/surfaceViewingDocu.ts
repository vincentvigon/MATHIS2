/**
 * Created by vigon on 05/01/2017.
 */



/**
 * Created by vigon on 22/12/2016.
 */


/**
 * Created by vigon on 21/11/2016.
 */
module mathis{

    export module appli{


        export class SurfaceViewerDocu implements OnePage{

            pageIdAndTitle="Surface viewing"
            severalParts:SeveralParts

            constructor(private mathisFrame:MathisFrame){
                let severalParts=new SeveralParts()
                severalParts.addPart(new BackFaceCullingDocu(this.mathisFrame))
                severalParts.addPart(new DuplicateNormalDocu(this.mathisFrame))
                severalParts.addPart(new MoebiusBandDocu(this.mathisFrame))

                this.severalParts=severalParts
            }

            go(){
                return this.severalParts.go()
            }
            
        }


        class BackFaceCullingDocu implements PieceOfCode{
            NAME="BackFaceCullingDocu"
            TITLE="We observe the effect of the side orientation and the back-face-culling"

            alpha=0.5
            $$$alpha=[0.1,0.3,0.5,0.8,1]

            color=Color.names.rebeccapurple
            $$$color=new Choices([Color.names.rebeccapurple,Color.names.rosybrown,Color.names.darkorange],
                {'before':'Color.names.','visualValues':['rebeccapurple','rosybrown','darkorange']})

            backFaceCulling=true
            $$$backFaceCulling=[true,false]

            sideOrientation=BABYLON.Mesh.FRONTSIDE
            $$$sideOrientation=new Choices(
                [BABYLON.Mesh.DOUBLESIDE,BABYLON.Mesh.BACKSIDE,BABYLON.Mesh.FRONTSIDE],
                {'visualValues':['DOUBLESIDE','BACKSIDE','FRONTSIDE'],'before':'BABYLON.Mesh.'}
            )

            toIncludeAtTheBeginOfTheFirstHiddenPiece=["var mathisFrame=new mathis.MathisFrame()","/**back the camera*/","this.mathisFrame.getGrabberCamera().changePosition(new XYZ(0,0,-7))"]

            constructor(private mathisFrame:MathisFrame){}

            goForTheFirstTime(){
                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()
                this.mathisFrame.getGrabberCamera().changePosition(new XYZ(0,0,-7))


                this.go()
            }

            go(){

                this.mathisFrame.clearScene(false,false)

                //$$$begin


                let creator = new reseau.TriangulatedPolygone(10)
                creator.nbSubdivisionInARadius=5
                creator.origin=new XYZ(-Math.PI*0.8,-1,0)
                creator.end=new XYZ(+Math.PI*0.8,1,0)
                let mamesh = creator.go()
                
                for (let vertex of mamesh.vertices){
                    let u=vertex.position.x
                    let v=vertex.position.y
                    vertex.position.x=Math.cos(u)
                    vertex.position.y=Math.sin(u)
                    vertex.position.z=v
                }

                let positioning=new Positioning()
                positioning.frontDir.copyFromFloats(1,0,1)
                positioning.applyToVertices(mamesh.vertices)

                
                new visu3d.LinksViewer(mamesh, this.mathisFrame.scene).go()
                
                let surfaceViewer=new visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene)
                surfaceViewer.alpha=this.alpha
                surfaceViewer.color=new Color(this.color)
                /**best choice is : backFaceCulling=true and sideOrientation=DOUBLESIDE (if you want to see both-sides of your surface).
                 * When backFaceCulling=false, the transparency of your surface depend of the sideOrientation. If it is DOUBLESIDE, you see in the same time both faces,
                 * so transparency is degraded*/
                surfaceViewer.backFaceCulling=this.backFaceCulling
                surfaceViewer.sideOrientation=this.sideOrientation
                surfaceViewer.go()
                //$$$end




            }



        }


        class DuplicateNormalDocu implements PieceOfCode{
            NAME="DuplicateNormalDocu"
            TITLE="WebGL need normals to reflect light. But, what a pity, normal was positioned at points (while mathematically, a better choice would be to put one normal per triangle)." +
                "So if you want to see sharp angle, you have du duplicate points in order to duplicate normals. "

            alpha=1
            $$$alpha=[0.1,0.3,0.5,0.8,1]

            // color=Color.names.rebeccapurple
            // $$$color=new Choices([Color.names.rebeccapurple,Color.names.rosybrown,Color.names.darkorange],
            //     {'before':'Color.names.','visualValues':['rebeccapurple','rosybrown','darkorange']})

            backFaceCulling=true
            $$$backFaceCulling=[true,false]

            sideOrientation=BABYLON.Mesh.DOUBLESIDE
            $$$sideOrientation=new Choices(
                [BABYLON.Mesh.DOUBLESIDE,BABYLON.Mesh.BACKSIDE,BABYLON.Mesh.FRONTSIDE],
                {'visualValues':['DOUBLESIDE','BACKSIDE','FRONTSIDE'],'before':'BABYLON.Mesh.'}
            )

            toIncludeAtTheBeginOfTheFirstHiddenPiece=["var mathisFrame=new mathis.MathisFrame()","/**back the camera*/","this.mathisFrame.getGrabberCamera().changePosition(new XYZ(0,0,-7))"]


            letBabylonDoTheJob=false
            $$$letBabylonDoTheJob=[true,false]
            normalDuplication=visu3d.NormalDuplication.duplicateVertex
            $$$normalDuplication=new Choices(allIntegerValueOfEnume(visu3d.NormalDuplication),
                {'visualValues':allStringValueOfEnume(visu3d.NormalDuplication),'before':'visu3d.NormalDuplication.'})

            constructor(private mathisFrame:MathisFrame){}

            goForTheFirstTime(){
                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()
                this.mathisFrame.getGrabberCamera().changePosition(new XYZ(0,0,-7))

                this.go()
            }

            go(){

                this.mathisFrame.clearScene(false,false)

                //$$$begin


                let creator=new polyhedron.Polyhedron("truncated dodecahedron")
                let mamesh=creator.go()


                let surfaceViewer=new visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene)

                /** with none : the diPyramid seem smooth.*/
                surfaceViewer.normalDuplication= this.normalDuplication
                /**only useful for the option duplicateOnlyWhenNormalsAreTooFarr*/
                surfaceViewer.maxAngleBetweenNormals=Math.PI/6
                surfaceViewer.backFaceCulling=this.backFaceCulling
                surfaceViewer.sideOrientation=this.sideOrientation
                surfaceViewer.alpha=this.alpha
                let babylonMesh=surfaceViewer.go()

                /** we can ask to BABYLON to duplicate normals. But in this case put surfaceViewer.normalDuplication to 'none'
                 * (if not you multiply by 4 the number of normals!).
                 * As far I now, in BABYLON, there is no option : duplicateOnlyWhenNormalsAreTooFarr, which is the default option of our mathis.SurfaceViewer*/
                let letBabylonDoTheJob=this.letBabylonDoTheJob
                if (letBabylonDoTheJob) babylonMesh.convertToFlatShadedMesh()

                //$$$end



                
            }
            

        }





        class MoebiusBandDocu implements PieceOfCode{
            NAME="MoebiusBandDocu"
            TITLE="Here is the moebius band, this is a non orientable surface. In this case, to duplicate  normal-vectors have a bad effect at the place where the band is glued ! " +
                "To see this bad effect, look at the white triangle alternating with red-triangles this is due to the reflection of the specular light"

            alpha=1
            $$$alpha=[0.1,0.3,0.5,0.8,1]

            // color=Color.names.rebeccapurple
            // $$$color=new Choices([Color.names.rebeccapurple,Color.names.rosybrown,Color.names.darkorange],
            //     {'before':'Color.names.','visualValues':['rebeccapurple','rosybrown','darkorange']})

            backFaceCulling=true
            $$$backFaceCulling=[true,false]

            sideOrientation=BABYLON.Mesh.DOUBLESIDE
            $$$sideOrientation=new Choices(
                [BABYLON.Mesh.DOUBLESIDE,BABYLON.Mesh.BACKSIDE,BABYLON.Mesh.FRONTSIDE],
                {'visualValues':['DOUBLESIDE','BACKSIDE','FRONTSIDE'],'before':'BABYLON.Mesh.'}
            )

            toIncludeAtTheBeginOfTheFirstHiddenPiece=["var mathisFrame=new mathis.MathisFrame()","/**back the camera*/","this.mathisFrame.getGrabberCamera().changePosition(new XYZ(0,0,-7))"]


            vertexDuplication=visu3d.NormalDuplication.duplicateVertex
            $$$vertexDuplication=new Choices(allIntegerValueOfEnume(visu3d.NormalDuplication),
                {'visualValues':allStringValueOfEnume(visu3d.NormalDuplication),'before':'visu3d.NormalDuplication.'})

            constructor(private mathisFrame:MathisFrame){}

            goForTheFirstTime(){
                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()
                this.mathisFrame.getGrabberCamera().changePosition(new XYZ(0,0,-7))


                this.go()
            }

            go(){

                this.mathisFrame.clearScene(false,false)

                //$$$begin


                let basis=new reseau.BasisForRegularReseau()
                basis.origin=new XYZ(0,-1,0)
                basis.end=new XYZ(2*Math.PI,1,0)
                basis.nbI=20
                basis.nbJ=10
                let creator=new reseau.Regular(basis)
                let mamesh=creator.go()


                for (let vertex of mamesh.vertices){
                    let u=vertex.position.x
                    let v=vertex.position.y
                    vertex.position.x=(2-v*Math.sin(u/2))*Math.sin(u)
                    vertex.position.y=(2-v*Math.sin(u/2))*Math.cos(u)
                    vertex.position.z=v*Math.cos(u/2)
                }

                let positioning=new Positioning()
                positioning.frontDir.copyFromFloats(1,0,1)
                positioning.applyToVertices(mamesh.vertices)


                new visu3d.LinksViewer(mamesh, this.mathisFrame.scene).go()

                let surfaceViewer=new visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene)

                /**put normalDuplication to none, to suppress the bad effect */
                surfaceViewer.normalDuplication=this.vertexDuplication
                surfaceViewer.backFaceCulling=this.backFaceCulling
                surfaceViewer.sideOrientation=this.sideOrientation
                surfaceViewer.alpha=this.alpha
                surfaceViewer.go()
                //$$$end




            }



        }



    }



}