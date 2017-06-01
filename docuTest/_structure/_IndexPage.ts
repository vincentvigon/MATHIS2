/**
 * Created by vigon on 19/11/2016.
 */

/**to work with the local server or the owh server*/
//var webSocketAddress='ws://MacBook-Pro-de-irma.local:1234'
var webSocketAddress='ws://92.222.90.196:1234'



declare function prettyPrint()

module mathis{

    export module appli{



        export class Enlarger{

            state=0
            max=4
            min=-4

            leftIsFullPage=false

            constructor(private $leftButton,private $rightButton,private $left,private $right){
                this.$leftButton.on('click touch',()=>{this.onclickLeft()})
                this.$rightButton.on('click touch',()=>{this.onclickRight()})
            }

            onclickLeft(){
                if (this.state>this.min){
                    this.state--
                    this.onStateChange()
                }
            }
            onclickRight(){
                if (this.state<this.max){
                    this.state++
                    this.onStateChange()
                }
            }

            equilibrate(){
                if (this.state!=0){
                    this.state=0
                    this.onStateChange()
                }
            }

            leftToFullPageTemporarily(){
                if (!this.leftIsFullPage) {
                    this.$left.css({width: "100%"})
                    this.$right.css({width: 0, left: "100%"})
                    this.leftIsFullPage = true
                }
                this.$leftButton.hide()
                this.$rightButton.hide()
            }

            endOfTemporarily(){
                if (this.leftIsFullPage) {
                    this.leftIsFullPage = false
                    this.$leftButton.show()
                    this.$rightButton.show()
                    this.onStateChange()
                }
            }

            
            onStateChange(){
                
                let leftWidth=Math.round(this.state-this.min)/(this.max-this.min)*100
                let rightWidth=100-leftWidth
                
                this.$left.css({width:leftWidth+"%"})
                this.$right.css({width:rightWidth+"%",left:leftWidth+"%"})
                this.$leftButton.css({right:rightWidth+"%"})
                this.$rightButton.css({left:leftWidth+"%"})
               
            }

        }


        export class IndexPage{

            enlarger:Enlarger
            navigator: Navigator
            mathisFrame:MathisFrame
            testMode:boolean

            /**only when testMode=true*/
            identification:Identification=null
            eventManager:EventManager


            protected severalPages:SeveralPages


            constructor(mathisFrame:MathisFrame,testMode:boolean){
                this.testMode=testMode
                this.severalPages=new SeveralPages(testMode)
                this.mathisFrame=mathisFrame
                this.enlarger=new Enlarger($('#enlargeLeft'),$('#enlargeRight'),$('#mainLeftCol'),$('#mainRightCol'))

                this.navigator=new Navigator(this.severalPages,this)

                this.eventManager=new EventManager(this)

            }


            go(){
                this.build()
                this.navigator.registerAllPieceOfCodes()

                /**when user click on the back arrow of the browser*/
                window.onpopstate = (event)=>{
                    /**parfois, quand on manipule les adresses dans la barre du navigateur,
                     * il fait un  "onpopstate" avec un event vide*/
                    if (event.state!=null) this.navigator.goTo(event.state)
                }

                if (this.testMode) {
                    this.connectToServerForTest()
                    setTimeout(()=>{
                        this.sendMessage(false,{type:"checkClientCanSendMessage"})
                    },1000)
                    this.identification=new Identification(this)
                    if (this.identification.getUsername()==null) this.identification.activateLoginBoxes()
                    else this.afterIdentification()
                }
                else this.afterIdentification()

            }


             afterIdentification(){

                if(this.testMode&& this.identification.getUsername()!=null) this.identification.activateAlreadyLoggedBox(this.identification.getUsername())

                /**if the ULR contain some hash that indicates a direct access to some state*/
                if (location.hash.length>0){
                    /**on est encore dans le constructeur d'indexPage. Donc la variable globale indexPage n'est pas encore attribuée*/
                    setTimeout(()=>{this.navigator.goTo(location.hash)},500)

                }
                else{
                    this.showMainIndex(false)
                }
                $('#logoMathis').on('click touch',()=>{this.showMainIndex(false)})
            }


            callbacksCatalogue=new StringMap<(msg)=>void>()
            ws:any
            private connectToServerForTest(){

                this.ws = new WebSocket(webSocketAddress, 'echo-protocol');

                this.ws.addEventListener("message", (e)=> {
                    // The data is simply the message that we're sending back
                    let msg = JSON.parse(e.data);


                    let key=msg.type+'|'+msg.timeMillis
                    if (this.callbacksCatalogue.getValue(key)!=null) {
                        console.log("message reçu du server avec callback",msg)
                        this.callbacksCatalogue.getValue(key)(msg)
                        this.callbacksCatalogue.removeKey(key)
                    }
                    else console.log("message reçu du server sans callback",msg)


                });

            }

            sendMessage(addUsernameAndPassword:boolean,message:any):void{
                if(addUsernameAndPassword){
                    let password=this.identification.getPassword()
                    let username=this.identification.getUsername()
                    if (password==null || username==null) throw 'password and username was not yet initialized'
                    message.username=username
                    message.password=password
                }

                console.log("message envoyé par le client:",message)
                this.ws.send(JSON.stringify(message));
            }

            sendMessageAndWaitForReply(addUsernameAndPassword,message:any,callback:(msg)=>void){
                message.timeMillis=new Date().getTime()
                this.sendMessage(addUsernameAndPassword,message)
                console.log(""+message.type+'|'+message.timeMillis)
                this.callbacksCatalogue.putValue(message.type+'|'+message.timeMillis,callback) //[message.type]=callback

            }

            /**2 indexPages: la vrai et la bidon pour les test. La difference est dans le build*/
            protected build(){
                throw 'to override'
            }


            showMainIndex(fromNavigator:boolean){

                this.eventManager.fireEvent(new Event('showMainIndex'))


                if (!fromNavigator) {
                    this.navigator.pushState({type:'index'})
                }

                let $pageTitle=$('#pageTitle').empty().text("Main menu")
                this.enlarger.endOfTemporarily()

                let $pageContent=$("#pageContent").empty()

                if (this.testMode) {

                        $pageContent.append(this.severalPages.$visual)
                        this.severalPages.remakeHandlers()

                        let $fireAllTest = $('<button class="clickable">FIRE ALL TESTS</button>').on('click touch', () => {
                            $pageContent.empty()
                            let doAllTestAndShowProblems = new DoAllTestAndShowProblems()
                            doAllTestAndShowProblems.$visual.appendTo($pageContent)
                            doAllTestAndShowProblems.doAllTest()
                            //$fireAllTest.hide()
                        }).prependTo($pageContent)
                }
                else{
                    $pageContent.empty().append(this.severalPages.$visual)
                    this.severalPages.remakeHandlers()
                    startDemo(this.mathisFrame)
                }
            }
        }


        export class Identification{


            constructor(private indexPage:IndexPage){}


            activateLoginBoxes(){
                let $pageContent=$("#pageContent")
                $pageContent.empty()
                this.loginBox($pageContent,false)
                this.loginBox($pageContent,true)
                this.indexPage.navigator.pushState({type:'login'})

            }

            private loginBox($container,newOne:boolean):void{
                // if (newOne) {
                //     $('<div style="color: red">').appendTo($container)
                //         .text("Password are not hashed")
                // }
                let $res=$('<div>').appendTo($container)
                if (newOne) {
                    $('<div>').appendTo($res)
                        .append('Create new user.')
                        .append('<span style="color: red"> Passwords are not hashed :-(</span>')
                }
                else $('<div>').text('login as existing user:').appendTo($res)
                let $username=$('<input content="text">').attr('placeholder', 'username')
                $username.appendTo($res)
                let $password=$('<input content="text">').attr('placeholder', 'password')
                $password.appendTo($res)
                let $email
                if (newOne){
                    $email=$('<input content="text">').attr('placeholder', 'email')
                    $email.appendTo($res)
                }

                $('<button>').text('send').on('click touch',()=>{
                    var msg_go
                    if (!newOne) {
                        msg_go={type:'loginExisting', username:$username.val(),password:$password.val()}
                    }
                    else {
                        msg_go={type:'loginNewUser', username:$username.val(),password:$password.val(),email:$email.val()}
                    }
                    this.indexPage.sendMessageAndWaitForReply(false,msg_go,(msg_back)=>{

                        if (newOne){

                            if (msg_back.status=='ok'){
                                this.setUsername(msg_go.username)
                                this.setPassword(msg_go.password)

                                this.indexPage.afterIdentification()
                            }
                            else{
                                $container.empty()
                                $container.append($('<div style="background-color: red">').text(msg_back.status))
                                this.loginBox($container,false)
                                this.loginBox($container,true)
                            }

                        }
                        else {
                            if(msg_back.status=='noSuchUser'){
                                $container.empty()
                                $container.append($('<div style="background-color: red">').text("NO SUCH USER"))
                                this.loginBox($container,false)
                                this.loginBox($container,true)
                            }
                            else if(msg_back.status=='passwordNonOK'){
                                $container.empty()
                                $container.append($('<div style="background-color: red">').text("PASSWORD NON OK"))
                                this.loginBox($container,false)
                                this.loginBox($container,true)
                            }
                            else{
                                this.setUsername(msg_go.username)
                                this.setPassword(msg_go.password)
                                this.indexPage.afterIdentification()
                            }
                        }


                    })
                }).appendTo($res)

            }

             activateAlreadyLoggedBox(username:string):void{

                let $res=$('<div class="alreadyLoggedBox">').appendTo($('body'))

                $('<span>').text("logged as: "+username).appendTo($res)
                $('<button>').text("change").on('click touch',()=>{
                    $res.remove()
                    localStorage.setItem("username", null);
                    localStorage.setItem("password", null);
                    this.activateLoginBoxes()
                }).appendTo($res)

            }


            getUsername():string{
                if (localStorage.getItem("username")==null||localStorage.getItem("username")=='undefined'||localStorage.getItem("username")=='null') return null
                return localStorage.getItem("username")
            }
            getPassword():string{
                if (localStorage.getItem("password")==null||localStorage.getItem("password")=='undefined'||localStorage.getItem("password")=='null') return null
                return localStorage.getItem("password")
            }
            setUsername(username):void{
                localStorage.setItem("username",username.toLowerCase())
            }
            setPassword(password):void{
                localStorage.setItem("password",password)
            }

            canAccess(username_DB):boolean{
                let username=this.getUsername()
                if (username=="vincent") return true
                if (username==null) return false
                if (username==username_DB) return true
            }



        }



        export class Navigator{

            idToParts=new StringMap<OnePart>()

            constructor(private severalPages:SeveralPages,private indexPage:IndexPage){
            }

            pushState(obj){
                //let name='#'+encodeURI(JSON.stringify(obj))
                let name='#'+JSON.stringify(obj)

                history.pushState(name,name,name)
            }

            registerAllPieceOfCodes(){

                for (let onePage of this.severalPages.idToPage.allValues()){
                    let severalParts:SeveralParts=onePage.severalParts
                    if (onePage.severalParts!=null){
                        for (let onePart of severalParts.allParts){
                            if(onePart.pieceOfCode!=null) this.idToParts.putValue(onePart.name,onePart)
                        }
                    }
                }
            }


            goTo(actionString:string){

                indexPage.mathisFrame.cleanAllPeriodicActions()

                /**on enlève le '#' et l'on parse la string*/
                let action= JSON.parse(actionString.slice(1))


                if (action.type==null) throw 'in navigator, action :'+actionString+', has no type'
                else if (action.type=='part'){
                    this.goToPartWithSomeConfiguration(action.name,action.configuration)
                }
                else if (action.type=='page'){
                    this.goToPage(action.name)
                }
                else if (action.type=='index'||action.type=='login'){
                    this.indexPage.showMainIndex(true)
                }
                else console.log("no action for state:"+action.type)
            }


            goToPage(pageName:string):void{

                for (let onePage of this.severalPages.idToPage.allValues()){
                    if (onePage.pageIdAndTitle==pageName) {
                        this.severalPages.goToPage(onePage,true,true)
                    }
                }
            }


            goToPartWithSomeConfiguration(partName:string,config:any):void{

                for (let onePage of this.severalPages.idToPage.allValues()){

                    let severalParts:SeveralParts=onePage.severalParts

                    if (onePage.severalParts!=null){
                        for (let onePart of severalParts.allParts){
                            if (onePart.name==partName){
                                this.severalPages.goToPage(onePage,true,false)

                                if (config!=null) {
                                    for (let key in config) {
                                        onePart.pieceOfCode[key] = config[key]
                                    }
                                }
                                else {
                                    for (let key of onePart.pieceOfCode.COMMAND_DICO.allKeys()){
                                        //cc(key,onePart.binder.allChoices.getValue(key))
                                        onePart.pieceOfCode[key]=onePart.pieceOfCode.COMMAND_DICO.getValue(key).initialValueMemorized
                                    }
                                }
                                severalParts.clickInOnePlayButton(onePart,true,true)
                            }
                        }
                    }
                }
            }

        }


        export class Event{
            from="inside"
            constructor(
                public name:string,public precision?:string
            ){}
        }

        export class EventManager{

            constructor(private indexPage:IndexPage){}

            fireEvent(event:Event){

                let precision=event.precision||""
                cc('new event:',event.name,precision)


                switch (event.name){




                    case 'changeDemo':{
                        this.fireEvent(new Event('theViewChange'))
                    }
                    break

                    case 'goToPage':{
                        $('#demoChoice').empty()
                        this.fireEvent(new Event('theViewChange'))

                    }
                    break


                    case 'clickInOnePlayButton':{
                        this.fireEvent(new Event('theViewChange'))
                    }
                        break

                    case 'showMainIndex':{
                        $('#demoChoice').empty()
                        this.fireEvent(new Event('theViewChange'))
                    }
                        break


                    case 'theViewChange':{
                        this.indexPage.mathisFrame.messageDiv.empty()
                        this.indexPage.mathisFrame.emptyAllCorner()
                        indexPage.mathisFrame.cleanAllPeriodicActions()
                    }
                    break
                }
            }
        }



        class MainIndexPage extends IndexPage{


            constructor(mathisFrame:MathisFrame,testMode:boolean){
                super(mathisFrame,testMode)
            }

            build(){

                this.severalPages.addPage(new WhyBlabla(this.mathisFrame))
                this.severalPages.addPage(new PureJavascriptTuto())
                this.severalPages.addPage(new TypescriptTuto())
                this.severalPages.addPage(new SimpleObjectsPage(this.mathisFrame))
                this.severalPages.addPage(new BasicDocu(this.mathisFrame))
                this.severalPages.addPage(new ReseauDocu(this.mathisFrame))
                this.severalPages.addPage( new SurfaceDocu(this.mathisFrame))
                this.severalPages.addPage( new LinksDocu(this.mathisFrame))
                this.severalPages.addPage(new MacamDocu(this.mathisFrame))
                this.severalPages.addPage( new VerticesViewingDocu(this.mathisFrame))
                this.severalPages.addPage( new LinesViewingDocu(this.mathisFrame))
                this.severalPages.addPage( new LinksViewingDocu(this.mathisFrame))
                this.severalPages.addPage(new SurfaceViewerDocu(this.mathisFrame))
                this.severalPages.addPage(new GradientColorDocu(this.mathisFrame))

                this.severalPages.addPage(new GraphDistance(this.mathisFrame))
                this.severalPages.addPage(new GrateMergeStick(this.mathisFrame))
                this.severalPages.addPage( new DichoDocu(this.mathisFrame))

                this.severalPages.addSeparator("CONSTRUCTIONS EXAMPlE")
                //this.severalPages.addPage( new SolidsDocu(this.mathisFrame))

                this.severalPages.addPage( new FractalPage(this.mathisFrame))


                this.severalPages.addPage( new TorusPlatonicDocu(this.mathisFrame))
                // this.severalPages.addPage( new RandomGraphDocu(this.mathisFrame))



                /**for coder*/
                this.severalPages.addSeparator("FOR COLLABORATORS")
                this.severalPages.addPage( new ColaborateWithGit())
                this.severalPages.addPage( new DocutestTuto())
                this.severalPages.addPage( new DocutestTutoAdvanced())


                /**pure test*/
                this.severalPages.addSeparator("PURE TEST (NO DOCU)",true)
                this.severalPages.addPage( new Creation2dDocu(this.mathisFrame),true)

                // this.severalPages.addSeparator("GUILLAUME'S PAGES",true)
                // this.severalPages.addPage( new ConnectorTest(this.mathisFrame),true)

            }
        }

        export var indexPage:IndexPage

        export function startSite(){
            let mathisFrame=new MathisFrame('placeForMathis')
            /**Attention : la variable globale indexPage est affectée APRES la construction de MainIndexPage.
             * Pour toutes les opérations qui se font pendant la construction, indexPage est null ! */
            indexPage=new MainIndexPage(mathisFrame,false)

            indexPage.go()

        }








    }



}