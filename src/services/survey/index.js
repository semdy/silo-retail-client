
import { fetch } from '../fetch';

export const getStoreChartReport = (storeId, query = 'retail.dashboard.gist') => {
  let params = {
    storeId,
    query
  };

  return new Promise((resolve, reject) => {
    fetch.post('7109.json', params).then((res) => {
      resolve(res.chart);
    }, (err) => {
      reject("error: " + err);
    });
  });
};