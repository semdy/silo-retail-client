require('./BasePieChart.styl');

import reactMixin from 'react-mixin';
import store from  '../../app/store';
import PieChart from '../../components/piechart';
import Base from '../../components/base';
import {getStoreChartReport} from '../../services/store';

class BasePieChart extends Base {

  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    };

    this.queryKey = '';
    this.chartProps = {
      chartName: '',
      responsive: false
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
      <PieChart ref="charts"
                chartData={data}
                center={['50%', '50%']}
                showLegend={false}
                visible={data.series.length > 0}
                {...this.chartProps}
      >
      </PieChart>
    );
  }
}

reactMixin.onClass(BasePieChart, Reflux.connect(store));

module.exports = BasePieChart;