import './Survey.styl';
import store from '../../app/store';
import actions from '../../app/actions';
import {getStoreList} from '../../services/store';
import {getStoreChartReport} from '../../services/store';
import Item from './Item';
let {Toast} = SaltUI;

class Index extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: {},
      currStore: {},
      loaded: false
    };
    this._currStore = {};
  }

  componentDidMount() {
    getStoreList().then((storeList) => {
      this._currStore = storeList[0];
      let storeId = storeList[0].storeId;
      this.doRequest(storeId);
    });

    store.emitter.on("setSelectedStore", this._selectHandler, this);

  }

  doRequest(storeId) {
    getStoreChartReport(storeId).then((data) => {
      data.series = this._setDataGroup(data.series);
      this.setState({
        data: data,
        currStore: this._currStore,
        loaded: true
      });
    }, (err) => {
      Toast.error(err);
    });
  }


  componentWillUnmount() {
    store.emitter.off("setSelectedStore", this._selectHandler);
  }

  _selectHandler(storeList) {
    if (storeList.length > 3) {
      return Toast.error("门店最多只能选3个");
    }

    actions.hideStoreSelector();

    if (storeList.length == 0) return;

    this._currStore = storeList[0];
    this.doRequest(storeList[0].storeId);
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

  render() {
    let {loaded, currStore} = this.state;
    let {series, legend} = this.state.data;
    return (
      <div className="survey-container">
        {
          loaded &&
            <div className="panel survey-header t-FBH t-FBAC t-FBJC">
              {
                currStore.name + " - 今日数据"
              }
            </div>
        }
        {
          loaded && series.length > 0 && series.map((item, i) => {
            return (
              <Item legend={legend.data[1]}
                    data={item}
                    key={i}
              >
              </Item>
            )
          })
        }
      </div>
    );
  }
}

module.exports = Index;
