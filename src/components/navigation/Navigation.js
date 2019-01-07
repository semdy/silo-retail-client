import './Navigation.styl';

import React, { PropTypes } from 'react'; // eslint-disable-line
import { Link } from 'react-router';
import Reflux from 'reflux';
import { Icon } from 'saltui';

import reactMixin from 'react-mixin';
import actions from '../../app/actions';
import store from  '../../app/store';
import dom, {transitionEnd} from '../../utils/dom';

class Navigation extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      items: this.props.items
    };
    this.docBody = document.body;
  }

  show() {
    this.refs.navigation.style.display = "block";
    this.docBody.offsetWidth; // eslint-disable-line
    dom.addClass(this.docBody, "show-sidebar");
    transitionEnd(this.refs.navigation, function () {
      this.style.display = "block";
    });
  }

  hide() {
    dom.removeClass(this.docBody, "show-sidebar");
    transitionEnd(this.refs.navigation, function () {
      this.style.display = "";
    });
  }

  setData(items) {
    this.setState({
      items: Array.isArray(items) ? items : []
    });
  }

  setMenus(isAdmin) {
    this.state.items.forEach((item) => {
      if (item.admin) {
        item.visible = isAdmin;
      }
    });
    this.setState({
      items: this.state.items
    });
  }

  componentDidUpdate(prevProps, prevState) {
    let {isAdmin, navVisible} = this.state;
    if (prevState.isAdmin !== isAdmin) {
      this.setMenus(this.state.isAdmin);
    }
    if (prevState.navVisible !== navVisible) {
      if( navVisible ){
        this.show();
      } else {
        this.hide();
      }
    }
  }

  render() {
    let {items} = this.state;
    return (
      <div ref="navigation" className="sidenavigation">
        <div className="navigation-list">
          {
            items.map((menu, i) => {
              return (
                menu.visible &&
                <Link to={menu.path}
                      key={i}
                      className="navigation-item"
                      activeClassName="active"
                      onClick={actions.hideNavigation}
                >
                  {
                    !menu.icon ? "" :
                      ( menu.icon.match(/\.(jpg|png|gif|svg)$/) ? <img src={menu.icon} alt='' /> :
                        <Icon name={menu.icon} width={20} height={20}/> )
                  }
                  <span>{menu.text}</span>
                </Link>
              )
            })
          }
        </div>
      </div>
    );
  }
}

Navigation.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.object
  ).isRequired,
};

Navigation.defaultProps = {
  items: []
};


reactMixin.onClass(Navigation, Reflux.connect(store));

module.exports = Navigation;
