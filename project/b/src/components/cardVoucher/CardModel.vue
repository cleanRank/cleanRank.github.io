<template>
<section  v-if="isLoding">
  <p class="cardVoucher_title">选择礼品卡</p>
  <ul class="cardVoucher_wrap">
    <template v-for="(item, i) in dataList">
      <li class="cardVoucher_item" :class="{'selected': selectIndex==i, 'sell_out_item': !item.saleStatus||item.saleStatus==0}" :key="i" @click="chooseItem(i, item.saleStatus)">
        <p class="buyBack_img" v-if="item.buyBackStatus && item.buyBackStatus == 1"></p>
        <img class="cardVoucher_item_img" :src="item.productImage">
        <div class="sell_box" v-if="!item.saleStatus||item.saleStatus==0"></div>
      </li>
    </template>
  </ul>
  <p class="cardVoucher_title">选择面值</p>
  <div class="face_value_box">
    <p class="face_value_item" :class="{'selected':valueIndex==j, 'disabled':0>=_item.proStock}" v-for="(_item, j) in products" :key="j" @click="checkPrice(j, _item)">{{_item.denomination}}</p>
  </div>
  <div class="card_voucher_wrap">
    <button class="btnCom" :class="{'hui':valueIndex==-1||selectIndex==-1}" @click="bindEvents">提交{{valueIndex>-1?'（售价 ¥' + selectList.price + '）':''}}</button>
  </div>
</section>
</template>
<script>
import { app } from 'lib/until'
import Base64 from 'lib/Base64'
import mixin from 'components/detail/mixin'
export default {
  mixins: [mixin],
  data () {
    return {
      selectIndex: 0,
      valueIndex: -1,
      dataList: {},
      products: {},
      selectList: '',
      productType: 103,
      currentParams: {},
      sxStatus: 0,
      isLoding: false
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      this.showLoad(true)
      // 获取数据
      let { uid, token } = this.$store.state.userInfo
      this.$post({
        url: this.$store.state.api.VirtualCardCharge,
        data: {
          uid,
          token
        }
      }).then(data => {
        this.showLoad(false)
        let res = data.data
        if (res.status == "1") {
          this.isLoding = true
          this.sxStatus = res.sxStatus
          this.dataList.cannotsale = 0
          this.$set(this.$data, 'dataList', res.data)
          this.$set(this.$data, 'products', res.data[0].products)
          // this.$set(this.$data, 'selectList', res.data[0].products[0])
        } else {
          this.showToast({msg: res.statusDetail})
        }
      })
    },
    chooseItem (i, saleStatus) {
      // 已售罄商品不能点击
      if (saleStatus>0) {
        this.selectIndex = i
        this.valueIndex = -1
        this.selectList = this.dataList[i].products[0]
        this.products = this.dataList[i].products
      }
    },
    checkPrice (i, item) {
      // 已选中值
      // 已售罄商品不能点击
      if (item.proStock&&item.proStock>0) {
        this.valueIndex = i
        this.selectList = item
      }
    },
    bindEvents () {
      if (this.valueIndex == -1 || this.selectIndex == -1 || this.dataList[this.selectIndex].saleStatus <= 0 || this.selectList.proStock <= 0) return false
      if (this.sxStatus && this.sxStatus==1) {
        // 已授信
        // 判断选中卡券是否售罄
        const { price } = this.selectList
        const currentVipParams = {
          mainImagePath: this.dataList[this.selectIndex].mainImagePath,
          jdPrice: price,
          phoneNo: this.$store.state.userInfo.mobile
        }
        this.currentParams = {...this.selectList, ...currentVipParams}
        this.confirmOrder()
      } else {
        // 去白条
        if (this.$store.state.config.fromChannel == 'sxypApp') {
          // 客户端授信
          app.goCredit()
        } else {
          let userId = this.$store.state.userInfo.userId
          let url = process.env.SXBTURL['CREDIT']
          let callUrl = window.location.href.indexOf('?') > -1 ? window.location.href : window.location.href + '?userId=' + userId
          const callBackUrl = Base64.encode(callUrl)
          let fromChannel = this.$store.state.config.fromChannel
          window.location.href = `${url}?userId=${userId}&fromChannel=${fromChannel}&callBackUrl=${callBackUrl}`
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
// .fiex_btn{
//   position: fixed;
//   width: 100%;
//   bottom: 0.5rem;
//   margin: 0 auto !important;
// }
.card_voucher_wrap{
  margin-top: 1rem;
  margin-bottom: 1rem;
}
</style>
