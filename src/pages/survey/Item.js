import './Item.styl';

let { PropTypes } = React;
let { Icon } = SaltUI;
let {hashHistory} = ReactRouter;
import classnames from 'classnames';

/**
 * 计算上涨和下降百分比
 * */
const getTrender = (value, avg) => {
  let ratio = (parseFloat(value) - parseFloat(avg))/parseFloat(avg);
  return parseInt(ratio*100);
};

class Item extends React.Component {

  constructor(props) {
    super(props);
  }

  handleRoute(params){
    if( typeof params == 'object' && params.link ){
      hashHistory.replace(params.link);
    }
  }

  render() {
    let {legend, data} = this.props;
    return (
      <div className={classnames("panel survey-item t-FBH", {split: data.length == 2})}>
        {
          data.map((item, i) => {
            let trend = getTrender(item.value[0],item.value[1]);
            return (
              <div className={classnames("panel-item survey-item-cell t-FB1", {"trend-up": trend > 0, "trend-down": trend < 0})}
                   key={i}
                   onClick={this.handleRoute.bind(this, item.params)}
              >
                <h4 className="item-prop">
                  <span>{item.name}</span>
                  <Icon name="arrow" width={18} height={18}>
                  </Icon>
                </h4>
                <div className="item-value">
                  <span className="item-prefix"><ins>{item.params.prefix}</ins></span>
                  {item.value[0]}
                  <span className="item-suffix">{item.params.unit}</span>
                  </div>
                <div className="item-avg">{legend} {item.value[1]} <em className="trend-ratio">{trend + "%"}</em></div>
              </div>
            )
          })
        }
      </div>
    )
  }
}

Item.propTypes = {
  legend: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired
};

Item.defaultProps = {
  legend: '',
  data: []
};

module.exports = Item;
