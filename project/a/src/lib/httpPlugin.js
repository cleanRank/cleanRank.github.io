import axios from 'axios'
import store from 'store/'
import Qs from 'qs'
import { Message } from 'element-ui'
import { tracker } from 'lib/analytics'
import { getQueryString, jointLand ,delSessionStorage } from 'lib/until'
let load
axios.defaults.timeout = 30000
axios.interceptors.request.use(
  config => {
    const token = getQueryString('token') || window.sessionStorage.getItem('token') || tracker.getToken() || ""
    let time = new Date().getTime()
    if (!store.state.config.isLoading && ((time - store.state.config.isTimeLoading > 1000) || !load)) {
      load = true
      store.commit('UPDATEISTIMEING', time)
      // 请求城市不显示loading
      config.url.indexOf('/supplier/b/region') === -1 && store.commit('UPDATEISLOADING', true)
    }
    config.headers.common['token'] = token
    config.headers.common['platform'] = 2
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
axios.interceptors.response.use(
  response => {
    store.commit('UPDATEISLOADING', false)
    let { appMesg, appCode } = response.data
    if (appMesg.indexOf("用户登录过期")!==-1 || appMesg.indexOf('token不能为空')!==-1 || appMesg.indexOf('未登录')!==-1) {
      // window.location.hash = '/login'
      return response
    }
    if (appCode === 'S0001') {
      delSessionStorage()
      localStorage.clear()
      // window.location.hash = '/login'
      return response
    }
    if (appCode !== 'S0000') {
      Message.error(appMesg)
      return response
    }
    return response
  },
  error => {
    store.commit('UPDATEISLOADING', false)
    if (error.message.includes('timeout')) {
      // return Promise.reject(error)
    }
    return Promise.reject(error)
  }
)
export const post = (url, params) => {
  return new Promise((resolve, reject) => {
    axios.post(url, Qs.stringify(params))
      .then(data => {
        let result = data.data
        if (result.appCode == 'S0000') {
          resolve(result)
        } else {
          reject(result)

        }
      }).catch(data => {
      reject(data)
    })
  })
}
export const postFile = (url, params) => {
  return new Promise((resolve, reject) => {
    axios.post(url, params, {
      headers: {'Content-Type': 'multipart/form-data'}
    }).then(data => {
      let result = data.data
      if (result.appCode == 'S0000') {
        resolve(result)
      } else {
      }
    }).catch(data => {
      reject(data)
    })
  })
}
export const get = (url, params, loading = true) => {
  url += '?time=' + Math.random()
  return new Promise((resolve, reject) => {
    axios.get(url, {params: params, timeout: 20000})
      .then(data => {
        let result = data.data
        if (result.appCode == 'S0000') {
          resolve(result)
        } else {
          reject(result)
        }
      }).catch(data => {
      reject(data)
    })
  })
}
export const del = (url, params) => {
  return new Promise((resolve, reject) => {
    axios.delete(url, {params: params})
      .then(data => {
        let result = data.data
        if (result.appCode == 'S0000') {
          resolve(result)
        } else {
          reject(data)
        }
      }).catch(data => {
      reject(data)
    })
  })
}
export const json = (url, params,loading=true) => {
  return new Promise((resolve, reject) => {
    axios.post(url, params).then(data => {
      let result = data.data
      if (result.appCode == 'S0000') {
        resolve(result)
      } else {
        reject(data)
      }
    }).catch(data => {
      reject(data)
    })
  })
}
