require('./PassFlowWeatherCharts.styl');

import BaseChart from '../../components/baseChart';
import {getStoreChartReport, fetchReportPayment} from '../../services/store';
import {getWeekNumber} from '../../utils/date';
import locale from '../../locale';

//格式化时间, 带上年份方便后续排序
const formatTime = (time, formatType) => {
  let ret = 0;
  let date = new Date(time * 1000);
  switch (formatType) {
    case 'hour':
      ret = date.getHours();
      break;
    case 'day':
      ret = date.getDate();
      break;
    case 'week':
      ret = getWeekNumber(date);
      break;
    case 'month':
      ret = date.getMonth() + 1;
      break;
    case 'quarter':
      ret = Math.ceil((date.getMonth() + 1) / 3);
      break;
    case 'year':
      ret = date.getFullYear();
      break;
  }

  return ret;
};

const UNIT_MAP = {
  hour: 'h',
  day: locale.day,
  week: locale.weekly,
  month: locale.month,
  quarter: locale.quarter,
  year: locale.year
};

const skyIconsMap = {
  rain: [
    "M137.201,77.386c-2.406,0-4.357-1.957-4.357-4.371c0-23.712-19.232-43.003-42.875-43.003c-23.641,0-42.875,19.291-42.875,43.003c0.001,2.414-1.949,4.371-4.355,4.372c-2.407,0.001-4.359-1.955-4.36-4.369c0-0.001,0-0.002,0-0.003c0-28.532,23.144-51.745,51.591-51.745c28.447,0,51.59,23.212,51.59,51.745C141.56,75.429,139.608,77.386,137.201,77.386z",
    "M157.598,141.041H41.78c-19.901,0-36.091-16.238-36.091-36.199c0-19.959,16.19-36.198,36.091-36.198c2.407,0,4.358,1.957,4.358,4.371s-1.951,4.371-4.358,4.371l0,0c-15.095,0-27.375,12.317-27.375,27.457c0,15.141,12.281,27.457,27.375,27.457h115.818c15.094,0,27.376-12.316,27.376-27.457c0-15.139-12.282-27.457-27.376-27.457c-2.407,0-4.358-1.957-4.358-4.371s1.951-4.371,4.358-4.371c19.899,0,36.091,16.239,36.091,36.198C193.688,124.803,177.497,141.041,157.598,141.041L157.598,141.041z",
    "M157.598,77.386h-34.887c-2.407,0-4.358-1.957-4.358-4.371c0-2.414,1.951-4.371,4.358-4.371h34.887c2.406,0,4.357,1.957,4.357,4.371C161.955,75.429,160.004,77.386,157.598,77.386z M36.35,179.044c-2.406,0.002-4.359-1.954-4.36-4.368c-0.001-1.352,0.622-2.628,1.688-3.457l27.719-21.557c1.885-1.502,4.626-1.188,6.123,0.702c1.498,1.89,1.184,4.64-0.7,6.142c-0.027,0.021-0.055,0.043-0.082,0.064l-27.719,21.557C38.255,178.722,37.316,179.045,36.35,179.044z M76.815,179.044c-2.407,0.002-4.359-1.954-4.361-4.368c-0.001-1.352,0.622-2.628,1.688-3.457l27.718-21.557c1.886-1.502,4.626-1.188,6.124,0.702c1.497,1.89,1.184,4.64-0.7,6.142c-0.027,0.021-0.055,0.043-0.083,0.064l-27.719,21.557C78.72,178.722,77.781,179.045,76.815,179.044z M117.28,179.044c-2.405,0.002-4.358-1.954-4.36-4.368c0-1.352,0.623-2.628,1.688-3.457l27.718-21.557c1.886-1.502,4.625-1.188,6.123,0.702c1.497,1.89,1.184,4.64-0.699,6.142c-0.027,0.021-0.055,0.043-0.084,0.064l-27.719,21.557C119.187,178.722,118.248,179.045,117.28,179.044z"
  ],
  cloudy: [
    "M163.39,148.646H98.599c-15.775,0-28.609-12.802-28.609-28.536c0-15.633,12.666-28.37,28.3-28.536c0.167-17.847,14.773-32.315,32.704-32.315s32.538,14.468,32.706,32.315c15.634,0.166,28.3,12.903,28.3,28.536C192,135.845,179.165,148.646,163.39,148.646L163.39,148.646z M98.599,98.382c-12.01,0-21.784,9.747-21.784,21.729s9.773,21.728,21.784,21.728h64.791c12.013,0,21.784-9.746,21.784-21.728s-9.771-21.729-21.784-21.729h-3.101c-1.886,0-3.414-1.524-3.414-3.405v-3.093c0-14.235-11.609-25.815-25.879-25.815c-14.271,0-25.881,11.58-25.881,25.815v3.093c0,1.881-1.528,3.405-3.413,3.405H98.599L98.599,98.382z",
    "M49.224,65.382c12.614-15.221,35.288-17.354,50.541-4.754c2.214,1.829,2.688,3.903,0.855,6.113c-1.831,2.209-5.246,0.385-7.461-1.444c-10.832-8.949-29.486-6.32-38.446,4.489c-8.958,10.811-8.169,30.339,3.368,39.168c2.281,1.745,4.158,4.525,2.327,6.735c-0.812,0.979-0.984,1.051-2.146,1.263c-1.46,0.267-3.024-0.089-4.258-1.107C38.752,103.243,36.608,80.606,49.224,65.382L49.224,65.382z",
    "M49.819,64.757",
    "M44.075,60.057c-0.576,0.453-1.212,0.993-2.399,1.04c-1.482,0.06-2.58-0.593-3.813-1.611L25.468,49.271c-2.214-1.83-3.419-4.27-1.583-6.307c1.514-1.681,3.73-1.716,5.945,0.113l12.899,10.659c2.214,1.83,3.026,3.78,1.568,6.068L44.075,60.057z",
    "M69.905,46.978c-0.729-0.084-1.562-0.152-2.435-0.954c-1.092-1.003-1.405-2.238-1.557-3.828l-1.536-15.964c-0.271-2.855,0.604-5.431,3.346-5.58c2.263-0.122,3.855,1.415,4.127,4.27l1.58,16.634c0.271,2.855-0.536,4.808-3.189,5.4L69.905,46.978z",
    "M98.857,55.71c-0.461-0.569-1.009-1.198-1.071-2.38c-0.077-1.479,0.566-2.58,1.572-3.822l10.099-12.479c1.809-2.229,4.24-3.459,6.304-1.652c1.703,1.492,1.764,3.701-0.046,5.931l-10.537,12.989c-1.809,2.229-3.755,3.062-6.066,1.633L98.857,55.71z",
    "M34.373,90.082c-0.076,0.727-0.133,1.559-0.926,2.44c-0.992,1.101-2.226,1.429-3.818,1.6L13.645,95.85c-2.859,0.305-5.453-0.536-5.635-3.269c-0.15-2.255,1.371-3.862,4.23-4.169l16.655-1.78c2.859-0.306,4.827,0.475,5.452,3.114L34.373,90.082z",
    "M49.091,116.465c0.443,0.584,0.972,1.229,0.996,2.413c0.031,1.48-0.646,2.561-1.69,3.771L37.916,134.81c-1.877,2.172-4.347,3.326-6.353,1.457c-1.656-1.544-1.647-3.755,0.23-5.928l10.936-12.655c1.877-2.173,3.848-2.944,6.114-1.445L49.091,116.465z"
  ]
};

const getXaisData = (times, formatType) => {
  return times.map((time) => {
    return formatTime(time, formatType) + UNIT_MAP[formatType];
  });
};

const getYmax = (values) => {
  let max = Math.ceil(Math.max.apply(Math, values)*1.5);
  return max === 0 ? 1 : max + (10 - max%10);
};

function makeChartData(data, weatherData, filterType) {
  let series = [];

  let traffic = data.axisY.traffic;
  let times = data.axisX.time;
  let yTrafficMax = getYmax(traffic);

  let xAxis = [
    {
      type: 'category',
      data: getXaisData(times, filterType)
    }
  ];

  let splitStyle = {
    lineStyle: {
      color: ["#ddd"],
      type: 'dashed'
    }
  };

  series[0] = {
    name: locale.traffic,
    smooth: true,
    color: ["#4db7cd"],
    type: 'bar',
    barCategoryGap: '50%',
    yAxisIndex: 0,
    data: traffic
  };

  series[1] = {
    name: locale.temperature,
    smooth: true,
    color: ["#ffdb73"],
    type: 'line',
    yAxisIndex: 1,
    data: []
  };

  series[2] = {
    name: locale.weatherIcon,
    color: ["#008cee"],
    type: 'scatter',
    symbolSize: [24, 18],
    data: []
  };

  let tempMap = weatherData.series[0].params;
  let iconMap = weatherData.series[1].params;
  let symbolCoordY = Math.max(0.9, yTrafficMax - 5);

  /**
   * 生成x轴坐标点对应的温度和天气
   */
  times.forEach((time, i) => {
    series[1].data[i] = tempMap[time] || 0;
    series[2].data[i] = {
      name: iconMap[time],
      value: symbolCoordY,
      symbol: "path://" + skyIconsMap[iconMap[time]]
    };
  });

  return {
    tooltip: {
      trigger: 'axis',
      confine: true   //http://echarts.baidu.com/option.html#tooltip.confine
    },
    series: series,
    grid: {
      left: '3%',
      right: '3%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: xAxis,
    legend: {
      left: "center",
      data: [locale.traffic, locale.temperature]
    },
    yAxis: [
      {
        type: 'value',
        name: locale.traffic,
        max: yTrafficMax,
        splitLine: splitStyle
      },
      {
        type: 'value',
        name: locale.temperature,
        splitLine: splitStyle,
        max: getYmax(series[1].data),
        axisLabel: {
          formatter: '{value}℃'
        }
      }
    ]
  };
}

class PassFlowWeatherCharts extends BaseChart {

  constructor(props) {
    super(props);
    this.chartProps = {
      height: 350
    };
  }

  /**
   * 获取订单量和进店人数
   */
  getOrderAndCount(){
    let {store, offset, filterType} = this.state;
    return new Promise((resolve, reject) => {
      fetchReportPayment(`retail.payment.report.${filterType}`, store.storeId, offset).then(
        res => resolve(res.data),
        err => reject(err)
      );
    });
  }

  /**
   * 获取天气相关的数据
   */
  getWeather() {
    let {store, offset, filterType} = this.state;
    return new Promise((resolve, reject) => {
      getStoreChartReport(store.storeId, offset, `retail.weather.${filterType}ly`).then(
        res => resolve(res),
        err => reject(err)
      );
    });
  }

  /**
   * @override
   */
  fetch() {
    let { filterType } = this.state;
    Promise.all([this.getOrderAndCount(), this.getWeather()]).then(values => {
      let orderData = values[0];
      let weatherData = values[1];

      let chartData = makeChartData(orderData, weatherData, filterType);

      this.setState({
        loaded: true,
        data: chartData
      });

      console.log(JSON.stringify(chartData, null, 1))
      this.refs.charts.refresh();
    });
  }

}

module.exports = PassFlowWeatherCharts;