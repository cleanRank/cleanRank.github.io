import { UPDATECUTINDEXINFO } from 'store/mutation-types'
import _ from 'lodash'
// 首页
const state = {
  cacheData: []
}
const mutations = {
  [UPDATECUTINDEXINFO] (state, obj) {
    _.merge(state, obj)
  }
}
export default {
  state,
  mutations
}
