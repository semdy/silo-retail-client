require('./PieChart.styl');

let {Context} = SaltUI;
let {PropTypes} = React;
import dom from '../../utils/dom';

class PieChart extends React.Component {

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

    window.addEventListener(Context.RESIZE, this.resizeHandler, false);

  }

  setPieSize(cb) {
    this.setState({
      pieWidth: window.innerWidth,
      pieHeight: Math.max(280, window.innerHeight - dom.offset(this.refs.chart).top - 10)
    }, cb);
  }

  componentWillUnmount() {
    window.removeEventListener(Context.RESIZE, this.resizeHandler, false);
    this.chartInstance.dispose();
  }

  refresh() {
    let chartData = this.props.chartData;
    this.chartInstance.clear();

    let chartOptions = {
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      legend: {
        x: 'center',
        data: chartData.legend.data
      },
      series: [
        {
          name: this.props.chartName,
          type: 'pie',
          center: ['50%', '62%'],
          radius: this.props.radius,
          data: chartData.series,
          label: {
            emphasis: {
              formatter: function (params) {
                var data = params.data;
                return [data.name, data.value[0], data.params.money].join('\n');
              }
            }
          }
        }
      ]
    };
    this.chartInstance.setOption(chartOptions);
  }

  render() {
    let {pieWidth, pieHeight} = this.state;
    return (
      <div className="card" style={{display: this.props.visible ? '' : 'none'}}>
        <div ref="chart"
             className="piechart"
             style={{
               width: pieWidth + "px",
               height: pieHeight + "px"
             }}
        >
        </div>
        <div className="piechart-title">
          {this.props.chartName}
        </div>
      </div>
    );
  }
}

PieChart.defaultProps = {
  chartName: '',
  responsive: false,
  radius: ['45%', '65%'],
  visible: true
};

PieChart.propTypes = {
  chartName: PropTypes.string.isRequired,
  responsive: PropTypes.bool,
  radius: PropTypes.arrayOf(
    PropTypes.string.isRequired
  ),
  visible: PropTypes.bool
};

module.exports = PieChart;
