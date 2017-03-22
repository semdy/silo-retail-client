require('./DateNavigator.styl');

let {Icon, Context} = SaltUI;
let { PropTypes } = React;
import classnames from 'classnames';

const formatDate = (dateUTC) => {
  var year = dateUTC.getFullYear() + "年";
  var month = (dateUTC.getMonth() + 1) + "月";
  var date = dateUTC.getDate() + "日";
  return `${year}${month}${date}`;
};

const getDay = (dateUTC) => {
  var n = ["日", "一", "二", "三", "四", "五", "六"];
  return n[dateUTC.getDay()];
};

class DateNavigator extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {date, nextDisabled, onPrev, onNext, storeName} = this.props;

    return (
      <div className="date-navigator normal">
        <div className="t-clear">
          <div className="store-name t-FL">{storeName}店</div>
          <div className="t-FR t-FBH t-FBAC t-FBJC store-indict">
            <Icon name="angle-left" className="date-arrow left" onClick={onPrev}/>
            <Icon name="calendar" className="date-cld" width={15} height={15}/>
            <span className="date">{formatDate(date)}</span>
            <span className="day">{`星期${getDay(date)}`}</span>
            <Icon name="angle-right" className={classnames("date-arrow right", {disabled: nextDisabled})}
                  onClick={onNext}/>
          </div>
        </div>
      </div>
    );
  }
}

DateNavigator.propTypes = {
  date: PropTypes.instanceOf(Date),
  nextDisabled: PropTypes.bool,
  onPrev: PropTypes.func,
  onNext: PropTypes.func,
  storeName: PropTypes.string,
};

DateNavigator.defaultProps = {
  date: new Date(),
  nextDisabled: true,
  onPrev: Context.noop,
  onNext: Context.noop,
  storeName: ''
};

module.exports = DateNavigator;
