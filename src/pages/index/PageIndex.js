import './PageIndex.styl';

import React from 'react';
import {Button, Toast} from 'saltui';
import {hashHistory} from 'react-router';
import dom from '../../utils/dom';
import Empty from '../../components/empty';
import {getStoreList, getAvailableNavs} from '../../services/store';
import locale from '../../locale';

class Index extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      show: false
    };
  }

  touchStartHandler(e) {
    e.stopPropagation();
  }

  componentDidMount() {
    getStoreList().then((storeList) => {
      if (storeList.length > 0) {
        //hashHistory.replace('/report.survey');
        let firstNav = getAvailableNavs()[0];
        if( firstNav ) {
          hashHistory.replace(firstNav);
        }
      } else {
        this.setState({
          show: true
        });
      }
    }, (err) => {
      Toast.error(err);
    });

    //禁用下拉刷新
    dom.on(this.refs.el, "touchstart", this.touchStartHandler);
  }

  componentWillUnmount() {
    dom.off(this.refs.el, "touchstart", this.touchStartHandler);
  }

  render() {
    return (
      <div ref="el" className="responsive">
        {
          this.state.show &&
          <Empty>
            {locale.noAssignStores}
            <div className="t-MT12">
              <Button type="primary"
                      onClick={hashHistory.replace.bind(null, '/permission.apply')}
              >
                {locale.go2Apply}
              </Button>
            </div>
            <div className="t-MT12">
              <Button type="minor"
                      onClick={hashHistory.replace.bind(null, '/permission.record')}
              >
                {locale.viewRecord}
              </Button>
            </div>
          </Empty>
        }
      </div>
    );
  }
}

module.exports = Index;
