import './Input.styl';

import {Icon, Context} from 'saltui';
import React, {PropTypes} from 'react';
import classnames from 'classnames';

class Input extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value,
      showPassWord: false
    };
    this.value = this.state.value;
  }

  handleChange(e){
    this.setState({
      value: e.target.value
    });
    this.props.onChange(e);
  }

  handleVisible(){
    this.setState({
      showPassWord: !this.state.showPassWord
    }, () => {
      this.refs.input.type = this.state.showPassWord ? "text" : "password";
    });
  }

  handleClear(){
    let input = this.refs.input;
    this.setState({
      value: ''
    });
    input.value = "";
    input.focus();
    this.props.onClear();
    this.props.onChange({target: input});
  }

  componentDidUpdate() {
    this.value = this.state.value;
  }

  render() {
    let {value, showPassWord} = this.state;
    let {placeholder, type, name, className, showEye, showClear, autoComplete, onFocus, onBlur} = this.props;
    return (
      <div className={classnames("input-wrap", {[className]: !!className, "has-clear": showClear})}>
        <input type={type}
               ref="input"
               name={name}
               className="input-text"
               placeholder={placeholder}
               autoComplete={type === 'password' ? 'off' : autoComplete}
               value={value}
               onChange={this.handleChange.bind(this)}
               onFocus={onFocus}
               onBlur={onBlur}
        />
        {
          <div className="input-actions">
            {
              showEye &&
              <Icon name={showPassWord ? 'eye-opened' : 'eye-closed'}
                    width={20}
                    height={20}
                    className="input-action"
                    onClick={this.handleVisible.bind(this)}
              />
            }
            {
              showClear &&
              <Icon name="x-circle"
                    width={20}
                    height={20}
                    className="input-action"
                    onClick={this.handleClear.bind(this)}
                    style={{
                      display: value === '' ? 'none' : ''
                    }}
              />
            }
          </div>
        }
      </div>
    );
  }
}

Input.propTypes = {
  showEye: PropTypes.bool,
  showClear: PropTypes.bool,
  value: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  autoComplete: PropTypes.string,
  type: PropTypes.string,
  className: PropTypes.string,
  onChange: PropTypes.func,
  onClear: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func
};

Input.defaultProps = {
  showEye: false,
  showClear: false,
  value: '',
  name: '',
  placeholder: '',
  autoComplete: 'on',
  type: 'text',
  className: '',
  onChange: Context.noop,
  onClear: Context.noop,
  onFocus: Context.noop,
  onBlur: Context.noop
};

module.exports = Input;
