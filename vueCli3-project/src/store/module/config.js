import { is_iphone, userFromChannel } from 'lib/until'
// 基本配置文件
// fromChannel 代表用户的来源
const fromChannel = userFromChannel()
// 把用户来源缓存到session里面
window.sessionStorage.setItem('fromChannel', fromChannel)
const state = {
  APIPORT: process.env.APIPORT,
  Plat: is_iphone()? 'IOS': 'android',
  ver: '1.0.0',
  fromChannel
}

const mutations = {
}
export default {
  state,
  mutations
}
