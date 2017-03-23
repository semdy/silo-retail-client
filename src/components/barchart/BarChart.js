require('./BarChart.styl');

let {PropTypes} = React;
import dom from '../../utils/dom';

class BarChart extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      pieWidth: '',
      pieHeight: ''
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
        if (responsive) {
          this.setPieSize(() => {
            this.chartInstance.resize();
          });
        } else {
          this.chartInstance.resize();
        }
      }, 50);
    };

    dom.on(window, "resize", this.resizeHandler);

  }

  setPieSize(cb) {
    this.setState({
      pieWidth: window.innerWidth,
      pieHeight: window.innerHeight - dom.offset(this.refs.chart).top - 10
    }, cb);
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
        trigger: 'axis'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis : [],
      yAxis : [
        {
          type : 'value'
        }
      ],
      series : []
    };

    chartData.xAxis.forEach((item) => {
      chartOptions.xAxis.push(
        {
          type : 'category',
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
    let {pieWidth, pieHeight} = this.state;
    return (
      <div className="card">
        <div className="barchart-title">
          {this.props.chartName}
        </div>
        <div ref="chart"
             className="barchart"
             style={{
               width: pieWidth + "px",
               height: pieHeight + "px"
             }}
        >
        </div>
      </div>
    );
  }
}

BarChart.defaultProps = {
  chartName: '',
  responsive: false,
  radius: ['45%', '65%'],
  visible: true
};

BarChart.propTypes = {
  chartName: PropTypes.string.isRequired,
  responsive: PropTypes.bool,
  radius: PropTypes.arrayOf(
    PropTypes.string.isRequired
  ),
  visible: PropTypes.bool
};

module.exports = BarChart;
