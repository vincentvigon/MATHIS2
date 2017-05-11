/**
 * Created by vigon on 01/04/2016.
 */



module mathis{
    
    export module metropolis {




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