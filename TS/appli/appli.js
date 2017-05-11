/**
 * Created by vigon on 07/05/2017.
 */
var mathis;
(function (mathis) {
    var appli;
    (function (appli) {
        (function (Keywords) {
            Keywords[Keywords["basic"] = 0] = "basic";
            Keywords[Keywords["tool"] = 1] = "tool";
            Keywords[Keywords["math"] = 2] = "math";
            Keywords[Keywords["forDeveloper"] = 3] = "forDeveloper";
            Keywords[Keywords["proba"] = 4] = "proba";
        })(appli.Keywords || (appli.Keywords = {}));
        var Keywords = appli.Keywords;
        var conv;
        (function (conv) {
            //export var idForAttributeSelect=(key:string,pieceOfCodeName:string)=>key+'_of_'+pieceOfCodeName
            conv.$$$ = '$$$';
            conv.spacesToSuppress = '                ';
            conv.toIncludeAtTheBeginOfTheFirstHiddenPiece = ["var mathisFrame=new mathis.MathisFrame()"];
            conv.traitementsForEachLine = [
                function (line) {
                    return line.replace(/this.mathisFrame\./g, "mathisFrame\.");
                    //return line.replace(/mathis\./g,"")
                }
            ];
            conv.begin = ["$$$begin", "$$$b"];
            conv.beginHidden = ["$$$beginHidden", "$$$bh"];
            conv.end = ["$$$end", "$$$e"];
            conv.endHidden = ["$$$endHidden", "$$$eh"];
        })(conv = appli.conv || (appli.conv = {}));
        (function (ChoicesOptionsType) {
            ChoicesOptionsType[ChoicesOptionsType["select"] = 0] = "select";
            ChoicesOptionsType[ChoicesOptionsType["button"] = 1] = "button";
        })(appli.ChoicesOptionsType || (appli.ChoicesOptionsType = {}));
        var ChoicesOptionsType = appli.ChoicesOptionsType;
        //export class Command{}
        var Choices = (function () {
            function Choices(values, options) {
                if (options === void 0) { options = null; }
                this.$select = null;
                this.$button = null;
                this.values = values;
                if (options != null)
                    this.options = options;
                else
                    this.options = {};
            }
            Choices.prototype.changePossibleValues = function (values, visualValues, indexPage) {
                if (visualValues === void 0) { visualValues = null; }
                if (indexPage === void 0) { indexPage = null; }
                if (visualValues != null && values.length != visualValues.length)
                    throw "values.length and visualValues.length must be equal for:" + this.key;
                this.values = values;
                if (visualValues != null)
                    this.options.visualValues = visualValues;
                if (this.$select != null) {
                    for (var i = 0; i < this.$select.options.length; i++) {
                        this.$select.options[i] = null;
                    }
                    for (var i = 0; i < this.values.length; i++) {
                        var option = document.createElement("option");
                        option.value = this.values[i];
                        var textOption = "";
                        if (indexPage && indexPage.testMode)
                            textOption = this.key + ":";
                        if (this.options.visualValues != null) {
                            textOption += this.options.visualValues[i];
                        }
                        else
                            textOption += this.values[i];
                        option.text = textOption;
                        this.$select.appendChild(option);
                    }
                }
                else if (this.$button != null) {
                    if (this.options.visualValues != null)
                        this.$button.visualValues = this.options.visualValues;
                    else
                        for (var i = 0; i < this.values.length; i++) {
                            this.$button.visualValues.push(this.values[i]);
                        }
                }
            };
            Choices.prototype.show = function () {
                this.$parent.show();
            };
            Choices.prototype.hide = function () {
                this.$parent.hide();
            };
            return Choices;
        }());
        appli.Choices = Choices;
        function buildCommandDico(pieceOfCode) {
            if (pieceOfCode.COMMAND_DICO != null)
                throw "command dico was already made for the piece of code:" + pieceOfCode.NAME;
            var res = new mathis.StringMap();
            for (var $$$key in pieceOfCode) {
                if (pieceOfCode.hasOwnProperty($$$key) && $$$key.slice(0, 3) == conv.$$$) {
                    var key = $$$key.slice(3);
                    //if (key!='name'&& key!='title' &&key!='creator'&&key!='keyWords') {
                    var choicesOb = pieceOfCode[$$$key];
                    if ($.isArray(choicesOb)) {
                        choicesOb = new Choices(choicesOb);
                        pieceOfCode[$$$key] = choicesOb;
                    }
                    else if (!(choicesOb instanceof Choices))
                        throw "the attribute '$$$" + key + "'  must be an array or of Type Choices because it start by 3$";
                    choicesOb.key = key;
                    if (res.getValue(key) != null)
                        throw 'a configuration attribute is duplicated ';
                    res.putValue(key, choicesOb);
                }
            }
            for (var _i = 0, _a = res.allKeys(); _i < _a.length; _i++) {
                var key = _a[_i];
                /**pieceOfCode[key] doit être défini (il peut cependant avoir la valeur null )  */
                if (pieceOfCode[key] === undefined)
                    throw 'no attribute associate to  $$$' + key;
            }
            pieceOfCode.COMMAND_DICO = res;
        }
        appli.buildCommandDico = buildCommandDico;
        var Binder = (function () {
            function Binder(pieceOfCode, defaultContainer, mathisFrame) {
                this.pieceOfCode = pieceOfCode;
                this.defaultContainer = defaultContainer;
                this.mathisFrame = mathisFrame;
                this.selectAndAroundClassName = null;
                this.keyTo$select = new mathis.StringMap();
                this.keyTo$button = new mathis.StringMap();
                this.containersToPutCommand = new mathis.StringMap();
                /**only valid for the docuTestAppli*/
                this.pushState = false;
                this.go_fired = false;
                if (defaultContainer != null) {
                    if (!(defaultContainer instanceof jQuery))
                        throw "defaultContainer must be null or a jQuery object";
                    if (defaultContainer.length != 1)
                        throw "defaultContainer must contain a unique HTMLElement";
                }
                if (pieceOfCode.COMMAND_DICO == null)
                    buildCommandDico(this.pieceOfCode);
                //if ($placesToPutSelects==null && $alreadyOrganisedPlace==null) throw "at least one of the two place must be non null"
            }
            Binder.prototype.setAllSelectsAccordingToPieceOfCode = function () {
                for (var _i = 0, _a = this.pieceOfCode.COMMAND_DICO.allKeys(); _i < _a.length; _i++) {
                    var key = _a[_i];
                    var defaultIndex = null;
                    var choices = this.pieceOfCode.COMMAND_DICO.getValue(key);
                    for (var i = 0; i < choices.values.length; i++) {
                        if (choices.values[i] === null || this.pieceOfCode[key] === null) {
                            if (choices.values[i] === null && this.pieceOfCode[key] === null)
                                defaultIndex = i;
                        }
                        else {
                            /** important de passer par stringify et pas par toString: la méthode toString n'est pas forcément définie.
                             * et même si elle est définie, elle disparaît après  passage par la DB */
                            if (JSON.stringify(choices.values[i]) == JSON.stringify(this.pieceOfCode[key]))
                                defaultIndex = i;
                        }
                    }
                    if (defaultIndex != null) {
                        var $select = this.keyTo$select.getValue(key);
                        if ($select != null)
                            $select.selectedIndex = defaultIndex;
                        else {
                            var $button = this.keyTo$button.getValue(key);
                            if ($button != null) {
                                $button.selectedIndex = defaultIndex;
                                $button.updateVisual();
                            }
                        }
                    }
                    else {
                        var allValuesString = "";
                        for (var _b = 0, _c = choices.values; _b < _c.length; _b++) {
                            var val = _c[_b];
                            allValuesString += JSON.stringify(val) + ",";
                        }
                        throw 'in the pieceOfCode:' + this.pieceOfCode.NAME + ', for the configuration-attribute:' + key + ', the value:' + JSON.stringify(this.pieceOfCode[key]) + ' does not appear in the possible choices:' + allValuesString;
                    }
                }
            };
            Binder.prototype.go = function () {
                var _this = this;
                if (this.go_fired)
                    throw 'Binder.go can be fired only once';
                this.go_fired = true;
                if (this.defaultContainer != null) {
                    this.containersToPutCommand.putValue('default', this.defaultContainer);
                }
                if (this.mathisFrame != null) {
                    this.containersToPutCommand.putValue('NW', this.mathisFrame.subWindow_NW.$visual);
                    this.containersToPutCommand.putValue('NE', this.mathisFrame.subWindow_NE.$visual);
                    this.containersToPutCommand.putValue('N', this.mathisFrame.subWindow_N.$visual);
                    this.containersToPutCommand.putValue('SW', this.mathisFrame.subWindow_SW.$visual);
                    this.containersToPutCommand.putValue('SE', this.mathisFrame.subWindow_SE.$visual);
                    this.containersToPutCommand.putValue('S', this.mathisFrame.subWindow_S.$visual);
                    this.containersToPutCommand.putValue('W', this.mathisFrame.subWindow_W.$visual);
                    this.containersToPutCommand.putValue('E', this.mathisFrame.subWindow_E.$visual);
                    if (this.containersToPutCommand.getValue('default') == null)
                        this.containersToPutCommand.putValue('default', this.mathisFrame.subWindow_NW.$visual);
                }
                var _loop_1 = function(key) {
                    var choices = this_1.pieceOfCode.COMMAND_DICO.getValue(key);
                    choices.initialValueMemorized = this_1.pieceOfCode[key];
                    /**automaticPlacing=true when no html with class=key was found*/
                    var automaticPlacing = void 0;
                    var $container = void 0;
                    if (choices.options.containerName != null) {
                        $container = this_1.containersToPutCommand.getValue(choices.options.containerName);
                        if ($container == null || $container.length == 0)
                            throw "the container name:" + choices.options.containerName + " has no corresponding container";
                    }
                    else
                        $container = this_1.containersToPutCommand.getValue('default');
                    var $place = $container.find('.' + key);
                    if ($place == null || $place.length == 0) {
                        $place = $("<span>").addClass(key);
                        $container.append($('<div>').append($place));
                        automaticPlacing = true;
                    }
                    else if ($place.length > 1)
                        throw "several places for the element with name:" + key;
                    else if ($place.length == 1) {
                        automaticPlacing = false;
                    }
                    if (this_1.selectAndAroundClassName != null) {
                        $place.addClass(this_1.selectAndAroundClassName);
                    }
                    choices.$parent = $place;
                    var $text = $("<span>");
                    var before = (choices.options.before == null) ? "" : choices.options.before;
                    var label = (choices.options.label == null) ? key + ":" : choices.options.label;
                    if (automaticPlacing)
                        $text.append(label).append(before);
                    else
                        $text.append(before);
                    if (choices.options.type == null || choices.options.type == ChoicesOptionsType.select) {
                        choices.$select = document.createElement("select");
                        this_1.keyTo$select.putValue(key, choices.$select);
                        $place.append($text);
                        $place.append(choices.$select);
                        choices.changePossibleValues(choices.values, null, this_1.indexPage);
                        choices.$select.onchange = function () {
                            /**...= $select.value serait peut-être mieux*/
                            _this.pieceOfCode[choices.key] = choices.values[choices.$select.selectedIndex];
                            _this.whenSelectOrButtonChange(choices);
                        };
                    }
                    else if (choices.options.type == ChoicesOptionsType.button) {
                        choices.$button = new $Button();
                        this_1.keyTo$button.putValue(key, choices.$button);
                        //$textAndSelect.append($text)
                        $place.append(choices.$button.$visual);
                        choices.changePossibleValues(choices.values, null, this_1.indexPage);
                        choices.$button.onclick = function () {
                            choices.$button.increment();
                            choices.$button.updateVisual();
                            _this.pieceOfCode[choices.key] = choices.values[choices.$button.selectedIndex];
                            _this.whenSelectOrButtonChange(choices);
                        };
                    }
                };
                var this_1 = this;
                for (var _i = 0, _a = this.pieceOfCode.COMMAND_DICO.allKeys(); _i < _a.length; _i++) {
                    var key = _a[_i];
                    _loop_1(key);
                }
                this.setAllSelectsAccordingToPieceOfCode();
            };
            Binder.prototype.whenSelectOrButtonChange = function (choices) {
                if (this.indexPage != null && this.pushState) {
                    this.indexPage.navigator.pushState({
                        type: 'part',
                        name: this.pieceOfCode.NAME,
                        configuration: pieceOfCodeToConfiguration(this.pieceOfCode)
                    });
                }
                if (choices.options.onchange != null)
                    choices.options.onchange();
                else
                    this.pieceOfCode.go();
                if (this.onConfigChange != null)
                    this.onConfigChange();
            };
            return Binder;
        }());
        appli.Binder = Binder;
        var $Button = (function () {
            function $Button() {
                var _this = this;
                //values:any[]
                this.visualValues = [];
                this.selectedIndex = 0;
                this.$visual = $('<div class="clickable appliButton" "></div>');
                this.$visual.on('click touch', function () { _this.onclick(); });
            }
            $Button.prototype.increment = function () {
                this.selectedIndex = (this.selectedIndex + 1) % this.visualValues.length;
            };
            $Button.prototype.updateVisual = function () {
                this.$visual.empty().append(this.visualValues[this.selectedIndex]);
            };
            return $Button;
        }());
        appli.$Button = $Button;
        //TODO : déplacer dans la docuTest
        function pieceOfCodeToConfiguration(pieceOfCode) {
            var res = {};
            for (var $$$key in pieceOfCode) {
                if ($$$key.slice(0, 3) == conv.$$$) {
                    var key = $$$key.slice(3);
                    if (key != 'name' && key != 'title' && key != 'creator' && key != 'keyWords') {
                        res[key] = pieceOfCode[key];
                    }
                }
            }
            return res;
        }
        appli.pieceOfCodeToConfiguration = pieceOfCodeToConfiguration;
        function pieceOfCodeToSrotedConfigurationAttributes(pieceOfCode) {
            var res = [];
            for (var $$$key in pieceOfCode) {
                if ($$$key.slice(0, 3) == conv.$$$) {
                    var key = $$$key.slice(3);
                    if (key != 'name' && key != 'title' && key != 'creator' && key != 'keyWords') {
                        res.push(key);
                    }
                }
            }
            return res.sort();
        }
        appli.pieceOfCodeToSrotedConfigurationAttributes = pieceOfCodeToSrotedConfigurationAttributes;
    })(appli = mathis.appli || (mathis.appli = {}));
})(mathis || (mathis = {}));
