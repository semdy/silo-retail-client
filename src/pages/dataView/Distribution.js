require('./Distribution.styl');

let {Context} = SaltUI;
import store from '../../app/store';
import actions from '../../app/actions';
import {getStoreList} from '../../services/store';
import {getStoreChartReport} from '../../services/survey';
import locale from '../../locale';

class Distribution extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {
    let self = this;
    let timeout;
    this.chartInstance = echarts.init(this.refs.chart);
    this.resizeHandler = () => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        self.chartInstance.resize();
      }, 50);
    };

    window.addEventListener(Context.RESIZE, this.resizeHandler, false);

    getStoreList().then((storeList) => {
      this.fetchData(storeList[0].storeId);
    });

    store.emitter.on("setSelectedStore", this._storeHandler, this);

  }

  componentWillUnmount() {
    store.emitter.off("setSelectedStore", this._storeHandler);
  }

  _storeHandler(storeList) {
    actions.hideStoreSelector();
    if( storeList.length > 0 ){
      this.fetchData(storeList[0].storeId);
    }
  }

  fetchData(storeId){
    getStoreChartReport(storeId, 'retail.trade.shipment.type').then((charts) => {
      this.setOption(charts);
    });
  }

  setOption(charts){
    this.chartInstance.clear();

    let chartOptions = {
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      legend: {
        x: 'center',
        data: charts.legend.data
      },
      series: [
        {
          name: locale.deliveryType,
          type: 'pie',
          radius: ['50%', '75%'],
          data: charts.series
        }
      ]
    };
    this.chartInstance.setOption(chartOptions);
  }

  render() {
    return (
      <div className="card distribution">
        <div ref="chart" className="distribute-chart"></div>
        <div className="distribute-title">
         {locale.deliveryType}
        </div>
      </div>
    );
  }
}

module.exports = Distribution;
