
const urlParams = fetchUrlParams();
const urlDingTalk = 'http://it.zaofans.com/silo/app/retail';
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
var envKey = urlParams['env']
if (!envKey) {
    envKey = 'release'
}
const env = envConfigs[envKey]
if (!env) {
    alert('环境参数配置错误\n' + envKey)
}

const isDD = navigator.userAgent.indexOf("DingTalk") > -1

/* 基础配置 */
const urlAppRoot = env.urlAppRoot
const urlConfigGet = `${urlDingTalk}/7001.json`
const urlSignIn = `${urlAppRoot}/7003.json`
const urlReportPayment = `${urlAppRoot}/7101.json`

const ddConfigReq = JSON.stringify({ keyCorp: 1000, keyApp: env.keyApp })
const jsApiList = ['runtime.info', 'biz.contact.choose',
    'device.notification.confirm', 'device.notification.alert',
    'device.notification.prompt', 'biz.ding.post',
    'biz.util.openLink'];

var sessionInfo = null;
var sessionHeader = '';
var isSigined = false;

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
    /* 请求钉钉的JS-API签名信息 */
    httpPostJson(urlConfigGet, ddConfigReq, function (hint) {
        onHttpError(hint)
    }, function (recv) {
        yes && yes(JSON.parse(recv))
    })
}

function httpRequestSignIn(code, corp) {
    /* 请求使用钉钉返回的验证码登录 */
    var json = JSON.stringify({ corpId: corp, code: code });

    return new Promise(function (resolve, reject) {
        httpPostJson(urlSignIn, json, function (hint) {
            onHttpError(hint);
            reject(hint);
        }, function (recv) {
            var json = JSON.parse(recv);
            if (json.session) {
                sessionInfo = json.session;
                sessionHeader = { sessionId: sessionInfo.sessionId };
                //alert('sign in ok: ' + JSON.stringify(sessionInfo));
                resolve(sessionInfo);
                isSigined = true;
            }
        });
    });
}

function httpRequestReportPayment(query, storeId, offset) {
    var json = JSON.stringify({
        protoc2S: sessionHeader,
        query: query,
        storeId: storeId,
        offset: offset
    });
    return new Promise(function (resolve, reject) {
        httpPostJson(urlReportPayment, json, function (hint) {
            onHttpError(hint);
            reject(hint);
        }, function (res) {
            //alert('retail.payment.report.hour: ' + recv);
            if (res.result == 0) {
                resolve(res.data);
            } else {
                reject(res);
            }
        });
    });
}

function httpRequestStoreList() {
    return new Promise(function (resolve, reject) {
        const url = `${urlAppRoot}/7103.json`;
        httpPostJson(url, '{}', function (hint) {
            onHttpError(hint);
            reject(hint);
        }, function (res) {
            if (res.result == 0) {
                resolve(res.data);
            } else {
                reject(res);
            }
        });
    });
}

function signIn() {
    return new Promise(function (resolve, reject) {
        if (isDD && !isSigined) {
            httpRequestConfig(function (json) {
                var config = json.config;
                config.jsApiList = jsApiList;
                dd.config(config);
                dd.ready(function () {
                    onDingTalkYes(json.config.corpId).then(function (sessionInfo) {
                        resolve(sessionInfo);
                    }, function (err) {
                        reject(err);
                    });
                });
                dd.error(function (err) {
                    onDingTalkErr(err);
                    reject(err);
                });
            });
        } else {
            resolve(sessionInfo);
        }
    });
}

function signOut() {

}

function httpPostJson(url, send, err, yes) {
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



function onHttpError(hint) {
    alert('网络不给力，请稍后刷新重试。\n' + hint)
}

function onDingTalkErr(err) {
    alert('钉钉客户端出错了！\n' + JSON.stringify(err))
}

function onDingTalkApiFail(err, api) {
    alert('钉钉接口调用出错了！\n' + api + '\n' + JSON.stringify(err))
}

exports.signIn = signIn;
exports.signOut = signOut;
exports.httpRequestReportPayment = httpRequestReportPayment;
exports.httpRequestStoreList = httpRequestStoreList;