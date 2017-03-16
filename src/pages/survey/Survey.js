import './Survey.styl';
import {getStoreList} from '../../services/store';
import {getStoreChartReport} from '../../services/survey';
import Item from './Item';

class Index extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: {},
      loaded: false
    };
  }

  componentDidMount() {
    let self = this;
    getStoreList().then(function (storeList) {
      let storeId = storeList[0].storeId;
      getStoreChartReport(storeId).then(function (data) {
        data.series = self._setDataGroup(data.series);
        self.setState({
          data: data,
          loaded: true
        });
      });
    });
  }

  /**
   * 将数组两两分组，如果是奇数个，最后一个单独一组
   * */
  _setDataGroup(series) {
    let ret = [];
    let lenRemain = series.length%2;
    for(var i=0, len = series.length - lenRemain; i < len; i++){
      if( i%2 == 0 )
        ret.push([
          series[i],
          series[i + 1]
        ]);
    }

    if( lenRemain > 0 ){
      ret.push([
        series[series.length - 1]
      ]);
    }

    return ret;
  }

  render() {
    let {loaded} = this.state;
    let {series, legend} = this.state.data;
    return (
      <div className="survey-container">
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
