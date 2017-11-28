/**
 * Created by vigon on 15/12/2016.
 */



module mathis{

    export module appli{


        export class LinksDocu implements OnePage{
            pageIdAndTitle="Simple links and opposite links"
            severalParts:SeveralParts


            constructor(private mathisFrame:MathisFrame){
                let several=new SeveralParts()
                several.addPart(new AutomaticLink(this.mathisFrame))
                several.addPart(new AutomaticPolygonLink(this.mathisFrame))
                several.addPart(new WhatAreLinks(this.mathisFrame))
                several.addPart(new WhatAreOppositeLinks(this.mathisFrame))
                this.severalParts=several
            }

            go(){
                return this.severalParts.go()
            }
            
        }



        class WhatAreLinks implements PieceOfCode{

            NAME="WhatAreLinks"
            TITLE="Several ways to create manually links (without association of opposite)"

            technicChoice=0
            $$$technicChoice=[0,1,2]


            _nbLinks

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
                
                //$$$bh vertices creation
                /**let's create vertices*/
                let vertex0 = new Vertex().setPosition(-1, -1, 0)
                let vertex1 = new Vertex().setPosition(-1, 1, 0)
                let vertex2 = new Vertex().setPosition(0, 1.5, 0)
                let vertex3 = new Vertex().setPosition(0, -0.5, 0)
                let vertex4 = new Vertex().setPosition(1, -1, 0)
                let vertex5 = new Vertex().setPosition(1, 1, 0)
                //$$$eh


                //$$$begin
                /**let's make a mamesh with 2 triangles, 1 rectangle*/
                let mamesh = new Mamesh()
                mamesh.vertices.push(vertex0, vertex1, vertex2,vertex3,vertex4,vertex5)
                mamesh.addATriangle(vertex0, vertex2, vertex1).addATriangle(vertex0,vertex3,vertex2)
                mamesh.addASquare(vertex2,vertex3,vertex4,vertex5)
                //n
                
                let technicChoice=this.technicChoice
                
                if (technicChoice==0){
                    /**automatic creation using polygons */
                    mamesh.addSimpleLinksAroundPolygons()
                }
                else if (technicChoice==1){
                    /**we only create 2 links
                     * To create a link between two vertices, you have to inform both of them that they are linked  */
                    vertex2.setOneLink(vertex1).setOneLink(vertex5)
                    vertex1.setOneLink(vertex2)
                    vertex5.setOneLink(vertex2)
                }
                else if (technicChoice==2){
                    /**quick and direct technique :  no verification is done.  */
                    vertex0.links.push(new Link(vertex1), new Link(vertex2))
                    vertex1.links.push(new Link(vertex0))
                    vertex2.links.push(new Link(vertex0))
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
                this._nbLinks=0
                for (let vertex of mamesh.vertices){
                    this._nbLinks+=vertex.links.length
                }
                //$$$et


            }
        }



        class WhatAreOppositeLinks implements PieceOfCode{

            NAME="WhatAreOppositeLinks"
            TITLE="several ways to associate manually opposite links"

            technicChoice=0
            $$$technicChoice=[0,1,2]

            _nbLines




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


                //$$$bh vertices creation
                /**let's create vertices*/
                let vertex0 = new Vertex().setPosition(-1, -1, 0)
                let vertex1 = new Vertex().setPosition(-1, 1, 0)
                let vertex2 = new Vertex().setPosition(0, 1.5, 0)
                let vertex3 = new Vertex().setPosition(0, -0.5, 0)
                let vertex4 = new Vertex().setPosition(1, -1, 0)
                let vertex5 = new Vertex().setPosition(1, 1, 0)
                //$$$eh


                //$$$begin
                /**let's make a mamesh with 2 triangles, 1 rectangle*/
                let mamesh = new Mamesh()
                mamesh.vertices.push(vertex0, vertex1, vertex2,vertex3,vertex4,vertex5)
                mamesh.addATriangle(vertex0, vertex2, vertex1).addATriangle(vertex0,vertex3,vertex2)
                mamesh.addASquare(vertex2,vertex3,vertex4,vertex5)
                //n

                let technicChoice=this.technicChoice

                if (technicChoice==0){
                    /**automatic creation using polygons (see further, for more details)*/
                    mamesh.addOppositeLinksAroundPolygons()
                }
                else if (technicChoice==1){
                    /**we only create 2 links
                     * To create a link between two vertices, you have to inform both of them that they are linked  */
                    vertex3.setTwoOppositeLinks(vertex0,vertex4)
                    vertex0.setOneLink(vertex3)
                    vertex4.setOneLink(vertex3)
                }
                else if (technicChoice==2){
                    /**direct technique (to understand the underlying data structure)*/
                    let link2_1=new Link(vertex1)
                    let link2_5=new Link(vertex5)
                    link2_1.opposites=[link2_5]
                    link2_5.opposites=[link2_1]
                    vertex2.links.push(link2_1,link2_5)
                    vertex1.links.push(new Link(vertex2))
                    vertex5.links.push(new Link(vertex2))
                }


                //$$$end

                

                //$$$bh visualization
                let verticesViewer=new visu3d.VerticesViewer(mamesh,this.mathisFrame.scene)
                verticesViewer.go()


                let linksViewer=new visu3d.LinesViewer(mamesh,this.mathisFrame.scene)
                linksViewer.go()


                let surfaceViewer=new visu3d.SurfaceViewer(mamesh,this.mathisFrame.scene)
                surfaceViewer.go()
                //$$$eh

                //$$$bt
                this._nbLines=mamesh.lines.length
                //$$$et

            }
        }


        class AutomaticLink implements PieceOfCode{

            NAME="AutomaticLink"
            TITLE="We create some random links. Then we associate opposite-links using an automatic process based on angles. " +
                "This can create bifurcation"

            // technicChoice=0
            // $$$technicChoice=[0,1,2]

            createBifurcation=true
            $$$createBifurcation=[true,false]


            nbLinks=30
            $$$nbLinks=[20,30,50,100]

            maxAngleToAssociateLinks=Math.PI*0.3
            $$$maxAngleToAssociateLinks=new Choices([Math.PI*0.1,Math.PI*0.3,Math.PI*0.5,Math.PI*0.8],{visualValues:['PI*0.1','PI*0.3','PI*0.5','PI*0.8']})

            _nbColor
            _nbLines

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

                /**let's create vertices*/
                let creator=new reseau.Regular2dPlus()
                creator.nbU=8
                creator.nbV=8
                creator.makeLinks=false
                let mamesh = creator.go()

                let nbLinks=this.nbLinks
                /** pseudo random generator. The seed is fixed to have
                 * always the same sequence */
                let seed=46765474657
                let random=new proba.Random(seed)
                let count=0
                let linksToAdd=new StringMap()
                while (count<nbLinks){
                    let vertex0=mamesh.vertices[random.pseudoRandInt(mamesh.vertices.length)]
                    let vertex1=mamesh.vertices[random.pseudoRandInt(mamesh.vertices.length)]
                    if (Math.abs(vertex0.param.x-vertex1.param.x)==1 && Math.abs(vertex0.param.y-vertex1.param.y)<3) {
                        linksToAdd.putValue(Hash.segment(vertex0,vertex1),[vertex0,vertex1])
                        count++
                    }
                }
                let allLinks=linksToAdd.allValues()
                for (let i=0;i<allLinks.length;i++){
                    let vertex0=allLinks[i][0]
                    let vertex1=allLinks[i][1]
                    vertex0.setOneLink(vertex1)
                    vertex1.setOneLink(vertex0)
                }


                let maxAngleToAssociateLinks=this.maxAngleToAssociateLinks
                let associer=new linkModule.OppositeLinkAssocierByAngles(mamesh.vertices)
                associer.canCreateBifurcations=this.createBifurcation
                associer.maxAngleToAssociateLinks=maxAngleToAssociateLinks
                associer.goChanging()


                //$$$end


                //$$$bh visualization
                /**if we made bifurcation, we make a colorIndex in order that two bifurcating lines have the same color*/
                let linesViewer=new visu3d.LinesViewer(mamesh,this.mathisFrame.scene)

                if (associer.canCreateBifurcations){
                    mamesh.fillLineCatalogue()
                    let lineIndexer=new lineModule.CreateAColorIndexRespectingBifurcationsAndSymmetries(mamesh)
                    linesViewer.lineToLevel=lineIndexer.go()
                }
                linesViewer.radiusAbsolute=0.01
                linesViewer.go()



                let verticesViewer=new visu3d.VerticesViewer(mamesh,this.mathisFrame.scene)
                verticesViewer.radiusAbsolute=0.03
                verticesViewer.go()
                //$$$eh

                //$$$bt
                this._nbColor=tab.maxValue(linesViewer.lineToLevel.allValues())+1 //+1 because start at 0
                this._nbLines=mamesh.lines.length
                //$$$et


                // let surfaceViewer=new visu3d.SurfaceViewer(mamesh,this.mathisFrame.scene)
                // surfaceViewer.go()

            }
        }

        class AutomaticPolygonLink implements PieceOfCode{

            NAME="AutomaticPolygonLink"
            TITLE="We associate opposite-links using an automatic process based on polygons."

            seed=3534
            $$$seed=[3534,7654,909123,58912307]

            maille=reseau.Maille.quad
            $$$maille=new Choices(allIntegerValueOfEnume(reseau.Maille),{visualValues:allStringValueOfEnume(reseau.Maille)})


            randomization =true
            $$$randomization=[true,false]

            _nbLines



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

                /**let's create vertices*/
                let creator=new reseau.Regular2dPlus()
                creator.nbU=5
                creator.nbV=5
                creator.maille=this.maille


                /**we intentionally forget to create links*/
                creator.makeLinks=false

                let mamesh=creator.go()

                /**we perturbate a lot the reseau*/
                if (this.randomization) {
                    let seed = this.seed
                    let random = new proba.Random(seed)
                    for (let i = 0; i < mamesh.vertices.length; i++) {
                        mamesh.vertices[i].position.add(new XYZ(random.pseudoRand(), random.pseudoRand(), random.pseudoRand()).scale(0.25))
                    }
                }

                /**first we add simple links. Easy work*/
                mamesh.addSimpleLinksAroundPolygons()
                /**now we associate opposite links (more complex algorithm)*/
                let process=new linkModule.LinkCreatorSorterAndBorderDetectorByPolygons(mamesh)
                process.goChanging()
                //$$$end


                //$$$bh visualization
                let verticesViewer=new visu3d.VerticesViewer(mamesh,this.mathisFrame.scene)
                verticesViewer.radiusAbsolute=0.05
                verticesViewer.go()


                let linesViewer=new visu3d.LinesViewer(mamesh,this.mathisFrame.scene)
                linesViewer.radiusAbsolute=0.02
                linesViewer.go()

                new visu3d.SurfaceViewer(mamesh,this.mathisFrame.scene).go()
                //$$$eh

                //$$$bt
                this._nbLines=mamesh.lines.length
                //$$$et


                // let surfaceViewer=new visu3d.SurfaceViewer(mamesh,this.mathisFrame.scene)
                // surfaceViewer.go()

            }
        }



    }


}

