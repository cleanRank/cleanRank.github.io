<template>
<section>
<OneBanner v-if="productFloor.sourcePage =='index' && productFloor.image" :productFloor="productFloor"></OneBanner>
<div class="banner_model" v-if="productFloor.sourcePage =='index' && productFloor.banner && productFloor.banner.length > 0">
<div class="small_banner">
  <div class="swiper-container02 swiper-container22">
    <swiper :options="swiperBannerOption">
      <template v-for="(slide, index) in productFloor.banner">
        <swiper-slide :key="index">
          <a class="swiper-slide banner_a" :data-bdid="slide.id" :data-bdindex="index" :data-erow="2" data-modname="ModelSix" @click="bannerDetail(slide.h5Url, slide.name, productFloor.name, slide, $event)">
            <img :src="slide.picUrl" class="lazy"  :title="slide.name"  :alt="slide.name" width="100%" lazy="loading"/>
          </a>
        </swiper-slide>
      </template>
      <!-- <div class="swiper-pagination bt6" v-show="productFloor.banner.length > 1" slot="pagination"></div> -->
    </swiper>
  </div>
</div>
</div>
<div class="floor_conent modelsix_box">
  <ul class="new_layout_box6">
    <template v-for="(_item, index) in productFloor.prudouct">
      <li :class="'lay_it'+(index+1)" :key="index">
          <a href="javascript:;" :data-bdid="_item.id" :data-bdindex="index" :data-erow="2" data-modname="ModelSix" @click="bannerDetail(_item.urlContent, _item.name, productFloor.name, _item, $event)"  class="js_pro_detail">
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
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import makeData from '../../../mixin/makeData'
  export default {
    mixins: [makeData],
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
    methods: {
      bannerDetail (url, name, lable, item, e) {
        window.location.href=url
      }
    },
    components: {
      OneBanner,
      swiper,
      swiperSlide
    },
    props: {
      productFloor: {
        required: true,
        type: Object
      }
    }
  }
</script>
