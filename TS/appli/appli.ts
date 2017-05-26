/**
 * Created by vigon on 07/05/2017.
 */


module mathis{



    export module appli{

        export enum Keywords {basic, tool, math, forDeveloper, proba}


        export module conv{

            //export var idForAttributeSelect=(key:string,pieceOfCodeName:string)=>key+'_of_'+pieceOfCodeName
            export var $$$='$$$'

            export var spacesToSuppress='                '
            export var toIncludeAtTheBeginOfTheFirstHiddenPiece:string[]=["var mathisFrame=new mathis.MathisFrame()"]

            export var traitementsForEachLine:((line:string)=>string)[]=
                [
                    function(line:string){
                        return line.replace(/this.mathisFrame\./g,"mathisFrame\.")
                        //return line.replace(/mathis\./g,"")
                    }
                ]

            export var begin=["$$$begin","$$$b"]
            export var beginHidden=["$$$beginHidden","$$$bh"]
            export var end=["$$$end","$$$e"]
            export var endHidden=["$$$endHidden","$$$eh"]

        }


        export enum ChoicesOptionsType{select, button}

        export interface ChoicesOptions{
            type?:ChoicesOptionsType
            before?:any
            label?:any
            visualValues?:string[]
            /**if null, it is set to the go()-method of the parent pieceOfCode*/
            onchange?:()=>void
            containerName?:string
        }


        //export class Command{}

        export class Choices {

            key:string //the attribute name
            values:any[]
            initialValueMemorized:any
            options:ChoicesOptions


            constructor(values, options:ChoicesOptions = null) {

                this.values = values
                if (options!=null) this.options=options
                else this.options={}


                if (this.options.visualValues!=null&&values.length!=this.options.visualValues.length) throw "values.length and visualValues.length must be equal for:"+this.key


            }

            $select:HTMLSelectElement=null
            $button:$Button=null
            $parent:any

            // /**build by the Binder
            //  * it is :
            //  * - onConfigurationChange()
            //  * - options.onchange()  or go()
            //  *  */
            // $totalOnChange:()=>void


            // changePossibleValues(values:any[],visualValues:any[]=null,indexPage=null){
            //     if (visualValues!=null&&values.length!=visualValues.length) throw "values.length and visualValues.length must be equal for:"+this.key
            //     this.values=values
            //     if (visualValues!=null) this.options.visualValues=visualValues
            //
            //
            //     if (this.$select!=null) {
            //
            //         for (let i = 0; i < this.$select.options.length; i++) {
            //             this.$select.options[i] = null;
            //         }
            //
            //         for (let i = 0; i < this.values.length; i++) {
            //             let option: HTMLOptionElement = document.createElement("option");
            //             option.value = this.values[i];
            //
            //             let textOption = ""
            //             if (indexPage && indexPage.testMode) textOption = this.key + ":"
            //
            //             if (this.options.visualValues != null) {
            //                 textOption += this.options.visualValues[i]
            //             }
            //             else textOption += this.values[i];
            //             option.text = textOption
            //             this.$select.appendChild(option);
            //         }
            //     }
            //     else if (this.$button!=null){
            //         if (this.options.visualValues != null) this.$button.visualValues=this.options.visualValues
            //         else for (let i = 0; i < this.values.length; i++) {
            //             this.$button.visualValues.push(this.values[i])
            //         }
            //     }
            // }

            changeIndex(index:number){
                if (this.$select!=null) {
                    this.$select.selectedIndex=index
                    this.$select.onchange(null)
                }
                else if (this.$button!=null){
                    this.$button.selectedIndex=index
                    this.$button.onchange()
                    this.$button.updateVisual()
                }

                //this.$totalOnChange()
            }


            show(){
                this.$parent.show()
            }
            hide(){
                this.$parent.hide()
            }

        }


        export interface PieceOfCode{

            goForTheFirstTime():void
            go():void
            /**attention, NAME ne doit pas contenir d'espace, car elle est utilisée comme nom de classe
             * par des éléments html*/
            NAME:string
            TITLE?:string
            CREATOR?:string
            KEYWORDS?:Keywords[]
            NO_TEST?:boolean
            NEED_SCENE?:boolean

            COMMAND_DICO?:StringMap<Choices>

            toIncludeAtTheBeginOfTheFirstHiddenPiece?:string[]
        }


        export function buildCommandDico(pieceOfCode:PieceOfCode):void{

            //if (pieceOfCode.COMMAND_DICO!=null) return //throw "command dico was already made for the piece of code:"+pieceOfCode.NAME

            let res=new StringMap<Choices>()

            for (let $$$key in pieceOfCode){
                if (pieceOfCode.hasOwnProperty($$$key) && $$$key.slice(0,3)==conv.$$$) {

                    let key=$$$key.slice(3)
                    //if (key!='name'&& key!='title' &&key!='creator'&&key!='keyWords') {

                        let choicesOb=pieceOfCode[$$$key]
                        if ($.isArray(choicesOb)) {
                           choicesOb=new Choices(choicesOb)
                           pieceOfCode[$$$key]=choicesOb
                        }
                        else if (!(choicesOb instanceof Choices)) throw "the attribute '$$$"+ key + "'  must be an array or of Type Choices because it start by 3$"
                        choicesOb.key = key

                        if (res.getValue(key)!=null) throw 'a configuration attribute is duplicated '
                        res.putValue(key, choicesOb)
                    //}
                }
            }

            for (let key of res.allKeys()){
                /**pieceOfCode[key] doit être défini (il peut cependant avoir la valeur null )  */
                if (pieceOfCode[key]===undefined) throw 'no attribute associate to  $$$'+key
                //res.getValue(key).initialValue=pieceOfCode[key]
            }

            pieceOfCode.COMMAND_DICO=res
        }

        /**create one select for each $$$attributes for a piece of code
         * when select change, the action is fired (usualy action is the goChanging method of piece of code.
         * selects are add inside a $placesToPutSelects, usually the  pieceOfCode html-lised
         * */
        declare var jQuery

        export class Binder{


            selectAndAroundClassName=null
            private keyTo$select=new StringMap<HTMLSelectElement>()
            private keyTo$button=new StringMap<$Button>()

            onConfigChange:()=>void

            containersToPutCommand=new StringMap<any>()


            cleanContainerBefore=false



            /**only valid for the docuTestAppli*/
            //pushState=false


            /**only for the docuTest*/
            //indexPage:any//actually the type is described in the docuPage


            addKeyOnTestOptions=false
            rebuildCommandDico=true


            constructor(
                private pieceOfCode:PieceOfCode,
                private defaultContainer:any,private mathisFrame:MathisFrame){

                if (defaultContainer!=null) {
                    if (!(defaultContainer instanceof jQuery)) throw "defaultContainer must be null or a jQuery object"
                    if (defaultContainer.length!=1) throw "defaultContainer must contain a unique HTMLElement"

                }
                if (this.rebuildCommandDico||pieceOfCode.COMMAND_DICO==null) buildCommandDico(this.pieceOfCode)

                //if ($placesToPutSelects==null && $alreadyOrganisedPlace==null) throw "at least one of the two place must be non null"
            }

            setAllSelectsAccordingToPieceOfCode(){

                for (let key of this.pieceOfCode.COMMAND_DICO.allKeys()) {
                    let defaultIndex:number=null
                    let choices: Choices = this.pieceOfCode.COMMAND_DICO.getValue(key)
                    for (let i = 0; i < choices.values.length; i++) {
                        if (choices.values[i] === null || this.pieceOfCode[key] === null) {
                            if (choices.values[i] === null  && this.pieceOfCode[key] === null) defaultIndex = i
                        }
                        else {
                            /** important de passer par stringify et pas par toString: la méthode toString n'est pas forcément définie.
                             * et même si elle est définie, elle disparaît après  passage par la DB */

                            if (JSON.stringify(choices.values[i]) == JSON.stringify(this.pieceOfCode[key])) defaultIndex = i
                            //cc(key,typeof this.pieceOfCode[key],choices.choices[i].toString() , this.pieceOfCode[key].toString())
                        }
                    }
                    if (defaultIndex != null) {
                        let $select=this.keyTo$select.getValue(key)
                        if($select!=null) $select.selectedIndex = defaultIndex
                        else{
                            let $button=this.keyTo$button.getValue(key)
                            if ($button!=null) {
                                $button.selectedIndex=defaultIndex
                                $button.updateVisual()
                            }
                        }
                    }
                    else {
                        let allValuesString=""
                        for (let val of choices.values) allValuesString+=JSON.stringify(val)+","
                        throw 'in the pieceOfCode:'+this.pieceOfCode.NAME+', for the configuration-attribute:' + key + ', the value:' + JSON.stringify(this.pieceOfCode[key]) + ' does not appear in the possible choices:'+ allValuesString
                    }

                }
            }

            private go_fired=false


            go():void{

                if (this.go_fired) throw 'Binder.go can be fired only once'
                this.go_fired=true



                if (this.defaultContainer!=null){

                    this.containersToPutCommand.putValue('default',this.defaultContainer)
                }
                if (this.mathisFrame!=null){
                    this.containersToPutCommand.putValue('NW',this.mathisFrame.subWindow_NW.$visual)
                    this.containersToPutCommand.putValue('NE',this.mathisFrame.subWindow_NE.$visual)
                    this.containersToPutCommand.putValue('N',this.mathisFrame.subWindow_N.$visual)
                    this.containersToPutCommand.putValue('SW',this.mathisFrame.subWindow_SW.$visual)
                    this.containersToPutCommand.putValue('SE',this.mathisFrame.subWindow_SE.$visual)
                    this.containersToPutCommand.putValue('S',this.mathisFrame.subWindow_S.$visual)
                    this.containersToPutCommand.putValue('W',this.mathisFrame.subWindow_W.$visual)
                    this.containersToPutCommand.putValue('E',this.mathisFrame.subWindow_E.$visual)

                    if (this.containersToPutCommand.getValue('default')==null) this.containersToPutCommand.putValue('default',this.mathisFrame.subWindow_NW.$visual)
                }


                if (this.cleanContainerBefore){
                    for (let cont of this.containersToPutCommand.allValues()) cont.empty()
                }


                for (let key of this.pieceOfCode.COMMAND_DICO.allKeys()) {
                    let choices:Choices=this.pieceOfCode.COMMAND_DICO.getValue(key)
                    choices.initialValueMemorized=this.pieceOfCode[key]

                    /**automaticPlacing=true when no html with class=key was found*/
                    let automaticPlacing:boolean
                    let $container


                    if(choices.options.containerName!=null){
                        $container=this.containersToPutCommand.getValue(choices.options.containerName)
                        if ($container==null||$container.length==0) throw "the container name:"+choices.options.containerName+" has no corresponding container"
                    }
                    else $container=this.containersToPutCommand.getValue('default')


                    let $place=$container.find('.'+key)


                    if ($place==null||$place.length==0){
                        $place=$("<span>").addClass(key)
                        $container.append($('<div>').append($place))
                        automaticPlacing=true
                    }
                    else if ($place.length>1) throw "several places for the element with name:"+key
                    else if ($place.length==1) {
                        automaticPlacing=false
                    }


                    if(this.selectAndAroundClassName!=null) {
                        $place.addClass(this.selectAndAroundClassName)
                    }

                    choices.$parent=$place


                    let $text = $("<span>")
                    let before=(choices.options.before==null)?"":choices.options.before
                    let label=(choices.options.label==null)? key+":" : choices.options.label
                    if (automaticPlacing)$text.append(label).append(before)
                    else $text.append(before)


                    if (choices.options.type==null||choices.options.type==ChoicesOptionsType.select) {

                        choices.$select = document.createElement("select")

                        this.keyTo$select.putValue(key, choices.$select)
                        $place.append($text)
                        $place.append(choices.$select)


                        //choices.changePossibleValues(choices.values,null,this.indexPage)


                        for (let i = 0; i < choices.$select.options.length; i++) {
                            choices.$select.options[i] = null;
                        }

                        for (let i = 0; i < choices.values.length; i++) {
                            let option: HTMLOptionElement = document.createElement("option");
                            option.value = choices.values[i];

                            let textOption = ""
                            if (this.addKeyOnTestOptions) textOption = choices.key + ":"

                            if (choices.options.visualValues != null) {
                                textOption += choices.options.visualValues[i]
                            }
                            else textOption += choices.values[i];
                            option.text = textOption
                            choices.$select.appendChild(option);
                        }


                        choices.$select.onchange = () => {
                            /**...= $select.value serait peut-être mieux*/
                            this.pieceOfCode[choices.key] = choices.values[choices.$select.selectedIndex]
                            this.whenSelectOrButtonChange(choices)
                        }
                    }
                    else if (choices.options.type==ChoicesOptionsType.button) {

                        choices.$button = new $Button()
                        this.keyTo$button.putValue(key, choices.$button)
                        //$textAndSelect.append($text)
                        $place.append(choices.$button.$visual)


                        //choices.changePossibleValues(choices.values,null,this.indexPage)


                        if (choices.options.visualValues != null) choices.$button.visualValues=choices.options.visualValues
                        else for (let i = 0; i < choices.values.length; i++) {
                            choices.$button.visualValues.push(choices.values[i])
                        }


                        choices.$button.onchange = () => {
                            this.pieceOfCode[choices.key] = choices.values[choices.$button.selectedIndex]
                            this.whenSelectOrButtonChange(choices)
                            choices.$button.updateVisual()
                        }


                    }


                }

                this.setAllSelectsAccordingToPieceOfCode()

            }

            whenSelectOrButtonChange(choices:Choices){
                if (this.onConfigChange != null) this.onConfigChange()

                /**if no method onchange() given, the default one is the .go() méthode of the pieceOfCode*/
                if (choices.options.onchange != null) choices.options.onchange()
                else this.pieceOfCode.go()


            }

        }


        export class $Button{
            //values:any[]
            visualValues=[]
            selectedIndex=0

            onchange:()=>void

            $visual:any

            constructor(
            ){
                this.$visual=$('<div class="clickable appliButton"></div>')
                this.$visual.on('click touch',()=>{
                    this.increment()
                    this.onchange()

                })
            }



            private increment(){
                this.selectedIndex=(this.selectedIndex+1)%this.visualValues.length
            }

            updateVisual(){
                this.$visual.empty().append(this.visualValues[this.selectedIndex])
            }

        }



        //TODO : déplacer dans la docuTest

        export function pieceOfCodeToConfiguration(pieceOfCode:PieceOfCode):any{

            let res={}
            for (let $$$key in pieceOfCode){
                if ($$$key.slice(0,3)==conv.$$$) {
                    let key=$$$key.slice(3)
                    if (key!='name'&& key!='title' &&key!='creator'&&key!='keyWords') {
                        res[key]=pieceOfCode[key]
                    }
                }
            }
            return res
        }

        export function pieceOfCodeToSrotedConfigurationAttributes(pieceOfCode:PieceOfCode):string[]{

            let res:string[]=[]
            for (let $$$key in pieceOfCode){
                if ($$$key.slice(0,3)==conv.$$$) {
                    let key=$$$key.slice(3)
                    if (key!='name'&& key!='title' &&key!='creator'&&key!='keyWords') {
                        res.push(key)
                    }
                }
            }
            return res.sort()
        }



    }

}