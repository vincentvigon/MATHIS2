/**
 * Created by Utilisateur on 09/03/2017.
 */

module mathis{

    export module documentation{


        export class BidonPage2 implements OnePage{
            pageIdAndTitle="BidonPage2"
            severalParts:SeveralParts

            constructor(private mathisFrame:MathisFrame){
                let several=new SeveralParts()
                several.addPart(new BidonPartC(this.mathisFrame))
                this.severalParts=several
            }

            go(){
                return this.severalParts.go()
            }

        }

        class BidonPartC implements PieceOfCode{

            $$$name="BidonPartCbis"
            $$$title="BidonPartC"


            configC1=5
            $$$configC1=[5,6,7]


            configC2=5
            $$$configC2=[5,6,7]


            _savedC1=5
            _savedC2=7
            _savedC3=12



            constructor(private mathisFrame:MathisFrame){
                this.mathisFrame=mathisFrame

            }

            goForTheFirstTime(){
                this.mathisFrame.clearScene()
                this.mathisFrame.addDefaultCamera()
                this.mathisFrame.addDefaultLight()
                let camera=this.mathisFrame.getGrabberCamera()
                this.go()
            }

            go(){


                //$$$begin
                let configC1 = this.configC1
                //$$$end


            }
        }
    }
}

