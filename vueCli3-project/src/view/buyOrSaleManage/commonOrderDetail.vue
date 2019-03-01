<template>
  <div>
    <div class="orderDetail">
      <div class="totalPrice">
        <span class="word">订单总金额</span>
        <div class="price">¥{{totalAmt}}</div>
      </div>
      <div v-if="!isInnerDetail">
        <div v-for="(item,key) in dataList" :key="key">
          <div class="commonDetail-content" @click="toDetail(item)">
            <div class="status">
              <div class="left">
                <i class="blieLine"></i>
                <div class="title">订单</div>
              </div>
              <div class="right" v-if="item.state==1||item.state==2&&!isInnerDetail||(item.state==3&&num==1)">待发货</div>
              <div class="right" v-if="item.state==3&&!isInnerDetail&&num!=1">已发货</div>
              <div class="right right1" v-if="item.state==6&&!isInnerDetail">已完成</div>
              <div class="right right1" v-if="item.state==4&&!isInnerDetail">部分收货</div>
              <div class="right right1" v-if="item.state==5&&!isInnerDetail">差异收货</div>
            </div>
            <div class="line"></div>
            <div class="saleID">
              <span v-if="!isInnerDetail">{{item.branchName}}-{{item.name}}</span>
              <span class="number" v-if="!item.carrierType&&num==1">无物流信息</span>
              <span class="number" v-if="item.carrierType&&num==1">有物流信息</span>
            </div>
            <div class="saleID">
              <span>联系电话</span>
              <span class="number" v-if="!isInnerDetail">{{item.phone}}</span>
            </div>
            <div class="saleID">
              <span>门店地址</span>
              <span class="number address" v-if="!isInnerDetail">{{item.shopAddrLoc}}{{item.address}}</span>
            </div>
            <div class="saleID" v-if="num==4||num==5">
              <span>结算方式</span>
              <span class="number">{{settleMode}}</span>
            </div>
            <div class="saleID">
              <span>总计</span>
              <span class="number" v-if="!isInnerDetail">¥{{item.amt}}</span>
            </div>
            <div class="saleID" v-if="num==4">
              <span>实际清算</span>
              <span class="number red" v-if="!isInnerDetail">¥{{item.realAmt}}</span>
            </div>
            <div class="saleID" v-if="num==5">
              <span>已清算</span>
              <span class="number red" v-if="!isInnerDetail">¥{{item.realAmt}}</span>
            </div>
          </div>
        </div>
      <div class="confirmShop" @click="secConfirmSend" v-if="num==1">确认发货</div>
      </div>
      <div  v-if="isInnerDetail">
        <div class="commonDetail-content">
          <div class="status">
            <div class="left">
              <i class="blieLine"></i>
              <div class="title">订单</div>
            </div>
            <div class="right" v-if="isInnerDetail&&innerList.state==1||innerList.state==2||(innerList.state==3&&num==1)">待发货</div>
            <div class="right" v-if="innerList.state==3&&isInnerDetail&&num!=1">已发货</div>
            <div class="right right1" v-if="innerList.state==6&&isInnerDetail">已完成</div>
            <div class="right right1" v-if="innerList.state==4&&isInnerDetail">部分收货</div>
            <div class="right right1" v-if="innerList.state==5&&isInnerDetail">差异收货</div>
          </div>
          <div class="line"></div>
          <div class="saleID">
            <span v-if="isInnerDetail">{{innerList.branchName}}-{{innerList.name}}</span>
            <span class="number"></span>
          </div>
          <div class="saleID">
            <span>联系电话</span>
            <span class="number" v-if="isInnerDetail">{{innerList.phone}}</span>
          </div>
          <div class="saleID">
            <span>门店地址</span>
            <span class="number address" v-if="isInnerDetail">{{innerList.shopAddrLoc}}{{innerList.address}}</span>
          </div>
          <div class="saleID" v-if="num==4||num==5">
            <span>结算方式</span>
            <span class="number">{{settleMode}}</span>
          </div>
          <div class="saleID">
            <span>总计</span>
            <span class="number" v-if="isInnerDetail">¥{{innerList.amt}}</span>
          </div>
          <div class="saleID" v-if="num==4">
            <span>实际清算</span>
            <span class="number red" v-if="isInnerDetail">¥{{innerList.realAmt}}</span>
          </div>
          <div class="saleID" v-if="num==5">
            <span>已清算</span>
            <span class="number red" v-if="isInnerDetail">¥{{innerList.realAmt}}</span>
          </div>
          <div class="saleID" v-if="isInnerDetail">
            <span>发货物流</span>
            <span class="number">
              <span class="number" v-if="mode==1||toDistate==1">自行配送</span>
              <span
                class="number"
              >{{DistributionLogistics}} {{LogisticsNumber}}</span>
            </span>
              <button class="btn" v-if="DistributionLogistics||LogisticsNumber||mode" @click="modifyMode">修改</button>
              <button class="btn" v-else  @click="addMode">添加{{mode}}</button>
          </div>
          <div class="saleID" v-if="isInnerDetail&&innerList.state==5">
            <span>差异收货原因</span>
            <span class="number">{{innerList.rejRecvResonDesc}}</span>
          </div>
          <div class="cutLine" v-if="isInnerDetail"></div>
          <div class="saleID1" v-for="(val,key) in shopList" :key="key">
            <img :src="val.images" alt class="img">
            <div class="inlineB">
              <div class="saleID">
                <span>供货商品</span>
                <span class="number">¥{{val.price}}/{{val.item}}</span>
              </div>
              <div class="saleID">
                <span>{{val.skuName}}（{{val.pack}}）</span>
                <span class="number">数量{{val.demandQty}}/{{val.item}}</span>
              </div>
              <div class="saleID">
                <span v-if="num==4||num==3">实际收货数量：{{val.deliveryQty}}{{val.item}}</span>
                <span v-else></span>
                <span class="number">总计:￥{{val.amt}}</span>
              </div>
            </div>
            <div class="line"></div>
          </div>
        </div>
      <div class="confirmShop" @click="confirmSend" v-if="isInnerDetail&&num==1">确认保存</div>
      <div class="confirmShop" @click="confirmSend" v-if="isInnerDetail&&num==2">保存</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      type: "",
      LogisticsMode: "",
      settleMode: ""
    }
  },
  props: [
    "isInnerDetail",
    "totalAmt",
    "dataList",
    "mode",
    "isadd",
    "num",
    "poSplitIds",
    "DistributionLogistics",
    "LogisticsNumber",
    "shopList",
    "innerList",
    'poId',
    'toDistate'
  ],
  methods: {
    secConfirmSend () {
      let msg1='是否确定发货?'
      for (let i in this.dataList) {
        if (!this.dataList[i].carrierType) {
          msg1='你有未添加物流信息的订单是否继续发货'
        }
      }
      let _this = this
      let title = "提示"
      let msg = msg1
      let lBtnText = "取消"
      let rBtnText = "确定"
      this.showDialog({
        title,
        msg,
        lBtnText,
        rBtnText,
        confCallBack () {
          // 确认发货接口
          _this.$http.send({
            poId: _this.poId
          }).then(res => {
            if (res.appCode==='S0000') {
              _this.$router.replace({
                name: 'todelive',
                query: {orderState: 1}
              })
            }
          })
        }
      })
    },
    addMode () {
      this.$router.push({
        name: "distriMethod"
      })
    },
    modifyMode () {
      this.$router.push({
        name: "distriMethod",
        query: {
          DistributionLogistics: this.DistributionLogistics,
          LogisticsNumber: this.LogisticsNumber,
          toDistate: this.toDistate
        }
      })
    },
    save () {
      this.$router.replace({
        path: "/toDelive",
        query: { orderState: parseInt(this.num) }
      })
    },
    confirmSend () {
      let msg1='是否确定保存?'
      if (!this.isadd) {
        msg1='是否修改物流信息'
      }
      if (this.innerList.state==3) {
        msg1='是否确定保存'
      }
      let _this = this
      let title = "提示"
      let msg = msg1
      let lBtnText = "取消"
      let rBtnText = "确定"
      this.showDialog({
        title,
        msg,
        lBtnText,
        rBtnText,
        confCallBack () {
          // 确认发货接口
          _this.$http
            .confirmDeliver({
              carrierBillno: _this.LogisticsNumber,
              carrierCode: _this.DistributionLogistics,
              carrierType: _this.mode,
              poSplitId: _this.poSplitIds
            })
            .then(res => {
              _this.$router.replace({
                name: "orderDetail"
              })
            })
            .catch(err => {})
        }
      })
    },
    toDetail (item) {
      window.localStorage.setItem("dataList", JSON.stringify(item))
      this.$emit("toDetail", {
        query: { num: this.num, poSplitIds: JSON.stringify(item.poSplitIds), dataList: item }
      })
    }
  },
  mounted () {
    switch (window.localStorage.getItem("settleMode")) {
      case "1":
        this.settleMode = "现结"
        break
      case "2":
        this.settleMode = "挂账"
        break
      case "3":
        this.settleMode = "预付"
        break
    }
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
