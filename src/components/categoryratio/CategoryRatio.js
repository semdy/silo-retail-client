require('./Categoryratio.styl');

import PieChart from '../../components/piechart';
import {getStoreChartReport} from '../../services/store';
import locale from '../../locale';

class Categoryratio extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      chartData: {}
    };
  }

  componentDidMount() {
    this.doQuery();
  }

  doQuery() {
    getStoreChartReport(this.props.storeId, this.props.offset, 'retail.sku.cate.distribute').then((res) => {
      this.setState({
        chartData: res
      });
      this.refs.charts.refresh();
    });
  }

  componentWillReceiveProps(nextProps) {
    if( nextProps.offset != this.props.offset || nextProps.storeId != this.props.storeId ){
      this.doQuery();
    }
  }

  render() {
    return (
      <PieChart ref="charts"
                chartName={locale.categoryRatio}
                chartData={this.state.chartData}
                radius={['37%', '52%']}
      >
      </PieChart>
    );
  }
}

module.exports = Categoryratio;
