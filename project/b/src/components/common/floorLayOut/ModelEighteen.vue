<template>
<ul class="modelEighteen_wrap" :class="bgData.bgImg && bgData.bgImg!=''?'haveImg':''" :style="{'background-image': 'url(' + bgData.bgImg + ')'}">
  <template v-for="(item, i) in product">
    <li class="modelEighteen_item" :key="i" @click="goDetali(item)">
      <img :src="item.picUrl || item.picture || item.proImage" class="model_banner">
      <div class="modelEighteen_txt_box">
        <p class="productName_title font17" :class="{'crossBorder_goods':item.isCrossBorder==1}" v-text="item.productName"></p>
        <p class="viceTitle_title c_999 font13" v-text="item.viceTitle || item.productSubhead || item.qualityViceTitle"></p>
        <p class="prices_box flex">
          <span class="productStatus c_red fl">{{item.sourcePage == 'spike'?'秒杀价':'促销价'}}</span>
          <span class="buyingPrice_box c_red fl">¥<b>{{item.buyingPrice || item.price}}</b></span>
          <span class="rebatePrice fl" v-if="newList.rebateStatus!=0"><span class="rebateBefore">赚</span><span class="rebatePriceNum">￥{{item.rebate}}</span></span>
          <!-- <del class="originPrice_box font13 c_777" v-if="item.originPrice">￥{{item.originPrice}}</del> -->
        </p>
        <div class="prbtn_wrap"><span class="rustbuy_btn c_main">抢购</span><span class="share_btns" @click.stop="goDetali(item, 1)" v-if="newList.rebateStatus!=0">推广</span></div>
      </div>
    </li>
  </template>
</ul>
</template>
<style  media="screen" lang="scss" scoped>
  @import "../../../assets/scss/app";
  .haveImg{
    @include px2rem(padding-top, 95);
    background-size: 100% auto;
    background-repeat: no-repeat;
    background-position: top center;
  }
</style>
<script>
export default {
  props: {
    product: {
      required: true,
      type: Array,
      default: []
    },
    bgData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    newList: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  methods: {
    goDetali (item, type) {
      // 去详情
      let {productNo, activityNo, status, remainderCount} = item
      // 判断是否是秒杀商品
      if (status) {
        if (status != 1 || remainderCount == 0) {
          activityNo = ''
        }
      }
      this.$router.push({
        path: '/detail',
        query: {
          productNo,
          activityNo,
          isActivity: activityNo ? 1 : 0,
          share: type
        }
      })
    }
  }
}
</script>
