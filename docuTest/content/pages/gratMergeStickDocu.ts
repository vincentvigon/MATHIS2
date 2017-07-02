/**
 * Created by vigon on 01/02/2017.
 */
/**
 * Created by vigon on 05/12/2016.
 */


module mathis {

    export module appli {


        export class GrateMergeStick implements OnePage {

            pageIdAndTitle = "Grating and gluing"
            severalParts: SeveralParts

            constructor(private mathisFrame: MathisFrame) {
                let several = new SeveralParts()

                several.addPart(new SimpleMerging(this.mathisFrame))

                several.addPart(new GrateGluedMamesh(this.mathisFrame))

                several.addComment("Next we present separatly the sticking/gluing process and the grating process", "Grating and gluing details")



                several.addPart(new MergeVersusStick(this.mathisFrame))


                several.addPart(new GrateMamesh(this.mathisFrame))
                several.addPart(new GrateMameshConcentric(this.mathisFrame), true)


                several.addComment("exercices","exercices")

                several.addPart(new StickCylinderAndPlane(this.mathisFrame))


                this.severalParts = several
            }

            go() {
                return this.severalParts.go()
            }

        }





        class SimpleMerging implements PieceOfCode {

            NAME = "SimpleMerging"
            TITLE = `To create a cylinder, we bend a plane and merge the two extremities.`


            nbU=10
            $$$nbU=[5,10,20,40]

            nbV=10
            $$$nbV=[5,10,20,40]

            constructor(private mathisFrame: MathisFrame) {
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


                //$$$b
                let creator = new reseau.Regular2dPlus()
                creator.origin = new XYZ(0, -0.7, 0)
                creator.end = new XYZ(2 * Math.PI, 0.7, 0)
                creator.nbU = this.nbU
                creator.nbV = this.nbV
                let mameshCylinder = creator.go()

                let radius=0.5
                for (let vertex of mameshCylinder.vertices){
                    let u=vertex.position.x
                    let v=vertex.position.y
                    vertex.position.x=radius*cos (u)
                    vertex.position.z=radius*sin (u)
                    vertex.position.y=v
                }
                let merger=new grateAndGlue.Merger(mameshCylinder)
                    merger.goChanging()

                /**we want also to stick lines. We have to associate opposite lines
                 * to get loop lines. With nbU=5, the association is not made (to wide angles).*/
                let oppositeAssocier=new linkModule.OppositeLinkAssocierByAngles(mameshCylinder.vertices)
                oppositeAssocier.goChanging()

                //$$$e


                //$$$bh visualization

                let linesViewer=new visu3d.LinesViewer(mameshCylinder,this.mathisFrame.scene)
                linesViewer.go()

                let surfaceViewer=new visu3d.SurfaceViewer(mameshCylinder,this.mathisFrame.scene)
                surfaceViewer.go()

                let vertexViewer=new visu3d.VerticesViewer(merger.OUT_mergedVertices,this.mathisFrame.scene)
                vertexViewer.go()


                //$$$eh

            }
        }




        class GrateMamesh implements PieceOfCode {

            NAME = "GrateMamesh"
            TITLE = `When two mameshes overlap (they are concurrent), we could want to grate them to suppress overlapping.  
            Grating process starts from seeds: each concurrent have some given (or computed) seeds which are keep (and represented here as red bullet). 
            Around these seeds, we compute strates, and we keep their cell, until strates of concurrent overlap`


            nbSides0 = 6
            $$$nbSides0 = [4, 6, 8, 10]

            nbSides1 = 6
            $$$nbSides1 = [4, 6, 8, 10]

            nbSubdivisionInARadius0 = 9
            $$$nbSubdivisionInARadius0 = [3, 5, 7, 9, 11]

            nbSubdivisionInARadius1 = 5
            $$$nbSubdivisionInARadius1 = [3, 5, 7, 9, 11]

            grate = true
            $$$grate = [true, false]

            neighborhoodCoefficient0 = 0.7
            $$$neighborhoodCoefficient0 = [0.5, 0.7, 1, 2]

            neighborhoodCoefficient1 = 0.7
            $$$neighborhoodCoefficient1 = [0.5, 0.7, 1, 2]


            proportionOfSeed0 = 0.1
            $$$proportionOfSeed0 = [0.01, 0.1, 0.3, 0.5, 0.7]
            proportionOfSeed1 = 0.1
            $$$proportionOfSeed1 = [0.1, 0.3, 0.5, 0.7]

            seedComputedFromBarycentersVersusFromAllPossibleCells = true
            $$$seedComputedFromBarycentersVersusFromAllPossibleCells = [true, false]

            addAsymetry = false
            $$$addAsymetry = [true, false]

            asyDirection0 = -1
            $$$asyDirection0 = [-1, 1]
            asyDirection1 = -1
            $$$asyDirection1 = [-1, 1]
            asyInfluence0 = 0.5
            $$$asyInfluence0 = [0.1, 0.5, 1]
            asyInfluence1 = 0.5
            $$$asyInfluence1 = [0.1, 0.5, 1]

            modulo0 = null
            $$$modulo0 = [null, 1.5, 0.7]
            modulo1 = null
            $$$modulo1 = [null, 1.5, 0.7]


            constructor(private mathisFrame: MathisFrame) {
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


                //$$$bh creation of the 2 mamesh
                let creator0 = new reseau.TriangulatedPolygone(this.nbSides0)
                creator0.origin = new XYZ(-1, -1, 0)
                creator0.end = new XYZ(0.5, 0.5, 0)
                creator0.nbSubdivisionInARadius = this.nbSubdivisionInARadius0
                let mamesh0 = creator0.go()

                let creator1 = new reseau.TriangulatedPolygone(this.nbSides1)
                creator1.origin = new XYZ(-0.5, -0.5, 0)
                creator1.end = new XYZ(1, 1, 0)
                creator1.nbSubdivisionInARadius = this.nbSubdivisionInARadius1
                let mamesh1 = creator1.go()
                //$$$eh

                //$$$begin
                let grater: grateAndGlue.GraphGrater = null
                if (this.grate) {
                    grater = new grateAndGlue.GraphGrater()
                    grater.IN_graphFamily.push(mamesh0.vertices, mamesh1.vertices)
                    //n
                    /** this params determine the neighborhood of each graph (this param are proportions)
                     * If too small, cells could penetrate each others.
                     * E.g keep all the defaults, and set the first number to 0.5*/
                    grater.proximityCoefToGrate = [this.neighborhoodCoefficient0, this.neighborhoodCoefficient1]
                    /** There are two ways to select seeds :
                     * --- if seedComputedFromBarycenters : seeds are vertices the farthest of barycenter of concurrents.
                     * --- is seedComputedFromAllPossibleCell : seeds are all vertices which is not to close to a concurrent.*/
                    grater.seedComputedFromBarycentersVersusFromAllPossibleCells = this.seedComputedFromBarycentersVersusFromAllPossibleCells
                    /**Determine the proportion of seeds of each concurrent: only useful is previous attribute is true*/
                    grater.proportionOfSeeds = [this.proportionOfSeed0, this.proportionOfSeed1]


                    if (this.addAsymetry) {
                        /**to change the localisation of seeds.
                         * --- direction: pull the seeds in this direction
                         * --- influence: influence of this direction against the 'natural' direction of seed
                         * --- modulo (optional): allow to pull seeds in several directions
                         * */
                        grater.asymmetriesForSeeds = [
                            {
                                direction: new XYZ(this.asyDirection0, 0, 0),
                                influence: this.asyInfluence0,
                                modulo: this.modulo0
                            },
                            {
                                direction: new XYZ(0, this.asyDirection1, 0),
                                influence: this.asyInfluence1,
                                modulo: this.modulo1
                            }]
                    }

                    let remainingVertices = grater.go()

                    //n
                    mamesh0 = new grateAndGlue.SubMameshExtractor(mamesh0, remainingVertices[0]).go()
                    mamesh0.isolateMameshVerticesFromExteriorVertices()
                    mamesh1 = new grateAndGlue.SubMameshExtractor(mamesh1, remainingVertices[1]).go()
                    mamesh1.isolateMameshVerticesFromExteriorVertices()

                }


                //$$$end


                //$$$bh visualization
                if (grater != null) {
                    let verticesViewer0 = new visu3d.VerticesViewer(mamesh0, this.mathisFrame.scene)
                    verticesViewer0.vertices = grater.OUT_allSeeds[0]
                    verticesViewer0.color = new Color(Color.names.red)
                    verticesViewer0.go()


                    let verticesViewer1 = new visu3d.VerticesViewer(mamesh1, this.mathisFrame.scene)
                    verticesViewer1.vertices = grater.OUT_allSeeds[1]
                    verticesViewer1.color = new Color(Color.names.red)
                    verticesViewer1.go()

                }
                //n

                let linkViewer0 = new visu3d.LinksViewer(mamesh0, this.mathisFrame.scene)
                linkViewer0.color = new Color(Color.names.darkseagreen)
                linkViewer0.go()

                let linkViewer1 = new visu3d.LinksViewer(mamesh1, this.mathisFrame.scene)
                linkViewer1.color = new Color(Color.names.blueviolet)
                linkViewer1.go()


                //$$$eh
            }
        }


        class GrateMameshConcentric implements PieceOfCode {

            NAME = "GrateMameshConcentric"
            TITLE = `Variant with two concentric mameshes`


            nbSides0 = 6
            $$$nbSides0 = [4, 6, 8, 10]

            nbSides1 = 6
            $$$nbSides1 = [4, 6, 8, 10]

            nbSubdivisionInARadius0 = 9
            $$$nbSubdivisionInARadius0 = [3, 5, 7, 9, 11]

            nbSubdivisionInARadius1 = 5
            $$$nbSubdivisionInARadius1 = [3, 5, 7, 9, 11]

            grate = true
            $$$grate = [true, false]

            neighborhoodCoefficient0 = 0.7
            $$$neighborhoodCoefficient0 = [0.5, 0.7, 1, 2]

            neighborhoodCoefficient1 = 0.7
            $$$neighborhoodCoefficient1 = [0.5, 0.7, 1, 2]


            proportionOfSeed0 = 0.1
            $$$proportionOfSeed0 = [0.1, 0.3, 0.5, 0.7]
            proportionOfSeed1 = 0.1
            $$$proportionOfSeed1 = [0.1, 0.3, 0.5, 0.7]

            seedComputedFromBarycentersVersusFromAllPossibleCells = true
            $$$seedComputedFromBarycentersVersusFromAllPossibleCells = [true, false]


            constructor(private mathisFrame: MathisFrame) {
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


                let creator0 = new reseau.TriangulatedPolygone(this.nbSides0)
                creator0.origin = new XYZ(-1, -1, 0)
                creator0.end = new XYZ(1, 1, 0)
                creator0.nbSubdivisionInARadius = this.nbSubdivisionInARadius0
                let mamesh0 = creator0.go()

                let creator1 = new reseau.TriangulatedPolygone(this.nbSides1)
                creator1.origin = new XYZ(-0.5, -0.5, 0)
                creator1.end = new XYZ(0.5, 0.5, 0)
                creator1.nbSubdivisionInARadius = this.nbSubdivisionInARadius1
                let mamesh1 = creator1.go()

                let grater: grateAndGlue.GraphGrater = null
                if (this.grate) {
                    grater = new grateAndGlue.GraphGrater()
                    grater.IN_graphFamily.push(mamesh0.vertices, mamesh1.vertices)
                    //n

                    grater.proximityCoefToGrate = [this.neighborhoodCoefficient0, this.neighborhoodCoefficient1]
                    /** When a mamesh cover the other, the false option make disappear the covered one*/
                    grater.seedComputedFromBarycentersVersusFromAllPossibleCells = this.seedComputedFromBarycentersVersusFromAllPossibleCells
                    /**Determine the proportion of seeds of each concurrent: only useful is previous attribute is true*/
                    grater.proportionOfSeeds = [this.proportionOfSeed0, this.proportionOfSeed1]


                    let remainingVertices = grater.go()

                    //n
                    mamesh0 = new grateAndGlue.SubMameshExtractor(mamesh0, remainingVertices[0]).go()
                    mamesh0.isolateMameshVerticesFromExteriorVertices()
                    mamesh1 = new grateAndGlue.SubMameshExtractor(mamesh1, remainingVertices[1]).go()
                    mamesh1.isolateMameshVerticesFromExteriorVertices()

                }


                //$$$end


                //$$$bh visualization
                if (grater != null) {
                    let verticesViewer0 = new visu3d.VerticesViewer(mamesh0, this.mathisFrame.scene)
                    verticesViewer0.vertices = grater.OUT_allSeeds[0]
                    verticesViewer0.color = new Color(Color.names.red)
                    verticesViewer0.go()


                    let verticesViewer1 = new visu3d.VerticesViewer(mamesh1, this.mathisFrame.scene)
                    verticesViewer1.vertices = grater.OUT_allSeeds[1]
                    verticesViewer1.color = new Color(Color.names.red)
                    verticesViewer1.go()

                }
                //n


                let linkViewer0 = new visu3d.LinksViewer(mamesh0, this.mathisFrame.scene)
                linkViewer0.color = new Color(Color.names.darkseagreen)
                linkViewer0.go()

                let linkViewer1 = new visu3d.LinksViewer(mamesh1, this.mathisFrame.scene)
                linkViewer1.color = new Color(Color.names.blueviolet)
                linkViewer1.go()


                //$$$eh
            }
        }


        class GrateGluedMamesh implements PieceOfCode {

            NAME = "GrateGluedMamesh"
            TITLE = `When two mameshes overlap (they are concurrent), we could want to grate them and to stick them.  
            Here we present a class doing both operations.`


            nbSides0 = 6
            $$$nbSides0 = [4, 6, 8, 10]

            nbSides1 = 6
            $$$nbSides1 = [4, 6, 8, 10]

            nbSubdivisionInARadius0 = 9
            $$$nbSubdivisionInARadius0 = [3, 5, 7, 9, 11]

            nbSubdivisionInARadius1 = 5
            $$$nbSubdivisionInARadius1 = [3, 5, 7, 9, 11]


            toleranceToBeOneOfTheClosest = 0.5
            $$$toleranceToBeOneOfTheClosest = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7]


            proportionOfSeed0 = 0.1
            $$$proportionOfSeed0 = [0.1, 0.3, 0.5, 0.7]
            proportionOfSeed1 = 0.1
            $$$proportionOfSeed1 = [0.1, 0.3, 0.5, 0.7]

            proximityCoefToStick = 2
            $$$proximityCoefToStick = [1, 1.5, 2, 3]

            suppressLinksAngularlyTooClose = false
            $$$suppressLinksAngularlyTooClose = [true, false]


            propAngle = 0.1
            $$$propAngle = [0.01, 0.05, 0.1, 0.2, 0.3]


            justGrateDoNotStick = false
            $$$justGrateDoNotStick = [true, false]


            addMissingPolygons = true
            $$$addMissingPolygons = [true, false]


            constructor(private mathisFrame: MathisFrame) {
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


                //$$$bh mameshes creation
                let creator0 = new reseau.TriangulatedPolygone(this.nbSides0)
                creator0.origin = new XYZ(-1, -1, 0)
                creator0.end = new XYZ(0.5, 0.5, 0)
                creator0.nbSubdivisionInARadius = this.nbSubdivisionInARadius0
                let mamesh0 = creator0.go()

                let creator1 = new reseau.TriangulatedPolygone(this.nbSides1)
                creator1.origin = new XYZ(-0.5, -0.5, 0)
                creator1.end = new XYZ(1, 1, 0)
                creator1.nbSubdivisionInARadius = this.nbSubdivisionInARadius1
                let mamesh1 = creator1.go()
                //$$$eh


                //$$$begin
                let graterAndSticker = new grateAndGlue.ConcurrentMameshesGraterAndSticker()
                graterAndSticker.IN_mameshes.push(mamesh0, mamesh1)

                graterAndSticker.justGrateDoNotStick = this.justGrateDoNotStick

                /** Parameters of the grating process (see below) could be ruled via this SUB_object. Here we just change one
                 * parameters which advantage one of the concurrent.*/
                graterAndSticker.SUB_grater.proportionOfSeeds = [this.proportionOfSeed0, this.proportionOfSeed1]


                /** Coef ruling the neighborhood zone of vertices.
                 *  More big is this coef, more we accept far neighbors,  and so more we stick far vertices */
                graterAndSticker.proximityCoefToStick = [this.proximityCoefToStick]

                /**if 0    -->  only the closest neighbor is stick
                 * if 0.10 -->  all vertices which are positioned up to 10% further than the closest are stick
                 * if 0.1  -->  ...
                 * be careful, if too big links can cross themselves:
                 * which can be solve by clearing links making too small angles each others.
                 * */
                graterAndSticker.toleranceToBeOneOfTheClosest = this.toleranceToBeOneOfTheClosest


                //n
                graterAndSticker.suppressLinksAngularlyTooClose = this.suppressLinksAngularlyTooClose
                /**links cleaning is made by a SUB object that we can parametrize: */
                graterAndSticker.SUB_linkCleanerByAngle.suppressLinksAngularParam = 2 * Math.PI * this.propAngle


                graterAndSticker.addMissingPolygons = this.addMissingPolygons


                let mamesh = graterAndSticker.goChanging()

                //$$$end


                //$$$bh visualization

                let linkViewer0 = new visu3d.LinksViewer(mamesh, this.mathisFrame.scene)
                linkViewer0.go()

                /**source vertices in blue*/
                let verticesViewerSource = new visu3d.VerticesViewer(mamesh, this.mathisFrame.scene)
                verticesViewerSource.vertices = graterAndSticker.OUT_stickingMap.allKeys()
                verticesViewerSource.color = new Color(Color.names.blueviolet)
                verticesViewerSource.go()

                /**receiver vertices in red*/
                let verticesViewer = new visu3d.VerticesViewer(mamesh, this.mathisFrame.scene)
                verticesViewer.vertices = []
                for (let vertices of graterAndSticker.OUT_stickingMap.allValues()) {
                    verticesViewer.vertices = verticesViewer.vertices.concat(vertices)
                }
                verticesViewer.go()


                let surfaceViewer = new visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene)
                surfaceViewer.go()

                //$$$eh
            }
        }


        class MergeVersusStick implements PieceOfCode {

            NAME = "MergeVersusStick"
            TITLE = `Here we compare sticking and merging. Merging process 
            take the border vertices of the "source mamesh", and translate them into the "receiver mamesh"; consequently, some
             vertices disappear.`


            mameshesNames = 'two rectangles'
            $$$mameshesNames = ['two rectangles','one skew cylinder']


            toleranceToBeOneOfTheClosest = 0.05
            $$$toleranceToBeOneOfTheClosest = [0, 0.05, 0.1, 0.2, 0.5, 1, 1.5, 2]




            stickOrMerge = 'sticking'
            $$$stickOrMerge = ['merging','sticking','do nothing']

            proximityCoef = 1.2
            $$$proximityCoef = [0.2, 0.5, 0.8, 1, 1.2, 1.5, 2, 3]

            angle = 0.01
            $$$angle = [0, 0.005, 0.01, 0.02, 0.05]


            slow = 'slow'
            $$$slow = ['slow','fast']


            resolution = 10
            $$$resolution = [5, 10, 15, 20]


            hole = 0.97
            $$$hole = [0.8, 0.9, 0.95, 0.97, 0.99, 1]

            nbBiggerFacesDeleted=1
            $$$nbBiggerFacesDeleted=[1,2]
            addMissingPoly=true
            $$$addMissingPoly=[true,false]

            yTranslation=0.1
            $$$yTranslation=[0,0.05,0.1,0.15,0.2]


            constructor(private mathisFrame: MathisFrame) {
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





                let vertices0:Vertex[] = []
                let vertices1:Vertex[] = []
                let mamesh0:Mamesh
                let mamesh1:Mamesh


                /* chose  mameshes to stick or merge*/
                //$$$bc
                switch (this.mameshesNames) {

                    case 'two rectangles':
                    {
                        let creator0 = new reseau.Regular2dPlus()
                        creator0.origin = new XYZ(-1, -0.9, 0)
                        creator0.end = new mathis.XYZ(-0.05, 1.1, 0)
                        creator0.nbU = 5
                        creator0.nbV = 10
                        mamesh0 = creator0.go()

                        let creator1 = new reseau.Regular2dPlus()
                        creator1.origin = new XYZ(0.05, -1, 0)
                        creator1.end = new mathis.XYZ(1, 1, 0)
                        creator1.nbU = 5
                        creator1.nbV = 10
                        mamesh1 = creator1.go()

                        vertices0 = mamesh0.vertices
                        vertices1 = mamesh1.vertices

                        /**with big angle, the two mameshes overlap, and the result is not nice
                         * -> we need to grate mameshes before (see further on)*/
                        new spacialTransformations.Similitude(mamesh1.vertices, 2 * Math.PI * this.angle).goChanging()
                    }
                        break


                    case 'one skew cylinder' :
                    {

                        let creator = new reseau.Regular2dPlus()
                        creator.origin = new XYZ(0, -0.7, 0)
                        creator.end = new XYZ(2 * Math.PI, 0.7, 0)
                        creator.nbU = 20
                        creator.nbV = 10
                        creator.nbHorizontalDecays = 2
                        mamesh0 = creator.go()
                        mamesh1 = mamesh0
                        for (let v of mamesh0.vertices) {
                            if (v.param.x == 0) vertices0.push(v)
                            else if (v.param.x == creator.nbU - 1) vertices1.push(v)
                        }


                        for (let i = 0; i < mamesh0.vertices.length; i++) {
                            let position = mamesh0.vertices[i].position
                            let theta = position.x * this.hole
                            position.x = Math.cos(theta - Math.PI / 2)
                            position.z = Math.sin(theta - Math.PI / 2)
                        }
                    }
                        break


                }
                //$$$ec



                //$$$begin


                /**two ways for creating a map vertex->Vertex[] (source->receivers) to say which vertices are stick or merge with other */
                let map
                //$$$e


                //$$$bc
                switch (this.slow) {
                    case 'slow': {
                        let mapFinder = new grateAndGlue.FindSickingMapFromVertices(vertices0, vertices1)
                        /**if e.g. equal to 2, then two vertices are declared to be close when their distance is at most 2 times the mean distance of their link */
                        mapFinder.proximityCoef = this.proximityCoef
                        /**if equal to 0, in the map vertex->Vertex[] (source->receivers), receivers is a list of only one vertex : the closest one to the source.
                         * If equal to 2 (e.g.),receivers contain the closest vertices from source (let's say the distance is d)
                         * and also all the vertices at distance less that 2*d  */
                        mapFinder.toleranceToBeOneOfTheClosest = this.toleranceToBeOneOfTheClosest
                        map = mapFinder.go()
                    }
                        break

                    case 'fast': {
                        /** A fast method: it creates a dictionary or approximative vertex-positions, which avoid a double loop over
                         the two vertex-list. The proximity is parametrized by {@link FindCloseVerticesFast#nbDistinctPoint}
                         which indicate how many different positions are allowed between the two extreme points (typically 1000).
                         (imagine that it creates a sort of grid, as in classical drawing software). With very small values (e.g. 5)
                         the behaviour is weird.*/
                        let mapFinder = new grateAndGlue.FindCloseVerticesFast(vertices0, vertices1)
                        mapFinder.nbDistinctPoint = this.resolution
                        map = mapFinder.go()

                    }
                        break
                }
                //$$$ec

                function printListV(list:Vertex[]):string{
                    let res='['
                    for (let v of list){
                        res+=v.hashString+","
                    }
                    res=res.slice(0,res.length-1)
                    res+=']'
                    return res
                }
                this.mathisFrame.messageDiv.append("map:"+map.printMe(printListV))

                //$$$bh  Warning : vertices0 and vertices1 must be disjoint or ...
                /** Sources and Receiver must be disjoint for sticking or merging.
                 * In the present code, we have construct two lists vertices0 and vertices1 which are disjoints.
                 * You can give non-disjoint lists to {@link FindCloseVerticesFast} which make a choice to
                 * separate sources and receiver.
                 * You can also give non-disjoint list to {@link FindSickingMapFromVertices} but in this case
                 * you must set {@link FindSickingMapFromVertices#acceptOnlyDisjointReceiverAndSource} to false;
                 * and after you have to make yourself the separation between source and receiver*/

                //$$$eh

                //$$$b
                /**compare merging and sticking*/
                //$$$end

                //$$$bc
                switch (this.stickOrMerge) {
                    case 'sticking': {
                        /**links are added from source to all its receivers*/
                        let sticker = new grateAndGlue.Sticker(mamesh0, mamesh1, map)
                        sticker.goChanging()

                        /**polygonFinder work badly for non smooth surface. See e.g. the example  cylinder+plane*/
                        if(this.addMissingPoly) {
                            let polygonFind = new polygonFinder.PolygonFinderFromLinks(mamesh0)
                            /**set this filed to '2', if above you have chosen the cylinder example */
                            polygonFind.nbBiggerFacesDeleted = this.nbBiggerFacesDeleted
                            polygonFind.go()
                        }
                    }
                        break

                    case 'merging': {
                        /**merging : the source is sent to the first receiver (the closest) */
                        let merger = new grateAndGlue.Merger(mamesh0, mamesh1, map)
                        merger.goChanging()
                    }
                        break

                    case 'do nothing':{

                    }

                }
                //$$$ec




                //$$$bh visualization

                let linkViewer0 = new visu3d.LinksViewer(mamesh0, this.mathisFrame.scene)
                linkViewer0.go()

                new visu3d.SurfaceViewer(mamesh0, this.mathisFrame.scene).go()

                //$$$eh
            }
        }


        class StickCylinderAndPlane implements PieceOfCode {

            NAME = "StickCylinderAndPlane"
            TITLE = `Exercice: stick a cylinder and a plane.`


            proximityCoef = 2
            $$$proximityCoef = [0.2, 0.5, 0.8, 1, 1.2, 1.5, 2, 3]



            sourceChoice='source is plane'
            $$$sourceChoice=['source is plane','source is cylinder']




            constructor(private mathisFrame: MathisFrame) {
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


                //$$$bh cylinder and plane creation

                let creator = new reseau.Regular2dPlus()
                creator.origin = new XYZ(0, 0, 0)
                creator.end = new XYZ(2 * Math.PI, 0.7, 0)
                creator.nbU = 40
                creator.nbV = 40
                let mameshCylinder = creator.go()

                let radius=0.2
                for (let vertex of mameshCylinder.vertices){
                    let u=vertex.position.x
                    let v=vertex.position.y
                    vertex.position.x=radius*cos (u)
                    vertex.position.z=radius*sin (u)
                    vertex.position.y=v+0.01
                }
                new grateAndGlue.Merger(mameshCylinder).goChanging()



                let creator1=new reseau.Regular2dPlus()
                creator1.origin = new XYZ(-1,-1,0)
                creator1.end=new XYZ(1,1,0)
                creator1.nbU=60
                creator1.nbV=60

                /**we do not put vertex on the cylinder basis. Another solution would be to use the grating
                 * process, but it requires more computations. */

                creator1.putAVertexOnlyAtXYZCheckingThisCondition=(position)=>{return (position.length()>radius)}
                let mameshPlane = creator1.go()

                let positioning=new Positioning()
                positioning.upVector=new XYZ(0,0,-1)
                positioning.applyToVertices(mameshPlane.vertices)

                //$$$eh


                //$$$b
                /** We preselect vertices to stick, to avoid a big double loop ; alternatively, you can use the
                 * fast processes (see above) to find the sticking-map, but it is less flexible.*/
                let bottomBorderOfCylinder=[]
                let centerOfPlane=[]
                for (let vertex of mameshCylinder.vertices){
                    if (vertex.param.y==0) bottomBorderOfCylinder.push(vertex)
                }
                for (let vertex of mameshPlane.vertices){
                    if ( vertex.position.length()<radius*1.3) centerOfPlane.push(vertex)
                }

                //$$$e


                //$$$b
                /** the choice of source and receiver is strategic */
                let sourceMamesh:Mamesh
                let receiverMamesh:Mamesh
                let sourceVertex:Vertex[]
                let receiverVertex:Vertex[]

                //$$$e


                //$$$bc

                switch (this.sourceChoice){

                    case 'source is plane' : {
                        sourceMamesh=mameshPlane
                        receiverMamesh=mameshCylinder
                        //n
                        sourceVertex=centerOfPlane
                        receiverVertex=bottomBorderOfCylinder
                    }
                        break

                    case 'source is cylinder':{
                        sourceMamesh=mameshCylinder
                        receiverMamesh= mameshPlane
                        //n
                        sourceVertex=bottomBorderOfCylinder
                        receiverVertex= centerOfPlane
                    }
                        break

                }

                //$$$ec

                //$$$b
                let mapFinder = new grateAndGlue.FindSickingMapFromVertices(receiverVertex,sourceVertex)
                mapFinder.proximityCoef = this.proximityCoef
                let map = mapFinder.go()


                        let merger = new grateAndGlue.Merger(receiverMamesh, sourceMamesh, map)
                        merger.goChanging()


                //$$$e



                //$$$b
                //n
                //$$$e






                //$$$bh visualization

                let linkViewer0 = new visu3d.LinksViewer(receiverMamesh, this.mathisFrame.scene)
                linkViewer0.go()

                new visu3d.SurfaceViewer(receiverMamesh, this.mathisFrame.scene).go()

                //$$$eh
            }
        }




        class StickCylinderAndPlaneTODO implements PieceOfCode {

            NAME = "StickCylinderAndPlane"
            TITLE = `Exercice: stick a cylinder and a plane.`


            toleranceToBeOneOfTheClosest = 0.05
            $$$toleranceToBeOneOfTheClosest = [0, 0.05, 0.1, 0.2, 0.5, 1, 1.5, 2]



            proximityCoef = 2
            $$$proximityCoef = [0.2, 0.5, 0.8, 1, 1.2, 1.5, 2, 3]



            sourceChoice='source is plane'
            $$$sourceChoice=['source is plane','source is cylinder']


            mergerOrStick='merge'
            $$$mergerOrStick=['merge','stick']


            addMissingPolygons=false
            $$$addMissingPolygons=[true,false]


            constructor(private mathisFrame: MathisFrame) {
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


                //$$$bh cylinder and plane creation

                let creator = new reseau.Regular2dPlus()
                creator.origin = new XYZ(0, 0, 0)
                creator.end = new XYZ(2 * Math.PI, 0.7, 0)
                creator.nbU = 40
                creator.nbV = 40
                let mameshCylinder = creator.go()

                let radius=0.2
                for (let vertex of mameshCylinder.vertices){
                    let u=vertex.position.x
                    let v=vertex.position.y
                    vertex.position.x=radius*cos (u)
                    vertex.position.z=radius*sin (u)
                    vertex.position.y=v+0.01
                }
                new grateAndGlue.Merger(mameshCylinder).goChanging()



                let creator1=new reseau.Regular2dPlus()
                creator1.origin = new XYZ(-1,-1,0)
                creator1.end=new XYZ(1,1,0)
                creator1.nbU=60
                creator1.nbV=60

                /**we do not put vertex on the cylinder basis. Another solution would be to use the grating
                 * process, but it requires more computations. */

                creator1.putAVertexOnlyAtXYZCheckingThisCondition=(position)=>{return (position.length()>radius)}
                let mameshPlane = creator1.go()

                let positioning=new Positioning()
                positioning.upVector=new XYZ(0,0,-1)
                positioning.applyToVertices(mameshPlane.vertices)

                //$$$eh


                //$$$b
                /** We preselect vertices to stick, to avoid a big double loop ; alternatively, you can use the
                 * fast processes (see above) to find the sticking-map, but it is less flexible.*/
                let bottomBorderOfCylinder=[]
                let centerOfPlane=[]
                for (let vertex of mameshCylinder.vertices){
                    if (vertex.param.y==0) bottomBorderOfCylinder.push(vertex)
                }
                for (let vertex of mameshPlane.vertices){
                    if ( vertex.position.length()<radius*1.3) centerOfPlane.push(vertex)
                }

                //$$$e


                //$$$b
                /** the choice of source and receiver is strategic */
                let sourceMamesh:Mamesh
                let receiverMamesh:Mamesh
                let sourceVertex:Vertex[]
                let receiverVertex:Vertex[]

                //$$$e


                //$$$bc

                switch (this.sourceChoice){

                    case 'source is plane' : {
                        sourceMamesh=mameshPlane
                        receiverMamesh=mameshCylinder
                        //n
                        sourceVertex=centerOfPlane
                        receiverVertex=bottomBorderOfCylinder
                    }
                    break

                    case 'source is cylinder':{
                        sourceMamesh=mameshCylinder
                        receiverMamesh= mameshPlane
                        //n
                        sourceVertex=bottomBorderOfCylinder
                        receiverVertex= centerOfPlane
                    }
                    break

                }

                //$$$ec

                //$$$b
                let mapFinder = new grateAndGlue.FindSickingMapFromVertices(receiverVertex,sourceVertex)
                mapFinder.proximityCoef = this.proximityCoef
                mapFinder.toleranceToBeOneOfTheClosest = this.toleranceToBeOneOfTheClosest
                let map = mapFinder.go()


                switch (this.mergerOrStick) {
                    case 'merge': {
                        let merger = new grateAndGlue.Merger(receiverMamesh, sourceMamesh, map)
                        merger.goChanging()
                    }
                        break

                    case 'stick': {
                        let sticker = new grateAndGlue.Sticker(receiverMamesh, sourceMamesh, map)
                        sticker.goChanging()

                    }
                        break
                }


                if (this.addMissingPolygons){
                    let polyFind=new polygonFinder.PolygonFinderFromLinks(receiverMamesh)
                    polyFind.go()

                }




                //$$$e



                //$$$b
                //n
                //$$$e






                //$$$bh visualization

                let linkViewer0 = new visu3d.LinksViewer(receiverMamesh, this.mathisFrame.scene)
                linkViewer0.go()

                new visu3d.SurfaceViewer(receiverMamesh, this.mathisFrame.scene).go()

                //$$$eh
            }
        }







        //
        //
        // class FindPolygonsFromLinks implements PieceOfCode {
        //
        //     NAME = "FindPolygonsFromLinks"
        //     TITLE = "Find triangle and quad from links"
        //
        //     connect = false//TODO
        //     $$$connect = [true,false]
        //
        //     nbBiggerFacesDeleted = 1;
        //     $$$nbBiggerFacesDeleted = [0, 1, 2, 4, 6, 8];
        //
        //
        //     surfaceChoice = 'Grat&glue small'
        //     $$$surfaceChoice = ['ultra simple','ultra simple with triangle','a five side poly','impasse','alreadyOneQuad','Flat', 'Strange flat', 'Filled flat', 'Half-cylinder', 'Moebius','Grat&glue small', 'Grat&glue 1', 'Grat&glue 2', 'nothingToDo', 'bugged']
        //
        //     areaOrPerimeterChoice = true;
        //     $$$areaOrPerimeterChoice = [true, false]
        //
        //     fillConvexFaces = true;
        //     $$$fillConvexFaces = [true, false]
        //
        //     showNormals=true
        //     $$$showNormals=[true,false]
        //
        //
        //     constructor(private mathisFrame: MathisFrame) {
        //         this.mathisFrame = mathisFrame
        //
        //     }
        //
        //     goForTheFirstTime() {
        //
        //         let camera = <macamera.GrabberCamera>this.mathisFrame.scene.activeCamera;
        //
        //         camera.changePosition(new XYZ(0, 0, -4));
        //         this.go()
        //     }
        //
        //     go() {
        //
        //         this.mathisFrame.clearScene(false, false);
        //
        //         //$$$begin
        //         let mamesh: Mamesh;
        //         //$$$end
        //         //$$$bh mesh creation
        //         switch (this.surfaceChoice) {
        //
        //             case 'ultra simple': {
        //                 let creator1 = new reseau.Regular2dPlus()
        //                 creator1.makeTriangleOrSquare = false
        //                 mamesh = creator1.go()
        //             }
        //                 break
        //
        //             case 'ultra simple with triangle': {
        //                 let creator1 = new reseau.Regular2dPlus()
        //                 creator1.makeTriangleOrSquare = false
        //                 creator1.maille=reseau.Maille.triangleH
        //                 mamesh = creator1.go()
        //             }
        //                 break
        //
        //             case 'alreadyOneQuad': {
        //                 let creator1 = new reseau.Regular2dPlus()
        //                 creator1.makeTriangleOrSquare = false
        //                 mamesh = creator1.go()
        //                 //mamesh.smallestSquares=[mamesh.vertices[0],mamesh.vertices[3],mamesh.vertices[4],mamesh.vertices[1]]
        //                 mamesh.smallestSquares=[mamesh.vertices[1],mamesh.vertices[4],mamesh.vertices[3],mamesh.vertices[0]]
        //
        //             }
        //                 break
        //
        //
        //             case 'a five side poly': {
        //                 let creator1 = new reseau.Regular2dPlus()
        //                 creator1.makeTriangleOrSquare = false
        //
        //                 mamesh = creator1.go()
        //
        //                 let v1=creator1.OUT_paramToVertex.getValue(new XYZ(0,1,0))
        //                 let v4=creator1.OUT_paramToVertex.getValue(new XYZ(1,1,0))
        //                 Vertex.separateTwoVoisins(v1,v4)
        //             }
        //                 break
        //
        //             case 'impasse': {
        //                 let creator1 = new reseau.Regular2dPlus()
        //                 creator1.makeTriangleOrSquare = false
        //
        //                 mamesh = creator1.go()
        //
        //                 let v1=creator1.OUT_paramToVertex.getValue(new XYZ(0,1,0))
        //                 let v4=creator1.OUT_paramToVertex.getValue(new XYZ(1,1,0))
        //
        //                 let v7=creator1.OUT_paramToVertex.getValue(new XYZ(2,1,0))
        //                 let v5=creator1.OUT_paramToVertex.getValue(new XYZ(1,2,0))
        //
        //
        //                 Vertex.separateTwoVoisins(v1,v4)
        //                 Vertex.separateTwoVoisins(v4,v7)
        //                 Vertex.separateTwoVoisins(v4,v5)
        //             }
        //                 break
        //
        //
        //
        //             case 'Flat': {
        //                 /** flat **/
        //
        //                 /** vertices **/
        //                 let vtx1 = new mathis.Vertex().setPosition(-4, -0.5, 0);
        //                 let vtx2 = new mathis.Vertex().setPosition(-3, 1, 0);
        //                 let vtx3 = new mathis.Vertex().setPosition(-1, 2.5, 0);
        //                 let vtx4 = new mathis.Vertex().setPosition(2, 2, 0);
        //                 let vtx5 = new mathis.Vertex().setPosition(3, -0.5, 0);
        //                 let vtx6 = new mathis.Vertex().setPosition(3, -2, 0);
        //                 let vtx7 = new mathis.Vertex().setPosition(2, -3, -1);
        //                 let vtx8 = new mathis.Vertex().setPosition(-0.5, -3, 0);
        //                 let vtx9 = new mathis.Vertex().setPosition(-2.5, -3, 0);
        //                 let vtx10 = new mathis.Vertex().setPosition(-2.5, -1, 0);
        //                 let vtx11 = new mathis.Vertex().setPosition(-0, 0, 0);
        //                 let vtx12 = new mathis.Vertex().setPosition(1.5, -1.5, 0);
        //
        //                 mamesh = new mathis.Mamesh();
        //                 mamesh.vertices.push(vtx1, vtx2, vtx3, vtx4, vtx5, vtx6, vtx7, vtx8, vtx9, vtx10, vtx11, vtx12);
        //
        //                 /** links **/
        //                 vtx1.setOneLink(vtx2);
        //                 vtx2.setOneLink(vtx1);
        //                 vtx2.setOneLink(vtx3);
        //                 vtx3.setOneLink(vtx2);
        //                 vtx3.setOneLink(vtx4);
        //                 vtx4.setOneLink(vtx3);
        //                 vtx4.setOneLink(vtx5);
        //                 vtx5.setOneLink(vtx4);
        //                 vtx5.setOneLink(vtx6);
        //                 vtx6.setOneLink(vtx5);
        //                 vtx6.setOneLink(vtx7);
        //                 vtx7.setOneLink(vtx6);
        //                 vtx7.setOneLink(vtx8);
        //                 vtx8.setOneLink(vtx7);
        //                 vtx8.setOneLink(vtx9);
        //                 vtx9.setOneLink(vtx8);
        //                 vtx9.setOneLink(vtx1);
        //                 vtx1.setOneLink(vtx9);
        //                 vtx10.setOneLink(vtx1);
        //                 vtx1.setOneLink(vtx10);
        //                 vtx10.setOneLink(vtx2);
        //                 vtx2.setOneLink(vtx10);
        //                 vtx10.setOneLink(vtx9);
        //                 vtx9.setOneLink(vtx10);
        //                 vtx11.setOneLink(vtx4);
        //                 vtx4.setOneLink(vtx11);
        //                 vtx11.setOneLink(vtx8);
        //                 vtx8.setOneLink(vtx11);
        //                 vtx11.setOneLink(vtx10);
        //                 vtx10.setOneLink(vtx11);
        //                 vtx12.setOneLink(vtx6);
        //                 vtx6.setOneLink(vtx12);
        //                 vtx12.setOneLink(vtx8);
        //                 vtx8.setOneLink(vtx12);
        //             }
        //                 break
        //             case 'Strange flat': {
        //                 /** strange flat **/
        //
        //                 /** vertices **/
        //                 let vtx1 = new mathis.Vertex().setPosition(-4, -0.5, 0);
        //                 let vtx2 = new mathis.Vertex().setPosition(-3, 1, 0);
        //                 let vtx3 = new mathis.Vertex().setPosition(-1, 2.5, 0);
        //                 let vtx4 = new mathis.Vertex().setPosition(2, 2, 0);
        //                 let vtx5 = new mathis.Vertex().setPosition(3, -0.5, 0);
        //                 let vtx6 = new mathis.Vertex().setPosition(3, -2, 0);
        //                 let vtx7 = new mathis.Vertex().setPosition(2, -3, -1);
        //                 let vtx8 = new mathis.Vertex().setPosition(-0.5, -3, 0);
        //                 let vtx9 = new mathis.Vertex().setPosition(-2.5, -3, 0);
        //                 let vtx10 = new mathis.Vertex().setPosition(-2.5, -1, 0);
        //                 let vtx11 = new mathis.Vertex().setPosition(-0, 0, 0);
        //                 let vtx12 = new mathis.Vertex().setPosition(1.5, -1.5, 0);
        //                 let vtx13 = new mathis.Vertex().setPosition(3, 4, 0);
        //                 let vtx14 = new mathis.Vertex().setPosition(5, 3, 0);
        //                 let vtx15 = new mathis.Vertex().setPosition(5, 5, 0);
        //                 let vtx15_1 = new mathis.Vertex().setPosition(5, 6, 0);
        //                 let vtx16 = new mathis.Vertex().setPosition(5, 2, 0);
        //                 let vtx17 = new mathis.Vertex().setPosition(6, 1, 0);
        //                 let vtx18 = new mathis.Vertex().setPosition(-3, 3, 0);
        //                 let vtx19 = new mathis.Vertex().setPosition(7, 0, 0);
        //                 let vtx20 = new mathis.Vertex().setPosition(6, -1, 0);
        //                 let vtx21 = new mathis.Vertex().setPosition(-3, 5, 0);
        //                 let vtx101 = new mathis.Vertex().setPosition(7, 4, -1);
        //                 let vtx102 = new mathis.Vertex().setPosition(8, 4, -1);
        //                 let vtx103 = new mathis.Vertex().setPosition(7, 3, -3);
        //                 let vtx104 = new mathis.Vertex().setPosition(7, 5, 0);
        //                 let vtx105 = new mathis.Vertex().setPosition(9, 4, 0);
        //                 let vtx106 = new mathis.Vertex().setPosition(10, 4, 0);
        //                 let vtx107 = new mathis.Vertex().setPosition(10, 3, 0);
        //                 let vtx108 = new mathis.Vertex().setPosition(9, 5, 0);
        //
        //                 mamesh = new mathis.Mamesh();
        //                 mamesh.vertices.push(vtx1, vtx2, vtx3, vtx4, vtx5, vtx6, vtx7, vtx8, vtx9, vtx10, vtx11, vtx12);
        //                 mamesh.vertices.push(vtx13, vtx14, vtx15, vtx16, vtx17, vtx18, vtx19, vtx20, vtx21, vtx15_1);
        //                 mamesh.vertices.push(vtx101, vtx102, vtx103, vtx104, vtx105, vtx106, vtx107, vtx108);
        //
        //                 /** links **/
        //                 vtx1.setOneLink(vtx2);
        //                 vtx2.setOneLink(vtx1);
        //                 vtx2.setOneLink(vtx3);
        //                 vtx3.setOneLink(vtx2);
        //                 vtx3.setOneLink(vtx4);
        //                 vtx4.setOneLink(vtx3);
        //                 vtx4.setOneLink(vtx5);
        //                 vtx5.setOneLink(vtx4);
        //                 vtx5.setOneLink(vtx6);
        //                 vtx6.setOneLink(vtx5);
        //                 vtx6.setOneLink(vtx7);
        //                 vtx7.setOneLink(vtx6);
        //                 vtx7.setOneLink(vtx8);
        //                 vtx8.setOneLink(vtx7);
        //                 vtx8.setOneLink(vtx9);
        //                 vtx9.setOneLink(vtx8);
        //                 vtx9.setOneLink(vtx1);
        //                 vtx1.setOneLink(vtx9);
        //                 vtx10.setOneLink(vtx1);
        //                 vtx1.setOneLink(vtx10);
        //                 vtx10.setOneLink(vtx2);
        //                 vtx2.setOneLink(vtx10);
        //                 vtx10.setOneLink(vtx9);
        //                 vtx9.setOneLink(vtx10);
        //                 vtx11.setOneLink(vtx4);
        //                 vtx4.setOneLink(vtx11);
        //                 vtx11.setOneLink(vtx8);
        //                 vtx8.setOneLink(vtx11);
        //                 vtx11.setOneLink(vtx10);
        //                 vtx10.setOneLink(vtx11);
        //                 vtx12.setOneLink(vtx6);
        //                 vtx6.setOneLink(vtx12);
        //                 vtx12.setOneLink(vtx8);
        //                 vtx8.setOneLink(vtx12);
        //                 vtx13.setOneLink(vtx4);
        //                 vtx4.setOneLink(vtx13);
        //                 vtx13.setOneLink(vtx14);
        //                 vtx14.setOneLink(vtx13);
        //                 vtx14.setOneLink(vtx15);
        //                 vtx15.setOneLink(vtx14);
        //                 vtx15_1.setOneLink(vtx15);
        //                 vtx15.setOneLink(vtx15_1);
        //                 vtx14.setOneLink(vtx16);
        //                 vtx16.setOneLink(vtx14);
        //                 vtx16.setOneLink(vtx17);
        //                 vtx17.setOneLink(vtx16);
        //                 vtx17.setOneLink(vtx19);
        //                 vtx19.setOneLink(vtx17);
        //                 vtx20.setOneLink(vtx19);
        //                 vtx19.setOneLink(vtx20);
        //                 vtx20.setOneLink(vtx17);
        //                 vtx17.setOneLink(vtx20);
        //                 vtx18.setOneLink(vtx2);
        //                 vtx2.setOneLink(vtx18);
        //                 vtx101.setOneLink(vtx102);
        //                 vtx102.setOneLink(vtx101);
        //                 vtx102.setOneLink(vtx103);
        //                 vtx103.setOneLink(vtx102);
        //                 vtx101.setOneLink(vtx103);
        //                 vtx103.setOneLink(vtx101);
        //                 vtx101.setOneLink(vtx104);
        //                 vtx104.setOneLink(vtx101);
        //                 vtx102.setOneLink(vtx105);
        //                 vtx105.setOneLink(vtx102);
        //                 // vtx105.setOneLink(vtx106); vtx106.setOneLink(vtx105);
        //                 vtx107.setOneLink(vtx106);
        //                 vtx106.setOneLink(vtx107);
        //                 vtx107.setOneLink(vtx103);
        //                 vtx103.setOneLink(vtx107);
        //                 vtx108.setOneLink(vtx105);
        //                 vtx105.setOneLink(vtx108);
        //                 vtx108.setOneLink(vtx106);
        //                 vtx106.setOneLink(vtx108);
        //                 vtx101.setOneLink(vtx15);
        //                 vtx15.setOneLink(vtx101);
        //             }
        //                 break
        //
        //             case 'Filled flat': {
        //                 /** filled flat **/
        //
        //                 /** vertices **/
        //                 let vtx1 = new mathis.Vertex().setPosition(-4, -0.5, 0);
        //                 let vtx2 = new mathis.Vertex().setPosition(-3, 1, 0);
        //                 let vtx3 = new mathis.Vertex().setPosition(-1, 2.5, 0);
        //                 let vtx4 = new mathis.Vertex().setPosition(2, 2, 0);
        //                 let vtx5 = new mathis.Vertex().setPosition(3, -0.5, 0);
        //                 let vtx6 = new mathis.Vertex().setPosition(3, -2, 0);
        //                 let vtx7 = new mathis.Vertex().setPosition(2, -3, -1);
        //                 let vtx8 = new mathis.Vertex().setPosition(-0.5, -3, 0);
        //                 let vtx9 = new mathis.Vertex().setPosition(-2.5, -3, 0);
        //                 let vtx10 = new mathis.Vertex().setPosition(-2.5, -1, 0);
        //                 let vtx11 = new mathis.Vertex().setPosition(-0, 0, 0);
        //                 let vtx12 = new mathis.Vertex().setPosition(1.5, -1.5, 0);
        //
        //                 mamesh = new mathis.Mamesh();
        //                 mamesh.vertices.push(vtx1, vtx2, vtx3, vtx4, vtx5, vtx6, vtx7, vtx8, vtx9, vtx10, vtx11, vtx12);
        //
        //                 /** links **/
        //                 vtx1.setOneLink(vtx2);
        //                 vtx2.setOneLink(vtx1);
        //                 vtx2.setOneLink(vtx3);
        //                 vtx3.setOneLink(vtx2);
        //                 vtx3.setOneLink(vtx4);
        //                 vtx4.setOneLink(vtx3);
        //                 vtx4.setOneLink(vtx5);
        //                 vtx5.setOneLink(vtx4);
        //                 vtx5.setOneLink(vtx6);
        //                 vtx6.setOneLink(vtx5);
        //                 vtx6.setOneLink(vtx7);
        //                 vtx7.setOneLink(vtx6);
        //                 vtx7.setOneLink(vtx8);
        //                 vtx8.setOneLink(vtx7);
        //                 vtx8.setOneLink(vtx9);
        //                 vtx9.setOneLink(vtx8);
        //                 vtx9.setOneLink(vtx1);
        //                 vtx1.setOneLink(vtx9);
        //                 vtx10.setOneLink(vtx1);
        //                 vtx1.setOneLink(vtx10);
        //                 vtx10.setOneLink(vtx2);
        //                 vtx2.setOneLink(vtx10);
        //                 vtx10.setOneLink(vtx9);
        //                 vtx9.setOneLink(vtx10);
        //                 vtx11.setOneLink(vtx4);
        //                 vtx4.setOneLink(vtx11);
        //                 vtx11.setOneLink(vtx8);
        //                 vtx8.setOneLink(vtx11);
        //                 vtx11.setOneLink(vtx10);
        //                 vtx10.setOneLink(vtx11);
        //                 vtx12.setOneLink(vtx6);
        //                 vtx6.setOneLink(vtx12);
        //                 vtx12.setOneLink(vtx8);
        //                 vtx8.setOneLink(vtx12);
        //
        //                 /** faces **/
        //                 mamesh.addATriangle(vtx1, vtx2, vtx10);
        //                 mamesh.addATriangle(vtx1, vtx9, vtx10);
        //                 mamesh.addASquare(vtx9, vtx10, vtx11, vtx8);
        //                 mamesh.addASquare(vtx8, vtx7, vtx6, vtx12);
        //
        //             }
        //                 break
        //
        //             case 'Half-cylinder': {
        //                 /** half-cylinder **/
        //
        //                 let creator = new mathis.reseau.TriangulatedPolygone(10);
        //                 creator.nbSubdivisionInARadius = 5;
        //                 creator.origin = new mathis.XYZ(-Math.PI * 0.8, -1, 0);
        //                 creator.end = new mathis.XYZ(+Math.PI * 0.8, 1, 0);
        //                 mamesh = creator.go();
        //                 mamesh.smallestTriangles = [];
        //
        //                 for (let _i = 0, _a = mamesh.vertices; _i < _a.length; _i++) {
        //                     let vertex = _a[_i];
        //                     let u = vertex.position.x;
        //                     let v = vertex.position.y;
        //                     vertex.position.x = Math.cos(u);
        //                     vertex.position.y = Math.sin(u);
        //                     vertex.position.z = v;
        //                 }
        //             }
        //                 break
        //
        //             case 'Moebius': {
        //                 /** moebius ring **/
        //
        //                 let basis = new mathis.reseau.BasisForRegularReseau();
        //                 basis.origin = new mathis.XYZ(0, -1, 0);
        //                 basis.end = new mathis.XYZ(2 * Math.PI, 1, 0);
        //                 basis.nbU = 20;
        //                 basis.nbV = 10;
        //                 let creator = new mathis.reseau.Regular2d(basis);
        //                 creator.makeTriangleOrSquare = false;
        //                 mamesh = creator.go();
        //                 for (let _i = 0, _a = mamesh.vertices; _i < _a.length; _i++) {
        //                     let vertex = _a[_i];
        //                     let u = vertex.position.x;
        //                     let v = vertex.position.y;
        //                     vertex.position.x = (2 - v * Math.sin(u / 2)) * Math.sin(u);
        //                     vertex.position.y = (2 - v * Math.sin(u / 2)) * Math.cos(u);
        //                     vertex.position.z = v * Math.cos(u / 2);
        //                 }
        //
        //             }
        //                 break
        //
        //             case 'Grat&glue 1': {
        //
        //                 /** Grating and gluing example 1**/
        //                 let vertices0 = [];
        //                 let vertices1 = [];
        //                 let mamesh1;
        //                 let basis0 = new mathis.reseau.BasisForRegularReseau();
        //                 basis0.origin = new mathis.XYZ(-1, -0.9, 0);
        //                 basis0.end = new mathis.XYZ(-0.05, 1.1, 0);
        //                 basis0.nbU = 5;
        //                 basis0.nbV = 10;
        //                 mamesh = new mathis.reseau.Regular2d(basis0).go();
        //                 let basis1 = new mathis.reseau.BasisForRegularReseau();
        //                 basis1.origin = new mathis.XYZ(0.05, -1, 0);
        //                 basis1.end = new mathis.XYZ(1, 1, 0);
        //                 basis1.nbU = 5;
        //                 basis1.nbV = 10;
        //                 mamesh1 = new mathis.reseau.Regular2d(basis1).go();
        //                 vertices0 = mamesh.vertices;
        //                 vertices1 = mamesh1.vertices;
        //                 new mathis.spacialTransformations.Similitude(mamesh1.vertices, 2 * Math.PI * 0.01).goChanging();
        //                 let map;
        //                 let mapFinder = new mathis.grateAndGlue.FindSickingMapFromVertices(vertices0, vertices1);
        //                 mapFinder.proximityCoef = 0.9;
        //
        //                 mapFinder.toleranceToBeOneOfTheClosest = 0.05;
        //                 map = mapFinder.go();
        //                 let sticker = new mathis.grateAndGlue.Sticker(mamesh, mamesh1, map);
        //                 sticker.goChanging();
        //
        //             }
        //                 break
        //
        //             case 'Grat&glue small': {
        //
        //                 /** Grating and gluing example 2**/
        //                 let creator0 = new reseau.TriangulatedPolygone(6);
        //                 creator0.origin = new XYZ(-1, -1, 0);
        //                 creator0.end = new XYZ(0.5, 0.5, 0);
        //                 creator0.nbSubdivisionInARadius = 1;
        //                 let mamesh0 = creator0.go();
        //                 let creator1 = new reseau.TriangulatedPolygone(6);
        //                 creator1.origin = new XYZ(-0.5, -0.5, 0);
        //                 creator1.end = new XYZ(1, 1, 0);
        //                 creator1.nbSubdivisionInARadius = 1;
        //                 let mamesh1 = creator1.go();
        //                 let graterAndSticker = new grateAndGlue.ConcurrentMameshesGraterAndSticker();
        //                 graterAndSticker.addMissingPolygons=false
        //                 graterAndSticker.IN_mameshes.push(mamesh0, mamesh1);
        //                 graterAndSticker.justGrateDoNotStick = false;
        //                 graterAndSticker.SUB_grater.proportionOfSeeds = [0.1, 0.1];
        //                 graterAndSticker.proximityCoefToStick = [2];
        //                 graterAndSticker.toleranceToBeOneOfTheClosest = 0.5;
        //                 graterAndSticker.suppressLinksAngularlyTooClose = false;
        //                 graterAndSticker.SUB_linkCleanerByAngle.suppressLinksAngularParam = 2 * Math.PI * 0.1;
        //
        //                 graterAndSticker.justGrateDoNotStick=true
        //
        //
        //                 mamesh = graterAndSticker.goChanging()
        //
        //                 cc(mamesh.toString())
        //
        //
        //             }
        //                 break
        //
        //             case 'Grat&glue 2': {
        //
        //                 /** Grating and gluing example 2**/
        //                 let creator0 = new reseau.TriangulatedPolygone(6);
        //                 creator0.origin = new XYZ(-1, -1, 0);
        //                 creator0.end = new XYZ(0.5, 0.5, 0);
        //                 creator0.nbSubdivisionInARadius = 9;
        //                 let mamesh0 = creator0.go();
        //                 let creator1 = new reseau.TriangulatedPolygone(6);
        //                 creator1.origin = new XYZ(-0.5, -0.5, 0);
        //                 creator1.end = new XYZ(1, 1, 0);
        //                 creator1.nbSubdivisionInARadius = 5;
        //                 let mamesh1 = creator1.go();
        //                 let graterAndSticker = new grateAndGlue.ConcurrentMameshesGraterAndSticker();
        //                 graterAndSticker.addMissingPolygons=false
        //
        //                 graterAndSticker.IN_mameshes.push(mamesh0, mamesh1);
        //                 graterAndSticker.justGrateDoNotStick = false;
        //                 graterAndSticker.SUB_grater.proportionOfSeeds = [0.1, 0.1];
        //                 graterAndSticker.proximityCoefToStick = [2];
        //                 graterAndSticker.toleranceToBeOneOfTheClosest = 0.5;
        //                 graterAndSticker.suppressLinksAngularlyTooClose = false;
        //                 graterAndSticker.SUB_linkCleanerByAngle.suppressLinksAngularParam = 2 * Math.PI * 0.1;
        //
        //                 mamesh = graterAndSticker.goChanging()
        //             }
        //                 break
        //
        //             case 'nothingToDo': {
        //
        //
        //                 let creator1 = new reseau.Regular2dPlus()
        //                 mamesh = creator1.go()
        //
        //                 let creator2 = new reseau.Regular2dPlus()
        //                 creator2.origin = new XYZ(3, 0, 0)
        //                 creator2.end = new XYZ(4, 1, 0)
        //                 let mamesh2 = creator2.go()
        //
        //                 for (let v of mamesh2.vertices) {
        //                     mamesh.vertices.push(v)
        //                 }
        //                 for (let v of mamesh2.smallestSquares) mamesh.smallestSquares.push(v)
        //
        //             }
        //                 break
        //
        //             case 'bugged': {
        //                 let creator0 = new reseau.TriangulatedPolygone(6);
        //                 creator0.origin = new XYZ(-1, -1, 0);
        //                 creator0.end = new XYZ(0.5, 0.5, 0);
        //                 creator0.nbSubdivisionInARadius = 9;
        //                 let mamesh0 = creator0.go();
        //
        //                 let creator1 = new reseau.TriangulatedPolygone(6);
        //                 creator1.origin = new XYZ(-0.5, -0.5, 0);
        //                 creator1.end = new XYZ(1, 1, 0);
        //                 creator1.nbSubdivisionInARadius = 5;
        //                 let mamesh1 = creator1.go();
        //
        //                 let graterAndSticker = new grateAndGlue.ConcurrentMameshesGraterAndSticker();
        //                 graterAndSticker.IN_mameshes.push(mamesh0, mamesh1);
        //                 graterAndSticker.justGrateDoNotStick = true;
        //                 graterAndSticker.SUB_grater.proportionOfSeeds = [0.1, 0.1];
        //                 graterAndSticker.proximityCoefToStick = [2];
        //                 graterAndSticker.toleranceToBeOneOfTheClosest = 0.5;
        //                 graterAndSticker.suppressLinksAngularlyTooClose = false;
        //                 graterAndSticker.SUB_linkCleanerByAngle.suppressLinksAngularParam = 2 * Math.PI * 0.1;
        //
        //                 mamesh = graterAndSticker.goChanging()
        //
        //             }
        //                 break
        //
        //         }
        //         //$$$eh
        //
        //
        //         //$$$begin
        //         let nbBiggerFacesDeleted=this.nbBiggerFacesDeleted
        //         let areaOrPerimeterChoice=this.areaOrPerimeterChoice
        //         let fillConvexFaces=this.fillConvexFaces
        //
        //         let connect:surfaceConnection.SurfaceConnectionProcess=null
        //         if (this.connect) {
        //             connect = new surfaceConnection.SurfaceConnectionProcess(mamesh, nbBiggerFacesDeleted, areaOrPerimeterChoice, fillConvexFaces);
        //             mamesh = connect.go();
        //         }
        //
        //         //$$$end
        //
        //         //$$$bh visualization
        //         let verticesViewer = new mathis.visu3d.VerticesViewer(mamesh, this.mathisFrame.scene);
        //         verticesViewer.go();
        //
        //
        //         let linksViewer = new mathis.visu3d.LinksViewer(mamesh, this.mathisFrame.scene);
        //         linksViewer.go();
        //
        //         let surfaceViewer = new mathis.visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene);
        //         surfaceViewer.go();
        //
        //         if (this.showNormals&& connect!=null){
        //
        //             for (let vert of mamesh.vertices){
        //                 if(connect.OUT_vertexToNormal.getValue(vert)!=null) {
        //                     creation3D.drawOneVector(XYZ.newFrom(connect.OUT_vertexToNormal.getValue(vert)),this.mathisFrame.scene,vert.position)
        //                 }
        //
        //             }
        //
        //         }
        //
        //         if (true){
        //             let flager=new visu3d.VerticesFlager(mamesh,this.mathisFrame.scene)
        //             flager.decayProp=new XYZ(0.3,0.3,0)
        //             flager.go()
        //
        //         }
        //
        //
        //         //$$$eh
        //     }
        // }
        //
        //
        //
        //
        // class NormalComputationFromLinks implements PieceOfCode {
        //
        //     NAME = "NormalComputationFromLinks"
        //     TITLE = "compute normals"
        //
        //     surfaceChoice = 'Grat&glue small'
        //     $$$surfaceChoice = ['ultra simple','ultra simple with triangle','a five side poly','impasse','alreadyOneQuad','Flat', 'Strange flat', 'Filled flat', 'Half-cylinder', 'Moebius','Grat&glue small', 'Grat&glue 1', 'Grat&glue 2', 'nothingToDo', 'bugged']
        //
        //     doIt=true
        //     $$$doIt=[true,false]
        //
        //
        //     constructor(private mathisFrame: MathisFrame) {
        //         this.mathisFrame = mathisFrame
        //
        //     }
        //
        //     goForTheFirstTime() {
        //
        //         let camera = <macamera.GrabberCamera>this.mathisFrame.scene.activeCamera;
        //
        //         camera.changePosition(new XYZ(0, 0, -4));
        //         this.go()
        //     }
        //
        //     go() {
        //
        //         this.mathisFrame.clearScene(false, false);
        //
        //         //$$$begin
        //         let mamesh: Mamesh;
        //         //$$$end
        //
        //
        //         //$$$bh mamesh choice
        //         switch (this.surfaceChoice) {
        //
        //             case 'ultra simple': {
        //                 let creator1 = new reseau.Regular2dPlus()
        //                 creator1.makeTriangleOrSquare = false
        //                 mamesh = creator1.go()
        //             }
        //                 break
        //
        //             case 'ultra simple with triangle': {
        //                 let creator1 = new reseau.Regular2dPlus()
        //                 creator1.makeTriangleOrSquare = false
        //                 creator1.maille=reseau.Maille.triangleH
        //                 mamesh = creator1.go()
        //             }
        //                 break
        //
        //             case 'alreadyOneQuad': {
        //                 let creator1 = new reseau.Regular2dPlus()
        //                 creator1.makeTriangleOrSquare = false
        //                 mamesh = creator1.go()
        //                 //mamesh.smallestSquares=[mamesh.vertices[0],mamesh.vertices[3],mamesh.vertices[4],mamesh.vertices[1]]
        //                 mamesh.smallestSquares=[mamesh.vertices[1],mamesh.vertices[4],mamesh.vertices[3],mamesh.vertices[0]]
        //
        //             }
        //                 break
        //
        //
        //             case 'a five side poly': {
        //                 let creator1 = new reseau.Regular2dPlus()
        //                 creator1.makeTriangleOrSquare = false
        //
        //                 mamesh = creator1.go()
        //
        //                 let v1=creator1.OUT_paramToVertex.getValue(new XYZ(0,1,0))
        //                 let v4=creator1.OUT_paramToVertex.getValue(new XYZ(1,1,0))
        //                 Vertex.separateTwoVoisins(v1,v4)
        //             }
        //                 break
        //
        //             case 'impasse': {
        //                 let creator1 = new reseau.Regular2dPlus()
        //                 creator1.makeTriangleOrSquare = false
        //
        //                 mamesh = creator1.go()
        //
        //                 let v1=creator1.OUT_paramToVertex.getValue(new XYZ(0,1,0))
        //                 let v4=creator1.OUT_paramToVertex.getValue(new XYZ(1,1,0))
        //
        //                 let v7=creator1.OUT_paramToVertex.getValue(new XYZ(2,1,0))
        //                 let v5=creator1.OUT_paramToVertex.getValue(new XYZ(1,2,0))
        //
        //
        //                 Vertex.separateTwoVoisins(v1,v4)
        //                 Vertex.separateTwoVoisins(v4,v7)
        //                 Vertex.separateTwoVoisins(v4,v5)
        //             }
        //                 break
        //
        //
        //
        //             case 'Flat': {
        //                 /** flat **/
        //
        //                 /** vertices **/
        //                 let vtx1 = new mathis.Vertex().setPosition(-4, -0.5, 0);
        //                 let vtx2 = new mathis.Vertex().setPosition(-3, 1, 0);
        //                 let vtx3 = new mathis.Vertex().setPosition(-1, 2.5, 0);
        //                 let vtx4 = new mathis.Vertex().setPosition(2, 2, 0);
        //                 let vtx5 = new mathis.Vertex().setPosition(3, -0.5, 0);
        //                 let vtx6 = new mathis.Vertex().setPosition(3, -2, 0);
        //                 let vtx7 = new mathis.Vertex().setPosition(2, -3, -1);
        //                 let vtx8 = new mathis.Vertex().setPosition(-0.5, -3, 0);
        //                 let vtx9 = new mathis.Vertex().setPosition(-2.5, -3, 0);
        //                 let vtx10 = new mathis.Vertex().setPosition(-2.5, -1, 0);
        //                 let vtx11 = new mathis.Vertex().setPosition(-0, 0, 0);
        //                 let vtx12 = new mathis.Vertex().setPosition(1.5, -1.5, 0);
        //
        //                 mamesh = new mathis.Mamesh();
        //                 mamesh.vertices.push(vtx1, vtx2, vtx3, vtx4, vtx5, vtx6, vtx7, vtx8, vtx9, vtx10, vtx11, vtx12);
        //
        //                 /** links **/
        //                 vtx1.setOneLink(vtx2);
        //                 vtx2.setOneLink(vtx1);
        //                 vtx2.setOneLink(vtx3);
        //                 vtx3.setOneLink(vtx2);
        //                 vtx3.setOneLink(vtx4);
        //                 vtx4.setOneLink(vtx3);
        //                 vtx4.setOneLink(vtx5);
        //                 vtx5.setOneLink(vtx4);
        //                 vtx5.setOneLink(vtx6);
        //                 vtx6.setOneLink(vtx5);
        //                 vtx6.setOneLink(vtx7);
        //                 vtx7.setOneLink(vtx6);
        //                 vtx7.setOneLink(vtx8);
        //                 vtx8.setOneLink(vtx7);
        //                 vtx8.setOneLink(vtx9);
        //                 vtx9.setOneLink(vtx8);
        //                 vtx9.setOneLink(vtx1);
        //                 vtx1.setOneLink(vtx9);
        //                 vtx10.setOneLink(vtx1);
        //                 vtx1.setOneLink(vtx10);
        //                 vtx10.setOneLink(vtx2);
        //                 vtx2.setOneLink(vtx10);
        //                 vtx10.setOneLink(vtx9);
        //                 vtx9.setOneLink(vtx10);
        //                 vtx11.setOneLink(vtx4);
        //                 vtx4.setOneLink(vtx11);
        //                 vtx11.setOneLink(vtx8);
        //                 vtx8.setOneLink(vtx11);
        //                 vtx11.setOneLink(vtx10);
        //                 vtx10.setOneLink(vtx11);
        //                 vtx12.setOneLink(vtx6);
        //                 vtx6.setOneLink(vtx12);
        //                 vtx12.setOneLink(vtx8);
        //                 vtx8.setOneLink(vtx12);
        //             }
        //                 break
        //             case 'Strange flat': {
        //                 /** strange flat **/
        //
        //                 /** vertices **/
        //                 let vtx1 = new mathis.Vertex().setPosition(-4, -0.5, 0);
        //                 let vtx2 = new mathis.Vertex().setPosition(-3, 1, 0);
        //                 let vtx3 = new mathis.Vertex().setPosition(-1, 2.5, 0);
        //                 let vtx4 = new mathis.Vertex().setPosition(2, 2, 0);
        //                 let vtx5 = new mathis.Vertex().setPosition(3, -0.5, 0);
        //                 let vtx6 = new mathis.Vertex().setPosition(3, -2, 0);
        //                 let vtx7 = new mathis.Vertex().setPosition(2, -3, -1);
        //                 let vtx8 = new mathis.Vertex().setPosition(-0.5, -3, 0);
        //                 let vtx9 = new mathis.Vertex().setPosition(-2.5, -3, 0);
        //                 let vtx10 = new mathis.Vertex().setPosition(-2.5, -1, 0);
        //                 let vtx11 = new mathis.Vertex().setPosition(-0, 0, 0);
        //                 let vtx12 = new mathis.Vertex().setPosition(1.5, -1.5, 0);
        //                 let vtx13 = new mathis.Vertex().setPosition(3, 4, 0);
        //                 let vtx14 = new mathis.Vertex().setPosition(5, 3, 0);
        //                 let vtx15 = new mathis.Vertex().setPosition(5, 5, 0);
        //                 let vtx15_1 = new mathis.Vertex().setPosition(5, 6, 0);
        //                 let vtx16 = new mathis.Vertex().setPosition(5, 2, 0);
        //                 let vtx17 = new mathis.Vertex().setPosition(6, 1, 0);
        //                 let vtx18 = new mathis.Vertex().setPosition(-3, 3, 0);
        //                 let vtx19 = new mathis.Vertex().setPosition(7, 0, 0);
        //                 let vtx20 = new mathis.Vertex().setPosition(6, -1, 0);
        //                 let vtx21 = new mathis.Vertex().setPosition(-3, 5, 0);
        //                 let vtx101 = new mathis.Vertex().setPosition(7, 4, -1);
        //                 let vtx102 = new mathis.Vertex().setPosition(8, 4, -1);
        //                 let vtx103 = new mathis.Vertex().setPosition(7, 3, -3);
        //                 let vtx104 = new mathis.Vertex().setPosition(7, 5, 0);
        //                 let vtx105 = new mathis.Vertex().setPosition(9, 4, 0);
        //                 let vtx106 = new mathis.Vertex().setPosition(10, 4, 0);
        //                 let vtx107 = new mathis.Vertex().setPosition(10, 3, 0);
        //                 let vtx108 = new mathis.Vertex().setPosition(9, 5, 0);
        //
        //                 mamesh = new mathis.Mamesh();
        //                 mamesh.vertices.push(vtx1, vtx2, vtx3, vtx4, vtx5, vtx6, vtx7, vtx8, vtx9, vtx10, vtx11, vtx12);
        //                 mamesh.vertices.push(vtx13, vtx14, vtx15, vtx16, vtx17, vtx18, vtx19, vtx20, vtx21, vtx15_1);
        //                 mamesh.vertices.push(vtx101, vtx102, vtx103, vtx104, vtx105, vtx106, vtx107, vtx108);
        //
        //                 /** links **/
        //                 vtx1.setOneLink(vtx2);
        //                 vtx2.setOneLink(vtx1);
        //                 vtx2.setOneLink(vtx3);
        //                 vtx3.setOneLink(vtx2);
        //                 vtx3.setOneLink(vtx4);
        //                 vtx4.setOneLink(vtx3);
        //                 vtx4.setOneLink(vtx5);
        //                 vtx5.setOneLink(vtx4);
        //                 vtx5.setOneLink(vtx6);
        //                 vtx6.setOneLink(vtx5);
        //                 vtx6.setOneLink(vtx7);
        //                 vtx7.setOneLink(vtx6);
        //                 vtx7.setOneLink(vtx8);
        //                 vtx8.setOneLink(vtx7);
        //                 vtx8.setOneLink(vtx9);
        //                 vtx9.setOneLink(vtx8);
        //                 vtx9.setOneLink(vtx1);
        //                 vtx1.setOneLink(vtx9);
        //                 vtx10.setOneLink(vtx1);
        //                 vtx1.setOneLink(vtx10);
        //                 vtx10.setOneLink(vtx2);
        //                 vtx2.setOneLink(vtx10);
        //                 vtx10.setOneLink(vtx9);
        //                 vtx9.setOneLink(vtx10);
        //                 vtx11.setOneLink(vtx4);
        //                 vtx4.setOneLink(vtx11);
        //                 vtx11.setOneLink(vtx8);
        //                 vtx8.setOneLink(vtx11);
        //                 vtx11.setOneLink(vtx10);
        //                 vtx10.setOneLink(vtx11);
        //                 vtx12.setOneLink(vtx6);
        //                 vtx6.setOneLink(vtx12);
        //                 vtx12.setOneLink(vtx8);
        //                 vtx8.setOneLink(vtx12);
        //                 vtx13.setOneLink(vtx4);
        //                 vtx4.setOneLink(vtx13);
        //                 vtx13.setOneLink(vtx14);
        //                 vtx14.setOneLink(vtx13);
        //                 vtx14.setOneLink(vtx15);
        //                 vtx15.setOneLink(vtx14);
        //                 vtx15_1.setOneLink(vtx15);
        //                 vtx15.setOneLink(vtx15_1);
        //                 vtx14.setOneLink(vtx16);
        //                 vtx16.setOneLink(vtx14);
        //                 vtx16.setOneLink(vtx17);
        //                 vtx17.setOneLink(vtx16);
        //                 vtx17.setOneLink(vtx19);
        //                 vtx19.setOneLink(vtx17);
        //                 vtx20.setOneLink(vtx19);
        //                 vtx19.setOneLink(vtx20);
        //                 vtx20.setOneLink(vtx17);
        //                 vtx17.setOneLink(vtx20);
        //                 vtx18.setOneLink(vtx2);
        //                 vtx2.setOneLink(vtx18);
        //                 vtx101.setOneLink(vtx102);
        //                 vtx102.setOneLink(vtx101);
        //                 vtx102.setOneLink(vtx103);
        //                 vtx103.setOneLink(vtx102);
        //                 vtx101.setOneLink(vtx103);
        //                 vtx103.setOneLink(vtx101);
        //                 vtx101.setOneLink(vtx104);
        //                 vtx104.setOneLink(vtx101);
        //                 vtx102.setOneLink(vtx105);
        //                 vtx105.setOneLink(vtx102);
        //                 // vtx105.setOneLink(vtx106); vtx106.setOneLink(vtx105);
        //                 vtx107.setOneLink(vtx106);
        //                 vtx106.setOneLink(vtx107);
        //                 vtx107.setOneLink(vtx103);
        //                 vtx103.setOneLink(vtx107);
        //                 vtx108.setOneLink(vtx105);
        //                 vtx105.setOneLink(vtx108);
        //                 vtx108.setOneLink(vtx106);
        //                 vtx106.setOneLink(vtx108);
        //                 vtx101.setOneLink(vtx15);
        //                 vtx15.setOneLink(vtx101);
        //             }
        //                 break
        //
        //             case 'Filled flat': {
        //                 /** filled flat **/
        //
        //                 /** vertices **/
        //                 let vtx1 = new mathis.Vertex().setPosition(-4, -0.5, 0);
        //                 let vtx2 = new mathis.Vertex().setPosition(-3, 1, 0);
        //                 let vtx3 = new mathis.Vertex().setPosition(-1, 2.5, 0);
        //                 let vtx4 = new mathis.Vertex().setPosition(2, 2, 0);
        //                 let vtx5 = new mathis.Vertex().setPosition(3, -0.5, 0);
        //                 let vtx6 = new mathis.Vertex().setPosition(3, -2, 0);
        //                 let vtx7 = new mathis.Vertex().setPosition(2, -3, -1);
        //                 let vtx8 = new mathis.Vertex().setPosition(-0.5, -3, 0);
        //                 let vtx9 = new mathis.Vertex().setPosition(-2.5, -3, 0);
        //                 let vtx10 = new mathis.Vertex().setPosition(-2.5, -1, 0);
        //                 let vtx11 = new mathis.Vertex().setPosition(-0, 0, 0);
        //                 let vtx12 = new mathis.Vertex().setPosition(1.5, -1.5, 0);
        //
        //                 mamesh = new mathis.Mamesh();
        //                 mamesh.vertices.push(vtx1, vtx2, vtx3, vtx4, vtx5, vtx6, vtx7, vtx8, vtx9, vtx10, vtx11, vtx12);
        //
        //                 /** links **/
        //                 vtx1.setOneLink(vtx2);
        //                 vtx2.setOneLink(vtx1);
        //                 vtx2.setOneLink(vtx3);
        //                 vtx3.setOneLink(vtx2);
        //                 vtx3.setOneLink(vtx4);
        //                 vtx4.setOneLink(vtx3);
        //                 vtx4.setOneLink(vtx5);
        //                 vtx5.setOneLink(vtx4);
        //                 vtx5.setOneLink(vtx6);
        //                 vtx6.setOneLink(vtx5);
        //                 vtx6.setOneLink(vtx7);
        //                 vtx7.setOneLink(vtx6);
        //                 vtx7.setOneLink(vtx8);
        //                 vtx8.setOneLink(vtx7);
        //                 vtx8.setOneLink(vtx9);
        //                 vtx9.setOneLink(vtx8);
        //                 vtx9.setOneLink(vtx1);
        //                 vtx1.setOneLink(vtx9);
        //                 vtx10.setOneLink(vtx1);
        //                 vtx1.setOneLink(vtx10);
        //                 vtx10.setOneLink(vtx2);
        //                 vtx2.setOneLink(vtx10);
        //                 vtx10.setOneLink(vtx9);
        //                 vtx9.setOneLink(vtx10);
        //                 vtx11.setOneLink(vtx4);
        //                 vtx4.setOneLink(vtx11);
        //                 vtx11.setOneLink(vtx8);
        //                 vtx8.setOneLink(vtx11);
        //                 vtx11.setOneLink(vtx10);
        //                 vtx10.setOneLink(vtx11);
        //                 vtx12.setOneLink(vtx6);
        //                 vtx6.setOneLink(vtx12);
        //                 vtx12.setOneLink(vtx8);
        //                 vtx8.setOneLink(vtx12);
        //
        //                 /** faces **/
        //                 mamesh.addATriangle(vtx1, vtx2, vtx10);
        //                 mamesh.addATriangle(vtx1, vtx9, vtx10);
        //                 mamesh.addASquare(vtx9, vtx10, vtx11, vtx8);
        //                 mamesh.addASquare(vtx8, vtx7, vtx6, vtx12);
        //
        //             }
        //                 break
        //
        //             case 'Half-cylinder': {
        //                 /** half-cylinder **/
        //
        //                 let creator = new mathis.reseau.TriangulatedPolygone(10);
        //                 creator.nbSubdivisionInARadius = 5;
        //                 creator.origin = new mathis.XYZ(-Math.PI * 0.8, -1, 0);
        //                 creator.end = new mathis.XYZ(+Math.PI * 0.8, 1, 0);
        //                 mamesh = creator.go();
        //                 mamesh.smallestTriangles = [];
        //
        //                 for (let _i = 0, _a = mamesh.vertices; _i < _a.length; _i++) {
        //                     let vertex = _a[_i];
        //                     let u = vertex.position.x;
        //                     let v = vertex.position.y;
        //                     vertex.position.x = Math.cos(u);
        //                     vertex.position.y = Math.sin(u);
        //                     vertex.position.z = v;
        //                 }
        //             }
        //                 break
        //
        //             case 'Moebius': {
        //                 /** moebius ring **/
        //
        //                 let basis = new mathis.reseau.BasisForRegularReseau();
        //                 basis.origin = new mathis.XYZ(0, -1, 0);
        //                 basis.end = new mathis.XYZ(2 * Math.PI, 1, 0);
        //                 basis.nbU = 20;
        //                 basis.nbV = 10;
        //                 let creator = new mathis.reseau.Regular2d(basis);
        //                 creator.makeTriangleOrSquare = false;
        //                 mamesh = creator.go();
        //                 for (let _i = 0, _a = mamesh.vertices; _i < _a.length; _i++) {
        //                     let vertex = _a[_i];
        //                     let u = vertex.position.x;
        //                     let v = vertex.position.y;
        //                     vertex.position.x = (2 - v * Math.sin(u / 2)) * Math.sin(u);
        //                     vertex.position.y = (2 - v * Math.sin(u / 2)) * Math.cos(u);
        //                     vertex.position.z = v * Math.cos(u / 2);
        //                 }
        //
        //             }
        //                 break
        //
        //             case 'Grat&glue 1': {
        //
        //                 /** Grating and gluing example 1**/
        //                 let vertices0 = [];
        //                 let vertices1 = [];
        //                 let mamesh1;
        //                 let basis0 = new mathis.reseau.BasisForRegularReseau();
        //                 basis0.origin = new mathis.XYZ(-1, -0.9, 0);
        //                 basis0.end = new mathis.XYZ(-0.05, 1.1, 0);
        //                 basis0.nbU = 5;
        //                 basis0.nbV = 10;
        //                 mamesh = new mathis.reseau.Regular2d(basis0).go();
        //                 let basis1 = new mathis.reseau.BasisForRegularReseau();
        //                 basis1.origin = new mathis.XYZ(0.05, -1, 0);
        //                 basis1.end = new mathis.XYZ(1, 1, 0);
        //                 basis1.nbU = 5;
        //                 basis1.nbV = 10;
        //                 mamesh1 = new mathis.reseau.Regular2d(basis1).go();
        //                 vertices0 = mamesh.vertices;
        //                 vertices1 = mamesh1.vertices;
        //                 new mathis.spacialTransformations.Similitude(mamesh1.vertices, 2 * Math.PI * 0.01).goChanging();
        //                 let map;
        //                 let mapFinder = new mathis.grateAndGlue.FindSickingMapFromVertices(vertices0, vertices1);
        //                 mapFinder.proximityCoef = 0.9;
        //
        //                 mapFinder.toleranceToBeOneOfTheClosest = 0.05;
        //                 map = mapFinder.go();
        //                 let sticker = new mathis.grateAndGlue.Sticker(mamesh, mamesh1, map);
        //                 sticker.goChanging();
        //
        //             }
        //                 break
        //
        //             case 'Grat&glue small': {
        //
        //                 /** Grating and gluing example 2**/
        //                 let creator0 = new reseau.TriangulatedPolygone(6);
        //                 creator0.origin = new XYZ(-1, -1, 0);
        //                 creator0.end = new XYZ(0.5, 0.5, 0);
        //                 creator0.nbSubdivisionInARadius = 1;
        //                 let mamesh0 = creator0.go();
        //                 let creator1 = new reseau.TriangulatedPolygone(6);
        //                 creator1.origin = new XYZ(-0.5, -0.5, 0);
        //                 creator1.end = new XYZ(1, 1, 0);
        //                 creator1.nbSubdivisionInARadius = 1;
        //                 let mamesh1 = creator1.go();
        //                 let graterAndSticker = new grateAndGlue.ConcurrentMameshesGraterAndSticker();
        //                 graterAndSticker.addMissingPolygons=false
        //                 graterAndSticker.IN_mameshes.push(mamesh0, mamesh1);
        //                 graterAndSticker.justGrateDoNotStick = false;
        //                 graterAndSticker.SUB_grater.proportionOfSeeds = [0.1, 0.1];
        //                 graterAndSticker.proximityCoefToStick = [2];
        //                 graterAndSticker.toleranceToBeOneOfTheClosest = 0.5;
        //                 graterAndSticker.suppressLinksAngularlyTooClose = false;
        //                 graterAndSticker.SUB_linkCleanerByAngle.suppressLinksAngularParam = 2 * Math.PI * 0.1;
        //
        //                 graterAndSticker.justGrateDoNotStick=true
        //
        //
        //                 mamesh = graterAndSticker.goChanging()
        //
        //                 cc(mamesh.toString())
        //
        //
        //             }
        //                 break
        //
        //             case 'Grat&glue 2': {
        //
        //                 /** Grating and gluing example 2**/
        //                 let creator0 = new reseau.TriangulatedPolygone(6);
        //                 creator0.origin = new XYZ(-1, -1, 0);
        //                 creator0.end = new XYZ(0.5, 0.5, 0);
        //                 creator0.nbSubdivisionInARadius = 9;
        //                 let mamesh0 = creator0.go();
        //                 let creator1 = new reseau.TriangulatedPolygone(6);
        //                 creator1.origin = new XYZ(-0.5, -0.5, 0);
        //                 creator1.end = new XYZ(1, 1, 0);
        //                 creator1.nbSubdivisionInARadius = 5;
        //                 let mamesh1 = creator1.go();
        //                 let graterAndSticker = new grateAndGlue.ConcurrentMameshesGraterAndSticker();
        //                 graterAndSticker.addMissingPolygons=false
        //
        //                 graterAndSticker.IN_mameshes.push(mamesh0, mamesh1);
        //                 graterAndSticker.justGrateDoNotStick = false;
        //                 graterAndSticker.SUB_grater.proportionOfSeeds = [0.1, 0.1];
        //                 graterAndSticker.proximityCoefToStick = [2];
        //                 graterAndSticker.toleranceToBeOneOfTheClosest = 0.5;
        //                 graterAndSticker.suppressLinksAngularlyTooClose = false;
        //                 graterAndSticker.SUB_linkCleanerByAngle.suppressLinksAngularParam = 2 * Math.PI * 0.1;
        //
        //                 mamesh = graterAndSticker.goChanging()
        //             }
        //                 break
        //
        //             case 'nothingToDo': {
        //
        //
        //                 let creator1 = new reseau.Regular2dPlus()
        //                 mamesh = creator1.go()
        //
        //                 let creator2 = new reseau.Regular2dPlus()
        //                 creator2.origin = new XYZ(3, 0, 0)
        //                 creator2.end = new XYZ(4, 1, 0)
        //                 let mamesh2 = creator2.go()
        //
        //                 for (let v of mamesh2.vertices) {
        //                     mamesh.vertices.push(v)
        //                 }
        //                 for (let v of mamesh2.smallestSquares) mamesh.smallestSquares.push(v)
        //
        //             }
        //                 break
        //
        //             case 'bugged': {
        //                 let creator0 = new reseau.TriangulatedPolygone(6);
        //                 creator0.origin = new XYZ(-1, -1, 0);
        //                 creator0.end = new XYZ(0.5, 0.5, 0);
        //                 creator0.nbSubdivisionInARadius = 9;
        //                 let mamesh0 = creator0.go();
        //
        //                 let creator1 = new reseau.TriangulatedPolygone(6);
        //                 creator1.origin = new XYZ(-0.5, -0.5, 0);
        //                 creator1.end = new XYZ(1, 1, 0);
        //                 creator1.nbSubdivisionInARadius = 5;
        //                 let mamesh1 = creator1.go();
        //
        //                 let graterAndSticker = new grateAndGlue.ConcurrentMameshesGraterAndSticker();
        //                 graterAndSticker.IN_mameshes.push(mamesh0, mamesh1);
        //                 graterAndSticker.justGrateDoNotStick = true;
        //                 graterAndSticker.SUB_grater.proportionOfSeeds = [0.1, 0.1];
        //                 graterAndSticker.proximityCoefToStick = [2];
        //                 graterAndSticker.toleranceToBeOneOfTheClosest = 0.5;
        //                 graterAndSticker.suppressLinksAngularlyTooClose = false;
        //                 graterAndSticker.SUB_linkCleanerByAngle.suppressLinksAngularParam = 2 * Math.PI * 0.1;
        //
        //                 mamesh = graterAndSticker.goChanging()
        //
        //             }
        //                 break
        //
        //         }
        //         //$$$eh
        //
        //
        //         //$$$begin
        //         let normalComputer=new surfaceConnection.NormalComputerFromLinks(mamesh)
        //         let doIt=this.doIt
        //         let vertexToNormal
        //         let avant=Date.now()
        //         if(doIt) vertexToNormal=normalComputer.go()
        //         this.mathisFrame.messageDiv.append("duration of normal computation:"+(Date.now()-avant))
        //         //$$$end
        //
        //         //$$$bh visualization
        //         let verticesViewer = new mathis.visu3d.VerticesViewer(mamesh, this.mathisFrame.scene);
        //         verticesViewer.go();
        //
        //
        //         let linksViewer = new mathis.visu3d.LinksViewer(mamesh, this.mathisFrame.scene);
        //         linksViewer.go();
        //
        //         let surfaceViewer = new mathis.visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene);
        //         surfaceViewer.go();
        //
        //         if (doIt) {
        //
        //             for (let vert of mamesh.vertices) {
        //                 creation3D.drawOneVector(XYZ.newFrom(vertexToNormal.getValue(vert)), this.mathisFrame.scene, vert.position)
        //             }
        //         }
        //
        //
        //
        //             let flager=new visu3d.VerticesFlager(mamesh,this.mathisFrame.scene)
        //             flager.decayProp=new XYZ(0.3,0.3,0)
        //             flager.go()
        //
        //
        //
        //         //$$$eh
        //     }
        // }




    }
}