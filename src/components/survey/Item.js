import './Item.styl';

import React, {PropTypes} from 'react';
import {Icon} from 'saltui';
import {hashHistory} from 'react-router';
import classnames from 'classnames';

/**
 * 计算上涨和下降百分比
 * */
const getTrender = (value, avg) => {
  if (avg === 0) return 0;
  return (value - avg) / avg * 100;
};

class Item extends React.Component {

  constructor(props) {
    super(props);
  }

  handleRoute(params) {
    if (typeof params === 'object' && params.link) {
      hashHistory.replace(params.link);
    }
  }

  render() {
    let {data} = this.props;
    return (
      <div className={classnames("panel survey-item t-FBH", {split: data.length === 2})}>
        {
          data.map((item, i) => {
            let trend = getTrender(item.value[0], item.value[1]);
            return (
              <div className={classnames("panel-item survey-item-cell t-FB1 t-FBAC", {
                "trend-up": trend > 0,
                "trend-down": trend < 0
              })}
                   key={i}
                   onClick={this.handleRoute.bind(this, item.params)}
              >
                <h4 className="item-prop">
                  <span>{item.name}</span>
                  {
                    trend !== 0 &&
                    <Icon name="arrow-up" width={18} height={18}>
                    </Icon>
                  }
                </h4>
                <div className={classnames("item-value", {extra: trend === 0})}>
                  <span className="item-prefix"><ins>{item.params.prefix}</ins></span>
                  {item.value[0]}
                  <span className="item-suffix">{item.params.unit}</span>
                </div>
                {
                  trend !== 0 &&
                  <div className="item-avg">
                    {item.params.compare} {item.value[1]}
                    <em className="trend-ratio">
                      {(Math.abs(trend) < 1 ? trend.toFixed(2) : parseInt(trend)) + "%"}
                    </em>
                  </div>
                }
              </div>
            )
          })
        }
      </div>
    )
  }
}

Item.propTypes = {
  data: PropTypes.array.isRequired
};

Item.defaultProps = {
  data: []
};

module.exports = Item;
