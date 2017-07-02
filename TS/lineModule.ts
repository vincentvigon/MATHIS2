/**
 * Created by vigon on 10/08/2016.
 */

module mathis{
    
    
    export module lineModule{

        export class LineComputer{


            startingVertices:Vertex[]=null
            startingSegments:Vertex[][]=null
            restrictLinesToTheseVertices:Vertex[]=null
            
            lookAtBifurcation=true

            mamesh:Mamesh

            
            constructor(mamesh:Mamesh){
                this.mamesh=mamesh
            }

            go():Line[]{
                
                if (this.mamesh==null) throw ' a null mamesh'
                if (this.mamesh.vertices==null||this.mamesh.vertices.length==0) throw 'no vertices in this mamesh'

                if (this.mamesh.linesWasMade ) logger.c('lines already exist for this mamesh')


                let preres = makeLineCatalogue2(this.mamesh.vertices,this.lookAtBifurcation)

                let res:Line[]=[]
                if (this.startingVertices!=null){

                    let dicoStarting=new HashMap<Vertex,boolean>()
                    for (let v of this.startingVertices){
                        dicoStarting.putValue(v,true)
                    }
                    for (let line of preres){
                        for (let vv of line.vertices){
                            if (dicoStarting.getValue(vv)!=null){
                                res.push(line)
                                break
                            }
                        }
                    }



                }
                if(this.startingSegments!=null){
                    let hashDico=new StringMap<boolean>()
                    for (let [v0,v1] of this.startingSegments) hashDico.putValue(Hash.segment(v0,v1),true)
                    for (let line of preres){
                        let addOne=0
                        if (line.isLoop) addOne=1
                        for (let i=0;i<line.vertices.length+addOne;i++){
                            if (hashDico.getValue(Hash.segment(line.vertices[i],line.vertices[(i+1)%line.vertices.length]))==true) {
                                res.push(line)
                                break
                            }
                        }
                    }


                }
                if(this.startingVertices==null &&this.startingSegments==null) res=preres

                if (this.restrictLinesToTheseVertices!=null) {
                    let cutter=new LinesCuter(res,this.restrictLinesToTheseVertices)
                    res=cutter.go()
                }
                
                //this.mamesh.lines = res

                return res
            }


            //
            // private selectLineWithCartesianXYParam(line:Vertex[],space:XYZ):boolean{
            //
            //     let vertOk=true
            //     for (let vert of line){
            //         if (vert.param.x%space.x!=0 ) {
            //             vertOk=false
            //             break
            //         }
            //     }
            //    
            //     let horOk=true
            //     for (let vert of line){
            //         if (vert.param.y%space.y!=0 ) {
            //             horOk=false
            //             break
            //         }
            //     }
            //
            //     // let latOk=true
            //     // for (let vert of line){
            //     //     if (vert.param.z%space.z!=0 ) {
            //     //         latOk=false
            //     //         break
            //     //     }
            //     // }
            //
            //     return vertOk||horOk
            // }
        }

        
        export class LinesCuter{

            private lines:Line[]
            private allPresentVertices:HashMap<Vertex,boolean>
            private vertices:Vertex[]
            constructor(lines:Line[],vertices:Vertex[]){
                this.lines=lines
                this.vertices=vertices
            }

            go():Line[]{


                this.allPresentVertices=new HashMap<Vertex,boolean>()
                for (let v of this.vertices) this.allPresentVertices.putValue(v,true)



                let res:Line[]=[]



                this.lines.forEach(line=>{
                    if(!line.isLoop) {
                        let linesAsVertex=this.cutOneLine(line.vertices)
                        for (let l of linesAsVertex)res.push(new Line(l,false))
                        
                    }
                })


                this.lines.forEach(li=>{
                    if (li.isLoop){
                        let line=li.vertices
                        let firstIndexWithHole=-1
                        for (let i=0;i<line.length;i++){
                            if ( this.allPresentVertices.getValue(line[i])==null){
                                firstIndexWithHole=i
                                break
                            }
                        }
                        /**not cutted loop line*/
                        if (firstIndexWithHole==-1) res.push(li)
                        else{
                            let shiftedLine:Vertex[]=[]
                            for (let j=0;j<line.length;j++){
                                shiftedLine.push(line[(j+firstIndexWithHole)%line.length])
                            }
                            let linesAsVertex=this.cutOneLine(shiftedLine)
                            for (let l of linesAsVertex) res.push(new Line(l,false))
                            
                        }
                    }



                })

                return res
            }


            protected cutOneLine(path:Vertex[]):Vertex[][]{


                let allLittlePath:Vertex[][]=[]

                allLittlePath[0]=[]

                let currentPathIndex=-1
                let previousWasZero=true

                for (var i=0;i<path.length;i++){

                    if (this.allPresentVertices.getValue(path[i])==true){
                        if(!previousWasZero) allLittlePath[currentPathIndex].push(path[i])
                        else{
                            currentPathIndex++
                            allLittlePath[currentPathIndex]=[]
                            allLittlePath[currentPathIndex].push(path[i])
                            previousWasZero=false
                        }
                    }
                    else{
                        previousWasZero=true
                    }

                }

                let allLittlePathCleaned:Vertex[][]=[]

                allLittlePath.forEach(li=>{
                    if (li.length>=2) allLittlePathCleaned.push(li)
                })


                // let lastLineAdded=allLittlePath.pop()
                // if (lastLineAdded.length==1){
                //     let lastVertex=path[path.length-1]
                //     if(this.IN_mamesh.paramToVertex.getValue(lastVertex.param)!=null&& lastVertex.hasVoisin(lastLineAdded[lastLineAdded.length-1]) ){
                //         lastLineAdded.push(lastVertex)
                //         allLittlePath.push(lastLineAdded)
                //     }
                // }
                // else if (lastLineAdded.length>1){
                //     let lastVertex=path[path.length-1]
                //     if(this.IN_mamesh.paramToVertex.getValue(lastVertex.param)!=null){
                //         lastLineAdded.push(lastVertex)
                //         allLittlePath.push(lastLineAdded)
                //     }
                // }


                return allLittlePathCleaned
            }


        }


        /** warning : arg graph must be a whole graph, not a portion of graph.
         * */
        export function makeLineCatalogue2(graph:Vertex[],lookAtBifurcations:boolean):Line[] {

            let segmentsAlreadySeen=new HashMap<Segment,boolean>()
            let lines:Line[]=[]


            function addOneSegment(isLoop:boolean,lineInConstruction:Vertex[],segmentsAlreadySeenInTheBuildLine:HashMap<Segment,boolean>,hasBifurcate:boolean):void{

                let last=lineInConstruction[lineInConstruction.length-1]
                let beforeLast=lineInConstruction[lineInConstruction.length-2]

                segmentsAlreadySeen.putValue(new Segment(beforeLast,last),true)


                let opposites=last.getOpposites(beforeLast)

                /**end of line*/
                if (opposites==null) {
                    if (isLoop) logger.c('strange : probably, the function makeLineCatalogue2 have as args a non complete graph (call getGroup before)')
                    lines.push(new Line(lineInConstruction,false))
                }
                else if (opposites.length==0) throw 'convention: is no opposite, the array opposite must be null, and not empty'
                /** with bifurcation, lines could loop on themselves on their middle: forbidden. */
                else if (segmentsAlreadySeenInTheBuildLine.getValue(new Segment(beforeLast,last))==true){
                    lines.push(new Line(lineInConstruction,false))
                }
                else {
                    segmentsAlreadySeenInTheBuildLine.putValue(new Segment(beforeLast,last),true)

                    let nbOp=opposites.length
                    if (!lookAtBifurcations) nbOp=1
                    for (let i=0;i<nbOp;i++){

                        let opposite=opposites[i]

                        if (opposite==lineInConstruction[0]) {
                            //if (!isLoop) logger.c('a li')
                            lines.push(new Line(lineInConstruction,true))
                            segmentsAlreadySeen.putValue(new Segment(last,lineInConstruction[0]),true)
                        }
                        else {
                            if (i<nbOp-1) {
                                let copySegmentsAlreadySeenIn = new HashMap<Segment,boolean>()
                                for (let i = 0; i < lineInConstruction.length - 1; i++) copySegmentsAlreadySeenIn.putValue(new Segment(lineInConstruction[i], lineInConstruction[i + 1]), true)
                                let copyLineInConstruction = lineInConstruction.concat([opposite])
                                addOneSegment(isLoop, copyLineInConstruction, copySegmentsAlreadySeenIn, true)
                            }
                            /**it is not necessary to make copies for the last*/
                            else{
                                lineInConstruction.push(opposite)
                                addOneSegment(isLoop,lineInConstruction,segmentsAlreadySeenInTheBuildLine,hasBifurcate)
                            }
                        }
                    }
                }
            }


            /** we look for the starts of straight lines */
            graph.forEach((vertex:Vertex)=> {

                vertex.links.forEach((link:Link)=> {
                    if (link.opposites == null) {
                        if (lookAtBifurcations || segmentsAlreadySeen.getValue(new Segment(vertex,link.to))==null) {
                            let lineInConstruction=[vertex,link.to]
                            let segmentAlreadySeenInThisBuildLine= new HashMap<Segment,boolean>()
                            addOneSegment(false,lineInConstruction,segmentAlreadySeenInThisBuildLine,false)
                        }

                    }
                });

            });


            /**when we look at bifurcation, we create several times the sames lines*/
            if (lookAtBifurcations){
                let lineDico=new HashMap<Line,boolean>()
                let straightWithoutRepetitions:Line[]=[]
                for (let line of lines){
                        if (lineDico.getValue(line)==null) straightWithoutRepetitions.push(line)
                        lineDico.putValue(line,true)

                }
                lines=straightWithoutRepetitions
            }



            /**Now, only loop lines  remain*/
            graph.forEach((cell:Vertex)=> {

                cell.links.forEach((nei:Link)=> {

                    /**Contrary to straight line, when we look for bifurcation, we do not start a line from a segment already seen: this would create too much equivalents lines */
                    if (segmentsAlreadySeen.getValue(new Segment(cell,nei.to))==null) {
                        let lineInConstruction=[cell,nei.to]
                        let segmentAlreadySeenInThisBuildLine= new HashMap<Segment,boolean>()
                        addOneSegment(true,lineInConstruction,segmentAlreadySeenInThisBuildLine,false)
                    }


                });

            });


            return lines

        }



        class PackSegment extends HashMap<Segment,boolean>{
            index:number
            constructor(){
                super(true)
            }
        }


        //TODO separer en 2 classes
        export class CreateAColorIndexRespectingBifurcationsAndSymmetries{
            
            mamesh:Mamesh
            packSymmetricLines=true
            forSymmetriesUsePositionVersusParam=true
            
            useConsecutiveIntegerForPackNumber=true
            

            constructor(mamesh:Mamesh){
                this.mamesh=mamesh
            }

            symmetries:((a:XYZ)=>XYZ)[]=null

            OUT_nbFoundSymmetricLines=0


            OUT_lineIndexToColorIndex:number[]=[]



            go():HashMap<Line,number>{

                if (!this.mamesh.linesWasMade) throw 'no line for this IN_mamesh'
                
                let res:number[]=[]
                let packIndex=0


                let segmentToPack=new HashMap<Segment,PackSegment>()

                
                for (let line of this.mamesh.lines){

                    let segmentAlreadyCatalogued:Segment[]=[]
                    let segmentNeverCatalogued:Segment[]=[]

                    for (let segment of line.allSegments()){
                        if (segmentToPack.getValue(segment)!=null) segmentAlreadyCatalogued.push(segment)
                        else segmentNeverCatalogued.push(segment)

                    }

                    if (segmentAlreadyCatalogued.length==0){
                        let newPack=new PackSegment()
                        newPack.index=packIndex++

                        for (let segment of line.allSegments()){
                            newPack.putValue(segment,true)
                            segmentToPack.putValue(segment,newPack)
                        }
                    }
                    else {
                        let firstPack=segmentToPack.getValue(segmentAlreadyCatalogued[0])
                        for (let i=1;i<segmentAlreadyCatalogued.length;i++) this.segmentAndHisPackJoinNewPack(segmentAlreadyCatalogued[i],firstPack,segmentToPack)
                        for (let seg of segmentNeverCatalogued) {
                            firstPack.putValue(seg,true)
                            segmentToPack.putValue(seg,firstPack)
                        }

                    }
                }

                
                if (this.symmetries!=null) {

                    

                    /**to look for symmetries, we round a lot the hashes of XYZ*/
                    XYZ.nbDecimalForHash = 1
                    let symCheck = new StringMap<PackSegment>()
                    for (let i = 0; i < this.mamesh.lines.length; i++) {
                        let line:Line = this.mamesh.lines[i]
                        let hash = line.hashStringUpToSymmetries(this.symmetries,this.forSymmetriesUsePositionVersusParam)
                        let packSegment = symCheck.getValue(hash)

                        if (packSegment == null) symCheck.putValue(hash, segmentToPack.getValue(new Segment(line.vertices[0], line.vertices[1])))
                        else {
                            this.OUT_nbFoundSymmetricLines++
                            let otherPackSegment=segmentToPack.getValue(new Segment(line.vertices[0], line.vertices[1]))
                            /**on ne change la couleur que si les deux pack on la même longueur, ce qui est toujours le cas si le pack n'est constitué que d'une seule ligne
                             * cela évite de mettre la même couleur sur deux pack qui ont une ligne symétrique, mais pas les autres*/
                            if (otherPackSegment.size()==packSegment.size()) otherPackSegment.index=packSegment.index
                        }
                    }
                    XYZ.nbDecimalForHash = 5
                }


                /**each line get the packet index*/
                for (let i = 0; i < this.mamesh.lines.length; i++) {
                    let line:Line = this.mamesh.lines[i]
                    res[i] = segmentToPack.getValue(new Segment(line.vertices[0], line.vertices[1])).index
                }


                if (this.useConsecutiveIntegerForPackNumber&&this.packSymmetricLines){

                    let newRes=[]
                    let maxIndex=tab.maxIndexOfNumericList(res)
                    let max=res[maxIndex]

                    let decay=0
                    for (let a=0;a<=max;a++){
                        let aIsFound=false
                        for (let j=0;j<res.length;j++){
                            if (res[j]==a) {
                                newRes[j]=a-decay
                                aIsFound=true
                            }
                        }
                        if (!aIsFound) decay++
                    }

                    res=newRes
                }
                
                
                let res2=new HashMap<Line,number>()
                
                for (let i=0;i<this.mamesh.lines.length;i++){
                    res2.putValue(this.mamesh.lines[i],res[i])
                    this.OUT_lineIndexToColorIndex[i]=res[i]
                }


                return res2

            }

            
            private segmentAndHisPackJoinNewPack(segment:Segment,pack:PackSegment,segmentToPack:HashMap<Segment,PackSegment>){

                let oldPack=segmentToPack.getValue(segment)
                    for (let seg of oldPack.allKeys()){
                        pack.putValue(seg,true)
                        segmentToPack.putValue(seg,pack)
                    }


                segmentToPack.putValue(segment,pack)

            }



            //
            // private bifurcationPacket():number[]{
            //
            //
            //
            //     let res:number[]=[]
            //     let packIndex=0
            //
            //
            //     let segmentToPack=new HashMap<Segment,PackSegment>()
            //
            //     for (let line of this.IN_mamesh.lines){
            //
            //         let segmentAlreadyCatalogued:Segment[]=[]
            //         let segmentNeverCatalogued:Segment[]=[]
            //
            //         for (let segment of line.allSegments()){
            //             if (segmentToPack.getValue(segment)!=null) segmentAlreadyCatalogued.push(segment)
            //             else segmentNeverCatalogued.push(segment)
            //
            //         }
            //
            //         if (segmentAlreadyCatalogued.length==0){
            //             let newPack=new PackSegment()
            //             newPack.index=packIndex++
            //
            //             for (let segment of line.allSegments()){
            //                 newPack.putValue(segment,true)
            //                 segmentToPack.putValue(segment,newPack)
            //             }
            //         }
            //         else {
            //             let firstPack=segmentToPack.getValue(segmentAlreadyCatalogued[0])
            //             for (let i=1;i<segmentAlreadyCatalogued.length;i++) this.segmentAndHisPackJoinNewPack(segmentAlreadyCatalogued[i],firstPack,segmentToPack)
            //             for (let seg of segmentNeverCatalogued) {
            //                 firstPack.putValue(seg,true)
            //                 segmentToPack.putValue(seg,firstPack)
            //             }
            //
            //         }
            //
            //     }
            //
            //
            //
            //
            //     if (this.packSymmetricLines) {
            //         /**to look for symmetries, we round a lot the hashes of XYZ*/
            //         XYZ.nbDecimalForHash = 1
            //         let symCheck = new StringMap<number>()
            //         for (let i = 0; i < this.IN_mamesh.lines.length; i++) {
            //             let line:Line = this.IN_mamesh.lines[i]
            //             let hash = this.hashForTheSymetryClassOfALine(line)
            //             let num = symCheck.getValue(hash)
            //
            //             if (num == null) symCheck.putValue(hash, segmentToPack.getValue(new Segment(line.vertices[0], line.vertices[1])).index)
            //             else {
            //                 cc('sym found')
            //                 segmentToPack.getValue(new Segment(line.vertices[0], line.vertices[1])).index = num
            //             }
            //         }
            //         XYZ.nbDecimalForHash = 5
            //     }
            //
            //
            //     /**each line get the packet index*/
            //     for (let i = 0; i < this.IN_mamesh.lines.length; i++) {
            //         let line:Line = this.IN_mamesh.lines[i]
            //         res[i] = segmentToPack.getValue(new Segment(line.vertices[0], line.vertices[1])).index
            //     }
            //
            //
            //     if (this.useConsecutiveIntegerForPackNumber&&this.packSymmetricLines){
            //
            //         let newRes=[]
            //         let maxIndex=maxIndexOfNumericList(res)
            //         let max=res[maxIndex]
            //
            //         let decay=0
            //         for (let a=0;a<=max;a++){
            //             let aIsFound=false
            //             for (let j=0;j<res.length;j++){
            //                if (res[j]==a) {
            //                    newRes[j]=a-decay
            //                    aIsFound=true
            //                }
            //             }
            //             if (!aIsFound) decay++
            //         }
            //
            //         res=newRes
            //     }
            //
            //
            //
            //
            //
            //
            //
            //
            //
            //
            //     // for (let i=0;i<this.IN_mamesh.lines.length;i++){
            //     //
            //     //     let line=this.IN_mamesh.lines[i]
            //     //     let foundColor:number=null
            //     //
            //     //     let segments=line.allSegments()
            //     //
            //     //     for (let segment of segments){
            //     //         foundColor=segmentToColor.getValue(segment)
            //     //         if (foundColor!=null) break
            //     //     }
            //     //
            //     //     if (foundColor==null){
            //     //         for (let segment of segments) {
            //     //             segmentToColor.putValue(segment,this.currentColor)
            //     //         }
            //     //         res[i]=this.currentColor
            //     //         this.currentColor++
            //     //     }
            //     //     else {
            //     //         for (let segment of segments) {
            //     //             segmentToColor.putValue(segment,foundColor)
            //     //         }
            //     //         res[i]=foundColor
            //     //     }
            //     //
            //     // }
            //
            //     return res
            // }


        }




    }
}