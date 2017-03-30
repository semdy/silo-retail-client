require('./Charts.styl');

let {Icon} = SaltUI;
import classnames from 'classnames';
import reactMixin from 'react-mixin';
import actions from '../../app/actions';
import store from  '../../app/store';
import dom from '../../utils/dom';
import locale from '../../locale';

const getMax = (group) => {
  if (!Array.isArray(group)) return 0;
  return Math.max.apply(Math, group);
};

//计算订单量Y轴的最大值并放大2倍，以防止柱状图过高
const getSumMax = (yAxisCounts) => {
  let yAxisMax = 0;
  yAxisCounts.forEach((count) => {
    if (!count.length) {
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
      isFullScreen: false,
      width: window.innerWidth + "px",
      height: window.innerHeight + "px"
    };
    this._lastScreenState = this.state.isFullScreen;
    this._lastLegendPadding = 0;
    this.chartInstance = null;
    this.docBody = document.body;
  }

  componentDidMount() {
    let timeout;
    this.chartInstance = echarts.init(this.refs.chart);
    this.resizeHandler = () => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        this.setState({
          width: window.innerWidth + "px",
          height: window.innerHeight + "px"
        });
        this.chartInstance.resize();
      }, 100);
    };

    this.refresh();
    dom.on(window, "resize", this.resizeHandler);
  }

  refresh() {
    const {chartData} = this.props;
    const yAxisCount = chartData.yAxis.count;
    const yAxisMax = getSumMax(yAxisCount);

    this.chartInstance.clear();
    let splitStyle = {
      lineStyle: {
        color: ["#ddd"],
        type: 'dashed'
      }
    };

    let chartOptions = {
      title: {
        text: ''
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        width: 250,
        left: "center",
        padding: this._lastLegendPadding,
        itemGap: 5,
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
      xAxis: [
        {
          type: 'category',
          data: chartData.xAxisData
        }
      ],
      yAxis: [
        {
          type: 'value',
          max: yAxisMax - (yAxisMax > 50 ? yAxisMax % 50 : 0), //将最大值设为50的整数倍
          name: locale.totalOrder,
          splitLine: splitStyle
        },
        {
          type: 'value',
          name: locale.totalAmount,
          splitLine: splitStyle
        }
      ],
      series: []
    };

    let drawColors = ["#4db7cd", "#ffdb73", "#a191d8"];

    if (yAxisCount.length > 2) {
      chartOptions.legend.itemHeight = 11;
      chartOptions.legend.top = -5;
    }

    yAxisCount.forEach((itemData, index) => {
      chartOptions.legend.data = chartData.legendNames;
      chartOptions.series.push({
          name: chartData.legendNames[index * 2],
          type: 'bar',
          stack: 'one',
          smooth: true,
          yAxisIndex: 0,
          color: [drawColors[index]],
          barCategoryGap: '50%',
          data: itemData
        },
        {
          name: chartData.legendNames[index * 2 + 1],
          type: 'line',
          stack: '',
          smooth: true,
          yAxisIndex: 1,
          color: [drawColors[index]],
          data: chartData.yAxis.amount[index]
        });
    });

    this.chartInstance.setOption(chartOptions);

  }

  hideToolTip() {
    this.chartInstance.dispatchAction({
      type: 'hideTip'
    });
  }

  componentWillUnmount() {
    dom.off(window, "resize", this.resizeHandle);
    this.chartInstance.dispose();
  }

  componentDidUpdate(prevProps, prevState) {
    let {isFullScreen} = this.state;
    //控制只在全屏和非全屏切换时去触发resize
    if (this._lastScreenState !== isFullScreen) {
      setTimeout(() => {
        this.chartInstance.resize();
        this.chartInstance.setOption({
          legend: {
            padding: this._lastLegendPadding = (isFullScreen ? [10, 5, 5, 5] : 0)
          }
        });
      }, 20);

      if (isFullScreen) {
        dom.addClass(this.docBody, "page-fullscreen");
        actions.setP2rEnabled(false);
      } else {
        dom.removeClass(this.docBody, "page-fullscreen");
        actions.setP2rEnabled(true);
      }

    }

    this._lastScreenState = isFullScreen;
  }

  changeViewMode() {
    actions.setFullScreen(this.state.isFullScreen = !this.state.isFullScreen);
  }

  render() {
    let {isFullScreen, width, height} = this.state;
    return (
      <div className={classnames("card charts-container", {"charts-fullscreen": isFullScreen})}>
        <span className={classnames("tool-fullscreen", {open: isFullScreen})}
              onClick={this.changeViewMode.bind(this)} style={{display: ""}}>
          <Icon name={isFullScreen ? 'portrait' : 'fullscreen'} width={24} height={24} />
        </span>
        <div ref="chart" className="charts-main"
             style={{
               left: isFullScreen ? -parseFloat(height) * 0.5 + "px" : 0,
               top: isFullScreen ? -(parseFloat(width) - 70) * 0.5 + "px" : 0,
               width: isFullScreen ? height : width,
               height: isFullScreen ? parseFloat(width) - 70 : Math.max(parseFloat(height) - 273, 300) + "px"
             }}>
        </div>
      </div>
    );
  }
}

reactMixin.onClass(Charts, Reflux.connect(store));

module.exports = Charts;
