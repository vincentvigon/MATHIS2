/**
 * Created by vigon on 10/05/2017.
 *
 *
 */

module mathis{


    export module spacialGibbsRandomGraph {

        /**classe interne représentant les grands ponts*/
        class LongEdgeVisual{


            constructor(public vertex0: Vertex,
                        public vertex1: Vertex,
                        drawMe:boolean,
                        color: Color,
                        radius: number,
                        upDirection: XYZ,
                        scene: BABYLON.Scene
            ) {

                let v0 = new Vertex()
                v0.position = this.vertex0.position

                let v1 = new Vertex()
                v1.position = this.vertex1.position

                if (!drawMe) return

                let vMid = new Vertex()
                let bary = new XYZ(0, 0, 0)
                geo.baryCenter([v0.position, v1.position], [0.5, 0.5], bary)
                vMid.position = new XYZ(0, 0, 0)
                let demiDist = geo.distance(v0.position, v1.position) / 2
                vMid.position.add(upDirection).scale(demiDist).add(bary)

                /**on rajoute un vertex en hauteur pour créer une arche*/
                let line = new Line([v0, vMid, v1], false)

                this.lineViewer = new visu3d.LinesViewer([line], scene)

                this.lineViewer.color = color
                this.lineViewer.radiusAbsolute = radius

                this.lineViewer.go()
            }

            lineViewer: visu3d.LinesViewer

            clear(){
                if (this.lineViewer!=null) this.lineViewer.clear()
            }

        }

        export class SpacialRandomGraph {


            /**paramètres importants réglables par l'utilisateur*/
            b = 1
            gamma = 1
            nbTryPerBatch = 1
            probaOfLongEdgeModif = 0.5



            /**réglages secondaire*/
            lineRadius = 0.01
            defaultColorForLongEdge = new Color(new RGB_range255(124, 252, 0))
            upDirection = new XYZ(0, 1, 0)
            /**par défaut, on utilise un générateur pseudo aléatoire avec un graine fixée*/
            rand = new proba.Random()
            showInitialGraph = true
            hiddeAll=false



            private longEdges = new StringMap<LongEdgeVisual>()
            private energy: number = null
            private candidateEnergy = 1
            private C_gamma = 0
            private graph: Vertex[]
            private vertexRadius
            private viewersForGeodesic: any[] = []


            constructor(
                /**maillage initial. ça peut-être n'importe quel graph, mais pour que la théorie fonctionne,
                 * - il faut qu'il y ai en gros N vertex par dimension,
                 * - il faut que la formule de distance euclidienne fonctionne (cf. plus bas)
                 * */
                public mamesh: Mamesh,
                /**mathisFrame: fenêtre graphique*/
                public mathisFrame: MathisFrame,
                /**N: nombre de vertex sur une dimension. Donc le nombre total de vertex est N^dim */
                private N
            ) {
                this.graph = mamesh.vertices

            }



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
                    verticesViewer.radiusAbsolute = this.vertexRadius * 1.01
                    verticesViewer.go();
                    this.viewersForGeodesic.push(verticesViewer)

                    /**on trace les links*/
                    if (i < this.extremeGeodesics.length - 1) {

                        let vertex0 = geodesic[i][0]
                        let vertex1 = geodesic[i + 1][0]

                        let upDirection = null
                        if (this.longEdges.getValue(Hash.segment(vertex0, vertex1)) != null) {
                            upDirection = this.upDirection
                        }
                        else upDirection = new XYZ(0, 0, 0)
                        let aLongEdge:LongEdgeVisual
                        if (this.hiddeAll)  aLongEdge = new LongEdgeVisual(vertex0,vertex1,!this.hiddeAll ,null,null,null,null)
                        else  aLongEdge = new LongEdgeVisual(vertex0, vertex1,!this.hiddeAll ,color, this.lineRadius * 1.1, upDirection, this.mathisFrame.scene)

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


            /**pour lancer la classe*/
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

                if (!this.hiddeAll) {
                    if (this.showInitialGraph) {
                        let baseVertexViewer = new visu3d.VerticesViewer(this.mamesh, this.mathisFrame.scene)
                        baseVertexViewer.radiusAbsolute = this.vertexRadius
                        baseVertexViewer.go()


                        if (this.lineRadius < 0.8 * this.vertexRadius) {
                            let lineViewer = new visu3d.LinesViewer(this.mamesh, this.mathisFrame.scene)
                            lineViewer.radiusAbsolute = this.lineRadius
                            lineViewer.color = new Color(Color.names.indianred)
                            lineViewer.go()
                        }
                    }
                    else {
                        let baseVertexViewer = new visu3d.VerticesViewer(this.mamesh, this.mathisFrame.scene)
                        baseVertexViewer.radiusAbsolute = 0.005
                        baseVertexViewer.go()
                    }
                }

            }


            private areClose(vertex0: Vertex, vertex1: Vertex): boolean {
                if (vertex0 == vertex1) return true
                let link = vertex0.findLink(vertex1)
                if (link == null) return false
                if (link.customerOb == null) return false
                return true
            }

            private getAllCloseVertices(vertex: Vertex): Vertex[] {
                let res = []
                for (let link of vertex.links) {
                    if (link.customerOb == true) res.push(link.to)
                }
                return res
            }


            /**Attention : cette formule donne la distance euclidienne quand on suppose que les vertex sont placés
             *  cas1d :  en 1,2,...,N      et non pas  sur [-1,1] comme sur la visualisation
             *  cas2d :  en (1,1) , ..., (N,N)  et non pas  sur [-1,1]^2 comme sur la visualisation
             *  cas2d :  en (1,1,1) , ..., (N,N,N)  et non pas  sur [-1,1]^3 comme sur la visualisation
             *
             *  pour des graphes plus généraux, il faut réellement calculer la distance euclienne (un tout petit peu plus long)
             *
             *  */
            euclidianDistance(vertex0: Vertex, vertex1: Vertex): number {
                return geo.distance(vertex0.position, vertex1.position) * (this.N - 1) / 2
            }



            /**peut-être appeler autant de fois que l'on désire faire un batch (=paquet) de sample*/

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

                        let allClos = this.getAllCloseVertices(aLongEdge.vertex1)
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

                        /**on tire deux sommets au hasard. */
                        let vertex0 = this.graph[this.rand.pseudoRandInt(this.graph.length)]
                        let vertex1: Vertex = this.graph[this.rand.pseudoRandInt(this.graph.length)]

                        if (this.areClose(vertex0, vertex1)) continue


                        /**si un longEdge existe : on propose de le supprimer, sinon de le rajouter*/
                        if (this.longEdges.getValue(Hash.segment(vertex0, vertex1)) != null) linkToSuppress = [vertex0, vertex1]
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


                        if (linkToAdd != null) {
                            let longEdge:LongEdgeVisual
                            if (this.hiddeAll)  longEdge = new LongEdgeVisual(linkToAdd[0], linkToAdd[1],!this.hiddeAll ,null,null,null,null)
                            else longEdge = new LongEdgeVisual(linkToAdd[0], linkToAdd[1],!this.hiddeAll , this.defaultColorForLongEdge, this.lineRadius, this.upDirection, this.mathisFrame.scene)
                            this.longEdges.putValue(Hash.segment(linkToAdd[0], linkToAdd[1]), longEdge)
                        }
                        if (linkToSuppress != null) {
                            let hash = Hash.segment(linkToSuppress[0], linkToSuppress[1])
                            let longEdge = this.longEdges.getValue(hash)
                            longEdge.clear()
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
                    if (!this.hiddeAll) {
                        this.clearAllGeodesic()
                        this.drawAGeodesic(this.extremeGeodesics, true)
                    }
                    this.diameter_previousBatch = this.diameter
                }


                return {
                    diameter: this.diameter,
                    suppression: suppression,
                    addition: addition,
                    modification: modification
                }
            }


            /**quantité mémorisée durant le calcul de l'énergie.
             * Notamment : on mémorise la géodésique extrémale pour pouvoir la faire apparaître dans la visu.*/
            private extremeGeodesics_proposal: Vertex[][]
            private extremeGeodesics: Vertex[][]
            private diameter_proposal: number
            diameter: number
            private diameter_previousBatch: number

            private  energyRatio(): number {

                var diameterComputer = new mathis.graph.HeuristicDiameter(this.mamesh.vertices);
                this.diameter_proposal = diameterComputer.go()

                this.extremeGeodesics_proposal = diameterComputer.OUT_oneGeodesicBetweenChosenExtremeVertices
                this.candidateEnergy = Math.pow(this.N, this.b) * this.diameter_proposal + this.C_gamma

                if (this.energy == null) return 1

                return Math.exp(-this.candidateEnergy + this.energy)

            }

            /**
             * Quantités prédites par la théorie.
             * la vrai formule pour le cas gamma=1 n'a pas été traité
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






        }

    }

}