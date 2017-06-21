/**
 * Created by mcake on 2017/3/13.
 */

/**
 * dom处理常规方法pollyfill, 先直接使用jquery/zepto的方法
 * */

let {Context} = SaltUI;
let methods = {};

const EVENTS = {
  touchstart: Context.TOUCH_START,
  touchmove: Context.TOUCH_MOVE,
  touchend: Context.TOUCH_END,
  touchcancel: Context.TOUCH_CANCEL,
  resize: Context.RESIZE
};

['css', 'addClass', 'removeClass', 'hasClass', 'on', 'off', 'trigger'].forEach((method) => {
  methods[method] = function(dom){
    let $dom = $(dom);
    let args = [].slice.call(arguments, 1);
    args[0] = EVENTS[args[0]] || args[0];
    return $dom[method].apply($dom, args);
  };
});

methods.offset = function (dom) {
  return $(dom).offset();
};

methods.transitionEnd = function (el, callback) {
  function listener() {
    callback.call(this);
    el.removeEventListener("webkitTransitionEnd", listener, false);
    el.removeEventListener("transitionend", listener, false);
  }
  el.addEventListener("webkitTransitionEnd", listener, false);
  el.addEventListener("transitionend", listener, false);
};

methods.animationEnd = function (el, callback) {
  function listener() {
    callback.call(this);
    el.removeEventListener("webkitAnimationEnd", listener, false);
    el.removeEventListener("animationend", listener, false);
  }
  el.addEventListener("webkitAnimationEnd", listener, false);
  el.addEventListener("animationend", listener, false);
};

module.exports = methods;

