<template>
  <header class="head-cont flex position" v-if="!$route.meta.hideHeader && !($store.state.config.fromChannel == 'sxypApp' && $store.state.route.name == 'Yhzcxy')">
       <a class="return cell_0" href="javascript:void(0)" @click="backUrl" v-if="!$route.meta.hideReturn"></a>
       <span class="tit cell_1">{{$route.meta.title || title}}</span>
      <section class="right-icon flex" v-if="!isShowHomeIcon">
        <template v-for="_item in $route.meta['titleBtn']">
           <router-link v-if="_item['to'] && $store.state.config.fromChannel != 'sxypApp'" tag="a" :to="_item.to" :class="_item.className">{{_item.text}}</router-link>
           <template v-else>
              <!-- 有分享按钮的需要单独处理 s -->
               <template v-if="_item['showShare']">
                    <a href="javascript:void(0)" v-if="isShowHeaderShareBtn" :class="_item.className" @click="triggerCallBack(_item)"></a>
               </template>
               <a href="javascript:void(0)" v-else-if="$store.state.config.fromChannel != 'sxypApp'" :class="_item.className" @click="triggerCallBack(_item)"></a>
             <!-- 有分享按钮的需要单独处理 e -->
           </template>
        </template>
      </section>
   </header>
</template>
<script type="text/javascript">
  import { app, getQueryString } from 'lib/until'
  import {SHOW_SHARE, UPDATE_SHARE_INFO} from '../../store/mutation-types'
  import { mapActions } from 'vuex'
  export default {
    computed: {
      // 是否显示回到首页的icon
      isShowHomeIcon () {
        // return this.$route.name === 'Detail'
      },
      // 是否显示分享按钮
      // *** 后期会自定义render函数来渲染页面 ***
      isShowHeaderShareBtn () {
        return this.showShareBtn && this.canShareBtnShow
      }
    },
    props: {
      url: ''
    },
    data () {
      return {
        isReturn: false,
        title: '',
        showShareBtn: this.$store.state.config.fromChannel == 'sxypApp' && +(this.$store.state.config.ver.replace(/\./g, '')) >= 130,
        canShareBtnShow: false,
        isShowreturn: this.$store.state.route.name != 'Paysucces' && this.$store.state.route.name != 'PaysuccessLoan' && this.$store.state.route.name != 'PayDown' && this.$store.state.route.name != 'ProtocolList' && !(this.$store.state.route.name == 'Category' && this.$store.state.config.fromChannel == 'sxypApp')
      }
    },
    mounted () {
      this.$root.$on('setTitle', (title) => {
        this.title = title
      })
      this.$root.$on('showShareBtn', (state) => {
        this.canShareBtnShow = state
      })
    },
    watch: {
      '$route' (to, from) {
        this.title = ''
        this.canShareBtnShow = false
        this.isShowreturn = this.$store.state.route.name != 'Paysucces' && this.$store.state.route.name != 'PaysuccessLoan' && this.$store.state.route.name != 'PayDown' && this.$store.state.route.name != 'ProtocolList' && !(this.$store.state.route.name == 'Category' && this.$store.state.config.fromChannel == 'sxypApp')
        this.showShareBtn = this.$store.state.config.fromChannel == 'sxypApp' && +(this.$store.state.config.ver.replace(/\./g, '')) >= 130
      }
    },
    methods: {
      ...mapActions(["update_Nightpalaces"]),
      // header触发制定的事件
      triggerCallBack ({fn}) {
        this[fn] && this[fn]()
      },
      // 显示/隐藏9宫格
      isShowNightPalaces () {
        this.update_Nightpalaces()
      },
      // 分享事件
      shareUrl () {
        if (this.showShareBtn && this.canShareBtnShow) {
          this.$store.commit(UPDATE_SHARE_INFO, {
            keepImgUrl: "",
            productNo: "",
            activityNo: "",
            isActivity: ""
          })
          if (this.$store.state.route.name == 'Activity') {
            this.getActivityShareImg()
          } else {
            this.$store.commit(SHOW_SHARE)
          }
        }
      },
      // 获取活动分析图片
      getActivityShareImg () {
        let { uid, token, inviteCode } = this.$store.state.userInfo
        if (uid =='' && token == '') {
          app.welogin()
          return false
        }
        this.showLoad(true)
        let {versionId} = this.$route.params
        this.$post({
          url: this.$store.state.api.appShare,
          data: {
            uid,
            token,
            senc: `share=${inviteCode}`,
            turnPage: 'pages/index/activityPage/activityPage',
            versionId: versionId
          }
        }).then(({data: res}) => {
          if (res.status == 1) {
            this.$store.commit(UPDATE_SHARE_INFO, {
              keepActivityImgUrl: res.data.activityPageShareUrl
            })
            this.$store.commit(SHOW_SHARE)
            setTimeout(() => {
              this.showLoad(false)
            }, 1000)
          }
        })
      },
      // 回到首页
      backIndex () {
        this.$router.push('/')
      },
      backUrl () {
        console.log(window.location.href)
        let fromChannel = this.$store.state.config.fromChannel
        const fromPage = this.$store.state.route.query['fromPage'] || getQueryString('fromPage') || ''
        const share = this.$store.state.route.query['share'] || getQueryString('share') || ''
        const currentName = this.$store.state.route.name
        if (currentName == 'CardRate' && window.sessionStorage.getItem('goHistory')) {
          window.history.go(-1)
          window.sessionStorage.removeItem('goHistory')
          return false
        }
        // 电影票单独使用收银台，添加返回逻辑
        if (fromChannel == 'sxypApp' && ((!this.$store.state.route.from.name && currentName != "Cashier") || fromPage == 'sxApp')) {
          app.goIndex()
          return false
        }
        const goCreditpage = window.sessionStorage.getItem('goCreditpage') || ''
        if (currentName == "MyBankCart" || currentName == "ContactCS" || currentName=="AfterSalesList") {
          if (fromChannel == 'sxypApp') {
            app.wemine()
          } else {
            window.history.go(-1)
          }
        } else if (currentName == 'ActivityNew' || currentName == 'Activity') {
          // 分享出去的链接,返回首页
          if (share && !this.$store.state.route.from.name) {
            this.$router.push('/')
            return false
          }
          window.history.go(-1)
        // } else if (currentName=="AfterSalesList" || currentName == 'OrderList') {
        //   if (fromChannel == 'sxypApp') {
        //     app.wemine()
        //   } else {
        //     this.$router.push('/')
        //   }
        } else if (currentName == "Cashier") {
          const referrer = window.document.referrer
          const host = window.location.host
          console.log('referrer' + referrer)
          console.log('host' + host)
          if (referrer.indexOf(host) > -1) {
            window.history.go(-1)
          } else {
            // window.location.href = process.env.SXYPNAME + '/index.html#/'
            this.$router.push('/')
          }
        } else if (currentName == "Personal") {
          if (this.$store.state.route.from.name) {
            window.history.go(-1)
          } else {
            this.$router.push('/')
          }
        } else if (currentName=="Confirmorder") {
          // 跨境商品未实名用户去白条项目，返回键需要特殊处理返回键
          if (goCreditpage && goCreditpage.indexOf('#/confirmorder') > -1) {
            let historyLen = window.sessionStorage.getItem('historyLen')
            let len = window.history.length - historyLen + 1
            window.history.go(-len)
          } else {
            window.history.go(-1)
          }
        } else if (currentName == 'RepayResult') {
          // 还款结果页返回还款列表页
          window.history.go(-2)
        } else {
          window.history.go(-1)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
@import "../../assets/scss/app";
.head-cont .empty_r.shareBtn {
  @include px2rem( margin-right, 30);
  @include px2rem(width, 36);
  background: url(../../assets/icon/icon/share.png) 50% 50%/contain no-repeat;
}
.right-icon{
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    -webkit-justify-content: center;
    justify-content: center;
    -webkit-align-items: center;
    align-items: center;
    &>a{
      float: right;
      margin-right: .4rem;
    }
    .back-index{
      width: .4933rem;
      height: 100%;
      background: url(../../assets/icon/icon/home_icon.png) no-repeat;
      background-size: 100% 100%;
    }
    .share-url{
      width: .4933rem;
      height: 100%;
      background: url(../../assets/icon/icon/share.png) left center no-repeat;
      background-size: 0.44rem 0.44rem;
   }
}
.night-palaces{
  @include px2rem(width,40);
  @include px2rem(height, 40);
  background: url(../../assets/icon/icon/home_more_icon@3x.png) center 100% no-repeat;
  background-size: 100% 100%;
}
</style>
