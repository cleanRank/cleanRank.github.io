import fly from './config'
import qs from 'qs'
import {
  isAndroid,
  setWxToken,
  setOpenId
} from '@/utils/index'
// import { $Toast } from 'dist/dist/base/index'
// import config from '../config'
// const host = config.host
// const appKey = config.appKey
// const appid = config.appid

// 通用的get请求
function toast (msg) {
  wx.showToast({
    title: msg,
    icon: 'none',
    duration: 2000
  })
}
function clearStorage () {
  wx.login({
    success: (res) => {
      let host = process.env.APIPORT
      let url = `${host}/customer/threeLogin/westoreLogin`
      post(url, {
        wxcode: res.code,
        sourceApplication: 3,
        sourceDevice: isAndroid() ? 1 : 2,
        sourcePlatform: 2
      }).then(res => {
        setWxToken(res.result.token)
        setOpenId(res.result.openid)
      }).catch(res => {})
    },
    fail: () => {}
  })
}
export const get = (url, params = {}) => {
  wx.showLoading({
    title: '加载中'
  })
  return new Promise((resolve, reject) => {
    fly.get(`${url}`, qs.stringify(params)).then(data => {
      if (data.appCode === 'S0000') {
        wx.hideLoading()
        resolve(data)
      } else if (data.appCode === 'S0007') {
        wx.hideLoading()
        toast(data.appMesg)
        resolve(data)
      } else if (data.appCode === 'S0001') {
        wx.hideLoading()
        toast(data.appMesg)
        clearStorage()
      } else {
        wx.hideLoading()
        toast(data.appMesg)
        reject(data)
      }
    }).catch(data => {
      wx.hideLoading()
      toast('请求出错')
      reject(data)
    })
  })
}
export const searchGet = (url, params = {}) => {
  wx.showLoading({
    title: '加载中'
  })
  return new Promise((resolve, reject) => {
    fly.get(`${url}`, qs.stringify(params)).then(data => {
      if (data.appCode === 'S0000') {
        wx.hideLoading()
        resolve(data)
      } else if (data.appCode === 'S0007') {
        wx.hideLoading()
        resolve(data)
      } else if (data.appCode === 'S0001') {
        wx.hideLoading()
        clearStorage()
      } else {
        wx.hideLoading()
        toast(data.appMesg)
        reject(data)
      }
    }).catch(data => {
      wx.hideLoading()
      toast('请求出错')
      reject(data)
    })
  })
}
// 通用的post请求
export const post = (url, params = {}) => {
  wx.showLoading({
    title: '加载中'
  })
  return new Promise((resolve, reject) => {
    fly.post(`${url}`, qs.stringify(params)).then(data => {
      if (data.appCode === 'S0000') {
        wx.hideLoading()
        resolve(data)
      } else if (data.appCode === 'S0001') {
        wx.hideLoading()
        toast(data.appMesg)
        wx.clearStorage()
      } else {
        wx.hideLoading()
        toast(data.appMesg)
        reject(data)
      }
    }).catch(data => {
      wx.hideLoading()
      toast('请求出错')
      reject(data)
    })
  })
}
export const posts = (url, params = {}) => {
  wx.showLoading({
    title: '加载中'
  })
  return new Promise((resolve, reject) => {
    fly.post(`${url}`, params).then(data => {
      if (data.appCode === 'S0000') {
        wx.hideLoading()
        resolve(data)
      } else if (data.appCode === 'S0001') {
        wx.hideLoading()
        toast(data.appMesg)
        clearStorage()
      } else {
        wx.hideLoading()
        toast(data.appMesg)
        reject(data)
      }
    }).catch(data => {
      wx.hideLoading()
      toast('请求出错')
      reject(data)
    })
  })
}
export const put = (url, params = {}) => {
  wx.showLoading({
    title: '加载中'
  })
  return new Promise((resolve, reject) => {
    fly.put(`${url}`, params).then(data => {
      if (data.appCode === 'S0000') {
        wx.hideLoading()
        resolve(data)
      } else if (data.appCode === 'S0001') {
        wx.hideLoading()
        toast(data.appMesg)
        clearStorage()
      } else {
        wx.hideLoading()
        toast(data.appMesg)
        reject(data)
      }
    }).catch(data => {
      wx.hideLoading()
      toast('请求出错')
      reject(data)
    })
  })
}
