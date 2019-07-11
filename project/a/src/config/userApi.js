import { json, get } from 'lib/httpPlugin'
// const domain = process.env.VUE_APP_BASE_URL
const domain = 'http://106.14.58.213:28205'
// 采购订单接口
export default {
  getAccountList (params) { // 获取陪聊账户列表
    return get(`${domain}/user/account`, params)
  },
  getLinkPersonList (params) { // 获取联系列表
    return json(`${domain}/user/friend/talk/index`, params)
  },
  getCity (params) { // 获取省市区
    return get(`${domain}/user/region/child`, params)
  }
}
