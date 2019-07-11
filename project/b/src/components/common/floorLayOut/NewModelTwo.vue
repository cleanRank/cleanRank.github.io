<template>
  <div class="new-floor" :style="{background: productFloor.bgColor}">
    <!-- new title start -->
    <div class="new-floor-title mb-16" v-if="productFloor.collection != '0' && productFloor.sourcePage =='index' && productFloor.image">
      <OneBanner :productFloor="productFloor"></OneBanner>
    </div>
    <!-- new title end -->
    <!-- new banner start -->
    <NewFloorBanner v-if="productFloor.sourcePage =='index' && productFloor.banner && productFloor.banner.length > 0" :banner="productFloor.banner" :productFloorName="productFloor.name" @bannerDetail="bannerDetail" :dataModname="'IndexModelTwoBanner'" :dataErow="'2'"></NewFloorBanner>
    <!-- new banner end -->
    <!-- new content start -->
    <div class="new-floor-content">
      <ul class="new-floor-content-list mt-mb-16">
        <template v-for="(item, index) in productFloor.prudouct" >
          <li class="new-index-good" @click="triggerUrl(item.productNo, item.proName, productFloor.name, item.activityNo, item, $event)" :key="index">
            <a href="javascript:;" @click="triggerUrl(item.productNo, item.proName, productFloor.name, item.activityNo, item, $event)">
              <div class="new-index-good-img-con">
                <template v-if="item.productStock && 0 >= item.productStock"><img class="new-index-active-good-img-gone" src="../../../assets/icon/icon/qiangguang.png" alt="已抢光"></template>
                <template v-if="item.label[0]"><img class="new-index-active-good-top-label" :src="item.label[0].labelimg"></template>
                <template v-if="item.label[1]"><img class="new-index-active-good-bottom-label" :src="item.label[1].labelimg"></template>
                <img v-lazy="item.proImage" class="lazy new-index-good-img" :title="item.proName"  alt="item.proName" lazy="loading"/>
              </div>
              <div class="new-index-good-details" v-if="productFloor.sourcePage =='index'">
                <div class="new-index-good-name" :class="{'crossBorder_goods':item.isCrossBorder==1}"><img  v-if="0" :src="position[2].labelimg" class="new-index-good-name-label">{{item.productName}}</div>
                <!-- 有分期 -->
                <div v-if="item.monthAmount && item.monthAmount > 0" class="new-pay-monthly">
                  <div class="new-index-good-price">
                    <span class="new-index-good-price-num"><em>￥</em>{{!item.activityPrice?item.price:item.activityPrice}}</span>
                    <del class="new-index-good-price-num new-index-good-price-originalCost" v-if="item.virtualPrice || item.originalCost"><em>￥</em>{{item.virtualPrice || item.originalCost}}</del>
                  </div>
                  <div class="new-index-good-pay-monthly new-index-good-pay-price" >月付：￥{{item.monthAmount}} 起</div>
                </div>
                <!--  没有分期 -->
                <div v-else class="new-pay-monthly-no">
                  <div class="new-index-good-price">
                    <del class="new-index-good-price-num new-index-good-price-originalCost" v-if="item.virtualPrice || item.originalCost"><em>￥</em>{{item.virtualPrice || item.originalCost}}</del>
                  </div>
                  <div class="new-index-good-present-price new-index-good-pay-price" >￥{{!item.activityPrice?item.price:item.activityPrice}}</div>
                </div>
              </div>
              <p class="preview_box" v-if="productFloor.preview && productFloor.preview !=''">{{item.productNo}}</p>
            </a>
          </li>
        </template>
      </ul>
    </div>
    <!-- new content end -->
  </div>
</template>
<script type="text/javascript">
import OneBanner from 'components/common/banner/OneBanner'
import NewFloorBanner from '../banner/NewFloorBanner'
import { positionPage } from 'lib/until'
export default {
  created () {
    this.getPosition()
  },
  props: {
    productFloor: {
      required: true,
      type: Object
    }
  },
  methods: {
    getPosition () {
      let prudouct = this.productFloor.prudouct
      if (prudouct) {
        prudouct.forEach((i) => {
          let label = i.label
          i.label = positionPage(label, 2)
        })
      }
    },
    triggerUrl (productNo, productName, label, activityNo, item, e) {
      let activityNos = !activityNo ? '' : activityNo
      let isActivity = !activityNo ? '0' : '1'
      window.location.href = '#/detail?productNo='+productNo +'&isActivity='+ isActivity +'&activityNo='+ activityNos
    },
    bannerDetail (url, name, lable, e) {
      window.location.href = url
    }
  },
  components: {
    OneBanner,
    NewFloorBanner
  }
}
</script>
<style media="screen" lang="scss" scoped>
  @import "../../../assets/scss/app";
  @import "../../../assets/scss/flex";
  // new index
  .new-index-good{
    @include px2rem(width, 296);
    @include px2rem(margin-bottom, 14);
    @include px2rem(border-radius, 12);
    box-shadow: 0 0 0.16rem 0 rgba(0,0,0,0.06), 0 0.10667rem 0.10667rem 0 rgba(0,0,0,0.02);
    background: #fff;
    overflow: hidden;
    @include px2rem(margin-left, 7);
    @include px2rem(margin-right, 7);
    @include px2rem(padding-right, 24);
    @include px2rem(padding-left, 24);
    position: relative;
    .preview_box{
      position: absolute;
      width: 100%;
      @include px2rem(height,60);
      @include px2rem(line-height,60);
      background: rgba(0,0,0,0.7);
      z-index: 4;
      color: #ffffff;
      text-align: center;
      @include font-dpr(24);
      top:0;
      left: 0;
    }
  }
  .new-index-good-img-con{
    @include px2rem(padding-top, 16);
    @include px2rem(padding-bottom, 16);
    @include px2rem(width, 260);
    @include px2rem(height, 260);
    margin: 0 auto;
    position: relative;
    .new-index-active-good-top-label,.new-index-active-good-bottom-label{
      position: absolute;
      left: 0;
      @include px2rem(width, 30);
      @include px2rem(height, 30);
    }
    .new-index-active-good-top-label{
      @include px2rem(top, 5);
    }
    .new-index-active-good-bottom-label{
      bottom: 0;
    }
    .new-index-active-good-img-gone{
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      @include px2rem(width, 150);
      @include px2rem(height, 150);
    }
    .new-index-good-img{
      @include px2rem(width, 260);
      @include px2rem(height, 260);
    }
  }
  .new-index-good-img-con img[lazy=loading] {
    background: url('../../../assets/icon/banner/lazy_proudt.png') no-repeat;
    background-size: 100% 100%;
  }
  .new-index-good-name{
    @include px2rem(height, 68);
    @include px2rem(line-height, 37);
    color: #333;
    @include font-dpr(26);
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    @include px2rem(margin-bottom, 8);
    .new-index-good-name-label{
      vertical-align: middle;
      @include px2rem(margin-right, 10);
      @include px2rem(max-height, 30);
      @include px2rem(min-height, 28);
      display: inline-block;
    }
  }
  .new-index-good-name-sub{
    color: #999;
    @include lines-ellipsis(1);
    @include px2rem(margin-bottom, 14);
    .label_img {
      @include px2rem(margin-right, 10);
      @include px2rem(max-width, 110);
      vertical-align: text-bottom;
      display: inline;
    }
  }
  .new-index-good-price{
    @include px2rem(line-height, 28);
    @include px2rem(height, 24);
    @include px2rem(padding-bottom, 16);
  }
  .new-index-good-price-num{
    color: #333;
    @include px2rem(margin-right, 14);

  }
  .new-index-good-sold-num{
    color: #999;
    @include font-dpr(20);
  }
  .new-index-good-pay-monthly{
    color: $redColor;
    @include font-dpr(26);
  }
  .new-index-good-pay-price{
    @include px2rem(line-height, 37);
    @include px2rem(height, 32);
    @include px2rem(padding-bottom, 24);
  }
  .new-index-good-present-price{
    color: $redColor;
    @include font-dpr(30);
  }
  .new-index-good-price-originalCost{
    color: #999;
    @include font-dpr(20);
  }
</style>
