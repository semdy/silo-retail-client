import './DataView.styl';

import React from 'react';
import DataviewStats from '../../components/dataviewstats';
import DateNavigator from '../../components/datenavigator';
import DataviewChart from '../../components/dataviewchart';

class DataView extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="responsive">
        <DataviewStats/>
        <DateNavigator/>
        <DataviewChart/>
      </div>
    )
  }
}

module.exports = DataView;
