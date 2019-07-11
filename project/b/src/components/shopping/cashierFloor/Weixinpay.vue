<template>
<div class="byStages_wrap flex" @click="weChatpay()">
  <div class="cell_1 bankDetail justify-center vertical">
    <p class="bank_card font28">微信支付</p>
  </div>
  <div class="cell_0 radio_item justify-center vertical" >
    <input type="radio" class="agree" :checked="type==3" name="radioContent" >
  </div>
</div>
</template>
<script>
export default {
  props: {
    type: {
      type: String,
      default: 3
    }
  },
  methods: {
    weChatpay () {
      this.$emit('weChat', "3")
    }
  }
}
</script>
<style media="screen" lang="scss" scoped>
  @import "../../../assets/scss/app";
  .bankDetail, .radio_item {
    display: flex;
    margin-bottom: 0;
  }
 .byStages_wrap{
    @include px2rem(height, 120);
    border-top: 1px solid $borderColor;
    @include px2rem(margin, 0 30);
  }
  .font28{@include font-dpr(28);}
  .agree{
      @include px2rem(width,31);
      @include px2rem(height,31);
      -webkit-appearance: none;
      -moz-appearance: none;
      vertical-align: middle;
      background: url("../../../assets/icon/icon/money_noselected_icon@3x.png") no-repeat;
      background-size: 100%;
      border-radius: 50%;
      border: none;
    }
    .agree:checked{
      border: none;
      background: url("../../../assets/icon/icon/money_selected_icon@3x.png") no-repeat;
      background-size: 100%;
      border-radius: 50%;
    }
</style>
