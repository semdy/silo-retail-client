let {Toast} = SaltUI;
import {fetch} from '../fetch';
import {signIn} from '../auth';
import actions from '../../app/actions';

//常量
const AUTHTYPE = 17001;

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
let managerId = null;
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
  fetch.post('7103.json').then((res) => {
    storeList = res.data;
    managerId = res.idAsManager;
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
        if (storeList.length == 0) {
          reject("empty storelist data");
        } else {
          if (storeList.length > 1) {
            actions.showStoreList();
          }
          resolve(storeList);
        }
      }
    });
  });
};

/**
 * 获取店长所有店铺storeId
 * */
export const getManagerId = () => {
  return managerId;
};

/**
 * 根据关键字搜索店铺
 * @param {string} 店铺关键字
 * @param {number} 单页加载数据条数
 * @param {number} 页码，起始值为1
 * @return http promise
 * */
export const storeSearch = (keyword = '', pageSize = 50, pageCode = 1) => {
  let params = {
    keyword,
    pageSize,
    pageCode
  };
  return new Promise((resolve, reject) => {
    fetch.post('7107.json', params).then((res) => {
      resolve(res.data);
    }, (err) => {
      reject(err);
      Toast.error(err);
    });
  });
};

/**
 * 申请店铺查看权限
 * @param {Array|string} 店铺ids/id
 * @return http promise
 * */
export const authorityApply = (storeIds = []) => {
  let params = [];
  if (Array.isArray(storeIds)) {
    storeIds.forEach((storeId) => {
      params.push({
        authType: AUTHTYPE,
        authParams: [storeId]
      });
    });
  } else {
    params.push({
      authType: AUTHTYPE,
      authParams: [storeIds]
    });
  }

  return fetch.post('7011.json', {authorities: params});

};

/**
 * 店铺申请记录
 * @param {number} 页码，起始值为1
 * @param {number} 一页数据条数
 * @return http promise
 * */
export const authorityApplyRecord = (pageCode = 1, pageSize = 50) => {
  let params = {
    authType: AUTHTYPE,
    pageCode,
    pageSize
  };
  return fetch.post('7015.json', params);
};

/**
 * 权限审批
 * @param {number} 页码
 * @param {number} 一页数据条数
 * @return http promise
 * */
export const authorityApproval = (pageCode = 1, pageSize = 50) => {
  return new Promise((resolve, reject) => {
    ready(() => {
      let params = {
        authType: AUTHTYPE,
        pageCode,
        pageSize,
        authParamStr: getManagerId() //店长所有店铺storeId
      };

      fetch.post('7017.json', params).then((res) => {
        resolve(res.data);
      }, (err) => {
        reject(err);
      });

    });
  });
};

/**
 * 权限审批
 * @param {string} 审批id
 * @param {boolean} 是否同意
 * @return http promise
 * */
export const authorityApprove = (applyId, agreed) => {
  let params = {
    applyId,
    agreed
  };
  return fetch.post('7013.json', params);
};

/**
 * 查看审批过的成员
 * @param {number} 页码
 * @param {number} 一页数据条数
 * @return http promise
 * */
export const authorityUserList = (pageCode = 1, pageSize = 50) => {
  return new Promise((resolve, reject) => {
    ready(() => {
      let params = {
        pageSize,
        pageCode,
        authType: AUTHTYPE,
        authParamStr: getManagerId() //获取店长所有店铺storeId
      };

      fetch.post('7019.json', params).then((res) => {
        resolve(res.data);
      }, (err) => {
        reject(err);
      });

    });
  });
};

export const authorityRemove = (userId) => {
  return new Promise((resolve, reject) => {
    ready(() => {
      let params = {
        userId,
        authType: AUTHTYPE,
        authParamStr: getManagerId() //获取店长所有店铺storeId
      };

      fetch.post('7021.json', params).then((res) => {
        resolve(res);
      }, (err) => {
        reject(err);
      });

    });
  });
};