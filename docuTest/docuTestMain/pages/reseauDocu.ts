/**
 * Created by vigon on 21/11/2016.
 */
module mathis{

    export module documentation{


        export class ReseauDocu implements OnePage{
            
            pageIdAndTitle="Reseaux (=nets)"
            severalParts:SeveralParts


            constructor(private mathisFrame:MathisFrame){
                let severalParts=new SeveralParts()
                severalParts.addPart(new RegularReseauDocu(this.mathisFrame))
                severalParts.addPart(new RegularBasisDocu(this.mathisFrame))
                severalParts.addPart(new PolygonalResauDocu(this.mathisFrame))
                severalParts.addPart(new Regular3dReseauDocu(this.mathisFrame))

                this.severalParts=severalParts
            }

            go(){
                return this.severalParts.go()
            }


        }

        class RegularReseauDocu implements PieceOfCode{
            $$$name="RegularReseauDocu"
            $$$title="Regular Reseau (=net)"

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
            $$$name="RegularBasisDocu"
            $$$title="Often we want to draw a reseau which starts from an given point, ends at a given point. So we can use the class which compute the right  Basis (ie: the rights kVi and Vj) "

            nbI = 3
            $$$nbI=new Choices([3,5,7])

            squareMaille=true
            $$$squareMaille=new Choices([true,false])

            Vj=new XYZ(0,0.2,0)
            $$$Vj=new Choices([new XYZ(0,0.2,0),new XYZ(0.05,0.2,0)],{"before":"new mathis.XYZ"})

            end=new XYZ(0.7,0.7,0)
            $$$end=new Choices([new XYZ(0.7,0.7,0),new XYZ(0,0,0),new XYZ(0.5,1,0)],{"before":"new mathis.XYZ"})

            setNBJ=true
            $$$setNBJ=[true,false]

            _nbVertices
            //_nnRien=null


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

                let basis = new reseau.BasisForRegularReseau()
                basis.nbI=this.nbI
                /**if true: nbJ is computed to obtain regular triangle/square*/
                basis.set_nbJ_toHaveRegularReseau=this.setNBJ
                /**if previous is true, the next affectation is useless*/
                basis.nbJ=4
                basis.origin=new XYZ(-0.7,-0.7,0)
                basis.end=this.end
                basis.squareMailleInsteadOfTriangle=this.squareMaille

                //n
                let creator = new reseau.Regular(basis)

                //n
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




        class PolygonalResauDocu implements PieceOfCode{
            nbSides=7
            $$$nbSides=new Choices([3,4,5,6,7,9,11])
            nbSubdivisionsInARadius=3
            $$$nbSubdivisionsInARadius=new Choices([1,2,3,4,5])
            
            $$$name="PolygonalResauDocu"
            $$$title="Polygonal reseau"

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

            $$$name="Regular3dReseauDocu"
            $$$title="A 3d reseau now"


            Vj:XYZ=new XYZ(0,0.2,0)
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