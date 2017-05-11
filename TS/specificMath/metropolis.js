/**
 * Created by vigon on 01/04/2016.
 */
var mathis;
(function (mathis) {
    var metropolis;
    (function (metropolis) {
        var IsingModel = (function () {
            function IsingModel(graph) {
                this.nbActionsPerIteration = 1000;
                this.q = Number.POSITIVE_INFINITY;
                this.beta = 0.01;
                this.graph = graph;
            }
            IsingModel.prototype.checkArgs = function () {
                if (this.q == null || this.beta == null)
                    throw 'q or beta is null';
                if (this.q <= 0)
                    throw 'q must be positive';
            };
            IsingModel.prototype.go = function () {
                this.checkArgs();
                if (this.q == Number.POSITIVE_INFINITY)
                    this.possibleValues = [-1, 1];
                else
                    this.possibleValues = [-1, 0, 1];
                this.initialisation();
                //this.iterateAndGetChangedVertices()
            };
            IsingModel.prototype.iterateAndGetChangedVertices = function () {
                var res = new mathis.HashMap(true);
                for (var i = 0; i < this.nbActionsPerIteration; i++) {
                    var valuedVertex = void 0;
                    var possibleNewValue = void 0;
                    if (this.beta != Number.POSITIVE_INFINITY) {
                        var randomIndex = Math.floor(Math.random() * this.graph.length);
                        valuedVertex = this.graph[randomIndex];
                        possibleNewValue = this.newValue();
                    }
                    else {
                        /**when beta=infinity, we do not accept that +1 and -1 are neighbor */
                        var ok = false;
                        while (!ok) {
                            var randomIndex = Math.floor(Math.random() * this.graph.length);
                            valuedVertex = this.graph[randomIndex];
                            possibleNewValue = this.newValue();
                            var voi = null;
                            var ok_1 = true;
                            for (var _i = 0, _a = valuedVertex.links; _i < _a.length; _i++) {
                                voi = _a[_i];
                                if (voi.to.customerObject.value * possibleNewValue == -1) {
                                    ok_1 = false;
                                    break;
                                }
                            }
                        }
                    }
                    var ratioEnergy = this.energyRatio(valuedVertex, possibleNewValue);
                    if (ratioEnergy >= 1 || Math.random() < ratioEnergy) {
                        valuedVertex.customerObject.value = possibleNewValue;
                        res.putValue(valuedVertex, possibleNewValue);
                    }
                }
                return res;
            };
            IsingModel.prototype.newValue = function () {
                var randomIndex = Math.floor(Math.random() * this.possibleValues.length);
                return this.possibleValues[randomIndex];
            };
            IsingModel.prototype.energyRatio = function (ver, possibleNewValue) {
                var res = 1;
                if (this.q != 1 && this.q != Number.POSITIVE_INFINITY) {
                    res = Math.pow(this.q, Math.abs(possibleNewValue) - Math.abs(ver.customerObject.value));
                }
                if (this.beta != 0 && this.beta != Number.POSITIVE_INFINITY) {
                    var diff_1 = possibleNewValue - ver.customerObject.value;
                    if (this.beta != 0 && this.beta != Number.POSITIVE_INFINITY) {
                        var sac_1 = 0;
                        ver.links.forEach(function (li) {
                            sac_1 += diff_1 * li.to.customerObject.value;
                        });
                        res *= Math.exp(this.beta * sac_1);
                    }
                }
                return res;
            };
            IsingModel.prototype.initialisation = function () {
                this.graph.forEach(function (v) {
                    v.customerObject.value = 0;
                });
            };
            return IsingModel;
        }());
        metropolis.IsingModel = IsingModel;
    })(metropolis = mathis.metropolis || (mathis.metropolis = {}));
})(mathis || (mathis = {}));
