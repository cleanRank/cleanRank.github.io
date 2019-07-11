<template>
  <section class="about_wrap">
    <div class="about">
      <div class="sxyp_info">
        <img src="../../assets/icon/about/sxyp-app-logo.png" alt="app-logo" class="sxyp_logo">
        <p class="sxyp_ver"  v-if="$store.state.config.fromChannel == 'sxypApp'"><span>V</span>{{$store.state.config.ver}}</p>
        <p class="sxyp_synopsis">水象优品，水象商贸（厦门）有限公司旗下互联网消费平台，以客户至上为核心理念，我们致力于以成熟科技技术为客户更有效地提供商品及全方位服务，专营3C、家电、美妆，珠宝等商品。</p>
      </div>
      <div class="brand_advantages">
        <h6 class="brand_advantages_title">【品牌优点】</h6>
        <ul class="brand_protection">
          <!-- <li><span class="font_bold">信用生活</span> - 最潮信用消费理念，先享受后付款，轻松生活。</li> -->
          <li><span class="font_bold">全场包邮</span> - 全场商品包邮，无需额外支付快递费用。</li>
          <li><span class="font_bold">正品保证</span> - 商品对比于京东和品牌大厂，不担心质量。</li>
          <li><span class="font_bold">全国联保</span> - 商品质量问题均为全国联保，无后顾之忧。</li>
        </ul>
      </div>
    </div>
    <div class="vipcn">
      <div class="vipcn_copy">公众号 {{vipcn}} <span class="copy_vipcn_btn" @click="doCopy(vipcn)"> &nbsp;点击复制</span></div>
      <img src="../../assets/icon/about/vipcn-qrcode.png" :alt="vipcn" class="vipcn_qrcode">
    </div>
  </section>
</template>
<script>
  import doCopy from './mixin/doCopy'
  export default {
    mixins: [doCopy]
  }
</script>
