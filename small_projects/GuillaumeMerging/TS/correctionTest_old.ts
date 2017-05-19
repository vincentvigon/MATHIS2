// /**
//  * Created by Kieffer on 07/05/2017.
//  */
//
// module mathis{
//
//
//         //
//         // export class CorrectionTest implements OnePage{
//         //     pageIdAndTitle="SimpleCorrectTestDocu";
//         //     severalParts:SeveralParts;
//         //
//         //     constructor(private mathisFrame:MathisFrame){
//         //         let several=new SeveralParts();
//         //         // several.addPart(new AutomaticLink(this.mathisFrame))
//         //         // several.addPart(new AutomaticPolygonLink(this.mathisFrame))
//         //         several.addPart(new ConnectorPieceDocu(this.mathisFrame));
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
//     export class ConnectorPiece implements appli.PieceOfCode{
//
//             NAME="CorrectionTesting";
//             TITLE="How correct invalid Mamesh";
//
//             //polyhedronType=creation3D.ArchimedeanSolidType.TruncatedIcosidodecahedron
//             //$$$polyhedronType=new Choices(allIntegerValueOfEnume(creation3D.ArchimedeanSolidType),{visualValues:allStringValueOfEnume(creation3D.ArchimedeanSolidType)})
//
//             connect=false
//             $$$connect=new appli.Choices([true,false],{type:appli.ChoicesOptionsType.button,visualValues:['T','F'],containerName:'N'})
//
//             nbBiggerFacesDeleted=2
//             $$$nbBiggerFacesDeleted=[0,1,2,4,6,8]
//
//
//             surfaceChoice=1
//             $$$surfaceChoice=new appli.Choices([1,2,3],{visualValues:['plat','rond','moebius']})
//
//
//
//             constructor(private mathisFrame:MathisFrame){
//                 this.mathisFrame=mathisFrame
//
//             }
//
//             goForTheFirstTime(){
//
//                 let camera=<macamera.GrabberCamera>this.mathisFrame.scene.activeCamera;
//
//                 camera.changePosition(new XYZ(0,0,-8));
//                 this.go()
//             }
//
//             go(){
//
//                 this.mathisFrame.clearScene(false,false);
//
//                 let mamesh:Mamesh
//                 if (this.surfaceChoice==1) {
//                     /** Création des points de la surface **/
//                     let vtx1 = new mathis.Vertex().setPosition(-4, -0.5, 0);
//                     let vtx2 = new mathis.Vertex().setPosition(-3, 1, 0);
//                     let vtx3 = new mathis.Vertex().setPosition(-1, 2.5, 0);
//                     let vtx4 = new mathis.Vertex().setPosition(2, 2, 0);
//                     let vtx5 = new mathis.Vertex().setPosition(3, -0.5, 0);
//                     let vtx6 = new mathis.Vertex().setPosition(3, -2, 0);
//                     let vtx7 = new mathis.Vertex().setPosition(2, -3, -1);
//                     let vtx8 = new mathis.Vertex().setPosition(-0.5, -3, 0);
//                     let vtx9 = new mathis.Vertex().setPosition(-2.5, -3, 0);
//                     let vtx10 = new mathis.Vertex().setPosition(-2.5, -1, 0);
//                     let vtx11 = new mathis.Vertex().setPosition(-0, 0, 0);
//                     let vtx12 = new mathis.Vertex().setPosition(1.5, -1.5, 0);
//                     let vtx13 = new mathis.Vertex().setPosition(3, 4, 0);
//                     let vtx14 = new mathis.Vertex().setPosition(5, 3, 0);
//                     let vtx15 = new mathis.Vertex().setPosition(5, 5, 0);
//                     let vtx16 = new mathis.Vertex().setPosition(5, 2, 0);
//                     let vtx17 = new mathis.Vertex().setPosition(6, 1, 0);
//                     let vtx18 = new mathis.Vertex().setPosition(-3, 3, 0);
//                     let vtx19 = new mathis.Vertex().setPosition(7, 0, 0);
//                     let vtx20 = new mathis.Vertex().setPosition(6, -1, 0);
//                     let vtx21 = new mathis.Vertex().setPosition(10, 10, 0);
//
//                     mamesh = new mathis.Mamesh();
//                     mamesh.vertices.push(vtx1, vtx2, vtx3, vtx4, vtx5, vtx6, vtx7, vtx8, vtx9, vtx10, vtx11, vtx12);
//                     mamesh.vertices.push(vtx13, vtx14, vtx15, vtx16, vtx17, vtx18, vtx19, vtx20, vtx21);
//                     /** Création des liens de la surface **/
//                     vtx1.setOneLink(vtx2);
//                     vtx2.setOneLink(vtx1);
//                     vtx2.setOneLink(vtx3);
//                     vtx3.setOneLink(vtx2);
//                     vtx3.setOneLink(vtx4);
//                     vtx4.setOneLink(vtx3);
//                     vtx4.setOneLink(vtx5);
//                     vtx5.setOneLink(vtx4);
//                     vtx5.setOneLink(vtx6);
//                     vtx6.setOneLink(vtx5);
//                     vtx6.setOneLink(vtx7);
//                     vtx7.setOneLink(vtx6);
//                     vtx7.setOneLink(vtx8);
//                     vtx8.setOneLink(vtx7);
//                     vtx8.setOneLink(vtx9);
//                     vtx9.setOneLink(vtx8);
//                     vtx9.setOneLink(vtx1);
//                     vtx1.setOneLink(vtx9);
//
//                     vtx10.setOneLink(vtx1);
//                     vtx1.setOneLink(vtx10);
//                     vtx10.setOneLink(vtx2);
//                     vtx2.setOneLink(vtx10);
//                     vtx10.setOneLink(vtx9);
//                     vtx9.setOneLink(vtx10);
//                     vtx11.setOneLink(vtx4);
//                     vtx4.setOneLink(vtx11);
//                     vtx11.setOneLink(vtx8);
//                     vtx8.setOneLink(vtx11);
//                     vtx11.setOneLink(vtx10);
//                     vtx10.setOneLink(vtx11);
//                     vtx12.setOneLink(vtx6);
//                     vtx6.setOneLink(vtx12);
//                     vtx12.setOneLink(vtx8);
//                     vtx8.setOneLink(vtx12);
//
//                     vtx13.setOneLink(vtx4);
//                     vtx4.setOneLink(vtx13);
//                     vtx13.setOneLink(vtx14);
//                     vtx14.setOneLink(vtx13);
//                     vtx14.setOneLink(vtx15);
//                     vtx15.setOneLink(vtx14);
//                     vtx14.setOneLink(vtx16);
//                     vtx16.setOneLink(vtx14);
//                     vtx16.setOneLink(vtx17);
//                     vtx17.setOneLink(vtx16);
//                     vtx17.setOneLink(vtx19);
//                     vtx19.setOneLink(vtx17);
//                     vtx20.setOneLink(vtx19);
//                     vtx19.setOneLink(vtx20);
//                     vtx20.setOneLink(vtx17);
//                     vtx17.setOneLink(vtx20);
//                     vtx18.setOneLink(vtx2);
//                     vtx2.setOneLink(vtx18);
//
//                 }
//                 else if (this.surfaceChoice==2) {
//
//                     /** vague **/
//                     let creator = new mathis.reseau.TriangulatedPolygone(10);
//                     creator.nbSubdivisionInARadius = 5;
//                     creator.origin = new mathis.XYZ(-Math.PI * 0.8, -1, 0);
//                     creator.end = new mathis.XYZ(+Math.PI * 0.8, 1, 0);
//                     mamesh = creator.go();
//                     mamesh.smallestTriangles=[]
//
//                     for (let _i = 0, _a = mamesh.vertices; _i < _a.length; _i++) {
//                         let vertex = _a[_i];
//                         let u = vertex.position.x;
//                         let v = vertex.position.y;
//                         vertex.position.x = Math.cos(u);
//                         vertex.position.y = Math.sin(u);
//                         vertex.position.z = v;
//                     }
//                 }
//                 else if (this.surfaceChoice==3) {
//
//                     /** anneau **/
//                     let basis = new mathis.reseau.BasisForRegularReseau();
//                     basis.origin = new mathis.XYZ(0, -1, 0);
//                     basis.end = new mathis.XYZ(2 * Math.PI, 1, 0);
//                     basis.nbI = 20;
//                     basis.nbJ = 10;
//                     let creator = new mathis.reseau.Regular(basis);
//                     creator.makeTriangleOrSquare=false
//                     mamesh = creator.go();
//                     for (let _i = 0, _a = mamesh.vertices; _i < _a.length; _i++) {
//                         let vertex = _a[_i];
//                         let u = vertex.position.x;
//                         let v = vertex.position.y;
//                         vertex.position.x = (2 - v * Math.sin(u / 2)) * Math.sin(u);
//                         vertex.position.y = (2 - v * Math.sin(u / 2)) * Math.cos(u);
//                         vertex.position.z = v * Math.cos(u / 2);
//                     }
//                 }
//
//
//
//
//
//                 if (this.connect) {
//                     let connect = new surfaceConnection.SurfaceConnectionProcess(mamesh, this.nbBiggerFacesDeleted);
//                     mamesh = connect.go();
//                 }
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
//
// }
//
