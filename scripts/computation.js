


////////////////////////////////////////////////////////////////////////////////
// Drawing Functions
////////////////////////////////////////////////////////////////////////////////

function polygonArea(vertices) {
    var area = 0;
    for (var i = 0; i < vertices.length; i++) {
        j = (i + 1) % vertices.length;
        area += vertices[i].x * vertices[j].y;
        area -= vertices[j].x * vertices[i].y;
    }
    return area / 2;
}

function straight_skeleton(poly, spacing)
{

    var resulting_path = [];
    var N = poly.length;
    var mi, mi1, li, li1, ri, ri1, si, si1, Xi1, Yi1;
    for(var i = 0; i < N; i++)
    {
        mi = (poly[(i+1) % N].y - poly[i].y)/(poly[(i+1) % N].x - poly[i].x);
        mi1 = (poly[(i+2) % N].y - poly[(i+1) % N].y)/(poly[(i+2) % N].x - poly[(i+1) % N].x);
        li = Math.sqrt((poly[(i+1) % N].x - poly[i].x)*(poly[(i+1) % N].x - poly[i].x)+(poly[(i+1) % N].y - poly[i].y)*(poly[(i+1) % N].y - poly[i].y));
        li1 = Math.sqrt((poly[(i+2) % N].x - poly[(i+1) % N].x)*(poly[(i+2) % N].x - poly[(i+1) % N].x)+(poly[(i+2) % N].y - poly[(i+1) % N].y)*(poly[(i+2) % N].y - poly[(i+1) % N].y));
        ri = poly[i].x+spacing*(poly[(i+1) % N].y - poly[i].y)/li;
        ri1 = poly[(i+1) % N].x+spacing*(poly[(i+2) % N].y - poly[(i+1) % N].y)/li1;
        si = poly[i].y-spacing*(poly[(i+1) % N].x - poly[i].x)/li;
        si1 = poly[(i+1) % N].y-spacing*(poly[(i+2) % N].x - poly[(i+1) % N].x)/li1;
        Xi1 = (mi1*ri1-mi*ri+si-si1)/(mi1-mi);
        Yi1 = (mi*mi1*(ri1-ri)+mi1*si-mi*si1)/(mi1-mi);

        if(poly[(i+1) % N].x - poly[i % N].x==0)
        {
            Xi1 = poly[(i+1) % N].x + spacing*(poly[(i+1) % N].y - poly[i % N].y)/Math.abs(poly[(i+1) % N].y - poly[i % N].y);
            Yi1 = mi1*Xi1 - mi1*ri1 + si1;
        }
        if(poly[(i+2) % N].x - poly[(i+1) % N].x==0 )
        {
            Xi1 = poly[(i+2) % N].x + spacing*(poly[(i+2) % N].y - poly[(i+1) % N].y)/Math.abs(poly[(i+2) % N].y - poly[(i+1) % N].y);
            Yi1 = mi*Xi1 - mi*ri + si;
        }

        resulting_path.push({
            x: Xi1,
            y: Yi1
        });
    }

    return resulting_path;
}

function roundedPath( a, context, rad ){
    if (!a.length) return;

    context.beginPath();

    var factor = rad;

    var startX = (a[0].x*(1-factor)+a[1].x*(factor));
    var startY = (a[0].y*(1-factor)+a[1].y*(factor));

    context.moveTo(startX, startY);

    var x1, y1, x2, y2;
    x2 = startX;
    y2 = startY;
    for (var i = 1; i < a.length-1; i++) {


        x1 = (a[i-1].x*(factor)+a[i].x*(1-factor));
        y1 = (a[i-1].y*(factor)+a[i].y*(1-factor));

        context.lineTo(x1,y1);

        x2 = a[i].x;
        y2 = a[i].y;

        x1 = (a[i+1].x*(factor)+a[i].x*(1-factor));
        y1 = (a[i+1].y*(factor)+a[i].y*(1-factor));

        context.quadraticCurveTo( x2, y2, x1, y1);
    }

    x1 = (a[i-1].x*(factor)+a[i].x*(1-factor));
    y1 = (a[i-1].y*(factor)+a[i].y*(1-factor));

    context.lineTo(x1,y1);

    x1 = (a[0].x*(factor)+a[i].x*(1-factor));
    y1 = (a[0].y*(factor)+a[i].y*(1-factor));
    context.quadraticCurveTo(x1, y1, startX, startY);

    context.closePath();
}

var CP = window.CanvasRenderingContext2D && CanvasRenderingContext2D.prototype;
if (CP.lineTo) {
    CP.dashedLine = function(x, y, x2, y2, da) {
        if (!da) da = [10,5];
        this.save();
        var dx = (x2-x), dy = (y2-y);
        var len = Math.sqrt(dx*dx + dy*dy);
        var rot = Math.atan2(dy, dx);
        this.translate(x, y);
        this.moveTo(0, 0);
        this.rotate(rot);
        var dc = da.length;
        var di = 0, draw = true;
        x = 0;
        while (len > x) {
            x += da[di++ % dc];
            if (x > len) x = len;
            draw ? this.lineTo(x, 0): this.moveTo(x, 0);
            draw = !draw;
        }
        this.restore();
    }
}

////////////////////////////////////////////////////////////////////////////////
// Math Functions
////////////////////////////////////////////////////////////////////////////////

function gauRnd() {
    return ((Math.random() + Math.random()
        + Math.random() + Math.random() ) - 2) / 2;
}

//FOR SAFARI, safari does not like sign function :(
Math.sign = Math.sign || function(x) {
  x = +x;
  if (x === 0 || isNaN(x)) {
    return x;
  }
  return x > 0 ? 1 : -1;
}

//distance between two points (x1,y1) and (x2,y2)
function distPoints(x1,y1,x2,y2){
    return Math.sqrt(Math.pow(x2-x1,2) + Math.pow(y2-y1,2));
}

//angle between two points starts in East quadrant returns PI <-> -PI
function anglePoints(x1,y1,x2,y2){
    return Math.atan2(y2-y1,x2-x1);
}

//returns value (q) mitigate by an amount of (fr)
function fric(q,fr){
    var s = q;
    if (Math.abs(s) > fr) {
        s -= fr * Math.sign(s)
    }
    else
    {
        s = 0;
    }
    return s;
}

function degtorad(deg){
    return deg/180 * Math.PI;
}

//degrees
function rotate(from,to,rate){
    return (from+(Math.sin(degtorad(to-from))*rate));
}

////////////////////////////////////////////////////////////////////////////////
// Collision Functions
////////////////////////////////////////////////////////////////////////////////

function isPointInPoly(poly, pt){
    for(var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
        ((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y))
        && (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
        && (c = !c);
    return c;
}

function isPointInRect(pt, x, y, width, height){
    return (pt.x > x && pt.x < x+width && pt.y > y && pt.y < y+height);
}


//Check if a rectangle colides if moved by x,y coordinates
//rect1 = rectangle checking, b = list of objects to test against
//w and h are optional width and height adjustments
//TODO: make this return the object collided with
function colPlace(rect1, b, x, y, w, h, check_while_off){
    var w = w || 0;
    var h = h || 0;
    var check_while_off = check_while_off || false;


    //adjusted rectangle
    var rectx = {x: rect1.x+x, y: rect1.y+y, width: rect1.width+w, height: rect1.height+h};

    for (var i = 0; i < b.length; i++) {
        if (!b[i].on_screen && !check_while_off)
            continue;

        if (b[i].bound === "rect"){
            //check rect collision with rect and make sure b[i] is not the object being tested
            if (colRxR(rectx, b[i]) && rect1 != b[i]){
                return true;
            }
        } else if (b[i].bound === "circle"){
            //check rect collision with rect and make sure b[i] is not the object being tested
            if (colRxC(rectx, b[i]) && rect1 != b[i]){
                return true;
            }
        } else if (b[i].bound === "poly"){
            //the following breaks down a polygon to lines and checks rect collision with line
            count = b[i].xx.length;
            if (!colRxR(rectx, b[i]) && rect1 != b[i])
                continue;
            for (var j = 0; j < count; j++){

                //determine the endpoints
                var p1 = {x:b[i].xx[j], y:b[i].yy[j]};
                var p2 = null;
                if (j != count-1)
                    p2 = {x:b[i].xx[j+1], y:b[i].yy[j+1]};
                else
                    p2 = {x:b[i].xx[0], y:b[i].yy[0]};

                if (colRxL(rectx, p1, p2) && rect1 != b[i])
                    return true;
            }
        }else if (b[i].bound === "jt"){
            //Jumpthrough platforms are flattened to a height of 2px
            var p1 = {x:rect1.x+x, y:rect1.y+rect1.height+y};
            var p2 = {x:rect1.x+rect1.width+x, y:rect1.y+rect1.height+y};
            var rectjt = {x: b[i].x, y:b[i].y+2, width: b[i].width, height:2};

            if (colRxL(rectjt, p1, p2) && rect1.vsp >= 0){
                return true;
            }
        }
    }

    return false;
}

//Rectangle collsion with Circle
function colRxC(rect,circle){
    var distX = Math.abs(circle.x - rect.x-rect.width/2);
    var distY = Math.abs(circle.y - rect.y-rect.h/2);

    if (distX > (rect.width/2 + circle.r)) { return false; }
    if (distY > (rect.height/2 + circle.r)) { return false; }

    if (distX <= (rect.width/2)) { return true; }
    if (distY <= (rect.height/2)) { return true; }

    var dx=distX-rect.width/2;
    var dy=distY-rect.height/2;
    return (dx*dx+dy*dy<=(circle.r*circle.r));
}

//Rectangle collsion with Rectangle
function colRxR(rect1, rect2){
    return (rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.height + rect1.y > rect2.y);
}

//Rectangle collsion with line segment with endpoints p1,p2
function colRxL(rect, p1, p2) {
    var minX = p1.x;
    var maxX = p2.x;

    if (p1.x > p2.x) {
        minX = p2.x;
        maxX = p1.x;
    }

    if (maxX > rect.x + rect.width)
        maxX = rect.x + rect.width;

    if (minX < rect.x)
        minX = rect.x;

    if (minX > maxX)
        return false;

    var minY = p1.y;
    var maxY = p2.y;

    var dx = p2.x - p1.x;

    if (Math.abs(dx) > 0.0000001) {
        var a = (p2.y - p1.y) / dx;
        var b = p1.y - a * p1.x;
        minY = a * minX + b;
        maxY = a * maxX + b;
    }

    if (minY > maxY) {
        var tmp = maxY;
        maxY = minY;
        minY = tmp;
    }

    if (maxY > rect.y + rect.height)
        maxY = rect.y + rect.height;

    if (minY < rect.y)
        minY = rect.y;

    if (minY > maxY)
        return false;

    return true;
}

////////////////////////////////////////////////////////////////////////////////
// Movement Functions
////////////////////////////////////////////////////////////////////////////////

//simple movement
//adjusts x and y of obj based on vertical and horizontal speeds
function simpMove(obj,b){

    //Loop though values adn adjust accordingly
    if (obj.vsp > 0){
        for (var i = 0; i < obj.vsp*timefctr; i++){
            if (!colPlace(obj,b,0,1)){
                obj.y += 1;
            }else{
                obj.vsp = 0;
                break;
            }
        }
    } else if (obj.vsp < 0){
        for (var i = 0; i < -obj.vsp*timefctr; i++){
            if (!colPlace(obj,b,0,-1)){
                obj.y -= 1;
            }else{
                obj.vsp = 0;
                break;
            }
        }
    }
    if (obj.hsp > 0){
        for (var i = 0; i < obj.hsp*timefctr; i++){
            if (!colPlace(obj,b,1,0)){
                obj.x += 1;
            }else{
                obj.hsp -= obj.hsp;
                break;
            }
        }
    } else if (obj.hsp < 0){
        for (var i = 0; i < -obj.hsp*timefctr; i++){
            if (!colPlace(obj,b,-1,0)){
                obj.x -= 1;
            }else{
                obj.hsp -= obj.hsp;
                break;
            }
        }
    }
}

function slopeMove(obj,b,slope,xsp,ysp){
    var xsp = xsp || obj.hsp*timefctr;
    var ysp = ysp || obj.vsp*timefctr;

    var done = false;
    if (xsp > 0){
        for (var i = 0; i < xsp; i++){
            //adjust y value to account for slopes
            for (var s = -slope; s <= slope; s++){
                //only account for slopes if on the ground
                if (s != 0 && !colPlace(obj,b,0,1))
                    continue;
                var xs = Math.cos(Math.atan2(-s,1));//1;
                var ys = Math.sin(Math.atan2(-s,1));//-s;

                if (!colPlace(obj,b,xs,ys)){
                    obj.x += xs;
                    obj.y += ys;
                    //do not account for slopes later on when doing vsp
                    if (s!=0)
                        done = true;
                    break;
                }else if (s>=slope){
                    obj.hsp = -obj.hsp*obj.bnc;
                    break;
                }
            }
        }
    } else if (xsp < 0){
        for (var i = 0; i < -xsp; i++){
            for (var s = -slope; s <= slope; s++){
                if (s != 0 && !colPlace(obj,b,0,1))
                    continue;
                var xs = Math.cos(Math.atan2(-s,-1));//-1;
                var ys = Math.sin(Math.atan2(-s,-1));//-s;

                if (!colPlace(obj,b,xs,ys)){
                    obj.x += xs;
                    obj.y += ys;
                    if (s!=0)
                        done = true;
                    break;
                }else if (s>=slope){
                    obj.hsp = -obj.hsp*obj.bnc;
                    break;
                }
            }
        }
    }

    if (ysp > 0){
        for (var i = 0; i < ysp; i++){
            if (!colPlace(obj,b,0,1)){
                obj.y += 1;
            }else if (!colPlace(obj,b,1,1) && !done){
                obj.y += 0.7;
                obj.x += 0.7;
            }else if (!colPlace(obj,b,-1,1) && !done){
                obj.y += 0.7;
                obj.x -= 0.7;
            }else{
                obj.vsp = 0;
                break;
            }
        }
    } else if (ysp < 0){
        for (var i = 0; i < -ysp; i++){
            if (!colPlace(obj,b,0,-1)){
                obj.y -= 1;
            }else if (!colPlace(obj,b,1,-1) && !done){
                obj.y -= 0.7;
                obj.x += 0.7;
            }else if (!colPlace(obj,b,-1,-1) && !done){
                obj.y -= 0.7;
                obj.x -= 0.7;
            }else{
                obj.vsp = 0;
                break;
            }
        }
    }

}

//sloped movement
//adjusts x and y of obj based on vertical and horizontal speeds
//factors in slopes
//USE FOR MICRO MOVEMENTS ONLY such as to steady self on moving platforms
function slopeMicroMove(obj,b,slope,xsp,ysp,multiplier){
    var xsp = xsp || obj.hsp*timefctr;
    var ysp = ysp || obj.vsp*timefctr;
    var multiplier = multiplier || 10;

    xsp *= multiplier;
    ysp *= multiplier;
    ysp = Math.round(ysp);
    xsp = Math.round(xsp);

    var done = false;
    if (xsp > 0){
        for (var i = 0; i < xsp; i++){
            for (var s = -slope; s <= slope; s++){
                if (s != 0 && !colPlace(obj,b,0,1))
                    continue;
                var xs = 1/multiplier;
                var ys = -s/multiplier;

                if (!colPlace(obj,b,xs,ys)){
                    if (s < 0 && !colPlace(obj,b,0,1))
                        continue;
                    obj.x += xs;
                    obj.y += ys;
                    if (s!=0)
                        done = true;
                    break;
                }else if (s>=slope){
                    obj.hsp = 0;
                    break;
                }
            }
        }
    } else if (xsp < 0){
        for (var i = 0; i < -xsp; i++){
            for (var s = -slope; s <= slope; s++){
                if (s != 0 && !colPlace(obj,b,0,1))
                    continue;
                var xs = -1/multiplier;
                var ys = -s/multiplier;

                if (!colPlace(obj,b,xs,ys)){
                    if (s < 0 && !colPlace(obj,b,0,1))
                        continue;
                    obj.x += xs;
                    obj.y += ys;
                    if (s!=0)
                        done = true;
                    break;
                }else if (s>=slope){
                    obj.hsp = 0;
                    break;
                }
            }
        }
    }

    if (ysp > 0){
        for (var i = 0; i < ysp; i++){
            if (!colPlace(obj,b,0,1/multiplier)){
                obj.y += 1/multiplier;
            }else if (!colPlace(obj,b,1/multiplier,1/multiplier) && !done){
                obj.y += 1/multiplier;
                obj.x += 1/multiplier;
            }else if (!colPlace(obj,b,-1/multiplier,1/multiplier) && !done){
                obj.y += 1/multiplier;
                obj.x -= 1/multiplier;
            }else{
                obj.vsp = 0;
                break;
            }
        }
    } else if (ysp < 0){
        for (var i = 0; i < -ysp; i++){
            if (!colPlace(obj,b,0,-1/multiplier)){
                obj.y -= 1/multiplier;
            }else if (!colPlace(obj,b,1/multiplier,-1/multiplier) && !done){
                obj.y -= 1/multiplier;
                obj.x += 1/multiplier;
            }else if (!colPlace(obj,b,-1/multiplier,-1/multiplier) && !done){
                obj.y -= 1/multiplier;
                obj.x -= 1/multiplier;
            }else{
                obj.vsp = 0;
                break;
            }
        }
    }

}