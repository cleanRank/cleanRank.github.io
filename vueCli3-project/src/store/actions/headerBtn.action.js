// 更新按钮信息
/**
*  ({BtnText: 右上角信息, callBack: 隐藏的时候回调函数})
* @param {Object} args
*/
import store from 'store/'
export const updateheaderBtn = ({ commit }, ...args) => {
  let defaults = {
    BtnText: '', // 右上角内容
    cancelBack () {
      store.commit('UPDATEHEADERBTN', defaults)
    }
  }
  commit('UPDATEHEADERBTN', Object.assign({}, defaults, args[0]))
}
