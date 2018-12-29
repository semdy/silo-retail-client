import './BaseChart.styl';

import React from 'react';
import Reflux from 'reflux';
import reactMixin from 'react-mixin';
import store from  '../../app/store';
import Chart from '../../components/chart';
import Base from '../../components/base';
import {getStoreChartReport} from '../../services/store';

class BaseChart extends Base {

  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    };

    this.queryKey = '';
    this.chartProps = {};
  }

  fetch() {
    let {store, offset} = this.state;
    getStoreChartReport(store.storeId, offset, this.queryKey).then((res) => {
      this.setState({
        loaded: true,
        data: this.fixData(res)
      });
      this.refs.charts.refresh();
    });
  }

  fixData(data){
    return data;
  }

  render() {
    let {loaded, data} = this.state;
    return (
      loaded &&
      <Chart ref="charts"
            data={data}
            visible={data.series.length > 0}
            {...this.chartProps}
      >
      </Chart>
    )
  }
}

reactMixin.onClass(BaseChart, Reflux.connect(store));

module.exports = BaseChart;
