<template>
  <div class="floor-thirteen" :style="{background: floor.listFloorDetail[0].defaultBgColor}">
    <img class="thirteen-banner" v-if="floor.listFloorDetail[0].picUrl" :src="floor.listFloorDetail[0].picUrl" alt="">
    <div class="floor-thirteen-con" :class="{'pd20': !floor.listFloorDetail[0].picUrl}">
      <div class="three-rows-good corner-mark" v-for="(good, index) in floor.listFloorDetail[0].prudouct" :key="index" @click="goDetail(good)">
        <div class="good-img-wrap" :class="{'good-none':good.productStock<1}">
          <img class="good-img lazy" v-lazy="good.proImage" :title="good.productName" :alt="good.productName" lazy="loading">
        </div>
        <p class="good-name">{{good.productName}}</p>
        <div class="good-info biserial-good-label">
          <span class="biserial-good-info-price good-info-price"><span class="biserial-good-info-price-before">￥</span>{{good.isActivity == '1'? good.activityPrice:good.price}}</span>
        </div>
        <p class="biserial-good-label mb-6" v-if="floor.rebateStatus!='0'">
          <span class="good-label-rebate">￥{{good.rebate}}</span>
        </p>
      </div>
    </div>
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
