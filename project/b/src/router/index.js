import store from 'store/'
import { jointLand } from 'lib/until'
// 路由配置表
// 首页
const Index = r => require.ensure([], () => r(require('components/index/Index')), 'Index')
// 火星电影票中转页
const Moviepage = r => require.ensure([], () => r(require('components/member/Moviepage')), 'Moviepage')
const Moviepage2 = r => require.ensure([], () => r(require('components/member/Moviepage2')), 'Moviepage2')
// 登陆注册模块
const Login = r => require.ensure([], () => r(require('components/loginSign/Login')), 'Login')
const ForegetPw = r => require.ensure([], () => r(require('components/loginSign/ForegetPw')), 'ForegetPw')
const Register = r => require.ensure([], () => r(require('components/loginSign/Register')), 'Register')

// 产品品类
const Category = r => require.ensure([], () => r(require('components/category/Category')), 'Category')
// 活动模板
const ActivityNew = r => require.ensure([], () => r(require('components/activity/ActivityNew')), 'ActivityNew')
const Activity = r => require.ensure([], () => r(require('components/activity/Index')), 'Activity')
// 春节活动
const SpringActivity = r => require.ensure([], () => r(require('components/activity/SpringActivity')), 'SpringActivity')

// 搜索
const Search = r => require.ensure([], () => r(require('components/search/Search')), 'Search')
// const CategoryType = r => require.ensure([], () => r(require('components/search/CategoryType')), 'CategoryType')

// 商品详情
const VirtualDetail = r => require.ensure([], () => r(require('components/detail/VirtualDetail.vue')), 'VirtualDetail')
// 常见问题
const DummyProblem = r => require.ensure([], () => r(require('components/common/DummyProblem.vue')), 'DummyProblem')
const VipChgQuestion = r => require.ensure([], () => r(require('components/common/VipChgQuestion.vue')), 'VipChgQuestion')
const VipCardIntro = r => require.ensure([], () => r(require('components/common/VipCardIntro.vue')), 'VipCardIntro')
const Detail = r => require.ensure([], () => r(require('components/detail/Index.vue')), 'Detail')
const Confirmorder = r => require.ensure([], () => r(require('components/shopping/Confirmorder')), 'Confirmorder')
const Redpacket = r => require.ensure([], () => r(require('components/shopping/Redpacket')), 'Redpacket')
const Address = r => require.ensure([], () => r(require('components/shopping/Address')), 'Address')
const Cashier = r => require.ensure([], () => r(require('components/shopping/Cashier')), 'Cashier')
const Addbankcard = r => require.ensure([], () => r(require('components/shopping/Addbankcard')), 'Addbankcard')
const SupportBankList = r => require.ensure([], () => r(require('components/shopping/SupportBankList')), 'SupportBankList')
const Paysucces = r => require.ensure([], () => r(require('components/shopping/Paysucces')), 'Paysucces')
const Payerror = r => require.ensure([], () => r(require('components/shopping/Payerror')), 'Payerror')
const PayDown = r => require.ensure([], () => r(require('components/shopping/PayDown')), 'PayDown')

// 个人中心
const Personal = r => require.ensure([], () => r(require('components/member/Personal')), 'Personal')
const NewAddress = r => require.ensure([], () => r(require('components/member/NewAddress')), 'NewAddress')
const Myaddress = r => require.ensure([], () => r(require('components/member/Myaddress')), 'Myaddress')
const SetAddress = r => require.ensure([], () => r(require('components/member/SetAddress')), 'SetAddress')
const MyRedpacket = r => require.ensure([], () => r(require('components/member/MyRedpacket')), 'MyRedpacket')
const MyBankCart = r => require.ensure([], () => r(require('components/member/MyBankCart')), 'MyBankCart')
const About = r => require.ensure([], () => r(require('components/member/About')), 'About')
const ContactCS = r => require.ensure([], () => r(require('components/member/ContactCS')), 'ContactCS')
const TotalactivityRule = r => require.ensure([], () => r(require('components/member/TotalactivityRule')), 'TotalactivityRule')
const AfterSaleRule = r => require.ensure([], () => r(require('components/member/AfterSaleRule')), 'AfterSaleRule')
const MyConcern = r => require.ensure([], () => r(require('components/member/MyConcern')), 'MyConcern')
// 订单详情
const OrderList = r => require.ensure([], () => r(require('components/myOrder/OrderList')), 'OrderList')
const OrderDetail = r => require.ensure([], () => r(require('components/myOrder/OrderDetail')), 'OrderDetail')
const MovieOrderdetail = r => require.ensure([], () => r(require('components/myOrder/MovieOrderdetail')), 'MovieOrderdetail')
const Logistics = r => require.ensure([], () => r(require('components/myOrder/Logistics')), 'Logistics')
// 订单合同
// const ContractList= r => require.ensure([], () => r(require('components/myOrder/ContractList')), 'ContractList')
// 分期计划
// const RepaymentPlan= r => require.ensure([], () => r(require('components/myOrder/RepaymentPlan')), 'RepaymentPlan')
// 账单
//  协议
const ProtocolList= r => require.ensure([], () => r(require('components/protocols/ProtocolList')), 'ProtocolList')
const Jkxy= r => require.ensure([], () => r(require('components/protocols/Jkxy')), 'Jkxy')
const Zxjxxplsqs= r => require.ensure([], () => r(require('components/protocols/Zxjxxplsqs')), 'Zxjxxplsqs')
const Scxsht = r => require.ensure([], () => r(require('components/protocols/Scxsht')), 'Scxsht')
const Bzjkht = r => require.ensure([], () => r(require('components/protocols/Bzjkht')), 'Bzjkht')
const Jxyhwljyzjzhfwsfxy = r => require.ensure([], () => r(require('components/protocols/Jxyhwljyzjzhfwsfxy')), 'Jxyhwljyzjzhfwsfxy')
const Spfqfwht = r => require.ensure([], () => r(require('components/protocols/Spfqfwht')), 'Spfqfwht')
const Spwtzrxy = r => require.ensure([], () => r(require('components/protocols/Spwtzrxy')), 'Spwtzrxy')
const Xwjrsxfqxxzxjxyglfwht = r => require.ensure([], () => r(require('components/protocols/Xwjrsxfqxxzxjxyglfwht')), 'Xwjrsxfqxxzxjxyglfwht')
const Yhkbgxy = r => require.ensure([], () => r(require('components/protocols/Yhkbgxy')), 'Yhkbgxy')
const Yhzcxy = r => require.ensure([], () => r(require('components/protocols/Yhzcxy')), 'Yhzcxy')
const Yhsqxy = r => require.ensure([], () => r(require('components/protocols/Yhsqxy')), 'Yhsqxy')
//  售后列表
const AfterSalesList= r => require.ensure([], () => r(require('components/afterSales/AfterSalesList')), 'AfterSalesList')
// 售后单详情
const AfterDetail= r => require.ensure([], () => r(require('components/afterSales/AfterDetail')), 'AfterDetail')
// 申请售后服务
const ApplyAfter= r => require.ensure([], () => r(require('components/afterSales/ApplyAfter')), 'ApplyAfter')
// 寄送商品
const SendGoods= r => require.ensure([], () => r(require('components/afterSales/SendGoods')), 'SendGoods')
// 进度查询
const Progress= r => require.ensure([], () => r(require('components/afterSales/Progress')), 'Progress')

// 发现模块
// const FindIndex= r => require.ensure([], () => r(require('components/findmodular/FindIndex')), 'FindIndex')
// const FindDetail = r => require.ensure([], () => r(require('components/findmodular/FindDetail')), 'FindDetail')
// const FindComments = r => require.ensure([], () => r(require('components/findmodular/FindComments')), 'FindComments')
// 购物车
const ShopCart = r => require.ensure([], () => r(require('components/shopCart/Index.vue')), 'shopCart')

// 我的收藏
const MyCollection = r => require.ensure([], () => r(require('components/MyCollection/Index.vue')), 'MyCollection')
// 秒杀活动
const SecondsKill = r => require.ensure([], () => r(require('components/secondsKill/SecondsKill.vue')), 'SecondsKill')
// 网络错误
const Brokennet = r => require.ensure([], () => r(require('components/member/Brokennet')), 'Brokennet')
// 借款
const Loan = r => require.ensure([], () => r(require('components/loan/Loan')), 'Loan')
const LoanIndex = r => require.ensure([], () => r(require('components/loan/Index')), 'LoanIndex')
const ConfirmLoan = r => require.ensure([], () => r(require('components/loan/ConfirmLoan')), 'ConfirmLoan')
const PaysuccessLoan = r => require.ensure([], () => r(require('components/loan/PaysuccessLoan')), 'PaysuccessLoan')
const LoanList = r => require.ensure([], () => r(require('components/loan/LoanList')), 'LoanList')
const LoanDetail = r => require.ensure([], () => r(require('components/loan/LoanDetail')), 'LoanDetail')
// 推广页
const Download = r => require.ensure([], () => r(require('components/extension/Download')), 'Download')
// 通知消息
const NotificationMessage = r => require.ensure([], () => r(require('components/message/NotificationMessage')), 'NotificationMessage')
// 卡券
const CardVoucher = r => require.ensure([], () => r(require('components/cardVoucher/Index')), 'CardVoucher')
const CardRate = r => require.ensure([], () => r(require('components/cardVoucher/CardRate')), 'CardRate')
// 帮助中心
const HelpIndex = r => require.ensure([], () => r(require('components/help/Index')), 'HelpIndex')
const HelpLists = r => require.ensure([], () => r(require('components/help/HelpLists')), 'HelpLists')
const HelpDetail = r => require.ensure([], () => r(require('components/help/HelpDetail')), 'HelpDetail')
const SearchHelp = r => require.ensure([], () => r(require('components/help/SearchHelp')), 'SearchHelp')
// 意见反馈
const Feedback = r => require.ensure([], () => r(require('components/feedback/Index')), 'Feedback')
// 设置
const SetUp = r => require.ensure([], () => r(require('components/member/SetUp')), 'SetUp')
// 个人还款
const Repayment = r => require.ensure([], () => r(require('components/repayment/Index')), 'Repayment')
const RepayDetail = r => require.ensure([], () => r(require('components/repayment/RepayDetail')), 'RepayDetail')
const RepayResult = r => require.ensure([], () => r(require('components/repayment/RepayResult')), 'RepayResult')
// 网红主页
const WebCelebrity = r => require.ensure([], () => r(require('components/celebrity/Index')), 'WebCelebrity')
// 店铺主页
const Store = r => require.ensure([], () => r(require('components/store/Index')), 'Store')
// 店主
const Vip = r => require.ensure([], () => r(require('components/vip/Index')), 'Vip')
// 预计明细
const IncomeDetails = r => require.ensure([], () => r(require('components/vip/IncomeDetails')), 'IncomeDetails')
// 返利说明
const ExplainTxt = r => require.ensure([], () => r(require('components/vip/ExplainTxt')), 'ExplainTxt')
// 提现
const CashingMoney = r => require.ensure([], () => r(require('components/vip/CashingMoney')), 'CashingMoney')
// 提现记录
const CashingRecord = r => require.ensure([], () => r(require('components/vip/CashingRecord')), 'CashingRecord')
// 确认提现
const CashingConfirm = r => require.ensure([], () => r(require('components/vip/CashingConfirm')), 'CashingConfirm')
const TiedCard = r => require.ensure([], () => r(require('components/vip/TiedCard')), 'TiedCard')
// 我的邀请用户
const FansIndex = r => require.ensure([], () => r(require('components/vip/FansIndex')), 'FansIndex')
// 水象通列表
const SxtCard = r => require.ensure([], () => r(require('components/shopping/SxtCard')), 'SxtCard')
// 公告列表
const AnnounceList = r => require.ensure([], () => r(require('components/vip/AnnounceList')), 'AnnounceList')
// 详情
const AnnounceDetail = r => require.ensure([], () => r(require('components/vip/AnnounceDetail')), 'AnnounceDetail')
// 课程列表
const NewFloorList = r => require.ensure([], () => r(require('components/vip/NewFloorList')), 'NewFloorList')
const ActivityGoods = r => require.ensure([], () => r(require('components/activity/ActivityGoods')), 'ActivityGoods')
// 发现详情
const FindDetail = r => require.ensure([], () => r(require('components/find/FindDetail')), 'FindDetail')
let routes = [
  // 首页
  {
    path: "/",
    name: 'Index',
    component: Index,
    meta: {
      title: "\u54c1\u8d28\u5546\u57ce",
      showFooter: true,
      hideReturn: true
    }
  },
  {
    path: "/moviepage",
    name: 'Moviepage',
    component: Moviepage,
    meta: {
      title: "",
      hideReturn: true
    }
  },
  {
    path: "/moviepage2",
    name: 'Moviepage2',
    component: Moviepage2,
    meta: {
      title: "",
      hideReturn: true
    }
  },
  // 登陆
  {
    path: "/login",
    name: 'Login',
    component: Login,
    meta: {
      title: "\u767b\u5f55",
      hideReturn: true
    }
  },
  // 忘记密码
  {
    path: "/foregetPw",
    name: 'ForegetPw',
    component: ForegetPw,
    meta: { title: "\u5fd8\u8bb0\u5bc6\u7801" }
  },
  // 注册
  {
    path: "/register",
    name: 'Register',
    component: Register,
    meta: { title: "\u6ce8\u518c" }
  },
  // 产品品类
  {
    path: "/category",
    name: 'Category',
    component: Category,
    meta: {
      title: "\u54c1\u7c7b",
      showFooter: true,
      hideReturn: true,
      titleBtn: [{
        // className: "night-palaces",
        // fn: 'isShowNightPalaces'
      }]
    }
  },
  // 活动模板
  {
    path: "/activityNew/:versionId",
    name: 'ActivityNew',
    component: ActivityNew,
    meta: {
      titleBtn: [{
        className: "share-url",
        fn: "shareUrl",
        showShare: true
      }]
    }
  },
  // 新活动模板
  {
    path: "/activity/:versionId",
    name: 'Activity',
    component: Activity,
    meta: {
      titleBtn: [{
        className: "share-url",
        fn: "shareUrl",
        showShare: true
      }]
    }
  },
  {
    path: "/springActivity",
    name: 'SpringActivity',
    component: SpringActivity,
    meta: {
      title: "\u9526\u9ca4\u95f9\u5143\u5bb5",
      titleBtn: [{
        className: "share-url",
        fn: "shareUrl",
        showShare: true
      }]
    }
  },
  // 搜索
  {
    path: "/search",
    name: 'Search',
    component: Search,
    meta: {
      title: "\u641c\u7d22",
      keepAlive: true
    }
  },
  // 商品详情
  {
    path: "/detail",
    name: 'Detail',
    component: Detail,
    meta: {
      title: "\u5546\u54c1\u8be6\u60c5",
      keepAlive: true,
      titleBtn: [{
      //   className: "back-index",
      //   to: "/"
      // },
      // {
        className: "share-url",
        fn: "shareUrl",
        showShare: true
        // to: "/"
      }]
    }
  },
  // 常见问题
  {
    path: "/dummyProblem",
    name: 'DummyProblem',
    component: DummyProblem,
    meta: { title: "\u5e38\u89c1\u95ee\u9898" }
  },
  {
    path: "/vipChgQuestion",
    name: 'VipChgQuestion',
    component: VipChgQuestion,
    meta: { title: "\u5e38\u89c1\u95ee\u9898" }
  },
  {
    path: "/vipCardIntro",
    name: 'VipCardIntro',
    component: VipCardIntro,
    meta: { title: "\u4f1a\u5458\u5361\u4ecb\u7ecd" }
  },
  // 红包说明
  {
    path: "/totalactivityRule",
    name: 'TotalactivityRule',
    component: TotalactivityRule,
    meta: { title: "\u7ea2\u5305\u8bf4\u660e" }
  },
  // 售后服务管理规则
  {
    path: "/afterSaleRule",
    name: 'AfterSaleRule',
    component: AfterSaleRule,
    meta: { title: "\u5e38\u89c1\u95ee\u9898" }
  },
  // 客服电话
  {
    path: "/contactCS",
    name: 'ContactCS',
    component: ContactCS,
    meta: {
      title: "\u8054\u7cfb\u5ba2\u670d",
      titleBtn: [{
        // className: "night-palaces",
        // fn: 'isShowNightPalaces'
      }]
    }
  },
  // 充值中心
  {
    path: "/virtualDetail",
    name: 'VirtualDetail',
    component: VirtualDetail,
    meta: { requiresAuth: true, title: "\u5145\u503c\u4e2d\u5fc3" }
  },
  // 确认订单
  {
    path: "/confirmorder",
    name: 'Confirmorder',
    component: Confirmorder,
    meta: { title: "\u8ba2\u5355\u7ed3\u7b97" }
  },
  {
    path: "/redpacket",
    name: 'Redpacket',
    component: Redpacket,
    meta: {
      title: "\u6211\u7684\u7ea2\u5305",
      titleBtn: [{
        className: "txt_r",
        text: '红包说明',
        // fn: "backIndex",
        to: "/totalactivityRule"
      }]
    }
  },
  // 收货地址
  {
    path: "/address",
    name: 'Address',
    component: Address,
    meta: { title: "\u6211\u7684\u6536\u8d27\u5730\u5740" }
  },
  // 收银台【分用户，两套不同的流程】
  {
    path: "/cashier",
    name: 'Cashier',
    component: Cashier,
    meta: { requiresAuth: true, title: "\u6536\u94f6\u53f0" }
  },
  // 添加银行卡
  {
    path: "/addbankcard",
    name: 'Addbankcard',
    component: Addbankcard,
    meta: { title: "\u6dfb\u52a0\u94f6\u884c\u5361" }
  },
  // 支持的银行卡列表
  {
    path: "/supportBankList",
    name: 'SupportBankList',
    component: SupportBankList,
    meta: { title: "\u652f\u6301\u7684\u94f6\u884c\u5361" }
  },
  // 支付成功
  {
    path: "/paysucces",
    name: 'Paysucces',
    component: Paysucces,
    meta: {
      title: "\u652f\u4ed8\u7ed3\u679c",
      hideReturn: true
    }
  },
  // 支付失败
  {
    path: "/payerror",
    name: 'Payerror',
    component: Payerror,
    meta: {
      title: "\u652f\u4ed8\u7ed3\u679c",
      hideReturn: true
    }
  },
  {
    path: "/payDown",
    name: 'PayDown',
    component: PayDown,
    meta: {
      title: "\u0020\u652f\u4ed8\u9996\u4ed8",
      hideReturn: true,
      requiresAuth: true
    }
  },
  // 我的订单
  {
    path: "/orderlist",
    name: 'OrderList',
    component: OrderList,
    meta: {
      requiresAuth: true,
      title: "\u6211\u7684\u8ba2\u5355",
      titleBtn: [{
        // className: "night-palaces",
        // fn: 'isShowNightPalaces'
      }]
    }
  },
  // 新增地址
  {
    path: "/newAddress",
    name: 'NewAddress',
    component: NewAddress,
    meta: { title: "\u65b0\u589e\u5730\u5740" }
  },
  // 我的收货地址
  {
    path: "/myaddress",
    name: 'Myaddress',
    component: Myaddress,
    meta: {
      requiresAuth: true,
      title: "\u6211\u7684\u6536\u8d27\u5730\u5740",
      titleBtn: [{
        // className: "night-palaces",
        // fn: 'isShowNightPalaces'
      }]
    }
  },
  // 我的红包
  {
    path: "/myRedpacket",
    name: 'MyRedpacket',
    component: MyRedpacket,
    // meta: { requiresAuth: true, title: "\u6211\u7684\u4f18\u60e0\u5238" }
    meta: {
      requiresAuth: true,
      title: "\u6211\u7684\u4f18\u60e0\u5238",
      titleBtn: [{
        // className: "night-palaces",
        // fn: 'isShowNightPalaces'
      }]
    }
  },
  // 我的银行卡
  {
    path: "/myBankCart",
    name: 'MyBankCart',
    component: MyBankCart,
    meta: {
      requiresAuth: true,
      title: "\u6211\u7684\u94f6\u884c\u5361",
      titleBtn: [{
        // className: "night-palaces",
        // fn: 'isShowNightPalaces'
      }]
    }
  },
  // 地址信息
  {
    path: "/setAddress",
    name: 'SetAddress',
    component: SetAddress,
    meta: { title: "\u5730\u5740\u4fe1\u606f" }
  },
  // 我的
  {
    path: "/personal",
    name: 'Personal',
    component: Personal,
    // meta: { title: "\u6211\u7684" }
    meta: {
      requiresAuth: false,
      title: "\u6211\u7684",
      showFooter: true,
      hideReturn: true,
      titleBtn: [{
        // className: "night-palaces",
        // fn: 'isShowNightPalaces'
      }]
      // titleBtn: [{
      //   className: "cs_icon",
      //   tag: 'a',
      //   // text: '红包说明',
      //   // fn: "backIndex",
      //   to: "/contactCS"
      // }]
    }
  },
  // 关于
  {
    path: "/about",
    name: 'About',
    component: About,
    meta: { title: "\u5173\u4e8e\u6211\u4eec" }
  },
  // 订单详情
  {
    path: "/orderdetail",
    name: 'OrderDetail',
    component: OrderDetail,
    meta: { title: "\u8ba2\u5355\u8be6\u60c5" }
  },
  {
    path: "/movieOrderdetail",
    name: 'MovieOrderdetail',
    component: MovieOrderdetail,
    meta: { title: "\u7535\u5f71\u7968\u8be6\u60c5" }
  },
  // 物流详情
  {
    path: "/logistics",
    name: 'Logistics',
    component: Logistics,
    meta: { title: "\u7269\u6d41\u8be6\u60c5" }
  },
  // 合同列表
  // {
  //   path: "/contractlist",
  //   name: 'ContractList',
  //   component: ContractList,
  //   meta: { title: "\u8ba2\u5355\u5408\u540c" }
  // },
  // 还款计划
  // {
  //   path: "/repaymentplan",
  //   name: 'RepaymentPlan',
  //   component: RepaymentPlan,
  //   meta: { requiresAuth: true, title: "\u8fd8\u6b3e\u8ba1\u5212" }
  // },
  //  分期账单
  // 协议s
  {
    path: "/protocolList",
    name: 'ProtocolList',
    component: ProtocolList,
    meta: {
      title: "\u76f8\u5173\u534f\u8bae",
      hideReturn: true
    }
  },
  {
    path: "/jkxy",
    name: 'Jkxy',
    component: Jkxy,
    meta: { title: "\u501f\u6b3e\u534f\u8bae" }
  },
  {
    path: "/zxjxxplsqs",
    name: 'Zxjxxplsqs',
    component: Zxjxxplsqs,
    meta: { title: "\u5f81\u4fe1\u53ca\u4fe1\u606f\u62ab\u9732\u6388\u6743\u4e66" }
  },
  // 商城销售合同
  {
    path: "/scxsht",
    name: 'Scxsht',
    component: Scxsht,
    meta: { title: "\u5546\u57ce\u9500\u552e\u5408\u540c" }
  },
  // // 保证借款合同
  {
    path: "/bzjkht",
    name: 'Bzjkht',
    component: Bzjkht,
    meta: { title: "\u4fdd\u8bc1\u501f\u6b3e\u5408\u540c" }
  },
  // // 江西银行网络交易资金账户服务三方协议
  {
    path: "/jxyhwljyzjzhfwsfxy",
    name: 'Jxyhwljyzjzhfwsfxy',
    component: Jxyhwljyzjzhfwsfxy,
    meta: { title: "\u6c5f\u897f\u94f6\u884c\u7f51\u7edc\u4ea4\u6613\u8d44\u91d1\u8d26\u6237\u002e\u002e\u002e" }
  },
  // // 商品分期服务合同
  {
    path: "/spfqfwht",
    name: 'Spfqfwht',
    component: Spfqfwht,
    meta: { title: "\u5546\u54c1\u5206\u671f\u670d\u52a1\u5408\u540c" }
  },
  // // 商品委托转让协议
  {
    path: "/spwtzrxy",
    name: 'Spwtzrxy',
    component: Spwtzrxy,
    meta: { title: "\u5546\u54c1\u8f6c\u8ba9\u534f\u8bae" }
  },
  // 小微金融水象分期信息咨询及信用管理服务合同
  {
    path: "/xwjrsxfqxxzxjxyglfwht",
    name: 'Xwjrsxfqxxzxjxyglfwht',
    component: Xwjrsxfqxxzxjxyglfwht,
    meta: { title: "\u5c0f\u5fae\u91d1\u878d\u6c34\u8c61\u5206\u671f\u4fe1\u606f\u54a8\u8be2\u002e\u002e\u002e\u000d\u000a" }
  },
  // 银行卡变更协议
  {
    path: "/yhkbgxy",
    name: 'Yhkbgxy',
    component: Yhkbgxy,
    meta: { title: "\u94f6\u884c\u5361\u53d8\u66f4\u534f\u8bae" }
  },
  // 用户注册协议
  {
    path: "/yhzcxy",
    name: 'Yhzcxy',
    component: Yhzcxy,
    meta: { title: "\u7528\u6237\u6ce8\u518c\u534f\u8bae" }
  },
  // 用户授权协议
  {
    path: "/yhsqxy",
    name: 'Yhsqxy',
    component: Yhsqxy,
    meta: { title: "\u7528\u6237\u6388\u6743\u534f\u8bae" }
  },
  // 售后列表
  {
    path: "/aftersaleslist",
    name: 'AfterSalesList',
    component: AfterSalesList,
    meta: {
      requiresAuth: true,
      title: "\u7533\u8bf7\u552e\u540e"
    }
  },
  {
    path: "/afterDetail",
    name: 'AfterDetail',
    component: AfterDetail,
    meta: {
      requiresAuth: true,
      title: "\u000d\u000a\u000d\u000a\u552e\u540e\u5355\u8be6\u60c5"
    }
  },
  {
    path: "/applyAfter",
    name: 'ApplyAfter',
    component: ApplyAfter,
    meta: {
      requiresAuth: true,
      title: "\u7533\u8bf7\u552e\u540e\u670d\u52a1"
    }
  },
  {
    path: "/SendGoods",
    name: 'SendGoods',
    component: SendGoods,
    meta: {
      requiresAuth: true,
      title: "\u5bc4\u9001\u5546\u54c1"
    }
  },
  {
    path: "/progress",
    name: 'Progress',
    component: Progress,
    meta: {
      requiresAuth: true,
      title: "\u552e\u540e\u5355\u8be6\u60c5"
    }
  },
  // 发现模块
  // {
  //   path: "/findIndex",
  //   name: 'FindIndex',
  //   component: FindIndex,
  //   meta: { title: "\u53d1\u73b0" }
  // },
  // {
  //   path: "/findDetail",
  //   name: 'FindDetail',
  //   component: FindDetail,
  //   meta: { title: "" }
  // },
  // {
  //   path: "/findComments",
  //   name: 'FindComments',
  //   component: FindComments,
  //   meta: { title: "\u70ed\u95e8\u8bc4\u8bba" }
  // },
  // 购物车
  {
    path: "/shopCart",
    name: 'ShopCart',
    component: ShopCart,
    meta: {
      title: "\u8d2d\u7269\u8f66",
      hideHeader: false,
      requiresAuth: true,
      showFooter: true,
      hideReturn: true
    }
  },
  // 我的收藏
  {
    path: "/myCollection",
    name: 'MyCollection',
    component: MyCollection,
    meta: {
      requiresAuth: true,
      title: "\u6211\u7684\u6536\u85cf",
      titleBtn: [{
        // className: "night-palaces",
        // fn: 'isShowNightPalaces'
      }]
    }
  },
  // 秒杀
  {
    path: "/secondsKill",
    name: 'SecondsKill',
    component: SecondsKill,
    meta: {
      title: "\u9650\u65f6\u79d2\u6740"
    }
  },
  {
    path: "/brokennet",
    name: 'Brokennet',
    component: Brokennet,
    meta: {
      title: "\u7f51\u7edc\u9519\u8bef"
    }
  },
  {
    path: "/loanIndex",
    name: 'LoanIndex',
    component: LoanIndex,
    meta: {
      title: "\u501f\u6b3e\u7533\u8bf7",
      requiresAuth: true
    }
  },
  {
    path: "/loan",
    name: 'Loan',
    component: Loan,
    meta: {
      title: "\u4fe1\u7528\u94b1\u5305",
      showFooter: true,
      hideReturn: true
    }
  },
  {
    path: "/confirmLoan",
    name: 'ConfirmLoan',
    component: ConfirmLoan,
    meta: {
      title: "\u501f\u6b3e\u786e\u8ba4"
    }
  },
  {
    path: "/paysuccessLoan",
    name: 'PaysuccessLoan',
    component: PaysuccessLoan,
    meta: {
      title: "\u63d0\u4ea4\u6210\u529f",
      hideReturn: true
    }
  },
  {
    path: "/loanList",
    name: 'LoanList',
    component: LoanList,
    meta: {
      // requiresAuth: true,
      title: "\u501f\u8fd8\u8ba2\u5355"
    }
  },
  {
    path: "/loanDetail",
    name: 'LoanDetail',
    component: LoanDetail,
    meta: {
      title: "\u501f\u6b3e\u8ba2\u5355"
    }
  },
  {
    path: "/download",
    name: 'Download',
    component: Download,
    meta: {
      title: "\u6c34\u8c61\u4f18\u54c1"
    }
  },
  // 通知消息
  {
    path: "/notificationMessage",
    name: 'NotificationMessage',
    component: NotificationMessage,
    meta: {
      keepAlive: true,
      requiresAuth: true,
      title: "\u901a\u77e5\u6d88\u606f"
    }
  },
  {
    path: "/cardVoucher",
    name: 'CardVoucher',
    component: CardVoucher,
    meta: {
      title: "\u793c\u54c1\u5361",
      requiresAuth: true
    }
  },
  {
    path: "/cardRate",
    name: 'CardRate',
    component: CardRate,
    meta: {
      title: "\u5361\u5238\u5bc4\u552e"
    }
  },
  // Help
  {
    path: "/helpIndex",
    name: 'HelpIndex',
    component: HelpIndex,
    meta: {
      title: "\u5e2e\u52a9\u4e2d\u5fc3"
    }
  },
  {
    path: "/helpLists",
    name: 'HelpLists',
    component: HelpLists,
    meta: {
      title: "\u5e2e\u52a9\u4e2d\u5fc3"
    }
  },
  {
    path: "/helpDetail",
    name: 'HelpDetail',
    component: HelpDetail,
    meta: {
      title: "\u95ee\u9898\u8be6\u60c5"
    }
  },
  {
    path: "/searchHelp",
    name: 'SearchHelp',
    component: SearchHelp,
    meta: {
      title: "\u95ee\u9898\u641c\u7d22"
    }
  },
  // 意见反馈
  {
    path: "/feedback",
    name: 'Feedback',
    component: Feedback,
    meta: {
      title: "\u610f\u89c1\u53cd\u9988"
    }
  },
  // 设置
  {
    path: "/set",
    name: 'SetUp',
    component: SetUp,
    meta: {
      requiresAuth: true,
      title: "\u7f16\u8f91\u4e2a\u4eba\u8d44\u6599"
    }
  },
  {
    path: "/concern",
    name: 'MyConcern',
    component: MyConcern,
    meta: {
      requiresAuth: true,
      title: "\u6211\u7684\u5173\u6ce8\u000d\u000a"
    }
  },
  {
    path: "/repayment",
    name: 'Repayment',
    component: Repayment,
    meta: {
      // requiresAuth: true,
      title: "\u5f85\u8fd8\u6b3e"
    }
  },
  {
    path: "/repayDetail",
    name: 'RepayDetail',
    component: RepayDetail,
    meta: {
      requiresAuth: true,
      title: "\u7acb\u5373\u8fd8\u6b3e"
    }
  },
  {
    path: "/repayResult",
    name: 'RepayResult',
    component: RepayResult,
    meta: {
      title: "\u8fd8\u6b3e\u7ed3\u679c"
    }
  },
  // 网红主页
  {
    path: "/celebrity",
    name: 'WebCelebrity',
    component: WebCelebrity,
    meta: {
      title: "\u7f51\u7ea2\u4e3b\u9875"
    }
  },
  // 店铺主页
  {
    path: "/store",
    name: 'Store',
    component: Store,
    meta: {
      title: "\u5e97\u94fa"
    }
  },
  // 店主
  {
    path: "/vip",
    name: 'Vip',
    component: Vip,
    meta: {
      requiresAuth: true,
      title: "\u6c34\u8c61\u4f18\u54c1",
      showFooter: true,
      hideReturn: true
    }
  },
  {
    path: "/incomeDetails",
    name: 'IncomeDetails',
    component: IncomeDetails,
    meta: {
      title: "\u9884\u8ba1\u6536\u5165\u660e\u7ec6"
    }
  },
  {
    path: "/explainTxt",
    name: 'ExplainTxt',
    component: ExplainTxt,
    meta: {
      title: "\u8fd4\u5229\u8bf4\u660e"
    }
  },
  {
    path: "/cashingMoney",
    name: 'CashingMoney',
    component: CashingMoney,
    meta: {
      title: "\u63d0\u73b0"
    }
  },
  {
    path: "/cashingRecord",
    name: 'CashingRecord',
    component: CashingRecord,
    meta: {
      title: "\u63d0\u73b0\u8bb0\u5f55"
    }
  },
  {
    path: "/cashingConfirm",
    name: 'CashingConfirm',
    component: CashingConfirm,
    meta: {
      title: "\u786e\u8ba4\u63d0\u73b0"
    }
  },
  {
    path: "/tiedCard",
    name: 'TiedCard',
    component: TiedCard,
    meta: {
      title: "\u7ed1\u5b9a\u94f6\u884c\u5361"
    }
  },
  {
    path: "/fansIndex",
    name: 'FansIndex',
    component: FansIndex,
    meta: {
      title: "\u6211\u7684\u9080\u8bf7\u7528\u6237"
    }
  },
  {
    path: "/sxtCard",
    name: 'SxtCard',
    component: SxtCard,
    meta: {
      title: "\u9009\u62e9\u6c34\u8c61\u901a"
    }
  },
  {
    path: "/announceList",
    name: 'AnnounceList',
    component: AnnounceList,
    meta: {
      title: "\u6c34\u8c61\u516c\u544a"
    }
  },
  {
    path: "/announceDetail",
    name: 'AnnounceDetail',
    component: AnnounceDetail
  },
  {
    path: "/newFloorList",
    name: 'NewFloorList',
    component: NewFloorList,
    meta: {
      title: "\u8be6\u60c5"
    }
  },
  {
    path: "/activityGoods",
    name: 'ActivityGoods',
    component: ActivityGoods,
    meta: {
      title: "\u6d3b\u52a8\u5546\u54c1"
    }
  },
  {
    path: "/findDetail",
    name: 'FindDetail',
    component: FindDetail,
    meta: {
      title: "\u53d1\u73b0\u8be6\u60c5"
    }
  }
]
// 路由跳转hook函数
export const beforeEach = (to, from, next) => {
  if (to.name != from.name && window.navigator.onLine) {
    store.commit('SHOWLOADINGFLAG', true)
  } else if (!window.navigator.onLine) {
    store.commit('UPDATETOAST', {msg: '网络不给力，请重新尝试'})
    setTimeout(function () {
      store.commit('UPDATETOAST', {msg: ''}) // 此处需要手动添加一个定时器2s以后隐藏toast
    }, 3000)
  }
  // 校验判断,需要登录的路由
  if (to.matched.some(record => record.meta.requiresAuth)) {
    let token = store.state.userInfo.token || window.sessionStorage.getItem('token')
    if (!token) {
      store.commit('SHOWLOADINGFLAG', false)
      next(false)
      jointLand()
    } else {
      next()
    }
  } else {
    next()
  }
}
export const afterEach = route => {
  document.body.scrollTop = document.documentElement.scrollTop = 0
}
export default routes
