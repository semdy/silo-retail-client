import './GoodsInfo.styl';

let {Tab} = SaltUI;
import Stats from '../../components/stats';
import PieChart from '../../components/piechart';
import BarChart from '../../components/barchart';
import DateNavigator from '../../components/datenavigator';
import Table from '../../components/table';
import actions from '../../app/actions';
import store from '../../app/store';
import {getStoreList, getStoreChartReport, getStoreStats} from '../../services/store';
import {getDateBefore, genStatsData} from '../../utils';
import locale from '../../locale';

//生成table datagrid标准的数据格式
export const genTableRows = (series) => {
  let res = [];
  series.forEach((item) => {
    res.push({
      name: item.name,
      avgPrice: item.params.avg || 0,
      saleVolume: item.value[0],
      saleAmount: item.params.money
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
      top10DestData: [],
      top10AscData: [],
      categoryData: {},
      distributeData: {},
      tabActiveIndex: 0
    };

    this.currStore = {};
    this.offset = 0;
    this.queryChanged = false;

    this.tableFields = [
      {
        field: 'rowNumber',
        width: 18
      },
      {
        field: 'name',
        name: locale.productName
      },
      {
        field: 'avgPrice',
        name: locale.avgPrice,
        formatter: function (value) {
          return "￥" + value;
        }
      },
      {
        field: 'saleVolume',
        name: locale.saleVolume
      },
      {
        field: 'saleAmount',
        name: locale.saleAmount,
        formatter: function (value) {
          return "￥" + value;
        }
      }
    ];
  }

  setData(statsData, categoryData, distributeData) {
    this.setState({
      isDataLoaded: true,
      storeName: this.currStore.name,
      date: getDateBefore(this.offset),
      statsData: genStatsData(statsData),
      categoryData: categoryData,
      distributeData: distributeData
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
    store.emitter.on("getTop10Data", this.getTop10Data, this);

  }

  componentWillUnmount() {
    store.emitter.off("setSelectedStore", this._selectHandler);
    store.emitter.off("getTop10Data", this.getTop10Data);
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
      getStoreStats(storeId, this.offset, this.offset, ['pay', 'promo']), //统计数据
      getStoreChartReport(storeId, this.offset, 'retail.sku.cate.distribute'), //品类占比
      getStoreChartReport(storeId, this.offset, 'retail.sku.apr.distribute') //连带率分布
    ]).then((values) => {
      this.queryChanged = true;
      this.setData(values[0].data, values[1], values[2], values[3]);
      this.refs.ratioCharts.refresh();
      this.refs.distributeCharts.refresh();
    });

    this.getTop10Data(this.state.tabActiveIndex);

  }

  getTop10Data(activeIndex){
    if( activeIndex == 0 ){
      this.fetchTop10Dest();
    } else {
      this.fetchTop10Asc();
    }
  }

  //畅销TOP10
  fetchTop10Dest(){
    let storeId = this.currStore.storeId;
    getStoreChartReport(storeId, this.offset, 'retail.sku.rank.desc').then((res) => {
      this.setState({
        top10DestData: genTableRows(res.series),
        tabActiveIndex: 0
      });
    });
  }

  //滞销TOP10
  fetchTop10Asc(){
    let storeId = this.currStore.storeId;
    getStoreChartReport(storeId, this.offset, 'retail.sku.rank.asc').then((res) => {
        this.setState({
          top10AscData: genTableRows(res.series),
          tabActiveIndex: 1
        });
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

  handleTabChange(obj){
    if( this.queryChanged ) {
      store.emitter.emit("getTop10Data", obj.active);
    }

    this.queryChanged = false;

    this.setState({
      tabActiveIndex: obj.active
    });
  }

  render() {
    let {isDataLoaded, statsData, date, tabActiveIndex, categoryData, distributeData,
      top10DestData, top10AscData, storeName, isNextDisabled} = this.state;
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
            <Tab active={tabActiveIndex} onChange={this.handleTabChange.bind(this)}>
              <Tab.Item title={locale.rankDesc10}>
                <Table fields={this.tableFields} rows={top10DestData}/>
              </Tab.Item>
              <Tab.Item title={locale.rankAsc10}>
                <Table fields={this.tableFields} rows={top10AscData}/>
              </Tab.Item>
            </Tab>
            <PieChart ref="ratioCharts"
                      chartName={locale.categoryRatio}
                      chartData={categoryData}
                      radius={['37%', '52%']}
                      visible={categoryData.series.length > 0}
            >
            </PieChart>
            <BarChart ref="distributeCharts"
                      chartName={locale.distribute}
                      chartData={distributeData}
                      visible={distributeData.series.length > 0}
            >
            </BarChart>
          </div>
        }
      </div>
    )

  }
}

module.exports = Page;