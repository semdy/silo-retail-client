require('./PageApproval.styl');

let {Toast, Button, Icon} = SaltUI;

import ButtonGroup from '../../components/ButtonGroup';
import Header from '../../components/header';
import ListItem from '../../components/listitem';
import {authorityApproval, authorityApprove} from '../../services/store';
import locale from '../../locale';

class Approval extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  componentDidMount() {
    authorityApproval().then((data) => {
      this.setState({
        data: data
      });
    }, (err) => {
      Toast.error("error: " + err);
    });
  }

  handleApproval(applyId, agreed, index) {
    authorityApprove(applyId, agreed).then((res) => {
      if (res.result == 0) {
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
    let {data} = this.state;
    return (
      <div className="permission-approval">
        <Header>{locale.permission.approval}</Header>
        <div className="group-wrapper">
          {
            data.length > 0 && data.map((item, i) => {
              return (
                <ListItem key={i}>
                  <span className="group-item-text t-FB1">{item.applicant}</span>
                  {
                    item.agreed === true ?
                      <span className="apply-status ok">
                        <Icon name="check" width={18} height={18}>
                        </Icon>
                        {locale.agreed}
                      </span>
                      :
                      ( item.agreed == false ?
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
          }
        </div>
      </div>
    );
  }
}

module.exports = Approval;
