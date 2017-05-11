// /**
//  * Created by vigon on 14/03/2016.
//  */
//
//
//
//
// module mathis {
//
//     export module siteAgreg {
//
//
//         export function start(){
//
//             let choice=Math.floor(Math.random()*3)
//
//             if (choice==0) severalVectorField(document.getElementById("platonic"))
//             else if (choice==1) severalPolyhedron(document.getElementById("platonic"))
//             else if (choice==2) severalIsings(document.getElementById("platonic"))
//
//
//         }
//
//
//         //
//         //
//         // function platonicBottomLegend(mathisFrame:MathisFrame):void{
//         //
//         //     let bottomStripe=document.createElement("div")
//         //     bottomStripe.id="bottomStripe"
//         //
//         //
//         //     let labelsUnder:HTMLElement[]=[]
//         //     for (let i=0;i<5;i++){
//         //         let labelUnder=document.createElement("div")
//         //         labelUnder.className="labelUnder"
//         //         bottomStripe.appendChild(labelUnder)
//         //         labelsUnder[i]=labelUnder
//         //     }
//         //
//         //     labelsUnder[0].innerHTML="T  <sub>d</sub>(T)"
//         //     let inner2="O<sub>h</sub>(O)"
//         //     labelsUnder[1].innerHTML=inner2
//         //     labelsUnder[2].innerHTML=inner2
//         //     let inner3="I<sub>h</sub>(I)"
//         //     labelsUnder[3].innerHTML=inner3
//         //     labelsUnder[4].innerHTML=inner3
//         //
//         //     mathisFrame.canvasContainer.appendChild(bottomStripe)
//         //
//         // }
//
//
//
//         //
//         // function scenePlatonic(mathisFrame:MathisFrame):void {
//         //
//         //
//         //     var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(-1, 0, -0.7), mathisFrame.scene);
//         //     light0.diffuse = new BABYLON.Color3(1, 1, 1);
//         //     light0.specular = new BABYLON.Color3(0.5, 0.5, 0.5);
//         //     light0.groundColor = new BABYLON.Color3(0, 0, 0);
//         //
//         //
//         //     function oneCamInAFamily(decal:number,index:number,nbCam:number):macamera.GrabberCamera{
//         //
//         //         let grabber=new macamera.SphericalGrabber(mathisFrame.scene,new XYZ(maud,maud,maud),new XYZ(decal,0,0))
//         //         grabber.endOfZone1=0
//         //         grabber.endOfZone2=0
//         //         let macam = new macamera.GrabberCamera(mathisFrame,grabber)
//         //         macam.changePosition(new XYZ(decal,0,-4),false)
//         //         macam.useFreeModeWhenCursorOutOfGrabber=false
//         //         macam.camera.viewport=new BABYLON.Viewport(index/nbCam,0,1/nbCam,1)
//         //
//         //         macam.attachControl(mathisFrame.canvas)
//         //         return macam
//         //     }
//         //
//         //
//         //     let decals=[0,1000,2000,3000,4000]
//         //     let allCam=[]
//         //
//         //
//         //     for (let i=0;i<decals.length;i++){
//         //         let cam=oneCamInAFamily(decals[i],i,decals.length)
//         //         allCam.push(cam)
//         //         mathisFrame.scene.activeCameras.push(cam.camera)
//         //
//         //     }
//         //
//         //
//         //
//         //     let Tetrahedron =polyhedron(creation3D.PolyhedronStatic.Type.Tetrahedron,mathisFrame.scene)
//         //     Tetrahedron.position.x=decals[0]
//         //
//         //     let Cube =polyhedron(creation3D.PolyhedronStatic.Type.Cube,mathisFrame.scene)
//         //     Cube.position.x=decals[1]
//         //
//         //     let Octahedron =polyhedron(creation3D.PolyhedronStatic.Type.Octahedron,mathisFrame.scene)
//         //     Octahedron.position.x=decals[2]
//         //
//         //     let dodeca =polyhedron(creation3D.PolyhedronStatic.Type.Dodecahedron,mathisFrame.scene)
//         //     dodeca.position.x=decals[3]
//         //
//         //     let Icosahedron =polyhedron(creation3D.PolyhedronStatic.Type.Icosahedron,mathisFrame.scene)
//         //     Icosahedron.position.x=decals[4]
//         //
//         //
//         // }
//
//
//         function upLegend(innerHTML:string, agregTextName:string, mainDiv:HTMLElement) {
//
//             let $explanation = document.createElement('div')
//             mainDiv.appendChild($explanation)
//             $explanation.style.display = "inline-block"
//             $explanation.style.position = "absolute"
//             $explanation.style.left = "0"
//             $explanation.style.width = "100%"
//             $explanation.style.height="30px"
//             $explanation.style.top = "0"
//             $explanation.style.backgroundColor = "indianred"
//             $explanation.style.zIndex = "9"
//             $explanation.style.textAlign = "center"
//             $explanation.innerHTML = innerHTML
//             //$explanation.textContent="plus beta est grand, et plus les particules de même couleur s'atirent"
//
//             let associatedAgregText = document.createElement('span')
//             associatedAgregText.style.height = "30px"
//             associatedAgregText.textContent = "(cliquez ici pour voir un texte de modélisation associé)"
//             associatedAgregText.classList.add("clickable")
//
//             $explanation.appendChild(associatedAgregText)
//             associatedAgregText.onclick = ()=> {
//                 window.open('agregAssets/'+agregTextName);
//             }
//
//
//             //let upLegend=legend("30px",mainDiv,false)
//             let plus = document.createElement('div')
//             mainDiv.appendChild(plus)
//             plus.style.display = "inline-block"
//             plus.style.position = "absolute"
//             plus.style.top = "0"
//             plus.style.right = "0"
//             plus.style.width = "30px"
//             plus.style.height = "30px"
//             plus.style.lineHeight = "30px"
//             plus.style.backgroundColor = "indianred"
//             plus.style.zIndex = "10"
//             plus.style.textAlign = "center"
//             plus.textContent = "+"
//             plus.style.fontSize = "large"
//             plus.classList.add("clickable")
//
//
//             function showExplanations():void {
//                 $explanation.style.visibility = "visible"
//                 plus.textContent = "-"
//                 plus.onclick = ()=> {
//                     hideExplanations()
//                 }
//                 //mainDiv.onclick=hideExplanations
//
//             }
//
//             function hideExplanations():void {
//                 $explanation.style.visibility = "hidden"
//                 plus.textContent = "+"
//                 plus.onclick = ()=> {
//                     showExplanations()
//                 }
//                 //mainDiv.onclick=null
//             }
//
//             hideExplanations()
//         }
//
//         function severalVectorField(mainDiv:HTMLElement):void{
//
//             function oneVectorField(width:number,height:number,origin:XYZ,vectorField:(t:number, p:XYZ,res:XYZ)=>void,departure:XYZ,mathisFrame:MathisFrame):void{
//
//
//                 let maxPathSegment=500
//                 let deltaT=0.1
//
//
//
//                 /**Camera and plan for click*/
//                 let planForClick:BABYLON.Mesh
//                 {
//
//                     planForClick = BABYLON.Mesh.CreatePlane('', 1, mathisFrame.scene)
//                     planForClick.scaling = new XYZ(width, height, 0)
//                     /**doit être derriere le grabber, sinon il masque ce dernier
//                      * doit être devant les fléches*/
//                     planForClick.position = new XYZ(0, 0, 0.06)
//                     planForClick.bakeCurrentTransformIntoVertices();
//                     planForClick.visibility=0
//
//                     let grabber=new macamera.PlanarGrabber(mathisFrame.scene,new XYZ(width,height,0.061))
//                     grabber.mesh.visibility=0
//                     let macam = new macamera.GrabberCamera(mathisFrame,grabber)
//                     macam.checkCollisions = false
//                     macam.useFreeModeWhenCursorOutOfGrabber=false
//                     macam.changePosition(new XYZ(0,0,-2),false)
//                     macam.attachControl(mathisFrame.canvas)
//
//
//
//
//                     let light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(-1, 1, -1), mathisFrame.scene);
//                     light0.diffuse = new BABYLON.Color3(0.5, 0.5, 0.5);
//                     light0.specular = new BABYLON.Color3(0.7, 0.7, 0.7);
//                     light0.groundColor = new BABYLON.Color3(1, 1, 1);
//
//
//                 }
//
//                 let mamesh
//                 let positionings:HashMap<Vertex,Positioning>
//                 {
//                     let generator = new reseau.BasisForRegularReseau()
//                     generator.nbI = 30
//                     generator.nbJ = 10
//                     generator.origin = origin
//                     generator.end = new XYZ(width / 2, height / 2, 0)
//
//                     let regCrea = new reseau.Regular(generator)
//                     regCrea.squareVersusTriangleMaille = false
//                     mamesh=regCrea.go()
//
//                     let posiComp=new mameshAroundComputations.PositioningComputerForMameshVertices(mamesh)
//                     /**tangents are given by the vector field*/
//                     posiComp.computeTangent=false
//                     posiComp.sizesProp=new XYZ(0.15,0.15,0.15)
//                     positionings=posiComp.go()
//                 }
//
//
//
//
//
//
//                 {
//
//                     /**path init*/
//                     var path:XYZ[] = []
//
//                     let arrowModel =BABYLON.Mesh.CreateCylinder('',2,0,1,6,null,mathisFrame.scene)
//                     let qua=new XYZW(0,0,0,0)
//                     geo.axisAngleToQuaternion(new XYZ(0,0,1),-Math.PI/2,qua)
//                     arrowModel.rotationQuaternion=qua
//                     arrowModel.bakeCurrentTransformIntoVertices()
//                     let mat=new BABYLON.StandardMaterial('',mathisFrame.scene)
//                     mat.diffuseColor=new BABYLON.Color3(0,0,1)
//                     arrowModel.material=mat
//
//
//                     let serpentRadius=0.03
//                     for (let i=0;i<maxPathSegment;i++) path.push(departure)
//                     var serpentMesh=BABYLON.Mesh.CreateTube('',path,serpentRadius,10,null,BABYLON.Mesh.CAP_ALL,mathisFrame.scene,true)
//                     let green=new BABYLON.StandardMaterial('',mathisFrame.scene)
//                     green.diffuseColor=myFavoriteColors.green
//                     serpentMesh.material=green
//
//                     let headSerpent=BABYLON.Mesh.CreateSphere('',10,serpentRadius*2.5,mathisFrame.scene)
//                     let red=new BABYLON.StandardMaterial('',mathisFrame.scene)
//                     red.diffuseColor=new BABYLON.Color3(1,0,0)
//                     headSerpent.material=red
//                     headSerpent.position.copyFrom(departure)
//
//
//                     /**field init*/
//                     mamesh.vertices.forEach(v=>{
//                         vectorField(0, v.position,positionings.getValue(v).frontDir)
//                     })
//
//                     let vertexVisu = new visu3d.VerticesViewer(mamesh, mathisFrame.scene,positionings)
//                     vertexVisu.meshModel = arrowModel
//                     vertexVisu.go()
//
//                     function computeNewPathPoint(previousPoint:XYZ, t:number,res:XYZ):void{
//                         vectorField(t, previousPoint,res)
//                         res.scale(deltaT)
//                         res.add(previousPoint)
//                     }
//
//
//                     let verticeSorted:Vertex[]=[]
//                     mamesh.vertices.forEach(v=>verticeSorted.push(v))
//                     let functionToSortvertex=(v1:Vertex,v2:Vertex)=>v1.customerObject.squareLengthOfTangent-v2.customerObject.squareLengthOfTangent
//                     let vertexRefSize=positionings.getValue(mamesh.vertices[0]).scaling.x
//                     let curentTime=0
//                     var curentStep=0
//                     let mainAction=new PeriodicAction(()=>{
//                         curentTime+=deltaT
//                         curentStep++
//                         let point = new XYZ(0,0,0)
//                         computeNewPathPoint(path[path.length - 1], curentTime,point)
//
//                         if (curentStep<maxPathSegment) {
//                             for (let i = curentStep; i < maxPathSegment; i++) path[i] = point
//                         }
//                         else{
//                             path.splice(0,1)
//                             path.push(point)
//                         }
//
//                         serpentMesh = BABYLON.Mesh.CreateTube('', path, serpentRadius, null, null, null, null, true, null, serpentMesh)
//
//                         headSerpent.position=point
//
//                         mamesh.vertices.forEach(v=> {
//                             v.customerObject.squareLengthOfTangent = positionings.getValue(v).frontDir.lengthSquared()
//                         })
//                         verticeSorted.sort(functionToSortvertex)
//                         for (let i = 0; i < verticeSorted.length; i++) verticeSorted[i].customerObject.scaleFromOrder = (i / verticeSorted.length)
//
//                         mamesh.vertices.forEach(v=> {
//                             let pos = positionings.getValue(v)
//                             vectorField(curentTime, v.position, pos.frontDir)
//                             pos.scaling.x = 2 * vertexRefSize * (v.customerObject.scaleFromOrder + 1 / 4)
//                             let epaisseur = vertexRefSize * Math.max(1, v.customerObject.scaleFromOrder + 1 / 2)
//                             pos.scaling.y = epaisseur
//                             pos.scaling.z = epaisseur
//                         })
//
//                         vertexVisu.updatePositionings()
//
//
//
//                     })
//
//                     mainAction.id="main action";
//                     //mainAction.frameInterval=1
//
//                     mathisFrame.pushPeriodicAction(mainAction);
//
//
//                     /**onClick, we restart the snake*/
//                     (<any> planForClick).onClick=(dep:XYZ)=>{
//                         let action=new PeriodicAction(()=>{
//                             for (let i=0;i<maxPathSegment;i++) path[i]=dep
//                             curentStep=0
//                             headSerpent.position=dep
//                         })
//                         action.nbTimesThisActionMustBeFired=1
//                         action.id="click action"
//                         action.passageOrderIndex=2
//                         mathisFrame.pushPeriodicAction(action)
//                     }
//
//
//                 }
//
//
//
//
//
//
//                 // let lineVisu=new visu3d.LinesVisuFastMaker(mamesh,scene)
//                 // lineVisu.go()
//
//
//
//
//             }
//
//             upLegend("<span> Trois systèmes dynamiques avec des coefficients périodiques </span>","public2014-B1.pdf",mainDiv)
//
//
//             /**param*/
//             let width=5
//             let height=2
//             let origin=new XYZ(-width/2,-height/2,0)
//
//             function to01(xyz:XYZ, res:XYZ):void {
//                 res.copyFrom(xyz)
//                 res.substract(origin)
//                 res.x /= width
//                 res.y /= height
//             }
//
//             function toWH(xyz:XYZ, res:XYZ):void {
//                 res.copyFrom(xyz)
//                 res.x *= width
//                 res.y *= height
//                 res.add(origin)
//             }
//
//
//             /**vecter field périodique*/
//             let vectorField0:(t:number, p:XYZ, res:XYZ)=>void
//
//             {
//                 let scaled = new XYZ(0, 0, 0)
//                 let A1 = t=>0.4 * Math.sin(0.5 * t)
//                 let A2 = t=>0.2 * Math.sin(0.5 * t)
//                 let a11 = t=>0
//                 let a12 = t=>0
//                 let a21 = t=>0
//                 let a22 = t=>0
//                 vectorField0 =  (t:number, p:XYZ, res:XYZ)=> {
//                     to01(p, scaled)
//                     /**potential part*/
//                     let raX = (scaled.x - 0.5) * 2
//                     let raY = (scaled.y - 0.5) * 4
//
//                     res.x = -raX * raY * raY
//                     res.y = -raX * raX * raY
//
//                     /**exitation part*/
//                     res.x += scaled.x * ( A1(t) + a11(t) * scaled.x + a12(t) * scaled.y)
//                     res.y += scaled.y * ( A2(t) + a21(t) * scaled.x + a22(t) * scaled.y)
//
//                 }
//             }
//             let vectorField1:(t:number, p:XYZ, res:XYZ)=>void
//             {
//                 let scaled = new XYZ(0, 0, 0)
//                 let A1 = t=>0.4 * Math.sin( t)
//                 let A2 = t=>0.2 * Math.sin(0.5 * t)
//                 let a11 = t=>0.1* Math.sin( t)
//                 let a12 = t=>-0.1* Math.sin( t)
//                 let a21 = t=>-0.1* Math.sin( t)
//                 let a22 = t=>0.1* Math.sin( t)
//                 vectorField1 =  (t:number, p:XYZ, res:XYZ)=> {
//                     to01(p, scaled)
//                     /**potential part*/
//                     let raX = (scaled.x - 0.5) * 2
//                     let raY = (scaled.y - 0.5) * 4
//
//                     res.x = -raX * raY * raY
//                     res.y = -raX * raX * raY
//
//                     /**exitation part*/
//                     res.x += scaled.x * ( A1(t) + a11(t) * scaled.x + a12(t) * scaled.y)
//                     res.y += scaled.y * ( A2(t) + a21(t) * scaled.x + a22(t) * scaled.y)
//
//                 }
//             }
//             let vectorField2:(t:number, p:XYZ, res:XYZ)=>void
//             {
//                 let scaled = new XYZ(0, 0, 0)
//                 let A1 = t=>0.4 * Math.sin(0.5 * t)
//                 let A2 = t=>0.2 * Math.sin(0.3 * t)
//                 let a11 = t=>0
//                 let a12 = t=>0
//                 let a21 = t=>0
//                 let a22 = t=>0.1* Math.sin( t)
//                 vectorField2 =  (t:number, p:XYZ, res:XYZ)=> {
//                     to01(p, scaled)
//                     /**potential part*/
//                     let raX = (scaled.x - 0.5) * 2
//                     let raY = (scaled.y - 0.5) * 4
//
//                     res.x = -raX * raY * raY
//                     res.y = -raX * raX * raY
//
//                     /**exitation part*/
//                     res.x += scaled.x * ( A1(t) + a11(t) * scaled.x + a12(t) * scaled.y)
//                     res.y += scaled.y * ( A2(t) + a21(t) * scaled.x + a22(t) * scaled.y)
//
//                 }
//             }
//
//
//             let mathisFrames:MathisFrame[]=[]
//             let legends:HTMLElement[]=[]
//             let divs=nDivInOneLine(3,mainDiv,"1px solid")
//             for (let i=0;i<3;i++){
//                 let frame=new mathis.MathisFrame(divs[i],false)
//                 mathisFrames.push(frame)
//
//                 let $legend=legend("30px",frame.canvasParent)
//                 legends.push($legend)
//             }
//
//             oneVectorField(width,height,origin,vectorField0,new XYZ(width*0.3,height*0.2,0),mathisFrames[0])
//             oneVectorField(width,height,origin,vectorField1,new XYZ(-width*0.4,height*0.1,0),mathisFrames[1])
//             oneVectorField(width,height,origin,vectorField2,new XYZ(width*0.3,height*0.2,0),mathisFrames[2])
//
//
//
//
//         }
//
//         function severalPolyhedron(mainDiv:HTMLElement):void{
//
//             function polyhedron(type,mathisFrame:MathisFrame):BABYLON.Mesh {
//
//                 let scene=mathisFrame.scene
//
//                 var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(-1, 0, -0.7), scene);
//                 light0.diffuse = new BABYLON.Color3(1, 1, 1);
//                 light0.specular = new BABYLON.Color3(0.5, 0.5, 0.5);
//                 light0.groundColor = new BABYLON.Color3(0, 0, 0);
//
//                 let grabber=new macamera.SphericalGrabber(scene,new XYZ(1,1,1))
//                 grabber.mesh.visibility=0
//                 grabber.endOfZone1=0
//                 grabber.endOfZone2=0
//
//                 let macam = new macamera.GrabberCamera(mathisFrame,grabber)
//                 macam.useFreeModeWhenCursorOutOfGrabber=false
//
//                 macam.changePosition(new XYZ(0,0,-4),false)
//
//                 let res=new BABYLON.Mesh('',scene)
//                 let meshMaker = new creation3D.Polyhedron( type)
//                 let mamesh =meshMaker.go()
//
//                 mamesh.fillLineCatalogue()
//
//
//                 let model=BABYLON.Mesh.CreateCylinder('',1,1,1,20,null,scene)
//                 model.convertToFlatShadedMesh()
//                 let mat=new BABYLON.StandardMaterial('',scene)
//                 mat.diffuseColor=myFavoriteColors.green
//                 model.material=mat
//
//                 let lineMak=new visu3d.LinksViewer(mamesh,scene)
//                 lineMak.meshModel=model
//                 lineMak.parentNode=res
//                 lineMak.segmentOrientationFunction = (vert0, vert1)=> {
//                     if (vert0.hasMark(Vertex.Markers.polygonCenter)|| vert1.hasMark(Vertex.Markers.polygonCenter)) return 0
//                     return 1
//                 }
//                 lineMak.go()
//
//
//
//                 let surfaceGameoMaker = new visu3d.SurfaceViewer(mamesh,scene)
//                 surfaceGameoMaker.parentNode=res
//                 surfaceGameoMaker.alpha=0.7
//                 surfaceGameoMaker.go()
//
//
//                 let positioningsMaker=new mameshAroundComputations.PositioningComputerForMameshVertices(mamesh)
//                 positioningsMaker.sizesProp=new XYZ(0.2,0.2,0.2)
//
//                 let nonPintaCenter:Vertex[]=[]
//                 mamesh.vertices.forEach(v=>{
//                     if (!v.hasMark(Vertex.Markers.polygonCenter) ) nonPintaCenter.push(v)
//                 })
//                 let vertMak=new visu3d.VerticesViewer(mamesh,scene,positioningsMaker.go())
//                 vertMak.parentNode=res
//                 vertMak.vertices=nonPintaCenter
//                 vertMak.go()
//
//
//                 // let vertexGameoMaker = new visu3d.VerticesGameoMaker(mamesh, scene)
//                 // vertexGameoMaker.parent=res
//                 // vertexGameoMaker.radiusMethod = (v:Vertex)=> {
//                 //     if (v.hasMark(Vertex.Markers.pintagoneCenter)) return 0
//                 //     else return 0.05
//                 // }
//                 // vertexGameoMaker.go()
//
//                 return res
//             }
//
//             let divs=nDivInOneLine(5,mainDiv,"1px solid")
//
//             let mathisFrames:MathisFrame[]=[]
//             let legends:HTMLElement[]=[]
//             for (let i=0;i<5;i++){
//                 let frame=new mathis.MathisFrame(divs[i],false)
//                 mathisFrames.push(frame)
//
//                 let $legend=legend("30px",frame.canvasParent)
//                 legends.push($legend)
//
//                 //$legend.innerHTML="<p style='text-align: center'>&beta;="+betas[i]+"</p>"//"&beta="+betas[i]
//
//             }
//             let Tetrahedron =polyhedron(creation3D.PolyhedronType.Tetrahedron,mathisFrames[0])
//             legends[0].innerHTML="<p style='text-align: center'> tétraèdre </p>"
//
//             let Cube =polyhedron(creation3D.PolyhedronType.Cube,mathisFrames[1])
//             legends[1].innerHTML="<p style='text-align: center'> cube </p>"
//
//             let Octahedron =polyhedron(creation3D.PolyhedronType.Octahedron,mathisFrames[2])
//             legends[2].innerHTML="<p style='text-align: center'> octaèdre </p>"
//
//             let dodeca =polyhedron(creation3D.PolyhedronType.Dodecahedron,mathisFrames[3])
//             legends[3].innerHTML="<p style='text-align: center'> dodécaèdre </p>"
//
//             let Icosahedron =polyhedron(creation3D.PolyhedronType.Icosahedron,mathisFrames[4])
//             legends[4].innerHTML="<p style='text-align: center'> icosaèdre </p>"
//
//
//
//
//         }
//
//         function severalIsings(mainDiv:HTMLElement){
//
//             upLegend("<span>plus beta est grand, et plus les particules de même couleur s'attirent </span>","public2009-A3.pdf",mainDiv)
//
//             let divs=nDivInOneLine(3,mainDiv,"1px solid")
//
//
//             //let canvass=mathis.nCanvasInOneLine(4,mainDiv)
//             let frameInterval=5
//
//             let q=1.1
//             let qs=[q,q,q]
//             let betas=[0,0.5,1]
//
//             for (let i=0;i<3;i++){
//                 let frame=new mathis.MathisFrame(divs[i],false)
//
//                 oneIsingSphere(frame,qs[i],betas[i],1)
//
//                 let $legend=legend("30px",frame.canvasParent)
//
//                 $legend.innerHTML="<p style='text-align: center'>&beta;="+betas[i]+"</p>"//"&beta="+betas[i]
//
//             }
//
//
//
//
//
//             function oneIsingSphere(mathisFrame:MathisFrame,q:number,beta:number,sphereRadius:number){
//
//                 var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(-1, 1, -1), mathisFrame.scene);
//                 light0.diffuse = new BABYLON.Color3(1,1,1);
//                 light0.specular = new BABYLON.Color3(1,1,1);
//                 light0.groundColor = new BABYLON.Color3(0,1,0);
//
//                 let center=new XYZ(0,0,0)
//                 //BABYLON.Mesh.CreateSphere('',20,2,scene)
//
//                 let grabber=new macamera.SphericalGrabber(mathisFrame.scene,new XYZ(sphereRadius,sphereRadius,sphereRadius),center)
//                 grabber.mesh.material.alpha=1
//                 grabber.endOfZone1=0
//                 grabber.endOfZone2=0
//
//                 let macam = new macamera.GrabberCamera(mathisFrame,grabber)
//                 macam.useFreeModeWhenCursorOutOfGrabber=false
//
//                 macam.changePosition(new XYZ(0,0,-4),false)
//                 //macam.camera.viewport=new BABYLON.Viewport(index/nbCam,0,1/nbCam,1)
//
//                 macam.attachControl(mathisFrame.canvas)
//                 //mathisFrame.scene.activeCameras.push(macam.camera)
//
//
//                 let sphereMaker=new creation3D.Polyhedron(creation3D.PolyhedronType.Dodecahedron)
//                 let mamesh=sphereMaker.go()
//
//                 new mameshModification.TriangleDichotomer(mamesh).go()
//                 new mameshModification.TriangleDichotomer(mamesh).go()
//                 new mameshModification.TriangleDichotomer(mamesh).go()
//
//
//
//                 mamesh.vertices.forEach(v=>{
//                     v.position.normalize().scale(sphereRadius).add(center)
//                 })
//
//
//
//                 //new visu3d.VerticesVisuMaker(mamesh,scene).go()
//
//
//
//
//                 let ising=new metropolis.IsingModel(mamesh.vertices)
//                 ising.beta=beta
//                 ising.q=q
//                 ising.nbActionsPerIteration=100
//                 ising.go()
//
//
//
//                 function modeleGen0(color):BABYLON.Mesh{
//                     let model=BABYLON.Mesh.CreateSphere('',6,1,mathisFrame.scene)
//                     let mat1=new BABYLON.StandardMaterial('',mathisFrame.scene)
//                     mat1.diffuseColor=color
//                     model.material=mat1
//                     let qua=new XYZW(0,0,0,0)
//                     geo.axisAngleToQuaternion(new XYZ(1,0,0),Math.PI/2,qua)
//                     model.rotationQuaternion=qua
//                     return model
//                 }
//
//
//                 function modeleDisk(color):BABYLON.Mesh{
//                     let model=BABYLON.Mesh.CreateDisc('',0.5,6,mathisFrame.scene,false,BABYLON.Mesh.BACKSIDE)//BABYLON.Mesh.CreateSphere('',10,1,scene)
//                     let mat1=new BABYLON.StandardMaterial('',mathisFrame.scene)
//                     mat1.diffuseColor=color
//                     model.material=mat1
//                     let qua=new XYZW(0,0,0,0)
//                     geo.axisAngleToQuaternion(new XYZ(1,0,0),Math.PI/2,qua)
//                     model.rotationQuaternion=qua
//                     return model
//                 }
//
//                 function modeleCylinder(color):BABYLON.Mesh{
//                     let model=BABYLON.Mesh.CreateCylinder('',0.1,1,1,6,null,mathisFrame.scene)//BABYLON.Mesh.CreateSphere('',10,1,scene)
//                     let mat1=new BABYLON.StandardMaterial('',mathisFrame.scene)
//                     mat1.diffuseColor=color
//                     model.material=mat1
//                     //let qua=new XYZW(0,0,0,0)
//                     // geo.axisAngleToQuaternion(new XYZ(1,0,0),Math.PI/2,qua)
//                     // model.rotationQuaternion=qua
//                     return model
//                 }
//
//
//                 let model1=modeleGen0(new BABYLON.Color3(1,0,0))
//                 let model2=modeleGen0(new BABYLON.Color3(0,0,1))
//
//
//                 let positionneur=new mameshAroundComputations.PositioningComputerForMameshVertices(mamesh)
//                 positionneur.sizesProp=new XYZ(1,1,1)
//                 let positionning=positionneur.go()
//
//
//
//                 let positionning1=new HashMap<Vertex,Positioning>()
//                 mamesh.vertices.forEach(v=>{
//                     let po=new Positioning()
//                     po.copyFrom(positionning.getValue(v))
//                     po.scaling.copyFromFloats(0,0,0)
//                     positionning1.putValue(v,po)
//                 })
//
//                 let positionning2=new HashMap<Vertex,Positioning>()
//                 mamesh.vertices.forEach(v=>{
//                     let po=new Positioning()
//                     po.copyFrom(positionning.getValue(v))
//                     po.scaling.copyFromFloats(0,0,0)
//                     positionning2.putValue(v,po)
//                 })
//
//
//                 let vertVisu1=new visu3d.VerticesViewer(mamesh,mathisFrame.scene)
//                 vertVisu1.positionings=positionning1
//                 vertVisu1.meshModel=model1
//                 vertVisu1.go()
//
//
//
//                 let vertVisu2=new visu3d.VerticesViewer(mamesh,mathisFrame.scene)
//                 vertVisu2.positionings=positionning2
//                 vertVisu2.meshModel=model2
//                 vertVisu2.go()
//
//
//                 let commonSizes=positionning.getValue(mamesh.vertices[0]).scaling
//                 let cumul=0
//                 let action=new PeriodicAction(()=>{
//                     let changed=ising.iterateAndGetChangedVertices()
//
//                     changed.allKeys().forEach((v:Vertex)=>{
//                         if (v.customerObject.value==0) {
//                             positionning1.getValue(v).scaling.copyFromFloats(0,0,0)//.getValue(v).sizes.copyFrom(0,0,0)
//                             positionning2.getValue(v).scaling.copyFromFloats(0,0,0)
//                         }
//                         else if (v.customerObject.value==1) {
//                             positionning1.getValue(v).scaling.copyFrom(commonSizes)
//                             positionning2.getValue(v).scaling.copyFromFloats(0,0,0)
//                         }
//                         else if (v.customerObject.value==-1) {
//                             positionning2.getValue(v).scaling.copyFrom(commonSizes)
//                             positionning1.getValue(v).scaling.copyFromFloats(0,0,0)
//                         }
//                     })
//
//                     vertVisu1.updatePositionings()
//                     vertVisu2.updatePositionings()
//
//
//                     //vertVisu1.buildVertexVisu(changed1,changed0)
//                     //vertVisu2.buildVertexVisu(changed_1,changed0)
//
//
//                     //vertVisu2.buildVertexVisu(changed)
//                 })
//                 action.frameInterval=frameInterval
//                 mathisFrame.pushPeriodicAction(action)
//
//
//
//
//             }
//
//
//
//
//
//
//
//
//         }
//         //
//         //
//         // function sceneIsing(mathisFrame:MathisFrame){
//         //
//         //     let sphereRadius=maud
//         //
//         //     // Ajout d'une lumière
//         //     var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(-1, 1, -1), mathisFrame.scene);
//         //     light0.diffuse = new BABYLON.Color3(1,1,1);
//         //     light0.specular = new BABYLON.Color3(1,1,1);
//         //     light0.groundColor = new BABYLON.Color3(0,1,0);
//         //
//         //     let decals=[0,1000,2000,3000,4000,5000]
//         //     //let allCam=[]
//         //
//         //     let qA=0.1
//         //     let qB=10
//         //     let bet1=0.
//         //     let bet2=1
//         //     let bet3=10
//         //     let qs=[qA,qA,qA,qB,qB,qB]
//         //     let betas=[bet1,bet2,bet3,bet1,bet2,bet3]
//         //
//         //
//         //     for (let i=0;i<decals.length;i++){
//         //         oneIsingSphere(qs[i],betas[i],decals[i],i,decals.length)
//         //     }
//         //
//         //     //oneIsingSphere(10,0,0,0,1)
//         //
//         //     function oneIsingSphere(q:number,beta:number,decal:number,index:number,nbCam:number){
//         //
//         //
//         //
//         //         let center=new XYZ(decal,0,0)
//         //         //BABYLON.Mesh.CreateSphere('',20,2,scene)
//         //
//         //         let grabber=new macamera.SphericalGrabber(mathisFrame.scene,new XYZ(sphereRadius,sphereRadius,sphereRadius),center)
//         //         grabber.mesh.material.alpha=1
//         //         grabber.endOfZone1=0
//         //         grabber.endOfZone2=0
//         //
//         //         let macam = new macamera.GrabberCamera(mathisFrame,grabber)
//         //         macam.useFreeModeWhenCursorOutOfGrabber=false
//         //
//         //         macam.changePosition(new XYZ(decal,0,-4),false)
//         //         macam.camera.viewport=new BABYLON.Viewport(index/nbCam,0,1/nbCam,1)
//         //
//         //         macam.attachControl(mathisFrame.canvas)
//         //         mathisFrame.scene.activeCameras.push(macam.camera)
//         //
//         //         let mamesh=new Mamesh()
//         //
//         //         let sphereMaker=new creation3D.Polyhedron(mamesh,creation3D.PolyhedronType.Dodecahedron)
//         //         sphereMaker.go()
//         //
//         //         new mameshModification.TriangleDichotomer(mamesh).go()
//         //         new mameshModification.TriangleDichotomer(mamesh).go()
//         //         //new mameshModification.TriangleDichotomer(mamesh).go()
//         //         //new mameshModification.TriangleDichotomer(mamesh).go()
//         //         //new mameshModification.TriangleDichotomer(mamesh).go()
//         //         //new mameshModification.TriangleDichotomer(mamesh).go()
//         //
//         //
//         //         mamesh.vertices.forEach(v=>{
//         //             v.position.normalize().scale(sphereRadius).add(center)
//         //         })
//         //
//         //
//         //
//         //         //new visu3d.VerticesVisuMaker(mamesh,scene).go()
//         //
//         //
//         //
//         //
//         //         let ising=new metropolis.IsingModel(mamesh.vertices)
//         //         ising.beta=beta
//         //         ising.q=q
//         //         ising.nbActionsPerIteration=30
//         //         ising.go()
//         //
//         //
//         //
//         //         function modeleGen0(color):BABYLON.Mesh{
//         //             let model=BABYLON.Mesh.CreateSphere('',6,1,mathisFrame.scene)
//         //             let mat1=new BABYLON.StandardMaterial('',mathisFrame.scene)
//         //             mat1.diffuseColor=color
//         //             model.material=mat1
//         //             let qua=new XYZW(0,0,0,0)
//         //             geo.axisAngleToQuaternion(new XYZ(1,0,0),Math.PI/2,qua)
//         //             model.rotationQuaternion=qua
//         //             return model
//         //         }
//         //
//         //
//         //         function modeleDisk(color):BABYLON.Mesh{
//         //             let model=BABYLON.Mesh.CreateDisc('',0.5,6,mathisFrame.scene,false,BABYLON.Mesh.BACKSIDE)//BABYLON.Mesh.CreateSphere('',10,1,scene)
//         //             let mat1=new BABYLON.StandardMaterial('',mathisFrame.scene)
//         //             mat1.diffuseColor=color
//         //             model.material=mat1
//         //             let qua=new XYZW(0,0,0,0)
//         //             geo.axisAngleToQuaternion(new XYZ(1,0,0),Math.PI/2,qua)
//         //             model.rotationQuaternion=qua
//         //             return model
//         //         }
//         //
//         //         function modeleCylinder(color):BABYLON.Mesh{
//         //             let model=BABYLON.Mesh.CreateCylinder('',0.1,1,1,6,null,mathisFrame.scene)//BABYLON.Mesh.CreateSphere('',10,1,scene)
//         //             let mat1=new BABYLON.StandardMaterial('',mathisFrame.scene)
//         //             mat1.diffuseColor=color
//         //             model.material=mat1
//         //             //let qua=new XYZW(0,0,0,0)
//         //             // geo.axisAngleToQuaternion(new XYZ(1,0,0),Math.PI/2,qua)
//         //             // model.rotationQuaternion=qua
//         //             return model
//         //         }
//         //
//         //
//         //         let model1=modeleGen0(new BABYLON.Color3(1,0,0))
//         //         let model2=modeleGen0(new BABYLON.Color3(0,0,1))
//         //
//         //
//         //         let positionneur=new visu3d.PositioningComputerForMameshVertices(mamesh)
//         //         positionneur.sizesProp=new XYZ(1,1,1)
//         //         let positionning=positionneur.go()
//         //
//         //
//         //
//         //         let positionning1=new HashMap<Vertex,Positioning>()
//         //         mamesh.vertices.forEach(v=>{
//         //             let po=new Positioning()
//         //             po.copyFrom(positionning.getValue(v))
//         //             po.sizes.copyFromFloats(0,0,0)
//         //             positionning1.putValue(v,po)
//         //         })
//         //
//         //         let positionning2=new HashMap<Vertex,Positioning>()
//         //         mamesh.vertices.forEach(v=>{
//         //             let po=new Positioning()
//         //             po.copyFrom(positionning.getValue(v))
//         //             po.sizes.copyFromFloats(0,0,0)
//         //             positionning2.putValue(v,po)
//         //         })
//         //
//         //
//         //         let vertVisu1=new visu3d.VerticesVisuMaker(mamesh,mathisFrame.scene)
//         //         vertVisu1.positionings=positionning1
//         //         vertVisu1.meshModel=model1
//         //         vertVisu1.go()
//         //
//         //
//         //
//         //         let vertVisu2=new visu3d.VerticesVisuMaker(mamesh,mathisFrame.scene)
//         //         vertVisu2.positionings=positionning2
//         //         vertVisu2.meshModel=model2
//         //         vertVisu2.go()
//         //
//         //
//         //         let commonSizes=positionning.getValue(mamesh.vertices[0]).sizes
//         //         let cumul=0
//         //         let action=new PeriodicActionBeforeRender(()=>{
//         //             let changed=ising.iterateAndGetChangedVertices()
//         //
//         //             changed.allKeys().forEach((v:Vertex)=>{
//         //                 if (v.customerObject.value==0) {
//         //                     positionning1.getValue(v).sizes.copyFromFloats(0,0,0)//.getValue(v).sizes.copyFrom(0,0,0)
//         //                     positionning2.getValue(v).sizes.copyFromFloats(0,0,0)
//         //                 }
//         //                 else if (v.customerObject.value==1) {
//         //                     positionning1.getValue(v).sizes.copyFrom(commonSizes)
//         //                     positionning2.getValue(v).sizes.copyFromFloats(0,0,0)
//         //                 }
//         //                 else if (v.customerObject.value==-1) {
//         //                     positionning2.getValue(v).sizes.copyFrom(commonSizes)
//         //                     positionning1.getValue(v).sizes.copyFromFloats(0,0,0)
//         //                 }
//         //             })
//         //
//         //             vertVisu1.updatePositionings()
//         //             vertVisu2.updatePositionings()
//         //
//         //
//         //             //vertVisu1.buildVertexVisu(changed1,changed0)
//         //             //vertVisu2.buildVertexVisu(changed_1,changed0)
//         //
//         //
//         //             //vertVisu2.buildVertexVisu(changed)
//         //         })
//         //         action.frameInterval=2
//         //         mathisFrame.pushPeriodicAction(action)
//         //
//         //
//         //
//         //
//         //     }
//         //
//         // }
//         //
//
//
//
//     }
//
// }