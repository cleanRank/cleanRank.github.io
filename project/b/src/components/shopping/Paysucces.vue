<template>
  <section v-if="isshowPage">
    <div class="group_paysuccess_box">
      <img src="../../assets/icon/icon/icon_success.png" class="group_img_box">
      <p class="pay_succes_txt">订单支付成功</p>
      <p class="pay_price">{{currentProducts.data.totalMoney}}元</p>
      <p class="kkje_p c_777">我们将尽快为您发货，请保持手机畅通</p>
      <div class="btns_box pu_paysuccess flex">
        <p class="cell_1 tr" @click="goOrderlist()"><span class="invite_btn">查看订单</span></p>
        <p class="cell_1 tl" @click="goIndex()"><span class="look_btn">去首页</span></p>
      </div>
    </div>
    <div class="paysuccess" v-if="bCoupon">
      <div class="paysuccess-con">
        <img class="paysuccess-close" @click="paysuccessHide" src="../../assets/icon/order/paysuccess-close.png">
        <img class="paysuccess-coupon-bg" :src="currentProducts.data.activityImg">
        <div class="paysuccess-main">
          <ul class="paysuccess-coupon-list">
            <li class="paysuccess-coupon" v-for="(coupon, index) in this.currentProducts.data.coupons" :key="index">
              <p class="paysuccess-coupon-val"><span class="paysuccess-coupon-name-small">￥</span>{{coupon.parValue}}</p>
              <p class="paysuccess-coupon-name">{{coupon.showName}}</p>
              <p class="paysuccess-coupon-time">{{coupon.starTime}}至{{coupon.endTime}}</p>
              <span class="paysuccess-coupon-label">已入账</span>
            </li>
          </ul>
          <img class="paysuccess-shadow" src="../../assets/icon/order/paysuccess-shadow.png">
          <div class="paysuccess-mark">您有一个下单奖励，优惠券已放入您的账户中，请在“我的-优惠券”查看</div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
  import { app } from 'lib/until'
  import changeBg from '@/mixin/'
  export default {
    mixins: [changeBg],
    data () {
      return {
        orderId: window.sessionStorage.getItem('orderId') || this.$store.state.route.query.orderId || '',
        isshowPage: false,
        currentProducts: {},
        isGift: this.$route.query.gift || window.sessionStorage.getItem('gift'),  // 大礼包 [1]是 2 [否]
        bCoupon: false
      }
    },
    created () {
      this.paysuccesShow()
      // 兼容安卓
      if (this.$store.state.config.fromChannel == 'sxypApp') {
        app.isShopingCart()
      }
    },
    methods: {
      goIndex () {
        if (this.$store.state.config.fromChannel == 'sxypApp') {
          app.goIndex()
          if (!this.isGift) {
            app.hideAppTitle()
          }
        } else {
          this.$router.push('/')
        }
      },
      goOrderlist () {
        // 从连连回来，通知一下客户端
        if (this.$store.state.config.fromChannel=='sxypApp' && !this.isGift) { app.hideAppTitle() }
        this.$router.push('/orderList')
      },
      paysuccesShow () {
        let {uid, token} = this.$store.state.userInfo
        return this.$post({
          url: this.$store.state.api.QueryOrderTotal,
          data: {
            uid,
            token,
            orderId: this.orderId
          }
        }).then(data => {
          this.showLoad(false)
          this.isshowPage = true
          let res = data.data
          if (res.status == 1) {
            this.$set(this.$data, 'currentProducts', res)
            if (res.data.coupons && res.data.coupons.length>0) {
              this.bCoupon = true
            }
          }
          window.sessionStorage.removeItem('orderIndex')
        })
      },
      paysuccessHide () {
        this.bCoupon = false
      }
    }
  }
</script>

<style>
@font-face {
  font-family: 'DIN';
  src: url('../../assets/font/DIN.ttf');
  font-weight: normal;
  font-style: normal;
}
</style>
