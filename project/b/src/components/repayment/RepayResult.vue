<template>
<section>
  <div v-if="resuliData.status==2">
    <div class="repay_result">
      <img src="../../assets/icon/repayment/zfcg.png">
      <p class="c_blue font17">还款成功</p>
    </div>
    <div class="repay_success">
      <p class="flex repay_success_item"><span class="cell_1 font15 c_777">还款金额</span><span class="font13">¥{{resuliData.counterMoney}} 元</span></p>
      <p class="flex repay_success_item"><span class="cell_1 font15 c_777">还款时间</span><span class="font13">{{resuliData.tradeDate | timeFormat(1)}}</span></p>
      <p class="flex repay_success_item"><span class="cell_1 font15 c_777">还款账户</span><span class="font13">{{resuliData.bankName+resuliData.bankNo}}</span></p>
    </div>
  </div>
  <div class="repay_result"  v-else-if="resuliData.status==1 || ($store.state.route.query.status&&$store.state.route.query.status!=60)">
    <img src="../../assets/icon/repayment/zfsb.png">
    <p class="c_999 font15">亲  您的还款失败，请稍后再试<br>如有问题请联系客服。谢谢～</p>
    <router-link to="contactCS" class="btnCom btn_tel">联系客服</router-link>
  </div>
  <div class="repay_result" v-else-if="resuliData.status==3 || $store.state.route.query.status==60">
    <img src="../../assets/icon/repayment/zfsb.png">
    <p class="c_999 font17">亲，卡内余额不足哦～</p>
  </div>
  <div class="repay_result" v-else>
    <img src="../../assets/icon/repayment/ddjg.png">
    <p class="c_999 font17">等待返回支付结果，请稍后～</p>
  </div>
</section>
</template>
<script>
import changeBg from '@/mixin/'
export default {
  mixins: [changeBg],
  data () {
    return {
      resuliData: {},
      setTime: ''
    }
  },
  created () {
    this.showLoad(false)
    if (this.$store.state.route.query.status) return false
    this.repayResult().then(() => {
      // 5秒过后再次查询结果
      this.setTime = setTimeout(() => {
        this.repayResult().then(() => {
          if (this.resuliData.status == 0) {
            this.showDialog({
              title: '',
              rBtnText: '确定',
              msg: '申请已提交，系统扣款中，请耐心等待。',
              confCallBack () {
                window.history.go(-2)
              }
            })
          }
        })
      }, 10000)
    })
  },
  beforeRouteLeave (to, from, next) {
    // 清空倒计时
    clearTimeout(this.setTime)
    next()
  },
  methods: {
    repayResult () {
      // 还款结果
      return this.$post({
        url: this.$store.state.api.queryManualRepayResult,
        data: {
          centerUserId: this.$store.state.userInfo.userId,
          tradeNo: this.$store.state.route.query.tradeNo || ''
        }
      }).then(data => {
        this.isLoding = true
        let res = data.data
        if (res.status == "1") {
          this.resuliData = res.data
        } else {
          // this.showToast({msg: res.statusMessage})
        }
      })
    }
  }
}
</script>
<style media="screen" lang="scss" scoped>
.btn_tel{
  width: 60%;
  margin: 0 auto;
  margin-top: 0.8rem;
  box-shadow: 0 5px 15px rgba(62,155,249,0.5);
}
</style>
