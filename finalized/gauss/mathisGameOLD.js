// /**
//  * Created by vigon on 10/03/2016.
//  */
//
//
// module mathis{
//
//     export module mathisGame{
//
//         import OneLineOption = mathis.visu3d.LineGameoStatic.LineGameoOption;
//         export function start(){
//             var mathisFrame=new mathis.MathisFrame()
//             mathisFrame.goChanging()
//             sceneCreaFunction(mathisFrame)
//            
//         }
//
//
//
//         export function sceneCrea2(mathisFrame:MathisFrame){
//             let macam = new macamera.GrabberCamera(mathisFrame.scene)
//             macam.trueCamPos.position=new XYZ(0,0,-4)
//             macam.justOneGrabber.center=new XYZ(0,0,0)
//             macam.justOneGrabber.constantRadius=1
//             macam.justOneGrabber.grabberIsVisible=false
//             macam.goChanging()
//             macam.attachControl(mathisFrame.canvas)
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
//             //createSkybox(scene);
//             //scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
//             //scene.fogDensity = 0.05;
//             //scene.fogColor = new BABYLON.Color3(0.9, 0.9, 0.85);
//
//
//
//             var origine=BABYLON.Mesh.CreateSphere("origine",50,0.2,scene,false);
//             //origine.material=rose;
//
//             var newInstance = origine.createInstance("i");
//         }
//
//
//         import BabylonGameO = mathis.visu3d.GameoBab;
//
//
//
//         export function sceneCreaFunction(mathisFrame:MathisFrame){
//
//
//             var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(-1, 0, -0.7), mathisFrame.scene);
//             light0.diffuse = new BABYLON.Color3(1, 1, 1);
//             light0.specular = new BABYLON.Color3(0.5,0.5,0.5);
//             light0.groundColor = new BABYLON.Color3(0, 0, 0);
//
//            
//             let grabber=new macamera.Grabber()
//             grabber.displacementMode=macamera.DisplacementMode.parallele
//             grabber.grabberMesh= BABYLON.Mesh.CreatePlane("",100,scene)
//             grabber.grabberIsVisible=false
//
//
//             let macam = new macamera.GrabberCamera(mathisFrame.scene)
//             macam.trueCamPos.position=new XYZ(0,0,-10)
//             macam.justOneGrabber=grabber
//             macam.useFreeModeWhenCursorOutOfGrabber=false
//
//            
//            
//            
//
//             macam.goChanging()
//             macam.attachControl(mathisFrame.canvas)
//
//
//
//             let mamesh=new Mamesh()
//
//
//             // let polyCrea=new creation3D.Polyhedron(mamesh,creation3D.Polyhedron.Type.Dodecahedron)
//             // polyCrea.goChanging()
//             //
//             // let selectedVertices:Vertex[]=[]
//             // mamesh.vertices.forEach(v=>selectedVertices.push(v))
//             //
//             // new mameshModification.TriangleDichotomer(mamesh).goChanging()
//             // new mameshModification.TriangleDichotomer(mamesh).goChanging()
//             // new mameshModification.TriangleDichotomer(mamesh).goChanging()
//             //
//             //
//             // mamesh.vertices.forEach(v=>{v.position.normalize()})
//             //
//             // mamesh.fillLineCatalogue(selectedVertices)
//
//
//
//             let rootGameo=new GameO()
//
//             let boxGameos:{[key:string]:GameO}={}
//
//             let vectX=new XYZ(2.5,0,0)
//             let vectY=new XYZ(0,2.5,0)
//             let tempX=new XYZ(0,0,0)
//             let tempY=new XYZ(0,0,0)
//
//             for (let i=-1;i<=1;i++){
//                 for (let j=-1;j<=1;j++){
//                     let box=BABYLON.Mesh.CreateBox('',1,scene)
//                     box.visibility=0
//                     let boxGam=new visu3d.GameoFromMesh(box)
//                     boxGam.attachTo(rootGameo)
//                     boxGam.isClickable=true
//                     boxGam.clickMethod=()=>{
//                         cc('lic',i,j)
//                         for (let key in boxGameos){boxGameos[key].locScale=1;boxGameos[key].actualize() }
//                         boxGam.locScale=2
//                         boxGam.actualize()
//                     }
//                     boxGameos[i+','+j]=boxGam
//                     tempX.copyFrom(vectX).scale(i)
//                     tempY.copyFrom(vectY).scale(j)
//                     boxGam.locPos.add(tempX).add(tempY)
//                    
//                     let mamesh=new Mamesh()
//                     let polyhedron=new creation3D.Polyhedron(mamesh,creation3D.PolyhedronStatic.Type.Cube)
//                     polyhedron.rotationAngle=0
//                     polyhedron.goChanging()
//                     mamesh.fillLineCatalogue()
//
//                     let linesGameoMaker=new visu3d.LinesGameoMaker(mamesh,scene)
//                     linesGameoMaker.lineOptionFunction=(i,line)=>{
//                         let res=new OneLineOption()
//                         res.color=favoriteColors.green
//                         res.constantRadius=0.05
//                         return res
//                     }
//                     linesGameoMaker.parentGameo=boxGam
//                     linesGameoMaker.goChanging()
//                    
//                     let bbb=new visu3d.VerticesGameoMaker(mamesh,scene)
//                     bbb.radiusMethod=(v)=>{return 0.05}
//                     bbb.shape=visu3d.VerticesGameoStatic.Shape.sphere
//                     bbb.parentGameo=boxGam
//                     bbb.goChanging()
//                 }
//             }
//
//
//
//
//
//             let skewTorus=new SkewTorus().goChanging()
//             skewTorus.locRadius=0.3
//             skewTorus.attachTo(boxGameos[1+','+0])
//
//             rootGameo.draw()
//             //skewTorus.draw()
//
//
//
//
//
//             //rootGameo.draw()
//
//
//             //skewTorus.scale(2)
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
//          class GameoOfTheMainMenu{
//
//         }
//
//
//          class SkewTorus extends GameoOfTheMainMenu{
//
//             goChanging():GameO{
//                 let mamesh = new Mamesh()
//                 let meshMaker = new creationFlat.Cartesian(mamesh)
//                 meshMaker.makeLinks=false
//                 meshMaker.nbX=5
//                 meshMaker.nbY=20
//                 meshMaker.minX=0
//                 meshMaker.maxX=2*Math.PI
//                 meshMaker.minY=0
//                 meshMaker.maxY=2*Math.PI
//                 meshMaker.nbVerticalDecays=2
//                 meshMaker.nbHorizontalDecays=1
//                 meshMaker.goChanging()
//
//
//                 let r=0.8
//                 let a=2
//                 mamesh.vertices.forEach((vertex:Vertex)=>{
//
//                     let u=vertex.position.x
//                     let v=vertex.position.y
//                     vertex.position.x=(r*Math.cos(u)+a)*Math.cos((v))
//                     vertex.position.y=r*Math.sin(u)
//                     vertex.position.z= (r*Math.cos(u)+a)*Math.sin((v))
//                 })
//
//
//                 let merger=new mameshModification.Merger(mamesh)
//                 merger.cleanDoubleLinksKeepingInPriorityThoseWithOpposite=false
//                 merger.mergeLink=false
//                 merger.mergeTrianglesAndSquares=true
//                 merger.goChanging()
//
//
//                 let linkFromPoly=new linker.LinkCreaterSorterAndBorderDetecterByPolygons(mamesh)
//                 linkFromPoly.alsoDoubleLinksAtCorner=true
//                 linkFromPoly.goChanging()
//
//
//                 mamesh.fillLineCatalogue()
//
//
//                 let mainGameo=new GameO()
//                 mainGameo.locRadius=0.35
//
//                 let linesGameoMaker=new visu3d.LinesGameoMaker(mamesh,scene)
//                 linesGameoMaker.parentGameo=mainGameo
//                 linesGameoMaker.lineOptionFunction=(i,index)=>{
//                     let res=new visu3d.LineGameoStatic.LineGameoOption()
//                     res.constantRadius=0.03
//
//                     if (i==0) {
//                         res.color=new BABYLON.Color3(124/255, 252/255, 0)
//
//                     }
//                     //long line
//                     else {
//                         res.color=new BABYLON.Color3(191/255, 62/255, 1)
//                         res.interpolationOption=new geometry.InterpolerStatic.Options()
//                         res.interpolationOption.interpolationStyle=geometry.InterpolerStatic.InterpolationStyle.hermite
//                     }
//
//
//                     return res
//                 }
//                 linesGameoMaker.goChanging()
//
//                 let surfaceGameoMaker=new visu3d.SurfaceVisuMaker(mamesh,scene)
//                 surfaceGameoMaker.parentGameo=mainGameo
//                 let surfaceGameo=surfaceGameoMaker.goChanging()
//                 surfaceGameo.locOpacity=0.7
//
//                 return mainGameo
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
//     }
//
// }
//
//
