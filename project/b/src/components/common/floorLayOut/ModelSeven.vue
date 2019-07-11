<template>
<div class="find_wrap">
<OneBanner v-if="productFloor.sourcePage =='index' && productFloor.image" :productFloor="productFloor"></OneBanner>
<div class="banner_model" v-if="productFloor.sourcePage =='index' && productFloor.banner && productFloor.banner.length > 0">
<div class="small_banner">
  <div class="swiper-container02 swiper-container22">
    <swiper :options="swiperBannerOption">
      <template v-for="(slide, index) in productFloor.banner">
        <swiper-slide :key="index">
          <a class="swiper-slide banner_a" :data-bdid="slide.id" :data-bdindex="index" :data-erow="1" data-modname="ModelSevenBanner" :href="slide.h5Url">
            <img :src="slide.picUrl" class="lazy"  :title="slide.name"  :alt="slide.name" width="100%" lazy="loading"/>
          </a>
        </swiper-slide>
      </template>
      <!-- <div class="swiper-pagination bt6" v-show="productFloor.banner.length > 1" slot="pagination"></div> -->
    </swiper>
  </div>
</div>
</div>
<div class="find_item" :data-bdid="item.id" :data-bdindex="index" data-erow="1" data-modname="indexModelSevenComment" :class="productFloor.sourcePage =='index'?'modelseven_box':''" v-for="(item, index) in findlistData"  @click="jumpUrl(item, $event)" :key="item.id">
  <img :src="item.picture" alt="发现模块" class="find_picture">
  <div class="find_content" :class="productFloor.sourcePage =='index'?'no_faxian':''" v-if="item.type==2 || item.urlType=='IMAGETE'">
    <h1 class="con_title">{{item.QualityDiscoveryName || item.nameInvention}}</h1>
    <p class="con_box">{{item.summary || item.findDigest}}</p>
    <!--类型(0：商品编号 1：H5链接  2: 图文编辑)-->
    <p class="record_box" >
      <span class="read_span">{{(+item.readCnt)>100000 ? '100000+': item.readCnt}}</span>
      <!-- <span class="likes_span" @click.stop="comment(item.imgTxtNo, '0', index)" v-if="productFloor.sourcePage =='index'">{{item.agreeCnt}}</span> -->
      <span :data-bdid="item.id" :data-bdindex="index" data-erow="1" data-modname="indexModelSevenCheer" :class="item.useragree == 1?'itlikes_span':'likes_span'" @click.stop="comment(item.imgTxtNo, item.useragree, index, item, $event)" >{{item.agreeCnt}}</span>
      <span class="comment_span">{{ (+item.discussCnt)>100000 ? '100000+' : item.discussCnt}}</span>
    </p>
  </div>
</div>
</div>
</template>
<script>
  import OneBanner from 'components/common/banner/OneBanner'
  import { jointLand } from 'lib/until'
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
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
        findlistData: [],
        useragree: '',
        isCommitting: false
      }
    },
    props: ['productFloor'],
    created () {
      this.showLoad(false)
      this.findlistshow()
    },
    watch: {
      "productFloor": {
        handler (val, oldVal) {
          if (val && val != oldVal) {
            this.findlistshow()
          }
        }
      }
    },
    methods: {
      findlistshow () {
        if (!this.productFloor.sourcePage) {
          // 处理发现页面的链接
          this.productFloor.forEach((i) => {
            i.urlContent = this.matchUrlToRoute(i.type, i.urlContent)
          })
          this.$set(this.$data, 'findlistData', this.productFloor)
        } else {
          this.$set(this.$data, 'findlistData', this.productFloor.prudouct)
        }
      },
      comment (imgTxtNo, useragree, index, item, e) {
        if (item.type == 0 || item.urlType == 'PRODUCT') {
          item.productNo = item.urlContent
        }
        if (this.isCommitting) {
          return true
        }
        let { mobile, uid, token } = this.$store.state.userInfo
        if (!token) {
          jointLand()
          return false
        }
        this.isCommitting = true
        useragree = useragree || '0'
        let url= useragree == 1?this.$store.state.api.CancelAgreeDiscoveryImgTxt:this.$store.state.api.AgreeDiscoveryImgTxt
        this.$post({
          url: url,
          data: {
            uid,
            token,
            mobile,
            imgTxtNo
          }
        }).then(data => {
          let res = data.data
          if (res.status === "1") {
            if (useragree == 0) {
              this.findlistData[index].useragree = 1
              this.findlistData[index].agreeCnt ++
            } else {
              this.findlistData[index].useragree = 0
              this.findlistData[index].agreeCnt --
            }
            this.$set(this.$data, 'findlistData', this.findlistData)
          } else {
            this.showToast({msg: res.statusDetail})
          }
          this.isCommitting = false
        }, err => {
          this.isCommitting = false
        })
      },
      matchUrlToRoute (type, url) {
        if (!url || url == '') {
          url = 'javascript:;'
          return false
        }
        if (type==0) {
          const params = url
          return `#/detail?productNo=${params}`
        } else {
          return url
        }
      },
      jumpUrl (item, e) {
        if (item.type == 0 || item.urlType == 'PRODUCT') {
          item.productNo = item.urlContent
        }
        let isLogin = item.isLogin || ''
        let urlContent = item.urlContent
        if (isLogin == 1 && !this.$store.state.userInfo.token) {
          jointLand()
        } else {
          window.location.href = urlContent
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
<style lang="scss" scoped>
.banner_model{
  margin-bottom: 0.2rem;
}
</style>
