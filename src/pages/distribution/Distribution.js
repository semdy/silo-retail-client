import './Distribution.styl';

import React from 'react';
import DateNavigator from '../../components/datenavigator';
import DistributionStats from '../../components/DistributionStats';
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
