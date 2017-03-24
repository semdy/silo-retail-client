require('./ScrollNav.styl');

let {Context, Icon} = SaltUI;
let {PropTypes} = React;
let {Link} = ReactRouter;
import reactMixin from 'react-mixin';
import actions from '../../app/actions';
import store from  '../../app/store';

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleRoute(index) {
    actions.scrollTo(index);
    //this.refs.scroller.scrollLeft = (index + 1)*100;
  }

  handleMenuFun() {
    actions.toggleNavigation();
    this.props.leftBarClick();
  }

  rightFun() {
    actions.showStoreSelector();
    this.props.rightBarClick();
  }

  componentDidMount() {
    let curPath = location.hash.substr(1).split("?")[0];
    if (curPath !== "/") {
      actions.scrollTo(this._getNavIndex(curPath));
    }
  }

  _getNavIndex(path) {
    let items = this.props.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].path == path) {
        return i;
      }
    }
    return -1;
  }

  render() {
    let {scrollNavVisible} = this.state;
    let {items} = this.props;

    return (
      <div className="scroll-nav padL" style={{display: scrollNavVisible ? "block" : "none"}}>
        <div className="scroll-nav-toolbar left" onClick={this.handleMenuFun.bind(this)}>
          <Icon name="menu" width={20} height={20}/>
        </div>
        <div className="scroll-nav-contain">
          <div ref="scroller" className="scroll-nav-bd">
            <div className="scroll-nav-scroller">
              {
                items.map((item, index) => {
                  return (
                    <Link to={item.path}
                          key={'nav' + index}
                          className="scroll-nav-item"
                          activeClassName="active"
                          onClick={this.handleRoute.bind(this, index)}>
                      <span>{item.text}</span>
                    </Link>
                  )
                })
              }
            </div>
          </div>
        </div>
        {/*{
          storeListVisible &&
          <div className="scroll-nav-toolbar right" onClick={this.rightFun.bind(this)}>
            <Icon name="store" width={20} height={20}/>
          </div>
        }*/}
      </div>
    );
  }
}

Page.propTypes = {
  leftBarClick: PropTypes.func,
  rightBarClick: PropTypes.func,
  items: PropTypes.arrayOf(
    PropTypes.object
  ).isRequired
};

Page.defaultProps = {
  leftBarClick: Context.noop,
  rightBarClick: Context.noop,
  items: []
};

reactMixin.onClass(Page, Reflux.connect(store));

module.exports = Page;
