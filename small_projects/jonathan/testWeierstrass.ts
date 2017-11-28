/**
 * Created by vigon on 19/07/2017.
 */


module mathis{
    export module appli{
        export class testWeierstrass implements PieceOfCode{
            NAME = "testWeierstrass"
            TITLE = ""
            taille = 3
            $$$taille = [1,2,3,5,10]
            precisionX = 30
            $$$precisionX = [4,10,11,30,31,60,100]
            precisionY = 30
            $$$precisionY = [4,10,11,30,31,60,100]
            choix = "Enneper Surface"
            $$$choix = ["catenoid", "helicoid", "Enneper Surface"]
            maille=reseau.Maille.quad
            $$$maille=new Choices(allIntegerValueOfEnume(reseau.Maille),{before:"reseau.Maille.",visualValues:allStringValueOfEnume(reseau.Maille)})

            constructor(private mathisFrame:MathisFrame){
            }

            goForTheFirstTime(){
                this.go()
            }
            go() {


                this.mathisFrame.clearScene(false,false)
                // variables
                let G_re: (u: number, v: number) => number, G_im: (u: number, v: number) => number,
                    h_re: (u: number, v: number) => number, h_im: (u: number, v: number) => number
                switch (this.choix) {
                    case "catenoid":
                        G_re = (u: number, v: number) => {
                            return u
                        }
                        G_im = (u: number, v: number) => {
                            return v
                        }
                        h_re = (u: number, v: number) => {
                            return u / (u * u + v * v)
                        }
                        h_im= (u: number, v: number) => {
                            return -v / (u * u + v * v)
                        }
                        break
                    case "helicoid":
                        G_re = (u: number, v: number) => {
                            return u
                        }
                        G_im = (u: number, v: number) => {
                            return v
                        }
                        h_re = (u: number, v: number) => {
                            return v / (u * u + v * v)
                        }
                        h_im = (u: number, v: number) => {
                            return u / (u * u + v * v)

                        }
                        break
                    case "Enneper Surface":
                        G_re = (u: number, v: number) => {
                            return u
                        }
                        G_im = (u: number, v: number) => {
                            return v
                        }
                        h_re = (u: number, v: number) => {
                            return u
                        }
                        h_im = (u: number, v: number) => {
                            return v
                        }
                        break
                }
                /** création d'un réseau plan 2D **/
                let creator = new mathis.reseau.Regular2dPlus()
                creator.nbU = this.precisionX
                creator.nbV = this.precisionY
                creator.origin = new mathis.XYZ(0, 0, 0)
                creator.end = new mathis.XYZ(this.taille, this.taille, 0)
                creator.maille = this.maille
                creator.markBorder = false

                let mamesh = creator.go()
                switch(this.choix) {
                    case "catenoid":
                    case "helicoid":
                    case "Enneper Surface":
                        for (let vertex of mamesh.vertices) {
                            let a = vertex.position.x
                            let b = vertex.position.y
                            let temp = 2 * PI * a / this.taille
                            let u
                            let v
                            let s = this.taille / 2
                            if (b < s) {
                                u = 1 / (s - b + 1) * cos(temp)
                                v = 1 / (s - b + 1) * sin(temp)
                            }
                            else {
                                u = (b - s + 1) * cos(temp)
                                v = (b - s + 1) * sin(temp)
                            }
                            let rho2 = u * u + v * v
                            if (rho2 > 0) {
                                vertex.position.x = u
                                vertex.position.z = 0
                                vertex.position.y = v
                            }
                        }
                        break
                }

                new jonathan.Weierstrass(mamesh, G_re, G_im, h_re, h_im).go()

                /** Visualisation **/
                new mathis.visu3d.VerticesViewer(mamesh.vertices, this.mathisFrame.scene).go();
                let lineViewer=new mathis.visu3d.LinesViewer(mamesh, this.mathisFrame.scene)
                lineViewer.interpolationOption.interpolationStyle=geometry.InterpolationStyle.hermite
                lineViewer.go();
                new mathis.visu3d.SurfaceViewer(mamesh, this.mathisFrame.scene).go();
            }
        }
    }
}