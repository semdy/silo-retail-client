require('./Navgationmask.styl');

const {Context} = SaltUI;
import reactMixin from 'react-mixin';
import actions from '../../app/actions';
import store from  '../../app/store';

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
    this.refs.mask.addEventListener(Context.TOUCH_START, this._touchstart, false);
  }

  componentWillUnmount() {
    this.refs.mask.removeEndEventListener(Context.TOUCH_START, this._touchstart, false);
  }

  _touchstart(e) {
    let touch = e.targetTouches ? e.targetTouches[0] : e;
    this.startX = touch.pageX;
    this.startY = touch.pageY;

    document.addEventListener(Context.TOUCH_MOVE, this._touchmove, false);
    document.addEventListener(Context.TOUCH_END, this._touchend, false);
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
    document.removeEventListener(Context.TOUCH_MOVE, this._touchmove, false);
    document.removeEventListener(Context.TOUCH_END, this._touchend, false);
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
