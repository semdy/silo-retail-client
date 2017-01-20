require('./DateNavigator.styl');

let { Icon, Button } = SaltUI;
import ButtonGroup from '../../components/ButtonGroup';
import DropDown from '../../components/DropDown';
import classnames from 'classnames';

const formatDate = (dateUTC, filterType) => {
  var year = dateUTC.getFullYear() + "年";
  var month = /^(?:hour|day|week)$/.test(filterType) ? (dateUTC.getMonth() + 1) + "月" : "";
  var date = filterType === 'hour' ? dateUTC.getDate() + "日" : "";
  return `${year}${month}${date}`;
};

const getDay = (dateUTC) => {
  var n = ["日", "一", "二", "三", "四", "五", "六"];
  return n[dateUTC.getDay()];
};

class DateNavigator extends React.Component {

  constructor(props) {
      super(props);
      this.state = {
        activeIndex: 0,
        width: window.innerWidth,
        height: window.innerHeight,
        options: [
          {
            value: 'hour',
            text: '按时'
          },
          {
            value: 'day',
            text: '按天'
          },
          {
            value: 'week',
            text: '按周'
          },
          {
            value: 'month',
            text: '按月'
          },
          {
            value: 'year',
            text: '按年'
          }
        ]
      };

      this.filterType = 'hour';
  }

  showStoreList(){
      this.props.showStoreList();
  }

  itemClick(itemIndex, filterType){
    this.setState({
      activeIndex: itemIndex
    });
    this.filterType = filterType;
    this.props.onItemClick(filterType);
  }

  render() {
      const {date, nextDisabled, diffDisabled, onPrev, onNext, isFullScreen, hideDiff} = this.props;
      let { width, height, options } = this.state;
      let dateIndicator = (
        <div>
          <Icon name="angle-left" className="date-arrow left" onClick={onPrev} />
          <span className="date">{formatDate(date, this.filterType)}</span>
          {
            this.filterType !== 'hour' ? "" :
            <span className="day">{`星期${getDay(date)}`}</span>
          }
          <Icon name="angle-right" className={classnames("date-arrow right", {disabled: nextDisabled})} onClick={onNext} />
        </div>
      );
      return (<div className={classnames("date-navigator", {"date-navigator-full": isFullScreen})} style={{
        left: isFullScreen ? (width - height*0.5 - 70) + "px" : "",
        top: isFullScreen ? -70*0.5 + "px" : "",
        width: isFullScreen ? height + "px" : ""
      }}>
          {
            !isFullScreen ?
              <div>
                <DropDown options={options} activeIndex={this.state.activeIndex} onItemClick={this.itemClick.bind(this)}></DropDown>
                {dateIndicator}
                {hideDiff ? "" :
                  <div className="diff-toggle" onClick={this.props.toggleDiff}>
                    <Button type="text">
                      环比
                      <Icon name="check" className={classnames("icon-has-bg", {disabled: diffDisabled})}
                            width={16}
                            height={12}
                            fill="#fff"/>
                    </Button>
                  </div>
                }
              </div>
              :
              (<div>
                <ButtonGroup half={true} className="date-indicator">
                  <Button type="minor">{dateIndicator}</Button>
                </ButtonGroup>
                <ButtonGroup half={true} activeIndex={this.state.activeIndex} className="t-PL16 t-PR16">
                  <Button type="minor" className="t-button-plain" onClick={this.itemClick.bind(this, 0, 'hour')}>时</Button>
                  <Button type="minor" className="t-button-plain" onClick={this.itemClick.bind(this, 1, 'day')}>天</Button>
                  <Button type="minor" className="t-button-plain" onClick={this.itemClick.bind(this, 2, 'week')}>周</Button>
                  <Button type="minor" className="t-button-plain" onClick={this.itemClick.bind(this, 3, 'month')}>月</Button>
                  <Button type="minor" className="t-button-plain" onClick={this.itemClick.bind(this, 4, 'year')}>年</Button>
                </ButtonGroup>
                <ButtonGroup half={true}>
                  <Button type="minor" className="t-button-plain" onClick={this.showStoreList.bind(this)}>
                    选择对比门店<span className="caret"></span>
                  </Button>
                </ButtonGroup>
              </div>
            )
          }
      </div>);
  }
}

module.exports = DateNavigator;
