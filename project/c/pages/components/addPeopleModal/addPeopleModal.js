// pages/components/elasticModal/elasticModal.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    modalTitle: {
      type: String,
      value: ''
    },
    modalContentTxt: {
      type: String,
      value: ''
    },
    cancelBtnTxt: {
      type: String,
      value: '取消'
    },
    confirmBtnTxt: {
      type: String,
      value: '确定'
    },
    conType: {
      type: Number,
      value: 2
    },
    info:{
      type:Object,
      default:{}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showModal: false,
    userInfo:wx.getStorageSync('miniProgramUserinfo'),
    message: wx.getStorageSync('miniProgramUserinfo').nickName
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //显示弹框
    showModal() {
      this.setData({
        "showModal": true
      })
    },
    //隐藏弹框
    hideModal() {
      this.setData({
        "showModal": false,
        message:''
      })
    },
    //点击取消
    cancelFn() {
      try {
        this.triggerEvent('tapCancel')
      } catch (e) {
        console.log(e)
      }
      this.setData({
        message:''
      })
      this.hideModal()
    },
    // 点击确定  执行回调函数
    confirmFn(event) {
      let message = event.target.dataset.message
      try {
        this.triggerEvent('modalConfirmFn',this.data.message)
      } catch (e) {
        console.log(e)
      }
    },
    closeModal(){
      try {
        this.triggerEvent('closeModal')
      } catch (e) {
        console.log(e)
      }
      this.setData({
        message:''
      })
      this.hideModal()
    },
    bindTextAreaBlur(e) {
      console.log("info:"+e.detail.value)
      let that =this
      this.setData({
        message: e.detail.value
      })
      console.log('message:'+this.data.message)
    }
  }
})
