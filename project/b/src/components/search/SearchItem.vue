<template>
  <li :data-bdid="item.id" data-erow="1" data-modname="indexModelOneProduct" @click.stop='buryPoint(item, $event)' :class="['model_ones', sourcePage == 'activityNew'?'activity_model_ones':'']">
    <div class="product-item">
    <div class="pi-picwp">
      <div class="lootall-img-clear lootall_one" v-if="item.productStock && 0 >= item.productStock"><img src="../../assets/icon/icon/qiangguang.png" alt="已抢光"></div>
      <template v-if="position[0]" ><img class="tag_img label_img top-label" :src="position[0].labelimg"></template>
      <template v-if="position[1]" ><img class="tag_img label_img bottom-label" :src="position[1].labelimg"></template>
      <img v-lazy="item.proImage" class="lazy pi-pic" :title="item.proName"  alt="item.proName" lazy="loading"/>
    </div>
    <div class="pi-descwp">
      <div class="pi_title" :class="{'crossBorder_goods':item.isCrossBorder==1}"  style="text-align: left"><img v-if="position[2]" :src="position[2].labelimg" class="label_img">{{item.productName}}</div>
      <!-- <p class="oneQualityViceTitle"><img v-if="position[3]" :src="position[3].labelimg" class="label_img">{{item.productSubhead}}</p> -->
      <p class="font12 c_red" v-if="item.monthAmount">月付：￥{{item.monthAmount}}起</p>
      <p class="ActivityGoodLabelWrap" v-if="item.activityLabel && item.activityLabel.length>0">
        <span class="ActivityGoodLabel" v-for="(label, i) in item.activityLabel" :key="i">{{label.labelName}}</span>
      </p>
      <p class="prices_box flex">
        <span class="productStatus c_red fl"  v-if="sourcePage == 'activityNew'">促销价</span>
        <span class="buyingPrice_box c_red fl">¥<b class="info_price">{{item.activityPrice || item.price}}</b></span>
        <span class="rebatePrice fl" v-if="sourcePage == 'activityNew'&&newList.rebateStatus!=0"><span class="rebateBefore">赚</span><span class="rebatePriceNum">￥{{item.rebate}}</span></span>
        <!-- <del class="originPrice_box font13 c_777" v-if="item.originPrice">￥{{item.originPrice}}</del> -->
      </p>

      <div class="info" style="text-align: left">
        <p class="proGeneralize_btn">
          <span class="qiang" v-if="sourcePage == 'activityNew'">抢购</span>
          <span class="share_btns" @click.stop="goDetali(item, 1)" v-if="sourcePage == 'activityNew'&&newList.rebateStatus!=0">推广</span>
        </p>
      </div>
    </div>
    </div>
  </li>
</template>
<script>
import { positionPage } from 'lib/until'
export default {
  props: ['item', 'sourcePage', 'newList'],
  data () {
    return {
      position: []
    }
  },
  created () {
    this.getPosition()
  },
  methods: {
    getPosition () {
      let label = this.item.label
      this.position = positionPage(label, 1)
    },
    buryPoint (item, e) {
      let {productNo, isActivity, activityNo} = item
      this.$router.push({path: '/detail', query: {productNo, isActivity: isActivity || 0, activityNo: activityNo || ''}})
    },
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
<style scoped lang="scss">
@import "../../assets/scss/app";
@import "../../assets/scss/flex";
// .ac_cell_1 .activity_img_cell {
//   margin: 0.65rem 0.26667rem 0rem 0rem;
// }
.info{
  padding-top: 0.2rem;
}
.product-item {
  position: relative;
  @include display-flex;
  // @include align-items(center);
  @include px2rem(height, 322);
  // @include px2rem(margin-bottom, 20);
}
.borderBottom{
border-bottom: 1px solid $borderColor;
}
.model_ones{
  @include px2rem(padding, 0 30);
  background: #fff;
  border-bottom: 1px solid $borderColor;
  &.activity_model_ones{
    @include px2rem(padding, 0 15);
    background: none;
    border-bottom: none;
  }
}
.model_ones:last-child{
  div{
    border: none;
  }
}
.top-label {
  @include px2rem(top, -20);
}
.bottom-label {
  @include px2rem(bottom, -20);
}
.pi-picwp {
  position: relative;
  @include flex(0);
  @include px2rem(width, 260);
  @include px2rem(height, 260);
  @include px2rem(margin-right, 30);
  @include px2rem(margin-top, 31);
  @include flex-basis(260);
}
.pi-pic {
 @include px2rem(width, 260);
  @include px2rem(height, 260);
}
.pi-descwp {
  @include flex(1);
  @include px2rem(margin-top, 41);
}
.pi_title {
  @include lines-ellipsis(2);
  @include font-dpr(26);
  @include px2rem(line-height,40);
  @include px2rem(margin-bottom, 12);
  color: #444;
  .label_img {
    vertical-align: middle;
    @include px2rem(margin-right,10);
  }
}
// .tag_img {
//   height: .45rem;
//   width: auto;
// }
.label_img + .label_img {
  @include px2rem(margin-left, 15);
}
.oneQualityViceTitle{
  // @include display-flex;
  // @include align-items(center);
  color: #999;
  @include px2rem(height, 64);
  @include px2rem(line-height, 64);

  @include lines-ellipsis(1);
  .label_img {
    @include px2rem(margin-right, 10);
    @include px2rem(max-width, 110);
    vertical-align: text-bottom;
    display: inline;
  }
  // .subTitle {
  //   overflow: hidden;
  //   text-overflow: ellipsis;
  //   display: -webkit-box;
  //   -webkit-line-clamp: 1;
  //   -webkit-box-orient: vertical;
  // }
}
.info_price{
  @include px2rem(padding-right,10);
  color: $color333;
}
.index_price{
   @include font-dpr(40);
    color: $redColor;
    // font-weight: bold;
}
.ori_price {
  color: #999;
}
.has_purchased{
  float: right;
  @include px2rem(padding-right, 15);
  color: #999;
}
.goods_detail_box {
  text-align: left;
}
.lootall-img-clear{
    position: absolute;
    z-index: 4;
    left: 50%;
    @include px2rem(width, 128);
    @include px2rem(height, 128);
    top: 50%;
    transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%);
    &>img{
      @include px2rem(width, 128);
      @include px2rem(height, 128);
      margin: 0;
    }
}
.activity_model_ones{
  .product-item{
    @include px2rem(height, 300);
    background: #fff;
    @include px2rem(margin-top, 15);
    @include px2rem(border-radius, 15);
  }
  .pi-picwp{
    @include px2rem(margin, 0 16);
  }
  .pi_title{
     @include lines-ellipsis(1);
    @include font-dpr(32);
    @include px2rem(line-height,40);
    @include px2rem(height,40);
  }
  .productStatus{
    @include font-dpr(26);
    display: inline-block;
    // background:rgba(255,48,48,0.10);
    @include px2rem(border-radius, 6);
    @include px2rem(padding, 6 6 7);
    overflow: hidden;
    p{
      float: left;
    }
  }
  .proGeneralize_btn{
    text-align: right;
    @include px2rem(margin-right, 28);
    span{
      // @include font-dpr(22);
      // background:$mainColor;
      // color: #fff;
      // @include px2rem(padding, 5 20);
      // @include px2rem(border-radius, 20);
        display: inline-block;
        line-height: 1.4;
        @include px2rem(padding, 9 30 6);
        border: 1.5px solid $mainColor;
        @include px2rem(border-radius, 30);
        @include font-dpr(28);
    }
    .qiang{
      color:#fd455f
    }
    .share_btns{
        background: $mainColor;
        color: #fff;
        @include px2rem(margin, 0 4 0 16);
    }
  }
}
.buyingPrice_box{
  @include px2rem(margin, 0);
  b{
    color:#ff5a60
  }
}
.ActivityGoodLabelWrap{
  font-size: 0;
  .ActivityGoodLabel{
    display: inline-block;
    @include font-dpr(24);
    @include px2rem(padding, 2 4);
    @include px2rem(border-radius, 4);
    border: 1px solid $redColor;
    color: $redColor;
    @include px2rem(line-height, 26);
    @include px2rem(margin-right, 12);
    @include px2rem(margin-bottom, 8);
  }
}
</style>
