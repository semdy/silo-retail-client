require('./BaseLineChart.styl');

import reactMixin from 'react-mixin';
import store from  '../../app/store';
import LineChart from '../../components/linechart';
import Base from '../../components/base';
import {getStoreChartReport} from '../../services/store';

class BaseLineChart extends Base {

  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    };

    this.queryKey = '';
    this.chartProps = {
      chartName: ''
    };
  }

  fetch() {
    let {store, offset} = this.state;
    getStoreChartReport(store.storeId, offset, this.queryKey).then((res) => {
      this.setState({
        loaded: true,
        data: res
      });
      this.refs.charts.refresh();
    });
  }

  render() {
    let {loaded, data} = this.state;
    return (
      loaded &&
      <LineChart ref="charts"
                chartData={data}
                visible={data.series.length > 0}
                {...this.chartProps}
      >
      </LineChart>
    )
  }
}

reactMixin.onClass(BaseLineChart, Reflux.connect(store));

module.exports = BaseLineChart;