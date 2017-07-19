/**
 * Created by vigon on 01/02/2017.
 */
/**
 * Created by vigon on 05/12/2016.
 */


module mathis {

    export module appli {


        export class GrateMergeStickJustTest implements OnePage {

            pageIdAndTitle = "Find polygons from links"
            severalParts: SeveralParts

            constructor(private mathisFrame: MathisFrame) {
                let several = new SeveralParts()

                several.addPart(new FindPolygonsFromLinks(this.mathisFrame))


                several.addComment("Next, we present the detection of normals which is used previously. A coherent set of normals is useful to decide in which direction we turn around each vertex","elementaryInVerticesViewingDocu")

                several.addPart(new NormalComputing(this.mathisFrame))


                this.severalParts = several
            }

            go() {
                return this.severalParts.go()
            }

        }


        class FindPolygonsFromLinks implements PieceOfCode {

            NAME = "FindPolygonsFromLinks"
            TITLE =`Suppose you have a Mamesh, which is '2 dimensional', but the lists of quads and triangles was not made, on not completed.
            the following Class detects missing polygons, then cut them into quads and triangles. It is in particular useful for mamesh produced
            by gratAndGlue`

            connect = true
            $$$connect = [true,false]

            nbBiggerFacesDeleted = 1;
            $$$nbBiggerFacesDeleted = [0, 1, 2, 4, 6, 8];


            surfaceChoice = 'constellation'
            $$$surfaceChoice = ['ultra simple','a five side poly','impasse','alreadyOneQuad', 'constellation', 'cylinder','Grat&glue small', 'Grat&glue 1', 'Grat&glue 2', 'nothingToDo','corner']


            useBarycenterToCutPolygons = true;
            $$$useBarycenterToCutPolygons = [true, false]

            showNormals=false
            $$$showNormals=[true,false]




            maille=reseau.Maille.quad
            $$$maille=new Choices(allIntegerValueOfEnume(reseau.Maille),{before:"reseau.Maille.",visualValues:allStringValueOfEnume(reseau.Maille)})



            constructor(private mathisFrame: MathisFrame) {
                this.mathisFrame = mathisFrame

            }

            goForTheFirstTime() {

                let camera = <macamera.GrabberCamera>this.mathisFrame.scene.activeCamera;

                camera.changePosition(new XYZ(0, 0, -4));
                this.go()
            }

            go() {

                this.mathisFrame.clearScene(false, false);

                //$$$begin
                let mamesh: Mamesh;
                let maille=this.maille
                //$$$end
                //$$$bc
                switch (this.surfaceChoice) {

                    case 'ultra simple': {
                        let creator1 = new reseau.Regular2dPlus()
                        creator1.makeTriangleOrSquare = false
                        creator1.maille=maille
                        mamesh = creator1.go()
                    }
                        break


                    case 'alreadyOneQuad': {
                        let creator1 = new reseau.Regular2dPlus()
                        creator1.makeTriangleOrSquare = false
                        mamesh = creator1.go()
                        mamesh.smallestSquares=[mamesh.vertices[1],mamesh.vertices[4],mamesh.vertices[3],mamesh.vertices[0]]
                    }
                        break


                    case 'a five side poly': {
                        let creator1 = new reseau.Regular2dPlus()
                        creator1.makeTriangleOrSquare = false

                        mamesh = creator1.go()

                        let v1=creator1.OUT_paramToVertex.getValue(new XYZ(0,1,0))
                        let v4=creator1.OUT_paramToVertex.getValue(new XYZ(1,1,0))
                        Vertex.separateTwoVoisins(v1,v4)
                    }
                        break

                    case 'impasse': {
                        let creator1 = new reseau.Regular2dPlus()
                        creator1.makeTriangleOrSquare = false

                        mamesh = creator1.go()

                        let v1=creator1.OUT_paramToVertex.getValue(new XYZ(0,1,0))
                        let v4=creator1.OUT_paramToVertex.getValue(new XYZ(1,1,0))

                        let v7=creator1.OUT_paramToVertex.getValue(new XYZ(2,1,0))
                        let v5=creator1.OUT_paramToVertex.getValue(new XYZ(1,2,0))

                        Vertex.separateTwoVoisins(v1,v4)
                        Vertex.separateTwoVoisins(v4,v7)
                        Vertex.separateTwoVoisins(v4,v5)
                    }
                        break



                    case 'constellation': {

                        let vtx1 = new mathis.Vertex().setPosition(-4, -0.5, 0);let vtx2 = new mathis.Vertex().setPosition(-3, 1, 0);let vtx3 = new mathis.Vertex().setPosition(-1, 2.5, 0);let vtx4 = new mathis.Vertex().setPosition(2, 2, 0);let vtx5 = new mathis.Vertex().setPosition(3, -0.5, 0);let vtx6 = new mathis.Vertex().setPosition(3, -2, 0);let vtx7 = new mathis.Vertex().setPosition(2, -3, -1);let vtx8 = new mathis.Vertex().setPosition(-0.5, -3, 0);let vtx9 = new mathis.Vertex().setPosition(-2.5, -3, 0);let vtx10 = new mathis.Vertex().setPosition(-2.5, -1, 0);let vtx11 = new mathis.Vertex().setPosition(-0, 0, 0);let vtx12 = new mathis.Vertex().setPosition(1.5, -1.5, 0);let vtx13 = new mathis.Vertex().setPosition(3, 4, 0);let vtx14 = new mathis.Vertex().setPosition(5, 3, 0);let vtx15 = new mathis.Vertex().setPosition(5, 5, 0);let vtx15_1 = new mathis.Vertex().setPosition(5, 6, 0);let vtx16 = new mathis.Vertex().setPosition(5, 2, 0);let vtx17 = new mathis.Vertex().setPosition(6, 1, 0);let vtx18 = new mathis.Vertex().setPosition(-3, 3, 0);let vtx19 = new mathis.Vertex().setPosition(7, 0, 0);let vtx20 = new mathis.Vertex().setPosition(6, -1, 0);let vtx21 = new mathis.Vertex().setPosition(-3, 5, 0);let vtx101 = new mathis.Vertex().setPosition(7, 4, -1);let vtx102 = new mathis.Vertex().setPosition(8, 4, -1);let vtx103 = new mathis.Vertex().setPosition(7, 3, -3);let vtx104 = new mathis.Vertex().setPosition(7, 5, 0);let vtx105 = new mathis.Vertex().setPosition(9, 4, 0);let vtx106 = new mathis.Vertex().setPosition(10, 4, 0);let vtx107 = new mathis.Vertex().setPosition(10, 3, 0);let vtx108 = new mathis.Vertex().setPosition(9, 5, 0);

                        mamesh = new mathis.Mamesh();
                        mamesh.vertices.push(vtx1, vtx2, vtx3, vtx4, vtx5, vtx6, vtx7, vtx8, vtx9, vtx10, vtx11, vtx12);mamesh.vertices.push(vtx13, vtx14, vtx15, vtx16, vtx17, vtx18, vtx19, vtx20, vtx21, vtx15_1);mamesh.vertices.push(vtx101, vtx102, vtx103, vtx104, vtx105, vtx106, vtx107, vtx108);

                        let positioning=new Positioning()
                        positioning.scaling=new XYZ(0.2,0.2,0.2)
                        positioning.applyToVertices(mamesh.vertices)

                        vtx1.setOneLink(vtx2);vtx2.setOneLink(vtx1);vtx2.setOneLink(vtx3);vtx3.setOneLink(vtx2);vtx3.setOneLink(vtx4);vtx4.setOneLink(vtx3);vtx4.setOneLink(vtx5);vtx5.setOneLink(vtx4);vtx5.setOneLink(vtx6);vtx6.setOneLink(vtx5);vtx6.setOneLink(vtx7);vtx7.setOneLink(vtx6);vtx7.setOneLink(vtx8);vtx8.setOneLink(vtx7);vtx8.setOneLink(vtx9);vtx9.setOneLink(vtx8);vtx9.setOneLink(vtx1);vtx1.setOneLink(vtx9);vtx10.setOneLink(vtx1);vtx1.setOneLink(vtx10);vtx10.setOneLink(vtx2);vtx2.setOneLink(vtx10);vtx10.setOneLink(vtx9);vtx9.setOneLink(vtx10);vtx11.setOneLink(vtx4);vtx4.setOneLink(vtx11);vtx11.setOneLink(vtx8);vtx8.setOneLink(vtx11);vtx11.setOneLink(vtx10);vtx10.setOneLink(vtx11);vtx12.setOneLink(vtx6);vtx6.setOneLink(vtx12);vtx12.setOneLink(vtx8);vtx8.setOneLink(vtx12);vtx13.setOneLink(vtx4);vtx4.setOneLink(vtx13);vtx13.setOneLink(vtx14);vtx14.setOneLink(vtx13);vtx14.setOneLink(vtx15);vtx15.setOneLink(vtx14);vtx15_1.setOneLink(vtx15);vtx15.setOneLink(vtx15_1);vtx14.setOneLink(vtx16);vtx16.setOneLink(vtx14);vtx16.setOneLink(vtx17);vtx17.setOneLink(vtx16);vtx17.setOneLink(vtx19);vtx19.setOneLink(vtx17);vtx20.setOneLink(vtx19);vtx19.setOneLink(vtx20);vtx20.setOneLink(vtx17);vtx17.setOneLink(vtx20);vtx18.setOneLink(vtx2);vtx2.setOneLink(vtx18);vtx101.setOneLink(vtx102);vtx102.setOneLink(vtx101);vtx102.setOneLink(vtx103);vtx103.setOneLink(vtx102);vtx101.setOneLink(vtx103);vtx103.setOneLink(vtx101);vtx101.setOneLink(vtx104);vtx104.setOneLink(vtx101);vtx102.setOneLink(vtx105);vtx105.setOneLink(vtx102);// vtx105.setOneLink(vtx106); vtx106.setOneLink(vtx105);vtx107.setOneLink(vtx106);vtx106.setOneLink(vtx107);vtx107.setOneLink(vtx103);vtx103.setOneLink(vtx107);vtx108.setOneLink(vtx105);vtx105.setOneLink(vtx108);vtx108.setOneLink(vtx106);vtx106.setOneLink(vtx108);vtx101.setOneLink(vtx15);vtx15.setOneLink(vtx101);
                    }
                        break



                    case 'cylinder': {
                        let creator=new creation3D.VerticalCylinder()
                        mamesh=creator.go()
                    }
                        break



                    case 'Grat&glue 1': {

                        let vertices0 = [];
                        let vertices1 = [];
                        let mamesh1;
                        let basis0 = new mathis.reseau.BasisForRegularReseau();
                        basis0.origin = new mathis.XYZ(-1, -0.9, 0);
                        basis0.end = new mathis.XYZ(-0.05, 1.1, 0);
                        basis0.nbU = 5;
                        basis0.nbV = 10;
                        mamesh = new mathis.reseau.Regular2d(basis0).go();
                        let basis1 = new mathis.reseau.BasisForRegularReseau();
                        basis1.origin = new mathis.XYZ(0.05, -1, 0);
                        basis1.end = new mathis.XYZ(1, 1, 0);
                        basis1.nbU = 5;
                        basis1.nbV = 10;
                        mamesh1 = new mathis.reseau.Regular2d(basis1).go();
                        vertices0 = mamesh.vertices;
                        vertices1 = mamesh1.vertices;
                        new mathis.spacialTransformations.Similitude(mamesh1.vertices, 2 * Math.PI * 0.01).goChanging();
                        let map;
                        let mapFinder = new mathis.grateAndGlue.FindSickingMapFromVertices(vertices0, vertices1);
                        mapFinder.proximityCoef = 0.9;

                        mapFinder.toleranceToBeOneOfTheClosest = 0.05;
                        map = mapFinder.go();
                        let sticker = new mathis.grateAndGlue.Sticker(mamesh, mamesh1, map);
                        sticker.goChanging();

                    }
                        break

                    case 'Grat&glue small': {

                        let creator0 = new reseau.TriangulatedPolygone(6);
                        creator0.origin = new XYZ(-1, -1, 0);
                        creator0.end = new XYZ(0.5, 0.5, 0);
                        creator0.nbSubdivisionInARadius = 1;
                        let mamesh0 = creator0.go();
                        let creator1 = new reseau.TriangulatedPolygone(6);
                        creator1.origin = new XYZ(-0.5, -0.5, 0);
                        creator1.end = new XYZ(1, 1, 0);
                        creator1.nbSubdivisionInARadius = 1;
                        let mamesh1 = creator1.go();
                        let graterAndSticker = new grateAndGlue.ConcurrentMameshesGraterAndSticker();
                        graterAndSticker.addMissingPolygons=false
                        graterAndSticker.IN_mameshes.push(mamesh0, mamesh1);
                        graterAndSticker.justGrateDoNotStick = false;
                        graterAndSticker.SUB_grater.proportionOfSeeds = [0.1, 0.1];
                        graterAndSticker.proximityCoefToStick = [2];
                        graterAndSticker.toleranceToBeOneOfTheClosest = 0.5;
                        graterAndSticker.suppressLinksAngularlyTooClose = false;
                        graterAndSticker.SUB_linkCleanerByAngle.suppressLinksAngularParam = 2 * Math.PI * 0.1;

                        graterAndSticker.justGrateDoNotStick=true


                        mamesh = graterAndSticker.goChanging()



                    }
                        break

                    case 'Grat&glue 2': {

                        let creator0 = new reseau.TriangulatedPolygone(6);
                        creator0.origin = new XYZ(-1, -1, 0);
                        creator0.end = new XYZ(0.5, 0.5, 0);
                        creator0.nbSubdivisionInARadius = 9;
                        let mamesh0 = creator0.go();
                        let creator1 = new reseau.TriangulatedPolygone(6);
                        creator1.origin = new XYZ(-0.5, -0.5, 0);
                        creator1.end = new XYZ(1, 1, 0);
                        creator1.nbSubdivisionInARadius = 5;
                        let mamesh1 = creator1.go();
                        let graterAndSticker = new grateAndGlue.ConcurrentMameshesGraterAndSticker();
                        graterAndSticker.addMissingPolygons=false

                        graterAndSticker.IN_mameshes.push(mamesh0, mamesh1);
                        graterAndSticker.justGrateDoNotStick = false;
                        graterAndSticker.SUB_grater.proportionOfSeeds = [0.1, 0.1];
                        graterAndSticker.proximityCoefToStick = [2];
                        graterAndSticker.toleranceToBeOneOfTheClosest = 0.5;
                        graterAndSticker.suppressLinksAngularlyTooClose = false;
                        graterAndSticker.SUB_linkCleanerByAngle.suppressLinksAngularParam = 2 * Math.PI * 0.1;

                        mamesh = graterAndSticker.goChanging()
                    }
                        break

                    case 'nothingToDo': {


                        let creator1 = new reseau.Regular2dPlus()
                        mamesh = creator1.go()

                        let creator2 = new reseau.Regular2dPlus()
                        creator2.origin = new XYZ(3, 0, 0)
                        creator2.end = new XYZ(4, 1, 0)
                        let mamesh2 = creator2.go()

                        for (let v of mamesh2.vertices) {
                            mamesh.vertices.push(v)
                        }
                        for (let v of mamesh2.smallestSquares) mamesh.smallestSquares.push(v)

                    }
                        break

                    case "corner":{
                        /**in this example, the smoothing of normals is very important, because of the angle of the corner*/
                        let creator=new reseau.Regular2dPlus()
                        creator.nbU=21
                        creator.adaptVForRegularReseau=true
                        creator.maille=maille
                        creator.origin=new XYZ(-0.7,-0.7,0)
                        creator.end=new XYZ(0.7,0.7,0)
                        creator.makeTriangleOrSquare=false
                        mamesh = creator.go()
                        cc(mamesh.toString())
                        cc(mamesh.vertices)

                        for (let vertex of mamesh.vertices){


                            let u=vertex.position.x
                            let v=vertex.position.y

                            if (u<0){
                                vertex.position.x=u
                                vertex.position.y=0
                                vertex.position.z=v
                            }
                            else{
                                vertex.position.x=0
                                vertex.position.y=u
                                vertex.position.z=v
                            }

                        }
                    }
                        break

                    default: throw "what is this mamesh ?"

                }
                //$$$ec


                //$$$begin


                let  connect = new polygonFinder.PolygonFinderFromLinks(mamesh);
                connect.nbBiggerFacesDeleted=this.nbBiggerFacesDeleted
                connect.useBarycenterToCutPolygons=this.useBarycenterToCutPolygons

                let findPoly=this.connect
                if (findPoly) connect.go();

                let showNormals=this.showNormals

                //$$$end
                //$$$bh visualization
                let verticesViewer = new mathis.visu3d.VerticesViewer(mamesh, this.mathisFrame.scene);
                verticesViewer.go();

                let linksViewer = new mathis.visu3d.LinksViewer(mamesh, this.mathisFrame.scene);
                linksViewer.go();

                let surfaceViewer = new mathis.visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene);
                surfaceViewer.go();

                if (showNormals&&findPoly){
                    /**normals can also be drawn more efficiently via the VerticesViewer (see newt pieceOfCode)*/
                    for (let vert of mamesh.vertices){
                        if(connect.OUT_vertexToNormal.getValue(vert)!=null) {
                            creation3D.drawOneVector(XYZ.newFrom(connect.OUT_vertexToNormal.getValue(vert)).scale(0.2),this.mathisFrame.scene,vert.position)
                        }
                    }

                }



                //$$$eh


                // if (true){
                //     let flager=new visu3d.VerticesFlager(mamesh,this.mathisFrame.scene)
                //     flager.decayProp=new XYZ(0.3,0.3,0)
                //     flager.go()
                //
                // }
            }
        }



        class NormalComputing implements PieceOfCode{

            NO_TEST=true


            NAME="NormalComputing"
            TITLE="Computation of normals when we do not have triangle and quad. It is important to smooth when the surface has sharp parts"



            surfaceChoice="paraboloid"
            $$$surfaceChoice=["paraboloid","corner","moebius"]

            maille=reseau.Maille.quad
            $$$maille=new Choices(allIntegerValueOfEnume(reseau.Maille),{before:"reseau.Maille.",visualValues:allStringValueOfEnume(reseau.Maille)})


            size=20
            $$$size=[10,11,20,21,50,51,100,200]

            neighborhoodSize_forSmoothing=0
            $$$neighborhoodSize_forSmoothing=[0,1,2,3]




            constructor(private mathisFrame:MathisFrame){}

            goForTheFirstTime(){
                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()

                this.go()
            }

            go(){

                this.mathisFrame.clearScene(false,false)

                //$$$bh mamesh creation
                let creator=new reseau.Regular2dPlus()
                creator.nbU=this.size
                creator.adaptVForRegularReseau=true
                creator.maille=this.maille
                creator.origin=new XYZ(-0.7,-0.7,0)
                creator.end=new XYZ(0.7,0.7,0)
                let mamesh = creator.go()
                //$$$eh

                //$$$bc
                switch (this.surfaceChoice){
                    case "paraboloid":{
                        for (let vertex of mamesh.vertices){
                            let u=vertex.position.x
                            let v=vertex.position.y
                            vertex.position.x=u
                            vertex.position.y=u**2+v**2
                            vertex.position.z=v
                        }
                    }
                        break
                    case "corner":{
                        /**please : change nbU to see the effect of the parity*/
                        for (let vertex of mamesh.vertices){
                            let u=vertex.position.x
                            let v=vertex.position.y

                            if (u<0){
                                vertex.position.x=u
                                vertex.position.y=0
                                vertex.position.z=v
                            }
                            else{
                                vertex.position.x=0
                                vertex.position.y=u
                                vertex.position.z=v
                            }

                        }
                    }
                        break

                    case 'moebius': {
                        /** A non oriented surface=> problems**/

                        let basis = new mathis.reseau.BasisForRegularReseau();
                        basis.origin = new mathis.XYZ(0, -1, 0);
                        basis.end = new mathis.XYZ(2 * Math.PI, 1, 0);
                        basis.nbU = 20;
                        basis.nbV = 10;
                        let creator = new mathis.reseau.Regular2d(basis);
                        creator.makeTriangleOrSquare = false;
                        mamesh = creator.go();
                        for (let _i = 0, _a = mamesh.vertices; _i < _a.length; _i++) {
                            let vertex = _a[_i];
                            let u = vertex.position.x;
                            let v = vertex.position.y;
                            vertex.position.x = (2 - v * Math.sin(u / 2)) * Math.sin(u);
                            vertex.position.y = (2 - v * Math.sin(u / 2)) * Math.cos(u);
                            vertex.position.z = v * Math.cos(u / 2);
                        }
                        new grateAndGlue.Merger(mamesh).goChanging()

                    }
                        break

                }
                //$$$ec


                //$$$begin

                let timeBefore=Date.now()
                let normalComputer=new polygonFinder.NormalComputerFromLinks(mamesh)
                normalComputer.neighborhoodSize_forSmoothing=this.neighborhoodSize_forSmoothing
                let vertexToNormal=normalComputer.go()
                this.mathisFrame.messageDiv.append("duration:"+(Date.now()-timeBefore))

                let positionings=new HashMap<Vertex,Positioning>()
                for (let vertex of mamesh.vertices){
                    let positioning=new Positioning()
                    positioning.upVector=vertexToNormal.getValue(vertex)
                    positioning.scaling=new XYZ(0.1,0.1,0.1)
                    let oneOrthogonal=new XYZ(0,0,0)
                    geo.getOneOrthonormal(positioning.upVector,oneOrthogonal)
                    positionings.putValue(vertex,positioning)
                }

                let verticesViewer=new visu3d.VerticesViewer(mamesh, this.mathisFrame.scene,positionings)
                verticesViewer.meshModel=new creation3D.ArrowCreator(this.mathisFrame.scene).go()
                verticesViewer.go()
                //n


                new visu3d.LinksViewer(mamesh,this.mathisFrame.scene).go()

                //$$$end

            }
        }










        //
        // class NormalComputationFromLinks implements PieceOfCode {
        //
        //     NAME = "NormalComputationFromLinks"
        //     TITLE = "compute normals"
        //
        //     surfaceChoice = 'Grat&glue small'
        //     $$$surfaceChoice = ['ultra simple','ultra simple with triangle','a five side poly','impasse','alreadyOneQuad','Flat', 'Strange flat', 'Filled flat', 'Half-cylinder', 'Moebius','Grat&glue small', 'Grat&glue 1', 'Grat&glue 2', 'nothingToDo', 'bugged']
        //
        //     doIt=true
        //     $$$doIt=[true,false]
        //
        //
        //     constructor(private mathisFrame: MathisFrame) {
        //         this.mathisFrame = mathisFrame
        //
        //     }
        //
        //     goForTheFirstTime() {
        //
        //         let camera = <macamera.GrabberCamera>this.mathisFrame.scene.activeCamera;
        //
        //         camera.changePosition(new XYZ(0, 0, -4));
        //         this.go()
        //     }
        //
        //     go() {
        //
        //         this.mathisFrame.clearScene(false, false);
        //
        //         //$$$begin
        //         let mamesh: Mamesh;
        //         //$$$end
        //
        //
        //         //$$$bh mamesh choice
        //         switch (this.surfaceChoice) {
        //
        //             case 'ultra simple': {
        //                 let creator1 = new reseau.Regular2dPlus()
        //                 creator1.makeTriangleOrSquare = false
        //                 mamesh = creator1.go()
        //             }
        //                 break
        //
        //             case 'ultra simple with triangle': {
        //                 let creator1 = new reseau.Regular2dPlus()
        //                 creator1.makeTriangleOrSquare = false
        //                 creator1.maille=reseau.Maille.triangleH
        //                 mamesh = creator1.go()
        //             }
        //                 break
        //
        //             case 'alreadyOneQuad': {
        //                 let creator1 = new reseau.Regular2dPlus()
        //                 creator1.makeTriangleOrSquare = false
        //                 mamesh = creator1.go()
        //                 //mamesh.smallestSquares=[mamesh.vertices[0],mamesh.vertices[3],mamesh.vertices[4],mamesh.vertices[1]]
        //                 mamesh.smallestSquares=[mamesh.vertices[1],mamesh.vertices[4],mamesh.vertices[3],mamesh.vertices[0]]
        //
        //             }
        //                 break
        //
        //
        //             case 'a five side poly': {
        //                 let creator1 = new reseau.Regular2dPlus()
        //                 creator1.makeTriangleOrSquare = false
        //
        //                 mamesh = creator1.go()
        //
        //                 let v1=creator1.OUT_paramToVertex.getValue(new XYZ(0,1,0))
        //                 let v4=creator1.OUT_paramToVertex.getValue(new XYZ(1,1,0))
        //                 Vertex.separateTwoVoisins(v1,v4)
        //             }
        //                 break
        //
        //             case 'impasse': {
        //                 let creator1 = new reseau.Regular2dPlus()
        //                 creator1.makeTriangleOrSquare = false
        //
        //                 mamesh = creator1.go()
        //
        //                 let v1=creator1.OUT_paramToVertex.getValue(new XYZ(0,1,0))
        //                 let v4=creator1.OUT_paramToVertex.getValue(new XYZ(1,1,0))
        //
        //                 let v7=creator1.OUT_paramToVertex.getValue(new XYZ(2,1,0))
        //                 let v5=creator1.OUT_paramToVertex.getValue(new XYZ(1,2,0))
        //
        //
        //                 Vertex.separateTwoVoisins(v1,v4)
        //                 Vertex.separateTwoVoisins(v4,v7)
        //                 Vertex.separateTwoVoisins(v4,v5)
        //             }
        //                 break
        //
        //
        //
        //             case 'Flat': {
        //                 /** flat **/
        //
        //                 /** vertices **/
        //                 let vtx1 = new mathis.Vertex().setPosition(-4, -0.5, 0);
        //                 let vtx2 = new mathis.Vertex().setPosition(-3, 1, 0);
        //                 let vtx3 = new mathis.Vertex().setPosition(-1, 2.5, 0);
        //                 let vtx4 = new mathis.Vertex().setPosition(2, 2, 0);
        //                 let vtx5 = new mathis.Vertex().setPosition(3, -0.5, 0);
        //                 let vtx6 = new mathis.Vertex().setPosition(3, -2, 0);
        //                 let vtx7 = new mathis.Vertex().setPosition(2, -3, -1);
        //                 let vtx8 = new mathis.Vertex().setPosition(-0.5, -3, 0);
        //                 let vtx9 = new mathis.Vertex().setPosition(-2.5, -3, 0);
        //                 let vtx10 = new mathis.Vertex().setPosition(-2.5, -1, 0);
        //                 let vtx11 = new mathis.Vertex().setPosition(-0, 0, 0);
        //                 let vtx12 = new mathis.Vertex().setPosition(1.5, -1.5, 0);
        //
        //                 mamesh = new mathis.Mamesh();
        //                 mamesh.vertices.push(vtx1, vtx2, vtx3, vtx4, vtx5, vtx6, vtx7, vtx8, vtx9, vtx10, vtx11, vtx12);
        //
        //                 /** links **/
        //                 vtx1.setOneLink(vtx2);
        //                 vtx2.setOneLink(vtx1);
        //                 vtx2.setOneLink(vtx3);
        //                 vtx3.setOneLink(vtx2);
        //                 vtx3.setOneLink(vtx4);
        //                 vtx4.setOneLink(vtx3);
        //                 vtx4.setOneLink(vtx5);
        //                 vtx5.setOneLink(vtx4);
        //                 vtx5.setOneLink(vtx6);
        //                 vtx6.setOneLink(vtx5);
        //                 vtx6.setOneLink(vtx7);
        //                 vtx7.setOneLink(vtx6);
        //                 vtx7.setOneLink(vtx8);
        //                 vtx8.setOneLink(vtx7);
        //                 vtx8.setOneLink(vtx9);
        //                 vtx9.setOneLink(vtx8);
        //                 vtx9.setOneLink(vtx1);
        //                 vtx1.setOneLink(vtx9);
        //                 vtx10.setOneLink(vtx1);
        //                 vtx1.setOneLink(vtx10);
        //                 vtx10.setOneLink(vtx2);
        //                 vtx2.setOneLink(vtx10);
        //                 vtx10.setOneLink(vtx9);
        //                 vtx9.setOneLink(vtx10);
        //                 vtx11.setOneLink(vtx4);
        //                 vtx4.setOneLink(vtx11);
        //                 vtx11.setOneLink(vtx8);
        //                 vtx8.setOneLink(vtx11);
        //                 vtx11.setOneLink(vtx10);
        //                 vtx10.setOneLink(vtx11);
        //                 vtx12.setOneLink(vtx6);
        //                 vtx6.setOneLink(vtx12);
        //                 vtx12.setOneLink(vtx8);
        //                 vtx8.setOneLink(vtx12);
        //             }
        //                 break
        //             case 'Strange flat': {
        //                 /** strange flat **/
        //
        //                 /** vertices **/
        //                 let vtx1 = new mathis.Vertex().setPosition(-4, -0.5, 0);
        //                 let vtx2 = new mathis.Vertex().setPosition(-3, 1, 0);
        //                 let vtx3 = new mathis.Vertex().setPosition(-1, 2.5, 0);
        //                 let vtx4 = new mathis.Vertex().setPosition(2, 2, 0);
        //                 let vtx5 = new mathis.Vertex().setPosition(3, -0.5, 0);
        //                 let vtx6 = new mathis.Vertex().setPosition(3, -2, 0);
        //                 let vtx7 = new mathis.Vertex().setPosition(2, -3, -1);
        //                 let vtx8 = new mathis.Vertex().setPosition(-0.5, -3, 0);
        //                 let vtx9 = new mathis.Vertex().setPosition(-2.5, -3, 0);
        //                 let vtx10 = new mathis.Vertex().setPosition(-2.5, -1, 0);
        //                 let vtx11 = new mathis.Vertex().setPosition(-0, 0, 0);
        //                 let vtx12 = new mathis.Vertex().setPosition(1.5, -1.5, 0);
        //                 let vtx13 = new mathis.Vertex().setPosition(3, 4, 0);
        //                 let vtx14 = new mathis.Vertex().setPosition(5, 3, 0);
        //                 let vtx15 = new mathis.Vertex().setPosition(5, 5, 0);
        //                 let vtx15_1 = new mathis.Vertex().setPosition(5, 6, 0);
        //                 let vtx16 = new mathis.Vertex().setPosition(5, 2, 0);
        //                 let vtx17 = new mathis.Vertex().setPosition(6, 1, 0);
        //                 let vtx18 = new mathis.Vertex().setPosition(-3, 3, 0);
        //                 let vtx19 = new mathis.Vertex().setPosition(7, 0, 0);
        //                 let vtx20 = new mathis.Vertex().setPosition(6, -1, 0);
        //                 let vtx21 = new mathis.Vertex().setPosition(-3, 5, 0);
        //                 let vtx101 = new mathis.Vertex().setPosition(7, 4, -1);
        //                 let vtx102 = new mathis.Vertex().setPosition(8, 4, -1);
        //                 let vtx103 = new mathis.Vertex().setPosition(7, 3, -3);
        //                 let vtx104 = new mathis.Vertex().setPosition(7, 5, 0);
        //                 let vtx105 = new mathis.Vertex().setPosition(9, 4, 0);
        //                 let vtx106 = new mathis.Vertex().setPosition(10, 4, 0);
        //                 let vtx107 = new mathis.Vertex().setPosition(10, 3, 0);
        //                 let vtx108 = new mathis.Vertex().setPosition(9, 5, 0);
        //
        //                 mamesh = new mathis.Mamesh();
        //                 mamesh.vertices.push(vtx1, vtx2, vtx3, vtx4, vtx5, vtx6, vtx7, vtx8, vtx9, vtx10, vtx11, vtx12);
        //                 mamesh.vertices.push(vtx13, vtx14, vtx15, vtx16, vtx17, vtx18, vtx19, vtx20, vtx21, vtx15_1);
        //                 mamesh.vertices.push(vtx101, vtx102, vtx103, vtx104, vtx105, vtx106, vtx107, vtx108);
        //
        //                 /** links **/
        //                 vtx1.setOneLink(vtx2);
        //                 vtx2.setOneLink(vtx1);
        //                 vtx2.setOneLink(vtx3);
        //                 vtx3.setOneLink(vtx2);
        //                 vtx3.setOneLink(vtx4);
        //                 vtx4.setOneLink(vtx3);
        //                 vtx4.setOneLink(vtx5);
        //                 vtx5.setOneLink(vtx4);
        //                 vtx5.setOneLink(vtx6);
        //                 vtx6.setOneLink(vtx5);
        //                 vtx6.setOneLink(vtx7);
        //                 vtx7.setOneLink(vtx6);
        //                 vtx7.setOneLink(vtx8);
        //                 vtx8.setOneLink(vtx7);
        //                 vtx8.setOneLink(vtx9);
        //                 vtx9.setOneLink(vtx8);
        //                 vtx9.setOneLink(vtx1);
        //                 vtx1.setOneLink(vtx9);
        //                 vtx10.setOneLink(vtx1);
        //                 vtx1.setOneLink(vtx10);
        //                 vtx10.setOneLink(vtx2);
        //                 vtx2.setOneLink(vtx10);
        //                 vtx10.setOneLink(vtx9);
        //                 vtx9.setOneLink(vtx10);
        //                 vtx11.setOneLink(vtx4);
        //                 vtx4.setOneLink(vtx11);
        //                 vtx11.setOneLink(vtx8);
        //                 vtx8.setOneLink(vtx11);
        //                 vtx11.setOneLink(vtx10);
        //                 vtx10.setOneLink(vtx11);
        //                 vtx12.setOneLink(vtx6);
        //                 vtx6.setOneLink(vtx12);
        //                 vtx12.setOneLink(vtx8);
        //                 vtx8.setOneLink(vtx12);
        //                 vtx13.setOneLink(vtx4);
        //                 vtx4.setOneLink(vtx13);
        //                 vtx13.setOneLink(vtx14);
        //                 vtx14.setOneLink(vtx13);
        //                 vtx14.setOneLink(vtx15);
        //                 vtx15.setOneLink(vtx14);
        //                 vtx15_1.setOneLink(vtx15);
        //                 vtx15.setOneLink(vtx15_1);
        //                 vtx14.setOneLink(vtx16);
        //                 vtx16.setOneLink(vtx14);
        //                 vtx16.setOneLink(vtx17);
        //                 vtx17.setOneLink(vtx16);
        //                 vtx17.setOneLink(vtx19);
        //                 vtx19.setOneLink(vtx17);
        //                 vtx20.setOneLink(vtx19);
        //                 vtx19.setOneLink(vtx20);
        //                 vtx20.setOneLink(vtx17);
        //                 vtx17.setOneLink(vtx20);
        //                 vtx18.setOneLink(vtx2);
        //                 vtx2.setOneLink(vtx18);
        //                 vtx101.setOneLink(vtx102);
        //                 vtx102.setOneLink(vtx101);
        //                 vtx102.setOneLink(vtx103);
        //                 vtx103.setOneLink(vtx102);
        //                 vtx101.setOneLink(vtx103);
        //                 vtx103.setOneLink(vtx101);
        //                 vtx101.setOneLink(vtx104);
        //                 vtx104.setOneLink(vtx101);
        //                 vtx102.setOneLink(vtx105);
        //                 vtx105.setOneLink(vtx102);
        //                 // vtx105.setOneLink(vtx106); vtx106.setOneLink(vtx105);
        //                 vtx107.setOneLink(vtx106);
        //                 vtx106.setOneLink(vtx107);
        //                 vtx107.setOneLink(vtx103);
        //                 vtx103.setOneLink(vtx107);
        //                 vtx108.setOneLink(vtx105);
        //                 vtx105.setOneLink(vtx108);
        //                 vtx108.setOneLink(vtx106);
        //                 vtx106.setOneLink(vtx108);
        //                 vtx101.setOneLink(vtx15);
        //                 vtx15.setOneLink(vtx101);
        //             }
        //                 break
        //
        //             case 'Filled flat': {
        //                 /** filled flat **/
        //
        //                 /** vertices **/
        //                 let vtx1 = new mathis.Vertex().setPosition(-4, -0.5, 0);
        //                 let vtx2 = new mathis.Vertex().setPosition(-3, 1, 0);
        //                 let vtx3 = new mathis.Vertex().setPosition(-1, 2.5, 0);
        //                 let vtx4 = new mathis.Vertex().setPosition(2, 2, 0);
        //                 let vtx5 = new mathis.Vertex().setPosition(3, -0.5, 0);
        //                 let vtx6 = new mathis.Vertex().setPosition(3, -2, 0);
        //                 let vtx7 = new mathis.Vertex().setPosition(2, -3, -1);
        //                 let vtx8 = new mathis.Vertex().setPosition(-0.5, -3, 0);
        //                 let vtx9 = new mathis.Vertex().setPosition(-2.5, -3, 0);
        //                 let vtx10 = new mathis.Vertex().setPosition(-2.5, -1, 0);
        //                 let vtx11 = new mathis.Vertex().setPosition(-0, 0, 0);
        //                 let vtx12 = new mathis.Vertex().setPosition(1.5, -1.5, 0);
        //
        //                 mamesh = new mathis.Mamesh();
        //                 mamesh.vertices.push(vtx1, vtx2, vtx3, vtx4, vtx5, vtx6, vtx7, vtx8, vtx9, vtx10, vtx11, vtx12);
        //
        //                 /** links **/
        //                 vtx1.setOneLink(vtx2);
        //                 vtx2.setOneLink(vtx1);
        //                 vtx2.setOneLink(vtx3);
        //                 vtx3.setOneLink(vtx2);
        //                 vtx3.setOneLink(vtx4);
        //                 vtx4.setOneLink(vtx3);
        //                 vtx4.setOneLink(vtx5);
        //                 vtx5.setOneLink(vtx4);
        //                 vtx5.setOneLink(vtx6);
        //                 vtx6.setOneLink(vtx5);
        //                 vtx6.setOneLink(vtx7);
        //                 vtx7.setOneLink(vtx6);
        //                 vtx7.setOneLink(vtx8);
        //                 vtx8.setOneLink(vtx7);
        //                 vtx8.setOneLink(vtx9);
        //                 vtx9.setOneLink(vtx8);
        //                 vtx9.setOneLink(vtx1);
        //                 vtx1.setOneLink(vtx9);
        //                 vtx10.setOneLink(vtx1);
        //                 vtx1.setOneLink(vtx10);
        //                 vtx10.setOneLink(vtx2);
        //                 vtx2.setOneLink(vtx10);
        //                 vtx10.setOneLink(vtx9);
        //                 vtx9.setOneLink(vtx10);
        //                 vtx11.setOneLink(vtx4);
        //                 vtx4.setOneLink(vtx11);
        //                 vtx11.setOneLink(vtx8);
        //                 vtx8.setOneLink(vtx11);
        //                 vtx11.setOneLink(vtx10);
        //                 vtx10.setOneLink(vtx11);
        //                 vtx12.setOneLink(vtx6);
        //                 vtx6.setOneLink(vtx12);
        //                 vtx12.setOneLink(vtx8);
        //                 vtx8.setOneLink(vtx12);
        //
        //                 /** faces **/
        //                 mamesh.addATriangle(vtx1, vtx2, vtx10);
        //                 mamesh.addATriangle(vtx1, vtx9, vtx10);
        //                 mamesh.addASquare(vtx9, vtx10, vtx11, vtx8);
        //                 mamesh.addASquare(vtx8, vtx7, vtx6, vtx12);
        //
        //             }
        //                 break
        //
        //             case 'Half-cylinder': {
        //                 /** half-cylinder **/
        //
        //                 let creator = new mathis.reseau.TriangulatedPolygone(10);
        //                 creator.nbSubdivisionInARadius = 5;
        //                 creator.origin = new mathis.XYZ(-Math.PI * 0.8, -1, 0);
        //                 creator.end = new mathis.XYZ(+Math.PI * 0.8, 1, 0);
        //                 mamesh = creator.go();
        //                 mamesh.smallestTriangles = [];
        //
        //                 for (let _i = 0, _a = mamesh.vertices; _i < _a.length; _i++) {
        //                     let vertex = _a[_i];
        //                     let u = vertex.position.x;
        //                     let v = vertex.position.y;
        //                     vertex.position.x = Math.cos(u);
        //                     vertex.position.y = Math.sin(u);
        //                     vertex.position.z = v;
        //                 }
        //             }
        //                 break
        //
        //             case 'Moebius': {
        //                 /** moebius ring **/
        //
        //                 let basis = new mathis.reseau.BasisForRegularReseau();
        //                 basis.origin = new mathis.XYZ(0, -1, 0);
        //                 basis.end = new mathis.XYZ(2 * Math.PI, 1, 0);
        //                 basis.nbU = 20;
        //                 basis.nbV = 10;
        //                 let creator = new mathis.reseau.Regular2d(basis);
        //                 creator.makeTriangleOrSquare = false;
        //                 mamesh = creator.go();
        //                 for (let _i = 0, _a = mamesh.vertices; _i < _a.length; _i++) {
        //                     let vertex = _a[_i];
        //                     let u = vertex.position.x;
        //                     let v = vertex.position.y;
        //                     vertex.position.x = (2 - v * Math.sin(u / 2)) * Math.sin(u);
        //                     vertex.position.y = (2 - v * Math.sin(u / 2)) * Math.cos(u);
        //                     vertex.position.z = v * Math.cos(u / 2);
        //                 }
        //
        //             }
        //                 break
        //
        //             case 'Grat&glue 1': {
        //
        //                 /** Grating and gluing example 1**/
        //                 let vertices0 = [];
        //                 let vertices1 = [];
        //                 let mamesh1;
        //                 let basis0 = new mathis.reseau.BasisForRegularReseau();
        //                 basis0.origin = new mathis.XYZ(-1, -0.9, 0);
        //                 basis0.end = new mathis.XYZ(-0.05, 1.1, 0);
        //                 basis0.nbU = 5;
        //                 basis0.nbV = 10;
        //                 mamesh = new mathis.reseau.Regular2d(basis0).go();
        //                 let basis1 = new mathis.reseau.BasisForRegularReseau();
        //                 basis1.origin = new mathis.XYZ(0.05, -1, 0);
        //                 basis1.end = new mathis.XYZ(1, 1, 0);
        //                 basis1.nbU = 5;
        //                 basis1.nbV = 10;
        //                 mamesh1 = new mathis.reseau.Regular2d(basis1).go();
        //                 vertices0 = mamesh.vertices;
        //                 vertices1 = mamesh1.vertices;
        //                 new mathis.spacialTransformations.Similitude(mamesh1.vertices, 2 * Math.PI * 0.01).goChanging();
        //                 let map;
        //                 let mapFinder = new mathis.grateAndGlue.FindSickingMapFromVertices(vertices0, vertices1);
        //                 mapFinder.proximityCoef = 0.9;
        //
        //                 mapFinder.toleranceToBeOneOfTheClosest = 0.05;
        //                 map = mapFinder.go();
        //                 let sticker = new mathis.grateAndGlue.Sticker(mamesh, mamesh1, map);
        //                 sticker.goChanging();
        //
        //             }
        //                 break
        //
        //             case 'Grat&glue small': {
        //
        //                 /** Grating and gluing example 2**/
        //                 let creator0 = new reseau.TriangulatedPolygone(6);
        //                 creator0.origin = new XYZ(-1, -1, 0);
        //                 creator0.end = new XYZ(0.5, 0.5, 0);
        //                 creator0.nbSubdivisionInARadius = 1;
        //                 let mamesh0 = creator0.go();
        //                 let creator1 = new reseau.TriangulatedPolygone(6);
        //                 creator1.origin = new XYZ(-0.5, -0.5, 0);
        //                 creator1.end = new XYZ(1, 1, 0);
        //                 creator1.nbSubdivisionInARadius = 1;
        //                 let mamesh1 = creator1.go();
        //                 let graterAndSticker = new grateAndGlue.ConcurrentMameshesGraterAndSticker();
        //                 graterAndSticker.addMissingPolygons=false
        //                 graterAndSticker.IN_mameshes.push(mamesh0, mamesh1);
        //                 graterAndSticker.justGrateDoNotStick = false;
        //                 graterAndSticker.SUB_grater.proportionOfSeeds = [0.1, 0.1];
        //                 graterAndSticker.proximityCoefToStick = [2];
        //                 graterAndSticker.toleranceToBeOneOfTheClosest = 0.5;
        //                 graterAndSticker.suppressLinksAngularlyTooClose = false;
        //                 graterAndSticker.SUB_linkCleanerByAngle.suppressLinksAngularParam = 2 * Math.PI * 0.1;
        //
        //                 graterAndSticker.justGrateDoNotStick=true
        //
        //
        //                 mamesh = graterAndSticker.goChanging()
        //
        //                 cc(mamesh.toString())
        //
        //
        //             }
        //                 break
        //
        //             case 'Grat&glue 2': {
        //
        //                 /** Grating and gluing example 2**/
        //                 let creator0 = new reseau.TriangulatedPolygone(6);
        //                 creator0.origin = new XYZ(-1, -1, 0);
        //                 creator0.end = new XYZ(0.5, 0.5, 0);
        //                 creator0.nbSubdivisionInARadius = 9;
        //                 let mamesh0 = creator0.go();
        //                 let creator1 = new reseau.TriangulatedPolygone(6);
        //                 creator1.origin = new XYZ(-0.5, -0.5, 0);
        //                 creator1.end = new XYZ(1, 1, 0);
        //                 creator1.nbSubdivisionInARadius = 5;
        //                 let mamesh1 = creator1.go();
        //                 let graterAndSticker = new grateAndGlue.ConcurrentMameshesGraterAndSticker();
        //                 graterAndSticker.addMissingPolygons=false
        //
        //                 graterAndSticker.IN_mameshes.push(mamesh0, mamesh1);
        //                 graterAndSticker.justGrateDoNotStick = false;
        //                 graterAndSticker.SUB_grater.proportionOfSeeds = [0.1, 0.1];
        //                 graterAndSticker.proximityCoefToStick = [2];
        //                 graterAndSticker.toleranceToBeOneOfTheClosest = 0.5;
        //                 graterAndSticker.suppressLinksAngularlyTooClose = false;
        //                 graterAndSticker.SUB_linkCleanerByAngle.suppressLinksAngularParam = 2 * Math.PI * 0.1;
        //
        //                 mamesh = graterAndSticker.goChanging()
        //             }
        //                 break
        //
        //             case 'nothingToDo': {
        //
        //
        //                 let creator1 = new reseau.Regular2dPlus()
        //                 mamesh = creator1.go()
        //
        //                 let creator2 = new reseau.Regular2dPlus()
        //                 creator2.origin = new XYZ(3, 0, 0)
        //                 creator2.end = new XYZ(4, 1, 0)
        //                 let mamesh2 = creator2.go()
        //
        //                 for (let v of mamesh2.vertices) {
        //                     mamesh.vertices.push(v)
        //                 }
        //                 for (let v of mamesh2.smallestSquares) mamesh.smallestSquares.push(v)
        //
        //             }
        //                 break
        //
        //             case 'bugged': {
        //                 let creator0 = new reseau.TriangulatedPolygone(6);
        //                 creator0.origin = new XYZ(-1, -1, 0);
        //                 creator0.end = new XYZ(0.5, 0.5, 0);
        //                 creator0.nbSubdivisionInARadius = 9;
        //                 let mamesh0 = creator0.go();
        //
        //                 let creator1 = new reseau.TriangulatedPolygone(6);
        //                 creator1.origin = new XYZ(-0.5, -0.5, 0);
        //                 creator1.end = new XYZ(1, 1, 0);
        //                 creator1.nbSubdivisionInARadius = 5;
        //                 let mamesh1 = creator1.go();
        //
        //                 let graterAndSticker = new grateAndGlue.ConcurrentMameshesGraterAndSticker();
        //                 graterAndSticker.IN_mameshes.push(mamesh0, mamesh1);
        //                 graterAndSticker.justGrateDoNotStick = true;
        //                 graterAndSticker.SUB_grater.proportionOfSeeds = [0.1, 0.1];
        //                 graterAndSticker.proximityCoefToStick = [2];
        //                 graterAndSticker.toleranceToBeOneOfTheClosest = 0.5;
        //                 graterAndSticker.suppressLinksAngularlyTooClose = false;
        //                 graterAndSticker.SUB_linkCleanerByAngle.suppressLinksAngularParam = 2 * Math.PI * 0.1;
        //
        //                 mamesh = graterAndSticker.goChanging()
        //
        //             }
        //                 break
        //
        //         }
        //         //$$$eh
        //
        //
        //         //$$$begin
        //         let normalComputer=new polygonFinder.NormalComputerFromLinks(mamesh)
        //         let doIt=this.doIt
        //         let vertexToNormal
        //         let avant=Date.now()
        //         if(doIt) vertexToNormal=normalComputer.go()
        //         this.mathisFrame.messageDiv.append("duration of normal computation:"+(Date.now()-avant))
        //         //$$$end
        //
        //         //$$$bh visualization
        //         let verticesViewer = new mathis.visu3d.VerticesViewer(mamesh, this.mathisFrame.scene);
        //         verticesViewer.go();
        //
        //
        //         let linksViewer = new mathis.visu3d.LinksViewer(mamesh, this.mathisFrame.scene);
        //         linksViewer.go();
        //
        //         let surfaceViewer = new mathis.visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene);
        //         surfaceViewer.go();
        //
        //         if (doIt) {
        //
        //             for (let vert of mamesh.vertices) {
        //                 creation3D.drawOneVector(XYZ.newFrom(vertexToNormal.getValue(vert)), this.mathisFrame.scene, vert.position)
        //             }
        //         }
        //
        //
        //
        //         let flager=new visu3d.VerticesFlager(mamesh,this.mathisFrame.scene)
        //         flager.decayProp=new XYZ(0.3,0.3,0)
        //         flager.go()
        //
        //
        //
        //         //$$$eh
        //     }
        // }
        //



    }
}