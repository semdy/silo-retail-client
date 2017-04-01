import './StoreSelector.styl';

let {PropTypes} = React;
let {Button, Boxs, Icon, Context} = SaltUI;
let HBox = Boxs.HBox;
let Box = Boxs.Box;
import Animate from '../../components/Animation';
import reactMixin from 'react-mixin';
import actions from '../../app/actions';
import store from  '../../app/store';
import classnames from 'classnames';
import { setStoreModel } from '../../services/store';
import locale, {storeLocale} from '../../locale';


class Page extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  getData() {
    return this.state.storeList.filter((store) => {
      return store.selected === true;
    });
  }

  handleConfirm() {
    let stores = this.getData();
    setStoreModel(stores);
    actions.setStore(stores[0]);
    actions.hideStoreSelector();
    store.emitter.emit("setSelectedStore", stores);
  }

  handleCancel() {
    actions.hideStoreSelector();
    this.props.onCancel();
  }

  handleItemClick(itemIndex) {
    let curItem;
    if (this.state.storeMultiable) {
      curItem = this.state.storeList[itemIndex];
      if (curItem.selected) {
        curItem.selected = false;
      } else {
        curItem.selected = true;
      }
    } else {
      this.state.storeList.forEach((store, i) => {
        if (itemIndex === i) {
          store.selected = true;
          curItem = store;
        } else {
          store.selected = false;
        }
      });
    }
    this.setState({storeList: this.state.storeList});
    this.props.onItemClick({storeId: curItem.storeId, name: curItem.name});
  }

  _resetHandler() {
    this.state.storeList.forEach((store, i) => {
      store.selected = false;
    });
  }

  componentDidMount() {
    store.emitter.on("storeSelectorReset", this._resetHandler, this);
  }

  componentWillUnmount() {
    store.emitter.off("storeSelectorReset", this._resetHandler);
  }

  render() {
    let {showStore, storeList, isFullScreen, storeSelectorTitle} = this.state;
    return (
      storeList.length &&
      <div className="store-container">
        <Animate
          className="backdrop"
          transitionName="fade"
          visible={showStore}
          onClick={actions.hideStoreSelector}
        >
        </Animate>
        <Animate transitionName={isFullScreen ? "rotate-popup" : "popup"} className="store-selector" visible={showStore}
                 style={{
                   width: isFullScreen ? "400px" : undefined,
                   height: isFullScreen ? window.innerWidth + "px" : undefined,
                   left: isFullScreen ? "-200px" : undefined,
                   top: isFullScreen ? window.innerHeight - 400 - window.innerWidth / 2 + "px" : undefined
                 }}>
          <h4 className="store-header">{storeSelectorTitle}</h4>
          <ul className="store-list" style={{height: isFullScreen ? window.innerWidth - 94 + "px" : undefined}}>
            {
              storeList.map((item, index) => {
                return (
                  <li key={index}
                      onClick={this.handleItemClick.bind(this, index)}
                      className={classnames({selected: item.selected})}
                  >
                    <Icon name="check" width={18} height={18}/>
                    <span>{item.name}</span>
                  </li>
                )
              })
            }
          </ul>
          <div className="store-actions t-PL16 t-PR16">
            <HBox>
              <Box flex={1} className="t-PR8">
                <Button type="minor" onClick={this.handleCancel.bind(this)}>{locale.cancel}</Button>
              </Box>
              <Box flex={1} className="t-PL8">
                <Button type="primary" onClick={this.handleConfirm.bind(this)}>{locale.ok}</Button>
              </Box>
            </HBox>
          </div>
        </Animate>
      </div>
    );
  }
}

Page.propTypes = {
  onItemClick: PropTypes.func,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func
};

Page.defaultProps = {
  onItemClick: Context.noop,
  onConfirm: Context.noop,
  onCancel: Context.noop
};

reactMixin.onClass(Page, Reflux.connect(store));

module.exports = Page;
