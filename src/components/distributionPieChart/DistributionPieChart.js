require('./DistributionPieChart.styl');

import BasePieChart from '../basePieChart';
import locale from '../../locale';

class DistributionPieChart extends BasePieChart {

  constructor(props) {
    super(props);
    this.queryKey = 'retail.trade.shipment.type';
    this.chartProps = {
      responsive: true,
      chartName: locale.deliveries
    };
  }
}

module.exports = DistributionPieChart;