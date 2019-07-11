import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import * as getters from './getters'
import globelData from './module/globelData' // 用户信息
import config from 'store/module/config'

Vue.use(Vuex)
// 初始化vuex
const store = new Vuex.Store({
  strict: true,
  actions,
  getters,
  modules: {
    // userInfo,
    globelData,
    config
  }
})
export default store
