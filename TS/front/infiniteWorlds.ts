/**
 * Created by vigon on 07/11/2016.
 */

module mathis{
    
    export module infiniteWorlds{


        export enum NameOfReseau3D{
            cube,hexagone,doubleHexagone
        }


        export class InfiniteCartesian{

            /**reseau characterization*/
            nameOfResau3d=NameOfReseau3D.cube
            
            nbVerticalDecays=0
            nbHorizontalDecays=0
            
            fondamentalDomainSize=9
            nbSubdivision=3
            nbRepetition=8

            /**bien régler ce paramétre pour que l'on ne voit pas le bout du monde.
             *  fondamentalDomainSize petit &&  nbRepetition petit => fogDensity grand */
            fogDensity=0.05


            drawFondamentalDomain=false


            /**when creating the world, to see it from outside, put the  next fields to false */
            recenterCamera=true
            notDrawMeshesAtFarCorners=true

            

            population:BABYLON.AbstractMesh[]=[]
            
            collisionOnLinks=false
            collisionOnVertices=false
            collisionForCamera=false
            
            /**if null, no links*/
            nbSidesOfLinks=4
            

            
            buildLightCameraSkyboxAndFog=true

            
            private fd:periodicWorld.CartesianFundamentalDomain
            private mathisFrame:MathisFrame
            private mamesh:Mamesh


            constructor(mathisFrame:MathisFrame){
                this.mathisFrame=mathisFrame
            }


            go(){
                if(this.buildLightCameraSkyboxAndFog) this.cameraLight()
                this.creationOfReseau()

                var wallDiffuseTexture  = new BABYLON.Texture('assets/texture/escher.jpg', this.mathisFrame.scene);
                this.vertexVisualization(this.mamesh,wallDiffuseTexture)
                this.linksVisualization(this.mamesh,wallDiffuseTexture)

                this.addAndMultiplyPopulation()



                if(this.buildLightCameraSkyboxAndFog)  {
                    this.seeWorldFromInside()
                    this.fogAndSkybox()
                }

            }



            addAndMultiplyPopulation(){
                
                let maxDist=(this.notDrawMeshesAtFarCorners)?this.getTotalSize()*0.6:this.getTotalSize()

                let multiply=new periodicWorld.Multiply(this.fd,maxDist,this.nbRepetition)


                for (let mesh of this.population){
                    multiply.addAbstractMesh(mesh)
                }
                
            }


            seeWorldFromOutside(){


                //this.nbRepetition=nbRepetition

                let totalSize=this.getTotalSize()
                this.getCamera().changePosition(new XYZ(0,0,-totalSize*2),false)
                this.getCamera().changeFrontDir(new XYZ(0,0,1),false)
                //TODO cela bug si je fais cela : this.cam.changeUpVector(new XYZ(0,1,0))

                this.recenterCamera=false
                
                this.getGrabber().mesh.visibility=1
                this.getCamera().useOnlyFreeMode=false

                this.mathisFrame.scene.fogMode = BABYLON.Scene.FOGMODE_NONE;
                
                //if (this.addFog&&suppressFog) this.toggleFogAndSkyBox(false)

            }

            seeWorldFromInside(){

                this.recenterCamera=true
                //this.addFog=true
                this.getCamera().changePosition(new XYZ(0,0,0),false)
                this.getCamera().changeFrontDir(new XYZ(-0.5,-0.5,-1),false)
                this.getGrabber().mesh.visibility=0
                this.getCamera().useOnlyFreeMode=true

                this.mathisFrame.scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;

                //if(this.addFog) this.toggleFogAndSkyBox(true)

            }


            //cam:macamera.GrabberCamera
            //grabber0:macamera.SphericalGrabber

            getCamera():macamera.GrabberCamera{
                return <macamera.GrabberCamera> this.mathisFrame.scene.activeCamera
            }
            getGrabber(){
                return this.getCamera().currentGrabber
            }
            
            
            
            private cameraLight(){

                let grabberRadius=this.getTotalSize()*0.6
                let grabber0 = new macamera.SphericalGrabber(this.mathisFrame.scene,new XYZ(grabberRadius,grabberRadius,grabberRadius))
                grabber0.focusOnMyCenterWhenCameraGoDownWard = false
                grabber0.mesh.visibility = 0//TODO faire un grabber sans forcement de mesh


                //this.mathisFrame.camera=this.cam

                let camera=new macamera.GrabberCamera(this.mathisFrame, grabber0)

                camera.translationSpeed=this.fondamentalDomainSize*0.5
                camera.checkCollisions=this.collisionForCamera

                //cam.useOnlyFreeMode=true
                //this.cam.changePosition(this.cameraInitialPosition)
                //this.cam.changeFrontDir(this.cameraFrontDir)//new XYZ(-0.5,-1,1.5)

                camera.keysFrontward =[66, 78];
                camera.keysBackward =[32];
                camera.attachControl(this.mathisFrame.canvas)

                this.mathisFrame.scene.activeCamera=camera


                // Ajout d'une lumière
                var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(-1, 1, -1), this.mathisFrame.scene);
                light0.diffuse = new BABYLON.Color3(1,1,1);
                light0.specular = new BABYLON.Color3(0.,0.,0.);
                light0.groundColor = new BABYLON.Color3(0, 0, 0.3);


                let camPosInWebCoor=new XYZ(0,0,0)
                let camDomain=new periodicWorld.Domain(0,0,0)
                let camDomainCenter=new XYZ(0,0,0)


                this.fd = new periodicWorld.CartesianFundamentalDomain(new XYZ(this.fondamentalDomainSize, 0, 0), new XYZ(0, this.fondamentalDomainSize, 0), new XYZ(0, 0, this.fondamentalDomainSize));

                if (this.drawFondamentalDomain){
                    this.fd.drawMe(this.mathisFrame.scene)
                    this.fd.getArretes(this.mathisFrame.scene)
                }


                camera.onTranslate = ()=> {
                    if ( this.recenterCamera) {
                        this.fd.pointToWebCoordinate(camera.trueCamPos.position, camPosInWebCoor);
                        camDomain.whichContains(camPosInWebCoor);
                        camDomain.getCenter(this.fd, camDomainCenter);
                        /**attention, il faut changer simultanément la truePosition et la wished position. Donc mettre le smoothing à false*/
                        camera.changePosition(camera.whishedCamPos.getPosition().substract(camDomainCenter), false)

                    }
                }

            }


            private creationOfReseau(){

                let basis=new reseau.BasisForRegularReseau()
                basis.end=new XYZ(this.fondamentalDomainSize,this.fondamentalDomainSize,0)
                basis.nbI=this.nbSubdivision
                basis.nbJ=this.nbSubdivision
                basis.origin=new XYZ(0,0,0)
                basis.nbVerticalDecays=this.nbVerticalDecays
                basis.nbHorizontalDecays=this.nbHorizontalDecays
                let VV=basis.go()


                let crea = new reseau.Regular3D()
                crea.nbI = this.nbSubdivision*this.nbRepetition
                crea.nbJ = this.nbSubdivision*this.nbRepetition
                crea.nbK = this.nbSubdivision*this.nbRepetition
                crea.Vi = VV.Vi
                crea.Vj = VV.Vj
                crea.Vk = new XYZ(0, 0, this.fondamentalDomainSize / (this.nbSubdivision - 1))

                crea.makeTriangleOrSquare = false
                crea.createIKSquaresOrTriangles=false
                crea.createJKSquares=false

                
                
                if (this.nameOfResau3d==NameOfReseau3D.hexagone || this.nameOfResau3d==NameOfReseau3D.doubleHexagone) {
                    crea.strateHaveSquareMailleVersusTriangleMaille=false

                }
                if (this.nameOfResau3d==NameOfReseau3D.doubleHexagone){
                    crea.interStrateMailleAreSquareVersusTriangle = false
                    crea.decayOddStrates = true
                }
                

                //let totalSize=this.nbSubdivision*this.nbRepetition*VV.Vi.length()
                let totalSize=this.getTotalSize()
                crea.origine=new XYZ(-totalSize/2,-totalSize/2,-totalSize/2)

                
                if(this.notDrawMeshesAtFarCorners) crea.putAVertexOnlyAtXYZCheckingThisCondition=(xyz)=>xyz.length()<(totalSize*0.6)
                


                this.mamesh= crea.go()


                this.mamesh.fillLineCatalogue()

            }

            getTotalSize():number{
                return this.nbRepetition*this.fondamentalDomainSize
            }



            private vertexVisualization(mamesh2:Mamesh,wallDiffuseTexture){
                let model=BABYLON.Mesh.CreateBox('',0.5,this.mathisFrame.scene)
                let material=new BABYLON.StandardMaterial('',this.mathisFrame.scene)
                material.diffuseTexture = wallDiffuseTexture;
                model.material=material
                model.convertToFlatShadedMesh()
                let verticesVisuMaker=new visu3d.VerticesViewer(mamesh2,this.mathisFrame.scene)
                verticesVisuMaker.meshModel=model
                verticesVisuMaker.checkCollision=this.collisionOnVertices
                let positioning=new Positioning()
                positioning.upVector=new XYZ(1,0,0)
                positioning.frontDir=new XYZ(0,1,0)
                
                verticesVisuMaker.positionings=new HashMap<Vertex,Positioning>()
                for (let v of mamesh2.vertices) verticesVisuMaker.positionings.putValue(<Vertex>v,positioning)
                verticesVisuMaker.go()
            }


            private linksVisualization(ma:Mamesh,wallDiffuseTexture){
                let model:BABYLON.Mesh

                if(this.nbSidesOfLinks==4) model=BABYLON.Mesh.CreateBox('',1,this.mathisFrame.scene)
                else model=BABYLON.Mesh.CreateCylinder('',1,1,1,this.nbSidesOfLinks,null,this.mathisFrame.scene)
                
                let material=new BABYLON.StandardMaterial('',this.mathisFrame.scene)
                material.diffuseColor=new BABYLON.Color3(0.6,0.6,0.6)
                material.diffuseTexture = wallDiffuseTexture;
                model.material=material
                model.convertToFlatShadedMesh()

                let linksViewer=new visu3d.LinksViewer(ma,this.mathisFrame.scene)
                linksViewer.lateralScalingConstant=0.2
                /**collision sur les poutres pas terrible*/
                linksViewer.checkCollision=this.collisionOnLinks
                linksViewer.meshModel=model
                let vec100=new XYZ(1,0,0)
                let vec010=new XYZ(0,1,0)
                linksViewer.pairVertexToLateralDirection=(v1, v2)=>{
                    if ( Math.abs(geo.dot(XYZ.newFrom(v1.position).substract(v2.position),vec100))<0.0001) return vec100
                    else return vec010
                }
                linksViewer.go()
            }



            private fogAndSkybox(){
                let skybox = BABYLON.Mesh.CreateBox("skyBox", 50.*this.fondamentalDomainSize, this.mathisFrame.scene);
                this.mathisFrame.skybox=skybox
                //skybox.checkCollisions=true
                skybox.visibility=1

                /**je ne comprend pas pourquoi le brouillar ne marche pas quand on ne met pas de sky box...*/
                var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", this.mathisFrame.scene);
                skyboxMaterial.backFaceCulling = false;
                skybox.material = skyboxMaterial;
                skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
                skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
                skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/skybox/skybox", this.mathisFrame.scene,['_px.jpg', '_py.jpg', '_pz.jpg', '_nx.jpg', '_ny.jpg', '_nz.jpg']);
                skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;

                //this.mathisFrame.scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
                this.mathisFrame.scene.fogDensity = this.fogDensity //this.fondamentalDomainSize;
                this.mathisFrame.scene.fogColor = new BABYLON.Color3(1,1,1);
                
            }
            
            // private toggleFogAndSkyBox(add){
            //     if (add) {
            //         this.mathisFrame.scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
            //         //this.skybox.visibility=1
            //     }
            //     else{
            //         this.mathisFrame.scene.fogMode = BABYLON.Scene.FOGMODE_NONE;
            //         //this.skybox.visibility=0
            //     }
            // }







        }
        
        //
        // export class CameraStaysInTheCenterOfAWideReseau{
        //    
        //    
        //     useMacamera=true
        //    
        //    
        //     mathisFrame:MathisFrame
        //     fondamentalDomainSize=9
        //     nbSubdivision=3
        //     nbRepetition=6
        //
        //     mamesh:Mamesh
        //
        //     squareVersusSemiVersusTri=2
        //    
        //    
        //    
        //     constructor(mathisFrame:MathisFrame){
        //         this.mathisFrame=mathisFrame
        //     }
        //    
        //    
        //     go(){
        //         this.cameraLight()
        //         this.creationOfReseau()
        //
        //         var wallDiffuseTexture  = new BABYLON.Texture('../assets/texture/escher.jpg', this.mathisFrame.scene);
        //         this.vertexVisualization(this.mamesh,wallDiffuseTexture)
        //         this.linksVisualization(this.mamesh,wallDiffuseTexture)
        //
        //         this.fogAndSkybox()
        //     }
        //    
        //    
        //     private cameraLight(){
        //         let cam
        //
        //         if (this.useMacamera) {
        //             let grabber0 = new macamera.SphericalGrabber(this.mathisFrame.scene)
        //             grabber0.focusOnMyCenterWhenCameraGoDownWard = false
        //             grabber0.mesh.visibility = 0//TODO faire un grabber sans forcement de mesh
        //             //grabber0.showGrabberOnlyWhenGrabbing
        //
        //             cam = new macamera.GrabberCamera(this.mathisFrame, grabber0)
        //
        //             cam.translationSpeed=3
        //             cam.useOnlyFreeMode=true
        //             cam.changePosition(new XYZ(0.5,1,3).scale(1.5))
        //             cam.changeFrontDir(new XYZ(-0.5,-1,1.5))
        //
        //             cam.keysFrontward =[66, 78];
        //             cam.keysBackward =[32];
        //
        //
        //             cam.attachControl(this.mathisFrame.canvas)
        //
        //         }
        //         else {
        //             cam = new BABYLON.FreeCamera('', new BABYLON.Vector3(1, 0.5, 1), this.mathisFrame.scene)
        //             cam.speed *= 0.2
        //         }
        //
        //         cam.checkCollisions = true
        //         //
        //
        //
        //         // Ajout d'une lumière
        //         var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(-1, 1, -1), this.mathisFrame.scene);
        //         light0.diffuse = new BABYLON.Color3(1,1,1);
        //         light0.specular = new BABYLON.Color3(0.,0.,0.);
        //         light0.groundColor = new BABYLON.Color3(0, 0, 0.3);
        //
        //
        //         let camPosInWebCoor=new XYZ(0,0,0)
        //         let camDomain=new periodicWorld.Domain(0,0,0)
        //         let camDomainCenter=new XYZ(0,0,0)
        //        
        //
        //         if (this.useMacamera) {
        //             var fd = new periodicWorld.CartesianFundamentalDomain(new XYZ(this.fondamentalDomainSize, 0, 0), new XYZ(0, this.fondamentalDomainSize, 0), new XYZ(0, 0, this.fondamentalDomainSize));
        //             cam.onTranslate = ()=> {
        //
        //                 fd.pointToWebCoordinate(cam.trueCamPos.position, camPosInWebCoor);
        //                 camDomain.whichContains(camPosInWebCoor);
        //                 camDomain.getCenter(fd, camDomainCenter);
        //
        //                 /**attention, il faut changer simultanément la truePosition et la wished position. Donc mettre le smoothing à false*/
        //                 cam.changePosition(cam.whishedCamPos.getPosition().substract(camDomainCenter), false)
        //
        //             }
        //         }
        //        
        //     }
        //    
        //    
        //     private creationOfReseau(){
        //        
        //         let reseauGen=new reseau.GeneratorsForPeriodicReseau()
        //         reseauGen.end=new XYZ(this.fondamentalDomainSize,this.fondamentalDomainSize,0)
        //         reseauGen.nbI=this.nbSubdivision
        //         reseauGen.nbJ=this.nbSubdivision
        //         reseauGen.nbVerticalDecays=0
        //         reseauGen.nbHorizontalDecays=0
        //         reseauGen.kComponentTranslation+=0
        //         let VV=reseauGen.go()
        //
        //        
        //         let crea = new reseau.Regular3D()
        //         crea.nbI = this.nbSubdivision*this.nbRepetition
        //         crea.nbJ = this.nbSubdivision*this.nbRepetition
        //         crea.nbK = this.nbSubdivision*this.nbRepetition
        //         crea.Vi = VV.Vi
        //         crea.Vj = VV.Vj
        //         crea.Vk = new XYZ(0, 0, this.fondamentalDomainSize / (this.nbSubdivision - 1))
        //        
        //         crea.makeTriangleOrSquare = false
        //         crea.createIKSquaresOrTriangles=false
        //         crea.createJKSquares=false
        //
        //         if (this.squareVersusSemiVersusTri==1 || this.squareVersusSemiVersusTri==1) {
        //             crea.interStrateMaille = reseau.Maille.triangle
        //             crea.decayOddStrates = true
        //         }
        //         if (this.squareVersusSemiVersusTri==2){
        //             crea.strateHaveSquareMailleVersusTriangleMaille=false
        //         }
        //
        //
        //
        //
        //         let totalSize=this.nbSubdivision*this.nbRepetition*VV.Vi.length()
        //         crea.origine=new XYZ(-totalSize/2,-totalSize/2,-totalSize/2)
        //         crea.putAVertexOnlyAtXYZCheckingThisCondition=(xyz)=>xyz.length()<(totalSize/2*1.1)
        //         this.mamesh= crea.go()
        //        
        //
        //         this.mamesh.fillLineCatalogue()
        //
        //     }
        //
        //
        //
        //     private vertexVisualization(mamesh2:Mamesh,wallDiffuseTexture){
        //         let model=BABYLON.Mesh.CreateBox('',0.5,this.mathisFrame.scene)
        //         let material=new BABYLON.StandardMaterial('',this.mathisFrame.scene)
        //         material.diffuseTexture = wallDiffuseTexture;
        //         //material.bumpTexture = wallNormalsHeightTexture;
        //         //material.useParallax = true;
        //         // material.useParallaxOcclusion = true;
        //         // material.parallaxScaleBias = 0.1;
        //         //material.specularPower = 1000.0;
        //         //material.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        //
        //         //mat.diffuseColor=col
        //         model.material=material
        //         //model.checkCollisions=true
        //         model.convertToFlatShadedMesh()
        //         let verticesVisuMaker=new visu3d.VerticesVisuMaker(mamesh2,this.mathisFrame.scene)
        //         verticesVisuMaker.meshModel=model
        //         verticesVisuMaker.checkCollision=true
        //         let positioning=new Positioning()
        //         positioning.upVector=new XYZ(1,0,0)
        //         positioning.frontDir=new XYZ(0,1,0)
        //         verticesVisuMaker.positionings=new HashMap<Vertex,Positioning>()
        //         for (let v of mamesh2.vertices) verticesVisuMaker.positionings.putValue(<Vertex>v,positioning)
        //         verticesVisuMaker.go()
        //     }
        //
        //
        //     private linksVisualization(ma:Mamesh,wallDiffuseTexture){
        //         let model=BABYLON.Mesh.CreateBox('',1,this.mathisFrame.scene)//BABYLON.Mesh.CreateCylinder('',1,0.2,0.2,4,null,scene)
        //         let material=new BABYLON.StandardMaterial('',this.mathisFrame.scene)
        //         material.diffuseColor=new BABYLON.Color3(0.6,0.6,0.6)
        //         material.diffuseTexture = wallDiffuseTexture;
        //         model.material=material
        //         model.convertToFlatShadedMesh()
        //
        //         let lineMak=new visu3d.LinksVisuFastMaker(ma,this.mathisFrame.scene)
        //         lineMak.diameter=0.2
        //         /**collision sur les poutres pas terrible*/
        //         lineMak.checkCollision=false
        //         lineMak.meshModel=model
        //         let vec100=new XYZ(1,0,0)
        //         let vec010=new XYZ(0,1,0)
        //         lineMak.pairVertexToUpDirForLink=(v1,v2)=>{
        //             if ( Math.abs(geo.dot(XYZ.newFrom(v1.position).substract(v2.position),vec100))<0.0001) return vec100
        //             else return vec010
        //         }
        //         lineMak.go()
        //     }
        //
        //    
        //    
        //     private fogAndSkybox(){
        //         var skybox = BABYLON.Mesh.CreateBox("skyBox", 100.0, this.mathisFrame.scene);
        //         skybox.checkCollisions=true;
        //         var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", this.mathisFrame.scene);
        //         skyboxMaterial.backFaceCulling = false;
        //         skybox.material = skyboxMaterial;
        //         skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        //         skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        //         skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("../assets/skybox/skybox", this.mathisFrame.scene,['_px.jpg', '_py.jpg', '_pz.jpg', '_nx.jpg', '_ny.jpg', '_nz.jpg']);
        //         skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        //
        //
        //         this.mathisFrame.scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
        //         this.mathisFrame.scene.fogDensity = 0.05;
        //         this.mathisFrame.scene.fogColor = new BABYLON.Color3(1,1,1);
        //
        //
        //
        //     }
        //    
        //    
        //    
        //    
        //    
        //    
        //    
        // }
    }
    
}