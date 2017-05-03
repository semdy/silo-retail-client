require('./PieChart.styl');

let {PropTypes} = React;
import classnames from 'classnames';
import dom from '../../utils/dom';

class PieChart extends React.Component {

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
        height: Math.max(280, window.innerHeight - dom.offset(this.refs.chart).top - 10)
      }, cb);
    } else {
      this.setState({
        width: this.refs.chart.parentNode.offsetWidth
      }, cb);
    }
  }

  componentWillUnmount() {
    dom.off(window, 'resize', this.resizeHandler);
    this.chartInstance.dispose();
  }

  refresh() {
    let chartData = this.props.chartData;
    this.chartInstance.clear();

    let chartOptions = {
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)",
        confine: true   //http://echarts.baidu.com/option.html#tooltip.confine
      },
      legend: {
        show: this.props.showLegend,
        x: 'center',
        data: chartData.legend.data
      },
      series: [
        {
          name: this.props.chartName,
          type: 'pie',
          center: this.props.center,
          radius: this.props.radius,
          data: chartData.series,
          color: ["#f39726", '#008cee', '#3876c1', '#29ab91', '#f05a4b', '#f4b81c', '#30a3b6', '#2a81c4', '#f39a00'],
          label: {
            emphasis: {
              formatter: function (params) {
                let data = params.data;
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
    let {width, height} = this.state;
    return (
      <div className="card" style={{display: this.props.visible ? '' : 'none'}}>
        <div ref="chart"
             className="piechart"
             style={{
               width: width + "px",
               height: height + "px"
             }}
        >
        </div>
        <div className={classnames("piechart-title", {center: !this.props.showLegend})}>
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
  center: ['50%', '62%'],
  visible: true,
  showLegend: true,
  width: window.innerWidth
};

PieChart.propTypes = {
  chartName: PropTypes.string.isRequired,
  responsive: PropTypes.bool,
  radius: PropTypes.arrayOf(
    PropTypes.string.isRequired
  ),
  visible: PropTypes.bool,
  showLegend: PropTypes.bool,
  width: PropTypes.number,
  height: PropTypes.number
};

module.exports = PieChart;
