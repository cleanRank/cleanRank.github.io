<template>
  <div class="floor-good" @click="goDetail(good, 0, seckill)">
    <div class="good-img-wrap" :class="{'good-none':stock<1}">
      <img class="floor-good-img lazy" :src="good.picUrl || good.proImage" :title="good.productName" :alt="good.productName" lazy="loading">
    </div>
    <div class="floor-good-info">
      <p class="floor-good-name" :class="{'biserial-good-crossBorder floor-good-crossBorder-y':good.isCrossBorder == 1}">{{good.productName}}</p>
      <p class="floor-good-sub-name" v-if="good.words || good.viceTitle">{{good.words || good.viceTitle}}</p>
      <div class="floor-good-label biserial-good-label">
        <span class="biserial-good-info-price floor-good-price"><span class="biserial-good-info-price-before">￥</span>{{good.isActivity == '1'?good.activityPrice:(good.buyingPrice || good.price)}}</span>
        <span class="biserial-good-label-i" :class="Object.keys(this.seckill).length>0?'seckill':'promotion'"></span>
        <span class="good-label-rebate" v-if="rebateStatus!='0'">￥{{good.rebate}}</span>
      </div>
      <div class="floor-good-footnote">
        <!-- <div class="floor-good-sold">已售{{good.virtualNum}}件</div> -->
        <div class="floor-good-btn-wrap">
          <span class="floor-good-btn buy">抢购</span>
          <span class="floor-good-btn share" v-if="rebateStatus!='0'" @click.stop="goDetail(good, 1, seckill)">推广</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from './mixin'
export default {
  mixins: [mixin],
  props: {
    good: {
      required: true,
      type: Object
    },
    rebateStatus: {
      required: true,
      type: String
    },
    seckill: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  computed: {
    stock: function () {
      if (Object.keys(this.seckill).length>0) {
        return this.good.remainderCount
      } else {
        return this.good.productStock
      }
    }
  }
}
</script>

<style>

</style>
