/**
 * Created by vigon on 19/07/2017.
 */



module mathis {
    export module appli {

        export class Creation3dDocu implements OnePage {

            pageIdAndTitle = "creation 3d "
            severalParts: SeveralParts

            constructor(private mathisFrame: MathisFrame) {
                let several = new SeveralParts()
                several.addPart(new VerticalCylinder(this.mathisFrame))

                this.severalParts = several
            }
            go() {
                return this.severalParts.go()
            }
        }

        class VerticalCylinder implements PieceOfCode{
            NAME="VerticalCylinder"
            TITLE="A vertical cylinder"

            nbU = 7
            $$$nbU=[3,4,5,6,7,10,20,30]

            nbV = 7
            $$$nbV=[3,4,5,6,7,10,20,30]


            maille=reseau.Maille.quad
            $$$maille=new Choices(allIntegerValueOfEnume(reseau.Maille),{before:"reseau.Maille.",visualValues:allStringValueOfEnume(reseau.Maille)})

            interpolationStyle=geometry.InterpolationStyle.octavioStyle
            $$$interpolationStyle=new Choices(allIntegerValueOfEnume(geometry.InterpolationStyle),{"before":"geometry.InterpolationStyle.","visualValues":allStringValueOfEnume(geometry.InterpolationStyle)})

            associateOppositeLinks_FromAnglesVersusPolygonsVersusNone=0
            $$$associateOppositeLinks_FromAnglesVersusPolygonsVersusNone=[0,1,2]


            _OUT_borderTop
            _OUT_borderBottom
            _allVertices
            _loopLines
            _straightLines


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
                let creator=new creation3D.VerticalCylinder()
                creator.maille=this.maille
                creator.nbU=this.nbU
                creator.nbV=this.nbV
                creator.associateOppositeLinks_FromAnglesVersusPolygonsVersusNone=this.associateOppositeLinks_FromAnglesVersusPolygonsVersusNone

                let mamesh=creator.go()

                this._OUT_borderTop=creator.OUT_borderTop.length
                this._OUT_borderBottom=creator.OUT_borderBottom.length
                this._allVertices=mamesh.vertices.length

                mamesh.fillLineCatalogue()
                this._loopLines=0
                this._straightLines=0
                for (let line of mamesh.lines){
                    if (line.isLoop) this._loopLines++
                    else this._straightLines++
                }

                cc('this._OUT_borderTop',this._OUT_borderTop)
                cc('this._OUT_borderBottom',this._OUT_borderBottom)
                cc('this._allVertices',this._allVertices)
                cc('this._loopLines',this._loopLines)
                cc('this._straightLines',this._straightLines)
                cc(mamesh.toString())


                //$$$end
                //$$$bh visualization
                new visu3d.VerticesViewer(mamesh, this.mathisFrame.scene).go()
                let linesViewer=new visu3d.LinesViewer(mamesh, this.mathisFrame.scene)
                linesViewer.interpolationOption.interpolationStyle = this.interpolationStyle
                linesViewer.go()
                new visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene).go()

                new visu3d.VerticesFlager(mamesh,this.mathisFrame.scene).go()




                //$$$eh
            }
        }
    }
}
