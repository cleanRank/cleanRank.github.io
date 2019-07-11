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
      this.$emit('setOrder', {searchType: orderNo, isDesc: this.deAc})
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/scss/app";
@import "../../assets/scss/flex";
.new-search-tab{
  text-align: center;
  @include flex(0);
  @include lh(56, 56);
  background: #fff;
}
.new-change-arow {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  color: $color444;
  &.active{
    color: $mainColor;
  }
  .nca-txt {
    position: relative;
    @include font-dpr(28);
    &:after{
      position: absolute;
      content: "";
    }
  }
  &.active.new-sort-down .nca-txt {
    &:after{
      background: url("../../assets/icon/icon/arow_down_active.png") no-repeat right center;
      background-size: contain;
    }
  }
}
.new-sort-price span{
  &:after{
    @include wh(12, 20);
    top: 0;
    bottom: 0;
    margin: auto;
    @include px2rem(margin-left, 12);
  }
  &.A_img{
    &:after {
      background: url("../../assets/icon/icon/new_arow_moren.png") no-repeat right center;
      background-size: contain;
    }
  }
}
.new-sort-price.active{
  .A_img{
    &:after {
      background: url("../../assets/icon/icon/new-arow_active_top.png") no-repeat right center;
      background-size: contain;
    }
  }
  &.price_down{
    .A_img{
      &:after {
        background: url("../../assets/icon/icon/new_arow_active_bottom.png") no-repeat right center;
        background-size: contain;
      }
    }
  }
}
</style>
