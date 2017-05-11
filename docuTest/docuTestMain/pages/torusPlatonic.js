var mathis;
(function (mathis) {
    var appli;
    (function (appli) {
        var TorusPlatonicDocu = (function () {
            function TorusPlatonicDocu(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.pageIdAndTitle = "Torus";
                var severalParts = new appli.SeveralParts();
                severalParts.addPart(new BoySurface(this.mathisFrame));
                severalParts.addPart(new TorusPart(this.mathisFrame));
                severalParts.addPart(new TorusPartLines(this.mathisFrame));
                this.severalParts = severalParts;
            }
            TorusPlatonicDocu.prototype.go = function () {
                return this.severalParts.go();
            };
            return TorusPlatonicDocu;
        }());
        appli.TorusPlatonicDocu = TorusPlatonicDocu;
        var BoySurface = (function () {
            function BoySurface(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.NAME = "BoySurface";
                this.TITLE = "The Boy surface";
                this.nbI = 10;
                this.$$$nbI = [5, 10, 20, 30];
                this.nbJ = 10;
                this.$$$nbJ = [5, 10, 20, 30];
            }
            BoySurface.prototype.goForTheFirstTime = function () {
                this.mathisFrame.clearScene();
                this.mathisFrame.addDefaultCamera();
                this.mathisFrame.addDefaultLight();
                this.go();
            };
            BoySurface.prototype.go = function () {
                this.mathisFrame.clearScene(false, false);
                //$$$begin
                /**SUB_generator allow to compute basis (Vi,Vj) of a planar reseau. If no decays,
                 * Vi and Vj are simply computed so that the reseau start at "origine" [default (0,0,0)]
                 * and finish at "end". To see effect of decays, observe ! */
                var generator = new mathis.reseau.BasisForRegularReseau();
                generator.nbI = this.nbI;
                generator.nbJ = this.nbJ;
                generator.origin = new mathis.XYZ(-0.035, -0.035, 0);
                generator.end = new mathis.XYZ(Math.PI, Math.PI, 0);
                //n
                var creator = new mathis.reseau.Regular(generator);
                var mamesh = creator.go();
                //n
                mamesh.vertices.forEach(function (vertex) {
                    var u = vertex.position.x;
                    var v = vertex.position.y;
                    vertex.position.x = 2 / 3. * (Math.cos(u) * Math.cos(2 * v)
                        + Math.sqrt(2) * Math.sin(u) * Math.cos(v)) * Math.cos(u) / (Math.sqrt(2) -
                        Math.sin(2 * u) * Math.sin(3 * v));
                    vertex.position.y = 2 / 3. * (Math.cos(u) * Math.sin(2 * v) -
                        Math.sqrt(2) * Math.sin(u) * Math.sin(v)) * Math.cos(u) / (Math.sqrt(2)
                        - Math.sin(2 * u) * Math.sin(3 * v));
                    vertex.position.z = -Math.sqrt(2) * Math.cos(u) * Math.cos(u) / (Math.sqrt(2) - Math.sin(2 * u) * Math.sin(3 * v));
                    //let S = Math.sin(u)
                });
                //$$$end
                var linksViewer = new mathis.visu3d.LinksViewer(mamesh, this.mathisFrame.scene);
                linksViewer.lateralScalingConstant = 0.02;
                linksViewer.go();
                var surfaceViewer = new mathis.visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene);
                surfaceViewer.alpha = 0.7;
                surfaceViewer.go();
                // let merger=new mameshModification.Merger(mamesh)
                // merger.mergeLink=true
                // merger.goChanging()
                //
                // let oppositeAssocier=new linkModule.OppositeLinkAssocierByAngles(IN_mamesh.vertices)
                // oppositeAssocier.maxAngleToAssociateLinks=Math.PI
                // oppositeAssocier.goChanging()
            };
            return BoySurface;
        }());
        var TorusPart = (function () {
            function TorusPart(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.NAME = "TorusPart";
                this.TITLE = "A twisted torus from a skewed reseau";
                this.nbVerticalDecays = 2;
                this.$$$nbVerticalDecays = [0, 1, 2, 3, 4];
                this.nbHorizontalDecays = 1;
                this.$$$nbHorizontalDecays = [0, 1, 2, 3, 4];
                this.bent = false;
                this.$$$bent = [true, false];
                this.nbI = 5;
                this.$$$nbI = [4, 5, 6, 7, 8];
                this.nbJ = 20;
                this.$$$nbJ = [15, 16, 20, 30];
            }
            TorusPart.prototype.goForTheFirstTime = function () {
                this.mathisFrame.clearScene();
                this.mathisFrame.addDefaultCamera();
                this.mathisFrame.addDefaultLight();
                this.go();
            };
            TorusPart.prototype.go = function () {
                this.mathisFrame.clearScene(false, false);
                //$$$begin
                /**SUB_generator allow to compute basis (Vi,Vj) of a planar reseau. If no decays,
                 * Vi and Vj are simply computed so that the reseau start at "origine" [default (0,0,0)]
                 * and finish at "end". To see effect of decays, observe ! */
                var generator = new mathis.reseau.BasisForRegularReseau();
                generator.nbI = this.nbI;
                generator.nbJ = this.nbJ;
                generator.origin = new mathis.XYZ(0, 0, 0);
                generator.end = new mathis.XYZ(2 * Math.PI, 2 * Math.PI, 0).scale(0.1);
                generator.nbVerticalDecays = this.nbVerticalDecays;
                generator.nbHorizontalDecays = this.nbHorizontalDecays;
                //n
                var creator = new mathis.reseau.Regular(generator);
                var mamesh = creator.go();
                //n
                var bent = this.bent;
                if (bent) {
                    var r_1 = 0.3;
                    var a_1 = 0.75;
                    mamesh.vertices.forEach(function (vertex) {
                        var u = vertex.position.x * 10;
                        var v = vertex.position.y * 10;
                        vertex.position.x = (r_1 * Math.cos(u) + a_1) * Math.cos((v));
                        vertex.position.y = (r_1 * Math.cos(u) + a_1) * Math.sin((v));
                        vertex.position.z = r_1 * Math.sin(u);
                    });
                }
                //$$$end
                var linksViewer = new mathis.visu3d.LinksViewer(mamesh, this.mathisFrame.scene);
                linksViewer.lateralScalingConstant = 0.02;
                linksViewer.go();
                var surfaceViewer = new mathis.visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene);
                surfaceViewer.alpha = 0.7;
                surfaceViewer.go();
                // let merger=new mameshModification.Merger(mamesh)
                // merger.mergeLink=true
                // merger.goChanging()
                //
                // let oppositeAssocier=new linkModule.OppositeLinkAssocierByAngles(IN_mamesh.vertices)
                // oppositeAssocier.maxAngleToAssociateLinks=Math.PI
                // oppositeAssocier.goChanging()
            };
            return TorusPart;
        }());
        var TorusPartLines = (function () {
            function TorusPartLines(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.NAME = "TorusPartLines";
                this.TITLE = "Problem : lines of the flat reseau behave badly on the torus. \nSolution : merge the vertices and remake links";
                this.nbVerticalDecays = 2;
                this.$$$nbVerticalDecays = [0, 1, 2, 3, 4];
                this.nbHorizontalDecays = 1;
                this.$$$nbHorizontalDecays = [0, 1, 2, 3, 4];
                this.bent = true;
                this.$$$bent = [true, false];
                this.merge = false;
                this.$$$merge = [true, false];
                this.nbI = 5;
                this.$$$nbI = [4, 5, 6, 7, 8];
                this.nbJ = 20;
                this.$$$nbJ = [15, 16, 20, 30];
                this.interpolationStyle = mathis.geometry.InterpolationStyle.hermite;
                this.$$$interpolationStyle = new appli.Choices([mathis.geometry.InterpolationStyle.none, mathis.geometry.InterpolationStyle.octavioStyle, mathis.geometry.InterpolationStyle.hermite], { 'before': 'geometry.InterpolationStyle.', 'visualValues': ['none', 'octavioStyle', 'hermite'] });
            }
            TorusPartLines.prototype.goForTheFirstTime = function () {
                this.mathisFrame.clearScene();
                this.mathisFrame.addDefaultCamera();
                this.mathisFrame.addDefaultLight();
                this.go();
            };
            TorusPartLines.prototype.go = function () {
                this.mathisFrame.clearScene(false, false);
                //$$$begin
                var generator = new mathis.reseau.BasisForRegularReseau();
                generator.nbI = this.nbI;
                generator.nbJ = this.nbJ;
                generator.origin = new mathis.XYZ(0, 0, 0);
                generator.end = new mathis.XYZ(2 * Math.PI, 2 * Math.PI, 0).scale(0.1);
                generator.nbVerticalDecays = this.nbVerticalDecays;
                generator.nbHorizontalDecays = this.nbHorizontalDecays;
                var creator = new mathis.reseau.Regular(generator);
                var mamesh = creator.go();
                //n
                var bent = this.bent;
                if (bent) {
                    var r_2 = 0.3;
                    var a_2 = 0.75;
                    mamesh.vertices.forEach(function (vertex) {
                        var u = vertex.position.x * 10;
                        var v = vertex.position.y * 10;
                        vertex.position.x = (r_2 * Math.cos(u) + a_2) * Math.cos((v));
                        vertex.position.y = (r_2 * Math.cos(u) + a_2) * Math.sin((v));
                        vertex.position.z = r_2 * Math.sin(u);
                    });
                    var merge = this.merge;
                    if (merge) {
                        var merger = new mathis.grateAndGlue.Merger(mamesh, null, null);
                        merger.mergeLink = true;
                        merger.goChanging();
                        var oppositeAssocier = new mathis.linkModule.OppositeLinkAssocierByAngles(mamesh.vertices);
                        oppositeAssocier.maxAngleToAssociateLinks = Math.PI;
                        oppositeAssocier.goChanging();
                    }
                }
                var interpolationStyle = this.interpolationStyle;
                //$$$end
                //$$$bh visualization
                var lineViewer = new mathis.visu3d.LinesViewer(mamesh, this.mathisFrame.scene);
                lineViewer.interpolationOption.interpolationStyle = interpolationStyle;
                lineViewer.go();
                //$$$eh
            };
            return TorusPartLines;
        }());
    })(appli = mathis.appli || (mathis.appli = {}));
})(mathis || (mathis = {}));
