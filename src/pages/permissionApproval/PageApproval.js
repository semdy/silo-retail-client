require('./PageApproval.styl');

let {Toast, Button, Icon} = SaltUI;

import reactMixin from 'react-mixin';
import store from  '../../app/store';
import actions from '../../app/actions';
import ButtonGroup from '../../components/ButtonGroup';
import ListItem from '../../components/listitem';
import Empty from '../../components/empty';
import {authorityApproval, authorityApprove} from '../../services/store';
import locale from '../../locale';

class Approval extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loaded: false
    };
  }

  componentDidMount() {
    //显示header并设置标题
    actions.showHeader(locale.permission.approval);
    this.doRequest();
  }

  componentWillUnmount() {
    //隐藏header
    actions.hideHeader();
  }

  doRequest(){
    authorityApproval().then((data) => {
      this.setState({
        data: data,
        loaded: true
      });
    }, (err) => {
      Toast.error("error: " + err);
    });
  }

  componentDidUpdate(prevProps, prevState) {
    let {refreshFlag} = this.state;
    if (prevState.refreshFlag !== refreshFlag )
    {
      this.doRequest();
    }
  }

  handleApproval(applyId, agreed, index) {
    authorityApprove(applyId, agreed).then((res) => {
      if (res.result === 0) {
        this.state.data[index].agreed = agreed;
        this.setState({
          data: this.state.data
        }, () => {
          Toast.success(locale.approveSuccess);
        });
      } else {
        Toast.error(locale.approveError);
      }
    }, (err) => {
      Toast.error(err);
    });
  }

  render() {
    let {loaded, data} = this.state;
    return (
      <div className="group-wrapper permission-approval">
        {
          loaded && (
            data.length > 0 ? data.map((item, i) => {
                return (
                  <ListItem key={i}>
                    <span className="group-item-text t-FBH t-FB1 t-FBAC">{item.applicant}</span>
                    {
                      item.agreed === true ?
                        <span className="apply-status ok">
                      <Icon name="check" width={18} height={18}>
                      </Icon>
                          {locale.agreed}
                    </span>
                        :
                        ( item.agreed === false ?
                            <span className="apply-status refused">
                        <Icon name="minus-circle" width={18} height={18}>
                        </Icon>
                              {locale.refused}
                      </span>
                            :
                            <ButtonGroup half={true}>
                              <Button type="minor"
                                      className="no-bg"
                                      onClick={this.handleApproval.bind(this, item.applyId, true, i)}
                              >
                                {locale.agree}
                              </Button>
                              <Button type="minor"
                                      className="no-bg"
                                      onClick={this.handleApproval.bind(this, item.applyId, false, i)}
                              >
                                {locale.refuse}
                              </Button>
                            </ButtonGroup>
                        )
                    }
                  </ListItem>
                )
              })
              :
              <Empty>
                {locale.noApprovalData}
              </Empty>
          )
        }
      </div>
    );
  }
}

reactMixin.onClass(Approval, Reflux.connect(store));

module.exports = Approval;
