<template>
<section class="apply_after_wrap" v-if="isLoding">
  <div class="apply_after_top bg">
    <GoodsBox :product="product"></GoodsBox>
  </div>
  <div class="buyer_address_box bg">
    <p class="as_title_box">买家收货地址<router-link to="/address" class="apply_as_btn yes_apply_btn">更换地址</router-link></p>
    <div class="conment_boxs">
      <p class="flex conment_txt"><span class="cell_0">收货人</span><b class="cell_1 c_777">{{progressDetail.consumerRecipientName}}</b></p>
      <p class="flex conment_txt"><span class="cell_0">联系电话</span><b class="cell_1 c_777">{{progressDetail.consumerRecipientPhone}}</b></p>
      <p class="flex conment_txt no_margin"><span class="cell_0">收货地址</span><b class="cell_1 c_777">{{progressDetail.consumerRecipientAddress}}</b></p>
    </div>
    <p class="refund_txt">该地址为您换货时接收商品的地址</p>
  </div>
  <div class="apply_num_box bg mar16">
    <p class="as_title_box no_border">是否收到货</p>
    <div class="apply_type_btn">
      <span :class="['js_btn', hasReceived == 1?'cur_btn':'']" @click="selectSh(1)">已收到</span><span :class="['js_btn', hasReceived == 0?'cur_btn':'']" @click="selectSh(0)">未收到</span>
    </div>
  </div>
  <div class="buyer_address_box bg" v-if="hasReceived==1">
    <p class="as_title_box">商家收货地址</p>
    <div class="conment_boxs">
      <p class="flex conment_txt"><span class="cell_0">收货人</span><b class="cell_1 c_777">{{progressDetail.merchantRecipientName}}</b></p>
      <p class="flex conment_txt"><span class="cell_0">联系电话</span><b class="cell_1 c_777">{{progressDetail.merchantRecipientPhone}}</b></p>
      <p class="flex conment_txt no_margin"><span class="cell_0">收货地址</span><b class="cell_1 c_777">{{progressDetail.merchantRecipientAddress}}</b></p>
    </div>
    <p class="refund_txt">请您按照该地址将商品寄回给商家</p>
  </div>
  <div class="apply_num_box bg logistics_wrap" v-if="hasReceived==1">
    <p class="flex logistics_company"><label class="cell_0 font14">物流公司</label><span class="cell_1 c_999 font14" @click="showCompressList">{{tabIndex==-1?'请选择物流公司':progressDetail.compressList[tabIndex].expressDesc}}</span></p>
    <p class="flex logistics_number"><label class="cell_0 font14">物流单号</label><input type="text" :disabled="tabIndex==-1" placeholder="请填写物流单号" class="cell_1 font14" v-model="expressCode"></p>
  </div>
  <div class="apply_num_box bg mar16">
    <p class="as_title_box no_border">备注</p>
    <div class="reason_explain_wrap">
      <textarea maxlength="500" class="reason_explain" v-model="remark"></textarea>
      <p class="num_box">{{remark.length>0?500-remark.length:0}}/500</p>
    </div>
  </div>
  <button class="btnCom apply_after_btn" @click="sendSubmit">确定</button>
  <Selects
  v-if="stagesFlag"
  :afterSaleReason="progressDetail.compressList"
  :tabindex = "tabIndex"
  @reasonType = "emitParenType"
  :title="'选择物流'"
  ></Selects>
</section>
</template>
<script>
import GoodsBox from 'components/afterSales/childCommon/GoodsBox'
import Selects from 'components/afterSales/childCommon/Selects'
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      isLoding: false,
      product: {},
      progressDetail: {},
      stagesFlag: false,
      tabIndex: -1,
      hasReceived: 1,
      consumerAddressNo: '',
      expressCode: '',
      remark: '' // 备注信息
    }
  },
  components: {
    GoodsBox,
    Selects
  },
  created () {
    this.showPage()
  },
  beforeRouteLeave (to, from, next) {
    if (to.name != "Address") {
      this.updateGoodsInfo({
        selectedAddress: ''
      })
    }
    next()
  },
  methods: {
    ...mapActions([
      "updateGoodsInfo"
    ]),
    selectSh (i) {
      // 判断是否收到货 1-是  0-否
      this.hasReceived = i
    },
    showCompressList () {
      this.stagesFlag = !this.stagesFlag
    },
    emitParenType (val) {
      // 获取售后原因
      this.tabIndex = val
      this.showCompressList()
    },
    showPage () {
      let {uid, token} = this.$store.state.userInfo
      return this.$post({
        url: this.$store.state.api.progressSend,
        data: {
          uid,
          token,
          serviceOrderId: this.$route.query.serviceOrderId || ''
        }
      }).then(data => {
        let res = data.data
        this.showLoad(false)
        this.isLoding = true
        if (res.status == "1") {
          let {productImage, productName, productPrice, consumerAddressNo} = res.data
          this.product = {
            productImage,
            productName,
            productPrice
          }
          if (this.$store.state.goodsInfo.selectedAddress) {
            let {addressNo, consignee, consigneeMobile, addProvince, addCity, addCounty, addTown, addDetail} = this.$store.state.goodsInfo.selectedAddress
            this.consumerAddressNo = addressNo // 地址编号
            res.data.consumerRecipientName = consignee
            res.data.consumerRecipientPhone = consigneeMobile
            res.data.consumerRecipientAddress = addProvince + addCity + addCounty + addTown + addDetail
          } else {
            this.consumerAddressNo = consumerAddressNo
          }
          this.$set(this.$data, 'progressDetail', res.data)
        } else {
          this.showToast({msg: res.statusMessage})
        }
      })
    },
    sendSubmit () {
      // 提交寄送商品信息
      if (this.hasReceived == 1) {
        if (this.tabIndex==-1) {
          this.showToast({msg: '请选择物流公司'})
          return false
        } else if (!this.expressCode) {
          this.showToast({msg: '请填写物流单号'})
          return false
        }
      }
      this.showLoad(true)
      let {uid, token} = this.$store.state.userInfo
      return this.$post({
        url: this.$store.state.api.sendSubmit,
        data: {
          uid,
          token,
          serviceOrderId: this.$route.query.serviceOrderId || '',
          hasReceived: this.hasReceived, // 是否收到货
          consumerAddressNo: this.consumerAddressNo, // 买家收货地址编号
          expressName: this.hasReceived == 1 ? this.progressDetail.compressList[this.tabIndex].expressKey : '', // 物流公司编码
          expressCode: this.expressCode, // 物流单号
          remark: this.remark // 备注
        }
      }).then(data => {
        let res = data.data
        this.showLoad(false)
        if (res.status == "1") {
          window.history.go(-1)
        } else {
          this.showToast({msg: res.statusMessage})
        }
      })
    }
  }
}
</script>
