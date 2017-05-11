// /**
//  * Created by Kieffer on 11/05/2017.
//  */
//
// module mathis{
//
//     export module documentation{
//
//         //
//         // export class StrangeTest implements OnePage{
//         //     pageIdAndTitle="StrangeTestDocu";
//         //     severalParts:SeveralParts;
//         //
//         //     constructor(private mathisFrame:MathisFrame){
//         //         let several=new SeveralParts();
//         //         // several.addPart(new AutomaticLink(this.mathisFrame))
//         //         // several.addPart(new AutomaticPolygonLink(this.mathisFrame))
//         //         several.addPart(new StrangePieceDocu(this.mathisFrame));
//         //         //several.addPart(new WhatAreOppositeLinks(this.mathisFrame))
//         //         this.severalParts=several
//         //     }
//         //
//         //     go(){
//         //         return this.severalParts.go()
//         //     }
//         //
//         // }
//
//         class StrangePieceDocu implements appli.PieceOfCode{
//
//             NAME="StrangeTesting";
//             TITLE="How correct and connect strange Mamesh";
//
//             //polyhedronType=creation3D.ArchimedeanSolidType.TruncatedIcosidodecahedron
//             //$$$polyhedronType=new Choices(allIntegerValueOfEnume(creation3D.ArchimedeanSolidType),{visualValues:allStringValueOfEnume(creation3D.ArchimedeanSolidType)})
//
//             constructor(private mathisFrame:MathisFrame){
//                 this.mathisFrame=mathisFrame
//
//             }
//
//             goForTheFirstTime(){
//                 this.mathisFrame.clearScene();
//                 this.mathisFrame.addDefaultCamera();
//                 this.mathisFrame.addDefaultLight();
//                 let camera=<macamera.GrabberCamera>this.mathisFrame.scene.activeCamera;
//                 camera.changePosition(new XYZ(0,0,-5));
//                 this.go()
//             }
//
//             go(){
//
//                 this.mathisFrame.clearScene(false,false);
//
//                 /** vague **/
//                 let creator = new mathis.reseau.TriangulatedPolygone(10);
//                 creator.nbSubdivisionInARadius = 5;
//                 creator.origin = new mathis.XYZ(-Math.PI * 0.8, -1, 0);
//                 creator.end = new mathis.XYZ(+Math.PI * 0.8, 1, 0);
//                 let mamesh = creator.go();
//                 for (let _i = 0, _a = mamesh.vertices; _i < _a.length; _i++) {
//                     let vertex = _a[_i];
//                     let u = vertex.position.x;
//                     let v = vertex.position.y;
//                     vertex.position.x = Math.cos(u);
//                     vertex.position.y = Math.sin(u);
//                     vertex.position.z = v;
//                 }
//
//                 /** anneau **/
//                 // let basis = new mathis.reseau.BasisForRegularReseau();
//                 // basis.origin = new mathis.XYZ(0, -1, 0);
//                 // basis.end = new mathis.XYZ(2 * Math.PI, 1, 0);
//                 // basis.nbI = 20;
//                 // basis.nbJ = 10;
//                 // let creator = new mathis.reseau.Regular(basis);
//                 // let mamesh = creator.go();
//                 // for (let _i = 0, _a = mamesh.vertices; _i < _a.length; _i++) {
//                 //     let vertex = _a[_i];
//                 //     let u = vertex.position.x;
//                 //     let v = vertex.position.y;
//                 //     vertex.position.x = (2 - v * Math.sin(u / 2)) * Math.sin(u);
//                 //     vertex.position.y = (2 - v * Math.sin(u / 2)) * Math.cos(u);
//                 //     vertex.position.z = v * Math.cos(u / 2);
//                 // }
//
//                 let connect = new surfaceConnection.SurfaceConnectionProcess(mamesh, 1);
//                 mamesh = connect.go();
//
//                 /** visualisation basique **/
//                 let choiceVertexVizu = 0;
//
//                 if(choiceVertexVizu == 0) {
//                     let verticesViewer = new mathis.visu3d.VerticesViewer(mamesh, this.mathisFrame.scene);
//                     verticesViewer.go();
//                 }
//
//                 let linksViewer = new mathis.visu3d.LinksViewer(mamesh, this.mathisFrame.scene);
//                 linksViewer.go();
//
//                 let surfaceViewer = new mathis.visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene);
//                 surfaceViewer.go();
//             }
//         }
//     }
// }
//
