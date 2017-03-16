require('./PageRecord.styl');

let {Toast} = SaltUI;

import Header from '../../components/header';
import ListItem from '../../components/listitem';
import {authorityApplyRecord} from '../../services/store';
import classNames from 'classnames';
import locale from '../../locale';

class Record extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  componentDidMount() {
    authorityApplyRecord().then((res) => {
      this.setState({
        data: res.data
      });
    }, (err) => {
      Toast.error("error: " + err);
    });
  }

  render() {
    let {data} = this.state;
    return (
      <div className="permission-record">
        <Header>{locale.permission.record}</Header>
        <div className="group-wrapper">
          {
            data.length > 0 && data.map((item, i) => {
              return (
                <ListItem key={i}>
                  <span className="group-item-text t-FB1">{item.authParamStr}</span>
                  <span className={classNames("apply-status", {ok: item.status==0, refused: item.status==1, wait: item.status==2})}>
                    {
                      item.status == 0 ? locale.agreed : ( item.status == 1 ? locale.refused : locale.waiting )
                    }
                  </span>
                </ListItem>
              )
            })
          }
        </div>
      </div>
    );
  }
}

module.exports = Record;
