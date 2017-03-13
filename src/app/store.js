const actions = require('./actions');
//const EventEmitter = require('../utils/EventEmitter');

module.exports = Reflux.createStore({
  listenables: [actions],
  state: {
    //是否侧边栏导航
    navVisible: false,
    //是否显示顶部滚动导航
    scrollNavVisible: true,
    //侧边栏导航高亮索引值, -1时均不高亮
    navIndex: -1,
    //顶部滚动导航高亮索引值
    scrollNavIndex: 0,
    //是否显示店铺
    showStore: false,
    //是否全屏
    isFullScreen: false,
    //店铺列表是否单选
    storeMultiable: true
  },

  //隐藏侧边栏导航
  onHideNavigation () {
    this.state.navVisible = false;
    this.emitter.emit("showNavigation", false);
    this.updateComponent();
  },

  //显示侧边栏导航
  onShowNavigation () {
    this.state.navVisible = true;
    this.emitter.emit("showNavigation", true);
    this.updateComponent();
  },

  //显示或隐藏侧边栏导航
  onToggleNavigation () {
    this.emitter.emit("showNavigation", this.state.navVisible = !this.state.navVisible);
    this.updateComponent();
  },

  //显示或隐藏侧边栏导航
  onShowScrollNav ( visible ) {
    this.state.scrollNavVisible = visible;
    this.updateComponent();
  },

  //侧边栏导航跳转
  onNavGoto (index) {
    this.state.scrollNavIndex = -1; //取消顶部导航所有高亮
    this.state.navIndex = index;
    this.updateComponent();
  },

  //顶部导航跳转
  onScrollTo (index) {
    this.state.navIndex = -1; //取消侧边栏导航所有高亮
    this.state.scrollNavIndex = index;
    this.updateComponent();
  },

  //显示门店弹窗
  onShowStoreSelector () {
    this.state.showStore = true;
    this.updateComponent();
  },

  //隐藏门店弹窗
  onHideStoreSelector () {
    this.state.showStore = false;
    this.updateComponent();
  },

  //切换店铺列表是否单选
  onSetStoreMultiable(isMultiable){
    this.state.storeMultiable = isMultiable;
    this.updateComponent();
  },

  //设置全屏
  onSetFullScreen (bool) {
    this.state.isFullScreen = bool;
    this.updateComponent();
  },

  updateComponent () {
    this.trigger(this.state);
  },

  getInitialState () {
    return this.state;
  }
});
