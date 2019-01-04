import './Popup.styl';

import {Context} from 'saltui';
import React, {PropTypes} from 'react';
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
    let isShown = this.state.visible;
    if (visible === true && !isShown) {
      this.show();
    }
    else if (visible === false && isShown) {
      this.hide();
    }
  }

  handleClick(e) {
    e.preventDefault();
    if (this.props.touchHide) {
      this.hide();
    }
  }

  handleTouch(e){
    //e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  }

  render() {
    let {visible} = this.state;
    let {className, showBackdrop, onAppear, onEnd, onEnter, onLeave} = this.props;
    return (
      <div ref="el"
           onTouchMove={this.handleTouch}
           onTouchEnd={this.handleTouch}
      >
        {
          showBackdrop &&
          <Animate
            className="backdrop"
            transitionName="fade"
            visible={visible}
            onClick={this.handleClick.bind(this)}
          >
          </Animate>
        }
        <Animate transitionName="popup"
                 className={["popup-layer", className].join(" ").trim()}
                 visible={visible}
                 onAppear={onAppear}
                 onEnd={onEnd}
                 onEnter={onEnter}
                 onLeave={onLeave}
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
