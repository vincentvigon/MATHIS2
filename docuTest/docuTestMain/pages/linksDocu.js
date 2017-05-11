/**
 * Created by vigon on 15/12/2016.
 */
var mathis;
(function (mathis) {
    var appli;
    (function (appli) {
        var LinksDocu = (function () {
            function LinksDocu(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.pageIdAndTitle = "Simple links and opposite links";
                var several = new appli.SeveralParts();
                several.addPart(new AutomaticLink(this.mathisFrame));
                several.addPart(new AutomaticPolygonLink(this.mathisFrame));
                several.addPart(new WhatAreLinks(this.mathisFrame));
                several.addPart(new WhatAreOppositeLinks(this.mathisFrame));
                this.severalParts = several;
            }
            LinksDocu.prototype.go = function () {
                return this.severalParts.go();
            };
            return LinksDocu;
        }());
        appli.LinksDocu = LinksDocu;
        var WhatAreLinks = (function () {
            function WhatAreLinks(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.NAME = "WhatAreLinks";
                this.TITLE = "Several ways to create manually links (without association of opposite)";
                this.technicChoice = 0;
                this.$$$technicChoice = [0, 1, 2];
                this.mathisFrame = mathisFrame;
            }
            WhatAreLinks.prototype.goForTheFirstTime = function () {
                this.mathisFrame.clearScene();
                this.mathisFrame.addDefaultCamera();
                this.mathisFrame.addDefaultLight();
                var camera = this.mathisFrame.getGrabberCamera();
                camera.changePosition(new mathis.XYZ(0, 0, -5));
                this.go();
            };
            WhatAreLinks.prototype.go = function () {
                this.mathisFrame.clearScene(false, false);
                //$$$bh vertices creation
                /**let's create vertices*/
                var vertex0 = new mathis.Vertex().setPosition(-1, -1, 0);
                var vertex1 = new mathis.Vertex().setPosition(-1, 1, 0);
                var vertex2 = new mathis.Vertex().setPosition(0, 1.5, 0);
                var vertex3 = new mathis.Vertex().setPosition(0, -0.5, 0);
                var vertex4 = new mathis.Vertex().setPosition(1, -1, 0);
                var vertex5 = new mathis.Vertex().setPosition(1, 1, 0);
                //$$$eh
                //$$$begin
                /**let's make a mamesh with 2 triangles, 1 rectangle*/
                var mamesh = new mathis.Mamesh();
                mamesh.vertices.push(vertex0, vertex1, vertex2, vertex3, vertex4, vertex5);
                mamesh.addATriangle(vertex0, vertex2, vertex1).addATriangle(vertex0, vertex3, vertex2);
                mamesh.addASquare(vertex2, vertex3, vertex4, vertex5);
                //n
                var technicChoice = this.technicChoice;
                if (technicChoice == 0) {
                    /**automatic creation using polygons */
                    mamesh.addSimpleLinksAroundPolygons();
                }
                else if (technicChoice == 1) {
                    /**we only create 2 links
                     * To create a link between two vertices, you have to inform both of them that they are linked  */
                    vertex2.setOneLink(vertex1).setOneLink(vertex5);
                    vertex1.setOneLink(vertex2);
                    vertex5.setOneLink(vertex2);
                }
                else if (technicChoice == 2) {
                    /**quick and direct technique :  no verification is done.  */
                    vertex0.links.push(new mathis.Link(vertex1), new mathis.Link(vertex2));
                    vertex1.links.push(new mathis.Link(vertex0));
                    vertex2.links.push(new mathis.Link(vertex0));
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
                this._nbLinks = 0;
                for (var _i = 0, _a = mamesh.vertices; _i < _a.length; _i++) {
                    var vertex = _a[_i];
                    this._nbLinks += vertex.links.length;
                }
                //$$$et
            };
            return WhatAreLinks;
        }());
        var WhatAreOppositeLinks = (function () {
            function WhatAreOppositeLinks(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.NAME = "WhatAreOppositeLinks";
                this.TITLE = "several ways to associate manually opposite links";
                this.technicChoice = 0;
                this.$$$technicChoice = [0, 1, 2];
                this.mathisFrame = mathisFrame;
            }
            WhatAreOppositeLinks.prototype.goForTheFirstTime = function () {
                this.mathisFrame.clearScene();
                this.mathisFrame.addDefaultCamera();
                this.mathisFrame.addDefaultLight();
                var camera = this.mathisFrame.getGrabberCamera();
                camera.changePosition(new mathis.XYZ(0, 0, -5));
                this.go();
            };
            WhatAreOppositeLinks.prototype.go = function () {
                this.mathisFrame.clearScene(false, false);
                //$$$bh vertices creation
                /**let's create vertices*/
                var vertex0 = new mathis.Vertex().setPosition(-1, -1, 0);
                var vertex1 = new mathis.Vertex().setPosition(-1, 1, 0);
                var vertex2 = new mathis.Vertex().setPosition(0, 1.5, 0);
                var vertex3 = new mathis.Vertex().setPosition(0, -0.5, 0);
                var vertex4 = new mathis.Vertex().setPosition(1, -1, 0);
                var vertex5 = new mathis.Vertex().setPosition(1, 1, 0);
                //$$$eh
                //$$$begin
                /**let's make a mamesh with 2 triangles, 1 rectangle*/
                var mamesh = new mathis.Mamesh();
                mamesh.vertices.push(vertex0, vertex1, vertex2, vertex3, vertex4, vertex5);
                mamesh.addATriangle(vertex0, vertex2, vertex1).addATriangle(vertex0, vertex3, vertex2);
                mamesh.addASquare(vertex2, vertex3, vertex4, vertex5);
                //n
                var technicChoice = this.technicChoice;
                if (technicChoice == 0) {
                    /**automatic creation using polygons (see further, for more details)*/
                    mamesh.addOppositeLinksAroundPolygons();
                }
                else if (technicChoice == 1) {
                    /**we only create 2 links
                     * To create a link between two vertices, you have to inform both of them that they are linked  */
                    vertex3.setTwoOppositeLinks(vertex0, vertex4);
                    vertex0.setOneLink(vertex3);
                    vertex4.setOneLink(vertex3);
                }
                else if (technicChoice == 2) {
                    /**direct technique (to understand the underlying data structure)*/
                    var link2_1 = new mathis.Link(vertex1);
                    var link2_5 = new mathis.Link(vertex5);
                    link2_1.opposites = [link2_5];
                    link2_5.opposites = [link2_1];
                    vertex2.links.push(link2_1, link2_5);
                    vertex1.links.push(new mathis.Link(vertex2));
                    vertex5.links.push(new mathis.Link(vertex2));
                }
                //$$$end
                //$$$bh visualization
                var verticesViewer = new mathis.visu3d.VerticesViewer(mamesh, this.mathisFrame.scene);
                verticesViewer.go();
                var linksViewer = new mathis.visu3d.LinesViewer(mamesh, this.mathisFrame.scene);
                linksViewer.go();
                var surfaceViewer = new mathis.visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene);
                surfaceViewer.go();
                //$$$eh
                //$$$bt
                this._nbLines = mamesh.lines.length;
                //$$$et
            };
            return WhatAreOppositeLinks;
        }());
        var AutomaticLink = (function () {
            function AutomaticLink(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.NAME = "AutomaticLink";
                this.TITLE = "We create some random links. Then we associate opposite-links using an automatic process based on angles. " +
                    "This can create bifurcation";
                // technicChoice=0
                // $$$technicChoice=[0,1,2]
                this.createBifurcation = true;
                this.$$$createBifurcation = [true, false];
                this.nbLinks = 30;
                this.$$$nbLinks = [20, 30, 50, 100];
                this.maxAngleToAssociateLinks = Math.PI * 0.3;
                this.$$$maxAngleToAssociateLinks = new appli.Choices([Math.PI * 0.1, Math.PI * 0.3, Math.PI * 0.5, Math.PI * 0.8], { visualValues: ['PI*0.1', 'PI*0.3', 'PI*0.5', 'PI*0.8'] });
                this.mathisFrame = mathisFrame;
            }
            AutomaticLink.prototype.goForTheFirstTime = function () {
                this.mathisFrame.clearScene();
                this.mathisFrame.addDefaultCamera();
                this.mathisFrame.addDefaultLight();
                var camera = this.mathisFrame.getGrabberCamera();
                camera.changePosition(new mathis.XYZ(0, 0, -5));
                this.go();
            };
            AutomaticLink.prototype.go = function () {
                this.mathisFrame.clearScene(false, false);
                //$$$begin
                /**let's create vertices*/
                var basis = new mathis.reseau.BasisForRegularReseau();
                basis.nbI = 8;
                basis.nbJ = 8;
                var creator = new mathis.reseau.Regular(basis);
                creator.makeLinks = false;
                creator.makeTriangleOrSquare = false;
                var mamesh = creator.go();
                var nbLinks = this.nbLinks;
                /** pseudo random generator. The seed is fixed to have
                 * always the same sequence */
                var seed = 46765474657;
                var random = new mathis.proba.Random(seed);
                var count = 0;
                while (count < nbLinks) {
                    var vertex0 = mamesh.vertices[random.pseudoRandInt(mamesh.vertices.length)];
                    var vertex1 = mamesh.vertices[random.pseudoRandInt(mamesh.vertices.length)];
                    if (Math.abs(vertex0.param.x - vertex1.param.x) == 1 && Math.abs(vertex0.param.y - vertex1.param.y) < 3) {
                        vertex0.setOneLink(vertex1);
                        vertex1.setOneLink(vertex0);
                        count++;
                    }
                }
                var maxAngleToAssociateLinks = this.maxAngleToAssociateLinks;
                var associer = new mathis.linkModule.OppositeLinkAssocierByAngles(mamesh.vertices);
                associer.canCreateBifurcations = this.createBifurcation;
                associer.maxAngleToAssociateLinks = maxAngleToAssociateLinks;
                associer.goChanging();
                //$$$end
                //$$$bh visualization
                /**if we made bifurcation, we make a colorIndex in order that two bifurcating lines have the same color*/
                var linesViewer = new mathis.visu3d.LinesViewer(mamesh, this.mathisFrame.scene);
                if (associer.canCreateBifurcations) {
                    mamesh.fillLineCatalogue();
                    var lineIndexer = new mathis.lineModule.CreateAColorIndexRespectingBifurcationsAndSymmetries(mamesh);
                    linesViewer.lineToLevel = lineIndexer.go();
                }
                linesViewer.constantRadius = 0.01;
                linesViewer.go();
                var verticesViewer = new mathis.visu3d.VerticesViewer(mamesh, this.mathisFrame.scene);
                verticesViewer.constantRadius = 0.03;
                verticesViewer.go();
                //$$$eh
                //$$$bt
                this._nbColor = mathis.tab.maxValue(linesViewer.lineToLevel.allValues()) + 1; //+1 because start at 0
                this._nbLines = mamesh.lines.length;
                //$$$et
                // let surfaceViewer=new visu3d.SurfaceViewer(mamesh,this.mathisFrame.scene)
                // surfaceViewer.go()
            };
            return AutomaticLink;
        }());
        var AutomaticPolygonLink = (function () {
            function AutomaticPolygonLink(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.NAME = "AutomaticPolygonLink";
                this.TITLE = "We associate opposite-links using an automatic process based on polygons.";
                this.seed = 3534;
                this.$$$seed = [3534, 7654, 909123, 58912307];
                this.squareMailleInsteadOfTriangle = true;
                this.$$$squareMailleInsteadOfTriangle = [true, false];
                this.randomization = true;
                this.$$$randomization = [true, false];
                this.mathisFrame = mathisFrame;
            }
            AutomaticPolygonLink.prototype.goForTheFirstTime = function () {
                this.mathisFrame.clearScene();
                this.mathisFrame.addDefaultCamera();
                this.mathisFrame.addDefaultLight();
                var camera = this.mathisFrame.getGrabberCamera();
                camera.changePosition(new mathis.XYZ(0, 0, -5));
                this.go();
            };
            AutomaticPolygonLink.prototype.go = function () {
                this.mathisFrame.clearScene(false, false);
                //$$$begin
                /**let's create vertices*/
                var basis = new mathis.reseau.BasisForRegularReseau();
                basis.nbI = 5;
                basis.nbJ = 5;
                basis.squareMailleInsteadOfTriangle = this.squareMailleInsteadOfTriangle;
                var creator = new mathis.reseau.Regular(basis);
                /**we intentionally forget to create links*/
                creator.makeLinks = false;
                var mamesh = creator.go();
                /**we perturbate a lot the reseau*/
                if (this.randomization) {
                    var seed = this.seed;
                    var random = new mathis.proba.Random(seed);
                    for (var i = 0; i < mamesh.vertices.length; i++) {
                        mamesh.vertices[i].position.add(new mathis.XYZ(random.pseudoRand(), random.pseudoRand(), random.pseudoRand()).scale(0.25));
                    }
                }
                /**first we add simple links. Easy work*/
                mamesh.addSimpleLinksAroundPolygons();
                /**now we associate opposite links (more complex algorithm)*/
                var process = new mathis.linkModule.LinkCreaterSorterAndBorderDetecterByPolygons(mamesh);
                process.goChanging();
                //$$$end
                //$$$bh visualization
                var verticesViewer = new mathis.visu3d.VerticesViewer(mamesh, this.mathisFrame.scene);
                verticesViewer.constantRadius = 0.05;
                verticesViewer.go();
                var linesViewer = new mathis.visu3d.LinesViewer(mamesh, this.mathisFrame.scene);
                linesViewer.constantRadius = 0.02;
                linesViewer.go();
                new mathis.visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene).go();
                //$$$eh
                //$$$bt
                this._nbLines = mamesh.lines.length;
                //$$$et
                // let surfaceViewer=new visu3d.SurfaceViewer(mamesh,this.mathisFrame.scene)
                // surfaceViewer.go()
            };
            return AutomaticPolygonLink;
        }());
    })(appli = mathis.appli || (mathis.appli = {}));
})(mathis || (mathis = {}));
