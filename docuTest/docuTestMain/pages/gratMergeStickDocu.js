/**
 * Created by vigon on 01/02/2017.
 */
/**
 * Created by vigon on 05/12/2016.
 */
var mathis;
(function (mathis) {
    var appli;
    (function (appli) {
        var GrateMergeStick = (function () {
            function GrateMergeStick(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.pageIdAndTitle = "Grating and gluing";
                var several = new appli.SeveralParts();
                several.addPart(new GrateGluedMamesh(this.mathisFrame));
                several.addPart(new GrateMamesh(this.mathisFrame));
                several.addPart(new GrateMameshConcentric(this.mathisFrame), true);
                several.addPart(new MergeVersusStick(this.mathisFrame));
                this.severalParts = several;
            }
            GrateMergeStick.prototype.go = function () {
                return this.severalParts.go();
            };
            return GrateMergeStick;
        }());
        appli.GrateMergeStick = GrateMergeStick;
        var GrateMamesh = (function () {
            function GrateMamesh(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.NAME = "GrateMamesh";
                this.TITLE = "When two mameshes overlap (they are concurrent), we could want to grate them to suppress overlapping.  \n            Grating process starts from seeds: each concurrent have some given (or computed) seeds which are keep (and represented here as red bullet). \n            Around these seeds, we compute strates, and we keep their cell, until strates of concurrent overlap";
                this.nbSides0 = 6;
                this.$$$nbSides0 = [4, 6, 8, 10];
                this.nbSides1 = 6;
                this.$$$nbSides1 = [4, 6, 8, 10];
                this.nbSubdivisionInARadius0 = 9;
                this.$$$nbSubdivisionInARadius0 = [3, 5, 7, 9, 11];
                this.nbSubdivisionInARadius1 = 5;
                this.$$$nbSubdivisionInARadius1 = [3, 5, 7, 9, 11];
                this.grate = true;
                this.$$$grate = [true, false];
                this.neighborhoodCoefficient0 = 0.7;
                this.$$$neighborhoodCoefficient0 = [0.5, 0.7, 1, 2];
                this.neighborhoodCoefficient1 = 0.7;
                this.$$$neighborhoodCoefficient1 = [0.5, 0.7, 1, 2];
                this.proportionOfSeed0 = 0.1;
                this.$$$proportionOfSeed0 = [0.01, 0.1, 0.3, 0.5, 0.7];
                this.proportionOfSeed1 = 0.1;
                this.$$$proportionOfSeed1 = [0.1, 0.3, 0.5, 0.7];
                this.seedComputedFromBarycentersVersusFromAllPossibleCells = true;
                this.$$$seedComputedFromBarycentersVersusFromAllPossibleCells = [true, false];
                this.addAsymetry = false;
                this.$$$addAsymetry = [true, false];
                this.asyDirection0 = -1;
                this.$$$asyDirection0 = [-1, 1];
                this.asyDirection1 = -1;
                this.$$$asyDirection1 = [-1, 1];
                this.asyInfluence0 = 0.5;
                this.$$$asyInfluence0 = [0.1, 0.5, 1];
                this.asyInfluence1 = 0.5;
                this.$$$asyInfluence1 = [0.1, 0.5, 1];
                this.modulo0 = null;
                this.$$$modulo0 = [null, 1.5, 0.7];
                this.modulo1 = null;
                this.$$$modulo1 = [null, 1.5, 0.7];
                this.mathisFrame = mathisFrame;
            }
            GrateMamesh.prototype.goForTheFirstTime = function () {
                this.mathisFrame.clearScene();
                this.mathisFrame.addDefaultCamera();
                this.mathisFrame.addDefaultLight();
                this.go();
            };
            GrateMamesh.prototype.go = function () {
                this.mathisFrame.clearScene(false, false);
                //$$$bh creation of the 2 mamesh
                var creator0 = new mathis.reseau.TriangulatedPolygone(this.nbSides0);
                creator0.origin = new mathis.XYZ(-1, -1, 0);
                creator0.end = new mathis.XYZ(0.5, 0.5, 0);
                creator0.nbSubdivisionInARadius = this.nbSubdivisionInARadius0;
                var mamesh0 = creator0.go();
                var creator1 = new mathis.reseau.TriangulatedPolygone(this.nbSides1);
                creator1.origin = new mathis.XYZ(-0.5, -0.5, 0);
                creator1.end = new mathis.XYZ(1, 1, 0);
                creator1.nbSubdivisionInARadius = this.nbSubdivisionInARadius1;
                var mamesh1 = creator1.go();
                //$$$eh
                //$$$begin
                var grater = null;
                if (this.grate) {
                    grater = new mathis.grateAndGlue.GraphGrater();
                    grater.IN_graphFamily.push(mamesh0.vertices, mamesh1.vertices);
                    //n
                    /** this params determine the neighborhood of each graph (this param are proportions)
                     * If too small, cells could penetrate each others.
                     * E.g keep all the defaults, and set the first number to 0.5*/
                    grater.proximityCoefToGrate = [this.neighborhoodCoefficient0, this.neighborhoodCoefficient1];
                    /** There are two ways to select seeds :
                     * --- if seedComputedFromBarycenters : seeds are vertices the farthest of barycenter of concurrents.
                     * --- is seedComputedFromAllPossibleCell : seeds are all vertices which is not to close to a concurrent.*/
                    grater.seedComputedFromBarycentersVersusFromAllPossibleCells = this.seedComputedFromBarycentersVersusFromAllPossibleCells;
                    /**Determine the proportion of seeds of each concurrent: only useful is previous attribute is true*/
                    grater.proportionOfSeeds = [this.proportionOfSeed0, this.proportionOfSeed1];
                    if (this.addAsymetry) {
                        /**to change the localisation of seeds.
                         * --- direction: pull the seeds in this direction
                         * --- influence: influence of this direction against the 'natural' direction of seed
                         * --- modulo (optional): allow to pull seeds in several directions
                         * */
                        grater.asymmetriesForSeeds = [
                            { direction: new mathis.XYZ(this.asyDirection0, 0, 0), influence: this.asyInfluence0, modulo: this.modulo0 },
                            { direction: new mathis.XYZ(0, this.asyDirection1, 0), influence: this.asyInfluence1, modulo: this.modulo1 }];
                    }
                    var remainingVertices = grater.go();
                    //n
                    mamesh0 = new mathis.grateAndGlue.SubMameshExtractor(mamesh0, remainingVertices[0]).go();
                    mamesh0.isolateMameshVerticesFromExteriorVertices();
                    mamesh1 = new mathis.grateAndGlue.SubMameshExtractor(mamesh1, remainingVertices[1]).go();
                    mamesh1.isolateMameshVerticesFromExteriorVertices();
                }
                //$$$end
                //$$$bh visualization
                if (grater != null) {
                    var verticesViewer0 = new mathis.visu3d.VerticesViewer(mamesh0, this.mathisFrame.scene);
                    verticesViewer0.vertices = grater.OUT_allSeeds[0];
                    verticesViewer0.color = new mathis.Color(mathis.Color.names.red);
                    verticesViewer0.go();
                    var verticesViewer1 = new mathis.visu3d.VerticesViewer(mamesh1, this.mathisFrame.scene);
                    verticesViewer1.vertices = grater.OUT_allSeeds[1];
                    verticesViewer1.color = new mathis.Color(mathis.Color.names.red);
                    verticesViewer1.go();
                }
                //n
                var linkViewer0 = new mathis.visu3d.LinksViewer(mamesh0, this.mathisFrame.scene);
                linkViewer0.color = new mathis.Color(mathis.Color.names.darkseagreen);
                linkViewer0.go();
                var linkViewer1 = new mathis.visu3d.LinksViewer(mamesh1, this.mathisFrame.scene);
                linkViewer1.color = new mathis.Color(mathis.Color.names.blueviolet);
                linkViewer1.go();
                //$$$eh
            };
            return GrateMamesh;
        }());
        var GrateMameshConcentric = (function () {
            function GrateMameshConcentric(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.NAME = "GrateMameshConcentric";
                this.TITLE = "Variant with two concentric mameshes";
                this.nbSides0 = 6;
                this.$$$nbSides0 = [4, 6, 8, 10];
                this.nbSides1 = 6;
                this.$$$nbSides1 = [4, 6, 8, 10];
                this.nbSubdivisionInARadius0 = 9;
                this.$$$nbSubdivisionInARadius0 = [3, 5, 7, 9, 11];
                this.nbSubdivisionInARadius1 = 5;
                this.$$$nbSubdivisionInARadius1 = [3, 5, 7, 9, 11];
                this.grate = true;
                this.$$$grate = [true, false];
                this.neighborhoodCoefficient0 = 0.7;
                this.$$$neighborhoodCoefficient0 = [0.5, 0.7, 1, 2];
                this.neighborhoodCoefficient1 = 0.7;
                this.$$$neighborhoodCoefficient1 = [0.5, 0.7, 1, 2];
                this.proportionOfSeed0 = 0.1;
                this.$$$proportionOfSeed0 = [0.1, 0.3, 0.5, 0.7];
                this.proportionOfSeed1 = 0.1;
                this.$$$proportionOfSeed1 = [0.1, 0.3, 0.5, 0.7];
                this.seedComputedFromBarycentersVersusFromAllPossibleCells = true;
                this.$$$seedComputedFromBarycentersVersusFromAllPossibleCells = [true, false];
                this.mathisFrame = mathisFrame;
            }
            GrateMameshConcentric.prototype.goForTheFirstTime = function () {
                this.mathisFrame.clearScene();
                this.mathisFrame.addDefaultCamera();
                this.mathisFrame.addDefaultLight();
                this.go();
            };
            GrateMameshConcentric.prototype.go = function () {
                this.mathisFrame.clearScene(false, false);
                //$$$begin
                var creator0 = new mathis.reseau.TriangulatedPolygone(this.nbSides0);
                creator0.origin = new mathis.XYZ(-1, -1, 0);
                creator0.end = new mathis.XYZ(1, 1, 0);
                creator0.nbSubdivisionInARadius = this.nbSubdivisionInARadius0;
                var mamesh0 = creator0.go();
                var creator1 = new mathis.reseau.TriangulatedPolygone(this.nbSides1);
                creator1.origin = new mathis.XYZ(-0.5, -0.5, 0);
                creator1.end = new mathis.XYZ(0.5, 0.5, 0);
                creator1.nbSubdivisionInARadius = this.nbSubdivisionInARadius1;
                var mamesh1 = creator1.go();
                var grater = null;
                if (this.grate) {
                    grater = new mathis.grateAndGlue.GraphGrater();
                    grater.IN_graphFamily.push(mamesh0.vertices, mamesh1.vertices);
                    //n
                    grater.proximityCoefToGrate = [this.neighborhoodCoefficient0, this.neighborhoodCoefficient1];
                    /** When a mamesh cover the other, the false option make disappear the covered one*/
                    grater.seedComputedFromBarycentersVersusFromAllPossibleCells = this.seedComputedFromBarycentersVersusFromAllPossibleCells;
                    /**Determine the proportion of seeds of each concurrent: only useful is previous attribute is true*/
                    grater.proportionOfSeeds = [this.proportionOfSeed0, this.proportionOfSeed1];
                    var remainingVertices = grater.go();
                    //n
                    mamesh0 = new mathis.grateAndGlue.SubMameshExtractor(mamesh0, remainingVertices[0]).go();
                    mamesh0.isolateMameshVerticesFromExteriorVertices();
                    mamesh1 = new mathis.grateAndGlue.SubMameshExtractor(mamesh1, remainingVertices[1]).go();
                    mamesh1.isolateMameshVerticesFromExteriorVertices();
                }
                //$$$end
                //$$$bh visualization
                if (grater != null) {
                    var verticesViewer0 = new mathis.visu3d.VerticesViewer(mamesh0, this.mathisFrame.scene);
                    verticesViewer0.vertices = grater.OUT_allSeeds[0];
                    verticesViewer0.color = new mathis.Color(mathis.Color.names.red);
                    verticesViewer0.go();
                    var verticesViewer1 = new mathis.visu3d.VerticesViewer(mamesh1, this.mathisFrame.scene);
                    verticesViewer1.vertices = grater.OUT_allSeeds[1];
                    verticesViewer1.color = new mathis.Color(mathis.Color.names.red);
                    verticesViewer1.go();
                }
                //n
                var linkViewer0 = new mathis.visu3d.LinksViewer(mamesh0, this.mathisFrame.scene);
                linkViewer0.color = new mathis.Color(mathis.Color.names.darkseagreen);
                linkViewer0.go();
                var linkViewer1 = new mathis.visu3d.LinksViewer(mamesh1, this.mathisFrame.scene);
                linkViewer1.color = new mathis.Color(mathis.Color.names.blueviolet);
                linkViewer1.go();
                //$$$eh
            };
            return GrateMameshConcentric;
        }());
        var GrateGluedMamesh = (function () {
            function GrateGluedMamesh(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.NAME = "GrateGluedMamesh";
                this.TITLE = "When two mameshes overlap (they are concurrent), we could want to grate them and to stick them.  \n            Techniques for grating and Sticking are detail further on.";
                this.nbSides0 = 6;
                this.$$$nbSides0 = [4, 6, 8, 10];
                this.nbSides1 = 6;
                this.$$$nbSides1 = [4, 6, 8, 10];
                this.nbSubdivisionInARadius0 = 9;
                this.$$$nbSubdivisionInARadius0 = [3, 5, 7, 9, 11];
                this.nbSubdivisionInARadius1 = 5;
                this.$$$nbSubdivisionInARadius1 = [3, 5, 7, 9, 11];
                this.toleranceToBeOneOfTheClosest = 0.5;
                this.$$$toleranceToBeOneOfTheClosest = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7];
                this.proportionOfSeed0 = 0.1;
                this.$$$proportionOfSeed0 = [0.1, 0.3, 0.5, 0.7];
                this.proportionOfSeed1 = 0.1;
                this.$$$proportionOfSeed1 = [0.1, 0.3, 0.5, 0.7];
                this.proximityCoefToStick = 2;
                this.$$$proximityCoefToStick = [1, 1.5, 2, 3];
                this.suppressLinksAngularlyTooClose = false;
                this.$$$suppressLinksAngularlyTooClose = [true, false];
                this.propAngle = 0.1;
                this.$$$propAngle = [0.01, 0.05, 0.1, 0.2, 0.3];
                this.justGrateDoNotStick = false;
                this.$$$justGrateDoNotStick = [true, false];
                this.mathisFrame = mathisFrame;
            }
            GrateGluedMamesh.prototype.goForTheFirstTime = function () {
                this.mathisFrame.clearScene();
                this.mathisFrame.addDefaultCamera();
                this.mathisFrame.addDefaultLight();
                this.go();
            };
            GrateGluedMamesh.prototype.go = function () {
                this.mathisFrame.clearScene(false, false);
                //$$$bh mameshes creation
                var creator0 = new mathis.reseau.TriangulatedPolygone(this.nbSides0);
                creator0.origin = new mathis.XYZ(-1, -1, 0);
                creator0.end = new mathis.XYZ(0.5, 0.5, 0);
                creator0.nbSubdivisionInARadius = this.nbSubdivisionInARadius0;
                var mamesh0 = creator0.go();
                var creator1 = new mathis.reseau.TriangulatedPolygone(this.nbSides1);
                creator1.origin = new mathis.XYZ(-0.5, -0.5, 0);
                creator1.end = new mathis.XYZ(1, 1, 0);
                creator1.nbSubdivisionInARadius = this.nbSubdivisionInARadius1;
                var mamesh1 = creator1.go();
                //$$$eh
                //$$$begin
                var graterAndSticker = new mathis.grateAndGlue.ConcurrentMameshesGraterAndSticker();
                graterAndSticker.IN_mameshes.push(mamesh0, mamesh1);
                graterAndSticker.justGrateDoNotStick = this.justGrateDoNotStick;
                /**all attributes of the grating process (see above) could be ruled via this SUB_object. Here we just change one.*/
                graterAndSticker.SUB_grater.proportionOfSeeds = [this.proportionOfSeed0, this.proportionOfSeed1];
                /** Coef ruling the neighborhood zone of vertices.
                 *  More big is this coef, more we accept far neighbors,  and so more we stick far vertices */
                graterAndSticker.proximityCoefToStick = [this.proximityCoefToStick];
                /**if 0    -->  only the closest neighbor is stick
                 * if 0.10 -->  all vertices which are positioned up to 10% further than the closest are stick
                 * if 0.1  -->  ...
                 * be careful, if too big links can cross themselves:
                 * which can be solve by clearing links making too small angles each others.
                 * */
                graterAndSticker.toleranceToBeOneOfTheClosest = this.toleranceToBeOneOfTheClosest;
                //n
                graterAndSticker.suppressLinksAngularlyTooClose = this.suppressLinksAngularlyTooClose;
                /**links cleaning is made by a SUB object that we can parametrize: */
                graterAndSticker.SUB_linkCleanerByAngle.suppressLinksAngularParam = 2 * Math.PI * this.propAngle;
                var mamesh = graterAndSticker.goChanging();
                //$$$end
                //$$$bh visualization
                var linkViewer0 = new mathis.visu3d.LinksViewer(mamesh, this.mathisFrame.scene);
                linkViewer0.go();
                /**source vertices in blue*/
                var verticesViewerSource = new mathis.visu3d.VerticesViewer(mamesh, this.mathisFrame.scene);
                verticesViewerSource.vertices = graterAndSticker.OUT_stickingMap.allKeys();
                verticesViewerSource.color = new mathis.Color(mathis.Color.names.blueviolet);
                verticesViewerSource.go();
                /**receiver vertices in red*/
                var verticesViewer = new mathis.visu3d.VerticesViewer(mamesh, this.mathisFrame.scene);
                verticesViewer.vertices = [];
                for (var _i = 0, _a = graterAndSticker.OUT_stickingMap.allValues(); _i < _a.length; _i++) {
                    var vertices = _a[_i];
                    verticesViewer.vertices = verticesViewer.vertices.concat(vertices);
                }
                verticesViewer.go();
                //$$$eh
            };
            return GrateGluedMamesh;
        }());
        var MergeVersusStick = (function () {
            function MergeVersusStick(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.NAME = "MergeVersusStick";
                this.TITLE = "Merging or Sticking mameshes";
                this.oneVersusTwoMameshes = false;
                this.$$$oneVersusTwoMameshes = [true, false];
                this.toleranceToBeOneOfTheClosest = 0.05;
                this.$$$toleranceToBeOneOfTheClosest = [0, 0.05, 0.1, 0.2, 0.5, 1, 1.5, 2];
                this.suppressLinksAngularlyTooClose = false;
                this.$$$suppressLinksAngularlyTooClose = [true, false];
                this.stickOrMerge = true;
                this.$$$stickOrMerge = [true, false];
                this.proximityCoef = 1.2;
                this.$$$proximityCoef = [0.2, 0.5, 0.8, 1, 1.2, 1.5, 2, 3];
                this.angle = 0.01;
                this.$$$angle = [0, 0.005, 0.01, 0.02, 0.05];
                this.slow = true;
                this.$$$slow = [true, false];
                this.resolution = 10;
                this.$$$resolution = [5, 10, 15, 20];
                this.hole = 0.97;
                this.$$$hole = [0.8, 0.9, 0.95, 0.97, 0.99, 1];
                this.mathisFrame = mathisFrame;
            }
            MergeVersusStick.prototype.goForTheFirstTime = function () {
                this.mathisFrame.clearScene();
                this.mathisFrame.addDefaultCamera();
                this.mathisFrame.addDefaultLight();
                this.go();
            };
            MergeVersusStick.prototype.go = function () {
                this.mathisFrame.clearScene(false, false);
                //$$$b
                var oneVersusTwoMameshes = this.oneVersusTwoMameshes;
                //$$$e
                //$$$bh mameshes creation
                var vertices0 = [];
                var vertices1 = [];
                var mamesh0;
                var mamesh1;
                if (oneVersusTwoMameshes) {
                    var basis = new mathis.reseau.BasisForRegularReseau();
                    basis.origin = new mathis.XYZ(0, -0.7, 0);
                    basis.end = new mathis.XYZ(2 * Math.PI, 0.7, 0);
                    basis.nbI = 20;
                    basis.nbJ = 10;
                    basis.nbHorizontalDecays = 2;
                    mamesh0 = new mathis.reseau.Regular(basis).go();
                    mamesh1 = mamesh0;
                    for (var _i = 0, _a = mamesh0.vertices; _i < _a.length; _i++) {
                        var v = _a[_i];
                        if (v.param.x == 0)
                            vertices0.push(v);
                        else if (v.param.x == basis.nbI - 1)
                            vertices1.push(v);
                    }
                    for (var i = 0; i < mamesh0.vertices.length; i++) {
                        var position = mamesh0.vertices[i].position;
                        var theta = position.x * this.hole;
                        position.x = Math.cos(theta - Math.PI / 2);
                        position.z = Math.sin(theta - Math.PI / 2);
                    }
                }
                else {
                    var basis0 = new mathis.reseau.BasisForRegularReseau();
                    basis0.origin = new mathis.XYZ(-1, -0.9, 0);
                    basis0.end = new mathis.XYZ(-0.05, 1.1, 0);
                    basis0.nbI = 5;
                    basis0.nbJ = 10;
                    mamesh0 = new mathis.reseau.Regular(basis0).go();
                    var basis1 = new mathis.reseau.BasisForRegularReseau();
                    basis1.origin = new mathis.XYZ(0.05, -1, 0);
                    basis1.end = new mathis.XYZ(1, 1, 0);
                    basis1.nbI = 5;
                    basis1.nbJ = 10;
                    mamesh1 = new mathis.reseau.Regular(basis1).go();
                    vertices0 = mamesh0.vertices;
                    vertices1 = mamesh1.vertices;
                    /**with big angle, the two mameshes overlap, and the result is not nice
                     * -> we need to grate mameshes before (see further on)*/
                    new mathis.spacialTransformations.Similitude(mamesh1.vertices, 2 * Math.PI * this.angle).goChanging();
                }
                //$$$eh
                //$$$begin
                /**two ways for creating a map vertex->Vertex[] (source->receivers) to say which vertices are stick or merge with other */
                var map;
                if (this.slow) {
                    var mapFinder = new mathis.grateAndGlue.FindSickingMapFromVertices(vertices0, vertices1);
                    /**if e.g. equal to 2, then two vertices are declared to be close when their distance is at most 2 times the mean distance of their link */
                    mapFinder.proximityCoef = this.proximityCoef;
                    /**if equal to 0, in the map vertex->Vertex[] (source->receivers), receivers is a list of only one vertex : the closest one to the source.
                     * If equal to 2 (e.g.),receivers contain the closest vertices from source (let's say the distance is d)
                     * and also all the vertices at distance less that 2*d  */
                    mapFinder.toleranceToBeOneOfTheClosest = this.toleranceToBeOneOfTheClosest;
                    map = mapFinder.go();
                }
                else {
                    /** A fast method: it creates a dictionary or approximative vertex-positions, which avoid a double loop over
                     * the two vertex-list. The proximity is parametrized by {@link FindCloseVerticesFast#nbDistinctPoint}
                     * which indicate how many different positions are allowed between the two extreme points (typically 1000).
                     * (imagine that it creates a sort of grid, as in classical drawing software). With very small values (e.g. 5)
                     * the behaviour is weird.
                     * */
                    var mapFinder = new mathis.grateAndGlue.FindCloseVerticesFast(vertices0, vertices1);
                    mapFinder.nbDistinctPoint = this.resolution;
                    map = mapFinder.go();
                }
                //$$$e
                //$$$bh  Warning : vertices0 and vertices1 might be disjoint...
                /** Sources and Receiver must be disjoint for sticking or merging.
                 * In the present code, we have construct two lists vertices0 and vertices1 which are disjoints.
                 * You can give non-disjoint lists to {@link FindCloseVerticesFast} which make a choice to
                 * separate sources and receiver.
                 * You can also give non-disjoint list to {@link FindSickingMapFromVertices} but in this case
                 * you must set {@link FindSickingMapFromVertices#acceptOnlyDisjointReceiverAndSource} to false;
                 * and after you have to make yourself the separation between source and receiver*/
                //$$$eh
                //$$$b
                //n
                /**compare merging and sticking*/
                if (this.stickOrMerge) {
                    /**sticking : links are added from source to all its receivers*/
                    var sticker = new mathis.grateAndGlue.Sticker(mamesh0, mamesh1, map);
                    sticker.goChanging();
                }
                else {
                    /**merging : the source is sent to the first receiver (the closest) */
                    var merger = new mathis.grateAndGlue.Merger(mamesh0, mamesh1, map);
                    merger.goChanging();
                }
                //n
                if (this.suppressLinksAngularlyTooClose) {
                    new mathis.linkModule.LinksSorterAndCleanerByAngles(mamesh0).goChanging();
                }
                //$$$end
                //$$$bh visualization
                var linkViewer0 = new mathis.visu3d.LinksViewer(mamesh0, this.mathisFrame.scene);
                linkViewer0.go();
                new mathis.visu3d.SurfaceViewer(mamesh0, this.mathisFrame.scene).go();
                //$$$eh
            };
            return MergeVersusStick;
        }());
    })(appli = mathis.appli || (mathis.appli = {}));
})(mathis || (mathis = {}));
