import $post from 'lib/http'
import api from 'module/api'
import userInfo from 'module/userInfo'
// 查询购物车列表
export const queryShopCart = (store) => {
  return $post({
    url: api.state.QueryShoppingCart,
    data: {
      uid: userInfo.state.uid,
      token: userInfo.state.token
    }
  })
}
// 添加购物车
export const addInToShopCart = (store, {productNo, activityNo, starNo, quantity}) => {
  return $post({
    url: api.state.addShoppingCart,
    data: {
      uid: userInfo.state.uid,
      token: userInfo.state.token,
      productNo,
      activityNo,
      starNo,
      quantity
    }
  })
}
