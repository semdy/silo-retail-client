/**
 * Created by mcake on 2017/6/20.
 */

let {random, pow, PI} = Math;

var isDestroy = false;

var rand = function(max, min, isInt) {
  var max = ((max - 1) || 0) + 1,
    min = min || 0,
    gen = min + (max - min) * random();

  return (isInt) ? (~~gen) : gen;
};

var Tween = function(target, toAttrs, duration, ease, callback){
  var startTime = Date.now();
  var reqId;
  var originAttrs = Object.assign({}, target);

  function run(){
    reqId = requestAnimationFrame(run);
    var percent = (Date.now() - startTime)/duration;
    if( percent >= 1 ) percent = 1;

    for(var i in toAttrs){
      target[i] = originAttrs[i] + (toAttrs[i] - originAttrs[i])*(ease)(percent);
    }

    if( percent === 1 ){
      cancelAnimationFrame(reqId);
      callback();
    }
  }

  run();
};

function CircEaseInOut(p) {
  return ((p*=2) < 1) ? -0.5 * (Math.sqrt(1 - p * p) - 1) : 0.5 * (Math.sqrt(1 - (p -= 2) * p) + 1);
}

var movePoint = function(point, w, h) {
  var x = point.originX-50+Math.random()*100;
  var y = point.originY-50+Math.random()*100;

  var toPos = {
    x: x < 5 ? 5 : (x > w - 5 ? w - 5 : x),
    y: y < 5 ? 5 : (y > h - 5 ? h - 5 : y)
  };

  Tween(point, toPos, (1+1*random())*1000, CircEaseInOut, function(){
    if( !isDestroy ) {
      movePoint(point, w, h);
    }
  });
};

var makeRndColor = function(alpha){
  return "rgba(156,217,249,"+ (alpha || rand(1, 0.5)) +")";
};

var getDistance = function(p1, p2) {
  return pow(p1.x - p2.x, 2) + pow(p1.y - p2.y, 2);
};

var Point = function(x, y, r, w, h) {
  this.x = x;
  this.y = y;
  this.lineAlpha = 1;
  this.circleAlpha = 1;
  this.originX = this.x;
  this.originY = this.y;

  this.draw = function(ctx) {

    if( this.circleAlpha === 0 ) return this;

    ctx.fillStyle = makeRndColor(this.circleAlpha);

    ctx.beginPath();
    ctx.arc(this.x, this.y, r, 0, 2 * PI);
    ctx.closePath();
    ctx.fill();

    return this;
  };

  this.drawLines = function(ctx) {
    if( this.lineAlpha === 0 ) return this;
    for(var i in this.closest) {
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.closest[i].x, this.closest[i].y);
      ctx.strokeStyle = makeRndColor(this.lineAlpha);
      ctx.stroke();
    }

    return this;
  };

  movePoint(this, w, h);
};


var Polygon = function(target, w, h) {
  this.target = target;
  this.vertices = [];

  isDestroy = false;

  //根据屏幕尺寸初始化圆点
  for (var x = 0; x < w; x = x + 50) {
    for (var y = 0; y < h; y = y + 50) {
      var px = x + Math.random() * 50;
      var py = y + Math.random() * 50;
      this.vertices.push(
        new Point(
          px,
          py,
          2 + Math.random()*2,
          w,
          h
        )
      );
    }
  }

  var points = this.vertices;

  //计算每个点相邻的5个点
  for(var i = 0; i < points.length; i++) {
    var closest = [];
    var p1 = points[i];
    for(var j = 0; j < points.length; j++) {
      var p2 = points[j];
      if(!(p1 === p2)) {
        var placed = false;
        for(var k = 0; k < 5; k++) {
          if(!placed) {
            if(closest[k] === undefined) {
              closest[k] = p2;
              placed = true;
            }
          }
        }

        for(var k = 0; k < 5; k++) {
          if(!placed) {
            if(getDistance(p1, p2) < getDistance(p1, closest[k])) {
              closest[k] = p2;
              placed = true;
            }
          }
        }
      }
    }

    // detect points in range
    if(Math.abs(getDistance(this.target, p1)) < 4000) {
      p1.lineAlpha = 0.2;
      p1.circleAlpha = 0.5;
    } else if(Math.abs(getDistance(this.target, p1)) < 20000) {
      p1.lineAlpha = 0.1;
      p1.circleAlpha = 0.3;
    } else if(Math.abs(getDistance(this.target, p1)) < 40000) {
      p1.lineAlpha = 0.02;
      p1.circleAlpha = 0.1;
    } else {
      p1.lineAlpha = 0;
      p1.circleAlpha = 0;
    }

    p1.closest = closest;
  }

  this.draw = function(ctx) {
    for (var i = 0; i < this.vertices.length; i++) {
      this.vertices[i].draw(ctx).drawLines(ctx);
    }
  };

  this.updateTarget = function(x, y){
    this.target.x = x;
    this.target.y = y;

    return this;
  };

  this.destory = function () {
    this.vertices = [];
    this.target = {};
    isDestroy = true;
  }

};

module.exports = Polygon;