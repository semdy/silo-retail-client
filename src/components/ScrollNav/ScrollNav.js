require('./ScrollNav.styl');

let {Context, Icon} = SaltUI;
let {PropTypes} = React;
let {hashHistory} = ReactRouter;
import reactMixin from 'react-mixin';
import actions from '../../app/actions';
import store from  '../../app/store';
import classnames from 'classnames';

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      navs: this.props.navs
    };
  }

  handleRoute(path, index) {
    hashHistory.replace(path);
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
    if( curPath !== "/" ){
      actions.scrollTo(this._getNavIndex(curPath));
    }
  }

  _getNavIndex(path) {
    var navs = this.state.navs;
    for (var i = 0; i < navs.length; i++) {
      if (navs[i].path == path) {
        return i;
      }
    }
    return -1;
  }

  render() {
    let {scrollNavIndex, scrollNavVisible, navs} = this.state;

    return (
      <div className="scroll-nav padL padR" style={{display: scrollNavVisible ? "block" : "none"}}>
        <div className="scroll-nav-toolbar left" onClick={this.handleMenuFun.bind(this)}>
          <Icon name="menu" width={20} height={20}/>
        </div>
        <div className="scroll-nav-contain">
          <div ref="scroller" className="scroll-nav-bd">
            <div className="scroll-nav-scroller">
              {
                navs.map((item, index) => {
                  return (
                    <a href="javascript:;"
                       key={'nav' + index}
                       className={classnames("scroll-nav-item", {active: scrollNavIndex == index})}
                       onClick={this.handleRoute.bind(this, item.path, index)}>
                      <span>{item.text}</span>
                    </a>
                  )
                })
              }
            </div>
          </div>
        </div>
        <div className="scroll-nav-toolbar right" onClick={this.rightFun.bind(this)}>
          <Icon name="store" width={20} height={20}/>
        </div>
      </div>
    );
  }
}

Page.propTypes = {
  leftBarClick: PropTypes.func,
  rightBarClick: PropTypes.func,
  navs: PropTypes.arrayOf(
    PropTypes.object
  ).isRequired
};

Page.defaultProps = {
  leftBarClick: Context.noop,
  rightBarClick: Context.noop,
  navs: [
    {
      text: "销售数据",
      path: "/dataview"
    },
    {
      text: "商品信息",
      path: "/goodsInfo"
    },
    {
      text: "优惠",
      path: "/saleDataView"
    },
    {
      text: "客流",
      path: "/passflow"
    },
    {
      text: "客流",
      path: "/passflow"
    },
    {
      text: "客流",
      path: "/passflow"
    },
    {
      text: "客流",
      path: "/passflow"
    },
    {
      text: "客流",
      path: "/passflow"
    }
  ]
};

reactMixin.onClass(Page, Reflux.connect(store));

module.exports = Page;
