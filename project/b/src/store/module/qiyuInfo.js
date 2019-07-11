import { UPDATE_QIYU_INFO } from 'store/mutation-types'
import {app} from '../../lib/until'
// 地址信息
const state = {
  title: '', // 商品标题
  desc: '', // 商品描述
  pictureUrlString: '', // 商品图片url
  note: '', // 备注信息，可以显示价格，订单号
  urlString: '', // 跳转url
  show: 'YES'
}
const mutations = {
  [UPDATE_QIYU_INFO] (state, obj) {
    // state = obj
    Object.assign(state, obj)
    console.log(state)
    // 客服
    app.QYService(state)
  }
}
export default {
  state,
  mutations
}
