<template>
<section>
  <div class="repayment_box">
    <div class="opa"></div>
    <div class="repayment_list">
      <p class="repayment_close font14" @click="closeBtn">支付方式</p>
      <div class="info_box m16">
        <p class="flex cost_p" @click="inPayment(1, $event)">
          <span class="cell_1 cost_txt costed_txt">{{!isxifei?'分期付款':'使用服务额度支付'}}</span>
          <span class="goPay" :class="{'checked_pay':type==1 || type==3}"></span>
        </p>
      </div>
      <div class="info_box m16">
        <p class="flex cost_p" @click="inPayment(0, $event)">
          <span class="cell_1 cost_txt">{{bankList.bankName}}({{bankList.bankCardNum.slice(bankList.bankCardNum.length-4)}})</span>
          <span class="goPay" :class="{'checked_pay':type==0 || type==2}"></span>
        </p>
      </div>
      <div class="btn_wrap_cashier" v-if="!isxifei">
        <a class="confirm_btn" href="javascript:;" @click="payment()">{{(type==0||type==4) ? '确认支付 '+nextData.actualAmount+'元' : '确认'}}</a>
      </div>
    </div>
  </div>
</section>
</template>
<script>
import mixin from 'components/shopping/mixin'
import detailmixin from 'components/detail/mixin'
export default {
  mixins: [mixin, detailmixin],
  data () {
    return {
      type: 1
    }
  },
  props: ['bankList', 'nextData', 'ishaveQuota', 'isxifei'],
  methods: {
    getQuota () {
      if (!this.ishaveQuota && !this.isxifei) {
          // 分期支付，校验额度
        this.checkUserStatus(1).then(() => {
          this.$emit('byData', this.type)
        })
      } else {
        this.$emit('byData', this.type)
      }
    },
    inPayment (type, e) {
      if (this.isxifei) {
        this.type = (type + 2)
        if (!type) {
          this.showToast({msg: '暂不支付使用银行卡支付，请使用服务额度支付'})
          return false
        }
      } else {
        this.type = type
      }
      if (type == 1) {
        this.getQuota()
      }
    },
    payment () {
      if (this.type == 1 || this.type == 3) {
        if (this.isxifei) {
          this.type = 3
        }
        // 分期支付，校验额度
        this.getQuota()
      } else {
        if (this.isxifei) {
          this.showToast({msg: '暂不支付使用银行卡支付，请使用服务额度支付'})
        } else if (this.nextData.fullpayment==0) {
          this.showToast({msg: '暂时只支持分期付款哦！'})
        } else {
           // 去连连支付
          return this.paymenInfo(this.type)
        }
      }
    },
    closeBtn () {
      this.$emit('byData', this.type)
    }
  }
}
</script>

<style media="screen" lang="scss" scoped>
  .cost_txt{
    background-size: 0.72rem 0.72rem !important;
  }
</style>
