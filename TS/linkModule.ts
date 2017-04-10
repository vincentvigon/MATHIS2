/**
 * Created by vigon on 23/02/2016.
 */


module mathis{


    export module linkModule{
        
        export class SimpleLinkFromPolygonCreator{
            
            mamesh:Mamesh
            constructor(mamesh:Mamesh){
                this.mamesh=mamesh
            }
            
            goChanging(){
                
                this.mamesh.clearLinksAndLines()
                
                let alreadyCreatedLinks=new StringMap<boolean>()
                
                for (let poly of this.mamesh.polygons){
                       for (let i=0;i<poly.length;i++){
                           let segmentId=Segment.segmentId(poly[i].hashNumber,poly[(i+1)%poly.length].hashNumber)
                           if (alreadyCreatedLinks.getValue(segmentId)==null){
                               alreadyCreatedLinks.putValue(segmentId,true)
                               poly[i].setOneLink(poly[(i+1)%poly.length])
                               poly[(i+1)%poly.length].setOneLink(poly[i])
                           }
                           
                       }
                }
            }
            
            
        }
        


        //TODO create LinksSorterByPolygons, already in linkModule module
        export class LinksSorterAndCleanerByAngles{

            
            suppressLinksAngularlyTooCloseVersusNot=true
            suppressLinksAngularParam=2*Math.PI*0.1
            keepShorterLinksVersusGiveSomePriorityToLinksWithOpposite=true
            
            
            mamesh:Mamesh
            /**links cleaning require the normals*/
            vertexToPositioning:HashMap<Vertex,Positioning>

            constructor(mamesh:Mamesh,private normals?:XYZ|HashMap<Vertex,Positioning>){
                this.mamesh=mamesh
            }

            

            goChanging(){

                if (this.mamesh==null) throw 'mamesh is null'

                if (this.normals == null) this.vertexToPositioning = new mameshAroundComputations.PositioningComputerForMameshVertices(this.mamesh).go()
                else if (this.normals instanceof HashMap) this.vertexToPositioning = <HashMap<Vertex,Positioning>> this.normals
                else if (this.normals instanceof XYZ) {
                    this.vertexToPositioning = new HashMap<Vertex,Positioning>()
                    let positioning = new Positioning()
                    positioning.upVector = <XYZ> this.normals
                    for (let vertex of this.mamesh.vertices) this.vertexToPositioning.putValue(vertex, positioning)
                }





                
                this.mamesh.vertices.forEach(center=>{


                    //cc('center',center)
                    let vectorLinks:XYZ[]=[]
                    for (let i=0;i<center.links.length;i++){
                        vectorLinks[i]=new XYZ(0,0,0).copyFrom(center.links[i].to.position).substract(center.position)
                        if (vectorLinks[i].length()<geo.epsilon) throw 'a IN_mamesh with two voisins at the same position'
                    }

                    let angles:{angle:number;i:number}[]=[]
                    angles.push(
                        {
                            angle:0,
                            i:0
                        })


                    let normal=this.vertexToPositioning.getValue(center).upVector
                    

                    for (let i=1;i<center.links.length;i++){
                        angles.push(
                            {
                                angle:geo.angleBetweenTwoVectorsBetweenMinusPiAndPi(vectorLinks[0],vectorLinks[i],normal),
                                i:i
                            })
                    }


                    angles.sort((a,b)=>a.angle-b.angle)


                    let newLinks:Link[]=[]

                    for (let k=0;k<angles.length;k++){
                        //cc(angles[k])
                        newLinks.push(center.links[angles[k].i])
                    }
                    center.links=newLinks



                    // let linksToSuppress:Link[]=[]
                    // for (let k=0;k<angles.length;k++){
                    //     let diff=modulo(angles[(k+1)%angles.length].angle-angles[k].angle,2*Math.PI,true)
                    //     if (Math.abs(diff)<this.minimalAngleBetweenLinks) {
                    //         let link0=center.links[angles[k].i]
                    //         let link1=center.links[angles[(k+1)%angles.length].i]
                    //         /**we favorise link with opposite*/
                    //         if (link0.opposite==null&& link1.opposite!=null) linksToSuppress.push(link0)
                    //         else linksToSuppress.push(link1)
                    //     }
                    // }
                    //
                    // for (let link of linksToSuppress){
                    //     if (link.opposite!=null) link.opposite.opposite=null
                    //     removeFromArray(center.links,link)
                    //     link.to.suppressOneLink(center,false)
                    // }


                })


                if (this.suppressLinksAngularlyTooCloseVersusNot) this.letsSuppressLinks()
            }
            
            private letsSuppressLinks(){

                for (let center of this.mamesh.vertices){




                    let currentIndex=0

                    let oneMoreTime=true


                    while (oneMoreTime && center.links.length>=2){


                        oneMoreTime=false
                        for (let k=currentIndex;k<currentIndex+center.links.length;k++){

                            let i=k%center.links.length
                            let ii=(k+1)%center.links.length
                            let vecti=XYZ.newFrom(center.links[i].to.position).substract(center.position)
                            let vectii=XYZ.newFrom(center.links[ii].to.position).substract(center.position)
                            let angle=geo.angleBetweenTwoVectorsBetween0andPi(vecti,vectii)
                            if (angle<this.suppressLinksAngularParam){
                                /**next time we will start to check from the next index*/
                                let disti=geo.distance(center.position,center.links[i].to.position)
                                let distii=geo.distance(center.position,center.links[ii].to.position)
                                let linkToSuppress:Link

                                if (this.keepShorterLinksVersusGiveSomePriorityToLinksWithOpposite){
                                    if (disti<distii)  linkToSuppress=center.links[ii]
                                    else linkToSuppress=center.links[i]
                                }
                                else{
                                    let ratio=disti/(disti+distii)

                                    /**if length are comparable, we favorise links with opposite*/
                                    if (ratio<0.6 && ratio>0.4){
                                        if (center.links[ii].opposites==null &&center.links[i].opposites!=null) linkToSuppress=center.links[ii]
                                        else linkToSuppress=center.links[i]
                                    }
                                    /** else we favorise shortest links */
                                    else{
                                        if (disti<distii)  linkToSuppress=center.links[ii]
                                        else linkToSuppress=center.links[i]
                                    }
                                }



                                Vertex.separateTwoVoisins(center,linkToSuppress.to)

                                // removeFromArray(center.links,linkToSuppress)
                                // if (linkToSuppress.opposite!=null) linkToSuppress.opposite.opposite=null
                                // linkToSuppress.to.suppressOneLink(center,true)

                                oneMoreTime=true
                                currentIndex=(ii+1)

                                break
                            }
                        }




                    }
                }


            }


        }


        export class OppositeLinkAssocierByAngles{

            vertices:Vertex[]
            
            maxAngleToAssociateLinks=Math.PI*0.3//0.3

            /**to make bifurcation on a vertex where two link are exactly aligned  (this shape: _\_ )   ,you must put a value >=1  */
            //propToleranceForBifurcation=0.2
            
            clearAllExistingOppositeBefore=false

            canCreateBifurcations=true
            doNotBranchOnBorder=false
            
            OUT_nbBranching=0
            
            
            
            constructor(vertices:Vertex[]){this.vertices=vertices}
            
            
            private associateOppositeLinks(){

                let verticeCoupleToSeparateAtTheEnd:Vertex[][]=[]

                this.vertices.forEach(center=>{



                    let valence=0
                    for (let li of center.links) if (li.opposites==null) valence++

                    let vectorLinks:XYZ[]=[]
                    for (let i=0;i<center.links.length;i++){
                        vectorLinks[i]=new XYZ(0,0,0).copyFrom(center.links[i].to.position).substract(center.position)
                        if(vectorLinks[i].lengthSquared()<geo.epsilonSquare) throw 'the IN_mamesh has two voisins at the same position'
                    }

                    let allAngleBetweenLinks:{angle:number;i:number;j:number}[]=[]

                    let bestAngle:number[]=[]
                    for (let i=0;i<center.links.length;i++){
                        bestAngle[i]=Number.POSITIVE_INFINITY

                        for (let j=i+1;j<center.links.length;j++){

                            let angle=Math.abs(modulo(geo.angleBetweenTwoVectorsBetween0andPi(vectorLinks[i],vectorLinks[j])-Math.PI,Math.PI*2,true))
                            /**keep only small angle. We do not touch to existing opposites; but opposite could had been clear at the begin of this*/
                            if (angle<this.maxAngleToAssociateLinks&& (center.links[i].opposites==null && center.links[j].opposites==null)) {
                                if (angle<bestAngle[i]) bestAngle[i]=angle

                                allAngleBetweenLinks.push({
                                    angle: angle,
                                    i: i,
                                    j: j
                                })
                            }

                            //cc(center.hashNumber,modulo(geo.angleBetweenTwoVectorsBetween0andPi(vectorLinks[i],vectorLinks[j])-Math.PI,Math.PI*2,true)  ,vectorLinks[i],vectorLinks[j])
                        }
                    }


                    // if (center.links.length>6){
                    //
                    //     let worstLinkIndex=tab.maxIndex(bestAngle)
                    //     verticeCoupleToSeparateAtTheEnd.push([center,center.links[worstLinkIndex].to])
                    //     //Vertex.separateTwoVoisins(center,center.links[worstLinkIndex].to)
                    //     // allAngleBetweenLinks = arrayMinusElements(allAngleBetweenLinks, (el)=> {
                    //     //     return el.i == worstLinkIndex || el.j == worstLinkIndex
                    //     // })
                    //
                    // }












                    //allAngleBetweenLinks=arrayMinusElements(allAngleBetweenLinks,(elem)=>{return elem.angle>this.maxAngleToAssociateLinks})
                    //
                    // if (!this.clearAllExistingOppositeBefore){
                    //     allAngleBetweenLinks=arrayMinusElements(allAngleBetweenLinks,(elem)=>{return })
                    // }

                    allAngleBetweenLinks.sort((a,b)=>b.angle-a.angle)


                    if (  !this.canCreateBifurcations  ||  (this.doNotBranchOnBorder&&center.hasMark(Vertex.Markers.border))) {

                        while (allAngleBetweenLinks.length > 0) {

                            var elem = allAngleBetweenLinks.pop()

                            let link0:Link = center.links[elem.i]
                            let link1:Link = center.links[elem.j]

                            // if (link0.opposites != null) allAngleBetweenLinks = arrayMinusElements(allAngleBetweenLinks, (el)=> {
                            //     return el.i == elem.i || el.j == elem.i
                            // })
                            // else if (link1.opposites != null) allAngleBetweenLinks = arrayMinusElements(allAngleBetweenLinks, (el)=> {
                            //     return el.i == elem.j || el.j == elem.j
                            // })
                            // else {
                                link0.opposites = [link1]
                                link1.opposites = [link0]
                                allAngleBetweenLinks = tab.arrayMinusElements(allAngleBetweenLinks, (el)=> {
                                    return el.i == elem.i || el.j == elem.i || el.i == elem.j || el.j == elem.j
                                })
                            //}
                        }

                        // while (allAngleBetweenLinks.length > 0) {
                        //     let ind = 0
                        //     var elem = allAngleBetweenLinks[ind]
                        //
                        //     let link0:Link = center.links[elem.i]
                        //     let link1:Link = center.links[elem.j]
                        //
                        //     if (link0.opposites != null) allAngleBetweenLinks = arrayMinusElements(allAngleBetweenLinks, (el)=> {
                        //         return el.i == elem.i || el.j == elem.i
                        //     })
                        //
                        //
                        //     if (link1.opposites != null) allAngleBetweenLinks = arrayMinusElements(allAngleBetweenLinks, (el)=> {
                        //         return el.i == elem.j || el.j == elem.j
                        //     })
                        //
                        //     if (link0.opposites == null && link1.opposites == null) {
                        //         link0.opposites = [link1]
                        //         link1.opposites = [link0]
                        //         allAngleBetweenLinks = arrayMinusElements(allAngleBetweenLinks, (el)=> {
                        //             return el.i == elem.i || el.j == elem.i || el.i == elem.j || el.j == elem.j
                        //         })
                        //     }
                        //     ind++
                        // }
                    }
                    else{


                        while (allAngleBetweenLinks.length > 0) {
                            //cc('allAngleBetweenLinks',allAngleBetweenLinks.length)
                            var elem = allAngleBetweenLinks.pop()
                            var nextElem= allAngleBetweenLinks[allAngleBetweenLinks.length-1]

                            let link0:Link
                            let link1:Link
                            let link2:Link
                            //if (nextElem!=null&& (nextElem.angle-elem.angle)/(elem.angle+nextElem.angle+0.00001)<this.propToleranceForBifurcation) {

                            if(valence==3 && nextElem!=null){
                                if (elem.i==nextElem.i){
                                    link0=center.links[elem.i]
                                    link1=center.links[elem.j]
                                    link2=center.links[nextElem.j]
                                }
                                else if (elem.i==nextElem.j){
                                    link0=center.links[elem.i]
                                    link1=center.links[elem.j]
                                    link2=center.links[nextElem.i]
                                }
                                else if (elem.j==nextElem.i){
                                    link0=center.links[elem.j]
                                    link1=center.links[elem.i]
                                    link2=center.links[nextElem.j]
                                }
                                else if (elem.j==nextElem.j){
                                    link0=center.links[elem.j]
                                    link1=center.links[elem.i]
                                    link2=center.links[nextElem.i]
                                }
                                else {
                                    link0=center.links[elem.i]
                                    link1=center.links[elem.j]
                                }
                            }
                            else {
                                link0=center.links[elem.i]
                                link1=center.links[elem.j]
                            }

                            if (link2==null){
                                link0.opposites = [link1]
                                link1.opposites = [link0]
                                allAngleBetweenLinks = tab.arrayMinusElements(allAngleBetweenLinks, (el)=> {
                                    return el.i == elem.i || el.j == elem.i || el.i == elem.j || el.j == elem.j
                                })
                                valence-=2
                            }
                            else {
                                this.OUT_nbBranching++
                                allAngleBetweenLinks.pop()
                                link0.opposites=[link1,link2]
                                link1.opposites=[link0]
                                link2.opposites=[link0]
                                valence-=1

                                allAngleBetweenLinks = tab.arrayMinusElements(allAngleBetweenLinks, (el)=> {
                                    return el.i == elem.i || el.j == elem.i || el.i == elem.j || el.j == elem.j || el.i == nextElem.i || el.j == nextElem.i || el.i == nextElem.j || el.j == nextElem.j
                                })
                            }




                        }


                    }


                })

                // for (let pair of verticeCoupleToSeparateAtTheEnd){
                //     Vertex.separateTwoVoisins(pair[0],pair[1])
                // }


            }
            
            
            // private findOneBadLinkIndex(){
            //     for (let v of this.vertices){
            //         if (v.links.length>=5){
            //             for (let i=0;i<v.links.length;i++){
            //                 let li=v.links[i]
            //                 if (li.opposites==null) return i
            //             }
            //         }
            //     }
            //     return null
            // }
            
            
            
            goChanging():void{

                
                if (this.clearAllExistingOppositeBefore) {
                    this.vertices.forEach(v=>{
                        v.links.forEach((li:Link)=>{
                            li.opposites=null
                        })
                    })

                }

                
                if(this.maxAngleToAssociateLinks!=null) this.associateOppositeLinks()

                



            }

        }

        
        
        // export class GraphCleaning{
        //
        //     vertices:Vertex[]
        //
        //     constructor(vertices:Vertex[]){
        //         this.vertices=vertices
        //     }
        //
        //     goChanging():void{
        //
        //         this.cleanDoubleLinksKeepingInPriorityThoseWithOpposite()
        //
        //     }
        //
        //     private cleanDoubleLinksKeepingInPriorityThoseWithOpposite(){
        //
        //
        //         this.vertices.forEach(vertex=> {
        //           
        //             /**dico of links to keep*/
        //             let dico = new HashMap<Vertex,Link>()
        //             let linksToDelete:Link[]=[]
        //             for (let link of vertex.links) {
        //
        //                 if (dico.getValue(link.to)==null) dico.putValue(link.to,link)
        //                 else {
        //                     if (dico.getValue(link.to).opposites==null && link.opposites!=null ) {
        //                         linksToDelete.push(dico.getValue(link.to))
        //                         dico.putValue(link.to,link)
        //                     }
        //                     else linksToDelete.push(link)
        //                 }
        //             }
        //           
        //             for (let link of linksToDelete){
        //                 removeFromArray(vertex.links,link)
        //                 if (link.opposite!=null) link.opposite.opposite=null
        //             }
        //
        //           
        //
        //
        //
        //         })
        //
        //     }
        //   
        // }


        export class LinkCreaterSorterAndBorderDetecterByPolygons{

            mamesh:Mamesh



            /**
             * a T jonction is that
             *   7
             *   |
             * - 5
             *   |
             *   6
             *
             * or that
             *
             *   7
             *  \|
             * - 5
             *  /|
             *   6
             *
             * in this case we add
             * XXXTJonction: {[id:5]:[7,6]}
             *
             * */

            interiorTJonction=new HashMap<Vertex,boolean>()//:{[id:number]:boolean}={}
            borderTJonction=new HashMap<Vertex,Vertex[]>()
            forcedOpposite=new HashMap<Vertex,Vertex[]>()


            /**build by createPolygonesFromSmallestTrianglesAnSquares */
            private polygonesAroundEachVertex=new HashMap<Vertex,Polygone[]>()
            private polygones : Array<Polygone>=[]

            /** an isolate vertex is a corner which belongs only to one polygone.  */
            markIsolateVertexAsCorner=true
            markBorder=true
            forceOppositeLinksAtCorners=false



            constructor( mamesh:Mamesh){this.mamesh=mamesh}


            goChanging():void{
                this.checkArgs()
                this.createPolygonesFromSmallestTrianglesAnSquares()
                this.detectBorder()
                this.createLinksTurningAround()
                this.makeLinksFinaly()

                //this.mamesh.linksOK=true
            }


            private checkArgs(){
                if ((this.mamesh.smallestSquares==null || this.mamesh.smallestSquares.length==0) && (this.mamesh.smallestTriangles==null || this.mamesh.smallestTriangles.length==0)) throw 'no triangles nor squares given'

                this.mamesh.clearLinksAndLines()

            }


            private createPolygonesFromSmallestTrianglesAnSquares():void{



                for (let i = 0; i < this.mamesh.smallestTriangles.length; i += 3) {

                    this.polygones.push(new Polygone([
                        this.mamesh.smallestTriangles[i],
                        this.mamesh.smallestTriangles[i + 1],
                        this.mamesh.smallestTriangles[i + 2],
                    ]));
                }

                for (let i = 0; i < this.mamesh.smallestSquares.length; i += 4) {

                    this.polygones.push(new Polygone([
                        this.mamesh.smallestSquares[i],
                        this.mamesh.smallestSquares[i + 1],
                        this.mamesh.smallestSquares[i + 2],
                        this.mamesh.smallestSquares[i + 3],
                    ]));
                }

                for (let polygone of this.polygones){
                    let length=polygone.points.length
                    for (let i=0;i<length;i++){
                        let vert1=polygone.points[i%length]
                        let vert2=polygone.points[(i+1)%length]
                        this.subdivideSegment(polygone,vert1,vert2,this.mamesh.cutSegmentsDico)
                    }
                }


                this.mamesh.vertices.forEach(v=>{
                    this.polygonesAroundEachVertex.putValue(v,new Array<Polygone>())
                })

                this.polygones.forEach((poly:Polygone)=>{
                    poly.points.forEach((vert:Vertex)=>{
                        this.polygonesAroundEachVertex.getValue(vert).push(poly)
                    })
                })
                //cc('polygonesAroundEachVertex',this.polygonesAroundEachVertex.toString())



                if (this.markIsolateVertexAsCorner){
                    this.mamesh.vertices.forEach(v=>{
                        if (this.polygonesAroundEachVertex.getValue(v).length==1) {
                            v.markers.push(Vertex.Markers.corner)
                            logger.c('new corners was added when we automatically create then links from the triangulatedRect/square')
                        }
                    })
                }


                //for (let poly of this.polygones) {
                //    for (let vert of poly.points){
                //    }
                //}



            }


            private detectBorder():void{

                for (let ind=0; ind<this.mamesh.vertices.length;ind++){

                    var center:Vertex=this.mamesh.vertices[ind]
                    let polygonesAround:Polygone[]=this.polygonesAroundEachVertex.getValue(center)

                    /**we look at all the polygon aroung a vertex (the center) we count the number of times that a vertex appear as a border of a polygon*/
                    var segmentMultiplicity=new HashMap<Vertex,number>(true)//:{[id:number]:number} = {}
                    for (let polygone of polygonesAround) {
                        let twoAngles = polygone.theTwoAnglesAdjacentFrom(center)
                        let side0id = twoAngles[0]
                        let side1id = twoAngles[1]

                        if (segmentMultiplicity.getValue(side0id) == null) segmentMultiplicity.putValue(side0id, 1)
                        else segmentMultiplicity.putValue(side0id,segmentMultiplicity.getValue(side0id)+1)



                        if (segmentMultiplicity.getValue(side1id) == null) segmentMultiplicity.putValue(side1id, 1)
                        else segmentMultiplicity.putValue(side1id,segmentMultiplicity.getValue(side1id)+1)


                        //if (segmentMultiplicity[side1id] == null) segmentMultiplicity[side1id] = 1
                        //else segmentMultiplicity[side1id]++

                    }

                    var count = 0;

                    segmentMultiplicity.allKeys().forEach((key:Vertex)=>{
                        if (segmentMultiplicity.getValue(key) == 1) {
                            count++;
                            if(this.borderTJonction.getValue(center)==null) {
                                this.borderTJonction.putValue(center,new Array<Vertex>())
                                if (this.markBorder) center.markers.push(Vertex.Markers.border)
                            }
                            /**we colect the link in a T-jonction*/
                            this.borderTJonction.getValue(center).push(key)

                        }
                        else if (segmentMultiplicity.getValue(key) > 2) throw " non conform mesh: a link appear strictly more than 2 times as side of polygones turning around a vertex   "
                    })


                    if (!(count == 0 || count == 2)) throw "strange mesh (perhaps too holy): the vertex: "+center.toString(0)+" has:"+count+" link with multiplicity 1"
                }

            }


            private createLinksTurningAround():void{


                let doIi=(v:Vertex,vv:Vertex)=>{
                    let cutSegment = this.mamesh.cutSegmentsDico[Segment.segmentId(v.hashNumber, vv.hashNumber)]
                    if (cutSegment != null) {
                        if (this.interiorTJonction.getValue(cutSegment.middle) != null) {
                            console.log('attention, une double interiorTjonction')
                        }
                        else this.interiorTJonction.putValue(cutSegment.middle, true)
                        this.forcedOpposite.putValue(cutSegment.middle,[v, vv])
                    }
                }

                /** we detect polygone with several colinear points  */
                for (let polygone of this.polygones){
                    let length=polygone.points.length
                    if (length>3){

                        if (length==4){
                            doIi(polygone.points[0],polygone.points[2])
                            doIi(polygone.points[1],polygone.points[3])

                        }
                        else{
                            for (let i=0;i<length;i++){
                                let v=polygone.points[i]
                                let vv=polygone.points[(i+2)%length]
                                doIi(v,vv)
                            }
                        }


                    }

                }




                this.mamesh.vertices.forEach((central:Vertex)=> {

                    //list of polygones which have the central cell at one angle
                    // be careful : in very exceptional case, this list can have only one element
                    let polygonesAround:Polygone[] = this.polygonesAroundEachVertex.getValue(central)


                    if (this.borderTJonction.getValue(central)!=null && this.interiorTJonction.getValue(central)!=null  ) throw 'a vertex cannot be a interior and border T-jonction'


                    if (this.borderTJonction.getValue(central)==null){
                        /**we take any polygone */
                        let poly0:Polygone = polygonesAround[0]
                        if (poly0==null) logger.c('some vertex was not around a square/triangulatedRect')
                        else this.createLinksTurningFromOnePolygone(central,poly0,polygonesAround,false)
                    }
                    else{

                        let poly=this.findAPolygoneWithOrientedEdge(central,this.borderTJonction.getValue(central)[0],polygonesAround)
                        if (poly==null) poly=this.findAPolygoneWithOrientedEdge(central,this.borderTJonction.getValue(central)[1],polygonesAround)


                        this.createLinksTurningFromOnePolygone(central,poly,polygonesAround,true)
                    }

                })

            }

            
            private makeLinksFinaly():void {


                this.mamesh.vertices.forEach((vertex:Vertex)=>{

                    if ( this.forceOppositeLinksAtCorners ||  !vertex.hasMark(Vertex.Markers.corner)   ) {


                        let length = vertex.links.length

                        if (this.borderTJonction.getValue(vertex)!=null) {
                            let nei1 = vertex.links[0];
                            let nei2 = vertex.links[length-1];
                            nei1.opposites=[nei2]
                            nei2.opposites=[nei1]

                        }
                        else {
                            if ( length % 2 == 0) {

                                for (let i = 0; i < length; i++) {

                                    let nei1 = vertex.links[i];
                                    let nei2 = vertex.links[(i + length / 2) % length];
                                    nei1.opposites=[nei2]
                                    nei2.opposites=[nei1]
                                }
                            }
                            if (this.forcedOpposite.getValue(vertex)!=null){
                                let voi0=this.forcedOpposite.getValue(vertex)[0]
                                let voi1=this.forcedOpposite.getValue(vertex)[1]

                                /**important to suppress opposite before create some new. If not we create bifurcations*/
                                vertex.changeToLinkWithoutOpposite(voi0)
                                vertex.changeToLinkWithoutOpposite(voi1)
                                vertex.setTwoOppositeLinks(voi0,voi1)

                                //Vertex.separateTwoVoisins(vertex,voi0)
                                //Vertex.separateTwoVoisins(vertex,voi1)

                                //let link0=vertex.findLink(voi0)
                                //let link1=vertex.findLink(voi1)
                                //link0.opposites=[link1]
                                //link1.opposites=[link0]



                                // /** maybe, we break existing oppositions between links*/
                                // for (let link of vertex.links){
                                //     if (link.opposite!=null && (link.opposite.to==voi0 || link.opposite.to==voi1) ) link.opposite=null
                                // }
                                // /**now, we add impose the new oppositions */
                                // let link0:Link=vertex.findLink(voi0)
                                // let link1:Link=vertex.findLink(voi1)
                                // link0.opposite=link1
                                // link1.opposite=link0
                            }

                        }

                    }

                })

            }






            //    function completSegment(segment:Segment){
            //    /**premier passage */
            //    if (segment.middle==null){
            //        segment.middle=graphManip.addNewVertex(this.IN_mamesh.vertices,this.IN_mamesh.vertices.length)
            //        segment.middle.dichoLevel=Math.max(segment.a.dichoLevel,segment.b.dichoLevel)+1
            //        segment.middle.position=geo.newXYZ(0,0,0)
            //        geo.between(segment.a.position,segment.b.position,0.5,segment.middle.position)
            //
            //    }
            //}






            private findAPolygoneWithOrientedEdge(vertDeb:Vertex,vertFin:Vertex, aList:Polygone[]):Polygone {

                for (let polygone of aList){
                    let length=polygone.points.length
                    for (let i=0;i<length;i++){
                        if (polygone.points[i%length].hashNumber==vertDeb.hashNumber && polygone.points[(i+1)%length].hashNumber== vertFin.hashNumber) return polygone
                    }
                }
                return null;
            }


            private findAPolygoneWithThisEdge(vert1:Vertex,vert2:Vertex, aList:Polygone[]):Polygone {

                for (let polygone of aList){
                    let length=polygone.points.length
                    for (let i=0;i<length;i++){

                        let id=Segment.segmentId(polygone.points[i%length].hashNumber,polygone.points[(i+1)%length].hashNumber)
                        let idBis=Segment.segmentId(vert1.hashNumber,vert2.hashNumber)
                        if (id==idBis) return polygone
                    }

                }

                return null;
            }


            private createLinksTurningFromOnePolygone(central:Vertex,poly0:Polygone,polygonesAround:Polygone[],isBorder:boolean){

                let currentAngle:Vertex = poly0.theOutgoingAnglesAdjacentFrom(central);
                let currentPolygone=poly0

                let allIsWellOriented=true
                while (polygonesAround.length > 0) {

                    central.links.push(new Link(currentAngle))
                    if (allIsWellOriented) currentAngle=currentPolygone.theIngoingAnglesAdjacentFrom(central)
                    else {
                        let angles=currentPolygone.theTwoAnglesAdjacentFrom(central)
                        if (angles[0].hashNumber==currentAngle.hashNumber) currentAngle=angles[1]
                        else currentAngle=angles[0]
                    }


                    tab.removeFromArray(polygonesAround,currentPolygone)
                    /**maintenant il n' y en a plus qu' un seul (ou zéro) polygone ayant comme côté [central,currentAngle], car on a supprimé l' autre polygone*/
                        //TODO improte considering only outgoing
                    currentPolygone=this.findAPolygoneWithOrientedEdge(central,currentAngle,polygonesAround)
                    if (currentPolygone==null) {
                        currentPolygone=this.findAPolygoneWithOrientedEdge(currentAngle,central,polygonesAround)
                        //TODO console.log(' orientations of the faces of your surface are not all compatible')
                        allIsWellOriented=false

                    }


                    //
                    //
                    //let currentPolygone:Polygone = this.findAPolygoneWithThisEdge(central, currentVertex, polygonesAroundExceptOne);
                    //
                    //let twoAngles:Vertex[] = currentPolygone.theTwoAnglesAdjacentFrom(central);
                    //
                    //let goodAngle=(twoAngles[0] == currentVertex)? twoAngles[1]:twoAngles[0]
                    //currentFle=new Link(goodAngle)
                    //central.links.push(currentFle)
                    //currentVertex=goodAngle
                    //
                }

                /** si les polygones ne font pas le tour complet, il faut rajouter un dernier link*/
                if (isBorder){
                    central.links.push(new Link(currentAngle))
                }
            }


            /**at the beginning polygones are simply square or triangulatedRect. But perhaps, some of their edge were subdivide.
             * In this case, we add the middle in the polygone points. This method is recursive because segment could had been several time subdivided*/
            private subdivideSegment(polygone:Polygone,vertex1:Vertex,vertex2:Vertex,cutSegmentDico:{[id:string]:Segment}){

                let segment = cutSegmentDico[Segment.segmentId(vertex1.hashNumber,vertex2.hashNumber)]
                if (segment!=null){


                    let index1=polygone.points.indexOf(vertex1)
                    let index2=polygone.points.indexOf(vertex2)

                    let minIndex=Math.min(index1,index2)
                    let maxIndex=Math.max(index1,index2)
                    if (maxIndex==polygone.points.length-1 && minIndex==0) polygone.points.splice(length,0,segment.middle)
                    else polygone.points.splice(minIndex+1,0,segment.middle)


                    this.subdivideSegment(polygone,vertex1,segment.middle,cutSegmentDico)
                    this.subdivideSegment(polygone,vertex2,segment.middle,cutSegmentDico)
                }

            }



            //toStringForTest():string{
            //    let res="Manipulator as string"
            //    res+="\npoly:"
            //    if (this.polygones){
            //        for (let poly of this.polygones) res+=poly.toString()
            //    }
            //    res+="\ninteriorTjonction:"
            //    if (this.interiorTJonction!=null){
            //        for (let id in this.interiorTJonction) res+=id+","
            //    }
            //    res+="\nforcedOpposite:"
            //    if (this.forcedOpposite!=null){
            //        for (let id in this.forcedOpposite) res+="|id:"+id+">"+this.forcedOpposite[id][0].hash+","+this.forcedOpposite[id][1].hash
            //    }
            //    res+="\ncutted segment"
            //    for (let key in this.cutSegmentsDico) res+="|"+key+'mid:'+this.cutSegmentsDico[key].middle.hash+","
            //    console.log('forcedOpposite',this.forcedOpposite)
            //    return res
            //
            //}




        }


        export class Polygone {


            //sides = new Array<Segment>();
            points:Vertex[];

            constructor(points:Vertex[]) {
                this.points = points;
                //for (let i = 0; i < points.length; i++) {
                //    let side = new Segment(points[i], points[(i + 1) % points.length]);
                //    this.sides.push(side);
                //}
            }

            //hasSide(ab:Segment):boolean {
            //    for (let i = 0; i < this.sides.length; i++) {
            //
            //        let side:Segment = this.sides[i];
            //
            //        if (ab.equals(side)) {
            //            return true;
            //        }
            //    }
            //    return false;
            //}

            hasAngle(point:Vertex):boolean {

                for (let vert of this.points) {
                    if (vert.hashNumber==point.hashNumber) return true
                }
                return false
            }





            //theTwoSidesContaining(point:Vertex):Array<Segment> {
            //
            //    let twoSides = new Array<Segment>();
            //
            //    for (let i in this.sides) {
            //        let side:Segment = this.sides[i];
            //        if (side.has(point)) twoSides.push(side);
            //    }
            //
            //    if (twoSides.length != 2) throw "Non conform polygone";
            //
            //    return twoSides;
            //
            //}


            theOutgoingAnglesAdjacentFrom(point:Vertex):Vertex {
                let length=this.points.length
                for (let i=0;i<length;i++){
                    if (this.points[i]==point){
                        return this.points[(i+1)%length]
                    }
                }
                throw 'we do not find the point in this polygone'
            }

            theIngoingAnglesAdjacentFrom(point:Vertex):Vertex {
                let length=this.points.length
                for (let i=0;i<length;i++){
                    if (this.points[i]==point){
                        return this.points[(i-1+length)%length]
                    }
                }
                throw 'we do not find the point in this polygone'
            }


            theTwoAnglesAdjacentFrom(point:Vertex):Array<Vertex> {
                let length=this.points.length
                for (let i=0;i<length;i++){
                    if (this.points[i]==point){
                        return [this.points[ (i-1+length)%length],this.points[(i+1)%length]]
                    }
                }
                throw 'we do not find the point in this polygone'
            }

            toString():string{
                let res="["
                for (let vertex of this.points) res+=vertex.hashNumber+','
                return res+"]"

            }

        }




    }
}