import './Passflow.styl';

import PassFlowStats from '../../components/passflowstats';
import DateNavigator from '../../components/datenavigator';
import PassFlowChargitts from '../../components/passflowcharts';

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
      </div>
    )
  }
}

module.exports = Passflow;