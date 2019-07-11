// pages/search/components/resultSection.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 接收了左上角的title
    titleTxt: {
      type: String,
      value: ''
    },
    // 是否需要显示删除按钮
    showDel: {
      type: Boolean,
      value: false
    },
    // 搜索项列表
    itemList: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 点击了标签
    tapItem (e) {
      this.triggerEvent('tapWord', e.currentTarget.dataset.item)
    },
    // 点击了清空按钮
    clearTips () {
      this.triggerEvent('clearTips')
    }
  },

  pageLifetimes: {
    show() {
      // 页面被展示
    },
    hide() {
      // 页面被隐藏
    },
    resize(size) {
      // 页面尺寸变化
    }
  }
})
