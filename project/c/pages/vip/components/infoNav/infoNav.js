// pages/vip/components/infoNav/infoNav.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    navList:{
      type: Object,
      value: null
    },
    currentIndex:{
      type:Number,
      value: 0
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
    changeTab(e){
      let ind = e.currentTarget.dataset.index
      this.data.currentIndex = ind
      this.triggerEvent('changeTab',this.data.currentIndex)
      if(ind=='0'){
        wx.removeStorageSync("entryNum")
        }else if (ind == '1') {
        wx.setStorageSync("entryNum", '联系人')
        } else if (ind == '2') {
        wx.setStorageSync("entryNum", '消息')
      }
    },
  }
})
