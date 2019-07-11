<template>
  <section class="new-index">
    <!-- banner start -->
    <div class="new-index-banner" :class="[isClass?isClass:'']">
      <div class="new-index-banner-container ml-mr-24 mt-16 mb-16">
        <swiper :options="newIndexSwiperOption">
          <template v-for="(slide, index) in indexData.bannerhome">
            <swiper-slide :key="index">
              <a  :href="slide.url" :data-bdid="slide.id" :data-bdindex="index" :data-erow="0" data-modname="indexDataBannerhome" :data-src="index">
                <img width="100%" class="lazy" :src="slide.image" lazy="loading">
              </a>
            </swiper-slide>
          </template>
          <div class="swiper-pagination" slot="pagination" v-show="indexData.bannerhome.length > 1"></div>
        </swiper>
      </div>
    </div>
    <!-- banner end -->
    <!-- new index icon list start -->
    <div class="new-index-nav-wrap">
      <div class="new-index-icon-list flex" v-if="indexData.navigation.length>0">
        <template v-for="(icon, index) in indexData.navigation">
          <a class="nav-icon" :class="{'mb-24': index<=4}" :data-bdid="icon.id" :data-bdindex="index" :data-erow="5" data-modname="indexDataNavigation" @click="triggerUrlIcon(icon.h5Url, icon.name, index, $event)" :key="index">
            <img :alt="icon.name" class="nav-icon-img lazy" lazy="loading" v-lazy="icon.picUrl">
            <p>{{icon.name}}</p>
          </a>
        </template>
      </div>
    </div>
    <!-- new index icon list end -->
    <!-- new index floor start -->
    <div class="new-floor-template" id="cateGoodsList">
      <div v-for="(floor, index) in indexData.productfloor" :key="'Model' + index" :data-modelIndex="index" :floor="floor.layoutType">
        <!-- 2楼 -->
        <NewModelTwo v-if="floor.layoutType == 2 && floor.prudouct.length > 0" :productFloor="floor"></NewModelTwo>
        <!-- 4楼 -->
        <NewModelFour v-if="floor.layoutType == 4 && floor.prudouct.length > 0" :productFloor="floor"></NewModelFour>
        <!-- 13楼 -->
        <NewModelThirteen v-if="floor.layoutType == 13 && floor.subFloor.length > 0" :productFloor="floor"></NewModelThirteen>
        <!-- 店铺 -->
        <WebCelebrityStore v-if="floor.layoutType == 19" :productFloor="floor"></WebCelebrityStore>
        <!-- 秒杀图片单列 -->
        <ModelEighteen v-if="floor.layoutType == 20 && floor.prudouct.length > 0" :newList="floor" :product="floor.prudouct"></ModelEighteen >
        <Spike v-if="floor.layoutType == 21 && floor.activityInfos &&floor.activityInfos.length>0" :productFloor="floor"></Spike>
      </div>
    </div>
    <!-- new index floor end -->
    <div class="first-screen-background"></div>
  </section>
</template>

<script>
  import NewModelTwo from 'components/common/floorLayOut/NewModelTwo' // 2楼
  import NewModelFour from 'components/common/floorLayOut/NewModelFour' // 4楼
  import NewModelThirteen from 'components/common/floorLayOut/NewModelThirteen' // 13楼
  import WebCelebrityStore from 'components/common/floorLayOut/WebCelebrityStore' // 网红店铺
  import ModelEighteen from 'components/common/floorLayOut/ModelEighteen'
  import Spike from 'components/activity/Spike'
  import { mapGetters, mapActions } from 'vuex'
  import { jointLand, gocredit } from 'lib/until'
  export default {
    name: "NewOneIndex",
    data () {
      return {
        isLoadFlag: false,
        isEndFlag: false,
        iscacheData: false,
        isClass: 'mg100',
        floorNum: 0, // 0代表全部商品显示  1代表正常分页显示
        indexData: {
          bannerhome: [],
          bannerhome2: [],
          navigation: [],
          productfloor: []
        },
        newIndexSwiperOption: {
          effect: 'slide',
          paginationType: 'fraction',
          loop: true,
          autoplay: 4000,
          speed: 1000,
          initialSlide: 1,
          autoplayDisableOnInteraction: false,
          pagination: '.swiper-pagination',
          preventClicksPropagation: false,
          touchMoveStopPropagation: false
        }
      }
    },
    created () {
      // 拉取首页的基本数据
      let scrollTop = window.sessionStorage.getItem('scrollTop') || 1
      this.fetchIndexData().then(() => {
        this.$nextTick(() => {
          window.scrollTo(0, scrollTop)
          window.scrollTo(0, scrollTop)
        })
      })
      document.querySelector('html').style.background = '#fff'
      document.querySelector('body').style.background = '#fff'
    },
    components: {
      NewModelTwo,
      NewModelFour,
      NewModelThirteen,
      WebCelebrityStore,
      ModelEighteen,
      Spike
    },
    computed: {
      ...mapGetters({
        cutIndexInfo: "getCutIndexInfo"
      })
    },
    methods: {
      ...mapActions([
        "updateCutIndexInfo"
      ]),
      // 跳转链接
      triggerUrlIcon (url, name, index, e) {
        if (url) {
          const { token, uid } = this.$store.state.userInfo
          if ((token != '' && uid != '') || (url.indexOf('virtualDetail') == -1) || url.indexOf('creditIndex') > -1) {
            if (url.indexOf('virtualDetail') > -1) {
              // 充话费充流量
              this.$router.push('/virtualDetail')
            } else if (url.indexOf('creditIndex') > -1) {
              // 去白条
              gocredit()
            } else {
              window.location.href = url
            }
          } else {
            jointLand()
          }
        }
      },
      iscacheWay (data, type) {
        let tapTime = new Date().getTime() // 获取除第一次点击之外的点击时间
        if (data && (tapTime - this.cutIndexInfo.startIndexTimes < 180000)) {
          this.iscacheData = true
          let dataIndex = JSON.parse(JSON.stringify(data))
          this.showLoad(false)
          if (type) {
            this.fetchIndex(dataIndex)
          } else {
            this.fetchActiveData(dataIndex)
          }
        } else {
          this.iscacheData = false
        }
      },
      fetchIndexData () {
        // 首页加载
        this.iscacheWay(this.cutIndexInfo.cacheDataIndex, '1')
        if (this.iscacheData) return Promise.resolve()
        // 调用首页接口
        return this.$post({
          url: this.$store.state.api.Index,
          data: {
            floor: this.floorNum,
            uid: this.$store.state.userInfo.uid,
            udid: this.$store.state.userInfo.fingerprint.udid
          }
        }).then(data => {
          if (!data) {
            this.$router.push('/brokennet')
          }
          let res = data.data
          if (res.status == 1) {
            if (res.data.hotword) {
              this.$emit('setIndexHotWord', res.data.hotword)
            } else {
              this.$emit('setIndexHotWord', '请输入关键字搜索')
            }
            let cacheDataIndex = res.data
            this.updateCutIndexInfo({cacheDataIndex: cacheDataIndex})
            let startIndexTimes = new Date().getTime()
            this.updateCutIndexInfo({startIndexTimes})
            this.fetchIndex(res.data)
            this.showLoad(false)
          } else {
            this.showToast({ msg: res.statusDetail })
          }
        }, () => {
          this.$set(this.$data, 'isLoadFlag', false)
        })
      },
      fetchIndex (data) {
        let { productfloor, bannerhome, bannerhome2, navigation, topCategory } = data
        this.$emit('topCategory', topCategory)
        productfloor.map(_item => {
          _item.h5Url = _item.h5Url && _item.h5Url != '' ? _item.h5Url : 'javascript:;'
          _item.link = _item.link && _item.link != '' ? _item.link : 'javascript:;'
          if (_item.layoutType != 1 || _item.layoutType != 2 || _item.layoutType != 3 || _item.layoutType != 4 || _item.layoutType != 8) {
            if (_item.prudouct) {
              _item.prudouct.map(val => {
                if (val.urlType == "PRODUCT") {
                  val.urlContent = `#/detail?productNo=${val.productNo}`
                } else if (val.urlType == "WEBONLY" || val.urlType == "IMAGETE") {
                } else {
                  val.urlContent = `javascript:;`
                }
              })
            }
          }
          // 匹配banner
          if (_item.banner && _item.banner.length > 0) {
            _item.banner.map((val) => {
              let newUrl = val.h5Url != '' ? val.h5Url : 'javascript:;'
              val.h5Url = newUrl
            })
          }
        })
        // 首页banner
        if (bannerhome && bannerhome.length > 0) {
          bannerhome.map((val) => {
            val.url = val.url != '' ? val.url : 'javascript:;'
          })
        }
        if (bannerhome2 && bannerhome2.length > 0) {
          bannerhome2.map((val) => {
            val.url = val.url != '' ? val.url : 'javascript:;'
          })
        }
        // navigation 导航
        if (navigation && navigation.length > 0) {
          // 修改图标背景图片
          if (navigation[0].background && navigation[0].background != '') {
            $('.new-index-nav-wrap').css({
              "background": "url(" + navigation[0].background + ") no-repeat",
              "background-size": "100% 100%"
            })
            $('.new-index-icon-list').css('background', 'none')
          }
        }
        data.productfloor.forEach((i) => {
          i.sourcePage = 'index'   // 添加标识来源，区别组件样式
        })
        if (this.$data.floorNum == 0) {
          this.$set(this.$data, 'indexData', data)
        } else {
          if (data.productfloor.length > 0) {
            this.$data.indexData.productfloor = this.$data.indexData.productfloor.concat(data.productfloor)
          } else {
            this.$data.isEndFlag = true
            return false
          }
        }
        this.$set(this.$data, 'isLoadFlag', false)
        if (this.$data.indexData.bannerhome.length <= 1) {
          this.swiperBannerOption = {
            loop: false,
            autoplay: false
          }
        }
        if (this.indexData.topCategory.length>0) {
          this.$set(this.$data, 'isClass', 'mg100')
        } else {
          this.$set(this.$data, 'isClass', 'mg88')
        }
      }
    }
  }
</script>

<style lang="scss" media="screen">
  @import "../../assets/scss/app";
  .activeProductsWrap {
    overflow: hidden;
    position: relative;
    .swiper-container {
      position: static;
    }
  }
  #seckillBox .swiper-slide img[lazy=loading] {
    background: url('../../assets/icon/banner/lazy_banner.png') center center no-repeat;
    @include px2rem(background-size, 180 205);
  }
  #cateGoodsList{
    .bcolorF{
      background: #ffffff;
    }
  }
  #cateGoodsList .floor_conent li img[lazy=loading] {
    background: url('../../assets/icon/banner/lazy_proudt.png') center center no-repeat;
    @include px2rem(background-size, 180 205);
  }

  .small_banner .swiper-slide img[lazy=loading] {
    background: url('../../assets/icon/banner/lazy_banner.png') no-repeat;
    background-size: 100% 100%;
  }
  .mg88 {
    @include px2rem(margin-top, 88);
  }
  .swiper-container {
    -webkit-transform-style: preserve-3d;
    transform-style: preserve-3d;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
  }
  .swiper-container-fade .swiper-slide-active,
  .swiper-container-fade .swiper-slide-active .swiper-slide-active,
  .swiper-container-fade .swiper-slide .swiper-slide {
    pointer-events: auto;
  }
  // new
  .new-index-banner{
    overflow: hidden;
  }
  .new-index-banner-container{
    @include px2rem(height, 320);
    position: relative;
    .swiper-container{
      background: url(../../assets/icon/banner/lazy_banner.png) no-repeat center;
      background-size: 100% auto;
      @include px2rem(border-radius, 12);
      overflow: hidden;
      img{
        width: 100%;
        @include px2rem(height, 320);
      }
    }
    .swiper-pagination{
      @include px2rem(width, 44);
      @include px2rem(height, 24);
      @include px2rem(line-height, 24);
      position: absolute;
      @include px2rem(bottom, 8);
      left: auto;
      @include px2rem(right, 8);
      color: #fff;
      background: rgba(0,0,0,0.26);
      @include px2rem(border-radius, 12);
      @include font-dpr(20);
    }
  }
  .new-index-banner-container .swiper-slide img[lazy=loading] {
    height: 100%;
    background: url('../../assets/icon/banner/lazy_banner.png') no-repeat;
    background-size: 100% auto;
  }
  .new-index-banner-container:before {
    content: "";
    display: block;
    @include px2rem(height, 320);
  }
  /* new icon start */
  .new-index-nav-wrap{
    overflow: hidden;
    @include px2rem(margin-bottom, 16);

  }
  .new-index-icon-list{
    flex-wrap: wrap;
    overflow: hidden;
    @include px2rem(margin-bottom, 16);
    @include px2rem(margin-top, 16);
    .nav-icon{
      width: 20%;
      text-align: center;
      display: block;
      &>a>img{
        @include px2rem(width, 88);
        @include px2rem(height, 88);
        @include px2rem(margin-bottom, 12);
        @include px2rem(padding-bottom, 88);
      }
      p{
        @include font-dpr(26);
        color: #777;
        @include lh(37, 37);

      }
      &.mb-24{
        @include px2rem(margin-bottom, 24);
      }
    }
    .nav-icon-img{
      @include px2rem(width, 88);
      @include px2rem(height, 88);
      @include px2rem(margin-bottom, 12);
    }
  }
  .nav-icon img[lazy=loading] {
    background: url('../../assets/icon/banner/lazy_icon.png') no-repeat;
    background-size: 100% 100%;
  }
  /* new icon end */
  .new-floor-template{
    width: 100%;
  }
</style>
