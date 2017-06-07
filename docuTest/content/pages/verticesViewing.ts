/**
 * Created by vigon on 22/12/2016.
 */


/**
 * Created by vigon on 21/11/2016.
 */
module mathis{

    export module appli{


        export class VerticesViewingDocu implements OnePage{

            pageIdAndTitle="Vertices viewing"
            severalParts:SeveralParts
            constructor(private mathisFrame:MathisFrame){
                let severalParts=new SeveralParts()
                severalParts.addPart(new DefaultVerticesViewing(this.mathisFrame))
                severalParts.addPart(new ModelVerticesViewing(this.mathisFrame))
                severalParts.addPart(new ModelPositioning(this.mathisFrame))
                severalParts.addPart(new ModelAutoPositioning(this.mathisFrame))
                this.severalParts=severalParts
            }

            go(){
                return this.severalParts.go()
            }
        }


        class DefaultVerticesViewing implements PieceOfCode{

            NO_TEST=true


            NAME="DefaultVerticesViewing"
            TITLE="By default : Each vertices is represented by a sphere. " +
                "Sizes can be given or computed according to distances between vertices."

            radiusProportion=0.1
            $$$radiusProportion=[0.1,0.25,0.5,1]

            squareMailleInsteadOfTriangle=true
            $$$squareMailleInsteadOfTriangle=[true,false]

            constantRadius=null
            $$$constantRadius=[null,0.05,0.1,0.2]

            // useAModel=false
            // $$$useAModel=[true,false]


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
                let basis=new reseau.BasisForRegularReseau()
                basis.nbI=3
                basis.set_nbJ_toHaveRegularReseau=true
                basis.squareMailleInsteadOfTriangle=this.squareMailleInsteadOfTriangle
                basis.origin=new XYZ(-0.7,-0.7,0)
                basis.end=new XYZ(0.7,0.7,0)

                let creator = new reseau.Regular2d(basis)

                let mamesh = creator.go()
                //$$$eh


                //$$$begin

                let verticesViewer=new visu3d.VerticesViewer(mamesh, this.mathisFrame.scene)

                /**by default, this attribute is null. So radius of vertices are computed
                 * according to the distances between neighbor vertices*/
                verticesViewer.radiusAbsolute=this.constantRadius
                /**this affectation is useless if previous is not null*/
                verticesViewer.radiusProp=this.radiusProportion

                /**you can change the color (or the material via verticesViewer.material)*/
                verticesViewer.color=new Color(Color.names.indianred)

                verticesViewer.go()
                //n


                new visu3d.LinksViewer(mamesh,this.mathisFrame.scene).go()

                //$$$end

            }
        }

        class ModelVerticesViewing implements PieceOfCode{


            NO_TEST=true


            NAME="ModelVerticesViewing"
            TITLE="we use  babylonJS meshes as model for vertices"

            radiusProportion=0.25
            $$$radiusProportion=[0.1,0.25,0.5,1]

            squareMailleInsteadOfTriangle=false
            $$$squareMailleInsteadOfTriangle=[true,false]

            constantRadius=null
            $$$constantRadius=[null,0.1,0.2,0.3]

            modelChoice=0
            $$$modelChoice=[0,1,2,3]

            justShowTheModel=false
            $$$justShowTheModel=[true,false]


            // scaleTheModel=true
            // $$$scaleTheModel=[true,false]

            // backFaceCulling=true
            // $$$backFaceCulling=[true,false]


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
                let basis=new reseau.BasisForRegularReseau()
                basis.nbI=3
                basis.set_nbJ_toHaveRegularReseau=true
                basis.squareMailleInsteadOfTriangle=this.squareMailleInsteadOfTriangle
                basis.origin=new XYZ(-0.7,-0.7,0)
                basis.end=new XYZ(0.7,0.7,0)

                let creator = new reseau.Regular2d(basis)

                let mamesh = creator.go()
                //$$$eh


                //$$$begin

                let verticesViewer=new visu3d.VerticesViewer(mamesh, this.mathisFrame.scene)
                verticesViewer.radiusAbsolute=this.constantRadius
                verticesViewer.radiusProp=this.radiusProportion


                /**model mush have a bounding "radius" of 1. It will be re-sized by the vertices-viewer */
                let modelChoice=this.modelChoice

                if (modelChoice==0){
                    verticesViewer.meshModel=BABYLON.Mesh.CreateCylinder("",2,0,2,20,2,this.mathisFrame.scene)
                }
                else if (modelChoice==1){
                    /**we can put several models, and change the red-default color*/
                    verticesViewer.meshModels=[BABYLON.Mesh.CreateBox("",1,this.mathisFrame.scene),BABYLON.Mesh.CreateCylinder("",1,0,1,20,2,this.mathisFrame.scene)]
                    verticesViewer.meshModels[0].position.y=-0.5
                    verticesViewer.meshModels[1].position.y=+0.5
                    verticesViewer.color=new Color(Color.names.deeppink)
                }
                else if (modelChoice==2){
                    verticesViewer.meshModel=BABYLON.Mesh.CreateDisc("",1,20,this.mathisFrame.scene)
                    /**if a material is specified, default material is not used*/
                    let material=new BABYLON.StandardMaterial("",this.mathisFrame.scene)
                    material.backFaceCulling=false //better for a disk
                    material.diffuseColor=new BABYLON.Color3(0,0,1)//blue
                    verticesViewer.meshModel.material=material
                }
                else if (modelChoice==3){
                    /**the x-axis (red) is sent to the normal vectors*/
                    verticesViewer.meshModels=new creation3D.TwoOrTreeAxis(this.mathisFrame.scene).go()
                }

                //n
                let justShowTheModel=this.justShowTheModel
                if (!justShowTheModel){
                    /**if you do not fire "verticesViewer.goChanging()", we just see the model.*/
                    verticesViewer.go()
                    new visu3d.LinksViewer(mamesh,this.mathisFrame.scene).go()
                }


                //$$$end


            }



        }


        class ModelPositioning implements PieceOfCode{


            NO_TEST=true


            NAME="ModelPositioning"
            TITLE="we specify the positioning of the models"

            // radiusProportion=0.25
            // $$$radiusProportion=[0.1,0.25,0.5,1]

            squareMailleInsteadOfTriangle=false
            $$$squareMailleInsteadOfTriangle=[true,false]

            // constantRadius=null
            // $$$constantRadius=[null,0.1,0.2,0.3]

            modelChoice=3
            $$$modelChoice=[0,1,2,3]

            justShowTheModel=false
            $$$justShowTheModel=[true,false]


            // scaleTheModel=true
            // $$$scaleTheModel=[true,false]

            // backFaceCulling=true
            // $$$backFaceCulling=[true,false]


            constructor(private mathisFrame:MathisFrame){}

            goForTheFirstTime(){
                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()

                this.go()
            }

            go(){

                this.mathisFrame.clearScene(false,false)

                //$$$bh mamesh creation as previously
                let basis=new reseau.BasisForRegularReseau()
                basis.nbI=5
                basis.set_nbJ_toHaveRegularReseau=true
                basis.squareMailleInsteadOfTriangle=this.squareMailleInsteadOfTriangle
                basis.origin=new XYZ(-0.7,-0.7,0)
                basis.end=new XYZ(0.7,0.7,0)

                let creator = new reseau.Regular2d(basis)

                let mamesh = creator.go()

                let verticesViewer=new visu3d.VerticesViewer(mamesh, this.mathisFrame.scene)

                /**model mush have a bounding "radius" of 1. It will be re-sized by the vertices-viewer */
                let modelChoice=this.modelChoice

                if (modelChoice==0){
                    verticesViewer.meshModel=BABYLON.Mesh.CreateCylinder("",2,0,2,20,2,this.mathisFrame.scene)
                }
                else if (modelChoice==1){
                    /**we can put several models, and change the red-default color*/
                    verticesViewer.meshModels=[BABYLON.Mesh.CreateBox("",1,this.mathisFrame.scene),BABYLON.Mesh.CreateCylinder("",1,0,1,20,2,this.mathisFrame.scene)]
                    verticesViewer.meshModels[0].position.y=-0.5
                    verticesViewer.meshModels[1].position.y=+0.5
                    verticesViewer.color=new Color(Color.names.deeppink)
                }
                else if (modelChoice==2){
                    verticesViewer.meshModel=BABYLON.Mesh.CreateDisc("",1,20,this.mathisFrame.scene)
                    /**if a material is specified, default material is not used*/
                    let material=new BABYLON.StandardMaterial("",this.mathisFrame.scene)
                    material.backFaceCulling=false //better for a disk
                    material.diffuseColor=new BABYLON.Color3(0,0,1)//blue
                    verticesViewer.meshModel.material=material
                }
                else if (modelChoice==3){
                    /**the x-axis (red) is sent to the normal vectors*/
                    let twoAxisCreator=new creation3D.TwoOrTreeAxis(this.mathisFrame.scene)
                    twoAxisCreator.threeVersusTwoAxis=false
                    verticesViewer.meshModels=twoAxisCreator.go()                }

                //$$$eh


                //$$$begin


                let positionings=new HashMap<Vertex,Positioning>()
                for (let i=0;i<mamesh.vertices.length;i++){
                    let positioning=new Positioning()
                    let angle=Math.random()*Math.PI*2
                    positioning.setOrientation(new XYZ(0,0,-1),new XYZ(Math.cos(angle),Math.sin(angle),0))
                    positioning.scaling=new XYZ(0.2,0.2,0.2)
                    positionings.putValue(mamesh.vertices[i],positioning)
                }
                verticesViewer.positionings=positionings


                //n
                let justShowTheModel=this.justShowTheModel
                if (!justShowTheModel){
                    /**if you do not fire "verticesViewer.goChanging()", we just see the model.*/
                    verticesViewer.go()
                    new visu3d.LinksViewer(mamesh,this.mathisFrame.scene).go()
                }


                //$$$end


            }



        }




        class ModelAutoPositioning implements PieceOfCode{


            NO_TEST=true


            NAME="ModelAutoPositioning"
            TITLE="Positionings are computed from mamesh : " +
                "FrontDir is aligned to the link which has the direction the closest as possible from the give 'attractionForTangent'.  " +
                "UpVector is the normal of the surface, which is the mean of the normal of triangle/quad around."

            // squareMailleInsteadOfTriangle=false
            // $$$squareMailleInsteadOfTriangle=[true,false]

            // constantRadius=null
            // $$$constantRadius=[null,0.1,0.2,0.3]

            modelChoice=3
            $$$modelChoice=[0,1,2,3]

            // justShowTheModel=false
            // $$$justShowTheModel=[true,false]


            // scaleTheModel=true
            // $$$scaleTheModel=[true,false]

            // backFaceCulling=true
            // $$$backFaceCulling=[true,false]


            attractionForTangent=new XYZ(100,10,0)
            $$$attractionForTangent=new Choices([new XYZ(100,10,0),new XYZ(-100,0,0),new XYZ(0,100,0),new XYZ(0,0,100)],{'before':"new mathis.XYZ"})

            cylinderVersusSphere=true
            $$$cylinderVersusSphere=[true,false]

            // randomFrontDir=false
            // $$$randomFrontDir=[true,false]


            constructor(private mathisFrame:MathisFrame){}

            goForTheFirstTime(){
                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()

                this.go()
            }

            go(){

                this.mathisFrame.clearScene(false,false)

                //$$$b
                let cylinderVersusSphere=this.cylinderVersusSphere
                //$$$e

                //$$$bh cylinder or sphere creation
                let mamesh
                if (cylinderVersusSphere){
                    let basis=new reseau.BasisForRegularReseau()
                    basis.origin=new XYZ(0,-1,0)
                    basis.end=new XYZ(Math.PI,+1,0)
                    basis.nbI=5
                    basis.nbJ=7
                    mamesh=new reseau.Regular2d(basis).go()
                    for (let i=0;i<mamesh.vertices.length;i++){
                        let oldPosition=XYZ.newFrom(mamesh.vertices[i].position)
                        mamesh.vertices[i].position.x=Math.cos(oldPosition.x)
                        mamesh.vertices[i].position.z=Math.sin(oldPosition.x)
                    }
                }
                else{
                    let creator=new polyhedron.Polyhedron("dodecahedron")
                    mamesh = creator.go()
                    new mameshModification.TriangleDichotomer(mamesh).go()
                    for (let i=0;i<mamesh.vertices.length;i++) {
                        mamesh.vertices[i].position.normalize()
                    }
                }


                let verticesViewer=new visu3d.VerticesViewer(mamesh, this.mathisFrame.scene)

                //$$$eh

                //$$$b
                let modelChoice=this.modelChoice
                //$$$e

                //$$$bh model creation
                if (modelChoice==0){
                    verticesViewer.meshModel=BABYLON.Mesh.CreateCylinder("",2,0,2,20,2,this.mathisFrame.scene)
                }
                else if (modelChoice==1){
                    /**we can put several models, and change the red-default color*/
                    verticesViewer.meshModels=[BABYLON.Mesh.CreateBox("",1,this.mathisFrame.scene),BABYLON.Mesh.CreateCylinder("",1,0,1,20,2,this.mathisFrame.scene)]
                    verticesViewer.meshModels[0].position.y=-0.5
                    verticesViewer.meshModels[1].position.y=+0.5
                    verticesViewer.color=new Color(Color.names.deeppink)
                }
                else if (modelChoice==2){
                    verticesViewer.meshModel=BABYLON.Mesh.CreateDisc("",1,20,this.mathisFrame.scene)
                    /**if a material is specified, default material is not used*/
                    let material=new BABYLON.StandardMaterial("",this.mathisFrame.scene)
                    material.backFaceCulling=false //better for a disk
                    material.diffuseColor=new BABYLON.Color3(0,0,1)//blue
                    verticesViewer.meshModel.material=material
                }
                else if (modelChoice==3){
                    let twoAxisCreator=new creation3D.TwoOrTreeAxis(this.mathisFrame.scene)
                    twoAxisCreator.threeVersusTwoAxis=false
                    verticesViewer.meshModels=twoAxisCreator.go()
                }

                //$$$eh


                //$$$begin


                let positioningComputer=new mameshAroundComputations.PositioningComputerForMameshVertices(mamesh)
                positioningComputer.attractionOfTangent=this.attractionForTangent

                /**to compute normal (= upVector) is quite a heavy job : first we must compute a normal by polygon, and
                 * then, for each vertex, we have to take the barycenter of the normal of polygons around.
                 * Moreover these normals can be use by several guys e.g. by other verticesViewers or by a linksViewer (see further on).
                 * So it is a good think to memorize  vertexToPositioning inside the mamesh*/
                mamesh.vertexToPositioning=positioningComputer.go()
                /**then we have to say to the verticesViewer  to use this vertexToPositioning*/
                verticesViewer.positionings=mamesh.vertexToPositioning
                console.log(mamesh.vertexToPositioning)
                verticesViewer.go()

                //n
                let linksViewer=new visu3d.LinksViewer(mamesh,this.mathisFrame.scene)
                linksViewer.radiusAbsolute=0.005
                linksViewer.go()


                //$$$end


            }



        }













    }



}