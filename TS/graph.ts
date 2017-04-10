/**
 * Created by vigon on 18/12/2015.
 */

module mathis{


    //TODO emplacer par une référence sur le link pour pouvoir mettre plusieurs links ayant même depart et arrivée (mais pas même opposite)
    class TwoInt{
        public a:number;
        public b:number;
        constructor(c:number,d:number){
            this.a=(c<d) ? c : d;
            this.b=(c<d)  ? d : c;
        }

    }


    export module graph{
        

        import verticalAxis = mathis.symmetries.keyWords.verticalAxis;
        // export function  getGroup(startingGroup:Vertex[], admissibleForGroup :HashMap<Vertex,boolean>):Vertex[]{
        //
        //
        //     let group:Vertex[]=[]
        //     let newEdge:Vertex[]=[]
        //     let newEdgeSelected:Vertex[]=startingGroup
        //
        //     // initialisation
        //     for (let vertex of startingGroup) {
        //         group.push(vertex)
        //         admissibleForGroup.putValue(vertex,false)
        //     }
        //
        //     // iteration
        //     while (newEdgeSelected.length>0){
        //         newEdge = getEdge(newEdgeSelected);
        //         newEdgeSelected=[]
        //         for (let vertex of newEdge){
        //             if (admissibleForGroup.getValue(vertex)==true) {
        //                 newEdgeSelected.push(vertex);
        //                 group.push(vertex);
        //             }
        //             admissibleForGroup.putValue(vertex,false)
        //         }
        //     }
        //
        //     return group;
        // }

        /**if admissibleForGroup=null, all vertices is admissible*/
        export function  getGroup(startingGroup:Vertex[], admissibleForGroup ?:HashMap<Vertex,boolean>):Vertex[]{


            let group:Vertex[]=[]
            let newEdge:Vertex[]=[]
            let newEdgeSelected:Vertex[]=startingGroup

            let alreadySeen=new HashMap<Vertex,boolean>()

            // initialisation
            for (let vertex of startingGroup) {
                group.push(vertex)
                alreadySeen.putValue(vertex,true)
            }

            // iteration
            while (newEdgeSelected.length>0){
                newEdge = getEdge(newEdgeSelected);
                newEdgeSelected=[]
                for (let vertex of newEdge){
                    if (!alreadySeen.getValue(vertex)) {
                        if (admissibleForGroup == null || admissibleForGroup.getValue(vertex)) {
                            newEdgeSelected.push(vertex);
                            group.push(vertex);
                        }
                        alreadySeen.putValue(vertex, true)
                    }
                }
            }

            return group;
        }

        export class DistancesFromAGroup{


            centralCells:Vertex[]
            OUT_stratesAround:Vertex[][]
            private OUT_distances_dico=new HashMap<Vertex,number>()
            //OUT_maxDistance=0
            
            OUT_distance(vertex:Vertex){
                return this.OUT_distances_dico.getValue(vertex)
            }

            constructor(centralCells:Vertex[]){
                this.centralCells=centralCells
            }
            
            
            OUT_allGeodesics(vertex:Vertex,onlyOne=false):Vertex[][]{
                let res:Vertex[][]=[]
                let edge=[vertex]
                let nonAdmissible=new HashMap<Vertex,boolean>()
                let d=this.OUT_distances_dico.getValue(vertex)

                while (edge.length>0){
                    res.push(edge)
                    d--
                    edge=getEdge(edge,nonAdmissible)
                    let selectedEdge:Vertex[]=[]
                    for (let v of edge){
                        if (this.OUT_distances_dico.getValue(v)==d) {
                            selectedEdge.push(v)
                            if (onlyOne) break
                        }
                    }
                    edge=selectedEdge
                }

                return res
            }


            go():void{


                let nonAdmissible=new HashMap<Vertex,boolean>()

                if (this.centralCells==null || this.centralCells.length==0) throw 'problème d argument';

                this.OUT_stratesAround=[]
                this.OUT_stratesAround.push(this.centralCells);
                let edge=getEdge(this.centralCells,nonAdmissible);
                while (edge.length>0){
                    this.OUT_stratesAround.push(edge);
                    edge=getEdge(edge,nonAdmissible);
                }
                
                for (let i=0;i<this.OUT_stratesAround.length;i++){
                    for (let v of this.OUT_stratesAround[i]){
                        this.OUT_distances_dico.putValue(v,i)    
                    }
                }
                // let group:Vertex[]=[]
                // let newEdge:Vertex[]=[]
                // let newEdgeSelected:Vertex[]=this.startingGroup
                //
                // // initialisation
                // for (let vertex of this.startingGroup) {
                //     group.push(vertex)
                //     this.nonAdmissible.putValue(vertex,true)
                // }
                //
                // this.OUT_stratesAround.push(this.startingGroup)
                //
                //
                //
                //
                // // iteration
                // while (newEdgeSelected.length>0){
                //     newEdge = getEdge(newEdgeSelected);
                //     this.OUT_stratesAround.push(newEdge)
                //
                //     newEdgeSelected=[]
                //     for (let vertex of newEdge){
                //         /** nonAdmissible is none or false -> admissible  */
                //         if (!this.nonAdmissible.getValue(vertex)) {
                //             newEdgeSelected.push(vertex);
                //             group.push(vertex);
                //         }
                //         this.nonAdmissible.putValue(vertex,true)
                //     }
                // }
            }
        }

        
        
        export class HeuristicDiameter{

            
            nbTimeOfNonEvolutionToStop=2

            lookNonEvolutionWithDistanceVersusWithGroups=true

            //consecutiveExtremeGroups:Vertex[][]=[]
            consecutiveExtremetDistances:number[]=[]

            OUT_nbIteration=0
            
            OUT_twoExtremeVertices:Vertex[]=[]
            OUT_extremeGeodesics:Vertex[][]


            constructor(private vertices:Vertex[]){
                
            }

            go():number{
                let extremeGroup=[this.vertices[0]]
                let d=0
                let extremeVertices:Vertex[]=[]
                while (this.evolution()) {
                    this.OUT_nbIteration++

                    let distanceAround = new DistancesFromAGroup(extremeGroup)
                    distanceAround.go()
                    d = distanceAround.OUT_stratesAround.length
                    let oneExtreme=distanceAround.OUT_stratesAround[d - 1][0]
                    extremeGroup=[oneExtreme]
                    this.consecutiveExtremetDistances.push(d)
                    extremeVertices.push(oneExtreme)
                }


                
                this.OUT_twoExtremeVertices.push(extremeVertices[this.OUT_nbIteration-1],extremeVertices[this.OUT_nbIteration-2])

                return d-1

            }


            private evolution():boolean{

                if (this.lookNonEvolutionWithDistanceVersusWithGroups){
                    let len=this.consecutiveExtremetDistances.length
                    if (len<this.nbTimeOfNonEvolutionToStop) return true
                    let lastD=this.consecutiveExtremetDistances[len-1]
                    for (let i=1;i<this.nbTimeOfNonEvolutionToStop;i++){
                        if (this.consecutiveExtremetDistances[len-1-i]!=lastD) return true
                    }
                    return false
                }
                else throw "TODO"
            }











        }
        
        
        export class DistancesBetweenAllVertices{

            OUT_aMaxCouple:Vertex[]
            OUT_allExtremeVertex:Vertex[]=[]
            
            
            allCounters=new HashMap<Vertex,HashMap<Vertex,number>>()
            allVertices:Vertex[]
            allToTransmit=new HashMap<Vertex,HashMap<Vertex,number>>()
            
            allFreshlyReceived  :HashMap<Vertex,HashMap<Vertex,number>>
            
            
            //useGraphDistanceVersusDistanceVersusLinkWeights=0
            
            constructor(allVertices:Vertex[]){
                this.allVertices=allVertices
            }
            
            
            OUT_distance(vertex0:Vertex,vertex1:Vertex):number{
                return this.allCounters.getValue(vertex0).getValue(vertex1)
            }
            
            
            
            OUT_allGeodesics(vertex0:Vertex,vertex1:Vertex,onlyOne=false):Vertex[][]{
                let res:Vertex[][]=[]
                let edge=[vertex0]
                let nonAdmissible=new HashMap<Vertex,boolean>()
                let d=this.allCounters.getValue(vertex0).getValue(vertex1)

                while (edge.length>0){
                    res.push(edge)
                    d--
                    edge=getEdge(edge,nonAdmissible)
                    let selectedEdge:Vertex[]=[]
                    for (let vertex of edge){
                        if (this.allCounters.getValue(vertex).getValue(vertex1)==d) {
                            selectedEdge.push(vertex)
                            if (onlyOne) break
                        }
                    }
                    edge=selectedEdge
                }

                return res
            }


            // OUT_allGeodesics(vertex0:Vertex,vertex1:Vertex,onlyOne=false):Vertex[][]{
            //     let res:Vertex[][]=[]
            //     let edge=[vertex0]
            //     let nonAdmissible=new HashMap<Vertex,boolean>()
            //     //let d=this.allCounters.getValue(vertex0).getValue(vertex1)
            //
            //     while (edge.length>0){
            //         res.push(edge)
            //         let minDist=Number.POSITIVE_INFINITY
            //         edge=getEdge(edge,nonAdmissible)
            //         let selectedEdge:Vertex[]=[]
            //         for (let vertex of edge){
            //             let dist=this.allCounters.getValue(vertex).getValue(vertex1)
            //             if (dist<minDist) {
            //                 selectedEdge=[]
            //                 selectedEdge.push(vertex)
            //             }
            //             else if (dist==minDist&&!onlyOne) selectedEdge.push(vertex)
            //         }
            //         edge=selectedEdge
            //     }
            //
            //     return res
            // }



            
            
            OUT_diameter:number=null
            go():void{
                
                /**initialisation*/
                for (let vertex of this.allVertices){
                    let myCounters=new HashMap<Vertex,number>(true)
                    myCounters.putValue(vertex,0)
                    this.allCounters.putValue(vertex,myCounters)
                    
                    let toTransmit=new HashMap<Vertex,number>(true)
                    toTransmit.putValue(vertex,0)
                    this.allToTransmit.putValue(vertex,toTransmit)

                }

                let stillOneToTransmit=true
                while (stillOneToTransmit) {
                    stillOneToTransmit=false
                    this.allFreshlyReceived=new HashMap<Vertex,HashMap<Vertex,number>>()
                    for (let vertex of this.allVertices) this.allFreshlyReceived.putValue(vertex, new HashMap<Vertex,number>(true))
                    
                    for (let vertex of this.allVertices) {

                        let toTransmit = this.allToTransmit.getValue(vertex)

                        for (let link of vertex.links) {

                            let voiCounter = this.allCounters.getValue(link.to)
                            //console.log(vertex,toTransmit.allKeys().length)
                            for (let v of toTransmit.allKeys()) {

                                if (voiCounter.getValue(v) == null) {
                                    stillOneToTransmit=true
                                    // let d:number
                                    // if (this.useGraphDistanceVersusDistanceVersusLinkWeights==0)d=1
                                    // else if (this.useGraphDistanceVersusDistanceVersusLinkWeights==1) d=geo.distance(vertex.position,link.to.position)
                                    // else if (link.weight!=null) d=link.weight
                                    // else throw "no weight defined"
                                    voiCounter.putValue(v, toTransmit.getValue(v) + 1)
                                    this.allFreshlyReceived.getValue(link.to).putValue(v, toTransmit.getValue(v) + 1)
                                }
                            }
                        }
                    }
                    
                    

                    this.allToTransmit = this.allFreshlyReceived

                    this.OUT_diameter=0
                    for (let vertex of this.allVertices){
                        for (let entry of this.allCounters.getValue(vertex).allEntries()){
                            if (entry.value>this.OUT_diameter){
                                this.OUT_diameter=entry.value
                                this.OUT_aMaxCouple=[vertex,entry.key]
                                this.OUT_allExtremeVertex=[vertex]
                            }
                            if (entry.value==this.OUT_diameter) this.OUT_allExtremeVertex.push(vertex)
                        }
                    }

                    
                }


                
                
                
            }
            
            
            
            
            
            
            
        }

        

        
        /**parmi admissibleForGroup, retourne la composante connexe autour de startingGroup. */
        // export function  getGroup( startingGroup:Vertex[],  admissibleForGroup :HashMap<Vertex,boolean>):Vertex[]{
        //
        //
        //     var group:Vertex[]=[]
        //     var newEdge:Vertex[]=[]
        //     var newEdgeSelected:Vertex[]=[]
        //
        //     // initialisation
        //     newEdgeSelected = startingGroup;
        //     startingGroup.forEach(c=>group.push(c));
        //     newEdgeSelected.forEach((c:Vertex)=>{admissibleForGroup.putValue(c,false) });
        //
        //     // iteration
        //     while (newEdgeSelected.length>0){
        //         newEdge = getEdge(newEdgeSelected);
        //         newEdgeSelected=[]
        //         newEdge.forEach((c:Vertex)=>{
        //             if (admissibleForGroup.getValue(c)==true) {
        //                 newEdgeSelected.push(c);
        //                 group.push(c);
        //             }
        //             admissibleForGroup.putValue(c,false)
        //         });
        //     }
        //
        //     return group;
        // }


        /**si admissibleForEdge n'est pas défini, on accepte tout le monde*/
        export function getEdge(aGroup:Vertex[],CHANGING_nonAdmissibleForEdge?:HashMap<Vertex,boolean>):Vertex[]{

            if (CHANGING_nonAdmissibleForEdge==null) CHANGING_nonAdmissibleForEdge=new HashMap<Vertex,boolean>()

            let edge :Vertex[]=[]

            for (let vertex of aGroup) CHANGING_nonAdmissibleForEdge.putValue(vertex,true)

            for (let vertex of aGroup){
                for (let link of vertex.links){
                    if (!CHANGING_nonAdmissibleForEdge.getValue(link.to)){
                        //if (admissibleForEdge==null || admissibleForEdge.getValue(link.to)) 
                            edge.push(link.to);
                    }
                    CHANGING_nonAdmissibleForEdge.putValue(link.to,true)
                }
            }
            return edge;
        }
        
        
        
        

        export function getEdgeConsideringAlsoDiagonalVoisin(aGroup:Vertex[],CHANGING_nonAdmissibleForEdge?:HashMap<Vertex,boolean>,exactltyTwo=false):Vertex[]{

            if (CHANGING_nonAdmissibleForEdge==null) CHANGING_nonAdmissibleForEdge=new HashMap<Vertex,boolean>()
            
            let edge=getEdge(aGroup,CHANGING_nonAdmissibleForEdge)
            let dicoEdge=new HashMap<Vertex,boolean>()
            for (let c of edge) dicoEdge.putValue(c,true)

            let edgeAndGroup=edge.concat(aGroup)
            let edge2=getEdge(edgeAndGroup)

            for (let c of edge2){
                if (c.links.length<=4){
                    let nbLinkInEdge=0
                    for (let v of c.links) if (dicoEdge.getValue(v.to)!=null) nbLinkInEdge++

                    if (exactltyTwo && nbLinkInEdge==2){
                        edge.push(c)
                        CHANGING_nonAdmissibleForEdge.putValue(c,true)
                    }
                    else if (nbLinkInEdge>=2) {
                        edge.push(c)
                        CHANGING_nonAdmissibleForEdge.putValue(c,true)
                    }
                }
            }

            return edge
        }
        

        //TODO suppress (un peu gadget)
        export function ringify(centralCells:Vertex[]):Array<Vertex[]>{

            let nonAdmissible=new HashMap<Vertex,boolean>()
            
            if (centralCells==null || centralCells.length==0) throw 'problème d argument';
            
            let res:Vertex[][]=[]
            res.push(centralCells);
            let edge=getEdge(centralCells,nonAdmissible);

            while (edge.length>0){
                res.push(edge);
                edge=getEdge(edge,nonAdmissible);
            }

            return res;
        }

        
        
        export function ringifyConsideringAlsoDiagonalVoisin(centralCells:Vertex[]):Array<Vertex[]>{


            if (centralCells==null || centralCells.length==0) throw 'problème d argument';

            let res:Vertex[][]=[]
            res.push(centralCells);
            let interior=centralCells;
            let edge=getEdgeConsideringAlsoDiagonalVoisin(interior);

            while (edge.length>0){
                res.push(edge);
                interior=interior.concat(edge);
                edge=getEdgeConsideringAlsoDiagonalVoisin(interior);
            }
            return res;
        }
        
        



    }






}