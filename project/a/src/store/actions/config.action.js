// 更新窗口collapse
export const updateCollapse = ({ commit }, ...args) => {
  commit('UPDATECOLLAPSE', ...args)
}
// 更新loading
export const updateIsLoading = ({ commit }, ...args) => {
  commit('UPDATEISLOADING', ...args)
}
// 更新loadingtime
export const updateIsTime = ({ commit }, ...args) => {
  commit('UPDATEISTIMEING', ...args)
}
// 更新屏幕宽度
export const updateClientWidth= ({ commit }, payload) => {
  commit('UPDATECLIENTWIDTH', payload)
}
