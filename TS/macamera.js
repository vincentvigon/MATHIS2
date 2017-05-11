var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by vigon on 06/11/2015.
 */
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
                /**un vecteur égal à {@link myNullVector} est considéré comme null
                 * cependant, on n' aura pas besoin d' un new pour le réaffecter*/
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
                /**TRANSLATION MOVEMENT*/
                this._collider = new Collider();
                this.correctionToRecenter = new mathis.XYZ(0, 0, 0);
                this._deltaPosition = new mathis.XYZ(0, 0, 0);
                this._popo = new mathis.XYZ(0, 0, 0);
                /** #############################################
                 *  POINTER
                 * ##############################################*/
                this._babylonRay = new BABYLON.Ray(new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(0, 0, 1));
                this.pointerIsOnCurrentGrabber = false;
                this._tempCN = new mathis.XYZ(0, 0, 0);
                this._end = new mathis.XYZ(0, 0, 0);
                this.pointerIsDown = false;
                this._lookForTheBestGrabber = true;
                this._target = mathis.XYZ.newZero();
                this.viewMM = new mathis.MM();
                // private projectionMM = new MM()
                //
                // /**Ici on a sauté l'étape _getProjectionMatrix et _isSynchronizedProjectionMatrix */
                // public getProjectionMatrix():MM {
                //    
                //     if (this._isSynchronized() ) return this.projectionMM
                //    
                //     var engine = this.getEngine();
                //     if (this.minZ <= 0) {
                //         this.minZ = 0.1;
                //     }
                //     geo.PerspectiveFovLH(this.fov, engine.getAspectRatio(this), this.minZ, this.maxZ, this.projectionMM);
                //     return this.projectionMM;
                //
                //     //var halfWidth = engine.getRenderWidth() / 2.0;
                //     //var halfHeight = engine.getRenderHeight() / 2.0;
                //     //Matrix.OrthoOffCenterLHToRef(this.orthoLeft || -halfWidth, this.orthoRight || halfWidth, this.orthoBottom || -halfHeight, this.orthoTop || halfHeight, this.minZ, this.maxZ, this._projectionMatrix);
                //     //return this._projectionMatrix;
                // }
                /** ############################################
                                KEYBOARD
                 ############################################### */
                this._keys = [];
                this.keysUp = [38];
                this.keysDown = [40];
                this.keysLeft = [37];
                this.keysRight = [39];
                this.keysFrontward = []; //[66, 78];
                this.keysBackward = []; //[32];
                this._axeForKeyRotation = new mathis.XYZ(0, 0, 0);
                this._additionnalVec = new mathis.XYZ(0, 0, 0);
                /** #################################################
                                CONTROLS BINDING
                ##################################################*/
                this.wheelPrecision = 1.0;
                this.eventPrefix = Tools.GetPointerPrefix();
                this.scene = mathisFrame.scene;
                /**pour indiquer que les old vectors ne sont pas attribués (sans pour autant les nullifier, pour éviter des affectations)*/
                mathis.geo.copyXYZ(this.myNullVector, this.cursorPositionOnGrabberOld);
                mathis.geo.copyXYZ(this.myNullVector, this.oldCamDir);
                //if (this.viewport != null) this.camera.viewport = this.viewport
                //this.whishedCamPos.copyFrom(this.trueCamPos)
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
                //if (checkForChangingCurrentGrabber) this.chooseCurrentGrabberAccordingToDistance()
            };
            GrabberCamera.prototype.replaceTheFirstGrabber = function (grabber) {
                if (this.grabbers[0] != null)
                    this.grabbers[0].dispose();
                grabber.checkArgs();
                grabber.grabberCamera = this;
                this.grabbers[0] = grabber;
                this.currentGrabber = this.grabbers[0];
            };
            /** #############################################
             * ROTATION MOVEMENTS
             #################################################### */
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
                //this.whishedCamPos.position.copyFrom(this.camRelativePos).add(center)
                this.camRelativePos.add(center);
                this.whishedCamPos.changePosition(this.camRelativePos);
            };
            GrabberCamera.prototype.twoRotations = function (axeOfRotationAroundCam, angleBetweenRays, axeOfRotationAroundZero, angleOfRotationAroundZero, alpha) {
                this.rotate(axeOfRotationAroundCam, angleBetweenRays * (1 - alpha));
                this.rotateAroundCenter(axeOfRotationAroundZero, angleOfRotationAroundZero * alpha, this.currentGrabber.referenceCenter);
            };
            /**fired wy wheeling or by keys*/
            GrabberCamera.prototype.translateCam = function (delta) {
                var impultion = delta * this.translationSpeed;
                /** amout <0 when we goChanging backward. when we goChanging backward, we align our vision to zero.*/
                if (delta < 0 && this.currentGrabber.focusOnMyCenterWhenCameraGoDownWard && this.currentGrabber.referenceCenter != null) {
                    var alpha = Math.min(1, mathis.geo.distance(this.whishedCamPos.getPosition(), this.currentGrabber.referenceCenter) / this.currentGrabber.endOfZone3);
                    /**modification of alpha. The re-axis must be sufficiently slow */
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
                    //if(this.checkCollisions) this._collideWithWorld(this._deltaPosition)
                    //else {
                    /**attention : sans utiliser l'intermédiatre popo, cela crée un bug incompréhensible*/
                    mathis.geo.add(this.whishedCamPos.getPosition(), this._deltaPosition, this._popo);
                    this.whishedCamPos.changePosition(this._popo);
                    //}
                    if (this.onTranslate != null)
                        this.onTranslate();
                }
            };
            GrabberCamera.prototype.onPointerMove = function (actualPointerX, actualPointerY) {
                if (!this.pointerIsDown)
                    return;
                /**a priori on va faire les rotation, sauf si ... (cf plus loin)*/
                var grabberRotationOK = true;
                var freeRotationOK = true;
                /**if the actual current grabber has lost the pointer, we look for an other.
                 *  But if not other, the currentGrabber stay (ex : we we goChanging down, we center on it)*/
                /**le picking ray est relatif à un objet donné; ici : this.currentGrabber.mesh  */
                this.createPickingRayWithFrozenCamera(actualPointerX, actualPointerY, this.currentGrabber.mesh.getWorldMatrix(), this.frozonViewMatrix, this.frozonProjectionMatrix, this.pickingRay);
                mathis.geo.copyXYZ(this.pickingRay.direction, this.camDir);
                //
                //
                // this.createPickingRayWithFrozenCamera(actualPointerX, actualPointerY,
                //     <MM> this.currentGrabber.mesh.getWorldMatrix(),
                //     this.frozonViewMatrix,
                //     this.frozonProjectionMatrix,
                //     this.pickingRay)
                // let worldMatrix=<MM>this.currentGrabber.mesh.getWorldMatrix()
                // //geo.inverse(worldMatrix,worldMatrix)
                // geo.multiplicationMatrixVector(worldMatrix,this.pickingRay.direction,this.pickingRay.direction)
                // geo.multiplicationMatrixVector(worldMatrix,this.pickingRay.origin,this.pickingRay.origin)
                /**Be carefull: pickInfo.hit is true also when we are inside the grabber*/
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
                /**
                 * Cette méthode était sympa (pas de boucle pour trouver le point d'intersection avec le grabber). Malheureusement, cela ne marche pas quand le grabber n'est pas centré en zéro
                 *
                 let radius=(<SphericalGrabber> this.currentGrabber).radius
                 this.pointerIsOnCurrentGrabber = geo.intersectionBetweenRayAndSphereFromRef(this.pickingRay.origin, this.pickingRay.direction,radius,this.currentGrabber.referenceCenter,this.candidate1,this.candidate2 )
                 distToGrabbed=geo.closerOf(this.candidate1,this.candidate2,this.whishedCamPos.position,this.relativeCursorPositionOnGrabber)
                 *
                 * */
                var alpha = this.currentGrabber.interpolationCoefAccordingToCamPosition(this.trueCamPos.position, distToGrabbed);
                if (this.showPredefinedConsoleLog)
                    console.log('alpha', alpha);
                //console.log('alpha', alpha)
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
                /**un pensement ici pour une erreur non compris : quand on est proche de la sphére, l'angle de la rotation autour de zéro prend parfois de très grand valeur*/
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
                /**on  affecte les nouvelles positions si l' on vient d' effectuer une rotation
                 * Attention, il ne faut pas affecter de nouvelle valeur à chaque fois, sinon les angles ne dépassent jamais les seuils critiques*/
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
            /**copié sur {@link BABYLON.Scene.createPickingRay}  */
            GrabberCamera.prototype.createPickingRayWithFrozenCamera = function (x, y, world, frozenViewMatrix, frozonProjectionMatrix, result) {
                var engine = this.getEngine();
                var cameraViewport = this.viewport;
                // var viewport = cameraViewport.toGlobal(engine);
                var viewport = cameraViewport.toGlobal(engine.getRenderWidth(), engine.getRenderHeight());
                // Moving coordinates to local viewport world
                x = x / engine.getHardwareScalingLevel() - viewport.x;
                y = y / engine.getHardwareScalingLevel() - (engine.getRenderHeight() - viewport.y - viewport.height);
                this.createNewRay(x, y, viewport.width, viewport.height, world, frozenViewMatrix, frozonProjectionMatrix, result);
            };
            GrabberCamera.prototype.createNewRay = function (x, y, viewportWidth, viewportHeight, world, view, projection, result) {
                mathis.geo.unproject(mathis.geo.copyXyzFromFloat(x, y, 0, this._tempCN), viewportWidth, viewportHeight, world, view, projection, result.origin);
                mathis.geo.unproject(mathis.geo.copyXyzFromFloat(x, y, 1, this._tempCN), viewportWidth, viewportHeight, world, view, projection, this._end);
                //var start = BABYLON.Vector3.Unproject(new BABYLON.Vector3(x, y, 0), viewportWidth, viewportHeight, world, view, projection);
                //var end = BABYLON.Vector3.Unproject(new BABYLON.Vector3(x, y, 1), viewportWidth, viewportHeight, world, view, projection);
                mathis.geo.substract(this._end, result.origin, result.direction);
                mathis.geo.normalize(result.direction, result.direction);
            };
            GrabberCamera.prototype.onPointerDown = function (actualPointerX, actualPointerY) {
                this.pointerIsDown = true;
                /**on glace ces matrices pour éviter les instabilités*/
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
                    /**true also we we are inside the grabber*/
                    this._babylonRay.direction = this.pickingRay.direction;
                    this._babylonRay.origin = this.pickingRay.origin;
                    /**fast checking*/
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
            /** called when we detach control  */
            GrabberCamera.prototype.reset = function () {
                this._keys = [];
                //TODO what else ?
            };
            GrabberCamera.prototype.toogleIconCursor = function (style) {
                if (this.cursorActualStyle != style) {
                    this.$canvasElement.className = style;
                    //this.$canvasElement.className += "cursorGrabbing";
                    this.cursorActualStyle = style;
                }
            };
            /** #################################################
                 VIEW MATRIX, PROJECTION MATRIX, UPDATE, CASH
            ##################################################*/
            // /**méthode de Node. Est appelée par isSynchronized qui appelle aussi les méthodes _isSynchronized des parents */
            // private computedOnce=false
            // _isSynchronized(){
            //     if (!this.computedOnce) {
            //         this.computedOnce=true
            //         return false
            //     }
            //     return this.trueCamPos.almostEqual(this.whishedCamPos)
            // }
            /**Attention, dans Camera, ils font l'inverse : ils crée 2 méthodes _isSynchronizedProjectionMatrix et _isSynchronizedViewMatrix
             * et _isSynchronized renvoit true quand les 2 précédentes renvoient true */
            GrabberCamera.prototype._isSynchronizedViewMatrix = function () {
                if (!_super.prototype._isSynchronizedViewMatrix.call(this)) {
                    return false;
                }
                return this.trueCamPos.almostEqual(this.whishedCamPos);
                //return this.isSynchronized()
            };
            /**Est appelée par Camera.getViewMatrix uniquement lorsque _isSynchronizedViewMatrix renvoit faux
             * Le lien entre Camera.getViewMatrix et Camera.getViewMatrix._getViewMatrix est bizarrement compliqué.
             * */
            GrabberCamera.prototype._getViewMatrix = function () {
                mathis.geo.copyXYZ(this.trueCamPos.position, this._target);
                mathis.geo.add(this._target, this.trueCamPos.frontDir, this._target);
                mathis.geo.LookAtLH(this.trueCamPos.position, this._target, this.trueCamPos.upVector, this.viewMM);
                return this.viewMM;
            };
            // // Cache
            //  _initCache() {
            //     super._initCache();
            // }
            //
            //
            //  _updateCache(ignoreParentClass?:boolean):void {
            //
            //     if (!ignoreParentClass) {
            //         /**ici sont mis en cache, notamment upVector et position */
            //         super._updateCache();
            //     }
            // }
            /**lancé à chaque frame */
            GrabberCamera.prototype.update = function () {
                this.checkForKeyPushed();
                /**cela fait le lissage*/
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
                        //if (!noPreventDefault) {
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
                /**it was already appears that the axis was too small : */
                if (mathis.geo.squareNorme(this._axeForKeyRotation) < mathis.geo.epsilon)
                    return;
                var angle = -0.02;
                /**when key pushed, we always use free mode*/
                this.rotate(this._axeForKeyRotation, angle);
            };
            //private _viewMatrix = new BABYLON.Matrix()
            // public _getViewMatrix():Matrix {
            //     //geo.MMtoBabylonMatrix(this.cameraPilot.getViewMatrix(),this._viewMatrix)
            //     //return this._viewMatrix;
            //     return this.cameraPilot.getViewMatrix()
            // }
            GrabberCamera.prototype.deltaNotToBigFunction = function (delta) {
                if (delta > 0.1)
                    return 0.1;
                if (delta < -0.1)
                    return -0.1;
                return delta;
            };
            // Methods
            GrabberCamera.prototype.attachControl = function (element, noPreventDefault) {
                var _this = this;
                var pointerId; //=null//Math.random();
                if (this._attachedElement) {
                    return;
                }
                this._attachedElement = element;
                //if (this._onPointerDown === undefined) {
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
                //this._onMouseMove = evt => {
                //    if (!engine.isPointerLock) {
                //        return;
                //    }
                //
                //    var offsetX = evt.movementX || evt.mozMovementX || evt.webkitMovementX || evt.msMovementX || 0;
                //    var offsetY = evt.movementY || evt.mozMovementY || evt.webkitMovementY || evt.msMovementY || 0;
                //
                //    this.inertialAlphaOffset -= offsetX / this.angularSensibility;
                //    this.inertialBetaOffset -= offsetY / this.angularSensibility;
                //
                //    if (!noPreventDefault) {
                //        evt.preventDefault();
                //    }
                //};
                this._wheel = function (event) {
                    var delta = 0;
                    if (event.wheelDelta) {
                        delta = _this.deltaNotToBigFunction(event.wheelDelta / (_this.wheelPrecision * 300));
                    }
                    else if (event.detail) {
                        delta = _this.deltaNotToBigFunction(-event.detail / (_this.wheelPrecision * 30));
                    }
                    /**MATHIS*/
                    if (delta)
                        _this.translateCam(delta);
                    if (event.preventDefault) {
                        if (!noPreventDefault) {
                            event.preventDefault();
                        }
                    }
                };
                this._onKeyDown = function (evt) {
                    /**MATHIS*/
                    _this.onKeyDown(evt);
                };
                this._onKeyUp = function (evt) {
                    /**MATHIS*/
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
                    //TODO this.radius *= e.scale;
                    //
                    //
                    //if (e.preventDefault) {
                    //    if (!noPreventDefault) {
                    //        e.stopPropagation();
                    //        e.preventDefault();
                    //    }
                    //}
                };
                this._reset = function () {
                    /**MATHIS*/
                    _this.reset();
                    pointerId = null;
                };
                //}
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
            /**TODO problème ici si l'on prend une wished positionning très loin de la cam positionning*/
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
                // if(this.grabberPilot.onPositioningChange!=null) {
                //     this.positioningCopy.copyFrom(this)
                //     this.grabberPilot.onPositioningChange(this.positioningCopy)
                // }
            };
            CamPositioning.prototype.changeFrontDir = function (vector) {
                mathis.geo.orthonormalizeKeepingFirstDirection(vector, this.upVector, this.frontDir, this.upVector);
                // if(this.grabberPilot.onPositioningChange!=null) {
                //     this.positioningCopy.copyFrom(this)
                //     this.grabberPilot.onPositioningChange(this.positioningCopy)
                // }
            };
            CamPositioning.prototype.changeUpVector = function (vector) {
                mathis.geo.orthonormalizeKeepingFirstDirection(this.upVector, vector, this.upVector, this.frontDir);
                // if(this.grabberPilot.onPositioningChange!=null) {
                //     this.positioningCopy.copyFrom(this)
                //     this.grabberPilot.onPositioningChange(this.positioningCopy)
                // }
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
                // changeFrontDir(vector:XYZ):void {
                //     geo.orthonormalizeKeepingFirstDirection(vector, this.upVector, this.frontDir, this.upVector)
                //
                // }
                // changeUpVector(vector:XYZ):void {
                //     geo.orthonormalizeKeepingFirstDirection( this.upVector,vector , this.upVector,this.frontDir)
                // }
                //
                // changePositioning(positioning:Positioning){
                //     this.position.copyFrom(positioning.position)
                //     this.upVector.copyFrom(positioning.upVector)
                //     this.frontDir.copyFrom(positioning.frontDir)
                // }
                /**COLLISION*/
                this._collider = new Collider();
                this.ellipsoid = new mathis.XYZ(1, 1, 1);
                this._oldPosition = new mathis.XYZ(0, 0, 0);
                //private getScene():BABYLON.Scene{return this.grabberPilot.camera.getScene()}
                this._diffPosition = new mathis.XYZ(0, 0, 0);
                this._newPosition = new mathis.XYZ(0, 0, 0);
                this._inter = new mathis.XYZ(0, 0, 0);
                this._upPerturbation = new mathis.XYZ(0, 0, 0);
                this._onCollisionPositionChange = function (collisionId, newPosition, collidedMesh) {
                    //if (this.getScene().workerCollisions) newPosition.multiplyInPlace(this._collider.radius);
                    if (collidedMesh === void 0) { collidedMesh = null; }
                    _this._newPosition.copyFrom(newPosition);
                    _this._newPosition.subtractToRef(_this._oldPosition, _this._diffPosition).scale(2);
                    //this._position.copyFrom(this._newPosition)
                    if (collidedMesh != null) {
                        console.log('collision');
                        _this._upPerturbation.copyFrom(_this.upVector).scale(0.005);
                        _this.position.add(_this._diffPosition).add(_this._upPerturbation);
                    }
                    else
                        _this.position.copyFrom(_this._oldPosition);
                    // if (this._diffPosition.length() > BABYLON.Engine.CollisionsEpsilon) {
                    //
                    //     this._position.add(this._diffPosition)
                    //     //this._inter.copyFrom(this.getPosition()).add(this._diffPosition)
                    //     //this.whishedCamPos.changePosition(this._inter,this.currentConstraints)
                    // }
                    // var updatePosition = (newPos) => {
                    // }
                    //
                    // updatePosition(newPosition);
                };
            }
            WishedPositioning.prototype.getPosition = function () {
                return this.position;
            };
            WishedPositioning.prototype.changePosition = function (newPosition) {
                // if (positionConstraint==null) {
                //     this._positionBeforCollision=newPosition
                //
                // }
                // else if (positionConstraint.positionConstraint0==null && positionConstraint.positionConstraint1==null){
                //     this._positionBeforCollision=newPosition
                // }
                // else if (positionConstraint.positionConstraint0!=null && positionConstraint.positionConstraint1==null){
                //     geo.orthogonalProjectionOnLine(positionConstraint.positionConstraint0,this._projMat)
                //     geo.multiplicationMatrixVector(this._projMat,newPosition,this._positionBeforCollision)
                //
                // }
                // else if (positionConstraint.positionConstraint0!=null && positionConstraint.positionConstraint1!=null){
                //     geo.orthogonalProjectionOnPlane(positionConstraint.positionConstraint0,positionConstraint.positionConstraint1,this._projMat)
                //     geo.multiplicationMatrixVector(this._projMat,newPosition,this._positionBeforCollision)
                //
                // }
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
                //if (this.grabberPilot.onPositioningChange!=null) this.grabberPilot.onPositioningChange(this,this.grabberPilot.currentGrabber)
            };
            WishedPositioning.prototype._collideWithWorld = function (velocity, candidatePos) {
                // var globalPosition=this.getPosition()
                // /** in babylon Free Camera, they decal the impact point by ellipsoid.y, but this is not very natural */
                // globalPosition.subtractFromFloatsToRef(0, 0, 0, this._oldPosition);
                this._collider.radius = this.ellipsoid;
                this._oldPosition.copyFrom(candidatePos);
                //this.grabberPilot.camera.getScene().collisionCoordinator.getNewPosition(this._oldPosition, velocity, this._collider, 3, null, this._onCollisionPositionChange, -13);
                this.camera.scene.collisionCoordinator.getNewPosition(this._oldPosition, velocity, this._collider, 3, null, this._onCollisionPositionChange, -13);
            };
            return WishedPositioning;
        }(mathis.Positioning));
        macamera.WishedPositioning = WishedPositioning;
        var Grabber = (function () {
            function Grabber(scene) {
                this.parallelDisplacementInsteadOfRotation = false;
                this.showGrabberOnlyWhenGrabbing = true;
                /**can stay null e.g. for plane grabber
                 * but if null no grabber rotation is possible, and no "recentring while goChanging back" */
                this.referenceCenter = null;
                //rotationAxis:XYZ=null
                this.onGrabbingActions = new mathis.StringMap();
                //radius = 1
                /**inside zone1: free displacement
                 * outside zone2: grabbing
                 * in zone2 minus zone1: interpolation between the two rotation
                 * outside zone3: the camera is detached from the grabber
                 * this distance are absolute. But in sphericalGrabber they are fixed proportionnaly to the radius of the grabber*/
                this.endOfZone1 = 1;
                this.endOfZone2 = 3;
                this.endOfZone3 = 10;
                this.zoneAreDefinedFromCenterRatherFromSurface = true;
                /**will produce no effect if no {@link Grabber.referenceCenter} is given*/
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
            /** return
             * 0 is we are too close of the wrapper, so we use freeMovement
             * 1 if wee are far, so we use pure wrapping mode
             * between 0 and 1 we can use mixed mode (or not depending to a boolean)
             * */
            Grabber.prototype.interpolationCoefAccordingToCamPosition = function (camPosition, distCamToGrabber) {
                //let l = geo.distance(this.rotationCenter, cameraPosition)
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
                //material.sideOrientation=BABYLON.Mesh.DOUBLESIDE
                this.mesh.material = this.material;
                this.mesh.isPickable = isPickable;
            }
            return PlanarGrabber;
        }(Grabber));
        macamera.PlanarGrabber = PlanarGrabber;
    })(macamera = mathis.macamera || (mathis.macamera = {}));
})(mathis || (mathis = {}));
