const app = getApp()
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持 
  },
  properties: {
    floorData: {
      type: Object,
      value: {},
      observer: function (newVal, oldVal) {
        this.initFloorData(newVal)
      }
    },
  },
  data: {
    _item: {},
    floorType: 14,//轮播
  },
  attached: function () { },
  methods: {
    //初始化数据
    initFloorData: function (newVal, newSession) {
      this.setData({
        _item: newVal
      })
    },
    goDetail:function(e){
      let productNo = e.target.dataset.productno;
      console.log(productNo)
    }
  }
})