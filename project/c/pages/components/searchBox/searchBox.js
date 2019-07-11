// pages/index/components/searchBox/searchBox.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 默认的placeHolder
    defineWord: {
      type: String,
      value: ''
    },
    defineDisable: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    inpVal: '',           // 输入框里的值
    handFocus: false,     // 是否获取焦点
    showDelIcon: false    // 是否显示清除的小叉号
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 获取焦点
    getFocus () {
      this.setData({ 'handFocus': true })
    },
    // 失去焦点
    cancelFocus () {
      this.setData({ 'handFocus': false })
    },
    // 搜索输入框输入文字触发的方法
    searchInpFn (e) {
      if (e.detail.value) {
        // 如果输入框有值则显示清除按钮
        this.setData({'showDelIcon': true})
      } else {
        // 为空则隐藏
        this.setData({ 'showDelIcon': false })
      }
      this.triggerEvent('getSearchWord', e.detail.value)
    },
    // 确定搜索
    importVal (work) {
      this.setData({'inpVal': work})
    },
    // 手机软键盘的回车键
    mobImportVal (objWork) {
      const work = objWork.detail.value
      this.setData({'inpVal': work})

      this.triggerEvent('searchFn')
    },
    // 点击清除按钮
    clearWords () {
      this.setData({inpVal: '','showDelIcon': false})
      this.triggerEvent('getSearchWord', '')
    }
  },

  pageLifetimes: {
    show() {
      // 页面被展示
      // console.log(this.data.defineWord)
    },
    hide() {
      // 页面被隐藏
    },
    resize(size) {
      // 页面尺寸变化
    }
  }
})