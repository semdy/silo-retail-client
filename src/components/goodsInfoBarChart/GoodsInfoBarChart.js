require('./GoodsInfoBarChart.styl');

import BaseChart from '../baseChart';
import locale from '../../locale';

function addSuffix(data, name) {
  if( !Array.isArray(data) ) return '';
  return data.map((item) => {
    return item + name;
  });
}

function makeChartData(data) {

  let xAxis = [
    {
      type: 'category',
      name: locale.saleCount,
      data: addSuffix(data.xAxis[0].data, locale.num),
      axisTick: {
        alignWithLabel: true
      }
    }
  ];

  let series = [
    {
      name: locale.orderCount,
      smooth: true,
      color: ["#4db7cd"],
      type:'bar',
      barWidth: '60%',
      data: data.series[0].data
    }
  ];


  return {
    tooltip: {
      trigger: 'axis',
      confine: true   //http://echarts.baidu.com/option.html#tooltip.confine
    },
    series: series,
    grid: {
      top: '20%',
      left: '3%',
      right: '3%',
      bottom: '5%',
      containLabel: true
    },
    xAxis: xAxis,
    yAxis: [
      {
        type: 'value',
        name: locale.orderNum
      }
    ]
  };
}

class GoodsInfoBarChart extends BaseChart {

  constructor(props) {
    super(props);
    this.queryKey = 'retail.sku.apr.distribute';
    this.chartProps = {
      title: locale.distribute,
      helpText: locale.distributeHelpText,
      suffix: locale.num
    };
  }

  /**
   * @override
   */
  fixData(data){
    return makeChartData(data);
  }
}

module.exports = GoodsInfoBarChart;