require('./Calendar.styl');

let {PropTypes} = React;
let {Icon, Button, Context} = SaltUI;
import classnames from 'classnames';
import ButtonGroup from '../ButtonGroup';
import Popup from '../popup';
import locale from '../../locale';

//获得下一天date对象
function nextDay(date) {
  date.setDate(date.getDate() + 1);
  return date;
}

//获得指定天数前的date对象
function prevDays(date, offset) {
  date = new Date(date);
  date.setDate(date.getDate() - offset);
  return date;
}

//获取天数据
function getDayItem(date) {
  return {
    text: date.getDate(),
    value: new Date(date)
  }
}

//生成日期网格model
function getDateGrid(date) {
  date = new Date(date);
  //获得今天周几
  let nowDay = date.getDay(date);
  //获得日历第一格日期
  let firstDate = prevDays(date, nowDay + 1);

  let dateMap = [];

  for (let i = 0; i < 6; i++) {
    dateMap[i] = [];
    for (let k = 0; k < 7; k++) {
      dateMap[i].push(getDayItem(nextDay(firstDate)))
    }
  }

  return dateMap;
}

function getCalendarText(date) {
  return date.getFullYear() + locale.year + (date.getMonth() + 1) + locale.month;
}

class Calendar extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      data: {
        days: [],
        months: [],
        years: []
      },
      activeIndex: 0
    };

  }

  show() {
    this.nowDate = new Date();
    this.date = new Date();
    this._setDateGrid();
    this.refs.popup.show();
  }

  hide() {
    this.refs.popup.hide();
  }

  showPrev() {
    this._getDateByStep('-');
    this._setDateGrid();
  }

  showNext() {
    this._getDateByStep('+');
    this._setDateGrid();
  }

  _getDateByStep(flag) {
    this.date.setMonth(this.date.getMonth() + (flag === '+' ? 1 : -1));
    return this.date;
  }

  _setDateGrid(){
    this.setState({
      data: {
        days: getDateGrid(this.date)
      }
    });
  }

  handleTypeClick(index) {
    this.setState({
      activeIndex: index
    });
  }

  handleDayClick(date, rowNumber, colNumber){
    this.state.data.days.forEach((rows, i) => {
      rows.forEach((item, k) => {
        if( i === rowNumber && k === colNumber ){
          item.selected = true;
        } else {
          item.selected = false;
        }
      });
    });

    this.setState({
      data: {
        days: this.state.data.days
      }
    });

    this.props.onSelect(date);
  }

  componentWillReceiveProps(nextProps) {
    let {visible} = nextProps;
    //if( this.props.visible !== visible ) {
      if (visible === true) {
        this.show();
      }
      else if (visible === false) {
        this.hide();
      }
    //}
  }

  componentDidMount(){
    if( this.props.visible ){
      this.show();
    }
  }

  render() {
    let {activeIndex, data} = this.state;
    let {className, ...popupProps} = this.props;
    return (
      <Popup ref="popup" {...popupProps}>
        <div className={["calendar-container", className].join(" ").trim()}>
          <div className="t-FBH t-FBAC calendar-header">
            <span className="calendar-cancel"
                  onClick={this.hide.bind(this)}>
              {locale.cancel}
            </span>
            <div className="t-FB1 calendar-title">
              <ButtonGroup half={true} activeIndex={activeIndex}>
                <Button type="minor" size="small" className="t-button-plain"
                        onClick={this.handleTypeClick.bind(this, 0, 'hour')}>{locale.hour}</Button>
                <Button type="minor" size="small" className="t-button-plain"
                        onClick={this.handleTypeClick.bind(this, 1, 'day')}>{locale.day}</Button>
                <Button type="minor" size="small" className="t-button-plain"
                        onClick={this.handleTypeClick.bind(this, 2, 'week')}>{locale.weekly}</Button>
                <Button type="minor" size="small" className="t-button-plain"
                        onClick={this.handleTypeClick.bind(this, 3, 'month')}>{locale.month}</Button>
                <Button type="minor" size="small" className="t-button-plain"
                        onClick={this.handleTypeClick.bind(this, 4, 'year')}>{locale.year}</Button>
              </ButtonGroup>
            </div>
            <span className="calendar-confirm">
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
                  this.date && getCalendarText(this.date)
                }
              </div>
              <Icon name="angle-right-l"
                    width={18}
                    height={18}
                    className="cld-switch cld-next"
                    onClick={this.showNext.bind(this)}
              />
            </div>
            <div className="t-FBH calendar-weeks">
              {
                locale.dayNames.map((day, i) => {
                  return (
                    <div key={i} className="t-FB1 cld-week">{day}</div>
                  )
                })
              }
            </div>
            <div className="calendar-days">
              {
                data.days.map((rows, i) => {
                  return (
                    <div key={i} className="t-FBH calendar-rows">
                      {
                        rows.map((item, k) => {
                          return (
                            <div key={k}
                                 className={
                                   classnames("t-FB1 t-FBH t-FBAC t-FBJC cld-day", {
                                     "gray-day": item.value.getMonth() !== this.date.getMonth(),
                                     "selected": item.selected,
                                     "current": item.value.getFullYear() === this.nowDate.getFullYear()
                                                && item.value.getMonth() === this.nowDate.getMonth()
                                                && item.value.getDate() === this.nowDate.getDate()
                                   })
                                 }
                                 onClick={this.handleDayClick.bind(this, item.value, i, k)}
                            >
                              <span className="t-FBH t-FBAC t-FBJC">{item.text}</span>
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
  onSelect: Context.noop
};

Calendar.propTypes = {
  className: PropTypes.string,
  onSelect: PropTypes.func
};

module.exports = Calendar;
