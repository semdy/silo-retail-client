import './Table.styl';

import React, {PropTypes} from 'react';
import TableHeader from './TableHeader';
import TableItem from './TableItem';
import locale from '../../locale';

class Table extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let {fields, rows} = this.props;
    return (
      <div className="ui-table">
        <TableHeader fields={fields}/>
        {
          rows.length > 0 ?
            rows.map((row, i) => {
              return (
                <TableItem key={i} rowNumber={i} fields={fields} row={row}/>
              )
            })
            :
            <span className="ui-table-empty">{locale.emptyTableData}</span>
        }
      </div>
    );
  }
}

Table.defaultProps = {
  fields: [],
  rows: []
};

Table.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.object.isRequired
  ),
  rows: PropTypes.arrayOf(
    PropTypes.object.isRequired
  )
};

module.exports = Table;
