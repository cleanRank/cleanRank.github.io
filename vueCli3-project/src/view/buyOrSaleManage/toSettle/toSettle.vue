<template>
  <div class="toSettle">
    <div class="title" @click="choseItem" v-if="isPay" ref="chose">
      <div :class="{actived:type==1}">
        帐期订单
        <i class="topicLine" v-if="type==1"></i>
      </div>
      <div :class="{actived:type==2}">
        非帐期订单
        <i class="topicLine" v-if="type==2"></i>
      </div>
      <div :class="{actived:type==3}" v-if="isBuy=='1'" >
        已申请结账
        <i class="topicLine" v-show="type==3"></i>
      </div>
    </div>
    <orderFormat   :isFirst='isFirst' :alreadyOffer='alreadyOffer'  :isPay='isPay' :num='logo' :isBuy='isBuy' :dataList='dataList'  @selected='selected'></orderFormat>
    <div class="confirmShop" v-if="type==1&&isBuy=='1'&&payState=='0'">
      <div class="offerMoney" @click="offerPay">申请结账</div>
    </div>
  </div>
</template>
<script>
import orderFormat from "../comOrderFormat"
export default {
  data () {
    return {
      type: 1,
      selectList: [],
      amtList: [],
      isPay: '',
      dataList: [],
      isBuy: '',
      payNum: '',
      logo: '',
      alreadyOffer: false,
      isFirst: true,
      page: 1,
      size: 10,
      payState: ''
    }
  },
  components: {
    orderFormat
  },
  methods: {
    selected (data) {
      let arr=[]
      let arr1=[]
      for (let i in data.selected) {
        arr.push(data.selected[i])
      }
      for (let i in data.amt) {
        arr1.push(data.amt[i])
      }
      this.amtList = arr1
      this.selectList = arr
    },
    choseItem (e) {
      let params = {}
      params.payState = this.payNum
      params.purchaseType = 1
      switch (e.target.textContent.replace(/\s*/g, "")) {
        case "帐期订单":
          this.type = 1
          this.alreadyOffer = false
          this.isFirst = true
          params.state = 0
          params.settleApply = 0
          params.orderStates = [5, 6]
          break
        case "非帐期订单":
          this.type = 2
          this.alreadyOffer = false
          this.isFirst = false
          params.state = 1
          params.orderStates = [5, 6]
          break
        case "已申请结账":
          this.type = 3
          this.isFirst = false
          this.alreadyOffer = true
          break
      }
      if (this.type !=3) {
        this.$http.listInfo({
          page: this.page,
          param: params,
          size: this.size
        }).then(res => {
          if (res.appCode == "S0000") {
            this.dataList = res.result.datas
          }
        }).catch(err => {
        })
      } else {
        // debugger
        this.$http.checkedInfo({
          "page": this.page,
          "size": this.size}).then(res => {
          this.dataList = res.result.datas
        })
          .catch(err => {})
      }
    },
    getDataList () {
      // 订单列表查询
      this.isBuy = window.localStorage.getItem('isBuy')
      // debugger
      if (this.payState!="undefined"&&this.isBuy=='1') {
        if (this.payState==3) {
          this.$http.paySettleList({
            pageNo: this.page,
            pageSize: this.size
          }).then(res => {
            this.dataList=res.result.result.datas
          }).catch(err => {})
        } else {
          let params = {}
          if (this.isBuy=='1') {
            params.payState = this.payNum
            params.purchaseType = 1
            params.orderStates = [5, 6]
            if (this.payNum==0) {
              params.state = 0
              params.settleApply = 0
            }
            this.api = 'listInfo'
          } else {
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
        }
      }
    },
    offerPay () {
      this.$router.push({
        name: "offerPay",
        query: {selected: this.selectList, amt: this.amtList}
      })
    },
    init () {
      this.type=1
      this.alreadyOffer=false
      this.isFirst=true
      if (this.$route.query.payState==0||this.$route.query.payState==3) {
        this.payNum = this.$route.query.payState
        switch (this.payNum+'') {
          case "0":
            this.logo = 4
            break
          case "3":
            this.logo = 5
        }
        window.localStorage.setItem('num', this.logo)
        if (this.$route.query.isBuy===true) {
          window.localStorage.setItem("isBuy", 1)
        } else if (this.$route.query.isBuy===false) {
          window.localStorage.setItem("isBuy", 2)
        }
        if (this.payNum==0) {
          this.isPay = true
        } else {
          this.isPay = false
        }
      }
      if (this.$route.query.payState=='0'||this.$route.query.payState=='3') {
        window.localStorage.removeItem('payState')
        window.localStorage.setItem('payState', this.$route.query.payState)
      }
      if (window.localStorage.getItem('payState')) {
        this.payState = window.localStorage.getItem('payState')
      }
    }
  },
  mounted () {
    this.init()
    this.getDataList()
  },
  computed: {
    watchNum () {
      return this.$route.query
    }
  },
  watch: {
    watchNum: ['init', 'getDataList']
  }
}
</script>
<style lang="scss" scoped>
@import "../../../assets/scss/_app";

.toSettle {
  // @include px2rem(padding, 20 0 20 20);
  .title {
    display: flex;
    div {
      position: relative;
      background: #fff;
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      @include font-dpr(28);
      @include px2rem(line-height, 28);
      @include px2rem(padding, 20 10);
      color: rgba(102, 102, 102, 1);
      .topicLine {
        @include px2rem(width, 80);
        @include px2rem(margin-top, 30);
        @include px2rem(height, 4);
        background: rgba(0, 135, 255, 1);
      }
    }
    .actived {
      color: rgba(0, 135, 255, 1);
    }
  }
  .confirmShop {
    position: fixed;
    bottom: 0;
    background: #fff;
    @include px2rem(height, 150);
    width: 100%;
    @include px2rem(line-height, 90);
    @include font-dpr(30);
    color: #fff;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    .offerMoney {
      @include px2rem(width, 580);
      @include px2rem(border-radius, 8);
      background: #0087ff;
    }
  }
}
</style>
