/**
 * Created by mcake on 2017/6/19.
 */

import './FormButton.styl';

let {PropTypes} = React;
let {Button} = SaltUI;

class FormButton extends Button {
  constructor(props){
    super(props);
  }
  render(){
    return (
      <button className="button-plain form-button" type={this.props.funcType}>
        <Button {...this.props}/>
      </button>
    )
  }
}

FormButton.propTypes = {
  funcType: PropTypes.string
  //...button
};

FormButton.defaultProps = {
  funcType: 'button'
  //...button
};

export default FormButton;