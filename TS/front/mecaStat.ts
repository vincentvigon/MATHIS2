/**
 * Created by vigon on 08/11/2016.
 */

module mathis {

    export module mecaStat {
        
        export class IsingOnMesh{
            
            q=1.1
            beta=0.5
            sphereRadius=1
            frameInterval=5
            nbActionsPerIteration=100
            
            defineLightAndCamera=true
            
            nbDicho=4

            private mathisFrame:MathisFrame
            constructor(mathisFrame:MathisFrame){
                this.mathisFrame=mathisFrame
            }
            
            
            go():void{
                if (this.defineLightAndCamera) this.lightAndCam()
                this.meshAndIsing()
                
            }
            

            private lightAndCam(){
                var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(-1, 1, -1), this.mathisFrame.scene);
                light0.diffuse = new BABYLON.Color3(1,1,1);
                light0.specular = new BABYLON.Color3(1,1,1);
                light0.groundColor = new BABYLON.Color3(0.5,0.5,0.5);

                let center=new XYZ(0,0,0)
                //BABYLON.Mesh.CreateSphere('',20,2,scene)

                let grabber=new macamera.SphericalGrabber(this.mathisFrame.scene,new XYZ(this.sphereRadius,this.sphereRadius,this.sphereRadius),center)
                grabber.mesh.material.alpha=0.6
                grabber.showGrabberOnlyWhenGrabbing=false
                grabber.endOfZone1=0
                grabber.endOfZone2=0

                let macam = new macamera.GrabberCamera(this.mathisFrame,grabber)
                macam.useFreeModeWhenCursorOutOfGrabber=false

                macam.changePosition(new XYZ(0,0,-4*this.sphereRadius),false)
                //macam.camera.viewport=new BABYLON.Viewport(index/nbCam,0,1/nbCam,1)

                macam.attachControl(this.mathisFrame.canvas)
                //mathisFrame.scene.activeCameras.push(macam.camera)
            }


            meshAndIsing(){



                let sphereMaker=new creation3D.Polyhedron(creation3D.PolyhedronType.Dodecahedron)
                let mamesh=sphereMaker.go()

                for (let i =0;i<this.nbDicho;i++){
                    let dicho=new mameshModification.TriangleDichotomer(mamesh)
                    dicho.makeLinks=true
                    dicho.go()
                }
                



                mamesh.vertices.forEach(v=>{
                    v.position.normalize().scale(this.sphereRadius)
                })


                let ising=new metropolis.IsingModel(mamesh.vertices)
                ising.beta=this.beta
                ising.q=this.q
                ising.nbActionsPerIteration=this.nbActionsPerIteration
                ising.go()



                let model1=this.sphereModel(new BABYLON.Color3(1,0,0))
                let model2=this.sphereModel(new BABYLON.Color3(0,0,1))


                let positionner=new mameshAroundComputations.PositioningComputerForMameshVertices(mamesh)
                positionner.sizesProp=new XYZ(1,1,1)
                let positioning=positionner.go()


                let positioning1=new HashMap<Vertex,Positioning>()
                mamesh.vertices.forEach(v=>{
                    let po=new Positioning()
                    po.copyFrom(positioning.getValue(v))
                    po.scaling.copyFromFloats(0,0,0)
                    positioning1.putValue(v,po)
                })

                let positioning2=new HashMap<Vertex,Positioning>()
                mamesh.vertices.forEach(v=>{
                    let po=new Positioning()
                    po.copyFrom(positioning.getValue(v))
                    po.scaling.copyFromFloats(0,0,0)
                    positioning2.putValue(v,po)
                })


                let vertVisu1=new visu3d.VerticesViewer(mamesh,this.mathisFrame.scene)
                vertVisu1.positionings=positioning1
                vertVisu1.meshModel=model1
                vertVisu1.go()


                let vertVisu2=new visu3d.VerticesViewer(mamesh,this.mathisFrame.scene)
                vertVisu2.positionings=positioning2
                vertVisu2.meshModel=model2
                vertVisu2.go()


                let commonSizes=positioning.getValue(mamesh.vertices[0]).scaling
                let action=new PeriodicActionBeforeRender(()=>{
                    let changed=ising.iterateAndGetChangedVertices()
                    changed.allKeys().forEach((v:Vertex)=>{
                        if (v.customerObject.value==0) {
                            positioning1.getValue(v).scaling.copyFromFloats(0,0,0)//.getValue(v).scaling.copyFrom(0,0,0)
                            positioning2.getValue(v).scaling.copyFromFloats(0,0,0)
                        }
                        else if (v.customerObject.value==1) {
                            positioning1.getValue(v).scaling.copyFrom(commonSizes)
                            positioning2.getValue(v).scaling.copyFromFloats(0,0,0)
                        }
                        else if (v.customerObject.value==-1) {
                            positioning2.getValue(v).scaling.copyFrom(commonSizes)
                            positioning1.getValue(v).scaling.copyFromFloats(0,0,0)
                        }
                    })

                    vertVisu1.updatePositionings()
                    vertVisu2.updatePositionings()


                })
                action.frameInterval=this.frameInterval
                this.mathisFrame.pushPeriodicAction(action)

                
            }



            sphereModel(color):BABYLON.Mesh{
                let model=BABYLON.Mesh.CreateSphere('',6,1,this.mathisFrame.scene)
                let mat1=new BABYLON.StandardMaterial('',this.mathisFrame.scene)
                mat1.diffuseColor=color
                model.material=mat1
                let qua=new XYZW(0,0,0,0)
                geo.axisAngleToQuaternion(new XYZ(1,0,0),Math.PI/2,qua)
                model.rotationQuaternion=qua
                return model
            }









        }







        //
        // function severalIsings(mainDiv:HTMLElement){
        //
        //     upLegend("<span>plus beta est grand, et plus les particules de même couleur s'attirent </span>","public2009-A3.pdf",mainDiv)
        //
        //     let divAndCanvass=nDivContainningCanvasInOneLine(3,mainDiv,"1px solid")
        //
        //
        //     //let canvass=mathis.nCanvasInOneLine(4,mainDiv)
        //     let frameInterval=5
        //
        //     let q=1.1
        //     let qs=[q,q,q]
        //     let betas=[0,0.5,1]
        //
        //     for (let i=0;i<3;i++){
        //         let frame=new mathis.MathisFrame()
        //         frame.canvas=divAndCanvass.canvass[i]
        //         frame.canvasContainer=divAndCanvass.divs[i]
        //         frame.goChanging()
        //         oneIsingSphere(frame,qs[i],betas[i],=1)
        //
        //         let $legend=legend("30px",frame.canvasContainer)
        //
        //         $legend.innerHTML="<p style='text-align: center'>&beta;="+betas[i]+"</p>"//"&beta="+betas[i]
        //
        //     }
        //
        //
        //
        //
        //
        //     function oneIsingSphere(mathisFrame:MathisFrame,q:number,beta:number,sphereRadius:number){
        //
        //         var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(-1, 1, -1), mathisFrame.scene);
        //         light0.diffuse = new BABYLON.Color3(1,1,1);
        //         light0.specular = new BABYLON.Color3(1,1,1);
        //         light0.groundColor = new BABYLON.Color3(0,1,0);
        //
        //         let center=new XYZ(0,0,0)
        //         //BABYLON.Mesh.CreateSphere('',20,2,scene)
        //
        //         let grabber=new macamera.SphericalGrabber(mathisFrame.scene,new XYZ(sphereRadius,sphereRadius,sphereRadius),center)
        //         grabber.mesh.material.alpha=1
        //         grabber.endOfZone1=0
        //         grabber.endOfZone2=0
        //
        //         let macam = new macamera.GrabberCamera(mathisFrame,grabber)
        //         macam.useFreeModeWhenCursorOutOfGrabber=false
        //
        //         macam.changePosition(new XYZ(0,0,-4),false)
        //         //macam.camera.viewport=new BABYLON.Viewport(index/nbCam,0,1/nbCam,1)
        //
        //         macam.attachControl(mathisFrame.canvas)
        //         //mathisFrame.scene.activeCameras.push(macam.camera)
        //
        //         let mamesh=new Mamesh()
        //
        //         let sphereMaker=new creation3D.Polyhedron(mamesh,creation3D.PolyhedronStatic.Type.Dodecahedron)
        //         sphereMaker.goChanging()
        //
        //         new mameshModification.TriangleDichotomer(mamesh).goChanging()
        //         new mameshModification.TriangleDichotomer(mamesh).goChanging()
        //         new mameshModification.TriangleDichotomer(mamesh).goChanging()
        //
        //
        //
        //         mamesh.vertices.forEach(v=>{
        //             v.position.normalize().scale(sphereRadius).add(center)
        //         })
        //
        //
        //
        //         //new visu3d.VerticesViewer(mamesh,scene).goChanging()
        //
        //
        //
        //
        //         let ising=new metropolis.IsingModel(mamesh.vertices)
        //         ising.beta=beta
        //         ising.q=q
        //         ising.nbActionsPerIteration=100
        //         ising.goChanging()
        //
        //
        //
        //         function sphereModel(color):BABYLON.Mesh{
        //             let model=BABYLON.Mesh.CreateSphere('',6,1,mathisFrame.scene)
        //             let mat1=new BABYLON.StandardMaterial('',mathisFrame.scene)
        //             mat1.diffuseColor=color
        //             model.material=mat1
        //             let qua=new XYZW(0,0,0,0)
        //             geo.axisAngleToQuaternion(new XYZ(1,0,0),Math.PI/2,qua)
        //             model.rotationQuaternion=qua
        //             return model
        //         }
        //
        //
        //         function modeleDisk(color):BABYLON.Mesh{
        //             let model=BABYLON.Mesh.CreateDisc('',0.5,6,mathisFrame.scene,false,BABYLON.Mesh.BACKSIDE)//BABYLON.Mesh.CreateSphere('',10,1,scene)
        //             let mat1=new BABYLON.StandardMaterial('',mathisFrame.scene)
        //             mat1.diffuseColor=color
        //             model.material=mat1
        //             let qua=new XYZW(0,0,0,0)
        //             geo.axisAngleToQuaternion(new XYZ(1,0,0),Math.PI/2,qua)
        //             model.rotationQuaternion=qua
        //             return model
        //         }
        //
        //         function modeleCylinder(color):BABYLON.Mesh{
        //             let model=BABYLON.Mesh.CreateCylinder('',0.1,1,1,6,null,mathisFrame.scene)//BABYLON.Mesh.CreateSphere('',10,1,scene)
        //             let mat1=new BABYLON.StandardMaterial('',mathisFrame.scene)
        //             mat1.diffuseColor=color
        //             model.material=mat1
        //             //let qua=new XYZW(0,0,0,0)
        //             // geo.axisAngleToQuaternion(new XYZ(1,0,0),Math.PI/2,qua)
        //             // model.rotationQuaternion=qua
        //             return model
        //         }
        //
        //
        //         let model1=sphereModel(new BABYLON.Color3(1,0,0))
        //         let model2=sphereModel(new BABYLON.Color3(0,0,1))
        //
        //
        //         let positionneur=new mameshAroundComputations.PositioningComputerForMameshVertices(mamesh)
        //         positionneur.sizesProp=new XYZ(1,1,1)
        //         let positionning=positionneur.goChanging()
        //
        //        
        //         let positionning1=new HashMap<Vertex,Positioning>()
        //         mamesh.vertices.forEach(v=>{
        //             let po=new Positioning()
        //             po.copyFrom(positionning.getValue(v))
        //             po.scaling.copyFromFloats(0,0,0)
        //             positionning1.putValue(v,po)
        //         })
        //
        //         let positionning2=new HashMap<Vertex,Positioning>()
        //         mamesh.vertices.forEach(v=>{
        //             let po=new Positioning()
        //             po.copyFrom(positionning.getValue(v))
        //             po.scaling.copyFromFloats(0,0,0)
        //             positionning2.putValue(v,po)
        //         })
        //
        //
        //         let vertVisu1=new visu3d.VerticesViewer(mamesh,mathisFrame.scene)
        //         vertVisu1.vertexToPositioning=positionning1
        //         vertVisu1.meshModel=model1
        //         vertVisu1.goChanging()
        //
        //        
        //         let vertVisu2=new visu3d.VerticesViewer(mamesh,mathisFrame.scene)
        //         vertVisu2.vertexToPositioning=positionning2
        //         vertVisu2.meshModel=model2
        //         vertVisu2.goChanging()
        //
        //
        //         let commonSizes=positionning.getValue(mamesh.vertices[0]).scaling
        //         let cumul=0
        //         let action=new PeriodicActionBeforeRender(()=>{
        //             let changed=ising.iterateAndGetChangedVertices()
        //
        //             changed.allKeys().forEach((v:Vertex)=>{
        //                 if (v.customerObject.value==0) {
        //                     positionning1.getValue(v).scaling.copyFromFloats(0,0,0)//.getValue(v).scaling.copyFrom(0,0,0)
        //                     positionning2.getValue(v).scaling.copyFromFloats(0,0,0)
        //                 }
        //                 else if (v.customerObject.value==1) {
        //                     positionning1.getValue(v).scaling.copyFrom(commonSizes)
        //                     positionning2.getValue(v).scaling.copyFromFloats(0,0,0)
        //                 }
        //                 else if (v.customerObject.value==-1) {
        //                     positionning2.getValue(v).scaling.copyFrom(commonSizes)
        //                     positionning1.getValue(v).scaling.copyFromFloats(0,0,0)
        //                 }
        //             })
        //
        //             vertVisu1.updatePositionings()
        //             vertVisu2.updatePositionings()
        //
        //
        //             //vertVisu1.buildVertexVisu(changed1,changed0)
        //             //vertVisu2.buildVertexVisu(changed_1,changed0)
        //
        //
        //             //vertVisu2.buildVertexVisu(changed)
        //         })
        //         action.frameInterval=frameInterval
        //         mathisFrame.pushPeriodicAction(action)
        //
        //
        //
        //
        //     }
        //
        //
        //
        //
        //
        //
        //
        //
        // }
        //




    }

}

