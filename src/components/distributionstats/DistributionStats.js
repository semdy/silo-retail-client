require('./DistributionStats.styl');

import BaseStatus from '../../components/baseStats';

class DistributionStats extends BaseStatus {

  constructor(props) {
    super(props);
    this.fieldList = ['trade.count', 'trade.money', 'trade.count.ol', 'trade.money.ol'];
  }
}

module.exports = DistributionStats;