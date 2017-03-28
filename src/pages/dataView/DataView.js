import './DataView.styl';

import DataviewStats from '../../components/dataviewstats';
import DateNavigator from '../../components/datenavigator';
import DataviewCharts from '../../components/dataviewcharts';

class DataView extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="responsive">
        <DataviewStats/>
        <DateNavigator/>
        <DataviewCharts/>
      </div>
    )
  }
}

module.exports = DataView;