const app = getApp()
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    floorData: {
      type: Object,
      value: {},
      observer: function (newVal, oldVal) {
        if (newVal) {
          this.initGoodsData(newVal)
        }
      }

    },
    bgData: {
      type: Object,
      value: {},
      observer: function (newVal, oldVal) {
        if (newVal) {
          this.initGoodsData(newVal)
        }
      }

    },
    rebateStatus: {
      type: Boolean,
      value: true
    }
  },
  data: {
    good: {},
    bgdata: {}
  },
  attached: function () { 
  },
  methods: {
    // 初始化商品
    initGoodsData: function (newVal) {
      let productsData = newVal.prudouct
      try{
        productsData[0].picUrl = newVal.picUrl
        this.setData({
          good: productsData[0],
          bgdata: newVal
        })
      }catch(e){

      }
      
    }
  }
})
