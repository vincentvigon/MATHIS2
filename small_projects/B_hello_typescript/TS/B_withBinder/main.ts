/**
 * Created by vigon on 09/05/2017.
 */


module mathis {

    export module totoModule {

        export function start_B_withBinder() {

            {
                let mathisFrame = new MathisFrame("mathisFrame1")
                let aPieceOfCode = new totoModule.VariableReseau(mathisFrame)
                let binder = new appli.Binder(aPieceOfCode, null, mathisFrame)
                binder.go()
                aPieceOfCode.goForTheFirstTime()
            }


            {
                let mathisFrame = new MathisFrame("mathisFrame2")
                let aPieceOfCode = new totoModule.CurvedSurface(mathisFrame)

                let binder = new appli.Binder(aPieceOfCode, null, mathisFrame)
                binder.go()
                aPieceOfCode.goForTheFirstTime()
            }

            {
                let mathisFrame = new MathisFrame("mathisFrame3")
                let aPieceOfCode = new totoModule.TorusWithTurningLine(mathisFrame)

                let binder = new appli.Binder(aPieceOfCode, $('#frame3Commands'), mathisFrame)
                binder.go()
                aPieceOfCode.goForTheFirstTime()
            }







        }
    }
}
