<template>
  <div>
    <inputHeader @searchItem='searchItem'></inputHeader>
    <div class="toDelive"  @click="toDetail">
    <orderFormat   :dataList='dataList' :isBuy='isBuy' :num='num'></orderFormat>
    </div>
  </div>
</template>
<script>
import orderFormat from "../comOrderFormat"
import inputHeader from '../../../components/common/IndexHeader'
export default {
  data () {
    return {
      dataList: [],
      isBuy: '',
      num: ''
    }
  },
  components: {
    orderFormat,
    inputHeader
  },
  methods: {
    searchItem (data) {
      let params = {}
      this.isBuy = window.localStorage.getItem('isBuy')
      this.num = window.localStorage.getItem('num')
      if (this.num==5) {
        this.$http.paySettleList({
          pageNo: 1,
          // param: {poId: data, purchaseType: 1},
          paySettleId: data,
          pageSize: 10
        }).then(res => {
          this.dataList = res.result.result.datas
        }).catch(err => {})
      }
      params.poId = data
      params.purchaseType=1
      switch (this.num+'') {
        case '1':
          params.orderStates =[1, 2]
          break
        case '2':
          params.orderStates=[3, 4]
          break
        case '3':
          params.orderStates=[5, 6]
          break
        case '4':
          params.state = 0
          params.settleApply = 0
      }
      if (this.isBuy=='1'&&this.num!=5) {
        this.$http.listInfo({
          page: 1,
          // param: {poId: data, purchaseType: 1},
          param: params,
          size: 10
        }).then(res => {
          console.log(res, "这是采购搜索结果")
          this.dataList = res.result.datas
        }).catch(err => {})
      } else if (this.isBuy=='2') {
        this.$http.SelByOrderIdAndNo({
          orderId: data
        }).then(res => {
          console.log(res, "这是销售搜索结果")
          this.dataList = res.result
        }).catch(err => {})
      } else if (this.isBuy=='520') { // 退货搜索
        this.$http.zcpage({
          page: 1,
          param: {auditStatus: 4, poId: data},
          size: 10
        }).then(res => {
          res.result.datas.forEach(v => {
            v.purchaseCreateTime = this.$formatTimeAmt(v.purchaseCreateTime, 'yyyy-MM-dd hh:mm:ss')
          })
          this.dataList = res.result.datas
        }).catch(err => {
        })
      }
    },
    toDetail () {
      if (this.isBuy=='1'&&this.num!=5) {
        this.$router.push({
          name: "orderDetail",
          query: {poId: this.dataList[0].poId}
        })
      } else if (this.isBuy=='520'&&this.num!=5) {
        window.localStorage.setItem("particulars2", JSON.stringify({
          "creator": this.dataList[0].creator,
          "storageAddress": this.dataList[0].storage,
          "totalAmt": this.dataList[0].totalAmt
        }))
        this.$router.push({path: '/particulars2', query: {id: this.dataList[0].poId}})
      } else if (this.num!=5) {
        this.$router.push({
          name: "saleDetail",
          query: {item: this.dataList[0]}
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../assets/scss/_app";

.toDelive {
  @include px2rem(padding-top, 88);
  background: #fff;
}
</style>
