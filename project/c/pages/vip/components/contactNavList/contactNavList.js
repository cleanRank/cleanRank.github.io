// pages/vip/components/contactNavList/contactNavList.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    addressList:{
      type: Array,
      value:[],
      observer: function (newVal, oldVal) {
        this.initCurrent(newVal)
      }
    },
    inviter:{
      type:Object,
      value:null
    },
    applyFriendCount:Number
  },

  /**
   * 组件的初始数据
   */
  data: {
    page: 1,
    total: 0,
    addressList:[],
    alpha: '',
    // windowHeight: 0,
    addBg: false,
    ry:0,
    buttonClicked: false
  },
  lifetimes: {

  },
  /**
   * 组件的方法列表
   */
  methods: {

    // 初始化banner
    initCurrent: function (newVal) {
      this.setData({
        addressList:newVal
      })
    },

    chatEvent(e){
      this.buttonClicked(this);
      let that = this
      let info = e.currentTarget.dataset.info
      this.triggerEvent('chatEvent',info)
    },
    // 上拉加载
    loadMore(){
      this.triggerEvent('loadMore')
    },
    //去好友申请页面
    applyFriendsPage(){
      this.triggerEvent('applyFriendsPage')
    },
    // 重复点击
    buttonClicked(self) {
      self.setData({
        buttonClicked: true
      })
      setTimeout(function () {
        self.setData({
          buttonClicked: false
        })
      }, 500)
    },
  }
})
