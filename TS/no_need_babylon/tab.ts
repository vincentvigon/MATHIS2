/**
 * Created by vigon on 17/08/2016.
 */



module mathis{

    /**helper for array manipulations*/
    export module tab{

        export function maxIndex(list:string[]|number[]):number{

            if (list==null || list.length==0) throw 'empty list'

            let maxValue=list[0]
            let maxIndex=0
            for (let i=1;i<list.length;i++){
                if (list[i]>maxValue) {
                    maxValue=list[i]
                    maxIndex=i
                }
            }
            return maxIndex
        }

        export function maxValue(list:number[]):number{
            return list[maxIndex(list)]
        }

        export function maxValueString(list:string[]):string{
            return list[maxIndex(list)]
        }



        export function minIndex(list:string[]|number[]):number{

            if (list==null || list.length==0) throw 'empty list'

            let maxValue=list[0]
            let maxIndex=0
            for (let i=1;i<list.length;i++){
                if (list[i]<maxValue) {
                    maxValue=list[i]
                    maxIndex=i
                }
            }
            return maxIndex
        }

        
        
        
        export function minValue(list:number[]):number{
            return list[minIndex(list)]
        }

        export function minValueString(list:string[]):string{
            return list[minIndex(list)]
        }



        export function minIndexOb<T>(list:T[],comparisonFunction:(a:T,b:T)=>number):number{

            if (list==null || list.length==0) throw 'empty list'

            let minValue=list[0]
            let minIndex=0
            for (let i=1;i<list.length;i++){
                if (comparisonFunction(list[i],minValue)<0) {
                    minValue=list[i]
                    minIndex=i
                }
            }
            return minIndex
        }

        export function minValueOb<T>(list:T[],comparisonFunction:(a:T,b:T)=>number):T{
            return list[minIndexOb<T>(list,comparisonFunction)]
        }


        
        export function clearArray(array:Array<any>):void{
            while (array.length>0) array.pop();
        }


        export function removeFromArray<T>(array:Array<T>,object:T):void{
            var index=array.indexOf(object);
            if (index!=-1) array.splice(index,1);
            else {
                cc("l'objet n'est pas dans le tableau",object);
                throw "l'objet précédent n'est pas dans le tableau:"
            }
        }

        export function arrayMinusElements<T>(array:T[], criteriumToSuppress:(elem:T)=>boolean):T[]{
            let res:T[]=[]
            for (let elem of array){
                if (!criteriumToSuppress(elem)) res.push(elem)
            }
            return res
        }

        export function arrayKeepingSomeIndices<T>(array:T[], indicesToKeep:number[]  ):T[]{
            let res:T[]=[]

            for (let i=0;i<array.length;i++){
                if (indicesToKeep.indexOf(i)!=-1) res.push(array[i])
            }
            return res
        }

        export function arrayMinusSomeIndices<T>(array:T[], indicesSuppress:number[]  ):T[]{
            let res:T[]=[]

            for (let i=0;i<array.length;i++){
                if (indicesSuppress.indexOf(i)==-1) res.push(array[i])
            }
            return res
        }



        export function arrayMinusBlocksIndices<T>(list:T[], indicesOfBlocksToRemove:number[], blockSize:number):T[]{
            let res:T[]=[]
            for (let i=0;i<list.length;i+=blockSize){

                if (indicesOfBlocksToRemove.indexOf(i)==-1){
                    for (let j=0;j<blockSize;j++){
                        res.push(list[i+j])
                    }
                }
            }

            return res

        }


        export function minIndexOfNumericList(list:number[]):number{

            let minValue=Number.MAX_VALUE
            let minIndex=-1
            for (let i=0;i<list.length;i++){
                if (list[i]<minValue) {
                    minValue=list[i]
                    minIndex=i
                }
            }
            if (minIndex==-1) logger.c('an empty line has no minimum')

            return minIndex

        }


        export function maxIndexOfNumericList(list:number[]):number{

            let maxValue=Number.NEGATIVE_INFINITY
            let maxIndex=-1
            for (let i=0;i<list.length;i++){
                if (list[i]>maxValue) {
                    maxValue=list[i]
                    maxIndex=i
                }
            }

            return maxIndex

        }


        export function minIndexOfStringList(list:string[]):number{
            if(list.length==0){
                logger.c('an empty line has no minimum')
                return -1
            }


            let minValue=list[0]
            let minIndex=0
            for (let i=0;i<list.length;i++){
                if (list[i]<minValue) {
                    minValue=list[i]
                    minIndex=i
                }
            }

            return minIndex

        }


        export function indicesUpPermutationToString(indices:number[]){

            let minIndex = minIndexOfNumericList(indices)
            let permuted:number[] = []
            for (let i = 0; i < indices.length; i++) {
                permuted[i] = indices[(i + minIndex) % indices.length]
            }
            return JSON.stringify(permuted)
        }



        export class ArrayMinusBlocksElements<T extends HasHashString>{

            private dicoOfExistingBlocks:{ [id:string]:number }={}

            removeAlsoCircularPermutation=true
            longList:T[]
            blockSize:number

            listToRemove:T[]

            private removeOnlyDoublon:boolean


            constructor( longList:T[], blockSize:number, listToRemove?:T[]){
                this.longList=longList
                this.blockSize=blockSize

                if (listToRemove==null){
                    this.listToRemove=longList
                    this.removeOnlyDoublon=true

                }
                else {
                    this.listToRemove=listToRemove
                    this.removeOnlyDoublon=false
                }

            }


            go():T[]{

                /**construction of the dictionary */
                for (let i=0;i<this.listToRemove.length;i+=this.blockSize){
                    try {
                        let block:string[] = []
                        for (let j = 0; j < this.blockSize; j++) block.push(this.listToRemove[i + j].hashString)
                        this.dicoOfExistingBlocks[this.key(block)] = 1
                    }
                    catch (e){
                        throw "a block is not in your list"
                    }
                }


                /**construction of the resulting array, checking the dictionnary*/
                let newLongList:T[]=[]
                for (let i=0;i<this.longList.length;i+=this.blockSize) {

                    let block:string[] = []
                    for (let j = 0; j < this.blockSize; j++) block.push(this.longList[i + j].hashString)

                    if (!this.removeOnlyDoublon){
                        if (this.dicoOfExistingBlocks[this.key(block)]==null) {
                            for (let j = 0; j < this.blockSize; j++) newLongList.push(this.longList[i + j])
                        }
                    }
                    else{
                        if ( this.dicoOfExistingBlocks[this.key(block)]==1) {
                            for (let j = 0; j < this.blockSize; j++) newLongList.push(this.longList[i + j])
                            this.dicoOfExistingBlocks[this.key(block)]++
                        }
                    }


                }

                return newLongList

            }
            //
            //private allCircularPermutations(list:number[]):number[][]{
            //    let res:number[][]=[]
            //
            //    for (let i=0;i<this.blockSize;i++){
            //        let perm:number[]=[]
            //        for (let j=0;j<this.blockSize;j++) perm.push(list[(i+j)%this.blockSize])
            //        res.push(perm)
            //    }
            //
            //    return res
            //
            //
            //}

            private key(list:string[]):string {

                let rearangedList:string[]=[]
                if (!this.removeAlsoCircularPermutation) rearangedList=list
                else{
                    rearangedList=[]
                    let minIndex=minIndexOfStringList(list)
                    for (let i=0;i<list.length;i++) rearangedList[i]=list[(i+minIndex)%list.length]
                }


                let key=""
                rearangedList.forEach((nu:string)=>{
                    key+=nu+','
                })
                return key
            }



        }




    }


}
