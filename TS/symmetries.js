/**
 * Created by vigon on 25/04/2016.
 */
var mathis;
(function (mathis) {
    var symmetries;
    (function (symmetries_1) {
        symmetries_1.squareMainSymmetries = [function (a) { return new mathis.XYZ(1 - a.x, a.y, a.z); }, function (a) { return new mathis.XYZ(a.x, 1 - a.y, a.z); }, function (a) { return new mathis.XYZ(1 - a.x, 1 - a.y, a.z); }]; //,(a:XYZ)=>new XYZ(a.y,a.x,a.z),(a:XYZ)=>new XYZ(1-a.y,1-a.x,a.z)  ]
        var keyWords;
        (function (keyWords) {
            keyWords.verticalAxis = 'symI';
            keyWords.horizontalAxis = 'symJ';
            keyWords.slashAxis = 'symIJ';
            keyWords.rotation = 'rotation';
        })(keyWords = symmetries_1.keyWords || (symmetries_1.keyWords = {}));
        function cartesian(nbI, nbJ, oneMoreVertexForOddLine) {
            if (oneMoreVertexForOddLine === void 0) { oneMoreVertexForOddLine = false; }
            var symmetries = new mathis.StringMap();
            symmetries.putValue(keyWords.verticalAxis, function (v) {
                var hereNbI = nbI;
                if (v.y % 2 == 1 && oneMoreVertexForOddLine)
                    hereNbI++;
                return new mathis.XYZ(hereNbI - 1 - v.x, v.y, v.z);
            });
            symmetries.putValue(keyWords.horizontalAxis, function (v) {
                return new mathis.XYZ(v.x, nbJ - 1 - v.y, v.z);
            });
            symmetries.putValue(keyWords.slashAxis, function (v) {
                var hereNbI = nbI;
                if (v.y % 2 == 1 && oneMoreVertexForOddLine)
                    hereNbI++;
                return new mathis.XYZ(hereNbI - 1 - v.x, nbJ - 1 - v.y, v.z);
            });
            return symmetries;
        }
        symmetries_1.cartesian = cartesian;
        function cartesianAsArray(nbI, nbJ, oneMoreVertexForOddLine) {
            if (oneMoreVertexForOddLine === void 0) { oneMoreVertexForOddLine = false; }
            var symDic = cartesian(nbI, nbJ, oneMoreVertexForOddLine);
            var res = [];
            for (var _i = 0, _a = symDic.allValues(); _i < _a.length; _i++) {
                var sym = _a[_i];
                res.push(sym);
            }
            return res;
        }
        symmetries_1.cartesianAsArray = cartesianAsArray;
        function polygonRotations(nbSides) {
            var symmetries = new mathis.StringMap();
            var _loop_1 = function(t) {
                var angle = Math.PI * 2 / nbSides * t;
                symmetries.putValue(keyWords.rotation + t, function (param) {
                    var res = new mathis.XYZ(0, 0, 0);
                    res.x = param.x * Math.cos(angle) - param.y * Math.sin(angle);
                    res.y = param.x * Math.sin(angle) + param.y * Math.cos(angle);
                    res.z = param.z;
                    return res;
                });
            };
            for (var t = 1; t < nbSides; t++) {
                _loop_1(t);
            }
            return symmetries;
        }
        symmetries_1.polygonRotations = polygonRotations;
        function getAllPolygonalRotations(nbSides) {
            var symMap = polygonRotations(nbSides);
            var res = [];
            for (var _i = 0, _a = symMap.allValues(); _i < _a.length; _i++) {
                var sym = _a[_i];
                res.push(sym);
            }
            return res;
        }
        symmetries_1.getAllPolygonalRotations = getAllPolygonalRotations;
    })(symmetries = mathis.symmetries || (mathis.symmetries = {}));
})(mathis || (mathis = {}));
