var mathis;
(function (mathis) {
    var testFront;
    (function (testFront) {
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
        function start() {
            //let mainDiv:HTMLElement = document.getElementById("mainDiv");
            //let canvass = mathis.nCanvasInOneLine(1, mainDiv)
            var mathisFrame = new mathis.MathisFrame(null, false);
            mathisFrame.resetScene();
            mathisFrame.addDefaultCamera();
            mathisFrame.addDefaultLight();
            var box = BABYLON.Mesh.CreateBox('', 1, mathisFrame.scene);
            var mat = new BABYLON.StandardMaterial('', mathisFrame.scene);
            mat.diffuseColor = new BABYLON.Color3(1, 0, 0);
            box.material = mat;
            //testCamera(mathisFrame)
            //testdiffSys(mathisFrame)
            //testIsing(mathisFrame)
            //testInfiniteWorld(mathisFrame)
        }
        testFront.start = start;
        function testCamera(mathisFrame) {
            var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(-1, 1, -1), mathisFrame.scene);
            light0.diffuse = new BABYLON.Color3(1, 1, 1);
            light0.specular = new BABYLON.Color3(1, 1, 1);
            light0.groundColor = new BABYLON.Color3(0.5, 0.5, 0.5);
            var center = new mathis.XYZ(3, 0, 0);
            //BABYLON.Mesh.CreateSphere('',20,2,scene)
            var sphereRadius = 2;
            var grabber = new mathis.macamera.SphericalGrabber(mathisFrame.scene, new mathis.XYZ(sphereRadius, sphereRadius, sphereRadius), center);
            grabber.mesh.material.alpha = 0.6;
            grabber.showGrabberOnlyWhenGrabbing = false;
            grabber.endOfZone1 = 0;
            grabber.endOfZone2 = 0;
            var macam = new mathis.macamera.GrabberCamera(mathisFrame, grabber);
            macam.useFreeModeWhenCursorOutOfGrabber = false;
            macam.changePosition(new mathis.XYZ(-1, -1, -10), false);
            //macam.camera.viewport=new BABYLON.Viewport(index/nbCam,0,1/nbCam,1)
            macam.attachControl(mathisFrame.canvas);
            var box = BABYLON.Mesh.CreateBox('', 1, mathisFrame.scene);
            var mat = new BABYLON.StandardMaterial('', mathisFrame.scene);
            mat.diffuseColor = new BABYLON.Color3(1, 0, 0);
            box.material = mat;
        }
        function testdiffSys(mathisFrame) {
            /**param*/
            var width = 5;
            var height = 2;
            var origin = new mathis.XYZ(-width / 2, -height / 2, 0);
            function to01(xyz, res) {
                res.copyFrom(xyz);
                res.substract(origin);
                res.x /= width;
                res.y /= height;
            }
            function toWH(xyz, res) {
                res.copyFrom(xyz);
                res.x *= width;
                res.y *= height;
                res.add(origin);
            }
            /**vecter field périodique*/
            var vectorField0;
            {
                var scaled_1 = new mathis.XYZ(0, 0, 0);
                var A1_1 = function (t) { return 0.4 * Math.sin(0.5 * t); };
                var A2_1 = function (t) { return 0.2 * Math.sin(0.5 * t); };
                var a11_1 = function (t) { return 0; };
                var a12_1 = function (t) { return 0; };
                var a21_1 = function (t) { return 0; };
                var a22_1 = function (t) { return 0; };
                vectorField0 = function (t, p, res) {
                    to01(p, scaled_1);
                    /**potential part*/
                    var raX = (scaled_1.x - 0.5) * 2;
                    var raY = (scaled_1.y - 0.5) * 4;
                    res.x = -raX * raY * raY;
                    res.y = -raX * raX * raY;
                    /**excitation part*/
                    res.x += scaled_1.x * (A1_1(t) + a11_1(t) * scaled_1.x + a12_1(t) * scaled_1.y);
                    res.y += scaled_1.y * (A2_1(t) + a21_1(t) * scaled_1.x + a22_1(t) * scaled_1.y);
                };
            }
            var diffsyst = new mathis.differentialSystem.TwoDim(vectorField0, mathisFrame);
            //diffsyst.height=height
            //diffsyst.width=width
            diffsyst.go();
        }
        function testIsing(mathisFrame) {
            var ising = new mathis.mecaStat.IsingOnMesh(mathisFrame);
            ising.go();
        }
        function testInfiniteWorld(mathisFrame) {
            var infi = new mathis.infiniteWorlds.InfiniteCartesian(mathisFrame);
            infi.nbRepetition = 8;
            infi.nbSubdivision = 3;
            infi.fondamentalDomainSize = 6;
            infi.nbHorizontalDecays = 1;
            infi.nbVerticalDecays = 1;
            infi.nameOfResau3d = mathis.infiniteWorlds.NameOfReseau3D.cube;
            infi.collisionForCamera = true;
            infi.collisionOnLinks = true;
            infi.collisionOnVertices = true;
            var mesh = BABYLON.Mesh.CreateSphere('', 5, 10, mathisFrame.scene);
            //let mesh=BABYLON.Mesh.CreateBox('',1,mathisFrame.scene)
            mesh.position = new mathis.XYZ(1, 1, 1);
            //infi.population.push(mesh)
            infi.go();
            //infi.seeWorldFromOutside()
            infi.seeWorldFromInside();
            //
            //setTimeout(()=>{infi.seeWorldFromInside()},5000)
        }
    })(testFront = mathis.testFront || (mathis.testFront = {}));
})(mathis || (mathis = {}));
