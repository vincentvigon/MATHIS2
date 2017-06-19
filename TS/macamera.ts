/**
 * Created by vigon on 06/11/2015.
 */
module mathis {



    export module macamera {

        import Vector3 = BABYLON.Vector3;
        import Matrix = BABYLON.Matrix;
        import Tools = BABYLON.Tools;
        import Scene = BABYLON.Scene;
        import Collider = BABYLON.Collider;

        declare var window;



        export class GrabberCamera extends BABYLON.Camera{


            translationSpeed=1

            checkCollisions=false


            showPredefinedConsoleLog = false

            currentGrabber:Grabber
            grabbers:Grabber[] = []


            useOnlyFreeMode = false
            useFreeModeWhenCursorOutOfGrabber = true


            onGrabberChange:(oldGrabber:Grabber,newGrabber:Grabber)=>void =null
            onTranslate:()=>void=null
            onPositioningChange:(positioning:Positioning)=>void
            /**ex: when this function return oldPosition, this simply cancel all changement of position*/
            positionChangesBiaiser:(oldPosition:XYZ,newPosition:XYZ,currentGrabber:Grabber)=>XYZ


            private tooSmallAngle = 0.001
            private tooBigAngle = 0.3
            private cumulatedAngle = 0

            private relativeCursorPositionOnGrabber = new XYZ(0, 0, 0)
            private cursorPositionOnGrabberOld = new XYZ(0, 0, 0)
            private angleOfRotationAroundGrabber = 0
            private axeOfRotationAroundGrabber = new XYZ(0, 0, 0)

            private camDir = new XYZ(0, 0, 0)
            private oldCamDir = new XYZ(0, 0, 0)

            private angleForCamRot = 0
            private axisForCamRot = new XYZ(0, 0, 0)


            /**un vecteur égal à {@link myNullVector} est considéré comme null
             * cependant, on n' aura pas besoin d' un new pour le réaffecter*/
            private myNullVector = new XYZ(123, 234, 345)

            private frozonProjectionMatrix = new MM()
            private frozonViewMatrix = new MM()

            private pickingRay = {origin: new XYZ(0, 0, 0), direction: new XYZ(0, 0, 0)}


            private aPartOfTheFrontDir = new XYZ(0, 0, 0)


            public whishedCamPos = new WishedPositioning(this)
            public trueCamPos = new CamPositioning(this)

            scene:Scene


            private $canvasElement

            
            changePosition(position:XYZ,smoothMovement=true):void{
                this.whishedCamPos.changePosition(position)
                if (!smoothMovement){
                    this.trueCamPos.position=position
                }
            }
            changeFrontDir(position:XYZ,smoothMovement=true):void{
                this.whishedCamPos.changeFrontDir(position)
                if (!smoothMovement){
                    this.trueCamPos.changeFrontDir(position)
                }

            }
            changeUpVector(position:XYZ,smoothMovement=true):void{
                this.whishedCamPos.changeUpVector(position)
                if (!smoothMovement){
                    this.trueCamPos.changeUpVector(position)
                }
            }


            setFreeDisplacementMode(){
                this.currentGrabber.mesh.visibility=0
                this.useOnlyFreeMode=true
                this.currentGrabber.focusOnMyCenterWhenCameraGoDownWard=false
            }



            constructor(mathisFrame:MathisFrame,grabber:Grabber) {

                super(name, new BABYLON.Vector3(0, 0, -10), mathisFrame.scene);

                this.scene = mathisFrame.scene


                /**pour indiquer que les old vectors ne sont pas attribués (sans pour autant les nullifier, pour éviter des affectations)*/
                geo.copyXYZ(this.myNullVector, this.cursorPositionOnGrabberOld)
                geo.copyXYZ(this.myNullVector, this.oldCamDir)
                //if (this.viewport != null) this.camera.viewport = this.viewport
                //this.whishedCamPos.copyFrom(this.trueCamPos)

                this.$canvasElement = mathisFrame.canvas
                this.toogleIconCursor('cursorDefault')

                this.replaceTheFirstGrabber(grabber)

                this.attachControl(mathisFrame.canvas)

            }


            addGrabber(grabber:Grabber):void{
                grabber.checkArgs()
                this.grabbers.push(grabber)
                //if (checkForChangingCurrentGrabber) this.chooseCurrentGrabberAccordingToDistance()
            }

            replaceTheFirstGrabber(grabber:Grabber):void{
                if(this.grabbers[0]!=null) this.grabbers[0].dispose()
                grabber.checkArgs()
                grabber.grabberCamera=this
                this.grabbers[0]=grabber
                this.currentGrabber=this.grabbers[0]
            }







            /** #############################################
             * ROTATION MOVEMENTS
             #################################################### */



            private freeRotation():void {
                if (this.showPredefinedConsoleLog) console.log('free rotation angle', this.angleForCamRot.toFixed(4))
                this.rotate(this.axisForCamRot, this.angleForCamRot)
                this.toogleIconCursor("cursorMove")
            }

            private _paralDisplacement = new XYZ(0, 0, 0)
            private grabberMovement():void {

                if (this.currentGrabber.parallelDisplacementInsteadOfRotation) {
                    this._paralDisplacement.copyFrom(this.relativeCursorPositionOnGrabber).substract(this.cursorPositionOnGrabberOld).scale(-1)
                    this._paralDisplacement.add(this.whishedCamPos.getPosition())
                    this.whishedCamPos.changePosition(this._paralDisplacement)
                }
                else{
                    if (this.showPredefinedConsoleLog) console.log('grabber rotation angle', this.angleOfRotationAroundGrabber.toFixed(4))
                    this.rotateAroundCenter(this.axeOfRotationAroundGrabber, this.angleOfRotationAroundGrabber, this.currentGrabber.referenceCenter)
                }
                this.toogleIconCursor("cursorGrabbing")
                if (this.currentGrabber.showGrabberOnlyWhenGrabbing) this.currentGrabber.mesh.visibility=1

            }

            private mixedRotation(alpha):void {
                if (this.showPredefinedConsoleLog) console.log('free rotation angle', this.angleForCamRot.toFixed(4), 'grabber rotation angle', this.angleOfRotationAroundGrabber.toFixed(4))
                this.twoRotations(this.axisForCamRot, this.angleForCamRot, this.axeOfRotationAroundGrabber, this.angleOfRotationAroundGrabber, alpha)
                this.toogleIconCursor("cursorGrabbing")
                if (this.currentGrabber.showGrabberOnlyWhenGrabbing) this.currentGrabber.mesh.visibility=1

            }

            private _matrixRotationAroundCam = new MM()
            private rotate(axis:XYZ, angle:number):void {
                geo.axisAngleToMatrix(axis, angle, this._matrixRotationAroundCam)
                geo.multiplicationMatrixVector(this._matrixRotationAroundCam, this.whishedCamPos.frontDir, this.whishedCamPos.frontDir)
                geo.multiplicationMatrixVector(this._matrixRotationAroundCam, this.whishedCamPos.upVector, this.whishedCamPos.upVector)
            }

            private _matrixRotationAroundZero = new MM()
            private camRelativePos = new XYZ(0, 0, 0)
            private rotateAroundCenter(axis:XYZ, angle:number, center:XYZ):void {
                if (this.currentGrabber.referenceCenter==null) return
                geo.axisAngleToMatrix(axis, angle, this._matrixRotationAroundZero)
                geo.multiplicationMatrixVector(this._matrixRotationAroundZero, this.whishedCamPos.frontDir, this.whishedCamPos.frontDir)
                geo.multiplicationMatrixVector(this._matrixRotationAroundZero, this.whishedCamPos.upVector, this.whishedCamPos.upVector)
                this.camRelativePos.copyFrom(this.whishedCamPos.getPosition()).substract(center)
                geo.multiplicationMatrixVector(this._matrixRotationAroundZero, this.camRelativePos, this.camRelativePos)
                //this.whishedCamPos.position.copyFrom(this.camRelativePos).add(center)
                this.camRelativePos.add(center)
                this.whishedCamPos.changePosition(this.camRelativePos)


            }

            private twoRotations(axeOfRotationAroundCam:XYZ, angleBetweenRays:number, axeOfRotationAroundZero:XYZ, angleOfRotationAroundZero:number, alpha:number) {
                this.rotate(axeOfRotationAroundCam, angleBetweenRays * (1 - alpha))
                this.rotateAroundCenter(axeOfRotationAroundZero, angleOfRotationAroundZero * alpha, this.currentGrabber.referenceCenter)
            }


            /**TRANSLATION MOVEMENT*/
            private _collider=new Collider()
            private correctionToRecenter = new XYZ(0, 0, 0)
            private _deltaPosition = new XYZ(0, 0, 0)
            private _popo=new XYZ(0,0,0)
            /**fired wy wheeling or by keys*/
            translateCam(delta:number):void {


                let impultion = delta*this.translationSpeed;

                /** amout <0 when we goChanging backward. when we goChanging backward, we align our vision to zero.*/
                if (delta < 0 && this.currentGrabber.focusOnMyCenterWhenCameraGoDownWard&&this.currentGrabber.referenceCenter!=null) {
                    var alpha:number = Math.min(1,geo.distance(this.whishedCamPos.getPosition(),this.currentGrabber.referenceCenter)/this.currentGrabber.endOfZone3 )

                    /**modification of alpha. The re-axis must be sufficiently slow */
                    alpha = alpha * alpha * 0.1

                    geo.scale(this.whishedCamPos.frontDir, 1 - alpha, this.aPartOfTheFrontDir)

                    geo.substract(this.currentGrabber.referenceCenter, this.whishedCamPos.getPosition(), this.correctionToRecenter)
                    if (this.correctionToRecenter.lengthSquared() > geo.epsilon) {
                        geo.normalize(this.correctionToRecenter, this.correctionToRecenter)
                        geo.scale(this.correctionToRecenter, alpha, this.correctionToRecenter)
                        geo.add(this.correctionToRecenter, this.aPartOfTheFrontDir, this.aPartOfTheFrontDir)

                    }

                    this.whishedCamPos.changeFrontDir(this.aPartOfTheFrontDir)
                }

                if (impultion != 0) {
                    geo.scale(this.whishedCamPos.frontDir, impultion, this._deltaPosition)

                    //if(this.checkCollisions) this._collideWithWorld(this._deltaPosition)
                    //else {
                        /**attention : sans utiliser l'intermédiatre popo, cela crée un bug incompréhensible*/
                        geo.add(this.whishedCamPos.getPosition(),this._deltaPosition,this._popo)
                        this.whishedCamPos.changePosition(this._popo)

                    //}

                    if(this.onTranslate!=null) this.onTranslate()

                    ///** inertialCoef is 0, but there is still inertia when wheeling. I think it is the default inertial of device-wheel*/
                    // impultion *= this.intertialCoef
                    // if (Math.abs(impultion) < BABYLON.Engine.Epsilon)
                    //     impultion = 0;
                }

            }




            /** #############################################
             *  POINTER
             * ##############################################*/


            private _babylonRay:BABYLON.Ray = new BABYLON.Ray(new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(0, 0, 1))
            private pointerIsOnCurrentGrabber = false
            onPointerMove(actualPointerX:number, actualPointerY:number):void {



                if (!this.pointerIsDown) return

                /**a priori on va faire les rotation, sauf si ... (cf plus loin)*/
                var grabberRotationOK = true
                var freeRotationOK = true


                /**if the actual current grabber has lost the pointer, we look for an other.
                 *  But if not other, the currentGrabber stay (ex : we we goChanging down, we center on it)*/

                




                /**le picking ray est relatif à un objet donné; ici : this.currentGrabber.mesh  */
                this.createPickingRayWithFrozenCamera(actualPointerX, actualPointerY,
                    <MM> this.currentGrabber.mesh.getWorldMatrix(),
                    this.frozonViewMatrix,
                    this.frozonProjectionMatrix,
                    this.pickingRay)
                geo.copyXYZ(this.pickingRay.direction, this.camDir)


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
                    this._babylonRay.direction = this.pickingRay.direction
                    this._babylonRay.origin = this.pickingRay.origin
                    let pickInfo = this.currentGrabber.mesh.intersects(this._babylonRay, false)
                    this.pointerIsOnCurrentGrabber = pickInfo.hit
                    let distToGrabbed = pickInfo.distance
                    if (this.pointerIsOnCurrentGrabber) {
                        this.relativeCursorPositionOnGrabber.x = pickInfo.pickedPoint.x
                        this.relativeCursorPositionOnGrabber.y = pickInfo.pickedPoint.y
                        this.relativeCursorPositionOnGrabber.z = pickInfo.pickedPoint.z
                    }
                
                
                    if(this.currentGrabber.referenceCenter!=null) this.relativeCursorPositionOnGrabber.substract(this.currentGrabber.referenceCenter)




                /**
                 * Cette méthode était sympa (pas de boucle pour trouver le point d'intersection avec le grabber). Malheureusement, cela ne marche pas quand le grabber n'est pas centré en zéro
                 *
                 let radius=(<SphericalGrabber> this.currentGrabber).radius
                 this.pointerIsOnCurrentGrabber = geo.intersectionBetweenRayAndSphereFromRef(this.pickingRay.origin, this.pickingRay.direction,radius,this.currentGrabber.referenceCenter,this.candidate1,this.candidate2 )
                 distToGrabbed=geo.closerOf(this.candidate1,this.candidate2,this.whishedCamPos.position,this.relativeCursorPositionOnGrabber)
                 *
                 * */


                let alpha = this.currentGrabber.interpolationCoefAccordingToCamPosition(this.trueCamPos.position,distToGrabbed)
                if (this.showPredefinedConsoleLog) console.log('alpha', alpha)

                //console.log('alpha', alpha)




                if (geo.xyzEquality(this.oldCamDir, this.myNullVector)) {
                    geo.copyXYZ(this.camDir, this.oldCamDir)
                    freeRotationOK = false
                }


                if (geo.xyzEquality(this.cursorPositionOnGrabberOld, this.myNullVector)) {
                    if (this.pointerIsOnCurrentGrabber) {
                        geo.copyXYZ(this.relativeCursorPositionOnGrabber, this.cursorPositionOnGrabberOld)
                    }
                    grabberRotationOK = false
                }
                else if (!this.pointerIsOnCurrentGrabber) {
                    geo.copyXYZ(this.myNullVector, this.cursorPositionOnGrabberOld)
                    grabberRotationOK = false
                }


                if (freeRotationOK) {
                    this.angleForCamRot = geo.angleBetweenTwoVectorsBetween0andPi(this.camDir, this.oldCamDir)
                    if (this.angleForCamRot > this.tooSmallAngle) {
                        geo.cross(this.camDir, this.oldCamDir, this.axisForCamRot)
                        geo.normalize(this.axisForCamRot, this.axisForCamRot)
                    }
                    else freeRotationOK = false
                }



                if (grabberRotationOK) {
                    this.angleOfRotationAroundGrabber = geo.angleBetweenTwoVectorsBetween0andPi(this.relativeCursorPositionOnGrabber, this.cursorPositionOnGrabberOld);
                    if (this.angleOfRotationAroundGrabber > this.tooSmallAngle) {
                        geo.cross(this.relativeCursorPositionOnGrabber, this.cursorPositionOnGrabberOld, this.axeOfRotationAroundGrabber)
                        this.axeOfRotationAroundGrabber.normalize()
                    }
                    else grabberRotationOK = false
                }

                /**un pensement ici pour une erreur non compris : quand on est proche de la sphére, l'angle de la rotation autour de zéro prend parfois de très grand valeur*/
                if (grabberRotationOK && this.angleOfRotationAroundGrabber > this.tooBigAngle) {
                    console.log('a too big angle around zero : ignored' + this.angleOfRotationAroundGrabber.toFixed(4))
                    geo.copyXYZ(this.relativeCursorPositionOnGrabber, this.cursorPositionOnGrabberOld)
                    return
                }




                if (this.useOnlyFreeMode && freeRotationOK) this.freeRotation()
                else if (this.pointerIsOnCurrentGrabber) {
                    if (alpha == 0) {
                        if (freeRotationOK) this.freeRotation()
                    }
                    /** camera position is close to grabber */
                    else if (alpha < 1 && alpha > 0) {
                        if ( freeRotationOK && grabberRotationOK) {
                            this.mixedRotation(alpha)
                        }
                        else if (grabberRotationOK) this.grabberMovement()
                    }
                    /** camera is far from graber*/
                    else if (alpha == 1 && grabberRotationOK) this.grabberMovement()
                }
                else if (this.useFreeModeWhenCursorOutOfGrabber && freeRotationOK) this.freeRotation()


                /**on  affecte les nouvelles positions si l' on vient d' effectuer une rotation
                 * Attention, il ne faut pas affecter de nouvelle valeur à chaque fois, sinon les angles ne dépassent jamais les seuils critiques*/
                if (grabberRotationOK) geo.copyXYZ(this.relativeCursorPositionOnGrabber, this.cursorPositionOnGrabberOld)
                if (freeRotationOK)  geo.copyXYZ(this.camDir, this.oldCamDir)


                if (grabberRotationOK) this.cumulatedAngle += this.angleOfRotationAroundGrabber
                if (freeRotationOK) this.cumulatedAngle += this.angleForCamRot
    
                if (this.cumulatedAngle > Math.PI / 12) {
                    geo.copyMat(<MM> this.getProjectionMatrix(), this.frozonProjectionMatrix)
                    geo.copyMat(<MM> this.getViewMatrix(), this.frozonViewMatrix)
                    this.cumulatedAngle = 0
                    geo.copyXYZ(this.myNullVector, this.oldCamDir)
                    geo.copyXYZ(this.myNullVector, this.cursorPositionOnGrabberOld)
                    if (this.showPredefinedConsoleLog) console.log('nouvelles matrices enregistrées')
                }



            }


            /**copié sur {@link BABYLON.Scene.createPickingRay}  */
            private  createPickingRayWithFrozenCamera(x:number, y:number, world:MM, frozenViewMatrix:MM, frozonProjectionMatrix:MM, result:{origin:XYZ;direction:XYZ}):void {
                var engine = this.getEngine();
                var cameraViewport = this.viewport;
                // var viewport = cameraViewport.toGlobal(engine);
                var viewport = cameraViewport.toGlobal(engine.getRenderWidth(),engine.getRenderHeight())

                // Moving coordinates to local viewport world
                x = x / engine.getHardwareScalingLevel() - viewport.x;
                y = y / engine.getHardwareScalingLevel() - (engine.getRenderHeight() - viewport.y - viewport.height);

                this.createNewRay(x, y, viewport.width, viewport.height, world, frozenViewMatrix, frozonProjectionMatrix, result)
            }

            private _tempCN = new XYZ(0, 0, 0)
            private _end = new XYZ(0, 0, 0)
            private createNewRay(x:number, y:number, viewportWidth:number, viewportHeight:number, world:MM, view:MM, projection:MM, result:{origin:XYZ;direction:XYZ}):void {

                geo.unproject(geo.copyXyzFromFloat(x, y, 0, this._tempCN), viewportWidth, viewportHeight, world, view, projection, result.origin)
                geo.unproject(geo.copyXyzFromFloat(x, y, 1, this._tempCN), viewportWidth, viewportHeight, world, view, projection, this._end)

                //var start = BABYLON.Vector3.Unproject(new BABYLON.Vector3(x, y, 0), viewportWidth, viewportHeight, world, view, projection);
                //var end = BABYLON.Vector3.Unproject(new BABYLON.Vector3(x, y, 1), viewportWidth, viewportHeight, world, view, projection);
                geo.substract(this._end, result.origin, result.direction)
                geo.normalize(result.direction, result.direction)

            }


            private pointerIsDown = false
            onPointerDown(actualPointerX, actualPointerY) {
                this.pointerIsDown = true
                /**on glace ces matrices pour éviter les instabilités*/
                geo.copyMat(<MM> this.getProjectionMatrix(), this.frozonProjectionMatrix)
                geo.copyMat(<MM> this.getViewMatrix(), this.frozonViewMatrix)
                this.cumulatedAngle = 0

                if (this._lookForTheBestGrabber&& this.grabbers.length>1){
                    this.lookForTheBestGrabber(actualPointerX, actualPointerY)
                    this._lookForTheBestGrabber=false
                }
            }

            private _lookForTheBestGrabber=true
            private lookForTheBestGrabber(actualPointerX, actualPointerY){


                let shorterDist=Number.POSITIVE_INFINITY
                let closerGraber=null
                for (let gra of this.grabbers) {

                    this.createPickingRayWithFrozenCamera(actualPointerX, actualPointerY,
                        <MM> gra.mesh.getWorldMatrix(),
                        this.frozonViewMatrix,
                        this.frozonProjectionMatrix,
                        this.pickingRay)
                    geo.copyXYZ(this.pickingRay.direction, this.camDir)

                    /**true also we we are inside the grabber*/
                    this._babylonRay.direction = this.pickingRay.direction
                    this._babylonRay.origin = this.pickingRay.origin

                    /**fast checking*/
                    let pickInfo = gra.mesh.intersects(this._babylonRay, true)


                    if (pickInfo.hit) {
                        if (pickInfo.distance<shorterDist){
                            shorterDist=pickInfo.distance
                            closerGraber=gra
                        }
                    }
                }

                if (closerGraber!=null && closerGraber!=this.currentGrabber){
                    if (this.onGrabberChange!=null) this.onGrabberChange(this.currentGrabber,closerGraber)
                    this.currentGrabber = closerGraber
                    console.log('we have changed grabber, the new one is: ', closerGraber.name)
                }



            }

             onPointerUp() {


                 this._lookForTheBestGrabber=true

                this.toogleIconCursor('cursorDefault')
                if (this.currentGrabber.showGrabberOnlyWhenGrabbing) this.currentGrabber.mesh.visibility=0
                this.pointerIsDown = false
                geo.copyXYZ(this.myNullVector, this.oldCamDir)
                geo.copyXYZ(this.myNullVector, this.cursorPositionOnGrabberOld)
            }








            /** called when we detach control  */
            reset() {
                this._keys = []
                //TODO what else ?

            }

            private cursorActualStyle:string
            private toogleIconCursor(style:string) {
                if (this.cursorActualStyle != style) {
                    this.$canvasElement.className = style
                    //this.$canvasElement.className += "cursorGrabbing";
                    this.cursorActualStyle = style
                }
            }



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
            public _isSynchronizedViewMatrix():boolean {
                if (!super._isSynchronizedViewMatrix()) {
                    return false;
                }
                return this.trueCamPos.almostEqual(this.whishedCamPos)

                //return this.isSynchronized()

            }


            private _target = XYZ.newZero()
            private viewMM = new MM()
            /**Est appelée par Camera.getViewMatrix uniquement lorsque _isSynchronizedViewMatrix renvoit faux
             * Le lien entre Camera.getViewMatrix et Camera.getViewMatrix._getViewMatrix est bizarrement compliqué.
             * */
             _getViewMatrix():MM {
                geo.copyXYZ(this.trueCamPos.position, this._target)
                geo.add(this._target, this.trueCamPos.frontDir, this._target)
                geo.LookAtLH(this.trueCamPos.position, this._target, this.trueCamPos.upVector, this.viewMM)

                return this.viewMM;
            }



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
            update():void {
                this.checkForKeyPushed()
                /**cela fait le lissage*/
                if (!this.trueCamPos.almostEqual(this.whishedCamPos))  {
                    this.trueCamPos.goCloser(this.whishedCamPos)
                }
                this.position.copyFrom(this.trueCamPos.position)
                this.upVector.copyFrom(this.trueCamPos.upVector)

            }



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

            _keys = [];
            keysUp = [38];
            keysDown = [40];
            keysLeft = [37];
            keysRight = [39];
            keysFrontward =[] //[66, 78];
            keysBackward =[] //[32];



            onKeyDown(evt:any) {
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
                        //}
                    }
                }
            }

            onKeyUp(evt) {
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
            }


            private _axeForKeyRotation = new XYZ(0, 0, 0)
            private _additionnalVec = new XYZ(0, 0, 0)
            private checkForKeyPushed():void {
                if (this._keys.length == 0) return

                geo.copyXyzFromFloat(0, 0, 0, this._axeForKeyRotation)

                for (var index = 0; index < this._keys.length; index++) {
                    var keyCode = this._keys[index];

                    if (this.keysLeft.indexOf(keyCode) !== -1) {
                        geo.copyXYZ(this.whishedCamPos.upVector, this._additionnalVec)
                        geo.scale(this._additionnalVec, -1, this._additionnalVec)
                        geo.add(this._axeForKeyRotation, this._additionnalVec, this._axeForKeyRotation)

                    }
                    if (this.keysUp.indexOf(keyCode) !== -1) {
                        geo.cross(this.whishedCamPos.frontDir, this.whishedCamPos.upVector, this._additionnalVec)
                        geo.add(this._additionnalVec, this._axeForKeyRotation, this._axeForKeyRotation)
                    }
                    if (this.keysRight.indexOf(keyCode) !== -1) {
                        geo.copyXYZ(this.whishedCamPos.upVector, this._additionnalVec)
                        geo.add(this._additionnalVec, this._axeForKeyRotation, this._axeForKeyRotation)
                    }
                    if (this.keysDown.indexOf(keyCode) !== -1) {
                        geo.cross(this.whishedCamPos.upVector, this.whishedCamPos.frontDir, this._additionnalVec)
                        geo.add(this._additionnalVec, this._axeForKeyRotation, this._axeForKeyRotation)
                    }

                    if (this.keysBackward.indexOf(keyCode) !== -1) this.translateCam(-0.1)
                    else if (this.keysFrontward.indexOf(keyCode) !== -1) this.translateCam(0.1)
                }

                /**it was already appears that the axis was too small : */
                if (geo.squareNorme(this._axeForKeyRotation) < geo.epsilon) return

                let angle = -0.02

                /**when key pushed, we always use free mode*/
                this.rotate(this._axeForKeyRotation, angle)
            }




            /** #################################################
                            CONTROLS BINDING
            ##################################################*/

            public wheelPrecision = 1.0;

            private _attachedElement:HTMLElement;

            private _onPointerDown:(e:PointerEvent) => void;
            private _onPointerUp:(e:PointerEvent) => void;
            private _onPointerMove:(e:PointerEvent) => void;
            private _wheel:(e:MouseWheelEvent) => void;
            private _onMouseMove:(e:MouseEvent) => any;
            private _onKeyDown:(e:KeyboardEvent) => any;
            private _onKeyUp:(e:KeyboardEvent) => any;
            private _onLostFocus:(e:FocusEvent) => any;
            private _reset:() => void;
            private _onGestureStart:(e:PointerEvent) => void;
            private _onGesture:(e:MSGestureEvent) => void;
            private _MSGestureHandler:MSGesture;
            private eventPrefix = Tools.GetPointerPrefix()



            //private _viewMatrix = new BABYLON.Matrix()
            // public _getViewMatrix():Matrix {
            //     //geo.MMtoBabylonMatrix(this.cameraPilot.getViewMatrix(),this._viewMatrix)
            //     //return this._viewMatrix;
            //     return this.cameraPilot.getViewMatrix()
            // }


            private deltaNotToBigFunction(delta:number):number {
                if (delta > 0.1) return 0.1
                if (delta < -0.1) return -0.1
                return delta
            }

            // Methods
            public attachControl(element:HTMLElement, noPreventDefault?:boolean):void {
                var pointerId//=null//Math.random();

                if (this._attachedElement) {
                    return;
                }
                this._attachedElement = element;


                //if (this._onPointerDown === undefined) {
                this._onPointerDown = evt => {

                    if (pointerId) {
                        return;
                    }

                    pointerId = evt.pointerId;


                    if (!noPreventDefault) {
                        evt.preventDefault();
                    }


                    var rect = element.getBoundingClientRect();
                    this.onPointerDown(evt.clientX - rect.left, evt.clientY - rect.top)

                };

                this._onPointerUp = evt => {

                    pointerId = null;
                    if (!noPreventDefault) {
                        evt.preventDefault();
                    }

                    this.onPointerUp()

                };


                this._onPointerMove = evt => {

                    if ( pointerId !== evt.pointerId) {
                        return;
                    }

                    var rect = element.getBoundingClientRect();
                    this.onPointerMove(evt.clientX - rect.left, evt.clientY - rect.top)

                    if (!noPreventDefault) {
                        evt.preventDefault();
                    }
                };

                this._onMouseMove = this._onPointerMove

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

                this._wheel = event => {
                    var delta = 0;
                    if (event.wheelDelta) {
                        delta = this.deltaNotToBigFunction(event.wheelDelta / (this.wheelPrecision * 300))
                        //delta = (event.wheelDelta / (this.wheelPrecision * 300))


                    } else if (event.detail) {
                        delta = this.deltaNotToBigFunction(-event.detail / (this.wheelPrecision * 30))

                    }

                    /**MATHIS*/
                    if (delta) this.translateCam(delta)

                    if (event.preventDefault) {
                        if (!noPreventDefault) {
                            event.preventDefault();
                        }
                    }
                };

                this._onKeyDown = evt => {
                    /**MATHIS*/
                    this.onKeyDown(evt)
                }

                this._onKeyUp = evt => {
                    /**MATHIS*/
                    this.onKeyUp(evt)
                }

                this._onLostFocus = () => {
                    this._keys = [];
                    pointerId = null;
                };

                this._onGestureStart = e => {
                    if (window.MSGesture === undefined) {
                        return;
                    }

                    if (!this._MSGestureHandler) {
                        this._MSGestureHandler = new MSGesture();
                        this._MSGestureHandler.target = element;
                    }

                    this._MSGestureHandler.addPointer(e.pointerId);
                };

                this._onGesture = e => {
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

                this._reset = () => {
                    /**MATHIS*/
                    this.reset()
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
                    {name: "keydown", handler: this._onKeyDown},
                    {name: "keyup", handler: this._onKeyUp},
                    {name: "blur", handler: this._onLostFocus}
                ]);
            }


            public detachControl(element:HTMLElement):void {
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
                    {name: "keydown", handler: this._onKeyDown},
                    {name: "keyup", handler: this._onKeyUp},
                    {name: "blur", handler: this._onLostFocus}
                ]);

                this._MSGestureHandler = null;
                this._attachedElement = null;

                if (this._reset) {
                    this._reset();
                }
            }







        }





        export class CamPositioning extends Positioning{
            position:XYZ =new XYZ(0,0,-3)
            upVector:XYZ = new XYZ(0, 1, 0)
            frontDir:XYZ = new XYZ(0, 0, 1)
            sizes=new XYZ(1,1,1)

            smoothParam = 0.5

            constructor(private grabberPilot:GrabberCamera){
                super()
            }

            almostEqual(camCarac:WishedPositioning):boolean {
                return geo.xyzAlmostEquality(this.position, camCarac.getPosition()) && geo.xyzAlmostEquality(this.upVector, camCarac.upVector) && geo.xyzAlmostEquality(this.frontDir, camCarac.frontDir)
            }

            /**TODO problème ici si l'on prend une wished positionning très loin de la cam positionning*/
            goCloser(positioning:WishedPositioning):void {
                geo.between(positioning.position, this.position, this.smoothParam, this.position)

                geo.between(positioning.upVector, this.upVector, this.smoothParam, this.upVector)
                geo.between(positioning.frontDir, this.frontDir, this.smoothParam, this.frontDir)

                if (this.upVector.lengthSquared()<geo.epsilonSquare ){
                    this.upVector.copyFrom(positioning.upVector).scale(-1)
                    logger.c('a wished upVector was opposite to the true upVector')
                }
                if (this.frontDir.lengthSquared()<geo.epsilonSquare ){
                    this.frontDir.copyFrom(positioning.frontDir).scale(-1)
                    logger.c('a wished frontDir was opposite to the true frontDir')
                }


                if(this.grabberPilot.onPositioningChange!=null) {
                    this.positioningCopy.copyFrom(this)
                    this.grabberPilot.onPositioningChange(this.positioningCopy)
                }

            }

            private positioningCopy=new Positioning()
            copyFrom(positioning:Positioning) {
                geo.copyXYZ(positioning.position, this.position)
                geo.copyXYZ(positioning.upVector, this.upVector)
                geo.copyXYZ(positioning.frontDir, this.frontDir)
                // if(this.grabberPilot.onPositioningChange!=null) {
                //     this.positioningCopy.copyFrom(this)
                //     this.grabberPilot.onPositioningChange(this.positioningCopy)
                // }

            }

            changeFrontDir(vector:XYZ):void {
                geo.orthonormalizeKeepingFirstDirection(vector, this.upVector, this.frontDir, this.upVector)
                // if(this.grabberPilot.onPositioningChange!=null) {
                //     this.positioningCopy.copyFrom(this)
                //     this.grabberPilot.onPositioningChange(this.positioningCopy)
                // }
            }
            changeUpVector(vector:XYZ):void {
                geo.orthonormalizeKeepingFirstDirection( this.upVector,vector , this.upVector,this.frontDir)
                // if(this.grabberPilot.onPositioningChange!=null) {
                //     this.positioningCopy.copyFrom(this)
                //     this.grabberPilot.onPositioningChange(this.positioningCopy)
                // }
            }

        }


        export class WishedPositioning extends Positioning{

            constructor(private camera:GrabberCamera){
                super()
            }

            upVector:XYZ = new XYZ(0, 1, 0)
            frontDir:XYZ = new XYZ(0, 0, 1)
            position:XYZ = new XYZ(0, 0, -3)

            getPosition():XYZ{
                return this.position
            }



            private _newPositionBeforCollision=new XYZ(0,0,0)
            private _velocity=new XYZ(0,0,0)


            changePosition(newPosition:XYZ){

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



                if (this.camera.positionChangesBiaiser!=null){
                    this._newPositionBeforCollision.copyFrom(this.camera.positionChangesBiaiser(this.position,newPosition,this.camera.currentGrabber))
                }
                else this._newPositionBeforCollision.copyFrom(newPosition)


                if ( this.camera.checkCollisions){
                    this._velocity.copyFrom(this._newPositionBeforCollision).substract(this.camera.trueCamPos.position)
                    this._collideWithWorld(this._velocity,this._newPositionBeforCollision)
                }
                else this.position.copyFrom(this._newPositionBeforCollision)



                //if (this.grabberPilot.onPositioningChange!=null) this.grabberPilot.onPositioningChange(this,this.grabberPilot.currentGrabber)

            }

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
            private _collider=new Collider()
             ellipsoid=new XYZ(1,1,1)
            private _oldPosition=new XYZ(0,0,0)
            private _collideWithWorld(velocity: Vector3,candidatePos:XYZ): void {
                // var globalPosition=this.getPosition()
                // /** in babylon Free Camera, they decal the impact point by ellipsoid.y, but this is not very natural */
                // globalPosition.subtractFromFloatsToRef(0, 0, 0, this._oldPosition);

                this._collider.radius = this.ellipsoid;
                this._oldPosition.copyFrom(candidatePos)
                //this.grabberPilot.camera.getScene().collisionCoordinator.getNewPosition(this._oldPosition, velocity, this._collider, 3, null, this._onCollisionPositionChange, -13);
                this.camera.scene.collisionCoordinator.getNewPosition(this._oldPosition, velocity, this._collider, 3, null, this._onCollisionPositionChange, -13);

            }

            //private getScene():BABYLON.Scene{return this.grabberPilot.camera.getScene()}
            private _diffPosition=new XYZ(0,0,0)
            private _newPosition=new XYZ(0,0,0)
            private _inter=new XYZ(0,0,0)
            private _upPerturbation=new XYZ(0,0,0)
            private _onCollisionPositionChange = (collisionId: number, newPosition: XYZ, collidedMesh: BABYLON.AbstractMesh = null) => {
                //if (this.getScene().workerCollisions) newPosition.multiplyInPlace(this._collider.radius);

                this._newPosition.copyFrom(newPosition);
                this._newPosition.subtractToRef(this._oldPosition, this._diffPosition).scale(2)

                //this._position.copyFrom(this._newPosition)

                if (collidedMesh!=null) {
                    console.log('collision')
                    this._upPerturbation.copyFrom(this.upVector).scale(0.005)
                    this.position.add(this._diffPosition).add(this._upPerturbation)
                }
                else this.position.copyFrom(this._oldPosition)



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
            }



        }


        export class Grabber {


            grabberCamera:GrabberCamera

            parallelDisplacementInsteadOfRotation=false
            showGrabberOnlyWhenGrabbing=true

            mesh:BABYLON.Mesh

            name:string

            /**can stay null e.g. for plane grabber
             * but if null no grabber rotation is possible, and no "recentring while goChanging back" */
            referenceCenter : XYZ=null
            //rotationAxis:XYZ=null

            onGrabbingActions=new StringMap<(alpha:number)=>void>()

            //radius = 1

            /**inside zone1: free displacement
             * outside zone2: grabbing
             * in zone2 minus zone1: interpolation between the two rotation
             * outside zone3: the camera is detached from the grabber
             * this distance are absolute. But in sphericalGrabber they are fixed proportionnaly to the radius of the grabber*/
            endOfZone1=1
            endOfZone2=3
            endOfZone3=10


            zoneAreDefinedFromCenterRatherFromSurface=true



            /**will produce no effect if no {@link Grabber.referenceCenter} is given*/
            focusOnMyCenterWhenCameraGoDownWard=true


            material:BABYLON.StandardMaterial
            scene:BABYLON.Scene

            dispose():void{
                this.mesh.dispose()
            }


            /** return
             * 0 is we are too close of the wrapper, so we use freeMovement
             * 1 if wee are far, so we use pure wrapping mode
             * between 0 and 1 we can use mixed mode (or not depending to a boolean)
             * */
            interpolationCoefAccordingToCamPosition(camPosition:XYZ,distCamToGrabber:number):number {
                //let l = geo.distance(this.rotationCenter, cameraPosition)
                let distance=0
                if (this.zoneAreDefinedFromCenterRatherFromSurface) distance=geo.distance(camPosition,this.referenceCenter)
                else distance=distCamToGrabber


                if (distance <= this.endOfZone1) return 0;
                if (distance >= this.endOfZone2) return 1;
                return (distance - this.endOfZone1) / (this.endOfZone2 - this.endOfZone1)

            }

            checkArgs() {

                if (this.zoneAreDefinedFromCenterRatherFromSurface && this.referenceCenter==null) throw 'you must define a reference center when zoneAreDefinedFromCenterRatherFromSurface'
                if (this.focusOnMyCenterWhenCameraGoDownWard && this.referenceCenter==null) throw 'you must define a reference center when focusOnMyCenterWhenCameraGoDownWard'

                if (this.endOfZone1  > this.endOfZone2) throw 'zone2 must contains zone1'
                if (this.endOfZone2  > this.endOfZone3) throw 'zone3 must contains zone2'

            }


            constructor(scene:BABYLON.Scene){
                this.scene=scene
                this.material=new BABYLON.StandardMaterial('',this.scene)
                this.material = new BABYLON.StandardMaterial("texture1", this.scene)
                this.material.alpha = 0.3
                this.material.diffuseColor = new BABYLON.Color3(1, 1, 1)
            }


        }




        export class SphericalGrabber extends Grabber{
            public radius=1

            constructor(scene:BABYLON.Scene,sizes=new XYZ(1,1,1),positionAndReferenceCenter=new XYZ(0,0,0),isPickable=false){
                super(scene)
                this.radius=sizes.x
                this.endOfZone1=this.radius
                /** endOfZone2=3 is not enough: the problem is that Babylon do not capture  intersection point between ray and Mamesh when camera is close to the Mesh (why ?).
                 * So it capture the backward point of the sphere, and the camera turn in the opposite sens.  */
                this.endOfZone2=4*this.radius
                this.endOfZone3=10*this.radius

                this.referenceCenter=positionAndReferenceCenter
                this.focusOnMyCenterWhenCameraGoDownWard=true
                this.parallelDisplacementInsteadOfRotation=false
                this.showGrabberOnlyWhenGrabbing=true

                this.mesh= BABYLON.Mesh.CreateSphere("default sphere for grabbing", 10, 2, scene);
                this.mesh.position=positionAndReferenceCenter
                this.mesh.scaling=sizes
                this.mesh.material = this.material
                this.mesh.isPickable=isPickable
            }
        }



        export class PlanarGrabber extends Grabber{


            constructor(scene:BABYLON.Scene,scaling=new XYZ(1,1,1),position=new XYZ(0,0,0),quaternion=new XYZW(0,0,0,1),isPickable=false){
                super(scene)

                this.referenceCenter=null
                this.focusOnMyCenterWhenCameraGoDownWard=false
                this.parallelDisplacementInsteadOfRotation=true

                this.zoneAreDefinedFromCenterRatherFromSurface=false

                this.endOfZone1=0
                this.endOfZone2=0

                this.mesh= BABYLON.Mesh.CreatePlane("default plane for grabbing",1,scene);
                this.mesh.position=position
                this.mesh.scaling=scaling
                this.mesh.rotationQuaternion=quaternion

                //material.sideOrientation=BABYLON.Mesh.DOUBLESIDE
                this.mesh.material = this.material
                this.mesh.isPickable=isPickable

            }

        }





    }

}

