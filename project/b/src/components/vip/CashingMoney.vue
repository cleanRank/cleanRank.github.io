<template>
<section v-if="isLoading">
  <div class="withdrawalRecord">
    <router-link to="/cashingRecord" class="tx_btn font12 c_red">提现记录</router-link>
  </div>
  <div class="cashingPriceWrap">
    <div class='flexCashing flex vertical'>
      <p class="cashingPrice c_333">{{queryList.withdrawAmount}}</p>
      <p class="cashingPriceTxt c_999">可提现金额（元)</p>
    </div>
    <div class="horizontalLine"></div>
    <div class="cashingAccount flex justify-between">
      <span class="c_777">提现账号</span>
      <span class="c_333" v-if="queryList.bindCardStatus==1">{{queryList.bankcardName + queryList.bankcardNo}}</span>
      <router-link to="/tiedCard" class='c_red' v-else>绑定银行卡</router-link>
    </div>
  </div>
  <button :class="['btnCom', queryList.bindCardStatus !=1 ? 'cashing':'']" @click="cashingMoney">申请提现</button>
</section>
</template>
<script>
import changeBg from '@/mixin/'
export default {
  mixins: [changeBg],
  data () {
    return {
      queryList: {},
      isLoading: false
    }
  },
  created () {
    this.getUserCashDetail()
  },
  methods: {
    getUserCashDetail () {
      let { uid, token } = this.$store.state.userInfo
      this.$post({
        url: this.$store.state.api.query,
        data: {
          uid,
          token
        }
      }).then(({data: res}) => {
        this.showLoad(false)
        this.isLoading = true
        if (res.status == '1') {
          this.$set(this.$data, 'queryList', res.data)
        }
      })
    },
    cashingMoney () {
      // 提现
      var { bindCardStatus, withdrawAmount } = this.queryList
      if (bindCardStatus != 1) return false
      if (withdrawAmount < 1) {
        this.showToast({msg: '提现金额最低为1元'})
        return false
      }
      this.$router.push('/cashingConfirm')
    }
  }
}
</script>
