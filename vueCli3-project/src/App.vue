<template>
  <section class="maxHeight">
    <!-- title start -->
    <Header v-if="useCommonHeader"></Header>
    <!-- title end -->
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" :class="{'content-offset': useCommonHeader, 'content-offset-footer': useCommonFooter}"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" :class="{'content-offset': useCommonHeader, 'content-offset-footer': useCommonFooter}"></router-view>
    <!-- footer start -->
    <Footer v-if="useCommonFooter"></Footer>
    <!-- footer end -->
    <!-- loading start -->
    <Loading></Loading>
    <!-- loading end -->
    <!-- dialog s-->
    <Dialog v-show="dialog.loadAlert.msg != ''"></Dialog>
    <!-- dialog e-->
    <Toast v-show="dialog.toast.msg != ''"></Toast>
  </section>
</template>

<script>
import { getQueryString } from 'lib/until'
import Header from 'components/common/Header'
import Footer from 'components/common/Footer'
import Loading from 'components/common/Loading'
import Toast from 'components/common/dialog/Toast'
import Dialog from 'components/common/dialog/Index'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'App',
  data () {
    return {}
  },
  components: {
    Header,
    Toast,
    Footer,
    Loading,
    Dialog
  },
  computed: {
    ...mapGetters({
      dialog: "getDialogInfo",
      getConfigInfo: "getConfigInfo",
      userInfo: "getUserInfo"
    }),
    // 是否使用头部:指定页面或者 app内不使用头部
    useCommonHeader () {
      let name = this.$store.state.route.name
      let fromChannel = this.getConfigInfo.fromChannel
      return name && name != 'Index' && name != 'login' && name != 'mine' && name != 'searchContent' && fromChannel != 'sxymApp' && !this.$route.meta.userIndexHeader
    },
    useCommonFooter () {
      return this.$store.state.route.meta.MainFooter
    }
  },
  methods: {
    ...mapActions([
      "loginToken",
      "updateToast",
      "showOneBtnDialog",
      "updateUserInfo"
    ])
  },
  created () {
    const userId = getQueryString("userId") || window.sessionStorage.getItem('userId') || ''
    if (userId) {
      // 判断session是否有userId，如果有的话把userId取出来覆盖到userInfo
      this.updateUserInfo({userId})
      window.sessionStorage.setItem('userId', userId)
    } else {
      this.updateUserInfo({userId})
      window.sessionStorage.removeItem('userId')
    }
  }
}
</script>
<style lang="scss">
// 所有样式的集合
  @import './assets/scss/aggregate';
</style>
