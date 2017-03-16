require('./Header.styl');

let {Icon} = SaltUI;
let {hashHistory} = ReactRouter;

class Header extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let {title, children} = this.props;
    return (
      <div className="header">
        <div className="h-toolbar let">
          <Icon name="angle-left" width={30} height={30} onClick={hashHistory.goBack}>
          </Icon>
        </div>
        <h1 className="header-title">{title}{children}</h1>
      </div>
    );
  }
}

module.exports = Header;
