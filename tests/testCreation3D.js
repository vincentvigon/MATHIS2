/**
 * Created by vigon on 05/03/2016.
 */
/**
 * Created by vigon on 25/01/2016.
 */
var mathis;
(function (mathis) {
    function testCreation3D(mathisFrame) {
        var bilan = new mathis.Bilan();
        {
            var crea = new mathis.reseau.Regular3D();
            crea.strateHaveSquareMailleVersusTriangleMaille = false;
            var mamesh = crea.go();
            mamesh.fillLineCatalogue();
            bilan.assertTrue(mamesh.allLinesAsASortedString() == 'straightLines:["[0,1]","[0,3,6]","[0,4,5]","[0,9,18]","[1,10,19]","[1,2]","[1,4,7]","[10,11]","[10,13,16]","[11,13,12]","[11,14,17]","[12,16,17]","[14,16,15]","[18,19]","[18,21,24]","[18,22,23]","[19,20]","[19,22,25]","[2,11,20]","[2,4,3]","[2,5,8]","[20,22,21]","[20,23,26]","[21,25,26]","[23,25,24]","[3,12,21]","[3,7,8]","[4,13,22]","[5,14,23]","[5,7,6]","[6,15,24]","[7,16,25]","[8,17,26]","[9,10]","[9,12,15]","[9,13,14]"]');
            bilan.assertTrue(mamesh.allSquareAndTrianglesAsSortedString() == 'square:["[0,1,10,9]","[0,3,12,9]","[1,2,11,10]","[1,4,13,10]","[10,11,20,19]","[10,13,22,19]","[11,14,23,20]","[12,13,22,21]","[12,15,24,21]","[13,14,23,22]","[13,16,25,22]","[14,17,26,23]","[15,16,25,24]","[16,17,26,25]","[2,5,14,11]","[3,4,13,12]","[3,6,15,12]","[4,5,14,13]","[4,7,16,13]","[5,8,17,14]","[6,7,16,15]","[7,8,17,16]","[9,10,19,18]","[9,12,21,18]"]triangle:["[0,3,4]","[0,4,1]","[1,4,2]","[10,13,11]","[11,13,14]","[12,15,16]","[12,16,13]","[13,16,14]","[14,16,17]","[18,21,22]","[18,22,19]","[19,22,20]","[2,4,5]","[20,22,23]","[21,24,25]","[21,25,22]","[22,25,23]","[23,25,26]","[3,6,7]","[3,7,4]","[4,7,5]","[5,7,8]","[9,12,13]","[9,13,10]"]');
        }
        {
            var crea = new mathis.reseau.Regular3D();
            crea.strateHaveSquareMailleVersusTriangleMaille = true;
            var mamesh = crea.go();
            mamesh.fillLineCatalogue();
            bilan.assertTrue(mamesh.allLinesAsASortedString() == 'straightLines:["[0,1,2]","[0,3,6]","[0,9,18]","[1,10,19]","[1,4,7]","[10,13,16]","[11,14,17]","[12,13,14]","[15,16,17]","[18,19,20]","[18,21,24]","[19,22,25]","[2,11,20]","[2,5,8]","[20,23,26]","[21,22,23]","[24,25,26]","[3,12,21]","[3,4,5]","[4,13,22]","[5,14,23]","[6,15,24]","[6,7,8]","[7,16,25]","[8,17,26]","[9,10,11]","[9,12,15]"]');
            bilan.assertTrue(mamesh.allSquareAndTrianglesAsSortedString() == 'square:["[0,1,10,9]","[0,3,12,9]","[0,3,4,1]","[1,2,11,10]","[1,4,13,10]","[1,4,5,2]","[10,11,20,19]","[10,13,14,11]","[10,13,22,19]","[11,14,23,20]","[12,13,22,21]","[12,15,16,13]","[12,15,24,21]","[13,14,23,22]","[13,16,17,14]","[13,16,25,22]","[14,17,26,23]","[15,16,25,24]","[16,17,26,25]","[18,21,22,19]","[19,22,23,20]","[2,5,14,11]","[21,24,25,22]","[22,25,26,23]","[3,4,13,12]","[3,6,15,12]","[3,6,7,4]","[4,5,14,13]","[4,7,16,13]","[4,7,8,5]","[5,8,17,14]","[6,7,16,15]","[7,8,17,16]","[9,10,19,18]","[9,12,13,10]","[9,12,21,18]"]triangle:[]');
        }
        {
            var crea = new mathis.reseau.Regular3D();
            crea.strateHaveSquareMailleVersusTriangleMaille = true;
            crea.oneMoreVertexForOddLine = false;
            crea.decayOddStrates = true;
            crea.createJKSquares = true;
            crea.createIKSquaresOrTriangles = true;
            crea.interStrateMailleAreSquareVersusTriangle = false;
            var mamesh = crea.go();
            mamesh.fillLineCatalogue();
            bilan.assertTrue(mamesh.allLinesAsASortedString() == 'straightLines:["[0,1,2]","[0,12,21]","[0,3,6]","[0,9]","[1,10]","[1,13,22]","[1,4,7]","[10,13,16]","[10,19]","[11,14,17]","[11,20]","[12,13,14]","[15,16,17]","[18,19,20]","[18,21,24]","[19,22,25]","[2,11]","[2,14,23]","[2,5,8]","[20,23,26]","[21,22,23]","[24,25,26]","[3,12,18]","[3,15,24]","[3,4,5]","[4,13,19]","[4,16,25]","[5,14,20]","[5,17,26]","[6,15,21]","[6,7,8]","[7,16,22]","[8,17,23]","[9,10,11]","[9,12,15]","[9,18]"]');
            bilan.assertTrue(mamesh.allSquareAndTrianglesAsSortedString() == 'square:["[0,1,10,9]","[0,3,4,1]","[1,2,11,10]","[1,4,5,2]","[10,11,20,19]","[10,13,14,11]","[12,13,22,21]","[12,15,16,13]","[13,14,23,22]","[13,16,17,14]","[15,16,25,24]","[16,17,26,25]","[18,21,22,19]","[19,22,23,20]","[21,24,25,22]","[22,25,26,23]","[3,4,13,12]","[3,6,7,4]","[4,5,14,13]","[4,7,8,5]","[6,7,16,15]","[7,8,17,16]","[9,10,19,18]","[9,12,13,10]"]triangle:["[0,12,9]","[0,3,12]","[1,13,10]","[1,4,13]","[10,13,19]","[11,14,20]","[12,15,21]","[12,21,18]","[13,16,22]","[13,22,19]","[14,17,23]","[14,23,20]","[15,24,21]","[16,25,22]","[17,26,23]","[2,14,11]","[2,5,14]","[3,15,12]","[3,6,15]","[4,16,13]","[4,7,16]","[5,17,14]","[5,8,17]","[9,12,18]"]');
        }
        // {
        //     let crea = new reseau.Regular3D()
        //     crea.strateHaveSquareMailleVersusTriangleMaille = true
        //     crea.oneMoreVertexForOddLine=false
        //     crea.decayOddStrates=false
        //     crea.createJKSquares=true
        //     crea.createIKSquaresOrTriangles=true
        //     crea.interStrateMaille=reseau.Maille.square
        //
        //
        //     let mamesh = crea.goChanging()
        //
        //     mamesh.fillLineCatalogue()
        //
        //     cc(mamesh.allLinesAsASortedString())
        //     cc(mamesh.allSquareAndTrianglesAsSortedString())
        //
        //     let liner = new visu3d.LinksViewer(mamesh, mathisFrame.scene)
        //     liner.goChanging()
        //
        //     let surfacer = new visu3d.SurfaceViewer(mamesh, mathisFrame.scene)
        //     surfacer.goChanging()
        // }
        //
        // {
        //
        //     let infi=new infiniteWorlds.InfiniteCartesian(mathisFrame)
        //     infi.recenterCamera=false
        //     infi.nbRepetition=3
        //     infi.nbSubdivision=3
        //     infi.squareVersusSemiVersusTri=0
        //     infi.addFog=false
        //     infi.notDrawMeshesAtFarCorners=true
        //     infi.cameraInitialPosition=new XYZ(0,10,-50)
        //     infi.goChanging()
        //
        //
        // }
        //
        return bilan;
    }
    mathis.testCreation3D = testCreation3D;
})(mathis || (mathis = {}));
