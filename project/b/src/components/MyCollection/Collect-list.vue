<template>
  <ul class="goods-list">
    <router-link tag="li" class="" v-for="(_item, key) in goodsList" :key="key" :to="`/detail?productNo=${_item.productNo}&isActivity=${_item.isActivity || 0}&activityNo=${_item.activityNo || ''}`">
      <section class="left-icon">
        <img :src="_item.mainImagePath" width="100%" height="100%"/>
      </section>
      <p class="goods-title">{{_item.productName}}</p>
      <p class="goods-tag">{{_item.sku}}</p>
      <p class="goods-bottom">
        <span class="goods-price">¥{{_item.price}}</span>
        <span class="follow" :class="{'check': !_item.isCheck}" @click.stop="checkFollow(key, _item)"></span>
      </p>
    </router-link>
  </ul>
</template>

<script>
export default {
  props: {
    goodsList: {
      require: true,
      type: Array,
      default: []
    }
  },
  methods: {
    // 通知父级组件重新整理数据
    checkFollow (key, _item) {
      this.$emit('checkIsFollow', {key, _item})
    }
  }
}
</script>

<style lang="scss">
@import "../../assets/scss/app";
  // 数据列表
  .my-collect-wrap{
    .goods-list{
      display: block;
      overflow: hidden;
      background: #fff;
      &>li:last-child {
        border-bottom: none;
      }
      &>li {
        padding: .4rem 0;
        // padding-bottom: .4rem;
        border-bottom: 1px solid $borderColor;
        &:after {
          content: "clear";
          clear: both;
          display: block;
          overflow: hidden;
          height: 0;
        }
      }
    }
     .left-icon{
       float: left;
       padding-right: 30px;
       width: 2.6667rem;
       height: 2.6667rem;
       margin-left: 0.4rem;
     }
     .goods-title{
       @include font-dpr(28);
       color: $color333;
       //
       margin-top: .1333rem;
       padding-right: .4rem;
       overflow: hidden;
       text-overflow: ellipsis;
       display: -webkit-box;
       -webkit-line-clamp: 2;
       -webkit-box-orient: vertical;
       height: 1.06667rem;
       line-height: .53333rem;
     }
     .goods-tag{
       @include font-dpr(24);
       color: #999;
      //  height: .32rem;
      //  line-height: .5867rem;
      padding-top: .1067rem;
       overflow: hidden;
       text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
     }
     .goods-bottom{
       padding-top: .2133rem;
     }
     .goods-price{
       @include font-dpr(32);
       color: $redColor;
       float: left;
      //  font-weight: bold;
     }
     .follow{
       float: right;
       width: .5333rem;
       height: .5333rem;
       background: url(../../assets/icon/myCollection/collection_hollow_icon@3x.png) no-repeat;
       background-size: 100% 100%;
       margin-top: .16rem;
       margin-right: .3467rem;
       &.check {
          background: url(../../assets/icon/myCollection/collection_solid_icon3x.png) no-repeat;
          background-size: 100% 100%;
        }
     }
  }
</style>
