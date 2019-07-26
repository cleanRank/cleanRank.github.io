<template>
<div class="user-info-components">
  <div class="user-detail">
    <h5 class="user-title">用户信息</h5>
    <p class="line-text">
      <span class="nick-name">昵称：{{datas?datas.nickname:''}}</span>
    </p>
    <p class="line-text">
      <span>地区：{{datas?datas.provinceName:''}}</span>
      <span>年龄：{{datas&&datas.age?datas.age+'岁':''}}</span>
    </p>
    <p class="line-text">
      <span>身高：{{datas&&datas.height?datas.height+'cm':''}}</span>
      <span>体重：{{datas&&datas.weight?datas.weight+'kg':''}}</span>
    </p>
    <p class="line-text">
      <span>年收入：{{datas?datas.annualSalary:''}}</span>
      <span>距离：{{datas&&datas.distance?(datas.distance/1000).toFixed(2)+'km':'保密'}}</span>
    </p>
    <p class="line-text">
      <span>状态：{{datas&&datas.stealth==1?'在线':'下线'}}</span>
    </p>
    <p class="line-text">
      <span class="nick-name">微信：{{datas?datas.wechat:''}}</span>
    </p>
    <p class="line-text">
      <span class="nick-name">QQ：{{datas?datas.qq:''}}</span>
    </p>
    <p class="line-text">
      <span>个人介绍：</span>
    </p>
    <p class="line-text">
      <span class="nick-name">{{datas?datas.introduction:''}}</span>
    </p>
    <div class="mod-user-item">
      <h5>相册视频</h5>
      <ul class="media-list" v-if="photoList">
        <li class="media" @click="playVideo(item,index)" v-for="(item,index) in photoList" :key="index">
          <div class="video-box" v-if="item.mediaType==1">
             <i class="icon"></i>
              <video :id="item.rId" :src="item.mediaUrl" alt="" ref="video"></video>
          </div>
          <img :src="item.mediaUrl" alt="" v-else>
        </li>
      </ul>
    </div>
    <div class="mod-user-item">
      <h5>动态</h5>
      <div class="moment-box" v-for="(item, index) in mediaList" :key="index">
        <p class="dt"><span>{{item.content}}</span></p>
        <p class="time"><span>{{item.time}}</span></p>
        <img :src="item.img" @click="playVideo({mediaType:0,mediaUrl:item.img})" alt="">
      </div>
      <p class="more" v-if="mediaList.length&&canMore" @click="getMore">更多动态</p>
    </div>
  </div>
  <div class="video-player-wrapper" v-show="videoShow" @click.stop="videoShow=false">
    <div class="video-player" @click.stop="videoShow=true" v-if="mediaType==1">
      <video id="video" :src="curVideoUrl" autoplay controls width="100%" height="100%"></video>
    </div>
    <img class="video-player" :src="curVideoUrl" alt="" v-else>
  </div>
</div>
</template>
<script>
// import { ImagePreview, Toast } from 'vant'
import { formatTime } from 'lib/until.js'
export default {
  props: ['datas'],
  data () {
    return {
      videoShow: false,
      curVideoUrl: null,
      mediaType: null,
      page: 1,
      pageSize: 10,
      total: '',
      mediaList: [],
      photoList: [],
      canMore: true
      // datas: {
      //   nickname: '',
      //   provinceName: '',
      //   age: '',
      //   height: '',
      //   weight: '',
      //   annualSalary: '',
      //   distance: '',
      //   stealth: '',
      //   wechat: '',
      //   introduction: '',
      //   friendId: ''
      // }
    }
  },
  mounted () {
    console.log(this.datas)
    this.photoList && this.photoList.forEach((item, index) => {
      item.rId = "id_"+index
    })
  },
  watch: {
    'datas': {
      handler (value) {
        this.page = 1
        if (!this.datas.friendId) return
        this.mediaFriend()
        this.mediaListFn()
      },
      immediate: true
    }
  },
  methods: {
    mediaFriend () { // 获取视频、相册列表
      let param = {
        friendId: this.datas.friendId,
        platform: 2
      }
      this.$http.mediaFriend(param).then(res => {
        this.photoList = [...res.result.photos, ...res.result.videos]
      })
    },
    mediaListFn () { // 获取好友动态
      let param = {
        page: this.page,
        size: this.pageSize,
        param: {
          endTime: '',
          id: '',
          isShow: '',
          lat: '',
          lon: '',
          queryId: '',
          startTime: '',
          status: '',
          userId: this.datas.friendId
        }
      }
      this.mediaList = []
      this.mediaListAjax(param)
    },
    mediaListAjax (param) { // 获取好友动态
      this.$http.mediaList(param).then(res => {
        this.mediaList = [...this.mediaList, ...res.result.datas]
        if (this.mediaList.length < res.result.total) {
          this.canMore = true
        } else {
          this.canMore = false
        }
        this.mediaList.forEach(item => {
          item.time = formatTime(new Date(item.createTime*1000))
        })
      })
    },
    getMore () {
      this.page++
      let param = {
        page: this.page,
        size: this.pageSize,
        param: {
          endTime: '',
          id: '',
          isShow: '',
          lat: '',
          lon: '',
          queryId: '',
          startTime: '',
          status: '',
          userId: this.datas.friendId
        }
      }
      this.mediaListAjax(param)
    },
    playVideo (item, index) { // 点击预览图片和视频
      this.mediaType = item.mediaType
      this.curVideoUrl = item.mediaUrl
      this.videoShow = true
      if (item.mediaType != 1) return
      this.$nextTick(() => {
        let video = document.getElementById('video')
        if (video.paused) {
          video.play()
        } else {
          video.pause()
        }
      })
    }
  }
}
</script>
<style lang="scss">
@import '../../assets/scss/_flex.scss';
$color: #5584FF;
.user-info-components{
  max-height: 630px;
  overflow: auto;
  .user-detail{
    border-right: 1px solid #F0F0F0;
    padding: 20px;
    .user-title{

      font-size: 15px;
      color: #333;
      font-weight: 600;
      margin-bottom: 18px !important;
    }
    .line-text{
      margin-top: 10px;
      span{
        color: #666;
        font-size: 12px;
        word-break: break-all;
        display: inline-block;
        width: 90px;
      }
      .nick-name{
        width: 100%;
      }
    }
    .more{
      font-size: 14px;
      cursor: pointer;
    }
    .dt{
       color: #666;
        font-size: 12px;
        word-break: break-all;
    }
    .mod-user-item{
      margin-top: 20px;
      h5{
        color: #333;
        font-size: 15px;
        font-weight: 600;
        margin-bottom: 15px;
      }
      .moment-box{
        margin-bottom: 25px;
      }
      img{
        margin-top: 8px;
        width: 85px;
        height: 85px;
      }
      .time{
        margin-top: 8px;
        font-size: 12px;
        color: #999;
      }
      .media-list{
        width: 100%;
        .media{
          width: 85px;
          height: 85px;
          display: inline-block;
          position: relative;
          &:nth-of-type(odd){
            margin-right: 10px;
          }
          .video-box{
             width: 100%;
            height: 100%;
            background: #333;
          }
          img,video{
            width: 100%;
            height: 100%;
          }
          .icon{
            background: url(../../assets/img/rm_icon_bf_play.png) no-repeat;
            display: inline-block;
            width: 37px;
            height: 37px;
            position: absolute;
            left: 50%;
            top:50%;
            transform: translate(-50%,-50%);
          }
        }
      }
    }
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
      height: 500px;
      background-color: #fff;
      z-index: 999;
      video{
        height: 550px;
      }
    }
  }
   video{
      object-fit:fill;
    }
}
</style>
