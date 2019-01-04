import './StoreSelector.styl';

import React, {PropTypes} from 'react';
import Reflux from 'reflux';
import {Button, Boxs, Icon, Context} from 'saltui';
import Animate from '../../components/Animation';
import reactMixin from 'react-mixin';
import actions from '../../app/actions';
import store from  '../../app/store';
import classnames from 'classnames';
import { setStoreModel } from '../../services/store';
import locale, {storeLocale} from '../../locale';

let HBox = Boxs.HBox;
let Box = Boxs.Box;

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
    actions.hideStoreSelector();
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

  handleTouch(e){
    //e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  }

  reset() {
    this.state.storeList.forEach((store, i) => {
      store.selected = false;
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.storeMultiable !== this.state.storeMultiable) {
      this.reset();
    }
  }

  render() {
    let {showStore, storeList, storeSelectorTitle} = this.state;
    return (
      storeList.length === 0 ? <noscript></noscript> :
        <div className="store-container"
             onTouchMove={this.handleTouch}
             onTouchEnd={this.handleTouch}
        >
          <Animate
            className="backdrop"
            transitionName="fade"
            visible={showStore}
            onClick={actions.hideStoreSelector}
          >
          </Animate>
          <Animate transitionName="popup" className="store-selector" visible={showStore}>
            <h4 className="store-header">{storeSelectorTitle}</h4>
            <ul className="store-list">
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
