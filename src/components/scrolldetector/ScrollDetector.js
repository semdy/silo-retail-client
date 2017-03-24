/**
 * Created by shuxy on 2017/3/24.
 */

import dom from '../../utils/dom';

let {Context} = SaltUI;
let BOD = document.body;
let DOC = document.documentElement;

let TIME = Date.now();

function isWindow(obj) {
  return typeof obj === 'object' && obj !== null && !!obj.setInterval;
}

function getOffset(el) {
  return el.getBoundingClientRect();
}

let ScrollDetector = function () {
  this.init.apply(this, arguments);
};

ScrollDetector.prototype = {

  init: function (opts) {
    this.handleEvent = this.handleEvent.bind(this);
    this.options = Object.assign({}, ScrollDetector.defaults, opts || {});
    this.win = this.options.container;
    this.scroller = this.options.scroller || BOD;
    this.scrollerTop = getOffset(this.scroller).top;
    this._client = {};
    this.rebuild();
  },

  destroy: function () {
    dom.off(this.win, 'scroll', this.handleEvent);
    return this;
  },

  rebuild: function () {
    dom.on(this.win, 'scroll', this.handleEvent);
    return this;
  },

  _getClientSize: function () {
    return isWindow(this.win) ? {
        width: window.innerWidth || DOC.clientWidth,
        height: window.innerHeight || DOC.clientHeight,
        top: 0,
        scrollTop: window.pageYOffset || BOD.scrollTop || DOC.scrollTop,
        scrollerHeight: this.scroller.tagName == 'BODY' ? (document.documentElement.scrollHeight || document.body.scrollHeight) : this.scroller.offsetHeight
      } : {
        width: this.win.offsetWidth,
        height: this.win.offsetHeight,
        top: getOffset(this.win).top,
        scrollTop: this.win.scrollTop,
        scrollerHeight: this.scroller.offsetHeight
      };
  },

  handleEvent: function () {
    let opts = this.options;

    this._client = this._getClientSize();

    typeof opts.onScroll == 'function' && opts.onScroll.call(this, this._client);

    if (this._isReachBottom()) {
      let diff = Date.now() - TIME;

      if (diff < opts.time) {
        return;
      } else {
        TIME = Date.now();
      }

      opts.onReach.call(this, this._client);

    }
  },

  _isReachBottom: function () {
    return ( this.scrollerTop + this._client.scrollerHeight - this._client.height - this._client.scrollTop - this._client.top ) <= this.options.bufferPx;
  }

};

ScrollDetector.defaults = {
  container: window,
  scroller: BOD,
  bufferPx: 0,
  time: 1000,
  onReach: Context.noop,
  onScroll: Context.noop
};

module.exports = ScrollDetector;
