const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const getQueryString = str => {
  var theRequest = new Object();
  var strs = str.split("&");
  for (var i = 0; i < strs.length; i++) {
    theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
  }
  return theRequest
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const parseParams = data => {
  try {
    var tempArr = [];
    for (var i in data) {
      var key = encodeURIComponent(i);
      var value = encodeURIComponent(data[i]);
      tempArr.push(key + '=' + value);
    }
    var urlParamsStr = tempArr.join('&');
    return urlParamsStr;
  } catch (err) {
    return '';
  }
}
const imFormatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  const day1 = new Date(year + '/' + month + '/' + day)
  const today = new Date()
  const tyear = today.getFullYear()
  const tmonth = today.getMonth() + 1
  const tday = today.getDate()
  const thour = today.getHours()
  const tminute = today.getMinutes()
  const tsecond = today.getSeconds()
  const day2= new Date(tyear + '/' + tmonth + '/' + tday)
  if (parseInt(day2 - day1) / 1000 / 60 / 60 / 24 == 0){
    return [hour, minute].map(formatNumber).join(':')
  } else if (parseInt(day2 - day1) / 1000 / 60 / 60 / 24 == 1) {
    return '昨天' + ' ' + [hour, minute].map(formatNumber).join(':')
  } else {
    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute].map(formatNumber).join(':')
  }
}
module.exports = {
  formatTime: formatTime,
  getQueryString: getQueryString,
  parseParams: parseParams,
  imFormatTime:imFormatTime
}
