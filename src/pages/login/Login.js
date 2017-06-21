import './Login.styl';

let {hashHistory} = ReactRouter;

import actions from '../../app/actions';
import SiteLogo from '../../components/sitelogo';
import Form from '../../components/form';
import FormItem from '../../components/formitem';
import FormButton from '../../components/formbutton';
import AnimateGridBg from '../../components/animategridbg'
import Wave from '../../components/wave';
import {isDD} from '../../utils';
import {session, doLogin} from '../../services/auth';
import {fetchStoreList} from '../../services/store';
import locale from '../../locale';

class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLogining: false
    };
  }

  componentDidMount(){
    session.clear();
    if (isDD) {
      hashHistory.replace('/');
      setTimeout(function () {
        location.reload();
      });
    } else {
      actions.showScrollNav(false);
      actions.setP2rEnabled(false);
    }
  }

  componentWillUnmount(){
    actions.showScrollNav(true);
    actions.setP2rEnabled(true);
  }

  handleSubmit(e){
    e.preventDefault();
    let inValid = this.refs.form.validate();
    if(!inValid){
      this.handleLogin();
    }
  }

  handleLogin(){
    let username = this.refs.user.value;
    let password = this.refs.pass.value;
    this.setLoginStatus(true);
    doLogin(username, password).then(() =>{
      fetchStoreList().then(() => {
        hashHistory.replace('/');
      });
    }, () => {
      this.setLoginStatus(false);
    });
  }

  setLoginStatus(bool){
    this.setState({
      isLogining: bool
    });
  }

  render() {
    let {isLogining} = this.state;
    return (
      isDD ? <noscript/> :
      <div className="page-login">
        <div className="login-wrapper">
          <SiteLogo/>
          <Form ref="form"
                className="login-form"
                onSubmit={this.handleSubmit.bind(this)}
          >
            <FormItem
              ref="user"
              name="user"
              leftIcon="user-c"
              size="large"
              showClear={true}
              placeholder={locale.TYPE_USERNAME}
              rules={[
                {method: 'required', errorMsg: locale.USER_EMPTY}
              ]}
            />
            <FormItem
              ref="pass"
              name="pass"
              type="password"
              leftIcon="lock"
              size="large"
              showEye={true}
              placeholder={locale.TYPE_PASSWORD}
              rules={[
                {method:'required', errorMsg: locale.PASS_EMPTY}
              ]}
            />
            <div className="form-action">
              <FormButton
                disabled={isLogining}
                funcType="submit"
                type="primary"
                size="large"
                className="half"
                effect={true}
              >
                {
                  isLogining ? locale.user.LOGINING : locale.user.LOGIN
                }
              </FormButton>
            </div>
          </Form>
        </div>
        <AnimateGridBg className="animate-bg"/>
        <Wave/>
      </div>
    );
  }
}

module.exports = Login;
