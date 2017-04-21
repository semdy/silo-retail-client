require('./ScrollNav.styl');

let {Context, Icon} = SaltUI;
let {PropTypes} = React;
let {Link} = ReactRouter;
import reactMixin from 'react-mixin';
import actions from '../../app/actions';
import store from  '../../app/store';
import {scrollTo} from '../../utils';

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.activeIndex = 0;
    this.navElements = [];
  }

  handleRoute(index) {
    if( index === this.activeIndex ) return;
    this.activeIndex = index;
    this.scrollTo(index);
  }

  handleDblClick(){
    actions.showP2R();
  }

  handleMenuFun() {
    actions.toggleNavigation();
    this.props.leftBarClick();
  }

  rightFun() {
    actions.showStoreSelector();
    this.props.rightBarClick();
  }

  scrollTo(index){
    scrollTo(this.refs.container, 'scrollLeft', this._getScrollValue(index) + 12, 400);
  }

  componentDidMount() {
    this.navElements = [].slice.call(this.refs.scroller.children);

    let curPath = location.hash.substr(1).split("?")[0];
    if (curPath !== "/") {
      this.activeIndex = this._getNavIndex(curPath);
      setTimeout(() => {
        this.scrollTo(this.activeIndex);
      }, 30);
    }
  }

  _getScrollValue(index){
    let width = 0;
    for(let i = 0, items = this.navElements; i < items.length; i++){
      if( i > index ) break;
      if( i === index ){
        width += items[i].offsetWidth/2;
      } else {
        width += items[i].offsetWidth;
      }
    }

    return width - this.refs.container.offsetWidth/2;
  }

  _getNavIndex(path) {
    let items = this.props.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].path === path) {
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
          <div ref="container" className="scroll-nav-bd">
            <div ref="scroller" className="scroll-nav-scroller">
              {
                items.map((item, index) => {
                  return (
                    <Link to={item.path}
                          key={'nav' + index}
                          className="scroll-nav-item"
                          activeClassName="active"
                          onClick={this.handleRoute.bind(this, index)}
                          onDoubleClick={this.handleDblClick.bind(this)}
                    >
                      <span>{item.text}</span>
                    </Link>
                  )
                })
              }
            </div>
          </div>
        </div>
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
