'use strict';
/* 基础配置 */
const urlParams = fetchUrlParams();
const envConfigs = {
    release: {
        urlAppRoot: 'http://it.zaofans.com/silo/app/retail',
        keyApp: 1050,
    },
    test: {
        urlAppRoot: 'http://it.zaofans.com/silo/app/retail',
        keyApp: 1051,
    },
    debug: {
        urlAppRoot: 'http://it.zaofans.com/hawk/app/retail',
        keyApp: 1052,
    },
};
var envKey = urlParams['env'];
if (!envKey) {
    envKey = 'release';
}
const env = envConfigs[envKey]
if (!env) {
    alert('环境参数配置错误\n' + envKey);
}

let { Toast } = SaltUI;

const urlDingTalk = 'http://it.zaofans.com/silo/app/retail';
const urlAppRoot = env.urlAppRoot;

const isDD = navigator.userAgent.indexOf("DingTalk") > -1;
const cheatCode = urlParams['cheat'];

const jsApiList = ['runtime.info', 'biz.contact.choose',
    'device.notification.confirm', 'device.notification.alert',
    'device.notification.prompt', 'biz.ding.post',
    'biz.util.openLink'];

var sessionInfo = null;
var sessionHeader = '';
var sessionOK = false;

function sessionInit(info) {
    if (info == null) {
        return;
    }
    sessionInfo = info;
    sessionHeader = { sessionId: info.sessionId };
    window.localStorage['session'] = JSON.stringify(info);
    sessionOK = true;
}

function sessionClear() {
    sessionInfo = null;
    sessionHeader = null;
    window.localStorage['session'] = '';
    sessionOK = false;
}

function fetchUrlParams() {
    var params = {}
    var querystr = window.location.search.substring(1)
    if (!querystr || querystr.length == 0) {
        return params
    }
    var pairs = querystr.split('&')
    var len = pairs.length
    if (len <= 0) {
        return params
    }
    for (var i = 0; i < len; ++i) {
        var pair = decodeURIComponent(pairs[i])
        var split = pair.indexOf('=')
        if (split <= 0) {
            params[pair] = ''
            continue
        }
        var name = pair.substring(0, split)
        var value = pair.substring(split + 1)
        params[name] = value
    }
    return params
}

function onDingTalkYes(corp) {
    return new Promise(function (resolve, reject) {
        dd.runtime.permission.requestAuthCode({
            corpId: corp,
            onSuccess: function (result) {
                httpRequestSignIn(result.code, corp).then(function (sessionInfo) {
                    resolve(sessionInfo);
                }, function (err) {
                    reject(err);
                });
            },
            onFail: function (err) {
                onDingTalkApiFail(err, 'dd.runtime.permission.requestAuthCode');
                reject(err, 'dd.runtime.permission.requestAuthCode');
            }
        });
    });
}

function httpRequestConfig(yes) {
    let url = `${urlDingTalk}/7001.json`;
    let req = { keyCorp: 1000, keyApp: env.keyApp };
    /* 请求钉钉的JS-API签名信息 */
    httpPostJson(url, req).then(function (data) {
        yes && yes(data)
    }, function (hint) {
        onHttpError(hint)
    })
}

function httpRequestSignIn(code, corp) {
    /* 请求使用钉钉返回的验证码登录 */
    return new Promise(function (resolve, reject) {
        let url = `${urlAppRoot}/7003.json`;
        httpPostJson(url, { corpId: corp, code: code }).then(function (json) {
            if (json.session) {
                sessionInit(sessionInfo);
                resolve(sessionInfo);
            }
        }, function (hint) {
            onHttpError(hint);
            reject(hint);
        });
    });
}

function httpRequestSignInByUserPass(user, pass) {
    /* 请求使用用户名密码登录 */
    return new Promise(function (resolve, reject) {
        let url = `${urlAppRoot}/1003.json`;
        httpPostJson(url, { username: user, password: pass }).then(function (json) {
            if (json.session) {
                sessionInit(sessionInfo);
                resolve(sessionInfo);
            }
        }, function (hint) {
            onHttpError(hint);
            reject(hint);
        });
    });
}

function httpRequestReportPayment(query, storeId, offset) {
    return new Promise(function (resolve, reject) {
        let url = `${urlAppRoot}/7101.json`;
        let req = {
            protoc2S: sessionHeader,
            query: query,
            storeId: storeId,
            offset: offset
        };
        httpPostJson(url, req).then(function (json) {
            if (json.result == 0) {
                resolve(json.data);
            } else {
                reject(json);
            }
        }, function (hint) {
            onHttpError(hint);
            reject(hint);
        });
    });
}

function httpRequestStoreList() {
    return new Promise(function (resolve, reject) {
        const url = `${urlAppRoot}/7103.json`;
        httpPostJson(url, {}).then(function (res) {
            if (res.result == 0) {
                resolve(res.data);
            } else {
                reject(res);
            }
        }, function (hint) {
            onHttpError(hint);
            reject(hint);
        });
    });
}

const username = urlParams['user'];
const password = urlParams['pass'];

function signIn() {
    return new Promise(function (resolve, reject) {
        if (sessionOK) {
            resolve(sessionInfo);
        } else {
            var jsonStr = window.localStorage['session'];
            if (jsonStr) {
                sessionInit(JSON.parse(jsonStr));
                resolve(sessionInfo);
            } else {
                if (username && password) {
                    httpRequestSignInByUserPass(username, password).then(function (sessionInfo) {
                        resolve(sessionInfo);
                    }, function (err) {
                        reject(err);
                    });
                } else {
                    httpRequestConfig(function (json) {
                        var config = json.config;
                        config.jsApiList = jsApiList;
                        dd.config(config);
                        dd.ready(function () {
                            onDingTalkYes(config.corpId).then(function (sessionInfo) {
                                resolve(sessionInfo);
                            }, function (err) {
                                reject(err);
                            });
                        });
                        dd.error(function (err) {
                            onDingTalkErr(err);
                            reject(err);
                        })
                    })
                }
            }
        }
    });
}

function httpPostJson(url, obj) {
    var promise = new Promise(function executor(resolve, reject) {
        httpPostData(url, JSON.stringify(obj),
            function (hint) {
                reject(hint);
            },
            function (recv) {
                let json = recv;
                let code = json.protocError;
                if (code === 0) {
                    resolve(json);
                } else if (code === 403) {
                    sessionClear();
                    reject(code);
                } else {
                    reject(code);
                    onProtocError(code);
                }
            })
    });
    return promise;
}

function httpPostData(url, send, err, yes) {
    $.ajax({
        url: url, type: 'POST',
        crossDomain: true,
        data: send,
        dataType: 'json',
        success: yes,
        error: function (xhr, ajaxOptions, thrownError) {
            err && err(xhr.statusText)
        }
    })
}

function onProtocError(code) {
  //alert('服务器响应出错了: ' + code)
  Toast.show({
    type: 'error',
    content: '服务器响应出错了: ' + code
  });
}

function onHttpError(hint) {
  //alert('网络不给力，请稍后刷新重试。\n' + hint)
  Toast.show({
    type: 'error',
    content: '网络不给力，请稍后刷新重试。\n' + hint
  });
}

function onDingTalkErr(err) {
  //alert('钉钉客户端出错了！\n' + JSON.stringify(err))
  Toast.show({
    type: 'error',
    content: '钉钉客户端出错了！\n' + JSON.stringify(err)
  });
}

function onDingTalkApiFail(err, api) {
  //alert('钉钉接口调用出错了！\n' + api + '\n' + JSON.stringify(err))
  Toast.show({
    type: 'error',
    content: '钉钉接口调用出错了！\n' + api + '\n' + JSON.stringify(err)
  });
}

exports.httpRequestReportPayment = httpRequestReportPayment;
exports.httpRequestStoreList = httpRequestStoreList;
/*
exports.httpRequestStoreList = function () {
    return new Promise(function (resolve, reject) {
    })
}
exports.httpRequestReportPayment = function () {
    return new Promise(function (resolve, reject) {
    });
} //*/

//signIn();