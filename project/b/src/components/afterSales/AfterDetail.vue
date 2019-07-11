<template>
<section class="after_detail_wrap" v-if="isLoding">
  <div class="flex after_detail_top">
    <p class="cell_1 after_detail_type">
      <span class="font13">售后类型<b>{{progressDetail.typeDesc}}</b></span>
      <span class="font13" v-if="progressDetail.type != 2 && progressDetail.refundAmount">退款金额<b class="c_red">¥{{progressDetail.refundAmount}}</b></span>
      <span v-else></span>
    </p>
    <div class="cell_0 font14 c_blue after_detail_status">{{progressDetail.statusDesc}}</div>
  </div>
  <div class="ad_product_box bg">
    <div class="after_detail_type ad_order">
      <span>售后单号<b>{{progressDetail.serviceOrderId}}</b></span>
      <span>申请时间<b>{{progressDetail.createDate}}</b></span>
    </div>
    <GoodsBox :product="product"></GoodsBox>
  </div>
  <div class="buyer_address_box bg hhwld_box" v-if="progressDetail.showLogistics==1">
    <p class="as_title_box">换货物流单号</p>
    <div class="conment_boxs">
      <p class="flex conment_txt"><span class="cell_1">{{progressDetail.expressName}}</span></p>
      <p class="flex conment_txt no_margin"><span class="cell_1">物流单号：{{progressDetail.expressCode}}</span></p>
      <router-link :to="{ path: 'logistics', query: {orderId: progressDetail.serviceOrderId, type: 4} }" class="apply_as_btn yes_apply_btn">物流查询</router-link>
    </div>
  </div>
  <div class="buyer_address_box bg" v-if="progressDetail.type == 2">
    <p class="as_title_box">买家收货地址</p>
    <div class="conment_boxs">
      <p class="flex conment_txt"><span class="cell_0">收货人</span><b class="cell_1 c_777">{{progressDetail.recipientName}}</b></p>
      <p class="flex conment_txt"><span class="cell_0">联系电话</span><b class="cell_1 c_777">{{progressDetail.recipientPhone}}</b></p>
      <p class="flex conment_txt no_margin"><span class="cell_0">收货地址</span><b class="cell_1 c_777">{{progressDetail.recipientAddress}}</b></p>
    </div>
  </div>
  <div class="buyer_address_box bg" v-if="progressDetail.reasonDescription || (progressDetail.imageList && progressDetail.imageList.length > 0)">
    <p class="as_title_box">买家问题描述</p>
    <p class="describe_txt c_999 font14" v-text="progressDetail.reasonDescription"></p>
    <div class="flex describe_img_list" v-if="progressDetail.imageList && progressDetail.imageList.length > 0">
      <p class="describe_img_box cell_0" v-for="(item, i) in progressDetail.imageList" :key="i"><img :src="item"></p>
    </div>
  </div>
  <div class="schedule_query_box position_btn_wrap">
    <router-link tag="span"
     :to="{ path: 'sendGoods', query: {serviceOrderId: progressDetail.serviceOrderId} }"
     class="js_btn" v-if="progressDetail.showSendGoodsButton==1">寄送商品</router-link><span class="js_btn" v-if="progressDetail.showCancelButton==1" @click="bindCancel">取消申请</span><router-link tag="span" :to="{path: 'Progress', query: {serviceOrderId: progressDetail.serviceOrderId}}" class="js_btn">进度查询</router-link>
  </div>
</section>
</template>
<script>
import GoodsBox from 'components/afterSales/childCommon/GoodsBox'
import mixin from 'components/afterSales/mixin'
export default {
  mixins: [mixin],
  data () {
    return {
      progressDetail: {},
      isLoding: false,
      product: {},
      status: 1
    }
  },
  components: {
    GoodsBox
  },
  created () {
    this.showPage()
  },
  methods: {
    bindCancel () {
      // 取消申请
      let _this = this
      this.showDialog({
        title: '取消确认',
        msg: '确认取消申请售后吗？',
        rBtnText: '确定',
        lBtnText: '取消',
        confCallBack: () => {
          _this.cancelApply(this.$route.query.serviceOrderId).then(() => {
            if (this.status == "1") {
              this.showPage()
            }
          })
        }
      })
    },
    showPage () {
      let {uid, token} = this.$store.state.userInfo
      return this.$post({
        url: this.$store.state.api.progressDetail,
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
          let {productImage, productName, productPrice, aftersaleProductCnt} = res.data
          this.product = {
            productImage,
            productName,
            productPrice,
            aftersaleProductCnt
          }
          this.$set(this.$data, 'progressDetail', res.data)
        } else {
          this.showToast({msg: res.statusMessage})
        }
      })
    }
  }
}
</script>
