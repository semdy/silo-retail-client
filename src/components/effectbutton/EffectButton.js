/**
 * Created by mcake on 2017/6/21.
 */

import './EffectButton.styl';

let {Button, Context} = SaltUI;
let {PropTypes} = React;

import dom from '../../utils/dom';

class EffectButton extends Button {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.button = ReactDOM.findDOMNode(this.refs.button);
  }

  handleClick(e) {
    let span = document.createElement('span');
    span.className = "button-effect";
    let bound = this.button.getBoundingClientRect();
    let left = e.pageX - bound.left - 12.5;
    let top = e.pageY - bound.top - 12.5;
    span.style.left = left + "px";
    span.style.top = top + "px";
    this.button.appendChild(span);
    dom.animationEnd(span, function () {
      this.parentNode.removeChild(this);
    });
    this.props.onClick(e);
  }

  render() {
    return (
      <Button ref="button" {...this.props} onClick={this.handleClick.bind(this)}>
        {this.props.children}
      </Button>
    )
  }
}

EffectButton.propTypes = {
  onClick: PropTypes.func
};

EffectButton.defaultProps = {
  onClick: Context.noop
};

export default EffectButton;