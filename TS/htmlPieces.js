/**
 * Created by vigon on 21/04/2016.
 */
var mathis;
(function (mathis) {
    function nCanvasInOneLine(n, $containter) {
        var res = [];
        var width = mathis.roundWithGivenPrecision(100 / n, 2) + "%";
        for (var i = 0; i < n; i++) {
            var canvas = document.createElement('canvas');
            canvas.id = "renderCanvas" + i;
            //canvas.width  = 200;
            //canvas.height = 200*i;
            //canvas.style.zIndex   = 8;
            //canvas.style.position = "relative";
            //canvas.style.border   = "1px solid";
            canvas.style.width = width;
            canvas.style.height = "100%";
            canvas.style.backgroundColor = "red";
            $containter.appendChild(canvas);
            res.push(canvas);
        }
        return res;
    }
    mathis.nCanvasInOneLine = nCanvasInOneLine;
    function nDivInOneLine(n, $containter, separatorCSS) {
        var divs = [];
        $containter.style.position = "relative";
        var width = mathis.roundWithGivenPrecision(100 / n, 4);
        for (var i = 0; i < n; i++) {
            var div = document.createElement('div');
            div.id = "divContainer" + i;
            div.style.display = "inline-block";
            div.style.position = "absolute";
            div.style.top = "0";
            div.style.left = (i * width) + "%";
            div.style.width = width + "%";
            div.style.height = "100%";
            //div.style.backgroundColor="red"
            if (separatorCSS != null && i > 0)
                div.style.borderLeft = separatorCSS;
            $containter.appendChild(div);
            divs.push(div);
        }
        return divs;
    }
    mathis.nDivInOneLine = nDivInOneLine;
    function nDivContainningCanvasInOneLine(n, $containter, separatorCSS) {
        var canvass = [];
        var divs = [];
        $containter.style.position = "relative";
        var width = mathis.roundWithGivenPrecision(100 / n, 4);
        for (var i = 0; i < n; i++) {
            var div = document.createElement('div');
            div.id = "divContainer" + i;
            div.style.display = "inline-block";
            div.style.position = "absolute";
            div.style.top = "0";
            div.style.left = (i * width) + "%";
            div.style.width = width + "%";
            div.style.height = "100%";
            //div.style.backgroundColor="red"
            if (separatorCSS != null && i > 0)
                div.style.borderLeft = separatorCSS;
            $containter.appendChild(div);
            divs.push(div);
            var canvas = document.createElement('canvas');
            canvas.id = "renderCanvas" + i;
            canvas.style.width = "100%";
            canvas.style.height = "100%";
            //canvas.style.backgroundColor="red"
            div.appendChild(canvas);
            canvass.push(canvas);
        }
        return { divs: divs, canvass: canvass };
    }
    mathis.nDivContainningCanvasInOneLine = nDivContainningCanvasInOneLine;
    function legend(heightCSS, $container, bottom, separatorCSS) {
        if (bottom === void 0) { bottom = true; }
        var div = document.createElement('div');
        div.style.display = "inline-block";
        div.style.position = "absolute";
        if (bottom)
            div.style.bottom = "0";
        else
            div.style.top = "0";
        div.style.left = "0";
        div.style.width = "100%";
        div.style.height = heightCSS;
        div.style.zIndex = (parseInt($container.style.zIndex) + 10) + "";
        //div.style.backgroundColor="red"
        if (separatorCSS != null)
            div.style.borderTop = separatorCSS;
        $container.appendChild(div);
        return div;
        // position: absolute;
        // height: 20px;
        // width: 100%;
        // left: 0;
        // bottom: 0;
    }
    mathis.legend = legend;
})(mathis || (mathis = {}));
