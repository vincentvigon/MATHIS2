/**
 * Created by vigon on 05/12/2016.
 */
var mathis;
(function (mathis) {
    var appli;
    (function (appli) {
        var BidonPage1 = (function () {
            function BidonPage1(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.pageIdAndTitle = "bidon page 1";
                var several = new appli.SeveralParts();
                several.addPart(new BidonPartA(this.mathisFrame));
                several.addPart(new BidonPartB(this.mathisFrame));
                this.severalParts = several;
            }
            BidonPage1.prototype.go = function () {
                return this.severalParts.go();
            };
            return BidonPage1;
        }());
        appli.BidonPage1 = BidonPage1;
        var BidonPartA = (function () {
            function BidonPartA(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.NAME = "BidonPartA";
                this.TITLE = "BidonPartA";
                this.CREATOR = "vincent";
                this.nbSides = 7;
                this.$$$nbSides = [4, 7, 9];
                this.configA1 = 7;
                this.$$$configA1 = [5, 6, 7];
                this.configA2 = "toto_default";
                this.$$$configA2 = ['toto_default', 'tre', null];
                this.configA3 = true;
                this.$$$configA3 = [true, false];
                this._savedA1 = 5;
                this._saved_A2 = 7;
                this._saved_A3 = "bou";
                this.mathisFrame = mathisFrame;
            }
            BidonPartA.prototype.goForTheFirstTime = function () {
                this.mathisFrame.clearScene();
                this.mathisFrame.addDefaultCamera();
                this.mathisFrame.addDefaultLight();
                this.go();
            };
            BidonPartA.prototype.go = function () {
                this.mathisFrame.clearScene(false, false);
                var mathisFrame = this.mathisFrame;
                //$$$begin
                var configA2 = this.configA2;
                var creator = new mathis.reseau.TriangulatedPolygone(this.nbSides);
                creator.origin = new mathis.XYZ(-1, -1, 0);
                creator.end = new mathis.XYZ(1, 1, 0);
                creator.nbSubdivisionInARadius = 4;
                //$$$end
                //$$$bt
                /**somme calculation for test*/
                var a = Math.pow(this.configA1, 3);
                this._saved_A2 = a;
                //$$$et
                //$$$begin
                var mamesh = creator.go();
                var kk = this.configA3;
                var distances = new mathis.graph.DistancesBetweenAllVertices(mamesh.vertices);
                distances.go();
                var random = new mathis.proba.Random();
                var vertex0 = mamesh.vertices[random.pseudoRandInt(mamesh.vertices.length)];
                var vertex1 = mamesh.vertices[random.pseudoRandInt(mamesh.vertices.length)];
                mathisFrame.messageDiv.append("distance between vertex0 and vertex1:" + distances.OUT_distance(vertex0, vertex1));
                mathisFrame.messageDiv.append("graph diameter:" + distances.OUT_diameter);
                //n
                //$$$end
                //$$$bh visualization
                new mathis.visu3d.LinksViewer(mamesh, this.mathisFrame.scene).go();
                //$$$eh
            };
            return BidonPartA;
        }());
        var BidonPartB = (function () {
            function BidonPartB(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.NAME = "BidonPartB";
                this.TITLE = "BidonPartB";
                this.CREATOR = "vincent";
                this.configB1 = 5;
                this.$$$configB1 = [5, 6, 7];
                this._savedB1 = 5;
                this._savedB2 = 7;
                this.mathisFrame = mathisFrame;
            }
            BidonPartB.prototype.goForTheFirstTime = function () {
                this.mathisFrame.clearScene();
                this.mathisFrame.addDefaultCamera();
                this.mathisFrame.addDefaultLight();
                this.go();
            };
            BidonPartB.prototype.go = function () {
                this.mathisFrame.clearScene(false, false);
                var mathisFrame = this.mathisFrame;
                //$$$begin
                var creator = new mathis.reseau.TriangulatedPolygone(5);
                creator.origin = new mathis.XYZ(-1, -1, 0);
                creator.end = new mathis.XYZ(1, 1, 0);
                creator.nbSubdivisionInARadius = 4;
                //$$$end
                //$$$bt
                /**somme calculation for test*/
                var configA1 = this.configB1;
                //$$$et
                //$$$begin
                var mamesh = creator.go();
                var distances = new mathis.graph.DistancesBetweenAllVertices(mamesh.vertices);
                distances.go();
                var random = new mathis.proba.Random();
                var vertex0 = mamesh.vertices[random.pseudoRandInt(mamesh.vertices.length)];
                var vertex1 = mamesh.vertices[random.pseudoRandInt(mamesh.vertices.length)];
                mathisFrame.messageDiv.append("distance between vertex0 and vertex1:" + distances.OUT_distance(vertex0, vertex1));
                mathisFrame.messageDiv.append("graph diameter:" + distances.OUT_diameter);
                //n
                //$$$end
                //$$$bh visualization
                new mathis.visu3d.LinksViewer(mamesh, this.mathisFrame.scene).go();
                //$$$eh
            };
            return BidonPartB;
        }());
    })(appli = mathis.appli || (mathis.appli = {}));
})(mathis || (mathis = {}));
