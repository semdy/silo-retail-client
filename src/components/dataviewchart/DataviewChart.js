require('./DataviewChart.styl');

let {Toast} = SaltUI;
import reactMixin from 'react-mixin';
import actions from '../../app/actions';
import store from  '../../app/store';
import Base from '../../components/base';
import {getReportPayment} from '../../services/store';
import {getWeekNumber, localDate} from '../../utils/date';
import Chart from '../../components/chart';
import locale from '../../locale';

//格式化时间, 带上年份方便后续排序
const formatTime = (time, formatType) => {
  let ret = 0;
  let date = localDate(store.state.store.tzStamp, time * 1000);
  let year = date.getFullYear();
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
      ret = Math.ceil((date.getMonth() + 1)/3);
      break;
    case 'year':
      ret = year;
      break;
  }

  return year + "." + ( ret < 10 ? "0" + ret : ret );
};

const UNIT_MAP = {
  hour: 'h',
  day: locale.day,
  week: locale.weekly,
  month: locale.month,
  quarter: locale.quarter,
  year: locale.year
};

//生成时间和数据的键值对
const genKeyMap = (times, counts, amouts, formatType) => {
  let map = {};
  times.forEach((time, index) => {
    map[formatTime(time, formatType) + UNIT_MAP[formatType]] = [counts[index], amouts[index]];
  });

  return map;
};

//生成二维数组的键值对(用于合并多组x轴数据)
const genGroupKeyMap = (datas, cachData, formatType) => {
  let map = {};
  datas.forEach((data) => {
    let itemMap = genKeyMap(data.axisX.time || [], data.axisY.count || [], data.axisY.rmb || [], formatType);
    if (cachData) {
      cachData.push(itemMap);
    }
    for (let i in itemMap) {
      if (map[i] === undefined) {
        map[i] = itemMap[i];
      }
    }
  });

  return map;
};

//没有数据的时间节点补零
const zeroFill = (targetData, timelines) => {
  let newData = [];
  targetData.forEach((data) => {
    timelines.forEach((timeline) => {
      if (data[timeline] === undefined) {
        data[timeline] = [0, 0];
      }
    });
  });

  //按时间先后顺序重新排序
  targetData.forEach((item) => {
    let obj = {};
    let keys = Object.keys(item).sort((a, b) => {
      return parseFloat(a) - parseFloat(b)
    });
    keys.forEach((key) => {
      obj[key] = item[key];
    });
    newData.push(obj);
  });

  return newData;
};

//提取y轴的订单量和营业额数据, 返回一个二维数组
const extractYAxisData = (dataMap) => {
  let counts = [];
  let amouts = [];
  dataMap.forEach((data) => {
    let count = [];
    let amout = [];
    for (let i in data) {
      count.push(data[i][0]);
      amout.push(data[i][1]);
    }
    counts.push(count);
    amouts.push(amout);
  });

  return {
    counts: counts,
    amouts: amouts
  }
};


const getMax = (group) => {
  if (!Array.isArray(group)) return 0;
  return Math.max.apply(Math, group);
};

//计算订单量Y轴的最大值并放大2倍，以防止柱状图过高
const getSumMax = (yAxisCounts) => {
  let yAxisMax = 0;
  yAxisCounts.forEach((count) => {
    if (!count.length) {
      yAxisMax += 0;
    } else {
      yAxisMax += getMax(count);
    }
  });

  return yAxisMax * 2;
};

const makeChartData = (data) => {
  const yAxisCount = data.yAxis.count;
  const yAxisMax = getSumMax(yAxisCount);

  let splitStyle = {
    lineStyle: {
      color: ["#ddd"],
      type: 'dashed'
    }
  };

  let chartOptions = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      width: 250,
      left: "center",
      itemGap: 5,
      data: []
    },
    grid: {
      top: '20%',
      left: '3%',
      right: '3%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: data.xAxisData
      }
    ],
    yAxis: [
      {
        type: 'value',
        max: yAxisMax - (yAxisMax > 50 ? yAxisMax % 50 : 0), //将最大值设为50的整数倍
        name: locale.totalOrder,
        splitLine: splitStyle
      },
      {
        type: 'value',
        name: locale.totalAmount,
        splitLine: splitStyle
      }
    ],
    series: []
  };

  let drawColors = ["#4db7cd", "#ffdb73", "#a191d8"];

  if (yAxisCount.length > 2) {
    chartOptions.legend.itemHeight = 11;
    chartOptions.legend.top = -5;
  }

  yAxisCount.forEach((itemData, index) => {
    chartOptions.legend.data = data.legendNames;
    chartOptions.series.push({
        name: data.legendNames[index * 2],
        type: 'bar',
        stack: 'one',
        smooth: true,
        yAxisIndex: 0,
        color: [drawColors[index]],
        barCategoryGap: '50%',
        data: itemData
      },
      {
        name: data.legendNames[index * 2 + 1],
        type: 'line',
        stack: '',
        smooth: true,
        yAxisIndex: 1,
        color: [drawColors[index]],
        data: data.yAxis.amount[index]
      });
  });

  return chartOptions;
};

class DataviewChart extends Base {

  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      timelines: [],
      data: {}
    };

    this.fetchParams = [{storeId: null, offset: 0}, {storeId: null, offset: 0}];
    this.legendNames = locale.dataviewLegendNames;
  }

  fetchData(storeId, offset) {
    return new Promise((resolve, reject) => {
      getReportPayment(storeId, offset, `retail.payment.report.${this.state.filterType}`).then((res) => {
        resolve(res.data);
      }, (err) => {
        reject(err);
      });
    });
  }

  fetchGroupData(groupPrams) {
    let fetches = groupPrams.map(item => this.fetchData(item.storeId, item.offset));
    return new Promise((resolve) => {
      Promise.all(fetches).then((values) => {
        resolve(values);
      });
    })
  }

  setData(values) {
    let cacheData = [];
    //将时间线按小到大排序
    const timelines = Object.keys(genGroupKeyMap(values, cacheData, this.state.filterType)).sort((a, b) => {
      return parseFloat(a) - parseFloat(b)
    });
    //把年份截掉
    const xAxisData = timelines.map(xdata => {
      return xdata.charAt(5) === "0" ? xdata.substr(6) : xdata.substr(5)
    });
    //提取y轴的数据
    const yAxisData = extractYAxisData(zeroFill(cacheData, timelines));

    actions.setTimelines(timelines);

    this.setState({
      loaded: true,
      data: {
        xAxisData: xAxisData,
        yAxis: {
          count: yAxisData.counts,
          amount: yAxisData.amouts
        },
        legendNames: this.legendNames
      }
    });
  }

  getParams(storeId, offset) {
    let params = [];
    let {filterType} = this.state;
    //如果按周或者年排，则不作对比
    if( filterType === 'week' || filterType === 'year' ){
      params = this.fetchParams.slice(0, 1);
    } else {
      params = this.fetchParams.slice();
    }
    params.forEach((item, i) => {
      params[i].offset = offset + i;
      params[i].storeId = storeId;
    });

    return params;
  }

  fetch() {
    let {store, offset} = this.state;
    this.fetchGroupData(this.getParams(store.storeId, offset)).then((values) => {
      let isEmpty = values.every((value) => {
        return value.axisX.time.length === 0;
      });
      if( isEmpty ){
        return Toast.error(locale.dataviewEmpty);
      }
      this.setData(values);
      this.refs.chart.refresh();
    });
  }

  render(){
    let {loaded, data} = this.state;
    return (
      loaded &&
      <Chart ref="chart"
             data={makeChartData(data)}
             responsive={true}
      >
      </Chart>
    )
  }
}

reactMixin.onClass(DataviewChart, Reflux.connect(store));

module.exports = DataviewChart;