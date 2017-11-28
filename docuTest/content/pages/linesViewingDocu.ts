/**
 * Created by vigon on 26/12/2016.
 */


/**
 * Created by vigon on 22/12/2016.
 */


/**
 * Created by vigon on 21/11/2016.
 */
module mathis{

    export module appli{


        export class LinesViewingDocu implements OnePage{


            constructor(private mathisFrame:MathisFrame){
                let severalParts=new SeveralParts()
                severalParts.addPart(new ChoseColorOfLinesAccordingToLevel(this.mathisFrame))
                severalParts.addPart(new JustTheSizeOfLines(this.mathisFrame))
                severalParts.addPart(new ChoseColorOfLinesAccordingToSymmetries(this.mathisFrame))
                severalParts.addPart(new ChoseColorOfLinesBifurcation(this.mathisFrame))
                severalParts.addComment(`The lineViewer call the method mamesh.fillLineCatalogue() which compute
                   all lines passing throw vertices of the mamesh. But you can decide to fill the catalogue before
                   to call the viewer, and to not add all the lines. Here is some examples.`,"The lineViewer call the method mamesh")
                severalParts.addPart(new DoNotDrawAllTheLines(this.mathisFrame))
                severalParts.addPart(new DoNotDrawAllTheLines3d(this.mathisFrame),true)
                severalParts.addPart(new DrawOnlyLinePassingInside(this.mathisFrame))
                this.severalParts=severalParts
            }

            pageIdAndTitle="Lines viewing"
            severalParts:SeveralParts
            
            go(){
                return this.severalParts.go()
            }
        }



        class JustTheSizeOfLines implements PieceOfCode{

            NO_TEST=true


            NAME="JustTheSizeOfLines"

            TITLE="We change radius and interpolation style"

            nbSides=4
            $$$nbSides=[4,7,10]

            nbSubdivisionInARadius=3
            $$$nbSubdivisionInARadius=[2,3,5]

            // color=Color.names.rebeccapurple
            // $$$color=new Choices([Color.names.rebeccapurple,Color.names.rosybrown,Color.names.darkorange],
            //     {'before':'Color.names.','visualValues':['rebeccapurple','rosybrown','darkorange']})


            radiusProp=0.05
            $$$radiusProp=[0.01,0.05,0.1]

            constantRadius=0.01
            $$$constantRadius=[0.01,0.02,0.05]

            isThin=true
            $$$isThin=[true,false]

            radiusFunction=function(i,alpha){return alpha*0.05}
            $$$radiusFunction=[
                function(alpha,position){return alpha*0.05},
                function(alpha,position){return geo.norme(position)*0.05},
                function(alpha,position){return 0.02*Math.sin(2*Math.PI*alpha)},
                function(alpha,position){return 0.1*position.x},
                function(alpha,position){return 0.1*position.y*alpha}
            ]





            interpolationStyle=geometry.InterpolationStyle.octavioStyle
            $$$interpolationStyle=new Choices(allIntegerValueOfEnume(geometry.InterpolationStyle),{"before":"geometry.InterpolationStyle.","visualValues":allStringValueOfEnume(geometry.InterpolationStyle)})



            radiusChoices='default'
            $$$radiusChoices=['default','constant','proportional','varying']



            constructor(private mathisFrame:MathisFrame){}


            goForTheFirstTime(){
                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()

                this.go()
            }

            go() {
                this.mathisFrame.clearScene(false, false)

                //$$$b
                let creator=new reseau.TriangulatedPolygone(this.nbSides)
                creator.nbSubdivisionInARadius=this.nbSubdivisionInARadius
                let mamesh=creator.go()

                //n
                let linesViewer=new visu3d.LinesViewer(mamesh,this.mathisFrame.scene)

                linesViewer.interpolationOption.interpolationStyle=this.interpolationStyle

                //$$$e

                //$$$bc
                switch (this.radiusChoices){

                    case 'default':{

                    }
                        break
                    case 'constant':{
                        linesViewer.radiusAbsolute=this.constantRadius
                    }
                        break


                    case 'proportional':{
                        /**proportionnal according to vertex spacing*/
                        linesViewer.radiusProp=this.radiusProp
                    }
                        break
                    case 'varying':{
                        /** argument 'alpha' in [0,1] represent the proportionnal length from line-begin to the current point of the line
                         *  arument 'position' represent the absolute position of current point of the line */
                        linesViewer.radiusFunction=this.radiusFunction
                    }
                        break

                    case 'thin':{
                        /**to have line of one pixel*/
                        linesViewer.isThin=this.isThin
                    }

                }
                //$$$ec



                //$$$b
                linesViewer.go()
                //$$$e

                //$$$bh vertices viewing
                let verticesViewer=new visu3d.VerticesViewer(mamesh,this.mathisFrame.scene)
                verticesViewer.radiusProp=0.1
                    verticesViewer.go()
                //$$$eh




            }

        }


        class DoNotDrawAllTheLines implements PieceOfCode{




            NAME="DoNotDrawAllTheLines"

            TITLE="We construct only the lines starting from selected vertices."

            nbI=10
            $$$nbI=[5,10,12,15,20]


            selectionChoice=0
            $$$selectionChoice=[0,1,2]


            _nbLines:number


            constructor(private mathisFrame:MathisFrame){}

            goForTheFirstTime(){
                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()

                this.go()
            }

            go() {
                this.mathisFrame.clearScene(false, false)

                //$$$b
                let creator=new reseau.Regular2dPlus()
                creator.nbU=this.nbI
                creator.nbV=creator.nbU
                creator.origin=new XYZ(-0.7,-0.7,0)
                creator.end=new XYZ(+0.7,+0.7,0)
                let mamesh=creator.go()

                let lineBuilder=new lineModule.LineComputer(mamesh)


                lineBuilder.startingVertices=[]
                let selectionChoice=this.selectionChoice
                for (let i = 0; i < mamesh.vertices.length; i++) {
                    let vertex = mamesh.vertices[i]
                    if (selectionChoice == 0) {
                        if (vertex.param.x % 3 == 0 && vertex.param.y == 0) lineBuilder.startingVertices.push(vertex)
                    }
                    else if (selectionChoice == 1) {
                        if (vertex.param.x % 3 == 0 && vertex.param.y == 0) lineBuilder.startingVertices.push(vertex)
                        if (vertex.param.x == 0 && vertex.param.y % 3 == 0) lineBuilder.startingVertices.push(vertex)
                    }
                    else if (selectionChoice == 2) {
                        if (vertex.position.length()<0.15) lineBuilder.startingVertices.push(vertex)
                        //console.log(mamesh.toString())
                    }
                }

                mamesh.lines=lineBuilder.go()

                //n
                let linesViewer=new visu3d.LinesViewer(mamesh,this.mathisFrame.scene)
                linesViewer.go()
                //$$$e

                //$$$bh vertices viewing
                let verticesViewer=new visu3d.VerticesViewer(mamesh,this.mathisFrame.scene)
                verticesViewer.radiusProp=0.1
                verticesViewer.go()
                //$$$eh

                //$$$bt
                this._nbLines=mamesh.lines.length
                //$$$et
            }
        }


        class DoNotDrawAllTheLines3d implements PieceOfCode{


            NAME="DoNotDrawAllTheLines3d"

            TITLE="variant with 3d cartesian reseau"

            nbI=10
            $$$nbI=[5,10,12,15,20]


            selectionChoice=0
            $$$selectionChoice=[0,1,2]

            _nbLines:number



            constructor(private mathisFrame:MathisFrame){}

            goForTheFirstTime(){
                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()

                this.go()
            }

            go() {
                this.mathisFrame.clearScene(false, false)

                //$$$b
                let creator=new reseau.Regular3D()
                creator.nbU=this.nbI
                creator.nbV=creator.nbU
                creator.nbW=creator.nbU
                creator.dirU=new XYZ(0.1,0,0)
                creator.dirV=new XYZ(0,0.1,0)
                creator.dirW=new XYZ(0,0,0.1)

                let mamesh=creator.go()

                let lineBuilder=new lineModule.LineComputer(mamesh)


                lineBuilder.startingVertices=[]
                let selectionChoice=this.selectionChoice
                for (let i = 0; i < mamesh.vertices.length; i++) {
                    let vertex = mamesh.vertices[i]
                    if (selectionChoice == 0) {
                        if (vertex.param.x % 3 == 0 && vertex.param.y == 0  ) lineBuilder.startingVertices.push(vertex)
                    }
                    else if (selectionChoice == 1) {
                        if (vertex.param.x % 3 == 0 && vertex.param.y == 0&& vertex.param.z == 0  ) lineBuilder.startingVertices.push(vertex)
                        if (vertex.param.x     == 0 && vertex.param.y%3== 0&& vertex.param.z == 0  ) lineBuilder.startingVertices.push(vertex)
                        if (vertex.param.x     == 0 && vertex.param.y== 0&& vertex.param.z%3 == 0  ) lineBuilder.startingVertices.push(vertex)

                    }
                    else if (selectionChoice == 2) {
                        if (vertex.position.length()<0.25) lineBuilder.startingVertices.push(vertex)
                    }
                }

                mamesh.lines=lineBuilder.go()

                //n
                let linesViewer=new visu3d.LinesViewer(mamesh,this.mathisFrame.scene)
                linesViewer.go()
                //$$$e

                //$$$bh vertices viewing
                let verticesViewer=new visu3d.VerticesViewer(mamesh,this.mathisFrame.scene)
                verticesViewer.radiusProp=0.1
                verticesViewer.go()
                //$$$eh


                //$$$bt
                this._nbLines=mamesh.lines.length
                //$$$et




            }

        }


        class DrawOnlyLinePassingInside implements PieceOfCode{





            NAME="DrawOnlyLinePassingInside"

            TITLE="We draw lines only passing inside selected vertices"

            nbI=10
            $$$nbI=[5,10,12,15,20]


            selectionChoice=0
            $$$selectionChoice=[0,1,2]

            _nbLines:number


            constructor(private mathisFrame:MathisFrame){}

            goForTheFirstTime(){
                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()

                this.go()
            }

            go() {
                this.mathisFrame.clearScene(false, false)

                //$$$b
                let creator=new reseau.Regular2dPlus()
                creator.nbU=this.nbI
                creator.nbV=creator.nbU
                creator.origin=new XYZ(-0.7,-0.7,0)
                creator.end=new XYZ(+0.7,+0.7,0)


                let mamesh=creator.go()

                let lineBuilder=new lineModule.LineComputer(mamesh)


                lineBuilder.restrictLinesToTheseVertices=[]
                let selectionChoice=this.selectionChoice
                for (let i = 0; i < mamesh.vertices.length; i++) {
                    let vertex = mamesh.vertices[i]
                    if (selectionChoice == 0) {
                        if (vertex.param.x <=3  && (vertex.param.y <=3|| vertex.param.y>5)) lineBuilder.restrictLinesToTheseVertices.push(vertex)
                    }
                    else if (selectionChoice == 1) {
                        if (vertex.position.length()>0.5) lineBuilder.restrictLinesToTheseVertices.push(vertex)
                    }
                    else if (selectionChoice == 2) {
                        if (vertex.position.length()<0.5) lineBuilder.restrictLinesToTheseVertices.push(vertex)
                    }
                }

                mamesh.lines=lineBuilder.go()
                //$$$e

                //$$$bh visualization
                let linesViewer=new visu3d.LinesViewer(mamesh,this.mathisFrame.scene)
                linesViewer.go()

                let verticesViewer=new visu3d.VerticesViewer(mamesh,this.mathisFrame.scene)
                verticesViewer.radiusProp=0.1
                verticesViewer.go()
                //$$$eh


                //$$$bt
                this._nbLines=mamesh.lines.length
                //$$$et

            }
        }

        
        class ChoseColorOfLinesAccordingToLevel implements PieceOfCode{

            NO_TEST=true



            NAME="ChoseColorOfLinesAccordingToLevel"

            TITLE="colors of vertical lines are chosen via lineToColor. color of horizontal lines are chosen via a lineToLevel"

            nbI = 11
            $$$nbI=new Choices([11,5,15])


            constructor(private mathisFrame:MathisFrame){}

            goForTheFirstTime(){
                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()

                this.go()
            }

            go() {
                this.mathisFrame.clearScene(false, false)

                //$$$bh mamesh creation
                let creator=new reseau.Regular2dPlus()
                creator.nbU=this.nbI
                creator.nbV=11
                creator.origin=new XYZ(-1,-1,0)
                creator.end=new XYZ(1,1,0)
                let mamesh=creator.go()
                //$$$eh

                //$$$b
                mamesh.fillLineCatalogue()

                //n
                let lineViewerHorizontal=new visu3d.LinesViewer(mamesh,this.mathisFrame.scene)
                lineViewerHorizontal.lineToLevel=new HashMap<Line,number>()
                let lineViewerVertical=new visu3d.LinesViewer(mamesh,this.mathisFrame.scene)
                lineViewerVertical.lineToColor=new HashMap<Line,Color>()

                for (let i=0;i<mamesh.lines.length;i++){
                    let line=mamesh.lines[i]
                    let isHorizontal=(line.getVertex(0).param.y==line.getVertex(1).param.y)
                    if (isHorizontal) {
                        lineViewerHorizontal.lineToLevel.putValue(line,line.getVertex(0).param.y)
                    }
                    else {
                        if (line.getVertex(0).param.x%2==0) lineViewerVertical.lineToColor.putValue(line,new Color(Color.names.black))
                        else lineViewerVertical.lineToColor.putValue(line,new Color(Color.names.whitesmoke))
                    }
                }
                /**Levels are transformed into  colors via the default color map*/
                lineViewerHorizontal.go()
                lineViewerVertical.go()

                //$$$e

                
                //$$$bh vertices visualization
                let verticesViewer=new visu3d.VerticesViewer(mamesh,this.mathisFrame.scene)
                verticesViewer.radiusProp=0.1
                verticesViewer.go()
                //$$$eh
            }
        }
        

        class ChoseColorOfLinesAccordingToSymmetries implements PieceOfCode{

            NAME="ChoseColorOfLinesAccordingToSymmetries"

            TITLE="We color symmetric lines with the same color"
            
            // nbI = 11
            // $$$nbI=new Choices([11,5,15])

            // oneMoreVertexForOddLine=false
            // $$$oneMoreVertexForOddLine=new Choices([true,false])
            
            // squareMaille=true
            // $$$squareMaille=new Choices([true,false])
            // Vj=new XYZ(0,0.1,0)
            // $$$Vj=new Choices([new XYZ(0,0.1,0),new XYZ(0.05,0.1,0)],{"before":"new mathis.XYZ"})


            selectionChoice=0
            $$$selectionChoice=[0,1,2]

            nbSubdivisionInARadius=4
            $$$nbSubdivisionInARadius=[3,4,6,8]

            nbSides=4
            $$$nbSides=[4,6,8,10]

            constructor(private mathisFrame:MathisFrame){}

            goForTheFirstTime(){
                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()

                this.go()
            }

            go() {
                this.mathisFrame.clearScene(false, false)

                //$$$b
                let creator=new reseau.TriangulatedPolygone(this.nbSides)
                creator.nbSubdivisionInARadius=this.nbSubdivisionInARadius
                let mamesh=creator.go()
                mamesh.fillLineCatalogue()


                let lineColorIndexer=new lineModule.CreateAColorIndexRespectingBifurcationsAndSymmetries(mamesh)
                let symmetriesChoice=this.selectionChoice
                if (symmetriesChoice==0){
                    lineColorIndexer.symmetries=[ (a:XYZ)=>new XYZ(-a.x,a.y,a.z)]
                }
                else if (symmetriesChoice==1){
                    lineColorIndexer.symmetries=[  (a:XYZ)=>new XYZ(-a.x,a.y,a.z), (a:XYZ)=>new XYZ(a.x,-a.y,a.z)]
                }
                else if (symmetriesChoice==2){
                    lineColorIndexer.symmetries=[(a:XYZ)=>new XYZ(-a.x,a.y,a.z), (a:XYZ)=>new XYZ(a.x,-a.y,a.z),(a:XYZ)=>new XYZ(-a.x,-a.y,a.z) ]
                }
                //TODO : do not work as expected
                let linesViewer=new visu3d.LinesViewer(mamesh,this.mathisFrame.scene)
                linesViewer.lineToLevel=lineColorIndexer.go()
                linesViewer.go()

                //$$$e



                //$$$bh vertices visualization

                let verticesViewer=new visu3d.VerticesViewer(mamesh,this.mathisFrame.scene)
                verticesViewer.radiusProp=0.1
                verticesViewer.go()
                //$$$eh
            }
        }

        
        class ChoseColorOfLinesBifurcation implements PieceOfCode{

            NAME="ChoseColorOfLinesBifurcation"

            TITLE="We color bifurcation with the same color"

            nbSides=7
            $$$nbSides=[4,7,10]

            nbSubdivisionInARadius=3
            $$$nbSubdivisionInARadius=[2,3,5]


            // selectionChoice=0
            // $$$selectionChoice=[0,1,2]


            _nbLevels:number


            constructor(private mathisFrame:MathisFrame){}

            goForTheFirstTime(){
                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()

                this.go()
            }

            go() {
                this.mathisFrame.clearScene(false, false)

                //$$$b
                let creator=new reseau.TriangulatedPolygone(this.nbSides)
                creator.nbSubdivisionInARadius=this.nbSubdivisionInARadius
                let mamesh=creator.go()


                /**random suppression of some links*/
                let random=new proba.Random(6537)
                for (let i=0;i<mamesh.vertices.length;i++){
                    let vertex=mamesh.vertices[i]
                    for (let j=0;j<vertex.links.length;j++){
                        if (random.pseudoRand()<0.4){
                            Vertex.separateTwoVoisins(vertex,vertex.links[j].to)
                        }
                    }
                }

                /**we suppress all opposite and recreate them using angles.
                 * This will naturally create bifurcations*/
                mamesh.clearOppositeInLinks()
                let associer=new linkModule.OppositeLinkAssocierByAngles(mamesh.vertices)
                associer.canCreateBifurcations=true//(default value)
                associer.goChanging()

                /** we compute lines. Can also be done via mamesh.fillLineCatalogue */
                let lineBuilder=new lineModule.LineComputer(mamesh)
                lineBuilder.lookAtBifurcation=true //(default value)
                mamesh.lines=lineBuilder.go()
                //n
                /** here we create  line-index : two lines issue of a bifurcation have a same index.
                 * This will lead to a same color */
                let linesViewer=new visu3d.LinesViewer(mamesh,this.mathisFrame.scene)
                let lineColorIndexer=new lineModule.CreateAColorIndexRespectingBifurcationsAndSymmetries(mamesh)
                linesViewer.lineToLevel=lineColorIndexer.go()
                linesViewer.go()

                //$$$e




                //$$$bh vertices visualization

                let verticesViewer=new visu3d.VerticesViewer(mamesh,this.mathisFrame.scene)
                verticesViewer.radiusProp=0.1
                verticesViewer.go()
                //$$$eh


                //$$$bt

                this._nbLevels=tab.maxValue(linesViewer.lineToLevel.allValues())+1

                //$$$et




            }
        }






















    }



}