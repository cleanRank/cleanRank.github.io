<template>
<div class="floor">
  <OneBanner v-if="productFloor.sourcePage =='index' && productFloor.image" :productFloor="productFloor"></OneBanner>
  <div class="banner_model" v-if="productFloor.sourcePage =='index' && productFloor.banner && productFloor.banner.length > 0">
  <div class="small_banner">
    <div class="swiper-container02 swiper-container22">
      <swiper :options="swiperBannerOption">
        <template v-for="(slide, index) in productFloor.banner">
          <swiper-slide :key="index">
            <a :href="slide.h5Url" class="swiper-slide banner_a" :data-bdid="slide.id" :data-bdindex="index" :data-erow="2" data-modname="IndexModelEightBanner">
              <img :src="slide.picUrl" class="lazy"  :title="slide.name"  :alt="slide.name" width="100%" lazy="loading"/>
            </a>
          </swiper-slide>
        </template>
        <!-- <div class="swiper-pagination bt6" v-show="productFloor.banner.length > 1" slot="pagination"></div> -->
      </swiper>
    </div>
  </div>
  </div>
  <div class="floor_conent">
    <ul class="modeleight_box">
      <li class="modeleight_list_2" v-for="(_item, index) in productFloor.prudouct" :key="index">
        <a class="modeleight_cell_2" @click="triggerUrl(_item.productNo, _item.proName, productFloor.name, _item.activityNo, _item, $event)">
          <div class="img_boxs">
            <img v-lazy="_item.picture" class="lazy prod_pic" :title="_item.proName"  alt="_item.proName" lazy="loading"/>
          </div>
          <div class="text_box">
            <div class="me_title">{{_item.proName}}</div>
            <p class="me_ViceTitle">{{_item.commoditySubhead}}</p>
            <p class="me_price"><span>￥{{_item.price}}</span><del v-if="_item.originalCost>0">￥{{_item.originalCost}}</del></p>
          </div>
        </a>
      </li>
    </ul>
  </div>
</div>
</template>
<script type="text/javascript">
  import OneBanner from 'components/common/banner/OneBanner'
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import makeData from '../../../mixin/makeData'
  export default {
    mixins: [makeData],
    data () {
      return {
        // banner图片轮播图
        swiperBannerOption: {
          effect: 'slide',
          loop: false,
          autoplay: this.productFloor.banner && this.productFloor.banner.length > 1 ? 2000 : false,
          speed: 1000,
          initialSlide: 1,
          resistanceRatio: 0,
          autoplayDisableOnInteraction: true,
          // pagination: '.swiper-pagination',
          preventClicksPropagation: true,
          touchMoveStopPropagation: true
        }
      }
    },
    props: {
      productFloor: {
        required: true,
        type: Object
      }
    },
    created () {
    },
    methods: {
      triggerUrl (productNo, productName, label, activityNo, item, e) {
        let activityNos = !activityNo ? '' : activityNo
        let isActivity = !activityNo ? '0' : '1'
        window.location.href = '#/detail?productNo='+productNo +'&isActivity='+ isActivity +'&activityNo='+ activityNos
      }
    },
    components: {
      OneBanner,
      swiper,
      swiperSlide
    }
  }
</script>
<style media="screen" lang="scss" scoped>
@import "../../../assets/scss/app";
.modeleight_box{
  @include px2rem(padding, 15 7.5 0);
}
.modeleight_list_2{
  width: 50%;
  float: left;
  box-sizing: border-box;
  overflow: hidden;
  a{
    display: block;
    @include px2rem(margin, 0 7.5);
  }
  .img_boxs{
    // @include px2rem(width, 342);
    // @include px2rem(height, 342);
    margin: 0 auto;
    text-align: center;
    img{
      width: 100%;
    }
  }
  .me_title{
    @include font-dpr(26);
    @include px2rem(height,40);
    @include px2rem(line-height,40);
    color: #444;
    // @include lines-ellipsis(1);
    text-overflow:ellipsis;
    overflow:hidden;
    white-space:nowrap;
    @include px2rem(margin-top, 15);
  }
  .me_ViceTitle{
    color: #999;
    @include font-dpr(24);
    @include lines-ellipsis(1);
    @include px2rem(height,40);
    @include px2rem(line-height,40);
  }
  .me_price{
    // line-height: 2;
    @include px2rem(margin, 10 0 15 0);
    span{
    @include font-dpr(34);
    color: $redColor;
    // font-weight: bold;
    }
    del{
      @include font-dpr(26);
      color: #999;
      @include px2rem(margin-left, 22);
    }
  }
}
</style>
