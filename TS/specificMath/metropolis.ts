/**
 * Created by vigon on 01/04/2016.
 */



module mathis{
    
    export module metropolis {




        export class LongEdge {


            static hash(vertex0:Vertex,vertex1:Vertex):string{
                if (vertex0.hashNumber<vertex1.hashNumber) return vertex0.hashNumber+','+vertex1.hashNumber
                else return vertex1.hashNumber+','+vertex0.hashNumber
            }

            constructor(
                private vertex0,
                private vertex1,
                private srg:SpacialRandomGraph){
            }


            meshes:BABYLON.Mesh[]

            draw(){

                let v0=new Vertex().setPosition(this.srg.iToX(this.i),0,0)

                let v1=new Vertex().setPosition(
                    (this.srg.iToX(this.i)+this.srg.iToX(this.j))/2,
                    Math.abs(this.srg.iToX(this.i)-this.srg.iToX(this.j))/2,
                    0
                )

                let v2=new Vertex().setPosition(this.srg.iToX(this.j),0,0)

                let small=new Mamesh()
                small.vertices.push(v0,v1,v2)
                v1.setTwoOppositeLinks(v0,v2)
                v0.setOneLink(v1)
                v2.setOneLink(v1)

                let lineViewer=new visu3d.LinesViewer(small,this.srg.mathisFrame.scene)

                this.meshes=lineViewer.go()

            }

            unDraw(){

                for (let mesh of this.meshes) mesh.dispose()

            }



        }

        export class SpacialRandomGraph {

            pi:(graph:Vertex[])=>number

            mathisFrame:MathisFrame


            size=10


            nbActionsPerIteration = 1000


            constructor(
                public graph
            ){}

            go(){
            }




            private buildLinearBasicGraph(size:number):Mamesh{

                let res=new Mamesh()

                for (let i=0;i<size;i++){
                    let vertex=new Vertex().setPosition(this.iToX(i),0,0)
                    res.vertices.push(vertex)
                }

                for (let i=1;i<size-1;i++) {
                    res.vertices[i].setTwoOppositeLinks(res.vertices[i-1],res.vertices[i+1])
                }
                res.vertices[0].setOneLink(res.vertices[1])
                res.vertices[size-1].setOneLink(res.vertices[size-2])

                return res

            }

            iToX(i:number){
              return -1+2*i/(this.size-1)
            }




            private addALongEdgeVisual(vertex0,vertex1){
                let longEdge=new LongEdge(vertex0,vertex1,this)
                this.longEdges.putValue(LongEdge.hash(vertex0,vertex1),longEdge)
                longEdge.draw()
            }




            longEdges=new StringMap<LongEdge>()
            nbLinksAddedToSee=1
            rand=new proba.Random()

            batchOfChanges():HashMap<Vertex,number>{


                let res=new HashMap<Vertex,number>(true)

                for (let t = 0; t < this.nbActionsPerIteration; t++) {
                    let toAddPerhaps:Vertex[][]=[]
                    let toSuppressPerhaps:Vertex[][]=[]
                    for (let n=0;n<this.nbLinksAddedToSee;n++){

                        let vertex0=this.graph[this.rand.pseudoRandInt(this.size)]
                        let vertex1:Vertex=this.graph[this.rand.pseudoRandInt(this.size)]
                        while (vertex0.hasVoisin(vertex1)) vertex1=this.graph[this.rand.pseudoRandInt(this.size)]

                        if (this.longEdges.getValue(LongEdge.hash(vertex0,vertex1))==null) {
                            vertex0.setOneLink(vertex1)
                            vertex1.setOneLink(vertex0)
                            toAddPerhaps.push([vertex0, vertex1])
                        }
                        else{
                            Vertex.separateTwoVoisins(vertex0,vertex1)
                        }

                    }

                    let ratioEnergy=this.energyRatio()
                    if (ratioEnergy>=1 || Math.random()<  ratioEnergy) {
                        for (let pair of toAddPerhaps){
                            this.addALongEdgeVisual(pair[0],pair[1])
                        }
                    }
                    else {
                        for (let pair of toAddPerhaps){
                            Vertex.separateTwoVoisins(pair[0],pair[1])
                        }
                    }

                }
                return res
            }




            private  energyRatio():number{


                //TODO



                return 1
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