require('./DateNavigator.styl');

let {Icon, Button} = SaltUI;
import ButtonGroup from '../../components/ButtonGroup';
import Calendar from '../../components/calendar';
import classnames from 'classnames';
import reactMixin from 'react-mixin';
import actions from '../../app/actions';
import store from  '../../app/store';
import dom from '../../utils/dom';
import {getDateBefore} from '../../utils';
import locale from '../../locale';

const formatDate = (dateUTC, timelines, filterType) => {
  if (/^(?:hour|day)$/.test(filterType)) {
    let year = dateUTC.getFullYear() + locale.year;
    let month = (dateUTC.getMonth() + 1) + locale.month;
    let date = filterType === 'hour' ? dateUTC.getDate() + locale.day : "";
    return `${year}${month}${date}`;
  } else {
    if (filterType === 'year') {
      return [timelines[0].substr(5), timelines[timelines.length - 1].substr(5)].join("~");
    } else {
      return [timelines[0], timelines[timelines.length - 1]].join("~");
    }
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
      date: new Date(),
      showCalendar: false
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
      activeIndex: itemIndex,
      filterType: filterType
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

  handleConfirm(date){
    this.setState({
      date: date
    });
  }

  handleLeave(){
    this.setState({
      showCalendar: false
    });
  }

  render() {
    let {width, height, isFullScreen, offset, store, activeIndex, timelines, filterType, showCalendar} = this.state;
    let date = getDateBefore(offset);
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
                  onConfirm={this.handleConfirm.bind(this)}
                  onLeave={this.handleLeave.bind(this)}
        />
      </div>
    )
  }
}

reactMixin.onClass(DateNavigator, Reflux.connect(store));

module.exports = DateNavigator;
