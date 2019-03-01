<template>
  <div>
   <order-detail :isInnerDetail='inner' :toDistate='toDistate' :totalAmt='totalAmt' :innerList='dataList' :mode='mode' :isadd="isadd" :num='num' :shopList='shopList' :poSplitIds='poSplitIds'  :LogisticsNumber='LogisticsNumber' :DistributionLogistics='DistributionLogistics'></order-detail>
  </div>
</template>
<script>
import orderDetail from '../commonOrderDetail'
export default {
  data () {
    return {
      inner: true,
      dataList: [],
      shopList: [],
      num: '',
      poSplitIds: '',
      LogisticsNumber: '',
      DistributionLogistics: '',
      id: '',
      isadd: true,
      api: '',
      mode: '',
      totalAmt: '',
      toDistate: ''
    }
  },
  components: {
    orderDetail
  },
  mounted () {
    this.init()
  },
  computed: {
    watchNum () {
      return this.$route.query.poSplitIds||this.$route.query.byself
    }
  },
  watch: {
    watchNum: 'init'
  },
  methods: {
    init () {
      if (this.$route.query) {
        this.poSplitIds = JSON.parse(window.localStorage.getItem('poSplitIds'))
        // debugger
        this.num = window.localStorage.getItem('num')
        // 发货明细查询
        if (this.$route.query.poSplitIds) {
          this.poSplitIds = JSON.parse(this.$route.query.poSplitIds)
          window.localStorage.setItem('poSplitIds', this.$route.query.poSplitIds)
        }
        this.$http.deliverDetail(this.poSplitIds).then(res => {
          this.shopList = res.result
        }).catch(err => {})
        this.dataList =JSON.parse((window.localStorage.getItem('dataList')))
        this.totalAmt=this.dataList.amt
        this.toDistate = this.dataList.carrierType
        if (this.$route.query.byself) {
          if (this.$route.query.byself==1) {
            this.mode=1
          } else if (this.$route.query.byself==2) {
            this.mode=2
          } else {
            this.mode = ''
          }
        } else {
          if (this.toDistate==1) {
            this.mode=1
          } else if (this.toDistate==2) {
            this.mode=2
          } else {
            this.mode = ''
          }
        }
        this.LogisticsNumber = this.dataList.invoicePostBillno
        this.DistributionLogistics = this.dataList.invoicePostCarrier
        if (this.$route.query.byself) {
          this.isadd = false
          this.LogisticsNumber = this.$route.query.LogisticsNumber
          this.DistributionLogistics = this.$route.query.DistributionLogistics
          this.toDistate = this.$route.query.toDistate
        }
      }
    }
  }
}
</script>
