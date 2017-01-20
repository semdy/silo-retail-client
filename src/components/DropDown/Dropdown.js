require('./Dropdown.styl');

let { PropTypes } = React;
let { Button, Icon, Context } = SaltUI;
import classnames from 'classnames';

class Dropdown extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          visible: false
        };
    }

    show(){
        this.setState({
          visible: true
        });
    }

    hide(){
      this.setState({
        visible: false
      });
    }

    toggle(){
        this.setState({
            visible: !this.state.visible
        });
    }

    handleItemClick(itemIndex, value, text){
        this.hide();
        this.props.onItemClick(itemIndex, value, text);
    }

    handleClick(){
        this.toggle();
        this.props.onClick();
    }

    render() {
        let props = this.props;
        return (
            <div className={classnames("dropdown", {open: this.state.visible})}>
                <div className="dropdown-bd" onClick={this.handleClick.bind(this)}>
                    <Button type="text">{props.options[props.activeIndex].text}</Button>
                    <Icon name="angle-down" width={20} height={20} fill="#45a8e6" />
                </div>
                <ul className="dropdown-list" style={{display: this.state.visible ? "block" : "none"}}>
                  {
                    props.options.map((option, i) => {
                      return (
                        <li className={classnames("dropdown-item", {active: props.activeIndex === i, disabled: option.disabled === true ? true: false})}
                            key={i}
                            onClick={option.disabled === true ? null : this.handleItemClick.bind(this, i, option.value, option.text)}>
                          {option.text}
                        </li>
                      )
                    })
                  }
                </ul>
            </div>
        );
    }
}

Dropdown.propTypes = {
  onClick: PropTypes.func,
  onItemClick: PropTypes.func,
  activeIndex: PropTypes.number
};

Dropdown.defaultProps = {
  onClick: Context.noop,
  onItemClick: Context.noop,
  activeIndex: 1
};

module.exports = Dropdown;
