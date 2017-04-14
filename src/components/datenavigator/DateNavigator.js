require('./DateNavigator.styl');

let {Icon, Button} = SaltUI;
import ButtonGroup from '../../components/ButtonGroup';
import Calendar from '../../components/calendar';
import classnames from 'classnames';
import reactMixin from 'react-mixin';
import actions from '../../app/actions';
import store from  '../../app/store';
import dom from '../../utils/dom';
import locale from '../../locale';

const formatDate = (dateUTC, timelines, filterType) => {
  if (/^(?:hour|day)$/.test(filterType)) {
    let year = dateUTC.getFullYear() + locale.year;
    let month = (dateUTC.getMonth() + 1) + locale.month;
    let date = filterType === 'hour' ? dateUTC.getDate() + locale.day : "";
    return `${year}${month}${date}`;
  } else {
    if( timelines.length === 0 ) return '';
    if (filterType === 'year') {
      return [timelines[0].substr(5), timelines[timelines.length - 1].substr(5)].join("~");
    } else {
      return [timelines[0], timelines[timelines.length - 1]].join("~");
    }
  }
};

//获取距离今天指定日期对象
export const getDateBefore = (offset, filterType) => {
  let date = new Date();
  switch ( filterType ){
    case 'hour':
      date.setDate(date.getDate() - offset);
      break;
    case 'day':
      date.setMonth(date.getMonth() - offset);
      break;
    case 'week':
      date.setDate(date.getDate() - 13 * 7 * offset);
      break;
    case 'month':
    case 'quarter':
    case 'year':
      date.setYear(date.getFullYear() - offset);
      break;
  }

  return date;
};

const calculateOffset = (dateObj, filterType) => {
  let nowDateObj = new Date();
  let nowYear = nowDateObj.getFullYear();
  let nowMonth = nowDateObj.getMonth();
  let nowDate = nowDateObj.getDate();

  let year = dateObj.getFullYear();
  let month = dateObj.getMonth();
  let date = dateObj.getDate();

  switch (filterType){
    case 'hour':
      return (new Date(nowYear, nowMonth, nowDate).getTime() - new Date(year, month, date).getTime())/(24*60*60*1000);
    case 'day':
      return (nowYear - year)*12 + nowMonth - month;
    case 'week':
      let weekNumMap = {
        0: 1,
        3: 2,
        6: 3,
        8: 4
      };
      let weekNum = weekNumMap[month];
      let nowWeekNum = 1;
      if( nowMonth >= 0 && nowMonth < 3 ){
        nowWeekNum = 1;
      }
      else if( nowMonth >= 3 && nowMonth < 6 ){
        nowWeekNum = 2;
      }
      else if( nowMonth >= 6 && nowMonth < 8 ){
        nowWeekNum = 3;
      } else {
        weekNum = 4;
      }
      return (nowYear - year)*4 + nowWeekNum - weekNum;
    case 'month':
      return nowYear - year;
    case 'quarter':
      //return (nowYear - year)*4 + Math.ceil((nowMonth + 1)/3) - Math.ceil((month + 1)/3);
      return (nowYear - 1 - year)/2;
    case 'year':
      return (nowYear - 4 - year)/5;
  }
};

const getDay = (dateUTC) => {
  return locale.dayNames[dateUTC.getDay()];
};

class DateNavigator extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      activeIndex: 0,
      width: window.innerWidth,
      height: window.innerHeight,
      showCalendar: false,
      showFilter: false,
      calendarTitle: ''
    };

  }

  componentWillUnmount() {
    if (this.state.isFullScreen) {
      actions.setFullScreen(false);
      dom.removeClass(document.body, "page-fullscreen");
    }
  }

  componentDidMount(){
    if( location.hash.split("?")[0] === '#/report.sale' ){
      this.setState({
        showFilter: true,
        calendarTitle: ''
      });
    } else {
      this.setState({
        showFilter: false,
        calendarTitle: locale.calendarTitle
      });
      actions.setFilterType('hour');
    }
  }

  itemClick(itemIndex, filterType) {
    if (itemIndex === this.state.activeIndex) return;
    this.setState({
      activeIndex: itemIndex
    });
    actions.setFilterType(filterType);
  }

  showStore() {
    actions.showStoreSelector();
  }

  showCalendar(){
    this.setState({
      showCalendar: true
    });
  }

  handleConfirm(date, filterType){
    date = Array.isArray(date) ? date[0] : date;
    this.setState({
      showCalendar: false
    });
    actions.setFilterType(filterType);
    actions.setQueryOffset(calculateOffset(date, filterType));
  }

  handleLeave(){
    this.setState({
      showCalendar: false
    });
  }

  render() {
    let {width, height, isFullScreen, offset,
      store, activeIndex, timelines, filterType,
      showCalendar, showFilter, calendarTitle} = this.state;

    let date = getDateBefore(offset, filterType);

    let dateIndicator = (
      <div className="t-FBH t-FBAC t-FBJ">
        <div className="store-name"
             onClick={this.showStore}
             style={{display: isFullScreen ? "none" : undefined}}>
          <Icon name="store" className="store-icon" width={20} height={20}/>
          <span className="store-text">
            {store.name}
          </span>
        </div>
        <div className="t-FBH t-FBAC t-FBJC store-indict">
          <div className="date-arrow left t-FBH t-FBJC t-FBAC"
               onClick={actions.queryPrev}>
            <Icon name="angle-left-l" width={18} height={18}/>
          </div>
          <div className="store-date" onClick={this.showCalendar.bind(this)}>
            <Icon name="calendar" className="date-cld" width={15} height={15}/>
            <span className="date">
              {formatDate(date, timelines, filterType)}
            </span>
            <span className="day">
              {filterType !== 'hour' ? "" : `${locale.week}${getDay(date)}`}
            </span>
          </div>
          <div className={classnames("date-arrow right t-FBH t-FBJC t-FBAC", {disabled: offset === 0})}
               onClick={actions.queryNext}>
            <Icon name="angle-right-l" width={18} height={18}/>
          </div>
        </div>
      </div>
    );
    return (
      <div>
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
                  <ButtonGroup half={true} activeIndex={activeIndex} className="t-PL16 t-PR16">
                    <Button type="minor" className="t-button-plain"
                            onClick={this.itemClick.bind(this, 0, 'hour')}>{locale.hour}</Button>
                    <Button type="minor" className="t-button-plain"
                            onClick={this.itemClick.bind(this, 1, 'day')}>{locale.day}</Button>
                    <Button type="minor" className="t-button-plain"
                            onClick={this.itemClick.bind(this, 2, 'week')}>{locale.weekly}</Button>
                    <Button type="minor" className="t-button-plain"
                            onClick={this.itemClick.bind(this, 3, 'month')}>{locale.month}</Button>
                    <Button type="minor" className="t-button-plain"
                            onClick={this.itemClick.bind(this, 4, 'year')}>{locale.year}</Button>
                  </ButtonGroup>
                  <ButtonGroup half={true}>
                    <Button type="minor" className="t-button-plain" onClick={this.showStore}>
                      {locale.chooseStore}
                      <span className="caret">
                      </span>
                    </Button>
                  </ButtonGroup>
                </div>
              )
          }
        </div>
        <Calendar visible={showCalendar}
                  showFilter={showFilter}
                  title={calendarTitle}
                  onConfirm={this.handleConfirm.bind(this)}
                  onLeave={this.handleLeave.bind(this)}
                  value={date}
                  max={new Date()}
        />
      </div>
    )
  }
}

reactMixin.onClass(DateNavigator, Reflux.connect(store));

module.exports = DateNavigator;
