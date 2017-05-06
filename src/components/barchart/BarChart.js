require('./BarChart.styl');

let {PropTypes} = React;
import classnames from 'classnames';
import dom from '../../utils/dom';
import Helper from '../helper';

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

    let chartOptions =  {
      color: ['#4db7cd'],
      tooltip : {
        trigger: 'axis',
        confine: true   //http://echarts.baidu.com/option.html#tooltip.confine
      },
      grid: {
        top: '20%',
        left: '3%',
        right: '3%',
        bottom: '5%',
        containLabel: this.props.showAxis
      },
      xAxis : [],
      yAxis : [
        {
          type : 'value',
          show: this.props.showAxis,
          max: this.props.yAxisMax,
          name: this.props.yAxisName
        }
      ],
      series : []
    };

    chartData.xAxis.forEach((item) => {
      chartOptions.xAxis.push(
        {
          type : 'category',
          name: this.props.xAxisName,
          show: this.props.showAxis,
          data : item.data,
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
          type:'bar',
          barWidth: '60%',
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
        <div className="barchart-title">
          <span>{chartName}</span>
          {
            helpText &&
            <Helper text={helpText} />
          }
        </div>
        <div ref="chart"
             className={classnames("barchart", {"chart-plain": !showAxis})}
             style={{
               width: width + "px",
               height: height + "px"
             }}
        >
        </div>
        {
          xAxisName &&
          <div className="barchart-xAxisName">{xAxisName}</div>
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
  yAxisName: PropTypes.string,
  xAxisName: PropTypes.string,
  helpText: PropTypes.string
};

module.exports = BarChart;
