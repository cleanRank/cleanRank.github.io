<template>
  <div class="floor-four">
    <ul class="floor-biserial-good" :style="{background: floor.listFloorDetail[0].defaultBgColor}">
      <li class="biserial-good" v-for="(good, index) in floor.listFloorDetail[0].prudouct" :key="index" @click="goDetail(good)">
        <div class="good-img-wrap" :class="{'good-none':good.productStock<1}">
          <img class="biserial-good-img lazy" v-lazy="good.proImage" :title="good.proName"  :alt="good.proName" lazy="loading">
        </div>
        <p class="biserial-good-name" :class="{'biserial-good-crossBorder':good.isCrossBorder == 1}">{{good.proName}}</p>
        <div class="biserial-good-label">
          <span class="biserial-good-label-i promotion"></span>
          <span class="good-label-rebate" v-if="floor.rebateStatus!='0'">￥{{good.rebate}}</span>
        </div>
        <div class="biserial-good-info">
          <span class="biserial-good-info-price"><span class="biserial-good-info-price-before">￥</span>{{good.isActivity == '1'? good.activityPrice:good.price}}</span>
          <!-- <span class="biserial-good-info-sold">已售{{good.virtualNum}}件</span> -->
        </div>
      </li>
    </ul>
  </div>
</template>
<script type="text/javascript">
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
<style media="screen" lang="scss" scoped>
@import "../../../assets/scss/app";
.floor-wrap{
  @include px2rem(padding, 20 17);
}
</style>
