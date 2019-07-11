<template>
  <li class="model-good good-single-row" @click="goDetail(good, 0, seckill)">
    <div class="good-img-wrap" :class="{'good-none':stock<1}">
      <img class="good-img lazy" :src="good.proImage" :title="good.productName" :alt="good.productName" lazy="loading">
    </div>
    <div class="good-info">
      <div class="good-info-name" :class="{'biserial-good-crossBorder floor-good-crossBorder-y':good.isCrossBorder == 1}">{{good.productName}}</div>
      <div class="good-info-sub-name floor-good-sub-name" v-if="good.viceTitle">{{good.words?good.words:good.viceTitle}}</div>
      <div class="good-info-label biserial-good-label">
        <span class="biserial-good-info-price good-info-price"><span class="biserial-good-info-price-before">￥</span>{{good.isActivity == '1'?good.activityPrice:(good.buyingPrice || good.price)}}</span>
        <span class="biserial-good-label-i" :class="good.buyingPrice?'seckill':'promotion'"></span>
        <span class="good-label-rebate" v-if="rebateStatus!='0'">￥{{good.rebate}}</span>
      </div>
      <!-- <div class="good-info-sold">已售{{good.virtualNum}}件</div> -->
      <div class="good-info-btn-wrap floor-good-btn-wrap">
        <span class="floor-good-btn buy">抢购</span>
        <span class="floor-good-btn share" v-if="rebateStatus!='0'" @click.stop="goDetail(good, 1, seckill)">推广</span>
      </div>
    </div>
  </li>
</template>

<script>
import mixin from './mixin'
export default {
  mixins: [mixin],
  data () {
    return {}
  },
  computed: {
    stock: function () {
      if (Object.keys(this.seckill).length>0) {
        return this.good.remainderCount
      } else {
        return this.good.productStock
      }
    }
  },
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
  }
}
</script>

