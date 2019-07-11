import {
  json
} from 'lib/httpPlugin'
// const domain = process.env.VUE_APP_BASE_URL
const domain = 'http://106.14.58.213:28202'
// import Qs from 'qs'

export default {
  // 分页获取提现记录
  findChildWithdrawLogPage (params) {
    return json(`${domain}/pay/chatWithdraw/findChatWithdrawLogPage`, params)
  },
  // 支付宝绑定账号
  bindingAlipay (params) {
    return json(`${domain}/pay/chatWallet/bindingAlipay`, params)
  },
  // 申请提现
  applyWithdraw (params) {
    return json(`${domain}/pay/chatWithdraw/applyWithdraw`, params)
  },
  // 分页查询钱包流水
  findChatWalletLogPage (params) {
    return json(`${domain}/pay/chatWallet/findChatWalletLogPage`, params)
  },
  // 获取用户钱包信息
  findUserWallet (params = {}) {
    return json(`${domain}/pay/chatWallet/findUserWallet`, params)
  }
}
