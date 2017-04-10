/**
 * Created by vigon on 05/12/2016.
 */


module mathis{
    
    export module debug{


        export function verticesToString(vertices:Vertex[]):string{
            let tab:number[]=[]
            for (let v of vertices) tab.push(v.hashNumber)
            return JSON.stringify(tab.sort())
        }
        export function verticesFamilyToString(verticesFamily:Vertex[][]):string{
            let tableau:string[]=[]

            for (let fam of verticesFamily) {
                let a:number[]=[]
                for (let v of fam) a.push(v.hashNumber)
                tableau.push(tab.indicesUpPermutationToString(a))
            }
            return JSON.stringify(tableau.sort())
        }
        export function objToString(array:any[]):string{
            let res=''
            for (let xyz of array) res+=xyz.toString()
            return res
        }


        /**pour des tests uniquement*/
        export function checkTheRegularityOfAGraph(vertices:Vertex[]):void {

            for (let central of vertices) {

                let link:Link=null
                for (link of central.links) {


                    if (!link.to.hasVoisin(central)) throw "neighborhood relation is not reflexive. The vertex:"+central.toString(0)+"\n has a link which gos to:"+link.to.toString(0)+
                    "\n but no link in the other direction. A possible cause: you vertices is only a part of a graph"





                    if (link.opposites != null) {

                        for (let op of link.opposites){
                            if (central.links.indexOf(op)==-1) throw  "a link attached to a vertex has an opposite link which is not attached of this vertex \n "+
                            "problem takes place at vertex:"+central.toString(0)
                            +"\n link going to:" +link.to.toString(0)
                            +"\n opposite link going to:"+op.to.toString(0)

                            if (op.opposites.indexOf(link)==-1) throw "opposite of  opposite do not give the same link"
                        }



                    }


                }

            }

        }




    }
    
}