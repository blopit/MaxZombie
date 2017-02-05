////////////////////////////////////////////////////////////////////////////////
// Ajax sync script require
// sync aditional JS scripts, makes things modular
////////////////////////////////////////////////////////////////////////////////

//add required scripts in post (Not actually required can just add in html...)
function require(jsFilePath) {
    var js = document.createElement("script");

    js.type = "text/javascript";
    js.src = jsFilePath;

    document.body.appendChild(js);
}

require("scripts/base_objects.js");
require("scripts/player.js");
require("scripts/svg.js");
require("scripts/computation.js");
require("scripts/sprite.js");
require("scripts/camera.js");

////////////////////////////////////////////////////////////////////////////////
// Globals
////////////////////////////////////////////////////////////////////////////////

/*var tintCanvas = document.createElement('canvas');
tintCanvas.width = 512;
tintCanvas.height = 512;
var tintCtx = tintCanvas.getContext('2d');
*/

//screen globals
screen_width = 960;
screen_height = 550;
screen_bound = 128;

ground_level = 920;
time = 0;
objtList = [];
globalSpeedMin = -2;//0.25;
spdtimer = 0;

mouse = {x:0,y:0};
emouse = mouse;

cam = null;
cvs = document.getElementById('screen');

var fps = {
    startTime : 0,
    frameNumber : 0,
    getFPS : function(){
        this.frameNumber++;
        var d = new Date().getTime(),
        currentTime = ( d - this.startTime ) / 1000,
        result = Math.floor( ( this.frameNumber / currentTime ) );
        if( currentTime > 1 ){
            this.startTime = new Date().getTime();
            this.frameNumber = 0;
        }
        return result;
    }
};

var Key = {
  _pressed: {},

  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  WEP1: 88,
  WEP2: 67,

  isDown: function(keyCode) {
    return this._pressed[keyCode];
  },

  onKeydown: function(event) {
    this._pressed[event.keyCode] = true;
  },

  onKeyup: function(event) {
    delete this._pressed[event.keyCode];
  }
};

var f = document.querySelector("#fps");

timefctr = 1.0;         //time factor

////////////////////////////////////////////////////////////////////////////////
// Event loop
////////////////////////////////////////////////////////////////////////////////

window.onload = function() {
    function addImage(list,url,w,h, xf, yf){
        var image = new Image();
        image.src = url;
        list.push(new sprite({ width: w, height: h, image: image, xoff: xf, yoff: yf}));
    }
    window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
    window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

    /*addImage(s_tree,"images/backgrounds/seed.png",76,40,0,0);
    addImage(s_tree,"images/backgrounds/sprout1.png",81,130,0,0);
    addImage(s_tree,"images/backgrounds/small_tree.png",704,729,0,0);
    addImage(s_tree,"images/backgrounds/big_tree.png",1370,891,0,0);

    addImage(s_back,"images/backgrounds/back.png",1600,1000,0,0);

    addImage(s_icon,"images/sprites/Icongrow.png",55,55,27,27);
    addImage(s_icon,"images/sprites/Iconwarm.png",55,55,27,27);*/

    /*Bear : 296x448
    Frog : 216x205 (0,260)
    Bee : 90x90 (765,45)
    */
    /*var image = new Image();
    image.src = "images/sprites/ss_ws_old.png";
    s_worm.push(new sprite({ width: 164, height: 121,
        numberframes: 5,
        image: image, yyf: 121, xoff: 70, yoff: 75}));

    image.src = "images/sprites/ss_ws_old.png";
    s_snail.push(new sprite({ width: 164, height: 121,
        numberframes: 5,
        image: image, xoff: 90, yoff: 75}));

    image = new Image();
    image.src = "images/sprites/ss_ws.png";
    s_frog.push(new sprite({ width: 216, height: 205,
        numberframes: 5,
        image: image, yyf: 260, xoff: 108, yoff: 128}));

    image = new Image();
    image.src = "images/sprites/ss_br.png";
    s_bear.push(new sprite({ width: 296, height: 500,
        numberframes: 5,
        image: image, xoff: 150, yoff: 250}));

    s_bear.push(new sprite({ width: 296, height: 500,
        numberframes: 2,
        image: image, xoff: 150, yoff: 250, yyf: 500}));

    image = new Image();
    image.src = "images/sprites/ss_bv.png";
    s_beaver.push(new sprite({ width: 202, height: 207,
        numberframes: 3,
        image: image, xoff: 100, yoff: 100}));

    image.src = "images/sprites/ss_bv.png";
    s_beaver.push(new sprite({ width: 202, height: 207,
        numberframes: 4,
        image: image, xoff: 100, yoff: 100, yyf: 207}));

    image = new Image();
    image.src = "images/sprites/ss_ws.png";
    s_bee.push(new sprite({ width: 100, height: 100,
        numberframes: 3,
        image: image, xoff: 50, yoff: 50, xxf: 770, yyf: 36}));*/

    //get & set canvas
    cam = new camera(0.05);
    rectx = {x: 0, y: 0, width: 1600, height: 1000};
    cam.bound = rectx;
    cam.cx = screen_width/2;
    cam.cy = screen_height/2;


    var c = cvs.getContext('2d');
    c.canvas.width = screen_width;
    c.canvas.height = screen_height;

    /*addSection([285,552,287,592,331,574,327,541],"dirt");
    addSection([282,552,285,592,224,590,236,552],"dirt");
    addSection([188,544,178,584,223,590,236,552],"dirt");

    addSection([320,161,324,105,322,1,345,0,347,105,347,164,344,168],"branch");
    addSection([218,179,213,83,195,52,178,24,171,11,168,0,143,0,147,29,170,75,183,91,196,118,208,148],"branch");
    addSection([294,245,311,206,321,161,345,168,338,202,324,236,306,270,295,304,294,273],"branch");

    addSection([206,2,213,82,218,176,253,171,292,173,289,87,287,24,286,1],"trunk");
    addSection([218,177,221,330,296,329,292,173,253,171],"trunk");
    addSection([215,456,221,330,297,328,299,454],"trunk");
    addSection([184,541,210,494,214,454,299,455,312,504,333,539,289,551,257,553,208,547],"trunk");
    */

    //addSection([191,525,180,576,0,586,1,525],"shade");
    //addSection([326,529,332,573,523,586,521,521,409,525],"shade");


    /*var x = new snail(900,800);
    x.faction = 2;
    w = x;
    objtList.push(x);*/
    PL = new player(256,500,128,48);
    PL.faction = 0;
    objtList.push(PL);

    objtList.push(new block(0,213,960,32));
    objtList.push(new block(0,640,960,32));

    objtList.push(new zombie(600,400));


    //objtList.push(new frog(600,400));
    //objtList.push(new bear(600,600));
    //objtList.push(new beaver(600,200));

    setInterval(function() {
        time++;

        if (time % 240 === 0) {
            globalSpeedMin -= 0.25;
            spdtimer+=15;
            globalSpeedMin = -5 + 3*Math.cos(degtorad(spdtimer));

            for (var i = 0; i < Math.ceil(Math.random()*60); i++) {
                if (Math.random() < 0.80) {
                    objtList.push(new zombieDumb(1200,213+Math.random()*500));
                } else {
                    objtList.push(new zombie(1000,213+Math.random()*500));
                }
            }

        }

        f.innerHTML = "FPS: " + globalSpeedMin;//fps.getFPS();
        c.fillStyle = "black";
        c.fillRect(0,0,screen_width,screen_height);

        //save canvas settings
        c.save();

        canvas = c;

        //draw objects relative to centered camera
        c.translate(cam.width/2-cam.cx,cam.height/2-cam.cy);
        cam.update();

        c.fillStyle = "lime";
        c.fillRect(0,0,screen_width,screen_height);


        blockList = [];
        bulletList = [];
        zombieList = [];
        for (var i = 0; i < objtList.length; i++) {
            if (objtList[i].name === 'block') {
                blockList.push(objtList[i]);
            } else if (objtList[i].name === 'bullet') {
                bulletList.push(objtList[i]);
            } else if (objtList[i].name === 'zombie') {
                zombieList.push(objtList[i]);
            }
        }

        //cam.springTo(x.x,x.y);
        //draw objects TODO: draw objects by depth property
        for (var i = 0; i < objtList.length; i++) {
            var o = objtList[i];
            o.update(c, Key, objtList);
            o.draw(c);
        }
        c.strokeStyle = "black";
        c.restore();

    }, 1000 / 60); //60fps TODO: find better/faster way to do this
};


