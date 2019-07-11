<template>
  <ul class="new-search-tab flex">
    <li class="new-change-arow cell_1" :class="{active: orderNo == 0}" @click="toggleData(0)">
      <span class="nca-txt">综合</span>
    </li>
    <li class="new-change-arow cell_1" :class="{active: orderNo == 1}" @click="toggleData(1)">
      <span class="Z_mr nca-txt">按销量</span>
    </li>
    <li class="new-change-arow new-sort-price cell_1" :class="{active: orderNo == 2, price_down: deAc == 1}" @click="toggleData(2, true)">
      <span class="A_img nca-txt">按价格</span>
    </li>
  </ul>
</template>

<script>
export default {
  data () {
    return {
      orderNo: 0,
      deAc: 1
    }
  },
  methods: {
    toggleData (orderNo, hasDeAc) {
      this.$set(this.$data, 'orderNo', orderNo)
      if (hasDeAc) {
        this.$set(this.$data, 'deAc', 1 - this.deAc)
      }
      this.$emit('setOrder', {orderNo, deAc: this.deAc})
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/scss/app";
@import "../../assets/scss/flex";
.new-search-tab{
  text-align: center;
  min-height: 1.06667rem;
  @include flex(0);
  @include px2rem(line-height, 80);
  background: #fff;
  border-bottom: 1px solid #eee;
  border-top: 1px solid #eee;
}
.new-change-arow {
  position: relative;
  &.active{
    color: $mainColor;
  }
  .nca-txt {
    position: relative;
    @include font-dpr(24);
    &:after{
      position: absolute;
      content: "";
    }
  }
  &.active.new-sort-down .nca-txt {
    &:after{
      // @include wh(11, 6);
      @include px2rem(margin-top, 37);
      @include px2rem(margin-left, 10);
      background: url("../../assets/icon/icon/arow_down_active.png") no-repeat right center;
      background-size: contain;
    }
  }
  + .new-change-arow {
    &:before {
      content: '';
      position: absolute;
      @include px2rem(width, 2);
      @include px2rem(height, 40);
      left: 0;
      top: 50%;
      -webkit-transform: translate(0, -50%);
      -moz-transform: translate(0, -50%);
      -o-transform: translate(0, -50%);
      transform: translate(0, -50%);
      background: #eee;
    }
  }
}
</style>
