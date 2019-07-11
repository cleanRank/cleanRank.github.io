<template>
<section v-if="isLoding">
  <ul class="order_card_model">
    <template v-for="(item, i) in dataList">
    <li class="order_card_item" :key="i">
      <p class="order_card_title flex">
        <span class="cell_1 font18">{{item.productName}}</span>
        <span class="cell_0 c_999 tr">{{item.orderTime}}</span>
      </p>
      <p class="flex order_card_detail">
        <b class="cell_1">卡号：{{item.cardNo}}</b>
        <span class="cell_0 copy_btn" @click="doCopy(item.cardNo)">复制</span>
      </p>
      <p class="flex order_card_detail">
        <b class="cell_1" @click="offOron(i)" :class="item.isonEye?'onEye':'pasword_btn'">密码：{{item.isonEye?item.cardPwd:'**********'}}</b>
        <span class="cell_0 copy_btn" @click="doCopy(item.cardPwd)">复制</span>
      </p>
      <router-link to="cardRate" tag="div" class="go_recycle">去寄售</router-link>
    </li>
    </template>
  </ul>
  <div class="nodata_order" v-if="noData">
    <img src="../../assets/icon/loan/kong.png">
    <p>暂无礼品卡订单</p>
  </div>
</section>
</template>
<script>
import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)
export default {
  data () {
    return {
      noData: false,
      isLoding: false,
      dataList: {}
    }
  },
  created () {
    this.getData()
  },
  methods: {
    offOron (i) {
      this.dataList[i].isonEye = !this.dataList[i].isonEye
    },
    doCopy (val) {
      let _t = this
      this.$copyText(val).then(function (e) {
        _t.showToast({msg: '复制成功'})
      }, function (e) {
        _t.showToast({msg: '复制失败'})
      })
    },
    getData () {
      this.showLoad(true)
      // 获取数据
      let { uid, token } = this.$store.state.userInfo
      this.$post({
        url: this.$store.state.api.VirtualCardDetail,
        data: {
          uid,
          token
        }
      }).then(data => {
        this.isLoding = true
        this.showLoad(false)
        let res = data.data
        if (res.status == "1") {
          res.data.forEach((val) => {
            val.isonEye = false
          })
          this.$set(this.$data, 'dataList', res.data)
        } else {
          this.noData = true
          // this.showToast({msg: res.statusDetail})
        }
      })
    }
  }
}
</script>
