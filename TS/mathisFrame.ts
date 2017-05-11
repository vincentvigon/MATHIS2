/**
 * Created by vigon on 05/12/2016.
 */


module mathis{



    export function jQueryOK(ifNotThrowException=false){
        if(typeof $ !== 'undefined') return true
        if (ifNotThrowException) throw "jQuery is not present"
        else return false
    }

    
    import GrabberCamera = mathis.macamera.GrabberCamera;
    export class PeriodicAction{

        /**if 1, the action is just done 1 times*/
        nbTimesThisActionMustBeFired=Number.POSITIVE_INFINITY
        isPaused=false
        firedCount=0

        id:string=""
        action:()=>void
        frameInterval:number=null
        timeIntervalMilli:number=null

        constructor(action:()=>void){
            this.action=action
            this.lastTimeFired=performance.now()
        }

        lastTimeFired:number
        passageOrderIndex=1

    }


    export class MathisFrame {

        canvas:HTMLElement
        canvasParent:HTMLElement
        
        scene:BABYLON.Scene
        engine:BABYLON.Engine
        /**
         * If no canvasContainer is given, it is affected to document.body
          */
        //canvasContainer:any//html or jquery element
        //backgroundColorInHexa:string=null
        callbackIfWebglNotHere:()=>void=null
        
        
        messageDiv:MessageDiv

        /**only when jQuery is added*/
        subWindow_NE:SubWindow
        subWindow_NW:SubWindow
        subWindow_N:SubWindow
        subWindow_SE:SubWindow
        subWindow_SW:SubWindow
        subWindow_S:SubWindow
        subWindow_W:SubWindow
        subWindow_E:SubWindow



        showFPSinCorner(){
                this.$info = document.createElement("DIV");
                this.canvasParent.appendChild(this.$info)

            this.$info.style.position= 'absolute';
            this.$info.style.top='0';
            this.$info.style.left='0';
            this.$info.style.width='100px';
            this.$info.style.height= '20px';
            this.$info.style.backgroundColor= 'red';
            this.$info.style.zIndex= '1000';
        }



        constructor(htmlElementOrId:string|HTMLElement=null,addDefaultCameraAndLight=true,emptyForTest=false) {

            if (emptyForTest) return

            if( htmlElementOrId==null) {
                let html=document.getElementsByTagName("html")[0]
                html.style.height="100%"
                html.style.width="100%"
                html.style.padding="0"
                html.style.margin="0"

                this.canvasParent=document.getElementsByTagName("body")[0]
                this.canvasParent.style.height="100%"
                this.canvasParent.style.width="100%"
                this.canvasParent.style.padding="0"
                this.canvasParent.style.margin="0"
            }
            else {
                if (typeof htmlElementOrId == 'string') {
                    this.canvasParent = document.getElementById(<string> htmlElementOrId)
                    if (this.canvasParent==null) throw 'the id:'+ htmlElementOrId +' does not correspond to any HTMLElement'
                }
                else if (htmlElementOrId instanceof HTMLElement) this.canvasParent = <HTMLElement> htmlElementOrId
                else throw 'htmlElementOrId must be an htmlElement or the id of an html element'

            }


            if (this.canvasParent.offsetHeight<10) throw "the container-height is too small. Perhaps no css-included ?"
            if (this.canvasParent.offsetWidth<10) throw "the container-width is too small.  Perhaps no css-included ?"


            this.canvas=document.createElement('canvas')
            /**ils mettent cette ligne dans le premier tuto de Babylon. J'imagine pour utiliser hand.JS*/
            this.canvas.style.touchAction="none"
            this.canvasParent.appendChild(this.canvas)
            // let style = getComputedStyle(this.canvasParent);
            // if(style.position==null||style.position==""){
            //           throw("the proposed place for mathisFrame, had no a style.position given (must be relative, absolute or fixed). " +
            //               "So it is automatically put to relative ")}

           // let style = getComputedStyle(this.canvasParent);
           //  setTimeout(()=>{
           //  if(style.position==null||style.position==""){
           //      logger.c("the proposed place for mathisFrame, had no a style.position given (must be relative, absolute or fixed). " +
           //          "So it is automatically put to relative ")
           //      this.canvasParent.style.position="relative"
           //  }},30
           // )

            /**it is important that the parent has position*/
            this.set100(this.canvas)


            this.callbackIfWebglNotHere=()=>{
                setTimeout(()=>{
                    var $noWebGL:HTMLElement = document.createElement("DIV");
                    $noWebGL.id="noWebGL"
                    $noWebGL.innerHTML=
                        `<h3> Activez WebGL et relancez la page.</h3>
                     <p> Safari: Développement > Activer WebGL</p>`
                    this.canvasParent.appendChild($noWebGL)

                    this.canvasParent.style.position="absolute"
                    this.canvasParent.style.top="0"
                    this.canvasParent.style.left="0"
                    this.canvasParent.style.textAlign="center"
                    this.canvasParent.style.zIndex="1001"
                    this.canvasParent.style.backgroundColor="red"

                    // position: absolute;
                    // top:0;
                    // left:0;
                    // width:100%;
                    // text-align: center;
                    // height: 20px;
                    // z-index: 1000;

                },100)
            }

            /** be careful, the style must be load before, if the canvas dimension are decide after the engine creation, the pixed are really big */

            try{
                this.engine = new BABYLON.Engine(<HTMLCanvasElement> this.canvas, true);
            }
            catch(e){
                logger.c('webGL seems to not be present. Here is the message from Babylon:'+e)
                this.callbackIfWebglNotHere()
                this.engine=null
            }



            if (this.engine!=null){

                this.resetScene()

                //TODO this.scene=new BABYLON.Scene(this.engine)



                var count = 0
                var minFps = 0



                let frameCount=0
                this.engine.runRenderLoop(()=> {

                    frameCount++


                    for (let key in this.periodicActions){

                        let act:PeriodicAction=this.periodicActions[key]

                        if (act.isPaused) continue



                        if (act.timeIntervalMilli==null && act.frameInterval==null) {
                            act.frameInterval=1
                            logger.c("no intervalle given for a periodic action: by default the action is fired every frame")
                        }

                        if (act.timeIntervalMilli!=null ){
                            let time=performance.now()
                            if (time-act.lastTimeFired>act.timeIntervalMilli) {
                                this.fireAction(act)
                                act.lastTimeFired=time
                            }
                        }
                        else if (act.frameInterval!=null && frameCount%act.frameInterval==0) this.fireAction(act)
                    }

                    this.scene.render();
                    count++
                    let fps=this.engine.getFps()
                    if(fps<minFps) minFps =fps
                    if (count % 100 == 0) {
                        if(this.$info!=null) this.$info.textContent = minFps.toFixed()
                        minFps = Number.MAX_VALUE
                    }
                })

                this.domEventsHandler()
            }


            if (addDefaultCameraAndLight){
                this.addDefaultLight()
                this.addDefaultCamera()
            }

            if (jQueryOK()) {
                this.messageDiv = new MessageDiv(this)
                this.subWindow_NE = new SubWindow(this, 'NE')
                this.subWindow_NW = new SubWindow(this, 'NW')
                this.subWindow_N = new SubWindow(this, 'N')
                this.subWindow_SE = new SubWindow(this, 'SE')
                this.subWindow_SW = new SubWindow(this, 'SW')
                this.subWindow_S = new SubWindow(this, 'S')
                this.subWindow_W = new SubWindow(this, 'W')
                this.subWindow_E = new SubWindow(this, 'E')
            }

        }


        dispose():void{
            this.engine.dispose()
        }
        resetScene():void{
            if (this.scene!=null) this.scene.dispose()
            this.scene=new BABYLON.Scene(this.engine)
            this.scene.clearColor = this.backgroundColor.toBABYLON_Color4()//new BABYLON.Color3(this.backgroundColorRGB.r,this.backgroundColorRGB.g,this.backgroundColorRGB.b);
        }
        /**faster than reseting (but meshes are not disposed)*/
        skybox:BABYLON.Mesh
        clearScene(clearCamera=true,clearLights=true,clearSkybox=true):void{

            if (this.scene==null) throw 'no scene to clear'

            let meshesToKeep=[]

            if (this.scene.activeCamera!=null && !clearCamera){
                if (this.scene.activeCamera instanceof macamera.GrabberCamera) {
                    let macam=<macamera.GrabberCamera>this.scene.activeCamera
                    for (let grab of macam.grabbers)  meshesToKeep.push(grab.mesh)
                }
            }
            else{

                this.scene.cameras=[]
                if(this.scene.activeCamera!=null)this.scene.activeCamera.detachControl(this.canvas)
                this.scene.activeCamera=null
            }

            if (!clearSkybox) meshesToKeep.push(this.skybox)
            else this.skybox=null


            this.scene.meshes=meshesToKeep

            if(clearLights) this.scene.lights=[]

        }

        emptyAllCorner(){
            jQueryOK(true)
            this.subWindow_NW.empty()
            this.subWindow_NE.empty()
            this.subWindow_N.empty()
            this.subWindow_SW.empty()
            this.subWindow_SE.empty()
            this.subWindow_S.empty()

            this.subWindow_W.empty()
            this.subWindow_E.empty()
        }

        addDefaultLight():void{
            var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(-1, 1, -1), this.scene);
            // light0.diffuse = new BABYLON.Color3(1, 1, 1);
            // light0.specular = new BABYLON.Color3(1, 1, 1);
            // light0.groundColor = new BABYLON.Color3(0, 0, 0);

            light0.diffuse = new BABYLON.Color3(1,1,1);
            light0.specular = new BABYLON.Color3(1,1,1);
            light0.groundColor = new BABYLON.Color3(0.5,0.5,0.5);

        }

        /**do not type this method with macamera.GrabberCamera*/
        getGrabberCamera():any{
            if (this.scene.activeCamera==null) throw "no camera defined"
            if (this.scene.activeCamera instanceof macamera.GrabberCamera) return <macamera.GrabberCamera> this.scene.activeCamera
            else throw "active camera is not a grabber camera"
        }
        addDefaultCamera():void{
            let grabber0 = new macamera.SphericalGrabber(this.scene)
            //TODO
            this.scene.activeCamera = new macamera.GrabberCamera(this, grabber0)
            this.scene.activeCamera.attachControl(this.canvas)
            //this.scene.activeCamera=this.camera
        }


        periodicActions:PeriodicAction[]=[]
        private sortAction=(action1:PeriodicAction, action2:PeriodicAction)=>action1.passageOrderIndex-action2.passageOrderIndex

        pushPeriodicAction(action:PeriodicAction):void{
            this.periodicActions.push(action)
            this.periodicActions.sort(this.sortAction)
        }
        private suppressPeriodicAction(action:PeriodicAction):void{
            let index=this.periodicActions.indexOf(action)
            if (index==-1) throw 'this action is not registered'
            this.periodicActions.splice(index,1)
        }
        cleanAllPeriodicActions():void{
            this.periodicActions=[]
        }
        pauseAllPeriodicActions():void{
            for (let action of this.periodicActions) action.isPaused=true
        }
        unpauseAllPeriodicActions():void{
            for (let action of this.periodicActions) action.isPaused=false
        }

        
        backgroundColor =new Color("#d3d3d3")
        $info:HTMLElement
        
        private fireAction(ac:PeriodicAction){
            ac.action()
            ac.firedCount++
            if (ac.firedCount>=ac.nbTimesThisActionMustBeFired) {
                this.suppressPeriodicAction(ac)
            }

        }
        

        set100(element:HTMLElement):void{

            element.style.position="absolute"
            element.style.top="0"
            element.style.left="0"
            element.style.width="100%"
            element.style.height="100%"
            // position: absolute;
            // top:0;
            // left: 0;
            // width: 100%;
            // height: 100%;
        }


        private parentWidth:number=null
        private onParentDimChange(){

            let width=this.canvasParent.offsetWidth
            if (this.parentWidth==null) this.parentWidth=width
            else {
                if (width!=this.parentWidth){
                    this.parentWidth=width
                    this.engine.resize();
                    console.log("dim of parent of canvas  changes")
                }
            }

        }

        private domEventsHandler(){

            this.parentWidth=this.canvasParent.offsetWidth

            window.addEventListener("resize",  ()=> {
                this.onParentDimChange()
            });
            /**because the parent can change without any change of the window*/
            setInterval(()=>{
                this.onParentDimChange()
            },1000)





            let globalClickAction=()=>{
                let pickResult = this.scene.pick(this.scene.pointerX, this.scene.pointerY,(mesh)=>mesh.isPickable,false);



                if(pickResult.pickedMesh!=null){

                    let clickFuntion= (<any> pickResult.pickedMesh).onClick

                    if (clickFuntion!=null){
                        clickFuntion(pickResult.pickedPoint)
                    }

                    //let gameo:GameO=(<any>pickResult.pickedMesh).gameo
                    //if(gameo!=null) gameo.onClick()
                }
            }



            let timeOfDown
            let downAction=()=>{
                timeOfDown=performance.now()
            }
            let upAction=()=>{
                if (performance.now()-timeOfDown<500) globalClickAction()
            }

            let prefix=BABYLON.Tools.GetPointerPrefix()//'pointer' if possible, or 'mouse' if not
            this.canvas.addEventListener(prefix + "down",downAction , false);
            this.canvas.addEventListener(prefix + "up", upAction, false);


        }
    }


    export class SubWindow{


        $visual
        constructor(private mathisFrame:MathisFrame,className:string){
            jQueryOK(true)
            this.$visual = $('<div class="subWindow">');
            this.$visual.addClass(className)
            this.mathisFrame.canvasParent.appendChild(this.$visual[0])
        }



        appendAndGoToLine($obj:any){
            this.$visual.append($('<div>').append($obj))
        }

        append($obj:any){
            this.$visual.append($obj)
        }

        empty(){
            this.$visual.empty()
        }
    }

    // class NE_CornerWindow extends CornerWindow{
    //
    //     constructor(mathisFrame:MathisFrame){
    //         super(mathisFrame)
    //
    //         this.$visual[0].style.top='0';
    //         this.$visual[0].style.left='0';
    //     }
    // }
    // class NO_CornerWindow extends CornerWindow{
    //
    //     constructor(mathisFrame:MathisFrame){
    //         super(mathisFrame)
    //         //this.$visual[0].style.top='0';
    //         //this.$visual[0].style.right='0';
    //         this.$visual.css({
    //             top:'0',
    //             right:'0',
    //             textAlign:'right'
    //         })
    //     }
    // }
    //
    // class N_CornerWindow extends CornerWindow{
    //
    //     constructor(mathisFrame:MathisFrame){
    //         super(mathisFrame)
    //
    //         this.$visual.css({
    //             top:'0',
    //             right:"50%"
    //         })
    //     }
    // }




    export class MessageDiv{
        
        private $logDiv:HTMLElement
        
        
        constructor(private mathisFrame:MathisFrame){
            
        }
        
        addInMathisFrame(){
            this.$logDiv = document.createElement("DIV");
            this.mathisFrame.canvasParent.appendChild(this.$logDiv)

            this.$logDiv.style.position= 'absolute';
            this.$logDiv.style.top='0';
            this.$logDiv.style.left='0';
            this.$logDiv.style.width='100%';
            //this.$info.style.height= '20px';
            this.$logDiv.style.backgroundColor= 'white';
            this.$logDiv.style.zIndex= '900';
        }
        
        append(message:string){
            if (this.$logDiv==null) this.addInMathisFrame()
            let $message=document.createElement("DIV");
            $message.innerHTML=message
            this.$logDiv.appendChild($message)
        }



        empty(){
            if (this.$logDiv==null)return

            this.$logDiv.innerHTML=""
        }
        
        
        
    }

    export class EmptyMessageDivForTest extends MessageDiv{
        addInMathisFrame(){}
        append(message:string){}
        empty(){}
    }




    export class EmptyMathisFrameForFastTest extends MathisFrame{

        constructor(){
            super(null,null,true)

            this.messageDiv=new EmptyMessageDivForTest(this)

        }
        dispose(){}
        resetScene(){}
        clearScene(clearCamera=true,clearLights=true,clearSkybox=true):void{}
        addDefaultLight(){}
        getGrabberCamera(){return new EmptyGrabberCameraForTest() }
        addDefaultCamera(){}
        pushPeriodicAction(action:PeriodicAction):void{}
        set100(element:HTMLElement){}

    }

    export class EmptyGrabberCameraForTest{
        changePosition(position:XYZ,smoothMovement=true):void{}
        changeFrontDir(position:XYZ,smoothMovement=true):void{}
        changeUpVector(position:XYZ,smoothMovement=true):void{}
    }






}