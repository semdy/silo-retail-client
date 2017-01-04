require('./Charts.styl');

class Charts extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        };
        this.chartInstance = null;
    }

    componentDidMount(){
      this.chartInstance = echarts.init(this.refs.chart);
      this.chartInstance.setOption({
        title: {
          text: ''
        },
        tooltip : {
          trigger: 'axis'
        },
        legend: {
          data: this.props.statsData.map(function (prop) {
            return prop.name;
          })
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis : [
          {
            type : 'category',
            boundaryGap : false,
            data : this.props.chartData.xAxisData
          }
        ],
        yAxis : [
          {
            type : 'value',
            name: this.props.statsData[0].name
          },
          {
            type : 'value',
            name: this.props.statsData[1].name
          }
        ],
        series : [
          {
            name: this.props.statsData[0].name,
            type:'line',
            stack: '总量',
            smooth: true,
            yAxisIndex: 0,
            color: ["#2c51ff"],
            areaStyle: {normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0, color: 'rgba(44,81,255,0.6)'
              }, {
                offset: 1, color: 'rgba(44,81,255,0.4)'
              }], false)
            }},
            data: this.props.chartData.yAxis.count
          },
          {
            name: this.props.statsData[1].name,
            type:'line',
            stack: '总量',
            smooth: true,
            yAxisIndex: 1,
            color: ["#7160f2"],
            areaStyle: {normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0, color: 'rgba(113,96,242,0.9)'
              }, {
                offset: 1, color: 'rgba(113,96,242,0.4)'
              }], false)
            }},
            data: this.props.chartData.yAxis.amount
          }
        ]
      });
    }

    componentWillUnmount(){
        this.chartInstance.dispose();
    }

    render() {
        return (<div className="charts-container">
                <div ref="chart" className="charts-main" style={{height: window.innerHeight - 188 + "px"}}></div>
            </div>
        );
    }
}

module.exports = Charts;
