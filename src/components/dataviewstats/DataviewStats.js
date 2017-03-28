require('./DataviewStats.styl');

import BaseStatus from '../../components/baseStats';
import {fetchReportPayment} from '../../services/store';
import locale from '../../locale';

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

class DataviewStats extends BaseStatus {

  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      data: []
    };

    this.fetchParams = [{storeId: null, offset: 0}, {storeId: null, offset: 0}];
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

    if (!Array.isArray(groupPrams))
      throw new Error("fetchGroupData arguments must be typeof Array!");

    let fetches = groupPrams.map(item => this.fetchData(item.storeId, item.offset));

    return new Promise((resolve) => {
      Promise.all(fetches).then((values) => {
        resolve(values);
      });
    })
  }

  setParams(storeId, offset) {
    this.fetchParams.forEach((item, i) => {
      this.fetchParams[i].offset = offset + i;
      this.fetchParams[i].storeId = storeId;
    });
  }

  setData(values) {
    const count = getGroupSum(values, "count");
    const amout = getGroupSum(values, "rmb");

    this.setState({
      loaded: true,
      data: [
        {
          name: locale.totalOrder,
          suffix: locale.orderSuffix,
          value: count
        },
        {
          name: locale.totalAmount,
          suffix: getAmoutSuffix(amout),
          value: formatAmout(amout)
        }
      ]
    });
  }

  /**
   * @override
   */
  fetch() {
    let {store, offset} = this.state;
    this.setParams(store.storeId, offset);
    return this.fetchGroupData(this.fetchParams).then((values) => {
      this.setData(values);
    });
  }

}

module.exports = DataviewStats;