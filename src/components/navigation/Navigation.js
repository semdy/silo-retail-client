require('./Navigation.styl');

let {PropTypes} = React;
let {Link} = ReactRouter;
let {Icon} = SaltUI;
import reactMixin from 'react-mixin';
import actions from '../../app/actions';
import store from  '../../app/store';
import dom, {transitionEnd} from '../../utils/dom';

class Navigation extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      items: this.props.items
    };
    this.docBody = document.body;
  }

  show() {
    this.refs.navigation.style.display = "block";
    this.docBody.offsetWidth;
    dom.addClass(this.docBody, "show-sidebar");
  }

  hide() {
    let self = this;
    dom.removeClass(this.docBody, "show-sidebar");
    transitionEnd(this.refs.navigation, function () {
      dom.removeClass(self.docBody, "hide-sidebar");
      this.style.display = "";
    });
  }

  setData(items) {
    this.setState({
      items: Array.isArray(items) ? items : []
    });
  }

  _showNavHanlder(visible) {
    if (visible) {
      this.show();
    } else {
      this.hide();
    }
  }

  setMenus(isAdmin) {
    this.state.items.forEach((item) => {
      if (item.admin) {
        item.visible = isAdmin;
      }
    });
    this.setState({
      items: this.state.items
    });
  }

  componentDidMount() {
    store.emitter.on("showNavigation", this._showNavHanlder, this);
  }

  componentWillUnmount() {
    store.emitter.off("showNavigation", this._showNavHanlder);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.isAdmin !== this.state.isAdmin) {
      this.setMenus(this.state.isAdmin);
    }
  }

  render() {
    let {items} = this.state;
    return (
      <div ref="navigation" className="sidenavigation">
        <div className="navigation-list">
          {
            items.map((menu, i) => {
              return (
                menu.visible &&
                <Link to={menu.path}
                      key={i}
                      className="navigation-item"
                      activeClassName="active"
                      onClick={actions.hideNavigation}
                >
                  {
                    !menu.icon ? "" :
                      ( menu.icon.match(/\.(jpg|png|gif|svg)$/) ? <img src={menu.icon}/> :
                        <Icon name={menu.icon} width={20} height={20}/> )
                  }
                  <span>{menu.text}</span>
                </Link>
              )
            })
          }
        </div>
      </div>
    );
  }
}

Navigation.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.object
  ).isRequired,
};

Navigation.defaultProps = {
  items: []
};


reactMixin.onClass(Navigation, Reflux.connect(store));

module.exports = Navigation;
