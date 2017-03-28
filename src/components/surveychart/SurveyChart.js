import './SurveyChart.styl';

import SurveyBarChart from '../../components/surveyBarchart';
import SurveyLineChart from '../../components/surveyLinechart';

class SurveyChart extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="t-FBH survey-chart">
        <div className="t-FB1">
          <SurveyLineChart/>
        </div>
        <div className="t-FB1">
          <SurveyBarChart/>
        </div>
      </div>
    );
  }
}

module.exports = SurveyChart;
