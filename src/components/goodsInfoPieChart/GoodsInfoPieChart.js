require('./GoodsInfoPieChart.styl');

import BaseChart from '../baseChart';
import locale from '../../locale';

function makeChartData(data) {
  return {
    tooltip: {
      trigger: 'item',
      formatter: "{a} <br/>{b}: {c} ({d}%)",
      confine: true   //http://echarts.baidu.com/option.html#tooltip.confine
    },
    series: [
      {
        name: locale.deliveries,
        type: 'pie',
        center: ['50%', '50%'],
        radius: ['45%', '65%'],
        data: data.series,
        color: ["#f39726", '#008cee', '#3876c1', '#29ab91', '#f05a4b', '#f4b81c', '#30a3b6', '#2a81c4', '#f39a00'],
        label: {
          emphasis: {
            formatter: function (params) {
              let data = params.data;
              return [data.name, data.value[0], data.params.money].join('\n');
            }
          }
        }
      }
    ]
  }
}

class GoodsInfoPieChart extends BaseChart {

  constructor(props) {
    super(props);
    this.queryKey = 'retail.sku.cate.distribute';
    this.chartProps = {
      title: locale.categoryRatio,
      titleCenter: true
    };
  }

  /**
   * @override
   */
  fixData(data){
    return makeChartData(data);
  }
}

module.exports = GoodsInfoPieChart;