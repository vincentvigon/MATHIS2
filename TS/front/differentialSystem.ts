/**
 * Created by vigon on 08/11/2016.
 */

module mathis{

    export module differentialSystem{


        export class TwoDim{


            originMath=new XYZ(0,0,0)
            endMath=new XYZ(1,1,0)
            originView=new XYZ(-1,-1,0)
            endView=new XYZ(1,1,0)
            nbI=20
            nbJ=20



            departure=new XYZ(0,0,0)
            mathisFrame:MathisFrame
            deltaT=0.1

            vectorsAreArrowsVersusCone=true
            scaleVectorsAccordingToTheirNorm=false


            randomExitation:()=>XYZ
            
            makeLightAndCamera=true
            

            private planForClick:BABYLON.Mesh
            private mamesh:Mamesh
            private positionings:HashMap<Vertex,Positioning>
            private vectorReferencesize:number
            private arrowModel:BABYLON.Mesh


            private generator= new reseau.BasisForRegularReseau()


            vectorFieldForNoise:(t:number, p:XYZ,res:XYZ)=>void
            private vectorFieldForNoiseScaled:(t:number, p:XYZ,res:XYZ)=>void

            vectorField:(t:number, p:XYZ,res:XYZ)=>void
            private vectorFieldScaled:(t:number, p:XYZ,res:XYZ)=>void

            constructor(vectorField:(t:number, p:XYZ,res:XYZ)=>void,mathisFrame:MathisFrame){
                this.vectorField=vectorField
                this.mathisFrame=mathisFrame
            }

            go() {


                if (this.randomExitation==null) this.randomExitation=()=>{return new XYZ(Math.random()-0.5,Math.random()-0.5,Math.random()-0.5)}
                

                this.generator.nbI = this.nbI
                this.generator.nbJ = this.nbJ
                this.generator.origin = this.originView
                this.generator.end = this.endView
                
                this.makePlanForClick()
                if(this.makeLightAndCamera) this.lightAndCamera()
                
                this.arrowModel=this.createArrowModel()

                this.scaler=geo.affineTransformGenerator(this.originView,this.endView,this.originMath,this.endMath)
                /**can be fired at any moment when we want to change vector fields*/
                this.loadVectorFields()

                this.mameshAndPositioning()
                if(this.scaleVectorsAccordingToTheirNorm) this.prepareRescaling()
                this.start()
            }
            
            
            // restartWithNewVectorField(vectorField:(t:number, p:XYZ,res:XYZ)=>void){
            //     this.vectorField=vectorField
            //     this.mameshAndPositioning()
            //     this.start()
            // }

            
            private makePlanForClick(){
                this.planForClick = BABYLON.Mesh.CreatePlane('', 1, this.mathisFrame.scene)
                let amplitude=XYZ.newFrom(this.generator.end).substract(this.generator.origin)
                let middle=XYZ.newFrom(this.generator.origin).add(this.generator.end).scale(0.5)
                this.planForClick.scaling = new XYZ(amplitude.x, amplitude.y, 0)
                /**doit être derriere le grabber, sinon il masque ce dernier
                 * doit être devant les fléches*/
                this.planForClick.position = new XYZ(middle.x, middle.y, 0.06)
                this.planForClick.bakeCurrentTransformIntoVertices();
                this.planForClick.visibility=0
            }


            private lightAndCamera(){

                let amplitude=XYZ.newFrom(this.generator.end).substract(this.generator.origin)
                
                let grabber=new macamera.PlanarGrabber(this.mathisFrame.scene,new XYZ(amplitude.x,amplitude.y,0.061))
                grabber.mesh.visibility=0
                let macam = new macamera.GrabberCamera(this.mathisFrame,grabber)
                macam.checkCollisions = false
                macam.useFreeModeWhenCursorOutOfGrabber=false
                macam.changePosition(new XYZ(0,0,-2),false)
                macam.attachControl(this.mathisFrame.canvas)

                //let bacam=new BABYLON.FreeCamera("",new BABYLON.Vector3(0,0,-2),this.mathisFrame.scene)
                //bacam.attachControl(this.mathisFrame.canvas)
                
                let light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(-1, 1, -1), this.mathisFrame.scene);
                light0.diffuse = new BABYLON.Color3(0.5, 0.5, 0.5);
                light0.specular = new BABYLON.Color3(0.7, 0.7, 0.7);
                light0.groundColor = new BABYLON.Color3(1, 1, 1);
            }

            
            
            private stochasticVariation=new XYZ(0,0,0)
            private dW=new XYZ(0,0,0)
            private computeNewPathPoint(previousPoint:XYZ, t:number,res:XYZ):void{
                this.vectorFieldScaled(t, previousPoint,res)
                res.scale(this.deltaT)

                if (this.vectorFieldForNoiseScaled!=null){
                    this.vectorFieldForNoiseScaled(t,previousPoint,this.stochasticVariation)
                    //this.dW.copyFromFloats(gaussian.goChanging(),gaussian.goChanging(),gaussian.goChanging())
                    this.stochasticVariation.multiply(this.randomExitation()).scale(Math.sqrt(this.deltaT))
                    res.add(this.stochasticVariation)
                }

                res.add(previousPoint)

            }


            private scaler=null
            private mameshAndPositioning() {

                
                
                let regCrea = new reseau.Regular(this.generator)
                regCrea.squareVersusTriangleMaille = false
                this.mamesh=regCrea.go()

                let posiComp=new mameshAroundComputations.PositioningComputerForMameshVertices(this.mamesh)
                /**tangents are given by the vector field*/
                posiComp.computeTangent=false
                posiComp.sizesProp=new XYZ(0.15,0.15,0.15)
                this.positionings=posiComp.go()
                this.vectorReferencesize=this.positionings.getValue(this.mamesh.vertices[0]).scaling.x

            }


            private createArrowModel():BABYLON.Mesh{

                let arrowModel:BABYLON.Mesh
                let qua=new XYZW(0,0,0,0)
                geo.axisAngleToQuaternion(new XYZ(0,0,1),-Math.PI/2,qua)

                if (this.vectorsAreArrowsVersusCone){
                    let arrowCreator=new creation3D.ArrowCreator(this.mathisFrame.scene)
                    arrowCreator.quaternion=qua
                    arrowCreator.arrowFootAtOrigin=false
                    arrowCreator.totalHeight=3
                    arrowCreator.bodyDiameterProp=0.2
                    arrowCreator.headDiameterProp=0.4
                    arrowModel=arrowCreator.go()
                }
                else{
                    arrowModel =BABYLON.Mesh.CreateCylinder('',2,0,1,6,null,this.mathisFrame.scene)
                    arrowModel.rotationQuaternion=qua
                    arrowModel.bakeCurrentTransformIntoVertices()
                }

                let mat=new BABYLON.StandardMaterial('',this.mathisFrame.scene)
                mat.diffuseColor=new BABYLON.Color3(0,0,1)
                arrowModel.material=mat

                return arrowModel
            }
            
            
            loadVectorFields(){
                let pScaled=new XYZ(0,0,0)
                /**  p is a point of the view rectangle, we have to scale it into the math rectangle before the find the corresponding vector */
                this.vectorFieldScaled=(t:number, p:XYZ,res:XYZ)=>{
                    this.scaler(p,pScaled)
                    this.vectorField(t,pScaled,res)
                }

                if (this.vectorFieldForNoise!=null) {
                    let p2Scaled = new XYZ(0, 0, 0)
                    this.vectorFieldForNoiseScaled = (t:number, p:XYZ, res:XYZ)=> {
                        this.scaler(p, p2Scaled)
                        this.vectorFieldForNoise(t, p2Scaled, res)
                    }
                }
            }
            

            start(){


                let snake=new creation3D.Snake(this.mathisFrame)
                snake.initialPosition=this.departure
                snake.serpentRadius=0.01
                snake.go()


                /**field init*/
                this.mamesh.vertices.forEach(v=>{
                    this.vectorFieldScaled(0, v.position,this.positionings.getValue(v).frontDir)

                })
                let vertexVisu = new visu3d.VerticesViewer(this.mamesh, this.mathisFrame.scene,this.positionings)
                vertexVisu.meshModel = this.arrowModel
                vertexVisu.go()



                let curentTime=0

                let mainAction=new PeriodicAction(()=>{
                    curentTime+=this.deltaT
                    let point = new XYZ(0,0,0)
                    this.computeNewPathPoint(snake.getHeadPosition(), curentTime,point)

                    snake.elongateTo(point)

                    this.mamesh.vertices.forEach(v=> {
                        let pos = this.positionings.getValue(v)
                        this.vectorFieldScaled(curentTime, v.position, pos.frontDir)
                    })

                    if(this.scaleVectorsAccordingToTheirNorm) this.rescaleVectors(this.vectorReferencesize)

                    vertexVisu.updatePositionings()


                })

                mainAction.id="main action";
                mainAction.frameInterval=1

                this.mathisFrame.pushPeriodicAction(mainAction);


                /**onClick, we restart the snake*/
                (<any> this.planForClick).onClick=(dep:XYZ)=>{
                    let action=new PeriodicAction(()=>{
                        snake.contractInOnePoint(dep)
                    })
                    action.frameInterval=1
                    action.nbTimesThisActionMustBeFired=1
                    action.id="click action"
                    action.passageOrderIndex=2
                    this.mathisFrame.pushPeriodicAction(action)
                }
            }



            /**following fields only useful when we want to resize arrow according to the norm of vector field*/
            private verticeSorted:Vertex[]
            prepareRescaling(){
                this.verticeSorted=[]
                this.mamesh.vertices.forEach(v=>this.verticeSorted.push(v))

            }
            private functionToSortvertex=(v1:Vertex,v2:Vertex)=>v1.customerObject.squareLengthOfTangent-v2.customerObject.squareLengthOfTangent
            rescaleVectors(vertexRefSize){

                this.mamesh.vertices.forEach(v=> {
                    v.customerObject.squareLengthOfTangent = this.positionings.getValue(v).frontDir.lengthSquared()
                })
                this.verticeSorted.sort(this.functionToSortvertex)


                for (let i = 0; i < this.verticeSorted.length; i++) this.verticeSorted[i].customerObject.scaleFromOrder = (i / this.verticeSorted.length)

                this.mamesh.vertices.forEach(v=> {
                    let pos = this.positionings.getValue(v)
                    pos.scaling.x = 2 * vertexRefSize * (v.customerObject.scaleFromOrder + 1 / 4)
                    let epaisseur = vertexRefSize * Math.max(1, v.customerObject.scaleFromOrder + 1 / 2)
                    pos.scaling.y = epaisseur
                    pos.scaling.z = epaisseur
                })



            }




        }

        //
        //
        // function oneVectorField(width:number,height:number,origin:XYZ,vectorField:(t:number, p:XYZ,res:XYZ)=>void,departure:XYZ,mathisFrame:MathisFrame):void{
        //
        //
        //
        //    
        //
        //     }














        // let lineVisu=new visu3d.LinesVisuFastMaker(mamesh,scene)
        // lineVisu.goChanging()




    }





}