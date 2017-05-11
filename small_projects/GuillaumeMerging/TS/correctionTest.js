/**
 * Created by Kieffer on 07/05/2017.
 */
var mathis;
(function (mathis) {
    //
    // export class CorrectionTest implements OnePage{
    //     pageIdAndTitle="SimpleCorrectTestDocu";
    //     severalParts:SeveralParts;
    //
    //     constructor(private mathisFrame:MathisFrame){
    //         let several=new SeveralParts();
    //         // several.addPart(new AutomaticLink(this.mathisFrame))
    //         // several.addPart(new AutomaticPolygonLink(this.mathisFrame))
    //         several.addPart(new ConnectorPieceDocu(this.mathisFrame));
    //         //several.addPart(new WhatAreOppositeLinks(this.mathisFrame))
    //         this.severalParts=several
    //     }
    //
    //     go(){
    //         return this.severalParts.go()
    //     }
    //
    // }
    var Choices = mathis.appli.Choices;
    var ConnectorPiece = (function () {
        function ConnectorPiece(mathisFrame) {
            this.mathisFrame = mathisFrame;
            this.NAME = "CorrectionTesting";
            this.TITLE = "How correct invalid Mamesh";
            //polyhedronType=creation3D.ArchimedeanSolidType.TruncatedIcosidodecahedron
            //$$$polyhedronType=new Choices(allIntegerValueOfEnume(creation3D.ArchimedeanSolidType),{visualValues:allStringValueOfEnume(creation3D.ArchimedeanSolidType)})
            this.connect = false;
            this.$$$connect = new Choices([true, false], { type: appli.ChoicesOptionsType.button, visualValues: ['T', 'F'], containerName: 'N' });
            this.nbBiggerFacesDeleted = 2;
            this.$$$nbBiggerFacesDeleted = [0, 1, 2, 4, 6, 8];
            this.surfaceChoice = 1;
            this.$$$surfaceChoice = new Choices([1, 2, 3], { visualValues: ['plat', 'rond', 'moebius'] });
            this.mathisFrame = mathisFrame;
        }
        ConnectorPiece.prototype.goForTheFirstTime = function () {
            var camera = this.mathisFrame.scene.activeCamera;
            camera.changePosition(new XYZ(0, 0, -8));
            this.go();
        };
        ConnectorPiece.prototype.go = function () {
            this.mathisFrame.clearScene(false, false);
            var mamesh;
            if (this.surfaceChoice == 1) {
                /** Création des points de la surface **/
                var vtx1 = new mathis.Vertex().setPosition(-4, -0.5, 0);
                var vtx2 = new mathis.Vertex().setPosition(-3, 1, 0);
                var vtx3 = new mathis.Vertex().setPosition(-1, 2.5, 0);
                var vtx4 = new mathis.Vertex().setPosition(2, 2, 0);
                var vtx5 = new mathis.Vertex().setPosition(3, -0.5, 0);
                var vtx6 = new mathis.Vertex().setPosition(3, -2, 0);
                var vtx7 = new mathis.Vertex().setPosition(2, -3, -1);
                var vtx8 = new mathis.Vertex().setPosition(-0.5, -3, 0);
                var vtx9 = new mathis.Vertex().setPosition(-2.5, -3, 0);
                var vtx10 = new mathis.Vertex().setPosition(-2.5, -1, 0);
                var vtx11 = new mathis.Vertex().setPosition(-0, 0, 0);
                var vtx12 = new mathis.Vertex().setPosition(1.5, -1.5, 0);
                var vtx13 = new mathis.Vertex().setPosition(3, 4, 0);
                var vtx14 = new mathis.Vertex().setPosition(5, 3, 0);
                var vtx15 = new mathis.Vertex().setPosition(5, 5, 0);
                var vtx16 = new mathis.Vertex().setPosition(5, 2, 0);
                var vtx17 = new mathis.Vertex().setPosition(6, 1, 0);
                var vtx18 = new mathis.Vertex().setPosition(-3, 3, 0);
                var vtx19 = new mathis.Vertex().setPosition(7, 0, 0);
                var vtx20 = new mathis.Vertex().setPosition(6, -1, 0);
                var vtx21 = new mathis.Vertex().setPosition(10, 10, 0);
                mamesh = new mathis.Mamesh();
                mamesh.vertices.push(vtx1, vtx2, vtx3, vtx4, vtx5, vtx6, vtx7, vtx8, vtx9, vtx10, vtx11, vtx12);
                mamesh.vertices.push(vtx13, vtx14, vtx15, vtx16, vtx17, vtx18, vtx19, vtx20, vtx21);
                /** Création des liens de la surface **/
                vtx1.setOneLink(vtx2);
                vtx2.setOneLink(vtx1);
                vtx2.setOneLink(vtx3);
                vtx3.setOneLink(vtx2);
                vtx3.setOneLink(vtx4);
                vtx4.setOneLink(vtx3);
                vtx4.setOneLink(vtx5);
                vtx5.setOneLink(vtx4);
                vtx5.setOneLink(vtx6);
                vtx6.setOneLink(vtx5);
                vtx6.setOneLink(vtx7);
                vtx7.setOneLink(vtx6);
                vtx7.setOneLink(vtx8);
                vtx8.setOneLink(vtx7);
                vtx8.setOneLink(vtx9);
                vtx9.setOneLink(vtx8);
                vtx9.setOneLink(vtx1);
                vtx1.setOneLink(vtx9);
                vtx10.setOneLink(vtx1);
                vtx1.setOneLink(vtx10);
                vtx10.setOneLink(vtx2);
                vtx2.setOneLink(vtx10);
                vtx10.setOneLink(vtx9);
                vtx9.setOneLink(vtx10);
                vtx11.setOneLink(vtx4);
                vtx4.setOneLink(vtx11);
                vtx11.setOneLink(vtx8);
                vtx8.setOneLink(vtx11);
                vtx11.setOneLink(vtx10);
                vtx10.setOneLink(vtx11);
                vtx12.setOneLink(vtx6);
                vtx6.setOneLink(vtx12);
                vtx12.setOneLink(vtx8);
                vtx8.setOneLink(vtx12);
                vtx13.setOneLink(vtx4);
                vtx4.setOneLink(vtx13);
                vtx13.setOneLink(vtx14);
                vtx14.setOneLink(vtx13);
                vtx14.setOneLink(vtx15);
                vtx15.setOneLink(vtx14);
                vtx14.setOneLink(vtx16);
                vtx16.setOneLink(vtx14);
                vtx16.setOneLink(vtx17);
                vtx17.setOneLink(vtx16);
                vtx17.setOneLink(vtx19);
                vtx19.setOneLink(vtx17);
                vtx20.setOneLink(vtx19);
                vtx19.setOneLink(vtx20);
                vtx20.setOneLink(vtx17);
                vtx17.setOneLink(vtx20);
                vtx18.setOneLink(vtx2);
                vtx2.setOneLink(vtx18);
            }
            else if (this.surfaceChoice == 2) {
                /** vague **/
                var creator = new mathis.reseau.TriangulatedPolygone(10);
                creator.nbSubdivisionInARadius = 5;
                creator.origin = new mathis.XYZ(-Math.PI * 0.8, -1, 0);
                creator.end = new mathis.XYZ(+Math.PI * 0.8, 1, 0);
                mamesh = creator.go();
                mamesh.smallestTriangles = [];
                for (var _i = 0, _a = mamesh.vertices; _i < _a.length; _i++) {
                    var vertex = _a[_i];
                    var u = vertex.position.x;
                    var v = vertex.position.y;
                    vertex.position.x = Math.cos(u);
                    vertex.position.y = Math.sin(u);
                    vertex.position.z = v;
                }
            }
            else if (this.surfaceChoice == 3) {
                /** anneau **/
                var basis = new mathis.reseau.BasisForRegularReseau();
                basis.origin = new mathis.XYZ(0, -1, 0);
                basis.end = new mathis.XYZ(2 * Math.PI, 1, 0);
                basis.nbI = 20;
                basis.nbJ = 10;
                var creator = new mathis.reseau.Regular(basis);
                creator.makeTriangleOrSquare = false;
                mamesh = creator.go();
                for (var _i = 0, _a = mamesh.vertices; _i < _a.length; _i++) {
                    var vertex = _a[_i];
                    var u = vertex.position.x;
                    var v = vertex.position.y;
                    vertex.position.x = (2 - v * Math.sin(u / 2)) * Math.sin(u);
                    vertex.position.y = (2 - v * Math.sin(u / 2)) * Math.cos(u);
                    vertex.position.z = v * Math.cos(u / 2);
                }
            }
            if (this.connect) {
                var connect = new surfaceConnection.SurfaceConnectionProcess(mamesh, this.nbBiggerFacesDeleted);
                mamesh = connect.go();
            }
            /** visualisation basique **/
            var choiceVertexVizu = 0;
            if (choiceVertexVizu == 0) {
                var verticesViewer = new mathis.visu3d.VerticesViewer(mamesh, this.mathisFrame.scene);
                verticesViewer.go();
            }
            var linksViewer = new mathis.visu3d.LinksViewer(mamesh, this.mathisFrame.scene);
            linksViewer.go();
            var surfaceViewer = new mathis.visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene);
            surfaceViewer.go();
        };
        return ConnectorPiece;
    }());
    mathis.ConnectorPiece = ConnectorPiece;
})(mathis || (mathis = {}));
