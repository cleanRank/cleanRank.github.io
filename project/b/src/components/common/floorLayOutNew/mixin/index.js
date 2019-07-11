export default {
  methods: {
    jumpTap (item) {
      let {linkType, floorLinkUrl, activityNo} = item
      if (!floorLinkUrl) {
        return false
      }
      if (linkType == '1') {
        if (floorLinkUrl == '888') {
          this.$router.push({
            path: '/springActivity'
          })
          return false
        }
        this.$router.push({
          name: 'Activity',
          params: {
            versionId: floorLinkUrl
          }
        })
      } else if (linkType == '0') {
        this.$router.push({
          path: '/detail',
          query: {
            productNo: floorLinkUrl,
            activityNo: activityNo?''+activityNo:'',
            isActivity: activityNo ? 1 : 0
          }
        })
      }
    },
    goDetail (good, type, seckill = {}) {
      /*
      type-1  推广
      seckill 秒杀商品
      */
      let productNo = good.productNo
      let activityNo = good.activityNo || ''
      let isActivity = good.isActivity || 0
      if (Object.keys(seckill).length>0) {
        if (seckill.status == '1' && good.remainderCount >= 1) {
          isActivity = 1
          activityNo = seckill.activityNo
        }
      }
      this.$router.push({
        path: '/detail',
        query: {
          productNo: productNo,
          activityNo: activityNo,
          isActivity: isActivity,
          share: type
        }
      })
    },
    // 秒杀场次切换
    sessionTap (nav, index) {
      this.sessionIdx = index
      this.products = []
      let { products, status, activityNo } = nav
      this.products = products
      this.seckill.status = status
      this.seckill.activityNo = activityNo
    },
    bannerJump (type, params) {
      if (params) {
        if (type == '0') {
          this.$router.push({
            path: '/detail',
            query: {
              productNo: params
            }
          })
        } else if (type == '1') {
          this.$router.push({
            name: 'Activity',
            params: {
              versionId: params
            }
          })
        }
      }
    }
  }
}
