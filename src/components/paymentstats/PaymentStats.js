import './PaymentStats.styl';

import BaseStatus from '../../components/baseStats';

class PaymentStats extends BaseStatus {

  constructor(props) {
    super(props);
    this.fieldList = ['pay', 'promo'];
  }
}

module.exports = PaymentStats;
