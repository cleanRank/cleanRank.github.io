<template>
  <div class="pop_box bombbox_box" id="successWrap">
    <div class="opa" @click="getMobile(1)"></div>
    <div class="tip-cont" id="couponMobileBox">
       <div class="">
          <p class="p_txt">领取优惠券</p>
          <p class="states">
            <span>手机号码：</span>
            <input type="text"  maxlength="11"  name="couponMobile" reg="phone" autofocus="autofocus" placeholder="请输入手机号码" data-validate="phone" autocomplete="off" v-model="couponMobile" class="mobile_input">
          </p>
          <p class="states">
            <span>员工编号：</span>
            <input type="text" name="staffNum" maxlength="10" placeholder="请输入员工编号" v-model="staffNum" class="mobile_input" reg="staffNum" data-validate="staffNum">
          </p>
        </div>
        <div class="btn-cont flex">
          <a class="btn_comsty btn_cancle cell_1 js_pop_cancel" href="javascript:;" @click="getMobile(1)">取消</a>
          <a href="javascript:;" class="btn_comsty btn_get cell_1 js_pop_ok" @click="getMobile">领取</a>
        </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      couponMobile: '',
      staffNum: ''
    }
  },
  created () {
  },
  methods: {
    getMobile (type) {
      let isShowbombbox = false
      let couponMobile = ''
      let staffNum = ''
      if (type!=1) {
        if (!this.checkAll($('#couponMobileBox'))) { return false }
        couponMobile = this.couponMobile
        staffNum = this.staffNum
      }
      this.$emit('getMobile', couponMobile, isShowbombbox, staffNum)
    }
  }
}
</script>

<style scoped lang="scss">
@import "../../assets/scss/app";
.bombbox_box{
  .tip-cont{
    background: #ffffff;
  }
}
.states{
  @include px2rem(padding, 20 0);
  @include font-dpr(26);
  line-height: 1.5;
}
.numbombbox_box{
  @include px2rem(width, 160);
  text-align: right;
}
.mobile_input{
  @include px2rem(height, 60);
  @include px2rem(line-height, 60);
  border: 1px solid $borderColor;
  text-indent: 12px;
  width: 62%;
}
.btn-cont a.js_pop_cancel{
  color: $color333;
}
.pop_box .opa, #successWrap{
  z-index: 9998;
}
</style>
