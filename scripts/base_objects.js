
// BASE OBJECTS DOCUMENT
////////////////////////////////////////////////////////////////////////////////
// displayable PARENT (objects that do not collide with anything, eg foreground)
////////////////////////////////////////////////////////////////////////////////

function display(x, y, width, height) {
    this.sprite = null; //related image
    this.width = width || 0;
    this.height = height || 0;
    this.x = x || 0;
    this.y = y || 0;
    this.frame = 0;
    this.depth = 0; //TODO: implement
    this.on_screen = true;
    this.bound = "rect";
    this.name = "display"
}

//draw called for all visible objects on screen
display.prototype.draw = function (c) {
    c.fillStyle = "white";
    c.fillRect(this.x,this.y,this.width,this.height);
}

//update called for all objects
display.prototype.update = function (b, keys) {
}

////////////////////////////////////////////////////////////////////////////////
// object PARENT / all objects that are not entities (powerups, projectiles, blocks)
////////////////////////////////////////////////////////////////////////////////

function objt(x, y, width, height) {
    display.call(this, x, y, width, height);
    this.name = "objt"
    //horizonal SPEED
    this.hsp = 0;

    //vertical SPEED
    this.vsp = 0;
}

objt.prototype.draw = function (c) {
    c.fillStyle = "blue";
    c.fillRect(this.x,this.y,this.width,this.height);
}

objt.prototype.update = function (b, keys) {
}
//////////////////

function checkCol(that, kb) {
    if (that.hitStun > 0 || that.faction == 1)
        return;

    var kb = kb || true;
    var rectx = {x: that.x, y: that.y, width: that.width, height: that.height};

    for (var i = 0; i < objtList.length; i++) {
        var o = objtList[i];
        if (o.bound != "hbox")
            continue;
        if (o.owner.faction == that.faction)
            continue;

        var rectr = {x: o.x, y: o.y, width: o.width, height: o.height};
        if (colRxR(rectx,rectr)) {
            that.hitStun = 30;
            that.li = 1;
            that.hp -= o.damage;
            that.vsp -= o.owner.vKB;
            that.hsp += o.owner.hKB * o.owner.xscale;
        }

    }
}

function hbox(x, y, width, height, speed, damage) {
    display.call(this, x, y, width, height);
    this.damage = damage;
    this.life = life;
    this.bound = "rect";
    this.name = "hbox"
}

hbox.prototype.draw = function (c) {
    c.fillStyle = "red";
    c.fillRect(this.x,this.y*0.75,this.width,this.height*0.75);
}

hbox.prototype.update = function (b, keys) {
    this.life--;
    if (this.life <= 0)
        remove(this);
}

//////////////

function warm(x, y, r, life, hsp, vsp, col) {
    display.call(this, x-r, y-r, r*2, r*2);
    this.name = "warm";

    this.life = life;
    this.maxlife = life;
    this.bound = "bubble";
    this.hsp = hsp;
    this.vsp = vsp;
    this.r = r;
    this.col = col;
}

warm.prototype.draw = function (c) {
    c.globalAlpha = 0.85 * Math.max(this.life/this.maxlife,0);
    drawWarm(c,this.x,this.y,this.r,this.col);
    c.globalAlpha = 1.0;
}

warm.prototype.update = function (b, keys) {
    this.vsp-=0.25;
    this.x+=this.hsp;
    this.y+=this.vsp;
    this.life--;
    if (this.life <= 0)
        remove(this);
}

////////////////////////
function bullet(owner, x, y, r, life, hsp, vsp, damage) {
    display.call(this, x-r, y-r, r*2, r*2);

    this.name = "bullet";
    this.bound = "circle";

    this.owner =
    this.life = life;
    this.maxlife = life;

    this.hsp = hsp;
    this.vsp = vsp;
    this.r = r;
}

bullet.prototype.draw = function (c) {
    c.beginPath();
    c.arc(this.x, this.y*0.75, this.r, 0, 2 * Math.PI, false);
    c.fillStyle = 'yellow';
    c.fill();
}

bullet.prototype.update = function (b, keys) {
    this.x+=this.hsp;
    this.y+=this.vsp;
    this.life--;
    if (this.life <= 0)
        remove(this);
}

////////////////////////////////////////////////////////////////////////////////
// instance PARENT // objects that are entities (player, enemies)
////////////////////////////////////////////////////////////////////////////////
function block (x, y, width, height) {
    display.call(this, x, y, width, height);
    this.bound = "rect"
    this.name = "block"
}

block.prototype.update = function (b, keys) {
}

block.prototype.draw = function (c) {
    c.fillStyle = "blue";
    c.fillRect(this.x,this.y*0.75,this.width,this.height*0.75);
}



function vehicle(x, y, width, height) {
    instance.call(this, x, y, width, height);
    this.bound = "rect";
    this.name = "vehicle"

    this.mvang = 0;
    this.groudFric = 24;
    this.weight = 1;
    this.moveAmount = 8;

    this.handling = 20;
    this.steerDir = 0;
    this.steerSpd = 5;
    this.steerSnapback = 5;
}

vehicle.prototype.draw = function (c) {
    c.fillStyle = "aqua";
    c.fillRect(this.x,this.y*0.75,this.width,this.height*0.75);
}

vehicle.prototype.update = function (c, Key) {
    vehicleMove(this,c,Key);
}

function vehicleMove(that, c, Key) {
    that.hsp+= that.forceX;
    that.vsp+= that.forceY;

    that.forceX = 0;
    that.forceY = 0;

    var xsp = Math.round(that.hsp*timefctr);
    var ysp = Math.round(that.vsp*timefctr);

    if (xsp > 0) {
        for (var i = 0; i < xsp; i++) {
            if (!colPlace(that, blockList, 1, 0)){
                that.x += 1;
            }
        }
    } else if (xsp  < 0) {
        for (var i = 0; i < -xsp; i++) {
            if (!colPlace(that, blockList, -1, 0)){
                that.x -= 1;
            }
        }
    }

    if (ysp > 0) {
        for (var i = 0; i < ysp; i++) {
            if (!colPlace(that, blockList, 0, 1)){
                that.y += 1;
            } else {
                that.vsp = 0;
                //that.canMove = false;
                //that.moveTimer = 15;
                that.forceY = -10-Math.random(16);
                that.hsp -= 0.5;
            }
        }
    } else if (ysp < 0) {
        for (var i = 0; i < -ysp; i++) {
            if (!colPlace(that, blockList, 0, -1)){
                that.y -= 1;
            } else {
                that.vsp = 0;
                //that.canMove = false;
                //that.moveTimer = 15;
                that.forceY = 10+Math.random(16);
                that.hsp -= 0.5;
            }
        }
    }
}

function instance(x, y, width, height) {
    objt.call(this, x, y, width, height);
    this.bound = "rect";
    this.name = "instance"
    this.hp = 50; //HIT points
    this.maxHp = 50;
    this.dhp = 0;
    this.faction = 1; //neutral
    this.li = 0;

    this.groudFric = 2;

    this.forceX = 0;
    this.forceY = 0;

    this.canMove = true;
    this.moveTimer = 0;
}

instance.prototype.draw = function (c) {
    c.fillStyle = "green";
    c.fillRect(this.x,this.y*0.75,this.width,this.height*0.75);
}

function remove(x) {
    var index = objtList.indexOf(x);
    if (index > -1) {
        objtList.splice(index, 1);
    }
}

function req(that){
    if (that.hp>that.maxHp) {
        that.hp = that.maxHp
    }
    that.dhp += (that.hp-that.dhp)*0.03;

    if (that.li > 0.0){
        that.li -= 0.1;
        if (that.li < 0)
            that.li = 0.0;
    }

    if (that.hp <= 0){
        remove(that);
        Tree.nt += 100;
        Tree.li = 1.0;
    }

    if (that.hitStun > 0)
        return;

    if (!that.ammo){
        if (that.Tattsp >= 60.0/that.attspd*(1+that.faction)){
            that.ammo = true;
            that.Tattsp = 0;
        }else{
            that.Tattsp++;
        }
    }
}


instance.prototype.update = function (c, Key) {
}


function player(x, y, width, height) {
    vehicle.call(this, x, y, width, height);
    this.bound = "rect";
    this.name = "player"

    this.mvang = 0;
    this.groudFric = 24;
    this.weight = 1;
    this.moveAmount = 8;

    this.handling = 20;
    this.steerDir = 0;
    this.steerSpd = 5;
    this.steerSnapback = 5;

    objtList.push(new weapon(this, 1, 0, 24));
}

player.prototype.draw = function (c) {
    c.fillStyle = "pink";
    c.fillRect(this.x,this.y*0.75,this.width,this.height*0.75);
}

player.prototype.update = function(c, Key) {
    var vecX = 0; //key vector
    var vecY = 0;
    if (this.canMove) {

      if (Key.isDown(Key.UP)) {
        vecY -= 1;
      }
      if (Key.isDown(Key.DOWN)) {
        vecY += 1;
      };
      if (Key.isDown(Key.LEFT)) {
        vecX -= 1;
      }
      if (Key.isDown(Key.RIGHT)) {
        vecX += 1;
      };
    } else {
        this.moveTimer--;
        if (this.moveTimer <= 0) {
            this.canMove = true;
        }
    }

    if (vecX > 0) {
        if (this.hsp < this.moveAmount * 0.75)
            this.hsp += this.moveAmount * 0.15;
        else
            this.hsp = this.moveAmount * 0.75;
    } else if (vecX < 0) {
        if (this.hsp > globalSpeedMin)
            this.hsp -= this.moveAmount * 0.5;
        else
            this.hsp = globalSpeedMin;

    } else {
        var gf = 0.5;
        if (Math.abs(this.hsp) > gf) {
          this.hsp -= gf*Math.sign(this.hsp);
        } else {
          this.hsp = 0;
        }
    }

    var fct = Math.max(Math.min(Math.min(-globalSpeedMin,4)/4,0.01)+vecX,1);
    if (vecY != 0) {
        this.steerDir = rotate(this.steerDir,this.handling * vecY * fct,this.steerSpd/fct);
    } else {
        this.steerDir = rotate(this.steerDir,0,this.steerSnapback/fct);
    }

    this.vsp = Math.sin(degtorad(this.steerDir)) * this.groudFric;

    var gf = 0;
    if (vecY == 0) {
        if (Math.abs(this.vsp) > gf) {
          this.vsp -= gf*Math.sign(this.vsp);
        } else {
          this.vsp = 0;
        }
    }

    vehicleMove(this,c,Key);
}

/////////////////////////////////////

function zombie(x, y) {
    this.r = 24;
    instance.call(this, x-this.r, y-this.r, this.r*2, this.r*2);

    this.life = 3;
    this.name = 'zombie';
    this.bound = "circle";
    this.mv = 1+Math.random()*2
}

zombie.prototype.draw = function (c) {
    //s_worm[0].render(c,this.x+this.width/2,this.y+this.height/2,0,-this.xscale);
    c.beginPath();
    c.arc(this.x, this.y*0.75, this.r, 0, 2 * Math.PI, false);
    c.fillStyle = 'yellow';
    c.fill();
}

zombie.prototype.update = function (c) {
    for (var i = 0; i < bulletList.length; i++) {
        var b = bulletList[i];
        if (distPoints(b.x,b.y,this.x,this.y) < (this.r+b.r)) {
            var a = anglePoints(b.x,b.y,this.x,this.y);
            this.forceX += Math.cos(a) * 12;
            this.forceY += Math.sin(a) * 8;
            this.life--;
            if (this.life <= 0){
                remove(this);
            }
            remove(b);
        }
    }
    for (var i = 0; i < zombieList.length; i++) {
        var b = zombieList[i];
        if (b == this)
            continue;

        var d = distPoints(b.x,b.y,this.x,this.y);
        if (d < (this.r+b.r)) {
            var a = anglePoints(b.x,b.y,this.x,this.y);
            this.forceX += Math.cos(a) * 0.35;
            this.forceY += Math.sin(a) * 0.35;
        }
    }


    var a = anglePoints(this.x,this.y,PL.x+PL.width/2,PL.y+PL.height/2);
    var mv = this.mv;
    this.x += Math.cos(a) * mv;
    this.y += Math.sin(a) * mv;
    this.hsp = globalSpeedMin;

    this.hsp += this.forceX;
    this.vsp += this.forceY;

    this.forceX = 0;
    this.forceY = 0;

    this.mvang = Math.atan2(this.vsp, this.hsp);
    var d2 = Math.sqrt(this.vsp*this.vsp + this.hsp*this.hsp);

    if (d2 > this.groudFric) {
      d2 -= this.groudFric;
    } else {
      d2 = 0;
    }

    this.hsp = Math.cos(this.mvang) * d2;
    this.vsp = Math.sin(this.mvang) * d2;
    this.mvang = Math.atan2(this.vsp, this.hsp);

    this.x += this.hsp;
    this.y += this.vsp;

    if (this.x <= -128){
        remove(this);
    }
}

function zombieDumb(x, y, mv) {
    this.r = 24;
    instance.call(this, x-this.r, y-this.r, this.r*2, this.r*2);

    this.life = 3;
    this.name = 'zombie';
    this.bound = "circle";
    this.mv = mv || 1+Math.random()*2
}

zombieDumb.prototype.draw = function (c) {
    //s_worm[0].render(c,this.x+this.width/2,this.y+this.height/2,0,-this.xscale);
    c.beginPath();
    c.arc(this.x, this.y*0.75, this.r, 0, 2 * Math.PI, false);
    c.fillStyle = 'orange';
    c.fill();
}

zombieDumb.prototype.update = function (c) {
    for (var i = 0; i < bulletList.length; i++) {
        var b = bulletList[i];
        if (distPoints(b.x,b.y,this.x,this.y) < (this.r+b.r)) {
            var a = anglePoints(b.x,b.y,this.x,this.y);
            this.forceX += Math.cos(a) * 12;
            this.forceY += Math.sin(a) * 8;
            this.life--;
            if (this.life <= 0){
                remove(this);
            }
            remove(b);
        }
    }
    for (var i = 0; i < zombieList.length; i++) {
        var b = zombieList[i];
        if (b == this)
            continue;

        var d = distPoints(b.x,b.y,this.x,this.y);
        if (d < (this.r+b.r)) {
            var a = anglePoints(b.x,b.y,this.x,this.y);
            this.forceX += Math.cos(a) * 0.35;
            this.forceY += Math.sin(a) * 0.35;
        }
    }

    var a = 0;
    var mv = this.mv;
    this.x += Math.cos(a) * mv;
    this.y += Math.sin(a) * mv;
    this.hsp = globalSpeedMin;

    this.hsp += this.forceX;
    this.vsp += this.forceY;

    this.forceX = 0;
    this.forceY = 0;

    this.mvang = Math.atan2(this.vsp, this.hsp);
    var d2 = Math.sqrt(this.vsp*this.vsp + this.hsp*this.hsp);

    if (d2 > this.groudFric) {
      d2 -= this.groudFric;
    } else {
      d2 = 0;
    }

    this.hsp = Math.cos(this.mvang) * d2;
    this.vsp = Math.sin(this.mvang) * d2;
    this.mvang = Math.atan2(this.vsp, this.hsp);

    this.x += this.hsp;
    this.y += this.vsp;

    if (this.x <= -128){
        remove(this);
    }
}

/////////////////////////////////////

function weapon(owner, wepNo, xoff, yoff) {
    display.call(this,0,0,32,32);

    this.owner = owner;
    this.xoff = xoff;
    this.yoff = yoff;
    this.wepNo = wepNo;

    this.ready = false;
    this.reload = 15;
    this.timer = this.reload;
}

weapon.prototype.draw = function (c) {
    c.globalAlpha = 0.5;
    c.fillStyle = "yellow";
    c.fillRect(this.x,this.y*0.75,this.width,this.height*0.75);
    c.globalAlpha = 1.0;
}

weapon.prototype.update = function (b, keys) {
    this.x = this.owner.x+this.xoff;
    this.y = this.owner.y+this.yoff;


    if (this.timer > 0) {
        this.timer--;
    } else {
        this.ready = true;
    }

    var wep = keys.WEP1;
    if (this.wepNo === 2) {
        wep = keys.WEP2;
    }

    if (keys.isDown(wep)) {
        if (this.ready) {
            //FIRE!
            objtList.push(new bullet(this.owner,
                this.x, this.y-24, 8, 2000,
                20, 0, 1));
            objtList.push(new bullet(this.owner,
                this.x, this.y+24, 8, 2000,
                20, 0, 1));
            console.log("FIRE!");

            this.ready = false;
            this.timer = this.reload;
        }
    }
}

function drawWarm(c,x,y,r,col){
    var grd=c.createRadialGradient(x,y,0,x,y,r);
    grd.addColorStop(0,"white");
    grd.addColorStop(0.25,col);
    grd.addColorStop(1,"black");
    c.fillStyle = grd;

    c.globalCompositeOperation = "screen";
    c.beginPath();
    c.arc(x,y,r,0,2*Math.PI);
    c.closePath();
    c.fill();
    c.globalCompositeOperation = "source-over";
}


////////////

function drawName(that,ctx,offset){
    var wid = that.maxHp;

    var text = that.name;
    if (that.faction == 0) {
        ctx.fillStyle = 'lime';
    } else if (that.faction == 2){
        ctx.fillStyle = 'red';
    } else {
        ctx.fillStyle = 'yellow';
    }

    ctx.shadowBlur = 6;
    ctx.shadowColor = "black";

    ctx.font = '100 10pt Verdana';
    var v = ctx.measureText(text).width/2;
    ctx.fillText(text, that.x+that.width/2 - v, that.y - offset - 4);

    ctx.fillStyle = 'black';
    ctx.fillRect(that.x+that.width/2-wid/2, that.y - offset, wid, 6);
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'red';
    ctx.fillRect(that.x+that.width/2-wid/2, that.y - offset, wid*(that.dhp/that.maxHp), 6);
    ctx.fillStyle = 'lime';
    ctx.fillRect(that.x+that.width/2-wid/2, that.y - offset, wid*(that.hp/that.maxHp), 6);


}

///////////
///////////
///////////

function drawColFrame(that, ctx, list, frame, col, amm, ys, f, xf, yf) {
    var ys = ys || 1;
    var f = f || 0;
    var xf = xf || that.x+that.width/2;
    var yf = yf || that.y+that.height/2;

    var tintCanvas = document.createElement('canvas');
    tintCanvas.width = 512;
    tintCanvas.height = 512;
    var tintCtx = tintCanvas.getContext('2d');
    ctx.save();
    tintCtx.fillStyle = col;
    tintCtx.fillRect(0,0,512,512);
    tintCtx.globalCompositeOperation = "destination-atop";
    list[f].render(ctx,xf,yf,frame,-that.xscale,ys);
    tintCtx.globalAlpha = amm;
    list[f].render(tintCtx,256,256,frame,-that.xscale,ys);
    ctx.drawImage(tintCanvas, xf-256,yf-256);
    ctx.restore();
    tintCtx.globalAlpha = 1.0;
}

function getTarget(that) {
    if (that.faction != 0){
        if (that.faction == 2) {
            return Tree;
        }
        return null;
    }
    var targs = [];
    for (var i = 0; i < objtList.length; i++) {
        var o = objtList[i];
        if (o.bound != "inst")
            continue
        if (o.faction == 2) {
            targs.push(o);
        }
    }
    var ret = null;
    var mdis = -1;
    for (var i = 0; i < targs.length; i++) {
        var d = distPoints(Tree.x+800*that.loc,that.y,targs[i].x,targs[i].y);
        if (mdis == -1 || d < mdis){
            mdis = d;
            ret = targs[i];
        }
    }
    return ret;

}