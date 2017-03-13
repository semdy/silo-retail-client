require('./Navigation.styl');

let {PropTypes} = React;
let {hashHistory} = ReactRouter;
let {Icon} = SaltUI;
import classnames from 'classnames';
import reactMixin from 'react-mixin';
import actions from '../../app/actions';
import store from  '../../app/store';
import dom from '../../utils/domUtils';

class Navigation extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      menuItems: this.props.menuItems
    };
  }

  show() {
    setTimeout(() => {
      dom.addClass(this.refs.navigation, "show-sidebar");
    });
  }

  hide() {
    let navDom = this.refs.navigation;
    dom.removeClass(navDom, "show-sidebar").addClass("hide-sidebar");
    navDom.addEventListener("transitionend", function handler() {
      dom.removeClass(navDom, "hide-sidebar");
      this.removeEventListener("transitionend", handler, false);
    }, false);
  }

  setData(menuData) {
    this.setState({
      menuItems: Array.isArray(menuData) ? menuData : []
    });
  }

  goto(index) {

    if( index == -1 ) return;

    if (typeof index === 'number') {
      let menuItems = this.state.menuItems;
      hashHistory.replace(menuItems[index].path);
    }
    else if (typeof index === 'string') {
      hashHistory.replace(index);
    }

    //隐藏菜单栏
    actions.hideNavigation();
  }

  _showNavHanlder( visible ){
    if( visible ){
      this.show();
    } else {
      this.hide();
    }
  }

  componentDidMount() {
    this.lastNavIndex = this.state.navIndex;
    store.emitter.on("showNavigation", this._showNavHanlder, this);
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.navIndex !== this.lastNavIndex) {
      this.goto(nextState.navIndex);
      this.lastNavIndex = nextState.navIndex;
    }
  }

  componentWillUnmount(){
    store.emitter.off("showNavigation", this._showNavHanlder);
  }

  render() {
    let {menuItems, navIndex, navVisible} = this.state;
    return (
      <div ref="navigation" className="sidenavigation" style={{display: navVisible ? 'block' : ''}}>
        <ul className="navigation-list">
          {
            menuItems.map((menu, i) => {
              return (
                menu.visible ?
                  <li className={classnames("navigation-item", {current: i === navIndex})} key={i}
                      onClick={actions.navGoto.bind(actions, i)}>
                    <a href="javascript:;">
                      {
                        !menu.icon ? "" :
                          ( menu.icon.match(/\.(jpg|png|gif|svg)$/) ? <img src={menu.icon}/> :
                            <Icon name={menu.icon} width={20} height={20}/> )
                      }
                      <span>{menu.text}</span>
                    </a>
                  </li> : ""
              )
            })
          }
        </ul>
      </div>
    );
  }
}

Navigation.propTypes = {
  menuItems: PropTypes.arrayOf(
    PropTypes.object
  ).isRequired,
};

Navigation.defaultProps = {
  menuItems: [{
    text: "申请权限",
    icon: 'permission',
    visible: true,
    path: '/permission.apply'
  },
    {
      text: "申请记录",
      icon: 'record',
      visible: true,
      path: '/permission.record'
    },
    {
      text: "权限审批",
      icon: 'approval',
      visible: true,
      path: '/permission.approval'
    }]
};


reactMixin.onClass(Navigation, Reflux.connect(store));

module.exports = Navigation;
