import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import * as getters from './getters'
import userInfo from './module/userInfo' // 用户信息
import config from './module/config' // 基础配置文件
import loading from './module/loading' // 附属信息
import headerBtn from './module/headerBtn' // 附属信息
import dialog from './module/dialog' // dialog
Vue.use(Vuex)
// 初始化vuex
const store = new Vuex.Store({
  strict: true,
  actions,
  getters,
  modules: {
    userInfo,
    config,
    loading,
    headerBtn,
    dialog
  }
})
export default store
