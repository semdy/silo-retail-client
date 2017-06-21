/**
 * Created by mcake on 2017/6/21.
 */

import './EffectButton.styl';

let {Button, Context} = SaltUI;
let {PropTypes} = React;

import dom from '../../utils/dom';

class EffectButton extends Button {
  constructor(props){
    super(props);
    this.state = {
      left: 0,
      top: 0
    };
  }
  componentDidMount(){
    this.button = ReactDOM.findDOMNode(this.refs.button);
    this.effect = this.refs.effect;
  }

  handleClick(e){
    let bound = this.button.getBoundingClientRect();
    let left = e.pageX - bound.left - 12.5;
    let top = e.pageY - bound.top - 12.5;
    this.setState({
      left,
      top
    }, () => {
      this.effect.style.display = "none";
      setTimeout(() => {
        this.effect.style.display = "block";
      });
      dom.animationEnd(this.effect, function(){
        this.style.display = 'none';
      });
    });
    this.props.onClick(e);
  }

  render(){
    let {left, top} = this.state;
    return (
      <Button ref="button" {...this.props} onClick={this.handleClick.bind(this)}>
        {this.props.children}
        <span ref="effect"
              className="button-effect"
              style={{
                left: left + "px",
                top: top + "px",
                display: "none"
              }}
        >
        </span>
      </Button>
    )
  }
}

EffectButton.propTypes = {
  effect: PropTypes.bool,
  onClick: PropTypes.func
};

EffectButton.defaultProps = {
  effect: false,
  onClick: Context.noop
};

export default EffectButton;