/**
 * Created by vigon on 01/02/2017.
 */


module mathis{
    
    export module grateAndGlue{

        
        export class GraphGrater{

            IN_graphFamily:Vertex[][]=[]
            /**if null, seeds are computed*/
            seedsList:Vertex[][]=null


            OUT_allSeeds:Vertex[][]

            /**if true, seed of a graph  is the further cell of barycenters of other graph
             * if false, seed of a graph is made of all the vertices which is sufficiently far from other seeds*/
            seedComputedFromBarycentersVersusFromAllPossibleCells=true
            //
            // /**if a graph is include in an other, its corresponding seed can be empty. In this case, with the bellow true option selected, we chose as seed a vertex further as possible from barycenter of other graph*/
            // useBarycenterTechniqueOnlyForEmptySeeds=true
            //
            // /** The seeds is the cell the further of the barycenter.  best with false. Other technic: */
            // useBarycenterTechniqueForAllSeeds=false
            /**a very small decay for the case where barycenters are superposed*/
            barycenterDecay=new XYZ(0.0000000234,0.000000000677,0.000000000987)


            /** more big, and more IN_mamesh are grated
             *  for a family made of  graph with square maille, all with the same size, the natural value is sqrt(2)/2
             *  But : take care of rectangular maille*/
            proximityCoefToGrate=[0.7]

            /** bigger is theses coef, and more we chose seed for initiate grating  */
            proportionOfSeeds=[0.1]
            /** to introduce asymmetry */
            asymmetriesForSeeds:{direction:XYZ;influence:number;modulo?:number}[]=null


            proximityMeasurer:ProximityMeasurer



            constructor(){
            }


            private checkArgs():void{

                if (this.IN_graphFamily==null || this.IN_graphFamily.length<2) throw 'SUB_grater works from 2 graphs'

            }



            private suppressTooCloseVertex(family:Vertex[][]):Vertex[][]{

                let res:Vertex[][]=[]

                for (let i=0; i<family.length; i++){
                    let neighborhoodCoef= this.proximityCoefToGrate[i%this.proximityCoefToGrate.length]
                    res[i]=[]
                    for (let verI of family[i]){
                        let ok=true
                        for (let j=0; j<family.length; j++) {
                            if (i != j) {
                                ok = !this.proximityMeasurer.isCloseToMe(verI, family[j],neighborhoodCoef)
                                if (!ok) break
                            }
                        }
                        if (ok) res[i].push(verI)
                    }
                }

                return res
            }


            private findSeeds():Vertex[][]{


                let res:Vertex[][]=[]




                if (!this.seedComputedFromBarycentersVersusFromAllPossibleCells){
                    // for (let i=0; i<this.IN_graphFamily.length; i++){
                    //     let neighborhoodCoef= this.proximityCoefToGrate[i%this.proximityCoefToGrate.length]
                    //     res[i]=[]
                    //     for (let verI of this.IN_graphFamily[i]){
                    //         let ok=true
                    //         for (let j=0; j<this.IN_graphFamily.length; j++) {
                    //             if (i != j) {
                    //                 ok = !this.isCloseToMe(verI, this.IN_graphFamily[j],neighborhoodCoef)
                    //                 if (!ok) break
                    //             }
                    //         }
                    //         if (ok) res[i].push(verI)
                    //     }
                    // }

                    res=this.suppressTooCloseVertex(this.IN_graphFamily)


                }
                else {

                    for (let i=0; i<this.IN_graphFamily.length; i++) {
                        res[i] = []
                    }

                    // let emptySeed:number[] = []
                    // for (let i = 0; i < this.IN_graphFamily.length; i++) if (res[i].length == 0) emptySeed.push(i)
                    //
                    // if (emptySeed.length > 0) {
                    let barycenters:XYZ[] = []
                    for (let i = 0; i < this.IN_graphFamily.length; i++) {
                        barycenters[i] = new XYZ(0, 0, 0)
                        for (let v of this.IN_graphFamily[i]) {
                            barycenters[i].add(v.position)
                        }
                        barycenters[i].scale(1 / this.IN_graphFamily[i].length)

                        barycenters[i].add(this.barycenterDecay)
                    }

                    let toSort=(a,b)=>{return b.distance-a.distance}

                    for (let emp =0; emp<this.IN_graphFamily.length;emp++) {
                        let baryOfOther = new XYZ(0, 0, 0)
                        for (let k = 0; k < this.IN_graphFamily.length; k++) if (k != emp) baryOfOther.add(barycenters[k])
                        baryOfOther.scale(1/(this.IN_graphFamily.length-1))


                        let vertexAndDist=[]
                        let bary2Pos=new XYZ(0,0,0)
                        for (let v of this.IN_graphFamily[emp]) {

                            bary2Pos.copyFrom(v.position).substract(baryOfOther)

                            let dd = geo.distance(v.position, baryOfOther)
                            /**we tried to take into account the barycenter of the current graph (as following), but this was worse
                             * let ddInternal = geo.distance(v.position, barycenters[emp])
                             vertexAndDist.push({vertex:v,distance:dd-ddInternal})
                             */

                            if (this.asymmetriesForSeeds!=null && this.asymmetriesForSeeds[emp%this.asymmetriesForSeeds.length]!=null){
                                let asy=this.asymmetriesForSeeds[emp%this.asymmetriesForSeeds.length]

                                let angle=geo.angleBetweenTwoVectorsBetween0andPi(bary2Pos,asy.direction)


                                let modu=Math.PI
                                if (asy.modulo!=null){
                                    modu=asy.modulo
                                    if (isNaN(modu)|| modu<0 || modu>Math.PI  ) throw 'modulo must be a number between 0 and PI, but is:'+modu
                                    angle=modulo(angle,modu)
                                }

                                let coef=1-angle/modu



                                dd =dd*(1-asy.influence)+coef*asy.influence
                            }

                            vertexAndDist.push({vertex:v,distance:dd})

                        }

                        vertexAndDist.sort(toSort)
                        // let longest = -1
                        // let furtherVertex =null// this.IN_graphFamily[emp][0]
                        // for (let v of this.IN_graphFamily[emp]) {
                        //     let dd = geo.distance(v.position, baryOfOther)
                        //     //cc('dd',dd,baryOfOther,v.position)
                        //     if (dd > longest) {
                        //         longest = dd
                        //         furtherVertex = v
                        //     }
                        // }

                        res[emp]=[]
                        let borne:number
                        if(this.proportionOfSeeds[emp%this.proportionOfSeeds.length]>0) borne=vertexAndDist[0].distance*(1-this.proportionOfSeeds[emp%this.proportionOfSeeds.length])
                        else borne=vertexAndDist[0].distance*0.99


                        let dist=Number.MAX_VALUE
                        let i=0
                        while (dist>=borne&& i<vertexAndDist.length-1){
                            res[emp].push(vertexAndDist[i].vertex)
                            i++
                            dist=vertexAndDist[i].distance
                        }

                        //for (let i=0;i<vertexAndDist.length*this.proportionOfSeeds[emp%this.proportionOfSeeds.length];i++)

                        //res[emp] = [vertexAndDist[0].vertex]
                    }
                    //}
                }


                /**because seeds ca overlap themselves*/
                res=this.suppressTooCloseVertex(res)


                for (let i = 0; i < this.IN_graphFamily.length; i++) if (res[i].length == 0)
                    throw 'an empty seeds, possible cause: 1/  two graphes are identical 2/ one of your graph is nearly includes into an other and you do not use the barycenter technique'

                return res
            }





            go():Vertex[][]{

                this.checkArgs()


                if (this.proximityMeasurer==null) this.proximityMeasurer=new ProximityMeasurer()




                if (this.seedsList==null) {
                    this.seedsList=this.findSeeds()
                    this.OUT_allSeeds=this.seedsList
                }




                let alreadySomeVertex=true
                let interior:Vertex[][]=[]
                //let interiorUnion:Vertex[]=[]
                //let admissible:HashMap<Vertex,boolean>[]=[]


                for (let i=0; i<this.IN_graphFamily.length; i++) {
                    //interior[i]=[]
                    interior[i]=[].concat(this.seedsList[i])
                    // this.seedsList[i].forEach(v=>{
                    //     interior[i].push(v)
                    // })
                }


                let nonAdmissibleForEdge=new HashMap<Vertex,boolean>()
                while (alreadySomeVertex){

                    alreadySomeVertex=false
                    for (let i=0; i<this.IN_graphFamily.length; i++){
                        let neighborhoodCoef=this.proximityCoefToGrate[i%this.proximityCoefToGrate.length]

                        let edge=graph.getEdge(interior[i],nonAdmissibleForEdge)

                        for (let ve of edge){
                            let isClose=false
                            for (let j=0; j<this.IN_graphFamily.length; j++){
                                if(i!=j&& this.proximityMeasurer.isCloseToMe(ve,interior[j],neighborhoodCoef)) {
                                    isClose=true
                                    break
                                }
                            }

                            if (!isClose) {
                                interior[i].push(ve)

                                alreadySomeVertex=true
                            }
                        }
                    }
                }






                // for (let i=0; i<this.IN_graphFamily.length; i++) {
                //     admissible[i]=new HashMap<Vertex,boolean>()
                //     interior[i]=[]
                //
                //     this.IN_graphFamily[i].forEach(v=>admissible[i].putValue(v,true))
                //     this.seedsList[i].forEach(v=>{
                //
                //         interior[i].push(v)
                //         //interiorUnion.push(v)
                //         admissible[i].putValue(v,false)
                //     })
                // }
                //
                //
                //
                // while (alreadySomeVertex){
                //
                //     alreadySomeVertex=false
                //     for (let i=0; i<this.IN_graphFamily.length; i++){
                //         let neighborhoodCoef=this.proximityCoefToGrate[i%this.proximityCoefToGrate.length]
                //
                //         let edge=graph.getEdge(interior[i],admissible[i])
                //
                //
                //         for (let ve of edge){
                //             admissible[i].putValue(ve,false)
                //
                //             let isClose=false//this.isCloseToMe(ve,interiorUnion,neighborhoodCoef)
                //             for (let j=0; j<this.IN_graphFamily.length; j++){
                //                 if(i!=j&& this.proximityMeasurer.isCloseToMe(ve,interior[j],neighborhoodCoef)) {
                //                     isClose=true
                //                     break
                //                 }
                //             }
                //
                //             if (!isClose) {
                //                 interior[i].push(ve)
                //                 //interiorUnion.push(ve)
                //                 alreadySomeVertex=true
                //             }
                //         }
                //     }
                // }


                return interior
            }

        }



        export class ProximityMeasurer{


            vertexToLinkLength=new HashMap<Vertex,number>()


            meanLinksDist(vertex:Vertex):number{

                let res=this.vertexToLinkLength.getValue(vertex)
                if (res!=null)return res

                let dist=0
                for (let link of vertex.links){
                    dist+=geo.distance(vertex.position,link.to.position)
                }
                dist/=vertex.links.length
                this.vertexToLinkLength.putValue(vertex,dist)

                return dist
            }

            isCloseToMe(vertex:Vertex,family:Vertex[],coef:number):boolean{
                for (let v of family){
                    if (this.areClose(vertex,v,coef)) return true
                }
                return false
            }

            areClose(vertex0:Vertex,vertex1,coef:number):boolean{
                return (geo.distance(vertex0.position,vertex1.position)<(this.meanLinksDist(vertex0)+this.meanLinksDist(vertex1))/2*coef)
            }

            areFar(vertex0:Vertex,vertex1,coef:number):boolean{
                return (geo.distance(vertex0.position,vertex1.position)>(this.meanLinksDist(vertex0)+this.meanLinksDist(vertex1))/2*coef)
            }








        }



        export class SubMameshExtractor {
            mamesh:Mamesh
            verticesToKeep:Vertex[]
            verticesToKeepMustBeInMamesh = true
            constructCutSegment = true


            takeCareOfPolygons=true
            addBorderPolygonInsteadOfSuppress=false


            /**OUT*/
            OUT_BorderPolygon:Vertex[][]=[]
            OUT_BorderVerticesInside:Vertex[]=[]
            OUTBorderVerticesOutside:Vertex[]=[]

            
            constructor(mamesh:Mamesh, verticesToKeep:Vertex[]) {
                this.mamesh = mamesh
                this.verticesToKeep = verticesToKeep
            }

            go():Mamesh {
                let res = new Mamesh()

                this.verticesToKeep.forEach(vertex=> {
                    if (this.mamesh.hasVertex(vertex)) {
                        res.addVertex(vertex)
                    }
                    else if (this.verticesToKeepMustBeInMamesh) throw 'a vertex in the list to keep is not in the original mesh. If you want to allow this, please turn the boolean "verticesToKeepMustBeInMamesh" to false'
                })


                //res.linksOK = true


                //let verticesToAdd:Vertex[]=[]
                for (let i = 0; i < this.mamesh.smallestSquares.length; i += 4) {

                    let sumOfPresentVertex=0

                    if (res.hasVertex(this.mamesh.smallestSquares[i])) sumOfPresentVertex++
                    if (res.hasVertex(this.mamesh.smallestSquares[i+1])) sumOfPresentVertex++
                    if (res.hasVertex(this.mamesh.smallestSquares[i+2])) sumOfPresentVertex++
                    if (res.hasVertex(this.mamesh.smallestSquares[i+3])) sumOfPresentVertex++


                    if (sumOfPresentVertex>0 && sumOfPresentVertex<4) this.OUT_BorderPolygon.push([this.mamesh.smallestSquares[i], this.mamesh.smallestSquares[i + 1], this.mamesh.smallestSquares[i + 2], this.mamesh.smallestSquares[i + 3]])
                    else if (sumOfPresentVertex==4) res.smallestSquares.push(this.mamesh.smallestSquares[i], this.mamesh.smallestSquares[i + 1], this.mamesh.smallestSquares[i + 2], this.mamesh.smallestSquares[i + 3])

                }

                for (let i = 0; i < this.mamesh.smallestTriangles.length; i += 3) {
                    let sumOfPresentVertex=0
                    if (res.hasVertex(this.mamesh.smallestTriangles[i])) sumOfPresentVertex++
                    if (res.hasVertex(this.mamesh.smallestTriangles[i + 1])) sumOfPresentVertex++
                    if (res.hasVertex(this.mamesh.smallestTriangles[i + 2])) sumOfPresentVertex++

                    if (sumOfPresentVertex>0&& sumOfPresentVertex<3) this.OUT_BorderPolygon.push([this.mamesh.smallestTriangles[i], this.mamesh.smallestTriangles[i + 1], this.mamesh.smallestTriangles[i + 2]])
                    else if(sumOfPresentVertex==3) res.smallestTriangles.push(this.mamesh.smallestTriangles[i], this.mamesh.smallestTriangles[i + 1], this.mamesh.smallestTriangles[i + 2])
                }



                for (let poly of this.OUT_BorderPolygon){
                    for (let v of poly){
                        if (res.hasVertex(v)) {
                            if (this.OUT_BorderVerticesInside.indexOf(v)==-1) this.OUT_BorderVerticesInside.push(v)
                        }
                        else {
                            if (this.OUTBorderVerticesOutside.indexOf(v)==-1) this.OUTBorderVerticesOutside.push(v)
                        }
                    }
                }


                if (this.takeCareOfPolygons) {
                    if (this.addBorderPolygonInsteadOfSuppress) {
                        for (let poly of this.OUT_BorderPolygon) {
                            if (poly.length == 3) res.smallestTriangles.push(poly[0], poly[1], poly[2])
                            else if (poly.length == 4) res.smallestSquares.push(poly[0], poly[1], poly[2], poly[3])
                        }
                        for (let vert of this.OUTBorderVerticesOutside) res.addVertex(vert)
                    }
                    else {
                        let suppressedIndexOfBorderInside:number[]=[]
                        let suppressedIndexOfRes:number[]=[]


                        for (let i=0; i< this.OUT_BorderVerticesInside.length; i++) {
                            let vert=this.OUT_BorderVerticesInside[i]
                            let isInAPoly = false
                            for (let v of res.smallestSquares) {
                                if (v.hashNumber == vert.hashNumber) {
                                    isInAPoly = true
                                    break
                                }
                            }
                            if (!isInAPoly) {
                                for (let v of res.smallestTriangles) {
                                    if (v.hashNumber == vert.hashNumber) {
                                        isInAPoly = true
                                        break
                                    }
                                }
                            }

                            if (!isInAPoly) {

                                //removeFromArray(res.vertices,vert)
                                suppressedIndexOfRes.push(res.vertices.indexOf(vert))
                                suppressedIndexOfBorderInside.push(i)
                                //removeFromArray(this.OUT_BorderVerticesInside, vert)
                            }
                        }
                        this.OUT_BorderVerticesInside=tab.arrayMinusSomeIndices(this.OUT_BorderVerticesInside,suppressedIndexOfBorderInside)
                        res.vertices=tab.arrayMinusSomeIndices(res.vertices,suppressedIndexOfRes)
                    }
                }


                if (this.constructCutSegment) {
                    for (let key in this.mamesh.cutSegmentsDico) {
                        let segment:Segment = this.mamesh.cutSegmentsDico[key]
                        if (!res.hasVertex(segment.a) ) continue
                        if (!res.hasVertex(segment.b) ) continue
                        if (!res.hasVertex(segment.middle) ) continue

                        res.cutSegmentsDico[key] = segment
                    }
                }



                return res
            }

        }


        export class ExtractCentralPart{
            mamesh:Mamesh
            nb:number
            markBorder=true
            suppressFromBorderVersusCorner=true

            constructor(mamesh:Mamesh,nb:number){
                this.mamesh=mamesh
                this.nb=nb
            }


            go():Mamesh{
                let border:Vertex[] = []
                if (this.suppressFromBorderVersusCorner){
                    for (let ver of this.mamesh.vertices) {
                        if (ver.hasMark(Vertex.Markers.border)) border.push(ver)
                    }
                }
                else{
                    for (let ver of this.mamesh.vertices) {
                        if (ver.hasMark(Vertex.Markers.corner)) border.push(ver)
                    }
                }


                let rings = graph.ringify(border)

                let toSuppress=new HashMap<Vertex,boolean>()


                if (this.nb<0) this.nb=rings.length+this.nb-1
                if (this.nb>=rings.length-1) throw 'you want to suppress too much strates'

                for (let i = 0; i < this.nb; i++) {
                    for (let v of rings[i]) toSuppress.putValue(v,true)
                }

                let toKeep:Vertex[]=[]
                for (let v of this.mamesh.vertices) {
                    if (toSuppress.getValue(v)==null) {
                        toKeep.push(v)
                    }
                }


                if(this.markBorder) for (let v of rings[this.nb]) {
                    v.markers.push(Vertex.Markers.border)
                }


                let suber=new grateAndGlue.SubMameshExtractor(this.mamesh,toKeep)
                let res=suber.go()






                return res
            }



        }


        class FindStickingMapFromSquare{

            receiver:Vertex[]
            source:Vertex[]

            constructor(receiver:Vertex[],source:Vertex[]){

                this.receiver=receiver
                this.source=source

            }

            private checkArgs(){
                if (this.receiver.length%4!=0) throw 'receiver is not a list representing squares'
                if (this.source.length%4!=0) throw 'source is not a list representing squares'

            }


            go ():HashMap<Vertex,Vertex>{

                this.checkArgs()

                let res=new HashMap<Vertex,Vertex>(true)

                let sourceBaryCenter=this.squareToBaryCenter(this.source)
                let receiverBaryCenter=this.squareToBaryCenter(this.receiver)

                for (let i=0;i<sourceBaryCenter.length;i++){
                    let minDist=Number.MAX_VALUE
                    let bestReceiverIndex=-1
                    for (let j=0;j<receiverBaryCenter.length;j++){
                        let dist=geo.distance(sourceBaryCenter[i],receiverBaryCenter[j])
                        if (dist<minDist){
                            minDist=dist
                            bestReceiverIndex=j
                        }
                    }
                    let receiverPaquet=[this.receiver[4*bestReceiverIndex],this.receiver[4*bestReceiverIndex+1],this.receiver[4*bestReceiverIndex+2],this.receiver[4*bestReceiverIndex+3]]
                    let sourcePaquet=[this.source[4*i],this.source[4*i+1],this.source[4*i+2],this.source[4*i+3]]

                    let permutedReceiverPaquet=this.getBestPermutationOfReceiver(receiverPaquet,sourcePaquet)

                    for (let k=0;k<4;k++){
                        res.putValue(sourcePaquet[k],permutedReceiverPaquet[k])
                    }

                }
                return res
            }


            private getBestPermutationOfReceiver(receiverPaquet, sourcePaquet):Vertex[]{


                let minDist=Number.MAX_VALUE
                let bestDecal=-1
                for (let k=0;k<4;k++){
                    let decalReceiver=[receiverPaquet[k],receiverPaquet[(k+1)%4],receiverPaquet[(k+2)%4],receiverPaquet[(k+3)%4]]
                    let dist=0
                    for (let l=0;l<4;l++)dist+=geo.distance(sourcePaquet[l].position,decalReceiver[l].position)
                    if (dist<minDist){
                        minDist=dist
                        bestDecal=k
                    }
                }
                let k=bestDecal

                return [receiverPaquet[k],receiverPaquet[(k+1)%4],receiverPaquet[(k+2)%4],receiverPaquet[(k+3)%4]]

            }


            private squareToBaryCenter(vertices:Vertex[]):XYZ[]{
                let res:XYZ[]=[]

                for (let i=0;i<vertices.length;i+=4){

                    let paquet=[vertices[i].position,vertices[i+1].position,vertices[i+2].position,vertices[i+3].position]
                    let bary=new XYZ(0,0,0)
                    geo.baryCenter(paquet,[1/4,1/4,1/4,1/4],bary)
                    res.push(bary)
                }
                return res
            }
        }

        //
        // export class FindSickingMapFromVerticesOld{
        //
        //     receiver:Vertex[]
        //     source:Vertex[]
        //
        //     /**if zero, sticking is made only for closest voisin*/
        //     toleranceToBeOneOfTheClosest=0.3
        //
        //     constructor(receiver:Vertex[],source:Vertex[]){
        //
        //         this.receiver=receiver
        //         this.source=source
        //
        //     }
        //
        //     private checkArgs():void{
        //         //if (this.receiver.length%4!=0) throw 'receiver is not a list representing squares'
        //         //if (this.source.length%4!=0) throw 'source is not a list representing squares'
        //
        //     }
        //
        //     go ():Vertex[][]{
        //
        //         this.checkArgs()
        //
        //         let res:Vertex[][]=[]//=new HashMap<Vertex,Vertex>(true)
        //
        //         for (let i=0;i<this.source.length;i++){
        //             let minDist=Number.MAX_VALUE
        //             //let bestReceiverIndex=-1
        //             let distances:number[]=[]
        //             for (let j=0;j<this.receiver.length;j++){
        //                 distances[j]=geo.distance(this.source[i].position,this.receiver[j].position)
        //
        //                 if (distances[j]<minDist){
        //                     minDist=distances[j]
        //                     //bestReceiverIndex=j
        //                 }
        //             }
        //             let bestRecivers:number[]=[]
        //             for (let j=0;j<this.receiver.length;j++){
        //                 if (distances[j]<=minDist*(1+this.toleranceToBeOneOfTheClosest)){
        //                     bestRecivers.push(j)
        //                 }
        //             }
        //             for (let j of bestRecivers) res.push([this.source[i],this.receiver[j]])
        //
        //         }
        //         return res
        //     }
        //
        // }
        //



        export class FindSickingMapFromVertices{

            receiver:Vertex[]
            source:Vertex[]

            /**if zero, sticking is made only for closest voisin*/
            toleranceToBeOneOfTheClosest=0.5


            proximityMeasurer:ProximityMeasurer

            proximityCoef=0.7
            
            acceptOnlyDisjointReceiverAndSource=true


            constructor(receiver:Vertex[],source:Vertex[]){

                this.receiver=receiver
                this.source=source

            }

            private checkArgs():void{
                if (this.acceptOnlyDisjointReceiverAndSource) {
                    let dico = new HashMap<Vertex,boolean>()
                    for (let v of this.source) dico.putValue(v, true)

                    for (let v of this.receiver) {
                        if (dico.getValue(v) != null) throw 'source and receiver must be disjoint'
                    }
                }
                

            }

            go ():HashMap<Vertex,Vertex[]>{

                this.checkArgs()


                if (this.proximityMeasurer==null) this.proximityMeasurer=new ProximityMeasurer()

                this.checkArgs()

                let res=new HashMap<Vertex,Vertex[]>(true)

                for (let vSource of this.source){
                    let minDist=Number.POSITIVE_INFINITY
                    //let bestReceiverIndex=-1

                    let receiverToDist=new HashMap<Vertex,number>(true)
                    let veryBestReceiver:Vertex=null


                    for (let vReceiver of this.receiver){
                        /**we do not want a vertex which is in a same time receiver and source*/

                            let dist = geo.distance(vSource.position, vReceiver.position)
                            if (this.proximityMeasurer.areClose(vSource, vReceiver, this.proximityCoef)) {
                                receiverToDist.putValue(vReceiver, dist)
                                if (dist < minDist) {
                                    minDist = dist
                                    veryBestReceiver = vReceiver
                                }
                            }

                    }
                    /**veryBestReceiver==null means that source and all receivers are too far*/
                    if (veryBestReceiver!=null){
                        let bestReceivers:Vertex[]=[]
                        /**we put in first the very best*/
                        bestReceivers.push(veryBestReceiver)
                        for (let vReceiver of receiverToDist.allKeys()){
                            if (vReceiver!=veryBestReceiver && receiverToDist.getValue(vReceiver)<=minDist*(1+this.toleranceToBeOneOfTheClosest)){
                                bestReceivers.push(vReceiver)
                            }
                        }
                        res.putValue(vSource,bestReceivers)
                    }
                }
                return res
            }

        }


        //
        // export class FindMergingMapFast{
        //
        //
        //     source:Vertex[]
        //     receiver:Vertex[]
        //     nbDistinctPoint:number
        //    
        //     constructor( receiver:Vertex[],source:Vertex[],nbDistinctPoint:number){
        //         this.source=source
        //         this.receiver=receiver
        //         this.nbDistinctPoint=nbDistinctPoint
        //     }
        //    
        //     go():HashMap<Vertex,Vertex> {
        //
        //         // let indexToMerge:{[key:number]:number}
        //         //
        //         // this.merginMap = new HashMap<Vertex,Vertex>(true)
        //         //
        //         // let positionsRecepter:XYZ[] = []
        //         // this.receiverMamesh.vertices.forEach(v=> {
        //         //     positionsRecepter.push(v.position)
        //         // })
        //         //
        //         // if (this.sourceEqualRecepter) indexToMerge = new geometry.CloseXYZfinder(positionsRecepter,null,1000).go()
        //         // else {
        //         //     let positionsSource:XYZ[] = []
        //         //     this.sourceMamesh.vertices.forEach(v=> {
        //         //         positionsSource.push(v.position)
        //         //     })
        //         //     indexToMerge = new geometry.CloseXYZfinder(positionsRecepter, positionsSource,1000).go()
        //         // }
        //         //
        //         //
        //         // for (let index in indexToMerge) {
        //         //     this.merginMap.putValue(this.sourceMamesh.vertices[index], this.receiverMamesh.vertices[indexToMerge[index]])
        //         // }
        //        
        //        
        //         let indexToMerge:{[key:number]:number}
        //
        //         let merginMap = new HashMap<Vertex,Vertex>(true)
        //
        //         let positionsRecepter:XYZ[] = []
        //         this.receiver.forEach(v=> {
        //             positionsRecepter.push(v.position)
        //         })
        //
        //         if (this.source==null) indexToMerge = new geometry.CloseXYZfinder(positionsRecepter,null,this.nbDistinctPoint).go()
        //         else {
        //             let positionsSource:XYZ[] = []
        //             this.source.forEach(v=> {
        //                 positionsSource.push(v.position)
        //             })
        //             indexToMerge = new geometry.CloseXYZfinder(positionsRecepter, positionsSource,this.nbDistinctPoint).go()
        //         }
        //
        //
        //         for (let index in indexToMerge) {
        //             merginMap.putValue(this.source[index], this.receiver[indexToMerge[index]])
        //         }
        //
        //
        //         return merginMap
        //
        //     }
        //    
        // }

        
        export class ConcurrentMameshesGraterAndSticker {

            IN_mameshes:Mamesh[]=[]
            SUB_grater=new GraphGrater()

            justGrateDoNotStick=false



            /**use for sticking. More big, and more links are added*/
            proximityCoefToStick=[2]

            /**if zero -> sticking is made only for closest voisin
             * if 0.5 -> vertices up to 50% of the closest are stick*/
            toleranceToBeOneOfTheClosest=0.5

            /**some intermediate result, which can be use if the user want to "just grate and not stick" and then to stick with some custom mergingMap */
            OUTBorderVerticesToStick:Vertex[][]=[]
            /**be careful, if you stickAll (default), the zero-indexed IN_mamesh-vertices will be modified, and so the zero indexed grated mameh*/
            OUTGratedMameshes:Mamesh[]=[]


            takeCareOfPolygons=true
            

            suppressLinksAngularlyTooClose=true
            
            
            
            SUB_linkCleanerByAngle=new linkModule.LinksSorterAndCleanerByAngles(null,null)

            SUB_PolygonCreatorFromLinks=new surfaceConnection.SurfaceConnectionProcess(null,1,false,true)


            addMissingPolygons=true
            

            constructor() {
                this.SUB_linkCleanerByAngle.suppressLinksAngularParam=2*Math.PI*0.1
            }


            
            OUT_stickingMap=new HashMap<Vertex,Vertex[]>(true)


            private checkArgs():void{
                //if (this.neighborhoodSizeCoefByFamily!=null && this.neighborhoodSizeCoefByFamily.length!=this.IN_mameshes.length) throw 'neighborhoodSizeCoefByFamily must have the same length as mameshFamily'
                //if (this.stickingSizeCoefByFamily!=null && this.stickingSizeCoefByFamily.length!=this.IN_mameshes.length) throw 'stickingSizeCoefByFamily must have the same length as mameshFamily'
            }

            goChanging():Mamesh {

                this.checkArgs()

                /**first we clean all opposite link of all IN_mamesh. They will be rebuild*/
                for (let mam of this.IN_mameshes){
                    for (let ve of mam.vertices){
                        for (let li of ve.links) li.opposites=null
                    }
                }


                let graphs:Vertex[][]=[]
                this.IN_mameshes.forEach(m=>graphs.push(m.vertices))




                this.SUB_grater.IN_graphFamily=graphs

                let gratedGraph=this.SUB_grater.go()



                for (let i=0; i<this.IN_mameshes.length; i++){
                    let extractor=new grateAndGlue.SubMameshExtractor(this.IN_mameshes[i],gratedGraph[i])
                    extractor.takeCareOfPolygons=this.takeCareOfPolygons
                    extractor.addBorderPolygonInsteadOfSuppress=false
                    this.OUTGratedMameshes[i]=extractor.go()


                    /**to stick perhaps: vertices where we have cut, but only one which have a link leading to outside*/
                    this.OUTBorderVerticesToStick[i]=[]
                    for (let vertex of extractor.OUT_BorderVerticesInside){
                        for (let link of vertex.links){
                            if (this.IN_mameshes[i].hasVertex(link.to)&& !this.OUTGratedMameshes[i].hasVertex(link.to)){
                                this.OUTBorderVerticesToStick[i].push(vertex)
                                break
                            }
                        }
                    }

                    this.OUTGratedMameshes[i].isolateMameshVerticesFromExteriorVertices()


                    for (let v of this.OUTGratedMameshes[i].vertices){
                        if (v.hasMark(Vertex.Markers.border)&& this.OUTBorderVerticesToStick[i].indexOf(v)==-1 ) this.OUTBorderVerticesToStick[i].push(v)
                    }

                }

                let res = this.OUTGratedMameshes[0]

                
                
                
                for (let indexMamesh = 1; indexMamesh < this.IN_mameshes.length; indexMamesh++) {


                    let mapFinder = new FindSickingMapFromVertices(res.vertices, this.OUTBorderVerticesToStick[indexMamesh])
                    mapFinder.toleranceToBeOneOfTheClosest=this.toleranceToBeOneOfTheClosest
                    mapFinder.proximityCoef=this.proximityCoefToStick[indexMamesh%this.proximityCoefToStick.length]
                    let map=mapFinder.go()

                    this.OUT_stickingMap.extend(map)
                    

                    let sticker=new Sticker(res,this.OUTGratedMameshes[indexMamesh],map)
                    sticker.zIndex1=indexMamesh
                    /**already done in this method*/
                    sticker.cleanOppositeLinksAtBegin=false
                    sticker.createNewLinks=!this.justGrateDoNotStick
                    sticker.goChanging()
                }


                res.isolateMameshVerticesFromExteriorVertices()


                for (let ve of res.vertices){
                    if (ve.links.length==0) throw ' grating process produce a vertex with no links'
                }


                if (this.suppressLinksAngularlyTooClose){
                    this.SUB_linkCleanerByAngle.mamesh=res
                    //this.SUB_linkCleanerByAngle.vertexToPositioning=new mameshAroundComputations.PositioningComputerForMameshVertices(res).go()
                    this.SUB_linkCleanerByAngle.goChanging()
                    // let linkSort=new linkModule.LinksSorterAndCleanerByAngles(res,null)
                    // linkSort.suppressLinksAngularParam=this.suppressLinksAngle
                    // linkSort.goChanging()
                }


                if (this.addMissingPolygons) {
                    this.SUB_PolygonCreatorFromLinks.mamesh = res
                    this.SUB_PolygonCreatorFromLinks.go()
                }
                //let connect = new surfaceConnection.SurfaceConnectionProcess(mamesh, this.nbBiggerFacesDeleted, this.areaOrPerimeterChoice, this.fillConvexFaces);




                return res

            }

            //
            // closestVertexFromAMamesh(xyz:XYZ, mameshIndex:number):{vertex:Vertex;distToBorder:number} {
            //
            //     let IN_mamesh = this.IN_mameshes[mameshIndex]
            //     let closestVertex:Vertex = null
            //     let shortestDist = Number.MAX_VALUE
            //
            //
            //     for (let vertex of IN_mamesh.vertices) {
            //
            //         if (this.suppressedVertices.getValue(vertex) == null) {
            //             let dist = geo.distance(vertex.position, xyz)
            //             if (dist < shortestDist) {
            //                 shortestDist = dist
            //                 closestVertex = vertex
            //             }
            //         }
            //     }
            //
            //
            //     /**to be in the IN_mamesh, the xyz must be at the distance mameshesMaxDistToBe from a least one vertex*/
            //     if (closestVertex != null) {
            //         let minDistToBorder = Number.MAX_VALUE
            //         let count = 0
            //         IN_mamesh.vertices.forEach(vert=> {
            //             if (vert.hasMark(Vertex.Markers.border)) {
            //                 count++
            //                 let dist = geo.distance(closestVertex.position, vert.position)
            //                 if (dist < minDistToBorder) minDistToBorder = dist
            //             }
            //         })
            //
            //         return {vertex: closestVertex, distToBorder: minDistToBorder}
            //     }
            //     else {
            //         return null
            //     }
            // }
            //
            //
            //
            // findBestMamesh(xyz:XYZ):{vertex:Vertex;bestMamesh:Mamesh} {
            //
            //
            //     let maxDistToBorder = -1
            //     let chosenMamesh:Mamesh = null
            //     let chosenVertex:Vertex = null
            //
            //     for (let i = 0; i < this.IN_mameshes.length; i++) {
            //         let mam = this.IN_mameshes[i]
            //         let vertexAndDist = this.closestVertexFromAMamesh(xyz, i)
            //
            //         /** we chose the carte for which the point is the most central (the further from the border)*/
            //         if (vertexAndDist != null && vertexAndDist.distToBorder > maxDistToBorder) {
            //             maxDistToBorder = vertexAndDist.distToBorder
            //             chosenMamesh = mam
            //             chosenVertex = vertexAndDist.vertex
            //         }
            //     }
            //
            //     /**do not change at all the following error  message, it is tested in riemann-test*/
            //     if (chosenVertex == null) {
            //         throw 'strange, the xyz is not close to any IN_mamesh of the list'
            //     }
            //
            //     return {vertex: chosenVertex, bestMamesh: chosenMamesh}
            //
            // }

            //
            // private zeroToOtherMergingMap=new HashMap<Vertex,Vertex>(true)
            // private  constructSubGratedSubMameshes():void {
            //
            //     for (let i = 0; i < this.IN_mameshes.length; i++) {
            //         let IN_mamesh = this.IN_mameshes[i]
            //         let verticesToKeep:Vertex[] = []
            //         IN_mamesh.vertices.forEach(vertex=> {
            //             let vertAndMam = this.findBestMamesh(vertex.position)
            //             if (vertAndMam.bestMamesh != IN_mamesh) {
            //                 this.suppressedVertices.putValue(vertex, true)
            //                 if(i==0) this.zeroToOtherMergingMap.putValue(vertex,vertAndMam.vertex)
            //             }
            //             else verticesToKeep.push(vertex)
            //         })
            //
            //         let suber=new mameshModification.SubMameshExtractor(IN_mamesh,verticesToKeep)
            //
            //         if (this.overlapOnBorder){
            //             suber.minimalNumberOfVertexTooKeepASquare=1
            //             suber.minimalNumberOfVertexTooKeepATriangle=1
            //         }
            //         let subMesh=suber.goChanging()
            //         subMesh.isolateMameshVerticesFromExteriorVertices()
            //         this.OUTGratedMameshes.push(subMesh)
            //
            //         this.OUTBorderSquareToStick[i]=suber.OUTBorderSquare
            //         this.OUTBorderTriangleToStick[i]=suber.OUTBorderTriangle
            //         this.OUTBorderVerticesToStick[i]=[]
            //         for (let ve of this.OUTBorderSquareToStick[i]){
            //             /**it is less good to make merging only on suppressed-border vertices*/
            //             //if (this.suppressedVertices.getValue(ve)==true)
            //             this.OUTBorderVerticesToStick[i].push(ve)
            //         }
            //         for (let ve of this.OUTBorderTriangleToStick[i]){
            //             //if (this.suppressedVertices.getValue(ve)==true)
            //             this.OUTBorderVerticesToStick[i].push(ve)
            //         }
            //
            //     }
            //
            //
            //
            // }


            //private potentialReceiver:Vertex[]=[]

            // private stickAll():Mamesh{
            //     let res=this.OUTGratedMameshes[0]
            //     //let allPossibleReceiver:Vertex[]
            //
            //     for (let indexMamesh=1;indexMamesh<this.IN_mameshes.length;indexMamesh++){
            //         let map=new FindSickingMapFromVertices(res.vertices,this.OUTBorderVerticesToStick[indexMamesh]).goChanging()
            //         // for (let entry of this.zeroToOtherMergingMap.allEntries()){
            //         //     if (this.OUTGratedMameshes[indexMamesh].hasVertex(entry.value)) map.putValue(entry.value,entry.key)
            //         // }
            //         let merger=new Merger(res,this.OUTGratedMameshes[indexMamesh])
            //         merger.merginMap=map
            //         merger.goChanging()
            //
            //     }
            //
            //
            //     res.isolateMameshVerticesFromExteriorVertices()
            //
            //     return res
            //
            //     // let res=new HashMap<Vertex,Vertex>()
            //     //
            //     // for (let sourceVertex of this.OUTBorderVerticesToStick[sourceMeshIndex]){
            //     //     let receiverIndex=this.globalMergingMap.getValue(sourceVertex)
            //     //     if (this.IN_mameshes[receiverMameshIndex].hasVertex(receiverIndex)) res.putValue(sourceVertex,receiverIndex)
            //     // }
            //
            //
            // }

        }

        export interface HasPosition extends HasHashString{
            position:XYZ
        }

        export class Particle implements HasPosition,HasHashString{

            get position():XYZ{
                return new XYZ(0,0,0)
            }

            get hashString():string{
                return "toto"
            }



        }

        
        export class FindCloseVerticesFast{

            nbDistinctPoint=1000
            maxDistToBeClose:number=null
            
            
            throwExceptionIfReceiverHaveCloseVertices=false
            receiverAndSourceMustBeDisjoint=false
            
            private receivers:HasPosition[]
            private sources:HasPosition[]

            constructor(receivers:HasPosition[],sources:HasPosition[]){
                this.receivers=receivers
                this.sources=sources
            }

            /**default: no deformation*/
            deformationFunction=(point:XYZ)=>point

            
            go ():HashMap<HasPosition,HasPosition[]>{

                this.buildScaler()
                let amplitude=new XYZ(Math.max(1,this.maxs.x-this.mins.x),Math.max(1,this.maxs.y-this.mins.y),Math.max(1,this.maxs.z-this.mins.z) )


                let roundPositionToReceiver=new StringMap<HasPosition>()  //: {[id:string]:number}={}


                for (let receiver of this.receivers){
                    let val=this.deformationFunction(receiver.position)
                    let resx=Math.round( (val.x-this.mins.x)/amplitude.x*this.nbDistinctPoint)
                    let resy=Math.round( (val.y-this.mins.y)/amplitude.y*this.nbDistinctPoint)
                    let resz=Math.round( (val.z-this.mins.z)/amplitude.z*this.nbDistinctPoint)
                    let key=resx+','+resy+','+resz
                    if( roundPositionToReceiver.getValue(key)==null) roundPositionToReceiver.putValue(key,receiver)
                    else if (this.throwExceptionIfReceiverHaveCloseVertices) throw  'the receiver list has several XYZ very close, and you have forbidden that'
                }

                

                let res=new HashMap<HasPosition,HasPosition[]>(true)//:{[id:number]:number}={}


                for (let source of this.sources){
                    let val=this.deformationFunction(source.position)
                    let resx=Math.round( (val.x-this.mins.x)/ amplitude.x*this.nbDistinctPoint)
                    let resy=Math.round( (val.y-this.mins.y)/amplitude.y*this.nbDistinctPoint)
                    let resz=Math.round( (val.z-this.mins.z)/amplitude.z*this.nbDistinctPoint)

                    let receiverFounded:HasPosition=roundPositionToReceiver.getValue(resx+','+resy+','+resz)
                    if (receiverFounded!=null){
                        /** receiver and source can be the same list (ex : if we want to make a cylinder by bending a plan );
                         *  in this case, we do not want to associate each receiver to itself */
                        if (receiverFounded!=source) {
                            let perhapsAList:HasPosition[]=res.getValue(receiverFounded)
                            if (perhapsAList==null) res.putValue(source,[receiverFounded])
                            else {
                                /**some source already found near this receiver: we must put the closes source in the first position*/
                                if (geo.distance(receiverFounded.position,source.position)<geo.distance(receiverFounded.position,perhapsAList[0].position)){
                                    res.putValue(source,[receiverFounded].concat(perhapsAList))
                                }
                                else perhapsAList.push(receiverFounded)
                            }
                        }
                        else if (this.receiverAndSourceMustBeDisjoint) throw "receiver-list and source-list are not disjoint, and you have forbidden that"
                    }
                }


                // for (let i=0; i<this.sourceList.length; i++){
                //     let val=this.deformationFunction(this.sourceList[i].position)
                //     let resx=Math.round( (val.x-this.mins.x)/ amplitude.x*this.nbDistinctPoint)
                //     let resy=Math.round( (val.y-this.mins.y)/amplitude.y*this.nbDistinctPoint)
                //     let resz=Math.round( (val.z-this.mins.z)/amplitude.z*this.nbDistinctPoint)
                //
                //     let receiverFounded:Vertex=recepteurBalises[resx+','+resy+','+resz]
                //     if (receiverFounded!=null){
                //         if ()
                //        
                //     }
                //     if (this.receiverAndSourceMustBeDisjoint)
                //    
                //     if (baliseIndex!=null   ){
                //         if (this.sourceEqualRecepter){
                //             /**to avoid i-> i when sourceEqualRecepter*/
                //             if (baliseIndex!= i) res[i]=baliseIndex
                //         }
                //         else res[i]=baliseIndex
                //     }
                //
                // }


                return res
            }

            private mins=new XYZ(Number.MAX_VALUE,Number.MAX_VALUE,Number.MAX_VALUE)
            private maxs=new XYZ(-Number.MAX_VALUE,-Number.MAX_VALUE,-Number.MAX_VALUE)

            private buildScaler(){

                this.receivers.forEach((vv:Vertex)=>{

                    let v=this.deformationFunction(vv.position)

                    if (v.x<this.mins.x) this.mins.x=v.x
                    if (v.y<this.mins.y) this.mins.y=v.y
                    if (v.z<this.mins.z) this.mins.z=v.z

                    if (v.x>this.maxs.x) this.maxs.x=v.x
                    if (v.y>this.maxs.y) this.maxs.y=v.y
                    if (v.z>this.maxs.z) this.maxs.z=v.z

                })

                
                    this.sources.forEach((vv:Vertex)=>{
                        let v=this.deformationFunction(vv.position)

                        if (v.x<this.mins.x) this.mins.x=v.x
                        if (v.y<this.mins.y) this.mins.y=v.y
                        if (v.z<this.mins.z) this.mins.z=v.z

                        if (v.x>this.maxs.x) this.maxs.x=v.x
                        if (v.y>this.maxs.y) this.maxs.y=v.y
                        if (v.z>this.maxs.z) this.maxs.z=v.z

                    })
                

                if (this.maxDistToBeClose!=null){
                    this.nbDistinctPoint=geo.distance(this.maxs,this.mins)/this.maxDistToBeClose
                }

            }

            
        }
        
        

        export class Merger {

            /**
             * The receiver-mamesh eat some vertices of the source-mamesh
             * */

            /** key are source-vertices, values are receiver-vertices*/
            merginMap:HashMap<Vertex,Vertex>
            private receiverMamesh:Mamesh


            private sourceMamesh:Mamesh
            private sourceEqualRecepter = false

            //cleanDoubleLinks = false
            cleanDoubleSquareAndTriangles = true
            cleanLinksCrossingSegmentMiddle = true
            suppressSomeTriangleAndSquareSuperposition=false

            mergeLink = true
            mergeTrianglesAndSquares = true
            mergeSegmentsMiddle = true
            
            /**so that only the source is drawable*/
            destroySource=true

            //associateLinksWhichBecameOppositeFromMerging = true
            /**if null, no association is made*/
            //maxAngleToAssociateOppositeLink=Math.PI*0.4


            private checkArgs() {
                if (!this.merginMap.memorizeKeys) throw 'the merging map must memorize the keys'
                this.merginMap.allValues().forEach((v:Vertex)=> {
                    if (this.merginMap.getValue(v) != null) throw 'a vertex cannot be the destination and the source of a merging'
                })
            }

            constructor(receiverMamesh:Mamesh, sourceMamesh:Mamesh,map:HashMap<Vertex,Vertex[]>) {

                this.receiverMamesh = receiverMamesh

                if (sourceMamesh == null||receiverMamesh==sourceMamesh) {
                    this.sourceMamesh = receiverMamesh
                    this.sourceEqualRecepter = true
                }
                else {
                    this.sourceMamesh = sourceMamesh
                    this.sourceEqualRecepter = false
                }


                if (map==null) map=<HashMap<Vertex,Vertex[]>>new FindCloseVerticesFast(this.receiverMamesh.vertices,this.sourceMamesh.vertices).go()


                this.merginMap=new HashMap<Vertex,Vertex>(true)
                for (let entry of map.allEntries()) this.merginMap.putValue(entry.key,entry.value[0])



            }


            /**do the merging, changing the entry*/
            goChanging():void {


                this.checkArgs()


                if (this.mergeLink) this.mergeVerticesAndLinks()
                else this.mergeOnlyVertices()


                if (this.mergeTrianglesAndSquares) this.letsMergeTrianglesAndSquares()


                if (this.mergeSegmentsMiddle) this.mergeCutSegment()




                /**at the end, we rebuild paramToVertex, the third coordinate of parameter is changed to show the superposition */
                // this.receiverMamesh.paramToVertex = new HashMap<XYZ,Vertex>(true)
                // this.receiverMamesh.vertices.forEach(v=> {
                //     while (this.receiverMamesh.paramToVertex.getValue(v.param)!=null) {
                //         v.param.z++
                //     }
                //     this.receiverMamesh.paramToVertex.putValue(v.param, v)
                // })


                //this.receiverMamesh.clearOppositeInLinks()

                // if (this.maxAngleToAssociateOppositeLink!=null) {
                //     let oppositeLinkAssocier=new linkModule.OppositeLinkAssocierByAngles(this.receiverMamesh.vertices)
                //     oppositeLinkAssocier.maxAngleToAssociateLinks=this.maxAngleToAssociateOppositeLink
                //     oppositeLinkAssocier.goChanging()
                // }


                this.receiverMamesh.lines=null
                
                if (this.destroySource&& !this.sourceEqualRecepter) this.sourceMamesh.vertices=null
                
            }

            //
            // private buildMergingMap():void {
            //     let indexToMerge:{[key:number]:number}
            //
            //     this.merginMap = new HashMap<Vertex,Vertex>(true)
            //
            //     let positionsRecepter:XYZ[] = []
            //     this.receiverMamesh.vertices.forEach(v=> {
            //         positionsRecepter.push(v.position)
            //     })
            //
            //     if (this.sourceEqualRecepter) indexToMerge = new geometry.CloseXYZfinder(positionsRecepter,null,1000).go()
            //     else {
            //         let positionsSource:XYZ[] = []
            //         this.sourceMamesh.vertices.forEach(v=> {
            //             positionsSource.push(v.position)
            //         })
            //         indexToMerge = new geometry.CloseXYZfinder(positionsRecepter, positionsSource,1000).go()
            //     }
            //
            //
            //     for (let index in indexToMerge) {
            //         this.merginMap.putValue(this.sourceMamesh.vertices[index], this.receiverMamesh.vertices[indexToMerge[index]])
            //     }
            //
            // }


            private mergeOnlyVertices():void {

                if (!this.sourceEqualRecepter) this.receiverMamesh.vertices = this.receiverMamesh.vertices.concat(this.sourceMamesh.vertices)

                this.receiverMamesh.clearLinksAndLines()

                /**suppression of the sources*/
                this.merginMap.allKeys().forEach(v=> {
                    tab.removeFromArray(this.receiverMamesh.vertices, v)
                })

            }
            //
            // private mergeVerticesAndLinksOld():void {
            //
            //
            //     if (!this.sourceEqualRecepter) this.receiverMamesh.vertices = this.receiverMamesh.vertices.concat(this.sourceMamesh.vertices)
            //
            //
            //     this.merginMap.allKeys().forEach(v1=> {
            //
            //         var linksThatWeKeep:Link[] = []
            //         v1.links.forEach(link=> {
            //             /**the links must not be composed with suppressed vertex*/
            //             if (this.merginMap.getValue(link.to) == null || (link.opposite != null && this.merginMap.getValue(link.opposite.to) == null )) {
            //                 /** the link must not be contracted into one vertex after merging*/
            //                 if (this.merginMap.getValue(v1) != link.to) linksThatWeKeep.push(link)
            //             }
            //         })
            //         this.merginMap.getValue(v1).links = this.merginMap.getValue(v1).links.concat(linksThatWeKeep)
            //     })
            //
            //
            //     /**suppression of  sources*/
            //     this.merginMap.allKeys().forEach(v=> {
            //         removeFromArray(this.receiverMamesh.vertices, v)
            //     })
            //
            //
            //     /**we change links everywhere where a vertex-to-merge appears*/
            //     this.receiverMamesh.vertices.forEach((v1:Vertex)=> {
            //
            //         var perhapsLinkToSuppress:Link[] = null
            //         v1.links.forEach(link=> {
            //             if (this.merginMap.getValue(link.to) != null) {
            //                 if (this.merginMap.getValue(link.to) != v1) link.to = this.merginMap.getValue(link.to)
            //                 else {
            //                     if (perhapsLinkToSuppress == null) perhapsLinkToSuppress = []
            //                     perhapsLinkToSuppress.push(link)
            //                 }
            //             }
            //             if (link.opposite != null) {
            //                 if (this.merginMap.getValue(link.opposite.to) != null) {
            //                     if (this.merginMap.getValue(link.opposite.to) != v1) link.opposite.to = this.merginMap.getValue(link.opposite.to)
            //                     else link.opposite = null
            //                 }
            //             }
            //         })
            //         if (perhapsLinkToSuppress != null) {
            //             perhapsLinkToSuppress.forEach(li=> {
            //                 removeFromArray(v1.links, li)
            //             })
            //         }
            //
            //     })
            //
            //
            //     /** suppression of double links  with opposite equal to itself*/
            //     if (this.cleanDoubleLinks) {
            //
            //         this.receiverMamesh.vertices.forEach(vertex=> {
            //
            //             for (let link of vertex.links) {
            //                 if (link.opposite != null && (link.opposite.to.hashNumber == vertex.hashNumber || link.opposite.to.hashNumber == link.to.hashNumber )) link.opposite = null
            //             }
            //
            //             let dico = new HashMap<Vertex,number[]>()
            //             for (let i = 0; i < vertex.links.length; i++) {
            //                 let vert = vertex.links[i].to
            //                 if (dico.getValue(vert) == null) dico.putValue(vert, new Array<number>())
            //                 dico.getValue(vert).push(i)
            //
            //             }
            //
            //
            //
            //             /**we prefer to keep vertex with double links*/
            //
            //             let indexLinkToKeep:number[]=[]
            //             dico.allValues().forEach(linkIndices=> {
            //
            //                 if (linkIndices.length==1) indexLinkToKeep.push(linkIndices[0])
            //                 else if (linkIndices.length > 1) {
            //
            //                     let oneWithOpposite = -1
            //                     for (let ind of linkIndices) {
            //                         if (vertex.links[ind].opposite != null) {
            //                             oneWithOpposite = ind
            //                             break
            //                         }
            //                     }
            //                     if (oneWithOpposite != -1) {
            //                         //removeFromArray(linkIndices, oneWithOpposite)
            //                         indexLinkToKeep.push(oneWithOpposite)
            //                     }
            //                     else {
            //                         //linkIndices.pop()
            //                         indexLinkToKeep.push(linkIndices[0])
            //                     }
            //
            //
            //                 }
            //
            //             })
            //             vertex.links = arrayKeepingSomeIndices<Link>(vertex.links, indexLinkToKeep)
            //
            //             /**we remove malformation which can appears when removing links*/
            //             vertex.links.forEach(link=> {
            //                 if (link.opposite != null) {
            //                     if (link.opposite.opposite == null || link.opposite.opposite.to.hashNumber != link.to.hashNumber) link.opposite = null
            //                 }
            //             })
            //
            //
            //         })
            //
            //
            //     }
            //
            //
            //     this.receiverMamesh.vertices.forEach(central=> {
            //         for (let link of central.links) {
            //             let oppositeLink=link.opposite
            //
            //             if (oppositeLink != null) {
            //
            //                 if (central.links.indexOf(oppositeLink)==-1)
            //
            //                     if (oppositeLink.opposite!=link) throw "opposite of  opposite do not give the same link"
            //
            //             }
            //
            //         }
            //
            //     })
            //
            //
            //
            //
            //
            //
            //
            // }


            private mergeVerticesAndLinks():void {


                if (!this.sourceEqualRecepter) this.receiverMamesh.vertices = this.receiverMamesh.vertices.concat(this.sourceMamesh.vertices)


                /**first we clean all opposite (too hard to keep them, cf. Old procedure which too often create irregularities)*/
                this.receiverMamesh.clearOppositeInLinks()
                //     .vertices.forEach(v=>{
                //     v.links.forEach(l=>l.opposite=null)
                // })






                /**we add source-links to receivers, except some links */
                this.merginMap.allKeys().forEach(vSource=> {

                    let vReceiver=this.merginMap.getValue(vSource)


                    var linksThatWeKeep:Link[] = []
                    vSource.links.forEach(link=> {
                        /**the links must not be composed with suppressed vertex*/
                        if (this.merginMap.getValue(link.to) == null) {
                            /** the link must not be contracted into one vertex after merging*/
                            if (this.merginMap.getValue(vSource) != link.to) linksThatWeKeep.push(link)
                        }
                    })
                    vReceiver.links = vReceiver.links.concat(linksThatWeKeep)

                    /**useful for Reseau2dPlus, which use some special param to extract lines*/
                    if (vReceiver.param.x==0) vSource.param.x=0
                    if (vSource.param.y==0) vReceiver.param.y=0




                })

                /**suppression of  sources*/
                let newVertices:Vertex[]=[]
                this.receiverMamesh.vertices.forEach(v=>{
                    if (this.merginMap.allKeys().indexOf(v)==-1) newVertices.push(v)
                })
                this.receiverMamesh.vertices=newVertices


                // this.merginMap.allKeys().forEach(v=> {
                //     removeFromArray(this.recepterMamesh.vertices, v)
                // })


                /**we change links everywhere where a vertex-to-merge appears*/
                this.receiverMamesh.vertices.forEach((v1:Vertex)=> {

                    var perhapsLinkToSuppress:Link[] = null
                    v1.links.forEach(link=> {
                        if (this.merginMap.getValue(link.to) != null) {
                            if (this.merginMap.getValue(link.to) != v1) link.to = this.merginMap.getValue(link.to)
                            else {
                                if (perhapsLinkToSuppress == null) perhapsLinkToSuppress = []
                                perhapsLinkToSuppress.push(link)
                            }
                        }
                        // if (link.opposite != null) {
                        //     if (this.merginMap.getValue(link.opposite.to) != null) {
                        //         if (this.merginMap.getValue(link.opposite.to) != v1) link.opposite.to = this.merginMap.getValue(link.opposite.to)
                        //         else link.opposite = null
                        //     }
                        // }
                    })
                    if (perhapsLinkToSuppress != null) {
                        perhapsLinkToSuppress.forEach(li=> {
                            tab.removeFromArray(v1.links, li)
                        })
                    }

                })


                /** suppression of double links*/
                // if (this.cleanDoubleLinks) {
                //     //new linkModule.GraphCleaning(this.receiverMamesh.vertices).goChanging()
                //     //TODO
                // }










            }


            private mergeCutSegment():void {

                if (!this.sourceEqualRecepter) {
                    for (let key in this.sourceMamesh.cutSegmentsDico) this.receiverMamesh.cutSegmentsDico[key] = this.sourceMamesh.cutSegmentsDico[key]
                }


                for (let key in this.receiverMamesh.cutSegmentsDico) {

                    let segment = this.receiverMamesh.cutSegmentsDico[key]

                    if (segment.a.hashNumber == segment.middle.hashNumber || segment.b.hashNumber == segment.middle.hashNumber || segment.a.hashNumber == segment.b.hashNumber) {
                        delete this.receiverMamesh.cutSegmentsDico[key]
                        continue
                    }

                    let segmentIsModified = false

                    if (this.merginMap.getValue(segment.a) != null) {
                        segment.a = this.merginMap.getValue(segment.a)
                        segmentIsModified = true
                    }
                    if (this.merginMap.getValue(segment.b) != null) {
                        segment.b = this.merginMap.getValue(segment.b)
                        segmentIsModified = true
                    }
                    if (this.merginMap.getValue(segment.middle) != null) {
                        segment.middle = this.merginMap.getValue(segment.middle)
                        segmentIsModified = true
                    }

                    if (segmentIsModified) {
                        delete this.receiverMamesh.cutSegmentsDico[key]
                        this.receiverMamesh.cutSegmentsDico[Segment.segmentId(segment.a.hashNumber, segment.b.hashNumber)] = segment
                    }


                }

                if (this.cleanLinksCrossingSegmentMiddle) {

                    this.receiverMamesh.vertices.forEach(v=> {
                        let linkToDelete:number[] = []
                        for (let i = 0; i < v.links.length; i++) {
                            let link = v.links[i]
                            if (this.receiverMamesh.cutSegmentsDico[Segment.segmentId(v.hashNumber, link.to.hashNumber)] != null) linkToDelete.push(i)
                        }
                        v.links = tab.arrayMinusBlocksIndices(v.links, linkToDelete, 1)
                    })


                }


            }


            private letsMergeTrianglesAndSquares() {

                /**addition source triangulatedRect and square*/
                if (!this.sourceEqualRecepter) {
                    this.receiverMamesh.smallestSquares = this.receiverMamesh.smallestSquares.concat(this.sourceMamesh.smallestSquares)
                    this.receiverMamesh.smallestTriangles = this.receiverMamesh.smallestTriangles.concat(this.sourceMamesh.smallestTriangles)
                }


                /**changing triangulatedRect;  perhaps deleted*/
                for (let i = 0; i < this.receiverMamesh.smallestTriangles.length; i++) {
                    let vert = this.receiverMamesh.smallestTriangles[i]
                    if (this.merginMap.getValue(vert) != null) this.receiverMamesh.smallestTriangles[i] = this.merginMap.getValue(vert)
                }


                let triangleToSuppress:number[] = []
                for (let i = 0; i < this.receiverMamesh.smallestTriangles.length; i += 3) {
                    if (this.receiverMamesh.smallestTriangles[i] == this.receiverMamesh.smallestTriangles[i + 1] || this.receiverMamesh.smallestTriangles[i + 1] == this.receiverMamesh.smallestTriangles[i + 2] || this.receiverMamesh.smallestTriangles[i + 2] == this.receiverMamesh.smallestTriangles[i]) {
                        triangleToSuppress.push(i)
                    }
                }


                this.receiverMamesh.smallestTriangles = tab.arrayMinusBlocksIndices(this.receiverMamesh.smallestTriangles, triangleToSuppress, 3)
                /**to remove doublon*/
                this.receiverMamesh.smallestTriangles = new tab.ArrayMinusBlocksElements<Vertex>(this.receiverMamesh.smallestTriangles, 3).go()


                /**changing square; perhaps into triangulatedRect; perhaps deleted*/
                for (let i = 0; i < this.receiverMamesh.smallestSquares.length; i++) {
                    let vert = this.receiverMamesh.smallestSquares[i]
                    if (this.merginMap.getValue(vert) != null) this.receiverMamesh.smallestSquares[i] = this.merginMap.getValue(vert)
                }


                let squareToSuppress:number[] = []
                for (let i = 0; i < this.receiverMamesh.smallestSquares.length; i += 4) {
                    let changedSquare = this.changeOneSquare([this.receiverMamesh.smallestSquares[i], this.receiverMamesh.smallestSquares[i + 1], this.receiverMamesh.smallestSquares[i + 2], this.receiverMamesh.smallestSquares[i + 3]])
                    if (changedSquare == null) {
                        squareToSuppress.push(i)
                    }
                    else if (changedSquare.length == 3) {
                        this.receiverMamesh.smallestTriangles.push(changedSquare[0], changedSquare[1], changedSquare[2])
                        squareToSuppress.push(i)
                    }
                }


                this.receiverMamesh.smallestSquares = tab.arrayMinusBlocksIndices(this.receiverMamesh.smallestSquares, squareToSuppress, 4)
                /**to remove doublon*/
                if (this.cleanDoubleSquareAndTriangles) this.receiverMamesh.smallestSquares = new tab.ArrayMinusBlocksElements<Vertex>(this.receiverMamesh.smallestSquares, 4).go()


                if (this.suppressSomeTriangleAndSquareSuperposition) {
                    /**to remove triangulatedRect which superpose with square*/
                    let triInSquare = new StringMap<boolean>()
                    for (let i = 0; i < this.receiverMamesh.smallestSquares.length; i += 4) {
                        triInSquare.putValue(tab.indicesUpPermutationToString([this.receiverMamesh.smallestSquares[i].hashNumber, this.receiverMamesh.smallestSquares[i + 1].hashNumber, this.receiverMamesh.smallestSquares[i + 2].hashNumber]), true)
                        triInSquare.putValue(tab.indicesUpPermutationToString([this.receiverMamesh.smallestSquares[i + 2].hashNumber, this.receiverMamesh.smallestSquares[i + 3].hashNumber, this.receiverMamesh.smallestSquares[i].hashNumber]), true)
                        triInSquare.putValue(tab.indicesUpPermutationToString([this.receiverMamesh.smallestSquares[i].hashNumber, this.receiverMamesh.smallestSquares[i + 1].hashNumber, this.receiverMamesh.smallestSquares[i + 3].hashNumber]), true)
                        triInSquare.putValue(tab.indicesUpPermutationToString([this.receiverMamesh.smallestSquares[i + 1].hashNumber, this.receiverMamesh.smallestSquares[i + 2].hashNumber, this.receiverMamesh.smallestSquares[i + 3].hashNumber]), true)
                    }
                    let triToSupp:number[] = []
                    for (let i = 0; i < this.receiverMamesh.smallestTriangles.length; i += 3) {
                        let key = tab.indicesUpPermutationToString([this.receiverMamesh.smallestTriangles[i].hashNumber, this.receiverMamesh.smallestTriangles[i + 1].hashNumber, this.receiverMamesh.smallestTriangles[i + 2].hashNumber])
                        if (triInSquare.getValue(key)) {
                            triToSupp.push(i, i + 1, i + 2)
                        }
                    }
                    this.receiverMamesh.smallestTriangles = tab.arrayMinusBlocksIndices(this.receiverMamesh.smallestTriangles, triToSupp, 3)

                    /** remove square which superpose with square : two of the edge of the first are the diagonal of the second. We remove half of the first*/
                    let diago = new StringMap<boolean>()
                    for (let i = 0; i < this.receiverMamesh.smallestSquares.length; i += 4) {
                        diago.putValue(tab.indicesUpPermutationToString([this.receiverMamesh.smallestSquares[i].hashNumber, this.receiverMamesh.smallestSquares[i + 2].hashNumber]), true)
                        diago.putValue(tab.indicesUpPermutationToString([this.receiverMamesh.smallestSquares[i + 1].hashNumber, this.receiverMamesh.smallestSquares[i + 3].hashNumber]), true)
                    }

                    let squareToRemove:number[] = []
                    let triToAdd:Vertex[] = []
                    for (let i = 0; i < this.receiverMamesh.smallestSquares.length; i += 4) {
                        for (let k = 0; k < 4; k++) {
                            let edge0 = [this.receiverMamesh.smallestSquares[i + k].hashNumber, this.receiverMamesh.smallestSquares[i + (k + 1) % 4].hashNumber]
                            let edge1 = [this.receiverMamesh.smallestSquares[i + (k + 1) % 4].hashNumber, this.receiverMamesh.smallestSquares[i + (k + 2) % 4].hashNumber]
                            if (diago.getValue(tab.indicesUpPermutationToString(edge0)) && diago.getValue(tab.indicesUpPermutationToString(edge1))) {
                                squareToRemove.push(i, i + 1, i + 2, i + 3)
                                triToAdd.push(this.receiverMamesh.smallestSquares[i + (k + 2) % 4], this.receiverMamesh.smallestSquares[i + (k + 3) % 4], this.receiverMamesh.smallestSquares[i + k % 4])

                            }
                        }
                    }

                    if (triToAdd.length > 0) {
                        this.receiverMamesh.smallestSquares = tab.arrayMinusBlocksIndices(this.receiverMamesh.smallestSquares, squareToRemove, 4)
                        this.receiverMamesh.smallestTriangles = this.receiverMamesh.smallestTriangles.concat(triToAdd)
                    }
                }




            }

            private changeOneSquare(square:Vertex[]):Vertex[] {


                if (square[0] == square[2] || square[1] == square[3]) return null

                let indexOfCollabsed:number = null
                let nbOfCollapsed = 0
                for (let i = 0; i < 4; i++) {
                    if (square[i] == square[(i + 1) % 4]) {
                        nbOfCollapsed++
                        indexOfCollabsed = i
                    }
                }

                if (nbOfCollapsed == 0) return square

                if (nbOfCollapsed > 1) return null
                if (indexOfCollabsed == 0) return [square[1], square[2], square[3]]
                if (indexOfCollabsed == 1) return [square[2], square[3], square[0]]
                if (indexOfCollabsed == 2) return [square[3], square[0], square[1]]
                if (indexOfCollabsed == 3) return [square[0], square[1], square[2]]

            }


        }



        /**TODO add new polygon where we stick
         * we need to use the links sorting before*/
        export class Sticker{

            createNewLinks=true
            mamesh0:Mamesh
            mamesh1:Mamesh
            stickingMap:HashMap<Vertex,Vertex[]>

            cleanOppositeLinksAtBegin=true

            twoMameshes=true


            zIndex1=Math.random()

            // constructor(mamesh0:Mamesh,mamesh1:Mamesh,stickingMap:HashMap<Vertex,Vertex[]>|HashMap<Vertex,Vertex>){
            //
            //     if (mamesh0==mamesh1 || mamesh1==null) this.twoMameshes=false
            //
            //     this.mamesh0=mamesh0
            //
            //     if(this.twoMameshes) this.mamesh1=mamesh1
            //     else this.mamesh1=null
            //
            //     let entries=stickingMap.allEntries()
            //     if (entries.length==0) {
            //         logger.c('empty sticking map')
            //         this.stickingMap=new HashMap<Vertex,Vertex[]>(true)
            //     }
            //     else{
            //         if (!(entries[0].value instanceof Array)){
            //             this.stickingMap=new HashMap<Vertex,Vertex[]>(true)
            //             for (let entry of entries) {
            //                 let value=<Vertex> entry.value
            //                 this.stickingMap.putValue(entry.key,[value])
            //             }
            //         }
            //         else this.stickingMap=<HashMap<Vertex,Vertex[]>> stickingMap
            //     }
            //
            //
            //
            // }


            constructor(mamesh0:Mamesh,mamesh1:Mamesh,stickingMap:HashMap<Vertex,Vertex[]>){

                if (mamesh0==mamesh1 || mamesh1==null) this.twoMameshes=false
                this.mamesh0=mamesh0
                if(this.twoMameshes) this.mamesh1=mamesh1
                else this.mamesh1=null

                this.stickingMap=stickingMap


                // let entries=stickingMap.allEntries()
                // if (entries.length==0) {
                //     logger.c('empty sticking map')
                //     this.stickingMap=new HashMap<Vertex,Vertex[]>(true)
                // }
                // else{
                //     if (!(entries[0].value instanceof Array)){
                //         this.stickingMap=new HashMap<Vertex,Vertex[]>(true)
                //         for (let entry of entries) {
                //             let value=<Vertex> entry.value
                //             this.stickingMap.putValue(entry.key,[value])
                //         }
                //     }
                //     else this.stickingMap=<HashMap<Vertex,Vertex[]>> stickingMap
                // }



            }

            private checkArgs() {
                if (!this.stickingMap.memorizeKeys) throw 'the sticking map must memorize the keys'
                for (let vs of this.stickingMap.allValues()) {
                    for (let v of vs){
                        if (this.stickingMap.getValue(v) != null) throw 'a vertex cannot be the destination and the source of a sticking'
                    }
                }
            }


            goChanging(){
                
                if (this.stickingMap.allKeys().length==0) return
                
                this.checkArgs()
                

                if (this.cleanOppositeLinksAtBegin){
                    this.mamesh0.clearOppositeInLinks()
                    if (this.twoMameshes) this.mamesh1.clearOppositeInLinks()

                    // for (let mam of [this.mamesh0,this.mamesh1]){
                    //     for (let ve of mam.vertices){
                    //         for (let li of ve.links) li.opposite=null
                    //     }
                    // }
                }

                if (this.twoMameshes) {
                    for (let ve of this.mamesh1.vertices) {
                        ve.param.z = this.zIndex1
                        this.mamesh0.addVertex(ve)
                    }

                    this.mamesh0.smallestSquares=this.mamesh0.smallestSquares.concat(this.mamesh1.smallestSquares)
                    this.mamesh0.smallestTriangles=this.mamesh0.smallestTriangles.concat(this.mamesh1.smallestTriangles)

                }


                this.mamesh0.cutSegmentsDico={}
                this.mamesh0.vertexToPositioning=null
                this.mamesh0.lines=null


                if (this.createNewLinks) {
                    for (let vSource of this.stickingMap.allKeys()) {
                        for (let vReceiver of this.stickingMap.getValue(vSource)){
                            vSource.setOneLink(vReceiver)
                            vReceiver.setOneLink(vSource)
                        }

                    }
                }

            }


        }




    }
    
}