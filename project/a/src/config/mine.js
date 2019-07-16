import { json } from 'lib/httpPlugin'
let domain = process.env.VUE_APP_BASE_URL
if (process.env.NODE_ENV === "development") {
  domain = 'http://106.14.58.213:28205'
}
// const domain = 'http://106.14.58.213:28205'
// let baseUrl = (`${domain}/`)
// let api = 'supplier/pubUser/'
// 采购订单接口
export default {
  updatePwd (params) { // 修改密码--提交修改密码
    return json(`${domain}/user/updatePwd`, params)
  }
}
