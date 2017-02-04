
import { fetch } from './fetch';

export const httpRequestReportPayment = (query, storeId, offset) => {
  let params = {
    query,
    storeId,
    offset
  };
  return fetch.post('7101.json', params);
};

export const httpRequestStoreList = () => {
  return fetch.post('7103.json');
};