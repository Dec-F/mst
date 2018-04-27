
// 设置cookie
// name=value; expires=expiration_time; path=domain_path; domain=domain_name; secure
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
  cookieStart = document.cookie.indexOf(cookieName),
  cookieValue = "";
  if (cookieStart > -1) {
    var cookieEnd = document.cookie.indexOf (";", cookieStart);
    if (cookieEnd == -1) {
      cookieEnd = document.cookie.length;
    }
    cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd));
  }
  return cookieValue; 
}

export const apiRequest = async (apiFn, args=[]) => {
  let res = await apiFn.apply(null, args);
  if(res.resCode === 200){
    return { status: true, result: res.data };
  }else{
    return { status: false, result: res.resMsg };
  }
}



