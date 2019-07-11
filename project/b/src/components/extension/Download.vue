<template>
  <section class="extension_wrap">
    <img src="../../assets/icon/share/download_bg1.jpg" class="downloadBg downloadTop" alt="">
    <div class="downloadBottom">
      <button type="button" name="button" class="downloadBtn" @click="bindEvent" v-if="!isDownload"></button>
      <button type="button" name="button" class="downloadBtn downloadBtnA" @click="bindEvent" v-else></button>
      <span class="openApp" @click="openApp">已安装？戳这里</span>
    </div>
    <div class="pop_box" v-if="isShowpop" @click="showpop">
      <img src="../../assets/icon/llqdk.jpg" class="llqda_box">
    </div>
  </section>
</template>
<script>
import { is_iphone, is_weixn } from 'lib/until'
import BodyBg from '../../mixin/index'
export default {
  mixins: [BodyBg],
  data () {
    return {
      isShowpop: false,
      isDownload: false
    }
  },
  created () {
    let headNode = document.getElementsByTagName('head')
    let metaNode = document.createElement('meta')
    metaNode.content = "0;url=linksxyp:"+process.env.SXYPNAME
    metaNode.httpEquiv = 'Refresh'
    headNode[0].appendChild(metaNode)
    this.showLoad(false)
  },
  methods: {
    showpop () {
      this.isShowpop = !this.isShowpop
    },
    bindEvent () {
      this.isDownload = true
      setTimeout(() => {
        this.isDownload = false
      }, 300)
      if (is_weixn()) {
        this.showpop()
      } else if (is_iphone()) {
        // ios下载地址
        window.location.href = "https://itunes.apple.com/cn/app/%E6%B0%B4%E8%B1%A1%E4%BC%98%E5%93%81-%E9%9A%8F%E4%BA%AB%E7%94%9F%E6%B4%BB-%E4%BC%98%E8%B4%A8%E7%89%B9%E5%8D%96/id1419571363?mt=8"
      } else {
        // 安卓下载地址
        window.location.href = "https://qmarket.oss-cn-shanghai.aliyuncs.com/app/sxyp.apk"
      }
      // window._czc.push(["_trackEvent", "分享页下载", "点击", ""])
    },
    openApp () {
      if (is_weixn()) {
        this.showpop()
      } else {
        window.location.href = 'linksxyp:'+process.env.SXYPNAME
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.pop_box{
position: fixed;
left: 0;
top: 0;
bottom: 0;
right: 0;
}
.llqda_box{
width: 100%;
height: 100%;
opacity: 0.9;
}
</style>
