require('./DataviewCharts.styl');

let {Toast} = SaltUI;
import reactMixin from 'react-mixin';
import actions from '../../app/actions';
import store from  '../../app/store';
import Base from '../../components/base';
import {fetchReportPayment} from '../../services/store';
import {getWeekNumber} from '../../utils/date';
import Charts from '../../components/lineBarchart';
import locale from '../../locale';

//格式化时间, 带上年份方便后续排序
const formatTime = (time, formatType) => {
  let ret = 0;
  let date = new Date(time * 1000);
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
    const xAxisData = timelines.map(xdata => xdata.charAt(5) === "0" ? xdata.substr(6) : xdata.substr(5));
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