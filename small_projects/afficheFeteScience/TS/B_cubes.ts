/**
 * Created by vigon on 25/09/2017.
 */

module mathis {


    export module appli {


        export class CubeAffiche implements PieceOfCode {
            NAME = "EpongeRandom"

            TITLE = "Random Menger Sponge"

            degree = 2
            $$$degree = [0, 1, 2, 3, 4,5]

            subdivider = 2
            $$$subdivider = [2,3, 4]

            subdividerAfter = 2
            $$$subdividerAfter = [2,3, 4]


            drawSurface=true
            $$$drawSurface=[true,false]


            drawVertices=false
            $$$drawVertices=[true,false]


            propLevel0=0.5
            $$$propLevel0=[0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,0.95]

            propLevel1=0.5
            $$$propLevel1=[0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,0.95]

            propLevel2=0.5
            $$$propLevel2=[0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,0.95]

            propLevel3=0.5
            $$$propLevel3=[0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,0.95]

            propLevel4=0.5
            $$$propLevel4=[0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,0.95]



            propLevel0After=0.5
            $$$propLevel0After=[0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,0.95]

            propLevel1After=0.5
            $$$propLevel1After=[0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,0.95]

            propLevel2After=0.5
            $$$propLevel2After=[0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,0.95]

            propLevel3After=0.5
            $$$propLevel3After=[0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,0.95]

            propLevel4After=0.5
            $$$propLevel4After=[0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,0.95]




            seed=2463456
            $$$seed=[2463456,87643457,35843543,934524,65132,1213]

            bifurcation=false
            $$$bifurcation=[true,false]




            degreeAfter=2
            $$$degreeAfter=[0,1,2,3]


            duplication=visu3d.NormalDuplication.none
            $$$duplication=[visu3d.NormalDuplication.none,visu3d.NormalDuplication.duplicateOnlyWhenNormalsAreTooFarr]

            vertexRadius=0.5
            $$$vertexRadius=[0.1,0.2,0.3,0.5,0.7,1,3]



            constructor(private mathisFrame: MathisFrame) {



            }

            goForTheFirstTime() {

                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()
                //this.mathisFrame.getGrabberCamera().changePosition(new XYZ(2, 2, 2))
                    //this.mathisFrame.getGrabberCamera().changeFrontDir(new XYZ(-2, -2, -2))

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
                var proportionSuppressedByLevelAfter:number[]=[this.propLevel0After,this.propLevel1After,this.propLevel2After,this.propLevel3After,this.propLevel4After]


                this.subdi(mamesh,degree,proportionSuppressedByLevel,subdivider)
                new mameshModification.SurfacesFromHexahedrons(mamesh).go();


                /**lines*/
                new linkModule.SimpleLinkFromPolygonCreator(mamesh).goChanging()

                let associator=new linkModule.OppositeLinkAssocierByAngles(mamesh.vertices)
                associator.maxAngleToAssociateLinks=PI*0.6
                associator.canCreateBifurcations=this.bifurcation
                associator.goChanging()

                mamesh.fillLineCatalogue()




                mamesh.smallestTriangles=[]
                mamesh.smallestSquares=[]
                this.subdi(mamesh,this.degreeAfter,proportionSuppressedByLevelAfter,this.subdividerAfter)
                new mameshModification.SurfacesFromHexahedrons(mamesh).go();

                //$$$end



                //$$$bh visualization

                var positioning = new Positioning();
                positioning.position = new XYZ(-0.5, -0.5, -0.5);
                positioning.applyToVertices(mamesh.vertices);


                let indexer=new lineModule.CreateAColorIndexRespectingBifurcationsAndSymmetries(mamesh)
                let index=indexer.go()

                let lineViewer=new visu3d.LinesViewer(mamesh,this.mathisFrame.scene)
                //lineViewer.color=color.thema.defaultLinkColor
                lineViewer.lineToLevel=index
                lineViewer.cap=BABYLON.Mesh.CAP_ALL
                lineViewer.go()


                if (this.drawSurface) {

                    var bumpMaterial = new BABYLON.StandardMaterial("texture1", this.mathisFrame.scene);
                    bumpMaterial.bumpTexture = new BABYLON.Texture("normalMap.jpg", this.mathisFrame.scene);



                    let surfaceViewer = new visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene);
                    surfaceViewer.material=bumpMaterial
                    surfaceViewer.alpha = 1.;
                    surfaceViewer.color = new Color(Color.names.darkorange);
                    surfaceViewer.backFaceCulling = true;
                    surfaceViewer.sideOrientation = BABYLON.Mesh.FRONTSIDE;
                    surfaceViewer.normalDuplication=this.duplication
                    surfaceViewer.go();



                    // let mesh=BABYLON.Mesh.CreateIcoSphere("",{radius:1},this.mathisFrame.scene)
                    // mesh.material=bumpMaterial


                }


                if (this.drawVertices) {

                    let dico=new HashMap<Vertex,boolean>(true)
                    for (let v of mamesh.smallestSquares){
                        if (dico.getValue(v)==null) dico.putValue(v,true)
                    }


                    let cube = BABYLON.MeshBuilder.CreateIcoSphere('', {radius: 1}, this.mathisFrame.scene)

                    let vertexViewer = new visu3d.VerticesViewer(dico.allKeys(), this.mathisFrame.scene)
                    vertexViewer.meshModel = cube
                    vertexViewer.radiusAbsolute = this.vertexRadius / Math.pow(subdivider, degree+this.degreeAfter)
                    vertexViewer.go()
                }


                //$$$eh



            }

            private  subdi(mamesh:Mamesh,degree:number,proportionSuppressedByLevel:number[],subdivider:number) {
            var random = new proba.Random(this.seed)
            for (var k = 0; k < degree; k++) {
                var m = new mameshModification.HexahedronSubdivider(mamesh);
                m.subdivider = subdivider

                let all = []
                for (var a = 0; a < subdivider; a++) {
                    for (var b = 0; b < subdivider; b++) {
                        for (var c = 0; c < subdivider; c++) {
                            all.push([a, b, c])
                        }
                    }
                }
                var suppressed = []

                var indexToProba = []
                for (let i = 0; i < all.length; i++) indexToProba.push(random.pseudoRand())

                for (let i = 0; i < all.length; i++) {
                    if (indexToProba[i] < proportionSuppressedByLevel[k]) suppressed.push(all[i])
                }
                m.suppressVolumes = suppressed


                m.go();
                mamesh.hexahedrons = m.newHexahedrons;
            }
        }





        }
    }





}