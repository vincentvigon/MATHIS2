/**
 * Created by vigon on 21/11/2016.
 */
module mathis{

    export module appli{


        export class ReseauDocu implements OnePage{
            
            pageIdAndTitle="Reseaux (=nets)"
            severalParts:SeveralParts


            constructor(private mathisFrame:MathisFrame){
                let severalParts=new SeveralParts()
                severalParts.addPart(new RegularReseauDocu(this.mathisFrame))
                severalParts.addPart(new RegularBasisDocu(this.mathisFrame))
                severalParts.addPart(new Regular2dPlusWithLinesDocu(this.mathisFrame))
                severalParts.addPart(new Regular2dTopo(this.mathisFrame))

                severalParts.addPart(new PolygonalResauDocu(this.mathisFrame))
                severalParts.addPart(new Regular3dReseauDocu(this.mathisFrame))

                this.severalParts=severalParts
            }

            go(){
                return this.severalParts.go()
            }


        }

        class RegularReseauDocu implements PieceOfCode{
            NAME="RegularReseauDocu"
            TITLE="Regular Reseau (=net)"

            nbI = 3
            $$$nbI=[3,5,7]

            oneMoreVertexForOddLine=false
            $$$oneMoreVertexForOddLine=[true,false]

            squareMaille=true
            $$$squareMaille=[true,false]


            Vj=new XYZ(0,0.2,0)
            $$$Vj=new Choices([new XYZ(0,0.2,0),new XYZ(0.05,0.2,0)],{"before":"new mathis.XYZ"})

            _nbVertices:number
            _nbTriangles:number
            _nbSquares:number


            constructor(private mathisFrame:MathisFrame) {

            }

            goForTheFirstTime(){
                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()

                this.go()
            }

            go() {

                this.mathisFrame.clearScene(false,false)

                //$$$begin
                let creator = new reseau.Regular()
                /** Vi and Vj form the basis of the reseau.
                 * For square net, points are i*Vi + j*Vj
                 * For triangular net, points are :
                 *  i*Vi + (j+decay)*Vj where decay=0.5 when j is odd*/
                creator.nbI = this.nbI
                creator.nbJ = 4
                creator.Vi = new XYZ(0.2, 0, 0)
                creator.Vj = this.Vj
                creator.origine = new XYZ(-0.7, -0.7, 0)
                //n
                creator.squareVersusTriangleMaille = this.squareMaille
                /**true-> square net, false->triangular net*/
                creator.oneMoreVertexForOddLine = this.oneMoreVertexForOddLine

                //n
                let mamesh = creator.go()
                //$$$end


                //$$$bh visualization
                new visu3d.VerticesViewer(mamesh, this.mathisFrame.scene).go()
                new visu3d.LinksViewer(mamesh, this.mathisFrame.scene).go()
                new visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene).go()
                //$$$eh


                //$$$bt
                this._nbVertices=mamesh.vertices.length
                this._nbSquares=mamesh.smallestSquares.length
                this._nbTriangles=mamesh.smallestTriangles.length
                //$$$et
            }

        }


        class RegularBasisDocu implements PieceOfCode{
            NAME="RegularBasisDocu"
            TITLE="Often we want to draw a reseau which starts from an given point, ends at a given point.  "

            nbI = 5
            $$$nbI=new Choices([3,5,7])

            nbJ = 20
            $$$nbJ=new Choices([20,40,60])

            squareMaille=true
            $$$squareMaille=new Choices([true,false])

            end=new XYZ(0.7,0.7,0)
            $$$end=new Choices([new XYZ(0.7,0.7,0),new XYZ(0,0,0),new XYZ(0.5,1,0)],{"before":"new mathis.XYZ"})

            setNBJ=true
            $$$setNBJ=[true,false]

            _nbVertices

            nbHorizontalDecays=0
            $$$nbHorizontalDecays=[0,1,2,3,4]

            nbVerticalDecays=0
            $$$nbVerticalDecays=[0,1,2,3,4]


            bend="flatFront"
            $$$bend=["flatFront","flatTurned","curved"]


            constructor(private mathisFrame:MathisFrame) {}

            goForTheFirstTime(){
                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()
                this.go()
            }

            go() {

                this.mathisFrame.clearScene(false,false)

                //$$$begin
                let creator = new reseau.Regular2dPlus()

                creator.nbI=this.nbI
                /**if true: nbJ is computed to obtain regular triangle/square*/
                creator.set_nbJ_toHaveRegularReseau=this.setNBJ
                /**if the previous is true, the next affectation is ignored*/
                creator.nbJ=this.nbJ
                creator.origin=new XYZ(-0.7,-0.7,0)
                creator.end=this.end
                creator.squareMailleInsteadOfTriangle=this.squareMaille
                //n
                /**only meanful for quad-reseau*/
                creator.nbHorizontalDecays=this.nbHorizontalDecays
                creator.nbVerticalDecays=this.nbVerticalDecays



                //n
                let mamesh = creator.go()



                /** Reseaux are made to be bend */
                switch (this.bend){
                    case "flatFront":{}
                    break
                    case "flatTurned":{
                        for (var i=0;i<mamesh.vertices.length;i++){
                            let vertex=mamesh.vertices[i]
                            let u=vertex.position.x
                            let v=vertex.position.y
                            vertex.position.x=u
                            vertex.position.y=u+v
                            vertex.position.z=v
                        }
                    }
                        break
                    case "curved":{
                        for (var i=0;i<mamesh.vertices.length;i++){
                            let vertex=mamesh.vertices[i]
                            let u=vertex.position.x
                            let v=vertex.position.y
                            vertex.position.x=u
                            vertex.position.y=v
                            vertex.position.z=-(u*u+v*v)
                        }
                    }
                        break

                }




                //$$$end

                //$$$bt
                this._nbVertices=mamesh.vertices.length
                //$$$et

                //$$$bh visualization
                new visu3d.VerticesViewer(mamesh, this.mathisFrame.scene).go()
                new visu3d.LinksViewer(mamesh, this.mathisFrame.scene).go()
                new visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene).go()
                //$$$eh
            }

        }


        class Regular2dPlusWithLinesDocu implements PieceOfCode{
            NAME="Regular2dPlusWithLinesDocu"
            TITLE="The class Regular2dPlus can also generate regularly spaced lines."

            nbI = 20
            $$$nbI=new Choices([20,40,60])

            nbJ = 20
            $$$nbJ=new Choices([20,40,60])

            squareMaille=true
            $$$squareMaille=new Choices([true,false])

            end=new XYZ(0.7,0.7,0)
            $$$end=new Choices([new XYZ(0.7,0.7,0),new XYZ(0,0,0),new XYZ(0.5,1,0)],{"before":"new mathis.XYZ"})

            setNBJ=true
            $$$setNBJ=[true,false]


            nbIBands=5
            $$$nbIBands=[0,1,2,3,5,6,8,10]

            nbJBands=5
            $$$nbJBands=[0,1,2,3,5,6,8,10]

            nbHorizontalDecays=0
            $$$nbHorizontalDecays=[0,1,2,3,4]

            nbVerticalDecays=0
            $$$nbVerticalDecays=[0,1,2,3,4]



            drawOnlyVerticesAtLineIntersection=false
            $$$drawOnlyVerticesAtLineIntersection=[false,true]



            _nbVertices
            _nbLines


            constructor(private mathisFrame:MathisFrame) {}

            goForTheFirstTime(){
                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()
                this.go()
            }

            go() {

                this.mathisFrame.clearScene(false,false)

                //$$$begin
                let creator = new reseau.Regular2dPlus()


                creator.nbI=this.nbI
                /**if true: nbJ is computed to obtain regular triangle/square*/
                creator.set_nbJ_toHaveRegularReseau=this.setNBJ
                /**if previous is true, the next affectation is useless*/
                creator.nbJ=this.nbJ
                creator.origin=new XYZ(-0.7,-0.7,0)
                creator.end=this.end
                creator.squareMailleInsteadOfTriangle=this.squareMaille

                creator.createBandsWithLines=true //default is false

                creator.nbVerticalBands=this.nbIBands
                creator.nbHorizontalBands=this.nbJBands


                /**only meanful for quad-reseau*/
                creator.nbHorizontalDecays=this.nbHorizontalDecays
                creator.nbVerticalDecays=this.nbVerticalDecays


                let mamesh = creator.go()




                let drawOnlyVerticesAtLineIntersection=this.drawOnlyVerticesAtLineIntersection

                //$$$end




                //$$$bh visualization

                let verticesToDraw:Vertex[]=[]
                if (drawOnlyVerticesAtLineIntersection){
                    let dicoVertices=new HashMap<Vertex,number>()
                    for (let line of mamesh.lines){
                        for (let vertex of line.vertices){
                            if (dicoVertices.getValue(vertex)==null) dicoVertices.putValue(vertex,1)
                            else if (dicoVertices.getValue(vertex)==1) dicoVertices.putValue(vertex,2)
                        }
                    }
                    for (let vertex of mamesh.vertices) {
                        if (dicoVertices.getValue(vertex)==2) verticesToDraw.push(vertex)
                    }
                }
                else verticesToDraw=mamesh.vertices



                new visu3d.VerticesViewer(verticesToDraw, this.mathisFrame.scene).go()
                if(mamesh.lines!=null) new visu3d.LinesViewer(mamesh, this.mathisFrame.scene).go()
                new visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene).go()
                //$$$eh



                //$$$bt
                this._nbVertices=mamesh.vertices.length
                this._nbLines=mamesh.lines.length
                //$$$et

            }

        }


        class Regular2dTopo implements PieceOfCode{
            NAME="Regular2dTopo"
            TITLE="The class Regular2dPlus allow to create surface with non-flat topology."

            nbI = 20
            $$$nbI=new Choices([20,40,60])

            nbJ = 20
            $$$nbJ=new Choices([20,40,60])

            squareMaille=true
            $$$squareMaille=new Choices([true,false])



            setNBJ=true
            $$$setNBJ=[true,false]


            nbIBands=5
            $$$nbIBands=[0,1,2,3,5,6,8,10]

            nbJBands=5
            $$$nbJBands=[0,1,2,3,5,6,8,10]

            nbHorizontalDecays=0
            $$$nbHorizontalDecays=[0,1,2,3,4]

            nbVerticalDecays=0
            $$$nbVerticalDecays=[0,1,2,3,4]



            drawOnlyVerticesAtLineIntersection=false
            $$$drawOnlyVerticesAtLineIntersection=[false,true]


            bend="flat topology"
            $$$bend=["flat topology","cylinder topology"]

            shape=0
            $$$shape=[0,1,2]

            shapeCyl="a bit curved"
            $$$shapeCyl=["a bit curved","cylinder","double twist"]

            shapeMoeb="a bit curved"
            $$$shapeMoeb=["a bit curved","modebius band","tripple twist"]


            _nbVertices
            _nbLines


            constructor(private mathisFrame:MathisFrame) {}

            goForTheFirstTime(){
                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()
                this.go()
            }

            go() {

                this.mathisFrame.clearScene(false,false)

                //$$$begin
                let creator = new reseau.Regular2dPlus()


                creator.nbI=this.nbI
                /**if true: nbJ is computed to obtain regular triangle/square*/
                creator.set_nbJ_toHaveRegularReseau=this.setNBJ
                /**if previous is true, the next affectation is useless*/
                creator.nbJ=this.nbJ
                creator.origin=new XYZ(-0.5,-0.5,0)
                creator.end=new XYZ(0.5,0.5,0)
                creator.squareMailleInsteadOfTriangle=this.squareMaille

                creator.createBandsWithLines=true //default is false

                creator.nbVerticalBands=this.nbIBands
                creator.nbHorizontalBands=this.nbJBands


                /**only meanful for quad-reseau*/
                creator.nbHorizontalDecays=this.nbHorizontalDecays
                creator.nbVerticalDecays=this.nbVerticalDecays


                let mamesh = creator.go()


                var X
                var Y
                var Z
                var pi=Math.PI
                /** Reseaux are made to be bend */

                switch (this.bend){
                    case "flat topology":{
                        switch (this.shape){
                            case 0:
                                X=function(u,v){return u}
                                Y=function(u,v){return v}
                                Z=function(u,v){return -(u*u+v*v)}
                                break
                            case 1:
                                X=function(u,v){return v*Math.cos(4*pi*u)}
                                Y=function(u,v){return u}
                                Z=function(u,v){return v*Math.sin(4*pi*u)}
                                break
                            case 2:
                                X=function(u,v){return u}
                                Y=function(u,v){return Math.exp(u)}
                                Z=function(u,v){return v}
                                break
                        }

                    }
                        break


                    case "cylinder topology":{
                        switch (this.shapeCyl){
                            case "a bit curved":
                                X=function(u,v){return u}
                                Y=function(u,v){return v}
                                Z=function(u,v){return -(u*u+v*v)}
                                break
                            case "cylinder":
                                X=function(u,v){return Math.cos(2*pi*u)}
                                Y=function(u,v){return v}
                                Z=function(u,v){return Math.sin(2*pi*u)}
                                break
                            case "double twist":
                                X=function(u,v){return (2-2*v*Math.sin(2*pi*u))*Math.sin(2*pi*u)}
                                Y=function(u,v){return (2-2*v*Math.sin(2*pi*u))*Math.cos(2*pi*u)}
                                Z=function(u,v){return 2*v*Math.cos(2*pi*u)}
                                break
                        }

                    }
                        break


                    case "moebius topology":{
                        switch (this.shapeMoeb){
                            case "a bit curved":
                                X=function(u,v){return u}
                                Y=function(u,v){return v}
                                Z=function(u,v){return -(u*u+v*v)}
                                break
                            case "modebius band":
                                X=function(u,v){return (2-2*v*Math.sin(pi*u))*Math.sin(2*pi*u)}
                                Y=function(u,v){return (2-2*v*Math.sin(pi*u))*Math.cos(2*pi*u)}
                                Z=function(u,v){return 2*v*Math.cos(pi*u)}
                                break
                            case "tripple twist":
                                X=function(u,v){return (2-2*v*Math.sin(pi*u))*Math.sin(2*pi*u)}
                                Y=function(u,v){return (2-2*v*Math.sin(pi*u))*Math.cos(2*pi*u)}
                                Z=function(u,v){return 2*v*Math.cos(pi*u)}
                                break
                        }

                    }
                        break





                }




                for (var i=0;i<mamesh.vertices.length;i++){
                    let vertex=mamesh.vertices[i]
                    let u=vertex.position.x
                    let v=vertex.position.y
                    vertex.position.x=X(u,v)
                    vertex.position.y=Y(u,v)
                    vertex.position.z=Z(u,v)
                }


                let drawOnlyVerticesAtLineIntersection=this.drawOnlyVerticesAtLineIntersection

                //$$$end




                //$$$bh visualization

                let verticesToDraw:Vertex[]=[]
                if (drawOnlyVerticesAtLineIntersection){
                    let dicoVertices=new HashMap<Vertex,number>()
                    for (let line of mamesh.lines){
                        for (let vertex of line.vertices){
                            if (dicoVertices.getValue(vertex)==null) dicoVertices.putValue(vertex,1)
                            else if (dicoVertices.getValue(vertex)==1) dicoVertices.putValue(vertex,2)
                        }
                    }
                    for (let vertex of mamesh.vertices) {
                        if (dicoVertices.getValue(vertex)==2) verticesToDraw.push(vertex)
                    }
                }
                else verticesToDraw=mamesh.vertices



                new visu3d.VerticesViewer(verticesToDraw, this.mathisFrame.scene).go()
                if(mamesh.lines!=null) new visu3d.LinesViewer(mamesh, this.mathisFrame.scene).go()
                new visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene).go()
                //$$$eh



                //$$$bt
                this._nbVertices=mamesh.vertices.length
                this._nbLines=mamesh.lines.length
                //$$$et

            }

        }






        class PolygonalResauDocu implements PieceOfCode{
            nbSides=7
            $$$nbSides=new Choices([3,4,5,6,7,9,11])

            nbSubdivisionsInARadius=3
            $$$nbSubdivisionsInARadius=new Choices([1,2,3,4,5])
            
            NAME="PolygonalResauDocu"
            TITLE="Polygonal reseau"

            _nbVertices



            
            constructor(private mathisFrame:MathisFrame) {
               
            }

            goForTheFirstTime(){
                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()
                
                this.go()
            }
            

            go() {


                this.mathisFrame.clearScene(false,false)


                //$$$begin
                /**for triangles, with no vertex at the center, use "reseau.TriangulatedTriangle"*/
                let creator = new reseau.TriangulatedPolygone(this.nbSides)
                creator.nbSubdivisionInARadius=this.nbSubdivisionsInARadius
                creator.origin=new XYZ(-1,-1,0)
                creator.end=new XYZ(1,1,0)
                let mamesh = creator.go()
                //$$$end

                //$$$bt
                this._nbVertices=mamesh.vertices.length
                //$$$et

                //$$$bh visualization
                new visu3d.VerticesViewer(mamesh, this.mathisFrame.scene).go()
                new visu3d.LinksViewer(mamesh, this.mathisFrame.scene).go()
                new visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene).go()
                //$$$eh
            }

        }


        class Regular3dReseauDocu implements PieceOfCode{

            NAME="Regular3dReseauDocu"
            TITLE="A 3d reseau now"


            Vj=new XYZ(0,0.2,0)
            $$$Vj=new Choices([new XYZ(0,0.2,0),new XYZ(0.05,0.2,0)],{"before":"new mathis.XYZ"})

            nbI=4
            $$$nbI=new Choices([4,6,8])
            decayOddStrates=false
            $$$decayOddStrates=new Choices([true,false])
            interStrateMailleAreSquareVersusTriangle=true
            $$$interStrateMailleAreSquareVersusTriangle=new Choices([true,false])
            strateHaveSquareMailleVersusTriangleMaille=true
            $$$strateHaveSquareMailleVersusTriangleMaille=new Choices([true,false])

            _nbVertices
            _nbLinks

            constructor(private mathisFrame:MathisFrame) {

            }

            goForTheFirstTime(){
                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()

                this.go()
            }

            go() {

                this.mathisFrame.clearScene(false,false)


                //$$$begin
                let creator = new reseau.Regular3D()
                creator.nbI = this.nbI
                creator.nbJ = 4
                creator.nbK = 5
                creator.Vi = new XYZ(0.2, 0,   0)
                creator.Vj = this.Vj
                creator.Vk = new XYZ(0,   0,   0.2)
                creator.origine = new XYZ(-0.7, -0.7, -0.7)
                //n

                creator.decayOddStrates=this.decayOddStrates
                creator.interStrateMailleAreSquareVersusTriangle=this.interStrateMailleAreSquareVersusTriangle
                creator.strateHaveSquareMailleVersusTriangleMaille=this.strateHaveSquareMailleVersusTriangleMaille
                //n

                let mamesh = creator.go()
                //$$$end

                //$$$bt
                this._nbVertices=mamesh.vertices.length
                this._nbLinks=0
                for (let vertex of mamesh.vertices){
                   this._nbLinks+=vertex.links.length
                }
                //$$$et


                //$$$bh visualization
                new visu3d.VerticesViewer(mamesh, this.mathisFrame.scene).go()
                new visu3d.LinksViewer(mamesh, this.mathisFrame.scene).go()
                new visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene).go()
                //$$$eh
            }

        }



















    }



}