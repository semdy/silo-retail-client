import '../pollyfill/'
import './app.styl'
import auth from '../services/auth'

import React from 'react'
import Reflux from 'reflux'
import ReactDOM from 'react-dom'
import reactMixin from 'react-mixin'

import TingleIconSymbolsDemo from '../assets/img/tingle-icon-symbols.svg'
import { Router, Route, IndexRedirect, hashHistory } from 'react-router'

import store from './store'
import actions from './actions'
import classnames from 'classnames'
import ScrollNav from '../components/ScrollNav'
import Navigation from '../components/navigation'
import Navgationmask from '../components/navgationmask'
import StoreSelector from '../components/StoreSelector'
import Pull2refresh from '../components/pull2refresh'
import { scrollNavs, navItems } from '../models/navs'
import Header from '../components/header'
import { appReady } from '../services/store'

import Index from '../pages/index'
import Survey from '../pages/survey'
import DataView from '../pages/dataView'
import PageApply from '../pages/permissionApply'
import PageRcord from '../pages/permissionRecord'
import PageApproval from '../pages/permissionApproval'
import PageMembers from '../pages/permissionMembers'
import Distribution from '../pages/distribution'
import Payment from '../pages/payment'
import GoodsInfo from '../pages/goodsinfo'
import Passflow from '../pages/passflow'
import PassflowSimple from '../pages/passflowSimple'
import HeatMap from '../pages/heatmap'
import Login from '../pages/login'
import NoMatch from '../pages/nomatch'

import registerServiceWorker from '../registerServiceWorker'

auth.signIn()

class App extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    let { showHeader, headerTitle, shownP2r, isP2rEnabled, scrollNavVisible } = this.state
    return (
      <div className="app-body">
        <Navigation items={navItems}/>
        <div className={classnames("page-container", { "page-scrollNav": scrollNavVisible })}>
          <ScrollNav items={scrollNavs}/>
          {
            showHeader &&
            <Header>
              {headerTitle}
            </Header>
          }
          <Pull2refresh
            enabled={isP2rEnabled}
            show={shownP2r}
            scroller={this.refs.content}
            onRelease={actions.doRefresh}
          >
            <div ref="content" className="page-content">
              {this.props.children}
            </div>
          </Pull2refresh>
          <StoreSelector/>
          <Navgationmask/>
        </div>
      </div>
    )
  }
}

reactMixin.onClass(App, Reflux.connect(store))


appReady(() => {
  //移除app启动动画
  try {
    document.body.removeChild(document.getElementById("launcher"))
  } catch (e) {
  }

  // 插入svg
  let symbols = document.createElement('div')
  symbols.className = 't-hide'
  ReactDOM.render(<TingleIconSymbolsDemo />, symbols);
  document.body.appendChild(symbols)

  // bind fastclick
  window.FastClick && window.FastClick.attach(document.body)

  if (window.__LOCAL__ && window.chrome && window.chrome.webstore) { // This is a Chrome only hack
    // see https://github.com/livereload/livereload-extensions/issues/26
    setInterval(function () {
      document.body.focus()
    }, 200)
  }

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
        <Route path="report.passflow" component={Passflow}/>
        <Route path="report.passflow.simple" component={PassflowSimple}/>
        <Route path="report.heatmap.simple" component={HeatMap}/>
        <Route path="permission.apply" component={PageApply}/>
        <Route path="permission.record" component={PageRcord}/>
        <Route path="permission.approval" component={PageApproval}/>
        <Route path="permission.members" component={PageMembers}/>
        <Route path="user.login" component={Login}/>
        <Route path="*" component={NoMatch}/>
      </Route>
    </Router>, document.getElementById('app')
  )
})

// service worker
if (window.location.protocol === 'https:') {
  registerServiceWorker()
}
