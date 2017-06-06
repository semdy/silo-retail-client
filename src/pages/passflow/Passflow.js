import './Passflow.styl';

import PassFlowStats from '../../components/passflowstats';
import DateNavigator from '../../components/datenavigator';
import PassFlowCharts from '../../components/passflowcharts';
import PassFlowWeatherCharts from '../../components/passflowweathercharts';

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
      </div>
    )
  }
}

module.exports = Passflow;