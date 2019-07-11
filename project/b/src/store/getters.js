// vuex getter 模块
export const getApi = (state) => state.api                                     // 获取接口地址
export const getUserInfo = (state) => state.userInfo                  // 获取用户基本信息
export const getSwitchInfo = (state) => state.switchInfo                  // 获取总开关
export const getDialogInfo = (state) => state.dialog                  // 获取弹框信息
export const getGoodsInfo = (state) => state.goodsInfo                  // 获取商品详情
export const getAddressInfo = (state) => state.addressInfo                  // 获取地址详情
export const getConfigInfo = (state) => state.config                  // 获取配置文件
export const getAfterSalesInfo = (state) => state.afterSalesInfo                  // 获取售后信息
export const getCutIndexInfo = (state) => state.cutIndexInfo                // 获取首页切换列表信息
export const getNetworkInfo = (state) => state.networkInfo                // 获取网络

