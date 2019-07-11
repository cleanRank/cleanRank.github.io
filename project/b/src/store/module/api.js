// 接口地址列表
// import { userFromChannel } from 'lib/until'
// const fc = userFromChannel()
// import config from './config'
const domain = process.env.APIPORT
const domain2 = process.env.APIPORT2
const domain3 = process.env.APIPORT3
const baseUrl = (`${domain}/sxyp/`)
const state = {
  unitedLogin: `${baseUrl}unitedLogin`, // 联合登录
  FinanceSwitch: `${baseUrl}FinanceSwitch`, // 总开关
  Index: `${baseUrl}Index`, // 首页
  LoginH5: `${baseUrl}LoginH5`, // 登录
  SendValidCode: `${baseUrl}SendValidCode`, // 获取短信验证码
  FindPwd: `${baseUrl}FindPwd`, // 忘记密码
  Regist: `${baseUrl}Regist`, // 注册
  QueryNotUseRedBag: `${domain3}/coupon/queryNotUseRedBag`, // 查询可使用红包
  CheckArea: `${domain3}/area/checkAreaCanOrder`, // 查询可使用红包
  VerifyPwd: `${baseUrl}VerifyPwd`, // 校验交易密码
  virtualorderadd: `${baseUrl}virtualorderaddnew`, // 虚拟商品下单
  virtualproductdetailshow2: `${baseUrl}virtualproductdetailshow2`, // 虚拟商品查询
  SetBillDate: `${baseUrl}SetBillDate`, // 设置账单日
  BankCardShowSX: `${baseUrl}BankCardShowSX`, // 查询银行卡信息
  LianLianPay: `${baseUrl}LianLianPay`, // 银行卡付款
  WeiPayBindCardNew: `${baseUrl}WeiPayBindCardNew`, // 绑卡
  querybank: `${baseUrl}querybank`,
  ParameterShow: `${baseUrl}ParameterShow`, // 查询地址标签
  QueryReceiptAddress: `${domain3}/address/queryList`, // 查询收货地址
  updateadddefault: `${domain3}/address/setDefault`, // 更改默认收货地址
  DelReceiptAddress: `${domain3}/address/del`, // 删除地址
  checkIdNumber: `${domain3}/address/checkIdNumber`, // 校验姓名和身份证号
  addreceiptaddress: `${domain3}/address/addOrUpdate`, // 添加地址
  setreceivingaddress: `${domain3}/addressArea/findListBySuperareaId`, // 编辑收货地址
  MyCouponShow: `${domain3}/sxyp/myCouponShow`, // 查询红包
  deleteMyCoupon: `${domain3}/sxyp/deleteMyCoupon`, // 删除优惠券
  querycountorder: `${baseUrl}querycountorder`, // 个人中心
  UserIsVerified: `${baseUrl}UserIsVerified`, // 跨境商品查询用户信息
  QueryOrderList: `${baseUrl}QueryOrderList`, // 订单列表
  QueryOrderDetails: `${domain3}/order/queryDetail`, // 订单详情
  filmflyOrderDetail: `${baseUrl}filmflyOrderDetail`, // 电影票订单详情
  CancelOrder: `${domain3}/order/cancel`, // 取消订单
  OrderTrack: `${baseUrl}OrderTrack`, // 物流信息
  OrderTrack4fans: `${baseUrl}OrderTrack4fans`, // 粉丝订单物流信息
  QueryContract: `${baseUrl}QueryContract`, // 合同信息
  RepaymentPlan: `${baseUrl}RepaymentPlan`, // 还款计划
  activityproductshow: `${baseUrl}activityproductshow`, // 秒杀
  RecommendProduct: `${baseUrl}RecommendProduct`, // 为你推荐【详情页】
  getsubjectapp: `${baseUrl}getsubjectapp`, // 领取红包
  categoryshowtag: `${domain3}/category/showTag`, // 新品类
  productsearch: `${baseUrl}productsearch`, // 输入框内容搜索
  CategoryProduct: `${baseUrl}CategoryProduct`, // 品类搜索
  ActiveTemplateNew: `${baseUrl}ActiveTemplateNew`, // 活动模板
  // 售后服务管理规则
  AddCommonProblem: `${baseUrl}AddCommonProblem`,
  // 售后服务列表
  list: `${domain3}/afterSale/list`,
  // 申请售后
  afterSaleApply: `${domain3}/afterSaleNew/apply`,
  // 售后申请提交
  applySubmit: `${domain3}/afterSaleNew/apply/submit`,
  // 售后进度列表
  progressList: `${domain3}/afterSale/progress/list`,
  // 售后订单详情接口
  progressDetail: `${domain3}/afterSale/progress/detail`,
  // 取消售后
  progressCancel: `${domain3}/afterSale/progress/cancel`,
  // 寄送商品页面
  progressSend: `${domain3}/afterSale/progress/send`,
  // 买家寄送商品提交
  sendSubmit: `${domain3}/afterSale/progress/sendSubmit`,
  // QueryAfterSales: `${baseUrl}QueryAfterSales`,
  // QuerySchedule: `${baseUrl}QuerySchedule`,
  // ReturnGoodsApplyCheck: `${baseUrl}ReturnGoodsApplyCheck`,
  // ReturnedGoodsSubmitApply: `${baseUrl}ReturnedGoodsSubmitApply`,
  // upLoad: `${domain}/oss/uploadbasetext.do`,
  // QueryScheduleDetail: `${baseUrl}QueryScheduleDetail`,
  // CancelApply: `${baseUrl}CancelApply`,
  // SubmitLogistics: `${baseUrl}SubmitLogistics`,
  // ModifyReturns: `${baseUrl}ModifyReturns`,
  // 爱奇艺等会员详情
  productdetailshowspujd: `${baseUrl}productdetailshowspujd`,
  // 热门会员
  HotMemberSkuShow: `${baseUrl}HotMemberSkuShow`,
  // 发现模块
  QueryDiscoveryImgTxt: `${baseUrl}QueryDiscoveryImgTxt`,
  QueryUserComment: `${baseUrl}QueryUserComment`,
  AddUserComment: `${baseUrl}AddUserComment`,
  DelUserComment: `${baseUrl}DelUserComment`,
  AgreeUserComment: `${baseUrl}AgreeUserComment`,
  CancelAgreeUserComment: `${baseUrl}CancelAgreeUserComment`, // 发现详情页
  QueryDiscoveryBanner: `${baseUrl}QueryDiscoveryBanner`, // 发现列表页
  AgreeDiscoveryImgTxt: `${baseUrl}AgreeDiscoveryImgTxt`, // 点赞
  SearchHotWordNew: `${baseUrl}searchhotwordnew`, // 热门搜索
  AutomaticCompletion: `${baseUrl}AutomaticCompletion`, // 自动补全搜索词
  CancelAgreeDiscoveryImgTxt: `${baseUrl}CancelAgreeDiscoveryImgTxt`,
  GetUserIsNew: `${baseUrl}GetUserIsNew`, // 判断是否是新用户
  // 支付成功
  QueryOrderTotal: `${baseUrl}QueryOrderTotal`,
  // 我的收藏列表
  QueryMyCollection: `${baseUrl}queryMyCollection`,
  // 删除收藏商品
  DelMyCollection: `${baseUrl}delMyCollection`,
  // 添加收藏
  AddMyCollection: `${baseUrl}addMyCollection`,
  // 查询购物车列表
  // QueryShoppingCart: `${baseUrl}queryShoppingCart`,
  QueryShoppingCart: `${domain3}/cart/queryCartList`,
  // 移除购物车商品
  DelShoppingCart: `${baseUrl}delShoppingCart`,
  // 添加商品到购物车
  addShoppingCart: `${domain3}/cart/add`,
  // 购物车去结算请求返回几件起售
  saleNumber: `${domain3}/cart/checkMinBuyCnt`,
  // 修改购物车
  editShoppingCart: `${domain3}/cart/editCartQuantity`,
  NewOrderAdd: `${domain3}/order/newOrderAdd`, // 新添加订单接口
  GetInvoice: `${baseUrl}GetInvoice`, // 获取发票信息
  ShowCashier: `${baseUrl}ShowCashier`, // 查询收银台
  CreditLine: `${baseUrl}CreditLine`, // 获取额度详情
  QuotaEnough: `${baseUrl}QuotaEnough`,
  ShowRate: `${baseUrl}ShowRate`,
  GetDownPayment: `${baseUrl}GetDownPayment`,
  // 支付分期详情
  PayInstalment: `${baseUrl}PayInstalment`,
  // 微信授权
  Wxpay: `${baseUrl}Wxpay`,
  WechatSaveUserinfo: `${baseUrl}WechatSaveUserinfo`,
  WechatPayQueryStatus: `${baseUrl}WechatPayQueryStatus`,
  CashLoanApplyInfo: `${baseUrl}CashLoanApplyInfo`,
  // 借款期限
  CashLoanPeriods: `${baseUrl}CashLoanPeriods`,
  // 确认借款查看
  CashLoanApplyCheck: `${baseUrl}CashLoanApplyCheck`,
  ConfirmCashLoan: `${baseUrl}ConfirmCashLoan`,
  CashLoan: `${baseUrl}CashLoan`,
  // MarketingRegist: `${baseUrl}MarketingRegist`,
  // 消息通知 首页未读消息数量、修改推送消息状态、站内信消息列表
  UserMessageUnRead: `${baseUrl}UserMessageUnRead`,
  UpdateUserMessage: `${baseUrl}UpdateUserMessage`,
  UserMessageShow: `${baseUrl}UserMessageShow`,
  // 卡券
  VirtualCardCharge: `${baseUrl}VirtualCardCharge`,
  VirtualCardOrderAdd: `${baseUrl}VirtualCardOrderAdd`,
  VirtualCardRecycle: `${baseUrl}VirtualCardRecycle`,
  helpcenter: `${baseUrl}helpcenter`,  // 帮助中心
  getquestions: `${baseUrl}getquestions`,   // 问题列表
  checkquestion: `${baseUrl}checkquestion`,   // 问题详情
  searchquestion: `${baseUrl}searchquestion`,  // 问题搜索
  subclassify: `${baseUrl}subclassify`, // 二级问题列表
  GetSentence: `${baseUrl}GetSentence`,
  // 意见反馈 意见反馈类型 、意见反馈提交
  AdviceFeedbackType: `${baseUrl}AdviceFeedbackType`,
  feedbackH5: `${domain}/advice/upload/feedbackH5`,
  WindowsAdvertise: `${domain3}/sxypApplet/windowsAdvertiseCategory/getWindowsAdvertise`, // 首页弹窗广告
  VirtualCardDetail: `${baseUrl}VirtualCardDetail`,
  FilmflyEnter: `${baseUrl}FilmflyEnter`, // 电影票
  getBills4repay: `${domain2}/manualRepay/getBills4repay`, // 还款列表
  getBillDetails4repay: `${domain2}/manualRepay/getBillDetails4repay`, // 还款详情
  manualRepayByBF: `${domain2}/manualRepay/manualRepayByBF`, // 立即还款
  queryManualRepayResult: `${domain2}/manualRepay/queryManualRepayResult`, // 查询还款状态
  getUserRePayInfo: `${domain2}/manualRepay/getUserRePayInfo`, // 个人中心还款信息
  userInfo: `${domain}/userInfo`, // 个人头像昵称
  Productdetailshowspujd: `${domain3}/productDetail/appProduct`, // 带店铺信息的商品详情页
  applet: `${domain3}/productDetail/productImgText`, // 商品图文详情页
  selectTwoComment: `${domain3}/productComment/selectTwoComment`, // 查询商品页两条评价
  selectProductComment: `${domain3}/productComment/selectProductComment`, // 查询全部商品评价
  myAttentionStore: `${domain3}/sxypApplet/store/myAttentionStore`, // 我的关注
  starInfo: `${domain3}/sxypApplet/star/starInfo`, // 网红主页信息
  starProducts: `${domain3}/sxypApplet/star/products`, // 网红主页商品推荐
  follow: `${domain3}/sxypApplet/star/follow`, // 店铺网红关注、取消关注
  storeInfo: `${domain3}/sxypApplet/store/storeInfo`, // 店铺主页信息
  storeProducts: `${domain3}/sxypApplet/store/products`, // 网红主页信息
  GetUserInfoByH5: `${baseUrl}GetUserInfoByH5`, // h5微信登录
  BindSxypUser: `${baseUrl}BindSxypUser`, // 绑定用户
  memberNew: `${domain3}/memberNew`, // 店主
  income: `${domain3}/income`, // 预计收入明细
  incomeCondition: `${domain3}/incomeCondition`, // 筛选条件
  query: `${domain3}/withdraw/query`, // 提现
  apply: `${domain3}/withdraw/apply`, // 提现申请
  queryDetail: `${domain3}/withdraw/queryDetail`, // 提现记录
  bindCard: `${domain3}/bank/bindCard`, // 绑卡
  readyBindCard: `${domain3}/bank/readyBindCard`, // 预绑卡接口（点击发送验证码调用）
  sureBindCard: `${domain3}/bank/sureBindCard`, // 确认绑卡
  getSharePics: `${domain3}/share/getSharePics`, // 分享页图片
  GetMiniShareProductInfo: `${baseUrl}GetMiniShareProductInfo`, // 推广图片
  InternalCoupon: `${baseUrl}InternalCoupon`,
  GetSubjectAppInternal: `${baseUrl}GetSubjectAppInternal`,
  productCommentShare: `${domain3}/productComment/productCommentShare`, // 评价分享图片
  querySxtCardList: `${domain3}/sxt/querySxtCardList`, // 查询水象通列表
  querySxtCount: `${domain3}/sxt/querySxtCount`, // 查询水象通数量
  sxtPrePay: `${domain3}/sxtPrePay`, // 水象通预支付接口
  sxtPay: `${domain3}/sxtPay`, // 水象通支付接口
  getAnnounceList: `${domain3}/announcement/getAnnouncementList`, // 获取公告列表
  getAnounceDetail: `${domain3}/announcement/getArticleDetail`, // 公告详情
  getFloorDetail: `${baseUrl}/sxyp/ContentDetail`, // 课程详情
  getShareImg: `${baseUrl}/sxyp/ContentShare`, // 分享图获取
  confirmReceipt: `${domain3}/order/confirmReceipt`, // 确认收货
  MiniHome: `${baseUrl}/sxyp/MiniHome`, // 首页品类
  appShare: `${domain3}/activityPageShare/appShare`, // 活动页面分享
  deleteOrder: `${domain3}/order/deleteOrder`, // 删除订单
  MiniActiveTemplate: `${baseUrl}MiniActiveTemplate`, // 活动楼层
  checkUserDefaultAddress: `${domain3}/productDetailAddress/checkUserDefaultAddress`, // 根据地址编号校验是否支持配送
  checkUserChooseAddress: `${domain3}/productDetailAddress/checkUserChooseAddress`, // 根据联动id判断是否支持配送
  checkUserNowLocation: `${domain3}/productDetailAddress/checkUserNowLocation`, // 根据经纬度判断是否支持配送
  searchProduct: `${domain3}/activity/searchProduct`, // 促销商品列表
  getProductDiscount: `${domain3}/activity/getProductDiscount`, // 商品详情页获取结算金额及优惠金额
  getSettleIncome: `${domain3}/getSettleIncome`, // 预估返利
  getCartPrice: `${domain3}/cart/getCartPrice`, // 购物车计算选中
  findDetail: `${domain3}/discoveryArticle/detail` // 发现详情
}

const mutations = {
}

export default {
  state,
  mutations
}
