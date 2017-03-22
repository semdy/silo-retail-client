import './Payment.styl';

import Stats from '../../components/stats';
import PieChart from '../../components/piechart';
import DateNavigator from '../../components/datenavigator';
import Table from '../../components/table';
import actions from '../../app/actions';
import store from '../../app/store';
import {getStoreList, getStoreChartReport, getStoreStats} from '../../services/store';
import locale from '../../locale';


//获取距离今天指定日期对象
const getDateBefore = (offset) => {
  let date = new Date();
  date.setDate(date.getDate() - offset);
  return date;
};

//生成table datagrid标准的数据格式
const genTableRows = (series) => {
  let res = [];
  series.forEach((item) => {
    res.push({
      name: item.name,
      count: item.value[0],
      money: item.params.money
    });
  });

  return res;
};

//生成统计的标准的数据格式
const genStatsData = (statsData) => {
  let res = [];
  statsData.forEach((stats) => {
    res.push({
      name: locale.stats.title[stats.field],
      value: stats.value,
      suffix: locale.stats.unit[stats.field]
    });
  });

  return res;
};

class Page extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isDataLoaded: false,
      isNextDisabled: true,
      date: new Date(),
      storeName: '',
      statsData: [],
      chartData: {},
      tableRows: []
    };

    this.currStore = {};
    this.offset = 0;

    this.tableFields = [
      {
        field: 'rowNumber',
        width: 18
      },
      {
        field: 'name',
        name: locale.settleWay,
        flex: 1
      },
      {
        field: 'count',
        name: locale.singularQuantity,
        flex: 1
      },
      {
        field: 'money',
        name: locale.amount,
        flex: 1,
        formatter: function (value) {
          return value + locale.yuan;
        }
      }
    ];
  }

  setData(statsData, charts) {
    this.setState({
      isDataLoaded: true,
      chartData: charts,
      storeName: this.currStore.name,
      date: getDateBefore(this.offset),
      tableRows: genTableRows(charts.series),
      statsData: genStatsData(statsData)
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
      getStoreStats(storeId, this.offset, 0, ['pay', 'promo']),
      getStoreChartReport(storeId, this.offset, 'retail.trade.payment.mode')
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
    let {isDataLoaded, statsData, chartData, date, tableRows, storeName, isNextDisabled} = this.state;
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
                      chartName={locale.payments}
                      chartData={chartData}
                      radius={['37%', '52%']}
            >
            </PieChart>
            <Table fields={this.tableFields} rows={tableRows}/>
          </div>
        }
      </div>
    )

  }
}

module.exports = Page;