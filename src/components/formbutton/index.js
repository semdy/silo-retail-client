/**
 * Created by mcake on 2017/6/19.
 */

import './FormButton.styl';

import React, {PropTypes} from 'react';
import {Button} from 'saltui';
import EffetButton from '../effectbutton';

class FormButton extends Button {
  constructor(props){
    super(props);
  }
  render(){
    let {funcType, disabled, effect} = this.props;
    return (
      <button className="button-plain form-button"
              type={funcType}
              disabled={disabled}
      >
        {
          effect ?
            <EffetButton {...this.props}/> :
            <Button {...this.props}/>
        }
      </button>
    )
  }
}

FormButton.propTypes = {
  funcType: PropTypes.string,
  effect: PropTypes.bool
  //...button
};

FormButton.defaultProps = {
  funcType: 'button',
  effect: false
  //...button
};

export default FormButton;
