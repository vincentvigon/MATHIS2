/**
 * Created by vigon on 22/02/2016.
 */
var mathis;
(function (mathis) {
    var mameshModification;
    (function (mameshModification) {
        //import RadiusFunction = mathis.visu3d.LineGameoStatic.RadiusFunction;
        function completSegment(newParamForMiddle, mamesh, segment, orthogonalVertex) {
            /**premier passage. Pas de milieu */
            if (segment.middle == null) {
                var position = new mathis.XYZ(0, 0, 0);
                mathis.geo.between(segment.a.position, segment.b.position, 0.5, position);
                segment.middle = mamesh.newVertex(position, Math.max(segment.a.dichoLevel, segment.b.dichoLevel) + 1, newParamForMiddle(segment.a.param, segment.b.param));
                if (segment.a.hasMark(mathis.Vertex.Markers.border) && segment.b.hasMark(mathis.Vertex.Markers.border))
                    segment.middle.markers.push(mathis.Vertex.Markers.border);
                /**1 heure de perdue parce que j avais mis if (orthoIndex) au lieu de :if (orthoIndex!=null).
                 * Ne pas oublié que if(0) renvoit false !!! */
                if (orthogonalVertex != null)
                    segment.orth1 = orthogonalVertex;
            }
            else if (orthogonalVertex != null)
                segment.orth2 = orthogonalVertex;
        }
        var TriangleDichotomer = (function () {
            function TriangleDichotomer(mamesh) {
                this.makeLinks = true;
                this.trianglesToCut = null;
                this.nbDicho = 1;
                /**what is the new param? Can be adapted, e.g. for cyclic parametrisation*/
                this.newParamForMiddle = function (p1, p2) {
                    var res = new mathis.XYZ(0, 0, 0);
                    mathis.geo.between(p1, p2, 1 / 2, res);
                    return res;
                };
                this.mamesh = mamesh;
            }
            TriangleDichotomer.prototype.checkArgs = function () {
                // if (!this.mamesh.linksOK && this.createNewLinks) {
                //     logger.c('be carefull : it is impossible to make links because links are not ok')
                //     this.createNewLinks = false
                // }
                // if (!this.createNewLinks) {
                //     this.mamesh.linksOK = false
                // }
                if (this.mamesh.smallestTriangles.length == 0)
                    mathis.logger.c('no triangulatedRect for triangulatedRect dichotomy');
            };
            /** two methods to make your IN_mamesh thiner */
            TriangleDichotomer.prototype.go = function () {
                this.checkArgs();
                if (!this.makeLinks)
                    this.mamesh.clearLinksAndLines();
                /**else links and opposite are made during dichotomy process (which is not the case with squareDichotomer)*/
                var newTriangles;
                if (this.trianglesToCut == null) {
                    this.trianglesToCut = this.mamesh.smallestTriangles;
                    newTriangles = new Array();
                }
                else {
                    newTriangles = new mathis.tab.ArrayMinusBlocksElements(this.mamesh.smallestTriangles, 3, this.trianglesToCut).go();
                }
                //if (this.createNewLinks && !this.mamesh.linksOK) throw 'you cannot make links during dichotomy, because your links was not updated'
                //if (!this.createNewLinks) this.mamesh.linksOK = false
                var segments = this.createAndAddSegmentsFromTriangles(this.trianglesToCut);
                /**first passage : we add middle points everywhere, and create the segment list */
                for (var f = 0; f < this.trianglesToCut.length; f += 3) {
                    var v1 = this.trianglesToCut[f];
                    var v2 = this.trianglesToCut[f + 1];
                    var v3 = this.trianglesToCut[f + 2];
                    var segment3 = segments[mathis.Segment.segmentId(v1.hashNumber, v2.hashNumber)];
                    var segment1 = segments[mathis.Segment.segmentId(v2.hashNumber, v3.hashNumber)]; //mesh.getSegmentFromIndex(v2,v3)
                    var segment2 = segments[mathis.Segment.segmentId(v3.hashNumber, v1.hashNumber)]; //mesh.getSegmentFromIndex(v3,v1)
                    if (this.makeLinks) {
                        completSegment(this.newParamForMiddle, this.mamesh, segment3, v3);
                        completSegment(this.newParamForMiddle, this.mamesh, segment1, v1);
                        completSegment(this.newParamForMiddle, this.mamesh, segment2, v2);
                    }
                    else {
                        completSegment(this.newParamForMiddle, this.mamesh, segment3);
                        completSegment(this.newParamForMiddle, this.mamesh, segment1);
                        completSegment(this.newParamForMiddle, this.mamesh, segment2);
                    }
                    var f3 = segment3.middle;
                    var f1 = segment1.middle;
                    var f2 = segment2.middle;
                    //let f3 = getMiddlePoint(mesh.vertices, v1, v2, v3);
                    //let f1 = getMiddlePoint(mesh.vertices, v2, v3, v1);
                    //let f2 = getMiddlePoint(mesh.vertices, v3, v1, v2);
                    newTriangles.push(v1, f3, f2);
                    newTriangles.push(v2, f1, f3);
                    newTriangles.push(v3, f2, f1);
                    newTriangles.push(f3, f1, f2);
                }
                if (this.makeLinks) {
                    for (var segId in segments) {
                        var segment = segments[segId];
                        var segA1 = segments[mathis.Segment.segmentId(segment.a.hashNumber, segment.orth1.hashNumber)];
                        var segB1 = segments[mathis.Segment.segmentId(segment.b.hashNumber, segment.orth1.hashNumber)];
                        if (segment.orth2 != null) {
                            var segA2 = segments[mathis.Segment.segmentId(segment.a.hashNumber, segment.orth2.hashNumber)];
                            var segB2 = segments[mathis.Segment.segmentId(segment.b.hashNumber, segment.orth2.hashNumber)];
                            segment.middle.setTwoOppositeLinks(segA1.middle, segB2.middle);
                            segment.middle.setTwoOppositeLinks(segA2.middle, segB1.middle);
                        }
                        else {
                            segment.middle.setOneLink(segA1.middle);
                            segment.middle.setOneLink(segB1.middle);
                        }
                        try {
                            var changeFleArrival = function (v, old, newVoi) {
                                var fle = v.findLink(old);
                                fle.to = newVoi;
                            };
                            changeFleArrival(segment.a, segment.b, segment.middle);
                            changeFleArrival(segment.b, segment.a, segment.middle);
                            segment.middle.setTwoOppositeLinks(segment.a, segment.b);
                        }
                        catch (e) {
                            throw 'a bad segment, probably your triangles are not corrects (e.g. one missing, or one more)';
                        }
                    }
                }
                //at the end, only the last ilist is kept : this is the list of the thiner triangles.
                this.mamesh.smallestTriangles = newTriangles;
            };
            //private removeTriangleFromList(longList:Vertex[],listToRemove:Vertex[]):Vertex[]{
            //
            //
            //    let  funcToSort=function(a:number, b:number){return a-b}
            //    function key(i,list:Vertex[]):string{
            //        let array=[list[i].hash,list[i+1].hash,list[i+2].hash]
            //        array.sort(funcToSort)
            //        return array[0]+','+array[1]+','+array[2]
            //    }
            //
            //    let dicoToRemove:{ [id:string]:boolean }={}
            //
            //    for (let i=0;i<listToRemove.length;i+=3){
            //        dicoToRemove[key(i,listToRemove)]=true
            //    }
            //
            //    let newLongList=new Array<Vertex>()
            //    for (let i=0;i<longList.length;i+=3){
            //        if (!dicoToRemove[key(i,longList)]){
            //            newLongList.push(longList[i],longList[i+1],longList[i+2])
            //        }
            //    }
            //
            //    return newLongList
            //
            //}
            TriangleDichotomer.prototype.createAndAddSegmentsFromTriangles = function (triangles) {
                var segments = {};
                for (var f = 0; f < triangles.length; f += 3) {
                    var v1 = triangles[f];
                    var v2 = triangles[f + 1];
                    var v3 = triangles[f + 2];
                    this.mamesh.getOrCreateSegment(v1, v2, segments);
                    this.mamesh.getOrCreateSegment(v2, v3, segments);
                    this.mamesh.getOrCreateSegment(v3, v1, segments);
                }
                return segments;
            };
            return TriangleDichotomer;
        }());
        mameshModification.TriangleDichotomer = TriangleDichotomer;
        /** mauvais interaction avec le triangle dichotomer : but quand on fait la dicho sur des polyhedrons */
        var SquareDichotomer = (function () {
            function SquareDichotomer(mamesh) {
                this.makeLinks = true;
                this.squareToCut = null;
                this.dichoStyle = SquareDichotomer.DichoStyle.fourSquares;
                /**what is the new param? Can be adapted, e.g. for cyclic parametrisation*/
                this.newParamForMiddle = function (p1, p2) {
                    var res = new mathis.XYZ(0, 0, 0);
                    mathis.geo.between(p1, p2, 1 / 2, res);
                    return res;
                };
                this.newParamForCenter = function (p1, p2, p3, p4) {
                    var res = new mathis.XYZ(0, 0, 0);
                    mathis.geo.baryCenter([p1, p2, p3, p4], [1 / 4, 1 / 4, 1 / 4, 1 / 4], res);
                    return res;
                };
                this.mamesh = mamesh;
            }
            SquareDichotomer.prototype.checkArgs = function () {
                // if (this.mamesh.linksOK) {
                //     logger.c('you  break  existing links')
                //     this.mamesh.linksOK = false
                //
                // }
                if (this.mamesh.smallestSquares.length == 0)
                    throw 'no square for square dichotomy';
                this.mamesh.clearLinksAndLines();
            };
            SquareDichotomer.prototype.go = function () {
                this.checkArgs();
                var newSquares;
                if (this.squareToCut == null) {
                    this.squareToCut = this.mamesh.smallestSquares;
                    newSquares = new Array();
                }
                else {
                    /**we keep square that we do not want to cut*/
                    newSquares = new mathis.tab.ArrayMinusBlocksElements(this.mamesh.smallestSquares, 4, this.squareToCut).go();
                }
                var segments = this.createAndAddSegmentsFromSquare(this.squareToCut);
                /**first passage : we add middle points everywhere, and create the segment list */
                for (var f = 0; f < this.squareToCut.length; f += 4) {
                    var v1 = this.squareToCut[f];
                    var v2 = this.squareToCut[f + 1];
                    var v3 = this.squareToCut[f + 2];
                    var v4 = this.squareToCut[f + 3];
                    var segment1 = segments[mathis.Segment.segmentId(v1.hashNumber, v2.hashNumber)];
                    var segment2 = segments[mathis.Segment.segmentId(v2.hashNumber, v3.hashNumber)];
                    var segment3 = segments[mathis.Segment.segmentId(v3.hashNumber, v4.hashNumber)];
                    var segment4 = segments[mathis.Segment.segmentId(v4.hashNumber, v1.hashNumber)];
                    completSegment(this.newParamForMiddle, this.mamesh, segment1);
                    completSegment(this.newParamForMiddle, this.mamesh, segment2);
                    completSegment(this.newParamForMiddle, this.mamesh, segment3);
                    completSegment(this.newParamForMiddle, this.mamesh, segment4);
                    var f1 = segment1.middle;
                    var f2 = segment2.middle;
                    var f3 = segment3.middle;
                    var f4 = segment4.middle;
                    if (this.dichoStyle == SquareDichotomer.DichoStyle.fourSquares) {
                        var position = new mathis.XYZ(0, 0, 0);
                        mathis.geo.baryCenter([segment1.a.position, segment1.b.position, segment3.a.position, segment3.b.position], [1 / 4, 1 / 4, 1 / 4, 1 / 4], position);
                        var dichoLevel = Math.max(segment1.a.dichoLevel, segment1.b.dichoLevel, segment3.a.dichoLevel, segment3.b.dichoLevel) + 1;
                        var center = this.mamesh.newVertex(position, dichoLevel, this.newParamForCenter(segment1.a.param, segment1.b.param, segment3.a.param, segment3.b.param));
                        /** we chose arbitrary to put the new point on the middle of the segment (f1,f3), it could also be (f2,f4). This is important for the fractal construction that each new point is in a middle a a single segment */
                        var aNewCetSegment = new mathis.Segment(f1, f3);
                        aNewCetSegment.middle = center;
                        this.mamesh.cutSegmentsDico[mathis.Segment.segmentId(f1.hashNumber, f3.hashNumber)] = aNewCetSegment;
                        newSquares.push(v1, f1, center, f4);
                        newSquares.push(v2, f2, center, f1);
                        newSquares.push(v3, f3, center, f2);
                        newSquares.push(v4, f4, center, f3);
                    }
                    else if (this.dichoStyle == SquareDichotomer.DichoStyle.fourTriangles) {
                        newSquares.push(f1, f2, f3, f4);
                        this.mamesh.smallestTriangles.push(v1, f1, f4);
                        this.mamesh.smallestTriangles.push(v2, f2, f1);
                        this.mamesh.smallestTriangles.push(v3, f3, f2);
                        this.mamesh.smallestTriangles.push(v4, f4, f3);
                    }
                    else
                        throw 'ho ho';
                }
                //at the end, only the last ilist is kept : this is the list of the thiner triangles.
                this.mamesh.smallestSquares = newSquares;
                //TODO : heavy works because links are not made during dichotomy process
                if (this.makeLinks) {
                    var linker = new mathis.linkModule.LinkCreaterSorterAndBorderDetecterByPolygons(this.mamesh);
                    linker.goChanging();
                }
            };
            //private removeSquareFromList(longList:Vertex[],listToRemove:Vertex[]):Vertex[]{
            //
            //
            //    let  funcToSort=function(a:number, b:number){return a-b}
            //
            //    function key(i,list:Vertex[]):string{
            //        let array=[list[i].hash,list[i+1].hash,list[i+2].hash,list[i+3].hash]
            //        array.sort(funcToSort)
            //        return array[0]+','+array[1]+','+array[2]+','+array[3]
            //    }
            //
            //    let dicoToRemove:{ [id:string]:boolean }={}
            //
            //    for (let i=0;i<listToRemove.length;i+=4){
            //        dicoToRemove[key(i,listToRemove)]=true
            //    }
            //
            //    let newLongList=new Array<Vertex>()
            //    for (let i=0;i<longList.length;i+=4){
            //        if (dicoToRemove[key(i,longList)]!=null){
            //            newLongList.push(longList[i],longList[i+1],longList[i+2],longList[i+3])
            //        }
            //    }
            //
            //    return newLongList
            //
            //}
            SquareDichotomer.prototype.createAndAddSegmentsFromSquare = function (squares) {
                var segments = {};
                for (var f = 0; f < squares.length; f += 4) {
                    var v1 = squares[f];
                    var v2 = squares[f + 1];
                    var v3 = squares[f + 2];
                    var v4 = squares[f + 3];
                    this.mamesh.getOrCreateSegment(v1, v2, segments);
                    this.mamesh.getOrCreateSegment(v2, v3, segments);
                    this.mamesh.getOrCreateSegment(v3, v4, segments);
                    this.mamesh.getOrCreateSegment(v4, v1, segments);
                }
                return segments;
            };
            return SquareDichotomer;
        }());
        mameshModification.SquareDichotomer = SquareDichotomer;
        var SimplestSquareDichotomer = (function () {
            function SimplestSquareDichotomer(mamesh) {
                this.makeLinks = true;
                this.squareToCut = null;
                this.dichoStyle = SquareDichotomer.DichoStyle.fourSquares;
                /**what is the new param? Can be adapted, e.g. for cyclic parametrisation*/
                this.newParamForMiddle = function (p1, p2) {
                    var res = new mathis.XYZ(0, 0, 0);
                    mathis.geo.between(p1, p2, 1 / 2, res);
                    return res;
                };
                this.newParamForCenter = function (p1, p2, p3, p4) {
                    var res = new mathis.XYZ(0, 0, 0);
                    mathis.geo.baryCenter([p1, p2, p3, p4], [1 / 4, 1 / 4, 1 / 4, 1 / 4], res);
                    return res;
                };
                this.mamesh = mamesh;
            }
            SimplestSquareDichotomer.prototype.checkArgs = function () {
                if (this.mamesh.smallestSquares.length == 0)
                    throw 'no square for square dichotomy';
                this.mamesh.clearLinksAndLines();
            };
            SimplestSquareDichotomer.prototype.go = function () {
                this.checkArgs();
                var newSquares;
                if (this.squareToCut == null) {
                    this.squareToCut = this.mamesh.smallestSquares;
                    newSquares = new Array();
                }
                else {
                    /**we keep square that we do not want to cut*/
                    newSquares = new mathis.tab.ArrayMinusBlocksElements(this.mamesh.smallestSquares, 4, this.squareToCut).go();
                }
                var segments = this.createAndAddSegmentsFromSquare(this.squareToCut);
                /**first passage : we add middle points everywhere, and create the segment list */
                for (var f = 0; f < this.squareToCut.length; f += 4) {
                    var v1 = this.squareToCut[f];
                    var v2 = this.squareToCut[f + 1];
                    var v3 = this.squareToCut[f + 2];
                    var v4 = this.squareToCut[f + 3];
                    var segment1 = segments[mathis.Segment.segmentId(v1.hashNumber, v2.hashNumber)];
                    var segment2 = segments[mathis.Segment.segmentId(v2.hashNumber, v3.hashNumber)];
                    var segment3 = segments[mathis.Segment.segmentId(v3.hashNumber, v4.hashNumber)];
                    var segment4 = segments[mathis.Segment.segmentId(v4.hashNumber, v1.hashNumber)];
                    completSegment(this.newParamForMiddle, this.mamesh, segment1);
                    completSegment(this.newParamForMiddle, this.mamesh, segment2);
                    completSegment(this.newParamForMiddle, this.mamesh, segment3);
                    completSegment(this.newParamForMiddle, this.mamesh, segment4);
                    var f1 = segment1.middle;
                    var f2 = segment2.middle;
                    var f3 = segment3.middle;
                    var f4 = segment4.middle;
                    if (this.dichoStyle == SquareDichotomer.DichoStyle.fourSquares) {
                        var position = new mathis.XYZ(0, 0, 0);
                        mathis.geo.baryCenter([segment1.a.position, segment1.b.position, segment3.a.position, segment3.b.position], [1 / 4, 1 / 4, 1 / 4, 1 / 4], position);
                        var dichoLevel = Math.max(segment1.a.dichoLevel, segment1.b.dichoLevel, segment3.a.dichoLevel, segment3.b.dichoLevel) + 1;
                        var center = this.mamesh.newVertex(position, dichoLevel, this.newParamForCenter(segment1.a.param, segment1.b.param, segment3.a.param, segment3.b.param));
                        /** we chose arbitrary to put the new point on the middle of the segment (f1,f3), it could also be (f2,f4). This is important for the fractal construction that each new point is in a middle a a single segment */
                        var aNewCetSegment = new mathis.Segment(f1, f3);
                        aNewCetSegment.middle = center;
                        this.mamesh.cutSegmentsDico[mathis.Segment.segmentId(f1.hashNumber, f3.hashNumber)] = aNewCetSegment;
                        newSquares.push(v1, f1, center, f4);
                        newSquares.push(v2, f2, center, f1);
                        newSquares.push(v3, f3, center, f2);
                        newSquares.push(v4, f4, center, f3);
                    }
                    else if (this.dichoStyle == SquareDichotomer.DichoStyle.fourTriangles) {
                        newSquares.push(f1, f2, f3, f4);
                        this.mamesh.smallestTriangles.push(v1, f1, f4);
                        this.mamesh.smallestTriangles.push(v2, f2, f1);
                        this.mamesh.smallestTriangles.push(v3, f3, f2);
                        this.mamesh.smallestTriangles.push(v4, f4, f3);
                    }
                    else
                        throw 'ho ho';
                }
                //at the end, only the last ilist is kept : this is the list of the thiner triangles.
                this.mamesh.smallestSquares = newSquares;
                //TODO : heavy works because links are not made during dichotomy process
                if (this.makeLinks) {
                    var linker = new mathis.linkModule.LinkCreaterSorterAndBorderDetecterByPolygons(this.mamesh);
                    linker.goChanging();
                }
            };
            //private removeSquareFromList(longList:Vertex[],listToRemove:Vertex[]):Vertex[]{
            //
            //
            //    let  funcToSort=function(a:number, b:number){return a-b}
            //
            //    function key(i,list:Vertex[]):string{
            //        let array=[list[i].hash,list[i+1].hash,list[i+2].hash,list[i+3].hash]
            //        array.sort(funcToSort)
            //        return array[0]+','+array[1]+','+array[2]+','+array[3]
            //    }
            //
            //    let dicoToRemove:{ [id:string]:boolean }={}
            //
            //    for (let i=0;i<listToRemove.length;i+=4){
            //        dicoToRemove[key(i,listToRemove)]=true
            //    }
            //
            //    let newLongList=new Array<Vertex>()
            //    for (let i=0;i<longList.length;i+=4){
            //        if (dicoToRemove[key(i,longList)]!=null){
            //            newLongList.push(longList[i],longList[i+1],longList[i+2],longList[i+3])
            //        }
            //    }
            //
            //    return newLongList
            //
            //}
            SimplestSquareDichotomer.prototype.createAndAddSegmentsFromSquare = function (squares) {
                var segments = {};
                for (var f = 0; f < squares.length; f += 4) {
                    var v1 = squares[f];
                    var v2 = squares[f + 1];
                    var v3 = squares[f + 2];
                    var v4 = squares[f + 3];
                    this.mamesh.getOrCreateSegment(v1, v2, segments);
                    this.mamesh.getOrCreateSegment(v2, v3, segments);
                    this.mamesh.getOrCreateSegment(v3, v4, segments);
                    this.mamesh.getOrCreateSegment(v4, v1, segments);
                }
                return segments;
            };
            return SimplestSquareDichotomer;
        }());
        mameshModification.SimplestSquareDichotomer = SimplestSquareDichotomer;
        var SquareDichotomer;
        (function (SquareDichotomer) {
            (function (DichoStyle) {
                DichoStyle[DichoStyle["fourSquares"] = 0] = "fourSquares";
                DichoStyle[DichoStyle["fourTriangles"] = 1] = "fourTriangles";
            })(SquareDichotomer.DichoStyle || (SquareDichotomer.DichoStyle = {}));
            var DichoStyle = SquareDichotomer.DichoStyle;
        })(SquareDichotomer = mameshModification.SquareDichotomer || (mameshModification.SquareDichotomer = {}));
        var HexahedronSubdivider = (function () {
            function HexahedronSubdivider(mamesh) {
                this.subdivider = 3;
                this.hexahedronsToCut = null;
                this.suppressVolumes = null;
                this.createdPointsPerSegment = {};
                this.createdPointsPerSurface = {};
                this.newHexahedrons = null;
                this.points = null;
                this.mamesh = mamesh;
            }
            HexahedronSubdivider.prototype.checkArgs = function () {
                if ((this.hexahedronsToCut == null && this.mamesh.hexahedrons.length == 0) ||
                    (this.hexahedronsToCut != null && this.hexahedronsToCut.length == 0))
                    mathis.logger.c("HexahedronSubdivider : No input");
            };
            HexahedronSubdivider.prototype.go = function () {
                this.checkArgs();
                if (this.hexahedronsToCut == null)
                    this.hexahedronsToCut = this.mamesh.hexahedrons;
                this.points = new Array(this.subdivider + 1);
                for (var i = 0; i <= this.subdivider; i++) {
                    this.points[i] = new Array(this.subdivider + 1);
                    for (var j = 0; j <= this.subdivider; j++)
                        this.points[i][j] = new Array(this.subdivider + 1);
                }
                // TODO : Supprimer les sommets / faces non utilisés par l'utilisation de this.suppressVolumes
                //   (actuellement si le bord n'a plus besoin d'un sommet, il est gardé dans l'original
                // TODO : + Triangles
                this.subdivideHexahedrons();
            };
            HexahedronSubdivider.prototype.subdivideHexahedronInVertices = function (h) {
                var _this = this;
                var n = this.subdivider;
                var coordsList = [[0, 0, 0], [n, 0, 0], [n, 0, n], [0, 0, n], [0, n, n], [0, n, 0], [n, n, 0], [n, n, n]];
                coordsList.forEach(function (_a, l) {
                    var i = _a[0], j = _a[1], k = _a[2];
                    _this.points[i][j][k] = _this.hexahedronsToCut[h + l];
                });
                var segmentList = [[0, 1], [1, 2], [2, 3], [3, 0],
                    [0, 5], [1, 6], [2, 7], [3, 4],
                    [4, 5], [5, 6], [6, 7], [7, 4]];
                for (var _i = 0, segmentList_1 = segmentList; _i < segmentList_1.length; _i++) {
                    var _a = segmentList_1[_i], na = _a[0], nb = _a[1];
                    var el = mathis.Hash.segment(this.hexahedronsToCut[h + na], this.hexahedronsToCut[h + nb]);
                    if (this.hexahedronsToCut[h + na].hashNumber > this.hexahedronsToCut[h + nb].hashNumber)
                        _b = [nb, na], na = _b[0], nb = _b[1];
                    var _c = coordsList[na], i1 = _c[0], j1 = _c[1], k1 = _c[2];
                    var _d = coordsList[nb], i2 = _d[0], j2 = _d[1], k2 = _d[2];
                    for (var l = 1; l < n; l++)
                        this.points[i1 + (i2 - i1) / n * l][j1 + (j2 - j1) / n * l][k1 + (k2 - k1) / n * l] = this.createdPointsPerSegment[el][l];
                }
                var surfacesList = [[0, 1, 2, 3], [4, 7, 6, 5],
                    [0, 3, 4, 5], [1, 6, 7, 2],
                    [2, 7, 4, 3], [0, 5, 6, 1]];
                for (var _e = 0, surfacesList_1 = surfacesList; _e < surfacesList_1.length; _e++) {
                    var _f = surfacesList_1[_e], na = _f[0], nb = _f[1], nc = _f[2], nd = _f[3];
                    var el = mathis.Hash.quad(this.hexahedronsToCut[h + na], this.hexahedronsToCut[h + nb], this.hexahedronsToCut[h + nc], this.hexahedronsToCut[h + nd]);
                    while (this.hexahedronsToCut[h + na].hashNumber > this.hexahedronsToCut[h + nb].hashNumber ||
                        this.hexahedronsToCut[h + na].hashNumber > this.hexahedronsToCut[h + nc].hashNumber ||
                        this.hexahedronsToCut[h + na].hashNumber > this.hexahedronsToCut[h + nd].hashNumber)
                        _g = [nb, nc, nd, na], na = _g[0], nb = _g[1], nc = _g[2], nd = _g[3];
                    if (this.hexahedronsToCut[h + nb].hashNumber > this.hexahedronsToCut[h + nd].hashNumber)
                        _h = [nd, nb], nb = _h[0], nd = _h[1];
                    var _j = coordsList[na], i1 = _j[0], j1 = _j[1], k1 = _j[2];
                    var _k = coordsList[nb], i2 = _k[0], j2 = _k[1], k2 = _k[2];
                    var _l = coordsList[nc], i3 = _l[0], j3 = _l[1], k3 = _l[2];
                    // let [i4,j4,k4] = coordsList[nd];
                    for (var l = 1; l < n; l++)
                        for (var m = 1; m < n; m++)
                            this.points[i1 + (i2 - i1) / n * l + (i3 - i2) / n * m][j1 + (j2 - j1) / n * l + (j3 - j2) / n * m][k1 + (k2 - k1) / n * l + (k3 - k2) / n * m] = this.createdPointsPerSurface[el][l][m];
                }
                for (var i = 1; i < n; i++) {
                    for (var j = 1; j < n; j++) {
                        for (var k = 1; k < n; k++) {
                            var pos = new mathis.XYZ(0, 0, 0);
                            var x = i / n;
                            var y = j / n;
                            var z = k / n;
                            mathis.geo.baryCenter([this.hexahedronsToCut[h].position, this.hexahedronsToCut[h + 1].position,
                                this.hexahedronsToCut[h + 2].position, this.hexahedronsToCut[h + 3].position,
                                this.hexahedronsToCut[h + 4].position, this.hexahedronsToCut[h + 5].position,
                                this.hexahedronsToCut[h + 6].position, this.hexahedronsToCut[h + 7].position], [(1 - x) * (1 - y) * (1 - z), x * (1 - y) * (1 - z),
                                x * (1 - y) * z, (1 - x) * (1 - y) * z,
                                (1 - x) * y * z, (1 - x) * y * (1 - z),
                                x * y * (1 - z), x * y * z], pos);
                            this.points[i][j][k] = this.mamesh.newVertex(pos);
                        }
                    }
                }
                var _b, _g, _h;
            };
            HexahedronSubdivider.prototype.makeNewHexahedronsFromPoints = function () {
                if (this.suppressVolumes == null)
                    this.suppressVolumes = [];
                var n = this.subdivider;
                var _loop_1 = function(i) {
                    var _loop_2 = function(j) {
                        var _loop_3 = function(k) {
                            if (this_1.suppressVolumes.some(function (value) {
                                return value[0] == i && value[1] == j && value[2] == k;
                            }))
                                return "continue";
                            this_1.newHexahedrons.push.apply(this_1.newHexahedrons, [this_1.points[i][j][k], this_1.points[i + 1][j][k],
                                this_1.points[i + 1][j][k + 1], this_1.points[i][j][k + 1],
                                this_1.points[i][j + 1][k + 1], this_1.points[i][j + 1][k],
                                this_1.points[i + 1][j + 1][k], this_1.points[i + 1][j + 1][k + 1]]);
                        };
                        for (var k = 0; k < n; k++) {
                            _loop_3(k);
                        }
                    };
                    for (var j = 0; j < n; j++) {
                        _loop_2(j);
                    }
                };
                var this_1 = this;
                for (var i = 0; i < n; i++) {
                    _loop_1(i);
                }
            };
            HexahedronSubdivider.prototype.makeSurfacesVertices = function () {
                var list = [[0, 1, 2, 3], [4, 7, 6, 5],
                    [0, 3, 4, 5], [1, 6, 7, 2],
                    [2, 7, 4, 3], [0, 5, 6, 1]];
                for (var h = 0; h < this.hexahedronsToCut.length; h += 8) {
                    for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
                        var _a = list_1[_i], i = _a[0], j = _a[1], k = _a[2], l = _a[3];
                        if (this.createdPointsPerSurface[mathis.Hash.quad(this.hexahedronsToCut[h + i], this.hexahedronsToCut[h + j], this.hexahedronsToCut[h + k], this.hexahedronsToCut[h + l])] == null)
                            this.createdPointsPerSurface[mathis.Hash.quad(this.hexahedronsToCut[h + i], this.hexahedronsToCut[h + j], this.hexahedronsToCut[h + k], this.hexahedronsToCut[h + l])] =
                                this.subdivideSurface(this.hexahedronsToCut[h + i], this.hexahedronsToCut[h + j], this.hexahedronsToCut[h + k], this.hexahedronsToCut[h + l]);
                    }
                }
            };
            HexahedronSubdivider.prototype.makeSegmentsVertices = function () {
                var list = [[0, 1], [1, 2], [2, 3], [3, 0],
                    [0, 5], [1, 6], [2, 7], [3, 4],
                    [4, 5], [5, 6], [6, 7], [7, 4]];
                for (var k = 0; k < this.hexahedronsToCut.length; k += 8) {
                    for (var _i = 0, list_2 = list; _i < list_2.length; _i++) {
                        var _a = list_2[_i], i = _a[0], j = _a[1];
                        if (this.createdPointsPerSegment[mathis.Hash.segment(this.hexahedronsToCut[k + i], this.hexahedronsToCut[k + j])] == null)
                            this.createdPointsPerSegment[mathis.Hash.segment(this.hexahedronsToCut[k + i], this.hexahedronsToCut[k + j])] =
                                this.subdivideSegment(this.hexahedronsToCut[k + i], this.hexahedronsToCut[k + j]);
                    }
                }
            };
            HexahedronSubdivider.prototype.subdivideSegment = function (a, b) {
                _a = mathis.Hash.segmentOrd(a, b), a = _a[0], b = _a[1];
                var vertices = [];
                var n = this.subdivider;
                for (var i = 1; i < n; i++) {
                    var pos = new mathis.XYZ(0, 0, 0);
                    var x = i / n;
                    mathis.geo.baryCenter([a.position, b.position], [1 - x, x], pos);
                    vertices[i] = this.mamesh.newVertex(pos);
                }
                return vertices;
                var _a;
            };
            HexahedronSubdivider.prototype.subdivideSurface = function (a, b, c, d) {
                _a = mathis.Hash.quadOrd(a, b, c, d), a = _a[0], b = _a[1], c = _a[2], d = _a[3];
                var vertices = [];
                var n = this.subdivider;
                for (var i = 1; i < n; i++) {
                    vertices[i] = [];
                    for (var j = 1; j < n; j++) {
                        var pos = new mathis.XYZ(0, 0, 0);
                        var _b = [j / n, i / n], x = _b[0], y = _b[1];
                        mathis.geo.baryCenter([a.position, b.position, c.position, d.position], [(1 - x) * (1 - y), x * (1 - y), x * y, (1 - x) * y], pos);
                        vertices[i][j] = this.mamesh.newVertex(pos);
                    }
                }
                return vertices;
                var _a;
            };
            HexahedronSubdivider.prototype.subdivideHexahedrons = function () {
                this.makeSegmentsVertices();
                this.makeSurfacesVertices();
                var s = this.hexahedronsToCut.length / 8;
                this.newHexahedrons = [];
                for (var i = 0; i < s; i++) {
                    this.subdivideHexahedronInVertices(i * 8);
                    this.makeNewHexahedronsFromPoints();
                }
            };
            return HexahedronSubdivider;
        }());
        mameshModification.HexahedronSubdivider = HexahedronSubdivider;
        var SurfacesFromHexahedrons = (function () {
            function SurfacesFromHexahedrons(mamesh) {
                this.hexahedronsToDraw = null;
                this.newSurfaces = null;
                this.surfacesSet = {};
                this.mamesh = mamesh;
            }
            SurfacesFromHexahedrons.prototype.checkArgs = function () {
                if ((this.hexahedronsToDraw == null && (this.mamesh.hexahedrons == null || this.mamesh.hexahedrons.length == 0))
                    || (this.hexahedronsToDraw != null && this.hexahedronsToDraw.length == 0))
                    mathis.logger.c("SurfacesFromHexahedrons : No input");
            };
            SurfacesFromHexahedrons.prototype.go = function () {
                this.checkArgs();
                if (this.hexahedronsToDraw == null)
                    this.hexahedronsToDraw = this.mamesh.hexahedrons;
                var surfacesList = [[0, 3, 2, 1], [4, 5, 6, 7],
                    [0, 5, 4, 3], [1, 2, 7, 6],
                    [2, 3, 4, 7], [0, 1, 6, 5]];
                this.newSurfaces = [];
                for (var h = 0; h < this.hexahedronsToDraw.length; h += 8) {
                    for (var _i = 0, surfacesList_2 = surfacesList; _i < surfacesList_2.length; _i++) {
                        var _a = surfacesList_2[_i], i = _a[0], j = _a[1], k = _a[2], l = _a[3];
                        var hash = mathis.Hash.quad(this.hexahedronsToDraw[h + i], this.hexahedronsToDraw[h + j], this.hexahedronsToDraw[h + k], this.hexahedronsToDraw[h + l]);
                        if (this.surfacesSet[hash] == null)
                            this.surfacesSet[hash] = [this.hexahedronsToDraw[h + i], this.hexahedronsToDraw[h + j],
                                this.hexahedronsToDraw[h + k], this.hexahedronsToDraw[h + l]];
                        else
                            delete this.surfacesSet[hash];
                    }
                }
                for (var el in this.surfacesSet)
                    this.newSurfaces.push.apply(this.newSurfaces, this.surfacesSet[el]);
                var len = this.newSurfaces.length;
                for (var i = 0; i < len; i += 5000)
                    this.mamesh.smallestSquares.push.apply(this.mamesh.smallestSquares, this.newSurfaces.slice(i, i + 5000));
            };
            return SurfacesFromHexahedrons;
        }());
        mameshModification.SurfacesFromHexahedrons = SurfacesFromHexahedrons;
        var MameshDeepCopier = (function () {
            function MameshDeepCopier(oldMamesh) {
                this.copyCutSegmentsDico = true;
                this.copyLines = true;
                this.oldMamesh = oldMamesh;
            }
            MameshDeepCopier.prototype.go = function () {
                var o2n = new mathis.HashMap();
                var newMamesh = new mathis.Mamesh();
                this.oldMamesh.vertices.forEach(function (oldV) {
                    var param = mathis.XYZ.newFrom(oldV.param);
                    var newVertex = newMamesh.newVertex(oldV.position, oldV.dichoLevel, param);
                    o2n.putValue(oldV, newVertex);
                    newVertex.importantMarker = oldV.importantMarker;
                    oldV.markers.forEach(function (enu) { return newVertex.markers.push(enu); });
                });
                this.oldMamesh.vertices.forEach(function (oldV) {
                    var newV = o2n.getValue(oldV);
                    for (var i = 0; i < oldV.links.length; i++) {
                        newV.links[i] = new mathis.Link(o2n.getValue(oldV.links[i].to));
                    }
                    for (var i = 0; i < oldV.links.length; i++) {
                        var oldLink = oldV.links[i];
                        var newLink = newV.links[i];
                        if (oldLink.opposites != null) {
                            newLink.opposites = [];
                            for (var _i = 0, _a = oldLink.opposites; _i < _a.length; _i++) {
                                var li = _a[_i];
                                var liIndex = oldV.links.indexOf(li);
                                newLink.opposites.push(newV.links[liIndex]);
                            }
                        }
                    }
                });
                this.oldMamesh.smallestTriangles.forEach(function (v) {
                    newMamesh.smallestTriangles.push(o2n.getValue(v));
                });
                this.oldMamesh.smallestSquares.forEach(function (v) {
                    newMamesh.smallestSquares.push(o2n.getValue(v));
                });
                if (this.copyLines) {
                    if (this.oldMamesh.linesWasMade) {
                        var oldStraight = this.oldMamesh.getStraightLinesAsVertices();
                        var oldLoop = this.oldMamesh.getLoopLinesAsVertices();
                        newMamesh.lines = [];
                        oldStraight.forEach(function (line) {
                            var newLine = [];
                            line.forEach(function (v) {
                                newLine.push(o2n.getValue(v));
                            });
                            newMamesh.lines.push(new mathis.Line(newLine, false));
                        });
                        oldLoop.forEach(function (line) {
                            var newLine = [];
                            line.forEach(function (v) {
                                newLine.push(o2n.getValue(v));
                            });
                            newMamesh.lines.push(new mathis.Line(newLine, true));
                        });
                    }
                }
                //newMamesh.linksOK = this.oldMamesh.linksOK
                if (this.copyCutSegmentsDico) {
                    for (var key in this.oldMamesh.cutSegmentsDico) {
                        var oldSegment = this.oldMamesh.cutSegmentsDico[key];
                        var newA = o2n.getValue(oldSegment.a);
                        var newB = o2n.getValue(oldSegment.b);
                        var newSegment = new mathis.Segment(newA, newB);
                        newSegment.middle = o2n.getValue(oldSegment.middle);
                        if (oldSegment.orth1 != null)
                            newSegment.orth1 = o2n.getValue(oldSegment.orth1);
                        if (oldSegment.orth2 != null)
                            newSegment.orth2 = o2n.getValue(oldSegment.orth2);
                        newMamesh.cutSegmentsDico[mathis.Segment.segmentId(newA.hashNumber, newB.hashNumber)] = newSegment;
                    }
                }
                else
                    this.copyCutSegmentsDico = null;
                return newMamesh;
            };
            return MameshDeepCopier;
        }());
        mameshModification.MameshDeepCopier = MameshDeepCopier;
        var PercolationOnLinks = (function () {
            function PercolationOnLinks(mameshOrVertices) {
                var _this = this;
                this.percolationProba = 0.5;
                this.probaToPercolateFunction = function (vertex) {
                    if (vertex.links.length == 3)
                        return 0;
                    if (vertex.links.length == 4)
                        return 0.3 * _this.percolationProba;
                    if (vertex.links.length == 5)
                        return 0.6 * _this.percolationProba;
                    if (vertex.links.length >= 6)
                        return _this.percolationProba;
                };
                this.SUB_random = new mathis.proba.Random();
                this.doNotPercolateOnBorder = true;
                this.maxPercolationForAVertexAlreadyPercolate = 0;
                if (mameshOrVertices instanceof mathis.Mamesh) {
                    this.IN_vertices = mameshOrVertices.vertices;
                }
                else {
                    this.IN_vertices = mameshOrVertices;
                }
            }
            PercolationOnLinks.prototype.goChanging = function () {
                if (this.IN_vertices == null)
                    throw 'vertices must be specifiate';
                var vertexToNbLink = new mathis.HashMap();
                for (var _i = 0, _a = this.IN_vertices; _i < _a.length; _i++) {
                    var v = _a[_i];
                    vertexToNbLink.putValue(v, v.links.length);
                }
                for (var _b = 0, _c = this.IN_vertices; _b < _c.length; _b++) {
                    var v = _c[_b];
                    if (!(this.doNotPercolateOnBorder && v.hasMark(mathis.Vertex.Markers.border))) {
                        if (this.SUB_random.pseudoRand() < this.probaToPercolateFunction(v)) {
                            var randInd = this.SUB_random.pseudoRandInt(v.links.length);
                            var randVoi = v.links[randInd].to;
                            if (randVoi.links.length >= vertexToNbLink.getValue(randVoi) - this.maxPercolationForAVertexAlreadyPercolate)
                                mathis.Vertex.separateTwoVoisins(v, randVoi);
                        }
                    }
                }
            };
            return PercolationOnLinks;
        }());
        mameshModification.PercolationOnLinks = PercolationOnLinks;
        var MameshCleaner = (function () {
            function MameshCleaner(mamesh) {
                this.OUT_nbLinkSuppressed = 0;
                this.OUT_nbVerticesSuppressed = 0;
                this.suppressCellWithNoVoisin = true;
                /**other interesting function : (v:Vertex)=> (!v.isBorder()) which is better that the following or percolated IN_mamesh  */
                this.suppressLinkWithoutOppositeFunction = function (v) { return (v.links.length >= 5); };
                this.IN_mamesh = mamesh;
            }
            MameshCleaner.prototype.goChanging = function () {
                if (this.IN_mamesh == null)
                    throw 'a Mamesh is require as IN_arg';
                if (this.suppressLinkWithoutOppositeFunction != null)
                    this.suppressLinkWithoutOpposite();
            };
            MameshCleaner.prototype.suppressLinkWithoutOpposite = function () {
                var goOn = true;
                while (goOn) {
                    goOn = false;
                    for (var _i = 0, _a = this.IN_mamesh.vertices; _i < _a.length; _i++) {
                        var v = _a[_i];
                        if (this.suppressLinkWithoutOppositeFunction(v)) {
                            for (var i = 0; i < v.links.length; i++) {
                                var li = v.links[i];
                                if (li.opposites == null) {
                                    goOn = true;
                                    mathis.Vertex.separateTwoVoisins(v, li.to);
                                    this.OUT_nbLinkSuppressed++;
                                    break;
                                }
                            }
                        }
                    }
                }
                if (this.suppressCellWithNoVoisin) {
                    var indexToSuppress = [];
                    for (var i = 0; i < this.IN_mamesh.vertices.length; i++) {
                        if (this.IN_mamesh.vertices[i].links.length == 0) {
                            indexToSuppress.push(i);
                            this.OUT_nbVerticesSuppressed++;
                        }
                    }
                    this.IN_mamesh.vertices = mathis.tab.arrayMinusSomeIndices(this.IN_mamesh.vertices, indexToSuppress);
                }
            };
            return MameshCleaner;
        }());
        mameshModification.MameshCleaner = MameshCleaner;
    })(mameshModification = mathis.mameshModification || (mathis.mameshModification = {}));
})(mathis || (mathis = {}));
