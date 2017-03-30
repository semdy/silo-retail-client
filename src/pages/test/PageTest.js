require('./PageTest.styl');

let {Calendar, Button} = SaltUI;

class Test extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      show: false,
      show2: false,
      locale: 'zh-cn'
    }
  }

  _handleClick() {
    let t = this;
    t.setState({
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

  render() {
    let t = this;
    return (
      <div className="tCalendarDemo">
        <Button onClick={t._handleClick.bind(t)}>点我选择日期</Button>
        <Button type="secondary" onClick={t._handleClick2.bind(t)}>点我选择日期(月面板)</Button>
        <Calendar visible={t.state.show}
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
        />
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
