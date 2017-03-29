require('./SurveyLineChart.styl');

import BaseLineChart from '../../components/baseLineChart';
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

class SurveyLineChart extends BaseLineChart {

  constructor(props) {
    super(props);
    this.chartProps = {
      chartName: locale.mountNum,
      //隐藏坐标轴
      showAxis: false,
      width: window.innerWidth/2,
      height: 150,
      showAreaStyle: true
    };
  }
  /**
   * @override
   */
  fetch() {
    let {store, offset} = this.state;
    getStoreStats(store.storeId, offset + 7, offset + 1, ['trade.money']).then((res) => {
      this.setState({
        loaded: true,
        data: makeChartData(res.data)
      });
      this.refs.charts.refresh();
    });
  }
}

module.exports = SurveyLineChart;