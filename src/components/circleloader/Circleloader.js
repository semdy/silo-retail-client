require('./Circleloader.styl');

let {PropTypes} = React;
let {Context} = SaltUI;

class Circleloader extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      text: "",
      dashOffset: parseFloat(this.props.strokeDasharray[0])
    };
    this.dashOffset = this.state.dashOffset;
    this.percent = 0;
  }

  render() {
    let {text, dashOffset} = this.state;
    let {width, height, strokeColor, borderWidth, strokeDasharray} = this.props;
    return (
      <div className="circle-loader">
        <svg width={width} height={height}>
          <circle strokeLinecap="round"
                  cx={width/2}
                  cy={height/2}
                  fillOpacity="0"
                  r={width/2-4}
                  stroke={strokeColor}
                  strokeWidth={borderWidth}
                  strokeDasharray={strokeDasharray}
                  style={{
                    strokeDashoffset: dashOffset + "px"
                  }}
          >
          </circle>
        </svg>
        <span className="circle-text">
          {text}
        </span>
      </div>
    );
  }

  _doRefresh(){
    let that = this;
    let _start = Date.now();
    let _animId;

    function animate() {
      let ratio = (Date.now() - _start)/that.props.duration;
      ratio = ratio > 1 ? 1: ratio;
      let percent = (that.props.percent - that.percent)*ratio + that.percent;
      let dashOffset = that.dashOffset - that.dashOffset*percent;
      that.setState({
        dashOffset: dashOffset,
        text: parseInt(percent*100) + "%"
      });
      _animId = requestAnimationFrame(animate);
      if(ratio === 1 ){
        cancelAnimationFrame(_animId);
        that.percent = that.props.percent;
        that.props.onEnd();
      }
    }

    animate();
  }

  componentWillReceiveProps(nextProps) {
    let {percent} = nextProps;
    if( percent !== this.props.percent ){
      this._doRefresh();
    }
  }

  componentDidMount() {
    this._doRefresh();
  }
}

Circleloader.defaultProps = {
  width: 70,
  height: 70,
  strokeColor: '#fff',
  borderWidth: 3,
  strokeDasharray: ["200px", "200px"],
  percent: 0,
  duration: 800,
  onEnd: Context.noop
};

Circleloader.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  strokeColor: PropTypes.string,
  borderWidth: PropTypes.number,
  strokeDasharray: PropTypes.arrayOf(
    PropTypes.string.isRequired
  ),
  percent: PropTypes.number,
  duration: PropTypes.number,
  onEnd: PropTypes.func
};

module.exports = Circleloader;
