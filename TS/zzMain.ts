
/**
 * Created by vigon on 08/12/2015.
 */

/**global variables */

/** FROM
 * http://stackoverflow.com/questions/13815640/a-proper-wrapper-for-console-log-with-correct-line-number*/


declare var $
/**for dev only*/
var cc:any
let showDevMessages=true
if (showDevMessages) {
    cc= console.log.bind(window.console)
}
else cc= function (){}


module mathis{

    //export var geo:mathis.Geo
    // export var logger:mathis.Logger
    //
    // export function startMathis(){
    //     /**some object are created from the very beginning*/
    //     //geo= new Geo()
    //     logger=new Logger()
    // }



    export var deconnectViewerForTest=false


}







