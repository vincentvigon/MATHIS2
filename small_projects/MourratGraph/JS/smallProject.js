/**
 * Created by vigon on 10/05/2017.
 */
var mathis;
(function (mathis) {
    var smallProject;
    (function (smallProject) {
        function startMourratGraph() {
            var mathisFrame = new mathis.MathisFrame();
            var pieceOfCode = new RandomSpacialGraph(mathisFrame);
            var binder = new mathis.appli.Binder(pieceOfCode, null, mathisFrame);
            binder.go();
            pieceOfCode.goForTheFirstTime();
        }
        smallProject.startMourratGraph = startMourratGraph;
        var RandomSpacialGraph = (function () {
            function RandomSpacialGraph(mathisFrame) {
                var _this = this;
                this.mathisFrame = mathisFrame;
                this.NAME = "RandomSpacialGraph";
                this.TITLE = "On présente le modèle de Mourrat & Valessin. On voit le sampling de Gibbs en fonctionnement. ";
                this.graphType = "2d";
                this.$$$graphType = new mathis.appli.Choices(["1d", "2d", "3d"]);
                this.N_1d = 20;
                this.$$$N_1d = new mathis.appli.Choices([10, 20, 100, 400, 1000, 2000]);
                this.N_2d = 10;
                this.$$$N_2d = new mathis.appli.Choices([5, 10, 20, 40]);
                this.N_3d = 5;
                this.$$$N_3d = new mathis.appli.Choices([5, 10, 20, 40]);
                this.gamma = 1;
                this.$$$gamma = new mathis.appli.Choices([0.1, 0.5, 0.8, 1, 1.2, 2, 4]);
                this.b = 1;
                this.$$$b = [-0.5, 0, 0.5, 1, 2, 4];
                this.frameInterval = 60;
                this.$$$frameInterval = new mathis.appli.Choices([1, 10, 60, 120], {
                    onchange: function () {
                        _this.action.frameInterval = _this.frameInterval;
                    }
                });
                this.nbTryPerBatch = 100;
                this.$$$nbTryPerBatch = new mathis.appli.Choices([1, 10, 100, 200, 500, 1000], {
                    onchange: function () {
                        _this.sampler.nbTryPerBatch = _this.nbTryPerBatch;
                    }
                });
                this.isPaused = false;
                this.$$$isPaused = new mathis.appli.Choices([false, true], {
                    label: "",
                    visualValues: [$('<span class="fa-2x fa fa-pause"></span>'), $('<span class="fa-2x fa fa-play"></span>')],
                    containerName: 'N',
                    type: mathis.appli.ChoicesOptionsType.button
                });
                this.mathisFrame = mathisFrame;
                this.$$$isPaused.options.onchange = function () {
                    for (var _i = 0, _a = mathisFrame.periodicActions; _i < _a.length; _i++) {
                        var action = _a[_i];
                        action.isPaused = _this.isPaused;
                    }
                };
                this.$$$graphType.options.onchange = function () {
                    _this.hideSomeButton();
                    _this.go();
                };
            }
            RandomSpacialGraph.prototype.hideSomeButton = function () {
                if (this.graphType == "1d") {
                    this.$$$N_1d.show();
                    this.$$$N_2d.hide();
                    this.$$$N_3d.hide();
                }
                else if (this.graphType == "2d") {
                    this.$$$N_1d.hide();
                    this.$$$N_2d.show();
                    this.$$$N_3d.hide();
                }
                else if (this.graphType == "3d") {
                    this.$$$N_1d.hide();
                    this.$$$N_2d.hide();
                    this.$$$N_3d.show();
                }
                else
                    throw "bof";
            };
            RandomSpacialGraph.prototype.goForTheFirstTime = function () {
                var _this = this;
                this.mathisFrame.clearScene();
                this.mathisFrame.addDefaultCamera();
                this.mathisFrame.addDefaultLight();
                this.go();
                setTimeout(function () {
                    _this.hideSomeButton();
                }, 20);
            };
            RandomSpacialGraph.prototype.go = function () {
                var _this = this;
                this.mathisFrame.clearScene(false, false);
                var mathisFrame = this.mathisFrame;
                var mamesh;
                var N;
                var showInitialGraph = true;
                switch (this.graphType) {
                    case '1d':
                        {
                            N = this.N_1d;
                            var creator = new mathis.reseau.Regular1D(N);
                            creator.origin = new mathis.XYZ(-1, 0, 0);
                            creator.end = new mathis.XYZ(1, 0, 0);
                            mamesh = creator.go();
                        }
                        break;
                    case '2d':
                        {
                            N = this.N_2d;
                            var creator = new mathis.reseau.Regular();
                            creator.nbI = N;
                            creator.nbJ = N;
                            creator.origine = new mathis.XYZ(-1, 0, -1);
                            var step = 2 / (N - 1);
                            creator.Vi = new mathis.XYZ(step, 0, 0);
                            creator.Vj = new mathis.XYZ(0, 0, step);
                            mamesh = creator.go();
                        }
                        break;
                    case '3d':
                        {
                            N = this.N_3d;
                            if (N > 10)
                                showInitialGraph = false;
                            var creator = new mathis.reseau.Regular3D();
                            creator.nbI = N;
                            creator.nbJ = N;
                            creator.nbK = N;
                            creator.origine = new mathis.XYZ(-1, -1, -1);
                            var step = 2 / (N - 1);
                            creator.Vi = new mathis.XYZ(step, 0, 0);
                            creator.Vj = new mathis.XYZ(0, 0, step);
                            creator.Vk = new mathis.XYZ(0, step, 0);
                            mamesh = creator.go();
                        }
                        break;
                }
                this.sampler = new smallProject.SpacialRandomGraph(mamesh, this.mathisFrame, N);
                /** 'b' grand => on est très motivé pour réduire le diamètre. Théoriquement*/
                this.sampler.b = this.b;
                /** 'gamma' grand => les grands ponts coûtent cher. On voit essentiellement des petits ponts */
                this.sampler.gamma = this.gamma;
                this.sampler.nbTryPerBatch = this.nbTryPerBatch;
                this.sampler.showInitialGraph = showInitialGraph;
                this.sampler.go();
                /**remarque : dès que  alpha(b,gamma)=0, le diamètre asymptotique (N=infty) vaut 1.
                 * Mais les simus ne donnent jamais un tel diamètre.
                 * Les simus donnent un diamètre  toujours plus grand que le diamètre asymptotique
                 *  */
                this.action = new mathis.PeriodicAction(function () {
                    var accepted = _this.sampler.batchOfChanges();
                    mathisFrame.subWindow_SW.empty();
                    mathisFrame.subWindow_SW.appendAndGoToLine("nb suppressions:" + accepted.suppression);
                    mathisFrame.subWindow_SW.appendAndGoToLine("nb creations:" + accepted.addition);
                    mathisFrame.subWindow_SW.appendAndGoToLine("nb modifications:" + accepted.modification);
                    mathisFrame.subWindow_SW.appendAndGoToLine("diameter:" + accepted.diameter);
                    mathisFrame.subWindow_SW.appendAndGoToLine("alpha:" + _this.sampler.alpha.toFixed(1) + "  N^alpha:" + _this.sampler.Nalpha.toFixed(1));
                });
                this.action.frameInterval = this.frameInterval;
                this.mathisFrame.cleanAllPeriodicActions();
                this.mathisFrame.pushPeriodicAction(this.action);
                for (var _i = 0, _a = this.mathisFrame.periodicActions; _i < _a.length; _i++) {
                    var action = _a[_i];
                    action.isPaused = this.isPaused;
                }
            };
            return RandomSpacialGraph;
        }());
        smallProject.RandomSpacialGraph = RandomSpacialGraph;
    })(smallProject = mathis.smallProject || (mathis.smallProject = {}));
})(mathis || (mathis = {}));
/**
 * Created by vigon on 10/05/2017.
 */
var mathis;
(function (mathis) {
    var smallProject;
    (function (smallProject) {
        var LongEdgeVisual = (function () {
            function LongEdgeVisual(vertex0, vertex1, color, radius, upDirection, scene) {
                this.vertex0 = vertex0;
                this.vertex1 = vertex1;
                var v0 = new mathis.Vertex();
                v0.position = this.vertex0.position;
                var v1 = new mathis.Vertex();
                v1.position = this.vertex1.position;
                var vMid = new mathis.Vertex();
                var bary = new mathis.XYZ(0, 0, 0);
                mathis.geo.baryCenter([v0.position, v1.position], [0.5, 0.5], bary);
                vMid.position = new mathis.XYZ(0, 0, 0);
                var demiDist = mathis.geo.distance(v0.position, v1.position) / 2;
                vMid.position.add(upDirection).scale(demiDist).add(bary);
                var line = new mathis.Line([v0, vMid, v1], false);
                this.lineViewer = new mathis.visu3d.LinesViewer([line], scene);
                this.lineViewer.color = color;
                this.lineViewer.constantRadius = radius;
                this.lineViewer.go();
            }
            LongEdgeVisual.hash = function (vertex0, vertex1) {
                if (vertex0.hashNumber < vertex1.hashNumber)
                    return vertex0.hashNumber + ',' + vertex1.hashNumber;
                else
                    return vertex1.hashNumber + ',' + vertex0.hashNumber;
            };
            return LongEdgeVisual;
        }());
        smallProject.LongEdgeVisual = LongEdgeVisual;
        var SpacialRandomGraph = (function () {
            function SpacialRandomGraph(mamesh, mathisFrame, N // nombre de vertex sur une dimension
                ) {
                this.mamesh = mamesh;
                this.mathisFrame = mathisFrame;
                this.N = N;
                this.defaultColorForLongEdge = new mathis.Color(new mathis.RGB_range255(124, 252, 0));
                this.energy = null;
                this.candidateEnergy = 1;
                this.C_gamma = 0;
                this.b = 1;
                this.gamma = 1;
                this.nbTryPerBatch = 1;
                this.lineRadius = 0.01;
                this.upDirection = new mathis.XYZ(0, 1, 0);
                this.longEdges = new mathis.StringMap();
                this.rand = new mathis.proba.Random();
                this.showInitialGraph = true;
                this.viewersForGeodesic = [];
                this.probaOfLongEdgeModif = 0.;
                this.graph = mamesh.vertices;
            }
            Object.defineProperty(SpacialRandomGraph.prototype, "alpha", {
                /**la vrai formule pour le cas gamma=1 n'a pas été traité
                 * (ces simulations sont pas assez précises pour montrer la différence entre gamma=1 et gamma proche de 1) */
                get: function () {
                    if (this.gamma <= 1) {
                        return Math.max(Math.min((1 - this.b) / (2 - this.gamma), 1), 0);
                    }
                    else if (this.gamma > 1) {
                        return Math.max(Math.min((this.gamma - this.b) / (this.gamma), 1), 0);
                    }
                    else
                        return null;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(SpacialRandomGraph.prototype, "Nalpha", {
                get: function () {
                    return Math.pow(this.N, this.alpha);
                },
                enumerable: true,
                configurable: true
            });
            SpacialRandomGraph.prototype.drawAGeodesic = function (geodesic, colorIsBlueVersusBlack) {
                for (var i = 0; i < geodesic.length; i++) {
                    /**la couleur dépend de l'emplacement dans la géodésique*/
                    var val = i / this.extremeGeodesics.length * 255;
                    var color_1 = void 0;
                    if (colorIsBlueVersusBlack)
                        color_1 = new mathis.Color(new mathis.RGB_range255(val, val, 255));
                    else
                        color_1 = new mathis.Color(new mathis.RGB_range255(val, val, val));
                    /**on trace les vertex*/
                    var verticesViewer = new mathis.visu3d.VerticesViewer(geodesic[i], this.mathisFrame.scene);
                    verticesViewer.color = color_1;
                    verticesViewer.constantRadius = this.vertexRadius * 1.01;
                    verticesViewer.go();
                    this.viewersForGeodesic.push(verticesViewer);
                    /**on trace les links*/
                    if (i < this.extremeGeodesics.length - 1) {
                        var vertex0 = geodesic[i][0];
                        var vertex1 = geodesic[i + 1][0];
                        var upDirection = null;
                        if (this.longEdges.getValue(LongEdgeVisual.hash(vertex0, vertex1)) != null) {
                            upDirection = this.upDirection;
                        }
                        else
                            upDirection = new mathis.XYZ(0, 0, 0);
                        var aLongEdge = new LongEdgeVisual(vertex0, vertex1, color_1, this.lineRadius * 1.1, upDirection, this.mathisFrame.scene);
                        this.viewersForGeodesic.push(aLongEdge.lineViewer);
                    }
                }
            };
            SpacialRandomGraph.prototype.clearAllGeodesic = function () {
                for (var _i = 0, _a = this.viewersForGeodesic; _i < _a.length; _i++) {
                    var viewer = _a[_i];
                    viewer.clear();
                }
                this.viewersForGeodesic = [];
            };
            SpacialRandomGraph.prototype.go = function () {
                /**on met une marque sur les liens initiaux (on en rajoutera des plus longs par la suite, qui n'auront pas cette marque)*/
                for (var _i = 0, _a = this.mamesh.vertices; _i < _a.length; _i++) {
                    var vertex = _a[_i];
                    for (var _b = 0, _c = vertex.links; _b < _c.length; _b++) {
                        var link = _c[_b];
                        link.customerOb = true;
                    }
                }
                var mean = 0;
                var nb = 0;
                var aVertex = this.mamesh.vertices[0];
                for (var _d = 0, _e = aVertex.links; _d < _e.length; _d++) {
                    var link = _e[_d];
                    mean += mathis.geo.distance(aVertex.position, link.to.position);
                    nb++;
                }
                mean /= nb;
                this.vertexRadius = Math.min(mean * 0.5, 0.03);
                if (this.showInitialGraph) {
                    var baseVertexViewer = new mathis.visu3d.VerticesViewer(this.mamesh, this.mathisFrame.scene);
                    baseVertexViewer.constantRadius = this.vertexRadius;
                    baseVertexViewer.go();
                    if (this.lineRadius < 0.8 * this.vertexRadius) {
                        var lineViewer = new mathis.visu3d.LinesViewer(this.mamesh, this.mathisFrame.scene);
                        lineViewer.constantRadius = this.lineRadius;
                        lineViewer.color = new mathis.Color(mathis.Color.names.indianred);
                        lineViewer.go();
                    }
                }
                else {
                    var baseVertexViewer = new mathis.visu3d.VerticesViewer(this.mamesh, this.mathisFrame.scene);
                    baseVertexViewer.constantRadius = 0.005;
                    baseVertexViewer.go();
                }
            };
            SpacialRandomGraph.prototype.areClose = function (vertex0, vertex1) {
                if (vertex0 == vertex1)
                    return true;
                var link = vertex0.findLink(vertex1);
                if (link == null)
                    return false;
                if (link.customerOb == null)
                    return false;
                return true;
            };
            SpacialRandomGraph.prototype.allClose = function (vertex) {
                var res = [];
                for (var _i = 0, _a = vertex.links; _i < _a.length; _i++) {
                    var link = _a[_i];
                    if (link.customerOb == true)
                        res.push(link.to);
                }
                return res;
            };
            /**Attention : cette formule donne la distance euclidienne quand on suppose que les vertex sont placés
             *
             *  cas1d :  en 1,2,...,N      et non pas  sur [-1,1] comme sur la visualisation
             *  cas2d :  en (1,1) , ..., (N,N)  et non pas  sur [-1,1]^2 comme sur la visualisation
             *  cas2d :  en (1,1,1) , ..., (N,N,N)  et non pas  sur [-1,1]^3 comme sur la visualisation
             *  */
            SpacialRandomGraph.prototype.euclidianDistance = function (vertex0, vertex1) {
                return mathis.geo.distance(vertex0.position, vertex1.position) * (this.N - 1) / 2;
            };
            SpacialRandomGraph.prototype.batchOfChanges = function () {
                var suppression = 0;
                var addition = 0;
                var modification = 0;
                for (var t = 0; t < this.nbTryPerBatch; t++) {
                    var linkToAdd = null;
                    var linkToSuppress = null;
                    var proba_1 = (this.longEdges.allValues().length < 4) ? 0 : this.probaOfLongEdgeModif;
                    if (this.rand.pseudoRand() < proba_1) {
                        var aLongEdge = this.longEdges.aRandomValue();
                        var allClos = this.allClose(aLongEdge.vertex1);
                        var vertex1New = allClos[Math.floor(allClos.length * this.rand.pseudoRand())];
                        if (!this.areClose(vertex1New, aLongEdge.vertex0)) {
                            linkToAdd = [vertex1New, aLongEdge.vertex0];
                            linkToSuppress = [aLongEdge.vertex1, aLongEdge.vertex0];
                        }
                        else {
                            continue;
                        }
                    }
                    else {
                        /**on tire deux sommets au hasards. */
                        var vertex0 = this.graph[this.rand.pseudoRandInt(this.graph.length)];
                        var vertex1 = this.graph[this.rand.pseudoRandInt(this.graph.length)];
                        if (this.areClose(vertex0, vertex1))
                            continue;
                        // while (this.areClose(vertex0, vertex1)) {
                        //     vertex1 = this.graph[this.rand.pseudoRandInt(this.graph.length)]
                        // }
                        /**si un longEdge existe : on propose de le supprimer, sinon de le rajouter*/
                        if (this.longEdges.getValue(LongEdgeVisual.hash(vertex0, vertex1)) != null)
                            linkToSuppress = [vertex0, vertex1];
                        else
                            linkToAdd = [vertex0, vertex1];
                    }
                    if (linkToAdd != null) {
                        linkToAdd[0].setOneLink(linkToAdd[1]);
                        linkToAdd[1].setOneLink(linkToAdd[0]);
                        this.C_gamma += Math.pow(this.euclidianDistance(linkToAdd[0], linkToAdd[1]), this.gamma);
                    }
                    if (linkToSuppress != null) {
                        mathis.Vertex.separateTwoVoisins(linkToSuppress[0], linkToSuppress[1]);
                        this.C_gamma -= Math.pow(this.euclidianDistance(linkToSuppress[0], linkToSuppress[1]), this.gamma);
                    }
                    /**ici on calcul le nouveau diamètre, on utilise aussi le C_gamma*/
                    var ratioEnergy = this.energyRatio();
                    if (ratioEnergy >= 1 || Math.random() < ratioEnergy) {
                        /**on accepte le changement : le graph a déjà été modifier, il reste à modifier le visuel*/
                        /**on fait des copies avec concat()*/
                        //this.twoExtremeVertices=this.twoExtremeVertices_proposal.concat([])
                        if (linkToAdd != null) {
                            var longEdge = new LongEdgeVisual(linkToAdd[0], linkToAdd[1], this.defaultColorForLongEdge, this.lineRadius, this.upDirection, this.mathisFrame.scene);
                            this.longEdges.putValue(LongEdgeVisual.hash(linkToAdd[0], linkToAdd[1]), longEdge);
                        }
                        if (linkToSuppress != null) {
                            var hash = LongEdgeVisual.hash(linkToSuppress[0], linkToSuppress[1]);
                            var longEdge = this.longEdges.getValue(hash);
                            longEdge.lineViewer.clear();
                            this.longEdges.removeKey(hash);
                        }
                        this.energy = this.candidateEnergy;
                        this.extremeGeodesics = this.extremeGeodesics_proposal;
                        this.diameter = this.diameter_proposal;
                        if (linkToAdd != null && linkToSuppress != null)
                            modification++;
                        else if (linkToAdd != null)
                            addition++;
                        else if (linkToSuppress != null)
                            suppression++;
                        else
                            throw "bizarre";
                    }
                    else {
                        /**sinon on fait machine arrière dans le graph*/
                        if (linkToAdd != null) {
                            mathis.Vertex.separateTwoVoisins(linkToAdd[0], linkToAdd[1]);
                            this.C_gamma -= Math.pow(this.euclidianDistance(linkToAdd[0], linkToAdd[1]), this.gamma);
                        }
                        if (linkToSuppress != null) {
                            linkToSuppress[0].setOneLink(linkToSuppress[1]);
                            linkToSuppress[1].setOneLink(linkToSuppress[0]);
                            this.C_gamma += Math.pow(this.euclidianDistance(linkToSuppress[0], linkToSuppress[1]), this.gamma);
                        }
                    }
                }
                /**quand le diamètre change : on trace un des chemins parmi les plus long*/
                if (this.diameter_previousBatch != this.diameter) {
                    this.clearAllGeodesic();
                    this.drawAGeodesic(this.extremeGeodesics, true);
                    this.diameter_previousBatch = this.diameter;
                }
                return {
                    diameter: this.diameter,
                    suppression: suppression,
                    addition: addition,
                    modification: modification
                };
            };
            SpacialRandomGraph.prototype.energyRatio = function () {
                var diameterComputer = new mathis.graph.HeuristicDiameter(this.mamesh.vertices);
                this.diameter_proposal = diameterComputer.go();
                this.twoExtremeVertices_proposal = diameterComputer.OUT_twoChosenExtremeVertices;
                this.extremeGeodesics_proposal = diameterComputer.OUT_oneGeodesicBetweenChosenExtremeVertices;
                this.candidateEnergy = Math.pow(this.N, this.b) * this.diameter_proposal + this.C_gamma;
                if (this.energy == null)
                    return 1;
                return Math.exp(-this.candidateEnergy + this.energy);
            };
            return SpacialRandomGraph;
        }());
        smallProject.SpacialRandomGraph = SpacialRandomGraph;
    })(smallProject = mathis.smallProject || (mathis.smallProject = {}));
})(mathis || (mathis = {}));
//# sourceMappingURL=smallProject.js.map