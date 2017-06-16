const actions = require('./actions');
import locale from '../locale';

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
    //店铺列表数据
    storeList: [],
    //店铺列表是否多选
    storeMultiable: false,
    //店铺弹层标题
    storeSelectorTitle: locale.storeLocale.singleTitle,
    //是否显示顶部header
    showHeader: false,
    //header标题
    headerTitle: '',
    //是否是店长
    isAdmin: false,
    //是否隐藏下拉刷新
    shownP2r: false,
    //是否禁用下拉刷新
    isP2rEnabled: true,
    //是否隐藏加载更多
    isHideLoadMore: true,
    //门店数据时间间隔
    offset: 0,
    //选中的门店object
    store: {
      tzStamp: 0
    },
    //下拉刷新标记
    refreshFlag: false,
    //数据筛选类型
    filterType: 'hour',
    //销售数据timelines
    timelines: []
  },

  //隐藏侧边栏导航
  onHideNavigation () {
    this.state.navVisible = false;
    this.updateComponent();
  },

  //显示侧边栏导航
  onShowNavigation () {
    this.state.navVisible = true;
    this.updateComponent();
  },

  //显示或隐藏侧边栏导航
  onToggleNavigation () {
    this.state.navVisible = !this.state.navVisible;
    this.updateComponent();
  },

  //显示或隐藏侧边栏导航
  onShowScrollNav ( visible ) {
    this.state.scrollNavVisible = visible;
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
    this.state.storeSelectorTitle = locale.storeLocale[isMultiable === true ? 'multTitle' : 'singleTitle'];
    this.updateComponent();
  },

  onSetStoreList(storeList){
    this.state.storeList = storeList;
    this.updateComponent();
  },

  //设置全屏
  onSetFullScreen (bool) {
    this.state.isFullScreen = bool;
    this.updateComponent();
  },

  //显示顶部header
  onShowHeader(title){
    this.state.headerTitle = title;
    this.state.showHeader = true;
    this.updateComponent();
  },

  //隐藏顶部header
  onHideHeader(){
    this.state.headerTitle = '';
    this.state.showHeader = false;
    this.updateComponent();
  },

  //设置店长身份
  onSetAdmin(bool){
    this.state.isAdmin = bool;
    this.updateComponent();
  },

  //显示下拉刷新
  onShowP2R(){
    this.state.shownP2r = true;
    this.updateComponent();
  },

  //隐藏下拉刷新
  onHideP2R(){
    this.state.shownP2r = false;
    this.updateComponent();
  },

  //隐藏加载更多
  onHideLoadMore(){
    this.state.isHideLoadMore = false;
    this.updateComponent();
  },

  //下拉刷新是否禁用
  onSetP2rEnabled(bool){
    this.state.isP2rEnabled = bool;
    this.updateComponent();
  },

  //查询上一时间段数据
  onQueryPrev() {
    this.state.offset++;
    this.updateComponent();
  },

  //查询具到某一时间段的数据
  onSetQueryOffset(offset){
    this.state.offset = offset;
    this.updateComponent();
  },

  //查询下一时间段数据
  onQueryNext() {
    if (this.state.offset === 0) {
      return;
    }
    this.state.offset = Math.max(0, --this.state.offset);
    this.updateComponent()
  },

  //保存选中的店铺
  onSetStore(store){
    if( !store ) return;
    this.state.store = store;
    this.updateComponent();
  },

  //调用下拉刷新
  onDoRefresh(){
    this.state.shownP2r = true;
    this.state.refreshFlag = !this.state.refreshFlag;
    this.updateComponent();
  },

  //设置筛选类型
  onSetFilterType(type){
    this.state.filterType = type;
    this.updateComponent();
  },

  //设置timelines
  onSetTimelines(timelines){
    this.state.timelines = timelines;
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
