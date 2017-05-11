/**
 * Created by vigon on 08/12/2015.
 */
/**for dev only*/
var cc;
var showDevMessages = true;
if (showDevMessages) {
    cc = console.log.bind(window.console);
}
else
    cc = function () { };
var mathis;
(function (mathis) {
    /**some object are created from the very begining*/
    mathis.geo = new mathis.Geo();
    mathis.logger = new mathis.Logger();
    mathis.deconnectViewerForTest = false;
})(mathis || (mathis = {}));
