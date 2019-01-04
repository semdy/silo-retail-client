/**
 * Created by mcake on 2017/2/13.
 */

/**
 * 判断年份是否为润年
 *
 * @param {Number} year
 */
function isLeapYear(year) {
  return (year % 400 === 0) || (year % 4 === 0 && year % 100 !== 0);
}
/**
 * 获取某一年份的某一月份的天数
 *
 * @param {Number} year
 * @param {Number} month
 */
function getMonthDays(year, month) {
  return [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month] || (isLeapYear(year) ? 29 : 28);
}

/**
 * 获取某年的某天是第几周
 * @param {Date} dateObject
 * @returns {Number}
 */
export const getWeekNumber = (dateObject) => {
  var year = dateObject.getFullYear();
  //某天是一年中的第多少天
  var days = getDayNumber(dateObject);

  //一年中的第一天是星期几
  var yearFirstDay = new Date(year, 0, 1).getDay() || 7;

  var week = null;
  if (yearFirstDay === 1) {
    week = Math.ceil(days / 7);
  } else {
    days -= (7 - yearFirstDay + 1);
    week = Math.abs(Math.ceil(days / 7));
  }

  return week;

};

/**
 * 获取某年的某天是第几天
 * @param {Date} dateObject
 * @returns {Number}
 */
export const getDayNumber = (dateObject) => {
    var year = dateObject.getFullYear(),
    month = dateObject.getMonth(),
    days = dateObject.getDate();

  for (let i = 0; i < month; i++) {
    days += getMonthDays(year, i);
  }

  return days;
};

/**
 * 根据offset计算本地时间与UTC时间差值的时间戳
 * @param {String} offset 时区, 格式如："+08:00"(北京时间的时区)
 * @return {number}
 */

export const getTimezoneStamp = (offset) => {
  if( typeof offset !== 'string' ){
    return 0;
  }
  if( offset.length < 2 ){
    return 0;
  }
  let timeStack = offset.split(":");
  if( timeStack.length !== 2 ){
    return 0;
  }
  let sign = 1;
  let firstChar = offset.charAt(0);
  if( firstChar === "-" ){
    sign = -1;
  }
  let hour = timeStack[0];
  let minute = timeStack[1];
  if( firstChar === "+" || firstChar === "-" ){
    hour = hour.substr(1);
  }

  return (parseInt(hour, 10) * 60 + parseInt(minute, 10)) * 60000 * sign;
};

//计算指定时区偏移量的时间
export const localDate = (timezoneStamp, time) => {
  //得到本地时间
  let d = time ? new Date(time) : new Date();

  //得到1970年一月一日到现在的毫秒数
  let local = d.getTime();

  //本地时间与GMT时间的时间偏移差
  let offset = d.getTimezoneOffset() * 60000;

  //得到现在的格林尼治时间
  let utcTime = local + offset;

  return new Date(utcTime + timezoneStamp);
};