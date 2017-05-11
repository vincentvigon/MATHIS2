/**
 * Created by vigon on 10/08/2016.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var mathis;
(function (mathis) {
    var lineModule;
    (function (lineModule) {
        var LineComputer = (function () {
            function LineComputer(mamesh) {
                this.cannotOverwriteExistingLines = true;
                this.startingVertices = null;
                this.restrictLinesToTheseVertices = null;
                this.lookAtBifurcation = true;
                this.mamesh = mamesh;
            }
            LineComputer.prototype.go = function () {
                if (this.mamesh == null)
                    throw ' a null mamesh';
                if (this.mamesh.vertices == null || this.mamesh.vertices.length == 0)
                    throw 'no vertices in this mamesh';
                if (this.mamesh.linesWasMade && this.cannotOverwriteExistingLines)
                    throw 'lines already exist for this mamesh';
                var preres = makeLineCatalogue2(this.mamesh.vertices, this.lookAtBifurcation);
                var res = [];
                if (this.startingVertices != null) {
                    var dicoStarting = new mathis.HashMap();
                    for (var _i = 0, _a = this.startingVertices; _i < _a.length; _i++) {
                        var v = _a[_i];
                        dicoStarting.putValue(v, true);
                    }
                    for (var _b = 0, preres_1 = preres; _b < preres_1.length; _b++) {
                        var line = preres_1[_b];
                        for (var _c = 0, _d = line.vertices; _c < _d.length; _c++) {
                            var vv = _d[_c];
                            if (dicoStarting.getValue(vv) != null) {
                                res.push(line);
                                break;
                            }
                        }
                    }
                }
                else
                    res = preres;
                if (this.restrictLinesToTheseVertices != null) {
                    var cutter = new LinesCuter(res, this.restrictLinesToTheseVertices);
                    res = cutter.go();
                }
                this.mamesh.lines = res;
                return res;
            };
            return LineComputer;
        }());
        lineModule.LineComputer = LineComputer;
        var LinesCuter = (function () {
            function LinesCuter(lines, vertices) {
                this.lines = lines;
                this.vertices = vertices;
            }
            LinesCuter.prototype.go = function () {
                var _this = this;
                this.allPresentVertices = new mathis.HashMap();
                for (var _i = 0, _a = this.vertices; _i < _a.length; _i++) {
                    var v = _a[_i];
                    this.allPresentVertices.putValue(v, true);
                }
                var res = [];
                this.lines.forEach(function (line) {
                    if (!line.isLoop) {
                        var linesAsVertex = _this.cutOneLine(line.vertices);
                        for (var _i = 0, linesAsVertex_1 = linesAsVertex; _i < linesAsVertex_1.length; _i++) {
                            var l = linesAsVertex_1[_i];
                            res.push(new mathis.Line(l, false));
                        }
                    }
                });
                this.lines.forEach(function (li) {
                    if (li.isLoop) {
                        var line = li.vertices;
                        var firstIndexWithHole = -1;
                        for (var i = 0; i < line.length; i++) {
                            if (_this.allPresentVertices.getValue(line[i]) == null) {
                                firstIndexWithHole = i;
                                break;
                            }
                        }
                        /**not cutted loop line*/
                        if (firstIndexWithHole == -1)
                            res.push(li);
                        else {
                            var shiftedLine = [];
                            for (var j = 0; j < line.length; j++) {
                                shiftedLine.push(line[(j + firstIndexWithHole) % line.length]);
                            }
                            var linesAsVertex = _this.cutOneLine(shiftedLine);
                            for (var _i = 0, linesAsVertex_2 = linesAsVertex; _i < linesAsVertex_2.length; _i++) {
                                var l = linesAsVertex_2[_i];
                                res.push(new mathis.Line(l, false));
                            }
                        }
                    }
                });
                return res;
            };
            LinesCuter.prototype.cutOneLine = function (path) {
                var allLittlePath = [];
                allLittlePath[0] = [];
                var currentPathIndex = -1;
                var previousWasZero = true;
                for (var i = 0; i < path.length; i++) {
                    if (this.allPresentVertices.getValue(path[i]) == true) {
                        if (!previousWasZero)
                            allLittlePath[currentPathIndex].push(path[i]);
                        else {
                            currentPathIndex++;
                            allLittlePath[currentPathIndex] = [];
                            allLittlePath[currentPathIndex].push(path[i]);
                            previousWasZero = false;
                        }
                    }
                    else {
                        previousWasZero = true;
                    }
                }
                var allLittlePathCleaned = [];
                allLittlePath.forEach(function (li) {
                    if (li.length >= 2)
                        allLittlePathCleaned.push(li);
                });
                // let lastLineAdded=allLittlePath.pop()
                // if (lastLineAdded.length==1){
                //     let lastVertex=path[path.length-1]
                //     if(this.IN_mamesh.paramToVertex.getValue(lastVertex.param)!=null&& lastVertex.hasVoisin(lastLineAdded[lastLineAdded.length-1]) ){
                //         lastLineAdded.push(lastVertex)
                //         allLittlePath.push(lastLineAdded)
                //     }
                // }
                // else if (lastLineAdded.length>1){
                //     let lastVertex=path[path.length-1]
                //     if(this.IN_mamesh.paramToVertex.getValue(lastVertex.param)!=null){
                //         lastLineAdded.push(lastVertex)
                //         allLittlePath.push(lastLineAdded)
                //     }
                // }
                return allLittlePathCleaned;
            };
            return LinesCuter;
        }());
        lineModule.LinesCuter = LinesCuter;
        /** warning : arg graph must be a whole graph, not a portion of graph.
         * */
        function makeLineCatalogue2(graph, lookAtBifurcations) {
            var segmentsAlreadySeen = new mathis.HashMap();
            var lines = [];
            function addOneSegment(isLoop, lineInConstruction, segmentsAlreadySeenInTheBuildLine, hasBifurcate) {
                var last = lineInConstruction[lineInConstruction.length - 1];
                var beforeLast = lineInConstruction[lineInConstruction.length - 2];
                segmentsAlreadySeen.putValue(new mathis.Segment(beforeLast, last), true);
                var opposites = last.getOpposites(beforeLast);
                /**end of line*/
                if (opposites == null) {
                    if (isLoop)
                        throw 'strange : probably, the function makeLineCatalogue2 have as args a non complete graph (call getGroup before)';
                    lines.push(new mathis.Line(lineInConstruction, false));
                }
                else if (opposites.length == 0)
                    throw 'convention: is no opposite, the array opposite must be null, and not empty';
                else if (segmentsAlreadySeenInTheBuildLine.getValue(new mathis.Segment(beforeLast, last)) == true) {
                    lines.push(new mathis.Line(lineInConstruction, false));
                }
                else {
                    segmentsAlreadySeenInTheBuildLine.putValue(new mathis.Segment(beforeLast, last), true);
                    var nbOp = opposites.length;
                    if (!lookAtBifurcations)
                        nbOp = 1;
                    for (var i = 0; i < nbOp; i++) {
                        var opposite = opposites[i];
                        if (opposite == lineInConstruction[0]) {
                            //if (!isLoop) logger.c('a li')
                            lines.push(new mathis.Line(lineInConstruction, true));
                            segmentsAlreadySeen.putValue(new mathis.Segment(last, lineInConstruction[0]), true);
                        }
                        else {
                            if (i < nbOp - 1) {
                                var copySegmentsAlreadySeenIn = new mathis.HashMap();
                                for (var i_1 = 0; i_1 < lineInConstruction.length - 1; i_1++)
                                    copySegmentsAlreadySeenIn.putValue(new mathis.Segment(lineInConstruction[i_1], lineInConstruction[i_1 + 1]), true);
                                var copyLineInConstruction = lineInConstruction.concat([opposite]);
                                addOneSegment(isLoop, copyLineInConstruction, copySegmentsAlreadySeenIn, true);
                            }
                            else {
                                lineInConstruction.push(opposite);
                                addOneSegment(isLoop, lineInConstruction, segmentsAlreadySeenInTheBuildLine, hasBifurcate);
                            }
                        }
                    }
                }
            }
            /** we look for the starts of straight lines */
            graph.forEach(function (vertex) {
                vertex.links.forEach(function (link) {
                    if (link.opposites == null) {
                        if (lookAtBifurcations || segmentsAlreadySeen.getValue(new mathis.Segment(vertex, link.to)) == null) {
                            var lineInConstruction = [vertex, link.to];
                            var segmentAlreadySeenInThisBuildLine = new mathis.HashMap();
                            addOneSegment(false, lineInConstruction, segmentAlreadySeenInThisBuildLine, false);
                        }
                    }
                });
            });
            /**when we look at bifurcation, we create several times the sames lines*/
            if (lookAtBifurcations) {
                var lineDico = new mathis.HashMap();
                var straightWithoutRepetitions = [];
                for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
                    var line = lines_1[_i];
                    if (lineDico.getValue(line) == null)
                        straightWithoutRepetitions.push(line);
                    lineDico.putValue(line, true);
                }
                lines = straightWithoutRepetitions;
            }
            /**Now, only loop lines  remain*/
            graph.forEach(function (cell) {
                cell.links.forEach(function (nei) {
                    /**Contrary to straight line, when we look for bifurcation, we do not start a line from a segment already seen: this would create too much equivalents lines */
                    if (segmentsAlreadySeen.getValue(new mathis.Segment(cell, nei.to)) == null) {
                        var lineInConstruction = [cell, nei.to];
                        var segmentAlreadySeenInThisBuildLine = new mathis.HashMap();
                        addOneSegment(true, lineInConstruction, segmentAlreadySeenInThisBuildLine, false);
                    }
                });
            });
            return lines;
        }
        lineModule.makeLineCatalogue2 = makeLineCatalogue2;
        var PackSegment = (function (_super) {
            __extends(PackSegment, _super);
            function PackSegment() {
                _super.call(this, true);
            }
            return PackSegment;
        }(mathis.HashMap));
        //TODO separer en 2 classes
        var CreateAColorIndexRespectingBifurcationsAndSymmetries = (function () {
            function CreateAColorIndexRespectingBifurcationsAndSymmetries(mamesh) {
                this.packSymmetricLines = true;
                this.forSymmetriesUsePositionVersusParam = true;
                this.useConsecutiveIntegerForPackNumber = true;
                this.symmetries = null;
                this.OUT_nbFoundSymmetricLines = 0;
                this.mamesh = mamesh;
            }
            CreateAColorIndexRespectingBifurcationsAndSymmetries.prototype.go = function () {
                if (!this.mamesh.linesWasMade)
                    throw 'no line for this IN_mamesh';
                var res = [];
                var packIndex = 0;
                var segmentToPack = new mathis.HashMap();
                for (var _i = 0, _a = this.mamesh.lines; _i < _a.length; _i++) {
                    var line = _a[_i];
                    var segmentAlreadyCatalogued = [];
                    var segmentNeverCatalogued = [];
                    for (var _b = 0, _c = line.allSegments(); _b < _c.length; _b++) {
                        var segment = _c[_b];
                        if (segmentToPack.getValue(segment) != null)
                            segmentAlreadyCatalogued.push(segment);
                        else
                            segmentNeverCatalogued.push(segment);
                    }
                    if (segmentAlreadyCatalogued.length == 0) {
                        var newPack = new PackSegment();
                        newPack.index = packIndex++;
                        for (var _d = 0, _e = line.allSegments(); _d < _e.length; _d++) {
                            var segment = _e[_d];
                            newPack.putValue(segment, true);
                            segmentToPack.putValue(segment, newPack);
                        }
                    }
                    else {
                        var firstPack = segmentToPack.getValue(segmentAlreadyCatalogued[0]);
                        for (var i = 1; i < segmentAlreadyCatalogued.length; i++)
                            this.segmentAndHisPackJoinNewPack(segmentAlreadyCatalogued[i], firstPack, segmentToPack);
                        for (var _f = 0, segmentNeverCatalogued_1 = segmentNeverCatalogued; _f < segmentNeverCatalogued_1.length; _f++) {
                            var seg = segmentNeverCatalogued_1[_f];
                            firstPack.putValue(seg, true);
                            segmentToPack.putValue(seg, firstPack);
                        }
                    }
                }
                if (this.symmetries != null) {
                    /**to look for symmetries, we round a lot the hashes of XYZ*/
                    mathis.XYZ.nbDecimalForHash = 1;
                    var symCheck = new mathis.StringMap();
                    for (var i = 0; i < this.mamesh.lines.length; i++) {
                        var line = this.mamesh.lines[i];
                        var hash = line.hashStringUpToSymmetries(this.symmetries, this.forSymmetriesUsePositionVersusParam);
                        var packSegment = symCheck.getValue(hash);
                        if (packSegment == null)
                            symCheck.putValue(hash, segmentToPack.getValue(new mathis.Segment(line.vertices[0], line.vertices[1])));
                        else {
                            this.OUT_nbFoundSymmetricLines++;
                            var otherPackSegment = segmentToPack.getValue(new mathis.Segment(line.vertices[0], line.vertices[1]));
                            /**on ne change la couleur que si les deux pack on la même longueur, ce qui est toujours le cas si le pack n'est constitué que d'une seule ligne
                             * cela évite de mettre la même couleur sur deux pack qui ont une ligne symétrique, mais pas les autres*/
                            if (otherPackSegment.size() == packSegment.size())
                                otherPackSegment.index = packSegment.index;
                        }
                    }
                    mathis.XYZ.nbDecimalForHash = 5;
                }
                /**each line get the packet index*/
                for (var i = 0; i < this.mamesh.lines.length; i++) {
                    var line = this.mamesh.lines[i];
                    res[i] = segmentToPack.getValue(new mathis.Segment(line.vertices[0], line.vertices[1])).index;
                }
                if (this.useConsecutiveIntegerForPackNumber && this.packSymmetricLines) {
                    var newRes = [];
                    var maxIndex = mathis.tab.maxIndexOfNumericList(res);
                    var max = res[maxIndex];
                    var decay = 0;
                    for (var a = 0; a <= max; a++) {
                        var aIsFound = false;
                        for (var j = 0; j < res.length; j++) {
                            if (res[j] == a) {
                                newRes[j] = a - decay;
                                aIsFound = true;
                            }
                        }
                        if (!aIsFound)
                            decay++;
                    }
                    res = newRes;
                }
                var res2 = new mathis.HashMap();
                for (var i = 0; i < this.mamesh.lines.length; i++) {
                    res2.putValue(this.mamesh.lines[i], res[i]);
                }
                return res2;
            };
            CreateAColorIndexRespectingBifurcationsAndSymmetries.prototype.segmentAndHisPackJoinNewPack = function (segment, pack, segmentToPack) {
                var oldPack = segmentToPack.getValue(segment);
                for (var _i = 0, _a = oldPack.allKeys(); _i < _a.length; _i++) {
                    var seg = _a[_i];
                    pack.putValue(seg, true);
                    segmentToPack.putValue(seg, pack);
                }
                segmentToPack.putValue(segment, pack);
            };
            return CreateAColorIndexRespectingBifurcationsAndSymmetries;
        }());
        lineModule.CreateAColorIndexRespectingBifurcationsAndSymmetries = CreateAColorIndexRespectingBifurcationsAndSymmetries;
    })(lineModule = mathis.lineModule || (mathis.lineModule = {}));
})(mathis || (mathis = {}));
