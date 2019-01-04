import './Distribution.styl';

import DateNavigator from '../../components/datenavigator';
import DistributionStats from '../../components/distributionstats';
import DistributionPieChart from '../../components/distributionPieChart';

class Distribution extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <DistributionStats/>
        <DateNavigator/>
        <DistributionPieChart/>
      </div>
    )

  }
}

module.exports = Distribution;
