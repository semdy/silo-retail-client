require('./PageIndex.styl');

let {Button} = SaltUI;
let {hashHistory} = ReactRouter;
import actions from '../../app/actions';
import Empty from '../../components/empty';
import {getStoreList} from '../../services/store';
import locale from '../../locale';

class Index extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      show: false
    };
  }

  componentDidMount() {
    //禁用下拉刷新
    actions.setP2rEnabled(false);
    getStoreList().then(() => {
      hashHistory.replace('/report.survey');
    }, () => {
      this.setState({
        show: true
      });
    });
  }

  componentWillUnmount() {
    //启用下拉刷新
    actions.setP2rEnabled(true);
  }

  render() {
    return (
      <div>
        {
          this.state.show &&
          <Empty>
            {locale.noAssignStores}
            <div className="t-MT12">
              <Button type="primary"
                      onClick={hashHistory.replace.bind(null, '/permission.apply')}
              >
                {locale.go2Apply}
              </Button>
            </div>
            <div className="t-MT12">
              <Button type="minor"
                      onClick={hashHistory.replace.bind(null, '/permission.record')}
              >
                {locale.viewRecord}
              </Button>
            </div>
          </Empty>
        }
      </div>
    );
  }
}

module.exports = Index;
