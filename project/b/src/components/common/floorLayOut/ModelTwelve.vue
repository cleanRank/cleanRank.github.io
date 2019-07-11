<template>
<div class="floor">
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
    </swiper>
  </div>
</div>
</div>
<section id="seckillBox">
  <!-- 抢购商品轮播图 s-->
  <div class="activeProductsWrap">
      <swiper :options="swiperActivesOption" >
            <swiper-slide class="seckill_item new_layout_box12"  v-for="(_item, index) in productFloor.prudouct" :key="index">
              <a href="javascript:;" @click="bannerDetail(_item.urlContent, _item.name, productFloor.name, _item)">
                <img v-lazy="_item.picture" class="lazy" :title="_item.proName"  :alt="_item.proName" lazy="loading"/>
              </a>
          </swiper-slide>
      </swiper>
  </div>
  <!-- 抢购商品轮播图 e-->
</section>
</div>
</template>
<script type="text/javascript">
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
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
        },
        swiperActivesOption: {
          initialSlide: 0,
          slidesPerView: 3.12,
          // spaceBetween: 10,
          // spaceBetween: 20,
          resistanceRatio: 0,
          autoplayDisableOnInteraction: false,
          preventClicksPropagation: false,
          touchMoveStopPropagation: false
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
      checkMore () {
        window.location.href = this.productFloor.banner[0].h5Url
      },
      bannerDetail (url, name, lable, item) {
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
  .seckill_item .tag_img {
    height: .45rem;
  }
  .border_box{
    border: 1px solid $borderColor;
  }
  .picwrap {
    position: relative;
    width: 2.4rem;
    height: 2.4rem;
    margin: .5rem auto;
    .top {
      top: -0.2rem
    }
    .bottom {
      bottom: -0.2rem;
    }
  }
  // .activeProductsWrapIndex{
  //   @include px2rem(padding-left, 15);
  // }
  .activeProductsWrap{
    padding: 0 0 0 0.2rem;
  }
  .new_layout_box12{
    width: 3.13333rem !important;
    img{
     @include px2rem(width, 220);
      @include px2rem(height, 260);
      // margin: 0 auto;
    }
  }
</style>
