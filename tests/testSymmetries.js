/**
 * Created by vigon on 25/04/2016.
 */
var mathis;
(function (mathis) {
    function symmetriesTest() {
        var bilan = new mathis.Bilan();
        /**test squareMainSymmetries*/
        function testOneSymmetry(sym, mamesh) {
            var vertexAfterTrans = new mathis.HashMap(true);
            mamesh.vertices.forEach(function (v) {
                var paramTrans = sym(v.param);
                vertexAfterTrans.putValue(mamesh.findVertexFromParam(paramTrans), true);
            });
            bilan.assertTrue(vertexAfterTrans.allValues().length == mamesh.vertices.length);
        }
        function testAllSymmetries(mamesh, symmetries) {
            symmetries.allValues().forEach(function (sym) {
                testOneSymmetry(sym, mamesh);
            });
        }
        {
            var crea = new mathis.reseau.Regular();
            crea.nbI = 5;
            crea.nbJ = 6;
            crea.makeLinks = false;
            var mamesh = crea.go();
            new mathis.mameshModification.SquareDichotomer(mamesh).go();
            new mathis.mameshModification.SquareDichotomer(mamesh).go();
            testAllSymmetries(mamesh, mathis.symmetries.cartesian(crea.nbI, crea.nbJ));
        }
        {
            var crea = new mathis.reseau.Regular();
            crea.nbI = 3;
            /**with even number, the IN_mamesh is not j-symmetric !!!!*/
            crea.nbJ = 7;
            crea.oneMoreVertexForOddLine = true;
            crea.squareVersusTriangleMaille = false;
            var mamesh = crea.go();
            testAllSymmetries(mamesh, mathis.symmetries.cartesian(crea.nbI, crea.nbJ, crea.oneMoreVertexForOddLine));
        }
        {
            var crea = new mathis.reseau.Regular();
            crea.nbI = 9;
            /**with even number, the IN_mamesh is not j-symmetric !!!!*/
            crea.nbJ = 5;
            crea.oneMoreVertexForOddLine = false;
            crea.squareVersusTriangleMaille = false;
            var mamesh = crea.go();
            var dicho = new mathis.mameshModification.TriangleDichotomer(mamesh);
            dicho.makeLinks = true;
            dicho.go();
            dicho = new mathis.mameshModification.TriangleDichotomer(mamesh);
            dicho.makeLinks = true;
            dicho.go();
            testAllSymmetries(mamesh, mathis.symmetries.cartesian(crea.nbI, crea.nbJ, crea.oneMoreVertexForOddLine));
        }
        {
            for (var nbSides = 3; nbSides < 12; nbSides++) {
                var crea = new mathis.reseau.TriangulatedPolygone(nbSides);
                var mamesh = crea.go();
                var dicho = new mathis.mameshModification.TriangleDichotomer(mamesh);
                dicho.makeLinks = true;
                dicho.go();
                dicho = new mathis.mameshModification.TriangleDichotomer(mamesh);
                dicho.makeLinks = true;
                dicho.go();
                testAllSymmetries(mamesh, mathis.symmetries.polygonRotations(nbSides));
            }
        }
        {
            var nbSides = 5;
            var crea = new mathis.reseau.TriangulatedPolygone(nbSides);
            var mamesh = crea.go();
            var dicho = new mathis.mameshModification.TriangleDichotomer(mamesh);
            dicho.makeLinks = true;
            dicho.go();
            dicho = new mathis.mameshModification.TriangleDichotomer(mamesh);
            dicho.makeLinks = true;
            dicho.go();
            testAllSymmetries(mamesh, mathis.symmetries.polygonRotations(nbSides));
        }
        {
            bilan.assertTrue(mathis.roundWithGivenPrecision(5.749999999, 3) == 5.75);
            bilan.assertTrue(mathis.roundWithGivenPrecision(-5.789999999, 5) == -5.79);
            bilan.assertTrue(mathis.roundWithGivenPrecision(5.749999936, 9) == 5.749999936);
        }
        return bilan;
    }
    mathis.symmetriesTest = symmetriesTest;
})(mathis || (mathis = {}));
