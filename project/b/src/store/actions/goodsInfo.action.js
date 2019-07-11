import { UPDATEGOODSINFO, ADD_GOODSINFO } from 'store/mutation-types'// 更新商品信息
export const updateGoodsInfo = ({ commit }, ...args) => {
  commit(UPDATEGOODSINFO, ...args)
}
// 新增商品信息
export const addGoodsInfo = ({ commit }, ...args) => {
  commit(ADD_GOODSINFO, ...args)
}
