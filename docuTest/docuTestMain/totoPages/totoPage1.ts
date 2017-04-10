/**
 * Created by vigon on 02/04/2017.
 */



module mathis {

    export module documentation {


        export class TotoPage1 implements OnePage {

            pageIdAndTitle = "The first page made by Toto "
            severalParts: SeveralParts


            constructor(private mathisFrame: MathisFrame) {
                let several = new SeveralParts()
                several.addPart(new TotoTryReseau(this.mathisFrame))

                this.severalParts = several
            }

            go() {
                return this.severalParts.go()
            }

        }

        class TotoTryReseau implements PieceOfCode{
            $$$name="TotoTryReseau"
            $$$title="In this first part, we try to make a simple reseau"

            nbI = 3
            $$$nbI=[3,5,7]

            squareMaille=true
            $$$squareMaille=[true,false]


            _nbVertices:number



            constructor(private mathisFrame:MathisFrame) {}

            /**This method is fired when we enter  in this piece of code (eg. when play button is pushed)*/
            goForTheFirstTime(){
                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()

                this.go()
            }
            /**This method is fired each time one of the configuration parameters change */
            go() {

                this.mathisFrame.clearScene(false,false)

                //$$$begin
                let creator = new reseau.Regular()
                creator.nbI = this.nbI
                creator.nbJ = 4
                creator.Vi = new XYZ(0.2, 0, 0)
                creator.Vj = new XYZ(0,0.2,0)
                creator.origine = new XYZ(-0.7, -0.7, 0)
                //n
                creator.squareVersusTriangleMaille = this.squareMaille
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
                //$$$et

            }

        }

    }
}