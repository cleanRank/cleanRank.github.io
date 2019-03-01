<template>
  <div>
    <div class="toDelive">
      <orderFormat  :num='logo'   :isBuy='isBuy' :dataList="dataList"></orderFormat>
    </div>
  </div>
</template>
<script>
import orderFormat from "../comOrderFormat"
export default {
  data () {
    return {
      dataList: [],
      num: '',
      isBuy: '',
      logo: '',
      api: ''
    }
  },
  components: {
    orderFormat
  },
  methods: {
    getDataList () {
      // 订单列表查询
      this.isBuy = window.localStorage.getItem('isBuy')
      let params = {}
      if (this.$route.query.orderState) {
        if (this.isBuy=='1') {
          params.orderStates = [1, 2]
          switch (this.num+'') {
            case '3':
              params.orderStates=[3, 4]
              break
            case '6':
              params.orderStates=[5, 6]
              break
          }
          params.purchaseType = 1
          this.api = 'listInfo'
        } else if (this.isBuy=='2') {
          switch (this.num+'') {
            case "1":
              params.deliveryStatus = 1
              break
            case "3":
              params.deliveryStatus = 2
              break
            case "6":
              params.deliveryStatus = 3
          }
          this.api = 'SelOrder'
        }
        this.$http[this.api]({
          page: 1,
          param: params,
          size: 10
        }).then(res => {
          if (res.appCode == "S0000") {
            this.dataList = res.result.datas
          }
        }).catch(err => {
        })
      } else {
      }
    },
    init () {
      if (this.$route.query.orderState) {
        this.num = this.$route.query.orderState
        switch (this.num+'') {
          case "1":
            this.logo = 1
            break
          case "3":
            this.logo = 2
            break
          case "6":
            this.logo = 3
        }
        window.localStorage.setItem('num', this.logo)
        if (this.$route.query.isBuy===true) {
          window.localStorage.setItem("isBuy", 1)
        } else if (this.$route.query.isBuy===false) {
          window.localStorage.setItem("isBuy", 2)
        }
      }
    }
  },
  computed: {
    watchNum () {
      return this.$route.query
    }
  },
  watch: {
    watchNum: ['init', 'getDataList']
  },
  mounted () {
    this.init()
    this.getDataList()
  }
}
</script>
<style lang="scss" scoped>
@import "../../../assets/scss/_app";

.toDelive {
  @include px2rem(margin-top, 10);
}
</style>
