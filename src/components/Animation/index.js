import './animation.styl';

import React, {PropTypes} from 'react'; // eslint-disable-line
import RcAnimate from 'rc-animate';

const AnimateEl = (props) => {
  const {style, visible, removeable} = props;
  if (!visible && removeable) return <noscript/>;
  let newStyle = Object.assign(style || {}, {
    display: visible ? undefined : 'none'
  });
  return <div {...props} style={newStyle}/>;
};

class Animate extends React.Component {

  render() {
    let {className, style, ...props} = this.props;
    return (
      <RcAnimate {...props}>
        <AnimateEl {...this.props}/>
      </RcAnimate>
    );
  }
}

Animate.propTypes = {
  component: PropTypes.string,
  showProp: PropTypes.string
};

Animate.defaultProps = {
  component: '',
  showProp: 'visible'
};

module.exports = Animate;
