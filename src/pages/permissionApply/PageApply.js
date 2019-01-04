import './PageApply.styl';

import React from 'react';
import {Button, Toast} from 'saltui';
import actions from '../../app/actions';
import SearchBar from '../../components/searchbar';
import ListItem from '../../components/listitem';
import ButtonGroup from '../../components/ButtonGroup';
import ScrollLoader from '../../components/scrollLoader';
import Empty from '../../components/empty';
import {storeSearch, authorityApply} from '../../services/store';
import classNames from 'classnames';
import locale from '../../locale';

class Apply extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loaded: false,
      container: window
    };
    this.keyword = '';
  }

  componentDidMount() {
    //显示header并设置标题
    actions.showHeader(locale.permission.apply);
    //禁用下拉刷新
    actions.setP2rEnabled(false);
    this.doSearch(this.keyword);
    this.setState({
      container: this.refs.container
    });
  }

  componentWillUnmount() {
    //隐藏header
    actions.hideHeader();
    //启用用下拉刷新
    actions.setP2rEnabled(true);
  }

  doSearch(keyword) {
    this.keyword = keyword;
    storeSearch(keyword).then((res) => {
      this.setState({
        data: res.data,
        loaded: true
      });
    }, (err) => {
      Toast.error(err);
    }).finally(() => {
      actions.hideLoadMore();
    });
  }

  handleApply(storeId, index) {
    authorityApply(storeId).then((res) => {
      if (res.result === 0 || res.result === undefined) {
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

  handleSearch(value) {
    this.doSearch(value);
  }

  handleLoader() {
    this.doSearch(this.keyword);
  }

  render() {
    let {loaded, data, container} = this.state;
    return (
      <div className="permission-apply">
        <SearchBar placeholder={locale.searchStorePlaceholder}
                   onSearch={this.handleSearch.bind(this)}
        >
        </SearchBar>
        <div ref="container" className="group-wrapper">
          <ScrollLoader container={container} onReach={this.handleLoader.bind(this)}>
            {
              loaded && (
                data.length > 0 ? data.map((item, i) => {
                    return (
                      item.progress === 'normal' &&
                      <ListItem key={i}>
                        <span className="group-item-text t-FBH t-FB1 t-FBAC">{item.name}</span>
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
              )
            }
          </ScrollLoader>
        </div>
      </div>
    );
  }
}

module.exports = Apply;
