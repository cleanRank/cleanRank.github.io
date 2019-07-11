<template>
  <header class="head-cont flex position" :style="{ background: 'rgba(255,255,255,' + opacity + ')'}">
    <a class="return cell_0" :class="[opacity<1?'bank_btn':'']" href="javascript:;" @click="backUrl"></a>
    <span class="detail_title cell_1" :style="{opacity}">
      <b v-for="(item, i) in titleList" :key="i" :class="['tab_btn', tabIndex==i?'cur':'']" @click="tabClick(i)">{{item}}</b>
    </span>
    <section v-if="$store.state.config.fromChannel == 'sxypApp' && +($store.state.config.ver.replace(/\./g, '')) > 130" class="right-icon flex"><a href="javascript:void(0)" :class="[opacity<1?'share-url':'share-url2']" @click="shareUrl"></a></section>
  </header>
</template>
<script type="text/javascript">
  import { app, getQueryString } from 'lib/until'
  import {SHOW_SHARE, UPDATE_SHARE_INFO} from '../../store/mutation-types'
  export default {
    props: {
      opacity: {
        required: true,
        type: Number,
        default: 0
      },
      tabIndex: {
        required: true,
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        titleList: ['商品', '详情', '评论']
      }
    },
    methods: {
      tabClick (i) {
        this.$emit('getIndex', i)
      },
      backUrl () {
        let fromChannel = this.$store.state.config.fromChannel
        const fromPage = this.$store.state.route.query['fromPage'] || getQueryString('fromPage') || ''
        const share = this.$store.state.route.query['share'] || getQueryString('share') || ''
        if (fromChannel == 'sxypApp' && (!this.$store.state.route.from.name || fromPage == 'sxApp')) {
          app.goIndex()
          return false
        }
        // 分享出去的链接,返回首页
        if (share && !this.$store.state.route.from.name) {
          this.$router.push('/')
          return false
        }
        window.history.go(-1)
      },
      shareUrl () {
        let {ver} = this.$store.state.config
        if (+(ver.replace(/\./g, '')) > 145) {
          this.$parent.promotionShow()
        } else {
          this.$store.commit(UPDATE_SHARE_INFO, {
            keepImgUrl: ''
          })
          this.$store.commit(SHOW_SHARE)
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
.head-cont{
  border: none;
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
      width: 0.8rem;
      height: 0.8rem;
      background: url(../../assets/icon/icon/share_icon.png) no-repeat;
      background-size: 100% 100%;
   }
   .share-url2{
      width: 0.8rem;
      height: 0.8rem;
      background: url(../../assets/icon/icon/share.png) center no-repeat;
      background-size: 0.44rem 0.44rem;
   }
}
</style>
