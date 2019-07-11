// 总开关信息
import { UPDATESWITCHINFO } from 'store/mutation-types'
import _ from "lodash"
const mutations = {
  [UPDATESWITCHINFO] (state, switchInfo) {
    _.merge(state, switchInfo)
  }
}
const state = {
  status: 0
}
export default {
  state,
  mutations
}
