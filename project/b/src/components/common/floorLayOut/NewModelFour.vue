<template>
  <div class="new-floor">
    <!-- new title start -->
    <div class="new-floor-title mb-16" v-if="productFloor.sourcePage =='index' && productFloor.image">
      <OneBanner :productFloor="productFloor"></OneBanner>
    </div>
    <!-- new title end -->
    <!-- new banner start -->
    <NewFloorBanner v-if="productFloor.sourcePage =='index' && productFloor.banner && productFloor.banner.length > 0" :banner="productFloor.banner" :productFloorName="productFloor.name" @bannerDetail="bannerDetail" :dataModname="'ModelFourBanner'" :dataErow="'0'"></NewFloorBanner>
    <!-- new banner end -->
    <!-- new content start -->
    <div class="new-index-active-product" :style="{background: productFloor.bgColor}" :class="productFloor.sourcePage =='activityNew'?productFloor.floorId:'activeProductsWrapIndex'">
        <div class="new-index-active-scroll">
          <div class="new-index-active-good" v-for="(good, index) in productFloor.prudouct"  @click="triggerUrl(good.productNo, good.proName, productFloor.name, good.activityNo, good, $event)"  :data-bdid="good.id" :data-bdindex="index" :data-erow="0" data-modname="ModelFourProduct" :key="index">
            <div class="new-index-active-good-imgWrap">
              <template v-if="good.productStock && 0 >= good.productStock">
                <img class="new-index-active-good-img-gone" src="../../../assets/icon/icon/qiangguang.png" alt="已抢光">
              </template>
              <template v-if="good.label[0]"><img class="new-index-active-good-top-label" :src="good.label[0].labelimg" ></template>
              <template v-if="good.label[1]"><img class="new-index-active-good-bootom-label" :src="good.label[1].labelimg"></template>
              <img :src="good.proImage" :title="good.proName" :alt="good.proName" class="lazy new-index-active-good-img">
            </div>
            <p class="new-index-active-good-title">{{good.proName}}</p>
            <!--<p v-if="productFloor.stagePriceStatus==1" class="new-index-active-good-price installment-price">-->
              <!--<span class="new-index-active-good-price-num">-->
                <!--<em>￥</em>{{good.monthAmount}}-->
              <!--</span>-->
              <!--<span class="new-index-active-good-price-original">×{{good.monthnum}}期</span>-->
            <!--</p>-->
            <p class="new-index-active-good-price">
              <span class="new-index-active-good-price-num">
                <em>￥</em>{{!good.activityPrice?good.price:good.activityPrice}}
              </span>
              <!--<span class="new-index-active-good-price-original"><em>￥</em>未定义</span>-->
            </p>
          </div>
        </div>
      </div>
    <!-- new content end -->
  </div>
</template>

<script>
  import OneBanner from 'components/common/banner/OneBanner'
  import NewFloorBanner from '../banner/NewFloorBanner'
  import { positionPage } from 'lib/until'
  export default {
    name: "NewModelFour",
    components: {
      OneBanner,
      NewFloorBanner
    },
    props: {
      productFloor: {
        required: true,
        type: Object
      }
    },
    created () {
      this.getPosition()
    },
    methods: {
      getPosition () {
        let prudouct = this.productFloor.prudouct
        if (prudouct) {
          prudouct.forEach((i) => {
            let label = i.label
            i.label = positionPage(label, 4)
          })
        }
      },
      triggerUrl (productNo, productName, label, activityNo, item, e) {
        let activityNos = !activityNo ? '' : activityNo
        let isActivity = !activityNo ? '0' : '1'
        window.location.href = '#/detail?productNo='+productNo +'&isActivity='+ isActivity +'&activityNo='+ activityNos
      },
      bannerDetail (url, name, lable, item, e) {
        window.location.href=url
      }
    }
  }
</script>

<style lang="scss">
  @import "../../../assets/scss/app";
  /* new index start */
  .new-floor-title{
    .title_imgs{
      img{
        @include px2rem(height, 80);
      }
    }
  }
  .new-index-active-product{
    height: auto;
  }
  .new-index-active-scroll{
    white-space: nowrap;
    overflow-x: scroll;
    @include px2rem(padding,0 24);
    -webkit-overflow-scrolling:touch;
    -ms-overflow-style: none;
    overflow: -moz-scrollbars-none;
    -webkit-transform: translateZ(0px);
    position: static;
  }
  .new-index-active-scroll::-webkit-scrollbar {display: none; width: 0;height: 0; opacity: 0;width:0;height:0}
  .new-index-active-good{
    display: inline-block;
    @include px2rem(width, 180);
    @include px2rem(height, 300);
    box-shadow: 0 0 0.16rem 0 rgba(0,0,0,0.06), 0 0.10667rem 0.10667rem 0 rgba(0,0,0,0.02);
    @include px2rem(border-radius, 12);
    @include px2rem(margin-top, 16);
    @include px2rem(margin-bottom, 16);
    @include px2rem(margin-right, 16);
    @include px2rem(padding, 0 10);
    background: #fff;

  }
  .new-index-active-good:last-of-type{
    margin-right: 0;
  }
  .new-index-active-good-imgWrap{
    @include px2rem(margin, 10 0);
    @include px2rem(width, 180);
    @include px2rem(height, 180);
    position: relative;
  }
  .new-index-active-good-imgWrap img[lazy=loading] {
    background: url('../../../assets/icon/banner/lazy_proudt.png') no-repeat;
    background-size: 100% 100%;
  }
  .new-index-active-good-img-gone{
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
  }
  .new-index-active-good-top-label,.new-index-active-good-bootom-label{
    position: absolute;
    @include px2rem(height, 34);
    @include px2rem(left, -5);
  }
  .new-index-active-good-top-label{
    @include px2rem(top, -5);
  }
  .new-index-active-good-bootom-label{
    @include px2rem(bottom, -34);
  }
  .new-index-active-good-img{
    @include px2rem(width, 180);
    @include px2rem(height, 180);
  }
  .new-index-active-good-title{
    color: #333;
    @include font-dpr(26);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    @include px2rem(line-height, 37);
    @include px2rem(padding-top, 12);
    @include px2rem(padding-left, 6);
    @include px2rem(padding-right, 6);
    text-align: center;

  }
  .new-index-active-good-price{
    @include lh(34, 34);
    @include px2rem(padding-top, 4);
    text-align: center;
  }
  .installment-price{
    em{

    }
  }
  .new-index-active-good-price-num{
    color: $redColor;
    @include font-dpr(30);
    em {
      @include font-dpr(20);
    }
  }
  .new-index-active-good-price-original{
    text-decoration: line-through;
    color: #999;
    @include font-dpr(20);
    color: #999;
    &>em {
      @include font-dpr(10);
    }
  }

</style>
