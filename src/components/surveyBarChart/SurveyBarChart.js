require('./SurveyBarChart.styl');

import BaseChart from '../../components/baseChart';
import {getStoreStats} from '../../services/store';
import locale from '../../locale';

function makeChartData(data) {
  let series = [
    {
      color: ['#4db7cd'],
      type:'bar',
      barWidth: '60%',
      name: locale.orderNum,
      data: []
    }
  ];

  let xAxis = [
    {
      type: 'category',
      show: false,
      data: [],
      axisTick: {
        alignWithLabel: true
      }
    }
  ];

  let yAxis = [
    {
      type: 'value',
      show: false
    }
  ];

  let grid = {
    top: '20%',
    left: '3%',
    right: '3%',
    bottom: '5%',
    containLabel: false
  };

  let tooltip = {
    trigger: 'axis',
    confine: true   //http://echarts.baidu.com/option.html#tooltip.confine
  };

  data.forEach((item) => {
    series[0].data.push(item.value);
    xAxis[0].data.push(item.date);
  });

  return {
    tooltip: tooltip,
    grid: grid,
    series: series,
    xAxis: xAxis,
    yAxis: yAxis
  };
}

class SurveyBarChart extends BaseChart {

  constructor(props) {
    super(props);
    this.chartProps = {
      title: locale.orderNum,
      alignCenter: true,
      width: window.innerWidth/2,
      height: 100
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