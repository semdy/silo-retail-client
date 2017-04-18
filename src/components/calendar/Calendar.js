require('./Calendar.styl');

let {PropTypes} = React;
let {Icon, Button, Context} = SaltUI;
import classnames from 'classnames';
import ButtonGroup from '../ButtonGroup';
import {getWeekNumber} from '../../utils/date';
import Popup from '../popup';
import locale from '../../locale';

//世纪年份间隔
const DECADE_OFFSET = 5;
//季度年份间隔
const YEAR_OFFSET = 2;

//获得下一天date对象
function nextDay(date) {
  date.setDate(date.getDate() + 1);
  return date;
}

//获得上一天date对象
function prevDay(date) {
  date = new Date(date);
  date.setDate(date.getDate() - 1);
  return date;
}

//获得指定天数前的date对象
function prevDays(date, offset) {
  date = new Date(date);
  date.setDate(date.getDate() - offset);
  return date;
}

//获得指定天数后的date对象
function nextDays(date, offset) {
  date = new Date(date);
  date.setDate(date.getDate() + offset);
  return date;
}

//生成以天为单位的date对象时间戳
function getDateTimeByDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

//生成以月单位的date对象时间戳
function getDateTimeByMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1).getTime();
}

//获得下一月date对象
function nextMonth(date) {
  date.setMonth(date.getMonth() + 1);
  return date;
}

//获得指定月以前date对象
function prevMonths(date, offset) {
  date.setMonth(date.getMonth() - offset);
  return date;
}

//获得指定月以后date对象
function nextMonths(date, offset) {
  date = new Date(date);
  date.setMonth(date.getMonth() + offset);
  return date;
}

//获得下一年date对象
function nextYear(date) {
  date.setYear(date.getFullYear() + 1);
  return date;
}

//获得指定年数前的date对象
function prevYears(date, offset) {
  date = new Date(date);
  date.setYear(date.getFullYear() - offset);
  return date;
}

//获得指定年数后的date对象
function nextYears(date, offset, immutable) {
  if (immutable) {
    date = new Date(date);
  }
  date.setYear(date.getFullYear() + offset);
  return date;
}

//获得下13周的date对象
function next13Week(date) {
  date.setDate(date.getDate() + 13 * 7);
  return date;
}

function getRealWeekNumber(date) {
  //获得当前年份第一天是第几周
  let weekNumber = getWeekNumber(date);

  if (weekNumber === 0) {
    //如果第天周数为0，则获取上一年最后一天是第几周
    weekNumber = getWeekNumber(new Date(date.getFullYear() - 1, 11, 31));
  }

  return weekNumber;
}

function getFloat(year, week) {
  return parseFloat([year, week < 10 ? "0" + week : week].join("."));
}

//生成天数据
function getDayItem(date, currentDate, defaultDate, minDate, maxDate) {
  let nowDate = defaultDate || new Date();
  let dateTime = getDateTimeByDay(date);
  return {
    text: date.getDate(),
    value: new Date(date),
    selected: dateTime === getDateTimeByDay(nowDate),
    current: dateTime === getDateTimeByDay(new Date()),
    outside: date.getMonth() !== currentDate.getMonth(),
    disabled: (minDate && dateTime < prevDay(minDate).getTime()) || (maxDate && dateTime > maxDate.getTime())
  }
}

//生成周数据
function getWeekItem(date, defaultDate, minDate, maxDate) {
  let nowDate = defaultDate || new Date();
  let dateYear = date.getFullYear();
  let dateTime = getDateTimeByDay(date);

  //获得当前年份第一天是第几周
  let weekNumber = getRealWeekNumber(date);
  if (weekNumber >= 52) {
    dateYear = dateYear - 1;
  }

  let lastWeekCycle = weekNumber >= 52;
  let defWeekNumber = getFloat(nowDate.getFullYear(), getRealWeekNumber(nowDate));
  let nowWeekNumber = getFloat(new Date().getFullYear(), getRealWeekNumber(new Date()));

  return {
    text: dateYear + "." + weekNumber + locale.weekly + "~" + (lastWeekCycle ? dateYear + 1 :  dateYear) + "." + ((lastWeekCycle ? 0 : weekNumber) + 12) + locale.weekly,
    value: [new Date(date), nextDays(date, 13 * 7)],
    selected: defWeekNumber >= getFloat(dateYear, weekNumber) && defWeekNumber <= getFloat(lastWeekCycle ? dateYear + 1 : dateYear, (lastWeekCycle ? 0 : weekNumber) + 12),
    current: nowWeekNumber >= getFloat(dateYear, weekNumber) && nowWeekNumber <= getFloat(lastWeekCycle ? dateYear + 1 : dateYear, (lastWeekCycle ? 0 : weekNumber) + 12),
    disabled: (minDate && dateTime < prevDay(minDate).getTime()) || (maxDate && dateTime > maxDate.getTime())
  }
}

//生成月数据
function getMonthItem(date, defaultDate, minDate, maxDate) {
  let nowDate = defaultDate || new Date();
  let dateMonth = getDateTimeByMonth(date);
  return {
    text: (date.getMonth() + 1) + locale.month,
    value: new Date(date),
    selected: dateMonth === getDateTimeByMonth(nowDate),
    current: dateMonth === getDateTimeByMonth(new Date()),
    disabled: (minDate && dateMonth < getDateTimeByMonth(minDate)) || (maxDate && dateMonth > getDateTimeByMonth(maxDate))
  }
}

//生成季数据
function getQuarterItem(date, defaultDate, minDate, maxDate) {
  let nowDate = defaultDate || new Date();
  let dateYear = date.getFullYear();

  return {
    text: (dateYear - YEAR_OFFSET + 1) + locale.year + "~" + dateYear + locale.year,
    value: [prevYears(date, YEAR_OFFSET - 1, true), new Date(date)],
    selected: dateYear - YEAR_OFFSET + 1 <= nowDate.getFullYear() && nowDate.getFullYear() <= dateYear,
    current: dateYear === new Date().getFullYear(),
    disabled: (minDate && dateYear < minDate.getFullYear()) || (maxDate && dateYear > maxDate.getFullYear())
  }
}

//生成年数据
function getYearItem(date, defaultDate, minDate, maxDate) {
  let nowDate = defaultDate || new Date();
  let dateYear = date.getFullYear();
  return {
    text: dateYear + locale.year,
    value: new Date(date),
    selected: dateYear === nowDate.getFullYear(),
    current: dateYear === new Date().getFullYear(),
    disabled: (minDate && dateYear < minDate.getFullYear()) || (maxDate && dateYear > maxDate.getFullYear())
  }
}

//生成世纪数据
function getDecadeItem(date, defaultDate, minDate, maxDate) {
  let nowDate = defaultDate || new Date();
  let dateYear = date.getFullYear();

  return {
    text: (dateYear - DECADE_OFFSET + 1) + locale.year + "~" + dateYear + locale.year,
    value: [prevYears(date, DECADE_OFFSET - 1, true), new Date(date)],
    selected: dateYear - DECADE_OFFSET + 1 <= nowDate.getFullYear() && nowDate.getFullYear() <= dateYear,
    current: dateYear === new Date().getFullYear(),
    disabled: (minDate && dateYear < minDate.getFullYear()) || (maxDate && dateYear > maxDate.getFullYear())
  }
}

//生成以天为单位的日历网格model
function getDateGridByDay(date, defaultDate, minDate, maxDate) {
  //生成date所在月份第一天的日期对象
  date = new Date(date.getFullYear(), date.getMonth(), 1);
  //计算date所在月1号是周几
  let theDay = date.getDay(date);
  //计算日历第一格日期
  let firstDate = prevDays(date, theDay + 1);

  let dateMap = [];

  //生成6x7的二维日期对象数组
  for (let i = 0; i < 6; i++) {
    dateMap[i] = [];
    for (let k = 0; k < 7; k++) {
      dateMap[i].push(getDayItem(nextDay(firstDate), date, defaultDate, minDate, maxDate))
    }
  }

  return dateMap;
}

//生成以周为单位的日历网格model
function getDateGridByWeek(date, defaultDate, minDate, maxDate) {
  //生成date所在年份第一天的日期对象
  date = new Date(date.getFullYear(), 0, 1);
  //计算日历第一格日期
  let firstDate = prevDays(date, 13 * 7);

  let dateMap = [];

  //生成3x4的二维日期对象数组
  for (let i = 0; i < 2; i++) {
    dateMap[i] = [];
    for (let k = 0; k < 2; k++) {
      dateMap[i].push(getWeekItem(next13Week(firstDate), defaultDate, minDate, maxDate))
    }
  }

  return dateMap;
}

//生成以月为单位的日历网格model
function getDateGridByMonth(date, defaultDate, minDate, maxDate) {
  //切换到上一年最后一个月
  date = new Date(date.getFullYear() - 1, 11, 1);
  let dateMap = [];

  //生成3x4的二维日期对象数组
  for (let i = 0; i < 3; i++) {
    dateMap[i] = [];
    for (let k = 0; k < 4; k++) {
      dateMap[i].push(getMonthItem(nextMonth(date), defaultDate, minDate, maxDate))
    }
  }

  return dateMap;
}

//生成以季为单位的日历网格model
function getDateGridByQuarter(date, defaultDate, minDate, maxDate) {
  //计算日历第一格日期
  let firstDate = prevYears(date, 8 * YEAR_OFFSET);

  let dateMap = [];

  //生成3x4的二维日期对象数组
  for (let i = 0; i < 3; i++) {
    dateMap[i] = [];
    for (let k = 0; k < 3; k++) {
      dateMap[i].push(getQuarterItem(nextYears(firstDate, YEAR_OFFSET), defaultDate, minDate, maxDate))
    }
  }

  return dateMap;
}

//生成以年为单位的日历网格model
function getDateGridByYear(date, defaultDate, minDate, maxDate) {
  //切换到上19年第一天
  date = new Date(date.getFullYear() - 19, 0, 1);
  let dateMap = [];

  //生成3x4的二维日期对象数组
  for (let i = 0; i < 5; i++) {
    dateMap[i] = [];
    for (let k = 0; k < 4; k++) {
      dateMap[i].push(getYearItem(nextYear(date), defaultDate, minDate, maxDate))
    }
  }

  return dateMap;
}

//生成以世纪为单位的日历网格model
function getDateGridByDecade(date, defaultDate, minDate, maxDate) {
  //计算日历第一格日期
  let firstDate = prevYears(date, 8 * DECADE_OFFSET);

  let dateMap = [];

  //生成3x4的二维日期对象数组
  for (let i = 0; i < 3; i++) {
    dateMap[i] = [];
    for (let k = 0; k < 3; k++) {
      dateMap[i].push(getDecadeItem(nextYears(firstDate, DECADE_OFFSET), defaultDate, minDate, maxDate))
    }
  }

  return dateMap;
}


function getDateGrid(date, defaultDate, minDate, maxDate, type) {
  switch (type) {
    case 'hour':
      return getDateGridByDay.apply(null, arguments);
    case 'day':
      return getDateGridByMonth.apply(null, arguments);
    case 'week':
      return getDateGridByWeek.apply(null, arguments);
    case 'month':
      return getDateGridByYear.apply(null, arguments);
    case 'quarter':
      return getDateGridByQuarter.apply(null, arguments);
    case 'year':
      return getDateGridByDecade.apply(null, arguments);
  }
}

function getCalendarText(date, type) {
  switch (type) {
    case 'hour':
      return date.getFullYear() + locale.year + (date.getMonth() + 1) + locale.month;
    case 'day':
      return date.getFullYear() + locale.year;
    case 'week':
      return date.getFullYear() + locale.year;
    case 'month':
      return (date.getFullYear() - 18) + "~" + (date.getFullYear() + 1);
    case 'quarter':
    case 'year':
      return "";
  }
}

const DATE_REG = /^(\d{4}\-\d{2}\-\d{2})|(\d{4}\/\d{2}\/\d{2})$/;

class Calendar extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      activeIndex: 0,
      showType: 'hour'
    };

    let {value, min, max} = this.props;
    this.isShown = this.props.visible;
    this.selectFlag = false;
    this.lastIndex = 0;
    this.defaultDate = value instanceof Date ? value : (DATE_REG.test(value) ? new Date(value) : null);
    this.minDate = min instanceof Date ? min : (DATE_REG.test(min) ? new Date(min) : null);
    this.maxDate = max instanceof Date ? max : (DATE_REG.test(max) ? new Date(max) : null);
  }

  show() {
    this.isShown = true;
    this.refs.popup.show();
  }

  hide() {
    this.isShown = false;
    this.refs.popup.hide();
  }

  showPrev() {
    this._getDateByStep(false);
    this._setDateGrid();
  }

  showNext() {
    this._getDateByStep(true);
    this._setDateGrid();
  }

  reset() {
    this.date = this.defaultDate ? new Date(this.defaultDate) : new Date();
    this._setDateGrid();
  }

  _getDateByStep(flag) {
    switch (this.state.showType) {
      case 'hour':
        this.date.setMonth(this.date.getMonth() + (flag ? 1 : -1));
        break;
      case 'day':
        this.date.setYear(this.date.getFullYear() + (flag ? 1 : -1));
        break;
      case 'week':
        this.date.setYear(this.date.getFullYear() + (flag ? 1 : -1));
        break;
      case 'month':
        this.date.setYear(this.date.getFullYear() + (flag ? 20 : -20));
        break;
      case 'quarter':
        this.date.setYear(this.date.getFullYear() + (flag ? YEAR_OFFSET * 9 : -YEAR_OFFSET * 9));
        break;
      case 'year':
        this.date.setYear(this.date.getFullYear() + (flag ? DECADE_OFFSET * 9 : -DECADE_OFFSET * 9));
        break;
    }
    return this.date;
  }

  _setDateGrid() {
    this.setState({
      data: getDateGrid(this.date, this.defaultDate, this.minDate, this.maxDate, this.state.showType)
    });
  }

  handleTypeClick(index, type) {
    this.setState({
      activeIndex: index,
      showType: type
    }, () => {
      this.reset();
    });
  }

  handleItemClick(day, rowNumber, colNumber) {
    if (day.disabled) return;
    let {singleSelect} = this.props;
    this.state.data.forEach((rows, i) => {
      rows.forEach((item, k) => {
        if (singleSelect || !this.selectFlag) {
          if (i === rowNumber && k === colNumber) {
            item.selected = true;
            this.lastIndex = rowNumber * 7 + colNumber;
          } else {
            item.selected = false;
          }
        } else {
          let curIndex = i * 7 + k;
          if (curIndex >= this.lastIndex && curIndex <= rowNumber * 7 + colNumber) {
            item.selected = true;
          } else {
            item.selected = false;
          }
        }
      });
    });

    this.selectFlag = !this.selectFlag;

    this.setState({
      data: this.state.data
    });

    this.props.onSelect(day.value);
  }

  handleLeave() {
    this.isShown = false;
    this.props.onLeave();
  }

  handleConfirm() {
    let selectedDate = [];

    this.state.data.forEach((item) => {
      item.forEach((dateObj) => {
        if (dateObj.selected) {
          if (Array.isArray(dateObj.value)) {
            selectedDate = selectedDate.concat(dateObj.value);
          } else {
            selectedDate.push(dateObj.value);
          }
        }
      });
    });

    this.props.onConfirm(selectedDate.length === 1 ? selectedDate[0] : selectedDate, this.state.showType);

    setTimeout(() => {
      this.hide();
    });
  }

  componentDidMount() {
    if (this.props.visible) {
      this.show();
    }
  }

  componentWillReceiveProps(nextProps) {
    let {visible, value} = nextProps;
    if (visible === true && !this.isShown) {
      this.isShown = true;
      this.defaultDate = value;
      this.reset();
    }
  }

  render() {
    let {activeIndex, data, showType} = this.state;
    let {className, formatter, title, showFilter, ...popupProps} = this.props;
    return (
      <Popup ref="popup" {...popupProps} onLeave={this.handleLeave.bind(this)}>
        <div className={["calendar-container", className].join(" ").trim()}>
          <div className="t-FBH t-FBAC calendar-header">
            <span className="calendar-cancel"
                  onClick={this.hide.bind(this)}>
              {locale.cancel}
            </span>
            <div className="t-FB1 calendar-title">
              {
                title ? title : (showFilter &&
                <ButtonGroup half={true} activeIndex={activeIndex}>
                  <Button type="minor"
                          size="small"
                          className="t-button-plain"
                          onClick={this.handleTypeClick.bind(this, 0, 'hour')}
                  >
                    {locale.hour}
                  </Button>
                  <Button type="minor"
                          size="small"
                          className="t-button-plain"
                          onClick={this.handleTypeClick.bind(this, 1, 'day')}
                  >
                    {locale.day}
                  </Button>
                  <Button type="minor"
                          size="small"
                          className="t-button-plain"
                          onClick={this.handleTypeClick.bind(this, 2, 'week')}
                  >
                    {locale.weekly}
                  </Button>
                  <Button type="minor"
                          size="small"
                          className="t-button-plain"
                          onClick={this.handleTypeClick.bind(this, 3, 'month')}
                  >
                    {locale.month}
                  </Button>
                  <Button type="minor"
                          size="small"
                          className="t-button-plain"
                          onClick={this.handleTypeClick.bind(this, 4, 'quarter')}
                  >
                    {locale.quarter}
                  </Button>
                  <Button type="minor"
                          size="small"
                          className="t-button-plain"
                          onClick={this.handleTypeClick.bind(this, 5, 'year')}
                  >
                    {locale.year}
                  </Button>
                </ButtonGroup>)
              }
            </div>
            <span className="calendar-confirm"
                  onClick={this.handleConfirm.bind(this)}
            >
              {locale.ok}
            </span>
          </div>
          <div className="calendar-content">
            <div className="t-FBH t-FBAC t-FBJC calendar-tools">
              <Icon name="angle-left-l"
                    width={18}
                    height={18}
                    className="cld-switch cld-prev"
                    onClick={this.showPrev.bind(this)}
              />
              <div className="cld-date-indicator">
                {
                  this.date && getCalendarText(this.date, showType)
                }
              </div>
              <Icon name="angle-right-l"
                    width={18}
                    height={18}
                    className="cld-switch cld-next"
                    onClick={this.showNext.bind(this)}
              />
            </div>
            {
              showType === 'hour' &&
              <div className="t-FBH calendar-weeks">
                {
                  locale.dayNames.map((day, i) => {
                    return (
                      <div key={i} className="t-FB1 cld-week">{day}</div>
                    )
                  })
                }
              </div>
            }
            <div className="calendar-days">
              {
                data.map((rows, i) => {
                  return (
                    <div key={i} className="t-FBH calendar-rows">
                      {
                        rows.map((item, k) => {
                          return (
                            <div key={k}
                                 className={
                                   classnames("t-FB1 t-FBH t-FBAC t-FBJC cld-item", {
                                     "outside": item.outside,
                                     "current": item.current,
                                     "selected": item.selected,
                                     "disabled": item.disabled
                                   })
                                 }
                                 onClick={this.handleItemClick.bind(this, item, i, k)}
                            >
                              <span className="t-FBH t-FBAC t-FBJC">{formatter(item)}</span>
                            </div>
                          )
                        })
                      }
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
      </Popup>
    );
  }
}

Calendar.defaultProps = {
  className: '',
  title: '',
  value: '', //指定日历默认高亮显示的日期，格式如：XXX-XX-XX 或 XXXX/XX/XX
  min: '',  //最大值
  max: '',  //最小值
  singleSelect: true, //是否单选
  showFilter: true,  //是否显示类型筛选
  onSelect: Context.noop,
  onCancel: Context.noop,
  onConfirm: Context.noop,
  formatter: function (day) {
    return day.text;
  },
  onAppear: Context.noop,
  onEnd: Context.noop,
  onEnter: Context.noop,
  onLeave: Context.noop
};

Calendar.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date)
  ]),
  min: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date)
  ]),
  max: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date)
  ]),
  singleSelect: PropTypes.bool.isRequired,
  showFilter: PropTypes.bool.isRequired,
  onSelect: PropTypes.func,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  formatter: PropTypes.func,
  onAppear: PropTypes.func,
  onEnd: PropTypes.func,
  onEnter: PropTypes.func,
  onLeave: PropTypes.func
};

module.exports = Calendar;
