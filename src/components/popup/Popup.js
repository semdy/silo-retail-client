require('./Popup.styl');

let {Context} = SaltUI;
let {PropTypes} = React;
import Animate from '../../components/Animation';
import actions from '../../app/actions';

class Popup extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: this.props.visible
    };
  }

  show() {
    this.setState({
      visible: true
    });

    /**
     * 加延迟以保证动画的流畅性
     */
    setTimeout(() => {
      actions.setP2rEnabled(false);
    }, 600);
  }

  hide() {
    this.setState({
      visible: false
    });
  }

  componentWillReceiveProps(nextProps) {
    let {visible} = nextProps;
    let isShown = this.state.visible;
    if (visible === true && !isShown) {
      this.show();
    }
    else if (visible === false && isShown) {
      this.hide();
    }
  }

  handleTouch(e) {
    e.preventDefault();
    if (this.props.touchHide) {
      this.hide();
    }
  }

  handleLeave(){
    this.props.onLeave();
    actions.setP2rEnabled(true);
  }

  componentWillUnmount(){
    actions.setP2rEnabled(true);
  }

  render() {
    let {visible} = this.state;
    let {className, showBackdrop, onAppear, onEnd, onEnter} = this.props;
    return (
      <div>
        {
          showBackdrop &&
          <Animate
            className="backdrop"
            transitionName="fade"
            visible={visible}
            onClick={this.handleTouch.bind(this)}
          >
          </Animate>
        }
        <Animate transitionName="popup"
                 className={["popup-layer", className].join(" ").trim()}
                 visible={visible}
                 onAppear={onAppear}
                 onEnd={onEnd}
                 onEnter={onEnter}
                 onLeave={this.handleLeave.bind(this)}
        >
          {this.props.children}
        </Animate>
      </div>
    );
  }
}

Popup.defaultProps = {
  className: '',
  visible: false,
  showBackdrop: true,
  touchHide: true,
  onAppear: Context.noop,
  onEnd: Context.noop,
  onEnter: Context.noop,
  onLeave: Context.noop
};

Popup.propTypes = {
  className: PropTypes.string,
  visible: PropTypes.bool,
  showBackdrop: PropTypes.bool,
  touchHide: PropTypes.bool,
  onAppear: PropTypes.func,
  onEnd: PropTypes.func,
  onEnter: PropTypes.func,
  onLeave: PropTypes.func
};

module.exports = Popup;
