/**
 * Created by vigon on 08/02/2017.
 */


module mathis{
    
    
    export module appli{


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
                this.name=pieceOfCode.NAME
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

            addSeparator(text,onlyForTest=false):void{

                if (onlyForTest&& !this.testMode) return

                $('<div style="margin-top: 3em;border-top: solid 2px red; border-bottom: dashed 1px red"></div>')
                    .text(text)
                    .appendTo(this.$visual)
            }




            goToPage(onePage:OnePage,history_doNotPushState:boolean,activateFirstPart:boolean):void{
                indexPage.eventManager.fireEvent(new Event('goToPage',onePage.pageIdAndTitle))

                $('#pageTitle').empty().text(onePage.pageIdAndTitle)
                // $('#divForDemoSelects').empty()
                // $('#demoChoice').empty()

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
                if(indexPage.testMode) $partHead.append($('<span style="color: red">').text(onePart.pieceOfCode.NAME+':'))
                $partHead.append(onePart.pieceOfCode.TITLE)
                $partHead.append(onePart.$playButton)
                let $afterPlayButton=$('<div class="afterPlayButton" style="text-align: right"></div>').appendTo($partHead)



                // for (let key in onePart.pieceOfCode){
                //     let field=onePart.pieceOfCode[key]
                //     if (field instanceof $Button$){
                //         $partHead.append(field.visual)
                //         field.visual.on('click touch',()=>{
                //             field.onClick()
                //         })
                //     }
                // }



                let pieceOfCodeTransformer=new PieceOfCodeTransformer(onePart.pieceOfCode)
                onePart.$transformedPieceOfCode=pieceOfCodeTransformer.go()

                onePart.binder=new Binder(onePart.pieceOfCode,onePart.$transformedPieceOfCode,indexPage.mathisFrame)
                if (indexPage.testMode) onePart.binder.addKeyOnTestOptions=true
                onePart.binder.containersToPutCommand.putValue('afterPlayButton',$afterPlayButton)
                onePart.binder.onConfigChange=()=>{
                    indexPage.navigator.pushState({
                        type: 'part',
                        name: onePart.pieceOfCode.NAME,
                        configuration: pieceOfCodeToConfiguration(onePart.pieceOfCode)
                    })
                }
                onePart.binder.go()
                $partContent.append(onePart.$transformedPieceOfCode)

                if (indexPage.testMode&&onePart.pieceOfCode.NO_TEST==null){
                    $partContent.append(new InteractiveTestBox(pieceOfCodeTransformer.pieceOfCode.COMMAND_DICO,onePart).getVisual())

                }

                if (onePart.isVariant) onePart.$transformedPieceOfCode.hide()
                //onePart.$action = ()=>{onePart.pieceOfCode.goForTheFirstTime()}
                
                return $part
                
            }


            addComment($content:any,name:string):void{
                let $part= $('<div class="commentBetweenParts"></div>').append($content)
                this.allParts.push(new OnePart().fromComment($part,name))
            }

            
            clickInOnePlayButton(clickPart:OnePart,fromNavigator:boolean,rulesSelects:boolean):void{

                indexPage.eventManager.fireEvent(new Event('clickInOnePlayButton',clickPart.name))


                for (let onePart of this.allParts){
                    if (onePart.pieceOfCode!=null){
                        onePart.$transformedPieceOfCode.find('select').prop('disabled', true);
                        //onePart.$playButton.removeClass("activePlayButton")
                        onePart.$playButton.css('opacity','0.5')
                        if (onePart.endTest!=null) onePart.endTest()
                    }
                }

                if (indexPage.testMode&& clickPart.actionTest!=null) clickPart.actionTest()


                
                //clickPart.$playButton.addClass("activePlayButton")
                clickPart.$playButton.css('opacity','1')
                clickPart.$transformedPieceOfCode.find('select').prop('disabled', false);
                if(clickPart.isVariant) clickPart.$transformedPieceOfCode.show()

                if (rulesSelects) clickPart.binder.setAllSelectsAccordingToPieceOfCode()
                clickPart.pieceOfCode.goForTheFirstTime()

                if (!fromNavigator) {
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






    }
    
}