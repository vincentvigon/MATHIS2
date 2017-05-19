/**
 * Created by vigon on 10/05/2017.
 */

module mathis{


    export module smallProject {

        export class LongEdgeVisual {


            static hash(vertex0: Vertex, vertex1: Vertex): string {
                if (vertex0.hashNumber < vertex1.hashNumber) return vertex0.hashNumber + ',' + vertex1.hashNumber
                else return vertex1.hashNumber + ',' + vertex0.hashNumber
            }

            constructor(public vertex0: Vertex,
                        public vertex1: Vertex,
                        color: Color,
                        radius: number,
                        upDirection: XYZ,
                        scene: BABYLON.Scene
                        //private srg:SpacialRandomGraph
            ) {

                let v0 = new Vertex()
                v0.position = this.vertex0.position

                let v1 = new Vertex()
                v1.position = this.vertex1.position

                let vMid = new Vertex()
                let bary = new XYZ(0, 0, 0)
                geo.baryCenter([v0.position, v1.position], [0.5, 0.5], bary)
                vMid.position = new XYZ(0, 0, 0)
                let demiDist = geo.distance(v0.position, v1.position) / 2
                vMid.position.add(upDirection).scale(demiDist).add(bary)

                let line = new Line([v0, vMid, v1], false)

                this.lineViewer = new visu3d.LinesViewer([line], scene)

                this.lineViewer.color = color
                this.lineViewer.constantRadius = radius

                this.lineViewer.go()
            }

            lineViewer: visu3d.LinesViewer

        }

        export class SpacialRandomGraph {


            /**la vrai formule pour le cas gamma=1 n'a pas été traité
             * (ces simulations sont pas assez précises pour montrer la différence entre gamma=1 et gamma proche de 1) */
            get alpha() {
                if (this.gamma <= 1) {
                    return Math.max(Math.min((1 - this.b) / (2 - this.gamma), 1), 0)
                }
                else if (this.gamma > 1) {
                    return Math.max(Math.min((this.gamma - this.b) / (this.gamma), 1), 0)
                }
                else return null
            }

            get Nalpha() {
                return Math.pow(this.N, this.alpha)
            }


            defaultColorForLongEdge = new Color(new RGB_range255(124, 252, 0))
            private energy: number = null
            private candidateEnergy = 1

            private C_gamma = 0

            b = 1
            gamma = 1

            nbTryPerBatch = 1
            lineRadius = 0.01

            upDirection = new XYZ(0, 1, 0)


            private longEdges = new StringMap<LongEdgeVisual>()


            rand = new proba.Random()
            showInitialGraph = true

            private graph: Vertex[]


            constructor(public mamesh: Mamesh,
                        public mathisFrame: MathisFrame,
                        private N// nombre de vertex sur une dimension

            ) {
                this.graph = mamesh.vertices

            }


            viewersForGeodesic: any[] = []

            drawAGeodesic(geodesic: Vertex[][], colorIsBlueVersusBlack) {
                for (let i = 0; i < geodesic.length; i++) {
                    /**la couleur dépend de l'emplacement dans la géodésique*/
                    let val = i / this.extremeGeodesics.length * 255
                    let color
                    if (colorIsBlueVersusBlack) color = new Color(new mathis.RGB_range255(val, val, 255));
                    else color = new Color(new mathis.RGB_range255(val, val, val));

                    /**on trace les vertex*/
                    let verticesViewer = new mathis.visu3d.VerticesViewer(geodesic[i], this.mathisFrame.scene);
                    verticesViewer.color = color
                    verticesViewer.constantRadius = this.vertexRadius * 1.01
                    verticesViewer.go();
                    this.viewersForGeodesic.push(verticesViewer)

                    /**on trace les links*/
                    if (i < this.extremeGeodesics.length - 1) {

                        let vertex0 = geodesic[i][0]
                        let vertex1 = geodesic[i + 1][0]

                        let upDirection = null
                        if (this.longEdges.getValue(LongEdgeVisual.hash(vertex0, vertex1)) != null) {
                            upDirection = this.upDirection
                        }
                        else upDirection = new XYZ(0, 0, 0)
                        let aLongEdge = new LongEdgeVisual(vertex0, vertex1, color, this.lineRadius * 1.1, upDirection, this.mathisFrame.scene)
                        this.viewersForGeodesic.push(aLongEdge.lineViewer)

                    }
                }
            }

            clearAllGeodesic() {
                for (let viewer of this.viewersForGeodesic) {
                    viewer.clear()
                }
                this.viewersForGeodesic = []
            }


            private vertexRadius

            go() {


                /**on met une marque sur les liens initiaux (on en rajoutera des plus longs par la suite, qui n'auront pas cette marque)*/
                for (let vertex of this.mamesh.vertices) {
                    for (let link of vertex.links) {
                        link.customerOb = true
                    }
                }

                let mean = 0
                let nb = 0
                let aVertex = this.mamesh.vertices[0]
                for (let link of aVertex.links) {
                    mean += geo.distance(aVertex.position, link.to.position)
                    nb++
                }
                mean /= nb
                this.vertexRadius = Math.min(mean * 0.5, 0.03)

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
                else {
                    let baseVertexViewer = new visu3d.VerticesViewer(this.mamesh, this.mathisFrame.scene)
                    baseVertexViewer.constantRadius = 0.005
                    baseVertexViewer.go()
                }

            }


            private areClose(vertex0: Vertex, vertex1: Vertex): boolean {

                if (vertex0 == vertex1) return true

                let link = vertex0.findLink(vertex1)

                if (link == null) return false

                if (link.customerOb == null) return false

                return true

            }

            private allClose(vertex: Vertex): Vertex[] {
                let res = []
                for (let link of vertex.links) {
                    if (link.customerOb == true) res.push(link.to)
                }
                return res
            }


            /**Attention : cette formule donne la distance euclidienne quand on suppose que les vertex sont placés
             *
             *  cas1d :  en 1,2,...,N      et non pas  sur [-1,1] comme sur la visualisation
             *  cas2d :  en (1,1) , ..., (N,N)  et non pas  sur [-1,1]^2 comme sur la visualisation
             *  cas2d :  en (1,1,1) , ..., (N,N,N)  et non pas  sur [-1,1]^3 comme sur la visualisation
             *  */
            euclidianDistance(vertex0: Vertex, vertex1: Vertex): number {

                return geo.distance(vertex0.position, vertex1.position) * (this.N - 1) / 2
            }


            probaOfLongEdgeModif = 0.


            batchOfChanges(): {diameter: number;suppression: number;addition: number;modification: number} {


                let suppression = 0
                let addition = 0
                let modification = 0

                for (let t = 0; t < this.nbTryPerBatch; t++) {


                    let linkToAdd: Vertex[] = null
                    let linkToSuppress: Vertex[] = null

                    let proba = (this.longEdges.allValues().length < 4) ? 0 : this.probaOfLongEdgeModif
                    if (this.rand.pseudoRand() < proba) {


                        let aLongEdge = this.longEdges.aRandomValue()

                        let allClos = this.allClose(aLongEdge.vertex1)
                        let vertex1New: Vertex = allClos[Math.floor(allClos.length * this.rand.pseudoRand())]

                        if (!this.areClose(vertex1New, aLongEdge.vertex0)) {
                            linkToAdd = [vertex1New, aLongEdge.vertex0]
                            linkToSuppress = [aLongEdge.vertex1, aLongEdge.vertex0]
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
                        if (this.longEdges.getValue(LongEdgeVisual.hash(vertex0, vertex1)) != null) linkToSuppress = [vertex0, vertex1]
                        else linkToAdd = [vertex0, vertex1]

                    }


                    if (linkToAdd != null) {
                        linkToAdd[0].setOneLink(linkToAdd[1])
                        linkToAdd[1].setOneLink(linkToAdd[0])
                        this.C_gamma += Math.pow(this.euclidianDistance(linkToAdd[0], linkToAdd[1]), this.gamma)
                    }
                    if (linkToSuppress != null) {
                        Vertex.separateTwoVoisins(linkToSuppress[0], linkToSuppress[1])
                        this.C_gamma -= Math.pow(this.euclidianDistance(linkToSuppress[0], linkToSuppress[1]), this.gamma)
                    }


                    /**ici on calcul le nouveau diamètre, on utilise aussi le C_gamma*/
                    let ratioEnergy = this.energyRatio()


                    if (ratioEnergy >= 1 || Math.random() < ratioEnergy) {
                        /**on accepte le changement : le graph a déjà été modifier, il reste à modifier le visuel*/
                        /**on fait des copies avec concat()*/
                        //this.twoExtremeVertices=this.twoExtremeVertices_proposal.concat([])


                        if (linkToAdd != null) {
                            let longEdge = new LongEdgeVisual(linkToAdd[0], linkToAdd[1], this.defaultColorForLongEdge, this.lineRadius, this.upDirection, this.mathisFrame.scene)
                            this.longEdges.putValue(LongEdgeVisual.hash(linkToAdd[0], linkToAdd[1]), longEdge)
                        }
                        if (linkToSuppress != null) {
                            let hash = LongEdgeVisual.hash(linkToSuppress[0], linkToSuppress[1])
                            let longEdge = this.longEdges.getValue(hash)
                            longEdge.lineViewer.clear()
                            this.longEdges.removeKey(hash)

                        }

                        this.energy = this.candidateEnergy
                        this.extremeGeodesics = this.extremeGeodesics_proposal
                        this.diameter = this.diameter_proposal

                        if (linkToAdd != null && linkToSuppress != null) modification++
                        else if (linkToAdd != null) addition++
                        else if (linkToSuppress != null) suppression++
                        else throw "bizarre"

                    }
                    else {
                        /**sinon on fait machine arrière dans le graph*/
                        if (linkToAdd != null) {
                            Vertex.separateTwoVoisins(linkToAdd[0], linkToAdd[1])
                            this.C_gamma -= Math.pow(this.euclidianDistance(linkToAdd[0], linkToAdd[1]), this.gamma)
                        }
                        if (linkToSuppress != null) {
                            linkToSuppress[0].setOneLink(linkToSuppress[1])
                            linkToSuppress[1].setOneLink(linkToSuppress[0])
                            this.C_gamma += Math.pow(this.euclidianDistance(linkToSuppress[0], linkToSuppress[1]), this.gamma)
                        }


                    }
                }


                /**quand le diamètre change : on trace un des chemins parmi les plus long*/
                if (this.diameter_previousBatch != this.diameter) {
                    this.clearAllGeodesic()

                    this.drawAGeodesic(this.extremeGeodesics, true)

                    this.diameter_previousBatch = this.diameter
                }


                return {
                    diameter: this.diameter,
                    suppression: suppression,
                    addition: addition,
                    modification: modification
                }
            }


            private extremeGeodesics_proposal: Vertex[][]
            private extremeGeodesics: Vertex[][]

            private twoExtremeVertices_proposal: Vertex[]
            private twoExtremeVertices: Vertex[]
            private diameter_proposal: number
            private diameter: number
            private diameter_previousBatch: number

            private  energyRatio(): number {

                var diameterComputer = new mathis.graph.HeuristicDiameter(this.mamesh.vertices);
                this.diameter_proposal = diameterComputer.go()
                this.twoExtremeVertices_proposal = diameterComputer.OUT_twoChosenExtremeVertices

                this.extremeGeodesics_proposal = diameterComputer.OUT_oneGeodesicBetweenChosenExtremeVertices
                this.candidateEnergy = Math.pow(this.N, this.b) * this.diameter_proposal + this.C_gamma

                if (this.energy == null) return 1

                return Math.exp(-this.candidateEnergy + this.energy)

            }


        }

    }

}