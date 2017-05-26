/**
 * Created by vigon on 05/12/2016.
 */


/**https://scripter.click/typescript-example-generate-transform-manipulate-colors/*/

module mathis {

    

    export class Color {

        private rgb:RGB_range255;

        constructor(color:number|string|RGB_range255|HSV_01) {

            if (typeof color ==="number") {
                let res=this.hex2rgb(this.intToColorName(<number>color))
                this.rgb=new RGB_range255(res[0],res[1],res[2])
            }
            else if (typeof color ==="string") {
                let res=this.hex2rgb(color)
                this.rgb=new RGB_range255(res[0],res[1],res[2])
            }
            // else if (color instanceof Color.HEX) {
            //     this.hex = color;
            //     this.rgb = color.toRGB();
            // } else 
            else if (color instanceof RGB_range255) {
                this.rgb = color;
                //this.hex = color.toHex();
            }
            else if (color instanceof HSV_01){
                this.rgb = (<HSV_01>color).toRGB()
            }
        }


        static names = {
            favoriteGreen:"7CFC00",


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
        }
        
        
        hex2rgb(hex) {
            var h=hex.replace('#', '');
            h =  h.match(new RegExp('(.{'+h.length/3+'})', 'g'));

            for(var i=0; i<h.length; i++)
                h[i] = parseInt(h[i].length==1? h[i]+h[i]:h[i], 16);


            return h //'rgba('+h.join(',')+')';
        }



        public lighten(by:number):Color {
            this.rgb = this.rgb.lighten(by);
            //this.hex = this.rgb.toHex();
            return this;
        }

        public darken(by:number):Color {
            this.rgb = this.rgb.darken(by);
            //this.hex = this.rgb.toHex();
            return this;
        }

        // public toString(rgb:boolean = true):string {
        //     return (rgb) ? this.rgb.toString() : this.hex.toString();
        // }
        //
        // public setAlpha(a:number):Color {
        //     this.rgb.setAlpha(a);
        //     this.hex = this.rgb.toHex();
        //     return this;
        // }

        toBABYLON_Color4():BABYLON.Color4{
            return new BABYLON.Color4(this.rgb.r/255,this.rgb.g/255,this.rgb.b/255,this.rgb.alpha)
        }
        toBABYLON_Color3():BABYLON.Color3{
            return new BABYLON.Color3(this.rgb.r/255,this.rgb.g/255,this.rgb.b/255)
        }

        toString(){return this.rgb.toString()}

        private intToColorName(int:number):string{
            let nbColors=226-78
            let count=0

            for (let key in Color.names){
                if (Color.names.hasOwnProperty(key)) {
                    if (count == ((int*763)%nbColors)) {
                        return Color.names[key]
                    }
                    count++
                }
            }

        }

    }




    export class HSV_01 {

        static HSV_01_toRGB_01(h:number, s:number, v:number):{r:number;g:number;b:number} {
        var r, g, b, i, f, p, q, t:number;
        //if (h && s === undefined && v === undefined) {
        //    s = h.s, v = h.v, h = h.h;
        //}
        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0: r = v; g = t; b = p; break;
            case 1: r = q; g = v; b = p; break;
            case 2: r = p; g = v; b = t; break;
            case 3: r = p; g = q; b = v; break;
            case 4: r = t; g = p; b = v; break;
            case 5: r = v; g = p; b = q; break;
        }

        // if (hasCSSstring) {
        //     r= Math.floor(r * 255);
        //     g= Math.floor(g * 255);
        //     b= Math.floor(b * 255);
        //     return 'rgb('+r+','+g+','+b+')'
        // }
            return {r:r,g:g,b:b}
    }

        
        constructor(public h:number,public s:number,public v:number,public alpha=1) {
            
        }

        toRGB():RGB_range255 {
            
            let pre=HSV_01.HSV_01_toRGB_01(this.h,this.s,this.v)
            return new RGB_range255(pre.r*255,pre.g*255,pre.b*255,1)
            
        }
        
    }




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


    export class RGB_range255 {

        r:number = 0;
        g:number = 0;
        b:number = 0;
        alpha:number = 1;
        //private value:number = 0;

        constructor(r:number, g:number, b:number,alpha=1) {
            this.setRed(r).setGreen(g).setBlue(b).setAlpha(alpha);
            //this.updateValue();
        }


        private getHexPart(v:number):string {
            let h:string = v.toString(16);
            return (h.length > 1) ? h : "0" + h;
        }

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

        public setRed(value:number):RGB_range255 {
            this.r = (value > 255) ? 255 : ((value < 0) ? 0 : Math.floor(value));
            return this
        }


        public setGreen(value:number):RGB_range255 {
            this.g = (value > 255) ? 255 : ((value < 0) ? 0 : Math.floor(value));
            return this
        }

        public setBlue(value:number):RGB_range255 {
            this.b = (value > 255) ? 255 : ((value < 0) ? 0 : Math.floor(value));
            return this
        }

        public setAlpha(a:number):RGB_range255 {
            this.alpha = (a <= 1 && a >= 0) ? a : 1;
            return this;
        }


        public lighten(by:number):RGB_range255 {
            this.setRed(this.r + by)
                .setBlue(this.g + by)
                .setGreen(this.b + by);
            return this
        }

        public darken(by:number):RGB_range255 {
            this.setRed(this.r - by)
                .setBlue(this.g - by)
                .setGreen(this.b - by);
            return this
        }

        public toString():string {
            return (this.alpha < 1) ? 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + this.alpha + ')' : 'rgb(' + this.r + ',' + this.g + ',' + this.b + ')';
        }

    }



    export module color{


        export module thema{

            export var defaultSurfaceColor=new Color(new RGB_range255(255,50,50))
            export var defaultVertexColor=new Color(new RGB_range255(255,50,50))
            export var defaultLinkColor=new Color(new RGB_range255(124,252,0))

        }
        
    }
    
    
    
    





}

