import './PageMembers.styl';

import React from 'react';
import Reflux from 'reflux';
import {Toast, Button, Icon} from 'saltui';
import reactMixin from 'react-mixin';
import store from  '../../app/store';
import actions from '../../app/actions';
import ButtonGroup from '../../components/ButtonGroup';
import Empty from '../../components/empty';
import ListItem from '../../components/listitem';
import {authorityUserList, authorityRemove, getManager} from '../../services/store';
import * as utils from '../../utils';
import locale from '../../locale';

class Members extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loaded: false
    };
  }

  componentDidMount() {
    //显示header并设置标题
    actions.showHeader(locale.permission.members);
    this.doRequest();
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

  doRequest(){
    authorityUserList().then((data) => {
      this.setState({
        data: data,
        loaded: true
      });
    }, (err) => {
      Toast.error(`authorityUserList error: ${err}`);
    });

  }

  doRemove(userId, index) {
    authorityRemove(userId).then((res) => {
      this.setState({
        data: this.state.data.map((item, i) => {
          if (index === i) {
            return {...item, removed: true}
          } else {
            return item
          }
        })
      }, () => {
        Toast.success(locale.removeSuccess);
      });
    }, (err) => {
      Toast.error(`${locale.removeError}, ${err}`);
    });
  }

  handleRemove(userId, index) {
    utils.ask(locale.confirm).then(() => {
      this.doRemove(userId, index);
    }, () => {});
  }

  render() {
    let {loaded, data} = this.state;
    return (
      <div className="group-wrapper permission-members">
        {
          loaded && (
            data.length > 0 ? data.map((item, i) => {
                return (
                  <ListItem key={i}>
                    <span className="group-item-text t-FBH t-FB1 t-FBAC">{item.realName}</span>
                    {
                      item.removed ?
                        <span className="apply-status refused">
                          <Icon name="minus-circle" width={18} height={18}>
                          </Icon>
                          {locale.removed}
                        </span>
                        :
                        getManager().userId !== item.userId &&
                        <ButtonGroup half={true}>
                          <Button type="minor"
                                  className="no-bg"
                                  onClick={this.handleRemove.bind(this, item.userId, i)}
                          >
                            {locale.remove}
                          </Button>
                        </ButtonGroup>
                    }
                  </ListItem>
                )
              })
              :
              <Empty>
                {locale.noMembers}
              </Empty>
          )
        }
      </div>
    );
  }
}

reactMixin.onClass(Members, Reflux.connect(store));

module.exports = Members;
