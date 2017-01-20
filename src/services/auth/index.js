'use strict';

import { env, urlParams } from '../config';
import { isDD, error } from '../../utils';

const urlDingTalk = 'http://it.zaofans.com/silo/app/retail/';
const cheatCode = urlParams.cheat;

const jsApiList = ['runtime.info', 'biz.contact.choose',
  'device.notification.confirm', 'device.notification.alert',
  'device.notification.prompt', 'biz.ding.post',
  'biz.util.openLink'];

let sessionInfo = null;
let sessionHeader = '';
let sessionOK = false;

let readyQueue = [];
let isReady = false;

const session = {

  set(info) {
    if (info == null) {
      return;
    }
    sessionInfo = info;
    sessionHeader = { sessionId: info.sessionId };
    localStorage.setItem('session', JSON.stringify(info));
    sessionOK = true;
  },

  get(){
    let sessionStr = localStorage.getItem('session');
    if( sessionStr ){
      return JSON.parse(sessionStr);
    } else {
      return null;
    }
  },

  clear() {
    sessionInfo = null;
    sessionHeader = null;
    localStorage.removeItem('session');
    sessionOK = false;
  }

};

const request = ({ url, body = {}, method = 'post', dataType = 'json' }) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: method,
      url: /^https?:\/\//.test( url ) ? url : env.urlAppRoot + url,
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
        error(`与服务器失去连接, code: ${status}`);
      }
    });
  });
};

/* 请求钉钉的JS-API签名信息 */
function httpRequestConfig() {
  let req = { keyCorp: 1000, keyApp: env.keyApp };
  return new Promise((resolve, reject) => {
    request({url: `${urlDingTalk}7001.json`, body: req}).then((data) => {
      resolve(data);
    }, (err) => {
      reject(err);
      if (typeof err == 'number') {
        error(`签名失败, code: ${err}`);
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
      }
    }, (err) => {
      reject(err);
      if( typeof err == 'number' ) {
        error(`钉钉登录出错, code: ${err}`);
      }
    });
  });
}

/* 请求使用用户名密码登录 */
function httpRequestSignInByUserPass(username, password) {
  return new Promise((resolve, reject) => {
    request({url: '1003.json', body: { username, password }}).then((json) => {
      if (json.session) {
        session.set(json.session);
        resolve(json.session);
      }
    }, (err) => {
      reject(err);
      if( typeof err == 'number' ) {
        error(`用户名密码登录出錯, code: ${err}`);
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
          triggerReady(sessionInfo);
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

const username = urlParams.user;
const password = urlParams.pass;

function signIn() {
  if( !isDD || sessionOK ){
    return;
  }
  if (username && password) {
    httpRequestSignInByUserPass(username, password);
  } else {
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
  }
}

function onDingTalkErr(err) {
  error('钉钉客户端出错了！\n' + JSON.stringify(err));
}

function onDingTalkApiFail(err, api) {
  error('钉钉接口调用出错了！\n' + api + '\n' + JSON.stringify(err));
}

function ready(fun) {
  if( typeof fun == 'function' ) {
    if (isDD && !isReady) {
      readyQueue.push(fun);
    } else {
      fun();
    }
  }
}

function triggerReady() {
  isReady = true;
  readyQueue.forEach((itemFun) => {
    itemFun(sessionInfo, sessionHeader);
  });
}

signIn.ready = ready;

module.exports = {
  session,
  signIn,
  getSessionHeader: () => {
    return sessionHeader;
  },
  getSessionInfo: () => {
    return sessionInfo;
  }
};