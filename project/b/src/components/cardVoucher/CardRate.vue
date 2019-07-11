<template>
<section class="cardRate_wrap">
<img src="../../assets/icon/cardVoucher/btn2.png" class="cardrate_img">
<button type="button" name="button" class="btnCom" @click="bindEvents"></button>
<div class="cardrate_wrap">
  <h6 class="rate_box_title font18">寄售费率表</h6>
  <table class="rate_table">
    <tr>
      <th>礼品卡名称</th>
      <th>费率</th>
    </tr>
    <tr>
      <td>移动话费卡</td>
      <td>95%</td>
    </tr>
    <tr>
      <td>联通话费卡</td>
      <td>95%</td>
    </tr>
    <tr>
      <td>电信话费卡</td>
      <td>95%</td>
    </tr>
  </table>
</div>
</section>
</template>
<script>
import mixin from './mixin'
import { jointLand } from 'lib/until'
export default {
  mixins: [mixin],
  beforeRouteEnter (to, from, next) {
    document.querySelector('body').style.background = '#FFE3E5'
    document.querySelector('html').style.background = '#FFE3E5'
    next()
  },
  beforeRouteLeave (to, from, next) {
    document.querySelector('body').style.background = '#f5f5f5'
    document.querySelector('html').style.background = '#f5f5f5'
    next()
  },
  created () {
    this.showLoad(false)
    if (this.$store.state.route.from.name == 'OrderList' || this.$store.state.route.from.name == 'OrderDetail') {
      window.sessionStorage.setItem('goHistory', '1')
    }
  },
  methods: {
    bindEvents () {
      // 判断是否登录
      if (this.$store.state.userInfo.token) {
        // 去寄售
        this.virtualCardRecycle('1')
      } else {
        jointLand()
      }
    }
  }
}
</script>
