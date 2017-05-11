/**
 * Created by vigon on 01/02/2017.
 */
var mathis;
(function (mathis) {
    var grateAndGlue;
    (function (grateAndGlue) {
        var GraphGrater = (function () {
            function GraphGrater() {
                this.IN_graphFamily = [];
                /**if null, seeds are computed*/
                this.seedsList = null;
                /**if true, seed of a graph  is the further cell of barycenters of other graph
                 * if false, seed of a graph is made of all the vertices which is sufficiently far from other seeds*/
                this.seedComputedFromBarycentersVersusFromAllPossibleCells = true;
                //
                // /**if a graph is include in an other, its corresponding seed can be empty. In this case, with the bellow true option selected, we chose as seed a vertex further as possible from barycenter of other graph*/
                // useBarycenterTechniqueOnlyForEmptySeeds=true
                //
                // /** The seeds is the cell the further of the barycenter.  best with false. Other technic: */
                // useBarycenterTechniqueForAllSeeds=false
                /**a very small decay for the case where barycenters are superposed*/
                this.barycenterDecay = new mathis.XYZ(0.0000000234, 0.000000000677, 0.000000000987);
                /** more big, and more IN_mamesh are grated
                 *  for a family made of  graph with square maille, all with the same size, the natural value is sqrt(2)/2
                 *  But : take care of rectangular maille*/
                this.proximityCoefToGrate = [0.7];
                /** bigger is theses coef, and more we chose seed for initiate grating  */
                this.proportionOfSeeds = [0.1];
                /** to introduce asymmetry */
                this.asymmetriesForSeeds = null;
            }
            GraphGrater.prototype.checkArgs = function () {
                if (this.IN_graphFamily == null || this.IN_graphFamily.length < 2)
                    throw 'SUB_grater works from 2 graphs';
            };
            GraphGrater.prototype.suppressTooCloseVertex = function (family) {
                var res = [];
                for (var i = 0; i < family.length; i++) {
                    var neighborhoodCoef = this.proximityCoefToGrate[i % this.proximityCoefToGrate.length];
                    res[i] = [];
                    for (var _i = 0, _a = family[i]; _i < _a.length; _i++) {
                        var verI = _a[_i];
                        var ok = true;
                        for (var j = 0; j < family.length; j++) {
                            if (i != j) {
                                ok = !this.proximityMeasurer.isCloseToMe(verI, family[j], neighborhoodCoef);
                                if (!ok)
                                    break;
                            }
                        }
                        if (ok)
                            res[i].push(verI);
                    }
                }
                return res;
            };
            GraphGrater.prototype.findSeeds = function () {
                var res = [];
                if (!this.seedComputedFromBarycentersVersusFromAllPossibleCells) {
                    // for (let i=0; i<this.IN_graphFamily.length; i++){
                    //     let neighborhoodCoef= this.proximityCoefToGrate[i%this.proximityCoefToGrate.length]
                    //     res[i]=[]
                    //     for (let verI of this.IN_graphFamily[i]){
                    //         let ok=true
                    //         for (let j=0; j<this.IN_graphFamily.length; j++) {
                    //             if (i != j) {
                    //                 ok = !this.isCloseToMe(verI, this.IN_graphFamily[j],neighborhoodCoef)
                    //                 if (!ok) break
                    //             }
                    //         }
                    //         if (ok) res[i].push(verI)
                    //     }
                    // }
                    res = this.suppressTooCloseVertex(this.IN_graphFamily);
                }
                else {
                    for (var i = 0; i < this.IN_graphFamily.length; i++) {
                        res[i] = [];
                    }
                    // let emptySeed:number[] = []
                    // for (let i = 0; i < this.IN_graphFamily.length; i++) if (res[i].length == 0) emptySeed.push(i)
                    //
                    // if (emptySeed.length > 0) {
                    var barycenters = [];
                    for (var i = 0; i < this.IN_graphFamily.length; i++) {
                        barycenters[i] = new mathis.XYZ(0, 0, 0);
                        for (var _i = 0, _a = this.IN_graphFamily[i]; _i < _a.length; _i++) {
                            var v = _a[_i];
                            barycenters[i].add(v.position);
                        }
                        barycenters[i].scale(1 / this.IN_graphFamily[i].length);
                        barycenters[i].add(this.barycenterDecay);
                    }
                    var toSort = function (a, b) { return b.distance - a.distance; };
                    for (var emp = 0; emp < this.IN_graphFamily.length; emp++) {
                        var baryOfOther = new mathis.XYZ(0, 0, 0);
                        for (var k = 0; k < this.IN_graphFamily.length; k++)
                            if (k != emp)
                                baryOfOther.add(barycenters[k]);
                        baryOfOther.scale(1 / (this.IN_graphFamily.length - 1));
                        var vertexAndDist = [];
                        var bary2Pos = new mathis.XYZ(0, 0, 0);
                        for (var _b = 0, _c = this.IN_graphFamily[emp]; _b < _c.length; _b++) {
                            var v = _c[_b];
                            bary2Pos.copyFrom(v.position).substract(baryOfOther);
                            var dd = mathis.geo.distance(v.position, baryOfOther);
                            /**we tried to take into account the barycenter of the current graph (as following), but this was worse
                             * let ddInternal = geo.distance(v.position, barycenters[emp])
                             vertexAndDist.push({vertex:v,distance:dd-ddInternal})
                             */
                            if (this.asymmetriesForSeeds != null && this.asymmetriesForSeeds[emp % this.asymmetriesForSeeds.length] != null) {
                                var asy = this.asymmetriesForSeeds[emp % this.asymmetriesForSeeds.length];
                                var angle = mathis.geo.angleBetweenTwoVectorsBetween0andPi(bary2Pos, asy.direction);
                                var modu = Math.PI;
                                if (asy.modulo != null) {
                                    modu = asy.modulo;
                                    if (isNaN(modu) || modu < 0 || modu > Math.PI)
                                        throw 'modulo must be a number between 0 and PI, but is:' + modu;
                                    angle = mathis.modulo(angle, modu);
                                }
                                var coef = 1 - angle / modu;
                                dd = dd * (1 - asy.influence) + coef * asy.influence;
                            }
                            vertexAndDist.push({ vertex: v, distance: dd });
                        }
                        vertexAndDist.sort(toSort);
                        // let longest = -1
                        // let furtherVertex =null// this.IN_graphFamily[emp][0]
                        // for (let v of this.IN_graphFamily[emp]) {
                        //     let dd = geo.distance(v.position, baryOfOther)
                        //     //cc('dd',dd,baryOfOther,v.position)
                        //     if (dd > longest) {
                        //         longest = dd
                        //         furtherVertex = v
                        //     }
                        // }
                        res[emp] = [];
                        var borne = void 0;
                        if (this.proportionOfSeeds[emp % this.proportionOfSeeds.length] > 0)
                            borne = vertexAndDist[0].distance * (1 - this.proportionOfSeeds[emp % this.proportionOfSeeds.length]);
                        else
                            borne = vertexAndDist[0].distance * 0.99;
                        var dist = Number.MAX_VALUE;
                        var i = 0;
                        while (dist >= borne && i < vertexAndDist.length - 1) {
                            res[emp].push(vertexAndDist[i].vertex);
                            i++;
                            dist = vertexAndDist[i].distance;
                        }
                    }
                }
                /**because seeds ca overlap themselves*/
                res = this.suppressTooCloseVertex(res);
                for (var i = 0; i < this.IN_graphFamily.length; i++)
                    if (res[i].length == 0)
                        throw 'an empty seeds, possible cause: 1/  two graphes are identical 2/ one of your graph is nearly includes into an other and you do not use the barycenter technique';
                return res;
            };
            GraphGrater.prototype.go = function () {
                this.checkArgs();
                if (this.proximityMeasurer == null)
                    this.proximityMeasurer = new ProximityMeasurer();
                if (this.seedsList == null) {
                    this.seedsList = this.findSeeds();
                    this.OUT_allSeeds = this.seedsList;
                }
                var alreadySomeVertex = true;
                var interior = [];
                //let interiorUnion:Vertex[]=[]
                //let admissible:HashMap<Vertex,boolean>[]=[]
                for (var i = 0; i < this.IN_graphFamily.length; i++) {
                    //interior[i]=[]
                    interior[i] = [].concat(this.seedsList[i]);
                }
                var nonAdmissibleForEdge = new mathis.HashMap();
                while (alreadySomeVertex) {
                    alreadySomeVertex = false;
                    for (var i = 0; i < this.IN_graphFamily.length; i++) {
                        var neighborhoodCoef = this.proximityCoefToGrate[i % this.proximityCoefToGrate.length];
                        var edge = mathis.graph.getEdge(interior[i], nonAdmissibleForEdge);
                        for (var _i = 0, edge_1 = edge; _i < edge_1.length; _i++) {
                            var ve = edge_1[_i];
                            var isClose = false;
                            for (var j = 0; j < this.IN_graphFamily.length; j++) {
                                if (i != j && this.proximityMeasurer.isCloseToMe(ve, interior[j], neighborhoodCoef)) {
                                    isClose = true;
                                    break;
                                }
                            }
                            if (!isClose) {
                                interior[i].push(ve);
                                alreadySomeVertex = true;
                            }
                        }
                    }
                }
                // for (let i=0; i<this.IN_graphFamily.length; i++) {
                //     admissible[i]=new HashMap<Vertex,boolean>()
                //     interior[i]=[]
                //
                //     this.IN_graphFamily[i].forEach(v=>admissible[i].putValue(v,true))
                //     this.seedsList[i].forEach(v=>{
                //
                //         interior[i].push(v)
                //         //interiorUnion.push(v)
                //         admissible[i].putValue(v,false)
                //     })
                // }
                //
                //
                //
                // while (alreadySomeVertex){
                //
                //     alreadySomeVertex=false
                //     for (let i=0; i<this.IN_graphFamily.length; i++){
                //         let neighborhoodCoef=this.proximityCoefToGrate[i%this.proximityCoefToGrate.length]
                //
                //         let edge=graph.getEdge(interior[i],admissible[i])
                //
                //
                //         for (let ve of edge){
                //             admissible[i].putValue(ve,false)
                //
                //             let isClose=false//this.isCloseToMe(ve,interiorUnion,neighborhoodCoef)
                //             for (let j=0; j<this.IN_graphFamily.length; j++){
                //                 if(i!=j&& this.proximityMeasurer.isCloseToMe(ve,interior[j],neighborhoodCoef)) {
                //                     isClose=true
                //                     break
                //                 }
                //             }
                //
                //             if (!isClose) {
                //                 interior[i].push(ve)
                //                 //interiorUnion.push(ve)
                //                 alreadySomeVertex=true
                //             }
                //         }
                //     }
                // }
                return interior;
            };
            return GraphGrater;
        }());
        grateAndGlue.GraphGrater = GraphGrater;
        var ProximityMeasurer = (function () {
            function ProximityMeasurer() {
                this.vertexToLinkLength = new mathis.HashMap();
            }
            ProximityMeasurer.prototype.meanLinksDist = function (vertex) {
                var res = this.vertexToLinkLength.getValue(vertex);
                if (res != null)
                    return res;
                var dist = 0;
                for (var _i = 0, _a = vertex.links; _i < _a.length; _i++) {
                    var link = _a[_i];
                    dist += mathis.geo.distance(vertex.position, link.to.position);
                }
                dist /= vertex.links.length;
                this.vertexToLinkLength.putValue(vertex, dist);
                return dist;
            };
            ProximityMeasurer.prototype.isCloseToMe = function (vertex, family, coef) {
                for (var _i = 0, family_1 = family; _i < family_1.length; _i++) {
                    var v = family_1[_i];
                    if (this.areClose(vertex, v, coef))
                        return true;
                }
                return false;
            };
            ProximityMeasurer.prototype.areClose = function (vertex0, vertex1, coef) {
                return (mathis.geo.distance(vertex0.position, vertex1.position) < (this.meanLinksDist(vertex0) + this.meanLinksDist(vertex1)) / 2 * coef);
            };
            ProximityMeasurer.prototype.areFar = function (vertex0, vertex1, coef) {
                return (mathis.geo.distance(vertex0.position, vertex1.position) > (this.meanLinksDist(vertex0) + this.meanLinksDist(vertex1)) / 2 * coef);
            };
            return ProximityMeasurer;
        }());
        grateAndGlue.ProximityMeasurer = ProximityMeasurer;
        var SubMameshExtractor = (function () {
            function SubMameshExtractor(mamesh, verticesToKeep) {
                this.verticesToKeepMustBeInMamesh = true;
                this.constructCutSegment = true;
                this.takeCareOfPolygons = true;
                this.addBorderPolygonInsteadOfSuppress = false;
                /**OUT*/
                this.OUT_BorderPolygon = [];
                this.OUT_BorderVerticesInside = [];
                this.OUTBorderVerticesOutside = [];
                this.mamesh = mamesh;
                this.verticesToKeep = verticesToKeep;
            }
            SubMameshExtractor.prototype.go = function () {
                var _this = this;
                var res = new mathis.Mamesh();
                this.verticesToKeep.forEach(function (vertex) {
                    if (_this.mamesh.hasVertex(vertex)) {
                        res.addVertex(vertex);
                    }
                    else if (_this.verticesToKeepMustBeInMamesh)
                        throw 'a vertex in the list to keep is not in the original mesh. If you want to allow this, please turn the boolean "verticesToKeepMustBeInMamesh" to false';
                });
                //res.linksOK = true
                //let verticesToAdd:Vertex[]=[]
                for (var i = 0; i < this.mamesh.smallestSquares.length; i += 4) {
                    var sumOfPresentVertex = 0;
                    if (res.hasVertex(this.mamesh.smallestSquares[i]))
                        sumOfPresentVertex++;
                    if (res.hasVertex(this.mamesh.smallestSquares[i + 1]))
                        sumOfPresentVertex++;
                    if (res.hasVertex(this.mamesh.smallestSquares[i + 2]))
                        sumOfPresentVertex++;
                    if (res.hasVertex(this.mamesh.smallestSquares[i + 3]))
                        sumOfPresentVertex++;
                    if (sumOfPresentVertex > 0 && sumOfPresentVertex < 4)
                        this.OUT_BorderPolygon.push([this.mamesh.smallestSquares[i], this.mamesh.smallestSquares[i + 1], this.mamesh.smallestSquares[i + 2], this.mamesh.smallestSquares[i + 3]]);
                    else if (sumOfPresentVertex == 4)
                        res.smallestSquares.push(this.mamesh.smallestSquares[i], this.mamesh.smallestSquares[i + 1], this.mamesh.smallestSquares[i + 2], this.mamesh.smallestSquares[i + 3]);
                }
                for (var i = 0; i < this.mamesh.smallestTriangles.length; i += 3) {
                    var sumOfPresentVertex = 0;
                    if (res.hasVertex(this.mamesh.smallestTriangles[i]))
                        sumOfPresentVertex++;
                    if (res.hasVertex(this.mamesh.smallestTriangles[i + 1]))
                        sumOfPresentVertex++;
                    if (res.hasVertex(this.mamesh.smallestTriangles[i + 2]))
                        sumOfPresentVertex++;
                    if (sumOfPresentVertex > 0 && sumOfPresentVertex < 3)
                        this.OUT_BorderPolygon.push([this.mamesh.smallestTriangles[i], this.mamesh.smallestTriangles[i + 1], this.mamesh.smallestTriangles[i + 2]]);
                    else if (sumOfPresentVertex == 3)
                        res.smallestTriangles.push(this.mamesh.smallestTriangles[i], this.mamesh.smallestTriangles[i + 1], this.mamesh.smallestTriangles[i + 2]);
                }
                for (var _i = 0, _a = this.OUT_BorderPolygon; _i < _a.length; _i++) {
                    var poly = _a[_i];
                    for (var _b = 0, poly_1 = poly; _b < poly_1.length; _b++) {
                        var v = poly_1[_b];
                        if (res.hasVertex(v)) {
                            if (this.OUT_BorderVerticesInside.indexOf(v) == -1)
                                this.OUT_BorderVerticesInside.push(v);
                        }
                        else {
                            if (this.OUTBorderVerticesOutside.indexOf(v) == -1)
                                this.OUTBorderVerticesOutside.push(v);
                        }
                    }
                }
                if (this.takeCareOfPolygons) {
                    if (this.addBorderPolygonInsteadOfSuppress) {
                        for (var _c = 0, _d = this.OUT_BorderPolygon; _c < _d.length; _c++) {
                            var poly = _d[_c];
                            if (poly.length == 3)
                                res.smallestTriangles.push(poly[0], poly[1], poly[2]);
                            else if (poly.length == 4)
                                res.smallestSquares.push(poly[0], poly[1], poly[2], poly[3]);
                        }
                        for (var _e = 0, _f = this.OUTBorderVerticesOutside; _e < _f.length; _e++) {
                            var vert = _f[_e];
                            res.addVertex(vert);
                        }
                    }
                    else {
                        var suppressedIndexOfBorderInside = [];
                        var suppressedIndexOfRes = [];
                        for (var i = 0; i < this.OUT_BorderVerticesInside.length; i++) {
                            var vert = this.OUT_BorderVerticesInside[i];
                            var isInAPoly = false;
                            for (var _g = 0, _h = res.smallestSquares; _g < _h.length; _g++) {
                                var v = _h[_g];
                                if (v.hashNumber == vert.hashNumber) {
                                    isInAPoly = true;
                                    break;
                                }
                            }
                            if (!isInAPoly) {
                                for (var _j = 0, _k = res.smallestTriangles; _j < _k.length; _j++) {
                                    var v = _k[_j];
                                    if (v.hashNumber == vert.hashNumber) {
                                        isInAPoly = true;
                                        break;
                                    }
                                }
                            }
                            if (!isInAPoly) {
                                //removeFromArray(res.vertices,vert)
                                suppressedIndexOfRes.push(res.vertices.indexOf(vert));
                                suppressedIndexOfBorderInside.push(i);
                            }
                        }
                        this.OUT_BorderVerticesInside = mathis.tab.arrayMinusSomeIndices(this.OUT_BorderVerticesInside, suppressedIndexOfBorderInside);
                        res.vertices = mathis.tab.arrayMinusSomeIndices(res.vertices, suppressedIndexOfRes);
                    }
                }
                if (this.constructCutSegment) {
                    for (var key in this.mamesh.cutSegmentsDico) {
                        var segment = this.mamesh.cutSegmentsDico[key];
                        if (!res.hasVertex(segment.a))
                            continue;
                        if (!res.hasVertex(segment.b))
                            continue;
                        if (!res.hasVertex(segment.middle))
                            continue;
                        res.cutSegmentsDico[key] = segment;
                    }
                }
                return res;
            };
            return SubMameshExtractor;
        }());
        grateAndGlue.SubMameshExtractor = SubMameshExtractor;
        var ExtractCentralPart = (function () {
            function ExtractCentralPart(mamesh, nb) {
                this.markBorder = true;
                this.suppressFromBorderVersusCorner = true;
                this.mamesh = mamesh;
                this.nb = nb;
            }
            ExtractCentralPart.prototype.go = function () {
                var border = [];
                if (this.suppressFromBorderVersusCorner) {
                    for (var _i = 0, _a = this.mamesh.vertices; _i < _a.length; _i++) {
                        var ver = _a[_i];
                        if (ver.hasMark(mathis.Vertex.Markers.border))
                            border.push(ver);
                    }
                }
                else {
                    for (var _b = 0, _c = this.mamesh.vertices; _b < _c.length; _b++) {
                        var ver = _c[_b];
                        if (ver.hasMark(mathis.Vertex.Markers.corner))
                            border.push(ver);
                    }
                }
                var rings = mathis.graph.ringify(border);
                var toSuppress = new mathis.HashMap();
                if (this.nb < 0)
                    this.nb = rings.length + this.nb - 1;
                if (this.nb >= rings.length - 1)
                    throw 'you want to suppress too much strates';
                for (var i = 0; i < this.nb; i++) {
                    for (var _d = 0, _e = rings[i]; _d < _e.length; _d++) {
                        var v = _e[_d];
                        toSuppress.putValue(v, true);
                    }
                }
                var toKeep = [];
                for (var _f = 0, _g = this.mamesh.vertices; _f < _g.length; _f++) {
                    var v = _g[_f];
                    if (toSuppress.getValue(v) == null) {
                        toKeep.push(v);
                    }
                }
                if (this.markBorder)
                    for (var _h = 0, _j = rings[this.nb]; _h < _j.length; _h++) {
                        var v = _j[_h];
                        v.markers.push(mathis.Vertex.Markers.border);
                    }
                var suber = new grateAndGlue.SubMameshExtractor(this.mamesh, toKeep);
                var res = suber.go();
                return res;
            };
            return ExtractCentralPart;
        }());
        grateAndGlue.ExtractCentralPart = ExtractCentralPart;
        var FindStickingMapFromSquare = (function () {
            function FindStickingMapFromSquare(receiver, source) {
                this.receiver = receiver;
                this.source = source;
            }
            FindStickingMapFromSquare.prototype.checkArgs = function () {
                if (this.receiver.length % 4 != 0)
                    throw 'receiver is not a list representing squares';
                if (this.source.length % 4 != 0)
                    throw 'source is not a list representing squares';
            };
            FindStickingMapFromSquare.prototype.go = function () {
                this.checkArgs();
                var res = new mathis.HashMap(true);
                var sourceBaryCenter = this.squareToBaryCenter(this.source);
                var receiverBaryCenter = this.squareToBaryCenter(this.receiver);
                for (var i = 0; i < sourceBaryCenter.length; i++) {
                    var minDist = Number.MAX_VALUE;
                    var bestReceiverIndex = -1;
                    for (var j = 0; j < receiverBaryCenter.length; j++) {
                        var dist = mathis.geo.distance(sourceBaryCenter[i], receiverBaryCenter[j]);
                        if (dist < minDist) {
                            minDist = dist;
                            bestReceiverIndex = j;
                        }
                    }
                    var receiverPaquet = [this.receiver[4 * bestReceiverIndex], this.receiver[4 * bestReceiverIndex + 1], this.receiver[4 * bestReceiverIndex + 2], this.receiver[4 * bestReceiverIndex + 3]];
                    var sourcePaquet = [this.source[4 * i], this.source[4 * i + 1], this.source[4 * i + 2], this.source[4 * i + 3]];
                    var permutedReceiverPaquet = this.getBestPermutationOfReceiver(receiverPaquet, sourcePaquet);
                    for (var k = 0; k < 4; k++) {
                        res.putValue(sourcePaquet[k], permutedReceiverPaquet[k]);
                    }
                }
                return res;
            };
            FindStickingMapFromSquare.prototype.getBestPermutationOfReceiver = function (receiverPaquet, sourcePaquet) {
                var minDist = Number.MAX_VALUE;
                var bestDecal = -1;
                for (var k_1 = 0; k_1 < 4; k_1++) {
                    var decalReceiver = [receiverPaquet[k_1], receiverPaquet[(k_1 + 1) % 4], receiverPaquet[(k_1 + 2) % 4], receiverPaquet[(k_1 + 3) % 4]];
                    var dist = 0;
                    for (var l = 0; l < 4; l++)
                        dist += mathis.geo.distance(sourcePaquet[l].position, decalReceiver[l].position);
                    if (dist < minDist) {
                        minDist = dist;
                        bestDecal = k_1;
                    }
                }
                var k = bestDecal;
                return [receiverPaquet[k], receiverPaquet[(k + 1) % 4], receiverPaquet[(k + 2) % 4], receiverPaquet[(k + 3) % 4]];
            };
            FindStickingMapFromSquare.prototype.squareToBaryCenter = function (vertices) {
                var res = [];
                for (var i = 0; i < vertices.length; i += 4) {
                    var paquet = [vertices[i].position, vertices[i + 1].position, vertices[i + 2].position, vertices[i + 3].position];
                    var bary = new mathis.XYZ(0, 0, 0);
                    mathis.geo.baryCenter(paquet, [1 / 4, 1 / 4, 1 / 4, 1 / 4], bary);
                    res.push(bary);
                }
                return res;
            };
            return FindStickingMapFromSquare;
        }());
        //
        // export class FindSickingMapFromVerticesOld{
        //
        //     receiver:Vertex[]
        //     source:Vertex[]
        //
        //     /**if zero, sticking is made only for closest voisin*/
        //     toleranceToBeOneOfTheClosest=0.3
        //
        //     constructor(receiver:Vertex[],source:Vertex[]){
        //
        //         this.receiver=receiver
        //         this.source=source
        //
        //     }
        //
        //     private checkArgs():void{
        //         //if (this.receiver.length%4!=0) throw 'receiver is not a list representing squares'
        //         //if (this.source.length%4!=0) throw 'source is not a list representing squares'
        //
        //     }
        //
        //     go ():Vertex[][]{
        //
        //         this.checkArgs()
        //
        //         let res:Vertex[][]=[]//=new HashMap<Vertex,Vertex>(true)
        //
        //         for (let i=0;i<this.source.length;i++){
        //             let minDist=Number.MAX_VALUE
        //             //let bestReceiverIndex=-1
        //             let distances:number[]=[]
        //             for (let j=0;j<this.receiver.length;j++){
        //                 distances[j]=geo.distance(this.source[i].position,this.receiver[j].position)
        //
        //                 if (distances[j]<minDist){
        //                     minDist=distances[j]
        //                     //bestReceiverIndex=j
        //                 }
        //             }
        //             let bestRecivers:number[]=[]
        //             for (let j=0;j<this.receiver.length;j++){
        //                 if (distances[j]<=minDist*(1+this.toleranceToBeOneOfTheClosest)){
        //                     bestRecivers.push(j)
        //                 }
        //             }
        //             for (let j of bestRecivers) res.push([this.source[i],this.receiver[j]])
        //
        //         }
        //         return res
        //     }
        //
        // }
        //
        var FindSickingMapFromVertices = (function () {
            function FindSickingMapFromVertices(receiver, source) {
                /**if zero, sticking is made only for closest voisin*/
                this.toleranceToBeOneOfTheClosest = 0.5;
                this.proximityCoef = 0.7;
                this.acceptOnlyDisjointReceiverAndSource = true;
                this.receiver = receiver;
                this.source = source;
            }
            FindSickingMapFromVertices.prototype.checkArgs = function () {
                if (this.acceptOnlyDisjointReceiverAndSource) {
                    var dico = new mathis.HashMap();
                    for (var _i = 0, _a = this.source; _i < _a.length; _i++) {
                        var v = _a[_i];
                        dico.putValue(v, true);
                    }
                    for (var _b = 0, _c = this.receiver; _b < _c.length; _b++) {
                        var v = _c[_b];
                        if (dico.getValue(v) != null)
                            throw 'source and receiver must be disjoint';
                    }
                }
            };
            FindSickingMapFromVertices.prototype.go = function () {
                this.checkArgs();
                if (this.proximityMeasurer == null)
                    this.proximityMeasurer = new ProximityMeasurer();
                this.checkArgs();
                var res = new mathis.HashMap(true);
                for (var _i = 0, _a = this.source; _i < _a.length; _i++) {
                    var vSource = _a[_i];
                    var minDist = Number.POSITIVE_INFINITY;
                    //let bestReceiverIndex=-1
                    var receiverToDist = new mathis.HashMap(true);
                    var veryBestReceiver = null;
                    for (var _b = 0, _c = this.receiver; _b < _c.length; _b++) {
                        var vReceiver = _c[_b];
                        /**we do not want a vertex which is in a same time receiver and source*/
                        var dist = mathis.geo.distance(vSource.position, vReceiver.position);
                        if (this.proximityMeasurer.areClose(vSource, vReceiver, this.proximityCoef)) {
                            receiverToDist.putValue(vReceiver, dist);
                            if (dist < minDist) {
                                minDist = dist;
                                veryBestReceiver = vReceiver;
                            }
                        }
                    }
                    /**veryBestReceiver==null means that source and all receivers are too far*/
                    if (veryBestReceiver != null) {
                        var bestReceivers = [];
                        /**we put in first the very best*/
                        bestReceivers.push(veryBestReceiver);
                        for (var _d = 0, _e = receiverToDist.allKeys(); _d < _e.length; _d++) {
                            var vReceiver = _e[_d];
                            if (vReceiver != veryBestReceiver && receiverToDist.getValue(vReceiver) <= minDist * (1 + this.toleranceToBeOneOfTheClosest)) {
                                bestReceivers.push(vReceiver);
                            }
                        }
                        res.putValue(vSource, bestReceivers);
                    }
                }
                return res;
            };
            return FindSickingMapFromVertices;
        }());
        grateAndGlue.FindSickingMapFromVertices = FindSickingMapFromVertices;
        //
        // export class FindMergingMapFast{
        //
        //
        //     source:Vertex[]
        //     receiver:Vertex[]
        //     nbDistinctPoint:number
        //    
        //     constructor( receiver:Vertex[],source:Vertex[],nbDistinctPoint:number){
        //         this.source=source
        //         this.receiver=receiver
        //         this.nbDistinctPoint=nbDistinctPoint
        //     }
        //    
        //     go():HashMap<Vertex,Vertex> {
        //
        //         // let indexToMerge:{[key:number]:number}
        //         //
        //         // this.merginMap = new HashMap<Vertex,Vertex>(true)
        //         //
        //         // let positionsRecepter:XYZ[] = []
        //         // this.receiverMamesh.vertices.forEach(v=> {
        //         //     positionsRecepter.push(v.position)
        //         // })
        //         //
        //         // if (this.sourceEqualRecepter) indexToMerge = new geometry.CloseXYZfinder(positionsRecepter,null,1000).go()
        //         // else {
        //         //     let positionsSource:XYZ[] = []
        //         //     this.sourceMamesh.vertices.forEach(v=> {
        //         //         positionsSource.push(v.position)
        //         //     })
        //         //     indexToMerge = new geometry.CloseXYZfinder(positionsRecepter, positionsSource,1000).go()
        //         // }
        //         //
        //         //
        //         // for (let index in indexToMerge) {
        //         //     this.merginMap.putValue(this.sourceMamesh.vertices[index], this.receiverMamesh.vertices[indexToMerge[index]])
        //         // }
        //        
        //        
        //         let indexToMerge:{[key:number]:number}
        //
        //         let merginMap = new HashMap<Vertex,Vertex>(true)
        //
        //         let positionsRecepter:XYZ[] = []
        //         this.receiver.forEach(v=> {
        //             positionsRecepter.push(v.position)
        //         })
        //
        //         if (this.source==null) indexToMerge = new geometry.CloseXYZfinder(positionsRecepter,null,this.nbDistinctPoint).go()
        //         else {
        //             let positionsSource:XYZ[] = []
        //             this.source.forEach(v=> {
        //                 positionsSource.push(v.position)
        //             })
        //             indexToMerge = new geometry.CloseXYZfinder(positionsRecepter, positionsSource,this.nbDistinctPoint).go()
        //         }
        //
        //
        //         for (let index in indexToMerge) {
        //             merginMap.putValue(this.source[index], this.receiver[indexToMerge[index]])
        //         }
        //
        //
        //         return merginMap
        //
        //     }
        //    
        // }
        var ConcurrentMameshesGraterAndSticker = (function () {
            function ConcurrentMameshesGraterAndSticker() {
                this.IN_mameshes = [];
                this.SUB_grater = new GraphGrater();
                this.justGrateDoNotStick = false;
                /**use for sticking. More big, and more links are added*/
                this.proximityCoefToStick = [2];
                /**if zero -> sticking is made only for closest voisin
                 * if 0.5 -> vertices up to 50% of the closest are stick*/
                this.toleranceToBeOneOfTheClosest = 0.5;
                /**some intermediate result, which can be use if the user want to "just grate and not stick" and then to stick with some custom mergingMap */
                this.OUTBorderVerticesToStick = [];
                /**be careful, if you stickAll (default), the zero-indexed IN_mamesh-vertices will be modified, and so the zero indexed grated mameh*/
                this.OUTGratedMameshes = [];
                this.takeCareOfPolygons = true;
                this.suppressLinksAngularlyTooClose = true;
                this.SUB_linkCleanerByAngle = new mathis.linkModule.LinksSorterAndCleanerByAngles(null, null);
                this.OUT_stickingMap = new mathis.HashMap(true);
                this.SUB_linkCleanerByAngle.suppressLinksAngularParam = 2 * Math.PI * 0.1;
            }
            ConcurrentMameshesGraterAndSticker.prototype.checkArgs = function () {
                //if (this.neighborhoodSizeCoefByFamily!=null && this.neighborhoodSizeCoefByFamily.length!=this.IN_mameshes.length) throw 'neighborhoodSizeCoefByFamily must have the same length as mameshFamily'
                //if (this.stickingSizeCoefByFamily!=null && this.stickingSizeCoefByFamily.length!=this.IN_mameshes.length) throw 'stickingSizeCoefByFamily must have the same length as mameshFamily'
            };
            ConcurrentMameshesGraterAndSticker.prototype.goChanging = function () {
                this.checkArgs();
                /**first we clean all opposite link of all IN_mamesh. They will be rebuild*/
                for (var _i = 0, _a = this.IN_mameshes; _i < _a.length; _i++) {
                    var mam = _a[_i];
                    for (var _b = 0, _c = mam.vertices; _b < _c.length; _b++) {
                        var ve = _c[_b];
                        for (var _d = 0, _e = ve.links; _d < _e.length; _d++) {
                            var li = _e[_d];
                            li.opposites = null;
                        }
                    }
                }
                var graphs = [];
                this.IN_mameshes.forEach(function (m) { return graphs.push(m.vertices); });
                this.SUB_grater.IN_graphFamily = graphs;
                var gratedGraph = this.SUB_grater.go();
                for (var i = 0; i < this.IN_mameshes.length; i++) {
                    var extractor = new grateAndGlue.SubMameshExtractor(this.IN_mameshes[i], gratedGraph[i]);
                    extractor.takeCareOfPolygons = this.takeCareOfPolygons;
                    extractor.addBorderPolygonInsteadOfSuppress = false;
                    this.OUTGratedMameshes[i] = extractor.go();
                    /**to stick perhaps: vertices where we have cut, but only one which have a link leading to outside*/
                    this.OUTBorderVerticesToStick[i] = [];
                    for (var _f = 0, _g = extractor.OUT_BorderVerticesInside; _f < _g.length; _f++) {
                        var vertex = _g[_f];
                        for (var _h = 0, _j = vertex.links; _h < _j.length; _h++) {
                            var link = _j[_h];
                            if (this.IN_mameshes[i].hasVertex(link.to) && !this.OUTGratedMameshes[i].hasVertex(link.to)) {
                                this.OUTBorderVerticesToStick[i].push(vertex);
                                break;
                            }
                        }
                    }
                    this.OUTGratedMameshes[i].isolateMameshVerticesFromExteriorVertices();
                    for (var _k = 0, _l = this.OUTGratedMameshes[i].vertices; _k < _l.length; _k++) {
                        var v = _l[_k];
                        if (v.hasMark(mathis.Vertex.Markers.border) && this.OUTBorderVerticesToStick[i].indexOf(v) == -1)
                            this.OUTBorderVerticesToStick[i].push(v);
                    }
                }
                var res = this.OUTGratedMameshes[0];
                for (var indexMamesh = 1; indexMamesh < this.IN_mameshes.length; indexMamesh++) {
                    var mapFinder = new FindSickingMapFromVertices(res.vertices, this.OUTBorderVerticesToStick[indexMamesh]);
                    mapFinder.toleranceToBeOneOfTheClosest = this.toleranceToBeOneOfTheClosest;
                    mapFinder.proximityCoef = this.proximityCoefToStick[indexMamesh % this.proximityCoefToStick.length];
                    var map = mapFinder.go();
                    this.OUT_stickingMap.extend(map);
                    // let indexToRemove:number[]=[]
                    // for (let i=0;i<map.length;i++){
                    //     if (!this.proximityMeasurer.areClose(map[i][0],map[i][1],stickingCoef)) {
                    //         indexToRemove.push(i)
                    //     }
                    // }
                    // map=tab.arrayMinusSomeIndices(map,indexToRemove)
                    var sticker = new Sticker(res, this.OUTGratedMameshes[indexMamesh], map);
                    sticker.zIndex1 = indexMamesh;
                    /**already done in this method*/
                    sticker.cleanOppositeLinksAtBegin = false;
                    sticker.createNewLinks = !this.justGrateDoNotStick;
                    sticker.goChanging();
                }
                res.isolateMameshVerticesFromExteriorVertices();
                for (var _m = 0, _o = res.vertices; _m < _o.length; _m++) {
                    var ve = _o[_m];
                    if (ve.links.length == 0)
                        throw ' grating process produce a vertex with no links';
                }
                if (this.suppressLinksAngularlyTooClose) {
                    this.SUB_linkCleanerByAngle.mamesh = res;
                    //this.SUB_linkCleanerByAngle.vertexToPositioning=new mameshAroundComputations.PositioningComputerForMameshVertices(res).go()
                    this.SUB_linkCleanerByAngle.goChanging();
                }
                return res;
            };
            return ConcurrentMameshesGraterAndSticker;
        }());
        grateAndGlue.ConcurrentMameshesGraterAndSticker = ConcurrentMameshesGraterAndSticker;
        var FindCloseVerticesFast = (function () {
            function FindCloseVerticesFast(receivers, sources) {
                this.nbDistinctPoint = 1000;
                this.maxDistToBeClose = null;
                this.throwExceptionIfReceiverHaveCloseVertices = false;
                this.receiverAndSourceMustBeDisjoint = false;
                /**default: no deformation*/
                this.deformationFunction = function (point) { return point; };
                this.mins = new mathis.XYZ(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
                this.maxs = new mathis.XYZ(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
                this.receivers = receivers;
                this.sources = sources;
            }
            FindCloseVerticesFast.prototype.go = function () {
                this.buildScaler();
                var amplitude = new mathis.XYZ(Math.max(1, this.maxs.x - this.mins.x), Math.max(1, this.maxs.y - this.mins.y), Math.max(1, this.maxs.z - this.mins.z));
                var roundPositionToReceiver = new mathis.StringMap(); //: {[id:string]:number}={}
                for (var _i = 0, _a = this.receivers; _i < _a.length; _i++) {
                    var receiver = _a[_i];
                    var val = this.deformationFunction(receiver.position);
                    var resx = Math.round((val.x - this.mins.x) / amplitude.x * this.nbDistinctPoint);
                    var resy = Math.round((val.y - this.mins.y) / amplitude.y * this.nbDistinctPoint);
                    var resz = Math.round((val.z - this.mins.z) / amplitude.z * this.nbDistinctPoint);
                    var key = resx + ',' + resy + ',' + resz;
                    if (roundPositionToReceiver.getValue(key) == null)
                        roundPositionToReceiver.putValue(key, receiver);
                    else if (this.throwExceptionIfReceiverHaveCloseVertices)
                        throw 'the receiver list has several XYZ very close, and you have forbidden that';
                }
                var res = new mathis.HashMap(true); //:{[id:number]:number}={}
                for (var _b = 0, _c = this.sources; _b < _c.length; _b++) {
                    var source = _c[_b];
                    var val = this.deformationFunction(source.position);
                    var resx = Math.round((val.x - this.mins.x) / amplitude.x * this.nbDistinctPoint);
                    var resy = Math.round((val.y - this.mins.y) / amplitude.y * this.nbDistinctPoint);
                    var resz = Math.round((val.z - this.mins.z) / amplitude.z * this.nbDistinctPoint);
                    var receiverFounded = roundPositionToReceiver.getValue(resx + ',' + resy + ',' + resz);
                    if (receiverFounded != null) {
                        /** receiver and source can be the same list (ex : if we want to make a cylinder by bending a plan );
                         *  in this case, we do not want to associate each receiver to itself */
                        if (receiverFounded != source) {
                            var perhapsAList = res.getValue(receiverFounded);
                            if (perhapsAList == null)
                                res.putValue(source, [receiverFounded]);
                            else {
                                /**some source already found near this receiver: we must put the closes source in the first position*/
                                if (mathis.geo.distance(receiverFounded.position, source.position) < mathis.geo.distance(receiverFounded.position, perhapsAList[0].position)) {
                                    res.putValue(source, [receiverFounded].concat(perhapsAList));
                                }
                                else
                                    perhapsAList.push(receiverFounded);
                            }
                        }
                        else if (this.receiverAndSourceMustBeDisjoint)
                            throw "receiver-list and source-list are not disjoint, and you have forbidden that";
                    }
                }
                // for (let i=0; i<this.sourceList.length; i++){
                //     let val=this.deformationFunction(this.sourceList[i].position)
                //     let resx=Math.round( (val.x-this.mins.x)/ amplitude.x*this.nbDistinctPoint)
                //     let resy=Math.round( (val.y-this.mins.y)/amplitude.y*this.nbDistinctPoint)
                //     let resz=Math.round( (val.z-this.mins.z)/amplitude.z*this.nbDistinctPoint)
                //
                //     let receiverFounded:Vertex=recepteurBalises[resx+','+resy+','+resz]
                //     if (receiverFounded!=null){
                //         if ()
                //        
                //     }
                //     if (this.receiverAndSourceMustBeDisjoint)
                //    
                //     if (baliseIndex!=null   ){
                //         if (this.sourceEqualRecepter){
                //             /**to avoid i-> i when sourceEqualRecepter*/
                //             if (baliseIndex!= i) res[i]=baliseIndex
                //         }
                //         else res[i]=baliseIndex
                //     }
                //
                // }
                return res;
            };
            FindCloseVerticesFast.prototype.buildScaler = function () {
                var _this = this;
                this.receivers.forEach(function (vv) {
                    var v = _this.deformationFunction(vv.position);
                    if (v.x < _this.mins.x)
                        _this.mins.x = v.x;
                    if (v.y < _this.mins.y)
                        _this.mins.y = v.y;
                    if (v.z < _this.mins.z)
                        _this.mins.z = v.z;
                    if (v.x > _this.maxs.x)
                        _this.maxs.x = v.x;
                    if (v.y > _this.maxs.y)
                        _this.maxs.y = v.y;
                    if (v.z > _this.maxs.z)
                        _this.maxs.z = v.z;
                });
                this.sources.forEach(function (vv) {
                    var v = _this.deformationFunction(vv.position);
                    if (v.x < _this.mins.x)
                        _this.mins.x = v.x;
                    if (v.y < _this.mins.y)
                        _this.mins.y = v.y;
                    if (v.z < _this.mins.z)
                        _this.mins.z = v.z;
                    if (v.x > _this.maxs.x)
                        _this.maxs.x = v.x;
                    if (v.y > _this.maxs.y)
                        _this.maxs.y = v.y;
                    if (v.z > _this.maxs.z)
                        _this.maxs.z = v.z;
                });
                if (this.maxDistToBeClose != null) {
                    this.nbDistinctPoint = mathis.geo.distance(this.maxs, this.mins) / this.maxDistToBeClose;
                }
            };
            return FindCloseVerticesFast;
        }());
        grateAndGlue.FindCloseVerticesFast = FindCloseVerticesFast;
        var Merger = (function () {
            function Merger(receiverMamesh, sourceMamesh, map) {
                this.sourceEqualRecepter = false;
                this.cleanDoubleLinks = false;
                this.cleanDoubleSquareAndTriangles = true;
                this.cleanLinksCrossingSegmentMiddle = true;
                this.suppressSomeTriangleAndSquareSuperposition = false;
                this.mergeLink = true;
                this.mergeTrianglesAndSquares = true;
                this.mergeSegmentsMiddle = true;
                /**so that only the source is drawable*/
                this.destroySource = true;
                this.receiverMamesh = receiverMamesh;
                if (sourceMamesh == null || receiverMamesh == sourceMamesh) {
                    this.sourceMamesh = receiverMamesh;
                    this.sourceEqualRecepter = true;
                }
                else {
                    this.sourceMamesh = sourceMamesh;
                    this.sourceEqualRecepter = false;
                }
                if (map == null)
                    map = new FindCloseVerticesFast(this.receiverMamesh.vertices, this.sourceMamesh.vertices).go();
                this.merginMap = new mathis.HashMap(true);
                for (var _i = 0, _a = map.allEntries(); _i < _a.length; _i++) {
                    var entry = _a[_i];
                    this.merginMap.putValue(entry.key, entry.value[0]);
                }
                // if (mergingMap==null){
                //     this.buildMergingMap()
                //     this.merginMap=new FindCloseVerticesFast(this.receiverMamesh.vertices,this.sourceMamesh.vertices).go()
                //     console.log(this.merginMap)
                //
                // }
                // else {
                //     let entries=mergingMap.allEntries()
                //     if (entries.length==0) {
                //         logger.c( 'empty merging map')
                //         this.merginMap=new HashMap<Vertex,Vertex>(true)
                //     }
                //     else{
                //         if (entries[0].value instanceof Array){
                //             this.merginMap=new HashMap<Vertex,Vertex>(true)
                //             for (let entry of entries) this.merginMap.putValue(entry.key,entry.value[0])
                //         }
                //         else this.merginMap=<HashMap<Vertex,Vertex>> mergingMap
                //     }
                //
                //
                //
                // }
            }
            //associateLinksWhichBecameOppositeFromMerging = true
            /**if null, no association is made*/
            //maxAngleToAssociateOppositeLink=Math.PI*0.4
            Merger.prototype.checkArgs = function () {
                var _this = this;
                if (!this.merginMap.memorizeKeys)
                    throw 'the merging map must memorize the keys';
                this.merginMap.allValues().forEach(function (v) {
                    if (_this.merginMap.getValue(v) != null)
                        throw 'a vertex cannot be the destination and the source of a merging';
                });
            };
            /**do the merging, changing the entry*/
            Merger.prototype.goChanging = function () {
                this.checkArgs();
                if (this.mergeLink)
                    this.mergeVerticesAndLinks();
                else
                    this.mergeOnlyVertices();
                if (this.mergeTrianglesAndSquares)
                    this.letsMergeTrianglesAndSquares();
                if (this.mergeSegmentsMiddle)
                    this.mergeCutSegment();
                /**at the end, we rebuild paramToVertex, the third coordinate of parameter is changed to show the superposition */
                // this.receiverMamesh.paramToVertex = new HashMap<XYZ,Vertex>(true)
                // this.receiverMamesh.vertices.forEach(v=> {
                //     while (this.receiverMamesh.paramToVertex.getValue(v.param)!=null) {
                //         v.param.z++
                //     }
                //     this.receiverMamesh.paramToVertex.putValue(v.param, v)
                // })
                //this.receiverMamesh.clearOppositeInLinks()
                // if (this.maxAngleToAssociateOppositeLink!=null) {
                //     let oppositeLinkAssocier=new linkModule.OppositeLinkAssocierByAngles(this.receiverMamesh.vertices)
                //     oppositeLinkAssocier.maxAngleToAssociateLinks=this.maxAngleToAssociateOppositeLink
                //     oppositeLinkAssocier.goChanging()
                // }
                this.receiverMamesh.lines = null;
                if (this.destroySource && !this.sourceEqualRecepter)
                    this.sourceMamesh.vertices = null;
            };
            //
            // private buildMergingMap():void {
            //     let indexToMerge:{[key:number]:number}
            //
            //     this.merginMap = new HashMap<Vertex,Vertex>(true)
            //
            //     let positionsRecepter:XYZ[] = []
            //     this.receiverMamesh.vertices.forEach(v=> {
            //         positionsRecepter.push(v.position)
            //     })
            //
            //     if (this.sourceEqualRecepter) indexToMerge = new geometry.CloseXYZfinder(positionsRecepter,null,1000).go()
            //     else {
            //         let positionsSource:XYZ[] = []
            //         this.sourceMamesh.vertices.forEach(v=> {
            //             positionsSource.push(v.position)
            //         })
            //         indexToMerge = new geometry.CloseXYZfinder(positionsRecepter, positionsSource,1000).go()
            //     }
            //
            //
            //     for (let index in indexToMerge) {
            //         this.merginMap.putValue(this.sourceMamesh.vertices[index], this.receiverMamesh.vertices[indexToMerge[index]])
            //     }
            //
            // }
            Merger.prototype.mergeOnlyVertices = function () {
                var _this = this;
                if (!this.sourceEqualRecepter)
                    this.receiverMamesh.vertices = this.receiverMamesh.vertices.concat(this.sourceMamesh.vertices);
                this.receiverMamesh.clearLinksAndLines();
                /**suppression of the sources*/
                this.merginMap.allKeys().forEach(function (v) {
                    mathis.tab.removeFromArray(_this.receiverMamesh.vertices, v);
                });
            };
            //
            // private mergeVerticesAndLinksOld():void {
            //
            //
            //     if (!this.sourceEqualRecepter) this.receiverMamesh.vertices = this.receiverMamesh.vertices.concat(this.sourceMamesh.vertices)
            //
            //
            //     this.merginMap.allKeys().forEach(v1=> {
            //
            //         var linksThatWeKeep:Link[] = []
            //         v1.links.forEach(link=> {
            //             /**the links must not be composed with suppressed vertex*/
            //             if (this.merginMap.getValue(link.to) == null || (link.opposite != null && this.merginMap.getValue(link.opposite.to) == null )) {
            //                 /** the link must not be contracted into one vertex after merging*/
            //                 if (this.merginMap.getValue(v1) != link.to) linksThatWeKeep.push(link)
            //             }
            //         })
            //         this.merginMap.getValue(v1).links = this.merginMap.getValue(v1).links.concat(linksThatWeKeep)
            //     })
            //
            //
            //     /**suppression of  sources*/
            //     this.merginMap.allKeys().forEach(v=> {
            //         removeFromArray(this.receiverMamesh.vertices, v)
            //     })
            //
            //
            //     /**we change links everywhere where a vertex-to-merge appears*/
            //     this.receiverMamesh.vertices.forEach((v1:Vertex)=> {
            //
            //         var perhapsLinkToSuppress:Link[] = null
            //         v1.links.forEach(link=> {
            //             if (this.merginMap.getValue(link.to) != null) {
            //                 if (this.merginMap.getValue(link.to) != v1) link.to = this.merginMap.getValue(link.to)
            //                 else {
            //                     if (perhapsLinkToSuppress == null) perhapsLinkToSuppress = []
            //                     perhapsLinkToSuppress.push(link)
            //                 }
            //             }
            //             if (link.opposite != null) {
            //                 if (this.merginMap.getValue(link.opposite.to) != null) {
            //                     if (this.merginMap.getValue(link.opposite.to) != v1) link.opposite.to = this.merginMap.getValue(link.opposite.to)
            //                     else link.opposite = null
            //                 }
            //             }
            //         })
            //         if (perhapsLinkToSuppress != null) {
            //             perhapsLinkToSuppress.forEach(li=> {
            //                 removeFromArray(v1.links, li)
            //             })
            //         }
            //
            //     })
            //
            //
            //     /** suppression of double links  with opposite equal to itself*/
            //     if (this.cleanDoubleLinks) {
            //
            //         this.receiverMamesh.vertices.forEach(vertex=> {
            //
            //             for (let link of vertex.links) {
            //                 if (link.opposite != null && (link.opposite.to.hashNumber == vertex.hashNumber || link.opposite.to.hashNumber == link.to.hashNumber )) link.opposite = null
            //             }
            //
            //             let dico = new HashMap<Vertex,number[]>()
            //             for (let i = 0; i < vertex.links.length; i++) {
            //                 let vert = vertex.links[i].to
            //                 if (dico.getValue(vert) == null) dico.putValue(vert, new Array<number>())
            //                 dico.getValue(vert).push(i)
            //
            //             }
            //
            //
            //
            //             /**we prefer to keep vertex with double links*/
            //
            //             let indexLinkToKeep:number[]=[]
            //             dico.allValues().forEach(linkIndices=> {
            //
            //                 if (linkIndices.length==1) indexLinkToKeep.push(linkIndices[0])
            //                 else if (linkIndices.length > 1) {
            //
            //                     let oneWithOpposite = -1
            //                     for (let ind of linkIndices) {
            //                         if (vertex.links[ind].opposite != null) {
            //                             oneWithOpposite = ind
            //                             break
            //                         }
            //                     }
            //                     if (oneWithOpposite != -1) {
            //                         //removeFromArray(linkIndices, oneWithOpposite)
            //                         indexLinkToKeep.push(oneWithOpposite)
            //                     }
            //                     else {
            //                         //linkIndices.pop()
            //                         indexLinkToKeep.push(linkIndices[0])
            //                     }
            //
            //
            //                 }
            //
            //             })
            //             vertex.links = arrayKeepingSomeIndices<Link>(vertex.links, indexLinkToKeep)
            //
            //             /**we remove malformation which can appears when removing links*/
            //             vertex.links.forEach(link=> {
            //                 if (link.opposite != null) {
            //                     if (link.opposite.opposite == null || link.opposite.opposite.to.hashNumber != link.to.hashNumber) link.opposite = null
            //                 }
            //             })
            //
            //
            //         })
            //
            //
            //     }
            //
            //
            //     this.receiverMamesh.vertices.forEach(central=> {
            //         for (let link of central.links) {
            //             let oppositeLink=link.opposite
            //
            //             if (oppositeLink != null) {
            //
            //                 if (central.links.indexOf(oppositeLink)==-1)
            //
            //                     if (oppositeLink.opposite!=link) throw "opposite of  opposite do not give the same link"
            //
            //             }
            //
            //         }
            //
            //     })
            //
            //
            //
            //
            //
            //
            //
            // }
            Merger.prototype.mergeVerticesAndLinks = function () {
                var _this = this;
                if (!this.sourceEqualRecepter)
                    this.receiverMamesh.vertices = this.receiverMamesh.vertices.concat(this.sourceMamesh.vertices);
                /**first we clean all opposite (too hard to keep them, cf. Old procedure which too often create irregularities)*/
                this.receiverMamesh.clearOppositeInLinks();
                //     .vertices.forEach(v=>{
                //     v.links.forEach(l=>l.opposite=null)
                // })
                /**we add source-links to receivers, except some links */
                this.merginMap.allKeys().forEach(function (v1) {
                    var linksThatWeKeep = [];
                    v1.links.forEach(function (link) {
                        /**the links must not be composed with suppressed vertex*/
                        if (_this.merginMap.getValue(link.to) == null) {
                            /** the link must not be contracted into one vertex after merging*/
                            if (_this.merginMap.getValue(v1) != link.to)
                                linksThatWeKeep.push(link);
                        }
                    });
                    _this.merginMap.getValue(v1).links = _this.merginMap.getValue(v1).links.concat(linksThatWeKeep);
                });
                /**suppression of  sources*/
                var newVertices = [];
                this.receiverMamesh.vertices.forEach(function (v) {
                    if (_this.merginMap.allKeys().indexOf(v) == -1)
                        newVertices.push(v);
                });
                this.receiverMamesh.vertices = newVertices;
                // this.merginMap.allKeys().forEach(v=> {
                //     removeFromArray(this.recepterMamesh.vertices, v)
                // })
                /**we change links everywhere where a vertex-to-merge appears*/
                this.receiverMamesh.vertices.forEach(function (v1) {
                    var perhapsLinkToSuppress = null;
                    v1.links.forEach(function (link) {
                        if (_this.merginMap.getValue(link.to) != null) {
                            if (_this.merginMap.getValue(link.to) != v1)
                                link.to = _this.merginMap.getValue(link.to);
                            else {
                                if (perhapsLinkToSuppress == null)
                                    perhapsLinkToSuppress = [];
                                perhapsLinkToSuppress.push(link);
                            }
                        }
                        // if (link.opposite != null) {
                        //     if (this.merginMap.getValue(link.opposite.to) != null) {
                        //         if (this.merginMap.getValue(link.opposite.to) != v1) link.opposite.to = this.merginMap.getValue(link.opposite.to)
                        //         else link.opposite = null
                        //     }
                        // }
                    });
                    if (perhapsLinkToSuppress != null) {
                        perhapsLinkToSuppress.forEach(function (li) {
                            mathis.tab.removeFromArray(v1.links, li);
                        });
                    }
                });
                /** suppression of double links*/
                if (this.cleanDoubleLinks) {
                }
            };
            Merger.prototype.mergeCutSegment = function () {
                var _this = this;
                if (!this.sourceEqualRecepter) {
                    for (var key in this.sourceMamesh.cutSegmentsDico)
                        this.receiverMamesh.cutSegmentsDico[key] = this.sourceMamesh.cutSegmentsDico[key];
                }
                for (var key in this.receiverMamesh.cutSegmentsDico) {
                    var segment = this.receiverMamesh.cutSegmentsDico[key];
                    if (segment.a.hashNumber == segment.middle.hashNumber || segment.b.hashNumber == segment.middle.hashNumber || segment.a.hashNumber == segment.b.hashNumber) {
                        delete this.receiverMamesh.cutSegmentsDico[key];
                        continue;
                    }
                    var segmentIsModified = false;
                    if (this.merginMap.getValue(segment.a) != null) {
                        segment.a = this.merginMap.getValue(segment.a);
                        segmentIsModified = true;
                    }
                    if (this.merginMap.getValue(segment.b) != null) {
                        segment.b = this.merginMap.getValue(segment.b);
                        segmentIsModified = true;
                    }
                    if (this.merginMap.getValue(segment.middle) != null) {
                        segment.middle = this.merginMap.getValue(segment.middle);
                        segmentIsModified = true;
                    }
                    if (segmentIsModified) {
                        delete this.receiverMamesh.cutSegmentsDico[key];
                        this.receiverMamesh.cutSegmentsDico[mathis.Segment.segmentId(segment.a.hashNumber, segment.b.hashNumber)] = segment;
                    }
                }
                if (this.cleanLinksCrossingSegmentMiddle) {
                    this.receiverMamesh.vertices.forEach(function (v) {
                        var linkToDelete = [];
                        for (var i = 0; i < v.links.length; i++) {
                            var link = v.links[i];
                            if (_this.receiverMamesh.cutSegmentsDico[mathis.Segment.segmentId(v.hashNumber, link.to.hashNumber)] != null)
                                linkToDelete.push(i);
                        }
                        v.links = mathis.tab.arrayMinusBlocksIndices(v.links, linkToDelete, 1);
                    });
                }
            };
            Merger.prototype.letsMergeTrianglesAndSquares = function () {
                /**addition source triangulatedRect and square*/
                if (!this.sourceEqualRecepter) {
                    this.receiverMamesh.smallestSquares = this.receiverMamesh.smallestSquares.concat(this.sourceMamesh.smallestSquares);
                    this.receiverMamesh.smallestTriangles = this.receiverMamesh.smallestTriangles.concat(this.sourceMamesh.smallestTriangles);
                }
                /**changing triangulatedRect;  perhaps deleted*/
                for (var i = 0; i < this.receiverMamesh.smallestTriangles.length; i++) {
                    var vert = this.receiverMamesh.smallestTriangles[i];
                    if (this.merginMap.getValue(vert) != null)
                        this.receiverMamesh.smallestTriangles[i] = this.merginMap.getValue(vert);
                }
                var triangleToSuppress = [];
                for (var i = 0; i < this.receiverMamesh.smallestTriangles.length; i += 3) {
                    if (this.receiverMamesh.smallestTriangles[i] == this.receiverMamesh.smallestTriangles[i + 1] || this.receiverMamesh.smallestTriangles[i + 1] == this.receiverMamesh.smallestTriangles[i + 2] || this.receiverMamesh.smallestTriangles[i + 2] == this.receiverMamesh.smallestTriangles[i]) {
                        triangleToSuppress.push(i);
                    }
                }
                this.receiverMamesh.smallestTriangles = mathis.tab.arrayMinusBlocksIndices(this.receiverMamesh.smallestTriangles, triangleToSuppress, 3);
                /**to remove doublon*/
                this.receiverMamesh.smallestTriangles = new mathis.tab.ArrayMinusBlocksElements(this.receiverMamesh.smallestTriangles, 3).go();
                /**changing square; perhaps into triangulatedRect; perhaps deleted*/
                for (var i = 0; i < this.receiverMamesh.smallestSquares.length; i++) {
                    var vert = this.receiverMamesh.smallestSquares[i];
                    if (this.merginMap.getValue(vert) != null)
                        this.receiverMamesh.smallestSquares[i] = this.merginMap.getValue(vert);
                }
                var squareToSuppress = [];
                for (var i = 0; i < this.receiverMamesh.smallestSquares.length; i += 4) {
                    var changedSquare = this.changeOneSquare([this.receiverMamesh.smallestSquares[i], this.receiverMamesh.smallestSquares[i + 1], this.receiverMamesh.smallestSquares[i + 2], this.receiverMamesh.smallestSquares[i + 3]]);
                    if (changedSquare == null) {
                        squareToSuppress.push(i);
                    }
                    else if (changedSquare.length == 3) {
                        this.receiverMamesh.smallestTriangles.push(changedSquare[0], changedSquare[1], changedSquare[2]);
                        squareToSuppress.push(i);
                    }
                }
                this.receiverMamesh.smallestSquares = mathis.tab.arrayMinusBlocksIndices(this.receiverMamesh.smallestSquares, squareToSuppress, 4);
                /**to remove doublon*/
                if (this.cleanDoubleSquareAndTriangles)
                    this.receiverMamesh.smallestSquares = new mathis.tab.ArrayMinusBlocksElements(this.receiverMamesh.smallestSquares, 4).go();
                if (this.suppressSomeTriangleAndSquareSuperposition) {
                    /**to remove triangulatedRect which superpose with square*/
                    var triInSquare = new mathis.StringMap();
                    for (var i = 0; i < this.receiverMamesh.smallestSquares.length; i += 4) {
                        triInSquare.putValue(mathis.tab.indicesUpPermutationToString([this.receiverMamesh.smallestSquares[i].hashNumber, this.receiverMamesh.smallestSquares[i + 1].hashNumber, this.receiverMamesh.smallestSquares[i + 2].hashNumber]), true);
                        triInSquare.putValue(mathis.tab.indicesUpPermutationToString([this.receiverMamesh.smallestSquares[i + 2].hashNumber, this.receiverMamesh.smallestSquares[i + 3].hashNumber, this.receiverMamesh.smallestSquares[i].hashNumber]), true);
                        triInSquare.putValue(mathis.tab.indicesUpPermutationToString([this.receiverMamesh.smallestSquares[i].hashNumber, this.receiverMamesh.smallestSquares[i + 1].hashNumber, this.receiverMamesh.smallestSquares[i + 3].hashNumber]), true);
                        triInSquare.putValue(mathis.tab.indicesUpPermutationToString([this.receiverMamesh.smallestSquares[i + 1].hashNumber, this.receiverMamesh.smallestSquares[i + 2].hashNumber, this.receiverMamesh.smallestSquares[i + 3].hashNumber]), true);
                    }
                    var triToSupp = [];
                    for (var i = 0; i < this.receiverMamesh.smallestTriangles.length; i += 3) {
                        var key = mathis.tab.indicesUpPermutationToString([this.receiverMamesh.smallestTriangles[i].hashNumber, this.receiverMamesh.smallestTriangles[i + 1].hashNumber, this.receiverMamesh.smallestTriangles[i + 2].hashNumber]);
                        if (triInSquare.getValue(key)) {
                            triToSupp.push(i, i + 1, i + 2);
                        }
                    }
                    this.receiverMamesh.smallestTriangles = mathis.tab.arrayMinusBlocksIndices(this.receiverMamesh.smallestTriangles, triToSupp, 3);
                    /** remove square which superpose with square : two of the edge of the first are the diagonal of the second. We remove half of the first*/
                    var diago = new mathis.StringMap();
                    for (var i = 0; i < this.receiverMamesh.smallestSquares.length; i += 4) {
                        diago.putValue(mathis.tab.indicesUpPermutationToString([this.receiverMamesh.smallestSquares[i].hashNumber, this.receiverMamesh.smallestSquares[i + 2].hashNumber]), true);
                        diago.putValue(mathis.tab.indicesUpPermutationToString([this.receiverMamesh.smallestSquares[i + 1].hashNumber, this.receiverMamesh.smallestSquares[i + 3].hashNumber]), true);
                    }
                    var squareToRemove = [];
                    var triToAdd = [];
                    for (var i = 0; i < this.receiverMamesh.smallestSquares.length; i += 4) {
                        for (var k = 0; k < 4; k++) {
                            var edge0 = [this.receiverMamesh.smallestSquares[i + k].hashNumber, this.receiverMamesh.smallestSquares[i + (k + 1) % 4].hashNumber];
                            var edge1 = [this.receiverMamesh.smallestSquares[i + (k + 1) % 4].hashNumber, this.receiverMamesh.smallestSquares[i + (k + 2) % 4].hashNumber];
                            if (diago.getValue(mathis.tab.indicesUpPermutationToString(edge0)) && diago.getValue(mathis.tab.indicesUpPermutationToString(edge1))) {
                                squareToRemove.push(i, i + 1, i + 2, i + 3);
                                triToAdd.push(this.receiverMamesh.smallestSquares[i + (k + 2) % 4], this.receiverMamesh.smallestSquares[i + (k + 3) % 4], this.receiverMamesh.smallestSquares[i + k % 4]);
                            }
                        }
                    }
                    if (triToAdd.length > 0) {
                        this.receiverMamesh.smallestSquares = mathis.tab.arrayMinusBlocksIndices(this.receiverMamesh.smallestSquares, squareToRemove, 4);
                        this.receiverMamesh.smallestTriangles = this.receiverMamesh.smallestTriangles.concat(triToAdd);
                    }
                }
            };
            Merger.prototype.changeOneSquare = function (square) {
                if (square[0] == square[2] || square[1] == square[3])
                    return null;
                var indexOfCollabsed = null;
                var nbOfCollapsed = 0;
                for (var i = 0; i < 4; i++) {
                    if (square[i] == square[(i + 1) % 4]) {
                        nbOfCollapsed++;
                        indexOfCollabsed = i;
                    }
                }
                if (nbOfCollapsed == 0)
                    return square;
                if (nbOfCollapsed > 1)
                    return null;
                if (indexOfCollabsed == 0)
                    return [square[1], square[2], square[3]];
                if (indexOfCollabsed == 1)
                    return [square[2], square[3], square[0]];
                if (indexOfCollabsed == 2)
                    return [square[3], square[0], square[1]];
                if (indexOfCollabsed == 3)
                    return [square[0], square[1], square[2]];
            };
            return Merger;
        }());
        grateAndGlue.Merger = Merger;
        /**TODO add new polygon where we stick
         * we need to use the links sorting before*/
        var Sticker = (function () {
            // constructor(mamesh0:Mamesh,mamesh1:Mamesh,stickingMap:HashMap<Vertex,Vertex[]>|HashMap<Vertex,Vertex>){
            //
            //     if (mamesh0==mamesh1 || mamesh1==null) this.twoMameshes=false
            //
            //     this.mamesh0=mamesh0
            //
            //     if(this.twoMameshes) this.mamesh1=mamesh1
            //     else this.mamesh1=null
            //
            //     let entries=stickingMap.allEntries()
            //     if (entries.length==0) {
            //         logger.c('empty sticking map')
            //         this.stickingMap=new HashMap<Vertex,Vertex[]>(true)
            //     }
            //     else{
            //         if (!(entries[0].value instanceof Array)){
            //             this.stickingMap=new HashMap<Vertex,Vertex[]>(true)
            //             for (let entry of entries) {
            //                 let value=<Vertex> entry.value
            //                 this.stickingMap.putValue(entry.key,[value])
            //             }
            //         }
            //         else this.stickingMap=<HashMap<Vertex,Vertex[]>> stickingMap
            //     }
            //
            //
            //
            // }
            function Sticker(mamesh0, mamesh1, stickingMap) {
                this.createNewLinks = true;
                this.cleanOppositeLinksAtBegin = true;
                this.twoMameshes = true;
                this.zIndex1 = Math.random();
                if (mamesh0 == mamesh1 || mamesh1 == null)
                    this.twoMameshes = false;
                this.mamesh0 = mamesh0;
                if (this.twoMameshes)
                    this.mamesh1 = mamesh1;
                else
                    this.mamesh1 = null;
                this.stickingMap = stickingMap;
                // let entries=stickingMap.allEntries()
                // if (entries.length==0) {
                //     logger.c('empty sticking map')
                //     this.stickingMap=new HashMap<Vertex,Vertex[]>(true)
                // }
                // else{
                //     if (!(entries[0].value instanceof Array)){
                //         this.stickingMap=new HashMap<Vertex,Vertex[]>(true)
                //         for (let entry of entries) {
                //             let value=<Vertex> entry.value
                //             this.stickingMap.putValue(entry.key,[value])
                //         }
                //     }
                //     else this.stickingMap=<HashMap<Vertex,Vertex[]>> stickingMap
                // }
            }
            Sticker.prototype.checkArgs = function () {
                if (!this.stickingMap.memorizeKeys)
                    throw 'the sticking map must memorize the keys';
                for (var _i = 0, _a = this.stickingMap.allValues(); _i < _a.length; _i++) {
                    var vs = _a[_i];
                    for (var _b = 0, vs_1 = vs; _b < vs_1.length; _b++) {
                        var v = vs_1[_b];
                        if (this.stickingMap.getValue(v) != null)
                            throw 'a vertex cannot be the destination and the source of a sticking';
                    }
                }
            };
            Sticker.prototype.goChanging = function () {
                if (this.stickingMap.allKeys().length == 0)
                    return;
                this.checkArgs();
                if (this.cleanOppositeLinksAtBegin) {
                    this.mamesh0.clearOppositeInLinks();
                    if (this.twoMameshes)
                        this.mamesh1.clearOppositeInLinks();
                }
                if (this.twoMameshes) {
                    for (var _i = 0, _a = this.mamesh1.vertices; _i < _a.length; _i++) {
                        var ve = _a[_i];
                        ve.param.z = this.zIndex1;
                        this.mamesh0.addVertex(ve);
                    }
                    this.mamesh0.smallestSquares = this.mamesh0.smallestSquares.concat(this.mamesh1.smallestSquares);
                    this.mamesh0.smallestTriangles = this.mamesh0.smallestTriangles.concat(this.mamesh1.smallestTriangles);
                }
                this.mamesh0.cutSegmentsDico = {};
                this.mamesh0.vertexToPositioning = null;
                this.mamesh0.lines = null;
                if (this.createNewLinks) {
                    for (var _b = 0, _c = this.stickingMap.allKeys(); _b < _c.length; _b++) {
                        var vSource = _c[_b];
                        for (var _d = 0, _e = this.stickingMap.getValue(vSource); _d < _e.length; _d++) {
                            var vReceiver = _e[_d];
                            vSource.setOneLink(vReceiver);
                            vReceiver.setOneLink(vSource);
                        }
                    }
                }
            };
            return Sticker;
        }());
        grateAndGlue.Sticker = Sticker;
    })(grateAndGlue = mathis.grateAndGlue || (mathis.grateAndGlue = {}));
})(mathis || (mathis = {}));
