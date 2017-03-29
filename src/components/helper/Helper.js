require('./Helper.styl');

let {PropTypes} = React;
let {Icon} = SaltUI;
import {alert} from '../../utils';

class Helper extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleClick() {
    alert(this.props.text);
  }

  render() {
    return (
      <Icon name="help" className="help-hint" width={18} height={18} onClick={this.handleClick.bind(this)}/>
    );
  }

}

Helper.defaultProps = {
  text: ''
};

Helper.propTypes = {
  text: PropTypes.string.isRequired
};

module.exports = Helper;
