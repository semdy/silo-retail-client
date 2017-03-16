require('./Searchbar.styl');

let {Icon, Context} = SaltUI;
let {PropTypes} = React;

class Searchbar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleSearch(e){
    e.preventDefault();
    this.props.onSearch(this.refs.input.value);
  }

  render() {
    let {placeholder} = this.props;
    return (
      <div className="searchbar">
        <form onSubmit={this.handleSearch.bind(this)}>
          <div className="searchbar-filed">
            <input type="text" ref="input" className="searchbar-input" placeholder={placeholder}/>
            <div className="searchbar-button" onClick={this.handleSearch.bind(this)}>
              <Icon name="search" width={24} height={24}>
              </Icon>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

Searchbar.propTypes = {
  placeholder: PropTypes.string,
  onSearch: PropTypes.func
};

Searchbar.defaultProps = {
  placeholder: '',
  onSearch: Context.noop
};

module.exports = Searchbar;
