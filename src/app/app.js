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

/*const PageHome = require('../pages/home');*/
/*const PageButton = require('../pages/button');
 const PageList = require('../pages/list');
 const PageForm = require('../pages/form');
 const PageIcon = require('../pages/icon');
 const PageDialog = require('../pages/dialog');
 const PageGallery = require('../pages/gallery');
 const PageScene = require('../pages/scene');*/
const Survey = require('../pages/survey');
const DataView = require('../pages/dataView');
const {Router, Route, IndexRedirect, hashHistory} = ReactRouter;

import {signIn} from '../services/auth';
import reactMixin from 'react-mixin';
import store from  './store';
import classnames from 'classnames';
import ScrollNav from '../components/ScrollNav';
import Navigation from '../components/navigation';
import Navgationmask from '../components/navgationmask';
import StoreSelector from '../components/StoreSelector';
import {scrollNavItems, navItems} from '../models/navs';
import {getStoreList} from '../services/store';

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
      });
    });
  }

  render() {
    let {isAppReady, scrollNavVisible, storeListVisible} = this.state;
    if (!isAppReady) return (<noscript></noscript>);
    return (
      <div className="app-body">
        <Navigation items={navItems}/>
        <div className={classnames("page-container", {
          "page-scrollNav": scrollNavVisible
        })}>
          <ScrollNav items={scrollNavItems}/>
          <div className="page-content">
            {this.props.children}
          </div>
          {
            storeListVisible && <StoreSelector />
          }
          <Navgationmask />
        </div>
      </div>
    );
  }
}

reactMixin.onClass(App, Reflux.connect(store));

ReactDOM.render(
  <Router history={hashHistory}>
    <Route name="app" path="/" component={App}>
      <IndexRedirect to="/survey"/>
      <Route path="survey" component={Survey}/>
      <Route path="dataview" component={DataView}/>
      {/* <Route path="form" component={PageForm}/>
       <Route path="icon" component={PageIcon}/>
       <Route path="dialog" component={PageDialog}/>
       <Route path="scene" component={PageScene}/>
       <Route path="PageHome" component={PageHome}/>*/}
    </Route>
  </Router>, document.getElementById('App')
);
