import './Passflow.styl';

import PassFlowStats from '../../components/passflowstats';
import DateNavigator from '../../components/datenavigator';
import PassFlowCharts from '../../components/passflowcharts';
import PassFlowWeatherCharts from '../../components/passflowweathercharts';
import AgePieChart from '../../components/agePieChart';
import SexPieChart from '../../components/sexPieChart';
import Swiper from '../../components/swiper';

class Passflow extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="responsive">
        <PassFlowStats/>
        <DateNavigator/>
        <PassFlowCharts/>
        <PassFlowWeatherCharts/>
        <Swiper>
          <AgePieChart/>
          <SexPieChart/>
        </Swiper>
      </div>
    )
  }
}

module.exports = Passflow;