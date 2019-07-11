<template>
<section v-if="isLoading">
  <div class="formList">
    <div class="formItem flex">
      <p class="formItemLable c_777">姓名</p>
      <p class="formItemTxt">{{queryList.idName}}</p>
    </div>
    <div class="formItem flex">
      <p class="formItemLable c_777">提现银行</p>
      <p class="formItemTxt">{{queryList.bankcardName}}</p>
    </div>
    <div class="formItem flex">
      <p class="formItemLable c_777">提现账号</p>
      <p class="formItemTxt">{{queryList.bankcardNo}}</p>
    </div>
    <div class="formItem flex">
      <p class="formItemLable c_777">提现金额</p>
      <p class="formItemTxt c_red">{{queryList.withdrawAmount}}元</p>
    </div>
  </div>
  <div class="horizontalLine"></div>
  <p class="cashingRecordNull cashNote c_999 font14">预计1~5个工作日内到账</p>
  <button class='cashSubmit btnCom' @click="cashingMoney">提交</button>
</section>
</template>
<script>
import changeBg from '@/mixin/'
export default {
  mixins: [changeBg],
  data () {
    return {
      isLoading: false,
      queryList: {}
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
      this.showLoad(true)
      let { uid, token } = this.$store.state.userInfo
      this.$post({
        url: this.$store.state.api.apply,
        data: {
          uid,
          token,
          withdrawAmount: this.queryList.withdrawAmount
        }
      }).then(({data: res}) => {
        this.showLoad(false)
        if (res.status == '1') {
          this.showToast({msg: '提交成功'})
        } else {
          this.showToast({
            msg: res.statusMessage
          })
        }
        // 返回提现页面
        setTimeout(() => {
          window.history.go(-1)
        }, 1000)
      })
    }
  }
}
</script>
