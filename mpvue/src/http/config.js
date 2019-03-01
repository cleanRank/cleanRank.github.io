import config from '@/config'
import { getWxToken } from '@/utils/index'
var Fly = require('flyio/dist/npm/wx')
var fly = new Fly()

// 设置超时
fly.config.timeout = 20000
// 设置请求基地址
fly.config.baseURL = config.host
// 添加请求拦截器
fly.interceptors.request.use((request) => {
  // 给所有请求添加自定义header
  request.headers['token'] = getWxToken()
  request.headers['version'] = '1.0.0'
  request.headers['module'] = 'customer'
  // 打印出请求体
  // 终止请求
  // var err=new Error("xxx")
  // err.request=request
  // return Promise.reject(new Error(""))

  // 可以显式返回request, 也可以不返回，没有返回值时拦截器中默认返回request
  return request
})

// 添加响应拦截器，响应拦截器会在then/catch处理之前执行
fly.interceptors.response.use(
  (response) => {
    return response.data
  }, (err) => {
    return err
  }
)

export default fly
