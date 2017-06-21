
import Polygon from './Polygon';

class AnimateGridBg extends React.Component {
  constructor(props){
    super(props);
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.reqId = null;
  }

  _createInstance() {
    this.ctx = this.refs.canvas.getContext('2d');
    let target = {x: this.w/2, y: this.h/5};
    this.poly = new Polygon(target, this.w, this.h);
  }

  draw() {
    this.ctx.clearRect(0, 0, this.w, this.h);
    this.poly.draw(this.ctx);
  };

  componentDidMount(){
    let that = this;
    this._createInstance();

    function animate(){
      that.reqId = requestAnimationFrame(animate);
      that.draw();
    }

    animate();
  }

  componentWillUnmount(){
    this.poly.destory();
    cancelAnimationFrame(this.reqId);
  }

  render(){
    return (
      <div className={this.props.className}>
        <canvas ref="canvas"
                width={this.w}
                height={this.h}

                style={{width: this.w + "px", height: this.h + "px"}}
        />
      </div>
    )
  }
}

export default AnimateGridBg;