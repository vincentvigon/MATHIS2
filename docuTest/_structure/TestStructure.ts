/**
 * Created by vigon on 17/02/2017.
 */




module mathis{

    export module appli{

        //
        // function toto(){
        //
        //     /**attacher des normales à des vertex*/
        //     let vertexToNormal=new HashMap<Vertex,XYZ>()
        //
        //     let vertex=new Vertex()
        //     vertexToNormal.putValue(vertex,new XYZ(1,1,0))
        //     /**récupérer la normale*/
        //     let normal=vertexToNormal.getValue(vertex)
        //
        //
        //     /**indiquer qu'une arête orienté à déjà été parcourue*/
        //     let dejaParcours=new StringMap<boolean>()
        //     let vertex1=new Vertex()
        //     let vertex2=new Vertex()
        //
        //     dejaParcours.putValue(vertex1.hashNumber+","+vertex2.hashNumber,true)
        //
        // }


        function typeToColor(val):string{
            if (val===null) return 'green'
            if (typeof val ==='undefined') return 'grey'

            if(typeof val ==='number') return 'blue'
            if(typeof val ==='string') return 'black'
            if(typeof val ==='boolean') return 'orange'
            else return 'violet'
            //throw " type of "+ val + " is not accepted"
        }

        function typeToText(val):any{

            if (val===null) return 'null'
            if (typeof val ==='undefined') return 'undefined'
            return val

        }



        function configBox(config:any):any{
            let $res=$('<div style="margin-top: 1em;border-top:solid 1px black"></div>')
            for (let key in config){
                let $line=$('<div></div>')
                $line.appendTo($res)
                $('<span></span>').text(key+' : ').appendTo($line)
                $('<span></span>').text(typeToText(config[key])).css({color:typeToColor(config[key])}).appendTo($line)
            }
            return $res
        }


        /**the two following function are used in several classes*/
        function checkAttributes(configutationVersusSaved:boolean,username_DB:string,name:string,JS_list:string[],DB_list:string[],$container:any,callbackAfterDBchanging:()=>void,callbackSuppressTheWholePieceOfCode:()=>void,callbackWhenOK:()=>void,$toAddAfter=null){

            let $div=$('<div style="margin-top:1em"></div>')
            $div.appendTo($container)
            if (JSON.stringify(JS_list)!=JSON.stringify(DB_list)) {

                let $line=$('<div></div>')
                $line.appendTo($div)
                $('<span style="color:red"></span>').text(name).appendTo($line)
                $('<span style="color:blue"></span>').text(' by '+username_DB+':').appendTo($line)
                if(configutationVersusSaved) $('<span></span>').text("Configurations-attributes are different:").appendTo($line)
                else $('<span></span>').text("Saved-attributes are different:").appendTo($line)
                $('<div></div>').text('JS:'+JSON.stringify(JS_list)).appendTo($div)
                $('<div></div>').text('DB:'+JSON.stringify(DB_list)).appendTo($div)


                if (indexPage.identification.canAccess(username_DB)){
                    let $button=$('<button>CLEAR EXISTING TESTS</button>')
                    $button.on('click touch', () => {
                        indexPage.sendMessageAndWaitForReply(true,{type: 'suppressTheWholePieceOfCode', name: name},()=>{
                            $div.hide()
                            $button.addClass("clickable")
                            callbackSuppressTheWholePieceOfCode()
                        })

                    })
                    $button.appendTo($div)

                    let $rename = $('<div>RENAME IN DB:</div>')
                    $rename.appendTo($div)
                    let $newName = $('<input type="text">').val(name + '_old')
                    $newName.appendTo($rename)
                    let $button2=$('<button> GO </button>')
                    $button2.appendTo($rename)
                    $button2.on('click touch', () => {
                        indexPage.sendMessage(true,{
                            type: 'renameTheWholePieceOfCode',
                            name: name,
                            newName: $newName.val()
                        })
                        $div.hide()
                        callbackSuppressTheWholePieceOfCode()
                    }).addClass("clickable")

                    if (!configutationVersusSaved){
                        let $changeDB = $('<div></div>')
                        $changeDB.appendTo($div)
                        $('<button class="clickable">FIX THE DB</button>').on('click touch', () => {
                            indexPage.sendMessageAndWaitForReply(true, {
                                type: 'remakeSavedAttributes',
                                name: name,
                                goodSavedAttributes: JS_list
                            },()=>{
                                $div.hide()
                                if(callbackAfterDBchanging!=null) callbackAfterDBchanging()
                            })

                        }).appendTo($changeDB)

                    }
                }
                else $('<div style="color: red"></div>').text("only creator can edit").appendTo($div)
                //else $button2.addClass('disabled')

                if ($toAddAfter!=null) $div.append($toAddAfter)
            }
            else {
                //cc("OK in config att")
                callbackWhenOK()
            }
        }




        function initializatorAndAuthor(username_initializer:string,username_config:string){
            let $visual=$('<div>')
            let $initializatorDiv=$('<span>')
            $initializatorDiv.appendTo($visual)

            let equalYou=""
            if (indexPage.identification.getUsername()==username_initializer) equalYou+="=YOU"
            $('<span style="color:blue">').text(username_initializer+equalYou).appendTo($initializatorDiv)
            $('<span>').text(" initialized the series. ").appendTo($initializatorDiv)
            let $authorDiv=$('<span>')
            $authorDiv.appendTo($visual)
            if (username_config!=null){
                let equalYou=""
                if (indexPage.identification.getUsername()==username_config) equalYou+="=YOU"
                $('<span style="color:blue">').text(username_config+equalYou).appendTo($authorDiv)
                $('<span>').text(" created this test").appendTo($authorDiv)
            }
            else{
                $('<span style="color:blue">').text('NOBODY').appendTo($authorDiv)
                $('<span>').text(" created this test. DO IT !").appendTo($authorDiv)
            }
            return $visual

        }



        export class InteractiveTestBox{


            $divToCreateTest:any
            //savedValues:SavedValues
            private pieceOfCode:PieceOfCode
            private onePart:OnePart

            $$$keys=new StringMap<boolean>()


            constructor(
                        allChoices:StringMap<Choices>,
                        onePart:OnePart){

                this.pieceOfCode=onePart.pieceOfCode
                this.onePart=onePart

                for (let choice of allChoices.allValues()){
                    this.$$$keys.putValue(choice.key,true)
                }

                this.$divToCreateTest=$('<div style="border-top: solid 1px black; margin-top: 1em"></div>')

                this.onePart.actionTest=()=>{this.start()}
                this.onePart.endTest=()=>{this.$divToCreateTest.empty()}
                this.onePart.binder.onConfigChange=()=>{this.start()}


            }

            getVisual(){
                return this.$divToCreateTest
            }

            private start(){

                //this.onePart.$transformedPieceOfCode.find('select').prop('disabled', true);
                //this.onePart.$playButton.removeClass("activePlayButton").off()
                this.$divToCreateTest.empty()
                this.createMainButton()

                // let $testModeButton=$('<button class="clickable">TEST MODE</button>').on('click touch',()=>{
                //     this.onePart.$transformedPieceOfCode.find('select').prop('disabled', true);
                //     this.onePart.$playButton.removeClass("activePlayButton").off()
                //     this.$divToCreateTest.empty()
                //     this.createMainButton()
                // })
                // $testModeButton.appendTo(this.$divToCreateTest)



            }

            private createMainButton(){


                indexPage.sendMessageAndWaitForReply(false,
                    {type:'checkExisting',name:this.pieceOfCode.NAME},
                    (msg)=>{

                        if (msg.status=='nonExisting'){
                            $('<button class="clickable">INITIALIZE TEST</button>').on('click touch',()=>{
                                this.$divToCreateTest.empty().append(this.initialize())
                            }).appendTo(this.$divToCreateTest)
                        }
                        else if (msg.status=='existing'){
                            let JS_configAttributes=[]
                            for (let key of this.$$$keys.allKeys()){
                                JS_configAttributes.push(key)
                            }

                            checkAttributes(true,msg.username,this.pieceOfCode.NAME,JS_configAttributes.sort(),msg.configurationAttributes,this.$divToCreateTest,
                                /**callback after DB changing*/
                                ()=>{
                                    this.emptyAndRestart()
                                },
                                /**callback after suppress the whole piece of code*/
                                ()=>{
                                    this.emptyAndRestart()
                                },
                                /**callback when OK*/
                                ()=>{
                                    let JS_savedAttributes=[]
                                    for (let key in this.pieceOfCode){
                                        if ( key.substring(0,1)=='_') JS_savedAttributes.push(key)
                                    }

                                    checkAttributes(false,msg.username,this.pieceOfCode.NAME,JS_savedAttributes.sort(),msg.savedAttributes,this.$divToCreateTest,
                                        /**callback after DB changing*/
                                        ()=>{
                                            this.emptyAndRestart()
                                        },
                                        /**callback after suppress the whole piece of code*/
                                        ()=>{
                                            this.emptyAndRestart()
                                        },
                                        /**callback when OK*/
                                        ()=>{
                                            this.$divToCreateTest.empty().append(this.retrieveThenDevelopp())
                                        })

                                })


                        }


                        else throw "hoho"
                    })

            }


            private emptyAndRestart(){
                this.$divToCreateTest.empty()
                this.onePart.$transformedPieceOfCode.find('select').prop('disabled', false);
                this.onePart.$playButton.addClass("activePlayButton")
                this.start()
            }


            private initialize(){
                let configAttributes=[]
                for (let key of this.$$$keys.allKeys()){
                    configAttributes.push(key)
                }
                let savedAttributes=[]
                for (let key in this.pieceOfCode){
                    if (key.substring(0,1)=='_') savedAttributes.push(key)
                }

                indexPage.sendMessageAndWaitForReply(true,
                    {savedAttributes:savedAttributes,type:'initializeTest',name:this.pieceOfCode.NAME,creator:this.pieceOfCode.CREATOR,configurationAttributes:configAttributes},
                    (msg)=>{
                        /**msg.status is always 'ok' */
                        this.$divToCreateTest.empty().append(this.retrieveThenDevelopp())
                    })

            }



            private getConfiguration(){
                let $$$configuration={}
                for (let key of this.$$$keys.allKeys()){
                    $$$configuration[key]=this.pieceOfCode[key]

                    if (typeof this.pieceOfCode[key]=="function") throw "for test, a configuration value can not be a function"
                }
                return $$$configuration
            }


            private retrieveThenDevelopp(){

                indexPage.sendMessageAndWaitForReply(false,
                    {type:'retrieveSavedValues',name:this.pieceOfCode.NAME,configuration:this.getConfiguration()},
                    (msg)=>{
                        this.$divToCreateTest.append(this.developp(msg))
                    }
                )

            }


            private developp(msg):any{

                let savedValues=msg.saved

                /**si aucune value n'a été sauvée, le msg.saved est undefined*/
                if (savedValues==null) savedValues={}
                //console.log('savedValues',savedValues)
                //console.log('pieceOfCode',this.pieceOfCode)


                let $visual=$('<div></div>')


                $visual.append(initializatorAndAuthor(msg.username_initializer,msg.username_config))


                let canEditate=(msg.username_config==null||indexPage.identification.canAccess(msg.username_initializer)||indexPage.identification.canAccess(msg.username_config))


                configBox(this.getConfiguration()).appendTo($visual)

                let $attributes = $('<div>').appendTo($visual)


                for (let key in savedValues){
                    if (this.pieceOfCode[key]==null){
                        let $line=$('<div></div>').text(" '"+key+"' is in DB but not in JS")
                        $line.appendTo($visual)
                        let $button=$('<button class="clickable"></button>').text("remove attribute in DB").on('click touch',()=>{
                            indexPage.sendMessage(true,{type:'removeAttribute',attrib:key,name:this.pieceOfCode.NAME})
                            $button.hide()
                        })
                        $button.appendTo($line)

                    }
                }



                let checkBoxes=[]
                let $send=$('<button class="clickable">SEND</button>').hide()
                let $cansel=$('<button class="clickable">CANSEL</button>').hide()


                let $firstLine=$('<div class="lineAttribute"></div>').appendTo($attributes)
                $('<div class="firstColumn"></div>').text("attribute name").appendTo($firstLine)
                $('<div class="otherColumn"></div>').text("JS").appendTo($firstLine)
                $('<div class="otherColumn"></div>').text("DB").appendTo($firstLine)


                for (let key in this.pieceOfCode){
                    /**les champs à sauver  commencent par un underscore */
                    if(this.pieceOfCode.hasOwnProperty(key) && key.substring(0,1)=='_'){

                        let $oneLine=$('<div class="lineAttribute"></div>').appendTo($attributes)

                        let $firstColumn=$('<div class="firstColumn"></div>')
                        $firstColumn.appendTo($oneLine)


                        let $check=$('<input type="checkbox"/>')
                            .appendTo($firstColumn)
                            .val(key)
                            .change(function(){
                                $send.show()
                                $cansel.show()
                            })

                        $('<span>').text(key).appendTo($firstColumn)


                        checkBoxes.push($check)


                        let value=this.pieceOfCode[key]
                        let savedValue=savedValues[key]

                        let $value=$('<div class="otherColumn"></div>').text(typeToText(value)).appendTo($oneLine)
                        let $savedValue=$('<div class="otherColumn"></div>').text(typeToText(savedValue)).appendTo($oneLine)

                        if (JSON.stringify(savedValue)!==JSON.stringify(value)) $oneLine.css({backgroundColor:'red'})

                        $value.css({color:typeToColor(value)})
                        $savedValue.css({color:typeToColor(savedValue)})

                    }
                }


                //this.$messages=$('<div>').appendTo($visual)


                $send.on('click touch',()=>{

                    /**we change the savedValue only if user have check the checkbox*/
                    for (let checkBox of checkBoxes){
                        let key=checkBox.val()
                        if (checkBox.is(':checked')){
                            savedValues[key]=this.pieceOfCode[key]
                        }
                    }


                    indexPage.sendMessageAndWaitForReply(true,{type:'saveOneTest',name:this.pieceOfCode.NAME,configuration:this.getConfiguration(),saved:savedValues},(msg)=>{
                        this.emptyAndRestart()
                    })
                })

                $cansel.on('click touch',()=>{
                    this.emptyAndRestart()
                    //this.savedValues=null
                })


                let $lastLine=$('<div class="lineAttribute"></div>').appendTo($visual)


                if (canEditate) {
                    $cansel.appendTo($lastLine)
                    $send.appendTo($lastLine)
                }
                else $('<span style="color: red"></span>').text("only initializer and creator can edit").appendTo($lastLine)


                return $visual
            }


        }




        export class DoAllTestAndShowProblems{


            $visual:any
            constructor(){
                this.$visual=$('<div></div>')

            }


            private showException(e:ExceptionInformation,name:string,configuration:any){
                let $div=$('<div></div>')
                $div.appendTo(this.$visual)

                let $line=$('<div>')
                $line.appendTo($div)
                let tt=(configuration==null)?" ":" with this config:"+JSON.stringify(configuration)
                $('<span style="color:red"></span>').text(name+ ': exception'+tt).appendTo($line)

                $('<button class="clickable">').text('details in console').on('click touch',()=>{
                    console.log(e)
                }).appendTo($line)

                let text=(configuration==null)?'see pieceOfCode':"see this configuration"
                $('<button class="clickable">').text(text).on('click touch',()=>{
                    indexPage.navigator.goToPartWithSomeConfiguration(name, configuration)
                }).appendTo($line)
            }

            doAllTest(){
                let timeBegin=new Date().getTime()
                let $placeForDuration=$('<div>')
                $placeForDuration.appendTo(this.$visual)

                let bidonMathisFrame=new EmptyMathisFrameForFastTest()

                /**global variable, to stop all viewers*/
                deconnectViewerForTest=true

                let inDataBaseButNotInClient=new StringMap<string>()
                let inClientButNotInDataBase=new StringMap<boolean>()


                for (let key of indexPage.navigator.idToParts.allKeys()) {
                    let pieceOfCode=indexPage.navigator.idToParts.getValue(key).pieceOfCode
                    if (pieceOfCode.NO_TEST!=true) {
                        inClientButNotInDataBase.putValue(key,true)
                        try{
                            // let originalMathisFrame
                            // if (pieceOfCode.NEED_SCENE!=true) {
                            //     originalMathisFrame = (<any>pieceOfCode).mathisFrame
                            //     /**to avoid any interaction with the original mathisFrame*/
                            //     ;(<any>pieceOfCode).mathisFrame = bidonMathisFrame
                            // }
                            pieceOfCode.goForTheFirstTime()
                            //;(<any>pieceOfCode).mathisFrame=originalMathisFrame
                        }
                        catch (e){
                            this.showException(e,pieceOfCode.NAME,null)
                        }
                    }
                }


                indexPage.sendMessageAndWaitForReply(false,
                    {type:'retrieveAllSavedValues'},
                    (message)=>{


                        let counters={countOK:0,countKO:0}
                        for (let DB_item of message.items){


                            let part=indexPage.navigator.idToParts.getValue(DB_item._id)

                            if (part==null){
                                inDataBaseButNotInClient.putValue(DB_item._id,DB_item.username)
                            }
                            else {
                                let pieceOfCode=part.pieceOfCode
                                inClientButNotInDataBase.putValue(DB_item._id,false)


                                let JSconfigAttrib=[]
                                for (let key in pieceOfCode) {
                                    if (key.substring(0, 3) == '$$$') {
                                        JSconfigAttrib.push(key.slice(3))
                                    }
                                }


                                checkAttributes(true,DB_item.username,pieceOfCode.NAME,JSconfigAttrib.sort(),DB_item.configurationAttributes,this.$visual,
                                    /**callback after DB changing*/
                                    ()=>{

                                    },
                                    /**callback after suppress the whole piece of code*/
                                    ()=>{

                                    },
                                    /**callback when OK*/
                                    ()=>{
                                        let JS_savedAttributes=[]
                                        for (let key in pieceOfCode){

                                            if (key.substring(0,1)=='_') JS_savedAttributes.push(key)
                                        }

                                        checkAttributes(false,DB_item.username,pieceOfCode.NAME,JS_savedAttributes.sort(),DB_item.savedAttributes,this.$visual,null,
                                            ()=>{
                                            },
                                            ()=>{
                                                this.whenAttributesCoincide(DB_item,pieceOfCode,counters)
                                            },
                                            $('<button class="clickable"> see the pieceOfCode</button>').on('click touch', () => {
                                                indexPage.navigator.goToPartWithSomeConfiguration(DB_item._id,null)
                                            })
                                        )

                                    },
                                        $('<button class="clickable"> see the pieceOfCode</button>').on('click touch', () => {
                                            indexPage.navigator.goToPartWithSomeConfiguration(DB_item._id,null)
                                        })
                                )


                                //if (pieceOfCode.NEED_SCENE!=true) (<any>pieceOfCode).mathisFrame = originalMathisFrame
                            }


                        }

                        deconnectViewerForTest=false


                        $('<div style="border-top: solid 1px black"></div>').text('bilan: test OK:' +counters.countOK + ' | tests KO:'+counters.countKO).prependTo(this.$visual)

                        let count1=0
                        let $div1=$('<div></div>')
                        for (let key of inDataBaseButNotInClient.allKeys()){
                            count1++
                            let $line=$('<div></div>').text(key+", by:")
                            $('<span style="color: blue">').text(inDataBaseButNotInClient.getValue(key))
                            $line.appendTo($div1)

                            if (indexPage.identification.canAccess(inDataBaseButNotInClient.getValue(key))) {
                                let $button = $('<button class="clickable">suppress from DB</button>').on('click touch', () => {
                                    indexPage.sendMessageAndWaitForReply(true, {type: 'suppressTheWholePieceOfCode', name: key},()=>{
                                        $button.hide()
                                    })

                                })
                                $button.appendTo($line)
                            }


                        }
                        if (count1>0){
                            let $preDiv1=$('<div style="border-top: solid 1px black;margin-top:1em"></div>').text(count1+' pieceOfCode was registered in DB, but no such pieceOfCode in JS').appendTo(this.$visual)
                            $preDiv1.append($div1)
                        }

                        let count2=0
                        let $div2=$('<div></div>')
                        for (let key of inClientButNotInDataBase.allKeys()){
                            if(inClientButNotInDataBase.getValue(key)) {
                                count2++
                                let $line=$('<div></div>').text(key)
                                $line.appendTo($div2)
                                $('<button class="clickable"> see the pieceOfCode</button>').on('click touch', () => {
                                    indexPage.navigator.goToPartWithSomeConfiguration(key,null)
                                }).appendTo($line)
                            }
                        }
                        if (count2>0){
                            let $preDiv2=$('<div style="border-top:solid 1px black;margin-top:1em"></div>').text(count2+' pieceOfCode was in JS, but no corresponding tests in DB')
                                .appendTo(this.$visual)
                            $preDiv2.append($div2)
                        }


                    }
                )

                let duration=new Date().getTime()-timeBegin
                $placeForDuration.text("duration in millis:"+duration)

            }

            private whenAttributesCoincide(DB_item,pieceOfCode,counters):void{

                for (let key in DB_item) {
                    if (key.substring(0, 3) == 'ZZZ') {

                        let oneConfig = DB_item[key]


                        for (let k  in oneConfig.configuration) {
                            pieceOfCode[k] = oneConfig.configuration[k]
                        }
                        try {
                            pieceOfCode.goForTheFirstTime()


                            let configCountKO = 0
                            for (let k in pieceOfCode) {

                                if (k.substring(0, 1) == '_') {
                                    if (JSON.stringify(pieceOfCode[k]) === JSON.stringify(oneConfig.saved[k])) counters.countOK++
                                    else {

                                        counters.countKO++
                                        configCountKO++

                                        if (configCountKO == 1) {
                                            let $line = $('<div style="border-top: dashed 1px black"></div>')
                                            $line.appendTo(this.$visual)
                                            $('<span style="color:red"></span>').text(DB_item._id).appendTo($line)
                                            $('<span style="color:blue"></span>').text(' by ' + DB_item.username + " and " + oneConfig.username).appendTo($line)
                                            $('<span></span>').text(', config:' + JSON.stringify(oneConfig.configuration)).appendTo($line)
                                        }

                                        let $detail = $('<div></div>').appendTo(this.$visual)
                                        $('<span></span>').text(k + " -> DB:").appendTo($detail)
                                        $('<span></span>').text(typeToText(oneConfig.saved[k])).css({color: typeToColor(oneConfig.saved[k])}).appendTo($detail)
                                        $('<span></span>').text(" JS:").appendTo($detail)
                                        $('<span></span>').text(typeToText(pieceOfCode[k])).css({color: typeToColor(pieceOfCode[k])}).appendTo($detail)

                                    }
                                }
                            }

                            if (configCountKO > 0) {
                                let $line = $('<div></div>')
                                $line.appendTo(this.$visual)
                                $('<button class="clickable"> go to see this config</button>').on('click touch', () => {
                                    indexPage.navigator.goToPartWithSomeConfiguration(DB_item._id, oneConfig.configuration)
                                }).appendTo($line)
                            }
                        }
                        catch (e){

                            this.showException(e,DB_item._id,oneConfig.configuration)
                        }
                    }

                }
            }





        }








    }
}