import React from 'react';

class Base extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount(){
    if( this.state.store.storeId ) {
      this.fetch();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    let {offset, store, refreshFlag, filterType} = this.state;

    if (offset !== prevState.offset
      || store.storeId !== prevState.store.storeId
      || prevState.refreshFlag !== refreshFlag
      || filterType !== prevState.filterType)
    {
      this.fetch();
    }
  }

  fetch(){

  }

}

module.exports = Base;