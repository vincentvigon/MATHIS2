/**
 * Created by vigon on 22/02/2016.
 */



module mathis {

    export module mameshModification {


        
        //import RadiusFunction = mathis.visu3d.LineGameoStatic.RadiusFunction;
        function completSegment(newParamForMiddle:(p1:XYZ, p2:XYZ)=>XYZ, mamesh:Mamesh, segment:Segment, orthogonalVertex?:Vertex):void {

            /**premier passage. Pas de milieu */
            if (segment.middle == null) {

                let position = new XYZ(0, 0, 0)
                geo.between(segment.a.position, segment.b.position, 0.5, position)
                segment.middle = mamesh.newVertex(position, Math.max(segment.a.dichoLevel, segment.b.dichoLevel) + 1, newParamForMiddle(segment.a.param, segment.b.param))

                if (segment.a.hasMark(Vertex.Markers.border)&& segment.b.hasMark(Vertex.Markers.border)) segment.middle.markers.push(Vertex.Markers.border)
                /**1 heure de perdue parce que j avais mis if (orthoIndex) au lieu de :if (orthoIndex!=null).
                 * Ne pas oublié que if(0) renvoit false !!! */
                if (orthogonalVertex != null) segment.orth1 = orthogonalVertex


            }
            /** second passage. On a déja mis le milieu*/
            else if (orthogonalVertex != null)  segment.orth2 = orthogonalVertex

        }


        export class TriangleDichotomer {

            mamesh:Mamesh
            makeLinks = true
            trianglesToCut:Vertex[] = null
            nbDicho=1

            /**what is the new param? Can be adapted, e.g. for cyclic parametrisation*/
            newParamForMiddle = (p1:XYZ, p2:XYZ)=> {
                let res = new XYZ(0, 0, 0)
                geo.between(p1, p2, 1 / 2, res)
                return res
            }


            constructor(mamesh:Mamesh) {
                this.mamesh = mamesh
            }


            checkArgs() {
                // if (!this.mamesh.linksOK && this.createNewLinks) {
                //     logger.c('be carefull : it is impossible to make links because links are not ok')
                //     this.createNewLinks = false
                // }
                // if (!this.createNewLinks) {
                //     this.mamesh.linksOK = false
                // }

                if (this.mamesh.smallestTriangles.length == 0) logger.c('no triangulatedRect for triangulatedRect dichotomy')

            }

            /** two methods to make your IN_mamesh thiner */
            go():void {

                this.checkArgs()
                
                if (!this.makeLinks) this.mamesh.clearLinksAndLines()
                /**else links and opposite are made during dichotomy process (which is not the case with squareDichotomer)*/

                let newTriangles:Array<Vertex>;

                if (this.trianglesToCut == null) {
                    this.trianglesToCut = this.mamesh.smallestTriangles
                    newTriangles = new Array<Vertex>();
                }
                else {
                    newTriangles = new tab.ArrayMinusBlocksElements<Vertex>(this.mamesh.smallestTriangles, 3, this.trianglesToCut).go()
                }


                //if (this.createNewLinks && !this.mamesh.linksOK) throw 'you cannot make links during dichotomy, because your links was not updated'

                //if (!this.createNewLinks) this.mamesh.linksOK = false


                let segments = this.createAndAddSegmentsFromTriangles(this.trianglesToCut)


                /**first passage : we add middle points everywhere, and create the segment list */

                for (let f = 0; f < this.trianglesToCut.length; f += 3) {
                    let v1:Vertex = this.trianglesToCut[f];
                    let v2:Vertex = this.trianglesToCut[f + 1];
                    let v3:Vertex = this.trianglesToCut[f + 2];

                    let segment3 = segments[Segment.segmentId(v1.hashNumber, v2.hashNumber)]
                    let segment1 = segments[Segment.segmentId(v2.hashNumber, v3.hashNumber)] //mesh.getSegmentFromIndex(v2,v3)
                    let segment2 = segments[Segment.segmentId(v3.hashNumber, v1.hashNumber)]//mesh.getSegmentFromIndex(v3,v1)

                    if (this.makeLinks) {
                        completSegment(this.newParamForMiddle, this.mamesh, segment3, v3)
                        completSegment(this.newParamForMiddle, this.mamesh, segment1, v1)
                        completSegment(this.newParamForMiddle, this.mamesh, segment2, v2)
                    }
                    else {
                        completSegment(this.newParamForMiddle, this.mamesh, segment3)
                        completSegment(this.newParamForMiddle, this.mamesh, segment1)
                        completSegment(this.newParamForMiddle, this.mamesh, segment2)
                    }


                    let f3 = segment3.middle
                    let f1 = segment1.middle
                    let f2 = segment2.middle

                    //let f3 = getMiddlePoint(mesh.vertices, v1, v2, v3);
                    //let f1 = getMiddlePoint(mesh.vertices, v2, v3, v1);
                    //let f2 = getMiddlePoint(mesh.vertices, v3, v1, v2);

                    newTriangles.push(v1, f3, f2)
                    newTriangles.push(v2, f1, f3)
                    newTriangles.push(v3, f2, f1)
                    newTriangles.push(f3, f1, f2)


                }


                if (this.makeLinks) {

                    for (let segId in segments) {

                        let segment = segments[segId]


                        let segA1 = segments[Segment.segmentId(segment.a.hashNumber, segment.orth1.hashNumber)]
                        let segB1 = segments[Segment.segmentId(segment.b.hashNumber, segment.orth1.hashNumber)]

                        if (segment.orth2 != null) {

                            let segA2 = segments[Segment.segmentId(segment.a.hashNumber, segment.orth2.hashNumber)]
                            let segB2 = segments[Segment.segmentId(segment.b.hashNumber, segment.orth2.hashNumber)]

                            segment.middle.setTwoOppositeLinks(segA1.middle, segB2.middle)
                            segment.middle.setTwoOppositeLinks(segA2.middle, segB1.middle)
                        }
                        else {
                            segment.middle.setOneLink(segA1.middle)
                            segment.middle.setOneLink(segB1.middle)

                        }
                        try {

                            let changeFleArrival=(v:Vertex,old:Vertex,newVoi:Vertex)=>{
                                let fle =v.findLink(old)
                                fle.to=newVoi
                            }
                            changeFleArrival(segment.a,segment.b, segment.middle)
                            changeFleArrival(segment.b,segment.a, segment.middle)
                            segment.middle.setTwoOppositeLinks(segment.a, segment.b)
                        }
                        catch (e) {
                            throw 'a bad segment, probably your triangles are not corrects (e.g. one missing, or one more)'
                        }
                    }
                }


                //at the end, only the last ilist is kept : this is the list of the thiner triangles.
                this.mamesh.smallestTriangles = newTriangles;


            }


            //private removeTriangleFromList(longList:Vertex[],listToRemove:Vertex[]):Vertex[]{
            //
            //
            //    let  funcToSort=function(a:number, b:number){return a-b}
            //    function key(i,list:Vertex[]):string{
            //        let array=[list[i].hash,list[i+1].hash,list[i+2].hash]
            //        array.sort(funcToSort)
            //        return array[0]+','+array[1]+','+array[2]
            //    }
            //
            //    let dicoToRemove:{ [id:string]:boolean }={}
            //
            //    for (let i=0;i<listToRemove.length;i+=3){
            //        dicoToRemove[key(i,listToRemove)]=true
            //    }
            //
            //    let newLongList=new Array<Vertex>()
            //    for (let i=0;i<longList.length;i+=3){
            //        if (!dicoToRemove[key(i,longList)]){
            //            newLongList.push(longList[i],longList[i+1],longList[i+2])
            //        }
            //    }
            //
            //    return newLongList
            //
            //}


            private createAndAddSegmentsFromTriangles(triangles:Array<Vertex>):{[id:string]:Segment} {

                let segments:{[id:string]:Segment} = {}


                for (let f = 0; f < triangles.length; f += 3) {

                    let v1 = triangles[f];
                    let v2 = triangles[f + 1];
                    let v3 = triangles[f + 2];

                    this.mamesh.getOrCreateSegment(v1, v2, segments)
                    this.mamesh.getOrCreateSegment(v2, v3, segments)
                    this.mamesh.getOrCreateSegment(v3, v1, segments)

                }

                return segments
            }


        }

        
        /** mauvais interaction avec le triangle dichotomer : but quand on fait la dicho sur des polyhedrons */
        export class SquareDichotomer {
            mamesh:Mamesh
            makeLinks=true

            constructor(mamesh:Mamesh) {
                this.mamesh = mamesh
            }

            squareToCut:Vertex[] = null
            dichoStyle = SquareDichotomer.DichoStyle.fourSquares

            /**what is the new param? Can be adapted, e.g. for cyclic parametrisation*/
            newParamForMiddle = (p1:XYZ, p2:XYZ)=> {
                let res = new XYZ(0, 0, 0)
                geo.between(p1, p2, 1 / 2, res)
                return res
            }
            newParamForCenter = (p1:XYZ, p2:XYZ, p3:XYZ, p4:XYZ)=> {
                let res = new XYZ(0, 0, 0)
                geo.baryCenter([p1, p2, p3, p4], [1 / 4, 1 / 4, 1 / 4, 1 / 4], res)
                return res
            }


            checkArgs() {
                // if (this.mamesh.linksOK) {
                //     logger.c('you  break  existing links')
                //     this.mamesh.linksOK = false
                //
                // }

                if (this.mamesh.smallestSquares.length == 0) throw 'no square for square dichotomy'

                this.mamesh.clearLinksAndLines()

            }

            go():void {

                this.checkArgs()


                let newSquares:Vertex[]

                if (this.squareToCut == null) {
                    this.squareToCut = this.mamesh.smallestSquares
                    newSquares = new Array<Vertex>()
                }
                else {
                    /**we keep square that we do not want to cut*/
                    newSquares = new tab.ArrayMinusBlocksElements<Vertex>(this.mamesh.smallestSquares, 4, this.squareToCut).go()
                }


                let segments = this.createAndAddSegmentsFromSquare(this.squareToCut)


                /**first passage : we add middle points everywhere, and create the segment list */

                for (let f = 0; f < this.squareToCut.length; f += 4) {
                    let v1 = this.squareToCut[f];
                    let v2 = this.squareToCut[f + 1];
                    let v3 = this.squareToCut[f + 2];
                    let v4 = this.squareToCut[f + 3];


                    let segment1 = segments[Segment.segmentId(v1.hashNumber, v2.hashNumber)]
                    let segment2 = segments[Segment.segmentId(v2.hashNumber, v3.hashNumber)]
                    let segment3 = segments[Segment.segmentId(v3.hashNumber, v4.hashNumber)]
                    let segment4 = segments[Segment.segmentId(v4.hashNumber, v1.hashNumber)]

                    completSegment(this.newParamForMiddle, this.mamesh, segment1)
                    completSegment(this.newParamForMiddle, this.mamesh, segment2)
                    completSegment(this.newParamForMiddle, this.mamesh, segment3)
                    completSegment(this.newParamForMiddle, this.mamesh, segment4)


                    let f1 = segment1.middle
                    let f2 = segment2.middle
                    let f3 = segment3.middle
                    let f4 = segment4.middle

                    if (this.dichoStyle == SquareDichotomer.DichoStyle.fourSquares) {

                        let position = new XYZ(0, 0, 0)
                        geo.baryCenter([segment1.a.position, segment1.b.position, segment3.a.position, segment3.b.position], [1 / 4, 1 / 4, 1 / 4, 1 / 4], position)
                        let dichoLevel = Math.max(segment1.a.dichoLevel, segment1.b.dichoLevel, segment3.a.dichoLevel, segment3.b.dichoLevel) + 1
                        let center = this.mamesh.newVertex(position, dichoLevel, this.newParamForCenter(segment1.a.param, segment1.b.param, segment3.a.param, segment3.b.param))

                        /** we chose arbitrary to put the new point on the middle of the segment (f1,f3), it could also be (f2,f4). This is important for the fractal construction that each new point is in a middle a a single segment */
                        let aNewCetSegment = new Segment(f1, f3)
                        aNewCetSegment.middle = center
                        this.mamesh.cutSegmentsDico[Segment.segmentId(f1.hashNumber, f3.hashNumber)] = aNewCetSegment


                        newSquares.push(v1, f1, center, f4)
                        newSquares.push(v2, f2, center, f1)
                        newSquares.push(v3, f3, center, f2)
                        newSquares.push(v4, f4, center, f3)

                    }
                    else if (this.dichoStyle == SquareDichotomer.DichoStyle.fourTriangles) {

                        newSquares.push(f1, f2, f3, f4)
                        this.mamesh.smallestTriangles.push(v1, f1, f4)
                        this.mamesh.smallestTriangles.push(v2, f2, f1)
                        this.mamesh.smallestTriangles.push(v3, f3, f2)
                        this.mamesh.smallestTriangles.push(v4, f4, f3)

                    }
                    else throw 'ho ho'
                }


                //at the end, only the last ilist is kept : this is the list of the thiner triangles.
                this.mamesh.smallestSquares = newSquares;
                
                //TODO : heavy works because links are not made during dichotomy process
                if (this.makeLinks){
                    let linker=new linkModule.LinkCreatorSorterAndBorderDetectorByPolygons(this.mamesh)
                    linker.goChanging()
                }


            }


            //private removeSquareFromList(longList:Vertex[],listToRemove:Vertex[]):Vertex[]{
            //
            //
            //    let  funcToSort=function(a:number, b:number){return a-b}
            //
            //    function key(i,list:Vertex[]):string{
            //        let array=[list[i].hash,list[i+1].hash,list[i+2].hash,list[i+3].hash]
            //        array.sort(funcToSort)
            //        return array[0]+','+array[1]+','+array[2]+','+array[3]
            //    }
            //
            //    let dicoToRemove:{ [id:string]:boolean }={}
            //
            //    for (let i=0;i<listToRemove.length;i+=4){
            //        dicoToRemove[key(i,listToRemove)]=true
            //    }
            //
            //    let newLongList=new Array<Vertex>()
            //    for (let i=0;i<longList.length;i+=4){
            //        if (dicoToRemove[key(i,longList)]!=null){
            //            newLongList.push(longList[i],longList[i+1],longList[i+2],longList[i+3])
            //        }
            //    }
            //
            //    return newLongList
            //
            //}


            private createAndAddSegmentsFromSquare(squares:Array<Vertex>):{[id:string]:Segment} {

                let segments:{[id:string]:Segment} = {}

                for (let f = 0; f < squares.length; f += 4) {

                    let v1 = squares[f];
                    let v2 = squares[f + 1];
                    let v3 = squares[f + 2];
                    let v4 = squares[f + 3];

                    this.mamesh.getOrCreateSegment(v1, v2, segments)
                    this.mamesh.getOrCreateSegment(v2, v3, segments)
                    this.mamesh.getOrCreateSegment(v3, v4, segments)
                    this.mamesh.getOrCreateSegment(v4, v1, segments)

                }

                return segments
            }


        }



        export class SimplestSquareDichotomer {
            mamesh:Mamesh
            makeLinks=true

            constructor(mamesh:Mamesh) {
                this.mamesh = mamesh
            }

            squareToCut:Vertex[] = null
            dichoStyle = SquareDichotomer.DichoStyle.fourSquares

            /**what is the new param? Can be adapted, e.g. for cyclic parametrisation*/
            newParamForMiddle = (p1:XYZ, p2:XYZ)=> {
                let res = new XYZ(0, 0, 0)
                geo.between(p1, p2, 1 / 2, res)
                return res
            }
            newParamForCenter = (p1:XYZ, p2:XYZ, p3:XYZ, p4:XYZ)=> {
                let res = new XYZ(0, 0, 0)
                geo.baryCenter([p1, p2, p3, p4], [1 / 4, 1 / 4, 1 / 4, 1 / 4], res)
                return res
            }


            checkArgs() {

                if (this.mamesh.smallestSquares.length == 0) throw 'no square for square dichotomy'

                this.mamesh.clearLinksAndLines()

            }

            go():void {

                this.checkArgs()


                let newSquares:Vertex[]

                if (this.squareToCut == null) {
                    this.squareToCut = this.mamesh.smallestSquares
                    newSquares = new Array<Vertex>()
                }
                else {
                    /**we keep square that we do not want to cut*/
                    newSquares = new tab.ArrayMinusBlocksElements<Vertex>(this.mamesh.smallestSquares, 4, this.squareToCut).go()
                }


                let segments = this.createAndAddSegmentsFromSquare(this.squareToCut)


                /**first passage : we add middle points everywhere, and create the segment list */

                for (let f = 0; f < this.squareToCut.length; f += 4) {
                    let v1 = this.squareToCut[f];
                    let v2 = this.squareToCut[f + 1];
                    let v3 = this.squareToCut[f + 2];
                    let v4 = this.squareToCut[f + 3];


                    let segment1 = segments[Segment.segmentId(v1.hashNumber, v2.hashNumber)]
                    let segment2 = segments[Segment.segmentId(v2.hashNumber, v3.hashNumber)]
                    let segment3 = segments[Segment.segmentId(v3.hashNumber, v4.hashNumber)]
                    let segment4 = segments[Segment.segmentId(v4.hashNumber, v1.hashNumber)]

                    completSegment(this.newParamForMiddle, this.mamesh, segment1)
                    completSegment(this.newParamForMiddle, this.mamesh, segment2)
                    completSegment(this.newParamForMiddle, this.mamesh, segment3)
                    completSegment(this.newParamForMiddle, this.mamesh, segment4)


                    let f1 = segment1.middle
                    let f2 = segment2.middle
                    let f3 = segment3.middle
                    let f4 = segment4.middle

                    if (this.dichoStyle == SquareDichotomer.DichoStyle.fourSquares) {

                        let position = new XYZ(0, 0, 0)
                        geo.baryCenter([segment1.a.position, segment1.b.position, segment3.a.position, segment3.b.position], [1 / 4, 1 / 4, 1 / 4, 1 / 4], position)
                        let dichoLevel = Math.max(segment1.a.dichoLevel, segment1.b.dichoLevel, segment3.a.dichoLevel, segment3.b.dichoLevel) + 1
                        let center = this.mamesh.newVertex(position, dichoLevel, this.newParamForCenter(segment1.a.param, segment1.b.param, segment3.a.param, segment3.b.param))

                        /** we chose arbitrary to put the new point on the middle of the segment (f1,f3), it could also be (f2,f4). This is important for the fractal construction that each new point is in a middle a a single segment */
                        let aNewCetSegment = new Segment(f1, f3)
                        aNewCetSegment.middle = center
                        this.mamesh.cutSegmentsDico[Segment.segmentId(f1.hashNumber, f3.hashNumber)] = aNewCetSegment


                        newSquares.push(v1, f1, center, f4)
                        newSquares.push(v2, f2, center, f1)
                        newSquares.push(v3, f3, center, f2)
                        newSquares.push(v4, f4, center, f3)

                    }
                    else if (this.dichoStyle == SquareDichotomer.DichoStyle.fourTriangles) {

                        newSquares.push(f1, f2, f3, f4)
                        this.mamesh.smallestTriangles.push(v1, f1, f4)
                        this.mamesh.smallestTriangles.push(v2, f2, f1)
                        this.mamesh.smallestTriangles.push(v3, f3, f2)
                        this.mamesh.smallestTriangles.push(v4, f4, f3)

                    }
                    else throw 'ho ho'
                }


                //at the end, only the last ilist is kept : this is the list of the thiner triangles.
                this.mamesh.smallestSquares = newSquares;

                //TODO : heavy works because links are not made during dichotomy process
                if (this.makeLinks){
                    let linker=new linkModule.LinkCreatorSorterAndBorderDetectorByPolygons(this.mamesh)
                    linker.goChanging()
                }


            }


            //private removeSquareFromList(longList:Vertex[],listToRemove:Vertex[]):Vertex[]{
            //
            //
            //    let  funcToSort=function(a:number, b:number){return a-b}
            //
            //    function key(i,list:Vertex[]):string{
            //        let array=[list[i].hash,list[i+1].hash,list[i+2].hash,list[i+3].hash]
            //        array.sort(funcToSort)
            //        return array[0]+','+array[1]+','+array[2]+','+array[3]
            //    }
            //
            //    let dicoToRemove:{ [id:string]:boolean }={}
            //
            //    for (let i=0;i<listToRemove.length;i+=4){
            //        dicoToRemove[key(i,listToRemove)]=true
            //    }
            //
            //    let newLongList=new Array<Vertex>()
            //    for (let i=0;i<longList.length;i+=4){
            //        if (dicoToRemove[key(i,longList)]!=null){
            //            newLongList.push(longList[i],longList[i+1],longList[i+2],longList[i+3])
            //        }
            //    }
            //
            //    return newLongList
            //
            //}


            private createAndAddSegmentsFromSquare(squares:Array<Vertex>):{[id:string]:Segment} {

                let segments:{[id:string]:Segment} = {}

                for (let f = 0; f < squares.length; f += 4) {

                    let v1 = squares[f];
                    let v2 = squares[f + 1];
                    let v3 = squares[f + 2];
                    let v4 = squares[f + 3];

                    this.mamesh.getOrCreateSegment(v1, v2, segments)
                    this.mamesh.getOrCreateSegment(v2, v3, segments)
                    this.mamesh.getOrCreateSegment(v3, v4, segments)
                    this.mamesh.getOrCreateSegment(v4, v1, segments)

                }

                return segments
            }


        }



        export module SquareDichotomer {

            export enum DichoStyle{fourSquares, fourTriangles}

        }


        export class HexahedronSubdivider {
            mamesh : Mamesh;
            subdivider : number = 3;
            hexahedronsToCut? : Vertex[] = null;
            suppressVolumes? : [number,number,number][] = null;

            private createdPointsPerSegment : {[id:string]:Vertex[]} = {};
            private createdPointsPerSurface : {[id:string]:Vertex[][]} = {};
            newHexahedrons : Vertex[] = null;
            private points : Vertex[][][] = null;

            constructor(mamesh : Mamesh) {
                this.mamesh = mamesh;
            }

            checkArgs() {
                if((this.hexahedronsToCut == null && this.mamesh.hexahedrons.length == 0) ||
                   (this.hexahedronsToCut != null && this.hexahedronsToCut.length == 0))
                    logger.c("HexahedronSubdivider : No input");

            }

            go() : void {
                this.checkArgs();
                if(this.hexahedronsToCut == null)
                    this.hexahedronsToCut = this.mamesh.hexahedrons;

                this.points = new Array(this.subdivider + 1);
                for(let i = 0;i <= this.subdivider;i++) {
                    this.points[i] = new Array(this.subdivider + 1);
                    for(let j = 0;j <= this.subdivider;j++)
                        this.points[i][j] = new Array(this.subdivider + 1);
                }

                // TODO : Supprimer les sommets / faces non utilisés par l'utilisation de this.suppressVolumes
                //   (actuellement si le bord n'a plus besoin d'un sommet, il est gardé dans l'original
                // TODO : + Triangles
                this.subdivideHexahedrons();
            }

            private subdivideHexahedronInVertices(h : number) {
                let n = this.subdivider;
                const coordsList = [[0,0,0],[n,0,0],[n,0,n],[0,0,n],[0,n,n],[0,n,0],[n,n,0],[n,n,n]];

                coordsList.forEach(([i,j,k],l) => { this.points[i][j][k] = this.hexahedronsToCut[h+l]; });

                const segmentList = [[0,1],[1,2],[2,3],[3,0],
                                     [0,5],[1,6],[2,7],[3,4],
                                     [4,5],[5,6],[6,7],[7,4]];
                for(let [na,nb] of segmentList) {
                    let el = Hash.segment(this.hexahedronsToCut[h+na],this.hexahedronsToCut[h+nb]);
                    if(this.hexahedronsToCut[h+na].hashNumber > this.hexahedronsToCut[h+nb].hashNumber)
                        [na,nb] = [nb,na];

                    let [i1,j1,k1] = coordsList[na];
                    let [i2,j2,k2] = coordsList[nb];
                    for(let l = 1;l < n;l++)
                        this.points[i1 + (i2 - i1) / n * l][j1 + (j2 - j1) / n * l][k1 + (k2 - k1) / n * l] = this.createdPointsPerSegment[el][l];
                }

                const surfacesList = [[0,1,2,3],[4,7,6,5],
                                      [0,3,4,5],[1,6,7,2],
                                      [2,7,4,3],[0,5,6,1]];
                for(let [na,nb,nc,nd] of surfacesList) {
                    let el = Hash.quad(this.hexahedronsToCut[h+na],this.hexahedronsToCut[h+nb],this.hexahedronsToCut[h+nc],this.hexahedronsToCut[h+nd]);
                    while(this.hexahedronsToCut[h+na].hashNumber > this.hexahedronsToCut[h+nb].hashNumber ||
                          this.hexahedronsToCut[h+na].hashNumber > this.hexahedronsToCut[h+nc].hashNumber ||
                          this.hexahedronsToCut[h+na].hashNumber > this.hexahedronsToCut[h+nd].hashNumber)
                        [na,nb,nc,nd] = [nb,nc,nd,na];
                    if(this.hexahedronsToCut[h+nb].hashNumber > this.hexahedronsToCut[h+nd].hashNumber)
                        [nb,nd] = [nd,nb];

                    let [i1,j1,k1] = coordsList[na];
                    let [i2,j2,k2] = coordsList[nb];
                    let [i3,j3,k3] = coordsList[nc];
                    // let [i4,j4,k4] = coordsList[nd];
                    for(let l = 1;l < n;l++)
                        for(let m = 1;m < n;m++)
                            this.points[i1 + (i2 - i1) / n * l + (i3 - i2) / n * m]
                                       [j1 + (j2 - j1) / n * l + (j3 - j2) / n * m]
                                       [k1 + (k2 - k1) / n * l + (k3 - k2) / n * m] = this.createdPointsPerSurface[el][l][m];
                }

                for(let i = 1;i < n;i++) {
                    for(let j = 1;j < n;j++) {
                        for(let k = 1;k < n;k++) {
                            let pos = new XYZ(0,0,0);
                            let x = i/n;
                            let y = j/n;
                            let z = k/n;
                            geo.baryCenter([this.hexahedronsToCut[h  ].position,this.hexahedronsToCut[h+1].position,
                                            this.hexahedronsToCut[h+2].position,this.hexahedronsToCut[h+3].position,
                                            this.hexahedronsToCut[h+4].position,this.hexahedronsToCut[h+5].position,
                                            this.hexahedronsToCut[h+6].position,this.hexahedronsToCut[h+7].position],
                                           [(1-x)*(1-y)*(1-z),   x *(1-y)*(1-z),
                                               x *(1-y)*   z ,(1-x)*(1-y)*   z ,
                                            (1-x)*   y *   z ,(1-x)*   y *(1-z),
                                               x *   y *(1-z),   x *   y *   z ],
                                           pos);
                            this.points[i][j][k] = this.mamesh.newVertex(pos);
                        }
                    }
                }
            }

            private makeNewHexahedronsFromPoints() {
                if(this.suppressVolumes == null)
                    this.suppressVolumes = [];

                let n = this.subdivider;
                for(let i = 0;i < n;i++) {
                    for(let j = 0;j < n;j++) {
                        for(let k = 0;k < n;k++) {
                            if(this.suppressVolumes.some(function (value) { // WARNING : Arguments missing
                                    return value[0] == i && value[1] == j && value[2] == k;
                                }))
                                continue;

                            this.newHexahedrons.push.apply(this.newHexahedrons,
                                                      [this.points[i  ][j  ][k  ],this.points[i+1][j  ][k  ],
                                                       this.points[i+1][j  ][k+1],this.points[i  ][j  ][k+1],
                                                       this.points[i  ][j+1][k+1],this.points[i  ][j+1][k  ],
                                                       this.points[i+1][j+1][k  ],this.points[i+1][j+1][k+1]]
                            );
                        }
                    }
                }
            }

            private makeSurfacesVertices() : void {
                const list = [[0,1,2,3],[4,7,6,5],
                              [0,3,4,5],[1,6,7,2],
                              [2,7,4,3],[0,5,6,1]];
                for(let h = 0;h < this.hexahedronsToCut.length;h += 8) {
                    for(let [i,j,k,l] of list) {
                        if(this.createdPointsPerSurface[Hash.quad(this.hexahedronsToCut[h+i],this.hexahedronsToCut[h+j],this.hexahedronsToCut[h+k],this.hexahedronsToCut[h+l])] == null)
                            this.createdPointsPerSurface[Hash.quad(this.hexahedronsToCut[h+i],this.hexahedronsToCut[h+j],this.hexahedronsToCut[h+k],this.hexahedronsToCut[h+l])] =
                                this.subdivideSurface(this.hexahedronsToCut[h+i],this.hexahedronsToCut[h+j],this.hexahedronsToCut[h+k],this.hexahedronsToCut[h+l]);
                    }
                }
            }

            private makeSegmentsVertices() : void {
                const list = [[0,1],[1,2],[2,3],[3,0],
                              [0,5],[1,6],[2,7],[3,4],
                              [4,5],[5,6],[6,7],[7,4]];
                for(let k = 0;k < this.hexahedronsToCut.length;k += 8) {
                    for(let [i,j] of list) {
                        if(this.createdPointsPerSegment[Hash.segment(this.hexahedronsToCut[k+i],this.hexahedronsToCut[k+j])] == null)
                            this.createdPointsPerSegment[Hash.segment(this.hexahedronsToCut[k+i],this.hexahedronsToCut[k+j])] =
                                this.subdivideSegment(this.hexahedronsToCut[k+i],this.hexahedronsToCut[k+j]);
                    }
                }
            }

            private subdivideSegment(a : Vertex,b : Vertex) : Vertex[] {
                [a,b] = Hash.segmentOrd(a,b);

                let vertices : Vertex[] = [];
                let n = this.subdivider;

                for(let i = 1;i < n;i++) {
                    let pos = new XYZ(0,0,0);
                    let x = i/n;
                    geo.baryCenter([a.position,b.position],
                                   [1-x,x], pos);
                    vertices[i] = this.mamesh.newVertex(pos);
                }

                return vertices;
            }

            private subdivideSurface(a : Vertex,b : Vertex,c : Vertex,d : Vertex) : Vertex[][] {
                [a,b,c,d] = Hash.quadOrd(a,b,c,d);

                let vertices : Vertex[][] = [];
                let n = this.subdivider;

                for(let i = 1;i < n;i++) {
                    vertices[i] = [];
                    for(let j = 1;j < n;j++) {
                        let pos = new XYZ(0,0,0);
                        let [x,y] = [j/n,i/n];
                        geo.baryCenter([a.position,b.position,c.position,d.position],
                                       [(1-x)*(1-y),x*(1-y),x*y,(1-x)*y], pos);
                        vertices[i][j] = this.mamesh.newVertex(pos);
                    }
                }

                return vertices;
            }

            private subdivideHexahedrons() {
                this.makeSegmentsVertices();
                this.makeSurfacesVertices();

                let s = this.hexahedronsToCut.length/8;
                this.newHexahedrons = [];
                for(let i = 0;i < s;i++) {
                    this.subdivideHexahedronInVertices(i*8);
                    this.makeNewHexahedronsFromPoints();
                }
            }

        }


        export class SurfacesFromHexahedrons {
            mamesh : Mamesh;
            hexahedronsToDraw? : Vertex[] = null;
            private newSurfaces : Vertex[] = null;
            private surfacesSet : {[id : string] : Vertex[]} = {};

            constructor(mamesh : Mamesh) {
                this.mamesh = mamesh;
            }

            checkArgs() {
                if((this.hexahedronsToDraw == null && (this.mamesh.hexahedrons == null || this.mamesh.hexahedrons.length == 0))
                    || (this.hexahedronsToDraw != null && this.hexahedronsToDraw.length == 0))
                    logger.c("SurfacesFromHexahedrons : No input");
            }

            go() : void {
                this.checkArgs();
                if(this.hexahedronsToDraw == null)
                    this.hexahedronsToDraw = this.mamesh.hexahedrons;

                const surfacesList = [[0,3,2,1],[4,5,6,7],
                                      [0,5,4,3],[1,2,7,6],
                                      [2,3,4,7],[0,1,6,5]];

                this.newSurfaces = [];
                for(let h = 0;h < this.hexahedronsToDraw.length;h += 8) {
                    for(let [i,j,k,l] of surfacesList) {
                        let hash = Hash.quad(this.hexahedronsToDraw[h+i],this.hexahedronsToDraw[h+j],
                                             this.hexahedronsToDraw[h+k],this.hexahedronsToDraw[h+l]);
                        if(this.surfacesSet[hash] == null)
                            this.surfacesSet[hash] = [this.hexahedronsToDraw[h+i],this.hexahedronsToDraw[h+j],
                                                      this.hexahedronsToDraw[h+k],this.hexahedronsToDraw[h+l]];
                        else
                            delete this.surfacesSet[hash];
                    }
                }


                for(let el in this.surfacesSet)
                    this.newSurfaces.push.apply(this.newSurfaces,this.surfacesSet[el]);


                let len = this.newSurfaces.length;
                for(let i = 0;i < len;i += 5000)
                    this.mamesh.smallestSquares.push.apply(this.mamesh.smallestSquares,this.newSurfaces.slice(i,i+5000));

            }

        }


        export class MameshDeepCopier {

            oldMamesh:Mamesh
            copyCutSegmentsDico = true
            copyLines = true

            constructor(oldMamesh:Mamesh) {
                this.oldMamesh = oldMamesh
            }

            go():Mamesh {
                let o2n = new HashMap<Vertex,Vertex>()

                let newMamesh = new Mamesh()

                this.oldMamesh.vertices.forEach(oldV=> {
                    let param = XYZ.newFrom(oldV.param)
                    let newVertex = newMamesh.newVertex(oldV.position, oldV.dichoLevel, param)
                    o2n.putValue(oldV, newVertex)
                    newVertex.importantMarker = oldV.importantMarker
                    oldV.markers.forEach(enu=>newVertex.markers.push(enu))

                })

                this.oldMamesh.vertices.forEach(oldV=> {
                    let newV = o2n.getValue(oldV)
                    for (let i = 0; i < oldV.links.length; i++) {
                        newV.links[i] = new Link(o2n.getValue(oldV.links[i].to))
                    }
                    for (let i = 0; i < oldV.links.length; i++) {
                        let oldLink = oldV.links[i]
                        let newLink = newV.links[i]

                        if (oldLink.opposites!=null){
                            newLink.opposites=[]

                            for (let li of oldLink.opposites){
                                let liIndex = oldV.links.indexOf(li)
                                newLink.opposites.push(newV.links[liIndex])
                            }

                        }

                        // if (oldLink.opposite != null) {
                        //     let oppositeIndex = oldV.links.indexOf(oldLink.opposite)
                        //     let newLink = newV.links[i]
                        //     newLink.opposite = newV.links[oppositeIndex]
                        //
                        //
                        // }
                    }


                })

                this.oldMamesh.smallestTriangles.forEach(v=> {
                    newMamesh.smallestTriangles.push(o2n.getValue(v))
                })
                this.oldMamesh.smallestSquares.forEach(v=> {
                    newMamesh.smallestSquares.push(o2n.getValue(v))
                })

                if (this.copyLines) {
                    if (this.oldMamesh.linesWasMade) {
                        let oldStraight=this.oldMamesh.getStraightLinesAsVertices()
                        let oldLoop=this.oldMamesh.getLoopLinesAsVertices()
                        newMamesh.lines = []
                        oldStraight.forEach(line=> {
                                let newLine:Vertex[] = []
                                line.forEach(v=> {
                                    newLine.push(o2n.getValue(v))
                                })
                                newMamesh.lines.push(new Line(newLine,false))
                            })
                        
                            oldLoop.forEach(line=> {
                                let newLine:Vertex[] = []
                                line.forEach(v=> {
                                    newLine.push(o2n.getValue(v))
                                })
                                newMamesh.lines.push(new Line(newLine,true))
                            })
                        
                    }
                }


                //newMamesh.linksOK = this.oldMamesh.linksOK

                if (this.copyCutSegmentsDico) {
                    for (let key in this.oldMamesh.cutSegmentsDico) {
                        let oldSegment = this.oldMamesh.cutSegmentsDico[key]
                        let newA = o2n.getValue(oldSegment.a)
                        let newB = o2n.getValue(oldSegment.b)

                        let newSegment = new Segment(newA, newB)
                        newSegment.middle = o2n.getValue(oldSegment.middle)
                        if (oldSegment.orth1 != null) newSegment.orth1 = o2n.getValue(oldSegment.orth1)
                        if (oldSegment.orth2 != null) newSegment.orth2 = o2n.getValue(oldSegment.orth2)

                        newMamesh.cutSegmentsDico[Segment.segmentId(newA.hashNumber, newB.hashNumber)] = newSegment
                    }
                }
                else this.copyCutSegmentsDico = null

                return newMamesh

            }


        }



    
        
        export class PercolationOnLinks{
            
            IN_vertices:Vertex[]

            percolationProba=0.5
            probaToPercolateFunction=(vertex:Vertex)=>{
                if (vertex.links.length==3) return 0
                if (vertex.links.length==4) return 0.3*this.percolationProba
                if (vertex.links.length==5) return 0.6*this.percolationProba
                if (vertex.links.length>=6) return this.percolationProba
            }

            SUB_random=new proba.Random()
            doNotPercolateOnBorder=true
            
            maxPercolationForAVertexAlreadyPercolate=0
            
            constructor(mameshOrVertices:Mamesh|Vertex[]){
                if (mameshOrVertices instanceof Mamesh) {
                    this.IN_vertices=mameshOrVertices.vertices
                }
                else {
                    this.IN_vertices=mameshOrVertices
                }
            }
            
            goChanging(){
                if (this.IN_vertices==null) throw 'vertices must be specifiate'

                let vertexToNbLink=new HashMap<Vertex,number>()
                for (let v of this.IN_vertices) vertexToNbLink.putValue(v,v.links.length)

                for (let v of this.IN_vertices){

                    if ( !(this.doNotPercolateOnBorder && v.hasMark(Vertex.Markers.border))) {
                        if (this.SUB_random.pseudoRand()<this.probaToPercolateFunction(v)){
                            let randInd = this.SUB_random.pseudoRandInt(v.links.length)
                            let randVoi = v.links[randInd].to
                            if (randVoi.links.length>=vertexToNbLink.getValue(randVoi)-this.maxPercolationForAVertexAlreadyPercolate) Vertex.separateTwoVoisins(v, randVoi)
                        }
                    }
                }
            }
            
        }


    }
}


