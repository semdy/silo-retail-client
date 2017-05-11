require('./LineChart.styl');

let {PropTypes} = React;
import classnames from 'classnames';
import dom from '../../utils/dom';

class BarChart extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      width: this.props.width,
      height: this.props.height
    };
  }

  componentDidMount() {
    let timeout;
    let responsive = this.props.responsive;

    if (responsive) {
      this.setPieSize(() => {
        this.chartInstance = echarts.init(this.refs.chart);
      });
    } else {
      this.chartInstance = echarts.init(this.refs.chart);
    }

    this.resizeHandler = () => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        this.setPieSize(() => {
          this.chartInstance.resize();
        });
      }, 50);
    };

    dom.on(window, "resize", this.resizeHandler);

  }

  setPieSize(cb) {
    let responsive = this.props.responsive;
    if (responsive) {
      this.setState({
        width: window.innerWidth,
        height: window.innerHeight - dom.offset(this.refs.chart).top - 10
      }, cb);
    } else {
      this.setState({
        width: this.refs.chart.parentNode.offsetWidth
      }, cb);
    }
  }

  componentWillUnmount() {
    dom.off(window, "resize", this.resizeHandler);
    this.chartInstance.dispose();
  }

  refresh() {
    let chartData = this.props.chartData;
    this.chartInstance.clear();

    let splitStyle = {
      lineStyle: {
        color: ["#ddd"],
        type: 'dashed'
      }
    };

    let chartOptions = {
      color: this.props.color,
      tooltip: {
        trigger: 'axis',
        confine: true   //http://echarts.baidu.com/option.html#tooltip.confine
      },
      legend: chartData.legend,
      grid: {
        top: '20%',
        left: '3%',
        right: '3%',
        bottom: '5%',
        containLabel: this.props.showAxis
      },
      xAxis: [],
      yAxis: [],
      series: []
    };

    chartData.xAxis.forEach((item) => {
      chartOptions.xAxis.push(
        {
          type: 'category',
          name: this.props.xAxisName,
          show: this.props.showAxis,
          data: item.data,
          axisTick: {
            alignWithLabel: true
          }
        }
      );
    });

    if( Array.isArray(chartData.yAxis) ) {
      chartData.yAxis.forEach((item) => {
        chartOptions.yAxis.push(
          {
            type: 'value',
            max: item.max,
            name: item.name,
            splitLine: splitStyle
          }
        );
      });
    } else {
      chartOptions.yAxis.push({
        type: 'value',
        show: this.props.showAxis,
        max: this.props.yAxisMax,
        name: this.props.yAxisName,
        splitLine: splitStyle
      });
    }

    chartData.series.forEach((item, i) => {
      chartOptions.series.push(
        {
          name: item.name || this.props.chartName,
          type: item.type || 'line',
          barCategoryGap: item.barCategoryGap,
          smooth: item.smooth || this.props.smooth,
          yAxisIndex: i,
          color: item.color || this.props.color,
          areaStyle: item.areaColor && {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0, color: item.areaColor[0] // 0% 处的颜色
              }, {
                offset: 1, color: item.areaColor[1] // 100% 处的颜色
              }], false)
            }
          },
          data: item.data
        }
      );
    });

    this.chartInstance.setOption(chartOptions);
  }

  render() {
    let {width, height} = this.state;
    let {chartName, helpText, showAxis, xAxisName} = this.props;
    return (
      <div className="card">
        { chartName &&
          <div className="linechart-title">
            <span>{chartName}</span>
            {
              helpText &&
              <Helper text={helpText}/>
            }
          </div>
        }
        <div ref="chart"
             className={classnames("linechart", {"chart-plain": !showAxis})}
             style={{
               width: width + "px",
               height: height + "px"
             }}
        >
        </div>
        {
          xAxisName &&
          <div className="linechart-xAxisName">{xAxisName}</div>
        }
      </div>
    );
  }
}

BarChart.defaultProps = {
  chartName: '',
  responsive: false,
  radius: ['45%', '65%'],
  color: ['#f39726'],
  //areaColor: ['rgba(243,151,38,.8)', 'rgba(243,151,38,.02)'],
  visible: true,
  showAxis: true,
  showAreaStyle: false,
  smooth: false,
  width: window.innerWidth,
  yAxisName: '',
  xAxisName: '',
  helpText: ''
};

BarChart.propTypes = {
  chartName: PropTypes.string.isRequired,
  responsive: PropTypes.bool,
  radius: PropTypes.arrayOf(
    PropTypes.string.isRequired
  ),
  color: PropTypes.arrayOf(
    PropTypes.string.isRequired
  ),
  smooth: PropTypes.bool,
  visible: PropTypes.bool,
  showAxis: PropTypes.bool,
  width: PropTypes.number,
  height: PropTypes.number,
  yAxisMax: PropTypes.number,
  showAreaStyle: PropTypes.bool,
  yAxisName: PropTypes.string,
  xAxisName: PropTypes.string,
  helpText: PropTypes.string
};

module.exports = BarChart;
