// pages/components/elasticModal/elasticModal.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    modalTop: {
      type: String,
      value: ''
    },
    modalTitle: {
      type: String,
      value:''
    },
    modalContentTxt: {
      type: String,
      value:''
    },
    cancelBtnTxt: {
      type: String,
      value:'取消'
    },
    confirmBtnTxt: {
      type:String,
      value:'确定'
    },
    conType:{
      type:Number,
      value: 2
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showModal: false
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
        "showModal": false
      })
    },
    //点击取消
    cancelFn() {
      try{
        this.triggerEvent('tapCancel')
      } catch(e) {
        console.log(e)
      }
      this.hideModal()
    },
    // 点击确定  执行回调函数
    confirmFn() {
      try{
        this.triggerEvent('modalConfirmFn')
      } catch(e) {
        console.log(e)
      }
    }
  }
})
