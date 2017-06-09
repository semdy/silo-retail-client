require('./PassFlowRate.styl');

import BaseChart from '../../components/baseChart';
import {getReportPayment} from '../../services/store';
import {getWeekNumber} from '../../utils/date';
import locale from '../../locale';

//格式化时间, 带上年份方便后续排序
const formatTime = (time, formatType) => {
  let ret = 0;
  let date = new Date(time * 1000);
  switch (formatType) {
    case 'hour':
      ret = date.getHours();
      break;
    case 'day':
      ret = date.getDate();
      break;
    case 'week':
      ret = getWeekNumber(date);
      break;
    case 'month':
      ret = date.getMonth() + 1;
      break;
    case 'quarter':
      ret = Math.ceil((date.getMonth() + 1) / 3);
      break;
    case 'year':
      ret = date.getFullYear();
      break;
  }

  return ret;
};

const UNIT_MAP = {
  hour: 'h',
  day: locale.day,
  week: locale.weekly,
  month: locale.month,
  quarter: locale.quarter,
  year: locale.year
};

const getXaisData = (times, formatType) => {
  return times.map((time) => {
    return formatTime(time, formatType) + UNIT_MAP[formatType];
  });
};

const calcSeriesRate = (countStack, trafficStack) => {
  return countStack.map((count, i) => {
    let percent = trafficStack[i] === 0 ? 0 : Math.min(1, count/trafficStack[i]);
    return Math.round(percent * 100);
  });
};

function makeChartData(data, filterType) {
  let series = [];

  let xAxis = [
    {
      type: 'category',
      data: []
    }
  ];

  let splitStyle = {
    lineStyle: {
      color: ["#ddd"],
      type: 'dashed'
    }
  };

  series[0] = {
    name: locale.convertRate,
    color: ["#4db7cd"],
    type: 'line',
    yAxisIndex: 0,
    data: calcSeriesRate(data.axisY.count, data.axisY.traffic)
  };

  xAxis[0].data = getXaisData(data.axisX.time, filterType);

  return {
    tooltip: {
      trigger: 'axis',
      confine: true,   //http://echarts.baidu.com/option.html#tooltip.confine
      formatter: function(params){
        let tip = params[0].axisValue;
        params.forEach((param) => {
          tip += ("<br />" + param.marker + param.seriesName + ": " + param.value + "%");
        });
        return tip;
      }
    },
    series: series,
    grid: {
      top: '10%',
      left: '3%',
      right: '3%',
      bottom: '3%',
      containLabel: true
    },
/*    legend: {
      left: "center",
      data: [locale.convertRate]
    },*/
    xAxis: xAxis,
    yAxis: [
      {
        type: 'value',
        name: locale.convertRate,
        max: 100,
        splitLine: splitStyle,
        axisLabel: {
          formatter: '{value}%'
        }
      }
    ]
  };
}

class PassFlowRate extends BaseChart {

  constructor(props) {
    super(props);
    this.chartProps = {
      responsive: true,
      title: locale.orderConvertRate
    };
  }

  /**
   * @override
   */
  fetch() {
    let {store, offset, filterType} = this.state;
    getReportPayment(store.storeId, offset, `retail.payment.report.${filterType}`).then((res) => {
      this.setState({
        loaded: true,
        data: makeChartData(res.data, filterType)
      });
      this.refs.charts.refresh();
    });

  }

}

module.exports = PassFlowRate;