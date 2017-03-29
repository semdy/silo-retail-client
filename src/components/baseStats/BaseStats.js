require('./BaseStats.styl');

import Base from '../../components/base';
import Stats from '../../components/stats';
import reactMixin from 'react-mixin';
import store from  '../../app/store';
import {getStoreStats} from '../../services/store';
import {genStatsData} from '../../utils';

class BaseStatus extends Base {

  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      data: []
    };
    this.fieldList = [];
  }

  fetch() {
    let {store, offset} = this.state;
    getStoreStats(store.storeId, offset, offset, this.fieldList).then((res) => {
      this.setState({
        loaded: true,
        data: genStatsData(res.data, this.fieldList)
      });
    });
  }

  render() {
    let {loaded, data} = this.state;
    return (
      //loaded &&
      <Stats data={data}/>
    );
  }
}

reactMixin.onClass(BaseStatus, Reflux.connect(store));

module.exports = BaseStatus;