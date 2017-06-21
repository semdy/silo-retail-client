import {isRPC, env} from '../config'
import {session, gotoLogin} from '../auth';
import actions from '../../app/actions';
import locale from '../../locale';
import config from '../../config';

let {Toast} = SaltUI;

let requestCount = 0;
let requestError = false;

let fetch = ({url, body = {}, method = 'post', dataType = 'json'}, showLoading = true) => {
  return new Promise((resolve, reject) => {

    body = Object.assign(body, {lang: config.lang});

    requestCount++;
    requestError = false;

    if (requestCount === 1) {
      showLoading && Toast.loading(locale.loading);
    }

    let rejectMsg = '';

    $.ajax({
      type: method,
      url: /^https?:\/\//.test(url) ? url : env.urlAppRoot + url,
      data: isRPC ? JSON.stringify(body) : body,
      dataType: dataType,
      beforeSend: function (xhr) {
        let info = session.get();
        if (info) {
          //xhr.withCredentials = true
          xhr.setRequestHeader("Authorization", "silo " + btoa(info.sessionId))
        }
      },
      success: (recv) => {
        let code = recv.protocError;
        if (code === 0) {
          if (recv.result === 0 || recv.result === undefined) {
            resolve(recv);
          } else {
            requestError = true;
            rejectMsg = `protoc:${url.split(".")[0]}, code:${recv.result}`;
            reject(rejectMsg);
            Toast.error(rejectMsg);
          }
        } else if (code === 403) {
          session.clear();
          reject(code);
          //alert(locale.loginTimeout);
          //location.reload();
          gotoLogin();
        } else {
          requestError = true;
          rejectMsg = `protocError ${code}`; //${locale.serverError}
          reject(rejectMsg);
          Toast.error(rejectMsg);
        }
      },
      error: (xhr, status, err) => {
        requestError = true;
        rejectMsg = `${err}, status ${status}`; //${locale.disconnect}
        reject(rejectMsg);
        Toast.error(rejectMsg);
      },
      complete: () => {
        if (--requestCount === 0) {
          if (!requestError) {
            Toast.hide();
          }
          actions.hideP2R();
        }
      }
    });
  });
};

fetch.post = (url, params = {}, showLoading) => {
  return fetch(Object.assign({body: params}, {url, method: 'post'}), showLoading);
};

fetch.get = (url, params = {}, showLoading) => {
  return fetch(Object.assign({body: params}, {url, method: 'get'}), showLoading);
};

module.exports = {
  fetch
};
