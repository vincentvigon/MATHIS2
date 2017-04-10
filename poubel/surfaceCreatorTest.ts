///**
// * Created by vigon on 04/12/2015.
// */
//
//module mathis {
//
//
//    export function surfaceCreatorTest():Bilan {
//
//
//        let bilan = new Bilan(0, 0)
//
//
//
//        let mmc =new MameshCreator()
//
//
//        {
//            let mamesh=mmc.createSquareWithOneDiag(false)
//            let mmm=new MameshManipulator(mamesh)
//            mmm.doTriangleDichotomy(false,[IN_mamesh.vertices[0],IN_mamesh.vertices[1],IN_mamesh.vertices[3]])
//            mmm.makeLinksFromTrianglesAndSquares()
//
//        }
//
//
//        {
//            let meshSquareBis = mmc.createSquareWithOneDiag(false,false)
//
//            let mmmBis=new MameshManipulator(meshSquareBis)
//            mmmBis.doTriangleDichotomy(false)
//
//            mmmBis.makeLinksFromTrianglesAndSquares()
//
//        }
//
//
//
//
//        {
//            let meshSquare = mmc.createSquareWithOneDiag(true,false)
//            let mmm=new MameshManipulator(meshSquare)
//            mmm.doTriangleDichotomy( true)
//            mmm.fillLineCatalogue()
//
//            let meshSquareBis = mmc.createSquareWithOneDiag(false,false)
//            let mmmBis=new MameshManipulator(meshSquareBis)
//            mmmBis.doTriangleDichotomy( false)
//            mmmBis.makeLinksFromTrianglesAndSquares()
//            mmmBis.fillLineCatalogue()
//            bilan.assertTrue(meshSquareBis.equalAsGraph(meshSquare))
//        }
//
//
//
//
//
//
//
//
//
//        {
//
//            let meshTriangleLinksMadeAtTheEnd = mmc.createTriangle(false, true)
//            let mmm=new MameshManipulator(meshTriangleLinksMadeAtTheEnd)
//            mmm.doTriangleDichotomy( false)
//            mmm.makeLinksFromTrianglesAndSquares()
//
//        }
//
//
//        //{
//        //    let meshTriangleLinksMadeAtEachDicho=mmc.createTriangle(true,true)
//        //    cc(meshTriangleLinksMadeAtEachDicho.toString())
//        //
//        //    {
//        //        let mmm = new MameshManipulator(meshTriangleLinksMadeAtEachDicho)
//        //        mmm.doTriangleDichotomy(true)
//        //        //mmm.doTriangleDichotomy(true)
//        //        //mmm.doTriangleDichotomy(true)
//        //        //mmm.doTriangleDichotomy(true)
//        //        //mmm.doTriangleDichotomy(true)
//        //    }
//        //    cc(meshTriangleLinksMadeAtEachDicho.toString())
//        //
//        //}
//
//
//        //{
//        //
//        //    let time1=performance.now()
//        //    let meshTriangleLinksMadeAtTheEnd=mmc.createTriangle(false,true)
//        //    {
//        //        let mmm = new MameshManipulator(meshTriangleLinksMadeAtTheEnd)
//        //        mmm.doTriangleDichotomy(false)
//        //        mmm.doTriangleDichotomy(false)
//        //        mmm.doTriangleDichotomy(false)
//        //        mmm.doTriangleDichotomy(false)
//        //        mmm.doTriangleDichotomy(false)
//        //        mmm.doTriangleDichotomy(false)
//        //
//        //        mmm.createPolygonesFromSmallestTrianglesAnSquares()
//        //        mmm.makeLinksFromTrianglesAndSquares()
//        //    }
//        //    let tt1=performance.now()-time1
//        //    cc('angles sharp',tt1)
//        //
//        //
//        //}
//        //{
//        //
//        //    let time1=performance.now()
//        //    let meshTriangleLinksMadeAtTheEnd=mmc.createTriangle(false,false)
//        //    {
//        //        let mmm = new MameshManipulator(meshTriangleLinksMadeAtTheEnd)
//        //        mmm.doTriangleDichotomy(false)
//        //        mmm.doTriangleDichotomy(false)
//        //        mmm.doTriangleDichotomy(false)
//        //        mmm.doTriangleDichotomy(false)
//        //        mmm.doTriangleDichotomy(false)
//        //        mmm.doTriangleDichotomy(false)
//        //
//        //        mmm.createPolygonesFromSmallestTrianglesAnSquares()
//        //        mmm.makeLinksFromTrianglesAndSquares()
//        //    }
//        //    let tt1=performance.now()-time1
//        //    cc('angles rond',tt1)
//        //
//        //
//        //}
//
//
//
//
//        function twoWays(sharpAngle){
//            let time0=performance.now()
//            let meshTriangleLinksMadeAtEachDicho=mmc.createTriangle(true,sharpAngle)
//            {
//                let mmm = new MameshManipulator(meshTriangleLinksMadeAtEachDicho)
//                mmm.doTriangleDichotomy(true)
//                mmm.doTriangleDichotomy(true)
//                mmm.doTriangleDichotomy(true)
//                mmm.doTriangleDichotomy(true)
//                mmm.doTriangleDichotomy(true)
//                mmm.doTriangleDichotomy(true)
//
//            }
//            let tt0=performance.now()-time0
//
//
//            let time1=performance.now()
//            let meshTriangleLinksMadeAtTheEnd=mmc.createTriangle(false,sharpAngle)
//            {
//                let mmm = new MameshManipulator(meshTriangleLinksMadeAtTheEnd)
//                mmm.doTriangleDichotomy(false)
//                mmm.doTriangleDichotomy(false)
//                mmm.doTriangleDichotomy(false)
//                mmm.doTriangleDichotomy(false)
//                mmm.doTriangleDichotomy(false)
//                mmm.doTriangleDichotomy(false)
//
//                mmm.makeLinksFromTrianglesAndSquares()
//            }
//            let tt1=performance.now()-time1
//
//
//            /**le temps de la procédure <<au fur et a mesure>> doit être inférieure au temps de la <<procédure d'un coup>>*/
//            bilan.assertTrue(tt0<tt1)
//            /** et les deux graphes doivent être égaux */
//
//
//            //cc('meshTriangleLinksMadeAtEachDicho',meshTriangleLinksMadeAtEachDicho.toString())
//            //cc('meshTriangleLinksMadeAtTheEnd',meshTriangleLinksMadeAtTheEnd.toString())
//
//            bilan.assertTrue(meshTriangleLinksMadeAtEachDicho.equalAsGraph(meshTriangleLinksMadeAtTheEnd))
//
//        }
//
//        twoWays(true)
//        twoWays(false)
//
//
//
//
//
//
//
//        {
//            let twoDiagSquareMesh = mmc.createSquareWithTwoDiag(true)
//            let mmm=new MameshManipulator(twoDiagSquareMesh)
//            mmm.doTriangleDichotomy( true)
//
//            let twoDiagSquareMeshBis = mmc.createSquareWithTwoDiag(false)
//            let mmmBis=new MameshManipulator(twoDiagSquareMeshBis)
//            mmmBis.doTriangleDichotomy( false)
//            mmmBis.makeLinksFromTrianglesAndSquares()
//
//            bilan.assertTrue(twoDiagSquareMeshBis.equalAsGraph(twoDiagSquareMesh))
//        }
//
//

//
//        {
//            let meshPoly3 = mmc.createPolygone(3)
//            let mmm = new MameshManipulator(meshPoly3)
//            mmm.fillLineCatalogue()
//            bilan.assertTrue(meshPoly3.straightLines.length == 3)
//        }
//        {
//
//
//            let meshPoly4 = mmc.createPolygone(4)
//            let mmm = new MameshManipulator(meshPoly4)
//            mmm.fillLineCatalogue()
//            bilan.assertTrue(meshPoly4.straightLines.length == 6)
//
//        }


//        {
//
//            let meshPoly4 = mmc.createPolygone(4, true)
//            let mmm = new MameshManipulator(meshPoly4)
//            mmm.fillLineCatalogue()
//            bilan.assertTrue(meshPoly4.straightLines.length == 2)
//        }
//        {
//            let meshPoly13=mmc.createPolygone(13,true)
//            let mmm = new MameshManipulator(meshPoly13)
//            mmm.fillLineCatalogue()
//            bilan.assertTrue(meshPoly13.straightLines.length==13 && meshPoly13.loopLines.length==1 )
//        }
//
//        //TODO remake these test
//        //{
//        //    let a=[23,456,4567,1,2,3,4,5,6,7,8,9]
//        //    let b=[23,456,4567,4,5,6]
//        //    let c=mmm.removeTriangleFromList(a,b)
//        //
//        //    bilan.assertTrue(JSON.stringify([1,2,3,7,8,9])==JSON.stringify(c))
//        //    a=[5,6,7,8,1,2,3,4,13,123,123,123]
//        //    b=[1,2,3,4]
//        //    c=mmm.removeSquareFromList(a,b)
//        //    bilan.assertTrue(JSON.stringify([5,6,7,8,13,123,123,123])==JSON.stringify(c))
//        //
//        //
//        //}
//
//
//{
//
//    let mamesh=mmc.createSquareWithTwoDiag(true)
//    let mmm=new MameshManipulator(mamesh)
//    mmm.doTriangleDichotomy(true,[IN_mamesh.vertices[0],IN_mamesh.vertices[1],IN_mamesh.vertices[4],IN_mamesh.vertices[1],IN_mamesh.vertices[2],IN_mamesh.vertices[4]])
//    mmm.fillLineCatalogue()
//    let compt=[0,0,0,0,0,0]
//    for (let line of mamesh.straightLines){
//        compt[line.length]++
//    }
//    bilan.assertTrue(JSON.stringify(compt)=='[0,0,4,4,1,1]')
//}
//
//
//
//
//
//
//        return bilan
//    }
//
//}