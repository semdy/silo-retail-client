require('./NoMatch.styl');

let {Button} = SaltUI;
let {hashHistory} = ReactRouter;
import Empty from '../../components/empty';
import locale from '../../locale';

class NoMatch extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Empty>
        <span className="not-found-text">{locale.notFound}</span>
        <div className="t-MT12">
          <Button type="primary"
                  onClick={hashHistory.replace.bind(null, '/report.survey')}
          >
            {locale.back2index}
          </Button>
        </div>
      </Empty>
    );
  }
}

module.exports = NoMatch;
