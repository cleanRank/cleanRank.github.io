<template>
<section class="explain_txt_wraps">
  <div class='explain_txt_wrap'>
    <p class='explain_txt_title'>预估收入</p>
    <p class='explain_txt_conment c_777'>推广订单产生的购买返利。若订单产生以下情况，该订单不结算返利，所以为预估收入。<br>
    1、未发货产生退款的预估返利不进行结算；<br>
    2、已发货的订单，非平台原因产生退款的预估返利不进行结算</p>
  </div>
  <div class='explain_txt_wrap'>
    <p class='explain_txt_title'>今日预估收入</p>
    <p class='explain_txt_conment c_777'>当天 0 点至 24 点所产生的购买返利。</p>
  </div>
   <!-- <div class='explain_txt_wrap'>
    <p class='explain_txt_title'>当周预估收入</p>
    <p class='explain_txt_conment c_777'>当周周一至周日所产生的购买返利。</p>
  </div> -->
   <div class='explain_txt_wrap'>
    <p class='explain_txt_title'>当月预估收入</p>
    <p class='explain_txt_conment c_777'>当月月初至月末所产生的购买返利。</p>
  </div>
   <div class='explain_txt_wrap'>
    <p class='explain_txt_title'>可提现余额</p>
    <p class='explain_txt_conment c_777'>可提现余额是指目前账户里的可以提现的金额，包含已经成交的订单返利，并减去您已经提现的金额。
确认收货 9 天后，预估返利将成为实际结算的返利，可自行提现。
提现金额最低为 1 元</p>
  </div>
   <div class='explain_txt_wrap'>
    <p class='explain_txt_title'>退款订单返利结算</p>
    <p class='explain_txt_conment c_777'>1、订单部分商品退款：退款金额小于订单实付金额，订单产生部分退款后，返利会将部分商品退款返利扣除，进行实际结算，实际结算部分可自行提现。
    <br>2、订单全部商品退款：退款金额等于订单实付金额，订单产生全部退款后，返利会将订单退款返利扣除。</p>
  </div>
   <div class='explain_txt_wrap'>
    <p class='explain_txt_title'>实际结算返利</p>
    <p class='explain_txt_conment c_777'>在订单确认收货 9 天后，该订单进行结算，实际结算返利将会去除掉退货商品返利。</p>
  </div>
</section>
</template>
<script>
import changeBg from '@/mixin/'
export default {
  mixins: [changeBg],
  created () {
    this.showLoad(false)
  }
}
</script>
