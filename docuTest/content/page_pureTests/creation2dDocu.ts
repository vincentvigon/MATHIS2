

module mathis {

    export module appli{


        export class Creation2dDocu implements OnePage{

            pageIdAndTitle="Creation2dDocu"
            severalParts:SeveralParts


            constructor(private mathisFrame:MathisFrame) {
                let several = new SeveralParts()
                several.addPart(new OctavioConcentricBoard(this.mathisFrame))

                several.addPart(new SimpleTube(this.mathisFrame))

                several.addPart(new PercoAndAssociate(this.mathisFrame))
                this.severalParts=several
            }

            go() {
                return this.severalParts.go()
            }

        }



        class OctavioConcentricBoard implements PieceOfCode {

            NAME = "OctavioConcentricBoard"
            TITLE = "OctavioConcentricBoard"


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
                let mamesh: Mamesh

                let crea = new creation2D.Concentric(12, 12)
                crea.nbPatches = 2
                crea.shapes = [mathis.creation2D.PartShape.square, mathis.creation2D.PartShape.polygon6]
                // crea.propBeginToRound = [0]
                // crea.propEndToRound = [0, 0.5]
                crea.individualTranslation = [new XYZ(-0.3, 0, 0), new XYZ(0.3, 0, 0)]
                crea.forceToGrate=[0.5,0.1]
                mamesh = crea.go()



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


        class PercoAndAssociate implements PieceOfCode {

            NAME = "PercoAndAssociate"
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

                        let cleaner = new mameshModification.MameshCleaner(mamesh)
                        cleaner.suppressLinkWithoutOppositeFunction = v => (!v.hasMark(Vertex.Markers.border))
                        cleaner.goChanging()

                        cc("associer.OUT_nbBranching", associer.OUT_nbBranching)
                    }
                        break

                    case 'heu': {
                        let crea = new creation2D.Concentric(7, 12)
                        crea.nbPatches = 3
                        crea.shapes = [mathis.creation2D.PartShape.square, mathis.creation2D.PartShape.polygon6, mathis.creation2D.PartShape.square]
                        crea.propBeginToRound = [0]
                        crea.propEndToRound = [0, 0.5]
                        crea.individualTranslation = [new XYZ(-0.3, 0, 0), new XYZ(0, 0, 0), new XYZ(0.3, 0, 0)]
                        mamesh = crea.go()
                    }
                        break

                    case 'chu':{
                        let crea = new creation2D.Patchwork(6,6,2,2)
                        crea.patchesInQuinconce=true
                        crea.shapes = [mathis.creation2D.PartShape.square]
                        crea.individualRotations=[0,Math.PI/4,0]
                        crea.individualScales=[new UV(1.2,1.2)]
                        crea.integerBeginToRound=[0]
                        crea.integerEndToRound=[-2]
                        //bilan.assertTrue(crea.SUB_mameshCleaner.OUT_nbLinkSuppressed==1)

                        mamesh=crea.go()
                    }
                        break

                    case 'ans':{
                        let crea = new creation2D.Patchwork(6,6,3,3)
                        crea.patchesInQuinconce=true
                        crea.shapes = [mathis.creation2D.PartShape.square]
                        crea.individualRotations=[0,Math.PI/4,0]
                        crea.individualScales=[new UV(1.2,1.2)]
                        crea.SUB_mameshCleaner.suppressLinkWithoutOppositeFunction=v=>(!v.hasMark(Vertex.Markers.border))

                        mamesh=crea.go()
                    }
                    break

                    case 'gag':{
                        let crea = new creation2D.Concentric(12,12)
                        crea.nbPatches=2
                        crea.shapes=[mathis.creation2D.PartShape.square,mathis.creation2D.PartShape.triangulatedTriangle]
                        crea.proportions=[new UV(1,1),new UV(0.4,0.4)]
                        crea.individualScales=[new UV(1,1),new UV(1.2,1.2)]

                        crea.SUB_mameshCleaner.suppressLinkWithoutOppositeFunction=v=>(!v.hasMark(Vertex.Markers.border))
                        mamesh=crea.go()

                    }
                    break

                    case 'choli':{
                        let crea = new creation2D.Concentric(7,7)
                        crea.individualTranslation=[new XYZ(0,0,0),new XYZ(0.3,0,0)]
                        crea.individualRotations=[0,Math.PI/4]

                        mamesh=crea.go()
                    }
                    break

                    case 'hopla':{
                        let crea=new creation2D.Concentric(6,6)

                        crea.nbPatches = 3
                        crea.shapes = [mathis.creation2D.PartShape.square]
                        crea.proportions = [new UV(1, 1)]
                        crea.SUB_gratAndStick.proximityCoefToStick=[2]
                        crea.SUB_gratAndStick.SUB_grater.proportionOfSeeds=[0.09]
                        let angle = [0, Math.PI / 3, -Math.PI / 3]
                        crea.individualRotations = angle
                        let rad = 0.5
                        crea.individualTranslation = [new XYZ(Math.cos(angle[0]) + 1, Math.sin(angle[0]), 0).scale(rad), new XYZ(Math.cos(angle[1]), Math.sin(angle[1]), 0).scale(rad), new XYZ(Math.cos(angle[2]), Math.sin(angle[2]), 0).scale(rad)]

                        mamesh=crea.go()
                    }
                    break

                    case 'miro':{
                        let crea=new creation2D.Patchwork(7,7,2,2)
                        crea.shapes=[mathis.creation2D.PartShape.polygon4]
                        crea.individualScales=[new UV(1.2,1.2)]
                        crea.patchesInQuinconce=true
                        crea.oddPatchLinesAreTheSameVersusLongerVersusShorter=2
                        crea.integerBeginToRound=[1]
                        crea.integerEndToRound=[-1]
                        crea.SUB_gratAndStick.SUB_grater.proportionOfSeeds=[0.2]
                        crea.SUB_oppositeLinkAssocierByAngles.canCreateBifurcations=false

                        mamesh=crea.go()
                    }
                    break

                    case '3 squares':{
                        let crea=new creation2D.Patchwork(7,7,2,2)
                        crea.shapes=[mathis.creation2D.PartShape.polygon4]
                        crea.individualScales=[new UV(1.2,1.2)]
                        crea.patchesInQuinconce=true
                        crea.oddPatchLinesAreTheSameVersusLongerVersusShorter=2

                        crea.SUB_gratAndStick.SUB_grater.proportionOfSeeds=[0.2]
                        crea.SUB_oppositeLinkAssocierByAngles.canCreateBifurcations=false
                        crea.SUB_mameshCleaner.suppressLinkWithoutOppositeFunction=null
                        mamesh=crea.go()

                    }
                    break

                    case '4 squares':{
                        let crea=new creation2D.Patchwork(4,4,2,2)
                        crea.shapes=[mathis.creation2D.PartShape.polygon4]
                        crea.individualScales=[new UV(1.0,1.0)]

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
                creator.nbJ=7
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