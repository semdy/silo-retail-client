import './Empty.styl';

import React from 'react';
import {Icon} from 'saltui';

class Empty extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="empty-notice">
        <Icon name="empty" width={200} height={200}/>
        <div className="emp-notice-text">
          {this.props.children}
        </div>
      </div>
    );
  }
}

module.exports = Empty;
