/**
 * Created by vigon on 09/05/2017.
 */


module mathis{


    export module totoModule {


        export function start_A_simple() {

            let mathisFrame1 = new MathisFrame('mathisFrame1')
            let mamesh1 = new polyhedron.Polyhedron("truncated dodecahedron").go()
            new visu3d.SurfaceViewer(mamesh1, mathisFrame1.scene).go()
            new visu3d.LinksViewer(mamesh1, mathisFrame1.scene).go()


            let mathisFrame2 = new MathisFrame('mathisFrame2')
            let mamesh2 = new polyhedron.Polyhedron("cube").go()
            new visu3d.SurfaceViewer(mamesh2, mathisFrame2.scene).go()

            new visu3d.VerticesViewer(mamesh2, mathisFrame2.scene).go()


        }
    }

}


