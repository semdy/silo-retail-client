import './Top10Tab.styl';

import React from 'react';
import Reflux from 'reflux';
import {Tab} from 'saltui';
import reactMixin from 'react-mixin';
import store from  '../../app/store';
import Base from '../../components/base';
import {getStoreChartReport} from '../../services/store';
import Table from '../../components/table';
import locale from '../../locale';

//生成table datagrid标准的数据格式
export const genTableRows = (series) => {
  let res = [];
  series.forEach((item) => {
    res.push({
      name: item.name,
      avgPrice: item.params.avg || 0,
      saleVolume: item.value[0],
      saleAmount: item.params.money
    });
  });

  return res;
};

class Top10Tab extends Base {

  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      top10DestData: [],
      top10AscData: [],
      tabActiveIndex: 0
    };

    this.queryChanged = false;

    this.tableFields = [
      {
        field: 'name',
        name: locale.productName,
        align: 'left',
        formatter: function (value, index) {
          return (index + 1) + " " + value
        }
      },
      {
        field: 'avgPrice',
        name: `${locale.avgPrice}(${locale.yuan})`,
        width: 80
      },
      {
        field: 'saleVolume',
        name: locale.saleVolume,
        width: 60
      },
      {
        field: 'saleAmount',
        name: `${locale.saleAmount}(${locale.yuan})`,
        width: 100
      }
    ];
  }

  fetch() {
    this.queryChanged = true;
    this.getTop10Data(this.state.tabActiveIndex);
  }

  getTop10Data(activeIndex) {
    if (activeIndex === 0) {
      this.fetchTop10Dest();
    } else {
      this.fetchTop10Asc();
    }
  }

  //畅销TOP10
  fetchTop10Dest() {
    let {store, offset} = this.state;
    getStoreChartReport(store.storeId, offset, 'retail.sku.rank.desc').then((res) => {
      this.setState({
        loaded: true,
        top10DestData: genTableRows(res.series),
        tabActiveIndex: 0
      });
    });
  }

  //滞销TOP10
  fetchTop10Asc() {
    let {store, offset} = this.state;
    getStoreChartReport(store.storeId, offset, 'retail.sku.rank.asc').then((res) => {
      this.setState({
        loaded: true,
        top10AscData: genTableRows(res.series),
        tabActiveIndex: 1
      });
    });
  }

  handleTabChange(obj) {
    if (this.queryChanged) {
      this.getTop10Data(obj.active);
    }

    this.queryChanged = false;

    this.setState({
      tabActiveIndex: obj.active
    });
  }

  render() {
    let {loaded, tabActiveIndex, top10DestData, top10AscData} = this.state;
    return (
      loaded &&
      <Tab active={tabActiveIndex} onChange={this.handleTabChange.bind(this)}>
        <Tab.Item title={locale.rankDesc10}>
          <Table fields={this.tableFields} rows={top10DestData}/>
        </Tab.Item>
        <Tab.Item title={locale.rankAsc10}>
          <Table fields={this.tableFields} rows={top10AscData}/>
        </Tab.Item>
      </Tab>
    );
  }
}

reactMixin.onClass(Top10Tab, Reflux.connect(store));

module.exports = Top10Tab;
