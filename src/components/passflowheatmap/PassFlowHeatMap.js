require('./PassFlowHeatMap.styl');

import BaseChart from '../../components/baseChart';
import {getStoreChartReport} from '../../services/store';
import locale from '../../locale';

function makeChartData(res) {
  let hourlines = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
  let daylines = locale.dayList;

  let weeks = res.series[0].data;
  let hours = res.series[1].data;
  let traffics = res.series[2].data;

  let data = [];

  /**
   * 生成初始数据
   */
  daylines.forEach((day, i) => {
    hourlines.forEach((hour, j) => {
      data.push([i, j, "-"]);
    });
  });

  /**
   * 以week*hour为索引填充真实数据
   */
  weeks.forEach((week, i) => {
    data[week*hours[i]][2] = Math.round(traffics[i]) || "-";
  });

  return {
    tooltip: {
      position: 'top'
    },
    animation: false,
    grid: {
      top: '6%',
      left: '3%',
      right: '3%',
      bottom: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: daylines,
      splitArea: {
        show: true
      }
    },
    yAxis: {
      type: 'category',
      data: hourlines,
      name: locale.timeslot,
      splitArea: {
        show: true
      }
    },
    visualMap: {
      min: 0,
      max: 100,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '0%'
    },
    series: [{
      name: locale.passflowHeatMap,
      type: 'heatmap',
      data: data,
      label: {
        normal: {
          show: true
        }
      },
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  };
}

class PassFlowHeatMap extends BaseChart {

  constructor(props) {
    super(props);
    this.chartProps = {
      height: 500,
      title: locale.passflowHeatMap
    };
  }

  /**
   * @override
   */
  fetch() {
    let {store, offset} = this.state;
    getStoreChartReport(store.storeId, offset, "retail.guest.heat.map").then((res) => {
      let data = makeChartData(res);

      this.setState({
        loaded: true,
        data: data
      });

      this.refs.charts.refresh();
    });

  }

}

module.exports = PassFlowHeatMap;