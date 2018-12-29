import './PageRecord.styl';

import {Toast, Button} from 'saltui';
import React from 'react';
import Reflux from 'reflux';
import reactMixin from 'react-mixin';
import store from  '../../app/store';
import actions from '../../app/actions';
import ListItem from '../../components/listitem';
import Empty from '../../components/empty';
import {authorityApplyRecord, fetchStoreList} from '../../services/store';
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

    //顺带刷新店铺列表
    fetchStoreList();
  }

  componentWillUnmount() {
    //隐藏header
    actions.hideHeader();
  }

  componentDidUpdate(prevProps, prevState) {
    let {refreshFlag} = this.state;
    if (prevState.refreshFlag !== refreshFlag )
    {
      this.doRequest();
    }
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
                      <span className="group-item-text t-FBH t-FB1 t-FBAC">{item.authParamStr}</span>
                      <span className={classNames("apply-status", {
                        ok: item.status === 0,
                        refused: item.status === 1,
                        wait: item.status === 2
                      })}>
                  {
                    item.status === 0 ? locale.agreed : ( item.status === 1 ? locale.refused : locale.waiting )
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
        {/*<div className="permission-record-actions t-PT16 t-PB16 t-PL16 t-PR16">
          <Button type="primary" onClick={this.doRequest.bind(this)}>
            {locale.refresh}
          </Button>
        </div>*/}
      </div>
    );
  }
}

reactMixin.onClass(Record, Reflux.connect(store));

module.exports = Record;
