import './PaymentTable.styl';

import React from 'react';
import Reflux from 'reflux';
import reactMixin from 'react-mixin';
import store from  '../../app/store';
import Base from '../../components/base';
import {getStoreChartReport} from '../../services/store';
import Table from '../../components/table';
import {genTableRows} from '../../utils';
import locale from '../../locale';

class PaymentTable extends Base {

  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    };

    this.tableFields = [
      {
        field: 'name',
        name: locale.settleWay,
        align: 'left',
        formatter: function (value, index) {
          return (index + 1) + " " + value
        }
      },
      {
        field: 'count',
        name: locale.singularQuantity
      },
      {
        field: 'money',
        name: `${locale.amount}(${locale.yuan})`
      }
    ];
  }

  fetch() {
    let {store, offset} = this.state;
    getStoreChartReport(store.storeId, offset, 'retail.trade.payment.mode').then((res) => {
      this.setState({
        loaded: true,
        data: genTableRows(res.series)
      });
    });
  }

  render() {
    let {loaded, data} = this.state;
    return (
      loaded &&
      <Table fields={this.tableFields} rows={data}/>
    );
  }
}

reactMixin.onClass(PaymentTable, Reflux.connect(store));

module.exports = PaymentTable;
