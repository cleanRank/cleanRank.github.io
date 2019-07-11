import { UPDATE_TAB_INDEX } from 'store/mutation-types'
import _ from "lodash"

const state = {
  from: '',
  to: '',
  tabIndex: -1
}

const mutations = {
  [UPDATE_TAB_INDEX] (state, tabInfo) {
    _.merge(state, tabInfo)
  }
}

export default {
  state,
  mutations
}
