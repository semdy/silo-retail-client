
import { Component } from 'refast';
import logic from './logic';
import './PageTest2.less';

export default class PageTest2 extends Component {

  constructor(props) {
    super(props, logic);
  }

  render() {
    return (
      <div className="page-test2">
        page test2
      </div>
    );
  }
}
