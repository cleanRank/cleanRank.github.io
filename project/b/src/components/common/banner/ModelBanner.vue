<template>
<div class="banner_model">
 <div class="small_banner">
   <div class="swiper-container02 swiper-container22">
    <swiper :options="swiperBannerOption" ref="mySwiper">
      <template v-for="(slide, index) in banner">
        <swiper-slide :key="index">
          <a :href="slide.h5Url" class="swiper-slide banner_a" :data-bdid="slide.id" :data-bdindex="index" :data-erow="erow || ''" :data-modname="modname || ''">
            <img width="100%" class="lazy" v-lazy="slide.image || slide.picUrl" lazy="loading">
          </a>
        </swiper-slide>
      </template>
      <div class="swiper-pagination" slot="pagination" v-if="banner.length > 1"></div>
    </swiper>
    </div>
  </div>
  </div>
</template>
<script type="text/javascript">
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
  data () {
    return {
      // banner图片轮播图
      swiperBannerOption: {
        observer: true,
        observeParents: true,
        effect: 'slide',
        loop: false,
        autoplay: 2000,
        // autoplay: this.banner && this.banner.length > 1 ? 2000 : false,
        // autoplay: false,
        speed: 1000,
        initialSlide: 1,
        resistanceRatio: 0,
        autoplayDisableOnInteraction: false,
        pagination: '.swiper-pagination',
        preventClicksPropagation: false,
        touchMoveStopPropagation: false
      }
    }
  },
  props: {
    'banner': {
      default: []
    }
  },
  components: {
    swiper,
    swiperSlide
  },
  computed: {
    swiper () {
      return this.$refs.mySwiper.swiper
    }
  },
  mounted () {
    this.$forceUpdate()
  }
}
</script>
<style media="screen" lang="scss">
@import "../../../assets/scss/app";
.swiper-container-horizontal > .swiper-pagination-bullets{
    text-align: right;
    @include px2rem(bottom, 12);
  }
</style>

