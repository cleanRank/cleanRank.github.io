<template>
<div class="floor">
<OneBanner v-if="productFloor.sourcePage =='index' && productFloor.image" :productFloor="productFloor"></OneBanner>
<div class="banner_model" v-if="productFloor.sourcePage =='index' && productFloor.banner && productFloor.banner.length > 0">
<div class="small_banner">
  <div class="swiper-container02 swiper-container22">
      <swiper :options="swiperBannerOption">
          <template v-for="(slide, index) in productFloor.banner">
              <swiper-slide :key="index">
                  <a class="swiper-slide banner_a" :data-bdid="slide.id" :data-bdindex="index" :data-erow="0" data-modname="ModelFourBanner" :href="slide.h5Url">
                      <img v-lazy="slide.picUrl" class="lazy"  :title="slide.name"  :alt="slide.name" width="100%" lazy="loading"/>
                  </a>
              </swiper-slide>
          </template>
          <!-- <div class="swiper-pagination bt6" v-show="productFloor.banner.length > 1" slot="pagination"></div> -->
      </swiper>
  </div>
</div>
</div>
<section id="seckillBox" :class="{'noposition': productFloor.sourcePage=='activityNew'}">
  <!-- 抢购商品轮播图 s-->
  <div class="activeProductsWrap" :class="productFloor.sourcePage =='activityNew'?productFloor.floorId:'activeProductsWrapIndex'" :style="{background: productFloor.bgColor}">
      <swiper :options="swiperActivesOption" >
          <template v-for="(slide, index) in productFloor.prudouct">
              <swiper-slide :key="index" class="seckill_item new_layout_box4">
              <div @click="triggerUrl(slide.productNo, slide.proName, productFloor.name, slide.activityNo, slide, $event)"  :data-bdid="slide.id" :data-bdindex="index" :data-erow="0" data-modname="ModelFourProduct">
                <p class="lootall_img" v-if="slide.productStock && 0 >= slide.productStock"><img src="../../../assets/icon/icon/qiangguang.png" alt="已抢光"></p>
                <div class="picwrap">
                  <template v-if="slide.label[0]"><img class="tag_img top" :src="slide.label[0].labelimg"></template>
                  <template v-if="slide.label[1]"><img class="tag_img bottom" :src="slide.label[1].labelimg"></template>
                  <img :src="slide.proImage" class="lazy ppic" :title="slide.proName" :alt="slide.proName">
                </div>
                  <div class="goods_detail_box">
                      <div class="goods_name">{{slide.proName}}</div>
                      <div class="goods_price" v-if="productFloor.stagePriceStatus==1"><span class="price"><b>￥{{slide.monthAmount}}</b><b class="moneyIcon">X{{slide.monthnum}}期</b></span></div>
                      <div class="goods_price" v-else><span class="price"><b>￥{{!slide.activityPrice?slide.price:slide.activityPrice}}</b></span></div>
                      <!-- <div class="goods_month_pay">月付：￥{{slide.monthAmount}}起</div> -->
                  </div>
                  <p class="preview_box" v-if="productFloor.preview && productFloor.preview !=''">{{slide.productNo}}</p>
              </div>
              </swiper-slide>
          </template>
          <swiper-slide class="check_more" v-show="productFloor.banner && productFloor.banner.length>0 && productFloor.banner[0].h5Url != ''">
              <div @click="checkMore" class="checkMore_box justify-center vertical">
                  <span class="check_item1">查看全部</span><br>
                  <p class="check_item2">See more</p>
              </div>
          </swiper-slide>
      </swiper>
  </div>
  <!-- 抢购商品轮播图 e-->
</section>
</div>
</template>
<script type="text/javascript">
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import { positionPage } from 'lib/until'
  import OneBanner from 'components/common/banner/OneBanner'
  export default {
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
        },
        swiperActivesOption: {
          initialSlide: 0,
          slidesPerView: 3.12,
          // slidesOffsetAfter: this.productFloor.sourcePage =='activityNew'? 0 : 30,
          // spaceBetween: 12,
          resistanceRatio: 0,
          autoplayDisableOnInteraction: false,
          preventClicksPropagation: false,
          touchMoveStopPropagation: false
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
      checkMore () {
//        window.location.href = `${process.env.APIPORT}/this.productFloor.banner[0].h5Url`
        window.location.href = this.productFloor.banner[0].h5Url
      },
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
  .seckill_item .tag_img {
    height: .45rem;
  }
  .border_box{
    border: 1px solid $borderColor;
  }
  .picwrap {
    position: relative;
    width: 2.93333rem;
    height: 2.93333rem;
    margin: 0 auto;
    .top {
      top: -0.2rem
    }
    .bottom {
      bottom: -0.2rem;
    }
  }
  .goods_detail_box{
    margin-top: 0;
    @include font-dpr(24);
  }
  .new_layout_box4{
     width:  2.93333rem !important;
     margin-right: 0.12rem !important;
  }
  .activeProductsWrapIndex{
    // @include px2rem(padding-left, 15);
  }
</style>
