module mathis {

    export module appli{


        export class TorusPlatonicDocu implements OnePage{

            pageIdAndTitle="Torus"
            severalParts:SeveralParts

            constructor(private mathisFrame:MathisFrame) {
                let severalParts = new SeveralParts()
                severalParts.addPart(new BoySurface(this.mathisFrame))
                severalParts.addPart(new TorusPart(this.mathisFrame))
                severalParts.addPart(new TorusPartLines(this.mathisFrame))
                this.severalParts=severalParts
            }

            go() {
                return this.severalParts.go()
            }

        }





        class BoySurface implements PieceOfCode{
            NAME="BoySurface"
            TITLE="The Boy surface"

            nbI=10
            $$$nbI=[5,10,20,30]
            nbJ=10
            $$$nbJ=[5,10,20,30]


            constructor(private mathisFrame:MathisFrame){}

            goForTheFirstTime(){
                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()

                this.go()
            }


            go() {
                this.mathisFrame.clearScene(false, false)

                //$$$begin

                /**SUB_generator allow to compute basis (Vi,Vj) of a planar reseau. If no decays,
                 * Vi and Vj are simply computed so that the reseau start at "origine" [default (0,0,0)]
                 * and finish at "end". To see effect of decays, observe ! */
                let generator = new reseau.BasisForRegularReseau()
                generator.nbI=this.nbI
                generator.nbJ=this.nbJ
                generator.origin=new XYZ(- 0.035,- 0.035,0)
                generator.end=new XYZ(Math.PI,Math.PI,0)


                //n
                let creator = new reseau.Regular(generator)
                let mamesh=creator.go()
                //n



                    mamesh.vertices.forEach((vertex:Vertex)=>{

                        let u=vertex.position.x
                        let v=vertex.position.y


                        vertex.position.x = 2 / 3. * (Math.cos(u) * Math.cos(2 * v)
                            + Math.sqrt(2) * Math.sin(u) * Math.cos(v)) * Math.cos(u) / (Math.sqrt(2) -
                            Math.sin(2 * u) * Math.sin(3 * v))
                        vertex.position.y = 2 / 3. * (Math.cos(u) * Math.sin(2 * v) -
                            Math.sqrt(2) * Math.sin(u) * Math.sin(v)) * Math.cos(u) / (Math.sqrt(2)
                            - Math.sin(2 * u) * Math.sin(3 * v))
                        vertex.position.z = -Math.sqrt(2) * Math.cos(u) * Math.cos(u) / (Math.sqrt(2) - Math.sin(2 * u) * Math.sin(3 * v))

                        //let S = Math.sin(u)


                    })



                //$$$end

                let linksViewer=new visu3d.LinksViewer(mamesh, this.mathisFrame.scene)
                linksViewer.lateralScalingConstant=0.02
                linksViewer.go()

                let surfaceViewer=new visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene)
                surfaceViewer.alpha=0.7
                surfaceViewer.go()



                // let merger=new mameshModification.Merger(mamesh)
                // merger.mergeLink=true
                // merger.goChanging()
                //
                // let oppositeAssocier=new linkModule.OppositeLinkAssocierByAngles(IN_mamesh.vertices)
                // oppositeAssocier.maxAngleToAssociateLinks=Math.PI
                // oppositeAssocier.goChanging()






            }


        }




        class TorusPart implements PieceOfCode{
            NAME="TorusPart"
            TITLE="A twisted torus from a skewed reseau"

            nbVerticalDecays=2
            $$$nbVerticalDecays=[0,1,2,3,4]
            nbHorizontalDecays=1
            $$$nbHorizontalDecays=[0,1,2,3,4]

            bent=false
            $$$bent=[true,false]

            nbI=5
            $$$nbI=[4,5,6,7,8]
            nbJ=20
            $$$nbJ=[15,16,20,30]


            constructor(private mathisFrame:MathisFrame){}

            goForTheFirstTime(){
                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()

                this.go()
            }


            go() {
                this.mathisFrame.clearScene(false, false)

                //$$$begin

                /**SUB_generator allow to compute basis (Vi,Vj) of a planar reseau. If no decays,
                 * Vi and Vj are simply computed so that the reseau start at "origine" [default (0,0,0)]
                 * and finish at "end". To see effect of decays, observe ! */
                let generator = new reseau.BasisForRegularReseau()
                generator.nbI=this.nbI
                generator.nbJ=this.nbJ
                generator.origin=new XYZ(0,0,0)
                generator.end=new XYZ(2*Math.PI,2*Math.PI,0).scale(0.1)
                generator.nbVerticalDecays=this.nbVerticalDecays
                generator.nbHorizontalDecays=this.nbHorizontalDecays
                //n
                let creator = new reseau.Regular(generator)
                let mamesh=creator.go()
                //n
                let bent=this.bent
                if (bent){
                    let r=0.3
                    let a=0.75

                    mamesh.vertices.forEach((vertex:Vertex)=>{

                        let u=vertex.position.x*10
                        let v=vertex.position.y*10

                        vertex.position.x=(r*Math.cos(u)+a)*Math.cos((v))
                        vertex.position.y=(r*Math.cos(u)+a)*Math.sin((v))
                        vertex.position.z=r*Math.sin(u)

                    })
                }


                //$$$end

                let linksViewer=new visu3d.LinksViewer(mamesh, this.mathisFrame.scene)
                linksViewer.lateralScalingConstant=0.02
                    linksViewer.go()

                let surfaceViewer=new visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene)
                surfaceViewer.alpha=0.7
                surfaceViewer.go()



                // let merger=new mameshModification.Merger(mamesh)
                // merger.mergeLink=true
                // merger.goChanging()
                //
                // let oppositeAssocier=new linkModule.OppositeLinkAssocierByAngles(IN_mamesh.vertices)
                // oppositeAssocier.maxAngleToAssociateLinks=Math.PI
                // oppositeAssocier.goChanging()






            }


        }




        class TorusPartLines implements PieceOfCode{
            NAME="TorusPartLines"
            TITLE="Problem : lines of the flat reseau behave badly on the torus. \nSolution : merge the vertices and remake links"

            nbVerticalDecays=2
            $$$nbVerticalDecays=[0,1,2,3,4]
            nbHorizontalDecays=1
            $$$nbHorizontalDecays=[0,1,2,3,4]

            bent=true
            $$$bent=[true,false]
            merge=false
            $$$merge=[true,false]

            nbI=5
            $$$nbI=[4,5,6,7,8]
            nbJ=20
            $$$nbJ=[15,16,20,30]

            interpolationStyle=geometry.InterpolationStyle.hermite
            $$$interpolationStyle=new Choices([geometry.InterpolationStyle.none,geometry.InterpolationStyle.octavioStyle,geometry.InterpolationStyle.hermite]
                ,{'before':'geometry.InterpolationStyle.','visualValues':['none','octavioStyle','hermite']})

            constructor(private mathisFrame:MathisFrame){}

            goForTheFirstTime(){
                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()

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
                let bent=this.bent
                if (bent){
                    let r=0.3
                    let a=0.75
                    mamesh.vertices.forEach((vertex:Vertex)=>{

                        let u=vertex.position.x*10
                        let v=vertex.position.y*10

                        vertex.position.x=(r*Math.cos(u)+a)*Math.cos((v))
                        vertex.position.y=(r*Math.cos(u)+a)*Math.sin((v))
                        vertex.position.z=r*Math.sin(u)

                    })

                    let merge=this.merge
                    if (merge) {
                        let merger = new grateAndGlue.Merger(mamesh,null,null)
                        merger.mergeLink = true
                        merger.goChanging()

                        let oppositeAssocier = new linkModule.OppositeLinkAssocierByAngles(mamesh.vertices)
                        oppositeAssocier.maxAngleToAssociateLinks = Math.PI
                        oppositeAssocier.goChanging()
                    }
                }
                let interpolationStyle=this.interpolationStyle
                //$$$end


                //$$$bh visualization
                let lineViewer=new visu3d.LinesViewer(mamesh, this.mathisFrame.scene)
                lineViewer.interpolationOption.interpolationStyle=interpolationStyle
                    lineViewer.go()
                //$$$eh


            }


        }



        //
        // class TorusAllOptions implements PieceOfCode{
        //     NAME="TorusAllOptions"
        //     TITLE="Problem : lines of the flat reseau behave badly on the torus. \nSolution : merge the vertices and remake links"
        //
        //     nbVerticalDecays=2
        //     $$$nbVerticalDecays=[0,1,2,3,4]
        //     nbHorizontalDecays=1
        //     $$$nbHorizontalDecays=[0,1,2,3,4]
        //
        //     bent=true
        //     $$$bent=[true,false]
        //     merge=false
        //     $$$merge=[true,false]
        //
        //     nbI=5
        //     $$$nbI=[4,5,6,7,8]
        //     nbJ=20
        //     $$$nbJ=[15,16,20,30]
        //
        //     interpolationStyle=geometry.InterpolationStyle.hermite
        //     $$$interpolationStyle=new Choices([geometry.InterpolationStyle.none,geometry.InterpolationStyle.octavioStyle,geometry.InterpolationStyle.hermite]
        //         ,{'before':'geometry.InterpolationStyle.','visualValues':['none','octavioStyle','hermite']})
        //
        //
        //     drawILines=true
        //     $$$drawILines=[true,false]
        //
        //     drawJLines=true
        //
        //     $$$drawJLines=[true,false]
        //
        //     constructor(private mathisFrame:MathisFrame){}
        //
        //     goForTheFirstTime(){
        //         this.mathisFrame.clearScene()
        //         this.mathisFrame.addDefaultCamera()
        //         this.mathisFrame.addDefaultLight()
        //
        //         this.go()
        //     }
        //
        //
        //     go() {
        //         this.mathisFrame.clearScene(false, false)
        //
        //         //$$$begin
        //         let generator = new reseau.BasisForRegularReseau()
        //         generator.nbI=this.nbI
        //         generator.nbJ=this.nbJ
        //         generator.origin=new XYZ(0,0,0)
        //         generator.end=new XYZ(2*Math.PI,2*Math.PI,0).scale(0.1)
        //         generator.nbVerticalDecays=this.nbVerticalDecays
        //         generator.nbHorizontalDecays=this.nbHorizontalDecays
        //
        //         let creator = new reseau.Regular(generator)
        //         let mamesh=creator.go()
        //
        //         //n
        //         let bent=this.bent
        //         if (bent){
        //             let r=0.3
        //             let a=0.75
        //             mamesh.vertices.forEach((vertex:Vertex)=>{
        //
        //                 let u=vertex.position.x*10
        //                 let v=vertex.position.y*10
        //
        //                 vertex.position.x=(r*Math.cos(u)+a)*Math.cos((v))
        //                 vertex.position.y=(r*Math.cos(u)+a)*Math.sin((v))
        //                 vertex.position.z=r*Math.sin(u)
        //
        //             })
        //
        //             let merge=this.merge
        //             if (merge) {
        //                 let merger = new grateAndGlue.Merger(mamesh,null,null)
        //                 merger.mergeLink = true
        //                 merger.goChanging()
        //
        //                 let oppositeAssocier = new linkModule.OppositeLinkAssocierByAngles(mamesh.vertices)
        //                 oppositeAssocier.maxAngleToAssociateLinks = Math.PI
        //                 oppositeAssocier.goChanging()
        //             }
        //         }
        //         let interpolationStyle=this.interpolationStyle
        //         //$$$end
        //
        //
        //         //$$$bh visualization
        //         let lineViewer=new visu3d.LinesViewer(mamesh, this.mathisFrame.scene)
        //         lineViewer.interpolationOption.interpolationStyle=interpolationStyle
        //         lineViewer.go()
        //
        //
        //         //$$$eh
        //
        //
        //     }
        //
        //
        // }
        //
        //





    }
}
