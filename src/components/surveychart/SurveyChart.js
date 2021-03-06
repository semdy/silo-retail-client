import './SurveyChart.styl';

import React from 'react';
import SurveyLineChart from '../../components/surveyLineChart';
import SurveyBarChart from '../../components/surveyBarChart';

class SurveyChart extends React.Component {

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
