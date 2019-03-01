import {
  storageItem,
  phone,
  openId,
  userId,
  token,
  shopId,
  shopName
} from 'config/const'
function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}
export const getWxShopId = () => { // 同步获取店铺id
  return wx.getStorageSync(`${shopId}`)
}
export const setWxShopId = (id) => { // 设置店铺id
  wx.setStorageSync(`${shopId}`, id)
}
export const getWxShopName = () => { // 同步获取店铺name
  return wx.getStorageSync(`${shopName}`)
}
export const setWxShopName = (name) => { // 设置店铺name
  wx.setStorageSync(`${shopName}`, name)
}
export const getWxPhone = () => { // 同步获取手机号码
  return wx.getStorageSync(`${phone}`)
}
export const setWxPhone = (num) => { // 设置缓存手机号码
  wx.setStorageSync(`${phone}`, num)
}
export const getWxToken = () => { // 同步获取token
  return wx.getStorageSync(`${token}`)
}
export const setWxToken = (val) => { // 设置token
  wx.setStorageSync(`${token}`, val)
}
export const getWxUserId = () => { // 同步获取缓存数据userId
  return wx.getStorageSync(`${userId}`)
}
export const setWxUserId = (id) => { // 设置缓存UserId
  wx.setStorageSync(`${userId}`, id)
}
export const getWxStorage = () => { // 同步获取缓存数据name:缓存name storeId店铺id
  return wx.getStorageSync(`${storageItem}`)
}
export const setWxStorage = (info) => { // 设置缓存数据
  wx.setStorageSync(`${storageItem}`, info)
}
export const getOpenId = () => { // 同步获取缓存数据name:缓存name storeId店铺id
  return wx.getStorageSync(`${openId}`)
}
export const setOpenId = (id) => { // 设置缓存手机号码
  wx.setStorageSync(`${openId}`, id)
}
export const creatOrder = (res) => { // 处理商品字段返回object
  let p = []
  res.forEach((v, i) => {
    p[i] = Object.assign({}, {
      saleQty: v.cnt,
      skuId: v.skuId
    })
  })
  return p
}
export const showToast = msg => {
  wx.showToast({
    title: msg,
    icon: 'none',
    duration: 2000
  })
}
export const formatTimeAmt = (fmt, msg) => {
  Date.prototype.format = function(fmt) {
    var o = {
      'M+': this.getMonth() + 1,
			'd+': this.getDate(),
			'h+': this.getHours(),
			'H+': this.getHours(),
			'm+': this.getMinutes(),
			's+': this.getSeconds(),
			'q+': Math.floor((this.getMonth() + 3) / 3),
			'S': this.getMilliseconds()
		}
		var week = {
			'0': '\u65e5',
			'1': '\u4e00',
			'2': '\u4e8c',
			'3': '\u4e09',
			'4': '\u56db',
			'5': '\u4e94',
			'6': '\u516d'
		}
		if (/(y+)/.test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
		}
		if (/(E+)/.test(fmt)) {
			fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '\u661f\u671f': '\u5468') : '') + week[this.getDay() + ''])
		}
		for (var k in o) {
			if (new RegExp('(' + k + ')').test(fmt)) {
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
			}
		}
		return fmt
	}
	return new Date(fmt).format(msg)
}
export const isAndroid = () => {
  wx.getSystemInfo({
    success (data) {
      if (data.system.indexOf('Android') > -1) {
        return true
      } else if (data.system.indexOf('iOS') > -1) {
        return false
      }
    }
  })
}
export const countDown = t => {
  // let time = Math.round(t / 1000)
  let second = t % 60
  if (second < 10) {
    second = `0${second}`
  }
  let minute = Math.floor(t / 60)
  if (minute < 10) {
    minute = `0${minute}`
  }
  return `${minute}:${second}`
}
export default {
  formatNumber,
  formatTime
}
