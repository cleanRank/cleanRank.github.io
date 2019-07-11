import { UPDATEGOODSINFO, ADD_GOODSINFO } from 'store/mutation-types'
import _ from 'lodash'
// 商品信息
const state = {
  achieve: "order",
  authority: "ID",
  notEmpty: '',
  phone: '',
  productName: '',
  attribution: '',
  redBagId: '',
  redBagValue: 0,
  invoiceContent: '',
  invoiceTitle: '',
  invoiceType: 0,
  invoiceUnit: '', // 公司名称
  rate: '',
  // 用户选择的商品
  userChooseGoods: [],
  discountAmount: 0, // 优惠金额
  totalAmount: 0 // 应付金额
}
const mutations = {
  [UPDATEGOODSINFO] (state, obj) {
    _.merge(state, obj)
  },
  // 新增商品购物车商品
  [ADD_GOODSINFO] (state, goodsArr) {
    state.userChooseGoods = goodsArr
  }
}
export default {
  state,
  mutations
}
