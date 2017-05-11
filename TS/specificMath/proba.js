var mathis;
(function (mathis) {
    var proba;
    (function (proba) {
        /** pour avoir toujours la même séquence aléatoire d' un client à l' autre */
        var Random = (function () {
            function Random(seed) {
                if (seed === void 0) { seed = 1234567; }
                this.seed = seed;
            }
            //Webkit2's crazy invertible mapping SUB_generator
            // Theory is here: http://dl.acm.org/citation.cfm?id=752741
            Random.prototype.pseudoRand = function () {
                var max = Math.pow(2, 32);
                // creates randomness...somehow...
                this.seed += (this.seed * this.seed) | 5;
                // Shift off bits, discarding the sign. Discarding the sign is
                // important because OR w/ 5 can give us + or - numbers.
                return (this.seed >>> 32) / max;
            };
            Random.prototype.pseudoRandInt = function (size) {
                var res = Math.floor(size * this.pseudoRand());
                if (res == size)
                    res--; // pour le cas très improbable où pseudoRand() revnoit 1
                return res;
            };
            return Random;
        }());
        proba.Random = Random;
        var Gaussian = (function () {
            function Gaussian() {
                this.mean = 0;
                this.stdev = 1;
                this.knuthVersusBowMuller = true;
                this.use_last = false;
            }
            Gaussian.prototype.go = function () {
                if (this.knuthVersusBowMuller)
                    return this.knuth();
                else
                    return this.bowMuller();
            };
            Gaussian.prototype.bowMuller = function () {
                var u = 1 - Math.random(); // Subtraction to flip [0, 1) to (0, 1].
                var v = 1 - Math.random();
                return this.mean + this.stdev * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
            };
            Gaussian.prototype.knuth = function () {
                var y1;
                if (this.use_last) {
                    y1 = this.y2;
                    this.use_last = false;
                }
                else {
                    var x1, x2, w;
                    do {
                        x1 = 2.0 * Math.random() - 1.0;
                        x2 = 2.0 * Math.random() - 1.0;
                        w = x1 * x1 + x2 * x2;
                    } while (w >= 1.0);
                    w = Math.sqrt((-2.0 * Math.log(w)) / w);
                    y1 = x1 * w;
                    this.y2 = x2 * w;
                    this.use_last = true;
                }
                var retval = this.mean + this.stdev * y1;
                if (retval > 0)
                    return retval;
                return -retval;
            };
            return Gaussian;
        }());
        proba.Gaussian = Gaussian;
        // returns a gaussian random function with the given mean and stdev.
        function gaussian(mean, stdev) {
            var y2;
            var use_last = false;
            return function () {
                var y1;
                if (use_last) {
                    y1 = y2;
                    use_last = false;
                }
                else {
                    var x1, x2, w;
                    do {
                        x1 = 2.0 * Math.random() - 1.0;
                        x2 = 2.0 * Math.random() - 1.0;
                        w = x1 * x1 + x2 * x2;
                    } while (w >= 1.0);
                    w = Math.sqrt((-2.0 * Math.log(w)) / w);
                    y1 = x1 * w;
                    y2 = x2 * w;
                    use_last = true;
                }
                var retval = mean + stdev * y1;
                if (retval > 0)
                    return retval;
                return -retval;
            };
        }
        proba.gaussian = gaussian;
        var StableLaw = (function () {
            function StableLaw() {
                /**
                 alpha is the stability parameter in (0,2]
                 beta  is the skewness parameter in [-1,+1]
                 sigma is the scale parameter in ]0,infinity[
                 mu is the translation parameter in ]-infinity,+infinity[
                 when alpha<1 and beta==1, then the simulations are positive
                 */
                this.nbSimu = 1;
                this.alpha = 1.5;
                this.beta = 0;
                this.sigma = 1;
                this.mu = 0;
                this.basicGenerator = Math.random;
            }
            StableLaw.prototype.checkArgs = function () {
                if (this.alpha > 2 || this.alpha <= 0)
                    throw 'alpha must be in (0,2]';
                if (this.beta < -1 || this.beta > 1)
                    throw 'beta must be in [-1,1]';
            };
            StableLaw.prototype.go = function () {
                this.checkArgs();
                var X = [];
                for (var i = 0; i < this.nbSimu; i++) {
                    var V = this.basicGenerator() * Math.PI - Math.PI / 2; //angle aléatoire
                    var W = -Math.log(this.basicGenerator()); //v.a. de loi exponentielle(1)
                    if (this.alpha != 1) {
                        // some constantes
                        var ta = Math.tan(Math.PI * this.alpha / 2);
                        var B = Math.atan(this.beta * ta) / this.alpha;
                        var S = (1 + this.beta ^ 2 * ta ^ 2) ^ (1 / 2 / this.alpha);
                        //  simulations
                        X[i] = S * Math.sin(this.alpha * (V + B)) / (Math.pow((Math.cos(V)), (1 / this.alpha)))
                            * Math.pow((Math.cos(V - this.alpha * (V + B)) / W), ((1 - this.alpha) / this.alpha));
                        X[i] = this.sigma * X[i] + this.mu;
                    }
                    else if (this.alpha == 1) {
                        X[i] = 2 / Math.PI * ((Math.PI / 2 + this.beta * V) * Math.tan(V) - this.beta * Math.log(W * Math.cos(V) / (Math.PI / 2 + this.beta * V)));
                        X[i] = this.sigma * X[i] + 2 / Math.PI * this.beta * this.sigma * Math.log(this.sigma) + this.mu;
                    }
                }
                return X;
            };
            return StableLaw;
        }());
        proba.StableLaw = StableLaw;
    })(proba = mathis.proba || (mathis.proba = {}));
})(mathis || (mathis = {}));
