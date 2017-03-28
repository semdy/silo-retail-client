require('./GoodsInfoBarChart.styl');

import BaseBarChart from '../baseBarChart';
import locale from '../../locale';

class GoodsInfoBarChart extends BaseBarChart {

  constructor(props) {
    super(props);
    this.queryKey = 'retail.sku.apr.distribute';
    this.chartProps.chartName = locale.distribute;
  }
}

module.exports = GoodsInfoBarChart;