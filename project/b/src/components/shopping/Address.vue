<template>
  <section class="address_wrap" id="showListWrap">
    <ul class="addr_list">
      <li class="addr_item1 flex" v-for="(item,index) in selectedAddr" :key="index">
        <a class="cell_1 center_box js_choosed_addr" href="javascript:;" @click="bindEvent(item)">
          <!-- {{item.addresslabel?item.addresslabel:''}} -->
          <p class="addr_hd"><span class="tag"></span><span class="tag def" v-show="item.addDefault==1">默认</span></p>
          <p class="flex addr_txt"><span class="cell_1 name">{{item.consignee}}</span><span class="cell_1 tel">{{item.consigneeMobile}}</span></p>
          <p class="addr_txt">{{item.addProvince+item.addCity+item.addCounty+item.addTown+item.addDetail}}</p>
        </a>
        <a class="edit_adrr edge_box" href="javascript:void(0)" @click="bindEventNext(index)">编辑</a>
      </li>
    </ul>
    <div class="add_addr_wrap">
      <router-link tag="a" to="/newAddress" class="btnCom">新增地址</router-link>
    </div>
  </section>
</template>
<script>
  import { mapGetters, mapActions } from 'vuex'
  export default {
    data () {
      return {
        selectedAddr: [],
        selectedAddress: []
      }
    },
    created () {
      this.addressShow()
    },
    computed: {
      ...mapGetters({
        goodsInfo: "getGoodsInfo"
      })
    },
    methods: {
      ...mapActions([
        "updateGoodsInfo",
        "updateAddressInfo"
      ]),
      addressShow () {
        let { uid, token } = this.$store.state.userInfo
        this.$post({
          url: this.$store.state.api.QueryReceiptAddress,
          data: {
            uid: uid,
            token: token,
            defaultAdd: 0,
            pageNo: 1
          }
        }).then(data => {
          this.showLoad(false)
          let res = data.data
          if (res.status == "1") {
            this.$set(this.$data, 'selectedAddr', res.data)
          } else {
            this.showToast({msg: res.statusMessage})
          }
        })
      },
      bindEvent (val) {
        if (val) {
          this.selectedAddress = val
          this.updateGoodsInfo({selectedAddress: this.selectedAddress})
          window.history.go(-1)
        }
      },
      bindEventNext (items) {
        let list = this.selectedAddr[items]
        this.updateAddressInfo(list)
        this.$router.push('/newAddress')
      }
    }
  }
</script>
