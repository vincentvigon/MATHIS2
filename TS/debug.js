/**
 * Created by vigon on 05/12/2016.
 */
var mathis;
(function (mathis) {
    var debug;
    (function (debug) {
        function verticesToString(vertices) {
            var tab = [];
            for (var _i = 0, vertices_1 = vertices; _i < vertices_1.length; _i++) {
                var v = vertices_1[_i];
                tab.push(v.hashNumber);
            }
            return JSON.stringify(tab.sort());
        }
        debug.verticesToString = verticesToString;
        function verticesFamilyToString(verticesFamily) {
            var tableau = [];
            for (var _i = 0, verticesFamily_1 = verticesFamily; _i < verticesFamily_1.length; _i++) {
                var fam = verticesFamily_1[_i];
                var a = [];
                for (var _a = 0, fam_1 = fam; _a < fam_1.length; _a++) {
                    var v = fam_1[_a];
                    a.push(v.hashNumber);
                }
                tableau.push(mathis.tab.indicesUpPermutationToString(a));
            }
            return JSON.stringify(tableau.sort());
        }
        debug.verticesFamilyToString = verticesFamilyToString;
        function objToString(array) {
            var res = '';
            for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
                var xyz = array_1[_i];
                res += xyz.toString();
            }
            return res;
        }
        debug.objToString = objToString;
        /**pour des tests uniquement*/
        function checkTheRegularityOfAGraph(vertices) {
            for (var _i = 0, vertices_2 = vertices; _i < vertices_2.length; _i++) {
                var central = vertices_2[_i];
                var link = null;
                for (var _a = 0, _b = central.links; _a < _b.length; _a++) {
                    link = _b[_a];
                    if (!link.to.hasVoisin(central))
                        throw "neighborhood relation is not reflexive. The vertex:" + central.toString(0) + "\n has a link which gos to:" + link.to.toString(0) +
                            "\n but no link in the other direction. A possible cause: you vertices is only a part of a graph";
                    if (link.opposites != null) {
                        for (var _c = 0, _d = link.opposites; _c < _d.length; _c++) {
                            var op = _d[_c];
                            if (central.links.indexOf(op) == -1)
                                throw "a link attached to a vertex has an opposite link which is not attached of this vertex \n " +
                                    "problem takes place at vertex:" + central.toString(0)
                                    + "\n link going to:" + link.to.toString(0)
                                    + "\n opposite link going to:" + op.to.toString(0);
                            if (op.opposites.indexOf(link) == -1)
                                throw "opposite of  opposite do not give the same link";
                        }
                    }
                }
            }
        }
        debug.checkTheRegularityOfAGraph = checkTheRegularityOfAGraph;
    })(debug = mathis.debug || (mathis.debug = {}));
})(mathis || (mathis = {}));
