require('./DateNavigator.styl');

let {Icon, Button, Context} = SaltUI;
let {PropTypes} = React;
import ButtonGroup from '../../components/ButtonGroup';
import classnames from 'classnames';
import reactMixin from 'react-mixin';
import actions from '../../app/actions';
import store from  '../../app/store';
import dom from '../../utils/dom';

const formatDate = (dateUTC, timelines, filterType) => {
  if (/^(?:hour|day)$/.test(filterType)) {
    var year = dateUTC.getFullYear() + "年";
    var month = (dateUTC.getMonth() + 1) + "月";
    var date = filterType === 'hour' ? dateUTC.getDate() + "日" : "";
    return `${year}${month}${date}`;
  } else {
    if (filterType == 'year') {
      return [timelines[0].substr(5), timelines[timelines.length - 1].substr(5)].join("~");
    } else {
      return [timelines[0], timelines[timelines.length - 1]].join("~");
    }
  }
};

const getDay = (dateUTC) => {
  var n = ["日", "一", "二", "三", "四", "五", "六"];
  return n[dateUTC.getDay()];
};

class DateNavigator extends React.Component {

  constructor(props) {
    super(props);
    this.filterType = this.props.defaultFilterType;

    this.state = {
      activeIndex: 0,
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  componentWillUnmount() {
    if (this.state.isFullScreen) {
      actions.setFullScreen(false);
      dom.removeClass(document.body, "page-fullscreen");
    }
  }

  itemClick(itemIndex, filterType) {
    if (itemIndex === this.state.activeIndex) return;
    this.setState({
      activeIndex: itemIndex
    }, () => {
      this.filterType = filterType;
    });
    this.props.onItemClick(filterType);
  }

  render() {
    const {date, nextDisabled, onPrev, onNext, timelines, storeName} = this.props;
    let {width, height, isFullScreen} = this.state;
    let dateIndicator = (
      <div className="t-clear">
        <div className="store-name t-FL" style={{display: isFullScreen ? "none" : ""}}>{storeName}店</div>
        <div className="t-FR t-FBH t-FBAC t-FBJC store-indict">
          <div className="date-arrow left t-FBH t-FBJC t-FBAC"
               onClick={onPrev}>
            <Icon name="angle-left-l" width={18} height={18}/>
          </div>
          <Icon name="calendar" className="date-cld" width={15} height={15}/>
          <span className="date">{formatDate(date, timelines, this.filterType)}</span>
          <span className="day">{this.filterType !== 'hour' ? "" : `星期${getDay(date)}`}</span>
          <div className={classnames("date-arrow right t-FBH t-FBJC t-FBAC", {disabled: nextDisabled})}
               onClick={onNext}>
            <Icon name="angle-right-l" width={18} height={18}/>
          </div>
        </div>
      </div>
    );
    return (
      <div className={classnames("date-navigator", {"full": isFullScreen, "normal": !isFullScreen})} style={{
        left: isFullScreen ? (width - height * 0.5 - 70) + "px" : "",
        top: isFullScreen ? -70 * 0.5 + "px" : "",
        width: isFullScreen ? height + "px" : ""
      }}
      >
        {
          !isFullScreen ?
            <div>
              {dateIndicator}
            </div>
            :
            (<div>
                <ButtonGroup half={true} className="date-indicator">
                  <Button type="minor">{dateIndicator}</Button>
                </ButtonGroup>
                <ButtonGroup half={true} activeIndex={this.state.activeIndex} className="t-PL16 t-PR16">
                  <Button type="minor" className="t-button-plain"
                          onClick={this.itemClick.bind(this, 0, 'hour')}>时</Button>
                  <Button type="minor" className="t-button-plain"
                          onClick={this.itemClick.bind(this, 1, 'day')}>天</Button>
                  <Button type="minor" className="t-button-plain"
                          onClick={this.itemClick.bind(this, 2, 'week')}>周</Button>
                  <Button type="minor" className="t-button-plain"
                          onClick={this.itemClick.bind(this, 3, 'month')}>月</Button>
                  <Button type="minor" className="t-button-plain"
                          onClick={this.itemClick.bind(this, 4, 'year')}>年</Button>
                </ButtonGroup>
                <ButtonGroup half={true}>
                  <Button type="minor" className="t-button-plain" onClick={this.props.showStoreList.bind(this)}>
                    选择对比门店<span className="caret"></span>
                  </Button>
                </ButtonGroup>
              </div>
            )
        }
      </div>);
  }
}

DateNavigator.propTypes = {
  defaultFilterType: PropTypes.string,
  date: PropTypes.instanceOf(Date),
  nextDisabled: PropTypes.bool,
  onPrev: PropTypes.func,
  onNext: PropTypes.func,
  timelines: PropTypes.arrayOf(PropTypes.string),
  storeName: PropTypes.string,
  onItemClick: PropTypes.func,
  showStoreList: PropTypes.func
};

DateNavigator.defaultProps = {
  defaultFilterType: 'hour',
  date: new Date(),
  nextDisabled: true,
  onPrev: Context.noop,
  onNext: Context.noop,
  timelines: [],
  storeName: '',
  onItemClick: Context.noop,
  showStoreList: Context.noop
};

reactMixin.onClass(DateNavigator, Reflux.connect(store));

module.exports = DateNavigator;
