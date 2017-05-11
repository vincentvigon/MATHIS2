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
        var VerticesViewingDocu = (function () {
            function VerticesViewingDocu(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.pageIdAndTitle = "Vertices viewing";
                var severalParts = new appli.SeveralParts();
                severalParts.addPart(new DefaultVerticesViewing(this.mathisFrame));
                severalParts.addPart(new ModelVerticesViewing(this.mathisFrame));
                severalParts.addPart(new ModelPositioning(this.mathisFrame));
                severalParts.addPart(new ModelAutoPositioning(this.mathisFrame));
                this.severalParts = severalParts;
            }
            VerticesViewingDocu.prototype.go = function () {
                return this.severalParts.go();
            };
            return VerticesViewingDocu;
        }());
        appli.VerticesViewingDocu = VerticesViewingDocu;
        var DefaultVerticesViewing = (function () {
            // useAModel=false
            // $$$useAModel=[true,false]
            function DefaultVerticesViewing(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.NO_TEST = true;
                this.NAME = "DefaultVerticesViewing";
                this.TITLE = "By default : Each vertices is represented by a sphere. " +
                    "Sizes can be given or computed according to distances between vertices.";
                this.radiusProportion = 0.1;
                this.$$$radiusProportion = [0.1, 0.25, 0.5, 1];
                this.squareMailleInsteadOfTriangle = true;
                this.$$$squareMailleInsteadOfTriangle = [true, false];
                this.constantRadius = null;
                this.$$$constantRadius = [null, 0.05, 0.1, 0.2];
            }
            DefaultVerticesViewing.prototype.goForTheFirstTime = function () {
                this.mathisFrame.clearScene();
                this.mathisFrame.addDefaultCamera();
                this.mathisFrame.addDefaultLight();
                this.go();
            };
            DefaultVerticesViewing.prototype.go = function () {
                this.mathisFrame.clearScene(false, false);
                //$$$bh mamesh creation
                var basis = new mathis.reseau.BasisForRegularReseau();
                basis.nbI = 3;
                basis.set_nbJ_toHaveRegularReseau = true;
                basis.squareMailleInsteadOfTriangle = this.squareMailleInsteadOfTriangle;
                basis.origin = new mathis.XYZ(-0.7, -0.7, 0);
                basis.end = new mathis.XYZ(0.7, 0.7, 0);
                var creator = new mathis.reseau.Regular(basis);
                var mamesh = creator.go();
                //$$$eh
                //$$$begin
                var verticesViewer = new mathis.visu3d.VerticesViewer(mamesh, this.mathisFrame.scene);
                /**by default, this attribute is null. So radius of vertices are computed
                 * according to the distances between neighbor vertices*/
                verticesViewer.constantRadius = this.constantRadius;
                /**this affectation is useless if previous is not null*/
                verticesViewer.radiusProp = this.radiusProportion;
                /**you can change the color (or the material via verticesViewer.material)*/
                verticesViewer.color = new mathis.Color(mathis.Color.names.indianred);
                verticesViewer.go();
                //n
                new mathis.visu3d.LinksViewer(mamesh, this.mathisFrame.scene).go();
                //$$$end
            };
            return DefaultVerticesViewing;
        }());
        var ModelVerticesViewing = (function () {
            // scaleTheModel=true
            // $$$scaleTheModel=[true,false]
            // backFaceCulling=true
            // $$$backFaceCulling=[true,false]
            function ModelVerticesViewing(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.NO_TEST = true;
                this.NAME = "ModelVerticesViewing";
                this.TITLE = "we use  babylonJS meshes as model for vertices";
                this.radiusProportion = 0.25;
                this.$$$radiusProportion = [0.1, 0.25, 0.5, 1];
                this.squareMailleInsteadOfTriangle = false;
                this.$$$squareMailleInsteadOfTriangle = [true, false];
                this.constantRadius = null;
                this.$$$constantRadius = [null, 0.1, 0.2, 0.3];
                this.modelChoice = 0;
                this.$$$modelChoice = [0, 1, 2, 3];
                this.justShowTheModel = false;
                this.$$$justShowTheModel = [true, false];
            }
            ModelVerticesViewing.prototype.goForTheFirstTime = function () {
                this.mathisFrame.clearScene();
                this.mathisFrame.addDefaultCamera();
                this.mathisFrame.addDefaultLight();
                this.go();
            };
            ModelVerticesViewing.prototype.go = function () {
                this.mathisFrame.clearScene(false, false);
                //$$$bh mamesh creation
                var basis = new mathis.reseau.BasisForRegularReseau();
                basis.nbI = 3;
                basis.set_nbJ_toHaveRegularReseau = true;
                basis.squareMailleInsteadOfTriangle = this.squareMailleInsteadOfTriangle;
                basis.origin = new mathis.XYZ(-0.7, -0.7, 0);
                basis.end = new mathis.XYZ(0.7, 0.7, 0);
                var creator = new mathis.reseau.Regular(basis);
                var mamesh = creator.go();
                //$$$eh
                //$$$begin
                var verticesViewer = new mathis.visu3d.VerticesViewer(mamesh, this.mathisFrame.scene);
                verticesViewer.constantRadius = this.constantRadius;
                verticesViewer.radiusProp = this.radiusProportion;
                /**model mush have a bounding "radius" of 1. It will be re-sized by the vertices-viewer */
                var modelChoice = this.modelChoice;
                if (modelChoice == 0) {
                    verticesViewer.meshModel = BABYLON.Mesh.CreateCylinder("", 2, 0, 2, 20, 2, this.mathisFrame.scene);
                }
                else if (modelChoice == 1) {
                    /**we can put several models, and change the red-default color*/
                    verticesViewer.meshModels = [BABYLON.Mesh.CreateBox("", 1, this.mathisFrame.scene), BABYLON.Mesh.CreateCylinder("", 1, 0, 1, 20, 2, this.mathisFrame.scene)];
                    verticesViewer.meshModels[0].position.y = -0.5;
                    verticesViewer.meshModels[1].position.y = +0.5;
                    verticesViewer.color = new mathis.Color(mathis.Color.names.deeppink);
                }
                else if (modelChoice == 2) {
                    verticesViewer.meshModel = BABYLON.Mesh.CreateDisc("", 1, 20, this.mathisFrame.scene);
                    /**if a material is specified, default material is not used*/
                    var material = new BABYLON.StandardMaterial("", this.mathisFrame.scene);
                    material.backFaceCulling = false; //better for a disk
                    material.diffuseColor = new BABYLON.Color3(0, 0, 1); //blue
                    verticesViewer.meshModel.material = material;
                }
                else if (modelChoice == 3) {
                    /**the x-axis (red) is sent to the normal vectors*/
                    verticesViewer.meshModels = new mathis.creation3D.TwoOrTreeAxis(this.mathisFrame.scene).go();
                }
                //n
                var justShowTheModel = this.justShowTheModel;
                if (!justShowTheModel) {
                    /**if you do not fire "verticesViewer.goChanging()", we just see the model.*/
                    verticesViewer.go();
                    new mathis.visu3d.LinksViewer(mamesh, this.mathisFrame.scene).go();
                }
                //$$$end
            };
            return ModelVerticesViewing;
        }());
        var ModelPositioning = (function () {
            // scaleTheModel=true
            // $$$scaleTheModel=[true,false]
            // backFaceCulling=true
            // $$$backFaceCulling=[true,false]
            function ModelPositioning(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.NO_TEST = true;
                this.NAME = "ModelPositioning";
                this.TITLE = "we specify the positioning of the models";
                // radiusProportion=0.25
                // $$$radiusProportion=[0.1,0.25,0.5,1]
                this.squareMailleInsteadOfTriangle = false;
                this.$$$squareMailleInsteadOfTriangle = [true, false];
                // constantRadius=null
                // $$$constantRadius=[null,0.1,0.2,0.3]
                this.modelChoice = 3;
                this.$$$modelChoice = [0, 1, 2, 3];
                this.justShowTheModel = false;
                this.$$$justShowTheModel = [true, false];
            }
            ModelPositioning.prototype.goForTheFirstTime = function () {
                this.mathisFrame.clearScene();
                this.mathisFrame.addDefaultCamera();
                this.mathisFrame.addDefaultLight();
                this.go();
            };
            ModelPositioning.prototype.go = function () {
                this.mathisFrame.clearScene(false, false);
                //$$$bh mamesh creation as previously
                var basis = new mathis.reseau.BasisForRegularReseau();
                basis.nbI = 5;
                basis.set_nbJ_toHaveRegularReseau = true;
                basis.squareMailleInsteadOfTriangle = this.squareMailleInsteadOfTriangle;
                basis.origin = new mathis.XYZ(-0.7, -0.7, 0);
                basis.end = new mathis.XYZ(0.7, 0.7, 0);
                var creator = new mathis.reseau.Regular(basis);
                var mamesh = creator.go();
                var verticesViewer = new mathis.visu3d.VerticesViewer(mamesh, this.mathisFrame.scene);
                /**model mush have a bounding "radius" of 1. It will be re-sized by the vertices-viewer */
                var modelChoice = this.modelChoice;
                if (modelChoice == 0) {
                    verticesViewer.meshModel = BABYLON.Mesh.CreateCylinder("", 2, 0, 2, 20, 2, this.mathisFrame.scene);
                }
                else if (modelChoice == 1) {
                    /**we can put several models, and change the red-default color*/
                    verticesViewer.meshModels = [BABYLON.Mesh.CreateBox("", 1, this.mathisFrame.scene), BABYLON.Mesh.CreateCylinder("", 1, 0, 1, 20, 2, this.mathisFrame.scene)];
                    verticesViewer.meshModels[0].position.y = -0.5;
                    verticesViewer.meshModels[1].position.y = +0.5;
                    verticesViewer.color = new mathis.Color(mathis.Color.names.deeppink);
                }
                else if (modelChoice == 2) {
                    verticesViewer.meshModel = BABYLON.Mesh.CreateDisc("", 1, 20, this.mathisFrame.scene);
                    /**if a material is specified, default material is not used*/
                    var material = new BABYLON.StandardMaterial("", this.mathisFrame.scene);
                    material.backFaceCulling = false; //better for a disk
                    material.diffuseColor = new BABYLON.Color3(0, 0, 1); //blue
                    verticesViewer.meshModel.material = material;
                }
                else if (modelChoice == 3) {
                    /**the x-axis (red) is sent to the normal vectors*/
                    var twoAxisCreator = new mathis.creation3D.TwoOrTreeAxis(this.mathisFrame.scene);
                    twoAxisCreator.threeVersusTwoAxis = false;
                    verticesViewer.meshModels = twoAxisCreator.go();
                }
                //$$$eh
                //$$$begin
                var positionings = new mathis.HashMap();
                for (var i = 0; i < mamesh.vertices.length; i++) {
                    var positioning = new mathis.Positioning();
                    var angle = Math.random() * Math.PI * 2;
                    positioning.setOrientation(new mathis.XYZ(0, 0, -1), new mathis.XYZ(Math.cos(angle), Math.sin(angle), 0));
                    positioning.scaling = new mathis.XYZ(0.2, 0.2, 0.2);
                    positionings.putValue(mamesh.vertices[i], positioning);
                }
                verticesViewer.positionings = positionings;
                //n
                var justShowTheModel = this.justShowTheModel;
                if (!justShowTheModel) {
                    /**if you do not fire "verticesViewer.goChanging()", we just see the model.*/
                    verticesViewer.go();
                    new mathis.visu3d.LinksViewer(mamesh, this.mathisFrame.scene).go();
                }
                //$$$end
            };
            return ModelPositioning;
        }());
        var ModelAutoPositioning = (function () {
            // randomFrontDir=false
            // $$$randomFrontDir=[true,false]
            function ModelAutoPositioning(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.NO_TEST = true;
                this.NAME = "ModelAutoPositioning";
                this.TITLE = "Positionings are computed from mamesh : " +
                    "FrontDir is aligned to the link which has the direction the closest as possible from the give 'attractionForTangent'.  " +
                    "UpVector is the normal of the surface, which is the mean of the normal of triangle/quad around.";
                // squareMailleInsteadOfTriangle=false
                // $$$squareMailleInsteadOfTriangle=[true,false]
                // constantRadius=null
                // $$$constantRadius=[null,0.1,0.2,0.3]
                this.modelChoice = 3;
                this.$$$modelChoice = [0, 1, 2, 3];
                // justShowTheModel=false
                // $$$justShowTheModel=[true,false]
                // scaleTheModel=true
                // $$$scaleTheModel=[true,false]
                // backFaceCulling=true
                // $$$backFaceCulling=[true,false]
                this.attractionForTangent = new mathis.XYZ(100, 10, 0);
                this.$$$attractionForTangent = new appli.Choices([new mathis.XYZ(100, 10, 0), new mathis.XYZ(-100, 0, 0), new mathis.XYZ(0, 100, 0), new mathis.XYZ(0, 0, 100)], { 'before': "new mathis.XYZ" });
                this.cylinderVersusSphere = true;
                this.$$$cylinderVersusSphere = [true, false];
            }
            ModelAutoPositioning.prototype.goForTheFirstTime = function () {
                this.mathisFrame.clearScene();
                this.mathisFrame.addDefaultCamera();
                this.mathisFrame.addDefaultLight();
                this.go();
            };
            ModelAutoPositioning.prototype.go = function () {
                this.mathisFrame.clearScene(false, false);
                //$$$b
                var cylinderVersusSphere = this.cylinderVersusSphere;
                //$$$e
                //$$$bh cylinder or sphere creation
                var mamesh;
                if (cylinderVersusSphere) {
                    var basis = new mathis.reseau.BasisForRegularReseau();
                    basis.origin = new mathis.XYZ(0, -1, 0);
                    basis.end = new mathis.XYZ(Math.PI, +1, 0);
                    basis.nbI = 5;
                    basis.nbJ = 7;
                    mamesh = new mathis.reseau.Regular(basis).go();
                    for (var i = 0; i < mamesh.vertices.length; i++) {
                        var oldPosition = mathis.XYZ.newFrom(mamesh.vertices[i].position);
                        mamesh.vertices[i].position.x = Math.cos(oldPosition.x);
                        mamesh.vertices[i].position.z = Math.sin(oldPosition.x);
                    }
                }
                else {
                    var creator = new mathis.polyhedron.Polyhedron("dodecahedron");
                    mamesh = creator.go();
                    new mathis.mameshModification.TriangleDichotomer(mamesh).go();
                    for (var i = 0; i < mamesh.vertices.length; i++) {
                        mamesh.vertices[i].position.normalize();
                    }
                }
                var verticesViewer = new mathis.visu3d.VerticesViewer(mamesh, this.mathisFrame.scene);
                //$$$eh
                //$$$b
                var modelChoice = this.modelChoice;
                //$$$e
                //$$$bh model creation
                if (modelChoice == 0) {
                    verticesViewer.meshModel = BABYLON.Mesh.CreateCylinder("", 2, 0, 2, 20, 2, this.mathisFrame.scene);
                }
                else if (modelChoice == 1) {
                    /**we can put several models, and change the red-default color*/
                    verticesViewer.meshModels = [BABYLON.Mesh.CreateBox("", 1, this.mathisFrame.scene), BABYLON.Mesh.CreateCylinder("", 1, 0, 1, 20, 2, this.mathisFrame.scene)];
                    verticesViewer.meshModels[0].position.y = -0.5;
                    verticesViewer.meshModels[1].position.y = +0.5;
                    verticesViewer.color = new mathis.Color(mathis.Color.names.deeppink);
                }
                else if (modelChoice == 2) {
                    verticesViewer.meshModel = BABYLON.Mesh.CreateDisc("", 1, 20, this.mathisFrame.scene);
                    /**if a material is specified, default material is not used*/
                    var material = new BABYLON.StandardMaterial("", this.mathisFrame.scene);
                    material.backFaceCulling = false; //better for a disk
                    material.diffuseColor = new BABYLON.Color3(0, 0, 1); //blue
                    verticesViewer.meshModel.material = material;
                }
                else if (modelChoice == 3) {
                    var twoAxisCreator = new mathis.creation3D.TwoOrTreeAxis(this.mathisFrame.scene);
                    twoAxisCreator.threeVersusTwoAxis = false;
                    verticesViewer.meshModels = twoAxisCreator.go();
                }
                //$$$eh
                //$$$begin
                var positioningComputer = new mathis.mameshAroundComputations.PositioningComputerForMameshVertices(mamesh);
                positioningComputer.attractionOfTangent = this.attractionForTangent;
                /**to compute normal (= upVector) is quite a heavy job : first we must compute a normal by polygon, and
                 * then, for each vertex, we have to take the barycenter of the normal of polygons around.
                 * Moreover these normals can be use by several guys e.g. by other verticesViewers or by a linksViewer (see further on).
                 * So it is a good think to memorize  vertexToPositioning inside the mamesh*/
                mamesh.vertexToPositioning = positioningComputer.go();
                /**then we have to say to the verticesViewer  to use this vertexToPositioning*/
                verticesViewer.positionings = mamesh.vertexToPositioning;
                console.log(mamesh.vertexToPositioning);
                verticesViewer.go();
                //n
                var linksViewer = new mathis.visu3d.LinksViewer(mamesh, this.mathisFrame.scene);
                linksViewer.lateralScalingConstant = 0.01;
                linksViewer.go();
                //$$$end
            };
            return ModelAutoPositioning;
        }());
    })(appli = mathis.appli || (mathis.appli = {}));
})(mathis || (mathis = {}));
