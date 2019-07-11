// pages/components/UED/modal/modal.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    modalTit: {
      type: String,
      value: ''
    },
    modalConTxt: {
      type: String,
      value: ''
    },
    cancelBtnTxt: {
      type: String,
      value: '取消'
    },
    confirmBtnTxt: {
      type: String,
      value: '保存'
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
    // 让模态框显示
    showModal() { this.setData({'showModal': true}) },

    // 让模态框隐藏
    hideModal() { this.setData({'showModal': false}) },

    // 点击取消按钮把模态框隐藏，如果需要执行回调函数可以从组件处传过来
    cancelFn() {
      try {
        this.triggerEvent('tapCancel')  // 执行的取消回调函数
      } catch(e) {
        console.log(e)
      }
      this.hideModal()
    },

    // 点击确定按钮
    confirmFn() {
      try {
        this.triggerEvent('modalConfirmFn')   // 执行确定的回调函数
      } catch(e) {
        console.log(e)
      }
    }
  }
})
