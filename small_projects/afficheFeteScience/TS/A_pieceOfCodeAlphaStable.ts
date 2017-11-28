/**
 * Created by vigon on 25/09/2017.
 */

module mathis {


    export module appli {

        export class ParcoursMaths implements PieceOfCode {
            NAME = "TorusPartLines"
            TITLE = "Problem : lines of the flat reseau behave badly on the torus. \nSolution : merge the vertices and remake links"


            alpha=1.7
            $$$alpha=new Choices([0.8,1,1.2,1.5,1.7,1.9],{label:'alpha'})

            beta=0.
            $$$beta=new Choices([-1,-0.7,-0.5,-0.2,0,0.2,0.5,0.7,1],{label:'beta'})


            nbDicho=4
            $$$nbDicho=new Choices([2,3,4,5],{label:'nb dichotomy'})

            showLine=false
            $$$showLine=new Choices([true,false],{label:"showLines:"})


            shape='sphere'
            $$$shape=new Choices(['sphere','plan'],{label:'shape:'})


            //
            // nbVerticalDecays = 2
            // $$$nbVerticalDecays = [0, 1, 2, 3, 4]
            // nbHorizontalDecays = 1
            // $$$nbHorizontalDecays = [0, 1, 2, 3, 4]
            //
            // bent = true
            // $$$bent = [true, false]
            // merge = false
            // $$$merge = [true, false]
            //
            // nbI = 5
            // $$$nbI = [4, 5, 6, 7, 8]
            // nbJ = 20
            // $$$nbJ = [15, 16, 20, 30]

            polyhedronType="icosahedron"
            $$$polyhedronType=[
                "tetrahedron",
                "cube",
                "octahedron",
                "dodecahedron",
                "icosahedron",
                "truncated tetrahedron",
                "cuboctahedron",
                "truncated cube",
                "truncated octahedron",
                "rhombicuboctahedron",
                "truncated cuboctahedron",
                "snub cube",//or SnubCuboctahedron
                "icosidodecahedron",
                "truncated dodecahedron",
                "truncated icosahedron",
                "rhombicosidodecahedron",
                "truncated icosidodecahedron",
                "snub dodecahedron"//or SnubIcosidodecahedron
            ]

            radiusAbsoluteL=0.05
            $$$radiusAbsoluteL=[0.02,0.05,0.1,0.15]

            radiusAbsoluteV=0.1
            $$$radiusAbsoluteV=[0.05,0.1,0.15]



            polyRadius=1.5
            $$$polyRadius=[1,1.1,1.2,1.4,1.5,1.7,1.9,2]


            interpolationStyle = geometry.InterpolationStyle.hermite
            $$$interpolationStyle = new Choices([geometry.InterpolationStyle.none, geometry.InterpolationStyle.octavioStyle, geometry.InterpolationStyle.hermite]
                , {'before': 'geometry.InterpolationStyle.', 'visualValues': ['none', 'octavioStyle', 'hermite']})


            colorL="#2634d3"
            $$$colorL=[
                "#2634d3",
                "#c93af4",
                "#7356bf",
                "#82517c",
                "#5ee5e3",
                "#3ae2e8",
                "#e5aa5e",
                "#fc8e00",
                "#3eb23c",
                "#226d20",
                "#ad4a54",
                "#bc2534"
            ]









            constructor(private mathisFrame: MathisFrame) {
            }

            goForTheFirstTime() {
                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()

                this.go()
            }


            go() {
                this.mathisFrame.clearScene(false, false)
                // {
                //     //$$$begin
                //     let creator = new reseau.Regular2dPlus()
                //     creator.nbU = this.nbI
                //     creator.nbV = this.nbJ
                //     creator.origin = new XYZ(0, 0, 0)
                //     creator.end = new XYZ(2 * Math.PI, 2 * Math.PI, 0)
                //     creator.nbVerticalDecays = this.nbVerticalDecays
                //     creator.nbHorizontalDecays = this.nbHorizontalDecays
                //     let mamesh = creator.go()
                //
                //     //n
                //     let bent = this.bent
                //     if (bent) {
                //         let r = 0.3
                //         let a = 0.75
                //         mamesh.vertices.forEach((vertex: Vertex) => {
                //
                //             let u = vertex.position.x
                //             let v = vertex.position.y
                //
                //             vertex.position.x = (r * Math.cos(u) + a) * Math.cos((v))
                //             vertex.position.y = (r * Math.cos(u) + a) * Math.sin((v))
                //             vertex.position.z = r * Math.sin(u)
                //
                //         })
                //
                //         let merge = this.merge
                //         if (merge) {
                //             let merger = new grateAndGlue.Merger(mamesh, null, null)
                //             merger.mergeLink = true
                //             merger.goChanging()
                //
                //             let oppositeAssocier = new linkModule.OppositeLinkAssocierByAngles(mamesh.vertices)
                //             oppositeAssocier.maxAngleToAssociateLinks = Math.PI
                //             oppositeAssocier.goChanging()
                //         }
                //     }
                //     let interpolationStyle = this.interpolationStyle
                //     //$$$end
                //
                //
                //     //$$$bh visualization
                //     let lineViewer = new visu3d.LinesViewer(mamesh, this.mathisFrame.scene)
                //     lineViewer.interpolationOption.interpolationStyle = interpolationStyle
                //     lineViewer.go()
                //     //$$$eh
                // }

                {

                    let creator=new polyhedron.Polyhedron(this.polyhedronType)
                    let mamesh=creator.go()



                    let vertexToDraw:Vertex[]=[]

                    for (let v of mamesh.vertices){
                        v.position.scale(this.polyRadius)
                        if (!v.hasMark(Vertex.Markers.polygonCenter)) {
                            vertexToDraw.push(v)

                        }
                    }



                    // let lineViewer = new visu3d.LinesViewer(mamesh, this.mathisFrame.scene)
                    // lineViewer.interpolationOption.interpolationStyle = this.interpolationStyle
                    // lineViewer.radiusAbsolute=this.radiusAbsoluteL
                    // lineViewer.go()

                    let linkViewer=new visu3d.LinksViewer(mamesh, this.mathisFrame.scene)
                    linkViewer.radiusAbsolute=this.radiusAbsoluteL
                    linkViewer.color=new Color("#2634d3")
                    linkViewer.go()

                    let vertexViewer=new visu3d.VerticesViewer(vertexToDraw,this.mathisFrame.scene)
                    vertexViewer.radiusAbsolute=this.radiusAbsoluteV
                    vertexViewer.color=new Color("#181a59")

                    vertexViewer.go()






                }


                {

                    let mamesh:Mamesh
                    if (this.shape=='sphere') {
                        let creator = new polyhedron.Polyhedron("dodecahedron")
                        mamesh = creator.go()
                    }
                    else{

                        let creator=new reseau.Regular2dPlus()
                        creator.maille=reseau.Maille.triangleV
                        creator.origin=new XYZ(-1,-1,0)
                        creator.end=new XYZ(1,1,0)
                        creator.nbU=4
                        creator.nbV=4
                        mamesh=creator.go()
                    }

                    for (let i=0;i<this.nbDicho;i++) new mameshModification.TriangleDichotomer(mamesh).go()

                    if (this.shape=='sphere') for (let vertex of mamesh.vertices) vertex.position.normalize()


                    let fractalModifier=new fractal.StableRandomFractal(mamesh)
                    fractalModifier.referenceDistanceBetweenVertexWithZeroDichoLevel=0.005
                    fractalModifier.alpha=this.alpha
                    fractalModifier.beta=this.beta
                    fractalModifier.deformationFromCenterVersusFromDirection=(this.shape=='sphere')
                    fractalModifier.go()

                    if (this.shape=='plan'){
                        let positioning=new Positioning()
                        positioning.upVector=new XYZ(0,0,1)
                        positioning.applyToVertices(mamesh.vertices)
                    }


                    let surfaceViewer=new visu3d.SurfaceViewer(mamesh,this.mathisFrame.scene)
                    surfaceViewer.alpha=1
                    //surfaceViewer.normalDuplication=visu3d.NormalDuplication.none
                    surfaceViewer.sideOrientation=BABYLON.Mesh.DOUBLESIDE
                    surfaceViewer.go()

                    if (this.showLine) {
                        let lineViewer = new visu3d.LinesViewer(mamesh, this.mathisFrame.scene)
                        lineViewer.interpolationOption.interpolationStyle = geometry.InterpolationStyle.none
                        lineViewer.isThin = true
                        lineViewer.color = color.thema.defaultLinkColor
                        lineViewer.go()
                    }


                }


            }


        }
    }





}