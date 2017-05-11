var mathis;
(function (mathis) {
    var fractal;
    (function (fractal) {
        var StableRandomFractal = (function () {
            function StableRandomFractal(mamesh) {
                this.referenceDistanceBetweenVertexWithZeroDichoLevel = 0.1;
                this.deformationFromCenterVersusFromDirection = true;
                this.center = new mathis.XYZ(0, 0, 0);
                this.direction = new mathis.XYZ(0, 0, 1);
                this.alpha = 1.7;
                this.beta = 0.7;
                this.seed = 22345;
                this.mamesh = mamesh;
            }
            StableRandomFractal.prototype.go = function () {
                this.simuStable = new mathis.proba.StableLaw();
                this.simuStable.alpha = this.alpha;
                this.simuStable.beta = this.beta;
                this.simuStable.nbSimu = this.mamesh.vertices.length;
                var generator = new mathis.proba.Random(this.seed);
                this.simuStable.basicGenerator = function () { return generator.pseudoRand(); };
                var X = this.simuStable.go();
                var someThinerDichoLevels = true;
                var randomCount = 0;
                var currentDichoLevel = 0;
                var newPosition = new mathis.XYZ(0, 0, 0);
                var temp = new mathis.XYZ(0, 0, 0);
                while (someThinerDichoLevels) {
                    someThinerDichoLevels = false;
                    for (var key in this.mamesh.cutSegmentsDico) {
                        var segment = this.mamesh.cutSegmentsDico[key];
                        if (Math.max(segment.a.dichoLevel, segment.b.dichoLevel) == currentDichoLevel) {
                            someThinerDichoLevels = true;
                            var modif = X[randomCount++] * Math.pow(this.referenceDistanceBetweenVertexWithZeroDichoLevel / Math.pow(2, currentDichoLevel), 1 / this.simuStable.alpha);
                            mathis.geo.between(segment.a.position, segment.b.position, 1 / 2, newPosition);
                            if (this.deformationFromCenterVersusFromDirection) {
                                newPosition.substract(this.center);
                                newPosition.scale(1 + modif);
                            }
                            else {
                                temp.copyFrom(this.direction).scale(modif);
                                newPosition.add(temp);
                            }
                            segment.middle.position.copyFrom(newPosition);
                        }
                    }
                    currentDichoLevel++;
                }
            };
            return StableRandomFractal;
        }());
        fractal.StableRandomFractal = StableRandomFractal;
    })(fractal = mathis.fractal || (mathis.fractal = {}));
})(mathis || (mathis = {}));
