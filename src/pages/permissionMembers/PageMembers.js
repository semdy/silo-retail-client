require('./PageMembers.styl');

let {Toast, Button, Icon} = SaltUI;

import Header from '../../components/header';
import ButtonGroup from '../../components/ButtonGroup';
import ListItem from '../../components/listitem';
import {authorityUserList, authorityRemove} from '../../services/store';
import locale from '../../locale';

class Members extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  componentDidMount() {
    authorityUserList().then((data) => {
      this.setState({
        data: data
      });
    }, (err) => {
      Toast.error("error: " + err);
    });
  }

  handleRemove(userId, index) {
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

  render() {
    let {data} = this.state;
    return (
      <div className="permission-record">
        <Header>本店成员</Header>
        <div className="group-wrapper">
          {
            data.length > 0 && data.map((item, i) => {
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
          }
        </div>
      </div>
    );
  }
}

module.exports = Members;
