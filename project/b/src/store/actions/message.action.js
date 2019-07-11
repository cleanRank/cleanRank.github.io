import $post from 'lib/http'
import api from 'module/api'
import userInfo from 'module/userInfo'
// 查询未读消息数量
export const queryMessageNum = (store) => {
  return $post({
    url: api.state.UserMessageUnRead,
    data: {
      uid: userInfo.state.uid,
      token: userInfo.state.token
    }
  })
}
