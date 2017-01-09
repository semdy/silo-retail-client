require('./Charts.styl');

const getChartBackground = (topColor, bottomColor) => {
  return {normal: {
    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
      offset: 0, color: topColor
    }, {
      offset: 1, color: bottomColor
    }], false)
  }}
};

const getMax = (group) => {
  if( !Array.isArray(group) ) return 0;
  return Math.max.apply(Math, group);
};

class Charts extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        };
        this.chartInstance = null;
    }

    componentDidMount(){
      const {statsData, chartData} = this.props;
      //计算订单量Y轴的最大值并放大2倍，以防止柱状图过高
      const yAxisMax = (getMax(chartData.yAxis.count[0]) + getMax(chartData.yAxis.count[1]))*2;
      this.chartInstance = echarts.init(this.refs.chart);
      this.chartInstance.setOption({
        title: {
          text: ''
        },
        tooltip : {
          trigger: 'axis'
        },
        legend: {
          width: 200,
          left: "center",
          data: statsData.concat(statsData).map(function (prop, i) {
            return (i < 2 ? "今日" : "昨日") + prop.name;
          })
        },
        toolbox: {
          show: false,
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
            data : chartData.xAxisData
          }
        ],
        yAxis : [
          {
            type : 'value',
            max: yAxisMax - yAxisMax%50, //将最大值设为50的整数倍
            name: statsData[0].name
          },
          {
            type : 'value',
            name: statsData[1].name
          }
        ],
        series : [
          {
            name: `今日${statsData[0].name}`,
            type:'bar',
            stack: 'one',
            smooth: true,
            yAxisIndex: 0,
            color: ["#4db7cd"],
            barCategoryGap: '50%',
            //areaStyle: getChartBackground('rgba(44,81,255,0.6)', 'rgba(44,81,255,0.4)'),
            data: chartData.yAxis.count[0]
          },
          {
            name: `今日${statsData[1].name}`,
            type:'line',
            stack: '',
            smooth: true,
            yAxisIndex: 1,
            color: ["#4db7cd"],
            data: chartData.yAxis.amount[0]
          },
          {
            name: `昨日${statsData[0].name}`,
            type:'bar',
            stack: 'one',
            smooth: true,
            yAxisIndex: 0,
            color: ["#ffbe00"],
            barCategoryGap: '50%',
            data: chartData.yAxis.count[1]
          },
          {
            name: `昨日${statsData[1].name}`,
            type:'line',
            stack: '',
            smooth: true,
            yAxisIndex: 1,
            color: ["#ffbe00"],
            data: chartData.yAxis.amount[1]
          }
        ]
      });
    }

    componentWillUnmount(){
        this.chartInstance.dispose();
    }

    render() {
        return (<div className="charts-container">
                <div ref="chart" className="charts-main" style={{height: window.innerHeight - 243 + "px"}}></div>
            </div>
        );
    }
}

module.exports = Charts;
