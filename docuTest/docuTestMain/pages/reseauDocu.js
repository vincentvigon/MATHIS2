/**
 * Created by vigon on 21/11/2016.
 */
var mathis;
(function (mathis) {
    var appli;
    (function (appli) {
        var ReseauDocu = (function () {
            function ReseauDocu(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.pageIdAndTitle = "Reseaux (=nets)";
                var severalParts = new appli.SeveralParts();
                severalParts.addPart(new RegularReseauDocu(this.mathisFrame));
                severalParts.addPart(new RegularBasisDocu(this.mathisFrame));
                severalParts.addPart(new PolygonalResauDocu(this.mathisFrame));
                severalParts.addPart(new Regular3dReseauDocu(this.mathisFrame));
                this.severalParts = severalParts;
            }
            ReseauDocu.prototype.go = function () {
                return this.severalParts.go();
            };
            return ReseauDocu;
        }());
        appli.ReseauDocu = ReseauDocu;
        var RegularReseauDocu = (function () {
            function RegularReseauDocu(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.NAME = "RegularReseauDocu";
                this.TITLE = "Regular Reseau (=net)";
                this.nbI = 3;
                this.$$$nbI = [3, 5, 7];
                this.oneMoreVertexForOddLine = false;
                this.$$$oneMoreVertexForOddLine = [true, false];
                this.squareMaille = true;
                this.$$$squareMaille = [true, false];
                this.Vj = new mathis.XYZ(0, 0.2, 0);
                this.$$$Vj = new appli.Choices([new mathis.XYZ(0, 0.2, 0), new mathis.XYZ(0.05, 0.2, 0)], { "before": "new mathis.XYZ" });
            }
            RegularReseauDocu.prototype.goForTheFirstTime = function () {
                this.mathisFrame.clearScene();
                this.mathisFrame.addDefaultCamera();
                this.mathisFrame.addDefaultLight();
                this.go();
            };
            RegularReseauDocu.prototype.go = function () {
                this.mathisFrame.clearScene(false, false);
                //$$$begin
                var creator = new mathis.reseau.Regular();
                /** Vi and Vj form the basis of the reseau.
                 * For square net, points are i*Vi + j*Vj
                 * For triangular net, points are :
                 *  i*Vi + (j+decay)*Vj where decay=0.5 when j is odd*/
                creator.nbI = this.nbI;
                creator.nbJ = 4;
                creator.Vi = new mathis.XYZ(0.2, 0, 0);
                creator.Vj = this.Vj;
                creator.origine = new mathis.XYZ(-0.7, -0.7, 0);
                //n
                creator.squareVersusTriangleMaille = this.squareMaille;
                /**true-> square net, false->triangular net*/
                creator.oneMoreVertexForOddLine = this.oneMoreVertexForOddLine;
                //n
                var mamesh = creator.go();
                //$$$end
                //$$$bh visualization
                new mathis.visu3d.VerticesViewer(mamesh, this.mathisFrame.scene).go();
                new mathis.visu3d.LinksViewer(mamesh, this.mathisFrame.scene).go();
                new mathis.visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene).go();
                //$$$eh
                //$$$bt
                this._nbVertices = mamesh.vertices.length;
                this._nbSquares = mamesh.smallestSquares.length;
                this._nbTriangles = mamesh.smallestTriangles.length;
                //$$$et
            };
            return RegularReseauDocu;
        }());
        var RegularBasisDocu = (function () {
            function RegularBasisDocu(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.NAME = "RegularBasisDocu";
                this.TITLE = "Often we want to draw a reseau which starts from an given point, ends at a given point. So we can use the class which compute the right  Basis (ie: the rights kVi and Vj) ";
                this.nbI = 3;
                this.$$$nbI = new appli.Choices([3, 5, 7]);
                this.squareMaille = true;
                this.$$$squareMaille = new appli.Choices([true, false]);
                this.end = new mathis.XYZ(0.7, 0.7, 0);
                this.$$$end = new appli.Choices([new mathis.XYZ(0.7, 0.7, 0), new mathis.XYZ(0, 0, 0), new mathis.XYZ(0.5, 1, 0)], { "before": "new mathis.XYZ" });
                this.setNBJ = true;
                this.$$$setNBJ = [true, false];
            }
            RegularBasisDocu.prototype.goForTheFirstTime = function () {
                this.mathisFrame.clearScene();
                this.mathisFrame.addDefaultCamera();
                this.mathisFrame.addDefaultLight();
                this.go();
            };
            RegularBasisDocu.prototype.go = function () {
                this.mathisFrame.clearScene(false, false);
                //$$$begin
                var basis = new mathis.reseau.BasisForRegularReseau();
                basis.nbI = this.nbI;
                /**if true: nbJ is computed to obtain regular triangle/square*/
                basis.set_nbJ_toHaveRegularReseau = this.setNBJ;
                /**if previous is true, the next affectation is useless*/
                basis.nbJ = 4;
                basis.origin = new mathis.XYZ(-0.7, -0.7, 0);
                basis.end = this.end;
                basis.squareMailleInsteadOfTriangle = this.squareMaille;
                //n
                var creator = new mathis.reseau.Regular(basis);
                //n
                var mamesh = creator.go();
                //$$$end
                //$$$bt
                this._nbVertices = mamesh.vertices.length;
                //$$$et
                //$$$bh visualization
                new mathis.visu3d.VerticesViewer(mamesh, this.mathisFrame.scene).go();
                new mathis.visu3d.LinksViewer(mamesh, this.mathisFrame.scene).go();
                new mathis.visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene).go();
                //$$$eh
            };
            return RegularBasisDocu;
        }());
        var PolygonalResauDocu = (function () {
            function PolygonalResauDocu(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.nbSides = 7;
                this.$$$nbSides = new appli.Choices([3, 4, 5, 6, 7, 9, 11]);
                this.nbSubdivisionsInARadius = 3;
                this.$$$nbSubdivisionsInARadius = new appli.Choices([1, 2, 3, 4, 5]);
                this.NAME = "PolygonalResauDocu";
                this.TITLE = "Polygonal reseau";
            }
            PolygonalResauDocu.prototype.goForTheFirstTime = function () {
                this.mathisFrame.clearScene();
                this.mathisFrame.addDefaultCamera();
                this.mathisFrame.addDefaultLight();
                this.go();
            };
            PolygonalResauDocu.prototype.go = function () {
                this.mathisFrame.clearScene(false, false);
                //$$$begin
                /**for triangles, with no vertex at the center, use "reseau.TriangulatedTriangle"*/
                var creator = new mathis.reseau.TriangulatedPolygone(this.nbSides);
                creator.nbSubdivisionInARadius = this.nbSubdivisionsInARadius;
                creator.origin = new mathis.XYZ(-1, -1, 0);
                creator.end = new mathis.XYZ(1, 1, 0);
                var mamesh = creator.go();
                //$$$end
                //$$$bt
                this._nbVertices = mamesh.vertices.length;
                //$$$et
                //$$$bh visualization
                new mathis.visu3d.VerticesViewer(mamesh, this.mathisFrame.scene).go();
                new mathis.visu3d.LinksViewer(mamesh, this.mathisFrame.scene).go();
                new mathis.visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene).go();
                //$$$eh
            };
            return PolygonalResauDocu;
        }());
        var Regular3dReseauDocu = (function () {
            function Regular3dReseauDocu(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.NAME = "Regular3dReseauDocu";
                this.TITLE = "A 3d reseau now";
                this.Vj = new mathis.XYZ(0, 0.2, 0);
                this.$$$Vj = new appli.Choices([new mathis.XYZ(0, 0.2, 0), new mathis.XYZ(0.05, 0.2, 0)], { "before": "new mathis.XYZ" });
                this.nbI = 4;
                this.$$$nbI = new appli.Choices([4, 6, 8]);
                this.decayOddStrates = false;
                this.$$$decayOddStrates = new appli.Choices([true, false]);
                this.interStrateMailleAreSquareVersusTriangle = true;
                this.$$$interStrateMailleAreSquareVersusTriangle = new appli.Choices([true, false]);
                this.strateHaveSquareMailleVersusTriangleMaille = true;
                this.$$$strateHaveSquareMailleVersusTriangleMaille = new appli.Choices([true, false]);
            }
            Regular3dReseauDocu.prototype.goForTheFirstTime = function () {
                this.mathisFrame.clearScene();
                this.mathisFrame.addDefaultCamera();
                this.mathisFrame.addDefaultLight();
                this.go();
            };
            Regular3dReseauDocu.prototype.go = function () {
                this.mathisFrame.clearScene(false, false);
                //$$$begin
                var creator = new mathis.reseau.Regular3D();
                creator.nbI = this.nbI;
                creator.nbJ = 4;
                creator.nbK = 5;
                creator.Vi = new mathis.XYZ(0.2, 0, 0);
                creator.Vj = this.Vj;
                creator.Vk = new mathis.XYZ(0, 0, 0.2);
                creator.origine = new mathis.XYZ(-0.7, -0.7, -0.7);
                //n
                creator.decayOddStrates = this.decayOddStrates;
                creator.interStrateMailleAreSquareVersusTriangle = this.interStrateMailleAreSquareVersusTriangle;
                creator.strateHaveSquareMailleVersusTriangleMaille = this.strateHaveSquareMailleVersusTriangleMaille;
                //n
                var mamesh = creator.go();
                //$$$end
                //$$$bt
                this._nbVertices = mamesh.vertices.length;
                this._nbLinks = 0;
                for (var _i = 0, _a = mamesh.vertices; _i < _a.length; _i++) {
                    var vertex = _a[_i];
                    this._nbLinks += vertex.links.length;
                }
                //$$$et
                //$$$bh visualization
                new mathis.visu3d.VerticesViewer(mamesh, this.mathisFrame.scene).go();
                new mathis.visu3d.LinksViewer(mamesh, this.mathisFrame.scene).go();
                new mathis.visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene).go();
                //$$$eh
            };
            return Regular3dReseauDocu;
        }());
    })(appli = mathis.appli || (mathis.appli = {}));
})(mathis || (mathis = {}));
