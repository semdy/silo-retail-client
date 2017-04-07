import './animation.styl';

let {PropTypes} = React;
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

  constructor(props) {
    super(props);
  }

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