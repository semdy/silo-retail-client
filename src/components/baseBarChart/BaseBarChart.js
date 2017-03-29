require('./BaseBarChart.styl');

import reactMixin from 'react-mixin';
import store from  '../../app/store';
import BarChart from '../../components/barchart';
import Base from '../../components/base';
import {getStoreChartReport} from '../../services/store';

function addSuffix(res, name) {
  if( !Array.isArray(res.xAxis) ) return '';
  res.xAxis.forEach((item) => {
    item.data = item.data.map((xAxis) => {
      return xAxis + name;
    });
  });

  return res;
}

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
    let {suffix} = this.chartProps;
    getStoreChartReport(store.storeId, offset, this.queryKey).then((res) => {
      this.setState({
        loaded: true,
        data: suffix ? addSuffix(res, suffix) : res
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