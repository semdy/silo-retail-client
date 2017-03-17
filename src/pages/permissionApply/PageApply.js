require('./PageApply.styl');

let {Button, Toast} = SaltUI;

import actions from '../../app/actions';
import SearchBar from '../../components/searchbar';
import ListItem from '../../components/listitem';
import ButtonGroup from '../../components/ButtonGroup';
import Empty from '../../components/empty';
import {storeSearch, authorityApply} from '../../services/store';
import classNames from 'classnames';
import locale from '../../locale';

class Apply extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  componentDidMount() {
    //显示header并设置标题
    actions.showHeader(locale.permission.apply);
    this.doSearch();
  }

  componentWillUnmount(){
    //隐藏header
    actions.hideHeader();
  }

  doSearch(keyword){
    storeSearch(keyword).then((res) => {
      this.setState({
        data: res.data
      });
    }, (err) => {
      Toast.error(err);
    });
  }

  handleApply(storeId, index) {
    authorityApply(storeId).then((res) => {
      if (res.result == 0) {
        this.state.data[index].disabled = true;
        this.setState({
          data: this.state.data
        }, () => {
          Toast.success(locale.applySuccess);
        });
      } else {
        Toast.error(locale.applyError);
      }
    }, (err) => {
      Toast.error(err);
    });
  }

  handleSearch(value){
    this.doSearch(value);
  }

  render() {
    let {data} = this.state;
    return (
      <div className="permission-apply">
        <SearchBar placeholder="请输入要查询的门店"
                   onSearch={this.handleSearch.bind(this)}
        >
        </SearchBar>
        <div className="group-wrapper">
          {
            data.length > 0 ? data.map((item, i) => {
              return (
                item.progress == 'normal' &&
                <ListItem key={i}>
                  <span className="group-item-text t-FB1">{item.name}</span>
                  <ButtonGroup half={true}>
                    <Button type="minor"
                            className={classNames("no-bg", {disabled: item.disabled})}
                            onClick={this.handleApply.bind(this, item.storeId, i)}
                    >
                      {item.disabled ? locale.applyWait : locale.apply}
                    </Button>
                  </ButtonGroup>
                </ListItem>
              )
            })
            :
            <Empty>
              {locale.noDataFound}
            </Empty>
          }
        </div>
      </div>
    );
  }
}

module.exports = Apply;
