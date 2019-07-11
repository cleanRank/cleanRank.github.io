<template>
  <div class="new-floor celebrityRecommend">
    <div class="celebrityItem"
      v-for="(item, index) in productFloor"
      :key="index"
    >
      <!-- celebrity info start -->
      <div class="new-floor-title mb-16">
        <div class="celebrityInfoFormat flex" :style="{backgroundImage: (item.banner? 'url('+item.banner+')':'linear-gradient(-135deg, #3FFFF1 0%, #6D64FF 100%)')}"  @click="goCelebrityRecommend(item.starNo)">
          <div class="celebrityHeadImgWrap">
            <img class="celebrityHeadImg" :src="item.img" alt="">
          </div>
          <div class="celebrityInfo">
            <p class="celebrityName">{{item.nickName}}</p>
            <p class="celebritySignature">{{item.sign}}</p>
          </div>
        </div>
      </div>
      <!-- celebrity info end -->
      <!-- celebrity goods start -->
      <div class="celebrity-goods-wrap">
        <div class="celebrity-goods-scroll">
          <div class="celebrity-good" v-for="(_item ,idx) in item.starProductList" :key="idx" @click="goodDetail(_item, item.starNo, item.nickName)">
            <div class="celebrity-good-img-wrap">
              <img class="celebrity-good-img" :src="_item.productImage" alt="">
            </div>
            <div class="celebrity-good-name c_333">{{_item.productName}}</div>
            <div class="celebrity-good-price"><span class="small">￥</span>{{_item.productPrice}}</div>
          </div>
        </div>
      </div>
      <!-- celebrity goods end -->
    </div>
  </div>
</template>

<script>
import { app } from 'lib/until'
export default {
  name: "CelebrityRecommend",
  props: {
    productFloor: {
      required: true,
      type: Array
    }
  },
  methods: {
    // 跳转商品详情
    goodDetail (good, starNo, starName) {
      this.$router.push({
        path: '/detail',
        query: {
          productNo: good.productNo,
          isActivity: 0,
          activityNo: '',
          starNo: starNo,
          starName: ''
        }
      })
    },
    // 跳转网红主页
    goCelebrityRecommend (starNo) {
      if (this.$store.state.config.fromChannel == 'sxypApp' && (this.$store.state.config.ver.replace(/\./g, '')) >= 145) {
        let obj = {
          starNo: starNo
        }
        app.goCelebrity(obj)
      } else if (this.$store.state.config.fromChannel != 'sxypApp') {
        this.$router.push({
          path: '/celebrity',
          query: {
            starNo
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/scss/app";
@import "../../../assets/scss/flex";
.celebrityInfoFormat{
  @include px2rem(border-radius, 12);
  @include px2rem(margin-left, 24);
  @include px2rem(margin-right, 24);
  @include px2rem(margin-top, 16);
  @include px2rem(height, 160);
  align-items: center;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  .celebrityHeadImgWrap{
    @include px2rem(width, 100);
    @include px2rem(height, 100);
    @include px2rem(margin,0 16);
    border-radius: 50%;
    overflow: hidden;
  }
  .celebrityHeadImg{
    display: block;
    width: 100%;
    height: 100%;
  }
  .celebrityInfo{
    @include px2rem(margin,0 16);
    flex: 1;
    color: #fff;
    .celebrityName{
      @include font-dpr(34);
      @include px2rem(line-height, 48);
      @include px2rem(margin-bottom, 8);
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      word-wrap:break-word;
      word-break:break-all;
    }
    .celebritySignature{
      @include font-dpr(26);
      @include px2rem(line-height, 37);
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
  }
}
.celebrity-goods-scroll{
  overflow-x: scroll;
  white-space: nowrap;
  -webkit-overflow-scrolling:touch;
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
  -webkit-transform: translateZ(0px);
  position: static;
  @include px2rem(padding, 0 24);
}
.celebrity-good {
  display: inline-block;
  @include px2rem(width, 180);
  @include px2rem(height, 280);
  @include px2rem(padding, 10);
  @include px2rem(margin, 16 8);
  @include px2rem(border-radius, 12);
  background: #ffffff;
  box-shadow: 0 0 0.16rem 0 rgba(0, 0, 0, 0.06), 0 0.10667rem 0.10667rem 0 rgba(0, 0, 0, 0.02);
  position: relative;
  .celebrity-good-img-wrap{
    @include px2rem(width, 180);
    @include px2rem(height, 180);
    @include px2rem(margin-bottom, 22);
    overflow: hidden;
  }
  .celebrity-good-img{
    width: 100%;
    height: 100%;
    display: block;
  }
  .celebrity-good-name{
    @include font-dpr(26);
    @include px2rem(line-height, 37);
    @include px2rem(margin-bottom, 8);
    @include singleline-ellipsis();
  }
  .celebrity-good-price{
    color: $redColor;
    @include font-dpr(26);
    text-align: center;
    .small{
      @include font-dpr(16);
    }
  }
}
.celebrity-good:first-of-type{
  margin-left: 0;
}
</style>

