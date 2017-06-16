require('./PassFlowCharts.styl');

import BaseChart from '../../components/baseChart';
import store from  '../../app/store';
import {getReportPayment} from '../../services/store';
import {getWeekNumber, localDate} from '../../utils/date';
import locale from '../../locale';

//格式化时间, 带上年份方便后续排序
const formatTime = (time, formatType) => {
  let ret = 0;
  let date = localDate(store.state.store.tzStamp, time * 1000);
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
    name: locale.orderCount,
    color: ["#4db7cd"],
    type: 'line',
    areaStyle: {normal: {
      color: "#4db7cd"
    }},
    yAxisIndex: 0,
    data: data.axisY.count
  };

  series[1] = {
    name: locale.traffic,
    color: ["#dbdbdb"],
    type: 'line',
    areaStyle: {normal: {
      color: "#dbdbdb"
    }},
    yAxisIndex: 0,
    data: data.axisY.traffic
  };

  xAxis[0].data = getXaisData(data.axisX.time, filterType);

  return {
    tooltip: {
      trigger: 'axis',
      confine: true   //http://echarts.baidu.com/option.html#tooltip.confine
    },
    series: series,
    grid: {
      left: '3%',
      right: '3%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: xAxis,
    legend: {
      left: "center",
      data: [locale.orderCount, locale.traffic]
    },
    yAxis: [
      {
        type: 'value',
        name: locale.orderCount,
        splitLine: splitStyle
      }/*,
      {
        type: 'value',
        name: locale.traffic,
        splitLine: splitStyle
      }*/
    ]
  };
}

class PassFlowChart extends BaseChart {

  constructor(props) {
    super(props);
    this.chartProps = {
      responsive: true
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

module.exports = PassFlowChart;