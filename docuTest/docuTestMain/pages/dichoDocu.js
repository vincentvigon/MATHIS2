/**
* Created by vigon on 05/12/2016.
*/
var mathis;
(function (mathis) {
    var appli;
    (function (appli) {
        var DichoDocu = (function () {
            function DichoDocu(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.pageIdAndTitle = "Dichotomy";
                var several = new appli.SeveralParts();
                several.addPart(new ReseauDicho(this.mathisFrame));
                several.addPart(new SolideDicho(this.mathisFrame));
                this.severalParts = several;
            }
            DichoDocu.prototype.go = function () {
                return this.severalParts.go();
            };
            return DichoDocu;
        }());
        appli.DichoDocu = DichoDocu;
        var ReseauDicho = (function () {
            function ReseauDicho(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.NAME = "ReseauDicho";
                this.TITLE = "we do dichotomy on some square or triangle net";
                this.nbTrianglesCut = 2;
                this.$$$nbTrianglesCut = [1, 2, 3, 4, 5, 10, 16, 32, 50];
                this.squareVersusTriangle = true;
                this.$$$squareVersusTriangle = [true, false];
                this.nbInitialDicho = 1;
                this.$$$nbInitialDicho = [0, 1, 2, 3, 4];
                this.mathisFrame = mathisFrame;
            }
            ReseauDicho.prototype.goForTheFirstTime = function () {
                this.mathisFrame.clearScene();
                this.mathisFrame.addDefaultCamera();
                this.mathisFrame.addDefaultLight();
                this.go();
            };
            ReseauDicho.prototype.go = function () {
                this.mathisFrame.clearScene(false, false);
                //$$$begin
                var squareVersusTriangle = this.squareVersusTriangle;
                var creator = new mathis.reseau.Regular();
                creator.nbI = 3;
                creator.nbJ = 3;
                creator.origine = new mathis.XYZ(-1, -1, 0);
                creator.squareVersusTriangleMaille = squareVersusTriangle;
                var mamesh = creator.go();
                //n
                /**we do triangle-dichotomies several times*/
                var nbInitialDicho = this.nbInitialDicho;
                for (var i = 0; i < nbInitialDicho; i++) {
                    var dichotomer = void 0;
                    if (squareVersusTriangle)
                        dichotomer = new mathis.mameshModification.SquareDichotomer(mamesh);
                    else
                        dichotomer = new mathis.mameshModification.TriangleDichotomer(mamesh);
                    dichotomer.go();
                }
                /**again a dichotomy, but not for all triangles: we choose the first triangle in the list*/
                var nbPolygonsToCutAgain = this.nbTrianglesCut;
                var partialDichotomer;
                if (squareVersusTriangle) {
                    partialDichotomer = new mathis.mameshModification.SquareDichotomer(mamesh);
                    partialDichotomer.squareToCut = mamesh.smallestSquares.slice(0, 4 * nbPolygonsToCutAgain);
                }
                else {
                    partialDichotomer = new mathis.mameshModification.TriangleDichotomer(mamesh);
                    partialDichotomer.trianglesToCut = mamesh.smallestTriangles.slice(0, 3 * nbPolygonsToCutAgain);
                }
                partialDichotomer.go();
                //$$$end
                //$$$bh visualization
                /**we collect vertices according to their dichotomy level*/
                var verticesByDichoLevel = [];
                for (var i = 0; i < mamesh.vertices.length; i++) {
                    var vertex = mamesh.vertices[i];
                    var level = vertex.dichoLevel;
                    if (verticesByDichoLevel[level] == null)
                        verticesByDichoLevel[level] = [];
                    verticesByDichoLevel[level].push(vertex);
                }
                /**we create the visualisation, changing color according according to dichotomy level*/
                var nbLevel = verticesByDichoLevel.length;
                var colorList = [mathis.Color.names.black, mathis.Color.names.whitesmoke, mathis.Color.names.blue, mathis.Color.names.red, mathis.Color.names.orange, mathis.Color.names.violet, mathis.Color.names.beige];
                for (var level = 0; level < nbLevel; level++) {
                    var viewer = new mathis.visu3d.VerticesViewer(mamesh, this.mathisFrame.scene);
                    viewer.color = new mathis.Color(colorList[level]); //new Color(new HSV_01((level+1)/nbLevel,1,1))
                    viewer.vertices = verticesByDichoLevel[level];
                    viewer.go();
                }
                new mathis.visu3d.LinksViewer(mamesh, this.mathisFrame.scene).go();
                new mathis.visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene).go();
                //$$$eh
                //$$$bt
                this._nbSquares = mamesh.smallestSquares.length / 4;
                this._nbTriangles = mamesh.smallestTriangles.length / 3;
                //$$$et
            };
            return ReseauDicho;
        }());
        var SolideDicho = (function () {
            function SolideDicho(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.NAME = "SolideDicho";
                this.TITLE = "we do dichotomy on some solid";
                this.polyhedronType = "icosahedron";
                this.$$$polyhedronType = mathis.polyhedron.platonic;
                this.nbInitialDicho = 1;
                this.$$$nbInitialDicho = [0, 1, 2, 3, 4];
                this.mathisFrame = mathisFrame;
            }
            SolideDicho.prototype.goForTheFirstTime = function () {
                this.mathisFrame.clearScene();
                this.mathisFrame.addDefaultCamera();
                this.mathisFrame.addDefaultLight();
                this.go();
            };
            SolideDicho.prototype.go = function () {
                this.mathisFrame.clearScene(false, false);
                //$$$begin
                var creator = new mathis.polyhedron.Polyhedron(this.polyhedronType);
                var mamesh = creator.go();
                //n
                var nbInitialDicho = this.nbInitialDicho;
                /**we do triangle-dichotomies several times*/
                for (var i = 0; i < nbInitialDicho; i++) {
                    if (mamesh.smallestTriangles.length > 0)
                        new mathis.mameshModification.TriangleDichotomer(mamesh).go();
                }
                //$$$end
                //$$$bh visualization
                /**we collect vertices according to their dichotomy level*/
                var verticesByDichoLevel = [];
                for (var i = 0; i < mamesh.vertices.length; i++) {
                    var vertex = mamesh.vertices[i];
                    var level = vertex.dichoLevel;
                    if (verticesByDichoLevel[level] == null)
                        verticesByDichoLevel[level] = [];
                    verticesByDichoLevel[level].push(vertex);
                }
                /**we create the visualisation, changing color according according to dichotomy level*/
                var nbLevel = verticesByDichoLevel.length;
                var colorList = [mathis.Color.names.black, mathis.Color.names.whitesmoke, mathis.Color.names.blue, mathis.Color.names.red, mathis.Color.names.orange, mathis.Color.names.violet, mathis.Color.names.beige];
                for (var level = 0; level < nbLevel; level++) {
                    var viewer = new mathis.visu3d.VerticesViewer(mamesh, this.mathisFrame.scene);
                    viewer.color = new mathis.Color(colorList[level]);
                    viewer.vertices = verticesByDichoLevel[level];
                    viewer.go();
                }
                new mathis.visu3d.LinksViewer(mamesh, this.mathisFrame.scene).go();
                new mathis.visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene).go();
                //$$$eh
            };
            return SolideDicho;
        }());
    })(appli = mathis.appli || (mathis.appli = {}));
})(mathis || (mathis = {}));
