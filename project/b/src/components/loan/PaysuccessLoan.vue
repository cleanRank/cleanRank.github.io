<template>
<section>
  <div class="site-frame-success">
    <img src="../../assets/icon/icon/icon_success.png" alt="成功" v-if="type && type==1">
    <img src="../../assets/icon/icon/icon_fail.png" alt="失败" v-else>
    <p class="font18">{{type && type==1?'提交成功':'提交失败'}}</p>
    <p>{{type && type==1?'您的借款已提交成功，您可以在“我的-借还订单”中查询':'您的借款未提交成功'}}</p>
  </div>
  <div class="loan_paysuccess flex" v-if="type && type==1">
    <p class="cell_1"><router-link to="/loanList" class="goOrder_btn">查看订单</router-link></p>
    <p class="cell_1"><a href="javascript:;" class="goIndex_btn" @click="goIndex">去首页</a></p>
  </div>
  <div class="btnCom" v-else @click="goIndex">去首页</div>
</section>
</template>
<script>
import {getQueryString} from 'lib/until'
export default {
  data () {
    return {
      type: this.$route.query.type || getQueryString('type') || 0
    }
  },
  created () {
    this.showLoad(false)
  },
  methods: {
    goIndex () {
      this.$router.push('/')
    }
  }
}
</script>
<style lang="scss" scoped>
.btnCom{
  margin-top: 1.6rem;
}
</style>
