import {fetch} from '../fetch';
import { signIn } from '../auth';
import actions from '../../app/actions';

/**
 *获取店铺相关销售数据
 * @param {string} 后端请求key, 取值如：retail.payment.report.hour|retail.payment.report.day|retail.payment.report.week e.g.
 * @param {string} 店铺id
 * @param {number} 时间间隔, 根据query里指定数据单元，0取当前单元数据，-1取上一单元数据，-2取上上单元数据 e.g.
 * @return http promise
 * */
export const fetchReportPayment = (query, storeId, offset) => {
  let params = {
    query,
    storeId,
    offset
  };
  return fetch.post('7101.json', params);
};


let readyQueue = [];
let isReady = false;
let storeList = [];
let errMsg = null;

function ready(fun) {
  if (typeof fun == 'function') {
    if (!isReady) {
      readyQueue.push(fun);
    } else {
      fun();
    }
  }
}

function triggerReady() {
  isReady = true;
  readyQueue.forEach((itemFun) => {
    itemFun();
  });
  readyQueue = [];
}

export const fetchStoreList = () => {
  fetch.post('7103.json').then((stores) => {
    storeList = stores.data;
    triggerReady();
  }, (err) => {
    errMsg = err;
    console.error("get storeList error:" + err);
    triggerReady();
  });
};

signIn.ready(() => {
  fetchStoreList();
});


/**
 * 获取全部的店铺列表。
 * 由于每个页面都需要用到storeList,
 * 为了保证不同路由只发送一次请求，因此将接口放入队列里，请求成功后再返回storeList。
 * @return promise
 * */
export const getStoreList = () => {
  return new Promise((resolve, reject) => {
    ready(() => {
      if (errMsg) {
        reject(errMsg);
      } else {
        if( storeList.length == 0 ){
          reject("empty storelist data");
        } else {
          if( storeList.length > 1 ){
            actions.showStoreList();
          }
          resolve(storeList);
        }
      }
    });
  });
};