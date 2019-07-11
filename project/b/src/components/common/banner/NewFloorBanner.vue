<template>
  <div class="new-floor-baner mb-16 ml-mr-24">
    <div class="small_banner new-floor-banner-con" v-if="banner && banner.length > 1">
      <swiper :options="NewSwiperOption">
        <template v-for="(slide, index) in banner">
          <swiper-slide :key="index">
            <a class="swiper-slide" :data-bdid="slide.id" :data-bdindex="index" :data-erow="dataErow" :data-modname="dataModname" @click="useParentFn(slide.h5Url, slide.name, productFloorName, slide, $event)">
              <img width="100%" class="lazy" v-lazy="slide.picUrl" lazy="loading">
            </a>
          </swiper-slide>
        </template>
      </swiper>
    </div>
    <div class="small_banner" v-else>
      <a class="small_banner_one swiper-slide" :data-bdid="banner[0].id" :data-bdindex="0" :data-erow="dataErow" :data-modname="dataModname" @click="useParentFn(banner[0].h5Url, banner[0].name, productFloorName, banner[0], $event)">
        <img width="100%" class="lazy" v-lazy="banner[0].picUrl" lazy="loading">
      </a>
    </div>
  </div>
</template>

<script>
  export default {
    name: "NewFloorBanner",
    props: {
      banner: {
        required: true,
        type: Array,
        default: []
      },
      productFloorName: {
        required: true,
        type: String
      },
      dataModname: {
        required: true,
        type: String
      },
      dataErow: {
        required: true,
        type: String
      }
    },
    data () {
      return {
        NewSwiperOption: {
          effect: 'slide',
          loop: false,
          autoplay: 2000,
          speed: 1000,
          initialSlide: 0,
          resistanceRatio: 0,
          autoplayDisableOnInteraction: true,
          preventClicksPropagation: true,
          touchMoveStopPropagation: true
          // preventClicksPropagation: false
        }
      }
    },
    methods: {
      useParentFn (url, name, lable, item, e) {
        this.$emit('bannerDetail', url, name, lable, item, e)
      }
    }
  }
</script>
