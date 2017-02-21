/**
 * Created by mcake on 2017/2/13.
 */

/**
 * 判断年份是否为润年
 *
 * @param {Number} year
 */
function isLeapYear(year) {
  return (year % 400 == 0) || (year % 4 == 0 && year % 100 != 0);
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
  //哪一天是哪一年中的第多少天
  var days = getDayNumber(dateObject);

  //哪一年第一天是星期几
  var yearFirstDay = new Date(year, 0, 1).getDay() || 7;

  var week = null;
  if (yearFirstDay == 1) {
    week = Math.ceil(days / 7);
  } else {
    days -= (7 - yearFirstDay + 1);
    week = Math.ceil(days / 7);
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