/**
 * Created by vigon on 26/12/2016.
 */
/**
 * Created by vigon on 22/12/2016.
 */
/**
 * Created by vigon on 21/11/2016.
 */
var mathis;
(function (mathis) {
    var appli;
    (function (appli) {
        var LinesViewingDocu = (function () {
            function LinesViewingDocu(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.pageIdAndTitle = "Lines viewing";
                var severalParts = new appli.SeveralParts();
                severalParts.addPart(new ChoseColorOfLinesAccordingToLevel(this.mathisFrame));
                severalParts.addPart(new JustTheSizeOfLines(this.mathisFrame));
                severalParts.addPart(new ChoseColorOfLinesAccordingToSymmetries(this.mathisFrame));
                severalParts.addPart(new ChoseColorOfLinesBifurcation(this.mathisFrame));
                severalParts.addComment("The lineViewer call the method mamesh.fillLineCatalogue() which compute\n                   all lines passing throw vertices of the mamesh. But you can decide to fill the catalogue before\n                   to call the viewer, and to not add all the lines. Here is some examples.", "The lineViewer call the method mamesh");
                severalParts.addPart(new DoNotDrawAllTheLines(this.mathisFrame));
                severalParts.addPart(new DoNotDrawAllTheLines3d(this.mathisFrame), true);
                severalParts.addPart(new DrawOnlyLinePassingInside(this.mathisFrame));
                this.severalParts = severalParts;
            }
            LinesViewingDocu.prototype.go = function () {
                return this.severalParts.go();
            };
            return LinesViewingDocu;
        }());
        appli.LinesViewingDocu = LinesViewingDocu;
        var JustTheSizeOfLines = (function () {
            function JustTheSizeOfLines(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.NO_TEST = true;
                this.NAME = "JustTheSizeOfLines";
                this.TITLE = "We change radius and interpolation style";
                this.nbSides = 4;
                this.$$$nbSides = [4, 7, 10];
                this.nbSubdivisionInARadius = 3;
                this.$$$nbSubdivisionInARadius = [2, 3, 5];
                // color=Color.names.rebeccapurple
                // $$$color=new Choices([Color.names.rebeccapurple,Color.names.rosybrown,Color.names.darkorange],
                //     {'before':'Color.names.','visualValues':['rebeccapurple','rosybrown','darkorange']})
                this.radiusProp = 0.05;
                this.$$$radiusProp = [0.01, 0.05, 0.1];
                this.constantRadius = null;
                this.$$$constantRadius = [null, 0.01, 0.02, 0.05];
                this.isThin = false;
                this.$$$isThin = [true, false];
                this.radiusFunction = null;
                this.$$$radiusFunction = [null, function (i, alpha) { return 0.02 * Math.sin(2 * Math.PI * alpha); }];
                this.interpolationStyle = mathis.geometry.InterpolationStyle.octavioStyle;
                this.$$$interpolationStyle = new appli.Choices(mathis.allIntegerValueOfEnume(mathis.geometry.InterpolationStyle), { "before": "geometry.InterpolationStyle.", "visualValues": mathis.allStringValueOfEnume(mathis.geometry.InterpolationStyle) });
            }
            JustTheSizeOfLines.prototype.goForTheFirstTime = function () {
                this.mathisFrame.clearScene();
                this.mathisFrame.addDefaultCamera();
                this.mathisFrame.addDefaultLight();
                this.go();
            };
            JustTheSizeOfLines.prototype.go = function () {
                this.mathisFrame.clearScene(false, false);
                //$$$b
                var creator = new mathis.reseau.TriangulatedPolygone(this.nbSides);
                creator.nbSubdivisionInARadius = this.nbSubdivisionInARadius;
                var mamesh = creator.go();
                //n
                var linesViewer = new mathis.visu3d.LinesViewer(mamesh, this.mathisFrame.scene);
                linesViewer.interpolationOption.interpolationStyle = this.interpolationStyle;
                //n
                /**to have line of one pixel*/
                linesViewer.isThin = this.isThin;
                /**useless is previous is not false :
                 * argument 'i' is the index of the line in the lineCatalogue of the mamesh (see further)
                 * argument 'alpha' in range [0,1] is the position in the line
                 * return the radius of the i-th lines at the position alpha*/
                linesViewer.radiusFunction = this.radiusFunction;
                /**useless if one of the previous is not null/false*/
                linesViewer.constantRadius = this.constantRadius;
                /**useless if one of the previous is not null/false*/
                linesViewer.radiusProp = this.radiusProp;
                linesViewer.go();
                //$$$e
                //$$$bh vertices viewing
                var verticesViewer = new mathis.visu3d.VerticesViewer(mamesh, this.mathisFrame.scene);
                verticesViewer.radiusProp = 0.1;
                verticesViewer.go();
                //$$$eh
            };
            return JustTheSizeOfLines;
        }());
        var DoNotDrawAllTheLines = (function () {
            function DoNotDrawAllTheLines(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.NAME = "DoNotDrawAllTheLines";
                this.TITLE = "We construct only the lines starting from selected vertices.";
                this.nbI = 10;
                this.$$$nbI = [5, 10, 12, 15, 20];
                this.selectionChoice = 0;
                this.$$$selectionChoice = [0, 1, 2];
            }
            DoNotDrawAllTheLines.prototype.goForTheFirstTime = function () {
                this.mathisFrame.clearScene();
                this.mathisFrame.addDefaultCamera();
                this.mathisFrame.addDefaultLight();
                this.go();
            };
            DoNotDrawAllTheLines.prototype.go = function () {
                this.mathisFrame.clearScene(false, false);
                //$$$b
                var basis = new mathis.reseau.BasisForRegularReseau();
                basis.nbI = this.nbI;
                basis.nbJ = basis.nbI;
                basis.origin = new mathis.XYZ(-0.7, -0.7, 0);
                basis.end = new mathis.XYZ(+0.7, +0.7, 0);
                var creator = new mathis.reseau.Regular(basis);
                var mamesh = creator.go();
                var lineBuilder = new mathis.lineModule.LineComputer(mamesh);
                lineBuilder.startingVertices = [];
                var selectionChoice = this.selectionChoice;
                for (var i = 0; i < mamesh.vertices.length; i++) {
                    var vertex = mamesh.vertices[i];
                    if (selectionChoice == 0) {
                        if (vertex.param.x % 3 == 0 && vertex.param.y == 0)
                            lineBuilder.startingVertices.push(vertex);
                    }
                    else if (selectionChoice == 1) {
                        if (vertex.param.x % 3 == 0 && vertex.param.y == 0)
                            lineBuilder.startingVertices.push(vertex);
                        if (vertex.param.x == 0 && vertex.param.y % 3 == 0)
                            lineBuilder.startingVertices.push(vertex);
                    }
                    else if (selectionChoice == 2) {
                        if (vertex.position.length() < 0.15)
                            lineBuilder.startingVertices.push(vertex);
                    }
                }
                mamesh.lines = lineBuilder.go();
                //n
                var linesViewer = new mathis.visu3d.LinesViewer(mamesh, this.mathisFrame.scene);
                linesViewer.go();
                //$$$e
                //$$$bh vertices viewing
                var verticesViewer = new mathis.visu3d.VerticesViewer(mamesh, this.mathisFrame.scene);
                verticesViewer.radiusProp = 0.1;
                verticesViewer.go();
                //$$$eh
                //$$$bt
                this._nbLines = mamesh.lines.length;
                //$$$et
            };
            return DoNotDrawAllTheLines;
        }());
        var DoNotDrawAllTheLines3d = (function () {
            function DoNotDrawAllTheLines3d(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.NAME = "DoNotDrawAllTheLines3d";
                this.TITLE = "variant with 3d cartesian reseau";
                this.nbI = 10;
                this.$$$nbI = [5, 10, 12, 15, 20];
                this.selectionChoice = 0;
                this.$$$selectionChoice = [0, 1, 2];
            }
            DoNotDrawAllTheLines3d.prototype.goForTheFirstTime = function () {
                this.mathisFrame.clearScene();
                this.mathisFrame.addDefaultCamera();
                this.mathisFrame.addDefaultLight();
                this.go();
            };
            DoNotDrawAllTheLines3d.prototype.go = function () {
                this.mathisFrame.clearScene(false, false);
                //$$$b
                var creator = new mathis.reseau.Regular3D();
                creator.nbI = this.nbI;
                creator.nbJ = creator.nbI;
                creator.nbK = creator.nbI;
                creator.Vi = new mathis.XYZ(0.1, 0, 0);
                creator.Vj = new mathis.XYZ(0, 0.1, 0);
                creator.Vk = new mathis.XYZ(0, 0, 0.1);
                var mamesh = creator.go();
                var lineBuilder = new mathis.lineModule.LineComputer(mamesh);
                lineBuilder.startingVertices = [];
                var selectionChoice = this.selectionChoice;
                for (var i = 0; i < mamesh.vertices.length; i++) {
                    var vertex = mamesh.vertices[i];
                    if (selectionChoice == 0) {
                        if (vertex.param.x % 3 == 0 && vertex.param.y == 0)
                            lineBuilder.startingVertices.push(vertex);
                    }
                    else if (selectionChoice == 1) {
                        if (vertex.param.x % 3 == 0 && vertex.param.y == 0 && vertex.param.z == 0)
                            lineBuilder.startingVertices.push(vertex);
                        if (vertex.param.x == 0 && vertex.param.y % 3 == 0 && vertex.param.z == 0)
                            lineBuilder.startingVertices.push(vertex);
                        if (vertex.param.x == 0 && vertex.param.y == 0 && vertex.param.z % 3 == 0)
                            lineBuilder.startingVertices.push(vertex);
                    }
                    else if (selectionChoice == 2) {
                        if (vertex.position.length() < 0.25)
                            lineBuilder.startingVertices.push(vertex);
                    }
                }
                mamesh.lines = lineBuilder.go();
                //n
                var linesViewer = new mathis.visu3d.LinesViewer(mamesh, this.mathisFrame.scene);
                linesViewer.go();
                //$$$e
                //$$$bh vertices viewing
                var verticesViewer = new mathis.visu3d.VerticesViewer(mamesh, this.mathisFrame.scene);
                verticesViewer.radiusProp = 0.1;
                verticesViewer.go();
                //$$$eh
                //$$$bt
                this._nbLines = mamesh.lines.length;
                //$$$et
            };
            return DoNotDrawAllTheLines3d;
        }());
        var DrawOnlyLinePassingInside = (function () {
            function DrawOnlyLinePassingInside(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.NAME = "DrawOnlyLinePassingInside";
                this.TITLE = "We draw lines only passing inside selected vertices";
                this.nbI = 10;
                this.$$$nbI = [5, 10, 12, 15, 20];
                this.selectionChoice = 0;
                this.$$$selectionChoice = [0, 1, 2];
            }
            DrawOnlyLinePassingInside.prototype.goForTheFirstTime = function () {
                this.mathisFrame.clearScene();
                this.mathisFrame.addDefaultCamera();
                this.mathisFrame.addDefaultLight();
                this.go();
            };
            DrawOnlyLinePassingInside.prototype.go = function () {
                this.mathisFrame.clearScene(false, false);
                //$$$b
                var basis = new mathis.reseau.BasisForRegularReseau();
                basis.nbI = this.nbI;
                basis.nbJ = basis.nbI;
                basis.origin = new mathis.XYZ(-0.7, -0.7, 0);
                basis.end = new mathis.XYZ(+0.7, +0.7, 0);
                var creator = new mathis.reseau.Regular(basis);
                var mamesh = creator.go();
                var lineBuilder = new mathis.lineModule.LineComputer(mamesh);
                lineBuilder.restrictLinesToTheseVertices = [];
                var selectionChoice = this.selectionChoice;
                for (var i = 0; i < mamesh.vertices.length; i++) {
                    var vertex = mamesh.vertices[i];
                    if (selectionChoice == 0) {
                        if (vertex.param.x <= 3 && (vertex.param.y <= 3 || vertex.param.y > 5))
                            lineBuilder.restrictLinesToTheseVertices.push(vertex);
                    }
                    else if (selectionChoice == 1) {
                        if (vertex.position.length() > 0.5)
                            lineBuilder.restrictLinesToTheseVertices.push(vertex);
                    }
                    else if (selectionChoice == 2) {
                        if (vertex.position.length() < 0.5)
                            lineBuilder.restrictLinesToTheseVertices.push(vertex);
                    }
                }
                mamesh.lines = lineBuilder.go();
                //$$$e
                //$$$bh visualization
                var linesViewer = new mathis.visu3d.LinesViewer(mamesh, this.mathisFrame.scene);
                linesViewer.go();
                var verticesViewer = new mathis.visu3d.VerticesViewer(mamesh, this.mathisFrame.scene);
                verticesViewer.radiusProp = 0.1;
                verticesViewer.go();
                //$$$eh
                //$$$bt
                this._nbLines = mamesh.lines.length;
                //$$$et
            };
            return DrawOnlyLinePassingInside;
        }());
        var ChoseColorOfLinesAccordingToLevel = (function () {
            function ChoseColorOfLinesAccordingToLevel(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.NO_TEST = true;
                this.NAME = "ChoseColorOfLinesAccordingToLevel";
                this.TITLE = "colors of vertical lines are chosen via lineToColor. color of horizontal lines are chosen via a lineToLevel";
                this.nbI = 11;
                this.$$$nbI = new appli.Choices([11, 5, 15]);
            }
            ChoseColorOfLinesAccordingToLevel.prototype.goForTheFirstTime = function () {
                this.mathisFrame.clearScene();
                this.mathisFrame.addDefaultCamera();
                this.mathisFrame.addDefaultLight();
                this.go();
            };
            ChoseColorOfLinesAccordingToLevel.prototype.go = function () {
                this.mathisFrame.clearScene(false, false);
                //$$$bh mamesh creation
                var basis = new mathis.reseau.BasisForRegularReseau();
                basis.nbI = this.nbI;
                basis.nbJ = 11;
                basis.origin = new mathis.XYZ(-1, -1, 0);
                basis.end = new mathis.XYZ(1, 1, 0);
                var creator = new mathis.reseau.Regular(basis);
                var mamesh = creator.go();
                //$$$eh
                //$$$b
                mamesh.fillLineCatalogue();
                //n
                var lineViewerHorizontal = new mathis.visu3d.LinesViewer(mamesh, this.mathisFrame.scene);
                lineViewerHorizontal.lineToLevel = new mathis.HashMap();
                var lineViewerVertical = new mathis.visu3d.LinesViewer(mamesh, this.mathisFrame.scene);
                lineViewerVertical.lineToColor = new mathis.HashMap();
                for (var i = 0; i < mamesh.lines.length; i++) {
                    var line = mamesh.lines[i];
                    var isHorizontal = (line.getVertex(0).param.y == line.getVertex(1).param.y);
                    if (isHorizontal) {
                        lineViewerHorizontal.lineToLevel.putValue(line, line.getVertex(0).param.y);
                    }
                    else {
                        if (line.getVertex(0).param.x % 2 == 0)
                            lineViewerVertical.lineToColor.putValue(line, new mathis.Color(mathis.Color.names.black));
                        else
                            lineViewerVertical.lineToColor.putValue(line, new mathis.Color(mathis.Color.names.whitesmoke));
                    }
                }
                /**Levels are transformed into  colors via the default color map*/
                lineViewerHorizontal.go();
                lineViewerVertical.go();
                //$$$e
                //$$$bh vertices visualization
                var verticesViewer = new mathis.visu3d.VerticesViewer(mamesh, this.mathisFrame.scene);
                verticesViewer.radiusProp = 0.1;
                verticesViewer.go();
                //$$$eh
            };
            return ChoseColorOfLinesAccordingToLevel;
        }());
        var ChoseColorOfLinesAccordingToSymmetries = (function () {
            function ChoseColorOfLinesAccordingToSymmetries(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.NAME = "ChoseColorOfLinesAccordingToSymmetries";
                this.TITLE = "We color symmetric lines with the same color";
                // nbI = 11
                // $$$nbI=new Choices([11,5,15])
                // oneMoreVertexForOddLine=false
                // $$$oneMoreVertexForOddLine=new Choices([true,false])
                // squareMaille=true
                // $$$squareMaille=new Choices([true,false])
                // Vj=new XYZ(0,0.1,0)
                // $$$Vj=new Choices([new XYZ(0,0.1,0),new XYZ(0.05,0.1,0)],{"before":"new mathis.XYZ"})
                this.selectionChoice = 0;
                this.$$$selectionChoice = [0, 1, 2];
                this.nbSubdivisionInARadius = 4;
                this.$$$nbSubdivisionInARadius = [3, 4, 6, 8];
                this.nbSides = 4;
                this.$$$nbSides = [4, 6, 8, 10];
            }
            ChoseColorOfLinesAccordingToSymmetries.prototype.goForTheFirstTime = function () {
                this.mathisFrame.clearScene();
                this.mathisFrame.addDefaultCamera();
                this.mathisFrame.addDefaultLight();
                this.go();
            };
            ChoseColorOfLinesAccordingToSymmetries.prototype.go = function () {
                this.mathisFrame.clearScene(false, false);
                //$$$b
                var creator = new mathis.reseau.TriangulatedPolygone(this.nbSides);
                creator.nbSubdivisionInARadius = this.nbSubdivisionInARadius;
                var mamesh = creator.go();
                mamesh.fillLineCatalogue();
                var lineColorIndexer = new mathis.lineModule.CreateAColorIndexRespectingBifurcationsAndSymmetries(mamesh);
                var symmetriesChoice = this.selectionChoice;
                if (symmetriesChoice == 0) {
                    lineColorIndexer.symmetries = [function (a) { return new mathis.XYZ(-a.x, a.y, a.z); }];
                }
                else if (symmetriesChoice == 1) {
                    lineColorIndexer.symmetries = [function (a) { return new mathis.XYZ(-a.x, a.y, a.z); }, function (a) { return new mathis.XYZ(a.x, -a.y, a.z); }];
                }
                else if (symmetriesChoice == 2) {
                    lineColorIndexer.symmetries = [function (a) { return new mathis.XYZ(-a.x, a.y, a.z); }, function (a) { return new mathis.XYZ(a.x, -a.y, a.z); }, function (a) { return new mathis.XYZ(-a.x, -a.y, a.z); }];
                }
                //TODO : do not work as expected
                var linesViewer = new mathis.visu3d.LinesViewer(mamesh, this.mathisFrame.scene);
                linesViewer.lineToLevel = lineColorIndexer.go();
                linesViewer.go();
                //$$$e
                //$$$bh vertices visualization
                var verticesViewer = new mathis.visu3d.VerticesViewer(mamesh, this.mathisFrame.scene);
                verticesViewer.radiusProp = 0.1;
                verticesViewer.go();
                //$$$eh
            };
            return ChoseColorOfLinesAccordingToSymmetries;
        }());
        var ChoseColorOfLinesBifurcation = (function () {
            function ChoseColorOfLinesBifurcation(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.NAME = "ChoseColorOfLinesBifurcation";
                this.TITLE = "We color bifurcation with the same color";
                this.nbSides = 7;
                this.$$$nbSides = [4, 7, 10];
                this.nbSubdivisionInARadius = 3;
                this.$$$nbSubdivisionInARadius = [2, 3, 5];
            }
            ChoseColorOfLinesBifurcation.prototype.goForTheFirstTime = function () {
                this.mathisFrame.clearScene();
                this.mathisFrame.addDefaultCamera();
                this.mathisFrame.addDefaultLight();
                this.go();
            };
            ChoseColorOfLinesBifurcation.prototype.go = function () {
                this.mathisFrame.clearScene(false, false);
                //$$$b
                var creator = new mathis.reseau.TriangulatedPolygone(this.nbSides);
                creator.nbSubdivisionInARadius = this.nbSubdivisionInARadius;
                var mamesh = creator.go();
                /**random suppression of some links*/
                var random = new mathis.proba.Random(6537);
                for (var i = 0; i < mamesh.vertices.length; i++) {
                    var vertex = mamesh.vertices[i];
                    for (var j = 0; j < vertex.links.length; j++) {
                        if (random.pseudoRand() < 0.4) {
                            mathis.Vertex.separateTwoVoisins(vertex, vertex.links[j].to);
                        }
                    }
                }
                /**we suppress all opposite and recreate them using angles.
                 * This will naturally create bifurcations*/
                mamesh.clearOppositeInLinks();
                var associer = new mathis.linkModule.OppositeLinkAssocierByAngles(mamesh.vertices);
                associer.canCreateBifurcations = true; //(default value)
                associer.goChanging();
                /** we compute lines. Can also be done via mamesh.fillLineCatalogue */
                var lineBuilder = new mathis.lineModule.LineComputer(mamesh);
                lineBuilder.lookAtBifurcation = true; //(default value)
                mamesh.lines = lineBuilder.go();
                //n
                /** here we create  line-index : two lines issue of a bifurcation have a same index.
                 * This will lead to a same color */
                var linesViewer = new mathis.visu3d.LinesViewer(mamesh, this.mathisFrame.scene);
                var lineColorIndexer = new mathis.lineModule.CreateAColorIndexRespectingBifurcationsAndSymmetries(mamesh);
                linesViewer.lineToLevel = lineColorIndexer.go();
                linesViewer.go();
                //$$$e
                //$$$bh vertices visualization
                var verticesViewer = new mathis.visu3d.VerticesViewer(mamesh, this.mathisFrame.scene);
                verticesViewer.radiusProp = 0.1;
                verticesViewer.go();
                //$$$eh
                //$$$bt
                this._nbLevels = mathis.tab.maxValue(linesViewer.lineToLevel.allValues()) + 1;
                //$$$et
            };
            return ChoseColorOfLinesBifurcation;
        }());
    })(appli = mathis.appli || (mathis.appli = {}));
})(mathis || (mathis = {}));
