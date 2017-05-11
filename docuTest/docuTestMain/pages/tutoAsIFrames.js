/**
 * Created by vigon on 08/02/2017.
 */
var mathis;
(function (mathis) {
    var appli;
    (function (appli) {
        var PureJavascriptTuto = (function () {
            function PureJavascriptTuto() {
                this.pageIdAndTitle = "hello world in pure javascript";
                this.severalParts = null;
            }
            PureJavascriptTuto.prototype.go = function () {
                appli.indexPage.enlarger.leftToFullPageTemporarily();
                /**obligé d'agir sur le parent car l'iframe sinon n'a pas de hauteur*/
                $('#pageContent').height('100%').empty();
                var $res = $('<div class="aWholeDiv" style="margin: auto"></div>');
                $res.append('<a target="_blank" href="https://drive.google.com/open?id=0B5ZYbxojmGIaMVFvdkZSVVFDY3M">Codes for this tuto and for the next one</a>');
                var $iframe = $('<iframe src="https://docs.google.com/document/d/1tqyLj66D4xKTPKeXS81GCZJwV_WHKH9PNywTrozmfM0/pub?embedded=true" style="overflow:hidden;height:100%;width:100%" height="100%" width="100%"></iframe>');
                $res.append($iframe);
                return $res;
            };
            return PureJavascriptTuto;
        }());
        appli.PureJavascriptTuto = PureJavascriptTuto;
        var TypescriptTuto = (function () {
            function TypescriptTuto() {
                this.pageIdAndTitle = "hello typescript";
                this.severalParts = null;
            }
            TypescriptTuto.prototype.go = function () {
                appli.indexPage.enlarger.leftToFullPageTemporarily();
                /**obligé d'agir sur le parent car l'iframe sinon n'a pas de hauteur*/
                $('#pageContent').height('100%').empty();
                var $res = $('<div class="aWholeDiv"></div>');
                $res.append('<a target="_blank" href="https://drive.google.com/open?id=0B5ZYbxojmGIaMVFvdkZSVVFDY3M">Codes for this tuto and for the next one</a>');
                var $iframe = $('<iframe src="https://docs.google.com/document/d/1p6Ch4wyT9qVzLzdRSVumNRRB6CcpfrtNcJ_wbRku_94/pub?embedded=true" style="overflow:hidden;height:100%;width:100%" height="100%" width="100%"></iframe>');
                $res.append($iframe);
                return $res;
            };
            return TypescriptTuto;
        }());
        appli.TypescriptTuto = TypescriptTuto;
        var ColaborateWithGit = (function () {
            function ColaborateWithGit() {
                this.pageIdAndTitle = "Collaborate via github";
                this.severalParts = null;
            }
            ColaborateWithGit.prototype.go = function () {
                appli.indexPage.enlarger.leftToFullPageTemporarily();
                /**obligé d'agir sur le parent car l'iframe sinon n'a pas de hauteur*/
                $('#pageContent').height('100%').empty();
                var $res = $('<div class="aWholeDiv"></div>');
                //$res.append('<a target="_blank" href="https://drive.google.com/open?id=0B5ZYbxojmGIaMVFvdkZSVVFDY3M">Codes for this tuto and for the next one</a>')
                var $iframe = $('<iframe src="https://docs.google.com/document/d/1TQnS7Xw1LbnqhtgphO020ljo3dA43Gg-wch42v0spAs/pub?embedded=true"  style="overflow:hidden;height:100%;width:100%" height="100%" width="100%"></iframe>');
                $res.append($iframe);
                return $res;
            };
            return ColaborateWithGit;
        }());
        appli.ColaborateWithGit = ColaborateWithGit;
        var DocutestTuto = (function () {
            function DocutestTuto() {
                this.pageIdAndTitle = "PieceOfCode and tests";
                this.severalParts = null;
            }
            DocutestTuto.prototype.go = function () {
                appli.indexPage.enlarger.leftToFullPageTemporarily();
                /**obligé d'agir sur le parent car l'iframe sinon n'a pas de hauteur*/
                $('#pageContent').height('100%').empty();
                var $res = $('<div class="aWholeDiv"></div>');
                //$res.append('<a target="_blank" href="https://drive.google.com/open?id=0B5ZYbxojmGIaMVFvdkZSVVFDY3M">Codes for this tuto and for the next one</a>')
                var $iframe = $('<iframe src="https://docs.google.com/document/d/1ASn11sa2vpkabUXnbVOSnXe7DhIN_die0DZLn3ny9I0/pub?embedded=true"  style="overflow:hidden;height:100%;width:100%" height="100%" width="100%"></iframe>');
                $res.append($iframe);
                return $res;
            };
            return DocutestTuto;
        }());
        appli.DocutestTuto = DocutestTuto;
        var DocutestTutoAdvanced = (function () {
            function DocutestTutoAdvanced() {
                this.pageIdAndTitle = "PieceOfCode and tests (advanced)";
                this.severalParts = null;
            }
            DocutestTutoAdvanced.prototype.go = function () {
                appli.indexPage.enlarger.leftToFullPageTemporarily();
                /**obligé d'agir sur le parent car l'iframe sinon n'a pas de hauteur*/
                $('#pageContent').height('100%').empty();
                var $res = $('<div class="aWholeDiv"></div>');
                //$res.append('<a target="_blank" href="https://drive.google.com/open?id=0B5ZYbxojmGIaMVFvdkZSVVFDY3M">Codes for this tuto and for the next one</a>')
                var $iframe = $('<iframe src="https://docs.google.com/document/d/1fC0cMkL9y1TclKGaz6hHjpW24ieR245oWTGVQETyyw8/pub?embedded=true"  style="overflow:hidden;height:100%;width:100%" height="100%" width="100%"></iframe>');
                $res.append($iframe);
                return $res;
            };
            return DocutestTutoAdvanced;
        }());
        appli.DocutestTutoAdvanced = DocutestTutoAdvanced;
    })(appli = mathis.appli || (mathis.appli = {}));
})(mathis || (mathis = {}));
