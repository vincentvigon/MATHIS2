var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var mathis;
(function (mathis) {
    var Color3 = BABYLON.Color3;
    var gauss;
    (function (gauss) {
        var StandardMaterial = BABYLON.StandardMaterial;
        function start() {
            var mainDiv = document.getElementById("mainDiv");
            var frame = new mathis.MathisFrame("surfaceMathisFrame", false);
            var frame2 = new mathis.MathisFrame("sphereMathisFrame", false);
            var buttonPlace = mathis.legend('30px', mainDiv, false);
            new GaussCurvature(frame, frame2, buttonPlace);
        }
        gauss.start = start;
        var DrawNormalAndTangentVector = (function () {
            function DrawNormalAndTangentVector(cartes, scene, sphereScene, cam, surface) {
                this.sizes = new mathis.XYZ(1, 1, 1);
                this.arrowColor = new Color3(1, 0, 0);
                this.planeColor = new Color3(0, 0, 1);
                this.planeRadius = 0.2;
                this.tangentDiameter = 0.1;
                this.cartes = cartes;
                this.surfaceScene = scene;
                this.cam = cam;
                this.sphereScene = sphereScene;
                this.surface = surface;
            }
            DrawNormalAndTangentVector.prototype.checkOrientation = function (u, v, carte) {
                var pointToCam = mathis.XYZ.newFrom(this.cam.trueCamPos.position).substract(carte.X(u, v));
                if (mathis.geo.dot(pointToCam, carte.newN(u, v)) < 0)
                    carte.orientationCoef *= -1;
            };
            DrawNormalAndTangentVector.prototype.oneArrowOnOneScene = function (point, quaternion, scene, sizes) {
                var creatorArrowMesh = new mathis.creation3D.ArrowCreator(scene);
                var arrow = creatorArrowMesh.go();
                arrow.position = point;
                arrow.rotationQuaternion = quaternion;
                var mat = new BABYLON.StandardMaterial('', scene);
                mat.diffuseColor = this.arrowColor;
                arrow.material = mat;
                arrow.scaling = sizes;
                return arrow;
            };
            DrawNormalAndTangentVector.prototype.drawNormalVectors = function (u, v, carte) {
                this.checkOrientation(u, v, carte);
                var positionning = new mathis.Positioning();
                positionning.upVector = carte.newN(u, v);
                var quat = positionning.quaternion();
                var initial = this.oneArrowOnOneScene(carte.X(u, v), quat, this.surfaceScene, this.sizes);
                var onSphere = this.oneArrowOnOneScene(new mathis.XYZ(0, 0, 0), quat.clone(), this.sphereScene, new mathis.XYZ(this.sizes.x, 1, this.sizes.z));
                return { initial: initial, onSphere: onSphere };
            };
            DrawNormalAndTangentVector.prototype.oneTangentPlane = function (normal, tangent, position, scene, onClick) {
                if (onClick === void 0) { onClick = null; }
                var res = BABYLON.Mesh.CreateDisc('', this.planeRadius, 60, scene);
                var qua = new mathis.XYZW(0, 0, 0, 0);
                mathis.geo.aQuaternionMovingABtoCD(new mathis.XYZ(0, 0, 1), new mathis.XYZ(1, 0, 0), normal.scale(-1), tangent, qua, false);
                res.rotationQuaternion = qua;
                res.position = position;
                var biMat = new BABYLON.StandardMaterial('', scene);
                biMat.sideOrientation = BABYLON.Mesh.DOUBLESIDE;
                biMat.diffuseColor = this.planeColor;
                biMat.backFaceCulling = false;
                res.material = biMat;
                if (onClick != null) {
                    ;
                    res.onClick = onClick;
                }
                return res;
            };
            DrawNormalAndTangentVector.prototype.drawOneTangentVector = function (deb, end, scene) {
                if (mathis.geo.distance(deb, end) < 2 * mathis.geo.epsilon)
                    return;
                var arrowCrea = new mathis.creation3D.ArrowCreator(scene);
                arrowCrea.arrowFootAtOrigin = false;
                var arrowMesh = arrowCrea.go();
                var mat = new StandardMaterial('', scene);
                mat.diffuseColor = new Color3(1, 0, 0);
                arrowMesh.material = mat;
                var elongate = new mathis.visu3d.ElongateAMeshFromBeginToEnd(deb, end, arrowMesh);
                elongate.lateralScaling = this.tangentDiameter * 2;
                elongate.goChanging();
                return arrowMesh;
            };
            DrawNormalAndTangentVector.prototype.drawTangentPlanes = function (u, v, carte, clickOnPlaneNow, meshesToDispose) {
                var _this = this;
                this.checkOrientation(u, v, carte);
                var onClick = null;
                if (clickOnPlaneNow) {
                    this.surface.isPickable = false;
                    onClick = function (clickXyz) {
                        meshesToDispose.push(_this.drawOneTangentVector(carte.X(u, v), clickXyz, _this.surfaceScene));
                        var tangent = mathis.XYZ.newFrom(clickXyz).substract(carte.X(u, v));
                        var dNtangent = carte.dNaction(u, v, tangent);
                        var begin = carte.newN(u, v);
                        var end = mathis.XYZ.newFrom(begin).add(dNtangent);
                        meshesToDispose.push(_this.drawOneTangentVector(begin, end, _this.sphereScene));
                    };
                }
                meshesToDispose.push(this.oneTangentPlane(carte.newN(u, v), carte.Xu(u, v), carte.X(u, v), this.surfaceScene, onClick));
                meshesToDispose.push(this.oneTangentPlane(carte.newN(u, v), carte.Xu(u, v), carte.newN(u, v), this.sphereScene));
            };
            return DrawNormalAndTangentVector;
        }());
        var PointOfView;
        (function (PointOfView) {
            PointOfView[PointOfView["vue_libre"] = 0] = "vue_libre";
            PointOfView[PointOfView["vue_de_face"] = 1] = "vue_de_face";
            PointOfView[PointOfView["vue_de_dos"] = 2] = "vue_de_dos";
            PointOfView[PointOfView["vue_de_gauche"] = 3] = "vue_de_gauche";
            PointOfView[PointOfView["vue_de_droite"] = 4] = "vue_de_droite";
            PointOfView[PointOfView["vue_du_haut"] = 5] = "vue_du_haut";
            PointOfView[PointOfView["vue_du_bas"] = 6] = "vue_du_bas";
        })(PointOfView || (PointOfView = {}));
        var GaussCurvature = (function () {
            function GaussCurvature(surfaceMathisFrame, sphereMathisFrame, localButtonPlace) {
                var _this = this;
                this.meshesToDispose = [];
                this.normalize = false;
                this.mode = 0;
                this.$tangentSpace = null;
                this.$surfaceName = null;
                this.$pointOfVue = null;
                this.$courbure = null;
                this.recul = -3;
                this.pointOfViewToPos = [null, new mathis.XYZ(0, 0, this.recul), new mathis.XYZ(0, 0, -this.recul), new mathis.XYZ(this.recul, 0, 0), new mathis.XYZ(-this.recul, 0, 0), new mathis.XYZ(0, this.recul, 0), new mathis.XYZ(0, -this.recul, 0)];
                this.pointOfViewToUpVector = [null, new mathis.XYZ(0, 1, 0), new mathis.XYZ(0, 1, 0), new mathis.XYZ(0, 1, 0), new mathis.XYZ(0, 1, 0), new mathis.XYZ(0, 0, 1), new mathis.XYZ(0, 0, 1)];
                this.surfaceScene = surfaceMathisFrame.scene;
                this.sphereScene = sphereMathisFrame.scene;
                this.surfaceMathisFrame = surfaceMathisFrame;
                this.localButtonPlace = localButtonPlace;
                this.createGaussSphereScene(sphereMathisFrame);
                this.createSurfaceScene(surfaceMathisFrame);
                this.createSurface(mathis.riemann.SurfaceName.torus);
                this.drawNormalVector = new DrawNormalAndTangentVector(this.surface.cartes, this.surfaceScene, this.sphereScene, this.surfaceCamera, this.meshSurf);
                this.drawNormalVector.sizes = new mathis.XYZ(0.1, 0.1, 0.1);
                this.resetInitialClick();
                this.addControlButton();
                this.surfaceCamera.onPositioningChange = function (positioning) { _this.onPositioningChange(positioning); };
            }
            GaussCurvature.prototype.createSurface = function (surfaceName) {
                var surfaceMaker = new mathis.riemann.SurfaceMaker(surfaceName);
                this.surface = surfaceMaker.go();
                this.drawMesh(this.surface.wholeSurfaceMesh);
            };
            GaussCurvature.prototype.onPositioningChange = function (positioning) {
                {
                    var length_1 = this.sphereCamera.trueCamPos.position.length();
                    positioning.position.normalize().scale(length_1);
                    this.sphereCamera.trueCamPos.copyFrom(positioning);
                    this.sphereCamera.whishedCamPos.copyFrom(positioning);
                    this.$pointOfVue.selectedIndex = 0;
                }
            };
            GaussCurvature.prototype.setMapMode = function () {
                this.mode = 0;
                this.normalize = false;
            };
            GaussCurvature.prototype.setDifferenceMode = function () {
                this.mode = 1;
                this.normalize = false;
            };
            GaussCurvature.prototype.setNormalisedDifferenceMode = function () {
                this.mode = 2;
                this.normalize = true;
            };
            GaussCurvature.prototype.setDeriveMode = function () {
                this.mode = 3;
                this.normalize = false;
                this.$tangentSpace.selectedIndex = 2;
            };
            GaussCurvature.prototype.addControlButton = function () {
                var _this = this;
                window.onload = function () {
                    {
                        var surfaceNames = mathis.allStringValueOfEnume(mathis.riemann.SurfaceName);
                        _this.$surfaceName = document.createElement("select");
                        _this.localButtonPlace.appendChild(_this.$surfaceName);
                        for (var i = 0; i < surfaceNames.length; i++) {
                            var option = document.createElement("option");
                            option.value = surfaceNames[i];
                            option.text = surfaceNames[i];
                            _this.$surfaceName.appendChild(option);
                        }
                        _this.$surfaceName.onchange = function () {
                            _this.clearAll();
                            _this.createSurface(_this.$surfaceName.selectedIndex);
                            _this.drawNormalVector = new DrawNormalAndTangentVector(_this.surface.cartes, _this.surfaceScene, _this.sphereScene, _this.surfaceCamera, _this.meshSurf);
                            _this.drawNormalVector.sizes = new mathis.XYZ(0.1, 0.1, 0.1);
                        };
                    }
                    {
                        var vueNames = mathis.allStringValueOfEnume(PointOfView);
                        _this.$pointOfVue = document.createElement("select");
                        _this.localButtonPlace.appendChild(_this.$pointOfVue);
                        for (var i = 0; i < vueNames.length; i++) {
                            var option = document.createElement("option");
                            option.value = vueNames[i];
                            option.text = vueNames[i];
                            _this.$pointOfVue.appendChild(option);
                        }
                        _this.$pointOfVue.onchange = function (ev) {
                            if (_this.$pointOfVue.selectedIndex > 0) {
                                var position = mathis.XYZ.newFrom(_this.pointOfViewToPos[_this.$pointOfVue.selectedIndex]);
                                var upVector = mathis.XYZ.newFrom(_this.pointOfViewToUpVector[_this.$pointOfVue.selectedIndex]);
                                var positioning = new mathis.Positioning();
                                positioning.position = position;
                                positioning.frontDir = mathis.XYZ.newFrom(position).scale(-1);
                                positioning.upVector = upVector;
                                _this.surfaceCamera.trueCamPos.copyFrom(positioning);
                                _this.surfaceCamera.whishedCamPos.copyFrom(positioning);
                                _this.sphereCamera.trueCamPos.copyFrom(positioning);
                                _this.sphereCamera.whishedCamPos.copyFrom(positioning);
                            }
                        };
                        _this.$pointOfVue.selectedIndex = 1;
                        _this.$pointOfVue.onchange(null);
                    }
                    {
                        var array = ["gauss map", "difference", "différence normalisé"];
                        var selectList_1 = document.createElement("select");
                        _this.localButtonPlace.appendChild(selectList_1);
                        for (var i = 0; i < array.length; i++) {
                            var option = document.createElement("option");
                            option.value = array[i];
                            option.text = array[i];
                            selectList_1.appendChild(option);
                        }
                        selectList_1.onchange = function () {
                            if (selectList_1.selectedIndex == 0)
                                _this.setMapMode();
                            else if (selectList_1.selectedIndex == 1)
                                _this.setDifferenceMode();
                            else if (selectList_1.selectedIndex == 2)
                                _this.setNormalisedDifferenceMode();
                            else if (selectList_1.selectedIndex == 3)
                                _this.setDeriveMode();
                        };
                    }
                    {
                        var array = ["pas d'espace tangent", "petit espace tangent", "grand espace tangent"];
                        _this.$tangentSpace = document.createElement("select");
                        _this.localButtonPlace.appendChild(_this.$tangentSpace);
                        for (var i = 0; i < array.length; i++) {
                            var option = document.createElement("option");
                            option.value = array[i];
                            option.text = array[i];
                            _this.$tangentSpace.appendChild(option);
                        }
                    }
                    {
                        var buttonClear = document.createElement('button');
                        buttonClear.classList.add("buttonClear");
                        buttonClear.innerHTML = '<i class="fa fa-eraser"></i>';
                        buttonClear.onclick = function () {
                            _this.clearAllSecondaryMeshes();
                        };
                        _this.localButtonPlace.appendChild(buttonClear);
                        _this.$courbure = document.createElement('span');
                        _this.localButtonPlace.appendChild(_this.$courbure);
                        _this.$surfaceName.selectedIndex = mathis.riemann.SurfaceName.torus;
                    }
                };
            };
            GaussCurvature.prototype.clearAllSecondaryMeshes = function () {
                this.meshesToDispose.forEach(function (m) {
                    if (m != null)
                        m.dispose();
                });
                this.meshesToDispose = [];
                this.resetInitialClick();
            };
            GaussCurvature.prototype.resetInitialClick = function () {
                var _this = this;
                this.meshSurf.isPickable = true;
                this.meshSurf.onClick = function (clickedPoint) { _this.firstClick(clickedPoint); };
            };
            GaussCurvature.prototype.clearAll = function () {
                this.clearAllSecondaryMeshes();
                this.meshSurf.dispose();
                this.linesOnSurf.forEach(function (m) { return m.dispose(); });
                this.$pointOfVue.selectedIndex = 1;
                this.$pointOfVue.onchange(null);
            };
            GaussCurvature.prototype.firstClick = function (clickedPoint) {
                var _this = this;
                var uvAndCarte = this.surface.findBestCarte(clickedPoint);
                var UV = uvAndCarte.uv;
                var carte = uvAndCarte.carte;
                var color;
                if (this.mode == 0)
                    color = new Color3(Math.random(), Math.random(), Math.random());
                else
                    color = new Color3(0, 1, 0);
                this.drawNormalVector.arrowColor = color;
                var twoMesh = this.drawNormalVector.drawNormalVectors(UV.u, UV.v, carte);
                this.meshesToDispose.push(twoMesh.initial);
                this.meshesToDispose.push(twoMesh.onSphere);
                if (this.$tangentSpace.selectedIndex != 0) {
                    if (this.$tangentSpace.selectedIndex == 1)
                        this.drawNormalVector.planeRadius = 0.03;
                    else if (this.$tangentSpace.selectedIndex == 2)
                        this.drawNormalVector.planeRadius = 0.1;
                    this.drawNormalVector.drawTangentPlanes(UV.u, UV.v, carte, (this.mode == 3), this.meshesToDispose);
                }
                if (this.mode == 1 || this.mode == 2) {
                    ;
                    this.meshSurf.onClick = function (secondClicked) {
                        var secondUvAndCarte = _this.surface.findBestCarte(secondClicked);
                        if (secondUvAndCarte.carte != carte) {
                            cc("the second click is too far from the first: they arrived on different cart-image");
                        }
                        else {
                            _this.secondClick(UV, secondUvAndCarte.uv, secondUvAndCarte.carte);
                        }
                        _this.resetInitialClick();
                    };
                }
                var courbure = mathis.roundWithGivenPrecision(carte.dNinTangentBasis(UV.u, UV.v).determinant(), 1);
                this.$courbure.textContent = " Courbure:" + courbure;
            };
            GaussCurvature.prototype.secondClick = function (UVcenter, UVclicked, carte) {
                var _this = this;
                var initialLength = mathis.geo.distance(carte.X(UVcenter.u, UVcenter.v), carte.X(UVclicked.u, UVclicked.v));
                var initialLengthOnSphere = mathis.geo.distance(carte.newN(UVcenter.u, UVcenter.v), carte.newN(UVclicked.u, UVclicked.v));
                var alphas = [];
                var pas = 0.01;
                var alpha = 0;
                var alphaMax = (this.mode == 1) ? 0.8 : 0.95;
                while (alpha < alphaMax) {
                    alphas.push(alpha);
                    alpha += pas;
                }
                var count = 0;
                var pointCenter = carte.X(UVcenter.u, UVcenter.v);
                var currentNormal = null;
                var currentDifference = { initial: null, onSphere: null };
                var action = new mathis.PeriodicAction(function () {
                    var UVinter = new mathis.UV(0, 0);
                    mathis.geo.betweenUV(UVclicked, UVcenter, alphas[count], UVinter);
                    if (currentNormal != null) {
                        currentNormal.initial.dispose();
                        currentNormal.onSphere.dispose();
                    }
                    currentNormal = _this.drawNormalVector.drawNormalVectors(UVinter.u, UVinter.v, carte);
                    count++;
                    if (count != alphas.length + 1) {
                        if (currentDifference.initial != null)
                            currentDifference.initial.dispose();
                        if (currentDifference.onSphere != null)
                            currentDifference.onSphere.dispose();
                    }
                    var arrivalOnSurface;
                    var arrivalOnSphere;
                    if (_this.normalize) {
                        var differenceOnSurface = carte.X(UVinter.u, UVinter.v).substract(pointCenter);
                        if (differenceOnSurface.lengthSquared() < mathis.geo.epsilonSquare)
                            return;
                        differenceOnSurface.normalize().scale(initialLength);
                        arrivalOnSurface = mathis.XYZ.newFrom(pointCenter).add(differenceOnSurface);
                        var differenceOnSphere = carte.newN(UVinter.u, UVinter.v).substract(carte.newN(UVcenter.u, UVcenter.v));
                        if (differenceOnSphere.length() > mathis.geo.epsilon)
                            differenceOnSphere.normalize().scale(initialLengthOnSphere);
                        arrivalOnSphere = mathis.XYZ.newFrom(carte.newN(UVcenter.u, UVcenter.v)).add(differenceOnSphere);
                    }
                    else {
                        arrivalOnSurface = carte.X(UVinter.u, UVinter.v);
                        arrivalOnSphere = carte.newN(UVinter.u, UVinter.v);
                    }
                    currentDifference.initial = _this.drawNormalVector.drawOneTangentVector(pointCenter, arrivalOnSurface, _this.surfaceScene);
                    currentDifference.onSphere = _this.drawNormalVector.drawOneTangentVector(carte.newN(UVcenter.u, UVcenter.v), arrivalOnSphere, _this.sphereScene);
                    _this.meshesToDispose.push(currentDifference.initial);
                    _this.meshesToDispose.push(currentDifference.onSphere);
                });
                action.nbTimesThisActionMustBeFired = alphas.length + 1;
                action.timeIntervalMilli = 3000 / alphas.length;
                this.surfaceMathisFrame.pushPeriodicAction(action);
            };
            GaussCurvature.prototype.createGaussSphereScene = function (sphereFrame) {
                var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(-1, 1, -1), sphereFrame.scene);
                light0.diffuse = new BABYLON.Color3(1, 1, 1);
                light0.specular = new BABYLON.Color3(1, 1, 1);
                light0.groundColor = new BABYLON.Color3(0, 0, 0);
                var grabber = new mathis.macamera.SphericalGrabber(sphereFrame.scene, new mathis.XYZ(1, 1, 1));
                grabber.endOfZone1 = 0.;
                grabber.endOfZone2 = 0.;
                grabber.mesh.visibility = 1;
                grabber.showGrabberOnlyWhenGrabbing = false;
                var mat = new BABYLON.StandardMaterial('', sphereFrame.scene);
                mat.alpha = 0.3;
                mat.diffuseColor = new Color3(1, 1, 1);
                grabber.mesh.material = mat;
                var cam = new mathis.macamera.GrabberCamera(sphereFrame, grabber);
                cam.useFreeModeWhenCursorOutOfGrabber = false;
                this.sphereCamera = cam;
            };
            GaussCurvature.prototype.createSurfaceScene = function (surfaceFrame) {
                var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(-1, 1, -1), surfaceFrame.scene);
                light0.diffuse = new BABYLON.Color3(1, 1, 1);
                light0.specular = new BABYLON.Color3(1, 1, 1);
                light0.groundColor = new BABYLON.Color3(0, 0, 0);
                var grabber = new mathis.macamera.SphericalGrabber(surfaceFrame.scene, new mathis.XYZ(1, 1, 1));
                grabber.endOfZone1 = 2;
                grabber.endOfZone2 = 2;
                grabber.showGrabberOnlyWhenGrabbing = true;
                var cam = new mathis.macamera.GrabberCamera(surfaceFrame, grabber);
                cam.showPredefinedConsoleLog = false;
                cam.useFreeModeWhenCursorOutOfGrabber = false;
                this.surfaceCamera = cam;
            };
            GaussCurvature.prototype.drawMesh = function (mesh) {
                var lineFiller = new mathis.lineModule.LineComputer(mesh);
                lineFiller.startingVertices = [];
                for (var _i = 0, _a = mesh.vertices; _i < _a.length; _i++) {
                    var vertex = _a[_i];
                    if (vertex.param.x % 4 == 0 && vertex.param.y == 0)
                        lineFiller.startingVertices.push(vertex);
                    if (vertex.param.x == 0 && vertex.param.y % 4 == 0)
                        lineFiller.startingVertices.push(vertex);
                }
                lineFiller.go();
                var lin = new mathis.visu3d.LinesViewer(mesh, this.surfaceScene);
                lin.constantRadius = 0.004;
                this.linesOnSurf = lin.go();
                this.linesOnSurf.forEach(function (mesh) { return mesh.isPickable = false; });
                var surf = new mathis.visu3d.SurfaceViewer(mesh, this.surfaceScene);
                this.meshSurf = surf.go();
                this.resetInitialClick();
            };
            return GaussCurvature;
        }());
    })(gauss = mathis.gauss || (mathis.gauss = {}));
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    var testFront;
    (function (testFront) {
        function start() {
            var mathisFrame = new mathis.MathisFrame(null, false);
            mathisFrame.resetScene();
            mathisFrame.addDefaultCamera();
            mathisFrame.addDefaultLight();
            var box = BABYLON.Mesh.CreateBox('', 1, mathisFrame.scene);
            var mat = new BABYLON.StandardMaterial('', mathisFrame.scene);
            mat.diffuseColor = new BABYLON.Color3(1, 0, 0);
            box.material = mat;
        }
        testFront.start = start;
        function testCamera(mathisFrame) {
            var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(-1, 1, -1), mathisFrame.scene);
            light0.diffuse = new BABYLON.Color3(1, 1, 1);
            light0.specular = new BABYLON.Color3(1, 1, 1);
            light0.groundColor = new BABYLON.Color3(0.5, 0.5, 0.5);
            var center = new mathis.XYZ(3, 0, 0);
            var sphereRadius = 2;
            var grabber = new mathis.macamera.SphericalGrabber(mathisFrame.scene, new mathis.XYZ(sphereRadius, sphereRadius, sphereRadius), center);
            grabber.mesh.material.alpha = 0.6;
            grabber.showGrabberOnlyWhenGrabbing = false;
            grabber.endOfZone1 = 0;
            grabber.endOfZone2 = 0;
            var macam = new mathis.macamera.GrabberCamera(mathisFrame, grabber);
            macam.useFreeModeWhenCursorOutOfGrabber = false;
            macam.changePosition(new mathis.XYZ(-1, -1, -10), false);
            macam.attachControl(mathisFrame.canvas);
            var box = BABYLON.Mesh.CreateBox('', 1, mathisFrame.scene);
            var mat = new BABYLON.StandardMaterial('', mathisFrame.scene);
            mat.diffuseColor = new BABYLON.Color3(1, 0, 0);
            box.material = mat;
        }
        function testdiffSys(mathisFrame) {
            var width = 5;
            var height = 2;
            var origin = new mathis.XYZ(-width / 2, -height / 2, 0);
            function to01(xyz, res) {
                res.copyFrom(xyz);
                res.substract(origin);
                res.x /= width;
                res.y /= height;
            }
            function toWH(xyz, res) {
                res.copyFrom(xyz);
                res.x *= width;
                res.y *= height;
                res.add(origin);
            }
            var vectorField0;
            {
                var scaled_1 = new mathis.XYZ(0, 0, 0);
                var A1_1 = function (t) { return 0.4 * Math.sin(0.5 * t); };
                var A2_1 = function (t) { return 0.2 * Math.sin(0.5 * t); };
                var a11_1 = function (t) { return 0; };
                var a12_1 = function (t) { return 0; };
                var a21_1 = function (t) { return 0; };
                var a22_1 = function (t) { return 0; };
                vectorField0 = function (t, p, res) {
                    to01(p, scaled_1);
                    var raX = (scaled_1.x - 0.5) * 2;
                    var raY = (scaled_1.y - 0.5) * 4;
                    res.x = -raX * raY * raY;
                    res.y = -raX * raX * raY;
                    res.x += scaled_1.x * (A1_1(t) + a11_1(t) * scaled_1.x + a12_1(t) * scaled_1.y);
                    res.y += scaled_1.y * (A2_1(t) + a21_1(t) * scaled_1.x + a22_1(t) * scaled_1.y);
                };
            }
            var diffsyst = new mathis.differentialSystem.TwoDim(vectorField0, mathisFrame);
            diffsyst.go();
        }
        function testIsing(mathisFrame) {
            var ising = new mathis.mecaStat.IsingOnMesh(mathisFrame);
            ising.go();
        }
        function testInfiniteWorld(mathisFrame) {
            var infi = new mathis.infiniteWorlds.InfiniteCartesian(mathisFrame);
            infi.nbRepetition = 8;
            infi.nbSubdivision = 3;
            infi.fondamentalDomainSize = 6;
            infi.nbHorizontalDecays = 1;
            infi.nbVerticalDecays = 1;
            infi.nameOfResau3d = mathis.infiniteWorlds.NameOfReseau3D.cube;
            infi.collisionForCamera = true;
            infi.collisionOnLinks = true;
            infi.collisionOnVertices = true;
            var mesh = BABYLON.Mesh.CreateSphere('', 5, 10, mathisFrame.scene);
            mesh.position = new mathis.XYZ(1, 1, 1);
            infi.go();
            infi.seeWorldFromInside();
        }
    })(testFront = mathis.testFront || (mathis.testFront = {}));
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    var appli;
    (function (appli) {
        (function (Keywords) {
            Keywords[Keywords["basic"] = 0] = "basic";
            Keywords[Keywords["tool"] = 1] = "tool";
            Keywords[Keywords["math"] = 2] = "math";
            Keywords[Keywords["forDeveloper"] = 3] = "forDeveloper";
            Keywords[Keywords["proba"] = 4] = "proba";
        })(appli.Keywords || (appli.Keywords = {}));
        var Keywords = appli.Keywords;
        var conv;
        (function (conv) {
            conv.$$$ = '$$$';
            conv.spacesToSuppress = '                ';
            conv.toIncludeAtTheBeginOfTheFirstHiddenPiece = ["var mathisFrame=new mathis.MathisFrame()"];
            conv.traitementsForEachLine = [
                function (line) {
                    return line.replace(/this.mathisFrame\./g, "mathisFrame\.");
                }
            ];
            conv.begin = ["$$$begin", "$$$b"];
            conv.beginHidden = ["$$$beginHidden", "$$$bh"];
            conv.end = ["$$$end", "$$$e"];
            conv.endHidden = ["$$$endHidden", "$$$eh"];
        })(conv = appli.conv || (appli.conv = {}));
        (function (ChoicesOptionsType) {
            ChoicesOptionsType[ChoicesOptionsType["select"] = 0] = "select";
            ChoicesOptionsType[ChoicesOptionsType["button"] = 1] = "button";
        })(appli.ChoicesOptionsType || (appli.ChoicesOptionsType = {}));
        var ChoicesOptionsType = appli.ChoicesOptionsType;
        var Choices = (function () {
            function Choices(values, options) {
                if (options === void 0) { options = null; }
                this.$select = null;
                this.$button = null;
                this.values = values;
                if (options != null)
                    this.options = options;
                else
                    this.options = {};
            }
            Choices.prototype.changePossibleValues = function (values, visualValues, indexPage) {
                if (visualValues === void 0) { visualValues = null; }
                if (indexPage === void 0) { indexPage = null; }
                if (visualValues != null && values.length != visualValues.length)
                    throw "values.length and visualValues.length must be equal for:" + this.key;
                this.values = values;
                if (visualValues != null)
                    this.options.visualValues = visualValues;
                if (this.$select != null) {
                    for (var i = 0; i < this.$select.options.length; i++) {
                        this.$select.options[i] = null;
                    }
                    for (var i = 0; i < this.values.length; i++) {
                        var option = document.createElement("option");
                        option.value = this.values[i];
                        var textOption = "";
                        if (indexPage && indexPage.testMode)
                            textOption = this.key + ":";
                        if (this.options.visualValues != null) {
                            textOption += this.options.visualValues[i];
                        }
                        else
                            textOption += this.values[i];
                        option.text = textOption;
                        this.$select.appendChild(option);
                    }
                }
                else if (this.$button != null) {
                    if (this.options.visualValues != null)
                        this.$button.visualValues = this.options.visualValues;
                    else
                        for (var i = 0; i < this.values.length; i++) {
                            this.$button.visualValues.push(this.values[i]);
                        }
                }
            };
            Choices.prototype.show = function () {
                this.$parent.show();
            };
            Choices.prototype.hide = function () {
                this.$parent.hide();
            };
            return Choices;
        }());
        appli.Choices = Choices;
        function buildCommandDico(pieceOfCode) {
            if (pieceOfCode.COMMAND_DICO != null)
                throw "command dico was already made for the piece of code:" + pieceOfCode.NAME;
            var res = new mathis.StringMap();
            for (var $$$key in pieceOfCode) {
                if (pieceOfCode.hasOwnProperty($$$key) && $$$key.slice(0, 3) == conv.$$$) {
                    var key = $$$key.slice(3);
                    var choicesOb = pieceOfCode[$$$key];
                    if ($.isArray(choicesOb)) {
                        choicesOb = new Choices(choicesOb);
                        pieceOfCode[$$$key] = choicesOb;
                    }
                    else if (!(choicesOb instanceof Choices))
                        throw "the attribute '$$$" + key + "'  must be an array or of Type Choices because it start by 3$";
                    choicesOb.key = key;
                    if (res.getValue(key) != null)
                        throw 'a configuration attribute is duplicated ';
                    res.putValue(key, choicesOb);
                }
            }
            for (var _i = 0, _a = res.allKeys(); _i < _a.length; _i++) {
                var key = _a[_i];
                if (pieceOfCode[key] === undefined)
                    throw 'no attribute associate to  $$$' + key;
            }
            pieceOfCode.COMMAND_DICO = res;
        }
        appli.buildCommandDico = buildCommandDico;
        var Binder = (function () {
            function Binder(pieceOfCode, defaultContainer, mathisFrame) {
                this.pieceOfCode = pieceOfCode;
                this.defaultContainer = defaultContainer;
                this.mathisFrame = mathisFrame;
                this.selectAndAroundClassName = null;
                this.keyTo$select = new mathis.StringMap();
                this.keyTo$button = new mathis.StringMap();
                this.containersToPutCommand = new mathis.StringMap();
                this.pushState = false;
                this.go_fired = false;
                if (defaultContainer != null) {
                    if (!(defaultContainer instanceof jQuery))
                        throw "defaultContainer must be null or a jQuery object";
                    if (defaultContainer.length != 1)
                        throw "defaultContainer must contain a unique HTMLElement";
                }
                if (pieceOfCode.COMMAND_DICO == null)
                    buildCommandDico(this.pieceOfCode);
            }
            Binder.prototype.setAllSelectsAccordingToPieceOfCode = function () {
                for (var _i = 0, _a = this.pieceOfCode.COMMAND_DICO.allKeys(); _i < _a.length; _i++) {
                    var key = _a[_i];
                    var defaultIndex = null;
                    var choices = this.pieceOfCode.COMMAND_DICO.getValue(key);
                    for (var i = 0; i < choices.values.length; i++) {
                        if (choices.values[i] === null || this.pieceOfCode[key] === null) {
                            if (choices.values[i] === null && this.pieceOfCode[key] === null)
                                defaultIndex = i;
                        }
                        else {
                            if (JSON.stringify(choices.values[i]) == JSON.stringify(this.pieceOfCode[key]))
                                defaultIndex = i;
                        }
                    }
                    if (defaultIndex != null) {
                        var $select = this.keyTo$select.getValue(key);
                        if ($select != null)
                            $select.selectedIndex = defaultIndex;
                        else {
                            var $button = this.keyTo$button.getValue(key);
                            if ($button != null) {
                                $button.selectedIndex = defaultIndex;
                                $button.updateVisual();
                            }
                        }
                    }
                    else {
                        var allValuesString = "";
                        for (var _b = 0, _c = choices.values; _b < _c.length; _b++) {
                            var val = _c[_b];
                            allValuesString += JSON.stringify(val) + ",";
                        }
                        throw 'in the pieceOfCode:' + this.pieceOfCode.NAME + ', for the configuration-attribute:' + key + ', the value:' + JSON.stringify(this.pieceOfCode[key]) + ' does not appear in the possible choices:' + allValuesString;
                    }
                }
            };
            Binder.prototype.go = function () {
                var _this = this;
                if (this.go_fired)
                    throw 'Binder.go can be fired only once';
                this.go_fired = true;
                if (this.defaultContainer != null) {
                    this.containersToPutCommand.putValue('default', this.defaultContainer);
                }
                if (this.mathisFrame != null) {
                    this.containersToPutCommand.putValue('NW', this.mathisFrame.subWindow_NW.$visual);
                    this.containersToPutCommand.putValue('NE', this.mathisFrame.subWindow_NE.$visual);
                    this.containersToPutCommand.putValue('N', this.mathisFrame.subWindow_N.$visual);
                    this.containersToPutCommand.putValue('SW', this.mathisFrame.subWindow_SW.$visual);
                    this.containersToPutCommand.putValue('SE', this.mathisFrame.subWindow_SE.$visual);
                    this.containersToPutCommand.putValue('S', this.mathisFrame.subWindow_S.$visual);
                    this.containersToPutCommand.putValue('W', this.mathisFrame.subWindow_W.$visual);
                    this.containersToPutCommand.putValue('E', this.mathisFrame.subWindow_E.$visual);
                    if (this.containersToPutCommand.getValue('default') == null)
                        this.containersToPutCommand.putValue('default', this.mathisFrame.subWindow_NW.$visual);
                }
                var _loop_1 = function(key) {
                    var choices = this_1.pieceOfCode.COMMAND_DICO.getValue(key);
                    choices.initialValueMemorized = this_1.pieceOfCode[key];
                    var automaticPlacing = void 0;
                    var $container = void 0;
                    if (choices.options.containerName != null) {
                        $container = this_1.containersToPutCommand.getValue(choices.options.containerName);
                        if ($container == null || $container.length == 0)
                            throw "the container name:" + choices.options.containerName + " has no corresponding container";
                    }
                    else
                        $container = this_1.containersToPutCommand.getValue('default');
                    var $place = $container.find('.' + key);
                    if ($place == null || $place.length == 0) {
                        $place = $("<span>").addClass(key);
                        $container.append($('<div>').append($place));
                        automaticPlacing = true;
                    }
                    else if ($place.length > 1)
                        throw "several places for the element with name:" + key;
                    else if ($place.length == 1) {
                        automaticPlacing = false;
                    }
                    if (this_1.selectAndAroundClassName != null) {
                        $place.addClass(this_1.selectAndAroundClassName);
                    }
                    choices.$parent = $place;
                    var $text = $("<span>");
                    var before = (choices.options.before == null) ? "" : choices.options.before;
                    var label = (choices.options.label == null) ? key + ":" : choices.options.label;
                    if (automaticPlacing)
                        $text.append(label).append(before);
                    else
                        $text.append(before);
                    if (choices.options.type == null || choices.options.type == ChoicesOptionsType.select) {
                        choices.$select = document.createElement("select");
                        this_1.keyTo$select.putValue(key, choices.$select);
                        $place.append($text);
                        $place.append(choices.$select);
                        choices.changePossibleValues(choices.values, null, this_1.indexPage);
                        choices.$select.onchange = function () {
                            _this.pieceOfCode[choices.key] = choices.values[choices.$select.selectedIndex];
                            _this.whenSelectOrButtonChange(choices);
                        };
                    }
                    else if (choices.options.type == ChoicesOptionsType.button) {
                        choices.$button = new $Button();
                        this_1.keyTo$button.putValue(key, choices.$button);
                        $place.append(choices.$button.$visual);
                        choices.changePossibleValues(choices.values, null, this_1.indexPage);
                        choices.$button.onclick = function () {
                            choices.$button.increment();
                            choices.$button.updateVisual();
                            _this.pieceOfCode[choices.key] = choices.values[choices.$button.selectedIndex];
                            _this.whenSelectOrButtonChange(choices);
                        };
                    }
                };
                var this_1 = this;
                for (var _i = 0, _a = this.pieceOfCode.COMMAND_DICO.allKeys(); _i < _a.length; _i++) {
                    var key = _a[_i];
                    _loop_1(key);
                }
                this.setAllSelectsAccordingToPieceOfCode();
            };
            Binder.prototype.whenSelectOrButtonChange = function (choices) {
                if (this.indexPage != null && this.pushState) {
                    this.indexPage.navigator.pushState({
                        type: 'part',
                        name: this.pieceOfCode.NAME,
                        configuration: pieceOfCodeToConfiguration(this.pieceOfCode)
                    });
                }
                if (choices.options.onchange != null)
                    choices.options.onchange();
                else
                    this.pieceOfCode.go();
                if (this.onConfigChange != null)
                    this.onConfigChange();
            };
            return Binder;
        }());
        appli.Binder = Binder;
        var $Button = (function () {
            function $Button() {
                var _this = this;
                this.visualValues = [];
                this.selectedIndex = 0;
                this.$visual = $('<div class="clickable appliButton" "></div>');
                this.$visual.on('click touch', function () { _this.onclick(); });
            }
            $Button.prototype.increment = function () {
                this.selectedIndex = (this.selectedIndex + 1) % this.visualValues.length;
            };
            $Button.prototype.updateVisual = function () {
                this.$visual.empty().append(this.visualValues[this.selectedIndex]);
            };
            return $Button;
        }());
        appli.$Button = $Button;
        function pieceOfCodeToConfiguration(pieceOfCode) {
            var res = {};
            for (var $$$key in pieceOfCode) {
                if ($$$key.slice(0, 3) == conv.$$$) {
                    var key = $$$key.slice(3);
                    if (key != 'name' && key != 'title' && key != 'creator' && key != 'keyWords') {
                        res[key] = pieceOfCode[key];
                    }
                }
            }
            return res;
        }
        appli.pieceOfCodeToConfiguration = pieceOfCodeToConfiguration;
        function pieceOfCodeToSrotedConfigurationAttributes(pieceOfCode) {
            var res = [];
            for (var $$$key in pieceOfCode) {
                if ($$$key.slice(0, 3) == conv.$$$) {
                    var key = $$$key.slice(3);
                    if (key != 'name' && key != 'title' && key != 'creator' && key != 'keyWords') {
                        res.push(key);
                    }
                }
            }
            return res.sort();
        }
        appli.pieceOfCodeToSrotedConfigurationAttributes = pieceOfCodeToSrotedConfigurationAttributes;
    })(appli = mathis.appli || (mathis.appli = {}));
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    mathis.myFavoriteColors = {
        green: new BABYLON.Color3(124 / 255, 252 / 255, 0)
    };
    var UV = (function () {
        function UV(u, v) {
            this.u = u;
            this.v = v;
        }
        return UV;
    }());
    mathis.UV = UV;
    var M22 = (function () {
        function M22() {
            this.m11 = 0;
            this.m12 = 0;
            this.m21 = 0;
            this.m22 = 0;
        }
        M22.prototype.determinant = function () {
            return this.m11 * this.m22 - this.m21 * this.m12;
        };
        M22.prototype.inverse = function () {
            var res = new M22();
            var det = this.determinant();
            res.m11 = this.m22 / det;
            res.m22 = this.m11 / det;
            res.m12 = -this.m12 / det;
            res.m21 = -this.m21 / det;
            return res;
        };
        M22.prototype.multiplyUV = function (uv) {
            return new UV(this.m11 * uv.u + this.m12 * uv.v, this.m21 * uv.u + this.m22 * uv.v);
        };
        return M22;
    }());
    mathis.M22 = M22;
    var XYZ = (function (_super) {
        __extends(XYZ, _super);
        function XYZ(x, y, z) {
            _super.call(this, x, y, z);
        }
        XYZ.resetDefaultNbDecimalForHash = function () { XYZ.nbDecimalForHash = 5; };
        Object.defineProperty(XYZ.prototype, "hashString", {
            get: function () { return mathis.roundWithGivenPrecision(this.x, XYZ.nbDecimalForHash) + ',' + mathis.roundWithGivenPrecision(this.y, XYZ.nbDecimalForHash) + ',' + mathis.roundWithGivenPrecision(this.z, XYZ.nbDecimalForHash); },
            enumerable: true,
            configurable: true
        });
        XYZ.newZero = function () {
            return new XYZ(0, 0, 0);
        };
        XYZ.newFrom = function (vect) {
            if (vect == null)
                return null;
            return new XYZ(vect.x, vect.y, vect.z);
        };
        XYZ.newOnes = function () {
            return new XYZ(1, 1, 1);
        };
        XYZ.newRandom = function () {
            return new XYZ(Math.random(), Math.random(), Math.random());
        };
        XYZ.temp0 = function (x, y, z) {
            tempXYZ0.copyFromFloats(x, y, z);
            return tempXYZ0;
        };
        XYZ.temp1 = function (x, y, z) {
            tempXYZ1.copyFromFloats(x, y, z);
            return tempXYZ1;
        };
        XYZ.prototype.add = function (vec) {
            mathis.geo.add(this, vec, this);
            return this;
        };
        XYZ.prototype.resizes = function (vec) {
            this.x *= vec.x;
            this.y *= vec.y;
            this.z *= vec.z;
            return this;
        };
        XYZ.prototype.multiply = function (vec) {
            this.x *= vec.x;
            this.y *= vec.y;
            this.z *= vec.z;
            return this;
        };
        XYZ.prototype.substract = function (vec) {
            mathis.geo.substract(this, vec, this);
            return this;
        };
        XYZ.prototype.scale = function (factor) {
            mathis.geo.scale(this, factor, this);
            return this;
        };
        XYZ.prototype.copyFrom = function (vect) {
            this.x = vect.x;
            this.y = vect.y;
            this.z = vect.z;
            return this;
        };
        XYZ.prototype.copyFromFloats = function (x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
            return this;
        };
        XYZ.prototype.changeBy = function (x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
            return this;
        };
        XYZ.prototype.normalize = function () {
            var norm = mathis.geo.norme(this);
            if (norm < mathis.geo.epsilon)
                throw 'be careful, you have normalized a very small vector';
            return this.scale(1 / norm);
        };
        XYZ.prototype.almostEqual = function (vect) {
            return mathis.geo.xyzAlmostEquality(this, vect);
        };
        XYZ.prototype.toString = function (deci) {
            if (deci === void 0) { deci = 2; }
            return '(' + this.x.toFixed(deci) + ',' + this.y.toFixed(deci) + ',' + this.z.toFixed(deci) + ')';
        };
        XYZ.lexicalOrder = function (a, b) {
            if (a.x != b.x)
                return a.x - b.x;
            else if (a.y != b.y)
                return a.y - b.y;
            else if (a.z != b.z)
                return a.z - b.z;
            else
                return 0;
        };
        XYZ.lexicalOrderInverse = function (a, b) {
            return -XYZ.lexicalOrder(a, b);
        };
        XYZ.nbDecimalForHash = 5;
        return XYZ;
    }(BABYLON.Vector3));
    mathis.XYZ = XYZ;
    var tempXYZ0 = new XYZ(0, 0, 0);
    var tempXYZ1 = new XYZ(0, 0, 0);
    var XYZW = (function (_super) {
        __extends(XYZW, _super);
        function XYZW(x, y, z, w) {
            _super.call(this, x, y, z, w);
        }
        XYZW.prototype.multiply = function (quat) {
            mathis.geo.quaternionMultiplication(quat, this, this);
            return this;
        };
        return XYZW;
    }(BABYLON.Quaternion));
    mathis.XYZW = XYZW;
    var Hash = (function () {
        function Hash() {
        }
        Hash.segment = function (a, b) {
            return Segment.segmentId(a.hashNumber, b.hashNumber);
        };
        Hash.segmentOrd = function (a, b) {
            if (a.hashNumber > b.hashNumber)
                _a = [b, a], a = _a[0], b = _a[1];
            return [a, b];
            var _a;
        };
        Hash.quad = function (a, b, c, d) {
            _a = Hash.quadOrd(a, b, c, d), a = _a[0], b = _a[1], c = _a[2], d = _a[3];
            return a.hashNumber + "," + b.hashNumber + "," + c.hashNumber + "," + d.hashNumber;
            var _a;
        };
        Hash.quadOrd = function (a, b, c, d) {
            while (a.hashNumber > b.hashNumber || a.hashNumber > c.hashNumber || a.hashNumber > d.hashNumber)
                _a = [b, c, d, a], a = _a[0], b = _a[1], c = _a[2], d = _a[3];
            if (b.hashNumber < d.hashNumber)
                _b = [d, b], b = _b[0], d = _b[1];
            return [a, b, c, d];
            var _a, _b;
        };
        return Hash;
    }());
    mathis.Hash = Hash;
    var Positioning = (function () {
        function Positioning() {
            this.position = new XYZ(0, 0, 0);
            this.frontDir = new XYZ(1, 0, 0);
            this.upVector = new XYZ(0, 1, 0);
            this.scaling = new XYZ(1, 1, 1);
            this.defaultUpDirIfTooSmall = new XYZ(1, 1, 0);
            this.defaultFrontDirIfTooSmall = new XYZ(0, 0, 1);
        }
        Positioning.prototype.copyFrom = function (positionning) {
            this.position = XYZ.newFrom(positionning.position);
            this.upVector = XYZ.newFrom(positionning.upVector);
            this.frontDir = XYZ.newFrom(positionning.frontDir);
            this.scaling = XYZ.newFrom(positionning.scaling);
        };
        Positioning.prototype.changeFrontDir = function (vector) {
            mathis.geo.orthonormalizeKeepingFirstDirection(vector, this.upVector, this.frontDir, this.upVector);
        };
        Positioning.prototype.changeUpVector = function (vector) {
            mathis.geo.orthonormalizeKeepingFirstDirection(this.upVector, vector, this.upVector, this.frontDir);
        };
        Positioning.prototype.setOrientation = function (frontDir, upVector) {
            this.upVector = new XYZ(0, 0, 0);
            this.frontDir = new XYZ(0, 0, 0);
            mathis.geo.orthonormalizeKeepingFirstDirection(frontDir, upVector, this.frontDir, this.upVector);
        };
        Positioning.prototype.quaternion = function (preserveUpVectorInPriority) {
            if (preserveUpVectorInPriority === void 0) { preserveUpVectorInPriority = true; }
            if (this.frontDir == null && this.upVector == null)
                throw 'you must precise a frontDir or a upVector or both of them';
            else if (this.frontDir == null) {
                this.frontDir = new XYZ(0, 0, 0);
                mathis.geo.getOneOrthonormal(this.upVector, this.frontDir);
            }
            else if (this.upVector == null) {
                this.upVector = new XYZ(0, 0, 0);
                mathis.geo.getOneOrthonormal(this.frontDir, this.upVector);
            }
            if (this.frontDir.length() < mathis.geo.epsilon) {
                this.frontDir = this.defaultFrontDirIfTooSmall;
                mathis.logger.c('a tangent was too small, and so replaced by a default one');
            }
            if (this.upVector.length() < mathis.geo.epsilon) {
                this.upVector = this.defaultUpDirIfTooSmall;
                mathis.logger.c('a normal was too small, and so replaced by a default one');
            }
            var quaternion = new XYZW(0, 0, 0, 1);
            mathis.geo.twoVectorsToQuaternion(this.frontDir, this.upVector, !preserveUpVectorInPriority, quaternion);
            return quaternion;
        };
        Positioning.prototype.applyToMeshes = function (meshes) {
            var quaternion = null;
            if (this.frontDir != null || this.upVector != null)
                quaternion = this.quaternion();
            for (var _i = 0, meshes_1 = meshes; _i < meshes_1.length; _i++) {
                var mesh = meshes_1[_i];
                if (this.scaling != null)
                    mesh.scaling = this.scaling;
                if (quaternion != null)
                    mesh.rotationQuaternion = quaternion;
                if (this.position != null)
                    mesh.position = this.position;
            }
        };
        Positioning.prototype.applyToVertices = function (vertices) {
            var quaternion = this.quaternion();
            var matrix = new MM();
            mathis.geo.quaternionToMatrix(quaternion, matrix);
            for (var _i = 0, vertices_1 = vertices; _i < vertices_1.length; _i++) {
                var vertex = vertices_1[_i];
                vertex.position.multiply(this.scaling);
                mathis.geo.multiplicationMatrixVector(matrix, vertex.position, vertex.position);
                vertex.position.add(this.position);
            }
        };
        return Positioning;
    }());
    mathis.Positioning = Positioning;
    var MM = (function (_super) {
        __extends(MM, _super);
        function MM() {
            _super.call(this);
        }
        MM.newIdentity = function () {
            var res = new MM();
            res.m[0] = 1;
            res.m[5] = 1;
            res.m[10] = 1;
            res.m[15] = 1;
            return res;
        };
        MM.newFrom = function (matr) {
            var res = new MM();
            for (var i = 0; i < 16; i++)
                res.m[i] = matr.m[i];
            return res;
        };
        MM.newRandomMat = function () {
            var res = new MM();
            for (var i = 0; i < 16; i++)
                res.m[i] = Math.random();
            return res;
        };
        MM.newZero = function () {
            return new MM();
        };
        MM.prototype.equal = function (matr) {
            return mathis.geo.matEquality(this, matr);
        };
        MM.prototype.almostEqual = function (matr) {
            return mathis.geo.matAlmostEquality(this, matr);
        };
        MM.prototype.leftMultiply = function (matr) {
            mathis.geo.multiplyMatMat(matr, this, this);
            return this;
        };
        MM.prototype.rightMultiply = function (matr) {
            mathis.geo.multiplyMatMat(this, matr, this);
            return this;
        };
        MM.prototype.inverse = function () {
            mathis.geo.inverse(this, this);
            return this;
        };
        MM.prototype.copyFrom = function (matr) {
            mathis.geo.copyMat(matr, this);
            return this;
        };
        MM.prototype.transpose = function () {
            mathis.geo.transpose(this, this);
            return this;
        };
        MM.prototype.toString = function () {
            return "\n" +
                this.m[0] + this.m[1] + this.m[2] + this.m[3] + "\n" +
                this.m[4] + this.m[5] + this.m[6] + this.m[7] + "\n" +
                this.m[8] + this.m[9] + this.m[10] + this.m[11] + "\n" +
                this.m[12] + this.m[13] + this.m[14] + this.m[15] + "\n";
        };
        return MM;
    }(BABYLON.Matrix));
    mathis.MM = MM;
    var Link = (function () {
        function Link(to) {
            this.customerOb = null;
            if (to == null)
                throw 'a links is construct with a null vertex';
            this.to = to;
        }
        return Link;
    }());
    mathis.Link = Link;
    var Vertex = (function () {
        function Vertex() {
            this.links = [];
            this.isInvisible = false;
            this.dichoLevel = 0;
            this.markers = [];
            this.customerObject = {};
            this._hashCode = Vertex.hashCount++;
        }
        Object.defineProperty(Vertex.prototype, "hashNumber", {
            get: function () { return this._hashCode; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vertex.prototype, "hashString", {
            get: function () { return this._hashCode + ''; },
            enumerable: true,
            configurable: true
        });
        Vertex.prototype.setPosition = function (x, y, z, useAlsoTheseValuesForParam) {
            if (useAlsoTheseValuesForParam === void 0) { useAlsoTheseValuesForParam = true; }
            this.position = new XYZ(x, y, z);
            if (useAlsoTheseValuesForParam)
                this.param = new XYZ(x, y, z);
            return this;
        };
        Vertex.prototype.hasMark = function (mark) {
            return (this.markers.indexOf(mark) != -1);
        };
        Vertex.prototype.getOpposites = function (vert1) {
            var fle = this.findLink(vert1);
            if (fle == null)
                throw "the vertex is not a neighbor. Probably your neighborhood relation is not symetric. " +
                    "Please, perform the graph analysis, with the help of the function linkModule.checkTheRegularityOfAGRaph";
            if (fle.opposites == null)
                return null;
            var res = [];
            for (var _i = 0, _a = fle.opposites; _i < _a.length; _i++) {
                var li = _a[_i];
                res.push(li.to);
            }
            return res;
        };
        Vertex.prototype.hasBifurcations = function () {
            for (var _i = 0, _a = this.links; _i < _a.length; _i++) {
                var link = _a[_i];
                if (link.opposites != null && link.opposites.length > 1)
                    return true;
            }
            return false;
        };
        Vertex.prototype.hasVoisin = function (vertex) {
            for (var _i = 0, _a = this.links; _i < _a.length; _i++) {
                var link = _a[_i];
                if (link.to == vertex)
                    return true;
            }
            return false;
        };
        Vertex.prototype.isBorder = function () { return this.hasMark(Vertex.Markers.border); };
        Vertex.prototype.findLink = function (vertex) {
            for (var _i = 0, _a = this.links; _i < _a.length; _i++) {
                var fle = _a[_i];
                if (fle.to == vertex)
                    return fle;
            }
            return null;
        };
        Vertex.prototype.setTwoOppositeLinks = function (cell1, cell2) {
            var link1 = this.findLink(cell1);
            var link2 = this.findLink(cell2);
            if (link1 == null) {
                link1 = new Link(cell1);
                this.links.push(link1);
            }
            if (link2 == null) {
                link2 = new Link(cell2);
                this.links.push(link2);
            }
            if (link1.opposites == null)
                link1.opposites = [];
            if (link2.opposites == null)
                link2.opposites = [];
            link1.opposites.push(link2);
            link2.opposites.push(link1);
            return this;
        };
        Vertex.prototype.setOneLink = function (vertex) {
            if (vertex == this)
                throw "it is forbidden to link to itself";
            this.suppressOneLink(vertex);
            this.links.push(new Link(vertex));
            return this;
        };
        Vertex.separateTwoVoisins = function (v1, v2) {
            v1.suppressOneLink(v2);
            v2.suppressOneLink(v1);
        };
        Vertex.prototype.suppressOneLink = function (voisin) {
            var link = this.findLink(voisin);
            if (link == null)
                return;
            mathis.tab.removeFromArray(this.links, link);
            if (link.opposites != null) {
                for (var _i = 0, _a = link.opposites; _i < _a.length; _i++) {
                    var li = _a[_i];
                    if (li.opposites.length >= 2)
                        mathis.tab.removeFromArray(li.opposites, link);
                    else
                        li.opposites = null;
                }
            }
        };
        Vertex.prototype.changeToLinkWithoutOpposite = function (voisin) {
            var link = this.findLink(voisin);
            if (link == null)
                return;
            if (link.opposites != null) {
                for (var _i = 0, _a = link.opposites; _i < _a.length; _i++) {
                    var li = _a[_i];
                    if (li.opposites.length >= 2)
                        mathis.tab.removeFromArray(li.opposites, link);
                    else
                        li.opposites = null;
                }
            }
            link.opposites = null;
        };
        Vertex.prototype.toString = function (toSubstract) {
            var res = (this.hashNumber - toSubstract) + "";
            return res;
        };
        Vertex.prototype.toStringComplete = function (toSubstract) {
            var res = this.hashNumber - toSubstract + "|links:";
            for (var _i = 0, _a = this.links; _i < _a.length; _i++) {
                var fle = _a[_i];
                var bif = "";
                if (fle.opposites != null) {
                    bif += ",";
                    for (var _b = 0, _c = fle.opposites; _b < _c.length; _b++) {
                        var li = _c[_b];
                        bif += (li.to.hashNumber - toSubstract) + ",";
                    }
                }
                res += "(" + (fle.to.hashNumber - toSubstract) + bif + ")";
            }
            if (this.position != null)
                res += "|pos:" + this.position.toString(1) + ',';
            res += "|mark:";
            for (var _d = 0, _e = this.markers; _d < _e.length; _d++) {
                var mark = _e[_d];
                res += Vertex.Markers[mark] + ',';
            }
            return res;
        };
        Vertex.hashCount = 0;
        return Vertex;
    }());
    mathis.Vertex = Vertex;
    var Vertex;
    (function (Vertex) {
        (function (Markers) {
            Markers[Markers["honeyComb"] = 0] = "honeyComb";
            Markers[Markers["corner"] = 1] = "corner";
            Markers[Markers["center"] = 2] = "center";
            Markers[Markers["border"] = 3] = "border";
            Markers[Markers["polygonCenter"] = 4] = "polygonCenter";
            Markers[Markers["selectedForLineDrawing"] = 5] = "selectedForLineDrawing";
        })(Vertex.Markers || (Vertex.Markers = {}));
        var Markers = Vertex.Markers;
    })(Vertex = mathis.Vertex || (mathis.Vertex = {}));
    var Mamesh = (function () {
        function Mamesh() {
            this.vertices = [];
            this.smallestTriangles = [];
            this.smallestSquares = [];
            this.hexahedrons = [];
            this.cutSegmentsDico = {};
        }
        Object.defineProperty(Mamesh.prototype, "polygons", {
            get: function () {
                var res = [];
                for (var i = 0; i < this.smallestSquares.length; i += 4)
                    res.push([this.smallestSquares[i], this.smallestSquares[i + 1], this.smallestSquares[i + 2], this.smallestSquares[i + 3]]);
                for (var i = 0; i < this.smallestTriangles.length; i += 3)
                    res.push([this.smallestTriangles[i], this.smallestTriangles[i + 1], this.smallestTriangles[i + 2]]);
                return res;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Mamesh.prototype, "linesWasMade", {
            get: function () {
                return this.lines != null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Mamesh.prototype, "segments", {
            get: function () {
                var res = [];
                for (var _i = 0, _a = this.vertices; _i < _a.length; _i++) {
                    var vertex = _a[_i];
                    for (var _b = 0, _c = vertex.links; _b < _c.length; _b++) {
                        var link = _c[_b];
                        if (vertex.hashNumber < link.to.hashNumber)
                            res.push([vertex, link.to]);
                    }
                }
                return res;
            },
            enumerable: true,
            configurable: true
        });
        Mamesh.prototype.addATriangle = function (a, b, c) {
            this.smallestTriangles.push(a, b, c);
            return this;
        };
        Mamesh.prototype.addASquare = function (a, b, c, d) {
            this.smallestSquares.push(a, b, c, d);
            return this;
        };
        Mamesh.prototype.addHexahedron = function (pos) {
            this.hexahedrons.concat(pos);
            return this;
        };
        Mamesh.prototype.getVertex = function (pos) {
            var v = this.findVertexFromParam(pos);
            if (v == null)
                v = this.newVertex(pos);
            return v;
        };
        Mamesh.prototype.newVertex = function (position, dichoLevel, param) {
            if (dichoLevel === void 0) { dichoLevel = 0; }
            var vertex = new Vertex();
            vertex.position = position;
            vertex.param = (param) ? param : position;
            vertex.dichoLevel = dichoLevel;
            this.addVertex(vertex);
            return vertex;
        };
        Mamesh.prototype.findVertexFromParam = function (param) {
            for (var _i = 0, _a = this.vertices; _i < _a.length; _i++) {
                var v = _a[_i];
                if (v.param.hashString == param.hashString)
                    return v;
            }
            return null;
        };
        Mamesh.prototype.addVertex = function (vertex) {
            this.vertices.push(vertex);
        };
        Mamesh.prototype.hasVertex = function (vertex) {
            for (var _i = 0, _a = this.vertices; _i < _a.length; _i++) {
                var ver = _a[_i];
                if (ver.hashNumber == vertex.hashNumber)
                    return true;
            }
            return false;
        };
        Mamesh.prototype.getStraightLines = function () {
            var res = [];
            for (var _i = 0, _a = this.lines; _i < _a.length; _i++) {
                var line = _a[_i];
                if (!line.isLoop)
                    res.push(line);
            }
            return res;
        };
        Mamesh.prototype.getLoopLines = function () {
            var res = [];
            for (var _i = 0, _a = this.lines; _i < _a.length; _i++) {
                var line = _a[_i];
                if (line.isLoop)
                    res.push(line);
            }
            return res;
        };
        Mamesh.prototype.getStraightLinesAsVertices = function () {
            var res = [];
            for (var _i = 0, _a = this.lines; _i < _a.length; _i++) {
                var line = _a[_i];
                if (!line.isLoop)
                    res.push(line.vertices);
            }
            return res;
        };
        Mamesh.prototype.getLoopLinesAsVertices = function () {
            var res = [];
            for (var _i = 0, _a = this.lines; _i < _a.length; _i++) {
                var line = _a[_i];
                if (line.isLoop)
                    res.push(line.vertices);
            }
            return res;
        };
        Mamesh.prototype.toString = function (substractHashCode) {
            if (substractHashCode === void 0) { substractHashCode = true; }
            var toSubstract = 0;
            if (substractHashCode) {
                toSubstract = Number.MAX_VALUE;
                for (var _i = 0, _a = this.vertices; _i < _a.length; _i++) {
                    var vert = _a[_i];
                    if (vert.hashNumber < toSubstract)
                        toSubstract = vert.hashNumber;
                }
            }
            var res = "\n";
            if (this.name != null)
                res += this.name + "\n";
            for (var _b = 0, _c = this.vertices; _b < _c.length; _b++) {
                var vert = _c[_b];
                res += vert.toStringComplete(toSubstract) + "\n";
            }
            res += "tri:";
            for (var j = 0; j < this.smallestTriangles.length; j += 3) {
                res += "[" + (this.smallestTriangles[j].hashNumber - toSubstract) + "," + (this.smallestTriangles[j + 1].hashNumber - toSubstract) + "," + (this.smallestTriangles[j + 2].hashNumber - toSubstract) + "]";
            }
            res += "\nsqua:";
            for (var j = 0; j < this.smallestSquares.length; j += 4) {
                res += "[" + (this.smallestSquares[j].hashNumber - toSubstract) + "," + (this.smallestSquares[j + 1].hashNumber - toSubstract) + "," + (this.smallestSquares[j + 2].hashNumber - toSubstract) + "," + (this.smallestSquares[j + 3].hashNumber - toSubstract) + "]";
            }
            if (this.linesWasMade) {
                res += "\nstrai:";
                for (var _d = 0, _e = this.getStraightLines(); _d < _e.length; _d++) {
                    var line = _e[_d];
                    res += "[";
                    for (var _f = 0, _g = line.vertices; _f < _g.length; _f++) {
                        var ver = _g[_f];
                        res += (ver.hashNumber - toSubstract) + ",";
                    }
                    res += "]";
                }
                res += "\nloop:";
                for (var _h = 0, _j = this.getLoopLines(); _h < _j.length; _h++) {
                    var line = _j[_h];
                    res += "[";
                    for (var _k = 0, _l = line.vertices; _k < _l.length; _k++) {
                        var ver = _l[_k];
                        res += (ver.hashNumber - toSubstract) + ",";
                    }
                    res += "]";
                }
            }
            res += "\ncutSegments";
            for (var key in this.cutSegmentsDico) {
                var segment = this.cutSegmentsDico[key];
                res += '{' + (segment.a.hashNumber - toSubstract) + ',' + (segment.middle.hashNumber - toSubstract) + ',' + (segment.b.hashNumber - toSubstract) + '}';
            }
            return res;
        };
        Mamesh.prototype.fillLineCatalogue = function (startingVertices) {
            if (startingVertices === void 0) { startingVertices = this.vertices; }
            this.lines = mathis.lineModule.makeLineCatalogue2(startingVertices, true);
        };
        Mamesh.prototype.addSimpleLinksAroundPolygons = function () {
            new mathis.linkModule.SimpleLinkFromPolygonCreator(this).goChanging();
        };
        Mamesh.prototype.addOppositeLinksAroundPolygons = function () {
            new mathis.linkModule.SimpleLinkFromPolygonCreator(this).goChanging();
            new mathis.linkModule.OppositeLinkAssocierByAngles(this.vertices).goChanging();
        };
        Mamesh.prototype.isolateMameshVerticesFromExteriorVertices = function () {
            var verticesAndLinkToSepare = [];
            for (var _i = 0, _a = this.vertices; _i < _a.length; _i++) {
                var vertex = _a[_i];
                for (var _b = 0, _c = vertex.links; _b < _c.length; _b++) {
                    var link = _c[_b];
                    if (!this.hasVertex(link.to))
                        verticesAndLinkToSepare.push({ vertex: vertex, link: link });
                }
            }
            for (var _d = 0, verticesAndLinkToSepare_1 = verticesAndLinkToSepare; _d < verticesAndLinkToSepare_1.length; _d++) {
                var vl = verticesAndLinkToSepare_1[_d];
                Vertex.separateTwoVoisins(vl.link.to, vl.vertex);
            }
        };
        Mamesh.prototype.getOrCreateSegment = function (v1, v2, segments) {
            var res = this.cutSegmentsDico[Segment.segmentId(v1.hashNumber, v2.hashNumber)];
            if (res == null) {
                res = new Segment(v1, v2);
                this.cutSegmentsDico[Segment.segmentId(v1.hashNumber, v2.hashNumber)] = res;
            }
            segments[Segment.segmentId(v1.hashNumber, v2.hashNumber)] = res;
        };
        Mamesh.prototype.maxLinkLength = function () {
            var res = -1;
            this.vertices.forEach(function (vert) {
                vert.links.forEach(function (li) {
                    var dist = mathis.geo.distance(vert.position, li.to.position);
                    if (dist > res)
                        res = dist;
                });
            });
            if (res == -1)
                throw 'your IN_mamesh seems empty';
            return res;
        };
        Mamesh.prototype.clearLinksAndLines = function () {
            this.vertices.forEach(function (v) {
                mathis.tab.clearArray(v.links);
            });
            this.lines = null;
        };
        Mamesh.prototype.clearOppositeInLinks = function () {
            this.vertices.forEach(function (v) {
                v.links.forEach(function (li) {
                    li.opposites = null;
                });
            });
        };
        Mamesh.prototype.allLinesAsASortedString = function (substractHashCode) {
            if (substractHashCode === void 0) { substractHashCode = true; }
            var res = "";
            var stringTab;
            var toSubstract;
            if (substractHashCode) {
                toSubstract = Number.MAX_VALUE;
                for (var _i = 0, _a = this.vertices; _i < _a.length; _i++) {
                    var vert = _a[_i];
                    if (vert.hashNumber < toSubstract)
                        toSubstract = vert.hashNumber;
                }
            }
            if (this.linesWasMade) {
                var straigth = this.getStraightLines();
                var loop = this.getLoopLines();
                if (this.linesWasMade && straigth.length > 0) {
                    stringTab = [];
                    straigth.forEach(function (li) {
                        var line = li.vertices;
                        var hashTab = [];
                        line.forEach(function (v) {
                            hashTab.push(v.hashNumber - toSubstract);
                        });
                        stringTab.push(JSON.stringify(hashTab));
                    });
                    stringTab.sort();
                    res = "straightLines:" + JSON.stringify(stringTab);
                }
                if (loop.length > 0) {
                    stringTab = [];
                    loop.forEach(function (li) {
                        var line = li.vertices;
                        var hashTab = [];
                        line.forEach(function (v) {
                            hashTab.push(v.hashNumber - toSubstract);
                        });
                        var minIndex = mathis.tab.minIndexOfNumericList(hashTab);
                        var permutedHashTab = [];
                        for (var i = 0; i < hashTab.length; i++) {
                            permutedHashTab[i] = hashTab[(i + minIndex) % hashTab.length];
                        }
                        stringTab.push(JSON.stringify(permutedHashTab));
                    });
                    stringTab.sort();
                    res += "|loopLines:" + JSON.stringify(stringTab);
                }
            }
            return res;
        };
        Mamesh.prototype.allSquareAndTrianglesAsSortedString = function (subtractHashCode) {
            if (subtractHashCode === void 0) { subtractHashCode = true; }
            var toSubtract = 0;
            if (subtractHashCode) {
                toSubtract = Number.MAX_VALUE;
                for (var _i = 0, _a = this.vertices; _i < _a.length; _i++) {
                    var vert = _a[_i];
                    if (vert.hashNumber < toSubtract)
                        toSubtract = vert.hashNumber;
                }
            }
            var resSquare = "square:" + this.allSquaresOrTrianglesAsASortedString(this.smallestSquares, 4, toSubtract);
            var resTri = "triangle:" + this.allSquaresOrTrianglesAsASortedString(this.smallestTriangles, 3, toSubtract);
            return resSquare + resTri;
        };
        Mamesh.prototype.allSquaresOrTrianglesAsASortedString = function (squareOrTriangles, blockSize, toSubtract) {
            var res = "";
            var stringTab;
            var listOfPoly = [];
            for (var i = 0; i < squareOrTriangles.length; i += blockSize) {
                var block = [];
                for (var j = 0; j < blockSize; j++)
                    block.push(squareOrTriangles[i + j]);
                listOfPoly.push(block);
            }
            stringTab = [];
            listOfPoly.forEach(function (line) {
                var hashTab = [];
                line.forEach(function (v) {
                    hashTab.push(v.hashNumber - toSubtract);
                });
                var minIndex = mathis.tab.minIndexOfNumericList(hashTab);
                var permutedHashTab = [];
                for (var i = 0; i < hashTab.length; i++) {
                    permutedHashTab[i] = hashTab[(i + minIndex) % hashTab.length];
                }
                stringTab.push(JSON.stringify(permutedHashTab));
            });
            stringTab.sort();
            res += JSON.stringify(stringTab);
            return res;
        };
        return Mamesh;
    }());
    mathis.Mamesh = Mamesh;
    var Line = (function () {
        function Line(vertices, isLoop) {
            this.vertices = vertices;
            this.isLoop = isLoop;
        }
        Line.prototype.getVertex = function (index, loopIfLoop) {
            if (loopIfLoop === void 0) { loopIfLoop = true; }
            if (this.isLoop && loopIfLoop)
                return this.vertices[index % this.vertices.length];
            else
                return this.vertices[index];
        };
        Line.prototype.hashForDirected = function () {
            var decayList = [];
            if (!this.isLoop) {
                for (var _i = 0, _a = this.vertices; _i < _a.length; _i++) {
                    var v = _a[_i];
                    decayList.push(v.hashNumber);
                }
            }
            else {
                var minIndex = mathis.tab.minIndexOb(this.vertices, function (v1, v2) { return v1.hashNumber - v2.hashNumber; });
                for (var i = 0; i < this.vertices.length; i++)
                    decayList.push(this.vertices[(i + minIndex) % this.vertices.length].hashNumber);
            }
            return JSON.stringify(decayList);
        };
        Line.prototype.inverted = function () {
            var invertedVert = [];
            for (var i = 0; i < this.vertices.length; i++)
                invertedVert.push(this.vertices[this.vertices.length - 1 - i]);
            return new Line(invertedVert, this.isLoop);
        };
        Line.prototype.positionList = function () {
            var res = [];
            for (var _i = 0, _a = this.vertices; _i < _a.length; _i++) {
                var v = _a[_i];
                res.push(v.position);
            }
            return res;
        };
        Object.defineProperty(Line.prototype, "hashString", {
            get: function () {
                var hash1 = this.hashForDirected();
                var hash2 = this.inverted().hashForDirected();
                return (hash1 < hash2) ? hash1 : hash2;
            },
            enumerable: true,
            configurable: true
        });
        Line.prototype.positionnalHashForDirected = function (precision) {
            if (precision === void 0) { precision = 1; }
            var listOfHash = [];
            XYZ.nbDecimalForHash = precision;
            if (!this.isLoop) {
                for (var _i = 0, _a = this.vertices; _i < _a.length; _i++) {
                    var v = _a[_i];
                    listOfHash.push(v.position.hashString);
                }
            }
            else {
                var positionList = this.positionList();
                var minIndex = mathis.tab.minIndexOb(positionList, XYZ.lexicalOrder);
                for (var i = 0; i < positionList.length; i++)
                    listOfHash.push(positionList[(i + minIndex) % positionList.length].hashString);
            }
            XYZ.resetDefaultNbDecimalForHash();
            return JSON.stringify(listOfHash);
        };
        Line.prototype.positionnalHash = function (precision) {
            if (precision === void 0) { precision = 1; }
            var hash1 = this.positionnalHashForDirected(precision);
            var hash2 = this.inverted().positionnalHashForDirected(precision);
            return (hash1 < hash2) ? hash1 : hash2;
        };
        Line.prototype.hashStringUpToSymmetries = function (symmetries, positionVersusParam) {
            var linesHash = [this.positionnalHash()];
            for (var _i = 0, symmetries_1 = symmetries; _i < symmetries_1.length; _i++) {
                var sym = symmetries_1[_i];
                var symV = [];
                for (var _a = 0, _b = this.vertices; _a < _b.length; _a++) {
                    var v = _b[_a];
                    var vert = new Vertex();
                    if (positionVersusParam)
                        vert.position = sym(v.position);
                    else
                        vert.position = sym(v.param);
                    symV.push(vert);
                }
                var line = new Line(symV, this.isLoop);
                linesHash.push(line.positionnalHash());
            }
            return mathis.tab.minValueString(linesHash);
        };
        Line.prototype.allSegments = function () {
            var res = [];
            var oneMore = (this.isLoop) ? 1 : 0;
            for (var i = 0; i < this.vertices.length - 1 + oneMore; i++) {
                res.push(new Segment(this.vertices[i], this.vertices[(i + 1) % this.vertices.length]));
            }
            return res;
        };
        return Line;
    }());
    mathis.Line = Line;
    var Segment = (function () {
        function Segment(c, d) {
            this.a = (c.hashNumber < d.hashNumber) ? c : d;
            this.b = (c.hashNumber < d.hashNumber) ? d : c;
        }
        Segment.segmentId = function (a, b) {
            if (a < b)
                return a + ',' + b;
            else
                return b + ',' + a;
        };
        Object.defineProperty(Segment.prototype, "hashString", {
            get: function () { return Segment.segmentId(this.a.hashNumber, this.b.hashNumber); },
            enumerable: true,
            configurable: true
        });
        Segment.prototype.equals = function (ab) {
            return this.a == ab.a && this.b == ab.b;
        };
        Segment.prototype.getOther = function (c) {
            if (c == this.a)
                return this.b;
            else
                return this.a;
        };
        Segment.prototype.getFirst = function () {
            return this.a;
        };
        Segment.prototype.getSecond = function () {
            return this.b;
        };
        Segment.prototype.has = function (c) {
            return c == this.a || c == this.b;
        };
        return Segment;
    }());
    mathis.Segment = Segment;
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    var Color = (function () {
        function Color(color) {
            if (typeof color === "number") {
                var res = this.hex2rgb(this.intToColorName(color));
                this.rgb = new RGB_range255(res[0], res[1], res[2]);
            }
            else if (typeof color === "string") {
                var res = this.hex2rgb(color);
                this.rgb = new RGB_range255(res[0], res[1], res[2]);
            }
            else if (color instanceof RGB_range255) {
                this.rgb = color;
            }
            else if (color instanceof HSV_01) {
                this.rgb = color.toRGB();
            }
        }
        Color.prototype.hex2rgb = function (hex) {
            var h = hex.replace('#', '');
            h = h.match(new RegExp('(.{' + h.length / 3 + '})', 'g'));
            for (var i = 0; i < h.length; i++)
                h[i] = parseInt(h[i].length == 1 ? h[i] + h[i] : h[i], 16);
            return h;
        };
        Color.prototype.lighten = function (by) {
            this.rgb = this.rgb.lighten(by);
            return this;
        };
        Color.prototype.darken = function (by) {
            this.rgb = this.rgb.darken(by);
            return this;
        };
        Color.prototype.toBABYLON_Color4 = function () {
            return new BABYLON.Color4(this.rgb.r / 255, this.rgb.g / 255, this.rgb.b / 255, this.rgb.alpha);
        };
        Color.prototype.toBABYLON_Color3 = function () {
            return new BABYLON.Color3(this.rgb.r / 255, this.rgb.g / 255, this.rgb.b / 255);
        };
        Color.prototype.toString = function () { return this.rgb.toString(); };
        Color.prototype.intToColorName = function (int) {
            var nbColors = 226 - 78;
            var count = 0;
            for (var key in Color.names) {
                if (Color.names.hasOwnProperty(key)) {
                    if (count == ((int * 763) % nbColors)) {
                        return Color.names[key];
                    }
                    count++;
                }
            }
        };
        Color.names = {
            aliceblue: "f0f8ff",
            antiquewhite: "faebd7",
            aqua: "0ff",
            aquamarine: "7fffd4",
            azure: "f0ffff",
            beige: "f5f5dc",
            bisque: "ffe4c4",
            black: "000",
            blanchedalmond: "ffebcd",
            blue: "00f",
            blueviolet: "8a2be2",
            brown: "a52a2a",
            burlywood: "deb887",
            burntsienna: "ea7e5d",
            cadetblue: "5f9ea0",
            chartreuse: "7fff00",
            chocolate: "d2691e",
            coral: "ff7f50",
            cornflowerblue: "6495ed",
            cornsilk: "fff8dc",
            crimson: "dc143c",
            cyan: "0ff",
            darkblue: "00008b",
            darkcyan: "008b8b",
            darkgoldenrod: "b8860b",
            darkgray: "a9a9a9",
            darkgreen: "006400",
            darkgrey: "a9a9a9",
            darkkhaki: "bdb76b",
            darkmagenta: "8b008b",
            darkolivegreen: "556b2f",
            darkorange: "ff8c00",
            darkorchid: "9932cc",
            darkred: "8b0000",
            darksalmon: "e9967a",
            darkseagreen: "8fbc8f",
            darkslateblue: "483d8b",
            darkslategray: "2f4f4f",
            darkslategrey: "2f4f4f",
            darkturquoise: "00ced1",
            darkviolet: "9400d3",
            deeppink: "ff1493",
            deepskyblue: "00bfff",
            dimgray: "696969",
            dimgrey: "696969",
            dodgerblue: "1e90ff",
            firebrick: "b22222",
            floralwhite: "fffaf0",
            forestgreen: "228b22",
            fuchsia: "f0f",
            gainsboro: "dcdcdc",
            ghostwhite: "f8f8ff",
            gold: "ffd700",
            goldenrod: "daa520",
            gray: "808080",
            green: "008000",
            greenyellow: "adff2f",
            grey: "808080",
            honeydew: "f0fff0",
            hotpink: "ff69b4",
            indianred: "cd5c5c",
            indigo: "4b0082",
            ivory: "fffff0",
            khaki: "f0e68c",
            lavender: "e6e6fa",
            lavenderblush: "fff0f5",
            lawngreen: "7cfc00",
            lemonchiffon: "fffacd",
            lightblue: "add8e6",
            lightcoral: "f08080",
            lightcyan: "e0ffff",
            lightgoldenrodyellow: "fafad2",
            lightgray: "d3d3d3",
            lightgreen: "90ee90",
            lightgrey: "d3d3d3",
            lightpink: "ffb6c1",
            lightsalmon: "ffa07a",
            lightseagreen: "20b2aa",
            lightskyblue: "87cefa",
            lightslategray: "789",
            lightslategrey: "789",
            lightsteelblue: "b0c4de",
            lightyellow: "ffffe0",
            lime: "0f0",
            limegreen: "32cd32",
            linen: "faf0e6",
            magenta: "f0f",
            maroon: "800000",
            mediumaquamarine: "66cdaa",
            mediumblue: "0000cd",
            mediumorchid: "ba55d3",
            mediumpurple: "9370db",
            mediumseagreen: "3cb371",
            mediumslateblue: "7b68ee",
            mediumspringgreen: "00fa9a",
            mediumturquoise: "48d1cc",
            mediumvioletred: "c71585",
            midnightblue: "191970",
            mintcream: "f5fffa",
            mistyrose: "ffe4e1",
            moccasin: "ffe4b5",
            navajowhite: "ffdead",
            navy: "000080",
            oldlace: "fdf5e6",
            olive: "808000",
            olivedrab: "6b8e23",
            orange: "ffa500",
            orangered: "ff4500",
            orchid: "da70d6",
            palegoldenrod: "eee8aa",
            palegreen: "98fb98",
            paleturquoise: "afeeee",
            palevioletred: "db7093",
            papayawhip: "ffefd5",
            peachpuff: "ffdab9",
            peru: "cd853f",
            pink: "ffc0cb",
            plum: "dda0dd",
            powderblue: "b0e0e6",
            purple: "800080",
            rebeccapurple: "663399",
            red: "f00",
            rosybrown: "bc8f8f",
            royalblue: "4169e1",
            saddlebrown: "8b4513",
            salmon: "fa8072",
            sandybrown: "f4a460",
            seagreen: "2e8b57",
            seashell: "fff5ee",
            sienna: "a0522d",
            silver: "c0c0c0",
            skyblue: "87ceeb",
            slateblue: "6a5acd",
            slategray: "708090",
            slategrey: "708090",
            snow: "fffafa",
            springgreen: "00ff7f",
            steelblue: "4682b4",
            tan: "d2b48c",
            teal: "008080",
            thistle: "d8bfd8",
            tomato: "ff6347",
            turquoise: "40e0d0",
            violet: "ee82ee",
            wheat: "f5deb3",
            white: "fff",
            whitesmoke: "f5f5f5",
            yellow: "ff0",
            yellowgreen: "9acd32"
        };
        return Color;
    }());
    mathis.Color = Color;
    var HSV_01 = (function () {
        function HSV_01(h, s, v, alpha) {
            if (alpha === void 0) { alpha = 1; }
            this.h = h;
            this.s = s;
            this.v = v;
            this.alpha = alpha;
        }
        HSV_01.HSV_01_toRGB_01 = function (h, s, v) {
            var r, g, b, i, f, p, q, t;
            i = Math.floor(h * 6);
            f = h * 6 - i;
            p = v * (1 - s);
            q = v * (1 - f * s);
            t = v * (1 - (1 - f) * s);
            switch (i % 6) {
                case 0:
                    r = v;
                    g = t;
                    b = p;
                    break;
                case 1:
                    r = q;
                    g = v;
                    b = p;
                    break;
                case 2:
                    r = p;
                    g = v;
                    b = t;
                    break;
                case 3:
                    r = p;
                    g = q;
                    b = v;
                    break;
                case 4:
                    r = t;
                    g = p;
                    b = v;
                    break;
                case 5:
                    r = v;
                    g = p;
                    b = q;
                    break;
            }
            return { r: r, g: g, b: b };
        };
        HSV_01.prototype.toRGB = function () {
            var pre = HSV_01.HSV_01_toRGB_01(this.h, this.s, this.v);
            return new RGB_range255(pre.r * 255, pre.g * 255, pre.b * 255, 1);
        };
        return HSV_01;
    }());
    mathis.HSV_01 = HSV_01;
    var RGB_range255 = (function () {
        function RGB_range255(r, g, b, alpha) {
            if (alpha === void 0) { alpha = 1; }
            this.r = 0;
            this.g = 0;
            this.b = 0;
            this.alpha = 1;
            this.setRed(r).setGreen(g).setBlue(b).setAlpha(alpha);
        }
        RGB_range255.prototype.getHexPart = function (v) {
            var h = v.toString(16);
            return (h.length > 1) ? h : "0" + h;
        };
        RGB_range255.prototype.setRed = function (value) {
            this.r = (value > 255) ? 255 : ((value < 0) ? 0 : Math.floor(value));
            return this;
        };
        RGB_range255.prototype.setGreen = function (value) {
            this.g = (value > 255) ? 255 : ((value < 0) ? 0 : Math.floor(value));
            return this;
        };
        RGB_range255.prototype.setBlue = function (value) {
            this.b = (value > 255) ? 255 : ((value < 0) ? 0 : Math.floor(value));
            return this;
        };
        RGB_range255.prototype.setAlpha = function (a) {
            this.alpha = (a <= 1 && a >= 0) ? a : 1;
            return this;
        };
        RGB_range255.prototype.lighten = function (by) {
            this.setRed(this.r + by)
                .setBlue(this.g + by)
                .setGreen(this.b + by);
            return this;
        };
        RGB_range255.prototype.darken = function (by) {
            this.setRed(this.r - by)
                .setBlue(this.g - by)
                .setGreen(this.b - by);
            return this;
        };
        RGB_range255.prototype.toString = function () {
            return (this.alpha < 1) ? 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + this.alpha + ')' : 'rgb(' + this.r + ',' + this.g + ',' + this.b + ')';
        };
        return RGB_range255;
    }());
    mathis.RGB_range255 = RGB_range255;
    var color;
    (function (color) {
        var thema;
        (function (thema) {
            thema.defaultSurfaceColor = new Color(new RGB_range255(255, 50, 50));
            thema.defaultVertexColor = new Color(new RGB_range255(255, 50, 50));
            thema.defaultLinkColor = new Color(new RGB_range255(124, 252, 0));
        })(thema = color.thema || (color.thema = {}));
    })(color = mathis.color || (mathis.color = {}));
    function HSVtoRGB(h, s, v, hasCSSstring) {
        if (hasCSSstring === void 0) { hasCSSstring = true; }
        var r, g, b, i, f, p, q, t;
        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0:
                r = v;
                g = t;
                b = p;
                break;
            case 1:
                r = q;
                g = v;
                b = p;
                break;
            case 2:
                r = p;
                g = v;
                b = t;
                break;
            case 3:
                r = p;
                g = q;
                b = v;
                break;
            case 4:
                r = t;
                g = p;
                b = v;
                break;
            case 5:
                r = v;
                g = p;
                b = q;
                break;
        }
        if (hasCSSstring) {
            r = Math.floor(r * 255);
            g = Math.floor(g * 255);
            b = Math.floor(b * 255);
            return 'rgb(' + r + ',' + g + ',' + b + ')';
        }
        else
            return { r: r, g: g, b: b };
    }
    mathis.HSVtoRGB = HSVtoRGB;
    function hexToRgb(hex, maxIs255) {
        if (maxIs255 === void 0) { maxIs255 = false; }
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        var denominator = (maxIs255) ? 1 : 255;
        return result ? {
            r: parseInt(result[1], 16) / denominator,
            g: parseInt(result[2], 16) / denominator,
            b: parseInt(result[3], 16) / denominator
        } : null;
    }
    mathis.hexToRgb = hexToRgb;
    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
    function rgbToHex(r, g, b) {
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }
    mathis.rgbToHex = rgbToHex;
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    var creation2D;
    (function (creation2D) {
        (function (PartShape) {
            PartShape[PartShape["triangulatedTriangle"] = 0] = "triangulatedTriangle";
            PartShape[PartShape["triangulatedRect"] = 1] = "triangulatedRect";
            PartShape[PartShape["square"] = 2] = "square";
            PartShape[PartShape["polygon3"] = 3] = "polygon3";
            PartShape[PartShape["polygon4"] = 4] = "polygon4";
            PartShape[PartShape["polygon5"] = 5] = "polygon5";
            PartShape[PartShape["polygon6"] = 6] = "polygon6";
            PartShape[PartShape["polygon7"] = 7] = "polygon7";
            PartShape[PartShape["polygon8"] = 8] = "polygon8";
            PartShape[PartShape["polygon9"] = 9] = "polygon9";
            PartShape[PartShape["polygon10"] = 10] = "polygon10";
            PartShape[PartShape["polygon11"] = 11] = "polygon11";
            PartShape[PartShape["polygon12"] = 12] = "polygon12";
        })(creation2D.PartShape || (creation2D.PartShape = {}));
        var PartShape = creation2D.PartShape;
        var Concentric = (function () {
            function Concentric(individualNbI, individualNbJ) {
                this.SUB_gratAndStick = new mathis.grateAndGlue.ConcurrentMameshesGraterAndSticker();
                this.SUB_oppositeLinkAssocierByAngles = new mathis.linkModule.OppositeLinkAssocierByAngles(null);
                this.SUB_mameshCleaner = new mathis.mameshModification.MameshCleaner(null);
                this.origine = new mathis.XYZ(0, 0, 0);
                this.end = new mathis.XYZ(1, 1, 0);
                this.rotation = 0.001;
                this.shapes = [PartShape.square];
                this.proportions = [new mathis.UV(1, 1), new mathis.UV(1, 1)];
                this.individualScales = [new mathis.UV(1, 1)];
                this.individualRotations = [0];
                this.individualTranslation = [new mathis.XYZ(0, 0, 0), new mathis.XYZ(0, 0, 0)];
                this.nbPatches = 2;
                this.toleranceToBeOneOfTheClosest = 0.55;
                this.stratesToSuppressFromCorners = [0];
                this.scalingBeforeOppositeLinkAssociations = null;
                this.exponentOfRoundingFunction = [1];
                this.percolationProba = [0];
                this.forceToGrate = [0.1];
                this.nbI = individualNbI;
                this.nbJ = individualNbJ;
            }
            Concentric.prototype.go = function () {
                var subMa = [];
                var _loop_2 = function(j) {
                    var indexModulo = (j) % this_2.shapes.length;
                    var partShape = this_2.shapes[indexModulo];
                    var name_1 = PartShape[partShape];
                    var nI = Math.round(this_2.nbI * this_2.proportions[j % this_2.proportions.length].u);
                    var nJ = Math.round(this_2.nbJ * this_2.proportions[j % this_2.proportions.length].v);
                    var radiusI = 0.5 * this_2.individualScales[j % this_2.individualScales.length].u * this_2.proportions[j % this_2.proportions.length].u;
                    var radiusJ = 0.5 * this_2.individualScales[j % this_2.individualScales.length].v * this_2.proportions[j % this_2.proportions.length].v;
                    var mamesh = void 0;
                    if (name_1.indexOf('polygon') != -1) {
                        var nbSides = parseInt(name_1.slice(7, name_1.length));
                        var crea = new mathis.reseau.TriangulatedPolygone(nbSides);
                        crea.origin = new mathis.XYZ(-radiusI, -radiusJ, 0);
                        crea.end = new mathis.XYZ(radiusI, radiusJ, 0);
                        crea.nbSubdivisionInARadius = Math.floor((nI + nJ) / 4);
                        mamesh = crea.go();
                    }
                    else if (partShape == PartShape.square || partShape == PartShape.triangulatedRect) {
                        var gene = new mathis.reseau.BasisForRegularReseau();
                        gene.origin = new mathis.XYZ(-radiusI, -radiusJ, 0);
                        gene.end = new mathis.XYZ(radiusI, radiusJ, 0);
                        gene.nbI = nI;
                        gene.nbJ = nJ;
                        if (partShape == PartShape.triangulatedRect)
                            gene.squareMailleInsteadOfTriangle = false;
                        gene.go();
                        var regular = new mathis.reseau.Regular(gene);
                        if (partShape == PartShape.triangulatedRect)
                            regular.oneMoreVertexForOddLine = true;
                        mamesh = regular.go();
                    }
                    else if (partShape == PartShape.triangulatedTriangle) {
                        var creator = new mathis.reseau.TriangulatedTriangle();
                        creator.origin = new mathis.XYZ(-radiusI, -radiusJ, 0);
                        creator.end = new mathis.XYZ(radiusI, radiusJ, 0);
                        creator.nbSubdivisionInSide = (nI + nJ) / 2;
                        mamesh = creator.go();
                    }
                    if (this_2.propBeginToRound || this_2.propEndToRound || this_2.integerBeginToRound || this_2.integerEndToRound) {
                        var rounder = new mathis.spacialTransformations.RoundSomeStrates(mamesh);
                        if (this_2.propBeginToRound == null)
                            rounder.propBeginToRound = 0;
                        else
                            rounder.propBeginToRound = this_2.propBeginToRound[j % this_2.propBeginToRound.length];
                        if (this_2.propEndToRound == null)
                            rounder.propEndToRound = 1;
                        else
                            rounder.propEndToRound = this_2.propEndToRound[j % this_2.propEndToRound.length];
                        if (this_2.integerBeginToRound != null)
                            rounder.integerBeginToRound = this_2.integerBeginToRound[j % this_2.integerBeginToRound.length];
                        if (this_2.integerEndToRound != null)
                            rounder.integerEndToRound = this_2.integerEndToRound[j % this_2.integerEndToRound.length];
                        rounder.exponentOfRoundingFunction = this_2.exponentOfRoundingFunction[j % this_2.exponentOfRoundingFunction.length];
                        rounder.referenceRadiusIsMinVersusMaxVersusMean = 2;
                        rounder.preventStratesCrossings = true;
                        rounder.goChanging();
                    }
                    var percolation = this_2.percolationProba[j * this_2.percolationProba.length];
                    if (percolation > 0) {
                        var percolator = new mathis.mameshModification.PercolationOnLinks(mamesh);
                        percolator.percolationProba = percolation;
                        percolator.goChanging();
                    }
                    if (this_2.stratesToSuppressFromCorners[j % this_2.stratesToSuppressFromCorners.length] > 0) {
                        var supp = new mathis.grateAndGlue.ExtractCentralPart(mamesh, this_2.stratesToSuppressFromCorners[j % this_2.stratesToSuppressFromCorners.length]);
                        supp.suppressFromBorderVersusCorner = false;
                        mamesh = supp.go();
                        mamesh.isolateMameshVerticesFromExteriorVertices();
                    }
                    subMa.push(mamesh);
                    var decay = this_2.individualTranslation[j % this_2.individualTranslation.length];
                    var angle = this_2.individualRotations[j % this_2.individualRotations.length];
                    var mat = new mathis.MM();
                    mathis.geo.axisAngleToMatrix(new mathis.XYZ(0, 0, -1), angle, mat);
                    mamesh.vertices.forEach(function (v) {
                        mathis.geo.multiplicationMatrixVector(mat, v.position, v.position);
                        v.position.add(decay);
                    });
                };
                var this_2 = this;
                for (var j = 0; j < this.nbPatches; j++) {
                    _loop_2(j);
                }
                var res;
                if (this.nbPatches > 1) {
                    this.SUB_gratAndStick.IN_mameshes = subMa;
                    this.SUB_gratAndStick.toleranceToBeOneOfTheClosest = this.toleranceToBeOneOfTheClosest;
                    this.SUB_gratAndStick.SUB_grater.proportionOfSeeds = this.forceToGrate;
                    res = this.SUB_gratAndStick.goChanging();
                }
                else {
                    res = subMa[0];
                    mathis.spacialTransformations.adjustInASquare(res, new mathis.XYZ(0, 0, 0), new mathis.XYZ(1, 1, 0));
                    res.clearOppositeInLinks();
                }
                if (this.scalingBeforeOppositeLinkAssociations != null)
                    mathis.spacialTransformations.adjustInASquare(res, new mathis.XYZ(0, 0, 0), new mathis.XYZ(this.scalingBeforeOppositeLinkAssociations.x, this.scalingBeforeOppositeLinkAssociations.y, 0));
                this.SUB_oppositeLinkAssocierByAngles.vertices = res.vertices;
                this.SUB_oppositeLinkAssocierByAngles.goChanging();
                this.SUB_mameshCleaner.IN_mamesh = res;
                this.SUB_mameshCleaner.goChanging();
                new mathis.spacialTransformations.Similitude(res.vertices, this.rotation).goChanging();
                mathis.spacialTransformations.adjustInASquare(res, this.origine, this.end);
                return res;
            };
            return Concentric;
        }());
        creation2D.Concentric = Concentric;
        var Patchwork = (function (_super) {
            __extends(Patchwork, _super);
            function Patchwork(nbI, nbJ, nbIPart, nbJPart) {
                _super.call(this, nbI, nbJ);
                this.nbPatchesI = 2;
                this.nbPatchesJ = 2;
                this.patchesInQuinconce = false;
                this.oddPatchLinesAreTheSameVersusLongerVersusShorter = 0;
                this.alternateShapeAccordingIPlusJVersusCounter = true;
                this.nbPatchesI = nbIPart;
                this.nbPatchesJ = nbJPart;
                this.nbPatches = 0;
                this.individualTranslation = [];
            }
            Patchwork.prototype.go = function () {
                this.individualTranslation = [];
                this.nbPatches = 0;
                var shapes = [];
                var count = 0;
                for (var j = 0; j < this.nbPatchesJ; j++) {
                    var someMoreOrLessOfOdd = 0;
                    if (j % 2 == 1) {
                        if (this.oddPatchLinesAreTheSameVersusLongerVersusShorter == 0)
                            someMoreOrLessOfOdd = 0;
                        else if (this.oddPatchLinesAreTheSameVersusLongerVersusShorter == 1)
                            someMoreOrLessOfOdd = 1;
                        else if (this.oddPatchLinesAreTheSameVersusLongerVersusShorter == 2)
                            someMoreOrLessOfOdd = -1;
                        else
                            throw 'must be 0 or 1 or 2';
                    }
                    for (var i = 0; i < this.nbPatchesI + someMoreOrLessOfOdd; i++) {
                        this.nbPatches++;
                        var dec = 0;
                        if (this.patchesInQuinconce && j % 2 == 1) {
                            if (this.oddPatchLinesAreTheSameVersusLongerVersusShorter == 0)
                                dec = -0.5;
                            if (this.oddPatchLinesAreTheSameVersusLongerVersusShorter == 1)
                                dec = -0.5;
                            if (this.oddPatchLinesAreTheSameVersusLongerVersusShorter == 2)
                                dec = 0.5;
                        }
                        this.individualTranslation.push(new mathis.XYZ(i + dec, j, 0));
                        count++;
                        var ind = (this.alternateShapeAccordingIPlusJVersusCounter) ? (i + someMoreOrLessOfOdd + j) : count;
                        shapes.push(this.shapes[ind % this.shapes.length]);
                    }
                }
                this.shapes = shapes;
                return _super.prototype.go.call(this);
            };
            return Patchwork;
        }(Concentric));
        creation2D.Patchwork = Patchwork;
    })(creation2D = mathis.creation2D || (mathis.creation2D = {}));
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    var creation3D;
    (function (creation3D) {
        var Snake = (function () {
            function Snake(mathisFrame) {
                this.maxLength = 500;
                this.curentLength = 0;
                this.serpentRadius = 0.03;
                this.path = [];
                this.sliceInsteadOfElongateWhenMaxLengthIsReached = true;
                this.initialPosition = new mathis.XYZ(0, 0, 0);
                this.mathisFrame = mathisFrame;
            }
            Snake.prototype.go = function () {
                for (var i = 0; i < this.maxLength; i++)
                    this.path.push(this.initialPosition);
                this.serpentMesh = BABYLON.Mesh.CreateTube('', this.path, this.serpentRadius, 10, null, BABYLON.Mesh.CAP_ALL, this.mathisFrame.scene, true);
                var green = new BABYLON.StandardMaterial('', this.mathisFrame.scene);
                green.diffuseColor = mathis.myFavoriteColors.green;
                this.serpentMesh.material = green;
                this.headSerpent = BABYLON.Mesh.CreateSphere('', 10, this.serpentRadius * 2.5, this.mathisFrame.scene);
                var red = new BABYLON.StandardMaterial('', this.mathisFrame.scene);
                red.diffuseColor = new BABYLON.Color3(1, 0, 0);
                this.headSerpent.material = red;
                this.headSerpent.position.copyFrom(this.initialPosition);
            };
            Snake.prototype.contractInOnePoint = function (point) {
                for (var i = 0; i < this.maxLength; i++)
                    this.path[i] = point;
                this.curentLength = 0;
                this.updateMeshes();
            };
            Snake.prototype.elongateTo = function (point) {
                if (this.curentLength < this.maxLength) {
                    for (var i = this.curentLength; i < this.maxLength; i++)
                        this.path[i] = point;
                    this.curentLength++;
                    this.updateMeshes();
                }
                else if (this.sliceInsteadOfElongateWhenMaxLengthIsReached)
                    this.bobySliceTo(point);
                else
                    throw "snake reaches his maximal length";
            };
            Snake.prototype.bobySliceTo = function (point) {
                this.path.splice(0, 1);
                this.path.push(point);
                this.updateMeshes();
            };
            Snake.prototype.updateMeshes = function () {
                this.serpentMesh = BABYLON.Mesh.CreateTube('', this.path, this.serpentRadius, null, null, null, null, true, null, this.serpentMesh);
                this.headSerpent.position = this.getHeadPosition();
            };
            Snake.prototype.getHeadPosition = function () {
                return this.path[this.path.length - 1];
            };
            return Snake;
        }());
        creation3D.Snake = Snake;
        var ArrowCreator = (function () {
            function ArrowCreator(scene) {
                this.totalHeight = 1;
                this.bodyProp = 3 / 4;
                this.headProp = 1 / 4;
                this.bodyDiameterProp = 0.1;
                this.headDiameterProp = 0.2;
                this.headUp = true;
                this.arrowFootAtOrigin = true;
                this.quaternion = null;
                this.subdivision = 6;
                this.scene = scene;
            }
            ArrowCreator.prototype.go = function () {
                var bodyHeight = this.bodyProp * this.totalHeight;
                var headHeight = this.headProp * this.totalHeight;
                var body = BABYLON.Mesh.CreateCylinder('', bodyHeight, this.bodyDiameterProp * this.totalHeight, this.bodyDiameterProp * this.totalHeight, this.subdivision, null, this.scene);
                body.position = new mathis.XYZ(0, bodyHeight / 2, 0);
                var head = BABYLON.Mesh.CreateCylinder('', headHeight, 0, this.headDiameterProp * this.totalHeight, this.subdivision, null, this.scene);
                head.position = new mathis.XYZ(0, bodyHeight + headHeight / 2, 0);
                var arrow = BABYLON.Mesh.MergeMeshes([body, head]);
                if (!this.arrowFootAtOrigin) {
                    arrow.position.addInPlace(new mathis.XYZ(0, -this.totalHeight / 2, 0));
                    arrow.bakeCurrentTransformIntoVertices();
                }
                var quat = new mathis.XYZW(0, 0, 0, 1);
                if (!this.headUp)
                    mathis.geo.axisAngleToQuaternion(new mathis.XYZ(1, 0, 0), Math.PI, quat);
                if (this.quaternion != null)
                    quat.multiply(this.quaternion);
                arrow.rotationQuaternion = quat;
                arrow.bakeCurrentTransformIntoVertices();
                if (this.color != null) {
                    var material = new BABYLON.StandardMaterial('', this.scene);
                    material.diffuseColor = this.color.toBABYLON_Color3();
                    arrow.material = material;
                }
                return arrow;
            };
            return ArrowCreator;
        }());
        creation3D.ArrowCreator = ArrowCreator;
        var TwoOrThreeAxisMerged = (function () {
            function TwoOrThreeAxisMerged(scene) {
                this.scene = scene;
                this.twoOrThreeAxis = new TwoOrTreeAxis(this.scene);
            }
            TwoOrThreeAxisMerged.prototype.go = function () {
                this.twoOrThreeAxis.addColor = false;
                var xyzAxis = this.twoOrThreeAxis.go();
                var three = BABYLON.Mesh.MergeMeshes(xyzAxis);
                var x_nbIndices = xyzAxis[0].getTotalIndices();
                var y_nbIndices = xyzAxis[1].getTotalIndices();
                var z_nbIndices = xyzAxis[2].getTotalIndices();
                var mat0 = new BABYLON.StandardMaterial('', this.scene);
                mat0.diffuseColor = new BABYLON.Color3(1, 0, 0);
                var mat1 = new BABYLON.StandardMaterial('', this.scene);
                mat1.diffuseColor = new BABYLON.Color3(0, 1, 0);
                var mat2 = new BABYLON.StandardMaterial('', this.scene);
                mat2.diffuseColor = new BABYLON.Color3(0, 0, 1);
                var nbVertices = three.getTotalVertices();
                three.subMeshes = [];
                three.subMeshes.push(new BABYLON.SubMesh(0, 0, nbVertices, 0, x_nbIndices, three));
                three.subMeshes.push(new BABYLON.SubMesh(1, 0, nbVertices, x_nbIndices, y_nbIndices, three));
                three.subMeshes.push(new BABYLON.SubMesh(2, 0, nbVertices, x_nbIndices + y_nbIndices, z_nbIndices, three));
                var multimat = new BABYLON.MultiMaterial("multi", this.scene);
                multimat.subMaterials.push(mat0);
                multimat.subMaterials.push(mat1);
                multimat.subMaterials.push(mat2);
                three.material = multimat;
                return three;
            };
            return TwoOrThreeAxisMerged;
        }());
        creation3D.TwoOrThreeAxisMerged = TwoOrThreeAxisMerged;
        var TwoOrTreeAxis = (function () {
            function TwoOrTreeAxis(scene) {
                this.isLeftHandSided = true;
                this.addColor = true;
                this.threeVersusTwoAxis = true;
                this.addLabelsXYZ = false;
                this.scene = scene;
                this.SUB_x_axisCreator = new ArrowCreator(this.scene);
                this.SUB_y_axisCreator = new ArrowCreator(this.scene);
                this.SUB_z_axisCreator = new ArrowCreator(this.scene);
            }
            TwoOrTreeAxis.prototype.go = function () {
                if (this.addColor) {
                    this.SUB_x_axisCreator.color = new mathis.Color(mathis.Color.names.red);
                    this.SUB_y_axisCreator.color = new mathis.Color(mathis.Color.names.green);
                    this.SUB_z_axisCreator.color = new mathis.Color(mathis.Color.names.blue);
                }
                var flags = [];
                if (this.addLabelsXYZ) {
                    var x_flagCreator = new creation3D.FlagWithText(this.scene);
                    x_flagCreator.text = "x";
                    var x_flag = x_flagCreator.go();
                    x_flag.position = new mathis.XYZ(1.1, 0, 0);
                    flags.push(x_flag);
                    var y_flagCreator = new creation3D.FlagWithText(this.scene);
                    y_flagCreator.text = "y";
                    var y_flag = y_flagCreator.go();
                    y_flag.position = new mathis.XYZ(0, 1.15, 0);
                    flags.push(y_flag);
                    var z_flagCreator = new creation3D.FlagWithText(this.scene);
                    z_flagCreator.text = "z";
                    var z_flag = z_flagCreator.go();
                    z_flag.position = new mathis.XYZ(0, 0.1, 1);
                    flags.push(z_flag);
                }
                var yMesh = this.SUB_y_axisCreator.go();
                yMesh.bakeCurrentTransformIntoVertices();
                var xMesh = this.SUB_x_axisCreator.go();
                mathis.geo.axisAngleToQuaternion(new mathis.XYZ(0, 0, 1), -Math.PI / 2, xMesh.rotationQuaternion);
                xMesh.bakeCurrentTransformIntoVertices();
                if (this.threeVersusTwoAxis) {
                    var zMesh = this.SUB_z_axisCreator.go();
                    var angle = (this.isLeftHandSided) ? Math.PI / 2 : -Math.PI / 2;
                    mathis.geo.axisAngleToQuaternion(new mathis.XYZ(1, 0, 0), angle, zMesh.rotationQuaternion);
                    zMesh.bakeCurrentTransformIntoVertices();
                    return [xMesh, yMesh, zMesh].concat(flags);
                }
                else
                    return [xMesh, yMesh].concat(flags);
            };
            return TwoOrTreeAxis;
        }());
        creation3D.TwoOrTreeAxis = TwoOrTreeAxis;
        var FlagWithText = (function () {
            function FlagWithText(scene) {
                this.text = "TOTO";
                this.font = "bold 140px verdana";
                this.color = "black";
                this.backgroundColor = "transparent";
                this.scene = scene;
            }
            FlagWithText.prototype.go = function () {
                var textPlaneTexture = new BABYLON.DynamicTexture("dynamic texture", 512, this.scene, true);
                textPlaneTexture.drawText(this.text, null, 300, this.font, this.color, this.backgroundColor);
                textPlaneTexture.hasAlpha = true;
                var textPlane = BABYLON.Mesh.CreatePlane("textPlane", 1, this.scene, false);
                var material = new BABYLON.StandardMaterial("textPlane", this.scene);
                material.diffuseTexture = textPlaneTexture;
                material.specularColor = new BABYLON.Color3(0, 0, 0);
                material.emissiveColor = new BABYLON.Color3(1, 1, 1);
                material.backFaceCulling = false;
                textPlane.material = material;
                return textPlane;
            };
            return FlagWithText;
        }());
        creation3D.FlagWithText = FlagWithText;
    })(creation3D = mathis.creation3D || (mathis.creation3D = {}));
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    var debug;
    (function (debug) {
        function verticesToString(vertices) {
            var tab = [];
            for (var _i = 0, vertices_2 = vertices; _i < vertices_2.length; _i++) {
                var v = vertices_2[_i];
                tab.push(v.hashNumber);
            }
            return JSON.stringify(tab.sort());
        }
        debug.verticesToString = verticesToString;
        function verticesFamilyToString(verticesFamily) {
            var tableau = [];
            for (var _i = 0, verticesFamily_1 = verticesFamily; _i < verticesFamily_1.length; _i++) {
                var fam = verticesFamily_1[_i];
                var a = [];
                for (var _a = 0, fam_1 = fam; _a < fam_1.length; _a++) {
                    var v = fam_1[_a];
                    a.push(v.hashNumber);
                }
                tableau.push(mathis.tab.indicesUpPermutationToString(a));
            }
            return JSON.stringify(tableau.sort());
        }
        debug.verticesFamilyToString = verticesFamilyToString;
        function objToString(array) {
            var res = '';
            for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
                var xyz = array_1[_i];
                res += xyz.toString();
            }
            return res;
        }
        debug.objToString = objToString;
        function checkTheRegularityOfAGraph(vertices) {
            for (var _i = 0, vertices_3 = vertices; _i < vertices_3.length; _i++) {
                var central = vertices_3[_i];
                var link = null;
                for (var _a = 0, _b = central.links; _a < _b.length; _a++) {
                    link = _b[_a];
                    if (!link.to.hasVoisin(central))
                        throw "neighborhood relation is not reflexive. The vertex:" + central.toString(0) + "\n has a link which gos to:" + link.to.toString(0) +
                            "\n but no link in the other direction. A possible cause: you vertices is only a part of a graph";
                    if (link.opposites != null) {
                        for (var _c = 0, _d = link.opposites; _c < _d.length; _c++) {
                            var op = _d[_c];
                            if (central.links.indexOf(op) == -1)
                                throw "a link attached to a vertex has an opposite link which is not attached of this vertex \n " +
                                    "problem takes place at vertex:" + central.toString(0)
                                    + "\n link going to:" + link.to.toString(0)
                                    + "\n opposite link going to:" + op.to.toString(0);
                            if (op.opposites.indexOf(link) == -1)
                                throw "opposite of  opposite do not give the same link";
                        }
                    }
                }
            }
        }
        debug.checkTheRegularityOfAGraph = checkTheRegularityOfAGraph;
    })(debug = mathis.debug || (mathis.debug = {}));
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    var differentialSystem;
    (function (differentialSystem) {
        var TwoDim = (function () {
            function TwoDim(vectorField, mathisFrame) {
                this.originMath = new mathis.XYZ(0, 0, 0);
                this.endMath = new mathis.XYZ(1, 1, 0);
                this.originView = new mathis.XYZ(-1, -1, 0);
                this.endView = new mathis.XYZ(1, 1, 0);
                this.nbI = 20;
                this.nbJ = 20;
                this.departure = new mathis.XYZ(0, 0, 0);
                this.deltaT = 0.1;
                this.vectorsAreArrowsVersusCone = true;
                this.scaleVectorsAccordingToTheirNorm = false;
                this.makeLightAndCamera = true;
                this.generator = new mathis.reseau.BasisForRegularReseau();
                this.stochasticVariation = new mathis.XYZ(0, 0, 0);
                this.dW = new mathis.XYZ(0, 0, 0);
                this.scaler = null;
                this.functionToSortvertex = function (v1, v2) { return v1.customerObject.squareLengthOfTangent - v2.customerObject.squareLengthOfTangent; };
                this.vectorField = vectorField;
                this.mathisFrame = mathisFrame;
            }
            TwoDim.prototype.go = function () {
                if (this.randomExitation == null)
                    this.randomExitation = function () { return new mathis.XYZ(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5); };
                this.generator.nbI = this.nbI;
                this.generator.nbJ = this.nbJ;
                this.generator.origin = this.originView;
                this.generator.end = this.endView;
                this.makePlanForClick();
                if (this.makeLightAndCamera)
                    this.lightAndCamera();
                this.arrowModel = this.createArrowModel();
                this.scaler = mathis.geo.affineTransformGenerator(this.originView, this.endView, this.originMath, this.endMath);
                this.loadVectorFields();
                this.mameshAndPositioning();
                if (this.scaleVectorsAccordingToTheirNorm)
                    this.prepareRescaling();
                this.start();
            };
            TwoDim.prototype.makePlanForClick = function () {
                this.planForClick = BABYLON.Mesh.CreatePlane('', 1, this.mathisFrame.scene);
                var amplitude = mathis.XYZ.newFrom(this.generator.end).substract(this.generator.origin);
                var middle = mathis.XYZ.newFrom(this.generator.origin).add(this.generator.end).scale(0.5);
                this.planForClick.scaling = new mathis.XYZ(amplitude.x, amplitude.y, 0);
                this.planForClick.position = new mathis.XYZ(middle.x, middle.y, 0.06);
                this.planForClick.bakeCurrentTransformIntoVertices();
                this.planForClick.visibility = 0;
            };
            TwoDim.prototype.lightAndCamera = function () {
                var amplitude = mathis.XYZ.newFrom(this.generator.end).substract(this.generator.origin);
                var grabber = new mathis.macamera.PlanarGrabber(this.mathisFrame.scene, new mathis.XYZ(amplitude.x, amplitude.y, 0.061));
                grabber.mesh.visibility = 0;
                var macam = new mathis.macamera.GrabberCamera(this.mathisFrame, grabber);
                macam.checkCollisions = false;
                macam.useFreeModeWhenCursorOutOfGrabber = false;
                macam.changePosition(new mathis.XYZ(0, 0, -2), false);
                macam.attachControl(this.mathisFrame.canvas);
                var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(-1, 1, -1), this.mathisFrame.scene);
                light0.diffuse = new BABYLON.Color3(0.5, 0.5, 0.5);
                light0.specular = new BABYLON.Color3(0.7, 0.7, 0.7);
                light0.groundColor = new BABYLON.Color3(1, 1, 1);
            };
            TwoDim.prototype.computeNewPathPoint = function (previousPoint, t, res) {
                this.vectorFieldScaled(t, previousPoint, res);
                res.scale(this.deltaT);
                if (this.vectorFieldForNoiseScaled != null) {
                    this.vectorFieldForNoiseScaled(t, previousPoint, this.stochasticVariation);
                    this.stochasticVariation.multiply(this.randomExitation()).scale(Math.sqrt(this.deltaT));
                    res.add(this.stochasticVariation);
                }
                res.add(previousPoint);
            };
            TwoDim.prototype.mameshAndPositioning = function () {
                var regCrea = new mathis.reseau.Regular(this.generator);
                regCrea.squareVersusTriangleMaille = false;
                this.mamesh = regCrea.go();
                var posiComp = new mathis.mameshAroundComputations.PositioningComputerForMameshVertices(this.mamesh);
                posiComp.computeTangent = false;
                posiComp.sizesProp = new mathis.XYZ(0.15, 0.15, 0.15);
                this.positionings = posiComp.go();
                this.vectorReferencesize = this.positionings.getValue(this.mamesh.vertices[0]).scaling.x;
            };
            TwoDim.prototype.createArrowModel = function () {
                var arrowModel;
                var qua = new mathis.XYZW(0, 0, 0, 0);
                mathis.geo.axisAngleToQuaternion(new mathis.XYZ(0, 0, 1), -Math.PI / 2, qua);
                if (this.vectorsAreArrowsVersusCone) {
                    var arrowCreator = new mathis.creation3D.ArrowCreator(this.mathisFrame.scene);
                    arrowCreator.quaternion = qua;
                    arrowCreator.arrowFootAtOrigin = false;
                    arrowCreator.totalHeight = 3;
                    arrowCreator.bodyDiameterProp = 0.2;
                    arrowCreator.headDiameterProp = 0.4;
                    arrowModel = arrowCreator.go();
                }
                else {
                    arrowModel = BABYLON.Mesh.CreateCylinder('', 2, 0, 1, 6, null, this.mathisFrame.scene);
                    arrowModel.rotationQuaternion = qua;
                    arrowModel.bakeCurrentTransformIntoVertices();
                }
                var mat = new BABYLON.StandardMaterial('', this.mathisFrame.scene);
                mat.diffuseColor = new BABYLON.Color3(0, 0, 1);
                arrowModel.material = mat;
                return arrowModel;
            };
            TwoDim.prototype.loadVectorFields = function () {
                var _this = this;
                var pScaled = new mathis.XYZ(0, 0, 0);
                this.vectorFieldScaled = function (t, p, res) {
                    _this.scaler(p, pScaled);
                    _this.vectorField(t, pScaled, res);
                };
                if (this.vectorFieldForNoise != null) {
                    var p2Scaled_1 = new mathis.XYZ(0, 0, 0);
                    this.vectorFieldForNoiseScaled = function (t, p, res) {
                        _this.scaler(p, p2Scaled_1);
                        _this.vectorFieldForNoise(t, p2Scaled_1, res);
                    };
                }
            };
            TwoDim.prototype.start = function () {
                var _this = this;
                var snake = new mathis.creation3D.Snake(this.mathisFrame);
                snake.initialPosition = this.departure;
                snake.serpentRadius = 0.01;
                snake.go();
                this.mamesh.vertices.forEach(function (v) {
                    _this.vectorFieldScaled(0, v.position, _this.positionings.getValue(v).frontDir);
                });
                var vertexVisu = new mathis.visu3d.VerticesViewer(this.mamesh, this.mathisFrame.scene, this.positionings);
                vertexVisu.meshModel = this.arrowModel;
                vertexVisu.go();
                var curentTime = 0;
                var mainAction = new mathis.PeriodicAction(function () {
                    curentTime += _this.deltaT;
                    var point = new mathis.XYZ(0, 0, 0);
                    _this.computeNewPathPoint(snake.getHeadPosition(), curentTime, point);
                    snake.elongateTo(point);
                    _this.mamesh.vertices.forEach(function (v) {
                        var pos = _this.positionings.getValue(v);
                        _this.vectorFieldScaled(curentTime, v.position, pos.frontDir);
                    });
                    if (_this.scaleVectorsAccordingToTheirNorm)
                        _this.rescaleVectors(_this.vectorReferencesize);
                    vertexVisu.updatePositionings();
                });
                mainAction.id = "main action";
                mainAction.frameInterval = 1;
                this.mathisFrame.pushPeriodicAction(mainAction);
                this.planForClick.onClick = function (dep) {
                    var action = new mathis.PeriodicAction(function () {
                        snake.contractInOnePoint(dep);
                    });
                    action.frameInterval = 1;
                    action.nbTimesThisActionMustBeFired = 1;
                    action.id = "click action";
                    action.passageOrderIndex = 2;
                    _this.mathisFrame.pushPeriodicAction(action);
                };
            };
            TwoDim.prototype.prepareRescaling = function () {
                var _this = this;
                this.verticeSorted = [];
                this.mamesh.vertices.forEach(function (v) { return _this.verticeSorted.push(v); });
            };
            TwoDim.prototype.rescaleVectors = function (vertexRefSize) {
                var _this = this;
                this.mamesh.vertices.forEach(function (v) {
                    v.customerObject.squareLengthOfTangent = _this.positionings.getValue(v).frontDir.lengthSquared();
                });
                this.verticeSorted.sort(this.functionToSortvertex);
                for (var i = 0; i < this.verticeSorted.length; i++)
                    this.verticeSorted[i].customerObject.scaleFromOrder = (i / this.verticeSorted.length);
                this.mamesh.vertices.forEach(function (v) {
                    var pos = _this.positionings.getValue(v);
                    pos.scaling.x = 2 * vertexRefSize * (v.customerObject.scaleFromOrder + 1 / 4);
                    var epaisseur = vertexRefSize * Math.max(1, v.customerObject.scaleFromOrder + 1 / 2);
                    pos.scaling.y = epaisseur;
                    pos.scaling.z = epaisseur;
                });
            };
            return TwoDim;
        }());
        differentialSystem.TwoDim = TwoDim;
    })(differentialSystem = mathis.differentialSystem || (mathis.differentialSystem = {}));
})(mathis || (mathis = {}));
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
                this.nameOfResau3d = NameOfReseau3D.cube;
                this.nbVerticalDecays = 0;
                this.nbHorizontalDecays = 0;
                this.fondamentalDomainSize = 9;
                this.nbSubdivision = 3;
                this.nbRepetition = 8;
                this.fogDensity = 0.05;
                this.drawFondamentalDomain = false;
                this.recenterCamera = true;
                this.notDrawMeshesAtFarCorners = true;
                this.population = [];
                this.collisionOnLinks = false;
                this.collisionOnVertices = false;
                this.collisionForCamera = false;
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
                var totalSize = this.getTotalSize();
                this.getCamera().changePosition(new mathis.XYZ(0, 0, -totalSize * 2), false);
                this.getCamera().changeFrontDir(new mathis.XYZ(0, 0, 1), false);
                this.recenterCamera = false;
                this.getGrabber().mesh.visibility = 1;
                this.getCamera().useOnlyFreeMode = false;
                this.mathisFrame.scene.fogMode = BABYLON.Scene.FOGMODE_NONE;
            };
            InfiniteCartesian.prototype.seeWorldFromInside = function () {
                this.recenterCamera = true;
                this.getCamera().changePosition(new mathis.XYZ(0, 0, 0), false);
                this.getCamera().changeFrontDir(new mathis.XYZ(-0.5, -0.5, -1), false);
                this.getGrabber().mesh.visibility = 0;
                this.getCamera().useOnlyFreeMode = true;
                this.mathisFrame.scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
            };
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
                grabber0.mesh.visibility = 0;
                var camera = new mathis.macamera.GrabberCamera(this.mathisFrame, grabber0);
                camera.translationSpeed = this.fondamentalDomainSize * 0.5;
                camera.checkCollisions = this.collisionForCamera;
                camera.keysFrontward = [66, 78];
                camera.keysBackward = [32];
                camera.attachControl(this.mathisFrame.canvas);
                this.mathisFrame.scene.activeCamera = camera;
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
                skybox.visibility = 1;
                var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", this.mathisFrame.scene);
                skyboxMaterial.backFaceCulling = false;
                skybox.material = skyboxMaterial;
                skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
                skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
                skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/skybox/skybox", this.mathisFrame.scene, ['_px.jpg', '_py.jpg', '_pz.jpg', '_nx.jpg', '_ny.jpg', '_nz.jpg']);
                skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
                this.mathisFrame.scene.fogDensity = this.fogDensity;
                this.mathisFrame.scene.fogColor = new BABYLON.Color3(1, 1, 1);
            };
            return InfiniteCartesian;
        }());
        infiniteWorlds.InfiniteCartesian = InfiniteCartesian;
    })(infiniteWorlds = mathis.infiniteWorlds || (mathis.infiniteWorlds = {}));
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    var mecaStat;
    (function (mecaStat) {
        var IsingOnMesh = (function () {
            function IsingOnMesh(mathisFrame) {
                this.q = 1.1;
                this.beta = 0.5;
                this.sphereRadius = 1;
                this.frameInterval = 5;
                this.nbActionsPerIteration = 100;
                this.defineLightAndCamera = true;
                this.nbDicho = 4;
                this.mathisFrame = mathisFrame;
            }
            IsingOnMesh.prototype.go = function () {
                if (this.defineLightAndCamera)
                    this.lightAndCam();
                this.meshAndIsing();
            };
            IsingOnMesh.prototype.lightAndCam = function () {
                var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(-1, 1, -1), this.mathisFrame.scene);
                light0.diffuse = new BABYLON.Color3(1, 1, 1);
                light0.specular = new BABYLON.Color3(1, 1, 1);
                light0.groundColor = new BABYLON.Color3(0.5, 0.5, 0.5);
                var center = new mathis.XYZ(0, 0, 0);
                var grabber = new mathis.macamera.SphericalGrabber(this.mathisFrame.scene, new mathis.XYZ(this.sphereRadius, this.sphereRadius, this.sphereRadius), center);
                grabber.mesh.material.alpha = 0.6;
                grabber.showGrabberOnlyWhenGrabbing = false;
                grabber.endOfZone1 = 0;
                grabber.endOfZone2 = 0;
                var macam = new mathis.macamera.GrabberCamera(this.mathisFrame, grabber);
                macam.useFreeModeWhenCursorOutOfGrabber = false;
                macam.changePosition(new mathis.XYZ(0, 0, -4 * this.sphereRadius), false);
                macam.attachControl(this.mathisFrame.canvas);
            };
            IsingOnMesh.prototype.meshAndIsing = function () {
                var _this = this;
                var sphereMaker = new mathis.polyhedron.Polyhedron("dodecahedron");
                var mamesh = sphereMaker.go();
                for (var i = 0; i < this.nbDicho; i++) {
                    var dicho = new mathis.mameshModification.TriangleDichotomer(mamesh);
                    dicho.makeLinks = true;
                    dicho.go();
                }
                mamesh.vertices.forEach(function (v) {
                    v.position.normalize().scale(_this.sphereRadius);
                });
                var ising = new mathis.metropolis.IsingModel(mamesh.vertices);
                ising.beta = this.beta;
                ising.q = this.q;
                ising.nbActionsPerIteration = this.nbActionsPerIteration;
                ising.go();
                var model1 = this.sphereModel(new BABYLON.Color3(1, 0, 0));
                var model2 = this.sphereModel(new BABYLON.Color3(0, 0, 1));
                var positionner = new mathis.mameshAroundComputations.PositioningComputerForMameshVertices(mamesh);
                positionner.sizesProp = new mathis.XYZ(1, 1, 1);
                var positioning = positionner.go();
                var positioning1 = new mathis.HashMap();
                mamesh.vertices.forEach(function (v) {
                    var po = new mathis.Positioning();
                    po.copyFrom(positioning.getValue(v));
                    po.scaling.copyFromFloats(0, 0, 0);
                    positioning1.putValue(v, po);
                });
                var positioning2 = new mathis.HashMap();
                mamesh.vertices.forEach(function (v) {
                    var po = new mathis.Positioning();
                    po.copyFrom(positioning.getValue(v));
                    po.scaling.copyFromFloats(0, 0, 0);
                    positioning2.putValue(v, po);
                });
                var vertVisu1 = new mathis.visu3d.VerticesViewer(mamesh, this.mathisFrame.scene);
                vertVisu1.positionings = positioning1;
                vertVisu1.meshModel = model1;
                vertVisu1.go();
                var vertVisu2 = new mathis.visu3d.VerticesViewer(mamesh, this.mathisFrame.scene);
                vertVisu2.positionings = positioning2;
                vertVisu2.meshModel = model2;
                vertVisu2.go();
                var commonSizes = positioning.getValue(mamesh.vertices[0]).scaling;
                var action = new mathis.PeriodicAction(function () {
                    var changed = ising.iterateAndGetChangedVertices();
                    changed.allKeys().forEach(function (v) {
                        if (v.customerObject.value == 0) {
                            positioning1.getValue(v).scaling.copyFromFloats(0, 0, 0);
                            positioning2.getValue(v).scaling.copyFromFloats(0, 0, 0);
                        }
                        else if (v.customerObject.value == 1) {
                            positioning1.getValue(v).scaling.copyFrom(commonSizes);
                            positioning2.getValue(v).scaling.copyFromFloats(0, 0, 0);
                        }
                        else if (v.customerObject.value == -1) {
                            positioning2.getValue(v).scaling.copyFrom(commonSizes);
                            positioning1.getValue(v).scaling.copyFromFloats(0, 0, 0);
                        }
                    });
                    vertVisu1.updatePositionings();
                    vertVisu2.updatePositionings();
                });
                action.frameInterval = this.frameInterval;
                this.mathisFrame.pushPeriodicAction(action);
            };
            IsingOnMesh.prototype.sphereModel = function (color) {
                var model = BABYLON.Mesh.CreateSphere('', 6, 1, this.mathisFrame.scene);
                var mat1 = new BABYLON.StandardMaterial('', this.mathisFrame.scene);
                mat1.diffuseColor = color;
                model.material = mat1;
                var qua = new mathis.XYZW(0, 0, 0, 0);
                mathis.geo.axisAngleToQuaternion(new mathis.XYZ(1, 0, 0), Math.PI / 2, qua);
                model.rotationQuaternion = qua;
                return model;
            };
            return IsingOnMesh;
        }());
        mecaStat.IsingOnMesh = IsingOnMesh;
    })(mecaStat = mathis.mecaStat || (mathis.mecaStat = {}));
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    var Geo = (function () {
        function Geo() {
            this.epsilon = 0.00000001;
            this.epsilonSquare = this.epsilon * this.epsilon;
            this.epsitlonForAlmostEquality = 0.000001;
            this._resultTransp = new mathis.MM();
            this.baryResult = new mathis.XYZ(0, 0, 0);
            this._scaled = new mathis.XYZ(0, 0, 0);
            this._matUn = new mathis.MM();
            this._source = new mathis.XYZ(0, 0, 0);
            this._axis = new mathis.XYZ(0, 0, 0);
            this._ortBasisV1 = new mathis.XYZ(0, 0, 0);
            this._ortBasisV2 = new mathis.XYZ(0, 0, 0);
            this._ortBasisV3 = new mathis.XYZ(0, 0, 0);
            this._ortBasisAll = new mathis.MM();
            this._basisOrtho0 = new mathis.XYZ(0, 0, 0);
            this._basisOrtho1 = new mathis.XYZ(0, 0, 0);
            this._basisOrtho2 = new mathis.XYZ(0, 0, 0);
            this._basisMatrix = new mathis.MM();
            this._transposedBasisMatrix = new mathis.MM();
            this._diagoMatrix = new mathis.MM();
            this.matt1 = new mathis.MM();
            this.matt2 = new mathis.MM();
            this.oor1 = new mathis.XYZ(0, 0, 0);
            this.oor2 = new mathis.XYZ(0, 0, 0);
            this.copA = new mathis.XYZ(0, 0, 0);
            this.copB = new mathis.XYZ(0, 0, 0);
            this.copC = new mathis.XYZ(0, 0, 0);
            this.copD = new mathis.XYZ(0, 0, 0);
            this.matBefore = new mathis.MM();
            this.v1nor = new mathis.XYZ(0, 0, 0);
            this.v2nor = new mathis.XYZ(0, 0, 0);
            this._aCros = new mathis.XYZ(0, 0, 0);
            this._quat0 = new mathis.XYZW(0, 0, 0, 0);
            this._quat1 = new mathis.XYZW(0, 0, 0, 0);
            this._quatAlpha = new mathis.XYZW(0, 0, 0, 0);
            this._mat0 = new mathis.MM();
            this._mat1 = new mathis.MM();
            this._matAlpha = new mathis.MM();
            this._c0 = new mathis.XYZ(0, 0, 0);
            this._c1 = new mathis.XYZ(0, 0, 0);
            this._crossResult = new mathis.XYZ(0, 0, 0);
            this.v1forSubstraction = new mathis.XYZ(0, 0, 0);
            this.randV2 = new mathis.XYZ(0, 0, 0);
            this._result1 = new mathis.XYZ(0, 0, 0);
            this._result2 = new mathis.XYZ(0, 0, 0);
            this.spheCentToRayOri = new mathis.XYZ(0, 0, 0);
            this._resultInters = new mathis.XYZ(0, 0, 0);
            this.difference = new mathis.XYZ(0, 0, 0);
            this._xAxis = mathis.XYZ.newZero();
            this._yAxis = mathis.XYZ.newZero();
            this._zAxis = mathis.XYZ.newZero();
        }
        Geo.prototype.copyXYZ = function (original, result) {
            result.x = original.x;
            result.y = original.y;
            result.z = original.z;
            return result;
        };
        Geo.prototype.copyXyzFromFloat = function (x, y, z, result) {
            result.x = x;
            result.y = y;
            result.z = z;
            return result;
        };
        Geo.prototype.copyMat = function (original, result) {
            for (var i = 0; i < 16; i++)
                result.m[i] = original.m[i];
            return result;
        };
        Geo.prototype.matEquality = function (mat1, mat2) {
            for (var i = 0; i < 16; i++) {
                if (mat1.m[i] != mat2.m[i])
                    return false;
            }
            return true;
        };
        Geo.prototype.matAlmostEquality = function (mat1, mat2) {
            for (var i = 0; i < 16; i++) {
                if (!this.almostEquality(mat1.m[i], mat2.m[i]))
                    return false;
            }
            return true;
        };
        Geo.prototype.xyzEquality = function (vec1, vec2) {
            return vec1.x == vec2.x && vec1.y == vec2.y && vec1.z == vec2.z;
        };
        Geo.prototype.xyzAlmostEquality = function (vec1, vec2) {
            return Math.abs(vec1.x - vec2.x) < this.epsitlonForAlmostEquality && Math.abs(vec1.y - vec2.y) < this.epsitlonForAlmostEquality && Math.abs(vec1.z - vec2.z) < this.epsitlonForAlmostEquality;
        };
        Geo.prototype.xyzwAlmostEquality = function (vec1, vec2) {
            return Math.abs(vec1.x - vec2.x) < this.epsitlonForAlmostEquality && Math.abs(vec1.y - vec2.y) < this.epsitlonForAlmostEquality && Math.abs(vec1.z - vec2.z) < this.epsitlonForAlmostEquality && Math.abs(vec1.w - vec2.w) < this.epsitlonForAlmostEquality;
        };
        Geo.prototype.almostLogicalEqual = function (quat1, quat2) {
            return mathis.geo.xyzwAlmostEquality(quat1, quat2) ||
                (mathis.geo.almostEquality(quat1.x, -quat2.x) && mathis.geo.almostEquality(quat1.y, -quat2.y) && mathis.geo.almostEquality(quat1.z, -quat2.z) && mathis.geo.almostEquality(quat1.w, -quat2.w));
        };
        Geo.prototype.xyzAlmostZero = function (vec) {
            return Math.abs(vec.x) < this.epsilon && Math.abs(vec.y) < this.epsilon && Math.abs(vec.z) < this.epsilon;
        };
        Geo.prototype.almostEquality = function (a, b) {
            return Math.abs(b - a) < this.epsitlonForAlmostEquality;
        };
        Geo.prototype.inverse = function (m1, result) {
            var l1 = m1.m[0];
            var l2 = m1.m[1];
            var l3 = m1.m[2];
            var l4 = m1.m[3];
            var l5 = m1.m[4];
            var l6 = m1.m[5];
            var l7 = m1.m[6];
            var l8 = m1.m[7];
            var l9 = m1.m[8];
            var l10 = m1.m[9];
            var l11 = m1.m[10];
            var l12 = m1.m[11];
            var l13 = m1.m[12];
            var l14 = m1.m[13];
            var l15 = m1.m[14];
            var l16 = m1.m[15];
            var l17 = (l11 * l16) - (l12 * l15);
            var l18 = (l10 * l16) - (l12 * l14);
            var l19 = (l10 * l15) - (l11 * l14);
            var l20 = (l9 * l16) - (l12 * l13);
            var l21 = (l9 * l15) - (l11 * l13);
            var l22 = (l9 * l14) - (l10 * l13);
            var l23 = ((l6 * l17) - (l7 * l18)) + (l8 * l19);
            var l24 = -(((l5 * l17) - (l7 * l20)) + (l8 * l21));
            var l25 = ((l5 * l18) - (l6 * l20)) + (l8 * l22);
            var l26 = -(((l5 * l19) - (l6 * l21)) + (l7 * l22));
            var l27 = 1.0 / ((((l1 * l23) + (l2 * l24)) + (l3 * l25)) + (l4 * l26));
            var l28 = (l7 * l16) - (l8 * l15);
            var l29 = (l6 * l16) - (l8 * l14);
            var l30 = (l6 * l15) - (l7 * l14);
            var l31 = (l5 * l16) - (l8 * l13);
            var l32 = (l5 * l15) - (l7 * l13);
            var l33 = (l5 * l14) - (l6 * l13);
            var l34 = (l7 * l12) - (l8 * l11);
            var l35 = (l6 * l12) - (l8 * l10);
            var l36 = (l6 * l11) - (l7 * l10);
            var l37 = (l5 * l12) - (l8 * l9);
            var l38 = (l5 * l11) - (l7 * l9);
            var l39 = (l5 * l10) - (l6 * l9);
            result.m[0] = l23 * l27;
            result.m[4] = l24 * l27;
            result.m[8] = l25 * l27;
            result.m[12] = l26 * l27;
            result.m[1] = -(((l2 * l17) - (l3 * l18)) + (l4 * l19)) * l27;
            result.m[5] = (((l1 * l17) - (l3 * l20)) + (l4 * l21)) * l27;
            result.m[9] = -(((l1 * l18) - (l2 * l20)) + (l4 * l22)) * l27;
            result.m[13] = (((l1 * l19) - (l2 * l21)) + (l3 * l22)) * l27;
            result.m[2] = (((l2 * l28) - (l3 * l29)) + (l4 * l30)) * l27;
            result.m[6] = -(((l1 * l28) - (l3 * l31)) + (l4 * l32)) * l27;
            result.m[10] = (((l1 * l29) - (l2 * l31)) + (l4 * l33)) * l27;
            result.m[14] = -(((l1 * l30) - (l2 * l32)) + (l3 * l33)) * l27;
            result.m[3] = -(((l2 * l34) - (l3 * l35)) + (l4 * l36)) * l27;
            result.m[7] = (((l1 * l34) - (l3 * l37)) + (l4 * l38)) * l27;
            result.m[11] = -(((l1 * l35) - (l2 * l37)) + (l4 * l39)) * l27;
            result.m[15] = (((l1 * l36) - (l2 * l38)) + (l3 * l39)) * l27;
        };
        Geo.prototype.transpose = function (matrix, result) {
            this._resultTransp.m[0] = matrix.m[0];
            this._resultTransp.m[1] = matrix.m[4];
            this._resultTransp.m[2] = matrix.m[8];
            this._resultTransp.m[3] = matrix.m[12];
            this._resultTransp.m[4] = matrix.m[1];
            this._resultTransp.m[5] = matrix.m[5];
            this._resultTransp.m[6] = matrix.m[9];
            this._resultTransp.m[7] = matrix.m[13];
            this._resultTransp.m[8] = matrix.m[2];
            this._resultTransp.m[9] = matrix.m[6];
            this._resultTransp.m[10] = matrix.m[10];
            this._resultTransp.m[11] = matrix.m[14];
            this._resultTransp.m[12] = matrix.m[3];
            this._resultTransp.m[13] = matrix.m[7];
            this._resultTransp.m[14] = matrix.m[11];
            this._resultTransp.m[15] = matrix.m[15];
            mathis.geo.copyMat(this._resultTransp, result);
        };
        Geo.prototype.multiplyMatMat = function (m1, other, result) {
            var tm0 = m1.m[0];
            var tm1 = m1.m[1];
            var tm2 = m1.m[2];
            var tm3 = m1.m[3];
            var tm4 = m1.m[4];
            var tm5 = m1.m[5];
            var tm6 = m1.m[6];
            var tm7 = m1.m[7];
            var tm8 = m1.m[8];
            var tm9 = m1.m[9];
            var tm10 = m1.m[10];
            var tm11 = m1.m[11];
            var tm12 = m1.m[12];
            var tm13 = m1.m[13];
            var tm14 = m1.m[14];
            var tm15 = m1.m[15];
            var om0 = other.m[0];
            var om1 = other.m[1];
            var om2 = other.m[2];
            var om3 = other.m[3];
            var om4 = other.m[4];
            var om5 = other.m[5];
            var om6 = other.m[6];
            var om7 = other.m[7];
            var om8 = other.m[8];
            var om9 = other.m[9];
            var om10 = other.m[10];
            var om11 = other.m[11];
            var om12 = other.m[12];
            var om13 = other.m[13];
            var om14 = other.m[14];
            var om15 = other.m[15];
            result.m[0] = tm0 * om0 + tm1 * om4 + tm2 * om8 + tm3 * om12;
            result.m[1] = tm0 * om1 + tm1 * om5 + tm2 * om9 + tm3 * om13;
            result.m[2] = tm0 * om2 + tm1 * om6 + tm2 * om10 + tm3 * om14;
            result.m[3] = tm0 * om3 + tm1 * om7 + tm2 * om11 + tm3 * om15;
            result.m[4] = tm4 * om0 + tm5 * om4 + tm6 * om8 + tm7 * om12;
            result.m[5] = tm4 * om1 + tm5 * om5 + tm6 * om9 + tm7 * om13;
            result.m[6] = tm4 * om2 + tm5 * om6 + tm6 * om10 + tm7 * om14;
            result.m[7] = tm4 * om3 + tm5 * om7 + tm6 * om11 + tm7 * om15;
            result.m[8] = tm8 * om0 + tm9 * om4 + tm10 * om8 + tm11 * om12;
            result.m[9] = tm8 * om1 + tm9 * om5 + tm10 * om9 + tm11 * om13;
            result.m[10] = tm8 * om2 + tm9 * om6 + tm10 * om10 + tm11 * om14;
            result.m[11] = tm8 * om3 + tm9 * om7 + tm10 * om11 + tm11 * om15;
            result.m[12] = tm12 * om0 + tm13 * om4 + tm14 * om8 + tm15 * om12;
            result.m[13] = tm12 * om1 + tm13 * om5 + tm14 * om9 + tm15 * om13;
            result.m[14] = tm12 * om2 + tm13 * om6 + tm14 * om10 + tm15 * om14;
            result.m[15] = tm12 * om3 + tm13 * om7 + tm14 * om11 + tm15 * om15;
        };
        Geo.prototype.baryCenter = function (xyzs, weights, result) {
            this.baryResult.x = 0;
            this.baryResult.y = 0;
            this.baryResult.z = 0;
            for (var i = 0; i < xyzs.length; i++) {
                mathis.geo.copyXYZ(xyzs[i], this._scaled);
                this.scale(this._scaled, weights[i], this._scaled);
                this.add(this.baryResult, this._scaled, this.baryResult);
            }
            mathis.geo.copyXYZ(this.baryResult, result);
        };
        Geo.prototype.between = function (v1, v2, alpha, res) {
            res.x = v1.x * (1 - alpha) + v2.x * alpha;
            res.y = v1.y * (1 - alpha) + v2.y * alpha;
            res.z = v1.z * (1 - alpha) + v2.z * alpha;
        };
        Geo.prototype.betweenUV = function (v1, v2, alpha, res) {
            res.u = v1.u * (1 - alpha) + v2.u * alpha;
            res.v = v1.v * (1 - alpha) + v2.v * alpha;
        };
        Geo.prototype.unproject = function (source, viewportWidth, viewportHeight, world, view, projection, result) {
            mathis.geo.copyXYZ(source, this._source);
            if (world != null) {
                this.multiplyMatMat(world, view, this._matUn);
                this.multiplyMatMat(this._matUn, projection, this._matUn);
            }
            else {
                this.multiplyMatMat(view, projection, this._matUn);
            }
            this.inverse(this._matUn, this._matUn);
            this._source.x = this._source.x / viewportWidth * 2 - 1;
            this._source.y = -(this._source.y / viewportHeight * 2 - 1);
            this.multiplicationMatrixVector(this._matUn, this._source, result);
            var num = source.x * this._matUn.m[3] + source.y * this._matUn.m[7] + source.z * this._matUn.m[11] + this._matUn.m[15];
            if (this.withinEpsilon(num, 1.0)) {
                this.scale(result, 1.0 / num, result);
            }
        };
        Geo.prototype.withinEpsilon = function (a, b) {
            var num = a - b;
            return -1.401298E-45 <= num && num <= 1.401298E-45;
        };
        Geo.prototype.axisAngleToMatrix = function (axis, angle, result) {
            var s = Math.sin(-angle);
            var c = Math.cos(-angle);
            var c1 = 1 - c;
            mathis.geo.copyXYZ(axis, this._axis);
            this.normalize(this._axis, this._axis);
            result.m[0] = (this._axis.x * this._axis.x) * c1 + c;
            result.m[1] = (this._axis.x * this._axis.y) * c1 - (this._axis.z * s);
            result.m[2] = (this._axis.x * this._axis.z) * c1 + (this._axis.y * s);
            result.m[3] = 0.0;
            result.m[4] = (this._axis.y * this._axis.x) * c1 + (this._axis.z * s);
            result.m[5] = (this._axis.y * this._axis.y) * c1 + c;
            result.m[6] = (this._axis.y * this._axis.z) * c1 - (this._axis.x * s);
            result.m[7] = 0.0;
            result.m[8] = (this._axis.z * this._axis.x) * c1 - (this._axis.y * s);
            result.m[9] = (this._axis.z * this._axis.y) * c1 + (this._axis.x * s);
            result.m[10] = (this._axis.z * this._axis.z) * c1 + c;
            result.m[11] = 0.0;
            result.m[12] = 0.0;
            result.m[13] = 0.0;
            result.m[14] = 0.0;
            result.m[15] = 1.0;
        };
        Geo.prototype.multiplicationMatrixVector = function (transformation, vector, result) {
            var x = (vector.x * transformation.m[0]) + (vector.y * transformation.m[4]) + (vector.z * transformation.m[8]) + transformation.m[12];
            var y = (vector.x * transformation.m[1]) + (vector.y * transformation.m[5]) + (vector.z * transformation.m[9]) + transformation.m[13];
            var z = (vector.x * transformation.m[2]) + (vector.y * transformation.m[6]) + (vector.z * transformation.m[10]) + transformation.m[14];
            var w = (vector.x * transformation.m[3]) + (vector.y * transformation.m[7]) + (vector.z * transformation.m[11]) + transformation.m[15];
            result.x = x / w;
            result.y = y / w;
            result.z = z / w;
        };
        Geo.prototype.axisAngleToQuaternion = function (axis, angle, result) {
            var sin = Math.sin(angle / 2);
            result.w = Math.cos(angle / 2);
            result.x = axis.x * sin;
            result.y = axis.y * sin;
            result.z = axis.z * sin;
        };
        Geo.prototype.matrixToQuaternion = function (m, result) {
            var m00, m01, m02, m10, m11, m12, m20, m21, m22;
            m00 = m.m[0];
            m10 = m.m[1];
            m20 = m.m[2];
            m01 = m.m[4];
            m11 = m.m[5];
            m21 = m.m[6];
            m02 = m.m[8];
            m12 = m.m[9];
            m22 = m.m[10];
            var qx, qy, qz, qw;
            var tr = m00 + m11 + m22;
            if (tr > 0) {
                var S = Math.sqrt(tr + 1.0) * 2;
                qw = 0.25 * S;
                qx = (m21 - m12) / S;
                qy = (m02 - m20) / S;
                qz = (m10 - m01) / S;
            }
            else if ((m00 > m11) && (m00 > m22)) {
                var S = Math.sqrt(1.0 + m00 - m11 - m22) * 2;
                qw = (m21 - m12) / S;
                qx = 0.25 * S;
                qy = (m01 + m10) / S;
                qz = (m02 + m20) / S;
            }
            else if (m11 > m22) {
                var S = Math.sqrt(1.0 + m11 - m00 - m22) * 2;
                qw = (m02 - m20) / S;
                qx = (m01 + m10) / S;
                qy = 0.25 * S;
                qz = (m12 + m21) / S;
            }
            else {
                var S = Math.sqrt(1.0 + m22 - m00 - m11) * 2;
                qw = (m10 - m01) / S;
                qx = (m02 + m20) / S;
                qy = (m12 + m21) / S;
                qz = 0.25 * S;
            }
            result.x = qx;
            result.y = qy;
            result.z = qz;
            result.w = qw;
        };
        Geo.prototype.twoVectorsToQuaternion = function (v1, v2, firstIsPreserved, result) {
            if (firstIsPreserved) {
                mathis.geo.orthonormalizeKeepingFirstDirection(v1, v2, this._ortBasisV1, this._ortBasisV2);
            }
            else {
                mathis.geo.orthonormalizeKeepingFirstDirection(v2, v1, this._ortBasisV2, this._ortBasisV1);
            }
            mathis.geo.cross(this._ortBasisV1, this._ortBasisV2, this._ortBasisV3);
            mathis.geo.matrixFromLines(this._ortBasisV1, this._ortBasisV2, this._ortBasisV3, this._ortBasisAll);
            mathis.geo.matrixToQuaternion(this._ortBasisAll, result);
        };
        Geo.prototype.orthogonalProjectionOnLine = function (direction, result) {
            this.normalize(direction, this._basisOrtho0);
            this.getOneOrthonormal(direction, this._basisOrtho1);
            this.cross(this._basisOrtho0, this._basisOrtho1, this._basisOrtho2);
            this.matrixFromLines(this._basisOrtho0, this._basisOrtho1, this._basisOrtho2, this._basisMatrix);
            this.transpose(this._basisMatrix, this._transposedBasisMatrix);
            this._diagoMatrix.m[0] = 1;
            this._diagoMatrix.m[15] = 1;
            this.multiplyMatMat(this._transposedBasisMatrix, this._diagoMatrix, result);
            this.multiplyMatMat(result, this._basisMatrix, result);
        };
        Geo.prototype.orthogonalProjectionOnPlane = function (direction, otherDirection, result) {
            this.orthonormalizeKeepingFirstDirection(direction, otherDirection, this._basisOrtho0, this._basisOrtho1);
            this.cross(this._basisOrtho0, this._basisOrtho1, this._basisOrtho2);
            this.matrixFromLines(this._basisOrtho0, this._basisOrtho1, this._basisOrtho2, this._basisMatrix);
            this.transpose(this._basisMatrix, this._transposedBasisMatrix);
            this._diagoMatrix.m[0] = 1;
            this._diagoMatrix.m[5] = 1;
            this._diagoMatrix.m[15] = 1;
            this.multiplyMatMat(this._transposedBasisMatrix, this._diagoMatrix, result);
            this.multiplyMatMat(result, this._basisMatrix, result);
        };
        Geo.prototype.translationOnMatrix = function (vector3, result) {
            result.m[12] = vector3.x;
            result.m[13] = vector3.y;
            result.m[14] = vector3.z;
        };
        Geo.prototype.quaternionToMatrix = function (quaternion, result) {
            var xx = quaternion.x * quaternion.x;
            var yy = quaternion.y * quaternion.y;
            var zz = quaternion.z * quaternion.z;
            var xy = quaternion.x * quaternion.y;
            var zw = quaternion.z * quaternion.w;
            var zx = quaternion.z * quaternion.x;
            var yw = quaternion.y * quaternion.w;
            var yz = quaternion.y * quaternion.z;
            var xw = quaternion.x * quaternion.w;
            result.m[0] = 1.0 - (2.0 * (yy + zz));
            result.m[1] = 2.0 * (xy + zw);
            result.m[2] = 2.0 * (zx - yw);
            result.m[3] = 0;
            result.m[4] = 2.0 * (xy - zw);
            result.m[5] = 1.0 - (2.0 * (zz + xx));
            result.m[6] = 2.0 * (yz + xw);
            result.m[7] = 0;
            result.m[8] = 2.0 * (zx + yw);
            result.m[9] = 2.0 * (yz - xw);
            result.m[10] = 1.0 - (2.0 * (yy + xx));
            result.m[11] = 0;
            result.m[12] = 0;
            result.m[13] = 0;
            result.m[14] = 0;
            result.m[15] = 1.0;
        };
        Geo.prototype.quaternionMultiplication = function (q0, q1, result) {
            var x = q0.x * q1.w + q0.y * q1.z - q0.z * q1.y + q0.w * q1.x;
            var y = -q0.x * q1.z + q0.y * q1.w + q0.z * q1.x + q0.w * q1.y;
            var z = q0.x * q1.y - q0.y * q1.x + q0.z * q1.w + q0.w * q1.z;
            var w = -q0.x * q1.x - q0.y * q1.y - q0.z * q1.z + q0.w * q1.w;
            result.x = x;
            result.y = y;
            result.z = z;
            result.w = w;
        };
        Geo.prototype.anOrthogonalMatrixMovingABtoCD = function (a, b, c, d, result, argsAreOrthonormal) {
            if (argsAreOrthonormal === void 0) { argsAreOrthonormal = false; }
            if (argsAreOrthonormal) {
                this.copA.copyFrom(a);
                this.copB.copyFrom(b);
                this.copC.copyFrom(c);
                this.copD.copyFrom(d);
            }
            else {
                this.orthonormalizeKeepingFirstDirection(a, b, this.copA, this.copB);
                this.orthonormalizeKeepingFirstDirection(c, d, this.copC, this.copD);
            }
            this.cross(this.copA, this.copB, this.oor1);
            this.matrixFromLines(this.copA, this.copB, this.oor1, this.matt1);
            this.cross(this.copC, this.copD, this.oor2);
            this.matrixFromLines(this.copC, this.copD, this.oor2, this.matt2);
            this.transpose(this.matt1, this.matt1);
            this.multiplyMatMat(this.matt1, this.matt2, result);
        };
        Geo.prototype.aQuaternionMovingABtoCD = function (a, b, c, d, result, argsAreOrthonormal) {
            if (argsAreOrthonormal === void 0) { argsAreOrthonormal = false; }
            this.anOrthogonalMatrixMovingABtoCD(a, b, c, d, this.matBefore, argsAreOrthonormal);
            this.matrixToQuaternion(this.matBefore, result);
        };
        Geo.prototype.slerp = function (left, right, amount, result) {
            var num2;
            var num3;
            var num = amount;
            var num4 = (((left.x * right.x) + (left.y * right.y)) + (left.z * right.z)) + (left.w * right.w);
            var flag = false;
            if (num4 < 0) {
                flag = true;
                num4 = -num4;
            }
            if (num4 > 0.999999) {
                num3 = 1 - num;
                num2 = flag ? -num : num;
            }
            else {
                var num5 = Math.acos(num4);
                var num6 = (1.0 / Math.sin(num5));
                num3 = (Math.sin((1.0 - num) * num5)) * num6;
                num2 = flag ? ((-Math.sin(num * num5)) * num6) : ((Math.sin(num * num5)) * num6);
            }
            result.x = (num3 * left.x) + (num2 * right.x);
            result.y = (num3 * left.y) + (num2 * right.y);
            result.z = (num3 * left.z) + (num2 * right.z);
            result.w = (num3 * left.w) + (num2 * right.w);
        };
        Geo.prototype.matrixFromLines = function (line1, line2, line3, result) {
            result.m[0] = line1.x;
            result.m[1] = line1.y;
            result.m[2] = line1.z;
            result.m[3] = 0;
            result.m[4] = line2.x;
            result.m[5] = line2.y;
            result.m[6] = line2.z;
            result.m[7] = 0;
            result.m[8] = line3.x;
            result.m[9] = line3.y;
            result.m[10] = line3.z;
            result.m[11] = 0;
            result.m[12] = 0;
            result.m[13] = 0;
            result.m[14] = 0;
            result.m[15] = 1.0;
        };
        Geo.prototype.angleBetweenTwoVectorsBetween0andPi = function (v1, v2) {
            if (mathis.geo.xyzAlmostZero(v1) || mathis.geo.xyzAlmostZero(v2)) {
                throw 'be aware: you compute angle between two vectors, one of them being almost zero';
            }
            this.normalize(v1, this.v1nor);
            this.normalize(v2, this.v2nor);
            var dotProduct = this.dot(this.v1nor, this.v2nor);
            if (dotProduct > 1)
                return 0;
            if (dotProduct < -1)
                return Math.PI;
            else
                return Math.acos(dotProduct);
        };
        Geo.prototype.almostParallel = function (v1, v2, oppositeAreParallel, toleranceAngle) {
            if (oppositeAreParallel === void 0) { oppositeAreParallel = true; }
            if (toleranceAngle === void 0) { toleranceAngle = 0.001; }
            var angle = this.angleBetweenTwoVectorsBetween0andPi(v1, v2);
            if (angle < toleranceAngle)
                return true;
            if (oppositeAreParallel && Math.PI - angle < toleranceAngle)
                return true;
            return false;
        };
        Geo.prototype.angleBetweenTwoVectorsBetweenMinusPiAndPi = function (v1, v2, upDirection) {
            var angle = this.angleBetweenTwoVectorsBetween0andPi(v1, v2);
            mathis.geo.cross(v1, v2, this._aCros);
            var sign = (mathis.geo.dot(upDirection, this._aCros) < 0) ? -1 : 1;
            return sign * angle;
        };
        Geo.prototype.slerpTwoOrthogonalVectors = function (a0, b0, a1, b1, alpha, aAlpha, bAlpha) {
            this.cross(a0, b0, this._c0);
            this.cross(a1, b1, this._c1);
            this.matrixFromLines(a0, b0, this._c0, this._mat0);
            this.matrixFromLines(a1, b1, this._c1, this._mat1);
            this.matrixToQuaternion(this._mat0, this._quat0);
            this.matrixToQuaternion(this._mat1, this._quat1);
            this.slerp(this._quat0, this._quat1, alpha, this._quatAlpha);
            this.quaternionToMatrix(this._quatAlpha, this._matAlpha);
            mathis.geo.copyXyzFromFloat(this._matAlpha.m[0], this._matAlpha.m[1], this._matAlpha.m[2], aAlpha);
            mathis.geo.copyXyzFromFloat(this._matAlpha.m[4], this._matAlpha.m[5], this._matAlpha.m[7], bAlpha);
        };
        Geo.prototype.interpolateTwoVectors = function (a0, a1, alpha, aAlpha) {
            aAlpha.x = a0.x * (1 - alpha) + a1.x * alpha;
            aAlpha.y = a0.y * (1 - alpha) + a1.y * alpha;
            aAlpha.z = a0.z * (1 - alpha) + a1.z * alpha;
        };
        Geo.prototype.scale = function (vec, scalar, result) {
            result.x = vec.x * scalar;
            result.y = vec.y * scalar;
            result.z = vec.z * scalar;
        };
        Geo.prototype.add = function (v1, v2, result) {
            result.x = v1.x + v2.x;
            result.y = v1.y + v2.y;
            result.z = v1.z + v2.z;
        };
        Geo.prototype.substract = function (v1, v2, result) {
            result.x = v1.x - v2.x;
            result.y = v1.y - v2.y;
            result.z = v1.z - v2.z;
        };
        Geo.prototype.dot = function (left, right) {
            return (left.x * right.x + left.y * right.y + left.z * right.z);
        };
        Geo.prototype.norme = function (vec) {
            return Math.sqrt(vec.x * vec.x + vec.y * vec.y + vec.z * vec.z);
        };
        Geo.prototype.squareNorme = function (vec) {
            return vec.x * vec.x + vec.y * vec.y + vec.z * vec.z;
        };
        Geo.prototype.cross = function (left, right, result) {
            this._crossResult.x = left.y * right.z - left.z * right.y;
            this._crossResult.y = left.z * right.x - left.x * right.z;
            this._crossResult.z = left.x * right.y - left.y * right.x;
            mathis.geo.copyXYZ(this._crossResult, result);
        };
        Geo.prototype.orthonormalizeKeepingFirstDirection = function (v1, v2, result1, result2) {
            this.normalize(v1, this._result1);
            mathis.geo.copyXYZ(v1, this.v1forSubstraction);
            this.scale(this.v1forSubstraction, this.dot(v1, v2), this.v1forSubstraction);
            this.substract(v2, this.v1forSubstraction, this._result2);
            if (this.squareNorme(this._result2) < mathis.geo.epsilon * mathis.geo.epsilon) {
                mathis.geo.copyXyzFromFloat(Math.random(), Math.random(), Math.random(), this.randV2);
                mathis.logger.c("beware: you try to orthonormalize two co-linear vectors");
                return this.orthonormalizeKeepingFirstDirection(v1, this.randV2, result1, result2);
            }
            this.normalize(this._result2, this._result2);
            mathis.geo.copyXYZ(this._result1, result1);
            mathis.geo.copyXYZ(this._result2, result2);
        };
        Geo.prototype.getOneOrthonormal = function (vec, result) {
            if (Math.abs(vec.x) + Math.abs(vec.y) > 0.0001)
                result.copyFromFloats(-vec.y, vec.x, 0);
            else
                result.copyFromFloats(0, -vec.z, vec.y);
            mathis.geo.normalize(result, result);
        };
        Geo.prototype.normalize = function (vec, result) {
            var norme = this.norme(vec);
            if (norme < mathis.geo.epsilon)
                throw "one can not normalize a the almost zero vector:" + vec;
            this.scale(vec, 1 / norme, result);
        };
        Geo.prototype.intersectionBetweenRayAndSphereFromRef = function (rayOrigine, rayDirection, aRadius, sphereCenter, result1, result2) {
            mathis.geo.copyXYZ(rayOrigine, this.spheCentToRayOri);
            this.substract(this.spheCentToRayOri, sphereCenter, this.spheCentToRayOri);
            var a = this.squareNorme(rayDirection);
            var b = 2 * this.dot(rayDirection, this.spheCentToRayOri);
            var c = this.squareNorme(this.spheCentToRayOri) - aRadius * aRadius;
            var discriminant = b * b - 4 * a * c;
            if (discriminant < 0) {
                return false;
            }
            else {
                var t1 = (-b + Math.sqrt(discriminant)) / 2 / a;
                var t2 = (-b - Math.sqrt(discriminant)) / 2 / a;
                mathis.geo.copyXYZ(rayDirection, this._resultInters);
                this.scale(this._resultInters, t1, this._resultInters);
                this.add(this._resultInters, rayOrigine, this._resultInters);
                mathis.geo.copyXYZ(this._resultInters, result1);
                mathis.geo.copyXYZ(rayDirection, this._resultInters);
                this.scale(this._resultInters, t2, this._resultInters);
                this.add(this._resultInters, rayOrigine, this._resultInters);
                mathis.geo.copyXYZ(this._resultInters, result2);
                return true;
            }
        };
        Geo.prototype.distance = function (vect1, vect2) {
            this.copyXYZ(vect1, this.difference);
            this.substract(this.difference, vect2, this.difference);
            return this.norme(this.difference);
        };
        Geo.prototype.squaredDistance = function (vect1, vect2) {
            this.copyXYZ(vect1, this.difference);
            this.substract(this.difference, vect2, this.difference);
            return this.squareNorme(this.difference);
        };
        Geo.prototype.closerOf = function (candidat1, canditat2, reference, result) {
            var l1 = this.distance(candidat1, reference);
            var l2 = this.distance(canditat2, reference);
            if (l1 < l2)
                this.copyXYZ(candidat1, result);
            else
                this.copyXYZ(canditat2, result);
            return (l1 < l2) ? l1 : l2;
        };
        Geo.prototype.LookAtLH = function (eye, target, up, result) {
            this.substract(target, eye, this._zAxis);
            this.normalize(this._zAxis, this._zAxis);
            this.cross(up, this._zAxis, this._xAxis);
            if (mathis.geo.xyzAlmostZero(this._xAxis)) {
                this._xAxis.x = 1.0;
            }
            else {
                this._xAxis.normalize();
            }
            this.cross(this._zAxis, this._xAxis, this._yAxis);
            this._yAxis.normalize();
            var ex = -this.dot(this._xAxis, eye);
            var ey = -this.dot(this._yAxis, eye);
            var ez = -this.dot(this._zAxis, eye);
            this.numbersToMM(this._xAxis.x, this._yAxis.x, this._zAxis.x, 0, this._xAxis.y, this._yAxis.y, this._zAxis.y, 0, this._xAxis.z, this._yAxis.z, this._zAxis.z, 0, ex, ey, ez, 1, result);
        };
        Geo.prototype.OrthoOffCenterLH = function (left, right, bottom, top, znear, zfar, result) {
            result.m[0] = 2.0 / (right - left);
            result.m[1] = result.m[2] = result.m[3] = 0;
            result.m[5] = 2.0 / (top - bottom);
            result.m[4] = result.m[6] = result.m[7] = 0;
            result.m[10] = -1.0 / (znear - zfar);
            result.m[8] = result.m[9] = result.m[11] = 0;
            result.m[12] = (left + right) / (left - right);
            result.m[13] = (top + bottom) / (bottom - top);
            result.m[14] = znear / (znear - zfar);
            result.m[15] = 1.0;
        };
        Geo.prototype.PerspectiveFovLH = function (fov, aspect, znear, zfar, result) {
            var tan = 1.0 / (Math.tan(fov * 0.5));
            var v_fixed = true;
            if (v_fixed) {
                result.m[0] = tan / aspect;
            }
            else {
                result.m[0] = tan;
            }
            result.m[1] = result.m[2] = result.m[3] = 0.0;
            if (v_fixed) {
                result.m[5] = tan;
            }
            else {
                result.m[5] = tan * aspect;
            }
            result.m[4] = result.m[6] = result.m[7] = 0.0;
            result.m[8] = result.m[9] = 0.0;
            result.m[10] = -zfar / (znear - zfar);
            result.m[11] = 1.0;
            result.m[12] = result.m[13] = result.m[15] = 0.0;
            result.m[14] = (znear * zfar) / (znear - zfar);
        };
        Geo.prototype.numbersToMM = function (a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, res) {
            res.m[0] = a0;
            res.m[1] = a1;
            res.m[2] = a2;
            res.m[3] = a3;
            res.m[4] = a4;
            res.m[5] = a5;
            res.m[6] = a6;
            res.m[7] = a7;
            res.m[8] = a8;
            res.m[9] = a9;
            res.m[10] = a10;
            res.m[11] = a11;
            res.m[12] = a12;
            res.m[13] = a13;
            res.m[14] = a14;
            res.m[15] = a15;
        };
        Geo.prototype.newHermite = function (value1, tangent1, value2, tangent2, amount) {
            var squared = amount * amount;
            var cubed = amount * squared;
            var part1 = ((2.0 * cubed) - (3.0 * squared)) + 1.0;
            var part2 = (-2.0 * cubed) + (3.0 * squared);
            var part3 = (cubed - (2.0 * squared)) + amount;
            var part4 = cubed - squared;
            var x = (((value1.x * part1) + (value2.x * part2)) + (tangent1.x * part3)) + (tangent2.x * part4);
            var y = (((value1.y * part1) + (value2.y * part2)) + (tangent1.y * part3)) + (tangent2.y * part4);
            var z = (((value1.z * part1) + (value2.z * part2)) + (tangent1.z * part3)) + (tangent2.z * part4);
            return new mathis.XYZ(x, y, z);
        };
        Geo.prototype.hermiteSpline = function (p1, t1, p2, t2, nbPoints, result) {
            mathis.tab.clearArray(result);
            var step = 1 / nbPoints;
            for (var i = 0; i < nbPoints; i++) {
                result.push(this.newHermite(p1, t1, p2, t2, i * step));
            }
        };
        Geo.prototype.quadraticBezier = function (v0, v1, v2, nbPoints, result) {
            mathis.tab.clearArray(result);
            nbPoints = nbPoints > 2 ? nbPoints : 3;
            var equation = function (t, val0, val1, val2) {
                var res = (1 - t) * (1 - t) * val0 + 2 * t * (1 - t) * val1 + t * t * val2;
                return res;
            };
            for (var i = 0; i < nbPoints; i++) {
                result.push(new mathis.XYZ(equation(i / nbPoints, v0.x, v1.x, v2.x), equation(i / nbPoints, v0.y, v1.y, v2.y), equation(i / nbPoints, v0.z, v1.z, v2.z)));
            }
        };
        Geo.prototype.cubicBezier = function (v0, v1, v2, v3, nbPoints, result) {
            mathis.tab.clearArray(result);
            nbPoints = nbPoints > 3 ? nbPoints : 4;
            var equation = function (t, val0, val1, val2, val3) {
                var res = (1 - t) * (1 - t) * (1 - t) * val0 + 3 * t * (1 - t) * (1 - t) * val1 + 3 * t * t * (1 - t) * val2 + t * t * t * val3;
                return res;
            };
            for (var i = 0; i < nbPoints; i++) {
                result.push(new mathis.XYZ(equation(i / nbPoints, v0.x, v1.x, v2.x, v3.x), equation(i / nbPoints, v0.y, v1.y, v2.y, v3.y), equation(i / nbPoints, v0.z, v1.z, v2.z, v3.z)));
            }
        };
        Geo.prototype.affineTransformGenerator = function (originIN, endIN, originOUT, endOUT) {
            var amplitudeIN = mathis.XYZ.newFrom(endIN).substract(originIN);
            var amplitudeOUT = mathis.XYZ.newFrom(endOUT).substract(originOUT);
            if (amplitudeIN.x == 0 && amplitudeOUT.x != 0)
                throw "impossible affine transform from a rectangle to a pavé";
            if (amplitudeIN.y == 0 && amplitudeOUT.y != 0)
                throw "impossible affine transform from a rectangle to a pavé";
            if (amplitudeIN.z == 0 && amplitudeOUT.z != 0)
                throw "impossible affine transform from a rectangle to a pavé";
            var nb0 = 0;
            if (amplitudeIN.x == 0)
                nb0++;
            if (amplitudeIN.y == 0)
                nb0++;
            if (amplitudeIN.z == 0)
                nb0++;
            if (nb0 >= 2)
                throw "intrance pavé is too degenerated";
            var amplitudeINinv = new mathis.XYZ((amplitudeIN.x == 0) ? 1 : 1 / amplitudeIN.x, (amplitudeIN.y == 0) ? 1 : 1 / amplitudeIN.y, (amplitudeIN.z == 0) ? 1 : 1 / amplitudeIN.z);
            var res = function (vecIn, vecOut) {
                vecOut.copyFrom(vecIn).substract(originIN).multiply(amplitudeINinv).multiply(amplitudeOUT).add(originOUT);
            };
            return res;
        };
        return Geo;
    }());
    mathis.Geo = Geo;
    var geometry;
    (function (geometry) {
        var CloseXYZfinder = (function () {
            function CloseXYZfinder(recepteurList, sourceList, nbDistinctPoint) {
                this.nbDistinctPoint = 1000;
                this.maxDistToBeClose = null;
                this.deformationFunction = function (point) { return point; };
                this.mins = new mathis.XYZ(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
                this.maxs = new mathis.XYZ(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
                this.nbDistinctPoint = nbDistinctPoint;
                this.recepteurList = recepteurList;
                if (sourceList == null || recepteurList == sourceList) {
                    this.sourceList = recepteurList;
                    this.sourceEqualRecepter = true;
                }
                else {
                    this.sourceList = sourceList;
                    this.sourceEqualRecepter = false;
                }
            }
            CloseXYZfinder.prototype.go = function () {
                this.buildScaler();
                var amplitude = new mathis.XYZ(Math.max(1, this.maxs.x - this.mins.x), Math.max(1, this.maxs.y - this.mins.y), Math.max(1, this.maxs.z - this.mins.z));
                var recepteurBalises = {};
                for (var i = 0; i < this.recepteurList.length; i++) {
                    var val = this.deformationFunction(this.recepteurList[i]);
                    var resx = Math.round((val.x - this.mins.x) / amplitude.x * this.nbDistinctPoint);
                    var resy = Math.round((val.y - this.mins.y) / amplitude.y * this.nbDistinctPoint);
                    var resz = Math.round((val.z - this.mins.z) / amplitude.z * this.nbDistinctPoint);
                    var key = resx + ',' + resy + ',' + resz;
                    if (recepteurBalises[key] == null)
                        recepteurBalises[key] = i;
                    else if (!this.sourceEqualRecepter)
                        mathis.logger.c('strange: the recepterList has several XYZ very close. This is, in general, only possible, when recepter equal source');
                }
                var res = {};
                for (var i = 0; i < this.sourceList.length; i++) {
                    var val = this.deformationFunction(this.sourceList[i]);
                    var resx = Math.round((val.x - this.mins.x) / amplitude.x * this.nbDistinctPoint);
                    var resy = Math.round((val.y - this.mins.y) / amplitude.y * this.nbDistinctPoint);
                    var resz = Math.round((val.z - this.mins.z) / amplitude.z * this.nbDistinctPoint);
                    var baliseIndex = recepteurBalises[resx + ',' + resy + ',' + resz];
                    if (baliseIndex != null) {
                        if (this.sourceEqualRecepter) {
                            if (baliseIndex != i)
                                res[i] = baliseIndex;
                        }
                        else
                            res[i] = baliseIndex;
                    }
                }
                return res;
            };
            CloseXYZfinder.prototype.buildScaler = function () {
                var _this = this;
                this.recepteurList.forEach(function (vv) {
                    var v = _this.deformationFunction(vv);
                    if (v.x < _this.mins.x)
                        _this.mins.x = v.x;
                    if (v.y < _this.mins.y)
                        _this.mins.y = v.y;
                    if (v.z < _this.mins.z)
                        _this.mins.z = v.z;
                    if (v.x > _this.maxs.x)
                        _this.maxs.x = v.x;
                    if (v.y > _this.maxs.y)
                        _this.maxs.y = v.y;
                    if (v.z > _this.maxs.z)
                        _this.maxs.z = v.z;
                });
                if (!this.sourceEqualRecepter) {
                    this.sourceList.forEach(function (vv) {
                        var v = _this.deformationFunction(vv);
                        if (v.x < _this.mins.x)
                            _this.mins.x = v.x;
                        if (v.y < _this.mins.y)
                            _this.mins.y = v.y;
                        if (v.z < _this.mins.z)
                            _this.mins.z = v.z;
                        if (v.x > _this.maxs.x)
                            _this.maxs.x = v.x;
                        if (v.y > _this.maxs.y)
                            _this.maxs.y = v.y;
                        if (v.z > _this.maxs.z)
                            _this.maxs.z = v.z;
                    });
                }
                if (this.maxDistToBeClose != null) {
                    this.nbDistinctPoint = mathis.geo.distance(this.maxs, this.mins) / this.maxDistToBeClose;
                }
            };
            return CloseXYZfinder;
        }());
        geometry.CloseXYZfinder = CloseXYZfinder;
        var LineInterpoler = (function () {
            function LineInterpoler(points) {
                this.options = new InterpolationOption();
                this.hermite = new Array();
                this.points = points;
            }
            LineInterpoler.prototype.checkArgs = function () {
                if (this.points == null || this.points.length < 2)
                    throw 'too few points';
            };
            LineInterpoler.prototype.go = function () {
                var _this = this;
                var smoothLine = new Array();
                if (this.points.length == 2) {
                    smoothLine = [];
                    for (var i = 0; i < this.options.nbSubdivisions + 1; i++) {
                        var intermediatePoint = new mathis.XYZ(0, 0, 0);
                        mathis.geo.between(this.points[0], this.points[1], i / this.options.nbSubdivisions, intermediatePoint);
                        smoothLine.push(intermediatePoint);
                    }
                    if (this.options.loopLine)
                        smoothLine.push(mathis.XYZ.newFrom(this.points[0]));
                }
                else if (this.options.interpolationStyle == InterpolationStyle.none) {
                    smoothLine = [];
                    this.points.forEach(function (p) { return smoothLine.push(mathis.XYZ.newFrom(p)); });
                    if (this.options.loopLine)
                        smoothLine.push(mathis.XYZ.newFrom(this.points[0]));
                }
                else if (this.options.interpolationStyle == InterpolationStyle.hermite) {
                    var tani_1 = mathis.XYZ.newZero();
                    var tanii_1 = mathis.XYZ.newZero();
                    var oneStep = function (point0, point1, point2, point3) {
                        mathis.geo.substract(point1, point0, tani_1);
                        mathis.geo.substract(point3, point2, tanii_1);
                        tani_1.scale(_this.options.ratioTan);
                        tanii_1.scale(_this.options.ratioTan);
                        mathis.geo.hermiteSpline(point1, tani_1, point2, tanii_1, _this.options.nbSubdivisions, _this.hermite);
                        _this.hermite.forEach(function (v) { smoothLine.push(v); });
                    };
                    var last = this.points.length - 1;
                    if (!this.options.loopLine)
                        oneStep(this.points[0], this.points[0], this.points[1], this.points[2]);
                    else {
                        oneStep(this.points[last], this.points[0], this.points[1], this.points[2]);
                    }
                    for (var i = 1; i < this.points.length - 2; i++) {
                        oneStep(this.points[i - 1], this.points[i], this.points[i + 1], this.points[i + 2]);
                    }
                    if (!this.options.loopLine) {
                        oneStep(this.points[last - 2], this.points[last - 1], this.points[last], this.points[last]);
                        smoothLine.push(this.points[last]);
                    }
                    else {
                        oneStep(this.points[last - 2], this.points[last - 1], this.points[last], this.points[0]);
                        oneStep(this.points[last - 1], this.points[last], this.points[0], this.points[1]);
                        smoothLine.push(this.points[0]);
                    }
                }
                else if (this.options.interpolationStyle == InterpolationStyle.octavioStyle) {
                    if (this.points.length == 2)
                        return [mathis.XYZ.newFrom(this.points[0]), mathis.XYZ.newFrom(this.points[1])];
                    var last = this.points.length - 1;
                    var middle0_1 = mathis.XYZ.newZero();
                    var middle1_1 = mathis.XYZ.newZero();
                    var oneStep = function (point0, point1, point2) {
                        mathis.geo.between(point0, point1, 0.5, middle0_1);
                        mathis.geo.between(point1, point2, 0.5, middle1_1);
                        mathis.geo.quadraticBezier(middle0_1, point1, middle1_1, _this.options.nbSubdivisions, _this.hermite);
                        _this.hermite.forEach(function (v) { smoothLine.push(v); });
                    };
                    if (!this.options.loopLine) {
                        var begin = mathis.XYZ.newFrom(this.points[0]);
                        smoothLine.push(begin);
                    }
                    else {
                        oneStep(this.points[last], this.points[0], this.points[1]);
                    }
                    for (var i = 1; i < this.points.length - 1; i++) {
                        oneStep(this.points[i - 1], this.points[i], this.points[i + 1]);
                    }
                    if (!this.options.loopLine) {
                        var end = mathis.XYZ.newFrom(this.points[last]);
                        smoothLine.push(end);
                    }
                    else {
                        oneStep(this.points[last - 1], this.points[last], this.points[0]);
                        var latest = mathis.XYZ.newZero();
                        mathis.geo.between(this.points[last], this.points[0], 0.5, latest);
                        smoothLine.push(latest);
                    }
                }
                else
                    throw 'line interporler style unknown';
                return smoothLine;
            };
            return LineInterpoler;
        }());
        geometry.LineInterpoler = LineInterpoler;
        (function (InterpolationStyle) {
            InterpolationStyle[InterpolationStyle["hermite"] = 0] = "hermite";
            InterpolationStyle[InterpolationStyle["octavioStyle"] = 1] = "octavioStyle";
            InterpolationStyle[InterpolationStyle["none"] = 2] = "none";
        })(geometry.InterpolationStyle || (geometry.InterpolationStyle = {}));
        var InterpolationStyle = geometry.InterpolationStyle;
        var InterpolationOption = (function () {
            function InterpolationOption() {
                this.loopLine = false;
                this.interpolationStyle = InterpolationStyle.octavioStyle;
                this.nbSubdivisions = 10;
                this.ratioTan = 0.5;
            }
            return InterpolationOption;
        }());
        geometry.InterpolationOption = InterpolationOption;
    })(geometry = mathis.geometry || (mathis.geometry = {}));
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    var TwoInt = (function () {
        function TwoInt(c, d) {
            this.a = (c < d) ? c : d;
            this.b = (c < d) ? d : c;
        }
        return TwoInt;
    }());
    var graph;
    (function (graph) {
        function getGroup(startingGroup, admissibleForGroup) {
            var group = [];
            var newEdge = [];
            var newEdgeSelected = startingGroup;
            var alreadySeen = new mathis.HashMap();
            for (var _i = 0, startingGroup_1 = startingGroup; _i < startingGroup_1.length; _i++) {
                var vertex = startingGroup_1[_i];
                group.push(vertex);
                alreadySeen.putValue(vertex, true);
            }
            while (newEdgeSelected.length > 0) {
                newEdge = getEdge(newEdgeSelected);
                newEdgeSelected = [];
                for (var _a = 0, newEdge_1 = newEdge; _a < newEdge_1.length; _a++) {
                    var vertex = newEdge_1[_a];
                    if (!alreadySeen.getValue(vertex)) {
                        if (admissibleForGroup == null || admissibleForGroup.getValue(vertex)) {
                            newEdgeSelected.push(vertex);
                            group.push(vertex);
                        }
                        alreadySeen.putValue(vertex, true);
                    }
                }
            }
            return group;
        }
        graph.getGroup = getGroup;
        var DistancesFromAGroup = (function () {
            function DistancesFromAGroup(centralCells) {
                this.OUT_distances_dico = new mathis.HashMap();
                this.centralCells = centralCells;
            }
            DistancesFromAGroup.prototype.OUT_distance = function (vertex) {
                return this.OUT_distances_dico.getValue(vertex);
            };
            DistancesFromAGroup.prototype.OUT_allGeodesics = function (vertex, onlyOne) {
                if (onlyOne === void 0) { onlyOne = false; }
                var res = [];
                var edge = [vertex];
                var nonAdmissible = new mathis.HashMap();
                var d = this.OUT_distances_dico.getValue(vertex);
                while (edge.length > 0) {
                    res.push(edge);
                    d--;
                    edge = getEdge(edge, nonAdmissible);
                    var selectedEdge = [];
                    for (var _i = 0, edge_1 = edge; _i < edge_1.length; _i++) {
                        var v = edge_1[_i];
                        if (this.OUT_distances_dico.getValue(v) == d) {
                            selectedEdge.push(v);
                            if (onlyOne)
                                break;
                        }
                    }
                    edge = selectedEdge;
                }
                return res;
            };
            DistancesFromAGroup.prototype.go = function () {
                var nonAdmissible = new mathis.HashMap();
                if (this.centralCells == null || this.centralCells.length == 0)
                    throw 'problème d argument';
                this.OUT_stratesAround = [];
                this.OUT_stratesAround.push(this.centralCells);
                var edge = getEdge(this.centralCells, nonAdmissible);
                while (edge.length > 0) {
                    this.OUT_stratesAround.push(edge);
                    edge = getEdge(edge, nonAdmissible);
                }
                for (var i = 0; i < this.OUT_stratesAround.length; i++) {
                    for (var _i = 0, _a = this.OUT_stratesAround[i]; _i < _a.length; _i++) {
                        var v = _a[_i];
                        this.OUT_distances_dico.putValue(v, i);
                    }
                }
            };
            return DistancesFromAGroup;
        }());
        graph.DistancesFromAGroup = DistancesFromAGroup;
        var HeuristicDiameter = (function () {
            function HeuristicDiameter(vertices) {
                this.vertices = vertices;
                this.nbTimeOfNonEvolutionToStop = 2;
                this.lookNonEvolutionWithDistanceVersusWithGroups = true;
                this.consecutiveExtremetDistances = [];
                this.OUT_nbIteration = 0;
                this.OUT_twoChosenExtremeVertices = [];
            }
            HeuristicDiameter.prototype.go = function () {
                var extremeGroup = [this.vertices[0]];
                var d = 0;
                var extremeVertices = [];
                var distanceAround;
                while (this.evolution()) {
                    this.OUT_nbIteration++;
                    distanceAround = new DistancesFromAGroup(extremeGroup);
                    distanceAround.go();
                    d = distanceAround.OUT_stratesAround.length;
                    var oneExtreme = distanceAround.OUT_stratesAround[d - 1][0];
                    extremeGroup = [oneExtreme];
                    this.consecutiveExtremetDistances.push(d);
                    extremeVertices.push(oneExtreme);
                }
                this.OUT_twoChosenExtremeVertices = [extremeVertices[this.OUT_nbIteration - 1], extremeVertices[this.OUT_nbIteration - 2]];
                this.OUT_geodesicsBetweenChosenExtremeVertices = distanceAround.OUT_allGeodesics(extremeVertices[this.OUT_nbIteration - 1]);
                this.OUT_oneGeodesicBetweenChosenExtremeVertices = distanceAround.OUT_allGeodesics(extremeVertices[this.OUT_nbIteration - 1], true);
                return d - 1;
            };
            HeuristicDiameter.prototype.evolution = function () {
                if (this.lookNonEvolutionWithDistanceVersusWithGroups) {
                    var len = this.consecutiveExtremetDistances.length;
                    if (len < this.nbTimeOfNonEvolutionToStop)
                        return true;
                    var lastD = this.consecutiveExtremetDistances[len - 1];
                    for (var i = 1; i < this.nbTimeOfNonEvolutionToStop; i++) {
                        if (this.consecutiveExtremetDistances[len - 1 - i] != lastD)
                            return true;
                    }
                    return false;
                }
                else
                    throw "TODO";
            };
            return HeuristicDiameter;
        }());
        graph.HeuristicDiameter = HeuristicDiameter;
        var DistancesBetweenAllVertices = (function () {
            function DistancesBetweenAllVertices(allVertices) {
                this.OUT_allExtremeVertex = [];
                this.allCounters = new mathis.HashMap();
                this.allToTransmit = new mathis.HashMap();
                this.OUT_diameter = null;
                this.allVertices = allVertices;
            }
            DistancesBetweenAllVertices.prototype.OUT_distance = function (vertex0, vertex1) {
                return this.allCounters.getValue(vertex0).getValue(vertex1);
            };
            DistancesBetweenAllVertices.prototype.OUT_allGeodesics = function (vertex0, vertex1, onlyOne) {
                if (onlyOne === void 0) { onlyOne = false; }
                var res = [];
                var edge = [vertex0];
                var nonAdmissible = new mathis.HashMap();
                var d = this.allCounters.getValue(vertex0).getValue(vertex1);
                while (edge.length > 0) {
                    res.push(edge);
                    d--;
                    edge = getEdge(edge, nonAdmissible);
                    var selectedEdge = [];
                    for (var _i = 0, edge_2 = edge; _i < edge_2.length; _i++) {
                        var vertex = edge_2[_i];
                        if (this.allCounters.getValue(vertex).getValue(vertex1) == d) {
                            selectedEdge.push(vertex);
                            if (onlyOne)
                                break;
                        }
                    }
                    edge = selectedEdge;
                }
                return res;
            };
            DistancesBetweenAllVertices.prototype.go = function () {
                for (var _i = 0, _a = this.allVertices; _i < _a.length; _i++) {
                    var vertex = _a[_i];
                    var myCounters = new mathis.HashMap(true);
                    myCounters.putValue(vertex, 0);
                    this.allCounters.putValue(vertex, myCounters);
                    var toTransmit = new mathis.HashMap(true);
                    toTransmit.putValue(vertex, 0);
                    this.allToTransmit.putValue(vertex, toTransmit);
                }
                var stillOneToTransmit = true;
                while (stillOneToTransmit) {
                    stillOneToTransmit = false;
                    this.allFreshlyReceived = new mathis.HashMap();
                    for (var _b = 0, _c = this.allVertices; _b < _c.length; _b++) {
                        var vertex = _c[_b];
                        this.allFreshlyReceived.putValue(vertex, new mathis.HashMap(true));
                    }
                    for (var _d = 0, _e = this.allVertices; _d < _e.length; _d++) {
                        var vertex = _e[_d];
                        var toTransmit = this.allToTransmit.getValue(vertex);
                        for (var _f = 0, _g = vertex.links; _f < _g.length; _f++) {
                            var link = _g[_f];
                            var voiCounter = this.allCounters.getValue(link.to);
                            for (var _h = 0, _j = toTransmit.allKeys(); _h < _j.length; _h++) {
                                var v = _j[_h];
                                if (voiCounter.getValue(v) == null) {
                                    stillOneToTransmit = true;
                                    voiCounter.putValue(v, toTransmit.getValue(v) + 1);
                                    this.allFreshlyReceived.getValue(link.to).putValue(v, toTransmit.getValue(v) + 1);
                                }
                            }
                        }
                    }
                    this.allToTransmit = this.allFreshlyReceived;
                    this.OUT_diameter = 0;
                    for (var _k = 0, _l = this.allVertices; _k < _l.length; _k++) {
                        var vertex = _l[_k];
                        for (var _m = 0, _o = this.allCounters.getValue(vertex).allEntries(); _m < _o.length; _m++) {
                            var entry = _o[_m];
                            if (entry.value > this.OUT_diameter) {
                                this.OUT_diameter = entry.value;
                                this.OUT_aMaxCouple = [vertex, entry.key];
                                this.OUT_allExtremeVertex = [vertex];
                            }
                            if (entry.value == this.OUT_diameter)
                                this.OUT_allExtremeVertex.push(vertex);
                        }
                    }
                }
            };
            return DistancesBetweenAllVertices;
        }());
        graph.DistancesBetweenAllVertices = DistancesBetweenAllVertices;
        function getEdge(aGroup, CHANGING_nonAdmissibleForEdge) {
            if (CHANGING_nonAdmissibleForEdge == null)
                CHANGING_nonAdmissibleForEdge = new mathis.HashMap();
            var edge = [];
            for (var _i = 0, aGroup_1 = aGroup; _i < aGroup_1.length; _i++) {
                var vertex = aGroup_1[_i];
                CHANGING_nonAdmissibleForEdge.putValue(vertex, true);
            }
            for (var _a = 0, aGroup_2 = aGroup; _a < aGroup_2.length; _a++) {
                var vertex = aGroup_2[_a];
                for (var _b = 0, _c = vertex.links; _b < _c.length; _b++) {
                    var link = _c[_b];
                    if (!CHANGING_nonAdmissibleForEdge.getValue(link.to)) {
                        edge.push(link.to);
                    }
                    CHANGING_nonAdmissibleForEdge.putValue(link.to, true);
                }
            }
            return edge;
        }
        graph.getEdge = getEdge;
        function getEdgeConsideringAlsoDiagonalVoisin(aGroup, CHANGING_nonAdmissibleForEdge, exactltyTwo) {
            if (exactltyTwo === void 0) { exactltyTwo = false; }
            if (CHANGING_nonAdmissibleForEdge == null)
                CHANGING_nonAdmissibleForEdge = new mathis.HashMap();
            var edge = getEdge(aGroup, CHANGING_nonAdmissibleForEdge);
            var dicoEdge = new mathis.HashMap();
            for (var _i = 0, edge_3 = edge; _i < edge_3.length; _i++) {
                var c = edge_3[_i];
                dicoEdge.putValue(c, true);
            }
            var edgeAndGroup = edge.concat(aGroup);
            var edge2 = getEdge(edgeAndGroup);
            for (var _a = 0, edge2_1 = edge2; _a < edge2_1.length; _a++) {
                var c = edge2_1[_a];
                if (c.links.length <= 4) {
                    var nbLinkInEdge = 0;
                    for (var _b = 0, _c = c.links; _b < _c.length; _b++) {
                        var v = _c[_b];
                        if (dicoEdge.getValue(v.to) != null)
                            nbLinkInEdge++;
                    }
                    if (exactltyTwo && nbLinkInEdge == 2) {
                        edge.push(c);
                        CHANGING_nonAdmissibleForEdge.putValue(c, true);
                    }
                    else if (nbLinkInEdge >= 2) {
                        edge.push(c);
                        CHANGING_nonAdmissibleForEdge.putValue(c, true);
                    }
                }
            }
            return edge;
        }
        graph.getEdgeConsideringAlsoDiagonalVoisin = getEdgeConsideringAlsoDiagonalVoisin;
        function ringify(centralCells) {
            var nonAdmissible = new mathis.HashMap();
            if (centralCells == null || centralCells.length == 0)
                throw 'problème d argument';
            var res = [];
            res.push(centralCells);
            var edge = getEdge(centralCells, nonAdmissible);
            while (edge.length > 0) {
                res.push(edge);
                edge = getEdge(edge, nonAdmissible);
            }
            return res;
        }
        graph.ringify = ringify;
        function ringifyConsideringAlsoDiagonalVoisin(centralCells) {
            if (centralCells == null || centralCells.length == 0)
                throw 'problème d argument';
            var res = [];
            res.push(centralCells);
            var interior = centralCells;
            var edge = getEdgeConsideringAlsoDiagonalVoisin(interior);
            while (edge.length > 0) {
                res.push(edge);
                interior = interior.concat(edge);
                edge = getEdgeConsideringAlsoDiagonalVoisin(interior);
            }
            return res;
        }
        graph.ringifyConsideringAlsoDiagonalVoisin = ringifyConsideringAlsoDiagonalVoisin;
    })(graph = mathis.graph || (mathis.graph = {}));
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    var grateAndGlue;
    (function (grateAndGlue) {
        var GraphGrater = (function () {
            function GraphGrater() {
                this.IN_graphFamily = [];
                this.seedsList = null;
                this.seedComputedFromBarycentersVersusFromAllPossibleCells = true;
                this.barycenterDecay = new mathis.XYZ(0.0000000234, 0.000000000677, 0.000000000987);
                this.proximityCoefToGrate = [0.7];
                this.proportionOfSeeds = [0.1];
                this.asymmetriesForSeeds = null;
            }
            GraphGrater.prototype.checkArgs = function () {
                if (this.IN_graphFamily == null || this.IN_graphFamily.length < 2)
                    throw 'SUB_grater works from 2 graphs';
            };
            GraphGrater.prototype.suppressTooCloseVertex = function (family) {
                var res = [];
                for (var i = 0; i < family.length; i++) {
                    var neighborhoodCoef = this.proximityCoefToGrate[i % this.proximityCoefToGrate.length];
                    res[i] = [];
                    for (var _i = 0, _a = family[i]; _i < _a.length; _i++) {
                        var verI = _a[_i];
                        var ok = true;
                        for (var j = 0; j < family.length; j++) {
                            if (i != j) {
                                ok = !this.proximityMeasurer.isCloseToMe(verI, family[j], neighborhoodCoef);
                                if (!ok)
                                    break;
                            }
                        }
                        if (ok)
                            res[i].push(verI);
                    }
                }
                return res;
            };
            GraphGrater.prototype.findSeeds = function () {
                var res = [];
                if (!this.seedComputedFromBarycentersVersusFromAllPossibleCells) {
                    res = this.suppressTooCloseVertex(this.IN_graphFamily);
                }
                else {
                    for (var i = 0; i < this.IN_graphFamily.length; i++) {
                        res[i] = [];
                    }
                    var barycenters = [];
                    for (var i = 0; i < this.IN_graphFamily.length; i++) {
                        barycenters[i] = new mathis.XYZ(0, 0, 0);
                        for (var _i = 0, _a = this.IN_graphFamily[i]; _i < _a.length; _i++) {
                            var v = _a[_i];
                            barycenters[i].add(v.position);
                        }
                        barycenters[i].scale(1 / this.IN_graphFamily[i].length);
                        barycenters[i].add(this.barycenterDecay);
                    }
                    var toSort = function (a, b) { return b.distance - a.distance; };
                    for (var emp = 0; emp < this.IN_graphFamily.length; emp++) {
                        var baryOfOther = new mathis.XYZ(0, 0, 0);
                        for (var k = 0; k < this.IN_graphFamily.length; k++)
                            if (k != emp)
                                baryOfOther.add(barycenters[k]);
                        baryOfOther.scale(1 / (this.IN_graphFamily.length - 1));
                        var vertexAndDist = [];
                        var bary2Pos = new mathis.XYZ(0, 0, 0);
                        for (var _b = 0, _c = this.IN_graphFamily[emp]; _b < _c.length; _b++) {
                            var v = _c[_b];
                            bary2Pos.copyFrom(v.position).substract(baryOfOther);
                            var dd = mathis.geo.distance(v.position, baryOfOther);
                            if (this.asymmetriesForSeeds != null && this.asymmetriesForSeeds[emp % this.asymmetriesForSeeds.length] != null) {
                                var asy = this.asymmetriesForSeeds[emp % this.asymmetriesForSeeds.length];
                                var angle = mathis.geo.angleBetweenTwoVectorsBetween0andPi(bary2Pos, asy.direction);
                                var modu = Math.PI;
                                if (asy.modulo != null) {
                                    modu = asy.modulo;
                                    if (isNaN(modu) || modu < 0 || modu > Math.PI)
                                        throw 'modulo must be a number between 0 and PI, but is:' + modu;
                                    angle = mathis.modulo(angle, modu);
                                }
                                var coef = 1 - angle / modu;
                                dd = dd * (1 - asy.influence) + coef * asy.influence;
                            }
                            vertexAndDist.push({ vertex: v, distance: dd });
                        }
                        vertexAndDist.sort(toSort);
                        res[emp] = [];
                        var borne = void 0;
                        if (this.proportionOfSeeds[emp % this.proportionOfSeeds.length] > 0)
                            borne = vertexAndDist[0].distance * (1 - this.proportionOfSeeds[emp % this.proportionOfSeeds.length]);
                        else
                            borne = vertexAndDist[0].distance * 0.99;
                        var dist = Number.MAX_VALUE;
                        var i = 0;
                        while (dist >= borne && i < vertexAndDist.length - 1) {
                            res[emp].push(vertexAndDist[i].vertex);
                            i++;
                            dist = vertexAndDist[i].distance;
                        }
                    }
                }
                res = this.suppressTooCloseVertex(res);
                for (var i = 0; i < this.IN_graphFamily.length; i++)
                    if (res[i].length == 0)
                        throw 'an empty seeds, possible cause: 1/  two graphes are identical 2/ one of your graph is nearly includes into an other and you do not use the barycenter technique';
                return res;
            };
            GraphGrater.prototype.go = function () {
                this.checkArgs();
                if (this.proximityMeasurer == null)
                    this.proximityMeasurer = new ProximityMeasurer();
                if (this.seedsList == null) {
                    this.seedsList = this.findSeeds();
                    this.OUT_allSeeds = this.seedsList;
                }
                var alreadySomeVertex = true;
                var interior = [];
                for (var i = 0; i < this.IN_graphFamily.length; i++) {
                    interior[i] = [].concat(this.seedsList[i]);
                }
                var nonAdmissibleForEdge = new mathis.HashMap();
                while (alreadySomeVertex) {
                    alreadySomeVertex = false;
                    for (var i = 0; i < this.IN_graphFamily.length; i++) {
                        var neighborhoodCoef = this.proximityCoefToGrate[i % this.proximityCoefToGrate.length];
                        var edge = mathis.graph.getEdge(interior[i], nonAdmissibleForEdge);
                        for (var _i = 0, edge_4 = edge; _i < edge_4.length; _i++) {
                            var ve = edge_4[_i];
                            var isClose = false;
                            for (var j = 0; j < this.IN_graphFamily.length; j++) {
                                if (i != j && this.proximityMeasurer.isCloseToMe(ve, interior[j], neighborhoodCoef)) {
                                    isClose = true;
                                    break;
                                }
                            }
                            if (!isClose) {
                                interior[i].push(ve);
                                alreadySomeVertex = true;
                            }
                        }
                    }
                }
                return interior;
            };
            return GraphGrater;
        }());
        grateAndGlue.GraphGrater = GraphGrater;
        var ProximityMeasurer = (function () {
            function ProximityMeasurer() {
                this.vertexToLinkLength = new mathis.HashMap();
            }
            ProximityMeasurer.prototype.meanLinksDist = function (vertex) {
                var res = this.vertexToLinkLength.getValue(vertex);
                if (res != null)
                    return res;
                var dist = 0;
                for (var _i = 0, _a = vertex.links; _i < _a.length; _i++) {
                    var link = _a[_i];
                    dist += mathis.geo.distance(vertex.position, link.to.position);
                }
                dist /= vertex.links.length;
                this.vertexToLinkLength.putValue(vertex, dist);
                return dist;
            };
            ProximityMeasurer.prototype.isCloseToMe = function (vertex, family, coef) {
                for (var _i = 0, family_1 = family; _i < family_1.length; _i++) {
                    var v = family_1[_i];
                    if (this.areClose(vertex, v, coef))
                        return true;
                }
                return false;
            };
            ProximityMeasurer.prototype.areClose = function (vertex0, vertex1, coef) {
                return (mathis.geo.distance(vertex0.position, vertex1.position) < (this.meanLinksDist(vertex0) + this.meanLinksDist(vertex1)) / 2 * coef);
            };
            ProximityMeasurer.prototype.areFar = function (vertex0, vertex1, coef) {
                return (mathis.geo.distance(vertex0.position, vertex1.position) > (this.meanLinksDist(vertex0) + this.meanLinksDist(vertex1)) / 2 * coef);
            };
            return ProximityMeasurer;
        }());
        grateAndGlue.ProximityMeasurer = ProximityMeasurer;
        var SubMameshExtractor = (function () {
            function SubMameshExtractor(mamesh, verticesToKeep) {
                this.verticesToKeepMustBeInMamesh = true;
                this.constructCutSegment = true;
                this.takeCareOfPolygons = true;
                this.addBorderPolygonInsteadOfSuppress = false;
                this.OUT_BorderPolygon = [];
                this.OUT_BorderVerticesInside = [];
                this.OUTBorderVerticesOutside = [];
                this.mamesh = mamesh;
                this.verticesToKeep = verticesToKeep;
            }
            SubMameshExtractor.prototype.go = function () {
                var _this = this;
                var res = new mathis.Mamesh();
                this.verticesToKeep.forEach(function (vertex) {
                    if (_this.mamesh.hasVertex(vertex)) {
                        res.addVertex(vertex);
                    }
                    else if (_this.verticesToKeepMustBeInMamesh)
                        throw 'a vertex in the list to keep is not in the original mesh. If you want to allow this, please turn the boolean "verticesToKeepMustBeInMamesh" to false';
                });
                for (var i = 0; i < this.mamesh.smallestSquares.length; i += 4) {
                    var sumOfPresentVertex = 0;
                    if (res.hasVertex(this.mamesh.smallestSquares[i]))
                        sumOfPresentVertex++;
                    if (res.hasVertex(this.mamesh.smallestSquares[i + 1]))
                        sumOfPresentVertex++;
                    if (res.hasVertex(this.mamesh.smallestSquares[i + 2]))
                        sumOfPresentVertex++;
                    if (res.hasVertex(this.mamesh.smallestSquares[i + 3]))
                        sumOfPresentVertex++;
                    if (sumOfPresentVertex > 0 && sumOfPresentVertex < 4)
                        this.OUT_BorderPolygon.push([this.mamesh.smallestSquares[i], this.mamesh.smallestSquares[i + 1], this.mamesh.smallestSquares[i + 2], this.mamesh.smallestSquares[i + 3]]);
                    else if (sumOfPresentVertex == 4)
                        res.smallestSquares.push(this.mamesh.smallestSquares[i], this.mamesh.smallestSquares[i + 1], this.mamesh.smallestSquares[i + 2], this.mamesh.smallestSquares[i + 3]);
                }
                for (var i = 0; i < this.mamesh.smallestTriangles.length; i += 3) {
                    var sumOfPresentVertex = 0;
                    if (res.hasVertex(this.mamesh.smallestTriangles[i]))
                        sumOfPresentVertex++;
                    if (res.hasVertex(this.mamesh.smallestTriangles[i + 1]))
                        sumOfPresentVertex++;
                    if (res.hasVertex(this.mamesh.smallestTriangles[i + 2]))
                        sumOfPresentVertex++;
                    if (sumOfPresentVertex > 0 && sumOfPresentVertex < 3)
                        this.OUT_BorderPolygon.push([this.mamesh.smallestTriangles[i], this.mamesh.smallestTriangles[i + 1], this.mamesh.smallestTriangles[i + 2]]);
                    else if (sumOfPresentVertex == 3)
                        res.smallestTriangles.push(this.mamesh.smallestTriangles[i], this.mamesh.smallestTriangles[i + 1], this.mamesh.smallestTriangles[i + 2]);
                }
                for (var _i = 0, _a = this.OUT_BorderPolygon; _i < _a.length; _i++) {
                    var poly = _a[_i];
                    for (var _b = 0, poly_1 = poly; _b < poly_1.length; _b++) {
                        var v = poly_1[_b];
                        if (res.hasVertex(v)) {
                            if (this.OUT_BorderVerticesInside.indexOf(v) == -1)
                                this.OUT_BorderVerticesInside.push(v);
                        }
                        else {
                            if (this.OUTBorderVerticesOutside.indexOf(v) == -1)
                                this.OUTBorderVerticesOutside.push(v);
                        }
                    }
                }
                if (this.takeCareOfPolygons) {
                    if (this.addBorderPolygonInsteadOfSuppress) {
                        for (var _c = 0, _d = this.OUT_BorderPolygon; _c < _d.length; _c++) {
                            var poly = _d[_c];
                            if (poly.length == 3)
                                res.smallestTriangles.push(poly[0], poly[1], poly[2]);
                            else if (poly.length == 4)
                                res.smallestSquares.push(poly[0], poly[1], poly[2], poly[3]);
                        }
                        for (var _e = 0, _f = this.OUTBorderVerticesOutside; _e < _f.length; _e++) {
                            var vert = _f[_e];
                            res.addVertex(vert);
                        }
                    }
                    else {
                        var suppressedIndexOfBorderInside = [];
                        var suppressedIndexOfRes = [];
                        for (var i = 0; i < this.OUT_BorderVerticesInside.length; i++) {
                            var vert = this.OUT_BorderVerticesInside[i];
                            var isInAPoly = false;
                            for (var _g = 0, _h = res.smallestSquares; _g < _h.length; _g++) {
                                var v = _h[_g];
                                if (v.hashNumber == vert.hashNumber) {
                                    isInAPoly = true;
                                    break;
                                }
                            }
                            if (!isInAPoly) {
                                for (var _j = 0, _k = res.smallestTriangles; _j < _k.length; _j++) {
                                    var v = _k[_j];
                                    if (v.hashNumber == vert.hashNumber) {
                                        isInAPoly = true;
                                        break;
                                    }
                                }
                            }
                            if (!isInAPoly) {
                                suppressedIndexOfRes.push(res.vertices.indexOf(vert));
                                suppressedIndexOfBorderInside.push(i);
                            }
                        }
                        this.OUT_BorderVerticesInside = mathis.tab.arrayMinusSomeIndices(this.OUT_BorderVerticesInside, suppressedIndexOfBorderInside);
                        res.vertices = mathis.tab.arrayMinusSomeIndices(res.vertices, suppressedIndexOfRes);
                    }
                }
                if (this.constructCutSegment) {
                    for (var key in this.mamesh.cutSegmentsDico) {
                        var segment = this.mamesh.cutSegmentsDico[key];
                        if (!res.hasVertex(segment.a))
                            continue;
                        if (!res.hasVertex(segment.b))
                            continue;
                        if (!res.hasVertex(segment.middle))
                            continue;
                        res.cutSegmentsDico[key] = segment;
                    }
                }
                return res;
            };
            return SubMameshExtractor;
        }());
        grateAndGlue.SubMameshExtractor = SubMameshExtractor;
        var ExtractCentralPart = (function () {
            function ExtractCentralPart(mamesh, nb) {
                this.markBorder = true;
                this.suppressFromBorderVersusCorner = true;
                this.mamesh = mamesh;
                this.nb = nb;
            }
            ExtractCentralPart.prototype.go = function () {
                var border = [];
                if (this.suppressFromBorderVersusCorner) {
                    for (var _i = 0, _a = this.mamesh.vertices; _i < _a.length; _i++) {
                        var ver = _a[_i];
                        if (ver.hasMark(mathis.Vertex.Markers.border))
                            border.push(ver);
                    }
                }
                else {
                    for (var _b = 0, _c = this.mamesh.vertices; _b < _c.length; _b++) {
                        var ver = _c[_b];
                        if (ver.hasMark(mathis.Vertex.Markers.corner))
                            border.push(ver);
                    }
                }
                var rings = mathis.graph.ringify(border);
                var toSuppress = new mathis.HashMap();
                if (this.nb < 0)
                    this.nb = rings.length + this.nb - 1;
                if (this.nb >= rings.length - 1)
                    throw 'you want to suppress too much strates';
                for (var i = 0; i < this.nb; i++) {
                    for (var _d = 0, _e = rings[i]; _d < _e.length; _d++) {
                        var v = _e[_d];
                        toSuppress.putValue(v, true);
                    }
                }
                var toKeep = [];
                for (var _f = 0, _g = this.mamesh.vertices; _f < _g.length; _f++) {
                    var v = _g[_f];
                    if (toSuppress.getValue(v) == null) {
                        toKeep.push(v);
                    }
                }
                if (this.markBorder)
                    for (var _h = 0, _j = rings[this.nb]; _h < _j.length; _h++) {
                        var v = _j[_h];
                        v.markers.push(mathis.Vertex.Markers.border);
                    }
                var suber = new grateAndGlue.SubMameshExtractor(this.mamesh, toKeep);
                var res = suber.go();
                return res;
            };
            return ExtractCentralPart;
        }());
        grateAndGlue.ExtractCentralPart = ExtractCentralPart;
        var FindStickingMapFromSquare = (function () {
            function FindStickingMapFromSquare(receiver, source) {
                this.receiver = receiver;
                this.source = source;
            }
            FindStickingMapFromSquare.prototype.checkArgs = function () {
                if (this.receiver.length % 4 != 0)
                    throw 'receiver is not a list representing squares';
                if (this.source.length % 4 != 0)
                    throw 'source is not a list representing squares';
            };
            FindStickingMapFromSquare.prototype.go = function () {
                this.checkArgs();
                var res = new mathis.HashMap(true);
                var sourceBaryCenter = this.squareToBaryCenter(this.source);
                var receiverBaryCenter = this.squareToBaryCenter(this.receiver);
                for (var i = 0; i < sourceBaryCenter.length; i++) {
                    var minDist = Number.MAX_VALUE;
                    var bestReceiverIndex = -1;
                    for (var j = 0; j < receiverBaryCenter.length; j++) {
                        var dist = mathis.geo.distance(sourceBaryCenter[i], receiverBaryCenter[j]);
                        if (dist < minDist) {
                            minDist = dist;
                            bestReceiverIndex = j;
                        }
                    }
                    var receiverPaquet = [this.receiver[4 * bestReceiverIndex], this.receiver[4 * bestReceiverIndex + 1], this.receiver[4 * bestReceiverIndex + 2], this.receiver[4 * bestReceiverIndex + 3]];
                    var sourcePaquet = [this.source[4 * i], this.source[4 * i + 1], this.source[4 * i + 2], this.source[4 * i + 3]];
                    var permutedReceiverPaquet = this.getBestPermutationOfReceiver(receiverPaquet, sourcePaquet);
                    for (var k = 0; k < 4; k++) {
                        res.putValue(sourcePaquet[k], permutedReceiverPaquet[k]);
                    }
                }
                return res;
            };
            FindStickingMapFromSquare.prototype.getBestPermutationOfReceiver = function (receiverPaquet, sourcePaquet) {
                var minDist = Number.MAX_VALUE;
                var bestDecal = -1;
                for (var k_1 = 0; k_1 < 4; k_1++) {
                    var decalReceiver = [receiverPaquet[k_1], receiverPaquet[(k_1 + 1) % 4], receiverPaquet[(k_1 + 2) % 4], receiverPaquet[(k_1 + 3) % 4]];
                    var dist = 0;
                    for (var l = 0; l < 4; l++)
                        dist += mathis.geo.distance(sourcePaquet[l].position, decalReceiver[l].position);
                    if (dist < minDist) {
                        minDist = dist;
                        bestDecal = k_1;
                    }
                }
                var k = bestDecal;
                return [receiverPaquet[k], receiverPaquet[(k + 1) % 4], receiverPaquet[(k + 2) % 4], receiverPaquet[(k + 3) % 4]];
            };
            FindStickingMapFromSquare.prototype.squareToBaryCenter = function (vertices) {
                var res = [];
                for (var i = 0; i < vertices.length; i += 4) {
                    var paquet = [vertices[i].position, vertices[i + 1].position, vertices[i + 2].position, vertices[i + 3].position];
                    var bary = new mathis.XYZ(0, 0, 0);
                    mathis.geo.baryCenter(paquet, [1 / 4, 1 / 4, 1 / 4, 1 / 4], bary);
                    res.push(bary);
                }
                return res;
            };
            return FindStickingMapFromSquare;
        }());
        var FindSickingMapFromVertices = (function () {
            function FindSickingMapFromVertices(receiver, source) {
                this.toleranceToBeOneOfTheClosest = 0.5;
                this.proximityCoef = 0.7;
                this.acceptOnlyDisjointReceiverAndSource = true;
                this.receiver = receiver;
                this.source = source;
            }
            FindSickingMapFromVertices.prototype.checkArgs = function () {
                if (this.acceptOnlyDisjointReceiverAndSource) {
                    var dico = new mathis.HashMap();
                    for (var _i = 0, _a = this.source; _i < _a.length; _i++) {
                        var v = _a[_i];
                        dico.putValue(v, true);
                    }
                    for (var _b = 0, _c = this.receiver; _b < _c.length; _b++) {
                        var v = _c[_b];
                        if (dico.getValue(v) != null)
                            throw 'source and receiver must be disjoint';
                    }
                }
            };
            FindSickingMapFromVertices.prototype.go = function () {
                this.checkArgs();
                if (this.proximityMeasurer == null)
                    this.proximityMeasurer = new ProximityMeasurer();
                this.checkArgs();
                var res = new mathis.HashMap(true);
                for (var _i = 0, _a = this.source; _i < _a.length; _i++) {
                    var vSource = _a[_i];
                    var minDist = Number.POSITIVE_INFINITY;
                    var receiverToDist = new mathis.HashMap(true);
                    var veryBestReceiver = null;
                    for (var _b = 0, _c = this.receiver; _b < _c.length; _b++) {
                        var vReceiver = _c[_b];
                        var dist = mathis.geo.distance(vSource.position, vReceiver.position);
                        if (this.proximityMeasurer.areClose(vSource, vReceiver, this.proximityCoef)) {
                            receiverToDist.putValue(vReceiver, dist);
                            if (dist < minDist) {
                                minDist = dist;
                                veryBestReceiver = vReceiver;
                            }
                        }
                    }
                    if (veryBestReceiver != null) {
                        var bestReceivers = [];
                        bestReceivers.push(veryBestReceiver);
                        for (var _d = 0, _e = receiverToDist.allKeys(); _d < _e.length; _d++) {
                            var vReceiver = _e[_d];
                            if (vReceiver != veryBestReceiver && receiverToDist.getValue(vReceiver) <= minDist * (1 + this.toleranceToBeOneOfTheClosest)) {
                                bestReceivers.push(vReceiver);
                            }
                        }
                        res.putValue(vSource, bestReceivers);
                    }
                }
                return res;
            };
            return FindSickingMapFromVertices;
        }());
        grateAndGlue.FindSickingMapFromVertices = FindSickingMapFromVertices;
        var ConcurrentMameshesGraterAndSticker = (function () {
            function ConcurrentMameshesGraterAndSticker() {
                this.IN_mameshes = [];
                this.SUB_grater = new GraphGrater();
                this.justGrateDoNotStick = false;
                this.proximityCoefToStick = [2];
                this.toleranceToBeOneOfTheClosest = 0.5;
                this.OUTBorderVerticesToStick = [];
                this.OUTGratedMameshes = [];
                this.takeCareOfPolygons = true;
                this.suppressLinksAngularlyTooClose = true;
                this.SUB_linkCleanerByAngle = new mathis.linkModule.LinksSorterAndCleanerByAngles(null, null);
                this.OUT_stickingMap = new mathis.HashMap(true);
                this.SUB_linkCleanerByAngle.suppressLinksAngularParam = 2 * Math.PI * 0.1;
            }
            ConcurrentMameshesGraterAndSticker.prototype.checkArgs = function () {
            };
            ConcurrentMameshesGraterAndSticker.prototype.goChanging = function () {
                this.checkArgs();
                for (var _i = 0, _a = this.IN_mameshes; _i < _a.length; _i++) {
                    var mam = _a[_i];
                    for (var _b = 0, _c = mam.vertices; _b < _c.length; _b++) {
                        var ve = _c[_b];
                        for (var _d = 0, _e = ve.links; _d < _e.length; _d++) {
                            var li = _e[_d];
                            li.opposites = null;
                        }
                    }
                }
                var graphs = [];
                this.IN_mameshes.forEach(function (m) { return graphs.push(m.vertices); });
                this.SUB_grater.IN_graphFamily = graphs;
                var gratedGraph = this.SUB_grater.go();
                for (var i = 0; i < this.IN_mameshes.length; i++) {
                    var extractor = new grateAndGlue.SubMameshExtractor(this.IN_mameshes[i], gratedGraph[i]);
                    extractor.takeCareOfPolygons = this.takeCareOfPolygons;
                    extractor.addBorderPolygonInsteadOfSuppress = false;
                    this.OUTGratedMameshes[i] = extractor.go();
                    this.OUTBorderVerticesToStick[i] = [];
                    for (var _f = 0, _g = extractor.OUT_BorderVerticesInside; _f < _g.length; _f++) {
                        var vertex = _g[_f];
                        for (var _h = 0, _j = vertex.links; _h < _j.length; _h++) {
                            var link = _j[_h];
                            if (this.IN_mameshes[i].hasVertex(link.to) && !this.OUTGratedMameshes[i].hasVertex(link.to)) {
                                this.OUTBorderVerticesToStick[i].push(vertex);
                                break;
                            }
                        }
                    }
                    this.OUTGratedMameshes[i].isolateMameshVerticesFromExteriorVertices();
                    for (var _k = 0, _l = this.OUTGratedMameshes[i].vertices; _k < _l.length; _k++) {
                        var v = _l[_k];
                        if (v.hasMark(mathis.Vertex.Markers.border) && this.OUTBorderVerticesToStick[i].indexOf(v) == -1)
                            this.OUTBorderVerticesToStick[i].push(v);
                    }
                }
                var res = this.OUTGratedMameshes[0];
                for (var indexMamesh = 1; indexMamesh < this.IN_mameshes.length; indexMamesh++) {
                    var mapFinder = new FindSickingMapFromVertices(res.vertices, this.OUTBorderVerticesToStick[indexMamesh]);
                    mapFinder.toleranceToBeOneOfTheClosest = this.toleranceToBeOneOfTheClosest;
                    mapFinder.proximityCoef = this.proximityCoefToStick[indexMamesh % this.proximityCoefToStick.length];
                    var map = mapFinder.go();
                    this.OUT_stickingMap.extend(map);
                    var sticker = new Sticker(res, this.OUTGratedMameshes[indexMamesh], map);
                    sticker.zIndex1 = indexMamesh;
                    sticker.cleanOppositeLinksAtBegin = false;
                    sticker.createNewLinks = !this.justGrateDoNotStick;
                    sticker.goChanging();
                }
                res.isolateMameshVerticesFromExteriorVertices();
                for (var _m = 0, _o = res.vertices; _m < _o.length; _m++) {
                    var ve = _o[_m];
                    if (ve.links.length == 0)
                        throw ' grating process produce a vertex with no links';
                }
                if (this.suppressLinksAngularlyTooClose) {
                    this.SUB_linkCleanerByAngle.mamesh = res;
                    this.SUB_linkCleanerByAngle.goChanging();
                }
                return res;
            };
            return ConcurrentMameshesGraterAndSticker;
        }());
        grateAndGlue.ConcurrentMameshesGraterAndSticker = ConcurrentMameshesGraterAndSticker;
        var FindCloseVerticesFast = (function () {
            function FindCloseVerticesFast(receivers, sources) {
                this.nbDistinctPoint = 1000;
                this.maxDistToBeClose = null;
                this.throwExceptionIfReceiverHaveCloseVertices = false;
                this.receiverAndSourceMustBeDisjoint = false;
                this.deformationFunction = function (point) { return point; };
                this.mins = new mathis.XYZ(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
                this.maxs = new mathis.XYZ(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
                this.receivers = receivers;
                this.sources = sources;
            }
            FindCloseVerticesFast.prototype.go = function () {
                this.buildScaler();
                var amplitude = new mathis.XYZ(Math.max(1, this.maxs.x - this.mins.x), Math.max(1, this.maxs.y - this.mins.y), Math.max(1, this.maxs.z - this.mins.z));
                var roundPositionToReceiver = new mathis.StringMap();
                for (var _i = 0, _a = this.receivers; _i < _a.length; _i++) {
                    var receiver = _a[_i];
                    var val = this.deformationFunction(receiver.position);
                    var resx = Math.round((val.x - this.mins.x) / amplitude.x * this.nbDistinctPoint);
                    var resy = Math.round((val.y - this.mins.y) / amplitude.y * this.nbDistinctPoint);
                    var resz = Math.round((val.z - this.mins.z) / amplitude.z * this.nbDistinctPoint);
                    var key = resx + ',' + resy + ',' + resz;
                    if (roundPositionToReceiver.getValue(key) == null)
                        roundPositionToReceiver.putValue(key, receiver);
                    else if (this.throwExceptionIfReceiverHaveCloseVertices)
                        throw 'the receiver list has several XYZ very close, and you have forbidden that';
                }
                var res = new mathis.HashMap(true);
                for (var _b = 0, _c = this.sources; _b < _c.length; _b++) {
                    var source = _c[_b];
                    var val = this.deformationFunction(source.position);
                    var resx = Math.round((val.x - this.mins.x) / amplitude.x * this.nbDistinctPoint);
                    var resy = Math.round((val.y - this.mins.y) / amplitude.y * this.nbDistinctPoint);
                    var resz = Math.round((val.z - this.mins.z) / amplitude.z * this.nbDistinctPoint);
                    var receiverFounded = roundPositionToReceiver.getValue(resx + ',' + resy + ',' + resz);
                    if (receiverFounded != null) {
                        if (receiverFounded != source) {
                            var perhapsAList = res.getValue(receiverFounded);
                            if (perhapsAList == null)
                                res.putValue(source, [receiverFounded]);
                            else {
                                if (mathis.geo.distance(receiverFounded.position, source.position) < mathis.geo.distance(receiverFounded.position, perhapsAList[0].position)) {
                                    res.putValue(source, [receiverFounded].concat(perhapsAList));
                                }
                                else
                                    perhapsAList.push(receiverFounded);
                            }
                        }
                        else if (this.receiverAndSourceMustBeDisjoint)
                            throw "receiver-list and source-list are not disjoint, and you have forbidden that";
                    }
                }
                return res;
            };
            FindCloseVerticesFast.prototype.buildScaler = function () {
                var _this = this;
                this.receivers.forEach(function (vv) {
                    var v = _this.deformationFunction(vv.position);
                    if (v.x < _this.mins.x)
                        _this.mins.x = v.x;
                    if (v.y < _this.mins.y)
                        _this.mins.y = v.y;
                    if (v.z < _this.mins.z)
                        _this.mins.z = v.z;
                    if (v.x > _this.maxs.x)
                        _this.maxs.x = v.x;
                    if (v.y > _this.maxs.y)
                        _this.maxs.y = v.y;
                    if (v.z > _this.maxs.z)
                        _this.maxs.z = v.z;
                });
                this.sources.forEach(function (vv) {
                    var v = _this.deformationFunction(vv.position);
                    if (v.x < _this.mins.x)
                        _this.mins.x = v.x;
                    if (v.y < _this.mins.y)
                        _this.mins.y = v.y;
                    if (v.z < _this.mins.z)
                        _this.mins.z = v.z;
                    if (v.x > _this.maxs.x)
                        _this.maxs.x = v.x;
                    if (v.y > _this.maxs.y)
                        _this.maxs.y = v.y;
                    if (v.z > _this.maxs.z)
                        _this.maxs.z = v.z;
                });
                if (this.maxDistToBeClose != null) {
                    this.nbDistinctPoint = mathis.geo.distance(this.maxs, this.mins) / this.maxDistToBeClose;
                }
            };
            return FindCloseVerticesFast;
        }());
        grateAndGlue.FindCloseVerticesFast = FindCloseVerticesFast;
        var Merger = (function () {
            function Merger(receiverMamesh, sourceMamesh, map) {
                this.sourceEqualRecepter = false;
                this.cleanDoubleLinks = false;
                this.cleanDoubleSquareAndTriangles = true;
                this.cleanLinksCrossingSegmentMiddle = true;
                this.suppressSomeTriangleAndSquareSuperposition = false;
                this.mergeLink = true;
                this.mergeTrianglesAndSquares = true;
                this.mergeSegmentsMiddle = true;
                this.destroySource = true;
                this.receiverMamesh = receiverMamesh;
                if (sourceMamesh == null || receiverMamesh == sourceMamesh) {
                    this.sourceMamesh = receiverMamesh;
                    this.sourceEqualRecepter = true;
                }
                else {
                    this.sourceMamesh = sourceMamesh;
                    this.sourceEqualRecepter = false;
                }
                if (map == null)
                    map = new FindCloseVerticesFast(this.receiverMamesh.vertices, this.sourceMamesh.vertices).go();
                this.merginMap = new mathis.HashMap(true);
                for (var _i = 0, _a = map.allEntries(); _i < _a.length; _i++) {
                    var entry = _a[_i];
                    this.merginMap.putValue(entry.key, entry.value[0]);
                }
            }
            Merger.prototype.checkArgs = function () {
                var _this = this;
                if (!this.merginMap.memorizeKeys)
                    throw 'the merging map must memorize the keys';
                this.merginMap.allValues().forEach(function (v) {
                    if (_this.merginMap.getValue(v) != null)
                        throw 'a vertex cannot be the destination and the source of a merging';
                });
            };
            Merger.prototype.goChanging = function () {
                this.checkArgs();
                if (this.mergeLink)
                    this.mergeVerticesAndLinks();
                else
                    this.mergeOnlyVertices();
                if (this.mergeTrianglesAndSquares)
                    this.letsMergeTrianglesAndSquares();
                if (this.mergeSegmentsMiddle)
                    this.mergeCutSegment();
                this.receiverMamesh.lines = null;
                if (this.destroySource && !this.sourceEqualRecepter)
                    this.sourceMamesh.vertices = null;
            };
            Merger.prototype.mergeOnlyVertices = function () {
                var _this = this;
                if (!this.sourceEqualRecepter)
                    this.receiverMamesh.vertices = this.receiverMamesh.vertices.concat(this.sourceMamesh.vertices);
                this.receiverMamesh.clearLinksAndLines();
                this.merginMap.allKeys().forEach(function (v) {
                    mathis.tab.removeFromArray(_this.receiverMamesh.vertices, v);
                });
            };
            Merger.prototype.mergeVerticesAndLinks = function () {
                var _this = this;
                if (!this.sourceEqualRecepter)
                    this.receiverMamesh.vertices = this.receiverMamesh.vertices.concat(this.sourceMamesh.vertices);
                this.receiverMamesh.clearOppositeInLinks();
                this.merginMap.allKeys().forEach(function (v1) {
                    var linksThatWeKeep = [];
                    v1.links.forEach(function (link) {
                        if (_this.merginMap.getValue(link.to) == null) {
                            if (_this.merginMap.getValue(v1) != link.to)
                                linksThatWeKeep.push(link);
                        }
                    });
                    _this.merginMap.getValue(v1).links = _this.merginMap.getValue(v1).links.concat(linksThatWeKeep);
                });
                var newVertices = [];
                this.receiverMamesh.vertices.forEach(function (v) {
                    if (_this.merginMap.allKeys().indexOf(v) == -1)
                        newVertices.push(v);
                });
                this.receiverMamesh.vertices = newVertices;
                this.receiverMamesh.vertices.forEach(function (v1) {
                    var perhapsLinkToSuppress = null;
                    v1.links.forEach(function (link) {
                        if (_this.merginMap.getValue(link.to) != null) {
                            if (_this.merginMap.getValue(link.to) != v1)
                                link.to = _this.merginMap.getValue(link.to);
                            else {
                                if (perhapsLinkToSuppress == null)
                                    perhapsLinkToSuppress = [];
                                perhapsLinkToSuppress.push(link);
                            }
                        }
                    });
                    if (perhapsLinkToSuppress != null) {
                        perhapsLinkToSuppress.forEach(function (li) {
                            mathis.tab.removeFromArray(v1.links, li);
                        });
                    }
                });
                if (this.cleanDoubleLinks) {
                }
            };
            Merger.prototype.mergeCutSegment = function () {
                var _this = this;
                if (!this.sourceEqualRecepter) {
                    for (var key in this.sourceMamesh.cutSegmentsDico)
                        this.receiverMamesh.cutSegmentsDico[key] = this.sourceMamesh.cutSegmentsDico[key];
                }
                for (var key in this.receiverMamesh.cutSegmentsDico) {
                    var segment = this.receiverMamesh.cutSegmentsDico[key];
                    if (segment.a.hashNumber == segment.middle.hashNumber || segment.b.hashNumber == segment.middle.hashNumber || segment.a.hashNumber == segment.b.hashNumber) {
                        delete this.receiverMamesh.cutSegmentsDico[key];
                        continue;
                    }
                    var segmentIsModified = false;
                    if (this.merginMap.getValue(segment.a) != null) {
                        segment.a = this.merginMap.getValue(segment.a);
                        segmentIsModified = true;
                    }
                    if (this.merginMap.getValue(segment.b) != null) {
                        segment.b = this.merginMap.getValue(segment.b);
                        segmentIsModified = true;
                    }
                    if (this.merginMap.getValue(segment.middle) != null) {
                        segment.middle = this.merginMap.getValue(segment.middle);
                        segmentIsModified = true;
                    }
                    if (segmentIsModified) {
                        delete this.receiverMamesh.cutSegmentsDico[key];
                        this.receiverMamesh.cutSegmentsDico[mathis.Segment.segmentId(segment.a.hashNumber, segment.b.hashNumber)] = segment;
                    }
                }
                if (this.cleanLinksCrossingSegmentMiddle) {
                    this.receiverMamesh.vertices.forEach(function (v) {
                        var linkToDelete = [];
                        for (var i = 0; i < v.links.length; i++) {
                            var link = v.links[i];
                            if (_this.receiverMamesh.cutSegmentsDico[mathis.Segment.segmentId(v.hashNumber, link.to.hashNumber)] != null)
                                linkToDelete.push(i);
                        }
                        v.links = mathis.tab.arrayMinusBlocksIndices(v.links, linkToDelete, 1);
                    });
                }
            };
            Merger.prototype.letsMergeTrianglesAndSquares = function () {
                if (!this.sourceEqualRecepter) {
                    this.receiverMamesh.smallestSquares = this.receiverMamesh.smallestSquares.concat(this.sourceMamesh.smallestSquares);
                    this.receiverMamesh.smallestTriangles = this.receiverMamesh.smallestTriangles.concat(this.sourceMamesh.smallestTriangles);
                }
                for (var i = 0; i < this.receiverMamesh.smallestTriangles.length; i++) {
                    var vert = this.receiverMamesh.smallestTriangles[i];
                    if (this.merginMap.getValue(vert) != null)
                        this.receiverMamesh.smallestTriangles[i] = this.merginMap.getValue(vert);
                }
                var triangleToSuppress = [];
                for (var i = 0; i < this.receiverMamesh.smallestTriangles.length; i += 3) {
                    if (this.receiverMamesh.smallestTriangles[i] == this.receiverMamesh.smallestTriangles[i + 1] || this.receiverMamesh.smallestTriangles[i + 1] == this.receiverMamesh.smallestTriangles[i + 2] || this.receiverMamesh.smallestTriangles[i + 2] == this.receiverMamesh.smallestTriangles[i]) {
                        triangleToSuppress.push(i);
                    }
                }
                this.receiverMamesh.smallestTriangles = mathis.tab.arrayMinusBlocksIndices(this.receiverMamesh.smallestTriangles, triangleToSuppress, 3);
                this.receiverMamesh.smallestTriangles = new mathis.tab.ArrayMinusBlocksElements(this.receiverMamesh.smallestTriangles, 3).go();
                for (var i = 0; i < this.receiverMamesh.smallestSquares.length; i++) {
                    var vert = this.receiverMamesh.smallestSquares[i];
                    if (this.merginMap.getValue(vert) != null)
                        this.receiverMamesh.smallestSquares[i] = this.merginMap.getValue(vert);
                }
                var squareToSuppress = [];
                for (var i = 0; i < this.receiverMamesh.smallestSquares.length; i += 4) {
                    var changedSquare = this.changeOneSquare([this.receiverMamesh.smallestSquares[i], this.receiverMamesh.smallestSquares[i + 1], this.receiverMamesh.smallestSquares[i + 2], this.receiverMamesh.smallestSquares[i + 3]]);
                    if (changedSquare == null) {
                        squareToSuppress.push(i);
                    }
                    else if (changedSquare.length == 3) {
                        this.receiverMamesh.smallestTriangles.push(changedSquare[0], changedSquare[1], changedSquare[2]);
                        squareToSuppress.push(i);
                    }
                }
                this.receiverMamesh.smallestSquares = mathis.tab.arrayMinusBlocksIndices(this.receiverMamesh.smallestSquares, squareToSuppress, 4);
                if (this.cleanDoubleSquareAndTriangles)
                    this.receiverMamesh.smallestSquares = new mathis.tab.ArrayMinusBlocksElements(this.receiverMamesh.smallestSquares, 4).go();
                if (this.suppressSomeTriangleAndSquareSuperposition) {
                    var triInSquare = new mathis.StringMap();
                    for (var i = 0; i < this.receiverMamesh.smallestSquares.length; i += 4) {
                        triInSquare.putValue(mathis.tab.indicesUpPermutationToString([this.receiverMamesh.smallestSquares[i].hashNumber, this.receiverMamesh.smallestSquares[i + 1].hashNumber, this.receiverMamesh.smallestSquares[i + 2].hashNumber]), true);
                        triInSquare.putValue(mathis.tab.indicesUpPermutationToString([this.receiverMamesh.smallestSquares[i + 2].hashNumber, this.receiverMamesh.smallestSquares[i + 3].hashNumber, this.receiverMamesh.smallestSquares[i].hashNumber]), true);
                        triInSquare.putValue(mathis.tab.indicesUpPermutationToString([this.receiverMamesh.smallestSquares[i].hashNumber, this.receiverMamesh.smallestSquares[i + 1].hashNumber, this.receiverMamesh.smallestSquares[i + 3].hashNumber]), true);
                        triInSquare.putValue(mathis.tab.indicesUpPermutationToString([this.receiverMamesh.smallestSquares[i + 1].hashNumber, this.receiverMamesh.smallestSquares[i + 2].hashNumber, this.receiverMamesh.smallestSquares[i + 3].hashNumber]), true);
                    }
                    var triToSupp = [];
                    for (var i = 0; i < this.receiverMamesh.smallestTriangles.length; i += 3) {
                        var key = mathis.tab.indicesUpPermutationToString([this.receiverMamesh.smallestTriangles[i].hashNumber, this.receiverMamesh.smallestTriangles[i + 1].hashNumber, this.receiverMamesh.smallestTriangles[i + 2].hashNumber]);
                        if (triInSquare.getValue(key)) {
                            triToSupp.push(i, i + 1, i + 2);
                        }
                    }
                    this.receiverMamesh.smallestTriangles = mathis.tab.arrayMinusBlocksIndices(this.receiverMamesh.smallestTriangles, triToSupp, 3);
                    var diago = new mathis.StringMap();
                    for (var i = 0; i < this.receiverMamesh.smallestSquares.length; i += 4) {
                        diago.putValue(mathis.tab.indicesUpPermutationToString([this.receiverMamesh.smallestSquares[i].hashNumber, this.receiverMamesh.smallestSquares[i + 2].hashNumber]), true);
                        diago.putValue(mathis.tab.indicesUpPermutationToString([this.receiverMamesh.smallestSquares[i + 1].hashNumber, this.receiverMamesh.smallestSquares[i + 3].hashNumber]), true);
                    }
                    var squareToRemove = [];
                    var triToAdd = [];
                    for (var i = 0; i < this.receiverMamesh.smallestSquares.length; i += 4) {
                        for (var k = 0; k < 4; k++) {
                            var edge0 = [this.receiverMamesh.smallestSquares[i + k].hashNumber, this.receiverMamesh.smallestSquares[i + (k + 1) % 4].hashNumber];
                            var edge1 = [this.receiverMamesh.smallestSquares[i + (k + 1) % 4].hashNumber, this.receiverMamesh.smallestSquares[i + (k + 2) % 4].hashNumber];
                            if (diago.getValue(mathis.tab.indicesUpPermutationToString(edge0)) && diago.getValue(mathis.tab.indicesUpPermutationToString(edge1))) {
                                squareToRemove.push(i, i + 1, i + 2, i + 3);
                                triToAdd.push(this.receiverMamesh.smallestSquares[i + (k + 2) % 4], this.receiverMamesh.smallestSquares[i + (k + 3) % 4], this.receiverMamesh.smallestSquares[i + k % 4]);
                            }
                        }
                    }
                    if (triToAdd.length > 0) {
                        this.receiverMamesh.smallestSquares = mathis.tab.arrayMinusBlocksIndices(this.receiverMamesh.smallestSquares, squareToRemove, 4);
                        this.receiverMamesh.smallestTriangles = this.receiverMamesh.smallestTriangles.concat(triToAdd);
                    }
                }
            };
            Merger.prototype.changeOneSquare = function (square) {
                if (square[0] == square[2] || square[1] == square[3])
                    return null;
                var indexOfCollabsed = null;
                var nbOfCollapsed = 0;
                for (var i = 0; i < 4; i++) {
                    if (square[i] == square[(i + 1) % 4]) {
                        nbOfCollapsed++;
                        indexOfCollabsed = i;
                    }
                }
                if (nbOfCollapsed == 0)
                    return square;
                if (nbOfCollapsed > 1)
                    return null;
                if (indexOfCollabsed == 0)
                    return [square[1], square[2], square[3]];
                if (indexOfCollabsed == 1)
                    return [square[2], square[3], square[0]];
                if (indexOfCollabsed == 2)
                    return [square[3], square[0], square[1]];
                if (indexOfCollabsed == 3)
                    return [square[0], square[1], square[2]];
            };
            return Merger;
        }());
        grateAndGlue.Merger = Merger;
        var Sticker = (function () {
            function Sticker(mamesh0, mamesh1, stickingMap) {
                this.createNewLinks = true;
                this.cleanOppositeLinksAtBegin = true;
                this.twoMameshes = true;
                this.zIndex1 = Math.random();
                if (mamesh0 == mamesh1 || mamesh1 == null)
                    this.twoMameshes = false;
                this.mamesh0 = mamesh0;
                if (this.twoMameshes)
                    this.mamesh1 = mamesh1;
                else
                    this.mamesh1 = null;
                this.stickingMap = stickingMap;
            }
            Sticker.prototype.checkArgs = function () {
                if (!this.stickingMap.memorizeKeys)
                    throw 'the sticking map must memorize the keys';
                for (var _i = 0, _a = this.stickingMap.allValues(); _i < _a.length; _i++) {
                    var vs = _a[_i];
                    for (var _b = 0, vs_1 = vs; _b < vs_1.length; _b++) {
                        var v = vs_1[_b];
                        if (this.stickingMap.getValue(v) != null)
                            throw 'a vertex cannot be the destination and the source of a sticking';
                    }
                }
            };
            Sticker.prototype.goChanging = function () {
                if (this.stickingMap.allKeys().length == 0)
                    return;
                this.checkArgs();
                if (this.cleanOppositeLinksAtBegin) {
                    this.mamesh0.clearOppositeInLinks();
                    if (this.twoMameshes)
                        this.mamesh1.clearOppositeInLinks();
                }
                if (this.twoMameshes) {
                    for (var _i = 0, _a = this.mamesh1.vertices; _i < _a.length; _i++) {
                        var ve = _a[_i];
                        ve.param.z = this.zIndex1;
                        this.mamesh0.addVertex(ve);
                    }
                    this.mamesh0.smallestSquares = this.mamesh0.smallestSquares.concat(this.mamesh1.smallestSquares);
                    this.mamesh0.smallestTriangles = this.mamesh0.smallestTriangles.concat(this.mamesh1.smallestTriangles);
                }
                this.mamesh0.cutSegmentsDico = {};
                this.mamesh0.vertexToPositioning = null;
                this.mamesh0.lines = null;
                if (this.createNewLinks) {
                    for (var _b = 0, _c = this.stickingMap.allKeys(); _b < _c.length; _b++) {
                        var vSource = _c[_b];
                        for (var _d = 0, _e = this.stickingMap.getValue(vSource); _d < _e.length; _d++) {
                            var vReceiver = _e[_d];
                            vSource.setOneLink(vReceiver);
                            vReceiver.setOneLink(vSource);
                        }
                    }
                }
            };
            return Sticker;
        }());
        grateAndGlue.Sticker = Sticker;
    })(grateAndGlue = mathis.grateAndGlue || (mathis.grateAndGlue = {}));
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    function nCanvasInOneLine(n, $containter) {
        var res = [];
        var width = mathis.roundWithGivenPrecision(100 / n, 2) + "%";
        for (var i = 0; i < n; i++) {
            var canvas = document.createElement('canvas');
            canvas.id = "renderCanvas" + i;
            canvas.style.width = width;
            canvas.style.height = "100%";
            canvas.style.backgroundColor = "red";
            $containter.appendChild(canvas);
            res.push(canvas);
        }
        return res;
    }
    mathis.nCanvasInOneLine = nCanvasInOneLine;
    function nDivInOneLine(n, $containter, separatorCSS) {
        var divs = [];
        $containter.style.position = "relative";
        var width = mathis.roundWithGivenPrecision(100 / n, 4);
        for (var i = 0; i < n; i++) {
            var div = document.createElement('div');
            div.id = "divContainer" + i;
            div.style.display = "inline-block";
            div.style.position = "absolute";
            div.style.top = "0";
            div.style.left = (i * width) + "%";
            div.style.width = width + "%";
            div.style.height = "100%";
            if (separatorCSS != null && i > 0)
                div.style.borderLeft = separatorCSS;
            $containter.appendChild(div);
            divs.push(div);
        }
        return divs;
    }
    mathis.nDivInOneLine = nDivInOneLine;
    function nDivContainningCanvasInOneLine(n, $containter, separatorCSS) {
        var canvass = [];
        var divs = [];
        $containter.style.position = "relative";
        var width = mathis.roundWithGivenPrecision(100 / n, 4);
        for (var i = 0; i < n; i++) {
            var div = document.createElement('div');
            div.id = "divContainer" + i;
            div.style.display = "inline-block";
            div.style.position = "absolute";
            div.style.top = "0";
            div.style.left = (i * width) + "%";
            div.style.width = width + "%";
            div.style.height = "100%";
            if (separatorCSS != null && i > 0)
                div.style.borderLeft = separatorCSS;
            $containter.appendChild(div);
            divs.push(div);
            var canvas = document.createElement('canvas');
            canvas.id = "renderCanvas" + i;
            canvas.style.width = "100%";
            canvas.style.height = "100%";
            div.appendChild(canvas);
            canvass.push(canvas);
        }
        return { divs: divs, canvass: canvass };
    }
    mathis.nDivContainningCanvasInOneLine = nDivContainningCanvasInOneLine;
    function legend(heightCSS, $container, bottom, separatorCSS) {
        if (bottom === void 0) { bottom = true; }
        var div = document.createElement('div');
        div.style.display = "inline-block";
        div.style.position = "absolute";
        if (bottom)
            div.style.bottom = "0";
        else
            div.style.top = "0";
        div.style.left = "0";
        div.style.width = "100%";
        div.style.height = heightCSS;
        div.style.zIndex = (parseInt($container.style.zIndex) + 10) + "";
        if (separatorCSS != null)
            div.style.borderTop = separatorCSS;
        $container.appendChild(div);
        return div;
    }
    mathis.legend = legend;
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    function allIntegerValueOfEnume(MyEnum) {
        var res = [];
        for (var prop in MyEnum) {
            if (MyEnum.hasOwnProperty(prop)) {
                var i = parseInt(prop);
                if (!isNaN(i))
                    res.push(i);
            }
        }
        return res;
    }
    mathis.allIntegerValueOfEnume = allIntegerValueOfEnume;
    function allStringValueOfEnume(MyEnum) {
        var res = [];
        for (var prop in MyEnum) {
            if (MyEnum.hasOwnProperty(prop) &&
                (isNaN(parseInt(prop)))) {
                res.push(prop);
            }
        }
        return res;
    }
    mathis.allStringValueOfEnume = allStringValueOfEnume;
    var Logger = (function () {
        function Logger() {
            this.showTrace = false;
            this.alreadyWroteWarning = [];
        }
        Logger.prototype.c = function (message, maxTimesFired) {
            if (maxTimesFired === void 0) { maxTimesFired = 1; }
            if (this.alreadyWroteWarning[message] != null)
                this.alreadyWroteWarning[message]++;
            else
                this.alreadyWroteWarning[message] = 1;
            if (this.alreadyWroteWarning[message] <= maxTimesFired) {
                if (this.showTrace) {
                    var err = new Error();
                    console.log("WARNING", message, '...........................................', err);
                }
                else {
                    console.log("WARNING", message);
                }
            }
        };
        return Logger;
    }());
    mathis.Logger = Logger;
    function roundWithGivenPrecision(value, nbDecimal) {
        value *= Math.pow(10, nbDecimal);
        value = Math.round(value);
        value /= Math.pow(10, nbDecimal);
        return value;
    }
    mathis.roundWithGivenPrecision = roundWithGivenPrecision;
    function applyMixins(derivedCtor, baseCtors) {
        baseCtors.forEach(function (baseCtor) {
            Object.getOwnPropertyNames(baseCtor.prototype).forEach(function (name) {
                if (name !== 'constructor') {
                    derivedCtor.prototype[name] = baseCtor.prototype[name];
                }
            });
        });
    }
    mathis.applyMixins = applyMixins;
    function setCursorByID(id, cursorStyle) {
        var elem;
        if (document.getElementById &&
            (elem = document.getElementById(id))) {
            if (elem.style)
                elem.style.cursor = cursorStyle;
        }
    }
    mathis.setCursorByID = setCursorByID;
    var Bilan = (function () {
        function Bilan() {
            this.millisDuration = 0;
            this.nbTested = 0;
            this.nbOK = 0;
            this.millisDep = performance.now();
        }
        Bilan.prototype.computeTime = function () {
            this.millisDuration = performance.now() - this.millisDep;
        };
        Bilan.prototype.add = function (bilan) {
            bilan.computeTime();
            this.nbTested += bilan.nbTested;
            this.nbOK += bilan.nbOK;
            this.millisDuration += bilan.millisDuration;
        };
        Bilan.prototype.assertTrue = function (ok) {
            this.nbTested++;
            if (ok)
                this.nbOK++;
            else {
                var e = new Error();
                console.log(e.stack);
            }
        };
        Bilan.prototype.toString = function () {
            return 'nbTest:' + this.nbTested + ', nbOK:' + this.nbOK + ', millisDuration:' + this.millisDuration.toFixed(2);
        };
        return Bilan;
    }());
    mathis.Bilan = Bilan;
    function modulo(i, n, centered) {
        if (centered === void 0) { centered = false; }
        if (n < 0)
            throw 'second arg must be positif';
        var res = 0;
        if (i >= 0)
            res = i % n;
        else
            res = n - (-i) % n;
        if (centered && res > n / 2)
            res = res - n;
        if (Math.abs(res - n) < Number.MIN_VALUE * 10)
            res = 0;
        return res;
    }
    mathis.modulo = modulo;
    function shuffle(array) {
        var counter = array.length, temp, index;
        while (counter > 0) {
            index = Math.floor(Math.random() * counter);
            counter--;
            temp = array[counter];
            array[counter] = array[index];
            array[index] = temp;
        }
        return array;
    }
    mathis.shuffle = shuffle;
    var Entry = (function () {
        function Entry(key, value) {
            this.key = key;
            this.value = value;
        }
        return Entry;
    }());
    mathis.Entry = Entry;
    var HashMap = (function () {
        function HashMap(memorizeKeys) {
            if (memorizeKeys === void 0) { memorizeKeys = false; }
            this.values = {};
            this.keys = {};
            this.memorizeKeys = memorizeKeys;
        }
        HashMap.prototype.putValue = function (key, value, nullKeyForbidden) {
            if (nullKeyForbidden === void 0) { nullKeyForbidden = true; }
            if (key == null) {
                if (nullKeyForbidden)
                    throw 'key must be non null';
                else
                    return null;
            }
            this.values[key.hashString] = value;
            if (this.memorizeKeys)
                this.keys[key.hashString] = key;
        };
        HashMap.prototype.removeKey = function (key) {
            delete this.values[key.hashString];
            if (this.memorizeKeys)
                delete this.keys[key.hashString];
        };
        HashMap.prototype.getValue = function (key, nullKeyForbidden) {
            if (nullKeyForbidden === void 0) { nullKeyForbidden = true; }
            if (key == null) {
                if (nullKeyForbidden)
                    throw 'key must be non null';
                else
                    return null;
            }
            return this.values[key.hashString];
        };
        HashMap.prototype.allValues = function () {
            var res = new Array();
            for (var index in this.values)
                res.push(this.values[index]);
            return res;
        };
        HashMap.prototype.allKeys = function () {
            if (!this.memorizeKeys)
                throw 'this hashMap has not memorized keys. Please, put args=true in the constructor';
            var res = new Array();
            for (var index in this.keys)
                res.push(this.keys[index]);
            return res;
        };
        HashMap.prototype.allEntries = function () {
            if (!this.memorizeKeys)
                throw 'this hashMap has not memorized keys. Please, put args=true in the constructor';
            var res = [];
            for (var index in this.keys)
                res.push(new Entry(this.keys[index], this.values[index]));
            return res;
        };
        HashMap.prototype.aRandomValue = function () {
            var keys = Object.keys(this.values);
            return this.values[keys[Math.floor(keys.length * Math.random())]];
        };
        HashMap.prototype.extend = function (otherHashMap) {
            if (!otherHashMap.memorizeKeys)
                throw "cannot extend this  with a HashMap which do not memorize keys";
            for (var _i = 0, _a = otherHashMap.allEntries(); _i < _a.length; _i++) {
                var entry = _a[_i];
                this.putValue(entry.key, entry.value);
            }
        };
        HashMap.prototype.size = function () {
            var res = 0;
            for (var key in this.values)
                res++;
            return res;
        };
        return HashMap;
    }());
    mathis.HashMap = HashMap;
    var StringMap = (function () {
        function StringMap() {
            this.values = {};
        }
        StringMap.prototype.putValue = function (key, value, nullKeyForbidden) {
            if (nullKeyForbidden === void 0) { nullKeyForbidden = true; }
            if (key == null) {
                if (nullKeyForbidden)
                    throw 'key must be non null';
                else
                    return null;
            }
            this.values[key] = value;
        };
        StringMap.prototype.removeKey = function (key) {
            delete this.values[key];
        };
        StringMap.prototype.getValue = function (key, nullKeyForbidden) {
            if (nullKeyForbidden === void 0) { nullKeyForbidden = true; }
            if (key == null) {
                if (nullKeyForbidden)
                    throw 'key must be non null';
                else
                    return null;
            }
            return this.values[key];
        };
        StringMap.prototype.allValues = function () {
            var res = new Array();
            for (var index in this.values)
                res.push(this.values[index]);
            return res;
        };
        StringMap.prototype.allKeys = function () {
            return Object.keys(this.values);
        };
        StringMap.prototype.aRandomValue = function () {
            var keys = Object.keys(this.values);
            return this.values[keys[Math.floor(keys.length * Math.random())]];
        };
        StringMap.prototype.size = function () {
            var res = 0;
            for (var key in this.values)
                res++;
            return res;
        };
        StringMap.prototype.__serialize = function () { return this.values; };
        StringMap.prototype.__load = function (values) { this.values = values; };
        return StringMap;
    }());
    mathis.StringMap = StringMap;
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    var lineModule;
    (function (lineModule) {
        var LineComputer = (function () {
            function LineComputer(mamesh) {
                this.cannotOverwriteExistingLines = true;
                this.startingVertices = null;
                this.restrictLinesToTheseVertices = null;
                this.lookAtBifurcation = true;
                this.mamesh = mamesh;
            }
            LineComputer.prototype.go = function () {
                if (this.mamesh == null)
                    throw ' a null mamesh';
                if (this.mamesh.vertices == null || this.mamesh.vertices.length == 0)
                    throw 'no vertices in this mamesh';
                if (this.mamesh.linesWasMade && this.cannotOverwriteExistingLines)
                    throw 'lines already exist for this mamesh';
                var preres = makeLineCatalogue2(this.mamesh.vertices, this.lookAtBifurcation);
                var res = [];
                if (this.startingVertices != null) {
                    var dicoStarting = new mathis.HashMap();
                    for (var _i = 0, _a = this.startingVertices; _i < _a.length; _i++) {
                        var v = _a[_i];
                        dicoStarting.putValue(v, true);
                    }
                    for (var _b = 0, preres_1 = preres; _b < preres_1.length; _b++) {
                        var line = preres_1[_b];
                        for (var _c = 0, _d = line.vertices; _c < _d.length; _c++) {
                            var vv = _d[_c];
                            if (dicoStarting.getValue(vv) != null) {
                                res.push(line);
                                break;
                            }
                        }
                    }
                }
                else
                    res = preres;
                if (this.restrictLinesToTheseVertices != null) {
                    var cutter = new LinesCuter(res, this.restrictLinesToTheseVertices);
                    res = cutter.go();
                }
                this.mamesh.lines = res;
                return res;
            };
            return LineComputer;
        }());
        lineModule.LineComputer = LineComputer;
        var LinesCuter = (function () {
            function LinesCuter(lines, vertices) {
                this.lines = lines;
                this.vertices = vertices;
            }
            LinesCuter.prototype.go = function () {
                var _this = this;
                this.allPresentVertices = new mathis.HashMap();
                for (var _i = 0, _a = this.vertices; _i < _a.length; _i++) {
                    var v = _a[_i];
                    this.allPresentVertices.putValue(v, true);
                }
                var res = [];
                this.lines.forEach(function (line) {
                    if (!line.isLoop) {
                        var linesAsVertex = _this.cutOneLine(line.vertices);
                        for (var _i = 0, linesAsVertex_1 = linesAsVertex; _i < linesAsVertex_1.length; _i++) {
                            var l = linesAsVertex_1[_i];
                            res.push(new mathis.Line(l, false));
                        }
                    }
                });
                this.lines.forEach(function (li) {
                    if (li.isLoop) {
                        var line = li.vertices;
                        var firstIndexWithHole = -1;
                        for (var i = 0; i < line.length; i++) {
                            if (_this.allPresentVertices.getValue(line[i]) == null) {
                                firstIndexWithHole = i;
                                break;
                            }
                        }
                        if (firstIndexWithHole == -1)
                            res.push(li);
                        else {
                            var shiftedLine = [];
                            for (var j = 0; j < line.length; j++) {
                                shiftedLine.push(line[(j + firstIndexWithHole) % line.length]);
                            }
                            var linesAsVertex = _this.cutOneLine(shiftedLine);
                            for (var _i = 0, linesAsVertex_2 = linesAsVertex; _i < linesAsVertex_2.length; _i++) {
                                var l = linesAsVertex_2[_i];
                                res.push(new mathis.Line(l, false));
                            }
                        }
                    }
                });
                return res;
            };
            LinesCuter.prototype.cutOneLine = function (path) {
                var allLittlePath = [];
                allLittlePath[0] = [];
                var currentPathIndex = -1;
                var previousWasZero = true;
                for (var i = 0; i < path.length; i++) {
                    if (this.allPresentVertices.getValue(path[i]) == true) {
                        if (!previousWasZero)
                            allLittlePath[currentPathIndex].push(path[i]);
                        else {
                            currentPathIndex++;
                            allLittlePath[currentPathIndex] = [];
                            allLittlePath[currentPathIndex].push(path[i]);
                            previousWasZero = false;
                        }
                    }
                    else {
                        previousWasZero = true;
                    }
                }
                var allLittlePathCleaned = [];
                allLittlePath.forEach(function (li) {
                    if (li.length >= 2)
                        allLittlePathCleaned.push(li);
                });
                return allLittlePathCleaned;
            };
            return LinesCuter;
        }());
        lineModule.LinesCuter = LinesCuter;
        function makeLineCatalogue2(graph, lookAtBifurcations) {
            var segmentsAlreadySeen = new mathis.HashMap();
            var lines = [];
            function addOneSegment(isLoop, lineInConstruction, segmentsAlreadySeenInTheBuildLine, hasBifurcate) {
                var last = lineInConstruction[lineInConstruction.length - 1];
                var beforeLast = lineInConstruction[lineInConstruction.length - 2];
                segmentsAlreadySeen.putValue(new mathis.Segment(beforeLast, last), true);
                var opposites = last.getOpposites(beforeLast);
                if (opposites == null) {
                    if (isLoop)
                        throw 'strange : probably, the function makeLineCatalogue2 have as args a non complete graph (call getGroup before)';
                    lines.push(new mathis.Line(lineInConstruction, false));
                }
                else if (opposites.length == 0)
                    throw 'convention: is no opposite, the array opposite must be null, and not empty';
                else if (segmentsAlreadySeenInTheBuildLine.getValue(new mathis.Segment(beforeLast, last)) == true) {
                    lines.push(new mathis.Line(lineInConstruction, false));
                }
                else {
                    segmentsAlreadySeenInTheBuildLine.putValue(new mathis.Segment(beforeLast, last), true);
                    var nbOp = opposites.length;
                    if (!lookAtBifurcations)
                        nbOp = 1;
                    for (var i = 0; i < nbOp; i++) {
                        var opposite = opposites[i];
                        if (opposite == lineInConstruction[0]) {
                            lines.push(new mathis.Line(lineInConstruction, true));
                            segmentsAlreadySeen.putValue(new mathis.Segment(last, lineInConstruction[0]), true);
                        }
                        else {
                            if (i < nbOp - 1) {
                                var copySegmentsAlreadySeenIn = new mathis.HashMap();
                                for (var i_1 = 0; i_1 < lineInConstruction.length - 1; i_1++)
                                    copySegmentsAlreadySeenIn.putValue(new mathis.Segment(lineInConstruction[i_1], lineInConstruction[i_1 + 1]), true);
                                var copyLineInConstruction = lineInConstruction.concat([opposite]);
                                addOneSegment(isLoop, copyLineInConstruction, copySegmentsAlreadySeenIn, true);
                            }
                            else {
                                lineInConstruction.push(opposite);
                                addOneSegment(isLoop, lineInConstruction, segmentsAlreadySeenInTheBuildLine, hasBifurcate);
                            }
                        }
                    }
                }
            }
            graph.forEach(function (vertex) {
                vertex.links.forEach(function (link) {
                    if (link.opposites == null) {
                        if (lookAtBifurcations || segmentsAlreadySeen.getValue(new mathis.Segment(vertex, link.to)) == null) {
                            var lineInConstruction = [vertex, link.to];
                            var segmentAlreadySeenInThisBuildLine = new mathis.HashMap();
                            addOneSegment(false, lineInConstruction, segmentAlreadySeenInThisBuildLine, false);
                        }
                    }
                });
            });
            if (lookAtBifurcations) {
                var lineDico = new mathis.HashMap();
                var straightWithoutRepetitions = [];
                for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
                    var line = lines_1[_i];
                    if (lineDico.getValue(line) == null)
                        straightWithoutRepetitions.push(line);
                    lineDico.putValue(line, true);
                }
                lines = straightWithoutRepetitions;
            }
            graph.forEach(function (cell) {
                cell.links.forEach(function (nei) {
                    if (segmentsAlreadySeen.getValue(new mathis.Segment(cell, nei.to)) == null) {
                        var lineInConstruction = [cell, nei.to];
                        var segmentAlreadySeenInThisBuildLine = new mathis.HashMap();
                        addOneSegment(true, lineInConstruction, segmentAlreadySeenInThisBuildLine, false);
                    }
                });
            });
            return lines;
        }
        lineModule.makeLineCatalogue2 = makeLineCatalogue2;
        var PackSegment = (function (_super) {
            __extends(PackSegment, _super);
            function PackSegment() {
                _super.call(this, true);
            }
            return PackSegment;
        }(mathis.HashMap));
        var CreateAColorIndexRespectingBifurcationsAndSymmetries = (function () {
            function CreateAColorIndexRespectingBifurcationsAndSymmetries(mamesh) {
                this.packSymmetricLines = true;
                this.forSymmetriesUsePositionVersusParam = true;
                this.useConsecutiveIntegerForPackNumber = true;
                this.symmetries = null;
                this.OUT_nbFoundSymmetricLines = 0;
                this.mamesh = mamesh;
            }
            CreateAColorIndexRespectingBifurcationsAndSymmetries.prototype.go = function () {
                if (!this.mamesh.linesWasMade)
                    throw 'no line for this IN_mamesh';
                var res = [];
                var packIndex = 0;
                var segmentToPack = new mathis.HashMap();
                for (var _i = 0, _a = this.mamesh.lines; _i < _a.length; _i++) {
                    var line = _a[_i];
                    var segmentAlreadyCatalogued = [];
                    var segmentNeverCatalogued = [];
                    for (var _b = 0, _c = line.allSegments(); _b < _c.length; _b++) {
                        var segment = _c[_b];
                        if (segmentToPack.getValue(segment) != null)
                            segmentAlreadyCatalogued.push(segment);
                        else
                            segmentNeverCatalogued.push(segment);
                    }
                    if (segmentAlreadyCatalogued.length == 0) {
                        var newPack = new PackSegment();
                        newPack.index = packIndex++;
                        for (var _d = 0, _e = line.allSegments(); _d < _e.length; _d++) {
                            var segment = _e[_d];
                            newPack.putValue(segment, true);
                            segmentToPack.putValue(segment, newPack);
                        }
                    }
                    else {
                        var firstPack = segmentToPack.getValue(segmentAlreadyCatalogued[0]);
                        for (var i = 1; i < segmentAlreadyCatalogued.length; i++)
                            this.segmentAndHisPackJoinNewPack(segmentAlreadyCatalogued[i], firstPack, segmentToPack);
                        for (var _f = 0, segmentNeverCatalogued_1 = segmentNeverCatalogued; _f < segmentNeverCatalogued_1.length; _f++) {
                            var seg = segmentNeverCatalogued_1[_f];
                            firstPack.putValue(seg, true);
                            segmentToPack.putValue(seg, firstPack);
                        }
                    }
                }
                if (this.symmetries != null) {
                    mathis.XYZ.nbDecimalForHash = 1;
                    var symCheck = new mathis.StringMap();
                    for (var i = 0; i < this.mamesh.lines.length; i++) {
                        var line = this.mamesh.lines[i];
                        var hash = line.hashStringUpToSymmetries(this.symmetries, this.forSymmetriesUsePositionVersusParam);
                        var packSegment = symCheck.getValue(hash);
                        if (packSegment == null)
                            symCheck.putValue(hash, segmentToPack.getValue(new mathis.Segment(line.vertices[0], line.vertices[1])));
                        else {
                            this.OUT_nbFoundSymmetricLines++;
                            var otherPackSegment = segmentToPack.getValue(new mathis.Segment(line.vertices[0], line.vertices[1]));
                            if (otherPackSegment.size() == packSegment.size())
                                otherPackSegment.index = packSegment.index;
                        }
                    }
                    mathis.XYZ.nbDecimalForHash = 5;
                }
                for (var i = 0; i < this.mamesh.lines.length; i++) {
                    var line = this.mamesh.lines[i];
                    res[i] = segmentToPack.getValue(new mathis.Segment(line.vertices[0], line.vertices[1])).index;
                }
                if (this.useConsecutiveIntegerForPackNumber && this.packSymmetricLines) {
                    var newRes = [];
                    var maxIndex = mathis.tab.maxIndexOfNumericList(res);
                    var max = res[maxIndex];
                    var decay = 0;
                    for (var a = 0; a <= max; a++) {
                        var aIsFound = false;
                        for (var j = 0; j < res.length; j++) {
                            if (res[j] == a) {
                                newRes[j] = a - decay;
                                aIsFound = true;
                            }
                        }
                        if (!aIsFound)
                            decay++;
                    }
                    res = newRes;
                }
                var res2 = new mathis.HashMap();
                for (var i = 0; i < this.mamesh.lines.length; i++) {
                    res2.putValue(this.mamesh.lines[i], res[i]);
                }
                return res2;
            };
            CreateAColorIndexRespectingBifurcationsAndSymmetries.prototype.segmentAndHisPackJoinNewPack = function (segment, pack, segmentToPack) {
                var oldPack = segmentToPack.getValue(segment);
                for (var _i = 0, _a = oldPack.allKeys(); _i < _a.length; _i++) {
                    var seg = _a[_i];
                    pack.putValue(seg, true);
                    segmentToPack.putValue(seg, pack);
                }
                segmentToPack.putValue(segment, pack);
            };
            return CreateAColorIndexRespectingBifurcationsAndSymmetries;
        }());
        lineModule.CreateAColorIndexRespectingBifurcationsAndSymmetries = CreateAColorIndexRespectingBifurcationsAndSymmetries;
    })(lineModule = mathis.lineModule || (mathis.lineModule = {}));
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    var linkModule;
    (function (linkModule) {
        var SimpleLinkFromPolygonCreator = (function () {
            function SimpleLinkFromPolygonCreator(mamesh) {
                this.mamesh = mamesh;
            }
            SimpleLinkFromPolygonCreator.prototype.goChanging = function () {
                this.mamesh.clearLinksAndLines();
                var alreadyCreatedLinks = new mathis.StringMap();
                for (var _i = 0, _a = this.mamesh.polygons; _i < _a.length; _i++) {
                    var poly = _a[_i];
                    for (var i = 0; i < poly.length; i++) {
                        var segmentId = mathis.Segment.segmentId(poly[i].hashNumber, poly[(i + 1) % poly.length].hashNumber);
                        if (alreadyCreatedLinks.getValue(segmentId) == null) {
                            alreadyCreatedLinks.putValue(segmentId, true);
                            poly[i].setOneLink(poly[(i + 1) % poly.length]);
                            poly[(i + 1) % poly.length].setOneLink(poly[i]);
                        }
                    }
                }
            };
            return SimpleLinkFromPolygonCreator;
        }());
        linkModule.SimpleLinkFromPolygonCreator = SimpleLinkFromPolygonCreator;
        var LinksSorterAndCleanerByAngles = (function () {
            function LinksSorterAndCleanerByAngles(mamesh, normals) {
                this.normals = normals;
                this.suppressLinksAngularlyTooCloseVersusNot = true;
                this.suppressLinksAngularParam = 2 * Math.PI * 0.1;
                this.keepShorterLinksVersusGiveSomePriorityToLinksWithOpposite = true;
                this.mamesh = mamesh;
            }
            LinksSorterAndCleanerByAngles.prototype.goChanging = function () {
                var _this = this;
                if (this.mamesh == null)
                    throw 'mamesh is null';
                if (this.normals == null)
                    this.vertexToPositioning = new mathis.mameshAroundComputations.PositioningComputerForMameshVertices(this.mamesh).go();
                else if (this.normals instanceof mathis.HashMap)
                    this.vertexToPositioning = this.normals;
                else if (this.normals instanceof mathis.XYZ) {
                    this.vertexToPositioning = new mathis.HashMap();
                    var positioning = new mathis.Positioning();
                    positioning.upVector = this.normals;
                    for (var _i = 0, _a = this.mamesh.vertices; _i < _a.length; _i++) {
                        var vertex = _a[_i];
                        this.vertexToPositioning.putValue(vertex, positioning);
                    }
                }
                this.mamesh.vertices.forEach(function (center) {
                    var vectorLinks = [];
                    for (var i = 0; i < center.links.length; i++) {
                        vectorLinks[i] = new mathis.XYZ(0, 0, 0).copyFrom(center.links[i].to.position).substract(center.position);
                        if (vectorLinks[i].length() < mathis.geo.epsilon)
                            throw 'a IN_mamesh with two voisins at the same position';
                    }
                    var angles = [];
                    angles.push({
                        angle: 0,
                        i: 0
                    });
                    var normal = _this.vertexToPositioning.getValue(center).upVector;
                    for (var i = 1; i < center.links.length; i++) {
                        angles.push({
                            angle: mathis.geo.angleBetweenTwoVectorsBetweenMinusPiAndPi(vectorLinks[0], vectorLinks[i], normal),
                            i: i
                        });
                    }
                    angles.sort(function (a, b) { return a.angle - b.angle; });
                    var newLinks = [];
                    for (var k = 0; k < angles.length; k++) {
                        newLinks.push(center.links[angles[k].i]);
                    }
                    center.links = newLinks;
                });
                if (this.suppressLinksAngularlyTooCloseVersusNot)
                    this.letsSuppressLinks();
            };
            LinksSorterAndCleanerByAngles.prototype.letsSuppressLinks = function () {
                for (var _i = 0, _a = this.mamesh.vertices; _i < _a.length; _i++) {
                    var center = _a[_i];
                    var currentIndex = 0;
                    var oneMoreTime = true;
                    while (oneMoreTime && center.links.length >= 2) {
                        oneMoreTime = false;
                        for (var k = currentIndex; k < currentIndex + center.links.length; k++) {
                            var i = k % center.links.length;
                            var ii = (k + 1) % center.links.length;
                            var vecti = mathis.XYZ.newFrom(center.links[i].to.position).substract(center.position);
                            var vectii = mathis.XYZ.newFrom(center.links[ii].to.position).substract(center.position);
                            var angle = mathis.geo.angleBetweenTwoVectorsBetween0andPi(vecti, vectii);
                            if (angle < this.suppressLinksAngularParam) {
                                var disti = mathis.geo.distance(center.position, center.links[i].to.position);
                                var distii = mathis.geo.distance(center.position, center.links[ii].to.position);
                                var linkToSuppress = void 0;
                                if (this.keepShorterLinksVersusGiveSomePriorityToLinksWithOpposite) {
                                    if (disti < distii)
                                        linkToSuppress = center.links[ii];
                                    else
                                        linkToSuppress = center.links[i];
                                }
                                else {
                                    var ratio = disti / (disti + distii);
                                    if (ratio < 0.6 && ratio > 0.4) {
                                        if (center.links[ii].opposites == null && center.links[i].opposites != null)
                                            linkToSuppress = center.links[ii];
                                        else
                                            linkToSuppress = center.links[i];
                                    }
                                    else {
                                        if (disti < distii)
                                            linkToSuppress = center.links[ii];
                                        else
                                            linkToSuppress = center.links[i];
                                    }
                                }
                                mathis.Vertex.separateTwoVoisins(center, linkToSuppress.to);
                                oneMoreTime = true;
                                currentIndex = (ii + 1);
                                break;
                            }
                        }
                    }
                }
            };
            return LinksSorterAndCleanerByAngles;
        }());
        linkModule.LinksSorterAndCleanerByAngles = LinksSorterAndCleanerByAngles;
        var OppositeLinkAssocierByAngles = (function () {
            function OppositeLinkAssocierByAngles(vertices) {
                this.maxAngleToAssociateLinks = Math.PI * 0.3;
                this.clearAllExistingOppositeBefore = false;
                this.canCreateBifurcations = true;
                this.doNotBranchOnBorder = false;
                this.OUT_nbBranching = 0;
                this.vertices = vertices;
            }
            OppositeLinkAssocierByAngles.prototype.associateOppositeLinks = function () {
                var _this = this;
                var verticeCoupleToSeparateAtTheEnd = [];
                this.vertices.forEach(function (center) {
                    var valence = 0;
                    for (var _i = 0, _a = center.links; _i < _a.length; _i++) {
                        var li = _a[_i];
                        if (li.opposites == null)
                            valence++;
                    }
                    var vectorLinks = [];
                    for (var i = 0; i < center.links.length; i++) {
                        vectorLinks[i] = new mathis.XYZ(0, 0, 0).copyFrom(center.links[i].to.position).substract(center.position);
                        if (vectorLinks[i].lengthSquared() < mathis.geo.epsilonSquare)
                            throw 'the IN_mamesh has two voisins at the same position';
                    }
                    var allAngleBetweenLinks = [];
                    var bestAngle = [];
                    for (var i = 0; i < center.links.length; i++) {
                        bestAngle[i] = Number.POSITIVE_INFINITY;
                        for (var j = i + 1; j < center.links.length; j++) {
                            var angle = Math.abs(mathis.modulo(mathis.geo.angleBetweenTwoVectorsBetween0andPi(vectorLinks[i], vectorLinks[j]) - Math.PI, Math.PI * 2, true));
                            if (angle < _this.maxAngleToAssociateLinks && (center.links[i].opposites == null && center.links[j].opposites == null)) {
                                if (angle < bestAngle[i])
                                    bestAngle[i] = angle;
                                allAngleBetweenLinks.push({
                                    angle: angle,
                                    i: i,
                                    j: j
                                });
                            }
                        }
                    }
                    allAngleBetweenLinks.sort(function (a, b) { return b.angle - a.angle; });
                    if (!_this.canCreateBifurcations || (_this.doNotBranchOnBorder && center.hasMark(mathis.Vertex.Markers.border))) {
                        while (allAngleBetweenLinks.length > 0) {
                            var elem = allAngleBetweenLinks.pop();
                            var link0 = center.links[elem.i];
                            var link1 = center.links[elem.j];
                            link0.opposites = [link1];
                            link1.opposites = [link0];
                            allAngleBetweenLinks = mathis.tab.arrayMinusElements(allAngleBetweenLinks, function (el) {
                                return el.i == elem.i || el.j == elem.i || el.i == elem.j || el.j == elem.j;
                            });
                        }
                    }
                    else {
                        while (allAngleBetweenLinks.length > 0) {
                            var elem = allAngleBetweenLinks.pop();
                            var nextElem = allAngleBetweenLinks[allAngleBetweenLinks.length - 1];
                            var link0 = void 0;
                            var link1 = void 0;
                            var link2 = void 0;
                            if (valence == 3 && nextElem != null) {
                                if (elem.i == nextElem.i) {
                                    link0 = center.links[elem.i];
                                    link1 = center.links[elem.j];
                                    link2 = center.links[nextElem.j];
                                }
                                else if (elem.i == nextElem.j) {
                                    link0 = center.links[elem.i];
                                    link1 = center.links[elem.j];
                                    link2 = center.links[nextElem.i];
                                }
                                else if (elem.j == nextElem.i) {
                                    link0 = center.links[elem.j];
                                    link1 = center.links[elem.i];
                                    link2 = center.links[nextElem.j];
                                }
                                else if (elem.j == nextElem.j) {
                                    link0 = center.links[elem.j];
                                    link1 = center.links[elem.i];
                                    link2 = center.links[nextElem.i];
                                }
                                else {
                                    link0 = center.links[elem.i];
                                    link1 = center.links[elem.j];
                                }
                            }
                            else {
                                link0 = center.links[elem.i];
                                link1 = center.links[elem.j];
                            }
                            if (link2 == null) {
                                link0.opposites = [link1];
                                link1.opposites = [link0];
                                allAngleBetweenLinks = mathis.tab.arrayMinusElements(allAngleBetweenLinks, function (el) {
                                    return el.i == elem.i || el.j == elem.i || el.i == elem.j || el.j == elem.j;
                                });
                                valence -= 2;
                            }
                            else {
                                _this.OUT_nbBranching++;
                                allAngleBetweenLinks.pop();
                                link0.opposites = [link1, link2];
                                link1.opposites = [link0];
                                link2.opposites = [link0];
                                valence -= 1;
                                allAngleBetweenLinks = mathis.tab.arrayMinusElements(allAngleBetweenLinks, function (el) {
                                    return el.i == elem.i || el.j == elem.i || el.i == elem.j || el.j == elem.j || el.i == nextElem.i || el.j == nextElem.i || el.i == nextElem.j || el.j == nextElem.j;
                                });
                            }
                        }
                    }
                });
            };
            OppositeLinkAssocierByAngles.prototype.goChanging = function () {
                if (this.clearAllExistingOppositeBefore) {
                    this.vertices.forEach(function (v) {
                        v.links.forEach(function (li) {
                            li.opposites = null;
                        });
                    });
                }
                if (this.maxAngleToAssociateLinks != null)
                    this.associateOppositeLinks();
            };
            return OppositeLinkAssocierByAngles;
        }());
        linkModule.OppositeLinkAssocierByAngles = OppositeLinkAssocierByAngles;
        var LinkCreaterSorterAndBorderDetecterByPolygons = (function () {
            function LinkCreaterSorterAndBorderDetecterByPolygons(mamesh) {
                this.interiorTJonction = new mathis.HashMap();
                this.borderTJonction = new mathis.HashMap();
                this.forcedOpposite = new mathis.HashMap();
                this.polygonesAroundEachVertex = new mathis.HashMap();
                this.polygones = [];
                this.markIsolateVertexAsCorner = true;
                this.markBorder = true;
                this.forceOppositeLinksAtCorners = false;
                this.mamesh = mamesh;
            }
            LinkCreaterSorterAndBorderDetecterByPolygons.prototype.goChanging = function () {
                this.checkArgs();
                this.createPolygonesFromSmallestTrianglesAnSquares();
                this.detectBorder();
                this.createLinksTurningAround();
                this.makeLinksFinaly();
            };
            LinkCreaterSorterAndBorderDetecterByPolygons.prototype.checkArgs = function () {
                if ((this.mamesh.smallestSquares == null || this.mamesh.smallestSquares.length == 0) && (this.mamesh.smallestTriangles == null || this.mamesh.smallestTriangles.length == 0))
                    throw 'no triangles nor squares given';
                this.mamesh.clearLinksAndLines();
            };
            LinkCreaterSorterAndBorderDetecterByPolygons.prototype.createPolygonesFromSmallestTrianglesAnSquares = function () {
                var _this = this;
                for (var i = 0; i < this.mamesh.smallestTriangles.length; i += 3) {
                    this.polygones.push(new Polygone([
                        this.mamesh.smallestTriangles[i],
                        this.mamesh.smallestTriangles[i + 1],
                        this.mamesh.smallestTriangles[i + 2],
                    ]));
                }
                for (var i = 0; i < this.mamesh.smallestSquares.length; i += 4) {
                    this.polygones.push(new Polygone([
                        this.mamesh.smallestSquares[i],
                        this.mamesh.smallestSquares[i + 1],
                        this.mamesh.smallestSquares[i + 2],
                        this.mamesh.smallestSquares[i + 3],
                    ]));
                }
                for (var _i = 0, _a = this.polygones; _i < _a.length; _i++) {
                    var polygone = _a[_i];
                    var length_2 = polygone.points.length;
                    for (var i = 0; i < length_2; i++) {
                        var vert1 = polygone.points[i % length_2];
                        var vert2 = polygone.points[(i + 1) % length_2];
                        this.subdivideSegment(polygone, vert1, vert2, this.mamesh.cutSegmentsDico);
                    }
                }
                this.mamesh.vertices.forEach(function (v) {
                    _this.polygonesAroundEachVertex.putValue(v, new Array());
                });
                this.polygones.forEach(function (poly) {
                    poly.points.forEach(function (vert) {
                        _this.polygonesAroundEachVertex.getValue(vert).push(poly);
                    });
                });
                if (this.markIsolateVertexAsCorner) {
                    this.mamesh.vertices.forEach(function (v) {
                        if (_this.polygonesAroundEachVertex.getValue(v).length == 1) {
                            v.markers.push(mathis.Vertex.Markers.corner);
                            mathis.logger.c('new corners was added when we automatically create then links from the triangulatedRect/square');
                        }
                    });
                }
            };
            LinkCreaterSorterAndBorderDetecterByPolygons.prototype.detectBorder = function () {
                var _this = this;
                for (var ind = 0; ind < this.mamesh.vertices.length; ind++) {
                    var center = this.mamesh.vertices[ind];
                    var polygonesAround = this.polygonesAroundEachVertex.getValue(center);
                    var segmentMultiplicity = new mathis.HashMap(true);
                    for (var _i = 0, polygonesAround_1 = polygonesAround; _i < polygonesAround_1.length; _i++) {
                        var polygone = polygonesAround_1[_i];
                        var twoAngles = polygone.theTwoAnglesAdjacentFrom(center);
                        var side0id = twoAngles[0];
                        var side1id = twoAngles[1];
                        if (segmentMultiplicity.getValue(side0id) == null)
                            segmentMultiplicity.putValue(side0id, 1);
                        else
                            segmentMultiplicity.putValue(side0id, segmentMultiplicity.getValue(side0id) + 1);
                        if (segmentMultiplicity.getValue(side1id) == null)
                            segmentMultiplicity.putValue(side1id, 1);
                        else
                            segmentMultiplicity.putValue(side1id, segmentMultiplicity.getValue(side1id) + 1);
                    }
                    var count = 0;
                    segmentMultiplicity.allKeys().forEach(function (key) {
                        if (segmentMultiplicity.getValue(key) == 1) {
                            count++;
                            if (_this.borderTJonction.getValue(center) == null) {
                                _this.borderTJonction.putValue(center, new Array());
                                if (_this.markBorder)
                                    center.markers.push(mathis.Vertex.Markers.border);
                            }
                            _this.borderTJonction.getValue(center).push(key);
                        }
                        else if (segmentMultiplicity.getValue(key) > 2)
                            throw " non conform mesh: a link appear strictly more than 2 times as side of polygones turning around a vertex   ";
                    });
                    if (!(count == 0 || count == 2))
                        throw "strange mesh (perhaps too holy): the vertex: " + center.toString(0) + " has:" + count + " link with multiplicity 1";
                }
            };
            LinkCreaterSorterAndBorderDetecterByPolygons.prototype.createLinksTurningAround = function () {
                var _this = this;
                var doIi = function (v, vv) {
                    var cutSegment = _this.mamesh.cutSegmentsDico[mathis.Segment.segmentId(v.hashNumber, vv.hashNumber)];
                    if (cutSegment != null) {
                        if (_this.interiorTJonction.getValue(cutSegment.middle) != null) {
                            console.log('attention, une double interiorTjonction');
                        }
                        else
                            _this.interiorTJonction.putValue(cutSegment.middle, true);
                        _this.forcedOpposite.putValue(cutSegment.middle, [v, vv]);
                    }
                };
                for (var _i = 0, _a = this.polygones; _i < _a.length; _i++) {
                    var polygone = _a[_i];
                    var length_3 = polygone.points.length;
                    if (length_3 > 3) {
                        if (length_3 == 4) {
                            doIi(polygone.points[0], polygone.points[2]);
                            doIi(polygone.points[1], polygone.points[3]);
                        }
                        else {
                            for (var i = 0; i < length_3; i++) {
                                var v = polygone.points[i];
                                var vv = polygone.points[(i + 2) % length_3];
                                doIi(v, vv);
                            }
                        }
                    }
                }
                this.mamesh.vertices.forEach(function (central) {
                    var polygonesAround = _this.polygonesAroundEachVertex.getValue(central);
                    if (_this.borderTJonction.getValue(central) != null && _this.interiorTJonction.getValue(central) != null)
                        throw 'a vertex cannot be a interior and border T-jonction';
                    if (_this.borderTJonction.getValue(central) == null) {
                        var poly0 = polygonesAround[0];
                        if (poly0 == null)
                            mathis.logger.c('some vertex was not around a square/triangulatedRect');
                        else
                            _this.createLinksTurningFromOnePolygone(central, poly0, polygonesAround, false);
                    }
                    else {
                        var poly = _this.findAPolygoneWithOrientedEdge(central, _this.borderTJonction.getValue(central)[0], polygonesAround);
                        if (poly == null)
                            poly = _this.findAPolygoneWithOrientedEdge(central, _this.borderTJonction.getValue(central)[1], polygonesAround);
                        _this.createLinksTurningFromOnePolygone(central, poly, polygonesAround, true);
                    }
                });
            };
            LinkCreaterSorterAndBorderDetecterByPolygons.prototype.makeLinksFinaly = function () {
                var _this = this;
                this.mamesh.vertices.forEach(function (vertex) {
                    if (_this.forceOppositeLinksAtCorners || !vertex.hasMark(mathis.Vertex.Markers.corner)) {
                        var length_4 = vertex.links.length;
                        if (_this.borderTJonction.getValue(vertex) != null) {
                            var nei1 = vertex.links[0];
                            var nei2 = vertex.links[length_4 - 1];
                            nei1.opposites = [nei2];
                            nei2.opposites = [nei1];
                        }
                        else {
                            if (length_4 % 2 == 0) {
                                for (var i = 0; i < length_4; i++) {
                                    var nei1 = vertex.links[i];
                                    var nei2 = vertex.links[(i + length_4 / 2) % length_4];
                                    nei1.opposites = [nei2];
                                    nei2.opposites = [nei1];
                                }
                            }
                            if (_this.forcedOpposite.getValue(vertex) != null) {
                                var voi0 = _this.forcedOpposite.getValue(vertex)[0];
                                var voi1 = _this.forcedOpposite.getValue(vertex)[1];
                                vertex.changeToLinkWithoutOpposite(voi0);
                                vertex.changeToLinkWithoutOpposite(voi1);
                                vertex.setTwoOppositeLinks(voi0, voi1);
                            }
                        }
                    }
                });
            };
            LinkCreaterSorterAndBorderDetecterByPolygons.prototype.findAPolygoneWithOrientedEdge = function (vertDeb, vertFin, aList) {
                for (var _i = 0, aList_1 = aList; _i < aList_1.length; _i++) {
                    var polygone = aList_1[_i];
                    var length_5 = polygone.points.length;
                    for (var i = 0; i < length_5; i++) {
                        if (polygone.points[i % length_5].hashNumber == vertDeb.hashNumber && polygone.points[(i + 1) % length_5].hashNumber == vertFin.hashNumber)
                            return polygone;
                    }
                }
                return null;
            };
            LinkCreaterSorterAndBorderDetecterByPolygons.prototype.findAPolygoneWithThisEdge = function (vert1, vert2, aList) {
                for (var _i = 0, aList_2 = aList; _i < aList_2.length; _i++) {
                    var polygone = aList_2[_i];
                    var length_6 = polygone.points.length;
                    for (var i = 0; i < length_6; i++) {
                        var id = mathis.Segment.segmentId(polygone.points[i % length_6].hashNumber, polygone.points[(i + 1) % length_6].hashNumber);
                        var idBis = mathis.Segment.segmentId(vert1.hashNumber, vert2.hashNumber);
                        if (id == idBis)
                            return polygone;
                    }
                }
                return null;
            };
            LinkCreaterSorterAndBorderDetecterByPolygons.prototype.createLinksTurningFromOnePolygone = function (central, poly0, polygonesAround, isBorder) {
                var currentAngle = poly0.theOutgoingAnglesAdjacentFrom(central);
                var currentPolygone = poly0;
                var allIsWellOriented = true;
                while (polygonesAround.length > 0) {
                    central.links.push(new mathis.Link(currentAngle));
                    if (allIsWellOriented)
                        currentAngle = currentPolygone.theIngoingAnglesAdjacentFrom(central);
                    else {
                        var angles = currentPolygone.theTwoAnglesAdjacentFrom(central);
                        if (angles[0].hashNumber == currentAngle.hashNumber)
                            currentAngle = angles[1];
                        else
                            currentAngle = angles[0];
                    }
                    mathis.tab.removeFromArray(polygonesAround, currentPolygone);
                    currentPolygone = this.findAPolygoneWithOrientedEdge(central, currentAngle, polygonesAround);
                    if (currentPolygone == null) {
                        currentPolygone = this.findAPolygoneWithOrientedEdge(currentAngle, central, polygonesAround);
                        allIsWellOriented = false;
                    }
                }
                if (isBorder) {
                    central.links.push(new mathis.Link(currentAngle));
                }
            };
            LinkCreaterSorterAndBorderDetecterByPolygons.prototype.subdivideSegment = function (polygone, vertex1, vertex2, cutSegmentDico) {
                var segment = cutSegmentDico[mathis.Segment.segmentId(vertex1.hashNumber, vertex2.hashNumber)];
                if (segment != null) {
                    var index1 = polygone.points.indexOf(vertex1);
                    var index2 = polygone.points.indexOf(vertex2);
                    var minIndex = Math.min(index1, index2);
                    var maxIndex = Math.max(index1, index2);
                    if (maxIndex == polygone.points.length - 1 && minIndex == 0)
                        polygone.points.splice(length, 0, segment.middle);
                    else
                        polygone.points.splice(minIndex + 1, 0, segment.middle);
                    this.subdivideSegment(polygone, vertex1, segment.middle, cutSegmentDico);
                    this.subdivideSegment(polygone, vertex2, segment.middle, cutSegmentDico);
                }
            };
            return LinkCreaterSorterAndBorderDetecterByPolygons;
        }());
        linkModule.LinkCreaterSorterAndBorderDetecterByPolygons = LinkCreaterSorterAndBorderDetecterByPolygons;
        var Polygone = (function () {
            function Polygone(points) {
                this.points = points;
            }
            Polygone.prototype.hasAngle = function (point) {
                for (var _i = 0, _a = this.points; _i < _a.length; _i++) {
                    var vert = _a[_i];
                    if (vert.hashNumber == point.hashNumber)
                        return true;
                }
                return false;
            };
            Polygone.prototype.theOutgoingAnglesAdjacentFrom = function (point) {
                var length = this.points.length;
                for (var i = 0; i < length; i++) {
                    if (this.points[i] == point) {
                        return this.points[(i + 1) % length];
                    }
                }
                throw 'we do not find the point in this polygone';
            };
            Polygone.prototype.theIngoingAnglesAdjacentFrom = function (point) {
                var length = this.points.length;
                for (var i = 0; i < length; i++) {
                    if (this.points[i] == point) {
                        return this.points[(i - 1 + length) % length];
                    }
                }
                throw 'we do not find the point in this polygone';
            };
            Polygone.prototype.theTwoAnglesAdjacentFrom = function (point) {
                var length = this.points.length;
                for (var i = 0; i < length; i++) {
                    if (this.points[i] == point) {
                        return [this.points[(i - 1 + length) % length], this.points[(i + 1) % length]];
                    }
                }
                throw 'we do not find the point in this polygone';
            };
            Polygone.prototype.toString = function () {
                var res = "[";
                for (var _i = 0, _a = this.points; _i < _a.length; _i++) {
                    var vertex = _a[_i];
                    res += vertex.hashNumber + ',';
                }
                return res + "]";
            };
            return Polygone;
        }());
        linkModule.Polygone = Polygone;
    })(linkModule = mathis.linkModule || (mathis.linkModule = {}));
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    var macamera;
    (function (macamera) {
        var Tools = BABYLON.Tools;
        var Collider = BABYLON.Collider;
        var GrabberCamera = (function (_super) {
            __extends(GrabberCamera, _super);
            function GrabberCamera(mathisFrame, grabber) {
                _super.call(this, name, new BABYLON.Vector3(0, 0, -10), mathisFrame.scene);
                this.translationSpeed = 1;
                this.checkCollisions = false;
                this.showPredefinedConsoleLog = false;
                this.grabbers = [];
                this.useOnlyFreeMode = false;
                this.useFreeModeWhenCursorOutOfGrabber = true;
                this.onGrabberChange = null;
                this.onTranslate = null;
                this.tooSmallAngle = 0.001;
                this.tooBigAngle = 0.3;
                this.cumulatedAngle = 0;
                this.relativeCursorPositionOnGrabber = new mathis.XYZ(0, 0, 0);
                this.cursorPositionOnGrabberOld = new mathis.XYZ(0, 0, 0);
                this.angleOfRotationAroundGrabber = 0;
                this.axeOfRotationAroundGrabber = new mathis.XYZ(0, 0, 0);
                this.camDir = new mathis.XYZ(0, 0, 0);
                this.oldCamDir = new mathis.XYZ(0, 0, 0);
                this.angleForCamRot = 0;
                this.axisForCamRot = new mathis.XYZ(0, 0, 0);
                this.myNullVector = new mathis.XYZ(123, 234, 345);
                this.frozonProjectionMatrix = new mathis.MM();
                this.frozonViewMatrix = new mathis.MM();
                this.pickingRay = { origin: new mathis.XYZ(0, 0, 0), direction: new mathis.XYZ(0, 0, 0) };
                this.aPartOfTheFrontDir = new mathis.XYZ(0, 0, 0);
                this.whishedCamPos = new WishedPositioning(this);
                this.trueCamPos = new CamPositioning(this);
                this._paralDisplacement = new mathis.XYZ(0, 0, 0);
                this._matrixRotationAroundCam = new mathis.MM();
                this._matrixRotationAroundZero = new mathis.MM();
                this.camRelativePos = new mathis.XYZ(0, 0, 0);
                this._collider = new Collider();
                this.correctionToRecenter = new mathis.XYZ(0, 0, 0);
                this._deltaPosition = new mathis.XYZ(0, 0, 0);
                this._popo = new mathis.XYZ(0, 0, 0);
                this._babylonRay = new BABYLON.Ray(new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(0, 0, 1));
                this.pointerIsOnCurrentGrabber = false;
                this._tempCN = new mathis.XYZ(0, 0, 0);
                this._end = new mathis.XYZ(0, 0, 0);
                this.pointerIsDown = false;
                this._lookForTheBestGrabber = true;
                this._target = mathis.XYZ.newZero();
                this.viewMM = new mathis.MM();
                this._keys = [];
                this.keysUp = [38];
                this.keysDown = [40];
                this.keysLeft = [37];
                this.keysRight = [39];
                this.keysFrontward = [];
                this.keysBackward = [];
                this._axeForKeyRotation = new mathis.XYZ(0, 0, 0);
                this._additionnalVec = new mathis.XYZ(0, 0, 0);
                this.wheelPrecision = 1.0;
                this.eventPrefix = Tools.GetPointerPrefix();
                this.scene = mathisFrame.scene;
                mathis.geo.copyXYZ(this.myNullVector, this.cursorPositionOnGrabberOld);
                mathis.geo.copyXYZ(this.myNullVector, this.oldCamDir);
                this.$canvasElement = mathisFrame.canvas;
                this.toogleIconCursor('cursorDefault');
                this.replaceTheFirstGrabber(grabber);
                this.attachControl(mathisFrame.canvas);
            }
            GrabberCamera.prototype.changePosition = function (position, smoothMovement) {
                if (smoothMovement === void 0) { smoothMovement = true; }
                this.whishedCamPos.changePosition(position);
                if (!smoothMovement) {
                    this.trueCamPos.position = position;
                }
            };
            GrabberCamera.prototype.changeFrontDir = function (position, smoothMovement) {
                if (smoothMovement === void 0) { smoothMovement = true; }
                this.whishedCamPos.changeFrontDir(position);
                if (!smoothMovement) {
                    this.trueCamPos.changeFrontDir(position);
                }
            };
            GrabberCamera.prototype.changeUpVector = function (position, smoothMovement) {
                if (smoothMovement === void 0) { smoothMovement = true; }
                this.whishedCamPos.changeUpVector(position);
                if (!smoothMovement) {
                    this.trueCamPos.changeUpVector(position);
                }
            };
            GrabberCamera.prototype.addGrabber = function (grabber) {
                grabber.checkArgs();
                this.grabbers.push(grabber);
            };
            GrabberCamera.prototype.replaceTheFirstGrabber = function (grabber) {
                if (this.grabbers[0] != null)
                    this.grabbers[0].dispose();
                grabber.checkArgs();
                grabber.grabberCamera = this;
                this.grabbers[0] = grabber;
                this.currentGrabber = this.grabbers[0];
            };
            GrabberCamera.prototype.freeRotation = function () {
                if (this.showPredefinedConsoleLog)
                    console.log('free rotation angle', this.angleForCamRot.toFixed(4));
                this.rotate(this.axisForCamRot, this.angleForCamRot);
                this.toogleIconCursor("cursorMove");
            };
            GrabberCamera.prototype.grabberMovement = function () {
                if (this.currentGrabber.parallelDisplacementInsteadOfRotation) {
                    this._paralDisplacement.copyFrom(this.relativeCursorPositionOnGrabber).substract(this.cursorPositionOnGrabberOld).scale(-1);
                    this._paralDisplacement.add(this.whishedCamPos.getPosition());
                    this.whishedCamPos.changePosition(this._paralDisplacement);
                }
                else {
                    if (this.showPredefinedConsoleLog)
                        console.log('grabber rotation angle', this.angleOfRotationAroundGrabber.toFixed(4));
                    this.rotateAroundCenter(this.axeOfRotationAroundGrabber, this.angleOfRotationAroundGrabber, this.currentGrabber.referenceCenter);
                }
                this.toogleIconCursor("cursorGrabbing");
                if (this.currentGrabber.showGrabberOnlyWhenGrabbing)
                    this.currentGrabber.mesh.visibility = 1;
            };
            GrabberCamera.prototype.mixedRotation = function (alpha) {
                if (this.showPredefinedConsoleLog)
                    console.log('free rotation angle', this.angleForCamRot.toFixed(4), 'grabber rotation angle', this.angleOfRotationAroundGrabber.toFixed(4));
                this.twoRotations(this.axisForCamRot, this.angleForCamRot, this.axeOfRotationAroundGrabber, this.angleOfRotationAroundGrabber, alpha);
                this.toogleIconCursor("cursorGrabbing");
                if (this.currentGrabber.showGrabberOnlyWhenGrabbing)
                    this.currentGrabber.mesh.visibility = 1;
            };
            GrabberCamera.prototype.rotate = function (axis, angle) {
                mathis.geo.axisAngleToMatrix(axis, angle, this._matrixRotationAroundCam);
                mathis.geo.multiplicationMatrixVector(this._matrixRotationAroundCam, this.whishedCamPos.frontDir, this.whishedCamPos.frontDir);
                mathis.geo.multiplicationMatrixVector(this._matrixRotationAroundCam, this.whishedCamPos.upVector, this.whishedCamPos.upVector);
            };
            GrabberCamera.prototype.rotateAroundCenter = function (axis, angle, center) {
                if (this.currentGrabber.referenceCenter == null)
                    return;
                mathis.geo.axisAngleToMatrix(axis, angle, this._matrixRotationAroundZero);
                mathis.geo.multiplicationMatrixVector(this._matrixRotationAroundZero, this.whishedCamPos.frontDir, this.whishedCamPos.frontDir);
                mathis.geo.multiplicationMatrixVector(this._matrixRotationAroundZero, this.whishedCamPos.upVector, this.whishedCamPos.upVector);
                this.camRelativePos.copyFrom(this.whishedCamPos.getPosition()).substract(center);
                mathis.geo.multiplicationMatrixVector(this._matrixRotationAroundZero, this.camRelativePos, this.camRelativePos);
                this.camRelativePos.add(center);
                this.whishedCamPos.changePosition(this.camRelativePos);
            };
            GrabberCamera.prototype.twoRotations = function (axeOfRotationAroundCam, angleBetweenRays, axeOfRotationAroundZero, angleOfRotationAroundZero, alpha) {
                this.rotate(axeOfRotationAroundCam, angleBetweenRays * (1 - alpha));
                this.rotateAroundCenter(axeOfRotationAroundZero, angleOfRotationAroundZero * alpha, this.currentGrabber.referenceCenter);
            };
            GrabberCamera.prototype.translateCam = function (delta) {
                var impultion = delta * this.translationSpeed;
                if (delta < 0 && this.currentGrabber.focusOnMyCenterWhenCameraGoDownWard && this.currentGrabber.referenceCenter != null) {
                    var alpha = Math.min(1, mathis.geo.distance(this.whishedCamPos.getPosition(), this.currentGrabber.referenceCenter) / this.currentGrabber.endOfZone3);
                    alpha = alpha * alpha * 0.1;
                    mathis.geo.scale(this.whishedCamPos.frontDir, 1 - alpha, this.aPartOfTheFrontDir);
                    mathis.geo.substract(this.currentGrabber.referenceCenter, this.whishedCamPos.getPosition(), this.correctionToRecenter);
                    if (this.correctionToRecenter.lengthSquared() > mathis.geo.epsilon) {
                        mathis.geo.normalize(this.correctionToRecenter, this.correctionToRecenter);
                        mathis.geo.scale(this.correctionToRecenter, alpha, this.correctionToRecenter);
                        mathis.geo.add(this.correctionToRecenter, this.aPartOfTheFrontDir, this.aPartOfTheFrontDir);
                    }
                    this.whishedCamPos.changeFrontDir(this.aPartOfTheFrontDir);
                }
                if (impultion != 0) {
                    mathis.geo.scale(this.whishedCamPos.frontDir, impultion, this._deltaPosition);
                    mathis.geo.add(this.whishedCamPos.getPosition(), this._deltaPosition, this._popo);
                    this.whishedCamPos.changePosition(this._popo);
                    if (this.onTranslate != null)
                        this.onTranslate();
                }
            };
            GrabberCamera.prototype.onPointerMove = function (actualPointerX, actualPointerY) {
                if (!this.pointerIsDown)
                    return;
                var grabberRotationOK = true;
                var freeRotationOK = true;
                this.createPickingRayWithFrozenCamera(actualPointerX, actualPointerY, this.currentGrabber.mesh.getWorldMatrix(), this.frozonViewMatrix, this.frozonProjectionMatrix, this.pickingRay);
                mathis.geo.copyXYZ(this.pickingRay.direction, this.camDir);
                this._babylonRay.direction = this.pickingRay.direction;
                this._babylonRay.origin = this.pickingRay.origin;
                var pickInfo = this.currentGrabber.mesh.intersects(this._babylonRay, false);
                this.pointerIsOnCurrentGrabber = pickInfo.hit;
                var distToGrabbed = pickInfo.distance;
                if (this.pointerIsOnCurrentGrabber) {
                    this.relativeCursorPositionOnGrabber.x = pickInfo.pickedPoint.x;
                    this.relativeCursorPositionOnGrabber.y = pickInfo.pickedPoint.y;
                    this.relativeCursorPositionOnGrabber.z = pickInfo.pickedPoint.z;
                }
                if (this.currentGrabber.referenceCenter != null)
                    this.relativeCursorPositionOnGrabber.substract(this.currentGrabber.referenceCenter);
                var alpha = this.currentGrabber.interpolationCoefAccordingToCamPosition(this.trueCamPos.position, distToGrabbed);
                if (this.showPredefinedConsoleLog)
                    console.log('alpha', alpha);
                if (mathis.geo.xyzEquality(this.oldCamDir, this.myNullVector)) {
                    mathis.geo.copyXYZ(this.camDir, this.oldCamDir);
                    freeRotationOK = false;
                }
                if (mathis.geo.xyzEquality(this.cursorPositionOnGrabberOld, this.myNullVector)) {
                    if (this.pointerIsOnCurrentGrabber) {
                        mathis.geo.copyXYZ(this.relativeCursorPositionOnGrabber, this.cursorPositionOnGrabberOld);
                    }
                    grabberRotationOK = false;
                }
                else if (!this.pointerIsOnCurrentGrabber) {
                    mathis.geo.copyXYZ(this.myNullVector, this.cursorPositionOnGrabberOld);
                    grabberRotationOK = false;
                }
                if (freeRotationOK) {
                    this.angleForCamRot = mathis.geo.angleBetweenTwoVectorsBetween0andPi(this.camDir, this.oldCamDir);
                    if (this.angleForCamRot > this.tooSmallAngle) {
                        mathis.geo.cross(this.camDir, this.oldCamDir, this.axisForCamRot);
                        mathis.geo.normalize(this.axisForCamRot, this.axisForCamRot);
                    }
                    else
                        freeRotationOK = false;
                }
                if (grabberRotationOK) {
                    this.angleOfRotationAroundGrabber = mathis.geo.angleBetweenTwoVectorsBetween0andPi(this.relativeCursorPositionOnGrabber, this.cursorPositionOnGrabberOld);
                    if (this.angleOfRotationAroundGrabber > this.tooSmallAngle) {
                        mathis.geo.cross(this.relativeCursorPositionOnGrabber, this.cursorPositionOnGrabberOld, this.axeOfRotationAroundGrabber);
                        this.axeOfRotationAroundGrabber.normalize();
                    }
                    else
                        grabberRotationOK = false;
                }
                if (grabberRotationOK && this.angleOfRotationAroundGrabber > this.tooBigAngle) {
                    console.log('a too big angle around zero : ignored' + this.angleOfRotationAroundGrabber.toFixed(4));
                    mathis.geo.copyXYZ(this.relativeCursorPositionOnGrabber, this.cursorPositionOnGrabberOld);
                    return;
                }
                if (this.useOnlyFreeMode && freeRotationOK)
                    this.freeRotation();
                else if (this.pointerIsOnCurrentGrabber) {
                    if (alpha == 0) {
                        if (freeRotationOK)
                            this.freeRotation();
                    }
                    else if (alpha < 1 && alpha > 0) {
                        if (freeRotationOK && grabberRotationOK) {
                            this.mixedRotation(alpha);
                        }
                        else if (grabberRotationOK)
                            this.grabberMovement();
                    }
                    else if (alpha == 1 && grabberRotationOK)
                        this.grabberMovement();
                }
                else if (this.useFreeModeWhenCursorOutOfGrabber && freeRotationOK)
                    this.freeRotation();
                if (grabberRotationOK)
                    mathis.geo.copyXYZ(this.relativeCursorPositionOnGrabber, this.cursorPositionOnGrabberOld);
                if (freeRotationOK)
                    mathis.geo.copyXYZ(this.camDir, this.oldCamDir);
                if (grabberRotationOK)
                    this.cumulatedAngle += this.angleOfRotationAroundGrabber;
                if (freeRotationOK)
                    this.cumulatedAngle += this.angleForCamRot;
                if (this.cumulatedAngle > Math.PI / 12) {
                    mathis.geo.copyMat(this.getProjectionMatrix(), this.frozonProjectionMatrix);
                    mathis.geo.copyMat(this.getViewMatrix(), this.frozonViewMatrix);
                    this.cumulatedAngle = 0;
                    mathis.geo.copyXYZ(this.myNullVector, this.oldCamDir);
                    mathis.geo.copyXYZ(this.myNullVector, this.cursorPositionOnGrabberOld);
                    if (this.showPredefinedConsoleLog)
                        console.log('nouvelles matrices enregistrées');
                }
            };
            GrabberCamera.prototype.createPickingRayWithFrozenCamera = function (x, y, world, frozenViewMatrix, frozonProjectionMatrix, result) {
                var engine = this.getEngine();
                var cameraViewport = this.viewport;
                var viewport = cameraViewport.toGlobal(engine.getRenderWidth(), engine.getRenderHeight());
                x = x / engine.getHardwareScalingLevel() - viewport.x;
                y = y / engine.getHardwareScalingLevel() - (engine.getRenderHeight() - viewport.y - viewport.height);
                this.createNewRay(x, y, viewport.width, viewport.height, world, frozenViewMatrix, frozonProjectionMatrix, result);
            };
            GrabberCamera.prototype.createNewRay = function (x, y, viewportWidth, viewportHeight, world, view, projection, result) {
                mathis.geo.unproject(mathis.geo.copyXyzFromFloat(x, y, 0, this._tempCN), viewportWidth, viewportHeight, world, view, projection, result.origin);
                mathis.geo.unproject(mathis.geo.copyXyzFromFloat(x, y, 1, this._tempCN), viewportWidth, viewportHeight, world, view, projection, this._end);
                mathis.geo.substract(this._end, result.origin, result.direction);
                mathis.geo.normalize(result.direction, result.direction);
            };
            GrabberCamera.prototype.onPointerDown = function (actualPointerX, actualPointerY) {
                this.pointerIsDown = true;
                mathis.geo.copyMat(this.getProjectionMatrix(), this.frozonProjectionMatrix);
                mathis.geo.copyMat(this.getViewMatrix(), this.frozonViewMatrix);
                this.cumulatedAngle = 0;
                if (this._lookForTheBestGrabber && this.grabbers.length > 1) {
                    this.lookForTheBestGrabber(actualPointerX, actualPointerY);
                    this._lookForTheBestGrabber = false;
                }
            };
            GrabberCamera.prototype.lookForTheBestGrabber = function (actualPointerX, actualPointerY) {
                var shorterDist = Number.POSITIVE_INFINITY;
                var closerGraber = null;
                for (var _i = 0, _a = this.grabbers; _i < _a.length; _i++) {
                    var gra = _a[_i];
                    this.createPickingRayWithFrozenCamera(actualPointerX, actualPointerY, gra.mesh.getWorldMatrix(), this.frozonViewMatrix, this.frozonProjectionMatrix, this.pickingRay);
                    mathis.geo.copyXYZ(this.pickingRay.direction, this.camDir);
                    this._babylonRay.direction = this.pickingRay.direction;
                    this._babylonRay.origin = this.pickingRay.origin;
                    var pickInfo = gra.mesh.intersects(this._babylonRay, true);
                    if (pickInfo.hit) {
                        if (pickInfo.distance < shorterDist) {
                            shorterDist = pickInfo.distance;
                            closerGraber = gra;
                        }
                    }
                }
                if (closerGraber != null && closerGraber != this.currentGrabber) {
                    if (this.onGrabberChange != null)
                        this.onGrabberChange(this.currentGrabber, closerGraber);
                    this.currentGrabber = closerGraber;
                    console.log('we have changed grabber, the new one is: ', closerGraber.name);
                }
            };
            GrabberCamera.prototype.onPointerUp = function () {
                this._lookForTheBestGrabber = true;
                this.toogleIconCursor('cursorDefault');
                if (this.currentGrabber.showGrabberOnlyWhenGrabbing)
                    this.currentGrabber.mesh.visibility = 0;
                this.pointerIsDown = false;
                mathis.geo.copyXYZ(this.myNullVector, this.oldCamDir);
                mathis.geo.copyXYZ(this.myNullVector, this.cursorPositionOnGrabberOld);
            };
            GrabberCamera.prototype.reset = function () {
                this._keys = [];
            };
            GrabberCamera.prototype.toogleIconCursor = function (style) {
                if (this.cursorActualStyle != style) {
                    this.$canvasElement.className = style;
                    this.cursorActualStyle = style;
                }
            };
            GrabberCamera.prototype._isSynchronizedViewMatrix = function () {
                if (!_super.prototype._isSynchronizedViewMatrix.call(this)) {
                    return false;
                }
                return this.trueCamPos.almostEqual(this.whishedCamPos);
            };
            GrabberCamera.prototype._getViewMatrix = function () {
                mathis.geo.copyXYZ(this.trueCamPos.position, this._target);
                mathis.geo.add(this._target, this.trueCamPos.frontDir, this._target);
                mathis.geo.LookAtLH(this.trueCamPos.position, this._target, this.trueCamPos.upVector, this.viewMM);
                return this.viewMM;
            };
            GrabberCamera.prototype.update = function () {
                this.checkForKeyPushed();
                if (!this.trueCamPos.almostEqual(this.whishedCamPos)) {
                    this.trueCamPos.goCloser(this.whishedCamPos);
                }
                this.position.copyFrom(this.trueCamPos.position);
                this.upVector.copyFrom(this.trueCamPos.upVector);
            };
            GrabberCamera.prototype.onKeyDown = function (evt) {
                if (this.keysUp.indexOf(evt.keyCode) !== -1 ||
                    this.keysDown.indexOf(evt.keyCode) !== -1 ||
                    this.keysLeft.indexOf(evt.keyCode) !== -1 ||
                    this.keysRight.indexOf(evt.keyCode) !== -1 ||
                    this.keysBackward.indexOf(evt.keyCode) !== -1 ||
                    this.keysFrontward.indexOf(evt.keyCode) !== -1) {
                    var index = this._keys.indexOf(evt.keyCode);
                    if (index === -1) {
                        this._keys.push(evt.keyCode);
                    }
                    if (evt.preventDefault) {
                        evt.preventDefault();
                    }
                }
            };
            GrabberCamera.prototype.onKeyUp = function (evt) {
                if (this.keysUp.indexOf(evt.keyCode) !== -1 ||
                    this.keysDown.indexOf(evt.keyCode) !== -1 ||
                    this.keysLeft.indexOf(evt.keyCode) !== -1 ||
                    this.keysRight.indexOf(evt.keyCode) !== -1 ||
                    this.keysBackward.indexOf(evt.keyCode) !== -1 ||
                    this.keysFrontward.indexOf(evt.keyCode) !== -1) {
                    var index = this._keys.indexOf(evt.keyCode);
                    if (index >= 0) {
                        this._keys.splice(index, 1);
                    }
                    if (evt.preventDefault) {
                        evt.preventDefault();
                    }
                }
            };
            GrabberCamera.prototype.checkForKeyPushed = function () {
                if (this._keys.length == 0)
                    return;
                mathis.geo.copyXyzFromFloat(0, 0, 0, this._axeForKeyRotation);
                for (var index = 0; index < this._keys.length; index++) {
                    var keyCode = this._keys[index];
                    if (this.keysLeft.indexOf(keyCode) !== -1) {
                        mathis.geo.copyXYZ(this.whishedCamPos.upVector, this._additionnalVec);
                        mathis.geo.scale(this._additionnalVec, -1, this._additionnalVec);
                        mathis.geo.add(this._axeForKeyRotation, this._additionnalVec, this._axeForKeyRotation);
                    }
                    if (this.keysUp.indexOf(keyCode) !== -1) {
                        mathis.geo.cross(this.whishedCamPos.frontDir, this.whishedCamPos.upVector, this._additionnalVec);
                        mathis.geo.add(this._additionnalVec, this._axeForKeyRotation, this._axeForKeyRotation);
                    }
                    if (this.keysRight.indexOf(keyCode) !== -1) {
                        mathis.geo.copyXYZ(this.whishedCamPos.upVector, this._additionnalVec);
                        mathis.geo.add(this._additionnalVec, this._axeForKeyRotation, this._axeForKeyRotation);
                    }
                    if (this.keysDown.indexOf(keyCode) !== -1) {
                        mathis.geo.cross(this.whishedCamPos.upVector, this.whishedCamPos.frontDir, this._additionnalVec);
                        mathis.geo.add(this._additionnalVec, this._axeForKeyRotation, this._axeForKeyRotation);
                    }
                    if (this.keysBackward.indexOf(keyCode) !== -1)
                        this.translateCam(-0.1);
                    else if (this.keysFrontward.indexOf(keyCode) !== -1)
                        this.translateCam(0.1);
                }
                if (mathis.geo.squareNorme(this._axeForKeyRotation) < mathis.geo.epsilon)
                    return;
                var angle = -0.02;
                this.rotate(this._axeForKeyRotation, angle);
            };
            GrabberCamera.prototype.deltaNotToBigFunction = function (delta) {
                if (delta > 0.1)
                    return 0.1;
                if (delta < -0.1)
                    return -0.1;
                return delta;
            };
            GrabberCamera.prototype.attachControl = function (element, noPreventDefault) {
                var _this = this;
                var pointerId;
                if (this._attachedElement) {
                    return;
                }
                this._attachedElement = element;
                this._onPointerDown = function (evt) {
                    if (pointerId) {
                        return;
                    }
                    pointerId = evt.pointerId;
                    if (!noPreventDefault) {
                        evt.preventDefault();
                    }
                    var rect = element.getBoundingClientRect();
                    _this.onPointerDown(evt.clientX - rect.left, evt.clientY - rect.top);
                };
                this._onPointerUp = function (evt) {
                    pointerId = null;
                    if (!noPreventDefault) {
                        evt.preventDefault();
                    }
                    _this.onPointerUp();
                };
                this._onPointerMove = function (evt) {
                    if (pointerId !== evt.pointerId) {
                        return;
                    }
                    var rect = element.getBoundingClientRect();
                    _this.onPointerMove(evt.clientX - rect.left, evt.clientY - rect.top);
                    if (!noPreventDefault) {
                        evt.preventDefault();
                    }
                };
                this._onMouseMove = this._onPointerMove;
                this._wheel = function (event) {
                    var delta = 0;
                    if (event.wheelDelta) {
                        delta = _this.deltaNotToBigFunction(event.wheelDelta / (_this.wheelPrecision * 300));
                    }
                    else if (event.detail) {
                        delta = _this.deltaNotToBigFunction(-event.detail / (_this.wheelPrecision * 30));
                    }
                    if (delta)
                        _this.translateCam(delta);
                    if (event.preventDefault) {
                        if (!noPreventDefault) {
                            event.preventDefault();
                        }
                    }
                };
                this._onKeyDown = function (evt) {
                    _this.onKeyDown(evt);
                };
                this._onKeyUp = function (evt) {
                    _this.onKeyUp(evt);
                };
                this._onLostFocus = function () {
                    _this._keys = [];
                    pointerId = null;
                };
                this._onGestureStart = function (e) {
                    if (window.MSGesture === undefined) {
                        return;
                    }
                    if (!_this._MSGestureHandler) {
                        _this._MSGestureHandler = new MSGesture();
                        _this._MSGestureHandler.target = element;
                    }
                    _this._MSGestureHandler.addPointer(e.pointerId);
                };
                this._onGesture = function (e) {
                };
                this._reset = function () {
                    _this.reset();
                    pointerId = null;
                };
                element.addEventListener(this.eventPrefix + "down", this._onPointerDown, false);
                element.addEventListener(this.eventPrefix + "up", this._onPointerUp, false);
                element.addEventListener(this.eventPrefix + "out", this._onPointerUp, false);
                element.addEventListener(this.eventPrefix + "move", this._onPointerMove, false);
                element.addEventListener("mousemove", this._onMouseMove, false);
                element.addEventListener("MSPointerDown", this._onGestureStart, false);
                element.addEventListener("MSGestureChange", this._onGesture, false);
                element.addEventListener('mousewheel', this._wheel, false);
                element.addEventListener('DOMMouseScroll', this._wheel, false);
                Tools.RegisterTopRootEvents([
                    { name: "keydown", handler: this._onKeyDown },
                    { name: "keyup", handler: this._onKeyUp },
                    { name: "blur", handler: this._onLostFocus }
                ]);
            };
            GrabberCamera.prototype.detachControl = function (element) {
                if (this._attachedElement != element) {
                    return;
                }
                element.removeEventListener(this.eventPrefix + "down", this._onPointerDown);
                element.removeEventListener(this.eventPrefix + "up", this._onPointerUp);
                element.removeEventListener(this.eventPrefix + "out", this._onPointerUp);
                element.removeEventListener(this.eventPrefix + "move", this._onPointerMove);
                element.removeEventListener("mousemove", this._onMouseMove);
                element.removeEventListener("MSPointerDown", this._onGestureStart);
                element.removeEventListener("MSGestureChange", this._onGesture);
                element.removeEventListener('mousewheel', this._wheel);
                element.removeEventListener('DOMMouseScroll', this._wheel);
                Tools.UnregisterTopRootEvents([
                    { name: "keydown", handler: this._onKeyDown },
                    { name: "keyup", handler: this._onKeyUp },
                    { name: "blur", handler: this._onLostFocus }
                ]);
                this._MSGestureHandler = null;
                this._attachedElement = null;
                if (this._reset) {
                    this._reset();
                }
            };
            return GrabberCamera;
        }(BABYLON.Camera));
        macamera.GrabberCamera = GrabberCamera;
        var CamPositioning = (function (_super) {
            __extends(CamPositioning, _super);
            function CamPositioning(grabberPilot) {
                _super.call(this);
                this.grabberPilot = grabberPilot;
                this.position = new mathis.XYZ(0, 0, -3);
                this.upVector = new mathis.XYZ(0, 1, 0);
                this.frontDir = new mathis.XYZ(0, 0, 1);
                this.sizes = new mathis.XYZ(1, 1, 1);
                this.smoothParam = 0.5;
                this.positioningCopy = new mathis.Positioning();
            }
            CamPositioning.prototype.almostEqual = function (camCarac) {
                return mathis.geo.xyzAlmostEquality(this.position, camCarac.getPosition()) && mathis.geo.xyzAlmostEquality(this.upVector, camCarac.upVector) && mathis.geo.xyzAlmostEquality(this.frontDir, camCarac.frontDir);
            };
            CamPositioning.prototype.goCloser = function (positioning) {
                mathis.geo.between(positioning.position, this.position, this.smoothParam, this.position);
                mathis.geo.between(positioning.upVector, this.upVector, this.smoothParam, this.upVector);
                mathis.geo.between(positioning.frontDir, this.frontDir, this.smoothParam, this.frontDir);
                if (this.upVector.lengthSquared() < mathis.geo.epsilonSquare) {
                    this.upVector.copyFrom(positioning.upVector).scale(-1);
                    mathis.logger.c('a wished upVector was opposite to the true upVector');
                }
                if (this.frontDir.lengthSquared() < mathis.geo.epsilonSquare) {
                    this.frontDir.copyFrom(positioning.frontDir).scale(-1);
                    mathis.logger.c('a wished frontDir was opposite to the true frontDir');
                }
                if (this.grabberPilot.onPositioningChange != null) {
                    this.positioningCopy.copyFrom(this);
                    this.grabberPilot.onPositioningChange(this.positioningCopy);
                }
            };
            CamPositioning.prototype.copyFrom = function (positioning) {
                mathis.geo.copyXYZ(positioning.position, this.position);
                mathis.geo.copyXYZ(positioning.upVector, this.upVector);
                mathis.geo.copyXYZ(positioning.frontDir, this.frontDir);
            };
            CamPositioning.prototype.changeFrontDir = function (vector) {
                mathis.geo.orthonormalizeKeepingFirstDirection(vector, this.upVector, this.frontDir, this.upVector);
            };
            CamPositioning.prototype.changeUpVector = function (vector) {
                mathis.geo.orthonormalizeKeepingFirstDirection(this.upVector, vector, this.upVector, this.frontDir);
            };
            return CamPositioning;
        }(mathis.Positioning));
        macamera.CamPositioning = CamPositioning;
        var WishedPositioning = (function (_super) {
            __extends(WishedPositioning, _super);
            function WishedPositioning(camera) {
                var _this = this;
                _super.call(this);
                this.camera = camera;
                this.upVector = new mathis.XYZ(0, 1, 0);
                this.frontDir = new mathis.XYZ(0, 0, 1);
                this.position = new mathis.XYZ(0, 0, -3);
                this._newPositionBeforCollision = new mathis.XYZ(0, 0, 0);
                this._velocity = new mathis.XYZ(0, 0, 0);
                this._collider = new Collider();
                this.ellipsoid = new mathis.XYZ(1, 1, 1);
                this._oldPosition = new mathis.XYZ(0, 0, 0);
                this._diffPosition = new mathis.XYZ(0, 0, 0);
                this._newPosition = new mathis.XYZ(0, 0, 0);
                this._inter = new mathis.XYZ(0, 0, 0);
                this._upPerturbation = new mathis.XYZ(0, 0, 0);
                this._onCollisionPositionChange = function (collisionId, newPosition, collidedMesh) {
                    if (collidedMesh === void 0) { collidedMesh = null; }
                    _this._newPosition.copyFrom(newPosition);
                    _this._newPosition.subtractToRef(_this._oldPosition, _this._diffPosition).scale(2);
                    if (collidedMesh != null) {
                        console.log('collision');
                        _this._upPerturbation.copyFrom(_this.upVector).scale(0.005);
                        _this.position.add(_this._diffPosition).add(_this._upPerturbation);
                    }
                    else
                        _this.position.copyFrom(_this._oldPosition);
                };
            }
            WishedPositioning.prototype.getPosition = function () {
                return this.position;
            };
            WishedPositioning.prototype.changePosition = function (newPosition) {
                if (this.camera.positionChangesBiaiser != null) {
                    this._newPositionBeforCollision.copyFrom(this.camera.positionChangesBiaiser(this.position, newPosition, this.camera.currentGrabber));
                }
                else
                    this._newPositionBeforCollision.copyFrom(newPosition);
                if (this.camera.checkCollisions) {
                    this._velocity.copyFrom(this._newPositionBeforCollision).substract(this.camera.trueCamPos.position);
                    this._collideWithWorld(this._velocity, this._newPositionBeforCollision);
                }
                else
                    this.position.copyFrom(this._newPositionBeforCollision);
            };
            WishedPositioning.prototype._collideWithWorld = function (velocity, candidatePos) {
                this._collider.radius = this.ellipsoid;
                this._oldPosition.copyFrom(candidatePos);
                this.camera.scene.collisionCoordinator.getNewPosition(this._oldPosition, velocity, this._collider, 3, null, this._onCollisionPositionChange, -13);
            };
            return WishedPositioning;
        }(mathis.Positioning));
        macamera.WishedPositioning = WishedPositioning;
        var Grabber = (function () {
            function Grabber(scene) {
                this.parallelDisplacementInsteadOfRotation = false;
                this.showGrabberOnlyWhenGrabbing = true;
                this.referenceCenter = null;
                this.onGrabbingActions = new mathis.StringMap();
                this.endOfZone1 = 1;
                this.endOfZone2 = 3;
                this.endOfZone3 = 10;
                this.zoneAreDefinedFromCenterRatherFromSurface = true;
                this.focusOnMyCenterWhenCameraGoDownWard = true;
                this.scene = scene;
                this.material = new BABYLON.StandardMaterial('', this.scene);
                this.material = new BABYLON.StandardMaterial("texture1", this.scene);
                this.material.alpha = 0.3;
                this.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
            }
            Grabber.prototype.dispose = function () {
                this.mesh.dispose();
            };
            Grabber.prototype.interpolationCoefAccordingToCamPosition = function (camPosition, distCamToGrabber) {
                var distance = 0;
                if (this.zoneAreDefinedFromCenterRatherFromSurface)
                    distance = mathis.geo.distance(camPosition, this.referenceCenter);
                else
                    distance = distCamToGrabber;
                if (distance <= this.endOfZone1)
                    return 0;
                if (distance >= this.endOfZone2)
                    return 1;
                return (distance - this.endOfZone1) / (this.endOfZone2 - this.endOfZone1);
            };
            Grabber.prototype.checkArgs = function () {
                if (this.zoneAreDefinedFromCenterRatherFromSurface && this.referenceCenter == null)
                    throw 'you must define a reference center when zoneAreDefinedFromCenterRatherFromSurface';
                if (this.focusOnMyCenterWhenCameraGoDownWard && this.referenceCenter == null)
                    throw 'you must define a reference center when focusOnMyCenterWhenCameraGoDownWard';
                if (this.endOfZone1 > this.endOfZone2)
                    throw 'zone2 must contains zone1';
                if (this.endOfZone2 > this.endOfZone3)
                    throw 'zone3 must contains zone2';
            };
            return Grabber;
        }());
        macamera.Grabber = Grabber;
        var SphericalGrabber = (function (_super) {
            __extends(SphericalGrabber, _super);
            function SphericalGrabber(scene, sizes, positionAndReferenceCenter, isPickable) {
                if (sizes === void 0) { sizes = new mathis.XYZ(1, 1, 1); }
                if (positionAndReferenceCenter === void 0) { positionAndReferenceCenter = new mathis.XYZ(0, 0, 0); }
                if (isPickable === void 0) { isPickable = false; }
                _super.call(this, scene);
                this.radius = 1;
                this.radius = sizes.x;
                this.endOfZone1 = this.radius;
                this.endOfZone2 = 3 * this.radius;
                this.endOfZone3 = 10 * this.radius;
                this.referenceCenter = positionAndReferenceCenter;
                this.focusOnMyCenterWhenCameraGoDownWard = true;
                this.parallelDisplacementInsteadOfRotation = false;
                this.showGrabberOnlyWhenGrabbing = true;
                this.mesh = BABYLON.Mesh.CreateSphere("default sphere for grabbing", 10, 2, scene);
                this.mesh.position = positionAndReferenceCenter;
                this.mesh.scaling = sizes;
                this.mesh.material = this.material;
                this.mesh.isPickable = isPickable;
            }
            return SphericalGrabber;
        }(Grabber));
        macamera.SphericalGrabber = SphericalGrabber;
        var PlanarGrabber = (function (_super) {
            __extends(PlanarGrabber, _super);
            function PlanarGrabber(scene, scaling, position, quaternion, isPickable) {
                if (scaling === void 0) { scaling = new mathis.XYZ(1, 1, 1); }
                if (position === void 0) { position = new mathis.XYZ(0, 0, 0); }
                if (quaternion === void 0) { quaternion = new mathis.XYZW(0, 0, 0, 1); }
                if (isPickable === void 0) { isPickable = false; }
                _super.call(this, scene);
                this.referenceCenter = null;
                this.focusOnMyCenterWhenCameraGoDownWard = false;
                this.parallelDisplacementInsteadOfRotation = true;
                this.zoneAreDefinedFromCenterRatherFromSurface = false;
                this.endOfZone1 = 0;
                this.endOfZone2 = 0;
                this.mesh = BABYLON.Mesh.CreatePlane("default plane for grabbing", 1, scene);
                this.mesh.position = position;
                this.mesh.scaling = scaling;
                this.mesh.rotationQuaternion = quaternion;
                this.mesh.material = this.material;
                this.mesh.isPickable = isPickable;
            }
            return PlanarGrabber;
        }(Grabber));
        macamera.PlanarGrabber = PlanarGrabber;
    })(macamera = mathis.macamera || (mathis.macamera = {}));
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    var mameshAroundComputations;
    (function (mameshAroundComputations) {
        var PositioningComputerForMameshVertices = (function () {
            function PositioningComputerForMameshVertices(mamesh) {
                this.attractionOfTangent = new mathis.XYZ(1, 0.0123456721, 0.00078654343);
                this.computeTangent = true;
                this.computeNormal = true;
                this.computeSizes = true;
                this.sizesProp = new mathis.XYZ(0.3, 0.3, 0.3);
                this.allVerticesHaveSameSizes = true;
                this.temp = new mathis.XYZ(0, 0, 0);
                this._side1 = new mathis.XYZ(0, 0, 0);
                this._side2 = new mathis.XYZ(0, 0, 0);
                this.mamesh = mamesh;
            }
            PositioningComputerForMameshVertices.prototype.checkArgs = function () {
                if (this.mamesh.smallestSquares.length == 0 && this.mamesh.smallestTriangles.length == 0)
                    throw "no triangles nor Square. The normals cannot be computed";
            };
            PositioningComputerForMameshVertices.prototype.go = function () {
                var _this = this;
                var res = new mathis.HashMap();
                if (this.mamesh.vertices.length == 0) {
                    mathis.logger.c('you try to compute normal, tangent, diameter for an empty mamesh');
                    return;
                }
                this.mamesh.vertices.forEach(function (v) {
                    var positioning = new mathis.Positioning();
                    positioning.position = v.position;
                    positioning.upVector = new mathis.XYZ(0, 0, 0);
                    positioning.frontDir = new mathis.XYZ(0, 0, 0);
                    res.putValue(v, positioning);
                });
                if (this.computeTangent) {
                    this.mamesh.vertices.forEach(function (vertex) {
                        var greaterDotProduct = Number.NEGATIVE_INFINITY;
                        var smallerDotProduct = Number.POSITIVE_INFINITY;
                        var bestDirection = new mathis.XYZ(0, 0, 0);
                        var worstDirection = new mathis.XYZ(0, 0, 0);
                        if (vertex.links.length == 0)
                            throw 'a vertex with no links. Impossible to compute a tangent';
                        var attractionOfTangentLenght = _this.attractionOfTangent.length();
                        for (var i = 0; i < vertex.links.length; i++) {
                            _this.temp.copyFrom(vertex.links[i].to.position).substract(vertex.position);
                            if (_this.temp.length() < mathis.geo.epsilon) {
                                mathis.logger.c('a mamesh has two vertices at almost the same position');
                            }
                            else {
                                var sca = mathis.geo.dot(_this.temp, _this.attractionOfTangent) / _this.temp.length() / attractionOfTangentLenght;
                                if (sca > greaterDotProduct) {
                                    greaterDotProduct = sca;
                                    bestDirection.copyFrom(_this.temp);
                                }
                                if (sca < smallerDotProduct) {
                                    smallerDotProduct = sca;
                                    worstDirection.copyFrom(_this.temp);
                                }
                            }
                        }
                        if (-smallerDotProduct > 2 * greaterDotProduct)
                            res.getValue(vertex).frontDir.copyFrom(worstDirection.scale(-1));
                        else
                            res.getValue(vertex).frontDir.copyFrom(bestDirection);
                    });
                }
                if (this.computeNormal) {
                    var triangleNormal = [];
                    for (var i = 0; i < this.mamesh.smallestTriangles.length / 3; i++) {
                        this._side1.copyFrom(this.mamesh.smallestTriangles[3 * i + 1].position).substract(this.mamesh.smallestTriangles[3 * i].position);
                        this._side2.copyFrom(this.mamesh.smallestTriangles[3 * i + 2].position).substract(this.mamesh.smallestTriangles[3 * i].position);
                        triangleNormal[i] = new mathis.XYZ(0, 0, 0);
                        mathis.geo.cross(this._side1, this._side2, triangleNormal[i]);
                        triangleNormal[i].normalize();
                    }
                    var squareNormal = [];
                    for (var i = 0; i < this.mamesh.smallestSquares.length / 4; i++) {
                        this._side1.copyFrom(this.mamesh.smallestSquares[4 * i + 1].position).substract(this.mamesh.smallestSquares[4 * i].position);
                        this._side2.copyFrom(this.mamesh.smallestSquares[4 * i + 3].position).substract(this.mamesh.smallestSquares[4 * i].position);
                        squareNormal[i] = new mathis.XYZ(0, 0, 0);
                        mathis.geo.cross(this._side1, this._side2, squareNormal[i]);
                        try {
                            squareNormal[i].normalize();
                        }
                        catch (e) {
                            throw 'the square' + this.mamesh.smallestSquares[4 * i].hashNumber + ',' + this.mamesh.smallestSquares[4 * i + 1].hashNumber + ',' + this.mamesh.smallestSquares[4 * i + 2].hashNumber + ',' + this.mamesh.smallestSquares[4 * i + 3].hashNumber + ' is degenerated';
                        }
                    }
                    for (var i = 0; i < triangleNormal.length; i++) {
                        var v0 = this.mamesh.smallestTriangles[3 * i];
                        var v1 = this.mamesh.smallestTriangles[3 * i + 1];
                        var v2 = this.mamesh.smallestTriangles[3 * i + 2];
                        res.getValue(v0).upVector.add(triangleNormal[i]);
                        res.getValue(v1).upVector.add(triangleNormal[i]);
                        res.getValue(v2).upVector.add(triangleNormal[i]);
                    }
                    for (var i = 0; i < squareNormal.length; i++) {
                        var v0 = this.mamesh.smallestSquares[4 * i];
                        var v1 = this.mamesh.smallestSquares[4 * i + 1];
                        var v2 = this.mamesh.smallestSquares[4 * i + 2];
                        var v3 = this.mamesh.smallestSquares[4 * i + 3];
                        res.getValue(v0).upVector.add(squareNormal[i]);
                        res.getValue(v1).upVector.add(squareNormal[i]);
                        res.getValue(v2).upVector.add(squareNormal[i]);
                        res.getValue(v3).upVector.add(squareNormal[i]);
                    }
                    var vertexWithoutNormal_1 = [];
                    this.mamesh.vertices.forEach(function (v) {
                        try {
                            res.getValue(v).upVector.normalize();
                        }
                        catch (e) {
                            mathis.logger.c('a too small upVector for a vertex, probably a vertex which is not in any polygone. The upVector will be the mean of other upVector');
                            vertexWithoutNormal_1.push(v);
                        }
                    });
                    if (vertexWithoutNormal_1.length > 0) {
                        var mean = new mathis.XYZ(0, 0, 0);
                        for (var _i = 0, _a = this.mamesh.vertices; _i < _a.length; _i++) {
                            var v = _a[_i];
                            mean.add(res.getValue(v).upVector);
                        }
                        try {
                            mean.normalize();
                        }
                        catch (e) {
                            throw 'canot manage to compute upVector for any vertex';
                        }
                        for (var _b = 0, vertexWithoutNormal_2 = vertexWithoutNormal_1; _b < vertexWithoutNormal_2.length; _b++) {
                            var poorVertex = vertexWithoutNormal_2[_b];
                            res.getValue(poorVertex).upVector.copyFrom(mean);
                        }
                    }
                }
                if (this.computeSizes) {
                    if (!this.allVerticesHaveSameSizes) {
                        this.mamesh.vertices.forEach(function (vertex) {
                            var sum = 0;
                            vertex.links.forEach(function (li) {
                                sum += mathis.geo.distance(vertex.position, li.to.position);
                            });
                            res.getValue(vertex).scaling.copyFrom(_this.sizesProp).scale(sum / vertex.links.length);
                        });
                    }
                    else {
                        var diam_1 = 0;
                        var vertex_1 = this.mamesh.vertices[0];
                        var sum_1 = 0;
                        vertex_1.links.forEach(function (li) {
                            sum_1 += mathis.geo.distance(vertex_1.position, li.to.position);
                        });
                        diam_1 = sum_1 / vertex_1.links.length;
                        this.mamesh.vertices.forEach(function (v) { return res.getValue(v).scaling.copyFrom(_this.sizesProp).scale(diam_1); });
                    }
                }
                return res;
            };
            return PositioningComputerForMameshVertices;
        }());
        mameshAroundComputations.PositioningComputerForMameshVertices = PositioningComputerForMameshVertices;
    })(mameshAroundComputations = mathis.mameshAroundComputations || (mathis.mameshAroundComputations = {}));
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    var mameshModification;
    (function (mameshModification) {
        function completSegment(newParamForMiddle, mamesh, segment, orthogonalVertex) {
            if (segment.middle == null) {
                var position = new mathis.XYZ(0, 0, 0);
                mathis.geo.between(segment.a.position, segment.b.position, 0.5, position);
                segment.middle = mamesh.newVertex(position, Math.max(segment.a.dichoLevel, segment.b.dichoLevel) + 1, newParamForMiddle(segment.a.param, segment.b.param));
                if (segment.a.hasMark(mathis.Vertex.Markers.border) && segment.b.hasMark(mathis.Vertex.Markers.border))
                    segment.middle.markers.push(mathis.Vertex.Markers.border);
                if (orthogonalVertex != null)
                    segment.orth1 = orthogonalVertex;
            }
            else if (orthogonalVertex != null)
                segment.orth2 = orthogonalVertex;
        }
        var TriangleDichotomer = (function () {
            function TriangleDichotomer(mamesh) {
                this.makeLinks = true;
                this.trianglesToCut = null;
                this.nbDicho = 1;
                this.newParamForMiddle = function (p1, p2) {
                    var res = new mathis.XYZ(0, 0, 0);
                    mathis.geo.between(p1, p2, 1 / 2, res);
                    return res;
                };
                this.mamesh = mamesh;
            }
            TriangleDichotomer.prototype.checkArgs = function () {
                if (this.mamesh.smallestTriangles.length == 0)
                    mathis.logger.c('no triangulatedRect for triangulatedRect dichotomy');
            };
            TriangleDichotomer.prototype.go = function () {
                this.checkArgs();
                if (!this.makeLinks)
                    this.mamesh.clearLinksAndLines();
                var newTriangles;
                if (this.trianglesToCut == null) {
                    this.trianglesToCut = this.mamesh.smallestTriangles;
                    newTriangles = new Array();
                }
                else {
                    newTriangles = new mathis.tab.ArrayMinusBlocksElements(this.mamesh.smallestTriangles, 3, this.trianglesToCut).go();
                }
                var segments = this.createAndAddSegmentsFromTriangles(this.trianglesToCut);
                for (var f = 0; f < this.trianglesToCut.length; f += 3) {
                    var v1 = this.trianglesToCut[f];
                    var v2 = this.trianglesToCut[f + 1];
                    var v3 = this.trianglesToCut[f + 2];
                    var segment3 = segments[mathis.Segment.segmentId(v1.hashNumber, v2.hashNumber)];
                    var segment1 = segments[mathis.Segment.segmentId(v2.hashNumber, v3.hashNumber)];
                    var segment2 = segments[mathis.Segment.segmentId(v3.hashNumber, v1.hashNumber)];
                    if (this.makeLinks) {
                        completSegment(this.newParamForMiddle, this.mamesh, segment3, v3);
                        completSegment(this.newParamForMiddle, this.mamesh, segment1, v1);
                        completSegment(this.newParamForMiddle, this.mamesh, segment2, v2);
                    }
                    else {
                        completSegment(this.newParamForMiddle, this.mamesh, segment3);
                        completSegment(this.newParamForMiddle, this.mamesh, segment1);
                        completSegment(this.newParamForMiddle, this.mamesh, segment2);
                    }
                    var f3 = segment3.middle;
                    var f1 = segment1.middle;
                    var f2 = segment2.middle;
                    newTriangles.push(v1, f3, f2);
                    newTriangles.push(v2, f1, f3);
                    newTriangles.push(v3, f2, f1);
                    newTriangles.push(f3, f1, f2);
                }
                if (this.makeLinks) {
                    for (var segId in segments) {
                        var segment = segments[segId];
                        var segA1 = segments[mathis.Segment.segmentId(segment.a.hashNumber, segment.orth1.hashNumber)];
                        var segB1 = segments[mathis.Segment.segmentId(segment.b.hashNumber, segment.orth1.hashNumber)];
                        if (segment.orth2 != null) {
                            var segA2 = segments[mathis.Segment.segmentId(segment.a.hashNumber, segment.orth2.hashNumber)];
                            var segB2 = segments[mathis.Segment.segmentId(segment.b.hashNumber, segment.orth2.hashNumber)];
                            segment.middle.setTwoOppositeLinks(segA1.middle, segB2.middle);
                            segment.middle.setTwoOppositeLinks(segA2.middle, segB1.middle);
                        }
                        else {
                            segment.middle.setOneLink(segA1.middle);
                            segment.middle.setOneLink(segB1.middle);
                        }
                        try {
                            var changeFleArrival = function (v, old, newVoi) {
                                var fle = v.findLink(old);
                                fle.to = newVoi;
                            };
                            changeFleArrival(segment.a, segment.b, segment.middle);
                            changeFleArrival(segment.b, segment.a, segment.middle);
                            segment.middle.setTwoOppositeLinks(segment.a, segment.b);
                        }
                        catch (e) {
                            throw 'a bad segment, probably your triangles are not corrects (e.g. one missing, or one more)';
                        }
                    }
                }
                this.mamesh.smallestTriangles = newTriangles;
            };
            TriangleDichotomer.prototype.createAndAddSegmentsFromTriangles = function (triangles) {
                var segments = {};
                for (var f = 0; f < triangles.length; f += 3) {
                    var v1 = triangles[f];
                    var v2 = triangles[f + 1];
                    var v3 = triangles[f + 2];
                    this.mamesh.getOrCreateSegment(v1, v2, segments);
                    this.mamesh.getOrCreateSegment(v2, v3, segments);
                    this.mamesh.getOrCreateSegment(v3, v1, segments);
                }
                return segments;
            };
            return TriangleDichotomer;
        }());
        mameshModification.TriangleDichotomer = TriangleDichotomer;
        var SquareDichotomer = (function () {
            function SquareDichotomer(mamesh) {
                this.makeLinks = true;
                this.squareToCut = null;
                this.dichoStyle = SquareDichotomer.DichoStyle.fourSquares;
                this.newParamForMiddle = function (p1, p2) {
                    var res = new mathis.XYZ(0, 0, 0);
                    mathis.geo.between(p1, p2, 1 / 2, res);
                    return res;
                };
                this.newParamForCenter = function (p1, p2, p3, p4) {
                    var res = new mathis.XYZ(0, 0, 0);
                    mathis.geo.baryCenter([p1, p2, p3, p4], [1 / 4, 1 / 4, 1 / 4, 1 / 4], res);
                    return res;
                };
                this.mamesh = mamesh;
            }
            SquareDichotomer.prototype.checkArgs = function () {
                if (this.mamesh.smallestSquares.length == 0)
                    throw 'no square for square dichotomy';
                this.mamesh.clearLinksAndLines();
            };
            SquareDichotomer.prototype.go = function () {
                this.checkArgs();
                var newSquares;
                if (this.squareToCut == null) {
                    this.squareToCut = this.mamesh.smallestSquares;
                    newSquares = new Array();
                }
                else {
                    newSquares = new mathis.tab.ArrayMinusBlocksElements(this.mamesh.smallestSquares, 4, this.squareToCut).go();
                }
                var segments = this.createAndAddSegmentsFromSquare(this.squareToCut);
                for (var f = 0; f < this.squareToCut.length; f += 4) {
                    var v1 = this.squareToCut[f];
                    var v2 = this.squareToCut[f + 1];
                    var v3 = this.squareToCut[f + 2];
                    var v4 = this.squareToCut[f + 3];
                    var segment1 = segments[mathis.Segment.segmentId(v1.hashNumber, v2.hashNumber)];
                    var segment2 = segments[mathis.Segment.segmentId(v2.hashNumber, v3.hashNumber)];
                    var segment3 = segments[mathis.Segment.segmentId(v3.hashNumber, v4.hashNumber)];
                    var segment4 = segments[mathis.Segment.segmentId(v4.hashNumber, v1.hashNumber)];
                    completSegment(this.newParamForMiddle, this.mamesh, segment1);
                    completSegment(this.newParamForMiddle, this.mamesh, segment2);
                    completSegment(this.newParamForMiddle, this.mamesh, segment3);
                    completSegment(this.newParamForMiddle, this.mamesh, segment4);
                    var f1 = segment1.middle;
                    var f2 = segment2.middle;
                    var f3 = segment3.middle;
                    var f4 = segment4.middle;
                    if (this.dichoStyle == SquareDichotomer.DichoStyle.fourSquares) {
                        var position = new mathis.XYZ(0, 0, 0);
                        mathis.geo.baryCenter([segment1.a.position, segment1.b.position, segment3.a.position, segment3.b.position], [1 / 4, 1 / 4, 1 / 4, 1 / 4], position);
                        var dichoLevel = Math.max(segment1.a.dichoLevel, segment1.b.dichoLevel, segment3.a.dichoLevel, segment3.b.dichoLevel) + 1;
                        var center = this.mamesh.newVertex(position, dichoLevel, this.newParamForCenter(segment1.a.param, segment1.b.param, segment3.a.param, segment3.b.param));
                        var aNewCetSegment = new mathis.Segment(f1, f3);
                        aNewCetSegment.middle = center;
                        this.mamesh.cutSegmentsDico[mathis.Segment.segmentId(f1.hashNumber, f3.hashNumber)] = aNewCetSegment;
                        newSquares.push(v1, f1, center, f4);
                        newSquares.push(v2, f2, center, f1);
                        newSquares.push(v3, f3, center, f2);
                        newSquares.push(v4, f4, center, f3);
                    }
                    else if (this.dichoStyle == SquareDichotomer.DichoStyle.fourTriangles) {
                        newSquares.push(f1, f2, f3, f4);
                        this.mamesh.smallestTriangles.push(v1, f1, f4);
                        this.mamesh.smallestTriangles.push(v2, f2, f1);
                        this.mamesh.smallestTriangles.push(v3, f3, f2);
                        this.mamesh.smallestTriangles.push(v4, f4, f3);
                    }
                    else
                        throw 'ho ho';
                }
                this.mamesh.smallestSquares = newSquares;
                if (this.makeLinks) {
                    var linker = new mathis.linkModule.LinkCreaterSorterAndBorderDetecterByPolygons(this.mamesh);
                    linker.goChanging();
                }
            };
            SquareDichotomer.prototype.createAndAddSegmentsFromSquare = function (squares) {
                var segments = {};
                for (var f = 0; f < squares.length; f += 4) {
                    var v1 = squares[f];
                    var v2 = squares[f + 1];
                    var v3 = squares[f + 2];
                    var v4 = squares[f + 3];
                    this.mamesh.getOrCreateSegment(v1, v2, segments);
                    this.mamesh.getOrCreateSegment(v2, v3, segments);
                    this.mamesh.getOrCreateSegment(v3, v4, segments);
                    this.mamesh.getOrCreateSegment(v4, v1, segments);
                }
                return segments;
            };
            return SquareDichotomer;
        }());
        mameshModification.SquareDichotomer = SquareDichotomer;
        var SimplestSquareDichotomer = (function () {
            function SimplestSquareDichotomer(mamesh) {
                this.makeLinks = true;
                this.squareToCut = null;
                this.dichoStyle = SquareDichotomer.DichoStyle.fourSquares;
                this.newParamForMiddle = function (p1, p2) {
                    var res = new mathis.XYZ(0, 0, 0);
                    mathis.geo.between(p1, p2, 1 / 2, res);
                    return res;
                };
                this.newParamForCenter = function (p1, p2, p3, p4) {
                    var res = new mathis.XYZ(0, 0, 0);
                    mathis.geo.baryCenter([p1, p2, p3, p4], [1 / 4, 1 / 4, 1 / 4, 1 / 4], res);
                    return res;
                };
                this.mamesh = mamesh;
            }
            SimplestSquareDichotomer.prototype.checkArgs = function () {
                if (this.mamesh.smallestSquares.length == 0)
                    throw 'no square for square dichotomy';
                this.mamesh.clearLinksAndLines();
            };
            SimplestSquareDichotomer.prototype.go = function () {
                this.checkArgs();
                var newSquares;
                if (this.squareToCut == null) {
                    this.squareToCut = this.mamesh.smallestSquares;
                    newSquares = new Array();
                }
                else {
                    newSquares = new mathis.tab.ArrayMinusBlocksElements(this.mamesh.smallestSquares, 4, this.squareToCut).go();
                }
                var segments = this.createAndAddSegmentsFromSquare(this.squareToCut);
                for (var f = 0; f < this.squareToCut.length; f += 4) {
                    var v1 = this.squareToCut[f];
                    var v2 = this.squareToCut[f + 1];
                    var v3 = this.squareToCut[f + 2];
                    var v4 = this.squareToCut[f + 3];
                    var segment1 = segments[mathis.Segment.segmentId(v1.hashNumber, v2.hashNumber)];
                    var segment2 = segments[mathis.Segment.segmentId(v2.hashNumber, v3.hashNumber)];
                    var segment3 = segments[mathis.Segment.segmentId(v3.hashNumber, v4.hashNumber)];
                    var segment4 = segments[mathis.Segment.segmentId(v4.hashNumber, v1.hashNumber)];
                    completSegment(this.newParamForMiddle, this.mamesh, segment1);
                    completSegment(this.newParamForMiddle, this.mamesh, segment2);
                    completSegment(this.newParamForMiddle, this.mamesh, segment3);
                    completSegment(this.newParamForMiddle, this.mamesh, segment4);
                    var f1 = segment1.middle;
                    var f2 = segment2.middle;
                    var f3 = segment3.middle;
                    var f4 = segment4.middle;
                    if (this.dichoStyle == SquareDichotomer.DichoStyle.fourSquares) {
                        var position = new mathis.XYZ(0, 0, 0);
                        mathis.geo.baryCenter([segment1.a.position, segment1.b.position, segment3.a.position, segment3.b.position], [1 / 4, 1 / 4, 1 / 4, 1 / 4], position);
                        var dichoLevel = Math.max(segment1.a.dichoLevel, segment1.b.dichoLevel, segment3.a.dichoLevel, segment3.b.dichoLevel) + 1;
                        var center = this.mamesh.newVertex(position, dichoLevel, this.newParamForCenter(segment1.a.param, segment1.b.param, segment3.a.param, segment3.b.param));
                        var aNewCetSegment = new mathis.Segment(f1, f3);
                        aNewCetSegment.middle = center;
                        this.mamesh.cutSegmentsDico[mathis.Segment.segmentId(f1.hashNumber, f3.hashNumber)] = aNewCetSegment;
                        newSquares.push(v1, f1, center, f4);
                        newSquares.push(v2, f2, center, f1);
                        newSquares.push(v3, f3, center, f2);
                        newSquares.push(v4, f4, center, f3);
                    }
                    else if (this.dichoStyle == SquareDichotomer.DichoStyle.fourTriangles) {
                        newSquares.push(f1, f2, f3, f4);
                        this.mamesh.smallestTriangles.push(v1, f1, f4);
                        this.mamesh.smallestTriangles.push(v2, f2, f1);
                        this.mamesh.smallestTriangles.push(v3, f3, f2);
                        this.mamesh.smallestTriangles.push(v4, f4, f3);
                    }
                    else
                        throw 'ho ho';
                }
                this.mamesh.smallestSquares = newSquares;
                if (this.makeLinks) {
                    var linker = new mathis.linkModule.LinkCreaterSorterAndBorderDetecterByPolygons(this.mamesh);
                    linker.goChanging();
                }
            };
            SimplestSquareDichotomer.prototype.createAndAddSegmentsFromSquare = function (squares) {
                var segments = {};
                for (var f = 0; f < squares.length; f += 4) {
                    var v1 = squares[f];
                    var v2 = squares[f + 1];
                    var v3 = squares[f + 2];
                    var v4 = squares[f + 3];
                    this.mamesh.getOrCreateSegment(v1, v2, segments);
                    this.mamesh.getOrCreateSegment(v2, v3, segments);
                    this.mamesh.getOrCreateSegment(v3, v4, segments);
                    this.mamesh.getOrCreateSegment(v4, v1, segments);
                }
                return segments;
            };
            return SimplestSquareDichotomer;
        }());
        mameshModification.SimplestSquareDichotomer = SimplestSquareDichotomer;
        var SquareDichotomer;
        (function (SquareDichotomer) {
            (function (DichoStyle) {
                DichoStyle[DichoStyle["fourSquares"] = 0] = "fourSquares";
                DichoStyle[DichoStyle["fourTriangles"] = 1] = "fourTriangles";
            })(SquareDichotomer.DichoStyle || (SquareDichotomer.DichoStyle = {}));
            var DichoStyle = SquareDichotomer.DichoStyle;
        })(SquareDichotomer = mameshModification.SquareDichotomer || (mameshModification.SquareDichotomer = {}));
        var HexahedronSubdivider = (function () {
            function HexahedronSubdivider(mamesh) {
                this.subdivider = 3;
                this.hexahedronsToCut = null;
                this.suppressVolumes = null;
                this.createdPointsPerSegment = {};
                this.createdPointsPerSurface = {};
                this.newHexahedrons = null;
                this.points = null;
                this.mamesh = mamesh;
            }
            HexahedronSubdivider.prototype.checkArgs = function () {
                if ((this.hexahedronsToCut == null && this.mamesh.hexahedrons.length == 0) ||
                    (this.hexahedronsToCut != null && this.hexahedronsToCut.length == 0))
                    mathis.logger.c("HexahedronSubdivider : No input");
            };
            HexahedronSubdivider.prototype.go = function () {
                this.checkArgs();
                if (this.hexahedronsToCut == null)
                    this.hexahedronsToCut = this.mamesh.hexahedrons;
                this.points = new Array(this.subdivider + 1);
                for (var i = 0; i <= this.subdivider; i++) {
                    this.points[i] = new Array(this.subdivider + 1);
                    for (var j = 0; j <= this.subdivider; j++)
                        this.points[i][j] = new Array(this.subdivider + 1);
                }
                this.subdivideHexahedrons();
            };
            HexahedronSubdivider.prototype.subdivideHexahedronInVertices = function (h) {
                var _this = this;
                var n = this.subdivider;
                var coordsList = [[0, 0, 0], [n, 0, 0], [n, 0, n], [0, 0, n], [0, n, n], [0, n, 0], [n, n, 0], [n, n, n]];
                coordsList.forEach(function (_a, l) {
                    var i = _a[0], j = _a[1], k = _a[2];
                    _this.points[i][j][k] = _this.hexahedronsToCut[h + l];
                });
                var segmentList = [[0, 1], [1, 2], [2, 3], [3, 0],
                    [0, 5], [1, 6], [2, 7], [3, 4],
                    [4, 5], [5, 6], [6, 7], [7, 4]];
                for (var _i = 0, segmentList_1 = segmentList; _i < segmentList_1.length; _i++) {
                    var _a = segmentList_1[_i], na = _a[0], nb = _a[1];
                    var el = mathis.Hash.segment(this.hexahedronsToCut[h + na], this.hexahedronsToCut[h + nb]);
                    if (this.hexahedronsToCut[h + na].hashNumber > this.hexahedronsToCut[h + nb].hashNumber)
                        _b = [nb, na], na = _b[0], nb = _b[1];
                    var _c = coordsList[na], i1 = _c[0], j1 = _c[1], k1 = _c[2];
                    var _d = coordsList[nb], i2 = _d[0], j2 = _d[1], k2 = _d[2];
                    for (var l = 1; l < n; l++)
                        this.points[i1 + (i2 - i1) / n * l][j1 + (j2 - j1) / n * l][k1 + (k2 - k1) / n * l] = this.createdPointsPerSegment[el][l];
                }
                var surfacesList = [[0, 1, 2, 3], [4, 7, 6, 5],
                    [0, 3, 4, 5], [1, 6, 7, 2],
                    [2, 7, 4, 3], [0, 5, 6, 1]];
                for (var _e = 0, surfacesList_1 = surfacesList; _e < surfacesList_1.length; _e++) {
                    var _f = surfacesList_1[_e], na = _f[0], nb = _f[1], nc = _f[2], nd = _f[3];
                    var el = mathis.Hash.quad(this.hexahedronsToCut[h + na], this.hexahedronsToCut[h + nb], this.hexahedronsToCut[h + nc], this.hexahedronsToCut[h + nd]);
                    while (this.hexahedronsToCut[h + na].hashNumber > this.hexahedronsToCut[h + nb].hashNumber ||
                        this.hexahedronsToCut[h + na].hashNumber > this.hexahedronsToCut[h + nc].hashNumber ||
                        this.hexahedronsToCut[h + na].hashNumber > this.hexahedronsToCut[h + nd].hashNumber)
                        _g = [nb, nc, nd, na], na = _g[0], nb = _g[1], nc = _g[2], nd = _g[3];
                    if (this.hexahedronsToCut[h + nb].hashNumber > this.hexahedronsToCut[h + nd].hashNumber)
                        _h = [nd, nb], nb = _h[0], nd = _h[1];
                    var _j = coordsList[na], i1 = _j[0], j1 = _j[1], k1 = _j[2];
                    var _k = coordsList[nb], i2 = _k[0], j2 = _k[1], k2 = _k[2];
                    var _l = coordsList[nc], i3 = _l[0], j3 = _l[1], k3 = _l[2];
                    for (var l = 1; l < n; l++)
                        for (var m = 1; m < n; m++)
                            this.points[i1 + (i2 - i1) / n * l + (i3 - i2) / n * m][j1 + (j2 - j1) / n * l + (j3 - j2) / n * m][k1 + (k2 - k1) / n * l + (k3 - k2) / n * m] = this.createdPointsPerSurface[el][l][m];
                }
                for (var i = 1; i < n; i++) {
                    for (var j = 1; j < n; j++) {
                        for (var k = 1; k < n; k++) {
                            var pos = new mathis.XYZ(0, 0, 0);
                            var x = i / n;
                            var y = j / n;
                            var z = k / n;
                            mathis.geo.baryCenter([this.hexahedronsToCut[h].position, this.hexahedronsToCut[h + 1].position,
                                this.hexahedronsToCut[h + 2].position, this.hexahedronsToCut[h + 3].position,
                                this.hexahedronsToCut[h + 4].position, this.hexahedronsToCut[h + 5].position,
                                this.hexahedronsToCut[h + 6].position, this.hexahedronsToCut[h + 7].position], [(1 - x) * (1 - y) * (1 - z), x * (1 - y) * (1 - z),
                                x * (1 - y) * z, (1 - x) * (1 - y) * z,
                                (1 - x) * y * z, (1 - x) * y * (1 - z),
                                x * y * (1 - z), x * y * z], pos);
                            this.points[i][j][k] = this.mamesh.newVertex(pos);
                        }
                    }
                }
                var _b, _g, _h;
            };
            HexahedronSubdivider.prototype.makeNewHexahedronsFromPoints = function () {
                if (this.suppressVolumes == null)
                    this.suppressVolumes = [];
                var n = this.subdivider;
                var _loop_3 = function(i) {
                    var _loop_4 = function(j) {
                        var _loop_5 = function(k) {
                            if (this_3.suppressVolumes.some(function (value) {
                                return value[0] == i && value[1] == j && value[2] == k;
                            }))
                                return "continue";
                            this_3.newHexahedrons.push.apply(this_3.newHexahedrons, [this_3.points[i][j][k], this_3.points[i + 1][j][k],
                                this_3.points[i + 1][j][k + 1], this_3.points[i][j][k + 1],
                                this_3.points[i][j + 1][k + 1], this_3.points[i][j + 1][k],
                                this_3.points[i + 1][j + 1][k], this_3.points[i + 1][j + 1][k + 1]]);
                        };
                        for (var k = 0; k < n; k++) {
                            _loop_5(k);
                        }
                    };
                    for (var j = 0; j < n; j++) {
                        _loop_4(j);
                    }
                };
                var this_3 = this;
                for (var i = 0; i < n; i++) {
                    _loop_3(i);
                }
            };
            HexahedronSubdivider.prototype.makeSurfacesVertices = function () {
                var list = [[0, 1, 2, 3], [4, 7, 6, 5],
                    [0, 3, 4, 5], [1, 6, 7, 2],
                    [2, 7, 4, 3], [0, 5, 6, 1]];
                for (var h = 0; h < this.hexahedronsToCut.length; h += 8) {
                    for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
                        var _a = list_1[_i], i = _a[0], j = _a[1], k = _a[2], l = _a[3];
                        if (this.createdPointsPerSurface[mathis.Hash.quad(this.hexahedronsToCut[h + i], this.hexahedronsToCut[h + j], this.hexahedronsToCut[h + k], this.hexahedronsToCut[h + l])] == null)
                            this.createdPointsPerSurface[mathis.Hash.quad(this.hexahedronsToCut[h + i], this.hexahedronsToCut[h + j], this.hexahedronsToCut[h + k], this.hexahedronsToCut[h + l])] =
                                this.subdivideSurface(this.hexahedronsToCut[h + i], this.hexahedronsToCut[h + j], this.hexahedronsToCut[h + k], this.hexahedronsToCut[h + l]);
                    }
                }
            };
            HexahedronSubdivider.prototype.makeSegmentsVertices = function () {
                var list = [[0, 1], [1, 2], [2, 3], [3, 0],
                    [0, 5], [1, 6], [2, 7], [3, 4],
                    [4, 5], [5, 6], [6, 7], [7, 4]];
                for (var k = 0; k < this.hexahedronsToCut.length; k += 8) {
                    for (var _i = 0, list_2 = list; _i < list_2.length; _i++) {
                        var _a = list_2[_i], i = _a[0], j = _a[1];
                        if (this.createdPointsPerSegment[mathis.Hash.segment(this.hexahedronsToCut[k + i], this.hexahedronsToCut[k + j])] == null)
                            this.createdPointsPerSegment[mathis.Hash.segment(this.hexahedronsToCut[k + i], this.hexahedronsToCut[k + j])] =
                                this.subdivideSegment(this.hexahedronsToCut[k + i], this.hexahedronsToCut[k + j]);
                    }
                }
            };
            HexahedronSubdivider.prototype.subdivideSegment = function (a, b) {
                _a = mathis.Hash.segmentOrd(a, b), a = _a[0], b = _a[1];
                var vertices = [];
                var n = this.subdivider;
                for (var i = 1; i < n; i++) {
                    var pos = new mathis.XYZ(0, 0, 0);
                    var x = i / n;
                    mathis.geo.baryCenter([a.position, b.position], [1 - x, x], pos);
                    vertices[i] = this.mamesh.newVertex(pos);
                }
                return vertices;
                var _a;
            };
            HexahedronSubdivider.prototype.subdivideSurface = function (a, b, c, d) {
                _a = mathis.Hash.quadOrd(a, b, c, d), a = _a[0], b = _a[1], c = _a[2], d = _a[3];
                var vertices = [];
                var n = this.subdivider;
                for (var i = 1; i < n; i++) {
                    vertices[i] = [];
                    for (var j = 1; j < n; j++) {
                        var pos = new mathis.XYZ(0, 0, 0);
                        var _b = [j / n, i / n], x = _b[0], y = _b[1];
                        mathis.geo.baryCenter([a.position, b.position, c.position, d.position], [(1 - x) * (1 - y), x * (1 - y), x * y, (1 - x) * y], pos);
                        vertices[i][j] = this.mamesh.newVertex(pos);
                    }
                }
                return vertices;
                var _a;
            };
            HexahedronSubdivider.prototype.subdivideHexahedrons = function () {
                this.makeSegmentsVertices();
                this.makeSurfacesVertices();
                var s = this.hexahedronsToCut.length / 8;
                this.newHexahedrons = [];
                for (var i = 0; i < s; i++) {
                    this.subdivideHexahedronInVertices(i * 8);
                    this.makeNewHexahedronsFromPoints();
                }
            };
            return HexahedronSubdivider;
        }());
        mameshModification.HexahedronSubdivider = HexahedronSubdivider;
        var SurfacesFromHexahedrons = (function () {
            function SurfacesFromHexahedrons(mamesh) {
                this.hexahedronsToDraw = null;
                this.newSurfaces = null;
                this.surfacesSet = {};
                this.mamesh = mamesh;
            }
            SurfacesFromHexahedrons.prototype.checkArgs = function () {
                if ((this.hexahedronsToDraw == null && (this.mamesh.hexahedrons == null || this.mamesh.hexahedrons.length == 0))
                    || (this.hexahedronsToDraw != null && this.hexahedronsToDraw.length == 0))
                    mathis.logger.c("SurfacesFromHexahedrons : No input");
            };
            SurfacesFromHexahedrons.prototype.go = function () {
                this.checkArgs();
                if (this.hexahedronsToDraw == null)
                    this.hexahedronsToDraw = this.mamesh.hexahedrons;
                var surfacesList = [[0, 3, 2, 1], [4, 5, 6, 7],
                    [0, 5, 4, 3], [1, 2, 7, 6],
                    [2, 3, 4, 7], [0, 1, 6, 5]];
                this.newSurfaces = [];
                for (var h = 0; h < this.hexahedronsToDraw.length; h += 8) {
                    for (var _i = 0, surfacesList_2 = surfacesList; _i < surfacesList_2.length; _i++) {
                        var _a = surfacesList_2[_i], i = _a[0], j = _a[1], k = _a[2], l = _a[3];
                        var hash = mathis.Hash.quad(this.hexahedronsToDraw[h + i], this.hexahedronsToDraw[h + j], this.hexahedronsToDraw[h + k], this.hexahedronsToDraw[h + l]);
                        if (this.surfacesSet[hash] == null)
                            this.surfacesSet[hash] = [this.hexahedronsToDraw[h + i], this.hexahedronsToDraw[h + j],
                                this.hexahedronsToDraw[h + k], this.hexahedronsToDraw[h + l]];
                        else
                            delete this.surfacesSet[hash];
                    }
                }
                for (var el in this.surfacesSet)
                    this.newSurfaces.push.apply(this.newSurfaces, this.surfacesSet[el]);
                var len = this.newSurfaces.length;
                for (var i = 0; i < len; i += 5000)
                    this.mamesh.smallestSquares.push.apply(this.mamesh.smallestSquares, this.newSurfaces.slice(i, i + 5000));
            };
            return SurfacesFromHexahedrons;
        }());
        mameshModification.SurfacesFromHexahedrons = SurfacesFromHexahedrons;
        var MameshDeepCopier = (function () {
            function MameshDeepCopier(oldMamesh) {
                this.copyCutSegmentsDico = true;
                this.copyLines = true;
                this.oldMamesh = oldMamesh;
            }
            MameshDeepCopier.prototype.go = function () {
                var o2n = new mathis.HashMap();
                var newMamesh = new mathis.Mamesh();
                this.oldMamesh.vertices.forEach(function (oldV) {
                    var param = mathis.XYZ.newFrom(oldV.param);
                    var newVertex = newMamesh.newVertex(oldV.position, oldV.dichoLevel, param);
                    o2n.putValue(oldV, newVertex);
                    newVertex.importantMarker = oldV.importantMarker;
                    oldV.markers.forEach(function (enu) { return newVertex.markers.push(enu); });
                });
                this.oldMamesh.vertices.forEach(function (oldV) {
                    var newV = o2n.getValue(oldV);
                    for (var i = 0; i < oldV.links.length; i++) {
                        newV.links[i] = new mathis.Link(o2n.getValue(oldV.links[i].to));
                    }
                    for (var i = 0; i < oldV.links.length; i++) {
                        var oldLink = oldV.links[i];
                        var newLink = newV.links[i];
                        if (oldLink.opposites != null) {
                            newLink.opposites = [];
                            for (var _i = 0, _a = oldLink.opposites; _i < _a.length; _i++) {
                                var li = _a[_i];
                                var liIndex = oldV.links.indexOf(li);
                                newLink.opposites.push(newV.links[liIndex]);
                            }
                        }
                    }
                });
                this.oldMamesh.smallestTriangles.forEach(function (v) {
                    newMamesh.smallestTriangles.push(o2n.getValue(v));
                });
                this.oldMamesh.smallestSquares.forEach(function (v) {
                    newMamesh.smallestSquares.push(o2n.getValue(v));
                });
                if (this.copyLines) {
                    if (this.oldMamesh.linesWasMade) {
                        var oldStraight = this.oldMamesh.getStraightLinesAsVertices();
                        var oldLoop = this.oldMamesh.getLoopLinesAsVertices();
                        newMamesh.lines = [];
                        oldStraight.forEach(function (line) {
                            var newLine = [];
                            line.forEach(function (v) {
                                newLine.push(o2n.getValue(v));
                            });
                            newMamesh.lines.push(new mathis.Line(newLine, false));
                        });
                        oldLoop.forEach(function (line) {
                            var newLine = [];
                            line.forEach(function (v) {
                                newLine.push(o2n.getValue(v));
                            });
                            newMamesh.lines.push(new mathis.Line(newLine, true));
                        });
                    }
                }
                if (this.copyCutSegmentsDico) {
                    for (var key in this.oldMamesh.cutSegmentsDico) {
                        var oldSegment = this.oldMamesh.cutSegmentsDico[key];
                        var newA = o2n.getValue(oldSegment.a);
                        var newB = o2n.getValue(oldSegment.b);
                        var newSegment = new mathis.Segment(newA, newB);
                        newSegment.middle = o2n.getValue(oldSegment.middle);
                        if (oldSegment.orth1 != null)
                            newSegment.orth1 = o2n.getValue(oldSegment.orth1);
                        if (oldSegment.orth2 != null)
                            newSegment.orth2 = o2n.getValue(oldSegment.orth2);
                        newMamesh.cutSegmentsDico[mathis.Segment.segmentId(newA.hashNumber, newB.hashNumber)] = newSegment;
                    }
                }
                else
                    this.copyCutSegmentsDico = null;
                return newMamesh;
            };
            return MameshDeepCopier;
        }());
        mameshModification.MameshDeepCopier = MameshDeepCopier;
        var PercolationOnLinks = (function () {
            function PercolationOnLinks(mameshOrVertices) {
                var _this = this;
                this.percolationProba = 0.5;
                this.probaToPercolateFunction = function (vertex) {
                    if (vertex.links.length == 3)
                        return 0;
                    if (vertex.links.length == 4)
                        return 0.3 * _this.percolationProba;
                    if (vertex.links.length == 5)
                        return 0.6 * _this.percolationProba;
                    if (vertex.links.length >= 6)
                        return _this.percolationProba;
                };
                this.SUB_random = new mathis.proba.Random();
                this.doNotPercolateOnBorder = true;
                this.maxPercolationForAVertexAlreadyPercolate = 0;
                if (mameshOrVertices instanceof mathis.Mamesh) {
                    this.IN_vertices = mameshOrVertices.vertices;
                }
                else {
                    this.IN_vertices = mameshOrVertices;
                }
            }
            PercolationOnLinks.prototype.goChanging = function () {
                if (this.IN_vertices == null)
                    throw 'vertices must be specifiate';
                var vertexToNbLink = new mathis.HashMap();
                for (var _i = 0, _a = this.IN_vertices; _i < _a.length; _i++) {
                    var v = _a[_i];
                    vertexToNbLink.putValue(v, v.links.length);
                }
                for (var _b = 0, _c = this.IN_vertices; _b < _c.length; _b++) {
                    var v = _c[_b];
                    if (!(this.doNotPercolateOnBorder && v.hasMark(mathis.Vertex.Markers.border))) {
                        if (this.SUB_random.pseudoRand() < this.probaToPercolateFunction(v)) {
                            var randInd = this.SUB_random.pseudoRandInt(v.links.length);
                            var randVoi = v.links[randInd].to;
                            if (randVoi.links.length >= vertexToNbLink.getValue(randVoi) - this.maxPercolationForAVertexAlreadyPercolate)
                                mathis.Vertex.separateTwoVoisins(v, randVoi);
                        }
                    }
                }
            };
            return PercolationOnLinks;
        }());
        mameshModification.PercolationOnLinks = PercolationOnLinks;
        var MameshCleaner = (function () {
            function MameshCleaner(mamesh) {
                this.OUT_nbLinkSuppressed = 0;
                this.OUT_nbVerticesSuppressed = 0;
                this.suppressCellWithNoVoisin = true;
                this.suppressLinkWithoutOppositeFunction = function (v) { return (v.links.length >= 5); };
                this.IN_mamesh = mamesh;
            }
            MameshCleaner.prototype.goChanging = function () {
                if (this.IN_mamesh == null)
                    throw 'a Mamesh is require as IN_arg';
                if (this.suppressLinkWithoutOppositeFunction != null)
                    this.suppressLinkWithoutOpposite();
            };
            MameshCleaner.prototype.suppressLinkWithoutOpposite = function () {
                var goOn = true;
                while (goOn) {
                    goOn = false;
                    for (var _i = 0, _a = this.IN_mamesh.vertices; _i < _a.length; _i++) {
                        var v = _a[_i];
                        if (this.suppressLinkWithoutOppositeFunction(v)) {
                            for (var i = 0; i < v.links.length; i++) {
                                var li = v.links[i];
                                if (li.opposites == null) {
                                    goOn = true;
                                    mathis.Vertex.separateTwoVoisins(v, li.to);
                                    this.OUT_nbLinkSuppressed++;
                                    break;
                                }
                            }
                        }
                    }
                }
                if (this.suppressCellWithNoVoisin) {
                    var indexToSuppress = [];
                    for (var i = 0; i < this.IN_mamesh.vertices.length; i++) {
                        if (this.IN_mamesh.vertices[i].links.length == 0) {
                            indexToSuppress.push(i);
                            this.OUT_nbVerticesSuppressed++;
                        }
                    }
                    this.IN_mamesh.vertices = mathis.tab.arrayMinusSomeIndices(this.IN_mamesh.vertices, indexToSuppress);
                }
            };
            return MameshCleaner;
        }());
        mameshModification.MameshCleaner = MameshCleaner;
    })(mameshModification = mathis.mameshModification || (mathis.mameshModification = {}));
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    function jQueryOK(ifNotThrowException) {
        if (ifNotThrowException === void 0) { ifNotThrowException = false; }
        if (typeof $ !== 'undefined')
            return true;
        if (ifNotThrowException)
            throw "jQuery is not present";
        else
            return false;
    }
    mathis.jQueryOK = jQueryOK;
    var PeriodicAction = (function () {
        function PeriodicAction(action) {
            this.nbTimesThisActionMustBeFired = Number.POSITIVE_INFINITY;
            this.isPaused = false;
            this.firedCount = 0;
            this.id = "";
            this.frameInterval = null;
            this.timeIntervalMilli = null;
            this.passageOrderIndex = 1;
            this.action = action;
            this.lastTimeFired = performance.now();
        }
        return PeriodicAction;
    }());
    mathis.PeriodicAction = PeriodicAction;
    var MathisFrame = (function () {
        function MathisFrame(htmlElementOrId, addDefaultCameraAndLight, emptyForTest) {
            var _this = this;
            if (htmlElementOrId === void 0) { htmlElementOrId = null; }
            if (addDefaultCameraAndLight === void 0) { addDefaultCameraAndLight = true; }
            if (emptyForTest === void 0) { emptyForTest = false; }
            this.callbackIfWebglNotHere = null;
            this.periodicActions = [];
            this.sortAction = function (action1, action2) { return action1.passageOrderIndex - action2.passageOrderIndex; };
            this.backgroundColor = new mathis.Color("#d3d3d3");
            this.parentWidth = null;
            if (emptyForTest)
                return;
            if (htmlElementOrId == null) {
                var html = document.getElementsByTagName("html")[0];
                html.style.height = "100%";
                html.style.width = "100%";
                html.style.padding = "0";
                html.style.margin = "0";
                this.canvasParent = document.getElementsByTagName("body")[0];
                this.canvasParent.style.height = "100%";
                this.canvasParent.style.width = "100%";
                this.canvasParent.style.padding = "0";
                this.canvasParent.style.margin = "0";
            }
            else {
                if (typeof htmlElementOrId == 'string') {
                    this.canvasParent = document.getElementById(htmlElementOrId);
                    if (this.canvasParent == null)
                        throw 'the id:' + htmlElementOrId + ' does not correspond to any HTMLElement';
                }
                else if (htmlElementOrId instanceof HTMLElement)
                    this.canvasParent = htmlElementOrId;
                else
                    throw 'htmlElementOrId must be an htmlElement or the id of an html element';
            }
            if (this.canvasParent.offsetHeight < 10)
                throw "the container-height is too small. Perhaps no css-included ?";
            if (this.canvasParent.offsetWidth < 10)
                throw "the container-width is too small.  Perhaps no css-included ?";
            this.canvas = document.createElement('canvas');
            this.canvas.style.touchAction = "none";
            this.canvasParent.appendChild(this.canvas);
            this.set100(this.canvas);
            this.callbackIfWebglNotHere = function () {
                setTimeout(function () {
                    var $noWebGL = document.createElement("DIV");
                    $noWebGL.id = "noWebGL";
                    $noWebGL.innerHTML =
                        "<h3> Activez WebGL et relancez la page.</h3>\n                     <p> Safari: D\u00E9veloppement > Activer WebGL</p>";
                    _this.canvasParent.appendChild($noWebGL);
                    _this.canvasParent.style.position = "absolute";
                    _this.canvasParent.style.top = "0";
                    _this.canvasParent.style.left = "0";
                    _this.canvasParent.style.textAlign = "center";
                    _this.canvasParent.style.zIndex = "1001";
                    _this.canvasParent.style.backgroundColor = "red";
                }, 100);
            };
            try {
                this.engine = new BABYLON.Engine(this.canvas, true);
            }
            catch (e) {
                mathis.logger.c('webGL seems to not be present. Here is the message from Babylon:' + e);
                this.callbackIfWebglNotHere();
                this.engine = null;
            }
            if (this.engine != null) {
                this.resetScene();
                var count = 0;
                var minFps = 0;
                var frameCount_1 = 0;
                this.engine.runRenderLoop(function () {
                    frameCount_1++;
                    for (var key in _this.periodicActions) {
                        var act = _this.periodicActions[key];
                        if (act.isPaused)
                            continue;
                        if (act.timeIntervalMilli == null && act.frameInterval == null) {
                            act.frameInterval = 1;
                            mathis.logger.c("no intervalle given for a periodic action: by default the action is fired every frame");
                        }
                        if (act.timeIntervalMilli != null) {
                            var time = performance.now();
                            if (time - act.lastTimeFired > act.timeIntervalMilli) {
                                _this.fireAction(act);
                                act.lastTimeFired = time;
                            }
                        }
                        else if (act.frameInterval != null && frameCount_1 % act.frameInterval == 0)
                            _this.fireAction(act);
                    }
                    _this.scene.render();
                    count++;
                    var fps = _this.engine.getFps();
                    if (fps < minFps)
                        minFps = fps;
                    if (count % 100 == 0) {
                        if (_this.$info != null)
                            _this.$info.textContent = minFps.toFixed();
                        minFps = Number.MAX_VALUE;
                    }
                });
                this.domEventsHandler();
            }
            if (addDefaultCameraAndLight) {
                this.addDefaultLight();
                this.addDefaultCamera();
            }
            if (jQueryOK()) {
                this.messageDiv = new MessageDiv(this);
                this.subWindow_NE = new SubWindow(this, 'NE');
                this.subWindow_NW = new SubWindow(this, 'NW');
                this.subWindow_N = new SubWindow(this, 'N');
                this.subWindow_SE = new SubWindow(this, 'SE');
                this.subWindow_SW = new SubWindow(this, 'SW');
                this.subWindow_S = new SubWindow(this, 'S');
                this.subWindow_W = new SubWindow(this, 'W');
                this.subWindow_E = new SubWindow(this, 'E');
            }
        }
        MathisFrame.prototype.showFPSinCorner = function () {
            this.$info = document.createElement("DIV");
            this.canvasParent.appendChild(this.$info);
            this.$info.style.position = 'absolute';
            this.$info.style.top = '0';
            this.$info.style.left = '0';
            this.$info.style.width = '100px';
            this.$info.style.height = '20px';
            this.$info.style.backgroundColor = 'red';
            this.$info.style.zIndex = '1000';
        };
        MathisFrame.prototype.dispose = function () {
            this.engine.dispose();
        };
        MathisFrame.prototype.resetScene = function () {
            if (this.scene != null)
                this.scene.dispose();
            this.scene = new BABYLON.Scene(this.engine);
            this.scene.clearColor = this.backgroundColor.toBABYLON_Color4();
        };
        MathisFrame.prototype.clearScene = function (clearCamera, clearLights, clearSkybox) {
            if (clearCamera === void 0) { clearCamera = true; }
            if (clearLights === void 0) { clearLights = true; }
            if (clearSkybox === void 0) { clearSkybox = true; }
            if (this.scene == null)
                throw 'no scene to clear';
            var meshesToKeep = [];
            if (this.scene.activeCamera != null && !clearCamera) {
                if (this.scene.activeCamera instanceof mathis.macamera.GrabberCamera) {
                    var macam = this.scene.activeCamera;
                    for (var _i = 0, _a = macam.grabbers; _i < _a.length; _i++) {
                        var grab = _a[_i];
                        meshesToKeep.push(grab.mesh);
                    }
                }
            }
            else {
                this.scene.cameras = [];
                if (this.scene.activeCamera != null)
                    this.scene.activeCamera.detachControl(this.canvas);
                this.scene.activeCamera = null;
            }
            if (!clearSkybox)
                meshesToKeep.push(this.skybox);
            else
                this.skybox = null;
            this.scene.meshes = meshesToKeep;
            if (clearLights)
                this.scene.lights = [];
        };
        MathisFrame.prototype.emptyAllCorner = function () {
            jQueryOK(true);
            this.subWindow_NW.empty();
            this.subWindow_NE.empty();
            this.subWindow_N.empty();
            this.subWindow_SW.empty();
            this.subWindow_SE.empty();
            this.subWindow_S.empty();
            this.subWindow_W.empty();
            this.subWindow_E.empty();
        };
        MathisFrame.prototype.addDefaultLight = function () {
            var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(-1, 1, -1), this.scene);
            light0.diffuse = new BABYLON.Color3(1, 1, 1);
            light0.specular = new BABYLON.Color3(1, 1, 1);
            light0.groundColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        };
        MathisFrame.prototype.getGrabberCamera = function () {
            if (this.scene.activeCamera == null)
                throw "no camera defined";
            if (this.scene.activeCamera instanceof mathis.macamera.GrabberCamera)
                return this.scene.activeCamera;
            else
                throw "active camera is not a grabber camera";
        };
        MathisFrame.prototype.addDefaultCamera = function () {
            var grabber0 = new mathis.macamera.SphericalGrabber(this.scene);
            this.scene.activeCamera = new mathis.macamera.GrabberCamera(this, grabber0);
            this.scene.activeCamera.attachControl(this.canvas);
        };
        MathisFrame.prototype.pushPeriodicAction = function (action) {
            this.periodicActions.push(action);
            this.periodicActions.sort(this.sortAction);
        };
        MathisFrame.prototype.suppressPeriodicAction = function (action) {
            var index = this.periodicActions.indexOf(action);
            if (index == -1)
                throw 'this action is not registered';
            this.periodicActions.splice(index, 1);
        };
        MathisFrame.prototype.cleanAllPeriodicActions = function () {
            this.periodicActions = [];
        };
        MathisFrame.prototype.pauseAllPeriodicActions = function () {
            for (var _i = 0, _a = this.periodicActions; _i < _a.length; _i++) {
                var action = _a[_i];
                action.isPaused = true;
            }
        };
        MathisFrame.prototype.unpauseAllPeriodicActions = function () {
            for (var _i = 0, _a = this.periodicActions; _i < _a.length; _i++) {
                var action = _a[_i];
                action.isPaused = false;
            }
        };
        MathisFrame.prototype.fireAction = function (ac) {
            ac.action();
            ac.firedCount++;
            if (ac.firedCount >= ac.nbTimesThisActionMustBeFired) {
                this.suppressPeriodicAction(ac);
            }
        };
        MathisFrame.prototype.set100 = function (element) {
            element.style.position = "absolute";
            element.style.top = "0";
            element.style.left = "0";
            element.style.width = "100%";
            element.style.height = "100%";
        };
        MathisFrame.prototype.onParentDimChange = function () {
            var width = this.canvasParent.offsetWidth;
            if (this.parentWidth == null)
                this.parentWidth = width;
            else {
                if (width != this.parentWidth) {
                    this.parentWidth = width;
                    this.engine.resize();
                    console.log("dim of parent of canvas  changes");
                }
            }
        };
        MathisFrame.prototype.domEventsHandler = function () {
            var _this = this;
            this.parentWidth = this.canvasParent.offsetWidth;
            window.addEventListener("resize", function () {
                _this.onParentDimChange();
            });
            setInterval(function () {
                _this.onParentDimChange();
            }, 1000);
            var globalClickAction = function () {
                var pickResult = _this.scene.pick(_this.scene.pointerX, _this.scene.pointerY, function (mesh) { return mesh.isPickable; }, false);
                if (pickResult.pickedMesh != null) {
                    var clickFuntion = pickResult.pickedMesh.onClick;
                    if (clickFuntion != null) {
                        clickFuntion(pickResult.pickedPoint);
                    }
                }
            };
            var timeOfDown;
            var downAction = function () {
                timeOfDown = performance.now();
            };
            var upAction = function () {
                if (performance.now() - timeOfDown < 500)
                    globalClickAction();
            };
            var prefix = BABYLON.Tools.GetPointerPrefix();
            this.canvas.addEventListener(prefix + "down", downAction, false);
            this.canvas.addEventListener(prefix + "up", upAction, false);
        };
        return MathisFrame;
    }());
    mathis.MathisFrame = MathisFrame;
    var SubWindow = (function () {
        function SubWindow(mathisFrame, className) {
            this.mathisFrame = mathisFrame;
            jQueryOK(true);
            this.$visual = $('<div class="subWindow">');
            this.$visual.addClass(className);
            this.mathisFrame.canvasParent.appendChild(this.$visual[0]);
        }
        SubWindow.prototype.appendAndGoToLine = function ($obj) {
            this.$visual.append($('<div>').append($obj));
        };
        SubWindow.prototype.append = function ($obj) {
            this.$visual.append($obj);
        };
        SubWindow.prototype.empty = function () {
            this.$visual.empty();
        };
        return SubWindow;
    }());
    mathis.SubWindow = SubWindow;
    var MessageDiv = (function () {
        function MessageDiv(mathisFrame) {
            this.mathisFrame = mathisFrame;
        }
        MessageDiv.prototype.addInMathisFrame = function () {
            this.$logDiv = document.createElement("DIV");
            this.mathisFrame.canvasParent.appendChild(this.$logDiv);
            this.$logDiv.style.position = 'absolute';
            this.$logDiv.style.top = '0';
            this.$logDiv.style.left = '0';
            this.$logDiv.style.width = '100%';
            this.$logDiv.style.backgroundColor = 'white';
            this.$logDiv.style.zIndex = '900';
        };
        MessageDiv.prototype.append = function (message) {
            if (this.$logDiv == null)
                this.addInMathisFrame();
            var $message = document.createElement("DIV");
            $message.innerHTML = message;
            this.$logDiv.appendChild($message);
        };
        MessageDiv.prototype.empty = function () {
            if (this.$logDiv == null)
                return;
            this.$logDiv.innerHTML = "";
        };
        return MessageDiv;
    }());
    mathis.MessageDiv = MessageDiv;
    var EmptyMessageDivForTest = (function (_super) {
        __extends(EmptyMessageDivForTest, _super);
        function EmptyMessageDivForTest() {
            _super.apply(this, arguments);
        }
        EmptyMessageDivForTest.prototype.addInMathisFrame = function () { };
        EmptyMessageDivForTest.prototype.append = function (message) { };
        EmptyMessageDivForTest.prototype.empty = function () { };
        return EmptyMessageDivForTest;
    }(MessageDiv));
    mathis.EmptyMessageDivForTest = EmptyMessageDivForTest;
    var EmptyMathisFrameForFastTest = (function (_super) {
        __extends(EmptyMathisFrameForFastTest, _super);
        function EmptyMathisFrameForFastTest() {
            _super.call(this, null, null, true);
            this.messageDiv = new EmptyMessageDivForTest(this);
        }
        EmptyMathisFrameForFastTest.prototype.dispose = function () { };
        EmptyMathisFrameForFastTest.prototype.resetScene = function () { };
        EmptyMathisFrameForFastTest.prototype.clearScene = function (clearCamera, clearLights, clearSkybox) {
            if (clearCamera === void 0) { clearCamera = true; }
            if (clearLights === void 0) { clearLights = true; }
            if (clearSkybox === void 0) { clearSkybox = true; }
        };
        EmptyMathisFrameForFastTest.prototype.addDefaultLight = function () { };
        EmptyMathisFrameForFastTest.prototype.getGrabberCamera = function () { return new EmptyGrabberCameraForTest(); };
        EmptyMathisFrameForFastTest.prototype.addDefaultCamera = function () { };
        EmptyMathisFrameForFastTest.prototype.pushPeriodicAction = function (action) { };
        EmptyMathisFrameForFastTest.prototype.set100 = function (element) { };
        return EmptyMathisFrameForFastTest;
    }(MathisFrame));
    mathis.EmptyMathisFrameForFastTest = EmptyMathisFrameForFastTest;
    var EmptyGrabberCameraForTest = (function () {
        function EmptyGrabberCameraForTest() {
        }
        EmptyGrabberCameraForTest.prototype.changePosition = function (position, smoothMovement) {
            if (smoothMovement === void 0) { smoothMovement = true; }
        };
        EmptyGrabberCameraForTest.prototype.changeFrontDir = function (position, smoothMovement) {
            if (smoothMovement === void 0) { smoothMovement = true; }
        };
        EmptyGrabberCameraForTest.prototype.changeUpVector = function (position, smoothMovement) {
            if (smoothMovement === void 0) { smoothMovement = true; }
        };
        return EmptyGrabberCameraForTest;
    }());
    mathis.EmptyGrabberCameraForTest = EmptyGrabberCameraForTest;
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    var periodicWorld;
    (function (periodicWorld) {
        var Vector3 = BABYLON.Vector3;
        var StandardMaterial = BABYLON.StandardMaterial;
        var FundamentalDomain = (function () {
            function FundamentalDomain(vecA, vecB, vecC) {
                this.vecA = vecA;
                this.vecB = vecB;
                this.vecC = vecC;
                this.matWebCoordinateToPoint = new mathis.MM();
                this.matPointToWebCoordinate = new mathis.MM();
                this.isCartesian = false;
                this.pointWC = new mathis.XYZ(0, 0, 0);
                this.domainCenter = new mathis.XYZ(0, 0, 0);
                this.domainAroundCenter = new mathis.XYZ(0, 0, 0);
                this._positionWC = new WebCoordinate(0, 0, 0);
                this._domainPosition = new Domain(0, 0, 0);
                this._domainPositioncenter = new mathis.XYZ(0, 0, 0);
                this._zero = new mathis.XYZ(0, 0, 0);
                mathis.geo.matrixFromLines(vecA, vecB, vecC, this.matWebCoordinateToPoint);
                mathis.geo.inverse(this.matWebCoordinateToPoint, this.matPointToWebCoordinate);
            }
            FundamentalDomain.prototype.contains = function (point) {
                throw "must be override";
            };
            FundamentalDomain.prototype.webCoordinateToPoint = function (webCoordinate, result) {
                return mathis.geo.multiplicationMatrixVector(this.matWebCoordinateToPoint, webCoordinate, result);
            };
            FundamentalDomain.prototype.pointToWebCoordinate = function (point, result) {
                mathis.geo.multiplicationMatrixVector(this.matPointToWebCoordinate, point, result);
            };
            FundamentalDomain.prototype.getDomainContaining = function (point) {
                this.pointToWebCoordinate(point, this.pointWC);
                if (this.isCartesian)
                    return new Domain(this.pointWC.x, this.pointWC.y, this.pointWC.z);
                else {
                    for (var i = -1; i <= 1; i++) {
                        for (var j = -1; j <= 1; j++) {
                            for (var k = -1; k <= 1; k++) {
                                var domainAround = new Domain(this.pointWC.x + i, this.pointWC.y + j, this.pointWC.z + k);
                                if (domainAround.contains(point, this))
                                    return domainAround;
                            }
                        }
                    }
                }
            };
            FundamentalDomain.prototype.getDomainsAround = function (nbRepetitions, distMax, exludeCentralDomain) {
                if (exludeCentralDomain === void 0) { exludeCentralDomain = true; }
                var result = [];
                var intRep = Math.floor(nbRepetitions /= 2);
                var bounding = new mathis.XYZ(intRep, intRep, intRep);
                for (var i = -bounding.x; i <= bounding.x; i++) {
                    for (var j = -bounding.y; j <= bounding.y; j++) {
                        for (var k = -bounding.z; k <= bounding.z; k++) {
                            var domainAround = new Domain(i, j, k);
                            if (!(exludeCentralDomain && i == 0 && j == 0 && k == 0)) {
                                domainAround.getCenter(this, this.domainAroundCenter);
                                if (mathis.XYZ.DistanceSquared(this.domainAroundCenter, this.domainCenter) < distMax * distMax)
                                    result.push(domainAround);
                            }
                        }
                    }
                }
                return result;
            };
            FundamentalDomain.prototype.modulo = function (position, positionInsideFD) {
                this.pointToWebCoordinate(position, this._positionWC);
                this._domainPosition.whichContains(this._positionWC);
                this._domainPosition.getCenter(this, this._domainPositioncenter);
                positionInsideFD.copyFrom(position).substract(this._domainPositioncenter);
            };
            return FundamentalDomain;
        }());
        periodicWorld.FundamentalDomain = FundamentalDomain;
        var CartesianFundamentalDomain = (function (_super) {
            __extends(CartesianFundamentalDomain, _super);
            function CartesianFundamentalDomain(vecA, vecB, vecC) {
                _super.call(this, vecA, vecB, vecC);
                this.pointWC2 = new mathis.XYZ(0, 0, 0);
                this.isCartesian = true;
            }
            CartesianFundamentalDomain.prototype.contains = function (point) {
                _super.prototype.pointToWebCoordinate.call(this, point, this.pointWC2);
                if (Math.abs(this.pointWC2.x) > 1 / 2)
                    return false;
                if (Math.abs(this.pointWC2.y) > 1 / 2)
                    return false;
                if (Math.abs(this.pointWC2.z) > 1 / 2)
                    return false;
                return true;
            };
            CartesianFundamentalDomain.prototype.drawMe = function (scene) {
                var box = BABYLON.Mesh.CreateBox('', 1, scene);
                box.scaling = new Vector3(this.vecA.length(), this.vecB.length(), this.vecC.length());
                box.material = new StandardMaterial('', scene);
                box.material.alpha = 0.2;
            };
            CartesianFundamentalDomain.prototype.getCorner = function () {
                var corner = new mathis.XYZ(0, 0, 0);
                corner.add(this.vecA).add(this.vecB).add(this.vecC);
                corner.scaleInPlace(-0.5);
                return corner;
            };
            CartesianFundamentalDomain.prototype.getArretes = function (scene) {
                var corner = this.getCorner();
                var result = new Array();
                var radius = 1;
                var originalMesh = BABYLON.Mesh.CreateCylinder('', 1, radius, radius, 12, null, scene);
                var originalMesh1 = BABYLON.Mesh.CreateCylinder('', 1, radius, radius, 12, null, scene);
                var originalMesh2 = BABYLON.Mesh.CreateCylinder('', 1, radius, radius, 12, null, scene);
                new mathis.visu3d.ElongateAMeshFromBeginToEnd(corner, mathis.XYZ.newFrom(corner).add(this.vecA), originalMesh).goChanging();
                new mathis.visu3d.ElongateAMeshFromBeginToEnd(corner, mathis.XYZ.newFrom(corner).add(this.vecB), originalMesh1).goChanging();
                new mathis.visu3d.ElongateAMeshFromBeginToEnd(corner, mathis.XYZ.newFrom(corner).add(this.vecC), originalMesh2).goChanging();
                result.push(originalMesh);
                result.push(originalMesh1);
                result.push(originalMesh2);
                return result;
            };
            return CartesianFundamentalDomain;
        }(FundamentalDomain));
        periodicWorld.CartesianFundamentalDomain = CartesianFundamentalDomain;
        var WebCoordinate = (function (_super) {
            __extends(WebCoordinate, _super);
            function WebCoordinate() {
                _super.apply(this, arguments);
            }
            return WebCoordinate;
        }(mathis.XYZ));
        periodicWorld.WebCoordinate = WebCoordinate;
        var Domain = (function (_super) {
            __extends(Domain, _super);
            function Domain(i, j, k) {
                _super.call(this, Math.round(i), Math.round(j), Math.round(k));
                this._point = new mathis.XYZ(0, 0, 0);
                this._domainCenter = new mathis.XYZ(0, 0, 0);
            }
            Domain.prototype.whichContains = function (webCo) {
                this.x = Math.round(webCo.x);
                this.y = Math.round(webCo.y);
                this.z = Math.round(webCo.z);
                return this;
            };
            Domain.prototype.equals = function (otherDomain) {
                if (otherDomain.x != this.x)
                    return false;
                if (otherDomain.y != this.y)
                    return false;
                if (otherDomain.z != this.z)
                    return false;
                return true;
            };
            Domain.prototype.getCenter = function (fundamentalDomain, result) {
                fundamentalDomain.webCoordinateToPoint(this, result);
            };
            Domain.prototype.contains = function (point, fundamentalDomain) {
                this._point.copyFrom(point);
                this.getCenter(fundamentalDomain, this._domainCenter);
                this._point.substract(this._domainCenter);
                return fundamentalDomain.contains(this._point);
            };
            return Domain;
        }(WebCoordinate));
        periodicWorld.Domain = Domain;
        var Multiply = (function () {
            function Multiply(fd, maxDistance, nbRepetitions) {
                this.fd = fd;
                this.maxDistance = maxDistance;
                this.nbRepetitions = nbRepetitions;
            }
            Multiply.prototype.addMesh = function (mesh) {
                var _this = this;
                var visibleDomains = this.fd.getDomainsAround(this.nbRepetitions, this.maxDistance);
                visibleDomains.forEach(function (domain) {
                    var domainCenter = new mathis.XYZ(0, 0, 0);
                    var clone = mesh.createInstance('');
                    domain.getCenter(_this.fd, domainCenter);
                    clone.position.addInPlace(domainCenter);
                    clone.visibility = 1;
                    clone.isVisible = true;
                });
            };
            Multiply.prototype.addInstancedMesh = function (mesh) {
                var _this = this;
                var visibleDomains = this.fd.getDomainsAround(this.nbRepetitions, this.maxDistance);
                visibleDomains.forEach(function (domain) {
                    var domainCenter = new mathis.XYZ(0, 0, 0);
                    var clone = mesh.sourceMesh.createInstance('');
                    clone.scaling.copyFrom(mesh.scaling);
                    clone.position.copyFrom(mesh.position);
                    clone.rotationQuaternion = new BABYLON.Quaternion(0, 0, 0, 0);
                    clone.rotationQuaternion.copyFrom(mesh.rotationQuaternion);
                    domain.getCenter(_this.fd, domainCenter);
                    clone.position.addInPlace(domainCenter);
                    clone.visibility = 1;
                    clone.isVisible = true;
                });
            };
            Multiply.prototype.addAbstractMesh = function (abMesh) {
                if (abMesh instanceof BABYLON.Mesh)
                    this.addMesh(abMesh);
                else if (abMesh instanceof BABYLON.InstancedMesh)
                    this.addInstancedMesh(abMesh);
            };
            return Multiply;
        }());
        periodicWorld.Multiply = Multiply;
    })(periodicWorld = mathis.periodicWorld || (mathis.periodicWorld = {}));
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    var polyhedron;
    (function (polyhedron_1) {
        polyhedron_1.platonic = [
            "tetrahedron",
            "cube",
            "octahedron",
            "dodecahedron",
            "icosahedron"
        ];
        polyhedron_1.archimedean = [
            "truncated tetrahedron",
            "cuboctahedron",
            "truncated cube",
            "truncated octahedron",
            "rhombicuboctahedron",
            "truncated cuboctahedron",
            "snub cube",
            "icosidodecahedron",
            "truncated dodecahedron",
            "truncated icosahedron",
            "rhombicosidodecahedron",
            "truncated icosidodecahedron",
            "snub dodecahedron"
        ];
        polyhedron_1.antiprisms = [
            "square antiprism",
            "pentagonal antiprism",
            "hexagonal antiprism",
            "octagonal antiprism",
            "decagonal antiprism"
        ];
        polyhedron_1.johnson = [
            "square pyramid",
            "pentagonal pyramid",
            "triangular cupola",
            "square cupola",
            "pentagonal cupola",
            "pentagonal rotunda",
            "elongated triangular pyramid",
            "elongated square pyramid",
            "elongated pentagonal pyramid",
            "gyroelongated square pyramid",
            "gyroelongated pentagonal pyramid",
            "triangular bipyramid",
            "pentagonal bipyramid",
            "elongated triangular bipyramid",
            "elongated square bipyramid",
            "elongated pentagonal bipyramid",
            "gyroelongated square bipyramid",
            "elongated triangular cupola",
            "elongated square cupola",
            "elongated pentagonal cupola",
            "elongated pentagonal rotunda",
            "gyroelongated triangular cupola",
            "gyroelongated square cupola",
            "gyroelongated pentagonal cupola",
            "gyroelongated pentagonal rotunda",
            "gyrobifastigium",
            "triangular orthobicupola",
            "square orthobicupola",
            "square gyrobicupola",
            "pentagonal orthobicupola",
            "pentagonal gyrobicupola",
            "pentagonal orthocupolarotunda",
            "pentagonal gyrocupolarotunda",
            "pentagonal orthobirotunda",
            "elongated triangular orthobicupola",
            "elongated triangular gyrobicupola",
            "elongated square gyrobicupola",
            "elongated pentagonal orthobicupola",
            "elongated pentagonal gyrobicupola",
            "elongated pentagonal orthocupolarotunda",
            "elongated pentagonal gyrocupolarotunda",
            "elongated pentagonal orthobirotunda",
            "elongated pentagonal gyrobirotunda",
            "gyroelongated triangular bicupola",
            "gyroelongated square bicupola",
            "gyroelongated pentagonal bicupola",
            "gyroelongated pentagonal cupolarotunda",
            "gyroelongated pentagonal birotunda",
            "augmented triangular prism",
            "biaugmented triangular prism",
            "triaugmented triangular prism",
            "augmented pentagonal prism",
            "biaugmented pentagonal prism",
            "augmented hexagonal prism",
            "parabiaugmented hexagonal prism",
            "metabiaugmented hexagonal prism",
            "triaugmented hexagonal prism",
            "augmented dodecahedron",
            "parabiaugmented dodecahedron",
            "metabiaugmented dodecahedron",
            "triaugmented dodecahedron",
            "metabidiminished icosahedron",
            "tridiminished icosahedron",
            "augmented tridiminished icosahedron",
            "augmented truncated tetrahedron",
            "augmented truncated cube",
            "biaugmented truncated cube",
            "augmented truncated dodecahedron",
            "parabiaugmented truncated dodecahedron",
            "metabiaugmented truncated dodecahedron",
            "triaugmented truncated dodecahedron",
            "gyrate rhombicosidodecahedron",
            "parabigyrate rhombicosidodecahedron",
            "metabigyrate rhombicosidodecahedron",
            "trigyrate rhombicosidodecahedron",
            "diminished rhombicosidodecahedron",
            "paragyrate diminished rhombicosidodecahedron",
            "metagyrate diminished rhombicosidodecahedron",
            "bigyrate diminished rhombicosidodecahedron",
            "parabidiminished rhombicosidodecahedron",
            "metabidiminished rhombicosidodecahedron",
            "gyrate bidiminished rhombicosidodecahedron",
            "tridiminished rhombicosidodecahedron",
            "snub disphenoid",
            "snub square antiprism",
            "sphenocorona",
            "augmented sphenocorona",
            "sphenomegacorona",
            "hebesphenomegacorona",
            "disphenocingulum",
            "bilunabirotunda",
            "triangular hebesphenorotunda"
        ];
        polyhedron_1.prisms = [
            "triangular prism",
            "pentagonal prism",
            "hexagonal prism",
            "octagonal prism",
            "decagonal prism"
        ];
        var Polyhedron = (function () {
            function Polyhedron(type) {
                this.makeLinks = true;
                this.type = type.toLowerCase();
            }
            Polyhedron.dataToMamesh = function (data) {
                var mamesh = new mathis.Mamesh();
                for (var _i = 0, _a = data.vertices; _i < _a.length; _i++) {
                    var ve = _a[_i];
                    mamesh.newVertex(new mathis.XYZ(ve[0], ve[1], ve[2]));
                }
                var maxNorm = Number.MIN_VALUE;
                for (var _b = 0, _c = mamesh.vertices; _b < _c.length; _b++) {
                    var vertex = _c[_b];
                    var norm = vertex.position.length();
                    if (norm > maxNorm)
                        maxNorm = norm;
                }
                for (var _d = 0, _e = mamesh.vertices; _d < _e.length; _d++) {
                    var vertex = _e[_d];
                    vertex.position.scale(1 / maxNorm);
                }
                var oneOverLength = 0;
                for (var _f = 0, _g = data.faces; _f < _g.length; _f++) {
                    var face = _g[_f];
                    if (face.length == 3)
                        mamesh.addATriangle(mamesh.vertices[face[0]], mamesh.vertices[face[1]], mamesh.vertices[face[2]]);
                    else if (face.length == 4)
                        mamesh.addASquare(mamesh.vertices[face[0]], mamesh.vertices[face[1]], mamesh.vertices[face[2]], mamesh.vertices[face[3]]);
                    else if (face.length >= 5) {
                        var centerVertex = mamesh.newVertex(new mathis.XYZ(0, 0, 0));
                        centerVertex.markers.push(mathis.Vertex.Markers.polygonCenter);
                        oneOverLength = 1 / (face.length);
                        var v = [mamesh.vertices[face[0]]];
                        var tab1 = [v[0].position];
                        var tab2 = [oneOverLength];
                        for (var i = 1; i < face.length; i++) {
                            v.push(mamesh.vertices[face[i]]);
                            tab1.push(v[i].position);
                            tab2.push(oneOverLength);
                        }
                        mathis.geo.baryCenter(tab1, tab2, centerVertex.position);
                        for (var i = 0; i < face.length; i++)
                            mamesh.addATriangle(v[i], v[(i + 1) % (face.length)], centerVertex);
                    }
                }
                new mathis.linkModule.LinkCreaterSorterAndBorderDetecterByPolygons(mamesh).goChanging();
                return mamesh;
            };
            Polyhedron.prototype.go = function () {
                var archimedea = [];
                archimedea["tetrahedron"] = {
                    vertices: [[0, 0, 1.732051], [1.632993, 0, -0.5773503], [-0.8164966, 1.414214, -0.5773503], [-0.8164966, -1.414214, -0.5773503]],
                    faces: [[0, 1, 2], [0, 2, 3], [0, 3, 1], [1, 3, 2]]
                };
                archimedea["cube"] = {
                    vertices: [[0.0, 0.0, 1.224745], [1.154701, 0.0, 0.4082483], [-0.5773503, 1.0, 0.4082483], [-0.5773503, -1.0, 0.4082483], [0.5773503, 1.0, -0.4082483], [0.5773503, -1.0, -0.4082483], [-1.154701, 0.0, -0.4082483], [0.0, 0.0, -1.224745]],
                    faces: [[0, 1, 4, 2], [0, 2, 6, 3], [0, 3, 5, 1], [1, 5, 7, 4], [2, 4, 7, 6], [3, 6, 7, 5]] };
                archimedea["octahedron"] = {
                    vertices: [[0, 0, 1.414214], [1.414214, 0, 0], [0, 1.414214, 0], [-1.414214, 0, 0], [0, -1.414214, 0], [0, 0, -1.414214]],
                    faces: [[0, 1, 2], [0, 2, 3], [0, 3, 4], [0, 4, 1], [1, 4, 5], [1, 5, 2], [2, 5, 3], [3, 5, 4]]
                };
                archimedea["dodecahedron"] = {
                    vertices: [[0, 0, 1.070466], [0.7136442, 0, 0.7978784], [-0.3568221, 0.618034, 0.7978784], [-0.3568221, -0.618034, 0.7978784], [0.7978784, 0.618034, 0.3568221], [0.7978784, -0.618034, 0.3568221], [-0.9341724, 0.381966, 0.3568221], [0.1362939, 1, 0.3568221], [0.1362939, -1, 0.3568221], [-0.9341724, -0.381966, 0.3568221], [0.9341724, 0.381966, -0.3568221], [0.9341724, -0.381966, -0.3568221], [-0.7978784, 0.618034, -0.3568221], [-0.1362939, 1, -0.3568221], [-0.1362939, -1, -0.3568221], [-0.7978784, -0.618034, -0.3568221], [0.3568221, 0.618034, -0.7978784], [0.3568221, -0.618034, -0.7978784], [-0.7136442, 0, -0.7978784], [0, 0, -1.070466]],
                    faces: [[0, 1, 4, 7, 2], [0, 2, 6, 9, 3], [0, 3, 8, 5, 1], [1, 5, 11, 10, 4], [2, 7, 13, 12, 6], [3, 9, 15, 14, 8], [4, 10, 16, 13, 7], [5, 8, 14, 17, 11], [6, 12, 18, 15, 9], [10, 11, 17, 19, 16], [12, 13, 16, 19, 18], [14, 15, 18, 19, 17]]
                };
                archimedea["icosahedron"] = {
                    vertices: [[0, 0, 1.175571], [1.051462, 0, 0.5257311], [0.3249197, 1, 0.5257311], [-0.8506508, 0.618034, 0.5257311], [-0.8506508, -0.618034, 0.5257311], [0.3249197, -1, 0.5257311], [0.8506508, 0.618034, -0.5257311], [0.8506508, -0.618034, -0.5257311], [-0.3249197, 1, -0.5257311], [-1.051462, 0, -0.5257311], [-0.3249197, -1, -0.5257311], [0, 0, -1.175571]],
                    faces: [[0, 1, 2], [0, 2, 3], [0, 3, 4], [0, 4, 5], [0, 5, 1], [1, 5, 7], [1, 7, 6], [1, 6, 2], [2, 6, 8], [2, 8, 3], [3, 8, 9], [3, 9, 4], [4, 9, 10], [4, 10, 5], [5, 10, 7], [6, 7, 11], [6, 11, 8], [7, 10, 11], [8, 11, 9], [9, 11, 10]]
                };
                archimedea["truncated tetrahedron"] = {
                    vertices: [[0, 0, 1.105542], [0.8528029, 0, 0.7035265], [-0.7106691, 0.4714045, 0.7035265], [0.3316456, -0.7856742, 0.7035265], [0.9949367, 0.4714045, -0.1005038], [-1.089693, 0.1571348, -0.1005038], [-0.5685352, 0.942809, -0.1005038], [-0.04737794, -1.099944, -0.1005038], [0.6159132, 0.1571348, -0.904534], [0.2842676, 0.942809, -0.5025189], [-0.758047, -0.6285394, -0.5025189], [0.09475587, -0.6285394, -0.904534]],
                    faces: [[0, 3, 1], [2, 6, 5], [4, 8, 9], [7, 10, 11], [0, 1, 4, 9, 6, 2], [0, 2, 5, 10, 7, 3], [1, 3, 7, 11, 8, 4], [5, 6, 9, 8, 11, 10]]
                };
                archimedea["truncated cube"] = {
                    vertices: [[0, 0, 1.042011], [0.5621693, 0, 0.8773552], [-0.4798415, 0.2928932, 0.8773552], [0.2569714, -0.5, 0.8773552], [0.8773552, 0.2928932, 0.4798415], [-0.9014684, 0.2071068, 0.4798415], [-0.5962706, 0.7071068, 0.4798415], [0.1405423, -0.9142136, 0.4798415], [1.017898, 0.2071068, -0.08232778], [0.7609261, 0.7071068, 0.08232778], [-1.017898, -0.2071068, 0.08232778], [-0.2810846, 1, 0.08232778], [-0.2810846, -1, 0.08232778], [0.2810846, -1, -0.08232778], [0.9014684, -0.2071068, -0.4798415], [0.2810846, 1, -0.08232778], [-0.7609261, -0.7071068, -0.08232778], [-0.8773552, -0.2928932, -0.4798415], [-0.1405423, 0.9142136, -0.4798415], [0.5962706, -0.7071068, -0.4798415], [0.4798415, -0.2928932, -0.8773552], [-0.5621693, 0, -0.8773552], [-0.2569714, 0.5, -0.8773552], [0, 0, -1.042011]],
                    faces: [[0, 3, 1], [2, 6, 5], [4, 8, 9], [7, 12, 13], [10, 17, 16], [11, 15, 18], [14, 19, 20], [21, 22, 23], [0, 1, 4, 9, 15, 11, 6, 2], [0, 2, 5, 10, 16, 12, 7, 3], [1, 3, 7, 13, 19, 14, 8, 4], [5, 6, 11, 18, 22, 21, 17, 10], [8, 14, 20, 23, 22, 18, 15, 9], [12, 16, 17, 21, 23, 20, 19, 13]]
                };
                archimedea["truncated octahedron"] = {
                    vertices: [[0, 0, 1.054093], [0.6324555, 0, 0.843274], [-0.421637, 0.4714045, 0.843274], [-0.07027284, -0.6285394, 0.843274], [0.843274, 0.4714045, 0.421637], [0.5621827, -0.6285394, 0.6324555], [-0.9135469, 0.3142697, 0.421637], [-0.2108185, 0.942809, 0.421637], [-0.5621827, -0.7856742, 0.421637], [0.9838197, 0.3142697, -0.2108185], [0.421637, 0.942809, 0.2108185], [0.7027284, -0.7856742, 0], [-0.7027284, 0.7856742, 0], [-0.9838197, -0.3142697, 0.2108185], [-0.421637, -0.942809, -0.2108185], [0.5621827, 0.7856742, -0.421637], [0.9135469, -0.3142697, -0.421637], [0.2108185, -0.942809, -0.421637], [-0.5621827, 0.6285394, -0.6324555], [-0.843274, -0.4714045, -0.421637], [0.07027284, 0.6285394, -0.843274], [0.421637, -0.4714045, -0.843274], [-0.6324555, 0, -0.843274], [0, 0, -1.054093]],
                    faces: [[0, 3, 5, 1], [2, 7, 12, 6], [4, 9, 15, 10], [8, 13, 19, 14], [11, 17, 21, 16], [18, 20, 23, 22], [0, 1, 4, 10, 7, 2], [0, 2, 6, 13, 8, 3], [1, 5, 11, 16, 9, 4], [3, 8, 14, 17, 11, 5], [6, 12, 18, 22, 19, 13], [7, 10, 15, 20, 18, 12], [9, 16, 21, 23, 20, 15], [14, 19, 22, 23, 21, 17]]
                };
                archimedea["truncated dodecahedron"] = {
                    vertices: [[0, 0, 1.014485], [0.3367628, 0, 0.9569589], [-0.2902233, 0.1708204, 0.9569589], [0.1634681, -0.2944272, 0.9569589], [0.5914332, 0.1708204, 0.806354], [-0.5963465, 0.1527864, 0.806354], [-0.4230517, 0.4472136, 0.806354], [0.1377417, -0.6, 0.806354], [0.8302037, 0.1527864, 0.5626702], [0.6667356, 0.4472136, 0.6201961], [-0.8014407, -0.0472136, 0.6201961], [-0.3477493, 0.7236068, 0.6201961], [-0.06735256, -0.8, 0.6201961], [0.2694102, -0.8, 0.5626702], [0.9618722, -0.0472136, 0.3189863], [0.5339072, 0.7236068, 0.4695912], [-0.8271671, -0.3527864, 0.4695912], [-0.9599955, -0.0763932, 0.3189863], [-0.3992021, 0.8763932, 0.3189863], [-0.09307895, 0.8944272, 0.4695912], [-0.3734757, -0.818034, 0.4695912], [0.5081808, -0.818034, 0.3189863], [0.9361459, -0.3527864, 0.1683814], [1.011448, -0.0763932, -0.0177765], [0.4824544, 0.8763932, 0.1683814], [0.2436839, 0.8944272, 0.4120653], [-0.663699, -0.6472136, 0.4120653], [-1.011448, 0.0763932, 0.0177765], [-0.5577569, 0.8472136, 0.0177765], [-0.5320305, -0.8472136, 0.1683814], [0.5577569, -0.8472136, -0.0177765], [0.7628511, -0.6472136, 0.1683814], [0.9599955, 0.0763932, -0.3189863], [0.5320305, 0.8472136, -0.1683814], [-0.9618722, 0.0472136, -0.3189863], [-0.9361459, 0.3527864, -0.1683814], [-0.7628511, 0.6472136, -0.1683814], [-0.5081808, 0.818034, -0.3189863], [-0.4824544, -0.8763932, -0.1683814], [0.3992021, -0.8763932, -0.3189863], [0.8014407, 0.0472136, -0.6201961], [0.8271671, 0.3527864, -0.4695912], [0.663699, 0.6472136, -0.4120653], [0.3734757, 0.818034, -0.4695912], [-0.8302037, -0.1527864, -0.5626702], [-0.2694102, 0.8, -0.5626702], [-0.5339072, -0.7236068, -0.4695912], [-0.2436839, -0.8944272, -0.4120653], [0.09307895, -0.8944272, -0.4695912], [0.3477493, -0.7236068, -0.6201961], [0.5963465, -0.1527864, -0.806354], [0.06735256, 0.8, -0.6201961], [-0.6667356, -0.4472136, -0.6201961], [-0.5914332, -0.1708204, -0.806354], [-0.1377417, 0.6, -0.806354], [0.4230517, -0.4472136, -0.806354], [0.2902233, -0.1708204, -0.9569589], [-0.3367628, 0, -0.9569589], [-0.1634681, 0.2944272, -0.9569589], [0, 0, -1.014485]],
                    faces: [[0, 3, 1], [2, 6, 5], [4, 8, 9], [7, 12, 13], [10, 17, 16], [11, 19, 18], [14, 22, 23], [15, 24, 25], [20, 26, 29], [21, 30, 31], [27, 35, 34], [28, 37, 36], [32, 40, 41], [33, 42, 43], [38, 46, 47], [39, 48, 49], [44, 53, 52], [45, 51, 54], [50, 55, 56], [57, 58, 59], [0, 1, 4, 9, 15, 25, 19, 11, 6, 2], [0, 2, 5, 10, 16, 26, 20, 12, 7, 3], [1, 3, 7, 13, 21, 31, 22, 14, 8, 4], [5, 6, 11, 18, 28, 36, 35, 27, 17, 10], [8, 14, 23, 32, 41, 42, 33, 24, 15, 9], [12, 20, 29, 38, 47, 48, 39, 30, 21, 13], [16, 17, 27, 34, 44, 52, 46, 38, 29, 26], [18, 19, 25, 24, 33, 43, 51, 45, 37, 28], [22, 31, 30, 39, 49, 55, 50, 40, 32, 23], [34, 35, 36, 37, 45, 54, 58, 57, 53, 44], [40, 50, 56, 59, 58, 54, 51, 43, 42, 41], [46, 52, 53, 57, 59, 56, 55, 49, 48, 47]]
                };
                archimedea["truncated icosahedron"] = {
                    vertices: [[0, 0, 1.021], [0.4035482, 0, 0.9378643], [-0.2274644, 0.3333333, 0.9378643], [-0.1471226, -0.375774, 0.9378643], [0.579632, 0.3333333, 0.7715933], [0.5058321, -0.375774, 0.8033483], [-0.6020514, 0.2908927, 0.7715933], [-0.05138057, 0.6666667, 0.7715933], [0.1654988, -0.6080151, 0.8033483], [-0.5217096, -0.4182147, 0.7715933], [0.8579998, 0.2908927, 0.4708062], [0.3521676, 0.6666667, 0.6884578], [0.7841999, -0.4182147, 0.5025612], [-0.657475, 0.5979962, 0.5025612], [-0.749174, -0.08488134, 0.6884578], [-0.3171418, 0.8302373, 0.5025612], [0.1035333, -0.8826969, 0.5025612], [-0.5836751, -0.6928964, 0.4708062], [0.8025761, 0.5979962, 0.2017741], [0.9602837, -0.08488134, 0.3362902], [0.4899547, 0.8302373, 0.3362902], [0.7222343, -0.6928964, 0.2017741], [-0.8600213, 0.5293258, 0.1503935], [-0.9517203, -0.1535518, 0.3362902], [-0.1793548, 0.993808, 0.1503935], [0.381901, -0.9251375, 0.2017741], [-0.2710537, -0.9251375, 0.3362902], [-0.8494363, -0.5293258, 0.2017741], [0.8494363, 0.5293258, -0.2017741], [1.007144, -0.1535518, -0.06725804], [0.2241935, 0.993808, 0.06725804], [0.8600213, -0.5293258, -0.1503935], [-0.7222343, 0.6928964, -0.2017741], [-1.007144, 0.1535518, 0.06725804], [-0.381901, 0.9251375, -0.2017741], [0.1793548, -0.993808, -0.1503935], [-0.2241935, -0.993808, -0.06725804], [-0.8025761, -0.5979962, -0.2017741], [0.5836751, 0.6928964, -0.4708062], [0.9517203, 0.1535518, -0.3362902], [0.2710537, 0.9251375, -0.3362902], [0.657475, -0.5979962, -0.5025612], [-0.7841999, 0.4182147, -0.5025612], [-0.9602837, 0.08488134, -0.3362902], [-0.1035333, 0.8826969, -0.5025612], [0.3171418, -0.8302373, -0.5025612], [-0.4899547, -0.8302373, -0.3362902], [-0.8579998, -0.2908927, -0.4708062], [0.5217096, 0.4182147, -0.7715933], [0.749174, 0.08488134, -0.6884578], [0.6020514, -0.2908927, -0.7715933], [-0.5058321, 0.375774, -0.8033483], [-0.1654988, 0.6080151, -0.8033483], [0.05138057, -0.6666667, -0.7715933], [-0.3521676, -0.6666667, -0.6884578], [-0.579632, -0.3333333, -0.7715933], [0.1471226, 0.375774, -0.9378643], [0.2274644, -0.3333333, -0.9378643], [-0.4035482, 0, -0.9378643], [0, 0, -1.021]],
                    faces: [[0, 3, 8, 5, 1], [2, 7, 15, 13, 6], [4, 10, 18, 20, 11], [9, 14, 23, 27, 17], [12, 21, 31, 29, 19], [16, 26, 36, 35, 25], [22, 32, 42, 43, 33], [24, 30, 40, 44, 34], [28, 39, 49, 48, 38], [37, 47, 55, 54, 46], [41, 45, 53, 57, 50], [51, 52, 56, 59, 58], [0, 1, 4, 11, 7, 2], [0, 2, 6, 14, 9, 3], [1, 5, 12, 19, 10, 4], [3, 9, 17, 26, 16, 8], [5, 8, 16, 25, 21, 12], [6, 13, 22, 33, 23, 14], [7, 11, 20, 30, 24, 15], [10, 19, 29, 39, 28, 18], [13, 15, 24, 34, 32, 22], [17, 27, 37, 46, 36, 26], [18, 28, 38, 40, 30, 20], [21, 25, 35, 45, 41, 31], [23, 33, 43, 47, 37, 27], [29, 31, 41, 50, 49, 39], [32, 34, 44, 52, 51, 42], [35, 36, 46, 54, 53, 45], [38, 48, 56, 52, 44, 40], [42, 51, 58, 55, 47, 43], [48, 49, 50, 57, 59, 56], [53, 54, 55, 58, 59, 57]]
                };
                archimedea["cuboctahedron"] = {
                    vertices: [[0, 0, 1.154701], [1, 0, 0.5773503], [0.3333333, 0.942809, 0.5773503], [-1, 0, 0.5773503], [-0.3333333, -0.942809, 0.5773503], [1, 0, -0.5773503], [0.6666667, -0.942809, 0], [-0.6666667, 0.942809, 0], [0.3333333, 0.942809, -0.5773503], [-1, 0, -0.5773503], [-0.3333333, -0.942809, -0.5773503], [0, 0, -1.154701]],
                    faces: [[0, 1, 2], [0, 3, 4], [1, 6, 5], [2, 8, 7], [3, 7, 9], [4, 10, 6], [5, 11, 8], [9, 11, 10], [0, 2, 7, 3], [0, 4, 6, 1], [1, 5, 8, 2], [3, 9, 10, 4], [5, 6, 10, 11], [7, 8, 11, 9]]
                };
                archimedea["truncated cuboctahedron"] = {
                    vertices: [[0, 0, 1.024117], [0.4314788, 0, 0.928785], [-0.02106287, 0.4309644, 0.928785], [-0.3410582, -0.2642977, 0.928785], [0.4104159, 0.4309644, 0.833453], [0.7006238, -0.2642977, 0.6986333], [-0.3831839, 0.5976311, 0.7381211], [-0.3919084, -0.6380712, 0.6986333], [-0.7031792, -0.09763107, 0.7381211], [0.6584981, 0.5976311, 0.5079694], [0.6497736, -0.6380712, 0.4684816], [0.948706, -0.09763107, 0.3731496], [-0.4638216, 0.8333333, 0.3731496], [-0.7242421, 0.3333333, 0.6427891], [-0.7540295, -0.4714045, 0.5079694], [-0.1227634, -0.9023689, 0.4684816], [0.5778604, 0.8333333, 0.1429979], [0.9276431, 0.3333333, 0.2778177], [0.8978557, -0.4714045, 0.1429979], [0.3087154, -0.9023689, 0.3731496], [-0.8048797, 0.5690356, 0.2778177], [-0.2157394, 1, 0.04766598], [-0.8470055, -0.5690356, 0.08715377], [-0.2157394, -1, 0.04766598], [0.8470055, 0.5690356, -0.08715377], [0.2157394, 1, -0.04766598], [0.8048797, -0.5690356, -0.2778177], [0.2157394, -1, -0.04766598], [-0.8978557, 0.4714045, -0.1429979], [-0.3087154, 0.9023689, -0.3731496], [-0.9276431, -0.3333333, -0.2778177], [-0.5778604, -0.8333333, -0.1429979], [0.7540295, 0.4714045, -0.5079694], [0.1227634, 0.9023689, -0.4684816], [0.7242421, -0.3333333, -0.6427891], [0.4638216, -0.8333333, -0.3731496], [-0.948706, 0.09763107, -0.3731496], [-0.6497736, 0.6380712, -0.4684816], [-0.6584981, -0.5976311, -0.5079694], [0.7031792, 0.09763107, -0.7381211], [0.3919084, 0.6380712, -0.6986333], [0.3831839, -0.5976311, -0.7381211], [-0.7006238, 0.2642977, -0.6986333], [-0.4104159, -0.4309644, -0.833453], [0.3410582, 0.2642977, -0.928785], [0.02106287, -0.4309644, -0.928785], [-0.4314788, 0, -0.928785], [0, 0, -1.024117]],
                    faces: [[0, 1, 4, 2], [3, 8, 14, 7], [5, 10, 18, 11], [6, 12, 20, 13], [9, 17, 24, 16], [15, 23, 27, 19], [21, 25, 33, 29], [22, 30, 38, 31], [26, 35, 41, 34], [28, 37, 42, 36], [32, 39, 44, 40], [43, 46, 47, 45], [0, 2, 6, 13, 8, 3], [1, 5, 11, 17, 9, 4], [7, 14, 22, 31, 23, 15], [10, 19, 27, 35, 26, 18], [12, 21, 29, 37, 28, 20], [16, 24, 32, 40, 33, 25], [30, 36, 42, 46, 43, 38], [34, 41, 45, 47, 44, 39], [0, 3, 7, 15, 19, 10, 5, 1], [2, 4, 9, 16, 25, 21, 12, 6], [8, 13, 20, 28, 36, 30, 22, 14], [11, 18, 26, 34, 39, 32, 24, 17], [23, 31, 38, 43, 45, 41, 35, 27], [29, 33, 40, 44, 47, 46, 42, 37]]
                };
                archimedea["rhombicuboctahedron"] = {
                    vertices: [[0, 0, 1.070722], [0.7148135, 0, 0.7971752], [-0.104682, 0.7071068, 0.7971752], [-0.6841528, 0.2071068, 0.7971752], [-0.104682, -0.7071068, 0.7971752], [0.6101315, 0.7071068, 0.5236279], [1.04156, 0.2071068, 0.1367736], [0.6101315, -0.7071068, 0.5236279], [-0.3574067, 1, 0.1367736], [-0.7888348, -0.5, 0.5236279], [-0.9368776, 0.5, 0.1367736], [-0.3574067, -1, 0.1367736], [0.3574067, 1, -0.1367736], [0.9368776, -0.5, -0.1367736], [0.7888348, 0.5, -0.5236279], [0.3574067, -1, -0.1367736], [-0.6101315, 0.7071068, -0.5236279], [-1.04156, -0.2071068, -0.1367736], [-0.6101315, -0.7071068, -0.5236279], [0.104682, 0.7071068, -0.7971752], [0.6841528, -0.2071068, -0.7971752], [0.104682, -0.7071068, -0.7971752], [-0.7148135, 0, -0.7971752], [0, 0, -1.070722]],
                    faces: [[0, 2, 3], [1, 6, 5], [4, 9, 11], [7, 15, 13], [8, 16, 10], [12, 14, 19], [17, 22, 18], [20, 21, 23], [0, 1, 5, 2], [0, 3, 9, 4], [0, 4, 7, 1], [1, 7, 13, 6], [2, 5, 12, 8], [2, 8, 10, 3], [3, 10, 17, 9], [4, 11, 15, 7], [5, 6, 14, 12], [6, 13, 20, 14], [8, 12, 19, 16], [9, 17, 18, 11], [10, 16, 22, 17], [11, 18, 21, 15], [13, 15, 21, 20], [14, 20, 23, 19], [16, 19, 23, 22], [18, 22, 23, 21]]
                };
                archimedea["snub cube"] = {
                    vertices: [[0, 0, 1.077364], [0.7442063, 0, 0.7790187], [0.3123013, 0.6755079, 0.7790187], [-0.482096, 0.5669449, 0.7790187], [-0.7169181, -0.1996786, 0.7790187], [-0.1196038, -0.7345325, 0.7790187], [0.6246025, -0.7345325, 0.4806734], [1.056508, -0.1996786, 0.06806912], [0.8867128, 0.5669449, 0.2302762], [0.2621103, 1.042774, 0.06806912], [-0.532287, 0.9342111, 0.06806912], [-1.006317, 0.3082417, 0.2302762], [-0.7020817, -0.784071, 0.2302762], [0.02728827, -1.074865, 0.06806912], [0.6667271, -0.784071, -0.3184664], [0.8216855, -0.09111555, -0.6908285], [0.6518908, 0.6755079, -0.5286215], [-0.1196038, 0.8751866, -0.6168117], [-0.8092336, 0.4758293, -0.5286215], [-0.9914803, -0.2761507, -0.3184664], [-0.4467414, -0.825648, -0.5286215], [0.1926974, -0.5348539, -0.915157], [0.1846311, 0.2587032, -1.029416], [-0.5049987, -0.1406541, -0.9412258]],
                    faces: [[0, 1, 2], [0, 2, 3], [0, 3, 4], [0, 4, 5], [1, 6, 7], [1, 7, 8], [1, 8, 2], [2, 8, 9], [3, 10, 11], [3, 11, 4], [4, 12, 5], [5, 12, 13], [5, 13, 6], [6, 13, 14], [6, 14, 7], [7, 14, 15], [8, 16, 9], [9, 16, 17], [9, 17, 10], [10, 17, 18], [10, 18, 11], [11, 18, 19], [12, 19, 20], [12, 20, 13], [14, 21, 15], [15, 21, 22], [15, 22, 16], [16, 22, 17], [18, 23, 19], [19, 23, 20], [20, 23, 21], [21, 23, 22], [0, 5, 6, 1], [2, 9, 10, 3], [4, 11, 19, 12], [7, 15, 16, 8], [13, 20, 21, 14], [17, 22, 23, 18]]
                };
                archimedea["icosidodecahedron"] = {
                    vertices: [[0, 0, 1.051462], [0.618034, 0, 0.8506508], [0.2763932, 0.5527864, 0.8506508], [-0.618034, 0, 0.8506508], [-0.2763932, -0.5527864, 0.8506508], [1, 0, 0.3249197], [0.7236068, -0.5527864, 0.5257311], [-0.1708204, 0.8944272, 0.5257311], [0.4472136, 0.8944272, 0.3249197], [-1, 0, 0.3249197], [-0.7236068, 0.5527864, 0.5257311], [0.1708204, -0.8944272, 0.5257311], [-0.4472136, -0.8944272, 0.3249197], [1, 0, -0.3249197], [0.8944272, 0.5527864, 0], [0.5527864, -0.8944272, 0], [-0.5527864, 0.8944272, 0], [0.4472136, 0.8944272, -0.3249197], [-1, 0, -0.3249197], [-0.8944272, -0.5527864, 0], [-0.4472136, -0.8944272, -0.3249197], [0.618034, 0, -0.8506508], [0.7236068, -0.5527864, -0.5257311], [0.1708204, -0.8944272, -0.5257311], [-0.7236068, 0.5527864, -0.5257311], [-0.1708204, 0.8944272, -0.5257311], [0.2763932, 0.5527864, -0.8506508], [-0.618034, 0, -0.8506508], [-0.2763932, -0.5527864, -0.8506508], [0, 0, -1.051462]],
                    faces: [[0, 1, 2], [0, 3, 4], [1, 6, 5], [2, 8, 7], [3, 10, 9], [4, 12, 11], [5, 13, 14], [6, 11, 15], [7, 16, 10], [8, 14, 17], [9, 18, 19], [12, 19, 20], [13, 22, 21], [15, 23, 22], [16, 25, 24], [17, 26, 25], [18, 24, 27], [20, 28, 23], [21, 29, 26], [27, 29, 28], [0, 2, 7, 10, 3], [0, 4, 11, 6, 1], [1, 5, 14, 8, 2], [3, 9, 19, 12, 4], [5, 6, 15, 22, 13], [7, 8, 17, 25, 16], [9, 10, 16, 24, 18], [11, 12, 20, 23, 15], [13, 21, 26, 17, 14], [18, 27, 28, 20, 19], [21, 22, 23, 28, 29], [24, 25, 26, 29, 27]]
                };
                archimedea["truncated icosidodecahedron"] = {
                    vertices: [[0, 0, 1.008759], [0.2629922, 0, 0.973874], [-0.00462747, 0.2629515, 0.973874], [-0.2211363, -0.1423503, 0.973874], [0.2583647, 0.2629515, 0.9389886], [0.4673861, -0.1423503, 0.8825429], [-0.2303913, 0.3835526, 0.9041033], [-0.3159502, -0.372678, 0.8825429], [-0.4469001, -0.02174919, 0.9041033], [0.4581312, 0.3835526, 0.8127722], [0.5351104, -0.372678, 0.7696515], [0.6671526, -0.02174919, 0.7563265], [-0.3326926, 0.5786893, 0.7563265], [-0.4515276, 0.2412023, 0.8692179], [-0.541714, -0.2520769, 0.8127722], [-0.248226, -0.6030057, 0.7696515], [0.518368, 0.5786893, 0.6434351], [0.6625252, 0.2412023, 0.7214412], [0.7348768, -0.2520769, 0.6434351], [0.4402965, -0.6030057, 0.6783205], [-0.5538289, 0.436339, 0.7214412], [-0.2724557, 0.7738261, 0.5869894], [-0.6997536, -0.3618034, 0.6301101], [-0.04383203, -0.745356, 0.6783205], [-0.4062656, -0.7127322, 0.5869894], [0.722762, 0.436339, 0.552104], [0.4160667, 0.7738261, 0.4956583], [0.8398294, -0.3618034, 0.4258876], [0.2191601, -0.745356, 0.6434351], [0.5452491, -0.7127322, 0.460773], [-0.7147284, 0.4891254, 0.5172187], [-0.07268925, 0.8944272, 0.460773], [-0.4333553, 0.8266125, 0.3827669], [-0.8606531, -0.309017, 0.4258876], [-0.6320294, -0.5921311, 0.5172187], [-0.2018716, -0.8550825, 0.4956583], [0.8248546, 0.4891254, 0.3129962], [0.1903029, 0.8944272, 0.4258876], [0.5181594, 0.8266125, 0.2565505], [0.9419221, -0.309017, 0.1867798], [0.7450156, -0.5921311, 0.3345566], [0.3241127, -0.8550825, 0.4258876], [-0.8727679, 0.3793989, 0.3345566], [-0.6544916, 0.6842621, 0.3478816], [-0.2335888, 0.9472136, 0.2565505], [-0.7929289, -0.5393447, 0.3129962], [-0.9629544, -0.1138803, 0.2781109], [-0.096919, -0.9648091, 0.2781109], [0.9298072, 0.3793989, 0.09544872], [0.7225533, 0.6842621, 0.1652194], [0.2923956, 0.9472136, 0.1867798], [0.8471082, -0.5393447, 0.09544872], [1.002159, -0.1138803, 0.01744268], [0.1660732, -0.9648091, 0.2432255], [-0.8125311, 0.5745356, 0.1652194], [-0.9675818, 0.1490712, 0.2432255], [-0.1314961, 1, 0.01744268], [-0.8275059, -0.5745356, 0.05232804], [-0.9975315, -0.1490712, 0.01744268], [-0.1314961, -1, 0.01744268], [0.8275059, 0.5745356, -0.05232804], [0.9975315, 0.1490712, -0.01744268], [0.1314961, 1, -0.01744268], [0.8125311, -0.5745356, -0.1652194], [0.9675818, -0.1490712, -0.2432255], [0.1314961, -1, -0.01744268], [-0.8471082, 0.5393447, -0.09544872], [-1.002159, 0.1138803, -0.01744268], [-0.1660732, 0.9648091, -0.2432255], [-0.7225533, -0.6842621, -0.1652194], [-0.9298072, -0.3793989, -0.09544872], [-0.2923956, -0.9472136, -0.1867798], [0.7929289, 0.5393447, -0.3129962], [0.9629544, 0.1138803, -0.2781109], [0.096919, 0.9648091, -0.2781109], [0.6544916, -0.6842621, -0.3478816], [0.8727679, -0.3793989, -0.3345566], [0.2335888, -0.9472136, -0.2565505], [-0.7450156, 0.5921311, -0.3345566], [-0.9419221, 0.309017, -0.1867798], [-0.3241127, 0.8550825, -0.4258876], [-0.8248546, -0.4891254, -0.3129962], [-0.5181594, -0.8266125, -0.2565505], [-0.1903029, -0.8944272, -0.4258876], [0.6320294, 0.5921311, -0.5172187], [0.8606531, 0.309017, -0.4258876], [0.2018716, 0.8550825, -0.4956583], [0.7147284, -0.4891254, -0.5172187], [0.4333553, -0.8266125, -0.3827669], [0.07268925, -0.8944272, -0.460773], [-0.8398294, 0.3618034, -0.4258876], [-0.5452491, 0.7127322, -0.460773], [-0.2191601, 0.745356, -0.6434351], [-0.722762, -0.436339, -0.552104], [-0.4160667, -0.7738261, -0.4956583], [0.6997536, 0.3618034, -0.6301101], [0.4062656, 0.7127322, -0.5869894], [0.04383203, 0.745356, -0.6783205], [0.5538289, -0.436339, -0.7214412], [0.2724557, -0.7738261, -0.5869894], [-0.7348768, 0.2520769, -0.6434351], [-0.4402965, 0.6030057, -0.6783205], [-0.6625252, -0.2412023, -0.7214412], [-0.518368, -0.5786893, -0.6434351], [0.541714, 0.2520769, -0.8127722], [0.248226, 0.6030057, -0.7696515], [0.4515276, -0.2412023, -0.8692179], [0.3326926, -0.5786893, -0.7563265], [-0.6671526, 0.02174919, -0.7563265], [-0.5351104, 0.372678, -0.7696515], [-0.4581312, -0.3835526, -0.8127722], [0.4469001, 0.02174919, -0.9041033], [0.3159502, 0.372678, -0.8825429], [0.2303913, -0.3835526, -0.9041033], [-0.4673861, 0.1423503, -0.8825429], [-0.2583647, -0.2629515, -0.9389886], [0.2211363, 0.1423503, -0.973874], [0.00462747, -0.2629515, -0.973874], [-0.2629922, 0, -0.973874], [0, 0, -1.008759]],
                    faces: [[0, 1, 4, 2], [3, 8, 14, 7], [5, 10, 18, 11], [6, 12, 20, 13], [9, 17, 25, 16], [15, 24, 35, 23], [19, 28, 41, 29], [21, 31, 44, 32], [22, 33, 45, 34], [26, 38, 50, 37], [27, 40, 51, 39], [30, 43, 54, 42], [36, 48, 60, 49], [46, 55, 67, 58], [47, 59, 65, 53], [52, 64, 73, 61], [56, 62, 74, 68], [57, 70, 81, 69], [63, 75, 87, 76], [66, 78, 90, 79], [71, 82, 94, 83], [72, 85, 95, 84], [77, 89, 99, 88], [80, 92, 101, 91], [86, 96, 105, 97], [93, 102, 110, 103], [98, 107, 113, 106], [100, 109, 114, 108], [104, 111, 116, 112], [115, 118, 119, 117], [0, 2, 6, 13, 8, 3], [1, 5, 11, 17, 9, 4], [7, 14, 22, 34, 24, 15], [10, 19, 29, 40, 27, 18], [12, 21, 32, 43, 30, 20], [16, 25, 36, 49, 38, 26], [23, 35, 47, 53, 41, 28], [31, 37, 50, 62, 56, 44], [33, 46, 58, 70, 57, 45], [39, 51, 63, 76, 64, 52], [42, 54, 66, 79, 67, 55], [48, 61, 73, 85, 72, 60], [59, 71, 83, 89, 77, 65], [68, 74, 86, 97, 92, 80], [69, 81, 93, 103, 94, 82], [75, 88, 99, 107, 98, 87], [78, 91, 101, 109, 100, 90], [84, 95, 104, 112, 105, 96], [102, 108, 114, 118, 115, 110], [106, 113, 117, 119, 116, 111], [0, 3, 7, 15, 23, 28, 19, 10, 5, 1], [2, 4, 9, 16, 26, 37, 31, 21, 12, 6], [8, 13, 20, 30, 42, 55, 46, 33, 22, 14], [11, 18, 27, 39, 52, 61, 48, 36, 25, 17], [24, 34, 45, 57, 69, 82, 71, 59, 47, 35], [29, 41, 53, 65, 77, 88, 75, 63, 51, 40], [32, 44, 56, 68, 80, 91, 78, 66, 54, 43], [38, 49, 60, 72, 84, 96, 86, 74, 62, 50], [58, 67, 79, 90, 100, 108, 102, 93, 81, 70], [64, 76, 87, 98, 106, 111, 104, 95, 85, 73], [83, 94, 103, 110, 115, 117, 113, 107, 99, 89], [92, 97, 105, 112, 116, 119, 118, 114, 109, 101]]
                };
                archimedea["rhombicosidodecahedron"] = {
                    vertices: [[0, 0, 1.026054], [0.447838, 0, 0.9231617], [-0.02363976, 0.4472136, 0.9231617], [-0.4050732, 0.190983, 0.9231617], [-0.1693344, -0.4145898, 0.9231617], [0.4241982, 0.4472136, 0.8202696], [0.7673818, 0.190983, 0.6537868], [0.5552827, -0.4145898, 0.7566788], [-0.2312241, 0.7562306, 0.6537868], [-0.5744076, -0.2236068, 0.8202696], [-0.6126576, 0.5, 0.6537868], [0.1738492, -0.6708204, 0.7566788], [-0.4669629, -0.6381966, 0.6537868], [0.493393, 0.7562306, 0.4873039], [0.8748265, -0.2236068, 0.4873039], [0.8365765, 0.5, 0.320821], [0.7054921, -0.6381966, 0.3844118], [0.08831973, 0.9472136, 0.3844118], [-0.5434628, 0.809017, 0.320821], [-0.8866463, -0.1708204, 0.4873039], [-0.9102861, 0.2763932, 0.3844118], [-0.1237794, -0.8944272, 0.4873039], [0.3240586, -0.8944272, 0.3844118], [-0.7792016, -0.5854102, 0.320821], [0.6289922, 0.809017, 0.05144604], [1.010426, -0.1708204, 0.05144604], [0.9867859, 0.2763932, -0.05144604], [0.8410913, -0.5854102, -0.05144604], [-0.223919, 1, 0.05144604], [0.223919, 1, -0.05144604], [-0.8410913, 0.5854102, 0.05144604], [-0.9867859, -0.2763932, 0.05144604], [-1.010426, 0.1708204, -0.05144604], [-0.223919, -1, 0.05144604], [0.223919, -1, -0.05144604], [-0.6289922, -0.809017, -0.05144604], [0.7792016, 0.5854102, -0.320821], [0.9102861, -0.2763932, -0.3844118], [0.8866463, 0.1708204, -0.4873039], [0.5434628, -0.809017, -0.320821], [-0.3240586, 0.8944272, -0.3844118], [0.1237794, 0.8944272, -0.4873039], [-0.7054921, 0.6381966, -0.3844118], [-0.8365765, -0.5, -0.320821], [-0.8748265, 0.2236068, -0.4873039], [-0.08831973, -0.9472136, -0.3844118], [-0.493393, -0.7562306, -0.4873039], [0.4669629, 0.6381966, -0.6537868], [0.6126576, -0.5, -0.6537868], [0.5744076, 0.2236068, -0.8202696], [0.2312241, -0.7562306, -0.6537868], [-0.1738492, 0.6708204, -0.7566788], [-0.5552827, 0.4145898, -0.7566788], [-0.7673818, -0.190983, -0.6537868], [-0.4241982, -0.4472136, -0.8202696], [0.1693344, 0.4145898, -0.9231617], [0.4050732, -0.190983, -0.9231617], [0.02363976, -0.4472136, -0.9231617], [-0.447838, 0, -0.9231617], [0, 0, -1.026054]],
                    faces: [[0, 2, 3], [1, 6, 5], [4, 9, 12], [7, 16, 14], [8, 18, 10], [11, 21, 22], [13, 15, 24], [17, 29, 28], [19, 31, 23], [20, 30, 32], [25, 27, 37], [26, 38, 36], [33, 45, 34], [35, 43, 46], [39, 50, 48], [40, 41, 51], [42, 52, 44], [47, 49, 55], [53, 58, 54], [56, 57, 59], [0, 1, 5, 2], [0, 3, 9, 4], [1, 7, 14, 6], [2, 8, 10, 3], [4, 12, 21, 11], [5, 6, 15, 13], [7, 11, 22, 16], [8, 17, 28, 18], [9, 19, 23, 12], [10, 18, 30, 20], [13, 24, 29, 17], [14, 16, 27, 25], [15, 26, 36, 24], [19, 20, 32, 31], [21, 33, 34, 22], [23, 31, 43, 35], [25, 37, 38, 26], [27, 39, 48, 37], [28, 29, 41, 40], [30, 42, 44, 32], [33, 35, 46, 45], [34, 45, 50, 39], [36, 38, 49, 47], [40, 51, 52, 42], [41, 47, 55, 51], [43, 53, 54, 46], [44, 52, 58, 53], [48, 50, 57, 56], [49, 56, 59, 55], [54, 58, 59, 57], [0, 4, 11, 7, 1], [2, 5, 13, 17, 8], [3, 10, 20, 19, 9], [6, 14, 25, 26, 15], [12, 23, 35, 33, 21], [16, 22, 34, 39, 27], [18, 28, 40, 42, 30], [24, 36, 47, 41, 29], [31, 32, 44, 53, 43], [37, 48, 56, 49, 38], [45, 46, 54, 57, 50], [51, 55, 59, 58, 52]]
                };
                archimedea["snub dodecahedron"] = {
                    vertices: [[0, 0, 1.028031], [0.4638569, 0, 0.9174342], [0.2187436, 0.4090409, 0.9174342], [-0.2575486, 0.3857874, 0.9174342], [-0.4616509, -0.04518499, 0.9174342], [-0.177858, -0.4284037, 0.9174342], [0.5726782, -0.4284037, 0.7384841], [0.8259401, -0.04518499, 0.6104342], [0.6437955, 0.3857874, 0.702527], [0.349648, 0.7496433, 0.6104342], [-0.421009, 0.7120184, 0.6104342], [-0.6783139, 0.3212396, 0.702527], [-0.6031536, -0.4466658, 0.702527], [-0.2749612, -0.7801379, 0.6104342], [0.1760766, -0.6931717, 0.7384841], [0.5208138, -0.7801379, 0.4206978], [0.8552518, -0.4466658, 0.3547998], [1.01294, -0.03548596, 0.1718776], [0.7182239, 0.661842, 0.3208868], [0.3633691, 0.9454568, 0.1758496], [-0.04574087, 0.9368937, 0.4206978], [-0.4537394, 0.905564, 0.1758496], [-0.7792791, 0.5887312, 0.3208868], [-0.9537217, 0.1462217, 0.3547998], [-0.9072701, -0.3283699, 0.3547998], [-0.6503371, -0.7286577, 0.3208868], [0.08459482, -0.9611501, 0.3547998], [0.3949153, -0.9491262, -0.007072558], [0.9360473, -0.409557, -0.1136978], [0.9829382, 0.02692292, -0.2999274], [0.9463677, 0.4014808, -0.007072558], [0.6704578, 0.7662826, -0.1419366], [-0.05007646, 1.025698, -0.04779978], [-0.4294337, 0.8845784, -0.2999274], [-0.9561681, 0.3719321, -0.06525234], [-1.022036, -0.1000338, -0.04779978], [-0.8659056, -0.5502712, -0.06525234], [-0.5227761, -0.8778535, -0.1136978], [-0.06856319, -1.021542, -0.09273844], [0.2232046, -0.8974878, -0.4489366], [0.6515438, -0.7200947, -0.3373472], [0.7969535, -0.3253959, -0.5619888], [0.8066872, 0.4395354, -0.461425], [0.4468035, 0.735788, -0.5619888], [0.001488801, 0.8961155, -0.503809], [-0.3535403, 0.6537658, -0.7102452], [-0.7399517, 0.5547758, -0.4489366], [-0.9120238, 0.1102196, -0.461425], [-0.6593998, -0.6182798, -0.4896639], [-0.2490651, -0.8608088, -0.503809], [0.4301047, -0.5764987, -0.734512], [0.5057577, -0.1305283, -0.8854492], [0.5117735, 0.3422252, -0.8232973], [0.09739587, 0.5771941, -0.8451093], [-0.6018946, 0.2552591, -0.7933564], [-0.6879024, -0.2100741, -0.734512], [-0.3340437, -0.5171509, -0.8232973], [0.08570633, -0.3414376, -0.9658797], [0.1277354, 0.1313635, -1.011571], [-0.3044499, -0.06760332, -0.979586]],
                    faces: [[0, 1, 2], [0, 2, 3], [0, 3, 4], [0, 4, 5], [1, 6, 7], [1, 7, 8], [1, 8, 2], [2, 8, 9], [3, 10, 11], [3, 11, 4], [4, 12, 5], [5, 12, 13], [5, 13, 14], [6, 14, 15], [6, 15, 16], [6, 16, 7], [7, 16, 17], [8, 18, 9], [9, 18, 19], [9, 19, 20], [10, 20, 21], [10, 21, 22], [10, 22, 11], [11, 22, 23], [12, 24, 25], [12, 25, 13], [13, 26, 14], [14, 26, 15], [15, 26, 27], [16, 28, 17], [17, 28, 29], [17, 29, 30], [18, 30, 31], [18, 31, 19], [19, 32, 20], [20, 32, 21], [21, 32, 33], [22, 34, 23], [23, 34, 35], [23, 35, 24], [24, 35, 36], [24, 36, 25], [25, 36, 37], [26, 38, 27], [27, 38, 39], [27, 39, 40], [28, 40, 41], [28, 41, 29], [29, 42, 30], [30, 42, 31], [31, 42, 43], [32, 44, 33], [33, 44, 45], [33, 45, 46], [34, 46, 47], [34, 47, 35], [36, 48, 37], [37, 48, 49], [37, 49, 38], [38, 49, 39], [39, 50, 40], [40, 50, 41], [41, 50, 51], [42, 52, 43], [43, 52, 53], [43, 53, 44], [44, 53, 45], [45, 54, 46], [46, 54, 47], [47, 54, 55], [48, 55, 56], [48, 56, 49], [50, 57, 51], [51, 57, 58], [51, 58, 52], [52, 58, 53], [54, 59, 55], [55, 59, 56], [56, 59, 57], [57, 59, 58], [0, 5, 14, 6, 1], [2, 9, 20, 10, 3], [4, 11, 23, 24, 12], [7, 17, 30, 18, 8], [13, 25, 37, 38, 26], [15, 27, 40, 28, 16], [19, 31, 43, 44, 32], [21, 33, 46, 34, 22], [29, 41, 51, 52, 42], [35, 47, 55, 48, 36], [39, 49, 56, 57, 50], [45, 53, 58, 59, 54]]
                };
                archimedea["triangular prism"] = {
                    vertices: [[0, 0, 1.322876], [1.309307, 0, 0.1889822], [-0.9819805, 0.8660254, 0.1889822], [0.1636634, -1.299038, 0.1889822], [0.3273268, 0.8660254, -0.9449112], [-0.8183171, -0.4330127, -0.9449112]],
                    faces: [[0, 3, 1], [2, 4, 5], [0, 1, 4, 2], [0, 2, 5, 3], [1, 3, 5, 4]]
                };
                archimedea["pentagonal prism"] = {
                    vertices: [[0, 0, 1.159953], [1.013464, 0, 0.5642542], [-0.3501431, 0.9510565, 0.5642542], [-0.7715208, -0.6571639, 0.5642542], [0.6633206, 0.9510565, -0.03144481], [0.8682979, -0.6571639, -0.3996071], [-1.121664, 0.2938926, -0.03144481], [-0.2348831, -1.063314, -0.3996071], [0.5181548, 0.2938926, -0.9953061], [-0.5850262, -0.112257, -0.9953061]],
                    faces: [[0, 1, 4, 2], [0, 2, 6, 3], [1, 5, 8, 4], [3, 6, 9, 7], [5, 7, 9, 8], [0, 3, 7, 5, 1], [2, 4, 8, 9, 6]]
                };
                archimedea["hexagonal prism"] = {
                    vertices: [[0, 0, 1.118034], [0.8944272, 0, 0.6708204], [-0.2236068, 0.8660254, 0.6708204], [-0.7826238, -0.4330127, 0.6708204], [0.6708204, 0.8660254, 0.2236068], [1.006231, -0.4330127, -0.2236068], [-1.006231, 0.4330127, 0.2236068], [-0.6708204, -0.8660254, -0.2236068], [0.7826238, 0.4330127, -0.6708204], [0.2236068, -0.8660254, -0.6708204], [-0.8944272, 0, -0.6708204], [0, 0, -1.118034]],
                    faces: [[0, 1, 4, 2], [0, 2, 6, 3], [1, 5, 8, 4], [3, 6, 10, 7], [5, 9, 11, 8], [7, 10, 11, 9], [0, 3, 7, 9, 5, 1], [2, 4, 8, 11, 10, 6]]
                };
                archimedea["square pyramid"] = {
                    vertices: [[-0.729665, 0.670121, 0.319155], [-0.655235, -0.29213, -0.754096], [-0.093922, -0.607123, 0.537818], [0.702196, 0.595691, 0.485187], [0.776626, -0.36656, -0.588064]],
                    faces: [[1, 4, 2], [0, 1, 2], [3, 0, 2], [4, 3, 2], [4, 1, 0, 3]]
                };
                archimedea["pentagonal pyramid"] = {
                    vertices: [[-0.868849, -0.100041, 0.61257], [-0.329458, 0.976099, 0.28078], [-0.26629, -0.013796, -0.477654], [-0.13392, -1.034115, 0.229829], [0.738834, 0.707117, -0.307018], [0.859683, -0.535264, -0.338508]],
                    faces: [[3, 0, 2], [5, 3, 2], [4, 5, 2], [1, 4, 2], [0, 1, 2], [0, 3, 5, 4, 1]]
                };
                archimedea["triangular bipyramid"] = {
                    vertices: [[-0.610389, 0.243975, 0.531213], [-0.187812, -0.48795, -0.664016], [-0.187812, 0.9759, -0.664016], [0.187812, -0.9759, 0.664016], [0.798201, 0.243975, 0.132803]],
                    faces: [[1, 3, 0], [3, 4, 0], [3, 1, 4], [0, 2, 1], [0, 4, 2], [2, 4, 1]]
                };
                archimedea["pentagonal bipyramid"] = {
                    vertices: [[-1.028778, 0.392027, -0.048786], [-0.640503, -0.646161, 0.621837], [-0.125162, -0.395663, -0.540059], [0.004683, 0.888447, -0.651988], [0.125161, 0.395663, 0.540059], [0.632925, -0.791376, 0.433102], [1.031672, 0.157063, -0.354165]],
                    faces: [[3, 2, 0], [2, 1, 0], [2, 5, 1], [0, 4, 3], [0, 1, 4], [4, 1, 5], [2, 3, 6], [3, 4, 6], [5, 2, 6], [4, 5, 6]]
                };
                var data = archimedea[this.type];
                if (data == null) {
                    mathis.logger.c("no internal data associated to the name:" + this.type);
                    return null;
                }
                else
                    return Polyhedron.dataToMamesh(data);
            };
            return Polyhedron;
        }());
        polyhedron_1.Polyhedron = Polyhedron;
        function getPolyhedronAsync(type, callback) {
            var mamesh = new Polyhedron(type).go();
            if (mamesh != null) {
                callback(mamesh);
            }
            else {
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        var mamesh_1 = Polyhedron.dataToMamesh(JSON.parse(this.responseText));
                        callback(mamesh_1);
                    }
                };
                var str = type.replace(/\s+/g, '-').toLowerCase();
                xhttp.open("GET", "TS/polyhedron/polyhedra/" + str + ".json", true);
                xhttp.send();
            }
        }
        polyhedron_1.getPolyhedronAsync = getPolyhedronAsync;
    })(polyhedron = mathis.polyhedron || (mathis.polyhedron = {}));
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    var reseau;
    (function (reseau) {
        (function (Maille) {
            Maille[Maille["square"] = 0] = "square";
            Maille[Maille["triangle"] = 1] = "triangle";
            Maille[Maille["diamond"] = 2] = "diamond";
            Maille[Maille["hexagonal"] = 3] = "hexagonal";
            Maille[Maille["slash"] = 4] = "slash";
            Maille[Maille["croisillon"] = 5] = "croisillon";
        })(reseau.Maille || (reseau.Maille = {}));
        var Maille = reseau.Maille;
        var SingleTriangle = (function () {
            function SingleTriangle(mamesh) {
                this.makeLinks = true;
                this.markCorners = true;
                this.addALoopLineAround = false;
                this.mamesh = mamesh;
            }
            SingleTriangle.prototype.go = function () {
                var vert0 = this.mamesh.newVertex(new mathis.XYZ(0, 0, 0));
                var vert1 = this.mamesh.newVertex(new mathis.XYZ(0, 1, 0));
                var vert2 = this.mamesh.newVertex(new mathis.XYZ(1, 0, 0));
                this.mamesh.addATriangle(vert0, vert1, vert2);
                if (this.markCorners) {
                    vert0.markers.push(mathis.Vertex.Markers.corner);
                    vert1.markers.push(mathis.Vertex.Markers.corner);
                    vert2.markers.push(mathis.Vertex.Markers.corner);
                }
                if (this.makeLinks) {
                    if (!this.addALoopLineAround) {
                        vert0.setOneLink(vert1);
                        vert0.setOneLink(vert2);
                        vert1.setOneLink(vert0);
                        vert1.setOneLink(vert2);
                        vert2.setOneLink(vert0);
                        vert2.setOneLink(vert1);
                    }
                    else {
                        vert0.setTwoOppositeLinks(vert1, vert2);
                        vert1.setTwoOppositeLinks(vert2, vert0);
                        vert2.setTwoOppositeLinks(vert0, vert1);
                    }
                }
            };
            return SingleTriangle;
        }());
        reseau.SingleTriangle = SingleTriangle;
        var TriangulatedTriangle = (function () {
            function TriangulatedTriangle() {
                this.markCorner = true;
                this.markBorder = true;
                this.origin = new mathis.XYZ(-1, -1, 0);
                this.end = new mathis.XYZ(1, 1, 0);
                this.nbSubdivisionInSide = 6;
                this.setAllDichoLevelTo0 = true;
                this.mamesh = new mathis.Mamesh();
            }
            TriangulatedTriangle.prototype.go = function () {
                for (var i = 0; i < 3; i++) {
                    var param = new mathis.XYZ(Math.cos(2 * Math.PI * i / 3 - Math.PI / 2), Math.sin(2 * Math.PI * i / 3 - Math.PI / 2), 0);
                    var position = mathis.XYZ.newFrom(param);
                    var v = this.mamesh.newVertex(position, 0, param);
                    v.markers.push(mathis.Vertex.Markers.corner);
                }
                this.mamesh.addATriangle(this.mamesh.vertices[0], this.mamesh.vertices[1], this.mamesh.vertices[2]);
                var nbDic = Math.floor(Math.log(this.nbSubdivisionInSide) / Math.log(2));
                for (var dic = 0; dic < nbDic; dic++) {
                    var dicotomer = new mathis.mameshModification.TriangleDichotomer(this.mamesh);
                    dicotomer.makeLinks = false;
                    dicotomer.go();
                }
                if (Math.pow(2, nbDic) != this.nbSubdivisionInSide) {
                    var dicotomer = new mathis.mameshModification.TriangleDichotomer(this.mamesh);
                    dicotomer.makeLinks = false;
                    dicotomer.go();
                }
                var linkMaker = new mathis.linkModule.LinkCreaterSorterAndBorderDetecterByPolygons(this.mamesh);
                linkMaker.markIsolateVertexAsCorner = false;
                linkMaker.goChanging();
                if (Math.pow(2, nbDic) != this.nbSubdivisionInSide) {
                    var supress = new mathis.grateAndGlue.ExtractCentralPart(this.mamesh, Math.floor((Math.pow(2, nbDic + 1) - this.nbSubdivisionInSide) / 3));
                    supress.markBorder = this.markBorder;
                    this.mamesh = supress.go();
                    this.mamesh.isolateMameshVerticesFromExteriorVertices();
                }
                if (this.markCorner) {
                    for (var _i = 0, _a = this.mamesh.vertices; _i < _a.length; _i++) {
                        var v = _a[_i];
                        if (v.links.length == 2)
                            v.markers.push(mathis.Vertex.Markers.corner);
                    }
                }
                if (this.setAllDichoLevelTo0)
                    for (var _b = 0, _c = this.mamesh.vertices; _b < _c.length; _b++) {
                        var vertex = _c[_b];
                        vertex.dichoLevel = 0;
                    }
                mathis.spacialTransformations.adjustInASquare(this.mamesh, this.origin, this.end);
                return this.mamesh;
            };
            return TriangulatedTriangle;
        }());
        reseau.TriangulatedTriangle = TriangulatedTriangle;
        var TriangulatedPolygone = (function () {
            function TriangulatedPolygone(nbSides) {
                this.markCorner = true;
                this.markBorder = true;
                this.origin = new mathis.XYZ(-1, -1, 0);
                this.end = new mathis.XYZ(1, 1, 0);
                this.nbSubdivisionInARadius = 1;
                this.setAllDichoLevelTo0 = true;
                this.mamesh = new mathis.Mamesh();
                this.nbSides = nbSides;
            }
            TriangulatedPolygone.prototype.go = function () {
                var vert0 = this.mamesh.newVertex(new mathis.XYZ(0, 0, 0), 0, new mathis.XYZ(0, 0, 0));
                vert0.markers.push(mathis.Vertex.Markers.center);
                for (var i = 0; i < this.nbSides; i++) {
                    var param = new mathis.XYZ(Math.cos(2 * Math.PI * i / this.nbSides - Math.PI / 2), Math.sin(2 * Math.PI * i / this.nbSides - Math.PI / 2), 0);
                    var position = mathis.XYZ.newFrom(param);
                    var v = this.mamesh.newVertex(position, 0, param);
                    if (this.markBorder)
                        v.markers.push(mathis.Vertex.Markers.border);
                }
                for (var i = 1; i < this.nbSides + 1; i++) {
                    this.mamesh.addATriangle(this.mamesh.vertices[0], this.mamesh.vertices[i], this.mamesh.vertices[i % this.nbSides + 1]);
                }
                if (this.nbSides % 2 == 0) {
                    for (var i = 1; i <= this.nbSides / 2; i++) {
                        vert0.setTwoOppositeLinks(this.mamesh.vertices[i], this.mamesh.vertices[i + this.nbSides / 2]);
                    }
                }
                else {
                    for (var i = 1; i <= this.nbSides; i++)
                        vert0.setOneLink(this.mamesh.vertices[i]);
                }
                for (var i = 1; i <= this.nbSides; i++) {
                    var verti = this.mamesh.vertices[i];
                    var vertNext = (i == this.nbSides) ? this.mamesh.vertices[1] : this.mamesh.vertices[i + 1];
                    var vertPrev = (i == 1) ? this.mamesh.vertices[this.nbSides] : this.mamesh.vertices[i - 1];
                    verti.setOneLink(vert0);
                    verti.setOneLink(vertNext);
                    verti.setOneLink(vertPrev);
                }
                var nbDic = Math.log(this.nbSubdivisionInARadius) / Math.log(2);
                for (var dic = 0; dic < nbDic; dic++) {
                    var dicotomer = new mathis.mameshModification.TriangleDichotomer(this.mamesh);
                    dicotomer.makeLinks = true;
                    dicotomer.go();
                }
                if (nbDic != Math.floor(nbDic)) {
                    var dicotomer = new mathis.mameshModification.TriangleDichotomer(this.mamesh);
                    dicotomer.makeLinks = true;
                    dicotomer.go();
                    var supress = new mathis.grateAndGlue.ExtractCentralPart(this.mamesh, -this.nbSubdivisionInARadius);
                    supress.markBorder = this.markBorder;
                    this.mamesh = supress.go();
                    this.mamesh.isolateMameshVerticesFromExteriorVertices();
                }
                if (this.markCorner) {
                    for (var _i = 0, _a = this.mamesh.vertices; _i < _a.length; _i++) {
                        var v = _a[_i];
                        if (v.links.length == 3)
                            v.markers.push(mathis.Vertex.Markers.corner);
                    }
                }
                mathis.spacialTransformations.adjustInASquare(this.mamesh, this.origin, this.end);
                if (this.setAllDichoLevelTo0)
                    for (var _b = 0, _c = this.mamesh.vertices; _b < _c.length; _b++) {
                        var vertex = _c[_b];
                        vertex.dichoLevel = 0;
                    }
                return this.mamesh;
            };
            return TriangulatedPolygone;
        }());
        reseau.TriangulatedPolygone = TriangulatedPolygone;
        var BasisForRegularReseau = (function () {
            function BasisForRegularReseau() {
                this.nbI = 3;
                this.set_nbJ_toHaveRegularReseau = false;
                this.nbJ = 3;
                this.origin = new mathis.XYZ(0, 0, 0);
                this.end = new mathis.XYZ(1, 1, 0);
                this.kComponentTranslation = 0;
                this.nbVerticalDecays = 0;
                this.nbHorizontalDecays = 0;
                this.squareMailleInsteadOfTriangle = true;
            }
            BasisForRegularReseau.prototype.go = function () {
                this.checkArgs();
                var deltaX = (this.end.x - this.origin.x) / (this.nbI - 1);
                var deltaY;
                if (this.set_nbJ_toHaveRegularReseau) {
                    if (this.squareMailleInsteadOfTriangle)
                        deltaY = deltaX;
                    else
                        deltaY = deltaX * Math.sqrt(3) / 2;
                    this.nbJ = Math.floor(((this.end.y - this.origin.y) / deltaY + 1));
                }
                else {
                    deltaY = (this.end.y - this.origin.y) / (this.nbJ - 1);
                }
                var A = (this.end.x - this.origin.x);
                var B = (this.end.y - this.origin.y);
                var VX = this.computeDecayVector(deltaX, A, deltaY, B, this.nbVerticalDecays, this.nbHorizontalDecays);
                var preVY = this.computeDecayVector(deltaY, B, deltaX, A, this.nbHorizontalDecays, this.nbVerticalDecays);
                var VY = new mathis.XYZ(preVY.y, preVY.x, 0);
                VX.z += this.kComponentTranslation;
                VY.z += this.kComponentTranslation;
                return { Vi: VX, Vj: VY, nbI: this.nbI, nbJ: this.nbJ };
            };
            BasisForRegularReseau.prototype.checkArgs = function () {
                var A = (this.end.x - this.origin.x);
                var B = (this.end.y - this.origin.y);
                if (Math.abs(A) < mathis.geo.epsilon || Math.abs(B) < mathis.geo.epsilon)
                    throw 'origin and end are almost in the same line';
                if (this.nbI < 2)
                    throw 'this.nbI must be >=2';
                if (this.nbJ < 2)
                    throw 'this.nbJ must be >=2';
            };
            BasisForRegularReseau.prototype.computeDecayVector = function (a, A, b, B, dV, dH) {
                var res = new mathis.XYZ(0, 0, 0);
                res.x = a * A * B / (A * B - a * b * dH * dV);
                res.y = b * dV / A * res.x;
                return res;
            };
            return BasisForRegularReseau;
        }());
        reseau.BasisForRegularReseau = BasisForRegularReseau;
        var aParam = new mathis.XYZ(0, 0, 0);
        function makeLinksFromDeltaParam(cell, dir1, dir2, paramToVertex) {
            {
                aParam.copyFromFloats(cell.param.x, cell.param.y, cell.param.z).add(dir1);
                var c = paramToVertex.getValue(aParam);
                aParam.copyFromFloats(cell.param.x, cell.param.y, cell.param.z).add(dir2);
                var cc_1 = paramToVertex.getValue(aParam);
                if (c != null && cc_1 != null)
                    cell.setTwoOppositeLinks(c, cc_1);
                else if (c == null && cc_1 != null)
                    cell.setOneLink(cc_1);
                else if (c != null && cc_1 == null)
                    cell.setOneLink(c);
            }
        }
        var tempPapa = new mathis.XYZ(0, 0, 0);
        function makeSquareFromDeltaParam(cell, mamesh, dir1, dir2, paramToVertex) {
            var v1 = cell;
            if (v1 == null)
                return;
            var v2 = paramToVertex.getValue(tempPapa.copyFrom(cell.param).add(dir1));
            if (v2 == null)
                return;
            var v3 = paramToVertex.getValue(tempPapa.copyFrom(cell.param).add(dir1).add(dir2));
            if (v3 == null)
                return;
            var v4 = paramToVertex.getValue(tempPapa.copyFrom(cell.param).add(dir2));
            if (v4 == null)
                return;
            mamesh.addASquare(v1, v2, v3, v4);
        }
        var Regular = (function () {
            function Regular(generator) {
                this.nbI = 3;
                this.nbJ = 3;
                this.fixedK = 0;
                this.Vi = new mathis.XYZ(1, 0, 0);
                this.Vj = new mathis.XYZ(0, 1, 0);
                this.Vk = new mathis.XYZ(0, 0, 0);
                this.origine = new mathis.XYZ(0, 0, 0);
                this.makeLinks = true;
                this.makeTriangleOrSquare = true;
                this.squareVersusTriangleMaille = true;
                this.oneMoreVertexForOddLine = false;
                this.holeParameters = new mathis.HashMap();
                this.markCorner = true;
                this.markBorder = true;
                this.markCenter = true;
                this.putAVertexOnlyAtXYZCheckingThisCondition = null;
                this._xyz = new mathis.XYZ(0, 0, 0);
                this._iDirection = new mathis.XYZ(0, 0, 0);
                this._jDirection = new mathis.XYZ(0, 0, 0);
                this._kDirection = new mathis.XYZ(0, 0, 0);
                this.paramToVertex = new mathis.HashMap(true);
                this.mamesh = new mathis.Mamesh();
                if (generator != null) {
                    var VV = generator.go();
                    this.Vi.copyFrom(VV.Vi);
                    this.Vj.copyFrom(VV.Vj);
                    this.nbI = VV.nbI;
                    this.nbJ = VV.nbJ;
                    this.origine.copyFrom(generator.origin);
                    this.squareVersusTriangleMaille = generator.squareMailleInsteadOfTriangle;
                }
            }
            Regular.prototype.checkArgs = function () {
                if (!this.makeTriangleOrSquare && !this.makeLinks)
                    mathis.logger.c('few interest if you do not add neither square nor links');
                var cros = new mathis.XYZ(0, 0, 0);
                mathis.geo.cross(this.Vi, this.Vj, cros);
                if (cros.x == Number.NaN || cros.y == Number.NaN || cros.z == Number.NaN)
                    throw 'a problem with Vi of Vj';
                if (cros.length() < mathis.geo.epsilon)
                    throw 'origin and end are almost in the same line';
            };
            Regular.prototype.getVertex = function (i, j) {
                this._xyz.x = i;
                this._xyz.y = j;
                this._xyz.z = this.fixedK;
                return this.paramToVertex.getValue(this._xyz);
            };
            Regular.prototype.go = function () {
                this.checkArgs();
                for (var i = 0; i < this.nbI; i++) {
                    for (var j = 0; j < this.nbJ; j++) {
                        var param = new mathis.XYZ(i, j, this.fixedK);
                        if (this.holeParameters == null || !this.holeParameters.getValue(param)) {
                            var decay = (!this.squareVersusTriangleMaille && j % 2 == 0) ? 0.5 : 0;
                            this._iDirection.copyFrom(this.Vi).scale(i + decay);
                            this._jDirection.copyFrom(this.Vj).scale(j);
                            this._kDirection.copyFrom(this.Vk).scale(this.fixedK);
                            var position = new mathis.XYZ(0, 0, 0).add(this._iDirection).add(this._jDirection).add(this._kDirection).add(this.origine);
                            if (this.putAVertexOnlyAtXYZCheckingThisCondition == null || this.putAVertexOnlyAtXYZCheckingThisCondition(position)) {
                                var vertex = this.mamesh.newVertex(position, 0, param);
                                this.paramToVertex.putValue(param, vertex);
                            }
                        }
                    }
                }
                if (this.oneMoreVertexForOddLine) {
                    var i = this.nbI;
                    for (var j = 0; j < this.nbJ; j++) {
                        if (j % 2 == 1) {
                            var param = new mathis.XYZ(i, j, this.fixedK);
                            if (this.holeParameters == null || !this.holeParameters.getValue(param)) {
                                var decay = (!this.squareVersusTriangleMaille && j % 2 == 0) ? 0.5 : 0;
                                this._iDirection.copyFrom(this.Vi).scale(i + decay);
                                this._jDirection.copyFrom(this.Vj).scale(j);
                                this._kDirection.copyFrom(this.Vk).scale(this.fixedK);
                                var position = new mathis.XYZ(0, 0, 0).add(this._iDirection).add(this._jDirection).add(this._kDirection).add(this.origine);
                                if (this.putAVertexOnlyAtXYZCheckingThisCondition == null || this.putAVertexOnlyAtXYZCheckingThisCondition(position)) {
                                    var vertex = this.mamesh.newVertex(position, 0, param);
                                    this.paramToVertex.putValue(param, vertex);
                                }
                            }
                        }
                    }
                }
                if (this.mamesh.vertices.length == 0)
                    console.log('you have created a IN_mamesh with no vertex. Perhaps because of {@link Regular.putAVertexOnlyAtXYZCheckingThisCondition }');
                if (this.makeLinks) {
                    if (!this.squareVersusTriangleMaille)
                        this.linksCreationForTriangle();
                    else
                        this.linksCreationForSquare();
                }
                if (this.makeTriangleOrSquare) {
                    if (!this.squareVersusTriangleMaille)
                        this.triangleCreation();
                    else
                        this.squareCreation();
                }
                if (this.markBorder) {
                    if (this.squareVersusTriangleMaille) {
                        for (var _i = 0, _a = this.mamesh.vertices; _i < _a.length; _i++) {
                            var v = _a[_i];
                            if (v.links.length != 4)
                                v.markers.push(mathis.Vertex.Markers.border);
                        }
                    }
                    else {
                        for (var _b = 0, _c = this.mamesh.vertices; _b < _c.length; _b++) {
                            var v = _c[_b];
                            if (v.links.length != 6)
                                v.markers.push(mathis.Vertex.Markers.border);
                        }
                    }
                }
                if (this.markCorner) {
                    var oneMore = (this.oneMoreVertexForOddLine && this.nbJ % 2 == 0) ? 1 : 0;
                    var vertex = void 0;
                    vertex = this.getVertex(0, 0);
                    if (vertex != null)
                        vertex.markers.push(mathis.Vertex.Markers.corner);
                    vertex = this.getVertex(this.nbI - 1 + oneMore, this.nbJ - 1);
                    if (vertex != null)
                        vertex.markers.push(mathis.Vertex.Markers.corner);
                    vertex = this.getVertex(0, this.nbJ - 1);
                    if (vertex != null)
                        vertex.markers.push(mathis.Vertex.Markers.corner);
                    vertex = this.getVertex(this.nbI - 1, 0);
                    if (vertex != null)
                        vertex.markers.push(mathis.Vertex.Markers.corner);
                }
                if (this.markCenter) {
                    var iCenter = this.nbI / 2;
                    var iCenters = [];
                    if (Math.floor(iCenter) != iCenter) {
                        iCenters.push(Math.floor(iCenter));
                    }
                    else
                        iCenters.push(Math.floor(iCenter), Math.floor(iCenter) - 1);
                    var jCenter = this.nbJ / 2;
                    var jCenters = [];
                    if (Math.floor(jCenter) != jCenter) {
                        jCenters.push(Math.floor(jCenter));
                    }
                    else
                        jCenters.push(Math.floor(jCenter), Math.floor(jCenter) - 1);
                    for (var _d = 0, iCenters_1 = iCenters; _d < iCenters_1.length; _d++) {
                        var i = iCenters_1[_d];
                        for (var _e = 0, jCenters_1 = jCenters; _e < jCenters_1.length; _e++) {
                            var j = jCenters_1[_e];
                            var vertex = this.getVertex(i, j);
                            if (vertex != null)
                                vertex.markers.push(mathis.Vertex.Markers.center);
                        }
                    }
                }
                return this.mamesh;
            };
            Regular.prototype.linksCreationForSquare = function () {
                var _this = this;
                this.mamesh.vertices.forEach(function (cell) {
                    makeLinksFromDeltaParam(cell, mathis.XYZ.temp0(1, 0, 0), mathis.XYZ.temp1(-1, 0, 0), _this.paramToVertex);
                    makeLinksFromDeltaParam(cell, mathis.XYZ.temp0(0, 1, 0), mathis.XYZ.temp1(0, -1, 0), _this.paramToVertex);
                });
            };
            Regular.prototype.squareCreation = function () {
                var dir1 = new mathis.XYZ(1, 0, 0);
                var dir2 = new mathis.XYZ(0, 1, 0);
                for (var _i = 0, _a = this.mamesh.vertices; _i < _a.length; _i++) {
                    var vertex = _a[_i];
                    makeSquareFromDeltaParam(vertex, this.mamesh, dir1, dir2, this.paramToVertex);
                }
            };
            Regular.prototype.linksCreationForTriangle = function () {
                var _this = this;
                this.mamesh.vertices.forEach(function (cell) {
                    makeLinksFromDeltaParam(cell, mathis.XYZ.temp0(1, 0, 0), mathis.XYZ.temp1(-1, 0, 0), _this.paramToVertex);
                    if (cell.param.y % 2 == 0) {
                        makeLinksFromDeltaParam(cell, mathis.XYZ.temp0(1, 1, 0), mathis.XYZ.temp1(0, -1, 0), _this.paramToVertex);
                        makeLinksFromDeltaParam(cell, mathis.XYZ.temp0(0, 1, 0), mathis.XYZ.temp1(1, -1, 0), _this.paramToVertex);
                    }
                    else {
                        makeLinksFromDeltaParam(cell, mathis.XYZ.temp0(0, 1, 0), mathis.XYZ.temp1(-1, -1, 0), _this.paramToVertex);
                        makeLinksFromDeltaParam(cell, mathis.XYZ.temp0(-1, 1, 0), mathis.XYZ.temp1(0, -1, 0), _this.paramToVertex);
                    }
                });
            };
            Regular.prototype.triangleCreation = function () {
                for (var _i = 0, _a = this.mamesh.vertices; _i < _a.length; _i++) {
                    var vertex = _a[_i];
                    var i = vertex.param.x;
                    var j = vertex.param.y;
                    if (j % 2 == 0) {
                        var v1 = vertex;
                        var v2 = this.getVertex(i + 1, j + 1);
                        if (v2 == null)
                            continue;
                        var v3 = this.getVertex(i, j + 1);
                        if (v3 != null)
                            this.mamesh.addATriangle(v1, v2, v3);
                        var v4 = this.getVertex(i + 1, j);
                        if (v4 != null)
                            this.mamesh.addATriangle(v1, v4, v2);
                    }
                    else {
                        var v1 = vertex;
                        var v2 = this.getVertex(i, j + 1);
                        if (v2 == null)
                            continue;
                        var v3 = this.getVertex(i + 1, j);
                        if (v3 != null)
                            this.mamesh.addATriangle(v1, v3, v2);
                        var v4 = this.getVertex(i + 1, j + 1);
                        if (v4 != null)
                            this.mamesh.addATriangle(v2, v3, v4);
                    }
                }
            };
            return Regular;
        }());
        reseau.Regular = Regular;
        var Regular1D = (function () {
            function Regular1D(size) {
                if (size === void 0) { size = 5; }
                this.size = size;
                this.origin = new mathis.XYZ(0, 0, 0);
                this.end = new mathis.XYZ(1, 0, 0);
            }
            Regular1D.prototype.go = function () {
                var res = new mathis.Mamesh();
                for (var i = 0; i < this.size; i++) {
                    var vertex = new mathis.Vertex();
                    vertex.position = this.iToXYX(i);
                    res.vertices.push(vertex);
                }
                for (var i = 1; i < this.size - 1; i++) {
                    res.vertices[i].setTwoOppositeLinks(res.vertices[i - 1], res.vertices[i + 1]);
                }
                res.vertices[0].setOneLink(res.vertices[1]);
                res.vertices[this.size - 1].setOneLink(res.vertices[this.size - 2]);
                return res;
            };
            Regular1D.prototype.iToXYX = function (i) {
                var delta = i / (this.size - 1);
                return mathis.XYZ.newFrom(this.end).substract(this.origin).scale(delta).add(this.origin);
            };
            return Regular1D;
        }());
        reseau.Regular1D = Regular1D;
        var Regular3D = (function () {
            function Regular3D() {
                this.nbI = 3;
                this.nbJ = 3;
                this.nbK = 3;
                this.Vi = new mathis.XYZ(1, 0, 0);
                this.Vj = new mathis.XYZ(0, 1, 0);
                this.Vk = new mathis.XYZ(0, 0, 1);
                this.origine = new mathis.XYZ(0, 0, 0);
                this.decayOddStrates = false;
                this.makeLinks = true;
                this.makeTriangleOrSquare = true;
                this.strateHaveSquareMailleVersusTriangleMaille = true;
                this.oneMoreVertexForOddLine = false;
                this.interStrateMailleAreSquareVersusTriangle = true;
                this.createJKSquares = true;
                this.createIKSquaresOrTriangles = true;
                this.putAVertexOnlyAtXYZCheckingThisCondition = null;
                this.paramToVertex = new mathis.HashMap();
            }
            Regular3D.prototype.go = function () {
                var _this = this;
                this.mamesh = new mathis.Mamesh();
                var xDecay = new mathis.XYZ(0, 0, 0);
                if (this.decayOddStrates)
                    xDecay.add(this.Vi).scale(0.5);
                for (var k = 0; k < this.nbK; k++) {
                    var twoD = new Regular();
                    twoD.makeTriangleOrSquare = this.makeTriangleOrSquare;
                    twoD.makeLinks = true;
                    twoD.oneMoreVertexForOddLine = this.oneMoreVertexForOddLine;
                    twoD.squareVersusTriangleMaille = this.strateHaveSquareMailleVersusTriangleMaille;
                    twoD.nbI = this.nbI;
                    twoD.nbJ = this.nbJ;
                    twoD.fixedK = k;
                    twoD.Vi = this.Vi;
                    twoD.Vj = this.Vj;
                    twoD.Vk.copyFrom(this.Vk);
                    twoD.origine = mathis.XYZ.newFrom(this.origine);
                    if (k % 2 == 1)
                        twoD.origine.substract(xDecay);
                    twoD.putAVertexOnlyAtXYZCheckingThisCondition = this.putAVertexOnlyAtXYZCheckingThisCondition;
                    var twoDimMamesh = twoD.go();
                    for (var _i = 0, _a = twoD.paramToVertex.allEntries(); _i < _a.length; _i++) {
                        var entry = _a[_i];
                        this.mamesh.vertices.push(entry.value);
                        this.paramToVertex.putValue(entry.key, entry.value);
                    }
                    for (var _b = 0, _c = twoDimMamesh.smallestSquares; _b < _c.length; _b++) {
                        var vertex = _c[_b];
                        this.mamesh.smallestSquares.push(vertex);
                    }
                    for (var _d = 0, _e = twoDimMamesh.smallestTriangles; _d < _e.length; _d++) {
                        var vertex = _e[_d];
                        this.mamesh.smallestTriangles.push(vertex);
                    }
                }
                if (this.interStrateMailleAreSquareVersusTriangle) {
                    this.linksCreationForSquareMaille();
                    if (this.createJKSquares) {
                        var dir1_1 = new mathis.XYZ(0, 1, 0);
                        var dir2_1 = new mathis.XYZ(0, 0, 1);
                        this.mamesh.vertices.forEach(function (v) {
                            makeSquareFromDeltaParam(v, _this.mamesh, dir1_1, dir2_1, _this.paramToVertex);
                        });
                    }
                    if (this.createIKSquaresOrTriangles) {
                        var dir1_2 = new mathis.XYZ(1, 0, 0);
                        var dir2_2 = new mathis.XYZ(0, 0, 1);
                        this.mamesh.vertices.forEach(function (v) {
                            makeSquareFromDeltaParam(v, _this.mamesh, dir1_2, dir2_2, _this.paramToVertex);
                        });
                    }
                }
                else {
                    this.linksCreationForTriangleMaille();
                    if (this.createJKSquares) {
                        var dir1_3 = new mathis.XYZ(0, 1, 0);
                        var dir2_3 = new mathis.XYZ(0, 0, 1);
                        this.mamesh.vertices.forEach(function (v) {
                            makeSquareFromDeltaParam(v, _this.mamesh, dir1_3, dir2_3, _this.paramToVertex);
                        });
                    }
                    if (this.createIKSquaresOrTriangles) {
                        this.triangleCreation();
                    }
                }
                return this.mamesh;
            };
            Regular3D.prototype.linksCreationForSquareMaille = function () {
                var _this = this;
                var vec001 = new mathis.XYZ(0, 0, 1);
                var vec_001 = new mathis.XYZ(0, 0, -1);
                this.mamesh.vertices.forEach(function (v) {
                    makeLinksFromDeltaParam(v, vec001, vec_001, _this.paramToVertex);
                });
            };
            Regular3D.prototype.linksCreationForTriangleMaille = function () {
                var _this = this;
                this.mamesh.vertices.forEach(function (cell) {
                    if (cell.param.z % 2 == 0) {
                        makeLinksFromDeltaParam(cell, mathis.XYZ.temp0(1, 0, 1), mathis.XYZ.temp1(0, 0, -1), _this.paramToVertex);
                        makeLinksFromDeltaParam(cell, mathis.XYZ.temp0(0, 0, 1), mathis.XYZ.temp1(1, 0, -1), _this.paramToVertex);
                    }
                    else {
                        makeLinksFromDeltaParam(cell, mathis.XYZ.temp0(0, 0, 1), mathis.XYZ.temp1(-1, 0, -1), _this.paramToVertex);
                        makeLinksFromDeltaParam(cell, mathis.XYZ.temp0(-1, 0, 1), mathis.XYZ.temp1(0, 0, -1), _this.paramToVertex);
                    }
                });
            };
            Regular3D.prototype.getVertex = function (i, j, givenK) {
                return this.paramToVertex.getValue(new mathis.XYZ(i, givenK, j));
            };
            Regular3D.prototype.triangleCreation = function () {
                for (var _i = 0, _a = this.mamesh.vertices; _i < _a.length; _i++) {
                    var vertex = _a[_i];
                    var i = vertex.param.x;
                    var j = vertex.param.z;
                    var k = vertex.param.y;
                    if (j % 2 == 0) {
                        var v1 = vertex;
                        var v2 = this.getVertex(i + 1, j + 1, k);
                        if (v2 == null)
                            continue;
                        var v3 = this.getVertex(i, j + 1, k);
                        if (v3 != null)
                            this.mamesh.addATriangle(v1, v2, v3);
                        var v4 = this.getVertex(i + 1, j, k);
                        if (v4 != null)
                            this.mamesh.addATriangle(v1, v4, v2);
                    }
                    else {
                        var v1 = vertex;
                        var v2 = this.getVertex(i, j + 1, k);
                        if (v2 == null)
                            continue;
                        var v3 = this.getVertex(i + 1, j, k);
                        if (v3 != null)
                            this.mamesh.addATriangle(v1, v3, v2);
                        var v4 = this.getVertex(i + 1, j + 1, k);
                        if (v4 != null)
                            this.mamesh.addATriangle(v2, v3, v4);
                    }
                }
            };
            return Regular3D;
        }());
        reseau.Regular3D = Regular3D;
    })(reseau = mathis.reseau || (mathis.reseau = {}));
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    var spacialTransformations;
    (function (spacialTransformations) {
        var RoundSomeStrates = (function () {
            function RoundSomeStrates(mamesh) {
                this.propBeginToRound = 0;
                this.propEndToRound = 1;
                this.integerBeginToRound = null;
                this.integerEndToRound = null;
                this.exponentOfRoundingFunction = 1;
                this.referenceRadiusIsMinVersusMaxVersusMean = 2;
                this.preventStratesCrossings = true;
                this.mamesh = mamesh;
            }
            RoundSomeStrates.prototype.goChanging = function () {
                if (isNaN(this.exponentOfRoundingFunction))
                    throw 'must be a number';
                if (this.propBeginToRound < 0 || this.propBeginToRound > 1)
                    throw 'must be in [0,1]';
                if (this.propEndToRound < 0 || this.propEndToRound > 1)
                    throw 'must be in [0,1]';
                if (this.propBeginToRound >= this.propEndToRound)
                    return;
                var border = [];
                for (var _i = 0, _a = this.mamesh.vertices; _i < _a.length; _i++) {
                    var ver = _a[_i];
                    if (ver.hasMark(mathis.Vertex.Markers.border))
                        border.push(ver);
                }
                var rings = mathis.graph.ringify(border);
                if (this.integerBeginToRound == null)
                    this.integerBeginToRound = Math.floor(rings.length * this.propBeginToRound);
                if (this.integerEndToRound == null)
                    this.integerEndToRound = Math.ceil(rings.length * this.propEndToRound);
                if (this.integerEndToRound < 0)
                    this.integerEndToRound = rings.length + this.integerEndToRound;
                if (this.integerBeginToRound > rings.length || this.integerBeginToRound < 0)
                    throw 'problem';
                if (this.integerEndToRound > rings.length || this.integerEndToRound < 0)
                    throw 'problem';
                if (this.integerEndToRound <= this.integerBeginToRound)
                    return;
                var barycenter = new mathis.XYZ(0, 0, 0);
                for (var _b = 0, _c = this.mamesh.vertices; _b < _c.length; _b++) {
                    var vertex = _c[_b];
                    barycenter.add(vertex.position);
                }
                barycenter.scale(1 / this.mamesh.vertices.length);
                var temp = new mathis.XYZ(0, 0, 0);
                var lastReferenceRadius = null;
                for (var i = this.integerBeginToRound; i < this.integerEndToRound; i++) {
                    var maxRadius = -1;
                    var minRadius = Number.POSITIVE_INFINITY;
                    var meanRadois = 0;
                    for (var _d = 0, _e = rings[i]; _d < _e.length; _d++) {
                        var v = _e[_d];
                        var radius = mathis.geo.distance(v.position, barycenter);
                        if (radius > maxRadius)
                            maxRadius = radius;
                        if (radius < minRadius)
                            minRadius = radius;
                        meanRadois += radius;
                    }
                    meanRadois /= rings[i].length;
                    if (maxRadius > mathis.geo.epsilon) {
                        var referenceRadius = void 0;
                        if (this.referenceRadiusIsMinVersusMaxVersusMean == 0)
                            referenceRadius = minRadius;
                        else if (this.referenceRadiusIsMinVersusMaxVersusMean == 1)
                            referenceRadius = maxRadius;
                        else if (this.referenceRadiusIsMinVersusMaxVersusMean == 2)
                            referenceRadius = meanRadois;
                        lastReferenceRadius = referenceRadius;
                        for (var _f = 0, _g = rings[i]; _f < _g.length; _f++) {
                            var v = _g[_f];
                            var newPosition = temp.copyFrom(v.position).substract(barycenter);
                            var length_7 = newPosition.length();
                            var ratio = Math.pow(referenceRadius / length_7, this.exponentOfRoundingFunction);
                            newPosition.scale(ratio);
                            v.position.copyFrom(newPosition.add(barycenter));
                        }
                    }
                }
                if (this.preventStratesCrossings) {
                    if (this.integerBeginToRound > 0) {
                        var maxRadiusOfRound = -1;
                        for (var _h = 0, _j = rings[this.integerBeginToRound]; _h < _j.length; _h++) {
                            var v = _j[_h];
                            var radius = mathis.geo.distance(v.position, barycenter);
                            if (radius > maxRadiusOfRound)
                                maxRadiusOfRound = radius;
                        }
                        var minRadiusOfNonExterior = Number.POSITIVE_INFINITY;
                        for (var _k = 0, _l = rings[this.integerBeginToRound - 1]; _k < _l.length; _k++) {
                            var v = _l[_k];
                            var radius = mathis.geo.distance(v.position, barycenter);
                            if (radius < minRadiusOfNonExterior)
                                minRadiusOfNonExterior = radius;
                        }
                        var factor = null;
                        if (1.1 * maxRadiusOfRound > minRadiusOfNonExterior)
                            factor = (1.1 * maxRadiusOfRound) / minRadiusOfNonExterior;
                        if (factor != null) {
                            for (var j = 0; j < this.integerBeginToRound; j++) {
                                for (var _m = 0, _o = rings[j]; _m < _o.length; _m++) {
                                    var v = _o[_m];
                                    v.position.copyFrom(temp.copyFrom(v.position).substract(barycenter).scale(factor).add(barycenter));
                                }
                            }
                        }
                    }
                    if (this.integerEndToRound < rings.length) {
                        var minRadiusOfRound = Number.POSITIVE_INFINITY;
                        for (var _p = 0, _q = rings[this.integerEndToRound - 1]; _p < _q.length; _p++) {
                            var v = _q[_p];
                            var radius = mathis.geo.distance(v.position, barycenter);
                            if (radius < minRadiusOfRound)
                                minRadiusOfRound = radius;
                        }
                        var maxRadiusOfInterior = -1;
                        for (var _r = 0, _s = rings[this.integerEndToRound]; _r < _s.length; _r++) {
                            var v = _s[_r];
                            var radius = mathis.geo.distance(v.position, barycenter);
                            if (radius > maxRadiusOfInterior)
                                maxRadiusOfInterior = radius;
                        }
                        var factor = null;
                        if (1.1 * maxRadiusOfInterior > minRadiusOfRound)
                            factor = minRadiusOfRound / (1.1 * maxRadiusOfInterior);
                        if (factor != null) {
                            for (var j = this.integerEndToRound; j < rings.length; j++) {
                                for (var _t = 0, _u = rings[j]; _t < _u.length; _t++) {
                                    var v = _u[_t];
                                    v.position.copyFrom(temp.copyFrom(v.position).substract(barycenter).scale(factor).add(barycenter));
                                }
                            }
                        }
                    }
                }
            };
            return RoundSomeStrates;
        }());
        spacialTransformations.RoundSomeStrates = RoundSomeStrates;
        var Similitude = (function () {
            function Similitude(vertices, angle, vectorForTranslation, sizesForResize) {
                if (vectorForTranslation === void 0) { vectorForTranslation = new mathis.XYZ(0, 0, 0); }
                if (sizesForResize === void 0) { sizesForResize = new mathis.XYZ(1, 1, 1); }
                this.axisForRotation = new mathis.XYZ(0, 0, 1);
                this.centerForSimilitude = null;
                this.vertices = vertices;
                this.angle = angle;
                this.vectorForTranslation = vectorForTranslation;
                this.sizesForResize = sizesForResize;
            }
            Similitude.prototype.goChanging = function () {
                var _this = this;
                if (this.centerForSimilitude == null) {
                    this.centerForSimilitude = new mathis.XYZ(0, 0, 0);
                    var w_1 = 1 / this.vertices.length;
                    var ws_1 = [];
                    var positions_1 = [];
                    this.vertices.forEach(function (v) {
                        positions_1.push(v.position);
                        ws_1.push(w_1);
                    });
                    mathis.geo.baryCenter(positions_1, ws_1, this.centerForSimilitude);
                }
                var mat = new mathis.MM();
                mathis.geo.axisAngleToMatrix(this.axisForRotation, this.angle, mat);
                this.vertices.forEach(function (v) {
                    v.position.substract(_this.centerForSimilitude);
                    v.position.resizes(_this.sizesForResize);
                    mathis.geo.multiplicationMatrixVector(mat, v.position, v.position);
                    v.position.add(_this.centerForSimilitude).add(_this.vectorForTranslation);
                });
            };
            return Similitude;
        }());
        spacialTransformations.Similitude = Similitude;
        function adjustInASquare(mamesh, origine, end) {
            var actualEnd = mathis.XYZ.newFrom(mamesh.vertices[0].position);
            var actualOrigin = mathis.XYZ.newFrom(mamesh.vertices[0].position);
            for (var _i = 0, _a = mamesh.vertices; _i < _a.length; _i++) {
                var vert = _a[_i];
                if (vert.position.x > actualEnd.x)
                    actualEnd.x = vert.position.x;
                if (vert.position.y > actualEnd.y)
                    actualEnd.y = vert.position.y;
                if (vert.position.x < actualOrigin.x)
                    actualOrigin.x = vert.position.x;
                if (vert.position.y < actualOrigin.y)
                    actualOrigin.y = vert.position.y;
            }
            var actualAmplitude = mathis.XYZ.newFrom(actualEnd).substract(actualOrigin);
            var ampli = mathis.XYZ.newFrom(end).substract(origine);
            var factor = new mathis.XYZ(ampli.x / actualAmplitude.x, ampli.y / actualAmplitude.y, 0);
            for (var _b = 0, _c = mamesh.vertices; _b < _c.length; _b++) {
                var vert = _c[_b];
                vert.position.substract(actualOrigin).resizes(factor).add(origine);
            }
        }
        spacialTransformations.adjustInASquare = adjustInASquare;
    })(spacialTransformations = mathis.spacialTransformations || (mathis.spacialTransformations = {}));
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    var fractal;
    (function (fractal) {
        var StableRandomFractal = (function () {
            function StableRandomFractal(mamesh) {
                this.referenceDistanceBetweenVertexWithZeroDichoLevel = 0.1;
                this.deformationFromCenterVersusFromDirection = true;
                this.center = new mathis.XYZ(0, 0, 0);
                this.direction = new mathis.XYZ(0, 0, 1);
                this.alpha = 1.7;
                this.beta = 0.7;
                this.seed = 22345;
                this.mamesh = mamesh;
            }
            StableRandomFractal.prototype.go = function () {
                this.simuStable = new mathis.proba.StableLaw();
                this.simuStable.alpha = this.alpha;
                this.simuStable.beta = this.beta;
                this.simuStable.nbSimu = this.mamesh.vertices.length;
                var generator = new mathis.proba.Random(this.seed);
                this.simuStable.basicGenerator = function () { return generator.pseudoRand(); };
                var X = this.simuStable.go();
                var someThinerDichoLevels = true;
                var randomCount = 0;
                var currentDichoLevel = 0;
                var newPosition = new mathis.XYZ(0, 0, 0);
                var temp = new mathis.XYZ(0, 0, 0);
                while (someThinerDichoLevels) {
                    someThinerDichoLevels = false;
                    for (var key in this.mamesh.cutSegmentsDico) {
                        var segment = this.mamesh.cutSegmentsDico[key];
                        if (Math.max(segment.a.dichoLevel, segment.b.dichoLevel) == currentDichoLevel) {
                            someThinerDichoLevels = true;
                            var modif = X[randomCount++] * Math.pow(this.referenceDistanceBetweenVertexWithZeroDichoLevel / Math.pow(2, currentDichoLevel), 1 / this.simuStable.alpha);
                            mathis.geo.between(segment.a.position, segment.b.position, 1 / 2, newPosition);
                            if (this.deformationFromCenterVersusFromDirection) {
                                newPosition.substract(this.center);
                                newPosition.scale(1 + modif);
                            }
                            else {
                                temp.copyFrom(this.direction).scale(modif);
                                newPosition.add(temp);
                            }
                            segment.middle.position.copyFrom(newPosition);
                        }
                    }
                    currentDichoLevel++;
                }
            };
            return StableRandomFractal;
        }());
        fractal.StableRandomFractal = StableRandomFractal;
    })(fractal = mathis.fractal || (mathis.fractal = {}));
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    var metropolis;
    (function (metropolis) {
        var IsingModel = (function () {
            function IsingModel(graph) {
                this.nbActionsPerIteration = 1000;
                this.q = Number.POSITIVE_INFINITY;
                this.beta = 0.01;
                this.graph = graph;
            }
            IsingModel.prototype.checkArgs = function () {
                if (this.q == null || this.beta == null)
                    throw 'q or beta is null';
                if (this.q <= 0)
                    throw 'q must be positive';
            };
            IsingModel.prototype.go = function () {
                this.checkArgs();
                if (this.q == Number.POSITIVE_INFINITY)
                    this.possibleValues = [-1, 1];
                else
                    this.possibleValues = [-1, 0, 1];
                this.initialisation();
            };
            IsingModel.prototype.iterateAndGetChangedVertices = function () {
                var res = new mathis.HashMap(true);
                for (var i = 0; i < this.nbActionsPerIteration; i++) {
                    var valuedVertex = void 0;
                    var possibleNewValue = void 0;
                    if (this.beta != Number.POSITIVE_INFINITY) {
                        var randomIndex = Math.floor(Math.random() * this.graph.length);
                        valuedVertex = this.graph[randomIndex];
                        possibleNewValue = this.newValue();
                    }
                    else {
                        var ok = false;
                        while (!ok) {
                            var randomIndex = Math.floor(Math.random() * this.graph.length);
                            valuedVertex = this.graph[randomIndex];
                            possibleNewValue = this.newValue();
                            var voi = null;
                            var ok_1 = true;
                            for (var _i = 0, _a = valuedVertex.links; _i < _a.length; _i++) {
                                voi = _a[_i];
                                if (voi.to.customerObject.value * possibleNewValue == -1) {
                                    ok_1 = false;
                                    break;
                                }
                            }
                        }
                    }
                    var ratioEnergy = this.energyRatio(valuedVertex, possibleNewValue);
                    if (ratioEnergy >= 1 || Math.random() < ratioEnergy) {
                        valuedVertex.customerObject.value = possibleNewValue;
                        res.putValue(valuedVertex, possibleNewValue);
                    }
                }
                return res;
            };
            IsingModel.prototype.newValue = function () {
                var randomIndex = Math.floor(Math.random() * this.possibleValues.length);
                return this.possibleValues[randomIndex];
            };
            IsingModel.prototype.energyRatio = function (ver, possibleNewValue) {
                var res = 1;
                if (this.q != 1 && this.q != Number.POSITIVE_INFINITY) {
                    res = Math.pow(this.q, Math.abs(possibleNewValue) - Math.abs(ver.customerObject.value));
                }
                if (this.beta != 0 && this.beta != Number.POSITIVE_INFINITY) {
                    var diff_1 = possibleNewValue - ver.customerObject.value;
                    if (this.beta != 0 && this.beta != Number.POSITIVE_INFINITY) {
                        var sac_1 = 0;
                        ver.links.forEach(function (li) {
                            sac_1 += diff_1 * li.to.customerObject.value;
                        });
                        res *= Math.exp(this.beta * sac_1);
                    }
                }
                return res;
            };
            IsingModel.prototype.initialisation = function () {
                this.graph.forEach(function (v) {
                    v.customerObject.value = 0;
                });
            };
            return IsingModel;
        }());
        metropolis.IsingModel = IsingModel;
    })(metropolis = mathis.metropolis || (mathis.metropolis = {}));
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    var proba;
    (function (proba) {
        var Random = (function () {
            function Random(seed) {
                if (seed === void 0) { seed = 1234567; }
                this.seed = seed;
            }
            Random.prototype.pseudoRand = function () {
                var max = Math.pow(2, 32);
                this.seed += (this.seed * this.seed) | 5;
                return (this.seed >>> 32) / max;
            };
            Random.prototype.pseudoRandInt = function (size) {
                var res = Math.floor(size * this.pseudoRand());
                if (res == size)
                    res--;
                return res;
            };
            return Random;
        }());
        proba.Random = Random;
        var Gaussian = (function () {
            function Gaussian() {
                this.mean = 0;
                this.stdev = 1;
                this.knuthVersusBowMuller = true;
                this.use_last = false;
            }
            Gaussian.prototype.go = function () {
                if (this.knuthVersusBowMuller)
                    return this.knuth();
                else
                    return this.bowMuller();
            };
            Gaussian.prototype.bowMuller = function () {
                var u = 1 - Math.random();
                var v = 1 - Math.random();
                return this.mean + this.stdev * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
            };
            Gaussian.prototype.knuth = function () {
                var y1;
                if (this.use_last) {
                    y1 = this.y2;
                    this.use_last = false;
                }
                else {
                    var x1, x2, w;
                    do {
                        x1 = 2.0 * Math.random() - 1.0;
                        x2 = 2.0 * Math.random() - 1.0;
                        w = x1 * x1 + x2 * x2;
                    } while (w >= 1.0);
                    w = Math.sqrt((-2.0 * Math.log(w)) / w);
                    y1 = x1 * w;
                    this.y2 = x2 * w;
                    this.use_last = true;
                }
                var retval = this.mean + this.stdev * y1;
                if (retval > 0)
                    return retval;
                return -retval;
            };
            return Gaussian;
        }());
        proba.Gaussian = Gaussian;
        function gaussian(mean, stdev) {
            var y2;
            var use_last = false;
            return function () {
                var y1;
                if (use_last) {
                    y1 = y2;
                    use_last = false;
                }
                else {
                    var x1, x2, w;
                    do {
                        x1 = 2.0 * Math.random() - 1.0;
                        x2 = 2.0 * Math.random() - 1.0;
                        w = x1 * x1 + x2 * x2;
                    } while (w >= 1.0);
                    w = Math.sqrt((-2.0 * Math.log(w)) / w);
                    y1 = x1 * w;
                    y2 = x2 * w;
                    use_last = true;
                }
                var retval = mean + stdev * y1;
                if (retval > 0)
                    return retval;
                return -retval;
            };
        }
        proba.gaussian = gaussian;
        var StableLaw = (function () {
            function StableLaw() {
                this.nbSimu = 1;
                this.alpha = 1.5;
                this.beta = 0;
                this.sigma = 1;
                this.mu = 0;
                this.basicGenerator = Math.random;
            }
            StableLaw.prototype.checkArgs = function () {
                if (this.alpha > 2 || this.alpha <= 0)
                    throw 'alpha must be in (0,2]';
                if (this.beta < -1 || this.beta > 1)
                    throw 'beta must be in [-1,1]';
            };
            StableLaw.prototype.go = function () {
                this.checkArgs();
                var X = [];
                for (var i = 0; i < this.nbSimu; i++) {
                    var V = this.basicGenerator() * Math.PI - Math.PI / 2;
                    var W = -Math.log(this.basicGenerator());
                    if (this.alpha != 1) {
                        var ta = Math.tan(Math.PI * this.alpha / 2);
                        var B = Math.atan(this.beta * ta) / this.alpha;
                        var S = (1 + this.beta ^ 2 * ta ^ 2) ^ (1 / 2 / this.alpha);
                        X[i] = S * Math.sin(this.alpha * (V + B)) / (Math.pow((Math.cos(V)), (1 / this.alpha)))
                            * Math.pow((Math.cos(V - this.alpha * (V + B)) / W), ((1 - this.alpha) / this.alpha));
                        X[i] = this.sigma * X[i] + this.mu;
                    }
                    else if (this.alpha == 1) {
                        X[i] = 2 / Math.PI * ((Math.PI / 2 + this.beta * V) * Math.tan(V) - this.beta * Math.log(W * Math.cos(V) / (Math.PI / 2 + this.beta * V)));
                        X[i] = this.sigma * X[i] + 2 / Math.PI * this.beta * this.sigma * Math.log(this.sigma) + this.mu;
                    }
                }
                return X;
            };
            return StableLaw;
        }());
        proba.StableLaw = StableLaw;
    })(proba = mathis.proba || (mathis.proba = {}));
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    var usualFunction;
    (function (usualFunction) {
        usualFunction.sinh = function (x) { return (Math.exp(x) - Math.exp(-x)) / 2; };
        usualFunction.tanh = function (x) { return (Math.exp(x) - Math.exp(-x)) / (Math.exp(x) + Math.exp(-x)); };
        usualFunction.sech = function (x) { return 2 / (Math.exp(x) + Math.exp(-x)); };
        usualFunction.sechP = function (x) { return -usualFunction.tanh(x) * usualFunction.sech(x); };
        usualFunction.sechPP = function (x) { return -usualFunction.tanhP(x) * usualFunction.sech(x) - usualFunction.tanh(x) * usualFunction.sechP(x); };
        usualFunction.tanhP = function (x) {
            var ta = usualFunction.tanh(x);
            return 1 - ta * ta;
        };
        usualFunction.tanhPP = function (x) { return -2 * usualFunction.tanh(x) * usualFunction.tanhP(x); };
        usualFunction.tractrice = function (x) { return new mathis.XYZ(usualFunction.sech(x), x - usualFunction.tanh(x), 0); };
        usualFunction.tractriceP = function (x) { return new mathis.XYZ(usualFunction.sechP(x), 1 - usualFunction.tanhP(x), 0); };
        usualFunction.tractricePP = function (x) { return new mathis.XYZ(usualFunction.sechPP(x), -usualFunction.tanhPP(x), 0); };
        usualFunction.rotationYAxis = function (theta) {
            var res = new mathis.MM();
            var cos = Math.cos(theta);
            var sin = Math.sin(theta);
            mathis.geo.numbersToMM(cos, 0, sin, 0, 0, 1, 0, 0, -sin, 0, cos, 0, 0, 0, 0, 1, res);
            return res;
        };
        usualFunction.rotationYAxisP = function (theta) {
            var res = new mathis.MM();
            var cos = Math.cos(theta);
            var sin = Math.sin(theta);
            mathis.geo.numbersToMM(-sin, 0, cos, 0, 0, 0, 0, 0, -cos, 0, -sin, 0, 0, 0, 0, 1, res);
            return res;
        };
        usualFunction.rotationYAxisPP = function (theta) {
            var res = new mathis.MM();
            var cos = Math.cos(theta);
            var sin = Math.sin(theta);
            mathis.geo.numbersToMM(-cos, 0, -sin, 0, 0, 0, 0, 0, sin, 0, -cos, 0, 0, 0, 0, 1, res);
            return res;
        };
    })(usualFunction = mathis.usualFunction || (mathis.usualFunction = {}));
    var riemann;
    (function (riemann) {
        var Carte = (function () {
            function Carte() {
                this.orientationCoef = +1;
                this.unit = 1;
                this.point = new mathis.XYZ(0, 0, 0);
                this._meanLinkLengthAtArrival = null;
            }
            Carte.prototype.xyzToUV = function (xyz, recomputeStandartDevialtion) {
                if (recomputeStandartDevialtion === void 0) { recomputeStandartDevialtion = false; }
                if (this.maillage == null)
                    throw 'you must give a maillage to use xyzToUV ';
                var uv = new mathis.UV(0, 0);
                var shortestDist = Number.MAX_VALUE;
                var minDistToBorder = Number.MAX_VALUE;
                var vertex = null;
                for (var _i = 0, _a = this.maillage.vertices; _i < _a.length; _i++) {
                    vertex = _a[_i];
                    var u = vertex.position.x;
                    var v = vertex.position.y;
                    this.point.copyFrom(this.X(u, v));
                    var dist = mathis.geo.distance(this.point, xyz);
                    if (dist < shortestDist) {
                        shortestDist = dist;
                        uv.u = u;
                        uv.v = v;
                    }
                    if (vertex.hasMark(mathis.Vertex.Markers.border)) {
                        var distToBorder = mathis.geo.distance(xyz, this.point);
                        if (distToBorder < minDistToBorder)
                            minDistToBorder = distToBorder;
                    }
                }
                if (recomputeStandartDevialtion || this._meanLinkLengthAtArrival == null)
                    this._meanLinkLengthAtArrival = this.meanLinkLengthAtArrival();
                if (shortestDist < 1.1 * this._meanLinkLengthAtArrival)
                    return { uv: uv, distToBorder: minDistToBorder, distToNearestArrivalMesh: shortestDist };
                else {
                    return null;
                }
            };
            Carte.prototype.e = function (u, v) {
                return mathis.geo.dot(this.newN(u, v), this.Xuu(u, v));
            };
            Carte.prototype.f = function (u, v) {
                return mathis.geo.dot(this.newN(u, v), this.Xuv(u, v));
            };
            Carte.prototype.g = function (u, v) {
                return mathis.geo.dot(this.newN(u, v), this.Xvv(u, v));
            };
            Carte.prototype.E = function (u, v) {
                return mathis.geo.dot(this.Xu(u, v), this.Xu(u, v));
            };
            Carte.prototype.F = function (u, v) {
                return mathis.geo.dot(this.Xu(u, v), this.Xv(u, v));
            };
            Carte.prototype.G = function (u, v) {
                return mathis.geo.dot(this.Xv(u, v), this.Xv(u, v));
            };
            Carte.prototype.createArrivalMeshFromMaillage = function () {
                var _this = this;
                var mameshDeepCopier = new mathis.mameshModification.MameshDeepCopier(this.maillage);
                mameshDeepCopier.copyCutSegmentsDico = false;
                this.arrivalOpenMesh = mameshDeepCopier.go();
                this.arrivalOpenMesh.vertices.forEach(function (vertex) {
                    var u = vertex.position.x;
                    var v = vertex.position.y;
                    vertex.position = _this.X(u, v);
                });
            };
            Carte.prototype.dNinTangentBasis = function (u, v) {
                var res = new mathis.M22();
                var e = this.e(u, v);
                var f = this.f(u, v);
                var g = this.g(u, v);
                var E = this.E(u, v);
                var F = this.F(u, v);
                var G = this.G(u, v);
                var det = E * G - F * F;
                res.m11 = (f * F - e * G) / det;
                res.m12 = (g * F - f * G) / det;
                res.m21 = (e * F - f * E) / det;
                res.m22 = (f * F - g * E) / det;
                return res;
            };
            Carte.prototype.dNaction = function (u, v, vect) {
                var a = this.dNinTangentBasis(u, v);
                var vectUV = this.canonicalToTangentBasis(u, v, vect);
                var trans = a.multiplyUV(vectUV);
                return this.tagentToCanonicalBasis(u, v, trans);
            };
            Carte.prototype.canonicalToTangentBasis = function (u, v, vect) {
                var Xu = this.Xu(u, v);
                var Xv = this.Xv(u, v);
                var mat = new mathis.M22();
                mat.m11 = Xu.x;
                mat.m21 = Xu.y;
                mat.m21 = Xv.x;
                mat.m22 = Xv.y;
                var inv = mat.inverse();
                cc(inv.determinant());
                var vect2 = new mathis.UV(vect.x, vect.y);
                return inv.multiplyUV(vect2);
            };
            Carte.prototype.tagentToCanonicalBasis = function (u, v, vect) {
                var Xu = this.Xu(u, v);
                var Xv = this.Xv(u, v);
                Xu.scale(vect.u);
                Xv.scale(vect.v);
                return Xu.add(Xv);
            };
            Carte.prototype.newN = function (u, v) {
                var res = new mathis.XYZ(0, 0, 0);
                mathis.geo.cross(this.Xu(u, v), this.Xv(u, v), res);
                res.normalize().scale(this.unit * this.orientationCoef);
                return res;
            };
            Carte.prototype.meanLinkLengthAtArrival = function () {
                var _this = this;
                var res = 0;
                var nb = 0;
                this.maillage.vertices.forEach(function (v) {
                    v.links.forEach(function (l) {
                        nb++;
                        res += mathis.geo.distance(_this.X(v.position.x, v.position.y), _this.X(l.to.position.x, l.to.position.y));
                    });
                });
                return res / nb;
            };
            return Carte;
        }());
        riemann.Carte = Carte;
        var Surface = (function () {
            function Surface() {
                this.cartes = [];
            }
            Surface.prototype.drawTheWholeSurface = function (scene) {
                this.drawOneMesh(this.wholeSurfaceMesh, scene);
            };
            Surface.prototype.drawOneCarte = function (carteIndex, scene) {
                this.drawOneMesh(this.cartes[carteIndex].arrivalOpenMesh, scene);
            };
            Surface.prototype.drawOneMesh = function (mesh, scene) {
                function lineIsChosen(line, space) {
                    var vertOk = true;
                    for (var _i = 0, line_1 = line; _i < line_1.length; _i++) {
                        var vert = line_1[_i];
                        if (vert.param.x % space != 0) {
                            vertOk = false;
                            break;
                        }
                    }
                    var horOk = true;
                    for (var _a = 0, line_2 = line; _a < line_2.length; _a++) {
                        var vert = line_2[_a];
                        if (vert.param.y % space != 0) {
                            horOk = false;
                            break;
                        }
                    }
                    return vertOk || horOk;
                }
                var lin = new mathis.visu3d.LinesViewer(mesh, scene);
                lin.constantRadius = 0.01;
                var linesOnSurf = lin.go();
                linesOnSurf.forEach(function (mesh) { return mesh.isPickable = false; });
                var surf = new mathis.visu3d.SurfaceViewer(mesh, scene);
                surf.alpha = 0.5;
                var meshSurf = surf.go();
            };
            Surface.prototype.findBestCarte = function (xyz) {
                var maxDistToBorder = -1;
                var chosenCarte = null;
                var chosenUV = null;
                this.cartes.forEach(function (carte) {
                    var uvAndDist = carte.xyzToUV(xyz);
                    if (uvAndDist != null && uvAndDist.distToBorder > maxDistToBorder) {
                        maxDistToBorder = uvAndDist.distToBorder;
                        chosenCarte = carte;
                        chosenUV = uvAndDist.uv;
                    }
                });
                if (chosenUV == null) {
                    cc('the point which is not in any cart arrival is:', xyz.toString());
                    throw 'strange, the xyz do not belong to any carte-arrival';
                }
                return { uv: chosenUV, carte: chosenCarte };
            };
            return Surface;
        }());
        riemann.Surface = Surface;
        (function (SurfaceName) {
            SurfaceName[SurfaceName["selle"] = 0] = "selle";
            SurfaceName[SurfaceName["cylinder"] = 1] = "cylinder";
            SurfaceName[SurfaceName["torus"] = 2] = "torus";
            SurfaceName[SurfaceName["pseudoSphere"] = 3] = "pseudoSphere";
        })(riemann.SurfaceName || (riemann.SurfaceName = {}));
        var SurfaceName = riemann.SurfaceName;
        var SurfaceMaker = (function () {
            function SurfaceMaker(surfaceName) {
                this.vertexToCarte = new mathis.HashMap();
                this.carteIndexToMinimalArrivalMesh = [];
                this.surfaceName = surfaceName;
            }
            SurfaceMaker.prototype.go = function () {
                this.surface = new Surface();
                this.surface.cartes = [];
                if (this.surfaceName == SurfaceName.torus) {
                    var oneCarte = function (origin, end) {
                        var gene = new mathis.reseau.BasisForRegularReseau();
                        gene.origin = origin;
                        gene.end = end;
                        gene.nbI = 32;
                        gene.nbJ = 64;
                        var departureMesh = new mathis.reseau.Regular(gene).go();
                        var arrivalMesh = new mathis.reseau.Regular(gene).go();
                        var r = 0.3;
                        var a = 0.7;
                        var carte0 = new Carte();
                        carte0.maillage = departureMesh;
                        carte0.arrivalOpenMesh = arrivalMesh;
                        carte0.X = function (u, v) { return new mathis.XYZ((r * Math.cos(u) + a) * Math.cos(v), (r * Math.cos(u) + a) * Math.sin(v), r * Math.sin(u)); };
                        carte0.Xu = function (u, v) { return new mathis.XYZ(-r * Math.sin(u) * Math.cos(v), -r * Math.sin(u) * Math.sin(v), r * Math.cos(u)); };
                        carte0.Xv = function (u, v) { return new mathis.XYZ(-(r * Math.cos(u) + a) * Math.sin(v), (r * Math.cos(u) + a) * Math.cos(v), 0); };
                        carte0.Xuu = function (u, v) { return new mathis.XYZ(-r * Math.cos(u) * Math.cos(v), -r * Math.cos(u) * Math.sin(v), -r * Math.sin(u)); };
                        carte0.Xuv = function (u, v) { return new mathis.XYZ(r * Math.sin(u) * Math.sin(v), -r * Math.sin(u) * Math.cos(v), 0); };
                        carte0.Xvv = function (u, v) { return new mathis.XYZ(-(r * Math.cos(u) + a) * Math.cos(v), -(r * Math.cos(u) + a) * Math.sin(v), 0); };
                        arrivalMesh.vertices.forEach(function (vert) {
                            var u = vert.position.x;
                            var v = vert.position.y;
                            vert.position = carte0.X(u, v);
                        });
                        return carte0;
                    };
                    var delta = 0.1;
                    this.surface.cartes.push(oneCarte(new mathis.XYZ(delta, delta, 0), new mathis.XYZ(2 * Math.PI - delta, 2 * Math.PI - delta, 0)));
                    this.surface.cartes.push(oneCarte(new mathis.XYZ(-Math.PI + delta, -Math.PI + delta, 0), new mathis.XYZ(Math.PI - delta, Math.PI - delta, 0)));
                    this.surface.wholeSurfaceMesh = oneCarte(new mathis.XYZ(0, 0, 0), new mathis.XYZ(2 * Math.PI, 2 * Math.PI, 0)).arrivalOpenMesh;
                }
                else if (this.surfaceName == SurfaceName.cylinder) {
                    var nb_1 = 40;
                    var oneCarte = function (origin, end) {
                        var gene = new mathis.reseau.BasisForRegularReseau();
                        gene.origin = origin;
                        gene.end = end;
                        gene.nbI = nb_1 + 1;
                        gene.nbJ = nb_1 + 1;
                        var departureMesh = new mathis.reseau.Regular(gene).go();
                        var arrivalMesh = new mathis.reseau.Regular(gene).go();
                        var rad = 0.5;
                        var carte0 = new Carte();
                        carte0.maillage = departureMesh;
                        carte0.arrivalOpenMesh = arrivalMesh;
                        carte0.X = function (u, v) { return new mathis.XYZ(rad * Math.cos(u), v, rad * Math.sin(u)); };
                        carte0.Xu = function (u, v) { return new mathis.XYZ(-rad * Math.sin(u), 0, rad * Math.cos(u)); };
                        carte0.Xv = function (u, v) { return new mathis.XYZ(0, 1, 0); };
                        carte0.Xuu = function (u, v) { return new mathis.XYZ(-rad * Math.cos(u), 0, -rad * Math.sin(u)); };
                        carte0.Xuv = function (u, v) { return new mathis.XYZ(0, 0, 0); };
                        carte0.Xvv = function (u, v) { return new mathis.XYZ(0, 0, 0); };
                        arrivalMesh.vertices.forEach(function (vert) {
                            var u = vert.position.x;
                            var v = vert.position.y;
                            vert.position = carte0.X(u, v);
                        });
                        return carte0;
                    };
                    var delta = 0.3;
                    this.surface.cartes.push(oneCarte(new mathis.XYZ(delta, -1 / 2, 0), new mathis.XYZ(2 * Math.PI - delta, 1 / 2, 0)));
                    this.surface.cartes.push(oneCarte(new mathis.XYZ(delta - Math.PI, -1 / 2, 0), new mathis.XYZ(Math.PI - delta, 1 / 2, 0)));
                    this.surface.wholeSurfaceMesh = oneCarte(new mathis.XYZ(0, -1 / 2, 0), new mathis.XYZ(2 * Math.PI, 1 / 2, 0)).arrivalOpenMesh;
                }
                else if (this.surfaceName == SurfaceName.pseudoSphere) {
                    var oneCarte = function (origin, end) {
                        var gene = new mathis.reseau.BasisForRegularReseau();
                        gene.origin = origin;
                        gene.end = end;
                        gene.nbI = 32 + 1;
                        gene.nbJ = 20 + 1;
                        var departureMesh = new mathis.reseau.Regular(gene).go();
                        var arrivalMesh = new mathis.reseau.Regular(gene).go();
                        var rotationCarteMaker = new riemann.RotationCarteMaker(usualFunction.tractrice);
                        rotationCarteMaker.translation = new mathis.XYZ(0, -1, 0);
                        var sc = 1;
                        rotationCarteMaker.scaling = new mathis.XYZ(sc, sc, sc);
                        rotationCarteMaker.curveP = usualFunction.tractriceP;
                        rotationCarteMaker.curvePP = usualFunction.tractricePP;
                        var carte0 = rotationCarteMaker.go();
                        carte0.maillage = departureMesh;
                        carte0.arrivalOpenMesh = arrivalMesh;
                        arrivalMesh.vertices.forEach(function (vert) {
                            var u = vert.position.x;
                            var v = vert.position.y;
                            vert.position = carte0.X(u, v);
                        });
                        return carte0;
                    };
                    var delta = 0.3;
                    this.surface.cartes.push(oneCarte(new mathis.XYZ(delta, 0.1, 0), new mathis.XYZ(2 * Math.PI - delta, 3.5, 0)));
                    this.surface.cartes.push(oneCarte(new mathis.XYZ(-Math.PI + delta, 0.1, 0), new mathis.XYZ(Math.PI - delta, 3.5, 0)));
                    this.surface.wholeSurfaceMesh = oneCarte(new mathis.XYZ(0, 0.1, 0), new mathis.XYZ(2 * Math.PI, 3.5, 0)).arrivalOpenMesh;
                }
                else if (this.surfaceName == SurfaceName.selle) {
                    var oneCarte = function (origin, end) {
                        var gene = new mathis.reseau.BasisForRegularReseau();
                        gene.origin = origin;
                        gene.end = end;
                        gene.nbI = 40 + 1;
                        gene.nbJ = 40 + 1;
                        var departureMesh = new mathis.reseau.Regular(gene).go();
                        var arrivalMesh = new mathis.reseau.Regular(gene).go();
                        var carte0 = new Carte();
                        carte0.maillage = departureMesh;
                        carte0.arrivalOpenMesh = arrivalMesh;
                        carte0.X = function (u, v) { return new mathis.XYZ(u, v, v * v - u * u); };
                        carte0.Xu = function (u, v) { return new mathis.XYZ(1, 0, -2 * u); };
                        carte0.Xv = function (u, v) { return new mathis.XYZ(0, 1, 2 * v); };
                        carte0.Xuu = function (u, v) { return new mathis.XYZ(0, 0, -2); };
                        carte0.Xuv = function (u, v) { return new mathis.XYZ(0, 0, 0); };
                        carte0.Xvv = function (u, v) { return new mathis.XYZ(0, 0, 2); };
                        arrivalMesh.vertices.forEach(function (vert) {
                            var u = vert.position.x;
                            var v = vert.position.y;
                            vert.position = carte0.X(u, v);
                        });
                        return carte0;
                    };
                    var coef = 0.7;
                    this.surface.cartes.push(oneCarte(new mathis.XYZ(-coef, -coef, 0), new mathis.XYZ(coef, coef, 0)));
                    this.surface.wholeSurfaceMesh = oneCarte(new mathis.XYZ(-coef, -coef, 0), new mathis.XYZ(coef, coef, 0)).arrivalOpenMesh;
                }
                else
                    throw 'not yet';
                this.makeMinimalMeshesForEachCarte();
                return this.surface;
            };
            SurfaceMaker.prototype.makeMinimalMeshesForEachCarte = function () {
                var _this = this;
                var _loop_6 = function(carteIndex) {
                    var carte = this_4.surface.cartes[carteIndex];
                    var selectedVerticesForOneCart = [];
                    carte.arrivalOpenMesh.vertices.forEach(function (vert) {
                        var uvAndCarte = _this.surface.findBestCarte(vert.position);
                        if (uvAndCarte.carte == carte) {
                            _this.vertexToCarte.putValue(vert, carte);
                            selectedVerticesForOneCart.push(vert);
                        }
                    });
                    var subMamesh = new mathis.grateAndGlue.SubMameshExtractor(carte.arrivalOpenMesh, selectedVerticesForOneCart).go();
                    this_4.carteIndexToMinimalArrivalMesh[carteIndex] = subMamesh;
                };
                var this_4 = this;
                for (var carteIndex = 0; carteIndex < this.surface.cartes.length; carteIndex++) {
                    _loop_6(carteIndex);
                }
            };
            return SurfaceMaker;
        }());
        riemann.SurfaceMaker = SurfaceMaker;
        var RotationCarteMaker = (function () {
            function RotationCarteMaker(curve) {
                this.translation = new mathis.XYZ(0, 0, 0);
                this.scaling = new mathis.XYZ(1, 1, 1);
                this.curve = curve;
            }
            RotationCarteMaker.prototype.go = function () {
                var _this = this;
                var res = new Carte();
                res.X = function (u, v) {
                    var r = new mathis.XYZ(0, 0, 0);
                    mathis.geo.multiplicationMatrixVector(usualFunction.rotationYAxis(u), _this.curve(v), r);
                    r.resizes(_this.scaling).add(_this.translation);
                    return r;
                };
                res.Xu = function (u, v) {
                    var r = new mathis.XYZ(0, 0, 0);
                    mathis.geo.multiplicationMatrixVector(usualFunction.rotationYAxisP(u), _this.curve(v), r);
                    r.resizes(_this.scaling);
                    return r;
                };
                res.Xuu = function (u, v) {
                    var r = new mathis.XYZ(0, 0, 0);
                    mathis.geo.multiplicationMatrixVector(usualFunction.rotationYAxisPP(u), _this.curve(v), r);
                    r.resizes(_this.scaling);
                    return r;
                };
                res.Xv = function (u, v) {
                    var r = new mathis.XYZ(0, 0, 0);
                    mathis.geo.multiplicationMatrixVector(usualFunction.rotationYAxis(u), _this.curveP(v), r);
                    r.resizes(_this.scaling);
                    return r;
                };
                res.Xvv = function (u, v) {
                    var r = new mathis.XYZ(0, 0, 0);
                    mathis.geo.multiplicationMatrixVector(usualFunction.rotationYAxis(u), _this.curvePP(v), r);
                    r.resizes(_this.scaling);
                    return r;
                };
                res.Xuv = function (u, v) {
                    var r = new mathis.XYZ(0, 0, 0);
                    mathis.geo.multiplicationMatrixVector(usualFunction.rotationYAxisP(u), _this.curveP(v), r);
                    r.resizes(_this.scaling);
                    return r;
                };
                return res;
            };
            return RotationCarteMaker;
        }());
        riemann.RotationCarteMaker = RotationCarteMaker;
    })(riemann = mathis.riemann || (mathis.riemann = {}));
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    var surfaceConnection;
    (function (surfaceConnection) {
        var SurfaceConnectionProcess = (function () {
            function SurfaceConnectionProcess(mamesh) {
                this.makeLinks = true;
                this.mamesh = mamesh;
            }
            SurfaceConnectionProcess.prototype.go = function () {
                var tabRetenuVect1 = [];
                var tabRetenuVect2 = [];
                var vertexToNormal = new mathis.HashMap();
                var vertexToNumStrat = new mathis.HashMap();
                for (var _i = 0, _a = this.mamesh.vertices; _i < _a.length; _i++) {
                    var v = _a[_i];
                    var minscal = 0;
                    var instantDot = void 0;
                    var vectorTable = [];
                    for (var _b = 0, _c = v.links; _b < _c.length; _b++) {
                        var l = _c[_b];
                        var vect = new BABYLON.Vector3(0, 0, 0);
                        vect.x = l.to.param.x - v.param.x;
                        vect.y = l.to.param.y - v.param.y;
                        vect.z = l.to.param.z - v.param.z;
                        vect.normalize();
                        vectorTable.push(vect);
                    }
                    minscal = BABYLON.Vector3.Dot(vectorTable[0], vectorTable[1]);
                    if (minscal < 0)
                        minscal *= -1;
                    var vect1 = vectorTable[0];
                    var vect2 = vectorTable[1];
                    for (var i_2 = 0; i_2 < vectorTable.length; i_2++) {
                        for (var j = i_2 + 1; j < vectorTable.length; j++) {
                            instantDot = BABYLON.Vector3.Dot(vectorTable[i_2], vectorTable[j]);
                            if (instantDot < 0)
                                instantDot *= -1;
                            if (minscal > instantDot) {
                                minscal = instantDot;
                                vect1 = vectorTable[i_2];
                                vect2 = vectorTable[j];
                            }
                        }
                    }
                    tabRetenuVect1.push(vect1);
                    tabRetenuVect2.push(vect2);
                    vertexToNumStrat.putValue(v, -1);
                }
                for (var i_3 = 0; (i_3 < tabRetenuVect1.length) && (i_3 < tabRetenuVect2.length); i_3++) {
                    var normale = BABYLON.Vector3.Cross(tabRetenuVect1[i_3], tabRetenuVect2[i_3]);
                    normale.normalize();
                    vertexToNormal.putValue(this.mamesh.vertices[i_3], new mathis.XYZ(normale.x, normale.y, normale.z));
                }
                var startvertex = this.mamesh.vertices[0];
                var i = 0;
                while (i < this.mamesh.vertices.length - 1 && vertexToNormal.getValue(startvertex).x == 0 && vertexToNormal.getValue(startvertex).y == 0 && vertexToNormal.getValue(startvertex).z == 0) {
                    startvertex = this.mamesh.vertices[i + 1];
                    i++;
                }
                var markedVertex = [];
                markedVertex.push(startvertex);
                var strates = [];
                strates.push(markedVertex);
                var alreadySeen = new mathis.HashMap();
                var curentEdge = markedVertex;
                while (curentEdge.length > 0) {
                    curentEdge = mathis.graph.getEdge(curentEdge, alreadySeen);
                    strates.push(curentEdge);
                }
                for (var i_4 = 1; i_4 < strates.length; i_4++) {
                    for (var _d = 0, _e = strates[i_4]; _d < _e.length; _d++) {
                        var v = _e[_d];
                        for (var _f = 0, _g = v.links; _f < _g.length; _f++) {
                            var l = _g[_f];
                            for (var _h = 0, _j = strates[i_4 - 1]; _h < _j.length; _h++) {
                                var p = _j[_h];
                                if (l.to == p) {
                                    if (vertexToNormal.getValue(v).x == 0 && vertexToNormal.getValue(v).y == 0 && vertexToNormal.getValue(v).z == 0) {
                                        var newNormale0 = new mathis.XYZ(vertexToNormal.getValue(p).x, vertexToNormal.getValue(p).y, vertexToNormal.getValue(p).z);
                                        vertexToNormal.putValue(v, newNormale0);
                                    }
                                    if (BABYLON.Vector3.Dot(vertexToNormal.getValue(p), vertexToNormal.getValue(v)) < 0) {
                                        var newNormale = new mathis.XYZ(-vertexToNormal.getValue(v).x, -vertexToNormal.getValue(v).y, -vertexToNormal.getValue(v).z);
                                        vertexToNormal.putValue(v, newNormale);
                                    }
                                }
                            }
                        }
                    }
                }
                var tab_polys = [];
                var dejaParcours = new mathis.StringMap();
                var tablinks = [];
                for (var _k = 0, _l = this.mamesh.vertices; _k < _l.length; _k++) {
                    var v = _l[_k];
                    for (var _m = 0, _o = v.links; _m < _o.length; _m++) {
                        var l = _o[_m];
                        dejaParcours.putValue(v.hashNumber + "," + l.to.hashNumber, false);
                        var elemlink = [v, l.to];
                        tablinks.push(elemlink);
                    }
                }
                for (var _p = 0, tablinks_1 = tablinks; _p < tablinks_1.length; _p++) {
                    var lk = tablinks_1[_p];
                    var first_point = lk[0];
                    var v_previous = lk[0];
                    var v_current = lk[1];
                    if (dejaParcours.getValue(v_previous.hashNumber + "," + v_current.hashNumber) != true) {
                        var current_poly = [v_current];
                        var vloop = true;
                        while (vloop) {
                            var anglemin = 6.4;
                            var l_pretend = v_previous.links[0];
                            for (var _q = 0, _r = v_current.links; _q < _r.length; _q++) {
                                var l_concur = _r[_q];
                                if (l_concur.to != v_previous && dejaParcours.getValue(v_current.hashNumber + "," + l_concur.to.hashNumber) != true) {
                                    var vector_l_previous = new mathis.XYZ(v_previous.param.x - v_current.param.x, v_previous.param.y - v_current.param.y, v_previous.param.z - v_current.param.z);
                                    var vector_l_next = new mathis.XYZ(l_concur.to.param.x - v_current.param.x, l_concur.to.param.y - v_current.param.y, l_concur.to.param.z - v_current.param.z);
                                    var newangle = mathis.geo.angleBetweenTwoVectorsBetweenMinusPiAndPi(vector_l_previous, vector_l_next, vertexToNormal.getValue(v_previous));
                                    if (newangle < 0)
                                        newangle = (6.2831853072 + newangle);
                                    if (newangle < anglemin) {
                                        anglemin = newangle;
                                        l_pretend = l_concur;
                                    }
                                }
                            }
                            current_poly.push(l_pretend.to);
                            dejaParcours.putValue(v_current.hashNumber + "," + l_pretend.to.hashNumber, true);
                            v_previous = v_current;
                            v_current = l_pretend.to;
                            if (v_current == first_point) {
                                vloop = false;
                            }
                        }
                        tab_polys.push(current_poly);
                    }
                }
                var tabSurface = [];
                var PolygoIndexToVertexCenter = [];
                var oneOverLength = 0;
                var polyIndex = -1;
                for (var _s = 0, tab_polys_1 = tab_polys; _s < tab_polys_1.length; _s++) {
                    var p = tab_polys_1[_s];
                    polyIndex++;
                    if (p.length == 3) {
                        var distA = mathis.geo.distance(p[0].param, p[1].param);
                        var distB = mathis.geo.distance(p[0].param, p[2].param);
                        var distC = mathis.geo.distance(p[1].param, p[2].param);
                        var heronP = (distA + distB + distC) / 2;
                        var surface = Math.sqrt(heronP * (heronP - distA) * (heronP - distB) * (heronP - distC));
                        tabSurface.push(surface);
                    }
                    else if (p.length == 4) {
                        var distA = mathis.geo.distance(p[0].param, p[1].param);
                        var distB = mathis.geo.distance(p[1].param, p[2].param);
                        var distC = mathis.geo.distance(p[2].param, p[3].param);
                        var distD = mathis.geo.distance(p[3].param, p[0].param);
                        var distE = mathis.geo.distance(p[0].param, p[2].param);
                        var heronP1 = (distA + distB + distE) / 2;
                        var surface1 = Math.sqrt(heronP1 * (heronP1 - distA) * (heronP1 - distB) * (heronP1 - distE));
                        var heronP2 = (distC + distD + distE) / 2;
                        var surface2 = Math.sqrt(heronP2 * (heronP2 - distC) * (heronP2 - distD) * (heronP2 - distE));
                        tabSurface.push(surface1 + surface2);
                    }
                    else if (p.length >= 5) {
                        var centerVertex = new mathis.Vertex().setPosition(0, 0, 0);
                        oneOverLength = 1 / (p.length);
                        var tab1 = [p[0].position];
                        var tab2 = [oneOverLength];
                        for (var _t = 0, p_1 = p; _t < p_1.length; _t++) {
                            var v = p_1[_t];
                            tab1.push(v.position);
                            tab2.push(oneOverLength);
                        }
                        mathis.geo.baryCenter(tab1, tab2, centerVertex.param);
                        var centerVertex2 = new mathis.Vertex().setPosition(centerVertex.param.x, centerVertex.param.y, centerVertex.param.z);
                        var surface3 = 0;
                        for (var i_5 = 0; i_5 < p.length; i_5++) {
                            var distA = mathis.geo.distance(p[i_5].param, p[(i_5 + 1) % (p.length)].param);
                            var distB = mathis.geo.distance(p[(i_5 + 1) % (p.length)].param, centerVertex2.param);
                            var distC = mathis.geo.distance(centerVertex2.param, p[i_5].param);
                            var heronP3 = (distA + distB + distC) / 2;
                            surface3 = surface3 + Math.sqrt(heronP3 * (heronP3 - distA) * (heronP3 - distB) * (heronP3 - distC));
                        }
                        tabSurface.push(surface3);
                        PolygoIndexToVertexCenter[polyIndex] = centerVertex2;
                    }
                }
                var maxSurf = -1;
                var numSurf = -1;
                if (tabSurface.length != 1) {
                    for (var i_6 = 0; i_6 < tabSurface.length; i_6++) {
                        if (tabSurface[i_6] > maxSurf) {
                            maxSurf = tabSurface[i_6];
                            numSurf = i_6;
                        }
                    }
                }
                var indexSurface = -1;
                for (var _u = 0, tab_polys_2 = tab_polys; _u < tab_polys_2.length; _u++) {
                    var p = tab_polys_2[_u];
                    indexSurface++;
                    if (p.length == 3 && indexSurface != numSurf) {
                        this.mamesh.addATriangle(p[0], p[1], p[2]);
                    }
                    else if (p.length == 4 && indexSurface != numSurf) {
                        this.mamesh.addASquare(p[0], p[1], p[2], p[3]);
                    }
                    else if (p.length >= 5 && indexSurface != numSurf) {
                        var centerVertex2 = PolygoIndexToVertexCenter[indexSurface];
                        centerVertex2.markers.push(mathis.Vertex.Markers.polygonCenter);
                        this.mamesh.vertices.push(centerVertex2);
                        for (var i_7 = 0; i_7 < p.length; i_7++) {
                            this.mamesh.addATriangle(p[i_7], p[(i_7 + 1) % (p.length)], centerVertex2);
                            p[i_7].setOneLink(centerVertex2);
                            centerVertex2.setOneLink(p[i_7]);
                        }
                    }
                }
                return this.mamesh;
            };
            return SurfaceConnectionProcess;
        }());
        surfaceConnection.SurfaceConnectionProcess = SurfaceConnectionProcess;
    })(surfaceConnection = mathis.surfaceConnection || (mathis.surfaceConnection = {}));
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    var symmetries;
    (function (symmetries_2) {
        symmetries_2.squareMainSymmetries = [function (a) { return new mathis.XYZ(1 - a.x, a.y, a.z); }, function (a) { return new mathis.XYZ(a.x, 1 - a.y, a.z); }, function (a) { return new mathis.XYZ(1 - a.x, 1 - a.y, a.z); }];
        var keyWords;
        (function (keyWords) {
            keyWords.verticalAxis = 'symI';
            keyWords.horizontalAxis = 'symJ';
            keyWords.slashAxis = 'symIJ';
            keyWords.rotation = 'rotation';
        })(keyWords = symmetries_2.keyWords || (symmetries_2.keyWords = {}));
        function cartesian(nbI, nbJ, oneMoreVertexForOddLine) {
            if (oneMoreVertexForOddLine === void 0) { oneMoreVertexForOddLine = false; }
            var symmetries = new mathis.StringMap();
            symmetries.putValue(keyWords.verticalAxis, function (v) {
                var hereNbI = nbI;
                if (v.y % 2 == 1 && oneMoreVertexForOddLine)
                    hereNbI++;
                return new mathis.XYZ(hereNbI - 1 - v.x, v.y, v.z);
            });
            symmetries.putValue(keyWords.horizontalAxis, function (v) {
                return new mathis.XYZ(v.x, nbJ - 1 - v.y, v.z);
            });
            symmetries.putValue(keyWords.slashAxis, function (v) {
                var hereNbI = nbI;
                if (v.y % 2 == 1 && oneMoreVertexForOddLine)
                    hereNbI++;
                return new mathis.XYZ(hereNbI - 1 - v.x, nbJ - 1 - v.y, v.z);
            });
            return symmetries;
        }
        symmetries_2.cartesian = cartesian;
        function cartesianAsArray(nbI, nbJ, oneMoreVertexForOddLine) {
            if (oneMoreVertexForOddLine === void 0) { oneMoreVertexForOddLine = false; }
            var symDic = cartesian(nbI, nbJ, oneMoreVertexForOddLine);
            var res = [];
            for (var _i = 0, _a = symDic.allValues(); _i < _a.length; _i++) {
                var sym = _a[_i];
                res.push(sym);
            }
            return res;
        }
        symmetries_2.cartesianAsArray = cartesianAsArray;
        function polygonRotations(nbSides) {
            var symmetries = new mathis.StringMap();
            var _loop_7 = function(t) {
                var angle = Math.PI * 2 / nbSides * t;
                symmetries.putValue(keyWords.rotation + t, function (param) {
                    var res = new mathis.XYZ(0, 0, 0);
                    res.x = param.x * Math.cos(angle) - param.y * Math.sin(angle);
                    res.y = param.x * Math.sin(angle) + param.y * Math.cos(angle);
                    res.z = param.z;
                    return res;
                });
            };
            for (var t = 1; t < nbSides; t++) {
                _loop_7(t);
            }
            return symmetries;
        }
        symmetries_2.polygonRotations = polygonRotations;
        function getAllPolygonalRotations(nbSides) {
            var symMap = polygonRotations(nbSides);
            var res = [];
            for (var _i = 0, _a = symMap.allValues(); _i < _a.length; _i++) {
                var sym = _a[_i];
                res.push(sym);
            }
            return res;
        }
        symmetries_2.getAllPolygonalRotations = getAllPolygonalRotations;
    })(symmetries = mathis.symmetries || (mathis.symmetries = {}));
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    var tab;
    (function (tab) {
        function maxIndex(list) {
            if (list == null || list.length == 0)
                throw 'empty list';
            var maxValue = list[0];
            var maxIndex = 0;
            for (var i = 1; i < list.length; i++) {
                if (list[i] > maxValue) {
                    maxValue = list[i];
                    maxIndex = i;
                }
            }
            return maxIndex;
        }
        tab.maxIndex = maxIndex;
        function maxValue(list) {
            return list[maxIndex(list)];
        }
        tab.maxValue = maxValue;
        function maxValueString(list) {
            return list[maxIndex(list)];
        }
        tab.maxValueString = maxValueString;
        function minIndex(list) {
            if (list == null || list.length == 0)
                throw 'empty list';
            var maxValue = list[0];
            var maxIndex = 0;
            for (var i = 1; i < list.length; i++) {
                if (list[i] < maxValue) {
                    maxValue = list[i];
                    maxIndex = i;
                }
            }
            return maxIndex;
        }
        tab.minIndex = minIndex;
        function minValue(list) {
            return list[minIndex(list)];
        }
        tab.minValue = minValue;
        function minValueString(list) {
            return list[minIndex(list)];
        }
        tab.minValueString = minValueString;
        function minIndexOb(list, comparisonFunction) {
            if (list == null || list.length == 0)
                throw 'empty list';
            var minValue = list[0];
            var minIndex = 0;
            for (var i = 1; i < list.length; i++) {
                if (comparisonFunction(list[i], minValue) < 0) {
                    minValue = list[i];
                    minIndex = i;
                }
            }
            return minIndex;
        }
        tab.minIndexOb = minIndexOb;
        function minValueOb(list, comparisonFunction) {
            return list[minIndexOb(list, comparisonFunction)];
        }
        tab.minValueOb = minValueOb;
        function clearArray(array) {
            while (array.length > 0)
                array.pop();
        }
        tab.clearArray = clearArray;
        function removeFromArray(array, object) {
            var index = array.indexOf(object);
            if (index != -1)
                array.splice(index, 1);
            else {
                cc("l'objet n'est pas dans le tableau", object);
                throw "l'objet précédent n'est pas dans le tableau:";
            }
        }
        tab.removeFromArray = removeFromArray;
        function arrayMinusElements(array, criteriumToSuppress) {
            var res = [];
            for (var _i = 0, array_2 = array; _i < array_2.length; _i++) {
                var elem = array_2[_i];
                if (!criteriumToSuppress(elem))
                    res.push(elem);
            }
            return res;
        }
        tab.arrayMinusElements = arrayMinusElements;
        function arrayKeepingSomeIndices(array, indicesToKeep) {
            var res = [];
            for (var i = 0; i < array.length; i++) {
                if (indicesToKeep.indexOf(i) != -1)
                    res.push(array[i]);
            }
            return res;
        }
        tab.arrayKeepingSomeIndices = arrayKeepingSomeIndices;
        function arrayMinusSomeIndices(array, indicesSuppress) {
            var res = [];
            for (var i = 0; i < array.length; i++) {
                if (indicesSuppress.indexOf(i) == -1)
                    res.push(array[i]);
            }
            return res;
        }
        tab.arrayMinusSomeIndices = arrayMinusSomeIndices;
        function arrayMinusBlocksIndices(list, indicesOfBlocksToRemove, blockSize) {
            var res = [];
            for (var i = 0; i < list.length; i += blockSize) {
                if (indicesOfBlocksToRemove.indexOf(i) == -1) {
                    for (var j = 0; j < blockSize; j++) {
                        res.push(list[i + j]);
                    }
                }
            }
            return res;
        }
        tab.arrayMinusBlocksIndices = arrayMinusBlocksIndices;
        function minIndexOfNumericList(list) {
            var minValue = Number.MAX_VALUE;
            var minIndex = -1;
            for (var i = 0; i < list.length; i++) {
                if (list[i] < minValue) {
                    minValue = list[i];
                    minIndex = i;
                }
            }
            if (minIndex == -1)
                mathis.logger.c('an empty line has no minimum');
            return minIndex;
        }
        tab.minIndexOfNumericList = minIndexOfNumericList;
        function maxIndexOfNumericList(list) {
            var maxValue = Number.NEGATIVE_INFINITY;
            var maxIndex = -1;
            for (var i = 0; i < list.length; i++) {
                if (list[i] > maxValue) {
                    maxValue = list[i];
                    maxIndex = i;
                }
            }
            return maxIndex;
        }
        tab.maxIndexOfNumericList = maxIndexOfNumericList;
        function minIndexOfStringList(list) {
            if (list.length == 0) {
                mathis.logger.c('an empty line has no minimum');
                return -1;
            }
            var minValue = list[0];
            var minIndex = 0;
            for (var i = 0; i < list.length; i++) {
                if (list[i] < minValue) {
                    minValue = list[i];
                    minIndex = i;
                }
            }
            return minIndex;
        }
        tab.minIndexOfStringList = minIndexOfStringList;
        function indicesUpPermutationToString(indices) {
            var minIndex = minIndexOfNumericList(indices);
            var permuted = [];
            for (var i = 0; i < indices.length; i++) {
                permuted[i] = indices[(i + minIndex) % indices.length];
            }
            return JSON.stringify(permuted);
        }
        tab.indicesUpPermutationToString = indicesUpPermutationToString;
        var ArrayMinusBlocksElements = (function () {
            function ArrayMinusBlocksElements(longList, blockSize, listToRemove) {
                this.dicoOfExistingBlocks = {};
                this.removeAlsoCircularPermutation = true;
                this.longList = longList;
                this.blockSize = blockSize;
                if (listToRemove == null) {
                    this.listToRemove = longList;
                    this.removeOnlyDoublon = true;
                }
                else {
                    this.listToRemove = listToRemove;
                    this.removeOnlyDoublon = false;
                }
            }
            ArrayMinusBlocksElements.prototype.go = function () {
                for (var i = 0; i < this.listToRemove.length; i += this.blockSize) {
                    try {
                        var block = [];
                        for (var j = 0; j < this.blockSize; j++)
                            block.push(this.listToRemove[i + j].hashString);
                        this.dicoOfExistingBlocks[this.key(block)] = 1;
                    }
                    catch (e) {
                        throw "a block is not in your list";
                    }
                }
                var newLongList = [];
                for (var i = 0; i < this.longList.length; i += this.blockSize) {
                    var block = [];
                    for (var j = 0; j < this.blockSize; j++)
                        block.push(this.longList[i + j].hashString);
                    if (!this.removeOnlyDoublon) {
                        if (this.dicoOfExistingBlocks[this.key(block)] == null) {
                            for (var j = 0; j < this.blockSize; j++)
                                newLongList.push(this.longList[i + j]);
                        }
                    }
                    else {
                        if (this.dicoOfExistingBlocks[this.key(block)] == 1) {
                            for (var j = 0; j < this.blockSize; j++)
                                newLongList.push(this.longList[i + j]);
                            this.dicoOfExistingBlocks[this.key(block)]++;
                        }
                    }
                }
                return newLongList;
            };
            ArrayMinusBlocksElements.prototype.key = function (list) {
                var rearangedList = [];
                if (!this.removeAlsoCircularPermutation)
                    rearangedList = list;
                else {
                    rearangedList = [];
                    var minIndex_1 = minIndexOfStringList(list);
                    for (var i = 0; i < list.length; i++)
                        rearangedList[i] = list[(i + minIndex_1) % list.length];
                }
                var key = "";
                rearangedList.forEach(function (nu) {
                    key += nu + ',';
                });
                return key;
            };
            return ArrayMinusBlocksElements;
        }());
        tab.ArrayMinusBlocksElements = ArrayMinusBlocksElements;
    })(tab = mathis.tab || (mathis.tab = {}));
})(mathis || (mathis = {}));
var mathis;
(function (mathis) {
    var visu3d;
    (function (visu3d) {
        var VerticesViewer = (function () {
            function VerticesViewer(mameshOrVertices, scene, positionings) {
                this.nbSegments = 32;
                this.meshModel = null;
                this.meshModels = null;
                this.useCloneInsteadOfInstances = false;
                this.checkCollision = false;
                this.color = mathis.color.thema.defaultVertexColor;
                this.constantRadius = null;
                this.radiusProp = 0.1;
                this.vertexToCopiedMeshes = new mathis.HashMap();
                if (mathis.deconnectViewerForTest)
                    return;
                if (mameshOrVertices instanceof mathis.Mamesh)
                    this.vertices = mameshOrVertices.vertices;
                else
                    this.vertices = mameshOrVertices;
                if (scene == null)
                    throw 'scene is null';
                else
                    this.scene = scene;
                this.positionings = positionings;
            }
            VerticesViewer.prototype.checkArgs = function () {
                if (this.vertices == null || this.vertices[0] == null)
                    cc('no vertex to draw');
            };
            VerticesViewer.prototype.go = function () {
                if (mathis.deconnectViewerForTest)
                    return;
                this.checkArgs();
                if (this.meshModel == null && this.meshModels == null) {
                    this.meshModel = BABYLON.Mesh.CreateSphere('', this.nbSegments, 2, this.scene);
                    this.meshModels = [this.meshModel];
                }
                else {
                    if (this.meshModels == null)
                        this.meshModels = [];
                    if (this.meshModel != null)
                        this.meshModels.push(this.meshModel);
                    for (var _i = 0, _a = this.meshModels; _i < _a.length; _i++) {
                        var mesh = _a[_i];
                        mesh.bakeCurrentTransformIntoVertices();
                    }
                }
                for (var _b = 0, _c = this.meshModels; _b < _c.length; _b++) {
                    var mesh = _c[_b];
                    if (mesh.material == null) {
                        var material = new BABYLON.StandardMaterial("", this.scene);
                        material.diffuseColor = this.color.toBABYLON_Color3();
                        mesh.material = material;
                    }
                }
                for (var _d = 0, _e = this.meshModels; _d < _e.length; _d++) {
                    var mesh = _e[_d];
                    mesh.scaling = new mathis.XYZ(0, 0, 0);
                }
                if (this.positionings == null) {
                    this.positionings = new mathis.HashMap();
                    for (var _f = 0, _g = this.vertices; _f < _g.length; _f++) {
                        var v = _g[_f];
                        var radius = void 0;
                        if (this.constantRadius == null) {
                            var minDist = Number.MAX_VALUE;
                            if (v.links.length != 0) {
                                for (var _h = 0, _j = v.links; _h < _j.length; _h++) {
                                    var li = _j[_h];
                                    var d = mathis.geo.distance(v.position, li.to.position);
                                    if (d < minDist)
                                        minDist = d;
                                }
                            }
                            else {
                                for (var _k = 0, _l = this.vertices; _k < _l.length; _k++) {
                                    var other = _l[_k];
                                    if (!other.position.almostEqual(v.position)) {
                                        var d = mathis.geo.distance(v.position, other.position);
                                        if (d < minDist)
                                            minDist = d;
                                    }
                                }
                            }
                            radius = minDist * this.radiusProp;
                        }
                        else
                            radius = this.constantRadius;
                        var pos = new mathis.Positioning();
                        pos.frontDir = new mathis.XYZ(1, 0, 0);
                        pos.upVector = new mathis.XYZ(0, 1, 0);
                        pos.scaling = new mathis.XYZ(radius, radius, radius);
                        this.positionings.putValue(v, pos);
                    }
                }
                this.buildVertexVisu();
            };
            VerticesViewer.prototype.clear = function () {
                var _this = this;
                this.vertices.forEach(function (vertex) {
                    if (_this.vertexToCopiedMeshes.getValue(vertex) != null) {
                        for (var _i = 0, _a = _this.vertexToCopiedMeshes.getValue(vertex); _i < _a.length; _i++) {
                            var mesh = _a[_i];
                            mesh.dispose();
                        }
                    }
                });
            };
            VerticesViewer.prototype.buildVertexVisu = function (verticesToUpdate, verticesToClear) {
                var _this = this;
                if (verticesToUpdate === void 0) { verticesToUpdate = this.vertices; }
                if (verticesToClear === void 0) { verticesToClear = []; }
                verticesToClear.forEach(function (vertex) {
                    if (_this.vertexToCopiedMeshes.getValue(vertex) != null) {
                        for (var _i = 0, _a = _this.vertexToCopiedMeshes.getValue(vertex); _i < _a.length; _i++) {
                            var mesh = _a[_i];
                            mesh.dispose();
                        }
                    }
                    _this.vertexToCopiedMeshes.removeKey(vertex);
                });
                verticesToUpdate.forEach(function (vertex) {
                    var copiedMeshes = [];
                    if (_this.useCloneInsteadOfInstances) {
                        for (var _i = 0, _a = _this.meshModels; _i < _a.length; _i++) {
                            var mesh = _a[_i];
                            copiedMeshes.push(mesh.clone(''));
                        }
                    }
                    else {
                        for (var _b = 0, _c = _this.meshModels; _b < _c.length; _b++) {
                            var mesh = _c[_b];
                            copiedMeshes.push(mesh.createInstance(''));
                        }
                    }
                    for (var _d = 0, copiedMeshes_1 = copiedMeshes; _d < copiedMeshes_1.length; _d++) {
                        var mesh = copiedMeshes_1[_d];
                        mesh.checkCollisions = _this.checkCollision;
                        if (_this.parentNode != null)
                            mesh.parent = _this.parentNode;
                    }
                    if (_this.vertexToCopiedMeshes.getValue(vertex) != null) {
                        for (var _e = 0, _f = _this.vertexToCopiedMeshes.getValue(vertex); _e < _f.length; _e++) {
                            var mesh = _f[_e];
                            mesh.dispose();
                        }
                    }
                    _this.vertexToCopiedMeshes.putValue(vertex, copiedMeshes);
                    _this.updatePositioning(vertex);
                });
            };
            VerticesViewer.prototype.updatePositionings = function (vertice) {
                var _this = this;
                if (vertice === void 0) { vertice = this.vertices; }
                vertice.forEach(function (v) { return _this.updatePositioning(v); });
            };
            VerticesViewer.prototype.updatePositioning = function (vertex) {
                var position = mathis.XYZ.newFrom(vertex.position);
                for (var _i = 0, _a = this.vertexToCopiedMeshes.getValue(vertex); _i < _a.length; _i++) {
                    var mesh = _a[_i];
                    if (this.positionings.getValue(vertex) == null)
                        throw "a vertex without associated positioning";
                    if (Math.abs(this.positionings.getValue(vertex).scaling.x) < mathis.geo.epsilon) {
                        mesh.visibility = 0;
                    }
                    else {
                        mesh.visibility = 1;
                        mesh.rotationQuaternion = this.positionings.getValue(vertex).quaternion();
                        mesh.position = position;
                        mesh.scaling = this.positionings.getValue(vertex).scaling;
                    }
                }
            };
            return VerticesViewer;
        }());
        visu3d.VerticesViewer = VerticesViewer;
        var SurfaceViewer = (function () {
            function SurfaceViewer(mamesh, scene) {
                this.parentNode = null;
                this.sideOrientation = BABYLON.Mesh.DOUBLESIDE;
                this.normalDuplication = NormalDuplication.duplicateOnlyWhenNormalsAreTooFarr;
                this.maxAngleBetweenNormals = Math.PI / 4;
                this.color = mathis.color.thema.defaultSurfaceColor;
                this.alpha = 0.4;
                this.backFaceCulling = true;
                this.mamesh = mamesh;
                this.scene = scene;
            }
            SurfaceViewer.prototype.checkArgs = function () {
                if (this.scene == null)
                    throw 'the scene must but not null';
            };
            SurfaceViewer.prototype.go = function () {
                if (mathis.deconnectViewerForTest)
                    return;
                var positions = [];
                var uvs = [];
                for (var _i = 0, _a = this.mamesh.vertices; _i < _a.length; _i++) {
                    var v = _a[_i];
                    positions.push(v.position.x, v.position.y, v.position.z);
                }
                var hashToIndex = [];
                for (var index = 0; index < this.mamesh.vertices.length; index++)
                    hashToIndex[this.mamesh.vertices[index].hashNumber] = index;
                var indices = [];
                for (var i = 0; i < this.mamesh.smallestTriangles.length; i += 3) {
                    var v0 = this.mamesh.smallestTriangles[i];
                    var v1 = this.mamesh.smallestTriangles[i + 1];
                    var v2 = this.mamesh.smallestTriangles[i + 2];
                    indices.push(hashToIndex[v0.hashNumber], hashToIndex[v1.hashNumber], hashToIndex[v2.hashNumber]);
                }
                for (var i = 0; i < this.mamesh.smallestSquares.length; i += 4) {
                    var v0 = this.mamesh.smallestSquares[i];
                    var v1 = this.mamesh.smallestSquares[i + 1];
                    var v2 = this.mamesh.smallestSquares[i + 2];
                    var v3 = this.mamesh.smallestSquares[i + 3];
                    indices.push(hashToIndex[v0.hashNumber], hashToIndex[v1.hashNumber], hashToIndex[v3.hashNumber]);
                    indices.push(hashToIndex[v1.hashNumber], hashToIndex[v2.hashNumber], hashToIndex[v3.hashNumber]);
                }
                var normalsOfTriangles = this.computeOneNormalPerTriangle(positions, indices);
                var normalsOfVertices = this.computeVertexNormalFromTrianglesNormal(positions, indices, normalsOfTriangles);
                this._ComputeSides(this.sideOrientation, positions, indices, normalsOfVertices, uvs);
                var vertexData = new BABYLON.VertexData();
                vertexData.indices = indices;
                vertexData.positions = positions;
                vertexData.normals = normalsOfVertices;
                vertexData.uvs = uvs;
                var mesh = new BABYLON.Mesh('', this.scene);
                vertexData.applyToMesh(mesh);
                if (this.parentNode != null)
                    mesh.parent = this.parentNode;
                if (this.material == null) {
                    var material = new BABYLON.StandardMaterial('', this.scene);
                    material.diffuseColor = this.color.toBABYLON_Color3();
                    this.material = material;
                    this.material.backFaceCulling = this.backFaceCulling;
                    if (!this.backFaceCulling)
                        mathis.logger.c("backFaceCulling is desactivate on this mamesh.");
                    this.material.sideOrientation = BABYLON.Mesh.BACKSIDE;
                    material.alpha = this.alpha;
                }
                mesh.material = this.material;
                return mesh;
            };
            SurfaceViewer.prototype._ComputeSides = function (sideOrientation, positions, indices, normals, uvs) {
                var li = indices.length;
                var ln = normals.length;
                var i;
                var n;
                sideOrientation = sideOrientation || BABYLON.Mesh.DEFAULTSIDE;
                switch (sideOrientation) {
                    case BABYLON.Mesh.FRONTSIDE:
                        break;
                    case BABYLON.Mesh.BACKSIDE:
                        var tmp;
                        for (i = 0; i < li; i += 3) {
                            tmp = indices[i];
                            indices[i] = indices[i + 2];
                            indices[i + 2] = tmp;
                        }
                        for (n = 0; n < ln; n++) {
                            normals[n] = -normals[n];
                        }
                        break;
                    case BABYLON.Mesh.DOUBLESIDE:
                        var lp = positions.length;
                        var l = lp / 3;
                        for (var p = 0; p < lp; p++) {
                            positions[lp + p] = positions[p];
                        }
                        for (i = 0; i < li; i += 3) {
                            indices[i + li] = indices[i + 2] + l;
                            indices[i + 1 + li] = indices[i + 1] + l;
                            indices[i + 2 + li] = indices[i] + l;
                        }
                        for (n = 0; n < ln; n++) {
                            normals[ln + n] = -normals[n];
                        }
                        var lu = uvs.length;
                        for (var u = 0; u < lu; u++) {
                            uvs[u + lu] = uvs[u];
                        }
                        break;
                }
            };
            SurfaceViewer.prototype.computeOneNormalPerTriangle = function (positions, indices) {
                var res = [];
                var p1p2x = 0.0;
                var p1p2y = 0.0;
                var p1p2z = 0.0;
                var p3p2x = 0.0;
                var p3p2y = 0.0;
                var p3p2z = 0.0;
                var faceNormalx = 0.0;
                var faceNormaly = 0.0;
                var faceNormalz = 0.0;
                var length = 0.0;
                var i1 = 0;
                var i2 = 0;
                var i3 = 0;
                var nbFaces = indices.length / 3;
                for (var index = 0; index < nbFaces; index++) {
                    i1 = indices[index * 3];
                    i2 = indices[index * 3 + 1];
                    i3 = indices[index * 3 + 2];
                    p1p2x = positions[i1 * 3] - positions[i2 * 3];
                    p1p2y = positions[i1 * 3 + 1] - positions[i2 * 3 + 1];
                    p1p2z = positions[i1 * 3 + 2] - positions[i2 * 3 + 2];
                    p3p2x = positions[i3 * 3] - positions[i2 * 3];
                    p3p2y = positions[i3 * 3 + 1] - positions[i2 * 3 + 1];
                    p3p2z = positions[i3 * 3 + 2] - positions[i2 * 3 + 2];
                    faceNormalx = p1p2y * p3p2z - p1p2z * p3p2y;
                    faceNormaly = p1p2z * p3p2x - p1p2x * p3p2z;
                    faceNormalz = p1p2x * p3p2y - p1p2y * p3p2x;
                    length = Math.sqrt(faceNormalx * faceNormalx + faceNormaly * faceNormaly + faceNormalz * faceNormalz);
                    length = (length === 0) ? 1.0 : length;
                    faceNormalx /= length;
                    faceNormaly /= length;
                    faceNormalz /= length;
                    res[index] = new mathis.XYZ(faceNormalx, faceNormaly, faceNormalz);
                }
                return res;
            };
            SurfaceViewer.prototype.computeVertexNormalFromTrianglesNormal = function (positions, indices, triangleNormals) {
                var _this = this;
                var positionNormals = [];
                for (var k = 0; k < positions.length / 3; k++)
                    positionNormals[k] = new mathis.XYZ(0, 0, 0);
                if (this.normalDuplication == NormalDuplication.none) {
                    for (var k = 0; k < indices.length; k += 3) {
                        var triangleIndex = Math.floor(k / 3);
                        positionNormals[indices[k]].add(triangleNormals[triangleIndex]);
                        positionNormals[indices[k + 1]].add(triangleNormals[triangleIndex]);
                        positionNormals[indices[k + 2]].add(triangleNormals[triangleIndex]);
                    }
                    positionNormals.forEach(function (v) {
                        v.normalize();
                    });
                }
                else if (this.normalDuplication == NormalDuplication.duplicateVertex || this.normalDuplication == NormalDuplication.duplicateOnlyWhenNormalsAreTooFarr) {
                    var oneStep = function (vertexNormal, triangleNormal, posX, posY, posZ, indexInIndices) {
                        if (_this.normalDuplication == NormalDuplication.duplicateOnlyWhenNormalsAreTooFarr) {
                            if (mathis.geo.xyzAlmostZero(vertexNormal) || mathis.geo.xyzAlmostZero(triangleNormal) || mathis.geo.angleBetweenTwoVectorsBetween0andPi(vertexNormal, triangleNormal) < _this.maxAngleBetweenNormals) {
                                vertexNormal.add(triangleNormal);
                            }
                            else {
                                var newIndex = positions.length / 3;
                                positions.push(posX, posY, posZ);
                                indices[indexInIndices] = newIndex;
                                positionNormals.push(triangleNormal);
                            }
                        }
                        else {
                            var newIndex = positions.length / 3;
                            positions.push(posX, posY, posZ);
                            indices[indexInIndices] = newIndex;
                            positionNormals.push(triangleNormal);
                        }
                    };
                    for (var k = 0; k < indices.length; k += 3) {
                        var triangleIndex = Math.floor(k / 3);
                        var positionIndex = indices[k];
                        oneStep(positionNormals[positionIndex], triangleNormals[triangleIndex], positions[3 * positionIndex], positions[3 * positionIndex + 1], positions[3 * positionIndex + 2], k);
                        positionIndex = indices[k + 1];
                        oneStep(positionNormals[positionIndex], triangleNormals[triangleIndex], positions[3 * positionIndex], positions[3 * positionIndex + 1], positions[3 * positionIndex + 2], k + 1);
                        positionIndex = indices[k + 2];
                        oneStep(positionNormals[positionIndex], triangleNormals[triangleIndex], positions[3 * positionIndex], positions[3 * positionIndex + 1], positions[3 * positionIndex + 2], k + 2);
                    }
                }
                else
                    throw 'wtf';
                var res = [];
                positionNormals.forEach(function (v) {
                    res.push(v.x, v.y, v.z);
                });
                return res;
            };
            return SurfaceViewer;
        }());
        visu3d.SurfaceViewer = SurfaceViewer;
        (function (NormalDuplication) {
            NormalDuplication[NormalDuplication["none"] = 0] = "none";
            NormalDuplication[NormalDuplication["duplicateOnlyWhenNormalsAreTooFarr"] = 1] = "duplicateOnlyWhenNormalsAreTooFarr";
            NormalDuplication[NormalDuplication["duplicateVertex"] = 2] = "duplicateVertex";
        })(visu3d.NormalDuplication || (visu3d.NormalDuplication = {}));
        var NormalDuplication = visu3d.NormalDuplication;
        var LinksViewer = (function () {
            function LinksViewer(mamesh, scene) {
                this.lateralScalingConstant = null;
                this.lateralScalingProp = 0.05;
                this.tesselation = 12;
                this.material = null;
                this.color = mathis.color.thema.defaultLinkColor;
                this.res = [];
                this.pairVertexToLateralDirection = null;
                this.segmentOrientationFunction = null;
                this.clonesInsteadOfInstances = false;
                this.checkCollision = true;
                this.barycenter = null;
                this.middle = new mathis.XYZ(0, 0, 0);
                this.mamesh = mamesh;
                this.scene = scene;
            }
            LinksViewer.prototype.checkArgs = function () {
                if (this.scene == null)
                    throw 'scene is null';
                if (this.mamesh.vertices.length == 0)
                    cc('your IN_mamesh has no vertex');
            };
            LinksViewer.prototype.go = function () {
                if (mathis.deconnectViewerForTest)
                    return;
                this.checkArgs();
                if (this.meshModel == null) {
                    if (this.material == null) {
                        this.material = new BABYLON.StandardMaterial('', this.scene);
                        this.material.diffuseColor = this.color.toBABYLON_Color3();
                    }
                    this.meshModel = BABYLON.Mesh.CreateCylinder('', 1, 1, 1, this.tesselation, 5, this.scene);
                    this.meshModel.material = this.material;
                }
                this.meshModel.scaling = new mathis.XYZ(0, 0, 0);
                if (this.lateralScalingConstant == null) {
                    var distance = 0;
                    var nbVerticesWithLinks = 0;
                    for (var _i = 0, _a = this.mamesh.vertices; _i < _a.length; _i++) {
                        var v = _a[_i];
                        if (v.links.length != 0) {
                            var minDist = Number.MAX_VALUE;
                            for (var _b = 0, _c = v.links; _b < _c.length; _b++) {
                                var li = _c[_b];
                                var d = mathis.geo.distance(v.position, li.to.position);
                                if (d < minDist)
                                    minDist = d;
                            }
                            distance += minDist;
                            nbVerticesWithLinks++;
                        }
                    }
                    distance /= nbVerticesWithLinks;
                    this.lateralScalingConstant = distance * this.lateralScalingProp;
                }
                var alreadyDraw = new mathis.StringMap();
                for (var _d = 0, _e = this.mamesh.vertices; _d < _e.length; _d++) {
                    var vertex = _e[_d];
                    for (var _f = 0, _g = vertex.links; _f < _g.length; _f++) {
                        var link = _g[_f];
                        var key = mathis.tab.indicesUpPermutationToString([vertex.hashNumber, link.to.hashNumber]);
                        if (alreadyDraw.getValue(key) == null) {
                            this.drawOneLink(vertex, link.to);
                            alreadyDraw.putValue(key, true);
                        }
                    }
                }
                return this.res;
            };
            LinksViewer.prototype.drawOneLink = function (beginVertex, endVertex) {
                if (this.segmentOrientationFunction != null) {
                    if (this.segmentOrientationFunction(beginVertex, endVertex) == 0)
                        return;
                    if (this.segmentOrientationFunction(beginVertex, endVertex) < 0) {
                        var temp = beginVertex;
                        beginVertex = endVertex;
                        endVertex = temp;
                    }
                }
                var segment;
                if (this.clonesInsteadOfInstances)
                    segment = this.meshModel.clone('');
                else
                    segment = this.meshModel.createInstance('');
                segment.checkCollisions = this.checkCollision;
                var elongateAMeshFromBeginToEnd = new ElongateAMeshFromBeginToEnd(beginVertex.position, endVertex.position, segment);
                elongateAMeshFromBeginToEnd.lateralScaling = this.lateralScalingConstant;
                if (this.pairVertexToLateralDirection != null) {
                    elongateAMeshFromBeginToEnd.lateralDirection = this.pairVertexToLateralDirection(beginVertex, endVertex);
                }
                else {
                    if (this.barycenter == null) {
                        this.barycenter = new mathis.XYZ(0, 0, 0);
                        for (var _i = 0, _a = this.mamesh.vertices; _i < _a.length; _i++) {
                            var v = _a[_i];
                            this.barycenter.add(v.position);
                        }
                        this.barycenter.scale(1 / this.mamesh.vertices.length);
                    }
                    this.middle.copyFrom(beginVertex.position).add(endVertex.position).scale(0.5);
                    this.middle.substract(this.barycenter);
                    elongateAMeshFromBeginToEnd.lateralDirection.copyFrom(this.middle);
                }
                elongateAMeshFromBeginToEnd.goChanging();
                if (this.parentNode != null)
                    segment.parent = this.parentNode;
                this.res.push(segment);
            };
            return LinksViewer;
        }());
        visu3d.LinksViewer = LinksViewer;
        var LinesViewer = (function () {
            function LinesViewer(mameshOrLines, scene) {
                this.vertices = null;
                this.doNotDrawLinesContainingOnlyInvisibleVertices = true;
                this.color = null;
                this.lineToColor = null;
                this.lineToLevel = null;
                this.levelPropToColorFunc = function (prop) { return new mathis.Color(new mathis.HSV_01(prop * 0.7, 1, 0.8)); };
                this.cap = BABYLON.Mesh.NO_CAP;
                this.tesselation = 10;
                this.interpolationOption = new mathis.geometry.InterpolationOption();
                this.isThin = false;
                this.constantRadius = null;
                this.radiusProp = 0.05;
                this.radiusFunction = null;
                this.res = [];
                if (mameshOrLines instanceof mathis.Mamesh) {
                    var mamesh = mameshOrLines;
                    if (!mamesh.linesWasMade)
                        mamesh.fillLineCatalogue();
                    this.lines = mamesh.lines;
                }
                else {
                    this.lines = mameshOrLines;
                }
                this.scene = scene;
            }
            LinesViewer.prototype.go = function () {
                this.buildLineToColor();
                if (mathis.deconnectViewerForTest)
                    return;
                if (this.scene == null)
                    throw 'scene is null';
                for (var _i = 0, _a = this.lines; _i < _a.length; _i++) {
                    var line = _a[_i];
                    if (this.lineToColor.getValue(line) != null)
                        this.drawOneLine(line);
                }
                return this.res;
            };
            LinesViewer.prototype.clear = function () {
                for (var _i = 0, _a = this.res; _i < _a.length; _i++) {
                    var mesh = _a[_i];
                    mesh.dispose();
                }
            };
            LinesViewer.prototype.buildLineToColor = function () {
                if (this.color != null) {
                    this.lineToColor = new mathis.HashMap();
                    for (var _i = 0, _a = this.lines; _i < _a.length; _i++) {
                        var line = _a[_i];
                        this.lineToColor.putValue(line, this.color);
                    }
                    return;
                }
                if (this.lineToColor != null)
                    return;
                if (this.lineToLevel == null) {
                    this.lineToLevel = new mathis.HashMap();
                    for (var i = 0; i < this.lines.length; i++)
                        this.lineToLevel.putValue(this.lines[i], i);
                }
                var max = mathis.tab.maxValue(this.lineToLevel.allValues());
                var min = mathis.tab.minValue(this.lineToLevel.allValues());
                this.lineToColor = new mathis.HashMap();
                for (var _b = 0, _c = this.lines; _b < _c.length; _b++) {
                    var line = _c[_b];
                    var value = this.lineToLevel.getValue(line);
                    if (value != null) {
                        var prop = (value - min) / (max - min);
                        this.lineToColor.putValue(line, this.levelPropToColorFunc(prop));
                    }
                    else
                        this.lineToColor.putValue(line, null);
                }
            };
            LinesViewer.prototype.drawOneLine = function (line) {
                var path = [];
                var onlyInvisible = true;
                line.vertices.forEach(function (v) {
                    path.push(v.position);
                    if (!v.isInvisible)
                        onlyInvisible = false;
                });
                if (onlyInvisible && this.doNotDrawLinesContainingOnlyInvisibleVertices)
                    return;
                var mesh = this.drawOnePath(line, path);
                this.res.push(mesh);
            };
            LinesViewer.prototype.drawOnePath = function (line, path) {
                var _this = this;
                var res;
                var smoothPath;
                if (this.interpolationOption != null && this.interpolationOption.interpolationStyle != mathis.geometry.InterpolationStyle.none) {
                    var lineInterpoler = new mathis.geometry.LineInterpoler(path);
                    lineInterpoler.options = this.interpolationOption;
                    if (line.isLoop)
                        lineInterpoler.options.loopLine = true;
                    smoothPath = lineInterpoler.go();
                }
                else {
                    smoothPath = path;
                    if (line.isLoop)
                        smoothPath.push(path[0]);
                }
                path = smoothPath;
                var color = this.lineToColor.getValue(line).toBABYLON_Color3();
                if (this.isThin) {
                    var aa = BABYLON.Mesh.CreateLines('', path, this.scene);
                    aa.color = color;
                    res = aa;
                }
                else {
                    var modifiedFunction = null;
                    if (this.radiusFunction != null) {
                        var pathTotalLength_1 = 0;
                        for (var i = 0; i < path.length - 1; i++) {
                            pathTotalLength_1 += mathis.geo.distance(path[i], path[i + 1]);
                        }
                        modifiedFunction = function (ind, alphaProp) { return _this.radiusFunction(ind, alphaProp / pathTotalLength_1); };
                        res = BABYLON.Mesh.CreateTube('', path, null, this.tesselation, modifiedFunction, this.cap, this.scene, true, BABYLON.Mesh.FRONTSIDE);
                    }
                    else {
                        if (this.constantRadius == null) {
                            var totalLength = 0;
                            var nbVertices = 0;
                            for (var _i = 0, _a = this.lines; _i < _a.length; _i++) {
                                var line_3 = _a[_i];
                                for (var i = 0; i < line_3.vertices.length - 1; i++) {
                                    totalLength += mathis.geo.distance(line_3.vertices[i].position, line_3.vertices[i + 1].position);
                                    nbVertices++;
                                }
                            }
                            this.constantRadius = totalLength / nbVertices * this.radiusProp;
                        }
                        res = BABYLON.Mesh.CreateTube('', path, this.constantRadius, this.tesselation, null, this.cap, this.scene, true, BABYLON.Mesh.FRONTSIDE);
                    }
                }
                var material = new BABYLON.StandardMaterial('', this.scene);
                material.diffuseColor = color;
                res.material = material;
                if (this.parentNode != null)
                    res.parent = this.parentNode;
                return res;
            };
            return LinesViewer;
        }());
        visu3d.LinesViewer = LinesViewer;
        var ElongateAMeshFromBeginToEnd = (function () {
            function ElongateAMeshFromBeginToEnd(begin, end, originalMesh) {
                this.lateralScaling = 0.05;
                this.lateralDirection = new mathis.XYZ(0, 0, 1);
                this.yAxis = new mathis.XYZ(0, 1, 0);
                this.zAxis = new mathis.XYZ(0, 0, 1);
                this.direction = new mathis.XYZ(0, 0, 0);
                this.nothing = new mathis.XYZ(0, 0, 0);
                this.begin = begin;
                this.end = end;
                this.modelMesh = originalMesh;
            }
            ElongateAMeshFromBeginToEnd.prototype.goChanging = function () {
                this.direction.copyFrom(this.end).substract(this.begin);
                var length = this.direction.length();
                this.direction.normalize();
                var middle = new mathis.XYZ(0, 0, 0);
                middle.add(this.begin).add(this.end).scale(0.5);
                this.modelMesh.scaling = new mathis.XYZ(this.lateralScaling, length, this.lateralScaling);
                this.modelMesh.position = middle;
                var anOrtho = new mathis.XYZ(0, 0, 0);
                var copyOfLateralDirection = new mathis.XYZ(0, 0, 0);
                mathis.geo.cross(this.direction, this.lateralDirection, this.nothing);
                if (this.nothing.lengthSquared() < mathis.geo.epsilon)
                    copyOfLateralDirection.copyFromFloats(Math.random(), Math.random(), Math.random());
                else
                    copyOfLateralDirection.copyFrom(this.lateralDirection);
                mathis.geo.orthonormalizeKeepingFirstDirection(this.direction, copyOfLateralDirection, this.nothing, anOrtho);
                var quat = new mathis.XYZW(0, 0, 0, 0);
                mathis.geo.aQuaternionMovingABtoCD(this.yAxis, this.zAxis, this.direction, anOrtho, quat, true);
                this.modelMesh.rotationQuaternion = quat;
                return this.modelMesh;
            };
            return ElongateAMeshFromBeginToEnd;
        }());
        visu3d.ElongateAMeshFromBeginToEnd = ElongateAMeshFromBeginToEnd;
    })(visu3d = mathis.visu3d || (mathis.visu3d = {}));
})(mathis || (mathis = {}));
var cc;
var showDevMessages = true;
if (showDevMessages) {
    cc = console.log.bind(window.console);
}
else
    cc = function () { };
var mathis;
(function (mathis) {
    mathis.geo = new mathis.Geo();
    mathis.logger = new mathis.Logger();
    mathis.deconnectViewerForTest = false;
})(mathis || (mathis = {}));
//# sourceMappingURL=MATHIS.js.map