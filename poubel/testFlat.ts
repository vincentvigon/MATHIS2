// /**
//  * Created by vigon on 25/01/2016.
//  */
//
// module mathis{
//
//
//     export function flatTest():Bilan {
//
//
//         let bilan = new Bilan(0, 0)
//
//
//         function rectangleWithDifferentsParameters(makeLinks, addSquare):Mamesh{
//             let mamesh = new Mamesh()
//             let meshMaker = new creationFlat.Cartesian(mamesh)
//             meshMaker.createNewLinks=createNewLinks
//             meshMaker.nbX=8
//             meshMaker.nbY=5
//             meshMaker.addTriangleOrSquare=addSquare
//             meshMaker.goChanging()
//             return mamesh
//         }
//
//
//
//
//
//
//
//         //TODO refaire ce test
//         //{
//         //    /**duplication of positions when normals are too differents:*/
//         //
//         //
//         //    let mamesh = new Mamesh()
//         //    let meshMaker = new flat.Cartesian(mamesh)
//         //    meshMaker.makeLinks=true
//         //    meshMaker.nbX=3
//         //    meshMaker.minX=-1
//         //    meshMaker.maxX=1
//         //    meshMaker.nbY=2
//         //    meshMaker.minY=-1
//         //    meshMaker.maxY=+1
//         //    meshMaker.cornersAreSharp=true
//         //    meshMaker.addTriangleOrSquare=true
//         //    meshMaker.goChanging()
//         //
//         //    mamesh.fillLineCatalogue()
//         //
//         //
//         //    mamesh.vertices[1].position.changeBy(0,-1,-1)
//         //    mamesh.vertices[4].position.changeBy(0,1,-1)
//         //
//         //    let babVertexData=new visu3d.MameshToBabVertexData(mamesh)
//         //
//         //    let positions=[]
//         //    for (let v of mamesh.vertices) {
//         //        positions.push(v.position.x, v.position.y, v.position.z)
//         //    }
//         //
//         //    let positionSize=positions.length
//         //
//         //    let indices = mamesh.smallestTriangles.concat([])
//         //
//         //
//         //
//         //    for (let i=0;i<mamesh.smallestSquares.length;i+=4){
//         //        indices.push(IN_mamesh.smallestSquares[i],IN_mamesh.smallestSquares[i+1],IN_mamesh.smallestSquares[i+3],
//         //            IN_mamesh.smallestSquares[i+1],IN_mamesh.smallestSquares[i+2],IN_mamesh.smallestSquares[i+3])
//         //        //i,i+1,i+3,i+1,i+2,i+3)
//         //    }
//         //    let normalsOfTriangles=babVertexData.computeOneNormalPerTriangle(positions,indices)
//         //    let normalsOfVertices = babVertexData.computeVertexNormalFromTrianglesNormal(positions,indices,normalsOfTriangles)
//         //
//         //    let newPositionSize=positions.length
//         //
//         //    bilan.assertTrue(newPositionSize==positionSize+3*3)
//         //
//         //
//         //
//         //
//         //
//         //
//         //
//         //}
//
//         {
//
//             let mamesh = new Mamesh()
//             let meshMaker = new creationFlat.Quinconce(mamesh)
//             meshMaker.makeLinks=true
//             meshMaker.nbX=3
//             meshMaker.nbY=2
//             meshMaker.addTriangleOrSquare=true
//             meshMaker.goChanging()
//
//
//             ///mamesh.fillLineCatalogue()
//
//         }
//
//
//         //{
//         //    /**loop line on moebius band*/
//         //
//         //    let mamesh = new Mamesh()
//         //    let meshMaker = new flat.Cartesian(mamesh)
//         //    meshMaker.makeLinks=true
//         //    meshMaker.nbX=3
//         //    meshMaker.maxX=2*Math.PI
//         //    meshMaker.nbY=2
//         //    meshMaker.minY=-1
//         //    meshMaker.maxY=+1
//         //    meshMaker.cornersAreSharp=true
//         //    meshMaker.addTriangleOrSquare=true
//         //    meshMaker.borderStickingVertical=flat.BorderSticking.inverted
//         //    meshMaker.goChanging()
//         //
//         //    mamesh.fillLineCatalogue()
//         //    cc(mamesh.toString())
//         //
//         //
//         //
//         //}
//
//
//
//
//
//         return bilan
//
//
//     }
//
//
//
//
//     }