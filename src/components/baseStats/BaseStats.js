import './BaseStats.styl';

import React from 'react';
import Reflux from 'reflux';
import Base from '../../components/base';
import Stats from '../../components/stats';
import reactMixin from 'react-mixin';
import store from  '../../app/store';
import {getStoreStats} from '../../services/store';
import {genStatsDataByMoney, genStatsData} from '../../utils';

class BaseStatus extends Base {

  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      data: []
    };
    this.fieldList = [];
    this.groupByMoney = false;
  }

  fetch() {
    let {store, offset} = this.state;
    getStoreStats(store.storeId, offset, offset, this.fieldList).then((res) => {
      this.setState({
        loaded: true,
        data: this.groupByMoney ? genStatsDataByMoney(res.data, this.fieldList) : genStatsData(res.data, this.fieldList)
      });
    });
  }

  render() {
    // eslint-disable-next-line
    let {loaded, data} = this.state;
    return (
      //loaded &&
      <Stats {...this.props} data={data}/>
    );
  }
}

reactMixin.onClass(BaseStatus, Reflux.connect(store));

module.exports = BaseStatus;
