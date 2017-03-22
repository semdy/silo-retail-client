require('./PageRecord.styl');

let {Toast, Button} = SaltUI;

import actions from '../../app/actions';
import ListItem from '../../components/listitem';
import Empty from '../../components/empty';
import {authorityApplyRecord} from '../../services/store';
import classNames from 'classnames';
import locale from '../../locale';

class Record extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loaded: false
    };
  }

  componentDidMount() {
    //显示header并设置标题
    actions.showHeader(locale.permission.record);
    this.doRequest();
  }

  doRequest() {
    authorityApplyRecord().then((res) => {
      this.setState({
        data: res.data,
        loaded: true
      });

    }, (err) => {
      Toast.error("error: " + err);
    });
  }

  componentWillUnmount() {
    //隐藏header
    actions.hideHeader();
  }

  render() {
    let {loaded, data} = this.state;
    return (
      <div className="permission-record">
        <div className="group-wrapper">
          {
            loaded && (
              data.length > 0 ? data.map((item, i) => {
                  return (
                    <ListItem key={i}>
                      <span className="group-item-text t-FB1">{item.authParamStr}</span>
                      <span className={classNames("apply-status", {
                        ok: item.status == 0,
                        refused: item.status == 1,
                        wait: item.status == 2
                      })}>
                  {
                    item.status == 0 ? locale.agreed : ( item.status == 1 ? locale.refused : locale.waiting )
                  }
                </span>
                    </ListItem>
                  )
                })
                :
                <Empty>
                  {locale.noAppliedRecord}
                </Empty>
            )
          }
        </div>
        <div className="permission-record-actions t-PT16 t-PB16 t-PL16 t-PR16">
          <Button type="primary" onClick={this.doRequest.bind(this)}>
            {locale.refresh}
          </Button>
        </div>
      </div>
    );
  }
}

module.exports = Record;
