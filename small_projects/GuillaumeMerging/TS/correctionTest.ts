/**
 * Created by Guillaume Kieffer on 26/05/2017.
 */

module mathis{

    export class ConnectorPiece implements appli.PieceOfCode{

            NAME="CorrectionTesting";
            TITLE="How correct invalid Mamesh";

            connect=false;
            $$$connect=new appli.Choices([true,false],{type:appli.ChoicesOptionsType.button,visualValues:['T','F'],containerName:'N'});

            nbBiggerFacesDeleted=1;
            $$$nbBiggerFacesDeleted=[0,1,2,4,6,8];


            surfaceChoice=1;
            $$$surfaceChoice=new appli.Choices([1,2,3,4,5,6,7],{visualValues:['Flat','Strange flat','Filled flat','Half-cylinder','Moebius','Grat&glue 1','Grat&glue 2']});

            areaOrPerimeterChoice=true;
            $$$areaOrPerimeterChoice=new appli.Choices([true,false],{visualValues:['true','false']});

            fillConvexFaces=true;
            $$$fillConvexFaces=new appli.Choices([true,false],{visualValues:['true','false']});


        constructor(private mathisFrame:MathisFrame){
                this.mathisFrame=mathisFrame

            }

            goForTheFirstTime(){

                let camera=<macamera.GrabberCamera>this.mathisFrame.scene.activeCamera;

                camera.changePosition(new XYZ(0,0,-8));
                this.go()
            }

            go(){

                this.mathisFrame.clearScene(false,false);

                let mamesh:Mamesh;
                if (this.surfaceChoice==1) {
                    /** flat **/

                    /** vertices **/
                    let vtx1 = new mathis.Vertex().setPosition(-4, -0.5, 0);
                    let vtx2 = new mathis.Vertex().setPosition(-3, 1, 0);
                    let vtx3 = new mathis.Vertex().setPosition(-1, 2.5, 0);
                    let vtx4 = new mathis.Vertex().setPosition(2, 2, 0);
                    let vtx5 = new mathis.Vertex().setPosition(3, -0.5, 0);
                    let vtx6 = new mathis.Vertex().setPosition(3, -2, 0);
                    let vtx7 = new mathis.Vertex().setPosition(2, -3, -1);
                    let vtx8 = new mathis.Vertex().setPosition(-0.5, -3, 0);
                    let vtx9 = new mathis.Vertex().setPosition(-2.5, -3, 0);
                    let vtx10 = new mathis.Vertex().setPosition(-2.5, -1, 0);
                    let vtx11 = new mathis.Vertex().setPosition(-0, 0, 0);
                    let vtx12 = new mathis.Vertex().setPosition(1.5, -1.5, 0);

                    mamesh = new mathis.Mamesh();
                    mamesh.vertices.push(vtx1, vtx2, vtx3, vtx4, vtx5, vtx6, vtx7, vtx8, vtx9, vtx10, vtx11, vtx12);

                    /** links **/
                    vtx1.setOneLink(vtx2); vtx2.setOneLink(vtx1);
                    vtx2.setOneLink(vtx3); vtx3.setOneLink(vtx2);
                    vtx3.setOneLink(vtx4); vtx4.setOneLink(vtx3);
                    vtx4.setOneLink(vtx5); vtx5.setOneLink(vtx4);
                    vtx5.setOneLink(vtx6); vtx6.setOneLink(vtx5);
                    vtx6.setOneLink(vtx7); vtx7.setOneLink(vtx6);
                    vtx7.setOneLink(vtx8); vtx8.setOneLink(vtx7);
                    vtx8.setOneLink(vtx9); vtx9.setOneLink(vtx8);
                    vtx9.setOneLink(vtx1); vtx1.setOneLink(vtx9);
                    vtx10.setOneLink(vtx1); vtx1.setOneLink(vtx10);
                    vtx10.setOneLink(vtx2); vtx2.setOneLink(vtx10);
                    vtx10.setOneLink(vtx9); vtx9.setOneLink(vtx10);
                    vtx11.setOneLink(vtx4); vtx4.setOneLink(vtx11);
                    vtx11.setOneLink(vtx8); vtx8.setOneLink(vtx11);
                    vtx11.setOneLink(vtx10); vtx10.setOneLink(vtx11);
                    vtx12.setOneLink(vtx6); vtx6.setOneLink(vtx12);
                    vtx12.setOneLink(vtx8); vtx8.setOneLink(vtx12);
                }
                else if (this.surfaceChoice==2) {
                    /** strange flat **/

                    /** vertices **/
                    let vtx1 = new mathis.Vertex().setPosition(-4, -0.5, 0);
                    let vtx2 = new mathis.Vertex().setPosition(-3, 1, 0);
                    let vtx3 = new mathis.Vertex().setPosition(-1, 2.5, 0);
                    let vtx4 = new mathis.Vertex().setPosition(2, 2, 0);
                    let vtx5 = new mathis.Vertex().setPosition(3, -0.5, 0);
                    let vtx6 = new mathis.Vertex().setPosition(3, -2, 0);
                    let vtx7 = new mathis.Vertex().setPosition(2, -3, -1);
                    let vtx8 = new mathis.Vertex().setPosition(-0.5, -3, 0);
                    let vtx9 = new mathis.Vertex().setPosition(-2.5, -3, 0);
                    let vtx10 = new mathis.Vertex().setPosition(-2.5, -1, 0);
                    let vtx11 = new mathis.Vertex().setPosition(-0, 0, 0);
                    let vtx12 = new mathis.Vertex().setPosition(1.5, -1.5, 0);
                    let vtx13 = new mathis.Vertex().setPosition(3, 4, 0);
                    let vtx14 = new mathis.Vertex().setPosition(5, 3, 0);
                    let vtx15 = new mathis.Vertex().setPosition(5, 5, 0);
                    let vtx15_1 = new mathis.Vertex().setPosition(5, 6, 0);
                    let vtx16 = new mathis.Vertex().setPosition(5, 2, 0);
                    let vtx17 = new mathis.Vertex().setPosition(6, 1, 0);
                    let vtx18 = new mathis.Vertex().setPosition(-3, 3, 0);
                    let vtx19 = new mathis.Vertex().setPosition(7, 0, 0);
                    let vtx20 = new mathis.Vertex().setPosition(6, -1, 0);
                    let vtx21 = new mathis.Vertex().setPosition(-3, 5, 0);
                    let vtx101 = new mathis.Vertex().setPosition(7, 4, -1);
                    let vtx102 = new mathis.Vertex().setPosition(8, 4, -1);
                    let vtx103 = new mathis.Vertex().setPosition(7, 3, -3);
                    let vtx104 = new mathis.Vertex().setPosition(7, 5, 0);
                    let vtx105 = new mathis.Vertex().setPosition(9, 4, 0);
                    let vtx106 = new mathis.Vertex().setPosition(10, 4, 0);
                    let vtx107 = new mathis.Vertex().setPosition(10, 3, 0);
                    let vtx108 = new mathis.Vertex().setPosition(9, 5, 0);

                    mamesh = new mathis.Mamesh();
                    mamesh.vertices.push(vtx1, vtx2, vtx3, vtx4, vtx5, vtx6, vtx7, vtx8, vtx9, vtx10, vtx11, vtx12);
                    mamesh.vertices.push(vtx13, vtx14, vtx15, vtx16, vtx17, vtx18, vtx19, vtx20, vtx21, vtx15_1);
                    mamesh.vertices.push(vtx101, vtx102, vtx103, vtx104, vtx105, vtx106, vtx107, vtx108);

                    /** links **/
                    vtx1.setOneLink(vtx2); vtx2.setOneLink(vtx1);
                    vtx2.setOneLink(vtx3); vtx3.setOneLink(vtx2);
                    vtx3.setOneLink(vtx4); vtx4.setOneLink(vtx3);
                    vtx4.setOneLink(vtx5); vtx5.setOneLink(vtx4);
                    vtx5.setOneLink(vtx6); vtx6.setOneLink(vtx5);
                    vtx6.setOneLink(vtx7); vtx7.setOneLink(vtx6);
                    vtx7.setOneLink(vtx8); vtx8.setOneLink(vtx7);
                    vtx8.setOneLink(vtx9); vtx9.setOneLink(vtx8);
                    vtx9.setOneLink(vtx1); vtx1.setOneLink(vtx9);
                    vtx10.setOneLink(vtx1); vtx1.setOneLink(vtx10);
                    vtx10.setOneLink(vtx2); vtx2.setOneLink(vtx10);
                    vtx10.setOneLink(vtx9); vtx9.setOneLink(vtx10);
                    vtx11.setOneLink(vtx4); vtx4.setOneLink(vtx11);
                    vtx11.setOneLink(vtx8); vtx8.setOneLink(vtx11);
                    vtx11.setOneLink(vtx10); vtx10.setOneLink(vtx11);
                    vtx12.setOneLink(vtx6); vtx6.setOneLink(vtx12);
                    vtx12.setOneLink(vtx8); vtx8.setOneLink(vtx12);
                    vtx13.setOneLink(vtx4); vtx4.setOneLink(vtx13);
                    vtx13.setOneLink(vtx14); vtx14.setOneLink(vtx13);
                    vtx14.setOneLink(vtx15); vtx15.setOneLink(vtx14);
                    vtx15_1.setOneLink(vtx15); vtx15.setOneLink(vtx15_1);
                    vtx14.setOneLink(vtx16); vtx16.setOneLink(vtx14);
                    vtx16.setOneLink(vtx17); vtx17.setOneLink(vtx16);
                    vtx17.setOneLink(vtx19); vtx19.setOneLink(vtx17);
                    vtx20.setOneLink(vtx19); vtx19.setOneLink(vtx20);
                    vtx20.setOneLink(vtx17); vtx17.setOneLink(vtx20);
                    vtx18.setOneLink(vtx2); vtx2.setOneLink(vtx18);
                    vtx101.setOneLink(vtx102); vtx102.setOneLink(vtx101);
                    vtx102.setOneLink(vtx103); vtx103.setOneLink(vtx102);
                    vtx101.setOneLink(vtx103); vtx103.setOneLink(vtx101);
                    vtx101.setOneLink(vtx104); vtx104.setOneLink(vtx101);
                    vtx102.setOneLink(vtx105); vtx105.setOneLink(vtx102);
                    // vtx105.setOneLink(vtx106); vtx106.setOneLink(vtx105);
                    vtx107.setOneLink(vtx106); vtx106.setOneLink(vtx107);
                    vtx107.setOneLink(vtx103); vtx103.setOneLink(vtx107);
                    vtx108.setOneLink(vtx105); vtx105.setOneLink(vtx108);
                    vtx108.setOneLink(vtx106); vtx106.setOneLink(vtx108);
                    vtx101.setOneLink(vtx15); vtx15.setOneLink(vtx101);
                }
                else if (this.surfaceChoice==3) {
                    /** filled flat **/

                    /** vertices **/
                    let vtx1 = new mathis.Vertex().setPosition(-4, -0.5, 0);
                    let vtx2 = new mathis.Vertex().setPosition(-3, 1, 0);
                    let vtx3 = new mathis.Vertex().setPosition(-1, 2.5, 0);
                    let vtx4 = new mathis.Vertex().setPosition(2, 2, 0);
                    let vtx5 = new mathis.Vertex().setPosition(3, -0.5, 0);
                    let vtx6 = new mathis.Vertex().setPosition(3, -2, 0);
                    let vtx7 = new mathis.Vertex().setPosition(2, -3, -1);
                    let vtx8 = new mathis.Vertex().setPosition(-0.5, -3, 0);
                    let vtx9 = new mathis.Vertex().setPosition(-2.5, -3, 0);
                    let vtx10 = new mathis.Vertex().setPosition(-2.5, -1, 0);
                    let vtx11 = new mathis.Vertex().setPosition(-0, 0, 0);
                    let vtx12 = new mathis.Vertex().setPosition(1.5, -1.5, 0);

                    mamesh = new mathis.Mamesh();
                    mamesh.vertices.push(vtx1, vtx2, vtx3, vtx4, vtx5, vtx6, vtx7, vtx8, vtx9, vtx10, vtx11, vtx12);

                    /** links **/
                    vtx1.setOneLink(vtx2); vtx2.setOneLink(vtx1);
                    vtx2.setOneLink(vtx3); vtx3.setOneLink(vtx2);
                    vtx3.setOneLink(vtx4); vtx4.setOneLink(vtx3);
                    vtx4.setOneLink(vtx5); vtx5.setOneLink(vtx4);
                    vtx5.setOneLink(vtx6); vtx6.setOneLink(vtx5);
                    vtx6.setOneLink(vtx7); vtx7.setOneLink(vtx6);
                    vtx7.setOneLink(vtx8); vtx8.setOneLink(vtx7);
                    vtx8.setOneLink(vtx9); vtx9.setOneLink(vtx8);
                    vtx9.setOneLink(vtx1); vtx1.setOneLink(vtx9);
                    vtx10.setOneLink(vtx1); vtx1.setOneLink(vtx10);
                    vtx10.setOneLink(vtx2); vtx2.setOneLink(vtx10);
                    vtx10.setOneLink(vtx9); vtx9.setOneLink(vtx10);
                    vtx11.setOneLink(vtx4); vtx4.setOneLink(vtx11);
                    vtx11.setOneLink(vtx8); vtx8.setOneLink(vtx11);
                    vtx11.setOneLink(vtx10); vtx10.setOneLink(vtx11);
                    vtx12.setOneLink(vtx6); vtx6.setOneLink(vtx12);
                    vtx12.setOneLink(vtx8); vtx8.setOneLink(vtx12);

                    /** faces **/
                    mamesh.addATriangle(vtx1, vtx2, vtx10);
                    mamesh.addATriangle(vtx1, vtx9, vtx10);
                    mamesh.addASquare(vtx9, vtx10, vtx11, vtx8);
                    mamesh.addASquare(vtx8, vtx7, vtx6, vtx12);
                }
                else if (this.surfaceChoice==4) {
                    /** half-cylinder **/

                    let creator = new mathis.reseau.TriangulatedPolygone(10);
                    creator.nbSubdivisionInARadius = 5;
                    creator.origin = new mathis.XYZ(-Math.PI * 0.8, -1, 0);
                    creator.end = new mathis.XYZ(+Math.PI * 0.8, 1, 0);
                    mamesh = creator.go();
                    mamesh.smallestTriangles=[];

                    for (let _i = 0, _a = mamesh.vertices; _i < _a.length; _i++) {
                        let vertex = _a[_i];
                        let u = vertex.position.x;
                        let v = vertex.position.y;
                        vertex.position.x = Math.cos(u);
                        vertex.position.y = Math.sin(u);
                        vertex.position.z = v;
                    }
                }
                else if (this.surfaceChoice==5) {
                    /** moebius ring **/

                    let basis = new mathis.reseau.BasisForRegularReseau();
                    basis.origin = new mathis.XYZ(0, -1, 0);
                    basis.end = new mathis.XYZ(2 * Math.PI, 1, 0);
                    basis.nbU = 20;
                    basis.nbV = 10;
                    let creator = new mathis.reseau.Regular2d(basis);
                    creator.makeTriangleOrSquare=false;
                    mamesh = creator.go();
                    for (let _i = 0, _a = mamesh.vertices; _i < _a.length; _i++) {
                        let vertex = _a[_i];
                        let u = vertex.position.x;
                        let v = vertex.position.y;
                        vertex.position.x = (2 - v * Math.sin(u / 2)) * Math.sin(u);
                        vertex.position.y = (2 - v * Math.sin(u / 2)) * Math.cos(u);
                        vertex.position.z = v * Math.cos(u / 2);
                    }

                } else if (this.surfaceChoice==6) {

                    /** Grating and gluing example 1**/
                    let vertices0 = [];
                    let vertices1 = [];
                    let mamesh1;
                    let basis0 = new mathis.reseau.BasisForRegularReseau();
                    basis0.origin = new mathis.XYZ(-1, -0.9, 0);
                    basis0.end = new mathis.XYZ(-0.05, 1.1, 0);
                    basis0.nbU = 5;
                    basis0.nbV = 10;
                    mamesh = new mathis.reseau.Regular2d(basis0).go();
                    let basis1 = new mathis.reseau.BasisForRegularReseau();
                    basis1.origin = new mathis.XYZ(0.05, -1, 0);
                    basis1.end = new mathis.XYZ(1, 1, 0);
                    basis1.nbU = 5;
                    basis1.nbV = 10;
                    mamesh1 = new mathis.reseau.Regular2d(basis1).go();
                    vertices0 = mamesh.vertices;
                    vertices1 = mamesh1.vertices;
                    new mathis.spacialTransformations.Similitude(mamesh1.vertices, 2 * Math.PI * 0.01).goChanging();
                    let map;
                    let mapFinder = new mathis.grateAndGlue.FindSickingMapFromVertices(vertices0, vertices1);
                    mapFinder.proximityCoef = 0.9;

                    mapFinder.toleranceToBeOneOfTheClosest = 0.05;
                    map = mapFinder.go();
                    let sticker = new mathis.grateAndGlue.Sticker(mamesh, mamesh1, map);
                    sticker.goChanging();

                } else if (this.surfaceChoice==7) {

                    /** Grating and gluing example 2**/
                    let creator0 = new reseau.TriangulatedPolygone(6);
                    creator0.origin = new XYZ(-1,-1 , 0);
                    creator0.end = new XYZ(0.5,0.5, 0);
                    creator0.nbSubdivisionInARadius = 9;
                    let mamesh0 = creator0.go();
                    let creator1 = new reseau.TriangulatedPolygone(6);
                    creator1.origin = new XYZ(-0.5,-0.5 , 0);
                    creator1.end = new XYZ(1,1, 0);
                    creator1.nbSubdivisionInARadius = 5;
                    let mamesh1 = creator1.go();
                    let graterAndSticker=new grateAndGlue.ConcurrentMameshesGraterAndSticker();
                    graterAndSticker.IN_mameshes.push(mamesh0,mamesh1);
                    graterAndSticker.justGrateDoNotStick=false;
                    graterAndSticker.SUB_grater.proportionOfSeeds=[0.1,0.1];
                    graterAndSticker.proximityCoefToStick=[2];
                    graterAndSticker.toleranceToBeOneOfTheClosest=0.5;
                    graterAndSticker.suppressLinksAngularlyTooClose=false;
                    graterAndSticker.SUB_linkCleanerByAngle.suppressLinksAngularParam=2*Math.PI*0.1;

                    mamesh=graterAndSticker.goChanging()
                }

                /** Surface creation **/
                if (this.connect) {
                    let connect = new surfaceConnection.SurfaceConnectionProcess(mamesh, this.nbBiggerFacesDeleted, this.areaOrPerimeterChoice, this.fillConvexFaces);
                    mamesh = connect.go();
                }

                /** visualisation **/
                let verticesViewer = new mathis.visu3d.VerticesViewer(mamesh, this.mathisFrame.scene);
                verticesViewer.go();


                let linksViewer = new mathis.visu3d.LinksViewer(mamesh, this.mathisFrame.scene);
                linksViewer.go();

                let surfaceViewer = new mathis.visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene);
                surfaceViewer.go();
            }
        }

}

