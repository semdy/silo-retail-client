import { Dialog } from 'saltui';
import config from '../config';
import locale from '../locale';

export const queryUrlParams = () => {
  let params = {};
  let querystr = window.location.search.substring(1);
  if (!querystr || querystr.length === 0) {
    return params
  }
  let pairs = querystr.split('&');
  let len = pairs.length;
  if (len <= 0) {
    return params
  }
  for (let i = 0; i < len; ++i) {
    let pair = decodeURIComponent(pairs[i]);
    let split = pair.indexOf('=');
    if (split <= 0) {
      params[pair] = '';
      continue
    }
    let name = pair.substring(0, split);
    let value = pair.substring(split + 1);
    params[name] = value
  }
  return params;
};

let ua = navigator.userAgent;

export const isDD = ua.indexOf("DingTalk") > -1;
export const isIOS = ua.match(/iPhone|iPod|iPad/);
export const isAnroid = ua.match(/Android/i);

export const ask = (prompMsg) => {
  return new Promise((resolve, reject) => {
    Dialog.confirm({
      title: locale.prompt,
      content: prompMsg,
      locale: config.lang,
      onConfirm() {
        resolve(prompMsg);
      },
      onCancel() {
        reject(false);
      }
    });
  });
};

export const alert = (msg) => {
  return new Promise((resolve, reject) => {
    Dialog.alert({
      title: locale.prompt,
      content: msg,
      locale: config.lang,
      onConfirm() {
        resolve(msg);
      }
    });
  });
};

//获取距离今天指定日期对象
export const getDateBefore = (offset) => {
  let date = new Date();
  date.setDate(date.getDate() - offset);
  return date;
};

//生成table datagrid标准的数据格式
export const genTableRows = (series) => {
  let res = [];
  series.forEach((item) => {
    res.push({
      name: item.name,
      count: item.value[0],
      money: item.params.money
    });
  });

  return res;
};

const getItem = function (data, field) {
  let item = data.find((item) => {
    return item.field === field;
  });
  return item || {};
};

//生成统计的标准的数据格式
export const genStatsData = (statsData, fieldList) => {
  let res = [];
  let FIELD_MONEY = "trade.money";
  let FIELD_MONEY_OL = "trade.money.ol";

  let valueMap = {
    'trade.count': FIELD_MONEY,
    'trade.count.ol': FIELD_MONEY_OL
  };

  let subAmount;

  fieldList.forEach((field) => {
    if (field !== FIELD_MONEY && field !== FIELD_MONEY_OL) {
      res.push({
        name: locale.stats.title[field],
        value: getItem(statsData, field).value || 0,
        suffix: locale.stats.unit[field],
        subAmount: subAmount = getItem(statsData, valueMap[field]).value
      });
    }
  });

  if( subAmount !== undefined ){
    res.forEach((item) => {
      item.subAmount = item.subAmount || 0;
    });
  }

  return res;
};

export const genStatsDataByMoney = (statsData, fieldList) => {
  let res = [];

  fieldList.forEach((field) => {
    res.push({
      name: locale.stats.title[field],
      value: getItem(statsData, field).value || 0,
      suffix: locale.stats.unit[field]
    });
  });

  return res;
};

function isWindow(obj) {
  return typeof obj === 'object' && obj !== null && !!obj.setInterval;
}

function isWindowOrDoc(target) {
  return isWindow(target) || (target.nodeType && target.nodeType === 9);
}

/**
 *scrollTop|scrollLeft动画
 * @param {DOMObject} 滚动的dom对象
 * @param {string} scrollLeft|scrollTop
 * @param {number} 滚动值
 * @param {number} 滚动速度
 * @param {Function} 滚动完成后的回调
 */
export const scrollTo = (elem, scrollAttr = 'scrollTop', value = 0, duration = 600, callback) => {
  let initScroll,
    setScroll,
    percent,
    reqAniFrame,
    startTime = Date.now();

  if (isWindowOrDoc(elem)) {
    let db = document.body,
      de = document.documentElement;
    initScroll = db[scrollAttr] || de[scrollAttr];
    setScroll = function (value) {
      db[scrollAttr] = de[scrollAttr] = value;
    };
  } else {
    initScroll = elem[scrollAttr];
    setScroll = function (value) {
      elem[scrollAttr] = value;
    };
  }

  let diffScroll = value - initScroll;

  if (diffScroll === 0) return;

  let executeScroll = function () {
    percent = (Date.now() - startTime) / duration;
    percent = percent >= 1 ? 1 : percent;

    setScroll(initScroll + diffScroll * percent);
    reqAniFrame = requestAnimationFrame(executeScroll);

    if (percent === 1) {
      cancelAnimationFrame(reqAniFrame);
      typeof callback === 'function' && callback.call(elem);
    }
  };

  executeScroll();
};
