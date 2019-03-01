// 用户信息state
import { getQueryString } from 'lib/until'
import { UPDATEUSREINFO } from 'store/mutation-types'
import { tracker } from 'lib/analytics'
const userId = getQueryString('token') || window.sessionStorage.getItem('loginToken') || tracker.getToken() ||''
const state = {
  userId
}
const mutations = {
  [UPDATEUSREINFO] (state, userInfo) {
    state.userId = userInfo
  }
}
export default {
  state,
  mutations
}
