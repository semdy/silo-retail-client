require('./NoMatch.styl');

let {Button} = SaltUI;
let {hashHistory} = ReactRouter;
import actions from '../../app/actions';
import {session} from '../../services/auth';
import Empty from '../../components/empty';
import locale from '../../locale';

class NoMatch extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount(){
    if( session.get() === null ){
      actions.showScrollNav(false);
      actions.setP2rEnabled(false);
    }
  }

  componentWillUnmount(){
    if( session.get() === null ) {
      actions.showScrollNav(true);
      actions.setP2rEnabled(true);
    }
  }

  render() {
    return (
      <Empty>
        <span className="not-found-text">{locale.notFound}</span>
        <div className="t-MT12">
          <Button type="primary"
                  onClick={hashHistory.replace.bind(null, '/')}
          >
            {locale.back2index}
          </Button>
        </div>
      </Empty>
    );
  }
}

module.exports = NoMatch;
