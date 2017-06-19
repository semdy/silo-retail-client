require('./SiteLogo.styl');

let {Icon} = SaltUI;
let {PropTypes} = React;

class SiteLogo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: this.props.visible
    };
  }

  render() {
    let {size, color} = this.props;
    return (
      <div className="site-logo">
        <Icon name="logo" className="site-svgicon" color={color} width={size} height={size}/>
        <span className="site-name" style={{color: color}}>知店</span>
      </div>
    );
  }
}

SiteLogo.defaultProps = {
  size: 70,
  color: "#1296db"
};

SiteLogo.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string
};

module.exports = SiteLogo;
