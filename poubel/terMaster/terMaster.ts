
module mathis {


    export module terMaster {

        export function start() {
            let mainDiv:HTMLElement = document.getElementById("mainLeftCol");

            let canvass = mathis.nCanvasInOneLine(1, mainDiv)

            let mathisFrame = new MathisFrame(canvass[0],false)
            
            
            drawEllipsoide(mathisFrame)
            
        }
        
        
        
        function drawEllipsoide(mathisFrame:MathisFrame){

            let grabber0 = new macamera.SphericalGrabber(mathisFrame.scene)
            let macam = new macamera.GrabberCamera(mathisFrame, grabber0)

            var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(-1, 1, -1), mathisFrame.scene);
            light0.diffuse = new BABYLON.Color3(1, 1, 1);
            light0.specular = new BABYLON.Color3(1, 1, 1);
            light0.groundColor = new BABYLON.Color3(0, 0, 0);


            // {
            //     let crea = new creation2D.Concentric(9,13)
            //     crea.nbPatches=1
            //     crea.shapes=[creation2D.PartShape.triangulatedRect]
            //     crea.percolationProba=[0.5]
            //
            //
            //     let mamesh=crea.goChanging()
            //
            //     mamesh.fillLineCatalogue()
            //
            //     new lineModule.CreateAColorIndexRespectingBifurcationsAndSymmetries(mamesh).goChanging()
            //
            //
            //     mamesh.fillLineCatalogue()
            //
            //     let liner=new visu3d.LinesViewer(mamesh,mathisFrame.scene)
            //     liner.interpolationOption=new geometry.InterpolationOption()
            //     liner.interpolationOption.interpolationStyle=geometry.InterpolationStyle.octavioStyle
            //     liner.goChanging()
            //
            //
            //
            // }

            {



                function createMamesh(origin:XYZ,end:XYZ,permute=false):Mamesh{

                    let gene = new reseau.BasisForRegularReseau()
                    gene.origin = origin
                    gene.end = end
                    gene.nbI = 32 + 1
                    gene.nbJ = 32 + 1


                    let mamesh =new reseau.Regular( gene).go()

                    let a=1
                    let b=0.75
                    let c=0.5

                    let map :(u,v)=>XYZ
                    if(!permute) {
                        map = (u, v)=>new XYZ(a*Math.cos(u)*Math.cos(v),b*Math.cos(u)*Math.sin(v),c*Math.sin(u))
                    }
                    else {
                        map = (u, v)=>new XYZ(a*Math.sin(u),b*Math.cos(u)*Math.cos(v),c*Math.cos(u)*Math.sin(v))
                    }

                    mamesh.vertices.forEach(vert=>{
                        let u=vert.position.x
                        let v=vert.position.y
                        vert.position=map(u,v)
                    })

                    return mamesh
                }


                let delta=0.8

                let ma1=createMamesh(new XYZ(-Math.PI/2+delta,-Math.PI+delta, 0),new XYZ(Math.PI/2-delta , Math.PI-delta , 0))
                let ma2=createMamesh(new XYZ(-Math.PI/2+delta,-Math.PI+delta, 0),new XYZ(Math.PI/2-delta , Math.PI-delta , 0),true)

                let concurenter=new grateAndGlue.ConcurrentMameshesGraterAndSticker()
                concurenter.IN_mameshes=[ma1,ma2]
                concurenter.justGrateDoNotStick=false
                let mamesh=concurenter.goChanging()//oneCarte(new XYZ(-Math.PI/2,-Math.PI, 0),new XYZ(Math.PI/2 , Math.PI , 0)).arrivalOpenMesh

                
                let liner=new visu3d.LinksViewer(mamesh,mathisFrame.scene)
                liner.lateralScalingConstant=0.01
                liner.go()


                let surfacer=new visu3d.SurfaceViewer(mamesh,mathisFrame.scene)
                surfacer.go()

            }
            
            
            
            
            
            
            
        }
        

    }
}