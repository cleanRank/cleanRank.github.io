<template>
  <section v-if="isDataFetched" class="detail-wrap goods_info_container" id="goodsInfoContainer" :class="{'overflow-hidden': fullScreenBannerShowFlag, 'overflow-hidden': bAddress, 'overflow-hidden': bMask}">
    <HeaderDetail :opacity="opacity" :tabIndex="tabIndex" @getIndex="getIndex"></HeaderDetail>
    <div v-if="hasData" class="detail_wrap">
    <div v-if="tabIndex==2">
        <div class="comment_top">
          <div v-if="feedbackRate" class="comment_feedbackRate"><span>好评度 {{feedbackRate}}</span></div>
          <div class="comment_title_tab">
            <span :class="['comment_btn', isAll == 0?'cur_btn':'']" @click="checkTable(0)">全部({{sumCount}})</span><span :class="['comment_btn', isAll == 1?'cur_btn':'']" @click="checkTable(1)">有图({{nongraphicalCount}})</span><span :class="['comment_btn', isAll == 2?'cur_btn':'']" @click="checkTable(2)">最新</span>
          </div>
        </div>
        <div class="horizontal_line"></div>
        <Comment :commentList="commentList"></Comment>
    </div>
    <div v-else>
     <section class="detailBox" id="detailBanner" :class="{fullScreenBanner: fullScreenBannerShowFlag}" @click.stop="toggleFullScreenBanner">
        <swiper :options="swiperOption">
          <template id="" v-for="(slide, index) in goodsInfo.imageList">
            <swiper-slide :key="index">
              <!-- 视频组件 -->
              <div class="videoCon" v-if="index == '0' && slide.videoUrl">
                <video-player ref="videoPlayer" :options="videoOptions" :poster="goodsInfo.imageList[1].imagePath" :bPoster="!fullScreenBannerShowFlag"></video-player>
              </div>
              <div class="img_box maxWH img_flex" v-else>
                <img alt="" class="" :src="slide.imagePath">
              </div>
            </swiper-slide>
          </template>
          <div class="swiper-pagination" :class="{'opacity':goodsInfo.imageList.length>0 && goodsInfo.imageList[0].videoUrl &&  swiperOption.currentSwiperIdx<1 && this.$refs.videoPlayer}" slot="pagination" v-show="goodsInfo.imageList.length > 1"></div>
        </swiper>
      </section>
      <!-- <div class="horizontal_line"></div> -->
      <section class="info_wrap parameter_tab">
          <!--秒杀倒计时 s-->
          <PanicBuyInfo v-if="goodsInfo.diffSes&&goodsInfo.diffSes>0" :goodsInfo="goodsInfo" :time="time"></PanicBuyInfo>
          <!--秒杀倒计时 e-->
          <!-- 商品信息 s-->
          <GoodsInfo :goodsInfo="goodsInfo"></GoodsInfo>
          <!-- 商品信息 e-->
          <!-- <p class="is7ToReturn" v-if="goodsInfo.is7ToReturn==0">此商品不支持七天无理由退货</p> -->
          <div class="horizontal_line"></div>
          <div class="flex free_shipping">
            <span class="shop-service">服务</span>
            <span class="cell_0 return_7 yes_return font14">包邮</span>
            <span class="cell_0 return_7 yes_return">正品保证</span>
            <span class="cell_0 return_7 yes_return">售后无忧</span>
            <span class="cell_0 return_7 yes_return" v-if="goodsInfo.minBuyCnt>1">{{goodsInfo.minBuyCnt}}件起售</span>
            <span class="cell_0 font14 return_7" :class="[goodsInfo.is7ToReturn==0?'no_return':'yes_return']">{{goodsInfo.is7ToReturn==0?'不支持七天无理由退换':'七天无理由退换'}}</span>
            <span class="cell_0 font14 return_7 no_return" v-if="goodsInfo.diffSes&&goodsInfo.diffSes>0">秒杀商品不支持使用优惠券</span>
          </div>
          <Promotion :salesPromotionList="goodsInfo.promoteSaleActivityList" v-if="bSalesPromotion"></Promotion>
          <div class="skuListWrap" @click="showSpuChooseTab" v-if="goodsInfo.spu.length > 0">
            <span class="skuListText">已选</span>
            <p class="skuList">
              <span class="skuItem">{{goodsInfo.currentSpu+'，'+quantity}}件</span>
            </p>
          </div>
          <div class="horizontal_line"></div>
        </section>
        <!-- 配送至 start -->
        <div class="shipping-address shipping-address-ok">
          <span class="shipping-address-label">送至</span>
          <div class="shipping-address-detail" @click="openAddress">
            <p class="shipping-address-line address-icon" v-if="Object.keys(address).length>0">{{address.addProvince}}{{address.addCity}}{{address.addCounty}}{{address.addTown}}{{address.addDetail}}</p>
            <p v-if="bLocation" class="shipping-address-line position-no">未获取到当前位置</p>
            <p v-show="bDelivery" class="shipping-address-no">该商品在该地区暂不支持销售</p>
          </div>
        </div>
        <p class="no-belivery" v-if="bDelivery">抱歉，该地区暂不支持销售</p>
        <!-- 配送至 end -->
        <!-- 店铺信息 start -->
          <div v-if="($store.state.config.fromChannel == 'sxypApp' && +($store.state.config.ver.replace(/\./g, '')) >= 145)">
            <div class="horizontal_line"></div>
            <div class="storeTitle flex" @click="goStoreDetail(goodsInfo.storeNo)" v-if="(goodsInfo.isShowStore && goodsInfo.isShowStore =='1') ">
              <div class="storeName">
                <img class="storeLogo" :src="goodsInfo.storeImg" alt="">
              </div>
              <p class="storeNameTitle c_333">{{goodsInfo.storeName}}</p>
              <div class="goStore c_999">进店逛逛</div>
            </div>
          </div>
          <div v-if="($store.state.config.fromChannel != 'sxypApp') && (goodsInfo.isShowStore && goodsInfo.isShowStore =='1')">
            <div class="horizontal_line"></div>
            <div class="storeTitle flex" @click="goStoreDetail(goodsInfo.storeNo)">
              <div class="storeName">
                <img class="storeLogo" :src="goodsInfo.storeImg" alt="">
              </div>
              <p class="storeNameTitle c_333">{{goodsInfo.storeName}}</p>
              <div class="goStore c_999">进店逛逛</div>
            </div>
          </div>
        <!-- 店铺信息 e -->
      <div class="horizontal_line"></div>
      <section v-if="goodsInfo.showComment == '1'">
      <div class="flex comment_title">
        <span class="cell_1 comment_product">商品评价({{sumCount}})</span>
        <span class="cell_1 c_999 tr look_all_btn" @click="checkTab(2)" v-if="commentList.length>0">好评度<span class="c_main feedbackRate">{{feedbackRate}}</span></span>
      </div>
      <!-- 两条评论 s -->
      <Comment :commentList="commentList" :detailIndex="'1'" v-if="commentList.length>0"></Comment>
      <p v-else class="c_999 font12 no_comment">此商品暂无评价…</p>
      </section>
      <!-- 两条评论 e -->
      <!-- <p class="drag_up">向上拖动，查看商品详情</p> -->
      <ul class="swiper-container-tab2 detailBox" v-if="goodsInfo.introduction">
        <!-- 商品信息 s-->
        <li class="parameter_tab">
          <!-- <div class="horizontal_line"></div> -->
          <!-- 图文详情 s-->
          <GoodsPhotoDetails :goodsInfo="goodsInfo"></GoodsPhotoDetails>
          <!-- 图文详情 e-->
          <!--好货推荐s-->
          <GoodsRecommend v-on:productNo="go2Detail" v-if="isDataFetched"></GoodsRecommend>
          <!--好货推荐e-->
        </li>
        <!-- 商品信息 e -->
      </ul>
      </div>
      <div class="stage_pay_wrap flex" v-if="isDataFetched">
        <div class="business_customer shop-cart-icon cell_0" v-if="(goodsInfo.canCart&&goodsInfo.canCart==1) && (($store.state.config.fromChannel == 'sxypApp' && +($store.state.config.ver.replace(/\./g, '')) > 169) || $store.state.config.fromChannel != 'sxypApp')" @click="goshopcart()">
          <span class="business_customer-pic" ref="shopCartBtn">
            <span class="shopCartNum" :class="{'doubleNum': shopCartNum > 9}" v-if="shopCartNum">{{shopCartNum}}</span>
          </span>
          <span>购物车</span>
        </div>
        <div class="business_customer goQiYu-icon cell_0" @click="goQiYu" v-if="showKefuFlag">
          <span class="business_customer-pic"></span>
          <span>客服</span>
        </div>
        <div class="cell_1" style="display:flex" v-if="((goodsInfo.state == '1' && goodsInfo.jdState == '1') && goodsInfo.productStock > 0) && Object.keys(goodsInfo).length > 0">
          <p class="immedia_shop go_order_btns cell_1 cell_2" :class="{'grayBg': bDelivery}" @click="addShopCart()" v-if="goodsInfo.canCart&&goodsInfo.canCart==1">加入购物车</p>
          <p class="go_order_btns cell_1  cell_2" :class="{'grayBg': bDelivery}" id="goStagesChoose" @click="immedatPay()">立即购买<br><span>￥{{goodsInfo.jdPrice}}</span></p>
          <p class="go_order_btns goodHandleBtn cell_1 cell_2" v-if="goodsInfo.rebateStatus && goodsInfo.rebateStatus!='0'" @click="promotionShow">立即推广<br><span>赚￥{{goodsInfo.rebate}}</span></p>
        </div>
        <div class="go_order_btns cell_1 noPro" v-else>
           暂时无货
        </div>
      </div>
      <!-- 如果商品spu数组不为空，那么渲染带spu list的弹框, 否则直接让用户选择分期 -->
      <StageBoxSpu
        v-if="stagesFlag"
        :currentParams="computedGoodsInfo"
        v-on:cancelBox="cancelBox"
        v-on:chooseSpu="chooseSpu"
        :buyEntry="buyEntry"
        :entryType="entryType"
        :quantitys="quantity"
        @emitParenType = "emitParenType"
        @settlementAmount = "settlementAmount"
        :salesPromotionList="goodsInfo.promoteSaleActivityList"
        ref="stageBoxSpu"
      >
      </StageBoxSpu>
      <!-- 回到顶部按钮 s-->
      <goTop v-on:addFixed="addFixed"></goTop>
      <!-- 回到顶部按钮 e-->
    </div>
    <div class="overdueBox" v-else>
      <div class="nodata_order overdue_box">
        <img src="../../assets/icon/icon/no_af_info.png">
        <p>商品已经卖光啦~要不要瞧瞧别的~</p>
      </div>
      <!--好货推荐s-->
      <GoodsRecommend v-on:productNo="go2Detail"></GoodsRecommend>
      <!--好货推荐e-->
    </div>
    <!-- 地址列表 start -->
    <div class="address-wrap" v-if="bAddress">
      <div class="address-con">
        <div class="delivery">配送至<span class="close-address" @click="closeAddress"></span></div>
        <ul class="address-list" v-if="addressList.length>0">
          <li class="address-item" v-for="(item, index) in addressList" :key="index" @click="chooseAddress(item, index)">
            <img v-if="index == addressIdx" class="address-item-ico" src="../../assets/icon/icon/address-icon-red.png" alt="">
            <img v-else class="address-item-ico" src="../../assets/icon/icon/address-icon-gray.png" alt="">
            <p class="address-item-info" :class="{'default-address': index == 0, 'address-bold': addressIdx == index}">{{item.addProvince}}{{item.addCity}}{{item.addCounty}}{{item.addTown}}{{item.addDetail}}</p>
          </li>
        </ul>
        <div class="address-list address-list-default" v-else>
          <div class="default-data">
            <img class="default-data-img" src="../../assets/icon/default/address.png" alt="">
            <p class="default-data-text">暂时还没有收货地址哦~</p>
          </div>
        </div>
        <p class="select-other" @click="selectOther">选择其他地址</p>
      </div>
    </div>
    <!-- 地址列表 end -->
  </section>
</template>
<script type="text/javascript">
import HeaderDetail from './HeaderDetail'
import { mapActions, mapGetters } from 'vuex'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { getQueryString, html_encode, jointLand, app, is_weixn } from 'lib/until'
import GoodsPhotoDetails from './GoodsPhotoDetails'
import PanicBuyInfo from './PanicBuyInfo'
import GoodsInfo from './GoodsInfo'
import GoodsRecommend from './GoodsRecommend'
import StageBoxSpu from './StageBoxSpu'
import Comment from './Comment'
import Promotion from './Promotion'
import goTop from 'components/common/GoTop'
import VideoPlayer from "./VideoPlayer.vue"
import MapLoader from 'lib/AMap.js'
import _ from 'lodash'
import mixin from './mixin'
import { UPDATE_SHARE_INFO, SHOW_SHARE, UPDATE_QIYU_INFO } from 'store/mutation-types'
import sensors from 'sa-sdk-javascript'
export default {
  mixins: [mixin],
  data () {
    return {
      shopCartNum: 0,
      isCollection: false,
      isFixed: false,  // header 是否浮动标志
      stagesFlag: false,
      isShowServiceFlag: false,
      tabIndex: 0,
      productNo: this.$store.state.route.query.productNo || getQueryString('productNo'),
      copyProductNo: this.$store.state.route.query.productNo || getQueryString('productNo'),
      starNo: this.$store.state.route.query.starNo || getQueryString('starNo'), // 网红编号
      shopCatProductList: [],
      time: {
        hours: 0,
        minutes: 0,
        seconds: 0
      },
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
      },
      fullScreenBannerShowFlag: false,
      goodsInfo: {
        imageList: [],
        spu: [],
        introduction: ''
      },
      showKefuFlag: this.$store.state.config.fromChannel == 'sxypApp' && +(this.$store.state.config.ver.replace(/\./g, '')) > 169, // 客服入口
      hasData: true,
      isDataFetched: false,
      /**
       * 购买入口 0：普通，1：拼团
       * @type {number}
       */
      buyEntry: 0,
      /**
       * 购买入口 0：立即购买，1：购物车
       * @type {number}
       */
      entryType: 0,
      islodingDom: false,
      isActive: false,
      opacity: 0,
      shareImg: '', // 推广分享图片
      quantity: 1, // 购买商品数量
      isLodingImg: false, // 是否加载过商品详情图片
      commentList: [],
      sumCount: '', // 评论数量
      feedbackRate: '', // 好评率
      isAll: 0,
      nongraphicalCount: '',
      pageNo: 1,
      pageCount: 1,
      videoOptions: {
        autoplay: false,
        controls: true,
        sources: []
      },
      isWeixin: is_weixn(),
      addressList: [],
      address: {},
      bLocation: false,
      bAddress: false,
      bDelivery: false, // 该商品在该地区暂不支持销售
      longitude: 0, // 经度
      latitude: 0, // 纬度
      addressIdx: 0,
      bChooseAddress: false,
      bMask: false
    }
  },
  destroyed () {
    window.removeEventListener('scroll', this.scrollfunction, false)
  },
  beforeRouteLeave (to, from, next) {
    window.removeEventListener('scroll', this.scrollfunction, false)
    document.querySelector('body').style.overflow = 'visible'
    document.querySelector('html').style.overflow = 'visible'
    if (window.time) {
      clearInterval(window.time)
      delete window.time
    }
    this.goodsInfo = {
      imageList: [],
      spu: []
    }
    this.shareImg = ''
    this.islodingDom = false
    this.bDelivery = false
    this.address = {}
    this.addressIdx = 0
    this.updateAddressInfo({
      consignee: '', // 收货人姓名
      consigneeMobile: '', // 收货人手机号码
      addProvince: '',  // 收货地址-省
      addProvinceCode: '',  // 收货地址-省编码
      addCity: '',  // 收货地址-市
      addCityCode: '',  // 收货地址-市编码
      addCounty: '',  // 收货地址-县
      addCountyCode: '',  // 收货地址-县编码
      addTown: '',  // 收货地址-镇 (可空)
      addTownCode: '',  // 收货地址-镇编码 (可空)
      addDetail: '',  // 收货详细地址
      addresslabel: '', // 收货人关系标签 (可空),
      addressNo: '',
      addDefault: ''
    })
    next()
  },
  activated () {
    if (!this.islodingDom) {
      this.goodsInfo = {
        imageList: [],
        spu: [],
        introduction: ''
      }
      this.videoOptions = {
        autoplay: false,
        controls: true,
        sources: []
      }
      this.isLodingImg = false
      this.quantity = 1
      this.fullScreenBannerShowFlag = false
      this.isActive = false
      this.productNo = this.$store.state.route.query.productNo || getQueryString('productNo')
      this.opacity = 0
      this.tabIndex = 0
      setTimeout(() => {
        window.addEventListener('scroll', this.scrollfunction, false)
      }, 300)
      this.initDetail()
    }
  },
  created () {
    let {fromChannel, ver} = this.$store.state.config
    if (fromChannel == 'sxypApp' && +(ver.replace(/\./g, '')) >= 210) {
      // 调取app方法通知传递坐标信息
      app.getAddressInfo()
    }
    // 设置延迟，方式history.go(-1)的时候会自动触发滚动条事件
    setTimeout(() => {
      window.addEventListener('scroll', this.scrollfunction, false)
    }, 300)
    this.islodingDom = true
    this.initDetail()
  },
  computed: {
    ...mapGetters({
      userInfo: "getUserInfo",
      networkInfo: "getNetworkInfo",
      addressInfo: "getAddressInfo"
    }),
    // 是否显示购物车按钮
    // isShowShopCartBtn () {
    //   const { fightGroupsNo, fightGroupsOrderNo, diffSes } = this.goodsInfo
    //   // 拼团和活动不显示加入购物车那妞
    //   const fightGroups = fightGroupsNo && !fightGroupsOrderNo
    //   return !(fightGroups || (diffSes&&diffSes>0))
    // },
    computedGoodsInfo () {
      const obj = {}
      if (this.buyEntry !== 0) {
        obj['jdPrice'] = this.goodsInfo.fightGroupsPrice
        obj['downpaymentRatio'] = '100'
        obj['fightGroupsOrderNo'] = this.goodsInfo.fightGroupsOrderNo
        obj['fightGroupsNo'] = this.goodsInfo.fightGroupsNo
      } else {
        obj['fightGroupsNo'] = obj['fightGroupsOrderNo'] = ''
      }
      return {...this.goodsInfo, ...obj}
    },
    is_pay () {
      if (this.$store.state.config.fromChannel != 'sxypApp' && !this.isWeixin) {
        return false
      } else {
        return true
      }
    },
    bSalesPromotion () {
      if (this.goodsInfo.promoteSaleActivityList && this.goodsInfo.promoteSaleActivityList.length>0) {
        // 秒杀、限时购内容为空时不显示促销栏目
        if ((this.goodsInfo.promoteSaleActivityList[0].activityType == 1 || this.goodsInfo.promoteSaleActivityList[0].activityType == 4) && !this.goodsInfo.promoteSaleActivityList[0].activityDesc) {
          return false
        } else {
          return true
        }
      } else {
        return false
      }
    }
  },
  watch: {
    // 监听调用登录方法成功以后，token改变，需要重新渲染该页面
    "userInfo.uid": function (newVal, oldVal) {
      if (newVal) {
        this.initDetail()
      }
    },
    "swiperOption.currentSwiperIdx": function (newVal, oldVal) {
      // 子组件视频播放状态
      let bPlay = this.$refs.videoPlayer && this.$refs.videoPlayer[0].bPlay
      if (newVal && bPlay) {
        // 调用子组件关闭播放
        this.$refs.videoPlayer[0].quitPlaying()
      }
    },
    "networkInfo.type": function (newVal, oldVal) {
      let bContinuePlay = this.$refs.videoPlayer && this.$refs.videoPlayer[0].bContinuePlay
      if (bContinuePlay && newVal =='1') {
        this.$refs.videoPlayer[0].continuePlay()
      }
    }
  },
  methods: {
    ...mapActions([
      "updateToast",
      "addMyCollection",
      "addInToShopCart",
      "delMyCollection",
      "queryShopCart",
      "updateAddressInfo"
    ]),
    checkTable (type) {
      // 全部评价/有图
      this.pageNo = 1
      this.pageCount = 1
      this.isAll = type
      this.selectComment(2)
    },
    getIndex (num) {
      // 切换title内容
      this.tabIndex = num
      this.pageNo = 1
      this.pageCount = 1
      this.isAll = 0
      if (num != 0) {
        this.selectComment(num)
      }
      if (num != 2) {
        try {
          setTimeout(() => {
            document.querySelectorAll('.detailBox')[num].scrollIntoView({block: "start"})
          }, 100)
        } catch (e) {
          console.log(e)
        }
      }
    },
    promotionShow () {
      // 推广
      // 客户端
      let {fromChannel, ver} = this.$store.state.config
      if (fromChannel == 'sxypApp' && +(ver.replace(/\./g, '')) > 145) {
        let { uid, token } = this.$store.state.userInfo
        if (uid =='' && token == '') {
          app.welogin()
          return false
        }
        let {productNo, isActivity, promoteSaleActivityList} = this.goodsInfo
        let activityNo = this.goodsInfo.activityNo || (promoteSaleActivityList && promoteSaleActivityList[0]?promoteSaleActivityList[0].activityNo:'') || ''
        this.showLoad(true)
        this.$post({
          url: this.$store.state.api.GetMiniShareProductInfo,
          data: {
            uid,
            token,
            scenc: `productNo=${productNo}&isActivity=${isActivity}&activityNo=${activityNo}`,
            // page: this.goodsInfo.diffSes>0?'pages/start/start' : 'pages/detail/detail',
            page: 'pages/detail/detail',
            width: 300,
            productNo,
            isActivity,
            activityNo
          }
        }).then(({data: res}) => {
          this.showLoad(false)
          if (res.status == '1') {
            this.$set(this.$data, 'shareImg', res.data.shareImg)
            const { isActivity, activityNo } = this.$store.state.route.query
            const productNos = this.$data.productNo
            const isActivitys = isActivity || getQueryString('isActivity')
            const activityNos = activityNo || getQueryString('activityNo')
            const {mainImagePath} = this.goodsInfo
            let url = window.location.origin + window.location.pathname + "#/detail?fromChannel=sxyph5&productNo=" + productNos + "&isActivity=" + isActivitys + "&activityNo=" + activityNos
            this.$store.commit(SHOW_SHARE, {
              showFlag: true,
              title: this.goodsInfo.productName,
              desc: this.goodsInfo.viceTitle || this.goodsInfo.productName,
              link: url,
              imgUrl: mainImagePath,
              keepImgUrl: res.data.shareImg,
              productNo: productNos,
              activityNo: activityNos,
              isActivity: isActivitys
            })
          }
        })
      } else {
        this.showToast({
          msg: '请下载最新版本的客户端！'
        })
      }
    },
    goQiYu () {
      // 七鱼客服
      const prodQuery = this.$route.query
      const urlString = `${window.location.origin + window.location.pathname}#/detail?productNo=${prodQuery.productNo}&isActivity=${prodQuery.isActivity}&activityNo=${prodQuery.activityNo}`
      const {productName, mainImagePath, viceTitle, diffSes, activityPrice, jdPrice} = this.goodsInfo
      this.$store.commit(UPDATE_QIYU_INFO, {
        title: productName, // 商品标题
        desc: viceTitle, // 商品描述
        pictureUrlString: mainImagePath,
        note: diffSes ? activityPrice : jdPrice,
        urlString
      })
    },
    // 去店铺详情
    goStoreDetail (storeNo) {
      if (this.$store.state.config.fromChannel == 'sxypApp') {
        let obj = {
          storeNo: storeNo
        }
        app.goStore(obj)
      } else {
        this.$router.push({
          path: '/store',
          query: {
            storeNo
          }
        })
      }
    },
    isBottom () {
      return ((document.body.scrollTop || document.documentElement.scrollTop) + document.documentElement.clientHeight + 20 >= document.body.scrollHeight)
    },
    // 滚动条事件
    scrollfunction () {
      if (this.tabIndex == 2) {
        if (this.isBottom()) {
          if (this.pageCount > this.pageNo) {
            this.pageNo = (+this.pageNo) + 1
            this.selectComment(2)
          }
        }
      } else {
        let opacity = Math.abs(document.body.scrollTop || document.documentElement.scrollTop) / 300
        this.$set(this.$data, 'opacity', opacity)
        if (this.isBottom()+50 && !this.isLodingImg) {
          this.fetchGoodsApplet().then(() => {
            this.tabIndex = 1
          })
        }
        let jumpHe = document.getElementsByClassName('parameter_tab')[0].offsetTop
        let scrollTop = (document.body.scrollTop || document.documentElement.scrollTop)
        this.tabIndex = (scrollTop >= jumpHe) ? 1 : 0
      }
    },
    goshopcart () {
      if (!this.is_pay) {
        this.$router.push('/download')
        return false
      }
      // 去购物车
      if (this.$store.state.config.fromChannel == 'sxypApp') {
        app.goShopCart()
      } else {
        this.$router.push('/shopCart')
      }
    },
    initDetail () {
      this.showLoad(true)
      this.fetchGoodsData()
      .then(() => {
        const {mainImagePath, userFavorite} = this.goodsInfo
        this.isCollection = userFavorite && userFavorite == 1
        const { isActivity, activityNo, starNo } = this.$store.state.route.query
        const productNos = this.$data.productNo
        const isActivitys = isActivity || getQueryString('isActivity')
        const activityNos = activityNo || getQueryString('activityNo')
        const starNos = starNo || getQueryString('starNo')
        const fightGroupsNo = this.$store.state.route.query.fightGroupsNo || getQueryString('activityNo') || ''
        let url = window.location.origin + window.location.pathname + "#/detail?fromChannel=sxyph5&productNo=" + productNos + "&isActivity=" + isActivitys + "&activityNo=" + activityNos + "&starNo=" + starNos
        // 拼团页面分享出去，还要是待拼团状态
        if (fightGroupsNo) {
          url += ('&fightGroupsNo=' + fightGroupsNo)
        }
        this.$root.$emit('showShareBtn', true)
        // 更新分享信息
        this.$store.commit(UPDATE_SHARE_INFO, {
          showFlag: true,
          title: this.goodsInfo.productName,
          desc: this.goodsInfo.viceTitle || this.goodsInfo.productName,
          link: url,
          imgUrl: mainImagePath,
          keepActivityImgUrl: "",
          productNo: productNos,
          activityNo: activityNos,
          isActivity: isActivitys
        })
        // 查询商品评论
        this.selectComment().then(() => {
          if (this.commentList.length < 2) {
            this.fetchGoodsApplet().then(() => {
              this.tabIndex = 1
            })
          }
        })
      }).then(() => {
        if (this.$store.state.userInfo.token && this.$store.state.userInfo.uid) {
          return this.queryShopCart()
          .then(({data: res}) => {
            if (res.status == "1" && res.data && res.data.productList) {
              this.shopCatProductList = res.data.productList
              this.shopCartNum = res.data.productList.reduce(function (totle, _item) {
                return totle + (+_item.quantity)
              }, 0)
            } else {
              this.showToast({
                msg: res.statusDetail
              })
            }
          })
        }
      }).then(() => {
        this.showLoad(false)
        // 是否是客户端分享商品
        let share = this.$store.state.route.query.share || getQueryString('share')
        if (share && share == 1) {
          // 推广
          this.promotionShow()
        }
      }).then(() => {
        let upSource = this.$store.state.route.from.name || getQueryString('upSource')
        switch (upSource) {
          case "Index":
            upSource = '首页'
            break
          case "ShopCart":
            upSource = '购物车'
            break
          case "Search":
            upSource = '搜索'
            break
          case "Store":
            upSource = '店铺'
            break
          case "WebCelebrity":
            upSource = '网红'
            break
          case "NotificationMessage":
            upSource = '通知消息'
            break
          case "OrderDetail":
            upSource = '订单详情'
            break
          default:
            upSource
        }
        let platform_type = 'H5'
        if (this.$store.state.config.fromChannel == 'sxypApp') {
          platform_type = this.$store.state.config.Plat
        }
        // 合伙人等级（初级、中级）
        let partnershipLevel = this.$store.state.userInfo.memberLevel || ''
        switch (partnershipLevel) {
          case "1":
            partnershipLevel = '初级'
            break
          case "2":
            partnershipLevel = '中级'
            break
          default:
            partnershipLevel = ''
        }
        let productDetail = {
          upSource: upSource, // 前项来源
          productId: this.productNo, // 商品ID
          productName: this.goodsInfo.productName, // 商品名称
          categoryName: this.goodsInfo.categoryName || '', // 商品一级分类
          upCategoryName: this.goodsInfo.upCategoryName || '', // 商品二级分类
          productPrice: parseFloat(this.goodsInfo.jdPrice), // 商品单价
          storeId: this.goodsInfo.storeNo || '', // 店铺ID
          storeName: this.goodsInfo.storeName || '', // 店铺名称
          starName: this.$store.state.route.query.starName || getQueryString('starName'), // 网红名称
          starId: this.starNo || '', // 网红ID
          productTitle: this.goodsInfo.viceTitle || '', // 商品标题
          rebates: this.goodsInfo.rebateStatus == '1' ? parseFloat(this.goodsInfo.rebate) : 0, // 返利金额
          isCrossBorderProduct: this.goodsInfo.isCrossBorder == 1, // 是否海淘商品
          isActivityProduct: this.goodsInfo.isActivity == 1, // 是否活动商品
          isSeckillProduct: !!this.goodsInfo.diffSes, // 是否秒杀
          isSearch: (this.$store.state.route.from.name || getQueryString('upSource')) == 'Search', // 是否搜索
          platform_type: platform_type,
          partnerOrNot: this.goodsInfo.rebateStatus == '1',
          partnershipLevel: partnershipLevel
        }
        sensors.track('productDetail', {...productDetail})
      })
    },
    callAddShopCartFn (e) {
      if (!this.$store.state.userInfo.token) {
        jointLand()
        return false
      }
      this.showLoad(true)
      // 添加到购物车
      this.currentParams = this.computedGoodsInfo
      let activityNo = this.goodsInfo['activityNo'] || (this.currentParams.promoteSaleActivityList &&this.currentParams.promoteSaleActivityList[0]?this.currentParams.promoteSaleActivityList[0].activityNo:'') || ''
      this.addInToShopCart({
        productNo: this.productNo,
        activityNo: activityNo,
        starNo: this.starNo || '',
        quantity: this.quantity
      }).then(({data: res}) => {
        this.showLoad(false)
        if (res.status == "1") {
          this.showToast({
            msg: '加入购物车成功'
          })
          this.shopCartNum = (+this.shopCartNum) + (+this.quantity)
          const className = this.$refs.shopCartBtn.className
          this.$refs.shopCartBtn.className = this.$refs.shopCartBtn.className + " shake"
          setTimeout(() => {
              // 400ms以后清除掉
            this.$refs.shopCartBtn.className = className.replace(/ shake/g, '')
          }, 400)
        } else {
          this.showToast({
            msg: res.statusMessage
          })
        }
      })
    },
    // 加入购物车
    addShopCart (e) {
      if (this.bDelivery) {
        return false
      }
      if (!this.is_pay) {
        this.$router.push('/download')
        return false
      }
      // 如果有spu弹出选择spu的弹框，否则直接加入购物车
      if (this.goodsInfo.cannotsale != 0) {
        this.showToast({
          msg: '已售罄，暂时无法加入购物车'
        })
        return false
      }
      this.stagesFlag = true
      this.entryType = 1
      document.body.scrollTop = document.documentElement.scrollTop = 0
      document.querySelector('body').style.overflow = 'hidden'
      document.querySelector('html').style.overflow = 'hidden'
    },
    // 添加/移除关注
    addCollection (e) {
      if (!this.$store.state.userInfo.token) {
        jointLand()
        return false
      }
      this.showLoad(true)
      if (!this.isCollection) {
        this.addMyCollection(this.productNo)
      .then(({data: res}) => {
        this.showLoad(false)
        if (res.status === "1") {
          this.isCollection = true
        } else {
          this.showToast({
            msg: res.statusDetail
          })
        }
      })
      } else {
        this.delMyCollection(this.productNo)
      .then(({data: res}) => {
        this.showLoad(false)
        if (res.status === "1") {
          this.isCollection = false
        } else {
          this.showToast({
            msg: res.statusDetail
          })
        }
      })
      }
    },
    // startBuy (buyEntry) {
    //   this.buyEntry = buyEntry
    //   this.showSpuChooseTab()
    // },
    // 显示spu选择页面
    showSpuChooseTab () {
      this.stagesFlag = true
      this.entryType = 0
    },
    // 切换全屏banner显示状态
    toggleFullScreenBanner () {
      let bPlay = this.$refs.videoPlayer && this.$refs.videoPlayer[0].bPlay
      if ((this.swiperOption.currentSwiperIdx<1 && bPlay) && !this.fullScreenBannerShowFlag) {
        return
      }
      this.fullScreenBannerShowFlag = !this.fullScreenBannerShowFlag
    },
    // 清除掉样式
    clearWidthStyle: function () {
      var divs = $('#introductionInfo').find('*')
      for (var i = 0, l = divs.length; i < l; i++) {
        $(divs[i]).attr('style', '')
      }
    },
    go2Detail (num) {
      this.$set(this.$data, 'productNo', num)
      // 点击好货推荐之前需要先把spu选择框隐藏掉，否则会导致一上来就显示此选择框
      this.stagesFlag = false
      // 清空
      this.goodsInfo = {
        imageList: [],
        spu: [],
        introduction: ''
      }
      this.isLodingImg = false
      this.tabIndex = 0
      this.fetchGoodsData(true)
      document.body.scrollTop = document.documentElement.scrollTop = 0
    },
    // 拉取商品信息
    fetchGoodsData (isFromRecommend) {
      let { isActivity, activityNo } = this.$store.state.route.query
      let { uid, token, userId } = this.$store.state.userInfo
      const { productNo, copyProductNo } = this.$data
      // 判定当前productNo是否和url里面携带一致，这个字段主要用于区分活动
      if (this.islodingDom) {
        this.isActive = isFromRecommend || !(copyProductNo == productNo)
      }
      const data = {
        productNo,
        isActivity: this.isActive ? '0' : isActivity,
        activityNo: this.isActive ? '' : activityNo
      }
      if (uid && token) {
        data.uid = uid
        data.token = token
        data.centerUserId = userId
        if (this.$store.state.addressInfo.addProvince) {
          // 选择其他收货地址，拿省市县三级联动去判断是否支持配送
          this.address = this.$store.state.addressInfo
          this.checkArea(1)
        } else {
          this.checkDeliveryAddress()
        }
      } else {
        // 未登录状态，调取高德获取经纬度
        if (this.$store.state.addressInfo.addProvince) {
          this.address = this.$store.state.addressInfo
          this.checkArea(1)
        } else {
          this.getLocation()
        }
      }
      return this.$post({
        url: this.$store.state.api.Productdetailshowspujd,
        data
      }).then(data => {
        let res = data.data
        this.isDataFetched = true
        if (res.status == 1) {
          this.$set(this.$data, 'hasData', true)
          let { diffSes, isActivity, currentSpu, spu } = res.data
          let jdPrice2 = ""
          // 当前选中的商品id对应的spu
          res.data.curSkuProNo = []
          // 当前选中的商品sku对应的索引
          res.data.curSkuProNoIndex = []
          res.data.diffSes = (diffSes && diffSes != '') ? diffSes : 0
          if (isActivity == 1) {
            jdPrice2 = res.data.jdPrice
            // res.data.activityNo = isOriginProductNo ? (activityNo || getQueryString('activityNo')) : ''
            res.data.jdPrice = res.data.activityPrice
            res.data.jdPrice2 = jdPrice2
          }
          let currentSpuCopy = currentSpu && currentSpu.split('、')
          spu.map((val, idx) => {
            val.saleAttrList.map((_item, idx) => {
              if (_.indexOf(currentSpuCopy, _item.saleValue) > -1) {
                _item.selected = true
                res.data.curSkuProNo.push(_item.productNos)
                res.data.curSkuProNoIndex.push(idx)
              } else {
                _item.selected = false
              }
            })
          })
          // 计算默认选择的sku,其余的哪些sku不能选择
          this.calceSkuNotChoose(res.data, currentSpuCopy)
          // 设置计算过的数据到goodsInfo
          this.$set(this.$data, 'goodsInfo', res.data)
          if (res.data.imageList[0].videoUrl) {
            let obj = {
              src: res.data.imageList[0].videoUrl,
              type: "video/mp4"
            }
            this.videoOptions.sources.push(obj)
          }
          this.quantity = this.quantity > this.goodsInfo.minBuyCnt?this.quantity:this.goodsInfo.minBuyCnt
          if (this.stagesFlag) {
            this.quantity = this.$refs.stageBoxSpu.quantity > this.goodsInfo.minBuyCnt?this.$refs.stageBoxSpu.quantity:this.goodsInfo.minBuyCnt
            this.settlementAmount(this.quantity)
          }
        } else {
          this.$set(this.$data, 'hasData', false)
          //            this.updateToast({msg: res.statusDetail})
        }
      }).then(() => {
        let { diffSes } = this.goodsInfo
        if (diffSes && diffSes > 0) {
          // 如果倒计时id存在，则先清除倒计时，再开启新的倒计时
          if (window.time) {
            clearInterval(window.time)
          }
          window.time = setInterval(() => {
            diffSes--
            this.$set(this.goodsInfo, 'diffSes', diffSes)
            this.countDown(diffSes)
          }, 1000)
        } else {
          if (window.time) {
            clearInterval(window.time)
          }
        }
      })
    },
    // 拉取商品详情图片
    fetchGoodsApplet (isFromRecommend) {
      this.isLodingImg = true
      let {isActivity, activityNo} = this.$store.state.route.query
      let { uid, token, userId } = this.$store.state.userInfo
      const { productNo, copyProductNo } = this.$data
      // 判定当前productNo是否和url里面携带一致，这个字段主要用于区分活动
      if (this.islodingDom) {
        this.isActive = isFromRecommend || !(copyProductNo == productNo)
      }
      const data = {
        productNo,
        isActivity: this.isActive ? '0' : isActivity,
        activityNo: this.isActive ? '' : activityNo
      }
      if (uid && token) {
        data.uid = uid
        data.token = token
        data.centerUserId = userId
      }
      return this.$post({
        url: this.$store.state.api.applet,
        data
      }).then(data => {
        let res = data.data
        if (res.status == 1) {
          if (res.data.introduction) {
            res.data.introduction = res.data.introduction.replace(/='http:/g, "='https:")
            res.data.introduction = html_encode(res.data.introduction)
          }
          if (res.data.cssContent) {
            res.data.cssContent = res.data.cssContent.replace(/height:\d+px/g, function (wrod) {
              return 'height:' + ((wrod.split('height:')[1].split('px')[0])/60).toFixed(5) + 'rem'
            })
            res.data.cssContent = res.data.cssContent.replace(/font-size:\d+px/g, function (wrod) {
              return 'font-size:' + ((wrod.split('font-size:')[1].split('px')[0])/65).toFixed(5) + 'rem'
            })
            res.data.cssContent = res.data.cssContent.replace(/width: \d+px/g, function (wrod) {
              return 'width: 100%'
            })
            res.data.cssContent = res.data.cssContent.replace(/='http:/g, "='https:")
          } else {
            res.data.cssContent = ''
          }
          this.goodsInfo.cssContent = res.data.cssContent
          this.goodsInfo.introduction = res.data.introduction
          // 页面加载完成以后渲染url
          this.$nextTick(() => {
            this.clearWidthStyle()
          })
        }
      })
    },
    // 计算sku哪些不能选择
    calceSkuNotChoose (spuData, currentSpuCopy) {
      const { spu, curSkuProNo } = spuData
      spu.map((val, idx) => {
        val.saleAttrList.map((_item, index) => {
          let curSkuProNoList = []
          if (_.indexOf(currentSpuCopy, _item.saleValue) > -1) {
            return false
          }
          let productNos = _item.productNos.split(',')
          // 把当前选中的sku对应的数组存起来，以为二维数组的形式存放
          curSkuProNo.map((v, i) => {
            if (idx == i) {
              return false
            }
            curSkuProNoList.push(v.split(','))
          })
          // 只有当前属性和所有选中的sku能匹配出来productNo，判定为可以选择
          let intersectionArr = _.intersection(productNos, ...curSkuProNoList)[0]
          if (!(intersectionArr && intersectionArr.length > 0)) {
            _item.isNotExit = true
          }
        })
      })
      return spuData
    },
    // 选中sku以后调用productdetailshowspujd接口，重新渲染页面
    chooseSpu (productNo) {
      if (productNo && productNo != '') {
        this.showLoad(true)
        this.$set(this.$data, 'productNo', productNo)
        this.fetchGoodsData()
          .then(() => {
            this.fetchGoodsApplet().then(() => {
              this.showLoad(false)
            })
          })
      }
    },
    // 选中tab
    checkTab (num) {
      if (num == 2) {
        // 评论
        this.opacity = 1
        this.selectComment(2)
      }
      this.$set(this.$data, 'tabIndex', num)
    },
    // 立即购买
    immedatPay () {
      if (this.bDelivery) {
        return false
      }
      if (!this.is_pay) {
        this.$router.push('/download')
        return false
      }
      console.log(this.$store.state.userInfo.token)
      if (!this.$store.state.userInfo.token) {
        jointLand()
        return false
      }
      // cannotsale 3[没有图片] 4[gateway返回不可以卖]
      if (this.goodsInfo.cannotsale != 0) {
        this.showToast({
          msg: '库存不足，请重新选择'
        })
        return false
      }
      this.$set(this.$data, 'stagesFlag', true)
      this.currentParams = this.computedGoodsInfo
      this.$set(this.$data, 'isFixed', false)
      document.body.scrollTop = document.documentElement.scrollTop = 0
      document.querySelector('body').style.overflow = 'hidden'
      document.querySelector('html').style.overflow = 'hidden'
      this.entryType = 0
    },
    cancelBox () {
      document.querySelector('body').style.overflow = 'visible'
      document.querySelector('html').style.overflow = 'visible'
      this.$set(this.$data, 'stagesFlag', false)
      this.quantity = this.$refs.stageBoxSpu.quantity > this.goodsInfo.minBuyCnt?this.$refs.stageBoxSpu.quantity:this.goodsInfo.minBuyCnt
    },
    // 倒计时
    countDown (countTime) {
      if (countTime == 0) { window.location.reload() }
      let time = {}
      time.hours = parseInt(countTime / (60 * 60)) >= 10 ? parseInt(countTime / (60 * 60)) : '0' + parseInt(countTime / (60 * 60))
      time.minutes = parseInt(countTime / 60 % 60) >= 10 ? parseInt(countTime / 60 % 60) : '0' + parseInt(countTime / 60 % 60)
      time.seconds = parseInt(countTime % 60) >= 10 ? parseInt(countTime % 60) : '0' + parseInt(countTime % 60)
      this.$set(this.$data, 'time', time)
    },
    addFixed (flag) {
      if (this.$data.isFixed == flag) {
        return false
      } else {
        this.$set(this.$data, 'isFixed', flag)
      }
    },
    emitParenType (e) {
      // 获取商品数量
      this.quantity = this.$refs.stageBoxSpu.quantity > this.goodsInfo.minBuyCnt?this.$refs.stageBoxSpu.quantity:this.goodsInfo.minBuyCnt
      let that = this
      if (this.goodsInfo.productStock < this.goodsInfo.minBuyCnt) {
        that.showToast({
          msg: '库存不足！'
        })
      } else {
        if (that.entryType) {
          // 加入购物车
          that.callAddShopCartFn(e)
        } else {
          // 立即购买
          that.currentParams = that.computedGoodsInfo
          that.confirmOrder(e)
        }
      }
    },
    openAddress () {
      let { uid, token } = this.$store.state.userInfo
      if (uid && token) {
        this.getAddressList()
      }
      this.bAddress = true
    },
    closeAddress () {
      this.bAddress = false
    },
    chooseAddress (address, index) {
      this.checkArea(0, address, index)
    },
    // 请求是否支持配送接口
    checkArea (type, address, index) {
      this.showLoad(true)
      let { uid, token } = this.$store.state.userInfo
      let {isActivity, promoteSaleActivityList} = this.goodsInfo
      let activityNo = this.goodsInfo.activityNo || (promoteSaleActivityList && promoteSaleActivityList[0]?promoteSaleActivityList[0].activityNo:'') || ''
      let data = {
        uid,
        token
      }
      if (type) {
        data.productNo = this.productNo
        data.addProvinceCode = this.address.addProvinceCode
        data.addCityCode = this.address.addCityCode
        data.addCountyCode = this.address.addCountyCode
      } else {
        let productData = [
          {
            "quantity": 1,
            "productNo": this.productNo,
            "fromNo": activityNo,
            "fromType": isActivity || 0
          }
        ]
        data.productData = JSON.stringify(productData)
        data.addressNo = address.addressNo || this.address.addressNo
      }
      this.$post({
        url: type ? this.$store.state.api.checkUserChooseAddress:this.$store.state.api.CheckArea,
        data
      }).then(({data: res}) => {
        this.showLoad(false)
        if (res.status == 1) {
          this.address = address || this.address
          this.bDelivery = false
          this.closeAddress()
          if (!type) {
            this.addressIdx = index
            this.bChooseAddress = true
          }
        } else {
          this.showToast({
            msg: res.statusMessage
          })
          if (type) {
            this.bDelivery = true
          }
        }
      })
    },
    // 高德请求坐标成功
    onComplete (data) {
      this.longitude = data.position.getLng()
      this.latitude = data.position.getLat()
      if (this.longitude && this.latitude) {
        this.sendsCoordinates()
      }
    },
    // 高德请求坐标失败
    onError (error) {
      console.log(error)
      this.bLocation = true
    },
    // 坐标转城市，校验可配送地区
    sendsCoordinates () {
      this.showLoad(true)
      this.$post({
        url: this.$store.state.api.checkUserNowLocation,
        data: {
          longitude: this.longitude,
          latitude: this.latitude,
          productNo: this.productNo
        }
      }).then(data => {
        let res = data.data
        this.showLoad(false)
        if (res.status == 1) {
          // 当前位置支持下单
          this.address = res.data
        } else if (res.status == 27) {
          // 当前位置不支持下单
          this.bDelivery = true
          this.address = res.data
        } else {
          // 转换经纬度地址错误
          this.bLocation = true
        }
      })
    },
    // app坐标
    appLocation () {
      let coordinates = window.sessionStorage.getItem('coordinates') ? JSON.parse(window.sessionStorage.getItem('coordinates')) : ''
      if (coordinates && +(coordinates.longitude)>0 && +(coordinates.latitude)>0) {
        // 把经纬度信息发送给接口进行校验
        this.longitude = coordinates.longitude
        this.latitude = coordinates.latitude
        this.sendsCoordinates()
      } else {
        // 未能获取经纬度
        this.bLocation = true
      }
    },
    // 高德坐标
    webLocation () {
      var that = this
      MapLoader().then((AMap) => {
        var map = new AMap.Map('container', {
          resizeEnable: true
        })
        map.plugin('AMap.Geolocation', function () {
          var geolocation = new AMap.Geolocation({
            enableHighAccuracy: true, // 是否使用高精度定位，默认:true
            timeout: 10000, // 超过10秒后停止定位，默认：无穷大
            buttonPosition: 'RB'
          })
          geolocation.getCurrentPosition()
          AMap.event.addListener(geolocation, 'complete', that.onComplete)
          AMap.event.addListener(geolocation, 'error', that.onError)
        })
      }, error => {
        console.log('地图加载失败', error)
        this.bLocation = true
      })
    },
    getLocation () {
      let {fromChannel, ver} = this.$store.state.config
      if (fromChannel == "sxypApp") {
        if (+(ver.replace(/\./g, '')) >= 210) {
          setTimeout(() => {
            this.appLocation()
          }, 500)
        } else {
          // 低版本不能获取到经纬度-显示未获取到当前位置
          this.bLocation = true
        }
        return false
      }
      // 非app使用高德获取经纬度
      this.webLocation()
    },
    getAddressList () {
      let { uid, token } = this.$store.state.userInfo
      this.showLoad(true)
      this.$post({
        url: this.$store.state.api.QueryReceiptAddress,
        data: {
          uid: uid,
          token: token,
          defaultAdd: 0,
          pageNo: 1,
          pageSize: 1000
        }
      }).then(({data: res}) => {
        this.showLoad(false)
        if (res.status == 1) {
          this.addressList = res.data
        } else if (res.status !='11') {
          this.showToast({
            msg: res.statusMessage
          })
        }
      })
    },
    // 校验用户默认地址是否支持配送
    checkDeliveryAddress () {
      let { uid, token } = this.$store.state.userInfo
      this.$post({
        url: this.$store.state.api.checkUserDefaultAddress,
        data: {
          uid,
          token,
          pageNo: 1,
          productNo: this.productNo,
          pageSize: ''
        }
      }).then(({data: res}) => {
        if (res.status == 1) {
          // 默认地址支持配送
          this.address = res.data
        } else if (res.status == 27) {
          // 默认地址不支持配送
          this.address = res.data
          this.bDelivery = true
        } else if (res.status == 29) {
          // 用户没有收货地址，请求定位
          this.getLocation()
        }
      })
    },
    // 选择其他收货地址
    selectOther () {
      this.$router.push({
        path: '/setAddress'
      })
    },
    // 促销弹窗
    editMask (boo) {
      this.bMask = boo
    },
    settlementAmount (val) {
      let obj = {
        discountAmount: 0,
        totalAmount: 0
      }
      let activityNo = this.goodsInfo.activityNo || (this.goodsInfo.promoteSaleActivityList && this.goodsInfo.promoteSaleActivityList[0]?this.goodsInfo.promoteSaleActivityList[0].activityNo:'') || ''
      this.$post({
        url: this.$store.state.api.getProductDiscount,
        data: {
          activityNo: activityNo,
          count: val,
          productNo: this.productNo
        }
      }).then(({data: res}) => {
        if (res.status == 1) {
          obj = {
            discountAmount: +(res.data.discountPrice),
            totalAmount: +(res.data.total)
          }
          this.updateGoodsInfo({...obj})
        }
      })
    }
  },
  components: {
    goTop,
    swiper,
    StageBoxSpu,
    swiperSlide,
    PanicBuyInfo,
    GoodsInfo,
    GoodsPhotoDetails,
    GoodsRecommend,
    HeaderDetail,
    Comment,
    VideoPlayer,
    Promotion
  }
}
</script>
<style lang="scss" scoped>
@import "../../assets/scss/app";
@import "../../assets/scss/flex";
.swiper-pagination{
  @include px2rem(width, 60);
  @include px2rem(height, 34);
  @include px2rem(line-height, 34);
  position: absolute;
  @include px2rem(bottom, 30);
  left: auto;
  @include px2rem(right, 30);
  color: #fff;
  background: rgba(0,0,0,0.26);
  @include px2rem(border-radius, 17);
  @include font-dpr(24);
}
.swiper-pagination.opacity{
  @include px2rem(bottom, -100);
  opacity: 0;
}
.stage_pay_wrap {
  // @include display-flex;
  width: 100%;
  position: fixed;
  z-index: 9;
  bottom: 0;
  background: #fff;
  @include px2rem(height,100);
  overflow: hidden;
  .shop-cart-icon, .goQiYu-icon {
    margin: .2rem .2rem 0;
    @include px2rem(width, 90);
  }
  .collection-icon{
    margin-top: 0.22rem;
  }
  .business_customer {
    @include font-dpr(22);
    @include display-flex;
    @include flex-direction-column;
    @include justify-content(center);
    @include align-items(center);
    color: $color333;
  }
  .business_customer-pic {
    position: relative;
    @include px2rem(width, 40);
    @include px2rem(height, 40);
    @include px2rem(margin-bottom, 10);
  }
}
.immedia_shop{
  color: #fff !important;
  background-color:#FE9714 !important;
  // border-left: 1px solid $borderColor;
  // border-top: 1px solid $borderColor;
  padding-top: 0 !important;
  @include px2rem(line-height,100);
}
.go_order_btns {
  @include font-dpr(28);
  text-align: center;
  color: #fff;
  background-color: $mainColor;
  @include px2rem(height, 100);
  display: -webkit-box;
  -webkit-box-pack:center;
  -webkit-box-align:center;
  -webkit-box-orient: vertical;
  text-align: center;
  span{
    @include font-dpr(24);
  }
}
.cell_2{
  flex:1
}
.noPro{
  background-color:#BFBFC1;
  color:#fff;
  text-align:center;
  @include px2rem(line-height, 100);
}
.goodHandleBtn{
  color: #F8DFB4 !important;
  background: #333;
  // line-height: 1.2;
  // @include px2rem(padding-top, 10);
}
</style>

<style media="screen" lang="scss">
@import "../../assets/scss/app";
@import "../../assets/scss/flex";
@import "../../assets/scss/animate";
.overflow-hidden {
  overflow: hidden;
  height: 100%;
}
.fullScreenBanner {
  position: fixed !important;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 20;
  .swiper-container {
    position: absolute;
    img {
      max-width: 100%;
      height: auto;
      max-height: 100%;
      min-width: 80%;
    }
  }
}
.skuListWrap {
  display: flex;
  display: -webkit-flex;
  @include font-dpr(28);
  @include px2rem(padding, 24 0);
  // @include lh(72, 72);
  position: relative;
  @include px2rem(margin, 0 24);
  @include px2rem(padding, 16 0);
  border-top: 1px solid #F4F4F4;
  &::after{
    content: '...';
    position: absolute;
    @include font-dpr(40);
    line-height: 1;
    color:#666;
    top:0;
    right: 0;
  }
}

.skuListWrap>span.skuListText {
  color: #999;
  @include px2rem(padding-right, 40);
}

.skuListWrap .skuList {
  flex: 1;
  // color: #999;
  -webkit-flex: 1;
  @include px2rem(margin-right, 26);
}
.staging_container {
  width: 100%;
  height: 100%;
}
.base_info_title {
  // @include px2rem(padding, 0 24 0 24);
  @include font-dpr(32);
  @include lines-ellipsis(2);
  @include px2rem(margin-bottom, 12);
  @include px2rem(line-height, 40);
  &.crossBorder_goods{
    background: url('../../assets/icon/icon/quqiu.png') left 0.09333rem no-repeat;
    @include px2rem(background-size, 88 26);
    @include px2rem(text-indent, 96);
  }
}

#detailBanner {
  position: relative;
  overflow: hidden;
}

#detailBanner:before {
  content: "";
  width: 100%;
  display: block;
  padding-top: 100%;
}

.seckill_items {
  // background: $mainColor url('../../assets/icon/detail/seckill-icon.png') left 0.3rem center no-repeat;
  // @include px2rem(background-size, 50 50);
  @include px2rem(padding, 22 0 20 86);
  color: #fff;
  @include font-dpr(40);
  vertical-align:middle;
  font-weight:600;
}
.timer_s_2 {
  @include font-dpr(24);
  color: #fff;
  @include px2rem(width,37);
  @include px2rem(height,37);
  background: $redColor;
  @include px2rem(line-height,37);
  @include px2rem(margin-left,20);
  @include px2rem(border-radius, 6);
}
.collection-icon{
  &.isCollectCheck {
    .business_customer-pic{
      background: url(../../assets/icon/myCollection/collection-check.png);
      background-size: 100% 100%;
    }
  }
  .business_customer-pic{
    background: url(../../assets/icon/detail/collection_icon.png);
    background-size: 100% 100%;
  }
}
.shop-cart-icon{
  .business_customer-pic{
    background: url(../../assets/icon/detail/shop_icon.png);
    background-size: 100% 100%;
  }
}
.goQiYu-icon{
  .business_customer-pic{
    background: url(../../assets/icon/detail/phone.png);
    background-size: 100% 100%;
  }
}
.visibility{ visibility: hidden; z-index: 2; display: block;}
.bottom-tips{
    position: fixed;
    bottom: 1.1rem;
    left: 0;
    width: 100%;
    // height: .96rem;
    // line-height: .96rem;
    @include px2rem(line-height, 34);
    @include px2rem(padding, 15 15 20);
    background: #FFF8E8;
    @include font-dpr(24);
    text-align: center;
    color: #FAA61A;
    justify-content: space-between;
    // justify-content: center;
    align-items: center;
    overflow: hidden;
  }
  .storeTitle{
  background-color: #fff;
  @include px2rem(height, 90);
  @include px2rem(line-height, 90);
  justify-content: space-between;
  @include px2rem(padding,0 24);
}
.storeName{
  font-size: 0;
}
.storeLogo{
  @include px2rem(height, 66);
  @include px2rem(width, 66);
  @include px2rem(margin-right, 24);
  vertical-align: middle;
}
.storeNameTitle{
  @include font-dpr(30);
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  word-wrap: break-word;
  word-break: break-all;
  flex:1;
  @include px2rem(padding-right, 10);

}
.goStore{
  @include font-dpr(26);
  @include px2rem(padding-right,30);
  background: url('../../assets/icon/icon/return_r.png') no-repeat;
  @include px2rem(background-size,24 24);
  background-position: right center;
}
// 配送至
.shipping-address{
  display: flex;
  @include px2rem(padding, 24 88 24 24);
  background: #fff;
  @include px2rem(background-size, 24 24);
  position: relative;
  .shipping-address-label{
    color: $color999;
    @include font-dpr(28);
    @include px2rem(padding-right, 36);
  }
  .shipping-address-detail{
    flex: 1;
    color: $color444;
    @include font-dpr(28);
  }
  .shipping-address-line{
    @include px2rem(line-height, 40);
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .shipping-address-no{
    color: $redColor;
    @include font-dpr(22);
    @include px2rem(line-height, 30);
    @include px2rem(padding-top, 10);
  }
  .address-icon{
    background: url("../../assets/icon/icon/address-icon-red.png") left 0.09333rem no-repeat;
    @include px2rem(background-size, 24);
    @include px2rem(text-indent, 31);
  }
}
.shipping-address-ok::after{
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto;
  background: url("../../assets/icon/icon/return_r.png") center no-repeat;
  @include wh(24, 24);
  @include px2rem(background-size, 24);
  @include px2rem(right, 24);
}
.position-no{
  color: #BFBFC1;
}
// 配送至
.address-wrap{
  position: fixed;
  left: 0;
  top: 0;
  z-index: 9999;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, .7);
  display: flex;
  .address-con{
    width: 100%;
    @include px2rem(height, 860);
    margin-top: auto;
    background: #fff;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .delivery{
    @include px2rem(height, 84);
    @include px2rem(line-height, 84);
    text-align: center;
    position: relative;
    @include font-dpr(28);
    .close-address{
      @include px2rem(width, 44);
      @include px2rem(height, 44);
      background: url("../../assets/icon/icon/address-icon-close.png") center no-repeat;
      @include px2rem(background-size, 44 44);
      position: absolute;
      top: 0;
      bottom: 0;
      margin: auto;
      @include px2rem(right, 24);
    }
  }
  .address-list{
    flex: 1;
    overflow-y: scroll;
    overflow-x: hidden
  }
  .address-list-default{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .select-other{
    @include px2rem(height, 98);
    @include px2rem(line-height, 98);
    text-align: center;
    color: #fff;
    @include font-dpr(28);
    background: $mainColor;
    margin-top: auto;
  }
  .address-item{
    @include px2rem(margin, 0 24);
    @include px2rem(max-height, 71);
    @include px2rem(padding, 20 0);
    border-bottom: 1px solid #F4F4F4;
    display: flex;
  }
  .address-item:last-of-type{
    border-bottom: none;
  }
  .address-item-ico{
    @include px2rem(width, 34);
    @include px2rem(height, 34);
    @include px2rem(margin-right, 13);
  }
  .address-item-info{
    flex: 1;
    color: $color444;
    @include font-dpr(26);
    @include px2rem(line-height, 33);
    @include px2rem(max-height, 66);
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  .address-bold{
    color: $redColor;
  }
  .default-address{
    @include px2rem(text-indent, 54);
    background: url("../../assets/icon/icon/default-address-text.png") left 0.02667rem no-repeat;
    @include px2rem(background-size, 44 28);
  }
}
.no-belivery{
  position: fixed;
  left: 0;
  @include px2rem(bottom, 100);
  @include px2rem(height, 70);
  @include px2rem(line-height, 70);
  width: 100%;
  background:rgba(255,238,209,.8);
  color: $redColor;
  @include font-dpr(26);
  text-align: center;
  z-index: 9;
}
.stage_pay_wrap .grayBg{
  background: #BFBFC1 !important;
}
</style>
