require('./SurveyBarChart.styl');

import BaseBarChart from '../../components/baseBarChart';
import {getStoreStats} from '../../services/store';
import locale from '../../locale';

function makeChartData(data) {
  let series = [
    {
      data: []
    }
  ];

  let xAxis = [
    {
      data: []
    }
  ];

  data.forEach((item) => {
    series[0].data.push(item.value);
    xAxis[0].data.push(item.date);
  });

  return {
    series: series,
    xAxis: xAxis
  };
}

class SurveyBarChart extends BaseBarChart {

  constructor(props) {
    super(props);
    this.chartProps = {
      chartName: locale.orderNum,
      //隐藏坐标轴
      showAxis: false,
      width: window.innerWidth/2,
      height: 150
    };
  }

  /**
   * @override
   */
  fetch() {
    let {store, offset} = this.state;
    getStoreStats(store.storeId, offset + 15, offset + 1, ['trade.count']).then((res) => {
      this.setState({
        loaded: true,
        data: makeChartData(res.data)
      });
      this.refs.charts.refresh();
    });
  }
}

module.exports = SurveyBarChart;