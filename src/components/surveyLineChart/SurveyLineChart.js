import './SurveyLineChart.styl';

import echarts from 'echarts';
import BaseChart from '../../components/baseChart';
import {getStoreStats} from '../../services/store';
import locale from '../../locale';

function makeChartData(data) {
  let series = [
    {
      color: ['#f39726'],
      type: 'line',
      name: locale.mountNum,
      data: [],
      areaStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0, color: 'rgba(243,151,38,.8)' // 0% 处的颜色
          }, {
            offset: 1, color: 'rgba(243,151,38,.02)' // 100% 处的颜色
          }], false)
        }
      }
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

class SurveyLineChart extends BaseChart {

  constructor(props) {
    super(props);
    this.chartProps = {
      title: locale.mountNum,
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
    getStoreStats(store.storeId, offset + 15, offset + 1, ['trade.money']).then((res) => {
      this.setState({
        loaded: true,
        data: makeChartData(res.data)
      });
      this.refs.charts.refresh();
    });
  }
}

export default SurveyLineChart;
