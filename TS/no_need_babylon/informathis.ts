/**
 * Created by vigon on 16/12/2015.
 */


module mathis{



    export function allIntegerValueOfEnume(MyEnum:any):number[]{
        let res:number[]=[]
        for (var prop in MyEnum) {
            if (MyEnum.hasOwnProperty(prop)){
                let i=parseInt(prop)
                if (!isNaN(i)) res.push(i)
            }
        }
        return res
    }

    export function allStringValueOfEnume(MyEnum:any):string[]{
        let res:string[]=[]
        for (var prop in MyEnum) {
            if (MyEnum.hasOwnProperty(prop) &&
                (isNaN(parseInt(prop)))) {
                res.push(prop)
            }
        }
        return res
    }
    
    
    /**logging*/
    // export class Logger{
    //
    //     showTrace=false
    //
    //
    //     private alreadyWroteWarning:number[]=[]
    //
    //     c(message:string,maxTimesFired=1){
    //
    //         if(this.alreadyWroteWarning[message]!=null) this.alreadyWroteWarning[message]++
    //         else this.alreadyWroteWarning[message]=1
    //
    //         if(this.alreadyWroteWarning[message]<=maxTimesFired) {
    //
    //             if (this.showTrace){
    //                 let err = <any> new Error();
    //                 console.log("WARNING", message,'...........................................',err)
    //             }
    //             else {
    //                 console.log("WARNING", message)
    //             }
    //         }
    //     }
    //
    // }

    export module logger{

        export var showTrace=false


        var  alreadyWroteWarning:number[]=[]

        export function c(message:string,maxTimesFired=1){

            if(alreadyWroteWarning[message]!=null) alreadyWroteWarning[message]++
            else alreadyWroteWarning[message]=1

            if(alreadyWroteWarning[message]<=maxTimesFired) {

                if (showTrace){
                    let err = <any> new Error();
                    console.log("WARNING", message,'...........................................',err)
                }
                else {
                    console.log("WARNING", message)
                }
            }
        }

    }
    

    
    export function roundWithGivenPrecision(value:number,nbDecimal:number):number{
        value*=Math.pow(10,nbDecimal)
        value=Math.round(value)
        value/=Math.pow(10,nbDecimal)
        return value
    }



    


    export function applyMixins(derivedCtor: any, baseCtors: any[]) {
        baseCtors.forEach(baseCtor => {
            Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
                if (name !== 'constructor') {
                    derivedCtor.prototype[name] = baseCtor.prototype[name];
                }
            });
        });
    }


    





    /** from http://www.javascripter.net/faq/stylesc.htm
     *
     auto        move           no-drop      col-resize
     all-scroll  pointer        not-allowed  row-resize
     crosshair   progress       e-resize     ne-resize
     default     text           n-resize     nw-resize
     help        vertical-text  s-resize     se-resize
     inherit     wait           w-resize     sw-resize
     * */

    export function setCursorByID(id,cursorStyle) {
        var elem;
        if (document.getElementById &&
            (elem=document.getElementById(id)) ) {
            if (elem.style) elem.style.cursor=cursorStyle;
        }
    }


    export class Bilan {

        private millisDep:number
        private millisDuration=0
        private nbTested=0
        private nbOK=0
        
        constructor() {
            this.millisDep = performance.now()
        }

        private computeTime():void {
            this.millisDuration = performance.now() - this.millisDep
        }

        add(bilan:Bilan) {
            bilan.computeTime()
            this.nbTested += bilan.nbTested
            this.nbOK += bilan.nbOK
            this.millisDuration += bilan.millisDuration
        }

        assertTrue(ok:boolean){
            this.nbTested++
            if (ok) this.nbOK++
            else {
                var e =<any> new Error();
                console.log(e.stack);
            }
        }

        toString(){
            return 'nbTest:'+this.nbTested+', nbOK:'+this.nbOK+', millisDuration:'+this.millisDuration.toFixed(2)
        }
        
        

    }



    export function modulo(i:number,n:number,centered=false):number{
        if (n<0) throw 'second arg must be positif'

        let res=0
        if (i>=0) res= i%n;
        else res= n-(-i)%n

        if (centered&& res>n/2) res= res-n

        if (Math.abs(res-n)<Number.MIN_VALUE*10) res=0

        return res

    }


    /**Fisher-Yates shuffle*/
    export function shuffle(array) {
        var counter = array.length, temp, index;

        // While there are elements in the array
        while (counter > 0) {
            // Pick a random index
            index = Math.floor(Math.random() * counter);

            // Decrease counter by 1
            counter--;

            // And swap the last element with it
            temp = array[counter];
            array[counter] = array[index];
            array[index] = temp;
        }

        return array;
    }


    export interface HasHashString{
        hashString:string
    }

    export class Entry<K extends HasHashString,T>{
        key:K
        value:T
        constructor(key:K,value:T){
            this.key=key
            this.value=value
        }
    }

    export class HashMap<K extends HasHashString,T>{

        private values:{[hashString:string]:T}={}
        private keys:{[hashString:string]:K}={}

        memorizeKeys:boolean
        

        constructor(memorizeKeys=false){
            this.memorizeKeys=memorizeKeys
        }

        putValue (key:K,value:T,nullKeyForbidden=true):void{
            if (key==null) {
                if(nullKeyForbidden) throw 'key must be non null'
                else return null
            }
            this.values[key.hashString]=value
            if (this.memorizeKeys) this.keys[key.hashString]=key
        }

        removeKey(key:K):void{
            delete this.values[key.hashString]
            if (this.memorizeKeys) delete this.keys[key.hashString]
        }

        getValue(key:K,nullKeyForbidden=true):T{
            if (key==null) {
                if(nullKeyForbidden) throw 'key must be non null'
                else return null
            } 
            return this.values[key.hashString]
        }

        allValues():T[]{
            let res=new Array<T>()
            for (let index in this.values) res.push(this.values[index])
            return res

        }


        oneValue():T{
            for (let index in this.values) {
                return this.values[index]
            }
            return null
        }



            allKeys():K[]{
            if (!this.memorizeKeys) throw 'this hashMap has not memorized keys. Please, put args=true in the constructor'
            let res=new Array<K>()
            for (let index in this.keys) res.push(this.keys[index])
            return res
        }

        allEntries():Entry<K,T>[]{
            if (!this.memorizeKeys) throw 'this hashMap has not memorized keys. Please, put args=true in the constructor'

            let res:Entry<K,T>[]=[]
            for (let index in this.keys) res.push(new Entry(this.keys[index],this.values[index]) )
            return res
        }


        aRandomValue():T{
            let keys=Object.keys(this.values)
            return this.values[keys[ Math.floor(keys.length * Math.random())]]
        }
        
        
        
        extend(otherHashMap:HashMap<K,T>):void{
            
            if (!otherHashMap.memorizeKeys ) throw "cannot extend this  with a HashMap which do not memorize keys"
            
            for (let entry of otherHashMap.allEntries()){
                this.putValue(entry.key,entry.value)
            }
            
            
        }



        size():number{
            let res=0
            for (let key in this.values) res++
            return res
        }

        printMe(toStringFuncForValues:(value:T)=>string):string{
            let res="[";
            for (let key in this.values){
                res+=key+">"+toStringFuncForValues(this.values[key])+","
            }
            res+="]"

            return res
        }


        // toString():string{
        //    
        //     // let res=''
        //     // this.allKeys().forEach(key=>{
        //     //     res+=key.hashString+":"+this.getValue(key)
        //     // })
        //
        //     return JSON.stringify(this.values)
        //
        // }


    }


    export class StringMap<T>{

        private values:{[key:string]:T}={}

        putValue (key:string,value:T,nullKeyForbidden=true):void{
            if (key==null) {
                if(nullKeyForbidden) throw 'key must be non null'
                else return null
            }
            this.values[key]=value
        }

        removeKey(key:string):void{
            delete this.values[key]
        }
        
        
        getValue(key:string,nullKeyForbidden=true):T{
            if (key==null) {
                if(nullKeyForbidden) throw 'key must be non null'
                else return null
            }
            return this.values[key]
        }

        allValues():T[]{
            let res=new Array<T>()
            for (let index in this.values) res.push(this.values[index])
            return res
        }

        oneValue():T{
            for (let index in this.values) {
                return this.values[index]
            }
            return null
        }



        allKeys():string[]{
            // let res:string[]=[]
            // for (let key in this.values) res.push(key)
            // return res
            return Object.keys(this.values)
        }

        aRandomValue():T{
            let keys=Object.keys(this.values)
            return this.values[keys[ Math.floor(keys.length * Math.random())]]
        }

        
        size():number{
            let res=0
            for (let key in this.values) res++
            return res
        }


        __serialize():{[key:string]:T}{return this.values}

        __load(values:any){this.values=values}



        // toString():string{
        //
        //     // let res=''
        //     // this.allKeys().forEach(key=>{
        //     //     res+=key.hashString+":"+this.getValue(key)
        //     // })
        //
        //     return JSON.stringify(this.values)
        //
        // }









    }








}


