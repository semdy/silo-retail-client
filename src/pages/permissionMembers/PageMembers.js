require('./PageMembers.styl');

let {Toast, Button, Icon} = SaltUI;

import actions from '../../app/actions';
import ButtonGroup from '../../components/ButtonGroup';
import Empty from '../../components/empty';
import ListItem from '../../components/listitem';
import {authorityUserList, authorityRemove} from '../../services/store';
import utils from '../../utils';
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
    authorityUserList().then((data) => {
      this.setState({
        data: data,
        loaded: true
      });
    }, (err) => {
      Toast.error("authorityUserList error: " + err);
    });
  }

  componentWillUnmount() {
    //隐藏header
    actions.hideHeader();
  }

  doRemove(userId, index) {
    authorityRemove(userId).then((res) => {
      if (res.result == 0) {
        this.state.data[index].removed = true;
        this.setState({
          data: this.state.data
        }, () => {
          Toast.success(locale.removeSuccess);
        });
      } else {
        Toast.error(locale.removeError);
      }
    }, (err) => {
      Toast.error(err);
    });
  }

  handleRemove(userId, index) {
    utils.ask(locale.confirm).then(() => {
      this.doRemove(userId, index);
    });
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
                    <span className="group-item-text t-FB1">{item.realName}</span>
                    {
                      item.removed ?
                        <span className="apply-status refused">
                      <Icon name="minus-circle" width={18} height={18}>
                      </Icon>
                          {locale.removed}
                      </span>
                        :
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

module.exports = Members;