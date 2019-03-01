<template>
  <div class="offerPay">
    <div class="buyID">
      <div class="saleID" v-for="(item,key) in poId" :key="key">
        <span class="span">采购订单ID</span>
        <span class="number span">{{item}}</span>
      </div>
      <div class="line"></div>
      <!-- <div class="saleID">
        <span class="label">发票邮递地址</span>
        <span class="number address">上海市闵行区申虹路泰宏路鱼跃大楼 601水象科技</span>
      </div> -->
       <div class="saleID" >
        <span class="span"></span>
        <span class="number span">总结算金额:{{totalAmt}}</span>
      </div>
    </div>
    <div class="gap">
      <div class="saleID">
        <span class="label">物流公司</span>
        <span class="address">
          <input type="text" placeholder="请输入名称" v-model="LogisticsCompany">
        </span>
      </div>
      <div class="line"></div>
      <div class="saleID">
        <span class="label">物流单号</span>
        <span class="address">
          <input type="text" placeholder="请输入名称" v-model="LogisticsNumber">
        </span>
      </div>
      <div class="line"></div>
      <div class="confirmShop" @click="submit">提交</div>
      <div class="leftWhite"></div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      LogisticsNumber: "",
      LogisticsCompany: '',
      poId: [],
      totalAmt: '',
      amtList: []
    }
  },
  methods: {
    submit () {
      if (this.LogisticsCompany==''||this.LogisticsNumber=='') {
        this.showToast({msg: '请填写完整物流信息'})
      } else {
        this.$http.confirmBalance({
          invoicePostBillno: this.LogisticsNumber,
          invoicePostCarrier: this.LogisticsCompany,
          poId: this.poId
        }).then(res => {
          this.$router.replace({
            name: "toSettle",
            query: {
              payState: 0
            }
          })
        }).catch(err => {})
      }
    },
    init () {
      if (this.$route.query) {
        this.poId =this.$route.query.selected
        this.LogisticsCompany = ''
        this.LogisticsNumber = ''
      }
      if (this.$route.query.amt) {
        this.amtList = this.$route.query.amt
        let total=0
        for (let i =0; i<this.amtList.length; i++) {
          total+=this.amtList[i]
        }
        this.totalAmt = total
      }
    }
  },
  mounted () {
    this.init()
  },
  watch: {
    watchNum: 'init'
  },
  computed: {
    watchNum () {
      return this.$route.query
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../assets/scss/_app";
.buyID {
  @include px2rem(padding, 30 0 20 30);
  background: #fff;
}
.line {
  @include px2rem(height, 1);
  @include px2rem(margin, 20 0);
  background: #f2f2f2;
}
.gap {
  @include px2rem(margin-top, 20);
  @include px2rem(height, 800);
  background: #fff;
  @include px2rem(padding, 10 0 20 30);
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
  .span {
    overflow: hidden;
    @include px2rem(margin-left, 20);
    text-overflow: ellipsis; //文本溢出显示省略号
    // white-space: nowrap; //文本不会换行（单行文本溢出）
  }
  .number {
    @include px2rem(margin-right, 28);
    color: rgba(102, 102, 102, 1);
  }
  .label {
    flex: 1;
    @include px2rem(text-indent, 20);
    color: rgba(51, 51, 51, 1);
  }
  .address {
    flex: 2;
    input {
      border: 0;
      outline: 0;
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
.leftWhite {
  background: #fff;
  @include px2rem(height, 240);
}
</style>
