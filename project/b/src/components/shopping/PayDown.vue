<template>
<section v-if="isLoding">
  <p class="to_pay_title font18">待支付首付：{{payDowndata.firstPayment}}元</p>
  <p class="orderId_p font14 c_999 tc">订单号：{{orderId}}</p>
  <div class="btnCom" @click="goPayment">支付首付</div>
  <div @click="goIndex()" class="btnCom white_btn">返回</div>
  <Authpay></Authpay>
</section>
</template>
<script>
import { mapActions } from 'vuex'
import { app, is_weixn } from 'lib/until'
import mixin from 'components/shopping/mixin'
import Authpay from 'components/shopping/cashierFloor/Authpay'
export default {
  mixins: [mixin],
  data () {
    return {
      orderId: this.$store.state.route.query.orderId || '',
      bankcardno: '',
      isLoding: false,
      payDowndata: ''
    }
  },
  components: {
    Authpay
  },
  created () {
    this.getDownPayment().then(() => {
      // 微信授权页面返回
      if (this.$store.state.route.query.redirecUrl) {
        // 后台保存微信授权code
        this.wechatSaveUserinfo()
      }
    })
  },
  methods: {
    ...mapActions([
      "updateUserInfo"
    ]),
    goIndex () {
      if (this.$store.state.config.fromChannel == 'sxypApp') {
        app.goIndex()
      } else {
        this.$router.push('/')
      }
    },
    goPayment () {
      if (is_weixn()) {
        // 微信环境下，支付首页使用微信
        // 调取微信支付，判断是否授权
        this.wxPayment()
        return false
      }
      // 支付首付
      if (!this.bankcardno) {
        // 未绑卡
        this.updateUserInfo({
          isFrom: 'api'
        })
        this.$router.push({
          path: '/addbankcard',
          query: {
            isAddbankcard: 1
          }
        })
      } else {
        // 已绑卡
        this.paymenInfo()
      }
    },
    getDownPayment () {
      // 获取信息
      let { uid, token } = this.$store.state.userInfo
      let orderId = this.orderId
      window.sessionStorage.setItem('orderId', this.orderId)
      return this.$post({
        url: this.$store.state.api.GetDownPayment,
        data: {
          uid,
          token,
          orderId
        }
      }).then(data => {
        this.isLoding = true
        this.showLoad(false)
        let res = data.data
        if (res.status === "1") {
          this.bankcardno = res.data.bankCardNum
          this.payDowndata = res.data
        } else {
//            this.updateToast({msg: res.statusDetail})
        }
      })
    }
  }
}
</script>
<style media="screen" lang="scss" scoped>
@import "../../assets/scss/app";
.to_pay_title{
  @include px2rem(padding-top, 190);
  text-align: center;
}
.orderId_p{
  @include px2rem(padding, 18 0 140);
}
.white_btn{
  background: #fff;
  color: #666666;
  margin-top: 0.4rem;
}
</style>
