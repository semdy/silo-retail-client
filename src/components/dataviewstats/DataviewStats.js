require('./DataviewStats.styl');

import BaseStatus from '../../components/baseStats';

class DataviewStats extends BaseStatus {

  constructor(props) {
    super(props);
    this.fieldList = ['trade.count', 'trade.money'];
    this.groupByMoney = true;
  }

}

module.exports = DataviewStats;