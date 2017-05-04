/**
 * Created by vigon on 01/02/2017.
 */
/**
 * Created by vigon on 05/12/2016.
 */


module mathis {

    export module documentation {


        export class GrateMergeStick implements OnePage{

            pageIdAndTitle="Grating and gluing"
            severalParts:SeveralParts

            constructor(private mathisFrame:MathisFrame) {
                let several = new SeveralParts()
                several.addPart(new GrateGluedMamesh(this.mathisFrame))
                several.addPart(new GrateMamesh(this.mathisFrame))
                several.addPart(new GrateMameshConcentric(this.mathisFrame),true)
                several.addPart(new MergeVersusStick(this.mathisFrame))
                this.severalParts=several
            }

            go() {
                return this.severalParts.go()
            }

        }


        class GrateMamesh implements PieceOfCode {

            $$$name = "GrateMamesh"
            $$$title =  `When two mameshes overlap (they are concurrent), we could want to grate them to suppress overlapping.  
            Grating process starts from seeds: each concurrent have some given (or computed) seeds which are keep (and represented here as red bullet). 
            Around these seeds, we compute strates, and we keep their cell, until strates of concurrent overlap`


            nbSides0=6
            $$$nbSides0=[4,6,8,10]

            nbSides1=6
            $$$nbSides1=[4,6,8,10]

            nbSubdivisionInARadius0=9
            $$$nbSubdivisionInARadius0=[3,5,7,9,11]

            nbSubdivisionInARadius1=5
            $$$nbSubdivisionInARadius1=[3,5,7,9,11]
            
            grate=true
            $$$grate=[true,false]

            neighborhoodCoefficient0=0.7
            $$$neighborhoodCoefficient0=[0.5,0.7,1,2]

            neighborhoodCoefficient1=0.7
            $$$neighborhoodCoefficient1=[0.5,0.7,1,2]


            proportionOfSeed0=0.1
            $$$proportionOfSeed0=[0.01,0.1,0.3,0.5,0.7]
            proportionOfSeed1=0.1
            $$$proportionOfSeed1=[0.1,0.3,0.5,0.7]

            seedComputedFromBarycentersVersusFromAllPossibleCells=true
            $$$seedComputedFromBarycentersVersusFromAllPossibleCells=[true,false]

            addAsymetry=false
            $$$addAsymetry=[true,false]

            asyDirection0=-1
            $$$asyDirection0=[-1,1]
            asyDirection1=-1
            $$$asyDirection1=[-1,1]
            asyInfluence0=0.5
            $$$asyInfluence0=[0.1,0.5,1]
            asyInfluence1=0.5
            $$$asyInfluence1=[0.1,0.5,1]

            modulo0=null
            $$$modulo0=[null,1.5,0.7]
            modulo1=null
            $$$modulo1=[null,1.5,0.7]



            constructor(private mathisFrame:MathisFrame) {
                this.mathisFrame = mathisFrame

            }

            goForTheFirstTime() {

                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()
                this.go()
            }

            go(){


                this.mathisFrame.clearScene(false, false)


                //$$$bh creation of the 2 mamesh
                let creator0 = new reseau.TriangulatedPolygone(this.nbSides0)
                creator0.origin = new XYZ(-1,-1 , 0)
                creator0.end = new XYZ(0.5,0.5, 0)
                creator0.nbSubdivisionInARadius = this.nbSubdivisionInARadius0
                let mamesh0 = creator0.go()

                let creator1 = new reseau.TriangulatedPolygone(this.nbSides1)
                creator1.origin = new XYZ(-0.5,-0.5 , 0)
                creator1.end = new XYZ(1,1, 0)
                creator1.nbSubdivisionInARadius = this.nbSubdivisionInARadius1
                let mamesh1 = creator1.go()
                //$$$eh

                //$$$begin
                let grater:grateAndGlue.GraphGrater=null
                if (this.grate){
                    grater=new grateAndGlue.GraphGrater()
                    grater.IN_graphFamily.push(mamesh0.vertices,mamesh1.vertices)
                    //n
                    /** this params determine the neighborhood of each graph (this param are proportions)
                     * If too small, cells could penetrate each others.
                     * E.g keep all the defaults, and set the first number to 0.5*/
                    grater.proximityCoefToGrate=[this.neighborhoodCoefficient0,this.neighborhoodCoefficient1]
                    /** There are two ways to select seeds :
                     * --- if seedComputedFromBarycenters : seeds are vertices the farthest of barycenter of concurrents.
                     * --- is seedComputedFromAllPossibleCell : seeds are all vertices which is not to close to a concurrent.*/
                    grater.seedComputedFromBarycentersVersusFromAllPossibleCells=this.seedComputedFromBarycentersVersusFromAllPossibleCells
                    /**Determine the proportion of seeds of each concurrent: only useful is previous attribute is true*/
                    grater.proportionOfSeeds=[this.proportionOfSeed0,this.proportionOfSeed1]


                    if (this.addAsymetry) {
                        /**to change the localisation of seeds.
                         * --- direction: pull the seeds in this direction
                         * --- influence: influence of this direction against the 'natural' direction of seed
                         * --- modulo (optional): allow to pull seeds in several directions
                         * */
                        grater.asymmetriesForSeeds = [
                            {direction: new XYZ(this.asyDirection0, 0, 0), influence: this.asyInfluence0,modulo:this.modulo0},
                            {direction: new XYZ(0, this.asyDirection1, 0), influence: this.asyInfluence1,modulo:this.modulo1}]
                    }

                    let remainingVertices=grater.go()

                    //n
                    mamesh0=new grateAndGlue.SubMameshExtractor(mamesh0,remainingVertices[0]).go()
                    mamesh0.isolateMameshVerticesFromExteriorVertices()
                    mamesh1=new grateAndGlue.SubMameshExtractor(mamesh1,remainingVertices[1]).go()
                    mamesh1.isolateMameshVerticesFromExteriorVertices()

                }



                //$$$end



                //$$$bh visualization
                if (grater!=null) {
                    let verticesViewer0 = new visu3d.VerticesViewer(mamesh0, this.mathisFrame.scene)
                    verticesViewer0.vertices=grater.OUT_allSeeds[0]
                    verticesViewer0.color = new Color(Color.names.red)
                    verticesViewer0.go()


                    let verticesViewer1 = new visu3d.VerticesViewer(mamesh1, this.mathisFrame.scene)
                    verticesViewer1.vertices=grater.OUT_allSeeds[1]
                    verticesViewer1.color = new Color(Color.names.red)
                    verticesViewer1.go()

                }
                //n

                let linkViewer0=new visu3d.LinksViewer(mamesh0, this.mathisFrame.scene)
                linkViewer0.color=new Color(Color.names.darkseagreen)
                linkViewer0.go()

                let linkViewer1=new visu3d.LinksViewer(mamesh1, this.mathisFrame.scene)
                linkViewer1.color=new Color(Color.names.blueviolet)
                linkViewer1.go()


                //$$$eh
            }
        }




        class GrateMameshConcentric implements PieceOfCode {

            $$$name = "GrateMameshConcentric"
            $$$title =  `Variant with two concentric mameshes`


            nbSides0=6
            $$$nbSides0=[4,6,8,10]

            nbSides1=6
            $$$nbSides1=[4,6,8,10]

            nbSubdivisionInARadius0=9
            $$$nbSubdivisionInARadius0=[3,5,7,9,11]

            nbSubdivisionInARadius1=5
            $$$nbSubdivisionInARadius1=[3,5,7,9,11]

            grate=true
            $$$grate=[true,false]

            neighborhoodCoefficient0=0.7
            $$$neighborhoodCoefficient0=[0.5,0.7,1,2]

            neighborhoodCoefficient1=0.7
            $$$neighborhoodCoefficient1=[0.5,0.7,1,2]


            proportionOfSeed0=0.1
            $$$proportionOfSeed0=[0.1,0.3,0.5,0.7]
            proportionOfSeed1=0.1
            $$$proportionOfSeed1=[0.1,0.3,0.5,0.7]

            seedComputedFromBarycentersVersusFromAllPossibleCells=true
            $$$seedComputedFromBarycentersVersusFromAllPossibleCells=[true,false]


            constructor(private mathisFrame:MathisFrame) {
                this.mathisFrame = mathisFrame

            }

            goForTheFirstTime() {

                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()
                this.go()
            }

            go(){


                this.mathisFrame.clearScene(false, false)

                //$$$begin


                let creator0 = new reseau.TriangulatedPolygone(this.nbSides0)
                creator0.origin = new XYZ(-1,-1 , 0)
                creator0.end = new XYZ(1,1, 0)
                creator0.nbSubdivisionInARadius = this.nbSubdivisionInARadius0
                let mamesh0 = creator0.go()

                let creator1 = new reseau.TriangulatedPolygone(this.nbSides1)
                creator1.origin = new XYZ(-0.5,-0.5 , 0)
                creator1.end = new XYZ(0.5,0.5, 0)
                creator1.nbSubdivisionInARadius = this.nbSubdivisionInARadius1
                let mamesh1 = creator1.go()

                let grater:grateAndGlue.GraphGrater=null
                if (this.grate){
                    grater=new grateAndGlue.GraphGrater()
                    grater.IN_graphFamily.push(mamesh0.vertices,mamesh1.vertices)
                    //n

                    grater.proximityCoefToGrate=[this.neighborhoodCoefficient0,this.neighborhoodCoefficient1]
                    /** When a mamesh cover the other, the false option make disappear the covered one*/
                    grater.seedComputedFromBarycentersVersusFromAllPossibleCells=this.seedComputedFromBarycentersVersusFromAllPossibleCells
                    /**Determine the proportion of seeds of each concurrent: only useful is previous attribute is true*/
                    grater.proportionOfSeeds=[this.proportionOfSeed0,this.proportionOfSeed1]


                    let remainingVertices=grater.go()

                    //n
                    mamesh0=new grateAndGlue.SubMameshExtractor(mamesh0,remainingVertices[0]).go()
                    mamesh0.isolateMameshVerticesFromExteriorVertices()
                    mamesh1=new grateAndGlue.SubMameshExtractor(mamesh1,remainingVertices[1]).go()
                    mamesh1.isolateMameshVerticesFromExteriorVertices()

                }



                //$$$end



                //$$$bh visualization
                if (grater!=null) {
                    let verticesViewer0 = new visu3d.VerticesViewer(mamesh0, this.mathisFrame.scene)
                    verticesViewer0.vertices=grater.OUT_allSeeds[0]
                    verticesViewer0.color = new Color(Color.names.red)
                    verticesViewer0.go()


                    let verticesViewer1 = new visu3d.VerticesViewer(mamesh1, this.mathisFrame.scene)
                    verticesViewer1.vertices=grater.OUT_allSeeds[1]
                    verticesViewer1.color = new Color(Color.names.red)
                    verticesViewer1.go()

                }
                //n


                let linkViewer0=new visu3d.LinksViewer(mamesh0, this.mathisFrame.scene)
                linkViewer0.color=new Color(Color.names.darkseagreen)
                linkViewer0.go()

                let linkViewer1=new visu3d.LinksViewer(mamesh1, this.mathisFrame.scene)
                linkViewer1.color=new Color(Color.names.blueviolet)
                linkViewer1.go()


                //$$$eh
            }
        }



        class GrateGluedMamesh implements PieceOfCode {

            $$$name = "GrateGluedMamesh"
            $$$title =  `When two mameshes overlap (they are concurrent), we could want to grate them and to stick them.  
            Techniques for grating and Sticking are detail further on.`


            nbSides0=6
            $$$nbSides0=[4,6,8,10]

            nbSides1=6
            $$$nbSides1=[4,6,8,10]

            nbSubdivisionInARadius0=9
            $$$nbSubdivisionInARadius0=[3,5,7,9,11]

            nbSubdivisionInARadius1=5
            $$$nbSubdivisionInARadius1=[3,5,7,9,11]


            toleranceToBeOneOfTheClosest=0.5
            $$$toleranceToBeOneOfTheClosest=[0,0.1,0.2,0.3,0.4,0.5,0.6,0.7]


            proportionOfSeed0=0.1
            $$$proportionOfSeed0=[0.1,0.3,0.5,0.7]
            proportionOfSeed1=0.1
            $$$proportionOfSeed1=[0.1,0.3,0.5,0.7]

            proximityCoefToStick=2
            $$$proximityCoefToStick=[1,1.5,2,3]

            suppressLinksAngularlyTooClose=false
            $$$suppressLinksAngularlyTooClose=[true,false]


            propAngle=0.1
            $$$propAngle=[0.01,0.05,0.1,0.2,0.3]


            justGrateDoNotStick=false
            $$$justGrateDoNotStick=[true,false]




            constructor(private mathisFrame:MathisFrame) {
                this.mathisFrame = mathisFrame

            }

            goForTheFirstTime() {

                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()
                this.go()
            }

            go(){


                this.mathisFrame.clearScene(false, false)

                
                //$$$bh mameshes creation
                let creator0 = new reseau.TriangulatedPolygone(this.nbSides0)
                creator0.origin = new XYZ(-1,-1 , 0)
                creator0.end = new XYZ(0.5,0.5, 0)
                creator0.nbSubdivisionInARadius = this.nbSubdivisionInARadius0
                let mamesh0 = creator0.go()

                let creator1 = new reseau.TriangulatedPolygone(this.nbSides1)
                creator1.origin = new XYZ(-0.5,-0.5 , 0)
                creator1.end = new XYZ(1,1, 0)
                creator1.nbSubdivisionInARadius = this.nbSubdivisionInARadius1
                let mamesh1 = creator1.go()
                //$$$eh


                //$$$begin
                let graterAndSticker=new grateAndGlue.ConcurrentMameshesGraterAndSticker()
                graterAndSticker.IN_mameshes.push(mamesh0,mamesh1)

                graterAndSticker.justGrateDoNotStick=this.justGrateDoNotStick

                /**all attributes of the grating process (see above) could be ruled via this SUB_object. Here we just change one.*/
                graterAndSticker.SUB_grater.proportionOfSeeds=[this.proportionOfSeed0,this.proportionOfSeed1]


                /** Coef ruling the neighborhood zone of vertices.
                 *  More big is this coef, more we accept far neighbors,  and so more we stick far vertices */
                graterAndSticker.proximityCoefToStick=[this.proximityCoefToStick]

                /**if 0    -->  only the closest neighbor is stick
                 * if 0.10 -->  all vertices which are positioned up to 10% further than the closest are stick
                 * if 0.1  -->  ...
                 * be careful, if too big links can cross themselves:
                 * which can be solve by clearing links making too small angles each others.
                 * */
                graterAndSticker.toleranceToBeOneOfTheClosest=this.toleranceToBeOneOfTheClosest


                //n
                graterAndSticker.suppressLinksAngularlyTooClose=this.suppressLinksAngularlyTooClose
                /**links cleaning is made by a SUB object that we can parametrize: */
                graterAndSticker.SUB_linkCleanerByAngle.suppressLinksAngularParam=2*Math.PI*this.propAngle




                let mamesh=graterAndSticker.goChanging()

                //$$$end



                //$$$bh visualization

                let linkViewer0=new visu3d.LinksViewer(mamesh, this.mathisFrame.scene)
                linkViewer0.go()

                /**source vertices in blue*/
                let verticesViewerSource=new visu3d.VerticesViewer(mamesh,this.mathisFrame.scene)
                verticesViewerSource.vertices=graterAndSticker.OUT_stickingMap.allKeys()
                verticesViewerSource.color=new Color(Color.names.blueviolet)
                verticesViewerSource.go()

                /**receiver vertices in red*/
                let verticesViewer=new visu3d.VerticesViewer(mamesh,this.mathisFrame.scene)
                verticesViewer.vertices=[]
                for (let vertices of graterAndSticker.OUT_stickingMap.allValues()) {
                    verticesViewer.vertices=verticesViewer.vertices.concat(vertices)
                }
                verticesViewer.go()

                //$$$eh
            }
        }



        class MergeVersusStick implements PieceOfCode {

            $$$name = "MergeVersusStick"
            $$$title =  `Merging or Sticking mameshes`


            oneVersusTwoMameshes=false
            $$$oneVersusTwoMameshes=[true,false]


            toleranceToBeOneOfTheClosest=0.05
            $$$toleranceToBeOneOfTheClosest=[0,0.05,0.1,0.2,0.5,1,1.5,2]


            suppressLinksAngularlyTooClose=false
            $$$suppressLinksAngularlyTooClose=[true,false]


            stickOrMerge=true
            $$$stickOrMerge=[true,false]

            proximityCoef=1.2
            $$$proximityCoef=[0.2,0.5,0.8,1,1.2,1.5,2,3]

            angle=0.01
            $$$angle=[0,0.005,0.01,0.02,0.05]


            slow=true
            $$$slow=[true,false]


            resolution=10
            $$$resolution=[5,10,15,20]


            hole=0.97
            $$$hole=[0.8,0.9,0.95,0.97,0.99,1]



            constructor(private mathisFrame:MathisFrame) {
                this.mathisFrame = mathisFrame
            }

            goForTheFirstTime() {

                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()
                this.go()
            }

            go(){


                this.mathisFrame.clearScene(false, false)

                //$$$b
                let oneVersusTwoMameshes=this.oneVersusTwoMameshes

                //$$$e


                //$$$bh mameshes creation
                let vertices0=[]
                let vertices1=[]
                let mamesh0
                let mamesh1

                if (oneVersusTwoMameshes){



                    let basis=new reseau.BasisForRegularReseau()
                    basis.origin=new XYZ(0,-0.7,0)
                    basis.end=new XYZ(2*Math.PI,0.7,0)
                    basis.nbI=20
                    basis.nbJ=10
                    basis.nbHorizontalDecays=2

                    mamesh0  = new reseau.Regular(basis).go()
                    mamesh1  = mamesh0
                    for (let v of mamesh0.vertices) {
                        if (v.param.x==0) vertices0.push(v)
                        else if (v.param.x==basis.nbI-1) vertices1.push(v)
                    }


                    for (let i=0;i<mamesh0.vertices.length;i++){
                        let position=mamesh0.vertices[i].position
                        let theta=position.x*this.hole
                        position.x=Math.cos(theta-Math.PI/2)
                        position.z=Math.sin(theta-Math.PI/2)
                    }
                        }

                else {
                    let basis0 = new reseau.BasisForRegularReseau()
                    basis0.origin = new XYZ(-1, -0.9, 0)
                    basis0.end = new mathis.XYZ(-0.05, 1.1, 0)
                    basis0.nbI = 5
                    basis0.nbJ = 10
                    mamesh0  = new reseau.Regular(basis0).go()

                    let basis1 = new reseau.BasisForRegularReseau()
                    basis1.origin = new XYZ(0.05, -1, 0)
                    basis1.end = new mathis.XYZ(1, 1, 0)
                    basis1.nbI = 5
                    basis1.nbJ = 10
                    mamesh1 = new reseau.Regular(basis1).go()

                    vertices0=mamesh0.vertices
                    vertices1=mamesh1.vertices

                    /**with big angle, the two mameshes overlap, and the result is not nice
                     * -> we need to grate mameshes before (see further on)*/
                    new spacialTransformations.Similitude(mamesh1.vertices,2*Math.PI*this.angle).goChanging()
                }

                //$$$eh




                //$$$begin


                /**two ways for creating a map vertex->Vertex[] (source->receivers) to say which vertices are stick or merge with other */
                let map
                if (this.slow) {
                    let mapFinder = new grateAndGlue.FindSickingMapFromVertices(vertices0, vertices1)
                    /**if e.g. equal to 2, then two vertices are declared to be close when their distance is at most 2 times the mean distance of their link */
                    mapFinder.proximityCoef = this.proximityCoef
                    /**if equal to 0, in the map vertex->Vertex[] (source->receivers), receivers is a list of only one vertex : the closest one to the source.
                     * If equal to 2 (e.g.),receivers contain the closest vertices from source (let's say the distance is d)
                     * and also all the vertices at distance less that 2*d  */
                    mapFinder.toleranceToBeOneOfTheClosest = this.toleranceToBeOneOfTheClosest
                    map = mapFinder.go()
                }
                else{
                    /** A fast method: it creates a dictionary or approximative vertex-positions, which avoid a double loop over
                     * the two vertex-list. The proximity is parametrized by {@link FindCloseVerticesFast#nbDistinctPoint}
                     * which indicate how many different positions are allowed between the two extreme points (typically 1000).
                     * (imagine that it creates a sort of grid, as in classical drawing software). With very small values (e.g. 5)
                     * the behaviour is weird.
                     * */
                    let mapFinder=new grateAndGlue.FindCloseVerticesFast(vertices0,vertices1)
                    mapFinder.nbDistinctPoint=this.resolution
                    map=mapFinder.go()

                }
                //$$$e

                //$$$bh  Warning : vertices0 and vertices1 might be disjoint...
                /** Sources and Receiver must be disjoint for sticking or merging.
                 * In the present code, we have construct two lists vertices0 and vertices1 which are disjoints.
                 * You can give non-disjoint lists to {@link FindCloseVerticesFast} which make a choice to
                 * separate sources and receiver.
                 * You can also give non-disjoint list to {@link FindSickingMapFromVertices} but in this case
                 * you must set {@link FindSickingMapFromVertices#acceptOnlyDisjointReceiverAndSource} to false;
                 * and after you have to make yourself the separation between source and receiver*/

                //$$$eh

                //$$$b
                //n
                /**compare merging and sticking*/
                if (this.stickOrMerge) {
                    /**sticking : links are added from source to all its receivers*/
                    let sticker = new grateAndGlue.Sticker(mamesh0, mamesh1, map)
                    sticker.goChanging()
                }
                else {
                    /**merging : the source is sent to the first receiver (the closest) */
                    let merger = new grateAndGlue.Merger(mamesh0, mamesh1, map)
                    merger.goChanging()
                
                }

                //n
                if (this.suppressLinksAngularlyTooClose){
                    new linkModule.LinksSorterAndCleanerByAngles(mamesh0).goChanging()
                }
                
                //$$$end

                
                //$$$bh visualization

                let linkViewer0=new visu3d.LinksViewer(mamesh0, this.mathisFrame.scene)
                linkViewer0.go()

                new visu3d.SurfaceViewer(mamesh0,this.mathisFrame.scene).go()

                //$$$eh
            }
        }







    }
}