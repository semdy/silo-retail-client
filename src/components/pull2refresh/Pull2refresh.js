require('./Pull2refresh.styl');

let {PropTypes} = React;
let {Icon, Context} = SaltUI;

import dom, {transitionEnd} from '../../utils/dom';
import classnames from 'classnames';
import locale from '../../locale';

function setTransform(el, value) {
  el.style.webkitTransform = 'translate3d(0px, ' + value + 'px, 0px)';
  el.style.transform = 'translate3d(0px, ' + value + 'px, 0px)';
}

function rmTransform(el) {
  el.style.webkitTransform = '';
  el.style.transform = '';
}

function setTransition(el, value) {
  el.style.webkitTransition = value;
  el.style.transition = value;
}

function getMoveRatio(diffY) {
  return Math.max(0, 1 - diffY / window.innerHeight) * 0.8;
}

function getTransform(el) {
  let value = el.style.transform || el.style.webkitTransform || 0;
  if (value) {
    let regx = /translate3d\(\d+px\, (\d+)px\, \d+px\)/.exec(value);
    if (regx) {
      value = regx[1];
    } else {
      value = 0;
    }
  }
  return parseFloat(value);
}

class Pull2refresh extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      status: 'normal'
    };

    this.startX = 0;
    this.startY = 0;
    this._canRefresh = false;
    this._touchmove = this._touchmove.bind(this);
    this._touchend = this._touchend.bind(this);
  }

  componentDidMount() {
    this.el = this.refs.el;
    this.indict = this.refs.indict;
  }

  componentDidUpdate(prevProps, prevState) {
    let status = this.state.status;
    if (status !== prevState.status) {
      if (status === 'release') {
        this.props.onRelease.call(this);
      }
      else if (status === 'normal') {
        this.props.onHide.call(this);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    let {show} = nextProps;
    let {status} = this.state;
    if (show === true && status === 'normal') {
      this.show();
    }
    else if (show === false && status !== 'normal') {
      this.hide();
    }
  }

  _touchstart(e) {
    if (!this.props.enabled || this.props.scroller.scrollTop > 0) return;

    let touch = e.targetTouches ? e.targetTouches[0] : e;
    this.startX = touch.pageX;
    this.startY = touch.pageY;
    this.startPos = getTransform(this.el);

    dom.on(document, "touchmove", this._touchmove);
    dom.on(document, "touchend", this._touchend);
  }

  _touchmove(e) {
    let touch = e.changedTouches ? e.changedTouches[0] : e;
    let diffX = touch.pageX - this.startX;
    let diffY = touch.pageY - this.startY;
    let moveY = 0;
    if (diffY > 0 && Math.abs(diffY) > Math.abs(diffX)) {
      e.preventDefault();
      moveY = diffY * getMoveRatio(diffY);
      this.indict.style.display = '';
      setTransition(this.el, 'none');
      setTransform(this.el, this.startPos + moveY);
      if (moveY > this.props.pullDistance) {
        this._canRefresh = true;
        this.setState({
          status: 'reverse'
        });
      } else {
        this._canRefresh = false;
        this.setState({
          status: 'normal'
        });
      }
    }
  }

  _touchend(e) {
    let touch = e.changedTouches ? e.changedTouches[0] : e;
    let diffX = touch.pageX - this.startX;
    let diffY = touch.pageY - this.startY;
    if (diffY > 0 && Math.abs(diffY) > Math.abs(diffX)) {
      setTransition(this.el, '');
      if (this._canRefresh) {
        setTransform(this.el, this.indict.offsetHeight);
        transitionEnd(this.el, () => {
          this.setState({
            status: 'release'
          });
        });
      } else {
        this.hide();
      }
    }

    dom.off(document, "touchmove", this._touchmove);
    dom.off(document, "touchend", this._touchend);
  }

  show() {
    this.indict.style.display = '';
    setTransform(this.el, this.indict.offsetHeight);
    this.setState({
      status: 'release'
    });
  }

  hide() {
    this._canRefresh = false;
    setTransform(this.el, 0);
    transitionEnd(this.el, () => {
      this.setState({
        status: 'normal'
      });
      rmTransform(this.el);
      this.indict.style.display = 'none';
    });
  }

  render() {
    let {status} = this.state;
    return (
      <div ref="el"
           className="p2r-container"
           onTouchStart={this._touchstart.bind(this)}
           onMouseDown={this._touchstart.bind(this)}
      >
        <div ref="indict"
             className="t-FBH t-FBJC t-FBAC p2r-indicator"
             style={{
               display: 'none'
             }}
        >
          <div className="p2r-icon">
            <Icon name="arrow-down"
                  className={classnames("p2r-arrow", {reverse: status === 'reverse'})}
                  width={23}
                  height={23}
                  style={{
                    display: status !== 'release' ? "" : 'none'
                  }}
            />
            <Icon name="p2r-loading"
                  className="spin p2r-spinner"
                  width={16}
                  height={16}
                  style={{
                    display: status === 'release' ? "" : 'none'
                  }}
            />
          </div>
          <span className="p2r-text">
            {this.props[status + 'Text']}
          </span>
        </div>
        {this.props.children}
      </div>
    );
  }
}

Pull2refresh.propTypes = {
  normalText: PropTypes.string.isRequired,
  reverseText: PropTypes.string.isRequired,
  releaseText: PropTypes.string.isRequired,
  scroller: PropTypes.object.isRequired,
  pullDistance: PropTypes.number,
  onRelease: PropTypes.func,
  onHide: PropTypes.func,
  enabled: PropTypes.bool,
  show: PropTypes.bool
};

Pull2refresh.defaultProps = {
  normalText: locale.p2rText.normal,
  reverseText: locale.p2rText.reverse,
  releaseText: locale.p2rText.release,
  scroller: window,
  pullDistance: 60,
  onRelease: Context.noop,
  onHide: Context.noop,
  enabled: true,
  show: false
};

module.exports = Pull2refresh;
