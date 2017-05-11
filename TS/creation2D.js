/**
 * Created by vigon on 02/06/2016.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var mathis;
(function (mathis) {
    var creation2D;
    (function (creation2D) {
        (function (PartShape) {
            PartShape[PartShape["triangulatedTriangle"] = 0] = "triangulatedTriangle";
            PartShape[PartShape["triangulatedRect"] = 1] = "triangulatedRect";
            PartShape[PartShape["square"] = 2] = "square";
            PartShape[PartShape["polygon3"] = 3] = "polygon3";
            PartShape[PartShape["polygon4"] = 4] = "polygon4";
            PartShape[PartShape["polygon5"] = 5] = "polygon5";
            PartShape[PartShape["polygon6"] = 6] = "polygon6";
            PartShape[PartShape["polygon7"] = 7] = "polygon7";
            PartShape[PartShape["polygon8"] = 8] = "polygon8";
            PartShape[PartShape["polygon9"] = 9] = "polygon9";
            PartShape[PartShape["polygon10"] = 10] = "polygon10";
            PartShape[PartShape["polygon11"] = 11] = "polygon11";
            PartShape[PartShape["polygon12"] = 12] = "polygon12";
        })(creation2D.PartShape || (creation2D.PartShape = {}));
        var PartShape = creation2D.PartShape;
        var Concentric = (function () {
            function Concentric(individualNbI, individualNbJ) {
                this.SUB_gratAndStick = new mathis.grateAndGlue.ConcurrentMameshesGraterAndSticker();
                this.SUB_oppositeLinkAssocierByAngles = new mathis.linkModule.OppositeLinkAssocierByAngles(null);
                this.SUB_mameshCleaner = new mathis.mameshModification.MameshCleaner(null);
                this.origine = new mathis.XYZ(0, 0, 0);
                this.end = new mathis.XYZ(1, 1, 0);
                /**a very small angle to avoid the bug of BABYLON*/
                this.rotation = 0.001;
                this.shapes = [PartShape.square];
                this.proportions = [new mathis.UV(1, 1), new mathis.UV(1, 1)];
                this.individualScales = [new mathis.UV(1, 1)];
                this.individualRotations = [0];
                this.individualTranslation = [new mathis.XYZ(0, 0, 0), new mathis.XYZ(0, 0, 0)];
                this.nbPatches = 2;
                /**if zero, sticking is made only for closest voisin*/
                this.toleranceToBeOneOfTheClosest = 0.55; //0.05
                this.stratesToSuppressFromCorners = [0];
                /**e.g. XYZ(1,0.5,0) will suppress all the vertical branching while
                 *      XYZ(0.5,1,0) will suppress all the horizontal branching */
                this.scalingBeforeOppositeLinkAssociations = null;
                this.exponentOfRoundingFunction = [1];
                this.percolationProba = [0];
                this.forceToGrate = [0.1];
                this.nbI = individualNbI;
                this.nbJ = individualNbJ;
            }
            Concentric.prototype.go = function () {
                var subMa = [];
                var _loop_1 = function(j) {
                    /**other function are possible*/
                    var indexModulo = (j) % this_1.shapes.length;
                    var partShape = this_1.shapes[indexModulo];
                    var name_1 = PartShape[partShape];
                    var nI = Math.round(this_1.nbI * this_1.proportions[j % this_1.proportions.length].u);
                    var nJ = Math.round(this_1.nbJ * this_1.proportions[j % this_1.proportions.length].v);
                    var radiusI = 0.5 * this_1.individualScales[j % this_1.individualScales.length].u * this_1.proportions[j % this_1.proportions.length].u;
                    var radiusJ = 0.5 * this_1.individualScales[j % this_1.individualScales.length].v * this_1.proportions[j % this_1.proportions.length].v;
                    var mamesh = void 0;
                    /**as usual, deformation of individual patches are  : scaling, then rotation, then translation */
                    if (name_1.indexOf('polygon') != -1) {
                        var nbSides = parseInt(name_1.slice(7, name_1.length));
                        var crea = new mathis.reseau.TriangulatedPolygone(nbSides);
                        crea.origin = new mathis.XYZ(-radiusI, -radiusJ, 0);
                        crea.end = new mathis.XYZ(radiusI, radiusJ, 0);
                        /** nbI and nbJ are sort of diameter, so the constantRadius is alf the mean of the diameter */
                        crea.nbSubdivisionInARadius = Math.floor((nI + nJ) / 4);
                        mamesh = crea.go();
                    }
                    else if (partShape == PartShape.square || partShape == PartShape.triangulatedRect) {
                        var gene = new mathis.reseau.BasisForRegularReseau();
                        /**here the scaling*/
                        gene.origin = new mathis.XYZ(-radiusI, -radiusJ, 0);
                        gene.end = new mathis.XYZ(radiusI, radiusJ, 0);
                        gene.nbI = nI;
                        gene.nbJ = nJ;
                        if (partShape == PartShape.triangulatedRect)
                            gene.squareMailleInsteadOfTriangle = false;
                        gene.go();
                        var regular = new mathis.reseau.Regular(gene);
                        if (partShape == PartShape.triangulatedRect)
                            regular.oneMoreVertexForOddLine = true;
                        mamesh = regular.go();
                    }
                    else if (partShape == PartShape.triangulatedTriangle) {
                        var creator = new mathis.reseau.TriangulatedTriangle();
                        creator.origin = new mathis.XYZ(-radiusI, -radiusJ, 0);
                        creator.end = new mathis.XYZ(radiusI, radiusJ, 0);
                        creator.nbSubdivisionInSide = (nI + nJ) / 2;
                        mamesh = creator.go();
                    }
                    if (this_1.propBeginToRound || this_1.propEndToRound || this_1.integerBeginToRound || this_1.integerEndToRound) {
                        var rounder = new mathis.spacialTransformations.RoundSomeStrates(mamesh);
                        if (this_1.propBeginToRound == null)
                            rounder.propBeginToRound = 0;
                        else
                            rounder.propBeginToRound = this_1.propBeginToRound[j % this_1.propBeginToRound.length];
                        if (this_1.propEndToRound == null)
                            rounder.propEndToRound = 1;
                        else
                            rounder.propEndToRound = this_1.propEndToRound[j % this_1.propEndToRound.length];
                        if (this_1.integerBeginToRound != null)
                            rounder.integerBeginToRound = this_1.integerBeginToRound[j % this_1.integerBeginToRound.length];
                        if (this_1.integerEndToRound != null)
                            rounder.integerEndToRound = this_1.integerEndToRound[j % this_1.integerEndToRound.length];
                        rounder.exponentOfRoundingFunction = this_1.exponentOfRoundingFunction[j % this_1.exponentOfRoundingFunction.length];
                        rounder.referenceRadiusIsMinVersusMaxVersusMean = 2;
                        rounder.preventStratesCrossings = true;
                        rounder.goChanging();
                    }
                    var percolation = this_1.percolationProba[j * this_1.percolationProba.length];
                    if (percolation > 0) {
                        var percolator = new mathis.mameshModification.PercolationOnLinks(mamesh);
                        percolator.percolationProba = percolation;
                        percolator.goChanging();
                    }
                    if (this_1.stratesToSuppressFromCorners[j % this_1.stratesToSuppressFromCorners.length] > 0) {
                        var supp = new mathis.grateAndGlue.ExtractCentralPart(mamesh, this_1.stratesToSuppressFromCorners[j % this_1.stratesToSuppressFromCorners.length]);
                        supp.suppressFromBorderVersusCorner = false;
                        mamesh = supp.go();
                        mamesh.isolateMameshVerticesFromExteriorVertices();
                    }
                    subMa.push(mamesh);
                    var decay = this_1.individualTranslation[j % this_1.individualTranslation.length];
                    var angle = this_1.individualRotations[j % this_1.individualRotations.length];
                    var mat = new mathis.MM();
                    mathis.geo.axisAngleToMatrix(new mathis.XYZ(0, 0, -1), angle, mat);
                    mamesh.vertices.forEach(function (v) {
                        mathis.geo.multiplicationMatrixVector(mat, v.position, v.position);
                        v.position.add(decay);
                    });
                };
                var this_1 = this;
                for (var j = 0; j < this.nbPatches; j++) {
                    _loop_1(j);
                }
                var res;
                /**just to win time : when there is only one IN_mamesh, no need of grating and stiking*/
                if (this.nbPatches > 1) {
                    this.SUB_gratAndStick.IN_mameshes = subMa;
                    this.SUB_gratAndStick.toleranceToBeOneOfTheClosest = this.toleranceToBeOneOfTheClosest;
                    this.SUB_gratAndStick.SUB_grater.proportionOfSeeds = this.forceToGrate;
                    res = this.SUB_gratAndStick.goChanging();
                }
                else {
                    res = subMa[0];
                    mathis.spacialTransformations.adjustInASquare(res, new mathis.XYZ(0, 0, 0), new mathis.XYZ(1, 1, 0));
                    res.clearOppositeInLinks();
                }
                if (this.scalingBeforeOppositeLinkAssociations != null)
                    mathis.spacialTransformations.adjustInASquare(res, new mathis.XYZ(0, 0, 0), new mathis.XYZ(this.scalingBeforeOppositeLinkAssociations.x, this.scalingBeforeOppositeLinkAssociations.y, 0));
                this.SUB_oppositeLinkAssocierByAngles.vertices = res.vertices;
                this.SUB_oppositeLinkAssocierByAngles.goChanging();
                this.SUB_mameshCleaner.IN_mamesh = res;
                this.SUB_mameshCleaner.goChanging();
                new mathis.spacialTransformations.Similitude(res.vertices, this.rotation).goChanging();
                mathis.spacialTransformations.adjustInASquare(res, this.origine, this.end);
                return res;
            };
            return Concentric;
        }());
        creation2D.Concentric = Concentric;
        var Patchwork = (function (_super) {
            __extends(Patchwork, _super);
            function Patchwork(nbI, nbJ, nbIPart, nbJPart) {
                _super.call(this, nbI, nbJ);
                this.nbPatchesI = 2;
                this.nbPatchesJ = 2;
                this.patchesInQuinconce = false;
                this.oddPatchLinesAreTheSameVersusLongerVersusShorter = 0;
                this.alternateShapeAccordingIPlusJVersusCounter = true;
                this.nbPatchesI = nbIPart;
                this.nbPatchesJ = nbJPart;
                /**field of the super class, which will be determine in goChanging-method*/
                this.nbPatches = 0;
                this.individualTranslation = [];
                //this.shapes=[]
            }
            Patchwork.prototype.go = function () {
                /**2 fields recomputed*/
                this.individualTranslation = [];
                this.nbPatches = 0;
                var shapes = [];
                var count = 0;
                for (var j = 0; j < this.nbPatchesJ; j++) {
                    var someMoreOrLessOfOdd = 0;
                    if (j % 2 == 1) {
                        if (this.oddPatchLinesAreTheSameVersusLongerVersusShorter == 0)
                            someMoreOrLessOfOdd = 0;
                        else if (this.oddPatchLinesAreTheSameVersusLongerVersusShorter == 1)
                            someMoreOrLessOfOdd = 1;
                        else if (this.oddPatchLinesAreTheSameVersusLongerVersusShorter == 2)
                            someMoreOrLessOfOdd = -1;
                        else
                            throw 'must be 0 or 1 or 2';
                    }
                    for (var i = 0; i < this.nbPatchesI + someMoreOrLessOfOdd; i++) {
                        this.nbPatches++;
                        var dec = 0;
                        if (this.patchesInQuinconce && j % 2 == 1) {
                            if (this.oddPatchLinesAreTheSameVersusLongerVersusShorter == 0)
                                dec = -0.5;
                            if (this.oddPatchLinesAreTheSameVersusLongerVersusShorter == 1)
                                dec = -0.5;
                            if (this.oddPatchLinesAreTheSameVersusLongerVersusShorter == 2)
                                dec = 0.5;
                        }
                        this.individualTranslation.push(new mathis.XYZ(i + dec, j, 0));
                        count++;
                        var ind = (this.alternateShapeAccordingIPlusJVersusCounter) ? (i + someMoreOrLessOfOdd + j) : count;
                        //this.proportions.push(this.patchSize[ind%this.patchSize.length])
                        shapes.push(this.shapes[ind % this.shapes.length]);
                    }
                }
                this.shapes = shapes;
                return _super.prototype.go.call(this);
            };
            return Patchwork;
        }(Concentric));
        creation2D.Patchwork = Patchwork;
    })(creation2D = mathis.creation2D || (mathis.creation2D = {}));
})(mathis || (mathis = {}));
