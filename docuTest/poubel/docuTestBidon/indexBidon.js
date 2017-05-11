var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var mathis;
(function (mathis) {
    var appli;
    (function (appli) {
        var TestIndexPage = (function (_super) {
            __extends(TestIndexPage, _super);
            function TestIndexPage(mathisFrame, testMode) {
                _super.call(this, mathisFrame, testMode);
            }
            TestIndexPage.prototype.build = function () {
                this.severalPages.addPage(new appli.BidonPage1(this.mathisFrame));
                this.severalPages.addPage(new appli.BidonPage2(this.mathisFrame), true);
            };
            return TestIndexPage;
        }(appli.IndexPage));
        function startTestDocuTestBidon() {
            var mathisFrame = new mathis.MathisFrame('placeForMathis');
            appli.indexPage = new TestIndexPage(mathisFrame, false);
            appli.indexPage.go();
        }
        appli.startTestDocuTestBidon = startTestDocuTestBidon;
    })(appli = mathis.appli || (mathis.appli = {}));
})(mathis || (mathis = {}));
