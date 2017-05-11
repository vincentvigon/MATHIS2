/**
 * Created by vigon on 19/11/2016.
 */

module mathis{

    export module appli{


        export class BasicDocu implements OnePage{
            
            pageIdAndTitle="Mameshes, vertices, links and lines"
            severalParts:SeveralParts

            constructor(private mathisFrame:MathisFrame){
                let several=new SeveralParts()
                several.addPart(new SimpleMamesh(this.mathisFrame))
                several.addPart(new SimpleMameshLine(this.mathisFrame))
                several.addPart(new LineDocu(this.mathisFrame))
                this.severalParts=several
            }

            go(){
                return this.severalParts.go()
            }


        }



        class SimpleMamesh implements PieceOfCode{

            NAME="SimpleMamesh"
            TITLE="A simple Mamesh with polygons and links"

            link=true
            $$$link=new Choices([true,false])

            _nbLinks=0

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
                //$$$begin

                let addLinks=this.link


                /**let's create vertices*/
                let vertex0 = new Vertex().setPosition(-1, -1, 0)
                let vertex1 = new Vertex().setPosition(-1, 1, 0)
                let vertex2 = new Vertex().setPosition(0, 1.5, 0)
                let vertex3 = new Vertex().setPosition(0, -0.5, 0)
                let vertex4 = new Vertex().setPosition(1, -1, 0)
                let vertex5 = new Vertex().setPosition(1, 1, 0)


                //n
                /**let's make a mamesh with 2 triangles, 1 rectangle*/
                let mamesh = new Mamesh()
                mamesh.vertices.push(vertex0, vertex1, vertex2,vertex3,vertex4,vertex5)
                mamesh.addATriangle(vertex0, vertex2, vertex1).addATriangle(vertex0,vertex3,vertex2)
                mamesh.addASquare(vertex2,vertex3,vertex4,vertex5)
                //n
                /**automatic creation of links between vertex */

                if(addLinks) {
                    mamesh.addSimpleLinksAroundPolygons()
                }


                //$$$end


                //$$$bh visualization
                let verticesViewer=new visu3d.VerticesViewer(mamesh,this.mathisFrame.scene)
                verticesViewer.go()


                let linksViewer=new visu3d.LinksViewer(mamesh,this.mathisFrame.scene)
                linksViewer.go()


                let surfaceViewer=new visu3d.SurfaceViewer(mamesh,this.mathisFrame.scene)
                surfaceViewer.go()
                //$$$eh

                //$$$bt
                let nbLinks=0
                for (let vertex of mamesh.vertices){
                    nbLinks+=vertex.links.length
                }
                this._nbLinks=nbLinks
                //$$$et

            }
        }


        class SimpleMameshLine implements PieceOfCode{

            NAME="SimpleMameshLine"
            TITLE="the same mamesh, but we also add lines"

            link=true
            $$$link=new Choices([true,false])

            _nbLines=0


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


                //$$$bh mamesh creation
                /**let's create vertices*/
                let vertex0 = new Vertex().setPosition(-1, -1, 0)
                let vertex1 = new Vertex().setPosition(-1, 1, 0)
                let vertex2 = new Vertex().setPosition(0, 1.5, 0)
                let vertex3 = new Vertex().setPosition(0, -0.5, 0)
                let vertex4 = new Vertex().setPosition(1, -1, 0)
                let vertex5 = new Vertex().setPosition(1, 1, 0)


                //n
                /**let's make a mamesh with 2 triangles, 1 rectangle*/
                let mamesh = new Mamesh()
                mamesh.vertices.push(vertex0, vertex1, vertex2,vertex3,vertex4,vertex5)
                mamesh.addATriangle(vertex0, vertex2, vertex1).addATriangle(vertex0,vertex3,vertex2)
                mamesh.addASquare(vertex2,vertex3,vertex4,vertex5)

                //$$$eh

                //$$$begin

                /**automatic creation of links between vertex */
                let addOppositeLinks=this.link

                if(addOppositeLinks) {
                    /**some natural opposition are made between links.
                     * Line are constructed following links in oppositions. */
                    mamesh.addOppositeLinksAroundPolygons()
                }
                else {
                    mamesh.addSimpleLinksAroundPolygons()
                }



                //$$$end




                //$$$bh visualization
                let verticesViewer=new visu3d.VerticesViewer(mamesh,this.mathisFrame.scene)
                verticesViewer.go()

                if (addOppositeLinks){

                    /**to hide the famous bug*/
                    new spacialTransformations.Similitude(mamesh.vertices,0.001).goChanging()

                    let lineViewer=new visu3d.LinesViewer(mamesh,this.mathisFrame.scene)
                    //lineViewer.interpolationOption.interpolationStyle=geometry.InterpolationStyle.none
                    lineViewer.go()

                }
                else{

                    let linksViewer=new visu3d.LinksViewer(mamesh,this.mathisFrame.scene)
                    linksViewer.go()


                }



                let surfaceViewer=new visu3d.SurfaceViewer(mamesh,this.mathisFrame.scene)
                surfaceViewer.go()

                //$$$eh


                //$$$bt
                mamesh.fillLineCatalogue()
                this._nbLines=mamesh.lines.length
                //$$$et


            }
        }



        
        class LineDocu implements PieceOfCode{
            NAME="LineDocu"
            TITLE="Defining lines joining vertices"

            makeLoop=false
            $$$makeLoop=new Choices([true,false])

            nb=9
            $$$nb=new Choices([5,7,9,15])


            interpolationStyle=geometry.InterpolationStyle.octavioStyle
            $$$interpolationStyle=new Choices(allIntegerValueOfEnume(geometry.InterpolationStyle),{"before":"geometry.InterpolationStyle.","visualValues":allStringValueOfEnume(geometry.InterpolationStyle)})


            _nbLoopLines=0
            _nbStraightLines=0

            constructor(private mathisFrame:MathisFrame){}

            goForTheFirstTime(){
                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()
                this.go()
            }

            go(){
                this.mathisFrame.clearScene(false,false)


                //$$$begin
                let makeLoop=this.makeLoop
                let interpolationStyle=this.interpolationStyle

                let nb=this.nb
                let mamesh=new Mamesh()
                for (let i=0;i<nb;i++){
                    let vertex=new Vertex()
                    let angle=2*Math.PI*i/(nb)
                    vertex.position=new XYZ(Math.cos(angle),Math.sin(angle),0)
                    mamesh.vertices.push(vertex)
                }

                for (let i=1;i<nb-1;i++) {
                    /**create two links and and inform both of them that they are opposite */
                    mamesh.vertices[i].setTwoOppositeLinks(mamesh.vertices[i-1],mamesh.vertices[i+1])

                }
                if (makeLoop){
                    mamesh.vertices[0].setTwoOppositeLinks(mamesh.vertices[1],mamesh.vertices[nb-1])
                    mamesh.vertices[nb-1].setTwoOppositeLinks(mamesh.vertices[nb-2],mamesh.vertices[0])
                }
                else{
                    mamesh.vertices[0].setOneLink(mamesh.vertices[1])
                    mamesh.vertices[nb-1].setOneLink(mamesh.vertices[nb-2])
                }

                //$$$end

                //$$$bh visualization


                let linesViewer=new visu3d.LinesViewer(mamesh,this.mathisFrame.scene)
                linesViewer.interpolationOption.interpolationStyle= interpolationStyle
                linesViewer.interpolationOption.loopLine=makeLoop
                linesViewer.go()
                new visu3d.VerticesViewer(mamesh,this.mathisFrame.scene).go()

                //$$$eh

                //$$$bt
                this._nbLoopLines=0
                this._nbStraightLines=0

                for (let line of mamesh.lines){
                    if (line.isLoop) this._nbLoopLines++
                    else this._nbStraightLines++
                }
                //$$$et


            }


        }






    }


}



