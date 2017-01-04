require('./DataView.styl');

import ScrollNav from '../../components/ScrollNav';
import Stats from './Stats';
import Charts from './Charts';
import { httpRequestReportPayment } from '../../services/auth';

function formatTime(time, bytype) {
    switch (bytype){
      case 'hour':
        return new Date(time*1000).getHours();
      case 'day':
        return new Date(time*1000).getDate();
      case 'year':
        return new Date(time*1000).getFullYear();
    }
}

function formatAmout(value) {
    if( value/1e8 >= 1 ){
        return value/1e8;
    } else if( value/1e4 >= 1 ){
        return value/1e4;
    } else {
        return value;
    }
}

function getAmoutSuffix(value) {
  if( value/1e8 >= 1 ){
    return "亿";
  } else if( value/1e4 >= 1 ){
    return "万";
  } else {
    return "元";
  }
}

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

    componentDidMount(){
        httpRequestReportPayment('retail.payment.report.hour', 'Kp-FLKdBQmK-ctjDEF0XsQ', 6).then(function(res){
          var data = res.data;
          var count = (data.axisY.count || []).reduce((prevValue, curValue) => {
            return prevValue + curValue;
          });
          var amout = (data.axisY.rmb || []).reduce((prevValue, curValue) => {
            return prevValue + curValue;
          });

          this.setState({
            isDataLoaded: true,
            statsData: [
              {
                name: "订单量",
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
                count: data.axisY.count,
                amount: data.axisY.rmb
              }
            }
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
                  <Stats statsData={this.state.statsData}></Stats>
                  <Charts statsData={this.state.statsData} chartData={this.state.chartData}></Charts>
                </div>
            )
        }
        return (
            <div>
              <ScrollNav activeIndex={this.state.activeIndex} showLeftBar="true" showRightBar="true" leftBarClick={this.leftBarClickHandle} rightBarClick={this.rightBarClickHandle}></ScrollNav>
              {components}
            </div>
        )

    }
}

module.exports = Page;
