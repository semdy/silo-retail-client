import './Payment.styl';

import React from 'react';
import PaymentStats from '../../components/paymentstats';
import DateNavigator from '../../components/datenavigator';
import PaymentPieChart from '../../components/paymentPieChart';
import PaymentTable from '../../components/paymenttable';

class Payment extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <PaymentStats/>
        <DateNavigator/>
        <PaymentPieChart/>
        <PaymentTable/>
      </div>
    )

  }
}

module.exports = Payment;
