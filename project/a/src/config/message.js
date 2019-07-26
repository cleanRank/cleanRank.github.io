import { post, json, get } from 'lib/httpPlugin'
let domain = process.env.VUE_APP_BASE_URL
if (process.env.NODE_ENV === "development") {
  domain = 'http://106.14.58.213:28206'
}
// const domain = 'http://106.14.58.213:28206'
// 采购订单接口
export default {
  findByUserId (params) { // 根据用户id查找环信账号
    return post(`${domain}/message/integration/huanxin/findByUserId`, params)
  },
  registerIm (params) { // 注册环信账号
    return json(`${domain}/message/integration/huanxin/register`, params)
  },
  getChatDialogueList (params) { // 获取列表
    return get(`${domain}/message/getChatDialogueList`, params)
  }
}
