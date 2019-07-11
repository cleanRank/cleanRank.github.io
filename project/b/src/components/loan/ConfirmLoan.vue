<template>
<section>
  <div class="repayment_palt_box">
    <!-- <h5 class="repayment_title">还款计划</h5> -->
    <div class="repayment_list">
      <div class="horizontal_box">
        <p class="repayment_item flex">
          <span class="cell_1">借款金额</span>
          <span class="cell_1 c_999 right_money">{{loanData.LoanMoney}}元</span>
        </p>
        <p class="repayment_item flex">
          <span class="cell_1">到账金额</span>
          <span class="cell_1 c_999 right_money">{{loanData.accountAmount}}元</span>
        </p>
        <p class="repayment_item flex" v-if="loanData.auditAmount">
          <span class="cell_1">审核费</span>
          <span class="cell_1 c_999 right_money">{{loanData.auditAmount}}元</span>
        </p>
      </div>
      <div class="horizontal_box">
        <p class="repayment_item flex">
          <span class="cell_1">合同金额</span>
          <span class="cell_1 c_999 right_money">{{loanData.contractAmount}}元</span>
        </p>
        <p class="repayment_item flex">
          <span class="cell_1">借款期限</span>
          <span class="cell_1 c_999 right_money">{{loanData.loanPeriods}}个月</span>
        </p>
        <p class="repayment_item flex">
          <span class="cell_1">借款用途</span>
          <span class="cell_1 c_999 right_money">{{loanData.loanUse}}</span>
        </p>
      </div>
      <div class="horizontal_box">
        <p class="repayment_item flex">
          <span class="cell_1">还款方式</span>
          <span class="cell_1 c_999 right_money">{{loanData.repayType}}</span>
        </p>
        <div class="repayment_item interest_rate_wrap flex" @click="showrate()">
          <p class="interest_rate_box" v-if="isShowrate">月利率{{(loanData.monthRate*100) | fixed2NoRound}}%&nbsp;&nbsp;服务费率{{(loanData.serviceRate*100) | fixed2NoRound}}%</p>
          <span class="cell_1">每月还款</span>
          <span class="cell_1 c_999 right_money">{{loanData.monthAmount}}元</span>
          <span class="cell_0 c_999 interest_rate"></span>
        </div>
        <p class="repayment_item flex">
          <span class="cell_1">每月还款日</span>
          <span class="cell_1 c_999 right_money">每月{{loanData.repayDay}}日</span>
        </p>
      </div>
    </div>
  </div>
   <div class="skzh_bank flex">
    <span class="cell_1">收款账户</span>
    <span class="cell_0 right_money">{{loanData.bankName}}&nbsp;&nbsp;{{loanData.bankCard}}</span>
  </div>
  <p class="checkout_box flex" @click="checkoutType()">
    <span class="agrees_rideo cell_0" :class="{'agrees_rideo_checked':isChecked}"></span>
    <label class="c_999 cell_1">我已经阅读并同意《<router-link to="/protocolList" class="c_blue">相关协议</router-link>》</label>
  </p>
  <button class="btnCom" :class="{'hui':!isChecked}" @click="confirmloan()">确认借款</button>
  <!-- 设置交易密码 s-->
  <!-- v-if="isShowPw" -->
  <pwdBox @pwdSuccess="pwdSuccess" @closePwd="closePwd" :code="'5'" v-if="isShowPw"></pwdBox>
  <!-- 设置交易密码 e-->
</section>
</template>
<script>
import pwdBox from 'components/common/pwdBox'
import mixin from 'components/shopping/mixin'
export default {
  mixins: [mixin],
  data () {
    return {
      isChecked: false,
      isShowPw: false,
      isShowrate: false,
      loanData: {}
    }
  },
  components: {
    pwdBox
  },
  created () {
    this.isChecked = this.$store.state.route.from.name == 'ProtocolList'
    this.getCashLoanApplyCheck()
  },
  methods: {
    getCashLoanApplyCheck () {
      // 查询确认借款详情
      let { uid, token } = this.$store.state.userInfo
      let data = {
        uid,
        token
      }
      let confirmLoanList = JSON.parse(window.sessionStorage.getItem('confirmLoanList'))
      data = {...data, ...confirmLoanList}
      this.$post({
        url: this.$store.state.api.CashLoanApplyCheck,
        data: data
      }).then(data => {
        this.showLoad(false)
        let res = data.data
        if (res.status === "1") {
          this.$set(this.$data, 'loanData', data.data)
        } else {
          this.showToast({msg: res.statusDetail})
        }
      })
    },
    confirmloan () {
      if (!this.isChecked) {
        this.showToast({msg: '请查看并同意协议'})
        return false
      }
      // 调获取短信验证码接口
      this.sendValidCode(null, 5)
    },
    checkoutType () {
      this.isChecked = !this.isChecked
    },
    // 关闭密码键盘
    closePwd () {
      this.$data.isShowPw = false
    },
    showrate () {
      this.isShowrate = !this.isShowrate
    },
    pwdSuccess (num) {
      // 确认借款成功之后
      let { uid, token } = this.$store.state.userInfo
      let data = {
        uid,
        token,
        code: num
      }
      let confirmLoanList = JSON.parse(window.sessionStorage.getItem('confirmLoanList'))
      data = {...data, ...confirmLoanList}
      this.$post({
        url: this.$store.state.api.ConfirmCashLoan,
        data: data
      }).then(data => {
        this.showLoad(false)
        let res = data.data
        if (res.status === "1") {
          this.$router.push({path: 'PaysuccessLoan', query: {type: 1}})
        } else if (res.status === "57") {
          this.showToast({msg: res.statusDetail})
        } else {
          this.showToast({msg: res.statusDetail})
          this.$router.push({path: 'PaysuccessLoan'})
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.agrees_rideo{
  margin-top: 2px;
  &.agrees_rideo_checked{
  background: url("../../assets/icon/icon/money_selected_icon@3x.png") center no-repeat;
  background-size: 100%;
  }
}
</style>
