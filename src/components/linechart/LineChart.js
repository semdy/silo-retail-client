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

    let chartOptions = {
      color: ['#f39726'],
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [],
      yAxis: [
        {
          type: 'value',
          show: this.props.showAxis,
          max: this.props.yAxisMax,
          name: this.props.yAxisName
        }
      ],
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

    chartData.series.forEach((item) => {
      chartOptions.series.push(
        {
          name: this.props.chartName,
          type: 'line',
          areaStyle: this.props.showAreaStyle && {normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0, color: 'rgba(243,151,38,.8)' // 0% 处的颜色
            }, {
              offset: 1, color: 'rgba(243,151,38,.02)' // 100% 处的颜色
            }], false)
          }},
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
        <div className="linechart-title">
          <span>{chartName}</span>
          {
            helpText &&
            <Helper text={helpText} />
          }
        </div>
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
  visible: true,
  showAxis: true,
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
