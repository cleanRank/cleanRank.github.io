<template>
  <div class="floor-fourteen">
    <div class="floor-fourteen-banner big-loading">
      <img class="floor-fourteen-img lazy" v-lazy="floor.listFloorDetail[0].picUrl" v-if="floor.listFloorDetail[0].picUrl" @click="bannerJump(floor.listFloorDetail[0].linkType, floor.listFloorDetail[0].floorLinkUrl)" lazy="loading">
    </div>
    <ul class="floor-swiper-good">
      <li class="good " v-for="(good, index) in floor.listFloorDetail[0].prudouct" :key="index" @click="goDetail(good)">
        <div class="good-img-wrap" :class="{'good-none':good.productStock<1}">
          <img class="good-img lazy" v-lazy="good.proImage" :alt="good.productName" lazy="loading">
        </div>
        <p class="good-name">{{good.productName}}</p>
        <p class="good-price">￥{{good.price}}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import mixin from './mixin'
export default {
  mixins: [mixin],
  data () {
    return {}
  },
  props: {
    floor: {
      required: true,
      type: Object
    }
  }
}
</script>

