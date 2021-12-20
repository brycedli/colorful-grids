var numX = 16;
var numY = 16;

var gridX = 50;
var gridY = 50;
//800
var colors = [];
var offsets = []

var colorsOutside = []
var colorsInside = []
var spotColor;
var hueSlider;
var varianceSlider;
var keySlider;
var numSlider;

function setup() {
    createCanvas(gridX*numX, gridY*numY);
    let margin = 20;
    let spacing = 50;
    var anchorX = gridX * numX + margin;
    
    hueSlider = createSlider(0, 255);
    hueSlider.input(updateColors);
    varianceSlider = createSlider(0, 255, 128);
    varianceSlider.input(updateColors);

    keySlider = createSlider(0, 255*2, 255);
    keySlider.input(updateColors);

    satSlider = createSlider(0, 255 * 2, 255);
    satSlider.input(updateColors);

    numSlider = createSlider(2,12);
    numSlider.input(createColors);

    

    createColors();
    textSize(32);
    // text('word', 10, 30);
    let hueElement = createElement('p', 'spot color');
    var textHeight = 12;
    hueElement.position(anchorX,0*spacing);
    hueSlider.position(anchorX, 0*spacing + margin + textHeight)
    hueSlider.size(200, AUTO);

    let varElement = createElement('p', 'n-ad variance');
    varElement.position(anchorX,1*spacing);
    varianceSlider.position(anchorX, 1*spacing + margin + textHeight)
    varianceSlider.size(200, AUTO);

    let keyElement = createElement('p', 'key');
    keyElement.position(anchorX,2*spacing);
    keySlider.position(anchorX, 2*spacing + margin + textHeight)
    keySlider.size(200, AUTO);

    let satElement = createElement('p', 'saturation');
    satElement.position(anchorX,3*spacing);
    satSlider.position(anchorX, 3*spacing + margin + textHeight)
    satSlider.size(200, AUTO);

    let numElement = createElement('p', 'number of colors');
    numElement.position(anchorX,4*spacing);
    numSlider.position(anchorX, 4*spacing + margin + textHeight)
    numSlider.size(200, AUTO);


}

function keyTyped(){
    if (key == 'p'){
        print("saving");
        let timeStamp = year() + "-" + month() + "-" + day() + "-" + hour() + "-" + minute() + "-" + second();
        save('mosaic' + timeStamp);
    }
}
function mousePressed() {
    if (mouseX > 0 && mouseY > 0 && mouseX < gridX*numX && mouseY < gridY*numY){
        createColors();

    }
    // colorOutside = hslToRgb(random(0, 1), random(0, 1), random(0, 1));
    // colorInside = hslToRgb(random(0, 1), random(0, 1), random(0, 1));
}
function createColors(){
    var satVariance = 0.2;
    var keyVariance = 0.5;
    for (var i = 0; i < numSlider.value() + 1; i++){
        offsets[i] = new Offset(0, random(-satVariance, satVariance), random(-keyVariance, keyVariance));
        // offsets[i].sOff = random(-satVariance, satVariance);
        // offsets[i].kOff = random(-keyVariance, keyVariance);
    }
    updateColors();

    // var satVariance = 0.2;
    // var keyVariance = 0.5;
    // for (var i = 1; i < colors.length; i++){
    //     colors[i].s += random(-satVariance, satVariance);
    //     colors[i].v += random(-keyVariance, keyVariance);
    // }
    
    // colors = nAd(hueSlider.value()/255, varianceSlider.value()/255 * PI, numSlider.value());
    // var t = n[0];
    // spotColor = n[1];
    for (var i = 0; i < numX; i++){
        colorsInside[i] = [];
        colorsOutside[i] = [];

        for (var j = 0; j < numY; j++) {
            colorsInside[i][j] = int(random(1, colors.length));
            colorsOutside[i][j] = int(random(1, colors.length));
            // if (random(0,1) < 0.1){
            //     colorsInside[i][j] = 0; //randomly assign spot color of type Color to inside
            // }
            // else if (random(0,1) < 0.1){
            //     colorsOutside[i][j] = 0; //randomly assign spot color of type Color to outside
            // }
            // var satVariance = 0.2;
            
            // colorsOutside[i][j] = keySlider.value()/255;
            // colorsOutside[i][j][1] += random(-satVariance, satVariance);
            // colorsInside[i][j][2] = keySlider.value()/255;
            // colorsInside[i][j][1] += random(-satVariance, satVariance);


        }
    }
}
//functions of rotation, scale, and etc. 

function updateColors () {
    // print(colors);
    colors = nAd(hueSlider.value()/255, varianceSlider.value()/255 * PI, numSlider.value());
    // print(colors);
    print(offsets, colors)
    for (var i = 1; i < colors.length; i++){
        colors[i].v *= keySlider.value()/255;
        colors[i].s *= satSlider.value()/255;
        
        colors[i].v += offsets[i].v;
        colors[i].s += offsets[i].s;
    }
}

function nAd (sourceHue, range, numColors){ //type: color object
    sourceHue *= PI*2;
    var shifts = [];
    shifts.push(new Color((sourceHue/ (PI*2) ) % 1, 1, 0.5));
    for (var i = 0; i < numColors; i++){
        var shift = sourceHue-PI - range/2 + i * range/numColors;
        // shifts.push([(shift/ (PI*2) ) % 1, 1, 0.5]);
        // print(numColors, colors.length);
        // if (colors.length > 0){
        //     shifts.push(new Color((shift/ (PI*2) ) % 1, colors[i].s, colors[i].k));
        // }
        shifts.push(new Color((shift/ (PI*2) ) % 1, 1, 0.5));
    }
    
    return shifts;
    // return [shifts, [(sourceHue/ (PI*2) ) % 1, 1, 0.5]]
}



function draw() {
    noStroke();
    

    for (var i = 0; i < numX; i++){
        for (var j = 0; j < numY; j++) {
            // fill()
            // var spot = hslToRgb(spotColor[0], spotColor[1], spotColor[2])
            // console.log(colorsInside[i][j]);
            var inside = colors[colorsInside[i][j]].getRGB();
            var outside = colors[colorsOutside[i][j]].getRGB();
            // var inside = hslToRgb(colorsInside[i][j][0], colorsInside[i][j][1], colorsInside[i][j][2]);
            // var outside = hslToRgb(colorsOutside[i][j][0], colorsOutside[i][j][1], colorsOutside[i][j][2])
            // console.log(colorsInside[i][j]);
            fill(outside[0],outside[1],outside[2]);

            // if (random(0,1) < 0.01){
            //     fill(spot[0], spot[1], spot[2]);
            // }
            rect(i * gridX, j * gridY, gridX, gridY);
            
            fill(inside[0],inside[1],inside[2]);

            // if (random(0,1) < 0.0001){
            //     fill(spot[0], spot[1], spot[2]);

            // }
            ellipse(i * gridX + gridX/2, j * gridY + gridY/2, gridX/2, gridY/2)

            // rect(i * gridX + gridX/4, j * gridY + gridY/4, gridX/2, gridY/2)
        }
    }
    // fill(testHSL[0],testHSL[1],testHSL[2]);
    // rect(20, 30, 40, 50);

}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   {number}  h       The hue
 * @param   {number}  s       The saturation
 * @param   {number}  l       The lightness
 * @return  {Array}           The RGB representation
 */

class Offset {
    constructor (hOff, sOff, vOff) {
        this.h = hOff;
        this.s = sOff;
        this.v = vOff;
    }
}
class Color {
    constructor (h, s, v) {
        this.h = h;
        this.s = s;
        this.v = v;
        // this.key = 0.5;
    }

    getRGB () {
        var hslResult = this.hslToRgb(this.h, this.s, this.v);
        return hslResult;
    }

    hslToRgb(h, s, l){
        var r, g, b;
    
        if(s == 0){
            r = g = b = l; // achromatic
        }else{
            var hue2rgb = function hue2rgb(p, q, t){
                if(t < 0) t += 1;
                if(t > 1) t -= 1;
                if(t < 1/6) return p + (q - p) * 6 * t;
                if(t < 1/2) return q;
                if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            }
    
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
    
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }
}