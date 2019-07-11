<template>
  <div class="floor" :style="{background: productFloor.bgColor}">
    <OneBanner v-if="productFloor.collection != '0' && productFloor.sourcePage =='index' && productFloor.image" :productFloor="productFloor"></OneBanner>
    <div class="banner_model" v-if="productFloor.sourcePage =='index' && productFloor.banner && productFloor.banner.length > 0">
      <div class="small_banner">
        <div class="swiper-container02 swiper-container22">
          <swiper :options="swiperBannerOption02">
            <template v-for="(slide, index) in productFloor.banner">
              <swiper-slide :key="index">
                <a class="swiper-slide banner_a" :data-bdid="slide.id" :data-bdindex="index" :data-erow="2" data-modname="IndexModelTwoBanner" @click="bannerDetail(slide.h5Url, slide.name, productFloor.name, $event)">
                  <img :src="slide.picUrl" class="lazy"  :title="slide.name"  :alt="slide.name" width="100%" lazy="loading"/>
                </a>
              </swiper-slide>
            </template>
            <!-- <div class="swiper-pagination bt6" v-show="productFloor.banner.length > 1" slot="pagination"></div> -->
          </swiper>
        </div>
      </div>
     </div>
     <div class="floor_conent" id="layoutType2" :class="productFloor.sourcePage =='activityNew'?productFloor.floorId:'modeltwo_floor'">
       <ul class="ac_list_2 mar15" :class="productFloor.sourcePage =='index'?'modeltwo_box':''">
         <li v-if="productFloor.advicePic">
           <a class="ac_cell_2 advertising_box" :href="productFloor.adviceUrl" >
             <img v-lazy="productFloor.advicePic" class="lazy" title="广告图"  alt="广告图" lazy="loading"/>
           </a>
         </li>
         <template v-for="(_item, index) in productFloor.prudouct">
         <li :class="productFloor.sourcePage =='index'?'index_list_2':''" :key="index">
           <a @click="triggerUrl(_item.productNo, _item.proName, productFloor.name, _item.activityNo, _item, $event)" class="ac_cell_2">
           <!--<a class="ac_cell_2" href="javascript:;" >-->
             <p class="lootall_img" v-if="_item.productStock && 0 >= _item.productStock"><img src="../../../assets/icon/icon/qiangguang.png" alt="已抢光"></p>
             <div class="img_box">
              <template v-if="_item.label[0]"><img class="tag_img top" :src="_item.label[0].labelimg"></template>
              <template v-if="_item.label[1]"><img class="tag_img bottom" :src="_item.label[1].labelimg"></template>
              <img v-lazy="_item.proImage" class="lazy prod_pic" :title="_item.proName"  alt="_item.proName" lazy="loading"/>
             </div>
             <!-- isbgColor 区分是否显示背景色 -->
             <div class="goods_detail_box" v-if="productFloor.sourcePage =='index'" >
               <div class="ac_title" :class="{'crossBorder_goods':_item.isCrossBorder==1}">{{_item.proName}}</div>
               <p class="goods_price" v-if="productFloor.stagePriceStatus==1"><span class="price_z"><b>￥{{_item.monthAmount}}</b><b class="moneyIcon">X{{_item.monthnum}}期</b></span></p>
               <div class="goods_price" v-else><span class="price_z">￥{{_item.price}}</span><del v-if="_item.virtualPrice || _item.originalCost">￥{{_item.virtualPrice || _item.originalCost}}</del></div>
               <div class="follow" v-if="productFloor.collection == '1'" :class="{'check': _item.isMyCollection==1}" @click.stop="checkIsFollow(_item, $event)" ></div>
             </div>
             <div class="goods_detail_box" v-else>
               <h6 class="ac_title" :class="{'crossBorder_goods':_item.isCrossBorder==1}">{{_item.proName}}</h6>
               <p class="qualityViceTitle">{{_item.qualityViceTitle}}</p>
               <p class="goods_price" v-if="productFloor.stagePriceStatus==1"><span class="price_z"><b>￥{{_item.monthAmount}}</b><b class="moneyIcon">X{{_item.monthnum}}期</b></span></p>
               <p class="goods_price" v-else><span class="price_z"><b>￥{{!_item.activityPrice?_item.price:_item.activityPrice}}</b></span></p>
             </div>
             <p class="preview_box" v-if="productFloor.preview && productFloor.preview !=''">{{_item.productNo}}</p>
           </a>
         </li>
         </template>
       </ul>
      </div>

  </div>
</template>
<script type="text/javascript">
import OneBanner from 'components/common/banner/OneBanner'
import { positionPage, jointLand } from 'lib/until'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { mapActions } from 'vuex'
export default {
  data () {
    return {
       // banner图片轮播图
      swiperBannerOption02: {
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
    ...mapActions([
      "delMyCollection",
      "addMyCollection"
    ]),
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
    },
    checkIsFollow (_item, e) {
      let token = this.$store.state.userInfo.token
      if (!token) {
        jointLand()
        return false
      }
      this.showLoad(true)
      const isMyCollection = _item.isMyCollection
      if (isMyCollection==1) {
        // 取消关注
        this.delMyCollection(_item.productNo)
        .then(({data: res}) => {
          this.showLoad(false)
          if (res.status == 1) {
            this.showToast({
              msg: '取消成功'
            })
            // 取消关注成功
            _item.isMyCollection = 0
          } else {
            this.showToast({
              msg: res.statusDetail
            })
          }
        })
      } else {
        this.addMyCollection(_item.productNo)
        .then(({data: res}) => {
          this.showLoad(false)
          if (res.status == 1) {
            this.showToast({
              msg: '收藏成功'
            })
              // 关注成功
            _item.isMyCollection = 1
          } else {
            this.showToast({
              msg: res.statusDetail
            })
          }
        })
      }
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
  .modeltwo_floor{

  }
  .modeltwo_box{
     @include px2rem(margin, 0 7.5);
  }
  .ac_list_2 .index_list_2{
    height: auto;
    // @include px2rem(padding, 0 7.5);
    // @include px2rem(margin, 0 0 10);
    .ac_cell_2{
      @include px2rem(padding, 0 5 0);
      // border: 1px solid $borderColor;
    }
  }
  .goods_detail_box{
    text-align: left;
    @include px2rem(margin-top,0);
    @include px2rem(padding, 0 10 12);
    // .goods_name{
    //   @include px2rem(padding-right, 40);
    // }
    .goods_price{
      .price_z{
        @include font-dpr(40);
      }
      @include px2rem(padding, 20 0 25);
    }
  }
  // .bgColor{
  //   background: #F7F3ED;
  // }
  .img_box {
    overflow: hidden;
    position: relative;
    @include px2rem(width, 352);
    @include px2rem(height, 322);
    .prod_pic {
      display: block;
      margin: 0 auto;
      @include px2rem(width, 260);
      @include px2rem(height, 260);
      @include px2rem(margin-top, 20);
    }
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
  .follow{
    @include px2rem(width, 40);
    @include px2rem(height, 40);
    background: url(../../../assets/icon/myCollection/collection_hollow_icon@3x.png) no-repeat;
    background-size: 100% 100%;
    position: absolute;
    @include px2rem(right, 23);
    @include px2rem(bottom, 15);
    &.check {
      background: url(../../../assets/icon/myCollection/collection_solid_icon3x.png) no-repeat;
      background-size: 100% 100%;
    }
  }
</style>
