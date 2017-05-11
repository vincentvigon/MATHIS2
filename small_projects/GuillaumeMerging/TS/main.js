/**
 * Created by vigon on 11/05/2017.
 */
var mathis;
(function (mathis) {
    function startGuillaume() {
        var mathisFrame = new MathisFrame();
        var pieceOfCode = new ConnectorPiece(mathisFrame);
        var binder = new appli.Binder(pieceOfCode, null, mathisFrame);
        binder.go();
        pieceOfCode.goForTheFirstTime();
    }
    mathis.startGuillaume = startGuillaume;
})(mathis || (mathis = {}));
