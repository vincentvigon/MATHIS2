/**
 * Created by vigon on 07/11/2016.
 */
var mathis;
(function (mathis) {
    var infiniteWorlds;
    (function (infiniteWorlds) {
        (function (NameOfReseau3D) {
            NameOfReseau3D[NameOfReseau3D["cube"] = 0] = "cube";
            NameOfReseau3D[NameOfReseau3D["hexagone"] = 1] = "hexagone";
            NameOfReseau3D[NameOfReseau3D["doubleHexagone"] = 2] = "doubleHexagone";
        })(infiniteWorlds.NameOfReseau3D || (infiniteWorlds.NameOfReseau3D = {}));
        var NameOfReseau3D = infiniteWorlds.NameOfReseau3D;
        var InfiniteCartesian = (function () {
            function InfiniteCartesian(mathisFrame) {
                /**reseau characterization*/
                this.nameOfResau3d = NameOfReseau3D.cube;
                this.nbVerticalDecays = 0;
                this.nbHorizontalDecays = 0;
                this.fondamentalDomainSize = 9;
                this.nbSubdivision = 3;
                this.nbRepetition = 8;
                /**bien régler ce paramétre pour que l'on ne voit pas le bout du monde.
                 *  fondamentalDomainSize petit &&  nbRepetition petit => fogDensity grand */
                this.fogDensity = 0.05;
                this.drawFondamentalDomain = false;
                /**when creating the world, to see it from outside, put the  next fields to false */
                this.recenterCamera = true;
                this.notDrawMeshesAtFarCorners = true;
                this.population = [];
                this.collisionOnLinks = false;
                this.collisionOnVertices = false;
                this.collisionForCamera = false;
                /**if null, no links*/
                this.nbSidesOfLinks = 4;
                this.buildLightCameraSkyboxAndFog = true;
                this.mathisFrame = mathisFrame;
            }
            InfiniteCartesian.prototype.go = function () {
                if (this.buildLightCameraSkyboxAndFog)
                    this.cameraLight();
                this.creationOfReseau();
                var wallDiffuseTexture = new BABYLON.Texture('assets/texture/escher.jpg', this.mathisFrame.scene);
                this.vertexVisualization(this.mamesh, wallDiffuseTexture);
                this.linksVisualization(this.mamesh, wallDiffuseTexture);
                this.addAndMultiplyPopulation();
                if (this.buildLightCameraSkyboxAndFog) {
                    this.seeWorldFromInside();
                    this.fogAndSkybox();
                }
            };
            InfiniteCartesian.prototype.addAndMultiplyPopulation = function () {
                var maxDist = (this.notDrawMeshesAtFarCorners) ? this.getTotalSize() * 0.6 : this.getTotalSize();
                var multiply = new mathis.periodicWorld.Multiply(this.fd, maxDist, this.nbRepetition);
                for (var _i = 0, _a = this.population; _i < _a.length; _i++) {
                    var mesh = _a[_i];
                    multiply.addAbstractMesh(mesh);
                }
            };
            InfiniteCartesian.prototype.seeWorldFromOutside = function () {
                //this.nbRepetition=nbRepetition
                var totalSize = this.getTotalSize();
                this.getCamera().changePosition(new mathis.XYZ(0, 0, -totalSize * 2), false);
                this.getCamera().changeFrontDir(new mathis.XYZ(0, 0, 1), false);
                //TODO cela bug si je fais cela : this.cam.changeUpVector(new XYZ(0,1,0))
                this.recenterCamera = false;
                this.getGrabber().mesh.visibility = 1;
                this.getCamera().useOnlyFreeMode = false;
                this.mathisFrame.scene.fogMode = BABYLON.Scene.FOGMODE_NONE;
                //if (this.addFog&&suppressFog) this.toggleFogAndSkyBox(false)
            };
            InfiniteCartesian.prototype.seeWorldFromInside = function () {
                this.recenterCamera = true;
                //this.addFog=true
                this.getCamera().changePosition(new mathis.XYZ(0, 0, 0), false);
                this.getCamera().changeFrontDir(new mathis.XYZ(-0.5, -0.5, -1), false);
                this.getGrabber().mesh.visibility = 0;
                this.getCamera().useOnlyFreeMode = true;
                this.mathisFrame.scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
                //if(this.addFog) this.toggleFogAndSkyBox(true)
            };
            //cam:macamera.GrabberCamera
            //grabber0:macamera.SphericalGrabber
            InfiniteCartesian.prototype.getCamera = function () {
                return this.mathisFrame.scene.activeCamera;
            };
            InfiniteCartesian.prototype.getGrabber = function () {
                return this.getCamera().currentGrabber;
            };
            InfiniteCartesian.prototype.cameraLight = function () {
                var _this = this;
                var grabberRadius = this.getTotalSize() * 0.6;
                var grabber0 = new mathis.macamera.SphericalGrabber(this.mathisFrame.scene, new mathis.XYZ(grabberRadius, grabberRadius, grabberRadius));
                grabber0.focusOnMyCenterWhenCameraGoDownWard = false;
                grabber0.mesh.visibility = 0; //TODO faire un grabber sans forcement de mesh
                //this.mathisFrame.camera=this.cam
                var camera = new mathis.macamera.GrabberCamera(this.mathisFrame, grabber0);
                camera.translationSpeed = this.fondamentalDomainSize * 0.5;
                camera.checkCollisions = this.collisionForCamera;
                //cam.useOnlyFreeMode=true
                //this.cam.changePosition(this.cameraInitialPosition)
                //this.cam.changeFrontDir(this.cameraFrontDir)//new XYZ(-0.5,-1,1.5)
                camera.keysFrontward = [66, 78];
                camera.keysBackward = [32];
                camera.attachControl(this.mathisFrame.canvas);
                this.mathisFrame.scene.activeCamera = camera;
                // Ajout d'une lumière
                var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(-1, 1, -1), this.mathisFrame.scene);
                light0.diffuse = new BABYLON.Color3(1, 1, 1);
                light0.specular = new BABYLON.Color3(0., 0., 0.);
                light0.groundColor = new BABYLON.Color3(0, 0, 0.3);
                var camPosInWebCoor = new mathis.XYZ(0, 0, 0);
                var camDomain = new mathis.periodicWorld.Domain(0, 0, 0);
                var camDomainCenter = new mathis.XYZ(0, 0, 0);
                this.fd = new mathis.periodicWorld.CartesianFundamentalDomain(new mathis.XYZ(this.fondamentalDomainSize, 0, 0), new mathis.XYZ(0, this.fondamentalDomainSize, 0), new mathis.XYZ(0, 0, this.fondamentalDomainSize));
                if (this.drawFondamentalDomain) {
                    this.fd.drawMe(this.mathisFrame.scene);
                    this.fd.getArretes(this.mathisFrame.scene);
                }
                camera.onTranslate = function () {
                    if (_this.recenterCamera) {
                        _this.fd.pointToWebCoordinate(camera.trueCamPos.position, camPosInWebCoor);
                        camDomain.whichContains(camPosInWebCoor);
                        camDomain.getCenter(_this.fd, camDomainCenter);
                        /**attention, il faut changer simultanément la truePosition et la wished position. Donc mettre le smoothing à false*/
                        camera.changePosition(camera.whishedCamPos.getPosition().substract(camDomainCenter), false);
                    }
                };
            };
            InfiniteCartesian.prototype.creationOfReseau = function () {
                var basis = new mathis.reseau.BasisForRegularReseau();
                basis.end = new mathis.XYZ(this.fondamentalDomainSize, this.fondamentalDomainSize, 0);
                basis.nbI = this.nbSubdivision;
                basis.nbJ = this.nbSubdivision;
                basis.origin = new mathis.XYZ(0, 0, 0);
                basis.nbVerticalDecays = this.nbVerticalDecays;
                basis.nbHorizontalDecays = this.nbHorizontalDecays;
                var VV = basis.go();
                var crea = new mathis.reseau.Regular3D();
                crea.nbI = this.nbSubdivision * this.nbRepetition;
                crea.nbJ = this.nbSubdivision * this.nbRepetition;
                crea.nbK = this.nbSubdivision * this.nbRepetition;
                crea.Vi = VV.Vi;
                crea.Vj = VV.Vj;
                crea.Vk = new mathis.XYZ(0, 0, this.fondamentalDomainSize / (this.nbSubdivision - 1));
                crea.makeTriangleOrSquare = false;
                crea.createIKSquaresOrTriangles = false;
                crea.createJKSquares = false;
                if (this.nameOfResau3d == NameOfReseau3D.hexagone || this.nameOfResau3d == NameOfReseau3D.doubleHexagone) {
                    crea.strateHaveSquareMailleVersusTriangleMaille = false;
                }
                if (this.nameOfResau3d == NameOfReseau3D.doubleHexagone) {
                    crea.interStrateMailleAreSquareVersusTriangle = false;
                    crea.decayOddStrates = true;
                }
                //let totalSize=this.nbSubdivision*this.nbRepetition*VV.Vi.length()
                var totalSize = this.getTotalSize();
                crea.origine = new mathis.XYZ(-totalSize / 2, -totalSize / 2, -totalSize / 2);
                if (this.notDrawMeshesAtFarCorners)
                    crea.putAVertexOnlyAtXYZCheckingThisCondition = function (xyz) { return xyz.length() < (totalSize * 0.6); };
                this.mamesh = crea.go();
                this.mamesh.fillLineCatalogue();
            };
            InfiniteCartesian.prototype.getTotalSize = function () {
                return this.nbRepetition * this.fondamentalDomainSize;
            };
            InfiniteCartesian.prototype.vertexVisualization = function (mamesh2, wallDiffuseTexture) {
                var model = BABYLON.Mesh.CreateBox('', 0.5, this.mathisFrame.scene);
                var material = new BABYLON.StandardMaterial('', this.mathisFrame.scene);
                material.diffuseTexture = wallDiffuseTexture;
                model.material = material;
                model.convertToFlatShadedMesh();
                var verticesVisuMaker = new mathis.visu3d.VerticesViewer(mamesh2, this.mathisFrame.scene);
                verticesVisuMaker.meshModel = model;
                verticesVisuMaker.checkCollision = this.collisionOnVertices;
                var positioning = new mathis.Positioning();
                positioning.upVector = new mathis.XYZ(1, 0, 0);
                positioning.frontDir = new mathis.XYZ(0, 1, 0);
                verticesVisuMaker.positionings = new mathis.HashMap();
                for (var _i = 0, _a = mamesh2.vertices; _i < _a.length; _i++) {
                    var v = _a[_i];
                    verticesVisuMaker.positionings.putValue(v, positioning);
                }
                verticesVisuMaker.go();
            };
            InfiniteCartesian.prototype.linksVisualization = function (ma, wallDiffuseTexture) {
                var model;
                if (this.nbSidesOfLinks == 4)
                    model = BABYLON.Mesh.CreateBox('', 1, this.mathisFrame.scene);
                else
                    model = BABYLON.Mesh.CreateCylinder('', 1, 1, 1, this.nbSidesOfLinks, null, this.mathisFrame.scene);
                var material = new BABYLON.StandardMaterial('', this.mathisFrame.scene);
                material.diffuseColor = new BABYLON.Color3(0.6, 0.6, 0.6);
                material.diffuseTexture = wallDiffuseTexture;
                model.material = material;
                model.convertToFlatShadedMesh();
                var linksViewer = new mathis.visu3d.LinksViewer(ma, this.mathisFrame.scene);
                linksViewer.lateralScalingConstant = 0.2;
                /**collision sur les poutres pas terrible*/
                linksViewer.checkCollision = this.collisionOnLinks;
                linksViewer.meshModel = model;
                var vec100 = new mathis.XYZ(1, 0, 0);
                var vec010 = new mathis.XYZ(0, 1, 0);
                linksViewer.pairVertexToLateralDirection = function (v1, v2) {
                    if (Math.abs(mathis.geo.dot(mathis.XYZ.newFrom(v1.position).substract(v2.position), vec100)) < 0.0001)
                        return vec100;
                    else
                        return vec010;
                };
                linksViewer.go();
            };
            InfiniteCartesian.prototype.fogAndSkybox = function () {
                var skybox = BABYLON.Mesh.CreateBox("skyBox", 50. * this.fondamentalDomainSize, this.mathisFrame.scene);
                this.mathisFrame.skybox = skybox;
                //skybox.checkCollisions=true
                skybox.visibility = 1;
                /**je ne comprend pas pourquoi le brouillar ne marche pas quand on ne met pas de sky box...*/
                var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", this.mathisFrame.scene);
                skyboxMaterial.backFaceCulling = false;
                skybox.material = skyboxMaterial;
                skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
                skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
                skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/skybox/skybox", this.mathisFrame.scene, ['_px.jpg', '_py.jpg', '_pz.jpg', '_nx.jpg', '_ny.jpg', '_nz.jpg']);
                skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
                //this.mathisFrame.scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
                this.mathisFrame.scene.fogDensity = this.fogDensity; //this.fondamentalDomainSize;
                this.mathisFrame.scene.fogColor = new BABYLON.Color3(1, 1, 1);
            };
            return InfiniteCartesian;
        }());
        infiniteWorlds.InfiniteCartesian = InfiniteCartesian;
    })(infiniteWorlds = mathis.infiniteWorlds || (mathis.infiniteWorlds = {}));
})(mathis || (mathis = {}));
