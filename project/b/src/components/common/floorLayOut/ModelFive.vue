<template>
  <!--首页楼层 模版 s-->
  <!-- layout 5 s-->
<section class="modelThree">
<OneBanner v-if="productFloor.sourcePage =='index' && productFloor.image" :productFloor="productFloor"></OneBanner>
<div class="banner_model" v-if="productFloor.sourcePage =='index' && productFloor.banner && productFloor.banner.length > 0">
 <div class="small_banner">
   <div class="swiper-container02 swiper-container22">
    <swiper :options="swiperBannerOption" ref="mySwiper">
      <template v-for="(slide, index) in productFloor.banner">
        <swiper-slide :key="index">
          <span class="swiper-slide banner_a" :data-bdid="slide.id" :data-bdindex="index" :data-erow="1" data-modname="modelFive" @click="bannerDetail(slide.h5Url, slide.name, productFloor.name, slide, $event)">
            <img width="100%" class="lazy" v-lazy="slide.picUrl" lazy="loading"></span>
          </span>
        </swiper-slide>
      </template>
      <!-- <div class="swiper-pagination" slot="pagination" v-if="productFloor.banner.length > 1"></div> -->
    </swiper>
    </div>
  </div>
  </div>
<div class="floor_conent">
  <ul class="layoutType_box3" :class="{'layoutType_box10': productFloor.layoutType == 10}">
    <template v-for="(_item, index) in productFloor.prudouct">
      <li :class="'lay_it'+index" :key="index" v-if="productFloor.layoutType == 10">
        <a href="javascript:;" :data-bdid="_item.id" :data-bdindex="index" :data-erow="2" data-modname="ModelFive" @click="bannerDetail(_item.urlContent, _item.name, productFloor.name, _item, $event)"  class="js_pro_detail">
          <img v-lazy="_item.picture" class="lazy" :title="_item.proName"  :alt="_item.proName" lazy="loading"/>
        </a>
      </li>
      <li :class="'lay_it'+(index+1)" :key="index" v-else>
        <a href="javascript:;" :data-bdid="_item.id" :data-bdindex="index" :data-erow="2" data-modname="ModelFive" @click="bannerDetail(_item.urlContent, _item.name, productFloor.name, _item, $event)"  class="js_pro_detail">
          <img v-lazy="_item.picture" class="lazy" :title="_item.proName"  :alt="_item.proName" lazy="loading"/>
        </a>
      </li>
    </template>
  </ul>
</div>
</section>
</template>
<script type="text/javascript">
import OneBanner from 'components/common/banner/OneBanner'
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
    OneBanner
  }
}
</script>
