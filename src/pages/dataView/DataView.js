import './DataView.styl';

let { Toast } = SaltUI;
import ScrollNav from '../../components/ScrollNav';
import Stats from './Stats';
import Charts from './Charts';
import DateNavigator from './DateNavigator';
import StoreSelector from '../../components/StoreSelector';
import {httpRequestReportPayment, httpRequestStoreList} from '../../services/auth';

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
    case 'year':
      return new Date(time * 1000).getFullYear();
  }
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
    return value / 1e8;
  } else if (value / 1e4 >= 1) {
    return value / 1e4;
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
const genKeyMap = (times, counts, amouts) => {
  let map = {};
  times.forEach((time, index) => {
    map[formatTime(time, "hour") + "h"] = [counts[index], amouts[index]];
  });

  return map;
};

//生成二维数组的键值对(用于合并多组x轴数据)
const genGroupKeyMap = ( datas, cachData ) => {
  let map = {};
  datas.forEach((data) => {
    let itemMap = genKeyMap(data.axisX.time, data.axisY.count, data.axisY.rmb);
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
      statsData: [
        {
          name: "订单量",
          value: 0
        },
        {
          name: "营业额",
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
  }

  fetchData(storeId = defaultStoreId, offset) {
    return httpRequestReportPayment('retail.payment.report.hour', storeId, offset);
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
    
    return new Promise(function (resolve, reject) {
      Promise.all(fetches).then(function (values) {
        resolve(values);
        Toast.hide();
      }).catch(function (err) {
          reject(err);
          Toast.show({
              type: 'err',
              content: err
          });
      });

    })
  }

  setData( values, legendNames ){
    let cacheData = [];
    const count = getGroupSum(values, "count");
    const amout = getGroupSum(values, "rmb");
    const xAxisData = Object.keys( genGroupKeyMap(values, cacheData) ).sort((a, b)=>{return parseInt(a) - parseInt(b)});
    const yAxisData = extractYAxisData(zeroFill(cacheData, xAxisData));

    this.setState({
      isDataLoaded: true,
      statsData: [
        {
          name: "订单量",
          suffix: "单",
          value: count
        },
        {
          name: "营业额",
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
      date: getDateBefore(defaultOffset)
    });
  }

  componentDidMount() {
    this.fetchGroupData([{storeId: defaultStoreId, offset: defaultOffset},{storeId: defaultStoreId, offset: defaultOffset + 1}]).then(function (values) {
      var legendNames = ["今日订单量", "今日营业额", "昨日订单量", "昨日营业额"];
      this.setData(values, legendNames);
    }.bind(this));

    //获得门店列表的数据
    httpRequestStoreList().then(function (storeList) {
      this.setState({
        storeList: storeList
      });
    }.bind(this));
  }

  leftBarClickHandle() {
    alert("left click");
  }

  rightBarClickHandle() {
    if (this.state.isDataLoaded) {
      this.refs.storeSelector.show();
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

    let fetchParams = [];
    let legendNames = [];
    storeList.forEach((store) => {
      fetchParams.push({
        storeId: store.storeId,
        offset: 0
      });
      legendNames.push(`${store.storeName}订单量`, `${store.storeName}营业额`);
    });

    this.fetchGroupData(fetchParams).then(function (values) {
      this.setData(values, legendNames);
      this.refs.charts.setOption();
    }.bind(this));
  }

  render() {
    let components = "";
    if (this.state.isDataLoaded) {
      components = (
        <div>
          <Stats statsData={this.state.statsData}>
          </Stats>
          <DateNavigator date={this.state.date}>
          </DateNavigator>
          <StoreSelector ref="storeSelector"
             onConfirm={this.handleConfirm.bind(this)}
             data={this.state.storeList}
          >
          </StoreSelector>
          <Charts ref="charts" statsData={this.state.statsData}
                  chartData={this.state.chartData}>
          </Charts>
        </div>
      )
    }
    return (
      <div>
        <ScrollNav activeIndex={this.state.activeIndex}
                   showLeftBar={true}
                   showRightBar={true}
                   leftBarClick={this.leftBarClickHandle.bind(this)}
                   rightBarClick={this.rightBarClickHandle.bind(this)}>
        </ScrollNav>
        {components}
      </div>
    )

  }
}

module.exports = Page;
