
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

    

    /**some object are created from the very begining*/
    export  var geo:Geo= new Geo()
    export var logger:Logger=new Logger()

    export var deconnectViewerForTest=false

    
    // $.getScript("my_lovely_script.js", function(){
    //    
    // });
    
    


    


}







