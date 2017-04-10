/**
 * Created by vigon on 31/01/2017.
 */




module mathis {

    export module documentation {


        export class WhyBlabla implements OnePage{
            
            pageIdAndTitle="mathis, what ?"
            severalParts:SeveralParts=null


            constructor(private mathisFrame:MathisFrame) {
            }

            go() {
                
                let localAddress="../../MATHIS/finalized/gauss/gauss.html"
                let serverAddress="http://92.222.18.63/MATHIS/finalized/gauss/gauss.html"
                
                let blabla=`<div style="padding:2em">A young library to easily construct math objets inside browser. 
                Targeted: teachers (pedagogic tools), researchers (simulations, portfolio), and all math lovers (amazing). 
                For any comments: vincent #point vigon #hatte math #point unistra #point fr </div>`
                
                let links=`<div style="padding:2em">As example, <a target="_blank" href="http://92.222.18.63/MATHIS/finalized/gauss/gauss.html">here is a mathis-application</a>,
                illustrating the Gauss-map and the Gauss-curvature.</div>`


                
                return $("<div></div>").append(blabla).append(links)
                
            }

        }
    }
}