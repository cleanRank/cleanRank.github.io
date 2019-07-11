<template>
<section v-if="isLoading">
   <div class="detail">
      <div class="detailTit">
         {{anounceDetail.title}}
      </div>
      <div class="detailSub">
          <span class="author">{{anounceDetail.author}}</span>
          <span class="author">{{anounceDetail.createTime | timeFormat(1) }}</span>
      </div>
      <div class="detailCon">
         <div class="detailMain" id="detailMain" v-html="anounceDetail.detail">
         </div>
      </div>
      <div class="detailshare" v-if="origin=='floor'&& anounceDetail.showShare==1" @click.stop="toShare(anounceDetail.contentNumber)">推广</div>
   </div>
</section>
</template>
<style lang="scss" scoped>
@import "../../assets/scss/app";
.detail{
    @include px2rem(padding, 0 24);
    .detailTit{
        @include font-dpr(28);
        font-weight: bold;
        color:#333;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: justify;
        display: -webkit-box;
        word-break: break-all;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        @include px2rem(margin-bottom, 24);
    }
    .detailshare{
        position: fixed;
        right: 0;
        bottom: 0;
        @include px2rem(margin-bottom, 24);
        @include px2rem(width, 120);
        @include px2rem(height, 52);
        background: rgba($color: #000000, $alpha: 0.7);
        @include px2rem(border-radius, 52);
        @include font-dpr(26);
        color:#fff;
        text-align: center;
        @include px2rem(line-height, 52);
    }
    .detailSub{
      @include font-dpr(22); 
      @include px2rem(margin-bottom, 40);
      color:#999;
      .span{
        display: inline-block;
      } 
      .author{
         @include px2rem(margin-right, 20);
         @include px2rem(width, 120);
         overflow: hidden;
         text-overflow: ellipsis;
         white-space: nowrap;
      }
    }
    .detailBan{
        width:100%;
        @include px2rem(margin-bottom, 24);
        img{
            display: block;
            width: 100%;
        }
    }
    .detailMain{
       @include font-dpr(24);
       color:#444;
       @include px2rem(line-height, 46);
       text-align: justify;
       overflow:hidden;
    }
}
</style>
<script>
import changeBg from '@/mixin/'
import { SHOW_SHARE } from 'store/mutation-types'
export default {
  mixins: [changeBg],
  data () {
    return {
      isLoading: false,
      anounceDetail: {},
      origin: this.$store.state.route.query.origin,
      isAc: this.$store.state.route.query.isAc,
      contentId: this.$store.state.route.query.contentId,
      contentNum: this.$store.state.route.query.contentNum,
      fromChannel: '',
      versionName: '',
      newTitle: '',
      title: ''
    }
  },
  created () {
    this.fromChannel= this.$store.state.route.query.fromChannel
    this.getAnnounceDetail().then(() => {
      this.$root.$emit('setTitle', this.versionName)
    })
  },
  beforeRouteUpdate (to, from, next) {
    this.getAnnounceDetail().then(() => {
      this.$root.$emit('setTitle', this.versionName)
    })
  },
  mounted () {
    this.$root.$on('setTitle', (title) => {
      this.title = title
    })
  },
  updated () {
    let obj = document.getElementById('detailMain')
    let imgs = obj.getElementsByTagName('img')
    for (let i = 0; i < imgs.length; i++) {
      imgs[i].style.width = '100%'
    }
  },
  methods: {
    getAnnounceDetail () {
      let { uid, token } = this.$store.state.userInfo
      return this.$post({
        url: this.$store.state.api.getAnounceDetail,
        data: {
          uid,
          token,
          contentId: this.contentId
        }
      }).then(res => {
        this.showLoad(false)
        this.isLoading = true
        res.data.data.detail = res.data.data.detail.replace(/="http:/g, '="https:')
        res.data.data.detail = res.data.data.detail.replace(/font-size:\s\d+px/g, function (wrod) {
          return 'font-size:' + ((wrod.split('font-size:')[1].split('px')[0])/45).toFixed(5) + 'rem'
        })
        this.anounceDetail=res.data.data
        this.anounceDetail.createTime = res.data.data.createTime
        this.versionName = res.data.data.designation
        this.$set(this.$data, 'versionName', this.versionName)
      })
    },
    getFloorDetail () {
      let { uid, token } = this.$store.state.userInfo
      this.$post({
        url: this.$store.state.api.getFloorDetail,
        data: {
          uid,
          token,
          contentNumber: this.contentNum
        }
      }).then(res => {
        this.showLoad(false)
        this.isLoading = true
        this.anounceDetail=res.data
        this.anounceDetail.createTime =res.data.createTime.time
      })
    },
    toShare (id) {
      // 客户端分享方法
      let { uid, token } = this.$store.state.userInfo
      this.$post({
        url: this.$store.state.api.getShareImg,
        data: {
          uid,
          token,
          contentNumber: id
        }
      }).then(res => {
        this.showLoad(false)
        this.isLoading = true
        let url = window.location.origin + window.location.pathname + "#/announceDetail?fromChannel=sxyph5&origin=floor&isAc=true&contentNum="+res.data.contentNum
        this.$store.commit(SHOW_SHARE, {
          showFlag: true,
          title: res.data.title,
          desc: res.data.summary,
          link: url,
          imgUrl: res.data.shareImg,
          keepImgUrl: res.data.shareImg
        })
      })
    }
  }
}
</script>
