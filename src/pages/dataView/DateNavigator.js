require('./DateNavigator.styl');

let { Icon, Button } = SaltUI;
import ButtonGroup from '../../components/ButtonGroup';
import classnames from 'classnames';

const formatDate = (dateUTC) => {
  var year = dateUTC.getFullYear();
  var month = dateUTC.getMonth() + 1;
  var date = dateUTC.getDate();
  return `${year}年${month}月${date}日`;
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
        height: window.innerHeight
      };
  }

  showStoreList(){
      this.props.showStoreList();
  }

  itemClick(itemIndex, filterType){
    this.setState({
      activeIndex: itemIndex
    });
    this.props.onItemClick(filterType);
  }

  render() {
      const {date, disabled, onPrev, onNext, isFullScreen} = this.props;
      let { width, height } = this.state;
      let dateIndicator = (
        <div>
          <Icon name="angle-left" className="date-arrow left" onClick={onPrev} />
          <span className="date">{formatDate(date)}</span>
          <span className="day">{`星期${getDay(date)}`}</span>
          <Icon name="angle-right" className={classnames("date-arrow right", {disabled: disabled})} onClick={onNext} />
        </div>
      );
      return (<div className={classnames("date-navigator", {"date-navigator-full": isFullScreen})} style={{
        left: isFullScreen ? (width - height*0.5 - 70) + "px" : "",
        top: isFullScreen ? -70*0.5 + "px" : "",
        width: isFullScreen ? height + "px" : ""
      }}>
          {
            !isFullScreen ? dateIndicator : (
              <div>
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
