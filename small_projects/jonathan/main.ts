/**
 * Created by vigon on 09/05/2017.
 */
module mathis {
    export module jonathan {
        export function start_Weierstrass() {

            // let G_re = (u: number, v: number) => {
            //     return u
            // }
            // let G_im = (u: number, v: number) => {
            //     return v
            // }
            // let h_re = (u: number, v: number) => {
            //     return u
            // }
            // let h_im = (u: number, v: number) => {
            //     return v
            // }
            //
            // let creator = new mathis.reseau.Regular2dPlus()
            // creator.nbU = 30
            // creator.nbV = 30
            // creator.adaptVForRegularReseau = false
            // creator.origin = new mathis.XYZ(0, 0, 0)
            // creator.end = new mathis.XYZ(3, 3, 0)
            // //creator.maille = this.maille
            // creator.oneMoreVertexForOddLine = false
            // creator.markBorder = false
            // let mamesh = creator.go()
            //
            // new jonathan.Weierstrass(mamesh, G_re, G_im, h_re, h_im).go()



            let mathisFrame = new MathisFrame()
            let aPieceOfCode = new appli.testWeierstrass(mathisFrame)

            let binder = new appli.Binder(aPieceOfCode, null, mathisFrame)
            binder.go()
            aPieceOfCode.goForTheFirstTime()
        }
    }
}


