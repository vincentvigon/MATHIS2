/**
 * Created by vigon on 05/01/2017.
 */
/**
 * Created by vigon on 22/12/2016.
 */
/**
 * Created by vigon on 21/11/2016.
 */
var mathis;
(function (mathis) {
    var appli;
    (function (appli) {
        var SurfaceViewerDocu = (function () {
            function SurfaceViewerDocu(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.pageIdAndTitle = "Surface viewing";
                var severalParts = new appli.SeveralParts();
                severalParts.addPart(new BackFaceCullingDocu(this.mathisFrame));
                severalParts.addPart(new DuplicateNormalDocu(this.mathisFrame));
                severalParts.addPart(new MoebiusBandDocu(this.mathisFrame));
                this.severalParts = severalParts;
            }
            SurfaceViewerDocu.prototype.go = function () {
                return this.severalParts.go();
            };
            return SurfaceViewerDocu;
        }());
        appli.SurfaceViewerDocu = SurfaceViewerDocu;
        var BackFaceCullingDocu = (function () {
            function BackFaceCullingDocu(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.NAME = "BackFaceCullingDocu";
                this.TITLE = "We observe the effect of the side orientation and the back-face-culling";
                this.alpha = 0.5;
                this.$$$alpha = [0.1, 0.3, 0.5, 0.8, 1];
                this.color = mathis.Color.names.rebeccapurple;
                this.$$$color = new appli.Choices([mathis.Color.names.rebeccapurple, mathis.Color.names.rosybrown, mathis.Color.names.darkorange], { 'before': 'Color.names.', 'visualValues': ['rebeccapurple', 'rosybrown', 'darkorange'] });
                this.backFaceCulling = true;
                this.$$$backFaceCulling = [true, false];
                this.sideOrientation = BABYLON.Mesh.FRONTSIDE;
                this.$$$sideOrientation = new appli.Choices([BABYLON.Mesh.DOUBLESIDE, BABYLON.Mesh.BACKSIDE, BABYLON.Mesh.FRONTSIDE], { 'visualValues': ['DOUBLESIDE', 'BACKSIDE', 'FRONTSIDE'], 'before': 'BABYLON.Mesh.' });
                this.toIncludeAtTheBeginOfTheFirstHiddenPiece = ["var mathisFrame=new mathis.MathisFrame()", "/**back the camera*/", "this.mathisFrame.getGrabberCamera().changePosition(new XYZ(0,0,-7))"];
            }
            BackFaceCullingDocu.prototype.goForTheFirstTime = function () {
                this.mathisFrame.clearScene();
                this.mathisFrame.addDefaultCamera();
                this.mathisFrame.addDefaultLight();
                this.mathisFrame.getGrabberCamera().changePosition(new mathis.XYZ(0, 0, -7));
                this.go();
            };
            BackFaceCullingDocu.prototype.go = function () {
                this.mathisFrame.clearScene(false, false);
                //$$$begin
                var creator = new mathis.reseau.TriangulatedPolygone(10);
                creator.nbSubdivisionInARadius = 5;
                creator.origin = new mathis.XYZ(-Math.PI * 0.8, -1, 0);
                creator.end = new mathis.XYZ(+Math.PI * 0.8, 1, 0);
                var mamesh = creator.go();
                for (var _i = 0, _a = mamesh.vertices; _i < _a.length; _i++) {
                    var vertex = _a[_i];
                    var u = vertex.position.x;
                    var v = vertex.position.y;
                    vertex.position.x = Math.cos(u);
                    vertex.position.y = Math.sin(u);
                    vertex.position.z = v;
                }
                var positioning = new mathis.Positioning();
                positioning.frontDir.copyFromFloats(1, 0, 1);
                positioning.applyToVertices(mamesh.vertices);
                new mathis.visu3d.LinksViewer(mamesh, this.mathisFrame.scene).go();
                var surfaceViewer = new mathis.visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene);
                surfaceViewer.alpha = this.alpha;
                surfaceViewer.color = new mathis.Color(this.color);
                /**best choice is : backFaceCulling=true and sideOrientation=DOUBLESIDE (if you want to see both-sides of your surface).
                 * When backFaceCulling=false, the transparency of your surface depend of the sideOrientation. If it is DOUBLESIDE, you see in the same time both faces,
                 * so transparency is degraded*/
                surfaceViewer.backFaceCulling = this.backFaceCulling;
                surfaceViewer.sideOrientation = this.sideOrientation;
                surfaceViewer.go();
                //$$$end
            };
            return BackFaceCullingDocu;
        }());
        var DuplicateNormalDocu = (function () {
            function DuplicateNormalDocu(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.NAME = "DuplicateNormalDocu";
                this.TITLE = "WebGL need normals to reflect light. But, what a pity, normal was positioned at points (while mathematically, a better choice would be to put one normal per triangle)." +
                    "So if you want to see sharp angle, you have du duplicate points in order to duplicate normals. ";
                this.alpha = 1;
                this.$$$alpha = [0.1, 0.3, 0.5, 0.8, 1];
                // color=Color.names.rebeccapurple
                // $$$color=new Choices([Color.names.rebeccapurple,Color.names.rosybrown,Color.names.darkorange],
                //     {'before':'Color.names.','visualValues':['rebeccapurple','rosybrown','darkorange']})
                this.backFaceCulling = true;
                this.$$$backFaceCulling = [true, false];
                this.sideOrientation = BABYLON.Mesh.DOUBLESIDE;
                this.$$$sideOrientation = new appli.Choices([BABYLON.Mesh.DOUBLESIDE, BABYLON.Mesh.BACKSIDE, BABYLON.Mesh.FRONTSIDE], { 'visualValues': ['DOUBLESIDE', 'BACKSIDE', 'FRONTSIDE'], 'before': 'BABYLON.Mesh.' });
                this.toIncludeAtTheBeginOfTheFirstHiddenPiece = ["var mathisFrame=new mathis.MathisFrame()", "/**back the camera*/", "this.mathisFrame.getGrabberCamera().changePosition(new XYZ(0,0,-7))"];
                this.letBabylonDoTheJob = false;
                this.$$$letBabylonDoTheJob = [true, false];
                this.normalDuplication = mathis.visu3d.NormalDuplication.duplicateVertex;
                this.$$$normalDuplication = new appli.Choices(mathis.allIntegerValueOfEnume(mathis.visu3d.NormalDuplication), { 'visualValues': mathis.allStringValueOfEnume(mathis.visu3d.NormalDuplication), 'before': 'visu3d.NormalDuplication.' });
            }
            DuplicateNormalDocu.prototype.goForTheFirstTime = function () {
                this.mathisFrame.clearScene();
                this.mathisFrame.addDefaultCamera();
                this.mathisFrame.addDefaultLight();
                this.mathisFrame.getGrabberCamera().changePosition(new mathis.XYZ(0, 0, -7));
                this.go();
            };
            DuplicateNormalDocu.prototype.go = function () {
                this.mathisFrame.clearScene(false, false);
                //$$$begin
                var creator = new mathis.polyhedron.Polyhedron("PentagonalDipyramid");
                var mamesh = creator.go();
                var surfaceViewer = new mathis.visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene);
                /** with none : the diPyramid seem smooth.*/
                surfaceViewer.normalDuplication = this.normalDuplication;
                /**only useful for the option duplicateOnlyWhenNormalsAreTooFarr*/
                surfaceViewer.maxAngleBetweenNormals = Math.PI / 6;
                surfaceViewer.backFaceCulling = this.backFaceCulling;
                surfaceViewer.sideOrientation = this.sideOrientation;
                surfaceViewer.alpha = this.alpha;
                var babylonMesh = surfaceViewer.go();
                /** we can ask to BABYLON to duplicate normals. But in this case put surfaceViewer.normalDuplication to 'none'
                 * (if not you multiply by 4 the number of normals!).
                 * As far I now, in BABYLON, there is no option : duplicateOnlyWhenNormalsAreTooFarr, which is the default option of our mathis.SurfaceViewer*/
                var letBabylonDoTheJob = this.letBabylonDoTheJob;
                if (letBabylonDoTheJob)
                    babylonMesh.convertToFlatShadedMesh();
                //$$$end
            };
            return DuplicateNormalDocu;
        }());
        var MoebiusBandDocu = (function () {
            function MoebiusBandDocu(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.NAME = "MoebiusBandDocu";
                this.TITLE = "Here is the moebius band, this is a non orientable surface. In this case, to duplicate  normal-vectors have a bad effect at the place where the band is glued ! " +
                    "To see this bad effect, look at the white triangle alternating with red-triangles this is due to the reflection of the specular light";
                this.alpha = 1;
                this.$$$alpha = [0.1, 0.3, 0.5, 0.8, 1];
                // color=Color.names.rebeccapurple
                // $$$color=new Choices([Color.names.rebeccapurple,Color.names.rosybrown,Color.names.darkorange],
                //     {'before':'Color.names.','visualValues':['rebeccapurple','rosybrown','darkorange']})
                this.backFaceCulling = true;
                this.$$$backFaceCulling = [true, false];
                this.sideOrientation = BABYLON.Mesh.DOUBLESIDE;
                this.$$$sideOrientation = new appli.Choices([BABYLON.Mesh.DOUBLESIDE, BABYLON.Mesh.BACKSIDE, BABYLON.Mesh.FRONTSIDE], { 'visualValues': ['DOUBLESIDE', 'BACKSIDE', 'FRONTSIDE'], 'before': 'BABYLON.Mesh.' });
                this.toIncludeAtTheBeginOfTheFirstHiddenPiece = ["var mathisFrame=new mathis.MathisFrame()", "/**back the camera*/", "this.mathisFrame.getGrabberCamera().changePosition(new XYZ(0,0,-7))"];
                this.vertexDuplication = mathis.visu3d.NormalDuplication.duplicateVertex;
                this.$$$vertexDuplication = new appli.Choices(mathis.allIntegerValueOfEnume(mathis.visu3d.NormalDuplication), { 'visualValues': mathis.allStringValueOfEnume(mathis.visu3d.NormalDuplication), 'before': 'visu3d.NormalDuplication.' });
            }
            MoebiusBandDocu.prototype.goForTheFirstTime = function () {
                this.mathisFrame.clearScene();
                this.mathisFrame.addDefaultCamera();
                this.mathisFrame.addDefaultLight();
                this.mathisFrame.getGrabberCamera().changePosition(new mathis.XYZ(0, 0, -7));
                this.go();
            };
            MoebiusBandDocu.prototype.go = function () {
                this.mathisFrame.clearScene(false, false);
                //$$$begin
                var basis = new mathis.reseau.BasisForRegularReseau();
                basis.origin = new mathis.XYZ(0, -1, 0);
                basis.end = new mathis.XYZ(2 * Math.PI, 1, 0);
                basis.nbI = 20;
                basis.nbJ = 10;
                var creator = new mathis.reseau.Regular(basis);
                var mamesh = creator.go();
                for (var _i = 0, _a = mamesh.vertices; _i < _a.length; _i++) {
                    var vertex = _a[_i];
                    var u = vertex.position.x;
                    var v = vertex.position.y;
                    vertex.position.x = (2 - v * Math.sin(u / 2)) * Math.sin(u);
                    vertex.position.y = (2 - v * Math.sin(u / 2)) * Math.cos(u);
                    vertex.position.z = v * Math.cos(u / 2);
                }
                var positioning = new mathis.Positioning();
                positioning.frontDir.copyFromFloats(1, 0, 1);
                positioning.applyToVertices(mamesh.vertices);
                new mathis.visu3d.LinksViewer(mamesh, this.mathisFrame.scene).go();
                var surfaceViewer = new mathis.visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene);
                /**put normalDuplication to none, to suppress the bad effect */
                surfaceViewer.normalDuplication = this.vertexDuplication;
                surfaceViewer.backFaceCulling = this.backFaceCulling;
                surfaceViewer.sideOrientation = this.sideOrientation;
                surfaceViewer.alpha = this.alpha;
                surfaceViewer.go();
                //$$$end
            };
            return MoebiusBandDocu;
        }());
    })(appli = mathis.appli || (mathis.appli = {}));
})(mathis || (mathis = {}));
