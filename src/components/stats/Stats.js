require('./Stats.styl');

import classnames from 'classnames';

class StatItem extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let {suffix, name, value, subAmount} = this.props;
    let suffixStr = "";
    if (suffix) {
      suffixStr = (
        <em>{suffix}</em>
      );
    }
    return (
      <div className="t-FB1 stats-item">
        <h4 className="stats-name">{name}</h4>
        <div className="stats-value">{value}{suffixStr}</div>
        {
          subAmount !== undefined &&
          <div className="stats-amout">
            <ins>￥</ins>
            {subAmount}</div>
        }

      </div>
    );
  }
}

class Stats extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let {data} = this.props;
    return (
      <div className={classnames("stats-container", {double: data.length > 1})}>
        <div className="t-FBH stats-bd">
          {
            data.map((item, index) => {
              return (
                <StatItem key={index}
                          name={item.name}
                          value={item.value}
                          suffix={item.suffix}
                          subAmount={item.subAmount}
                >

                </StatItem>
              )
            })
          }
        </div>
      </div>);
  }
}

module.exports = Stats;
