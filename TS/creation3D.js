/**
 * Created by vigon on 05/03/2016.
 */
var mathis;
(function (mathis) {
    var creation3D;
    (function (creation3D) {
        //
        //
        // export enum ArchimedeanSolidType{
        //
        //
        // }
        //
        //
        // //  TODO rajouter prisme et jonson   https://github.com/tessenate/polyhedra-viewer/tree/master/src/data/polyhedra
        // export enum PolyhedronType{
        //     /**platonic*/
        //     Tetrahedron, Cube, Octahedron,  Dodecahedron, Icosahedron,
        //         /**archimedien*/
        //     TruncatedTetrahedron, TruncatedCube, TruncatedOctahedron, TruncatedDodecahedron, TruncatedIcosahedron, Cuboctahedron, TruncatedCubocahedron, Rhombicubocahedron,
        //     SnubCuboctahedron, Icosidodecahedron, TruncatedIcosidodecahedron, Rhombicosidodecahedron, SnubIcosidodecahedron,
        //     /**autre*/
        //     Rhombicuboctahedron,  TriangulPrism, PentagonalPrism, HexagonalPrism,  SquarePyramid ,
        //     PentagonalPyramid ,  TriangularDipyramid ,  PentagonalDipyramid,  ElongatedSquareDipyramid,  ElongatedPentagonalDipyramid ,  ElongatedPentagonalCupola
        // }
        //
        // export class Polyhedron{
        //
        //
        //
        //     type:PolyhedronType
        //     makeLinks=true
        //     mamesh:Mamesh
        //
        //
        //
        //     constructor(type:PolyhedronType){
        //         this.mamesh=new Mamesh()
        //         this.type=type
        //     }
        //
        //     go():Mamesh {
        //
        //
        //
        //         let polyhedra:{vertex: number[][], face: number[][],notYetCentered?:boolean}[] = [];
        //
        //
        //         // polyhedra[PolyhedronType.Rhombicuboctahedron] = {
        //         //     vertex: [[0, 0, 1.070722], [0.7148135, 0, 0.7971752], [-0.104682, 0.7071068, 0.7971752], [-0.6841528, 0.2071068, 0.7971752], [-0.104682, -0.7071068, 0.7971752], [0.6101315, 0.7071068, 0.5236279], [1.04156, 0.2071068, 0.1367736], [0.6101315, -0.7071068, 0.5236279], [-0.3574067, 1, 0.1367736], [-0.7888348, -0.5, 0.5236279], [-0.9368776, 0.5, 0.1367736], [-0.3574067, -1, 0.1367736], [0.3574067, 1, -0.1367736], [0.9368776, -0.5, -0.1367736], [0.7888348, 0.5, -0.5236279], [0.3574067, -1, -0.1367736], [-0.6101315, 0.7071068, -0.5236279], [-1.04156, -0.2071068, -0.1367736], [-0.6101315, -0.7071068, -0.5236279], [0.104682, 0.7071068, -0.7971752], [0.6841528, -0.2071068, -0.7971752], [0.104682, -0.7071068, -0.7971752], [-0.7148135, 0, -0.7971752], [0, 0, -1.070722]],
        //         //     face: [[0, 2, 3], [1, 6, 5], [4, 9, 11], [7, 15, 13], [8, 16, 10], [12, 14, 19], [17, 22, 18], [20, 21, 23], [0, 1, 5, 2], [0, 3, 9, 4], [0, 4, 7, 1], [1, 7, 13, 6], [2, 5, 12, 8], [2, 8, 10, 3], [3, 10, 17, 9], [4, 11, 15, 7], [5, 6, 14, 12], [6, 13, 20, 14], [8, 12, 19, 16], [9, 17, 18, 11], [10, 16, 22, 17], [11, 18, 21, 15], [13, 15, 21, 20], [14, 20, 23, 19], [16, 19, 23, 22], [18, 22, 23, 21]]
        //         // };
        //         polyhedra[PolyhedronType.TriangulPrism] = {
        //             vertex: [[0, 0, 1.322876], [1.309307, 0, 0.1889822], [-0.9819805, 0.8660254, 0.1889822], [0.1636634, -1.299038, 0.1889822], [0.3273268, 0.8660254, -0.9449112], [-0.8183171, -0.4330127, -0.9449112]],
        //             face: [[0, 3, 1], [2, 4, 5], [0, 1, 4, 2], [0, 2, 5, 3], [1, 3, 5, 4]]
        //         };
        //         polyhedra[PolyhedronType.PentagonalPrism] = {
        //             vertex: [[0, 0, 1.159953], [1.013464, 0, 0.5642542], [-0.3501431, 0.9510565, 0.5642542], [-0.7715208, -0.6571639, 0.5642542], [0.6633206, 0.9510565, -0.03144481], [0.8682979, -0.6571639, -0.3996071], [-1.121664, 0.2938926, -0.03144481], [-0.2348831, -1.063314, -0.3996071], [0.5181548, 0.2938926, -0.9953061], [-0.5850262, -0.112257, -0.9953061]],
        //             face: [[0, 1, 4, 2], [0, 2, 6, 3], [1, 5, 8, 4], [3, 6, 9, 7], [5, 7, 9, 8], [0, 3, 7, 5, 1], [2, 4, 8, 9, 6]]
        //         };
        //         polyhedra[PolyhedronType.HexagonalPrism] = {
        //             vertex: [[0, 0, 1.118034], [0.8944272, 0, 0.6708204], [-0.2236068, 0.8660254, 0.6708204], [-0.7826238, -0.4330127, 0.6708204], [0.6708204, 0.8660254, 0.2236068], [1.006231, -0.4330127, -0.2236068], [-1.006231, 0.4330127, 0.2236068], [-0.6708204, -0.8660254, -0.2236068], [0.7826238, 0.4330127, -0.6708204], [0.2236068, -0.8660254, -0.6708204], [-0.8944272, 0, -0.6708204], [0, 0, -1.118034]],
        //             face: [[0, 1, 4, 2], [0, 2, 6, 3], [1, 5, 8, 4], [3, 6, 10, 7], [5, 9, 11, 8], [7, 10, 11, 9], [0, 3, 7, 9, 5, 1], [2, 4, 8, 11, 10, 6]]
        //         };
        //         polyhedra[PolyhedronType.SquarePyramid] = {
        //             vertex: [[-0.729665, 0.670121, 0.319155], [-0.655235, -0.29213, -0.754096], [-0.093922, -0.607123, 0.537818], [0.702196, 0.595691, 0.485187], [0.776626, -0.36656, -0.588064]],
        //             face: [[1, 4, 2], [0, 1, 2], [3, 0, 2], [4, 3, 2], [4, 1, 0, 3]]
        //         };
        //         polyhedra[PolyhedronType.PentagonalPyramid] = {
        //             vertex: [[-0.868849, -0.100041, 0.61257], [-0.329458, 0.976099, 0.28078], [-0.26629, -0.013796, -0.477654], [-0.13392, -1.034115, 0.229829], [0.738834, 0.707117, -0.307018], [0.859683, -0.535264, -0.338508]],
        //             face: [[3, 0, 2], [5, 3, 2], [4, 5, 2], [1, 4, 2], [0, 1, 2], [0, 3, 5, 4, 1]]
        //         };
        //         polyhedra[PolyhedronType.TriangularDipyramid] = {
        //             vertex: [[-0.610389, 0.243975, 0.531213], [-0.187812, -0.48795, -0.664016], [-0.187812, 0.9759, -0.664016], [0.187812, -0.9759, 0.664016], [0.798201, 0.243975, 0.132803]],
        //             face: [[1, 3, 0], [3, 4, 0], [3, 1, 4], [0, 2, 1], [0, 4, 2], [2, 4, 1]]
        //         };
        //         polyhedra[PolyhedronType.PentagonalDipyramid] = {
        //             vertex: [[-1.028778, 0.392027, -0.048786], [-0.640503, -0.646161, 0.621837], [-0.125162, -0.395663, -0.540059], [0.004683, 0.888447, -0.651988], [0.125161, 0.395663, 0.540059], [0.632925, -0.791376, 0.433102], [1.031672, 0.157063, -0.354165]],
        //             face: [[3, 2, 0], [2, 1, 0], [2, 5, 1], [0, 4, 3], [0, 1, 4], [4, 1, 5], [2, 3, 6], [3, 4, 6], [5, 2, 6], [4, 5, 6]]
        //         };
        //         polyhedra[PolyhedronType.ElongatedSquareDipyramid] = {
        //             vertex: [[-0.669867, 0.334933, -0.529576], [-0.669867, 0.334933, 0.529577], [-0.4043, 1.212901, 0], [-0.334933, -0.669867, -0.529576], [-0.334933, -0.669867, 0.529577], [0.334933, 0.669867, -0.529576], [0.334933, 0.669867, 0.529577], [0.4043, -1.212901, 0], [0.669867, -0.334933, -0.529576], [0.669867, -0.334933, 0.529577]],
        //             face: [[8, 9, 7], [6, 5, 2], [3, 8, 7], [5, 0, 2], [4, 3, 7], [0, 1, 2], [9, 4, 7], [1, 6, 2], [9, 8, 5, 6], [8, 3, 0, 5], [3, 4, 1, 0], [4, 9, 6, 1]]
        //         };
        //         polyhedra[PolyhedronType.ElongatedPentagonalDipyramid] = {
        //             vertex: [[-0.931836, 0.219976, -0.264632], [-0.636706, 0.318353, 0.692816], [-0.613483, -0.735083, -0.264632], [-0.326545, 0.979634, 0], [-0.318353, -0.636706, 0.692816], [-0.159176, 0.477529, -0.856368], [0.159176, -0.477529, -0.856368], [0.318353, 0.636706, 0.692816], [0.326545, -0.979634, 0], [0.613482, 0.735082, -0.264632], [0.636706, -0.318353, 0.692816], [0.931835, -0.219977, -0.264632]],
        //             face: [[11, 10, 8], [7, 9, 3], [6, 11, 8], [9, 5, 3], [2, 6, 8], [5, 0, 3], [4, 2, 8], [0, 1, 3], [10, 4, 8], [1, 7, 3], [10, 11, 9, 7], [11, 6, 5, 9], [6, 2, 0, 5], [2, 4, 1, 0], [4, 10, 7, 1]]
        //         };
        //         polyhedra[PolyhedronType.ElongatedPentagonalCupola] = {
        //             vertex: [[-0.93465, 0.300459, -0.271185], [-0.838689, -0.260219, -0.516017], [-0.711319, 0.717591, 0.128359], [-0.710334, -0.156922, 0.080946], [-0.599799, 0.556003, -0.725148], [-0.503838, -0.004675, -0.969981], [-0.487004, 0.26021, 0.48049], [-0.460089, -0.750282, -0.512622], [-0.376468, 0.973135, -0.325605], [-0.331735, -0.646985, 0.084342], [-0.254001, 0.831847, 0.530001], [-0.125239, -0.494738, -0.966586], [0.029622, 0.027949, 0.730817], [0.056536, -0.982543, -0.262295], [0.08085, 1.087391, 0.076037], [0.125583, -0.532729, 0.485984], [0.262625, 0.599586, 0.780328], [0.391387, -0.726999, -0.716259], [0.513854, -0.868287, 0.139347], [0.597475, 0.85513, 0.326364], [0.641224, 0.109523, 0.783723], [0.737185, -0.451155, 0.538891], [0.848705, -0.612742, -0.314616], [0.976075, 0.365067, 0.32976], [1.072036, -0.19561, 0.084927]],
        //             face: [[15, 18, 21], [12, 20, 16], [6, 10, 2], [3, 0, 1], [9, 7, 13], [2, 8, 4, 0], [0, 4, 5, 1], [1, 5, 11, 7], [7, 11, 17, 13], [13, 17, 22, 18], [18, 22, 24, 21], [21, 24, 23, 20], [20, 23, 19, 16], [16, 19, 14, 10], [10, 14, 8, 2], [15, 9, 13, 18], [12, 15, 21, 20], [6, 12, 16, 10], [3, 6, 2, 0], [9, 3, 1, 7], [9, 15, 12, 6, 3], [22, 17, 11, 5, 4, 8, 14, 19, 23, 24]]
        //         };
        //
        //
        //         let data= polyhedra[this.type];
        //
        //         /**transform data has XYZ*/
        //         for (let ve of data.vertex) this.mamesh.newVertex(new XYZ(ve[0],ve[1],ve[2]))
        //
        //
        //         /**centering data if necessary*/
        //         if (data.notYetCentered) {
        //             let bary=new XYZ(0,0,0)
        //             let vertex:Vertex=null
        //             for (vertex of this.mamesh.vertices) bary.add(vertex.position)
        //             bary.scale(1/this.mamesh.vertices.length)
        //             for (vertex of this.mamesh.vertices) vertex.position.substract(bary)
        //         }
        //
        //         /**scaling in oder that the max position norm is 1*/
        //         let maxNorm=Number.MIN_VALUE
        //         for (let vertex of this.mamesh.vertices) {
        //             let norm=vertex.position.length()
        //             if (norm>maxNorm) maxNorm=norm
        //         }
        //
        //         for (let vertex of this.mamesh.vertices) {
        //             vertex.position.scale(1/maxNorm)
        //         }
        //
        //
        //
        //         let oneOverFive=1/5
        //         for (let face of data.face){
        //
        //             if (face.length==3) this.mamesh.addATriangle(this.mamesh.vertices[face[0]],this.mamesh.vertices[face[1]],this.mamesh.vertices[face[2]])
        //             else if (face.length==4) this.mamesh.addASquare(this.mamesh.vertices[face[0]],this.mamesh.vertices[face[1]],this.mamesh.vertices[face[2]],this.mamesh.vertices[face[3]])
        //             else if (face.length==5){
        //                 let centerVertex=this.mamesh.newVertex(new XYZ(0,0,0))
        //                 centerVertex.markers.push(Vertex.Markers.pintagoneCenter)
        //                 let v=[this.mamesh.vertices[face[0]],this.mamesh.vertices[face[1]],this.mamesh.vertices[face[2]],this.mamesh.vertices[face[3]],this.mamesh.vertices[face[4]]]
        //
        //                 geo.baryCenter([v[0].position,v[1].position,v[2].position,v[3].position,v[4].position],
        //                     [oneOverFive,oneOverFive,oneOverFive,oneOverFive,oneOverFive],
        //                     centerVertex.position)
        //
        //                 for (let i=0;i<5;i++)this.mamesh.addATriangle(v[i],v[(i+1)%5],centerVertex)
        //
        //             }
        //             //TODO faces with more that 5 sides
        //         }
        //
        //         if (this.makeLinks){
        //             new linkModule.LinkCreaterSorterAndBorderDetecterByPolygons(this.mamesh).goChanging()
        //
        //         }
        //
        //         return this.mamesh
        //     }
        //
        //
        // }
        var Snake = (function () {
            function Snake(mathisFrame) {
                //headPosition=new XYZ(0,0,0)
                this.maxLength = 500;
                this.curentLength = 0;
                this.serpentRadius = 0.03;
                this.path = [];
                this.sliceInsteadOfElongateWhenMaxLengthIsReached = true;
                this.initialPosition = new mathis.XYZ(0, 0, 0);
                this.mathisFrame = mathisFrame;
            }
            Snake.prototype.go = function () {
                for (var i = 0; i < this.maxLength; i++)
                    this.path.push(this.initialPosition);
                this.serpentMesh = BABYLON.Mesh.CreateTube('', this.path, this.serpentRadius, 10, null, BABYLON.Mesh.CAP_ALL, this.mathisFrame.scene, true);
                var green = new BABYLON.StandardMaterial('', this.mathisFrame.scene);
                green.diffuseColor = mathis.myFavoriteColors.green;
                this.serpentMesh.material = green;
                this.headSerpent = BABYLON.Mesh.CreateSphere('', 10, this.serpentRadius * 2.5, this.mathisFrame.scene);
                var red = new BABYLON.StandardMaterial('', this.mathisFrame.scene);
                red.diffuseColor = new BABYLON.Color3(1, 0, 0);
                this.headSerpent.material = red;
                this.headSerpent.position.copyFrom(this.initialPosition);
            };
            Snake.prototype.contractInOnePoint = function (point) {
                for (var i = 0; i < this.maxLength; i++)
                    this.path[i] = point;
                this.curentLength = 0;
                this.updateMeshes();
            };
            Snake.prototype.elongateTo = function (point) {
                if (this.curentLength < this.maxLength) {
                    for (var i = this.curentLength; i < this.maxLength; i++)
                        this.path[i] = point;
                    this.curentLength++;
                    this.updateMeshes();
                }
                else if (this.sliceInsteadOfElongateWhenMaxLengthIsReached)
                    this.bobySliceTo(point);
                else
                    throw "snake reaches his maximal length";
            };
            Snake.prototype.bobySliceTo = function (point) {
                this.path.splice(0, 1);
                this.path.push(point);
                this.updateMeshes();
            };
            Snake.prototype.updateMeshes = function () {
                /** modification des positions du serpent */
                this.serpentMesh = BABYLON.Mesh.CreateTube('', this.path, this.serpentRadius, null, null, null, null, true, null, this.serpentMesh);
                this.headSerpent.position = this.getHeadPosition();
            };
            // snakeMoveTo(point:XYZ){
            //     this.curentLength++
            //
            //     if (this.curentLength<this.maxLength) {
            //         for (let i = this.curentLength; i < this.maxLength; i++) this.path[i] = point
            //     }
            //     else{
            //         this.path.splice(0,1)
            //         this.path.push(point)
            //     }
            //     /** modification des positions du serpent */
            //     this.serpentMesh = BABYLON.Mesh.CreateTube('', this.path, this.serpentRadius, null, null, null, null, true, null, this.serpentMesh)
            //     this.headSerpent.position=point
            //    
            // }
            Snake.prototype.getHeadPosition = function () {
                return this.path[this.path.length - 1];
            };
            return Snake;
        }());
        creation3D.Snake = Snake;
        var ArrowCreator = (function () {
            function ArrowCreator(scene) {
                /**as all model, length are 1, and then can be scale to e.g. maug when we use this model*/
                this.totalHeight = 1;
                this.bodyProp = 3 / 4;
                this.headProp = 1 / 4;
                this.bodyDiameterProp = 0.1;
                this.headDiameterProp = 0.2;
                this.headUp = true;
                this.arrowFootAtOrigin = true;
                this.quaternion = null;
                this.subdivision = 6;
                this.scene = scene;
            }
            ArrowCreator.prototype.go = function () {
                var bodyHeight = this.bodyProp * this.totalHeight;
                var headHeight = this.headProp * this.totalHeight;
                var body = BABYLON.Mesh.CreateCylinder('', bodyHeight, this.bodyDiameterProp * this.totalHeight, this.bodyDiameterProp * this.totalHeight, this.subdivision, null, this.scene);
                body.position = new mathis.XYZ(0, bodyHeight / 2, 0);
                var head = BABYLON.Mesh.CreateCylinder('', headHeight, 0, this.headDiameterProp * this.totalHeight, this.subdivision, null, this.scene);
                head.position = new mathis.XYZ(0, bodyHeight + headHeight / 2, 0);
                var arrow = BABYLON.Mesh.MergeMeshes([body, head]);
                /**we decay before rotating*/
                if (!this.arrowFootAtOrigin) {
                    arrow.position.addInPlace(new mathis.XYZ(0, -this.totalHeight / 2, 0));
                    arrow.bakeCurrentTransformIntoVertices();
                }
                var quat = new mathis.XYZW(0, 0, 0, 1);
                if (!this.headUp)
                    mathis.geo.axisAngleToQuaternion(new mathis.XYZ(1, 0, 0), Math.PI, quat);
                if (this.quaternion != null)
                    quat.multiply(this.quaternion);
                arrow.rotationQuaternion = quat;
                arrow.bakeCurrentTransformIntoVertices();
                if (this.color != null) {
                    var material = new BABYLON.StandardMaterial('', this.scene);
                    material.diffuseColor = this.color.toBABYLON_Color3();
                    arrow.material = material;
                }
                return arrow;
            };
            return ArrowCreator;
        }());
        creation3D.ArrowCreator = ArrowCreator;
        var TwoOrThreeAxisMerged = (function () {
            function TwoOrThreeAxisMerged(scene) {
                this.scene = scene;
                this.twoOrThreeAxis = new TwoOrTreeAxis(this.scene);
            }
            TwoOrThreeAxisMerged.prototype.go = function () {
                this.twoOrThreeAxis.addColor = false;
                var xyzAxis = this.twoOrThreeAxis.go();
                var three = BABYLON.Mesh.MergeMeshes(xyzAxis);
                var x_nbIndices = xyzAxis[0].getTotalIndices();
                var y_nbIndices = xyzAxis[1].getTotalIndices();
                var z_nbIndices = xyzAxis[2].getTotalIndices();
                var mat0 = new BABYLON.StandardMaterial('', this.scene);
                mat0.diffuseColor = new BABYLON.Color3(1, 0, 0);
                var mat1 = new BABYLON.StandardMaterial('', this.scene);
                mat1.diffuseColor = new BABYLON.Color3(0, 1, 0);
                var mat2 = new BABYLON.StandardMaterial('', this.scene);
                mat2.diffuseColor = new BABYLON.Color3(0, 0, 1);
                var nbVertices = three.getTotalVertices();
                three.subMeshes = [];
                three.subMeshes.push(new BABYLON.SubMesh(0, 0, nbVertices, 0, x_nbIndices, three));
                three.subMeshes.push(new BABYLON.SubMesh(1, 0, nbVertices, x_nbIndices, y_nbIndices, three));
                three.subMeshes.push(new BABYLON.SubMesh(2, 0, nbVertices, x_nbIndices + y_nbIndices, z_nbIndices, three));
                var multimat = new BABYLON.MultiMaterial("multi", this.scene);
                multimat.subMaterials.push(mat0);
                multimat.subMaterials.push(mat1);
                multimat.subMaterials.push(mat2);
                three.material = multimat;
                return three;
            };
            return TwoOrThreeAxisMerged;
        }());
        creation3D.TwoOrThreeAxisMerged = TwoOrThreeAxisMerged;
        var TwoOrTreeAxis = (function () {
            function TwoOrTreeAxis(scene) {
                this.isLeftHandSided = true;
                this.addColor = true;
                this.threeVersusTwoAxis = true;
                this.addLabelsXYZ = false;
                this.scene = scene;
                this.SUB_x_axisCreator = new ArrowCreator(this.scene);
                this.SUB_y_axisCreator = new ArrowCreator(this.scene);
                this.SUB_z_axisCreator = new ArrowCreator(this.scene);
            }
            TwoOrTreeAxis.prototype.go = function () {
                if (this.addColor) {
                    this.SUB_x_axisCreator.color = new mathis.Color(mathis.Color.names.red);
                    this.SUB_y_axisCreator.color = new mathis.Color(mathis.Color.names.green);
                    this.SUB_z_axisCreator.color = new mathis.Color(mathis.Color.names.blue);
                }
                var flags = [];
                if (this.addLabelsXYZ) {
                    var x_flagCreator = new creation3D.FlagWithText(this.scene);
                    x_flagCreator.text = "x";
                    var x_flag = x_flagCreator.go();
                    x_flag.position = new mathis.XYZ(1.1, 0, 0);
                    flags.push(x_flag);
                    var y_flagCreator = new creation3D.FlagWithText(this.scene);
                    y_flagCreator.text = "y";
                    var y_flag = y_flagCreator.go();
                    y_flag.position = new mathis.XYZ(0, 1.15, 0);
                    flags.push(y_flag);
                    var z_flagCreator = new creation3D.FlagWithText(this.scene);
                    z_flagCreator.text = "z";
                    var z_flag = z_flagCreator.go();
                    z_flag.position = new mathis.XYZ(0, 0.1, 1);
                    flags.push(z_flag);
                }
                var yMesh = this.SUB_y_axisCreator.go();
                yMesh.bakeCurrentTransformIntoVertices();
                var xMesh = this.SUB_x_axisCreator.go();
                mathis.geo.axisAngleToQuaternion(new mathis.XYZ(0, 0, 1), -Math.PI / 2, xMesh.rotationQuaternion);
                xMesh.bakeCurrentTransformIntoVertices();
                if (this.threeVersusTwoAxis) {
                    var zMesh = this.SUB_z_axisCreator.go();
                    var angle = (this.isLeftHandSided) ? Math.PI / 2 : -Math.PI / 2;
                    mathis.geo.axisAngleToQuaternion(new mathis.XYZ(1, 0, 0), angle, zMesh.rotationQuaternion);
                    zMesh.bakeCurrentTransformIntoVertices();
                    return [xMesh, yMesh, zMesh].concat(flags);
                }
                else
                    return [xMesh, yMesh].concat(flags);
            };
            return TwoOrTreeAxis;
        }());
        creation3D.TwoOrTreeAxis = TwoOrTreeAxis;
        var FlagWithText = (function () {
            function FlagWithText(scene) {
                this.text = "TOTO";
                this.font = "bold 140px verdana";
                this.color = "black";
                this.backgroundColor = "transparent";
                this.scene = scene;
            }
            FlagWithText.prototype.go = function () {
                var textPlaneTexture = new BABYLON.DynamicTexture("dynamic texture", 512, this.scene, true);
                textPlaneTexture.drawText(this.text, null, 300, this.font, this.color, this.backgroundColor);
                textPlaneTexture.hasAlpha = true;
                var textPlane = BABYLON.Mesh.CreatePlane("textPlane", 1, this.scene, false);
                //textPlane.billboardMode = BABYLON.AbstractMesh.BILLBOARDMODE_ALL;
                //textPlane.position = new BABYLON.Vector3(0, 2, 0);
                var material = new BABYLON.StandardMaterial("textPlane", this.scene);
                material.diffuseTexture = textPlaneTexture;
                material.specularColor = new BABYLON.Color3(0, 0, 0);
                material.emissiveColor = new BABYLON.Color3(1, 1, 1);
                material.backFaceCulling = false;
                textPlane.material = material;
                return textPlane;
            };
            return FlagWithText;
        }());
        creation3D.FlagWithText = FlagWithText;
    })(creation3D = mathis.creation3D || (mathis.creation3D = {}));
})(mathis || (mathis = {}));
