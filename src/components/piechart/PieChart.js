require('./PieChart.styl');

let {Context} = SaltUI;
let {PropTypes} = React;

class PieChart extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      height: 0
    };
  }

  componentDidMount() {
    let self = this;
    let timeout;

    this.setState({
      height: window.innerHeight - $(this.refs.chart).offset().top - 10 + "px"
    }, () => {
      this.chartInstance = echarts.init(this.refs.chart);
    });

    this.resizeHandler = () => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        self.chartInstance.resize();
      }, 50);
    };

    window.addEventListener(Context.RESIZE, this.resizeHandler, false);

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
          radius: ['40%', '65%'],
          data: chartData.series
        }
      ]
    };
    this.chartInstance.setOption(chartOptions);
  }

  render() {
    return (
      <div className="card distribution">
        <div ref="chart"
             className="distribute-chart"
             style={{
               height: this.state.height
             }}
        >
        </div>
        <div className="distribute-title">
          {this.props.chartName}
        </div>
      </div>
    );
  }
}

PieChart.defaultProps = {
  chartName: '',
};

PieChart.propTypes = {
  chartName: PropTypes.string.isRequired
};

module.exports = PieChart;
