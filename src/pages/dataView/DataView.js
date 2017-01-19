import './DataView.styl';

let { Toast, Button } = SaltUI;
import ScrollNav from '../../components/ScrollNav';
import Stats from './Stats';
import Charts from './Charts';
import DateNavigator from './DateNavigator';
import StoreSelector from '../../components/StoreSelector';
import {httpRequestReportPayment, httpRequestStoreList} from '../../services/storeService';

//默认时间间隔(单位：小时|天|月|年)
const defaultOffset = 0;
//默认门店ID
const defaultStoreId = 'Kp-FLKdBQmK-ctjDEF0XsQ';

//格式化时间
const formatTime = (time, bytype) => {
  switch (bytype) {
    case 'hour':
      return new Date(time * 1000).getHours();
    case 'day':
      return new Date(time * 1000).getDate();
    case 'week':
      return Math.ceil(new Date(time * 1000).getDate()/7);
    case 'month':
      return new Date(time * 1000).getMonth() + 1;
    case 'year':
      return new Date(time * 1000).getFullYear();
  }
};

const UNIT_MAP = {
  hour:   'h',
  day:   '日',
  week:  '周',
  month: '月',
  year:  '年'
};

//获取距离今天指定日期对象
const getDateBefore = (numDays) => {
  var now = new Date();
  now.setDate(now.getDate() - numDays);
  return now;
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
  var sum = 0;
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
const genGroupKeyMap = ( datas, cachData, formatType ) => {
  let map = {};
  datas.forEach((data) => {
    let itemMap = genKeyMap(data.axisX.time||[], data.axisY.count||[], data.axisY.rmb||[], formatType);
    if( cachData ) {
      cachData.push(itemMap);
    }
    for(let i in itemMap){
      if( map[i] === undefined ){
        map[ i ] = itemMap[ i ];
      }
    }
  });

  return map;
};

//没有数据的时间节点补零
const zeroFill = (targetData, timelines) => {
  targetData.forEach((data) => {
    timelines.forEach(function (timeline) {
      if( data[timeline] === undefined ){
        data[timeline] = [0, 0];
      }
    });
  });

  return targetData;
};

//提取y轴的订单量和营业额数据, 返回一个二维数组
const extractYAxisData = (dataMap) => {
  let counts = [];
  let amouts = [];
  dataMap.forEach((data) => {
    let count = [];
    let amout = [];
    for(let i in data) {
      count.push(data[ i ][ 0 ]);
      amout.push(data[ i ][ 1 ]);
    }
    counts.push(count);
    amouts.push(amout);
  });

  return {
    counts: counts,
    amouts: amouts,
  }
};

class Page extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isDataLoaded: false,
      activeIndex: 1,
      isNextDisabled: true,
      isFullScreen: false,
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
    this.filterUnit = 'hour';
    this.fetchParams = [];
    this.offset = defaultOffset;
    //统一约束： 为1时表示同一家门店今天和昨天数据对比， 为2时表示多家门店之间的数据对比
    this.compareType = 1;
  }

  fetchData(storeId = defaultStoreId, offset) {
    return new Promise((resolve, reject) => {
      httpRequestReportPayment(`retail.payment.report.${this.filterUnit}`, storeId, offset).then((res) =>{
        resolve(res);
      }, (err) => {
        reject(err);
        Toast.show({
          type: 'error',
          content: "服务器异常或没有数据 code: " + err.result
        });
      });
    });
  }

  fetchGroupData(groupPrams){

    if( !Array.isArray(groupPrams) )
      throw new Error("fetchGroupData arguments must be typeof Array!");

    let fetches = groupPrams.map(function (item) {
        return this.fetchData(item.storeId, item.offset);
    }.bind(this));

    Toast.show({
        type: 'loading',
        content: '拼命加载中...',
        autoHide: false
    });
    
    return new Promise(function (resolve) {
      Promise.all(fetches).then(function (values) {
        resolve(values);
        Toast.hide();
      });
    })
  }

  setData( values, legendNames ){
    let cacheData = [];
    const count = getGroupSum(values, "count");
    const amout = getGroupSum(values, "rmb");
    const xAxisData = Object.keys( genGroupKeyMap(values, cacheData, this.filterUnit) ).sort((a, b)=>{return parseInt(a) - parseInt(b)});
    const yAxisData = extractYAxisData(zeroFill(cacheData, xAxisData));

    this.setState({
      isDataLoaded: true,
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
      date: getDateBefore(this.offset)
    });
  }

  componentDidMount() {
    this.fetchParams = [{storeId: defaultStoreId, offset: this.offset},{storeId: defaultStoreId, offset: this.offset + 1}];
    this.legendNames = ["今日订单量", "今日营业额", "昨日订单量", "昨日营业额"];
    this.doQuery();

    //获得门店列表的数据
    httpRequestStoreList().then(function (storeList) {
      this.setState({
        storeList: storeList
      });
    }.bind(this));
  }

  showMenu() {
    alert("left click");
  }

  showStoreList() {
    if (this.state.isDataLoaded) {
      this.refs.storeSelector.show();
      this.refs.charts.hideToolTip();
    }
  }

  handleConfirm( storeList ) {
    if( storeList.length > 3 ){
        return Toast.show({
            type: 'error',
            content: "门店最多只能选3个"
        });
    }

    this.refs.storeSelector.hide();

    let self = this;
    this.compareType = 2;
    this.fetchParams = [];
    this.legendNames = [];
    storeList.forEach((store) => {
      self.fetchParams.push({
        storeId: store.storeId,
        offset: 0
      });
      self.legendNames.push(`${store.storeName}订单量`, `${store.storeName}营业额`);
    });

    this.doQuery();
  }

  setOffset(offset){
    let self = this;
    this.fetchParams.forEach((item, i) => {
      self.fetchParams[i].offset = offset + ( self.compareType == 1 ? i : 0 );
    });
  }

  doQuery(){
    let self = this;
    this.setOffset(this.offset);
    return self.fetchGroupData(self.fetchParams).then((values) => {
      self.setData(values, self.legendNames);
      self.refs.charts.refresh();
    });
  }

  queryPrev(){
    this.offset += 1;
    this.setState({
      isNextDisabled: false
    });
    this.doQuery();
  }

  queryNext(){
    if( this.offset == 0 ){
      return;
    }
    this.offset = Math.max(0, --this.offset);
    if( this.offset == 0 ) {
      this.setState({
        isNextDisabled: true
      });
    }
    this.doQuery();
  }

  changeViewMode(isFullScreen){
    this.setState({
      isFullScreen: isFullScreen
    });
  }

  handleFilterItemClick(filterType){
    this.filterUnit = filterType;
    this.doQuery();
  }

  render() {
    let components = "";
    if (this.state.isDataLoaded) {
      components = (
        <div>
          <Stats statsData={this.state.statsData}>
          </Stats>
          <DateNavigator
            isFullScreen={this.state.isFullScreen}
            showStoreList={this.showStoreList.bind(this)}
            date={this.state.date}
            disabled={this.state.isNextDisabled}
            onPrev={this.queryPrev.bind(this)}
            onNext={this.queryNext.bind(this)}
            onItemClick={this.handleFilterItemClick.bind(this)}
          >
          </DateNavigator>
          <StoreSelector ref="storeSelector"
             onConfirm={this.handleConfirm.bind(this)}
             data={this.state.storeList}
          >
          </StoreSelector>
          <Charts ref="charts" changeViewMode={this.changeViewMode.bind(this)}
                  statsData={this.state.statsData}
                  chartData={this.state.chartData}
          >
          </Charts>
        </div>
      )
    }
    return (
      <div>
        <ScrollNav activeIndex={this.state.activeIndex}
                   showLeftBar={true}
                   showRightBar={true}
                   leftBarClick={this.showMenu.bind(this)}
                   rightBarClick={this.showStoreList.bind(this)}>
        </ScrollNav>
        {components}
      </div>
    )

  }
}

module.exports = Page;
