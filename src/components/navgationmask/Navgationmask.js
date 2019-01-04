import './Navgationmask.styl';

import React from 'react';
import Reflux from 'reflux';
import reactMixin from 'react-mixin';
import actions from '../../app/actions';
import store from  '../../app/store';
import dom from '../../utils/dom';

class Navgationmask extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.startX = 0;
    this.startY = 0;
    this._touchstart = this._touchstart.bind(this);
    this._touchmove = this._touchmove.bind(this);
    this._touchend = this._touchend.bind(this);
  }

  hideMask(e) {
    e.stopPropagation();
    e.preventDefault();
    actions.hideNavigation();
  }

  componentDidMount() {
    dom.on(this.refs.mask, "touchstart", this._touchstart);
  }

  componentWillUnmount() {
    dom.off(this.refs.mask, "touchstart", this._touchstart);
  }

  _touchstart(e) {
    let touch = e.targetTouches ? e.targetTouches[0] : e;
    this.startX = touch.pageX;
    this.startY = touch.pageY;

    dom.on(document, "touchmove", this._touchmove);
    dom.on(document, "touchend", this._touchend);
  }

  _touchmove(e) {
    let touch = e.changedTouches ? e.changedTouches[0] : e;
    let diffX = touch.pageX - this.startX;
    let diffY = touch.pageY - this.startY;
    if (diffX < 0 && Math.abs(diffX) > Math.abs(diffY)) {
      e.preventDefault();
    }
  }

  _touchend(e) {
    let touch = e.changedTouches ? e.changedTouches[0] : e;
    let diffX = touch.pageX - this.startX;
    let diffY = touch.pageY - this.startY;
    if (diffX < -20 && Math.abs(diffX) > Math.abs(diffY)) {
      actions.hideNavigation();
    }

    dom.off(document, "touchmove", this._touchmove);
    dom.off(document, "touchend", this._touchend);
  }

  render() {
    return (
      <div ref="mask" className="navgation-mask" onClick={this.hideMask.bind(this)}
           style={{display: this.state.navVisible ? "block" : "none"}}></div>
    );
  }
}

reactMixin.onClass(Navgationmask, Reflux.connect(store));

module.exports = Navgationmask;
