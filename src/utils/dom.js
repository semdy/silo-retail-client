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

['addClass', 'removeClass', 'hasClass', 'on', 'off', 'trigger'].forEach((method) => {
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

module.exports = methods;

