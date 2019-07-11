<template>
<section v-if="byStagesDetail.length>0">
  <!-- <ul class="month_list paddinglr30 flex">
    <li class="moth_item cell_0" :class="{'actity_moth':actity_moth==index}" v-for="(item, index) in byStagesDetail" :key="index" @click="caleDownpayment(item.month, index, $event)"><span class="mount_span">{{item.month}}个月</span></li>
  </ul> -->
  <!--商品分期详情s-->
  <ul class="bystages_list flex">
    <li class="bystages_item cell_0" v-for="(item, index) in byStagesDetail" :key="index" @click="caleDownpayment(item.month, index)">
      <div class="bystages_box" :class="{'visit_item': cutIndex == index}">
        <!-- <p class="question_txt" v-if="index == i" @click="showList"></p> -->
        <p class="bystages_sum font17">{{item.monthAmt}}元x{{item.month}}期</p>
        <p class="bystages_detial font10"><b>总还款 {{item.contractAmt}}元</b> <b>利率 {{item.rate}}/月</b></p>
      </div>
    </li>
  </ul>
  <div class="agreement_wrap_box">
    <p class="checkout_p" @click="byDatanum($event)">
      <span class="agrees_rideo" :class="{'agrees_rideo_checked':isChecked}"></span>
      <!-- <input type="checkbox" name="xieyi" :checked="isChecked" class="agrees_rideo" > -->
      <label class="font28">我已查看并完全同意相关借款服务消费协议</label>
    </p>
    <p @click="jupmToProtocol" class="c_999 agreement_ps">我已查看并完全同意<span>《借款协议》《仲裁协议》《网贷信息技术服务合同》《信息咨询服务合同》</span>及相关借款服务消费协议</p>
    <p class="c_999 agreement_ps"></p>
    <p class="agreement_ps no-yuan"><span>以上费用均由借款人自行承担</span></p>
    <p class="c_999 floors_txt"></p>
  </div>
</section>
</template>
<script>
export default {
  data () {
    return {
      month: 0,
      cutIndex: 0,
      types: 2
    }
  },
  created () {
    if (this.byStagesDetail.length>0) {
      this.cutIndex = this.byStagesDetail.length-1
      this.month = this.byStagesDetail[this.cutIndex].month
    }
  },
  props: {
    byStagesDetail: {
      required: true,
      type: Array
    },
    isChecked: {
      required: true
    }
  },
  methods: {
    caleDownpayment (month, index, e) {
      this.cutIndex = index
      this.month = month
      this.$emit('byData', {month})
    },
    jupmToProtocol () {
      let passOrderId = this.$store.state.route.query.orderId
      this.$router.push({path: 'protocolList', query: {passOrderId}})
    },
    byDatanum (e) {
      let month = this.month
      let payType = this.types
      this.$emit('byData', {month, payType})
    },
    inPayments (types) {
      // type 4银行卡付款 3额度付款
      if (types == 4) {
        this.showToast({msg: '暂不支付使用银行卡支付，请使用服务额度支付'})
        return false
      }
      this.$set(this.$data, 'types', types)
    }
  }
}
</script>
<style media="screen" lang="scss" scoped>
  @import "../../assets/scss/app";
  .paddinglr30{
    @include px2rem(padding, 0 30);
  }
   .rad_c{
    color: $mainColor;
  }
  .paddingT6{
    @include px2rem(padding-top, 6);
  }
  .paddingB6{
    @include px2rem(padding-bottom, 6);
  }
  .font32{@include font-dpr(32);}
  .font28{@include font-dpr(28);}
  .font26{@include font-dpr(26);}
  .font24{@include font-dpr(24);}
  .month_list{
    text-align: center;
    @include px2rem(margin, 20 0 40);
  }
  .moth_item{
    @include px2rem(width, 172);
    .mount_span{
      display: block;
      @include px2rem(width, 158);
      @include px2rem(height, 80);
      @include px2rem(line-height, 80);
      border: 1px solid $borderColor;
      border-radius: 4px;
      @include font-dpr(28);
      margin: 0 auto;
    }
  }
  .actity_moth{
    .mount_span{
       background: $mainColor;
      border: 1px solid $mainColor;
      color: #ffffff;
    }
  }
  .cashierMoney_item{
    @include px2rem(padding-bottom, 30);
    line-height:1;
  }
  // .cashierMoney_num, .cost_num{
  //   text-align: right;
  //   font-weight: bold;
  // }
  .issue_icon{
    // background: url("../../assets/icon/icon/public_help_n@3x.png") no-repeat right center;
    // @include px2rem(background-size, 28 28);
    // @include px2rem(padding-right, 38);
  }
  .cost_title{
    @include px2rem(height, 16);
    background: #f6f6f6;
  }
  .cost_wrap_box{
    // @include px2rem(margin-top, 6);
    .cost_box_model:last-child{
      border-bottom: none;
    }
  }
  .cost_box_model{
    border-bottom: 1px solid $borderColor;
    @include px2rem(padding-bottom, 4);
    p:last-child{
      @include px2rem(padding-bottom, 30);
    }
  }
  .cost_main_title{
     @include px2rem(padding, 30 0 24);
  }
  .paddingB30{
    @include px2rem(padding-bottom, 30);
    border-bottom: none;
  }
  .paddingB24{
     @include px2rem(padding-bottom, 24);
     border-bottom: none;
  }
  .agrees_rideo{
    display: inline-block;
    &.agrees_rideo_checked{
    background: url("../../assets/icon/icon/money_selected_icon@3x.png") center no-repeat;
    background-size: 100%;
    }
  }
    .order_explain{
      line-height: 1;
      @include font-dpr(24);
      @include px2rem(padding-bottom, 30);
      @include px2rem(margin-top, -6);
    }
    .menu_box{
      // @include px2rem(padding-bottom, 24);
      .agrees_rideo{
        @include px2rem(margin-right, 6);
      }
      .bank_menu{
        // @include px2rem(line-height, 31);
        @include font-dpr(24);
      }
    }
</style>
