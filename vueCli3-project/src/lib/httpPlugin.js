import Vue from 'vue'
import axios from 'axios'
import router from 'vue-router'
import Qs from 'qs'
import store from 'store/index'
import { tracker } from 'lib/analytics'
import { getQueryString } from 'lib/until'

axios.defaults.timeout = 3000
axios.interceptors.request.use(
  config => {
    const token = getQueryString('token') || window.sessionStorage.getItem('token') || tracker.getToken() || ""
    config.headers.common['token'] = token
    return config;
  },
  error => {
    return Promise.reject(error);
  }
)
const errorHander = (status, other) => {
  let msg = other
  switch (status) {
    case 404:
      msg = '请求资源不存在'
      break;
    // 未登录
    case 'S0001':
      tracker.deleteToken() // 检测未登录删除token的cookie
      // window.location.href =
      // router.push({path: '/login', query: {
      //   redirect: router.currentRoute.fullpath
      // }})
      break;
    default:
  }
  store.commit('UPDATETOAST', {msg: other})
  setTimeout(function () {
    store.commit('UPDATETOAST', {msg: ''}) // 此处需要手动添加一个定时器2s以后隐藏toast
    store.commit('SHOWLOADINGFLAG', false)
  }, 2000)
}
export const post = (url,params) => {
  return new Promise((resolve, reject) => {
		axios.post(url, Qs.stringify(params))
		.then(data => {
			let result = data.data
			if(result.appCode == 'S0000'){
				resolve(result)
			} else {
        errorHander(result.appCode, result.appMesg)
        reject(data)
      }
  	}).catch(data => {
  		errorHander('', '服务器无响应，请稍后再试')
  		reject(data)
  	})
	})
}
export const postFile = (url, params) => {
  return new Promise((resolve, reject) => {
    axios.post(url, params, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then(data => {
        let result = data.data
        if (result.appCode == 'S0000') {
          resolve(result)
        } else {
          errorHander(result.appCode, result.appMesg)
          reject(data)
        }
      }).catch(data => {
        errorHander('', '服务器无响应，请稍后再试')
        reject(data)
      })
  })
}
export const get = (url,params) => {
  return new Promise((resolve, reject) => {
		axios.get(url, {params: params, timeout: 20000})
		.then(data => {
			let result = data.data
			if(result.appCode == 'S0000'){
				resolve(result)
			} else {
        errorHander(result.appCode, result.appMesg)
        reject(data)
      }
  	}).catch(data => {
      errorHander('', '服务器无响应，请稍后再试')
      reject(data)
  	})
	})
}
export const del = (url,params) => {
  return new Promise((resolve, reject) => {
		axios.delete(url, {params: params})
		.then(data => {
			let result = data.data
			if(result.appCode == 'S0000'){
				resolve(result)
			} else {
        errorHander(result.appCode, result.appMesg)
        reject(data)
      }
  	}).catch(data => {
  		errorHander('', '服务器无响应，请稍后再试')
  		reject(data)
  	})
	})
}
export const json = (url,params) => {
  return new Promise((resolve, reject) => {
		axios.post(url, params)
		.then(data => {
			let result = data.data
			if(result.appCode == 'S0000'){
				resolve(result)
			} else {
        errorHander(result.appCode, result.appMesg)
        reject(data)
      }
  	}).catch(data => {
      errorHander('', '服务器无响应，请稍后再试')
  		reject(data)
  	})
	})
}
