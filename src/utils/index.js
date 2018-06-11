// 设置cookie name=value; expires=expiration_time; path=domain_path;
// domain=domain_name; secure
export const setCookie = (name, value, expires, domain, path, secure) => {
  var cookieText = "";
  cookieText += encodeURIComponent(name) + "=" + encodeURIComponent(value);
  if (expires instanceof Date) {
    cookieText += "; expires=" + expires.toGMTString();
  }
  if (path) {
    cookieText += "; path=" + path;
  }
  if (domain) {
    cookieText += "; domain=" + domain;
  }
  if (secure) {
    cookieText += "; secure";
  }
  document.cookie = cookieText;
}

// 获取cookie
export const getCookie = (name) => {
  var cookieName = encodeURIComponent(name) + "=",
    cookieStart = document
      .cookie
      .indexOf(cookieName),
    cookieValue = "";
  if (cookieStart > -1) {
    var cookieEnd = document
      .cookie
      .indexOf(";", cookieStart);
    if (cookieEnd == -1) {
      cookieEnd = document.cookie.length;
    }
    cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd));
  }
  return cookieValue;
}

export const apiRequest = async(apiFn, args = []) => {
  let res = await apiFn.apply(null, args);
  if (res.resCode === 200) {
    return {status: true, result: res.data};
  } else {
    return {status: false, result: res.resMsg};
  }
}
/**
 * 格式化url
 *
 * @param {string} url
 * @param {object} params
 * @returns {string}
 */
export const formatUrl = (url, params) => {
  let keys = Object.keys(params)
  let base = url.indexOf('?') > -1
    ? `${url}`
    : `${url}?`
  return keys.reduce((acc, v, i) => {
    if (i === 0) {
      return acc += `${v}=${params[v]}`
    } else {
      return acc += `&${v}=${params[v]}`
    }
  }, base)

}

// 日期时间格式化
export const parseTime = (time, cFormat) => {
  if (arguments.length === 0) {
    return null;
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
  let date;
  if (typeof time == 'object') {
    date = time;
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000;
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  };
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key];
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1];
    if (result.length > 0 && value < 10) {
      value = '0' + value;
    }
    return value || 0;
  });
  return time_str;
}
