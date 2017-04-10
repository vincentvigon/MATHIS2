//
// module mathis {
//
//
//     import Polyhedron = mathis.creation3D.PolyhedronStatic;
//     import Vector3=BABYLON.Vector3
//     import VertexBuffer = BABYLON.VertexBuffer;
//     import Mesh = BABYLON.Mesh;
//     import Color3 = BABYLON.Color3;
//     import GrabberCamera = mathis.macamera.GrabberCamera;
//
//     export module testWithBabylon{
//
//         import Multiply = mathis.periodicWorld.Multiply;
//         import FreeCamera = BABYLON.FreeCamera;
//         import InstancedMesh = BABYLON.InstancedMesh;
//         import Grabber = mathis.macamera.Grabber;
//         import GrabberCamera = mathis.macamera.GrabberCamera;
//         import Action = BABYLON.Action;
//         import AbstractMesh = BABYLON.AbstractMesh;
//         import StandardMaterial = BABYLON.StandardMaterial;
//
//
//         export function startSeveralFrame(){
//
//
//             let mainDiv:HTMLElement=document.getElementById("mainDiv");
//             let canvass=mathis.nCanvasInOneLine(2,mainDiv)
//
//             var secondFrame=new mathis.MathisFrame()
//             secondFrame.canvas=canvass[0]
//             secondFrame.goChanging()
//             testOneGrabber(secondFrame,new BABYLON.Color3(1,0,0))
//
//
//             var starter=new mathis.MathisFrame()
//             starter.canvas=canvass[1]
//             starter.goChanging()
//             testOneGrabber(starter,new BABYLON.Color3(0,0,1))
//
//
//             //mainDiv.innerHTML=mathis.twoCanvas//"<div style='width: 10%;height: 10px;background-color: red'></div>"
//
//
//
//
//
//
//
//         }
//
//
//         export function start(){
//             let mainDiv:HTMLElement=document.getElementById("mainDiv");
//
//             let canvass=mathis.nCanvasInOneLine(2,mainDiv)
//
//             let frame =new MathisFrame()
//             frame.canvas=canvass[0]
//             frame.goChanging()
//
//             let frame2 =new MathisFrame()
//             frame2.canvas=canvass[1]
//             frame2.goChanging()
//
//             GaussCurvarture(frame,frame2,mainDiv)
//
//         }
//
//
//
//         //
//         //
//         // function testSymm(mathisFrame:MathisFrame){
//         //     let macam = new macamera.GrabberCamera(mathisFrame.scene)
//         //     macam.changePosition(new XYZ(0,0,-4))
//         //
//         //     macam.FirstGrabber.center=new XYZ(0,0,0)
//         //     macam.FirstGrabber.constantRadius=1
//         //     macam.FirstGrabber.grabberIsVisible=false
//         //
//         //
//         //     macam.attachControl(mathisFrame.canvas)
//         //
//         //
//         //
//         //     // Ajout d'une lumière
//         //     var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(-1, 1, -1), mathisFrame.scene);
//         //     light0.diffuse = new BABYLON.Color3(1, 1, 1);
//         //     light0.specular = new BABYLON.Color3(1, 0.5, 0.5);
//         //     light0.groundColor = new BABYLON.Color3(0, 0, 0);
//         //
//         //
//         //
//         //     let mamesh=new Mamesh()
//         //     let crea=new reseau.Regular(mamesh)
//         //     crea.nbI=5
//         //     crea.nbJ=6
//         //     crea.oneMoreVertexForOddLine=true
//         //     crea.goChanging()
//         //
//         //     mamesh.fillLineCatalogue()
//         //
//         //     let lineVisu=new visu3d.LinesVisuFastMaker(mamesh,scene)
//         //     lineVisu.goChanging()
//         //
//         // }
//         //
//         //
//         //
//         // function testCamFok(mathisFrame:MathisFrame){
//         //
//         //
//         //     let bow=BABYLON.Mesh.CreateBox('',0.5,scene)
//         //
//         //     /**param*/
//         //     let width=5
//         //     let height=1
//         //     let origin=new XYZ(-width/2,-height/2,0)
//         //     let maxPathSegment=500
//         //     let deltaT=0.1
//         //
//         //
//         //
//         //     let light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(-1, 1, -1), mathisFrame.scene);
//         //     light0.diffuse = new BABYLON.Color3(0.5, 0.5, 0.5);
//         //     light0.specular = new BABYLON.Color3(0.7, 0.7, 0.7);
//         //     light0.groundColor = new BABYLON.Color3(1, 1, 1);
//         //
//         //     let plan = BABYLON.Mesh.CreatePlane('', 1, scene)
//         //     plan.scaling = new XYZ(width, height, 0)
//         //     plan.position = new XYZ(0, 0, 0.06)
//         //     plan.bakeCurrentTransformIntoVertices();
//         //
//         //
//         //     let macam=new macamera.GrabberCamera(scene)
//         //     macam.FirstGrabber.setMesh(plan)
//         //     //plan.isPickable=true
//         //     macam.FirstGrabber.setParallelMode()
//         //     macam.attachControl(mathisFrame.canvas)
//         //
//         //
//         // }
//         //
//         //
//
//         class ArrowCreator{
//
//             totalHeight=maud
//             bodyProp=3/4
//             headProp=1/4
//             bodyDiameterProp=0.1
//             headDiameterProp=0.2
//
//             headUp=true
//             arrowFootAtOrigin=true
//             scene:BABYLON.Scene
//
//             constructor(scene:BABYLON.Scene){
//                 this.scene=scene
//             }
//
//
//             goChanging():Mesh{
//                 let bodyHeight=this.bodyProp*this.totalHeight
//                 let headHeight=this.headProp*this.totalHeight
//                 let body=BABYLON.Mesh.CreateCylinder('',bodyHeight,this.bodyDiameterProp*this.totalHeight,this.bodyDiameterProp*this.totalHeight,6,null,this.scene)
//                 body.position=new XYZ(0,bodyHeight/2,0)
//                 let head=BABYLON.Mesh.CreateCylinder('',headHeight,0,this.headDiameterProp*this.totalHeight,6,null,this.scene)
//                 head.position=new XYZ(0,bodyHeight+headHeight/2,0)
//                 let arrow=BABYLON.Mesh.MergeMeshes([body,head])
//                 if(!this.headUp) {
//                     let quat=new XYZW(0,0,0,0)
//                     geo.axisAngleToQuaternion(new XYZ(1,0,0),Math.PI,quat)
//                     arrow.rotationQuaternion=quat
//                 }
//
//                 if(!this.arrowFootAtOrigin){
//                     arrow.position.addInPlace(new XYZ(0,-this.totalHeight/2,0))
//                 }
//
//                 arrow.bakeCurrentTransformIntoVertices()
//                 return arrow
//             }
//
//         }
//         // function testResau(mathisFrame:MathisFrame){
//         //     let macam = new macamera.GrabberCamera(mathisFrame.scene)
//         //     macam.changePosition(new XYZ(0,0,-4))
//         //
//         //     macam.FirstGrabber.center=new XYZ(0,0,0)
//         //     macam.FirstGrabber.constantRadius=1
//         //     macam.FirstGrabber.grabberIsVisible=true
//         //
//         //
//         //     macam.attachControl(mathisFrame.canvas)
//         //
//         //
//         //
//         //     // Ajout d'une lumière
//         //     var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(-1, 1, -1), mathisFrame.scene);
//         //     light0.diffuse = new BABYLON.Color3(1, 1, 1);
//         //     light0.specular = new BABYLON.Color3(1, 1, 1);
//         //     light0.groundColor = new BABYLON.Color3(0, 0, 0);
//         //
//         //
//         //     // let mamesh=new Mamesh()
//         //     // let cre=new reseau.Regular(mamesh)
//         //     // cre.goChanging()
//         //     //
//         //     // linker.checkTheRegularityOfAGRaph(mamesh.vertices)
//         //     //
//         //     //mamesh.fillLineCatalogue()
//         //
//         //
//         //
//         //     let mamesh=new Mamesh3dStratified()
//         //
//         //     let twoGe=new reseau.BasisForRegularReseau()
//         //     twoGe.nbHorizontalDecays=1
//         //     let res=twoGe.goChanging()
//         //
//         //
//         //     let crea=new reseau.Regular3D(mamesh)
//         //     crea.Vi=res.Vi
//         //     crea.Vj=res.Vj
//         //     crea.createIMameshes=true
//         //     crea.createJMameshes=true
//         //     crea.goChanging()
//         //
//         //     mamesh.fillLineCatalogueOfStrates()
//         //
//         //     mamesh.kMameshes.forEach(mamesh2d=>{
//         //         cc(mamesh2d.toString(true))
//         //         let aaa=new visu3d.LinesVisuFastMaker(mamesh2d,scene)
//         //         aaa.goChanging()
//         //
//         //
//         //
//         //         let verGa=new visu3d.VerticesViewer(mamesh2d,scene)
//         //         verGa.goChanging()
//         //
//         //     })
//         //
//         //     mamesh.iMameshes.forEach(mamesh2d=>{
//         //         cc(mamesh2d.toString(true))
//         //         let aaa=new visu3d.LinesVisuFastMaker(mamesh2d,scene)
//         //         aaa.goChanging()
//         //
//         //
//         //
//         //     })
//         //
//         //     mamesh.jMameshes.forEach(mamesh2d=>{
//         //         cc(mamesh2d.toString(true))
//         //         let aaa=new visu3d.LinesVisuFastMaker(mamesh2d,scene)
//         //         aaa.goChanging()
//         //
//         //     })
//         //
//         //
//         // }
//         //
//         //
//         //
//         // function testPeriodicWorldByLargeResau(mathisFrame:MathisFrame):void{
//         //
//         //
//         //     let cam =new macamera.GrabberCamera(scene)
//         //     cam.translationSpeed=4
//         //     cam.useOnlyFreeMode=true
//         //     cam.changePosition(new XYZ(0.5,1,3))
//         //     cam.changeFrontDir(new XYZ(-0.5,-1,1.5))
//         //
//         //
//         //     //let cam=new BABYLON.FreeCamera2('',new Vector3(0,0,-2),scene)
//         //     //cam.checkCollisions = true;
//         //
//         //     cam.checkCollisions=true
//         //
//         //     cam.attachControl(mathisFrame.canvas)
//         //
//         //     //cam.speed = 0.5;
//         //
//         //     //cam.ellipsoid = new BABYLON.Vector3(1, 1, 1);
//         //
//         //     // let macam = new macamera.GrabberCamera(mathisFrame.scene)
//         //     // macam.trueCamPos.position=new XYZ(0,0,-4)
//         //     // macam.recenterOnGrabberWhenGoingDownward=false
//         //     // macam.justOneGrabber.grabberIsVisible=true
//         //     // macam.justOneGrabber.alpha=0.3
//         //     // macam.goChanging()
//         //     // macam.attachControl(mathisFrame.canvas)
//         //
//         //     scene.collisionsEnabled = true;
//         //
//         //
//         //     // Ajout d'une lumière
//         //     var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(-1, 1, -1), mathisFrame.scene);
//         //     light0.diffuse = new BABYLON.Color3(1,1,1);
//         //     light0.specular = new BABYLON.Color3(0.,0.,0.);
//         //     light0.groundColor = new BABYLON.Color3(0, 0, 0.3);
//         //
//         //
//         //
//         //     let camPosInWebCoor=new XYZ(0,0,0)
//         //     let camDomain=new periodicWorld.Domain(0,0,0)
//         //     let camDomainCenter=new XYZ(0,0,0)
//         //     let fondamentalDomainSize=9
//         //     let nbSubdivision=3
//         //     let nbRepetition=6
//         //
//         //     var fd=new periodicWorld.CartesianFundamentalDomain(new XYZ(fondamentalDomainSize,0,0),new XYZ(0,fondamentalDomainSize,0),new XYZ(0,0,fondamentalDomainSize));
//         //     cam.onTranslate=()=>{
//         //
//         //         fd.pointToWebCoordinate(cam.trueCamPos.position, camPosInWebCoor);
//         //         camDomain.whichContains(camPosInWebCoor);
//         //         camDomain.getCenter(fd, camDomainCenter);
//         //
//         //         /**attention, il fautchnager simultanément la truePosition et la wished position. Donc mettre le smoothing à false*/
//         //         cam.changePosition(cam.whishedCamPos.getPosition().substract(camDomainCenter),false)
//         //         //cam.changePosition(cam.trueCamPos.getPosition().substract(camDomainCenter))
//         //
//         //     }
//         //
//         //
//         //
//         //
//         //     let reseauGen=new reseau.BasisForRegularReseau()
//         //     reseauGen.end=new XYZ(fondamentalDomainSize,fondamentalDomainSize,0)
//         //     reseauGen.nbI=nbSubdivision
//         //     reseauGen.nbJ=nbSubdivision
//         //     reseauGen.nbVerticalDecays=0
//         //     reseauGen.nbHorizontalDecays=0
//         //     reseauGen.kComponentTranslation+=0
//         //     let VV=reseauGen.goChanging()
//         //
//         //
//         //
//         //     function theReseau(nbRepetitions): Mamesh3dStratified{
//         //         let mamesh3d = new Mamesh3dStratified()
//         //         let crea = new reseau.Regular3D(mamesh3d)
//         //         crea.nbI = nbSubdivision*nbRepetitions
//         //         crea.nbJ = nbSubdivision*nbRepetitions
//         //         crea.nbK = nbSubdivision*nbRepetitions
//         //         crea.Vi = VV.Vi
//         //         crea.Vj = VV.Vj
//         //         crea.Vk = new XYZ(0, 0, fondamentalDomainSize / (nbSubdivision - 1))
//         //         crea.makeSquares = true
//         //         let totalSize=nbSubdivision*nbRepetitions*VV.Vi.length()
//         //         crea.origine=new XYZ(-totalSize/2,-totalSize/2,-totalSize/2)
//         //         crea.putAVertexOnlyAtXYZCheckingThisCondition=(xyz)=>xyz.length()<(totalSize/2*1.1)
//         //         crea.goChanging()
//         //         return mamesh3d
//         //     }
//         //
//         //     let stratified1=theReseau(nbRepetition)
//         //     stratified1.fillLineCatalogueOfStrates()
//         //
//         //     // let ma1=stratified1.toMamesh()
//         //     // ma1.fillLineCatalogue()
//         //
//         //     //ma2.fillLineCatalogue()
//         //     //oneMameshVisual(ma2)
//         //
//         //
//         //     var wallDiffuseTexture  = new BABYLON.Texture('../assets/texture/escher.jpg', scene);
//         //     //var wallNormalsHeightTexture = new BABYLON.Texture('../assets/texture/GtIUsWW.png', scene);
//         //
//         //
//         //     function lineVisu(ma:Mamesh,segmentSelectionFunction){
//         //         let model=BABYLON.Mesh.CreateBox('',1,scene)//BABYLON.Mesh.CreateCylinder('',1,0.2,0.2,4,null,scene)
//         //         let material=new BABYLON.StandardMaterial('',scene)
//         //         material.diffuseColor=new BABYLON.Color3(0.6,0.6,0.6)
//         //         material.diffuseTexture = wallDiffuseTexture;
//         //         //material.bumpTexture = wallNormalsHeightTexture;
//         //         model.material=material
//         //         model.convertToFlatShadedMesh()
//         //         let lineMak=new visu3d.LinesVisuFastMaker(ma,scene)
//         //         lineMak.diameter=0.2
//         //         /**collision sur les poutres pas terrible*/
//         //         lineMak.checkCollision=false
//         //         lineMak.meshModel=model
//         //         lineMak.segmentSelectionFunction=segmentSelectionFunction
//         //         lineMak.goChanging()
//         //     }
//         //
//         //     function vertexVisu(mamesh:Mamesh){
//         //         let model=BABYLON.Mesh.CreateBox('',1,scene)
//         //         let material=new BABYLON.StandardMaterial('',scene)
//         //         material.diffuseTexture = wallDiffuseTexture;
//         //         //material.bumpTexture = wallNormalsHeightTexture;
//         //         //material.useParallax = true;
//         //         // material.useParallaxOcclusion = true;
//         //         // material.parallaxScaleBias = 0.1;
//         //         //material.specularPower = 1000.0;
//         //         //material.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5);
//         //
//         //         //mat.diffuseColor=col
//         //         model.material=material
//         //         //model.checkCollisions=true
//         //         model.convertToFlatShadedMesh()
//         //         let verticesVisuMaker=new visu3d.VerticesViewer(mamesh,scene)
//         //         verticesVisuMaker.meshModel=model
//         //         verticesVisuMaker.checkCollision=true
//         //
//         //
//         //         verticesVisuMaker.goChanging()
//         //     }
//         //
//         //     let count=0
//         //     stratified1.kMameshes.forEach(ma=>{
//         //         count+=ma.vertices.length
//         //         lineVisu(ma,null)
//         //         vertexVisu(ma)
//         //     })
//         //
//         //     cc('nb vertice drawn:',count,'<',Math.pow(nbSubdivision*nbRepetition,3))
//         //
//         //
//         //     let onlyVerticalFonc=(i:number,segment:Vertex[])=>{
//         //         if (segment[0].param.x==segment[1].param.x&& segment[0].param.y==segment[1].param.y) return true
//         //         return false
//         //     }
//         //     stratified1.iMameshes.forEach(ma=>{
//         //         lineVisu(ma,onlyVerticalFonc)
//         //     })
//         //
//         //
//         //     // stratified1.jMameshes.forEach(ma=>{
//         //     //     lineVisu(ma,new BABYLON.Color3(0,1,0))
//         //     // })
//         //     // stratified1.kMameshes.forEach(ma=>{
//         //     //     lineVisu(ma,new BABYLON.Color3(0,0,1))
//         //     // })
//         //
//         //
//         //
//         //
//         //
//         //
//         //     // function oneMerge(mesh1,mesh2){
//         //
//         //     // }
//         //     // oneMerge(directional1.iMamesh,directional2.iMamesh)
//         //     // oneMerge(directional1.jMamesh,directional2.jMamesh)
//         //     // oneMerge(directional1.kMamesh,directional2.kMamesh)
//         //     //
//         //     //
//         //     //
//         //     //
//         //     //
//         //     //
//         //     // function oneMameshVisual(mamesh:Mamesh):void{
//         //     //     let link=new visu3d.LinesGameoMaker(mamesh,scene)
//         //     //     link.parentGameo=rootGameo
//         //     //     link.lineOptionFunction=(i,line)=>{
//         //     //         let res=new visu3d.LineGameoStatic.LineGameoOption()
//         //     //         res.tesselation=4
//         //     //         return res
//         //     //     }
//         //     //     link.goChanging()
//         //     // }
//         //     //
//         //     // oneMameshVisual(directional1.iMamesh)
//         //     //
//         //     //
//         //     // //  mamesh3d.iMameshes[0].vertices.forEach(v=>v.isInvisible=true)
//         //     // //  mamesh3d.jMameshes[0].vertices.forEach(v=>v.isInvisible=true)
//         //     // //  mamesh3d.kMameshes[0].vertices.forEach(v=>v.isInvisible=true)
//         //     // //
//         //     // //
//         //     // // mamesh3d.allMamesh().forEach(IN_mamesh=>{oneMameshVisual(IN_mamesh)})
//         //     //
//         //
//         //
//         //
//         //
//         //     //
//         //     // let arrete=fd.getArretes(scene)
//         //     //
//         //     //
//         //     // let mul=new periodicWorld.Multiply(fd,10)
//         //     // arrete.forEach(arr=>{mul.addAbstractMesh(arr)})
//         //     // //mul.addBabGameo(rootGameo)
//         //     //
//         //     //
//         //     // createSkybox(scene)
//         //
//         //
//         //     createSkybox(scene)
//         //
//         //     scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
//         //     scene.fogDensity = 0.05;
//         //     scene.fogColor = new BABYLON.Color3(1,1,1);
//         //
//         //
//         //
//         //     function createSkybox(scene:BABYLON.Scene) {
//         //
//         //         var skybox = BABYLON.Mesh.CreateBox("skyBox", 100.0, scene);
//         //         skybox.checkCollisions=true;
//         //         var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
//         //         skyboxMaterial.backFaceCulling = false;
//         //         skybox.material = skyboxMaterial;
//         //         skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
//         //         skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
//         //         skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("../assets/skybox/skybox", scene,['_px.jpg', '_py.jpg', '_pz.jpg', '_nx.jpg', '_ny.jpg', '_nz.jpg']);
//         //         skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
//         //
//         //
//         //     }
//         //
//         //
//         // }
//         //
//         // //
//         // // function testPeriodicWorldByMerging(mathisFrame:MathisFrame):void{
//         // //
//         // //     let macam = new macamera.GrabberCamera(mathisFrame.scene)
//         // //     macam.changePosition(new XYZ(0,0,-4))
//         // //     macam.FirstGrabber.grabberIsVisible=true
//         // //     macam.attachControl(mathisFrame.canvas)
//         // //
//         // //
//         // //     // Ajout d'une lumière
//         // //     var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(-1, 1, -1), mathisFrame.scene);
//         // //     light0.diffuse = new BABYLON.Color3(1, 1, 1);
//         // //     light0.specular = new BABYLON.Color3(1, 1, 1);
//         // //     light0.groundColor = new BABYLON.Color3(0, 0, 0);
//         // //
//         // //
//         // //     let camPosInWebCoor=new XYZ(0,0,0)
//         // //     let camDomain=new periodicWorld.Domain(0,0,0)
//         // //     let camDomainCenter=new XYZ(0,0,0)
//         // //
//         // //
//         // //     //let oldCamDomain=new periodicWorld.Domain(0,0,0)
//         // //
//         // //
//         // //     let fondamentalDomainSize=2
//         // //     var fd=new periodicWorld.CartesianFundamentalDomain(new XYZ(fondamentalDomainSize,0,0),new XYZ(0,fondamentalDomainSize,0),new XYZ(0,0,fondamentalDomainSize));
//         // //
//         // //
//         // //     // let action= new ActionBeforeRender(()=>{
//         // //     //
//         // //     //     fd.pointToWebCoordinate(macam.trueCamPos.getPosition(), camPosInWebCoor);
//         // //     //     camDomain.whichContains(camPosInWebCoor);
//         // //     //
//         // //     //     camDomain.getCenter(fd, camDomainCenter);
//         // //     //
//         // //     //     /**attention, il faut soutraire en même temps, sinon on a un effet d'aller retour*/
//         // //     //     macam.whishedCamPos.position.substract(camDomainCenter)
//         // //     //     macam.trueCamPos.position.substract(camDomainCenter)
//         // //     //
//         // //     //
//         // //     // })
//         // //
//         // //     //action.frameInterval=1
//         // //     //mathisFrame.actionsBeforeRender['recenter']=action
//         // //
//         // //
//         // //     let rootGameo=new GameoBab()
//         // //
//         // //     let nb=7
//         // //
//         // //     let reseauGen=new reseau.BasisForRegularReseau()
//         // //     reseauGen.end=new XYZ(fondamentalDomainSize,fondamentalDomainSize,0)
//         // //     reseauGen.nbI=nb
//         // //     reseauGen.nbJ=nb
//         // //     reseauGen.nbVerticalDecays=1
//         // //     reseauGen.nbHorizontalDecays=2
//         // //     reseauGen.kComponentTranslation+=0.
//         // //
//         // //     let VV=reseauGen.goChanging()
//         // //
//         // //     cc(VV.Vi,VV.Vj)
//         // //
//         // //
//         // //     function oneReseau(): Mamesh3dStratified{
//         // //         let mamesh3d = new Mamesh3dStratified()
//         // //         let crea = new reseau.Regular3D(mamesh3d)
//         // //         crea.nbI = nb
//         // //         crea.nbJ = nb
//         // //         crea.nbK = nb
//         // //         crea.Vi = VV.Vi//new XYZ(2,0,0)
//         // //         crea.Vj = VV.Vj//new XYZ(0,2,0)
//         // //         crea.Vk = new XYZ(0, 0, fondamentalDomainSize / (nb - 1))
//         // //         crea.makeSquares = false
//         // //         crea.goChanging()
//         // //         return mamesh3d
//         // //     }
//         // //
//         // //
//         // //     let stratified1=oneReseau()
//         // //     let stratified2=oneReseau()
//         // //
//         // //     let ma1=stratified1.toMamesh()
//         // //     let ma2=stratified2.toMamesh()
//         // //
//         // //     ma2.vertices.forEach(v=>{
//         // //         v.position.x+=fondamentalDomainSize
//         // //     })
//         // //
//         // //
//         // //
//         // //         let merger=new mameshModification.Merger(ma1,ma2)
//         // //         merger.mergeSegmentsMiddle=false
//         // //         merger.mergeTrianglesAndSquares=false
//         // //     merger.rebuildParamToVertex=true
//         // //     merger.cleanDoubleLinksKeepingInPriorityThoseWithOpposite=false//TODO
//         // //         merger.goChanging()
//         // //
//         // //     let aa =new linker.OppositeLinkAssocierByAngles(ma1.vertices)
//         // //     aa.goChanging()
//         // //
//         // //
//         // //     ma1.fillLineCatalogue()
//         // //
//         // //     //ma2.fillLineCatalogue()
//         // //     //oneMameshVisual(ma2)
//         // //
//         // //
//         // //
//         // //     // function oneMerge(mesh1,mesh2){
//         // //
//         // //     // }
//         // //     // oneMerge(directional1.iMamesh,directional2.iMamesh)
//         // //     // oneMerge(directional1.jMamesh,directional2.jMamesh)
//         // //     // oneMerge(directional1.kMamesh,directional2.kMamesh)
//         // //     //
//         // //     //
//         // //     //
//         // //     //
//         // //     //
//         // //     //
//         // //     // function oneMameshVisual(mamesh:Mamesh):void{
//         // //     //     let link=new visu3d.LinesGameoMaker(mamesh,scene)
//         // //     //     link.parentGameo=rootGameo
//         // //     //     link.lineOptionFunction=(i,line)=>{
//         // //     //         let res=new visu3d.LineGameoStatic.LineGameoOption()
//         // //     //         res.tesselation=4
//         // //     //         return res
//         // //     //     }
//         // //     //     link.goChanging()
//         // //     // }
//         // //     //
//         // //     // oneMameshVisual(directional1.iMamesh)
//         // //     //
//         // //     //
//         // //     // //  mamesh3d.iMameshes[0].vertices.forEach(v=>v.isInvisible=true)
//         // //     // //  mamesh3d.jMameshes[0].vertices.forEach(v=>v.isInvisible=true)
//         // //     // //  mamesh3d.kMameshes[0].vertices.forEach(v=>v.isInvisible=true)
//         // //     // //
//         // //     // //
//         // //     // // mamesh3d.allMamesh().forEach(IN_mamesh=>{oneMameshVisual(IN_mamesh)})
//         // //     //
//         // //
//         // //
//         // //
//         // //
//         // //     rootGameo.draw()
//         // //
//         // //     //cc(rootGameo.getAllAbstractMeshes())
//         // //
//         // //     let arrete=fd.getArretes(scene)
//         // //
//         // //
//         // //      let mul=new periodicWorld.Multiply(fd,10)
//         // //      arrete.forEach(arr=>{mul.addAbstractMesh(arr)})
//         // //      //mul.addBabGameo(rootGameo)
//         // //
//         // //
//         // //     createSkybox(scene)
//         // //
//         // //
//         // //
//         // //
//         // //
//         // //     function createSkybox(scene:BABYLON.Scene) {
//         // //
//         // //         var skybox = BABYLON.Mesh.CreateBox("skyBox", 100.0, scene);
//         // //         skybox.checkCollisions=true;
//         // //         var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
//         // //         skyboxMaterial.backFaceCulling = false;
//         // //         skybox.material = skyboxMaterial;
//         // //         skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
//         // //         skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
//         // //         skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("../assets/skybox/skybox", scene,['_px.jpg', '_py.jpg', '_pz.jpg', '_nx.jpg', '_ny.jpg', '_nz.jpg']);
//         // //         skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
//         // //
//         // //
//         // //     }
//         // //
//         // //
//         // // }
//         //
//         //
//         // function testFastLinkVisu(mathisFrame:MathisFrame){
//         //     let macam = new macamera.GrabberCamera(mathisFrame.scene)
//         //     macam.changePosition(new XYZ(0,0,-4))
//         //
//         //     macam.FirstGrabber.center=new XYZ(0,0,0)
//         //     macam.FirstGrabber.constantRadius=1
//         //     macam.FirstGrabber.grabberIsVisible=false
//         //
//         //
//         //     macam.attachControl(mathisFrame.canvas)
//         //
//         //
//         //
//         //     // Ajout d'une lumière
//         //     var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(-1, 1, -1), mathisFrame.scene);
//         //     light0.diffuse = new BABYLON.Color3(1, 1, 1);
//         //     light0.specular = new BABYLON.Color3(1, 0.5, 0.5);
//         //     light0.groundColor = new BABYLON.Color3(0, 0, 0);
//         //
//         //
//         //
//         //     let mamesh=new Mamesh()
//         //
//         //
//         //     //new creationFlat.SingleSquare(mamesh).goChanging()
//         //
//         //     new creation3D.Polyhedron(mamesh,creation3D.PolyhedronStatic.Type.Icosahedron).goChanging()
//         //
//         //     // let rota=new MM()
//         //     // geo.axisAngleToMatrix(new XYZ(0,1,1).normalize(),2,rota)
//         //     // mamesh.vertices.forEach(v=>geo.multiplicationMatrixVector(rota,v.position,v.position))
//         //
//         //
//         //
//         //     mamesh.fillLineCatalogue()
//         //
//         //
//         //     let mesh=new BABYLON.Mesh('',scene)
//         //
//         //
//         //     let original=BABYLON.Mesh.CreateCylinder('',1,1,1,4,null,scene)//BABYLON.Mesh.CreateBox('',1,scene)//
//         //     original.convertToFlatShadedMesh()
//         //     let mat=new BABYLON.StandardMaterial('',scene)
//         //     mat.diffuseColor=new BABYLON.Color3(1,0,0)
//         //     original.material=mat
//         //
//         //     let fast=new visu3d.LinesVisuFastMaker(mamesh,scene)
//         //     fast.meshModel=original
//         //     fast.parentNode=mesh
//         //     fast.goChanging()
//         //
//         //
//         //     let surface=new visu3d.SurfaceVisuMaker(mamesh,scene)
//         //     surface.parentNode=mesh
//         //     surface.goChanging()
//         //
//         //     let vertVisu=new visu3d.VerticesViewer(mamesh,scene)
//         //     vertVisu.parentNode=mesh
//         //     vertVisu.goChanging()
//         //
//         //     mesh.rotationQuaternion=new XYZW(0,0,0,1)
//         //     geo.axisAngleToQuaternion(new XYZ(0,0,1),0.5,mesh.rotationQuaternion)
//         //
//         //
//         // }
//         //
//
//         export function testOneGrabber(mathisFrame:MathisFrame,colorBullet:BABYLON.Color3):void{
//
//
//             // let cube=BABYLON.Mesh.CreateBox('1',1/2,scene)
//             let red=new BABYLON.StandardMaterial('',mathisFrame.scene)
//             red.diffuseColor=colorBullet
//             // cube.material=red
//
//             let grabber0=new macamera.SphericalGrabber(mathisFrame.scene)
//             let macam = new macamera.GrabberCamera(mathisFrame,grabber0)
//             macam.useFreeModeWhenCursorOutOfGrabber=false
//             macam.changePosition(new XYZ(0,0,0))
//
//
//             for (let i=0;i<30;i++){
//                 let me=BABYLON.Mesh.CreateSphere('',10,maud/20,mathisFrame.scene)
//                 me.position=new XYZ(2*Math.random()-1,2*Math.random()-1,2*Math.random()-1).normalize().scale(maud)
//                 me.material=red
//
//             }
//
//
//             let mamesh=new Mamesh()
//             let crea=new creation3D.Polyhedron(mamesh,creation3D.PolyhedronStatic.Type.Cube)
//             crea.goChanging()
//
//
//
//             let vertVisu=new visu3d.LinesVisuMaker(mamesh,mathisFrame.scene).goChanging()
//
//
//
//
//
//             // let grabber1=new macamera.Grabber(macam)
//             // grabber1.center=new XYZ(2,0,0)
//             // grabber1.constantRadius=1
//             // grabber1.grabberIsVisible=true
//             // grabber1.name='red'
//             //
//             // let grabber2=new macamera.Grabber(macam)
//             // grabber2.center=new XYZ(-2,0,0)
//             // grabber2.constantRadius=1
//             // grabber2.grabberIsVisible=true
//             // grabber2.name='blue'
//
//
//             //macam.grabbers.push(grabber0,grabber1,grabber2)
//
//             macam.attachControl(mathisFrame.canvas)
//
//
//
//
//
//             // Ajout d'une lumière
//             var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(-1, 1, -1), mathisFrame.scene);
//             light0.diffuse = new BABYLON.Color3(1, 1, 1);
//             light0.specular = new BABYLON.Color3(1, 1, 1);
//             light0.groundColor = new BABYLON.Color3(0, 0, 0);
//
//
//
//
//
//
//
//
//         }
//
//
//
//         class Coordinate{
//
//             X:(u:number,v:number)=>XYZ
//             Xu:(u:number,v:number)=>XYZ
//             Xv:(u:number,v:number)=>XYZ
//             Xuu:(u:number,v:number)=>XYZ
//             Xuv:(u:number,v:number)=>XYZ
//             Xvv:(u:number,v:number)=>XYZ
//
//             /** -1 to inverse orientation*/
//             orientationCoef=+1
//             unit=maud
//
//             private e(u:number,v:number):number{
//                 return geo.dot(this.newN(u,v),this.Xuu(u,v))
//             }
//             private f(u:number,v:number):number{
//                 return geo.dot(this.newN(u,v),this.Xuv(u,v))
//             }
//             private g(u:number,v:number):number{
//                 return geo.dot(this.newN(u,v),this.Xvv(u,v))
//             }
//             private E(u:number,v:number):number{
//                 return geo.dot(this.Xu(u,v),this.Xu(u,v))
//             }
//             private F(u:number,v:number):number{
//                 return geo.dot(this.Xu(u,v),this.Xv(u,v))
//             }
//             private G(u:number,v:number):number{
//                 return geo.dot(this.Xv(u,v),this.Xv(u,v))
//             }
//
//             private dNinTangentBasis(u:number,v:number):M22{
//                 let res=new M22()
//
//                 let e=this.e(u,v)
//                 let f=this.f(u,v)
//                 let g=this.g(u,v)
//                 let E=this.E(u,v)
//                 let F=this.F(u,v)
//                 let G=this.G(u,v)
//
//                 let det=E*G-F*F
//                 res.m11=(f*F-e*G)/det
//                 res.m12=(g*F-f*G)/det
//                 res.m21=(e*F-f*E)/det
//                 res.m22=(f*F-g*E)/det
//
//                 return res
//             }
//
//
//             dNaction(u:number,v:number,vect:XYZ):XYZ{
//
//                 let a=this.dNinTangentBasis(u,v)
//                 let vectUV=this.canonicalToTangentBasis(u,v,vect)
//                 let trans=a.multiplyUV(vectUV)
//                 return this.tagentToCanonicalBasis(u,v,trans)
//
//             }
//
//
//             private canonicalToTangentBasis(u:number,v:number,vect:XYZ):UV{
//
//                 let Xu=this.Xu(u,v)
//                 let Xv=this.Xv(u,v)
//                 let mat=new M22()
//                 mat.m11=Xu.x
//                 mat.m21=Xu.y
//                 mat.m21=Xv.x
//                 mat.m22=Xv.y
//
//                 let inv=mat.inverse()
//
//                 let vect2=new UV(vect.x,vect.y)
//                 return inv.multiplyUV(vect2)
//
//             }
//             private tagentToCanonicalBasis(u:number,v:number,vect:UV):XYZ{
//
//                 let Xu=this.Xu(u,v)
//                 let Xv=this.Xv(u,v)
//                 Xu.scale(vect.u)
//                 Xv.scale(vect.v)
//
//                 return Xu.add(Xv)
//
//             }
//
//
//
//             newN(u:number,v:number):XYZ{
//                 let res=new XYZ(0,0,0)
//                 geo.cross(this.Xu(u,v),this.Xv(u,v),res)
//                 res.normalize().scale(this.unit*this.orientationCoef)
//                 return res
//             }
//
//         }
//
//
//         type TwoMeshes={initial:BABYLON.AbstractMesh,onSphere:BABYLON.AbstractMesh}
//
//         class DrawNormalAndTangentVector{
//
//             coordinate:Coordinate
//             vertices:Vertex[]
//             surfaceScene:BABYLON.Scene
//             sphereScene:BABYLON.Scene
//             cam:GrabberCamera
//             sizes=new XYZ(maud,maud,maud)
//
//             surface:BABYLON.Mesh
//
//             /**out*/
//             //naturalOrientationComesToCam:boolean=null
//
//             constructor(coordinate:Coordinate,
//                         vertices:Vertex[],
//                         scene:BABYLON.Scene,
//                         sphereScene:BABYLON.Scene,
//                         cam:GrabberCamera,
//                         surface:BABYLON.Mesh
//             ){
//                 this.coordinate=coordinate
//                 this.vertices=vertices
//                 this.surfaceScene=scene
//                 this.cam=cam
//                 this.sphereScene=sphereScene
//                 this.surface=surface
//
//             }
//
//
//             findClosestVertex(point:XYZ):Vertex{
//                 let res:Vertex=null
//                 let minDist=Number.MAX_VALUE
//
//                 this.vertices.forEach(v=>{
//                     let dist=geo.distance(v.position,point)
//                     if (dist<minDist) {
//                         minDist=dist
//                         res=v
//                     }
//                 })
//                 return  res
//             }
//
//
//             // findUV(point:XYZ,vertices:Vertex[]):XYZ{
//             //     let res:Vertex=null
//             //     let minDist=Number.MAX_VALUE
//             //
//             //     vertices.forEach(v=>{
//             //         let dist=geo.distance(v.position,point)
//             //         if (dist<minDist) {
//             //             minDist=dist
//             //             res=v
//             //         }
//             //     })
//             //     return  {u:res.}
//             // }
//
//
//             private checkOrientation(u:number,v:number):void{
//                 let pointToCam=XYZ.newFrom(this.cam.trueCamPos.position).substract(this.coordinate.X(u,v))
//                 if (geo.dot(pointToCam,this.coordinate.newN(u,v))<0) this.coordinate.orientationCoef*=-1
//             }
//
//
//
//             // findAndDraw(point:XYZ):void{
//             //     let clickedVertex=this.findClosestVertex(point,this.vertices)
//             //     let u=clickedVertex.mathUV.x
//             //     let v=clickedVertex.mathUV.y
//             //     this.draw(u,v)
//             // }
//
//             arrowColor=new Color3(1,0,0)
//             private oneArrowOnOneScene(point:XYZ,quaternion:XYZW,scene:BABYLON.Scene,sizes:XYZ):BABYLON.Mesh{
//                 let creatorArrowMesh=new ArrowCreator(scene)
//                 //creatorArrowMesh.headUp=this.naturalOrientationComesToCam
//                 let arrow=creatorArrowMesh.goChanging()
//                 arrow.position=point
//                 arrow.rotationQuaternion=quaternion
//                 let mat=new BABYLON.StandardMaterial('',scene)
//                 mat.diffuseColor=this.arrowColor
//                 arrow.material=mat
//                 arrow.scaling=sizes
//                 return arrow
//             }
//
//
//
//             drawNormalVectors(u:number,v:number):TwoMeshes{
//
//                 this.checkOrientation(u,v)
//
//
//                 let positionning=new Positioning()
//                 positionning.upVector=this.coordinate.newN(u,v)
//
//                 let quat=positionning.quaternion()
//
//                 let initial= this.oneArrowOnOneScene(this.coordinate.X(u,v),quat,this.surfaceScene,this.sizes)
//                 let onSphere=this.oneArrowOnOneScene(new XYZ(0,0,0),quat.clone(),this.sphereScene,new XYZ(this.sizes.x,maud,this.sizes.z))
//
//                 return {initial:initial,onSphere:onSphere}
//
//             }
//
//
//             planeColor=new Color3(0,0,1)
//             planeRadius=0.2
//             private oneTangentPlane(normal:XYZ, tangent:XYZ, position:XYZ, scene:BABYLON.Scene, onClick:(xyz:XYZ)=>void=null):BABYLON.Mesh{
//
//                 let res=BABYLON.Mesh.CreateDisc('',this.planeRadius,60,scene)
//                 let qua=new XYZW(0,0,0,0)
//                 geo.aQuaternionMovingABtoCD(new XYZ(0,0,1),new XYZ(1,0,0),normal.scale(-1),tangent,qua,false)
//
//                 res.rotationQuaternion=qua
//                 res.position=position
//
//                 let biMat=new BABYLON.StandardMaterial('',scene)
//                 biMat.sideOrientation=BABYLON.Mesh.DOUBLESIDE
//                 biMat.diffuseColor=this.planeColor
//                 biMat.backFaceCulling=false
//                 res.material=biMat
//
//                 if (onClick!=null){
//                     ;(<any> res).onClick=onClick
//                 }
//
//
//                 return res
//
//             }
//
//
//
//             tangentDiameter=0.1
//             drawOneTangentVector(deb:XYZ,end:XYZ,scene:BABYLON.Scene):AbstractMesh{
//                 let arrowCrea=new ArrowCreator(scene)
//                 //arrowCrea.bodyDiameterProp=
//                 arrowCrea.arrowFootAtOrigin=false
//                 let arrowMesh=arrowCrea.goChanging()
//                 let mat=new StandardMaterial('',scene)
//                 mat.diffuseColor=new Color3(1,0,0)
//                 arrowMesh.material=mat
//                 let elongate=new visu3d.ElongateAMeshFromBeginToEnd(deb,end,arrowMesh)
//                 elongate.diameter=this.tangentDiameter
//                 elongate.goChanging()
//                 return arrowMesh
//             }
//
//
//
//
//             drawTangentPlanes(u:number,v:number,clickOnPlaneNow:boolean):TwoMeshes{
//
//                 this.checkOrientation(u,v)
//
//                 let onClick=null
//                 if (clickOnPlaneNow){
//                     // onClick=(clickXyz:XYZ)=>{
//                     //
//                     //     this.drawOneTangentVector(this.coordinate.X(u,v),clickXyz,this.surfaceScene)
//                     //
//                     //     let tangent=XYZ.newFrom(clickXyz).substract(this.coordinate.X(u,v))
//                     //     let dNtangent=this.coordinate.dNaction(u,v,tangent)
//                     //
//                     //     //TODO dNNuuu
//                     //     let begin=this.coordinate.newN(u,v)
//                     //     let end=XYZ.newFrom(begin).add(dNtangent)
//                     //     this.drawOneTangentVector(begin,end,this.sphereScene)
//                     //
//                     // }
//
//                     this.surface.isPickable=false
//
//                     onClick=(clickXyz:XYZ)=>{
//
//                         this.drawOneTangentVector(this.coordinate.X(u,v),clickXyz,this.surfaceScene)
//
//                         let tangent=XYZ.newFrom(clickXyz).substract(this.coordinate.X(u,v))
//                         let dNtangent=this.coordinate.dNaction(u,v,tangent)
//
//                         //TODO dNNuuu
//                         let begin=this.coordinate.newN(u,v)
//                         let end=XYZ.newFrom(begin).add(dNtangent)
//                         this.drawOneTangentVector(begin,end,this.sphereScene)
//
//                     }
//                 }
//
//
//                 let onSurface=this.oneTangentPlane(this.coordinate.newN(u,v),this.coordinate.Xu(u,v),this.coordinate.X(u,v),this.surfaceScene,onClick)
//                 let onSphere=this.oneTangentPlane(this.coordinate.newN(u,v),this.coordinate.Xu(u,v),this.coordinate.newN(u,v),this.sphereScene)
//
//                 return {initial:onSurface,onSphere:onSphere}
//
//
//             }
//
//
//         }
//
//
//
//
//         class GaussDerivativeMode{
//
//             drawNormalVector:DrawNormalAndTangentVector
//             meshSurf:BABYLON.Mesh
//
//             constructor(drawNormalVector:DrawNormalAndTangentVector,meshSurf:BABYLON.Mesh){
//                 this.drawNormalVector=drawNormalVector
//                 this.meshSurf=meshSurf
//
//                 ;(<any> this.meshSurf).onClick=this.gaussMapDerivativeClick
//
//             }
//
//
//             gaussMapDerivativeClick=(clickedPoint:XYZ)=>{
//                 let clickedVertex=this.drawNormalVector.findClosestVertex(clickedPoint)
//                 let UV=clickedVertex.mathUV
//
//                 this.drawNormalVector.arrowColor=new Color3(0,1,0)
//                 this.drawNormalVector.drawNormalVectors(UV.u,UV.v)
//
//                 this.drawNormalVector.planeRadius=0.2
//                 this.drawNormalVector.drawTangentPlanes(UV.u,UV.v,true)
//             }
//
//         }
//
//
//
//         class GaussDifferenceMode{
//
//             drawNormalVector:DrawNormalAndTangentVector
//             meshSurf:BABYLON.Mesh
//             surfaceMathisFrame:MathisFrame
//             arrowsToDispose:AbstractMesh[]=[]
//             wholeContainer:HTMLElement
//
//             constructor(drawNormalVector:DrawNormalAndTangentVector,meshSurf:BABYLON.Mesh,surfaceMathisFrame:MathisFrame,wholeContainer:HTMLElement){
//                 this.drawNormalVector=drawNormalVector
//                 this.meshSurf=meshSurf
//                 this.surfaceMathisFrame=surfaceMathisFrame
//                 this.wholeContainer=wholeContainer
//
//                 ;(<any> this.meshSurf).onClick=this.firstClick
//
//                 cc('arrowsToDispose',this.arrowsToDispose)
//                
//                 this.addControlButton()
//
//             }
//
//
//             addControlButton(){
//                 cc('in add arrowsToDispose',this.arrowsToDispose)
//
//                 setTimeout(()=>{
//                     cc('in add setTimeout',this.arrowsToDispose)
//
//                     let control=legend('40px',this.wholeContainer,false)
//                     cc('control',control)
//                     let buttonClear=document.createElement('div')
//                     buttonClear.classList.add("controlButtonRelative")
//                     buttonClear.innerHTML="<p>nettoyer</p>"
//                     buttonClear.onclick=()=>{this.clear()}
//                     // buttonClear.style.zIndex="100"
//                     // buttonClear.style.backgroundColor="blue"
//                     control.appendChild(buttonClear)
//                 },10)
//
//
//             }
//
//             clear(){
//                 cc('clear')
//                 cc('arrowsToDispose',this.arrowsToDispose)
//
//                 this.arrowsToDispose.forEach(m=>{
//                     if (m!=null) m.dispose()
//                 })
//             }
//
//
//             firstClick=(clickedPoint:XYZ)=>{
//
//
//                 let clickedVertex=this.drawNormalVector.findClosestVertex(clickedPoint)
//                 let UV=clickedVertex.mathUV
//                 let color=new Color3(0,1,0)
//                 this.drawNormalVector.arrowColor=color
//                 let twoMesh=this.drawNormalVector.drawNormalVectors(UV.u,UV.v)
//                 this.arrowsToDispose.push(twoMesh.initial)
//                 this.arrowsToDispose.push(twoMesh.onSphere)
//
//
//                 ;(<any> this.meshSurf).onClick=(secondClicked:XYZ)=>{
//                     let secondClickedVertex=this.drawNormalVector.findClosestVertex(secondClicked)
//                     let secondUV=secondClickedVertex.mathUV
//                     this.secondClick(UV,secondUV)
//
//                     ;(<any> this.meshSurf).onClick=this.firstClick
//                 }
//
//
//             }
//
//             // gaussMapDerivativeClick=(clickedPoint:XYZ)=>{
//             //     let clickedVertex=this.drawNormalVector.findClosestVertex(clickedPoint)
//             //     let UV=clickedVertex.mathUV
//             //
//             //     this.drawNormalVector.arrowColor=new Color3(0,1,0)
//             //     this.drawNormalVector.drawNormalVectors(UV.x,UV.y)
//             //
//             //     this.drawNormalVector.planeRadius=0.2
//             //     this.drawNormalVector.drawTangentPlanes(UV.x,UV.y,true)
//             // }
//
//
//             secondClick(UVcenter:UV,UVclicked:UV){
//
//                 let coor=  this.drawNormalVector.coordinate
//
//
//                 let alphas:number[]=[]
//                 let pas=0.01
//                 let alpha=0
//                 while (alpha<0.8){
//                     alphas.push(alpha)
//                     alpha+=pas
//                 }
//
//
//                 let count=0
//                 let pointCenter=coor.X(UVcenter.u,UVcenter.v)
//                 // let length=geo.distance(pointCenter,coor.X(UVclicked.x,UVclicked.y))
//
//                 let currentNormal:TwoMeshes=null
//                 let currentDifference:TwoMeshes={initial:null,onSphere:null}
//
//                 let action=new PeriodicActionBeforeRender(()=>{
//
//                     let UVinter=new UV(0,0)
//                     geo.betweenUV(UVclicked,UVcenter,alphas[count],UVinter)
//                     if (currentNormal!=null) {
//                         currentNormal.initial.dispose()
//                         currentNormal.onSphere.dispose()
//                     }
//                     currentNormal=this.drawNormalVector.drawNormalVectors(UVinter.u,UVinter.v)
//                     count++
//
//                     if (currentDifference.initial!=null&&count!=alphas.length+1) {
//                         currentDifference.initial.dispose()
//                         currentDifference.onSphere.dispose()
//                     }
//
//                     /**un peu idiot de créer autant de fléche : 2 que l'on deplacerait suffirait*/
//                     currentDifference.initial=this.drawNormalVector.drawOneTangentVector(pointCenter,coor.X(UVinter.u,UVinter.v),this.drawNormalVector.surfaceScene)
//                     currentDifference.onSphere=this.drawNormalVector.drawOneTangentVector(coor.newN(UVcenter.u,UVcenter.v),coor.newN(UVinter.u,UVinter.v),this.drawNormalVector.sphereScene)
//
//
//
//                     //currentDifference.onSphere=drawOneDifference(sphereFrame.scene,)
//
//                 })
//                 action.nbTimesThisActionMustBeFired=alphas.length+1
//                 action.timeIntervalMilli=3000/alphas.length
//
//
//                 /**to dispose all the last*/
//                 this.arrowsToDispose.push(currentDifference.initial)
//                 this.arrowsToDispose.push(currentDifference.onSphere)
//                 //this.arrowsToDispose.push(currentNormal.initial)
//                 //this.arrowsToDispose.push(currentNormal.onSphere)
//
//                 this.surfaceMathisFrame.pushPeriodicAction(action)
//
//
//             }
//
//
//
//
//
//         }
//
//
//
//
//         class GaussMapMode{
//
//             drawNormalVector:DrawNormalAndTangentVector
//             meshSurf:BABYLON.Mesh
//
//             constructor(drawNormalVector:DrawNormalAndTangentVector,meshSurf:BABYLON.Mesh){
//                 this.drawNormalVector=drawNormalVector
//                 this.meshSurf=meshSurf
//
//                 ;(<any> this.meshSurf).onClick=this.gaussMapClick
//
//             }
//
//
//             gaussMapClick=(clickedPoint:XYZ)=>{
//                 let clickedVertex=this.drawNormalVector.findClosestVertex(clickedPoint)
//                 let UV=clickedVertex.mathUV
//                 let color=new Color3(Math.random(),Math.random(),Math.random())
//                 this.drawNormalVector.arrowColor=color
//                 this.drawNormalVector.drawNormalVectors(UV.u,UV.v)
//                 this.drawNormalVector.planeRadius=0.03
//                 this.drawNormalVector.drawTangentPlanes(UV.u,UV.v,false)
//             }
//
//
//
//
//         }
//
//
//         export function GaussCurvarture(mathisFrame:MathisFrame, sphereFrame:MathisFrame,mainDiv:HTMLElement){
//
//
//             function createGaussSphere(sphereFrame:MathisFrame){
//
//                 var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(-1, 1, -1), sphereFrame.scene);
//                 light0.diffuse = new BABYLON.Color3(1, 1, 1);
//                 light0.specular = new BABYLON.Color3(1, 1, 1);
//                 light0.groundColor = new BABYLON.Color3(0, 0, 0);
//
//                 let grabber=new macamera.SphericalGrabber(sphereFrame.scene,new XYZ(maud,maud,maud))
//                 grabber.endOfZone1=0.5
//                 grabber.endOfZone2=maud
//                 grabber.mesh.visibility=1
//                 let mat=new BABYLON.StandardMaterial('',sphereFrame.scene)
//                 mat.alpha=0.3
//                 mat.diffuseColor=new Color3(1,1,1)
//                 grabber.mesh.material=mat
//
//                 let cam=new macamera.GrabberCamera(sphereFrame,grabber);
//
//             }
//
//
//             var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(-1, 1, -1), mathisFrame.scene);
//             light0.diffuse = new BABYLON.Color3(1, 1, 1);
//             light0.specular = new BABYLON.Color3(1, 1, 1);
//             light0.groundColor = new BABYLON.Color3(0, 0, 0);
//
//             let grabber=new macamera.SphericalGrabber(mathisFrame.scene,new XYZ(maud,maud,maud))
//             grabber.endOfZone1=0.5
//             grabber.endOfZone2=maud
//             grabber.mesh.visibility=0
//
//             let cam=new macamera.GrabberCamera(mathisFrame,grabber);
//             //let camPos=new XYZ(-2,-2,-2)
//             let camPos=new XYZ(0,0,-1.5)
//
//             cam.changePosition(camPos)
//             cam.changeFrontDir(XYZ.newFrom(camPos).scale(-1))
//
//
//             createGaussSphere(sphereFrame)
//
//
//             // let plan=BABYLON.Mesh.CreatePlane('',1,mathisFrame.scene)
//             // let biMat=new BABYLON.StandardMaterial('',mathisFrame.scene)
//             // biMat.sideOrientation=BABYLON.Mesh.DOUBLESIDE
//             // biMat.backFaceCulling=false
//             // plan.material=biMat
//
//
//
//             let mamesh=new Mamesh()
//
//             let coef=0.6
//             let gene=new reseau.BasisForRegularReseau()
//             gene.origin=new XYZ(-maud*coef,-maud*coef,0)
//             gene.end=new XYZ(maud*coef,maud*coef,0)
//             gene.nbI=40+1
//             gene.nbJ=40+1
//
//
//             let crea=new reseau.Regular(mamesh,gene)
//             crea.goChanging()
//
//
//             let coor=new Coordinate()
//             coor.X=(u,v)=>new XYZ(u,v,v*v-u*u)
//             coor.Xu=(u,v)=>new XYZ(1,0,-2*u)
//             coor.Xv=(u,v)=>new XYZ(0,1,2*v)
//
//             coor.Xuu=(u,v)=>new XYZ(0,0,-2)
//             coor.Xuv=(u,v)=>new XYZ(0,0,0)
//             coor.Xvv=(u,v)=>new XYZ(0,0,2)
//
//
//
//             mamesh.vertices.forEach(vert=>{
//                 let u=vert.position.x
//                 let v=vert.position.y
//                 vert.mathUV=new UV(u,v)
//                 vert.position=coor.X(u,v)
//
//             })
//
//
//
//             function lineIsChosen(line:Vertex[],space:number):boolean{
//
//                 let vertOk=true
//                 for (let vert of line){
//                     if (vert.param.x%space!=0 ) {
//                         vertOk=false
//                         break
//                     }
//                 }
//                 let horOk=true
//                 for (let vert of line){
//                     if (vert.param.y%space!=0 ) {
//                         horOk=false
//                         break
//                     }
//                 }
//
//                 return vertOk||horOk
//             }
//
//
//             let lin=new visu3d.LinesVisuMaker(mamesh,mathisFrame.scene)
//             lin.lineOptionFunction=(i,line)=>{
//                 let res=new visu3d.LineGameoStatic.LineVisuOption()
//                 res.drawTheLineIfStraight=lineIsChosen(line,3)
//                 res.color=myFavoriteColors.green
//                 res.constantRadius=0.002
//                 return res
//             }
//             let lineMeshes=lin.goChanging()
//             lineMeshes.forEach(mesh=>mesh.isPickable=false)
//
//
//             let surf=new visu3d.SurfaceVisuMaker(mamesh,mathisFrame.scene)
//             let meshSurf=surf.goChanging()
//
//
//
//             // let positioningsMaker=new visu3d.PositioningComputerForMameshVertices(mamesh);
//             // positioningsMaker.sizesProp=new XYZ(0.5,0.5,0.5);
//             //let positionnings=positioningsMaker.goChanging()
//
//
//
//             let drawNormalVector=new DrawNormalAndTangentVector(coor,
//                 mamesh.vertices,
//                 mathisFrame.scene,
//                 sphereFrame.scene,
//                 cam,
//                 meshSurf
//             )
//             drawNormalVector.sizes=new XYZ(0.1,0.1,0.1)
//
//
//             //let wholeContainer=document.body
//             enum Mode{gaussMap,gaussDifferenceMode,gaussMapDerivative}
//             let mode=Mode.gaussDifferenceMode
//             if (mode==Mode.gaussMap) new GaussMapMode(drawNormalVector,meshSurf)
//             else if (mode==Mode.gaussMapDerivative) new GaussDerivativeMode(drawNormalVector,meshSurf)
//             else if (mode==Mode.gaussDifferenceMode)  new GaussDifferenceMode(drawNormalVector,meshSurf,mathisFrame,mainDiv)
//
//             //
//             // ;(<any> meshSurf).onClick=(clickedPoint:XYZ)=>{
//             //
//             //     clickCount++
//             //
//             //
//             //     if (mode==Mode.gaussMap) gaussMapMode(clickedPoint)
//             //     else if (mode==Mode.gaussDrivative) gaussDrivativeMode(clickedPoint)
//             //
//             //     // let clickedVertex=drawNormalVector.findClosestVertex(clickedPoint,mamesh.vertices)
//             //     // let UV=clickedVertex.mathUV
//             //     //
//             //     // let color=new Color3(Math.random(),Math.random(),Math.random())
//             //     // drawNormalVector.arrowColor=color
//             //     // drawNormalVector.drawNormalVectors(UV.x,UV.y)
//             //     // UVs.push(UV)
//             //     //
//             //     // drawNormalVector.planeRadius=0.03
//             //     // drawNormalVector.drawTangentPlanes(UV.x,UV.y,false)
//             //
//             //     // if (mode==Mode.approachDerivation){
//             //     //     if (clickCount%2==0){
//             //     //         approachDerivation(UVs[UVs.length-2],UVs[UVs.length-1],coor,mathisFrame,sphereFrame,drawNormalVector)
//             //     //     }
//             //     // }
//             //
//             // }
//             //
//
//
//
//             // let action=new PeriodicActionBeforeRender(()=>{
//             //     // let UVinter=new XYZ(0,0,0)
//             //     // geo.between(UVs[1],UVs[0],alphas[count],UVinter)
//             //     // drawNormalVector.draw(UVinter.x,UVinter.y)
//             //     // count++
//             //     cc('count')
//             // })
//             // action.nbTimesThisActionMustBeFired=3
//             // action.timeIntervalMilli=500
//             // mathisFrame.pushPeriodicAction(action)
//
//
//
//
//
//
//
//
//
//         }
//
//
//
//         //
//         // function testMultGrabber(mathisFrame:MathisFrame):void{
//         //
//         //
//         //     let macam = new macamera.GrabberCamera(mathisFrame.scene)
//         //     macam.changePosition(new XYZ(0,0,-4))
//         //
//         //     let grabber0=new macamera.Grabber(macam)
//         //     grabber0.center=new XYZ(0,0,0)
//         //     grabber0.constantRadius=1
//         //     grabber0.grabberIsVisible=true
//         //     grabber0.name='green'
//         //
//         //     let grabber1=new macamera.Grabber(macam)
//         //     grabber1.center=new XYZ(2,0,0)
//         //     grabber1.constantRadius=1
//         //     grabber1.grabberIsVisible=true
//         //     grabber1.name='red'
//         //
//         //     let grabber2=new macamera.Grabber(macam)
//         //     grabber2.center=new XYZ(-2,0,0)
//         //     grabber2.constantRadius=1
//         //     grabber2.grabberIsVisible=true
//         //     grabber2.name='blue'
//         //
//         //
//         //     macam.grabbers.push(grabber0,grabber1,grabber2)
//         //
//         //     macam.attachControl(mathisFrame.canvas)
//         //
//         //
//         //
//         //
//         //
//         //     // Ajout d'une lumière
//         //     var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(-1, 1, -1), mathisFrame.scene);
//         //     light0.diffuse = new BABYLON.Color3(1, 1, 1);
//         //     light0.specular = new BABYLON.Color3(1, 1, 1);
//         //     light0.groundColor = new BABYLON.Color3(0, 0, 0);
//         //
//         //
//         //
//         //
//         //
//         //
//         //
//         //
//         // }
//
//
//
//     }
//
//
//
//
//
// }