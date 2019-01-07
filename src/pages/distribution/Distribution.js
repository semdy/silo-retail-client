import './Distribution.styl'

import React from 'react'
import DateNavigator from '../../components/datenavigator'
import DistributionStats from '../../components/distributionstats'
import DistributionPieChart from '../../components/distributionPieChart'

class Distribution extends React.Component {

  render () {
    return (
      <div>
        <DistributionStats/>
        <DateNavigator/>
        <DistributionPieChart/>
      </div>
    )

  }
}

module.exports = Distribution
