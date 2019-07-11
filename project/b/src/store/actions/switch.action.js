import $post from 'lib/http'
import api from 'module/api'
import userInfo from 'module/userInfo'
// 更新总开关信息
export const updateSwitchInfo = ({ commit }, ...args) => {
  commit('UPDATESWITCHINFO', ...args)
}
// 获取总开关
export const switchControl = ({ commit }) => {
  return $post({
    url: api.state.FinanceSwitch,
    data: {
      uid: userInfo.state.uid ? userInfo.state.uid: '',
      token: userInfo.state.token ? userInfo.state.token: ''
    }
  }).then(data => {
    let res = data.data
    if (res.status == '1') {
      commit('UPDATESWITCHINFO', {...res})
    }
  })
}
