/**
 * Created by vigon on 09/05/2017.
 */


module mathis{


    export module totoModule {


        export function start_A_simple() {

            let mathisFrame1 = new MathisFrame('mathisFrame1')
            let mamesh = new creation3D.Polyhedron(creation3D.PolyhedronType.ElongatedPentagonalCupola).go()
            new visu3d.SurfaceViewer(mamesh, mathisFrame1.scene).go()

            let mathisFrame2 = new MathisFrame('mathisFrame2')
            let mamesh2 = new creation3D.Polyhedron(creation3D.PolyhedronType.Cube).go()
            new visu3d.SurfaceViewer(mamesh2, mathisFrame2.scene).go()


        }
    }

}


