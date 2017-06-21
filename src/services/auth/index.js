'use strict';

let {Toast} = SaltUI;
let {hashHistory} = ReactRouter;

//改写Toast
["success", "error", "fail", "loading"].forEach((type) => {
  Toast[type] = (msg, options) => {
    return Toast.show({
      type: type,
      content: typeof msg === 'object' ? JSON.stringify(msg) : String(msg),
      autoHide: type !== 'loading',
      ...options
    });
  };
});

import {env, urlParams} from '../config';
import {isDD} from '../../utils';
import locale from '../../locale';
let error = Toast.error;

const jsApiList = ['runtime.info', 'biz.contact.choose',
  'device.notification.confirm', 'device.notification.alert',
  'device.notification.prompt', 'biz.ding.post',
  'biz.util.openLink'];

let readyQueue = [];
let isReady = false;
let STORAGE_Key = "__silo";
let SESSION_KEY = STORAGE_Key + ".session";
let USER_KEY = STORAGE_Key + ".user";

const session = {

  set(info, username) {
    if (info === null) {
      return;
    }
    localStorage.setItem(SESSION_KEY, JSON.stringify(info));
    if( username ){
      this.setUsername(username);
    }
  },

  get(){
    let sessionStr = localStorage.getItem(SESSION_KEY);
    if (sessionStr) {
      return JSON.parse(sessionStr);
    } else {
      return null;
    }
  },

  setUsername(username){
    localStorage.setItem(USER_KEY, username);
  },

  getUsername(){
    return localStorage.getItem(USER_KEY);
  },

  clear() {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(USER_KEY);
  }

};

let requestCount = 0;

const request = ({url, body = {}, method = 'post', dataType = 'json'}) => {

  if (++requestCount === 1) {
    //Toast.loading(locale.appLoading);
  }

  return new Promise((resolve, reject) => {
    $.ajax({
      type: method,
      url: /^https?:\/\//.test(url) ? url : env.urlAppRoot + url,
      data: JSON.stringify(body),
      dataType: dataType,
      success: (recv) => {
        let code = recv.protocError;
        if (code === 0) {
          resolve(recv);
        } else {
          reject(code);
        }
      },
      error: (xhr, status, err) => {
        reject(xhr, status, err);
        error(`${locale.disconnect}, code: ${status}`);
      },
      complete: () => {
        if (--requestCount === 0) {
          //Toast.hide();
        }
      }
    });
  });
};

/* 请求钉钉的JS-API签名信息 */
function httpRequestConfig() {
  let req = {keyCorp: 1000, keyApp: env.keyApp};
  return new Promise((resolve, reject) => {
    request({url: '7001.json', body: req}).then((data) => {
      resolve(data);
    }, (err) => {
      reject(err);
      if (typeof err === 'number') {
        error(`${locale.singnFailed}, code: ${err}`);
      }
    });
  });
}

/* 请求使用钉钉返回的验证码登录 */
function httpRequestSignIn(code, corpId) {
  return new Promise((resolve, reject) => {
    request({url: '7003.json', body: {corpId, code}}).then((json) => {
      if (json.session) {
        session.set(json.session);
        resolve(json.session);
      } else {
        error(locale.getUserInfoError);
      }
    }, (err) => {
      reject(err);
      if (typeof err === 'number') {
        error(`${locale.ddLoginError}, code: ${err}`);
      }
    });
  });
}

/* 请求使用用户名密码登录 */
function httpRequestSignInByUserPass(username, password) {
  return new Promise((resolve, reject) => {
    request({url: '1003.json', body: {username, password}}).then((json) => {
      if (json.session) {
        session.set(json.session, username);
        resolve(json.session);
        //triggerReady();
      } else {
        reject(locale.userPassError);
        error(locale.userPassError);
      }
    }, (err) => {
      reject(err);
      if (typeof err === 'number') {
        error(`${locale.loginError}, code: ${err}`);
      }
    });
  });
}

function onDingTalkYes(corpId) {
  return new Promise((resolve, reject) => {
    dd.runtime.permission.requestAuthCode({
      corpId: corpId,
      onSuccess: (result) => {
        httpRequestSignIn(result.code, corpId).then((sessionInfo) => {
          resolve(sessionInfo);
          triggerReady();
        }, (err) => {
          reject(err);
          onDingTalkApiFail(err);
        });
      },
      onFail: (err) => {
        reject(err);
        onDingTalkApiFail(err);
      }
    });
  });
}

function signIn() {
  let sessionInfo = session.get();
  if (sessionInfo) {
    session.set(sessionInfo);
    triggerReady();
  } else {
    if (isDD) {
      httpRequestConfig().then((json) => {
        let config = json.config;
        config.jsApiList = jsApiList;
        dd.config(config);
        dd.ready(() => {
          onDingTalkYes(config.corpId);
        });
        dd.error((err) => {
          onDingTalkErr(err);
        })
      });
    } else {
      /*if (username && password) {
        httpRequestSignInByUserPass(username, password);
      } else {*/
        //alert(locale.noPermission);
        hashHistory.replace('/user.login');
        triggerReady();
      //}
    }
  }
}

function onDingTalkErr(err) {
  error(`${locale.ddError}\n` + JSON.stringify(err));
}

function onDingTalkApiFail(err, api) {
  error(locale.ddInvokeError + '\n' + api + '\n' + JSON.stringify(err));
}

function ready(fun) {
  if (typeof fun === 'function') {
    if (!isReady) {
      readyQueue.push(fun);
    } else {
      fun();
    }
  }
}

function triggerReady() {
  isReady = true;
  readyQueue.forEach((itemFun) => {
    itemFun();
  });
  readyQueue = [];
}

signIn.ready = ready;

module.exports = {
  session,
  signIn,
  doLogin: httpRequestSignInByUserPass
};