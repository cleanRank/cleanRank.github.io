<template id="">
<section>
  <div class="base_info">
    <h3 class="base_info_title"  :class="{'crossBorder_goods':goodsInfo.isCrossBorder==1}">{{goodsInfo.productName}}</h3>
    <h3 class="vicetitle" v-if="goodsInfo.viceTitle != ''">{{goodsInfo.viceTitle}}</h3>
  </div>
  <div class="price">
      <div class="flex">
        <span class="cell_0"><b class="c_red font15">¥</b><var class="num c_red">{{goodsInfo.jdPrice || 0}}</var></span>
        <del class="cell_0 c_999 font14 virtualPrice_num" v-if="goodsInfo.virtualPrice || goodsInfo.jdPrice2">￥{{goodsInfo.virtualPrice || goodsInfo.jdPrice2}}</del>
        <div class="tag_price c_red cell_0">{{goodsInfo.diffSes&&goodsInfo.diffSes>0?'秒杀价':'促销价'}}</div>
        <div class="rebatePrice mg16 cell_1" v-if="goodsInfo.rebateStatus && goodsInfo.rebateStatus!='0'&& goodsInfo.rebate">
          <span class="rebateBefore">赚</span><span class="rebatePriceNum">￥{{goodsInfo.rebate}}</span>
        </div>
        <div class="salesVolume"><span>已售{{goodsInfo.salesVolume}}件</span></div>
      </div>
  </div>
</section>
</template>
<script type="text/javascript">
  import { positionPage } from 'lib/until'
  export default {
    data () {
      return {
        label: []
      }
    },
    props: {
      goodsInfo: {
        required: true,
        type: Object
      }
    },
    watch: {
      goodsInfo: {
        handler (val, oldval) {
          if (val && val != oldval) {
            this.getPosition()
          }
        }
      }
    },
    created () {
    },
    methods: {
      getPosition () {
        this.label = positionPage(this.goodsInfo.label, 5)
      }
    }
  }
</script>
<style lang="scss" type="text/css" media="screen" scoped>
@import "../../assets/scss/_app";
@import "../../assets/scss/flex";
.label_bq_box {
  @include flex(1);
  @include display-flex;
  // @include justify-content(space-between);
  @include align-items(center);
  @include px2rem(padding-left, 50);
  .label_imgs{
    @include px2rem(height,30);
    @include px2rem(margin-right,30);
  }
  // .label_bq_item {
  //   @include flex(1);
  //   text-align: center;
  // }
}
.tag_price {
  @include align-self(center);
  border: 1px solid $redColor;
  @include px2rem(border-radius, 6);
}
</style>
