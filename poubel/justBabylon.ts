/**
 * Created by vigon on 15/03/2016.
 */



     module justBabylon{

        export function start() {

            function aScene (engine,canvas):BABYLON.Scene {

                var scene = new BABYLON.Scene(engine);

                 var camera = new BABYLON.ArcRotateCamera("Camera", 3 * Math.PI / 2, Math.PI / 8, 50, BABYLON.Vector3.Zero(), scene);

                scene.activeCamera=camera

                camera.attachControl(canvas, false);

                var light = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), scene);


                //Creation of a sphere
                //(name of the sphere, segments, diameter, scene)
                var sphere = BABYLON.Mesh.CreateSphere("sphere", 10.0, 10.0, scene);


                //let instance=sphere.createInstance('')

                //instance.position.x=3

                // Moving elements
                sphere.position = new BABYLON.Vector3(0, 0, 0); // Using a vector

                return scene;
            }


            function aScene2 (engine,canvas):BABYLON.Scene {

                var scene = new BABYLON.Scene(engine);

                var camera = new BABYLON.ArcRotateCamera("Camera", 3 * Math.PI / 2, Math.PI / 8, 50, BABYLON.Vector3.Zero(), scene);

                camera.attachControl(canvas, true);

                var light = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), scene);

                //Creation of a box
                //(name of the box, size, scene)
                var box = BABYLON.Mesh.CreateBox("box", 6.0, scene);


                // Moving elements
                box.position = new BABYLON.Vector3(-10, 0, 0);   // Using a vector

                return scene;
            }




            var canvas = document.getElementById("renderCanvas");

            let engine = new BABYLON.Engine(<HTMLCanvasElement> canvas, true);

            let scene = aScene(engine,canvas)

            var count = 0
            var meanFps = 0
            let infoBox = document.getElementById("info")

            cc('activeCameras',scene.activeCamera)

            engine.runRenderLoop(()=> {

                count++
                 scene.render()

                meanFps += engine.getFps()
                if (count % 100 == 0) {
                    if (infoBox != null) infoBox.textContent = (meanFps / 100).toFixed()
                    meanFps = 0
                }
            })
        }

    }
