/**
 * Created by vigon on 13/06/2017.
 */

module mathis{

    export module spacialGibbsRandomGraph{

        declare var Plotly:any


        export function startCurvesDemo(){
            //let mathisFrame=new MathisFrame()
            let pieceOfCode=new Curves()
            let binder=new appli.Binder(pieceOfCode,$('#controls'),null)
            binder.containersToPutCommand.putValue('restartingControls',$('#restartingControls'))
            binder.go()
            pieceOfCode.goForTheFirstTime()

            // let a=[]
            // a[10]=100
            // a[100]=3
            // for (let b in a) cc(b)
            //
            // cc(a)



        }


        export class Curves implements appli.PieceOfCode {

            NAME = "RandomSpacialGraph"
            TITLE = "On présente le modèle de Mourrat & Valessin. On voit le sampling de Gibbs en fonctionnement. "

            nbSteps=200
            $$$nbSteps=new appli.Choices([5,10,40,50,60,80,100,200,500,1000],{containerName:'restartingControls'})


            // graphType = "2d"
            // $$$graphType = new appli.Choices(["1d", "2d", "3d"])
            //
            // N_1d = 20
            // $$$N_1d = new appli.Choices([10, 20, 100, 400, 1000, 2000])
            //
            // N_2d = 10
            // $$$N_2d = new appli.Choices([5, 10, 20, 40])
            //
            // N_3d = 5
            // $$$N_3d = new appli.Choices([5, 10, 20, 40])


            deltaN=10
            $$$deltaN=new appli.Choices([5,10,50,100,500],{onchange:()=>{}})


            gamma = 0.5
            $$$gamma = new appli.Choices([0.1, 0.5, 0.8, 1, 1.2, 2, 4],{containerName:'restartingControls'})

            b = 0
            $$$b = new appli.Choices([-2,-1,-0.5, -0.2,-0.1, 0,0.1,0.2, 0.5, 1, 2, 4],{containerName:'restartingControls'})

            // occurrenceDifferenceToChangeN=100
            // $$$occurrenceDifferenceToChangeN=new appli.Choices([100,200,300,500,1000],{onchange:()=>{}})


            // ratioOfRich=0.2
            // $$$ratioOfRich=new appli.Choices([0.1,0.2,0.3,0.4],{onchange:()=>{}})
            //
            // ratioOfRichness=0.7
            // $$$ratioOfRichness=new appli.Choices([0.65,0.7,0.75,0.8],{onchange:()=>{}})


            nbTryPerBatch = 10
            $$$nbTryPerBatch = new appli.Choices([1, 10,20,30,50, 100,150, 200], {
                onchange: () => {
                    this.sampler.nbTryPerBatch = this.nbTryPerBatch
                }
            })


            nbConsecutiveCloseMeansToStop=60
            $$$nbConsecutiveCloseMeansToStop=new appli.Choices([5,30,60,100,200],{onchange:()=>{}})
            runningMeanWidth=100
            $$$runningMeanWidth=new appli.Choices([3,50,100,200,300],{onchange:()=>{}})
            toleranceToBeCloseMeans=0.03
            $$$toleranceToBeCloseMeans=new appli.Choices([0.01,0.02,0.03,0.05,0.07,0.1,0.15],{onchange:()=>{}})



            constructor() {}


            goForTheFirstTime() {


                this.go()
                // setTimeout(() => {
                //     this.hideSomeButton()
                // }, 20)

            }

            sampler: SpacialRandomGraph
            slowDiameters:number[]
            Ns:number[]
            currentN:number
            Nalpha:number[]



            alpha:number


            diametersRapid:number[]
            nbTryRapide:number[]

            queue:Queue
            go() {


                if(this.queue!=null) this.queue.dispose()
                this.queue=new Queue()


                this.currentN=0
                this.Ns=[]
                this.slowDiameters=[]
                this.Nalpha=[]
                this.alpha=this.computeAlpha()
                $('#alphaValue').empty().append('alpha:'+this.alpha.toFixed(2))


                this.queue.pushGroupOfTask([
                    ()=>{this.prepareSlowCurve(this.queue)},
                    ()=>{this.prepareRapidCurve(this.queue)}
                ])

                for (let count=0; count<this.nbSteps; count++){
                    this.queue.pushGroupOfTask([
                        ()=>{

                            this.currentN+=this.deltaN
                            this.startSampler()
                            this.diametersRapid=[0]
                            this.nbTryRapide=[0]
                            this.currentT=0
                            this.runningSum=[]
                            this.rapidRunningMeans=[]
                            this.previousMean=0
                            this.nbConsecutiveSameMean=0

                            this.queue.nextOne()
                        },
                        /**next task is repeated several times*/
                            ()=>{

                            this.severalBatchOfDiameterComputation(this.queue)
                        },
                        ()=>{
                            this.updateSlowCurve(this.queue)
                        }
                    ],true)
                }



                //
                // let update=()=> {
                //     count++
                //     cc('cnt',count)
                //     if(count >= this.maxCount) return;
                //
                //     N+=this.deltaN
                //
                // }

            }





            private prepareSlowCurve(queue:Queue){
                // var layout = {
                //     title:'Mean diameters according to N'
                // };

                var layout = {
                    legend: {x: 0, y: 1.1},
                    title:'size N -> mean-diameters'
                }

                let trace1={
                    name: 'mean diameter',
                    x: this.Ns,
                    y: this.slowDiameters,
                    mode: 'lines+markers'
                }


                let trace2={
                    name: 'N^alpha',
                    x: this.Ns,
                    y: this.Nalpha,
                    mode: 'lines+markers'

                }

                let trace3={
                    name:'N',
                    x:[],
                    y:[]
                }

                Plotly.newPlot('mainCurve', [trace1,trace2,trace3], layout)
                    .then(()=>queue.nextOne())

            }

            private prepareRapidCurve(queue:Queue){
                let trace3={
                    name: 'diameter',
                    x: this.nbTryRapide,
                    y: this.diametersRapid,
                    mode: 'lines'
                }


                let trace4={
                    name: 'runningMean',
                    x: [],
                    y: [],
                    mode: 'lines'
                }



                var layout = {
                    legend: {x: 0, y: 1.1},
                    title:'nb tries -> diameters'
                };

                Plotly.newPlot('rapidCurve', [trace3,trace4], layout)
                    .then(()=>queue.nextOne())

            }


            private updateSlowCurve(queue:Queue){

                this.Nalpha.push(this.currentN**this.alpha)


                var updateObj = {
                    x: [this.Ns,this.Ns,this.Ns],
                    y: [this.slowDiameters,this.Nalpha,this.Ns],
                };

                Plotly.restyle('mainCurve', updateObj, [0,1,2])
                    .then(()=>{ queue.nextOne()});

            }

            private updateRapideCurve(then:()=>void){


                let nbTryCut=this.nbTryRapide.slice(0,this.rapidRunningMeans.length)

                var updateObj = {
                    x: [this.nbTryRapide,nbTryCut],
                    y: [this.diametersRapid,this.rapidRunningMeans],

                };
                Plotly.restyle('rapidCurve', updateObj, [0,1])
                    .then(()=>{ then()});
            }




            /**on lance les sampling par paquets de batch. En chaque lancement, un petit timeout est introduit pour rendre la main.
             * En effet, si on fait une simple boucle while, on n'a plus jamais la main sur les contrôles dans le navigateur. */
            currentT:number
            private severalBatchOfDiameterComputation(queue:Queue){

                let T=Math.max(1,200/this.nbTryPerBatch)

                let meanDiameter=null
                for (let t=0;t<T;t++){


                    this.sampler.batchOfChanges()

                    let diameter = this.sampler.diameter
                    // une sécurité (normalement inutile) ici
                    if (diameter==null){
                        meanDiameter=null
                        cc("Attention, le sample renvoie un diametre null ")
                        break
                    }

                    this.diametersRapid.push(diameter)
                    this.nbTryRapide.push(this.nbTryRapide[this.nbTryRapide.length-1]+this.nbTryPerBatch)

                    meanDiameter=this.stoppingCriterium(diameter)

                    this.currentT++

                    if (meanDiameter!=null){
                        break
                    }
                }
                if (meanDiameter==null) {
                    this.updateRapideCurve(()=>{
                        queue.sameOne()
                    })
                }
                else{
                    this.slowDiameters.push(meanDiameter)
                    this.Ns.push(this.currentN)
                    queue.nextOne()
                }


            }


            runningSum:number[]
            previousMean:number
            nbConsecutiveSameMean:number
            rapidRunningMeans:number[]


            private stoppingCriterium(aNewDiam:number):number{



                let security=50000



                this.runningSum[this.currentT]=aNewDiam


                for (let t=1; t<this.runningMeanWidth; t++){
                    if(this.currentT-t>=0) this.runningSum[this.currentT-t]+=aNewDiam
                }




                if (this.currentT>this.runningMeanWidth){

                    /**attention : ne pas prendre le dernier élément de runningSum, il n'a pas encore été rempli*/
                    let currentMean=this.runningSum[this.currentT-this.runningMeanWidth]/this.runningMeanWidth
                    this.rapidRunningMeans.push(currentMean)

                    /** la tolérance est relative : pour les grand N, les moyennes de diamètre sont souvent grandes, et il faut  plus souple  */
                    if (Math.abs(currentMean-this.previousMean)/currentMean<this.toleranceToBeCloseMeans){

                        this.nbConsecutiveSameMean++
                        //cc('this.nbConsecutiveSameMean',this.nbConsecutiveSameMean,currentMean,this.previousMean)
                    }
                    else{
                        this.previousMean=currentMean
                        this.nbConsecutiveSameMean=0
                    }

                    if (this.nbConsecutiveSameMean>=this.nbConsecutiveCloseMeansToStop) return currentMean

                    else if (this.currentT>security){
                        cc('pas converger')
                        return currentMean
                    }
                }




                return null




            }








            private startSampler(){


                let creator = new reseau.Regular1D(this.currentN)
                creator.origin = new XYZ(-1, 0, 0)
                creator.end = new XYZ(1, 0, 0)
                let mamesh = creator.go()

                this.sampler = new SpacialRandomGraph(mamesh, null, this.currentN)
                /** 'b' grand => on est très motivé pour réduire le diamètre.*/
                this.sampler.b = this.b
                /** 'gamma' grand => les grands ponts coûtent cher. On voit essentiellement des petits ponts */
                this.sampler.gamma = this.gamma
                this.sampler.nbTryPerBatch = this.nbTryPerBatch
                this.sampler.hiddeAll = true
                this.sampler.go()


            }

            //
            // private plotCurve(diameters:number[],Ns:number[]){
            //
            //     cc('new curve',diameters.toString())
            //
            //     var trace1 = {
            //         x: Ns,
            //         y: diameters,
            //         mode: 'lines'
            //     };
            //
            //
            //
            //     // var trace3 = {
            //     //     x: [1, 2, 3, 4],
            //     //     y: [12, 9, 15, 12],
            //     //     mode: 'lines+markers'
            //     // };
            //
            //     var data = [ trace1];
            //
            //     var layout = {
            //         title:'Line and Scatter Plot'
            //     };
            //
            //     $('#mainCurve').empty()
            //     Plotly.newPlot('mainCurve', data, layout);
            //
            //
            // }
            //
            //
            // private updatableGraph(){
            //     var WAIT = 200;
            //     var UPDATE_LEN = 500;
            //     var cnt = 0;
            //
            //     Plotly.plot('mainCurve', [{
            //         name: 'base',
            //         y: makeData(0),
            //         line: { shape: 'spline' }
            //     }, {
            //         name: 'update ' + cnt,
            //         y: makeData(cnt),
            //         line: { shape: 'spline' }
            //     }], {
            //         legend: { traceorder: 'reversed' }
            //     })
            //         .then(function() { update(cnt); })
            //
            //     function update(cnt) {
            //         if(cnt === UPDATE_LEN) return;
            //
            //         setTimeout(function() {
            //             var updateObj = {
            //                 name: ['update ' + cnt],
            //                 y: [makeData(cnt)],
            //             };
            //
            //             Plotly.restyle('graph', updateObj, [1])
            //                 .then(function() { update(++cnt) });
            //
            //         }, WAIT);
            //     }
            //
            //     function makeData(offset) {
            //         var N = 10;
            //         var arr = Array.apply(null, Array(N));
            //         var data = arr.map(function() {
            //             return offset + 10*Math.random();
            //         });
            //
            //         return data;
            //     }
            //
            //
            //
            // }

            computeAlpha() {
                if (this.gamma <= 1) {
                    return Math.max(Math.min((1 - this.b) / (2 - this.gamma), 1), 0)
                }
                else if (this.gamma > 1) {
                    return Math.max(Math.min((this.gamma - this.b) / (this.gamma), 1), 0)
                }
                else return null
            }


        }


    }

}