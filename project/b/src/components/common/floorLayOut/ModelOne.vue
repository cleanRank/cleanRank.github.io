<template id="">
  <!--首页楼层 模版 s-->
     <!-- layout 1 s-->
     <div class="floor" :style="{background: floorData.bgColor}">
       <!--<div class="floor_header flex">
            <h4 class="title cell_1">{{floorData.name}}</h4>
            <a class="more js_more_cate"  :href="floorData.h5Url">更多</a>
        </div>-->
       <OneBanner v-if="productFloor.sourcePage =='index' && productFloor.image" :productFloor="floorData"></OneBanner>
       <div class="banner_model" v-if="floorData.sourcePage =='index' && floorData.banner && floorData.banner.length > 0">
        <div class="small_banner">
         <div class="swiper-container02 swiper-container22">
           <swiper :options="swiperBannerOption">
             <template v-for="(slide, index) in floorData.banner">
               <swiper-slide :key="index">
                 <a class="swiper-slide banner_a" :data-bdid="slide.id" :data-bdindex="index" :data-erow="0" data-modname="IndexModelOne" :href="slide.h5Url">
                   <img :src="slide.picUrl" class="lazy" :title="slide.name" :alt="slide.name" width="100%" lazy="loading"/>
                 </a>
               </swiper-slide>
             </template>
             <!-- <div class="swiper-pagination bt6" slot="pagination" v-if="floorData.banner.length > 1"></div> -->
           </swiper>
         </div>
        </div>
       </div>
       <div class="floor_conent" :class="[floorData.sourcePage =='activityNew'?floorData.floorId:'',bgData.bgImg!=''?'haveImg':'']" :style="{'background-image': 'url(' + bgData.bgImg + ')'}">
         <ul class="ac_list_1">
           <SearchItem v-for="(item, index) of floorData.prudouct" :key="item.productNo" :item="item" :newList="newList" :sourcePage="floorData.sourcePage" />
         </ul>
        </div>
       </div>
     <!-- layout 1 e-->
  <!--首页楼层 模版 e-->
</template>
<script type="text/javascript">
  import { positionPage } from 'lib/until'
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import SearchItem from '../../search/SearchItem'
  import OneBanner from 'components/common/banner/OneBanner'
  export default {
    data () {
      return {
         // banner图片轮播图
        swiperBannerOption: {
          effect: 'slide',
          loop: false,
          autoplay: this.productFloor.banner && (this.productFloor.banner.length > 1) ? 2000 : false,
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
      },
      bgData: {
        required: true,
        type: Object
      },
      newList: {
        type: Object
      }
    },
    created () {
      this.getPosition()
    },
    computed: {
      floorData: function () {
        const prudouct = this.productFloor.prudouct && this.productFloor.prudouct.map(product => {
          const label = positionPage(product.label, 1)
          return {
            ...product,
            label
          }
        })
        return {...this.productFloor, prudouct}
      }
    },
    methods: {
      getPosition () {
        let prudouct = this.floorData.prudouct
        if (prudouct) {
          prudouct.forEach((i) => {
            let label = i.label
            i.label = positionPage(label, 1)
          })
        }
      },
      triggerUrl (productNo, productName, label, activityNo, e) {
        let activityNos = !activityNo ? '' : activityNo
        let isActivity = !activityNo ? '0' : '1'
        window.location.href = '#/detail?productNo='+productNo +'&isActivity='+ isActivity +'&activityNo='+ activityNos
      }
    },
    components: {
      SearchItem,
      OneBanner,
      swiper,
      swiperSlide
    }
  }
</script>
<style media="screen" lang="scss" scoped>
@import "../../../assets/scss/app";
@import "../../../assets/scss/flex";
.ac_cell_1 .activity_img_cell {
  margin: 0.65rem 0.26667rem 0rem 0rem;
}
.bt6{
  bottom: 6px !important;
}
.goods_month_pay{
  @include display-flex;
  @include align-items(center);
}
.info{
  padding-top: 0.2rem;
}
.haveImg{
  @include px2rem(padding-top, 95);
  background-size: 100% auto;
  background-repeat: no-repeat;
  background-position: top center;
}
</style>
