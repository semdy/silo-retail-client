require('./Popup.styl');

let {PropTypes} = React;
import Animate from '../../components/Animation';

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
  }

  hide() {
    this.setState({
      visible: false
    });
  }

  componentWillReceiveProps(nextProps) {
    let {visible} = nextProps;
    if( visible === true ){
      this.show();
    }
    else if( visible === false ) {
      this.hide();
    }
  }

  handleTouch(){
    if( this.props.touchHide ){
      this.hide();
    }
  }

  render() {
    let {visible} = this.state;
    let {className, showBackdrop} = this.props;
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
                 visible={visible}>
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
  touchHide: true
};

Popup.propTypes = {
  className: PropTypes.string,
  visible: PropTypes.bool,
  showBackdrop: PropTypes.bool,
  touchHide: PropTypes.bool
};

module.exports = Popup;
