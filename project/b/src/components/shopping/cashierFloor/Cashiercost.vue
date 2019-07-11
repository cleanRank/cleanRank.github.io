<template>
<section>
  <div class="info_box" v-if="byStagesDetail.length>0">
    <p class="flex cost_p noboeder_b">
      <span class="cell_0 cost_txt costct_txt">套餐服务费<b class="c_999">额度支付</b></span>
      <!-- 息费分离产品显示B6653，非息费显示B6636 -->
      <span class="cell_1 c_blue number_b cost_nums">{{byStagesDetail[0].xifeiflag == 1?((+byStagesDetail422[cutIndexs].B6653) + (+byStagesDetail422[cutIndexs].B6657) + (+byStagesDetail422[cutIndexs].B6630)).toFixed(2):((+byStagesDetail[cutIndexs].B6636) + (+byStagesDetail[cutIndexs].B6657) + (+byStagesDetail[cutIndexs].B6630)).toFixed(2)}}元</span>
    </p>
  </div>
  <div class="cost_box_model m16" v-if="byStagesDetail.length>0">
    <h6 class="cost_sub_title">以下为包含普惠网贷中介服务费及其他第三方专业机构服务的服务消费套餐，第三方专业机构服务非普惠提供，会员客户选择并认可并自愿采购支付。</h6>
    <p class="cost_content flex">
      <span class="cell_2 c_999">- 保障计划专款</span>
      <span class="cell_1 c_999 cost_num" >¥{{byStagesDetail[0].xifeiflag == 1?byStagesDetail422[cutIndexs].B6653:byStagesDetail[cutIndexs].B6636}}</span>
    </p>
    <p class="cost_content flex">
      <span class="cell_2 c_999">- 网贷信息技术服务费</span>
      <span class="cell_1 c_999 cost_num">¥{{byStagesDetail[0].xifeiflag == 1?byStagesDetail422[cutIndexs].B6657:byStagesDetail[cutIndexs].B6657}}</span>
    </p>
    <p class="cost_content flex">
      <span class="cell_2 c_999">- 信息咨询服务费</span>
      <span class="cell_1 c_999 cost_num">¥{{byStagesDetail[0].xifeiflag == 1?byStagesDetail422[cutIndexs].B6630:byStagesDetail[cutIndexs].B6630}}</span>
    </p>
  </div>
  <div class="info_box m16" v-if="byStagesDetail422.length>0">
    <p class="flex cost_p" @click="payTaye">
      <span class="cell_1 cost_txt costct_txt">使用服务额度支付</span>
      <span class="goPush"></span>
    </p>
  </div>
  <!--分期详情-->
  <ByStages v-if="byStagesDetail422.length>0" :cindex="cutIndexs" :byStagesDetail="byStagesDetails" @cutIndex="getcutIndex"></ByStages>
  <div class="agreement_wrap_box">
    <p class="c_999 agreement_ps">本人自愿消费向第三方担保机构支付保障计划专款，本人知悉上述保障计划专款及贷后服务费、仲裁对接技术服务费非收取服务用，系第三方服务套餐，本人自愿消费购买此服务！</p>
    <p class="agreement_ps no-yuan"><span>以上费用均由借款人自行承担</span></p>
  </div>
  <!-- 支付方式s -->
  <Paymentmethod v-if="isShowmode" :bankList="bankList" :isxifei="isxifei" :nextData="nextData" @byData="payTaye"></Paymentmethod>
  <!-- 支付方式e -->

  <div class="btn_wrap_cashier">
    <!-- (type==0&&bankNo==1) || (type==1&&isChecked) -->
    <a class="confirm_btn" :id="[byStagesDetail422.length>0?'nopo_btn':'']" href="javascript:;" @click="trueBtn">确认</a>
    <!-- <a class="confirm_btn hui" href="javascript:;" v-else id="hui">确认支付</a> -->
  </div>
</section>
</template>
<script>
import ByStages from './ByStages'
import mixin from 'components/detail/mixin'
import Paymentmethod from './Paymentmethod'
export default {
  mixins: [mixin],
  data () {
    return {
      byStagesDetail: [],
      byStagesDetail422: [],
      byStagesDetails: [],
      isShowmode: false,
      month: 0,
      isxifei: 0,
      cutIndexs: 0
    }
  },
  props: ['objData', 'nextData', 'bankList', 'cutIndex'],
  components: {
    ByStages,
    Paymentmethod
  },
  beforeDestroy () {
    $('.return').css({"display": "block"})
  },
  created () {
    this.cutIndexs = this.cutIndex
    this.byStagesDetail = this.objData.data || []
    this.byStagesDetail422 = this.objData.data422 || []
    this.byStagesDetails = this.objData.data422 || this.objData.data
    if (this.byStagesDetail.length>0) {
      this.month = this.byStagesDetail[this.cutIndexs].month
    }
    this.isxifei = this.objData.data[0].xifeiflag
    this.$nextTick(() => {
      $('.return').css({"display": "none"})
    })
  },
  methods: {
    trueBtn () {
      let cutIndex = this.cutIndexs
      let isGocost = '1'
      this.$emit('datas', {cutIndex, isGocost})
    },
    getcutIndex (data) {
      // 获取月数
      this.month = this.byStagesDetail[data].month
      this.cutIndexs = data
    },
    payTaye (data) {
      // 显示支付方式
      this.isShowmode = !this.isShowmode
    }
  }
}
</script>
<style media="screen" lang="scss" scoped>
  @import "../../../assets/scss/app";
  .cost_box_model{
    @include px2rem(padding, 30 30 6);
    background: #fff;
  }
  .agreement_wrap_box{
    @include px2rem(padding, 24 30 30);
  }
</style>
