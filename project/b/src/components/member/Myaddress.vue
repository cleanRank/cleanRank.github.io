<template>
  <section class="address_wrap" v-if="isLoding">
    <ul class="addr_list" id="showListWrap" v-if="addressJson&&addressJson!=''">
      <li class="addr_item" v-for="(item,index) in addressJson" :key="index">
        <div class="addr_info">
          <div class="flex addr_hd">
            <span class="cell_1 name">{{item.consignee}}</span>
            <span class="cell_1 tel">{{item.consigneeMobile}}</span>
            <!-- <span class="cell_0 tag bule" v-show="item.addresslabel">{{item.addresslabel}}</span> -->
          </div>
          <p class="addr_txt">{{item.addProvince+item.addCity+item.addCounty+item.addTown+item.addDetail}}</p>
        </div>
        <div class="flex addr_tool">
          <div class="cell_1">
            <label class="addr_radio" id="addr_checked" v-if="item.addDefault == 1"><span class="label">默认</span></label>
            <label class="addr_radio" v-else @click="setDefaultAddressBtn(item.addressNo,index)"><span class="label">默认</span></label>
          </div>
          <span class="edit_adrr" @click="bindEvent(index)">编辑</span>
          <!--<router-link class="edit_adrr" tag="a" :to="{ path: 'newAddress', query: { addressNo: item.addressNo}}" >编辑</router-link>-->
          <span class="del_adrr" @click="delAddressBtn(item.addressNo,index)">删除</span>
        </div>
      </li>
    </ul>
    <div v-else class="nodata_order">
      <img src="../../assets/icon/icon/blank_adress_icon.png">
      <p>暂时还没有收货地址哦~</p>
    </div>
    <div class="add_addr_wrap" :class="{'position_btn':addressJson.length==0}" v-if="addressJson.length<10">
      <router-link tag="a" to="/newAddress" class="btnCom">新增地址</router-link>
    </div>
  </section>
</template>
<script>
  import { mapGetters, mapActions } from 'vuex'
  export default {
    data () {
      return {
        addressJson: [],
        isSCrollLoading: 0,
        pageNo: 1,
        pageCount: 1,
        isLoding: false
      }
    },
    beforeRouteLeave (to, from, next) {
      $(window, document).unbind('scroll')
      next()
    },
    created () {
      this.showLoad(false)
      if (this.$store.state.userInfo.loginTokenWanKaState === 2) {
        this.myaddressList()
      } else {
        this.$store.watch(state => {
          return state.userInfo.loginTokenWanKaState
        }, (loginState) => {
          console.log('myaddress loginState', loginState)
          loginState === 2 && this.myaddressList()
        })
      }
      this.updateAddress()
    },
    computed: {
      ...mapGetters({
        addressInfo: "getAddressInfo"
      })
    },
    methods: {
      ...mapActions([
        "updateAddressInfo"
      ]),
      updateAddress () {
        this.$nextTick(() => {
          $(window, document).bind('scroll', () => {
            if (this.isBottom() && !this.isSCrollLoading) {
              this.pageNo = (+this.pageNo) + 1
              this.myaddressList(1)
            }
          })
        })
      },
      myaddressList (type) {
        if (this.pageNo == 1) {
          this.isSCrollLoading = 0
        }
        if (this.pageCount && this.pageCount < this.pageNo) {
          this.isSCrollLoading = 1
          return
        }
        let { uid, token } = this.$store.state.userInfo
        this.$post({
          url: this.$store.state.api.QueryReceiptAddress,
          data: {
            uid: uid,
            token: token,
            defaultAdd: 0,
            pageNo: this.pageNo
          }
        }).then(data => {
          this.isLoding = true
          let res = data.data
          if (res.status == "1") {
            this.pageNo = res.pageNo
            this.pageCount = res.pageCount
            if (!type) {
              this.$set(this.$data, 'addressJson', res.data)
            } else {
              this.addressJson = this.addressJson.concat(res.data)
            }
          } else {
            // this.showToast({msg: res.statusDetail})
          }
        })
      },
      delAddressBtn (num, idx) {
        let _t = this
        this.showDialog({
          title: '提示',
          msg: '确认删除地址吗？',
          rBtnText: '确定',
          lBtnText: '取消',
          confCallBack () {
            _t.showLoad(true)
            _t.delAddress(num, idx)
          }
        })
      },
      delAddress (nums, idx) {
        let { uid, token } = this.$store.state.userInfo
        this.$post({
          url: this.$store.state.api.DelReceiptAddress,
          data: {
            uid: uid,
            token: token,
            addressNo: nums
          }
        }).then(data => {
          this.showLoad(false)
          let res = data.data
          if (res.status == "1") {
            this.addressJson.splice(idx, 1)
          } else {
            this.showToast({msg: res.statusMessage})
          }
        })
      },
      setDefaultAddressBtn (num, idx) {
        let _t = this
        this.showDialog({
          title: '提示',
          msg: '确定修改默认地址吗？',
          rBtnText: '确定',
          lBtnText: '取消',
          confCallBack () {
            _t.showLoad(true)
            _t.setDefaultAddress(num, idx)
          }
        })
      },
      setDefaultAddress (num, idx) {
        let { uid, token } = this.$store.state.userInfo
        this.$post({
          url: this.$store.state.api.updateadddefault,
          data: {
            uid: uid,
            token: token,
            addressNo: num
          }
        }).then(data => {
          let res = data.data
          this.showLoad(false)
          if (res.status == "1") {
            let newArr = this.addressJson[idx]
            this.addressJson.forEach(i => {
              i.addDefault = 2
            })
            this.addressJson[idx].addDefault = 1
            this.addressJson.splice(idx, 1)
            this.addressJson.unshift(newArr)
          } else {
            this.showToast({msg: res.statusMessage})
          }
        })
      },
      bindEvent (items) {
        let list = this.addressJson[items]
        this.updateAddressInfo(list)
        this.$router.push('/newAddress')
      },
      isBottom () {
        if ((document.body.scrollTop || document.documentElement.scrollTop) + document.documentElement.clientHeight >= document.body.scrollHeight) {
          return 1
        } else {
          return 0
        }
      }
    }
  }
</script>
<style media="screen" lang="scss">
  #addr_checked{
  &:before {
     background: url("../../assets/icon/member/radio_checked_bg.png") no-repeat center;
     background-size: 70% auto;
     border-color: #62c8fe;
   }
  .label {
    background-color: #62c8fe;
    }
  }
  .addr_hd .bule{ background: #62c8fe}
  .position_btn{
    width: 100%;
    position: absolute;
    bottom: 0.2rem;
  }
</style>
