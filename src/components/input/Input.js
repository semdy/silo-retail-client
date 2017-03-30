require('./Input.styl');

let {Icon, Context} = SaltUI;
let {PropTypes} = React;

class Input extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value
    };
    this.value = this.state.value;
  }

  handleChange(e){
    let value = e.target.value;
    this.setState({
      value: value
    });
    this.props.onChange(value);
  }

  handleClear(){
    this.setState({
      value: ''
    });
    this.props.onClear();
  }

  componentDidUpdate() {
    this.value = this.state.value;
  }

  render() {
    let {value} = this.state;
    let {placeholder, type, className} = this.props;
    return (
      <div className={["input-wrap", className].join(" ")}>
        <input type={type} ref="input"
               className="input-text"
               placeholder={placeholder}
               value={value}
               onChange={this.handleChange.bind(this)}
        />
        <span className="input-clear"
              onClick={this.handleClear.bind(this)}
              style={{
                display: value === '' ? 'none' : 'block'
              }}
        >
          <Icon name="x-circle" width={20} height={20}/>
        </span>
      </div>
    );
  }
}

Input.propTypes = {
  value: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  className: PropTypes.string,
  onChange: PropTypes.func,
  onClear: PropTypes.func
};

Input.defaultProps = {
  value: '',
  placeholder: '',
  string: 'text',
  className: '',
  onChange: Context.noop,
  onClear: Context.noop
};

module.exports = Input;
