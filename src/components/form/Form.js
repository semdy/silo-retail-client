/**
 * Created by mcake on 2017/6/19.
 */

import React from 'react';
import Validator from '../../components/validator';

class Form extends React.Component {
  constructor(props) {
    super(props);
  }

  handleSubmit(e){
    this.props.onSubmit.call(this.refs.form, e);
  }

  _parseChildrenValidator(){
    React.Children.forEach(this.props.children, (child) => {
      let vNode = child._owner._instance.refs[child.ref];
      if( vNode && vNode.displayName === 'FormItem' ){
        this.validator.add(vNode, child.props.rules);
      }
    });
  }

  validate(){
    this.validator = new Validator();
    this._parseChildrenValidator();
    return this.validator.validate();
  }

  render(){
    return (
      <form ref="form"
            className={this.props.className}
            onSubmit={this.handleSubmit.bind(this)}
      >
        {
          this.props.children
        }
      </form>
    )
  }
}

export default Form;
