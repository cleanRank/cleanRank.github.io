<template>
  <div class="floor-two">
    <div class="floor-swiper">
      <swiper :options="swiperOption" v-if="floor.listFloorDetail.length > 1">
        <template v-for="(slide, index) in floor.listFloorDetail">
          <swiper-slide :key="index">
            <img width="100%" class="lazy" :src="slide.picUrl" @click="jumpTap(slide)" lazy="loading">
          </swiper-slide>
        </template>
        <div class="swiper-pagination" slot="pagination" v-show="floor.listFloorDetail.length > 1"></div>
      </swiper>
      <img v-else width="100%" class="lazy" :src="floor.listFloorDetail[0].picUrl" lazy="loading" @click="jumpTap(floor.listFloorDetail[0])">
    </div>
  </div>
</template>
<script type="text/javascript">
  import mixin from './mixin'
  export default {
    mixins: [mixin],
    data () {
      return {
        swiperOption: {
          effect: 'slide',
          paginationType: 'fraction',
          loop: true,
          autoplay: 4000,
          speed: 1000,
          initialSlide: 0,
          autoplayDisableOnInteraction: false,
          pagination: '.swiper-pagination',
          preventClicksPropagation: false,
          touchMoveStopPropagation: false
        }
      }
    },
    props: {
      floor: {
        required: true,
        type: Object
      }
    }
  }
</script>
<style media="screen" lang="scss" scoped>

</style>
