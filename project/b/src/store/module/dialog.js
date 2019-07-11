import { UPDATETOAST, UPDATELOADALERT, UPDATE_NIGHTPALACES } from "store/mutation-types"
// loading
const state = {
  toast: {
    msg: '',
    time: 3000
  },
  loadAlert: {
    title: '提示', // alert标题
    msg: '', // alert内容
    lBtnText: "",
    rBtnText: "确定",
    confCallBack () {}, // 点击确定回调函数
    cancleBack () {} // 点击取消回调函数
  },
  // 是否显示9宫格
  nightPalaces: {
    isShow: false,
    arr: []
  }
}
const mutations = {
  // 更新toast信息
  [UPDATETOAST] (state, obj) {
    // if (state.toast.msg != '') {
    //   return false
    // }
    Object.assign(state.toast, obj)
  },
  // 更新9宫格信息
  [UPDATE_NIGHTPALACES] (state) {
    state.nightPalaces['isShow'] = !state.nightPalaces['isShow']
    if (!state.nightPalaces.isShow) {
      document.querySelector('html').style.overflow = 'visible'
      document.querySelector('body').style.overflow = 'visible'
    } else {
      document.querySelector('html').style.overflow = 'hidden'
      document.querySelector('body').style.overflow = 'hidden'
    }
    // Object.assign(state.nightPalaces, nightPalaces)
  },
  // 更新alert弹框信息
  [UPDATELOADALERT] (state, obj) {
    if (!obj.title) { obj.title="提示" }
    obj['rBtnText'] = obj['rBtnText']? obj['rBtnText']: '确定'
    state.loadAlert = obj // 更新弹框信息
  }
}
export default {
  state,
  mutations
}
