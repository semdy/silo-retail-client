import './Distribution.styl';

import Stats from '../../components/stats';
import PieChart from '../../components/piechart';
import DateNavigator from '../../components/datenavigator';
import actions from '../../app/actions';
import store from '../../app/store';
import {getStoreList, getStoreChartReport, getStoreStats} from '../../services/store';
import {getDateBefore, genTableRows, genStatsData} from '../../utils';
import locale from '../../locale';

class Page extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isDataLoaded: false,
      isNextDisabled: true,
      date: new Date(),
      storeName: '',
      statsData: [],
      chartData: {}
    };

    this.currStore = {};
    this.offset = 0;
  }

  setData(statsData, charts) {
    this.setState({
      isDataLoaded: true,
      chartData: charts,
      storeName: this.currStore.name,
      date: getDateBefore(this.offset),
      tableRows: genTableRows(charts.series),
      statsData: genStatsData(statsData),
    });
  }

  componentDidMount() {
    //获得门店列表的数据
    getStoreList().then((storeList) => {
      //取第一家店铺的storeId
      this.currStore = storeList[0];
      this.doQuery();
    });

    store.emitter.on("setSelectedStore", this._selectHandler, this);

  }

  componentWillUnmount() {
    store.emitter.off("setSelectedStore", this._selectHandler);
  }

  _selectHandler(storeList) {

    actions.hideStoreSelector();

    if (storeList.length == 0) return;

    this.currStore = storeList[0];
    this.offset = 0;
    this.doQuery();
  }

  doQuery() {
    let storeId = this.currStore.storeId;

    Promise.all([
      getStoreStats(storeId, this.offset, this.offset, ['order', 'money']),
      getStoreChartReport(storeId, this.offset, 'retail.trade.shipment.type')
    ]).then((values) => {
      this.setData(values[0].data, values[1]);
      this.refs.charts.refresh();
    });
  }

  queryPrev() {
    this.offset += 1;
    this.setState({
      isNextDisabled: false
    });
    this.doQuery();
  }

  queryNext() {
    if (this.offset == 0) {
      return;
    }
    this.offset = Math.max(0, --this.offset);
    if (this.offset == 0) {
      this.setState({
        isNextDisabled: true
      });
    }
    this.doQuery();
  }

  render() {
    let {isDataLoaded, statsData, chartData, date, storeName, isNextDisabled} = this.state;
    return (
      <div>
        {
          isDataLoaded &&
          <div>
            <Stats data={statsData}/>
            <DateNavigator
              date={date}
              nextDisabled={isNextDisabled}
              storeName={storeName}
              onPrev={this.queryPrev.bind(this)}
              onNext={this.queryNext.bind(this)}
            >
            </DateNavigator>
            <PieChart ref="charts"
                      chartName={locale.deliveries}
                      chartData={chartData}
                      responsive={true}
                      visible={chartData.series.length > 0}
            >
            </PieChart>
          </div>
        }
      </div>
    )

  }
}

module.exports = Page;