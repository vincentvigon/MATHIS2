/**
 * Created by vigon on 23/12/2016.
 */


module mathis{


    export module documentation{
        
        export module conv{
            
            export var idForAttributeSelect=(key:string,pieceOfCodeName:string)=>key+'_of_'+pieceOfCodeName
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




        /**create one select for each $$$attributes for a piece of code
         * when select change, the action is fired (usualy action is the goChanging method of piece of code.
         * selects are add inside a $placesToPutSelects, usually the  pieceOfCode html-lised
         * */
        export class Binder{

            $placesToPutSelects:any
            allChoices:StringMap<Choices>


            pieceOfCode:PieceOfCode
            selectAndAroundClassName=null

            keyTo$select=new StringMap<HTMLSelectElement>()

            onConfigChange:()=>void



            constructor(pieceOfCode:PieceOfCode,allChoices:StringMap<Choices>,$placesToPutSelects:any){

                this.$placesToPutSelects=$placesToPutSelects
                //this.action=action
                this.allChoices=allChoices
                this.pieceOfCode=pieceOfCode

            }

            setAllSelectsAccordingToPieceOfCode(){

                for (let key of this.allChoices.allKeys()) {
                    let defaultIndex:number=null
                    let choices: Choices = this.allChoices.getValue(key)
                    let $select=this.keyTo$select.getValue(key)
                    for (let i = 0; i < choices.choices.length; i++) {
                        if (choices.choices[i] === null || this.pieceOfCode[key] === null) {
                            if (choices.choices[i] === null  && this.pieceOfCode[key] === null) defaultIndex = i
                        }
                        else {
                            /** important de passer par stringify et pas par toString: la méthode toString n'est pas forcément définie.
                             * et même si elle est définie, elle disparaît après  passage par la DB */

                            if (JSON.stringify(choices.choices[i]) == JSON.stringify(this.pieceOfCode[key])) defaultIndex = i
                            //cc(key,typeof this.pieceOfCode[key],choices.choices[i].toString() , this.pieceOfCode[key].toString())
                        }
                    }
                    if (defaultIndex != null) $select.selectedIndex = defaultIndex
                    else {
                        let allValuesString=""
                        for (let val of choices.choices) allValuesString+=JSON.stringify(val)+","
                        //cc(this.pieceOfCode)
                        //console.log('this.pieceOfCode[key]',this.pieceOfCode[key])
                        throw 'in the pieceOfCode:'+this.pieceOfCode.$$$name+', for the configuration-attribute:' + key + ', the value:' + JSON.stringify(this.pieceOfCode[key]) + ' does not appear in the possible choices:'+ allValuesString
                    }

                }
            }


            private go_fired=false
            go():any{
                if (this.go_fired) throw 'Binder.go can be fired only once'
                this.go_fired=true

                let $res=null
                if (this.$placesToPutSelects==null) $res=$('<div></div>')



                for (let key of this.allChoices.allKeys()) {
                    let choices:Choices=this.allChoices.getValue(key)
                    choices.initialValueMemorized=this.pieceOfCode[key]

                    let $textAndSelect=document.createElement("span")
                    if(this.selectAndAroundClassName!=null) $textAndSelect.className=this.selectAndAroundClassName
                    let $text = document.createElement("span")
                    if (choices.options.before!=null) $text.innerText = choices.options.before
                    let $select = document.createElement("select")
                    this.keyTo$select.putValue(key,$select)
                    $textAndSelect.appendChild($text)
                    $textAndSelect.appendChild($select)


                    for (let i = 0; i < choices.choices.length; i++) {
                        let option:HTMLOptionElement = document.createElement("option");
                        option.value = choices.choices[i];

                        let textOption=""
                        if (indexPage.testMode) textOption=key+":"

                        if(choices.options.visualValues!=null) {
                            textOption +=choices.options.visualValues[i]
                        }
                        else textOption+= choices.choices[i];

                        option.text=textOption



                        $select.appendChild(option);
                    }
                    // if(defaultIndex!=null) $select.selectedIndex=defaultIndex
                    // else throw 'for the configuration-attribute:'+key+' the value in the pieceOfCode:'+this.pieceOfCode[key]+' does not appear in the possible choices:'+JSON.stringify(choices.choices)


                    $select.onchange = ()=> {

                        /**...= $select.value serait peut-être mieux*/
                        this.pieceOfCode[choices.key]=choices.choices[$select.selectedIndex]


                        indexPage.navigator.pushState({type:'part',name:this.pieceOfCode.$$$name,configuration:pieceOfCodeToConfiguration(this.pieceOfCode)})


                        if (choices.options.onchange!=null) choices.options.onchange()
                        /**if no method onchange given, the default one is the .goChanging méthode of the pieceOfCode*/
                        else this.pieceOfCode.go()

                        if (this.onConfigChange!=null) this.onConfigChange()

                    }

                    /**if a $placesToPutSelects is given, then we put the select inside, at the right place
                     * if not, a div is create and all the select are sticked inside*/
                    if (this.$placesToPutSelects!=null){
                        this.$placesToPutSelects.find('#'+conv.idForAttributeSelect(key,this.pieceOfCode.$$$name)).empty().append($textAndSelect)
                    }
                    else {
                        $res.append($textAndSelect)
                    }

                }



                this.setAllSelectsAccordingToPieceOfCode()

                //this.selectObjectAttribute()
                if ($res!=null) return $res
                else if (this.$placesToPutSelects!=null) return this.$placesToPutSelects
                else throw 'hoj'
            }
        }



        export interface ChoicesOptions{
            before?:string
            visualValues?:string[]
            onchange?:()=>void
        }


        export class Choices {

            key:string //the attribute name
            choices

            initialValueMemorized
            //selectedValue

            options:ChoicesOptions


            constructor(choices, options:ChoicesOptions = null) {
                this.choices = choices
                if (options!=null) this.options=options
                else this.options={}

            }

            // initializeSelectedValue() {
            //     /**attention ici, peut-être se serait plus prudent de stocker une selectedKey ??? */
            //     this.selectedValue = this.initialValue
            // }

            // getInitialValueAsString()
            // {
            //     if (this.initialValue===null) return 'null'
            //     //else if (this.initialValue.toPrettyString != null) return this.initialValue.toPrettyString()
            //     else return this.initialValue.toString()
            // }
            //
            // __serialize():{[key:string]:any}{
            //     let res= {}
            //     res[this.key]=this.selectedValue
            //     return res
            // }


        }



        export interface PieceOfCode{
            goForTheFirstTime():void
            go():void
            /**attention, $$$name ne doit pas acontenir d'espace, car elle est utilisée comme nom de classe
             * par des éléments html*/
            $$$name:string
            $$$title?:string
            $$$creator?:string
            $$$keyWords?:Keywords[]

            //mathisFrame?:MathisFrame

            NO_TEST?:boolean
            NEED_SCENE?:boolean


            toIncludeAtTheBeginOfTheFirstHiddenPiece?:string[]
        }



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




        export function buildChoicesFromPieceOfCode(pieceOfCode:PieceOfCode):StringMap<Choices>{
            let res=new StringMap<Choices>()

            for (let $$$key in pieceOfCode){
                if (pieceOfCode.hasOwnProperty($$$key) && $$$key.slice(0,3)==conv.$$$) {

                    let key=$$$key.slice(3)
                    if (key!='name'&& key!='title' &&key!='creator'&&key!='keyWords') {

                        let choicesOb=pieceOfCode[$$$key]
                        if ($.isArray(choicesOb)) choicesOb=new Choices(choicesOb)
                        else if (!(choicesOb instanceof Choices)) throw "the attribute '$$$"+ key + "'  must be an array or of Type Choices because it start by 3$"

                        choicesOb.key = key

                        if (res.getValue(key)!=null) throw 'a configuration attribute is duplicated '
                        res.putValue(key, choicesOb)
                    }
                }
            }

            for (let key of res.allKeys()){
                /**pieceOfCode[key] doit être défini (il peut cependant avoir la valeur null )  */
                if (pieceOfCode[key]===undefined) throw 'no attribute associate to  $$$'+key
                //res.getValue(key).initialValue=pieceOfCode[key]
            }

            return res
        }


        export class PieceOfCodeTransformer{
            pieceOfCode:PieceOfCode
            allChoices=new StringMap<Choices>()
            //stringsToSuppress=["mathis."]


            constructor(pieceOfCode:PieceOfCode){
                this.pieceOfCode=pieceOfCode
            }

            private checkPieceOfCode(wholeText:string){
                for (let key of this.allChoices.allKeys()) { //.sort(sortAccordingToLength)
                    /**a regex for this.attribute*/
                    let re = new RegExp('\\bthis.' + key + '\\b', "g")
                    let match=wholeText.match(re);

                    if (match==null) logger.c("the configuration parameter:"+key+" never appears in the piece of code:"+this.pieceOfCode.$$$name)
                    else if (match.length>1)  throw "the configuration parameter:"+key+" appears more than on time in the piece of code:"+this.pieceOfCode.$$$name
                }
            }

            go():any{
                this.allChoices=buildChoicesFromPieceOfCode(this.pieceOfCode)
                
                let pieces=this.extractPiecesToShow()
                
                let res=$('<div></div>')
                for (let i=0;i<pieces.length;i++){
                    let piece=pieces[i]

                    /**automatic include some generic-lines at the very begin :
                     * if the first piece is "hidden", this generic-lines are joint to the hidden-piece.
                     * if not, a squizz box is created for the generic lines*/
                    if (i==0){
                        let toInclude=this.pieceOfCode.toIncludeAtTheBeginOfTheFirstHiddenPiece
                        if (toInclude==null) toInclude=conv.toIncludeAtTheBeginOfTheFirstHiddenPiece
                        if (toInclude!=null) {
                            if (!(toInclude instanceof Array)|| (typeof toInclude[0]!='string') ) throw 'must be an array of string'
                            let toIncludeWithSpaces:string[]=[]
                            for (let i=0;i<toInclude.length;i++){
                                toIncludeWithSpaces[i]=conv.spacesToSuppress+toInclude[i]
                            }

                            if (piece.type=='hidden'){
                                piece.piece=toIncludeWithSpaces.concat(piece.piece)
                            }
                            else{
                                let squiz=new SquizBox(false,"")
                                squiz.$squizable.append(this.transformOnePiece(toIncludeWithSpaces))
                                res.append(squiz.$visual)
                            }
                        }
                    }



                    if (piece.type=='show') res.append(this.transformOnePiece(piece.piece))
                    else if (piece.type=='test' && indexPage.testMode){
                        res.append(this.transformOnePiece(piece.piece,true))
                    }
                    else if (piece.type=='hidden'){
                        let squiz=new SquizBox(false,piece.title)
                        squiz.$squizable.append(this.transformOnePiece(piece.piece))
                        res.append(squiz.$visual)
                        
                        //res.append(this.transformOnePiece(piece.piece))
                    }
                }
                
                return res
                
            }


            private transformOnePiece(lines:string[],isTest=false):any{

                let newLines=[]
                for (let line of lines) newLines.push(line.slice(16))

                for (let i=0;i<newLines.length;i++){
                    if (newLines[i].slice(0,3)=="//n") {
                        newLines[i]=" "
                    }
                    for (let traitement of conv.traitementsForEachLine)  newLines[i]=traitement(newLines[i])
                }

                var newtext = newLines.join('\n');


                
                for (let key of this.allChoices.allKeys()){ //.sort(sortAccordingToLength)
                    /**a regex for this.attribute*/
                    let re = new RegExp('\\bthis.'+key+'\\b', "g")
                    let newtextSplited=newtext.split(re)
                    newtext= newtextSplited.join('<div class="selectableAttribute" id="'+conv.idForAttributeSelect(key,this.pieceOfCode.$$$name)+'"></div>')
                    //newtext= newtextSplited.join('<div class="selectableAttribute" id="'+conv.idForAttributeSelect(key,this.pieceOfCode.$$$name)+'">'+this.allChoices.getValue(key).getInitialValueAsString()+'</div>')
                }
                let $res=$('<pre class="prettyprint">'+newtext+'</pre>')
                if (isTest) {
                    $res.css({backgroundColor: '#f4ee78'})
                }

                return $res
            }



            private extractPiecesToShow():{'piece':string[];'type':string;'title'?:string}[]{
                /**on récupère le contenu de la méthode goChanging*/
                let wholeText=this.pieceOfCode.go.toString()

                this.checkPieceOfCode(wholeText)



                let lines=wholeText.split('\n')

                let indexOfBegin=[]
                let indexOfEnd=[]

                // function matchToBegin(line:string):boolean{
                //     let regex=new RegExp('^                \/\/\$\$\$(begin|b)( |\n).*')
                //     return regex.test(line)
                // }
                

                for (let i=0;i<lines.length;i++){
                    let line=lines[i]

                    let isTitle=/^                \/\/\$\$\$(beginHidden|bh) *./g.test(line)

                    if (/^                \/\/\$\$\$(begin|b)$/g.test(line))  indexOfBegin.push({'index':i,'type':'show'})
                    if (isTitle||/^                \/\/\$\$\$(beginHidden|bh)$/g.test(line)){
                        let title=""
                        if (isTitle){
                            let reg:any=/^                \/\/\$\$\$(beginHidden|bh) *./g
                            reg.exec(line)
                            title=line.slice(reg.lastIndex-1)
                        }
                        indexOfBegin.push({'index':i,'type':'hidden','title':title})
                    }
                    if (/^                \/\/\$\$\$(end|e)$/g.test(line)) indexOfEnd.push({'index':i,'type':'show'})
                    if (/^                \/\/\$\$\$(endHidden|eh)$/g.test(line)) indexOfEnd.push({'index':i,'type':'hidden'})

                    if (/^                \/\/\$\$\$(beginTest|bt)$/g.test(line))  indexOfBegin.push({'index':i,'type':'test'})
                    if (/^                \/\/\$\$\$(endTest|et)$/g.test(line)) indexOfEnd.push({'index':i,'type':'test'})
                }

                if (indexOfBegin.length!=indexOfEnd.length) throw 'not the same number of $$$begin and $$$end'
                
                let res=[]
                
                for (let i=0;i<indexOfBegin.length;i++){
                    let indexBegin=indexOfBegin[i].index
                    let typeBegin=indexOfBegin[i].type
                    let title=indexOfBegin[i].title

                    let indexEnd=indexOfEnd[i].index
                    let typeEnd=indexOfEnd[i].type
                    
                    if (indexEnd<=indexBegin) throw "an end before a begin"
                    if (typeBegin!=typeEnd) throw "$$$begin has type:"+typeBegin+" while $$$end has type:"+typeEnd


                    let piece=lines.slice(indexBegin+1,indexEnd)
                    res.push({'piece':piece,'type':typeBegin,'title':title})
                    
                }
                
                return res




                // let beginIndex=lines.indexOf('                //$$$begin')
                // let endIndex=lines.indexOf('                //$$$end')
                // lines=lines.slice(beginIndex+1,endIndex)
            }
            
        }

        
        class SquizBox{

            $squizButton:any;
            $squizable:any;
            $visual:any;
            $allTheHead:any
            $title:any

            constructor( private isOpen:boolean,$title:any){


                this.$visual=$('<div></div>');
                this.$squizable=$('<div class="squizable"></div>').appendTo(this.$visual)

                
                this.$title=$('<div class="ocGrey" style="display:inline-block"></div>').append($title);

                this.$squizButton= $('<div class="fa squizButton ocGrey"></div>');

                this.$allTheHead=$('<div class="docuPink"></div>')

                var $clickablePartOfTheHead=$('<div class="clickable inline"></div>')
                    .on('click touch',()=>{this.toggle()})
                    .append(this.$squizButton)
                    .append(this.$title)

                this.$allTheHead.append($clickablePartOfTheHead).prependTo(this.$visual)
                
                if (this.isOpen) this.open(false);
                else this.close(false);
                
            }



            getVisual():any{return this.$visual}

            close(slide:boolean){
                if (slide) this.$squizable.slideUp(); else this.$squizable.hide();
                this.isOpen=false;
                this.$squizButton.removeClass('fa-compress').addClass('fa-expand');

            }

            open(slide:boolean){
                if (slide) this.$squizable.slideDown(); else this.$squizable.show();
                this.isOpen=true;

                this.$squizButton.removeClass('fa-expand').addClass('fa-compress');
            }


            toggle(){
                if (this.isOpen) this.close(true);
                else this.open(true);

            }


        }







        export class APieceOfCodeForTest implements PieceOfCode{

            $$$name="part1"
            $$$title="Bonjour ici c'est ça"

            a=0
            $$$a=new Choices([0,1,2,3,4])

            aaa=new XYZ(12,2,3)
            $$$aaa=new Choices([new XYZ(12,2,3),new XYZ(0,0,3)])

            mlkajert="toto"
            $$$mlkajert=new Choices(["a","b","c","b","toto"])


            constructor() {
            }


            goForTheFirstTime(){
                console.log("we goChanging for the first time")
                this.go()
            }

            go() {

                let n=1234

                //$$$begin
                /**AAAAAAAAAAAAAAA*/
                let a=this.a
                let aze=this.mlkajert
                let roro=this.aaa
                let b=0
                let azeaze="mathis."
                let r=new mathis.Bilan()
                for (var k=0;k<4;k++){
                    b+=k
                }
                function qsd(){
                    return 4
                }
                //$$$end

                console.log(a,aze,roro)

            }
        }



    }
}