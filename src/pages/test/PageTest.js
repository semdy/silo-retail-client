require('./PageTest.styl');

let {Button} = SaltUI;

import Calendar from '../../components/calendar';
import {getWeekNumber} from '../../utils/date';

function getCalendarText(date) {
  return date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日'
}

class Test extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      show: false,
      show2: false,
      locale: 'zh-cn',
      date: [new Date()]
    }
  }

  _handleClick() {
    this.setState({
      show: true
    });
  }

  _handleClick2() {
    let t = this;
    t.setState({
      show2: true
    });
  }


  onCloseCalendar() {
    let t = this;
    t.setState({
      show: false
    });
  }

  onCloseCalendar2() {
    let t = this;
    t.setState({
      show2: false
    });
  }

  handleCalendarData(values) {
    alert(JSON.stringify(values));
    let t = this;
    t.setState({
      show: false
    });
  }

  handleCalendarData2(values) {
    alert(JSON.stringify(values));
    let t = this;
    t.setState({
      show2: false
    });
  }

  handleConfirm(date){
    this.setState({
      date: Array.isArray(date) ? date : [date]
    });
  }

  handleLeave(){
    this.setState({
      show: false
    });
  }

  render() {
    let t = this;
    return (
      <div className="tCalendarDemo">
        <div>
          {
            this.state.date.map((date, i) => {
              return <p key={i}>{getCalendarText(date)}</p>
            })
          }
        </div>
        <Button onClick={t._handleClick.bind(t)}>点我选择日期</Button>
        <Button type="secondary" onClick={t._handleClick2.bind(t)}>点我选择日期(月面板)</Button>
        {/*<Calendar visible={t.state.show}
                  singleMode={true}
                  value={'2015-10-03'}
                  showHalfDay={false}
                  showTopPanel={true}
                  showBottomPanel={false}
                  topPanelTitle={"请选择时间"}
                  onCancel={t.onCloseCalendar.bind(t)}
                  onOk={t.handleCalendarData.bind(t)}
                  locale={t.state.locale}
        />
        <Calendar.MonthCalendar
          visible={t.state.show2}
          singleMode={false}
          onCancel={t.onCloseCalendar2.bind(t)}
          onOk={t.handleCalendarData2.bind(t)}
          locale={t.state.locale}
        />*/}
        <Calendar visible={this.state.show}
                  onConfirm={this.handleConfirm.bind(this)}
                  onLeave={this.handleLeave.bind(this)}
                 /* min="2016-10-31"
                  max="2027-02-26"*/
        >
        </Calendar>
      </div>

    );
  }

  componentWillMount() {
  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  componentWillUpdate(nextProps, nextState) {
  }

  componentDidUpdate(prevProps, prevState) {
  }

  componentWillUnmount() {
  }
}

module.exports = Test;
