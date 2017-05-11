/**
 * Created by vigon on 18/12/2015.
 */
var mathis;
(function (mathis) {
    //TODO emplacer par une référence sur le link pour pouvoir mettre plusieurs links ayant même depart et arrivée (mais pas même opposite)
    var TwoInt = (function () {
        function TwoInt(c, d) {
            this.a = (c < d) ? c : d;
            this.b = (c < d) ? d : c;
        }
        return TwoInt;
    }());
    var graph;
    (function (graph) {
        // export function  getGroup(startingGroup:Vertex[], admissibleForGroup :HashMap<Vertex,boolean>):Vertex[]{
        //
        //
        //     let group:Vertex[]=[]
        //     let newEdge:Vertex[]=[]
        //     let newEdgeSelected:Vertex[]=startingGroup
        //
        //     // initialisation
        //     for (let vertex of startingGroup) {
        //         group.push(vertex)
        //         admissibleForGroup.putValue(vertex,false)
        //     }
        //
        //     // iteration
        //     while (newEdgeSelected.length>0){
        //         newEdge = getEdge(newEdgeSelected);
        //         newEdgeSelected=[]
        //         for (let vertex of newEdge){
        //             if (admissibleForGroup.getValue(vertex)==true) {
        //                 newEdgeSelected.push(vertex);
        //                 group.push(vertex);
        //             }
        //             admissibleForGroup.putValue(vertex,false)
        //         }
        //     }
        //
        //     return group;
        // }
        /**if admissibleForGroup=null, all vertices is admissible*/
        function getGroup(startingGroup, admissibleForGroup) {
            var group = [];
            var newEdge = [];
            var newEdgeSelected = startingGroup;
            var alreadySeen = new mathis.HashMap();
            // initialisation
            for (var _i = 0, startingGroup_1 = startingGroup; _i < startingGroup_1.length; _i++) {
                var vertex = startingGroup_1[_i];
                group.push(vertex);
                alreadySeen.putValue(vertex, true);
            }
            // iteration
            while (newEdgeSelected.length > 0) {
                newEdge = getEdge(newEdgeSelected);
                newEdgeSelected = [];
                for (var _a = 0, newEdge_1 = newEdge; _a < newEdge_1.length; _a++) {
                    var vertex = newEdge_1[_a];
                    if (!alreadySeen.getValue(vertex)) {
                        if (admissibleForGroup == null || admissibleForGroup.getValue(vertex)) {
                            newEdgeSelected.push(vertex);
                            group.push(vertex);
                        }
                        alreadySeen.putValue(vertex, true);
                    }
                }
            }
            return group;
        }
        graph.getGroup = getGroup;
        var DistancesFromAGroup = (function () {
            function DistancesFromAGroup(centralCells) {
                this.OUT_distances_dico = new mathis.HashMap();
                this.centralCells = centralCells;
            }
            //OUT_maxDistance=0
            DistancesFromAGroup.prototype.OUT_distance = function (vertex) {
                return this.OUT_distances_dico.getValue(vertex);
            };
            DistancesFromAGroup.prototype.OUT_allGeodesics = function (vertex, onlyOne) {
                if (onlyOne === void 0) { onlyOne = false; }
                var res = [];
                var edge = [vertex];
                var nonAdmissible = new mathis.HashMap();
                var d = this.OUT_distances_dico.getValue(vertex);
                while (edge.length > 0) {
                    res.push(edge);
                    d--;
                    edge = getEdge(edge, nonAdmissible);
                    var selectedEdge = [];
                    for (var _i = 0, edge_1 = edge; _i < edge_1.length; _i++) {
                        var v = edge_1[_i];
                        if (this.OUT_distances_dico.getValue(v) == d) {
                            selectedEdge.push(v);
                            if (onlyOne)
                                break;
                        }
                    }
                    edge = selectedEdge;
                }
                return res;
            };
            DistancesFromAGroup.prototype.go = function () {
                var nonAdmissible = new mathis.HashMap();
                if (this.centralCells == null || this.centralCells.length == 0)
                    throw 'problème d argument';
                this.OUT_stratesAround = [];
                this.OUT_stratesAround.push(this.centralCells);
                var edge = getEdge(this.centralCells, nonAdmissible);
                while (edge.length > 0) {
                    this.OUT_stratesAround.push(edge);
                    edge = getEdge(edge, nonAdmissible);
                }
                for (var i = 0; i < this.OUT_stratesAround.length; i++) {
                    for (var _i = 0, _a = this.OUT_stratesAround[i]; _i < _a.length; _i++) {
                        var v = _a[_i];
                        this.OUT_distances_dico.putValue(v, i);
                    }
                }
                // let group:Vertex[]=[]
                // let newEdge:Vertex[]=[]
                // let newEdgeSelected:Vertex[]=this.startingGroup
                //
                // // initialisation
                // for (let vertex of this.startingGroup) {
                //     group.push(vertex)
                //     this.nonAdmissible.putValue(vertex,true)
                // }
                //
                // this.OUT_stratesAround.push(this.startingGroup)
                //
                //
                //
                //
                // // iteration
                // while (newEdgeSelected.length>0){
                //     newEdge = getEdge(newEdgeSelected);
                //     this.OUT_stratesAround.push(newEdge)
                //
                //     newEdgeSelected=[]
                //     for (let vertex of newEdge){
                //         /** nonAdmissible is none or false -> admissible  */
                //         if (!this.nonAdmissible.getValue(vertex)) {
                //             newEdgeSelected.push(vertex);
                //             group.push(vertex);
                //         }
                //         this.nonAdmissible.putValue(vertex,true)
                //     }
                // }
            };
            return DistancesFromAGroup;
        }());
        graph.DistancesFromAGroup = DistancesFromAGroup;
        var HeuristicDiameter = (function () {
            function HeuristicDiameter(vertices) {
                this.vertices = vertices;
                this.nbTimeOfNonEvolutionToStop = 2;
                this.lookNonEvolutionWithDistanceVersusWithGroups = true;
                //consecutiveExtremeGroups:Vertex[][]=[]
                this.consecutiveExtremetDistances = [];
                this.OUT_nbIteration = 0;
                this.OUT_twoChosenExtremeVertices = [];
            }
            HeuristicDiameter.prototype.go = function () {
                var extremeGroup = [this.vertices[0]];
                var d = 0;
                var extremeVertices = [];
                var distanceAround;
                while (this.evolution()) {
                    this.OUT_nbIteration++;
                    distanceAround = new DistancesFromAGroup(extremeGroup);
                    distanceAround.go();
                    d = distanceAround.OUT_stratesAround.length;
                    var oneExtreme = distanceAround.OUT_stratesAround[d - 1][0];
                    extremeGroup = [oneExtreme];
                    this.consecutiveExtremetDistances.push(d);
                    extremeVertices.push(oneExtreme);
                }
                this.OUT_twoChosenExtremeVertices = [extremeVertices[this.OUT_nbIteration - 1], extremeVertices[this.OUT_nbIteration - 2]];
                this.OUT_geodesicsBetweenChosenExtremeVertices = distanceAround.OUT_allGeodesics(extremeVertices[this.OUT_nbIteration - 1]);
                this.OUT_oneGeodesicBetweenChosenExtremeVertices = distanceAround.OUT_allGeodesics(extremeVertices[this.OUT_nbIteration - 1], true);
                return d - 1;
            };
            HeuristicDiameter.prototype.evolution = function () {
                if (this.lookNonEvolutionWithDistanceVersusWithGroups) {
                    var len = this.consecutiveExtremetDistances.length;
                    if (len < this.nbTimeOfNonEvolutionToStop)
                        return true;
                    var lastD = this.consecutiveExtremetDistances[len - 1];
                    for (var i = 1; i < this.nbTimeOfNonEvolutionToStop; i++) {
                        if (this.consecutiveExtremetDistances[len - 1 - i] != lastD)
                            return true;
                    }
                    return false;
                }
                else
                    throw "TODO";
            };
            return HeuristicDiameter;
        }());
        graph.HeuristicDiameter = HeuristicDiameter;
        var DistancesBetweenAllVertices = (function () {
            //useGraphDistanceVersusDistanceVersusLinkWeights=0
            function DistancesBetweenAllVertices(allVertices) {
                this.OUT_allExtremeVertex = [];
                this.allCounters = new mathis.HashMap();
                this.allToTransmit = new mathis.HashMap();
                // OUT_allGeodesics(vertex0:Vertex,vertex1:Vertex,onlyOne=false):Vertex[][]{
                //     let res:Vertex[][]=[]
                //     let edge=[vertex0]
                //     let nonAdmissible=new HashMap<Vertex,boolean>()
                //     //let d=this.allCounters.getValue(vertex0).getValue(vertex1)
                //
                //     while (edge.length>0){
                //         res.push(edge)
                //         let minDist=Number.POSITIVE_INFINITY
                //         edge=getEdge(edge,nonAdmissible)
                //         let selectedEdge:Vertex[]=[]
                //         for (let vertex of edge){
                //             let dist=this.allCounters.getValue(vertex).getValue(vertex1)
                //             if (dist<minDist) {
                //                 selectedEdge=[]
                //                 selectedEdge.push(vertex)
                //             }
                //             else if (dist==minDist&&!onlyOne) selectedEdge.push(vertex)
                //         }
                //         edge=selectedEdge
                //     }
                //
                //     return res
                // }
                this.OUT_diameter = null;
                this.allVertices = allVertices;
            }
            DistancesBetweenAllVertices.prototype.OUT_distance = function (vertex0, vertex1) {
                return this.allCounters.getValue(vertex0).getValue(vertex1);
            };
            DistancesBetweenAllVertices.prototype.OUT_allGeodesics = function (vertex0, vertex1, onlyOne) {
                if (onlyOne === void 0) { onlyOne = false; }
                var res = [];
                var edge = [vertex0];
                var nonAdmissible = new mathis.HashMap();
                var d = this.allCounters.getValue(vertex0).getValue(vertex1);
                while (edge.length > 0) {
                    res.push(edge);
                    d--;
                    edge = getEdge(edge, nonAdmissible);
                    var selectedEdge = [];
                    for (var _i = 0, edge_2 = edge; _i < edge_2.length; _i++) {
                        var vertex = edge_2[_i];
                        if (this.allCounters.getValue(vertex).getValue(vertex1) == d) {
                            selectedEdge.push(vertex);
                            if (onlyOne)
                                break;
                        }
                    }
                    edge = selectedEdge;
                }
                return res;
            };
            DistancesBetweenAllVertices.prototype.go = function () {
                /**initialisation*/
                for (var _i = 0, _a = this.allVertices; _i < _a.length; _i++) {
                    var vertex = _a[_i];
                    var myCounters = new mathis.HashMap(true);
                    myCounters.putValue(vertex, 0);
                    this.allCounters.putValue(vertex, myCounters);
                    var toTransmit = new mathis.HashMap(true);
                    toTransmit.putValue(vertex, 0);
                    this.allToTransmit.putValue(vertex, toTransmit);
                }
                var stillOneToTransmit = true;
                while (stillOneToTransmit) {
                    stillOneToTransmit = false;
                    this.allFreshlyReceived = new mathis.HashMap();
                    for (var _b = 0, _c = this.allVertices; _b < _c.length; _b++) {
                        var vertex = _c[_b];
                        this.allFreshlyReceived.putValue(vertex, new mathis.HashMap(true));
                    }
                    for (var _d = 0, _e = this.allVertices; _d < _e.length; _d++) {
                        var vertex = _e[_d];
                        var toTransmit = this.allToTransmit.getValue(vertex);
                        for (var _f = 0, _g = vertex.links; _f < _g.length; _f++) {
                            var link = _g[_f];
                            var voiCounter = this.allCounters.getValue(link.to);
                            //console.log(vertex,toTransmit.allKeys().length)
                            for (var _h = 0, _j = toTransmit.allKeys(); _h < _j.length; _h++) {
                                var v = _j[_h];
                                if (voiCounter.getValue(v) == null) {
                                    stillOneToTransmit = true;
                                    // let d:number
                                    // if (this.useGraphDistanceVersusDistanceVersusLinkWeights==0)d=1
                                    // else if (this.useGraphDistanceVersusDistanceVersusLinkWeights==1) d=geo.distance(vertex.position,link.to.position)
                                    // else if (link.weight!=null) d=link.weight
                                    // else throw "no weight defined"
                                    voiCounter.putValue(v, toTransmit.getValue(v) + 1);
                                    this.allFreshlyReceived.getValue(link.to).putValue(v, toTransmit.getValue(v) + 1);
                                }
                            }
                        }
                    }
                    this.allToTransmit = this.allFreshlyReceived;
                    this.OUT_diameter = 0;
                    for (var _k = 0, _l = this.allVertices; _k < _l.length; _k++) {
                        var vertex = _l[_k];
                        for (var _m = 0, _o = this.allCounters.getValue(vertex).allEntries(); _m < _o.length; _m++) {
                            var entry = _o[_m];
                            if (entry.value > this.OUT_diameter) {
                                this.OUT_diameter = entry.value;
                                this.OUT_aMaxCouple = [vertex, entry.key];
                                this.OUT_allExtremeVertex = [vertex];
                            }
                            if (entry.value == this.OUT_diameter)
                                this.OUT_allExtremeVertex.push(vertex);
                        }
                    }
                }
            };
            return DistancesBetweenAllVertices;
        }());
        graph.DistancesBetweenAllVertices = DistancesBetweenAllVertices;
        /**parmi admissibleForGroup, retourne la composante connexe autour de startingGroup. */
        // export function  getGroup( startingGroup:Vertex[],  admissibleForGroup :HashMap<Vertex,boolean>):Vertex[]{
        //
        //
        //     var group:Vertex[]=[]
        //     var newEdge:Vertex[]=[]
        //     var newEdgeSelected:Vertex[]=[]
        //
        //     // initialisation
        //     newEdgeSelected = startingGroup;
        //     startingGroup.forEach(c=>group.push(c));
        //     newEdgeSelected.forEach((c:Vertex)=>{admissibleForGroup.putValue(c,false) });
        //
        //     // iteration
        //     while (newEdgeSelected.length>0){
        //         newEdge = getEdge(newEdgeSelected);
        //         newEdgeSelected=[]
        //         newEdge.forEach((c:Vertex)=>{
        //             if (admissibleForGroup.getValue(c)==true) {
        //                 newEdgeSelected.push(c);
        //                 group.push(c);
        //             }
        //             admissibleForGroup.putValue(c,false)
        //         });
        //     }
        //
        //     return group;
        // }
        /**si admissibleForEdge n'est pas défini, on accepte tout le monde*/
        function getEdge(aGroup, CHANGING_nonAdmissibleForEdge) {
            if (CHANGING_nonAdmissibleForEdge == null)
                CHANGING_nonAdmissibleForEdge = new mathis.HashMap();
            var edge = [];
            for (var _i = 0, aGroup_1 = aGroup; _i < aGroup_1.length; _i++) {
                var vertex = aGroup_1[_i];
                CHANGING_nonAdmissibleForEdge.putValue(vertex, true);
            }
            for (var _a = 0, aGroup_2 = aGroup; _a < aGroup_2.length; _a++) {
                var vertex = aGroup_2[_a];
                for (var _b = 0, _c = vertex.links; _b < _c.length; _b++) {
                    var link = _c[_b];
                    if (!CHANGING_nonAdmissibleForEdge.getValue(link.to)) {
                        //if (admissibleForEdge==null || admissibleForEdge.getValue(link.to)) 
                        edge.push(link.to);
                    }
                    CHANGING_nonAdmissibleForEdge.putValue(link.to, true);
                }
            }
            return edge;
        }
        graph.getEdge = getEdge;
        function getEdgeConsideringAlsoDiagonalVoisin(aGroup, CHANGING_nonAdmissibleForEdge, exactltyTwo) {
            if (exactltyTwo === void 0) { exactltyTwo = false; }
            if (CHANGING_nonAdmissibleForEdge == null)
                CHANGING_nonAdmissibleForEdge = new mathis.HashMap();
            var edge = getEdge(aGroup, CHANGING_nonAdmissibleForEdge);
            var dicoEdge = new mathis.HashMap();
            for (var _i = 0, edge_3 = edge; _i < edge_3.length; _i++) {
                var c = edge_3[_i];
                dicoEdge.putValue(c, true);
            }
            var edgeAndGroup = edge.concat(aGroup);
            var edge2 = getEdge(edgeAndGroup);
            for (var _a = 0, edge2_1 = edge2; _a < edge2_1.length; _a++) {
                var c = edge2_1[_a];
                if (c.links.length <= 4) {
                    var nbLinkInEdge = 0;
                    for (var _b = 0, _c = c.links; _b < _c.length; _b++) {
                        var v = _c[_b];
                        if (dicoEdge.getValue(v.to) != null)
                            nbLinkInEdge++;
                    }
                    if (exactltyTwo && nbLinkInEdge == 2) {
                        edge.push(c);
                        CHANGING_nonAdmissibleForEdge.putValue(c, true);
                    }
                    else if (nbLinkInEdge >= 2) {
                        edge.push(c);
                        CHANGING_nonAdmissibleForEdge.putValue(c, true);
                    }
                }
            }
            return edge;
        }
        graph.getEdgeConsideringAlsoDiagonalVoisin = getEdgeConsideringAlsoDiagonalVoisin;
        //TODO suppress (un peu gadget)
        function ringify(centralCells) {
            var nonAdmissible = new mathis.HashMap();
            if (centralCells == null || centralCells.length == 0)
                throw 'problème d argument';
            var res = [];
            res.push(centralCells);
            var edge = getEdge(centralCells, nonAdmissible);
            while (edge.length > 0) {
                res.push(edge);
                edge = getEdge(edge, nonAdmissible);
            }
            return res;
        }
        graph.ringify = ringify;
        function ringifyConsideringAlsoDiagonalVoisin(centralCells) {
            if (centralCells == null || centralCells.length == 0)
                throw 'problème d argument';
            var res = [];
            res.push(centralCells);
            var interior = centralCells;
            var edge = getEdgeConsideringAlsoDiagonalVoisin(interior);
            while (edge.length > 0) {
                res.push(edge);
                interior = interior.concat(edge);
                edge = getEdgeConsideringAlsoDiagonalVoisin(interior);
            }
            return res;
        }
        graph.ringifyConsideringAlsoDiagonalVoisin = ringifyConsideringAlsoDiagonalVoisin;
    })(graph = mathis.graph || (mathis.graph = {}));
})(mathis || (mathis = {}));
