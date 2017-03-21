require('./Table.styl');

let {PropTypes} = React;
import TableHeader from './TableHeader';
import TableItem from './TableItem';

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
          rows.map((row, i) => {
            return (
              <TableItem key={i} rowNumber={i} fields={fields} row={row}/>
            )
          })
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
