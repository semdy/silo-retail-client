import './Survey.styl';

import reactMixin from 'react-mixin';
import store from  '../../app/store';
import Base from '../../components/base';
import {getStoreChartReport} from '../../services/store';
import Item from './Item';
import Empty from '../../components/empty';
import locale from '../../locale';

class Survey extends Base {

  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      data: {}
    };
  }

  fetch() {
    let {store, offset} = this.state;
    getStoreChartReport(store.storeId, offset).then((data) => {
      data.series = this._setDataGroup(data.series);
      this.setState({
        data: data,
        loaded: true
      });
    });
  }

  /**
   * 将数组两两分组，如果是奇数个，最后一个单独一组
   * */
  _setDataGroup(series) {
    let ret = [];
    let lenRemain = series.length % 2;
    for (let i = 0, len = series.length - lenRemain; i < len; i++) {
      if (i % 2 === 0)
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
    let {loaded, data} = this.state;
    return (
      <div className="survey-container">
        {
          loaded && (
            data.series.length > 0 ? data.series.map((item, i) => {
              return (
                <Item data={item}
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

reactMixin.onClass(Survey, Reflux.connect(store));

module.exports = Survey;
