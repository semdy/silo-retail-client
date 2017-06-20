require('./FormItem.styl');

let {Icon, Context} = SaltUI;
let {PropTypes} = React;

import classnames from 'classnames';
import Input from '../input';

class FormItem extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      errMsg: ""
    };
    this.value = this.props.value || "";
  }

  displayName = 'FormItem';

  handleChange(e){
    this.value = e.target.value;
    this.props.onChange(e);
  }

  handleFocus(e){
    this.setState({
      errMsg: ''
    });
    this.props.onFocus(e);
  }

  handleError(errMsg){
    this.setState({
      errMsg: errMsg
    });
  }

  render() {
    let {errMsg} = this.state;
    let {leftIcon, rightIcon, className, size, ...inputProps} = this.props;
    return (
      <div className={classnames("form-item", {[className]: !!className, "has-error": !!errMsg})}>
        <div className={classnames("form-item-bd t-FBH t-FBJC", {[size]: !!size, "left-pad": !!leftIcon, "right-pad": !!rightIcon})}>
          {
            leftIcon &&
            <Icon name={leftIcon}
                  className="input-icon left"
                  width={22}
                  height={22}
            />
          }
          <Input className="input-item"
                 {...inputProps}
                 onChange={this.handleChange.bind(this)}
                 onFocus={this.handleFocus.bind(this)}
          />
          {
            rightIcon &&
            <Icon name={rightIcon}
                  className="input-icon right"
                  width={22}
                  height={22}
            />
          }
        </div>
        {
          !!errMsg &&
          <div className="form-item-explain">
              <Icon name="note-round"
                    className="form-item-icon"
                    width={18}
                    height={18}
              />
              <span>{errMsg}</span>
          </div>
        }
      </div>
    );
  }
}

FormItem.propTypes = {
  leftIcon: PropTypes.string,
  rightIcon: PropTypes.string,
  className: PropTypes.string,
  size: PropTypes.string,
  rules: PropTypes.arrayOf(
    PropTypes.shape({
      method: PropTypes.string,
      errorMsg: PropTypes.string
  })),
  onChange: PropTypes.func,
  onFocus: PropTypes.func
  //...Input
};

FormItem.defaultProps = {
  leftIcon: '',
  rightIcon: '',
  className: '',
  size: 'medium',
  onChange: Context.noop,
  onFocus: Context.noop
  //...Input
};

module.exports = FormItem;
