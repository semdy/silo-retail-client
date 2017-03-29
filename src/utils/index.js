let {Dialog} = SaltUI;
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

export const isDD = navigator.userAgent.indexOf("DingTalk") > -1;

export const ask = (prompMsg) => {
  /*return new Promise((resolve, reject) => {
   if (isDD) {
   dd.device.notification.confirm({
   message: prompMsg,
   title: locale.prompt,
   buttonLabels: [locale.ok, locale.cancel],
   onSuccess: function (result) {
   if (result.buttonIndex == 0) {
   resolve();
   } else {
   reject();
   }
   },
   onFail: function (err) {
   reject(err);
   }
   });
   } else {
   if (confirm(prompMsg)) {
   resolve();
   }
   }
   });*/

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

//生成统计的标准的数据格式
export const genStatsData = (statsData, fieldList) => {
  let res = [];
  let uid = 0;
  let FIELD_MONEY = "trade.money";
  let FIELD_MONEY_OL = "trade.money.ol";

  let itemMoney = statsData.filter((item) => {
     if( item.field === FIELD_MONEY || item.field === FIELD_MONEY_OL ){
       return true;
     } else {
       return false;
     }
  });

  let fields = fieldList.map((field) => {
    return {
      field: field
    }
  });

  let getItem = function (data, field) {
    return data.find((item) => {
      return item.field === field;
    }) || {value: 0};
  };

  fields.forEach((item, i) => {
      if (item.field === FIELD_MONEY || item.field === FIELD_MONEY_OL) {
        return false
      }
      res.push({
        name: locale.stats.title[item.field],
        value: getItem(statsData, item.field).value,
        suffix: locale.stats.unit[item.field],
        subAmount: (itemMoney[uid++]||{}).value
      });
    });

  return res;
};
