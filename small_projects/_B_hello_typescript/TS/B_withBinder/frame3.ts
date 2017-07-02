/**
 * Created by vigon on 10/05/2017.
 */



module mathis {


    export module totoModule {



        export class TorusWithTurningLine implements appli.PieceOfCode{
            NAME="TorusPartLines"
            TITLE=""

            nbVerticalDecays=2
            $$$nbVerticalDecays=[0,1,2,3,4]
            nbHorizontalDecays=1
            $$$nbHorizontalDecays=[0,1,2,3,4]

            nbI=5
            $$$nbI=new appli.Choices([4,5,6,7,8],{containerName:'NW'})
            nbJ=20
            $$$nbJ=new appli.Choices([15,16,20,30],{containerName:'NW'})


            interpolationStyle=geometry.InterpolationStyle.hermite
            $$$interpolationStyle=new appli.Choices([geometry.InterpolationStyle.none,geometry.InterpolationStyle.octavioStyle,geometry.InterpolationStyle.hermite]
                ,{visualValues:['no interpolation','octavio style','hermite style'],
                 containerName:'S',type:appli.ChoicesOptionsType.button})


            changeNbICommand=0
            $$$changeNbICommand=new appli.Choices([0],{visualValues:['change nbI-select'],type:appli.ChoicesOptionsType.button,containerName:'N'})


                  constructor(private mathisFrame:MathisFrame){


                      /** commands can change values of other command.
                       * (but be careful of the infinite loop when command1->command2 and command2->command1) */
                      this.$$$nbI.options.onchange=()=>{
                          this.$$$nbJ.changeIndex(1)
                      }


                      /** ultimate trick : you can re-bind the pieceOfCode inside itself.
                       * that allows to change all the command dynamically */
                      this.$$$changeNbICommand.options.onchange=()=>{
                          this.$$$nbI=new appli.Choices([4,5,6,7,8,9,10,11,12,13],{containerName:'NE'})
                          let binder=new appli.Binder(this, $('#frame3Commands'), mathisFrame)
                          binder.cleanContainerBefore=true
                          binder.go()
                      }




                      // this.$$$nbI.options.onchange=()=>{
                      //
                      //     this.go()
                      // }



                      // this.$$$nbJ.options.onchange=()=>{
                      //     this.$$$nbI.changeIndex( (this.nbJ+1)%this.$$$nbJ.values.length)
                      // }


                  }

            goForTheFirstTime(){

                this.go()
            }


            go() {

                this.mathisFrame.clearScene(false, false)

                //$$$begin
                let creator = new reseau.Regular2dPlus()
                creator.nbU=this.nbI
                creator.nbV=this.nbJ
                creator.origin=new XYZ(0,0,0)
                creator.end=new XYZ(2*Math.PI,2*Math.PI,0).scale(0.1)
                creator.nbVerticalDecays=this.nbVerticalDecays
                creator.nbHorizontalDecays=this.nbHorizontalDecays
                let mamesh=creator.go()

                //n

                    let r=0.3
                    let a=0.75
                    mamesh.vertices.forEach((vertex:Vertex)=>{

                        let u=vertex.position.x*10
                        let v=vertex.position.y*10

                        vertex.position.x=(r*Math.cos(u)+a)*Math.cos((v))
                        vertex.position.y=(r*Math.cos(u)+a)*Math.sin((v))
                        vertex.position.z=r*Math.sin(u)

                    })


                        let merger = new grateAndGlue.Merger(mamesh,null,null)
                        merger.mergeLink = true
                        merger.goChanging()

                        let oppositeAssocier = new linkModule.OppositeLinkAssocierByAngles(mamesh.vertices)
                        oppositeAssocier.maxAngleToAssociateLinks = Math.PI
                        oppositeAssocier.goChanging()



                let lineViewer=new visu3d.LinesViewer(mamesh, this.mathisFrame.scene)
                lineViewer.interpolationOption.interpolationStyle=this.interpolationStyle
                lineViewer.go()



            }


        }

    }
}