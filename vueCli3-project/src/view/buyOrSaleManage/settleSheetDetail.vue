<template>
  <div>
    <div class="orderDetail" >
      <div class="totalPrice">
        <span class="word">结算金额</span>
        <div class="price">¥{{allAmt}}</div>
      </div>
    <load-more :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :auto-fill="false" ref="loadmore">
      <div v-for="(item,key) in dataList" :key="key" class="gap">
        <div class="commonDetail-content" >
          <div class="status">
            <div class="left">
              <i class="blieLine"></i>
              <div class="title" v-if="item.purchaseType==1">采购订单</div>
              <div class="title" v-if="item.purchaseType==2">退货订单</div>
            </div>
            <div class="right" >{{item.poId}}</div>
          </div>
          <div class="saleID1">
            <img :src="item.picPath" alt class="img">
            <div class="inlineB">
              <div class="saleID">
                <span>供货商品</span>
                <span class="number">¥{{item.purchasePrice}}/{{item.packNameEasy}}</span>
              </div>
              <div class="saleID">
                <span>{{item.skuName}} {{item.baseName}}</span>
                <span class="number" v-if="item.purchaseType==1">数量{{item.totalBaseunitQty}}/{{item.packNameEasy}}</span>
                <span class="redText" v-if="item.purchaseType==2">退货数量{{item.totalBaseunitQty}}/{{item.packNameEasy}}</span>
              </div>
              <div class="saleID" >
                <span ></span>
                <span class="number">总计:￥{{item.itemReceiptAmount}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </load-more>
    </div>
  </div>
</template>
<script>
import loadMore from 'components/common/LoadMore'
export default {
  data () {
    return {
      dataList: [],
      page: 1,
      size: 10,
      allAmt: '',
      allLoaded: false,
      paysettleId: ''
    }
  },
  components: {
    loadMore
  },
  mounted () {
    if (JSON.parse(this.$route.query.item)) {
      this.allAmt = JSON.parse(this.$route.query.item).totalamt
      this.paysettleId = JSON.parse(this.$route.query.item).paysettleId
    }
    this.init()
  },
  methods: {
    loadBottom () {
      this.getList()
    },
    getList () {
      this.page++
      this.init()
    },
    init () {
      this.$http.getPurchaseDtl({
        paysettleId: this.paysettleId,
        pageNo: this.page,
        pageSize: this.size
      }).then(res => {
        this.showLoad(false)
        this.$refs.loadmore.onBottomLoaded()
        if (res.result.datas.length < this.size) {
          this.allLoaded = true
        }
        this.dataList = [...this.dataList, ...res.result.datas]
      }).catch(err => {})
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/scss/_app";
.gap{
    @include px2rem(margin-bottom, 10);
}
.status{
    @include px2rem(margin-bottom, 35);
}
.orderDetail {
  .totalPrice {
    background: #227df5;
    @include px2rem(border-radius, 0 0 25 25);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    @include px2rem(min-height, 200);
    .word {
      @include font-dpr(28);
      @include px2rem(line-height, 40);
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
    }
    .price {
      @include px2rem(line-height, 48);
      @include font-dpr(40);
      font-family: DIN-Medium;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
    }
  }
}
.redText{
    color: #F6585A !important;
}
</style>
