<template>
<dl class="flex as_product_detail">
  <dd class="cell_0 as_productImg">
    <img :src="product.productImage" class="lazy">
  </dd>
  <dt class="cell_1 as_productContent">
    <p class="as_productName font13" v-text="product.productName"></p>
    <p class="c_999 num_spu_box font12 c_777"><span v-if="product.buycount || product.afterSaleCount">数量：{{product.buycount || product.afterSaleCount}}</span></p>
    <p class="as_jg_box font14">
      <span v-if="product.productPrice">¥<b class="font15">{{product.productPrice}}</b><span class="c_777 font12 fr" v-if="product.aftersaleProductCnt">申请数量：{{product.aftersaleProductCnt}}</span></span>
      <span v-if="product.afterSaleType"><span class="c_777 font12 fr">{{product.afterSaleTypeDesc}}</span></span>
    </p>
  </dt>
</dl>
</template>
<script>
export default {
  props: {
    product: {
      required: true,
      type: Object,
      default: {}
    }
  }
}
</script>
