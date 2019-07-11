const app = getApp()
Component({
  properties: {
    floorData: {
      type: Object,
      value: {},
      observer: function (newVal, oldVal) {
        this.initFloorData(newVal)
      }
    },
    showRebate: {
      type: Boolean,
      value: false, // 是否隐藏推广，false-显示，true-隐藏
    },
    headTop: {
      type: Number,
      value: 0
    },
    time:{
      type:Number,
      value:0
    }
  },
  data: {
    tabIndex: 0,
    products: [],
    p_height: 0,
    v_top: '',
    fixedPo: false,
    seven_floor_arr: [],
    floor_obj: {},
    navScrollLeft: 0,
    scroll_left: 0,
    scroll_num: 0,
    v_height: 0,
    scrollDistance:0,
    floor_height:0,
    windowWidth:0,
    floor_len:0,
    floor_arr:[]
  },
  ready:function(){
    let itemWidth = 0;
    let that=this
    const win = wx.getSystemInfoSync().windowWidth;
    that.setData({
      windowWidth:win
    })
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    let floor_arr=[]
    const query = wx.createSelectorQuery().in(this);
    setTimeout(function(){
      for(let i=0;i<that.data.floor_len;i++){
        query.select('#floor_wrap'+i).boundingClientRect((res) => {
          if(floor_arr.indexOf(res.top)>-1) return
          floor_arr.push(res.top)
          that.setData({
            floor_arr
          })
        }).exec()
      }
      wx.hideLoading()
    },this.data.time)
    query.select('.scroll_wrap').boundingClientRect((res) => {
      that.setData({
        v_height:res.height
      })
    }).exec()
  },
  methods: {
    //初始化数据
    initFloorData: function (newVal, newSession) {
      let that = this
      this.setData({
        floorData: newVal,
        floor_len: newVal.listFloorDetail.length
      })
    },
    //切换tab
    tabChange(e) {
      let index = e.currentTarget.dataset.index
      let that = this
      let floor_arr = this.data.floor_arr
      this.setData({
        tabIndex:index
      })
      wx.pageScrollTo({
        scrollTop:(floor_arr[index]-(this.data.headTop) - (this.data.v_height)),
        duration:0
      })
    },
    // 商品
    productClick: function (e) {
      this.productDetail(e, '0')
    },
    productDetail(e, showPro) {//showPro是否弹出推广窗口
      //console.log(e.currentTarget.dataset.productNo)
      let info = e.currentTarget.dataset.info
      let productno = info.productNo
      let isActivity = info.isActivity
      let activityNo = info.activityNo
      wx.navigateTo({
        url: '/pages/detail/detail?productNo=' + productno + '&isActivity=' + isActivity + '&activityNo=' + activityNo + '&share=' + showPro,
      })

    },
  }
})