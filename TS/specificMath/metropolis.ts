/**
 * Created by vigon on 01/04/2016.
 */



module mathis{
    
    export module metropolis {



        export class LongEdgeVisual {

            upDirection=new XYZ(0,1,0)


            static hash(vertex0:Vertex,vertex1:Vertex):string{
                if (vertex0.hashNumber<vertex1.hashNumber) return vertex0.hashNumber+','+vertex1.hashNumber
                else return vertex1.hashNumber+','+vertex0.hashNumber
            }

            constructor(
                public vertex0:Vertex,
                public vertex1:Vertex,
                private srg:SpacialRandomGraph){
            }


            meshes:BABYLON.Mesh[]

            draw(){

                let v0=new Vertex()
                v0.position=this.vertex0.position

                let v1=new Vertex()
                v1.position=this.vertex1.position

                let vMid=new Vertex()
                let bary=new XYZ(0,0,0)
                geo.baryCenter([v0.position,v1.position],[0.5,0.5],bary)
                vMid.position=new XYZ(0,0,0)
                let demiDist=geo.distance(v0.position,v1.position)/2
                vMid.position.add(this.upDirection).scale(demiDist).add(bary)

                let line=new Line([v0,vMid,v1],false)

                let lineViewer=new visu3d.LinesViewer([line],this.srg.mathisFrame.scene)
                lineViewer.color=new Color(new RGB_range255(124,252,0))
                lineViewer.constantRadius=this.srg.lineRadius

                this.meshes=lineViewer.go()

            }

            unDraw(){
                for (let mesh of this.meshes) mesh.dispose()
            }


        }



        export class SpacialRandomGraph {


            get alpha(){

                if (this.gamma<=1) {
                    return  Math.max(Math.min((1-this.b)/(2-this.gamma),1),0)
                }
                else if (this.gamma>1){
                    return  Math.max(Math.min((this.gamma-this.b)/(this.gamma),1),0)
                }
                else return null
            }
            get Nalpha(){
                return Math.pow(this.N,this.alpha)
            }




            private energy:number=null
            private candidateEnergy=1

            private C_gamma=0

            b=1
            gamma=1

            nbTryPerBatch = 1
            lineRadius=0.01


            private longEdges=new StringMap<LongEdgeVisual>()


            rand=new proba.Random()
            showInitialGraph=true

            private graph:Vertex[]


            constructor(
                public mamesh:Mamesh,
                public mathisFrame:MathisFrame,
                /**nombre de vertex sur une dimension*/
                private N
            ){
                this.graph=mamesh.vertices

            }

            //vertexViewer:visu3d.VerticesViewer
            private vertexRadius
            go(){

                // let lineVisu=new visu3d.LinesViewer(this.mamesh,this.mathisFrame.scene)
                // //lineVisu.constantRadius=this.lineRadius
                // lineVisu.isThin=true
                // lineVisu.go()


                /**on met une marque sur les liens initiaux (on en rajoutera des plus longs par la suite, qui n'auront pas cette marque)*/
                for (let vertex of this.mamesh.vertices){
                    for (let link of vertex.links){
                        link.customerOb=true
                    }
                }


                let mean=0
                let nb=0
                let aVertex=this.mamesh.vertices[0]
                for (let link of aVertex.links){
                    mean+=geo.distance(aVertex.position,link.to.position)
                    nb++
                }
                mean/=nb
                this.vertexRadius=Math.min(mean*0.5,0.03)

                if (this.showInitialGraph) {
                    let baseVertexViewer = new visu3d.VerticesViewer(this.mamesh, this.mathisFrame.scene)
                    baseVertexViewer.constantRadius = this.vertexRadius
                    baseVertexViewer.go()


                    if (this.lineRadius < 0.8 * this.vertexRadius) {
                        let lineViewer = new visu3d.LinesViewer(this.mamesh, this.mathisFrame.scene)
                        lineViewer.constantRadius = this.lineRadius
                        lineViewer.color = new Color(Color.names.indianred)
                        lineViewer.go()
                    }
                }
                else{
                    let baseVertexViewer = new visu3d.VerticesViewer(this.mamesh, this.mathisFrame.scene)
                    baseVertexViewer.constantRadius = 0.005
                    baseVertexViewer.go()
                }



            }



            private areClose(vertex0:Vertex,vertex1:Vertex):boolean{

                if (vertex0==vertex1) return true

                let link = vertex0.findLink(vertex1)

                if (link==null) return false

                if (link.customerOb==null) return false

                return true

            }

            private allClose(vertex:Vertex):Vertex[]{
                let res=[]
                for (let link of vertex.links){
                    if (link.customerOb==true) res.push(link.to)
                }
                return res
            }




            private addALongEdgeVisual(vertex0:Vertex, vertex1:Vertex){
                let longEdge=new LongEdgeVisual(vertex0,vertex1,this)
                this.longEdges.putValue(LongEdgeVisual.hash(vertex0,vertex1),longEdge)
                longEdge.draw()
            }
            private suppressALongEdgeVisual(vertex0:Vertex, vertex1:Vertex){
                let hash=LongEdgeVisual.hash(vertex0,vertex1)
                let longEdge=this.longEdges.getValue(hash)
                longEdge.unDraw()
                this.longEdges.removeKey(hash)
            }


            /**Attention : cette formule donne la distance euclidienne quand on suppose que les vertex sont
             *
             *  cas1d :  en 1,2,...,N      et non pas répartis sur [-1,1] comme sur la visualisation
             *  cas2d :  en (1,1) , ..., (N,N)  et non pas répartis sur [-1,1]^2 comme sur la visualisation
             *  */
            euclidianDistance(vertex0:Vertex, vertex1:Vertex):number{

                return geo.distance(vertex0.position,vertex1.position)*(this.N-1)/2
            }


            probaOfLongEdgeModif=0.5



            batchOfChanges():{diameter:number;suppression:number;addition:number;modification:number}{


                let suppression=0
                let addition=0
                let modification=0

                for (let t = 0; t < this.nbTryPerBatch; t++) {



                    let linkToAdd:Vertex[]=null
                    let linkToSuppress:Vertex[]=null

                    let proba=(this.longEdges.allValues().length<4)? 0 : this.probaOfLongEdgeModif
                    if (this.rand.pseudoRand()<proba){


                        let aLongEdge=this.longEdges.aRandomValue()

                        let allClos=this.allClose(aLongEdge.vertex1)
                        let vertex1New:Vertex=allClos[Math.floor(allClos.length*this.rand.pseudoRand())]

                        if (!this.areClose(vertex1New,aLongEdge.vertex0)){
                            linkToAdd=[vertex1New,aLongEdge.vertex0]
                            linkToSuppress=[aLongEdge.vertex1,aLongEdge.vertex0]
                        }
                        else {

                            continue
                        }
                    }
                    else {

                        /**on tire deux sommets au hasards. */
                        let vertex0 = this.graph[this.rand.pseudoRandInt(this.graph.length)]
                        let vertex1: Vertex = this.graph[this.rand.pseudoRandInt(this.graph.length)]

                        if (this.areClose(vertex0, vertex1)) continue

                        // while (this.areClose(vertex0, vertex1)) {
                        //     vertex1 = this.graph[this.rand.pseudoRandInt(this.graph.length)]
                        // }

                        /**si un longEdge existe : on propose de le supprimer, sinon de le rajouter*/
                        if (this.longEdges.getValue(LongEdgeVisual.hash(vertex0,vertex1))!=null) linkToSuppress=[vertex0,vertex1]
                        else linkToAdd = [vertex0,vertex1]

                    }


                    if (linkToAdd!=null){
                        linkToAdd[0].setOneLink(linkToAdd[1])
                        linkToAdd[1].setOneLink(linkToAdd[0])
                        this.C_gamma += Math.pow(this.euclidianDistance(linkToAdd[0], linkToAdd[1]), this.gamma)
                    }
                    if (linkToSuppress!=null){
                        Vertex.separateTwoVoisins(linkToSuppress[0], linkToSuppress[1])
                        this.C_gamma -= Math.pow(this.euclidianDistance(linkToSuppress[0],linkToSuppress[1]), this.gamma)
                    }



                    /**ici on calcul le nouveau diamètre, on utilise aussi le C_gamma*/
                    let ratioEnergy=this.energyRatio()


                    if (ratioEnergy>=1 || Math.random()<  ratioEnergy) {
                        /**on accepte le changement : le graph a déjà été modifier, il reste à modifier le visuel*/
                        this.twoExtremeVertices=this.twoExtremeVertices_proposal.concat([])
                        this.diameter=this.diameter_proposal

                        if (linkToAdd!=null) {
                            this.addALongEdgeVisual(linkToAdd[0],linkToAdd[1])
                        }
                        if (linkToSuppress!=null) {
                            this.suppressALongEdgeVisual(linkToSuppress[0],linkToSuppress[1])
                        }

                        this.energy=this.candidateEnergy

                        if (linkToAdd!=null&&linkToSuppress!=null) modification++
                        else if (linkToAdd!=null) addition++
                        else if (linkToSuppress!=null) suppression++
                        else throw "bizarre"

                    }
                    else {
                        /**sinon on fait machine arrière dans le graph*/
                        if (linkToAdd!=null) {
                            Vertex.separateTwoVoisins(linkToAdd[0],linkToAdd[1])
                            this.C_gamma-=Math.pow(this.euclidianDistance(linkToAdd[0],linkToAdd[1]),this.gamma)
                        }
                        if (linkToSuppress!=null) {
                            linkToSuppress[0].setOneLink(linkToSuppress[1])
                            linkToSuppress[1].setOneLink(linkToSuppress[0])
                            this.C_gamma+=Math.pow(this.euclidianDistance(linkToSuppress[0],linkToSuppress[1]),this.gamma)
                        }


                    }
                }


                if (this.diameter_previousBatch!=this.diameter) {
                    /**on trace les deux vertex les plus éloignés quand le diamétre change*/
                    if(this.vertexViewer!=null) this.vertexViewer.clear()
                    let smallMamesh=new Mamesh()
                    smallMamesh.vertices=this.twoExtremeVertices
                    this.vertexViewer=new visu3d.VerticesViewer(smallMamesh,this.mathisFrame.scene)
                    this.vertexViewer.color=new Color(Color.names.black)
                    this.vertexViewer.constantRadius=this.vertexRadius*1.01
                    this.vertexViewer.go()

                    // let previousDrawnVertices=this.vertexViewer.selectedVertices
                    // this.vertexViewer.selectedVertices=this.twoExtremeVertices
                    // this.vertexViewer.buildVertexVisu(this.twoExtremeVertices,previousDrawnVertices)

                    // let one = new XYZ(0.03, 0.03, 0.03)
                    // let zero = new XYZ(0, 0, 0)
                    // for (let v of this.mamesh.vertices) this.vertexViewer.positionings.getValue(v).scaling.copyFrom(zero)
                    // for (let v of this.twoExtremeVertices) this.vertexViewer.positionings.getValue(v).scaling.copyFrom(one)
                    // this.vertexViewer.updatePositionings()
                    this.diameter_previousBatch=this.diameter
                }


                return {diameter:this.diameter,suppression:suppression,addition:addition,modification:modification}
            }
            vertexViewer:visu3d.VerticesViewer



            private twoExtremeVertices_proposal:Vertex[]
            private twoExtremeVertices:Vertex[]
            private diameter_proposal:number
            private diameter:number
            private diameter_previousBatch:number
            private  energyRatio():number{

                var diameterComputer = new mathis.graph.HeuristicDiameter(this.mamesh.vertices);
                this.diameter_proposal = diameterComputer.go()
                this.twoExtremeVertices_proposal=diameterComputer.OUT_twoExtremeVertices

                this.candidateEnergy=Math.pow(this.N,this.b)*this.diameter_proposal+this.C_gamma

                if (this.energy==null) return 1

                return Math.exp(-this.candidateEnergy+this.energy)

            }





        }





        export class IsingModel {

            pi:(graph:Vertex[])=>number

            graph:Vertex[]
            
            nbActionsPerIteration = 1000
            
            
            private possibleValues:number[] //=[-1,0,1]
            q=Number.POSITIVE_INFINITY
            beta=0.01
            

            
            constructor(graph:Vertex[]){
                this.graph=graph
            }
            
            checkArgs(){
                if (this.q==null || this.beta==null) throw 'q or beta is null'
                if (this.q<=0) throw 'q must be positive'
            }

            go() {


                this.checkArgs()
                if (this.q==Number.POSITIVE_INFINITY) this.possibleValues=[-1,1]
                else this.possibleValues=[-1,0,1]
                this.initialisation()
                //this.iterateAndGetChangedVertices()
                
            }


            iterateAndGetChangedVertices():HashMap<Vertex,number>{


                let res=new HashMap<Vertex,number>(true)
                
                for (let i = 0; i < this.nbActionsPerIteration; i++) {

                    let valuedVertex:Vertex
                    let possibleNewValue:number
                    if (this.beta!=Number.POSITIVE_INFINITY){
                        let randomIndex=Math.floor(Math.random()*this.graph.length)
                        valuedVertex=this.graph[randomIndex]
                        possibleNewValue=this.newValue()
                    }
                    else{
                        /**when beta=infinity, we do not accept that +1 and -1 are neighbor */
                        let ok=false
                        while (!ok){
                            let randomIndex=Math.floor(Math.random()*this.graph.length)
                            valuedVertex=this.graph[randomIndex]
                            possibleNewValue=this.newValue()
                            let voi:Link=null
                            let ok=true
                            for (voi of valuedVertex.links){
                                if (voi.to.customerObject.value*possibleNewValue==-1) {
                                    ok=false
                                    break
                                }
                            }
                        }
                    }
                    
                    let ratioEnergy=this.energyRatio(valuedVertex,possibleNewValue)
                    if (ratioEnergy>=1 || Math.random()<  ratioEnergy) {
                        valuedVertex.customerObject.value=possibleNewValue
                        res.putValue(valuedVertex,possibleNewValue)
                    }
                    
                }
                return res
            }





            private newValue():number{
                let randomIndex=Math.floor(Math.random()*this.possibleValues.length)
                return this.possibleValues[randomIndex]

            }


            private  energyRatio(ver:Vertex,possibleNewValue):number{


                let res=1

                if (this.q!=1 && this.q!=Number.POSITIVE_INFINITY){
                     res=Math.pow(this.q,Math.abs(possibleNewValue)-Math.abs(ver.customerObject.value))
                }


                if (this.beta!=0 && this.beta!=Number.POSITIVE_INFINITY) {
                    let diff = possibleNewValue - ver.customerObject.value

                    if (this.beta != 0 && this.beta != Number.POSITIVE_INFINITY) {
                        let sac = 0
                        ver.links.forEach(li=> {
                            sac += diff * li.to.customerObject.value
                        })
                        res *= Math.exp(this.beta * sac)
                    }
                }


                
                return res
            }

            private initialisation(){
                this.graph.forEach(v=>{
                    v.customerObject.value=0
                })
            }



            
        }







        
        
    }
}