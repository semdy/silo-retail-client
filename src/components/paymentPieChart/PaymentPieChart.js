require('./PaymentPieChart.styl');

import BasePieChart from '../basePieChart';
import locale from '../../locale';

class PaymentPieChart extends BasePieChart {

  constructor(props) {
    super(props);
    this.queryKey = 'retail.trade.payment.mode';
    this.chartProps.chartName = locale.payments;
  }
}

module.exports = PaymentPieChart;