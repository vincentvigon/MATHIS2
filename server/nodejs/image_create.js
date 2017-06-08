/**
 * Created by Gwenael on 09/05/2017.
 */
let fs = require('fs'),
    PNG = require('node-png').PNG,
    br = require("./brownian.js");

let size = 256;
let r = 4;
let h = 0.8;
let id = 0;

let image = new PNG({
    width: size,
    height: size,
    filterType: 4
});

field = br.genBrownian(size,r,h);

let field_min = Infinity;
let field_max = -Infinity;

for(let el of field) {
    if(field_min > el)
        field_min = el;
    if(field_max < el)
        field_max = el;
}
// field_min = Math.min(...field);
// field_max = Math.max(...field);

let field_rg = field_max - field_min;
console.log(field_min,field_max);

for(let y = 0; y < image.height; y++) {
    for(let x = 0; x < image.width; x++) {
        let i = (image.width * y + x);
        // console.log(i," -> ",field[i]);
        let idx = i << 2;
        let val = (field[i] - field_min) * 256 / field_rg;
        val = Math.max(0,Math.min(255,val));
        image.data[idx  ] = val;
        image.data[idx+1] = val;
        image.data[idx+2] = val;
        image.data[idx+3] = 255;
    }
}

image.pack().pipe(fs.createWriteStream("./brownian/" + size + "_" + r + "_" + h + "_" + id + ".png"));
