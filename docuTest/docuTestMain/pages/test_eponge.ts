module mathis {


    export module appli {

        export class Menger implements OnePage {
            pageIdAndTitle = "Menger Sponge"

            severalParts: SeveralParts

            constructor(private mathisFrame: MathisFrame) {
                let severalParts = new SeveralParts()
                severalParts.addPart(new Eponge(this.mathisFrame))
                this.severalParts = severalParts
            }

            go() {
                return this.severalParts.go()
            }

        }

        class Eponge implements PieceOfCode {
            NAME = "Eponge"

            TITLE = "Menger Sponge, the number of hexahedron is equal to 20^k\n for subdivider = 3 and 32^k for"

            degre = 3
            $$$degre = [0, 1, 2, 3, 4, 5]

            subdivider = 3
            $$$subdivider = [3, 4]

            _test_hash: boolean
            _numberHexa: number

            constructor(private mathisFrame: MathisFrame) {
            }

            goForTheFirstTime() {

                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()
                this.mathisFrame.getGrabberCamera().changePosition(new XYZ(2, 1, -4))
                this.mathisFrame.getGrabberCamera().changeFrontDir(new XYZ(-2, -1, 4))

                this.go()
            }

            go() {

                this.mathisFrame.clearScene(false, false)

                //$$$begin
                let mamesh = new Mamesh();
                mamesh.hexahedrons = [mamesh.newVertex(new XYZ(0, 0, 0)),
                    mamesh.newVertex(new XYZ(1, 0, 0)),
                    mamesh.newVertex(new XYZ(1, 0, 1)),
                    mamesh.newVertex(new XYZ(0, 0, 1)),
                    mamesh.newVertex(new XYZ(0, 1, 1)),
                    mamesh.newVertex(new XYZ(0, 1, 0)),
                    mamesh.newVertex(new XYZ(1, 1, 0)),
                    mamesh.newVertex(new XYZ(1, 1, 1))];

                for (let k = 0; k < this.degre; k++) {
                    let m = new mameshModification.HexahedronSubdivider(mamesh);
                    m.subdivider = this.subdivider;
                    //$$$end
                    //$$$bh subdivider
                    if (m.subdivider == 3) {
                        m.suppressVolumes = [[1, 1, 0], [0, 1, 1], [1, 0, 1], [1, 1, 1], [1, 1, 2], [1, 2, 1], [2, 1, 1]];
                    }

                    if (m.subdivider == 4) {
                        m.suppressVolumes = [[1, 1, 0], [2, 1, 0], [1, 2, 0], [2, 2, 0],
                            [1, 1, 1], [2, 1, 1], [1, 2, 1], [2, 2, 1],
                            [1, 1, 2], [2, 1, 2], [1, 2, 2], [2, 2, 2],
                            [1, 1, 3], [2, 1, 3], [1, 2, 3], [2, 2, 3],
                            [1, 0, 1], [1, 0, 2], [2, 0, 1], [2, 0, 2],
                            [1, 3, 1], [1, 3, 2], [2, 3, 1], [2, 3, 2],
                            [0, 1, 1], [0, 1, 2], [0, 2, 1], [0, 2, 2],
                            [3, 1, 1], [3, 1, 2], [3, 2, 1], [3, 2, 2]]
                    }
                    //$$$eh
                    //$$$begin
                    m.go();
                    mamesh.hexahedrons = m.newHexahedrons;//.slice(56,56);
                }

                new mameshModification.SurfacesFromHexahedrons(mamesh).go();

                //$$$end

                //$$$bt
                let a = new Vertex().setPosition(1, 0, 0);
                let b = new Vertex().setPosition(2, 0, 0);
                let c = new Vertex().setPosition(3, 0, 0);
                let d = new Vertex().setPosition(4, 0, 0);

                this._test_hash = (Hash.quad(a,b,c,d) == Hash.quad(b,a,d,c))

                this._numberHexa = mamesh.hexahedrons.length / 8

                //$$$et

                //$$$bh visualization
                let surfaceViewer = new visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene);
                surfaceViewer.alpha = 1.;
                surfaceViewer.color = new Color(Color.names.darkorange);
                surfaceViewer.backFaceCulling = true;
                surfaceViewer.sideOrientation = BABYLON.Mesh.FRONTSIDE;
                //surfaceViewer.normalDuplication=visu3d.NormalDuplication.none
                let mesh = surfaceViewer.go();

                // logger.c("Squares : " + mamesh.smallestSquares.map(function(el) { return el.hashNumber; }));

                let positioning = new Positioning();
                positioning.position = new XYZ(-0.5, -0.5, -0.5);
                positioning.applyToMeshes([mesh]);
                //$$$eh

            }
        }
    }
}
