import { isRPC, env } from '../config'
import { signIn, session } from '../auth';
import { error } from '../../utils';

let request = ({ url, body = {}, method = 'post', dataType = 'json' }) => {
  return new Promise((resolve, reject) => {
    body = $.extend({ protoc2S: {sessionId: session.get().sessionId}}, body);
    $.ajax({
      type: method,
      url: /^https?:\/\//.test( url ) ? url : env.urlAppRoot + url,
      data: isRPC ? JSON.stringify(body) : body,
      dataType: dataType,
      success: (recv) => {
        let code = recv.protocError;
        if (code === 0) {
          resolve(recv);
        } else if (code === 403) {
          session.clear();
          reject(code);
          alert("登录超时！");
          location.reload();
        } else {
          reject(code);
          //error('服务器响应出错了: ' + code);
        }
      },
      error: (xhr, status, err) => {
        reject(xhr, status, err);
        error(`与服务器失去连接, code: ${status}`);
      }
    });
  });
};

let fetch = ( args ) => {
  return new Promise((resolve, reject) => {
    signIn.ready(() => {
      request(args).then((res) => {
        if (res.result == 0) {
          resolve(res.data);
        } else {
          reject(res);
        }
      });
    });
  });
};

fetch.post = (url, params = {}) => {
  return fetch(Object.assign({body: params}, {url, method: 'post'}));
};

fetch.get = (url, params = {}) => {
  return fetch(Object.assign({body: params}, {url, method: 'get'}));
};

module.exports = {
  request,
  fetch
};
