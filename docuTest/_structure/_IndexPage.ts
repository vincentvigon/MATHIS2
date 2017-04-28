/**
 * Created by vigon on 19/11/2016.
 */

/**to work with the local server or the owh server*/
//var webSocketAddress='ws://MacBook-Pro-de-irma.local:1234'
var webSocketAddress='ws://92.222.90.196:1234'



declare function prettyPrint()

module mathis{

    export module documentation{

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


            protected severalPages:SeveralPages


            constructor(mathisFrame:MathisFrame,testMode:boolean){
                this.testMode=testMode
                this.severalPages=new SeveralPages(testMode)
                this.mathisFrame=mathisFrame
                this.enlarger=new Enlarger($('#enlargeLeft'),$('#enlargeRight'),$('#mainLeftCol'),$('#mainRightCol'))

                this.navigator=new Navigator(this.severalPages,this)

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

    }



}