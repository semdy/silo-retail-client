require('./DataView.styl');

import ScrollNav from '../../components/ScrollNav';
import Stats from './Stats';
import Charts from './Charts';
import DateNavigator from './DateNavigator';
import { httpRequestReportPayment } from '../../services/auth';

const numOfDays = 15;

const formatTime = (time, bytype) => {
    switch (bytype){
      case 'hour':
        return new Date(time*1000).getHours();
      case 'day':
        return new Date(time*1000).getDate();
      case 'year':
        return new Date(time*1000).getFullYear();
    }
};

const formatAmout = (value) => {
    if( value/1e8 >= 1 ){
        return value/1e8;
    } else if( value/1e4 >= 1 ){
        return value/1e4;
    } else {
        return value;
    }
};

const getAmoutSuffix = (value) => {
  if( value/1e8 >= 1 ){
    return "亿";
  } else if( value/1e4 >= 1 ){
    return "万";
  } else {
    return "元";
  }
};

const getSum = (stack) => {
  if( !Array.isArray(stack) ) return 0;
  return stack.reduce((prevValue, curValue) => {
    return prevValue + curValue;
  }, 0);
};

const getDateBefore = ( numDays ) => {
    var now = new Date();
    now.setDate(now.getDate() - numDays);
    return now;
};

class Page extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isDataLoaded: false,
            activeIndex: 1,
            statsData: [
                {
                    name: "订单量",
                    value: 0
                },
                {
                    name: "营业额",
                    value: 0
                }
            ],
          chartData: {
            xAxisData: [],
            yAxis: {
              count: [],
              amount: []
            }
          }
        };
    }

    fetchData( day ){
      return httpRequestReportPayment('retail.payment.report.hour', 'Kp-FLKdBQmK-ctjDEF0XsQ', day);
    }

    componentDidMount(){
       Promise.all([this.fetchData(numOfDays), this.fetchData(numOfDays + 1)]).then(function(values){
          const data = values[0].data;
          const count = getSum(data.axisY.count);
          const amout = getSum(data.axisY.rmb);
          const yestodayData = values[1].data;

          this.setState({
            isDataLoaded: true,
            statsData: [
              {
                name: "订单量",
                suffix: "单",
                value: count
              },
              {
                name: "营业额",
                suffix: getAmoutSuffix(amout),
                value: formatAmout(amout)
              }
            ],
            chartData: {
              xAxisData: (data.axisX.time || []).map(function (item) {
                return formatTime(item, 'hour') + 'h';
              }),
              yAxis: {
                count: [data.axisY.count, yestodayData.axisY.count],
                amount: [data.axisY.rmb, yestodayData.axisY.rmb]
              }
            },
            date: getDateBefore(numOfDays)
          });
        }.bind(this));
    }

    leftBarClickHandle(){
        alert("left click");
    }

    rightBarClickHandle(){
        alert("right click");
    }

    render() {
        var components = "";
        if( this.state.isDataLoaded ){
          components = (
                <div>
                  <Stats statsData={this.state.statsData}>
                  </Stats>
                  <DateNavigator date={this.state.date}>
                  </DateNavigator>
                  <Charts statsData={this.state.statsData}
                          chartData={this.state.chartData}>
                  </Charts>
                </div>
            )
        }
        return (
            <div>
              <ScrollNav activeIndex={this.state.activeIndex}
                         showLeftBar={true}
                         showRightBar={true}
                         leftBarClick={this.leftBarClickHandle}
                         rightBarClick={this.rightBarClickHandle}>
              </ScrollNav>
              {components}
            </div>
        )

    }
}

module.exports = Page;
