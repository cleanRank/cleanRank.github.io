<template>
  <section class="video-player-section">
    <div class="video-player">
      <video width="100%" height="100%" controls="true" preload="auto" ref="videoPlayer" class="video-js" webkit-playsinline="" playsinline="" x5-playsinline="true" x5-video-player-fullscreen="true" :poster="poster"></video>
      <!-- 退出视频 -->
      <span class="quit-playing" @click.stop="quitPlaying" v-if="bPlay && bPoster">退出视频</span>
      <div class="video-poster" v-if="!bPlay">
        <!-- 封面 -->
        <img class="video-poster-img" :src="poster" v-if="bPoster" >
        <!-- 播放按钮 -->
        <span class="video-btn video-play-btn" @click.stop="play" v-if="!bContinuePlay"></span>
        <div class="mobile-network" v-if="bContinuePlay">
          <span class="video-btn video-play-btn" @click.stop="continuePlay"></span>
          <!-- wiif -->
          <p class="video-play-text" v-if="$store.state.networkInfo.type">您正在使用非WiFi网络，是否继续播放</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import { is_android } from 'lib/until'
import { UPDATENETWORK } from 'store/mutation-types'

export default {
  name: "VideoPlayer",
  props: {
    options: {
      type: Object,
      default () {
        return {}
      }
    },
    poster: {
      type: String,
      default () {
        return {}
      }
    },
    bPoster: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      isOnline: navigator.onLine,
      bPlay: false,
      bPause: false,
      player: null,
      bContinuePlay: false,
      playStatus: 0,
      pauseStatus: 0,
      iNum: 1
    }
  },
  mounted () {
    var that = this
    this.player = videojs(this.$refs.videoPlayer, this.options, function onPlayerReady () {
      // 监听视频播放结束
      this.on('ended', () => {
        that.quitPlaying()
      })
      // 监听错误
      this.on('error', () => {
        var mediaError = this.error()
        console.log(mediaError)
        if (mediaError.code == 1) {
          console.log('视频播放被终止')
        } else if (mediaError.code == 2) {
          console.log('网络错误导致视频下载中途失败')
        } else if (mediaError.code == 3) {
          console.log('由于视频文件损坏或是该视频使用了你的浏览器不支持的功能，播放终止。')
        } else if (mediaError.code == 4) {
          console.log('视频因格式不支持或者服务器或网络的问题无法加载。')
        } else if (mediaError.code == 5) {
          console.log('视频已加密，无法解密。')
        }
      })
      // 监听暂停
      this.on('pause', () => {
        that.pauseStatus = 1
        that.playStatus = 2
      })
      // 监听播放
      this.on('play', () => {
        that.playStatus = 1
        that.pauseStatus = 2
      })
      this.on('fullscreenchange', (res) => {
        that.iNum++
      })
    })
  },
  methods: {
    // 播放
    play () {
      if (is_android()) {
        this.connectionType()
      }
      if (this.$store.state.networkInfo.type =='2') {
        this.bContinuePlay = true
        return false
      }
      this.bPlay = true
      this.player.play()
    },
    // 暂停
    pause () {
      this.player.pause()
    },
    // 关闭播放
    quitPlaying () {
      this.player.pause()
      this.player.currentTime(0)
      this.bPlay = false
    },
    // 获取网络类型
    connectionType () {
      var connection = navigator.connection||navigator.mozConnection||navigator.webkitConnection||{tyep: 'unknown'}
      var type_text = ['unknown', 'ethernet', 'wifi', '2g', '3g', '4g', 'none']
      if (typeof (connection.type) == "number") {
        connection.type_text = type_text[connection.type]
      } else {
        connection.type_text = connection.type
      }
      let type = 1
      if (connection.type != 'wifi' && this.isOnline) {
        type = 2
      }
      this.$store.commit(UPDATENETWORK, {
        type
      })
    },
    continuePlay () {
      this.bPlay = true
      this.bContinuePlay = false
      this.player.play()
    }
  },
  beforeDestroy () {
    if (this.player) {
      this.player.dispose()
    }
  }
}
</script>

<style media="screen" lang="scss">
@import "../../assets/scss/app";
.video-player-section,.video-js,.video-player{
  @include px2rem(width, 750);
  @include px2rem(height, 750);
  position: relative;
}
.video-poster{
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 9;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .video-btn,.video-play-text{
    position: relative;
    z-index: 9;
  }
  .video-play-text{
    color: #fff;
    @include font-dpr(24);
    @include px2rem(padding-top, 24);
  }
}

.video-poster-img{
  @include px2rem(width, 750);
  @include px2rem(height, 750);
  position: absolute;
  left: 0;
  top: 0;
}
.video-btn{
  @include px2rem(width, 100);
  @include px2rem(height, 100);
  display: block;
}
.quit-playing{
  @include px2rem(height, 34);
  @include px2rem(line-height, 34);
  @include px2rem(padding, 0 12);
  @include px2rem(line-height, 34);
  @include px2rem(border-radius, 17);
  position: absolute;
  @include px2rem(right, 24);
  @include px2rem(top, 200);
  color: #fff;
  @include font-dpr(24);
  background: rgba(0,0,0,0.7);
}
.video-play-btn{
  background: url('../../assets/icon/detail/play.png') center center no-repeat;
  background-size: 100% 100%;
}
.mobile-network{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: rgba(0,0,0,0.7);
  position: relative;
  z-index: 9;
}
.video-js{
  width: 100%;
  object-fit:fill;
  margin: 0 auto;
}
.video-js .vjs-tech {
  position: relative;
}
/* 控制栏 */
.video-js .vjs-control-bar{
  background: rgba(0, 0, 0, 0);
  @include px2rem(height, 80);
}

/* 播放进度栏 */
.video-js .vjs-progress-holder,.video-js .vjs-load-progress div,.video-js .vjs-load-progress{
  @include px2rem(height, 8);
  @include px2rem(border-radius, 4);
}
.video-js .vjs-play-progress{
  @include px2rem(height, 8);
  @include px2rem(border-radius, 4);
  background: linear-gradient(90deg, rgba(254,131,131,1) 0%, rgba(253,69,95,1) 100%);
}
.video-js .vjs-play-progress:before{
  top: 0 !important;
  bottom: 0 !important;
  margin: auto;
  @include px2rem(height, 10);
  @include px2rem(line-height, 10);
  @include font-dpr(22);
}
.video-js .vjs-load-progress div,.video-js .vjs-progress-holder,.video-js .vjs-load-progress{
  background: #fff;
}
// 隐藏播放按钮
.video-js .vjs-big-play-button,.video-js .vjs-volume-panel{
  display: none;
}
//
.video-js .vjs-time-control{
  @include font-dpr(24);
  @include px2rem(padding, 0 8);
  @include px2rem(line-height, 80);
}

.video-js .vjs-play-control,.video-js .vjs-fullscreen-control {
  @include px2rem(width, 60);
  display: flex;
  justify-content: center;
}

.vjs-button > .vjs-icon-placeholder::before{
  @include font-dpr(42);
  @include px2rem(line-height, 80);
}
.vjs-icon-placeholder::before{
  @include font-dpr(42);
  @include px2rem(line-height, 80);
}
</style>

