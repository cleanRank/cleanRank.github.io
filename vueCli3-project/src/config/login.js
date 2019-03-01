import { json } from 'lib/httpPlugin'
const domain = process.env.VUE_APP_BASE_URL
console.log(process.env)
let baseUrl = (`${domain}/`)
export default {
  login (params) { // 登录--账号密码登录
    return json(`${baseUrl}/login`, params)
  }
}
