require('./DateNavigator.styl');

const formatDate = (dateUTC) => {
  var year = dateUTC.getFullYear();
  var month = dateUTC.getMonth() + 1;
  var date = dateUTC.getDate();
  return `${year}年${month}月${date}日`;
};

const getDay = (dateUTC) => {
  var n = ["日", "一", "二", "三",  "四",  "五", "六"];
  return n[dateUTC.getDay()];
};

class DateNavigator extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        const {date} = this.props;
        return (<div className="date-navigator">
            <span className="date">{formatDate(date)}</span>
            <span className="day">{`星期${getDay(date)}`}</span>
        </div>);
    }
}

module.exports = DateNavigator;
