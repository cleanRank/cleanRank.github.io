// 用户信息state
import { UPDATENETWORK } from 'store/mutation-types'
import _ from "lodash"
const state = {
  type: 1,
  bWiFi: false
}
const mutations = {
  [UPDATENETWORK] (state, networkInfo) {
    _.merge(state, networkInfo)
  }
}
export default {
  state,
  mutations
}
