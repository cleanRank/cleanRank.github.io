<template>
  <div class="floor-fifteen">
    <img class="floor-fifteen-img" v-if="floor.bgImg" :src="floor.bgImg" alt="">
    <div class="floor-fifteen-video" ref="videoWrap">
      <img class="floor-fifteen-video-poster" :src="floor.listFloorDetail[0].vedioImg" v-if="!bVideo">
      <div class="floor-fifteen-video-mask" v-show="!bVideo && !bContinuePlay">
        <span class="floor-fifteen-video-duration"><span>{{floor.listFloorDetail[0].vedioTime}}</span></span>
        <!-- 播放按钮 -->
        <span class="vj-play-pause" @click="play"></span>
      </div>
      <!-- 非wifi -->
      <div class="floor-fifteen-video-network" v-if="bContinuePlay">
        <span class="vj-play-pause" @click="continuePlay"></span>
        <p>您正在使用非WiFi网络，是否继续播放</p>
      </div>
      <ModelVideo ref="modelVideo" :options="options" :floor="floor" @initVideo="initVideo" @removeScroll="removeScroll"></ModelVideo>
    </div>
  </div>
</template>
<script type="text/javascript">
  import ModelVideo from './ModelVideo'
  import { is_android } from 'lib/until'
  import { UPDATENETWORK } from 'store/mutation-types'
  export default {
    data () {
      return {
        bVideo: false,
        options: {
          autoplay: false,
          controls: true,
          sources: []
        },
        bContinuePlay: false,
        isOnline: navigator.onLine,
        bScroll: false
      }
    },
    props: {
      floor: {
        required: true,
        type: Object
      },
      videoList: {
        required: true,
        type: Array
      }
    },
    components: {
      ModelVideo
    },
    created () {
      let obj = {
        src: this.floor.listFloorDetail[0].vedioUrl,
        type: "video/mp4"
      }
      this.options.sources.push(obj)
    },
    methods: {
      play () {
        if (is_android()) {
          this.connectionType()
        }
        if (this.$store.state.networkInfo.type =='2' && !this.$store.state.networkInfo.bWiFi) {
          this.bContinuePlay = true
          this.$store.commit(UPDATENETWORK, {
            bWiFi: true
          })
          return
        }
        // 显示video组件
        this.bVideo = true
        this.pause()
        this.$refs.modelVideo.play()
      },
      pause () {
        // 先关闭所有播放器
        this.videoList.forEach((val, index) => {
          this.$parent.$refs['fifteen'+val.floorId][0].$refs.modelVideo.pause()
        })
      },
      initVideo (boo) {
        this.bVideo = boo
      },
      removeScroll (boo) {
        this.bScroll = boo
      },
      onScroll () {
        let headerHeight = 0 // header
        let footerHeight = 0 // footer高度
        if (this.$store.state.route.name == 'Index') {
          // 首页
          headerHeight = $('.new-index-header').height() + $('.new-category').height()
          footerHeight = $('.footer_wrap').height()
        } else {
          // 活动页
          headerHeight = $('.head-cont').height()
        }
        var windowTop = document.body.scrollTop || document.documentElement.scrollTop || 0
        var innerH = window.innerHeight
        let videoTop = this.$parent.$refs['fifteen'+this.floor.floorId][0].$refs.videoWrap.offsetTop
        let videoHeight = this.$parent.$refs['fifteen'+this.floor.floorId][0].$refs.videoWrap.offsetHeight
        if (!(((videoTop+videoHeight-headerHeight) >= windowTop) && videoTop < (windowTop+innerH-footerHeight))) {
          if (this.$parent.$refs['fifteen'+this.floor.floorId][0].bVideo) {
            setTimeout(() => {
              if (!this.bScroll) {
                this.pause()
              }
            }, 500)
          }
        }
      },
      continuePlay () {
        this.bVideo = true
        this.bContinuePlay = false
        this.pause()
        this.$refs.modelVideo.play()
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
      }
    },
    beforeDestroy () {
      window.removeEventListener('scroll', this.onScroll, false)
    },
    mounted () {
      this.$nextTick(() => {
        window.addEventListener('scroll', this.onScroll, false)
      })
    }
  }
</script>
