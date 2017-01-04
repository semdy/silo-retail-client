
/* 基础配置 */
const urlAppRoot = 'http://it.zaofans.com/hawk/app/retail';
const urlConfigGet = `${urlAppRoot}/7001.json`;
const urlSignIn = `${urlAppRoot}/7003.json`;
const urlReportPayment = `${urlAppRoot}/7101.json`;

const ddConfigReq = JSON.stringify({keyCorp: 1000, keyApp: 1050});

const jsApiList = ['runtime.info', 'biz.contact.choose',
    'device.notification.confirm', 'device.notification.alert',
    'device.notification.prompt', 'biz.ding.post',
    'biz.util.openLink'];

var sessionInfo = null;
var sessionHeader = '';
var isSigined = false;

var isDD = navigator.userAgent.indexOf("DingTalk") > -1;


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
    var json = JSON.stringify({corpId: corp, code: code});

    return new Promise(function (resolve, reject) {
        httpPostJson(urlSignIn, json, function (hint) {
            onHttpError(hint);
            reject(hint);
        }, function (recv) {
            var json = JSON.parse(recv);
            if (json.session) {
                sessionInfo = json.session;
                sessionHeader = JSON.stringify({sessionId: sessionInfo.sessionId});
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

    return new Promise(function(resolve, reject){
        httpPostJson(urlReportPayment, json, function (hint) {
            onHttpError(hint);
            reject(hint);
        }, function (recv) {
            //alert('retail.payment.report.hour: ' + recv);
            var res = JSON.parse(recv);
            if (res.result == 0) {
                resolve(res);
            } else {
                reject(res);
            }
        });
    });
}

function signIn() {
    return new Promise(function (resolve, reject) {
        if( isDD && !isSigined ) {
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
exports.httpRequestReportPayment = function () {
    var args = arguments;
    return new Promise(function (resolve, reject) {
        signIn().then(function () {
            httpRequestReportPayment.apply(null, args).then(function (res) {
                resolve(res);
            }, function (err) {
                reject(err);
            });
        });
    });
};