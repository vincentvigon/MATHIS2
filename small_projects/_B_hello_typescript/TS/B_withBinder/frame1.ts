/**
 * Created by vigon on 09/05/2017.
 */


module mathis{


    export module totoModule {

        export class VariableReseau implements appli.PieceOfCode {
            NAME = "VariableReseau"
            TITLE = ""

            nbI = 3
            $$$nbI = [3, 5, 7]

            squareMaille = true
            $$$squareMaille = [true, false]

            Vj = new XYZ(0, 0.2, 0)
            $$$Vj = [new XYZ(0, 0.2, 0), new XYZ(0.05, 0.2, 0)]

            constructor(private mathisFrame: MathisFrame) {
            }

            goForTheFirstTime() {
                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()

                this.go()
            }

            go() {

                this.mathisFrame.clearScene(false, false)

                let creator = new reseau.Regular2d()

                creator.nbI = this.nbI
                creator.nbJ = 4
                creator.Vi = new XYZ(0.2, 0, 0)
                creator.Vj = this.Vj
                creator.origine = new XYZ(-0.7, -0.7, 0)
                creator.squareVersusTriangleMaille = this.squareMaille

                let mamesh = creator.go()

                new visu3d.VerticesViewer(mamesh, this.mathisFrame.scene).go()
                new visu3d.LinksViewer(mamesh, this.mathisFrame.scene).go()
                new visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene).go()

            }

        }



    }


}