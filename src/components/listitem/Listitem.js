require('./Listitem.styl');

class Listitem extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="group-list-item t-FBH t-FBAC">
        {this.props.children}
      </div>
    );
  }
}

module.exports = Listitem;
