require('./DataviewCharts.styl');

import reactMixin from 'react-mixin';
import actions from '../../app/actions';
import store from  '../../app/store';
import Base from '../../components/base';
import {fetchReportPayment} from '../../services/store';
import {getWeekNumber} from '../../utils/date';
import Charts from '../../components/lineBarchart';
import locale from '../../locale';

//格式化时间, 带上年份方便后续排序
const formatTime = (time, bytype) => {
  let ret = 0;
  let date = new Date(time * 1000);
  let year = date.getFullYear();
  switch (bytype) {
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

class DataviewCharts extends Base {

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
      fetchReportPayment(`retail.payment.report.${this.state.filterType}`, storeId, offset).then((res) => {
        resolve(res.data);
      }, (err) => {
        reject(err);
      });
    });
  }

  fetchGroupData(groupPrams) {
''
    if (!Array.isArray(groupPrams))
      throw new Error("fetchGroupData arguments must be typeof Array!");

    let fetches = groupPrams.map(item => this.fetchData(item.storeId, item.offset));

    return new Promise((resolve) => {
      Promise.all(fetches).then((values) => {
        resolve(values);
      });
    })
  }

  setData(values) {
    let cacheData = [];

    const timelines = Object.keys(genGroupKeyMap(values, cacheData, this.state.filterType)).sort((a, b) => {
      return parseFloat(a) - parseFloat(b)
    });
    const xAxisData = timelines.map(xdata => xdata.charAt(5) === "0" ? xdata.substr(6) : xdata.substr(5));
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

  setParams(storeId, offset) {
    this.fetchParams.forEach((item, i) => {
      this.fetchParams[i].offset = offset + i;
      this.fetchParams[i].storeId = storeId;
    });
  }

  fetch() {
    let {store, offset} = this.state;
    this.setParams(store.storeId, offset);
    this.fetchGroupData(this.fetchParams).then((values) => {
      this.setData(values);
      this.refs.charts.refresh();
    });
  }

  render(){
    let {loaded, data} = this.state;
    return (
      loaded &&
      <Charts ref="charts"
              chartData={data}
      >
      </Charts>
    )
  }
}

reactMixin.onClass(DataviewCharts, Reflux.connect(store));

module.exports = DataviewCharts;