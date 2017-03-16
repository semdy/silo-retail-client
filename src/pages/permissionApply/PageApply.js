require('./PageApply.styl');

let {Button, Toast} = SaltUI;

import Header from '../../components/header';
import SearchBar from '../../components/searchbar';
import ListItem from '../../components/listitem';
import ButtonGroup from '../../components/ButtonGroup';
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
    this.doSearch();
  }

  doSearch(keyword){
    storeSearch(keyword).then((data) => {
      this.setState({
        data: data
      });
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
        <Header>{locale.permission.apply}</Header>
        <SearchBar placeholder="请输入要查询的门店"
                   onSearch={this.handleSearch.bind(this)}
        >
        </SearchBar>
        <div className="group-wrapper">
          {
            data.length > 0 && data.map((item, i) => {
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
          }
        </div>
      </div>
    );
  }
}

module.exports = Apply;
