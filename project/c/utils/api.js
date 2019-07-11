// 接口地址列表  
// const baseUrl = (`https://apitest.sxfqsc.com`)
// const baseUrl2 = (`https://sxypapitest.sxfqsc.com`)
const baseUrl = (`https://api.sxfqsc.com`)
const baseUrl2 = (`https://sxypapi.sxfqsc.com`)
module.exports = { 
  Index: `${baseUrl}/sxyp/MiniHome`, // 首页
  ActiveTemplateNew: `${baseUrl}/sxyp/MiniActiveTemplate`,
  //合伙人
  AnnounceData: `${baseUrl}/sxyp/PartnerInfo`,
  //公告列表和详情
  getAnnouncementList: `${baseUrl2}/announcement/getAnnouncementList`,
  getArticleDetail: `${baseUrl2}/announcement/getArticleDetail`,
  //获取拉新活动二维码
  getActivityQrcode: `${baseUrl2}/qrcode/generatorAndSave`,
  //获取商品活动二维码
  getIndexActivityQrcode: `${baseUrl2}/activityPageShare/miniprogramShare`,
  //版式列表和详情
  getFloorDetail: `${baseUrl}/sxyp/ContentShare`,
  getFloorList: `${baseUrl}/sxyp/ContentDetail`,
  //商品详情
  ProductDetailShowMini: `${baseUrl2}/productDetail/applet`,
  QueryOrderList: `${baseUrl}/sxyp/QueryOrderList`, 
  FinanceSwitch: `${baseUrl}/sxyp/FinanceSwitch`, 
  QueryOrderDetails: `${baseUrl2}/order/queryDetail`,  
  CancelOrdernew: `${baseUrl2}/order/cancel`,  //取消订单 
  OrderTrack: `${baseUrl}/sxyp/OrderTrack`,  //查看物流 
  OrderTrack4fans: `${baseUrl}/sxyp/OrderTrack4fans`,  //查看粉丝物流 
  CheckAdress: `${baseUrl2}/productDetailAddress/checkUserDefaultAddress`,  //地址是否支持配送
  NewAddressCheck: `${baseUrl2}/productDetailAddress/checkUserChooseAddress`,  //新增地址校验是否支持配送
  CheckUserNowLocation: `${baseUrl2}/productDetailAddress/checkUserNowLocation`,  //经纬度验证配送地址
  SearchProduct:`${baseUrl2}/activity/searchProduct`,                           //促销商品列表
  //附近买家
  FindPeople: `${baseUrl2}/im/findPeopleAroundMe`,
  AddFriend: `${baseUrl2}/im/addFriend`,
  ApplyFriends: `${baseUrl2}/im/getApplyFriends`,
  AuditApplyFriend: `${baseUrl2}/im/auditApplyFriendRequest`,
  //购物车
  QueryShoppingCart: `${baseUrl2}/cart/queryCartList`,
  editCartQuantity: `${baseUrl2}/cart/editCartQuantity`,
  DelShoppingCart: `${baseUrl2}/cart/delete`,
  QueryOrderList: `${baseUrl}/sxyp/QueryOrderList`,
  MyCouponShow: `${baseUrl2}/sxyp/myCouponShow`,
  DeleteCoupon: `${baseUrl2}/sxyp/deleteMyCoupon`,
  CheckMinBuyCnt:`${baseUrl2}/cart/checkMinBuyCnt`,
  QueryCartListNew:`${baseUrl2}/cart/queryCartListNew`,  //新购物车接口
  GetCartPrice: `${baseUrl2}/cart/getCartPrice`,        //计算购物车选中商品金额以及优惠金额
  ModifyActivity: `${baseUrl2}/cart/modifyActivity`,    //修改促销活动
  // 添加商品到购物车
  addShoppingCart: `${baseUrl2}/cart/add`,
  // 查询可使用红包
  QueryNotUseRedBag: `${baseUrl2}/coupon/queryNotUseRedBag`,
  // 新添加订单接口
  newOrderAdd: `${baseUrl2}/order/newOrderAdd`,
  // 微信授权
  Wxpay: `${baseUrl}/sxyp/Wxpay`,
  // 查询订单总金额
  QueryOrderTotal: `${baseUrl}/sxyp/QueryOrderTotal`,
  GetUserInfoByMiniprogram: `${baseUrl}/sxyp/GetUserInfoByMiniprogram`, //获取用户token
  SendValidCode: `${baseUrl}/sxyp/SendValidCode`, // 获取短信验证码
  BindUser: `${baseUrl}/sxyp/BindUser`, // 绑定用户
  addressqQueryList: `${baseUrl2}/address/queryList`, // 查询收货地址（新）
  addressAddOrUpdate: `${baseUrl2}/address/addOrUpdate`, // 新增或修改收货地址（新）
  addressDel: `${baseUrl2}/address/del`, // 删除收货地址（新）
  addressSetDefault: `${baseUrl2}/address/setDefault`, // 修改默认收货地址（新）
  findListBySuperareaId: `${baseUrl2}/addressArea/findListBySuperareaId`, // 城市联动（新）
  addressCheckIdNumber: `${baseUrl2}/address/checkIdNumber`, // 城市联动（新）
  checkAreaCanOrder: `${baseUrl2}/area/checkAreaCanOrder`, // 当前收货地址能否下单
  // 会员信息
  member: `${baseUrl2}/member`,
  memberNew: `${baseUrl2}/memberNew`, // 新店主
  myInvitationTypeList: `${baseUrl2}/myInvitationTypeList`, // 新粉丝管理
  myInvitationInfo: `${baseUrl2}/myInvitationInfo`, // 新粉丝列表
  followerDetailNew: `${baseUrl2}/followerDetailNew`, // 新粉丝详情
  followerOrderDetail: `${baseUrl2}/followerOrderDetail`, // 新粉丝订单详情接口
  follower: `${baseUrl2}/follower`, // 粉丝管理
  followerDetail: `${baseUrl2}/followerDetail`, // 粉丝详情
  income: `${baseUrl2}/income`, //	预计收入明细
  incomeCondition: `${baseUrl2}/incomeCondition`, //	筛选条件
  query: `${baseUrl2}/withdraw/query`, // 提现
  apply: `${baseUrl2}/withdraw/apply`, // 提现申请
  queryDetail: `${baseUrl2}/withdraw/queryDetail`, // 提现记录
  bindCard: `${baseUrl2}/bank/bindCard`, // 绑卡
  readyBindCard: `${baseUrl2}/bank/readyBindCard`, // 预绑卡接口（点击发送验证码调用）
  sureBindCard: `${baseUrl2}/bank/sureBindCard`, // 确认绑卡
  getSharePics: `${baseUrl2}/share/getSharePics`, // 分享页图片
  // 推广
  GetMiniShareProductInfo: `${baseUrl}/sxyp/GetMiniShareProductInfo`,
  // 获取二维码信息
  GetQrcodeInfo: `${baseUrl}/sxyp/GetQrcodeInfo`,
  // 个人中心获取订单数量
  querycountorder: `${baseUrl}/sxyp/querycountorder`,
  GetNewToken: `${baseUrl}/sxyp/GetNewToken`, // 重新获取token
  // 搜索页面的热词
  searchHotWord: `${baseUrl2}/miniApi/searchHotWord`,
  // 搜索补全接口
  AutoCompletion: `${baseUrl}/sxyp/AutomaticCompletion`,
  // 搜索关键字接口
  AppletProductSearch: `${baseUrl}/sxyp/AppletProductSearch`,
  getWindowsAdvertise: `${baseUrl2}/sxypApplet/windowsAdvertiseCategory/getWindowsAdvertise`, // 首页弹窗
  internalCoupon: `${baseUrl}/sxyp/InternalCoupon`,   // 获取红包名称
  getSubjectAppInternal: `${baseUrl}/sxyp/GetSubjectAppInternal`,   // 领取优惠券
  getSubjectApp: `${baseUrl}/sxyp/getsubjectapp`,   // 领取优惠券2
  getStoreSharePics: `${baseUrl2}/share/getStoreSharePics`,    // 获取店铺背景图与二维码
  saveStoreShareName: `${baseUrl2}/share/saveStoreShareName`,  // 保存店铺名称
  sendStoreSharePics: `${baseUrl2}/share/sendStoreSharePics`,   // 
  getPhoneInfo: `${baseUrl}/sxyp/GetPhoneInfo`,   // 手机号解密授权
  QueryMember: `${baseUrl}/sxyp/QueryMember`,   // 通过邀请码获取用户信息
  userInfo: `${baseUrl}/userInfo`, // 个人头像昵称
  bindSxtCard: `${baseUrl2}/sxt/bindSxtCard`,   // 水象通绑卡
  querySxtCount: `${baseUrl2}/sxt/querySxtCount`,   // 水象通数量查询
  querySxtCardList: `${baseUrl2}/sxt/querySxtCardList`,   // 水象通列表查询
  selectTwoComment: `${baseUrl2}/productComment/selectTwoComment`,   // 查询评论
  productImgText: `${baseUrl2}/productDetail/productImgText`, // 商品图文详情
  sxtPrePay: `${baseUrl2}/sxtPrePay`, // 水象通预支付
  sxtPay: `${baseUrl2}/sxtPay`, // 水象通支付
  querySxtCount: `${baseUrl2}/sxt/querySxtCount`, // 水象通可用与不可用数量
  addProductComment: `${baseUrl2}/productComment/addProductComment`,    // 商品评价提交
  selectProductComment: `${baseUrl2}/productComment/selectProductComment`,   // 查询全部评论
  sendImageName: `${baseUrl2}/productComment/sendImageName`,   // 评论上传图片
  productCommentShare: `${baseUrl2}/productComment/productCommentShare`,   // 评价分享图片接口
  deleteUrl: `${baseUrl2}/productComment/deleteUrl`,
  findLeveMemberTitleList: `${baseUrl2}/findLeveMemberTitleList`,   // 查询体验官列表
  updateMemberLeveTitle: `${baseUrl2}/updateMemberLeveTitle`,   // 修改别名接口
  afterSaleList: `${baseUrl2}/afterSale/list`,   // 售后服务列表
  afterSaleProgressList: `${baseUrl2}/afterSale/progress/list`,   // 售后进度列表
  afterSaleApply: `${baseUrl2}/afterSaleNew/apply`,   // 查看申请售后服务
  afterSaleApplySubmit: `${baseUrl2}/afterSaleNew/apply/submit`,   // 提交申请售后服务
  afterSaleProgressDetail: `${baseUrl2}/afterSale/progress/detail`,   // 申请售后详情
  afterSaleProgressCancel: `${baseUrl2}/afterSale/progress/cancel`,   // 取消申请售后
  afterSaleProgressSend: `${baseUrl2}/afterSale/progress/send`,   // 买家寄送详情
  afterSaleProgressSendSubmit: `${baseUrl2}/afterSale/progress/sendSubmit`,   // 买家寄送提交
  //确认收货
  confirmReceipt: `${baseUrl2}/order/confirmReceipt`,
  //获取用户等级
  getMemberLevel:`${baseUrl2}/getmemberlevel`,
  //帮助中心
  getHelpInfo:`${baseUrl}/sxyp/helpcenter`,
  checkquestion:`${baseUrl}/sxyp/checkquestion`,
  getquestions:`${baseUrl}/sxyp/getquestions`,
  searchquestion:`${baseUrl}/sxyp/searchquestion`,
  subclassify:`${baseUrl}/sxyp/subclassify`,
  //IM
  getUsersByImUserIds:`${baseUrl2}/im/getUsersByImUserIds`, //ImUserId获取用户信息
  // findFansAndInviter:`${baseUrl2}/im/findMyFriend`,  //联系人列表
  findFansAndInviter:`${baseUrl2}/im/findMyFriendV2`, //联系人列表分页
  getApplyFriends:`${baseUrl2}/im/getApplyFriends`,    //申请好友列表
  getApplyFriendCount:`${baseUrl2}/im/getApplyFriendCount`, //聊天页面显示待处理申请接口
  getImShareOrders:`${baseUrl2}/order/getImShareOrders`, // 获取im分享的已经完成订单列表
  RefreshImToken:`${baseUrl}/sxyp/RefreshImToken` ,      //刷新IMUserToken
  searchMyFriends:`${baseUrl2}/im/searchMyFriends`,      //搜索我的联系人
  OrderDelete: `${baseUrl2}/order/deleteOrder`,  //删除订单
  GetProductDiscount: `${baseUrl2}/activity/getProductDiscount`,  //获取优惠金额
  GetSettleIncome: `${baseUrl2}/getSettleIncome`,  //预估返利
  GetArticleList: `${baseUrl2}/discoveryArticle/list`, //内容版式列表
  GetArticleDetail: `${baseUrl2}/discoveryArticle/detail`, //内容版式详情
  GetArticleShare: `${baseUrl2}/discoveryArticle/share` //内容版式分享
}
