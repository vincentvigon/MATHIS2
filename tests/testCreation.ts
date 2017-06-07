/**
 * Created by vigon on 02/06/2016.
 */

module mathis{
    import checkTheRegularityOfAGraph = mathis.debug.checkTheRegularityOfAGraph;
    export function testCreation(mathisFrame:MathisFrame):Bilan {


        let bilan = new Bilan()


        //
        //
        // {
        //     let crea = new creation2D.Concentric(9,13)
        //     crea.nbPatches=1
        //     crea.shapes=[mathis.creation2D.PartShape.triangulatedRect]
        //     crea.percolationProba=[0.5]
        //     //crea.SUB_mameshCleaner.suppressLinkWithoutOppositeFunction=(v)=>(!v.isBorder())
        //
        //
        //     let mamesh=crea.goChanging()
        //
        //
        //
        //     mamesh.fillLineCatalogue()
        //
        //     new lineModule.CreateAColorIndexRespectingBifurcationsAndSymmetries(mamesh).goChanging()
        //
        //
        //     mamesh.fillLineCatalogue()
        //
        //     let liner=new visu3d.LinesViewer(mamesh,mathisFrame.scene)
        //     liner.interpolationOption=new geometry.InterpolationOption()
        //     liner.interpolationOption.interpolationStyle=geometry.InterpolationStyle.octavioStyle
        //     liner.goChanging()
        //
        //
        //
        // }
        //





        // {
        //     let crea = new creation2D.Concentric(13,13)
        //     crea.nbPatches=1
        //     crea.shapes=[mathis.creation2D.PartShape.polygon4]
        //     //crea.individualScales=[new UV(2,1)]
        //     //crea.SUB_mameshCleaner.suppressLinkWithoutOppositeFunction=null
        //     crea.SUB_mameshCleaner.suppressCellWithNoVoisin=false
        //     crea.percolationProba=[1]
        //     //crea.individualRotations=[Math.PI/4]
        //     crea.scalingBeforeOppositeLinkAssociations=new XYZ(1,0.3,0)
        //
        //     let mamesh=crea.goChanging()
        //
        //     mamesh.fillLineCatalogue()
        //
        //     new lineModule.CreateAColorIndexRespectingBifurcationsAndSymmetries(mamesh).goChanging()
        //
        //
        //
        //     mamesh.fillLineCatalogue()
        //
        //
        //     let liner=new visu3d.LinesViewer(mamesh,mathisFrame.scene)
        //     liner.interpolationOption=new geometry.InterpolationOption()
        //     liner.interpolationOption.interpolationStyle=geometry.InterpolationStyle.octavioStyle
        //     liner.goChanging()
        //
        // }
        // return bilan

        // {
        //
        //     let crea = new creation2D.Concentric(6,12)
        //     crea.nbPatches=1
        //     crea.shapes=[mathis.creation2D.PartShape.triangulatedRect]
        //     crea.percolationProba=[0.5]
        //     crea.SUB_mameshCleaner.suppressLinkWithoutOppositeFunction=v=>(!v.isBorder())
        //     crea.SUB_oppositeLinkAssocierByAngles.maxAngleToAssociateLinks=Math.PI*0.3
        //
        //     let mamesh=crea.goChanging()
        //
        //
        //     cc('OUT_nbVerticesSuppressed',crea.SUB_mameshCleaner.OUT_nbVerticesSuppressed)
        //
        //
        //     mamesh.fillLineCatalogue()
        //
        //
        //     let liner=new visu3d.LinesViewer(mamesh,mathisFrame.scene)
        //     liner.interpolationOption=new geometry.InterpolationOption()
        //     liner.interpolationOption.interpolationStyle=geometry.InterpolationStyle.octavioStyle
        //     liner.goChanging()
        //
        // }
        //
        // return bilan





        

        

        /** border and corner of triangulated rectangle */
        {

            let mamesh
            let aaa
            let test=(ni,nj,oneMoreOnOdd,corner=false)=>{
            let gene=new reseau.BasisForRegularReseau()
            gene.nbI=ni
            gene.nbJ=nj

            let crea = new reseau.Regular2d(gene)
                crea.oneMoreVertexForOddLine=oneMoreOnOdd

            crea.squareVersusTriangleMaille=false
                mamesh=crea.go()
            mamesh.fillLineCatalogue()

            aaa=[]
            for (let v of mamesh.vertices) {
                if (!corner&&v.isBorder()) aaa.push(v)
                else if (corner&& v.hasMark(Vertex.Markers.corner)) aaa.push(v)
            }

                return aaa.length
            }

            bilan.assertTrue(test(3,4,false)==10)
            bilan.assertTrue(test(4,4,false)==12)
            bilan.assertTrue(test(3,3,false)==8)
            bilan.assertTrue(test(3,4,true)==11)
            bilan.assertTrue(test(3,3,true)==8)



            bilan.assertTrue(test(3,4,false,true)==4)
            bilan.assertTrue(test(4,4,false,true)==4)
            bilan.assertTrue(test(3,3,false,true)==4)
            bilan.assertTrue(test(3,3,true,true)==4)
            bilan.assertTrue(test(3,4,true,true)==4)






        }








        // /**'chu*/
        // {
        //     let crea = new creation2D.Patchwork(6,6,2,2)
        //     crea.patchesInQuinconce=true
        //     crea.shapes = [mathis.creation2D.PartShape.square]
        //     crea.individualRotations=[0,Math.PI/4,0]
        //     crea.individualScales=[new UV(1.2,1.2)]
        //     crea.integerBeginToRound=[0]
        //     crea.integerEndToRound=[-2]
        //     bilan.assertTrue(crea.SUB_mameshCleaner.OUT_nbLinkSuppressed==1)
        //
        //     let mamesh=crea.go()
        //     mamesh.fillLineCatalogue()
        //     bilan.assertTrue(mamesh.allLinesAsASortedString()=='straightLines:["[1,7,13,19,25,31,55,56,57,58,59]","[12,13,14,15,16,17,98,99,100,101]","[140,134,128,122,116]","[18,19,20,21,22,23,116,117,118,119]","[2,8,14,20,26,43,44,45,46,47,140,141,142,143,137,131,125,119,101,95,89,83,77,76,75,74,73,72,78,4,10,16,22,28,45,51,57,63,69]","[24,25,26,27,28,121,122,123,124,125]","[24,25,26,27,28,127,128,129,130,131]","[3,9,15,21,27,43,49,55,61,67]","[53,52,51,50,49,31,30,24,18,12,6,0,1,2,3,4,85,86,87,88,89]","[6,7,8,9,10,91,92,93,94,95]","[60,66,67,68,69,70,71,65,59,53,47]","[65,64,63,62,61,60]","[68,62,56,50,44]","[69,63,57,51,45,127,128,129,130,131]","[70,64,58,52,46,133,127,121,23,17,91,85,79,73]","[70,64,58,52,46,133,134,135,136,137]","[74,80,86,92,98]","[75,81,87,93,99,117,123,129,135,141]","[76,82,88,94,100,118,124,130,136,142]","[83,82,81,80,79,78]"]')
        //
        //     let liner=new visu3d.LinesViewer(mamesh,mathisFrame.scene)
        //     liner.interpolationOption=new geometry.InterpolationOption()
        //     liner.interpolationOption.interpolationStyle=geometry.InterpolationStyle.octavioStyle
        //     liner.go()
        //
        // }
        // return bilan



        // /**'col' */
        // {
        //     let crea = new creation2D.Patchwork(7,7,3,3)
        //     crea.shapes = [mathis.creation2D.PartShape.square]
        //     crea.individualRotations=[Math.PI/3,-Math.PI/3]
        //     crea.integerBeginToRound=[0]
        //     crea.integerEndToRound=[-2]
        //
        //
        //     //crea.SUB_mameshCleaner.suppressLinkWithoutOppositeFunction=v=>(!v.hasMark(Vertex.Markers.border))
        //
        //     let IN_mamesh=crea.goChanging()
        //     IN_mamesh.fillLineCatalogue()
        //     cc(IN_mamesh.allLinesAsASortedString())
        //
        //     cc('suppp',crea.SUB_mameshCleaner.OUT_nbLinkSuppressed)
        //
        //
        //     new lineModule.CreateAColorIndexRespectingBifurcationsAndSymmetries(IN_mamesh).goChanging()
        //
        //     let liner=new visu3d.LinesViewer(IN_mamesh,mathisFrame.scene)
        //     liner.interpolationOption=new geometry.InterpolationOption()
        //     liner.interpolationOption.interpolationStyle=geometry.InterpolationStyle.octavioStyle
        //     liner.goChanging()
        //
        //
        //
        // }
        //
        // return bilan






        
        
        // /**prefab ans*/
        // {
        //
        //     let crea = new creation2D.Patchwork(6,6,3,3)
        //     crea.patchesInQuinconce=true
        //     crea.shapes = [mathis.creation2D.PartShape.square]
        //     crea.individualRotations=[0,Math.PI/4,0]
        //     crea.individualScales=[new UV(1.2,1.2)]
        //     crea.SUB_mameshCleaner.suppressLinkWithoutOppositeFunction=v=>(!v.hasMark(Vertex.Markers.border))
        //     //crea.SUB_oppositeLinkAssocierByAngles.suppressLinkWithoutOppositeForVertexWithValenceAtLeast5=true
        //
        //
        //     let mamesh=crea.go()
        //
        //
        //     mamesh.fillLineCatalogue()
        //
        //
        //     bilan.assertTrue(crea.SUB_mameshCleaner.OUT_nbLinkSuppressed==7)
        //     bilan.assertTrue(mamesh.lines.length==39)
        //     bilan.assertTrue(crea.SUB_oppositeLinkAssocierByAngles.OUT_nbBranching==10)
        //
        //
        //     //new lineModule.CreateAColorIndexRespectingBifurcationsAndSymmetries(IN_mamesh).goChanging()
        //
        //     let liner=new visu3d.LinesViewer(mamesh,mathisFrame.scene)
        //     liner.interpolationOption=new geometry.InterpolationOption()
        //     liner.interpolationOption.interpolationStyle=geometry.InterpolationStyle.octavioStyle
        //     liner.go()
        //
        // }





        // /**prefab gag*/
        // {
        //     let crea = new creation2D.Concentric(12,12)
        //     crea.nbPatches=2
        //     crea.shapes=[mathis.creation2D.PartShape.square,mathis.creation2D.PartShape.triangulatedTriangle]
        //     crea.proportions=[new UV(1,1),new UV(0.4,0.4)]
        //     crea.individualScales=[new UV(1,1),new UV(1.2,1.2)]
        //
        //     crea.SUB_mameshCleaner.suppressLinkWithoutOppositeFunction=v=>(!v.hasMark(Vertex.Markers.border))
        //
        //
        //
        //     let mamesh=crea.go()
        //     mamesh.fillLineCatalogue()
        //     bilan.assertTrue(mamesh.allLinesAsASortedString()=='straightLines:["[0,1,2,3,4,5,6,7,8,9,10,11]","[0,12,24,36,48,60,72,84,96,108,120,132]","[1,13,25,37,49,61,73,85,97,109,121,133]","[10,22,34,46,58,70,82,94,106,118,130,142]","[108,109,110,111,112,113,114,115,116,117,118,119]","[11,23,35,47,59,71,83,95,107,119,131,143]","[12,13,14,15,16,17,18,19,20,21,22,23]","[120,121,122,123,124,125,126,127,128,129,130,131]","[132,133,134,135,136,137,138,139,140,141,142,143]","[135,123,111,99,87,163,151,188,157,184,45,46,47]","[137,125,113,101,176,154,171,81,82,83]","[2,14,26,38,50,62,74,86,98,110,122,134]","[24,25,26,27,28,29,30,31,32,33,34,35]","[3,15,27,39,51,160,87,99,111,123,135]","[3,15,27,39,51,166,151,186,154,172,105,106,107]","[36,37,38,39,40,41,42,181,184,57,58,59]","[4,16,28,40,52,166,163,88,100,112,124,136]","[48,49,50,51,52,167,188,187,171,93,94,95]","[5,17,29,41,167,151,162,101,113,125,137]","[5,17,29,41,180,157,185,69,70,71]","[6,18,30,42,180,188,186,176,102,114,126,138]","[60,61,62,160,163,162,176,175,169,105,106,107]","[60,61,62,160,163,162,176,175,169,117,118,119]","[7,19,31,181,157,187,154,175,115,127,139]","[72,73,74,160,166,167,180,181,178,33,34,35]","[72,73,74,160,166,167,180,181,178,45,46,47]","[8,20,32,178,184,185,171,172,169,116,128,140]","[84,85,86,87,88,162,186,187,185,57,58,59]","[9,21,33,45,57,69,81,93,105,117,129,141]","[96,97,98,99,100,101,102,175,172,93,94,95]"]')
        //
        //     bilan.assertTrue(crea.SUB_mameshCleaner.OUT_nbLinkSuppressed==4)
        //
        //
        //         let liner=new visu3d.LinesViewer(mamesh,mathisFrame.scene)
        //         liner.interpolationOption=new geometry.InterpolationOption()
        //         liner.interpolationOption.interpolationStyle=geometry.InterpolationStyle.octavioStyle
        //         liner.go()
        //
        //
        // }
        //
        //
        // return bilan





        // {
        //
        //     let crea = new creation2D.Concentric(11,11)
        //
        //     crea.nbPatches=2
        //     crea.shapes=[mathis.creation2D.mathis.creation2D.PartShape.square]
        //     crea.proportions=[new UV(1,1),new UV(0.5,0.5)]
        //     crea.individualRotations=[0,Math.PI/4]
        //     crea.individualScales=[new UV(1,1),new UV(0.8,0.8)]
        //
        //     let IN_mamesh=crea.goChanging()
        //
        //     IN_mamesh.fillLineCatalogue()
        //
        //     new lineModule.CreateAColorIndexRespectingBifurcationsAndSymmetries(IN_mamesh).goChanging()
        //
        //     let liner=new visu3d.LinesViewer(IN_mamesh,mathisFrame.scene)
        //     liner.interpolationOption=new geometry.InterpolationOption()
        //     liner.interpolationOption.interpolationStyle=geometry.InterpolationStyle.octavioStyle
        //     liner.goChanging()
        //
        //
        //
        //
        //
        //
        // }
        //
        // return bilan
        
        
        {

            let crea = new reseau.TriangulatedPolygone(6)
            crea.nbSubdivisionInARadius=4

            let mamesh=crea.go()

            mamesh=new grateAndGlue.ExtractCentralPart(mamesh,1).go()
            mamesh.isolateMameshVerticesFromExteriorVertices()

            let nbBorder=0
            for (let v of mamesh.vertices) {
                if (v.hasMark(Vertex.Markers.border)) nbBorder++
            }

            bilan.assertTrue(nbBorder==18)

        }




        



        






        // /**test sur les symetries*/
        //
        // {
        //
        //     let gene=new reseau.BasisForRegularReseau()
        //     gene.nbI=4
        //     gene.nbJ=4
        //
        //     let crea = new reseau.Regular(gene)
        //
        //     let mamesh=crea.go()
        //     mamesh.fillLineCatalogue()
        //
        //
        //     //new spacialTransformations.Similitude(mamesh.vertices,Math.PI/4).goChanging()
        //
        //     let packer=new lineModule.CreateAColorIndexRespectingBifurcationsAndSymmetries(mamesh)
        //     packer.packSymmetricLines=true
        //     packer.symmetries=symmetries.squareMainSymmetries
        //     packer.forSymmetriesUsePositionVersusParam=true
        //     packer.useConsecutiveIntegerForPackNumber=true
        //     let lineToLevel=packer.go()
        //
        //
        //     bilan.assertTrue(packer.OUT_nbFoundSymmetricLines==4&&tab.maxValue(lineToLevel.allValues())==1)
        //
        //     console.log(packer.OUT_nbFoundSymmetricLines)
        //     let liner = new visu3d.LinesViewer(mamesh,mathisFrame.scene)
        //     liner.lineToLevel=lineToLevel
        //     liner.seedForRandomColor=34245
        //     liner.go()
        //
        //
        // }
        //
        //
        // console.log("AAAAAO")
        //
        //
        //
        // return bilan






        //
        //
        // /**choli*/
        // {
        //
        //     let crea = new creation2D.Concentric(7,7)
        //     crea.individualTranslation=[new XYZ(0,0,0),new XYZ(0.3,0,0)]
        //     crea.individualRotations=[0,Math.PI/4]
        //
        //     let mamesh=crea.go()
        //
        //     bilan.assertTrue(crea.SUB_oppositeLinkAssocierByAngles.OUT_nbBranching==3)
        //
        //     mamesh.fillLineCatalogue()
        //
        //     let packer=new lineModule.CreateAColorIndexRespectingBifurcationsAndSymmetries(mamesh)
        //     packer.packSymmetricLines=true
        //     packer.useConsecutiveIntegerForPackNumber=true
        //     let lineToLevel=packer.go()
        //
        //     bilan.assertTrue(packer.OUT_nbFoundSymmetricLines==6&&tab.maxValue(lineToLevel.allValues())==9) //cela pass  vite à 10 quand l'ago manque une fourche
        //
        //     // cc(packer.OUT_nbFoundSymmetricLines)
        //     // cc(tab.maxValue(lineToColor))
        //     //
        //     // let liner=new visu3d.LinesViewer(IN_mamesh,mathisFrame.scene)
        //     // liner.interpolationOption=new geometry.InterpolationOption()
        //     // liner.interpolationOption.interpolationStyle=geometry.InterpolationStyle.octavioStyle
        //     // liner.goChanging()
        //
        //
        //
        // }
        //




        {

            let crea= new reseau.Regular2d()
            let mamesh=crea.go()

            Vertex.separateTwoVoisins(mamesh.vertices[0],mamesh.vertices[1])

            mamesh.fillLineCatalogue()

            bilan.assertTrue(mamesh.allLinesAsASortedString()=='straightLines:["[0,3,6]","[1,2]","[1,4,7]","[2,5,8]","[3,4,5]","[6,7,8]"]')


        }



        /**here we test that, the sub IN_mamesh extractor take care of square*/
        {

            let crea = new reseau.Regular2d()
            crea.nbI=7
            crea.nbJ=7
            let mamesh=crea.go()


            let toKeep:Vertex[]=[]

            for (let i=0;i<mamesh.vertices.length;i++){ if (i!=11) toKeep.push(mamesh.vertices[i])}

            let suber=new grateAndGlue.SubMameshExtractor(mamesh,toKeep)
            suber.addBorderPolygonInsteadOfSuppress=true
            mamesh=suber.go()

            mamesh.isolateMameshVerticesFromExteriorVertices()

            mamesh.fillLineCatalogue()


            bilan.assertTrue(mamesh.allLinesAsASortedString()=='straightLines:["[0,1,2,3,4,5,6]","[0,7,14,21,28,35,42]","[1,8,15,22,29,36,43]","[14,15,16,17,18,19,20]","[2,9,16,23,30,37,44]","[21,22,23,24,25,26,27]","[28,29,30,31,32,33,34]","[3,10,17,24,31,38,45]","[35,36,37,38,39,40,41]","[4,11,18,25,32,39,46]","[42,43,44,45,46,47,48]","[5,12,19,26,33,40,47]","[6,13,20,27,34,41,48]","[7,8,9,10,11,12,13]"]')


            // let liner=new visu3d.LinesViewer(IN_mamesh,mathisFrame.scene)
            // liner.interpolationOption=new geometry.InterpolationOption()
            // liner.interpolationOption.interpolationStyle=geometry.InterpolationStyle.octavioStyle
            // liner.goChanging()
            //
            // let ver=new visu3d.VerticesViewer(IN_mamesh,mathisFrame.scene)
            // ver.goChanging()


        }


        /**here we test that, the sub IN_mamesh extractor take care of square*/
        {

            let crea = new reseau.Regular2d()
            crea.nbI=7
            crea.nbJ=7
            let mamesh=crea.go()


            let toKeep:Vertex[]=[]

            for (let i=0;i<mamesh.vertices.length;i++){ if (i!=11) toKeep.push(mamesh.vertices[i])}

            let suber=new grateAndGlue.SubMameshExtractor(mamesh,toKeep)
            mamesh=suber.go()

            mamesh.isolateMameshVerticesFromExteriorVertices()

            mamesh.fillLineCatalogue()

            bilan.assertTrue(mamesh.allLinesAsASortedString()=='straightLines:["[0,1,2,3]","[0,7,14,21,28,35,42]","[1,8,15,22,29,36,43]","[12,13]","[14,15,16,17,18,19,20]","[18,25,32,39,46]","[2,9,16,23,30,37,44]","[21,22,23,24,25,26,27]","[28,29,30,31,32,33,34]","[3,10,17,24,31,38,45]","[35,36,37,38,39,40,41]","[42,43,44,45,46,47,48]","[5,12,19,26,33,40,47]","[5,6]","[6,13,20,27,34,41,48]","[7,8,9,10]"]')


        }


        {

            let crea = new reseau.Regular2d()
            crea.nbI=7
            crea.nbJ=7
            let mamesh=crea.go()

            let supp=new grateAndGlue.ExtractCentralPart(mamesh,2)
            supp.suppressFromBorderVersusCorner=false
            mamesh=supp.go()

            mamesh.isolateMameshVerticesFromExteriorVertices()

            mamesh.fillLineCatalogue()
            bilan.assertTrue(mamesh.allLinesAsASortedString()=='straightLines:["[0,1,2]","[0,7,14,21,28,35,42]","[1,8,15,22,29,36,43]","[10,17,24,31,38]","[12,13,14,15,16,17,18]","[12,19,26]","[18,25,32]","[19,20,21,22,23,24,25]","[2,9,16,23,30,37,44]","[26,27,28,29,30,31,32]","[34,35,36,37,38]","[42,43,44]","[6,13,20,27,34]","[6,7,8,9,10]"]')

        }



        {

            let crea = new reseau.Regular2d()
            crea.nbI=5
            crea.nbJ=5
            let mamesh=crea.go()

            let supp=new grateAndGlue.ExtractCentralPart(mamesh,1)
            supp.suppressFromBorderVersusCorner=false
            mamesh=supp.go()

            mamesh.isolateMameshVerticesFromExteriorVertices()

            bilan.assertTrue(mamesh.allSquareAndTrianglesAsSortedString()=='square:["[0,5,6,1]","[1,6,7,2]","[10,15,16,11]","[11,16,17,12]","[12,17,18,13]","[15,20,21,16]","[16,21,22,17]","[4,9,10,5]","[5,10,11,6]","[6,11,12,7]","[7,12,13,8]","[9,14,15,10]"]triangle:[]')

        }



        {

            let crea = new reseau.TriangulatedTriangle()
            crea.nbSubdivisionInSide=3
            let mamesh=crea.go()


            let supp=new grateAndGlue.ExtractCentralPart(mamesh,1)
            supp.suppressFromBorderVersusCorner=false
            mamesh=supp.go()
            mamesh.isolateMameshVerticesFromExteriorVertices()



            mamesh.fillLineCatalogue()


            bilan.assertTrue(mamesh.allLinesAsASortedString()=='straightLines:["[0,4,2]","[0,7,1]","[1,10,2]","[3,0,8]","[3,4,10,11]","[3,5]","[5,2,9]","[5,4,7,6]","[6,1,11]","[6,8]","[8,7,10,9]","[9,11]"]')

            // let liner=new visu3d.LinesViewer(IN_mamesh,mathisFrame.scene)
            // liner.interpolationOption=new geometry.InterpolationOption()
            // liner.interpolationOption.interpolationStyle=geometry.InterpolationStyle.octavioStyle
            // liner.goChanging()
            //
            // let ver=new visu3d.VerticesViewer(IN_mamesh,mathisFrame.scene)
            // ver.goChanging()



        }








        // {
        //     let crea= new reseau.Regular()
        //     crea.nbI=4
        //     crea.nbJ=3
        //     let IN_mamesh=crea.goChanging()
        //
        //     let liner=new visu3d.LinesViewer(IN_mamesh,mathisFrame.scene)
        //     liner.interpolationOption=new geometry.InterpolationOption()
        //     liner.interpolationOption.interpolationStyle=geometry.InterpolationStyle.octavioStyle
        //     liner.goChanging()
        //
        //     cc(IN_mamesh.toString())
        //
        // }


        {

            let crea=new reseau.TriangulatedPolygone(3)
            let mamesh=crea.go()

            mamesh.vertices[0].setTwoOppositeLinks(mamesh.vertices[1],mamesh.vertices[3])

            let linkOp=new linkModule.OppositeLinkAssocierByAngles(mamesh.vertices)
            linkOp.clearAllExistingOppositeBefore=false
            linkOp.maxAngleToAssociateLinks=2*Math.PI*0.4
            linkOp.goChanging()

            mamesh.fillLineCatalogue()

            bilan.assertTrue(mamesh.allLinesAsASortedString()=='straightLines:["[0,2]","[1,0,3]"]|loopLines:["[1,2,3]"]')


        }




        {

            let crea=new reseau.TriangulatedPolygone(3)
            let mamesh=crea.go()

            mamesh.vertices[0].setTwoOppositeLinks(mamesh.vertices[2],mamesh.vertices[3])
            // IN_mamesh.vertices[0].setTwoOppositeLinks(IN_mamesh.vertices[1],IN_mamesh.vertices[2])
            // IN_mamesh.vertices[0].setTwoOppositeLinks(IN_mamesh.vertices[2],IN_mamesh.vertices[3])


            let linkOp=new linkModule.OppositeLinkAssocierByAngles(mamesh.vertices)
            linkOp.clearAllExistingOppositeBefore=false
            linkOp.maxAngleToAssociateLinks=2*Math.PI*0.4
            linkOp.goChanging()



            mamesh.fillLineCatalogue()

            bilan.assertTrue(mamesh.allLinesAsASortedString()=='straightLines:["[0,1]","[2,0,3]"]|loopLines:["[1,2,3]"]')

            // cc(IN_mamesh.allLinesAsASortedString())
            //
            //
            //     let liner=new visu3d.LinesViewer(IN_mamesh,mathisFrame.scene)
            //     liner.interpolationOption=new geometry.InterpolationOption()
            //     liner.interpolationOption.interpolationStyle=geometry.InterpolationStyle.octavioStyle
            //     liner.goChanging()


        }



        {

            let crea=new reseau.TriangulatedPolygone(5)
            let mamesh=crea.go()

            let linkOp=new linkModule.OppositeLinkAssocierByAngles(mamesh.vertices)
            linkOp.clearAllExistingOppositeBefore=true

            linkOp.goChanging()

            new mameshModification.MameshCleaner(mamesh).goChanging()


            mamesh.fillLineCatalogue()
            bilan.assertTrue(mamesh.allLinesAsASortedString()=='straightLines:["[1,0,4]","[1,2]","[1,5]","[2,0,5]","[2,3]","[3,0,5]","[3,4]","[4,5]"]')





        }





        {

            let crea=new reseau.TriangulatedPolygone(3)
            let mamesh=crea.go()

            new spacialTransformations.Similitude(mamesh.vertices,0.01).goChanging()

            let linkOp=new linkModule.OppositeLinkAssocierByAngles(mamesh.vertices)
            linkOp.clearAllExistingOppositeBefore=true
            linkOp.maxAngleToAssociateLinks=2*Math.PI*0.4
            linkOp.goChanging()

            mamesh.fillLineCatalogue()
            bilan.assertTrue(mamesh.allLinesAsASortedString()=='straightLines:["[1,0,2]","[1,0,3]"]|loopLines:["[1,2,3]"]')


        }






        {

            let gene=new reseau.BasisForRegularReseau()
            gene.nbI=3
            gene.nbJ=3

            let crea=new reseau.Regular2d(gene)
            let mamesh=crea.go()

            mamesh.vertices[4].setTwoOppositeLinks(mamesh.vertices[1],mamesh.vertices[5])
            mamesh.vertices[4].setTwoOppositeLinks(mamesh.vertices[1],mamesh.vertices[3])

            mamesh.fillLineCatalogue()

            bilan.assertTrue(mamesh.allLinesAsASortedString()=='straightLines:["[0,1,2]","[0,3,6]","[1,4,3]","[1,4,5]","[1,4,7]","[2,5,8]","[3,4,5]","[6,7,8]"]')


        }




        {

            let crea=new reseau.TriangulatedPolygone(3)
            let mamesh=crea.go()

            mamesh.vertices[0].setTwoOppositeLinks(mamesh.vertices[3],mamesh.vertices[1])
            mamesh.vertices[0].setTwoOppositeLinks(mamesh.vertices[1],mamesh.vertices[2])
            mamesh.vertices[0].setTwoOppositeLinks(mamesh.vertices[2],mamesh.vertices[3])



            mamesh.fillLineCatalogue()
            bilan.assertTrue(mamesh.allLinesAsASortedString()=='straightLines:["[1,0,2]","[1,0,3]","[1,2]","[1,3]","[2,0,3]","[2,3]"]')

            //bilan.assertTrue(IN_mamesh.allLinesAsASortedString()=='straightLines:["[0,1,2]","[0,3,6]","[1,4,3]","[1,4,5]","[1,4,7]","[2,5,8]","[6,7,8]"]')


        }




        {

            let gene=new reseau.BasisForRegularReseau()
            gene.nbI=3
            gene.nbJ=3

            let crea=new reseau.Regular2d(gene)
            let mamesh=crea.go()

            mamesh.vertices[4].setTwoOppositeLinks(mamesh.vertices[1],mamesh.vertices[5])
            mamesh.vertices[4].setTwoOppositeLinks(mamesh.vertices[1],mamesh.vertices[3])

            mamesh.vertices[4].setTwoOppositeLinks(mamesh.vertices[7],mamesh.vertices[5])
            mamesh.vertices[4].setTwoOppositeLinks(mamesh.vertices[7],mamesh.vertices[3])

            mamesh.fillLineCatalogue()

            bilan.assertTrue(mamesh.allLinesAsASortedString()=='straightLines:["[0,1,2]","[0,3,6]","[1,4,3]","[1,4,5]","[1,4,7]","[2,5,8]","[3,4,5]","[3,4,7]","[5,4,7]","[6,7,8]"]')



        }





        {

            let gene=new reseau.BasisForRegularReseau()
            gene.nbI=3
            gene.nbJ=3

            let crea=new reseau.Regular2d(gene)
            let mamesh=crea.go()

            mamesh.vertices[4].setTwoOppositeLinks(mamesh.vertices[7],mamesh.vertices[5])
            mamesh.vertices[4].setTwoOppositeLinks(mamesh.vertices[7],mamesh.vertices[3])


            mamesh.fillLineCatalogue()

            bilan.assertTrue(mamesh.allLinesAsASortedString()=='straightLines:["[0,1,2]","[0,3,6]","[1,4,7]","[2,5,8]","[3,4,5]","[3,4,7]","[5,4,7]","[6,7,8]"]')




        }






        {
                let mamesh = new Mamesh()
                new creationFlat.SingleSquareWithOneDiag(mamesh).go()

                //new mameshModification.TriangleDichotomer(IN_mamesh).goChanging()

                let v0=mamesh.vertices[0]
                let v1=mamesh.vertices[1]
                let v2=mamesh.vertices[2]
                let v3=mamesh.vertices[3]

                v0.setTwoOppositeLinks(v1,v3)
                v1.setTwoOppositeLinks(v2,v0)
                v2.setTwoOppositeLinks(v3,v1)
                v3.setTwoOppositeLinks(v0,v2)

                mamesh.fillLineCatalogue()


            bilan.assertTrue(mamesh.allLinesAsASortedString()=='straightLines:["[1,3]"]|loopLines:["[0,1,2,3]"]')



            }




        //
        // {
        //
        //     let crea=new creation2D.Concentric(6,6)
        //
        //     crea.nbPatches = 3
        //     crea.shapes = [mathis.creation2D.PartShape.square]
        //     crea.proportions = [new UV(1, 1)]
        //     crea.SUB_gratAndStick.proximityCoefToStick=[2]
        //     crea.SUB_gratAndStick.SUB_grater.proportionOfSeeds=[0.09]
        //     let angle = [0, Math.PI / 3, -Math.PI / 3]
        //     crea.individualRotations = angle
        //     let rad = 0.5
        //     crea.individualTranslation = [new XYZ(Math.cos(angle[0]) + 1, Math.sin(angle[0]), 0).scale(rad), new XYZ(Math.cos(angle[1]), Math.sin(angle[1]), 0).scale(rad), new XYZ(Math.cos(angle[2]), Math.sin(angle[2]), 0).scale(rad)]
        //
        //     let mamesh=crea.go()
        //
        //
        //     mamesh.fillLineCatalogue()
        //     bilan.assertTrue(mamesh.allLinesAsASortedString()=='straightLines:["[11,12,13,14,15,16]","[17,18,19,20,21,22]","[23,17,11,5,83,77,71,65]","[23,24,25,26,27,28]","[24,18,12,6,0,91,92,54,48,42,36,30]","[25,19,13,7,1,91,85,79,73,67]","[26,20,14,8,2,56,50,44,38,32]","[27,21,15,9,3,56,55,54,87,81,75,69]","[28,22,16,10,52,46,40,34]","[29,30,31,32,33,34]","[29,35,41,47,88,82,76,70]","[31,37,43,49,55,92,86,80,74,68]","[33,39,45,51,3,2,1,0,84,78,72,66]","[35,36,37,38,39,40]","[41,42,43,44,45,46]","[47,48,49,50,51,52]","[5,6,7,8,9,10]","[70,69,68,67,66,65]","[76,75,74,73,72,71]","[82,81,80,79,78,77]","[88,87,86,85,84,83]"]')
        //
        //     //     let vertexVisu=new visu3d.VerticesViewer(null,mathisFrame.scene)
        //     //     vertexVisu.selectedVertices=crea.SUB_gratAndStick.SUB_grater.OUTAllSeeds
        //     //     vertexVisu.goChanging()
        //     //
        //     // let liner=new visu3d.LinesViewer(IN_mamesh,mathisFrame.scene)
        //     // liner.interpolationOption=new geometry.InterpolationOption()
        //     // liner.interpolationOption.interpolationStyle=geometry.InterpolationStyle.octavioStyle
        //     // liner.goChanging()
        // }













        // {
        //
        //
        //     let crea=new creation2D.Patchwork(7,7,2,1)
        //
        //     crea.shapes = [mathis.creation2D.PartShape.square]
        //     crea.individualRotations=[Math.PI/4]
        //
        //     let IN_mamesh=crea.goChanging()
        //
        //     IN_mamesh.fillLineCatalogue()
        //
        //
        //     let liner=new visu3d.LinesViewer(IN_mamesh,mathisFrame.scene)
        //     liner.interpolationOption=new geometry.InterpolationOption()
        //     liner.interpolationOption.interpolationStyle=geometry.InterpolationStyle.octavioStyle
        //     liner.goChanging()
        //
        //     let vertexVisu=new visu3d.VerticesViewer(null,mathisFrame.scene)
        //     vertexVisu.selectedVertices=crea.SUB_gratAndStick.SUB_grater.OUTAllSeeds
        //     vertexVisu.goChanging()
        //
        //
        //
        // }




        // {
        //     let gene=new reseau.BasisForRegularReseau()
        //     gene.nbI=5
        //     gene.nbJ=5
        //
        //
        //     let crea=new reseau.Regular(gene)
        //     let IN_mamesh=crea.goChanging()
        //
        //
        //     let lineFiller=new mameshAroundComputations.LineComputer(IN_mamesh)
        //     lineFiller.computeAllLinesVersusInnerLines=false
        //     lineFiller.selectLineSpacing=1
        //     lineFiller.goChanging()
        //
        //
        //
        //     let liner=new visu3d.LinesViewer(IN_mamesh,mathisFrame.scene)
        //     liner.interpolationOption=new geometry.InterpolationOption()
        //     liner.interpolationOption.interpolationStyle=geometry.InterpolationStyle.octavioStyle
        //     liner.goChanging()
        //
        //
        // }
        //
        // return bilan


        // /**un blason*/
        // {
        //
        //     let crea=new creation2D.Concentric(8,8)
        //     crea.nbPatches=1
        //     crea.shapes=[mathis.creation2D.PartShape.polygon3]
        //     crea.propBeginToRound=[0]
        //     crea.propEndToRound=[1]
        //     crea.exponentOfRoundingFunction=[0.5]
        //     crea.SUB_gratAndStick.SUB_grater.proportionOfSeeds=[0.2]
        //     crea.SUB_oppositeLinkAssocierByAngles.canCreateBifurcations=true
        //     crea.SUB_mameshCleaner.suppressLinkWithoutOppositeFunction=null
        //
        //     let IN_mamesh=crea.goChanging()
        //
        //
        //     IN_mamesh.fillLineCatalogue()
        //     bilan.assertTrue(IN_mamesh.allLinesAsASortedString()=='straightLines:["[0,10,4,15,1]","[0,12,6,16,2]","[0,20,8,23,3]","[1,13,5,18,2]","[1,30,9,27,3]","[10,12]","[10,20]","[11,10,26]","[11,12,19,24,25]","[12,20]","[13,15,30]","[15,14,17]","[15,29,28]","[16,22,24,23]","[18,16,21]","[2,21,7,25,3]","[21,22,19,20,26]","[25,23,27]","[4,11,17,18]","[4,26,28,27]","[5,14,4,29,9]","[5,17,16]","[6,11,14,13]","[6,19,8]","[7,22,6,17]","[7,24,8,28]","[8,26,29,30]","[9,28,23]"]')
        //
        //
        //
        //
        //
        // }





        
        //
        // /**a funny miro shape*/
        // {
        //     let crea=new creation2D.Patchwork(7,7,2,2)
        //     crea.shapes=[mathis.creation2D.PartShape.polygon4]
        //     crea.individualScales=[new UV(1.2,1.2)]
        //     crea.patchesInQuinconce=true
        //     crea.oddPatchLinesAreTheSameVersusLongerVersusShorter=2
        //     crea.integerBeginToRound=[1]
        //     crea.integerEndToRound=[-1]
        //     crea.SUB_gratAndStick.SUB_grater.proportionOfSeeds=[0.2]
        //     crea.SUB_oppositeLinkAssocierByAngles.canCreateBifurcations=false
        //
        //     let mamesh=crea.go()
        //
        //     mamesh.fillLineCatalogue()
        //     bilan.assertTrue(mamesh.allLinesAsASortedString()=='straightLines:["[100,23,76,416,303,335,245,168,221]","[101,102,97,72,71,74,247,242,217,216,219,192]","[101,125,123,41,42,48,270,268,186,187,193,192]","[101,30,98,0,43,15,47,243,145,188,160,192]","[125,30,102]","[126,13,45]","[190,158,271]","[191,158,186,145,217,168,220]","[191,190,187,188,216,221,220,338,305,364]","[191,271,268,243,242,245,220]","[193,160,219]","[270,47,247,336,416,413,388,387,390,365]","[365,313,362,290,331,303]","[390,313,366]","[391,320,388,290,333,305,337]","[391,392,387,362,361,364,337]","[391,415,413,331,332,338,337]","[46,126,123,98,97,100,75,415,320,392]","[46,13,41,0,72,23,75]","[46,45,42,43,71,76,75]","[48,15,74,336,335,332,333,361,366,365]"]')
        //
        //
        //
        //
        // }




        //
        // /**trois carrés*/
        // {
        //     let crea=new creation2D.Patchwork(7,7,2,2)
        //     crea.shapes=[mathis.creation2D.PartShape.polygon4]
        //     crea.individualScales=[new UV(1.2,1.2)]
        //     crea.patchesInQuinconce=true
        //     crea.oddPatchLinesAreTheSameVersusLongerVersusShorter=2
        //
        //     crea.SUB_gratAndStick.SUB_grater.proportionOfSeeds=[0.2]
        //     crea.SUB_oppositeLinkAssocierByAngles.canCreateBifurcations=false
        //     crea.SUB_mameshCleaner.suppressLinkWithoutOppositeFunction=null
        //     let mamesh=crea.go()
        //
        //     mamesh.fillLineCatalogue()
        //     bilan.assertTrue(mamesh.allLinesAsASortedString()=='straightLines:["[100,23,76]","[101,102,100,75,415,320,392]","[101,125,126,46]","[101,30,98,0,43,15,175,243,145,188,160,192]","[102,97,72,71,74,247,242,217,216,219]","[125,123,41,42,48,270,268,186,187,193]","[125,30,102]","[126,123,98,97,100]","[126,13,45]","[13,42,15]","[158,268,175]","[160,187,158]","[160,216,168]","[168,242,175]","[186,243]","[188,186]","[188,217]","[190,158,271]","[190,187,188,216,221]","[191,158,186,145,217,168,220]","[191,271,270,175,247,336,416,415,391]","[192,193,190,191]","[192,219,221,220,338,305,364]","[193,160,219]","[217,243]","[220,245,247]","[221,168,245]","[23,71,15]","[271,268,243,242,245,335,332,333,361,366]","[30,123,13]","[30,97,23]","[305,332,303]","[313,361,305]","[313,387,320]","[320,413,303]","[333,331]","[362,333]","[362,388]","[365,313,362,290,331,303,336]","[365,366,364,337]","[365,390,392,391]","[388,331]","[390,313,366]","[391,320,388,290,333,305,337]","[392,387,362,361,364]","[41,43]","[415,413,331,332,338]","[416,303,335]","[45,42,43,71,76,416,413,388,387,390]","[46,13,41,0,72,23,75]","[46,45,48,15,74,336,335,338,337]","[72,43]","[75,76,74]","[98,41]","[98,72]"]')
        //
        //     //
        //     // let liner=new visu3d.LinesViewer(IN_mamesh,mathisFrame.scene)
        //     // liner.interpolationOption=new geometry.InterpolationOption()
        //     // liner.interpolationOption.interpolationStyle=geometry.InterpolationStyle.octavioStyle
        //     // liner.goChanging()
        //
        //     // cc(IN_mamesh.allLinesAsASortedString())
        //     // let liner=new visu3d.LinesViewer(IN_mamesh,mathisFrame.scene)
        //     // liner.interpolationOption=new geometry.InterpolationOption()
        //     // liner.interpolationOption.interpolationStyle=geometry.InterpolationStyle.octavioStyle
        //     // liner.goChanging()
        //
        //
        // }


        {
            let crea=new creation2D.Patchwork(7,7,2,2)
            crea.shapes=[mathis.creation2D.PartShape.polygon4]
            crea.individualScales=[new UV(1.0,1.0)]

            crea.SUB_gratAndStick.SUB_grater.proportionOfSeeds=[0.2]
            let mamesh=crea.go()
            
            let OUTAllSeeds=[]
            for (let seeds of crea.SUB_gratAndStick.SUB_grater.OUT_allSeeds) OUTAllSeeds=OUTAllSeeds.concat(seeds)
            
            

            bilan.assertTrue(OUTAllSeeds.length==36)

        }

        //
        //
        // /**4 carrés*/
        // {
        //     let crea=new creation2D.Patchwork(4,4,2,2)
        //     crea.shapes=[mathis.creation2D.PartShape.polygon4]
        //     crea.individualScales=[new UV(1.0,1.0)]
        //
        //     crea.SUB_gratAndStick.SUB_grater.seedComputedFromBarycentersVersusFromAllPossibleCells=false
        //     let mamesh=crea.go()
        //
        //
        //     let OUTAllSeeds=[]
        //     for (let seeds of crea.SUB_gratAndStick.SUB_grater.OUT_allSeeds) OUTAllSeeds=OUTAllSeeds.concat(seeds)
        //
        //     bilan.assertTrue(OUTAllSeeds.length==44)
        //
        //     mamesh.fillLineCatalogue()
        //     bilan.assertTrue(mamesh.allLinesAsASortedString()=='straightLines:["[1,12,4]","[1,5,0,9,3,31,26,35,29]","[1,6,2,23,16,45,41]","[10,11,12]","[14,18,13,22,16,44,39,48,42]","[14,19,15]","[14,25,2,8,3,38,30]","[15,21,16,51,28,34,29]","[19,18,25]","[19,20,21]","[21,22,23]","[23,24,25]","[29,36,30]","[30,37,26,33,28,50,39,46,41]","[32,31,38]","[32,33,34]","[34,35,36]","[36,37,38]","[4,10,3,32,28,49,42]","[4,11,0,7,2,24,13,20,15]","[41,47,42]","[45,44,51]","[45,46,47]","[47,48,49]","[49,50,51]","[6,5,12]","[6,7,8]","[8,9,10]"]')
        //
        //     // cc(IN_mamesh.allLinesAsASortedString())
        //     // let liner=new visu3d.LinesViewer(IN_mamesh,mathisFrame.scene)
        //     // liner.interpolationOption=new geometry.InterpolationOption()
        //     // liner.interpolationOption.interpolationStyle=geometry.InterpolationStyle.octavioStyle
        //     // liner.goChanging()
        //
        //
        // }



        /**to check the suppression of overlpaing seeds */
        {
            let crea=new creation2D.Patchwork(4,4,2,2)
            crea.shapes=[mathis.creation2D.PartShape.polygon4]
            crea.individualScales=[new UV(1.01,1.01)]

            crea.SUB_gratAndStick.SUB_grater.proportionOfSeeds=[0.5]
            let mamesh=crea.go()

            bilan.assertTrue(mamesh.vertices.length==48)

        }




        {
            let crea=new creation2D.Concentric(11,11)
            crea.nbPatches=2
            crea.shapes=[mathis.creation2D.PartShape.polygon6,mathis.creation2D.PartShape.square]
            crea.proportions=[new UV(1,1),new UV(0.5,0.5)]
            crea.integerBeginToRound=[1]
            crea.integerEndToRound=[-2]


            crea.SUB_gratAndStick.SUB_grater.proportionOfSeeds=[0.1]
            crea.SUB_gratAndStick.SUB_grater.asymmetriesForSeeds=[{direction:new XYZ(0,1,0),influence:0.5,modulo:Math.PI/2},{direction:new XYZ(1,0,0),influence:0.5}]
            crea.SUB_gratAndStick.SUB_grater.seedComputedFromBarycentersVersusFromAllPossibleCells=true
            
            let mamesh=crea.go()


        }



        // {
        //
        //     let crea=new creation2D.Concentric(7,7)
        //     crea.nbPatches=2
        //     crea.shapes=[mathis.creation2D.PartShape.square,mathis.creation2D.PartShape.triangulatedTriangle]
        //     crea.proportions=[new UV(1,1),new UV(0.5,0.5)]
        //     let IN_mamesh=crea.goChanging()
        //
        //     IN_mamesh.fillLineCatalogue()
        //     bilan.assertTrue(IN_mamesh.allLinesAsASortedString()=='straightLines:["[0,1,2,3,4,5,6]","[0,7,14,21,28,35,42]","[1,8,15,22,29,36,43]","[10,61,63]","[11,51,63,53,58,50,39]","[14,15,16,54,62,53]","[2,9,16,57,55,30,37,44]","[21,22]","[28,29,30,52,59,53]","[3,10,54,56,52,38,45]","[35,36,37,38,39,40,41]","[38,60,58]","[4,11,61,62,59,60,39,46]","[42,43,44,45,46,47,48]","[47,40,50,60,52,55]","[48,41]","[5,12,51,61,54,57]","[58,59,56,57]","[6,13]","[63,62,56,55]","[7,8,9,10,11,12,13]"]')
        //
        //
        //     cc(IN_mamesh.allLinesAsASortedString())
        //     let liner=new visu3d.LinesViewer(IN_mamesh,mathisFrame.scene)
        //     liner.interpolationOption=new geometry.InterpolationOption()
        //     liner.interpolationOption.interpolationStyle=geometry.InterpolationStyle.octavioStyle
        //     liner.goChanging()
        //
        // }
        




        {

            let poly=new reseau.TriangulatedTriangle()
            poly.nbSubdivisionInSide=5
            let mamesh=poly.go()
            mamesh.fillLineCatalogue()

            bilan.assertTrue(mamesh.allLinesAsASortedString()=='straightLines:["[11,0,16]","[11,35,36,34]","[12,0,37,6,33]","[12,15]","[15,0,35,3,21]","[16,37,36,20]","[18,21,20,34,33,27]","[20,3,25]","[21,24]","[24,3,36,6,30]","[25,35,37,29]","[29,6,34]","[30,33]","[9,12,11,25,24,18]","[9,15,16,29,30,27]"]')



        }


        //return bilan





        {
            let poly=new reseau.TriangulatedPolygone(5)
            poly.nbSubdivisionInARadius=3
            let mamesh=poly.go()
            mamesh.fillLineCatalogue()
            bilan.assertTrue(mamesh.allLinesAsASortedString()=='straightLines:["[0,108,33,111]","[0,134,40,137]","[0,51,16,56]","[0,53,18,57]","[0,82,26,85]","[110,107,108,134,159,162]","[111,136,138,137]","[112,33,133,40,161]","[55,16,159,40,138]","[55,52,53,82,107,112]","[56,162,161,137]","[56,55,58,57]","[57,84,86,85]","[58,18,81,26,110]","[58,52,51,134,133,136]","[84,18,52,16,162]","[84,81,82,108,133,138]","[85,110,112,111]","[86,26,107,33,136]","[86,81,53,51,159,161]"]')


            // let liner=new visu3d.LinesViewer(IN_mamesh,mathisFrame.scene)
            // liner.interpolationOption=new geometry.InterpolationOption()
            // liner.interpolationOption.interpolationStyle=geometry.InterpolationStyle.octavioStyle
            // liner.goChanging()

            // let liner=new visu3d.LinesViewer(IN_mamesh,mathisFrame.scene)
            // liner.interpolationOption=new geometry.InterpolationOption()
            // liner.interpolationOption.interpolationStyle=geometry.InterpolationStyle.octavioStyle
            // liner.goChanging()

        }


        //return bilan



        // {
        //
        //     let poly=new reseau.TriangulatedPolygone(9)
        //     poly.nbSubdivisionsInARadius=3
        //     let mamesh=poly.goChanging()
        //
        //     let rounder=new spacialTransformations.RoundSomeStrates(mamesh)
        //
        //     rounder.integerBeginToRound=1
        //     rounder.integerEndToRound=-1
        //
        //     rounder.exponentOfRoundingFunction=1
        //     rounder.referenceRadiusIsMinVersusMaxVersusMean=2
        //     rounder.preventStratesCrossings=true
        //     rounder.goChanging()
        //
        //
        //     mamesh.clearOppositeInLinks()
        //
        //
        //     let asso=new linkModule.OppositeLinkAssocierByAngles(mamesh.vertices)
        //     asso.canCreateBifurcations=false
        //     asso.goChanging()
        //
        //     new mameshModification.MameshCleaner(mamesh).goChanging()
        //
        //
        //     let lineFill=new lineModule.LineComputer(mamesh)
        //     lineFill.lookAtBifurcation=false
        //     lineFill.goChanging()
        //
        //     bilan.assertTrue(mamesh.allLinesAsASortedString()=='straightLines:["[0,122,38,125]","[124,121,122,148,173,178]","[126,121,93,91,303,305]","[150,147,148,174,199,204]","[151,45,148,0,252,73,255]","[176,173,174,200,225,230]","[177,52,174,0,278,80,281]","[202,199,200,226,251,256]","[228,225,226,252,277,282]","[254,251,252,278,303,306]","[28,306]","[28,95]","[30,124]","[30,98]","[38,126]","[38,150]","[45,152]","[45,176]","[52,178]","[52,202]","[59,204]","[59,228]","[66,230]","[66,254]","[73,256]","[73,280]","[80,282]","[80,305]","[95,92,93,122,147,152]","[96,28,91,0,200,59,203]","[97,30,93,0,226,66,229]","[98,92,91,278,277,280]"]|loopLines:["[28,92,30,121,38,147,45,173,52,199,59,225,66,251,73,277,80,303]","[95,96,306,305,281,282,280,255,256,254,229,230,228,203,204,202,177,178,176,151,152,150,125,126,124,97,98]"]')
        //     //bilan.assertTrue(IN_mamesh.allLinesAsASortedString()=='straightLines:["[0,252,73,255]","[124,121,122,148,173,178]","[125,38,122,0,226,66,229]","[126,121,93,91,303,305]","[150,147,148,174,199,204]","[151,45,148,0,278,80,281]","[176,173,174,200,225,230]","[202,199,200,226,251,256]","[228,225,226,252,277,282]","[254,251,252,278,303,306]","[28,306]","[28,95]","[30,124]","[30,98]","[38,126]","[38,150]","[45,152]","[45,176]","[52,178]","[52,202]","[59,204]","[59,228]","[66,230]","[66,254]","[73,256]","[73,280]","[80,282]","[80,305]","[95,92,93,122,147,152]","[96,28,91,0,174,52,177]","[97,30,93,0,200,59,203]","[98,92,91,278,277,280]"]|loopLines:["[28,92,30,121,38,147,45,173,52,199,59,225,66,251,73,277,80,303]","[95,96,306,305,281,282,280,255,256,254,229,230,228,203,204,202,177,178,176,151,152,150,125,126,124,97,98]"]')
        //
        //     // cc(IN_mamesh.allLinesAsASortedString())
        //     let liner=new visu3d.LinesViewer(IN_mamesh,mathisFrame.scene)
        //     liner.interpolationOption=new geometry.InterpolationOption()
        //     liner.interpolationOption.interpolationStyle=geometry.InterpolationStyle.octavioStyle
        //     liner.goChanging()
        //
        //
        // }




        // {
        //
        //     let poly=new reseau.TriangulatedPolygone(9)
        //     poly.nbSubdivisionsInARadius=3
        //     let IN_mamesh=poly.goChanging()
        //
        //     let rounder=new spacialTransformations.RoundSomeStrates(IN_mamesh)
        //
        //     rounder.integerBeginToRound=1
        //     rounder.integerEndToRound=-1
        //
        //     rounder.exponentOfRoundingFunction=1
        //     rounder.referenceRadiusIsMinVersusMaxVersusMean=2
        //     rounder.preventStratesCrossings=true
        //     rounder.goChanging()
        //
        //     IN_mamesh.clearOppositeInLinks()
        //
        //     let asso=new linkModule.OppositeLinkAssocierByAngles(IN_mamesh.vertices)
        //     asso.goChanging()
        //
        //     IN_mamesh.fillLineCatalogue()
        //
        //
        //     bilan.assertTrue(IN_mamesh.allLinesAsASortedString()=='straightLines:["[0,122,38,125]","[124,121,122,148,173,178]","[126,121,93,91,303,305]","[150,147,148,174,199,204]","[151,45,148,0,252,73,255]","[151,45,148,0,278,80,281]","[176,173,174,200,225,230]","[202,199,200,226,251,256]","[228,225,226,252,277,282]","[254,251,252,278,303,306]","[28,306]","[28,95]","[30,124]","[30,98]","[38,126]","[38,150]","[45,152]","[45,176]","[52,178]","[52,202]","[59,204]","[59,228]","[66,230]","[66,254]","[73,256]","[73,280]","[80,282]","[80,305]","[95,92,93,122,147,152]","[96,28,91,0,174,52,177]","[96,28,91,0,200,59,203]","[97,30,93,0,226,66,229]","[98,92,91,278,277,280]"]|loopLines:["[28,92,30,121,38,147,45,173,52,199,59,225,66,251,73,277,80,303]","[95,96,306,305,281,282,280,255,256,254,229,230,228,203,204,202,177,178,176,151,152,150,125,126,124,97,98]"]')
        //
        //
        //     cc(IN_mamesh.allLinesAsASortedString())
        //     let liner=new visu3d.LinesViewer(IN_mamesh,mathisFrame.scene)
        //     liner.interpolationOption=new geometry.InterpolationOption()
        //     liner.interpolationOption.interpolationStyle=geometry.InterpolationStyle.octavioStyle
        //     liner.goChanging()
        //
        //
        // }











        // {
        //     let structureDescription = new creation2D.Concentric(9,9)
        //     structureDescription.nbPatches=1
        //     structureDescription.shapes=[mathis.creation2D.mathis.creation2D.PartShape.square]
        //     structureDescription.individualRotations=[Math.PI/4,0]
        //     structureDescription.proportions=[new UV(1,1),new UV(0.3,1)]
        //     //structureDescription.individualTranslation=[new XYZ(0,0,0),new XYZ(1.5,0,0)]
        //     //structureDescription.individualScales=[new UV(1,1),new UV(0.8,0.8)]
        //     // let rad=0.5
        //     // structureDescription.individualTranslation=[new XYZ(Math.cos(angle[0])+1,Math.sin(angle[0]),0).scale(rad),new XYZ(Math.cos(angle[1]),Math.sin(angle[1]),0).scale(rad),new XYZ(Math.cos(angle[2]),Math.sin(angle[2]),0).scale(rad)]
        //
        //     //structureDescription.individualTranslation=[new XYZ(1,0,0),new XYZ(-1,0,0)]
        //
        //
        //     let IN_mamesh=structureDescription.goChanging()
        //     cc(structureDescription.OUTComputedSize)
        //
        //     let liner=new visu3d.LinesViewer(IN_mamesh,mathisFrame.scene)
        //     liner.interpolationOption=new geometry.InterpolationOption()
        //     liner.interpolationOption.interpolationStyle=geometry.InterpolationStyle.octavioStyle
        //     liner.goChanging()
        //
        //     let vertexer=new visu3d.VerticesViewer(IN_mamesh,mathisFrame.scene)
        //     vertexer.goChanging()
        //
        // }



        {
            let poly=new reseau.TriangulatedPolygone(4)
            poly.nbSubdivisionInARadius=4
            let mamesh=poly.go()
            mamesh.fillLineCatalogue()

            
            bilan.assertTrue(mamesh.allLinesAsASortedString()=='straightLines:["[1,16,6,21,2]","[1,18,5,13,0,23,9,26,3]","[1,40,12,37,4]","[16,17,14,15,23,29,34,35]","[16,18,39,38,33,35]","[2,19,7,15,0,30,11,33,4]","[2,24,8,28,3]","[21,19,25,27,26,31]","[21,20,14,13,30,29,32,31]","[24,19,20,17,18,40]","[24,25,22,23,30,36,39,40]","[28,26,32,34,33,37]","[28,27,22,15,13,36,38,37]","[3,31,10,35,4]","[6,17,5,36,11,34,10]","[6,20,7,22,9,32,10]","[8,25,7,14,5,39,12]","[8,27,9,29,11,38,12]"]')

        }


        {
            let reseuCrea=new reseau.Regular2d()
            reseuCrea.nbI=3
            reseuCrea.nbJ=3
            let reso=reseuCrea.go()


            let border:Vertex[]=[]

            for (let ver of reso.vertices){
                if (ver.hasMark(Vertex.Markers.border)) border.push(ver)
            }

            let rings=graph.ringify(border)

            bilan.assertTrue(rings[0].length==8&&rings[1].length==1)
        }

        {
            let reseuCrea=new reseau.Regular2d()
            reseuCrea.nbI=3
            reseuCrea.nbJ=4
            let reso=reseuCrea.go()


            let border:Vertex[]=[]

            for (let ver of reso.vertices){
                if (ver.hasMark(Vertex.Markers.border)) border.push(ver)
            }

            let rings=graph.ringify(border)

            bilan.assertTrue(rings[0].length==10&&rings[1].length==2)
        }


        {
            let reseuCrea=new reseau.Regular2d()
            reseuCrea.nbI=4
            reseuCrea.nbJ=4
            let reso=reseuCrea.go()


            let border:Vertex[]=[]

            for (let ver of reso.vertices){
                if (ver.hasMark(Vertex.Markers.border)) border.push(ver)
            }

            let rings=graph.ringify(border)

            
            bilan.assertTrue(rings[0].length==12&&rings[1].length==4)


        }


        {
            let reseuCrea=new reseau.Regular2d()
            reseuCrea.nbI=5
            reseuCrea.nbJ=5
            let reso=reseuCrea.go()


            let border:Vertex[]=[]

            for (let ver of reso.vertices){
                if (ver.hasMark(Vertex.Markers.border)) border.push(ver)
            }

            let rings=graph.ringify(border)
            
            bilan.assertTrue(rings[0].length==16&&rings[1].length==8&&rings[2].length==1)
            
        }



        
        

        





        {

            let test=(nbSides)=> {
                let crea = new reseau.TriangulatedPolygone(nbSides)
                let mamesh = crea.go()

                let nbDicho = 2
                for (let dic = 0; dic < nbDicho; dic++) {
                    let dicotomer = new mameshModification.TriangleDichotomer(mamesh)
                    dicotomer.makeLinks = false
                    dicotomer.go()
                }

                let linkMaker = new linkModule.LinkCreaterSorterAndBorderDetecterByPolygons(mamesh)
                linkMaker.goChanging()

                return mamesh


            }

            let mamesh=test(3)
            let count = 0
            for (let ve of mamesh.vertices) {
                if (ve.hasMark(Vertex.Markers.border)) count++
            }
            bilan.assertTrue(count==12)

            mamesh=test(4)
            count = 0
            for (let ve of mamesh.vertices) {
                if (ve.hasMark(Vertex.Markers.border)) count++
            }
            bilan.assertTrue(count==16)

            mamesh=test(5)
            count = 0
            for (let ve of mamesh.vertices) {
                if (ve.hasMark(Vertex.Markers.border)) count++
            }
            bilan.assertTrue(count==20)


        }
        

        // {
        //
        //     let gene=new reseau.BasisForRegularReseau()
        //     gene.nbI=4
        //     gene.nbJ=4
        //     gene.origin=new XYZ(-0.5,-0.5,0)
        //     gene.end=new XYZ(0.5,0.5,0)
        //
        //
        //     let creater=new reseau.Regular(gene)
        //     let IN_mamesh=creater.goChanging()
        //
        //
        //
        //     new creation2D.Similitude(IN_mamesh.vertices,Math.PI/4).goChanging()
        //
        //     IN_mamesh.vertices.forEach((v)=>{
        //         v.links.forEach(li=>{
        //             li.opposite=null
        //         })
        //     })
        //
        //
        //     let linkOp=new mameshAroundComputations.LinksSorterAndCleanerByAngles(IN_mamesh)
        //     linkOp.goChanging()
        //
        //     cc(IN_mamesh.toString())
        //
        //     new visu3d.LinesViewer(IN_mamesh,mathisFrame.scene).goChanging()
        //
        //
        //
        //
        // }
        //
        //
        // return bilan

       


        {


            let test=(angleBetween:number,maxAngle:number)=>{

                let mamesh = new Mamesh()
                let v0 = new Vertex()
                v0.param = new XYZ(Math.random(), 0, 0)
                v0.position = new XYZ(0, 0, 0)
                mamesh.addVertex(v0)

                let otherVertices:Vertex[] = []
                let anglesProp:number[] = []
                for (let i = 0; i < 1; i += angleBetween) anglesProp.push(i)
                let p = 1
                for (let i of anglesProp) {
                    let angle = 2 * Math.PI * i
                    let v = new Vertex()

                    v.param = new XYZ(p++, 0, 0)
                    v.position = new XYZ(Math.cos(angle), Math.sin(angle), 0)

                    otherVertices.push(v)
                }

                //shuffle(otherVertices)

                for (let v of otherVertices) {
                    v0.setOneLink(v)
                    v.setOneLink(v0)
                    mamesh.addVertex(v)
                }



                let sorter = new linkModule.LinksSorterAndCleanerByAngles(mamesh,new XYZ(0,0,1))
                sorter.suppressLinksAngularlyTooCloseVersusNot = true
                sorter.suppressLinksAngularParam=2*Math.PI*maxAngle//default
                sorter.goChanging()



                return mamesh
            }


            let mamesh



            mamesh=test(0.25,0.1)
            bilan.assertTrue(mamesh.vertices[0].links.length==4)


            mamesh=test(0.1,0.05)
            bilan.assertTrue(mamesh.vertices[0].links.length==10)



        }



        {

            let test=(nb:number,perturb:number)=>{

                let mamesh = new Mamesh()
                let v0 = new Vertex()
                v0.param = new XYZ(Math.random(), 0, 0)
                v0.position = new XYZ(0, 0, 0)
                mamesh.addVertex(v0)

                let otherVertices:Vertex[] = []
                let anglesProp:number[] = []
                for (let i = 0; i < 1; i += 1/nb) anglesProp.push(i)
                let p = 1
                for (let i of anglesProp) {
                    let angle = 2 * Math.PI * i
                    let angleBis = 2 * Math.PI * (i+perturb )

                    let v = new Vertex()
                    let vBis = new Vertex()


                    v.param = new XYZ(p++, 0, 0)
                    vBis.param = new XYZ(p++, 1, 0)

                    v.position = new XYZ(Math.cos(angle), Math.sin(angle), 0)
                    vBis.position = new XYZ(2*Math.cos(angleBis), 2*Math.sin(angleBis), 0)

                    otherVertices.push(v)
                    otherVertices.push(vBis)

                }



                shuffle(otherVertices)

                for (let v of otherVertices) {
                    v0.setOneLink(v)
                    v.setOneLink(v0)
                    mamesh.addVertex(v)
                }

                
                let sorter = new linkModule.LinksSorterAndCleanerByAngles(mamesh,new XYZ(0,0,1))
                sorter.suppressLinksAngularlyTooCloseVersusNot = true
                sorter.suppressLinksAngularParam=2*Math.PI*0.1
                sorter.goChanging()



                return mamesh
            }


            let mamesh

            mamesh=test(4,0.02)
            bilan.assertTrue(mamesh.vertices[0].links.length==4)
            /**we check that it is the shortest link that we keep*/
            let ok=true
            mamesh.vertices[0].links.forEach(li=>{
                ok =ok && (li.to.param.y==0)
            })
            bilan.assertTrue(ok)


            //new visu3d.LinksViewer(IN_mamesh,mathisFrame.scene).goChanging()


            mamesh=test(5,0.09)
            bilan.assertTrue(mamesh.vertices[0].links.length==5)

            mamesh=test(8,0.01)
            bilan.assertTrue(mamesh.vertices[0].links.length==8)
            ok=true
            mamesh.vertices[0].links.forEach(li=>{
                ok =ok && (li.to.param.y==0)
            })
            bilan.assertTrue(ok)
        }





        // {
        //     let IN_mamesh = new Mamesh()
        //     let v0 = new Vertex()
        //     v0.param = new XYZ(Math.random(), 0, 0)
        //     v0.position = new XYZ(0, 0, 0)
        //     IN_mamesh.addVertex(v0)
        //
        //     let otherVertices:Vertex[] = []
        //     let anglesProp:number[] = []
        //     for (let i = 0; i < 1; i += 0.1) anglesProp.push(i)
        //     let p = 1
        //     for (let i of anglesProp) {
        //         let angle = 2 * Math.PI * i
        //         let v = new Vertex()
        //
        //         v.param = new XYZ(p++, 0, 0)
        //         v.position = new XYZ(Math.cos(angle), Math.sin(angle), 0)
        //
        //         otherVertices.push(v)
        //     }
        //
        //     shuffle(otherVertices)
        //
        //     for (let v of otherVertices) {
        //         v0.setOneLink(v)
        //         v.setOneLink(v0)
        //         IN_mamesh.addVertex(v)
        //     }
        //
        //
        //     let sorter = new linkModule.LinksSorterAndCleanerByAngles(IN_mamesh)
        //     sorter.normalsFromMameshVersusFixedNormal = false
        //     sorter.suppressLinksAngularlyTooClose=false
        //     sorter.goChanging()
        //
        //
        //     for (let i = 0; i < v0.links.length - 1; i++) {
        //         let link0 = v0.links[i]
        //         let link1 = v0.links[i + 1]
        //
        //         bilan.assertTrue(link0.to.param.x < link1.to.param.x || Math.abs(link0.to.param.x - link1.to.param.x) == anglesProp.length - 1)
        //
        //     }
        //
        //
        // }







        {

            bilan.assertTrue(modulo(3,4,true)==-1)
            bilan.assertTrue(modulo(5,4,true)==1)


            let vect0=new XYZ(1,0,0)
            let normal=new XYZ(0,0,1)
            for (let i=-2;i<2;i+=0.1){

                let angle = 2*Math.PI*i
                let vect=new XYZ(Math.cos(angle),Math.sin(angle),0)
                let compAngle=geo.angleBetweenTwoVectorsBetweenMinusPiAndPi(vect0,vect,normal)


                let ok=roundWithGivenPrecision( modulo(compAngle/Math.PI/2,1) ,1)==roundWithGivenPrecision(modulo(i,1),1)
                bilan.assertTrue(ok)


            }
        }




        // {
        //
        //     let IN_mamesh=new Mamesh()
        //     let v0=new Vertex()
        //     v0.param=new XYZ(Math.random(),0,0)
        //     let v1=new Vertex()
        //     v1.param=new XYZ(Math.random(),0,0)
        //     let v2=new Vertex()
        //     v2.param=new XYZ(Math.random(),0,0)
        //     let v3=new Vertex()
        //     v3.param=new XYZ(Math.random(),0,0)
        //
        //     v1.links.push(new Link(v0))
        //     v1.links.push(new Link(v0))
        //     v1.links.push(new Link(v0))
        //     v1.setTwoOppositeLinks(v0,v1)
        //
        //     v0.setOneLink(v1)
        //     v1.setTwoOppositeLinks(v0,v1)
        //     v2.setOneLink(v1)
        //
        //     v2.setTwoOppositeLinks(v1,v3)
        //
        //
        //     v1.links.push(new Link(v0))
        //     v1.links.push(new Link(v0))
        //     v1.links.push(new Link(v0))
        //     v1.links.push(new Link(v0))
        //     v1.setTwoOppositeLinks(v0,v1)
        //
        //
        //     v2.setTwoOppositeLinks(v1,v3)
        //
        //
        //     IN_mamesh.addVertex(v0)
        //     IN_mamesh.addVertex(v1)
        //     IN_mamesh.addVertex(v2)
        //     IN_mamesh.addVertex(v3)
        //
        //     //cc(IN_mamesh.toString())
        //
        //     new linkModule.GraphCleaning(IN_mamesh.vertices).goChanging()
        //
        //     bilan.assertTrue(IN_mamesh.toStringForTest0()=='0|links:(1)1|links:(0,1)(1,0)2|links:(1,3)(3,1)3|links:tri:squa:')
        //
        // }







        return bilan

    }


}