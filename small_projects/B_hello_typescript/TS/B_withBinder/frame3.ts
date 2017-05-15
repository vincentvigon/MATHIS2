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
                ,{visualValues:['none','octavioStyle','hermite'],
                 containerName:'S'})

                  constructor(private mathisFrame:MathisFrame){}

            goForTheFirstTime(){

                this.go()
            }


            go() {
                this.mathisFrame.clearScene(false, false)

                //$$$begin
                let generator = new reseau.BasisForRegularReseau()
                generator.nbI=this.nbI
                generator.nbJ=this.nbJ
                generator.origin=new XYZ(0,0,0)
                generator.end=new XYZ(2*Math.PI,2*Math.PI,0).scale(0.1)
                generator.nbVerticalDecays=this.nbVerticalDecays
                generator.nbHorizontalDecays=this.nbHorizontalDecays

                let creator = new reseau.Regular(generator)
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