var methods = require('./httpPlugin.js')
import {
  getApi,
  postApi,
  postApiString,
  putApi,
  deleteApi,
  getApi1,
  postApi1
} from './httpPlugin.js'
// 接口地址列表  
// const baseUrl = 'https://gateway.sxkemao.com' //线上环境
// const baseUrl = 'http://gateway.cef0e73c879624990a12fcf7c3cd3ea9d.cn-shanghai.alicontainer.com' //预发布环境
const baseUrl = 'http://gateway.test.cef0e73c879624990a12fcf7c3cd3ea9d.cn-shanghai.alicontainer.com' //测试环境网关ip
// const baseUrl2 = (`http://47.100.12.249:8088`)
module.exports = {
  getGoodsInfo(params = {}) {
    return getApi(`${baseUrl}/customer/item/getGoodsInfo`, params) // 扫码获取商品信息
  },
  getParent(params = {}) {
    return getApi(`${baseUrl}/customer/goods/category/parent`, params) // 根据子商品id获取父级信息
  },
  decryptWxUserInfo(params = {}) {
    return postApi(`${baseUrl}/customer/pubUser/decryptWxUserInfo`, params) // 解密用户信息
  },
  getShopCartList(params = {}) {
    return getApi(`${baseUrl}/customer/shopCartPre/list/${params.shopId}`, params) // 获取临时购物车列表
  },
  getHistoryShopCartList(params = {}) {
    return getApi(`${baseUrl}/customer/shopcart/list/${params.shopId}`, params) // 获取历史购物车列表
  },
  addItemToCart(params = {}) {
    return postApi(`${baseUrl}/customer/shopCartPre/saveOrUpdate/${params.shopId}/${params.skuId}/${params.salesQty}`, {}) // 添加到临时购物车
  },
  addItemToHistoryCart(params = {}) {
    return postApi(`${baseUrl}/customer/shopcart/add/${params.shopId}/${params.skuId}/${params.salesQty}`, {}) // 添加到历史购物车
  },
  getBannerByShopId(params = {}) {
    return getApi(`${baseUrl}/customer/banner/getBannerByShopId`, params) // 根据店铺Id获取店铺banner
  },
  selectActivityBanner(params = {}) {
    return getApi(`${baseUrl}/customer/banner/selectActivityBanner`, params) // 获取活动图片
  },
  selectBannerListByType(params = {}) {
    return getApi(`${baseUrl}/customer/banner/selectBannerListByType`, params) // 获取类型banner 1-爆款商品 2-推荐商品 3-活动banner  4-会员banner  5-首页
  },
  getStoreInfoByCode(params = {}) {
    return getApi(`${baseUrl}/customer/shop/getStoreInfoByCode`, params) // 获取类型banner 1-爆款商品 2-推荐商品 3-活动banner  4-会员banner  5-首页
  },
  getMinimumListByDistance(params = {}) {
    return getApi(`${baseUrl}/customer/shop/getMinimumListByDistance`, params) // 定位搜索附近店铺(最大范围自定义)
  },
  selectCityNameAndCityCode(params = {}) {
    return getApi(`${baseUrl}/customer/shop/selectCityNameAndCityCode`, params) // 用户未定位门店返回用户当前城市
  },
  getCategoryCommodity(params = {}) {
    return postApi(`${baseUrl}/customer/item/c/findPage`, params) // 根据分类菜单获取商品
  },
  getCategoryMenu(params = {}) {
    return getApi(`${baseUrl}/customer/goods/category/menu`, params) //获取分类商品菜单
  },
  getTicketInfo(params = {}) {
    return getApi(`${baseUrl}/acquireTicket`, params)
  },
  //订单接口
  getOrderDetailByOrderId(params = {}) {
    return getApi(`${baseUrl}/customer/order/getOrderDetailByOrderId`, params) // 根据订单编码查询订单详情列表
  },
  cancelOrder(params = {}) {
    return postApi(`${baseUrl}/customer/order/cancelOrder`, params) // 取消订单
  },
  //会员api
  getPubUserById(params = {}) {
    return getApi(`${baseUrl}/customer/fegin/pubUser/getPubUserById`, params) // 根据ID获取用户信息(会员api)
  },
  getMeminfo(params = {}) {
    return getApi(`${baseUrl}/customer/pubUser/getMeminfo`, params) // 我的会员信息
  },
  acquireTicket(params = {}) {
    return postApi(`${baseUrl}/customer/market/ticket/user/acquireTicket`, params) // 用户领用指定券组的电子券
  },
  pageMyTicket(params = {}) {
    return postApi(`${baseUrl}/customer/market/ticket/user/getCustomerCenterAcquireable`, params) // 查询会员电子券列表
  },
  //商品搜索接口
  deleteHistory(params = {}) {
    return getApi(`${baseUrl}/customer/search/clean/words`, params) // 根据搜索词汇的数据ID,删除历史搜索记录
  },
  getShopCity(params = {}) {
    return getApi(`${baseUrl}/customer/search/getShopCity`, params) // 查询所有门店城市
  },
  goodsList(params = {}) {
    return getApi(`${baseUrl}/customer/search/shop/list`, params) // 根据关键字搜索店铺商品列表(10条) keyword:要搜索的词汇, shopId:店铺ID
  },
  historyGoodsList(params = {}) {
    return getApi1(`${baseUrl}/customer/search/words`, params) // 商品历史搜索记录
  },
  deleteShopCarGoods(params = {}) {
    return deleteApi(`${baseUrl}/customer/shopcart/cleanCart/${params.shopId}/${params.cflag}`, params) // 清空购物车
  },
  deleteMulShopCarGoods(params = {}) {
    return postApi(`${baseUrl}/customer/shopcart/clean`, params) // 清空或删除多个购物车中的商品
  },
  pageDetail(params = {}) {
    return postApi(`${baseUrl}/customer/order/pageDetail`, params) // 分页查询订单列表
  },
  modifyShopCarGoods(params = {}) {
    return putApi(`${baseUrl}/customer/shopcart/modify/${params.shopcartId}/${params.salesQty}`, params) // 修改购物车中的商品
  },
  getMyTicketInfo(params = {}) {
    return postApi(`${baseUrl}/customer/pubUser/pageMyTicket`, params) // 我的优惠券
  },
  getTicketInfo(params) {
    return postApiString(`${baseUrl}/customer/market/ticket/user/getTicketCenterAcquireableAction`, params) //领券中心
  },
  getCurrentTicket(params = {}) {
    return postApi(`${baseUrl}/customer/market/ticket/user/acquireTicket`, params) //领券中心中领用指定优惠券
  },
  payByEndbonus(params = {}) {
    return postApi(`${baseUrl}/customer/customerPay/payByEndbonus`, params) //余额支付
  },
  startup(params = {}) {
    return postApi(`${baseUrl}/customer/customerPay/startup`, params) //微信支付
  },
  getWalletBalanceInfo(params = {}) {
    return getApi(`${baseUrl}/customer/bonus/recharge/info`, params) //钱包余额
  },
  WalletBalanceList(params = {}) {
    return postApi(`${baseUrl}/customer/customerBonus/pageBonusDetail`, params) //余额明细
  },
  getUseTicket(params = {}) {
    return postApi(`${baseUrl}/customer/order/getUseTicket`, params) //获取可用优惠券
  },
  queryHot(params = {}) {
    return postApi(`${baseUrl}/customer/hotGoods/queryHot`, params) //热销商品查询
  },
  wxLogin(params = {}) {
    return postApi1(`${baseUrl}/customer/user/login`, params) //热销商品查询
  },
  updateWxUserInfo(params = {}) {
    return postApi(`${baseUrl}/customer/pubUser/updateWxUserInfo`, params) //更新用户信息
  },
  createOrder(params = {}) {
    return postApi(`${baseUrl}/customer/order/createOrder`, params) //创建订单
  },
  tmpPreToShopCart(params = {}) {
    return postApi(`${baseUrl}/customer/shopCartPre/tmpPreToShopCart`, params) //同步到历史购物车
  },
  takeActivity(params = {}) {
    return postApi(`${baseUrl}/customer/activity/takeActivity`, params) //获取可用活动优惠
  },
  addUserInvoice(params = {}) {
    return postApi(`${baseUrl}/customer/finance/userInvoice/addUserInvoice`, params) //添加用户常用发票信息
  },
  getCardLstList(params = {}) {
    return getApi(`${baseUrl}/customer/finance/userInvoice/getCardLstList/${params.invoiceId}`, params) //发票抬头详情
  },
  getUserInvoiceList(params = {}) {
    return postApi(`${baseUrl}/customer/finance/userInvoice/getUserInvoiceList`, params) //获取用户常用发票信息列表
  },
  updateUserInvoice(params = {}) {
    return postApi(`${baseUrl}/customer/finance/userInvoice/updateUserInvoice`, params) //修改发票抬头
  },
  getOrderInfoByBillFlag(params = {}) {
    return postApi(`${baseUrl}/customer/order/getOrderInfoByBillFlag`, params) //根据开票标志获取会员订单
  },
  getInvoice(params = {}) {
    return postApi(`${baseUrl}/customer/print/invoice/getInvoice`, params) //查看发票
  },
  printInvoice(params = {}) {
    return postApi(`${baseUrl}/customer/print/invoice/printInvoice`, params) //开票(崭新)
  },
  printInvoiceByInvoiceId(params = {}) {
    return postApi(`${baseUrl}/customer/print/invoice/printInvoiceByInvoiceId`, params) //开票(选择已有抬头)
  },
  sendEmail(params = {}) {
    return postApi(`${baseUrl}/customer/print/invoice/sendEmail`, params) //发送邮件
  },
  recommend(params = {}) {
    return getApi(`${baseUrl}/customer/goods/ecs/item/hot/recommend`, params) //每日尖货推荐 最多显示6条
  },
  createConfirmOrderPage(params = {}) {
    return postApi(`${baseUrl}/customer/customerOrder/createConfirmOrderPage`, params) //创建临时订单
  },
  submitOrder(params = {}) {
    return postApi(`${baseUrl}/customer/customerOrder/submitOrder`, params) //提交订单
  }
}