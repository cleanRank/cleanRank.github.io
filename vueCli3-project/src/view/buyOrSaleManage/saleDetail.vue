<template>
  <div>
    <div class="orderDetail" >
      <div class="totalPrice" >
        <span class="word">订单总金额</span>
        <div class="price">¥{{dataList.totalAmt}}</div>
      </div>
      <div class="commonDetail-content" >
        <div class="status">
          <div class="left">
            <i class="blieLine"></i>
            <div class="title">订单</div>
          </div>
        </div>
        <div class="line"></div>
        <div class="saleID" >
          <span>收货人</span>
          <span class="number">{{dataList.receiverName}}</span>
        </div>
        <div class="saleID" >
          <span>联系电话</span>
          <span class="number">{{dataList.receiverPhone}}</span>
        </div>
        <div class="saleID">
          <span >收货地址</span>
          <span class="number address">{{dataList.detailAddr}}</span>
        </div>
        <!-- <div class="saleID" v-if="isInnerDetail">
          <span>结算方式</span>
          <span class="number">月结</span>
        </div> -->
        <!-- <div class="saleID">
          <span>总计</span>
          <span class="number">¥{{item.amt}}</span>
        </div> -->
        <div class="saleID" >
          <span>发货物流</span>
          <span class="number"  >
            <span class="number" v-if="(!isadd&&mode==2)||num!=1">{{DistributionLogistics}} {{LogisticsNumber}}</span>
            <span class="number" v-if="mode==1&&!isadd">自行配送</span>
            <!-- <button class="btn" v-if="isadd&&dataList.deliveryStatus==1" @click="addMode" >添加</button> -->
            <button class="btn" v-if="isadd&&num==1"  @click="addMode()" >添加</button>
            <button class="btn" v-if="!isadd||num==2" @click="modifyMode" >修改</button>
          </span>
        </div>
        <!-- <div class="saleID" >
          <span>实际清算</span>
          <span class="number red">¥{{dataList.promAmt}}</span>
        </div> -->
        <div class="cutLine" ></div>
        <div class="saleID1" v-for="(val,key) in data" :key="key">
          <img :src="val.itemPic" :onerror='defaultImg'  class="img">
          <div class="inlineB">
            <div class="saleID">
              <span>供货商品</span>
              <span class="number">¥{{val.salePrice}}/瓶</span>
            </div>
            <div class="saleID">
              <span>{{val.itemName}}（箱*20）</span>
              <span class="number">数量{{val.deliveryQty}}/瓶 </span>
            </div>
            <!-- <div class="saleID" >
              <span class="right1">已收货</span>
              <span class="number">总计:￥900.00</span>
            </div> -->
            <!-- <div class="saleID" >
              <span>实际收货数量：{{val.demandQty}}瓶</span>
              <span class="number">总计:￥900.00</span>
            </div> -->
          </div>
           <div class="saleID">
              <span></span>
              <span class="allPrice">总计:￥{{val.amt}}</span>
            </div>
        </div>
      </div>
      <div class="confirmShop" @click="confirmSend(dataList)" v-if="num==1">确认发货</div>
      <!-- <div class="confirmShop" @click="confirmSend(dataList)" >确认发货</div> -->
      <div class="confirmShop" @click="save" v-if="num==2">保存</div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      type: "",
      LogisticsMode: '',
      dataList: '',
      isadd: true,
      data: [],
      DistributionLogistics: '',
      defaultImg: '../../assets/icon/icon/user_avatar.png',
      orderId: '',
      orderDtlId: [],
      wayBill: '',
      supplyerId: '',
      LogisticsNumber: '',
      mode: '',
      num: ''
    }
  },
  methods: {
    addMode () {
      this.$router.push({
        name: "distriMethod",
        query: {poSplitIds: this.orderDtlId}
      })
    },
    modifyMode () {
      this.$router.push({
        name: "distriMethod",
        query: {poSplitIds: this.orderDtlId, DistributionLogistics: this.DistributionLogistics, LogisticsNumber: this.LogisticsNumber}
      })
    },
    save () {
      let _this = this
      let title = "提示"
      let msg = "是否保存?"
      let lBtnText = "否"
      let rBtnText = "是"
      this.showDialog({
        title,
        msg,
        lBtnText,
        rBtnText,
        confCallBack () {
          switch (_this.num+'') {
            case '1':
              _this.num = 1
              break
            case '2':
              _this.num = 3
              break
            case '3':
              _this.num = 6
          }
          _this.$router.replace({
            path: "/toDelive",
            query: {orderState: _this.num}
          })
        }
      })
    },
    confirmSend (item) {
      // debugger
      let _this = this
      let title = "提示"
      let msg = "是否确定提交?"
      let lBtnText = "取消"
      let rBtnText = "确定"
      this.showDialog({
        title,
        msg,
        lBtnText,
        rBtnText,
        confCallBack () {
          // 确认发货接口
          if (!_this.isadd||_this.num==2) {
            _this.$http.toPubSalesorderDelivery({
              waybill: _this.LogisticsNumber,
              carriersCode: _this.carriersCode,
              carriers: _this.DistributionLogistics,
              orderDtlIds: _this.orderDtlId,
              supplyerId: _this.supplyerId,
              countsQty: 1,
              deliveryMode: _this.mode
            }).then(res => {
              _this.$router.replace({
                path: "/toDelive",
                query: {orderState: _this.num}
              })
            })
              .catch(err => {
              })
          } else {
            _this.showToast({msg: '请先添加物流信息'})
          }
        }
      })
    },
    init () {
      if (this.$route.query.item) {
        window.localStorage.setItem('saleDataList', JSON.stringify(this.$route.query.item))
        window.localStorage.setItem('orderId', this.$route.query.item.orderId)
      }
      if (this.$route.query.num) {
        this.num = this.$route.query.num
        window.localStorage.setItem('num', this.num)
      }
      if (window.localStorage.getItem('num')) {
        this.num = window.localStorage.getItem('num')
      }
      this.$route.query.byself?this.mode=1:this.mode=2
      this.carriersCode = this.$route.query.carriersCode
      this.dataList = this.$route.query.item||JSON.parse(window.localStorage.getItem('saleDataList'))
      this.supplyerId =parseInt(window.sessionStorage.getItem('supplyerId'))
      this.$http.selSupplyerOrderDtl({orderId: window.localStorage.getItem('orderId')}).then(res => {
        this.data = res.result
        if (this.$route.query.LogisticsNumber||this.$route.query.DistributionLogistics) {
          this.isadd = false
          this.LogisticsNumber = this.$route.query.LogisticsNumber
          this.DistributionLogistics = this.$route.query.DistributionLogistics
        } else if (this.data[0].carriers) {
          this.DistributionLogistics=this.data[0].carriers
          this.LogisticsNumber=this.data[0].wayBill
        }
        let arr=[]
        for (let i in this.data) {
          arr.push(this.data[i].orderDtlId)
        }
        this.orderDtlId = arr
      }).catch(err => {})
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/scss/_app";
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
    .confirmShop {
      margin: 50px auto;
      @include px2rem(width, 580);
      @include px2rem(height, 90);
      @include px2rem(line-height, 90);
      @include font-dpr(30);
      @include px2rem(border-radius, 8);
      color: #fff;
      text-align: center;
      background: #0087ff;
    }
</style>
