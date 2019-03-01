// 用户信息state
import {
  UPDATEUSREINFO,
  UPDATESHOPID,
  UPDATESHOPNAME,
  UPDATEORDERNO,
  UPDATEORDERID,
  COUPONLIST
} from 'store/mutation-types'
const userId = ''
const shopId = ''
const shopName = ''
const orderNo = ''
const orderId = ''
const couponList = {}
const state = {
  userId,
  shopId,
  shopName,
  orderNo,
  orderId,
  couponList
}
const mutations = {
  [UPDATEUSREINFO] (state, userInfo) {
    state.userId = userInfo
  },
  [UPDATESHOPID] (state, id) {
    state.shopId = id
  },
  [UPDATESHOPNAME] (state, name) {
    state.shopName = name
  },
  [UPDATEORDERNO] (state, no) {
    state.orderNo = no
  },
  [UPDATEORDERID] (state, id) {
    state.orderId = id
  },
  [COUPONLIST] (state, list) {
    state.couponList = list
  }
}
export default {
  state,
  mutations
}
