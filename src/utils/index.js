let { Toast } = SaltUI;

const queryUrlParams = () => {
  let params = {};
  let querystr = window.location.search.substring(1);
  if (!querystr || querystr.length == 0) {
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

const isDD = navigator.userAgent.indexOf("DingTalk") > -1;

module.exports = {
  queryUrlParams,
  isDD
};
