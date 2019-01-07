import './Passflow.styl';

import React from 'react';
import PassFlowStatsSimple from '../../components/passflowstatsSimple';
import DateNavigator from '../../components/datenavigator';
import PassFlowDiffer from '../../components/passflowdiffer';
import PassFlowWeatherCharts from '../../components/passflowweathercharts';

class Passflow extends React.Component {

  render() {
    return (
      <div className="responsive">
        <PassFlowStatsSimple decolate={true}/>
        <DateNavigator/>
        <PassFlowDiffer/>
        <PassFlowWeatherCharts/>
      </div>
    )
  }
}

export default Passflow;
