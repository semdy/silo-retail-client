import './style.styl';

import React, { PropTypes } from 'react'; // eslint-disable-line
import { Button } from 'saltui';
import classnames from 'classnames';

class ButtonGroup extends React.Component {
  constructor( props ){
    super(props);
    this.state = {

    };
  }

  render(){
    let props = this.props;
    return (<div className={classnames("t-button-group", {"t-FBH": props.flexable, 't-button-group-half': props.half, [props.className]: !!props.className})}>
      {
          React.Children.map(props.children, (child, i) => {
            return <Button
              key={i}
              {...child.props}
              className={classnames({"t-FB1": props.flexable, [props.activeIndex === i ? "t-button-selected" : child.props.className]: !!child.props.className})}>
            </Button>
          })
      }
    </div>)
  }

}

ButtonGroup.propTypes = {
  flexable: PropTypes.bool,
  half: PropTypes.bool,
  activeIndex: PropTypes.number
};

ButtonGroup.defaultProps = {
  flexable: false,
  half: false,
  activeIndex: -1
};

module.exports = ButtonGroup;
