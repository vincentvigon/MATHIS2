module mathis {

    export module appli{


        export class TorusPlatonicDocu implements OnePage{

            pageIdAndTitle="Torus"
            severalParts:SeveralParts

            constructor(private mathisFrame:MathisFrame) {
                let severalParts = new SeveralParts()
                severalParts.addPart(new TorusPart(this.mathisFrame))
                severalParts.addPart(new TorusPartLines(this.mathisFrame))
                //severalParts.addPart(new BoySurface(this.mathisFrame))

                this.severalParts=severalParts
            }

            go() {
                return this.severalParts.go()
            }

        }





        class BoySurface implements PieceOfCode{
            NAME="BoySurface"
            TITLE="The Boy surface"


            nb_U_lines=3
            $$$nb_U_lines=[0,1,2,3,4,5]

            nb_V_lines=3
            $$$nb_V_lines=[0,1,2,3,4,5]



            radius=1
            $$$radius=[0.01,0.02,0.05,0.07,1]


            bend=false
            $$$bend=[true,false]

            showSurface=false
            $$$showSurface=[true,false]



            constructor(private mathisFrame:MathisFrame){}

            goForTheFirstTime(){
                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()

                // this.mathisFrame.getGrabberCamera().changeFrontDir(0,0,0)
                //
                // this.mathisFrame.getGrabberCamera().changePosition(0,6,0)

                this.go()
            }


            go() {
                this.mathisFrame.clearScene(false, false)
                var mathisFrame=this.mathisFrame

                //$$$begin

                /**SUB_generator allow to compute basis (Vi,Vj) of a planar reseau. If no decays,
                 * Vi and Vj are simply computed so that the reseau start at "origine" [default (0,0,0)]
                 * and finish at "end". To see effect of decays, observe ! */

                let nbU=100
                let nbV=100
                let nb_U_lines=this.nb_U_lines
                let nb_V_lines=this.nb_V_lines
                let spaceU=Math.floor(nbU/nb_U_lines)
                let spaceV=Math.floor(nbV/nb_V_lines)
                nbU=nb_U_lines*spaceU
                nbV=nb_V_lines*spaceV


                let generator = new reseau.BasisForRegularReseau()
                generator.nbU=nbU
                generator.nbV=nbV
                generator.origin=new XYZ(-Math.PI,-Math.PI,0)
                generator.end=new XYZ(Math.PI,Math.PI,0)


                //n
                let creator = new reseau.Regular2d(generator)
                let mamesh=creator.go()

                let creator0 = new reseau.Regular2d(generator)
                let mamesh0=creator0.go()
                //n



                if (this.bend) {
                    mamesh.vertices.forEach((vertex: Vertex) => {

                        let u = vertex.position.x
                        let v = vertex.position.y

                        vertex.position.x = 2 / 3. * (Math.cos(u) * Math.cos(2 * v)
                            + Math.sqrt(2) * Math.sin(u) * Math.cos(v)) * Math.cos(u) / (Math.sqrt(2) -
                            Math.sin(2 * u) * Math.sin(3 * v))
                        vertex.position.y = 2 / 3. * (Math.cos(u) * Math.sin(2 * v) -
                            Math.sqrt(2) * Math.sin(u) * Math.sin(v)) * Math.cos(u) / (Math.sqrt(2)
                            - Math.sin(2 * u) * Math.sin(3 * v))
                        vertex.position.z = -Math.sqrt(2) * Math.cos(u) * Math.cos(u) / (Math.sqrt(2) - Math.sin(2 * u) * Math.sin(3 * v))

                        //let S = Math.sin(u)

                    })
                }


                let radius=this.radius
                //$$$end


                //$$$bh visualisation


                let lineBuilder = new lineModule.LineComputer(mamesh)
                lineBuilder.startingVertices = []
                for (let i = 0; i < mamesh.vertices.length; i++) {
                    let vertex = mamesh.vertices[i]
                    if ( vertex.param.x  == 0 && vertex.param.y%spaceU == 0) lineBuilder.startingVertices.push(vertex);
                    else if (vertex.param.x%spaceV == 0 && vertex.param.y  == 0) lineBuilder.startingVertices.push(vertex);
                }
                mamesh.lines = lineBuilder.go()
                let lineViewer = new visu3d.LinesViewer(mamesh, mathisFrame.scene)
                //lineViewer.color = new Color(Color.names.favoriteGreen)
                lineViewer.radiusFunction=function(alpha:number,position:XYZ){
                    return Math.min(geo.norme(position)*radius,radius)
                }
                lineViewer.go()


                // function UorV_lines(space:number,UorV:boolean) {
                //     let lineBuilder = new lineModule.LineComputer(mamesh)
                //     lineBuilder.startingVertices = []
                //     for (let i = 0; i < mamesh.vertices.length; i++) {
                //         let vertex = mamesh.vertices[i]
                //         if (UorV && vertex.param.x  == 0 && vertex.param.y%space == 0) lineBuilder.startingVertices.push(vertex);
                //         else if (!UorV && vertex.param.x%space == 0 && vertex.param.y  == 0) lineBuilder.startingVertices.push(vertex);
                //     }
                //     mamesh.lines = lineBuilder.go()
                //     let lineViewer = new visu3d.LinesViewer(mamesh, mathisFrame.scene)
                //     //lineViewer.color = new Color(Color.names.favoriteGreen)
                //     lineViewer.radiusFunction=function(alpha:number,position:XYZ){
                //         return Math.min(geo.norme(position)*radius,radius)
                //     }
                //     lineViewer.go()
                //
                //
                //
                //
                //
                // }
                // if (nb_U_lines>0){
                //     UorV_lines(spaceU,false)
                // }
                //
                //
                // if (nb_V_lines>0){
                //     UorV_lines(spaceV,true)
                // }






                if (this.showSurface) {
                    let surfaceViewer = new visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene)
                    surfaceViewer.alpha = 0.7
                    surfaceViewer.normalDuplication=visu3d.NormalDuplication.none
                    surfaceViewer.go()
                }
                //$$$eh








            }


        }




        class TorusPart implements PieceOfCode{
            NAME="TorusPart"
            TITLE="A twisted torus from a skewed reseau"

            nbVerticalDecays=2
            $$$nbVerticalDecays=[0,1,2,3,4]
            nbHorizontalDecays=1
            $$$nbHorizontalDecays=[0,1,2,3,4]

            bent=true
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
                let creator = new reseau.Regular2dPlus()
                creator.nbU=this.nbI
                creator.nbV=this.nbJ
                creator.origin=new XYZ(0,0,0)
                creator.end=new XYZ(2*Math.PI,2*Math.PI,0)
                creator.nbVerticalDecays=this.nbVerticalDecays
                creator.nbHorizontalDecays=this.nbHorizontalDecays
                let mamesh=creator.go()
                //n
                let bent=this.bent
                if (bent){
                    var r=0.3
                    var a=0.75

                    mamesh.vertices.forEach((vertex:Vertex)=>{

                        let u=vertex.position.x
                        let v=vertex.position.y

                        vertex.position.x=(r*Math.cos(u)+a)*Math.cos((v))
                        vertex.position.y=(r*Math.cos(u)+a)*Math.sin((v))
                        vertex.position.z=r*Math.sin(u)

                    })
                }


                //$$$end

                let linksViewer=new visu3d.LinksViewer(mamesh, this.mathisFrame.scene)
                linksViewer.radiusAbsolute=0.01
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
                let creator = new reseau.Regular2dPlus()
                creator.nbU=this.nbI
                creator.nbV=this.nbJ
                creator.origin=new XYZ(0,0,0)
                creator.end=new XYZ(2*Math.PI,2*Math.PI,0)
                creator.nbVerticalDecays=this.nbVerticalDecays
                creator.nbHorizontalDecays=this.nbHorizontalDecays
                let mamesh=creator.go()

                //n
                let bent=this.bent
                if (bent){
                    let r=0.3
                    let a=0.75
                    mamesh.vertices.forEach((vertex:Vertex)=>{

                        let u=vertex.position.x
                        let v=vertex.position.y

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
