/**
 * Created by vigon on 19/11/2016.
 */
var mathis;
(function (mathis) {
    var appli;
    (function (appli) {
        var BasicDocu = (function () {
            function BasicDocu(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.pageIdAndTitle = "Mameshes, vertices, links and lines";
                var several = new appli.SeveralParts();
                several.addPart(new SimpleMamesh(this.mathisFrame));
                several.addPart(new SimpleMameshLine(this.mathisFrame));
                several.addPart(new LineDocu(this.mathisFrame));
                this.severalParts = several;
            }
            BasicDocu.prototype.go = function () {
                return this.severalParts.go();
            };
            return BasicDocu;
        }());
        appli.BasicDocu = BasicDocu;
        var SimpleMamesh = (function () {
            function SimpleMamesh(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.NAME = "SimpleMamesh";
                this.TITLE = "A simple Mamesh with polygons and links";
                this.link = true;
                this.$$$link = new appli.Choices([true, false]);
                this._nbLinks = 0;
                this.mathisFrame = mathisFrame;
            }
            SimpleMamesh.prototype.goForTheFirstTime = function () {
                this.mathisFrame.clearScene();
                this.mathisFrame.addDefaultCamera();
                this.mathisFrame.addDefaultLight();
                var camera = this.mathisFrame.getGrabberCamera();
                camera.changePosition(new mathis.XYZ(0, 0, -5));
                this.go();
            };
            SimpleMamesh.prototype.go = function () {
                this.mathisFrame.clearScene(false, false);
                //$$$begin
                var addLinks = this.link;
                /**let's create vertices*/
                var vertex0 = new mathis.Vertex().setPosition(-1, -1, 0);
                var vertex1 = new mathis.Vertex().setPosition(-1, 1, 0);
                var vertex2 = new mathis.Vertex().setPosition(0, 1.5, 0);
                var vertex3 = new mathis.Vertex().setPosition(0, -0.5, 0);
                var vertex4 = new mathis.Vertex().setPosition(1, -1, 0);
                var vertex5 = new mathis.Vertex().setPosition(1, 1, 0);
                //n
                /**let's make a mamesh with 2 triangles, 1 rectangle*/
                var mamesh = new mathis.Mamesh();
                mamesh.vertices.push(vertex0, vertex1, vertex2, vertex3, vertex4, vertex5);
                mamesh.addATriangle(vertex0, vertex2, vertex1).addATriangle(vertex0, vertex3, vertex2);
                mamesh.addASquare(vertex2, vertex3, vertex4, vertex5);
                //n
                /**automatic creation of links between vertex */
                if (addLinks) {
                    mamesh.addSimpleLinksAroundPolygons();
                }
                //$$$end
                //$$$bh visualization
                var verticesViewer = new mathis.visu3d.VerticesViewer(mamesh, this.mathisFrame.scene);
                verticesViewer.go();
                var linksViewer = new mathis.visu3d.LinksViewer(mamesh, this.mathisFrame.scene);
                linksViewer.go();
                var surfaceViewer = new mathis.visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene);
                surfaceViewer.go();
                //$$$eh
                //$$$bt
                var nbLinks = 0;
                for (var _i = 0, _a = mamesh.vertices; _i < _a.length; _i++) {
                    var vertex = _a[_i];
                    nbLinks += vertex.links.length;
                }
                this._nbLinks = nbLinks;
                //$$$et
            };
            return SimpleMamesh;
        }());
        var SimpleMameshLine = (function () {
            function SimpleMameshLine(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.NAME = "SimpleMameshLine";
                this.TITLE = "the same mamesh, but we also add lines";
                this.link = true;
                this.$$$link = new appli.Choices([true, false]);
                this._nbLines = 0;
                this.mathisFrame = mathisFrame;
            }
            SimpleMameshLine.prototype.goForTheFirstTime = function () {
                this.mathisFrame.clearScene();
                this.mathisFrame.addDefaultCamera();
                this.mathisFrame.addDefaultLight();
                var camera = this.mathisFrame.getGrabberCamera();
                camera.changePosition(new mathis.XYZ(0, 0, -5));
                this.go();
            };
            SimpleMameshLine.prototype.go = function () {
                this.mathisFrame.clearScene(false, false);
                //$$$bh mamesh creation
                /**let's create vertices*/
                var vertex0 = new mathis.Vertex().setPosition(-1, -1, 0);
                var vertex1 = new mathis.Vertex().setPosition(-1, 1, 0);
                var vertex2 = new mathis.Vertex().setPosition(0, 1.5, 0);
                var vertex3 = new mathis.Vertex().setPosition(0, -0.5, 0);
                var vertex4 = new mathis.Vertex().setPosition(1, -1, 0);
                var vertex5 = new mathis.Vertex().setPosition(1, 1, 0);
                //n
                /**let's make a mamesh with 2 triangles, 1 rectangle*/
                var mamesh = new mathis.Mamesh();
                mamesh.vertices.push(vertex0, vertex1, vertex2, vertex3, vertex4, vertex5);
                mamesh.addATriangle(vertex0, vertex2, vertex1).addATriangle(vertex0, vertex3, vertex2);
                mamesh.addASquare(vertex2, vertex3, vertex4, vertex5);
                //$$$eh
                //$$$begin
                /**automatic creation of links between vertex */
                var addOppositeLinks = this.link;
                if (addOppositeLinks) {
                    /**some natural opposition are made between links.
                     * Line are constructed following links in oppositions. */
                    mamesh.addOppositeLinksAroundPolygons();
                }
                else {
                    mamesh.addSimpleLinksAroundPolygons();
                }
                //$$$end
                //$$$bh visualization
                var verticesViewer = new mathis.visu3d.VerticesViewer(mamesh, this.mathisFrame.scene);
                verticesViewer.go();
                if (addOppositeLinks) {
                    /**to hide the famous bug*/
                    new mathis.spacialTransformations.Similitude(mamesh.vertices, 0.001).goChanging();
                    var lineViewer = new mathis.visu3d.LinesViewer(mamesh, this.mathisFrame.scene);
                    //lineViewer.interpolationOption.interpolationStyle=geometry.InterpolationStyle.none
                    lineViewer.go();
                }
                else {
                    var linksViewer = new mathis.visu3d.LinksViewer(mamesh, this.mathisFrame.scene);
                    linksViewer.go();
                }
                var surfaceViewer = new mathis.visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene);
                surfaceViewer.go();
                //$$$eh
                //$$$bt
                mamesh.fillLineCatalogue();
                this._nbLines = mamesh.lines.length;
                //$$$et
            };
            return SimpleMameshLine;
        }());
        var LineDocu = (function () {
            function LineDocu(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.NAME = "LineDocu";
                this.TITLE = "Defining lines joining vertices";
                this.makeLoop = false;
                this.$$$makeLoop = new appli.Choices([true, false]);
                this.nb = 9;
                this.$$$nb = new appli.Choices([5, 7, 9, 15]);
                this.interpolationStyle = mathis.geometry.InterpolationStyle.octavioStyle;
                this.$$$interpolationStyle = new appli.Choices(mathis.allIntegerValueOfEnume(mathis.geometry.InterpolationStyle), { "before": "geometry.InterpolationStyle.", "visualValues": mathis.allStringValueOfEnume(mathis.geometry.InterpolationStyle) });
                this._nbLoopLines = 0;
                this._nbStraightLines = 0;
            }
            LineDocu.prototype.goForTheFirstTime = function () {
                this.mathisFrame.clearScene();
                this.mathisFrame.addDefaultCamera();
                this.mathisFrame.addDefaultLight();
                this.go();
            };
            LineDocu.prototype.go = function () {
                this.mathisFrame.clearScene(false, false);
                //$$$begin
                var makeLoop = this.makeLoop;
                var interpolationStyle = this.interpolationStyle;
                var nb = this.nb;
                var mamesh = new mathis.Mamesh();
                for (var i = 0; i < nb; i++) {
                    var vertex = new mathis.Vertex();
                    var angle = 2 * Math.PI * i / (nb);
                    vertex.position = new mathis.XYZ(Math.cos(angle), Math.sin(angle), 0);
                    mamesh.vertices.push(vertex);
                }
                for (var i = 1; i < nb - 1; i++) {
                    /**create two links and and inform both of them that they are opposite */
                    mamesh.vertices[i].setTwoOppositeLinks(mamesh.vertices[i - 1], mamesh.vertices[i + 1]);
                }
                if (makeLoop) {
                    mamesh.vertices[0].setTwoOppositeLinks(mamesh.vertices[1], mamesh.vertices[nb - 1]);
                    mamesh.vertices[nb - 1].setTwoOppositeLinks(mamesh.vertices[nb - 2], mamesh.vertices[0]);
                }
                else {
                    mamesh.vertices[0].setOneLink(mamesh.vertices[1]);
                    mamesh.vertices[nb - 1].setOneLink(mamesh.vertices[nb - 2]);
                }
                //$$$end
                //$$$bh visualization
                var linesViewer = new mathis.visu3d.LinesViewer(mamesh, this.mathisFrame.scene);
                linesViewer.interpolationOption.interpolationStyle = interpolationStyle;
                linesViewer.interpolationOption.loopLine = makeLoop;
                linesViewer.go();
                new mathis.visu3d.VerticesViewer(mamesh, this.mathisFrame.scene).go();
                //$$$eh
                //$$$bt
                this._nbLoopLines = 0;
                this._nbStraightLines = 0;
                for (var _i = 0, _a = mamesh.lines; _i < _a.length; _i++) {
                    var line = _a[_i];
                    if (line.isLoop)
                        this._nbLoopLines++;
                    else
                        this._nbStraightLines++;
                }
                //$$$et
            };
            return LineDocu;
        }());
    })(appli = mathis.appli || (mathis.appli = {}));
})(mathis || (mathis = {}));
