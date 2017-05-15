/**
 * Created by vigon on 09/05/2017.
 */


module mathis {


    export module totoModule {


        export class CurvedSurface implements appli.PieceOfCode {
            NAME = "CurvedSurface"
            TITLE = ""

            alpha = 0.5
            $$$alpha = [0.1, 0.3, 0.5, 0.8, 1]

            color = Color.names.rebeccapurple
            $$$color = new appli.Choices([Color.names.rebeccapurple, Color.names.rosybrown, Color.names.darkorange],
                {label: 'color: ', visualValues: ['rebeccapurple', 'rosybrown', 'darkorange']})



            sideOrientation = BABYLON.Mesh.FRONTSIDE
            $$$sideOrientation = new appli.Choices(
                [BABYLON.Mesh.DOUBLESIDE, BABYLON.Mesh.BACKSIDE, BABYLON.Mesh.FRONTSIDE],
                {label:'',visualValues: ['DOUBLESIDE', 'BACKSIDE', 'FRONTSIDE']}
            )


            constructor(private mathisFrame: MathisFrame) {
            }

            goForTheFirstTime() {


                this.mathisFrame.getGrabberCamera().changePosition(new XYZ(0,0,-6))
                this.go()
            }

            go() {


                this.mathisFrame.clearScene(false,false)

                let creator = new reseau.TriangulatedPolygone(10)
                creator.nbSubdivisionInARadius = 5
                creator.origin = new XYZ(-Math.PI * 0.8, -1, 0)
                creator.end = new XYZ(+Math.PI * 0.8, 1, 0)
                let mamesh = creator.go()

                for (let vertex of mamesh.vertices) {
                    let u = vertex.position.x
                    let v = vertex.position.y
                    vertex.position.x = Math.cos(u)
                    vertex.position.y = Math.sin(u)
                    vertex.position.z = v
                }

                let positioning = new Positioning()
                positioning.frontDir.copyFromFloats(1, 0, 1)
                positioning.applyToVertices(mamesh.vertices)


                new visu3d.LinksViewer(mamesh, this.mathisFrame.scene).go()

                let surfaceViewer = new visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene)
                surfaceViewer.alpha = this.alpha
                surfaceViewer.color = new Color(this.color)

                surfaceViewer.sideOrientation = this.sideOrientation
                surfaceViewer.go()



            }


        }

    }
}