/**
 * Created by vigon on 23/02/2016.
 */
var mathis;
(function (mathis) {
    var linkModule;
    (function (linkModule) {
        var SimpleLinkFromPolygonCreator = (function () {
            function SimpleLinkFromPolygonCreator(mamesh) {
                this.mamesh = mamesh;
            }
            SimpleLinkFromPolygonCreator.prototype.goChanging = function () {
                this.mamesh.clearLinksAndLines();
                var alreadyCreatedLinks = new mathis.StringMap();
                for (var _i = 0, _a = this.mamesh.polygons; _i < _a.length; _i++) {
                    var poly = _a[_i];
                    for (var i = 0; i < poly.length; i++) {
                        var segmentId = mathis.Segment.segmentId(poly[i].hashNumber, poly[(i + 1) % poly.length].hashNumber);
                        if (alreadyCreatedLinks.getValue(segmentId) == null) {
                            alreadyCreatedLinks.putValue(segmentId, true);
                            poly[i].setOneLink(poly[(i + 1) % poly.length]);
                            poly[(i + 1) % poly.length].setOneLink(poly[i]);
                        }
                    }
                }
            };
            return SimpleLinkFromPolygonCreator;
        }());
        linkModule.SimpleLinkFromPolygonCreator = SimpleLinkFromPolygonCreator;
        //TODO create LinksSorterByPolygons, already in linkModule module
        var LinksSorterAndCleanerByAngles = (function () {
            function LinksSorterAndCleanerByAngles(mamesh, normals) {
                this.normals = normals;
                this.suppressLinksAngularlyTooCloseVersusNot = true;
                this.suppressLinksAngularParam = 2 * Math.PI * 0.1;
                this.keepShorterLinksVersusGiveSomePriorityToLinksWithOpposite = true;
                this.mamesh = mamesh;
            }
            LinksSorterAndCleanerByAngles.prototype.goChanging = function () {
                var _this = this;
                if (this.mamesh == null)
                    throw 'mamesh is null';
                if (this.normals == null)
                    this.vertexToPositioning = new mathis.mameshAroundComputations.PositioningComputerForMameshVertices(this.mamesh).go();
                else if (this.normals instanceof mathis.HashMap)
                    this.vertexToPositioning = this.normals;
                else if (this.normals instanceof mathis.XYZ) {
                    this.vertexToPositioning = new mathis.HashMap();
                    var positioning = new mathis.Positioning();
                    positioning.upVector = this.normals;
                    for (var _i = 0, _a = this.mamesh.vertices; _i < _a.length; _i++) {
                        var vertex = _a[_i];
                        this.vertexToPositioning.putValue(vertex, positioning);
                    }
                }
                this.mamesh.vertices.forEach(function (center) {
                    //cc('center',center)
                    var vectorLinks = [];
                    for (var i = 0; i < center.links.length; i++) {
                        vectorLinks[i] = new mathis.XYZ(0, 0, 0).copyFrom(center.links[i].to.position).substract(center.position);
                        if (vectorLinks[i].length() < mathis.geo.epsilon)
                            throw 'a IN_mamesh with two voisins at the same position';
                    }
                    var angles = [];
                    angles.push({
                        angle: 0,
                        i: 0
                    });
                    var normal = _this.vertexToPositioning.getValue(center).upVector;
                    for (var i = 1; i < center.links.length; i++) {
                        angles.push({
                            angle: mathis.geo.angleBetweenTwoVectorsBetweenMinusPiAndPi(vectorLinks[0], vectorLinks[i], normal),
                            i: i
                        });
                    }
                    angles.sort(function (a, b) { return a.angle - b.angle; });
                    var newLinks = [];
                    for (var k = 0; k < angles.length; k++) {
                        //cc(angles[k])
                        newLinks.push(center.links[angles[k].i]);
                    }
                    center.links = newLinks;
                    // let linksToSuppress:Link[]=[]
                    // for (let k=0;k<angles.length;k++){
                    //     let diff=modulo(angles[(k+1)%angles.length].angle-angles[k].angle,2*Math.PI,true)
                    //     if (Math.abs(diff)<this.minimalAngleBetweenLinks) {
                    //         let link0=center.links[angles[k].i]
                    //         let link1=center.links[angles[(k+1)%angles.length].i]
                    //         /**we favorise link with opposite*/
                    //         if (link0.opposite==null&& link1.opposite!=null) linksToSuppress.push(link0)
                    //         else linksToSuppress.push(link1)
                    //     }
                    // }
                    //
                    // for (let link of linksToSuppress){
                    //     if (link.opposite!=null) link.opposite.opposite=null
                    //     removeFromArray(center.links,link)
                    //     link.to.suppressOneLink(center,false)
                    // }
                });
                if (this.suppressLinksAngularlyTooCloseVersusNot)
                    this.letsSuppressLinks();
            };
            LinksSorterAndCleanerByAngles.prototype.letsSuppressLinks = function () {
                for (var _i = 0, _a = this.mamesh.vertices; _i < _a.length; _i++) {
                    var center = _a[_i];
                    var currentIndex = 0;
                    var oneMoreTime = true;
                    while (oneMoreTime && center.links.length >= 2) {
                        oneMoreTime = false;
                        for (var k = currentIndex; k < currentIndex + center.links.length; k++) {
                            var i = k % center.links.length;
                            var ii = (k + 1) % center.links.length;
                            var vecti = mathis.XYZ.newFrom(center.links[i].to.position).substract(center.position);
                            var vectii = mathis.XYZ.newFrom(center.links[ii].to.position).substract(center.position);
                            var angle = mathis.geo.angleBetweenTwoVectorsBetween0andPi(vecti, vectii);
                            if (angle < this.suppressLinksAngularParam) {
                                /**next time we will start to check from the next index*/
                                var disti = mathis.geo.distance(center.position, center.links[i].to.position);
                                var distii = mathis.geo.distance(center.position, center.links[ii].to.position);
                                var linkToSuppress = void 0;
                                if (this.keepShorterLinksVersusGiveSomePriorityToLinksWithOpposite) {
                                    if (disti < distii)
                                        linkToSuppress = center.links[ii];
                                    else
                                        linkToSuppress = center.links[i];
                                }
                                else {
                                    var ratio = disti / (disti + distii);
                                    /**if length are comparable, we favorise links with opposite*/
                                    if (ratio < 0.6 && ratio > 0.4) {
                                        if (center.links[ii].opposites == null && center.links[i].opposites != null)
                                            linkToSuppress = center.links[ii];
                                        else
                                            linkToSuppress = center.links[i];
                                    }
                                    else {
                                        if (disti < distii)
                                            linkToSuppress = center.links[ii];
                                        else
                                            linkToSuppress = center.links[i];
                                    }
                                }
                                mathis.Vertex.separateTwoVoisins(center, linkToSuppress.to);
                                // removeFromArray(center.links,linkToSuppress)
                                // if (linkToSuppress.opposite!=null) linkToSuppress.opposite.opposite=null
                                // linkToSuppress.to.suppressOneLink(center,true)
                                oneMoreTime = true;
                                currentIndex = (ii + 1);
                                break;
                            }
                        }
                    }
                }
            };
            return LinksSorterAndCleanerByAngles;
        }());
        linkModule.LinksSorterAndCleanerByAngles = LinksSorterAndCleanerByAngles;
        var OppositeLinkAssocierByAngles = (function () {
            function OppositeLinkAssocierByAngles(vertices) {
                this.maxAngleToAssociateLinks = Math.PI * 0.3; //0.3
                /**to make bifurcation on a vertex where two link are exactly aligned  (this shape: _\_ )   ,you must put a value >=1  */
                //propToleranceForBifurcation=0.2
                this.clearAllExistingOppositeBefore = false;
                this.canCreateBifurcations = true;
                this.doNotBranchOnBorder = false;
                this.OUT_nbBranching = 0;
                this.vertices = vertices;
            }
            OppositeLinkAssocierByAngles.prototype.associateOppositeLinks = function () {
                var _this = this;
                var verticeCoupleToSeparateAtTheEnd = [];
                this.vertices.forEach(function (center) {
                    var valence = 0;
                    for (var _i = 0, _a = center.links; _i < _a.length; _i++) {
                        var li = _a[_i];
                        if (li.opposites == null)
                            valence++;
                    }
                    var vectorLinks = [];
                    for (var i = 0; i < center.links.length; i++) {
                        vectorLinks[i] = new mathis.XYZ(0, 0, 0).copyFrom(center.links[i].to.position).substract(center.position);
                        if (vectorLinks[i].lengthSquared() < mathis.geo.epsilonSquare)
                            throw 'the IN_mamesh has two voisins at the same position';
                    }
                    var allAngleBetweenLinks = [];
                    var bestAngle = [];
                    for (var i = 0; i < center.links.length; i++) {
                        bestAngle[i] = Number.POSITIVE_INFINITY;
                        for (var j = i + 1; j < center.links.length; j++) {
                            var angle = Math.abs(mathis.modulo(mathis.geo.angleBetweenTwoVectorsBetween0andPi(vectorLinks[i], vectorLinks[j]) - Math.PI, Math.PI * 2, true));
                            /**keep only small angle. We do not touch to existing opposites; but opposite could had been clear at the begin of this*/
                            if (angle < _this.maxAngleToAssociateLinks && (center.links[i].opposites == null && center.links[j].opposites == null)) {
                                if (angle < bestAngle[i])
                                    bestAngle[i] = angle;
                                allAngleBetweenLinks.push({
                                    angle: angle,
                                    i: i,
                                    j: j
                                });
                            }
                        }
                    }
                    // if (center.links.length>6){
                    //
                    //     let worstLinkIndex=tab.maxIndex(bestAngle)
                    //     verticeCoupleToSeparateAtTheEnd.push([center,center.links[worstLinkIndex].to])
                    //     //Vertex.separateTwoVoisins(center,center.links[worstLinkIndex].to)
                    //     // allAngleBetweenLinks = arrayMinusElements(allAngleBetweenLinks, (el)=> {
                    //     //     return el.i == worstLinkIndex || el.j == worstLinkIndex
                    //     // })
                    //
                    // }
                    //allAngleBetweenLinks=arrayMinusElements(allAngleBetweenLinks,(elem)=>{return elem.angle>this.maxAngleToAssociateLinks})
                    //
                    // if (!this.clearAllExistingOppositeBefore){
                    //     allAngleBetweenLinks=arrayMinusElements(allAngleBetweenLinks,(elem)=>{return })
                    // }
                    allAngleBetweenLinks.sort(function (a, b) { return b.angle - a.angle; });
                    if (!_this.canCreateBifurcations || (_this.doNotBranchOnBorder && center.hasMark(mathis.Vertex.Markers.border))) {
                        while (allAngleBetweenLinks.length > 0) {
                            var elem = allAngleBetweenLinks.pop();
                            var link0 = center.links[elem.i];
                            var link1 = center.links[elem.j];
                            // if (link0.opposites != null) allAngleBetweenLinks = arrayMinusElements(allAngleBetweenLinks, (el)=> {
                            //     return el.i == elem.i || el.j == elem.i
                            // })
                            // else if (link1.opposites != null) allAngleBetweenLinks = arrayMinusElements(allAngleBetweenLinks, (el)=> {
                            //     return el.i == elem.j || el.j == elem.j
                            // })
                            // else {
                            link0.opposites = [link1];
                            link1.opposites = [link0];
                            allAngleBetweenLinks = mathis.tab.arrayMinusElements(allAngleBetweenLinks, function (el) {
                                return el.i == elem.i || el.j == elem.i || el.i == elem.j || el.j == elem.j;
                            });
                        }
                    }
                    else {
                        while (allAngleBetweenLinks.length > 0) {
                            //cc('allAngleBetweenLinks',allAngleBetweenLinks.length)
                            var elem = allAngleBetweenLinks.pop();
                            var nextElem = allAngleBetweenLinks[allAngleBetweenLinks.length - 1];
                            var link0 = void 0;
                            var link1 = void 0;
                            var link2 = void 0;
                            //if (nextElem!=null&& (nextElem.angle-elem.angle)/(elem.angle+nextElem.angle+0.00001)<this.propToleranceForBifurcation) {
                            if (valence == 3 && nextElem != null) {
                                if (elem.i == nextElem.i) {
                                    link0 = center.links[elem.i];
                                    link1 = center.links[elem.j];
                                    link2 = center.links[nextElem.j];
                                }
                                else if (elem.i == nextElem.j) {
                                    link0 = center.links[elem.i];
                                    link1 = center.links[elem.j];
                                    link2 = center.links[nextElem.i];
                                }
                                else if (elem.j == nextElem.i) {
                                    link0 = center.links[elem.j];
                                    link1 = center.links[elem.i];
                                    link2 = center.links[nextElem.j];
                                }
                                else if (elem.j == nextElem.j) {
                                    link0 = center.links[elem.j];
                                    link1 = center.links[elem.i];
                                    link2 = center.links[nextElem.i];
                                }
                                else {
                                    link0 = center.links[elem.i];
                                    link1 = center.links[elem.j];
                                }
                            }
                            else {
                                link0 = center.links[elem.i];
                                link1 = center.links[elem.j];
                            }
                            if (link2 == null) {
                                link0.opposites = [link1];
                                link1.opposites = [link0];
                                allAngleBetweenLinks = mathis.tab.arrayMinusElements(allAngleBetweenLinks, function (el) {
                                    return el.i == elem.i || el.j == elem.i || el.i == elem.j || el.j == elem.j;
                                });
                                valence -= 2;
                            }
                            else {
                                _this.OUT_nbBranching++;
                                allAngleBetweenLinks.pop();
                                link0.opposites = [link1, link2];
                                link1.opposites = [link0];
                                link2.opposites = [link0];
                                valence -= 1;
                                allAngleBetweenLinks = mathis.tab.arrayMinusElements(allAngleBetweenLinks, function (el) {
                                    return el.i == elem.i || el.j == elem.i || el.i == elem.j || el.j == elem.j || el.i == nextElem.i || el.j == nextElem.i || el.i == nextElem.j || el.j == nextElem.j;
                                });
                            }
                        }
                    }
                });
                // for (let pair of verticeCoupleToSeparateAtTheEnd){
                //     Vertex.separateTwoVoisins(pair[0],pair[1])
                // }
            };
            // private findOneBadLinkIndex(){
            //     for (let v of this.vertices){
            //         if (v.links.length>=5){
            //             for (let i=0;i<v.links.length;i++){
            //                 let li=v.links[i]
            //                 if (li.opposites==null) return i
            //             }
            //         }
            //     }
            //     return null
            // }
            OppositeLinkAssocierByAngles.prototype.goChanging = function () {
                if (this.clearAllExistingOppositeBefore) {
                    this.vertices.forEach(function (v) {
                        v.links.forEach(function (li) {
                            li.opposites = null;
                        });
                    });
                }
                if (this.maxAngleToAssociateLinks != null)
                    this.associateOppositeLinks();
            };
            return OppositeLinkAssocierByAngles;
        }());
        linkModule.OppositeLinkAssocierByAngles = OppositeLinkAssocierByAngles;
        // export class GraphCleaning{
        //
        //     vertices:Vertex[]
        //
        //     constructor(vertices:Vertex[]){
        //         this.vertices=vertices
        //     }
        //
        //     goChanging():void{
        //
        //         this.cleanDoubleLinksKeepingInPriorityThoseWithOpposite()
        //
        //     }
        //
        //     private cleanDoubleLinksKeepingInPriorityThoseWithOpposite(){
        //
        //
        //         this.vertices.forEach(vertex=> {
        //           
        //             /**dico of links to keep*/
        //             let dico = new HashMap<Vertex,Link>()
        //             let linksToDelete:Link[]=[]
        //             for (let link of vertex.links) {
        //
        //                 if (dico.getValue(link.to)==null) dico.putValue(link.to,link)
        //                 else {
        //                     if (dico.getValue(link.to).opposites==null && link.opposites!=null ) {
        //                         linksToDelete.push(dico.getValue(link.to))
        //                         dico.putValue(link.to,link)
        //                     }
        //                     else linksToDelete.push(link)
        //                 }
        //             }
        //           
        //             for (let link of linksToDelete){
        //                 removeFromArray(vertex.links,link)
        //                 if (link.opposite!=null) link.opposite.opposite=null
        //             }
        //
        //           
        //
        //
        //
        //         })
        //
        //     }
        //   
        // }
        var LinkCreaterSorterAndBorderDetecterByPolygons = (function () {
            function LinkCreaterSorterAndBorderDetecterByPolygons(mamesh) {
                /**
                 * a T jonction is that
                 *   7
                 *   |
                 * - 5
                 *   |
                 *   6
                 *
                 * or that
                 *
                 *   7
                 *  \|
                 * - 5
                 *  /|
                 *   6
                 *
                 * in this case we add
                 * XXXTJonction: {[id:5]:[7,6]}
                 *
                 * */
                this.interiorTJonction = new mathis.HashMap(); //:{[id:number]:boolean}={}
                this.borderTJonction = new mathis.HashMap();
                this.forcedOpposite = new mathis.HashMap();
                /**build by createPolygonesFromSmallestTrianglesAnSquares */
                this.polygonesAroundEachVertex = new mathis.HashMap();
                this.polygones = [];
                /** an isolate vertex is a corner which belongs only to one polygone.  */
                this.markIsolateVertexAsCorner = true;
                this.markBorder = true;
                this.forceOppositeLinksAtCorners = false;
                this.mamesh = mamesh;
            }
            LinkCreaterSorterAndBorderDetecterByPolygons.prototype.goChanging = function () {
                this.checkArgs();
                this.createPolygonesFromSmallestTrianglesAnSquares();
                this.detectBorder();
                this.createLinksTurningAround();
                this.makeLinksFinaly();
                //this.mamesh.linksOK=true
            };
            LinkCreaterSorterAndBorderDetecterByPolygons.prototype.checkArgs = function () {
                if ((this.mamesh.smallestSquares == null || this.mamesh.smallestSquares.length == 0) && (this.mamesh.smallestTriangles == null || this.mamesh.smallestTriangles.length == 0))
                    throw 'no triangles nor squares given';
                this.mamesh.clearLinksAndLines();
            };
            LinkCreaterSorterAndBorderDetecterByPolygons.prototype.createPolygonesFromSmallestTrianglesAnSquares = function () {
                var _this = this;
                for (var i = 0; i < this.mamesh.smallestTriangles.length; i += 3) {
                    this.polygones.push(new Polygone([
                        this.mamesh.smallestTriangles[i],
                        this.mamesh.smallestTriangles[i + 1],
                        this.mamesh.smallestTriangles[i + 2],
                    ]));
                }
                for (var i = 0; i < this.mamesh.smallestSquares.length; i += 4) {
                    this.polygones.push(new Polygone([
                        this.mamesh.smallestSquares[i],
                        this.mamesh.smallestSquares[i + 1],
                        this.mamesh.smallestSquares[i + 2],
                        this.mamesh.smallestSquares[i + 3],
                    ]));
                }
                for (var _i = 0, _a = this.polygones; _i < _a.length; _i++) {
                    var polygone = _a[_i];
                    var length_1 = polygone.points.length;
                    for (var i = 0; i < length_1; i++) {
                        var vert1 = polygone.points[i % length_1];
                        var vert2 = polygone.points[(i + 1) % length_1];
                        this.subdivideSegment(polygone, vert1, vert2, this.mamesh.cutSegmentsDico);
                    }
                }
                this.mamesh.vertices.forEach(function (v) {
                    _this.polygonesAroundEachVertex.putValue(v, new Array());
                });
                this.polygones.forEach(function (poly) {
                    poly.points.forEach(function (vert) {
                        _this.polygonesAroundEachVertex.getValue(vert).push(poly);
                    });
                });
                //cc('polygonesAroundEachVertex',this.polygonesAroundEachVertex.toString())
                if (this.markIsolateVertexAsCorner) {
                    this.mamesh.vertices.forEach(function (v) {
                        if (_this.polygonesAroundEachVertex.getValue(v).length == 1) {
                            v.markers.push(mathis.Vertex.Markers.corner);
                            mathis.logger.c('new corners was added when we automatically create then links from the triangulatedRect/square');
                        }
                    });
                }
                //for (let poly of this.polygones) {
                //    for (let vert of poly.points){
                //    }
                //}
            };
            LinkCreaterSorterAndBorderDetecterByPolygons.prototype.detectBorder = function () {
                var _this = this;
                for (var ind = 0; ind < this.mamesh.vertices.length; ind++) {
                    var center = this.mamesh.vertices[ind];
                    var polygonesAround = this.polygonesAroundEachVertex.getValue(center);
                    /**we look at all the polygon aroung a vertex (the center) we count the number of times that a vertex appear as a border of a polygon*/
                    var segmentMultiplicity = new mathis.HashMap(true); //:{[id:number]:number} = {}
                    for (var _i = 0, polygonesAround_1 = polygonesAround; _i < polygonesAround_1.length; _i++) {
                        var polygone = polygonesAround_1[_i];
                        var twoAngles = polygone.theTwoAnglesAdjacentFrom(center);
                        var side0id = twoAngles[0];
                        var side1id = twoAngles[1];
                        if (segmentMultiplicity.getValue(side0id) == null)
                            segmentMultiplicity.putValue(side0id, 1);
                        else
                            segmentMultiplicity.putValue(side0id, segmentMultiplicity.getValue(side0id) + 1);
                        if (segmentMultiplicity.getValue(side1id) == null)
                            segmentMultiplicity.putValue(side1id, 1);
                        else
                            segmentMultiplicity.putValue(side1id, segmentMultiplicity.getValue(side1id) + 1);
                    }
                    var count = 0;
                    segmentMultiplicity.allKeys().forEach(function (key) {
                        if (segmentMultiplicity.getValue(key) == 1) {
                            count++;
                            if (_this.borderTJonction.getValue(center) == null) {
                                _this.borderTJonction.putValue(center, new Array());
                                if (_this.markBorder)
                                    center.markers.push(mathis.Vertex.Markers.border);
                            }
                            /**we colect the link in a T-jonction*/
                            _this.borderTJonction.getValue(center).push(key);
                        }
                        else if (segmentMultiplicity.getValue(key) > 2)
                            throw " non conform mesh: a link appear strictly more than 2 times as side of polygones turning around a vertex   ";
                    });
                    if (!(count == 0 || count == 2))
                        throw "strange mesh (perhaps too holy): the vertex: " + center.toString(0) + " has:" + count + " link with multiplicity 1";
                }
            };
            LinkCreaterSorterAndBorderDetecterByPolygons.prototype.createLinksTurningAround = function () {
                var _this = this;
                var doIi = function (v, vv) {
                    var cutSegment = _this.mamesh.cutSegmentsDico[mathis.Segment.segmentId(v.hashNumber, vv.hashNumber)];
                    if (cutSegment != null) {
                        if (_this.interiorTJonction.getValue(cutSegment.middle) != null) {
                            console.log('attention, une double interiorTjonction');
                        }
                        else
                            _this.interiorTJonction.putValue(cutSegment.middle, true);
                        _this.forcedOpposite.putValue(cutSegment.middle, [v, vv]);
                    }
                };
                /** we detect polygone with several colinear points  */
                for (var _i = 0, _a = this.polygones; _i < _a.length; _i++) {
                    var polygone = _a[_i];
                    var length_2 = polygone.points.length;
                    if (length_2 > 3) {
                        if (length_2 == 4) {
                            doIi(polygone.points[0], polygone.points[2]);
                            doIi(polygone.points[1], polygone.points[3]);
                        }
                        else {
                            for (var i = 0; i < length_2; i++) {
                                var v = polygone.points[i];
                                var vv = polygone.points[(i + 2) % length_2];
                                doIi(v, vv);
                            }
                        }
                    }
                }
                this.mamesh.vertices.forEach(function (central) {
                    //list of polygones which have the central cell at one angle
                    // be careful : in very exceptional case, this list can have only one element
                    var polygonesAround = _this.polygonesAroundEachVertex.getValue(central);
                    if (_this.borderTJonction.getValue(central) != null && _this.interiorTJonction.getValue(central) != null)
                        throw 'a vertex cannot be a interior and border T-jonction';
                    if (_this.borderTJonction.getValue(central) == null) {
                        /**we take any polygone */
                        var poly0 = polygonesAround[0];
                        if (poly0 == null)
                            mathis.logger.c('some vertex was not around a square/triangulatedRect');
                        else
                            _this.createLinksTurningFromOnePolygone(central, poly0, polygonesAround, false);
                    }
                    else {
                        var poly = _this.findAPolygoneWithOrientedEdge(central, _this.borderTJonction.getValue(central)[0], polygonesAround);
                        if (poly == null)
                            poly = _this.findAPolygoneWithOrientedEdge(central, _this.borderTJonction.getValue(central)[1], polygonesAround);
                        _this.createLinksTurningFromOnePolygone(central, poly, polygonesAround, true);
                    }
                });
            };
            LinkCreaterSorterAndBorderDetecterByPolygons.prototype.makeLinksFinaly = function () {
                var _this = this;
                this.mamesh.vertices.forEach(function (vertex) {
                    if (_this.forceOppositeLinksAtCorners || !vertex.hasMark(mathis.Vertex.Markers.corner)) {
                        var length_3 = vertex.links.length;
                        if (_this.borderTJonction.getValue(vertex) != null) {
                            var nei1 = vertex.links[0];
                            var nei2 = vertex.links[length_3 - 1];
                            nei1.opposites = [nei2];
                            nei2.opposites = [nei1];
                        }
                        else {
                            if (length_3 % 2 == 0) {
                                for (var i = 0; i < length_3; i++) {
                                    var nei1 = vertex.links[i];
                                    var nei2 = vertex.links[(i + length_3 / 2) % length_3];
                                    nei1.opposites = [nei2];
                                    nei2.opposites = [nei1];
                                }
                            }
                            if (_this.forcedOpposite.getValue(vertex) != null) {
                                var voi0 = _this.forcedOpposite.getValue(vertex)[0];
                                var voi1 = _this.forcedOpposite.getValue(vertex)[1];
                                /**important to suppress opposite before create some new. If not we create bifurcations*/
                                vertex.changeToLinkWithoutOpposite(voi0);
                                vertex.changeToLinkWithoutOpposite(voi1);
                                vertex.setTwoOppositeLinks(voi0, voi1);
                            }
                        }
                    }
                });
            };
            //    function completSegment(segment:Segment){
            //    /**premier passage */
            //    if (segment.middle==null){
            //        segment.middle=graphManip.addNewVertex(this.IN_mamesh.vertices,this.IN_mamesh.vertices.length)
            //        segment.middle.dichoLevel=Math.max(segment.a.dichoLevel,segment.b.dichoLevel)+1
            //        segment.middle.position=geo.newXYZ(0,0,0)
            //        geo.between(segment.a.position,segment.b.position,0.5,segment.middle.position)
            //
            //    }
            //}
            LinkCreaterSorterAndBorderDetecterByPolygons.prototype.findAPolygoneWithOrientedEdge = function (vertDeb, vertFin, aList) {
                for (var _i = 0, aList_1 = aList; _i < aList_1.length; _i++) {
                    var polygone = aList_1[_i];
                    var length_4 = polygone.points.length;
                    for (var i = 0; i < length_4; i++) {
                        if (polygone.points[i % length_4].hashNumber == vertDeb.hashNumber && polygone.points[(i + 1) % length_4].hashNumber == vertFin.hashNumber)
                            return polygone;
                    }
                }
                return null;
            };
            LinkCreaterSorterAndBorderDetecterByPolygons.prototype.findAPolygoneWithThisEdge = function (vert1, vert2, aList) {
                for (var _i = 0, aList_2 = aList; _i < aList_2.length; _i++) {
                    var polygone = aList_2[_i];
                    var length_5 = polygone.points.length;
                    for (var i = 0; i < length_5; i++) {
                        var id = mathis.Segment.segmentId(polygone.points[i % length_5].hashNumber, polygone.points[(i + 1) % length_5].hashNumber);
                        var idBis = mathis.Segment.segmentId(vert1.hashNumber, vert2.hashNumber);
                        if (id == idBis)
                            return polygone;
                    }
                }
                return null;
            };
            LinkCreaterSorterAndBorderDetecterByPolygons.prototype.createLinksTurningFromOnePolygone = function (central, poly0, polygonesAround, isBorder) {
                var currentAngle = poly0.theOutgoingAnglesAdjacentFrom(central);
                var currentPolygone = poly0;
                var allIsWellOriented = true;
                while (polygonesAround.length > 0) {
                    central.links.push(new mathis.Link(currentAngle));
                    if (allIsWellOriented)
                        currentAngle = currentPolygone.theIngoingAnglesAdjacentFrom(central);
                    else {
                        var angles = currentPolygone.theTwoAnglesAdjacentFrom(central);
                        if (angles[0].hashNumber == currentAngle.hashNumber)
                            currentAngle = angles[1];
                        else
                            currentAngle = angles[0];
                    }
                    mathis.tab.removeFromArray(polygonesAround, currentPolygone);
                    /**maintenant il n' y en a plus qu' un seul (ou zéro) polygone ayant comme côté [central,currentAngle], car on a supprimé l' autre polygone*/
                    //TODO improte considering only outgoing
                    currentPolygone = this.findAPolygoneWithOrientedEdge(central, currentAngle, polygonesAround);
                    if (currentPolygone == null) {
                        currentPolygone = this.findAPolygoneWithOrientedEdge(currentAngle, central, polygonesAround);
                        //TODO console.log(' orientations of the faces of your surface are not all compatible')
                        allIsWellOriented = false;
                    }
                }
                /** si les polygones ne font pas le tour complet, il faut rajouter un dernier link*/
                if (isBorder) {
                    central.links.push(new mathis.Link(currentAngle));
                }
            };
            /**at the beginning polygones are simply square or triangulatedRect. But perhaps, some of their edge were subdivide.
             * In this case, we add the middle in the polygone points. This method is recursive because segment could had been several time subdivided*/
            LinkCreaterSorterAndBorderDetecterByPolygons.prototype.subdivideSegment = function (polygone, vertex1, vertex2, cutSegmentDico) {
                var segment = cutSegmentDico[mathis.Segment.segmentId(vertex1.hashNumber, vertex2.hashNumber)];
                if (segment != null) {
                    var index1 = polygone.points.indexOf(vertex1);
                    var index2 = polygone.points.indexOf(vertex2);
                    var minIndex = Math.min(index1, index2);
                    var maxIndex = Math.max(index1, index2);
                    if (maxIndex == polygone.points.length - 1 && minIndex == 0)
                        polygone.points.splice(length, 0, segment.middle);
                    else
                        polygone.points.splice(minIndex + 1, 0, segment.middle);
                    this.subdivideSegment(polygone, vertex1, segment.middle, cutSegmentDico);
                    this.subdivideSegment(polygone, vertex2, segment.middle, cutSegmentDico);
                }
            };
            return LinkCreaterSorterAndBorderDetecterByPolygons;
        }());
        linkModule.LinkCreaterSorterAndBorderDetecterByPolygons = LinkCreaterSorterAndBorderDetecterByPolygons;
        var Polygone = (function () {
            function Polygone(points) {
                this.points = points;
                //for (let i = 0; i < points.length; i++) {
                //    let side = new Segment(points[i], points[(i + 1) % points.length]);
                //    this.sides.push(side);
                //}
            }
            //hasSide(ab:Segment):boolean {
            //    for (let i = 0; i < this.sides.length; i++) {
            //
            //        let side:Segment = this.sides[i];
            //
            //        if (ab.equals(side)) {
            //            return true;
            //        }
            //    }
            //    return false;
            //}
            Polygone.prototype.hasAngle = function (point) {
                for (var _i = 0, _a = this.points; _i < _a.length; _i++) {
                    var vert = _a[_i];
                    if (vert.hashNumber == point.hashNumber)
                        return true;
                }
                return false;
            };
            //theTwoSidesContaining(point:Vertex):Array<Segment> {
            //
            //    let twoSides = new Array<Segment>();
            //
            //    for (let i in this.sides) {
            //        let side:Segment = this.sides[i];
            //        if (side.has(point)) twoSides.push(side);
            //    }
            //
            //    if (twoSides.length != 2) throw "Non conform polygone";
            //
            //    return twoSides;
            //
            //}
            Polygone.prototype.theOutgoingAnglesAdjacentFrom = function (point) {
                var length = this.points.length;
                for (var i = 0; i < length; i++) {
                    if (this.points[i] == point) {
                        return this.points[(i + 1) % length];
                    }
                }
                throw 'we do not find the point in this polygone';
            };
            Polygone.prototype.theIngoingAnglesAdjacentFrom = function (point) {
                var length = this.points.length;
                for (var i = 0; i < length; i++) {
                    if (this.points[i] == point) {
                        return this.points[(i - 1 + length) % length];
                    }
                }
                throw 'we do not find the point in this polygone';
            };
            Polygone.prototype.theTwoAnglesAdjacentFrom = function (point) {
                var length = this.points.length;
                for (var i = 0; i < length; i++) {
                    if (this.points[i] == point) {
                        return [this.points[(i - 1 + length) % length], this.points[(i + 1) % length]];
                    }
                }
                throw 'we do not find the point in this polygone';
            };
            Polygone.prototype.toString = function () {
                var res = "[";
                for (var _i = 0, _a = this.points; _i < _a.length; _i++) {
                    var vertex = _a[_i];
                    res += vertex.hashNumber + ',';
                }
                return res + "]";
            };
            return Polygone;
        }());
        linkModule.Polygone = Polygone;
    })(linkModule = mathis.linkModule || (mathis.linkModule = {}));
})(mathis || (mathis = {}));
