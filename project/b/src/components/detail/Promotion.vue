<template>
  <section class="salesPromotion">
    <div class="salesPromotionCon flex">
      <div class="salesPromotionTit">促销</div>
      <div class="salesPromotionList cell_1" @click="showMask">
        <div class="salesPromotionColumn flex" v-for="(item, index) in salesPromotionList" :key="index" v-show="index<3">
          <p class="salesPromotionColumnLabel">{{item.activityTypeDesc}}</p>
          <p class="salesPromotionColumnDesc" v-if="item.activityType!=4 && item.activityType!=1">
            <span v-for="(_item, idx) in item.discountRuleList" :key="idx">{{_item.ruleDesc}}<em v-if="item.discountRuleList.length-1 != idx">，</em></span></p>
          <p class="salesPromotionColumnDesc" v-if="item.activityType==4 || item.activityType==1">{{item.activityDesc}}</p>
        </div>
      </div>
    </div>
    <div class="salesPromotionBig" v-if="bMask">
      <div class="salesPromotionBigCon">
        <p class="salesPromotionBigDelivery">活动促销<span @click="showMask" class="salesPromotionBigClose"></span></p>
        <!-- <p class="salesPromotionBigRemark">以下促销活动仅可选其一，可在购物车自行更改</p> -->
        <ul class="salesPromotionBigList">
          <li class="salesPromotionBigItem" :class="{'rightIcon':item.activityType != 1 && item.activityType != 4 }" v-for="(item, index) in salesPromotionList" :key="index" @click="goActivityPage(item)">
            <p class="salesPromotionColumnLabel">{{item.activityTypeDesc}}</p>
            <p class="salesPromotionColumnList" v-if="item.activityType!=4 && item.activityType!=1"><span v-for="(_item, idx) in item.discountRuleList" :key="idx">{{_item.ruleDesc}}<span v-if="item.discountRuleList.length-1 != idx">，</span></span></p>
            <p class="salesPromotionColumnDesc" v-if="item.activityType==4 || item.activityType==1">{{item.activityDesc}}</p>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
<script>
import { app } from 'lib/until'
export default {
  data () {
    return {
      bMask: false
    }
  },
  props: {
    salesPromotionList: {
      required: true,
      type: Array,
      default: () => {
        return []
      }
    }
  },
  methods: {
    showMask () {
      this.bMask = !this.bMask
      this.$emit('editMask', this.bMask)
    },
    goActivityPage (detail) {
      let {fromChannel, ver} = this.$store.state.config
      let activityNo = detail.activityNo
      if (fromChannel == 'sxypApp' && +(ver.replace(/\./g, '')) < 230) {
        this.showToast({
          msg: '请下载最新版本的客户端！'
        })
        return
      }
      if (!activityNo) {
        return
      }
      if (fromChannel == 'sxypApp') {
        let obj = {
          activityNo
        }
        app.goActivityProduct(obj)
        return
      } else {
        this.$router.push({
          path: '/activityGoods',
          query: {
            activityNo: activityNo
          }
        })
      }
    }
  }
}
</script>
