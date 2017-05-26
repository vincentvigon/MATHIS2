/**
 * Created by vigon on 05/05/2016.
 */
var mathis;
(function (mathis) {
    var Color3 = BABYLON.Color3;
    var gauss;
    (function (gauss) {
        var StandardMaterial = BABYLON.StandardMaterial;
        function start() {
            var mainDiv = document.getElementById("mainDiv");
            //let canvass = mathis.nCanvasInOneLine(2, mainDiv)
            var frame = new mathis.MathisFrame("surfaceMathisFrame", false);
            var frame2 = new mathis.MathisFrame("sphereMathisFrame", false);
            var buttonPlace = mathis.legend('30px', mainDiv, false);
            new GaussCurvature(frame, frame2, buttonPlace);
        }
        gauss.start = start;
        var DrawNormalAndTangentVector = (function () {
            function DrawNormalAndTangentVector(
                //IN_mamesh:Mamesh,
                cartes, scene, sphereScene, cam, surface) {
                this.sizes = new mathis.XYZ(1, 1, 1);
                // findAndDraw(point:XYZ):void{
                //     let clickedVertex=this.findClosestVertex(point,this.vertices)
                //     let u=clickedVertex.mathUV.x
                //     let v=clickedVertex.mathUV.y
                //     this.draw(u,v)
                // }
                this.arrowColor = new Color3(1, 0, 0);
                this.planeColor = new Color3(0, 0, 1);
                this.planeRadius = 0.2;
                this.tangentDiameter = 0.1;
                //this.IN_mamesh=IN_mamesh
                this.cartes = cartes;
                this.surfaceScene = scene;
                this.cam = cam;
                this.sphereScene = sphereScene;
                this.surface = surface;
            }
            // findClosestVertex(point:XYZ):Vertex{
            //     let res:Vertex=null
            //     let minDist=Number.MAX_VALUE
            //
            //     this.IN_mamesh.vertices.forEach(v=>{
            //         let dist=geo.distance(v.position,point)
            //         if (dist<minDist) {
            //             minDist=dist
            //             res=v
            //         }
            //     })
            //     return  res
            // }
            // findUvAndCarte(xyz:XYZ):{uv:UV;carte:Carte}{
            //
            //
            //     let maxDistToBorder=0
            //     let chosenCarte:Carte=null
            //     let chosenUV:UV=null
            //
            //     this.cartes.forEach(carte=>{
            //         let uvAndDist= carte.xyzToUV(xyz)
            //         chosenCarte=carte
            //         chosenUV=uvAndDist.uv
            //         /** we chose the carte for which the point is the most central (the further from the border)*/
            //         if (uvAndDist.distToBorder>maxDistToBorder) {
            //             maxDistToBorder=uvAndDist.distToBorder
            //             chosenCarte=carte
            //             chosenUV=uvAndDist.uv
            //         }
            //
            //     })
            //
            //     return {uv:chosenUV,carte:chosenCarte}
            // }
            // findUV(point:XYZ,vertices:Vertex[]):XYZ{
            //     let res:Vertex=null
            //     let minDist=Number.MAX_VALUE
            //
            //     vertices.forEach(v=>{
            //         let dist=geo.distance(v.position,point)
            //         if (dist<minDist) {
            //             minDist=dist
            //             res=v
            //         }
            //     })
            //     return  {u:res.}
            // }
            DrawNormalAndTangentVector.prototype.checkOrientation = function (u, v, carte) {
                var pointToCam = mathis.XYZ.newFrom(this.cam.trueCamPos.position).substract(carte.X(u, v));
                if (mathis.geo.dot(pointToCam, carte.newN(u, v)) < 0)
                    carte.orientationCoef *= -1;
            };
            DrawNormalAndTangentVector.prototype.oneArrowOnOneScene = function (point, quaternion, scene, sizes) {
                var creatorArrowMesh = new mathis.creation3D.ArrowCreator(scene);
                //creatorArrowMesh.headUp=this.naturalOrientationComesToCam
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
                //arrowCrea.bodyDiameterProp=
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
                /**camera are create here*/
                this.createGaussSphereScene(sphereMathisFrame);
                this.createSurfaceScene(surfaceMathisFrame);
                this.createSurface(mathis.riemann.SurfaceName.torus);
                this.drawNormalVector = new DrawNormalAndTangentVector(this.surface.cartes, this.surfaceScene, this.sphereScene, this.surfaceCamera, this.meshSurf);
                this.drawNormalVector.sizes = new mathis.XYZ(0.1, 0.1, 0.1);
                this.resetInitialClick();
                this.addControlButton();
                /**couplage des deux caméras
                 * attention, cette évenement n'est pas lancé quand on force le positionnement par les méthodes grabberCaera.changeXXX */
                //var setTimeDone=false
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
                    /**when we move the surface by grabbing, the point_of_vue select would be put to "free"*/
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
                    /**choix de la surface*/
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
                            //this.$carteToDisplay.selectedIndex=0
                            _this.createSurface(_this.$surfaceName.selectedIndex);
                            //this.readdControlToDislayCarte()
                            //TODO utile ???
                            _this.drawNormalVector = new DrawNormalAndTangentVector(_this.surface.cartes, _this.surfaceScene, _this.sphereScene, _this.surfaceCamera, _this.meshSurf);
                            _this.drawNormalVector.sizes = new mathis.XYZ(0.1, 0.1, 0.1);
                        };
                    }
                    /**point de vue*/
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
                    /**mode*/
                    {
                        var array = ["gauss map", "difference", "différence normalisé"]; //TODO ,"différentielle"
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
                    /**espace tangent*/
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
                    /**whole surface or one carte*/
                    //this.readdControlToDislayCarte()
                    /**bouton clear*/
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
                        //this.$courbure.textContent="TOTO"
                        /**because we start with torus*/
                        _this.$surfaceName.selectedIndex = mathis.riemann.SurfaceName.torus;
                    }
                };
            };
            // private readdControlToDislayCarte():void{
            //     if(this.$carteToDisplay!=null) this.$carteToDisplay.remove()
            //     this.$carteToDisplay = document.createElement("select");
            //     this.localButtonPlace.appendChild(this.$carteToDisplay);
            //
            //     for (let i = 0; i <= this.surface.cartes.length; i++) {
            //         let option:HTMLOptionElement = document.createElement("option");
            //         option.value = (i==0)?"toute la surface":"carte n "+i
            //         option.text = option.value
            //         this.$carteToDisplay.appendChild(option);
            //     }
            //
            //     this.$carteToDisplay.onchange = ()=> {
            //         this.clearAll()
            //         if( this.$carteToDisplay.selectedIndex==0) this.surface.drawTheWholeSurface(this.surfaceMathisFrameScene)//this.drawMesh(this.carteForTheWholeSurface.arrivalMesh)
            //         else this.surface.drawOneCarte(this.$carteToDisplay.selectedIndex-1,this.surfaceMathisFrameScene)//this.drawMesh(this.surface.cartes[this.$carteToDisplay.selectedIndex-1].arrivalMesh)
            //     }
            // }
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
                var uvAndCarte = this.surface.findBestCarte(clickedPoint); //this.drawNormalVector.findUvAndCarte(clickedPoint)
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
                        var secondUvAndCarte = _this.surface.findBestCarte(secondClicked); //this.drawNormalVector.findUvAndCarte(secondClicked)
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
            // gaussMapDerivativeClick=(clickedPoint:XYZ)=>{
            //     let clickedVertex=this.drawNormalVector.findClosestVertex(clickedPoint)
            //     let UV=clickedVertex.mathUV
            //
            //     this.drawNormalVector.arrowColor=new Color3(0,1,0)
            //     this.drawNormalVector.drawNormalVectors(UV.x,UV.y)
            //
            //     this.drawNormalVector.planeRadius=0.2
            //     this.drawNormalVector.drawTangentPlanes(UV.x,UV.y,true)
            // }
            GaussCurvature.prototype.secondClick = function (UVcenter, UVclicked, carte) {
                var _this = this;
                var initialLength = mathis.geo.distance(carte.X(UVcenter.u, UVcenter.v), carte.X(UVclicked.u, UVclicked.v));
                var initialLengthOnSphere = mathis.geo.distance(carte.newN(UVcenter.u, UVcenter.v), carte.newN(UVclicked.u, UVclicked.v));
                var alphas = [];
                var pas = 0.01;
                var alpha = 0;
                /**pour lses différences normalisée, on se rapproche plus du vecteur initial, pour que l'on voit mieux la tangence*/
                var alphaMax = (this.mode == 1) ? 0.8 : 0.95;
                while (alpha < alphaMax) {
                    alphas.push(alpha);
                    alpha += pas;
                }
                var count = 0;
                var pointCenter = carte.X(UVcenter.u, UVcenter.v);
                // let length=geo.distance(pointCenter,coor.X(UVclicked.x,UVclicked.y))
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
                    /**un peu idiot de créer autant de fléche : 2 que l'on deplacerait suffirait*/
                    var arrivalOnSurface;
                    var arrivalOnSphere;
                    if (_this.normalize) {
                        var differenceOnSurface = carte.X(UVinter.u, UVinter.v).substract(pointCenter);
                        /** the user can click twice on the same point, so  subtraction can be zero-vector */
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
                    /**to dispose all the last*/
                    _this.meshesToDispose.push(currentDifference.initial);
                    _this.meshesToDispose.push(currentDifference.onSphere);
                    //currentDifference.onSphere=drawOneDifference(sphereFrame.scene,)
                });
                action.nbTimesThisActionMustBeFired = alphas.length + 1;
                action.timeIntervalMilli = 3000 / alphas.length;
                //this.arrowsToDispose.push(currentNormal.initial)
                //this.arrowsToDispose.push(currentNormal.onSphere)
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
                //let camPos=new XYZ(-2,-2,-2)
                //let camPos=new XYZ(0,0,-1.5)
                cam.showPredefinedConsoleLog = false;
                cam.useFreeModeWhenCursorOutOfGrabber = false;
                // cam.changePosition(camPos)
                // cam.changeFrontDir(XYZ.newFrom(camPos).scale(-1))
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
                //surf.vertexDuplication=visu3d.SurfaceVisuStatic.VertexDuplication.none
                //surf.sideOrientation=BABYLON.Mesh.BACKSIDE
                this.meshSurf = surf.go();
                this.resetInitialClick();
                // let mat=new BABYLON.StandardMaterial('',this.surfaceMathisFrameScene)
                // mat.diffuseColor=new Color3(0,1,1)
                // mat.backFaceCulling=true
                // mat.sideOrientation=BABYLON.Mesh.BACKSIDE
                // this.meshSurf.material=mat
            };
            return GaussCurvature;
        }());
    })(gauss = mathis.gauss || (mathis.gauss = {}));
})(mathis || (mathis = {}));
