module mathis {


    import Vector3=BABYLON.Vector3
    import VertexBuffer = BABYLON.VertexBuffer;
    import Mesh = BABYLON.Mesh;
    import Color3 = BABYLON.Color3;
    import GrabberCamera = mathis.macamera.GrabberCamera;

    export module testFront {

        import Multiply = mathis.periodicWorld.Multiply;
        import FreeCamera = BABYLON.FreeCamera;
        import InstancedMesh = BABYLON.InstancedMesh;
        import GrabberCamera = mathis.macamera.GrabberCamera;
        import Action = BABYLON.Action;
        import AbstractMesh = BABYLON.AbstractMesh;
        import StandardMaterial = BABYLON.StandardMaterial;


        // export function startSeveralFrame() {
        //
        //
        //     let mainDiv:HTMLElement = document.getElementById("mainDiv");
        //     let canvass = mathis.nCanvasInOneLine(2, mainDiv)
        //
        //     var secondFrame = new mathis.MathisFrame()
        //     secondFrame.canvas = canvass[0]
        //     secondFrame.goChanging()
        //     testOneGrabber(secondFrame, new BABYLON.Color3(1, 0, 0))
        //
        //
        //     var starter = new mathis.MathisFrame()
        //     starter.canvas = canvass[1]
        //     starter.goChanging()
        //     testOneGrabber(starter, new BABYLON.Color3(0, 0, 1))
        //
        //
        // }


        export function start() {
            //let mainDiv:HTMLElement = document.getElementById("mainDiv");
            
            //let canvass = mathis.nCanvasInOneLine(1, mainDiv)
            let mathisFrame = new MathisFrame(null,false)
            mathisFrame.resetScene()
            mathisFrame.addDefaultCamera()
            mathisFrame.addDefaultLight()

            let box=BABYLON.Mesh.CreateBox('',1,mathisFrame.scene)
            let mat=new BABYLON.StandardMaterial('',mathisFrame.scene)
            mat.diffuseColor=new BABYLON.Color3(1,0,0)
            box.material=mat






            //testCamera(mathisFrame)
            //testdiffSys(mathisFrame)
            //testIsing(mathisFrame)
            //testInfiniteWorld(mathisFrame)

        }

        function testCamera(mathisFrame){

            var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(-1, 1, -1), mathisFrame.scene);
            light0.diffuse = new BABYLON.Color3(1,1,1);
            light0.specular = new BABYLON.Color3(1,1,1);
            light0.groundColor = new BABYLON.Color3(0.5,0.5,0.5);

            let center=new XYZ(3,0,0)
            //BABYLON.Mesh.CreateSphere('',20,2,scene)

            let sphereRadius=2

            let grabber=new macamera.SphericalGrabber(mathisFrame.scene,new XYZ(sphereRadius,sphereRadius,sphereRadius),center)
            grabber.mesh.material.alpha=0.6
            grabber.showGrabberOnlyWhenGrabbing=false
            grabber.endOfZone1=0
            grabber.endOfZone2=0
            let macam = new macamera.GrabberCamera(mathisFrame,grabber)
            macam.useFreeModeWhenCursorOutOfGrabber=false


            macam.changePosition(new XYZ(-1,-1,-10),false)
            //macam.camera.viewport=new BABYLON.Viewport(index/nbCam,0,1/nbCam,1)

            macam.attachControl(mathisFrame.canvas)

            let box=BABYLON.Mesh.CreateBox('',1,mathisFrame.scene)
            let mat=new BABYLON.StandardMaterial('',mathisFrame.scene)
            mat.diffuseColor=new BABYLON.Color3(1,0,0)
            box.material=mat



        }



        function testdiffSys(mathisFrame:MathisFrame){

            /**param*/
            let width=5
            let height=2
            let origin=new XYZ(-width/2,-height/2,0)

            function to01(xyz:XYZ, res:XYZ):void {
                res.copyFrom(xyz)
                res.substract(origin)
                res.x /= width
                res.y /= height
            }

            function toWH(xyz:XYZ, res:XYZ):void {
                res.copyFrom(xyz)
                res.x *= width
                res.y *= height
                res.add(origin)
            }


            /**vecter field périodique*/
            let vectorField0:(t:number, p:XYZ, res:XYZ)=>void
            {
                let scaled = new XYZ(0, 0, 0)
                let A1 = t=>0.4 * Math.sin(0.5 * t)
                let A2 = t=>0.2 * Math.sin(0.5 * t)
                let a11 = t=>0
                let a12 = t=>0
                let a21 = t=>0
                let a22 = t=>0
                vectorField0 =  (t:number, p:XYZ, res:XYZ)=> {
                    to01(p, scaled)
                    /**potential part*/
                    let raX = (scaled.x - 0.5) * 2
                    let raY = (scaled.y - 0.5) * 4

                    res.x = -raX * raY * raY
                    res.y = -raX * raX * raY

                    /**excitation part*/
                    res.x += scaled.x * ( A1(t) + a11(t) * scaled.x + a12(t) * scaled.y)
                    res.y += scaled.y * ( A2(t) + a21(t) * scaled.x + a22(t) * scaled.y)

                }
            }


            let diffsyst=new differentialSystem.TwoDim(vectorField0,mathisFrame)
            //diffsyst.height=height
            //diffsyst.width=width
            diffsyst.go()


        }


        function testIsing(mathisFrame:MathisFrame){
            let ising=new mecaStat.IsingOnMesh(mathisFrame)
            ising.go()
        }


        function testInfiniteWorld(mathisFrame:MathisFrame){

            let infi = new infiniteWorlds.InfiniteCartesian(mathisFrame)

            infi.nbRepetition = 8
            infi.nbSubdivision = 3
            infi.fondamentalDomainSize = 6
            infi.nbHorizontalDecays = 1
            infi.nbVerticalDecays = 1

            infi.nameOfResau3d=infiniteWorlds.NameOfReseau3D.cube

            infi.collisionForCamera=true
            infi.collisionOnLinks=true
            infi.collisionOnVertices=true


            let mesh = BABYLON.Mesh.CreateSphere('', 5, 10, mathisFrame.scene)
            //let mesh=BABYLON.Mesh.CreateBox('',1,mathisFrame.scene)
            mesh.position = new XYZ(1, 1, 1)


            //infi.population.push(mesh)

            infi.go()

            //infi.seeWorldFromOutside()
            infi.seeWorldFromInside()
            //
            //setTimeout(()=>{infi.seeWorldFromInside()},5000)

           }





    }

}