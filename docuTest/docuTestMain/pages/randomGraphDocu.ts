/**
 * Created by vigon on 19/11/2016.
 */

module mathis{

    export module documentation{


        export class RandomGraphDocu implements OnePage{

            pageIdAndTitle="Random graphs"
            severalParts:SeveralParts

            constructor(private mathisFrame:MathisFrame){
                let several=new SeveralParts()
                several.addPart(new RandomSpacialGraph(this.mathisFrame))
                this.severalParts=several
            }

            go(){
                return this.severalParts.go()
            }


        }



        class RandomSpacialGraph implements PieceOfCode{

            $$$name="RandomSpacialGraph"
            $$$title=" Mourrat & Valessin model. \n Beta grand : on est très motivé pour réduire le diamètre. \n gamma grand : les grands ponts coûtent cher."

            link=true
            $$$link=new Choices([true,false])


            gamma=1
            $$$gamma=[0.1,0.5,0.8,1,1.2,2,4]

            b=1
            $$$b=[-0.5,0,0.5,1,2,4]


            frameInterval=60
            $$$frameInterval=[1,10,60,120]


            nbTryPerBatch=10
            $$$nbTryPerBatch=[1,10,100,200,500,1000]


            N_1d=20
            $$$N_1d=[10,20,100,400,1000,2000]

            N_2d=5
            $$$N_2d=[5,10,20,40]

            N_3d=5
            $$$N_3d=[5,10,20,40]


            graphType="1d"
            $$$graphType=["1d","2d","3d"]




            constructor(private mathisFrame:MathisFrame){
                this.mathisFrame=mathisFrame

            }


            goForTheFirstTime(){
                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()
                // let camera=this.mathisFrame.getGrabberCamera()
                // camera.changePosition(new XYZ(0,0,-5))
                this.go()
            }

            go(){

                this.mathisFrame.clearScene(false, false)



                let mathisFrame=this.mathisFrame


                //$$$begin

                let mamesh:Mamesh
                let N:number
                let showInitialGraph=true
                switch (this.graphType){

                    case '1d':{
                        N=this.N_1d
                        let creator=new reseau.Regular1D(N)
                        creator.origin=new XYZ(-1,0,0)
                        creator.end=new XYZ(1,0,0)
                        mamesh=creator.go()
                    }
                    break

                    case '2d':{
                        N=this.N_2d
                        let creator=new reseau.Regular()
                        creator.nbI=N
                        creator.nbJ=N
                        creator.origine=new XYZ(-1,0,-1)
                        let step=2/(N-1)
                        creator.Vi=new XYZ(step,0,0)
                        creator.Vj=new XYZ(0,0,step)
                        mamesh=creator.go()
                    }
                        break

                    case '3d':{
                        N=this.N_3d
                        if (N>10) showInitialGraph=false
                        let creator=new reseau.Regular3D()
                        creator.nbI=N
                        creator.nbJ=N
                        creator.nbK=N
                        creator.origine=new XYZ(-1,-1,-1)
                        let step=2/(N-1)
                        creator.Vi=new XYZ(step,0,0)
                        creator.Vj=new XYZ(0,0,step)
                        creator.Vk=new XYZ(0,step,0)
                        mamesh=creator.go()
                    }
                        break

                }


                let sampling=new metropolis.SpacialRandomGraph(mamesh,this.mathisFrame,N)
                sampling.b=this.b
                sampling.gamma=this.gamma
                sampling.nbTryPerBatch=this.nbTryPerBatch
                sampling.showInitialGraph=showInitialGraph
                sampling.go()



                let action=new PeriodicActionBeforeRender(function(){
                    let accepted=sampling.batchOfChanges()
                    mathisFrame.messageDiv.empty()
                    mathisFrame.messageDiv.append("nb suppressions:"+accepted.suppression)
                    mathisFrame.messageDiv.append("nb additions:"+accepted.addition)
                    mathisFrame.messageDiv.append("nb modification:"+accepted.modification)
                    mathisFrame.messageDiv.append("diameter:"+accepted.diameter)
                    mathisFrame.messageDiv.append("N^alpha:"+sampling.Nalpha.toFixed(1))
                    mathisFrame.messageDiv.append("alpha:"+sampling.alpha.toFixed(1))

                })
                action.frameInterval=this.frameInterval
                this.mathisFrame.cleanAllPeriodicActions()
                this.mathisFrame.pushPeriodicAction(action)


                //$$$end






            }
        }






    }


}



/**
 * Created by vigon on 01/05/2017.
 */
