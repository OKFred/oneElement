Date.prototype.Delta = function () {
  /* 计算日期差 */
  const time = this.valueOf();
  const now = new Date().valueOf();
  const delta = now - time == 0 ? 0 : (now - time) / 86400000;
  let result;
  if (delta > 0) {
    if (delta > 365.2426) {
      result = Math.floor(delta / 365.2426) + '年前';
    } else if (delta > 30.4167) {
      result = Math.floor(delta / 30.4167) + '个月前';
    } else if (delta > 1) {
      result = Math.floor(delta) + '天前';
    } else if (delta * 24 > 1) {
      result = Math.floor(delta * 24) + '小时前';
    } else if (delta * 24 * 60 > 1) {
      result = Math.floor(delta * 24 * 60) + '分钟前';
    } else {
      result = Math.floor(delta * 24 * 60 * 60) + '秒钟前';
    }
  } else if (delta == 0) {
    result = '刚刚';
  } else {
    if (delta < -365.2426) {
      result = Math.floor(Math.abs(delta / 365.2426)) + '年后';
    } else if (delta < -30.4167) {
      result = Math.floor(Math.abs(delta / 30.4167)) + '个月后';
    } else if (delta < -1) {
      result = Math.floor(Math.abs(delta)) + '天后';
    } else if (delta * 24 < -1) {
      result = Math.floor(Math.abs(delta * 24)) + '小时后';
    } else if (delta * 24 * 60 < -1) {
      result = Math.floor(Math.abs(delta * 24 * 60)) + '分钟后';
    } else {
      result = Math.floor(Math.abs(delta * 24 * 60 * 60)) + '秒钟后';
    }
  }
  return result;
};

Date.prototype.Format = function (fmt) {
  /* 日期格式化模块 */
  const o = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
  };
  if (/(y+)/i.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, this.getFullYear() + '');
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, ('00' + o[k]).substr(('' + o[k]).length));
    }
  }
  return fmt;
};

Date.prototype.zonedDateTime = function () {
  // 日期带时区；比如：2021-10-13T14:39:43.612+08:00
  const timeDifferenceMilSec = -(this.getTimezoneOffset() * 60 * 1000);
  const sign = timeDifferenceMilSec >= 0 ? '+' : '-';
  let hour = Math.abs(Math.floor(timeDifferenceMilSec / 3600 / 1000));
  let min = Math.abs(this.getTimezoneOffset()) - hour * 60;
  if (/^\d{1}$/.test(hour)) hour = '0' + hour;
  if (/^\d{1}$/.test(min)) min = '0' + min;
  return new Date(this.valueOf() + timeDifferenceMilSec).toJSON().replace('Z', sign + hour + ':' + min);
};

Date.prototype.isPDT = function () {
  /* 太平洋时间PT 夏令时地区简易判断  凯撒数据有偏移 */
  const thisMonth = this.getMonth() + 1;
  const today = this.valueOf();
  const thisWeekday = this.getDay();
  const lastSunday = thisWeekday === 0 ? today : today - thisWeekday * 86400000;
  const aWeekBeforeLastSunday = lastSunday - 7 * 86400000;
  const monthOfLastSunday = new Date(lastSunday).getMonth() + 1;
  const monthOfaWeekBeforeLastSunday = new Date(aWeekBeforeLastSunday).getMonth() + 1;
  if (thisMonth > 3 && thisMonth < 11) {
    return true;
  } else if (thisMonth == 3) {
    // 3
    if (monthOfLastSunday === monthOfaWeekBeforeLastSunday) {
      return true;
    } else {
      return false;
    }
  } else if (thisMonth == 11) {
    // 11
    if (monthOfLastSunday === 11) {
      return false;
    } else {
      return true;
    }
  } else {
    // 12-2
    return false;
  }
};

export default Date;
