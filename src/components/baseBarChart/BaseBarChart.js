require('./BaseBarChart.styl');

import reactMixin from 'react-mixin';
import store from  '../../app/store';
import BarChart from '../../components/barchart';
import Base from '../../components/base';
import {getStoreChartReport} from '../../services/store';

class BaseBarChart extends Base {

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
      <BarChart ref="charts"
                chartData={data}
                visible={data.series.length > 0}
                {...this.chartProps}
      >
      </BarChart>
    )
  }
}

reactMixin.onClass(BaseBarChart, Reflux.connect(store));

module.exports = BaseBarChart;