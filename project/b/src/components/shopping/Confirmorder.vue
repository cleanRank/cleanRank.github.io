<template>
  <div>
    <div class="areaWarn" v-if="areaError">
      {{areaErrorInfo.statusMessage}}
    </div>
  <section class="confirm_order infoContainer" :class="{haveWarn:areaError}" id="infoContainer" data-title="确认订单" v-if="isloding">
    <!-- <p class="crossBorder_txt" v-if="rendarrTemp.isCrossBorder == 1">
      因海关清关需要，为保障顺利清关，收货地址使用的收货人姓名、身份证号请与付款人真实信息保持一致。
    </p> -->
    <div class="confirmorder_top">
      <router-link tag="a" class="address_a" to="/address" v-if ="addresslist !='' && !rendarrTemp.notEmpty" >
        <p class="address_p user-info-name"><span class="user-info-consignee">{{addresslist.consignee}}</span><span class="c_999">{{addresslist.consigneeMobile.slice(0, 3)+'****'+addresslist.consigneeMobile.slice(-4)}}</span></p>
        <p class="address_p user-info-addres">{{addresslist.addProvince+addresslist.addCity+addresslist.addCounty+addresslist.addTown+addresslist.addDetail}}</p>
      </router-link>
      <p class="recharge_tel" v-else-if="rendarrTemp.notEmpty=='101'||rendarrTemp.notEmpty=='102'"><span>充值号码：</span><span>{{rendarrTemp.mobile}}</span></p>
      <p class="recharge_tel" v-else-if="rendarrTemp.notEmpty=='106' || rendarrTemp.notEmpty=='103'"><span>接收短信号码：</span><span>{{rendarrTemp.mobile}}</span></p>
      <router-link tag="a" to="/newAddress" class="address_a address_as" v-else>请选择收货地址</router-link>
    </div>
    <p class="flex info_p card_info" v-if="rendarrTemp.isCrossBorder == 1">
      <a class="flex" href="javascript:;">
        <b class="cell_0 l_b card_l">身份证号</b>
        <span class="cell_1 c_333"><input v-formBlur class="idNumber_input" @focus="clearIdnumber" type="text" maxlength='18' :value="idNumber" v-model="idNumber" onkeyup="value=value.replace(/[^\a-\z\A-\Z0-9]/g,'')" placeholder="因海关需要，请填写收货人身份证号"></span>
      </a>
    </p>
    <div id="couponContainer">
      <!-- 循环商品列表 start -->
      <div class="goods-info-wrap" v-for="(_item, index) in rendarrTemp.userChooseGoods" :key="index">
          <dl class="flex product_box">
          <dd class="cell_0">
            <p class="surplus_box" v-if="_item.productStock<11">仅剩{{_item.productStock}}件</p>
            <img :src="_item.qualityProduct.mainImagePath" />
          </dd>
          <dt class="cell_1">
          <p class="good-name-line-h" :class="{'crossBorder_goods':_item.qualityProduct.isCrossBorder== 1 || rendarrTemp.isCrossBorder =='1'}" v-if="!rendarrTemp.notEmpty || rendarrTemp.notEmpty=='106' || rendarrTemp.notEmpty=='103'"> {{_item.qualityProduct.productName}}</p>
          <p v-else class="re_p">{{'中国'+rendarrTemp.attribution}} {{rendarrTemp.notEmpty=='101'?'话费充值':'流量充值'}}{{_item.qualityProduct.productName}}</p>
          <p class="c_ccc fSpu" v-if="!rendarrTemp.productType || rendarrTemp.productType<100">{{_item.spu || _item.qualityProduct.viceTitle}}</p>
          <div class="sj_p flex">
            <span class="c_red jg_box cell_0">¥{{_item.qualityProduct.price}}</span>
            <!-- <del class="c_999 font12 cell_0 del_box">¥{{_item.qualityProduct.virtualPrice && parseFloat(_item.qualityProduct.virtualPrice)}}</del> -->
            <div class="rebatePrice cell_1"></div>
            <span class="cell_0 c_999 quantity_box font12">x{{_item.quantity}}</span>
          </div>
          <p class="is7ToReturns cell_1" v-if="_item.is7ToReturn == 0">不支持七天无理由退货</p>
          </dt>
        </dl>
        <p class="flex info_p remarks_p" v-if="addresslist !='' && !rendarrTemp.notEmpty">
          <b class="cell_0 l_b c_999">买家留言</b>
          <textarea v-formBlur class="cell_1 texearea_txt" maxlength="30" :value="_item.remark" @blur="iosXscrollTo($event,index)" placeholder="选填，30字以内"></textarea>
        </p>
        <div class="confirmorder_box">
          <p class="info_p_text areaError" v-if="areaError">
              <span v-for="(_it, index) in areaErrorInfo.data" :key="index">
                <span v-if="_it.productNo==_item.productNo || _it.productNo==_item.qualityProduct.productNo">{{_it.errorMessage}}</span>
              </span>
          </p>
          <p class="info_p info_p_left" v-if="areaError">
              <span v-for="(_it, index) in areaErrorInfo.data" :key="index">
                <span v-if="_it.productNo==_item.productNo || _it.productNo==_item.qualityProduct.productNo">{{_it.errorMessage}}</span>
              </span>
          </p>
          <p class="info_p_right">
            <b class="cell_1 l_b info_p_text c_999">共{{_item.quantity}}件商品</b>
            <span class="cell_1 r_s c444 info_p_text_l">小计：<em>¥{{(_item.qualityProduct.price * _item.quantity) | fixed2NoRound}}</em></span>
          </p>
        </div>
      </div>
      <!-- 循环商品列表 end -->
      <div class="order_info">
        <p class="flex info_p lh_40" data-use="0" id="coupon_btn" v-if="isShowRed">
          <router-link tag="a" class="flex" to="/redpacket"><b class="cell_1 l_b">优惠券</b>
            <span class="cell_1 r_s" v-if="rendarrTemp.redBagValue==0||rendarrTemp.redBagValue==undefined">不使用 <b class="right_s"></b></span>
            <span class="c_red cell_1 r_s" v-else>- ¥{{rendarrTemp.redBagValue}}<b class="right_s"></b></span>
          </router-link>
        </p>
        <p v-else class="flex info_p lh_40">
          <b class="cell_1 l_b">优惠券</b>
          <span class="cell_1 r_s c_999">暂无可用优惠券</span>
        </p>
        <div class="flex info_p lh_40" v-if="discountAmount>0">
          <p class="cell_1 l_b">活动优惠</p>
          <p class="cell_1 r_s c_333">- ¥{{+(discountAmount) | fixed2NoRound}}</p>
        </div>
        <p class="flex info_p lh_40" data-use="0" id="coupon_btn" v-if="usableSxtCount>0 && !rendarrTemp.notEmpty">
          <router-link tag="a" class="flex" :to="{ path: 'sxtCard', query: { amountPrice: totalPrice - (+redBagValue)}}">
            <b class="cell_1 l_b">水象通</b>
            <span class="cell_1 r_s c_red" v-if="rendarrTemp.checkList && rendarrTemp.checkList.length>0">- ¥{{deductionPrice | fixed2NoRound}}<b class="right_s"></b></span>
            <span class="cell_1 r_s c_red" v-else>{{usableSxtCount}} 张可用<b class="right_s"></b></span>
          </router-link>
        </p>
        <p v-else class="flex info_p lh_40">
          <b class="cell_1 l_b">水象通</b>
          <span class="cell_1 r_s c_999">暂无可用</span>
        </p>
        <div class="flex info_p lh_40" v-if="rebate > 0">
          <p class="cell_1 l_b">预估返利</p>
          <p class="cell_1 r_s c_444">¥{{rebate | fixed2NoRound}}</p>
        </div>
        <!-- invoice info wrap start-->
        <div class="invoice-info-wrap" v-if="addresslist !='' && !rendarrTemp.notEmpty">
           <!-- 点击发票展示选项 start-->
        <div class="invoice-info" v-if="isShowInvoice">
          <div class="invoiceMask"></div>
          <ul class="invoiceBox">
            <li @click="invoiceClick('')">不开发票</li>
            <li @click="invoiceClick(1)">个人电子发票</li>
            <li @click="invoiceClick(2)">公司电子发票</li>
          </ul>
        </div>
       <!-- 点击发票展示选项 end-->
        <p class="flex info_p lh_40">
          <!-- 跨境商品不支持开发票 -->
          <a href="javascript:;" class="flex" v-if="rendarrTemp.isCrossBorder == 1">
            <b class="cell_1 l_b">发票信息</b>
            <span class="cell_1 r_s">
              <span>跨境商品暂不支持开发票</span>
              <!-- <b class="right_s"></b> -->
            </span>
          </a>
          <a href="javascript:;" class="flex" @click="chooseInvoice" v-else>
            <b class="cell_1 l_b">发票信息</b>
              <span class="cell_1 r_s c_999" v-if="rendarrTemp.invoiceType==undefined||rendarrTemp.invoiceType==0">
                <span id="invoiceKind">不开发票</span>
                <b class="right_s"></b>
              </span>
              <span class="cell_1 r_s" v-else>{{rendarrTemp.invoiceTitle==1?'个人电子发票':'公司电子发票'}} <b class="right_s"></b></span>
          </a>
        </p>
       <div class="invoice-info-type" v-if="rendarrTemp.invoiceType != 0">
        <div class="person_invoice" v-if="rendarrTemp.invoiceTitle==1">
          <p class="flex info_p lh_40">
            <a href="javascript:;" class="flex">
              <b class="cell_1 l_b">收票人邮箱</b>
              <input v-formBlur placeholder="用于接收电子发票" class="cell_1 r_s" v-model="rendarrTemp.email" />
            </a>
          </p>
        </div>
        <div class="company_invoice" v-else>
          <p class="flex info_p lh_40 company_sec">
            <a href="javascript:;" class="flex">
              <b class="cell_1 l_b">发票抬头</b>
              <input v-formBlur placeholder="请输入发票抬头" class="cell_1 r_s" v-model="rendarrTemp.invoiceUnit" />
              <!-- <span class="cell_1 r_s">集团</span> -->
            </a>
          </p>
          <p class="flex info_p lh_40">
            <a href="javascript:;" class="flex">
              <b class="cell_1 l_b">收票人邮箱</b>
              <input v-formBlur placeholder="用于接收电子发票" class="cell_1 r_s" v-model="rendarrTemp.email" />
            </a>
          </p>
          <p class="flex info_p lh_40">
            <a href="javascript:;" class="flex">
              <b class="cell_1 l_b">纳税人识别号</b>
              <input v-formBlur placeholder="或统一社会信用代码" class="cell_1 r_s" v-model="rendarrTemp.taxpayerNumber" />
            </a>
          </p>
          <span class="invoice_notice">开具企业抬头发票须正确填写纳税人识别号，以免影响报销。</span>
        </div>
        </div>
      </div>
        <!-- invoice info wrap end-->
    </div>
    <!-- 微信支付s -->
    <div class="flex info_p wePay_box" v-if="isWeixin || ($store.state.config.fromChannel == 'sxypApp' && +($store.state.config.ver.replace(/\./g, '')) > 150)">
      <p class="cell_1 l_b">支付方式</p>
      <p class="cell_1 r_s">微信支付</p>
    </div>
    <!-- 微信支付e -->
    <div class="flex addorder_box">
      <p class="cell_1 money_txt c_666 font15">实付款：<b class="c_red font12">¥&nbsp;</b><span class="c_red font18">{{amountPrice | fixed2NoRound}}</span></p>
      <p class="cell_0 confirmorder_btn" @click="confirmorder($event)">{{isWeixin || ($store.state.config.fromChannel == 'sxypApp' && +($store.state.config.ver.replace(/\./g, '')) > 150)?'付款':'支付'}}</p>
    </div>
    <!-- <input type="button" class="confirm_btn" value="确认订单" id="confirm_btn" @click="setbillDate()"/> -->
    </div>
     <!-- 设置交易密码 s-->
    <!-- v-if="isShowPw" -->
    <pwdBox @pwdSuccess="pwdSuccess" @closePwd="closePwd" :code="'6'" :rendarrTemp="rendarrTemp" v-if="isShowPw"></pwdBox>
    <!-- 设置交易密码 e-->
    <!-- 商品变动弹框 start -->
      <section class="goods-change-dialog" v-if="isShowChangeBox">
          <section class="goods-change-list-info">
             <ul>
               <li class="" v-for="(_item, i) in errorlist" :key="i">
                 <img class="" :src="_item.mainImagePath" alt="">
                 <p class="goods-info-title">{{_item.productName}}</p>
                 <p class="goods-info-price price-bold" v-if="_item.errorCode == 2009">商品已经售罄</p>
                 <p class="goods-info-price" v-else-if="_item.errorCode == 2005">x{{_item.quantity}}<span class="price-bold">（比加入时增加了<span>¥{{(_item.price - _item.newPrice) | fixed2NoRound}}</span>元）</span></p>
                 <p class="goods-info-price price-bold" v-else-if="_item.errorCode == 2008 && _item.fromNo == newPeopleActivityNo">水象宝宝，你已经使用过一次新人特权啦~</p>
                 <p class="goods-info-price" v-else>x{{_item.quantity}}<span class="price-bold">({{_item.errorMessage}})</span></p>
               </li>
             </ul>
             <a class="back-shop-cart" href="javascript:;" @click="goShopcart()">确定</a>
          </section>
      </section>
    <!-- 商品变动弹框 end -->
  </section>
  <div class="areaLayer" v-if="layerFlag&&errorPro">
      <div class="areaLayerInner">
        <p class="info_title">提示</p>
        <p class="area_warn">{{areaErrorInfo.statusMessage}}</p>
        <ul>
          <li v-for="(_item, index) in errProArr" :key="index">
            <img :src="_item.qualityProduct.mainImagePath" alt="">
            <div class="info_right">
              <p>{{_item.qualityProduct.productName}}</p>
              <p class="info_price">￥<span>{{_item.qualityProduct.price}}</span></p>
            </div>
          </li>
        </ul>
        <div class="bom_btn">
            <span @click="hideLayer()">我知道了</span>
            <span class="bom_btn_acti" @click="goShopcart()">去修改</span>
        </div>
      </div>
  </div>
  </div>
</template>
<script type="text/javascript">
  import { mapGetters, mapActions } from 'vuex'
  import _ from 'lodash'
  import overflow from '../../mixin/overflow'
  // import Base64 from 'lib/Base64'
  import { app, is_weixn } from 'lib/until'
  import shoppingmixin from 'components/shopping/mixin'
  import pwdBox from 'components/common/pwdBox'
  import sensors from 'sa-sdk-javascript'
  export default {
    mixins: [overflow, shoppingmixin],
    data () {
      return {
        coupflg: 0,
        addresslist: [],
        radJsons: [],
        addressNo: '',
        rendarrTemp: {
          email: '',
          taxpayerNumber: '',
          invoiceTitle: '',
          invoiceType: 0
        },
        fromChannel: '',
        redBagValue: '',
        totalPrice: 0,
        rebate: 0,
        isShowChangeBox: false,
        isShowInvoice: false,
        errorlist: [],
        fromNameArr: ['Detail', 'VirtualDetail', 'ShopCart'],
        idNumber: '',
        // isonEye: false,
        isloding: false,
        isWeixin: is_weixn(),
        usableSxtCount: 0, // 水象通可用卡数
        isShowPw: false, // 是否显示支付密码框
        areaError: false, // 配送与否标识
        areaErrorInfo: '', // 配送提示
        layerFlag: false,
        errorPro: false,
        errProArr: [],
        errflag: false,
        discountAmount: 0, // 活动优惠
        newPeopleActivityNo: ''
      }
    },
    components: {
      pwdBox
    },
    beforeRouteLeave (to, from, next) {
      if (window.time) {
        clearInterval(window.time)
        delete window.time
      }
      // 跳转的路由如果不是红包页面，都把数据清空
      if (to.name != 'Redpacket' && to.name != "Address" && to.name != "SxtCard") {
        if (!to.name) { return false }
        this.updateGoodsInfo({
          redBagValue: '',
          redBagId: '',
          radname: '',
          invoiceUnit: '',
          invoiceContent: '',
          invoiceType: 0,
          email: '',
          taxpayerNumber: '',
          invoiceTitle: '',
          upPage: '',
          radJsons: '',
          selectedAddress: '',
          notEmpty: '',
          fromPage: '',
          userChooseGoods: [],
          checkList: '',
          idNumber: '',
          addressNo2: ''
        })
        // this.updateGoodsInfo({selectedAddress: ''})
      } else {
        const { invoiceUnit, invoiceType, invoiceTitle, taxpayerNumber, email, userChooseGoods } = this.rendarrTemp
        this.updateGoodsInfo({
          invoiceUnit,
          invoiceType,
          invoiceTitle,
          taxpayerNumber,
          email,
          userChooseGoods,
          idNumber: this.idNumber,
          addressNo2: this.addressNo // 记录当前选择的地址编号
        })
      }
      if (to.name == 'Detail' || to.name == 'ShopCart') {
        window.sessionStorage.removeItem('fromPage')
      }
      this.clearOverFlow()
      next()
    },
    watch: {
      "redBagValue": {
        handler (val, oldVal) {
          if (val) {
            this.rendArrTemp()
          }
        }
      },
      "goodsInfo.userChooseGoods": {
        handler (val, oldVal) {
          // 客户端购物车进来，会有短时间的渲染时间
          if (val.length != oldVal.length) {
            this.showPage()
          }
        }
      }
    },
    mounted () {
      this.$nextTick(() => {
        setTimeout(() => {
          this.showPage()
          document.body.style.overflow = 'visible'
          window.scrollTo(0, 1)
          document.body.style.height='auto'
        }, 300)
      })
    },
    computed: {
      ...mapGetters({
        userInfo: "getUserInfo",
        goodsInfo: "getGoodsInfo"
      }),
      // 是否限时优惠券
      isShowRed () {
        /**
         * 不能使用优惠券情况列表
         * 1. 虚拟商品
         */
        return this.coupflg == 1
      },
      deductionPrice () {
        // 抵扣金额
        let {redBagValue} = this.rendarrTemp
        let leftAmount = 0
        if (this.goodsInfo.checkList && this.goodsInfo.checkList.length>0) {
          this.goodsInfo.checkList.map((item) => {
            leftAmount = leftAmount + (+item.leftAmount)
          })
          return this.totalPrice - (+redBagValue) > (+leftAmount) ? leftAmount : this.totalPrice - (+redBagValue)
        } else {
          return 0
        }
      },
      amountPrice () {
        // 计算合计金额
        let {redBagValue} = this.rendarrTemp
        if (this.goodsInfo.checkList && this.goodsInfo.checkList.length>0) {
          return this.deductionPrice > this.totalPrice - (+redBagValue) ? 0 : this.totalPrice - (+redBagValue)- (+this.deductionPrice)
        } else {
          if ((+redBagValue) > this.totalPrice) {
            return 0
          } else {
            return this.totalPrice - (+redBagValue)
          }
        }
      },
      isiOSX () {
        return /iphone/gi.test(navigator.userAgent) && (window.screen.height == 812 && window.screen.width == 375)
      }
    },
    methods: {
      ...mapActions([
        "updateUserInfo",
        "updateGoodsInfo"
      ]),
      showPage () {
        // 进入该页面首先session取缓存数据
        if (this.$store.state.route.from.name && this.fromNameArr.indexOf(this.$store.state.route.from.name) === -1) {
          this.pageLoaded()
        } else {
          let goodsInfo = this.fromChannel == 'sxypApp' ? this.$store.state.goodsInfo : JSON.parse(window.sessionStorage.getItem('goodsInfo'))
          if (goodsInfo) {
            setTimeout(() => {
              window.sessionStorage.removeItem('goodsInfo')
            }, 1200)
          } else {
            goodsInfo = {}
          }
          this.updateGoodsInfo(goodsInfo).then(() => {
            this.pageLoaded()
          })
          // 更新路由信息
          this.updateGoodsInfo({
            fromPage: this.$store.state.route.from.name || window.sessionStorage.getItem('fromPage')
          })
          // 拉取发票信息
          this.getInvoiceInfo()
        }
      },
      getAmount () {
        let fromPage = this.$store.state.route.from.name == "ShopCart" || window.sessionStorage.getItem('fromPage') ? 2: 1
        if (fromPage == 1) {
          console.log('获取商品详情页-商品金额、优惠金额')
          // 商品详情
          this.totalPrice = this.$store.state.goodsInfo.totalAmount
          this.discountAmount = this.$store.state.goodsInfo.discountAmount
          this.getSettleIncome()
        } else {
          console.log('获取购物车-商品金额、优惠金额')
          // 购物车
          this.getCartBuyInfo()
        }
      },
      getCartBuyInfo () {
        let {uid, token} = this.$store.state.userInfo
        const cartIds = []
        this.rendarrTemp.userChooseGoods.map(({ cartId }, index) => {
          cartIds.push(cartId)
        })
        this.$post({
          url: this.$store.state.api.getCartPrice,
          data: {
            uid,
            token,
            cartIds: JSON.stringify(cartIds)
          }
        }).then(({data: res}) => {
          if (res.status == 1) {
            this.totalPrice = +(res.data.total)
            this.discountAmount = +(res.data.discountPrice)
            // 计算预估返利
            this.getSettleIncome()
          }
        })
      },
      goShopcart () {
        if (this.$store.state.config.fromChannel == 'sxypApp') {
          app.goIndex()
        } else {
          window.history.go(-1)
        }
        document.body.style.overflow = 'visible'
        document.body.style.height='auto'
      },
      clearIdnumber () {
        // 清空身份证号
        this.idNumber = ''
      },
      // 获取发票信息
      getInvoiceInfo () {
        const { uid, token } = this.$store.state.userInfo
        this.$post({
          url: this.$store.state.api.GetInvoice,
          data: {
            uid,
            token
          }
        }).then(({data: res}) => {
          if (res.status === "1") {
            const { invoiceUnit, invoiceTitle, email, taxpayerNumber } = res
            this.rendarrTemp = Object.assign(this.rendarrTemp, { invoiceUnit, invoiceTitle, taxpayerNumber, email })
            this.updateGoodsInfo({
              invoiceUnit, invoiceTitle, email, taxpayerNumber
            })
          } else if (res.status === "11") {
          } else {
            this.showToast({msg: res.statusDetail})
          }
        })
      },
      // // 监听输入框 -> 买家留言
      // inputTextArea (e, idx) {
      //   const val = e.target.value
      //   const curGoods = this.rendarrTemp.userChooseGoods[idx]
      //   curGoods.remark = val
      //   this.rendarrTemp.userChooseGoods.splice(idx, 1, curGoods)
      // },
      iosXscrollTo (e, idx) {
        // 买家留言
        const val = e.target.value
        const curGoods = this.rendarrTemp.userChooseGoods[idx]
        curGoods.remark = val
        this.rendarrTemp.userChooseGoods.splice(idx, 1, curGoods)
      },
      pageLoaded () {
        // 从vuex goodsInfo 内取出数据然后渲染
        this.rendArrTemp()
        // 回显红包
        this.myCouponShow()
        // 回显水象通卡
        this.querySxtCard()
        // 回显我的发票信息
        this.rendarrTemp = Object.assign(this.rendarrTemp, this.goodsInfo)
        this.showLoad(false)
        // 回显地址信息
        this.queryReceiptAddress()
        // 微信授权页面返回
        if (this.$store.state.route.query.redirecUrl) {
          // 后台保存微信授权code
          this.wechatSaveUserinfo()
        }
      },
      alertBox (txt) {
        this.showToast({msg: txt})
      },
      // vuex goodsInfo的信息回显到页面
      rendArrTemp () {
        // 回显goodsInfo的信息到 rendarrTemp
        this.$set(this.$data, 'rendarrTemp', _.cloneDeep(this.goodsInfo))
      },
      queryReceiptAddress () {
        // 查询收货地址,虚拟商品没有收货地址校验
        let { uid, token } = this.$store.state.userInfo
        if (this.goodsInfo.selectedAddress) {
          this.$set(this.$data, 'addresslist', this.goodsInfo.selectedAddress)
          let {addressNo, idNumber} = this.addresslist
          this.addressNo = addressNo
          // 判断是否选择新的收货地址
          this.idNumber = this.goodsInfo.addressNo2 != addressNo ? idNumber : this.goodsInfo.idNumber
          this.isloding = true
          this.checkArea(this.addressNo)
          return false
        }
        if (this.goodsInfo.notEmpty == '101' || this.goodsInfo.notEmpty == '102' || this.goodsInfo.notEmpty == '103' || this.goodsInfo.notEmpty == '106') {
          this.isloding = true
          return false
        }
        this.showLoad(true)
        this.$post({
          url: this.$store.state.api.QueryReceiptAddress,
          data: {
            uid: uid,
            token: token,
            defaultAdd: 0,
            pageNo: 1
          }
        }).then(data => {
          let res = data.data
          this.isloding = true
          this.showLoad(false)
          if (res.status == 1) {
            if (this.rendarrTemp.isCrossBorder == 1) {
              this.idNumber = this.goodsInfo.idNumber || res.data[0].idNumber || ''
            }
            this.$set(this.$data, 'addresslist', res.data[0])
            this.addressNo = this.addresslist.addressNo
            this.checkArea(this.addressNo)
          } else if (res.status == "11") {
            this.showToast({msg: '当前暂无收货地址，请先填写收货地址'})
          }
        })
      },
      querySxtCard () {
        // 查询水象通
        const { uid, token } = this.userInfo
        this.$post({
          url: this.$store.state.api.querySxtCount,
          data: {
            uid,
            token
          }
        }).then(data => {
          let res = data.data
          if (res.status == "1") {
            this.$set(this.$data, 'usableSxtCount', res.data.usableSxtCount)
          } else {}
        })
      },
      myCouponShow () {
        const { uid, token, mobile } = this.userInfo
        const productData = []
        this.rendarrTemp.userChooseGoods.map(({ quantity, qualityProduct, fromNo }, index) => {
          productData.push({
            quantity,
            productNo: qualityProduct.productNo,
            fromNo: fromNo,
            fromType: fromNo?'2':'1'
          })
        })
        this.$post({
          url: this.$store.state.api.QueryNotUseRedBag,
          data: {
            uid,
            token,
            mobile,
            // 商品数据
            productData: JSON.stringify(productData)
          }
        }).then(data => {
          let res = data.data
          if (res.status == "1") {
            res.data.forEach((item) => {
              item.isshowRuleDesc = false
            })
            this.radJsons = res.data
            if (res.data.length>0) {
              if (this.goodsInfo.upPage != 'redpacket') {
                this.redBagValue = (+res.data[0].parValue)
                let radJsondata = {
                  redBagId: res.data[0].id,
                  redBagValue: (+res.data[0].parValue),
                  radname: res.data[0].showName
                }
                this.updateGoodsInfo(radJsondata)
              }
              this.$set(this.$data, 'coupflg', '1')
            } else {
              this.$set(this.$data, 'coupflg', '0')
            }
            this.updateGoodsInfo({radJsons: this.radJsons})
            this.getAmount()
          }
        })
      },
      checkArea (addressNo) {
        const { uid, token } = this.userInfo
        const productData = []
        let that = this
        this.rendarrTemp.userChooseGoods.map(({ quantity, qualityProduct, fromNo }, index) => {
          productData.push({
            quantity,
            // productNo: 'sxyp1551684720120',
            productNo: qualityProduct.productNo,
            fromNo: fromNo,
            fromType: fromNo?'2':'1'
          })
        })
        this.$post({
          url: this.$store.state.api.CheckArea,
          data: {
            uid,
            token,
            addressNo: addressNo,
            // 商品数据
            productData: JSON.stringify(productData)
          }
        }).then(data => {
          let res=data.data
          if (res.status==1) {
            this.$set(this.$data, 'areaError', false)
          } else {
            this.$set(this.$data, 'areaError', true)
            this.$set(this.$data, 'areaErrorInfo', res)
            let errNum=0
            let errNoArr=[]
            let errArr=[]
            // 获取不符合得number,并计数
            res.data.forEach(function (val, index) {
              if (val.errorCode=='9000') {
                errNum++
                errNoArr.push(val.productNo)
              }
            })
            let userGoods = that.rendarrTemp.userChooseGoods
            userGoods.map((val, idx) => {
              errNoArr.map((_item, _index) => {
                if (val.qualityProduct.productNo == _item) {
                  errArr.push(val)
                }
              })
            })
            that.$set(this.$data, 'errProArr', errArr)
            // 全部商品配货不符合则不显示弹框
            if (errNum==productData.length) {
              that.$set(this.$data, 'errorPro', false)
              document.body.style.overflow='visible'
              document.body.style.height='auto'
            } else {
              that.$set(this.$data, 'errorPro', true)
            }
          }
        })
      },
      // 保存虚拟商品订单
      addOrderAboutVirtual (e) {
        this.showLoad(true)
        const { qualityProduct } = this.rendarrTemp.userChooseGoods[0]
        this.fromChannel = this.$store.state.config.fromChannel
        let { redBagId, redBagValue, notEmpty, mobile } = this.goodsInfo
        let datas = {
          uid: this.userInfo.uid,
          token: this.userInfo.token,
          redBagValue: redBagValue || '',    // 红包金额
          redBagId: redBagId || '',          // 红包id
          orderChannel: this.fromChannel || 'h5dd',         // 下单来源
          productType: notEmpty || '',                    // 商品类型
          mobile,            // 充值手机号
          productNo: qualityProduct.productNo,              // 商品编号
          productImage: qualityProduct.mainImagePath,
          productPrice: qualityProduct.price
        }
        let apiUrl = notEmpty == 103 ? this.$store.state.api.VirtualCardOrderAdd : this.$store.state.api.virtualorderadd
        this.$post({
          url: apiUrl,
          data: datas
        }).then(data => {
          let res = data.data
          this.showLoad(false)
          if (res.status === "1") {
            // 微信支付
            this.weChat(res.orderId)
          } else if (res.status === "38") {
            let _t = this
            this.showDialog({
              msg: res.statusDetail,
              rBtnText: '去逛逛',
              lBtnText: '取消',
              confCallBack () {
                // _t.$router.push('/')
                if (_t.$store.state.config.fromChannel == 'sxypApp') {
                  app.goIndex()
                } else {
                  _t.$router.push('/')
                }
              }
            })
          } else {
            this.showToast({msg: res.statusDetail})
          }
        })
      },
      // 校验必填信息
      addOrder () {
        if (this.addressNo == '' && !this.goodsInfo.notEmpty) {
          this.showToast({msg: '请添加收货地址'})
          return false
        }
        const { invoiceType, invoiceTitle, invoiceUnit, email, taxpayerNumber } = this.$data.rendarrTemp
        // 检查发票信息
       /**
        * invoiceType 0: 不开发票 1: 开发票
        * invoiceTitle 1: 个人 2: 公司
        */
        if (invoiceType) {
          // 公司
          if (invoiceTitle == 2) {
            if (!(invoiceUnit && invoiceUnit.trim())) {
              this.showToast({
                msg: '请填写发票抬头'
              })
              return false
            }
            if (!(email && email.trim())) {
              this.showToast({
                msg: '请填写收票人邮箱'
              })
              return false
            } else if (!(/^\w[\w.+]*@([A-Za-z0-9][A-Za-z0-9]+\.)+[A-Za-z]{2,14}/.test(email))) {
              this.showToast({
                msg: '请填写正确的收票人邮箱'
              })
              return false
            }
            if (!(taxpayerNumber && taxpayerNumber.trim())) {
              this.showToast({
                msg: '请填写纳税人识别号'
              })
              return false
            }
          } else {
            // 个人
            if (!(email && email.trim())) {
              this.showToast({
                msg: '请填写收票人邮箱'
              })
              return false
            } else if (!(/^\w[\w.+]*@([A-Za-z0-9][A-Za-z0-9]+\.)+[A-Za-z]{2,14}/.test(email))) {
              this.showToast({
                msg: '请填写正确的收票人邮箱'
              })
              return false
            }
          }
        }
        return true
      },
      payAddorder (type) {
        const { invoiceType, invoiceContent, invoiceTitle, invoiceUnit, email, taxpayerNumber } = this.$data.rendarrTemp
        const productData = []
        const presetProperties = sensors.getPresetProperties() // 获取预置属性
        const distinct_id = sensors.store.getDistinctId() // 获取匿名id
        this.rendarrTemp.userChooseGoods.map(({ quantity, qualityProduct, remark, fromNo, starNo }, index) => {
          productData.push({
            quantity,
            price: qualityProduct.price,
            productNo: qualityProduct.productNo,
            fromNo: fromNo || '',
            leaveMessage: remark,
            starNo: starNo
          })
        })
        // 模块来源
        let moduleSource = this.goodsInfo.fromPage
        switch (moduleSource) {
          case "Detail":
            moduleSource = '商品详情'
            break
          case "ShopCart":
            moduleSource = '购物车'
            break
          default:
            moduleSource = '订单列表'
        }
        let invoice = null // 单独处理发票
        if (invoiceTitle == '1') {
          invoice = {
            invoiceType,
            email: email && email.trim()
          }
        } else if (invoiceTitle == '2') {
          invoice = {
            invoiceUnit: invoiceUnit && invoiceUnit.trim(),
            invoiceContent: invoiceContent && invoiceContent.trim(),
            invoiceTitle,
            invoiceType,
            email: email && email.trim(),
            taxpayerNumber: taxpayerNumber?(taxpayerNumber.trim()): ''
          }
        }
        // 埋点数据
        let buryingPointObj = {
          moduleSource,
          invoice: invoiceType == undefined || invoiceType == 0 ? '' : JSON.stringify(invoice),
          receiverIdcard: this.idNumber || ''
        }
        // 平台类型
        let platform_type = 'H5'
        if (this.$store.state.config.fromChannel == 'sxypApp') {
          platform_type = this.$store.state.config.Plat
        }
        // 合伙人等级（初级、中级）
        let partnershipLevel = this.$store.state.userInfo.memberLevel || ''
        switch (partnershipLevel) {
          case "1":
            partnershipLevel = '初级'
            break
          case "2":
            partnershipLevel = '中级'
            break
          default:
            partnershipLevel = ''
        }
        let publicAttribute = { // 公共属性
          platform_type: platform_type,
          partnerOrNot: partnershipLevel != '',
          partnershipLevel
        }
        // 预置属性合并
        let buryingPointData = Object.assign(publicAttribute, presetProperties, buryingPointObj)
        console.log(buryingPointData)
        this.fromChannel = this.$store.state.config.fromChannel
        let { redBagId, redBagValue } = this.goodsInfo
        // 优惠金额
        let discountAmount = (Number(this.discountAmount) + Number(redBagValue)).toFixed(2)
        // 应付金额
        let totalAmount = (Number(this.totalPrice) - Number(redBagValue)).toFixed(2)
        let datas = {
          uid: this.userInfo.uid,
          token: this.userInfo.token,
          frompage: this.$store.state.route.from.name == "ShopCart" || window.sessionStorage.getItem('fromPage') ? 2: 1,
          addressNo: this.addressNo,                        // 地址id
          // 商品数据
          productData: JSON.stringify(productData),
          // 发票信息
          invoiceData: JSON.stringify({
            invoiceUnit: invoiceUnit && invoiceUnit.trim(),
            invoiceContent: invoiceContent && invoiceContent.trim(),
            invoiceTitle,
            invoiceType,
            email: email && email.trim(),
            taxpayerNumber: taxpayerNumber?(taxpayerNumber.trim()): ''
          }),
          redBagId: redBagId || '',          // 红包id
          orderChannel: this.fromChannel,         // 下单来源
          properties: JSON.stringify(buryingPointData), // 预置属性
          distinctId: distinct_id, // 匿名id
          discountAmount: discountAmount,
          totalAmount: totalAmount
        }
        // let urlType = this.goodsInfo.notEmpty? this.$store.state.api.qualityvirtualorderadd : this.$store.state.api.NewOrderAdd
        if (type) {
          this.$post({
            url: this.$store.state.api.NewOrderAdd,
            data: datas
          }).then(data => {
            let res = data.data
            this.showLoad(false)
            if (res.status == "1") {
              // 调起微信支付
              this.weChat(res.data.orderId)
            } else if (res.status === "38") {
              let _t = this
              this.showDialog({
                msg: res.statusDetail,
                rBtnText: '去逛逛',
                lBtnText: '取消',
                confCallBack () {
                  // _t.$router.push('/')
                  if (_t.$store.state.config.fromChannel == 'sxypApp') {
                    app.goIndex()
                  } else {
                    _t.$router.push('/')
                  }
                }
              })
            } else if (res.status == '24') {
              this.addOverFlow()
              let hashGoodsInfo = {}
              // 重构接口返回的数据
              this.rendarrTemp.userChooseGoods.map((_item, index) => {
                hashGoodsInfo[_item.qualityProduct.productNo] = _item
              })
              res.data.errorData.map((val, idx) => {
                const {price, mainImagePath, productName} = hashGoodsInfo[val.productNo]['qualityProduct']
                val = {
                  ...val,
                  newPrice: price,
                  mainImagePath,
                  productName
                }
                res.data.errorData[idx] = val
              })
              this.errorlist = res.data.errorData
              this.newPeopleActivityNo = res.data.newPeopleActivityNo
              this.isShowChangeBox = true
            } else {
              this.showToast({msg: res.statusMessage})
            }
          })
        }
      },
      hideLayer () {
        this.$set(this.$data, 'layerFlag', false)
        document.body.style.overflow='visible'
        document.body.style.height='auto'
      },
      goShop () {
        this.$set(this.$data, 'layerFlag', false)
        this.$router.push('/shopCart')
      },
      // 确认订单
      confirmorder (e) {
        if (!this.areaError) {
          this.$set(this.$data, 'layerFlag', false)
        // 校验元素
          if (!this.addOrder()) return false
        // 虚拟商品订单
          if (this.goodsInfo.notEmpty) {
            this.addOrderAboutVirtual(e)
          } else {
          // 实物商品
            // 校验跨境商品是否实名
            if (this.rendarrTemp.isCrossBorder == 1) {
            // 是跨境商品且未实名
              if (!this.idNumber) {
              // 判断是否填写身份证号
                this.showToast({
                  msg: '因海关需要，请填写收货人身份证号'
                })
                return false
              }
              if (this.idNumber.length != 18) {
                this.showToast({
                  msg: '身份证号应为数字或字母X组成的18位字符'
                })
                return false
              }
            // 校验身份证号码
              this.showLoad(true)
              let {uid, token} = this.$store.state.userInfo
              let {consignee, addressNo} = this.addresslist
              this.$post({
                url: this.$store.state.api.checkIdNumber,
                data: {
                  uid,
                  token,
                  consignee,
                  addressNo,
                  idNumber: this.idNumber
                }
              }).then(data => {
                let res = data.data
                if (res.status == "1") {
                  this.pay(e)
                } else {
                  this.showLoad(false)
                  this.showToast({
                    msg: res.statusMessage
                  })
                }
              })
            } else {
              this.pay()
            }
          }
        } else {
          this.$set(this.$data, 'layerFlag', true)
          if (!this.errorPro) {
            this.$set(this.$data, 'errflag', true)
            setTimeout(() => {
              this.$set(this.$data, 'errflag', false)
            }, 2000)
            this.showToast({msg: this.areaErrorInfo.statusMessage})
            document.body.style.overflow='visible'
            document.body.style.height='auto'
          } else {
            this.$set(this.$data, 'errflag', false)
            document.body.style.overflow='hidden'
            document.body.style.height='100%'
          }
        }
      },
      pay () {
        this.rendarrTemp.addressNo = this.addressNo
                // 实物订单
        if (this.usableSxtCount > 0 && this.goodsInfo.checkList && this.goodsInfo.checkList.length>0) {
                  // 有水象通的卡且选择使用
          this.sxtPrePay()
        } else {
          this.showLoad(true)
          this.payAddorder('1')
        }
      },
      // 显示发票选项
      chooseInvoice () {
        // 跨境商品不支持开发票
        this.isShowInvoice = !this.isShowInvoice
      },
      // 选择发票
      invoiceClick (invoiceTitle) {
        this.rendarrTemp.invoiceTitle = invoiceTitle
        if (invoiceTitle === '') {
          this.rendarrTemp.invoiceType = 0
        } else {
          this.rendarrTemp.invoiceType = 1
        }
        this.chooseInvoice()
      },
      closePwd () {
        this.$data.isShowPw = false
      },
      pwdSuccess (password) {
        // 短信验证码输入成功
        // 水象通支付
        this.sxtPay(password)
      },
      getSettleIncome () {
        let {uid, token} = this.$store.state.userInfo
        let { redBagId } = this.goodsInfo
        const productData = []
        this.rendarrTemp.userChooseGoods.map(({ quantity, qualityProduct, remark, fromNo, starNo }, index) => {
          productData.push({
            quantity,
            price: qualityProduct.price,
            productNo: qualityProduct.productNo,
            fromNo: fromNo,
            leaveMessage: remark,
            starNo: starNo
          })
        })
        this.$post({
          url: this.$store.state.api.getSettleIncome,
          data: {
            uid,
            token,
            productData: JSON.stringify(productData),
            redBagId: redBagId
          }
        }).then(({data: res}) => {
          console.log("预估返利："+res.data)
          if (res.status == 1) {
            this.rebate = +(res.data)
          }
        })
      }
    }
  }
</script>
<style media="screen" lang="scss" scoped>
  @import "../../assets/scss/app";
  .rebatePrice{
    @include px2rem(margin-left, 24);
  }
  .content-offset{
    border-top: none;
  }
  .confirm_order{
    // margin-top: -1px;
    @include px2rem(padding,20 0 120);
  }
  .haveWarn{
    @include px2rem(padding-top,52);
  }
  #confirm_btn{
    position: inherit;
    margin-bottom:0.45333rem;
  }
  .info_p .l_b{
    width: auto;
    color: $color444;
  }
  .info_p .info_p_text{
    color: #999;
    @include font-dpr(24);
  }
  .info_p_text_l{
    @include px2rem(padding-left, 8);
    em{
      color: $redColor;
    }
  }
  .product_box{
    @include px2rem(padding,0 24);
    @include px2rem(margin-bottom, 40);
    border: none;
    .good-name-line-h{
      color: $color444;
      @include px2rem(line-height, 40);
      @include px2rem(height, 40);
      @include px2rem(margin-bottom, 8);
      width: auto;
      &.crossBorder_goods{
        background: url('../../assets/icon/icon/quqiu.png') left 0.09333rem no-repeat;
        @include px2rem(background-size, 88 26);
        @include px2rem(text-indent, 96);
      }
    }
  }
  .remarks_p{
    // border-top: 1px solid $borderColor;
    @include px2rem(height, 33);
    @include px2rem(line-height, 33);
    @include px2rem(margin-bottom, 24);
    border-bottom: none;
    @include font-dpr(24);
    padding-left: .26667rem !important;
    padding-left: .26667rem !important;
  }
  .goods-info-wrap{
    background: #fff;
    @include px2rem(padding,24 0);
    @include px2rem(margin-left, 24);
    @include px2rem(margin-right, 24);
    @include px2rem(margin-bottom, 20);
    @include px2rem(border-radius, 8);
    overflow: hidden;
  }
  .confirmorder_box{
    @include px2rem(line-height,40);
    @include px2rem(margin, 0 24);
    overflow: hidden;
    .areaError{
      float: left;
    }
    .info_p{
      padding: 0;
      span, b{
        font-weight:600;
      }
    }
    .info_p_right{
      float: right;
    }
    .info_p_left{
      float: left;
      color:#FD455F;
      @include font-dpr(20);
    }
  }
  .is7ToReturns{
      @include px2rem(padding-left, 40);
      @include font-dpr(24);
      color: $mainColor;
      line-height: 2;
      background: url("../../assets/icon/icon/order_reason_icon3x.png") no-repeat left center;
      @include px2rem(background-size, 30 30);
      font-weight: bold;
    }
  .font32{@include font-dpr(32);}
  .sj_p{
    width: 100%;
    -webkit-box-orient: vertical;
    font-size: 0;
    .jg_box{
      @include font-dpr(30);
    }
  }
  .del_box{
    padding: 0.05rem 0 0 0.1rem;
  }
  .address_a{
    @include px2rem(padding-right, 60);
    background: url("../../assets/icon/icon/return_r.png") no-repeat;
    background-position: 96% center;
    @include px2rem(background-size,22 22);
    @include px2rem(padding-left, 74);
    position: relative;
    &::before{
      content: '';
      position: absolute;
      @include wh(30, 40);
      background: url("../../assets/icon/icon/address-icon.png") left center no-repeat;
      @include px2rem(background-size, 30 40);
      @include px2rem(left, 20);
      top: 0;
      bottom: 0;
      margin: auto;
    }
  }
  .order_info{
    // padding-bottom: 1.3333rem;
    @include px2rem(padding, 24 0 0);
    @include px2rem(margin, 0 24);
    @include px2rem(border-radius, 8);
    overflow: hidden;
    border: none;
    .info_p{
      border: none;
      background: #ffffff;
      // @include px2rem(margin-bottom, 16);
    }
    .lh_40{
      overflow: hidden;
      @include lh(40, 40);
      @include px2rem(margin-bottom, 40);
    }
  }
  .info_p{
    @include px2rem(padding, 0 24);
  }
  .addorder_box{
    width: 100%;
    @include px2rem(line-height,90);
    // border-top: 1px solid $borderColor;
    position: fixed;
    bottom: 0;
    background: #ffffff;
  }
  .money_txt{
    // border-top: 1px solid $borderColor;
    @include px2rem(padding-left, 24);
  }
  .confirmorder_btn{
     @include px2rem(width, 208);
     background: $mainColor;
     text-align: center;
     @include font-dpr(36);
     color: #ffffff;
  }
  .invoiceMask{
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 9999;
    background: #000000;
    opacity: 0.3;
    filter:alpha(opacity=30);
  }
  .invoiceBox{
    width: 100%;
    background: #ffffff;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 9999;
  }
  .invoiceBox li{
    width: 100%;
    @include px2rem(height, 97);
    @include font-dpr(28);
    @include px2rem(line-height, 98);
    text-align: center;
    color: #222333;
    border-bottom: 1px solid  $borderColor;
  }
  .invoiceBox li:last-child{
    @include px2rem(height, 97);
    border-bottom: 1px solid  #ffffff;
  }
  .info_p input{
    border: none;
  }
  .person_invoice{
    // display: none;
  }
  .company_invoice .company_sec{
    @include px2rem(margin-bottom, 40);
  }
  .order_info .border_bottom{
    border-bottom: 1px solid $borderColor;
  }
  .company_invoice{
    // display: none;
  }
  .invoice_notice{
    display: block;
    @include px2rem(height, 68);
    @include px2rem(line-height, 68);
    @include font-dpr(24);
    color: #FAA61A;
    @include px2rem(padding-left, 30);
    background: #FFF8E8;
  }
  .order_info{
      // @include px2rem(margin-bottom, 16);
    }
  // 发票信息
  .invoice-info-wrap{
    .lh_40:last-child{
      @include px2rem(margin-bottom, 24);
    }
    // @include px2rem(padding-bottom, 60);
  }
  .padd_20{
    padding-bottom: 1.1rem !important;
  }
  // .con_jdprice{
  //   color: #999;
  //   @include font-dpr(28);
  // }
  .user-info-name{
    @include font-dpr(30);
    @include px2rem(padding, 24 0 18 0);
    .user-info-consignee{
      color: $color444;
      @include px2rem(margin-right, 24);
    }
    span{
      font-weight: 500;
    }
  }
  .user-info-addres {
    color: $color444;
    @include font-dpr(24);
    @include px2rem(padding, 0 67 24 0);
  }
.goods-change-dialog{
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background: rgba(0,0,0, .3);
  z-index: 9999;
  .goods-change-list-info{
    width:92%;
    position: fixed;
    left: 4%;
    bottom: .4rem;
    background: #fff;
    border-radius: .1333rem;
    padding-bottom: 1.3067rem;
    overflow: hidden;
    ul {
      -webkit-overflow-scrolling: touch;
      min-height: 2.0267rem;
      overflow-y: scroll;
      max-height: 4.0533rem;
    }
    li {
      padding: 0 .4rem;
      margin: .3867rem;
      &:after{
        content: "";
        clear: both;
        display: block;
      }
    }
    img {
      width: 2.4rem;
      height: 2.4rem;
      float: left;
      margin-right: .2667rem;
    }
    .goods-info-title{
      @include font-dpr(28);
      color: #222333;
      padding-top: .2667rem;
          height: 1.06667rem;
    line-height: 0.56rem;
        overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    }
    .goods-info-price{
      @include font-dpr(24);
      color: #999999;
      padding-top: .2667rem;
    }
    .price-bold{
      color: #C43A37;
    }
  }
  .goods-list-title{
    font-weight: bold;
    color: $color333;
    @include font-dpr(30);
    text-align: center;
    line-height: 1.0667rem;
    padding-top: .2667rem;
  }
  .back-shop-cart{
    display: block;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 1.3067rem;
    background: #FAFAFA;
    text-align: center;
    line-height: 1.3067rem;
    @include font-dpr(30);
    color: $mainColor;
    border-top: 1px solid $borderColor;
  }
}
.texearea_txt{
  @include px2rem(height, 33);
  @include px2rem(line-height, 33);
  width: 100%;
  border: none;
  @include font-dpr(24);
  @include px2rem(margin-left, 16);
  color: $color444;
  resize: none;
}
.product_box dt p.fSpu{
    @include px2rem(height, 26);
    line-height: 1;
    @include px2rem(margin-bottom, 8);
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    width: 100%;
  }
  .goods-info-wrap{
    dt {
      max-width: calc(100% - 2.42667rem);
      overflow: hidden;
    }
  }
  .card_info{
    background: #fff;
    @include px2rem(margin-bottom, 16);
    @include px2rem(margin-left, 24);
    @include px2rem(margin-right, 24);
    @include px2rem(border-radius, 8);
    border: none;
    .card_l{
      @include px2rem(padding-right, 16);
    }
  }
  .wePay_box{
    background: #fff;
    border: none;
    @include px2rem(margin-top, 20);
    @include px2rem(margin-left, 24);
    @include px2rem(margin-right, 24);
    @include px2rem(padding, 0 84 0 24);
    background: #ffffff url("../../assets/icon/icon/weixinzhifu.png") right 0.32rem center no-repeat;
    @include px2rem(background-size, 40 38);
    @include px2rem(border-radius, 8);
  }
  .idNumber_input{
    width: 100%;
    height: 100%;
    border: none;
  }
  .areaWarn{
    position: fixed;
    width: 100%;
    @include px2rem(height, 52);
    background-color: #FFEBEB;
    @include font-dpr(20);
    color: #FD455F;
    @include px2rem(padding, 12 24 12 24);
    box-sizing: border-box;
    z-index: 99;
  }
  @keyframes errani{
    0%   {background:0px#FFEBEB;color:#FD455F}
    50%  {background:red;color:#fff}
    100% {background:#FFEBEB;color: #FD455F}
  }
  .errClass{
    animation: errani 1s linear infinite;
  }
  .areaLayer{
    position:fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top:0;
    z-index: 1000;
    background: rgba(0,0,0,.7)
  }
  .areaLayerInner{
    position: absolute;
    @include px2rem(width, 580);
    @include px2rem(height, 770);
    left: 50%;
    top: 50%;
    @include px2rem(margin-top, -385);
    @include px2rem(margin-left, -290);
    @include px2rem(border-radius, 12);
    @include px2rem(padding, 0 40 40 40);
    box-sizing: border-box;
    background: #fff;
    .info_title{
      @include font-dpr(30);
      color:#444;
      text-align: center;
      @include px2rem(padding, 32 0 32 0);
    }
    .area_warn{
       @include font-dpr(26);
       color:#999;
       @include px2rem(line-height, 37);
       @include px2rem(margin-bottom, 37);
    }
    ul{
      width: 100%;
      @include px2rem(height, 400);
      overflow-y:scroll;
      li{
        width:100%;
        @include px2rem(height, 120);
        @include px2rem(margin-bottom, 20);
        overflow: hidden;
        img{
          display: block;
          float: left;
          @include px2rem(height, 120);
          @include px2rem(width, 120);
        }
        .info_right{
          float: left;
          @include px2rem(margin-left, 20);
          @include px2rem(width, 360);
          height:100%;
          @include px2rem(padding-bottom, 9);
          position:relative;
          p{
            display: -webkit-box;
            -webkit-box-orient: vertical;
            text-overflow: ellipsis;
            overflow: hidden;
            -webkit-line-clamp: 2;
          }
          .info_price{
            position:absolute;
            @include px2rem(bottom, 9);
            color:#FF5A60
          }
        }
      }
    }
    .bom_btn{
      position:absolute;
      @include px2rem(bottom, 40);
      span{
        display: inline-block;
        @include font-dpr(30);
        @include px2rem(height, 78);
        @include px2rem(width, 240);
        @include px2rem(border-radius, 78);
        text-align: center;
        @include px2rem(line-height, 78);
        color:#999;
        border:1px solid rgba(219,219,219,1);
        background:#fff;
      }
      .bom_btn_acti{
        border:none;
        background: #FD455F;
        color:#fff;
      }
    }
  }
</style>
