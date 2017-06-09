require('./DataviewStats.styl');

import BaseStatus from '../../components/baseStats';
import {getReportPayment} from '../../services/store';
import {genStatsDataByMoney} from '../../utils';

class DataviewStats extends BaseStatus {

  constructor(props) {
    super(props);
    this.fieldList = ['trade.count', 'trade.money'];
  }

  /**
   * @override
   */
  fetch() {
    let {store, offset, filterType} = this.state;
    getReportPayment(store.storeId, offset, `retail.payment.report.${filterType}`).then((res) => {
      let data = [{
        field: this.fieldList[0],
        value: res.data.sum.count
      }, {
        field: this.fieldList[1],
        value: res.data.sum.rmb
      }];

      this.setState({
        loaded: true,
        data: genStatsDataByMoney(data, this.fieldList)
      });
    });

  }

}

module.exports = DataviewStats;