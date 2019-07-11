<template>
<section>
  <!-- <div class="loanIndex_top_box">
    <p class="loanIndex_explain font14">当前可借金额</p>
    <p class="loanIndex_state">{{cashLoanInfo.usableQuota}}</p>
    <p class="loanIndex_explain font14">总额度{{cashLoanInfo.totalQuota}}元</p>
  </div> -->
  <div class="loanIndex_center_box">
    <h6 class="jkje_title">借款金额(可借{{cashLoanInfo.usableQuota}}元)</h6>
    <p class="jkje_conment_box">
      <span class="jkje_fh">¥</span><input :class="{'c_main':loanMoney>(+cashLoanInfo.usableQuota) || (loanMoney&&loanMoney<500) || (loanMoney%100!=0)}" type="tel"  placeholder="" v-model="loanMoney" autofocus onkeyup="value=value.replace(/[^\d]/g,'')">
    </p>
    <p class="error_loan_txt">
      <span class="c_main" v-if="loanMoney&&loanMoney>(+cashLoanInfo.usableQuota)">您的借款金额不能超过当前可借金额</span>
      <span :class="[(loanMoney&&loanMoney<500) || (loanMoney%100!=0)?'c_main':'c_999']" v-else>500元起借，100元整数倍递增</span>
    </p>
  </div>
  <div class="loanIndex_detail_box">
    <p class="flex info_p">
      <label class="cell_1">借款期限</label>
      <select class="cell_2 c_999 right_btn" v-model="loanPeriods" >
        <option value="">请选择借款期限</option>
        <option v-for="item in cashLoanInfo.supportStage" :key="item" :value="item">{{item}}期</option>
      </select>
    </p>
    <p class="flex info_p">
      <label class="cell_1">用途</label>
      <select class="cell_2 c_999 right_btn" v-model="loanUse" >
        <option value="">请选择借款用途</option>
        <option v-for="(item, i) in cashLoanInfo.useData" :key="item" :value="i">{{item}}</option>
      </select>
    </p>
    <p class="flex info_p">
      <label class="cell_1">还款日</label>
      <span class="cell_2 c_999" v-if="fig">每月{{billDate}}日</span>
      <select class="cell_2 c_999 right_btn" v-model="billDate" v-else>
        <option value="">请设置您的还款日</option>
        <option v-for="item in cashLoanInfo.billDateList" :key="item" :value="item">每月{{item}}日</option>
      </select>
    </p>
  </div>
  <button class="btnCom" :disabled="!loanUse||!loanPeriods||!billDate||!loanMoney||(loanMoney&&loanMoney<500)||(loanMoney%100!=0)||loanMoney>(+cashLoanInfo.usableQuota)" :class="{'hui':!loanUse||!loanPeriods||!billDate||!loanMoney||(loanMoney&&loanMoney<500)||(loanMoney%100!=0)||loanMoney>(+cashLoanInfo.usableQuota)}" @click="goLoan">立即借款</button>
</section>
</template>
<script>
export default {
  data () {
    return {
      cashLoanInfo: {
        supportStage: [],
        useData: []
      },
      loanMoney: '',
      loanPeriods: '',
      loanUse: '',
      billDate: '',
      fig: false
    }
  },
  created () {
    this.cashLoanApplyInfo()
  },
  beforeRouteLeave (to, from, next) {
    // 清除借款信息
    if (to.name != 'ConfirmLoan') {
      window.sessionStorage.removeItem('confirmLoanList')
    }
    next()
  },
  methods: {
    goLoan () {
      // 立即借款
      if (!this.loanUse||!this.loanPeriods||!this.billDate||!this.loanMoney||(this.loanMoney&&this.loanMoney<500)||(this.loanMoney%100!=0)||this.loanMoney>(+this.cashLoanInfo.usableQuota)) {
        this.showToast({ msg: "请补全借款信息" })
        return false
      }
      let { uid, token } = this.$store.state.userInfo
      let data = {
        uid,
        token
      }
      let confirmLoanList = {
        loanMoney: this.loanMoney,
        loanPeriods: this.loanPeriods,
        loanUse: this.loanUse,
        billDate: this.billDate
      }
      data = {...data, ...confirmLoanList}
      this.$post({
        url: this.$store.state.api.CashLoanApplyCheck,
        data: data
      }).then(data => {
        let res = data.data
        if (res.status === "1") {
          window.sessionStorage.setItem('confirmLoanList', JSON.stringify(confirmLoanList))
          this.$router.push('/confirmLoan')
        } else {
          this.showToast({msg: res.statusDetail})
        }
      })
    },
    cashLoanApplyInfo () {
      // 查询借款期限
      let {uid, token} = this.$store.state.userInfo
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
          if (res.billDate) {
            this.billDate = res.billDate
            this.fig = true
          }
          res.supportStage = res.supportStage.split(',')
          res.billDateList = res.billDateList.split(',')
          this.$set(this.$data, 'cashLoanInfo', res)
        } else {
          this.showToast({msg: res.statusDetail})
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.btnCom{
  margin-top: 1.2rem;
}
</style>
