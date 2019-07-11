/**
 * Created by zy on 2017/7/31.
 */
import { UPDATEAFTERSALESINFO } from 'store/mutation-types'
import _ from 'lodash'
// 商品信息
const state = {
  refundAmount: "",
  returnReason: '',
  returnExplain: '',
  changeReason: '',
  changeExplain: '',
  picArray: [],
  picArray2: []
}
const mutations = {
  [UPDATEAFTERSALESINFO] (state, obj) {
    _.merge(state, obj)
  }
}
export default {
  state,
  mutations
}

