import {
  post,
  json,
  get
} from 'lib/httpPlugin'
// const domain = process.env.VUE_APP_BASE_URL
const domain = 'http://106.14.58.213:28205'
// console.log(process.env)
// let api = 'supplier/pubUser/'
export default {
  login(params) { // 登录--账号密码登录
    return json(`${domain}/user/login`, params)
  }
}
