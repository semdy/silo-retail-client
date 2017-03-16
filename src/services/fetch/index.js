import { isRPC, env } from '../config'
import { signIn, session } from '../auth';
import config from '../../config';
let { Toast } = SaltUI;

let requestCount = 0;

let request = ({ url, body = {}, method = 'post', dataType = 'json' }) => {
  return new Promise((resolve, reject) => {
    //body = Object.assign({ protoc2S: {sessionId: session.get().sessionId}}, body);
    let sessionId = session.get().sessionId;
    body = Object.assign(body, {lang: config.lang});

    requestCount++;

    if( requestCount == 1 ) {
      Toast.loading('加载中, 请稍候...');
    }

    $.ajax({
      type: method,
      url: /^https?:\/\//.test( url ) ? url : env.urlAppRoot + url,
      data: isRPC ? JSON.stringify(body) : body,
      dataType: dataType,
      beforeSend: function (xhr) {
          if (sessionId) {
              //xhr.withCredentials = true
              xhr.setRequestHeader("Authorization", "silo " + btoa(sessionId))
          }
      },
      success: (recv) => {
        let code = recv.protocError;
        if (code === 0) {
          resolve(recv);
        } else if (code === 403) {
          session.clear();
          reject(code);
          //alert("登录超时！");
          location.reload();
        } else {
          reject(code);
          Toast.error('服务器异常或没有数据: ' + code);
        }
      },
      error: (xhr, status, err) => {
        reject(xhr, status, err);
        Toast.error(`与服务器失去连接, code: ${status}`);
      },
      complete: () => {
        if(--requestCount == 0){
          Toast.hide();
        }
      }
    });
  });
};

let fetch = ( args ) => {
  return new Promise((resolve, reject) => {
    signIn.ready(() => {
      request(args).then((res) => {
        //if (res.result == 0) {
          resolve(res);
        /*} else {
          reject(res);
        }*/
      }, (err) => {
        reject(err);
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
