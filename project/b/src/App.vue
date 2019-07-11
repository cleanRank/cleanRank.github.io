<template>
   <section class="maxHeight" v-if="isLoadHtml">
     <!-- title s -->
      <Headers v-if="useCommonHeader" ref="header"></Headers>
      <!-- title s -->
      <!-- 用transition 把切换组件页面的容器包含 -->
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive" :class="{'content-offset': useCommonHeader, 'content-footer':($route.meta.showFooter)}"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive" :class="{'content-offset': useCommonHeader, 'content-footer':($route.meta.showFooter)}"></router-view>
       <!-- footer s -->
      <Footers v-if="$route.meta.showFooter && isShowFooter"></Footers>
       <!-- footer e -->
      <!-- toast s -->
      <Toast v-show="dialog.toast.msg != ''"></Toast>
      <!-- toast e -->

      <!-- dialog s-->
      <Dialogs v-show="dialog.loadAlert.msg != ''"></Dialogs>
      <!-- dialog e-->

      <!-- loading s -->
      <Loading></Loading>
      <!-- loading e -->

   </section>
</template>
<script type="text/javascript">
  import { getQueryString, is_android } from 'lib/until'
  import { mapGetters, mapActions } from 'vuex'
  import Loading from 'components/common/Loading'
  import Header from 'components/common/Header'
  import Footers from 'components/common/Footers'
  import Toast from 'components/common/dialog/Toast'
  import Dialog from 'components/common/dialog/'
  import { UPDATENETWORK } from 'store/mutation-types'
  export default {
    data () {
      return {
        isLoadHtml: false,
        isShowMenu: false,
        isShowFooter: false
      }
    },
    computed: {
      ...mapGetters({
        dialog: "getDialogInfo",
        userInfo: "getUserInfo",
        switchInfo: "getSwitchInfo"
      }),
      useCommonHeader: function () {
        const name = this.$store.state.route.name
        return name && name != 'Index' && name !== 'Search' && name !== 'Detail' && name !== 'ExtenRegister' && name !== 'Download' && name !== 'ReceiveSuccess' && name !== 'Personal'
      }
    },
    components: {
      Footers,
      "Loading": Loading,
      "Headers": Header,
      "Toast": Toast,
      "Dialogs": Dialog
    },
    methods: {
      ...mapActions([
        "updateToast",
        "showOneBtnDialog",
        "loginTokenWanKa",
        "updateUserInfo",
        "addGoodsInfo",
        "updateGoodsInfo",
        "switchControl",
        "updateSwitchInfo"
      ])
    },
    created () {
      // 查询总开关
      this.switchControl()
      const queryToken = getQueryString("token") || window.sessionStorage.getItem('token') || ''
      // 客户端强登之后，清除userid
      if (getQueryString("token")) { window.sessionStorage.removeItem('userId') }
      const userId = getQueryString("userId") || window.sessionStorage.getItem('userId') || ''
      // 判断session是否有token，如果有的话把token取出来覆盖到userInfo
      let token = queryToken || userId
      if (token) {
        // 联合登录
        this.loginTokenWanKa().then(() => {
          this.updateUserInfo({loginTokenWanKaState: 2, isLoginedTokenWanKa: true})
        })
      } else {
        this.updateUserInfo({token, uid: '', mobile: ''})
        window.sessionStorage.removeItem('token')
        window.sessionStorage.removeItem('uid')
        window.sessionStorage.removeItem('mobile')
        window.sessionStorage.removeItem('userId')
        this.updateUserInfo({loginTokenWanKaState: 1, isLoginedTokenWanKa: true})
      }
    },
    watch: {
      // '$route' () {
      //   if (window._czc) {
      //     let location = window.location
      //     let contentUrl = location.pathname + location.hash
      //     let refererUrl = '/'
      //     window._czc.push(['_trackPageview', contentUrl, refererUrl])
      //   }
      // },
      'switchInfo.status': function (newVal, oldVal) {
        if (newVal) {
          this.isShowFooter = true
        }
      }
    },
    mounted () {
      // 服务器端渲染期间，避免快速进行路由跳转拿不到历史纪录
      this.$nextTick(() => {
        this.isLoadHtml = true
      })
      // 友盟统计
      // const script = document.createElement('script')
      // script.src = (document.location.protocol == 'https:' ? 'https://' : 'http://') + 'w.cnzz.com/c.php?id=1274463883&async=1'
      // script.language = 'JavaScript'
      // document.body.appendChild(script)
      try {
        const that = this
        window.jsHandlerToken = function (val) {
          // 登录成功之后得回掉函数，用于和客户端交互
          console.log(val)
          console.log(typeof val)
          let value = val
          if (!is_android()) {
            value = JSON.parse(val)
          }
          if (value.token) {
            // 客户端强登之后，清除userid
            window.sessionStorage.removeItem('userId')
            let uid = value.uid || ''
            that.updateUserInfo({token: value.token, mobile: value.mobile, uid, userId: ''})
            window.sessionStorage.setItem('token', value.token)
            window.sessionStorage.setItem('mobile', value.mobile)
            window.sessionStorage.setItem('uid', uid)
            that.loginTokenWanKa()
          } else {
            // 退出登录
            window.sessionStorage.removeItem('token')
            window.sessionStorage.removeItem('mobile')
            window.sessionStorage.removeItem('uid')
            window.sessionStorage.removeItem('userId')
            that.updateUserInfo({token: '', mobile: '', uid: ''})
          }
        }
        window.getCommodityList = function (val) {
          // 客户端购物车回调
          if (val) {
            window.sessionStorage.setItem("fromPage", 'ShopCart')
            let userChooseGoods = JSON.parse(val)
            that.updateGoodsInfo({isCrossBorder: userChooseGoods[0].isCrossBorder})
            that.addGoodsInfo(userChooseGoods)
          }
        }
        window.getConnectionType = function (val) {
          // 详情页网络回调
          console.log('安卓')
          if (val) {
            console.log('详情页网络回调')
            let {type} = JSON.parse(val)
            console.log("type:"+type)
            that.$store.commit(UPDATENETWORK, {
              type
            })
          }
        }
        window.receiveAddressInfo = function (val) {
          console.log('接收app传过来的经纬度信息')
          if (val) {
            window.sessionStorage.setItem('coordinates', val)
            console.log(window.sessionStorage.getItem('coordinates', val))
          }
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
</script>
<style lang="scss">
// 所有样式的集合
  @import './assets/scss/aggregate';

  .pop_box {
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 100000;
  }
  // .tip-cont {
  //     margin: 0rem .90667rem;
  //     background: $bgColor;
  //     text-align: center;
  //     position: fixed;
  //     left: 0;
  //     right: 0;
  //     bottom: .4rem;
  //     z-index: 10000111;
  //     // -webkit-transform: translate(0, -50%);
  //     // -moz-transform: translate(0, -50%);
  //     // -o-transform: translate(0, -50%);
  //     // transform: translate(0, -50%);
  //     border-radius: .26667rem;
  // }
  .position {
    position: fixed !important;
    left: 0;
    top: 0;
    width: 100%;
    z-index: 999;
  }
  .content-offset {
    @include px2rem(margin-top, 88);
    border-top: 1px solid transparent;
    &.mg100{
      @include px2rem(margin-top,160);
    }
  }
  .content-footer{
    @include px2rem(padding-bottom, 84);
  }
.invalid-tips{
    background-color: #f6f6f6;
    line-height: .9067rem;
    padding: 0 .4rem;
    @include font-dpr(28);
    &>.left-text{
      color: #666;
    }
    &>.right-btn{
      color: #C43A37;
    }
  }
  .nightBoxMargin {
    top: 1.30667rem;
  }
</style>
