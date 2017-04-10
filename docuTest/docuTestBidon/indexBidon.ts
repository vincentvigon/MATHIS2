

declare function prettyPrint()

module mathis{

    export module documentation{


        class TestIndexPage extends IndexPage{


            constructor(mathisFrame:MathisFrame,testMode:boolean){
               super(mathisFrame,testMode)
            }

             build(){
                 this.severalPages.addPage(new BidonPage1(this.mathisFrame))
                 this.severalPages.addPage(new BidonPage2(this.mathisFrame),true)
             }


        }

        export var indexPage:IndexPage

        export function startTestDocuTestBidon(){

            let mathisFrame=new MathisFrame('placeForMathis')
            indexPage=new TestIndexPage(mathisFrame,true)
            indexPage.go()

        }










    }








}

