<template>
    <div class="components-video">
        <div class="photo-content" v-for="(item,index) in usersVideoList" :key="index">
            <div class="play-video-wrapper">
                <video :src="item.mediaUrl" alt="" class="photo video-tag" ref="video"></video>
                <div class="play-video-pic"  @click="changeVideo(item, index)">
                <img src="../../assets/img/rm_icon_bf_play.png" alt="" class="play-video">
                </div>
            </div>
            <div class="del" @click="delUploadImg(item.id)">删除</div>
        </div>
        <!-- 视频播放弹框 -->
        <div class="video-player-wrapper" v-show="videoShow" @click.stop="hideVideoModel">
            <div class="video-player" @click.stop="showVideoModel">
            <video :src="curVideoUrl" autoplay controls width="100%" height="100%"></video>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  name: "ComVideo",
  props: ["usersVideoList"],
  data () {
    return {
      curVideoUrl: '',
      videoShow: false
    }
  },
  mounted () {
  },
  methods: {
    uploadloadImgOrVideo (data) {
      let inp = 'input' + data
      this.$refs[inp].click()
    },
    changeUploadFile (event, data) {
      // 上传图片点击事件 0图片 1视频
      let _this=this
      let img = event.target.files
      let type = img[0].type
      console.log(data, img[0])
      if (!img.length) {
        return false
      }
      if (data == 0) {
        if (!type.includes('jpg') && !type.includes('jpeg') && !type.includes('png')) {
          this.$message({ message: '请上传图片' })
          return false
        }
      } else if (data == 1) {
        if (!type.includes('mp4') && !type.includes('m2v') && !type.includes('mkv')) {
          this.$message({ message: '请上传视频' })
          return false
        }
      }
      _this.httpUploadImg(img[0], data)
      event.srcElement.value = "" // 及时清空
    },
    httpUploadImg (file, data) {
      // 图片上传http
      let formData = new FormData()
      formData.append('mediaUrl', file)
      formData.append('mediaType', data)
      this.$http.upload(formData).then(res => {
        this.usersImgList.push({
          mediaUrl: res.result.path,
          mediaIndex: null
        })
      })
    },
    delUploadImg (item) {
      // 删除上传图片
      let params = {
        ids: [item]
      }
      this.$http.userDelete(params).then(res => {
        console.log("删除视频，图片成功")
      })
    },
    changeVideo (item, index) {
      this.videoShow = true
      this.curVideoUrl = item.mediaUrl
    },
    hideVideoModel () {
      this.videoShow = false
    },
    showVideoModel () {
      this.videoShow = true
    }
  }
}
</script>
<style lang="scss" scoped>
.components-video {
    display: flex;
    justify-content: flex-start;
    .photo-content {
        width: 143px;
        display: flex;
        justify-content: center;
        flex-direction: column;
        margin-left: 15px;
        &:first-child {
            margin-left: 0;
        }
        .play-video-wrapper{
            position: relative;

            .play-video-pic {
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            }
        }
        .photo {
            display: block;
            width: 143px;
            height: 158px;
            border-radius: 5px;
            background-color: #E5E5E5;
        }
        .video-tag {
            position: relative;
        }
        .license {
            display: none;
        }
        .del {
            width: 66px;
            height: 24px;
            line-height: 24px;
            background: rgba(255, 94, 75, 1);
            border-radius: 4px;
            font-size: 12px;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: rgba(255, 255, 255, 1);
            text-align: center;
            margin: 18px auto;
        }
      }
      .photo-content1{
      display:flex;
      justify-content: flex-start;
      flex-direction: column;
    }
    .video-player-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      position: fixed;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      background: rgba(0, 0, 0, .7);
      z-index: 666;
      .video-player {
        width: 500px;
        height: 300px;
        background-color: #fff;
        z-index: 999;
      }
    }
}

</style>
