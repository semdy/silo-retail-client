require('./Header.styl');

let {Icon} = SaltUI;
let {hashHistory} = ReactRouter;
import {getStoreModel} from '../../services/store';

class Header extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleClick() {
    if (getStoreModel().length == 0) {
      hashHistory.replace('/permission.record');
    } else {
      //hashHistory.goBack();
      hashHistory.replace('/report.survey');
    }
  }

  render() {
    let {title, children} = this.props;
    return (
      <div className="header">
        <div className="h-toolbar let">
          <Icon name="angle-left-l" width={20} height={20} onClick={this.handleClick}>
          </Icon>
        </div>
        <h1 className="header-title">{title}{children}</h1>
      </div>
    );
  }
}

module.exports = Header;
