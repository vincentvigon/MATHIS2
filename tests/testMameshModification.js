/**
 * Created by vigon on 22/02/2016.
 */
var mathis;
(function (mathis) {
    function testMameshModification(mathisFrame) {
        var bilan = new mathis.Bilan();
        /**test partial dichotomy, linkModule*/
        {
            var mamesh = new mathis.Mamesh();
            var creator = new mathis.creationFlat.SingleSquare(mamesh);
            creator.makeLinks = false;
            creator.go();
            var dicho = new mathis.mameshModification.SquareDichotomer(mamesh);
            dicho.go();
            var dicho2 = new mathis.mameshModification.SquareDichotomer(mamesh);
            dicho2.squareToCut = [mamesh.vertices[0], mamesh.vertices[4], mamesh.vertices[8], mamesh.vertices[7]];
            dicho2.go();
            var linkerCons = new mathis.linkModule.LinkCreaterSorterAndBorderDetecterByPolygons(mamesh);
            linkerCons.goChanging();
            mamesh.fillLineCatalogue();
            bilan.assertTrue(mamesh.allLinesAsASortedString() == 'straightLines:["[0,12,7,3]","[0,9,4,1]","[1,5,2]","[10,13,12]","[2,6,3]","[4,10,8,6]","[5,8,11,7]","[9,13,11]"]');
        }
        /**idem */
        {
            var mamesh = new mathis.Mamesh();
            new mathis.creationFlat.SingleSquareWithOneDiag(mamesh).go();
            var dicho = new mathis.mameshModification.TriangleDichotomer(mamesh);
            dicho.trianglesToCut = [mamesh.vertices[0], mamesh.vertices[1], mamesh.vertices[3]];
            dicho.makeLinks = true;
            dicho.go();
            var dicho2 = new mathis.mameshModification.TriangleDichotomer(mamesh);
            dicho2.trianglesToCut = [mamesh.vertices[4], mamesh.vertices[5], mamesh.vertices[6]];
            dicho.makeLinks = true;
            dicho2.go();
            new mathis.spacialTransformations.Similitude(mamesh.vertices, 0.1).goChanging();
            mamesh.fillLineCatalogue();
            bilan.assertTrue(mamesh.allLinesAsASortedString() == 'straightLines:["[0,4,1]","[0,6,3]","[1,2]","[1,5,3]","[2,3]","[4,7,5]","[4,9,6]","[5,8,6]","[7,8]","[7,9]","[8,9]"]');
        }
        /**idem*/
        {
            var mamesh = new mathis.Mamesh();
            var creator = new mathis.creationFlat.SingleSquare(mamesh);
            creator.makeLinks = false;
            creator.go();
            var dicho = new mathis.mameshModification.SquareDichotomer(mamesh);
            dicho.go();
            var li = new mathis.linkModule.LinkCreaterSorterAndBorderDetecterByPolygons(mamesh);
            li.goChanging();
            mamesh.fillLineCatalogue();
            bilan.assertTrue(mamesh.allLinesAsASortedString() == 'straightLines:["[0,4,1]","[0,7,3]","[1,5,2]","[2,6,3]","[4,8,6]","[5,8,7]"]');
        }
        /**idem*/
        {
            var mamesh = new mathis.Mamesh();
            new mathis.creationFlat.SingleSquareWithOneDiag(mamesh).go();
            var dicho = new mathis.mameshModification.TriangleDichotomer(mamesh);
            dicho.trianglesToCut = [mamesh.vertices[0], mamesh.vertices[1], mamesh.vertices[3]];
            dicho.makeLinks = true;
            dicho.go();
            mamesh.clearLinksAndLines();
            new mathis.linkModule.LinkCreaterSorterAndBorderDetecterByPolygons(mamesh).goChanging();
            mamesh.fillLineCatalogue();
            bilan.assertTrue(mamesh.allLinesAsASortedString() == 'straightLines:["[0,4,1]","[0,6,3]","[1,2]","[1,5,3]","[2,3]","[4,5]","[4,6]","[5,6]"]');
        }
        /**idem*/
        {
            var mamesh = new mathis.Mamesh();
            var creator = new mathis.creationFlat.SingleSquare(mamesh);
            creator.makeLinks = false;
            creator.go();
            var dicho = new mathis.mameshModification.SquareDichotomer(mamesh);
            dicho.go();
            var dicho2 = new mathis.mameshModification.SquareDichotomer(mamesh);
            dicho2.squareToCut = [mamesh.vertices[0], mamesh.vertices[4], mamesh.vertices[8], mamesh.vertices[7]];
            dicho2.go();
            new mathis.linkModule.LinkCreaterSorterAndBorderDetecterByPolygons(mamesh).goChanging();
            mamesh.fillLineCatalogue();
            bilan.assertTrue(mamesh.allLinesAsASortedString() == 'straightLines:["[0,12,7,3]","[0,9,4,1]","[1,5,2]","[10,13,12]","[2,6,3]","[4,10,8,6]","[5,8,11,7]","[9,13,11]"]');
        }
        //{
        //
        //    let creator=new flat.SingleSquare()
        //    creator.createNewLinks=false
        //    let IN_mamesh:Mamesh=creator.goChanging()
        //    let dicho=new mameshModification.SquareDichotomer(IN_mamesh)
        //    dicho.goChanging()
        //
        //    //let dicho2=new mameshModification.SquareDichotomer(IN_mamesh)
        //    //dicho2.squareToCut=[IN_mamesh.vertices[1],IN_mamesh.vertices[5],IN_mamesh.vertices[8],IN_mamesh.vertices[4],IN_mamesh.vertices[5],IN_mamesh.vertices[2],IN_mamesh.vertices[6],IN_mamesh.vertices[8]]
        //    //dicho2.goChanging()
        //
        //    cc('IN_mamesh',IN_mamesh.toString())
        //
        //
        //    IN_mamesh.vertices.forEach(v=>{
        //        if (v.position.x==1) v.position.x=0
        //    })
        //
        //    new linkModule.LinkCreaterSorterAndBorderDetecterByPolygons(IN_mamesh).goChanging()
        //
        //
        //    new mameshModification.OneMameshAutoMerge(IN_mamesh).goChanging()
        //
        //
        //    cc('mergedMamesh',IN_mamesh.toString())
        //
        //
        //
        //}
        //
        //
        //{
        //
        //
        //    let mamesh0:Mamesh=new flat.SingleSquare().goChanging()
        //    let mamesh1:Mamesh=new flat.SingleSquare().goChanging()
        //
        //    mamesh1.vertices.forEach(v=>{
        //        v.position.x+=1
        //    })
        //
        //
        //
        //    let mergedMamesh=new mameshModification.TwoMameshMerger(mamesh0,mamesh1).goChanging()
        //
        //
        //    //cc('mamesh0',mamesh0.toString(false))
        //    //cc('mamesh1',mamesh1.toString(false))
        //    //
        //    //cc('mergedMamesh',mergedMamesh.toString(false))
        //
        //
        //
        //
        //}
        //{
        //
        //    let IN_mamesh=new Mamesh()
        //    let cart= new flat.Cartesian(IN_mamesh)
        //    cart.nbX=4
        //    cart.nbY=2
        //    cart.maxX=3
        //    cart.createNewLinks=true
        //    cart.goChanging()
        //
        //    //cc(IN_mamesh.toString())
        //
        //    IN_mamesh.vertices.forEach(v=>{
        //        if (v.position.x==3) v.position.x=0
        //    })
        //
        //    new mameshModification.Merger(IN_mamesh).goChanging()
        //
        //    //cc(IN_mamesh)
        //    //cc(IN_mamesh.toString())
        //
        //
        //
        //}
        //
        //
        /**test the cleaning of the links crossing middles of cut segments*/
        {
            var cart = new mathis.reseau.Regular();
            cart.nbI = 2;
            cart.nbJ = 2;
            cart.makeLinks = false;
            var mamesh0 = cart.go();
            new mathis.mameshModification.SquareDichotomer(mamesh0).go();
            new mathis.linkModule.LinkCreaterSorterAndBorderDetecterByPolygons(mamesh0).goChanging();
            var cart1 = new mathis.reseau.Regular();
            cart1.nbI = 2;
            cart1.nbJ = 2;
            var mamesh1 = cart1.go();
            mamesh1.vertices.forEach(function (v) { v.position.x += 1; });
            new mathis.grateAndGlue.Merger(mamesh0, mamesh1, null).goChanging();
        }
        /**two vertices are merged into one. Square are changed into triangles*/
        // {
        //     let IN_mamesh=new MameshForTest()
        //     let cart1= new reseau.Regular(IN_mamesh)
        //     cart1.nbX=3
        //     cart1.maxX=2
        //     cart1.nbY=2
        //     cart1.goChanging()
        //     IN_mamesh.vertices[0].position.x=1
        //     IN_mamesh.vertices[4].position.x=1
        //     new mameshModification.Merger(IN_mamesh).goChanging()
        //     bilan.assertTrue(IN_mamesh.toStringForTest1()=='0|links:(1)(3)(5)1|links:(3)(0)3|links:(5,1)(1,5)(0)5|links:(3)(0)tri:[0,3,1][0,5,3]squa:cutSegments')
        // }
        //{
        //        let IN_mamesh=new Mamesh()
        //        let cartesian= new flat.Cartesian(IN_mamesh)
        //        cartesian.nbX=3
        //    cartesian.maxX=2
        //        cartesian.nbY=2
        //        cartesian.createNewLinks=true
        //        cartesian.goChanging()
        //        cc(IN_mamesh.toString(false))
        //
        //    IN_mamesh.vertices[0].position.x=1
        //    new mameshModification.Merger(IN_mamesh).goChanging()
        //    cc(IN_mamesh.toString())
        //
        //}
        /**comparison of triangles dichotomies : first making links at the end. Secondly making links at each dichotomy. This second procedure is faster*/
        {
            var mamesh = new mathis.Mamesh();
            new mathis.creationFlat.SingleSquareWithOneDiag(mamesh).go();
            var dichotomer = new mathis.mameshModification.TriangleDichotomer(mamesh);
            dichotomer.makeLinks = true;
            dichotomer.go();
            mamesh.fillLineCatalogue();
            var mamesh2 = new mathis.Mamesh();
            new mathis.creationFlat.SingleSquareWithOneDiag(mamesh2).go();
            var dichotomer2 = new mathis.mameshModification.TriangleDichotomer(mamesh2);
            dichotomer2.makeLinks = false;
            dichotomer2.go();
            new mathis.linkModule.LinkCreaterSorterAndBorderDetecterByPolygons(mamesh2).goChanging();
            mamesh2.fillLineCatalogue();
            bilan.assertTrue(mamesh.allLinesAsASortedString() == mamesh2.allLinesAsASortedString());
        }
        /**idem, also time comparison*/
        {
            var deltaTime0 = 0;
            var deltaTime1 = 0;
            var lines0 = "";
            var lines1 = "";
            {
                var time0 = performance.now();
                var mamesh = new mathis.Mamesh();
                var maker = new mathis.reseau.SingleTriangle(mamesh);
                maker.go();
                var dichoter = new mathis.mameshModification.TriangleDichotomer(mamesh);
                dichoter.makeLinks = false;
                dichoter.go();
                dichoter = new mathis.mameshModification.TriangleDichotomer(mamesh);
                dichoter.makeLinks = false;
                dichoter.go();
                dichoter = new mathis.mameshModification.TriangleDichotomer(mamesh);
                dichoter.makeLinks = false;
                dichoter.go();
                dichoter = new mathis.mameshModification.TriangleDichotomer(mamesh);
                dichoter.makeLinks = false;
                dichoter.go();
                dichoter = new mathis.mameshModification.TriangleDichotomer(mamesh);
                dichoter.makeLinks = false;
                dichoter.go();
                new mathis.linkModule.LinkCreaterSorterAndBorderDetecterByPolygons(mamesh).goChanging();
                deltaTime0 = performance.now() - time0;
                mamesh.fillLineCatalogue();
                lines0 = mamesh.allLinesAsASortedString();
            }
            {
                var time0 = performance.now();
                var mamesh = new mathis.Mamesh();
                var maker = new mathis.reseau.SingleTriangle(mamesh);
                maker.go();
                var dichoter = new mathis.mameshModification.TriangleDichotomer(mamesh);
                dichoter.makeLinks = true;
                dichoter.go();
                dichoter = new mathis.mameshModification.TriangleDichotomer(mamesh);
                dichoter.makeLinks = true;
                dichoter.go();
                dichoter = new mathis.mameshModification.TriangleDichotomer(mamesh);
                dichoter.makeLinks = true;
                dichoter.go();
                dichoter = new mathis.mameshModification.TriangleDichotomer(mamesh);
                dichoter.makeLinks = true;
                dichoter.go();
                dichoter = new mathis.mameshModification.TriangleDichotomer(mamesh);
                dichoter.makeLinks = true;
                dichoter.go();
                deltaTime1 = performance.now() - time0;
                mamesh.fillLineCatalogue();
                lines1 = mamesh.allLinesAsASortedString();
            }
            bilan.assertTrue(deltaTime0 > deltaTime1);
            bilan.assertTrue(lines0 == lines1);
        }
        /**idem*/
        // {
        //     let meshSquare2 = new Mamesh()
        //     new creationFlat.SingleSquareWithOneDiag(meshSquare2).goChanging()
        //
        //     new mameshModification.TriangleDichotomer(meshSquare2).goChanging()
        //     meshSquare2.fillLineCatalogue()
        //     bilan.assertTrue(meshSquare2.straightLines.length==9)
        //
        //     let v0=meshSquare2.vertices[0]
        //     let v1=meshSquare2.vertices[1]
        //     let v2=meshSquare2.vertices[2]
        //     let v3=meshSquare2.vertices[3]
        //
        //     /** we add a loop line arround (but not suppress any existing links)*/
        //     v0.setTwoOppositeLinks(v1,v3,false)
        //     v1.setTwoOppositeLinks(v2,v0,false)
        //     v2.setTwoOppositeLinks(v3,v1,false)
        //     v3.setTwoOppositeLinks(v0,v2,false)
        //
        //     meshSquare2.straightLines=null
        //     meshSquare2.loopLines=null
        //     meshSquare2.fillLineCatalogue()
        //
        //     bilan.assertTrue(meshSquare2.loopLines.length==1 && meshSquare2.loopLines[0].length==4)
        // }
        {
            var mamesh = new mathis.reseau.TriangulatedPolygone(13).go();
            mamesh.fillLineCatalogue();
            bilan.assertTrue(mamesh.getStraightLines().length == 26);
        }
        //        {
        //            let meshPoly3 = mmc.createPolygone(3, true)
        //            let mmm = new MameshManipulator(meshPoly3)
        //            mmm.fillLineCatalogue()
        //            bilan.assertTrue(meshPoly3.straightLines.length == 0 && meshPoly3.loopLines.length == 1)
        //
        //        }
        return bilan;
    }
    mathis.testMameshModification = testMameshModification;
})(mathis || (mathis = {}));
