/**
 * Created by vigon on 05/12/2016.
 */
var mathis;
(function (mathis) {
    var appli;
    (function (appli) {
        var GraphDistance = (function () {
            function GraphDistance(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.pageIdAndTitle = "Distances, geodesics and connectivity in graphs";
                var several = new appli.SeveralParts();
                several.addPart(new GeodesicDocu(this.mathisFrame));
                several.addPart(new GeodesicGroupDocu(this.mathisFrame));
                several.addPart(new CornerBorderCenterForPolygone(this.mathisFrame));
                //several.addPart(new CornerBorderCenterForReseau(this.mathisFrame),true)
                several.addPart(new TwoGraphDistances(this.mathisFrame));
                several.addPart(new DiameterDocu(this.mathisFrame));
                several.addPart(new PercoForReseau(this.mathisFrame));
                this.severalParts = several;
            }
            GraphDistance.prototype.go = function () {
                return this.severalParts.go();
            };
            return GraphDistance;
        }());
        appli.GraphDistance = GraphDistance;
        var GeodesicDocu = (function () {
            function GeodesicDocu(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.NAME = "GeodesicDocu";
                this.TITLE = "Compute distances and geodesics between vertices";
                this.nbSides = 4;
                this.$$$nbSides = [4, 6, 8, 10];
                this.nbSubdivisionInARadius = 7;
                this.$$$nbSubdivisionInARadius = [3, 5, 7, 9, 11];
                // marker=Vertex.Markers.border
                // $$$marker=new Choices([Vertex.Markers.border,Vertex.Markers.corner,Vertex.Markers.center],{"before":"Vertex.Markers.",visualValues:["border","corner","center"]})
                this.randomSeed = 38434;
                this.$$$randomSeed = [38434, 984651, 3481, 9846513, 684123];
                this.onlyOneGeodesic = false;
                this.$$$onlyOneGeodesic = [true, false];
                this.mathisFrame = mathisFrame;
            }
            GeodesicDocu.prototype.goForTheFirstTime = function () {
                this.mathisFrame.clearScene();
                this.mathisFrame.addDefaultCamera();
                this.mathisFrame.addDefaultLight();
                this.go();
            };
            GeodesicDocu.prototype.go = function () {
                this.mathisFrame.clearScene(false, false);
                var mathisFrame = this.mathisFrame;
                //$$$begin
                var creator = new mathis.reseau.TriangulatedPolygone(this.nbSides);
                creator.origin = new mathis.XYZ(-1, -1, 0);
                creator.end = new mathis.XYZ(1, 1, 0);
                creator.nbSubdivisionInARadius = this.nbSubdivisionInARadius;
                var mamesh = creator.go();
                var distances = new mathis.graph.DistancesBetweenAllVertices(mamesh.vertices);
                distances.go();
                var random = new mathis.proba.Random(this.randomSeed);
                var vertex0 = mamesh.vertices[random.pseudoRandInt(mamesh.vertices.length)];
                var vertex1 = mamesh.vertices[random.pseudoRandInt(mamesh.vertices.length)];
                mathisFrame.messageDiv.append("distance between vertex0 and vertex1:" + distances.OUT_distance(vertex0, vertex1));
                mathisFrame.messageDiv.append("graph diameter:" + distances.OUT_diameter);
                var onlyOneGeodesic = this.onlyOneGeodesic;
                var geodesics = distances.OUT_allGeodesics(vertex0, vertex1, onlyOneGeodesic);
                //n
                //$$$end
                //$$$bh visualization
                for (var i_1 = 0; i_1 < geodesics.length; i_1++) {
                    var verticesViewer = new mathis.visu3d.VerticesViewer(mamesh, this.mathisFrame.scene);
                    verticesViewer.vertices = geodesics[i_1];
                    verticesViewer.color = new mathis.Color(new mathis.HSV_01(i_1 / geodesics.length * 0.7, 1, 1));
                    verticesViewer.go();
                }
                new mathis.visu3d.LinksViewer(mamesh, this.mathisFrame.scene).go();
                //$$$eh
                //$$$bt
                this._graphDiameter = distances.OUT_diameter;
                this._distanceBetweenSelectedVertices = distances.OUT_distance(vertex0, vertex1);
                this._nbVerticesInSelectedGeodesics = 0;
                for (var i = 0; i < geodesics.length; i++) {
                    this._nbVerticesInSelectedGeodesics += geodesics[i].length;
                }
                //$$$et
            };
            return GeodesicDocu;
        }());
        var GeodesicGroupDocu = (function () {
            function GeodesicGroupDocu(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.NAME = "GeodesicGroupDocu";
                this.TITLE = "Compute distances and geodesics from a set of vertices";
                this.nbSides = 4;
                this.$$$nbSides = [4, 6, 8, 10];
                this.nbSubdivisionInARadius = 7;
                this.$$$nbSubdivisionInARadius = [3, 5, 7, 9, 11];
                // marker=Vertex.Markers.border
                // $$$marker=new Choices([Vertex.Markers.border,Vertex.Markers.corner,Vertex.Markers.center],{"before":"Vertex.Markers.",visualValues:["border","corner","center"]})
                // randomSeed=38434
                // $$$randomSeed=[38434,984651,3481,9846513,684123]
                this.onlyOneGeodesic = false;
                this.$$$onlyOneGeodesic = [true, false];
                this.left = -0.3;
                this.$$$left = [-0.9, -0.7, -0.5, -0.3, -0.1];
                this.right = 0.3;
                this.$$$right = [0.1, 0.3, 0.5, 0.7, 0.9];
                this.mathisFrame = mathisFrame;
            }
            GeodesicGroupDocu.prototype.goForTheFirstTime = function () {
                this.mathisFrame.clearScene();
                this.mathisFrame.addDefaultCamera();
                this.mathisFrame.addDefaultLight();
                this.go();
            };
            GeodesicGroupDocu.prototype.go = function () {
                this.mathisFrame.clearScene(false, false);
                var mathisFrame = this.mathisFrame;
                //$$$begin
                var creator = new mathis.reseau.TriangulatedPolygone(this.nbSides);
                creator.origin = new mathis.XYZ(-1, -1, 0);
                creator.end = new mathis.XYZ(1, 1, 0);
                creator.nbSubdivisionInARadius = this.nbSubdivisionInARadius;
                var mamesh = creator.go();
                var group = [];
                var singleVertex;
                for (var i_2 = 0; i_2 < mamesh.vertices.length; i_2++) {
                    var vertex = mamesh.vertices[i_2];
                    if (vertex.position.x < this.left)
                        group.push(vertex);
                    if (vertex.position.x > this.right)
                        singleVertex = vertex;
                }
                var distances = new mathis.graph.DistancesFromAGroup(group);
                distances.go();
                mathisFrame.messageDiv.append("distance between vertex and group:" + distances.OUT_distance(singleVertex));
                var onlyOneGeodesic = this.onlyOneGeodesic;
                var geodesics = distances.OUT_allGeodesics(singleVertex, onlyOneGeodesic);
                //n
                //$$$end
                //$$$bh visualization
                for (var i_3 = 0; i_3 < geodesics.length; i_3++) {
                    var verticesViewer = new mathis.visu3d.VerticesViewer(mamesh, this.mathisFrame.scene);
                    verticesViewer.vertices = geodesics[i_3];
                    verticesViewer.color = new mathis.Color(new mathis.HSV_01(i_3 / geodesics.length * 0.7, 1, 1));
                    verticesViewer.go();
                }
                var linksViewer = new mathis.visu3d.LinksViewer(mamesh, this.mathisFrame.scene);
                linksViewer.segmentOrientationFunction = function (vertex0, vertex1) {
                    if (group.indexOf(vertex0) != -1 && group.indexOf(vertex1) != -1)
                        return 1;
                    else
                        return 0;
                };
                linksViewer.color = new mathis.Color(mathis.Color.names.red);
                linksViewer.lateralScalingProp = 0.08;
                linksViewer.go();
                new mathis.visu3d.LinksViewer(mamesh, this.mathisFrame.scene).go();
                //$$$eh
                //$$$bt
                this._distance = geodesics.length - 1;
                this._nbVerticesInSelectedGeodesics = 0;
                for (var i = 0; i < geodesics.length; i++) {
                    this._nbVerticesInSelectedGeodesics += geodesics[i].length;
                }
                //$$$et
            };
            return GeodesicGroupDocu;
        }());
        var DiameterDocu = (function () {
            function DiameterDocu(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.NAME = "DiameterDocu";
                this.TITLE = "Two methods to find the diameter of polygones. 1/ compute all distances between vertices which is long.\n            2/ an heuristic iterative method. Be aware : If the graph is non-connected, this second method only look at the component of the first vertex.\n            But if the graph is connected, it is hard to find a counter-example where the second method fails. \n            You can see such counter-example by fitting 4/9/0.3 as the three first parameters. ";
                this.nbSides = 4;
                this.$$$nbSides = [4, 6, 8, 10];
                this.nbSubdivisionInARadius = 2;
                this.$$$nbSubdivisionInARadius = [2, 3, 5, 7, 9, 11];
                // marker=Vertex.Markers.border
                // $$$marker=new Choices([Vertex.Markers.border,Vertex.Markers.corner,Vertex.Markers.center],{"before":"Vertex.Markers.",visualValues:["border","corner","center"]})
                this.percolationProba = 0.5;
                this.$$$percolationProba = [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
                this.methodChoice = true;
                this.$$$methodChoice = [true, false];
                this.mathisFrame = mathisFrame;
            }
            DiameterDocu.prototype.goForTheFirstTime = function () {
                this.mathisFrame.clearScene();
                this.mathisFrame.addDefaultCamera();
                this.mathisFrame.addDefaultLight();
                this.go();
            };
            DiameterDocu.prototype.go = function () {
                this.mathisFrame.clearScene(false, false);
                var mathisFrame = this.mathisFrame;
                //$$$begin
                var creator = new mathis.reseau.TriangulatedPolygone(this.nbSides);
                creator.origin = new mathis.XYZ(-1, -1, 0);
                creator.end = new mathis.XYZ(1, 1, 0);
                creator.nbSubdivisionInARadius = this.nbSubdivisionInARadius;
                var mamesh = creator.go();
                var random = new mathis.proba.Random();
                for (var i = 0; i < mamesh.vertices.length; i++) {
                    var vertex = mamesh.vertices[i];
                    for (var j = 0; j < vertex.links.length; j++) {
                        if (random.pseudoRand() < this.percolationProba)
                            mathis.Vertex.separateTwoVoisins(vertex, vertex.links[j].to);
                    }
                }
                var diameter;
                var someExtremeVertices;
                var startingTime = window.performance.now();
                var duration;
                if (this.methodChoice) {
                    var distances = new mathis.graph.DistancesBetweenAllVertices(mamesh.vertices);
                    distances.go();
                    duration = window.performance.now() - startingTime;
                    diameter = distances.OUT_diameter;
                    someExtremeVertices = distances.OUT_allExtremeVertex;
                }
                else {
                    var diameterComputer = new mathis.graph.HeuristicDiameter(mamesh.vertices);
                    diameter = diameterComputer.go();
                    duration = window.performance.now() - startingTime;
                    someExtremeVertices = diameterComputer.OUT_twoChosenExtremeVertices;
                }
                mathisFrame.messageDiv.append("diameter:" + diameter + ", computed in:" + duration + " ms");
                //n
                //$$$end
                //$$$bh visualization
                var verticesViewer0 = new mathis.visu3d.VerticesViewer(mamesh, this.mathisFrame.scene);
                verticesViewer0.vertices = someExtremeVertices;
                verticesViewer0.color = new mathis.Color(mathis.Color.names.indianred);
                verticesViewer0.go();
                //n
                new mathis.visu3d.LinksViewer(mamesh, this.mathisFrame.scene).go();
                //$$$eh
            };
            return DiameterDocu;
        }());
        var CornerBorderCenterForPolygone = (function () {
            function CornerBorderCenterForPolygone(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.NAME = "CornerBorderCenterForPolygone";
                this.TITLE = "find some marked vertices and their Neighbors ";
                this.nbSides = 6;
                this.$$$nbSides = [4, 6, 8, 10];
                this.nbSubdivisionInARadius = 5;
                this.$$$nbSubdivisionInARadius = [3, 5, 7, 9, 11];
                this.marker = mathis.Vertex.Markers.border;
                this.$$$marker = new appli.Choices([mathis.Vertex.Markers.border, mathis.Vertex.Markers.corner, mathis.Vertex.Markers.center], { "before": "Vertex.Markers.", visualValues: ["border", "corner", "center"] });
                this.justOneTime = true;
                this.$$$justOneTime = [true, false];
                this.polygoneVersusReseau = true;
                this.$$$polygoneVersusReseau = [true, false];
                this.squareVersusTriangleMaille = false;
                this.$$$squareVersusTriangleMaille = [true, false];
                this.nbI = 7;
                this.$$$nbI = [3, 7, 15, 30];
                this.mathisFrame = mathisFrame;
            }
            CornerBorderCenterForPolygone.prototype.goForTheFirstTime = function () {
                this.mathisFrame.clearScene();
                this.mathisFrame.addDefaultCamera();
                this.mathisFrame.addDefaultLight();
                this.go();
            };
            CornerBorderCenterForPolygone.prototype.go = function () {
                this.mathisFrame.clearScene(false, false);
                //$$$bh
                var creator;
                if (this.polygoneVersusReseau) {
                    creator = new mathis.reseau.TriangulatedPolygone(this.nbSides);
                    creator.origin = new mathis.XYZ(-1, -1, 0);
                    creator.end = new mathis.XYZ(1, 1, 0);
                    creator.nbSubdivisionInARadius = this.nbSubdivisionInARadius;
                }
                else {
                    var basisComputer = new mathis.reseau.BasisForRegularReseau();
                    basisComputer.origin = new mathis.XYZ(-1, -1, 0);
                    basisComputer.end = new mathis.XYZ(1, 1, 0);
                    basisComputer.nbI = this.nbI;
                    basisComputer.set_nbJ_toHaveRegularReseau = true;
                    basisComputer.squareMailleInsteadOfTriangle = this.squareVersusTriangleMaille;
                    creator = new mathis.reseau.Regular(basisComputer);
                }
                //$$$eh
                //$$$begin
                var mamesh = creator.go();
                var markedVertex = [];
                for (var i_4 = 0; i_4 < mamesh.vertices.length; i_4++) {
                    var vertex = mamesh.vertices[i_4];
                    if (vertex.hasMark(this.marker))
                        markedVertex.push(vertex);
                }
                var strates = [];
                strates.push(markedVertex);
                if (this.justOneTime) {
                    strates.push(mathis.graph.getEdge(markedVertex));
                }
                else {
                    var alreadySeen = new mathis.HashMap();
                    var curentEdge = markedVertex;
                    while (curentEdge.length > 0) {
                        curentEdge = mathis.graph.getEdge(curentEdge, alreadySeen);
                        strates.push(curentEdge);
                    }
                }
                //$$$end
                //$$$bh visualization
                for (var i_5 = 0; i_5 < strates.length; i_5++) {
                    var verticesViewer0 = new mathis.visu3d.VerticesViewer(mamesh, this.mathisFrame.scene);
                    verticesViewer0.vertices = strates[i_5];
                    verticesViewer0.color = new mathis.Color(i_5);
                    verticesViewer0.go();
                }
                new mathis.visu3d.LinksViewer(mamesh, this.mathisFrame.scene).go();
                //$$$eh
                //$$$bt
                this._strateLengths = [];
                for (var i = 0; i < strates.length; i++) {
                    this._strateLengths[i] = strates[i].length;
                }
                //$$$et
            };
            return CornerBorderCenterForPolygone;
        }());
        //
        // class CornerBorderCenterForReseau implements PieceOfCode {
        //
        //     $$$name = "CornerBorderCenterForReseau"
        //     $$$title = "variant with a regular reseau "
        //
        //     marker=Vertex.Markers.border
        //   $$$marker=new Choices([Vertex.Markers.border,Vertex.Markers.corner,Vertex.Markers.center],{"before":"Vertex.Markers.",visualValues:["border","corner","center"]})
        //
        //     squareVersusTriangleMaille=false
        //     $$$squareVersusTriangleMaille=[true,false]
        //
        //     nbI=7
        //     $$$nbI=[3,7,15,30]
        //
        //     constructor(private mathisFrame:MathisFrame) {
        //         this.mathisFrame = mathisFrame
        //
        //     }
        //
        //     goForTheFirstTime() {
        //
        //         this.mathisFrame.clearScene()
        //         this.mathisFrame.addDefaultCamera()
        //         this.mathisFrame.addDefaultLight()
        //         this.go()
        //     }
        //
        //     go(){
        //
        //
        //         this.mathisFrame.clearScene(false, false)
        //
        //         //$$$begin
        //         let basisComputer = new reseau.BasisForRegularReseau()
        //         basisComputer.origin = new XYZ(-1, -1, 0)
        //         basisComputer.end = new XYZ(1, 1, 0)
        //         basisComputer.nbI = this.nbI
        //         basisComputer.set_nbJ_toHaveRegularReseau=true
        //         basisComputer.squareMailleInsteadOfTriangle = this.squareVersusTriangleMaille
        //         let creator = new reseau.Regular(basisComputer)
        //
        //         let mamesh = creator.go()
        //
        //
        //         //n
        //         let markedVertex = []
        //         mamesh.vertices.forEach((vertex:Vertex)=> {
        //             if (vertex.hasMark(this.marker)) markedVertex.push(vertex)
        //         })
        //
        //         let border = graph.getEdge(markedVertex)
        //
        //         //$$$end
        //
        //
        //         //$$$bh visualization
        //         let verticesViewer0 = new visu3d.VerticesViewer(mamesh, this.mathisFrame.scene)
        //         verticesViewer0.selectedVertices = markedVertex
        //         verticesViewer0.color = new Color(Color.names.indianred)
        //         verticesViewer0.go()
        //
        //         //n
        //         let verticesViewer1 = new visu3d.VerticesViewer(mamesh, this.mathisFrame.scene)
        //         verticesViewer1.selectedVertices = border
        //         verticesViewer1.color = new Color(Color.names.aqua)
        //         verticesViewer1.go()
        //         //n
        //
        //         new visu3d.LinksViewer(mamesh, this.mathisFrame.scene).go()
        //         //$$$eh
        //     }
        // }
        var TwoGraphDistances = (function () {
            function TwoGraphDistances(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.NAME = "TwoGraphDistances";
                this.TITLE = "For reseaux with squares, considering or not considering the diagonals lead to two different notions of distances : ";
                this.useDiago = true;
                this.$$$useDiago = [true, false];
                this.marker = mathis.Vertex.Markers.center;
                this.$$$marker = new appli.Choices([mathis.Vertex.Markers.border, mathis.Vertex.Markers.corner, mathis.Vertex.Markers.center], { "before": "Vertex.Markers.", visualValues: ["border", "corner", "center"] });
                this.nbI = 7;
                this.$$$nbI = [3, 7, 15, 30];
                this.justOneTime = true;
                this.$$$justOneTime = [true, false];
                this.mathisFrame = mathisFrame;
            }
            TwoGraphDistances.prototype.goForTheFirstTime = function () {
                this.mathisFrame.clearScene();
                this.mathisFrame.addDefaultCamera();
                this.mathisFrame.addDefaultLight();
                this.go();
            };
            TwoGraphDistances.prototype.go = function () {
                this.mathisFrame.clearScene(false, false);
                //$$$bh creation of a squared mesh
                var basisComputer = new mathis.reseau.BasisForRegularReseau();
                basisComputer.origin = new mathis.XYZ(-1, -1, 0);
                basisComputer.end = new mathis.XYZ(1, 1, 0);
                basisComputer.nbI = this.nbI;
                basisComputer.set_nbJ_toHaveRegularReseau = true;
                var creator = new mathis.reseau.Regular(basisComputer);
                var mamesh = creator.go();
                //$$$eh
                //$$$begin
                var considerDiagonals = this.useDiago;
                var markedVertex = [];
                for (var i_6 = 0; i_6 < mamesh.vertices.length; i_6++) {
                    var vertex = mamesh.vertices[i_6];
                    if (vertex.hasMark(this.marker))
                        markedVertex.push(vertex);
                }
                var strates = [];
                strates.push(markedVertex);
                if (this.justOneTime) {
                    if (considerDiagonals)
                        strates.push(mathis.graph.getEdgeConsideringAlsoDiagonalVoisin(markedVertex));
                    else
                        strates.push(mathis.graph.getEdge(markedVertex));
                }
                else {
                    var alreadySeen = new mathis.HashMap();
                    var curentEdge = markedVertex;
                    while (curentEdge.length > 0) {
                        if (considerDiagonals)
                            curentEdge = mathis.graph.getEdgeConsideringAlsoDiagonalVoisin(curentEdge, alreadySeen);
                        else
                            curentEdge = mathis.graph.getEdge(curentEdge, alreadySeen);
                        strates.push(curentEdge);
                    }
                }
                //$$$end
                //$$$bh visualization
                for (var i_7 = 0; i_7 < strates.length; i_7++) {
                    var verticesViewer0 = new mathis.visu3d.VerticesViewer(mamesh, this.mathisFrame.scene);
                    verticesViewer0.vertices = strates[i_7];
                    verticesViewer0.color = new mathis.Color(i_7);
                    verticesViewer0.go();
                }
                new mathis.visu3d.LinksViewer(mamesh, this.mathisFrame.scene).go();
                //$$$eh
                //$$$bt
                this._strateLengths = [];
                for (var i = 0; i < strates.length; i++) {
                    this._strateLengths[i] = strates[i].length;
                }
                console.log(this._strateLengths);
                //$$$et
            };
            return TwoGraphDistances;
        }());
        var PercoForReseau = (function () {
            function PercoForReseau(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.NAME = "PercoForReseau";
                this.TITLE = "get a connected component ";
                // marker=Vertex.Markers.border
                // $$$marker=new Choices([Vertex.Markers.border,Vertex.Markers.corner,Vertex.Markers.center],{"before":"Vertex.Markers.",visualValues:["border","corner","center"]})
                this.squareVersusTriangleMaille = false;
                this.$$$squareVersusTriangleMaille = [true, false];
                this.nbI = 7;
                this.$$$nbI = [3, 7, 15, 30];
                this.probaToKeep = 0.5;
                this.$$$probaToKeep = [0, 0.4, 0.45, 0.5, 0.55, 0.6, 0.8, 1];
                this.mathisFrame = mathisFrame;
            }
            PercoForReseau.prototype.goForTheFirstTime = function () {
                this.mathisFrame.clearScene();
                this.mathisFrame.addDefaultCamera();
                this.mathisFrame.addDefaultLight();
                this.go();
            };
            PercoForReseau.prototype.go = function () {
                this.mathisFrame.clearScene(false, false);
                //$$$begin
                var basisComputer = new mathis.reseau.BasisForRegularReseau();
                basisComputer.origin = new mathis.XYZ(-1, -1, 0);
                basisComputer.end = new mathis.XYZ(1, 1, 0);
                basisComputer.nbI = this.nbI;
                basisComputer.set_nbJ_toHaveRegularReseau = true;
                basisComputer.squareMailleInsteadOfTriangle = this.squareVersusTriangleMaille;
                var creator = new mathis.reseau.Regular(basisComputer);
                var mamesh = creator.go();
                var probaToKeep = this.probaToKeep;
                var admissibleForGroup = new mathis.HashMap(true);
                var centerVertices = [];
                for (var i = 0; i < mamesh.vertices.length; i++) {
                    var vertex = mamesh.vertices[i];
                    if (Math.random() < probaToKeep)
                        admissibleForGroup.putValue(vertex, true);
                    if (vertex.hasMark(mathis.Vertex.Markers.center)) {
                        centerVertices.push(vertex);
                        admissibleForGroup.putValue(vertex, true);
                    }
                }
                var centralComponent = mathis.graph.getGroup(centerVertices, admissibleForGroup);
                //$$$end
                //$$$bh visualization
                var verticesViewer = new mathis.visu3d.VerticesViewer(mamesh, this.mathisFrame.scene);
                verticesViewer.vertices = centralComponent;
                verticesViewer.radiusProp = 0.5;
                verticesViewer.go();
                //$$$eh
            };
            return PercoForReseau;
        }());
    })(appli = mathis.appli || (mathis.appli = {}));
})(mathis || (mathis = {}));
