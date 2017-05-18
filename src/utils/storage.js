let isLocalStorageSupported = function () {
  var testKey = 'test', storage = window.localStorage;
  try {
    storage.setItem(testKey, '1');
    storage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}();

let cookie = {
  defaults: {
    path: '/'
  },
  set (key, value, expires, path, domain, secure) {
    if (value === undefined) return;

    var options = {
      expires: expires,
      path: path,
      domain: domain,
      secure: secure
    };

    options = Object.assign({}, this.defaults, options);

    if (value === null || value === "") {
      options.expires = -1;
    }

    if (typeof options.expires === 'number') {
      var days = options.expires,
        time = options.expires = new Date();
      time.setDate(time.getDate() + days);
    }

    value = typeof value === 'object' ? JSON.stringify(value) : value;

    return (document.cookie = [
      encodeURIComponent(key), '=', encodeURIComponent(value),
      options.expires ? '; expires=' + options.expires.toUTCString() : '',
      options.path ? '; path=' + options.path : '',
      options.domain ? '; domain=' + options.domain : '',
      options.secure ? '; secure' : ''
    ].join(''));
  },
  get (key) {
    var
      cookies = document.cookie.split('; '),
      result = key ? null : {},
      parts,
      name,
      cookie;

    var decode = function (s) {
      return unRfc2068(decodeURIComponent(s.replace(/\+/g, ' ')));
    };

    var unRfc2068 = function (value) {
      if (value.indexOf('"') === 0) {
        value = value.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
      }
      return value;
    };

    for (var i = 0, l = cookies.length; i < l; i++) {
      parts = cookies[i].split('=');
      name = decode(parts.shift());
      cookie = decode(parts.join('='));

      if (key && key === name) {
        result = cookie;
        break;
      }

      if (!key) {
        result[name] = cookie;
      }
    }

    try {
      return JSON.parse(result);
    } catch (e) {
      return result;
    }
  },
  remove (key) {
    if (this.get(key) !== null) {
      var arg = [].slice.call(arguments, 1);
      arg.unshift(key, null);
      this.set.apply(this, arg);
      return true;
    }
    return false;
  },
  clear(){
    let keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    if (keys) {
      for (var i = keys.length; i--;)
        document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString();
    }
  },
  length(){
    return document.cookie.length;
  }
};

let localStorage = {
  set (key, value) {

    if (typeof value === 'object') {
      value = JSON.stringify(value);
    }

    if (isLocalStorageSupported) {
      window.localStorage.setItem(key, encodeURIComponent(value));
    } else {
      cookie.set(key, value, 3650);
    }
  },
  get (key) {
    let val = '';

    if (isLocalStorageSupported) {
      val = decodeURIComponent(window.localStorage.getItem(key));
    } else {
      val = cookie.get(key);
    }

    try {
      return JSON.parse(val);
    } catch (e) {
      return val;
    }

  },
  remove (key){
    if (isLocalStorageSupported) {
      window.localStorage.removeItem(key);
    } else {
      cookie.remove(key);
    }
  },
  clear(){
    if (isLocalStorageSupported) {
      window.localStorage.clear();
    } else {
      cookie.clear();
    }
  },
  length(){
    return window.localStorage.length;
  }
};

let sessionStorage = {
  set (key, value) {

    if (typeof value === 'object') {
      value = JSON.stringify(value);
    }

    if (isLocalStorageSupported) {
      window.sessionStorage.setItem(key, encodeURIComponent(value));
    } else {
      cookie.set(key, value);
    }
  },
  get (key) {
    let val = '';

    if (isLocalStorageSupported) {
      val = decodeURIComponent(window.sessionStorage.getItem(key));
    } else {
      val = cookie.get(key);
    }

    try {
      return JSON.parse(val);
    } catch (e) {
      return val;
    }
  },
  remove (key){
    if (isLocalStorageSupported) {
      window.sessionStorage.removeItem(key);
    } else {
      cookie.remove(key);
    }
  },
  clear(){
    if (isLocalStorageSupported) {
      window.sessionStorage.clear();
    } else {
      cookie.clear();
    }
  },
  length(){
    return window.sessionStorage.length;
  }
};

module.exports = {
  cookie,
  localStorage,
  sessionStorage
};