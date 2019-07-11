<template id="">
  <!--首页楼层 模版 s-->
  <!-- layout 3 s-->
  <div class="floor" :style="{background: productFloor.bgColor}">
    <OneBanner v-if="productFloor.sourcePage =='index' && productFloor.image" :productFloor="productFloor"></OneBanner>
     <div class="banner_model" v-if="productFloor.sourcePage =='index' && productFloor.banner && productFloor.banner.length > 0">
     <div class="small_banner">
      <div class="swiper-container02 swiper-container22">
        <swiper :options="swiperBannerOption">
          <template v-for="(slide, index) in productFloor.banner">
            <swiper-slide :key="index">
              <a class="swiper-slide banner_a" :data-bdid="slide.id" :data-bdindex="index" :data-erow="3" data-modname="ModelThreeSlide" href="javascript:;" @click="bannerDetail(slide.h5Url, slide.name, productFloor.name, $event)">
                <img :src="slide.picUrl" class="lazy" :title="slide.name" :alt="slide.name" width="100%" lazy="loading"/>
              </a>
            </swiper-slide>
          </template>
          <!-- <div class="swiper-pagination bt6" slot="pagination" v-if="productFloor.banner.length > 1"></div> -->
        </swiper>
      </div>
    </div>
    </div>
    <div class="floor_conent" :class="productFloor.sourcePage =='activityNew'?productFloor.floorId:''" >
      <ul class="g_list" :class="{'activity_list':productFloor.sourcePage =='activityNew'}" :style="{background: productFloor.bgColor}">
        <li class="g_item" v-show="productFloor.advicePic && productFloor.advicePic != ''">
          <a class="ac_cell_2 advertising_box" :href="productFloor.adviceUrl"  >
            <img v-lazy="productFloor.advicePic" class="lazy" title="广告图"  alt="广告图" lazy="loading"/>
          </a>
        </li>
         <template v-for="(_item, index) in productFloor.prudouct">
           <li class="g_item" :key="_item.proImage">
             <a @click="triggerUrl(_item.productNo, _item.proName, productFloor.name, _item.activityNo, _item, $event)" :data-bdid="_item.id" :data-bdindex="index" :data-erow="3" data-modname="ModelThreeProduct" class="js_pro_detail">
               <p class="lootall_img" v-if="_item.productStock && 0 >= _item.productStock"><img src="../../../assets/icon/icon/qiangguang.png" alt="已抢光"></p>
               <div class="img_wrap">
                  <template v-if="_item.label[0]"><img class="tag_img top" :src="_item.label[0].labelimg"></template>
                  <template v-if="_item.label[1]"><img class="tag_img bottom" :src="_item.label[1].labelimg"></template>
                  <img v-lazy="_item.proImage" :src="_item.proImage" :key="_item.proImage" :title="_item.proName"  alt="_item.proName"/>
                </div>
                <div v-if="productFloor.sourcePage =='index'">
                  <h6>{{_item.proName}}</h6>
                  <p class="info_ps price_p" v-if="productFloor.stagePriceStatus==1"><span class="price_z"><b>￥{{_item.monthAmount}}</b><b class="moneyIcon">X{{_item.monthnum}}期</b></span></p>
                  <p class="info_ps price_p" v-else><span class="price_z">￥{{_item.price}}</span></p>
                  <!-- <div class="tag">月付：￥<b>{{_item.monthAmount}}</b></div> -->
                </div>
                <div class="text_box" v-else>
                  <h6 class="ac_title">{{_item.proName}}</h6>
                  <!-- <p class="qualityViceTitle">{{_item.qualityViceTitle}}</p> -->
                  <p class="info_ps" v-if="productFloor.stagePriceStatus==1"><span class="price"><b>￥{{_item.monthAmount}}</b><b class="moneyIcon">X{{_item.monthnum}}期</b></span></p>
                  <p class="info_ps" v-else><span class="price"><b>￥{{!_item.activityPrice?_item.price:_item.activityPrice}}</b></span></p>
                </div>
              <div class="preview_box" v-if="productFloor.preview && productFloor.preview !=''">{{_item.productNo}}</div>
            </a>
           </li>
         </template>
        </ul>
    </div>

  </div>
  <!-- layout 1 e-->
  <!--首页楼层 模版 e-->
</template>
<script type="text/javascript">
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
            i.label = positionPage(label, 3)
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
      OneBanner
    }
  }
</script>
<style media="screen" lang="scss" scoped>
h6{
  font-weight: normal;
}
  .bt6{
    bottom: 6px !important;
  }
  .img_wrap {
    position: relative;
    .tag_img {
      height: .45rem;
      width: auto;
    }
    .top {
      top: 0;
    }
    .bottom {
      bottom: 0;
    }
  }
  .price_p{
    margin-top: 0.2rem;
    line-height: 1.2;
    padding-bottom:0.2rem;
  }
  .img_wrap img[lazy=loading] {
    background: url('../../../assets/icon/banner/lazy_proudt.png') no-repeat;
    background-size: 100% auto;
  }
</style>
