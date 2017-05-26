/**
 * Created by vigon on 10/05/2017.
 */


module mathis {
    export module smallProject {


        export function startMourratGraph(){
            let mathisFrame=new MathisFrame()
            let pieceOfCode=new RandomSpacialGraph(mathisFrame)
            let binder=new appli.Binder(pieceOfCode,null,mathisFrame)
            binder.go()
            pieceOfCode.goForTheFirstTime()

        }


        export class RandomSpacialGraph implements appli.PieceOfCode {

            NAME = "RandomSpacialGraph"
            TITLE = "On présente le modèle de Mourrat & Valessin. On voit le sampling de Gibbs en fonctionnement. "


            graphType = "2d"
            $$$graphType = new appli.Choices(["1d", "2d", "3d"])

            N_1d = 20
            $$$N_1d = new appli.Choices([10, 20, 100, 400, 1000, 2000])

            N_2d = 10
            $$$N_2d = new appli.Choices([5, 10, 20, 40])

            N_3d = 5
            $$$N_3d = new appli.Choices([5, 10, 20, 40])


            gamma = 1
            $$$gamma = new appli.Choices([0.1, 0.5, 0.8, 1, 1.2, 2, 4])

            b = 1
            $$$b = [-0.5, 0, 0.5, 1, 2, 4]


            frameInterval = 60
            $$$frameInterval = new appli.Choices([1, 10, 60, 120], {
                onchange: () => {
                    this.action.frameInterval = this.frameInterval
                }
            })


            nbTryPerBatch = 100
            $$$nbTryPerBatch = new appli.Choices([1, 10, 100, 200, 500, 1000], {
                onchange: () => {
                    this.sampler.nbTryPerBatch = this.nbTryPerBatch
                }
            })


            isPaused = false
            $$$isPaused = new appli.Choices([false, true], {
                label: "",
                visualValues: [$('<span class="fa-2x fa fa-pause"></span>'), $('<span class="fa-2x fa fa-play"></span>')],
                containerName: 'N',
                type: appli.ChoicesOptionsType.button
            })


            constructor(private mathisFrame: MathisFrame) {
                this.mathisFrame = mathisFrame


                this.$$$isPaused.options.onchange = () => {
                    for (let action of mathisFrame.periodicActions) action.isPaused = this.isPaused
                }

                this.$$$graphType.options.onchange = () => {
                    this.hideSomeButton()
                    this.go()
                }

            }

            private hideSomeButton() {
                if (this.graphType == "1d") {
                    this.$$$N_1d.show()
                    this.$$$N_2d.hide()
                    this.$$$N_3d.hide()
                }
                else if (this.graphType == "2d") {
                    this.$$$N_1d.hide()
                    this.$$$N_2d.show()
                    this.$$$N_3d.hide()
                }
                else if (this.graphType == "3d") {
                    this.$$$N_1d.hide()
                    this.$$$N_2d.hide()
                    this.$$$N_3d.show()
                }
                else throw "bof"
            }


            goForTheFirstTime() {

                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()

                this.go()
                setTimeout(() => {
                    this.hideSomeButton()
                }, 20)

            }

            sampler: smallProject.SpacialRandomGraph
            action: PeriodicAction

            go() {


                this.mathisFrame.clearScene(false, false)

                let mathisFrame = this.mathisFrame


                let mamesh: Mamesh
                let N: number
                let showInitialGraph = true
                switch (this.graphType) {


                    case '1d': {
                        N = this.N_1d
                        let creator = new reseau.Regular1D(N)
                        creator.origin = new XYZ(-1, 0, 0)
                        creator.end = new XYZ(1, 0, 0)
                        mamesh = creator.go()
                    }
                        break

                    case '2d': {
                        N = this.N_2d
                        let creator = new reseau.Regular()
                        creator.nbI = N
                        creator.nbJ = N
                        creator.origine = new XYZ(-1, 0, -1)
                        let step = 2 / (N - 1)
                        creator.Vi = new XYZ(step, 0, 0)
                        creator.Vj = new XYZ(0, 0, step)
                        mamesh = creator.go()
                    }
                        break

                    case '3d': {
                        N = this.N_3d
                        if (N > 10) showInitialGraph = false
                        let creator = new reseau.Regular3D()
                        creator.nbI = N
                        creator.nbJ = N
                        creator.nbK = N
                        creator.origine = new XYZ(-1, -1, -1)
                        let step = 2 / (N - 1)
                        creator.Vi = new XYZ(step, 0, 0)
                        creator.Vj = new XYZ(0, 0, step)
                        creator.Vk = new XYZ(0, step, 0)
                        mamesh = creator.go()
                    }
                        break
                }


                this.sampler = new smallProject.SpacialRandomGraph(mamesh, this.mathisFrame, N)
                /** 'b' grand => on est très motivé pour réduire le diamètre. Théoriquement*/
                this.sampler.b = this.b
                /** 'gamma' grand => les grands ponts coûtent cher. On voit essentiellement des petits ponts */
                this.sampler.gamma = this.gamma
                this.sampler.nbTryPerBatch = this.nbTryPerBatch
                this.sampler.showInitialGraph = showInitialGraph
                this.sampler.go()

                /**remarque : dès que  alpha(b,gamma)=0, le diamètre asymptotique (N=infty) vaut 1.
                 * Mais les simus ne donnent jamais un tel diamètre.
                 * Les simus donnent un diamètre  toujours plus grand que le diamètre asymptotique
                 *  */


                this.action = new PeriodicAction(() => {
                    let accepted = this.sampler.batchOfChanges()
                    mathisFrame.subWindow_SW.empty()
                    mathisFrame.subWindow_SW.appendAndGoToLine("nb suppressions:" + accepted.suppression)
                    mathisFrame.subWindow_SW.appendAndGoToLine("nb creations:" + accepted.addition)
                    mathisFrame.subWindow_SW.appendAndGoToLine("nb modifications:" + accepted.modification)
                    mathisFrame.subWindow_SW.appendAndGoToLine("diameter:" + accepted.diameter)
                    mathisFrame.subWindow_SW.appendAndGoToLine("alpha:" + this.sampler.alpha.toFixed(1) + "  N^alpha:" + this.sampler.Nalpha.toFixed(1))

                })
                this.action.frameInterval = this.frameInterval
                this.mathisFrame.cleanAllPeriodicActions()
                this.mathisFrame.pushPeriodicAction(this.action)


                for (let action of this.mathisFrame.periodicActions) action.isPaused = this.isPaused

            }


        }
    }

}
