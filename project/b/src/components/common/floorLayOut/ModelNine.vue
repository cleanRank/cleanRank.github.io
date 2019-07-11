<template>
<div class="floor">
  <OneBanner v-if="productFloor.sourcePage =='index' && productFloor.image" :productFloor="productFloor"></OneBanner>
  <div class="banner_model" v-if="productFloor.sourcePage =='index' && productFloor.banner && productFloor.banner.length > 0">
    <div class="small_banner">
      <div class="swiper-container02 swiper-container22">
        <swiper :options="swiperBannerOption">
          <template v-for="(slide, index) in productFloor.banner">
            <swiper-slide :key="index">
              <a class="swiper-slide banner_a" :data-bdid="slide.id" :data-bdindex="index" :data-erow="3" data-modname="ModelNine" @click="bannerDetail(slide.h5Url, slide.name, productFloor.name, slide, $event)">
                <img :src="slide.picUrl" class="lazy"  :title="slide.name"  :alt="slide.name" width="100%" lazy="loading"/>
              </a>
            </swiper-slide>
          </template>
          <!-- <div class="swiper-pagination bt6" v-show="productFloor.banner.length > 1" slot="pagination"></div> -->
        </swiper>
      </div>
    </div>
  </div>
  <ul class="modelnine_list">
    <li class="modelnine_item" v-for="(_item, index) in productFloor.prudouct" :key="index">
      <a href="javascript:;" :data-bdid="_item.id" :data-bdindex="index" :data-erow="3" data-modname="ModelNine" @click="bannerDetail(_item.urlContent, _item.name, productFloor.name, _item, $event)">
        <img v-lazy="_item.picture" class="lazy" :title="_item.proName"  :alt="_item.proName" lazy="loading"/>
      </a>
    </li>
  </ul>
</div>
</template>
<script type="text/javascript">
import OneBanner from 'components/common/banner/OneBanner'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
  data () {
    return {
      // banner图片轮播图
      swiperBannerOption: {
        effect: 'slide',
        loop: false,
        autoplay: this.productFloor.banner && this.productFloor.banner.length > 1 ? 2000 : false,
        speed: 1000,
        initialSlide: 1,
        resistanceRatio: 0,
        autoplayDisableOnInteraction: true,
        // pagination: '.swiper-pagination',
        preventClicksPropagation: true,
        touchMoveStopPropagation: true
      }
    }
  },
  props: {
    productFloor: {
      required: true,
      type: Object
    }
  },
  methods: {
    bannerDetail (url, name, lable, item, e) {
      window.location.href=url
    }
  },
  components: {
    OneBanner,
    swiper,
    swiperSlide
  }
}
</script>
<style media="screen" lang="scss" scoped>
@import "../../../assets/scss/app";
.modelnine_list{
  @include px2rem(padding,15 0 0 15);
  overflow: hidden;
}
.modelnine_item{
   width: 33.3%;
   float: left;
   overflow: hidden;
   @include px2rem(margin-bottom, 15);
   a{
     display: block;
     @include px2rem(margin-right, 15);
   }
  img{
    width: 100%;
  }
}
</style>
