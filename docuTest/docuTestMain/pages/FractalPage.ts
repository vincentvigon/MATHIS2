module mathis {


    export module appli {

        export class FractalPage implements OnePage {
            pageIdAndTitle = "Menger Sponge"

            severalParts: SeveralParts

            constructor(private mathisFrame: MathisFrame) {
                let severalParts = new SeveralParts()
                severalParts.addPart(new DeterministicSponge(this.mathisFrame))
                severalParts.addPart(new RandomSponge(this.mathisFrame))
                //severalParts.addPart(new TestMaterials(this.mathisFrame))
                //severalParts.addPart(new Test(this.mathisFrame))

                this.severalParts = severalParts
            }

            go() {
                return this.severalParts.go()
            }
        }


        class DeterministicSponge implements PieceOfCode {
            NAME = "Eponge"

            TITLE = "Menger Sponge, by Gwenael and Paulin. The number of hexahedron is equal to 20^degree  for subdivider = 3 and 32^k for subdivider = 4. " +
                "Depending of you device, that could be long: simply close the tab of the browser  to stop  computations."

            _test_hash: boolean
            _numberHexa: number


            degre = 3
            $$$degre = [0, 1, 2, 3, 4]

            subdivider = 3
            $$$subdivider = [3, 4]


            motifChoice=0
            $$$motifChoice=[0,1,2,3,4]

            figureChoice="cube"
            $$$figureChoice=["cube","deformed cube","one degenerated"]

            // visuChoice=1
            // $$$visuChoice=[1,2]
            //
            // funcChoice="1.-(x+y+z+1.5)/3."
            // $$$funcChoice=["1.-(x+y+z+1.5)/3.","1.-x","1.-y","1.-z"]


            drawVertices=false
            $$$drawVertices=[true,false]


            drawSurface=true
            $$$drawSurface=[true,false]

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

                //$$$begin
                let mamesh = new Mamesh();


                switch (this.figureChoice)

                    //$$$end
                        //$$$bh detail of initial shape creation
                {
                    case "cube":
                    {
                        mamesh.hexahedrons = [mamesh.newVertex(new XYZ(0, 0, 0)),
                            mamesh.newVertex(new XYZ(1, 0, 0)),
                            mamesh.newVertex(new XYZ(1, 0, 1)),
                            mamesh.newVertex(new XYZ(0, 0, 1)),
                            mamesh.newVertex(new XYZ(0, 1, 1)),
                            mamesh.newVertex(new XYZ(0, 1, 0)),
                            mamesh.newVertex(new XYZ(1, 1, 0)),
                            mamesh.newVertex(new XYZ(1, 1, 1))];
                    }
                        break

                    case "deformed cube": {
                        mamesh.hexahedrons = [mamesh.newVertex(new XYZ(0, 0, 0)),
                            mamesh.newVertex(new XYZ(1, 0, 0)),
                            mamesh.newVertex(new XYZ(1, 0, 1)),
                            mamesh.newVertex(new XYZ(0, 0, 1)),
                            mamesh.newVertex(new XYZ(0, 1, 1)),
                            mamesh.newVertex(new XYZ(0, 1, 0)),
                            mamesh.newVertex(new XYZ(1, 1, 0)),
                            mamesh.newVertex(new XYZ(1, 0.5, 1)),
                            mamesh.newVertex(new XYZ(0, 0, 1)),
                            mamesh.newVertex(new XYZ(2, 0, 1)),
                            mamesh.newVertex(new XYZ(2, 0, 2)),
                            mamesh.newVertex(new XYZ(0, 0, 2)),
                            mamesh.newVertex(new XYZ(0, 1, 2)),
                            mamesh.newVertex(new XYZ(0, 1, 1)),
                            mamesh.newVertex(new XYZ(1, 0.25, 1)),
                            mamesh.newVertex(new XYZ(1, 0.25, 2))];
                    }
                    break


                    case "one degenerated":
                    {
                        mamesh.hexahedrons = [mamesh.newVertex(new XYZ(0,0,0)),
                            mamesh.newVertex(new XYZ(1,0.25,0)),
                            mamesh.newVertex(new XYZ(1,0,1)),
                            mamesh.newVertex(new XYZ(0,0.25,1)),
                            mamesh.newVertex(new XYZ(0,0.75,1)),
                            mamesh.newVertex((new XYZ(0,1,0))),
                            mamesh.newVertex(new XYZ(1,0.75,0)),
                            mamesh.newVertex(new XYZ(1,1,1))
                        ];

                    }
                        break
                }
                //$$$eh

                //$$$begin
                var subdivider=this.subdivider
                var degre=this.degre

                for (let k = 0; k < degre; k++) {
                    let m = new mameshModification.HexahedronSubdivider(mamesh);
                    m.subdivider = subdivider

                    let choiceOfCubeToSuppress=this.motifChoice
                    //$$$end


                    //$$$bh detail of cubes to suppress
                    if (m.subdivider == 3) {
                        if (choiceOfCubeToSuppress==0) m.suppressVolumes = [[1, 1, 0], [0, 1, 1], [1, 0, 1], [1, 1, 1], [1, 1, 2], [1, 2, 1], [2, 1, 1]];
                        else if (choiceOfCubeToSuppress==1) m.suppressVolumes=[[0,0,0],[0,0,2],[0,2,0],[0,2,2],[2,0,0],[2,0,2],[2,2,0],[2,2,2]]
                        else if (choiceOfCubeToSuppress==2) m.suppressVolumes=[[0,2,0],[0,2,1],[0,2,0],[0,2,1],[1,2,0],[1,2,1],[1,2,0],[1,2,1]]
                        else if (choiceOfCubeToSuppress==3) m.suppressVolumes=[[1,1,1],[1,1,2],[1,2,1],[1,2,2],[2,1,1],[2,1,2],[2,2,1],[2,2,2]]
                        else if (choiceOfCubeToSuppress==4) m.suppressVolumes=[[0,0,0],[0,0,2],[0,2,0],[0,2,2],[2,0,0],[2,0,2],[2,2,0],[2,2,2],[1,1,1],[1,1,2],[1,2,1],[1,2,2],[2,1,1],[2,1,2],[2,2,1],[2,2,2] ]


                    }

                    if (m.subdivider == 4) {
                        if (choiceOfCubeToSuppress == 0) m.suppressVolumes = [[1, 1, 0], [2, 1, 0], [1, 2, 0], [2, 2, 0], [1, 1, 1], [2, 1, 1], [1, 2, 1], [2, 2, 1], [1, 1, 2], [2, 1, 2], [1, 2, 2], [2, 2, 2], [1, 1, 3], [2, 1, 3], [1, 2, 3], [2, 2, 3], [1, 0, 1], [1, 0, 2], [2, 0, 1], [2, 0, 2], [1, 3, 1], [1, 3, 2], [2, 3, 1], [2, 3, 2], [0, 1, 1], [0, 1, 2], [0, 2, 1], [0, 2, 2], [3, 1, 1], [3, 1, 2], [3, 2, 1], [3, 2, 2]]
                        else if (choiceOfCubeToSuppress==1)m.suppressVolumes = [[2, 1, 0], [2, 2, 0], [1, 3, 0], [2, 3, 0], [2, 1, 1], [2, 2, 1], [1, 3, 1], [2, 3, 1], [2, 1, 2], [2, 2, 2], [1, 3, 2], [2, 3, 2], [2, 1, 3], [2, 2, 3], [1, 3, 3], [2, 3, 3], [2, 0, 1], [1, 1, 2], [2, 2, 1], [2, 2, 2], [2, 3, 1], [1, 0, 2], [2, 0, 1], [2, 0, 2], [1, 1, 1], [0, 2, 2], [0, 3, 1], [0, 3, 2], [0, 1, 1], [3, 2, 2], [3, 3, 1], [3, 3, 2]]
                        else if (choiceOfCubeToSuppress == 2)m.suppressVolumes = [[2, 1, 0], [2, 2, 0], [1, 3, 0], [2, 3, 0], [2, 1, 1], [2, 2, 1], [1, 3, 1], [2, 3, 1], [2, 1, 2], [2, 2, 2], [1, 3, 2], [2, 3, 2], [2, 1, 3], [2, 2, 3], [1, 3, 3], [2, 3, 3], [2, 0, 1], [1, 1, 2], [2, 2, 1], [2, 2, 2], [2, 3, 1], [1, 0, 2], [2, 0, 1], [2, 0, 2], [1, 1, 1], [0, 2, 2], [0, 3, 1], [0, 3, 2], [0, 1, 1], [3, 2, 2], [3, 3, 1], [3, 3, 2], [1, 1, 1], [2, 1, 0], [1, 2, 0], [3, 2, 0], [1, 1, 2], [2, 1, 1], [1, 2, 1], [3, 2, 1], [1, 1, 3], [2, 1, 2], [1, 2, 2], [3, 2, 2], [1, 1, 4], [2, 1, 3], [1, 2, 3], [3, 2, 3], [1, 0, 2], [1, 0, 2], [2, 0, 1], [3, 0, 2], [1, 3, 2], [1, 3, 2], [2, 3, 1], [2, 3, 2], [0, 1, 2], [0, 1, 2], [0, 2, 1], [0, 2, 2], [3, 1, 2], [3, 1, 2], [3, 2, 1], [3, 2, 2]]
                        else if (choiceOfCubeToSuppress==3)m.suppressVolumes = [[2, 1, 1], [2, 0, 1], [1, 3, 1], [2, 3,1], [2, 1, 1], [2, 0, 1], [1, 3, 1], [2, 3, 1], [2, 1, 2], [2, 0, 2], [1, 3, 2], [2, 3, 2], [2, 1, 3], [2, 0, 3], [1, 3, 3], [2, 3, 3], [2, 1, 1], [1, 1, 2], [2, 0, 1], [2,0, 2], [2, 3, 1], [1, 1, 2], [2, 1, 1], [2,1, 2], [1, 1, 1], [0, 0, 2], [0, 3, 1], [0, 3, 2], [0, 1, 1], [3, 0, 2], [3, 3, 1], [3, 3, 2], [1, 1, 1], [2, 1, 1], [1, 0, 1], [3,0,1], [1, 1, 2], [2, 1, 1], [1, 0, 1], [3,0, 1], [1, 1, 3], [2, 1, 2], [1, 0, 2], [3,0, 2], [1, 1, 4], [2, 1, 3], [1, 0, 3], [3,0, 3], [1, 1, 2], [1, 1, 2], [2, 1, 1], [3,1, 2], [1, 3, 2], [1, 3, 2], [2, 3, 1], [2, 3, 2], [0, 1, 2], [0, 1, 2], [0, 0, 1], [0,0, 2], [3, 1, 2], [3, 1, 2], [3, 0, 1], [3,0, 2]]
                        if (choiceOfCubeToSuppress==4) m.suppressVolumes = [[1, 1, 0], [2, 1, 0], [1, 2, 0], [2, 2, 0], [1, 1, 1], [2, 1, 1], [1, 2, 1], [2, 2, 1], [1, 1, 2], [2, 1, 2], [1, 2, 2], [2, 2, 2], [1, 1, 3], [2, 1, 3], [1, 2, 3], [2, 2, 3], [1, 0, 1], [1, 0, 2], [2, 0, 1], [2, 0, 2], [1, 3, 1], [1, 3, 2], [2, 3, 1], [2, 3, 2], [0, 1, 1], [0, 1, 2], [0, 2, 1], [0, 2, 2], [3, 1, 1], [3, 1, 2], [3, 2, 1], [3, 2, 2], [1, 1, 0], [0, 1, 1], [1, 0, 1], [1, 1, 1], [1, 1, 2], [1, 2, 1], [2, 1, 1], [0, 0, 0], [0, 0, 2], [0, 2, 0], [0,2,2],[2,0,0],[2,0,2],[2,2,0],[2,2,2], [1, 1, 1], [1, 1, 2], [1, 2, 1], [1,2,2],[2,1,1],[2,1,2],[2,2,1],[2,2,2]]

                    }
                    //$$$eh
                    //$$$begin
                    m.go();
                    mamesh.hexahedrons = m.newHexahedrons;
                }

                new mameshModification.SurfacesFromHexahedrons(mamesh).go();
                //$$$end




                //$$$begin
                let positioning = new Positioning();
                positioning.position = new XYZ(-0.5, -0.5, -0.5);
                positioning.applyToVertices(mamesh.vertices);


                //$$$end
                //$$$bh visualization
                if (this.drawSurface) {
                    let surfaceViewer = new visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene);
                    surfaceViewer.alpha = 1.;
                    surfaceViewer.color = new Color(Color.names.darkorange);
                    surfaceViewer.backFaceCulling = true;
                    surfaceViewer.sideOrientation = BABYLON.Mesh.FRONTSIDE;
                    surfaceViewer.go();
                }

                if (this.drawVertices) {

                    let dico = new HashMap<Vertex,boolean>(true)
                    for (let v of mamesh.smallestSquares) {
                        if (dico.getValue(v) == null) dico.putValue(v, true)
                    }

                    let cube = BABYLON.MeshBuilder.CreateBox('', {size: 1}, this.mathisFrame.scene)
                    let vertexViewer = new visu3d.VerticesViewer(dico.allKeys(), this.mathisFrame.scene)
                    vertexViewer.meshModel = cube
                    vertexViewer.radiusAbsolute = 1 / 2 / Math.pow(subdivider, degre)
                    vertexViewer.go()
                }

                //$$$eh



                //$$$bt
                this._numberHexa = mamesh.hexahedrons.length / 8
                //$$$et





            }
        }

        //
        // class Test implements PieceOfCode{
        //     NAME = "Test"
        //     TITLE = "Test the flexibility of the subdivision."
        //     degre = 3
        //     $$$degre = [0, 1, 2, 3, 4]
        //
        //     subdivider = 3
        //     $$$subdivider = [2, 3, 4]
        //
        //     motifChoice=0
        //     $$$motifChoice=[0,1,2,3,4]
        //
        //
        //     drawVertices=false
        //     $$$drawVertices=[true,false]
        //
        //
        //     drawSurface=true
        //     $$$drawSurface=[true,false]
        //
        //     figure = 1
        //     $$$figure = [1,2]
        //
        //
        //     constructor(private mathisFrame: MathisFrame) {
        //     }
        //
        //     goForTheFirstTime() {
        //
        //         this.mathisFrame.clearScene()
        //         this.mathisFrame.addDefaultCamera()
        //         this.mathisFrame.addDefaultLight()
        //         // this.mathisFrame.getGrabberCamera().changePosition(new XYZ(2, 1, -4))
        //         // this.mathisFrame.getGrabberCamera().changeFrontDir(new XYZ(-2, -1, 4))
        //         this.mathisFrame.getGrabberCamera().changePosition(new XYZ(2, 2, 2))
        //         this.mathisFrame.getGrabberCamera().changeFrontDir(new XYZ(-2, -2, -2))
        //
        //         this.go()
        //     }
        //
        //     go() {
        //
        //         this.mathisFrame.clearScene(false, false)
        //
        //         //$$$begin
        //         let mamesh = new Mamesh();
        //
        //         let figure = this.figure
        //         //$$$end
        //
        //         //$$$bh
        //
        //
        //         if (figure == 1) {
        //             mamesh.hexahedrons = [mamesh.newVertex(new XYZ(0, 0, 0)),
        //                 mamesh.newVertex(new XYZ(1, 0, 0)),
        //                 mamesh.newVertex(new XYZ(1, 0, 1)),
        //                 mamesh.newVertex(new XYZ(0, 0, 1)),
        //                 mamesh.newVertex(new XYZ(0, 1, 1)),
        //                 mamesh.newVertex(new XYZ(0, 1, 0)),
        //                 mamesh.newVertex(new XYZ(1, 1, 0)),
        //                 mamesh.newVertex(new XYZ(1, 0.5, 1)),
        //                 mamesh.newVertex(new XYZ(0, 0, 1)),
        //                 mamesh.newVertex(new XYZ(2, 0, 1)),
        //                 mamesh.newVertex(new XYZ(2, 0, 2)),
        //                 mamesh.newVertex(new XYZ(0, 0, 2)),
        //                 mamesh.newVertex(new XYZ(0, 1, 2)),
        //                 mamesh.newVertex(new XYZ(0, 1, 1)),
        //                 mamesh.newVertex(new XYZ(1, 0.25, 1)),
        //                 mamesh.newVertex(new XYZ(1, 0.25, 2))];
        //         }
        //
        //         if (figure == 2)
        //         {
        //             mamesh.hexahedrons = [mamesh.newVertex(new XYZ(0,0,0)),
        //                 mamesh.newVertex(new XYZ(1,0.25,0)),
        //                 mamesh.newVertex(new XYZ(1,0,1)),
        //                 mamesh.newVertex(new XYZ(0,0.25,1)),
        //                 mamesh.newVertex(new XYZ(0,0.75,1)),
        //                 mamesh.newVertex((new XYZ(0,1,0))),
        //                 mamesh.newVertex(new XYZ(1,0.75,0)),
        //                 mamesh.newVertex(new XYZ(1,1,1))
        //             ];
        //
        //         }
        //
        //         //$$$eh
        //         //$$$begin
        //         var subdivider=this.subdivider
        //         var degre=this.degre
        //
        //         for (let k = 0; k < degre; k++) {
        //             let m = new mameshModification.HexahedronSubdivider(mamesh);
        //             m.subdivider = subdivider
        //
        //             let motifChoice=this.motifChoice
        //
        //             //$$$end
        //             //$$$bh subdivider
        //
        //             if (m.subdivider == 2){
        //                 m.suppressVolumes = [[0,1,0],[0,1,1]]
        //             }
        //             if (m.subdivider == 3) {
        //                 if (motifChoice==0) m.suppressVolumes = [[1, 1, 0], [0, 1, 1], [1, 0, 1], [1, 1, 1], [1, 1, 2], [1, 2, 1], [2, 1, 1]];
        //                 else if (motifChoice==1) m.suppressVolumes=[[0,0,0],[0,0,2],[0,2,0],[0,2,2],[2,0,0],[2,0,2],[2,2,0],[2,2,2]]
        //                 else if (motifChoice==2) m.suppressVolumes=[[0,2,0],[0,2,1],[0,2,0],[0,2,1],[1,2,0],[1,2,1],[1,2,0],[1,2,1]]
        //                 else if (motifChoice==3) m.suppressVolumes=[[1,1,1],[1,1,2],[1,2,1],[1,2,2],[2,1,1],[2,1,2],[2,2,1],[2,2,2]]
        //                 else if (motifChoice==4) m.suppressVolumes=[[0,0,0],[0,0,2],[0,2,0],[0,2,2],[2,0,0],[2,0,2],[2,2,0],[2,2,2],[1,1,1],[1,1,2],[1,2,1],[1,2,2],[2,1,1],[2,1,2],[2,2,1],[2,2,2] ]
        //
        //
        //             }
        //
        //             if (m.subdivider == 4) {
        //                 if (motifChoice == 0) m.suppressVolumes = [[1, 1, 0], [2, 1, 0], [1, 2, 0], [2, 2, 0], [1, 1, 1], [2, 1, 1], [1, 2, 1], [2, 2, 1], [1, 1, 2], [2, 1, 2], [1, 2, 2], [2, 2, 2], [1, 1, 3], [2, 1, 3], [1, 2, 3], [2, 2, 3], [1, 0, 1], [1, 0, 2], [2, 0, 1], [2, 0, 2], [1, 3, 1], [1, 3, 2], [2, 3, 1], [2, 3, 2], [0, 1, 1], [0, 1, 2], [0, 2, 1], [0, 2, 2], [3, 1, 1], [3, 1, 2], [3, 2, 1], [3, 2, 2]]
        //                 else if (motifChoice==1)m.suppressVolumes = [[2, 1, 0], [2, 2, 0], [1, 3, 0], [2, 3, 0], [2, 1, 1], [2, 2, 1], [1, 3, 1], [2, 3, 1], [2, 1, 2], [2, 2, 2], [1, 3, 2], [2, 3, 2], [2, 1, 3], [2, 2, 3], [1, 3, 3], [2, 3, 3], [2, 0, 1], [1, 1, 2], [2, 2, 1], [2, 2, 2], [2, 3, 1], [1, 0, 2], [2, 0, 1], [2, 0, 2], [1, 1, 1], [0, 2, 2], [0, 3, 1], [0, 3, 2], [0, 1, 1], [3, 2, 2], [3, 3, 1], [3, 3, 2]]
        //                 else if (motifChoice == 2)m.suppressVolumes = [[2, 1, 0], [2, 2, 0], [1, 3, 0], [2, 3, 0], [2, 1, 1], [2, 2, 1], [1, 3, 1], [2, 3, 1], [2, 1, 2], [2, 2, 2], [1, 3, 2], [2, 3, 2], [2, 1, 3], [2, 2, 3], [1, 3, 3], [2, 3, 3], [2, 0, 1], [1, 1, 2], [2, 2, 1], [2, 2, 2], [2, 3, 1], [1, 0, 2], [2, 0, 1], [2, 0, 2], [1, 1, 1], [0, 2, 2], [0, 3, 1], [0, 3, 2], [0, 1, 1], [3, 2, 2], [3, 3, 1], [3, 3, 2], [1, 1, 1], [2, 1, 0], [1, 2, 0], [3, 2, 0], [1, 1, 2], [2, 1, 1], [1, 2, 1], [3, 2, 1], [1, 1, 3], [2, 1, 2], [1, 2, 2], [3, 2, 2], [1, 1, 4], [2, 1, 3], [1, 2, 3], [3, 2, 3], [1, 0, 2], [1, 0, 2], [2, 0, 1], [3, 0, 2], [1, 3, 2], [1, 3, 2], [2, 3, 1], [2, 3, 2], [0, 1, 2], [0, 1, 2], [0, 2, 1], [0, 2, 2], [3, 1, 2], [3, 1, 2], [3, 2, 1], [3, 2, 2]]
        //                 else if (motifChoice==3)m.suppressVolumes = [[2, 1, 1], [2, 0, 1], [1, 3, 1], [2, 3,1], [2, 1, 1], [2, 0, 1], [1, 3, 1], [2, 3, 1], [2, 1, 2], [2, 0, 2], [1, 3, 2], [2, 3, 2], [2, 1, 3], [2, 0, 3], [1, 3, 3], [2, 3, 3], [2, 1, 1], [1, 1, 2], [2, 0, 1], [2,0, 2], [2, 3, 1], [1, 1, 2], [2, 1, 1], [2,1, 2], [1, 1, 1], [0, 0, 2], [0, 3, 1], [0, 3, 2], [0, 1, 1], [3, 0, 2], [3, 3, 1], [3, 3, 2], [1, 1, 1], [2, 1, 1], [1, 0, 1], [3,0,1], [1, 1, 2], [2, 1, 1], [1, 0, 1], [3,0, 1], [1, 1, 3], [2, 1, 2], [1, 0, 2], [3,0, 2], [1, 1, 4], [2, 1, 3], [1, 0, 3], [3,0, 3], [1, 1, 2], [1, 1, 2], [2, 1, 1], [3,1, 2], [1, 3, 2], [1, 3, 2], [2, 3, 1], [2, 3, 2], [0, 1, 2], [0, 1, 2], [0, 0, 1], [0,0, 2], [3, 1, 2], [3, 1, 2], [3, 0, 1], [3,0, 2]]
        //                 if (motifChoice==4) m.suppressVolumes = [[1, 1, 0], [2, 1, 0], [1, 2, 0], [2, 2, 0], [1, 1, 1], [2, 1, 1], [1, 2, 1], [2, 2, 1], [1, 1, 2], [2, 1, 2], [1, 2, 2], [2, 2, 2], [1, 1, 3], [2, 1, 3], [1, 2, 3], [2, 2, 3], [1, 0, 1], [1, 0, 2], [2, 0, 1], [2, 0, 2], [1, 3, 1], [1, 3, 2], [2, 3, 1], [2, 3, 2], [0, 1, 1], [0, 1, 2], [0, 2, 1], [0, 2, 2], [3, 1, 1], [3, 1, 2], [3, 2, 1], [3, 2, 2], [1, 1, 0], [0, 1, 1], [1, 0, 1], [1, 1, 1], [1, 1, 2], [1, 2, 1], [2, 1, 1], [0, 0, 0], [0, 0, 2], [0, 2, 0], [0,2,2],[2,0,0],[2,0,2],[2,2,0],[2,2,2], [1, 1, 1], [1, 1, 2], [1, 2, 1], [1,2,2],[2,1,1],[2,1,2],[2,2,1],[2,2,2]]
        //
        //             }
        //             //$$$eh
        //             //$$$begin
        //             m.go();
        //             mamesh.hexahedrons = m.newHexahedrons;
        //         }
        //
        //         new mameshModification.SurfacesFromHexahedrons(mamesh).go();
        //
        //         //$$$end
        //
        //         //$$$bh visualization
        //
        //         let positioning = new Positioning();
        //         positioning.position = new XYZ(-0.5, -0.5, -0.5);
        //         positioning.applyToVertices(mamesh.vertices);
        //
        //
        //
        //         if (this.drawSurface) {
        //             let surfaceViewer = new visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene);
        //             surfaceViewer.alpha = 1.;
        //             surfaceViewer.color = new Color(Color.names.darkorange);
        //             surfaceViewer.backFaceCulling = true;
        //             surfaceViewer.sideOrientation = BABYLON.Mesh.FRONTSIDE;
        //             surfaceViewer.go();
        //         }
        //
        //
        //         if (this.drawVertices) {
        //
        //             let dico=new HashMap<Vertex,boolean>(true)
        //             for (let v of mamesh.smallestSquares){
        //                 if (dico.getValue(v)==null) dico.putValue(v,true)
        //             }
        //
        //
        //             let cube = BABYLON.MeshBuilder.CreateBox('', {size: 1}, this.mathisFrame.scene)
        //             let vertexViewer = new visu3d.VerticesViewer(dico.allKeys(), this.mathisFrame.scene)
        //             vertexViewer.meshModel = cube
        //             vertexViewer.radiusAbsolute = 1/2 / Math.pow(subdivider, degre)
        //             vertexViewer.go()
        //         }
        //
        //
        //
        //         //$$$eh
        //
        //     }
        // }

        // class DeterministicSpongeOld implements PieceOfCode {
        //     NAME = "Eponge"
        //
        //     TITLE = "Menger Sponge, by Gwenael and Paulin. The number of hexahedron is equal to 20^degree  for subdivider = 3 and 32^k for subdivider = 4. " +
        //         "Depending of you device, that could be long: simply close the tab of the browser  to stop  computations."
        //
        //     degre = 3
        //     $$$degre = [0, 1, 2, 3, 4]
        //
        //     subdivider = 3
        //     $$$subdivider = [3, 4]
        //
        //
        //     motifChoice=0
        //     $$$motifChoice=[0,1,2,3,4]
        //
        //
        //     drawVertices=false
        //     $$$drawVertices=[true,false]
        //
        //
        //     drawSurface=true
        //     $$$drawSurface=[true,false]
        //
        //     _test_hash: boolean
        //     _numberHexa: number
        //
        //
        //
        //     constructor(private mathisFrame: MathisFrame) {
        //     }
        //
        //     goForTheFirstTime() {
        //
        //         this.mathisFrame.clearScene()
        //         this.mathisFrame.addDefaultCamera()
        //         this.mathisFrame.addDefaultLight()
        //         // this.mathisFrame.getGrabberCamera().changePosition(new XYZ(2, 1, -4))
        //         // this.mathisFrame.getGrabberCamera().changeFrontDir(new XYZ(-2, -1, 4))
        //         this.mathisFrame.getGrabberCamera().changePosition(new XYZ(2, 2, 2))
        //         this.mathisFrame.getGrabberCamera().changeFrontDir(new XYZ(-2, -2, -2))
        //
        //         this.go()
        //     }
        //
        //     go() {
        //
        //         this.mathisFrame.clearScene(false, false)
        //
        //         //$$$begin
        //         let mamesh = new Mamesh();
        //         mamesh.hexahedrons = [mamesh.newVertex(new XYZ(0, 0, 0)),
        //             mamesh.newVertex(new XYZ(1, 0, 0)),
        //             mamesh.newVertex(new XYZ(1, 0, 1)),
        //             mamesh.newVertex(new XYZ(0, 0, 1)),
        //             mamesh.newVertex(new XYZ(0, 1, 1)),
        //             mamesh.newVertex(new XYZ(0, 1, 0)),
        //             mamesh.newVertex(new XYZ(1, 1, 0)),
        //             mamesh.newVertex(new XYZ(1, 1, 1))];
        //
        //         var subdivider=this.subdivider
        //         var degre=this.degre
        //
        //         for (let k = 0; k < degre; k++) {
        //             let m = new mameshModification.HexahedronSubdivider(mamesh);
        //             m.subdivider = subdivider
        //
        //             let motifChoice=this.motifChoice
        //
        //             //$$$end
        //             //$$$bh subdivider
        //
        //
        //             if (m.subdivider == 3) {
        //                 if (motifChoice==0) m.suppressVolumes = [[1, 1, 0], [0, 1, 1], [1, 0, 1], [1, 1, 1], [1, 1, 2], [1, 2, 1], [2, 1, 1]];
        //                 else if (motifChoice==1) m.suppressVolumes=[[0,0,0],[0,0,2],[0,2,0],[0,2,2],[2,0,0],[2,0,2],[2,2,0],[2,2,2]]
        //                 else if (motifChoice==2) m.suppressVolumes=[[0,2,0],[0,2,1],[0,2,0],[0,2,1],[1,2,0],[1,2,1],[1,2,0],[1,2,1]]
        //                 else if (motifChoice==3) m.suppressVolumes=[[1,1,1],[1,1,2],[1,2,1],[1,2,2],[2,1,1],[2,1,2],[2,2,1],[2,2,2]]
        //                 else if (motifChoice==4) m.suppressVolumes=[[0,0,0],[0,0,2],[0,2,0],[0,2,2],[2,0,0],[2,0,2],[2,2,0],[2,2,2],[1,1,1],[1,1,2],[1,2,1],[1,2,2],[2,1,1],[2,1,2],[2,2,1],[2,2,2] ]
        //
        //
        //             }
        //
        //             if (m.subdivider == 4) {
        //                 if (motifChoice == 0) m.suppressVolumes = [[1, 1, 0], [2, 1, 0], [1, 2, 0], [2, 2, 0], [1, 1, 1], [2, 1, 1], [1, 2, 1], [2, 2, 1], [1, 1, 2], [2, 1, 2], [1, 2, 2], [2, 2, 2], [1, 1, 3], [2, 1, 3], [1, 2, 3], [2, 2, 3], [1, 0, 1], [1, 0, 2], [2, 0, 1], [2, 0, 2], [1, 3, 1], [1, 3, 2], [2, 3, 1], [2, 3, 2], [0, 1, 1], [0, 1, 2], [0, 2, 1], [0, 2, 2], [3, 1, 1], [3, 1, 2], [3, 2, 1], [3, 2, 2]]
        //                 else if (motifChoice==1)m.suppressVolumes = [[2, 1, 0], [2, 2, 0], [1, 3, 0], [2, 3, 0], [2, 1, 1], [2, 2, 1], [1, 3, 1], [2, 3, 1], [2, 1, 2], [2, 2, 2], [1, 3, 2], [2, 3, 2], [2, 1, 3], [2, 2, 3], [1, 3, 3], [2, 3, 3], [2, 0, 1], [1, 1, 2], [2, 2, 1], [2, 2, 2], [2, 3, 1], [1, 0, 2], [2, 0, 1], [2, 0, 2], [1, 1, 1], [0, 2, 2], [0, 3, 1], [0, 3, 2], [0, 1, 1], [3, 2, 2], [3, 3, 1], [3, 3, 2]]
        //                 else if (motifChoice == 2)m.suppressVolumes = [[2, 1, 0], [2, 2, 0], [1, 3, 0], [2, 3, 0], [2, 1, 1], [2, 2, 1], [1, 3, 1], [2, 3, 1], [2, 1, 2], [2, 2, 2], [1, 3, 2], [2, 3, 2], [2, 1, 3], [2, 2, 3], [1, 3, 3], [2, 3, 3], [2, 0, 1], [1, 1, 2], [2, 2, 1], [2, 2, 2], [2, 3, 1], [1, 0, 2], [2, 0, 1], [2, 0, 2], [1, 1, 1], [0, 2, 2], [0, 3, 1], [0, 3, 2], [0, 1, 1], [3, 2, 2], [3, 3, 1], [3, 3, 2], [1, 1, 1], [2, 1, 0], [1, 2, 0], [3, 2, 0], [1, 1, 2], [2, 1, 1], [1, 2, 1], [3, 2, 1], [1, 1, 3], [2, 1, 2], [1, 2, 2], [3, 2, 2], [1, 1, 4], [2, 1, 3], [1, 2, 3], [3, 2, 3], [1, 0, 2], [1, 0, 2], [2, 0, 1], [3, 0, 2], [1, 3, 2], [1, 3, 2], [2, 3, 1], [2, 3, 2], [0, 1, 2], [0, 1, 2], [0, 2, 1], [0, 2, 2], [3, 1, 2], [3, 1, 2], [3, 2, 1], [3, 2, 2]]
        //                 else if (motifChoice==3)m.suppressVolumes = [[2, 1, 1], [2, 0, 1], [1, 3, 1], [2, 3,1], [2, 1, 1], [2, 0, 1], [1, 3, 1], [2, 3, 1], [2, 1, 2], [2, 0, 2], [1, 3, 2], [2, 3, 2], [2, 1, 3], [2, 0, 3], [1, 3, 3], [2, 3, 3], [2, 1, 1], [1, 1, 2], [2, 0, 1], [2,0, 2], [2, 3, 1], [1, 1, 2], [2, 1, 1], [2,1, 2], [1, 1, 1], [0, 0, 2], [0, 3, 1], [0, 3, 2], [0, 1, 1], [3, 0, 2], [3, 3, 1], [3, 3, 2], [1, 1, 1], [2, 1, 1], [1, 0, 1], [3,0,1], [1, 1, 2], [2, 1, 1], [1, 0, 1], [3,0, 1], [1, 1, 3], [2, 1, 2], [1, 0, 2], [3,0, 2], [1, 1, 4], [2, 1, 3], [1, 0, 3], [3,0, 3], [1, 1, 2], [1, 1, 2], [2, 1, 1], [3,1, 2], [1, 3, 2], [1, 3, 2], [2, 3, 1], [2, 3, 2], [0, 1, 2], [0, 1, 2], [0, 0, 1], [0,0, 2], [3, 1, 2], [3, 1, 2], [3, 0, 1], [3,0, 2]]
        //                 if (motifChoice==4) m.suppressVolumes = [[1, 1, 0], [2, 1, 0], [1, 2, 0], [2, 2, 0], [1, 1, 1], [2, 1, 1], [1, 2, 1], [2, 2, 1], [1, 1, 2], [2, 1, 2], [1, 2, 2], [2, 2, 2], [1, 1, 3], [2, 1, 3], [1, 2, 3], [2, 2, 3], [1, 0, 1], [1, 0, 2], [2, 0, 1], [2, 0, 2], [1, 3, 1], [1, 3, 2], [2, 3, 1], [2, 3, 2], [0, 1, 1], [0, 1, 2], [0, 2, 1], [0, 2, 2], [3, 1, 1], [3, 1, 2], [3, 2, 1], [3, 2, 2], [1, 1, 0], [0, 1, 1], [1, 0, 1], [1, 1, 1], [1, 1, 2], [1, 2, 1], [2, 1, 1], [0, 0, 0], [0, 0, 2], [0, 2, 0], [0,2,2],[2,0,0],[2,0,2],[2,2,0],[2,2,2], [1, 1, 1], [1, 1, 2], [1, 2, 1], [1,2,2],[2,1,1],[2,1,2],[2,2,1],[2,2,2]]
        //
        //             }
        //             //$$$eh
        //             //$$$begin
        //             m.go();
        //             mamesh.hexahedrons = m.newHexahedrons;
        //         }
        //
        //         new mameshModification.SurfacesFromHexahedrons(mamesh).go();
        //
        //         //$$$end
        //
        //         //$$$bt
        //         let a = new Vertex().setPosition(1, 0, 0);
        //         let b = new Vertex().setPosition(2, 0, 0);
        //         let c = new Vertex().setPosition(3, 0, 0);
        //         let d = new Vertex().setPosition(4, 0, 0);
        //
        //         this._test_hash = (Hash.quad(a,b,c,d) == Hash.quad(b,a,d,c))
        //
        //         this._numberHexa = mamesh.hexahedrons.length / 8
        //
        //         //$$$et
        //
        //         //$$$bh visualization
        //
        //         let positioning = new Positioning();
        //         positioning.position = new XYZ(-0.5, -0.5, -0.5);
        //         positioning.applyToVertices(mamesh.vertices);
        //
        //
        //
        //         if (this.drawSurface) {
        //             let surfaceViewer = new visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene);
        //             surfaceViewer.alpha = 1.;
        //             surfaceViewer.color = new Color(Color.names.darkorange);
        //             surfaceViewer.backFaceCulling = true;
        //             surfaceViewer.sideOrientation = BABYLON.Mesh.FRONTSIDE;
        //             surfaceViewer.go();
        //         }
        //
        //
        //         if (this.drawVertices) {
        //
        //             let dico=new HashMap<Vertex,boolean>(true)
        //             for (let v of mamesh.smallestSquares){
        //                 if (dico.getValue(v)==null) dico.putValue(v,true)
        //             }
        //
        //
        //             let cube = BABYLON.MeshBuilder.CreateBox('', {size: 1}, this.mathisFrame.scene)
        //             let vertexViewer = new visu3d.VerticesViewer(dico.allKeys(), this.mathisFrame.scene)
        //             vertexViewer.meshModel = cube
        //             vertexViewer.radiusAbsolute = 1/2 / Math.pow(subdivider, degre)
        //             vertexViewer.go()
        //         }
        //
        //
        //
        //         //$$$eh
        //
        //     }
        // }


        class RandomSponge implements PieceOfCode {
            NAME = "EpongeRandom"

            TITLE = "Random Menger Sponge"

            degree = 3
            $$$degree = [0, 1, 2, 3, 4,5]

            subdivider = 3
            $$$subdivider = [2,3, 4]


            drawSurface=true
            $$$drawSurface=[true,false]


            drawVertices=false
            $$$drawVertices=[true,false]


            propLevel0=0.5
            $$$propLevel0=[0.3,0.4,0.5,0.6,0.7,0.8,0.9,0.95]

            propLevel1=0.5
            $$$propLevel1=[0.3,0.4,0.5,0.6,0.7,0.8,0.9,0.95]

            propLevel2=0.5
            $$$propLevel2=[0.3,0.4,0.5,0.6,0.7,0.8,0.9,0.95]

            propLevel3=0.5
            $$$propLevel3=[0.3,0.4,0.5,0.6,0.7,0.8,0.9,0.95]

            propLevel4=0.5
            $$$propLevel4=[0.3,0.4,0.5,0.6,0.7,0.8,0.9,0.95]

            seed=2463456
            $$$seed=[2463456,87643457,35843543]


            _test_hash: boolean
            _numberHexa: number



            constructor(private mathisFrame: MathisFrame) {



            }

            goForTheFirstTime() {

                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()
                // this.mathisFrame.getGrabberCamera().changePosition(new XYZ(2, 1, -4))
                // this.mathisFrame.getGrabberCamera().changeFrontDir(new XYZ(-2, -1, 4))
                this.mathisFrame.getGrabberCamera().changePosition(new XYZ(2, 2, 2))
                this.mathisFrame.getGrabberCamera().changeFrontDir(new XYZ(-2, -2, -2))

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

                var subdivider=this.subdivider
                var degree=this.degree


                var proportionSuppressedByLevel:number[]=[this.propLevel0,this.propLevel1,this.propLevel2,this.propLevel3,this.propLevel4]

                var random=new proba.Random(this.seed)

                for (var k = 0; k < degree; k++) {
                    var m = new mameshModification.HexahedronSubdivider(mamesh);
                    m.subdivider = subdivider


                    let all=[]
                    for (var a=0;a<subdivider;a++){
                        for (var b=0;b<subdivider;b++){
                            for (var c=0;c<subdivider;c++){
                                    all.push([a,b,c])
                            }
                        }
                    }
                    var suppressed=[]

                    var indexToProba=[]
                    for (let i=0;i<all.length;i++) indexToProba.push(random.pseudoRand())

                    for (let i=0;i<all.length;i++){
                        if (indexToProba[i]<proportionSuppressedByLevel[k]) suppressed.push(all[i])
                    }
                    m.suppressVolumes=suppressed


                    m.go();
                    mamesh.hexahedrons = m.newHexahedrons;
                }

                new mameshModification.SurfacesFromHexahedrons(mamesh).go();

                //$$$end



                //$$$bh visualization

                var positioning = new Positioning();
                positioning.position = new XYZ(-0.5, -0.5, -0.5);
                positioning.applyToVertices(mamesh.vertices);



                if (this.drawSurface) {
                    let surfaceViewer = new visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene);
                    surfaceViewer.alpha = 1.;
                    surfaceViewer.color = new Color(Color.names.darkorange);
                    surfaceViewer.backFaceCulling = true;
                    surfaceViewer.sideOrientation = BABYLON.Mesh.FRONTSIDE;
                    surfaceViewer.normalDuplication=visu3d.NormalDuplication.duplicateOnlyWhenNormalsAreTooFarr
                    surfaceViewer.go();
                }


                if (this.drawVertices) {

                    let dico=new HashMap<Vertex,boolean>(true)
                    for (let v of mamesh.smallestSquares){
                        if (dico.getValue(v)==null) dico.putValue(v,true)
                    }


                    let cube = BABYLON.MeshBuilder.CreateBox('', {size: 1}, this.mathisFrame.scene)
                    let vertexViewer = new visu3d.VerticesViewer(dico.allKeys(), this.mathisFrame.scene)
                    vertexViewer.meshModel = cube
                    vertexViewer.radiusAbsolute = 1/2 / Math.pow(subdivider, degree)
                    vertexViewer.go()
                }



                //$$$eh







            }





        }


        // class TestMaterials implements PieceOfCode{
        //     NAME = " Test Materials"
        //
        //     TITLE = "Test of materials on Menger Sponge."+
        //         " func can use variable of double type, x, y, z, cos and sin,"+
        //         " you can use thes different symbols : +, -, *, / . "
        //     degre = 2
        //     $$$degre = [0, 1, 2, 3, 4]
        //
        //     subdivider = 3
        //     $$$subdivider = [3, 4]
        //
        //
        //     motifChoice=0
        //     $$$motifChoice=[0,1,2,3,4]
        //
        //     funcChoice="1. - 0.333*x + 0.333*y + 0.333*z"
        //     $$$funcChoice = ["1. - 0.333*x + 0.333*y + 0.333*z","1. - z","1. -x","1. -y"]
        //
        //     constructor(private mathisFrame: MathisFrame) {
        //     }
        //
        //     goForTheFirstTime() {
        //
        //         this.mathisFrame.clearScene()
        //         this.mathisFrame.addDefaultCamera()
        //         this.mathisFrame.addDefaultLight()
        //         // this.mathisFrame.getGrabberCamera().changePosition(new XYZ(2, 1, -4))
        //         // this.mathisFrame.getGrabberCamera().changeFrontDir(new XYZ(-2, -1, 4))
        //         this.mathisFrame.getGrabberCamera().changePosition(new XYZ(2, 2, 2))
        //         this.mathisFrame.getGrabberCamera().changeFrontDir(new XYZ(-2, -2, -2))
        //
        //         this.go()
        //     }
        //
        //     go() {
        //
        //         this.mathisFrame.clearScene(false, false)
        //
        //         //$$$begin
        //         let mamesh = new Mamesh();
        //         mamesh.hexahedrons = [mamesh.newVertex(new XYZ(0, 0, 0)),
        //             mamesh.newVertex(new XYZ(1, 0, 0)),
        //             mamesh.newVertex(new XYZ(1, 0, 1)),
        //             mamesh.newVertex(new XYZ(0, 0, 1)),
        //             mamesh.newVertex(new XYZ(0, 1, 1)),
        //             mamesh.newVertex(new XYZ(0, 1, 0)),
        //             mamesh.newVertex(new XYZ(1, 1, 0)),
        //             mamesh.newVertex(new XYZ(1, 1, 1))];
        //
        //         var subdivider=this.subdivider
        //         var degre=this.degre
        //
        //         for (let k = 0; k < degre; k++) {
        //             let m = new mameshModification.HexahedronSubdivider(mamesh);
        //             m.subdivider = subdivider
        //
        //             let motifChoice=this.motifChoice
        //
        //             //$$$end
        //             //$$$bh subdivider
        //
        //
        //             if (m.subdivider == 3) {
        //                 if (motifChoice==0) m.suppressVolumes = [[1, 1, 0], [0, 1, 1], [1, 0, 1], [1, 1, 1], [1, 1, 2], [1, 2, 1], [2, 1, 1]];
        //                 else if (motifChoice==1) m.suppressVolumes=[[0,0,0],[0,0,2],[0,2,0],[0,2,2],[2,0,0],[2,0,2],[2,2,0],[2,2,2]]
        //                 else if (motifChoice==2) m.suppressVolumes=[[0,2,0],[0,2,1],[0,2,0],[0,2,1],[1,2,0],[1,2,1],[1,2,0],[1,2,1]]
        //                 else if (motifChoice==3) m.suppressVolumes=[[1,1,1],[1,1,2],[1,2,1],[1,2,2],[2,1,1],[2,1,2],[2,2,1],[2,2,2]]
        //                 else if (motifChoice==4) m.suppressVolumes=[[0,0,0],[0,0,2],[0,2,0],[0,2,2],[2,0,0],[2,0,2],[2,2,0],[2,2,2],[1,1,1],[1,1,2],[1,2,1],[1,2,2],[2,1,1],[2,1,2],[2,2,1],[2,2,2] ]
        //
        //
        //             }
        //
        //             if (m.subdivider == 4) {
        //                 if (motifChoice == 0) m.suppressVolumes = [[1, 1, 0], [2, 1, 0], [1, 2, 0], [2, 2, 0], [1, 1, 1], [2, 1, 1], [1, 2, 1], [2, 2, 1], [1, 1, 2], [2, 1, 2], [1, 2, 2], [2, 2, 2], [1, 1, 3], [2, 1, 3], [1, 2, 3], [2, 2, 3], [1, 0, 1], [1, 0, 2], [2, 0, 1], [2, 0, 2], [1, 3, 1], [1, 3, 2], [2, 3, 1], [2, 3, 2], [0, 1, 1], [0, 1, 2], [0, 2, 1], [0, 2, 2], [3, 1, 1], [3, 1, 2], [3, 2, 1], [3, 2, 2]]
        //                 else if (motifChoice==1)m.suppressVolumes = [[2, 1, 0], [2, 2, 0], [1, 3, 0], [2, 3, 0], [2, 1, 1], [2, 2, 1], [1, 3, 1], [2, 3, 1], [2, 1, 2], [2, 2, 2], [1, 3, 2], [2, 3, 2], [2, 1, 3], [2, 2, 3], [1, 3, 3], [2, 3, 3], [2, 0, 1], [1, 1, 2], [2, 2, 1], [2, 2, 2], [2, 3, 1], [1, 0, 2], [2, 0, 1], [2, 0, 2], [1, 1, 1], [0, 2, 2], [0, 3, 1], [0, 3, 2], [0, 1, 1], [3, 2, 2], [3, 3, 1], [3, 3, 2]]
        //                 else if (motifChoice == 2)m.suppressVolumes = [[2, 1, 0], [2, 2, 0], [1, 3, 0], [2, 3, 0], [2, 1, 1], [2, 2, 1], [1, 3, 1], [2, 3, 1], [2, 1, 2], [2, 2, 2], [1, 3, 2], [2, 3, 2], [2, 1, 3], [2, 2, 3], [1, 3, 3], [2, 3, 3], [2, 0, 1], [1, 1, 2], [2, 2, 1], [2, 2, 2], [2, 3, 1], [1, 0, 2], [2, 0, 1], [2, 0, 2], [1, 1, 1], [0, 2, 2], [0, 3, 1], [0, 3, 2], [0, 1, 1], [3, 2, 2], [3, 3, 1], [3, 3, 2], [1, 1, 1], [2, 1, 0], [1, 2, 0], [3, 2, 0], [1, 1, 2], [2, 1, 1], [1, 2, 1], [3, 2, 1], [1, 1, 3], [2, 1, 2], [1, 2, 2], [3, 2, 2], [1, 1, 4], [2, 1, 3], [1, 2, 3], [3, 2, 3], [1, 0, 2], [1, 0, 2], [2, 0, 1], [3, 0, 2], [1, 3, 2], [1, 3, 2], [2, 3, 1], [2, 3, 2], [0, 1, 2], [0, 1, 2], [0, 2, 1], [0, 2, 2], [3, 1, 2], [3, 1, 2], [3, 2, 1], [3, 2, 2]]
        //                 else if (motifChoice==3)m.suppressVolumes = [[2, 1, 1], [2, 0, 1], [1, 3, 1], [2, 3,1], [2, 1, 1], [2, 0, 1], [1, 3, 1], [2, 3, 1], [2, 1, 2], [2, 0, 2], [1, 3, 2], [2, 3, 2], [2, 1, 3], [2, 0, 3], [1, 3, 3], [2, 3, 3], [2, 1, 1], [1, 1, 2], [2, 0, 1], [2,0, 2], [2, 3, 1], [1, 1, 2], [2, 1, 1], [2,1, 2], [1, 1, 1], [0, 0, 2], [0, 3, 1], [0, 3, 2], [0, 1, 1], [3, 0, 2], [3, 3, 1], [3, 3, 2], [1, 1, 1], [2, 1, 1], [1, 0, 1], [3,0,1], [1, 1, 2], [2, 1, 1], [1, 0, 1], [3,0, 1], [1, 1, 3], [2, 1, 2], [1, 0, 2], [3,0, 2], [1, 1, 4], [2, 1, 3], [1, 0, 3], [3,0, 3], [1, 1, 2], [1, 1, 2], [2, 1, 1], [3,1, 2], [1, 3, 2], [1, 3, 2], [2, 3, 1], [2, 3, 2], [0, 1, 2], [0, 1, 2], [0, 0, 1], [0,0, 2], [3, 1, 2], [3, 1, 2], [3, 0, 1], [3,0, 2]]
        //                 if (motifChoice==4) m.suppressVolumes = [[1, 1, 0], [2, 1, 0], [1, 2, 0], [2, 2, 0], [1, 1, 1], [2, 1, 1], [1, 2, 1], [2, 2, 1], [1, 1, 2], [2, 1, 2], [1, 2, 2], [2, 2, 2], [1, 1, 3], [2, 1, 3], [1, 2, 3], [2, 2, 3], [1, 0, 1], [1, 0, 2], [2, 0, 1], [2, 0, 2], [1, 3, 1], [1, 3, 2], [2, 3, 1], [2, 3, 2], [0, 1, 1], [0, 1, 2], [0, 2, 1], [0, 2, 2], [3, 1, 1], [3, 1, 2], [3, 2, 1], [3, 2, 2], [1, 1, 0], [0, 1, 1], [1, 0, 1], [1, 1, 1], [1, 1, 2], [1, 2, 1], [2, 1, 1], [0, 0, 0], [0, 0, 2], [0, 2, 0], [0,2,2],[2,0,0],[2,0,2],[2,2,0],[2,2,2], [1, 1, 1], [1, 1, 2], [1, 2, 1], [1,2,2],[2,1,1],[2,1,2],[2,2,1],[2,2,2]]
        //
        //             }
        //             //$$$eh
        //             //$$$begin
        //             m.go();
        //             mamesh.hexahedrons = m.newHexahedrons;
        //         }
        //
        //         new mameshModification.SurfacesFromHexahedrons(mamesh).go();
        //         let func = this.funcChoice
        //         //$$$end
        //
        //
        //         //$$$bh
        //
        //         let positioning = new mathis.Positioning();
        //         positioning.position = new XYZ(-0.5,-0.5,-0.5);
        //         positioning.applyToVertices(mamesh.vertices);
        //
        //         let surfaceViewer = new mathis.visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene);
        //
        //         let material = new mathis.materials.FuncMapperShader(func,this.mathisFrame.scene);
        //         material.gradient = new mathis.materials.GradientColor(
        //             [new mathis.Color("#FF0000"),
        //             new mathis.Color("#FFFF00"),
        //             new mathis.Color("#00FF00"),
        //             new mathis.Color("#00FFFF"),
        //             new mathis.Color("#0000FF"),
        //             new mathis.Color("#FF00FF")]
        //         );
        //         surfaceViewer.material = material.go();
        //         surfaceViewer.backFaceCulling = true;
        //         surfaceViewer.sideOrientation = BABYLON.Mesh.DOUBLESIDE;
        //         surfaceViewer.normalDuplication = visu3d.NormalDuplication.none;
        //
        //
        //
        //         let mesh = surfaceViewer.go();
        //
        //
        //         //$$$eh
        //
        //     }
        //
        // }




    }

}

