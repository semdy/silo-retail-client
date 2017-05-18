require('./Header.styl');

let {Icon} = SaltUI;
let {hashHistory} = ReactRouter;

class Header extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  getPathName(){
    return location.hash.split("?")[0].slice(1);
  }

  handleClick() {
    if (this.getPathName() === "/permission.apply") {
      hashHistory.replace('/permission.record');
    } else {
      hashHistory.replace('/report.survey');
    }
  }

  handleTouchmove(e){
    e.preventDefault();
  }

  render() {
    let {title, children} = this.props;
    return (
      <div className="header" onTouchMove={this.handleTouchmove}>
        <div className="h-toolbar left">
          <Icon name="angle-left-l" width={20} height={20} onClick={this.handleClick.bind(this)}>
          </Icon>
        </div>
        <h1 className="header-title">{title}{children}</h1>
      </div>
    );
  }
}

module.exports = Header;
