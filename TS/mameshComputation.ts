/**
 * Created by vigon on 06/06/2016.
 */

module mathis{
    
    export module mameshAroundComputations{



        /**TODO code duplication with surfaceVisuMaker*/
        export class PositioningComputerForMameshVertices{

            mamesh:Mamesh

            /**default value : the x-axis, but for orthogonals : the y-axis, but for orthogonals: the z-axis*/
            attractionOfTangent=new XYZ(1,0.0123456721,0.00078654343)

            computeTangent=true
            computeNormal=true
            
            computeSizes=true

            sizesProp=new XYZ(0.3,0.3,0.3)
            allVerticesHaveSameSizes=true
            


            constructor(mamesh:Mamesh){this.mamesh=mamesh}

            checkArgs():void{
                if (this.mamesh.smallestSquares.length==0&& this.mamesh.smallestTriangles.length==0) throw "no triangles nor Square. The normals cannot be computed"
            }

            private temp=new XYZ(0,0,0)
            private _side1=new XYZ(0,0,0)
            private _side2=new XYZ(0,0,0)
            go():HashMap<Vertex,Positioning>{

                let res=new HashMap<Vertex,Positioning>()


                if (this.mamesh.vertices.length==0) {
                    logger.c('you try to compute normal, tangent, diameter for an empty mamesh')
                    return
                }

                this.mamesh.vertices.forEach(v=>{
                    let positioning=new Positioning()
                    positioning.position=v.position
                    positioning.upVector=new XYZ(0,0,0)
                    positioning.frontDir=new XYZ(0,0,0)
                    res.putValue(v,positioning)
                })


                /**tangent*/
                if (this.computeTangent) {
                    this.mamesh.vertices.forEach(vertex=> {
                        let greaterDotProduct=Number.NEGATIVE_INFINITY
                        let smallerDotProduct=Number.POSITIVE_INFINITY

                        let bestDirection=new XYZ(0,0,0)
                        let worstDirection=new XYZ(0,0,0)

                        if (vertex.links.length==0)throw 'a vertex with no links. Impossible to compute a tangent'

                        let attractionOfTangentLenght=this.attractionOfTangent.length()
                        for (let i = 0; i < vertex.links.length; i++) {
                            this.temp.copyFrom(vertex.links[i].to.position).substract(vertex.position)
                            if (this.temp.length()<geo.epsilon) {
                                logger.c('a mamesh has two vertices at almost the same position')
                            }
                            else {

                                let sca = geo.dot(this.temp, this.attractionOfTangent)/this.temp.length()/attractionOfTangentLenght
                                if (sca > greaterDotProduct) {
                                    greaterDotProduct = sca
                                    bestDirection.copyFrom(this.temp)
                                    //bestLink = vertex.links[i].to.position
                                }
                                if (sca<smallerDotProduct) {
                                    smallerDotProduct=sca
                                    worstDirection.copyFrom(this.temp)
                                }


                            }
                        }

                        /**sometimes we prefer the opposite direction of the worst*/
                        if (-smallerDotProduct>2*greaterDotProduct) res.getValue(vertex).frontDir.copyFrom(worstDirection.scale(-1))
                        else res.getValue(vertex).frontDir.copyFrom(bestDirection)
                    })
                }


                /**normals*/
                if (this.computeNormal) {

                        /**triangulatedRect and square normals must be computed first*/
                        let triangleNormal:XYZ[] = []
                        for (let i = 0; i < this.mamesh.smallestTriangles.length / 3; i++) {
                            this._side1.copyFrom(this.mamesh.smallestTriangles[3 * i + 1].position).substract(this.mamesh.smallestTriangles[3 * i].position)
                            this._side2.copyFrom(this.mamesh.smallestTriangles[3 * i + 2].position).substract(this.mamesh.smallestTriangles[3 * i].position)
                            triangleNormal[i] = new XYZ(0, 0, 0)
                            geo.cross(this._side1, this._side2, triangleNormal[i])
                            triangleNormal[i].normalize()
                        }
                        let squareNormal:XYZ[] = []
                        for (let i = 0; i < this.mamesh.smallestSquares.length / 4; i++) {
                            this._side1.copyFrom(this.mamesh.smallestSquares[4 * i + 1].position).substract(this.mamesh.smallestSquares[4 * i].position)
                            this._side2.copyFrom(this.mamesh.smallestSquares[4 * i + 3].position).substract(this.mamesh.smallestSquares[4 * i].position)
                            squareNormal[i] = new XYZ(0, 0, 0)
                            geo.cross(this._side1, this._side2, squareNormal[i])
                            try {
                                squareNormal[i].normalize()
                            }
                            catch (e) {
                                throw 'the square' + this.mamesh.smallestSquares[4 * i].hashNumber + ',' + this.mamesh.smallestSquares[4 * i + 1].hashNumber + ',' + this.mamesh.smallestSquares[4 * i + 2].hashNumber + ',' + this.mamesh.smallestSquares[4 * i + 3].hashNumber + ' is degenerated'
                            }
                        }


                        /** now vertices normal are computed*/

                        for (let i = 0; i < triangleNormal.length; i++) {
                            let v0 = this.mamesh.smallestTriangles[3 * i]
                            let v1 = this.mamesh.smallestTriangles[3 * i + 1]
                            let v2 = this.mamesh.smallestTriangles[3 * i + 2]

                            res.getValue(v0).upVector.add(triangleNormal[i])
                            res.getValue(v1).upVector.add(triangleNormal[i])
                            res.getValue(v2).upVector.add(triangleNormal[i])

                        }
                        for (let i = 0; i < squareNormal.length; i++) {
                            let v0 = this.mamesh.smallestSquares[4 * i]
                            let v1 = this.mamesh.smallestSquares[4 * i + 1]
                            let v2 = this.mamesh.smallestSquares[4 * i + 2]
                            let v3 = this.mamesh.smallestSquares[4 * i + 3]

                            res.getValue(v0).upVector.add(squareNormal[i])
                            res.getValue(v1).upVector.add(squareNormal[i])
                            res.getValue(v2).upVector.add(squareNormal[i])
                            res.getValue(v3).upVector.add(squareNormal[i])
                        }


                        let vertexWithoutNormal:Vertex[] = []
                        this.mamesh.vertices.forEach(v=> {
                            try {
                                res.getValue(v).upVector.normalize()
                            }
                            catch (e) {
                                logger.c('a too small upVector for a vertex, probably a vertex which is not in any polygone. The upVector will be the mean of other upVector')
                                vertexWithoutNormal.push(v)
                            }
                        })
                        if (vertexWithoutNormal.length > 0) {
                            let mean = new XYZ(0, 0, 0)
                            for (let v of this.mamesh.vertices) {
                                mean.add(res.getValue(v).upVector) //perhaps zero
                            }
                            try {
                                mean.normalize()
                            } catch (e) {
                                throw 'canot manage to compute upVector for any vertex'
                            }
                            for (let poorVertex of vertexWithoutNormal) res.getValue(poorVertex).upVector.copyFrom(mean)

                        }

                    
                }


                /**sizes*/
                if (this.computeSizes){

                    if (!this.allVerticesHaveSameSizes){
                        this.mamesh.vertices.forEach( (vertex:Vertex)=>{
                            let sum=0
                            vertex.links.forEach(li=>{
                                sum+=geo.distance(vertex.position,li.to.position)
                            })

                            res.getValue(vertex).scaling.copyFrom(this.sizesProp).scale(sum/vertex.links.length)

                        })
                    }
                    else {

                        let diam=0
                        let vertex=this.mamesh.vertices[0]

                        let sum=0
                        vertex.links.forEach(li=>{
                            sum+=geo.distance(vertex.position,li.to.position)
                        })

                        diam= sum/vertex.links.length

                        this.mamesh.vertices.forEach(v=>res.getValue(v).scaling.copyFrom(this.sizesProp).scale(diam))

                    }

                }

                
                return res


            }




        }



    }
}