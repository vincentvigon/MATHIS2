/**
 * Created by vigon on 18/12/2015.
 */
var mathis;
(function (mathis) {
    var VertexData = BABYLON.VertexData;
    var CanEat = (function () {
        function CanEat() {
        }
        CanEat.prototype.eat = function () {
            return 'miam';
        };
        return CanEat;
    }());
    var CanSleep = (function () {
        function CanSleep() {
        }
        CanSleep.prototype.sleep = function () {
            return 'ZZZ';
        };
        return CanSleep;
    }());
    function applyMixins(derivedCtor, baseCtors) {
        baseCtors.forEach(function (baseCtor) {
            Object.getOwnPropertyNames(baseCtor.prototype).forEach(function (name) {
                if (name !== 'constructor') {
                    derivedCtor.prototype[name] = baseCtor.prototype[name];
                }
            });
        });
    }
    var Being = (function () {
        function Being() {
            if (!Being.mixinsWasMade) {
                applyMixins(Being, [CanEat, CanSleep]);
                Being.mixinsWasMade = true;
            }
        }
        Being.mixinsWasMade = false;
        return Being;
    }());
    function informatisTest() {
        var bilan = new mathis.Bilan();
        mathis.logger.c('this a warning which test that warning are fired');
        {
            var v0 = new mathis.Vertex();
            v0.position = new mathis.XYZ(1, 2, 3);
            var v1 = new mathis.Vertex();
            v1.position = new mathis.XYZ(1, 2, 4);
            var v2 = new mathis.Vertex();
            v2.position = new mathis.XYZ(1, 2, 5);
            var v3 = new mathis.Vertex();
            v3.position = new mathis.XYZ(1, 2, 5.5);
            var line0 = new mathis.Line([v0, v1, v2, v3], false);
            var line1 = new mathis.Line([v3, v2, v1, v0], false);
            bilan.assertTrue(line0.hashString == line1.hashString);
            var line0loop = new mathis.Line([v0, v1, v2, v3], true);
            var line1loop = new mathis.Line([v0, v3, v2, v1], false);
            bilan.assertTrue(line0.hashString == line1.hashString);
            var v0a = new mathis.Vertex();
            v0a.position = new mathis.XYZ(1, 2, 3);
            var v1a = new mathis.Vertex();
            v1a.position = new mathis.XYZ(1, 2, 4);
            var v2a = new mathis.Vertex();
            v2a.position = new mathis.XYZ(1, 2, 5);
            var v3a = new mathis.Vertex();
            v3a.position = new mathis.XYZ(1, 2, 5.5);
            var line0a = new mathis.Line([v0a, v1a, v2a, v3a], false);
            bilan.assertTrue(line0a.hashString != line1.hashString);
            bilan.assertTrue(line0a.positionnalHash() == line1.positionnalHash());
        }
        {
            var gene = new mathis.reseau.BasisForRegularReseau();
            gene.nbI = 2;
            gene.nbJ = 2;
            var crea = new mathis.reseau.Regular(gene);
            var mamesh = crea.go();
            mamesh.fillLineCatalogue();
            new mathis.spacialTransformations.Similitude(mamesh.vertices, Math.PI / 4).goChanging();
            mathis.spacialTransformations.adjustInASquare(mamesh, new mathis.XYZ(0, 0, 0), new mathis.XYZ(1, 1, 0));
            var crea2 = new mathis.reseau.Regular(gene);
            var mamesh2 = crea2.go();
            mamesh2.fillLineCatalogue();
            new mathis.spacialTransformations.Similitude(mamesh2.vertices, Math.PI / 2).goChanging();
            mathis.spacialTransformations.adjustInASquare(mamesh2, new mathis.XYZ(0, 0, 0), new mathis.XYZ(1, 1, 0));
            var hashSet2 = new mathis.StringMap();
            for (var _i = 0, _a = mamesh2.lines.concat(mamesh2.lines); _i < _a.length; _i++) {
                var line = _a[_i];
                hashSet2.putValue(line.hashString, true);
            }
            bilan.assertTrue(hashSet2.allValues().length == 4);
            var hashSet = new mathis.StringMap();
            for (var _b = 0, _c = mamesh.lines; _b < _c.length; _b++) {
                var line = _c[_b];
                hashSet.putValue(line.hashStringUpToSymmetries(mathis.symmetries.squareMainSymmetries, true), true);
            }
            bilan.assertTrue(hashSet.allValues().length == 1);
        }
        {
            /**ArrayMinusBlocksElements*/
            var vertex0 = new mathis.Vertex();
            var vertex1 = new mathis.Vertex();
            var vertex2 = new mathis.Vertex();
            var vertex3 = new mathis.Vertex();
            var vertexA = new mathis.Vertex();
            var vertexB = new mathis.Vertex();
            var vertexC = new mathis.Vertex();
            var vertexD = new mathis.Vertex();
            var longList = [vertex0, vertex1, vertex2, vertex3, vertexA, vertexB, vertexC, vertexD];
            var newLongList = new mathis.tab.ArrayMinusBlocksElements(longList, 4, [vertex2, vertex3, vertex0, vertex1]).go();
            bilan.assertTrue(newLongList[0].hashString == vertexA.hashString && newLongList[1].hashString == vertexB.hashString && newLongList[2].hashString == vertexC.hashString && newLongList[3].hashString == vertexD.hashString);
        }
        var being = new Being();
        being.age = 37;
        bilan.assertTrue(being.age == 37);
        bilan.assertTrue(being.sleep() == 'ZZZ');
        bilan.assertTrue(being.eat() == 'miam');
        {
            var dico = new mathis.HashMap();
            var vertex0 = new mathis.Vertex();
            var vertex1 = new mathis.Vertex();
            var vertex2 = new mathis.Vertex();
            dico.putValue(vertex0, 'vertex0');
            dico.putValue(vertex1, 'vertex1');
            dico.putValue(vertex2, 'vertex2');
            dico.putValue(vertex0, 'vertex0bis');
            bilan.assertTrue(dico.getValue(vertex0) == 'vertex0bis');
        }
        /**testing the deep copy of IN_mamesh
         * this test follow the evolution of toString, this is a good idea: so if class {@link Mamesh} change, we have to change the deepCopy
         * */
        {
            var mamCrea = new mathis.reseau.Regular();
            mamCrea.nbI = 3;
            mamCrea.nbJ = 2;
            mamCrea.makeLinks = false;
            var mamesh = mamCrea.go();
            var dicho = new mathis.mameshModification.SquareDichotomer(mamesh);
            dicho.go();
            var linkCrea = new mathis.linkModule.LinkCreaterSorterAndBorderDetecterByPolygons(mamesh).goChanging();
            mamesh.fillLineCatalogue();
            var mameshCopy = new mathis.mameshModification.MameshDeepCopier(mamesh).go();
            bilan.assertTrue(mamesh.toString() == mameshCopy.toString());
        }
        /**test adding dynamicaly a new property to an object*/
        {
            var vertexData = new VertexData();
            /**alors ça, a quoi cela sert ???*/
            vertexData._idx = 5;
            var AClass = (function () {
                function AClass() {
                    this.aString = 'toto';
                    this.aNumber = 5;
                }
                return AClass;
            }());
            var anObject = new AClass();
            anObject.aString = 'mqlskdj';
            {
                anObject.newPro = 5;
            }
            bilan.assertTrue(anObject.newPro == 5);
        }
        return bilan;
    }
    mathis.informatisTest = informatisTest;
})(mathis || (mathis = {}));
