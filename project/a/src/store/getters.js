// vuex getter 模块
export const getApi = (state) => state.api // 获取接口地址
export const getUserInfo = (state) => state.userInfo // 获取用户基本信息
export const getConfigInfo = (state) => state.config.isCollapse // 获取配置文件
export const getheaderBtn = (state) => state.headerBtn // 获取右上角配置文件
export const getDialogInfo = (state) => state.dialog // 获取弹框信息
