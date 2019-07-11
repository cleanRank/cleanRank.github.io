import { post, json } from 'lib/httpPlugin'
// const domain = process.env.VUE_APP_BASE_URL
const domain = 'http://106.14.58.213:28205'
const domain1 = 'http://106.14.58.213:28202'
// let baseUrl = (`${domain}/`)
// let api = 'supplier/pubUser/'
// 采购订单接口
export default {
  updatePwd (params) { // 修改密码--提交修改密码
    return json(`${domain}/user/updatePwd`, params)
  }
}
