var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// https://github.com/dntj/jsfft
var fft;
(function (fft) {
    var BaseComplexArray = (function () {
        function BaseComplexArray(other, arrayType) {
            if (arrayType === void 0) { arrayType = Float32Array; }
            if (other instanceof BaseComplexArray) {
                // Copy constuctor.
                this.ArrayType = other.ArrayType;
                this.real = new this.ArrayType(other.real);
                this.imag = new this.ArrayType(other.imag);
            }
            else {
                this.ArrayType = arrayType;
                // other can be either an array or a number.
                this.real = new this.ArrayType(other);
                this.imag = new this.ArrayType(this.real.length);
            }
            this.length = this.real.length;
        }
        BaseComplexArray.prototype.toString = function () {
            var components = [];
            this.forEach(function (value, i) {
                components.push("(" + value.real.toFixed(2) + ", " + value.imag.toFixed(2) + ")");
            });
            return "[" + components.join(', ') + "]";
        };
        BaseComplexArray.prototype.forEach = function (iterator) {
            var n = this.length;
            // For gc efficiency, re-use a single object in the iterator.
            var value = Object.seal(Object.defineProperties({}, {
                real: { writable: true }, imag: { writable: true },
            }));
            for (var i = 0; i < n; i++) {
                value.real = this.real[i];
                value.imag = this.imag[i];
                iterator(value, i, n);
            }
        };
        // In-place mapper.
        BaseComplexArray.prototype.map = function (mapper) {
            var _this = this;
            this.forEach(function (value, i, n) {
                mapper(value, i, n);
                _this.real[i] = value.real;
                _this.imag[i] = value.imag;
            });
            return this;
        };
        BaseComplexArray.prototype.conjugate = function () {
            return new BaseComplexArray(this).map(function (value) {
                value.imag *= -1;
            });
        };
        BaseComplexArray.prototype.magnitude = function () {
            var mags = new this.ArrayType(this.length);
            this.forEach(function (value, i) {
                mags[i] = Math.sqrt(value.real * value.real + value.imag * value.imag);
            });
            return mags;
        };
        return BaseComplexArray;
    }());
    fft.BaseComplexArray = BaseComplexArray;
    // Math constants and functions we need.
    var PI = Math.PI;
    var SQRT1_2 = Math.SQRT1_2;
    function FFT(input) {
        return ensureComplexArray(input).FFT();
    }
    fft.FFT = FFT;
    function InvFFT(input) {
        return ensureComplexArray(input).InvFFT();
    }
    fft.InvFFT = InvFFT;
    function frequencyMap(input, filterer) {
        return ensureComplexArray(input).frequencyMap(filterer);
    }
    fft.frequencyMap = frequencyMap;
    var ComplexArray = (function (_super) {
        __extends(ComplexArray, _super);
        function ComplexArray() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ComplexArray.prototype.FFT = function () {
            return fft_impl(this, false);
        };
        ComplexArray.prototype.InvFFT = function () {
            return fft_impl(this, true);
        };
        // Applies a frequency-space filter to input, and returns the real-space
        // filtered input.
        // filterer accepts freq, i, n and modifies freq.real and freq.imag.
        ComplexArray.prototype.frequencyMap = function (filterer) {
            return this.FFT().map(filterer).InvFFT();
        };
        return ComplexArray;
    }(BaseComplexArray));
    fft.ComplexArray = ComplexArray;
    function ensureComplexArray(input) {
        return input instanceof ComplexArray && input || new ComplexArray(input);
    }
    function fft_impl(input, inverse) {
        var n = input.length;
        if (n & (n - 1)) {
            return FFT_Recursive(input, inverse);
        }
        else {
            return FFT_2_Iterative(input, inverse);
        }
    }
    function FFT_Recursive(input, inverse) {
        var n = input.length;
        if (n === 1) {
            return input;
        }
        var output = new ComplexArray(n, input.ArrayType);
        // Use the lowest odd factor, so we are able to use FFT_2_Iterative in the
        // recursive transforms optimally.
        var p = LowestOddFactor(n);
        var m = n / p;
        var normalisation = 1 / Math.sqrt(p);
        var recursive_result = new ComplexArray(m, input.ArrayType);
        // Loops go like O(n Σ p_i), where p_i are the prime factors of n.
        // for a power of a prime, p, this reduces to O(n p log_p n)
        for (var j = 0; j < p; j++) {
            for (var i = 0; i < m; i++) {
                recursive_result.real[i] = input.real[i * p + j];
                recursive_result.imag[i] = input.imag[i * p + j];
            }
            // Don't go deeper unless necessary to save allocs.
            if (m > 1) {
                recursive_result = fft_impl(recursive_result, inverse);
            }
            var del_f_r = Math.cos(2 * PI * j / n);
            var del_f_i = (inverse ? -1 : 1) * Math.sin(2 * PI * j / n);
            var f_r = 1;
            var f_i = 0;
            for (var i = 0; i < n; i++) {
                var _real = recursive_result.real[i % m];
                var _imag = recursive_result.imag[i % m];
                output.real[i] += f_r * _real - f_i * _imag;
                output.imag[i] += f_r * _imag + f_i * _real;
                _a = [
                    f_r * del_f_r - f_i * del_f_i,
                    f_i = f_r * del_f_i + f_i * del_f_r,
                ], f_r = _a[0], f_i = _a[1];
            }
        }
        // Copy back to input to match FFT_2_Iterative in-placeness
        // TODO: faster way of making this in-place?
        for (var i = 0; i < n; i++) {
            input.real[i] = normalisation * output.real[i];
            input.imag[i] = normalisation * output.imag[i];
        }
        return input;
        var _a;
    }
    function FFT_2_Iterative(input, inverse) {
        var n = input.length;
        var output = BitReverseComplexArray(input);
        var output_r = output.real;
        var output_i = output.imag;
        // Loops go like O(n log n):
        //   width ~ log n; i,j ~ n
        var width = 1;
        while (width < n) {
            var del_f_r = Math.cos(PI / width);
            var del_f_i = (inverse ? -1 : 1) * Math.sin(PI / width);
            for (var i = 0; i < n / (2 * width); i++) {
                var f_r = 1;
                var f_i = 0;
                for (var j = 0; j < width; j++) {
                    var l_index = 2 * i * width + j;
                    var r_index = l_index + width;
                    var left_r = output_r[l_index];
                    var left_i = output_i[l_index];
                    var right_r = f_r * output_r[r_index] - f_i * output_i[r_index];
                    var right_i = f_i * output_r[r_index] + f_r * output_i[r_index];
                    output_r[l_index] = SQRT1_2 * (left_r + right_r);
                    output_i[l_index] = SQRT1_2 * (left_i + right_i);
                    output_r[r_index] = SQRT1_2 * (left_r - right_r);
                    output_i[r_index] = SQRT1_2 * (left_i - right_i);
                    _a = [
                        f_r * del_f_r - f_i * del_f_i,
                        f_r * del_f_i + f_i * del_f_r,
                    ], f_r = _a[0], f_i = _a[1];
                }
            }
            width <<= 1;
        }
        return output;
        var _a;
    }
    function BitReverseIndex(index, n) {
        var bitreversed_index = 0;
        while (n > 1) {
            bitreversed_index <<= 1;
            bitreversed_index += index & 1;
            index >>= 1;
            n >>= 1;
        }
        return bitreversed_index;
    }
    function BitReverseComplexArray(array) {
        var n = array.length;
        // const flips = new Set();
        var flips = [];
        for (var i = 0; i < n; i++) {
            var r_i = BitReverseIndex(i, n);
            if (i in flips)
                continue;
            _a = [array.real[r_i], array.real[i]], array.real[i] = _a[0], array.real[r_i] = _a[1];
            _b = [array.imag[r_i], array.imag[i]], array.imag[i] = _b[0], array.imag[r_i] = _b[1];
            flips.push(r_i);
        }
        return array;
        var _a, _b;
    }
    function LowestOddFactor(n) {
        var sqrt_n = Math.sqrt(n);
        var factor = 3;
        while (factor <= sqrt_n) {
            if (n % factor === 0)
                return factor;
            factor += 2;
        }
        return n;
    }
    function FFTImageDataRGBA(data, nx, ny) {
        var rgb = splitRGB(data);
        return mergeRGB(FFT2D(new ComplexArray(rgb[0], Float32Array), nx, ny), FFT2D(new ComplexArray(rgb[1], Float32Array), nx, ny), FFT2D(new ComplexArray(rgb[2], Float32Array), nx, ny));
    }
    fft.FFTImageDataRGBA = FFTImageDataRGBA;
    function splitRGB(data) {
        var n = data.length / 4;
        var r = new Uint8ClampedArray(n);
        var g = new Uint8ClampedArray(n);
        var b = new Uint8ClampedArray(n);
        for (var i = 0; i < n; i++) {
            r[i] = data[4 * i];
            g[i] = data[4 * i + 1];
            b[i] = data[4 * i + 2];
        }
        return [r, g, b];
    }
    function mergeRGB(r, g, b) {
        var n = r.length;
        var output = new fft.ComplexArray(n * 4);
        for (var i = 0; i < n; i++) {
            output.real[4 * i] = r.real[i];
            output.imag[4 * i] = r.imag[i];
            output.real[4 * i + 1] = g.real[i];
            output.imag[4 * i + 1] = g.imag[i];
            output.real[4 * i + 2] = b.real[i];
            output.imag[4 * i + 2] = b.imag[i];
        }
        return output;
    }
    function FFT2D(input, nx, ny, inverse) {
        if (inverse === void 0) { inverse = false; }
        var transform = inverse ? 'InvFFT' : 'FFT';
        var output = new ComplexArray(input.length, input.ArrayType);
        var row = new ComplexArray(nx, input.ArrayType);
        var col = new ComplexArray(ny, input.ArrayType);
        var _loop_1 = function (j) {
            row.map(function (v, i) {
                v.real = input.real[i + j * nx];
                v.imag = input.imag[i + j * nx];
            });
            row[transform]().forEach(function (v, i) {
                output.real[i + j * nx] = v.real;
                output.imag[i + j * nx] = v.imag;
            });
        };
        for (var j = 0; j < ny; j++) {
            _loop_1(j);
        }
        var _loop_2 = function (i) {
            col.map(function (v, j) {
                v.real = output.real[i + j * nx];
                v.imag = output.imag[i + j * nx];
            });
            col[transform]().forEach(function (v, j) {
                output.real[i + j * nx] = v.real;
                output.imag[i + j * nx] = v.imag;
            });
        };
        for (var i = 0; i < nx; i++) {
            _loop_2(i);
        }
        return output;
    }
    fft.FFT2D = FFT2D;
})(fft || (fft = {}));
/**
 * Created by Gwenael on 06/05/2017.
 * Il suffit de mettre dans le module exports et ca marche (d'après mes tests du moins)
 */
var exports;
(function (exports) {
    function getC2(r, alpha) {
        if (alpha <= 1.5)
            return alpha / 2;
        else {
            var beta = alpha * (2 - alpha) / (3 * r * (r * r - 1));
            return (alpha - beta * (r - 1) * (r - 1) * (r + 2)) / 2;
        }
    }
    function rho(x, y, r, alpha) {
        var beta, c0, c2;
        if (alpha <= 1.5) {
            beta = 0;
            c2 = alpha / 2;
            c0 = 1 - alpha / 2;
        }
        else {
            beta = alpha * (2 - alpha) / (3 * r * (r * r - 1));
            c2 = (alpha - beta * (r - 1) * (r - 1) * (r + 2)) / 2;
            c0 = beta * Math.pow((r - 1), 3) + 1 - c2;
        }
        var s = Math.sqrt((x[0] - y[0]) * (x[0] - y[0]) + (x[1] - y[1]) * (x[1] - y[1]));
        // let s = (x[0] - y[0]) + (x[1] - y[1]);
        // let s = Math.pow((x[0] - y[0]) ** 3 + (x[1] - y[1]) ** 3,1./3);
        // let s = Math.sqrt((x[0] - y[0]) ** 2 + (x[1] - y[1]) ** 4);
        if (s <= 1)
            return c0 - Math.pow(s, alpha) + c2 * s * s;
        else if (s <= r)
            return beta * Math.pow((r - s), 3) / s;
        else
            return 0;
    }
    function genBrownian(n, r, h) {
        if (n === void 0) { n = 100; }
        if (r === void 0) { r = 2; }
        if (h === void 0) { h = 0.8; }
        var m = n;
        var _a = [2 * n - 2, 2 * m - 2], wr = _a[0], hr = _a[1];
        var rows = new Float32Array(wr * hr);
        var tmp = [0, 0];
        for (var i = 0; i < n; i++) {
            for (var j = 0; j < m; j++)
                rows[i * hr + j] = rho([i * r / n, j * r / m], tmp, r, 2 * h);
        }
        for (var i = 1; i < n - 1; i++) {
            rows[(wr - i) * hr] = rows[i * hr];
        }
        for (var j = 1; j < m - 1; j++) {
            rows[(hr - j)] = rows[j];
        }
        for (var i = 1; i < n - 1; i++) {
            for (var j = 1; j < m - 1; j++) {
                rows[(wr - i) * hr + j] = rows[i * hr + j];
                rows[i * hr + (hr - j)] = rows[i * hr + j];
                rows[(wr - i) * hr + (hr - j)] = rows[i * hr + j];
            }
        }
        var data = fft.FFT2D(new fft.ComplexArray(rows), hr, wr);
        /*const data = new fft.ComplexArray(wr * hr).map((value, i, n) => {
            value.real = rows[i];
            value.imag = 0;
        });*/
        var z_i = random.randomGaussians(wr * hr);
        var z_r = random.randomGaussians(wr * hr);
        // let z_r = new Float32Array(wr * hr);
        data.map(function (val, i, n) {
            val.real /= wr * hr;
            // console.log(val.real,val.imag," -> ",Math.sqrt(val.real));
            if (val.real >= 0) {
                val.imag = Math.sqrt(val.real) * z_i[i];
                val.real = Math.sqrt(val.real) * z_r[i];
            }
            else {
                val.imag = Math.sqrt(-val.real) * z_r[i];
                val.real = -Math.sqrt(-val.real) * z_i[i];
            }
        });
        data = fft.FFT2D(data, hr, wr);
        var field = new Float32Array(n * m);
        for (var i = 0; i < n; i++) {
            for (var j = 0; j < m; j++) {
                field[i * m + j] = data.real[i * hr + j];
            }
        }
        var mean = field[0];
        for (var i = 0; i < n * m; i++) {
            field[i] -= mean;
        }
        /*let [wx,wy] = [random.nextGaussian(),random.nextGaussian()];
        for(let i = 0 ;i < n;i++) {
            for(let j = 0 ;j < m;j++) {
                field[i*m + j] = field[i*m + j] + i*r/n * wx * j*r/m * wy * Math.sqrt(2*getC2(r,2*h));
            }
        }*/
        return field;
    }
    exports.genBrownian = genBrownian;
})(exports || (exports = {}));
/**
 * Created by Gwenael on 06/05/2017.
 */
var random;
(function (random) {
    var gaussian_last;
    var gaussian_use_last = false;
    function nextGaussian(mean, stdev) {
        if (mean === void 0) { mean = 0.; }
        if (stdev === void 0) { stdev = 1.; }
        var gaussian_std;
        if (gaussian_use_last) {
            gaussian_use_last = false;
            gaussian_std = gaussian_last;
        }
        else {
            var x1 = void 0, x2 = void 0, w = void 0;
            do {
                x1 = 2.0 * Math.random() - 1.0;
                x2 = 2.0 * Math.random() - 1.0;
                w = x1 * x1 + x2 * x2;
            } while (w >= 1.0);
            w = Math.sqrt((-2.0 * Math.log(w)) / w);
            gaussian_use_last = true;
            gaussian_last = x2 * w;
            gaussian_std = x1 * w;
        }
        return mean + stdev * gaussian_std;
    }
    random.nextGaussian = nextGaussian;
    function randomGaussians(n, mean, stdev) {
        if (mean === void 0) { mean = 0.; }
        if (stdev === void 0) { stdev = 1.; }
        var tab = null;
        if (n instanceof Float32Array)
            tab = n;
        else
            tab = new Float32Array(n);
        for (var i = 0; i < tab.length; i++) {
            tab[i] = nextGaussian(mean, stdev);
        }
        return tab;
    }
    random.randomGaussians = randomGaussians;
})(random || (random = {}));
