import './PassflowStats.styl';

import BaseStatus from '../../components/baseStats';
import {getReportPayment} from '../../services/store';
import locale from '../../locale';

class PassFlowStats extends BaseStatus {

  constructor(props) {
    super(props);
  }

  /**
   * @override
   */
  fetch() {
    let {store, offset, filterType} = this.state;
    getReportPayment(store.storeId, offset, `retail.payment.report.${filterType}`).then((res) => {
      let traffic = res.data.sum.traffic;
      let data = [{
        name: locale.traffic,
        value: `<span class="traffic-number">${traffic}</span>`
      }];

      this.setState({
        loaded: true,
        data: data
      });
    });

  }

}

module.exports = PassFlowStats;
