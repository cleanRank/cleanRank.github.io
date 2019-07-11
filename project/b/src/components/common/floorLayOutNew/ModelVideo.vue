<template>
  <div class="model-video video-player">
    <video :id="floor.floorId" width="100%" height="100%" controls="true" preload="auto" ref="videoNode" class="video-js" webkit-playsinline="" playsinline="" x5-playsinline="true" x5-video-player-fullscreen="true" :poster="floor.listFloorDetail[0].vedioImg"></video>
  </div>
</template>

<script>
  import videojs from 'video.js'
  import 'video.js/dist/video-js.css'
  export default {
    name: "ModelVideo",
    props: {
      options: {
        type: Object,
        default () {
          return {}
        }
      },
      floor: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    data () {
      return {
        player: null
      }
    },
    methods: {
      play () {
        this.$emit('initVideo', true)
        this.player.play()
      },
      pause () {
        this.player.pause()
        this.player.currentTime(0)
        this.$emit('initVideo', false)
      },
      removeScroll (boo) {
        this.$emit('removeScroll', boo)
      }
    },
    mounted () {
      var that = this
      this.player = videojs(this.$refs.videoNode, this.options, function onPlayerReady () {
        // 监听暂停
        this.on('pause', () => {})
        // 监听播放
        this.on('play', () => {})
        // 监听视频播放结束
        this.on('ended', () => {
          that.pause()
        })
        // 全屏
        this.on('fullscreenchange', (e) => {
          // 触发全屏
          if (document.fullscreen) {
            that.removeScroll(true)
          } else {
            that.removeScroll(false)
          }
        })
      })
    }
  }
</script>
