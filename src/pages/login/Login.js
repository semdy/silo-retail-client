import './Login.styl';

let {hashHistory} = ReactRouter;

import actions from '../../app/actions';
import SiteLogo from '../../components/sitelogo';
import Form from '../../components/form';
import FormItem from '../../components/formitem';
import FormButton from '../../components/formbutton';
import AnimateGridBg from '../../components/animategridbg'
import auth from '../../services/auth';
import locale from '../../locale';

class Login extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount(){
    actions.showScrollNav(false);
    actions.setP2rEnabled(false);
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
    auth.doLogin(username, password).then((res) =>{
      auth.session.set(res, username);
      hashHistory.replace('/report.survey');
    }, (err) => {
      console.error(err)
    });
  }

  render() {
    return (
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
                funcType="submit"
                type="primary"
                size="large"
                className="half"
              >
                {
                  locale.LOGIN
                }
              </FormButton>
            </div>
          </Form>
        </div>
        <AnimateGridBg className="animate-bg"/>
        <div className="login-footer">
          <div className="login-wave1"/>
          <div className="login-wave2"/>
          <div className="login-wave3"/>
          <div className="login-wave4"/>
        </div>
      </div>
    );
  }
}

module.exports = Login;
