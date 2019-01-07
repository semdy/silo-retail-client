import './HeatMap.styl';

import React from 'react';
import PassFlowStatsSimple from '../../components/passflowstatsSimple';
import DateNavigator from '../../components/datenavigator';
import PassFlowHeatMap from "../../components/passflowheatmap";

class HeatMap extends React.Component {

  render() {
    return (
      <div className="responsive">
        <PassFlowStatsSimple decolate={true}/>
        <DateNavigator dateSwitchable={false} className="heatmap-navigator"/>
        <PassFlowHeatMap/>
      </div>
    )
  }
}

export default HeatMap;
