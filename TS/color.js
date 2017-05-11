/**
 * Created by vigon on 05/12/2016.
 */
/**https://scripter.click/typescript-example-generate-transform-manipulate-colors/*/
var mathis;
(function (mathis) {
    var Color = (function () {
        function Color(color) {
            if (typeof color === "number") {
                var res = this.hex2rgb(this.intToColorName(color));
                this.rgb = new RGB_range255(res[0], res[1], res[2]);
            }
            else if (typeof color === "string") {
                var res = this.hex2rgb(color);
                this.rgb = new RGB_range255(res[0], res[1], res[2]);
            }
            else if (color instanceof RGB_range255) {
                this.rgb = color;
            }
            else if (color instanceof HSV_01) {
                this.rgb = color.toRGB();
            }
        }
        Color.prototype.hex2rgb = function (hex) {
            var h = hex.replace('#', '');
            h = h.match(new RegExp('(.{' + h.length / 3 + '})', 'g'));
            for (var i = 0; i < h.length; i++)
                h[i] = parseInt(h[i].length == 1 ? h[i] + h[i] : h[i], 16);
            return h; //'rgba('+h.join(',')+')';
        };
        Color.prototype.lighten = function (by) {
            this.rgb = this.rgb.lighten(by);
            //this.hex = this.rgb.toHex();
            return this;
        };
        Color.prototype.darken = function (by) {
            this.rgb = this.rgb.darken(by);
            //this.hex = this.rgb.toHex();
            return this;
        };
        // public toString(rgb:boolean = true):string {
        //     return (rgb) ? this.rgb.toString() : this.hex.toString();
        // }
        //
        // public setAlpha(a:number):Color {
        //     this.rgb.setAlpha(a);
        //     this.hex = this.rgb.toHex();
        //     return this;
        // }
        Color.prototype.toBABYLON_Color4 = function () {
            return new BABYLON.Color4(this.rgb.r / 255, this.rgb.g / 255, this.rgb.b / 255, this.rgb.alpha);
        };
        Color.prototype.toBABYLON_Color3 = function () {
            return new BABYLON.Color3(this.rgb.r / 255, this.rgb.g / 255, this.rgb.b / 255);
        };
        Color.prototype.toString = function () { return this.rgb.toString(); };
        Color.prototype.intToColorName = function (int) {
            var nbColors = 226 - 78;
            var count = 0;
            for (var key in Color.names) {
                if (Color.names.hasOwnProperty(key)) {
                    if (count == ((int * 763) % nbColors)) {
                        return Color.names[key];
                    }
                    count++;
                }
            }
        };
        Color.names = {
            aliceblue: "f0f8ff",
            antiquewhite: "faebd7",
            aqua: "0ff",
            aquamarine: "7fffd4",
            azure: "f0ffff",
            beige: "f5f5dc",
            bisque: "ffe4c4",
            black: "000",
            blanchedalmond: "ffebcd",
            blue: "00f",
            blueviolet: "8a2be2",
            brown: "a52a2a",
            burlywood: "deb887",
            burntsienna: "ea7e5d",
            cadetblue: "5f9ea0",
            chartreuse: "7fff00",
            chocolate: "d2691e",
            coral: "ff7f50",
            cornflowerblue: "6495ed",
            cornsilk: "fff8dc",
            crimson: "dc143c",
            cyan: "0ff",
            darkblue: "00008b",
            darkcyan: "008b8b",
            darkgoldenrod: "b8860b",
            darkgray: "a9a9a9",
            darkgreen: "006400",
            darkgrey: "a9a9a9",
            darkkhaki: "bdb76b",
            darkmagenta: "8b008b",
            darkolivegreen: "556b2f",
            darkorange: "ff8c00",
            darkorchid: "9932cc",
            darkred: "8b0000",
            darksalmon: "e9967a",
            darkseagreen: "8fbc8f",
            darkslateblue: "483d8b",
            darkslategray: "2f4f4f",
            darkslategrey: "2f4f4f",
            darkturquoise: "00ced1",
            darkviolet: "9400d3",
            deeppink: "ff1493",
            deepskyblue: "00bfff",
            dimgray: "696969",
            dimgrey: "696969",
            dodgerblue: "1e90ff",
            firebrick: "b22222",
            floralwhite: "fffaf0",
            forestgreen: "228b22",
            fuchsia: "f0f",
            gainsboro: "dcdcdc",
            ghostwhite: "f8f8ff",
            gold: "ffd700",
            goldenrod: "daa520",
            gray: "808080",
            green: "008000",
            greenyellow: "adff2f",
            grey: "808080",
            honeydew: "f0fff0",
            hotpink: "ff69b4",
            indianred: "cd5c5c",
            indigo: "4b0082",
            ivory: "fffff0",
            khaki: "f0e68c",
            lavender: "e6e6fa",
            lavenderblush: "fff0f5",
            lawngreen: "7cfc00",
            lemonchiffon: "fffacd",
            lightblue: "add8e6",
            lightcoral: "f08080",
            lightcyan: "e0ffff",
            lightgoldenrodyellow: "fafad2",
            lightgray: "d3d3d3",
            lightgreen: "90ee90",
            lightgrey: "d3d3d3",
            lightpink: "ffb6c1",
            lightsalmon: "ffa07a",
            lightseagreen: "20b2aa",
            lightskyblue: "87cefa",
            lightslategray: "789",
            lightslategrey: "789",
            lightsteelblue: "b0c4de",
            lightyellow: "ffffe0",
            lime: "0f0",
            limegreen: "32cd32",
            linen: "faf0e6",
            magenta: "f0f",
            maroon: "800000",
            mediumaquamarine: "66cdaa",
            mediumblue: "0000cd",
            mediumorchid: "ba55d3",
            mediumpurple: "9370db",
            mediumseagreen: "3cb371",
            mediumslateblue: "7b68ee",
            mediumspringgreen: "00fa9a",
            mediumturquoise: "48d1cc",
            mediumvioletred: "c71585",
            midnightblue: "191970",
            mintcream: "f5fffa",
            mistyrose: "ffe4e1",
            moccasin: "ffe4b5",
            navajowhite: "ffdead",
            navy: "000080",
            oldlace: "fdf5e6",
            olive: "808000",
            olivedrab: "6b8e23",
            orange: "ffa500",
            orangered: "ff4500",
            orchid: "da70d6",
            palegoldenrod: "eee8aa",
            palegreen: "98fb98",
            paleturquoise: "afeeee",
            palevioletred: "db7093",
            papayawhip: "ffefd5",
            peachpuff: "ffdab9",
            peru: "cd853f",
            pink: "ffc0cb",
            plum: "dda0dd",
            powderblue: "b0e0e6",
            purple: "800080",
            rebeccapurple: "663399",
            red: "f00",
            rosybrown: "bc8f8f",
            royalblue: "4169e1",
            saddlebrown: "8b4513",
            salmon: "fa8072",
            sandybrown: "f4a460",
            seagreen: "2e8b57",
            seashell: "fff5ee",
            sienna: "a0522d",
            silver: "c0c0c0",
            skyblue: "87ceeb",
            slateblue: "6a5acd",
            slategray: "708090",
            slategrey: "708090",
            snow: "fffafa",
            springgreen: "00ff7f",
            steelblue: "4682b4",
            tan: "d2b48c",
            teal: "008080",
            thistle: "d8bfd8",
            tomato: "ff6347",
            turquoise: "40e0d0",
            violet: "ee82ee",
            wheat: "f5deb3",
            white: "fff",
            whitesmoke: "f5f5f5",
            yellow: "ff0",
            yellowgreen: "9acd32"
        };
        return Color;
    }());
    mathis.Color = Color;
    var HSV_01 = (function () {
        function HSV_01(h, s, v, alpha) {
            if (alpha === void 0) { alpha = 1; }
            this.h = h;
            this.s = s;
            this.v = v;
            this.alpha = alpha;
        }
        HSV_01.HSV_01_toRGB_01 = function (h, s, v) {
            var r, g, b, i, f, p, q, t;
            //if (h && s === undefined && v === undefined) {
            //    s = h.s, v = h.v, h = h.h;
            //}
            i = Math.floor(h * 6);
            f = h * 6 - i;
            p = v * (1 - s);
            q = v * (1 - f * s);
            t = v * (1 - (1 - f) * s);
            switch (i % 6) {
                case 0:
                    r = v;
                    g = t;
                    b = p;
                    break;
                case 1:
                    r = q;
                    g = v;
                    b = p;
                    break;
                case 2:
                    r = p;
                    g = v;
                    b = t;
                    break;
                case 3:
                    r = p;
                    g = q;
                    b = v;
                    break;
                case 4:
                    r = t;
                    g = p;
                    b = v;
                    break;
                case 5:
                    r = v;
                    g = p;
                    b = q;
                    break;
            }
            // if (hasCSSstring) {
            //     r= Math.floor(r * 255);
            //     g= Math.floor(g * 255);
            //     b= Math.floor(b * 255);
            //     return 'rgb('+r+','+g+','+b+')'
            // }
            return { r: r, g: g, b: b };
        };
        HSV_01.prototype.toRGB = function () {
            var pre = HSV_01.HSV_01_toRGB_01(this.h, this.s, this.v);
            return new RGB_range255(pre.r * 255, pre.g * 255, pre.b * 255, 1);
        };
        return HSV_01;
    }());
    mathis.HSV_01 = HSV_01;
    // export class HEX {
    //
    //     static format(hex):string {
    //         let hex:string
    //          /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex) //(hex.toString().length == 6) ? "#" + hex : (hex.toString().length == 7) ? hex : null;
    //     }
    //
    //     private hex:string = "#000000";
    //
    //     constructor(hex:string) {
    //         this.hex = HEX.format(hex)
    //     }
    //
    //     public toRGB():RGB {
    //         let hexString:string = this.hex.substr(1).toString();
    //         return new RGB(parseInt(hexString.substr(0, 2), 16), parseInt(hexString.substr(2, 2), 16), parseInt(hexString.substr(4, 2), 16));
    //     }
    //
    //     public toString():string {
    //         return this.hex;
    //     }
    // }
    var RGB_range255 = (function () {
        //private value:number = 0;
        function RGB_range255(r, g, b, alpha) {
            if (alpha === void 0) { alpha = 1; }
            this.r = 0;
            this.g = 0;
            this.b = 0;
            this.alpha = 1;
            this.setRed(r).setGreen(g).setBlue(b).setAlpha(alpha);
            //this.updateValue();
        }
        RGB_range255.prototype.getHexPart = function (v) {
            var h = v.toString(16);
            return (h.length > 1) ? h : "0" + h;
        };
        // public updateValue():RGB {
        //     this.value = (this.getRed() + this.getGreen() + this.getBlue());
        //     return this;
        // }
        //
        // public getValue():number {
        //     return this.value;
        // }
        // public toHex():string {
        //     return (this.alpha < 1) ? this.toHexAlpha().toString() : "#" + this.getHexPart(this.r) + this.getHexPart(this.g) + this.getHexPart(this.b);
        // }
        //
        // public toHexAlpha(light:boolean = true):string {
        //     let tmpRgb:RGB = new RGB(this.r, this.g, this.b);
        //     if (this.alpha < 1) {
        //         let tmp:number = (1 - this.alpha);
        //         tmpRgb.setRed(tmpRgb.r * tmp);
        //         tmpRgb.setGreen(tmpRgb.g * tmp);
        //         tmpRgb.setBlue(tmpRgb.b * tmp);
        //     }
        //     let adjustValue:number = (this.alpha < 1) ? Math.floor(255 * this.alpha) : 0;
        //     return (light) ? tmpRgb.lighten(adjustValue).toHex() : tmpRgb.darken(adjustValue).toHex();
        // }
        RGB_range255.prototype.setRed = function (value) {
            this.r = (value > 255) ? 255 : ((value < 0) ? 0 : Math.floor(value));
            return this;
        };
        RGB_range255.prototype.setGreen = function (value) {
            this.g = (value > 255) ? 255 : ((value < 0) ? 0 : Math.floor(value));
            return this;
        };
        RGB_range255.prototype.setBlue = function (value) {
            this.b = (value > 255) ? 255 : ((value < 0) ? 0 : Math.floor(value));
            return this;
        };
        RGB_range255.prototype.setAlpha = function (a) {
            this.alpha = (a <= 1 && a >= 0) ? a : 1;
            return this;
        };
        RGB_range255.prototype.lighten = function (by) {
            this.setRed(this.r + by)
                .setBlue(this.g + by)
                .setGreen(this.b + by);
            return this;
        };
        RGB_range255.prototype.darken = function (by) {
            this.setRed(this.r - by)
                .setBlue(this.g - by)
                .setGreen(this.b - by);
            return this;
        };
        RGB_range255.prototype.toString = function () {
            return (this.alpha < 1) ? 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + this.alpha + ')' : 'rgb(' + this.r + ',' + this.g + ',' + this.b + ')';
        };
        return RGB_range255;
    }());
    mathis.RGB_range255 = RGB_range255;
    var color;
    (function (color) {
        var thema;
        (function (thema) {
            thema.defaultSurfaceColor = new Color(new RGB_range255(255, 50, 50));
            thema.defaultVertexColor = new Color(new RGB_range255(255, 50, 50));
            thema.defaultLinkColor = new Color(new RGB_range255(124, 252, 0));
        })(thema = color.thema || (color.thema = {}));
    })(color = mathis.color || (mathis.color = {}));
    /** OLD FUNCTIONS*/
    /* accepts parameters
     * h  Object = {h:x, s:y, v:z}
     * OR
     * h, s, v
     *
     * 0 <= h, s, v <= 1
     */
    function HSVtoRGB(h, s, v, hasCSSstring) {
        if (hasCSSstring === void 0) { hasCSSstring = true; }
        var r, g, b, i, f, p, q, t;
        //if (h && s === undefined && v === undefined) {
        //    s = h.s, v = h.v, h = h.h;
        //}
        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0:
                r = v;
                g = t;
                b = p;
                break;
            case 1:
                r = q;
                g = v;
                b = p;
                break;
            case 2:
                r = p;
                g = v;
                b = t;
                break;
            case 3:
                r = p;
                g = q;
                b = v;
                break;
            case 4:
                r = t;
                g = p;
                b = v;
                break;
            case 5:
                r = v;
                g = p;
                b = q;
                break;
        }
        if (hasCSSstring) {
            r = Math.floor(r * 255);
            g = Math.floor(g * 255);
            b = Math.floor(b * 255);
            return 'rgb(' + r + ',' + g + ',' + b + ')';
        }
        else
            return { r: r, g: g, b: b };
    }
    mathis.HSVtoRGB = HSVtoRGB;
    function hexToRgb(hex, maxIs255) {
        if (maxIs255 === void 0) { maxIs255 = false; }
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        var denominator = (maxIs255) ? 1 : 255;
        return result ? {
            r: parseInt(result[1], 16) / denominator,
            g: parseInt(result[2], 16) / denominator,
            b: parseInt(result[3], 16) / denominator
        } : null;
    }
    mathis.hexToRgb = hexToRgb;
    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
    function rgbToHex(r, g, b) {
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }
    mathis.rgbToHex = rgbToHex;
})(mathis || (mathis = {}));
