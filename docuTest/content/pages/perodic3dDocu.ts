/**
 * Created by vigon on 05/06/2017.
 */



module mathis {
    export module appli {

        import GrabberCamera = mathis.macamera.GrabberCamera;
        export class Periodic3dDocu implements OnePage {

            pageIdAndTitle = "Periodic word "
            severalParts: SeveralParts

            constructor(private mathisFrame: MathisFrame) {
                let several = new SeveralParts()
                several.addPart(new Periodic3dSimple(this.mathisFrame))

                this.severalParts = several
            }
            go() {
                return this.severalParts.go()
            }
        }



        class Periodic3dSimple implements PieceOfCode{
            NAME="Periodic3dSimple"
            TITLE="The 'central' domain is a Parallelepiped, which is repeated a lot of time. Object inside are also repeated." +
                "The camera is pull back each time it go out of the central domain.  This create the illusion of an infinite periodic word"


            // squareMaille=true
            // $$$squareMaille=[true,false]


            domaineSizeX=1
            $$$domaineSizeX=[0.5,1,3,5,10]

            domaineSizeY=1
            $$$domaineSizeY=[0.5,1,3,5,10]

            domaineSizeZ=1
            $$$domaineSizeZ=[0.5,1,3,5,10]

            fogDensiti=0.3
            $$$fogDensiti=[0,0.1,0.3,0.5,1,1.5]

            nbRepetition=15
            $$$nbRepetition=[5,10,15,20]



            // drawFondamentalDomain=true
            // $$$drawFondamentalDomain=[true,false]
            //
            //
            drawTheReseau=true
            $$$drawTheReseau=[true,false]


            // animate=true
            // $$$animate=[true,false]

            constructor(private mathisFrame:MathisFrame) {}

            goForTheFirstTime(){
                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()

                this.go()
            }
            go() {

                this.mathisFrame.clearScene(false,false)

                //$$$begin
                /**The sizes on one domain */
                let domainSizeX=this.domaineSizeX
                let domainSizeY=this.domaineSizeY
                let domainSizeZ=this.domaineSizeZ
                let maxSize=tab.maxValue([domainSizeX,domainSizeY,domainSizeZ])
                /** nbRepetition must be not too small (=> we would see the limits), and not too big (=> too many computations)*/
                let nbRepetition=this.nbRepetition
                let totalSize=maxSize*nbRepetition


                let periodic=new periodicWorld.PeriodicWorld(domainSizeX,domainSizeY,domainSizeZ,nbRepetition)


                /**we add a unique periodic reseau to materialize the repeated domains*/
                let drawReseau=this.drawTheReseau
                //$$$end


                //$$$bh reseau creation
                if (drawReseau) {
                    let crea = new reseau.Regular3D()
                    crea.nbU = nbRepetition
                    crea.nbV = nbRepetition
                    crea.nbW = nbRepetition
                    crea.dirU = new XYZ(domainSizeX, 0, 0)
                    crea.dirV = new XYZ(0, domainSizeY, 0)
                    crea.dirW = new XYZ(0, 0, domainSizeZ)

                    crea.makeTriangleOrSquare = false
                    crea.createIKSquaresOrTriangles = false
                    crea.createJKSquares = false
                    crea.putAVertexOnlyAtXYZCheckingThisCondition = (xyz) => xyz.length() < (totalSize * 0.6)
                    crea.origine = new XYZ(-Math.floor(domainSizeX*nbRepetition/2), -Math.floor(domainSizeY*nbRepetition/2), -Math.floor(domainSizeZ*nbRepetition/2))

                    let mamesh = crea.go()

                    let linksViewer = new visu3d.LinksViewer(mamesh, this.mathisFrame.scene)
                    linksViewer.radiusAbsolute=0.01
                    linksViewer.go()
                }
                //$$$eh




                //$$$begin
                /**we put the camera in the pure free mode (no grabber)  */
                let camera:GrabberCamera=this.mathisFrame.getGrabberCamera()
                camera.setFreeDisplacementMode()



                /**each time the camera go out of the fondamental domain, we recenter it*/
                camera.onTranslate = ()=> {
                    let newCamPos=periodic.positionToCentredPosition(camera.whishedCamPos.position)
                        /**the changement of position of camera must not be interpolate, so the last Param is false*/
                        camera.changePosition(newCamPos, false)
                }


                /**we add  an object which is repeated all around.
                 *  Be careful: it is better that this "original object" is in the central domain */
                let polyhedronMamesh=new polyhedron.Polyhedron("truncated tetrahedron").go()
                let surfaceViewer=new visu3d.SurfaceViewer(polyhedronMamesh,this.mathisFrame.scene)
                surfaceViewer.alpha=1
                let surfaceMesh:BABYLON.Mesh=surfaceViewer.go()
                periodic.addMesh(surfaceMesh)

                //$$$end

                //$$$bh we position the mesh on the center of the central domain
                let positioning=new Positioning()
                positioning.scaling=new XYZ(0.1,0.1,0.1)
                positioning.position=new XYZ(domainSizeX/2,domainSizeY/2,domainSizeZ/2)
                let theta=0
                positioning.frontDir=new XYZ(cos(theta),sin(theta),0)
                positioning.upVector=new XYZ(0,0,1)
                positioning.applyToMesh(surfaceMesh)



                    let periodicAction=new PeriodicAction(function(){
                        theta+=0.01
                        positioning.frontDir=new XYZ(cos(theta),sin(theta),0)
                        positioning.applyToMesh(surfaceMesh)
                        periodic.actualize()
                    })
                    periodicAction.timeIntervalMilli=10
                    this.mathisFrame.pushPeriodicAction(periodicAction)

                //$$$eh



                //$$$begin
                /**fog allows to hide the limits*/
                this.mathisFrame.scene.fogDensity = this.fogDensiti/maxSize

                //$$$end



                //n
                //$$$bh skybox and fog details
                let skybox = BABYLON.Mesh.CreateBox("skyBox", 10.*totalSize, this.mathisFrame.scene);
                this.mathisFrame.skybox=skybox

                /**the fog does not work without skybox*/
                var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", this.mathisFrame.scene);
                skyboxMaterial.backFaceCulling = false;
                skybox.material = skyboxMaterial;
                skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
                skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
                skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/skybox/skybox", this.mathisFrame.scene,['_px.jpg', '_py.jpg', '_pz.jpg', '_nx.jpg', '_ny.jpg', '_nz.jpg']);
                skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;


                this.mathisFrame.scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
                this.mathisFrame.scene.fogColor = new BABYLON.Color3(1,1,1);
                //$$$eh

            }
        }
    }
}
