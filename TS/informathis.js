/**
 * Created by vigon on 16/12/2015.
 */
var mathis;
(function (mathis) {
    function allIntegerValueOfEnume(MyEnum) {
        var res = [];
        for (var prop in MyEnum) {
            if (MyEnum.hasOwnProperty(prop)) {
                var i = parseInt(prop);
                if (!isNaN(i))
                    res.push(i);
            }
        }
        return res;
    }
    mathis.allIntegerValueOfEnume = allIntegerValueOfEnume;
    function allStringValueOfEnume(MyEnum) {
        var res = [];
        for (var prop in MyEnum) {
            if (MyEnum.hasOwnProperty(prop) &&
                (isNaN(parseInt(prop)))) {
                res.push(prop);
            }
        }
        return res;
    }
    mathis.allStringValueOfEnume = allStringValueOfEnume;
    /**logging*/
    var Logger = (function () {
        function Logger() {
            this.showTrace = false;
            this.alreadyWroteWarning = [];
        }
        Logger.prototype.c = function (message, maxTimesFired) {
            if (maxTimesFired === void 0) { maxTimesFired = 1; }
            if (this.alreadyWroteWarning[message] != null)
                this.alreadyWroteWarning[message]++;
            else
                this.alreadyWroteWarning[message] = 1;
            if (this.alreadyWroteWarning[message] <= maxTimesFired) {
                if (this.showTrace) {
                    var err = new Error();
                    console.log("WARNING", message, '...........................................', err);
                }
                else {
                    console.log("WARNING", message);
                }
            }
        };
        return Logger;
    }());
    mathis.Logger = Logger;
    function roundWithGivenPrecision(value, nbDecimal) {
        value *= Math.pow(10, nbDecimal);
        value = Math.round(value);
        value /= Math.pow(10, nbDecimal);
        return value;
    }
    mathis.roundWithGivenPrecision = roundWithGivenPrecision;
    function applyMixins(derivedCtor, baseCtors) {
        baseCtors.forEach(function (baseCtor) {
            Object.getOwnPropertyNames(baseCtor.prototype).forEach(function (name) {
                if (name !== 'constructor') {
                    derivedCtor.prototype[name] = baseCtor.prototype[name];
                }
            });
        });
    }
    mathis.applyMixins = applyMixins;
    /** from http://www.javascripter.net/faq/stylesc.htm
     *
     auto        move           no-drop      col-resize
     all-scroll  pointer        not-allowed  row-resize
     crosshair   progress       e-resize     ne-resize
     default     text           n-resize     nw-resize
     help        vertical-text  s-resize     se-resize
     inherit     wait           w-resize     sw-resize
     * */
    function setCursorByID(id, cursorStyle) {
        var elem;
        if (document.getElementById &&
            (elem = document.getElementById(id))) {
            if (elem.style)
                elem.style.cursor = cursorStyle;
        }
    }
    mathis.setCursorByID = setCursorByID;
    var Bilan = (function () {
        function Bilan() {
            this.millisDuration = 0;
            this.nbTested = 0;
            this.nbOK = 0;
            this.millisDep = performance.now();
        }
        Bilan.prototype.computeTime = function () {
            this.millisDuration = performance.now() - this.millisDep;
        };
        Bilan.prototype.add = function (bilan) {
            bilan.computeTime();
            this.nbTested += bilan.nbTested;
            this.nbOK += bilan.nbOK;
            this.millisDuration += bilan.millisDuration;
        };
        Bilan.prototype.assertTrue = function (ok) {
            this.nbTested++;
            if (ok)
                this.nbOK++;
            else {
                var e = new Error();
                console.log(e.stack);
            }
        };
        Bilan.prototype.toString = function () {
            return 'nbTest:' + this.nbTested + ', nbOK:' + this.nbOK + ', millisDuration:' + this.millisDuration.toFixed(2);
        };
        return Bilan;
    }());
    mathis.Bilan = Bilan;
    function modulo(i, n, centered) {
        if (centered === void 0) { centered = false; }
        if (n < 0)
            throw 'second arg must be positif';
        var res = 0;
        if (i >= 0)
            res = i % n;
        else
            res = n - (-i) % n;
        if (centered && res > n / 2)
            res = res - n;
        if (Math.abs(res - n) < Number.MIN_VALUE * 10)
            res = 0;
        return res;
    }
    mathis.modulo = modulo;
    /**Fisher-Yates shuffle*/
    function shuffle(array) {
        var counter = array.length, temp, index;
        // While there are elements in the array
        while (counter > 0) {
            // Pick a random index
            index = Math.floor(Math.random() * counter);
            // Decrease counter by 1
            counter--;
            // And swap the last element with it
            temp = array[counter];
            array[counter] = array[index];
            array[index] = temp;
        }
        return array;
    }
    mathis.shuffle = shuffle;
    var Entry = (function () {
        function Entry(key, value) {
            this.key = key;
            this.value = value;
        }
        return Entry;
    }());
    mathis.Entry = Entry;
    var HashMap = (function () {
        function HashMap(memorizeKeys) {
            if (memorizeKeys === void 0) { memorizeKeys = false; }
            this.values = {};
            this.keys = {};
            this.memorizeKeys = memorizeKeys;
        }
        HashMap.prototype.putValue = function (key, value, nullKeyForbidden) {
            if (nullKeyForbidden === void 0) { nullKeyForbidden = true; }
            if (key == null) {
                if (nullKeyForbidden)
                    throw 'key must be non null';
                else
                    return null;
            }
            this.values[key.hashString] = value;
            if (this.memorizeKeys)
                this.keys[key.hashString] = key;
        };
        HashMap.prototype.removeKey = function (key) {
            delete this.values[key.hashString];
            if (this.memorizeKeys)
                delete this.keys[key.hashString];
        };
        HashMap.prototype.getValue = function (key, nullKeyForbidden) {
            if (nullKeyForbidden === void 0) { nullKeyForbidden = true; }
            if (key == null) {
                if (nullKeyForbidden)
                    throw 'key must be non null';
                else
                    return null;
            }
            return this.values[key.hashString];
        };
        HashMap.prototype.allValues = function () {
            var res = new Array();
            for (var index in this.values)
                res.push(this.values[index]);
            return res;
        };
        HashMap.prototype.allKeys = function () {
            if (!this.memorizeKeys)
                throw 'this hashMap has not memorized keys. Please, put args=true in the constructor';
            var res = new Array();
            for (var index in this.keys)
                res.push(this.keys[index]);
            return res;
        };
        HashMap.prototype.allEntries = function () {
            if (!this.memorizeKeys)
                throw 'this hashMap has not memorized keys. Please, put args=true in the constructor';
            var res = [];
            for (var index in this.keys)
                res.push(new Entry(this.keys[index], this.values[index]));
            return res;
        };
        HashMap.prototype.aRandomValue = function () {
            var keys = Object.keys(this.values);
            return this.values[keys[Math.floor(keys.length * Math.random())]];
        };
        HashMap.prototype.extend = function (otherHashMap) {
            if (!otherHashMap.memorizeKeys)
                throw "cannot extend this  with a HashMap which do not memorize keys";
            for (var _i = 0, _a = otherHashMap.allEntries(); _i < _a.length; _i++) {
                var entry = _a[_i];
                this.putValue(entry.key, entry.value);
            }
        };
        HashMap.prototype.size = function () {
            var res = 0;
            for (var key in this.values)
                res++;
            return res;
        };
        return HashMap;
    }());
    mathis.HashMap = HashMap;
    var StringMap = (function () {
        function StringMap() {
            this.values = {};
        }
        StringMap.prototype.putValue = function (key, value, nullKeyForbidden) {
            if (nullKeyForbidden === void 0) { nullKeyForbidden = true; }
            if (key == null) {
                if (nullKeyForbidden)
                    throw 'key must be non null';
                else
                    return null;
            }
            this.values[key] = value;
        };
        StringMap.prototype.removeKey = function (key) {
            delete this.values[key];
        };
        StringMap.prototype.getValue = function (key, nullKeyForbidden) {
            if (nullKeyForbidden === void 0) { nullKeyForbidden = true; }
            if (key == null) {
                if (nullKeyForbidden)
                    throw 'key must be non null';
                else
                    return null;
            }
            return this.values[key];
        };
        StringMap.prototype.allValues = function () {
            var res = new Array();
            for (var index in this.values)
                res.push(this.values[index]);
            return res;
        };
        StringMap.prototype.allKeys = function () {
            // let res:string[]=[]
            // for (let key in this.values) res.push(key)
            // return res
            return Object.keys(this.values);
        };
        StringMap.prototype.aRandomValue = function () {
            var keys = Object.keys(this.values);
            return this.values[keys[Math.floor(keys.length * Math.random())]];
        };
        StringMap.prototype.size = function () {
            var res = 0;
            for (var key in this.values)
                res++;
            return res;
        };
        StringMap.prototype.__serialize = function () { return this.values; };
        StringMap.prototype.__load = function (values) { this.values = values; };
        return StringMap;
    }());
    mathis.StringMap = StringMap;
})(mathis || (mathis = {}));
