import { UPDATEHEADERBTN } from 'store/mutation-types'
const state = {
  btnClick: {
    BtnText: '', // 右上角内容
    btnClick () {
    } // 点击回调函数
  }
}
const mutations = {
  [UPDATEHEADERBTN] (state, obj) {
    state.btnClick = obj // 更新弹框信息
  }
}
export default {
  state,
  mutations
}
