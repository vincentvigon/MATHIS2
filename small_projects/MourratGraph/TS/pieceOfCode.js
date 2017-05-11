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
                this.graphType = "1d";
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
