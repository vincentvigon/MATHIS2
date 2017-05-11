var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var mathis;
(function (mathis) {
    var appli;
    (function (appli) {
        var MainIndexPage = (function (_super) {
            __extends(MainIndexPage, _super);
            function MainIndexPage(mathisFrame, testMode) {
                _super.call(this, mathisFrame, testMode);
            }
            MainIndexPage.prototype.build = function () {
                this.severalPages.addPage(new appli.WhyBlabla(this.mathisFrame));
                this.severalPages.addPage(new appli.PureJavascriptTuto());
                this.severalPages.addPage(new appli.TypescriptTuto());
                this.severalPages.addPage(new appli.MathisFrameDocu(this.mathisFrame));
                this.severalPages.addPage(new appli.BasicDocu(this.mathisFrame));
                this.severalPages.addPage(new appli.ReseauDocu(this.mathisFrame));
                this.severalPages.addPage(new appli.SurfaceDocu(this.mathisFrame));
                this.severalPages.addPage(new appli.LinksDocu(this.mathisFrame));
                this.severalPages.addPage(new appli.MacamDocu(this.mathisFrame));
                this.severalPages.addPage(new appli.VerticesViewingDocu(this.mathisFrame));
                this.severalPages.addPage(new appli.LinesViewingDocu(this.mathisFrame));
                this.severalPages.addPage(new appli.LinksViewingDocu(this.mathisFrame));
                this.severalPages.addPage(new appli.SurfaceViewerDocu(this.mathisFrame));
                this.severalPages.addPage(new appli.GraphDistance(this.mathisFrame));
                this.severalPages.addPage(new appli.GrateMergeStick(this.mathisFrame));
                this.severalPages.addPage(new appli.DichoDocu(this.mathisFrame));
                this.severalPages.addSeparator("CONSTRUCTIONS EXAMPlE");
                //this.severalPages.addPage( new SolidsDocu(this.mathisFrame))
                this.severalPages.addPage(new appli.TorusPlatonicDocu(this.mathisFrame));
                // this.severalPages.addPage( new RandomGraphDocu(this.mathisFrame))
                /**for coder*/
                this.severalPages.addSeparator("FOR COLLABORATORS");
                this.severalPages.addPage(new appli.ColaborateWithGit());
                this.severalPages.addPage(new appli.DocutestTuto());
                this.severalPages.addPage(new appli.DocutestTutoAdvanced());
                /**pure test*/
                this.severalPages.addSeparator("PURE TEST (NO DOCU)", true);
                this.severalPages.addPage(new appli.Creation2dDocu(this.mathisFrame), true);
                // this.severalPages.addSeparator("GUILLAUME'S PAGES",true)
                // this.severalPages.addPage( new ConnectorTest(this.mathisFrame),true)
            };
            return MainIndexPage;
        }(appli.IndexPage));
        function startSite() {
            var mathisFrame = new mathis.MathisFrame('placeForMathis');
            /**Attention : la variable globale indexPage est affectée APRES la construction de MainIndexPage.
             * Pour toutes les opérations qui se font pendant la construction, indexPage est null ! */
            appli.indexPage = new MainIndexPage(mathisFrame, false);
            appli.indexPage.go();
        }
        appli.startSite = startSite;
    })(appli = mathis.appli || (mathis.appli = {}));
})(mathis || (mathis = {}));
