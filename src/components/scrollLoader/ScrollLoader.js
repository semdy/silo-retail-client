require('./ScrollLoader.styl');

let {PropTypes} = React;
let {Icon, Context} = SaltUI;

import ScrollDetector from '../scrolldetector';
import locale from '../../locale';

class ScrollLoader extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      status: 'normal'
    };
  }

  componentDidMount() {
    setTimeout(() =>{
      this.createDetector();
    }, 100);

  }

  componentWillUnmount() {
    try {
      this.scrollDetector.destroy();
    } catch(e) {}
  }

  componentWillReceiveProps(nextProps) {
    if( nextProps.hidden === true && this.state.status !== 'normal' ){
      this.hide();
    }
  }

  createDetector(){
    let self = this;
    let {container, scroller, onScroll, onReach, bufferPx, time} = this.props;

    this.scrollDetector = new ScrollDetector({
      container: container,
      scroller: scroller || this.refs.loader,
      onScroll: function(client){
        console.log(1)
        onScroll(client)
      },
      onReach: function(){
        onReach();
        self.setState({
          status: 'reach'
        });
      },
      bufferPx,
      time
    });
  }

  hide() {
    this.setState({
      status: 'normal'
    });
  }

  render() {
    let {status} = this.state;
    return (
      <div ref="loader" className="scroll-loader">
        <div>
          {this.props.children}
        </div>
        <div className="t-FBH t-FBAC t-FBJC sl-indicator"
            style={{
              visibility: status !== 'reach' ? 'hidden' : 'visible'
            }}
        >
          <Icon name="p2r-loading"
                className="spin sl-spinner"
                width={15}
                height={15}
          />
          <span className="sl-text">
            {locale.loadMore}
          </span>
        </div>
      </div>
    );
  }
}

ScrollLoader.propTypes = {
  container: PropTypes.object.isRequired,
  scroller: PropTypes.object,
  onScroll: PropTypes.func,
  onReach: PropTypes.func,
  bufferPx: PropTypes.number,
  time: PropTypes.number,
  hidden: PropTypes.bool
};

ScrollLoader.defaultProps = {
  container: window,
  scroller: null,
  onScroll: Context.noop,
  onReach: Context.noop,
  bufferPx: 0,
  time: 1000,
  hidden: true
};

module.exports = ScrollLoader;
