/**
 * Created by vigon on 09/05/2017.
 */
var mathis;
(function (mathis) {
    var totoModule;
    (function (totoModule) {
        function start_B_withBinder() {
            {
                var mathisFrame = new mathis.MathisFrame("mathisFrame1");
                var aPieceOfCode = new totoModule.VariableReseau(mathisFrame);
                var binder = new mathis.appli.Binder(aPieceOfCode, null, mathisFrame);
                binder.go();
                aPieceOfCode.goForTheFirstTime();
            }
            {
                var mathisFrame = new mathis.MathisFrame("mathisFrame2");
                var aPieceOfCode = new totoModule.CurvedSurface(mathisFrame);
                var binder = new mathis.appli.Binder(aPieceOfCode, null, mathisFrame);
                binder.go();
                aPieceOfCode.goForTheFirstTime();
            }
            {
                var mathisFrame = new mathis.MathisFrame("mathisFrame3");
                var aPieceOfCode = new totoModule.TorusWithTurningLine(mathisFrame);
                var binder = new mathis.appli.Binder(aPieceOfCode, $('#frame3Commands'), mathisFrame);
                binder.go();
                aPieceOfCode.goForTheFirstTime();
            }
        }
        totoModule.start_B_withBinder = start_B_withBinder;
    })(totoModule = mathis.totoModule || (mathis.totoModule = {}));
})(mathis || (mathis = {}));
