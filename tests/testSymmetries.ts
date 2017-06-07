/**
 * Created by vigon on 25/04/2016.
 */



module mathis {


    export function symmetriesTest():Bilan {


        let bilan = new Bilan()

        
        
        
        
        

        /**test squareMainSymmetries*/
        function testOneSymmetry(sym:(param:XYZ)=>XYZ, mamesh:Mamesh):void {
            let vertexAfterTrans = new HashMap<Vertex,boolean>(true)
            mamesh.vertices.forEach(v=> {
                let paramTrans:XYZ = sym(v.param)
                vertexAfterTrans.putValue(mamesh.findVertexFromParam(paramTrans), true)
            })

            bilan.assertTrue(vertexAfterTrans.allValues().length == mamesh.vertices.length)

        }

        function testAllSymmetries(mamesh:Mamesh, symmetries:StringMap<(param:XYZ)=>XYZ>) {
            symmetries.allValues().forEach(sym=> {
                testOneSymmetry(sym, mamesh)
            })
        }

        {
            let crea = new reseau.Regular2d()
            crea.nbU = 5
            crea.nbV = 6
            crea.makeLinks=false
            let mamesh = crea.go()
            new mameshModification.SquareDichotomer(mamesh).go()
            new mameshModification.SquareDichotomer(mamesh).go()
            testAllSymmetries(mamesh, symmetries.cartesian(crea.nbU, crea.nbV))
        }
        {

            let crea = new reseau.Regular2d()
            crea.nbU = 3
            /**with even number, the IN_mamesh is not j-symmetric !!!!*/
            crea.nbV = 7
            crea.oneMoreVertexForOddLine = true
            crea.squareVersusTriangleMaille = false
            let mamesh =crea.go()

            testAllSymmetries(mamesh, symmetries.cartesian(crea.nbU, crea.nbV, crea.oneMoreVertexForOddLine))


        }

        {

            let crea = new reseau.Regular2d()
            crea.nbU = 9
            /**with even number, the IN_mamesh is not j-symmetric !!!!*/
            crea.nbV = 5
            crea.oneMoreVertexForOddLine = false
            crea.squareVersusTriangleMaille = false
            let mamesh = crea.go()

            let dicho=new mameshModification.TriangleDichotomer(mamesh)
            dicho.makeLinks=true
            dicho.go()
            dicho=new mameshModification.TriangleDichotomer(mamesh)
            dicho.makeLinks=true
            dicho.go()


            testAllSymmetries(mamesh, symmetries.cartesian(crea.nbU, crea.nbV, crea.oneMoreVertexForOddLine))

        }



        {
            for (let nbSides = 3; nbSides < 12; nbSides++) {
                let crea = new reseau.TriangulatedPolygone( nbSides)
                let mamesh =crea.go()
                let dicho=new mameshModification.TriangleDichotomer(mamesh)
                dicho.makeLinks=true
                dicho.go()
                dicho=new mameshModification.TriangleDichotomer(mamesh)
                dicho.makeLinks=true
                dicho.go()
                testAllSymmetries(mamesh, symmetries.polygonRotations(nbSides))
            }

        }


        {

            let nbSides=5
                let crea = new reseau.TriangulatedPolygone(nbSides)
                let mamesh =crea.go()
            let dicho=new mameshModification.TriangleDichotomer(mamesh)
            dicho.makeLinks=true
            dicho.go()
            dicho=new mameshModification.TriangleDichotomer(mamesh)
            dicho.makeLinks=true
            dicho.go()
                testAllSymmetries(mamesh, symmetries.polygonRotations(nbSides))
            // let lineVi = new visu3d.LinesVisuFastMaker(IN_mamesh, mathisFrame.scene)
            // lineVi.goChanging()

        }






        {
            bilan.assertTrue(roundWithGivenPrecision(5.749999999, 3) == 5.75)
            bilan.assertTrue(roundWithGivenPrecision(-5.789999999, 5) == -5.79)
            bilan.assertTrue(roundWithGivenPrecision(5.749999936, 9) == 5.749999936)
        }


        return bilan


    }
}