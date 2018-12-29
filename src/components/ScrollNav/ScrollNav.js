import './ScrollNav.styl';

import React, {PropTypes} from 'react';
import {Scroller, Icon} from 'saltui';
import {Link} from 'react-router';
import Reflux from 'reflux';
import reactMixin from 'react-mixin';
import actions from '../../app/actions';
import store from  '../../app/store';
import {getAvailableNavs} from '../../services/store';
import {isIOS} from '../../utils';

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: []
    };
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
  }

  scrollTo(index){
    this.scroller.scrollTo(this._getScrollValue(index), 0, 600);
  }

  setNavList(cb){
    this.setState({
      items: getAvailableNavs().map(nav => {
        return this.props.items.find(item => item.path === nav);
      })
    }, cb);
  }

  componentDidUpdate(prevProps, prevState){
    let {scrollNavVisible} = this.state;
    if(prevState.scrollNavVisible !== scrollNavVisible) {
      this.setNavList(() => {
        this.navElements = [].slice.call(this.refs.scroller.children);
      });
    }
  }

  componentWillMount(){
    this.setNavList();
  }

  componentDidMount() {
    this.scroller = this.refs.container.scroller;
    this.navElements = [].slice.call(this.refs.scroller.children);
    let curPath = window.location.hash.substr(1).split("?")[0];

    if (curPath !== "/") {
      this.activeIndex = this._getNavIndex(curPath);
      setTimeout(() => {
        this.scrollTo(this.activeIndex);
      }, 30);
    }
  }

  componentWillUnmount(){
    this.scroller.destroy();
  }

  _getScrollValue(index){
    let width = 0;
    let WD = this.scroller.wrapper.offsetWidth;
    let SD = this.refs.scroller.offsetWidth;

    for(let i = 0, items = this.navElements; i < items.length; i++){
      if( i > index ) break;
      if( i === index ){
        width += items[i].offsetWidth/2;
      } else {
        width += items[i].offsetWidth;
      }
    }

    width = width - WD/2 + 12;

    if( width < 0 ){
      width = 0;
    } else if( width > SD - WD ){
      width = SD - WD
    }

    return -width;
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
    let {scrollNavVisible, items} = this.state;
    return (
      <div ref="el" className="scroll-nav padL" style={{display: scrollNavVisible ? "block" : "none"}}>
        <div className="scroll-nav-toolbar left" onClick={this.handleMenuFun.bind(this)}>
          <Icon name="menu" width={20} height={20}/>
        </div>
        <Scroller ref="container"
                  scrollX={true}
                  scrollY={false}
                  eventPassthrough={isIOS}
                  className="scroll-nav-contain"
        >
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
        </Scroller>
      </div>
    );
  }
}

Page.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.object
  ).isRequired
};

Page.defaultProps = {
  items: []
};

reactMixin.onClass(Page, Reflux.connect(store));

module.exports = Page;
