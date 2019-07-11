const app = getApp()
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持 
  },
  properties: {
    floorList:{
      type:Array,
      value:[]
    },
    floorData: {
      type: Object,
      value: {}
    },
    scrollTop:{
      type:Number,
      value:0,
      observer: function (newVal, oldVal) {
        this.initScrollTop(newVal)
      }
    },
    closeVideo:{
      type:Boolean,
      value:false,
      observer:function(newVal,oldVal){
        this.initCloseVideo(newVal)
      }
    },
    floorEq:{
      type:String,
      value:''
    },
    playIndex:{
      type:Object,
      value:{
        'pre':'',
        'curr':''
      },
      observer:function(newval,oldval){
        this.initPlayIndex(newval)
      }
    }
  },
  data: {
    showV:false,
    videoContent:{},
    v_top:0,
    v_height:0,
    p_height:0,
    playIndex:wx.getStorageSync("playIndex"),
    ifWifi:false,
    toPlay:true,
    fullScreenClass:false,
    currVid:{}
  },
  attached: function () {
    wx.setStorageSync("playIndex", '')
  },
  ready: function () {
    let that = this
    let video_arr=[]
    that.setData({
      toPlay:true,
      showV:false,
      ifWifi:false
    })
    // 遍历数组中所有视频版式
    this.data.floorList.forEach((val,index)=>{
      if(val.floorType==15){
        video_arr.push("myVideo" + val.sortFlag)
        let videoCon = wx.createVideoContext("myVideo" + val.sortFlag,that)
        videoCon.stop()
        videoCon.seek(0)
      }
    })
    wx.setStorageSync("video_arr",video_arr)
    const query = wx.createSelectorQuery().in(this)
    query.selectAll('#myfloor'+this.data.floorEq).boundingClientRect()
    query.exec(function (res) {
      that.setData({
        v_top:res[0][0].top,
        v_height:res[0][0].height
      })
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          p_height: res.windowHeight
        })
      },
    })
  },
  detached:function(){
  },
  methods: {
    //初始化数据
    initScrollTop: function (newVal, newSession) {
      console.log("视频监听滚动")
      this.checkVideo(newVal)
    },
    //初始化视频
    initCloseVideo: function (newVal, newSession){
      this.closeVideoFn(newVal)
    },
    initPlayIndex:function(newVal){
      if(!newVal) return
      if(newVal.pre!=newVal.curr){
        let videoContentPre=wx.createVideoContext(newVal.pre, this)
        videoContentPre.pause()
        let videoContentCurr=wx.createVideoContext(newVal.curr, this)
        videoContentCurr.play()
        this.setData({
          currVid: videoContentCurr
        })
      }
    },
    closeVideoFn(val) {
      if(!val) return
      let that = this
      // 遍历数组中所有视频版式
      try{
        that.data.currVid.pause()
      }catch(err){}
      that.setData({
        toPlay: true,
        showV: false,
        ifWifi: false
      })
    },
    v_play(e){    
      // 判断网络环境
      this.checkNetwork(e)
    },
    checkNetwork(e){
      let that = this
      wx.getNetworkType({
        success: function (res) {
          // 返回网络类型, 有效值：
          // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
          var networkType = res.networkType
          if (res.networkType != 'wifi') {
            that.setData({
              showV: true,
              toPlay: true
            })
            let warn_num = getApp().globalData.warn_num
            if(!warn_num){
              that.setData({
                ifWifi: true
              })
              getApp().globalData.warn_num=1
            }else if(warn_num==1){
              that.setData({
                ifWifi: false
              })
              that.checkOnlyPlay(e)
            }
          } else {
            that.setData({
              ifWifi: false,
              showV: true,
              toPlay: false
            })
            that.checkOnlyPlay(e)
          }
        }
      })      
    },
    checkOnlyPlay(e){
      let curr_id = e.target.dataset.curr
      let that = this
      let playIndex = wx.getStorageSync("playIndex")
      if (!playIndex) {
        // let videoContext = wx.createVideoContext(curr_id, that)
        this.setData({
          currVid: wx.createVideoContext(curr_id, that)
        })
        this.data.currVid.play()
        wx.setStorageSync('playIndex', curr_id)
      } else {
        this.triggerEvent('pauseVideo', { 'pre': playIndex, 'curr': curr_id })
        wx.setStorageSync('playIndex', curr_id)
      }
      this.setData({
        ifWifi: false,
        showV: true,
        toPlay: false
      })
    },
    // 计算视频是否在可视范围
    checkVideo(newVal){
      let that = this
      let p_height = this.data.p_height-200
      let v_top = this.data.v_top
      let v_height = (this.data.v_height)
      let conHigh = v_top + v_height
      let visibleBom = p_height + newVal
      if ((newVal > (v_top + v_height)) || (newVal + p_height) < v_top) {
        let videoContentCu = wx.createVideoContext('myVideo' + this.data.floorEq, that)
        videoContentCu.pause()
      } else {
      }
    },
    video_play(e){
      let playIndex = wx.getStorageSync("playIndex")
      // wx.setStorageSync('playIndex', e.target.id)
      this.triggerEvent('pauseVideo', { 'pre': playIndex, 'curr': e.target.id })
    },
    //视频缓存
    videoWait(e) {
      if (e.timeStamp > 10 * 1000) {//缓存超过10秒视为卡顿
        wx.showToast({
          title: '网络不流畅',
          icon: 'none',
          duration: 2000
        })
      }
    },
    //视频出错
    videoErro(e) {
      let that = this;
      wx.showToast({
        title: '网络不给力，请重试！',
        icon: 'none',
        duration: 2000
      })
      that.setData({
        showPlay: true,
        videoConr: false,
        outVideo: false,
        move: 'return false'
      })
    },
    fullScreenVideo(e){
      if (e.detail.fullScreen){
        // 全屏
        this.setData({
          fullScreenClass:true
        })
        wx.setStorageSync("fullClass", true)
      }else{
        //退出全屏
        this.setData({
          fullScreenClass: false
        })
        wx.setStorageSync("fullClass", false)
      }
    }
  }
})