+function () {
  'use strict';
  /* eslint-disable no-unused-vars */
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var propIsEnumerable = Object.prototype.propertyIsEnumerable;

  function toObject(val) {
    if (val === null || val === undefined) {
      throw new TypeError('Object.assign cannot be called with null or undefined');
    }

    return Object(val);
  }

  if (!Array.prototype.find)
    Array.prototype.find = function (cb) {
      var i = 0,
        l = this.length;

      for (; i < l; i++) {
        if (cb && cb(this[i], i, this) === true) {
          return this[i];
        }
      }

    };

  if (!Array.prototype.repeat)
    Array.prototype.repeat = function (len, value) {
      return Array.apply(null, {length: len})
        .map(() => {
          return value;
        });
    };

  if (!Object.assign)
    Object.assign = function (target, source) {
      var from;
      var to = toObject(target);
      var symbols;

      for (var s = 1; s < arguments.length; s++) {
        from = Object(arguments[s]);

        for (var key in from) {
          if (hasOwnProperty.call(from, key)) {
            to[key] = from[key];
          }
        }

        if (Object.getOwnPropertySymbols) {
          symbols = Object.getOwnPropertySymbols(from);
          for (var i = 0; i < symbols.length; i++) {
            if (propIsEnumerable.call(from, symbols[i])) {
              to[symbols[i]] = from[symbols[i]];
            }
          }
        }
      }

      return to;
    };

  Promise.prototype['finally'] = function (onResolveOrReject) {
    return this['catch'](function (result) {
      return result;
    }).then(onResolveOrReject);
  };

}();

var requestAnimationFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  function (callback) {
    return setTimeout(callback, 1000 / 60);
  };

var cancelAnimationFrame =
  window.cancelAnimationFrame ||
  window.webkitCancelAnimationFrame ||
  window.mozCancelAnimationFrame ||
  function (id) {
    return clearTimeout(id);
  };