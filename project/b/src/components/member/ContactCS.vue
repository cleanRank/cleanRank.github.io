<template>
  <section class="customer-service">
    <div class="customer-service-tel">
      <p class="customer-service-time">电话客服 周一至周日（09：00-21：00）</p>
      <img class="customer-img" src="../../assets/icon/credit/cs_img.png" alt="客服">
      <a href="tel:4006789999" class="customer-service-tel-num">拨打热线 400-678-9999</a>
    </div>
    <div class="customer-service-vipcn">
      <img src="../../assets/icon/credit/service_qrcode.png" :alt="vipcn" class="customer-service-vipcn_qrcode">
      <div class="customer-service-vipcn_copy">公众号 {{wechatID}}<span class="copy_vipcn_btn" @click="doCopy(wechatID)"> &nbsp;点击复制</span></div>

    </div>
  </section>
</template>

<script>
  import doCopy from './mixin/doCopy'
  import BodyBg from '../../mixin/index'
  export default {
    mixins: [doCopy, BodyBg]
  }
</script>
