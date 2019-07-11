<template>
  <section id="cashierContainer" class="cashier_wrap" v-if="isLoding">
    <p class="ddje_cashier flex noborder"> <b class="cell_1">订单金额</b> <span class="cell_1 money_cashier c_red font32">{{nextData.actualAmount}}元<br><b class="fwr_p" v-if="nextData.filmServiceFee&&nextData.filmServiceFee>0">(包含服务费{{nextData.filmServiceFee}}元)</b></span></p>
    <p class="info_p flex zffs_info"> <b class="cell_0">支付方式</b> </p>
    <div class="pay_road" :class="bankNo == 0?'bank_wrap':''">
      <div>
        <!-- v-if="bankNo == 1" -->
      <!--显示银行卡信息s-->
      <div class="bankNew_wrap flex" @click="inPayment('0')">
        <div class="cell_1 bankDetail justify-center vertical">
          <p class="bank_card font28" v-if="bankNo == 1">{{bankList.bankName}}({{bankList.bankCardNum.slice(bankList.bankCardNum.length-4)}})</p>
          <p class="bank_card font28" v-else>银行卡支付</p>
        </div>
        <div class="cell_0 radio_item justify-center vertical" >
          <input type="radio" class="agree" :checked="type==0" name="radioContent" >
        </div>
      </div>
      <!--显示银行卡信息e-->
      <!-- 微信支付s -->
      <Weixinpay :type="type" @weChat="weChat" v-if="isWeixin || ($store.state.config.fromChannel == 'sxypApp' && +($store.state.config.ver.replace(/\./g, '')) > 150)"></Weixinpay>
      <!-- 微信支付e -->
      <!--显示分期信息s-->
      <div class="byStages_wrap flex" v-show="nextData.moreOrder != 1 && $store.state.switchInfo.cashierFenqiInstalment == 1" @click="inPayment('1')">
        <!-- <div class="cell_0 bankIcon justify-center vertical">
          <img src="../../assets/icon/icon/money_staging_icon@3x.png" />
        </div> -->
        <div class="cell_1 bankDetail justify-center vertical">
          <p class="bank_card font28">分期付款</p>
          <p class="bank_name c_999">可用额度 {{nextData.userUsableLine || '0'}}元</p>
        </div>
        <div class="cell_0 radio_item justify-center vertical" >
          <input type="radio" class="agree" :checked="type==1" name="radioContent" ref="stagePay">
        </div>
      </div>
      <div class="ratio_select font28 flex" v-if="ratesList.length>0 && isShowDetail && byStagesDetail.length>0">
        <label class="cell_1 sf_rates">首付比例</label>
        <select class="cell_0 rates_num" v-model="rates" @change="byStages">
          <option v-for="item in ratesList" :key="item" :value="item" v-if="item!=100">{{item==0?'0首付':item+'%'}}</option>
        </select>
      </div>
      <!--显示分期信息e-->
      <ByStagesDetail v-if="isShowDetail" :byStagesDetail="byStagesDetail" :isChecked="isChecked" @byData="byDatas"></ByStagesDetail>
      </div>
        <!-- <router-link to="addbankcard" tag="span" class="add_bank c_999" v-else>同步银行卡</router-link> -->
      <!-- <span @click="goBnak" class="add_bank c_999" v-else> 同步银行卡</span> -->
    </div>
    <div class="btn_wrap_cashier">
       <a class="confirm_btn hui" href="javascript:;" v-if="(type==1&&this.byStagesDetail.length==0)" id="hui">确认支付</a>
      <a class="confirm_btn" href="javascript:;" v-else @click="goPayment()">{{type==1?'我已同意相关协议并确认支付':'确认支付'}}</a>
    </div>
    <Authpay></Authpay>
    <!--设置账单日s-->
    <Conbill v-if="billfig && billfig== '0'" @billfig="setBill"></Conbill>
    <!--设置账单日e-->
    <!-- 设置交易密码 s-->
    <!-- v-if="isShowPw" -->
    <pwdBox @pwdSuccess="pwdSuccess" @closePwd="closePwd" :code="'4'" :monthnum="this.month" :rates="this.rates" v-if="isShowPw"></pwdBox>
    <!-- 设置交易密码 e-->
  </section>
</template>
<script>
  import Conbill from './Conbill'
  import ByStagesDetail from './ByStagesDetail'
  import Authpay from 'components/shopping/cashierFloor/Authpay'
  import Weixinpay from 'components/shopping/cashierFloor/Weixinpay'
  import pwdBox from 'components/common/pwdBox'
  import mixin from 'components/detail/mixin'
  import shoppingmixin from 'components/shopping/mixin'
  import { app, is_weixn, is_iphone } from 'lib/until'
  export default {
    mixins: [mixin, shoppingmixin],
    data () {
      return {
        nextData: '',
        byStagesDetail: [],
        // byStagesDetail422: [],
        productPrice: '',
        productName: '',
        bankList: '',
        bankNo: 0,
        flg: 0,
        billDate: '',
        billfig: '1',
        isShowDetail: false,
        isChecked: false,
        month: '',
        type: this.$store.state.route.query.redirecUrl || (this.$store.state.config.fromChannel == 'sxypApp' && +(this.$store.state.config.ver.replace(/\./g, '')) > 150) ? '3' : '0', // 判断是否是微信授权之后的页面 或者客户端
        isShowPw: false,
        // isShowzc: false,
        firstTime2OrderList: true,
        isShowdialog: false,
        // dialogInfos: {},
        payType: '',
        isLoding: false,
        ratesList: [],
        isWeixin: is_weixn(),
        rates: window.sessionStorage.getItem('rates') || 0 // 首付比例
      }
    },
    beforeRouteLeave (to, from, next) {
      console.log('离开')
      let _t = this
      if (to.name == 'ProtocolList') {
        // 去到合同页，记录首付比例
        window.sessionStorage.setItem('rates', this.rates)
      } else {
        window.sessionStorage.removeItem('rates')
      }
      if (to.name == 'Addbankcard' || to.name == 'PayDown' || to.name == 'Paysucces' || to.name == 'ProtocolList' || to.name == 'Sqwts') {
        next()
        // return false
      } else {
        if (this.firstTime2OrderList) {
          next(false)
          this.showDialog({
            title: '确定要离开吗?',
            msg: '超过支付时效后订单将被取消，请尽快支付',
            rBtnText: '继续支付',
            lBtnText: '确认离开',
            cancelBack: () => {
              _t.firstTime2OrderList = false
              _t.flg = 1
              let orderIndex = _t.$store.state.route.query.orderIndex
              if (orderIndex) {
                window.sessionStorage.setItem('orderIndex', orderIndex)
              }
              if (this.$store.state.route.from.name === 'OrderList' || this.$store.state.route.from.name === 'OrderDetail' || this.$store.state.route.from.name === 'MovieOrderdetail') {
                this.$router.go(-1)
              } else {
                if (this.$store.state.config.fromChannel == 'sxypApp') {
                  console.log('客户端')
                  app.goIndex()
                } else {
                  _t.$router.push('/')
                  // window.location.href = process.env.SXYPNAME + '/index.html#/'
                }
              }
            }
          })
        } else {
          next()
        }
      }
      // if (to.name == 'OrderList') {
      //   next(true)
      // }
    },
    created () {
      if (this.$store.state.userInfo.userId) {
        this.cashierType()
      }
    },
    watch: {
      // 监听调用登录方法成功以后，userId改变，需要重新渲染该页面
      "$store.state.userInfo.userId": function (newVal, oldVal) {
        if (newVal && this.$store.state.config.fromChannel == 'sxypApp') {
          this.cashierType()
        }
      }
    },
    components: {
      Conbill,
      ByStagesDetail,
      pwdBox,
      Authpay,
      Weixinpay
    },
    methods: {
      cashierType () {
        this.cashierTem()
        .then(() => {
          // 微信授权页面返回
          if (this.$store.state.route.query.redirecUrl) {
            // 后台保存微信授权code
            this.wechatSaveUserinfo()
          }
          // 从协议列表回退到该页面的时候，默认选中分期付款
          if (this.$store.state.route.from.name == "ProtocolList") {
            this.isChecked = true
            this.inPayment('1')
          }
        })
      },
      weChat () {
        // 微信支付
        this.inPayment('3')
      },
      confirm (url) {
        if (url && url != '') {
          if (this.$refs.checkoutBox.checked) {
            this.isShowdialog = false
            window.location.href = url
          } else {
            this.showToast({ msg: "请您先查看并同意《授权委托书》" })
          }
        } else {
          this.isShowdialog = false
        }
      },
      setBill (val) {
        this.billfig = val.billfig
        this.billDate = val.billDate
        this.$set(this.$data, 'billfig', this.billfig)
        this.$set(this.$data, 'billDate', this.billDate)
        this.inPayment('1')
      },
      byDatas (data) {
        if (data.payType) this.isChecked = !this.isChecked
        this.month = data.month
        this.payType = data.payType
      },
      byStages () {
        // 不同的首付比例显示不同的分期详情
        // 查询用户状态
        console.log('s')
        this.checkUserStatus(1)
      },
      inPayment (type) {
        // type 0银行卡付款（全额付款）1分期付款 3微信支付
        this.$set(this.$data, 'type', type)
        if (type == '1') {
          // 用户选择分期且没有账单日，提示设置账单日，一个用户只设置一次账单日
          if (!this.billDate) {
            this.$set(this.$data, 'billfig', '0')
            return false
          } else {
            this.$set(this.$data, 'billfig', '1')
          }
          // 查询用户状态
          this.checkUserStatus(1).then(() => {
            this.showRate()
            this.isShowDetail = true
            // this.$set(this.$data, 'dialogInfos', this.dialogInfos)
            this.month = this.byStagesDetail.length >= 1 ? this.byStagesDetail[this.byStagesDetail.length-1].month : ''
          })
        } else {
          this.isChecked = false
          this.isShowDetail = false
          if (this.nextData.fullpayment==0) {
            this.showToast({msg: '暂时只支持分期付款哦！'})
            return false
          }
        }
      },
      showRate () {
        // 查询首付比例
        // let { uid, token, userId } = this.$store.state.userInfo
        let uid = this.$store.state.userInfo.uid || window.sessionStorage.getItem('uid')
        let token = this.$store.state.userInfo.token || window.sessionStorage.getItem('token')
        let userId = this.$store.state.userInfo.userId || window.sessionStorage.getItem('userId')
        let orderId = this.$store.state.route.query.orderId
        return this.$post({
          url: this.$store.state.api.ShowRate,
          data: {
            uid,
            token,
            centerUserId: userId,
            orderId
          }
        }).then(data => {
          this.isLoding = true
          let res = data.data
          if (res.status === "1") {
            this.ratesList = res.data
          } else {
//            this.updateToast({msg: res.statusDetail})
          }
        })
      },
      cashierTem () {
        this.showLoad(true)
        // 订单详情查询
        let { uid, token, userId } = this.$store.state.userInfo
        let orderId = this.$store.state.route.query.orderId
        window.sessionStorage.setItem('orderId', orderId)
        return this.$post({
          url: this.$store.state.api.ShowCashier,
          data: {
            uid,
            token,
            orderId,
            centerUserId: userId
          }
        }).then(data => {
          this.isLoding = true
          let res = data.data
          if (res.status === "1") {
            if (res.billDate != '') {
              this.billDate = res.billDate
            }
            this.$set(this.$data, 'nextData', res)
            return this.bankShow().then(() => {
              this.showLoad(false)
            })
          } else {
            this.showLoad(false)
//            this.updateToast({msg: res.statusDetail})
          }
        })
      },
      goPayment (e) {
        if (this.type == 0) {
          if (this.nextData.fullpayment==0) {
            this.showToast({msg: '暂时只支持分期付款哦！'})
            return false
          } else {
            // 没有银行卡，跳转到绑卡页面
            if (!this.bankNo) {
              this.$router.push({
                path: '/addbankcard',
                query: {
                  isAddbankcard: 1,
                  orderId: this.$store.state.route.query.orderId
                }
              })
              return false
            }
             // 银行卡付款【全额付款】不走额度查询
            this.paymenInfo(this.type)
          }
        } else if (this.type == 1) {
          // 点击按钮选中协议
          // this.isChecked = true
          // 分期付款必须选择已查看协议
          if (this.isChecked) {
            // 判断额度是否够用，是调取短信验证码
            this.quotaEnough()
          } else {
            this.showToast({msg: '请查看并同意相关协议'})
          }
        } else if (this.type == 3) {
          if (!is_iphone()) { this.showLoad(true) }
          // if (this.nextData.fullpayment==0) {
          //   this.showToast({msg: '暂时只支持分期付款哦！'})
          //   return false
          // } else {
          //   // 调取微信支付，判断是否授权
          //   this.wxPayment()
          // }
          // 调取微信支付，判断是否授权
          let {fromChannel, ver} = this.$store.state.config
          if (fromChannel == 'sxypApp' && +(ver.replace(/\./g, '')) > 150) {
            app.wxPay({
              orderId: this.$store.state.route.query.orderId
            })
            if (!is_iphone()) {
              setTimeout(() => {
                this.showLoad(false)
              }, 1000)
            }
          } else {
            this.wxPayment(this.$store.state.route.query.orderId)
          }
        }
      },
      // 关闭交易密码键盘
      closePwd () {
        this.$data.isShowPw = false
      },
       // 设置交易密码成功以后触发此函数
      pwdSuccess () {
        // 0首付跳转之前支付成功页面
        if (this.rates&&this.rates != 0) {
          // 支付首页
          this.$router.push({path: 'PayDown', query: {orderId: this.$store.state.route.query.orderId}})
        } else {
          // 不需要再支付首付
          window.sessionStorage.setItem('orderId', this.$store.state.route.query.orderId)
          this.$router.push({path: 'paysucces', query: {gift: 2}})
        }
      }
    }
  }
</script>
<style media="screen" lang="scss" scoped>
  @import "../../assets/scss/app";
  .ddje_cashier{
    background: #fff;
    @include px2rem(padding, 26 30);
    @include font-dpr(28);
    .fwr_p{
      color: $color333;
      @include font-dpr(24);
    }
  }
  .info_p{
    background: #ffffff;
  }
  .noborder{
    border: none;
  }
  .money_cashier{
    text-align: right;
    // font-weight: bold;
  }
  .pay_road{
    margin: 0;
    // @include px2rem(padding, 0 30);
  }
  .bank_wrap{
    border-top: none;
    @include px2rem(margin-top,16);
  }
  .bankIcon{
    display: flex;
    @include px2rem(width, 76);
    img{
      @include px2rem(width, 56);
      @include px2rem(height, 56);
    }
  }
  .bankDetail, .radio_item {
    display: flex;
    margin-bottom: 0;
  }
  .bankNew_wrap, .byStages_wrap,.ratio_select{
    @include px2rem(height, 120);
    @include px2rem(margin, 0 30);
  }
  .byStages_wrap{
    border-top: 1px solid $borderColor;
  }
  .ratio_select{
    border-top: 1px solid $borderColor;
    overflow: hidden;
    @include px2rem(line-height, 120);
  }
  .rates_num{
    appearance:none;
    -moz-appearance:none;
    -webkit-appearance:none;
    border: none;
    @include px2rem(padding, 0 20);
    @include px2rem(width, 120);
     background: url("../../assets/icon/icon/left.png") right center no-repeat;
     @include px2rem(background-size, 15 26);
     option{
       width: 100%;
       display: block;
      //  background: #ff0;
     }
  }
  .font32{@include font-dpr(32);}
  .font28{@include font-dpr(28);}
  .font24{@include font-dpr(24);}
  .zffs_info{
    border: none;
    @include px2rem(margin-top, 16);
  }
  .btn_wrap_cashier{
    position: fixed;
    // @include px2rem(padding, 30);
    background: $bgColor;
    bottom: 0;
    width: 100%;
    @include px2rem(height, 150);
  }
  .confirm_btn {
    position: inherit;
    @include px2rem(margin-top, 30);
    width: 92%;
    margin-left: 4%;
  }
  .agree{
      @include px2rem(width,31);
      @include px2rem(height,31);
      -webkit-appearance: none;
      -moz-appearance: none;
      vertical-align: middle;
      background: url("../../assets/icon/icon/money_noselected_icon@3x.png") no-repeat;
      background-size: 100%;
      border-radius: 50%;
      border: none;
    }
    .agree:checked{
      border: none;
      background: url("../../assets/icon/icon/money_selected_icon@3x.png") no-repeat;
      background-size: 100%;
      border-radius: 50%;
    }
    // .zcym_box{
    //   position: fixed;
    //   @include px2rem(margin, 0 30);
    //   z-index: 3;
    //   left: 0;
    //   right: 0;
    //   @include px2rem(bottom, 30);
    //   img{
    //     width: 86%;
    //     display: block;
    //     margin: 0 auto;
    //     @include px2rem(border-radius, 25);
    //   }
    //   .zcym_btn{
    //     width: 55%;
    //     position: absolute;
    //     @include px2rem(bottom, 30);
    //     @include px2rem(height, 86);
    //     margin-left: 22.5%;
    //   }
    // }
    // .bgblock{
    //   background: rgba(0,0,0,0.5);
    //   z-index: 2;
    // }
    .checkout_p{
      text-align: left;
      padding:0 0 0.26667rem 0.26667rem;
      .agree{
        margin-top: -3px;
      }
    }
    .sqwt_p{
      color: #C43A37;
    }
</style>
