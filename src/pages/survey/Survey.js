import './Survey.styl';
import store from '../../app/store';
import actions from '../../app/actions';
import {getStoreList} from '../../services/store';
import {getStoreChartReport, getStoreStats} from '../../services/store';
import Item from './Item';
import Empty from '../../components/empty';
import DateNavigator from '../../components/datenavigator';
import locale from '../../locale';
let {Toast} = SaltUI;

class Index extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: {},
      storeName: '',
      loaded: false
    };

    this.currStore = {};
    this.offset = 0;
  }

  componentDidMount() {
    getStoreList().then((storeList) => {
      this._currStore = storeList[0];
      this.doQuery();
      this.queryStats();
    });

    store.emitter.on("setSelectedStore", this._selectHandler, this);
    store.emitter.on("refresh", this.doQuery, this);
  }

  doQuery() {
    let storeId = this._currStore.storeId;
    getStoreChartReport(storeId, this.offset).then((data) => {
      data.series = this._setDataGroup(data.series);
      this.setState({
        data: data,
        storeName: this._currStore.name,
        loaded: true
      });
    }, (err) => {
      Toast.error(err);
    }).finally(() => {
      actions.hideP2R();
    });
  }

  queryStats(){
    let storeId = this._currStore.storeId;
   /* getStoreStats(storeId, this.offset + 6, this.offset, ['money', 'order']).then((res) => {
      this.setData(values[0].data, values[1]);
      this.refs.charts.refresh();
    })*/
  }

  componentWillUnmount() {
    store.emitter.off("setSelectedStore", this._selectHandler);
    store.emitter.off("refresh", this.doQuery);
  }

  _selectHandler(storeList) {

    actions.hideStoreSelector();

    if (storeList.length == 0) return;

    this._currStore = storeList[0];
    this.doQuery();
  }

  /**
   * 将数组两两分组，如果是奇数个，最后一个单独一组
   * */
  _setDataGroup(series) {
    let ret = [];
    let lenRemain = series.length % 2;
    for (var i = 0, len = series.length - lenRemain; i < len; i++) {
      if (i % 2 == 0)
        ret.push([
          series[i],
          series[i + 1]
        ]);
    }

    if (lenRemain > 0) {
      ret.push([
        series[series.length - 1]
      ]);
    }

    return ret;
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
    let {loaded, date, storeName, isNextDisabled} = this.state;
    let {series, legend} = this.state.data;
    return (
      <div className="survey-container">
        {
          loaded &&
          <DateNavigator
            date={date}
            nextDisabled={isNextDisabled}
            storeName={storeName}
            onPrev={this.queryPrev.bind(this)}
            onNext={this.queryNext.bind(this)}
          >
          </DateNavigator>
        }
        {
          loaded && (
            series.length > 0 ? series.map((item, i) => {
              return (
                <Item legend={legend.data[1]}
                      data={item}
                      key={i}
                >
                </Item>
              )
            })
            :
            <Empty>
              {locale.emptyData}
            </Empty>
          )
        }
      </div>
    );
  }
}

module.exports = Index;
