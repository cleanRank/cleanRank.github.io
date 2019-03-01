<template>
  <div>
    <div class="distriMethod">
      <div class="saleID">
        <div class="title">配送方式</div>
        <div class="method">
          <button class="byself" :class="{actived:actived1&&!actived2}" @click="byself">自行配送</button>
          <button class="thirdP" :class="{actived:actived2&&!actived1}" @click="thirdP">第三方配送</button>
        </div>
      </div>
      <div class="saleID" >
        <div class="title">配送物流</div>
        <div class="method">
          <!-- <input type="text" placeholder="请输入名称" v-model="DistributionLogistics"> -->
          <select v-model="selected" @change="defaultSelect($event)">
            <option :value="option.carrierDesc" v-for="(option,key) in options" :key="key"  >{{option.carrierName}}</option>
          </select>
        </div>
      </div>
      <div class="saleID" >
        <div class="title">物流单号</div>
        <div class="method">
          <input type="text" placeholder="请填写物流单号" v-model="LogisticsNumber">
        </div>
      </div>
    </div>
    <div class="seperate">
    <span class="confirmShop" @click="reset" v-if="num!=2">重置</span>
    <span class="confirmShop" @click="save">保存</span>
    </div>
  </div>
</template>
<script>
// import axios from 'axios'
export default {
  data () {
    return {
      LogisticsNumber: "",
      actived1: false,
      actived2: false,
      style: '',
      isBuy: '',
      selected: '',
      options: [],
      carrierCode: '',
      isByself: '',
      toDistate: '',
      num: ''
    }
  },
  created () {
    this.isBuy = window.localStorage.getItem('isBuy')
  },
  mounted () {
    this.getTransCom()
  },
  methods: {
    reset () {
      this.selected = ''
      this.LogisticsNumber = ''
      this.actived1=''
      this.actived2=''
      this.toDistate=''
    },
    defaultSelect (e) {
      this.carrierCode=this.options[e.target.selectedIndex].carrierCode
    },
    getTransCom () {
      this.num = window.localStorage.getItem('num')
      // axios.get('http://47.100.207.117:28114/system/carrier/list')
      this.$http.list().then(res => {
        this.options = res.result
        // this.selected = res.result[0].carrierName
        this.carrierCode = res.result[0].carrierCode
      }).catch(err => {})
      if (this.$route.query.DistributionLogistics) {
        this.selected = this.$route.query.DistributionLogistics
      }
      if (this.$route.query.LogisticsNumber) {
        this.LogisticsNumber = this.$route.query.LogisticsNumber
      }
      if (this.$route.query.toDistate) {
        this.toDistate = this.$route.query.toDistate
        switch (this.$route.query.toDistate+'') {
          case "1":
            this.actived1 = true
            this.actived2 =false
            break
          case "2":
            this.actived2 = true
            this.actived1 =false
            break
        }
      }
    },
    save () {
      if (this.actived1) {
        this.isByself = 1
      } else if (this.actived2) {
        this.isByself = 2
      } else {
        this.isByself = 3
      }
      // if ((this.LogisticsNumber==''||this.selected=='')&& !this.actived) {
      //   this.showToast({msg: '请填写完整物流信息'})
      // } else {
      if (this.isBuy=='1') {
        // debugger
        this.$router.replace({
          name: "allOrderDetail",
          query: {
            LogisticsNumber: this.LogisticsNumber,
            DistributionLogistics: this.selected,
            byself: this.isByself,
            toDistate: this.toDistate
          }
        })
      }
      if (this.isBuy=='2') {
        if (this.$route.query.DistributionLogistics||this.$route.query.LogisticsNumber) {
          this.$http.modifyPubSalesorderDtl({
            wayBill: this.LogisticsNumber,
            carriersCode: this.carrierCode,
            carriers: this.selected,
            orderDtlId: JSON.parse(window.localStorage.getItem('poSplitIds'))
          }).then(res => {
          }).catch(err => {})
        }
        this.$router.replace({
          name: "saleDetail",
          query: {
            LogisticsNumber: this.LogisticsNumber,
            DistributionLogistics: this.selected,
            carriersCode: this.carrierCode,
            byself: this.isByself
          }
        })
      }
      // }
      this.LogisticsNumber = ''
    },
    byself () {
      this.actived2 = false
      this.actived1 = !this.actived1
      if (this.actived1) {
        this.toDistate = 1
      } else {
        this.toDistate = 0
      }
    },
    thirdP () {
      this.actived1 = false
      this.actived2 = !this.actived2
      if (this.actived2) {
        this.toDistate = 2
      } else {
        this.toDistate = 0
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../assets/scss/_app";

.distriMethod {
  background: #fff;
  @include px2rem(padding, 20 0 20 32);
  .saleID {
    display: flex;

    @include font-dpr(28);

    @include px2rem(margin-bottom, 20);
    .title {
      // @include px2rem(margin, 14 0);
      color: rgba(51, 51, 51, 1);
      font-weight: 400;
      flex: 1;
      @include px2rem(line-height, 60);
      @include px2rem(text-indent, 20);
    }
    .method {
      flex: 2;
      display: flex;
      button {
        @include font-dpr(26);
        @include px2rem(margin-right, 60);
        @include px2rem(width, 150);
        @include px2rem(line-height, 60);
        @include px2rem(border-radius, 8);
        background: #f8f8f8;
        color: #333333;
      }
      .actived {
        background: url("../../../assets/icon/icon/rzsq_choose.png") no-repeat
          center;
        @include px2rem(background-size, 150 60);
      }
      input {
        border: 0;
        outline: 0;
      }
      select{
        background: inherit;
      }
    }
  }
}
.seperate{
  display: flex;
  justify-content: space-between;
}
.confirmShop {
  display: inline-block;
  margin: 50px auto;
  @include px2rem(width, 200);
  @include px2rem(height, 70);
  @include px2rem(line-height, 70);
  @include font-dpr(30);

  @include px2rem(border-radius, 8);
  color: #fff;
  text-align: center;
  background: #0087ff;
}
</style>
