let {hashHistory} = ReactRouter;
import {fetch} from '../fetch';
import {signIn} from '../auth';
import actions from '../../app/actions';

//常量
const AUTH_TYPE = 17001;

/**
 *获取店铺相关销售数据
 * @param {string} 后端请求key, 取值如：retail.payment.report.hour|retail.payment.report.day|retail.payment.report.week etc.
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
let storeErrMsg = null;
let storeList = [];
let selectedStoreList = [];
let manager = {
  storeId: null,
  userId: null
};

function storeReady(fun) {
  if (typeof fun === 'function') {
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

/**
 * 远程获取店铺列表数据
 * @return {Promise}
 */

export const fetchStoreList = () => {
  isReady = false;
  storeErrMsg = null;
  fetch.post('7103.json').then((res) => {
    storeList = res.data;
    manager.storeId = res.idAsManager;
    manager.userId = res.managerUserId;

    //区分普通会员与店长身份
    if (!res.idAsManager) {
      actions.setAdmin(false);
    } else {
      actions.setAdmin(true);
    }

    if (storeList.length === 0) {
      storeErrMsg = "empty storelist data";
      //隐藏顶部导航
      actions.showScrollNav(false);
      hashHistory.replace('/report.index');
    } else {
      if (storeList.length > 1) {
        //默认把第一家店铺选中
        storeList[0].selected = true;
        //设置显示店铺名称
        actions.setStore(storeList[0]);
        //填充店铺列表数据
        actions.setStoreList(storeList);
        //显示店铺
        actions.showStoreList();
        //显示顶部导航
        actions.showScrollNav(true);
      }
    }
    triggerReady();
  }, (err) => {
    storeErrMsg = "get storeList error => " + err;
    triggerReady();
  });
};

/**
 * 获取店铺列表缓存数据
 * @return {Promise}
 */
export const getStoreList = () => {
  return new Promise((resolve, reject) => {
    if (selectedStoreList.length > 0) {
      actions.setStore(selectedStoreList[0]);
      return resolve(selectedStoreList);
    }
    storeReady(() => {
      if( storeErrMsg ) {
        return reject(storeErrMsg);
      }
      resolve(storeList);
    });
  });
};

signIn.ready(() => {
  fetchStoreList();
});

/**
 * 获得店铺数据集
 * */
export const getStoreModel = () => {
  return storeList;
};

/**
 * 保存店铺选择状态
 * @param {Array} stores
 * @return {*}
 */
export const setStoreModel = (stores) => {
  return selectedStoreList = stores;
};

/**
 * 获取店长所有店铺storeId
 * */
export const getManager = () => {
  return manager;
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

  return fetch.post('7107.json', params);
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
        authType: AUTH_TYPE,
        authParams: [storeId]
      });
    });
  } else {
    params.push({
      authType: AUTH_TYPE,
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
    authType: AUTH_TYPE,
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
    storeReady(() => {
      let params = {
        authType: AUTH_TYPE,
        pageCode,
        pageSize,
        authParamStr: getManager().storeId //店长所在店铺storeId
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
    storeReady(() => {
      let params = {
        pageSize,
        pageCode,
        authType: AUTH_TYPE,
        authParamStr: getManager().storeId //获取店长所在店铺storeId
      };

      fetch.post('7019.json', params).then((res) => {
        resolve(res.data);
      }, (err) => {
        reject(err);
      });

    });
  });
};

/**
 * 移除店铺成员
 * @param {string} 会员id
 * @return http promise
 * */
export const authorityRemove = (userId) => {
  return new Promise((resolve, reject) => {
    storeReady(() => {
      let params = {
        userId,
        authType: AUTH_TYPE,
        authParamStr: getManager().storeId //获取店长所在店铺storeId
      };

      fetch.post('7021.json', params).then((res) => {
        resolve(res);
      }, (err) => {
        reject(err);
      });

    });
  });
};

/**
 * 获取店铺可视化数据
 * @param {String} storeId 店铺storeId
 * @param {number} 倒推时间间隔，比如：1表示取昨天的数据，2表示取前天的数据， etc.
 * @param {String} query 查询关键字
 *  支持的query值:
 *  retail.dashboard.gist      首页概要数据
 *  retail.trade.shipment.type 配送方式
 *  retail.trade.payment.mode  支付方式
 * @return {Promise}
 */
export const getStoreChartReport = (storeId, offset = 0, query = 'retail.dashboard.gist') => {
  let params = {
    storeId,
    query,
    offset
  };

  //7109 -> 测试
  return new Promise((resolve, reject) => {
    fetch.post('7303.json', params).then((res) => {
      resolve(res.chart);
    }, (err) => {
      reject(err);
    });
  });
};

/**
 * 获取店铺统计数据
 * @param {String} storeId 店铺storeId
 * @param {Number} offsetFrom 日期偏移量开始(0:今天 1:一天前 2:两天前)
 * @param {Number} offsetDest 日期偏移量截止
 * @param {Array} fieldList 需要的字段
 *  pay   支付总金额
 *  promo 消费总金额
 * @return {Promise}
 */
export const getStoreStats = (storeId, offsetFrom = 0, offsetDest = 0, fieldList = []) => {
  let params = {
    storeId,
    offsetFrom,
    offsetDest,
    fieldList
  };

  return fetch.post('7301.json', params);
};