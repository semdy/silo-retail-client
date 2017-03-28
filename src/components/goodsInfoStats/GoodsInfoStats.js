require('./GoodsInfoStats.styl');

import BaseStatus from '../../components/baseStats';

class GoodsInfoStats extends BaseStatus {

  constructor(props) {
    super(props);
    this.fieldList = ['pay', 'promo'];
  }
}

module.exports = GoodsInfoStats;