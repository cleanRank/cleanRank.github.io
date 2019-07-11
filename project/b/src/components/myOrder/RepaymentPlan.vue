<template>
  <section class="bDetaillWrap" id="repaymentPlanWrap" v-if="show">
    <div class="pro">
      <p class="p_title">{{repayPlans.productName}}</p>
      <div class="date_order flex">
        <span class="cell_0">{{repayPlans.orderTime|timeFormat(1)}}</span>
        <span class="oederNum cell_0">订单号：{{orderId}}</span>
      </div>
      <div class="capital_yh flex">
        <div class="cell_1">
          <span>分期本金(元)</span>
          <span class="money">{{repayPlans.principal}}</span>
        </div>
        <div class="cell_0">
          <span>合计应还(元)</span>
          <span class="money">{{repayPlans.amount}}</span>
        </div>
      </div>
    </div>
    <ul class="billList">
      <li class="li_head flex">
        <span class="cell_1">还款计划</span>
        <b class="cell_0">已还{{repayPlans.alRepayment}}元，未还{{repayPlans.noRepayment}}元</b>
      </li>
      <template v-for="item in repayPlans.billList">
        <li v-if="item.status == 'ALREADY_REPAYMENT'" class="al_h flex">
            <span class="cell_1"><i class="num">{{item.stage}}</i>{{item.monthPayment}}元</span>
            <span class="cell_0">{{item.settledDate | timeFormat(1)}}<i class="i_h">已还</i></span>
        </li>
        <li v-else-if="item.status == 'BE_OVERDUE'" class="overdue_h flex">
          <span class="cell_1"><i class="num">{{item.stage}}</i>{{item.monthPayment}}元</span>
          <span class="cell_0">{{item.settledDate | timeFormat(1)}}<i class="i_h">逾期</i></span>
        </li>
        <li class="not_h flex" v-else>
          <span class="cell_1"><i class="num">{{item.stage}}</i>{{item.monthPayment}}元</span>
          <span class="cell_0">{{item.settledDate | timeFormat(1)}}<i class="i_h">未还</i></span>
        </li>
      </template>
    </ul>
  </section>

</template>
<script>
  import { mapGetters, mapActions } from 'vuex'
  import { getQueryString } from 'lib/until'
  export default {
    data () {
      return {
        billList: [],
        orderId: this.$store.state.route.query.orderId ||getQueryString('orderId'),
        show: '',
        repayPlans: {}
      }
    },
    created () {
      this.queryContract()
    },
    computed: {
      ...mapGetters({
        userInfo: "getUserInfo"
      })
    },
    methods: {
      ...mapActions([
        "updateUserInfo"
      ]),
      queryContract () {
        this.$post({
          url: this.$store.state.api.RepaymentPlan,
          data: {
            uid: this.userInfo.uid ||this.$store.state.route.query.uid,
            token: this.$store.state.userInfo.token ||this.$store.state.route.query.token,
            orderId: this.$store.state.route.query.orderId||getQueryString('orderId')
          }
        }).then(data => {
          this.showLoad(false)
          let res = data.data
          if (res.status==1) {
            this.$set(this.$data, 'repayPlans', res.data)
            // this.$set(this.$data, 'billList', res.data.billList)
            this.$set(this.$data, 'show', true)
          } else {
            this.$set(this.$data, 'show', false)
            this.showToast({msg: res.statusDetail})
          }
        })
      }
    }
  }
</script>
