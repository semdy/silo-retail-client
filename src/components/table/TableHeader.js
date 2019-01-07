import './TableHeader.styl';

import React, {PropTypes} from 'react'; // eslint-disable-line
import classnames from 'classnames';

class TableHeader extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let {fields} = this.props;
    return (
      <div className="t-FBH t-FBAC t-FBJ ui-table-row ui-table-header">
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
              <div key={i} className={classnames("t-FB" + field.flex + " tba-" + (field.align||"center") + " ui-table-cell", {'ui-table-cell-num': field.field === 'rowNumber'})}
                style={{
                  width: field.width === undefined ? undefined : field.width + "px"
                }}
              >
                {
                  field.name === 'rowNumber' ? "" : field.name
                }
              </div>
            )
          })
        }
      </div>
    );
  }
}

TableHeader.defaultProps = {
  fields: []
};

TableHeader.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.object.isRequired
  )
};

module.exports = TableHeader;
