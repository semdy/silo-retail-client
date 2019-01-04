import './PassflowStats.styl';

import React from 'react';
import BaseStatus from '../../components/baseStats';
import {getReportPayment} from '../../services/store';
import Circleloader from '../../components/circleloader';
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
      let count = res.data.sum.count;
      let traffic = res.data.sum.traffic;
      let percent = traffic === 0 ? 0 : Math.min(1, count/traffic);
      let data = [{
        name: locale.orderCount+ "/" +locale.traffic,
        value: `<div class="passflow-ratio"><span class="super">${count}</span><span class="sub">${traffic}</span></div>`
      }, {
        name: locale.convertRatio,
        value: <Circleloader percent={percent}/>
      }];

      this.setState({
        loaded: true,
        data: data
      });
    });

  }

}

module.exports = PassFlowStats;
