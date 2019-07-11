<template>
    <ul>
        <router-link v-for="(_item, index) in goodsList" :key="index" tag="li" :to="`/detail?productNo=${_item.qualityProduct.productNo}&isActivity=${_item.qualityProduct.isActivity || 0}&activityNo=${_item.qualityProduct.activityNo || _item.fromNo|| ''}${_item.starNo?`&starNo=${_item.starNo}`:''}`" class="flex">
            <button class="circle" :class="{'circle-check': _item.isCheck}" :disabled="type==='invalidProductList'" @click.stop="chooseCurProd({_item, index})">
              <span></span>
            </button>
            <span class="goods-image cell_0">
              <img :src="_item.qualityProduct.mainImagePath" alt="" width="100%" height="100%">
            </span>
            <span class="goods-info cell_1">
              <span class="goods-title" :class="{'crossBorder_goods':_item.isCrossBorder==1}">{{_item.qualityProduct.productName}}</span>
              <p class="goods-spu">{{_item.spu}}</p>
              <div class="goods-define-box">
                <p class="goods-rebates" v-if="_item.rebates&&_item.rebates>0"><span>赚</span> ¥{{(_item.rebates * _item.quantity) | fixed2NoRound}}</p>
                <p class="goods-define" v-if="_item.minBuyCnt>1">{{_item.minBuyCnt}}件起售</p>
              </div>
              <p class="goods-bottom flex">
                <span class="goods-price cell_1">¥{{_item.qualityProduct.price}}</span>
                <span class="number-btn flex" v-if="type!='invalidProductList'">
                  <button
                  class="reduce-btn cell_0 line"
                  :class="{'disabled-ctrl': _item.quantity <= 1}"
                  :disabled="!(type==='productList' && isEditStatus)"
                  @click.stop="reduceShopCartGoodsNum({_item, index, num: -1, type: 0})"
                  >
                  </button>
                  <input type="text" class="cell_1" readonly :value="_item.quantity">
                  <button
                  class="add-btn cell_0"
                  :disabled="!(type==='productList' && isEditStatus)"
                  :class="{'disabled-ctrl': _item.quantity >= 10}"
                  @click.stop="reduceShopCartGoodsNum({_item, index, num: 1, type: 1})"
                  >
                  </button>
                </span>
              </p>
            </span>
        </router-link>
    </ul>
</template>
<script>
  import { mapActions } from 'vuex'
  export default {
    props: {
      goodsList: {
        require: true,
        type: Array,
        default: [
          {
            qualityProduct: {}
          }
        ]
      },
      type: '',
      isEditStatus: {}
    },
    methods: {
      ...mapActions([
      ]),
      // 减少选中商品的数量
      reduceShopCartGoodsNum (objCopy) {
        console.log("改变数："+JSON.stringify(objCopy))
        this.$emit('resetShopCartGoodsNum', objCopy)
      },
      // 选择商品
      chooseCurProd (obj) {
        this.$emit('chooseCurProd', obj)
      }
    }
  }
</script>
<style lang="scss">
@import "../../assets/scss/app";
.goods-define-box{
  overflow: hidden;
  .goods-define,.goods-rebates{
  float: left;
  @include px2rem(padding-right, 8);
  @include px2rem(height, 28);
  background: #F8DDAD;
  @include px2rem(border-radius, 4);
  @include px2rem(line-height, 28);
  @include font-dpr(20);
  span{
    display: inline-block;
    background: #444;
    @include px2rem(width, 28);
    @include px2rem(height, 28);
    text-align: center;
    color:#fff;
    }
  }
  .goods-rebates{
    @include px2rem(margin-right, 16);
  }
  .goods-define{
    @include px2rem(padding, 0 4);
    background: #fff;
    color: #FF5A60;
    border:1px solid rgba(255,90,96,1);
    @include font-dpr(18);
  }
}
</style>
