/**
 * Created by vigon on 19/07/2017.
 */


module mathis {


    export module jonathan {

        export class Weierstrass {

            algebraicForm:boolean = true
            constructor(private mamesh: Mamesh,
                        private G_reOrModule: (u: number, v: number) => number,
                        private G_imOrArg: (u: number, v: number) => number,
                        private h_reOrModule: (u: number, v: number) => number,
                        private h_imOrArg: (u: number, v: number) => number) {

            }


            prodComplexe (u: [number, number], v: [number, number]) : [number, number] {
                return [u[0] * v[0] - u[1] * v[1], u[0] * v[1] + u[1] * v[0]]
            }

            sommeComplexe (u: [number, number], v: [number, number]) : [number, number]  {
                return [u[0] + v[0], u[1] + v[1]]
            }
            diffComplexe (u: [number, number], v: [number, number]) : [number, number]  {
                return this.sommeComplexe([u[0], u[1]], [-v[0], -v[1]])
            }


            // renvoie (X(z);Y(z);Z(z)) avec z = (u,v)
            CoordAIntegrer (u: number, v: number,G_re,G_im,h_re,h_im) : [[number, number], [number, number], [number, number]] {
                let reG = G_re(u,v)
                let imG = G_im(u, v)
                let rho2 = reG * reG + imG * imG
                if (rho2 ==0){
                    cc("Attention, G vaut 0 et ne peut pas être inversé")
                }
                let reh = h_re(u, v)
                let imh = h_im(u, v)
                let c = 1 / (2 * rho2)

                let X: [number, number] = this.prodComplexe(this.diffComplexe([reG, -imG], [reG * rho2, imG * rho2])
                    , [c * reh, c * imh])
                let Y: [number, number] = this.prodComplexe(this.prodComplexe(this.sommeComplexe([reG, -imG], [reG * rho2, imG * rho2])
                    , [c * reh, c * imh]), [0, 1])
                let Z: [number, number] = [reh, imh]

                return [X, Y, Z]
            }


            go() {
                let G_re:(u: number, v: number) => number
                let G_im:(u: number, v: number) => number
                let h_re:(u: number, v: number) => number
                let h_im:(u: number, v: number) => number


                if (this.algebraicForm) {
                    G_re = this.G_reOrModule
                    G_im = this.G_imOrArg
                    h_re = this.h_reOrModule
                    h_im = this.h_imOrArg
                }
                else{
                    G_re = (u: number, v: number) => {
                        return this.G_reOrModule(u,v) * cos(this.G_imOrArg(u,v))
                    }
                    G_im = (u: number, v: number) => {
                        return this.G_reOrModule(u,v) * sin(this.G_imOrArg(u,v))
                    }
                    h_re = (u: number, v: number) => {
                        return this.h_reOrModule(u,v) * cos(this.h_imOrArg(u,v))
                    }
                    h_im = (u: number, v: number) => {
                        return this.h_reOrModule(u,v) * sin(this.h_imOrArg(u,v))
                    }
                }


                let vertex = this.mamesh.vertices[0]

                let dicoVertexIntegrale = new HashMap<Vertex, [number, number, number]>(true)

                let dicoSommetStratePrecedente = new HashMap<Vertex,Vertex>(true)

                let valeursXYZ=new HashMap<Vertex, [[number, number], [number, number], [number, number]]> ()

                dicoSommetStratePrecedente.putValue(vertex, null)
                /** remplissage du tableau des strates et du dico du voisin de la strate précédente **/
                let strates: Vertex[][] = [[vertex]]
                let nbStrate = 0
                let currentVertices: Vertex[] = [vertex]
                let alreadySeen = new mathis.HashMap<Vertex, boolean>()
                while (currentVertices.length > 0) {
                    currentVertices = graph.getEdge(currentVertices, alreadySeen)
                    if (currentVertices.length !=0)
                        strates.push(currentVertices)
                    for (let vertex of currentVertices) {
                        let i = 0
                        let link = vertex.links[i]
                        while (strates[nbStrate].indexOf(link.to) == -1) {
                            i++
                            link = vertex.links[i]
                        }
                        dicoSommetStratePrecedente.putValue(vertex, link.to)
                    }
                    nbStrate++
                }
                /** remplissage des valeurs de XYZ à intégrer : **/
                for (let vertex of this.mamesh.vertices){
                    valeursXYZ.putValue(vertex,this.CoordAIntegrer(vertex.position.x,vertex.position.y,G_re,G_im,h_re,h_im))
                }

                /** remplissage du dico des intégrales approximées par la méthode du point milieu **/
                dicoVertexIntegrale.putValue(this.mamesh.vertices[0], [0, 0, 0])
                for (let i = 1; i < strates.length; i++) {
                    for (let vertex of strates[i]) {
                        let valPrec = dicoVertexIntegrale.getValue(dicoSommetStratePrecedente.getValue(vertex))
                        let vertPrec = dicoSommetStratePrecedente.getValue(vertex)
                        let X = valPrec[0] + this.prodComplexe(
                            this.prodComplexe(
                                this.sommeComplexe(valeursXYZ.getValue(vertex)[0],
                                valeursXYZ.getValue(vertPrec)[0]),[1/2,0]
                            ), this.diffComplexe([vertex.position.x, vertex.position.y],
                                [vertPrec.position.x, vertPrec.position.y]))[0]
                        let Y = valPrec[1] + this.prodComplexe(this.prodComplexe(this.sommeComplexe(valeursXYZ.getValue(vertex)[1],
                                valeursXYZ.getValue(vertPrec)[1]),[1/2,0]),
                                this.diffComplexe([vertex.position.x, vertex.position.y],
                                    [vertPrec.position.x, vertPrec.position.y]))[0]
                        let Z = valPrec[2] + this.prodComplexe(this.prodComplexe(this.sommeComplexe(valeursXYZ.getValue(vertex)[2],
                                valeursXYZ.getValue(vertPrec)[2]),[1/2,0]),
                                this.diffComplexe([vertex.position.x, vertex.position.y],
                                    [vertPrec.position.x, vertPrec.position.y]))[0]
                        dicoVertexIntegrale.putValue(vertex, [X,Y,Z])
                    }
                }
                for(let vertex of this.mamesh.vertices ){
                    let coord = dicoVertexIntegrale.getValue(vertex)
                    vertex.setPosition(coord[0], coord[2], coord[1])
                }
            }
        }
    }
}