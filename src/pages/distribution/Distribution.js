import './Distribution.styl';

let {Toast} = SaltUI;
import Stats from '../../components/stats';
import PieChart from '../../components/piechart';
import DateNavigator from '../../components/datenavigator';
import actions from '../../app/actions';
import store from '../../app/store';
import {getStoreList, getStoreChartReport} from '../../services/store';
import locale from '../../locale';


//获取距离今天指定日期对象
const getDateBefore = (offset) => {
  let date = new Date();
  date.setDate(date.getDate() - offset);
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

class Page extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isDataLoaded: false,
      activeIndex: 1,
      isNextDisabled: true,
      date: null,
      storeName: '',
      statsData: [],
      chartData: {}
    };

    this.currStore = {};
    this.offset = 0;
  }

  setData(charts) {
   /* const count = getGroupSum(values, "count");
    const amout = getGroupSum(values, "rmb");*/

    this.setState({
      isDataLoaded: true,
      chartData: charts,
      storeName: this.currStore.name,
      date: getDateBefore(this.offset),
      statsData: [
        {
          name: "门店订单量",
          suffix: "单",
          value: 100,
          subAmount: 22984
        },
        {
          name: "线上订单量",
          suffix: "单",
          value: 60,
          subAmount: 29840
        }
      ]
    });
  }

  componentDidMount() {
    //获得门店列表的数据
    getStoreList().then((storeList) => {
      //取第一家店铺的storeId
      this.currStore = storeList[0];
      this.doQuery();
    });

    store.emitter.on("setSelectedStore", this._selectHandler, this);

  }

  componentWillUnmount() {
    store.emitter.off("setSelectedStore", this._selectHandler);
  }

  _selectHandler(storeList) {
    if (storeList.length > 3) {
      return Toast.error("门店最多只能选3个");
    }

    actions.hideStoreSelector();

    if (storeList.length == 0) return;

    this.currStore = storeList[0];
    this.offset = 0;
    this.doQuery();
  }

  doQuery() {
    getStoreChartReport(this.currStore.storeId, this.offset, 'retail.trade.shipment.type').then((charts) => {
      this.setData(charts);
      this.refs.charts.refresh();
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

  render() {
    let {isDataLoaded, statsData, chartData, date, storeName, isNextDisabled} = this.state;
    return (
      <div>
        {
          isDataLoaded &&
          <div>
            <Stats data={statsData}>
            </Stats>
            <DateNavigator
              date={date}
              nextDisabled={isNextDisabled}
              storeName={storeName}
              onPrev={this.queryPrev.bind(this)}
              onNext={this.queryNext.bind(this)}
            >
            </DateNavigator>
            <PieChart ref="charts"
                      chartName={locale.deliveryType}
                      chartData={chartData}
            >
            </PieChart>
          </div>
        }
      </div>
    )

  }
}

module.exports = Page;