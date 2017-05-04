/**
 * Created by vigon on 26/12/2016.
 */


/**
 * Created by vigon on 22/12/2016.
 */


/**
 * Created by vigon on 21/11/2016.
 */
module mathis{

    export module documentation{


        export class LinksViewingDocu implements OnePage{

            pageIdAndTitle="Links viewing"
            severalParts:SeveralParts

            constructor(private mathisFrame:MathisFrame){
                let severalParts=new SeveralParts()
                severalParts.addPart(new JustTheSizeOfLinks(this.mathisFrame))
                severalParts.addPart(new OrientationLinksViewing(this.mathisFrame))
                severalParts.addComment("In the sequel we explain how to finely adjust the links-representation.","In the sequel we explain how to finely adjust the links-representation")
                severalParts.addPart(new Elongate(this.mathisFrame))
                severalParts.addPart(new DefaultLinksViewing(this.mathisFrame))
                severalParts.addPart(new CustomLinksViewing(this.mathisFrame))
                this.severalParts=severalParts
            }

            go(){
                 return this.severalParts.go()
            }
        }



        class JustTheSizeOfLinks implements PieceOfCode{


            $$$name="JustTheSizeOfLinks"

            $$$title="As a simple usage, you can specified  the color and the lateral-size of links. This size can be relative or absolute."

            nbSides=4
            $$$nbSides=[4,7,10]

            nbSubdivisionInARadius=3
            $$$nbSubdivisionInARadius=[2,3,5]

            color=Color.names.rebeccapurple
            $$$color=new Choices([Color.names.rebeccapurple,Color.names.rosybrown,Color.names.darkorange],
                {'before':'Color.names.','visualValues':['rebeccapurple','rosybrown','darkorange']})

            lateralScalingProp=0.05
            $$$lateralScalingProp=[0.01,0.05,0.1]


            lateralScalingConstant=null
            $$$lateralScalingConstant=[null,0.05,0.1,0.2]



            constructor(private mathisFrame:MathisFrame){}



            goForTheFirstTime(){
                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()

                this.go()
            }

            go() {
                this.mathisFrame.clearScene(false, false)

                //$$$b
                let creator=new reseau.TriangulatedPolygone(this.nbSides)
                creator.nbSubdivisionInARadius=this.nbSubdivisionInARadius
                let mamesh=creator.go()

                //n
                let linksViewer=new visu3d.LinksViewer(mamesh,this.mathisFrame.scene)
                linksViewer.color=new Color(this.color)
                /**if null, the lateral scaling is proportional to the mean distance between linked vertices*/
                linksViewer.lateralScalingConstant=this.lateralScalingConstant
                /**useless if previous is not null,*/
                linksViewer.lateralScalingProp=this.lateralScalingProp
                linksViewer.go()
                //$$$e

            }

        }


        class OrientationLinksViewing implements PieceOfCode{


            $$$name="OrientationLinksViewing"

            $$$title=`Now we specify a model (here an arrow), and indicate which links must be drawn and in which direction.`
            

            polyhedronType=creation3D.PolyhedronType.Cube
            $$$polyhedronType=new Choices([creation3D.PolyhedronType.Tetrahedron,creation3D.PolyhedronType.Cube,creation3D.PolyhedronType.Dodecahedron]
                ,{'before':'creation3D.PolyhedronType.','visualValues':['Tetrahedron','Cube','Dodecahedron']})


            showLateralDirection=false
            $$$showLateralDirection=[true,false]


            methodChoice=-1
            $$$methodChoice=[-1,0,1,2,3]

            constructor(private mathisFrame:MathisFrame){}



            goForTheFirstTime(){
                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()

                this.go()
            }

            go() {
                this.mathisFrame.clearScene(false, false)

                //$$$b

                let creator=new creation3D.Polyhedron(this.polyhedronType)
                let mamesh=creator.go()
                //$$$e

                //$$$bh the model is an arrow
                let modelsCreator=new creation3D.ArrowCreator(this.mathisFrame.scene)
                modelsCreator.arrowFootAtOrigin=false
                modelsCreator.bodyDiameterProp=1
                modelsCreator.headDiameterProp=2
                let model=modelsCreator.go()
                let material=new BABYLON.StandardMaterial("",this.mathisFrame.scene)
                material.diffuseColor=new BABYLON.Color3(0,0,1)
                model.material=material
                /**to avoid smoothing */
                model.convertToFlatShadedMesh()
                //$$$eh

                //$$$b
                let segmentOrientationFunction
                let methodChoice=this.methodChoice
                if (methodChoice==-1){
                    /**no function : so all the link are drawn with a random orientation*/
                    segmentOrientationFunction=null
                }
                else if (methodChoice==0) {
                    /**if the function return 0 : no links are drawn
                     * else : orientation is chosen according to the sign of the return values*/
                    segmentOrientationFunction=function(v0,v1){
                        if (geo.almostEquality(v0.position.y,v1.position.y)) return 0
                        return v0.position.y-v1.position.y
                    }
                }
                else if (methodChoice==1){
                    /**the opposite method*/
                    segmentOrientationFunction=function(v0:Vertex,v1:Vertex){
                        if (geo.almostEquality(v0.position.y,v1.position.y)) return 0
                        return -v0.position.y+v1.position.y
                    }
                }
                else if (methodChoice==2){
                    segmentOrientationFunction=function(v0:Vertex,v1:Vertex){
                        if (geo.almostEquality(v0.position.z,v1.position.z)) return 0
                        return v0.position.z-v1.position.z
                    }
                }
                else if (methodChoice==3){
                    /**please, try this method on the Dodecahedron*/
                    segmentOrientationFunction=function(v0:Vertex,v1:Vertex){
                        if (v0.hasMark(Vertex.Markers.polygonCenter)|| v1.hasMark(Vertex.Markers.polygonCenter) ) return 0
                        return v0.position.z-v1.position.z
                    }
                }


                let linksViewer=new visu3d.LinksViewer(mamesh,this.mathisFrame.scene)
                linksViewer.meshModel=model
                linksViewer.segmentOrientationFunction=segmentOrientationFunction
                linksViewer.go()


                //$$$e









            }

        }


        class Elongate implements PieceOfCode{

            $$$name="Elongate"

            $$$title="Links viewing is made via an 'elongator'. This elongator take a vertical mesh (eg cylinder, arrow...) " +
                "and place its between two positions. Lateral-direction and lateral-scaling can be given."

            upVector=new XYZ(0,0,1)
            $$$upVector=new Choices([new XYZ(0,0,1),new XYZ(0,1,1),new XYZ(0,0.5,1)],{'before':'new XYZ'})

            endPos=new XYZ(1,0,0)
            $$$endPos=new Choices([new XYZ(1,0,0),new XYZ(-1,0.5,0),new XYZ(1,1,0)],{'before':'new XYZ'})

            modelChoice=0
            $$$modelChoice=[0,1,2]

            lateralScaling=0.1
            $$$lateralScaling=[0.05,0.1,0.5]

            justSeeModels=false
            $$$justSeeModels=[true,false]
            
            showLateralDirection=true
            $$$showLateralDirection=[true,false]

            constructor(private mathisFrame:MathisFrame){}

            goForTheFirstTime(){
                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()

                this.go()
            }

            go() {
                this.mathisFrame.clearScene(false, false)


                //$$$b
                let modelChoice=this.modelChoice
                let model:BABYLON.Mesh
                if (modelChoice==0){
                    model=BABYLON.Mesh.CreateBox("",1,this.mathisFrame.scene)
                }
                else if (modelChoice==1){
                    model=BABYLON.Mesh.CreateCylinder("",1,1,1,3,3,this.mathisFrame.scene)
                }
                else if (modelChoice==2){
                    let modelsCreator=new creation3D.ArrowCreator(this.mathisFrame.scene)
                    modelsCreator.arrowFootAtOrigin=false
                    modelsCreator.bodyDiameterProp=1
                    modelsCreator.headDiameterProp=2
                    model=modelsCreator.go()
                }
                let material=new BABYLON.StandardMaterial("",this.mathisFrame.scene)
                material.diffuseColor=new BABYLON.Color3(0,0,1)
                model.material=material
                /**to avoid smoothing */
                model.convertToFlatShadedMesh()


                let justSeeModels=this.justSeeModels
                let endPos=this.endPos

                let lateralDirection=this.upVector

                if (!justSeeModels) {
                    let elongator = new visu3d.ElongateAMeshFromBeginToEnd(new XYZ(-1, 0, 0),endPos , model)
                    elongator.lateralDirection = lateralDirection
                    elongator.lateralScaling = this.lateralScaling
                    elongator.goChanging()
                }
                //n
                let showLateralDirection=this.showLateralDirection
                //$$$e

                //$$$bh the code to show the lateral direction
                if (showLateralDirection) {
                    let lateralVector = new creation3D.ArrowCreator(this.mathisFrame.scene).go()
                    let quaternion = new XYZW(0, 0, 0, 0)
                    geo.axisAngleToQuaternion(new XYZ(0, 0, 1), -Math.PI / 2, quaternion)
                    lateralVector.rotationQuaternion = quaternion
                    lateralVector.bakeCurrentTransformIntoVertices()
                    if (!justSeeModels) {

                        let elongator2 = new visu3d.ElongateAMeshFromBeginToEnd(new XYZ(-1, 0, 0), endPos, lateralVector)
                        elongator2.lateralDirection = lateralDirection
                        elongator2.lateralScaling = 1
                        elongator2.goChanging()
                    }
                }
                //$$$eh

                
            }
            
        }


        class DefaultLinksViewing implements PieceOfCode{


            $$$name="DefaultLinksViewing"

            $$$title="The links are drawn using the default method to compute lateral directions (these direction are illustrated by the white arrows)"

            modelChoice=0
            $$$modelChoice=[-1,0,1,2]

            lateralScalingProp=0.05
            $$$lateralScalingProp=[0.01,0.05,0.1]

            lateralScalingConstant=null
            $$$lateralScalingConstant=[null,0.05,0.1,0.2]


            justSeeModels=false
            $$$justSeeModels=[true,false]

            polyhedronType=creation3D.PolyhedronType.Cube
            $$$polyhedronType=new Choices([creation3D.PolyhedronType.Tetrahedron,creation3D.PolyhedronType.Cube,creation3D.PolyhedronType.Dodecahedron]
                ,{'before':'creation3D.PolyhedronType.','visualValues':['Tetrahedron','Cube','Dodecahedron']})


            showLateralDirection=true
            $$$showLateralDirection=[true,false]
            
            constructor(private mathisFrame:MathisFrame){}

            goForTheFirstTime(){
                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()

                this.go()
            }

            go() {
                this.mathisFrame.clearScene(false, false)

                //$$$b

                let creator=new creation3D.Polyhedron(this.polyhedronType)
                let mamesh=creator.go()
                let modelChoice=this.modelChoice
                //$$$e

                //$$$bh model construction (-1 for default cylinder)

                let model:BABYLON.Mesh
                if (modelChoice==-1){
                    /**default:no model*/
                    model=null
                }
                else if (modelChoice==0){
                    model=BABYLON.Mesh.CreateBox("",1,this.mathisFrame.scene)
                }
                else if (modelChoice==1){
                    model=BABYLON.Mesh.CreateCylinder("",1,1,1,3,3,this.mathisFrame.scene)
                }
                else if (modelChoice==2){
                    let modelsCreator=new creation3D.ArrowCreator(this.mathisFrame.scene)
                    modelsCreator.arrowFootAtOrigin=false
                    modelsCreator.bodyDiameterProp=1
                    modelsCreator.headDiameterProp=2
                    model=modelsCreator.go()
                }
                if (model!=null){
                    let material=new BABYLON.StandardMaterial("",this.mathisFrame.scene)
                    material.diffuseColor=new BABYLON.Color3(0,0,1)
                    model.material=material
                    /**to avoid smoothing */
                    model.convertToFlatShadedMesh()
                }
                //$$$eh

                //$$$b
                let justSeeModels=this.justSeeModels

                if (!justSeeModels) {
                    let linksViewer=new visu3d.LinksViewer(mamesh,this.mathisFrame.scene)
                    linksViewer.meshModel=model
                    /**if null, the lateral scaling is proportional to the mean distance between linked vertices*/
                    linksViewer.lateralScalingConstant=this.lateralScalingConstant
                    /**useless if previous is not null,*/
                    linksViewer.lateralScalingProp=this.lateralScalingProp

                    linksViewer.go()
                }
                //n
                let showLateralDirection=this.showLateralDirection
                //$$$e

                //$$$bh the code to show the lateral directions
                if (showLateralDirection) {
                    let lateralVector = new creation3D.ArrowCreator(this.mathisFrame.scene).go()
                    let quaternion = new XYZW(0, 0, 0, 0)
                    geo.axisAngleToQuaternion(new XYZ(0, 0, 1), -Math.PI / 2, quaternion)
                    lateralVector.rotationQuaternion = quaternion
                    lateralVector.bakeCurrentTransformIntoVertices()
                    if (!justSeeModels) {
                        let linksViewer = new visu3d.LinksViewer(mamesh, this.mathisFrame.scene)
                        linksViewer.meshModel = lateralVector
                        linksViewer.lateralScalingConstant = 0.3
                        linksViewer.go()
                    }
                }
                //$$$eh



                
                
                

            }

        }



        class CustomLinksViewing implements PieceOfCode{


            $$$name="CustomLinksViewing"

            $$$title="The links are drawn using some methods to compute lateral directions (these direction are illustrated by the white arrows)"

            modelChoice=0
            $$$modelChoice=[-1,0,1,2]

            lateralScalingProp=0.05
            $$$lateralScalingProp=[0.01,0.05,0.1]

            lateralScalingConstant=null
            $$$lateralScalingConstant=[null,0.05,0.1,0.2]


            justSeeModels=false
            $$$justSeeModels=[true,false]

            polyhedronType=creation3D.PolyhedronType.Cube
            $$$polyhedronType=new Choices([creation3D.PolyhedronType.Tetrahedron,creation3D.PolyhedronType.Cube,creation3D.PolyhedronType.Dodecahedron]
                ,{'before':'creation3D.PolyhedronType.','visualValues':['Tetrahedron','Cube','Dodecahedron']})


            showLateralDirection=true
            $$$showLateralDirection=[true,false]


            methodChoice=0
            $$$methodChoice=[-1,0,1]

            constructor(private mathisFrame:MathisFrame){}

            
            
            goForTheFirstTime(){
                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()

                this.go()
            }

            go() {
                this.mathisFrame.clearScene(false, false)

                //$$$b

                let creator=new creation3D.Polyhedron(this.polyhedronType)
                let mamesh=creator.go()
                let modelChoice=this.modelChoice
                //$$$e

                //$$$bh model construction (-1 for the default green cylinder)

                let model:BABYLON.Mesh
                if (modelChoice==-1){
                    /**default:no model*/
                    model=null
                }
                else if (modelChoice==0){
                    model=BABYLON.Mesh.CreateBox("",1,this.mathisFrame.scene)
                }
                else if (modelChoice==1){
                    model=BABYLON.Mesh.CreateCylinder("",1,1,1,3,3,this.mathisFrame.scene)
                }
                else if (modelChoice==2){
                    let modelsCreator=new creation3D.ArrowCreator(this.mathisFrame.scene)
                    modelsCreator.arrowFootAtOrigin=false
                    modelsCreator.bodyDiameterProp=1
                    modelsCreator.headDiameterProp=2
                    model=modelsCreator.go()
                }
                if (model!=null){
                    let material=new BABYLON.StandardMaterial("",this.mathisFrame.scene)
                    material.diffuseColor=new BABYLON.Color3(0,0,1)
                    model.material=material
                    /**to avoid smoothing */
                    model.convertToFlatShadedMesh()
                }
                //$$$eh

                //$$$b
                let justSeeModels=this.justSeeModels
                
                

                let pairVertexToLateralDirection
                let methodChoice=this.methodChoice
                if (methodChoice==-1){
                    /**so the default method will be used*/
                    pairVertexToLateralDirection=null
                }
                if (methodChoice==0) {
                    /**a method ad hoc for the cube with straight-links*/
                    let linkDirection=new XYZ(0,0,0)
                    let lateralDir1=new XYZ(0,1,0)
                    let lateralDir2=new XYZ(1,0,0)
                    pairVertexToLateralDirection = function (v0, v1) {
                        linkDirection.copyFrom(v0.position).substract(v1.position)
                        if (geo.almostParallel(linkDirection, lateralDir1)) return lateralDir2
                        else return lateralDir1
                    }
                }
                else{
                    /**a method which use the normal vector of vertices 
                     * Perhaps you already have computed this normal vector, 
                     * and perhaps you saved them as mamesh.vertexToPositioning (see vertex viewing)*/
                    let normalComputing=new mameshAroundComputations.PositioningComputerForMameshVertices(mamesh)
                    normalComputing.computeTangent=false//we just want normals
                    normalComputing.computeSizes=false
                    normalComputing.computeNormal=true
                    let positionings=normalComputing.go()

                    /**this method return the sum of the two  normals*/
                    pairVertexToLateralDirection = function (v0, v1) {
                        let res=new XYZ(0,0,0)
                        return res.copyFrom(positionings.getValue(v0).upVector).add(positionings.getValue(v1).upVector)
                    }
                }

                if (!justSeeModels) {
                    let linksViewer=new visu3d.LinksViewer(mamesh,this.mathisFrame.scene)
                    linksViewer.meshModel=model
                    linksViewer.pairVertexToLateralDirection=pairVertexToLateralDirection
                    linksViewer.go()
                }
                //n
                let showLateralDirection=this.showLateralDirection
                //$$$e

                //$$$bh the code to show the lateral directions
                if (showLateralDirection) {
                    let lateralVector = new creation3D.ArrowCreator(this.mathisFrame.scene).go()
                    let quaternion = new XYZW(0, 0, 0, 0)
                    geo.axisAngleToQuaternion(new XYZ(0, 0, 1), -Math.PI / 2, quaternion)
                    lateralVector.rotationQuaternion = quaternion
                    lateralVector.bakeCurrentTransformIntoVertices()
                    if (!justSeeModels) {
                        let linksViewer = new visu3d.LinksViewer(mamesh, this.mathisFrame.scene)
                        linksViewer.meshModel = lateralVector
                        linksViewer.lateralScalingConstant = 0.3
                        linksViewer.pairVertexToLateralDirection=pairVertexToLateralDirection
                        linksViewer.go()
                    }
                }
                //$$$eh







            }

        }













    }



}