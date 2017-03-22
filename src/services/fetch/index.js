import {isRPC, env} from '../config'
import {signIn, session} from '../auth';
import locale from '../../locale';
import config from '../../config';
let {Toast} = SaltUI;

let requestCount = 0;
let requestError = false;

let request = ({url, body = {}, method = 'post', dataType = 'json'}) => {
  return new Promise((resolve, reject) => {

    body = Object.assign(body, {lang: config.lang});

    requestCount++;
    requestError = false;

    if (requestCount == 1) {
      Toast.loading(locale.loading);
    }

    $.ajax({
      type: method,
      url: /^https?:\/\//.test(url) ? url : env.urlAppRoot + url,
      data: isRPC ? JSON.stringify(body) : body,
      dataType: dataType,
      beforeSend: function (xhr) {
        let sessionId = session.get().sessionId;
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
          alert(locale.loginTimeout);
          location.reload();
        } else {
          reject(code);
          requestError = true;
          Toast.error(`${locale.serverError}, code: ${code}`);
        }
      },
      error: (xhr, status, err) => {
        reject(xhr, status, err);
        requestError = true;
        Toast.error(`${locale.disconnect}, code: ${status}`);
      },
      complete: () => {
        if (--requestCount == 0) {
          if (!requestError) {
            Toast.hide();
          }
        }
      }
    });
  });
};

let fetch = (args) => {
  return new Promise((resolve, reject) => {
    signIn.ready(() => {
      request(args).then((res) => {
        if (res.result == 0 || res.result === undefined) {
          resolve(res);
        } else {
          reject(res);
          alert("error code:" + res.result);
        }
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
