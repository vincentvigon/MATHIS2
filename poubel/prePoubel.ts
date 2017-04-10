// /**
//  * Created by vigon on 06/04/2016.
//  */
//
//
//
//
//
//
//
// /**these last methods are not use finaly*/
//
// export class TubeVertexData{
//
//     path: XYZ[]
//     constantRadius: number=1
//     tessellation: number=64
//     radiusFunction: { (i: number, distance: number): number; }
//     cap: number=Mesh.NO_CAP
//     arc: number=1
//     updatable: boolean
//     sideOrientation: number =Mesh.FRONTSIDE
//
//
//
//
//     private _rotationMatrix=new MM()
//
//     constructor(path:XYZ[]){
//         this.path=path
//     }
//
//     goChanging():VertexData{
//         // tube geometry
//         var tubePathArray = (path, path3D, circlePaths, constantRadius, tessellation, radiusFunction, cap, arc) => {
//             var tangents = path3D.getTangents();
//             var normals = path3D.getNormals();
//             var distances = path3D.getDistances();
//             var pi2 = Math.PI * 2;
//             var step = pi2 / tessellation * arc;
//             var returnRadius: { (i: number, distance: number): number; } = () => constantRadius;
//             var radiusFunctionFinal: { (i: number, distance: number): number; } = radiusFunction || returnRadius;
//
//             var circlePath: XYZ[];
//             var rad: number;
//             var normal: XYZ;
//             var rotated: XYZ;
//             var rotationMatrix=this._rotationMatrix
//             var index = (cap === Mesh._NO_CAP || cap === Mesh.CAP_END) ? 0 : 2;
//             for (var i = 0; i < path.length; i++) {
//                 rad = radiusFunctionFinal(i, distances[i]); // current constantRadius
//                 circlePath = Array<XYZ>();              // current circle array
//                 normal = normals[i];                        // current normal
//                 for (var t = 0; t < tessellation; t++) {
//                     geo.axisAngleToMatrix(tangents[i], step * t, rotationMatrix)
//                     //Matrix.RotationAxisToRef();
//                     rotated = circlePath[t] ? circlePath[t] : new XYZ(0,0,0)
//                     XYZ.TransformCoordinatesToRef(normal, rotationMatrix, rotated);
//                     rotated.scaleInPlace(rad).addInPlace(path[i]);
//                     circlePath[t] = rotated;
//                 }
//                 circlePaths[index] = circlePath;
//                 index++;
//             }
//             // cap
//             var capPath = (nbPoints, pathIndex) => {
//                 var pointCap = Array<XYZ>();
//                 for (var i = 0; i < nbPoints; i++) {
//                     pointCap.push(path[pathIndex]);
//                 }
//                 return pointCap;
//             };
//             switch (cap) {
//                 case Mesh.NO_CAP:
//                     break;
//                 case Mesh.CAP_START:
//                     circlePaths[0] = capPath(tessellation, 0);
//                     circlePaths[1] = circlePaths[2].slice(0);
//                     break;
//                 case Mesh.CAP_END:
//                     circlePaths[index] = circlePaths[index - 1].slice(0);
//                     circlePaths[index + 1] = capPath(tessellation, path.length - 1);
//                     break;
//                 case Mesh.CAP_ALL:
//                     circlePaths[0] = capPath(tessellation, 0);
//                     circlePaths[1] = circlePaths[2].slice(0);
//                     circlePaths[index] = circlePaths[index - 1].slice(0);
//                     circlePaths[index + 1] = capPath(tessellation, path.length - 1);
//                     break;
//                 default:
//                     break;
//             }
//             return circlePaths;
//         };
//         var path3D;
//         var pathArray;
//
//         path3D = <any>new Path3D(this.path);
//         var newPathArray = new Array<Array<XYZ>>();
//         pathArray = tubePathArray(this.path, path3D, newPathArray, this.constantRadius, this.tessellation, this.radiusFunction, this.cap, this.arc);
//
//         let ribbonVertexData=new RibbonVertexData(pathArray)
//         ribbonVertexData.closePath=true
//         return ribbonVertexData.goChanging()
//
//     }
// }
//
// //
// //function CreateTube(name: string, options: { path: Vector3[], constantRadius?: number, tessellation?: number, radiusFunction?: { (i: number, distance: number): number; }, cap?: number, arc?: number, updatable?: boolean, sideOrientation?: number, instance?: Mesh }, scene: Scene): Mesh {
// //    var path = options.path;
// //    var constantRadius = options.constantRadius || 1;
// //    var tessellation = options.tessellation || 64;
// //    var radiusFunction = options.radiusFunction;
// //    var cap = options.cap || Mesh.NO_CAP;
// //    var updatable = options.updatable;
// //    var sideOrientation = options.sideOrientation || Mesh.DEFAULTSIDE;
// //    var instance = options.instance;
// //    options.arc = (options.arc <= 0 || options.arc > 1) ? 1 : options.arc || 1;
// //
// //    // tube geometry
// //    var tubePathArray = (path, path3D, circlePaths, constantRadius, tessellation, radiusFunction, cap, arc) => {
// //        var tangents = path3D.getTangents();
// //        var normals = path3D.getNormals();
// //        var distances = path3D.getDistances();
// //        var pi2 = Math.PI * 2;
// //        var step = pi2 / tessellation * arc;
// //        var returnRadius: { (i: number, distance: number): number; } = () => constantRadius;
// //        var radiusFunctionFinal: { (i: number, distance: number): number; } = radiusFunction || returnRadius;
// //
// //        var circlePath: Vector3[];
// //        var rad: number;
// //        var normal: Vector3;
// //        var rotated: Vector3;
// //        var rotationMatrix: Matrix = Tmp.Matrix[0];
// //        var index = (cap === Mesh._NO_CAP || cap === Mesh.CAP_END) ? 0 : 2;
// //        for (var i = 0; i < path.length; i++) {
// //            rad = radiusFunctionFinal(i, distances[i]); // current constantRadius
// //            circlePath = Array<Vector3>();              // current circle array
// //            normal = normals[i];                        // current normal
// //            for (var t = 0; t < tessellation; t++) {
// //                Matrix.RotationAxisToRef(tangents[i], step * t, rotationMatrix);
// //                rotated = circlePath[t] ? circlePath[t] : Vector3.Zero();
// //                Vector3.TransformCoordinatesToRef(normal, rotationMatrix, rotated);
// //                rotated.scaleInPlace(rad).addInPlace(path[i]);
// //                circlePath[t] = rotated;
// //            }
// //            circlePaths[index] = circlePath;
// //            index++;
// //        }
// //        // cap
// //        var capPath = (nbPoints, pathIndex) => {
// //            var pointCap = Array<Vector3>();
// //            for (var i = 0; i < nbPoints; i++) {
// //                pointCap.push(path[pathIndex]);
// //            }
// //            return pointCap;
// //        };
// //        switch (cap) {
// //            case Mesh.NO_CAP:
// //                break;
// //            case Mesh.CAP_START:
// //                circlePaths[0] = capPath(tessellation, 0);
// //                circlePaths[1] = circlePaths[2].slice(0);
// //                break;
// //            case Mesh.CAP_END:
// //                circlePaths[index] = circlePaths[index - 1].slice(0);
// //                circlePaths[index + 1] = capPath(tessellation, path.length - 1);
// //                break;
// //            case Mesh.CAP_ALL:
// //                circlePaths[0] = capPath(tessellation, 0);
// //                circlePaths[1] = circlePaths[2].slice(0);
// //                circlePaths[index] = circlePaths[index - 1].slice(0);
// //                circlePaths[index + 1] = capPath(tessellation, path.length - 1);
// //                break;
// //            default:
// //                break;
// //        }
// //        return circlePaths;
// //    };
// //    var path3D;
// //    var pathArray;
// //    if (instance) { // tube update
// //        var arc = options.arc || (<any>instance).arc;
// //        path3D = ((<any>instance).path3D).update(path);
// //        pathArray = tubePathArray(path, path3D, (<any>instance).pathArray, constantRadius, (<any>instance).tessellation, radiusFunction, (<any>instance).cap, arc);
// //        instance = MeshBuilder.CreateRibbon(null, { pathArray: pathArray, instance: instance });
// //        (<any>instance).path3D = path3D;
// //        (<any>instance).pathArray = pathArray;
// //        (<any>instance).arc = arc;
// //
// //        return instance;
// //
// //    }
// //    // tube creation
// //    path3D = <any>new Path3D(path);
// //    var newPathArray = new Array<Array<Vector3>>();
// //    cap = (cap < 0 || cap > 3) ? 0 : cap;
// //    pathArray = tubePathArray(path, path3D, newPathArray, constantRadius, tessellation, radiusFunction, cap, options.arc);
// //    var tube = MeshBuilder.CreateRibbon(name, { pathArray: pathArray, closePath: true, closeArray: false, updatable: updatable, sideOrientation: sideOrientation }, scene);
// //    (<any>tube).pathArray = pathArray;
// //    (<any>tube).path3D = path3D;
// //    (<any>tube).tessellation = tessellation;
// //    (<any>tube).cap = cap;
// //    (<any>tube).arc = options.arc;
// //
// //    return tube;
// //}
//
//
// export class RibbonVertexData{
//
//     pathArray: XYZ[][]
//     closeArray = false;
//     closePath =  false;
//     sideOrientation: number =  Mesh.DOUBLESIDE;
//     offset=0
//
//     constructor(pathArray: XYZ[][]){
//         this.pathArray=pathArray
//     }
//
//
//     goChanging(){
//         var positions: number[] = [];
//         var indices: number[] = [];
//         var normals: number[] = [];
//         var uvs: number[] = [];
//
//         var us: number[][] = [];        		// us[path_id] = [uDist1, uDist2, uDist3 ... ] distances between points on path path_id
//         var vs: number[][] = [];        		// vs[i] = [vDist1, vDist2, vDist3, ... ] distances between points i of consecutives paths from pathArray
//         var uTotalDistance: number[] = []; 		// uTotalDistance[p] : total distance of path p
//         var vTotalDistance: number[] = []; 		//  vTotalDistance[i] : total distance between points i of first and last path from pathArray
//         var minlg: number;          	        // minimal length among all paths from pathArray
//         var lg: number[] = [];        		    // array of path lengths : nb of vertex per path
//         var idx: number[] = [];       		    // array of path indexes : index of each path (first vertex) in the total vertex number
//         var p: number;							// path iterator
//         var i: number;							// point iterator
//         var j: number;							// point iterator
//
//         // if single path in pathArray
//         if (this.pathArray.length < 2) {
//             var ar1: XYZ[] = [];
//             var ar2: XYZ[] = [];
//             for (i = 0; i < this.pathArray[0].length - this.offset; i++) {
//                 ar1.push(this.pathArray[0][i]);
//                 ar2.push(this.pathArray[0][i + this.offset]);
//             }
//             this.pathArray = [ar1, ar2];
//         }
//
//         // positions and horizontal distances (u)
//         var idc: number = 0;
//         var closePathCorr: number = (this.closePath) ? 1 : 0;
//         var path: XYZ[];
//         var l: number;
//         minlg = this.pathArray[0].length;
//         var vectlg: number;
//         var dist: number;
//         for (p = 0; p < this.pathArray.length; p++) {
//             uTotalDistance[p] = 0;
//             us[p] = [0];
//             path = this.pathArray[p];
//             l = path.length;
//             minlg = (minlg < l) ? minlg : l;
//
//             j = 0;
//             while (j < l) {
//                 positions.push(path[j].x, path[j].y, path[j].z);
//                 if (j > 0) {
//                     vectlg = path[j].subtract(path[j - 1]).length();
//                     dist = vectlg + uTotalDistance[p];
//                     us[p].push(dist);
//                     uTotalDistance[p] = dist;
//                 }
//                 j++;
//             }
//
//             if (this.closePath) {
//                 j--;
//                 positions.push(path[0].x, path[0].y, path[0].z);
//                 vectlg = path[j].subtract(path[0]).length();
//                 dist = vectlg + uTotalDistance[p];
//                 us[p].push(dist);
//                 uTotalDistance[p] = dist;
//             }
//
//             lg[p] = l + closePathCorr;
//             idx[p] = idc;
//             idc += (l + closePathCorr);
//         }
//
//         // vertical distances (v)
//         var path1: XYZ[];
//         var path2: XYZ[];
//         var vertex1: XYZ;
//         var vertex2: XYZ;
//         for (i = 0; i < minlg + closePathCorr; i++) {
//             vTotalDistance[i] = 0;
//             vs[i] = [0];
//             for (p = 0; p < this.pathArray.length - 1; p++) {
//                 path1 = this.pathArray[p];
//                 path2 = this.pathArray[p + 1];
//                 if (i === minlg) {   // closePath
//                     vertex1 = path1[0];
//                     vertex2 = path2[0];
//                 }
//                 else {
//                     vertex1 = path1[i];
//                     vertex2 = path2[i];
//                 }
//                 vectlg = vertex2.subtract(vertex1).length();
//                 dist = vectlg + vTotalDistance[i];
//                 vs[i].push(dist);
//                 vTotalDistance[i] = dist;
//             }
//             if (this.closeArray) {
//                 path1 = this.pathArray[p];
//                 path2 = this.pathArray[0];
//                 if (i === minlg) {   // closePath
//                     vertex2 = path2[0];
//                 }
//                 vectlg = vertex2.subtract(vertex1).length();
//                 dist = vectlg + vTotalDistance[i];
//                 vTotalDistance[i] = dist;
//             }
//         }
//
//
//         // uvs
//         var u: number;
//         var v: number;
//         for (p = 0; p < this.pathArray.length; p++) {
//             for (i = 0; i < minlg + closePathCorr; i++) {
//                 u = us[p][i] / uTotalDistance[p];
//                 v = vs[i][p] / vTotalDistance[i];
//                 uvs.push(u, v);
//             }
//         }
//
//         // indices
//         p = 0;                    					// path index
//         var pi: number = 0;                    		// positions array index
//         var l1: number = lg[p] - 1;           		// path1 length
//         var l2: number = lg[p + 1] - 1;         	// path2 length
//         var min: number = (l1 < l2) ? l1 : l2;   	// current path stop index
//         var shft: number = idx[1] - idx[0];         // shift
//         var path1nb: number = this.closeArray ? lg.length : lg.length - 1;     // number of path1 to iterate	on
//
//         while (pi <= min && p < path1nb) {       	//  stay under min and don't goChanging over next to last path
//             // draw two triangles between path1 (p1) and path2 (p2) : (p1.pi, p2.pi, p1.pi+1) and (p2.pi+1, p1.pi+1, p2.pi) clockwise
//
//             indices.push(pi, pi + shft, pi + 1);
//             indices.push(pi + shft + 1, pi + 1, pi + shft);
//             pi += 1;
//             if (pi === min) {                   			// if end of one of two consecutive paths reached, goChanging to next existing path
//                 p++;
//                 if (p === lg.length - 1) {                 // last path of pathArray reached <=> closeArray == true
//                     shft = idx[0] - idx[p];
//                     l1 = lg[p] - 1;
//                     l2 = lg[0] - 1;
//                 }
//                 else {
//                     shft = idx[p + 1] - idx[p];
//                     l1 = lg[p] - 1;
//                     l2 = lg[p + 1] - 1;
//                 }
//                 pi = idx[p];
//                 min = (l1 < l2) ? l1 + pi : l2 + pi;
//             }
//         }
//
//         // normals
//         VertexData.ComputeNormals(positions, indices, normals);
//
//         if (this.closePath) {
//             var indexFirst: number = 0;
//             var indexLast: number = 0;
//             for (p = 0; p < this.pathArray.length; p++) {
//                 indexFirst = idx[p] * 3;
//                 if (p + 1 < this.pathArray.length) {
//                     indexLast = (idx[p + 1] - 1) * 3;
//                 }
//                 else {
//                     indexLast = normals.length - 3;
//                 }
//                 normals[indexFirst] = (normals[indexFirst] + normals[indexLast]) * 0.5;
//                 normals[indexFirst + 1] = (normals[indexFirst + 1] + normals[indexLast + 1]) * 0.5;
//                 normals[indexFirst + 2] = (normals[indexFirst + 2] + normals[indexLast + 2]) * 0.5;
//                 normals[indexLast] = normals[indexFirst];
//                 normals[indexLast + 1] = normals[indexFirst + 1];
//                 normals[indexLast + 2] = normals[indexFirst + 2];
//             }
//         }
//
//         // sides
//         _ComputeSides(this.sideOrientation, positions, indices, normals, uvs);
//
//         // Result
//         var vertexData = new VertexData();
//
//         vertexData.indices = indices;
//         vertexData.positions = positions;
//         vertexData.normals = normals;
//         vertexData.uvs = uvs;
//
//         /**alors ça, a quoi cela sert ???*/
//         if (this.closePath) {
//             (<any>vertexData)._idx = idx;
//         }
//
//         return vertexData;
//     }
//
//
// }
//
//
//
// function _ComputeSides(sideOrientation: number, positions: number[] | Float32Array, indices: number[] | Float32Array, normals: number[] | Float32Array, uvs: number[] | Float32Array) {
//     var li: number = indices.length;
//     var ln: number = normals.length;
//     var i: number;
//     var n: number;
//     sideOrientation = sideOrientation || Mesh.DEFAULTSIDE;
//
//     switch (sideOrientation) {
//
//         case Mesh.FRONTSIDE:
//             // nothing changed
//             break;
//
//         case Mesh.BACKSIDE:
//             var tmp: number;
//             // indices
//             for (i = 0; i < li; i += 3) {
//                 tmp = indices[i];
//                 indices[i] = indices[i + 2];
//                 indices[i + 2] = tmp;
//             }
//             // normals
//             for (n = 0; n < ln; n++) {
//                 normals[n] = -normals[n];
//             }
//             break;
//
//         case Mesh.DOUBLESIDE:
//             // positions
//             var lp: number = positions.length;
//             var l: number = lp / 3;
//             for (var p = 0; p < lp; p++) {
//                 positions[lp + p] = positions[p];
//             }
//             // indices
//             for (i = 0; i < li; i += 3) {
//                 indices[i + li] = indices[i + 2] + l;
//                 indices[i + 1 + li] = indices[i + 1] + l;
//                 indices[i + 2 + li] = indices[i] + l;
//             }
//             // normals
//             for (n = 0; n < ln; n++) {
//                 normals[ln + n] = -normals[n];
//             }
//
//             // uvs
//             var lu: number = uvs.length;
//             for (var u: number = 0; u < lu; u++) {
//                 uvs[u + lu] = uvs[u];
//             }
//             break;
//     }
// }
//
