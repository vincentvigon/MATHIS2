/**
 * Created by vigon on 09/05/2017.
 */


module mathis{


    export module affiche {


        import Color3 = BABYLON.Color3;

        export function start() {

            let mathisFrame = new MathisFrame()
            mathisFrame.backgroundColor=new Color("#eecaf9")
            mathisFrame.resetScene()


            mathisFrame.showScreenshotButton({width:672*4 ,height:950*4})


            let pieceOfCode=new appli.ParcoursMaths(mathisFrame)

            let binder = new appli.Binder(pieceOfCode, null, mathisFrame)
            binder.go()
            pieceOfCode.goForTheFirstTime()

        }



        export function startCube() {

            let mathisFrame = new MathisFrame()
            mathisFrame.backgroundColor=new Color("#b3ffff")//"#eecaf9")
            mathisFrame.resetScene()


            /*4961 x 7016*/
            mathisFrame.showScreenshotButton({width:4961 ,height:7016})

            let pieceOfCode=new appli.CubeAffiche(mathisFrame)

            let binder = new appli.Binder(pieceOfCode, null, mathisFrame)
            binder.go()
            pieceOfCode.goForTheFirstTime()

        }



    }

}


