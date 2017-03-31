require('../pollyfill/');
require('../services/auth').signIn();
require('./app.styl');

// 插入 demo svg
let TingleIconSymbolsDemo = require('./../images/tingle-icon-symbols.svg');
let symbols = document.createElement('div');
ReactDOM.render(<TingleIconSymbolsDemo/>, symbols);
symbols.className = 't-hide';
(document.body || document.documentElement).appendChild(symbols);

if (__LOCAL__ && window.chrome && window.chrome.webstore) { // This is a Chrome only hack
  // see https://github.com/livereload/livereload-extensions/issues/26
  setInterval(function () {
    document.body.focus();
  }, 200);
}

// bind fastclick
window.FastClick && FastClick.attach(document.body);

const {Router, Route, IndexRedirect, hashHistory} = ReactRouter;

import {signIn} from '../services/auth';
import reactMixin from 'react-mixin';
import store from  './store';
import actions from './actions';
import ScrollNav from '../components/ScrollNav';
import Navigation from '../components/navigation';
import Navgationmask from '../components/navgationmask';
import StoreSelector from '../components/StoreSelector';
import Pull2refresh from '../components/pull2refresh';
import {scrollNavItems, navItems} from '../models/navs';
import Header from '../components/header';
import {getStoreList} from '../services/store';


import Index from '../pages/index';
import Survey from '../pages/survey';
import DataView from '../pages/dataView';
import PageApply from '../pages/permissionApply';
import PageRcord from '../pages/permissionRecord';
import PageApproval from '../pages/permissionApproval';
import PageMembers from '../pages/permissionMembers';
import Distribution from '../pages/distribution';
import Payment from '../pages/payment';
import GoodsInfo from '../pages/goodsinfo';
import NoMatch from '../pages/nomatch';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAppReady: false
    };
  }

  componentDidMount() {
    signIn.ready(() => {
      this.setState({
        isAppReady: true
      }, () => {
        getStoreList();
      });
      //移除app启动动画
      document.body.removeChild(document.querySelector("#launcher"));
    });
  }

  handleRelease() {
    actions.doRefresh();
  }

  render() {
    let {isAppReady, storeListVisible, showHeader, headerTitle, shownP2r, isP2rEnabled} = this.state;

    return (
      isAppReady &&
      <div className="app-body">
        <Navigation items={navItems}/>
        <div className="page-container page-scrollNav">
          <ScrollNav items={scrollNavItems}/>
          {
            showHeader &&
            <Header>
              {headerTitle}
            </Header>
          }
          <Pull2refresh enabled={isP2rEnabled}
                        show={shownP2r}
                        scroller={this.refs.content}
                        onRelease={this.handleRelease}
          >
            <div ref="content" className="page-content">
              {this.props.children}
            </div>
          </Pull2refresh>
          {
            storeListVisible && <StoreSelector/>
          }
          <Navgationmask/>
        </div>
      </div>
    );
  }
}

reactMixin.onClass(App, Reflux.connect(store));

ReactDOM.render(
  <Router history={hashHistory}>
    <Route name="app" path="/" component={App}>
      <IndexRedirect to="/report.index"/>
      <Route path="report.index" component={Index}/>
      <Route path="report.survey" component={Survey}/>
      <Route path="report.sale" component={DataView}/>
      <Route path="report.distribution" component={Distribution}/>
      <Route path="report.payment" component={Payment}/>
      <Route path="report.goodsinfo" component={GoodsInfo}/>
      <Route path="permission.apply" component={PageApply}/>
      <Route path="permission.record" component={PageRcord}/>
      <Route path="permission.approval" component={PageApproval}/>
      <Route path="permission.members" component={PageMembers}/>
      <Route path="*" component={NoMatch}/>
    </Route>
  </Router>, document.getElementById('App')
);
