<template>
  <section>
  <div class="group_paysuccess_box">
    <img src="../../assets/icon/icon/icon_fail.png" class="group_img_box">
    <p class="pay_succes_txt">订单支付失败</p>
    <p class="kkje_p c_777">快去看看吧</p>
    <div class="btns_box flex">
      <p class="cell_1 tr" @click="goOrderlist()"><span class="invite_btn">查看订单</span></p>
      <p class="cell_1 tl" @click="goIndex()"><span class="look_btn">去首页</span></p>
    </div>
  </div>
  </section>
</template>
<script>
  import changeBg from '@/mixin/'
  export default {
    mixins: [changeBg],
    data () {
      return {}
    },
    created () {
      this.showLoad(false)
    },
    methods: {
      goIndex () {
        this.$router.push('/')
      },
      goOrderlist () {
        this.$router.push('/orderList')
      }
    }
  }
</script>
