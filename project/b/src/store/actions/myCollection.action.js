// 我的收藏 action 列表
import $post from 'lib/http'
import api from 'module/api'
import userInfo from 'module/userInfo'

// 删除我的收藏中的商品
export const delMyCollection = ({ commit }, productNo) => {
  return $post({
    url: api.state.DelMyCollection,
    data: {
      productNo,
      uid: userInfo.state.uid,
      token: userInfo.state.token
    }
  })
}
// 添加收藏
export const addMyCollection = ({ commit }, productNo) => {
  return $post({
    url: api.state.AddMyCollection,
    data: {
      productNo,
      uid: userInfo.state.uid,
      token: userInfo.state.token
    }
  })
}
