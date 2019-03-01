<template>
  <div>
    <scroll-view scroll-y="true" class="shop-comdity">
      <div class="mod" v-for="(item, index) in cartInfo" :key="index">
        <div class="comdity-name">{{item.goodsName}}</div>
        <div class="comdity-info">
          <em>￥{{item.totalAmt?item.totalAmt:item.salesPrice}}</em>
          <div class="add-sub">
            <span @click="reduce(item)"></span>
            <input class="cart-num-input" type="number" v-model.number="item.cnt" maxlength='2' confirm-type="done" v-on:input="bindinput(item)" @blur="lostBlur(item)">
            <span @click="addCart(item)"></span>
          </div>
        </div>
      </div>
    </scroll-view>
  </div>
</template>

<script>
export default {
  data () {
    return {
      cartInfo: ''
    }
  },
  props: ['storeInfo'],
  watch: {
    storeInfo: {
      handler (newValue, oldValue) {
        if (newValue === oldValue) {
          return false
        }
        this.cartInfo = newValue
      },
      deep: false
    }
  },
  methods: {
    addCart (item) {
      if (item.cnt > 100) {
        this.$Toast({
          content: '单件商品限制99件'
        })
        return false
      } else {
        item.cnt = item.cnt + 1
        item.totalAmt = (item.cnt * item.salesPrice).toFixed(2)
      }
      this.$emit('changeStoreInfo', {storeInfo: this.cartInfo, item: item, isAdd: true})
    },
    bindinput (item) {
      item.totalAmt = (item.cnt * item.salesPrice).toFixed(2)
      this.$emit('changeStoreInfo', {storeInfo: this.cartInfo, item: item})
    },
    lostBlur (item) {
      if (!item.cnt) {
        item.cnt = 1
      }
      item.totalAmt = (item.cnt * item.salesPrice).toFixed(2)
    },
    reduce (item) {
      if (item.cnt < 2) {
        this.cartInfo.forEach((v, i) => {
          if (v.goodsSn === item.goodsSn) {
            this.cartInfo.splice(i, 1)
          }
        })
        item.cnt = item.cnt - 1
        item.totalAmt = 0
      } else {
        item.cnt = item.cnt - 1
        item.totalAmt = item.cnt * item.salesPrice
      }
      item.totalAmt.toFixed(2)
      this.$emit('changeStoreInfo', {storeInfo: this.cartInfo, item: item, isAdd: false})
    }
  },
  computed: {
    itemPriceCount () {
      return (c, p) => {
        return c * p
      }
    }
  },
  mounted () {
    this.cartInfo = this.storeInfo
  }
}
</script>

<style>
.card {
  padding: 10px;
}
</style>
