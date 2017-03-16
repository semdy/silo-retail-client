import './DataView.styl';

let {Toast} = SaltUI;
import { getWeekNumber } from '../../utils/dateUtils';
import { error } from '../../utils';
import Stats from './Stats';
import Charts from './Charts';
import DateNavigator from './DateNavigator';
import actions from '../../app/actions';
import store from '../../app/store';
import {fetchReportPayment, getStoreList} from '../../services/store';

//默认时间间隔(单位：小时|天|月|年)
const defaultOffset = 0;

//格式化时间, 带上年份方便后续排序
const formatTime = (time, bytype) => {
  var ret = 0;
  var date = new Date(time * 1000);
  var year = date.getFullYear();
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
  day: '日',
  week: '周',
  month: '月',
  year: '年'
};

//获取距离今天指定日期对象
const getDateBefore = (offset, filterType) => {
  let date = new Date();
  let dateFn;
  let setFn;
  switch (filterType) {
    case 'hour':
      dateFn = "getDate";
      setFn = "setDate";
      break;
    case 'day':
      dateFn = "getMonth";
      setFn = "setMonth";
      break;
    case 'week':
      dateFn = "getMonth";
      setFn = "setMonth";
      break;
    case 'month':
      dateFn = "getFullYear";
      setFn = "setYear";
      break;
    case 'year':
      dateFn = "getFullYear";
      setFn = "setYear";
      break;
  }
  if (dateFn) {
    date[setFn](date[dateFn]() - offset);
  }
  return date;
};

//格式化金额，以'亿/万/元'计数
const formatAmout = (value) => {
  if (value / 1e8 >= 1) {
    return (value / 1e8).toFixed(2);
  } else if (value / 1e4 >= 1) {
    return (value / 1e4).toFixed(2);
  } else {
    return value;
  }
};

//给金额加后缀
const getAmoutSuffix = (value) => {
  if (value / 1e8 >= 1) {
    return "亿";
  } else if (value / 1e4 >= 1) {
    return "万";
  } else {
    return "元";
  }
};

//求和
const getSum = (stack) => {
  if (!Array.isArray(stack)) return 0;
  return stack.reduce((prevValue, curValue) => {
    return prevValue + curValue;
  }, 0);
};

//求二维数组的和
const getGroupSum = (data, type) => {
  let sum = 0;
  data.forEach((item) => {
    sum += getSum(item.axisY[type]);
  });
  return sum;
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

class Page extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isDataLoaded: false,
      activeIndex: 1,
      isNextDisabled: true,
      diffDisabled: false,
      hideDiff: false,
      timelines: [],
      statsData: [
        {
          name: "总订单量",
          value: 0
        },
        {
          name: "总营业额",
          value: 0
        }
      ],
      chartData: {
        xAxisData: [],
        yAxis: {
          count: [],
          amount: []
        },
        legendNames: []
      },
      storeList: []
    };

    this.legendNames = [];
    this.filterType = 'hour'; //默认过滤方式
    this.fetchParams = [];
    this.offset = defaultOffset;
    //统一约束： 为1时表示同一家门店今天和昨天数据对比， 为2时表示多家门店之间的数据对比
    this.compareType = 1;
  }

  fetchData(storeId, offset) {
    return new Promise((resolve, reject) => {
      fetchReportPayment(`retail.payment.report.${this.filterType}`, storeId, offset).then((res) => {
        resolve(res.data);
      }, (err) => {
        reject(err);
        /*error("服务器异常或没有数据 code: " + err.result);*/
      });
    });
  }

  fetchGroupData(groupPrams) {

    if (!Array.isArray(groupPrams))
      throw new Error("fetchGroupData arguments must be typeof Array!");

    let fetches = groupPrams.map(item => this.fetchData(item.storeId, item.offset));

    /*Toast.show({
      type: 'loading',
      content: '拼命加载中...',
      autoHide: false
    });*/

    return new Promise((resolve) => {
      Promise.all(fetches).then((values) => {
        resolve(values);
        //Toast.hide();
      });
    })
  }

  setData(values, legendNames) {
    let cacheData = [];
    const count = getGroupSum(values, "count");
    const amout = getGroupSum(values, "rmb");
    const timelines = Object.keys(genGroupKeyMap(values, cacheData, this.filterType)).sort((a, b) => {
      return parseFloat(a) - parseFloat(b)
    });
    const xAxisData = timelines.map(xdata => xdata.charAt(5) == "0" ? xdata.substr(6) : xdata.substr(5));
    const yAxisData = extractYAxisData(zeroFill(cacheData, timelines));

    this.setState({
      isDataLoaded: true,
      timelines: timelines,
      statsData: [
        {
          name: "总订单量",
          suffix: "单",
          value: count
        },
        {
          name: "总营业额",
          suffix: getAmoutSuffix(amout),
          value: formatAmout(amout)
        }
      ],
      chartData: {
        xAxisData: xAxisData,
        yAxis: {
          count: yAxisData.counts,
          amount: yAxisData.amouts
        },
        legendNames: legendNames
      },
      date: getDateBefore(this.offset, this.filterType)
    });
  }

  componentDidMount() {
    //获得门店列表的数据
    getStoreList().then((storeList) => {
      this.setState({
        storeList: storeList
      });
      //取第一家店铺的storeId
      let storeId = storeList[0].storeId;
      this.fetchParams = [{storeId: storeId, offset: this.offset}, {storeId: storeId, offset: this.offset + 1}];
      this.legendNames = ["今日订单量", "今日营业额", "昨日订单量", "昨日营业额"];
      this.doQuery();
    });

    store.emitter.on("setSelectedStore", this._storeHandler, this);

  }

  componentWillUnmount() {
    store.emitter.off("setSelectedStore", this._storeHandler);
  }

  _storeHandler(storeList) {
    if( storeList.length == 0 ){
      return error("请至少选择一个门店");
    }

    if (storeList.length > 3) {
      return error("门店最多只能选3个");
    }

    actions.hideStoreSelector();

    let self = this;
    this.compareType = 2;
    this.fetchParams = [];
    this.legendNames = [];
    storeList.forEach((store) => {
      self.fetchParams.push({
        storeId: store.storeId,
        offset: 0
      });
      self.legendNames.push(`${store.name}订单量`, `${store.name}营业额`);
    });

    this.doQuery();

    //多门店对比时隐藏环比功能
    this.setState({
      hideDiff: true
    });
  }

  showStoreList() {
    actions.showStoreSelector();
    this.refs.charts.hideToolTip();
  }

  setOffset(offset) {
    let self = this;
    this.fetchParams.forEach((item, i) => {
      self.fetchParams[i].offset = offset + ( self.compareType == 1 ? i : 0 );
    });
  }

  doQuery() {
    let self = this;
    this.setOffset(this.offset);
    return self.fetchGroupData(self.fetchParams).then((values) => {
      self.setData(values, self.legendNames);
      self.refs.charts.refresh();
    });
  }

  queryPrev() {
    this.offset += 1;
    this.setState({
      isNextDisabled: false
    });
    this.doQuery();
  }

  queryNext() {
    if (this.offset == 0) {
      return;
    }
    this.offset = Math.max(0, --this.offset);
    if (this.offset == 0) {
      this.setState({
        isNextDisabled: true
      });
    }
    this.doQuery();
  }

  handleFilterItemClick(filterType) {
    //切换筛选类型时将offset置为0
    this.offset = 0;
    this.filterType = filterType;
    this.doQuery();
  }

  toggleDiff() {
    this.setState({
      diffDisabled: !this.state.diffDisabled
    }, () => this.refs.charts.toggleDiff(this.state.diffDisabled));
  }

  render() {
    return (
      <div>
        {
          !this.state.isDataLoaded ? "" :
            <div>
              <Stats statsData={this.state.statsData}>
              </Stats>
              <DateNavigator
                showStoreList={this.showStoreList.bind(this)}
                date={this.state.date}
                timelines={this.state.timelines}
                nextDisabled={this.state.isNextDisabled}
                diffDisabled={this.state.diffDisabled}
                hideDiff={this.state.hideDiff}
                defaultFilterType={this.filterType}
                onPrev={this.queryPrev.bind(this)}
                onNext={this.queryNext.bind(this)}
                onItemClick={this.handleFilterItemClick.bind(this)}
                toggleDiff={this.toggleDiff.bind(this)}
              >
              </DateNavigator>
              <Charts ref="charts"
                      statsData={this.state.statsData}
                      chartData={this.state.chartData}
              >
              </Charts>
            </div>
        }
      </div>
    )

  }
}

module.exports = Page;