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
    rebateStatus: {
      type: Boolean,
      value: true
    }
  },
  data: {
    iSeckill: 0,
    iScrollLeft: 0,
    rebateStatus: 0,
    goodList: []
  },
  attached: function () {},
  methods: {
    // 初始化商品列表数据
    initFloorData: function (newVal, newSession) {
      if (newVal.activityInfos.length < 1) return
      let goodList = newVal.activityInfos[this.data.iSeckill].products
      let activityNo = newVal.activityInfos[this.data.iSeckill].activityNo
      let iSeckillStatus = newVal.activityInfos[this.data.iSeckill].status
      if (goodList && goodList.length > 0) {
        goodList.forEach((good) => {
          // 状态为已开抢并且 remainderCount>=1则为商品活动编号赋值
          if (iSeckillStatus == '1' && good.remainderCount >= 1) {
            good.activityNo = activityNo
          }
        }) 
      }
      this.setData({
        goodList
      })
    },
    /* 秒杀场次切换 */
    changeSeckill: function (e) {
      let iScrollLeft = e.currentTarget.offsetLeft - e.detail.x * 0.5
      let index = e.currentTarget.dataset.index
      this.setData({
        iSeckill: index,
        iScrollLeft: iScrollLeft
      })
      this.initFloorData(this.data.floorData)
    },
  }
})