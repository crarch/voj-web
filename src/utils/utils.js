import moment from 'moment';
import 'moment/locale/zh-cn';
import { createHashHistory as createHistory } from 'history';

const history = createHistory();
export function getHistory() {
  return history;
}

export function isMobileDevice() {
  const sUserAgent = navigator.userAgent;
  return (sUserAgent.indexOf('Android') > -1 || sUserAgent.indexOf('iPhone') > -1 || sUserAgent.indexOf('iPad') > -1 || sUserAgent.indexOf('iPod') > -1 || sUserAgent.indexOf('Symbian') > -1);
}

/** 
* param 将要转为URL参数字符串的对象 
* key URL参数字符串的前缀 
* encode true/false 是否进行URL编码,默认为true 
*  
* return URL参数字符串 
*/
export function urlEncode(param, key, encode) {
  if (param == null) return '';
  var paramStr = '';
  var t = typeof (param);
  if (t === 'string' || t === 'number' || t === 'boolean') {
    paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param);
  } else {
    for (var i in param) {
      var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
      paramStr += urlEncode(param[i], k, encode);
    }
  }
  return paramStr;
};

export function urlEncode2(obj) {
  try {
    return JSON.stringify(obj).replace(/:/g, "=").replace(/"/g, '').replace(/,/g, '&').match(/\{([^)]*)\}/)[1];
  } catch (e) {
    console.error(e);
    return "";
  }
}

export function parseTimePoint(time) {
  return moment(time).format('LLLL');
}

export function parseTimePeriod(time) {
  return moment.duration(time).humanize();
}

export function getTextFieldValue(el) {
  return el.current.childNodes[el.current.childElementCount - 1].childNodes[0].value;
}

export function sleep(time_ms) {
  return new Promise(accept => {
    setTimeout(accept, time_ms);
  });
}

// 设置到本周的星期几
Date.prototype.setDay = function (day) {
  let day_ = this.getDay();
  if (day_ === day) return this;
  this.setTime(this.getTime() + 1000 * 60 * 60 * 24 * (day - day_));
  return this;
};

// 获取 YYYY-MM-DD 格式
Date.prototype.toDateString = function () {
  return this.toISOString().slice(0, 10);
};

// export function cutString(str, length=10)

export function isIterator(obj) {
  return obj != null && typeof obj[Symbol.iterator] === 'function';
}

// 下载文件方法
export function funDownload(content, filename) {
  var eleLink = document.createElement('a');
  eleLink.download = filename;
  eleLink.style.display = 'none';
  // 字符内容转变成blob地址
  var blob = new Blob([content]);
  eleLink.href = URL.createObjectURL(blob);
  // 触发点击
  document.body.appendChild(eleLink);
  eleLink.click();
  // 然后移除
  document.body.removeChild(eleLink);
};


export function deepCopy(data) {
  if (data === null || data === undefined) {
    return data;
  } if (isIterator(data) && typeof (data) !== "string") {
    let d = [];
    for (let i = 0; i < data.length; i++) {
      d.push(data[i]);
    }
    return d;
  } else if (typeof (data) === "object") {
    let d = {};
    for (const k in data) {
      d[k] = deepCopy(data[k]);
    }
    return d;
  } else {
    return data;
  }
}

export function objectUpdate(origin, update) {
  let now = deepCopy(origin);
  for (const k in update) {
    now[k] = update[k];
  }
  return now;
}

// https://www.jianshu.com/p/7407bd65b15d
export function isObjectValueEqual(a, b) {
  var aProps = Object.getOwnPropertyNames(a);
  var bProps = Object.getOwnPropertyNames(b);
  if (aProps.length !== bProps.length) {
    return false;
  }
  for (var i = 0; i < aProps.length; i++) {
    var propName = aProps[i]

    var propA = a[propName]
    var propB = b[propName]
    // 2020-11-18更新，这里忽略了值为undefined的情况
    // 故先判断两边都有相同键名
    if (!b.hasOwnProperty(propName)) return false
    if ((propA instanceof Object)) {
      if (isObjectValueEqual(propA, propB)) {
        // return true     这里不能return ,后面的对象还没判断
      } else {
        return false
      }
    } else if (propA !== propB) {
      return false
    } else { }
  }
  return true
}

// Array.prototype.indexOf = function (val) {
//   for (var i = 0; i < this.length; i++) {
//     if (this[i] == val) return i;
//   }
//   return -1;
// };

// Array.prototype.remove = function (val) {
//   var index = this.indexOf(val);
//   if (index > -1) {
//     this.splice(index, 1);
//   }
// };

// Array.prototype.removeIndex = function (index) {
//   this.splice(index, 1);
// };

// export function arrayRemove(array, data) {
//   if (!isIterator(array)) return;
//   const index = array.indexOf(data);
//   if (index > -1) {
//     array.slice(index, 1);
//   }
// }

export const timedeltaUnits = {
  "秒": 1, "分": 60, "时": 60 * 60,
  "天": 24 * 60 * 60, "周": 7 * 24 * 60 * 60
};


export function getTimedeltaUnit(timedelta) {
  if (typeof (timedelta) !== 'number') return null;
  if (timedelta >= timedeltaUnits[Object.keys(timedeltaUnits)[Object.keys(timedeltaUnits).length - 1]])
    return Object.keys(timedeltaUnits)[Object.keys(timedeltaUnits).length - 1];
  for (let i = 1; i < Object.keys(timedeltaUnits).length; i++) {
    if (timedelta < timedeltaUnits[Object.keys(timedeltaUnits)[i]]) {
      return Object.keys(timedeltaUnits)[i - 1];
    }
  }
  return Object.keys(timedeltaUnits)[0];
}

export function getTimedeltaString(timedelta) {
  if (typeof (timedelta) !== 'number') return "";
  const unit = getTimedeltaUnit(timedelta);
  if (unit === null) return "";
  // console.log("unit", unit);
  return `${(timedelta / timedeltaUnits[unit]).toFixed(2)}${unit}`;
}

export const weekDayList = ['日', '一', '二', '三', '四', '五', '六'];

export function isChinese(temp) {
  var re = /[^\u4E00-\u9FA5]/;
  if (re.test(temp)) return false;
  return true;
}

export function getMailHost(emailAddress) {
  if (typeof (emailAddress) !== "string") return '';
  let mailHost = emailAddress.slice(emailAddress.search('@') + 1, emailAddress.length);
  if (mailHost.match(/[.]/g).length >= 2) {
    return mailHost.slice(mailHost.lastIndexOf('.', mailHost.length - 5) + 1);
  } else {
    return mailHost;
  }
}


const codeName = "voj_code_storage";
const codeIndex = "voj_code_index";
export function saveCode(problemId, code, time_) {
  const time = time_ || new Date().getTime();
  localStorage.setItem(`${codeName}_${problemId}_${time}`, code);
  let codeIndexLast = JSON.parse(localStorage.getItem(`${codeIndex}_${problemId}`) || '[]');
  codeIndexLast.push(time);
  localStorage.setItem(`${codeIndex}_${problemId}`, JSON.stringify(codeIndexLast));
}

export function loadCodeIndex(problemId) {
  // console.log('loadCodeIndex', JSON.parse(localStorage.getItem(`${codeIndex}_${problemId}`) || '[]'));
  return JSON.parse(localStorage.getItem(`${codeIndex}_${problemId}`) || '[]');
}

export function loadCode(problemId, time) {
  if (!time) {
    time = loadCodeIndex(problemId).slice(-1);
    if (time.length === 0) return null;
    time = time[0];
  }
  return localStorage.getItem(`${codeName}_${problemId}_${time}`);
}

export function delCode(problemId, time) {
  // saveCode(problemId, undefined, time);
  localStorage.removeItem(`${codeName}_${problemId}_${time}`);
  let codeIndexLast = JSON.parse(localStorage.getItem(`${codeIndex}_${problemId}`) || '[]');
  // if (codeIndexLast.indexOf(time) >= 0)
  //   delete codeIndexLast[codeIndexLast.indexOf(time)];
  codeIndexLast = codeIndexLast.filter(t => t != time);
  localStorage.setItem(`${codeIndex}_${problemId}`, JSON.stringify(codeIndexLast));
}