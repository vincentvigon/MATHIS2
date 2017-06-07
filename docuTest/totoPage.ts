/**
 * Created by vigon on 05/06/2017.
 */



module mathis {
    export module appli {

        export class TotoPage implements OnePage {

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
            NAME="TotoTryReseau"
            TITLE="In this first part, we try to make a simple reseau"

            nbI = 3
            $$$nbI=[3,5,7]

            squareMaille=true
            $$$squareMaille=[true,false]

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
                let creator = new reseau.Regular2d()


                creator.nbU = this.nbI
                creator.nbV = 4
                creator.dirU = new XYZ( 0,0.2, 0)
                creator.dirV = new XYZ(0.2, 0, 0)

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
            }
        }
    }
}
