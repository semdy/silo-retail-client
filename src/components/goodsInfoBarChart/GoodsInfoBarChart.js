require('./GoodsInfoBarChart.styl');

import BaseBarChart from '../baseBarChart';
import locale from '../../locale';

class GoodsInfoBarChart extends BaseBarChart {

  constructor(props) {
    super(props);
    this.queryKey = 'retail.sku.apr.distribute';
    this.chartProps = {
      chartName: locale.distribute,
      helpText: locale.distributeHelpText,
      yAxisName: locale.orderNum,
      xAxisName: locale.saleCount,
      suffix: locale.num
    };
  }
}

module.exports = GoodsInfoBarChart;