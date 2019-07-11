<template>
  <section class="find">
    <HeaderDetail :findUser="findUser"></HeaderDetail>
    <div class="findSwiper">
      <swiper :options="swiperOption">
        <template v-for="(slide, index) in find.discoveryArticleImgList">
          <swiper-slide :key="index">
            <img width="100%" class="lazy" :src="slide.image" lazy="loading">
          </swiper-slide>
        </template>
        <div class="swiper-pagination" slot="pagination" v-show="find.discoveryArticleImgList.length > 1"></div>
      </swiper>
    </div>
    <div class="findSwiperArticle">
      <p class="findSwiperArticleTit">{{find.title}}</p>
      <div class="findSwiperArticleCon" v-html="find.content"></div>
    </div>
    <ul class="findList">
      <router-link tag="li" :to="{ path: 'detail', query: {productNo: good.productNo, isActivity: good.isActivity, activityNo: good.activityNo} }" class="findGood" v-for="(good, index) in find.discoveryArticleProductList" :key="index">
        <img class="findGoodImg" :src="good.thumbnail" alt="">
        <div class="findGoodInfo">
          <p class="findGoodName">{{good.productName}}</p>
          <p class="findGoodSales">
            <span class="findGoodPrice">￥{{good.price}}</span>
            <span class="findGoodOriginal" v-if="good.isActivity == 1 && good.marketingPrice">￥{{good.marketingPrice}}</span>
            <span class="findGoodBuy">立即购买</span>
          </p>
        </div>
      </router-link>
    </ul>
  </section>
</template>

<script>
import HeaderDetail from './HeaderDetail'
import mixin from '@/mixin'
export default {
  mixins: [mixin],
  data () {
    return {
      find: {
        discoveryArticleImgList: []
      },
      findUser: {},
      currentSwiperIdx: 0,
      swiperOption: {
        speed: 1000,
        initialSlide: 0,
        preventClicksPropagation: true,
        paginationType: 'fraction',
        pagination: '.swiper-pagination',
        currentSwiperIdx: 0,
        onSlideChangeStart (swiper) {
          let index = swiper.activeIndex
          this.currentSwiperIdx = index
        }
      }
    }
  },
  components: {
    HeaderDetail
  },
  created () {
    this.showFindDetail()
  },
  methods: {
    // 获取文章详情
    showFindDetail () {
      let isOffline = this.$route.query.isOffline
      let {id} = this.$store.state.route.query
      if (!id) {
        return
      }
      this.$post({
        url: this.$store.state.api.findDetail,
        data: {
          id,
          isOffline: isOffline || ''
        }
      }).then(({data: res}) => {
        this.showLoad(false)
        if (res.status == 1) {
          if (res.data.content) {
            res.data.content = res.data.content.replace(/height: \d+px/g, function (wrod) {
              return 'height:' + ((wrod.split('height:')[1].split('px')[0])/60).toFixed(5) + 'rem'
            })
            res.data.content = res.data.content.replace(/font-size: \d+px/g, function (wrod) {
              return 'font-size:' + ((wrod.split('font-size:')[1].split('px')[0])/65).toFixed(5) + 'rem'
            })
            res.data.content = res.data.content.replace(/width: \d+px/g, function (wrod) {
              return 'width: 100%'
            })
            res.data.content = res.data.content.replace(/<video /g, `<video webkit-playsinline="" playsinline="" x5-playsinline="true" x5-video-player-fullscreen="true" preload="auto" controlslist="nodownload"`)
            res.data.content = res.data.content.replace(/="http:/g, `="https:`)
          } else {
            res.data.content = ''
          }
          this.find = res.data
          this.findUser = {
            avatar: res.data.avatar,
            releaseTime: res.data.releaseTime,
            userLoginName: res.data.userLoginName,
            userName: res.data.userName
          }
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import "../../assets/scss/app";
.findSwiper{
  @include px2rem(width, 750);
  @include px2rem(height, 750);
  @include px2rem(margin-bottom, 42);
  position: relative;
  overflow: hidden;
  img{
    @include px2rem(width, 750);
    @include px2rem(height, 750);
  }
}
.swiper-pagination{
  @include px2rem(width, 60);
  @include px2rem(height, 34);
  @include px2rem(line-height, 34);
  position: absolute;
  left: auto;
  @include px2rem(bottom, 24);
  @include px2rem(right, 24);
  color: #fff;
  background: rgba(0,0,0,0.26);
  @include px2rem(border-radius, 17);
  @include font-dpr(24);
}
.findSwiperArticle{
  @include px2rem(margin-bottom, 60);
}
.findSwiperArticleTit{
  color: $color444;
  @include font-dpr(36);
  font-weight: bold;
  @include px2rem(line-height, 58);
  @include px2rem(margin-bottom, 24);
}
.findSwiperArticleCon{
  @include font-dpr(30);
  img{
    @include px2rem(max-width, 670);
  }
  video{
    @include px2rem(width, 670);
    @include px2rem(height, 376.875);
  }
}
.findList,.findSwiperArticle{
  @include px2rem(margin-left, 40);
  @include px2rem(margin-right, 40);
}
.findGood{
  @include px2rem(margin-bottom, 40);
  @include px2rem(border-radius, 12);
  @include px2rem(height, 184);
  box-shadow:0px 0px 0.16rem 0px rgba(0,0,0,0.1);
  overflow: hidden;
  background: #fff;
  display: flex;
  flex-direction: row;
}
.findGoodImg{
  @include px2rem(width, 184);
  @include px2rem(height, 184);
}
.findGoodInfo{
  @include px2rem(padding, 16 20 24 20);
  display: flex;
  flex-direction: column;
  flex: 1;
}
.findGoodName{
  color: $color444;
  @include font-dpr(28);
  @include px2rem(line-height, 44);
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.findGoodSales{
  display: flex;
  align-items: center;
  margin-top: auto;
  >span{
    display: block;
  }
  .findGoodPrice{
    color: $redColor;
    @include font-dpr(32);
    font-weight: 600;
    @include px2rem(padding-right, 16);
    @include px2rem(line-height, 45);
  }
  .findGoodOriginal{
    color: $color999;
    @include font-dpr(24);
    text-decoration: line-through;
    @include px2rem(line-height, 45);
  }
  .findGoodBuy{
    color: #fff;
    @include font-dpr(20);
    margin-left: auto;
    @include px2rem(height, 40);
    @include px2rem(line-height, 40);
    @include px2rem(border-radius, 20);
    @include px2rem(padding, 0 16);
    background: #FF5A60;
  }
}
</style>

