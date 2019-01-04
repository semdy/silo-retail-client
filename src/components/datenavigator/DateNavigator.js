import './DateNavigator.styl';

import React from 'react';
import Reflux from 'reflux';
import {Icon} from 'saltui';
import Calendar from '../../components/calendar';
import classnames from 'classnames';
import reactMixin from 'react-mixin';
import actions from '../../app/actions';
import store from  '../../app/store';
import {localDate} from '../../utils/date';
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
  let date = localDate(store.state.store.tzStamp); //new Date();
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
  let nowDateObj = localDate(store.state.store.tzStamp); //new Date();
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

const getDay = (date) => {
  return locale.dayNames[date.getDay()];
};

class DateNavigator extends React.Component {

  static defaultProps = {
    className: "",
    dateSwitchable: true
  };

  static propTypes = {
    className: React.PropTypes.string,
    dateSwitchable: React.PropTypes.bool
  };

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

  componentDidMount(){
    if( window.location.hash.split("?")[0].match(/^#\/report\.(sale|passflow)$/) ){
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

    setTimeout(function () {
      actions.setFilterType(filterType);
      actions.setQueryOffset(calculateOffset(date, filterType));
    }, 500);
  }

  handleLeave(){
    this.setState({
      showCalendar: false
    });
  }

  render() {
    let {offset, store, timelines, filterType,
      showCalendar, showFilter, calendarTitle} = this.state;
    let date = getDateBefore(offset, filterType);
    let {dateSwitchable} = this.props;
    return (
      <div>
        <div className={classnames("date-navigator normal", this.props.className)}>
          <div className="t-FBH t-FBAC t-FBJ">
            <div className="store-name" onClick={this.showStore}>
              <Icon name="store" className="store-icon" width={20} height={20}/>
              <span className="store-text">
                {store.name}
              </span>
            </div>
            {
              dateSwitchable &&
              <div className="t-FBH t-FBAC t-FBJC store-indict">
                <div className="date-arrow left t-FBH t-FBJC t-FBAC" onClick={actions.queryPrev}>
                  <Icon name="angle-left-l" width={18} height={18}/>
                </div>
                <div className="store-date" onClick={this.showCalendar.bind(this)}>
                  <Icon name="calendar" className="date-cld" width={22} height={22}/>
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
            }
          </div>
        </div>
        {
          dateSwitchable &&
          <Calendar visible={showCalendar}
                    showFilter={showFilter}
                    title={calendarTitle}
                    onConfirm={this.handleConfirm.bind(this)}
                    onLeave={this.handleLeave.bind(this)}
                    value={date}
                    max={localDate(store.tzStamp)}
          />
        }
      </div>
    )
  }
}

reactMixin.onClass(DateNavigator, Reflux.connect(store));

module.exports = DateNavigator;
