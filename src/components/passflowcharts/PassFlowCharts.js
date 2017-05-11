require('./PassFlowCharts.styl');

import BaseLineChart from '../../components/baseLineChart';
import {fetchReportPayment} from '../../services/store';
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

function makeChartData(data, filterType) {
  let series = [];

  let xAxis = [
    {
      data: []
    }
  ];

  series[0] = {
    name: locale.traffic,
    smooth: true,
    color: ["#ffdb73"],
    type: 'line',
    //areaColor: ["rgba(255,219,115,.9)", "rgba(255,219,115,.1)"],
    data: data.axisY.traffic
  };

  series[1] = {
    name: locale.orderCount,
    smooth: true,
    color: ["#4db7cd"],
    type: 'bar',
    barCategoryGap: '50%',
    data: data.axisY.count
  };

  xAxis[0].data = getXaisData(data.axisX.time, filterType);

  return {
    series: series,
    xAxis: xAxis,
    legend: {
      left: "center",
      data: [locale.traffic, locale.orderCount]
    },
    yAxis: [
      {
        name: locale.traffic
      },
      {
        name: locale.orderCount
      }
    ]
  };
}

class PassFlowChart extends BaseLineChart {

  constructor(props) {
    super(props);
    this.chartProps = {
      responsive: true,
      showAreaStyle: true
    };
  }

  /**
   * @override
   */
  fetch() {
    let {store, offset, filterType} = this.state;
    fetchReportPayment(`retail.payment.report.${filterType}`, store.storeId, offset).then((res) => {
      this.setState({
        loaded: true,
        data: makeChartData(res.data, filterType)
      });
      this.refs.charts.refresh();
    });

  }

}

module.exports = PassFlowChart;