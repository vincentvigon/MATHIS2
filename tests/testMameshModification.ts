/**
 * Created by vigon on 22/02/2016.
 */




module mathis{


    import Merger = grateAndGlue.Merger;
    export function testMameshModification(mathisFrame:MathisFrame):Bilan{


        let bilan=new Bilan()



        /**test partial dichotomy, linkModule*/
        {
            let mamesh=new Mamesh()
            let creator=new creationFlat.SingleSquare(mamesh)
            creator.makeLinks=false
            creator.go()
            let dicho=new mameshModification.SquareDichotomer(mamesh)
            dicho.go()

            let dicho2=new mameshModification.SquareDichotomer(mamesh)
            dicho2.squareToCut=[mamesh.vertices[0],mamesh.vertices[4],mamesh.vertices[8],mamesh.vertices[7]]
            dicho2.go()

            let linkerCons=new linkModule.LinkCreatorSorterAndBorderDetectorByPolygons(mamesh)
            linkerCons.goChanging()

            mamesh.fillLineCatalogue()
            bilan.assertTrue(mamesh.allLinesAsASortedString()=='straightLines:["[0,12,7,3]","[0,9,4,1]","[1,5,2]","[10,13,12]","[2,6,3]","[4,10,8,6]","[5,8,11,7]","[9,13,11]"]')




            
            
        }



        /**idem */
        {
            let mamesh=new Mamesh()
            new creationFlat.SingleSquareWithOneDiag(mamesh).go()
            let dicho=new mameshModification.TriangleDichotomer(mamesh)
            dicho.trianglesToCut=[mamesh.vertices[0],mamesh.vertices[1],mamesh.vertices[3]]
            dicho.makeLinks=true
            dicho.go()

            let dicho2=new mameshModification.TriangleDichotomer(mamesh)
            dicho2.trianglesToCut=[mamesh.vertices[4],mamesh.vertices[5],mamesh.vertices[6]]
            dicho.makeLinks=true
            dicho2.go()

            new spacialTransformations.Similitude(mamesh.vertices,0.1).goChanging()

            mamesh.fillLineCatalogue()

            bilan.assertTrue(mamesh.allLinesAsASortedString()=='straightLines:["[0,4,1]","[0,6,3]","[1,2]","[1,5,3]","[2,3]","[4,7,5]","[4,9,6]","[5,8,6]","[7,8]","[7,9]","[8,9]"]')




        }




        /**idem*/
        {
            let mamesh=new Mamesh()
            let creator=new creationFlat.SingleSquare(mamesh)
            creator.makeLinks=false
            creator.go()
            let dicho=new mameshModification.SquareDichotomer(mamesh)

            dicho.go()

            let li=new linkModule.LinkCreatorSorterAndBorderDetectorByPolygons(mamesh)
            li.goChanging()




            mamesh.fillLineCatalogue()

            bilan.assertTrue(mamesh.allLinesAsASortedString()=='straightLines:["[0,4,1]","[0,7,3]","[1,5,2]","[2,6,3]","[4,8,6]","[5,8,7]"]')


        }






        /**idem*/
        {
            let mamesh=new Mamesh()
            new creationFlat.SingleSquareWithOneDiag(mamesh).go()
            let dicho=new mameshModification.TriangleDichotomer(mamesh)
            dicho.trianglesToCut=[mamesh.vertices[0],mamesh.vertices[1],mamesh.vertices[3]]
            dicho.makeLinks=true
            dicho.go()

            mamesh.clearLinksAndLines()
            new linkModule.LinkCreatorSorterAndBorderDetectorByPolygons(mamesh).goChanging()
            mamesh.fillLineCatalogue()


            bilan.assertTrue(mamesh.allLinesAsASortedString()=='straightLines:["[0,4,1]","[0,6,3]","[1,2]","[1,5,3]","[2,3]","[4,5]","[4,6]","[5,6]"]')



        }






        /**idem*/
        {
            let mamesh=new Mamesh()
            let creator=new creationFlat.SingleSquare(mamesh)
            creator.makeLinks=false
            creator.go()
            let dicho=new mameshModification.SquareDichotomer(mamesh)
            dicho.go()

            let dicho2=new mameshModification.SquareDichotomer(mamesh)
            dicho2.squareToCut=[mamesh.vertices[0],mamesh.vertices[4],mamesh.vertices[8],mamesh.vertices[7]]
            dicho2.go()

            new linkModule.LinkCreatorSorterAndBorderDetectorByPolygons(mamesh).goChanging()
            mamesh.fillLineCatalogue()

            bilan.assertTrue(mamesh.allLinesAsASortedString()=='straightLines:["[0,12,7,3]","[0,9,4,1]","[1,5,2]","[10,13,12]","[2,6,3]","[4,10,8,6]","[5,8,11,7]","[9,13,11]"]')

            // let liner=new visu3d.LinesViewer(IN_mamesh,mathisFrame.scene)
            // liner.interpolationOption=new geometry.InterpolationOption()
            // liner.interpolationOption.interpolationStyle=geometry.InterpolationStyle.octavioStyle
            // liner.goChanging()


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
            let cart= new reseau.Regular2d()
            cart.nbU=2
            cart.nbV=2
            cart.makeLinks=false
            let mamesh0=cart.go()
            new mameshModification.SquareDichotomer(mamesh0).go()
            new linkModule.LinkCreatorSorterAndBorderDetectorByPolygons(mamesh0).goChanging()


            let cart1= new reseau.Regular2d()
            cart1.nbU=2
            cart1.nbV=2
            let mamesh1=cart1.go()

            mamesh1.vertices.forEach(v=>{v.position.x+=1})

            new grateAndGlue.Merger(mamesh0,mamesh1,null).goChanging()
            //TODO bilan.assertTrue(mamesh0.toStringForTest1()=='0|links:(4)(7)1|links:(7)(6)2|links:(5)(4)(11)3|links:(6)(5)(12)4|links:(2,0)(8)(0,2)5|links:(3,2)(8)(2,3)6|links:(1,3)(8)(3,1)7|links:(0,1)(8)(1,0)8|links:(7,5)(4,6)(5,7)(6,4)11|links:(2)(12)12|links:(3)(11)tri:squa:[0,4,8,7][2,5,8,4][3,6,8,5][1,7,8,6][2,11,12,3]cutSegments{0,4,2}{2,5,3}{1,6,3}{0,7,1}')

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
            let mamesh:Mamesh =  new Mamesh()
            new creationFlat.SingleSquareWithOneDiag(mamesh).go()
            let dichotomer=new mameshModification.TriangleDichotomer(mamesh)
            dichotomer.makeLinks=true
            dichotomer.go()

            mamesh.fillLineCatalogue()

            let mamesh2:Mamesh =  new Mamesh()
            new creationFlat.SingleSquareWithOneDiag(mamesh2).go()
            let dichotomer2=new mameshModification.TriangleDichotomer(mamesh2)
            dichotomer2.makeLinks=false
            dichotomer2.go()

            new linkModule.LinkCreatorSorterAndBorderDetectorByPolygons(mamesh2).goChanging()
            mamesh2.fillLineCatalogue()

            bilan.assertTrue(mamesh.allLinesAsASortedString()==mamesh2.allLinesAsASortedString())

        }

        /**idem, also time comparison*/
        {
            let deltaTime0=0
            let deltaTime1=0
            let lines0=""
            let lines1=""
            {
                let time0=performance.now()

                let mamesh=new Mamesh()
                let maker=new reseau.SingleTriangle(mamesh)
                maker.go()


                let dichoter=new mameshModification.TriangleDichotomer(mamesh)
                dichoter.makeLinks=false
                dichoter.go()
                dichoter=new mameshModification.TriangleDichotomer(mamesh)
                dichoter.makeLinks=false
                dichoter.go()
                dichoter=new mameshModification.TriangleDichotomer(mamesh)
                dichoter.makeLinks=false
                dichoter.go()
                dichoter=new mameshModification.TriangleDichotomer(mamesh)
                dichoter.makeLinks=false
                dichoter.go()
                dichoter=new mameshModification.TriangleDichotomer(mamesh)
                dichoter.makeLinks=false
                dichoter.go()

                new linkModule.LinkCreatorSorterAndBorderDetectorByPolygons(mamesh).goChanging()

                deltaTime0=performance.now()-time0
                mamesh.fillLineCatalogue()

                lines0=mamesh.allLinesAsASortedString()

            }
            {
                let time0=performance.now()

                let mamesh=new Mamesh()
                let maker=new reseau.SingleTriangle(mamesh)
                maker.go()

                let dichoter=new mameshModification.TriangleDichotomer(mamesh)
                dichoter.makeLinks=true
                dichoter.go()
                dichoter=new mameshModification.TriangleDichotomer(mamesh)
                dichoter.makeLinks=true
                dichoter.go()
                dichoter=new mameshModification.TriangleDichotomer(mamesh)
                dichoter.makeLinks=true
                dichoter.go()
                dichoter=new mameshModification.TriangleDichotomer(mamesh)
                dichoter.makeLinks=true
                dichoter.go()
                dichoter=new mameshModification.TriangleDichotomer(mamesh)
                dichoter.makeLinks=true
                dichoter.go()


                deltaTime1=performance.now()-time0
                mamesh.fillLineCatalogue()
                lines1=mamesh.allLinesAsASortedString()

            }

            bilan.assertTrue(deltaTime0>deltaTime1)
            bilan.assertTrue(lines0==lines1)

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
            let mamesh=new reseau.TriangulatedPolygone(13).go()
            mamesh.fillLineCatalogue()
            bilan.assertTrue(mamesh.getStraightLines().length==26)
        }



        


        //        {
//            let meshPoly3 = mmc.createPolygone(3, true)
//            let mmm = new MameshManipulator(meshPoly3)
//            mmm.fillLineCatalogue()
//            bilan.assertTrue(meshPoly3.straightLines.length == 0 && meshPoly3.loopLines.length == 1)
//
//        }

        

        return bilan

    }


}