import './Survey.styl';

import React from 'react';
import SurveyChart from '../../components/surveychart';
import DateNavigator from '../../components/datenavigator';
import Survey from '../../components/survey';

class Index extends React.Component {

  render() {
    return (
      <div className="page-survey">
        <SurveyChart/>
        <DateNavigator/>
        <Survey/>
      </div>
    );
  }
}

module.exports = Index;
