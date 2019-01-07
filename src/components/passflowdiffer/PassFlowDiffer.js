import './PassFlowDiffer.styl';

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
    default:
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

function makeChartData(values, filterType) {
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

  let yesterdayData = values[1].data.axisY.traffic;
  let todayData = values[0].data.axisY.traffic;

  yesterdayData.forEach((item, i) => {
    if( todayData[i] === undefined ){
      todayData[i] = 0;
    }
  });

  series[0] = {
    name: locale.yesterday,
    color: ["#dbdbdb"],
    type: 'line',
    areaStyle: {normal: {
      color: "#dbdbdb"
    }},
    yAxisIndex: 0,
    data: yesterdayData
  };

  series[1] = {
    name: locale.today,
    color: ["#4db7cd"],
    type: 'line',
    areaStyle: {normal: {
      color: "#4db7cd"
    }},
    yAxisIndex: 0,
    data: todayData
  };

  xAxis[0].data = getXaisData(values[1].data.axisX.time, filterType);

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
      data: [locale.today, locale.yesterday]
    },
    yAxis: [
      {
        type: 'value',
        name: locale.traffic,
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

  getData(offset){
    let {store, filterType} = this.state;
    return getReportPayment(store.storeId, offset, `retail.payment.report.${filterType}`);
  }

  /**
   * @override
   */
  fetch() {
    let {offset, filterType} = this.state;
    Promise.all([this.getData(offset), this.getData(offset + 1)]).then(values => {
      this.setState({
        loaded: true,
        data: makeChartData(values, filterType)
      });
      this.refs.charts.refresh();
    });
  }

}

module.exports = PassFlowChart;
