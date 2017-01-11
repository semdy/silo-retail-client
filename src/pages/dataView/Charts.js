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

//计算订单量Y轴的最大值并放大2倍，以防止柱状图过高
const getSumMax = ( yAxisCounts ) => {
  let yAxisMax = 0;
  yAxisCounts.forEach((count) => {
    if( !count.length ){
      yAxisMax += 0;
    } else {
      yAxisMax += getMax(count);
    }
  });

  return yAxisMax * 2;
};

class Charts extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          isFullScreen: false
        };
        this.chartInstance = null;
    }

    componentDidMount(){
      this.chartInstance = echarts.init(this.refs.chart);
      this.setOption();
    }

    setOption(){
      const {statsData, chartData} = this.props;
      const yAxisCount = chartData.yAxis.count;
      const yAxisMax = getSumMax(yAxisCount);

      this.chartInstance.clear();
      let chartOptions = {
        title: {
          text: ''
        },
        tooltip : {
          trigger: 'axis'
        },
        legend: {
          width: 250,
          left: "center",
          data: []
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
            data : chartData.xAxisData
          }
        ],
        yAxis : [
          {
            type : 'value',
            max: yAxisMax - (yAxisMax > 50 ? yAxisMax%50 : 0), //将最大值设为50的整数倍
            name: statsData[0].name
          },
          {
            type : 'value',
            name: statsData[1].name
          }
        ],
        series: []
      };

      let drawColors = ["#4db7cd", "#ffdb73", "#a191d8"];

      if( yAxisCount.length > 2 ){
        chartOptions.legend.itemHeight = 11;
        chartOptions.legend.top = -5;
      }

      chartData.yAxis.count.forEach((itemData, index) => {
        chartOptions.legend.data = chartData.legendNames;
        chartOptions.series.push({
            name: chartData.legendNames[index*2],
            type:'bar',
            stack: 'one',
            smooth: true,
            yAxisIndex: 0,
            color: [drawColors[index]],
            barCategoryGap: '50%',
            data: itemData
          },
          {
            name: chartData.legendNames[index*2 + 1],
            type:'line',
            stack: '',
            smooth: true,
            yAxisIndex: 1,
            color: [drawColors[index]],
            data: chartData.yAxis.amount[index]
          });
      });

      this.chartInstance.setOption(chartOptions);
    }

    componentWillUnmount(){
        this.chartInstance.dispose();
    }

    changeViewMode(){
      this.setState({
        isFullScreen: !this.state.isFullScreen
      });
    }

    render() {
      let { isFullScreen } = this.state;
      return (<div className={"charts-container " + ( isFullScreen ? "charts-fullscreen" : "" )}>
              {/*<span className={"tool-fullscreen " + (isFullScreen ? "open" : "")} onClick={this.changeViewMode.bind(this)}></span>*/}
              <div ref="chart" className="charts-main" style={{width: isFullScreen ? window.innerHeight + "px" : "100%", height: isFullScreen ? window.innerWidth + "px" : window.innerHeight - 243 + "px"}}></div>
          </div>
      );
    }
}

module.exports = Charts;
