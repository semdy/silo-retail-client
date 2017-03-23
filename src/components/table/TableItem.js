require('./TableItem.styl');

let {PropTypes} = React;
import classnames from 'classnames';

function formatter(value) {
  return value;
}

class TableItem extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let {fields, row, rowNumber} = this.props;
    return (
      <div className="t-FBH t-FBAC t-FBJ ui-table-row">
        {
          fields.map((field, i) => {
            if( field.flex === undefined ){
              if( field.width !== undefined ) {
                field.flex = 0;
              } else {
                field.flex = 1;
              }
            }

            return (
              <div key={i} className={classnames("t-FB" + field.flex + " tba-" + (field.align||"center") + " ui-table-cell", {'ui-table-cell-num': field.field == 'rowNumber'})}
                   style={{
                     width: field.width === undefined ? undefined : field.width + "px"
                   }}
              >
                {
                  field.field == 'rowNumber' ? rowNumber + 1 : (field.formatter || formatter)(row[field.field], rowNumber)
                }
              </div>
            )
          })
        }
      </div>
    );
  }
}

TableItem.defaultProps = {
  fields: [],
  row: []
};

TableItem.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.object.isRequired
  ),
  row: PropTypes.object.isRequired
};

module.exports = TableItem;
