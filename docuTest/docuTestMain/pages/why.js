/**
 * Created by vigon on 31/01/2017.
 */
var mathis;
(function (mathis) {
    var appli;
    (function (appli) {
        var WhyBlabla = (function () {
            function WhyBlabla(mathisFrame) {
                this.mathisFrame = mathisFrame;
                this.pageIdAndTitle = "mathis, what ?";
                this.severalParts = null;
            }
            WhyBlabla.prototype.go = function () {
                var localAddress = "../../MATHIS/finalized/gauss/gauss.html";
                var serverAddress = "http://92.222.18.63/MATHIS/finalized/gauss/gauss.html";
                var blabla = "<div style=\"padding:2em\">A young library to easily construct math objets inside browser. \n                Targeted: teachers (pedagogic tools), researchers (simulations, portfolio), and all math lovers (amazing). \n                For any comments: vincent #point vigon #hatte math #point unistra #point fr </div>";
                var links = "<div style=\"padding:2em\">As example, <a target=\"_blank\" href=\"http://92.222.18.63/MATHIS/finalized/gauss/gauss.html\">here is a mathis-application</a>,\n                illustrating the Gauss-map and the Gauss-curvature.</div>";
                return $("<div></div>").append(blabla).append(links);
            };
            return WhyBlabla;
        }());
        appli.WhyBlabla = WhyBlabla;
    })(appli = mathis.appli || (mathis.appli = {}));
})(mathis || (mathis = {}));
