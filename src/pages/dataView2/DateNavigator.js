require('./DateNavigator.styl');

let { Icon, Button } = SaltUI;
import ButtonGroup from '../../components/ButtonGroup';
import DropDown from '../../components/DropDown';
import classnames from 'classnames';
import reactMixin from 'react-mixin';
import store from  '../../app/store';

const formatDate = (dateUTC, timelines, filterType) => {
  if( /^(?:hour|day)$/.test(filterType) ) {
    var year = dateUTC.getFullYear() + "年";
    var month = (dateUTC.getMonth() + 1) + "月";
    var date = filterType === 'hour' ? dateUTC.getDate() + "日" : "";
    return `${year}${month}${date}`;
  } else {
    if( filterType == 'year' ){
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

const getFilterTypeIndex = (options, type) => {
    for(let i = 0; i < options.length; i++){
      if( options[i].value === type )
        return i;
    }

    return 0;
};

class DateNavigator extends React.Component {

  constructor(props) {
      super(props);
      this.filterType = this.props.defaultFilterType;
      let options = [
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
      ];

      this.state = {
        activeIndex: getFilterTypeIndex(options, this.filterType),
        width: window.innerWidth,
        height: window.innerHeight,
        options: options
      };
  }

  itemClick(itemIndex, filterType){
    if( itemIndex === this.state.activeIndex ) return;
    this.setState({
      activeIndex: itemIndex
    }, () => {
      this.filterType = filterType;
    });
    this.props.onItemClick(filterType);
  }

  render() {
      const {date, nextDisabled, diffDisabled, onPrev, onNext, hideDiff, timelines} = this.props;
      let { width, height, options, isFullScreen } = this.state;
      let dateIndicator = (
        <div>
          <Icon name="angle-left" className="date-arrow left" onClick={onPrev} />
          <span className="date">{formatDate(date, timelines, this.filterType)}</span>
          <span className="day">{this.filterType !== 'hour' ? "" : `星期${getDay(date)}`}</span>
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
                <DropDown options={options} activeIndex={this.state.activeIndex} onItemClick={this.itemClick.bind(this)}>
                </DropDown>
                {dateIndicator}
                {hideDiff ? "" :
                  <div className="diff-toggle" onClick={this.props.toggleDiff}>
                    <Button type="text">
                      环比
                      <Icon name="check" className={classnames("icon-has-bg", {disabled: diffDisabled})}
                            width={16}
                            height={16}
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

reactMixin.onClass(DateNavigator, Reflux.connect(store));

module.exports = DateNavigator;
