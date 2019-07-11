export const timeFormat = (fmt, type) => {
  let date = new Date(parseInt(fmt))
  let month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : ("0"+ (parseInt(date.getMonth()) + 1))
  let dates = date.getDate() > 9 ? date.getDate() : ("0"+ (parseInt(date.getDate())))
  let hours = date.getHours() > 9 ? date.getHours() : ("0"+ (parseInt(date.getHours())))
  let minutes = date.getMinutes() > 9 ? date.getMinutes() : ("0"+ (parseInt(date.getMinutes())))
  let seconds = date.getSeconds() > 9 ? date.getSeconds() : ("0"+ (parseInt(date.getSeconds())))
  if (type == 1) {
    return date.getFullYear() + "-" + month + "-" + dates
  } else if (type == 2) {
    return month + "-" + dates
  } else if (type==3) {
    month = date.getMonth() + 1
    return month
  } else if (type==4) {
    return month + "月" + dates +"日"
  } else if (type == 5) {
    return date.getFullYear() + "-" + month + "-" + dates + " " + hours + ":" + minutes + ":" + seconds
  } else if (type == 6) {
    return date.getFullYear() + "." + month + "." + dates
  }
}
// 格式化金额
export const fixed2NoRound = (money) => {
  let newMoney= money.toFixed(2)
  return parseFloat(newMoney)
}
