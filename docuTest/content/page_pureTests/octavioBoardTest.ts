

module mathis {

    export module appli{



        export class Creation2dDocu implements OnePage{

            pageIdAndTitle="Octavio boards"
            severalParts:SeveralParts


            constructor(private mathisFrame:MathisFrame) {
                let several = new SeveralParts()

                several.addPart(new OctavioThreeDBoard(this.mathisFrame))


                //several.addPart(new OctavioConcentricBoard(this.mathisFrame))

                several.addPart(new SimpleTube(this.mathisFrame))

                several.addPart(new OctavioPlanarBoard(this.mathisFrame))
                this.severalParts=several
            }

            go() {
                return this.severalParts.go()
            }

        }


        //
        // class OctavioConcentricBoard implements PieceOfCode {
        //
        //     NAME = "OctavioConcentricBoard"
        //     TITLE = "OctavioConcentricBoard"
        //
        //
        //     _linesAsSortedString=""
        //
        //     constructor(private mathisFrame:MathisFrame) {
        //         this.mathisFrame = mathisFrame
        //     }
        //
        //     goForTheFirstTime() {
        //         this.mathisFrame.clearScene()
        //         this.mathisFrame.addDefaultCamera()
        //         this.mathisFrame.addDefaultLight()
        //         this.go()
        //     }
        //
        //     go() {
        //
        //         this.mathisFrame.clearScene(false, false)
        //
        //         //$$$begin
        //         let mamesh: Mamesh
        //
        //         let crea = new octavioBoard.Concentric(12, 12)
        //         crea.nbPatches = 2
        //         crea.shapes = [mathis.octavioBoard.PartShape.square, mathis.octavioBoard.PartShape.polygon6]
        //         // crea.propBeginToRound = [0]
        //         // crea.propEndToRound = [0, 0.5]
        //         crea.individualTranslation = [new XYZ(-0.3, 0, 0), new XYZ(0.3, 0, 0)]
        //         crea.forceToGrate=[0.5,0.1]
        //         mamesh = crea.go()
        //
        //
        //
        //         //$$$end
        //
        //
        //         //$$$bh visualization
        //
        //         spacialTransformations.adjustInASquare(mamesh,new XYZ(-0.7,-0.7,0),new XYZ(0.7,0.7,0))
        //
        //
        //         mamesh.fillLineCatalogue()
        //         this._linesAsSortedString=mamesh.allLinesAsASortedString()
        //
        //         let lineIndexer=new lineModule.CreateAColorIndexRespectingBifurcationsAndSymmetries(mamesh)
        //         lineIndexer.packSymmetricLines=false
        //         let index=lineIndexer.go()
        //
        //         let liner=new visu3d.LinesViewer(mamesh,this.mathisFrame.scene)
        //         liner.interpolationOption=new geometry.InterpolationOption()
        //         liner.lineToLevel=index
        //         liner.interpolationOption.interpolationStyle=geometry.InterpolationStyle.octavioStyle
        //         liner.go()
        //         //$$$eh
        //
        //
        //
        //     }
        //
        //
        // }
        //


        class OctavioThreeDBoard implements PieceOfCode {

            NAME = "OctavioThreeDBoard"
            TITLE = "octavio board 3d"



            faceDescription="empty"
            $$$faceDescription=["empty","centralTriangle","centralTriangleAndSquare","upSideDown"]

            triangleDescription="default"
            $$$triangleDescription=["default"]



            seeAll_Vs_quadFace_Vs_triFace=0
            $$$seeAll_Vs_quadFace_Vs_triFace=[0,1,2]


            polyhedronType="octahedron"
            $$$polyhedronType=["tetrahedron",
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
                "snub dodecahedron",
                "triangular prism",
                "pentagonal prism",
                "hexagonal prism",
                "octagonal prism",
                "decagonal prism",
                "square antiprism",
                "pentagonal antiprism",
                "hexagonal antiprism",
                "octagonal antiprism",
                "decagonal antiprism"
            ]


            interpolationStyle=geometry.InterpolationStyle.octavioStyle
            $$$interpolationStyle=new Choices(allIntegerValueOfEnume(geometry.InterpolationStyle),{"before":"geometry.InterpolationStyle.","visualValues":allStringValueOfEnume(geometry.InterpolationStyle)})




            nbI=10
            $$$nbI=[6,7,10,12,15,16,20]

            _linesAsSortedString=""
            _nbVertices:number
            _nbLoopLines:number
            _nbStraightLines:number


            finalize=true
            $$$finalize=[true,false]

            canCreateBifurcations=true
            $$$canCreateBifurcations=[true,false]




            constructor(private mathisFrame:MathisFrame) {
                this.mathisFrame = mathisFrame

            }

            goForTheFirstTime() {
                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()
                this.go()
            }

            go() {


                this.mathisFrame.clearScene(false, false)

                //$$$begin
                let polyhedronBoardDescription = new octavioBoard.PolyhedronBoardDescription()
                polyhedronBoardDescription.polyhedronName = this.polyhedronType

                //$$$end

                //$$$bc
                switch (this.faceDescription){

                    case "empty":{
                    }
                        break
                    case "centralTriangle":{
                        let desc0=new octavioBoard.ConcentricDescription()
                        desc0.nbPatches=2
                        desc0.shapes=[mathis.octavioBoard.PartShape.square,mathis.octavioBoard.PartShape.triangulatedTriangle]
                        desc0.proportions=[new UV(1,1),new UV(0.2,0.2)]
                        desc0.individualScales=[new UV(1,1),new UV(1.2,1.2)]
                        desc0.suppressLinksWithoutOpposite=octavioBoard.SuppressLinkWithoutOpposite.forNonBorder

                        polyhedronBoardDescription.facesDescription=[{nbSides:4,desc:desc0,normals:null}]
                    }
                        break
                    case "centralTriangleAndSquare":{
                        let desc0=new octavioBoard.ConcentricDescription()
                        desc0.nbPatches=2
                        desc0.shapes=[mathis.octavioBoard.PartShape.square,mathis.octavioBoard.PartShape.triangulatedTriangle]
                        desc0.proportions=[new UV(1,1),new UV(0.2,0.2)]
                        desc0.individualScales=[new UV(1,1),new UV(1.2,1.2)]
                        desc0.suppressLinksWithoutOpposite=octavioBoard.SuppressLinkWithoutOpposite.forNonBorder

                        let desc1=new octavioBoard.ConcentricDescription()
                        desc1.nbPatches=2
                        desc1.shapes=[mathis.octavioBoard.PartShape.square]
                        desc1.proportions=[new UV(1,1),new UV(0.2,0.2)]
                        desc1.individualRotations=[0,Math.PI/4]
                        desc1.individualScales=[new UV(1,1),new UV(1.2,1.2)]
                        desc1.suppressLinksWithoutOpposite=octavioBoard.SuppressLinkWithoutOpposite.forNonBorder

                        let desc2=new octavioBoard.ConcentricDescription()
                        desc2.nbPatches=2
                        desc2.shapes=[mathis.octavioBoard.PartShape.square,mathis.octavioBoard.PartShape.polygon5]
                        desc2.proportions=[new UV(1,1),new UV(0.2,0.2)]
                        desc2.individualScales=[new UV(1,1),new UV(1.2,1.2)]
                        desc2.suppressLinksWithoutOpposite=octavioBoard.SuppressLinkWithoutOpposite.forNonBorder

                        let desc3=new octavioBoard.ConcentricDescription()
                        desc3.nbPatches=1
                        desc3.shapes=[mathis.octavioBoard.PartShape.square]
                        desc3.suppressLinksWithoutOpposite=octavioBoard.SuppressLinkWithoutOpposite.forNonBorder

                        /**
                         * face avant et arrière : desc3 : rien
                         * face gauche desc0: triangle
                         * face droite desc1: carré
                         * face haute et bases pinta
                         * */
                        polyhedronBoardDescription.facesDescription=[
                            {nbSides:4,desc:desc0,normals:[new XYZ(1,0,0)]},
                            {nbSides:4,desc:desc1,normals:[new XYZ(-1,0,0)]},
                            {nbSides:4,desc:desc2,normals:[new XYZ(0,1,0),new XYZ(0,-1,0)]},
                            {nbSides:4,desc:desc3,normals:[new XYZ(0,0,1),new XYZ(0,0,-1)]},

                        ]
                    }
                        break
                    case "upSideDown":{
                        /** up  and down for 5 sides*/
                        let desc0=new octavioBoard.ConcentricDescription()
                        desc0.nbPatches=2
                        desc0.shapes=[mathis.octavioBoard.PartShape.polygon5,mathis.octavioBoard.PartShape.square]
                        desc0.proportions=[new UV(1,1),new UV(0.2,0.2)]
                        desc0.suppressLinksWithoutOpposite=octavioBoard.SuppressLinkWithoutOpposite.forNonBorder

                        let desc0bis=new octavioBoard.ConcentricDescription()
                        desc0bis.nbPatches=2
                        desc0bis.shapes=[mathis.octavioBoard.PartShape.polygon5,mathis.octavioBoard.PartShape.polygon5]
                        desc0bis.proportions=[new UV(1,1),new UV(0.2,0.2)]
                        desc0bis.individualRotations=[0,Math.PI]
                        desc0bis.suppressLinksWithoutOpposite=octavioBoard.SuppressLinkWithoutOpposite.forNonBorder


                        /**4 sides*/
                        let desc1=new octavioBoard.ConcentricDescription()
                        desc1.nbPatches=2
                        desc1.shapes=[mathis.octavioBoard.PartShape.square,mathis.octavioBoard.PartShape.triangulatedTriangle]
                        desc1.proportions=[new UV(1,1),new UV(0.2,0.2)]
                        desc1.suppressLinksWithoutOpposite=octavioBoard.SuppressLinkWithoutOpposite.forNonBorder


                        polyhedronBoardDescription.facesDescription=[

                            {nbSides:5,desc:desc0,normals:[new XYZ(0,1,0)]},
                            {nbSides:5,desc:desc0bis,normals:[new XYZ(0,-1,0)]},
                            {nbSides:4,desc:desc1,normals:null}

                            // {nbSides:4,desc:desc2,normals:[new XYZ(0,1,0),new XYZ(0,-1,0)]},
                            // {nbSides:4,desc:desc3,normals:[new XYZ(0,0,1),new XYZ(0,0,-1)]},

                        ]
                    }
                        break

                    default: throw "non defined"

                }
                //$$$ec

                //$$$begin


                polyhedronBoardDescription.suppressLinksWithoutOpposite=octavioBoard.SuppressLinkWithoutOpposite.none
                polyhedronBoardDescription.nbU=this.nbI
                polyhedronBoardDescription.canCreateBifurcations=this.canCreateBifurcations


                let crea = new octavioBoard.PolyhedronBoard(polyhedronBoardDescription)
                crea.finalize=this.finalize
                let mamesh=crea.go()


                this._nbVertices=mamesh.vertices.length
                this.mathisFrame.messageDiv.append("nbVertices:"+this._nbVertices)


                //$$$end



                //$$$bh visualization



                mamesh.fillLineCatalogue()
                this._linesAsSortedString=mamesh.allLinesAsASortedString()

                let lineIndexer=new lineModule.CreateAColorIndexRespectingBifurcationsAndSymmetries(mamesh)
                lineIndexer.packSymmetricLines=false
                let index=lineIndexer.go()

                let liner=new visu3d.LinesViewer(mamesh,this.mathisFrame.scene)
                liner.interpolationOption=new geometry.InterpolationOption()
                liner.lineToLevel=index
                liner.interpolationOption.interpolationStyle=this.interpolationStyle
                liner.go()



                this._nbLoopLines=0
                this._nbStraightLines=0
                for (let line of mamesh.lines){
                    if (line.isLoop) this._nbLoopLines++
                    else this._nbStraightLines++
                }

                this.mathisFrame.messageDiv.append("nbLoopLines"+this._nbLoopLines)
                this.mathisFrame.messageDiv.append("nbStraightLines"+this._nbStraightLines)


                let surfaceViewer=new visu3d.SurfaceViewer(mamesh,this.mathisFrame.scene)
                surfaceViewer.alpha=1
                surfaceViewer.color=new Color(Color.names.lightpink)
                surfaceViewer.go()


                let vertexViewer=new visu3d.VerticesViewer(mamesh,this.mathisFrame.scene)
                vertexViewer.radiusProp=0.1
                vertexViewer.go()
                //$$$eh



            }
        }




        class OctavioPlanarBoard implements PieceOfCode {

            NAME = "OctavioPlanarBoard"
            TITLE = "octavio board"


            keywords='perco'
            $$$keywords=['perco','heu','chu','ans','gag','choli','hopla','miro','3 squares','4 squares']

            _linesAsSortedString=""




            constructor(private mathisFrame:MathisFrame) {
                this.mathisFrame = mathisFrame

            }

            goForTheFirstTime() {
                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()
                this.go()
            }

            go() {

                this.mathisFrame.clearScene(false, false)

                //$$$begin
                let mamesh:Mamesh

                switch (this.keywords){




                    case 'perco': {

                        let crea = new reseau.TriangulatedPolygone(6)
                        crea.nbSubdivisionInARadius = 7
                        mamesh = crea.go()


                        let perco = new mameshModification.PercolationOnLinks(mamesh)
                        perco.percolationProba = 0.3
                        perco.goChanging()
                        mamesh.isolateMameshVerticesFromExteriorVertices()


                        let associer = new linkModule.OppositeLinkAssocierByAngles(mamesh.vertices)
                        associer.clearAllExistingOppositeBefore = true
                        //associer.maxAngleToAssociateLinks=Math.PI*0.33
                        //associer.propToleranceForBifurcation=1 //il faut cela pour qu'un lien droit branche
                        associer.doNotBranchOnBorder = true
                        associer.goChanging()

                        let cleaner = new octavioBoard.MameshCleaner(mamesh)
                        cleaner.suppressLinksWithoutOpposite=octavioBoard.SuppressLinkWithoutOpposite.forNonBorder//suppressLinkWithoutOppositeFunction = v => (!v.hasMark(Vertex.Markers.border))
                        cleaner.goChanging()

                    }
                        break

                    case 'heu': {
                        let crea = new octavioBoard.Concentric()
                        crea.desc.nbI=7
                        crea.desc.nbJ=12
                        crea.desc.nbPatches = 3
                        crea.desc.shapes = [mathis.octavioBoard.PartShape.square, mathis.octavioBoard.PartShape.polygon6, mathis.octavioBoard.PartShape.square]
                        crea.desc.propBeginToRound = [0]
                        crea.desc.propEndToRound = [0, 0.5]
                        crea.desc.individualTranslation = [new XYZ(-0.3, 0, 0), new XYZ(0, 0, 0), new XYZ(0.3, 0, 0)]
                        mamesh = crea.go()
                    }
                        break

                    case 'chu':{
                        let crea = new octavioBoard.Patchwork()
                        crea.desc.nbI=6
                        crea.desc.nbPatchesI=2
                        crea.desc.nbPatchesJ=2
                        crea.desc.patchesInQuinconce=true
                        crea.desc.shapes = [mathis.octavioBoard.PartShape.square]
                        crea.desc.individualRotations=[0,Math.PI/4,0]
                        crea.desc.individualScales=[new UV(1.2,1.2)]
                        crea.desc.integerBeginToRound=[0]
                        crea.desc.integerEndToRound=[-2]
                        //bilan.assertTrue(crea.SUB_mameshCleaner.OUT_nbLinkSuppressed==1)

                        mamesh=crea.go()
                    }
                        break

                    case 'ans':{
                        let crea = new octavioBoard.Patchwork()
                        crea.desc.nbI=6
                        crea.desc.nbPatchesI=3
                        crea.desc.nbPatchesJ=3
                        crea.desc.patchesInQuinconce=true
                        crea.desc.shapes = [mathis.octavioBoard.PartShape.square]
                        crea.desc.individualRotations=[0,Math.PI/4,0]
                        crea.desc.individualScales=[new UV(1.2,1.2)]
                        crea.desc.suppressLinksWithoutOpposite=octavioBoard.SuppressLinkWithoutOpposite.forNonBorder

                        //crea.SUB_mameshCleaner.suppressLinkWithoutOppositeFunction=v=>(!v.hasMark(Vertex.Markers.border))

                        mamesh=crea.go()
                    }
                        break

                    case 'gag':{
                        let crea = new octavioBoard.Concentric()
                        crea.desc.nbI=12
                        crea.desc.nbPatches=2
                        crea.desc.shapes=[mathis.octavioBoard.PartShape.square,mathis.octavioBoard.PartShape.triangulatedTriangle]
                        crea.desc.proportions=[new UV(1,1),new UV(0.4,0.4)]
                        crea.desc.individualScales=[new UV(1,1),new UV(1.2,1.2)]
                        crea.desc.suppressLinksWithoutOpposite=octavioBoard.SuppressLinkWithoutOpposite.forNonBorder

                        //crea.SUB_mameshCleaner.suppressLinkWithoutOppositeFunction=v=>(!v.hasMark(Vertex.Markers.border))
                        mamesh=crea.go()

                    }
                        break

                    case 'choli':{
                        let crea = new octavioBoard.Concentric()
                        crea.desc.nbI=7
                        crea.desc.individualTranslation=[new XYZ(0,0,0),new XYZ(0.3,0,0)]
                        crea.desc.individualRotations=[0,Math.PI/4]

                        mamesh=crea.go()
                    }
                        break

                    case 'hopla':{
                        let crea=new octavioBoard.Concentric()
                        crea.desc.nbI=6

                        crea.desc.nbPatches = 3
                        crea.desc.shapes = [mathis.octavioBoard.PartShape.square]
                        crea.desc.proportions = [new UV(1, 1)]
                        crea.SUB_gratAndStick.proximityCoefToStick=[2]
                        crea.SUB_gratAndStick.SUB_grater.proportionOfSeeds=[0.09]
                        let angle = [0, Math.PI / 3, -Math.PI / 3]
                        crea.desc.individualRotations = angle
                        let rad = 0.5
                        crea.desc.individualTranslation = [new XYZ(Math.cos(angle[0]) + 1, Math.sin(angle[0]), 0).scale(rad), new XYZ(Math.cos(angle[1]), Math.sin(angle[1]), 0).scale(rad), new XYZ(Math.cos(angle[2]), Math.sin(angle[2]), 0).scale(rad)]

                        mamesh=crea.go()
                    }
                        break

                    case 'miro':{
                        let crea=new octavioBoard.Patchwork()
                        crea.desc.nbI=7
                        crea.desc.nbPatchesI=2
                        crea.desc.nbPatchesJ=2
                        crea.desc.shapes=[mathis.octavioBoard.PartShape.polygon4]
                        crea.desc.individualScales=[new UV(1.2,1.2)]
                        crea.desc.patchesInQuinconce=true
                        crea.desc.oddPatchLinesAreTheSameVersusLongerVersusShorter=2
                        crea.desc.integerBeginToRound=[1]
                        crea.desc.integerEndToRound=[-1]
                        crea.SUB_gratAndStick.SUB_grater.proportionOfSeeds=[0.2]
                        crea.SUB_oppositeLinkAssocierByAngles.canCreateBifurcations=false

                        mamesh=crea.go()
                    }
                        break

                    case '3 squares':{
                        let crea=new octavioBoard.Patchwork()
                        crea.desc.nbI=7
                        crea.desc.nbPatchesI=2
                        crea.desc.nbPatchesJ=2
                        crea.desc.shapes=[mathis.octavioBoard.PartShape.polygon4]
                        crea.desc.individualScales=[new UV(1.2,1.2)]
                        crea.desc.patchesInQuinconce=true
                        crea.desc.oddPatchLinesAreTheSameVersusLongerVersusShorter=2

                        crea.SUB_gratAndStick.SUB_grater.proportionOfSeeds=[0.2]
                        crea.SUB_oppositeLinkAssocierByAngles.canCreateBifurcations=false
                        crea.desc.suppressLinksWithoutOpposite=octavioBoard.SuppressLinkWithoutOpposite.none


                        //crea.SUB_mameshCleaner.suppressLinkWithoutOppositeFunction=null
                        mamesh=crea.go()

                    }
                        break

                    case '4 squares':{
                        let crea=new octavioBoard.Patchwork()
                        crea.desc.nbPatchesI=2
                        crea.desc.nbPatchesJ=2
                        crea.desc.nbI=4
                        crea.desc.shapes=[mathis.octavioBoard.PartShape.polygon4]
                        crea.desc.individualScales=[new UV(1.0,1.0)]

                        crea.SUB_gratAndStick.SUB_grater.seedComputedFromBarycentersVersusFromAllPossibleCells=false
                        mamesh=crea.go()

                        let OUTAllSeeds=[]
                        for (let seeds of crea.SUB_gratAndStick.SUB_grater.OUT_allSeeds) OUTAllSeeds=OUTAllSeeds.concat(seeds)

                    }
                        break


                    default: throw "keyword not known"

                }


                //$$$end



                //$$$bh visualization

                spacialTransformations.adjustInASquare(mamesh,new XYZ(-0.7,-0.7,0),new XYZ(0.7,0.7,0))


                mamesh.fillLineCatalogue()
                this._linesAsSortedString=mamesh.allLinesAsASortedString()

                let lineIndexer=new lineModule.CreateAColorIndexRespectingBifurcationsAndSymmetries(mamesh)
                lineIndexer.packSymmetricLines=false
                let index=lineIndexer.go()

                let liner=new visu3d.LinesViewer(mamesh,this.mathisFrame.scene)
                liner.interpolationOption=new geometry.InterpolationOption()
                liner.lineToLevel=index
                liner.interpolationOption.interpolationStyle=geometry.InterpolationStyle.octavioStyle
                liner.go()
                //$$$eh



            }
        }



        class SimpleTube implements PieceOfCode {

            NAME = "SimpleTube"
            TITLE = "Babylon tube function had a bug : exactly vertical lines was not draw. but it was fixed"



            constructor(private mathisFrame:MathisFrame) {
                this.mathisFrame = mathisFrame

            }

            goForTheFirstTime() {
                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()
                this.go()
            }

            go() {

                this.mathisFrame.clearScene(false, false)

                //$$$begin


                let creator=new reseau.Regular3D()
                creator.origine=new XYZ(-0.7,-0.7,-0.7)
                creator.nbU=5
                creator.nbV=7
                let mamesh:Mamesh=creator.go()

                let crea2=new reseau.Regular2d()
                let mamesh2=crea2.go()


                mamesh.fillLineCatalogue()
                mamesh.fillLineCatalogue()

                let lineViewer=new visu3d.LinesViewer(mamesh,this.mathisFrame.scene)
                lineViewer.go()

                let lineViewer2=new visu3d.LinesViewer(mamesh2,this.mathisFrame.scene)
                lineViewer2.go()


                //$$$end






            }
        }


    }
}