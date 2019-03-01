<template>
  <div>
    <order-detail
      :isInnerDetail="inner"
      :dataList="dataList"
      @toDetail="toDetail"
      :num='num'
      :totalAmt='totalAmt'
      :poId='poId'
    ></order-detail>
  </div>
</template>
<script>
import orderDetail from "../commonOrderDetail"
export default {
  data () {
    return {
      inner: false,
      dataList: [],
      num: '',
      api: '',
      totalAmt: '',
      poId: ''
    }
  },
  components: {
    orderDetail
  },
  methods: {
    toDetail (data) {
      this.$router.replace({
        name: "allOrderDetail",
        query: data.query
      })
    },
    init () {
      if (this.$route.query) {
        if (this.$route.query.poId) {
          this.poId = this.$route.query.poId
          window.localStorage.setItem('poId', this.poId)
        }
        this.poId = window.localStorage.getItem('poId')
        if (this.$route.query.num) {
          this.num = this.$route.query.num
          window.localStorage.setItem('num', this.num)
        }
        if (window.localStorage.getItem('num')) {
          this.num = window.localStorage.getItem('num')
        }
        // 通过订单Id 搜索订单详情
        let all=0
        this.$http.detailInfo({poId: this.poId}).then(res => {
          if (res.appCode=='S0000') {
            this.dataList = res.result
            for (let i=0; i<this.dataList.length; i++) {
              all+=this.dataList[i].amt
            }
            this.totalAmt=all
          }
        }).catch(err => {})
      }
    }
  },
  mounted () {
    this.init()
  },
  computed: {
    watchNum () {
      return this.$route.query
    }
  },
  watch: {
    watchNum: 'init'
  }
}
</script>
