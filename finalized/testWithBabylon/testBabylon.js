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
//             secondFrame.go()
//             testOneGrabber(secondFrame,new BABYLON.Color3(1,0,0))
//
//
//             var starter=new mathis.MathisFrame()
//             starter.canvas=canvass[1]
//             starter.go()
//             testOneGrabber(starter,new BABYLON.Color3(0,0,1))
//
//
//         }
//
//
//         export function start(){
//             let mainDiv:HTMLElement=document.getElementById("mainDiv");
//
//
//             let canvass=mathis.nCanvasInOneLine(1,mainDiv)
//
//             let mathisFrame =new MathisFrame()
//             mathisFrame.canvas=canvass[0]
//             mathisFrame.go()
//
//           
//
//             {
//
//                 let infi=new infiniteWorlds.InfiniteCartesian(mathisFrame)
//
//                 infi.nbRepetition=8
//                 infi.nbSubdivision=3
//                 infi.fondamentalDomainSize=60
//                 infi.nbHorizontalDecays=1
//                 infi.nbVerticalDecays=1
//
//                 infi.squareVersusSemiVersusTri=0
//
//
//                 let mesh=BABYLON.Mesh.CreateSphere('',5,10,mathisFrame.scene)
//                 //let mesh=BABYLON.Mesh.CreateBox('',1,mathisFrame.scene)
//                 mesh.position=new XYZ(1,1,1)
//
//
//                 infi.population.push(mesh)
//
//                 infi.go()
//
//                 //infi.seeWorldFromOutside()
//                 infi.seeWorldFromInside()
//                 //
//                 //setTimeout(()=>{infi.seeWorldFromInside()},5000)
//
//
//             }
//
//            
//
//
//         }
//
//
//
//         function reseau3d(mathisFrame:MathisFrame){
//             let grabber0 = new macamera.SphericalGrabber(mathisFrame.scene)
//             let cam = new macamera.GrabberCamera(mathisFrame, grabber0)
//
//
//             // cam.translationSpeed=4
//             // cam.useOnlyFreeMode=true
//             // cam.changePosition(new XYZ(0.5,1,3))
//             // cam.changeFrontDir(new XYZ(-0.5,-1,1.5))
//             // cam.checkCollisions=true
//             //
//             cam.attachControl(mathisFrame.canvas)
//
//
//             // Ajout d'une lumière
//             var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(-1, 1, -1), mathisFrame.scene);
//             light0.diffuse = new BABYLON.Color3(1,1,1);
//             light0.specular = new BABYLON.Color3(0.,0.,0.);
//             light0.groundColor = new BABYLON.Color3(0, 0, 0.3);
//
//             let crea = new reseau.Regular3D()
//             crea.strateHaveSquareMailleVersusTriangleMaille=false
//             let mamesh=crea.go()
//
//             mamesh.fillLineCatalogue()
//
//
//
//             function lineVisu(ma:Mamesh,segmentSelectionFunction){
//                 let model=BABYLON.Mesh.CreateBox('',1,mathisFrame.scene)//BABYLON.Mesh.CreateCylinder('',1,0.2,0.2,4,null,scene)
//                 let material=new BABYLON.StandardMaterial('',mathisFrame.scene)
//                 material.diffuseColor=new BABYLON.Color3(0.6,0.6,0.6)
//                 //material.diffuseTexture = wallDiffuseTexture;
//                 model.material=material
//                 model.convertToFlatShadedMesh()
//
//                 let lineMak=new visu3d.LinksViewer(ma,mathisFrame.scene)
//                 lineMak.diameter=0.2
//                 /**collision sur les poutres pas terrible*/
//                 lineMak.checkCollision=false
//                 lineMak.meshModel=model
//                 lineMak.segmentSelectionFunction=segmentSelectionFunction
//                 let vec100=new XYZ(1,0,0)
//                 let vec010=new XYZ(0,1,0)
//                 lineMak.pairVertexToLateralDirection=(v1,v2)=>{
//                     if ( Math.abs(geo.dot(XYZ.newFrom(v1.position).substract(v2.position),vec100))<0.0001) return vec100
//                     else return vec010
//                         }
//                 lineMak.go()
//             }
//
//             lineVisu(mamesh,null)
//
//             cc(mamesh.toString())
//
//
//             let surfacer=new visu3d.SurfaceViewer(mamesh,mathisFrame.scene)
//             surfacer.go()
//
//
//
//
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
//         function testOneSurface(mathisFrame:MathisFrame){
//
//             // Ajout d'une lumière
//             var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(-1, 1, -1), mathisFrame.scene);
//             light0.diffuse = new BABYLON.Color3(1, 1, 1);
//             light0.specular = new BABYLON.Color3(1, 0.5, 0.5);
//             light0.groundColor = new BABYLON.Color3(0, 0, 0);
//            
//             let grabber=new macamera.SphericalGrabber(mathisFrame.scene)
//             mathisFrame.camera=new macamera.GrabberCamera(mathisFrame,grabber)
//
//             let surfaceMaker=new riemann.SurfaceMaker(riemann.SurfaceName.cylinder)
//             let surface=surfaceMaker.go()
//             surface.drawTheWholeSurface(mathisFrame.scene)
//         }
//
//
//
//
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
//         //     // let IN_mamesh=new Mamesh()
//         //     // let cre=new reseau.Regular(IN_mamesh)
//         //     // cre.go()
//         //     //
//         //     // linkModule.checkTheRegularityOfAGRaph(IN_mamesh.vertices)
//         //     //
//         //     //IN_mamesh.fillLineCatalogue()
//         //
//         //
//         //
//         //     let IN_mamesh=new Mamesh3dStratified()
//         //
//         //     let twoGe=new reseau.BasisForRegularReseau()
//         //     twoGe.nbHorizontalDecays=1
//         //     let res=twoGe.go()
//         //
//         //
//         //     let crea=new reseau.Regular3D(IN_mamesh)
//         //     crea.Vi=res.Vi
//         //     crea.Vj=res.Vj
//         //     crea.createIMameshes=true
//         //     crea.createJMameshes=true
//         //     crea.go()
//         //
//         //     IN_mamesh.fillLineCatalogueOfStrates()
//         //
//         //     IN_mamesh.kMameshes.forEach(mamesh2d=>{
//         //         cc(mamesh2d.toString(true))
//         //         let aaa=new visu3d.LinesVisuFastMaker(mamesh2d,scene)
//         //         aaa.go()
//         //
//         //
//         //
//         //         let verGa=new visu3d.VerticesViewer(mamesh2d,scene)
//         //         verGa.go()
//         //
//         //     })
//         //
//         //     IN_mamesh.iMameshes.forEach(mamesh2d=>{
//         //         cc(mamesh2d.toString(true))
//         //         let aaa=new visu3d.LinesVisuFastMaker(mamesh2d,scene)
//         //         aaa.go()
//         //
//         //
//         //
//         //     })
//         //
//         //     IN_mamesh.jMameshes.forEach(mamesh2d=>{
//         //         cc(mamesh2d.toString(true))
//         //         let aaa=new visu3d.LinesVisuFastMaker(mamesh2d,scene)
//         //         aaa.go()
//         //
//         //     })
//         //
//         //
//         // }
//         //
//         //
//         //
//
//         function testPeriodicWorldByLargeResau(mathisFrame:MathisFrame):void{
//
//
//             let useMacamera=true
//
//
//             let cam
//
//             if (useMacamera) {
//                 let grabber0 = new macamera.SphericalGrabber(mathisFrame.scene)
//                 grabber0.focusOnMyCenterWhenCameraGoDownWard = false
//                 grabber0.mesh.visibility = 0//TODO faire un grabber sans forcement de mesh
//                 //grabber0.showGrabberOnlyWhenGrabbing
//
//                 cam = new macamera.GrabberCamera(mathisFrame, grabber0)
//
//                 cam.translationSpeed=3
//                 cam.useOnlyFreeMode=true
//                 cam.changePosition(new XYZ(0.5,1,3).scale(1.5))
//                 cam.changeFrontDir(new XYZ(-0.5,-1,1.5))
//
//                 cam.keysFrontward =[66, 78];
//                 cam.keysBackward =[32];
//
//
//                 cam.attachControl(mathisFrame.canvas)
//
//             }
//             else {
//                 cam = new BABYLON.FreeCamera('', new BABYLON.Vector3(1, 0.5, 1), mathisFrame.scene)
//                 cam.speed *= 0.2
//             }
//
//             cam.checkCollisions = true
//             //
//
//
//             // Ajout d'une lumière
//             var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(-1, 1, -1), mathisFrame.scene);
//             light0.diffuse = new BABYLON.Color3(1,1,1);
//             light0.specular = new BABYLON.Color3(0.,0.,0.);
//             light0.groundColor = new BABYLON.Color3(0, 0, 0.3);
//
//
//             let camPosInWebCoor=new XYZ(0,0,0)
//             let camDomain=new periodicWorld.Domain(0,0,0)
//             let camDomainCenter=new XYZ(0,0,0)
//             let fondamentalDomainSize=9
//             let nbSubdivision=3
//             let nbRepetition=6
//
//             if (useMacamera) {
//                 var fd = new periodicWorld.CartesianFundamentalDomain(new XYZ(fondamentalDomainSize, 0, 0), new XYZ(0, fondamentalDomainSize, 0), new XYZ(0, 0, fondamentalDomainSize));
//                 cam.onTranslate = ()=> {
//
//                     fd.pointToWebCoordinate(cam.trueCamPos.position, camPosInWebCoor);
//                     camDomain.whichContains(camPosInWebCoor);
//                     camDomain.getCenter(fd, camDomainCenter);
//
//                     /**attention, il fautchnager simultanément la truePosition et la wished position. Donc mettre le smoothing à false*/
//                     cam.changePosition(cam.whishedCamPos.getPosition().substract(camDomainCenter), false)
//                     //cam.changePosition(cam.trueCamPos.getPosition().substract(camDomainCenter))
//
//                 }
//             }
//
//
//
//
//             let reseauGen=new reseau.BasisForRegularReseau()
//             reseauGen.end=new XYZ(fondamentalDomainSize,fondamentalDomainSize,0)
//             reseauGen.nbI=nbSubdivision
//             reseauGen.nbJ=nbSubdivision
//             reseauGen.nbVerticalDecays=0
//             reseauGen.nbHorizontalDecays=0
//             reseauGen.kComponentTranslation+=0
//             let VV=reseauGen.go()
//
//
//
//             function theReseau(nbRepetitions): Mamesh{
//
//                 let crea = new reseau.Regular3D()
//                 crea.nbI = nbSubdivision*nbRepetitions
//                 crea.nbJ = nbSubdivision*nbRepetitions
//                 crea.nbK = nbSubdivision*nbRepetitions
//                 crea.Vi = VV.Vi
//                 crea.Vj = VV.Vj
//                 crea.Vk = new XYZ(0, 0, fondamentalDomainSize / (nbSubdivision - 1))
//                 let totalSize=nbSubdivision*nbRepetitions*VV.Vi.length()
//                 crea.origine=new XYZ(-totalSize/2,-totalSize/2,-totalSize/2)
//                 crea.putAVertexOnlyAtXYZCheckingThisCondition=(xyz)=>xyz.length()<(totalSize/2*1.1)
//                 return crea.go()
//             }
//
//             let mamesh=theReseau(nbRepetition)
//             mamesh.fillLineCatalogue()
//
//             // let ma1=stratified1.toMamesh()
//             // ma1.fillLineCatalogue()
//
//             //ma2.fillLineCatalogue()
//             //oneMameshVisual(ma2)
//
//
//             var wallDiffuseTexture  = new BABYLON.Texture('../assets/texture/escher.jpg', mathisFrame.scene);
//             //var wallNormalsHeightTexture = new BABYLON.Texture('../assets/texture/GtIUsWW.png', scene);
//
//
//             function lineVisu(ma:Mamesh,segmentSelectionFunction){
//                 let model=BABYLON.Mesh.CreateBox('',1,mathisFrame.scene)//BABYLON.Mesh.CreateCylinder('',1,0.2,0.2,4,null,scene)
//                 let material=new BABYLON.StandardMaterial('',mathisFrame.scene)
//                 material.diffuseColor=new BABYLON.Color3(0.6,0.6,0.6)
//                 material.diffuseTexture = wallDiffuseTexture;
//                 model.material=material
//                 model.convertToFlatShadedMesh()
//
//                 let lineMak=new visu3d.LinksViewer(ma,mathisFrame.scene)
//                 lineMak.diameter=0.2
//                 /**collision sur les poutres pas terrible*/
//                 lineMak.checkCollision=false
//                 lineMak.meshModel=model
//                 lineMak.segmentSelectionFunction=segmentSelectionFunction
//                 let vec100=new XYZ(1,0,0)
//                 let vec010=new XYZ(0,1,0)
//                 lineMak.pairVertexToLateralDirection=(v1,v2)=>{
//                     if ( Math.abs(geo.dot(XYZ.newFrom(v1.position).substract(v2.position),vec100))<0.0001) return vec100
//                     else return vec010
//                 }
//                 lineMak.go()
//             }
//
//
//
//             function vertexVisu(mamesh2:Mamesh){
//                 let model=BABYLON.Mesh.CreateBox('',0.5,mathisFrame.scene)
//                 let material=new BABYLON.StandardMaterial('',mathisFrame.scene)
//                 material.diffuseTexture = wallDiffuseTexture;
//                 //material.bumpTexture = wallNormalsHeightTexture;
//                 //material.useParallax = true;
//                 // material.useParallaxOcclusion = true;
//                 // material.parallaxScaleBias = 0.1;
//                 //material.specularPower = 1000.0;
//                 //material.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5);
//
//                 //mat.diffuseColor=col
//                 model.material=material
//                 //model.checkCollisions=true
//                 model.convertToFlatShadedMesh()
//                 let verticesVisuMaker=new visu3d.VerticesViewer(mamesh2,mathisFrame.scene)
//                 verticesVisuMaker.meshModel=model
//                 verticesVisuMaker.checkCollision=true
//                 let positioning=new Positioning()
//                 positioning.upVector=new XYZ(1,0,0)
//                 positioning.frontDir=new XYZ(0,1,0)
//                 verticesVisuMaker.vertexToPositioning=new HashMap<Vertex,Positioning>()
//                 for (let v of mamesh2.vertices) verticesVisuMaker.vertexToPositioning.putValue(v,positioning)
//                 verticesVisuMaker.go()
//             }
//
//             lineVisu(mamesh,null)
//             vertexVisu(mamesh)
//             //
//             // let count=0
//             //
//             // stratified1.kMameshes.forEach(ma=>{
//             //     count+=ma.vertices.length
//             //     lineVisu(ma,null)
//             //     vertexVisu(ma)
//             // })
//             //
//             // cc('nb vertice drawn:',count,'<',Math.pow(nbSubdivision*nbRepetition,3))
//             //
//             //
//             // let onlyVerticalFonc=(i:number,segment:Vertex[])=>{
//             //     return (segment[0].param.x==segment[1].param.x&& segment[0].param.y==segment[1].param.y)
//             // }
//             // stratified1.iMameshes.forEach(ma=>{
//             //     lineVisu(ma,onlyVerticalFonc)
//             // })
//
//
//             // stratified1.jMameshes.forEach(ma=>{
//             //     lineVisu(ma,new BABYLON.Color3(0,1,0))
//             // })
//             // stratified1.kMameshes.forEach(ma=>{
//             //     lineVisu(ma,new BABYLON.Color3(0,0,1))
//             // })
//
//
//
//
//
//
//             // function oneMerge(mesh1,mesh2){
//
//             // }
//             // oneMerge(directional1.iMamesh,directional2.iMamesh)
//             // oneMerge(directional1.jMamesh,directional2.jMamesh)
//             // oneMerge(directional1.kMamesh,directional2.kMamesh)
//             //
//             //
//             //
//             //
//             //
//             //
//             // function oneMameshVisual(IN_mamesh:Mamesh):void{
//             //     let link=new visu3d.LinesGameoMaker(IN_mamesh,scene)
//             //     link.parentGameo=rootGameo
//             //     link.lineOptionFunction=(i,line)=>{
//             //         let res=new visu3d.LineGameoStatic.LineGameoOption()
//             //         res.tesselation=4
//             //         return res
//             //     }
//             //     link.go()
//             // }
//             //
//             // oneMameshVisual(directional1.iMamesh)
//             //
//             //
//             // //  mamesh3d.iMameshes[0].vertices.forEach(v=>v.isInvisible=true)
//             // //  mamesh3d.jMameshes[0].vertices.forEach(v=>v.isInvisible=true)
//             // //  mamesh3d.kMameshes[0].vertices.forEach(v=>v.isInvisible=true)
//             // //
//             // //
//             // // mamesh3d.allMamesh().forEach(IN_mamesh=>{oneMameshVisual(IN_mamesh)})
//             //
//
//
//
//
//             //
//             // let arrete=fd.getArretes(scene)
//             //
//             //
//             // let mul=new periodicWorld.Multiply(fd,10)
//             // arrete.forEach(arr=>{mul.addAbstractMesh(arr)})
//             // //mul.addBabGameo(rootGameo)
//             //
//             //
//             // createSkybox(scene)
//
//
//             createSkybox(mathisFrame.scene)
//
//             mathisFrame.scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
//             mathisFrame.scene.fogDensity = 0.05;
//             mathisFrame.scene.fogColor = new BABYLON.Color3(1,1,1);
//
//
//
//             function createSkybox(scene:BABYLON.Scene) {
//
//                 var skybox = BABYLON.Mesh.CreateBox("skyBox", 100.0, scene);
//                 skybox.checkCollisions=true;
//                 var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
//                 skyboxMaterial.backFaceCulling = false;
//                 skybox.material = skyboxMaterial;
//                 skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
//                 skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
//                 skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("../assets/skybox/skybox", scene,['_px.jpg', '_py.jpg', '_pz.jpg', '_nx.jpg', '_ny.jpg', '_nz.jpg']);
//                 skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
//
//
//             }
//
//
//         }
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
//         // //     let VV=reseauGen.go()
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
//         // //         crea.go()
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
//         // //         merger.go()
//         // //
//         // //     let aa =new linkModule.OppositeLinkAssocierByAngles(ma1.vertices)
//         // //     aa.go()
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
//         // //     // function oneMameshVisual(IN_mamesh:Mamesh):void{
//         // //     //     let link=new visu3d.LinesGameoMaker(IN_mamesh,scene)
//         // //     //     link.parentGameo=rootGameo
//         // //     //     link.lineOptionFunction=(i,line)=>{
//         // //     //         let res=new visu3d.LineGameoStatic.LineGameoOption()
//         // //     //         res.tesselation=4
//         // //     //         return res
//         // //     //     }
//         // //     //     link.go()
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
//
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
//             crea.go()
//
//
//
//             let vertVisu=new visu3d.LinesVisuMaker(mamesh,mathisFrame.scene).go()
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
//
//
//
//
//
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
