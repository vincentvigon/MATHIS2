/**
 * Created by vigon on 26/12/2016.
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
        var LinksViewingDocu = (function () {
            function LinksViewingDocu(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.pageIdAndTitle = "Links viewing";
                var severalParts = new appli.SeveralParts();
                severalParts.addPart(new JustTheSizeOfLinks(this.mathisFrame));
                severalParts.addPart(new OrientationLinksViewing(this.mathisFrame));
                severalParts.addComment("In the sequel we explain how to finely adjust the links-representation.", "In the sequel we explain how to finely adjust the links-representation");
                severalParts.addPart(new Elongate(this.mathisFrame));
                severalParts.addPart(new DefaultLinksViewing(this.mathisFrame));
                severalParts.addPart(new CustomLinksViewing(this.mathisFrame));
                this.severalParts = severalParts;
            }
            LinksViewingDocu.prototype.go = function () {
                return this.severalParts.go();
            };
            return LinksViewingDocu;
        }());
        appli.LinksViewingDocu = LinksViewingDocu;
        var JustTheSizeOfLinks = (function () {
            function JustTheSizeOfLinks(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.NAME = "JustTheSizeOfLinks";
                this.TITLE = "As a simple usage, you can specified  the color and the lateral-size of links. This size can be relative or absolute.";
                this.nbSides = 4;
                this.$$$nbSides = [4, 7, 10];
                this.nbSubdivisionInARadius = 3;
                this.$$$nbSubdivisionInARadius = [2, 3, 5];
                this.color = mathis.Color.names.rebeccapurple;
                this.$$$color = new appli.Choices([mathis.Color.names.rebeccapurple, mathis.Color.names.rosybrown, mathis.Color.names.darkorange], { 'before': 'Color.names.', 'visualValues': ['rebeccapurple', 'rosybrown', 'darkorange'] });
                this.lateralScalingProp = 0.05;
                this.$$$lateralScalingProp = [0.01, 0.05, 0.1];
                this.lateralScalingConstant = null;
                this.$$$lateralScalingConstant = [null, 0.05, 0.1, 0.2];
            }
            JustTheSizeOfLinks.prototype.goForTheFirstTime = function () {
                this.mathisFrame.clearScene();
                this.mathisFrame.addDefaultCamera();
                this.mathisFrame.addDefaultLight();
                this.go();
            };
            JustTheSizeOfLinks.prototype.go = function () {
                this.mathisFrame.clearScene(false, false);
                //$$$b
                var creator = new mathis.reseau.TriangulatedPolygone(this.nbSides);
                creator.nbSubdivisionInARadius = this.nbSubdivisionInARadius;
                var mamesh = creator.go();
                //n
                var linksViewer = new mathis.visu3d.LinksViewer(mamesh, this.mathisFrame.scene);
                linksViewer.color = new mathis.Color(this.color);
                /**if null, the lateral scaling is proportional to the mean distance between linked vertices*/
                linksViewer.lateralScalingConstant = this.lateralScalingConstant;
                /**useless if previous is not null,*/
                linksViewer.lateralScalingProp = this.lateralScalingProp;
                linksViewer.go();
                //$$$e
            };
            return JustTheSizeOfLinks;
        }());
        var OrientationLinksViewing = (function () {
            function OrientationLinksViewing(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.NAME = "OrientationLinksViewing";
                this.TITLE = "Now we specify a model (here an arrow), and indicate which links must be drawn and in which direction.";
                this.polyhedronType = "cube";
                this.$$$polyhedronType = mathis.polyhedron.platonic;
                // showLateralDirection=false
                // $$$showLateralDirection=[true,false]
                this.methodChoice = -1;
                this.$$$methodChoice = [-1, 0, 1, 2, 3];
            }
            OrientationLinksViewing.prototype.goForTheFirstTime = function () {
                this.mathisFrame.clearScene();
                this.mathisFrame.addDefaultCamera();
                this.mathisFrame.addDefaultLight();
                this.go();
            };
            OrientationLinksViewing.prototype.go = function () {
                this.mathisFrame.clearScene(false, false);
                //$$$b
                var creator = new mathis.polyhedron.Polyhedron(this.polyhedronType);
                var mamesh = creator.go();
                //$$$e
                //$$$bh the model is an arrow
                var modelsCreator = new mathis.creation3D.ArrowCreator(this.mathisFrame.scene);
                modelsCreator.arrowFootAtOrigin = false;
                modelsCreator.bodyDiameterProp = 1;
                modelsCreator.headDiameterProp = 2;
                var model = modelsCreator.go();
                var material = new BABYLON.StandardMaterial("", this.mathisFrame.scene);
                material.diffuseColor = new BABYLON.Color3(0, 0, 1);
                model.material = material;
                /**to avoid smoothing */
                model.convertToFlatShadedMesh();
                //$$$eh
                //$$$b
                var segmentOrientationFunction;
                var methodChoice = this.methodChoice;
                if (methodChoice == -1) {
                    /**no function : so all the link are drawn with a random orientation*/
                    segmentOrientationFunction = null;
                }
                else if (methodChoice == 0) {
                    /**if the function return 0 : no links are drawn
                     * else : orientation is chosen according to the sign of the return values*/
                    segmentOrientationFunction = function (v0, v1) {
                        if (mathis.geo.almostEquality(v0.position.y, v1.position.y))
                            return 0;
                        return v0.position.y - v1.position.y;
                    };
                }
                else if (methodChoice == 1) {
                    /**the opposite method*/
                    segmentOrientationFunction = function (v0, v1) {
                        if (mathis.geo.almostEquality(v0.position.y, v1.position.y))
                            return 0;
                        return -v0.position.y + v1.position.y;
                    };
                }
                else if (methodChoice == 2) {
                    segmentOrientationFunction = function (v0, v1) {
                        if (mathis.geo.almostEquality(v0.position.z, v1.position.z))
                            return 0;
                        return v0.position.z - v1.position.z;
                    };
                }
                else if (methodChoice == 3) {
                    /**please, try this method on the Dodecahedron*/
                    segmentOrientationFunction = function (v0, v1) {
                        if (v0.hasMark(mathis.Vertex.Markers.polygonCenter) || v1.hasMark(mathis.Vertex.Markers.polygonCenter))
                            return 0;
                        return v0.position.z - v1.position.z;
                    };
                }
                var linksViewer = new mathis.visu3d.LinksViewer(mamesh, this.mathisFrame.scene);
                linksViewer.meshModel = model;
                linksViewer.segmentOrientationFunction = segmentOrientationFunction;
                linksViewer.go();
                //$$$e
            };
            return OrientationLinksViewing;
        }());
        var Elongate = (function () {
            function Elongate(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.NAME = "Elongate";
                this.TITLE = "Links viewing is made via an 'elongator'. This elongator take a vertical mesh (eg cylinder, arrow...) " +
                    "and place its between two positions. Lateral-direction and lateral-scaling can be given.";
                this.upVector = new mathis.XYZ(0, 0, 1);
                this.$$$upVector = new appli.Choices([new mathis.XYZ(0, 0, 1), new mathis.XYZ(0, 1, 1), new mathis.XYZ(0, 0.5, 1)], { 'before': 'new XYZ' });
                this.endPos = new mathis.XYZ(1, 0, 0);
                this.$$$endPos = new appli.Choices([new mathis.XYZ(1, 0, 0), new mathis.XYZ(-1, 0.5, 0), new mathis.XYZ(1, 1, 0)], { 'before': 'new XYZ' });
                this.modelChoice = 0;
                this.$$$modelChoice = [0, 1, 2];
                this.lateralScaling = 0.1;
                this.$$$lateralScaling = [0.05, 0.1, 0.5];
                this.justSeeModels = false;
                this.$$$justSeeModels = [true, false];
                this.showLateralDirection = true;
                this.$$$showLateralDirection = [true, false];
            }
            Elongate.prototype.goForTheFirstTime = function () {
                this.mathisFrame.clearScene();
                this.mathisFrame.addDefaultCamera();
                this.mathisFrame.addDefaultLight();
                this.go();
            };
            Elongate.prototype.go = function () {
                this.mathisFrame.clearScene(false, false);
                //$$$b
                var modelChoice = this.modelChoice;
                var model;
                if (modelChoice == 0) {
                    model = BABYLON.Mesh.CreateBox("", 1, this.mathisFrame.scene);
                }
                else if (modelChoice == 1) {
                    model = BABYLON.Mesh.CreateCylinder("", 1, 1, 1, 3, 3, this.mathisFrame.scene);
                }
                else if (modelChoice == 2) {
                    var modelsCreator = new mathis.creation3D.ArrowCreator(this.mathisFrame.scene);
                    modelsCreator.arrowFootAtOrigin = false;
                    modelsCreator.bodyDiameterProp = 1;
                    modelsCreator.headDiameterProp = 2;
                    model = modelsCreator.go();
                }
                var material = new BABYLON.StandardMaterial("", this.mathisFrame.scene);
                material.diffuseColor = new BABYLON.Color3(0, 0, 1);
                model.material = material;
                /**to avoid smoothing */
                model.convertToFlatShadedMesh();
                var justSeeModels = this.justSeeModels;
                var endPos = this.endPos;
                var lateralDirection = this.upVector;
                if (!justSeeModels) {
                    var elongator = new mathis.visu3d.ElongateAMeshFromBeginToEnd(new mathis.XYZ(-1, 0, 0), endPos, model);
                    elongator.lateralDirection = lateralDirection;
                    elongator.lateralScaling = this.lateralScaling;
                    elongator.goChanging();
                }
                //n
                var showLateralDirection = this.showLateralDirection;
                //$$$e
                //$$$bh the code to show the lateral direction
                if (showLateralDirection) {
                    var lateralVector = new mathis.creation3D.ArrowCreator(this.mathisFrame.scene).go();
                    var quaternion = new mathis.XYZW(0, 0, 0, 0);
                    mathis.geo.axisAngleToQuaternion(new mathis.XYZ(0, 0, 1), -Math.PI / 2, quaternion);
                    lateralVector.rotationQuaternion = quaternion;
                    lateralVector.bakeCurrentTransformIntoVertices();
                    if (!justSeeModels) {
                        var elongator2 = new mathis.visu3d.ElongateAMeshFromBeginToEnd(new mathis.XYZ(-1, 0, 0), endPos, lateralVector);
                        elongator2.lateralDirection = lateralDirection;
                        elongator2.lateralScaling = 1;
                        elongator2.goChanging();
                    }
                }
                //$$$eh
            };
            return Elongate;
        }());
        var DefaultLinksViewing = (function () {
            function DefaultLinksViewing(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.NAME = "DefaultLinksViewing";
                this.TITLE = "The links are drawn using the default method to compute lateral directions (these direction are illustrated by the white arrows)";
                this.modelChoice = 0;
                this.$$$modelChoice = [-1, 0, 1, 2];
                this.lateralScalingProp = 0.05;
                this.$$$lateralScalingProp = [0.01, 0.05, 0.1];
                this.lateralScalingConstant = null;
                this.$$$lateralScalingConstant = [null, 0.05, 0.1, 0.2];
                this.justSeeModels = false;
                this.$$$justSeeModels = [true, false];
                this.polyhedronType = "icosahedron";
                this.$$$polyhedronType = mathis.polyhedron.platonic;
                this.showLateralDirection = true;
                this.$$$showLateralDirection = [true, false];
            }
            DefaultLinksViewing.prototype.goForTheFirstTime = function () {
                this.mathisFrame.clearScene();
                this.mathisFrame.addDefaultCamera();
                this.mathisFrame.addDefaultLight();
                this.go();
            };
            DefaultLinksViewing.prototype.go = function () {
                this.mathisFrame.clearScene(false, false);
                //$$$b
                var creator = new mathis.polyhedron.Polyhedron(this.polyhedronType);
                var mamesh = creator.go();
                var modelChoice = this.modelChoice;
                //$$$e
                //$$$bh model construction (-1 for default cylinder)
                var model;
                if (modelChoice == -1) {
                    /**default:no model*/
                    model = null;
                }
                else if (modelChoice == 0) {
                    model = BABYLON.Mesh.CreateBox("", 1, this.mathisFrame.scene);
                }
                else if (modelChoice == 1) {
                    model = BABYLON.Mesh.CreateCylinder("", 1, 1, 1, 3, 3, this.mathisFrame.scene);
                }
                else if (modelChoice == 2) {
                    var modelsCreator = new mathis.creation3D.ArrowCreator(this.mathisFrame.scene);
                    modelsCreator.arrowFootAtOrigin = false;
                    modelsCreator.bodyDiameterProp = 1;
                    modelsCreator.headDiameterProp = 2;
                    model = modelsCreator.go();
                }
                if (model != null) {
                    var material = new BABYLON.StandardMaterial("", this.mathisFrame.scene);
                    material.diffuseColor = new BABYLON.Color3(0, 0, 1);
                    model.material = material;
                    /**to avoid smoothing */
                    model.convertToFlatShadedMesh();
                }
                //$$$eh
                //$$$b
                var justSeeModels = this.justSeeModels;
                if (!justSeeModels) {
                    var linksViewer = new mathis.visu3d.LinksViewer(mamesh, this.mathisFrame.scene);
                    linksViewer.meshModel = model;
                    /**if null, the lateral scaling is proportional to the mean distance between linked vertices*/
                    linksViewer.lateralScalingConstant = this.lateralScalingConstant;
                    /**useless if previous is not null,*/
                    linksViewer.lateralScalingProp = this.lateralScalingProp;
                    linksViewer.go();
                }
                //n
                var showLateralDirection = this.showLateralDirection;
                //$$$e
                //$$$bh the code to show the lateral directions
                if (showLateralDirection) {
                    var lateralVector = new mathis.creation3D.ArrowCreator(this.mathisFrame.scene).go();
                    var quaternion = new mathis.XYZW(0, 0, 0, 0);
                    mathis.geo.axisAngleToQuaternion(new mathis.XYZ(0, 0, 1), -Math.PI / 2, quaternion);
                    lateralVector.rotationQuaternion = quaternion;
                    lateralVector.bakeCurrentTransformIntoVertices();
                    if (!justSeeModels) {
                        var linksViewer = new mathis.visu3d.LinksViewer(mamesh, this.mathisFrame.scene);
                        linksViewer.meshModel = lateralVector;
                        linksViewer.lateralScalingConstant = 0.3;
                        linksViewer.go();
                    }
                }
                //$$$eh
            };
            return DefaultLinksViewing;
        }());
        var CustomLinksViewing = (function () {
            function CustomLinksViewing(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.NAME = "CustomLinksViewing";
                this.TITLE = "The links are drawn using some methods to compute lateral directions (these direction are illustrated by the white arrows)";
                this.modelChoice = 0;
                this.$$$modelChoice = [-1, 0, 1, 2];
                // lateralScalingProp=0.05
                // $$$lateralScalingProp=[0.01,0.05,0.1]
                //
                // lateralScalingConstant=null
                // $$$lateralScalingConstant=[null,0.05,0.1,0.2]
                this.justSeeModels = false;
                this.$$$justSeeModels = [true, false];
                this.polyhedronType = "cube";
                this.$$$polyhedronType = mathis.polyhedron.platonic;
                this.showLateralDirection = true;
                this.$$$showLateralDirection = [true, false];
                this.methodChoice = 0;
                this.$$$methodChoice = [-1, 0, 1];
            }
            CustomLinksViewing.prototype.goForTheFirstTime = function () {
                this.mathisFrame.clearScene();
                this.mathisFrame.addDefaultCamera();
                this.mathisFrame.addDefaultLight();
                this.go();
            };
            CustomLinksViewing.prototype.go = function () {
                this.mathisFrame.clearScene(false, false);
                //$$$b
                var creator = new mathis.polyhedron.Polyhedron(this.polyhedronType);
                var mamesh = creator.go();
                var modelChoice = this.modelChoice;
                //$$$e
                //$$$bh model construction (-1 for the default green cylinder)
                var model;
                if (modelChoice == -1) {
                    /**default:no model*/
                    model = null;
                }
                else if (modelChoice == 0) {
                    model = BABYLON.Mesh.CreateBox("", 1, this.mathisFrame.scene);
                }
                else if (modelChoice == 1) {
                    model = BABYLON.Mesh.CreateCylinder("", 1, 1, 1, 3, 3, this.mathisFrame.scene);
                }
                else if (modelChoice == 2) {
                    var modelsCreator = new mathis.creation3D.ArrowCreator(this.mathisFrame.scene);
                    modelsCreator.arrowFootAtOrigin = false;
                    modelsCreator.bodyDiameterProp = 1;
                    modelsCreator.headDiameterProp = 2;
                    model = modelsCreator.go();
                }
                if (model != null) {
                    var material = new BABYLON.StandardMaterial("", this.mathisFrame.scene);
                    material.diffuseColor = new BABYLON.Color3(0, 0, 1);
                    model.material = material;
                    /**to avoid smoothing */
                    model.convertToFlatShadedMesh();
                }
                //$$$eh
                //$$$b
                var justSeeModels = this.justSeeModels;
                var pairVertexToLateralDirection;
                var methodChoice = this.methodChoice;
                if (methodChoice == -1) {
                    /**so the default method will be used*/
                    pairVertexToLateralDirection = null;
                }
                if (methodChoice == 0) {
                    /**a method ad hoc for the cube with straight-links*/
                    var linkDirection_1 = new mathis.XYZ(0, 0, 0);
                    var lateralDir1_1 = new mathis.XYZ(0, 1, 0);
                    var lateralDir2_1 = new mathis.XYZ(1, 0, 0);
                    pairVertexToLateralDirection = function (v0, v1) {
                        linkDirection_1.copyFrom(v0.position).substract(v1.position);
                        if (mathis.geo.almostParallel(linkDirection_1, lateralDir1_1))
                            return lateralDir2_1;
                        else
                            return lateralDir1_1;
                    };
                }
                else {
                    /**a method which use the normal vector of vertices
                     * Perhaps you already have computed this normal vector,
                     * and perhaps you saved them as mamesh.vertexToPositioning (see vertex viewing)*/
                    var normalComputing = new mathis.mameshAroundComputations.PositioningComputerForMameshVertices(mamesh);
                    normalComputing.computeTangent = false; //we just want normals
                    normalComputing.computeSizes = false;
                    normalComputing.computeNormal = true;
                    var positionings_1 = normalComputing.go();
                    /**this method return the sum of the two  normals*/
                    pairVertexToLateralDirection = function (v0, v1) {
                        var res = new mathis.XYZ(0, 0, 0);
                        return res.copyFrom(positionings_1.getValue(v0).upVector).add(positionings_1.getValue(v1).upVector);
                    };
                }
                if (!justSeeModels) {
                    var linksViewer = new mathis.visu3d.LinksViewer(mamesh, this.mathisFrame.scene);
                    linksViewer.meshModel = model;
                    linksViewer.pairVertexToLateralDirection = pairVertexToLateralDirection;
                    linksViewer.go();
                }
                //n
                var showLateralDirection = this.showLateralDirection;
                //$$$e
                //$$$bh the code to show the lateral directions
                if (showLateralDirection) {
                    var lateralVector = new mathis.creation3D.ArrowCreator(this.mathisFrame.scene).go();
                    var quaternion = new mathis.XYZW(0, 0, 0, 0);
                    mathis.geo.axisAngleToQuaternion(new mathis.XYZ(0, 0, 1), -Math.PI / 2, quaternion);
                    lateralVector.rotationQuaternion = quaternion;
                    lateralVector.bakeCurrentTransformIntoVertices();
                    if (!justSeeModels) {
                        var linksViewer = new mathis.visu3d.LinksViewer(mamesh, this.mathisFrame.scene);
                        linksViewer.meshModel = lateralVector;
                        linksViewer.lateralScalingConstant = 0.3;
                        linksViewer.pairVertexToLateralDirection = pairVertexToLateralDirection;
                        linksViewer.go();
                    }
                }
                //$$$eh
            };
            return CustomLinksViewing;
        }());
    })(appli = mathis.appli || (mathis.appli = {}));
})(mathis || (mathis = {}));
