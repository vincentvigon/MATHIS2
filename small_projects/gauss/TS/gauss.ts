/**
 * Created by vigon on 05/05/2016.
 */

module mathis {


    // import Vector3=BABYLON.Vector3
    // import VertexBuffer = BABYLON.VertexBuffer;
    // import Mesh = BABYLON.Mesh;
    // import Color3 = BABYLON.Color3;
    // import GrabberCamera = mathis.macamera.GrabberCamera;

    export module gauss {

        // import FreeCamera = BABYLON.FreeCamera;
        // import InstancedMesh = BABYLON.InstancedMesh;
        // import GrabberCamera = mathis.macamera.GrabberCamera;
        // import Action = BABYLON.Action;
        // import AbstractMesh = BABYLON.AbstractMesh;
        // import StandardMaterial = BABYLON.StandardMaterial;
        // import Carte = mathis.riemann.Carte;




        export function startGauss() {
            let mainDiv:HTMLElement = document.getElementById("mainDiv");
            
            //let canvass = mathis.nCanvasInOneLine(2, mainDiv)

            let frame = new MathisFrame("surfaceMathisFrame",false)
            let frame2 = new MathisFrame("sphereMathisFrame",false)
            let buttonPlace = legend('30px', mainDiv, false)

            new GaussCurvature(frame, frame2, buttonPlace)

        }

        

        type TwoMeshes={initial:BABYLON.AbstractMesh,onSphere:BABYLON.AbstractMesh}
        type UvAndCarte={uv:UV;carte:riemann.Carte}



        class DrawNormalAndTangentVector{

            //private coordinate:riemann.Carte
            //private IN_mamesh:Mamesh
            private surfaceScene:BABYLON.Scene
            private sphereScene:BABYLON.Scene
            private cam:macamera.GrabberCamera

            private surface:BABYLON.Mesh

            sizes=new XYZ(1,1,1)

            cartes:riemann.Carte[]

            constructor(
                //IN_mamesh:Mamesh,
                cartes:riemann.Carte[],
                scene:BABYLON.Scene,
                sphereScene:BABYLON.Scene,
                cam:macamera.GrabberCamera,
                surface:BABYLON.Mesh
            ){
                //this.IN_mamesh=IN_mamesh
                this.cartes=cartes
                this.surfaceScene=scene
                this.cam=cam
                this.sphereScene=sphereScene
                this.surface=surface

            }


            private checkOrientation(u:number,v:number,carte:riemann.Carte):void{
                let pointToCam=XYZ.newFrom(this.cam.trueCamPos.position).substract(carte.X(u,v))
                if (geo.dot(pointToCam,carte.newN(u,v))<0) carte.orientationCoef*=-1
            }


            arrowColor=new BABYLON.Color3(1,0,0)
            private oneArrowOnOneScene(point:XYZ,quaternion:XYZW,scene:BABYLON.Scene,sizes:XYZ):BABYLON.Mesh{
                let creatorArrowMesh=new creation3D.ArrowCreator(scene)
                //creatorArrowMesh.headUp=this.naturalOrientationComesToCam
                let arrow=creatorArrowMesh.go()
                arrow.position=point
                arrow.rotationQuaternion=quaternion
                let mat=new BABYLON.StandardMaterial('',scene)
                mat.diffuseColor=this.arrowColor
                arrow.material=mat
                arrow.scaling=sizes
                return arrow
            }

            drawNormalVectors(u:number,v:number,carte:riemann.Carte):TwoMeshes{

                this.checkOrientation(u,v,carte)


                let positionning=new Positioning()
                positionning.upVector=carte.newN(u,v)

                let quat=positionning.quaternion()

                let initial= this.oneArrowOnOneScene(carte.X(u,v),quat,this.surfaceScene,this.sizes)
                let onSphere=this.oneArrowOnOneScene(new XYZ(0,0,0),quat.clone(),this.sphereScene,new XYZ(this.sizes.x,1,this.sizes.z))

                return {initial:initial,onSphere:onSphere}

            }

            planeColor=new BABYLON.Color3(0,0,1)
            planeRadius=0.2
            private oneTangentPlane(normal:XYZ, tangent:XYZ, position:XYZ, scene:BABYLON.Scene, onClick:(xyz:XYZ)=>void=null):BABYLON.Mesh{

                let res=BABYLON.Mesh.CreateDisc('',this.planeRadius,60,scene)
                let qua=new XYZW(0,0,0,0)
                geo.aQuaternionMovingABtoCD(new XYZ(0,0,1),new XYZ(1,0,0),normal.scale(-1),tangent,qua,false)

                res.rotationQuaternion=qua
                res.position=position

                let biMat=new BABYLON.StandardMaterial('',scene)
                biMat.sideOrientation=BABYLON.Mesh.DOUBLESIDE
                biMat.diffuseColor=this.planeColor
                biMat.backFaceCulling=false
                res.material=biMat

                if (onClick!=null){
                    ;(<any> res).onClick=onClick
                }


                return res

            }

            tangentDiameter=0.1
            drawOneTangentVector(deb:XYZ,end:XYZ,scene:BABYLON.Scene):BABYLON.AbstractMesh{
                if (geo.distance(deb,end)<2*geo.epsilon) return

                let arrowCrea=new creation3D.ArrowCreator(scene)
                //arrowCrea.bodyDiameterProp=
                arrowCrea.arrowFootAtOrigin=false
                let arrowMesh=arrowCrea.go()
                let mat=new BABYLON.StandardMaterial('',scene)
                mat.diffuseColor=new BABYLON.Color3(1,0,0)
                arrowMesh.material=mat
                let elongate=new visu3d.ElongateAMeshFromBeginToEnd(deb,end,arrowMesh)
                elongate.lateralScaling=this.tangentDiameter*2
                elongate.goChanging()
                return arrowMesh
            }

            drawTangentPlanes(u:number,v:number,carte:riemann.Carte,clickOnPlaneNow:boolean,meshesToDispose:BABYLON.AbstractMesh[]):void{



                this.checkOrientation(u,v,carte)

                let onClick=null
                if (clickOnPlaneNow){

                    this.surface.isPickable=false

                    onClick=(clickXyz:XYZ)=>{

                        meshesToDispose.push(this.drawOneTangentVector(carte.X(u,v),clickXyz,this.surfaceScene))

                        let tangent=XYZ.newFrom(clickXyz).substract(carte.X(u,v))
                        let dNtangent=carte.dNaction(u,v,tangent)

                        let begin=carte.newN(u,v)
                        let end=XYZ.newFrom(begin).add(dNtangent)
                        meshesToDispose.push(this.drawOneTangentVector(begin,end,this.sphereScene))

                    }
                }


                meshesToDispose.push(this.oneTangentPlane(carte.newN(u,v),carte.Xu(u,v),carte.X(u,v),this.surfaceScene,onClick))
                meshesToDispose.push(this.oneTangentPlane(carte.newN(u,v),carte.Xu(u,v),carte.newN(u,v),this.sphereScene))


            }


        }


        enum PointOfView{vue_libre,vue_de_face,vue_de_dos,vue_de_gauche,vue_de_droite,vue_du_haut,vue_du_bas}


        class GaussCurvature{

            private surfaceCamera:macamera.GrabberCamera
            private sphereCamera:macamera.GrabberCamera
            private surfaceScene:BABYLON.Scene
            private sphereScene:BABYLON.Scene
            private surfaceMathisFrame:MathisFrame

            private meshesToDispose:BABYLON.AbstractMesh[]=[]
            private localButtonPlace:HTMLElement
            private normalize=false
            private mode=0


            /**created during constructor*/
            private drawNormalVector:DrawNormalAndTangentVector
            private meshSurf:BABYLON.Mesh
            private linesOnSurf:BABYLON.Mesh[]

            private surface:riemann.Surface


            private $tangentSpace:HTMLSelectElement=null
            private $surfaceName:HTMLSelectElement=null
            private $pointOfVue:HTMLSelectElement=null
            private $courbure:HTMLElement=null

            private recul=-3
            private pointOfViewToPos:XYZ[]=[null,new XYZ(0,0,this.recul),new XYZ(0,0,-this.recul),new XYZ(this.recul,0,0),new XYZ(-this.recul,0,0),new XYZ(0,this.recul,0),new XYZ(0,-this.recul,0)]
            private pointOfViewToUpVector:XYZ[]=[null,new XYZ(0,1,0),new XYZ(0,1,0),new XYZ(0,1,0),new XYZ(0,1,0),new XYZ(0,0,1),new XYZ(0,0,1)]


            constructor(surfaceMathisFrame:MathisFrame,sphereMathisFrame:MathisFrame,localButtonPlace:HTMLElement){

                this.surfaceScene=surfaceMathisFrame.scene
                this.sphereScene=sphereMathisFrame.scene
                this.surfaceMathisFrame=surfaceMathisFrame

                this.localButtonPlace=localButtonPlace

                /**camera are create here*/
                this.createGaussSphereScene(sphereMathisFrame)
                this.createSurfaceScene(surfaceMathisFrame)


                this.createSurface(mathis.riemann.SurfaceName.torus)



                this.drawNormalVector=new DrawNormalAndTangentVector(
                    this.surface.cartes,
                    this.surfaceScene,
                    this.sphereScene,
                    this.surfaceCamera,
                    this.meshSurf
                )
                this.drawNormalVector.sizes=new XYZ(0.1,0.1,0.1)

                this.resetInitialClick()



                this.addControlButton()


                /**couplage des deux caméras
                 * attention, cette évenement n'est pas lancé quand on force le positionnement par les méthodes grabberCaera.changeXXX */
                //var setTimeDone=false
                this.surfaceCamera.onPositioningChange=(positioning)=>{this.onPositioningChange(positioning)}

            }



            private createSurface(surfaceName:mathis.riemann.SurfaceName){
                let surfaceMaker=new riemann.SurfaceMaker(surfaceName)
                this.surface=surfaceMaker.go()
                this.drawMesh(this.surface.wholeSurfaceMesh)
            }



            private onPositioningChange(positioning){
                {
                    let length=this.sphereCamera.trueCamPos.position.length()
                    positioning.position.normalize().scale(length)
                    this.sphereCamera.trueCamPos.copyFrom(positioning)
                    this.sphereCamera.whishedCamPos.copyFrom(positioning)

                    /**when we move the surface by grabbing, the point_of_vue select would be put to "free"*/
                    this.$pointOfVue.selectedIndex=0

                }
            }



            private setMapMode():void{
                this.mode=0
                this.normalize=false

            }
            private setDifferenceMode():void{
                this.mode=1
                this.normalize=false
            }
            private setNormalisedDifferenceMode():void{
                this.mode=2
                this.normalize=true
            }
            private setDeriveMode():void{
                this.mode=3
                this.normalize=false
                this.$tangentSpace.selectedIndex=2

            }

            private addControlButton(){

                window.onload=()=>{


                    /**choix de la surface*/
                    {

                        let surfaceNames:string[]=allStringValueOfEnume(mathis.riemann.SurfaceName)


                        this.$surfaceName = document.createElement("select");
                        this.localButtonPlace.appendChild(this.$surfaceName);

                        for (let i = 0; i < surfaceNames.length; i++) {
                            let option:HTMLOptionElement = document.createElement("option");
                            option.value = surfaceNames[i];
                            option.text = surfaceNames[i];
                            this.$surfaceName.appendChild(option);
                        }
                        this.$surfaceName.onchange=()=>{

                            this.clearAll()

                            //this.$carteToDisplay.selectedIndex=0

                            this.createSurface(this.$surfaceName.selectedIndex)
                            //this.readdControlToDislayCarte()

                            //TODO utile ???
                            this.drawNormalVector=new DrawNormalAndTangentVector(this.surface.cartes,
                                this.surfaceScene,
                                this.sphereScene,
                                this.surfaceCamera,
                                this.meshSurf
                            )
                            this.drawNormalVector.sizes=new XYZ(0.1,0.1,0.1)
                        }



                    }


                    /**point de vue*/
                    {

                        let vueNames:string[]=allStringValueOfEnume(PointOfView)


                        this.$pointOfVue = document.createElement("select");
                        this.localButtonPlace.appendChild(this.$pointOfVue);

                        for (let i = 0; i < vueNames.length; i++) {
                            let option:HTMLOptionElement = document.createElement("option");
                            option.value = vueNames[i];
                            option.text = vueNames[i];
                            this.$pointOfVue.appendChild(option);
                        }
                        this.$pointOfVue.onchange=(ev)=>{
                            if (this.$pointOfVue.selectedIndex>0){

                                let position=XYZ.newFrom(this.pointOfViewToPos[this.$pointOfVue.selectedIndex])
                                let upVector=XYZ.newFrom(this.pointOfViewToUpVector[this.$pointOfVue.selectedIndex])
                                let positioning=new Positioning()
                                positioning.position=position
                                positioning.frontDir=XYZ.newFrom(position).scale(-1)
                                positioning.upVector=upVector

                                this.surfaceCamera.trueCamPos.copyFrom(positioning)
                                this.surfaceCamera.whishedCamPos.copyFrom(positioning)
                                this.sphereCamera.trueCamPos.copyFrom(positioning)
                                this.sphereCamera.whishedCamPos.copyFrom(positioning)


                            }
                        }
                        this.$pointOfVue.selectedIndex=1
                        this.$pointOfVue.onchange(null)


                    }

                    /**mode*/
                    {
                        let array = ["gauss map", "difference", "différence normalisé" ]; //TODO ,"différentielle"
                        let selectList:HTMLSelectElement = document.createElement("select");
                        this.localButtonPlace.appendChild(selectList);

                        for (let i = 0; i < array.length; i++) {
                            let option:HTMLOptionElement = document.createElement("option");
                            option.value = array[i];
                            option.text = array[i];
                            selectList.appendChild(option);
                        }

                        selectList.onchange = ()=> {
                            if( selectList.selectedIndex==0) this.setMapMode()
                            else if( selectList.selectedIndex==1) this.setDifferenceMode()
                            else if( selectList.selectedIndex==2) this.setNormalisedDifferenceMode()
                            else if( selectList.selectedIndex==3) this.setDeriveMode()

                        }
                    }


                    /**espace tangent*/
                    {
                        let array = ["pas d'espace tangent","petit espace tangent","grand espace tangent"];

                        this.$tangentSpace = document.createElement("select");
                        this.localButtonPlace.appendChild(this.$tangentSpace);

                        for (let i = 0; i < array.length; i++) {
                            let option:HTMLOptionElement = document.createElement("option");
                            option.value = array[i];
                            option.text = array[i];
                            this.$tangentSpace.appendChild(option);
                        }

                        this.$tangentSpace.selectedIndex=1
                    }



                    /**whole surface or one carte*/
                    //this.readdControlToDislayCarte()


                    /**bouton clear*/
                    {
                        let buttonClear = document.createElement('button')
                        buttonClear.classList.add("buttonClear")
                        buttonClear.innerHTML = '<i class="fa fa-eraser"></i>'
                        buttonClear.onclick = ()=> {
                            this.clearAllSecondaryMeshes()
                        }
                        this.localButtonPlace.appendChild(buttonClear)


                        this.$courbure = document.createElement('span')
                        this.localButtonPlace.appendChild(this.$courbure)
                        //this.$courbure.textContent="TOTO"


                        /**because we start with torus*/
                        this.$surfaceName.selectedIndex = mathis.riemann.SurfaceName.torus
                    }

                }

            }

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


            private clearAllSecondaryMeshes(){

                this.meshesToDispose.forEach(m=>{
                    if (m!=null) m.dispose()
                })
                this.meshesToDispose=[]
                this.resetInitialClick()
            }

            private resetInitialClick(){
                this.meshSurf.isPickable=true
                ;(<any> this.meshSurf).onClick=(clickedPoint:XYZ)=>{this.firstClick(clickedPoint)}
            }

            private clearAll(){


                this.clearAllSecondaryMeshes()
                this.meshSurf.dispose()
                this.linesOnSurf.forEach(m=>m.dispose())
                this.$pointOfVue.selectedIndex=1
                this.$pointOfVue.onchange(null)

            }



            private firstClick(clickedPoint:XYZ):void{

                let uvAndCarte=this.surface.findBestCarte(clickedPoint)//this.drawNormalVector.findUvAndCarte(clickedPoint)
                let UV=uvAndCarte.uv
                let carte=uvAndCarte.carte

                let color:BABYLON.Color3
                if(this.mode==0) color=new BABYLON.Color3(Math.random(),Math.random(),Math.random())
                else  color=new BABYLON.Color3(0,1,0)
                this.drawNormalVector.arrowColor=color
                let twoMesh=this.drawNormalVector.drawNormalVectors(UV.u,UV.v,carte)
                this.meshesToDispose.push(twoMesh.initial)
                this.meshesToDispose.push(twoMesh.onSphere)

                if (this.$tangentSpace.selectedIndex!=0){
                    if (this.$tangentSpace.selectedIndex==1) this.drawNormalVector.planeRadius=0.03
                    else if (this.$tangentSpace.selectedIndex==2) this.drawNormalVector.planeRadius=0.1

                    this.drawNormalVector.drawTangentPlanes(UV.u,UV.v,carte,(this.mode==3),this.meshesToDispose)
                }


                if (this.mode==1||this.mode==2){
                    ;(<any> this.meshSurf).onClick=(secondClicked:XYZ)=>{
                        let secondUvAndCarte=this.surface.findBestCarte(secondClicked)//this.drawNormalVector.findUvAndCarte(secondClicked)
                        if (secondUvAndCarte.carte!=carte){
                            cc("the second click is too far from the first: they arrived on different cart-image")
                        }
                        else{
                            this.secondClick(UV,secondUvAndCarte.uv,secondUvAndCarte.carte)
                        }

                        this.resetInitialClick()
                    }
                }

                let courbure=roundWithGivenPrecision(carte.dNinTangentBasis(UV.u,UV.v).determinant(),1)
                this.$courbure.textContent=" Courbure:"+courbure


            }

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

            private secondClick(UVcenter:UV,UVclicked:UV,carte:riemann.Carte):void{



                let initialLength=geo.distance(carte.X(UVcenter.u,UVcenter.v),carte.X(UVclicked.u,UVclicked.v))
                let initialLengthOnSphere=geo.distance(carte.newN(UVcenter.u,UVcenter.v),carte.newN(UVclicked.u,UVclicked.v))

                let alphas:number[]=[]
                let pas=0.01
                let alpha=0

                /**pour lses différences normalisée, on se rapproche plus du vecteur initial, pour que l'on voit mieux la tangence*/
                let alphaMax=(this.mode==1)?0.8:0.95


                while (alpha<alphaMax){
                    alphas.push(alpha)
                    alpha+=pas
                }


                let count=0
                let pointCenter=carte.X(UVcenter.u,UVcenter.v)
                // let length=geo.distance(pointCenter,coor.X(UVclicked.x,UVclicked.y))

                let currentNormal:TwoMeshes=null
                let currentDifference:TwoMeshes={initial:null,onSphere:null}

                let action=new PeriodicAction(()=>{

                    let UVinter=new UV(0,0)
                    geo.betweenUV(UVclicked,UVcenter,alphas[count],UVinter)
                    if (currentNormal!=null) {
                        currentNormal.initial.dispose()
                        currentNormal.onSphere.dispose()
                    }
                    currentNormal=this.drawNormalVector.drawNormalVectors(UVinter.u,UVinter.v,carte)
                    count++

                    if (count!=alphas.length+1) {
                        if (currentDifference.initial!=null) currentDifference.initial.dispose()
                        if(currentDifference.onSphere!=null)     currentDifference.onSphere.dispose()
                    }


                    /**un peu idiot de créer autant de fléche : 2 que l'on deplacerait suffirait*/

                    let arrivalOnSurface:XYZ
                    let arrivalOnSphere:XYZ

                    if (this.normalize){
                        let differenceOnSurface=carte.X(UVinter.u,UVinter.v).substract(pointCenter)

                        /** the user can click twice on the same point, so  subtraction can be zero-vector */
                        if (differenceOnSurface.lengthSquared()<geo.epsilonSquare) return

                        differenceOnSurface.normalize().scale(initialLength)
                        arrivalOnSurface=XYZ.newFrom(pointCenter).add(differenceOnSurface)

                        let differenceOnSphere=carte.newN(UVinter.u,UVinter.v).substract(carte.newN(UVcenter.u,UVcenter.v))
                        if(differenceOnSphere.length()>geo.epsilon) differenceOnSphere.normalize().scale(initialLengthOnSphere)
                        arrivalOnSphere=XYZ.newFrom(carte.newN(UVcenter.u,UVcenter.v)).add(differenceOnSphere)
                    }
                    else{
                        arrivalOnSurface=carte.X(UVinter.u,UVinter.v)
                        arrivalOnSphere=carte.newN(UVinter.u,UVinter.v)
                    }
                    currentDifference.initial=this.drawNormalVector.drawOneTangentVector(pointCenter,arrivalOnSurface,this.surfaceScene)
                    currentDifference.onSphere=this.drawNormalVector.drawOneTangentVector(carte.newN(UVcenter.u,UVcenter.v),arrivalOnSphere,this.sphereScene)
                    /**to dispose all the last*/
                    this.meshesToDispose.push(currentDifference.initial)
                    this.meshesToDispose.push(currentDifference.onSphere)


                    //currentDifference.onSphere=drawOneDifference(sphereFrame.scene,)

                })
                action.nbTimesThisActionMustBeFired=alphas.length+1
                action.timeIntervalMilli=3000/alphas.length



                //this.arrowsToDispose.push(currentNormal.initial)
                //this.arrowsToDispose.push(currentNormal.onSphere)

                this.surfaceMathisFrame.pushPeriodicAction(action)


            }


            private createGaussSphereScene(sphereFrame:MathisFrame){

                var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(-1, 1, -1), sphereFrame.scene);
                light0.diffuse = new BABYLON.Color3(1, 1, 1);
                light0.specular = new BABYLON.Color3(1, 1, 1);
                light0.groundColor = new BABYLON.Color3(0, 0, 0);

                let grabber=new macamera.SphericalGrabber(sphereFrame.scene,new XYZ(1,1,1))
                grabber.endOfZone1=0.
                grabber.endOfZone2=0.
                grabber.mesh.visibility=1
                grabber.showGrabberOnlyWhenGrabbing=false

                let mat=new BABYLON.StandardMaterial('',sphereFrame.scene)
                mat.alpha=0.3
                mat.diffuseColor=new BABYLON.Color3(1,1,1)
                grabber.mesh.material=mat

                let cam=new macamera.GrabberCamera(sphereFrame,grabber);
                cam.useFreeModeWhenCursorOutOfGrabber=false
                this.sphereCamera=cam

            }


            private createSurfaceScene(surfaceFrame:MathisFrame){
                var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(-1, 1, -1), surfaceFrame.scene);
                light0.diffuse = new BABYLON.Color3(1, 1, 1);
                light0.specular = new BABYLON.Color3(1, 1, 1);
                light0.groundColor = new BABYLON.Color3(0, 0, 0);

                let grabber=new macamera.SphericalGrabber(surfaceFrame.scene,new XYZ(1,1,1))
                grabber.endOfZone1=2
                grabber.endOfZone2=2
                grabber.showGrabberOnlyWhenGrabbing=true

                let cam=new macamera.GrabberCamera(surfaceFrame,grabber);
                //let camPos=new XYZ(-2,-2,-2)
                //let camPos=new XYZ(0,0,-1.5)


                cam.showPredefinedConsoleLog=false
                cam.useFreeModeWhenCursorOutOfGrabber=false


                // cam.changePosition(camPos)
                // cam.changeFrontDir(XYZ.newFrom(camPos).scale(-1))

                this.surfaceCamera=cam

            }


            private drawMesh(mesh:Mamesh):void{


                let lineFiller=new lineModule.LineComputer(mesh)
                lineFiller.startingVertices=[]

                for (let vertex of mesh.vertices){
                    if (vertex.param.x % 4 == 0 && vertex.param.y == 0) lineFiller.startingVertices.push(vertex)
                    if (vertex.param.x == 0 && vertex.param.y % 4 == 0) lineFiller.startingVertices.push(vertex)
                }
                lineFiller.go()


                let lin=new visu3d.LinesViewer(mesh,this.surfaceScene)
                //lin.color=new Color(new RGB_range255(124, 252, 0))
                lin.color=new Color(new RGB_range255(124, 252, 0))

                lin.constantRadius=0.004

                this.linesOnSurf=lin.go()
                this.linesOnSurf.forEach(mesh=>mesh.isPickable=false)


                let surf=new visu3d.SurfaceViewer(mesh,this.surfaceScene)
                //surf.vertexDuplication=visu3d.SurfaceVisuStatic.VertexDuplication.none
                //surf.sideOrientation=BABYLON.Mesh.BACKSIDE
                this.meshSurf=surf.go()

                this.resetInitialClick()

                // let mat=new BABYLON.StandardMaterial('',this.surfaceMathisFrameScene)
                // mat.diffuseColor=new Color3(0,1,1)
                // mat.backFaceCulling=true
                // mat.sideOrientation=BABYLON.Mesh.BACKSIDE
                // this.meshSurf.material=mat


            }




        }



    }
}