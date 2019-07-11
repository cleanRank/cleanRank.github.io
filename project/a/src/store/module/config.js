import { UPDATECOLLAPSE, UPDATEISLOADING, UPDATEISTIMEING } from 'store/mutation-types'
import { UPDATECLIENTWIDTH } from "../mutation-types"
let isCollapse = document.documentElement.clientWidth < 1000
let isTimeLoading = new Date().getTime()
const state = {
  isCollapse: isCollapse,
  isLoading: false,
  isTimeLoading,
  clientWidth: 0
}

const mutations = {
  [UPDATECOLLAPSE] (state, params) {
    state.isCollapse = params
  },
  [UPDATEISLOADING] (state, params) {
    state.isLoading = params
  },
  [UPDATEISTIMEING] (state, params) {
    state.isTimeLoading = params
  },
  [UPDATECLIENTWIDTH] (state, payload) {
    state.clientWidth = payload
  }
}
export default {
  state,
  mutations
}
