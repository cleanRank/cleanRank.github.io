<template>
  <div>
    <div class="payDetail" >
      <div class="saleID">
        <span>快递名称</span>
        <span class="number">{{data.invoicePostCarrier}}</span>
      </div>
      <div class="saleID">
        <span>物流单号</span>
        <span class="number">{{data.invoicePostBillno}}</span>
      </div>
      <div class="saleID">
        <span>总结算金额</span>
        <span class="number price">¥{{data.amt}}</span>
      </div>
      <div class="saleID" v-for="(item,i) in dataList" :key="i">
        <span>订单号：{{item.poId}}</span>
        <span class="number price">¥{{item.amt}}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      dataList: '',
      data: ''
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.data=this.$route.query
      this.poId = this.data.poId
      this.$http.checkeddetail({invoicePostBillno: this.data.invoicePostBillno}).then(res => {
        this.dataList = res.result
      }).catch(err => {})
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../assets/scss/_app";
.payDetail {
  @include px2rem(padding, 20 0 20 20);
  background: #fff;
}
.saleID {
  display: flex;
  justify-content: space-between;
  span {
    @include font-dpr(28);

    @include px2rem(margin, 14 0);
    color: rgba(51, 51, 51, 1);
    font-weight: 400;
  }
  .number {
    @include px2rem(margin-right, 28);
  }
  .price {
    font-weight: 600;
  }
}
</style>
