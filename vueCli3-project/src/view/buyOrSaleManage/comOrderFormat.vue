<template>
  <div>
    <load-more :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :auto-fill="false" ref="loadmore">
    <div class="commonOrder-content" v-for="(item,key) in dataList" :key="key">
      <div class="status">
        <div class="left">
          <i class="blieLine"></i>
          <div class="title">订单</div>
        </div>
        <div v-if="isPay&&isFirst">
          <div class="right" @click="judgeOffer(key,item.poId,item.receptAmt)"  ref="offer">
            <i class="offerIcon" :class="{offerIcon1:!item.offerIcon,offerIcon2:item.offerIcon}"></i>未申请
          </div>
        </div>
        <div class="right" v-if="(item.state==1||item.state==2||item.deliveryStatus==1)&&!isFirst&&!alreadyOffer">待发货</div>
        <div class="right" v-if="(item.state==3||item.deliveryStatus==2)&&!isFirst&&!alreadyOffer">已发货</div>
        <div class="right" v-if="isBuy=='1'&&num==5&&item.settleStatus==2">待付款</div>
        <div class="right" v-if="isBuy=='1'&&num==5&&item.settleStatus==3">已付款</div>
        <div class="right right1" v-if="(item.state==6||item.deliveryStatus==3)&&!isFirst&&!alreadyOffer">已完成</div>
        <div class="right" v-if="zcisBuy==520&&!alreadyOffer&&!item.state">已完成</div>
        <div class="right right1" v-if="item.state==4&&!isFirst&&!alreadyOffer">部分收货</div>
        <div class="right right1" v-if="item.state==5&&!isFirst&&!alreadyOffer">差异收货</div>
      </div>
      <div class="line"></div>
      <div>
        <div v-if="alreadyOffer&&num==4" @click="toDetail(item)">
          <div class="saleID">
            <span>物流单号</span>
            <span class="number">{{item.invoicePostBillno}}</span>
          </div>
          <div class="saleID">
            <span>金额</span>
            <span class="number">¥{{item.amt}}</span>
          </div>
          <div class="saleID">
            <span>提交时间</span>
            <span class="number">{{item.time|formatTime("yyyy-MM-dd hh:mm:ss")}}</span>
          </div>
        </div>
        <div @click="toOrderDetail(item, num)" v-if="item.poId||num==5">
        <div class="saleID" v-if="!alreadyOffer||num==5">
          <span v-if="isBuy=='2'">销售订单ID</span>
          <span v-if="isBuy=='1'&&num!=5">采购订单ID</span>
          <span v-if="isBuy=='1'&&num==5">结算单ID</span>
          <span v-if="zcisBuy=='520'&&num!=5&&!item.state">退货单ID</span>
          <span class="number" v-if="zcisBuy==520&&!item.state">{{item.poId}}</span>
          <span class="number" v-if="isBuy=='1'&&num!=5">{{item.poId}}</span>
          <span class="number" v-if="isBuy=='1'&&num ==5">{{item.paysettleId}}</span>
        </div>

        <div class="saleID" v-if="!alreadyOffer||num==5">
          <span v-if="num==1">订单时间</span>
          <span v-else-if="num==2">发货时间</span>
          <span v-else-if="num==3">收货时间</span>
          <span v-else-if="isPay&&num==4">完成时间</span>
          <span v-else-if="num==5">清算时间</span>
          <span v-else>发起时间</span>
          <span v-if="zcisBuy==520&&num!=5&&!item.state" class="number">{{item.purchaseCreateTime}}</span>
          <span v-if="isBuy=='1'&&num==1"  class="number">{{item.time|formatTime("yyyy-MM-dd hh:mm:ss")}}</span>
          <span v-if="isBuy=='1'&&(num==4||num==3||num==2)"  class="number">{{item.updateTime|formatTime("yyyy-MM-dd hh:mm:ss")}}</span>
          <span v-if="isBuy=='1'&&num==5"  class="number">{{item.gmtCreatedTimestamp|formatTime("yyyy-MM-dd hh:mm:ss")}}</span>
        </div>
        </div>

         <div @click="toAllOrderDetail(item, num)" v-if="item.orderId">
        <div class="saleID" >
          <span v-if="isBuy=='2'">销售订单ID</span>
          <span v-if="isBuy=='1'">采购订单ID</span>
          <span class="number">{{item.orderId}}</span>
        </div>

        <div class="saleID" >
          <span v-if="num==1||item.deliveryStatus==1">订单时间</span>
          <span v-else-if="num==2||item.deliveryStatus==2">发货时间</span>
          <span v-else-if="num==3||item.deliveryStatus==3">收货时间</span>
          <span v-else-if="isPay&&num==4">完成时间</span>
          <span v-else-if="num==5">清算时间</span>
          <span v-else>发起时间</span>
          <span v-if="zcisBuy==520&&num!=5&&!item.state" class="number">{{item.purchaseCreateTime}}</span>
          <span v-if="isBuy=='1'&&num==1"  class="number">{{item.time|formatTime("yyyy-MM-dd hh:mm:ss")}}</span>
          <span v-if="isBuy=='1'&&(num==4||num==3||num==2)"  class="number">{{item.updateTime|formatTime("yyyy-MM-dd hh:mm:ss")}}</span>
          <span v-if="isBuy=='1'&&num==5"  class="number">{{item.inputTime|formatTime("yyyy-MM-dd hh:mm:ss")}}</span>
        </div>
        </div>
      </div>
    </div>
    <div v-if="!dataList" class="noData">
      暂无数据
    </div>
    </load-more>
  </div>
</template>
<script>
import loadMore from 'components/common/LoadMore'
export default {
  data () {
    return {
      offerIcon: true,
      selectedId: {},
      selectedAmt: {},
      page: 1,
      size: 10,
      allLoaded: false,
      zcisBuy: window.localStorage.getItem('isBuy'),
      pageA: 1,
      pageB: 1,
      pageC: 1,
      pageD: 1,
      pageE: 1,
      pageF: 1,
      pageG: 1
    }
  },
  props: [
    "dataList",
    'isPay',
    'isBuy',
    'num',
    'alreadyOffer',
    'isFirst'
  ],
  components: {
    loadMore
  },
  methods: {
    toOrderDetail (item, num) {
      if (num==5) {
        this.$router.push({
          name: "settleSheetDetail",
          query: {item: JSON.stringify(item), num: num}
        })
      } else {
        this.$router.push({
          name: "orderDetail",
          query: {poId: item.poId, num: num}
        })
        if (item.settleMode) {
          window.localStorage.setItem('settleMode', item.settleMode)
        }
      }
    },
    toAllOrderDetail (item, num) {
      this.$router.push({
        name: "saleDetail",
        query: {item: item, num: num}
      })
    },
    clearSelected () {
      this.selectedId = {}
    },
    toDetail (item) {
      this.$router.push({
        name: "payDetail",
        query: item
      })
    },
    loadBottom () {
      this.getList()
    },
    getList () {
      let params = {}
      if (!this.isFirst&&this.alreadyOffer) {
        this.pageC++
        this.$http.checkedInfo({page: this.pageC, size: this.size}).then(res => {
          this.showLoad(false)
          this.$refs.loadmore.onBottomLoaded()
          if (res.result.datas.length < this.size) {
            this.allLoaded = true
          }
          this.dataList = this.dataList ? this.dataList : []
          this.dataList = [...this.dataList, ...res.result.datas]
        }).catch(res => {})
      } else {
        if (this.isBuy=='1') {
          if (this.num==4) {
            if (this.isFirst) {
              this.page=++this.pageA
              params.payState=0
              params.state=0
              params.purchaseType=1
              this.api = 'listInfo'
            } else if (!this.isFirst&&!this.alreadyOffer) {
              this.page=++this.pageB
              params.payState=0
              params.state=1
              params.orderState=6
              params.purchaseType=1
              this.api = 'listInfo'
            }
          } else if (this.num==5) {
            this.$http.paySettleList({
              pageNo: this.pageG++,
              pageSize: this.size
            }).then(res => {
              this.showLoad(false)
              this.$refs.loadmore.onBottomLoaded()
              if (res.result.result.datas.length < this.size) {
                this.allLoaded = true
              }
              this.dataList = this.dataList ? this.dataList : []
              this.dataList = [...this.dataList, ...res.result.result.datas]
            })
          } else {
            switch (this.num+'') {
              case '1':
                this.page=++this.pageD
                break
              case '2':
                this.page=++this.pageE
                break
              case '3':
                this.page=++this.pageF
            }
            params.orderState = this.num
            params.purchaseType=1
            this.api = 'listInfo'
          }
        } else if (this.isBuy=='2') {
          params.deliveryStatus = this.num
          this.api = 'SelOrder'
        }
        this.$http[this.api]({
          page: this.page,
          param: params,
          size: this.size
        }).then(res => {
          this.showLoad(false)
          this.$refs.loadmore.onBottomLoaded()
          if (res.result.datas.length < this.size) {
            this.allLoaded = true
          }
          this.dataList = this.dataList ? this.dataList : []
          this.dataList = [...this.dataList, ...res.result.datas]
          for (let i in this.dataList) {
            if (this.dataList[i].offerIcon) {
              this.dataList[i].offerIcon = false
            }
          }
        }).catch(res => {})
      }
    },
    judgeOffer (key, id, amt) {
      if (this.dataList[key].offerIcon) {
        this.dataList[key].offerIcon = false
        delete this.selectedId[key]
        delete this.selectedAmt[key]
      } else {
        this.$set(this.dataList[key], "offerIcon", true)
        // this.selectedId[key]=this.dataList1[key].poId
        this.selectedId[key] = id
        this.selectedAmt[key] = amt
      }
      this.$emit("selected", {selected: this.selectedId, amt: this.selectedAmt})
      // this.selectedId = {}
    }
  },
  computed: {
    watchNum () {
      return this.$route.query
    }
  },
  watch: {
    watchNum: 'clearSelected'
  }
}
</script>
<style lang="scss" scoped>
@import "../../assets/scss/_app";
</style>
