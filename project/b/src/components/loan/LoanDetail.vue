<template>
<section v-if="isLoding">
  <div class="colorBlock"></div>
  <div class="loandetail_wrap">
    <p class="loanorder_num flex loandetail_txt">
      <span class="cell_3">借款订单号：{{$store.state.route.query.appid}}</span>
      <span class="cell_0 right_money" :class="'orderloan_status_0'+borrowdata.loanStatus">{{borrowdata.loanStatusDes}}</span>
    </p>
    <div class="flex">
      <p class="repayment_item cell_1"><b class="loandateil_txt">借款金额</b><b class="c_666 loandateil_num">{{borrowdata.appayAmt}}元</b></p>
      <p class="repayment_item cell_1"><b class="loandateil_txt">借款期限</b><b class="c_666 loandateil_num">{{borrowdata.timeLimit}}</b></p>
    </div>
    <div class="flex">
      <p class="repayment_item cell_1"><b class="loandateil_txt">还款方式</b><b class="c_666 loandateil_num">{{borrowdata.repayWay}}</b></p>
      <p class="repayment_item cell_1"><b class="loandateil_txt">借款类型</b><b class="c_666 loandateil_num">{{borrowdata.loanOrderTypeDes}}</b></p>
    </div>
    <p class="flex xgxy_lixt"><router-link :to="{ path: 'contractlist', query: {'orderId': borrowdata.appid}}" class="c_blue cell_1" v-if="borrowdata.showContracts&&borrowdata.showContracts==1">查看相关协议</router-link><span class="cell_2 right_money c_999">申请时间：{{borrowdata.appayDate}}</span></p>
  </div>
  <div class="colorBlock"></div>
  <div class="skzh_bank flex" v-if="borrowdata.showReceiveAccount&&borrowdata.showReceiveAccount==1">
    <span class="cell_1">收款账户</span>
    <span class="cell_0 right_money">{{borrowdata.receiveAccount}}</span>
  </div>
  <div class="colorBlock" v-if="borrowdata.showReceiveAccount&&borrowdata.showReceiveAccount==1"></div>
  <h5 class="repayment_title flex" v-if="cashloandata.length>0"><span class="cell_1">还款计划</span><span class="cell_2 right_money font14">已还 {{borrowdata.repayedTotalMoney}}元  未还 {{borrowdata.unrepayedTotalMoney}}元</span></h5>
  <ul class="repayment_plan" v-if="cashloandata.length>0">
    <li class="flex repayment_plan_item" v-for="item in cashloandata" :key="item.id">
      <div class="cell_1">
        <p class="periods_num">第{{item.period}}期&nbsp;&nbsp;应还款&nbsp;&nbsp;{{item.totalMoney}}元</p>
        <p class="sfk_money">实还款&nbsp;&nbsp;{{item.actualTotalMoney}}元</p>
        <p class="c_999">最后还款日&nbsp;&nbsp;{{item.repayDate}}</p>
      </div>
      <div class="cell_0 btn_box">
        <p class="hkz_btn hk_status_03" v-if="item.overdue && item.overdue ==1">{{item.overdueDes}}</p>
        <p class="hkz_btn" :class="'hk_status_0' + item.repayStatus" v-else>{{item.repayStatusDes}}</p>
      </div>
    </li>
  </ul>
</section>
</template>
<script>
import changeBg from '@/mixin/'
export default {
  mixins: [changeBg],
  data () {
    return {
      isLoding: false,
      borrowdata: {},
      cashloandata: {}
    }
  },
  created () {
    this.getLoandetail()
  },
  methods: {
    getLoandetail () {
      let { uid, token } = this.$store.state.userInfo
      this.$post({
        url: this.$store.state.api.CashLoan,
        data: {
          uid: uid,
          token: token,
          type: 3,
          appid: this.$store.state.route.query.appid,
          id: this.$store.state.route.query.id
        }
      }).then(data => {
        this.showLoad(false)
        let res = data.data
        if (res.status === "1") {
          this.isLoding = true
          let loanStatus = res.loanStatus
          // 处理数据，便于控制样式
          if (loanStatus == 0 || loanStatus == 14 || loanStatus == 1) {
            // 审核中
            res.loanStatus = 1
          } else if (loanStatus == 2 || loanStatus == 3 || loanStatus == 6 || loanStatus == 7 || loanStatus == 8 || loanStatus ==13) {
            // 未通过
            res.loanStatus = 2
          }
          this.$set(this.$data, 'cashloandata', res.cashLoanPlan)
          this.$set(this.$data, 'borrowdata', res)
        } else {
          this.showToast({msg: res.statusDetail})
        }
      })
    }
  }
}
</script>
