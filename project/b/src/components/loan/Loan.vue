<template>
<section>
  <!-- 公告s -->
  <div class="notice_wrap">
   <div class="swiper-container02">
    <swiper :options="swiperBannerOption" ref="mySwiper">
      <template v-for="(slide, index) in noticeList">
        <swiper-slide :key="index" class="swiper-no-swiping">
         <p class="notice_txt">{{slide}}</p>
        </swiper-slide>
      </template>
    </swiper>
    </div>
  </div>
  <!-- 公告s -->
  <div class="loanIndex_top_box">
    <p class="loanIndex_explain font14">{{$store.state.userInfo.token&&cashLoanInfo.quotaStatus==1&&cashLoanInfo.usableQuota>=0?'可用借款':'可用'}}额度(元)</p>
    <p class="loanIndex_state">{{$store.state.userInfo.token&&cashLoanInfo.quotaStatus==1&&cashLoanInfo.usableQuota>=0?cashLoanInfo.usableQuota:'20,000'}}</p>
    <p class="loanIndex_explain font14" @click="goCredit">{{$store.state.userInfo.token&&cashLoanInfo.quotaStatus==1&&cashLoanInfo.totalQuota>0?'借款额度' + cashLoanInfo.totalQuota +'&nbsp;>':'您暂未开通额度，请及时开通'}}</p>
  </div>
  <div class="flex loanState_list">
    <p class="cell_1 loanState_item loanState_item_rxf">日息费0.08%</p>
    <p class="cell_1 loanState_item loanState_item_sh">10分钟审核</p>
    <p class="cell_1 loanState_item loanState_item_tgl">通过率95%</p>
  </div>
  <button class="btnCom" @click="bindEvent">立即提现</button>
</section>
</template>
<script>
import { gocredit, jointLand } from 'lib/until'
export default {
  data () {
    return {
      noticeList: {},
      swiperBannerOption: {
        direction: 'vertical',
        autoHeight: true,
        loop: true,
        autoplay: 2000,
        speed: 750
      },
      cashLoanInfo: {}
    }
  },
  created () {
    this.getSentence()
    this.cashLoanApplyInfo()
  },
  methods: {
    goCredit () {
      // 去白条
      let {token} = this.$store.state.userInfo
      if (token&&this.cashLoanInfo.quotaStatus==1&&this.cashLoanInfo.usableQuota>=0) {
        gocredit()
      }
    },
    getSentence () {
      // 获取公告
      this.$post({
        url: this.$store.state.api.GetSentence,
        data: {}
      }).then(data => {
        this.showLoad(false)
        let res = data.data
        if (res.status === "1") {
          this.$set(this.$data, 'noticeList', res.data)
        } else {
          this.showToast({msg: res.statusDetail})
        }
      })
    },
    cashLoanApplyInfo () {
      let {uid, token} = this.$store.state.userInfo
      if (!token) {
        this.showLoad(false)
        return false
      }
      this.$post({
        url: this.$store.state.api.CashLoanApplyInfo,
        data: {
          uid,
          token
        }
      }).then(data => {
        this.showLoad(false)
        let res = data.data
        if (res.status === "1") {
          this.$set(this.$data, 'cashLoanInfo', res)
        } else {
          // this.showToast({msg: res.statusDetail})
        }
      })
    },
    bindEvent () {
      // 立即借款
      if (!this.$store.state.userInfo.token) {
        jointLand()
        return false
      }
      // 判断是否有额度，且可使用
      if (this.cashLoanInfo.usableQuota&&this.cashLoanInfo.quotaStatus==1&&this.cashLoanInfo.usableQuota>=0) {
        this.$router.push('/loanIndex')
      } else {
        // 去白条
        gocredit()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.btnCom{
  margin-top: 1.06667rem;
}
</style>
