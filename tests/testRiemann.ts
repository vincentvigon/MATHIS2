/**
 * Created by vigon on 22/02/2016.
 */


module mathis{


    export function testRiemann(mathisFrame:MathisFrame):Bilan{


        let bilan=new Bilan()

        {
            let nb = 3
            let gene0 = new reseau.BasisForRegularReseau()
            gene0.origin = new XYZ(-1 / 2, -1 / 2, 0)
            gene0.end = new XYZ(1 / 2, 1 / 2, 0)
            gene0.nbI = nb
            gene0.nbJ = nb
            let mamesh =new reseau.Regular( gene0).go()

            let verticesToKeep=[]
            for (let i=0;i<mamesh.vertices.length;i++) {
                if (i!=2) verticesToKeep.push(mamesh.vertices[i])
            }


            let suber=new grateAndGlue.SubMameshExtractor(mamesh,verticesToKeep)
            suber.takeCareOfPolygons=false
            let subMamesh=suber.go()
            subMamesh.isolateMameshVerticesFromExteriorVertices()

            subMamesh.fillLineCatalogue()

            bilan.assertTrue(subMamesh.allLinesAsASortedString()=='straightLines:["[0,1]","[0,3,6]","[1,4,7]","[3,4,5]","[5,8]","[6,7,8]"]')


            // new visu3d.VerticesViewer(subMamesh,mathisFrame.scene).goChanging()
            // new visu3d.LinesViewer(subMamesh,mathisFrame.scene).goChanging()

        }




        {


            let test=(neighborhoodCoeficients:number[])=> {

                let nb = 6
                let gene0 = new reseau.BasisForRegularReseau()
                gene0.origin = new XYZ(-1 / 2, -1 / 2, 0)
                gene0.end = new XYZ(1 / 2, 1 / 2, 0)
                gene0.nbI = nb
                gene0.nbJ = nb
                let mamesh0 = new reseau.Regular(gene0).go()

                let gene1 = new reseau.BasisForRegularReseau()
                gene1.origin = new XYZ(-1 / 2, -1 / 2, 0)
                gene1.end = new XYZ(1 / 2, 1 / 2, 0)
                gene1.nbI = nb
                gene1.nbJ = nb
                let mamesh1 = new reseau.Regular(gene1).go()


                let gene2 = new reseau.BasisForRegularReseau()
                gene2.origin = new XYZ(-1 / 2, -1 / 2, 0)
                gene2.end = new XYZ(1 / 2, 1 / 2, 0)
                gene2.nbI = nb
                gene2.nbJ = nb
                let mamesh2 = new reseau.Regular(gene2).go()

                new mathis.spacialTransformations.Similitude(mamesh1.vertices, 0, new XYZ(0.3, 0.2, 0)).goChanging()
                new mathis.spacialTransformations.Similitude(mamesh2.vertices, 0, new XYZ(0.2, -0.2, 0)).goChanging()


                let grater = new grateAndGlue.GraphGrater()
                grater.IN_graphFamily = [mamesh0.vertices, mamesh1.vertices, mamesh2.vertices]
                grater.proximityCoefToGrate =neighborhoodCoeficients
                let graterRes = grater.go()

                mamesh0 = new grateAndGlue.SubMameshExtractor(mamesh0, graterRes[0]).go()
                mamesh0.isolateMameshVerticesFromExteriorVertices()
                mamesh1 = new grateAndGlue.SubMameshExtractor(mamesh1, graterRes[1]).go()
                mamesh1.isolateMameshVerticesFromExteriorVertices()
                mamesh2 = new grateAndGlue.SubMameshExtractor(mamesh2, graterRes[2]).go()
                mamesh2.isolateMameshVerticesFromExteriorVertices()



                // let lineV0 = new visu3d.LinksViewer(mamesh0, mathisFrame.scene)
                // lineV0.color = new BABYLON.Color3(0, 1, 0)
                // lineV0.goChanging()
                //
                // let lineV1 = new visu3d.LinksViewer(mamesh1, mathisFrame.scene)
                // lineV1.color = new BABYLON.Color3(1, 0, 0)
                // lineV1.goChanging()
                //
                // let lineV2 = new visu3d.LinksViewer(mamesh2, mathisFrame.scene)
                // lineV2.color = new BABYLON.Color3(0, 0, 1)
                // lineV2.goChanging()
                //
                //
                // let vertVisu = new visu3d.VerticesViewer(null, mathisFrame.scene)
                // vertVisu.selectedVertices = grater.OUTAllSeeds
                // vertVisu.goChanging()
                //
                // cc(mamesh0.allSquareAndTrianglesAsSortedString()+mamesh1.allSquareAndTrianglesAsSortedString()+mamesh2.allSquareAndTrianglesAsSortedString())

                return mamesh0.allSquareAndTrianglesAsSortedString()+mamesh1.allSquareAndTrianglesAsSortedString()+mamesh2.allSquareAndTrianglesAsSortedString()

            }

            bilan.assertTrue(test([1])=='square:["[0,6,7,1]","[1,7,8,2]","[12,18,19,13]","[13,19,20,14]","[14,20,21,15]","[15,21,22,16]","[2,8,9,3]","[3,9,10,4]","[6,12,13,7]","[7,13,14,8]","[8,14,15,9]","[9,15,16,10]"]triangle:[]square:["[0,6,7,1]","[1,7,8,2]","[2,8,9,3]","[6,12,13,7]","[7,13,14,8]","[8,14,15,9]"]triangle:[]square:["[0,6,7,1]","[12,18,19,13]","[18,24,25,19]","[19,25,26,20]","[20,26,27,21]","[24,30,31,25]","[25,31,32,26]","[26,32,33,27]","[6,12,13,7]"]triangle:[]')

            bilan.assertTrue(test([0.7])=='square:["[0,6,7,1]","[1,7,8,2]","[10,16,17,11]","[12,18,19,13]","[13,19,20,14]","[14,20,21,15]","[15,21,22,16]","[16,22,23,17]","[2,8,9,3]","[3,9,10,4]","[4,10,11,5]","[6,12,13,7]","[7,13,14,8]","[8,14,15,9]","[9,15,16,10]"]triangle:[]square:["[0,6,7,1]","[1,7,8,2]","[2,8,9,3]","[6,12,13,7]","[7,13,14,8]","[8,14,15,9]"]triangle:[]square:["[0,6,7,1]","[1,7,8,2]","[2,8,9,3]","[6,12,13,7]","[7,13,14,8]","[8,14,15,9]"]triangle:[]')

            bilan.assertTrue(test([0.5])=='square:["[0,6,7,1]","[1,7,8,2]","[10,16,17,11]","[12,18,19,13]","[13,19,20,14]","[14,20,21,15]","[15,21,22,16]","[16,22,23,17]","[2,8,9,3]","[21,27,28,22]","[22,28,29,23]","[3,9,10,4]","[4,10,11,5]","[6,12,13,7]","[7,13,14,8]","[8,14,15,9]","[9,15,16,10]"]triangle:[]square:["[0,6,7,1]","[1,7,8,2]","[2,8,9,3]","[6,12,13,7]","[7,13,14,8]","[8,14,15,9]"]triangle:[]square:["[0,6,7,1]","[1,7,8,2]","[2,8,9,3]","[6,12,13,7]","[7,13,14,8]","[8,14,15,9]"]triangle:[]')




        }
        
        

        
        
        // {
        //
        //
        //     function yep4(takeCareOfPolygons:boolean,nb:number,gratingCoef:number[]=null,stickingCoef:number[]=null,clean=false) {
        //
        //
        //         let gene0 = new reseau.BasisForRegularReseau()
        //         gene0.origin = new XYZ(-1 / 2, -1 / 2, 0)
        //         gene0.end = new XYZ(1 / 2, 1 / 2, 0)
        //         gene0.nbI = nb
        //         gene0.nbJ = nb
        //         let reg=new reseau.Regular( gene0)
        //         reg.strateHaveSquareMailleVersusTriangleMaille=false
        //         let mamesh0 =reg.goChanging()
        //
        //         let gene1 = new reseau.BasisForRegularReseau()
        //         gene1.origin = new XYZ(-1 / 2, -1 / 2, 0)
        //         gene1.end = new XYZ(1 / 2, 1 / 2, 0)
        //         gene1.nbI = nb
        //         gene1.nbJ = nb
        //         let mamesh1 =new reseau.Regular( gene1).goChanging()
        //
        //
        //         let gene2= new reseau.BasisForRegularReseau()
        //         gene2.origin = new XYZ(-1 / 2, -1 / 2, 0)
        //         gene2.end = new XYZ(1 / 2, 1 / 2, 0)
        //         gene2.nbI = nb
        //         gene2.nbJ = nb
        //         let mamesh2 =new reseau.Regular( gene2).goChanging()
        //
        //
        //         new Similitude(mamesh0.vertices, 0.01).goChanging()
        //         new Similitude(mamesh1.vertices, Math.PI / 5, new XYZ(0.32, 0.23, 0)).goChanging()
        //         new Similitude(mamesh2.vertices, -Math.PI / 5, new XYZ(0.32,- 0.4, 0)).goChanging()
        //
        //
        //         let concurenter = new mameshModification.ConcurrentMameshesGraterAndSticker()
        //         concurenter.IN_mameshes=[mamesh0, mamesh1,mamesh2]
        //         concurenter.justGrateDoNotStick = false
        //         concurenter.takeCareOfPolygons = takeCareOfPolygons
        //         concurenter.SUB_grater.proximityCoefToGrate=gratingCoef
        //         concurenter.stickingSizeCoefByFamily=stickingCoef
        //         concurenter.suppressLinksAngularlyTooClose=clean
        //         concurenter.suppressDoubleLinksVersusNot=clean
        //         concurenter.justGrateDoNotStick=true
        //         let stuck = concurenter.goChanging()
        //
        //
        //         stuck.clearOppositeInLinks()
        //         new linkModule.OppositeLinkAssocierByAngles(stuck.vertices).goChanging()
        //         stuck.fillLineCatalogue()
        //
        //
        //
        //         return stuck
        //     }
        //
        //
        //
        //     let stuck
        //
        //     //     stuck=yep4(true,5)//,[0.75,0.75,0.75])
        //     // bilan.assertTrue(stuck.allLinesAsASortedString()=='straightLines:["[0,6,7,13]","[0,60]","[1,6,11,62,67,72]","[11,7,8,4]","[12,13,9]","[18,38,39]","[2,7,12]","[3,8,13,18,41,46]","[4,9,44]","[40,68,67,66,65]","[44,43,42,41,40,73,72,71,70]","[45,40,63,62,61,60]","[45,46,47,48,49]","[47,42,18,12,11,56,55]","[48,43,38]","[49,44,39,9,8,2,1,0,55,60,65,70]","[6,2,3,4]","[71,66,61,56]","[73,68,63]"]')
        //     //
        //     //
        //     //
        //     // /**on grate un peu différement*/
        //     // stuck=yep4(true,5,[0.9,0.75,0.9])
        //     // bilan.assertTrue(stuck.allLinesAsASortedString()=='straightLines:["[0,6,7,13,38,43,48]","[1,6,11,62,67,72]","[11,12,37,42,47]","[12,13,39,44,49]","[2,7,12,36,41,46]","[3,8,13]","[39,38,37,36,63,62,61,60]","[44,43,42,41,40,73,72,71,70]","[45,40,68,67,66,65]","[45,46,47,48,49]","[6,2,3]","[73,68,63]","[8,2,1,0,60,65,70]","[8,7,11,61,66,71]"]')
        //     //
        //     //
        //     //
        //     //
        //     // stuck=yep4(true,5,[0.75,0.75,0.75],[2.5,2.5,2.5],false)
        //     //
        //     // bilan.assertTrue(stuck.allLinesAsASortedString()=='straightLines:["[0,6,7,13]","[0,60]","[1,6,11,62,67,72]","[11,7,8,4]","[12,13,9]","[18,41,46]","[18,42,47]","[18,47]","[2,7,12]","[3,8,13,18,46]","[39,38,18,40]","[4,9,44]","[40,68,67,66,65]","[44,43,42,41,40,73,72,71,70]","[45,40,63,62,61,60]","[45,46,47,48,49]","[48,18,12,11,56,55]","[48,43,38]","[49,44,39,9,8,2,1,0,55,60,65,70]","[6,2,3,4]","[71,66,61,56]","[73,68,63]"]')
        //
        //     // /**cleaning*/
        //     // stuck=yep4(true,5,[0.75,0.75,0.75],[2.5,2.5,2.5],true)
        //     // bilan.assertTrue(stuck.allLinesAsASortedString()=='straightLines:["[0,6,7,13]","[1,6,11,62,67,72]","[11,7,8,4]","[12,13,9]","[2,7,12]","[3,8,13,18,42,47]","[39,38,18,12,11,56,55]","[44,43,42,41,40,73,72,71,70]","[45,40,63,62,61,60]","[45,46,47]","[46,41]","[48,43,38]","[48,49]","[49,44,39,9,8,2,1,0,55,60,65,70]","[6,2,3,4]","[65,66,67,68]","[71,66,61,56]","[73,68,63]","[9,4]"]')
        //
        //
        //     // /**2.5 au lieu de 2 rajoute une liaison lointaine*/
        //     // stuck=yep4(true,4,[0.75,0.75,0.75],[2.5,2.5,2.5])
        //     // bilan.assertTrue(stuck.allLinesAsASortedString()=='straightLines:["[0,40]","[0,5,6,26,30]","[1,5,9,24,28]","[2,6,29]","[27,26,25,24,45,44]","[28,29,30,31]","[29,25,9,37,36]","[3,7,27,31]","[31,7,2,1,0,36,40,44]","[40,41]","[45,41,37]","[5,2,3]","[6,30]","[7,6,9,41]"]')
        //
        //
        //
        //     stuck=yep4(true,4,[0.6,0.75,0.75],null,true)
        //     bilan.assertTrue(stuck.allLinesAsASortedString()=='straightLines:["[0,1,2,7,27,31]","[0,4,41,45]","[0,5,6]","[1,5,9]","[2,6,10,25,29]","[24,25,26,27]","[28,24]","[28,29,30,31]","[3,2,5,4,40,44]","[4,9,10,26,30]","[40,41]","[44,45]","[7,3]","[9,6,7]"]')
        //
        //     cc(stuck.allLinesAsASortedString())
        //     new visu3d.LinesViewer(stuck, mathisFrame.scene).goChanging()
        //
        //
        //     // liner.goChanging()
        //     //
        //     // new visu3d.SurfaceViewer(stuck, mathisFrame.scene).goChanging()
        //     // new visu3d.VerticesViewer(stuck, mathisFrame.scene).goChanging()
        //
        //
        //
        // }





        {
            let toTest=(addBorderPoly:boolean)=> {
                let nb = 4
                let gene0 = new reseau.BasisForRegularReseau()
                gene0.origin = new XYZ(-1 / 2, -1 / 2, 0)
                gene0.end = new XYZ(1 / 2, 1 / 2, 0)
                gene0.nbI = nb
                gene0.nbJ = nb

                let regularMaker = new reseau.Regular( gene0)
                regularMaker.squareVersusTriangleMaille = false
                let mamesh0 =regularMaker.go()

                let selected = [mamesh0.vertices[0], mamesh0.vertices[1], mamesh0.vertices[4], mamesh0.vertices[5]]
                let sub = new grateAndGlue.SubMameshExtractor(mamesh0, selected)
                sub.addBorderPolygonInsteadOfSuppress = addBorderPoly
                let subma = sub.go()
                return subma
            }

            let subma=toTest(false)
            bilan.assertTrue(subma.allSquareAndTrianglesAsSortedString()=='square:[]triangle:["[0,4,5]","[0,5,1]"]')

            subma=toTest(true)
            bilan.assertTrue(subma.allSquareAndTrianglesAsSortedString()=='square:[]triangle:["[0,4,5]","[0,5,1]","[1,5,2]","[2,5,6]","[4,8,9]","[4,9,5]","[5,9,6]"]')

            // subma.isolateMameshVerticesFromExteriorVertices()
            // new visu3d.LinksViewer(subma,mathisFrame.scene).goChanging()
            // new visu3d.SurfaceViewer(subma,mathisFrame.scene).goChanging()


        }




        {
            let nb = 4
            let gene0 = new reseau.BasisForRegularReseau()
            gene0.origin = new XYZ(-1 / 2, -1 / 2, 0)
            gene0.end = new XYZ(1 / 2, 1/2 , 0)
            gene0.nbI = nb
            gene0.nbJ = nb
            let mamesh0 = new reseau.Regular( gene0).go()


            let selected=[mamesh0.vertices[0],mamesh0.vertices[1],mamesh0.vertices[4],mamesh0.vertices[5]]

            let sub=new grateAndGlue.SubMameshExtractor(mamesh0,selected)
            sub.addBorderPolygonInsteadOfSuppress=true
            let subma=sub.go()

            bilan.assertTrue(sub.OUT_BorderPolygon.length==3)
            bilan.assertTrue(sub.OUT_BorderVerticesInside.length==3)
            bilan.assertTrue(sub.OUTBorderVerticesOutside.length==5)
            bilan.assertTrue(subma.allSquareAndTrianglesAsSortedString()=='square:["[0,4,5,1]","[1,5,6,2]","[4,8,9,5]","[5,9,10,6]"]triangle:[]')




        }








        //
        //
        // {
        //
        //
        //     function yep(takeCareOfPolygons:boolean,nb:number) {
        //
        //
        //         let gene0 = new reseau.BasisForRegularReseau()
        //         gene0.origin = new XYZ(-1 / 2, -1 / 2, 0)
        //         gene0.end = new XYZ(1 / 2, 1 / 2, 0)
        //         gene0.nbI = nb
        //         gene0.nbJ = nb
        //         let mamesh0 =new reseau.Regular( gene0).goChanging()
        //
        //         let gene1 = new reseau.BasisForRegularReseau()
        //         gene1.origin = new XYZ(-1 / 2, -1 / 2, 0)
        //         gene1.end = new XYZ(1 / 2, 1 / 2, 0)
        //         gene1.nbI = nb
        //         gene1.nbJ = nb
        //         let mamesh1 =new reseau.Regular( gene1).goChanging()
        //
        //
        //         new creation2D.Similitude(mamesh0.vertices, 0.01).goChanging()
        //         new creation2D.Similitude(mamesh1.vertices, Math.PI / 5, new XYZ(0.32, 0.23, 0)).goChanging()
        //
        //         let concurenter = new mameshModification.ConcurrentMameshesGraterAndSticker([mamesh0, mamesh1])
        //         concurenter.justGrateDoNotStick = false
        //         concurenter.takeCareOfPolygons = takeCareOfPolygons
        //         let stuck = concurenter.goChanging()
        //
        //
        //         stuck.clearOppositeInLinks()
        //         new linkModule.OppositeLinkAssocierByAngles(stuck.vertices).goChanging()
        //         stuck.fillLineCatalogue()
        //
        //
        //
        //
        //
        //         return stuck
        //     }
        //
        //
        //
        //     let stuck=yep(true,4)
        //     bilan.assertTrue(stuck.allLinesAsASortedString()=='straightLines:["[0,1,2]","[0,4,8]","[1,5,9,24,28]","[10,26,30]","[2,6,10,25,29]","[24,25,26,27]","[28,29,30,31]","[31,27]","[4,5,6]","[8,9,10,27]"]')
        //
        //
        //     stuck=yep(false,4)
        //     bilan.assertTrue(stuck.allLinesAsASortedString()=='straightLines:["[0,1,2,3]","[0,4,8]","[1,5,9,20]","[2,6,10,25,29]","[24,25,26,27]","[28,24,20]","[28,29,30,31]","[4,5,6,23,27,31]","[8,9,10,26,30]"]')
        //
        //     stuck=yep(true,5)
        //     bilan.assertTrue(stuck.allLinesAsASortedString()=='straightLines:["[0,1,2,3,4]","[0,5,10,15,20]","[1,6,11,16,21,40,45]","[10,11,12,13,38,43,48]","[15,16,17,37,42,47]","[2,7,12,17,36,41,46]","[20,21]","[3,8,13]","[36,37,38,39]","[4,9,39,44,49]","[40,41,42,43,44]","[45,46,47,48,49]","[5,6,7,8,9]"]')
        //
        //
        //
        //
        //
        //
        // }
        //




        {
            let nb = 4
            let gene0 = new reseau.BasisForRegularReseau()
            gene0.origin = new XYZ(-1 / 2, -1 / 2, 0)
            gene0.end = new XYZ(1 / 2, 1/2 , 0)
            gene0.nbI = nb
            gene0.nbJ = nb
            let mamesh0 = new reseau.Regular( gene0).go()


            let selected=[mamesh0.vertices[0],mamesh0.vertices[1],mamesh0.vertices[4],mamesh0.vertices[5]]

            let sub=new grateAndGlue.SubMameshExtractor(mamesh0,selected)
            sub.addBorderPolygonInsteadOfSuppress=false
            let subma=sub.go()

            bilan.assertTrue(sub.OUT_BorderPolygon.length==3)
            bilan.assertTrue(sub.OUT_BorderVerticesInside.length==3)
            bilan.assertTrue(sub.OUTBorderVerticesOutside.length==5)
            bilan.assertTrue(subma.allSquareAndTrianglesAsSortedString()=='square:["[0,4,5,1]"]triangle:[]')

        }









        {
            let nb=5

            let gene0 = new reseau.BasisForRegularReseau()
            gene0.origin = new XYZ(-1 / 2, -1 / 2, 0)
            gene0.end = new XYZ(1 / 2, 1/2 , 0)
            gene0.nbI = nb
            gene0.nbJ = nb
            let mamesh0 = new reseau.Regular( gene0).go()
            mamesh0.fillLineCatalogue()

            let linesBefore=mamesh0.allLinesAsASortedString()

            mamesh0.clearOppositeInLinks()

            new linkModule.OppositeLinkAssocierByAngles(mamesh0.vertices).goChanging()

            mamesh0.fillLineCatalogue()

            let linesAfter=mamesh0.allLinesAsASortedString()

            bilan.assertTrue(linesBefore==linesAfter)

            //new visu3d.LinesViewer(mamesh0,mathisFrame.scene).goChanging()

        }


        
        
        




        {
            let nb = 7
            let gene0 = new reseau.BasisForRegularReseau()
            gene0.origin = new XYZ(-1 / 2, -1 / 2, 0)
            gene0.end = new XYZ(1 / 2, 1/2 , 0)
            gene0.nbI = nb
            gene0.nbJ = nb
            let mamesh0 = new reseau.Regular( gene0).go()

            nb=5
            let gene = new reseau.BasisForRegularReseau()
            gene.origin = new XYZ(-1 / 2, -1 / 2, 0)
            gene.end = new XYZ(1 / 2, 1 / 2, 0)
            gene.nbI = nb
            gene.nbJ = nb
            let mamesh1 = new reseau.Regular( gene).go()

            new mathis.spacialTransformations.Similitude(mamesh1.vertices,Math.PI/4,new XYZ(0,0,0),new XYZ(0.5,0.5,0)).goChanging()

            let grater=new grateAndGlue.GraphGrater()
            grater.IN_graphFamily=[mamesh0.vertices,mamesh1.vertices]
            let graterRes=grater.go()

            mamesh0=new grateAndGlue.SubMameshExtractor(mamesh0,graterRes[0]).go()
            mamesh0.isolateMameshVerticesFromExteriorVertices()
            mamesh1=new grateAndGlue.SubMameshExtractor(mamesh1,graterRes[1]).go()
            mamesh1.isolateMameshVerticesFromExteriorVertices()

            //bilan.assertTrue(mamesh0.allSquareAndTrianglesAsSortedString()=='square:["[0,7,8,1]","[1,8,9,2]","[12,19,20,13]","[14,21,22,15]","[19,26,27,20]","[2,9,10,3]","[21,28,29,22]","[26,33,34,27]","[28,35,36,29]","[3,10,11,4]","[33,40,41,34]","[35,42,43,36]","[36,43,44,37]","[37,44,45,38]","[38,45,46,39]","[39,46,47,40]","[4,11,12,5]","[40,47,48,41]","[5,12,13,6]","[7,14,15,8]"]triangle:[]')
            //bilan.assertTrue(mamesh1.allSquareAndTrianglesAsSortedString()=='square:["[0,5,6,1]","[1,6,7,2]","[5,10,11,6]","[6,11,12,7]"]triangle:[]')

            bilan.assertTrue(mamesh0.allSquareAndTrianglesAsSortedString()+mamesh1.allSquareAndTrianglesAsSortedString()=='square:["[0,7,8,1]","[1,8,9,2]","[12,19,20,13]","[28,35,36,29]","[33,40,41,34]","[35,42,43,36]","[36,43,44,37]","[39,46,47,40]","[4,11,12,5]","[40,47,48,41]","[5,12,13,6]","[7,14,15,8]"]triangle:[]square:["[0,5,6,1]","[1,6,7,2]","[10,15,16,11]","[11,16,17,12]","[12,17,18,13]","[13,18,19,14]","[15,20,21,16]","[16,21,22,17]","[17,22,23,18]","[18,23,24,19]","[2,7,8,3]","[3,8,9,4]","[5,10,11,6]","[6,11,12,7]","[7,12,13,8]","[8,13,14,9]"]triangle:[]')

            // let lineV0=new visu3d.LinksViewer(mamesh0,mathisFrame.scene)
            // lineV0.color=new BABYLON.Color3(0,1,0)
            // lineV0.goChanging()
            //
            // let lineV1=new visu3d.LinksViewer(mamesh1,mathisFrame.scene)
            // lineV1.color=new BABYLON.Color3(1,0,0)
            // lineV1.goChanging()




        }



        {
            let nb = 4
            let gene0 = new reseau.BasisForRegularReseau()
            gene0.origin = new XYZ(-1 / 2, -1 / 2, 0)
            gene0.end = new XYZ(1 / 2, 1 / 2, 0)
            gene0.nbI = nb
            gene0.nbJ = nb
            let mamesh0 = new reseau.Regular( gene0).go()
            mamesh0.name = 'centre00'


            let admisible=new HashMap<Vertex,boolean>()
            mamesh0.vertices.forEach(v=>{
                if (v.param.x!=1)
                    admisible.putValue(v,true)
            })

            let verticesToKeep=graph.getGroup([mamesh0.vertices[0]],admisible)
            verticesToKeep=graph.getEdge(verticesToKeep)

            let suber=new grateAndGlue.SubMameshExtractor(mamesh0,verticesToKeep)
            suber.takeCareOfPolygons=false
            let subMamesh=suber.go()
            subMamesh.isolateMameshVerticesFromExteriorVertices()

            subMamesh.fillLineCatalogue()
            bilan.assertTrue(subMamesh.allLinesAsASortedString()=='straightLines:["[0,1,2,3]"]')


        }




        {
            let nb = 4
            let gene0 = new reseau.BasisForRegularReseau()
            gene0.origin = new XYZ(-1 / 2, -1 / 2, 0)
            gene0.end = new XYZ(1 / 2, 1 / 2, 0)
            gene0.nbI = nb
            gene0.nbJ = nb
            let mamesh0 = new reseau.Regular( gene0).go()
            mamesh0.name = 'centre00'


            let admisible=new HashMap<Vertex,boolean>()
            mamesh0.vertices.forEach(v=>{
                if (v.param.x!=1)
                admisible.putValue(v,true)
            })

            let verticesToKeep=graph.getGroup([mamesh0.vertices[0]],admisible)

            let suber=new grateAndGlue.SubMameshExtractor(mamesh0,verticesToKeep)
            suber.takeCareOfPolygons=false
            let subMamesh=suber.go()
            subMamesh.isolateMameshVerticesFromExteriorVertices()

            subMamesh.fillLineCatalogue()
            bilan.assertTrue(subMamesh.allLinesAsASortedString()=='straightLines:["[0,1,2,3]"]')





        }





        {
            let nb = 4
            let gene0 = new reseau.BasisForRegularReseau()
            gene0.origin = new XYZ(-1 / 2, -1 / 2, 0)
            gene0.end = new XYZ(1 / 2, 1 / 2, 0)
            gene0.nbI = nb
            gene0.nbJ = nb
            let mamesh0 =new reseau.Regular( gene0).go()
            mamesh0.name = 'centre00'


            let admisible=new HashMap<Vertex,boolean>()
            mamesh0.vertices.forEach(v=>{
                if (v.param.x!=1 || v.param.y!=1)
                    admisible.putValue(v,true)
            })

            let verticesToKeep=graph.getGroup([mamesh0.vertices[0]],admisible)

            let suber=new grateAndGlue.SubMameshExtractor(mamesh0,verticesToKeep)
            suber.takeCareOfPolygons=false
            let subMamesh=suber.go()
            subMamesh.isolateMameshVerticesFromExteriorVertices()

            subMamesh.fillLineCatalogue()
            bilan.assertTrue(subMamesh.allLinesAsASortedString()=='straightLines:["[0,1,2,3]","[0,4,8,12]","[12,13,14,15]","[2,6,10,14]","[3,7,11,15]","[6,7]","[8,9,10,11]","[9,13]"]')

            
            //new visu3d.VerticesViewer(subMamesh,mathisFrame.scene).goChanging()
            //new visu3d.LinesViewer(subMamesh,mathisFrame.scene).goChanging()

        }



        return bilan



        // {
        //
        //
        //     let nb=4
        //
        //     let mamesh0 = new Mamesh()
        //     let gene0 = new reseau.BasisForRegularReseau()
        //     gene0.origin = new XYZ(-1/2, -1/2, 0)
        //     gene0.end = new XYZ(1/2, 1/2, 0)
        //     gene0.nbI = nb
        //     gene0.nbJ = nb
        //     new reseau.Regular(mamesh0, gene0).goChanging()
        //     mamesh0.name = 'centre00'
        //
        //
        //     let IN_mamesh = new Mamesh()
        //     let gene = new reseau.BasisForRegularReseau()
        //     gene.origin = new XYZ(-1/2, -1/2, 0)
        //     gene.end = new XYZ(1/2, 1/2, 0)
        //     gene.nbI = nb
        //     gene.nbJ = nb
        //     new reseau.Regular(IN_mamesh, gene).goChanging()
        //     IN_mamesh.name = 'centre11'
        //
        //
        //     new verticesMover.Similitude(IN_mamesh.vertices,Math.PI/4,new XYZ(Math.sqrt(2)/2,0,0)).goChanging()
        //
        //     let concurrent = new mameshModification.ConcurrentMameshesGraterAndSticker([mamesh0, IN_mamesh])
        //     concurrent.justGrateAndNotStick=true
        //     concurrent.overlapOnBorder=false
        //     let stuck=concurrent.goChanging()
        //
        //     //bilan.assertTrue(stuck.allSquareAndTrianglesAsSortedString()=='square:["[0,3,4,1]","[1,4,5,2]","[3,6,7,4]","[4,7,8,5]","[6,15,8,7]"]triangle:["[6,7,8]"]')
        //
        //
        //     let lineV0=new visu3d.LinksViewer(concurrent.OUTGratedMameshes[0],mathisFrame.scene)
        //     lineV0.color=new BABYLON.Color3(0,1,0)
        //     lineV0.goChanging()
        //
        //     let lineV1=new visu3d.LinksViewer(concurrent.OUTGratedMameshes[1],mathisFrame.scene)
        //     lineV1.color=new BABYLON.Color3(0,0,1)
        //     lineV1.goChanging()
        //
        //
        //     //let surfaceVius=new visu3d.SurfaceViewer(stuck,mathisFrame.scene).goChanging()
        //
        //
        //
        // }


        // {
        //
        //
        //     let nb=3
        //
        //     let mamesh0 = new Mamesh()
        //     let gene0 = new reseau.BasisForRegularReseau()
        //     gene0.origin = new XYZ(-1/2, -1/2, 0)
        //     gene0.end = new XYZ(1/2, 1/2, 0)
        //     gene0.nbI = nb
        //     gene0.nbJ = nb
        //     new reseau.Regular(mamesh0, gene0).goChanging()
        //     mamesh0.name = 'centre00'
        //
        //
        //     let IN_mamesh = new Mamesh()
        //     let gene = new reseau.BasisForRegularReseau()
        //     gene.origin = new XYZ(-1/2, -1/2, 0)
        //     gene.end = new XYZ(1/2, 1/2, 0)
        //     gene.nbI = nb
        //     gene.nbJ = nb
        //     new reseau.Regular(IN_mamesh, gene).goChanging()
        //     IN_mamesh.name = 'centre11'
        //
        //
        //     new verticesMover.Similitude(IN_mamesh.vertices,Math.PI/4,new XYZ(Math.sqrt(2)/2,0,0)).goChanging()
        //
        //     let concurrent = new mameshModification.ConcurrentMameshesGraterAndSticker([mamesh0, IN_mamesh])
        //     let stuck=concurrent.goChanging()
        //
        //     bilan.assertTrue(stuck.allSquareAndTrianglesAsSortedString()=='square:["[0,3,4,1]","[1,4,5,2]","[3,6,7,4]","[4,7,8,5]","[6,15,8,7]"]triangle:["[6,7,8]"]')
        //
        //
        //     // let lineV0=new visu3d.LinksViewer(stuck,mathisFrame.scene)
        //     // lineV0.color=new BABYLON.Color3(0,1,0)
        //     // lineV0.goChanging()
        //     // let surfaceVius=new visu3d.SurfaceViewer(stuck,mathisFrame.scene).goChanging()
        //
        //
        //
        // }
        //
        //
        //
        //
        // // {
        // //     let nb=3
        // //     let mamesh0 = new Mamesh()
        // //     let gene0 = new reseau.BasisForRegularReseau()
        // //     gene0.origin = new XYZ(0, 0, 0)
        // //     gene0.end = new XYZ(1, 1, 0)
        // //     gene0.nbI = nb
        // //     gene0.nbJ = nb
        // //     new reseau.Regular(mamesh0, gene0).goChanging()
        // //     mamesh0.name = 'centre00'
        // //
        // //
        // //     let IN_mamesh = new Mamesh()
        // //     let gene = new reseau.BasisForRegularReseau()
        // //     gene.origin = new XYZ(0, 0, 0)
        // //     gene.end = new XYZ(1, 1, 0)
        // //     gene.nbI = nb
        // //     gene.nbJ = nb
        // //     new reseau.Regular(IN_mamesh, gene).goChanging()
        // //     IN_mamesh.name = 'centre11'
        // //
        // //     new verticesMover.Similitude(IN_mamesh.vertices,Math.PI/4,new XYZ(1,0,0)).goChanging()
        // //
        // //     let concurrent = new mameshModification.ConcurrentMameshesGraterAndSticker([mamesh0, IN_mamesh])
        // //     let stuck=concurrent.goChanging()
        // //
        // //     cc(stuck.toString())
        // //
        // //
        // //
        // //     // let lineV0=new visu3d.LinksViewer(stuck,mathisFrame.scene)
        // //     // lineV0.color=new BABYLON.Color3(0,1,0)
        // //     // lineV0.goChanging()
        // //     // let surfaceVius=new visu3d.SurfaceViewer(stuck,mathisFrame.scene).goChanging()
        // //     //
        // //
        // //
        // // }
        //
        //
        //
        //
        // {
        //     let mamesh0 = new Mamesh()
        //     let gene0 = new reseau.BasisForRegularReseau()
        //     gene0.origin = new XYZ(-1, -1, 0)
        //     gene0.end = new XYZ(1, 1, 0)
        //     gene0.nbI = 7
        //     gene0.nbJ = 7
        //     new reseau.Regular(mamesh0, gene0).goChanging()
        //     mamesh0.name = 'centre00'
        //
        //
        //     let IN_mamesh = new Mamesh()
        //     let gene = new reseau.BasisForRegularReseau()
        //     gene.origin = new XYZ(0.1, 0.1, 0)
        //     gene.end = new XYZ(2.1, 2.2, 0)
        //     gene.nbI = 7
        //     gene.nbJ = 7
        //     new reseau.Regular(IN_mamesh, gene).goChanging()
        //     IN_mamesh.name = 'centre11'
        //
        //     let mamesh2 = new Mamesh()
        //     let gene2 = new reseau.BasisForRegularReseau()
        //     gene2.origin = new XYZ(0.1, -2, 0)
        //     gene2.end = new XYZ(2.1, 0, 0)
        //     gene2.nbI = 7
        //     gene2.nbJ = 7
        //     new reseau.Regular(mamesh2, gene2).goChanging()
        //     mamesh2.name = 'centre1_1'
        //
        //     let concurrent = new mameshModification.ConcurrentMameshesGraterAndSticker([mamesh0, IN_mamesh,mamesh2])
        //
        //
        //     let stuck=concurrent.goChanging()
        //
        //     bilan.assertTrue(stuck.allSquareAndTrianglesAsSortedString()=='square:["[0,7,8,1]","[1,8,9,2]","[10,17,18,11]","[105,112,113,106]","[11,18,19,12]","[112,119,120,113]","[113,120,121,114]","[114,121,122,115]","[119,126,127,120]","[12,19,20,13]","[120,127,128,121]","[121,128,129,122]","[126,133,134,127]","[127,134,135,128]","[128,135,136,129]","[129,136,137,130]","[133,140,141,134]","[134,141,142,135]","[135,142,143,136]","[136,143,144,137]","[14,21,22,15]","[15,22,23,16]","[16,23,24,17]","[17,24,25,18]","[18,25,26,19]","[19,26,27,20]","[2,9,10,3]","[21,28,29,22]","[21,99,106,28]","[22,29,30,23]","[23,30,31,24]","[24,31,32,25]","[25,32,33,26]","[26,33,34,27]","[27,34,61,54]","[28,106,113,114]","[28,115,36,29]","[29,36,37,30]","[3,10,11,4]","[30,37,38,31]","[31,38,39,32]","[32,39,40,33]","[33,40,41,34]","[34,67,68,61]","[36,115,122,43]","[36,43,44,37]","[37,44,45,38]","[38,45,46,39]","[39,46,72,40]","[4,11,12,5]","[40,72,73,41]","[41,73,74,67]","[43,122,129,130]","[44,130,137,84]","[45,84,85,46]","[46,85,86,79]","[5,12,13,6]","[54,61,62,55]","[61,68,69,62]","[67,74,75,68]","[68,75,76,69]","[7,14,15,8]","[72,79,80,73]","[73,80,81,74]","[74,81,82,75]","[75,82,83,76]","[79,86,87,80]","[8,15,16,9]","[80,87,88,81]","[81,88,89,82]","[82,89,90,83]","[84,137,144,91]","[84,91,92,85]","[85,92,93,86]","[86,93,94,87]","[87,94,95,88]","[88,95,96,89]","[89,96,97,90]","[9,16,17,10]","[98,105,106,99]"]triangle:["[28,114,115]","[34,41,67]","[43,130,44]","[44,84,45]","[46,79,72]"]')
        //
        //
        //
        //     // let lineV0=new visu3d.LinksViewer(stuck,mathisFrame.scene)
        //     // lineV0.color=new BABYLON.Color3(0,1,0)
        //     // lineV0.goChanging()
        //     // let surfaceVius=new visu3d.SurfaceViewer(stuck,mathisFrame.scene).goChanging()
        //
        //
        //
        // }
        //
        //
        // {
        //     let mamesh0 = new Mamesh()
        //     let gene0 = new reseau.BasisForRegularReseau()
        //     gene0.origin = new XYZ(-1, -1, 0)
        //     gene0.end = new XYZ(1, 1, 0)
        //     gene0.nbI = 7
        //     gene0.nbJ = 7
        //     new reseau.Regular(mamesh0, gene0).goChanging()
        //     mamesh0.name = 'centre00'
        //
        //
        //     let IN_mamesh = new Mamesh()
        //     let gene = new reseau.BasisForRegularReseau()
        //     gene.origin = new XYZ(0.1, 0.1, 0)
        //     gene.end = new XYZ(2.1, 2.2, 0)
        //     gene.nbI = 7
        //     gene.nbJ = 7
        //     new reseau.Regular(IN_mamesh, gene).goChanging()
        //     IN_mamesh.name = 'centre11'
        //
        //     let concurrent = new mameshModification.ConcurrentMameshesGraterAndSticker([mamesh0, IN_mamesh])
        //     let stuck=concurrent.goChanging()
        //
        //     bilan.assertTrue(stuck.allSquareAndTrianglesAsSortedString()=='square:["[0,7,8,1]","[1,8,9,2]","[10,17,18,11]","[11,18,19,12]","[12,19,20,13]","[14,21,22,15]","[15,22,23,16]","[16,23,24,17]","[17,24,25,18]","[18,25,26,19]","[19,26,27,20]","[2,9,10,3]","[21,28,29,22]","[22,29,30,23]","[23,30,31,24]","[24,31,32,25]","[25,32,33,26]","[26,33,34,27]","[27,34,61,54]","[28,35,36,29]","[29,36,37,30]","[3,10,11,4]","[30,37,38,31]","[31,38,39,32]","[32,39,40,33]","[33,40,41,34]","[34,67,68,61]","[35,42,43,36]","[36,43,44,37]","[37,44,45,38]","[38,45,46,39]","[39,46,72,40]","[4,11,12,5]","[40,72,73,41]","[41,73,74,67]","[45,84,85,46]","[46,85,86,79]","[5,12,13,6]","[54,61,62,55]","[61,68,69,62]","[67,74,75,68]","[68,75,76,69]","[7,14,15,8]","[72,79,80,73]","[73,80,81,74]","[74,81,82,75]","[75,82,83,76]","[79,86,87,80]","[8,15,16,9]","[80,87,88,81]","[81,88,89,82]","[82,89,90,83]","[84,91,92,85]","[85,92,93,86]","[86,93,94,87]","[87,94,95,88]","[88,95,96,89]","[89,96,97,90]","[9,16,17,10]"]triangle:["[34,41,67]","[46,79,72]"]')
        //
        // }
        //
        //
        //
        //
        // {
        //     let mamesh0 = new Mamesh()
        //     let gene0 = new reseau.BasisForRegularReseau()
        //     gene0.origin = new XYZ(-1, -1, 0)
        //     gene0.end = new XYZ(1, 1, 0)
        //     gene0.nbI = 5
        //     gene0.nbJ = 5
        //     new reseau.Regular(mamesh0, gene0).goChanging()
        //     mamesh0.name = 'centre00'
        //
        //
        //     let IN_mamesh = new Mamesh()
        //     let gene = new reseau.BasisForRegularReseau()
        //     gene.origin = new XYZ(0.1, 0.1, 0)
        //     gene.end = new XYZ(2, 2, 0)
        //     gene.nbI = 5
        //     gene.nbJ = 5
        //     new reseau.Regular(IN_mamesh, gene).goChanging()
        //     IN_mamesh.name = 'centre11'
        //
        //
        //     let concurrent = new mameshModification.ConcurrentMameshesGraterAndSticker([mamesh0, IN_mamesh])
        //     let stuck=concurrent.goChanging()
        //
        //     stuck.fillLineCatalogue()
        //     bilan.assertTrue(stuck.allLinesAsASortedString()=='straightLines:["[0,1,2,3,4]","[0,5,10,15,20]","[1,6,11,16,21]","[10,11,12,13,14,29]","[15,16,17,18,19,34]","[19,38,43,48]","[2,7,12,17,22,45]","[20,21,22,23,24,38,39]","[23,42,43,44]","[29,34,39,44,49]","[3,8,13,18,23,46]","[4,9,14,19,24,42,47]","[45,46,47,48,49]","[5,6,7,8,9]"]')
        //
        //
        //
        // }
        //
        //
        //
        //
        //
        //
        //
        // {
        //     let mamesh0 = new Mamesh()
        //     let gene0 = new reseau.BasisForRegularReseau()
        //     gene0.origin = new XYZ(-1, -1, 0)
        //     gene0.end = new XYZ(1, 1, 0)
        //     gene0.nbI = 5
        //     gene0.nbJ = 5
        //     new reseau.Regular(mamesh0, gene0).goChanging()
        //     mamesh0.name = 'centre00'
        //
        //
        //     let IN_mamesh = new Mamesh()
        //     let gene = new reseau.BasisForRegularReseau()
        //     gene.origin = new XYZ(0.1, 0.1, 0)
        //     gene.end = new XYZ(2, 2, 0)
        //     gene.nbI = 5
        //     gene.nbJ = 5
        //     new reseau.Regular(IN_mamesh, gene).goChanging()
        //     IN_mamesh.name = 'centre11'
        //
        //
        //     let concurrent = new mameshModification.ConcurrentMameshesGraterAndSticker([mamesh0, IN_mamesh])
        //     concurrent.justGrateAndNotStick=true
        //     concurrent.overlapOnBorder=false
        //
        //     let stuck=concurrent.goChanging()
        //     bilan.assertTrue(stuck==null)
        //
        //     concurrent.OUTGratedMameshes[0].fillLineCatalogue()
        //     concurrent.OUTGratedMameshes[1].fillLineCatalogue()
        //
        //     bilan.assertTrue(concurrent.OUTGratedMameshes[0].allLinesAsASortedString()=='straightLines:["[0,1,2,3,4]","[0,5,10,15,20]","[1,6,11,16,21]","[10,11,12,13,14]","[15,16,17,18]","[2,7,12,17,22]","[20,21,22]","[3,8,13,18]","[4,9,14]","[5,6,7,8,9]"]')
        //     bilan.assertTrue(concurrent.OUTGratedMameshes[1].allLinesAsASortedString()=='straightLines:["[0,1]","[0,5,10,15,20]","[1,6,11,16,21]","[12,13,14,15,16]","[12,17]","[17,18,19,20,21]","[4,5,6]","[4,9,14,19]","[8,13,18]","[8,9,10,11]"]')
        //
        //
        //
        //
        //     //bilan.assertTrue(concurrent.OUTGratedMameshes[0].allLinesAsASortedString()=='straightLines:["[0,1,2,3,4]","[0,5,10,15,20]","[1,6,11,16,21]","[10,11,12,13,14]","[15,16,17,18]","[2,7,12,17,22]","[20,21,22]","[3,8,13,18]","[4,9,14]","[5,6,7,8,9]"]')
        //     //bilan.assertTrue(concurrent.OUTGratedMameshes[1].allLinesAsASortedString()=='straightLines:["[0,5,10,15,20]","[1,0]","[1,6,11,16,21]","[11,10,9,8]","[12,13,14,15,16]","[17,12]","[17,18,19,20,21]","[18,13,8]","[19,14,9,4]","[6,5,4]"]')
        //
        //
        //
        // }
        //
        //
        // {
        //     let mamesh0 = new Mamesh()
        //     let gene0 = new reseau.BasisForRegularReseau()
        //     gene0.origin = new XYZ(-1, -1, 0)
        //     gene0.end = new XYZ(1, 1, 0)
        //     gene0.nbI = 5
        //     gene0.nbJ = 5
        //     new reseau.Regular(mamesh0, gene0).goChanging()
        //     mamesh0.name = 'centre00'
        //
        //
        //     let IN_mamesh = new Mamesh()
        //     let gene = new reseau.BasisForRegularReseau()
        //     gene.origin = new XYZ(0.1, 0.1, 0)
        //     gene.end = new XYZ(2, 2, 0)
        //     gene.nbI = 5
        //     gene.nbJ = 5
        //     new reseau.Regular(IN_mamesh, gene).goChanging()
        //     IN_mamesh.name = 'centre11'
        //
        //
        //     let concurrent = new mameshModification.ConcurrentMameshesGraterAndSticker([mamesh0, IN_mamesh])
        //     concurrent.justGrateAndNotStick=true
        //
        //     let stuck=concurrent.goChanging()
        //     bilan.assertTrue(stuck==null)
        //
        //     concurrent.OUTGratedMameshes[0].fillLineCatalogueCheckingThatLineStayInside()
        //     concurrent.OUTGratedMameshes[1].fillLineCatalogueCheckingThatLineStayInside()
        //
        //     bilan.assertTrue(concurrent.OUTGratedMameshes[0].allLinesAsASortedString()=='straightLines:["[0,1,2,3,4]","[0,5,10,15,20]","[1,6,11,16,21]","[10,11,12,13,14]","[15,16,17,18,19]","[2,7,12,17,22]","[20,21,22,23,24]","[3,8,13,18,23]","[4,9,14,19,24]","[5,6,7,8,9]"]')
        //     bilan.assertTrue(concurrent.OUTGratedMameshes[1].allLinesAsASortedString()=='straightLines:["[13,12,11,10,9]","[14,15,16,17,18]","[19,14,9,4]","[19,20,21,22,23]","[2,7,12,17,22]","[20,15,10,5,0]","[21,16,11,6,1]","[3,2,1,0]","[3,8,13,18,23]","[8,7,6,5,4]"]')
        //
        // }
        //
        //
        //
        // {
        //
        //         let mamesh0 = new Mamesh()
        //         let gene0 = new reseau.BasisForRegularReseau()
        //         gene0.end = new XYZ(1, 1, 0)
        //         gene0.origin = new XYZ(-1, -1, 0)
        //         gene0.nbI = 3
        //         gene0.nbJ = 3
        //         new reseau.Regular(mamesh0, gene0).goChanging()
        //         mamesh0.name = 'centre00'
        //
        //
        //         let IN_mamesh = new Mamesh()
        //         let gene = new reseau.BasisForRegularReseau()
        //         gene.end = new XYZ(2.1, 2.1, 0)
        //         gene.origin = new XYZ(0.1, 0.1, 0)
        //         gene.nbI = 3
        //         gene.nbJ = 3
        //         new reseau.Regular(IN_mamesh, gene).goChanging()
        //         IN_mamesh.name = 'centre11'
        //
        //
        //         let source=[IN_mamesh.vertices[0],IN_mamesh.vertices[3],IN_mamesh.vertices[4],IN_mamesh.vertices[1]]
        //         let map=new mameshModification.FindStickingMapFromSquare(mamesh0.smallestSquares,source).goChanging()
        //
        //
        //
        //
        //     let merger=new mameshModification.Merger(mamesh0,IN_mamesh)
        //     merger.merginMap=map
        //     merger.goChanging()
        //
        //     mamesh0.fillLineCatalogue()
        //     bilan.assertTrue(mamesh0.allLinesAsASortedString()=='straightLines:["[0,1,2]","[0,3,6]","[1,4,7,15]","[11,14,17]","[15,16,17]","[2,5,8,16]","[3,4,5,11]","[6,7,8,14]"]')
        //
        // }
        //
        //
        // {
        //
        //     let mamesh0 = new Mamesh()
        //     let gene0 = new reseau.BasisForRegularReseau()
        //     gene0.origin = new XYZ(-1, -1, 0)
        //     gene0.end = new XYZ(1, 1, 0)
        //     gene0.nbI = 3
        //     gene0.nbJ = 3
        //     new reseau.Regular(mamesh0, gene0).goChanging()
        //     mamesh0.name = 'centre00'
        //
        //
        //     let IN_mamesh = new Mamesh()
        //     let gene = new reseau.BasisForRegularReseau()
        //     gene.origin = new XYZ(0.1, -1.1, 0)
        //     gene.end = new XYZ(2.1, 1.1, 0)
        //     gene.nbI = 3
        //     gene.nbJ = 3
        //     new reseau.Regular(IN_mamesh, gene).goChanging()
        //     IN_mamesh.name = 'centre11'
        //
        //
        //     let source=[IN_mamesh.vertices[0],IN_mamesh.vertices[3],IN_mamesh.vertices[4],IN_mamesh.vertices[1],IN_mamesh.vertices[1],IN_mamesh.vertices[4],IN_mamesh.vertices[5],IN_mamesh.vertices[2]]
        //     let map=new mameshModification.FindStickingMapFromSquare(mamesh0.smallestSquares,source).goChanging()
        //
        //
        //     let merger=new mameshModification.Merger(mamesh0,IN_mamesh)
        //     merger.merginMap=map
        //     merger.goChanging()
        //
        //     mamesh0.fillLineCatalogue()
        //     bilan.assertTrue(mamesh0.allLinesAsASortedString()=='straightLines:["[0,1,2]","[0,3,6,15]","[1,4,7,16]","[15,16,17]","[2,5,8,17]","[3,4,5]","[6,7,8]"]')
        //
        //
        //
        //     // let lineV0=new visu3d.LinesVisuFastMaker(mamesh0,mathisFrame.scene)
        //     // lineV0.color=new BABYLON.Color3(0,1,0)
        //     // lineV0.goChanging()
        //
        //     // let lineV1=new visu3d.LinesVisuFastMaker(IN_mamesh,mathisFrame.scene)
        //     // lineV1.color=new BABYLON.Color3(1,0,0)
        //     // lineV1.goChanging()
        //
        // }
        //
        //
        //
        // {
        //
        //     let IN_mamesh=new Mamesh()
        //
        //
        //
        //     let gene=new reseau.BasisForRegularReseau()
        //     gene.end=new XYZ(1,1,0)
        //     gene.origin=new XYZ(-1,-1,0)
        //     gene.nbI=5
        //     gene.nbJ=5
        //
        //     new reseau.Regular(IN_mamesh,gene).goChanging()
        //
        //     let concurrent=new mameshModification.ConcurrentMameshesGraterAndSticker([IN_mamesh])
        //     concurrent.goChanging()
        //
        //     let vertexAndDist=concurrent.closestVertexFromAMamesh(new XYZ(0,0,0),0)
        //
        //     /**longueur totale:2, divisé en 4 (car 5 subdivision), la longueur moyenne est donne exactement 0.5*/
        //     bilan.assertTrue(IN_mamesh.maxLinkLength()==0.5)
        //
        //
        //     bilan.assertTrue(vertexAndDist.vertex.position.x==0&&vertexAndDist.vertex.position.y==0&&vertexAndDist.distToBorder==1)
        //
        //     vertexAndDist=concurrent.closestVertexFromAMamesh(new XYZ(-1,-1,0),0)
        //     bilan.assertTrue(vertexAndDist.vertex.position.x==-1&&vertexAndDist.vertex.position.y==-1&&vertexAndDist.distToBorder==0)
        //
        //     vertexAndDist=concurrent.closestVertexFromAMamesh(new XYZ(-0.9,-0.9,0),0)
        //     bilan.assertTrue(vertexAndDist.vertex.position.x==-1&&vertexAndDist.vertex.position.y==-1&&vertexAndDist.distToBorder==0)
        //
        //     vertexAndDist=concurrent.closestVertexFromAMamesh(new XYZ(-2,-1,0),0)
        //     bilan.assertTrue(vertexAndDist==null)
        //
        //
        //
        //
        //
        // }
        //
        //
        // {
        //
        //     let IN_mamesh = new Mamesh()
        //
        //
        //     let gene = new reseau.BasisForRegularReseau()
        //     gene.end = new XYZ(1, 1, 0)
        //     gene.origin = new XYZ(-1, -1, 0)
        //     gene.nbI = 3
        //     gene.nbJ = 3
        //
        //     new reseau.Regular(IN_mamesh, gene).goChanging()
        //
        //     let mameshToKeep:Vertex[]=[]
        //     IN_mamesh.vertices.forEach(v=>mameshToKeep.push(v))
        //     mameshToKeep.splice(0,1)
        //
        //     let subExtra=new grateAndGlue.SubMameshExtractor(IN_mamesh,mameshToKeep)
        //     let subMam:Mamesh=subExtra.goChanging()
        //
        //     subMam.fillLineCatalogueCheckingThatLineStayInside()
        //
        //     // new verticesMover.rotation(subMam.vertices,0.1).goChanging()
        //     // new visu3d.LinesViewer(subMam,mathisFrame.scene).goChanging()
        //     // new visu3d.SurfaceViewer(subMam,mathisFrame.scene).goChanging()
        //
        //     bilan.assertTrue(subMam.allLinesAsASortedString()=='straightLines:["[0,3,6]","[1,0]","[1,4,7]","[2,3,4]","[5,2]","[5,6,7]"]')
        //
        //
        //
        // }
        //
        // {
        //
        //     let IN_mamesh = new Mamesh()
        //
        //
        //     let gene = new reseau.BasisForRegularReseau()
        //     gene.end = new XYZ(1, 1, 0)
        //     gene.origin = new XYZ(-1, -1, 0)
        //     gene.nbI = 5
        //     gene.nbJ = 5
        //
        //     new reseau.Regular(IN_mamesh, gene).goChanging()
        //
        //     let mameshToKeep:Vertex[]=[]
        //     IN_mamesh.vertices.forEach(v=>{
        //         if (!v.param.equals(new XYZ(2,2,0))){
        //             mameshToKeep.push(v)
        //         }
        //     })
        //
        //     let subExtra=new grateAndGlue.SubMameshExtractor(IN_mamesh,mameshToKeep)
        //     let subMam:Mamesh=subExtra.goChanging()
        //     subMam.fillLineCatalogueCheckingThatLineStayInside()
        //
        //
        //
        //     bilan.assertTrue(subMam.allLinesAsASortedString()=='straightLines:["[0,1,2,3,4]","[0,5,10,15,20]","[1,6,11,16,21]","[10,11]","[13,14]","[15,16,17,18,19]","[17,22]","[2,7]","[20,21,22,23,24]","[3,8,13,18,23]","[4,9,14,19,24]","[5,6,7,8,9]"]')
        //
        //
        // }
        //
        //
        // {
        //
        //     let IN_mamesh = new Mamesh()
        //
        //
        //     let gene = new reseau.BasisForRegularReseau()
        //     gene.end = new XYZ(1, 1, 0)
        //     gene.origin = new XYZ(-1, -1, 0)
        //     gene.nbI = 5
        //     gene.nbJ = 5
        //
        //     new reseau.Regular(IN_mamesh, gene).goChanging()
        //
        //     let mameshToKeep:Vertex[]=[]
        //     IN_mamesh.vertices.forEach(v=>{
        //         if (v.param.x!=2){
        //             mameshToKeep.push(v)
        //         }
        //     })
        //
        //     let subExtra=new grateAndGlue.SubMameshExtractor(IN_mamesh,mameshToKeep)
        //     let subMam:Mamesh=subExtra.goChanging()
        //     subMam.fillLineCatalogueCheckingThatLineStayInside()
        //
        //
        //     bilan.assertTrue(subMam.allLinesAsASortedString()=='straightLines:["[0,1,2,3,4]","[0,5]","[1,6]","[15,16,17,18,19]","[15,20]","[16,21]","[17,22]","[18,23]","[19,24]","[2,7]","[20,21,22,23,24]","[3,8]","[4,9]","[5,6,7,8,9]"]')
        //
        //
        // }
        //
        //
        //
        // {
        //     let IN_mamesh = new Mamesh()
        //     let gene = new reseau.BasisForRegularReseau()
        //     gene.end = new XYZ(1, 1, 0)
        //     gene.origin = new XYZ(-1, -1, 0)
        //     gene.nbI = 3
        //     gene.nbJ = 3
        //
        //     new reseau.Regular(IN_mamesh, gene).goChanging()
        //
        //     IN_mamesh.fillLineCatalogue()
        //
        //     IN_mamesh.paramToVertex.removeKey(new XYZ(0, 0, 0))
        //
        //     new LinesCuter(IN_mamesh).goChanging()
        //
        //     bilan.assertTrue(IN_mamesh.allLinesAsASortedString() == 'straightLines:["[1,2]","[1,4,7]","[2,5,8]","[3,4,5]","[3,6]","[6,7,8]"]')
        // }
        //
        // {
        //     let IN_mamesh = new Mamesh()
        //     let gene = new reseau.BasisForRegularReseau()
        //     gene.end = new XYZ(1, 1, 0)
        //     gene.origin = new XYZ(-1, -1, 0)
        //     gene.nbI = 3
        //     gene.nbJ = 3
        //
        //     new reseau.Regular(IN_mamesh, gene).goChanging()
        //
        //     IN_mamesh.fillLineCatalogue()
        //
        //     IN_mamesh.paramToVertex.removeKey(new XYZ(1, 1, 0))
        //
        //     new LinesCuter(IN_mamesh).goChanging()
        //
        //     bilan.assertTrue(IN_mamesh.allLinesAsASortedString()=='straightLines:["[0,1,2]","[0,3,6]","[2,5,8]","[6,7,8]"]')
        // }
        //
        //
        // {
        //     let IN_mamesh = new Mamesh()
        //
        //     let flat=new creationFlat.SingleSquareWithOneDiag(IN_mamesh)
        //     flat.addALoopLineAround=true
        //     flat.goChanging()
        //
        //     IN_mamesh.fillLineCatalogue()
        //
        //     IN_mamesh.paramToVertex.removeKey(new XYZ(0, 0, 0))
        //
        //     new LinesCuter(IN_mamesh).goChanging()
        //
        //     bilan.assertTrue(IN_mamesh.allLinesAsASortedString()=='straightLines:["[1,2,3]","[1,3]"]')
        //     //bilan.assertTrue(IN_mamesh.allLinesAsASortedString() == 'straightLines:["[1,2]","[1,4,7]","[2,5,8]","[3,4,5]","[3,6]","[6,7,8]"]')
        // }
        //
        //
        //
        //
        //
        // {
        //     let mamesh0=new Mamesh()
        //     let gene0=new reseau.BasisForRegularReseau()
        //     gene0.end=new XYZ(1,1,0)
        //     gene0.origin=new XYZ(-1,-1,0)
        //     gene0.nbI=3
        //     gene0.nbJ=3
        //     new reseau.Regular(mamesh0,gene0).goChanging()
        //     mamesh0.name='centre00'
        //
        //
        //
        //     let IN_mamesh=new Mamesh()
        //     let gene=new reseau.BasisForRegularReseau()
        //     gene.end=new XYZ(2,2,0)
        //     gene.origin=new XYZ(0,0,0)
        //     gene.nbI=3
        //     gene.nbJ=3
        //     new reseau.Regular(IN_mamesh,gene).goChanging()
        //     IN_mamesh.name='centre11'
        //
        //
        //
        //     let concurrent=new mameshModification.ConcurrentMameshesGraterAndSticker([mamesh0,IN_mamesh])
        //     concurrent.goChanging()
        //
        //     let xyz=new XYZ(1,1,0)
        //     let vertexAndMamesh=concurrent.findBestMamesh(xyz)
        //     bilan.assertTrue(vertexAndMamesh.vertex.position.almostEqual(xyz)&&vertexAndMamesh.bestMamesh.name=='centre11')
        //
        //
        //     xyz=new XYZ(0,2,0)
        //     vertexAndMamesh=concurrent.findBestMamesh(xyz)
        //     bilan.assertTrue(vertexAndMamesh.vertex.position.almostEqual(xyz)&&vertexAndMamesh.bestMamesh.name=='centre11')
        //
        //
        //     xyz=new XYZ(2,0,0)
        //     vertexAndMamesh=concurrent.findBestMamesh(xyz)
        //     bilan.assertTrue(vertexAndMamesh.vertex.position.almostEqual(xyz)&&vertexAndMamesh.bestMamesh.name=='centre11')
        //
        //     xyz=new XYZ(1,1,0)
        //     vertexAndMamesh=concurrent.findBestMamesh(xyz)
        //     bilan.assertTrue(vertexAndMamesh.vertex.position.almostEqual(xyz)&&vertexAndMamesh.bestMamesh.name=='centre11')
        //
        //     xyz=new XYZ(2,2,0)
        //     vertexAndMamesh=concurrent.findBestMamesh(xyz)
        //     bilan.assertTrue(vertexAndMamesh.vertex.position.almostEqual(xyz)&&vertexAndMamesh.bestMamesh.name=='centre11')
        //
        //
        //     xyz=new XYZ(0,0,0)
        //     vertexAndMamesh=concurrent.findBestMamesh(xyz)
        //     bilan.assertTrue(vertexAndMamesh.vertex.position.almostEqual(xyz)&&vertexAndMamesh.bestMamesh.name=='centre00')
        //
        //
        //     xyz=new XYZ(-0.9,-0.9,0)
        //     vertexAndMamesh=concurrent.findBestMamesh(xyz)
        //     bilan.assertTrue(vertexAndMamesh.vertex.position.almostEqual(new XYZ(-1,-1,0))&&vertexAndMamesh.bestMamesh.name=='centre00')
        //
        //
        //     xyz=new XYZ(-1,1,0)
        //     vertexAndMamesh=concurrent.findBestMamesh(xyz)
        //     bilan.assertTrue(vertexAndMamesh.vertex.position.almostEqual(xyz)&&vertexAndMamesh.bestMamesh.name=='centre00')
        //
        //
        //     xyz=new XYZ(1,-1,0)
        //     vertexAndMamesh=concurrent.findBestMamesh(xyz)
        //     bilan.assertTrue(vertexAndMamesh.vertex.position.almostEqual(xyz)&&vertexAndMamesh.bestMamesh.name=='centre00')
        //
        //
        //
        // }
        //
        // return bilan


    }





}