import './animation.css';

let { PropTypes } = React;
import RcAnimate from 'rc-animate';

const AnimateEl = (props) => {
  const { style, visible, removeable } = props;
  if( !visible && removeable ) return <noscript></noscript>;
  let newStyle = Object.assign(style || {}, {
    display: visible ? undefined : 'none'
  });
  return <div {...props} style={newStyle}></div>;
};

class Animate extends React.Component {

  constructor(props) {
    super(props);
  }
  render(){
      return (
        <RcAnimate {...this.props} className="" style={{}}>
          <AnimateEl {...this.props}></AnimateEl>
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