<template id="">
  <section>
    <div class="flex comment_title">
      <span class="cell_1 comment_product">商品详情</span>
    </div>
    <div id="introduction" class="introduction">
      <div class="goods-banner" v-for="(banner, index) in goodsInfo.banner" :key="'banner' + index">
        <a :href="banner.url" v-if="banner.url">
          <img :src="banner.image" class="goods-banner-pic" alt="">
        </a>
        <img :src="banner.image" alt="" class="goods-banner-pic" v-else>
      </div>
      <div class="" v-html="goodsInfo.introduction + goodsInfo.cssContent" id="introductionInfo"></div>
      </div>
    </div>
  </section>
</template>
<script type="text/javascript">
export default {
  props: {
    goodsInfo: {
      required: true,
      type: Object
    }
  },
  methods: {
  },
  mounted () {
  }
}
</script>
<style media="screen" lang="scss" scoped>
  @import "../../assets/scss/app";
  .goods-banner {
    @include px2rem(margin, 30 0);
  }
</style>
