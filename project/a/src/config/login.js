import {
  post,
  json,
  get
} from 'lib/httpPlugin'
let domain = process.env.VUE_APP_BASE_URL
if(process.env.NODE_ENV === "development") {
  domain = 'http://106.14.58.213:28205'
}
// const domain = 'http://106.14.58.213:28205'
export default {
  login(params) { // 登录--账号密码登录
    return json(`${domain}/user/login`, params)
  }
}
