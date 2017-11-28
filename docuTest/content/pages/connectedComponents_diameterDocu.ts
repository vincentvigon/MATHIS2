/**
 * Created by vigon on 03/10/2017.
 */


/**
 * Created by vigon on 05/12/2016.
 */


module mathis {

    export module appli{


        export class ConnectedComponent_diameter implements OnePage{


            pageIdAndTitle="Connected component, diameter"
            severalParts:SeveralParts


            constructor(private mathisFrame:MathisFrame) {

                let several = new SeveralParts()



                // several.addPart(new GeodesicDocu(this.mathisFrame))
                //
                // several.addPart(new GeodesicGroupDocu(this.mathisFrame))
                //
                //
                // several.addPart(new CornerBorderCenterForPolygone(this.mathisFrame))
                //
                // several.addPart(new TwoGraphDistances(this.mathisFrame))
                several.addPart(new PercoForReseau(this.mathisFrame))
                several.addPart(new UnionFind(this.mathisFrame))


                several.addPart(new DiameterDocu(this.mathisFrame))






                this.severalParts=several
            }

            go() {
                return this.severalParts.go()
            }

        }




        class PercoForReseau implements PieceOfCode {

            NAME = "PercoForReseau"
            TITLE = "get a connected component "

            // marker=Vertex.Markers.border
            // $$$marker=new Choices([Vertex.Markers.border,Vertex.Markers.corner,Vertex.Markers.center],{"before":"Vertex.Markers.",visualValues:["border","corner","center"]})



            nbI=7
            $$$nbI=[3,7,15,30]

            probaToKeep=0.5
            $$$probaToKeep=[0,0.4,0.45,0.5,0.55,0.6,0.8,1]

            maille=reseau.Maille.quad
            $$$maille=new Choices(allIntegerValueOfEnume(reseau.Maille),{visualValues:allStringValueOfEnume(reseau.Maille)})

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
                let creator = new reseau.Regular2dPlus()
                creator.origin = new XYZ(-1, -1, 0)
                creator.end = new XYZ(1, 1, 0)
                creator.nbU = this.nbI
                creator.adaptVForRegularReseau=true
                creator.maille = this.maille

                let mamesh = creator.go()


                let probaToKeep=this.probaToKeep
                let admissibleForGroup=new HashMap<Vertex,boolean>(true)
                let centerVertices=[]

                for (let i=0;i<mamesh.vertices.length;i++){
                    let vertex=mamesh.vertices[i]
                    if (Math.random()<probaToKeep) admissibleForGroup.putValue(vertex,true)
                    if (vertex.hasMark(Vertex.Markers.center)) {
                        centerVertices.push(vertex)
                        admissibleForGroup.putValue(vertex,true)
                    }
                }


                let centralComponent=graph.getGroup(centerVertices,admissibleForGroup)
                //$$$end


                //$$$bh visualization
                let verticesViewer = new visu3d.VerticesViewer(mamesh, this.mathisFrame.scene)
                verticesViewer.vertices = centralComponent
                verticesViewer.radiusProp=0.5
                verticesViewer.go()
                //$$$eh

            }
        }




        class UnionFind implements PieceOfCode{

            NAME="UnionFind"
            TITLE="Getting all the connected component with the famous Union-find algorithm"

            nbLinks=30
            $$$nbLinks=[20,30,50,100]



            constructor(private mathisFrame:MathisFrame){
                this.mathisFrame=mathisFrame

            }

            goForTheFirstTime(){
                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()
                let camera=this.mathisFrame.getGrabberCamera()
                camera.changePosition(new XYZ(0,0,-5))
                this.go()
            }

            go(){

                this.mathisFrame.clearScene(false,false)

                //$$$bh we create a reseau with no link
                let creator=new reseau.Regular2dPlus()
                creator.nbU=8
                creator.nbV=8
                creator.makeLinks=false
                let mamesh = creator.go()
                //$$$eh



                //$$$b
                let unionFind=new general_algo.UnionFind<Vertex>()

                let random=new proba.Random(46765474657)



                let count=0
                while (count<this.nbLinks){
                    let vertex0=mamesh.vertices[random.pseudoRandInt(mamesh.vertices.length)]
                    let vertex1=mamesh.vertices[random.pseudoRandInt(mamesh.vertices.length)]
                    if (Math.abs(vertex0.param.x-vertex1.param.x)==1 && Math.abs(vertex0.param.y-vertex1.param.y)<2) {
                        //linksToAdd.putValue(Hash.segment(vertex0,vertex1),[vertex0,vertex1])
                        vertex0.setOneLink(vertex1)
                        vertex1.setOneLink(vertex0)

                        unionFind.union(vertex0,vertex1)
                        count++
                    }
                }


                let componentsDico=unionFind.get_components()
                let components=componentsDico.allValues()
                for (let index =0;index<components.length;index++){
                    let verticesViewer=new visu3d.VerticesViewer(components[index],this.mathisFrame.scene)
                    verticesViewer.color=new Color(index)
                    verticesViewer.radiusAbsolute=0.03
                    verticesViewer.go()
                }






                //$$$e





                //$$$bh links visualization
                /**if we made bifurcation, we make a colorIndex in order that two bifurcating lines have the same color*/
                let linksViewer=new visu3d.LinksViewer(mamesh,this.mathisFrame.scene)
                linksViewer.radiusAbsolute=0.01
                linksViewer.go()
                //$$$eh




            }
        }






        class DiameterDocu implements PieceOfCode {

            NAME = "DiameterDocu"
            TITLE = `Two methods to find the diameter of polygones. 1/ compute all distances between vertices which is long.
            2/ an heuristic iterative method. Be aware : If the graph is non-connected, this second method only look at the component of the first vertex.
            But if the graph is connected, it is hard to find a counter-example where the second method fails. 
            You can see such counter-example by fitting 4/9/0.3 as the three first parameters. `

            nbSides=4
            $$$nbSides=[4,6,8,10]
            nbSubdivisionInARadius=2
            $$$nbSubdivisionInARadius=[2,3,5,7,9,11]

            // marker=Vertex.Markers.border
            // $$$marker=new Choices([Vertex.Markers.border,Vertex.Markers.corner,Vertex.Markers.center],{"before":"Vertex.Markers.",visualValues:["border","corner","center"]})

            percolationProba=0.5
            $$$percolationProba=[0.2,0.3,0.4,0.5,0.6,0.7,0.8]

            methodChoice=true
            $$$methodChoice=[true,false]

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
                let mathisFrame=this.mathisFrame

                //$$$begin


                let  creator = new reseau.TriangulatedPolygone(this.nbSides)
                creator.origin = new XYZ(-1, -1, 0)
                creator.end = new XYZ(1, 1, 0)
                creator.nbSubdivisionInARadius = this.nbSubdivisionInARadius


                let mamesh = creator.go()

                let random=new proba.Random()
                for (let i=0;i<mamesh.vertices.length;i++){
                    let vertex=mamesh.vertices[i]
                    for (let j=0;j<vertex.links.length;j++){
                        if(random.pseudoRand()<this.percolationProba) Vertex.separateTwoVoisins(vertex,vertex.links[j].to)
                    }
                }



                let diameter:number
                let someExtremeVertices:Vertex[]
                let startingTime=window.performance.now()
                let duration:number
                if (this.methodChoice){
                    let distances=new graph.DistancesBetweenAllVertices(mamesh.vertices)
                    distances.go()
                    duration=window.performance.now()-startingTime
                    diameter=distances.OUT_diameter
                    someExtremeVertices=distances.OUT_allExtremeVertex
                }
                else {
                    let diameterComputer=new graph.HeuristicDiameter(mamesh.vertices)
                    diameter=diameterComputer.go()
                    duration=window.performance.now()-startingTime
                    someExtremeVertices=diameterComputer.OUT_twoChosenExtremeVertices
                }
                mathisFrame.messageDiv.append("diameter:"+diameter+", computed in:"+duration+" ms")


                //n

                //$$$end


                //$$$bh visualization
                let verticesViewer0 = new visu3d.VerticesViewer(mamesh, this.mathisFrame.scene)
                verticesViewer0.vertices = someExtremeVertices
                verticesViewer0.color = new Color(Color.names.indianred)
                verticesViewer0.go()

                //n
                new visu3d.LinksViewer(mamesh, this.mathisFrame.scene).go()
                //$$$eh
            }
        }


        //
        //
        // class GeodesicDocu implements PieceOfCode {
        //
        //     NAME = "GeodesicDocu"
        //     TITLE = "Compute distances and geodesics between vertices"
        //
        //     nbSides=4
        //     $$$nbSides=[4,6,8,10]
        //     nbSubdivisionInARadius=7
        //     $$$nbSubdivisionInARadius=[3,5,7,9,11]
        //
        //     // marker=Vertex.Markers.border
        //     // $$$marker=new Choices([Vertex.Markers.border,Vertex.Markers.corner,Vertex.Markers.center],{"before":"Vertex.Markers.",visualValues:["border","corner","center"]})
        //
        //     randomSeed=38434
        //     $$$randomSeed=[38434,984651,3481,9846513,684123]
        //
        //     onlyOneGeodesic=false
        //     $$$onlyOneGeodesic=[true,false]
        //     //
        //     // useGraphDistanceVersusDistanceVersusLinkWeights=0
        //     // $$$useGraphDistanceVersusDistanceVersusLinkWeights=[0,1,2]
        //
        //
        //     _distanceBetweenSelectedVertices:number
        //     _nbVerticesInSelectedGeodesics:number
        //     _graphDiameter:number
        //
        //
        //     constructor(private mathisFrame:MathisFrame) {
        //         this.mathisFrame = mathisFrame
        //
        //     }
        //
        //     goForTheFirstTime() {
        //
        //         this.mathisFrame.clearScene()
        //         this.mathisFrame.addDefaultCamera()
        //         this.mathisFrame.addDefaultLight()
        //         this.go()
        //     }
        //
        //     go(){
        //
        //
        //         this.mathisFrame.clearScene(false, false)
        //         let mathisFrame=this.mathisFrame
        //
        //         //$$$begin
        //
        //
        //         let  creator = new reseau.TriangulatedPolygone(this.nbSides)
        //         creator.origin = new XYZ(-1, -1, 0)
        //         creator.end = new XYZ(1, 1, 0)
        //         creator.nbSubdivisionInARadius = this.nbSubdivisionInARadius
        //
        //
        //         let mamesh = creator.go()
        //
        //
        //         let distances=new graph.DistancesBetweenAllVertices(mamesh.vertices)
        //         distances.go()
        //
        //         let random=new proba.Random(this.randomSeed)
        //
        //         let vertex0=mamesh.vertices[random.pseudoRandInt(mamesh.vertices.length)]
        //         let vertex1=mamesh.vertices[random.pseudoRandInt(mamesh.vertices.length)]
        //
        //         mathisFrame.messageDiv.append("distance between vertex0 and vertex1:"+distances.OUT_distance(vertex0,vertex1))
        //         mathisFrame.messageDiv.append("graph diameter:"+distances.OUT_diameter)
        //
        //
        //         let onlyOneGeodesic=this.onlyOneGeodesic
        //         let geodesics=distances.OUT_allGeodesics(vertex0,vertex1,onlyOneGeodesic)
        //
        //
        //
        //
        //         //n
        //
        //         //$$$end
        //
        //
        //
        //         //$$$bh visualization
        //
        //
        //         for (let i=0;i<geodesics.length;i++){
        //             let verticesViewer = new visu3d.VerticesViewer(mamesh, this.mathisFrame.scene)
        //             verticesViewer.vertices = geodesics[i]
        //             verticesViewer.color = new Color(new HSV_01(i/geodesics.length*0.7,1,1))
        //             verticesViewer.go()
        //
        //         }
        //
        //         new visu3d.LinksViewer(mamesh, this.mathisFrame.scene).go()
        //
        //         //$$$eh
        //
        //         //$$$bt
        //
        //         this._graphDiameter=distances.OUT_diameter
        //         this._distanceBetweenSelectedVertices=distances.OUT_distance(vertex0,vertex1)
        //         this._nbVerticesInSelectedGeodesics=0
        //         for (var i=0;i<geodesics.length;i++){
        //             this._nbVerticesInSelectedGeodesics+=geodesics[i].length
        //         }
        //
        //         //$$$et
        //
        //
        //
        //     }
        // }
        //
        //
        //
        // class GeodesicGroupDocu implements PieceOfCode {
        //
        //     NAME = "GeodesicGroupDocu"
        //     TITLE = "Compute distances and geodesics from a set of vertices"
        //
        //     nbSides=4
        //     $$$nbSides=[4,6,8,10]
        //     nbSubdivisionInARadius=7
        //     $$$nbSubdivisionInARadius=[3,5,7,9,11]
        //
        //     // marker=Vertex.Markers.border
        //     // $$$marker=new Choices([Vertex.Markers.border,Vertex.Markers.corner,Vertex.Markers.center],{"before":"Vertex.Markers.",visualValues:["border","corner","center"]})
        //
        //     // randomSeed=38434
        //     // $$$randomSeed=[38434,984651,3481,9846513,684123]
        //
        //     onlyOneGeodesic=false
        //     $$$onlyOneGeodesic=[true,false]
        //
        //
        //     left=-0.3
        //     $$$left=[-0.9,-0.7,-0.5,-0.3,-0.1]
        //     right=0.3
        //     $$$right=[0.1,0.3,0.5,0.7,0.9]
        //
        //
        //     _distance:number
        //     _nbVerticesInSelectedGeodesics:number
        //
        //
        //     constructor(private mathisFrame:MathisFrame) {
        //         this.mathisFrame = mathisFrame
        //
        //     }
        //
        //     goForTheFirstTime() {
        //
        //         this.mathisFrame.clearScene()
        //         this.mathisFrame.addDefaultCamera()
        //         this.mathisFrame.addDefaultLight()
        //         this.go()
        //     }
        //
        //     go(){
        //
        //
        //         this.mathisFrame.clearScene(false, false)
        //         let mathisFrame=this.mathisFrame
        //
        //         //$$$begin
        //
        //
        //         let  creator = new reseau.TriangulatedPolygone(this.nbSides)
        //         creator.origin = new XYZ(-1, -1, 0)
        //         creator.end = new XYZ(1, 1, 0)
        //         creator.nbSubdivisionInARadius = this.nbSubdivisionInARadius
        //
        //         let mamesh = creator.go()
        //
        //         let group=[]
        //         let singleVertex:Vertex
        //         for (let i=0;i<mamesh.vertices.length;i++){
        //             let vertex=mamesh.vertices[i]
        //             if (vertex.position.x<this.left) group.push(vertex)
        //             if (vertex.position.x>this.right) singleVertex=vertex
        //         }
        //
        //
        //         let distances=new graph.DistancesFromAGroup(group)
        //         distances.go()
        //
        //         mathisFrame.messageDiv.append("distance between vertex and group:"+distances.OUT_distance(singleVertex))
        //
        //         let onlyOneGeodesic=this.onlyOneGeodesic
        //         let geodesics=distances.OUT_allGeodesics(singleVertex,onlyOneGeodesic)
        //
        //
        //         //n
        //
        //         //$$$end
        //
        //
        //
        //         //$$$bh visualization
        //
        //
        //         for (let i=0;i<geodesics.length;i++){
        //             let verticesViewer = new visu3d.VerticesViewer(mamesh, this.mathisFrame.scene)
        //             verticesViewer.vertices = geodesics[i]
        //             verticesViewer.color = new Color(new HSV_01(i/geodesics.length*0.7,1,1))
        //             verticesViewer.go()
        //         }
        //
        //         let linksViewer=new visu3d.LinksViewer(mamesh, this.mathisFrame.scene)
        //         linksViewer.segmentOrientationFunction=function (vertex0,vertex1){
        //             if (group.indexOf(vertex0)!=-1&&group.indexOf(vertex1)!=-1) return 1
        //             else return 0
        //         }
        //         linksViewer.color=new Color(Color.names.red)
        //         linksViewer.radiusProp=0.08
        //         linksViewer.go()
        //
        //
        //
        //         new visu3d.LinksViewer(mamesh, this.mathisFrame.scene).go()
        //         //$$$eh
        //
        //
        //         //$$$bt
        //         this._distance=geodesics.length-1
        //         this._nbVerticesInSelectedGeodesics=0
        //         for (var i=0;i<geodesics.length;i++){
        //             this._nbVerticesInSelectedGeodesics+=geodesics[i].length
        //         }
        //         //$$$et
        //
        //
        //
        //     }
        // }
        //
        //
        //
        //
        // class CornerBorderCenterForPolygone implements PieceOfCode {
        //
        //     NAME = "CornerBorderCenterForPolygone"
        //     TITLE = "find some marked vertices and their Neighbors "
        //
        //
        //     nbSides=6
        //     $$$nbSides=[4,6,8,10]
        //     nbSubdivisionInARadius=5
        //     $$$nbSubdivisionInARadius=[3,5,7,9,11]
        //
        //     marker=Vertex.Markers.border
        //     $$$marker=new Choices([Vertex.Markers.border,Vertex.Markers.corner,Vertex.Markers.center],{"before":"Vertex.Markers.",visualValues:["border","corner","center"]})
        //
        //     justOneTime=true
        //     $$$justOneTime=[true,false]
        //
        //     polygoneVersusReseau=true
        //     $$$polygoneVersusReseau=[true,false]
        //
        //     maille=reseau.Maille.quad
        //     $$$maille=new Choices(allIntegerValueOfEnume(reseau.Maille),{visualValues:allStringValueOfEnume(reseau.Maille)})
        //
        //     nbI=7
        //     $$$nbI=[3,7,15,30]
        //
        //     _strateLengths:number[]
        //
        //     constructor(private mathisFrame:MathisFrame) {
        //         this.mathisFrame = mathisFrame
        //
        //     }
        //
        //     goForTheFirstTime() {
        //
        //         this.mathisFrame.clearScene()
        //         this.mathisFrame.addDefaultCamera()
        //         this.mathisFrame.addDefaultLight()
        //         this.go()
        //     }
        //
        //     go(){
        //
        //
        //         this.mathisFrame.clearScene(false, false)
        //
        //
        //         //$$$bh
        //         let creator
        //         if (this.polygoneVersusReseau) {
        //             creator = new reseau.TriangulatedPolygone(this.nbSides)
        //             creator.origin = new XYZ(-1, -1, 0)
        //             creator.end = new XYZ(1, 1, 0)
        //             creator.nbSubdivisionInARadius = this.nbSubdivisionInARadius
        //         }
        //         else {
        //
        //             creator = new reseau.Regular2dPlus()
        //             creator.origin = new XYZ(-1, -1, 0)
        //             creator.end = new XYZ(1, 1, 0)
        //             creator.nbU = this.nbI
        //             creator.adaptVForRegularReseau = true
        //             creator.maille = this.maille
        //         }
        //         //$$$eh
        //
        //
        //         //$$$begin
        //
        //         let mamesh = creator.go()
        //
        //
        //
        //         let markedVertex = []
        //         for (let i=0;i<mamesh.vertices.length;i++){
        //             let vertex=mamesh.vertices[i]
        //             if (vertex.hasMark(this.marker)) markedVertex.push(vertex)
        //         }
        //         var strates=[]
        //         strates.push(markedVertex)
        //
        //         if(this.justOneTime){
        //             strates.push(graph.getEdge(markedVertex))
        //         }
        //         else{
        //             let alreadySeen=new HashMap<Vertex,boolean>()
        //             let curentEdge=markedVertex
        //             while (curentEdge.length>0){
        //                 curentEdge=graph.getEdge(curentEdge,alreadySeen)
        //                 strates.push(curentEdge)
        //             }
        //         }
        //
        //
        //
        //         //$$$end
        //
        //
        //
        //         //$$$bh visualization
        //         for (let i=0;i<strates.length;i++){
        //             let verticesViewer0 = new visu3d.VerticesViewer(mamesh, this.mathisFrame.scene)
        //             verticesViewer0.vertices = strates[i]
        //             verticesViewer0.color = new Color(i)
        //             verticesViewer0.go()
        //         }
        //
        //
        //
        //         new visu3d.LinksViewer(mamesh, this.mathisFrame.scene).go()
        //         //$$$eh
        //
        //         //$$$bt
        //         this._strateLengths=[]
        //         for (var i=0;i<strates.length;i++){
        //             this._strateLengths[i]=strates[i].length
        //         }
        //         //$$$et
        //
        //
        //
        //     }
        // }
        //
        // //
        // // class CornerBorderCenterForReseau implements PieceOfCode {
        // //
        // //     $$$name = "CornerBorderCenterForReseau"
        // //     $$$title = "variant with a regular reseau "
        // //
        // //     marker=Vertex.Markers.border
        // //   $$$marker=new Choices([Vertex.Markers.border,Vertex.Markers.corner,Vertex.Markers.center],{"before":"Vertex.Markers.",visualValues:["border","corner","center"]})
        // //
        // //     squareVersusTriangleMaille=false
        // //     $$$squareVersusTriangleMaille=[true,false]
        // //
        // //     nbI=7
        // //     $$$nbI=[3,7,15,30]
        // //
        // //     constructor(private mathisFrame:MathisFrame) {
        // //         this.mathisFrame = mathisFrame
        // //
        // //     }
        // //
        // //     goForTheFirstTime() {
        // //
        // //         this.mathisFrame.clearScene()
        // //         this.mathisFrame.addDefaultCamera()
        // //         this.mathisFrame.addDefaultLight()
        // //         this.go()
        // //     }
        // //
        // //     go(){
        // //
        // //
        // //         this.mathisFrame.clearScene(false, false)
        // //
        // //         //$$$begin
        // //         let basisComputer = new reseau.BasisForRegularReseau()
        // //         basisComputer.origin = new XYZ(-1, -1, 0)
        // //         basisComputer.end = new XYZ(1, 1, 0)
        // //         basisComputer.nbI = this.nbI
        // //         basisComputer.set_nbJ_toHaveRegularReseau=true
        // //         basisComputer.squareMailleInsteadOfTriangle = this.squareVersusTriangleMaille
        // //         let creator = new reseau.Regular(basisComputer)
        // //
        // //         let mamesh = creator.go()
        // //
        // //
        // //         //n
        // //         let markedVertex = []
        // //         mamesh.vertices.forEach((vertex:Vertex)=> {
        // //             if (vertex.hasMark(this.marker)) markedVertex.push(vertex)
        // //         })
        // //
        // //         let border = graph.getEdge(markedVertex)
        // //
        // //         //$$$end
        // //
        // //
        // //         //$$$bh visualization
        // //         let verticesViewer0 = new visu3d.VerticesViewer(mamesh, this.mathisFrame.scene)
        // //         verticesViewer0.selectedVertices = markedVertex
        // //         verticesViewer0.color = new Color(Color.names.indianred)
        // //         verticesViewer0.go()
        // //
        // //         //n
        // //         let verticesViewer1 = new visu3d.VerticesViewer(mamesh, this.mathisFrame.scene)
        // //         verticesViewer1.selectedVertices = border
        // //         verticesViewer1.color = new Color(Color.names.aqua)
        // //         verticesViewer1.go()
        // //         //n
        // //
        // //         new visu3d.LinksViewer(mamesh, this.mathisFrame.scene).go()
        // //         //$$$eh
        // //     }
        // // }
        //
        //
        // class TwoGraphDistances implements PieceOfCode {
        //
        //     NAME = "TwoGraphDistances"
        //     TITLE = "For reseaux with squares, considering or not considering the diagonals lead to two different notions of distances : "
        //
        //     useDiago=true
        //     $$$useDiago=[true,false]
        //
        //     marker=Vertex.Markers.center
        //     $$$marker=new Choices([Vertex.Markers.border,Vertex.Markers.corner,Vertex.Markers.center],{"before":"Vertex.Markers.",visualValues:["border","corner","center"]})
        //
        //     nbI=7
        //     $$$nbI=[3,7,15,30]
        //
        //     justOneTime=true
        //     $$$justOneTime=[true,false]
        //
        //     _strateLengths:number[]
        //
        //     constructor(private mathisFrame:MathisFrame) {
        //         this.mathisFrame = mathisFrame
        //
        //     }
        //
        //     goForTheFirstTime() {
        //
        //         this.mathisFrame.clearScene()
        //         this.mathisFrame.addDefaultCamera()
        //         this.mathisFrame.addDefaultLight()
        //         this.go()
        //     }
        //
        //     go(){
        //
        //
        //         this.mathisFrame.clearScene(false, false)
        //
        //         //$$$bh creation of a squared mesh
        //         let creator = new reseau.Regular2dPlus()
        //         creator.origin = new XYZ(-1, -1, 0)
        //         creator.end = new XYZ(1, 1, 0)
        //         creator.nbU = this.nbI
        //         creator.adaptVForRegularReseau=true
        //         let mamesh = creator.go()
        //
        //
        //         //$$$eh
        //
        //
        //         //$$$begin
        //         let considerDiagonals=this.useDiago
        //
        //
        //         let markedVertex = []
        //         for (let i=0;i<mamesh.vertices.length;i++){
        //             let vertex=mamesh.vertices[i]
        //             if (vertex.hasMark(this.marker)) markedVertex.push(vertex)
        //         }
        //         let strates=[]
        //         strates.push(markedVertex)
        //
        //         if(this.justOneTime){
        //             if (considerDiagonals) strates.push(graph.getEdgeConsideringAlsoDiagonalVoisin(markedVertex))
        //             else strates.push(graph.getEdge(markedVertex))
        //         }
        //         else{
        //             let alreadySeen=new HashMap<Vertex,boolean>()
        //             let curentEdge=markedVertex
        //             while (curentEdge.length>0){
        //                 if (considerDiagonals) curentEdge=graph.getEdgeConsideringAlsoDiagonalVoisin(curentEdge,alreadySeen)
        //                 else curentEdge=graph.getEdge(curentEdge,alreadySeen)
        //                 strates.push(curentEdge)
        //             }
        //         }
        //
        //         //$$$end
        //
        //
        //         //$$$bh visualization
        //         for (let i=0;i<strates.length;i++){
        //             let verticesViewer0 = new visu3d.VerticesViewer(mamesh, this.mathisFrame.scene)
        //             verticesViewer0.vertices = strates[i]
        //             verticesViewer0.color = new Color(i)
        //             verticesViewer0.go()
        //         }
        //
        //
        //         new visu3d.LinksViewer(mamesh, this.mathisFrame.scene).go()
        //         //$$$eh
        //
        //         //$$$bt
        //         this._strateLengths=[]
        //         for (var i=0;i<strates.length;i++){
        //             this._strateLengths[i]=strates[i].length
        //         }
        //         console.log(this._strateLengths)
        //
        //         //$$$et
        //
        //     }
        // }
        //
        //


    }
}