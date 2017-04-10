/**
 * Created by vigon on 08/02/2017.
 */


module mathis{
    
    
    export module documentation{

        export enum Keywords {basic, tool, math, forDeveloper, proba}


        /**most of time, OnePage is a simple wrapper of SeveralParts, but is  can also contain an iframe*/
        export interface OnePage{
            pageIdAndTitle:string

            severalParts:SeveralParts
            /**what to do when user on page. Return the content */
            go():any
            /**what to do when user quit this page*/
            //bye?():void
        }

        /**most of time, OnePart is a simple wrapper of a PieceOfCode, but it can also contain a commentary*/
        export class OnePart{
            
            isVariant=false
            pieceOfCode:PieceOfCode
            binder:Binder


            $transformedPieceOfCode
            $playButton


            actionTest:()=>void
            endTest:()=>void


            name:string

            
            $comment
            
            
            constructor(){
                
            }
            
            fromComment($comment:any,name:string):OnePart{
                this.$comment=$comment
                this.name=name
                return this
            }
            
            fromPieceOfCode(pieceOfCode:PieceOfCode,isVariant=false):OnePart{
                this.pieceOfCode=pieceOfCode
                this.isVariant=isVariant
                this.name=pieceOfCode.$$$name
                return this
            }
            
            
        } 


        export class SeveralPages{

            $visual:any
            nbPages=0
            idToPage=new StringMap<OnePage>()
            idToLine=new StringMap<any>()
            
            lines:any[]

            constructor(private testMode){
                this.$visual=$('<div></div>')
            }
            

            addPage(onePage:OnePage,onlyForTest=false):void{

                if (onlyForTest&& !this.testMode) return

                this.nbPages++
                let line=$('<div class="mainMenuLine"></div>')
                line.text(this.nbPages+' : '+onePage.pageIdAndTitle)
                if (onlyForTest) line.css({color:'red'})

                this.$visual.append(line)

                if (this.idToPage.getValue(onePage.pageIdAndTitle)!=null) throw 'two OnePage have the same pageIdAndTitle:'+onePage.pageIdAndTitle
                this.idToPage.putValue(onePage.pageIdAndTitle,onePage)
                this.idToLine.putValue(onePage.pageIdAndTitle,line)
            }


            goToPage(onePage:OnePage,history_doNotPushState:boolean,activateFirstPart:boolean):void{
                $('#pageTitle').empty().text(onePage.pageIdAndTitle)
                $('#divForDemoSelects').empty()
                $('#demoChoice').empty()

                if (!history_doNotPushState) indexPage.navigator.pushState({type:'page',name:onePage.pageIdAndTitle})

                let content=onePage.go()
                if (activateFirstPart){
                    if (onePage.severalParts!=null) onePage.severalParts.activateMyFirstPart()
                }

                $('#pageContent').empty().append(content)//.hide().fadeIn()
                prettyPrint()

            }



            remakeHandlers():void{
                for (let id of this.idToPage.allKeys()){
                    this.idToLine.getValue(id).on('click touch',()=>{
                        this.goToPage(this.idToPage.getValue(id),false,true)
                    })
                }
            }


        }


        export class SeveralParts{

            allParts:OnePart[]=[]
            numberOrParts=0

            constructor(){}

            go(){

                let $visual=$('<div></div>')
                $visual.empty()
                for (let onePart of this.allParts){
                    if (onePart.pieceOfCode!=null) $visual.append(this.createPartWithPieceOfCode(onePart))
                    else $visual.append(onePart.$comment)
                }

                return $visual
            }


            activateMyFirstPart():void{
                /**la première partie qui n'est pas un commentaire est activée*/
                for (let onePart of this.allParts){
                    if (onePart.pieceOfCode!=null) {
                        this.clickInOnePlayButton(onePart,true,false)
                        break
                    }
                }
            }

            
            
            /**just to register*/
            addPart(pieceOfCode:PieceOfCode,isVariante=false){
                this.allParts.push(new OnePart().fromPieceOfCode(pieceOfCode,isVariante))
            }



            private createPartWithPieceOfCode(onePart:OnePart):any{

                this.numberOrParts++

                let $part=(onePart.isVariant) ? $('<div class="ChoicesPartVariante"></div>') : $('<div class="ChoicesPart"></div>')

                let $partHead=$('<div class="ChoicesPartHead"></div>')
                let $partContent=$('<div class="ChoicesPartContent"></div>')

                $part.append($partHead).append($partContent)

                onePart.$playButton=$('<div class="fa fa-play playButton"></div>')
                .on('click touch',()=>{this.clickInOnePlayButton(onePart,false,false)})
                if(indexPage.testMode) $partHead.append($('<span style="color: red">').text(onePart.pieceOfCode.$$$name+':'))
                $partHead.append(onePart.pieceOfCode.$$$title)
                $partHead.append(onePart.$playButton)


                let pieceOfCodeTransformer=new PieceOfCodeTransformer(onePart.pieceOfCode)
                onePart.$transformedPieceOfCode=pieceOfCodeTransformer.go()
                onePart.binder=new Binder(onePart.pieceOfCode,pieceOfCodeTransformer.allChoices,onePart.$transformedPieceOfCode)
                $partContent.append(onePart.binder.go())

                if (indexPage.testMode&&onePart.pieceOfCode.NO_TEST==null){
                    $partContent.append(new InteractiveTestBox(pieceOfCodeTransformer.allChoices,onePart).getVisual())

                }

                if (onePart.isVariant) onePart.$transformedPieceOfCode.hide()
                //onePart.$action = ()=>{onePart.pieceOfCode.goForTheFirstTime()}
                
                return $part
                
            }


            addComment($content:any,name:string):void{
                let $part= $('<div class="commentBetweenParts"></div>').append($content)
                this.allParts.push(new OnePart().fromComment($content,name))
            }

            
            clickInOnePlayButton(clickPart:OnePart,fromNavigator:boolean,rulesSelects:boolean):void{
                
                for (let onePart of this.allParts){
                    if (onePart.pieceOfCode!=null){
                        onePart.$transformedPieceOfCode.find('select').prop('disabled', true);
                        onePart.$playButton.removeClass("activePlayButton")
                        if (onePart.endTest!=null) onePart.endTest()
                    }
                }

                if (indexPage.testMode&& clickPart.actionTest!=null) clickPart.actionTest()

                indexPage.mathisFrame.messageDiv.empty()
                

                
                clickPart.$playButton.addClass("activePlayButton")
                clickPart.$transformedPieceOfCode.find('select').prop('disabled', false);
                if(clickPart.isVariant) clickPart.$transformedPieceOfCode.show()

                if (rulesSelects) clickPart.binder.setAllSelectsAccordingToPieceOfCode()
                clickPart.pieceOfCode.goForTheFirstTime()

                if (!fromNavigator) {
                    cc('IN click ')
                    indexPage.navigator.pushState({type:'part',name:clickPart.name,configuration:pieceOfCodeToConfiguration(clickPart.pieceOfCode)})
                }
                else{
                    let $toAnimate
                    if (clickPart.pieceOfCode!=null) $toAnimate=clickPart.$transformedPieceOfCode
                    else $toAnimate=clickPart.$comment
                    $('html, body').animate({
                        scrollTop: $toAnimate.offset().top -50 //Math.max($toAnimate.offset().top - 50,0)
                    }, 1000);
                }
                

            }


        }



        export class Navigator{

            //idToAction=new StringMap<()=>void>()
            idToParts=new StringMap<OnePart>()


            constructor(private severalPages:SeveralPages,private indexPage:IndexPage){
            }

            pushState(obj){
                cc("nouveau state pushed")
                let name='#'+encodeURI(JSON.stringify(obj))
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


            // registerPagesAndParts(){
            //
            //     for (let onePage of this.severalPages.idToPage.allValues()){
            //
            //         this.registerAndIndividualAction(onePage.pageIdAndTitle,()=>{this.severalPages.goToPage(onePage,true)})
            //
            //         let severalParts:SeveralParts=onePage.severalParts
            //
            //         if (onePage.severalParts!=null){
            //             for (let onePart of severalParts.allParts){
            //                 this.registerAndIndividualAction(onePart.name,()=>{
            //                     this.severalPages.goToPage(onePage,true)
            //                     severalParts.clickInOnePlayButton(onePart,true,true)
            //                 })
            //                 if(onePart.pieceOfCode!=null) this.idToPieceOfCode.putValue(onePart.name,onePart.pieceOfCode)
            //             }
            //         }
            //     }
            // }
            //
            // registerAndIndividualAction(id:string,action:()=>void){
            //     id=encodeURI(id)
            //     if (this.idToAction.getValue(id)!=null) throw "two similar ids"
            //     this.idToAction.putValue(id,action)
            // }
            //
            // makeAction(name:string):void{
            //     let action=this.idToAction.getValue(name)
            //     if (action==null) throw "no action associated with the keyword:"+name
            //     action()
            // }



            goTo(actionString:string){


                let action= JSON.parse(decodeURI(actionString).slice(1))


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
                                    for (let key of onePart.binder.allChoices.allKeys()){
                                        cc(key,onePart.binder.allChoices.getValue(key))
                                        onePart.pieceOfCode[key]=onePart.binder.allChoices.getValue(key).initialValueMemorized
                                    }
                                }
                                severalParts.clickInOnePlayButton(onePart,true,true)
                            }
                        }
                    }
                }
            }



        }




    }
    
}