import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import * as getters from './getters'
import userInfo from './module/userInfo' // 用户信息
Vue.use(Vuex)
// 初始化vuex
const store = new Vuex.Store({
  strict: true,
  actions,
  getters,
  modules: {
    userInfo
  }
})
export default store
