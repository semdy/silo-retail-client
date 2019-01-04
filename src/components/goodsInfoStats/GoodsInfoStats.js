import './GoodsInfoStats.styl';

import BaseStatus from '../../components/baseStats';

class GoodsInfoStats extends BaseStatus {

  constructor(props) {
    super(props);
    this.fieldList = ['sku.sale.count', 'sku.refund.count'];
  }
}

module.exports = GoodsInfoStats;
