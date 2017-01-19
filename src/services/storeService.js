
import { fetch } from './fetch';
import { getSessionHeader } from './auth';

export const httpRequestReportPayment = (query, storeId, offset) => {
  let params = {
    protoc2S: getSessionHeader(),
    query,
    storeId,
    offset
  };
  return fetch.post('7101.json', params);
};

export const httpRequestStoreList = () => {
  return fetch.post('7103.json');
};