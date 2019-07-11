<template>
<section class="site-home">
  sss
</section>
</template>
<script>
export default {
  data () {
    return {
      detailInfo: '', // 供应商详情
      purchase: [
        {
          className: 'delivery',
          name: '待发货',
          path: '/todelive',
          orderType: 'orderState',
          num: 0,
          type: 1
        }, {
          className: 'send',
          name: '已发货',
          path: '/todelive',
          orderType: 'orderState',
          num: 0,
          type: 3
        }, {
          className: 'finish',
          name: '已完成',
          path: '/todelive',
          orderType: 'orderState',
          num: 0,
          type: 6
        }, {
          className: 'clear',
          name: '待清算',
          path: '/tosettle',
          orderType: 'payState',
          num: 0,
          type: 0
        }, {
          className: 'cleared',
          name: '结算单',
          path: '/tosettle',
          orderType: 'payState',
          num: 0,
          type: 3
        }, {
          className: 'return',
          name: '退货',
          path: '/PurchaseReturn'
        }
      ],
      saleManage: [
        {
          className: 'delivery',
          name: '待发货',
          path: '/todelive',
          orderType: 'orderState',
          type: 1
        }, {
          className: 'send',
          name: '已发货',
          path: '/todelive',
          orderType: 'orderState',
          type: 3
        }, {
          className: 'finish',
          name: '已完成',
          path: '/todelive',
          orderType: 'orderState',
          type: 6
        }
        // {
        //   className: 'clear',
        //   name: '待清算',
        //   path: '/tosettle',
        //   orderType: 'payState',
        //   num: 0
        // }, {
        //   className: 'cleared',
        //   name: '已清算',
        //   path: '/tosettle',
        //   orderType: 'payState',
        //   num: 3
        // }, {
        //   className: 'return',
        //   name: '退货',
        //   path: ''
        // }
      ],
      indexData: ''
    }
  },
  components: {
  },
  created () {
  },
  computed: {
    logoPath () {
      if (this.detailInfo) {
        return this.detailInfo.logoPath ? this.detailInfo.logoPath : this.defaultImg
      } else {
        return this.defaultImg
      }
    }
  },
  methods: {
    // 申请入驻
    linkToEntryApplication () {
      let t = ''
      if (this.detailInfo) {
        t = this.detailInfo.auditStatus // 待审核状态
      }
      this.$router.push({ path: '/entryApplication', query: { id: this.detailInfo ? this.detailInfo.supplyerId : 0, type: t } })
    },
    // 销售管理查询代发货订单条数
    getSelOrder () {
      let params = {
        page: 1,
        size: 10,
        param: {
          deliveryStatus: 1
        }
      }
      this.$http.SelOrder(params).then(res => {
        this.saleManage[0].num = res.result.total || 0
      }).catch(e => {})
    },
    gocommodityList () {
      this.$router.push({
        path: '/information',
        query: {
          type: 1
        }
      })
    },
    goagmg () {
      this.$router.push({
        path: 'agmg'
      })
    },
    getSupplierOrderInfo () { // 订单信息列表
      this.$http.getSupplierOrderInfo().then(res => {
        this.indexData = res.result
        this.purchase[0].num = res.result.waitSent || 0
        // this.purchase[4].num = res.result.balance || 0
        // this.purchase[5].num = res.result.returned || 0
      }).catch(e => {})
    }
  }
}
</script>
<style lang="scss">
  .site-home{
    height:100%;

  }
</style>
