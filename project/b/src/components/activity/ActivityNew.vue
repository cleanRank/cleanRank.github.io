<template>
<section class="actTem_wrap content-offset" :class="{'mg100':versionIdIndex}" v-if="isLoding">
  <div v-for="(item, idex) in activityData" :key="idex">
  <div class="xc_box" v-if="item.floorType == 22">
     <ModelTwentyTwo v-if="item.floorType == 22" :productFloor="item.listFloorDetail[0]"></ModelTwentyTwo>
  </div>
  <!-- banner 图片 s-->
  <div id="activityimg_wrap" v-if="item.floorType == 2 && item.listFloorDetail.length > 0" >
    <swiper :options="swiperBannerOption" v-bind:style="{background: item.bgColor}">
      <template id="" v-for="(slide, index) in item.listFloorDetail">
        <swiper-slide :key="index">
          <!--<router-link class="banner_a" v-if="slide.floorLinkUrl.indexOf('#/activityNew') > -1" :to="slide.floorLinkUrl.split('#')[1]"><img width="100%" class="lazy" :src="slide.picUrl" lazy="loading"></span></router-link>-->
          <a :href="slide.floorLinkUrl" :data-bdid="slide.id" :data-bdindex="index" data-erow="1" data-modname="activityNewBanner" class="banner_a" :data-src="index">
            <img width="100%" class="lazy" :src="slide.picUrl" lazy="loading">
          </a>
        </swiper-slide>
      </template>
      <div class="swiper-pagination" slot="pagination" v-show="item.listFloorDetail.length > 1"></div>
    </swiper>
  </div>
  <!-- banner 图片 e-->
  <!-- 品牌模块 s-->
  <div class="icon_wrap flex" :class="item.floorId" v-if="item.floorType == 1 && item.listFloorDetail.length >0" :style="{background: item.bgColor}">
    <div v-if="item.hotType==1" class="picture-link">
      <img :src="item.listFloorDetail[0].picUrl" class="lazy" :title="item.listFloorDetail[0].name" :alt="item.listFloorDetail[0].name" />
      <a v-for="showList in item.listFloorDetail[0].hotAreaShowList" :href="showList.hotAreaLinkUrl&& showList.hotAreaLinkUrl!=''?showList.hotAreaLinkUrl:'javascript:;'" :style="{top:showList.Top, left:showList.Left, right:showList.Right, bottom:showList.Down}"></a>
      <!--<router-link to="/activityNew/v1504000679705" style="left: 20%; right: 40%; top: 20%; bottom: 30%"></router-link>-->
    </div>
    <a class="cell_1 aicons_item" v-for="(slide, index) in item.listFloorDetail" :key="slide.picUrl" :href="slide.floorLinkUrl" v-else>
      <img :src="slide.picUrl" :title="slide.name" :alt="slide.name"/>
    </a>
  </div>
    <!-- 品牌模块 e-->
    <!-- Icon模块 s-->
  <div class="icon_wrap flex icon_lazy" :class="item.floorId" v-if="item.floorType == 9 && item.listFloorDetail.length >0" :style="{background: item.bgColor}">
    <a :href="slide.floorLinkUrl" class="cell_1 aicons_item" v-for="(slide, index) in item.listFloorDetail" :key="slide.picUrl">
      <img v-lazy="slide.picUrl" :src="slide.picUrl" class="lazy" :title="slide.name" :alt="slide.name" lazy="loading"/>
      <p class="icon_txt">{{slide.picName}}</p>
    </a>
  </div>
    <!-- Icon模块 e-->
  <!-- 左大右小模块 s-->
  <div class="lbrs_wrap" :class="item.floorId" v-if="item.floorType == 10 && item.listFloorDetail.length >0">
  <ul class="layoutType_box3 lbrs_box" v-bind:style="{background: item.bgColor}">
    <li :class="'lay_it'+(index+1)" v-for="(_item, index) in item.listFloorDetail" :key="_item.picUrl">
      <a :href="_item.floorLinkUrl"  class="js_pro_detail">
        <img :src="_item.picUrl" class="lazy" :title="index"  :alt="index" lazy="loading"/>
      </a>
    </li>
  </ul>
  </div>
  <!-- 左大右小模块 e-->
  <!-- 商品模块(单列，双列，三列，三列轮播) s-->
  <div class="xc_box" v-if="item.floorType == 5 || item.floorType == 4 || item.floorType == 6 || item.floorType == 7 || item.floorType == 13 || item.floorType == 18 || item.floorType == 19 || item.floorType == 20">
    <template>
      <!--如果是商品类表，listFloorDetail只会返一个，如果返回多个，只取第一个-->
      <ModelTwo v-if="item.floorType == 5 && item.listFloorDetail.length>0" :productFloor="item.listFloorDetail[0]"></ModelTwo>
      <ModelOne v-if="item.floorType == 4 && item.listFloorDetail.length>0" :productFloor="item.listFloorDetail[0]" :bgData="item" :newList="newList"></ModelOne>
      <ModelThree v-if="item.floorType == 6 && item.listFloorDetail.length>0" :productFloor="item.listFloorDetail[0]"></ModelThree>
      <ModelFour v-if="item.floorType == 7 && item.listFloorDetail.length>0" :productFloor="item.listFloorDetail[0]"></ModelFour>
      <SecondsKill v-if="item.floorType == 13 && item.activityInfos.length>0" :productFloor="item" :seckillId="seckillId" ref="seckill"></SecondsKill>
      <Spike v-if="item.floorType == 19 && item.activityInfos && item.activityInfos.length>0" :productFloor="item"></Spike>
      <ModelEighteen v-if="item.floorType == 20 && item.listFloorDetail.length>0" :product="item.listFloorDetail[0].prudouct" :bgData="item" :newList="newList"></ModelEighteen>
      <!-- 网红推荐活动模板 -->
      <CelebrityRecommend
        v-if="item.floorType == 18 && item.listFloorDetail.length>0"
        :productFloor="item.listFloorDetail"></CelebrityRecommend>
    </template>
  </div>
  <!-- 商品模块(单列，双列，三列，三列轮播) e-->
    <div class="infeed_box" v-if="item.floorType == 3 && item.listFloorDetail.length>0" :class="item.floorId" :style="{background: item.bgColor}">
      <div>
      <div class="infeedBoxtit" :style="{background: item.listFloorDetail[0].defaultBgColor}">
        <div class="scroll-1 tabData">
          <p v-for="(title, i) in item.listFloorDetail" :key="i" :class="{'first_titles':i==0}" :style="{color: title.wordColor}" @click="clickTap(item, i, idex, item.floorId)" :data-bgcolor="title.selectBgColor" :data-color="title.selectWordColor">{{title.docName}}</p>
        </div>
        <div class="more_box" v-if="item.listFloorDetail.length>3" :style="{background: item.listFloorDetail[0].defaultBgColor}"><img src="../../assets/icon/icon/arow_left.png"></div>
      </div>
      </div>
      <div class="infeed_contend">
        <ModelThree :productFloor="item.currentObj"></ModelThree>
      </div>
    </div>
    <!--优惠券模块-->
    <div class="icon_wrap" :class="item.floorId" v-if="item.floorType == 11 && item.listFloorDetail.length >0" v-bind:style="{background: item.bgColor}">
      <div class="flex icon_wrap" v-for="(couponrow, i) in item.listFloorDetail" :key="i">
        <a class="cell_1 aicons_item" :data-bdid="couponList.id" :data-bdindex="x" data-erow="1" data-modname="redpocket" v-for="(couponList, x) in couponrow" :key="x" @click="getSubject(couponList.couponNo, $event)">
          <img v-lazy="couponList.picUrl" class="lazy" title="优惠券" alt="优惠券" lazy="loading"/>
        </a>
      </div>
    </div>
    <!--优惠券模块-->
  </div>
  <!--导航(文字吸底) s-->
  <div class="navBar_title" v-for="(item, idex) in activityData" :key="idex" v-if="item.floorType == 8 && item.listFloorDetail.length>0" :style="{background: item.bgColor}">
    <div class="infeedBoxtit">
      <div class="scroll-1">
        <p v-for="(title, i) in item.listFloorDetail" :key="i" :style="{background: title.defaultBgColor, color: title.wordColor}" @click="jumpUrl(title)">{{title.docName}}</p>
      </div>
      <div class="more_box" v-if="item.listFloorDetail.length>3" :style="{background: item.listFloorDetail[0].defaultBgColor}"><img src="../../assets/icon/icon/arow_left.png"></div>
    </div>
  </div>
  <!--导航(文字吸底) e-->
  <go-top v-if="!versionIdIndex"></go-top>
  <Bombbox @getMobile="getMobile" v-if="isShowbombbox"></Bombbox>
</section>
</template>

<script>
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import {getQueryString, jointLand} from 'lib/until'
  import changeBg from '@/mixin/'
  import GoTop from './GoTop'
  import ModelOne from 'components/common/floorLayOut/ModelOne'
  import ModelTwo from 'components/common/floorLayOut/ModelTwo'
  import ModelThree from 'components/common/floorLayOut/ModelThree'
  import ModelFour from 'components/common/floorLayOut/ModelFour'
  import ModelEighteen from 'components/common/floorLayOut/ModelEighteen'
  import ModelTwentyTwo from 'components/common/floorLayOut/ModelTwentyTwo'
  import SecondsKill from 'components/common/floorLayOut/SecondsKill'
  import Spike from './Spike'
  import CelebrityRecommend from 'components/common/floorLayOut/CelebrityRecommend'
  import WebCelebrityStore from 'components/common/floorLayOut/WebCelebrityStore'
  import Bombbox from './Bombbox'
  import { mapGetters, mapActions } from 'vuex'
  import { UPDATE_SHARE_INFO } from 'store/mutation-types'
  export default {
    data () {
      return {
        isLoding: false,
        versionId: '',
        preview: null,
        swiperBannerOption: {
          effect: 'slide',
          loop: true,
          autoplay: 2000,
          speed: 1000,
          initialSlide: 1,
          // lazyLoading: true,
          autoplayDisableOnInteraction: false,
          pagination: '.swiper-pagination',
          preventClicksPropagation: false,
          touchMoveStopPropagation: false
        },
        activityData: {
          listFloorDetail: []
        },
        versionName: '',
        shareWord: '',
        shareImg: '',
        fromChannel: this.$store.state.config.fromChannel,
        isAffixed: false,
        isCache: false,
        isShowbombbox: false,
        subjectNo: '', // 红包id
        cacheData: [],  // 取首页切换所有缓存数据
        cacheList: [],  // 取首页当前切换缓存数据
//        activityDataType3: []  // 活动楼层type为3的数据集合
        seckillId: [], // H5秒杀id集合
        newList: {}
      }
    },
    props: ['versionIdIndex'],
    mixins: [changeBg],
    created () {
      let {versionId} = this.$route.params
      this.$set(this.$data, 'versionId', versionId)
      this.$set(this.$data, 'preview', this.$route.query.preview)
      this.contentShow().then(() => {
        setTimeout(() => {
          let scrollTopA = (+window.sessionStorage.getItem('scrollTopA')) || 1
          if (scrollTopA) {
            window.scrollTo(0, 1)
            window.scrollTo(0, scrollTopA)
          } else {
            window.scrollTo(0, 1)
            window.scrollTo(0, 0)
          }
        }, 1200)
        this.$root.$emit('showShareBtn', true)
        this.$root.$emit('setTitle', this.versionName)
          // 更新分享信息
        let url = window.location.origin + window.location.pathname + "#/activityNew/" + versionId + "?share=1&fromChannel=sxyph5"
        this.$store.commit(UPDATE_SHARE_INFO, {
          showFlag: true,
          title: this.shareWord,
          desc: '美好生活，优品一下',
          link: url,
          imgUrl: this.shareImg || ''
        })
      })
    },
    beforeRouteLeave (to, from, next) {
      window.removeEventListener('scroll', this.scrollFunction, false)
      if (to.name == 'Detail') {
        let scrollTopA = document.body.scrollTop || document.documentElement.scrollTop
        window.sessionStorage.setItem('scrollTopA', scrollTopA)
        // 保存H5秒杀滚动位置
        if (this.seckillId.length >0) {
          this.seckillId.forEach((i, idx) => {
            this.$refs.seckill[idx].saveScroll()
          })
        }
      } else {
        window.sessionStorage.removeItem('scrollTopA')
        // 删除H5秒杀滚动位置
        window.sessionStorage.removeItem('seckillScroll')
      }
      next()
    },
    beforeDestroy () {
      window.removeEventListener('scroll', this.scrollFunction, false)
    },
    beforeRouteUpdate (to, from, next) {
      this.showLoad(true)
      let { versionId } = to.params
      this.$set(this.$data, 'versionId', versionId)
      this.$set(this.$data, 'preview', to.query.preview)
      this.seckillId = []
      // let scrollTopA = window.sessionStorage.getItem('scrollTopA') || 0
      this.contentShow().then(() => {
        this.$nextTick(() => {
          window.scrollTo(0, 1)
          window.scrollTo(0, 0)
        })
        this.$root.$emit('showShareBtn', true)
        this.$root.$emit('setTitle', this.versionName)
          // 更新分享信息
        let url = window.location.origin + window.location.pathname + "#/activityNew/" + versionId + "?share=1&fromChannel=sxyph5"
        this.$store.commit(UPDATE_SHARE_INFO, {
          showFlag: true,
          title: this.shareWord,
          desc: '美好生活，优品一下',
          link: url,
          imgUrl: this.shareImg || ''
        })
      })
      next()
    },
    mounted () {
      this.$nextTick(() => {
        setTimeout(() => {
          window.addEventListener('scroll', this.scrollFunction, false)
        }, 300)
      })
    },
    components: {
      "swiper": swiper,
      "swiperSlide": swiperSlide,
      'go-top': GoTop,
      "ModelOne": ModelOne,
      "ModelTwo": ModelTwo,
      "ModelThree": ModelThree,
      "ModelFour": ModelFour,
      "SecondsKill": SecondsKill,
      "Bombbox": Bombbox,
      "CelebrityRecommend": CelebrityRecommend,
      "WebCelebrityStore": WebCelebrityStore,
      "ModelTwentyTwo": ModelTwentyTwo,
      Spike,
      ModelEighteen
    },
    watch: {
      "versionIdIndex": {
        handler (val, oldVal) {
          if (val && val != oldVal) {
            this.$set(this.$data, 'isCache', false)
            this.cacheList = []
            this.$forceUpdate()
            this.contentShow()
            // 删除H5秒杀滚动位置
            window.sessionStorage.removeItem('seckillScroll')
          }
        }
      }
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
      contentShow () {
        this.cacheList = []
        this.showLoad(true)
        if (this.cutIndexInfo.cacheData) {
          let tapTime = new Date().getTime() // 获取除第一次点击之外的点击时间
          this.cutIndexInfo.cacheData.forEach((obj) => { // 300000
            if (obj.versionId == this.versionIdIndex && (tapTime - obj.startTapTime) < 180000) {
              this.$set(this.$data, 'cacheList', JSON.parse(JSON.stringify(obj)))
              this.$set(this.$data, 'isCache', true)
              return
            }
          })
        }
        if (this.isCache) {
          this.forData(this.cacheList)
          setTimeout(() => {
            this.isLoding = true
            this.showLoad(false)
          }, 800)
          return false
        }
        let { uid, token } = this.$store.state.userInfo
        let preview = this.preview
        let yulan = ''
        if (preview && preview != '') {
          // 判断是否是后台预览功能
          yulan = '2'
        }
        return this.$post({
          url: this.$store.state.api.ActiveTemplateNew,
          data: {
            uid,
            token,
            versionId: this.versionIdIndex || this.versionId,
            yulan
          }
        }).then(data => {
          let res = data.data
          if (res.status === "1") {
            if (this.versionIdIndex) {   // versionIdIndex首页标题栏切换传过来的值
              let startTapTime = new Date().getTime()
              res.data.startTapTime = startTapTime // 记录第一次点击时间
              if (this.cutIndexInfo.cacheData) {
                this.cutIndexInfo.cacheData.forEach((obj, index) => {
                  if (obj.versionId == this.versionIdIndex) {
                    this.cacheData.splice(index)
                    return
                  }
                })
              }
              this.cacheData.push(res.data)
              this.updateCutIndexInfo({cacheData: this.cacheData})
            }
            // this.$nextTick(() => {
            //   window.scrollTo(0, 1)
            //   window.scrollTo(0, 0)
            // })
            this.newList=res.data
            this.forData(res.data)
          } else {
            this.$set(this.$data, 'activityData', '')
            this.showToast({msg: res.statusDetail})
          }
          setTimeout(() => {
            this.isLoding = true
            this.showLoad(false)
          }, 1000)
        })
      },
      forData (data) {
        let preview = this.$route.query.preview
        this.versionName = data.versionName
        this.$set(this.$data, 'versionName', this.versionName)
        this.shareWord = data.shareWord
        this.shareImg = data.shareImg
        this.$set(this.$data, 'shareWord', this.shareWord)
        data.listFloor.forEach((i, idx) => {
          // console.log(i)
          if (i.floorType == 8) {
            // 判断文字吸底楼层是否存在
            this.$set(this.$data, 'isAffixed', true)
          } else {
            this.isAffixed = false
          }
          if (i.floorId) {
            i.floorId = 'jump_'+ i.floorId
          }
          if (i.floorType == 3) {
            let currentObj = i.listFloorDetail[0]
            i.currentObj = currentObj
            this.$nextTick(() => {
              let tabP = $('.first_titles')
              for (var x=0; x<tabP.length; x++) {
                tabP[x].style.background = tabP[x].getAttribute('data-bgcolor') // 默认第一个背景色
                tabP[x].style.color = tabP[x].getAttribute('data-color') // 默认第一个字体颜色
              }
            })
          }
          if (i.floorType == 13) {
            i.listFloorDetail = [i.listFloorDetail]
            if (i.activityInfos.length <= 0) {
              data.listFloor.splice(idx, 1)
            } else {
              this.seckillId.push({floorId: i.floorId, xScroll: 0})
            }
          }
          if (i.floorType == 19 || i.floorType == 20) {
            i.listFloorDetail = [i.listFloorDetail]
          }
          if (i.floorType == 22) {
            i.listFloorDetail = [i.listFloorDetail]
          }
          i.listFloorDetail.forEach((s) => {
            s.floorLinkUrl = this.matchUrlToRoute(s.floorLinkUrl)
            s.adviceUrl = this.matchUrlToRoute(s.adviceUrl)
            s.floorId = i.floorId
            s.bgColor = i.bgColor
            if (preview) {
              s.preview = '1' // 判断是否是后台使用预览
            }
            s.sourcePage = 'activityNew' // 添加标识来源，区别组件样式
          })
        })
        this.$set(this.$data, 'activityData', data.listFloor)
      },
      matchUrlToRoute (url) {
        if (!url || url == '') {
          url = 'javascript:;'
        } else {
          if (url.indexOf('?') > 0) {
            url = url + '&fromChannel=' + this.fromChannel
          } else {
            url = url + '?fromChannel=' + this.fromChannel
          }
        }
        return url
      },
      getMobile (couponMobile, isShowbombbox, staffNum) {
        // couponMobile 红包优惠券弹框弹获取到的手机号
        this.isShowbombbox = isShowbombbox
        if (!couponMobile) return false
        this.getSubject2(couponMobile, staffNum)
      },
      getSubject (subjectNo, e) {
        let token = this.$store.state.userInfo.token
        this.subjectNo = subjectNo
         // 领取优惠券形式，如果有isBombbox=1标识，代表领取形式是弹框输入手机号，否则是先登录然后领取优惠券
        let isBombbox = getQueryString('isBombbox') || this.$store.state.route.query['isBombbox'] || ''
        if (isBombbox && isBombbox == 1) {
          this.$set(this.$data, 'isShowbombbox', true)
        } else {
          if (!token) {
            jointLand() // 判断是否登录
            return false
          } else {
            this.getSubject2()
          }
        }
      },
      getSubject2 (couponMobile, staffNum) {
        let {mobile, token} = this.$store.state.userInfo
        this.$post({
          url: this.$store.state.api.getsubjectapp,
          data: {
            mobile: couponMobile || mobile,
            token,
            subjectNo: this.subjectNo,
            staffNum: staffNum || ''
          }
        }).then(data => {
          let res = data.data
          this.showToast({msg: res.statusDetail})
        })
      },
      clickTap (item, i, idex, floorId) {
        this.selectColor(item.currentObj)
        this.activityData.forEach((a) => {
          if (a.floorType == 3) {
            const activityData = this.activityData[idex]
            let currentObj = item.listFloorDetail[i]
            activityData.currentObj = currentObj
            this.activityData.splice(idex, 1, activityData)
          }
        })
        let jumpHe = document.getElementsByClassName(floorId)[0].offsetTop
        let topHeight = $('.head-cont').height()
        let scrollTop = (document.body.scrollTop || document.documentElement.scrollTop) + topHeight
        if (scrollTop > jumpHe) {
          $('body').scrollTop(jumpHe - topHeight)
        }
      },
      jumpUrl (item) {
        this.selectColor(item)
        let jump = $('.jump_' + item.jumpFloor)
        // 获取需要滚动的距离
        let jumpHeight = jump.offset().top
        $('body').scrollTop(jumpHeight)
      },
      selectColor (obj) {
        let toggle = event.currentTarget
        let Len = toggle.parentNode.childElementCount
        for (var l=0; l<Len; l++) {
          toggle.parentNode.children[l].style.background = obj.defaultBgColor
          toggle.parentNode.children[l].style.color = obj.wordColor
        }
        toggle.style.background = obj.selectBgColor
        toggle.style.color = obj.selectWordColor
      },
      // 滚动条事件
      scrollFunction () {
        const clientHeight = document.documentElement.clientHeight
        window.addEventListener('scroll', () => {
          let topHeight = $('.head-cont').height()
          let scrollTop = (document.body.scrollTop || document.documentElement.scrollTop) + topHeight
          let boxSettop = ''
          let boxHeight = ''
          let infeed_box = $('.infeed_box')
          for (var i=0; i<infeed_box.length; i++) {
            boxSettop = infeed_box[i].offsetTop
            boxHeight = infeed_box[i].offsetHeight
            if ((boxSettop < scrollTop) && (scrollTop < (boxSettop+boxHeight))) {
              // 滚动条滑动到楼层3且在楼层3范围内，横切模块标题悬浮在顶部
            } else {
              infeed_box[i].firstChild.setAttribute('class', '')
            }
          }
          // 当滚动条高度大于屏幕高度+30px以后,文字吸底楼层浮动在最底下
          if (this.isAffixed && (scrollTop > (1.5 * clientHeight))) {
            $('.navBar_title').addClass('navBar_title_position')
            $('.actTem_wrap').css({
              "padding-bottom": "1.06667rem"
            })
          } else {
            $('.navBar_title').removeClass('navBar_title_position')
            $('.actTem_wrap').css({
              "padding-bottom": "0"
            })
          }
        })
      }
    }
  }
</script>
<style media="screen" lang="scss" scoped>
  @import "../../assets/scss/app";
  .icon_wrap{
    clear: both;
  }
  .mg100{
    @include px2rem(margin-top,156);
  }
  #activityimg_wrap{
    background: url('../../assets/icon/banner/lazy_banner.png') no-repeat;
    background-size: 100% auto;
    overflow: hidden;
  }
  #activityimg_wrap .swiper-slide img[lazy=loading]{
    height: 100%;
    background: url('../../assets/icon/banner/lazy_banner.png') no-repeat;
    background-size: 100% auto;
  }
  .icon_lazy img[lazy=loading] {
    background: url('../../assets/icon/banner/lazy_icon.png') no-repeat;
    background-size: 100% auto;
  }
</style>
