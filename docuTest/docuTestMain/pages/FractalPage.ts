module mathis {


    export module appli {

        export class FractalPage implements OnePage {
            pageIdAndTitle = "Menger Sponge"

            severalParts: SeveralParts

            constructor(private mathisFrame: MathisFrame) {
                let severalParts = new SeveralParts()
                severalParts.addPart(new DeterministicSponge(this.mathisFrame))
                severalParts.addPart(new RandomSponge(this.mathisFrame))

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

            degre = 3
            $$$degre = [0, 1, 2, 3, 4]

            subdivider = 3
            $$$subdivider = [3, 4]


            motifChoice=0
            $$$motifChoice=[0,1,2,3,4]


            drawVertices=false
            $$$drawVertices=[true,false]


            drawSurface=true
            $$$drawSurface=[true,false]

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
                var degre=this.degre

                for (let k = 0; k < degre; k++) {
                    let m = new mameshModification.HexahedronSubdivider(mamesh);
                    m.subdivider = subdivider

                    let motifChoice=this.motifChoice

                    //$$$end
                    //$$$bh subdivider


                    if (m.subdivider == 3) {
                        if (motifChoice==0) m.suppressVolumes = [[1, 1, 0], [0, 1, 1], [1, 0, 1], [1, 1, 1], [1, 1, 2], [1, 2, 1], [2, 1, 1]];
                        else if (motifChoice==1) m.suppressVolumes=[[0,0,0],[0,0,2],[0,2,0],[0,2,2],[2,0,0],[2,0,2],[2,2,0],[2,2,2]]
                        else if (motifChoice==2) m.suppressVolumes=[[0,2,0],[0,2,1],[0,2,0],[0,2,1],[1,2,0],[1,2,1],[1,2,0],[1,2,1]]
                        else if (motifChoice==3) m.suppressVolumes=[[1,1,1],[1,1,2],[1,2,1],[1,2,2],[2,1,1],[2,1,2],[2,2,1],[2,2,2]]
                        else if (motifChoice==4) m.suppressVolumes=[[0,0,0],[0,0,2],[0,2,0],[0,2,2],[2,0,0],[2,0,2],[2,2,0],[2,2,2],[1,1,1],[1,1,2],[1,2,1],[1,2,2],[2,1,1],[2,1,2],[2,2,1],[2,2,2] ]


                    }

                    if (m.subdivider == 4) {
                        if (motifChoice == 0) m.suppressVolumes = [[1, 1, 0], [2, 1, 0], [1, 2, 0], [2, 2, 0], [1, 1, 1], [2, 1, 1], [1, 2, 1], [2, 2, 1], [1, 1, 2], [2, 1, 2], [1, 2, 2], [2, 2, 2], [1, 1, 3], [2, 1, 3], [1, 2, 3], [2, 2, 3], [1, 0, 1], [1, 0, 2], [2, 0, 1], [2, 0, 2], [1, 3, 1], [1, 3, 2], [2, 3, 1], [2, 3, 2], [0, 1, 1], [0, 1, 2], [0, 2, 1], [0, 2, 2], [3, 1, 1], [3, 1, 2], [3, 2, 1], [3, 2, 2]]
                        else if (motifChoice==1)m.suppressVolumes = [[2, 1, 0], [2, 2, 0], [1, 3, 0], [2, 3, 0], [2, 1, 1], [2, 2, 1], [1, 3, 1], [2, 3, 1], [2, 1, 2], [2, 2, 2], [1, 3, 2], [2, 3, 2], [2, 1, 3], [2, 2, 3], [1, 3, 3], [2, 3, 3], [2, 0, 1], [1, 1, 2], [2, 2, 1], [2, 2, 2], [2, 3, 1], [1, 0, 2], [2, 0, 1], [2, 0, 2], [1, 1, 1], [0, 2, 2], [0, 3, 1], [0, 3, 2], [0, 1, 1], [3, 2, 2], [3, 3, 1], [3, 3, 2]]
                        else if (motifChoice == 2)m.suppressVolumes = [[2, 1, 0], [2, 2, 0], [1, 3, 0], [2, 3, 0], [2, 1, 1], [2, 2, 1], [1, 3, 1], [2, 3, 1], [2, 1, 2], [2, 2, 2], [1, 3, 2], [2, 3, 2], [2, 1, 3], [2, 2, 3], [1, 3, 3], [2, 3, 3], [2, 0, 1], [1, 1, 2], [2, 2, 1], [2, 2, 2], [2, 3, 1], [1, 0, 2], [2, 0, 1], [2, 0, 2], [1, 1, 1], [0, 2, 2], [0, 3, 1], [0, 3, 2], [0, 1, 1], [3, 2, 2], [3, 3, 1], [3, 3, 2], [1, 1, 1], [2, 1, 0], [1, 2, 0], [3, 2, 0], [1, 1, 2], [2, 1, 1], [1, 2, 1], [3, 2, 1], [1, 1, 3], [2, 1, 2], [1, 2, 2], [3, 2, 2], [1, 1, 4], [2, 1, 3], [1, 2, 3], [3, 2, 3], [1, 0, 2], [1, 0, 2], [2, 0, 1], [3, 0, 2], [1, 3, 2], [1, 3, 2], [2, 3, 1], [2, 3, 2], [0, 1, 2], [0, 1, 2], [0, 2, 1], [0, 2, 2], [3, 1, 2], [3, 1, 2], [3, 2, 1], [3, 2, 2]]
                        else if (motifChoice==3)m.suppressVolumes = [[2, 1, 1], [2, 0, 1], [1, 3, 1], [2, 3,1], [2, 1, 1], [2, 0, 1], [1, 3, 1], [2, 3, 1], [2, 1, 2], [2, 0, 2], [1, 3, 2], [2, 3, 2], [2, 1, 3], [2, 0, 3], [1, 3, 3], [2, 3, 3], [2, 1, 1], [1, 1, 2], [2, 0, 1], [2,0, 2], [2, 3, 1], [1, 1, 2], [2, 1, 1], [2,1, 2], [1, 1, 1], [0, 0, 2], [0, 3, 1], [0, 3, 2], [0, 1, 1], [3, 0, 2], [3, 3, 1], [3, 3, 2], [1, 1, 1], [2, 1, 1], [1, 0, 1], [3,0,1], [1, 1, 2], [2, 1, 1], [1, 0, 1], [3,0, 1], [1, 1, 3], [2, 1, 2], [1, 0, 2], [3,0, 2], [1, 1, 4], [2, 1, 3], [1, 0, 3], [3,0, 3], [1, 1, 2], [1, 1, 2], [2, 1, 1], [3,1, 2], [1, 3, 2], [1, 3, 2], [2, 3, 1], [2, 3, 2], [0, 1, 2], [0, 1, 2], [0, 0, 1], [0,0, 2], [3, 1, 2], [3, 1, 2], [3, 0, 1], [3,0, 2]]
                        if (motifChoice==4) m.suppressVolumes = [[1, 1, 0], [2, 1, 0], [1, 2, 0], [2, 2, 0], [1, 1, 1], [2, 1, 1], [1, 2, 1], [2, 2, 1], [1, 1, 2], [2, 1, 2], [1, 2, 2], [2, 2, 2], [1, 1, 3], [2, 1, 3], [1, 2, 3], [2, 2, 3], [1, 0, 1], [1, 0, 2], [2, 0, 1], [2, 0, 2], [1, 3, 1], [1, 3, 2], [2, 3, 1], [2, 3, 2], [0, 1, 1], [0, 1, 2], [0, 2, 1], [0, 2, 2], [3, 1, 1], [3, 1, 2], [3, 2, 1], [3, 2, 2], [1, 1, 0], [0, 1, 1], [1, 0, 1], [1, 1, 1], [1, 1, 2], [1, 2, 1], [2, 1, 1], [0, 0, 0], [0, 0, 2], [0, 2, 0], [0,2,2],[2,0,0],[2,0,2],[2,2,0],[2,2,2], [1, 1, 1], [1, 1, 2], [1, 2, 1], [1,2,2],[2,1,1],[2,1,2],[2,2,1],[2,2,2]]

                    }
                    //$$$eh
                    //$$$begin
                    m.go();
                    mamesh.hexahedrons = m.newHexahedrons;
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

                let positioning = new Positioning();
                positioning.position = new XYZ(-0.5, -0.5, -0.5);
                positioning.applyToVertices(mamesh.vertices);



                if (this.drawSurface) {
                    let surfaceViewer = new visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene);
                    surfaceViewer.alpha = 1.;
                    surfaceViewer.color = new Color(Color.names.darkorange);
                    surfaceViewer.backFaceCulling = true;
                    surfaceViewer.sideOrientation = BABYLON.Mesh.FRONTSIDE;
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
                    vertexViewer.constantRadius = 1/2 / Math.pow(subdivider, degre)
                    vertexViewer.go()
                }



                //$$$eh

            }
        }



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


            _test_hash: boolean
            _numberHexa: number


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
                                 for (var d=0;d<subdivider;d++){
                                        all.push([a,b,c,d])
                                    }
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
                    vertexViewer.constantRadius = 1/2 / Math.pow(subdivider, degree)
                    vertexViewer.go()
                }



                //$$$eh

                this.mamesh=mamesh






            }


            mamesh
            vertexViewer:visu3d.VerticesViewer

            showVertices(){

                cc('let us SHOW')
                // if (this.vertexViewer==null) {
                //
                //     let dico = new HashMap<Vertex, boolean>(true)
                //     for (let v of this.mamesh.smallestSquares) {
                //         if (dico.getValue(v) == null) dico.putValue(v, true)
                //     }
                //
                //     let cube = BABYLON.MeshBuilder.CreateBox('', {size: 1}, this.mathisFrame.scene)
                //     let vertexViewer = new visu3d.VerticesViewer(dico.allKeys(), this.mathisFrame.scene)
                //     vertexViewer.meshModel = cube
                //     vertexViewer.constantRadius = 1 / 2 / Math.pow(this.subdivider, this.degree)
                //     vertexViewer.go()
                // }
                // else {
                //     this.vertexViewer.show()
                // }
            }
            hiddeVertices(){
                cc('let us HIDDE')
                // if (this.vertexViewer!=null) {
                //
                //     this.vertexViewer.hidde()
                // }
            }



        }






    }
}
