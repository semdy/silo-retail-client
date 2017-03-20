/**
 * Created by mcake on 2017/3/13.
 */

/**
 * dom处理常规方法pollyfill, 先直接使用jquery/zepto的方法
 * */

let methods = {};

['addClass', 'removeClass', 'hasClass', 'on', 'off', 'trigger'].forEach((method) => {
  methods[method] = function(dom){
    let $dom = $(dom);
    return $dom[method].apply($dom, [].slice.call(arguments, 1));
  };
});

module.exports = methods;

