require('./GoodsInfoPieChart.styl');

import BasePieChart from '../basePieChart';
import locale from '../../locale';

class GoodsInfoPieChart extends BasePieChart {

  constructor(props) {
    super(props);
    this.queryKey = 'retail.sku.cate.distribute';
    this.chartProps.chartName = locale.categoryRatio;
  }
}

module.exports = GoodsInfoPieChart;