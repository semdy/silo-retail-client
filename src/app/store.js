const actions = require('./actions');

module.exports = Reflux.createStore({
  listenables: [actions],
  state: {
    //是否侧边栏导航
    navVisible: false,
    //是否显示顶部滚动导航
    scrollNavVisible: true,
    //是否显示店铺
    showStore: false,
    //是否全屏
    isFullScreen: false,
    //店铺列表是否单选
    storeMultiable: true,
    //是否显示店铺列表
    storeListVisible: false
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

  //顶部导航跳转
  onScrollTo (index) {
    //this.updateComponent();
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

  //显示店铺列表
  onShowStoreList(){
    this.state.storeListVisible = true;
    this.updateComponent();
  },

  //隐藏店铺列表
  onHideStoreList(){
    this.state.storeListVisible = false;
    this.updateComponent();
  },

  //更新组件状态
  updateComponent () {
    this.trigger(this.state);
  },

  //初始化组件状态池
  getInitialState () {
    return this.state;
  }
});
