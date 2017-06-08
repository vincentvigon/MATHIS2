/**
 * Created by Gwenael on 10/05/2017.
 */

let http = require('http');
let fs = require('fs');
let brownian = require('./brownian.js');
let PNG = require('node-png').PNG;
// let index = fs.readFileSync('./brownian/256_4_0.8_0.png');

function makeBrownian(size,r,h,id) {
    let image = new PNG({
        width: size,
        height: size,
        filterType: 4
    });

    let a = new Date().getTime();
    field = brownian.genBrownian(size,r,h);
    let b = new Date().getTime();
    console.log("Time : " + (b - a) + "ms.");


    let field_min = Infinity;
    let field_max = -Infinity;

    for(let el of field) {
        if(field_min > el)
            field_min = el;
        if(field_max < el)
            field_max = el;
    }

    let field_rg = field_max - field_min;
    // console.log(field_min,field_max);

    for(let y = 0; y < image.height; y++) {
        for(let x = 0; x < image.width; x++) {
            let i = (image.width * y + x);
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
}

function getBrownian(url,res) {
    let [size,r,h,id,...other] = url.split("_");
    size = Number(size);
    r = Number(r);
    h = Number(h);
    id = Number(id);
    if(size === undefined || typeof(size) !== "number" ||
       r === undefined    || typeof(r) !== "number" ||
       h === undefined    || typeof(h) !== "number" ||
       id === undefined   || typeof(id) !== "number" ||
       other.length != 0) {
        res.writeHead(404);
        res.end("");
        console.log(size,r,h,id,other);
        return;
    }
    if(!Number.isInteger(size) || !Number.isInteger(r) || !Number.isInteger(id) || !Number.isInteger(h * 20)) {
        res.writeHead(404);
        res.end("");
        return;
    }
    if(size < 32 || size > 2048 || (size & (size - 1)) != 0) {
        res.writeHead(404);
        res.end("");
        // console.log("s.");
        return;
    }
    if(h < 0.2 || h > 2.0 || r < 1 || r > 10 || id < 0 || id > 9) {
        res.writeHead(404);
        res.end("");
        // console.log("other.");
        return;
    }

    let filename = "/brownian/" + size + "_" + r + "_" + h + "_" + id + ".png";
    if(!fs.existsSync("." + filename)) {
        console.log("Generate new brownian.");
        fs.writeFileSync("." + filename,"");
        res.writeHead(201,{'Content-Type': 'image/png','Access-Control-Allow-Origin' : "*"});
        // res.end();
        makeBrownian(size,r,h,id);
        // return;
    } else {
        res.writeHead(200, {'Content-Type': 'image/png','Access-Control-Allow-Origin' : "*"});
    }
    let index = fs.readFileSync("." + filename);

    res.end(index);
}

http.createServer(function (req,res) {
    if(req.url.startsWith("/brownian/") && req.url.endsWith(".png"))
        getBrownian(req.url.slice(10,-4),res);
    else {
        res.writeHead(404);
        res.end("");
    }

}).listen(9615);


